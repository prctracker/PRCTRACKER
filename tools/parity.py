"""Compare the four state dashboards: sections, cards, KPI tiles, charts, table columns and datasets."""
import json, os, re, glob
SP = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
UFS = ['al', 'to', 'rr', 'rs', 'ro']
def clean(t): return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', t)).strip()
def norm(t):
    t = clean(t)
    for a in ['SESAU-AL', 'SESAU-RR', 'SES-TO', 'SES-RS', 'SESAU', 'SES']: t = t.replace(a, 'SES')
    return t
out = {}
for uf in UFS:
    s = open(os.path.join(SP, 'src', uf, 'index.html'), encoding='utf-8').read()
    secs = re.findall(r'<section class="tm-sec" id="([^"]+)"', s)
    d = {'datasets': sorted(f[:-5] for f in os.listdir(os.path.join(SP, 'src', uf, 'data')))}
    for i, sec in enumerate(secs):
        a = s.find(f'id="{sec}"'); b = s.find('<section class="tm-sec"', a + 5); b = len(s) if b < 0 else b
        part = s[a:b]
        d[sec] = {'cards': [norm(x) for x in re.findall(r'<h3 class="tm-card-h">(.*?)</h3>', part)],
                  'kpis': [norm(x) for x in re.findall(r'<span class="tm-kpi-l">(.*?)</span><span class="tm-kpi-v', part)],
                  'draws': sorted(set(re.findall(r'data-draw="([a-z_]+)"', part)) - {'val', 'lim'}),
                  'cols': [re.findall(r'data-field="([a-z_0-9]+)"', t) for t in re.findall(r'<thead>(.*?)</thead>', part, re.S)]}
    d['secs'] = secs
    out[uf] = d
print('SECTIONS'); [print(' ', uf, out[uf]['secs']) for uf in UFS]
print('DATASETS'); [print(' ', uf, out[uf]['datasets']) for uf in UFS]
allsec = []
for uf in UFS:
    for x in out[uf]['secs']:
        if x not in allsec: allsec.append(x)
for sec in allsec:
    print('\n=== section', sec)
    for k in ['cards', 'kpis', 'draws', 'cols']:
        for uf in UFS:
            v = out[uf].get(sec, {}).get(k, 'ABSENT')
            print(f'  {k:5} {uf}: {v}')
