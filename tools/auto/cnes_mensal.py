"""Monthly CNES update for the states with a report (same method as the reports):
- TabNet RH: physicians per município (total and SUS) and by specialty, newest competência available;
- September competências are added to the yearly series;
- CNES per establishment: physicians and links in each hospital/UPA of the report (deactivated units leave the list).
A state is only changed when its numbers pass the checks below; otherwise the run is logged as failed for it."""
import re, sys, time
from concurrent.futures import ThreadPoolExecutor
from comum import *
import tabnet

FORCAR = '--forcar' in sys.argv
SO = next((a.split('=', 1)[1].split(',') for a in sys.argv if a.startswith('--so=')), None)
if SO: UFS = {k: v for k, v in UFS.items() if k in SO}
MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
lbl = lambda c: f"{MES[int(c[5:7]) - 1]}/{c[:4]}"
HDR = {'Accept': 'application/json', 'Referer': 'https://cnes.datasus.gov.br/pages/estabelecimentos/consulta.jsp', 'User-Agent': 'atlas-medico-prctracker/1.0'}
K = ['estatutario', 'temporario', 'pj', 'autonomo_pf', 'clt', 'cooperado', 'residente', 'outros']

def cat(k):
    if re.search('ESTATUTARIO|COMISSIONADO', k): return 'estatutario'
    if re.search('TEMPOR', k): return 'temporario'
    if re.search('JURIDICA', k): return 'pj'
    if re.search('PESSOA FISICA', k): return 'autonomo_pf'
    if re.search('CELETISTA', k): return 'clt'
    if re.search('COOPERADO', k): return 'cooperado'
    if re.search('RESID|BOLS', k): return 'residente'
    return 'outros'

def cnes_get(path):
    import json as _j, urllib.request as _u
    err = None
    for k in range(4):
        try:
            with _u.urlopen(_u.Request('https://cnes.datasus.gov.br/services/' + path, headers=HDR), timeout=90) as r:
                return _j.loads(r.read().decode('utf-8'))
        except Exception as e:
            err = e; time.sleep(3 + 3 * k)
    raise err

def unidade(h):
    i = h['ibge6'] + h['cnes']
    d = cnes_get('estabelecimentos/' + i); p = cnes_get('estabelecimentos-profissionais/' + i)
    med = [x for x in p if re.match(r'^(225|2231)', x.get('cbo') or '')]
    c = dict.fromkeys(K, 0); inter = 0
    for x in med:
        k = ' | '.join([x.get('vinculacao') or '', x.get('vinculo') or '', x.get('subVinculo') or ''])
        c[cat(k)] += 1
        if k.startswith('INTERMEDIADO'): inter += 1
    return dict(desativada=bool(d.get('coMotivoDesab')), medicos=len({x.get('cns') or x.get('nome') for x in med}),
                medicos_sus=len({x.get('cns') or x.get('nome') for x in med if x.get('tpSusNaoSus') == 'S'}), vinculos=len(med),
                ch_semanal=sum((x.get('chAmb') or 0) + (x.get('chHosp') or 0) + (x.get('chOutros') or 0) for x in med), intermediado=inter, **c)

def meta_upd(uf, ds, desc_sub=None, extra=None):
    p = os.path.join(SRC, uf, 'datasets', ds + '.json'); m = ler(p)
    if desc_sub: m['description'] = desc_sub(m['description'])
    m['updated'] = {'at': iso(), 'by': 'Atualização automática mensal'}
    if extra: m.update(extra)
    gravar(p, m, 2)

