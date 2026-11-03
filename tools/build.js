// Builds the site's data files from the state dashboards.
// Every number in panorama.json is computed here from the dashboards' own rows
// and calculations; nothing is typed in by hand.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const SITE = path.join(ROOT, 'site');
const CALCS = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/calcs.json'), 'utf8'));

const STATES = {
  to: { nome: 'Tocantins', sigla: 'TO', slug: 'tocantins', ibge: '17', url: 'https://claude.ai/code/artifact/38ba3e50-817b-4e2a-b194-087f900fe090', polos: 'Palmas e Araguaína', relatorio: '2026-10-28T16:20:00-03:00' },
  rr: { nome: 'Roraima', sigla: 'RR', slug: 'roraima', ibge: '14', url: 'https://claude.ai/code/artifact/67bd224d-c773-4d72-87f4-126914501a9b', polos: 'Boa Vista', relatorio: '2026-10-30T19:00:00-03:00' },
  al: { nome: 'Alagoas', sigla: 'AL', slug: 'alagoas', ibge: '27', url: 'https://claude.ai/code/artifact/89be2483-da32-4a59-aea9-0c307ce767a0', polos: 'Maceió e Arapiraca', relatorio: '2026-10-29T13:05:00-03:00' },
  rs: { nome: 'Rio Grande do Sul', sigla: 'RS', slug: 'rio-grande-do-sul', ibge: '43', url: 'https://claude.ai/code/artifact/212f32a4-936a-41e5-a03f-c35c1a1bc781', polos: 'Porto Alegre', relatorio: '2026-11-02T14:40:00-03:00' },
  ro: { nome: 'Rondônia', sigla: 'RO', slug: 'rondonia', ibge: '11', url: 'https://claude.ai/artifact/UwuyNFtB8EFmnpcQrQFcaL', polos: 'Porto Velho', relatorio: '2026-11-02T23:30:00-03:00' },
};
const ORDER = ['to', 'rr', 'al', 'rs', 'ro'];

const rowsOf = (j) => (Array.isArray(j) ? j : j.rows || j.data || j.results);
const num = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));
const median = (a) => {
  const s = a.filter((x) => x !== null && !isNaN(x)).sort((x, y) => x - y);
  if (!s.length) return null;
  const h = Math.floor(s.length / 2);
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};
const quant = (a, q) => {
  const s = a.filter((x) => x !== null).sort((x, y) => x - y);
  if (!s.length) return null;
  const p = (s.length - 1) * q, b = Math.floor(p);
  return s[b + 1] !== undefined ? s[b] + (p - b) * (s[b + 1] - s[b]) : s[b];
};
const r2 = (x, d = 4) => (x === null || x === undefined ? null : Math.round(x * 10 ** d) / 10 ** d);
const write = (p, obj) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, typeof obj === 'string' ? obj : JSON.stringify(obj));
};

function macroOf(categoria) {
  const c = String(categoria);
  if (/Mais Médicos/.test(c)) return 'mm';
  if (/Plantão/i.test(c)) return 'plantao';
  if (/hora/i.test(c)) return 'hora';
  return 'carga';
}
const MACROS = {
  plantao: 'Plantão (6h, 12h ou 24h)',
  hora: 'Hora avulsa contratada (empresa ou credenciado)',
  carga: 'Carga semanal ou salário (concurso, seleção, contrato)',
  mm: 'Mais Médicos (bolsa federal)',
};

// Consultation specialties normalised across the four states (only for the comparison table).
const ESP = [
  ['Pediatria', /pediatr/i, /neuro|cirurg|alerg|eco/i],
  ['Cardiologia', /cardiolog/i, /eco|exame|angiolog|holter|ergom|mapa/i],
  ['Psiquiatria', /psiquiatr/i, null],
  ['Ginecologia e obstetrícia', /ginecolog|obstetr/i, null],
  ['Ortopedia', /ortoped/i, null],
  ['Oftalmologia', /oftalmolog/i, /·/],
  ['Endocrinologia', /endocrin/i, null],
  ['Urologia', /\burolog/i, null],
  ['Neurologia', /neurolog/i, /pediatr|cirurg/i],
  ['Otorrinolaringologia', /otorrino/i, /·/],
  ['Dermatologia', /dermatolog/i, null],
];
function espOf(r) {
  const e = String(r.especialidade || '');
  for (const [nome, inc, exc] of ESP) if (inc.test(e) && !(exc && exc.test(e))) return nome;
  return null;
}

const site = { estados: {}, ordem: ORDER, macros: MACROS, gerado_em: new Date().toISOString() };
const noticias = [];
const municipiosLista = {};
const brMun = [], brP24 = [];
const fmtDate = (s) => String(s || '').slice(0, 10);

