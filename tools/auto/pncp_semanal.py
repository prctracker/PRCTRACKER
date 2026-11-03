"""Weekly PNCP + news sweep for the states with a report.
Writes src/_auto/{valores,contratos,noticias,atualizacoes}.json. Nothing here changes the reports' own datasets:
the site lists these rows as 'novidades' found by keyword, with the PNCP or news link of each one."""
import html, re, sys, time, urllib.parse, xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from comum import *

MAX_ITENS = 15
MODALIDADES = {12: 'Credenciamento', 9: 'Inexigibilidade', 8: 'Dispensa', 6: 'Pregão eletrônico'}
hoje = agora().date()
estado = ler(os.path.join(AUTO, 'estado.json'), {})
ini = datetime.strptime(estado.get('pncp_ate', (hoje - timedelta(days=8)).isoformat()), '%Y-%m-%d').date() + timedelta(days=1)
if len(sys.argv) > 1: ini = datetime.strptime(sys.argv[1], '%Y-%m-%d').date()
fim = hoje
if ini > fim: ini = fim
d8 = lambda d: d.strftime('%Y%m%d')
print('janela', ini, fim)

valores = ler(os.path.join(AUTO, 'valores.json'), [])
contratos = ler(os.path.join(AUTO, 'contratos.json'), [])
noticias = ler(os.path.join(AUTO, 'noticias.json'), [])
upd = ler(os.path.join(AUTO, 'atualizacoes.json'), [])
vk = {(r['controle_pncp'], r.get('item')) for r in valores}
ck = {r['controle_pncp'] for r in contratos}
nk = {r['url'] for r in noticias}
por = {uf: {'novos_valores': 0, 'novos_contratos': 0, 'novas_noticias': 0} for uf in UFS}
erros = []

# 1. Editais and credenciamentos by state and modality (window of up to 90 days per request).
for uf, (sig, nome, _) in UFS.items():
    for mod, mnome in MODALIDADES.items():
        p = 1
        while True:
            try:
                d = get_json(f'https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial={d8(ini)}&dataFinal={d8(fim)}&codigoModalidadeContratacao={mod}&uf={sig}&pagina={p}&tamanhoPagina=50')
            except Exception as e:
                erros.append(f'PNCP {sig} {mnome}: {e}'); break
            if not d: break
            for c in d.get('data') or []:
                obj = c.get('objetoCompra') or ''
                if not e_servico_medico(obj + ' ' + (c.get('informacaoComplementar') or '')): continue
                cnpj = c['orgaoEntidade']['cnpj']; ano = c['anoCompra']; seq = c['sequencialCompra']
                ctrl = c['numeroControlePNCP']; url = f'https://pncp.gov.br/app/editais/{cnpj}/{ano}/{seq}'
                base = dict(uf=sig, data=(c.get('dataPublicacaoPncp') or '')[:10], municipio=(c.get('unidadeOrgao') or {}).get('municipioNome'),
                            orgao=c['orgaoEntidade'].get('razaoSocial'), modalidade=mnome, controle_pncp=ctrl, url=url, base='Estimado',
                            coletado_em=hoje.isoformat(), origem='Varredura semanal do PNCP (filtro por palavras-chave)')
                itens = None
                try:
                    itens = get_json(f'https://pncp.gov.br/api/pncp/v1/orgaos/{cnpj}/compras/{ano}/{seq}/itens?pagina=1&tamanhoPagina=500', tentativas=3)
                except Exception:
                    itens = None
                linhas = []
                if isinstance(itens, list):
                    bons = [it for it in itens if e_servico_medico(it.get('descricao') or '') and not EXCLUI.search(norm(obj))]
                    for it in bons[:MAX_ITENS]:
                        linhas.append(dict(base, item=it.get('numeroItem'), descricao=re.sub(r'<[^>]+>', ' ', it.get('descricao') or '').strip(), quantidade=it.get('quantidade'),
                                           unidade=it.get('unidadeMedida'), valor=it.get('valorUnitarioEstimado'), valor_hora=None,
                                           observacao=(f'Mostrando {MAX_ITENS} de {len(bons)} itens deste edital; os demais estão no link.' if len(bons) > MAX_ITENS else None)))
                if not linhas:
                    linhas.append(dict(base, item=None, descricao=obj, quantidade=None, unidade=None, valor=None, valor_hora=None,
                                       observacao='Itens não lidos; valor total estimado do edital: ' + (str(c.get('valorTotalEstimado')) if c.get('valorTotalEstimado') else 'não informado')))
                for r in linhas:
                    k = (r['controle_pncp'], r.get('item'))
                    if k in vk: continue
                    vk.add(k); valores.append(r); por[uf]['novos_valores'] += 1
                time.sleep(0.5)
            if p >= (d.get('totalPaginas') or 1): break
            p += 1; time.sleep(1)

