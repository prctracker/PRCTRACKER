"""TabNet CNES (Recursos Humanos) queries, same method as the state reports:
physicians = every option of the 'Médicos' filter (CBO 225 and 2231 groups), by município and SUS / non-SUS."""
import html, re, time, urllib.parse, urllib.request

def enc(s):
    out = []
    for ch in s:
        c = ord(ch)
        if re.match(r'[A-Za-z0-9_.*\-]', ch): out.append(ch)
        elif ch == ' ': out.append('+')
        elif c < 256: out.append('%%%02X' % c)
        else: out.append(urllib.parse.quote(ch))
    return ''.join(out)

def form(uf):
    url = f'http://tabnet.datasus.gov.br/cgi/deftohtm.exe?cnes/cnv/prid02{uf}.def'
    s = urllib.request.urlopen(url, timeout=120).read().decode('iso-8859-1')
    arqs = re.findall(r'<option[^>]*value="(pf' + uf + r'\d{4}\.dbf)"', s, re.I)
    m = re.search(r'<select[^>]*name="SM[^"]*dicos"[^>]*>(.*?)</select>', s, re.S | re.I)
    meds = [v for v, _ in re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)', m.group(1), re.I) if v not in ('', 'TODAS_AS_CATEGORIAS__')]
    return arqs, meds

def tab(uf, linha, coluna, filters=None, arq=None):
    url = f'http://tabnet.datasus.gov.br/cgi/tabcgi.exe?cnes/cnv/prid02{uf}.def'
    body = f'Linha={enc(linha)}&Coluna={enc(coluna)}&Incremento=Quantidade&Arquivos={arq}'
    for k, vals in (filters or {}).items():
        for v in vals: body += f'&{enc(k)}={enc(v)}'
    body += '&formato=prn&mostre=Mostra'
    err = None
    for k in range(4):
        try:
            req = urllib.request.Request(url, data=body.encode('ascii'), headers={'Content-Type': 'application/x-www-form-urlencoded'})
            txt = urllib.request.urlopen(req, timeout=180).read().decode('iso-8859-1')
            m = re.search(r'<pre[^>]*>(.*?)</pre>', txt, re.S | re.I)
            if m: return html.unescape(m.group(1)).strip()
            err = RuntimeError('TabNet sem tabela')
        except Exception as e:
            err = e
        time.sleep(5 + 5 * k)
    raise err

def parse(t):
    L = [l for l in t.split('\n') if l.startswith('"')]
    h = [x.replace('"', '').strip() for x in L[0].split(';')]
    rows = []
    for l in L[1:]:
        p = l.split(';')
        rows.append([p[0].replace('"', '').strip()] + [0 if x.strip() in ('-', '') else int(float(x)) for x in p[1:]])
    return h, rows

MAP = [('Clínico geral', ['Médico Clínico']), ('Médico da ESF (família)', ['Médico da estratégia de Saúde da Família', 'Médico de família e comunidade']), ('Pediatra', ['Médico Pediatra']),
       ('Ginecologista obstetra', ['Médico Ginecologista Obstetra']), ('Residente', ['Médico residente']), ('Ortopedista', ['Médico ortopedista e traumatologista']), ('Cirurgião geral', ['Médico Cirurgião Geral']),
       ('Anestesiologista', ['Médico Anestesiologista']), ('Cardiologista', ['Médico cardiologista']), ('Radiologista', ['Médico em radiologia e diagnóstico por imagem']), ('Oftalmologista', ['Médico oftalmologista']),
       ('Psiquiatra', ['Médico psiquiatra']), ('Neurologista', ['Médico neurologista']), ('Generalista', ['Médico Generalista Alopata']), ('Dermatologista', ['Médico dermatologista']), ('Nefrologista', ['Médico nefrologista']),
       ('Otorrinolaringologista', ['Médico otorrinolaringologista']), ('Urologista', ['Médico urologista']), ('Infectologista', ['Médico infectologista']), ('Gastroenterologista', ['Médico gastroenterologista']),
       ('Endocrinologista', ['Médico endocrinologista e metabologista']), ('Oncologista clínico', ['Médico oncologista clínico']), ('Médico em medicina intensiva', ['Médico em medicina intensiva'])]

def municipios(uf, arq, meds):
    h, rows = parse(tab(uf, 'Município', 'Atende_no_SUS', {'SMédicos': meds}, arq))
    i_sim, i_tot = h.index('Sim'), h.index('Total')
    return {r[0][:6]: {'med': r[i_tot], 'med_sus': r[i_sim]} for r in rows if r[0][:6].isdigit()}

def especialidades(uf, arq, meds):
    h, rows = parse(tab(uf, 'Médicos', 'Atende_no_SUS', {'SMédicos': meds}, arq))
    i_sim, i_nao = h.index('Sim'), h.index('Não')
    E = {r[0]: (r[i_sim], r[i_nao]) for r in rows}
    out = []
    for k, srcs in MAP:
        s = sum(E.get(x, (0, 0))[0] for x in srcs); n = sum(E.get(x, (0, 0))[1] for x in srcs)
        out.append({'especialidade': k, 'sus': s, 'nao_sus': n, 'total': s + n})
    return out

def total(uf, arq, meds):
    h, rows = parse(tab(uf, 'Atende_no_SUS', '--Não-Ativa--', {'SMédicos': meds}, arq))
    return [r for r in rows if r[0].startswith('Total')][0][1]