for (const uf of ORDER) {
  const S = STATES[uf];
  const dir = path.join(SRC, uf);
  const data = {}, meta = {};
  for (const f of fs.readdirSync(path.join(dir, 'data'))) {
    const id = f.replace(/\.json$/, '');
    data[id] = rowsOf(JSON.parse(fs.readFileSync(path.join(dir, 'data', f), 'utf8')));
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'datasets', f), 'utf8'));
    meta[id] = { title: m.title, description: m.description || '', updated: m.updated ? m.updated.at : null, rows: data[id].length, fixed: !!m.fixed, ...(m.competencia ? { competencia: m.competencia } : {}) };
    write(path.join(SITE, 'data', uf, id + '.json'), data[id]);
  }
  const C = CALCS[uf].calcs;
  // Report date: newest data update, ignoring the map geometry (redrawn in the site without changing any number).
  const updatedAll = Object.entries(meta).filter(([id]) => id !== 'malha').map(([, m]) => m.updated).filter(Boolean).sort();
  const revisadoEm = Object.values(meta).map((m) => m.updated).filter(Boolean).sort().pop();
  write(path.join(SITE, 'data', uf, 'manifest.json'), { uf, ...S, datasets: meta, calcs: CALCS[uf].meta, relatorio_em: S.relatorio, revisado_em: revisadoEm > S.relatorio ? revisadoEm : null });

  // ---- state page module (original markup + script, unchanged except three marked patches)
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const style = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  let script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const markup = html.replace(/<meta name="dash-one-writer">/, '').replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script>[\s\S]*<\/script>/, '').trim();
  const before = script.length;
  // Patch 1: team-reported values get their own colour in the hour chart.
  script = script.replace(
    "const colorOf = (r) => r.esfera === 'Municipal'",
    "const colorOf = (r) => r.esfera === 'Equipe' ? 'var(--mx-team)' : r.esfera === 'Municipal'"
  );
  // Patch 2: the site handles links and scrolling itself.
  script = script.replace(/const tmNamed = location\.hash[^\n]*\n[^\n]*\n?/, '');
  if (script.length === before) throw new Error('patch failed ' + uf);
  if (!/r\.esfera === 'Equipe'/.test(script)) throw new Error('colour patch failed ' + uf);
  const mod = `/* Painel de ${S.nome}: marcação e script originais do relatório, publicados em ${S.url} */\n` +
    `window.MX_ESTADOS = window.MX_ESTADOS || {};\nwindow.MX_ESTADOS.${uf} = {\n  css: ${JSON.stringify(style)},\n  markup: ${JSON.stringify(markup)},\n  run: function (dash) {\n${script}\n  }\n};\n`;
  // Served as a separate file: keep it pure ASCII so it reads the same whatever charset the host announces.
  write(path.join(SITE, 'estados', uf + '.js'), mod.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')));

  // ---- panorama numbers
  const kpi = C.kpi[0], kv = C.kpi_vinc[0], vk = C.val_kpi[0];
  const mun = data.municipios;
  const popBaixa = mun.filter((r) => num(r.dens) < 1).reduce((a, r) => a + num(r.pop), 0);
  const popZero = mun.filter((r) => num(r.med) === 0).reduce((a, r) => a + num(r.pop), 0);
  const serie = data.serie.map((r) => ({ competencia: r.competencia, medicos: num(r.medicos) }));
  const esp = (n) => num((data.especialidades.find((r) => r.especialidade === n) || {}).total);
  const ind = (id) => data.indicadores.find((r) => r.id === id) || null;
  const pop0a14 = ind('pop22_0a14') ? num(ind('pop22_0a14').valor) : null;
  const demo = C.demo ? C.demo[0] : null;

  const hora = C.hora.map((r) => ({ ...r, macro: macroOf(r.categoria) }));
  const horaStats = {};
  for (const mk of Object.keys(MACROS)) {
    const v = hora.filter((r) => r.macro === mk).map((r) => r.valor_hora);
    horaStats[mk] = v.length ? { n: v.length, mediana: r2(median(v), 2), q1: r2(quant(v, 0.25), 2), q3: r2(quant(v, 0.75), 2), min: r2(Math.min(...v), 2), max: r2(Math.max(...v), 2) } : { n: 0 };
  }
  const pontos = hora.filter((r) => r.macro !== 'mm').map((r) => ({
    v: r2(r.valor_hora, 2), m: r.macro, c: r.categoria, ct: r.contratante, mu: r.municipio, f: r.forma, e: r.especialidade, d: fmtDate(r.data), doc: r.documento, id: r.id,
  }));

  const cons = data.consultas.filter((r) => r.tipo_valor === 'Consulta' || r.tipo === 'Consulta');
  const consEsp = {};
  for (const r of cons) {
    const e = espOf(r);
    if (!e || !(num(r.valor) > 0)) continue;
    (consEsp[e] = consEsp[e] || []).push(num(r.valor));
  }
  const consMed = {};
  for (const [e, v] of Object.entries(consEsp)) consMed[e] = { n: v.length, mediana: r2(median(v), 2), min: Math.min(...v), max: Math.max(...v) };
  const usg = data.consultas.filter((r) => /ultrassonografia/i.test(String(r.especialidade)) && !/oftalmo|·/i.test(String(r.especialidade)) && num(r.valor) > 0).map((r) => num(r.valor));

  const contr = data.contratos;
  const sal = data.salarios.find((r) => r.id === 's1');
  const cs = ind('cs_med');

  site.estados[uf] = {
    ...S,
    relatorio_em: S.relatorio,
    revisado_em: revisadoEm > S.relatorio ? revisadoEm : null,
    cnes_competencia: (meta.municipios && meta.municipios.competencia) || serie[serie.length - 1].competencia,
    n_mun: kpi.n_mun, pop: kpi.pop, medicos: kpi.medicos, medicos_sus: kpi.medicos_sus, dens: r2(kpi.dens),
    mun_baixa: kpi.mun_baixa, mun_vazio: kpi.mun_vazio, mun_zero: kpi.mun_zero, pop_baixa: popBaixa, pop_zero: popZero,
    conc_share: r2(kpi.conc_share),
    vinc: { unidades: kv.unidades, vinculos: kv.vinculos, est: kv.est, tmp: kv.tmp, pj: kv.pj, pf: kv.pf, outros: kv.outros },
    p24: vk.p24, p24h: vk.p24h, n24: vk.n24,
    hora: horaStats, pontos,
    n_remuneracao: data.valores.length, n_contratantes: vk.n_registros !== undefined ? vk.n_contratantes : null,
    n_consultas: data.consultas.length, n_mapa: C.mapa_kpi[0].valores, n_documentos: C.mapa_kpi[0].documentos, consultado_em: C.mapa_kpi[0].consultado_em,
    n_contratos: contr.length,
    contratos_valor_global: r2(contr.reduce((a, r) => a + (num(r.valor_global) || 0), 0), 2),
    contratos_valor_mes_mediana: r2(median(contr.map((r) => num(r.valor_mes)).filter((x) => x > 0)), 2),
    contratos_pj: contr.filter((r) => r.tipo_pessoa === 'PJ').length,
    n_noticias: data.noticias.length,
    demo: demo ? { cresc: r2(demo.cresc), share_0a14: r2(demo.share_0a14), share_60: r2(demo.share_60), cobertura: r2(demo.cobertura) } : null,
    serie,
    cresc_cnes: r2(serie[serie.length - 1].medicos / serie[0].medicos - 1),
    intensivistas: esp('Médico em medicina intensiva'),
    int_100k: r2(esp('Médico em medicina intensiva') / kpi.pop * 1e5, 2),
    pediatras: esp('Pediatra'),
    ped_100k_criancas: pop0a14 ? r2(esp('Pediatra') / pop0a14 * 1e5, 1) : null,
    ped_outra_base: ind('ped_to') ? { valor: num(ind('ped_to').valor), rotulo: ind('ped_to').indicador, fonte: ind('ped_to').fonte } : null,
    mm_bolsa: (data.salarios.find((r) => /Mais Médicos/.test(r.cargo)) || {}).valor_min || null,
    concurso: cs ? { valor: cs.valor, rotulo: cs.indicador, data: cs.data, fonte: cs.fonte } : null,
    remuneracao_estado: sal ? { valor: num(sal.valor_min), orgao: sal.orgao, cargo: sal.cargo, vinculo: sal.vinculo, referencia: sal.referencia, fonte: sal.fonte } : null,
    consultas_esp: consMed,
    usg: usg.length ? { n: usg.length, mediana: r2(median(usg), 2) } : null,
  };

  for (const r of mun) brMun.push({ n: r.nome, uf: S.sigla, d: r2(num(r.dens), 3), p: num(r.pop), m: num(r.med) });
  // 24h shift values exactly as each state's own indicator selects them (Tocantins counts only PNCP rows).
  for (const r of data.valores) {
    const pref = uf === 'to' ? r.grupo === 'Prefeituras (PNCP)' : String(r.grupo).startsWith('Prefeituras');
    if (pref && r.forma === 'Plantão 24h') brP24.push({ v: num(r.valor), h: num(r.valor_hora) });
  }
  for (const n of data.noticias) noticias.push({ ...n, uf, id: uf + '-' + n.id });
  municipiosLista[uf] = mun.map((r) => r.nome).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

// Totals across the mapped states
const E = Object.values(site.estados);
site.total = {
  estados: E.length,
  municipios: E.reduce((a, s) => a + s.n_mun, 0),
  pop: E.reduce((a, s) => a + s.pop, 0),
  medicos: E.reduce((a, s) => a + s.medicos, 0),
  valores: E.reduce((a, s) => a + s.n_mapa, 0),
  documentos: E.reduce((a, s) => a + s.n_documentos, 0),
  contratos: E.reduce((a, s) => a + s.n_contratos, 0),
  noticias: noticias.length,
  mun_baixa: E.reduce((a, s) => a + s.mun_baixa, 0),
  mun_zero: E.reduce((a, s) => a + s.mun_zero, 0),
};
site.total.dens = r2(site.total.medicos / site.total.pop * 1000);

// ---- Brazil-level aggregates (partial: only the states with a report)
{
  const FX = [
    ['zero', 'Sem médico registrado', (m) => m.m === 0],
    ['lt05', 'Abaixo de 0,5', (m) => m.d < 0.5],
    ['lt1', '0,5 a 1', (m) => m.d < 1],
    ['lt2', '1 a 2', (m) => m.d < 2],
    ['lt3', '2 a 3', (m) => m.d < 3],
    ['ge3', '3 ou mais', () => true],
  ];
  const fx = (m) => FX.findIndex(([, , f]) => f(m));
  const muns = brMun.map((m) => ({ ...m, f: fx(m) })).sort((a, b) => a.f - b.f || a.d - b.d || b.p - a.p);
  const faixas = FX.map(([k, nome], i) => { const ms = muns.filter((m) => m.f === i); return { k, nome, n: ms.length, pop: ms.reduce((a, m) => a + m.p, 0) }; });
  const V = { unidades: 0, vinculos: 0, est: 0, tmp: 0, pj: 0, pf: 0, outros: 0 };
  for (const s of E) for (const k of Object.keys(V)) V[k] += s.vinc[k];
  const pts = E.flatMap((s) => s.pontos);
  const hora = {};
  for (const mk of ['plantao', 'hora', 'carga']) {
    const v = pts.filter((p) => p.m === mk).map((p) => p.v);
    hora[mk] = { n: v.length, mediana: r2(median(v), 2), q1: r2(quant(v, 0.25), 2), q3: r2(quant(v, 0.75), 2), min: v.length ? Math.min(...v) : null, max: v.length ? Math.max(...v) : null };
  }
  const comps = E[0].serie.map((r) => r.competencia);
  const serie = comps.map((c) => ({ competencia: c, medicos: E.reduce((a, s) => a + (s.serie.find((r) => r.competencia === c) || {}).medicos, 0) }));
  const mm = E.map((s) => s.hora.mm).find((h) => h && h.n);
  site.brasil = {
    base: ORDER.map((u) => STATES[u].sigla), n_estados: E.length,
    medicos: site.total.medicos, medicos_sus: E.reduce((a, s) => a + s.medicos_sus, 0), pop: site.total.pop, dens: site.total.dens,
    n_mun: site.total.municipios, mun_baixa: site.total.mun_baixa, mun_zero: site.total.mun_zero,
    pop_baixa: E.reduce((a, s) => a + s.pop_baixa, 0), faixas,
    vinc: V, hora, mm_hora: mm ? mm.mediana : null,
    p24: { n: brP24.length, mediana: r2(median(brP24.map((x) => x.v)), 2), mediana_hora: r2(median(brP24.map((x) => x.h)), 2) },
    serie, cresc: r2(serie[serie.length - 1].medicos / serie[0].medicos - 1),
  };
}
write(path.join(SITE, 'data', 'panorama.json'), site);
write(path.join(SITE, 'data', 'noticias.json'), noticias.sort((a, b) => String(b.data).localeCompare(String(a.data))));
write(path.join(SITE, 'data', 'municipios.json'), municipiosLista);
fs.copyFileSync(path.join(ROOT, 'geo', 'brasil_ufs.json'), path.join(SITE, 'data', 'brasil.json'));
// Automatic updates (weekly PNCP and news, monthly CNES log): copied as they are, listed on the site as novidades.
for (const k of ['valores', 'contratos', 'noticias', 'atualizacoes', 'oportunidades']) {
  const p = path.join(SRC, '_auto', k + '.json');
  write(path.join(SITE, 'data', 'auto', k + '.json'), fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : []);
}

for (const uf of ORDER) {
  const s = site.estados[uf];
  console.log(uf, s.relatorio_em, s.cnes_competencia, 'dens', s.dens, 'p24', s.p24, 'hora', JSON.stringify(Object.fromEntries(Object.entries(s.hora).map(([k, v]) => [k, v.n + ':' + v.mediana]))), 'cons', Object.keys(s.consultas_esp).length, 'usg', JSON.stringify(s.usg), 'ped', s.ped_100k_criancas, 'int', s.int_100k);
}
console.log('total', JSON.stringify(site.total));
const B = site.brasil; console.log('brasil', JSON.stringify(B).slice(0, 300));
