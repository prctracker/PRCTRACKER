"""Local QA: serve dist/, open every page in headless Chrome (desktop and phone width),
collect console errors, count unfilled placeholders, and exercise the team form against an
in-memory stand-in for the artifact database."""
import json
import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST = os.path.join(ROOT, 'dist')
SHOTS = os.path.join(ROOT, 'shots')
os.makedirs(SHOTS, exist_ok=True)
PORT = 8797
srv = subprocess.Popen([sys.executable, os.path.join(os.path.dirname(__file__), 'serve.py'), DIST, str(PORT)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)

MOCK = r"""
(() => {
  const store = {};
  const subs = {};
  const snap = (col) => ({ docs: Object.entries(store[col] || {}).map(([id, d]) => ({ id, exists: true, data: () => JSON.parse(JSON.stringify(d)) })), size: Object.keys(store[col] || {}).length });
  const emit = (col) => (subs[col] || []).forEach((f) => setTimeout(() => f(snap(col)), 5));
  let n = 0;
  const db = {
    collection(col) {
      return {
        onSnapshot(next) { (subs[col] = subs[col] || []).push(next); setTimeout(() => next(snap(col)), 30); return () => {}; },
        async add(d) { const id = 'doc' + (++n); (store[col] = store[col] || {})[id] = d; emit(col); return { id }; },
        doc(id) { return { async update(p) { Object.assign(store[col][id], p); emit(col); }, async set(d) { (store[col] = store[col] || {})[id] = d; emit(col); } }; },
        orderBy() { return this; }, limit() { return this; },
      };
    },
  };
  const user = { async id() { return 'u_me'; }, async canEdit() { return true; }, async profiles(ids) { const o = {}; for (const i of ids) o[i] = { id: i, name: 'Teste' }; return o; } };
  const downloads = { async save(r) { window.__saved = (window.__saved || []).concat(r.filename); return { status: 'saved' }; } };
  window.claude = { use: async (name) => ({ db, user, downloads })[name] || null };
  window.__store = store;
})();
"""

errors = []
report = {}
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox'])
    def page_for(w, h, dark=False, mock=True):
        ctx = br.new_context(viewport={'width': w, 'height': h}, color_scheme='dark' if dark else 'light', device_scale_factor=1)
        if mock:
            ctx.add_init_script(MOCK)
        pg = ctx.new_page()
        pg.on('console', lambda m: errors.append(f'[{w}] {m.type}: {m.text}') if m.type in ('error', 'warning') and 'favicon' not in m.text and '404' not in m.text else None)
        pg.on('pageerror', lambda e: errors.append(f'[{w}] pageerror: {e}'))
        return pg

    pg = page_for(1440, 1000)
    pg.goto(f'http://127.0.0.1:{PORT}/index.html#inicio')
    pg.wait_for_selector('#mx-brmap svg', timeout=20000)
    pg.wait_for_timeout(1500)
    pg.screenshot(path=f'{SHOTS}/home_desktop.png', full_page=True)
    pg.screenshot(path=f'{SHOTS}/home_top.png')
    report['home_popbar'] = pg.eval_on_selector_all('#mx-br-popbar i', 'els => els.length')
    report['home_hora_dots'] = pg.eval_on_selector_all('#mx-br-hora circle', 'els => els.length')
    report['home_news'] = pg.eval_on_selector_all('#mx-p-news article', 'els => els.length')
    report['home_texts'] = pg.evaluate("() => ['#mx-br-dens','#mx-br-pf','#mx-br-cresc','#mx-br-dens-txt','#mx-br-vinc-txt','#mx-br-serie-txt','#mx-basenote','#mx-br-hora-note'].map(s => document.querySelector(s).textContent)")
    pg.click('#mx-srcbtn')
    pg.locator('#mx-br-dens').click()
    pg.wait_for_timeout(400)
    report['home_drawer'] = pg.inner_text('#mx-dr-body')[:600]
    pg.click('#mx-dr-close'); pg.click('#mx-srcoff')

    # team form
    pg.goto(f'http://127.0.0.1:{PORT}/index.html#valores-da-equipe')
    pg.wait_for_timeout(800)
    pg.select_option('#f-uf', 'al')
    pg.fill('#f-mun', 'Arapiraca')
    pg.fill('#f-contratante', 'Prefeitura de Arapiraca, UPA 24h')
    pg.fill('#f-esp', 'Clínico plantonista (urgência e emergência)')
    pg.select_option('#f-forma', 'Plantão 12h')
    pg.fill('#f-valor', '1500')
    pg.click('#f-submit')
    pg.wait_for_timeout(600)
    pg.select_option('#f-uf', 'al')
    pg.fill('#f-mun', 'Maceió')
    pg.fill('#f-contratante', 'Teste mensal')
    pg.fill('#f-esp', 'Pediatria')
    pg.select_option('#f-forma', 'Mensal')
    pg.fill('#f-carga', '20')
    pg.fill('#f-valor', '9000')
    report['preview_mensal'] = pg.inner_text('#f-preview')
    pg.click('#f-submit')
    pg.wait_for_timeout(600)
    report['team_rows'] = pg.eval_on_selector_all('#mx-team-list tbody tr', 'els => els.length')
    report['store'] = pg.evaluate('JSON.stringify(window.__store.valores_equipe)')
    pg.screenshot(path=f'{SHOTS}/equipe_desktop.png', full_page=True)

    pg.goto(f'http://127.0.0.1:{PORT}/index.html#inicio')
    pg.wait_for_timeout(800)
    report['home_team_diamonds'] = pg.eval_on_selector_all('#mx-br-hora path[data-source="valores_equipe"]', 'els => els.length')
    pg.locator('#mx-br-hora').scroll_into_view_if_needed()
    pg.screenshot(path=f'{SHOTS}/home_hora.png')
    for slug in ['tocantins', 'roraima', 'alagoas', 'rio-grande-do-sul', 'rondonia']:
        t0 = time.time()
        pg.goto(f'http://127.0.0.1:{PORT}/index.html#{slug}')
        pg.wait_for_selector('#mx-teamcard', timeout=60000)
        pg.wait_for_timeout(1200)
        dt = round(time.time() - t0, 1)
        empty = pg.evaluate("""() => Array.from(document.querySelectorAll('#mx-state-root [data-draw="val"]')).filter(e => e.textContent.trim() === '—').map(e => (e.dataset.source||'') + ':' + (e.dataset.where||'') + ':' + (e.dataset.field||''))""")
        skel = pg.evaluate("() => document.querySelectorAll('#mx-state-root .dash-skeleton').length")
        svgs = pg.evaluate("() => Array.from(document.querySelectorAll('#mx-state-root .tm-chart, #mx-state-root .tm-map')).map(e => e.id + ':' + (e.querySelector('svg') ? 'svg' : (e.textContent.trim().slice(0,40) || 'vazio')))")
        rows = pg.evaluate("() => ({hosp: document.querySelectorAll('#mx-state-root .tm-hosp tbody tr').length, mapa: document.querySelectorAll('#mx-state-root .tm-mapa tbody tr').length})")
        team_dots = pg.evaluate("() => document.querySelectorAll('#valor-hora circle').length")
        report[slug] = {'load_s': dt, 'empty_vals': empty, 'skeletons': skel, 'charts': svgs, 'rows': rows, 'hora_dots': team_dots}
        if slug == 'alagoas':
            pg.screenshot(path=f'{SHOTS}/alagoas_desktop.png', full_page=False)
            pg.locator('#mx-teamcard').scroll_into_view_if_needed()
            pg.wait_for_timeout(300)
            pg.screenshot(path=f'{SHOTS}/alagoas_team.png')
            # source mode
            pg.click('#mx-srcbtn')
            pg.locator('#mx-state-root .tm-kpi-v').first.click()
            pg.wait_for_timeout(400)
            report['drawer_title'] = pg.inner_text('#mx-dr-title')
            pg.screenshot(path=f'{SHOTS}/alagoas_drawer.png')
            pg.click('#mx-dr-close'); pg.click('#mx-srcoff')
            # toggle team off -> fewer dots
            pg.uncheck('#mx-team-state')
            pg.wait_for_timeout(300)
            report['alagoas_dots_team_off'] = pg.evaluate("() => document.querySelectorAll('#valor-hora circle').length")
            pg.check('#mx-team-state')
    pg.goto(f'http://127.0.0.1:{PORT}/index.html#noticias')
    pg.wait_for_timeout(800)
    report['news_items'] = pg.eval_on_selector_all('#mx-news-list article', 'els => els.length')
    pg.screenshot(path=f'{SHOTS}/noticias_desktop.png')
    pg.goto(f'http://127.0.0.1:{PORT}/index.html#fontes')
    pg.wait_for_timeout(500)
    pg.screenshot(path=f'{SHOTS}/fontes_desktop.png', full_page=True)

    # phone width, dark
    m = page_for(400, 860, dark=True)
    m.goto(f'http://127.0.0.1:{PORT}/index.html#inicio')
    m.wait_for_selector('#mx-brmap svg', timeout=20000)
    m.wait_for_timeout(1200)
    report['mobile_overflow_home'] = m.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    m.screenshot(path=f'{SHOTS}/home_mobile_top.png')
    m.screenshot(path=f'{SHOTS}/home_mobile_dark.png', full_page=True)
    m.goto(f'http://127.0.0.1:{PORT}/index.html#roraima')
    m.wait_for_selector('#mx-teamcard', timeout=60000)
    m.wait_for_timeout(1000)
    report['mobile_overflow_rr'] = m.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    m.screenshot(path=f'{SHOTS}/roraima_mobile_dark.png', full_page=False)
    m.goto(f'http://127.0.0.1:{PORT}/index.html#valores-da-equipe')
    m.wait_for_timeout(600)
    report['mobile_overflow_equipe'] = m.evaluate('document.documentElement.scrollWidth - window.innerWidth')

    # no capability (plain browser): db off state
    n = page_for(1200, 900, mock=False)
    n.goto(f'http://127.0.0.1:{PORT}/index.html#valores-da-equipe')
    n.wait_for_timeout(800)
    report['nodb_msg'] = n.inner_text('#mx-form-state')
    br.close()
srv.terminate()
print(json.dumps(report, ensure_ascii=False, indent=1)[:6000])
print('ERRORS', len(errors))
for e in errors[:40]:
    print(e[:400])