# 2. Contracts: the consulta API has no state filter, so read every contract published each day and keep the 5 states.
sigs = {v[0]: k for k, v in UFS.items()}
dia = ini
while dia <= fim:
    p = 1
    while True:
        try:
            d = get_json(f'https://pncp.gov.br/api/consulta/v1/contratos?dataInicial={d8(dia)}&dataFinal={d8(dia)}&pagina={p}&tamanhoPagina=500')
        except Exception as e:
            erros.append(f'PNCP contratos {dia}: {e}'); break
        if not d: break
        for c in d.get('data') or []:
            u = (c.get('unidadeOrgao') or {}).get('ufSigla')
            if u not in sigs or not e_servico_medico(c.get('objetoContrato')): continue
            ctrl = c['numeroControlePNCP']
            if ctrl in ck: continue
            cnpj = c['orgaoEntidade']['cnpj']; m = re.search(r'-(\d+)/(\d{4})$', ctrl)
            pj = c.get('tipoPessoa') == 'PJ'
            contratos.append(dict(uf=u, data=(c.get('dataPublicacaoPncp') or '')[:10], municipio=c['unidadeOrgao'].get('municipioNome'), orgao=c['orgaoEntidade'].get('razaoSocial'),
                                  fornecedor=c.get('nomeRazaoSocialFornecedor') if pj else 'Pessoa física', cnpj=c.get('niFornecedor') if pj else '', tipo_pessoa=c.get('tipoPessoa'),
                                  objeto=c.get('objetoContrato'), valor_global=c.get('valorGlobal'), inicio=c.get('dataVigenciaInicio'), fim=c.get('dataVigenciaFim'),
                                  controle_pncp=ctrl, url=f'https://pncp.gov.br/app/contratos/{cnpj}/{m.group(2)}/{int(m.group(1))}' if m else '',
                                  coletado_em=hoje.isoformat(), origem='Varredura semanal do PNCP (filtro por palavras-chave)'))
            ck.add(ctrl); por[sigs[u]]['novos_contratos'] += 1
        if p >= (d.get('totalPaginas') or 1): break
        p += 1; time.sleep(1)
    dia += timedelta(days=1)

# 3. News: Google Notícias, last 30 days, title + outlet + link (no summary is written by the robot).
oficiais = set()
for uf in UFS:
    for n in ler(os.path.join(SRC, uf, 'data', 'noticias.json'), []): oficiais.add(n.get('url'))
for uf, (sig, nome, _) in UFS.items():
    q = urllib.parse.quote(f'("falta de médicos" OR "plantão médico" OR "médicos" escala) "{nome}" when:30d')
    try:
        req = urllib.request.Request(f'https://news.google.com/rss/search?q={q}&hl=pt-BR&gl=BR&ceid=BR:pt-419', headers={'User-Agent': 'Mozilla/5.0'})
        xml = urllib.request.urlopen(req, timeout=60).read()
        root = ET.fromstring(xml)
    except Exception as e:
        erros.append(f'Notícias {sig}: {e}'); continue
    for it in root.iter('item'):
        link = it.findtext('link'); titulo = html.unescape(it.findtext('title') or ''); fonte = it.findtext('source') or ''
        if not link or link in nk or link in oficiais: continue
        t = norm(titulo)
        if not re.search(r'medic|plant', t): continue
        try:
            dt = datetime.strptime(it.findtext('pubDate'), '%a, %d %b %Y %H:%M:%S %Z').date()
        except Exception:
            continue
        if dt < hoje - timedelta(days=30): continue
        titulo = re.sub(r'\s+-\s+' + re.escape(fonte) + r'$', '', titulo) if fonte else titulo
        noticias.append(dict(uf=sig, data=dt.isoformat(), local=nome, tema='Notícia encontrada automaticamente', resumo=titulo, veiculo=fonte, url=link, coletado_em=hoje.isoformat()))
        nk.add(link); por[uf]['novas_noticias'] += 1

# Keep the lists short: 120 days of editais/contracts, 60 days of news.
corte = (hoje - timedelta(days=120)).isoformat(); corte_n = (hoje - timedelta(days=60)).isoformat()
valores = [r for r in valores if (r.get('data') or '') >= corte]
contratos = [r for r in contratos if (r.get('data') or '') >= corte]
noticias = [r for r in noticias if (r.get('data') or '') >= corte_n]
tot = {k: sum(v[k] for v in por.values()) for k in ('novos_valores', 'novos_contratos', 'novas_noticias')}
status = 'Concluída' if not erros else ('Parcial' if any(tot.values()) or len(erros) < 10 else 'Falhou')
upd.insert(0, dict(data=iso(), tipo='PNCP e notícias (semanal)', status=status, janela=f'{ini.isoformat()} a {fim.isoformat()}',
                   resumo=f"{tot['novos_valores']} itens de edital, {tot['novos_contratos']} contratos e {tot['novas_noticias']} notícias novas",
                   observacoes='; '.join(erros[:5]), por_estado=por))
upd = upd[:60]
gravar(os.path.join(AUTO, 'valores.json'), valores, 1); gravar(os.path.join(AUTO, 'contratos.json'), contratos, 1)
gravar(os.path.join(AUTO, 'noticias.json'), noticias, 1); gravar(os.path.join(AUTO, 'atualizacoes.json'), upd, 1)
if status != 'Falhou':
    estado['pncp_ate'] = fim.isoformat()
gravar(os.path.join(AUTO, 'estado.json'), estado, 1)
print(status, tot, por, erros[:5])
