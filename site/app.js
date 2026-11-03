'use strict';
(function () {
  // ------------------------------------------------------------------ helpers
  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => Array.from(r.querySelectorAll(q));
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of kids.flat(Infinity)) if (c !== null && c !== undefined && c !== false) el.append(c.nodeType ? c : String(c));
    return el;
  }
  const NS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, ...kids) {
    const el = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) el.setAttribute(k, v);
    for (const c of kids.flat()) if (c !== null && c !== undefined) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  }
  const LOC = d3.formatLocale({ decimal: ',', thousands: '.', grouping: [3], currency: ['R$ ', ''] });
  const F = {
    int: LOC.format(',d'), d1: LOC.format(',.1f'), d2: LOC.format(',.2f'),
    pct: LOC.format('.0%'), pct1: LOC.format('.1%'), brl: LOC.format('$,.2f'), brl0: LOC.format('$,.0f'),
    mi: (v) => (v >= 1e6 ? LOC.format(',.1f')(v / 1e6) + ' milhões' : LOC.format(',d')(v)),
    gente: (v, n) => (v >= 1e6 ? LOC.format(',.1f')(v / 1e6) + ' milhões de ' + n : LOC.format(',d')(v) + ' ' + n),
    brlmi: (v) => 'R$ ' + LOC.format(',.1f')(v / 1e6) + ' mi',
    signed: (v) => (v >= 0 ? '+' : '−') + LOC.format('.1%')(Math.abs(v)),
  };
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const MESL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const dBR = (s) => { const p = String(s || '').slice(0, 10).split('-'); return p.length === 3 && p[2] ? `${p[2]}/${p[1]}/${p[0]}` : '—'; };
  const compBR = (c) => { const [a, m] = String(c || '').split('-'); return m ? MES[+m - 1] + '/' + a : '—'; };
  const norm = (s) => String(s === null || s === undefined ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const median = (a) => { const s = a.filter((x) => x !== null && !isNaN(x)).sort((x, y) => x - y); if (!s.length) return null; const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const isUrl = (u) => /^https:\/\//.test(String(u || ''));
  const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const tryLS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } } };
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  // ------------------------------------------------------------------ constants
  const SLUGS = { tocantins: 'to', roraima: 'rr', alagoas: 'al', 'rio-grande-do-sul': 'rs', rondonia: 'ro' };
  const PAGES = ['inicio', 'oportunidades', 'noticias', 'valores-da-equipe', 'fontes'];
  const ST_COLOR = { to: 'var(--st-to)', rr: 'var(--st-rr)', al: 'var(--st-al)', rs: 'var(--st-rs)', ro: 'var(--st-ro)' };
  const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--s8)'];
  const SCHEDULE = { dow: 0, h: 22, m: 0, dia: 'domingo', hora: '22h' }; // weekly PNCP and news (Sunday night); CNES monthly on day 15
  const FORMA_HORAS = { 'Plantão 6h': 6, 'Plantão 12h': 12, 'Plantão 24h': 24, 'Hora': 1 };
  const SEMANAS_MES = 4.345;

  const APP = {
    P: null, BR: null, news: null, mun: null, man: {},
    team: [], auto: { valores: [], contratos: [], noticias: [] }, updates: [],
    autoFile: { valores: [], contratos: [], noticias: [] }, autoDb: { valores: [], contratos: [], noticias: [] }, updatesFile: [], updatesDb: [],
    teamOn: tryLS.get('mx-team-on') !== '0', dbState: 'loading', db: null, user: null, me: null, canEdit: false, names: {},
    mapMode: 'cobertura', prefUF: null, pendingSec: null,
  };

  const cache = {};
  const getJSON = (p) => cache[p] || (cache[p] = fetch(p).then((r) => { if (!r.ok) throw new Error(p + ' respondeu ' + r.status); return r.json(); }).catch((e) => { delete cache[p]; throw e; }));

  // ------------------------------------------------------------------ toast + tooltip
  let toastT;
  function toast(msg) { const t = $('#mx-toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3800); }
  const TIP = $('#mx-tip');
  function tipShow(ev, head, rows, cta) {
    TIP.replaceChildren(h('h4', { text: head }), ...rows.filter(Boolean).map(([k, v, c]) => h('div', { class: 'row' }, h('span', null, c ? h('i', { class: 'mx-sw', style: `background:${c}` }) : null, k), h('b', { text: v }))), cta ? h('div', { class: 'cta', text: cta }) : null);
    TIP.hidden = false;
    const w = TIP.offsetWidth, hh = TIP.offsetHeight;
    let x = ev.clientX + 16, y = ev.clientY + 16;
    if (x + w > innerWidth - 8) x = Math.max(8, ev.clientX - w - 16);
    if (y + hh > innerHeight - 8) y = Math.max(8, ev.clientY - hh - 16);
    TIP.style.left = x + 'px'; TIP.style.top = y + 'px';
  }
  const tipHide = () => { TIP.hidden = true; };

  // ------------------------------------------------------------------ theme
  function applyTheme(t) { if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t); }
  function currentTheme() { const a = document.documentElement.getAttribute('data-theme'); return a || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  applyTheme(tryLS.get('mx-theme'));
  $('#mx-themebtn').addEventListener('click', () => {
    const n = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(n); tryLS.set('mx-theme', n); redrawAll();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => redrawAll());

  // ------------------------------------------------------------------ CSV and downloads
  function csvCell(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') return String(v).replace('.', ',');
    if (typeof v === 'object') v = JSON.stringify(v);
    v = String(v);
    return /[";\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function toCSV(rows) {
    const cols = [];
    for (const r of rows) for (const k of Object.keys(r || {})) if (!cols.includes(k)) cols.push(k);
    return '﻿' + [cols.join(';')].concat(rows.map((r) => cols.map((c) => csvCell(r[c])).join(';'))).join('\r\n');
  }
  let dlCap;
  async function baixar(nome, texto, tipo) {
    if (dlCap === undefined) { try { dlCap = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { dlCap = null; } }
    if (dlCap) {
      try { await dlCap.save({ filename: nome, data: new Blob([texto], { type: tipo }) }); toast('Arquivo pronto: ' + nome); return; }
      catch (e) { if (e && e.code === 'declined') { toast('Download cancelado.'); return; } }
    }
    try { await navigator.clipboard.writeText(texto.replace(/^﻿/, '')); toast('Download indisponível nesta visualização; o conteúdo foi copiado para colar no Excel.'); }
    catch (e) { toast('Não foi possível baixar aqui. Abra o site pelo claude.ai para baixar os dados.'); }
  }
  const baixarCSV = (nome, rows) => baixar(nome + '.csv', toCSV(rows), 'text/csv;charset=utf-8');
  const baixarJSON = (nome, rows) => baixar(nome + '.json', JSON.stringify(rows, null, 1), 'application/json');

  // ------------------------------------------------------------------ team helpers
  function horasDe(t) { if (t.forma === 'Mensal') return Number(t.carga) > 0 ? Number(t.carga) * SEMANAS_MES : null; return FORMA_HORAS[t.forma] || null; }
  function macroDeForma(f) { if (/^Plantão/.test(f)) return 'plantao'; if (f === 'Hora') return 'hora'; if (f === 'Mensal') return 'carga'; return null; }
  const teamAtivos = (uf) => APP.team.filter((t) => t.status !== 'arquivado' && (!uf || t.uf === uf));
  function nomeDe(id) { if (!id) return '—'; if (id === APP.me) return 'Você'; return (APP.names[id] && APP.names[id].name) || 'Integrante da equipe'; }
  function teamHoraRows(uf) {
    return teamAtivos(uf).filter((t) => Number(t.valor_hora) > 0).map((t) => ({
      id: 'equipe-' + t.id, categoria: 'Informado pela equipe (contato com médicos)', ordem: 99, esfera: 'Equipe',
      contratante: t.contratante, municipio: t.municipio, forma: t.forma === 'Mensal' ? `Mensal (${t.carga}h por semana)` : t.forma,
      especialidade: t.especialidade, vinculo: t.vinculo, valor: Number(t.valor), valor_hora: Number(t.valor_hora),
      data: (t.mes || '') + '-01', documento: 'Equipe · ' + (t.origem || '') + (t.detalhe ? ' · ' + t.detalhe : ''),
    }));
  }

  // ------------------------------------------------------------------ sticky offset
  const mast = $('.mx-mast');
  const setStick = () => document.documentElement.style.setProperty('--stick', mast.offsetHeight + 'px');
  new ResizeObserver(setStick).observe(mast);
  setStick();

  // ------------------------------------------------------------------ boot
  async function boot() {
    try {
      const [P, BR] = await Promise.all([getJSON('data/panorama.json'), getJSON('data/brasil.json')]);
      APP.P = P; APP.BR = BR;
      const mans = await Promise.all(P.ordem.map((uf) => getJSON(`data/${uf}/manifest.json`)));
      P.ordem.forEach((uf, i) => { APP.man[uf] = mans[i]; });
    } catch (e) {
      $('main').prepend(h('div', { class: 'mx-wrap', style: 'padding-top:24px' }, h('div', { class: 'mx-msg err', text: 'Os dados do site não carregaram (' + e.message + '). Recarregue a página.' })));
      return;
    }
    $('#mx-team-home').checked = APP.teamOn; $('#mx-team-state').checked = APP.teamOn;
    const onTeamToggle = (ev) => { APP.teamOn = ev.target.checked; tryLS.set('mx-team-on', APP.teamOn ? '1' : '0'); $('#mx-team-home').checked = APP.teamOn; $('#mx-team-state').checked = APP.teamOn; onTeamChange(); };
    $('#mx-team-home').addEventListener('change', onTeamToggle);
    $('#mx-team-state').addEventListener('change', onTeamToggle);
    window.addEventListener('hashchange', route);
    route();
    initCaps();
    Promise.all(['valores', 'contratos', 'noticias', 'atualizacoes'].map((k) => getJSON(`data/auto/${k}.json`).catch(() => []))).then(([v, c, n, u]) => {
      APP.autoFile = { valores: v || [], contratos: c || [], noticias: n || [] }; APP.updatesFile = u || []; syncAuto();
    });
    getJSON('data/noticias.json').then((n) => { APP.news = n; if (PAGE === 'inicio') renderHomeNews(); if (PAGE === 'noticias') renderNews(); }).catch(() => {});
    new ResizeObserver(debounce(() => { if (PAGE === 'inicio') drawHomeCharts(); }, 160)).observe($('#mx-pg-inicio'));
  }

  // ================================================================== OPORTUNIDADES (editais com proposta aberta)
  const OPS = { list: null, uf: null, ibge: null, q: '', mod: '', prazo: '', geo: {}, mun: {}, built: false };
  const opAberta = (o) => !o.encerramento || new Date(o.encerramento) >= new Date();
  const opDias = (s) => Math.ceil((new Date(s) - new Date()) / 864e5);
  const opCov = (v, label) => h('div', null, h('b', { text: v }), h('span', { text: label }));
  const opUF = (o) => String(o.uf || '').toLowerCase();
  function opLista() { return (OPS.list || []).filter((o) => opAberta(o) && APP.P.estados[opUF(o)]); }
  async function renderOport() {
    if (!OPS.list) {
      try { OPS.list = (await getJSON('data/auto/oportunidades.json')) || []; } catch (e) { OPS.list = []; }
      try { OPS.when = ((await getJSON('data/auto/atualizacoes.json')) || []).find((u) => /PNCP/.test(u.tipo || '')); } catch (e) { OPS.when = null; }
    }
    if (!OPS.built) {
      OPS.built = true;
      $('#mx-op-q').addEventListener('input', debounce((ev) => { OPS.q = ev.target.value; renderOpList(); }, 150));
      $('#mx-op-mod').addEventListener('change', (ev) => { OPS.mod = ev.target.value; renderOpList(); });
      $('#mx-op-prazo').addEventListener('change', (ev) => { OPS.prazo = ev.target.value; renderOpList(); });
    }
    const L = opLista(), P = APP.P;
    const munis = new Set(L.map((o) => o.uf + o.ibge));
    const em7 = L.filter((o) => o.encerramento && opDias(o.encerramento) <= 7).length;
    const cred = L.filter((o) => /credenc|inexig|manifesta/i.test(o.modalidade)).length;
    $('#mx-op-date').textContent = 'Oportunidades abertas · PNCP' + (OPS.when ? ' · varredura de ' + dBR(OPS.when.data) : '');
    $('#mx-op-cover').replaceChildren(
      opCov(F.int(L.length), 'contratações abertas de serviço médico'),
      opCov(F.int(munis.size), 'municípios com oportunidade'),
      opCov(F.int(em7), 'fecham em até 7 dias'),
      opCov(F.int(cred), 'credenciamentos e chamamentos'),
      opCov(F.int(L.length - cred), 'pregões, concorrências e dispensas'),
      opCov(P.ordem.length + ' de 27', 'estados cobertos (os com relatório)'));
    $('#mx-op-note').textContent = 'Encontradas na varredura semanal do PNCP (credenciamento, inexigibilidade e chamamento, pregão, concorrência, dispensa, manifestação de interesse e pré-qualificação), filtradas por serviço médico e revisadas antes de publicar. O site esconde sozinho as que passam do prazo. Confira sempre o edital no link antes de enviar proposta.';
    const mods = Array.from(new Set(L.map((o) => o.modalidade))).sort();
    $('#mx-op-mod').replaceChildren(h('option', { value: '', text: 'Todas as modalidades' }), ...mods.map((m) => h('option', { value: m, text: m })));
    $('#mx-op-mod').value = mods.includes(OPS.mod) ? OPS.mod : (OPS.mod = '');
    renderOpStates(); await drawOpMap(); renderOpPanel(); renderOpList();
  }
  function renderOpStates() {
    const L = opLista(), P = APP.P;
    const chip = (uf, label, n) => h('button', { type: 'button', class: 'mx-chip', 'aria-pressed': String(OPS.uf === uf), onclick: () => opSetUF(uf) }, label, ' ', h('b', { text: F.int(n) }));
    $('#mx-op-states').replaceChildren(chip(null, 'Todos', L.length), ...P.ordem.map((uf) => chip(uf, P.estados[uf].sigla, L.filter((o) => opUF(o) === uf).length)));
  }
  async function opSetUF(uf) { OPS.uf = uf; OPS.ibge = null; renderOpStates(); await drawOpMap(); renderOpPanel(); renderOpList(); }
  function opSetMun(ibge) { OPS.ibge = OPS.ibge === ibge ? null : ibge; $$('#mx-opmap .mun').forEach((p) => p.classList.toggle('sel', p.dataset.id === OPS.ibge)); renderOpPanel(); renderOpList(); }
  async function opGeo(uf) {
    if (!OPS.geo[uf]) {
      const [m, mu] = await Promise.all([getJSON(`data/${uf}/malha.json`), getJSON(`data/${uf}/municipios.json`)]);
      OPS.geo[uf] = m.map((r) => ({ id: String(r.id), nome: r.nome, g: typeof r.geom === 'string' ? JSON.parse(r.geom) : r.geom }));
      OPS.mun[uf] = new Map(mu.map((r) => [String(r.id), r]));
    }
    return OPS.geo[uf];
  }
  async function drawOpMap() {
    const box = $('#mx-opmap'), head = $('#mx-op-maphead'), L = opLista(), P = APP.P;
    if (!OPS.uf) {
      head.replaceChildren(h('span', { text: 'Brasil · estados com relatório' }));
      const BR = APP.BR, W = BR.w, H = BR.h;
      const svg = sv('svg', { viewBox: `-14 -14 ${W + 120} ${H + 28}`, role: 'presentation' });
      svg.append(sv('defs', null, sv('linearGradient', { id: 'op-stgrad', x1: 0, x2: 0.4, y1: 0, y2: 1 }, sv('stop', { offset: '0%', 'stop-color': '#3FE6F7' }), sv('stop', { offset: '100%', 'stop-color': '#0A7CC4' })),
        sv('filter', { id: 'op-glow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, sv('feGaussianBlur', { stdDeviation: 9, result: 'b' }), sv('feMerge', null, sv('feMergeNode', { in: 'b' }), sv('feMergeNode', { in: 'SourceGraphic' })))));
      const gOff = sv('g'), gOn = sv('g', { filter: 'url(#op-glow)' }), gLab = sv('g');
      for (const u of BR.ufs) {
        const uf = u.uf.toLowerCase(), S = P.estados[uf];
        if (!S) { gOff.append(sv('path', { d: u.d, class: 'uf-off' })); continue; }
        const n = L.filter((o) => opUF(o) === uf).length;
        const p = sv('path', { d: u.d, class: 'uf-on', fill: 'url(#op-stgrad)', tabindex: '0', role: 'button', 'aria-label': `${S.nome}: ${n} oportunidades abertas` });
        p.addEventListener('click', () => opSetUF(uf));
        p.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); opSetUF(uf); } });
        p.addEventListener('pointermove', (ev) => tipShow(ev, S.nome, [['Oportunidades abertas', F.int(n)], ['Municípios com oportunidade', F.int(new Set(L.filter((o) => opUF(o) === uf).map((o) => o.ibge)).size)]], 'Clique para ver os municípios →'));
        p.addEventListener('pointerleave', tipHide);
        gOn.append(p);
        const out = uf === 'al', bx = out ? u.cx + 74 : u.cx, by = out ? u.cy + 22 : u.cy;
        if (out) gLab.append(sv('line', { x1: u.cx + 6, y1: u.cy + 3, x2: bx - 14, y2: by, stroke: '#7183B0', 'stroke-width': 1.2 }));
        const b = sv('g', { class: 'uf-badge', transform: `translate(${bx},${by})` });
        b.append(sv('circle', { r: 17 + Math.min(10, Math.sqrt(n) * 1.6) }), sv('text', { 'text-anchor': 'middle', y: 5 }, F.int(n)));
        gLab.append(b, sv('text', { class: 'lab-on', x: bx, y: by + 40 + Math.min(10, Math.sqrt(n) * 1.6), 'text-anchor': 'middle' }, S.sigla));
      }
      svg.append(gOff, gOn, gLab);
      box.replaceChildren(svg);
      $('#mx-op-legend').replaceChildren(h('span', null, h('i', { class: 'mx-sw', style: 'background:#19DDF2;border-radius:50%' }), 'número de oportunidades abertas'), h('span', null, h('i', { class: 'mx-sw', style: 'background:var(--hero-off);outline:1px solid var(--hero-line)' }), 'estado sem relatório (fora da varredura)'));
      return;
    }
    const uf = OPS.uf, S = P.estados[uf];
    head.replaceChildren(h('button', { type: 'button', onclick: () => opSetUF(null), text: '← Todos os estados' }), h('span', { text: S.nome + ' · municípios' }));
    box.replaceChildren(h('div', { class: 'mx-loading' }, h('div', { class: 'bar' })));
    const feats = await opGeo(uf), M = OPS.mun[uf];
    if (OPS.uf !== uf) return;
    const cnt = {}; for (const o of L.filter((o) => opUF(o) === uf)) cnt[String(o.ibge)] = (cnt[String(o.ibge)] || 0) + 1;
    const each = (g, f) => { const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates; for (const p of polys) for (const ring of p) for (const pt of ring) f(pt); };
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    feats.forEach((ft) => each(ft.g, ([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }));
    const kx = Math.cos(((y0 + y1) / 2) * Math.PI / 180), W = 900, H = Math.min(900, W * (y1 - y0) / ((x1 - x0) * kx));
    const sc = Math.min((W - 20) / ((x1 - x0) * kx), (H - 20) / (y1 - y0)), ox = (W - (x1 - x0) * kx * sc) / 2, oy = (H - (y1 - y0) * sc) / 2;
    const Pj = ([x, y]) => [ox + (x - x0) * kx * sc, oy + (y1 - y) * sc];
    const pathOf = (g) => { const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates; let d = ''; for (const p of polys) for (const ring of p) d += 'M' + ring.map((pt) => Pj(pt).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z'; return d; };
    const cen = (g) => { let sx = 0, sy = 0, n = 0; each(g, (pt) => { const q = Pj(pt); sx += q[0]; sy += q[1]; n += 1; }); return [sx / n, sy / n]; };
    const maxN = Math.max(1, ...Object.values(cnt));
    const ramp = d3.interpolateRgb('#1E5BA8', '#3FE6F7');
    const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'presentation' });
    const gM = sv('g'), gP = sv('g'), gL = sv('g');
    for (const ft of feats) {
      const n = cnt[ft.id] || 0, r = M.get(ft.id) || {};
      const p = sv('path', { d: pathOf(ft.g), class: 'mun' + (n ? ' has' : '') + (OPS.ibge === ft.id ? ' sel' : ''), fill: n ? ramp(Math.sqrt(n / maxN)) : null });
      p.dataset.id = ft.id;
      p.addEventListener('pointermove', (ev) => tipShow(ev, (r.nome || ft.nome) + ' · ' + S.sigla, [['Oportunidades abertas', F.int(n)], ['População', r.pop ? F.int(r.pop) : '—'], ['Médicos por mil hab.', r.dens !== undefined ? F.d2(r.dens) : '—'], ['Hospitais e UPAs', r.n_unid !== undefined ? F.int(r.n_unid) : '—']], n ? 'Clique para ver as oportunidades →' : 'Clique para ver os dados do município'));
      p.addEventListener('pointerleave', tipHide);
      p.addEventListener('click', () => opSetMun(ft.id));
      gM.append(p);
      if (n) {
        const [cx, cy] = cen(ft.g), rr = 7 + Math.sqrt(n) * 2.4;
        const c = sv('circle', { class: 'op-pin', cx, cy, r: rr });
        c.addEventListener('click', () => opSetMun(ft.id));
        c.addEventListener('pointermove', (ev) => tipShow(ev, (r.nome || ft.nome) + ' · ' + S.sigla, [['Oportunidades abertas', F.int(n)]], 'Clique para ver →'));
        c.addEventListener('pointerleave', tipHide);
        gP.append(c, sv('text', { class: 'op-pin-n', x: cx, y: cy + 4, 'text-anchor': 'middle' }, F.int(n)));
      }
    }
    Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([id]) => {
      const ft = feats.find((f) => f.id === id); if (!ft) return;
      const [cx, cy] = cen(ft.g), rr = 7 + Math.sqrt(cnt[id]) * 2.4;
      gL.append(sv('text', { class: 'lab-mun', x: cx, y: cy - rr - 5, 'text-anchor': 'middle' }, (M.get(id) || ft).nome));
    });
    svg.append(gM, gP, gL);
    box.replaceChildren(svg);
    $('#mx-op-legend').replaceChildren(h('span', null, h('i', { class: 'mx-sw', style: 'background:linear-gradient(90deg,#1E5BA8,#3FE6F7)' }), 'mais oportunidades, cor mais clara'), h('span', null, h('i', { class: 'mx-sw', style: 'background:#19DDF2;border-radius:50%' }), 'número de oportunidades no município'));
  }
  function renderOpPanel() {
    const box = $('#mx-op-panel'), L = opLista(), P = APP.P;
    if (!OPS.uf) {
      box.replaceChildren(h('h3', { text: 'Por estado' }), h('p', { text: 'Contratações de serviço médico com proposta aberta. Escolha um estado no mapa ou nos botões acima.' }),
        h('div', { class: 'mx-tablewrap' }, h('table', { class: 'mx-table' }, h('thead', null, h('tr', null, h('th', { text: 'Estado' }), h('th', { class: 'n', text: 'Abertas' }), h('th', { class: 'n', text: 'Municípios' }))),
          h('tbody', null, ...P.ordem.map((uf) => { const l = L.filter((o) => opUF(o) === uf); return h('tr', null, h('td', null, h('button', { type: 'button', class: 'mx-opmun', onclick: () => opSetUF(uf), text: P.estados[uf].nome })), h('td', { class: 'n', text: F.int(l.length) }), h('td', { class: 'n', text: F.int(new Set(l.map((o) => o.ibge)).size) })); })))));
      return;
    }
    const uf = OPS.uf, S = P.estados[uf], M = OPS.mun[uf];
    const ref = [['Plantão de 24h em prefeituras (mediana do relatório)', S.p24 ? F.brl0(S.p24) : 'sem valor'], ['Hora de plantão (mediana do relatório)', S.hora && S.hora.plantao && S.hora.plantao.n ? F.brl(S.hora.plantao.mediana) : 'sem valor']];
    const kv = (rows) => h('dl', { class: 'mx-kv' }, ...rows.flatMap(([k, v]) => [h('dt', { text: k }), h('dd', { text: v })]));
    if (!OPS.ibge || !M) {
      const l = L.filter((o) => opUF(o) === uf);
      box.replaceChildren(h('h3', { text: S.nome }), h('p', { text: 'Clique em um município no mapa para ver os dados dele e as oportunidades abertas.' }),
        kv([['Oportunidades abertas', F.int(l.length)], ['Municípios com oportunidade', F.int(new Set(l.map((o) => o.ibge)).size)], ['Médicos por mil hab. no estado', F.d2(S.dens)], ...ref]),
        h('a', { class: 'mx-btn ghost sm', href: '#' + S.slug, text: 'Abrir o relatório de ' + S.nome }));
      return;
    }
    const r = M.get(OPS.ibge) || {}, l = L.filter((o) => String(o.ibge) === OPS.ibge);
    box.replaceChildren(h('h3', { text: (r.nome || '—') + ' · ' + S.sigla }), h('p', { text: 'Região de saúde: ' + (r.cir_nome || '—') + '. Dados do relatório do estado (CNES ' + compBR(S.cnes_competencia) + ', IBGE 2025).' }),
      kv([['Oportunidades abertas', F.int(l.length)], ['População', r.pop ? F.int(r.pop) : '—'], ['Médicos com vínculo no CNES', r.med !== undefined ? F.int(r.med) + ' (' + F.int(r.med_sus || 0) + ' pelo SUS)' : '—'],
        ['Médicos por mil hab.', r.dens !== undefined ? F.d2(r.dens) + ' (estado: ' + F.d2(S.dens) + ')' : '—'], ['Hospitais e UPAs', r.n_unid !== undefined ? F.int(r.n_unid) : '—'], ['Pessoas com 60 anos ou mais', r.pct_60mais !== undefined ? F.d1(r.pct_60mais) + '%' : '—'], ...ref]),
      h('div', { class: 'mx-oplinks' }, h('a', { class: 'mx-btn ghost sm', href: '#' + S.slug, text: 'Relatório de ' + S.nome }), h('button', { type: 'button', class: 'mx-btn ghost sm', onclick: () => opSetMun(OPS.ibge), text: 'Ver o estado todo' })));
  }
  function renderOpList() {
    const q = norm(OPS.q), P = APP.P;
    let L = opLista();
    if (OPS.uf) L = L.filter((o) => opUF(o) === OPS.uf);
    if (OPS.ibge) L = L.filter((o) => String(o.ibge) === OPS.ibge);
    if (OPS.mod) L = L.filter((o) => o.modalidade === OPS.mod);
    if (OPS.prazo) L = L.filter((o) => o.encerramento && opDias(o.encerramento) <= Number(OPS.prazo));
    if (q) L = L.filter((o) => norm([o.municipio, o.orgao, o.unidade, o.objeto, o.complemento, o.modalidade, (o.itens || []).map((i) => i.descricao).join(' ')].join(' ')).includes(q));
    L.sort((a, b) => String(a.encerramento || '9999').localeCompare(String(b.encerramento || '9999')));
    $('#mx-op-count').textContent = F.int(L.length) + (L.length === 1 ? ' oportunidade' : ' oportunidades');
    const list = $('#mx-op-list');
    if (!L.length) { list.replaceChildren(h('div', { class: 'mx-empty' }, h('b', { text: 'Nenhuma oportunidade aberta com esses filtros.' }), h('span', { text: opLista().length ? 'Tente outro estado, município ou prazo.' : 'A primeira varredura ainda não publicou oportunidades.' }))); return; }
    list.replaceChildren(...L.slice(0, 300).map((o) => {
      const d = o.encerramento ? opDias(o.encerramento) : null, S = P.estados[opUF(o)];
      const tx = o.complemento ? (o.objeto ? o.objeto + ' — ' : '') + o.complemento : o.objeto;
      const curto = tx && tx.length > 260 ? tx.slice(0, 257) + '…' : tx;
      return h('article', { class: 'mx-opcard' },
        h('div', { class: 'mx-opmeta' }, h('span', { class: 'mx-tag uf', text: o.uf }), h('span', { class: 'mx-tag', text: o.modalidade }),
          o.encerramento ? h('span', { class: 'mx-opdue' + (d <= 7 ? ' soon' : ''), text: 'propostas até ' + dBR(o.encerramento) + (d <= 0 ? ' (último dia)' : ` (faltam ${d} dias)`) }) : null),
        h('h4', { text: curto || '—' }),
        h('div', { class: 'mx-opmeta' }, h('button', { type: 'button', class: 'mx-opmun', onclick: async () => { if (OPS.uf !== opUF(o)) await opSetUF(opUF(o)); opSetMun(String(o.ibge)); window.scrollTo({ top: 0, behavior: 'smooth' }); }, text: (o.municipio || '—') + ' · ' + (S ? S.sigla : o.uf) }),
          h('span', { text: o.orgao || '' }), Number(o.valor_estimado) > 0 ? h('span', { text: 'valor estimado ' + F.brl0(Number(o.valor_estimado)) }) : null,
          o.abertura ? h('span', { text: 'aberto desde ' + dBR(o.abertura) }) : null),
        (o.itens && o.itens.length) ? h('ul', { class: 'mx-opitems' }, ...o.itens.slice(0, 5).map((i) => h('li', { text: i.descricao + (Number(i.valor_unitario) > 0 ? ' · ' + F.brl(Number(i.valor_unitario)) + (i.unidade ? ' por ' + String(i.unidade).toLowerCase() : '') : '') })),
          o.n_itens > 5 ? h('li', { text: `e mais ${o.n_itens - 5} itens no edital` }) : null) : null,
        h('div', { class: 'mx-oplinks' }, isUrl(o.link_pncp) ? h('a', { class: 'mx-btn sm', href: o.link_pncp, target: '_blank', rel: 'noopener', text: 'Ver edital no PNCP' }) : null,
          isUrl(o.link_sistema) ? h('a', { class: 'mx-btn ghost sm', href: o.link_sistema, target: '_blank', rel: 'noopener', text: 'Sistema onde enviar a proposta' }) : null));
    }));
  }

  // ------------------------------------------------------------------ router
  let PAGE = null, PAGE_UF = null;
  function route() {
    const name = decodeURIComponent(location.hash.slice(1));
    let page = 'inicio', uf = null;
    if (SLUGS[name]) { page = 'estado'; uf = SLUGS[name]; } else if (PAGES.includes(name)) page = name;
    const changed = page !== PAGE || uf !== PAGE_UF;
    PAGE = page; PAGE_UF = uf;
    $$('.mx-page').forEach((p) => { p.hidden = p.dataset.page !== page; });
    $$('.mx-nav a').forEach((a) => { if (a.dataset.nav === (name && (SLUGS[name] || PAGES.includes(name)) ? name : 'inicio')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    closeDrawer(); tipHide();
    if (page !== 'estado') closeState();
    if (changed && !APP.pendingSec) window.scrollTo({ top: 0, behavior: 'instant' });
    const S = uf && APP.P.estados[uf];
    document.title = (S ? S.nome + ' · ' : page === 'oportunidades' ? 'Oportunidades · ' : page === 'noticias' ? 'Notícias · ' : page === 'valores-da-equipe' ? 'Valores da equipe · ' : page === 'fontes' ? 'Fontes · ' : '') + 'Atlas Médico do Brasil';
    if (page === 'inicio') renderHome();
    else if (page === 'estado') openState(uf);
    else if (page === 'oportunidades') renderOport();
    else if (page === 'noticias') renderNews();
    else if (page === 'valores-da-equipe') renderTeamPage();
    else if (page === 'fontes') renderFontes();
  }
  function redrawAll() {
    if (PAGE === 'inicio') drawHomeCharts();
    if (PAGE === 'oportunidades') drawOpMap();
    if (CUR) CUR.runCharts();
  }

  // ================================================================== HOME (Brasil, soma dos estados com relatório)
  let homeBuilt = false;
  const VSEG = [['est', 'Estatutário', 'var(--s1)'], ['tmp', 'Prazo determinado', 'var(--s2)'], ['pj', 'PJ', 'var(--s3)'], ['pf', 'Autônomo pessoa física', 'var(--s4)'], ['outros', 'CLT, cooperado, residente e outros', 'var(--chart-muted)']];
  function renderHome() {
    const P = APP.P, B = P.brasil, T = P.total;
    if (!homeBuilt) {
      homeBuilt = true;
      const datas = P.ordem.map((uf) => P.estados[uf].relatorio_em).sort();
      $('#mx-hero-date').textContent = 'Pesquisa e inteligência · atualizado em ' + dBR(datas[datas.length - 1]);
      $('#mx-cover-tag').textContent = `Base: ${B.n_estados} de 27 estados`;
      buildPopBar();
      $('#mx-cover').replaceChildren(
        cov(B.n_estados + ' de 27', 'estados com relatório', 'relatorio'),
        cov(F.int(T.municipios), 'municípios mapeados', 'n_mun'),
        cov(F.mi(T.pop), 'habitantes (IBGE 2025)', 'pop'),
        cov(F.int(T.medicos), 'vínculos médicos no CNES, set/2026', 'medicos'),
        cov(F.int(T.valores), 'valores com documento de origem', 'n_mapa'),
        cov(F.int(T.contratos), 'contratos e credenciados', 'n_contratos'));
      $('#mx-basenote').textContent = `Brasil parcial: os números desta página somam os ${B.n_estados} estados que já têm relatório (${B.base.join(', ')}). Cada novo relatório entra nos totais.`;
      // cobertura
      $('#mx-br-dens').textContent = F.d2(B.dens);
      $('#mx-br-dens-txt').replaceChildren('São ', h('b', { text: F.int(B.medicos) }), ` vínculos médicos para ${F.gente(B.pop, 'habitantes')}, e ${F.pct(B.medicos_sus / B.medicos)} deles atendem pelo SUS. Mesmo assim, `, h('b', { text: `${F.int(B.mun_baixa)} dos ${F.int(B.n_mun)} municípios` }), ` ficam abaixo de 1 médico por mil habitantes, onde vivem ${F.gente(B.pop_baixa, 'pessoas')}.`);
      // contratação
      const V = B.vinc, tot = V.vinculos;
      $('#mx-br-pf').textContent = F.pct(V.pf / tot);
      $('#mx-br-vinc-txt').replaceChildren('dos vínculos médicos em hospitais e UPAs. Concursados são só ', h('b', { text: F.pct1(V.est / tot) }), `; PJ, ${F.pct1(V.pj / tot)}; prazo determinado, ${F.pct1(V.tmp / tot)}.`);
      $('#mx-br-vinc').replaceChildren(...VSEG.map(([k, n, c]) => {
        const sh = V[k] / tot;
        const seg = h('i', { style: `width:${sh * 100}%;background:${c}${k === 'outros' ? ';color:var(--ink)' : ''}` }, sh > 0.07 ? F.pct(sh) : '');
        seg.addEventListener('pointermove', (ev) => tipShow(ev, n, [['Vínculos', F.int(V[k])], ['Parcela', F.pct1(sh)]]));
        seg.addEventListener('pointerleave', tipHide);
        return seg;
      }));
      $('#mx-br-vinc-list').replaceChildren(...VSEG.map(([k, n, c]) => h('div', null, h('i', { class: 'mx-sw', style: `background:${c}` }), h('span', null, n, h('span', { class: 'c', text: F.int(V[k]) + ' vínculos' })), h('b', { text: F.pct1(V[k] / tot) }))));
      // hora
      const kp = (label, v, sub, fonte) => h('div', { class: 'mx-kpi', dataset: { fonte, uf: 'todos' } }, h('span', { text: label }), h('b', { text: v }), h('small', { text: sub }));
      const hs = B.hora;
      $('#mx-br-hora-kpis').replaceChildren(
        kp('Plantão, mediana por hora', hs.plantao.n ? F.brl(hs.plantao.mediana) : '—', `${F.int(hs.plantao.n)} valores · metade entre ${F.brl0(hs.plantao.q1)} e ${F.brl0(hs.plantao.q3)}`, 'br_hora'),
        kp('Plantão de 24h em prefeituras', B.p24.n ? F.brl0(B.p24.mediana) : '—', `mediana · ${F.brl(B.p24.mediana_hora)} por hora · ${F.int(B.p24.n)} valores`, 'br_p24'),
        kp('Hora avulsa contratada, mediana', hs.hora.n ? F.brl(hs.hora.mediana) : '—', `${F.int(hs.hora.n)} valores de empresa ou credenciado`, 'br_hora'),
        kp('Carga semanal ou salário, por hora', hs.carga.n ? F.brl(hs.carga.mediana) : '—', `mediana · ${F.int(hs.carga.n)} valores de concurso, seleção ou contrato`, 'br_hora'));
      // série
      const S0 = B.serie[0], S1 = B.serie[B.serie.length - 1];
      $('#mx-br-cresc').textContent = F.signed(B.cresc);
      $('#mx-br-serie-txt').replaceChildren(`De ${F.int(S0.medicos)} vínculos médicos em ${compBR(S0.competencia)} para `, h('b', { text: F.int(S1.medicos) }), ` em ${compBR(S1.competencia)}, na mesma competência de cada ano.`);
    }
    drawHomeCharts();
    renderHomeNews();
  }
  function cov(v, label, fonte) { return h('div', { dataset: { fonte, uf: 'todos' } }, h('b', { text: v }), h('span', { text: label })); }
  function drawHomeCharts() { if (!APP.P) return; drawMap(); drawHoraBR(); drawSerieBR(); }

  // ---------- map (coverage only), drawn on the navy hero band
  function drawMap() {
    const BR = APP.BR, P = APP.P, box = $('#mx-brmap');
    if (!box || !BR) return;
    const W = BR.w, H = BR.h, pr = BR.proj;
    const X = (lon) => (lon - pr.x0) * pr.k * pr.sc, Y = (lat) => (pr.y1 - lat) * pr.sc;
    const svg = sv('svg', { viewBox: `-14 -14 ${W + 120} ${H + 28}`, role: 'presentation' });
    svg.append(sv('defs', null,
      sv('linearGradient', { id: 'mx-stgrad', x1: 0, x2: 0.4, y1: 0, y2: 1 }, sv('stop', { offset: '0%', 'stop-color': '#3FE6F7' }), sv('stop', { offset: '100%', 'stop-color': '#0A7CC4' })),
      sv('linearGradient', { id: 'mx-orbitg', x1: 0, x2: 1, y1: 0, y2: 0 }, sv('stop', { offset: '0%', 'stop-color': '#0A7CC4', 'stop-opacity': 0 }), sv('stop', { offset: '55%', 'stop-color': '#0AA6E6', 'stop-opacity': 0.85 }), sv('stop', { offset: '100%', 'stop-color': '#3FE6F7', 'stop-opacity': 1 })),
      sv('filter', { id: 'mx-glow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, sv('feGaussianBlur', { stdDeviation: 9, result: 'b' }), sv('feMerge', null, sv('feMergeNode', { in: 'b' }), sv('feMergeNode', { in: 'SourceGraphic' }))),
      sv('filter', { id: 'mx-dotglow', x: '-200%', y: '-200%', width: '500%', height: '500%' }, sv('feGaussianBlur', { stdDeviation: 5, result: 'b' }), sv('feMerge', null, sv('feMergeNode', { in: 'b' }), sv('feMergeNode', { in: 'b' }), sv('feMergeNode', { in: 'SourceGraphic' })))));
    const g0 = sv('g');
    for (let lat = 5; lat >= -30; lat -= 5) g0.append(sv('line', { class: 'grat', x1: 0, x2: W, y1: Y(lat), y2: Y(lat) }));
    for (let lon = -70; lon <= -35; lon += 5) g0.append(sv('line', { class: 'grat', x1: X(lon), x2: X(lon), y1: 0, y2: H }));
    g0.append(sv('line', { class: 'grat-key', x1: 0, x2: W, y1: Y(0), y2: Y(0) }));
    g0.append(sv('line', { class: 'grat-key', x1: 0, x2: W, y1: Y(-23.44), y2: Y(-23.44) }));
    g0.append(sv('text', { class: 'lab-keytext', x: 4, y: Y(0) - 8 }, 'Equador'));
    g0.append(sv('text', { class: 'lab-keytext', x: 4, y: Y(-23.44) - 8 }, 'Trópico de Capricórnio'));
    svg.append(g0);
    // the brand orbit: a partial ellipse around the country with a glowing point at its end
    const cx0 = 520, cy0 = 545, rx = 650, ry = 205, rot = -31 * Math.PI / 180;
    const pt = (a) => { const x = rx * Math.cos(a), y = ry * Math.sin(a); return [cx0 + x * Math.cos(rot) - y * Math.sin(rot), cy0 + x * Math.sin(rot) + y * Math.cos(rot)]; };
    const seg = []; for (let k = 0; k <= 120; k++) seg.push(pt(Math.PI * 0.66 + (Math.PI * 1.3) * k / 120));
    const orbitD = 'M' + seg.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
    const gOrbit = sv('g', { class: 'mx-orbit' });
    gOrbit.append(sv('path', { d: orbitD, fill: 'none', stroke: 'url(#mx-orbitg)', 'stroke-width': 3.2, 'stroke-linecap': 'round', opacity: 0.9 }));
    const end = seg[seg.length - 1];
    const dot = sv('circle', { cx: end[0], cy: end[1], r: 7, fill: '#3FE6F7', filter: 'url(#mx-dotglow)' });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dot.setAttribute('cx', 0); dot.setAttribute('cy', 0);
      dot.append(sv('animateMotion', { dur: '18s', repeatCount: 'indefinite', path: orbitD, keyPoints: '0;1;1', keyTimes: '0;0.8;1', calcMode: 'linear' }));
    }
    gOrbit.append(dot);
    const gOff = sv('g'), gOn = sv('g', { filter: 'url(#mx-glow)' }), gLab = sv('g');
    let i = 0;
    for (const u of BR.ufs) {
      const uf = u.uf.toLowerCase(), S = P.estados[uf];
      if (!S) {
        const p = sv('path', { d: u.d, class: 'uf-off' });
        p.addEventListener('pointermove', (ev) => tipShow(ev, u.nome, [['Situação', 'sem relatório']], 'Nenhum número estimado para este estado'));
        p.addEventListener('pointerleave', tipHide);
        gOff.append(p);
        if (u.uf !== 'DF') gLab.append(sv('text', { class: 'lab-off', x: u.cx, y: u.cy + 4, 'text-anchor': 'middle' }, u.uf));
        continue;
      }
      const p = sv('path', { d: u.d, class: 'uf-on', fill: 'url(#mx-stgrad)', tabindex: '0', role: 'link', 'aria-label': `${S.nome}: abrir relatório`, style: `animation: mxpop .8s ${0.1 * i++}s both` });
      const go = () => { location.hash = S.slug; };
      p.addEventListener('click', go);
      p.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
      p.addEventListener('pointermove', (ev) => tipShow(ev, S.nome, [['Relatório de', dBR(S.relatorio_em)]], 'Clique para abrir o relatório →'));
      p.addEventListener('pointerleave', tipHide);
      p.dataset.fonte = 'relatorio'; p.dataset.uf = uf;
      gOn.append(p);
      const outside = uf === 'al';
      const lx = outside ? u.cx + 70 : u.cx, ly = outside ? u.cy + 26 : u.cy;
      if (outside) gLab.append(sv('line', { x1: u.cx + 6, y1: u.cy + 3, x2: lx - 6, y2: ly - 6, stroke: '#7183B0', 'stroke-width': 1.2 }));
      gLab.append(sv('text', { class: 'lab-on' + (outside ? ' lab-out' : ''), x: lx, y: ly + 7, 'text-anchor': outside ? 'start' : 'middle' }, S.sigla));
    }
    svg.append(gOff, gOrbit, gOn, gLab);
    box.replaceChildren(svg);
    $('#mx-maplegend').replaceChildren(
      h('span', null, h('i', { class: 'mx-sw', style: 'background:linear-gradient(#3FE6F7,#0A7CC4)' }), 'Com relatório:'),
      h('span', { class: 'mx-maplinks' }, ...P.ordem.map((uf) => h('a', { href: '#' + P.estados[uf].slug, text: P.estados[uf].nome }))),
      h('span', null, h('i', { class: 'mx-sw', style: 'background:var(--hero-off);outline:1px solid var(--hero-line)' }), `Sem relatório (${27 - P.ordem.length})`));
  }

  // ---------- population by coverage band, one bar
  const FX_COR = ['var(--fx0)', 'var(--fx1)', 'var(--fx2)', 'var(--fx3)', 'var(--fx4)', 'var(--fx5)'];
  function buildPopBar() {
    const B = APP.P.brasil;
    $('#mx-br-popbar').replaceChildren(...B.faixas.map((f, i) => {
      const sh = f.pop / B.pop;
      const seg = h('i', { style: `width:${sh * 100}%;background:${FX_COR[i]}${i === 2 || i === 3 ? ';color:var(--ink)' : ''}` }, sh > 0.07 ? F.pct(sh) : '');
      seg.addEventListener('pointermove', (ev) => tipShow(ev, f.nome + (i === 0 ? '' : ' médicos por mil hab.'), [['Municípios', F.int(f.n)], ['População', F.int(f.pop)], ['Parcela da população', F.pct1(sh)]]));
      seg.addEventListener('pointerleave', tipHide);
      return seg;
    }));
    $('#mx-br-faixas').replaceChildren(...B.faixas.map((f, i) => h('div', { dataset: { fonte: 'br_mun', uf: 'todos' } }, h('i', { class: 'mx-sw', style: `background:${FX_COR[i]}` }), h('span', null, f.nome + (i === 0 ? '' : ' por mil hab.'), h('span', { class: 'p', text: `${F.int(f.n)} municípios` })), h('b', { text: f.pop / B.pop < 0.01 ? F.pct1(f.pop / B.pop) : F.pct(f.pop / B.pop) }))));
  }

  // ---------- hour value, all mapped states together
  function drawHoraBR() {
    const P = APP.P, B = P.brasil, box = $('#mx-br-hora');
    if (!box) return;
    const MK = ['plantao', 'hora', 'carga'];
    const pts = P.ordem.flatMap((uf) => P.estados[uf].pontos.map((p) => Object.assign({ uf: P.estados[uf].sigla }, p)));
    const team = APP.teamOn ? teamAtivos().filter((t) => Number(t.valor_hora) > 0 && macroDeForma(t.forma)) : [];
    const all = pts.map((p) => p.v).concat(team.map((t) => Number(t.valor_hora)));
    const lo = Math.min(10, d3.min(all) * 0.9), hi = Math.max(800, d3.max(all) * 1.1);
    const W = Math.max(300, box.clientWidth || 900);
    const x = d3.scaleLog([lo, hi], [6, W - 10]);
    const rowH = 92, top = 4, Hh = top + MK.length * rowH + 26;
    const svg = sv('svg', { viewBox: `0 0 ${W} ${Hh}`, width: '100%' });
    const ink = cssVar('--ink'), ink2 = cssVar('--ink-2'), ink3 = cssVar('--ink-3'), rule = cssVar('--rule'), pet = cssVar('--petrol'), wash = cssVar('--petrol-wash'), team_c = cssVar('--team'), srf = cssVar('--surface');
    for (const t of [15, 25, 50, 100, 200, 400, 800].filter((v) => v >= lo && v <= hi)) {
      svg.append(sv('line', { x1: x(t), x2: x(t), y1: top + 30, y2: Hh - 22, stroke: rule, 'stroke-width': 1 }));
      svg.append(sv('text', { x: x(t), y: Hh - 6, 'text-anchor': 'middle', fill: ink3, 'font-size': 12 }, 'R$ ' + t + '/h'));
    }
    const hash = (s) => { let z = 0; for (const ch of String(s)) z = (z * 31 + ch.charCodeAt(0)) | 0; return z; };
    MK.forEach((mk, k) => {
      const y0 = top + k * rowH, cy = y0 + 58, st = B.hora[mk];
      svg.append(sv('text', { x: 0, y: y0 + 18, fill: ink, 'font-size': 14.5, 'font-weight': 600 }, P.macros[mk]));
      svg.append(sv('text', { x: W - 2, y: y0 + 18, 'text-anchor': 'end', fill: ink2, 'font-size': 12.5 }, st.n ? `${F.int(st.n)} valores · mediana ${F.brl(st.mediana)}/h` : 'sem valores'));
      if (!st.n) return;
      svg.append(sv('rect', { x: x(st.q1), y: cy - 16, width: Math.max(2, x(st.q3) - x(st.q1)), height: 32, rx: 4, fill: wash }));
      const g = sv('g');
      pts.filter((p) => p.m === mk).forEach((p) => {
        const c = sv('circle', { cx: x(p.v), cy: cy + ((Math.abs(hash(p.id)) % 25) - 12) * 1.05, r: 3.3, fill: pet, 'fill-opacity': 0.42 });
        c.addEventListener('pointermove', (ev) => tipShow(ev, `${p.ct} · ${p.mu} (${p.uf})`, [['Forma', p.f], ['Especialidade', p.e || '—'], ['Por hora', F.brl(p.v)], ['Data', dBR(p.d)], ['Documento', p.doc || '—']]));
        c.addEventListener('pointerleave', tipHide);
        g.append(c);
      });
      svg.append(g);
      svg.append(sv('line', { x1: x(st.mediana), x2: x(st.mediana), y1: cy - 20, y2: cy + 20, stroke: ink, 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
      team.filter((t) => macroDeForma(t.forma) === mk).forEach((t, j) => {
        const cx = x(Number(t.valor_hora)), yy = cy + ((j % 5) - 2) * 4;
        const d = sv('path', { d: `M${cx},${yy - 7}L${cx + 7},${yy}L${cx},${yy + 7}L${cx - 7},${yy}Z`, fill: team_c, stroke: srf, 'stroke-width': 1.4, 'data-source': 'valores_equipe' });
        d.addEventListener('pointermove', (ev) => tipShow(ev, 'Informado pela equipe', [['Contratante', t.contratante], ['Município', `${t.municipio} (${String(t.uf).toUpperCase()})`], ['Forma', t.forma], ['Especialidade', t.especialidade], ['Valor', F.brl(Number(t.valor))], ['Por hora', F.brl(Number(t.valor_hora))], ['Mês', compBR(t.mes)], ['Origem', t.origem]]));
        d.addEventListener('pointerleave', tipHide);
        svg.append(d);
      });
    });
    box.replaceChildren(svg);
    $('#mx-br-hora-note').textContent = `Cada valor com documento conta uma vez, por isso tabelas com muitas especialidades pesam mais na mediana. Escala logarítmica. Fora do gráfico: a bolsa do Mais Médicos${B.mm_hora ? ' (' + F.brl(B.mm_hora) + ' por hora)' : ''}. ` + (!APP.teamOn ? 'Os valores da equipe estão desligados.' : team.length ? `${team.length === 1 ? 'O valor' : 'Os ' + F.int(team.length) + ' valores'} da equipe ${team.length === 1 ? 'aparece como losango rosa e não entra' : 'aparecem como losangos rosa e não entram'} nas medianas.` : 'Nenhum valor da equipe registrado ainda.');
  }

  // ---------- CNES series, one line
  function drawSerieBR() {
    const B = APP.P.brasil, box = $('#mx-br-serie');
    if (!box) return;
    const W = Math.max(280, box.clientWidth || 600), Hh = 280, ml = 8, mr = 8, mt = 34, mb = 30;
    const S = B.serie;
    const x = d3.scalePoint(S.map((r) => r.competencia), [ml + 30, W - mr - 30]);
    const y = d3.scaleLinear([0, d3.max(S, (r) => r.medicos) * 1.06], [Hh - mb, mt]);
    const pet = cssVar('--petrol'), ink = cssVar('--ink'), ink3 = cssVar('--ink-3'), rule = cssVar('--rule');
    const svg = sv('svg', { viewBox: `0 0 ${W} ${Hh}` });
    const grad = sv('linearGradient', { id: 'mx-areag', x1: 0, x2: 0, y1: 0, y2: 1 }, sv('stop', { offset: '0%', 'stop-color': pet, 'stop-opacity': 0.22 }), sv('stop', { offset: '100%', 'stop-color': pet, 'stop-opacity': 0 }));
    svg.append(sv('defs', null, grad));
    svg.append(sv('line', { x1: ml, x2: W - mr, y1: Hh - mb, y2: Hh - mb, stroke: rule }));
    const area = d3.area().x((r) => x(r.competencia)).y0(Hh - mb).y1((r) => y(r.medicos));
    const line = d3.line().x((r) => x(r.competencia)).y((r) => y(r.medicos));
    svg.append(sv('path', { d: area(S), fill: 'url(#mx-areag)' }));
    svg.append(sv('path', { d: line(S), fill: 'none', stroke: pet, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }));
    S.forEach((r, i) => {
      const last = i === S.length - 1;
      svg.append(sv('circle', { cx: x(r.competencia), cy: y(r.medicos), r: last ? 6 : 3.6, fill: last ? pet : cssVar('--surface'), stroke: pet, 'stroke-width': 2 }));
      svg.append(sv('text', { x: x(r.competencia), y: y(r.medicos) - 14, 'text-anchor': 'middle', fill: last ? ink : cssVar('--ink-2'), 'font-size': last ? 14 : 12.5, 'font-weight': last ? 600 : 400 }, F.int(r.medicos)));
      svg.append(sv('text', { x: x(r.competencia), y: Hh - 9, 'text-anchor': 'middle', fill: ink3, 'font-size': 12 }, r.competencia.slice(0, 4)));
      const prev = i ? S[i - 1].medicos : null;
      const band = sv('rect', { x: x(r.competencia) - x.step() / 2, y: 0, width: x.step(), height: Hh, fill: 'transparent' });
      band.addEventListener('pointermove', (ev) => tipShow(ev, 'CNES, ' + compBR(r.competencia), [['Vínculos médicos', F.int(r.medicos)], prev ? ['Variação no ano', F.signed(r.medicos / prev - 1)] : null]));
      band.addEventListener('pointerleave', tipHide);
      svg.append(band);
    });
    box.replaceChildren(svg);
  }

  // ---------- sources of the Brazil figures
  const FONTES = {
    br_dens: { t: 'Médicos por mil habitantes, Brasil parcial', como: 'Soma dos médicos com vínculo ativo no CNES (setembro de 2026) em todos os municípios dos estados com relatório, dividida pela soma da população estimada do IBGE para 2025, vezes mil. Um médico que atua em dois municípios conta em cada um.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => `${F.d2(S.dens)} (${F.int(S.medicos)} vínculos, ${F.int(S.pop)} hab.)` },
    br_mun: { t: 'Municípios por faixa de médicos por mil habitantes', como: 'Cada município dos estados com relatório, classificado pelos médicos com vínculo no CNES por mil habitantes. A parcela da população soma os habitantes de cada faixa.', ds: ['municipios'], sec: 'mapa', v: (S) => `${F.int(S.mun_baixa)} de ${F.int(S.n_mun)} abaixo de 1 por mil · ${F.int(S.mun_zero)} sem médico` },
    br_vinc: { t: 'Vínculos médicos em hospitais e UPAs, Brasil parcial', como: 'Soma dos vínculos médicos de todos os hospitais, UPAs, prontos atendimentos e unidades mistas ativos no CNES nos estados com relatório, consultados por estabelecimento. Estatutário inclui cedidos e comissionados; PJ inclui o autônomo PJ e o intermediado por empresa; autônomo pessoa física é o médico pago como pessoa física.', ds: ['hospitais'], calc: 'kpi_vinc', sec: 'hospitais', v: (S) => `${F.int(S.vinc.vinculos)} vínculos em ${F.int(S.vinc.unidades)} unidades` },
    br_hora: { t: 'Valor da hora médica, Brasil parcial', como: 'Todos os valores com hora calculável dos gráficos “Quanto vale a hora médica” dos painéis estaduais, juntos: o plantão dividido pelas suas horas e o valor mensal dividido pela carga semanal vezes 4,345 semanas. Cada valor com documento conta uma vez. A mediana e a faixa dos 50% do meio são calculadas sobre todos os valores do grupo. Valores da equipe não entram.', ds: ['valores'], calc: 'hora', sec: 'contratacao', v: (S) => `plantão ${S.hora.plantao.n} · hora avulsa ${S.hora.hora.n} · carga semanal ${S.hora.carga.n} valores` },
    br_p24: { t: 'Plantão de 24h em prefeituras, Brasil parcial', como: 'Mediana de todos os valores de plantão de 24h pagos por prefeituras que os indicadores estaduais usam: editais e credenciamentos no PNCP e, onde o relatório do estado inclui, concursos e seleções.', ds: ['valores'], calc: 'val_kpi', sec: 'contratacao', v: (S) => (S.n24 ? `${S.n24} valores · mediana ${F.brl0(S.p24)}` : 'nenhum valor publicado') },
    br_serie: { t: 'Vínculos médicos no CNES, 2022 a 2026', como: 'Soma dos médicos com vínculo ativo no CNES em setembro de cada ano nos estados com relatório (TabNet, mesma competência em cada ano).', ds: ['serie'], sec: 'ociosas', v: (S) => `${F.int(S.serie[0].medicos)} → ${F.int(S.serie[S.serie.length - 1].medicos)}` },
    relatorio: { t: 'Relatório estadual', como: 'Painel publicado com os três relatórios do estado (mapeamento médico, contratação e valores, mapa de preços). Data do relatório: a da última atualização dos seus conjuntos de dados.', ds: [], sec: 'mapa', v: (S) => dBR(S.relatorio_em) },
    n_mun: { t: 'Municípios mapeados', como: 'Número de municípios na tabela de médicos por município de cada relatório.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => F.int(S.n_mun) },
    pop: { t: 'População estimada (IBGE 2025)', como: 'Soma da população estimada pelo IBGE para 2025 em todos os municípios do estado.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => F.int(S.pop) },
    medicos: { t: 'Médicos com vínculo no CNES', como: 'Soma dos médicos com vínculo ativo em cada município (CNES, TabNet de Recursos Humanos, competência de setembro de 2026). Um médico que atua em dois municípios conta em cada um, por isso o total é de vínculos por município.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => F.int(S.medicos) },
    dens: { t: 'Médicos por mil habitantes', como: 'Médicos com vínculo no CNES divididos pela população estimada do IBGE para 2025, vezes mil, somando todos os municípios.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => F.d2(S.dens) },
    mun_baixa: { t: 'Municípios abaixo de 1 médico por mil habitantes', como: 'Municípios com menos de 1 médico por mil habitantes; a parcela da população soma os habitantes desses municípios.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => `${F.int(S.mun_baixa)} de ${F.int(S.n_mun)} (${F.pct(S.pop_baixa / S.pop)} da população)` },
    mun_zero: { t: 'Municípios sem médico registrado', como: 'Municípios com zero médicos com vínculo no CNES na competência do relatório.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => F.int(S.mun_zero) },
    conc: { t: 'Concentração nos polos', como: 'Parcela dos médicos do estado registrados nos municípios-polo de cada relatório.', ds: ['municipios'], calc: 'kpi', sec: 'mapa', v: (S) => `${F.pct(S.conc_share)} em ${S.polos}` },
    cresc_cnes: { t: 'Crescimento do cadastro médico, 2022 a 2026', como: 'Médicos com vínculo ativo no CNES em setembro de 2026 comparados com setembro de 2022 (TabNet, mesma competência em cada ano).', ds: ['serie'], sec: 'ociosas', v: (S) => F.signed(S.cresc_cnes) },
    int_100k: { t: 'Intensivistas por 100 mil habitantes', como: 'Médicos com especialidade de medicina intensiva no CNES divididos pela população estimada, vezes 100 mil.', ds: ['especialidades', 'municipios'], sec: 'ociosas', v: (S) => `${F.d2(S.int_100k)} (${F.int(S.intensivistas)} intensivistas)` },
    ped: { t: 'Pediatras por 100 mil crianças de 0 a 14 anos', como: 'Pediatras no CNES divididos pela população de 0 a 14 anos do Censo 2022, vezes 100 mil.', ds: ['especialidades', 'indicadores'], sec: 'ociosas', v: (S) => (S.ped_100k_criancas !== null ? F.d1(S.ped_100k_criancas) : 'outra base no relatório') },
    vinc: { t: 'Vínculos médicos nos hospitais e UPAs', como: 'Vínculos médicos de todos os hospitais, UPAs, prontos atendimentos e unidades mistas ativos no CNES, consultados por estabelecimento. Estatutário inclui cedidos e comissionados; PJ inclui o autônomo PJ e o intermediado por empresa; autônomo PF é o médico pago como pessoa física.', ds: ['hospitais'], calc: 'kpi_vinc', sec: 'hospitais', v: (S) => `${F.int(S.vinc.vinculos)} vínculos em ${F.int(S.vinc.unidades)} unidades` },
    vinc_est: { t: 'Vínculos de concursados', como: 'Vínculos estatutários sobre o total de vínculos médicos nos hospitais e UPAs (CNES).', ds: ['hospitais'], calc: 'kpi_vinc', sec: 'hospitais', v: (S) => F.pct1(S.vinc.est / S.vinc.vinculos) },
    vinc_tmp: { t: 'Vínculos por prazo determinado', como: 'Contratos por tempo determinado sobre o total de vínculos médicos nos hospitais e UPAs (CNES).', ds: ['hospitais'], calc: 'kpi_vinc', sec: 'hospitais', v: (S) => F.pct1(S.vinc.tmp / S.vinc.vinculos) },
    vinc_pj: { t: 'Vínculos PJ', como: 'Médicos contratados por meio de pessoa jurídica (autônomo PJ ou intermediado) sobre o total de vínculos médicos nos hospitais e UPAs (CNES).', ds: ['hospitais'], calc: 'kpi_vinc', sec: 'hospitais', v: (S) => F.pct1(S.vinc.pj / S.vinc.vinculos) },
    vinc_pf: { t: 'Vínculos de autônomo pessoa física', como: 'Médicos pagos como pessoa física sobre o total de vínculos médicos nos hospitais e UPAs (CNES).', ds: ['hospitais'], calc: 'kpi_vinc', sec: 'hospitais', v: (S) => F.pct1(S.vinc.pf / S.vinc.vinculos) },
    p24: { t: 'Plantão de 24h em prefeituras, mediana', como: 'Mediana dos valores de plantão de 24h pagos por prefeituras (editais e credenciamentos no PNCP, concursos e seleções), o mesmo indicador do topo da seção de contratação do painel.', ds: ['valores'], calc: 'val_kpi', sec: 'contratacao', v: (S) => (S.n24 ? `${F.brl0(S.p24)} (${F.brl(S.p24h)}/h, ${S.n24} valores)` : 'sem valor publicado') },
    hora_plantao: { t: 'Hora de plantão, mediana', como: 'Mediana do valor por hora de todos os plantões do gráfico “Quanto vale a hora médica” do painel (credenciamento, licitação, concurso, seleção e plantão pago pelo Estado). Valores da equipe não entram.', ds: ['valores'], calc: 'hora', sec: 'contratacao', v: (S) => (S.hora.plantao.n ? `${F.brl(S.hora.plantao.mediana)} (${S.hora.plantao.n} valores)` : 'sem valor') },
    hora_hora: { t: 'Hora avulsa contratada, mediana', como: 'Mediana do valor por hora contratado de empresa ou credenciado por hora de serviço médico (pregões e credenciamentos no PNCP).', ds: ['valores'], calc: 'hora', sec: 'contratacao', v: (S) => (S.hora.hora.n ? `${F.brl(S.hora.hora.mediana)} (${S.hora.hora.n} valores)` : 'sem valor') },
    hora_carga: { t: 'Carga semanal ou salário, mediana por hora', como: 'Mediana do valor por hora de salários e cargas semanais (concursos, seleções, contratos por carga), dividindo o valor mensal pela carga semanal vezes 4,345 semanas.', ds: ['valores'], calc: 'hora', sec: 'contratacao', v: (S) => (S.hora.carga.n ? `${F.brl(S.hora.carga.mediana)} (${S.hora.carga.n} valores)` : 'sem valor') },
    cons_esp: { t: 'Preço mediano da consulta especializada', como: 'Mediana dos preços unitários de consulta da especialidade em credenciamentos e pregões do estado. Os nomes de especialidade foram agrupados por código para comparar estados (por exemplo, Pediatra e Pediatria).', ds: ['consultas'], calc: 'cons_esp', sec: 'contratacao', v: null },
    usg: { t: 'Ultrassonografia, preço mediano por exame', como: 'Mediana dos preços unitários de ultrassonografia em credenciamentos e pregões do estado.', ds: ['consultas'], calc: 'cons_esp', sec: 'contratacao', v: (S) => (S.usg ? `${F.brl(S.usg.mediana)} (${S.usg.n} valores)` : 'sem valor') },
    rem_estado: { t: 'Remuneração de referência do médico do Estado', como: 'Primeira linha da tabela de salários de cada painel: remuneração média paga ao médico efetivo do Estado ou, onde não há folha pública, o salário inicial do concurso. A descrição de cada valor diz o que ele mede.', ds: ['salarios'], sec: 'concursos', v: (S) => (S.remuneracao_estado ? F.brl0(S.remuneracao_estado.valor) : '—') },
    concurso: { t: 'Concurso estadual: vagas de médico', como: 'Indicador de concurso de cada painel, com a data e a fonte da informação.', ds: ['indicadores'], sec: 'concursos', v: (S) => (S.concurso && S.concurso.valor !== null && S.concurso.valor !== 'Não localizado' ? F.int(Number(S.concurso.valor)) : 'Não localizado') },
    n_mapa: { t: 'Valores no mapa de preços', como: 'Linhas do mapa de preços do painel: remuneração, consultas e exames, cada uma com documento de origem e link.', ds: ['valores', 'consultas'], calc: 'mapa_kpi', sec: 'contratacao', v: (S) => `${F.int(S.n_mapa)} de ${F.int(S.n_documentos)} documentos` },
    n_contratos: { t: 'Contratos e credenciados', como: 'Contratos e credenciamentos de serviço médico publicados no PNCP, sem laboratórios.', ds: ['contratos'], sec: 'contratacao', v: (S) => `${F.int(S.n_contratos)} (${F.brlmi(S.contratos_valor_global)} somados)` },
    n_noticias: { t: 'Notícias no relatório', como: 'Reportagens e publicações sobre falta de médicos, contratação e pagamento reunidas no relatório.', ds: ['noticias'], sec: 'noticias', v: (S) => F.int(S.n_noticias) },
    share_60: { t: 'Pessoas com 60 anos ou mais', como: 'População de 60 anos ou mais sobre a população total, Censo 2022.', ds: ['indicadores', 'municipios'], calc: 'demo', sec: 'demografia', v: (S) => (S.demo ? F.pct1(S.demo.share_60) : 'não levantado') },
    cobertura: { t: 'População com plano de saúde', como: 'Beneficiários de planos médico-hospitalares (ANS, dez/2025) sobre a população estimada.', ds: ['indicadores', 'municipios'], calc: 'demo', sec: 'demografia', v: (S) => (S.demo ? F.pct1(S.demo.cobertura) : 'não levantado') },
  };
  // ---------- news (home + page)
  function allNews() {
    const off = (APP.news || []).map((n) => ({ ...n, origem: 'relatorio' }));
    const auto = APP.auto.noticias.map((n) => ({ ...n, origem: 'auto', uf: String(n.uf || '').toLowerCase() }));
    const seen = new Set(off.map((n) => n.url));
    return off.concat(auto.filter((n) => !seen.has(n.url))).sort((a, b) => String(b.data).localeCompare(String(a.data)));
  }
  function newsItem(n) {
    const S = APP.P.estados[n.uf];
    return h('article', { class: 'mx-newsitem', dataset: { fonte: n.origem === 'auto' ? 'auto_noticia' : 'n_noticias', uf: n.uf } },
      h('div', { class: 'mx-newsdate', text: dBR(n.data) }),
      h('div', null,
        h('div', { class: 'mx-newsmeta' }, S ? h('span', { class: 'mx-tag uf', text: S.sigla }) : null, n.tema ? h('span', { class: 'mx-tag', text: n.tema }) : null, n.origem === 'auto' ? h('span', { class: 'mx-tag auto', text: 'atualização semanal' }) : null, h('span', { text: [n.local, n.veiculo].filter(Boolean).join(' · ') })),
        isUrl(n.url) ? h('a', { class: 'mx-newslink', href: n.url, target: '_blank', rel: 'noopener', text: n.resumo }) : h('span', { class: 'mx-newslink', text: n.resumo })));
  }
  function renderHomeNews() {
    const box = $('#mx-p-news');
    if (!box || !APP.news) return;
    box.replaceChildren(...allNews().slice(0, 5).map(newsItem));
  }
  const NEWS = { uf: '', tema: '', q: '' };
  let newsBuilt = false;
  function renderNews() {
    if (!APP.news) { $('#mx-news-list').replaceChildren(h('p', { class: 'mx-note', text: 'Carregando notícias…' })); return; }
    const all = allNews();
    if (!newsBuilt) {
      newsBuilt = true;
      $('#mx-news-q').addEventListener('input', debounce((e) => { NEWS.q = e.target.value; renderNews(); }, 120));
      $('#mx-news-tema').addEventListener('change', (e) => { NEWS.tema = e.target.value; renderNews(); });
    }
    const chips = [['', 'Todos os estados']].concat(APP.P.ordem.map((uf) => [uf, APP.P.estados[uf].nome]));
    $('#mx-news-filters').replaceChildren(...chips.map(([uf, nome]) => {
      const n = all.filter((x) => !uf || x.uf === uf).length;
      return h('button', { type: 'button', class: 'mx-chip', 'aria-pressed': String(NEWS.uf === uf), onclick: () => { NEWS.uf = uf; renderNews(); } }, nome, h('span', { class: 'mx-num', style: 'opacity:.6', text: String(n) }));
    }));
    const temas = Array.from(new Set(all.map((n) => n.tema).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const sel = $('#mx-news-tema');
    if (sel.options.length !== temas.length + 1) sel.replaceChildren(h('option', { value: '', text: 'Todos os temas' }), ...temas.map((t) => h('option', { value: t, text: t })));
    sel.value = NEWS.tema;
    const q = norm(NEWS.q);
    const rows = all.filter((n) => (!NEWS.uf || n.uf === NEWS.uf) && (!NEWS.tema || n.tema === NEWS.tema) && (!q || norm([n.local, n.tema, n.resumo, n.veiculo].join(' ')).includes(q)));
    $('#mx-news-count').textContent = rows.length === all.length ? `${F.int(all.length)} notícias` : `${F.int(rows.length)} de ${F.int(all.length)} notícias`;
    const out = [];
    let mes = null;
    for (const n of rows) {
      const m = String(n.data).slice(0, 7);
      if (m !== mes) { mes = m; const [a, mm] = m.split('-'); out.push(h('h3', { class: 'mx-newsmonth', text: (MESL[+mm - 1] || '') + ' de ' + a })); }
      out.push(newsItem(n));
    }
    $('#mx-news-list').replaceChildren(...(out.length ? out : [h('div', { class: 'mx-empty' }, h('b', { text: 'Nenhuma notícia com esses filtros.' }), h('span', { text: 'Limpe a busca ou escolha outro estado.' }))]));
  }

  // ================================================================== STATE PAGE
  let CUR = null, LOADING_UF = null;
  function closeState() {
    if (!CUR && !LOADING_UF) return;
    if (CUR) { if (CUR.ro) CUR.ro.disconnect(); if (CUR.io) CUR.io.disconnect(); }
    CUR = null; LOADING_UF = null;
    $('#mx-state-root').replaceChildren();
    const st = $('#mx-state-style'); if (st) st.textContent = '';
    document.documentElement.style.removeProperty('--st');
    window.TM = undefined;
  }
  function nextRun() {
    if (!SCHEDULE) return null;
    const d = new Date();
    const r = new Date(d); r.setHours(SCHEDULE.h, SCHEDULE.m, 0, 0);
    let add = (SCHEDULE.dow - d.getDay() + 7) % 7;
    if (add === 0 && d >= r) add = 7;
    r.setDate(r.getDate() + add);
    return r;
  }
  function renderLocator(uf) {
    const u = APP.BR.ufs.find((x) => x.uf.toLowerCase() === uf);
    if (!u) return;
    const nums = u.d.match(/-?\d+(\.\d+)?/g).map(Number);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let k = 0; k + 1 < nums.length; k += 2) { const x = nums[k], y = nums[k + 1]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
    const svg = sv('svg', { viewBox: `${x0 - pad} ${y0 - pad} ${x1 - x0 + 2 * pad} ${y1 - y0 + 2 * pad}` });
    svg.append(sv('defs', null, sv('linearGradient', { id: 'mx-silg', x1: 0, x2: 0.5, y1: 0, y2: 1 }, sv('stop', { offset: '0%', style: 'stop-color:#3FE6F7' }), sv('stop', { offset: '100%', style: 'stop-color:var(--st)' })),
      sv('filter', { id: 'mx-silglow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, sv('feGaussianBlur', { stdDeviation: (x1 - x0) * 0.03, result: 'b' }), sv('feMerge', null, sv('feMergeNode', { in: 'b' }), sv('feMergeNode', { in: 'SourceGraphic' })))));
    svg.append(sv('path', { d: u.d, fill: 'url(#mx-silg)', filter: 'url(#mx-silglow)' }));
    $('#mx-st-locator').replaceChildren(svg);
  }
  async function openState(uf) {
    if ((CUR && CUR.uf === uf) || LOADING_UF === uf) return;
    closeState();
    LOADING_UF = uf;
    const S = APP.P.estados[uf], man = APP.man[uf];
    document.documentElement.style.setProperty('--st', ST_COLOR[uf]);
    $('#mx-st-eyebrow').textContent = `Relatório estadual · ${S.sigla}`;
    $('#mx-st-name').textContent = S.nome;
    $('#mx-st-meta').replaceChildren(...[
      h('span', { dataset: { fonte: 'relatorio', uf } }, 'Relatório de ', h('b', { text: dBR(S.relatorio_em) })),
      S.revisado_em ? h('span', null, 'Revisado em ', h('b', { text: dBR(S.revisado_em) })) : null,
      h('span', null, 'CNES ', h('b', { text: compBR(S.cnes_competencia) })),
      h('span', null, h('b', { text: F.int(S.n_mun) }), ' municípios'),
      h('span', null, h('b', { text: F.int(S.pop) }), ' habitantes'),
      h('span', null, h('b', { text: F.int(S.n_mapa) }), ' valores com fonte')].filter(Boolean));
    $('#mx-st-orig').href = S.url;
    $('#mx-st-addval').onclick = () => { APP.prefUF = uf; };
    renderLocator(uf);
    const root = $('#mx-state-root');
    const ids = Object.keys(man.datasets);
    const bar = h('i'), lbl = h('span', { class: 'mx-note', text: `Carregando ${ids.length} conjuntos de dados do relatório…` });
    root.replaceChildren(h('div', { class: 'mx-loading' }, lbl, h('div', { class: 'bar' }, bar), h('div', { class: 'dash-skeleton', style: 'min-height:320px' })));
    const data = {};
    let done = 0;
    try {
      await Promise.all(ids.map((id) => getJSON(`data/${uf}/${id}.json`).then((rows) => { data[id] = rows; done += 1; bar.style.width = (done / ids.length * 100) + '%'; })));
    } catch (e) {
      if (LOADING_UF === uf) root.replaceChildren(h('div', { class: 'mx-msg err', text: 'Os dados do relatório não carregaram (' + e.message + '). Recarregue a página.' }));
      LOADING_UF = null;
      return;
    }
    if (LOADING_UF !== uf) return;
    const mod = window.MX_ESTADOS && window.MX_ESTADOS[uf];
    if (!mod) { root.replaceChildren(h('div', { class: 'mx-msg err', text: 'O painel deste estado não carregou. Recarregue a página.' })); LOADING_UF = null; return; }
    let st = $('#mx-state-style');
    if (!st) { st = document.createElement('style'); st.id = 'mx-state-style'; document.head.appendChild(st); }
    st.textContent = mod.css;
    root.innerHTML = mod.markup;
    const tm = root.querySelector('.tm');
    const nav = tm.querySelector('.tm-nav'), kpis = tm.querySelector('.tm-kpis');
    if (nav && kpis) tm.insertBefore(nav, kpis);
    const ctx = makeCtx(uf, root, data, man);
    try { mod.run(ctx.dash); } catch (e) { console.error('painel', uf, e); root.prepend(h('div', { class: 'mx-msg err', text: 'Parte do painel não carregou: ' + e.message })); }
    injectTeamCard(ctx); injectNovidades(ctx); injectDownloads(ctx);
    ctx.runAll();
    CUR = ctx; LOADING_UF = null;
    // scroll spy
    const btns = $$('.tm-nav button', root);
    ctx.io = new IntersectionObserver((ents) => {
      for (const en of ents) if (en.isIntersecting) btns.forEach((b) => b.setAttribute('aria-current', String((b.dataset.go || b.dataset.mxGo) === en.target.id)));
    }, { rootMargin: '-35% 0px -60% 0px' });
    $$('.tm-sec', root).forEach((s) => ctx.io.observe(s));
    let lastW = root.clientWidth;
    ctx.ro = new ResizeObserver(debounce(() => { const w = root.clientWidth; if (Math.abs(w - lastW) > 8) { lastW = w; ctx.runCharts(); } }, 160));
    ctx.ro.observe(root);
    if (APP.pendingSec) { const t = document.getElementById(APP.pendingSec); APP.pendingSec = null; if (t) setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
  }
  function makeCtx(uf, root, data, man) {
    const ctx = { uf, root, data, man, calcs: {}, cache: {}, draws: {}, onData: [] };
    const cols = (rows) => (Array.isArray(rows) && rows.length ? Object.keys(rows[0]) : []);
    const dash = {
      data(id) {
        if (id in ctx.data) return { status: 'ok', data: ctx.data[id], columns: cols(ctx.data[id]), meta: [], refreshing: false };
        const c = ctx.calcs[id];
        if (c) {
          if (!(id in ctx.cache)) {
            try { ctx.cache[id] = c.fn(...c.inputs.map((i) => dash.data(i).data)); }
            catch (e) { console.error('cálculo', id, e); return { status: 'error', data: [], message: String(e) }; }
          }
          return { status: 'ok', data: ctx.cache[id], columns: cols(ctx.cache[id]), meta: [], refreshing: false };
        }
        return { status: 'missing', data: [], message: 'conjunto não encontrado' };
      },
      calc(id, def) {
        if (id === 'hora') {
          const orig = def.fn;
          def = Object.assign({}, def, { orig, fn: (...a) => { const out = orig(...a); return APP.teamOn ? out.concat(teamHoraRows(uf)) : out; } });
        }
        ctx.calcs[id] = def;
      },
      draw(name, fn) { if (typeof fn === 'function') { ctx.draws[name] = fn; return; } run(name); },
      onData(fn) { ctx.onData.push(fn); },
      loader() {}, setLink() {}, refresh() {}, params: () => ({}), setParams() {}, resetParams() {},
      colors: SERIES.slice(),
    };
    function run(name) {
      const fn = ctx.draws[name];
      if (!fn) return;
      root.querySelectorAll(`[data-draw="${name}"]`).forEach((el) => { try { fn(el); } catch (e) { console.error('desenho', name, e); } });
    }
    ctx.dash = dash; ctx.run = run;
    ctx.runAll = () => { Object.keys(ctx.draws).forEach(run); ctx.onData.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); };
    ctx.runCharts = () => { const names = new Set(); root.querySelectorAll('.tm-chart[data-draw], .tm-map[data-draw]').forEach((el) => names.add(el.dataset.draw)); names.forEach(run); };
    return ctx;
  }

  // team card inside the state dashboard
  function injectTeamCard(ctx) {
    const hc = ctx.root.querySelector('#valor-hora');
    if (!hc) return;
    const card = hc.closest('.tm-card');
    const leg = card.querySelector('.tm-legend');
    if (leg) leg.append(h('span', { class: 'mx-teamleg' }, h('i', { class: 'tm-sw', style: 'background:var(--team)' }), 'Informado pela equipe'));
    const team = h('div', { class: 'tm-card mx-teamcard', id: 'mx-teamcard', 'data-source': 'valores_equipe' });
    card.after(team);
    ctx.teamCard = team;
    updateTeamCard(ctx);
  }
  function updateTeamCard(ctx) {
    const card = ctx.teamCard;
    if (!card) return;
    const S = APP.P.estados[ctx.uf];
    const rows = teamAtivos(ctx.uf).sort((a, b) => String(b.mes).localeCompare(String(a.mes)) || String(b.criado_em).localeCompare(String(a.criado_em)));
    const leg = ctx.root.querySelector('.mx-teamleg'); if (leg) leg.hidden = !APP.teamOn || !rows.some((r) => Number(r.valor_hora) > 0);
    const offRows = (ctx.calcs.hora && ctx.calcs.hora.orig) ? ctx.calcs.hora.orig(ctx.data.valores) : [];
    const offPl = median(offRows.filter((r) => /Plantão/i.test(r.categoria)).map((r) => r.valor_hora));
    const tmPl = median(rows.filter((r) => /^Plantão/.test(r.forma) && Number(r.valor_hora) > 0).map((r) => Number(r.valor_hora)));
    const kids = [
      h('h3', { class: 'tm-card-h' }, h('span', { class: 'mx-teamdot' }), 'Valores informados pela equipe'),
      h('p', { class: 'tm-card-n', text: `Apurados em contato direto com médicos e registrados na página Valores da equipe. Ficam fora dos indicadores e do mapa de preços do relatório; no gráfico acima aparecem como uma linha própria em rosa${APP.teamOn ? '' : ' (a camada está desligada no momento)'}.` }),
      h('div', { class: 'mx-kpis' },
        h('div', { class: 'mx-kpi' }, h('span', { text: 'Valores em uso' }), h('b', { text: F.int(rows.length) }), h('small', { text: rows.length ? 'último: ' + compBR(rows[0].mes) : 'nenhum ainda' })),
        h('div', { class: 'mx-kpi' }, h('span', { text: 'Hora de plantão, equipe (mediana)' }), h('b', { style: 'color:var(--team)', text: tmPl ? F.brl(tmPl) : '—' }), h('small', { text: ((n) => n + (n === 1 ? ' plantão informado' : ' plantões informados'))(rows.filter((r) => /^Plantão/.test(r.forma)).length) })),
        h('div', { class: 'mx-kpi', dataset: { source: 'hora' } }, h('span', { text: 'Hora de plantão no relatório (mediana)' }), h('b', { text: offPl ? F.brl(offPl) : '—' }), h('small', { text: tmPl && offPl ? 'equipe ' + F.signed(tmPl / offPl - 1) + ' em relação ao relatório' : 'documentos públicos' }))),
    ];
    if (APP.dbState === 'off') kids.push(h('p', { class: 'mx-note', text: 'O banco de valores da equipe não está disponível nesta visualização. Abra o site pelo claude.ai com sua conta para ver e registrar valores.' }));
    if (rows.length) {
      kids.push(h('div', { class: 'tm-tbl-wrap tm-short' }, h('table', { class: 'tm-tbl' },
        h('thead', null, h('tr', null, ...['Mês', 'Município', 'Contratante', 'Especialidade', 'Forma', 'Valor', 'Por hora', 'Vínculo', 'Origem', 'Registrado por'].map((t, i) => h('th', { class: [5, 6].includes(i) ? 'num' : (i >= 7 ? 'tm-hide-sm' : null), text: t })))),
        h('tbody', null, ...rows.map((r) => h('tr', null, h('td', { class: 'num', text: compBR(r.mes) }), h('td', { text: r.municipio }), h('td', { text: r.contratante }), h('td', { text: r.especialidade }), h('td', { text: r.forma === 'Mensal' ? `Mensal, ${r.carga}h/sem` : r.forma }),
          h('td', { class: 'num', text: F.brl(Number(r.valor)) }), h('td', { class: 'num', text: Number(r.valor_hora) > 0 ? F.brl(Number(r.valor_hora)) : '—' }), h('td', { class: 'tm-hide-sm', text: r.vinculo || '—' }), h('td', { class: 'tm-hide-sm', text: r.origem + (r.detalhe ? ' · ' + r.detalhe : '') }), h('td', { class: 'tm-hide-sm', text: nomeDe(r.autor) })))))));
    } else if (APP.dbState !== 'off') {
      kids.push(h('div', { class: 'mx-empty' }, h('b', { text: 'Nenhum valor registrado para ' + S.nome + ' ainda.' }), h('span', { text: 'Quando a equipe registrar um plantão, uma hora ou um salário apurado com médicos, ele aparece aqui e no gráfico de hora médica.' })));
    }
    kids.push(h('div', null, h('a', { class: 'mx-btn ghost sm', href: '#valores-da-equipe', onclick: () => { APP.prefUF = ctx.uf; }, text: 'Registrar valor em ' + S.nome })));
    card.replaceChildren(...kids);
  }
  function injectNovidades(ctx) {
    const card = ctx.teamCard;
    if (!card) return;
    const nv = h('div', { class: 'tm-card', id: 'mx-novidades', 'data-source': 'auto_valores' });
    card.after(nv);
    ctx.novCard = nv;
    updateNovidades(ctx);
  }
  function updateNovidades(ctx) {
    const box = ctx.novCard;
    if (!box) return;
    const S = APP.P.estados[ctx.uf], U = ctx.uf.toUpperCase();
    const desde = String(S.relatorio_em).slice(0, 10);
    const vals = APP.auto.valores.filter((r) => String(r.uf).toUpperCase() === U && String(r.data) >= desde).sort((a, b) => String(b.data).localeCompare(String(a.data)));
    const cons = APP.auto.contratos.filter((r) => String(r.uf).toUpperCase() === U && String(r.data || r.inicio) >= desde).sort((a, b) => String(b.data || b.inicio).localeCompare(String(a.data || a.inicio)));
    const last = APP.updates[0];
    const kids = [
      h('h3', { class: 'tm-card-h', text: 'Novo desde o relatório: atualização semanal do PNCP' }),
      h('p', { class: 'tm-card-n', text: `Contratações e contratos de serviço médico publicados no PNCP a partir de ${dBR(S.relatorio_em)}, encontrados pela varredura semanal por modalidade. Não entram nos indicadores do relatório até a próxima revisão do estado. ${last && last.status !== 'Base inicial' ? 'Última varredura: ' + dBR(last.data) + '. ' : ''}${SCHEDULE ? `Próxima: ${SCHEDULE.dia}, ${dBR(nextRun().toISOString())}, às ${SCHEDULE.hora}.` : 'A atualização semanal ainda não foi agendada.'}` }),
    ];
    if (!vals.length && !cons.length) {
      kids.push(h('div', { class: 'mx-empty' }, h('b', { text: last && last.status !== 'Base inicial' ? 'Nada novo nesta semana.' : 'Nenhuma varredura feita ainda.' }), h('span', { text: last && last.status !== 'Base inicial' ? 'A varredura não encontrou contratação de serviço médico nova neste estado.' : 'Quando a atualização semanal for agendada, os resultados aparecem aqui.' })));
    }
    if (vals.length) {
      kids.push(h('div', { class: 'tm-tbl-wrap tm-short' }, h('table', { class: 'tm-tbl' },
        h('thead', null, h('tr', null, ...['Data', 'Município', 'Órgão', 'Descrição', 'Valor', 'Base', 'Por hora', 'Fonte'].map((t, i) => h('th', { class: [4, 6].includes(i) ? 'num' : (i === 2 ? 'tm-hide-sm' : null), text: t })))),
        h('tbody', null, ...vals.map((r) => h('tr', null, h('td', { class: 'num', text: dBR(r.data) }), h('td', { text: r.municipio || '—' }), h('td', { class: 'tm-hide-sm', text: r.orgao || '—' }), h('td', { text: r.descricao || '—' }),
          h('td', { class: 'num', text: Number(r.valor) > 0 ? F.brl(Number(r.valor)) : '—' }), h('td', { text: r.base || '—' }), h('td', { class: 'num', text: Number(r.valor_hora) > 0 ? F.brl(Number(r.valor_hora)) : '—' }),
          h('td', null, isUrl(r.url) ? h('a', { href: r.url, target: '_blank', rel: 'noopener', text: r.controle_pncp || 'abrir' }) : (r.controle_pncp || '—'))))))));
    }
    if (cons.length) {
      kids.push(h('p', { class: 'tm-card-n', style: 'margin-top:8px', text: `${F.int(cons.length)} contratos novos` }));
      kids.push(h('div', { class: 'tm-tbl-wrap tm-short' }, h('table', { class: 'tm-tbl' },
        h('thead', null, h('tr', null, ...['Início', 'Município', 'Contratado', 'Objeto', 'Valor global', 'Fonte'].map((t, i) => h('th', { class: i === 4 ? 'num' : null, text: t })))),
        h('tbody', null, ...cons.map((r) => h('tr', null, h('td', { class: 'num', text: dBR(r.inicio || r.data) }), h('td', { text: r.municipio || '—' }), h('td', { text: (r.fornecedor || '—') + (r.cnpj ? ' · ' + r.cnpj : '') }), h('td', { text: r.objeto || '—' }),
          h('td', { class: 'num', text: Number(r.valor_global) > 0 ? F.brl0(Number(r.valor_global)) : '—' }), h('td', null, isUrl(r.url) ? h('a', { href: r.url, target: '_blank', rel: 'noopener', text: 'abrir' }) : '—')))))));
    }
    box.replaceChildren(...kids);
  }
  function injectDownloads(ctx) {
    const tm = ctx.root.querySelector('.tm'), nav = ctx.root.querySelector('.tm-nav');
    const sec = h('section', { class: 'tm-sec', id: 'mx-dados' });
    const list = h('div');
    const mk = (id, title, desc, n, upd, rowsFn, isCalc) => h('div', { class: 'mx-dsrow' },
      h('div', null, h('b', { text: title }), h('p', { text: `${desc}${desc ? ' ' : ''}${F.int(n)} linhas${upd ? ' · atualizado em ' + dBR(upd) : ''}${isCalc ? ' · calculado no painel' : ''}.` })),
      h('div', { class: 'mx-rowacts' },
        h('button', { type: 'button', class: 'mx-btn ghost sm', onclick: () => baixarCSV(`${ctx.uf}_${id}`, rowsFn()), text: 'CSV' }),
        h('button', { type: 'button', class: 'mx-btn ghost sm', onclick: () => baixarJSON(`${ctx.uf}_${id}`, rowsFn()), text: 'JSON' })));
    for (const [id, m] of Object.entries(ctx.man.datasets)) list.append(mk(id, m.title, m.description, m.rows, m.updated, () => ctx.data[id]));
    for (const id of ['mapa', 'hora', 'cons_esp', 'regioes']) {
      const c = ctx.calcs[id];
      if (!c) continue;
      const rows = ctx.dash.data(id).data || [];
      list.append(mk(id, c.title, c.description, rows.length, null, () => ctx.dash.data(id).data, true));
    }
    sec.append(h('h2', { class: 'tm-sec-h', text: 'Dados e downloads' }),
      h('p', { class: 'tm-sec-p', text: 'Todos os conjuntos que alimentam este painel, como foram publicados no relatório. O CSV abre direto no Excel em português (separador ponto e vírgula e vírgula decimal); o JSON guarda os campos como estão.' }),
      list);
    tm.append(sec);
    if (nav) {
      const b = h('button', { type: 'button', dataset: { mxGo: 'mx-dados' }, text: 'Dados e downloads' });
      b.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      nav.append(b);
    }
  }

  // ================================================================== TEAM PAGE
  let teamBuilt = false;
  const TEAMF = { uf: '', st: 'ativo', q: '' };
  function setDb(state) {
    APP.dbState = state;
    const msg = $('#mx-form-state'), btn = $('#f-submit');
    if (!msg) return;
    if (state === 'loading') { msg.hidden = false; msg.className = 'mx-msg'; msg.textContent = 'Conectando ao banco de valores da equipe…'; btn.disabled = true; }
    else if (state === 'ok') { msg.hidden = true; btn.disabled = false; }
    else { msg.hidden = false; msg.className = 'mx-msg err'; msg.textContent = 'Para registrar valores, abra o site pelo claude.ai, entrando com a sua conta. Quem recebeu o site só com permissão de visualização não consegue gravar: peça ao responsável acesso com permissão de uso.'; btn.disabled = true; }
    if (PAGE === 'valores-da-equipe') renderTeamList();
    if (CUR) updateTeamCard(CUR);
  }
  function renderTeamPage() {
    if (!teamBuilt) {
      teamBuilt = true;
      const sel = $('#f-uf');
      const og1 = h('optgroup', { label: 'Estados com relatório' }, ...APP.P.ordem.map((uf) => h('option', { value: uf, text: APP.P.estados[uf].nome })));
      const others = APP.BR.ufs.filter((u) => !APP.P.estados[u.uf.toLowerCase()]).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      const og2 = h('optgroup', { label: 'Outros estados (ficam guardados para relatórios futuros)' }, ...others.map((u) => h('option', { value: u.uf.toLowerCase(), text: u.nome })));
      sel.replaceChildren(og1, og2);
      const now = new Date();
      $('#f-mes').value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
      $('#f-mes').max = $('#f-mes').value;
      sel.addEventListener('change', fillMun);
      $('#f-forma').addEventListener('change', () => { $('#f-carga-wrap').hidden = $('#f-forma').value !== 'Mensal'; updatePreview(); });
      ['f-valor', 'f-carga'].forEach((id) => $('#' + id).addEventListener('input', updatePreview));
      $('#mx-form').addEventListener('submit', submitTeam);
      $('#mx-team-fuf').addEventListener('change', (e) => { TEAMF.uf = e.target.value; renderTeamList(); });
      $('#mx-team-fst').addEventListener('change', (e) => { TEAMF.st = e.target.value; renderTeamList(); });
      $('#mx-team-q').addEventListener('input', debounce((e) => { TEAMF.q = e.target.value; renderTeamList(); }, 120));
      $('#mx-team-csv').addEventListener('click', () => baixarCSV('valores_da_equipe', teamFiltered().map((r) => ({ estado: r.uf.toUpperCase(), municipio: r.municipio, contratante: r.contratante, quem_paga: r.esfera, especialidade: r.especialidade, forma: r.forma, carga_semanal: r.carga || null, valor: Number(r.valor), valor_hora: Number(r.valor_hora) || null, bruto_ou_liquido: r.bruto, vinculo: r.vinculo, mes: r.mes, origem: r.origem, detalhe: r.detalhe, observacoes: r.obs, situacao: r.status, registrado_por: nomeDe(r.autor), registrado_em: r.criado_em }))));
      setDb(APP.dbState);
    }
    if (APP.prefUF) { $('#f-uf').value = APP.prefUF; APP.prefUF = null; }
    fillMun(); updatePreview(); renderTeamList();
  }
  async function fillMun() {
    const uf = $('#f-uf').value, dl = $('#f-mun-list');
    if (!APP.mun) { try { APP.mun = await getJSON('data/municipios.json'); } catch (e) { APP.mun = {}; } }
    dl.replaceChildren(...(APP.mun[uf] || []).map((n) => h('option', { value: n })));
  }
  function updatePreview() {
    const forma = $('#f-forma').value, valor = Number($('#f-valor').value), carga = Number($('#f-carga').value);
    const horas = horasDe({ forma, carga });
    const b = $('#f-preview b'), sub = $('#f-preview-sub');
    if (forma === 'Por consulta') { b.textContent = valor > 0 ? F.brl(valor) : '—'; sub.textContent = 'por atendimento; não entra no gráfico de hora'; return; }
    b.textContent = valor > 0 && horas ? F.brl(valor / horas) : '—';
    sub.textContent = horas ? `por hora (${forma === 'Mensal' ? `${carga}h × ${LOC.format(',.3f')(SEMANAS_MES)} semanas = ${F.d1(horas)}h no mês` : F.int(horas) + (horas === 1 ? ' hora' : ' horas')})` : 'por hora: informe a carga semanal';
  }
  async function submitTeam(ev) {
    ev.preventDefault();
    const err = $('#mx-form-err');
    err.hidden = true;
    if (!APP.db) { err.hidden = false; err.textContent = 'O banco de valores não está disponível nesta visualização.'; return; }
    const v = (id) => $('#' + id).value.trim();
    const t = { uf: v('f-uf'), municipio: v('f-mun'), contratante: v('f-contratante'), esfera: v('f-esfera'), especialidade: v('f-esp'), forma: v('f-forma'), valor: Number($('#f-valor').value), bruto: v('f-bruto'), vinculo: v('f-vinculo'), mes: v('f-mes'), origem: v('f-origem'), detalhe: v('f-detalhe'), obs: v('f-obs') };
    if (t.forma === 'Mensal') t.carga = Number($('#f-carga').value);
    const faltam = [];
    if (!t.municipio) faltam.push('município');
    if (!t.contratante) faltam.push('contratante e unidade');
    if (!t.especialidade) faltam.push('especialidade');
    if (!(t.valor > 0)) faltam.push('valor');
    if (t.forma === 'Mensal' && !(t.carga >= 1 && t.carga <= 80)) faltam.push('carga semanal entre 1 e 80 horas');
    if (!/^\d{4}-\d{2}$/.test(t.mes)) faltam.push('mês de referência');
    if (faltam.length) { err.hidden = false; err.textContent = 'Preencha: ' + faltam.join(', ') + '.'; return; }
    if (t.mes > $('#f-mes').max) { err.hidden = false; err.textContent = 'O mês de referência não pode estar no futuro.'; return; }
    if (t.valor > 200000) { err.hidden = false; err.textContent = 'O valor parece alto demais para um pagamento médico. Confira se não há um zero a mais.'; return; }
    if (/\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\(?\d{2}\)?\s?9?\d{4}-?\d{4}/.test(t.detalhe + ' ' + t.obs)) { err.hidden = false; err.textContent = 'Tire o CPF ou telefone do detalhe e das observações: o site é visto por toda a equipe.'; return; }
    const horas = horasDe(t);
    const doc = Object.assign(t, {
      uf_nome: (APP.P.estados[t.uf] || APP.BR.ufs.find((u) => u.uf.toLowerCase() === t.uf) || {}).nome || t.uf.toUpperCase(),
      horas: horas ? Math.round(horas * 100) / 100 : null,
      valor_hora: horas && t.forma !== 'Por consulta' ? Math.round(t.valor / horas * 100) / 100 : null,
      status: 'ativo', autor: APP.me || null, criado_em: new Date().toISOString(),
    });
    if (doc.carga === undefined) delete doc.carga;
    const btn = $('#f-submit');
    btn.disabled = true; btn.textContent = 'Registrando…';
    try {
      await APP.db.collection('valores_equipe').add(doc);
      toast(`Valor registrado. Já aparece ${APP.P.estados[doc.uf] ? 'no painel de ' + doc.uf_nome + ' e no panorama' : 'na lista da equipe'}.`);
      ['f-valor', 'f-detalhe', 'f-obs', 'f-contratante', 'f-carga'].forEach((id) => { $('#' + id).value = ''; });
      updatePreview();
    } catch (e) {
      err.hidden = false;
      err.textContent = e && e.code === 'not_granted' ? 'Sua conta não tem permissão para gravar neste site. Peça ao responsável acesso com permissão de uso.' : 'Não foi possível registrar agora (' + ((e && (e.message || e.code)) || 'erro') + '). Tente de novo em instantes.';
    } finally { btn.disabled = APP.dbState !== 'ok'; btn.textContent = 'Registrar valor'; }
  }
  function teamFiltered() {
    const q = norm(TEAMF.q);
    return APP.team.filter((r) => (!TEAMF.uf || r.uf === TEAMF.uf) && (!TEAMF.st || (r.status || 'ativo') === TEAMF.st) && (!q || norm([r.municipio, r.contratante, r.especialidade, r.uf_nome, r.detalhe].join(' ')).includes(q)))
      .sort((a, b) => String(b.criado_em).localeCompare(String(a.criado_em)));
  }
  function renderTeamList() {
    if (!teamBuilt) return;
    const ativos = teamAtivos();
    const ufs = Array.from(new Set(APP.team.map((r) => r.uf))).sort();
    const fsel = $('#mx-team-fuf');
    const want = [''].concat(ufs).join('|');
    if (fsel.dataset.k !== want) { fsel.dataset.k = want; fsel.replaceChildren(h('option', { value: '', text: 'Todos os estados' }), ...ufs.map((uf) => h('option', { value: uf, text: (APP.P.estados[uf] || {}).nome || uf.toUpperCase() }))); fsel.value = TEAMF.uf; }
    const pl = median(ativos.filter((r) => /^Plantão/.test(r.forma) && Number(r.valor_hora) > 0).map((r) => Number(r.valor_hora)));
    const ult = ativos.map((r) => r.criado_em).sort().pop();
    $('#mx-team-kpis').replaceChildren(
      h('div', { class: 'mx-kpi' }, h('span', { text: 'Valores em uso' }), h('b', { text: F.int(ativos.length) }), h('small', { text: F.int(APP.team.length - ativos.length) + ' arquivados' })),
      h('div', { class: 'mx-kpi' }, h('span', { text: 'Estados com registro' }), h('b', { text: F.int(new Set(ativos.map((r) => r.uf)).size) }), h('small', { text: Array.from(new Set(ativos.map((r) => r.uf.toUpperCase()))).join(', ') || '—' })),
      h('div', { class: 'mx-kpi' }, h('span', { text: 'Hora de plantão, mediana' }), h('b', { style: 'color:var(--team)', text: pl ? F.brl(pl) : '—' }), h('small', { text: 'todos os estados' })),
      h('div', { class: 'mx-kpi' }, h('span', { text: 'Último registro' }), h('b', { text: ult ? dBR(ult) : '—' }), h('small', { text: ult ? 'por ' + nomeDe((ativos.find((r) => r.criado_em === ult) || {}).autor) : '' })));
    const box = $('#mx-team-list');
    if (APP.dbState === 'loading') { box.replaceChildren(h('div', { class: 'dash-skeleton', style: 'min-height:200px' })); return; }
    if (APP.dbState === 'off') { box.replaceChildren(h('div', { class: 'mx-empty' }, h('b', { text: 'Valores da equipe indisponíveis nesta visualização.' }), h('span', { text: 'Abra o site pelo claude.ai com sua conta para ver e registrar valores.' }))); return; }
    const rows = teamFiltered();
    if (!rows.length) {
      box.replaceChildren(h('div', { class: 'mx-empty' }, h('b', { text: APP.team.length ? 'Nenhum valor com esses filtros.' : 'Nenhum valor registrado ainda.' }), h('span', { text: APP.team.length ? 'Mude o estado, a situação ou a busca.' : 'Use o formulário para registrar o primeiro. Ele aparece na hora no painel do estado, em rosa, e no gráfico de hora médica do panorama.' })));
      return;
    }
    const canAct = (r) => APP.canEdit || (APP.me && r.autor === APP.me);
    const tbl = h('table', { class: 'mx-table' },
      h('thead', null, h('tr', null, ...['Mês', 'Estado', 'Município', 'Contratante', 'Especialidade', 'Forma', 'Valor', 'Por hora', 'Vínculo', 'Origem', 'Registrado por', ''].map((t, i) => h('th', { class: [6, 7].includes(i) ? 'n' : null, text: t })))),
      h('tbody', null, ...rows.map((r) => {
        const arch = r.status === 'arquivado';
        const act = h('td', { class: 'acts' });
        if (canAct(r)) {
          const b = h('button', { type: 'button', class: 'mx-btn ghost sm', text: arch ? 'Restaurar' : 'Arquivar' });
          b.addEventListener('click', async () => {
            if (!b.dataset.confirm) { b.dataset.confirm = '1'; b.textContent = arch ? 'Confirmar restauração' : 'Confirmar arquivamento'; setTimeout(() => { if (b.isConnected) { delete b.dataset.confirm; b.textContent = arch ? 'Restaurar' : 'Arquivar'; } }, 4000); return; }
            b.disabled = true;
            try { await APP.db.collection('valores_equipe').doc(r.id).update(arch ? { status: 'ativo', restaurado_por: APP.me || null, restaurado_em: new Date().toISOString() } : { status: 'arquivado', arquivado_por: APP.me || null, arquivado_em: new Date().toISOString() }); toast(arch ? 'Valor restaurado.' : 'Valor arquivado: saiu dos gráficos e continua guardado.'); }
            catch (e) { b.disabled = false; toast('Não foi possível alterar: ' + ((e && (e.message || e.code)) || 'erro')); }
          });
          act.append(b);
        }
        return h('tr', { class: arch ? 'is-arch' : null, 'data-source': 'valores_equipe' },
          h('td', { text: compBR(r.mes) }), h('td', null, h('span', { class: 'mx-tag uf', text: String(r.uf).toUpperCase() })), h('td', { text: r.municipio }), h('td', { text: r.contratante }), h('td', { text: r.especialidade }),
          h('td', { text: r.forma === 'Mensal' ? `Mensal, ${r.carga}h/sem` : r.forma }), h('td', { class: 'n', text: F.brl(Number(r.valor)) }), h('td', { class: 'n', text: Number(r.valor_hora) > 0 ? F.brl(Number(r.valor_hora)) : '—' }),
          h('td', { text: r.vinculo || '—' }), h('td', null, r.origem, r.detalhe ? h('small', { text: r.detalhe }) : null, r.obs ? h('small', { text: r.obs }) : null), h('td', null, nomeDe(r.autor), h('small', { text: dBR(r.criado_em) })), act);
      })));
    box.replaceChildren(h('div', { class: 'mx-tablewrap' }, tbl));
  }

  // ================================================================== FONTES PAGE
  function renderFontes() {
    const P = APP.P;
    const thead = h('thead', null, h('tr', null, ...['Estado', 'Relatório de', 'CNES', 'Valores no mapa de preços', 'Documentos', 'Contratos', 'Notícias', 'Painel original'].map((t, i) => h('th', { class: i >= 3 && i <= 6 ? 'n' : null, text: t }))));
    const tbody = h('tbody', null, ...P.ordem.map((uf) => { const S = P.estados[uf]; return h('tr', null,
      h('th', { scope: 'row' }, h('a', { href: '#' + S.slug, text: S.nome })), h('td', null, dBR(S.relatorio_em), S.revisado_em ? h('small', { text: 'revisado em ' + dBR(S.revisado_em) }) : null), h('td', { text: compBR(S.cnes_competencia) }),
      h('td', { class: 'n', text: F.int(S.n_mapa) }), h('td', { class: 'n', text: F.int(S.n_documentos) }), h('td', { class: 'n', text: F.int(S.n_contratos) }), h('td', { class: 'n', text: F.int(S.n_noticias) }),
      h('td', null, h('a', { href: S.url, target: '_blank', rel: 'noopener', text: 'abrir' }))); }));
    $('#mx-f-rel').replaceChildren(thead, tbody);
    const log = $('#mx-f-log');
    if (APP.dbState === 'off' && !APP.updates.length) { log.replaceChildren(h('div', { class: 'mx-empty' }, h('b', { text: 'Histórico indisponível nesta visualização.' }), h('span', { text: 'Abra o site pelo claude.ai com sua conta para ver o registro das atualizações.' }))); return; }
    if (!APP.updates.length) { log.replaceChildren(h('div', { class: 'mx-empty' }, h('b', { text: 'Nenhuma rodada registrada ainda.' }), h('span', { text: SCHEDULE ? `A próxima atualização automática roda ${SCHEDULE.dia}, ${dBR(nextRun().toISOString())}, às ${SCHEDULE.hora} (horário de Brasília).` : 'A atualização semanal ainda não foi agendada.' }))); return; }
    log.replaceChildren(h('div', { class: 'mx-tablewrap' }, h('table', { class: 'mx-table' },
      h('thead', null, h('tr', null, ...['Data', 'Situação', 'Resumo', 'TO', 'RR', 'AL', 'RS', 'RO'].map((t, i) => h('th', { class: i >= 3 ? 'n' : null, text: t })))),
      h('tbody', null, ...APP.updates.map((u) => h('tr', null, h('td', { text: dBR(u.data) }), h('td', { text: u.status || '—' }), h('td', null, u.resumo || '—', u.observacoes ? h('small', { text: u.observacoes }) : null),
        ...['to', 'rr', 'al', 'rs', 'ro'].map((uf) => { const e = (u.por_estado || {})[uf] || {}; return h('td', { class: 'n' }, e.novos_valores !== undefined ? `${F.int(e.novos_valores || 0)} val.` : '—', h('small', { text: e.novos_contratos !== undefined ? `${F.int(e.novos_contratos || 0)} contr. · ${F.int(e.novas_noticias || 0)} not.` : '' })); })))))));
  }

  // ================================================================== SOURCE DRAWER
  const drawer = $('#mx-drawer'), scrim = $('#mx-scrim');
  function openDrawer(eyebrow, title, blocks) {
    $('#mx-dr-eyebrow').textContent = eyebrow; $('#mx-dr-title').textContent = title;
    $('#mx-dr-body').replaceChildren(...blocks.filter(Boolean));
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); scrim.hidden = false;
    $('#mx-dr-close').focus({ preventScroll: true });
  }
  function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); scrim.hidden = true; }
  $('#mx-dr-close').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  const blk = (title, ...kids) => h('div', { class: 'blk' }, h('h3', { text: title }), ...kids);
  function preview(rows, hit) {
    if (!Array.isArray(rows) || !rows.length) return h('p', { text: 'Sem linhas.' });
    const cols = Object.keys(rows[0]).filter((c) => c !== 'geom').slice(0, 14);
    const sel = hit ? [hit].concat(rows.filter((r) => r !== hit).slice(0, 9)) : rows.slice(0, 10);
    const fmtCell = (v) => (v === null || v === undefined ? '' : typeof v === 'number' ? LOC.format(',.6~f')(v) : typeof v === 'object' ? JSON.stringify(v) : String(v));
    return h('div', { class: 'mx-prev' }, h('table', null, h('thead', null, h('tr', null, ...cols.map((c) => h('th', { text: c })))), h('tbody', null, ...sel.map((r) => h('tr', { class: r === hit ? 'hit' : null }, ...cols.map((c) => h('td', { text: fmtCell(r[c]), title: fmtCell(r[c]) })))))));
  }
  function matchWhere(rows, w) {
    if (!w || !Array.isArray(rows)) return null;
    const pairs = w.split('&').map((p) => p.split('=').map((x) => decodeURIComponent(x)));
    return rows.find((r) => pairs.every(([k, v]) => String(r[k]) === v)) || null;
  }
  function dsBlocks(ctx, id, el) {
    const m = ctx.man.datasets[id], c = ctx.calcs[id];
    const d = ctx.dash.data(id);
    const rows = Array.isArray(d.data) ? d.data : [d.data];
    const hit = el ? (el.dataset.where ? matchWhere(rows, el.dataset.where) : (el.dataset.row ? rows[Number(el.dataset.row)] : (el.dataset.field && rows.length === 1 ? rows[0] : null))) : null;
    const out = [];
    if (m) {
      out.push(blk('Conjunto de dados', h('p', { style: 'color:var(--ink);font-weight:600', text: m.title }), h('p', { text: m.description })));
      out.push(h('dl', { class: 'mx-kv' }, h('dt', { text: 'Linhas' }), h('dd', { text: F.int(m.rows) }), h('dt', { text: 'Atualizado em' }), h('dd', { text: m.updated ? dBR(m.updated) : '—' }), h('dt', { text: 'Situação' }), h('dd', { text: m.fixed ? 'Arquivo fixo do relatório' : 'Arquivo do relatório' }), h('dt', { text: 'Painel' }), h('dd', null, h('a', { href: ctx.man.url, target: '_blank', rel: 'noopener', text: 'painel original de ' + ctx.man.nome }))));
    } else if (c) {
      out.push(blk('Cálculo do painel', h('p', { style: 'color:var(--ink);font-weight:600', text: c.title }), h('p', { text: c.description })));
      out.push(blk('Calculado a partir de', h('div', { class: 'dl' }, ...c.inputs.map((i) => h('button', { type: 'button', class: 'mx-btn ghost sm', onclick: () => openSource(null, [i]), text: (ctx.man.datasets[i] || ctx.calcs[i] || { title: i }).title })))));
      out.push(blk('Código do cálculo', h('pre', { text: String(c.orig || c.fn).replace(/\\u([0-9a-fA-F]{4})/g, (m, x) => String.fromCharCode(parseInt(x, 16))) })));
      if (id === 'hora') out.push(h('p', { class: 'mx-note', text: 'No site, os valores informados pela equipe são somados a este resultado como uma categoria própria quando a camada da equipe está ligada.' }));
    }
    if (hit && el && el.dataset.field) out.push(blk('Valor exibido', h('p', null, h('span', { class: 'mx-mono', text: el.dataset.field }), ' = ', h('b', { text: String(hit[el.dataset.field]) }))));
    out.push(blk(hit ? 'Linha de origem e primeiras linhas' : 'Primeiras linhas', preview(rows, hit)));
    out.push(blk('Baixar', h('div', { class: 'dl' }, h('button', { type: 'button', class: 'mx-btn sm', onclick: () => baixarCSV(`${ctx.uf}_${id}`, rows), text: 'CSV para Excel' }), h('button', { type: 'button', class: 'mx-btn ghost sm', onclick: () => baixarJSON(`${ctx.uf}_${id}`, rows), text: 'JSON' }))));
    return out;
  }
  function openSource(el, idsOverride) {
    const ids = idsOverride || String(el.dataset.source).split(/\s+/).filter(Boolean);
    if (ids[0] === 'valores_equipe') {
      const rows = CUR ? teamAtivos(CUR.uf) : teamAtivos();
      openDrawer('Valores da equipe', 'Valores informados pela equipe', [
        h('p', { text: 'Registros feitos na página Valores da equipe, a partir de conversas com médicos, propostas recebidas ou documentos vistos. Ficam no banco do site, separados dos arquivos dos relatórios, com o nome de quem registrou e a data.' }),
        h('dl', { class: 'mx-kv' }, h('dt', { text: 'Em uso' }), h('dd', { text: F.int(rows.length) }), h('dt', { text: 'Valor por hora' }), h('dd', { text: 'plantão dividido pelas horas; mensal dividido pela carga semanal vezes 4,345 semanas' })),
        blk('Primeiras linhas', preview(rows.map((r) => ({ mes: r.mes, uf: r.uf, municipio: r.municipio, contratante: r.contratante, especialidade: r.especialidade, forma: r.forma, valor: Number(r.valor), valor_hora: Number(r.valor_hora) || null, origem: r.origem, registrado_por: nomeDe(r.autor) })))),
        h('div', { class: 'dl' }, h('a', { class: 'mx-btn sm', href: '#valores-da-equipe', onclick: () => { exitSrc(); }, text: 'Abrir Valores da equipe' }))]);
      return;
    }
    if (ids[0] === 'auto_valores') {
      openDrawer('Atualização semanal', 'Novidades do PNCP', [h('p', { text: 'Linhas gravadas pela tarefa semanal que varre o PNCP por modalidade (credenciamento, inexigibilidade, dispensa e pregão) nos estados com relatório e busca os itens e resultados de cada contratação de serviço médico. Cada linha traz o número de controle do PNCP e o link.' }), blk('Primeiras linhas', preview(APP.auto.valores.concat(APP.auto.contratos)))]);
      return;
    }
    if (!CUR) return;
    const blocks = [];
    ids.forEach((id, i) => { if (i) blocks.push(h('hr', { style: 'border:0;border-top:1px solid var(--rule);width:100%' })); blocks.push(...dsBlocks(CUR, id, idsOverride ? null : el)); });
    const first = CUR.man.datasets[ids[0]] || CUR.calcs[ids[0]] || { title: ids[0] };
    openDrawer(`Fonte · ${CUR.man.nome}`, ids.length > 1 ? `${ids.length} fontes neste elemento` : first.title, blocks);
  }
  async function openFonte(key, uf) {
    const f = FONTES[key];
    const P = APP.P;
    if (key === 'auto_noticia') { openDrawer('Atualização semanal', 'Notícia encontrada pela atualização semanal', [h('p', { text: 'Encontrada pela busca semanal de notícias sobre falta de médicos nos estados mapeados. O resumo é próprio; o link leva à publicação original.' })]); return; }
    if (!f) return;
    const ufs = uf && P.estados[uf] ? [uf] : P.ordem;
    const blocks = [h('p', { text: f.como })];
    if (f.v) blocks.push(blk(key.startsWith('br_') || uf === 'todos' ? 'Composição por estado' : 'Valor em cada estado', h('dl', { class: 'mx-kv' }, ...P.ordem.flatMap((u) => [h('dt', { text: P.estados[u].nome }), h('dd', { style: u === uf ? 'font-weight:700;color:var(--ink)' : null, text: f.v(P.estados[u]) })]))));
    if (key === 'cons_esp' && uf) {
      const S = P.estados[uf];
      blocks.push(blk('Valor da célula', h('p', { text: S.consultas_esp[APP.srcEsp] ? `${APP.srcEsp}: mediana ${F.brl(S.consultas_esp[APP.srcEsp].mediana)}, de ${F.brl(S.consultas_esp[APP.srcEsp].min)} a ${F.brl(S.consultas_esp[APP.srcEsp].max)}, ${S.consultas_esp[APP.srcEsp].n} valores.` : 'Os preços de consulta foram agrupados pelo nome da especialidade e a mediana calculada por código a partir das linhas do conjunto de consultas.' })));
    }
    for (const u of ufs) {
      const man = APP.man[u];
      if (!f.ds.length) continue;
      blocks.push(blk(`Dados de origem · ${P.estados[u].nome}`, ...f.ds.map((id) => { const m = man.datasets[id]; return h('div', { class: 'mx-dsrow', style: 'padding:8px 0' }, h('div', null, h('b', { text: m ? m.title : id }), h('p', { text: m ? `${F.int(m.rows)} linhas · atualizado em ${dBR(m.updated)}` : '' })), h('div', { class: 'mx-rowacts' }, h('button', { type: 'button', class: 'mx-btn ghost sm', onclick: async () => { try { baixarCSV(`${u}_${id}`, await getJSON(`data/${u}/${id}.json`)); } catch (e) { toast('Não foi possível carregar o conjunto.'); } }, text: 'CSV' }))); }), f.calc && man.calcs[f.calc] ? h('p', { class: 'mx-note', text: 'Cálculo do painel usado: ' + man.calcs[f.calc].title + '.' }) : null));
    }
    if (uf && P.estados[uf]) {
      const S = P.estados[uf];
      blocks.push(h('div', { class: 'dl' }, h('button', { type: 'button', class: 'mx-btn sm', onclick: () => { exitSrc(); closeDrawer(); APP.pendingSec = f.sec; location.hash = S.slug; }, text: `Ver no painel de ${S.nome}` }), h('a', { class: 'mx-btn ghost sm', href: S.url, target: '_blank', rel: 'noopener', text: 'Painel original' })));
    }
    openDrawer('Panorama' + (uf && P.estados[uf] ? ' · ' + P.estados[uf].nome : ''), f.t, blocks);
  }
  // source mode
  const srcBtn = $('#mx-srcbtn'), srcBanner = $('#mx-srcbanner');
  function setSrc(on) { document.body.classList.toggle('mx-src-mode', on); srcBtn.setAttribute('aria-pressed', String(on)); srcBanner.hidden = !on; }
  function exitSrc() { setSrc(false); }
  srcBtn.addEventListener('click', () => setSrc(!document.body.classList.contains('mx-src-mode')));
  $('#mx-srcoff').addEventListener('click', exitSrc);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { if (drawer.classList.contains('open')) closeDrawer(); else exitSrc(); } });
  document.addEventListener('click', (ev) => {
    if (!document.body.classList.contains('mx-src-mode')) return;
    if (ev.target.closest('.mx-drawer, .mx-mast, .mx-srcbanner, .mx-scrim')) return;
    const t = ev.target.closest('[data-source], [data-fonte]');
    if (!t) return;
    ev.preventDefault(); ev.stopPropagation();
    APP.srcEsp = t.dataset.esp || null;
    if (t.dataset.fonte) openFonte(t.dataset.fonte, t.dataset.uf); else openSource(t);
  }, true);

  // ================================================================== capabilities: db, user
  function onTeamChange() {
    if (PAGE === 'inicio' && APP.P) drawHoraBR();
    if (CUR) { delete CUR.cache.hora; CUR.run('horas'); updateTeamCard(CUR); }
    if (PAGE === 'valores-da-equipe') renderTeamList();
    resolveNames();
  }
  function syncAuto() {
    for (const k of ['valores', 'contratos', 'noticias']) APP.auto[k] = APP.autoFile[k].concat(APP.autoDb[k]);
    APP.updates = APP.updatesFile.concat(APP.updatesDb).sort((a, b) => String(b.data).localeCompare(String(a.data)));
    onAutoChange();
  }
  function onAutoChange() {
    if (CUR) updateNovidades(CUR);
    if (PAGE === 'noticias') renderNews();
    if (PAGE === 'inicio') renderHomeNews();
    if (PAGE === 'fontes') renderFontes();
  }
  const resolveNames = debounce(async () => {
    if (!APP.user || !APP.user.profiles) return;
    const ids = Array.from(new Set(APP.team.map((r) => r.autor).filter((id) => id && !APP.names[id])));
    if (!ids.length) return;
    try { Object.assign(APP.names, await APP.user.profiles(ids)); if (PAGE === 'valores-da-equipe') renderTeamList(); if (CUR) updateTeamCard(CUR); } catch (e) { /* names stay generic */ }
  }, 200);
  async function initCaps() {
    if (!window.claude || typeof window.claude.use !== 'function') { setDb('off'); return; }
    const timer = setTimeout(() => { if (APP.dbState === 'loading') setDb('off'); }, 10000);
    let db = null;
    try {
      const [d, u] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      db = d; APP.user = u;
      if (u) { try { APP.me = await u.id(); } catch (e) { /* no id */ } try { APP.canEdit = await u.canEdit(); } catch (e) { /* no flag */ } }
    } catch (e) { db = null; }
    if (!db) { clearTimeout(timer); setDb('off'); return; }
    APP.db = db;
    db.collection('valores_equipe').onSnapshot((snap) => {
      clearTimeout(timer);
      APP.team = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      if (APP.dbState !== 'ok') setDb('ok');
      onTeamChange();
    }, () => { clearTimeout(timer); setDb('off'); });
    for (const [k, col] of [['valores', 'auto_valores'], ['contratos', 'auto_contratos'], ['noticias', 'auto_noticias']]) {
      db.collection(col).onSnapshot((snap) => { APP.autoDb[k] = snap.docs.map((d) => Object.assign({ id: d.id }, d.data())); syncAuto(); }, () => {});
    }
    db.collection('atualizacoes').onSnapshot((snap) => { APP.updatesDb = snap.docs.map((d) => Object.assign({ id: d.id }, d.data())); syncAuto(); }, () => {});
  }

  boot();
})();
