// Runs each state's original dashboard script in a headless DOM to extract
// every computed table (dash.calc) exactly as the dashboard computes it.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const d3 = require('d3');

const SRC = path.resolve(__dirname, '../src');
const OUT = path.resolve(__dirname, '../build');
fs.mkdirSync(OUT, { recursive: true });

function rowsOf(j) {
  if (Array.isArray(j)) return j;
  for (const k of ['rows', 'data', 'results']) if (j && Array.isArray(j[k])) return j[k];
  throw new Error('not rows');
}

const result = {};
for (const uf of ['al', 'to', 'rr', 'rs', 'ro']) {
  const html = fs.readFileSync(path.join(SRC, uf, 'index.html'), 'utf8');
  const data = {};
  for (const f of fs.readdirSync(path.join(SRC, uf, 'data'))) {
    data[f.replace(/\.json$/, '')] = rowsOf(JSON.parse(fs.readFileSync(path.join(SRC, uf, 'data', f), 'utf8')));
  }
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  const script = m[1];
  const markup = html.replace(/<script>[\s\S]*<\/script>/, '');
  const dom = new JSDOM('<!doctype html><body>' + markup + '</body>', { pretendToBeVisual: true });
  const calcs = {}, cache = {};
  const dash = {
    data(id) {
      if (id in data) return { status: 'ok', data: data[id] };
      if (id in calcs) {
        if (!(id in cache)) cache[id] = calcs[id].fn(...calcs[id].inputs.map((i) => dash.data(i).data));
        return { status: 'ok', data: cache[id] };
      }
      return { status: 'missing', data: [] };
    },
    calc(id, def) { calcs[id] = def; },
    draw() {}, onData() {}, setLink() {}, colors: ['#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888'],
  };
  const fn = new dom.window.Function('dash', 'd3', 'document', 'window', 'location', 'setTimeout', script);
  fn(dash, d3, dom.window.document, dom.window, { hash: '' }, () => {});
  const out = { calcs: {}, meta: {} };
  for (const id of Object.keys(calcs)) {
    out.calcs[id] = dash.data(id).data;
    out.meta[id] = { title: calcs[id].title, description: calcs[id].description, inputs: calcs[id].inputs };
  }
  result[uf] = out;
  console.log(uf, Object.keys(calcs).join(','));
}
fs.writeFileSync(path.join(OUT, 'calcs.json'), JSON.stringify(result));
for (const uf of Object.keys(result)) {
  const c = result[uf].calcs;
  console.log('---', uf);
  console.log(' kpi', JSON.stringify(c.kpi));
  console.log(' kpi_vinc', JSON.stringify(c.kpi_vinc));
  console.log(' val_kpi', JSON.stringify(c.val_kpi));
  console.log(' demo', JSON.stringify(c.demo));
  console.log(' mapa_kpi', JSON.stringify(c.mapa_kpi), 'cons_kpi', JSON.stringify(c.cons_kpi), 'contr_kpi', JSON.stringify(c.contr_kpi));
  console.log(' hora n', c.hora.length, 'cats', [...new Set(c.hora.map((r) => r.categoria))].join(' | '));
}