upd = ler(os.path.join(AUTO, 'atualizacoes.json'), [])
log = {}
for uf, (sig, nome, _) in UFS.items():
    try:
        arqs, meds = tabnet.form(uf)
        comp = '20' + arqs[0][4:6] + '-' + arqs[0][6:8]
        mm = ler(os.path.join(SRC, uf, 'datasets', 'municipios.json'))
        serie = ler(os.path.join(SRC, uf, 'data', 'serie.json'))
        atual = mm.get('competencia') or serie[-1]['competencia']
        if comp <= atual and not FORCAR:
            log[uf] = f'sem competência nova (CNES {lbl(atual)})'; continue
        mun = ler(os.path.join(SRC, uf, 'data', 'municipios.json'))
        M = tabnet.municipios(uf, arqs[0], meds)
        novo, velho = sum(v['med'] for v in M.values()), sum(r['med'] for r in mun)
        if not M or novo == 0 or abs(novo / velho - 1) > 0.15:
            raise RuntimeError(f'total de médicos fora do esperado ({velho} → {novo}); nada foi alterado')
        for r in mun:
            v = M.get(r['id'][:6], {'med': 0, 'med_sus': 0})
            r['med'], r['med_sus'] = v['med'], v['med_sus']
            r['dens'] = round(r['med'] / r['pop'] * 1000, 2); r['dens_sus'] = round(r['med_sus'] / r['pop'] * 1000, 2)
            r['hab_por_med'] = round(r['pop'] / r['med']) if r['med'] else None
        E = tabnet.especialidades(uf, arqs[0], meds)
        if comp.endswith('-09') and comp not in [s['competencia'] for s in serie]:
            serie.append({'competencia': comp, 'medicos': novo})
        # hospitals and UPAs of the report, establishment by establishment
        hosp = ler(os.path.join(SRC, uf, 'data', 'hospitais.json')); nh = 'mantidos como estavam'
        try:
            with ThreadPoolExecutor(4) as ex: res = list(ex.map(unidade, hosp))
            fora = [h['unidade'] for h, r in zip(hosp, res) if r['desativada']]
            nova = []
            for h, r in zip(hosp, res):
                if r['desativada']: continue
                for k in ['medicos', 'medicos_sus', 'vinculos', 'ch_semanal', 'intermediado'] + K:
                    if k in h or k in ('intermediado', 'outros'): h[k] = r[k]
                nova.append(h)
            hosp = nova
            nh = f'{len(hosp)} unidades atualizadas' + (f'; desativadas no CNES: {", ".join(fora)}' if fora else '')
            ok_h = True
        except Exception as e:
            ok_h = False; nh = f'consulta por estabelecimento falhou ({e}); números das unidades mantidos'
        cnt = {}
        for h in hosp: cnt[h['ibge6']] = cnt.get(h['ibge6'], 0) + 1
        for r in mun: r['n_unid'] = cnt.get(r['id'][:6], 0)
        gravar(os.path.join(SRC, uf, 'data', 'municipios.json'), mun)
        gravar(os.path.join(SRC, uf, 'data', 'especialidades.json'), E)
        gravar(os.path.join(SRC, uf, 'data', 'serie.json'), serie)
        sub = lambda d: re.sub(r'compet[eê]ncia [a-z]{3}/\d{4}', f'competência {lbl(comp)}', d)
        meta_upd(uf, 'municipios', sub, {'competencia': comp}); meta_upd(uf, 'especialidades', sub)
        if comp.endswith('-09'): meta_upd(uf, 'serie')
        if ok_h:
            gravar(os.path.join(SRC, uf, 'data', 'hospitais.json'), hosp)
            meta_upd(uf, 'hospitais', lambda d: re.sub(r'\(consulta em [^)]*\)', f'(consulta em {agora().strftime("%d/%m/%Y")})', d))
        log[uf] = f'CNES {lbl(comp)}: {novo} médicos (antes {velho}); {nh}'
    except Exception as e:
        log[uf] = f'falhou: {e}'
    print(uf, log[uf], flush=True)

falhas = [u for u, v in log.items() if v.startswith('falhou')]
upd.insert(0, dict(data=iso(), tipo='CNES (mensal)', status='Concluída' if not falhas else ('Falhou' if len(falhas) == len(log) else 'Parcial'),
                   resumo='; '.join(f'{UFS[u][0]}: {v}' for u, v in log.items()), observacoes=''))
gravar(os.path.join(AUTO, 'atualizacoes.json'), upd[:60], 1)
