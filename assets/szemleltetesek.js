/* Fejezethez illeszkedő szemléltetések. Csak a grafikon nélküli fejezeteket egészíti ki. */
(function () {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const PEN = 'var(--pen)', RED = 'var(--red)', GREEN = 'var(--green)', INK = 'var(--ink)', MUTED = 'var(--muted)', GRID = 'var(--gridline)';
const n = (x, d = 3) => Number.isFinite(x) ? (Math.abs(x) < 1e-9 ? '0' : Number(x.toFixed(d)).toLocaleString('hu-HU')) : 'nincs értelmezve';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const factors = a => { const out = []; for (let p = 2; p * p <= a; p++) while (a % p === 0) { out.push(p); a /= p; } if (a > 1) out.push(a); return out; };
const fact = a => { let r = 1; for (let i = 2; i <= a; i++) r *= i; return r; };
const choose = (a, b) => b > a ? 0 : fact(a) / fact(b) / fact(a - b);
const samples = (f, a, b, count = 180) => Array.from({ length: count + 1 }, (_, i) => { const x = a + (b - a) * i / count; return [x, f(x)]; });
const rad = x => x * Math.PI / 180;
function quadratic(a, b, c) {
  if (a === 0) return { degree: b === 0 ? 0 : 1, d: null, roots: b ? [-c / b] : [], all: b === 0 && c === 0 };
  const raw = b * b - 4 * a * c, d = Math.abs(raw) < 1e-10 ? 0 : raw;
  return { degree: 2, d, roots: d < 0 ? [] : d === 0 ? [-b / (2 * a)] : [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)].sort((x, y) => x - y), all: false };
}
function ssa(a, c, alpha) {
  const t = rad(alpha), h = c * Math.sin(t), p = c * Math.cos(t), raw = a * a - h * h, d = Math.abs(raw) < 1e-9 ? 0 : raw;
  return d < 0 ? [] : [p - Math.sqrt(d), p + Math.sqrt(d)].filter((x, i, xs) => x > 1e-9 && xs.findIndex(y => Math.abs(x - y) < 1e-8) === i);
}
const math = { gcd, factors, fact, choose, quadratic, ssa };
const descriptions = Object.create(null);
function add(grade, folder, file, kind, title, options = {}) { descriptions[`${grade}/${folder}/${file}.js`] = { kind, title, ...options }; }
const R7 = 'racionalis-arany-szazalek', A9 = 'algebra-szamelmelet', G10 = 'gondolkodasi-modszerek', R10 = 'gyokvonas', Q10 = 'masodfoku-egyenlet', H11 = 'hatvany-gyok-log', T11 = 'trigonometria';
[
 ['01-alakok', 'fraction', 'Egy szám több alakban'], ['03-muveletek', 'operations', 'Előjeles műveletek a számegyenesen'],
 ['04-sorrend', 'order', 'Melyik művelet következik?'], ['06-szazalek', 'percent', 'Alap, százalékláb, százalékérték'],
 ['07-kamat', 'interest', 'Egyszerű és kamatos kamat'], ['08-hatvanyozas', 'power', 'A hatvány mint ismételt szorzás'],
 ['09-azonos-alap', 'powerRules', 'Azonos alap: a tényezőket számoljuk'], ['10-azonos-kitevo', 'powerRules', 'Azonos kitevő: tényezőpárok', { sameExponent: true }],
 ['11-oszthatosag-prim', 'primes', 'Prímszámvadászat'], ['12-lnko-lkkt', 'gcd', 'Közös prímtényezők'], ['13-normalalak', 'scientific', 'A tizedesvessző és a kitevő']
].forEach(([file, kind, title, options]) => add(7, R7, file, kind, title, options));
[
 ['01-betuk', 'variables', 'A betű változik, az összefüggés megmarad'], ['02-hatvanyozas', 'power', 'A zárójel és az előjel'],
 ['03-egesz-kitevo', 'power', 'Lépések a negatív kitevők felé', { negative: true }], ['04-normalalak', 'scientific', 'Egy szám, több helyiértékes alak'],
 ['05-polinomok', 'polynomial', 'Egynemű tagok összevonása'], ['06-nevezetes-szorzatok', 'identity', 'Négy rész, egy nevezetes szorzat'],
 ['07-szorzatta-alakitas', 'factor', 'A közös tényező mint közös oldal'], ['08-algebrai-tortek', 'rational', 'Egyszerűsítés és a kizárt érték'],
 ['09-oszthatosag', 'divisibility', 'Változtasd meg az utolsó számjegyet!'], ['10-lnko-lkkt', 'gcd', 'A közös és az összes szükséges tényező'],
 ['11-szamrendszerek', 'base', 'Számjegyek és helyiértékek']
].forEach(([file, kind, title, options]) => add(9, A9, file, kind, title, options));
[
 ['01-feltetelek', 'logic', 'Az állítás iránya számít'], ['02-skatulyaelv', 'boxes', 'Tárgyak és dobozok'],
 ['03-sorba-rendezes', 'counting', 'Hányféle sorrend?', { mode: 'permutation' }], ['04-kivalasztas', 'counting', 'Kiválasztás sorrenddel', { mode: 'variation' }],
 ['05-kombinacio', 'counting', 'Kiválasztás sorrend nélkül', { mode: 'combination' }]
].forEach(([file, kind, title, options]) => add(10, G10, file, kind, title, options));
[
 ['00-racionalis-irracionalis', 'irrational', 'A négyzet átlója a számegyenesen'], ['01-negyzetgyok-azonossagok', 'root', 'Területből oldalhossz'],
 ['02-negyzetgyok-alkalmazasok', 'simplifyRoot', 'Négyzetszám kiemelése a gyökjel alól'], ['03-n-edik-gyok', 'nthRoot', 'Páros és páratlan gyök'],
 ['04-vegyes', 'simplifyRoot', 'Azonos gyökös tagok csoportosítása', { sum: true }]
].forEach(([file, kind, title, options]) => add(10, R10, file, kind, title, options));
[
 ['02-megoldokeplet', 'completeSquare', 'Teljes négyzetté kiegészítés'], ['03-diszkriminans', 'quadratic', 'A diszkrimináns és a metszéspontok'],
 ['04-gyoktenyezos-viete', 'viete', 'A gyökökből együtthatók'], ['05-visszavezetheto', 'substitution', 'Új ismeretlen, majd visszahelyettesítés'],
 ['06-egyenletrendszerek', 'systems', 'Két görbe közös pontjai'], ['08-parameteres', 'quadratic', 'Mi történik, ha a főegyüttható nulla?', { parameter: true }],
 ['09-negyzetgyokos', 'radical', 'Valódi és hamis gyök'], ['10-kozepek', 'rectangle', 'Számtani és mértani közép', { means: true }],
 ['11-szelsoertek', 'rectangle', 'Azonos kerület, változó terület'], ['12-szoveges', 'rectangle', 'A szövegtől a geometriai modellig', { problem: true }]
].forEach(([file, kind, title, options]) => add(10, Q10, file, kind, title, options));
[
 ['01-hatvanyozas', 'power', 'Egész kitevők, reciprok értékek', { negative: true }], ['02-gyokvonas', 'nthRoot', 'Gyökvonás és visszaellenőrzés'],
 ['03-tortkitevo', 'fractionalPower', 'A tört számlálója és nevezője'], ['05-exp-egyenletek', 'expEquation', 'A keresett kitevő a metszéspontnál'],
 ['06-logaritmus', 'logDefinition', 'A logaritmus a kitevőt keresi'], ['07-log-azonossagok', 'logRules', 'Szorzásból összeadás'],
 ['09-log-egyenletek', 'logEquation', 'Metszéspont és értelmezési tartomány'], ['10-alkalmazasok', 'interest', 'Növekedés több időszakon át']
].forEach(([file, kind, title, options]) => add(11, H11, file, kind, title, options));
[
 ['03-terbeli', 'solid', 'A testben megbújó derékszögű háromszög'], ['08-haromszog-megoldasa', 'triangle', 'Ugyanazokból az adatokból két háromszög is lehet'],
 ['09-alkalmazasok', 'survey', 'Távolságmérés két parti pontról'], ['10-vektorok', 'vectors', 'Vektorok összeadása koordinátákkal'],
 ['11-skalaris-szorzat', 'dot', 'Az előjeles vetület'], ['15-osszegzesi-tetelek', 'angleAddition', 'Két forgatás és az összegszög']
].forEach(([file, kind, title, options]) => add(11, T11, file, kind, title, options));
const examAliases = {
 'v1-01-racionalis-irracionalis': `${R10}/00-racionalis-irracionalis`, 'v1-02-negyzetgyok-azonossagok': `${R10}/01-negyzetgyok-azonossagok`,
 'v1-03-negyzetgyok-muveletek': `${R10}/02-negyzetgyok-alkalmazasok`, 'v1-04-n-edik-gyok': `${R10}/03-n-edik-gyok`, 'v1-05-n-edik-gyok-muveletek': `${R10}/04-vegyes`,
 'v2-01-megoldokeplet': `${Q10}/02-megoldokeplet`, 'v2-02-gyoktenyezos-alak': `${Q10}/04-gyoktenyezos-viete`,
 'v2-04-negyzetgyokos': `${Q10}/09-negyzetgyokos`, 'v2-05-magasabbfoku-tortes': `${Q10}/05-visszavezetheto`,
 'v2-06-egyenletrendszerek': `${Q10}/06-egyenletrendszerek`, 'v2-07-szoveges': `${Q10}/12-szoveges`, 'v2-08-diszkriminans': `${Q10}/03-diszkriminans`,
 'v4-01-skatulyaelv': `${G10}/02-skatulyaelv`, 'v4-02-permutacio': `${G10}/03-sorba-rendezes`, 'v4-03-variacio': `${G10}/04-kivalasztas`, 'v4-04-kombinacio': `${G10}/05-kombinacio`
};
Object.entries(examAliases).forEach(([file, source]) => { descriptions[`10/vizsga/${file}.js`] = descriptions[`10/${source}.js`]; });
add(10, 'vizsga', 'v2-03-egyenlotlensegek', 'inequality', 'A parabola előjele és a megoldáshalmaz');

function node(tag, attrs, parent, content) {
  const x = document.createElementNS(NS, tag); Object.entries(attrs || {}).forEach(([k, v]) => x.setAttribute(k, v));
  if (content != null) x.textContent = content; if (parent) parent.appendChild(x); return x;
}
function label(s, x, y, t, anchor = 'middle', color = INK) { return node('text', { x, y, 'text-anchor': anchor, fill: color }, s, t); }
function line(s, x1, y1, x2, y2, color = MUTED, width = 1.3, dash = '') { return node('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': width, 'stroke-dasharray': dash }, s); }
function arrow(s, x1, y1, x2, y2, color) {
  if (Math.hypot(x2 - x1, y2 - y1) < 1e-8) return dot(s, x1, y1, color);
  line(s, x1, y1, x2, y2, color, 3);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  [-.5, .5].forEach(offset => line(s, x2, y2, x2 - 9 * Math.cos(angle + offset), y2 - 9 * Math.sin(angle + offset), color, 2.5));
}
function dot(s, x, y, color = PEN, radius = 4) { return node('circle', { cx: x, cy: y, r: radius, fill: color }, s); }
function rect(s, x, y, w, h, color = PEN, opacity = .16) { return node('rect', { x, y, width: w, height: h, fill: color, 'fill-opacity': opacity, stroke: color, 'stroke-width': 1.5 }, s); }
function polygon(s, points, color = PEN, opacity = .1) { return node('polygon', { points: points.map(p => p.join(',')).join(' '), fill: color, 'fill-opacity': opacity, stroke: color, 'stroke-width': 2 }, s); }
function path(s, points, color = PEN, width = 2.5, dash = '') {
  let active = false; const d = points.map(([x, y]) => { if (!Number.isFinite(x) || !Number.isFinite(y)) { active = false; return ''; } const p = `${active ? 'L' : 'M'}${x},${y}`; active = true; return p; }).join(' ');
  return node('path', { d, stroke: color, 'stroke-width': width, 'stroke-dasharray': dash, fill: 'none' }, s);
}
let serial = 0;
const views = new Map();
let removalObserver;
function mount(box, definition) {
  const id = `szem-${++serial}`, state = {}, controls = document.createElement('div'); controls.className = 'ctrl';
  box.innerHTML = '<div class="plot szemleltetes"><div class="canvasbox szem-abra"></div></div>';
  const plot = box.firstElementChild, stage = plot.firstElementChild; plot.appendChild(controls);
  const formula = document.createElement('div'); formula.className = 'ftex'; controls.appendChild(formula);
  const props = document.createElement('dl'); props.className = 'props'; props.setAttribute('aria-live', 'polite'); props.setAttribute('aria-atomic', 'true');
  const help = document.createElement('p'); help.className = 'small'; controls.appendChild(help);
  let draw;
  const api = {
    state, definition, stage,
    range(key, title, min, max, step, value) {
      state[key] = value; const l = document.createElement('label'), out = document.createElement('b'), inp = document.createElement('input');
      const span = document.createElement('span'); span.append(document.createTextNode(title + ': '), out); out.textContent = n(value);
      inp.type = 'range'; inp.id = `${id}-${key}`; inp.min = min; inp.max = max; inp.step = step; inp.value = value; l.htmlFor = inp.id; l.append(span, inp); controls.appendChild(l);
      inp.oninput = () => { state[key] = Number(inp.value); out.textContent = n(state[key]); draw(); };
    },
    select(key, title, choices, value) {
      state[key] = String(value); const l = document.createElement('label'), sel = document.createElement('select'); sel.className = 'szem-select'; sel.id = `${id}-${key}`; l.htmlFor = sel.id; l.textContent = title;
      choices.forEach(([v, t]) => { const opt = document.createElement('option'); opt.value = v; opt.textContent = t; sel.appendChild(opt); }); sel.value = value;
      l.appendChild(sel); controls.appendChild(l); sel.onchange = () => { state[key] = sel.value; draw(); };
    },
    info(expression, rows, instruction) {
      formula.textContent = expression; props.replaceChildren();
      rows.forEach(([k, v]) => { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; props.append(dt, dd); });
      help.textContent = instruction || '';
    },
    figure(title, height = 310) {
      stage.replaceChildren(); const w = Math.max(220, stage.clientWidth || 360), s = node('svg', { viewBox: `0 0 ${w} ${height}`, width: w, height, role: 'img', 'aria-label': title }, stage);
      node('title', {}, s, title); return { s, w, h: height };
    },
    graph(title, xlim, ylim, height = 310, options = {}) {
      const { s, w, h } = api.figure(title, height), l = 46, r = w - 16, t = 20, b = h - 42;
      const X = x => l + (x - xlim[0]) / (xlim[1] - xlim[0]) * (r - l), Y = y => b - (y - ylim[0]) / (ylim[1] - ylim[0]) * (b - t);
      const clipId = id + '-clip', defs = node('defs', {}, s), clip = node('clipPath', { id: clipId }, defs); node('rect', { x: l, y: t, width: r - l, height: b - t }, clip);
      const ticks = w < 330 ? 3 : 4;
      for (let i = 0; i <= ticks; i++) { const x = xlim[0] + (xlim[1] - xlim[0]) * i / ticks, px = X(x); line(s, px, t, px, b, GRID, 1); label(s, px, b + 19, n(x, 1)); }
      for (let i = 0; i <= 4; i++) { const y = ylim[0] + (ylim[1] - ylim[0]) * i / 4, py = Y(y); line(s, l, py, r, py, GRID, 1); label(s, l - 7, py + 4, options.yTick ? options.yTick(y) : n(y, 1), 'end'); }
      if (ylim[0] <= 0 && ylim[1] >= 0) line(s, l, Y(0), r, Y(0));
      if (xlim[0] <= 0 && xlim[1] >= 0) line(s, X(0), t, X(0), b);
      label(s, (l + r) / 2, h - 5, options.xLabel || 'x');
      if (options.yLabel) label(s, l, 12, options.yLabel, 'start'); else label(s, 12, (t + b) / 2, 'y');
      const g = node('g', { 'clip-path': `url(#${clipId})` }, s);
      return { s, g, w, h, X, Y, curve: (f, color = PEN, from = xlim[0], to = xlim[1], dash = '') => path(g, samples(f, from, to).map(([x, y]) => [X(x), Y(y)]), color, 2.5, dash) };
    }
  };
  const renderer = renderers[definition.kind]; if (!renderer) throw new Error('Ismeretlen szemléltetés: ' + definition.kind);
  draw = renderer(api); controls.appendChild(props); draw();
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (box.isConnected) draw(); }) : null; if (resize) resize.observe(stage);
  views.set(box, resize);
  if (!removalObserver && typeof MutationObserver === 'function') {
    removalObserver = new MutationObserver(() => { views.forEach((observer, target) => { if (!target.isConnected) { if (observer) observer.disconnect(); views.delete(target); } }); });
    removalObserver.observe(document.body, { childList: true, subtree: true });
  }
}
const renderers = Object.create(null);

renderers.fraction = a => {
  a.range('d', 'Nevező', 2, 20, 1, 8); a.range('p', 'Számláló', 0, 20, 1, 3);
  return () => { const { p, d } = a.state, { s, w } = a.figure('Tört sávokkal és számként'), rows = Math.ceil(Math.max(1, p / d));
    const left = 25, bw = w - 50, bh = Math.min(44, (250 - 8 * (rows - 1)) / rows);
    for (let r = 0; r < rows; r++) for (let j = 0; j < d; j++) rect(s, left + j * bw / d, 20 + r * (bh + 8), bw / d - 2, bh, r * d + j < p ? PEN : GRID, .25);
    const g = gcd(p, d); a.info(`${p}/${d} = ${p / g}/${d / g}`, [['Tizedes közelítés', n(p / d, 6)], ['Százalék', n(p / d * 100) + '%'], ['Egy teljes sáv', `${d}/${d} = 1`]], 'Változtasd a nevezőt is: ugyanannyi kijelölt rész más méretű darabokat jelent.');
  };
};
renderers.operations = a => {
  a.range('x', 'Első szám', -6, 6, .5, -2); a.range('y', 'Második szám', -6, 6, .5, 3);
  a.select('op', 'Művelet', [['+', 'Összeadás'], ['−', 'Kivonás']], '+');
  return () => { const { x, y, op } = a.state, v = op === '+' ? y : -y, z = x + v, { s, w } = a.figure('Két egymás utáni lépés a számegyenesen', 240), X = t => 25 + (t + 12) / 24 * (w - 50);
    line(s, X(-12), 170, X(12), 170); for (let t = -12; t <= 12; t += 4) { line(s, X(t), 166, X(t), 174); label(s, X(t), 194, t); }
    line(s, X(0), 90, X(x), 90, PEN, 4); dot(s, X(x), 90); label(s, (X(0) + X(x)) / 2, 72, n(x));
    line(s, X(x), 130, X(z), 130, RED, 4); dot(s, X(z), 130, RED); label(s, (X(x) + X(z)) / 2, 115, (v >= 0 ? '+' : '') + n(v));
    line(s, X(z), 135, X(z), 170, RED, 1, '4 4'); a.info(`${n(x)} ${op} (${n(y)}) = ${n(z)}`, [['Indulás', '0'], ['Első lépés után', n(x)], ['Eredmény', n(z)]], 'A második szakasz végpontját figyeld; kivonáskor az ellenkező irányba lépünk.');
  };
};
renderers.order = a => {
  a.range('x', 'A zárójelben álló szám', 1, 9, 1, 3); a.range('step', 'Elvégzett lépések', 0, 4, 1, 0);
  return () => { const { x, step } = a.state, lines = [`2 + 3 · (${x} + 1)²`, `2 + 3 · ${x + 1}²`, `2 + 3 · ${(x + 1) ** 2}`, `2 + ${3 * (x + 1) ** 2}`, String(2 + 3 * (x + 1) ** 2)], { s, w } = a.figure('Műveleti sorrend, lépésenként', 290);
    const names = ['Zárójel', 'Hatványozás', 'Szorzás', 'Összeadás']; names.forEach((t, i) => { rect(s, 20, 15 + i * 65, w - 40, 45, i < step ? GREEN : GRID); label(s, w / 2, 43 + i * 65, t); });
    a.info(lines[step], [['Következő lépés', step < 4 ? names[step] : 'Kész'], ['Eredmény', step === 4 ? lines[4] : 'A lépések végén jelenik meg.']], 'A csúszkával egyenként végezd el a műveleteket.');
  };
};
renderers.percent = a => {
  a.range('base', 'Alap', 20, 1000, 20, 200); a.range('p', 'Százalékláb (%)', 0, 150, 5, 35);
  return () => { const { base, p } = a.state, { s, w } = a.figure('Százalékérték az alaphoz viszonyítva', 250), X = v => 25 + v / 150 * (w - 50);
    rect(s, X(0), 48, X(100) - X(0), 48, GRID); rect(s, X(0), 128, X(p) - X(0), 48, PEN);
    label(s, X(50), 78, `100% = ${n(base)}`); label(s, w / 2, 210, `${n(p)}% = ${n(base * p / 100)}`);
    a.info(`${n(base)} · ${n(p)} / 100 = ${n(base * p / 100)}`, [['Alap', n(base)], ['Százalékláb', n(p) + '%'], ['Százalékérték', n(base * p / 100)]], 'Próbálj 100%-nál nagyobb százaléklábat is.');
  };
};
renderers.interest = a => {
  a.range('principal', 'Kezdőösszeg', 10000, 100000, 10000, 20000); a.range('rate', 'Kamat időszakonként (%)', 0, 20, 1, 10); a.range('years', 'Időszakok száma', 1, 12, 1, 5);
  return () => { const { principal: p, rate: r, years: t } = a.state, f = x => p * (1 + r / 100) ** x, g = a.graph('Egyszerű kamat (piros) és kamatos kamat (kék)', [0, 12], [0, Math.max(p * 1.2, f(12) * 1.1)], 310, { xLabel: 'időszak', yLabel: 'ezer Ft', yTick: y => n(y / 1000, 0) });
    g.curve(f); g.curve(x => p * (1 + r / 100 * x), RED); dot(g.g, g.X(t), g.Y(f(t)));
    a.info(`T = ${n(p)} · (1 + ${r}/100)^${t}`, [['Kék: kamatos kamat', n(f(t), 2)], ['Piros: egyszerű kamat', n(p * (1 + r / 100 * t), 2)], ['Különbség', n(f(t) - p * (1 + r / 100 * t), 2)]], 'A kamatos kamatnál a korábbi kamat is kamatozik. A vízszintes tengely az időszakok száma, a függőleges a pénzösszeg.');
  };
};
renderers.power = a => {
  a.select('b', 'Alap', [['-3', '−3'], ['-2', '−2'], ['0.5', '1/2'], ['2', '2'], ['3', '3']], '-2'); a.range('e', 'Kitevő', a.definition.negative ? -4 : 1, 5, 1, 3);
  return () => { const b = Number(a.state.b), e = a.state.e, { s, w } = a.figure('Hatványlétra: minden lépés szorzás az alappal', 300);
    for (let i = 0; i < 5; i++) { const k = e - 2 + i; label(s, 25, 35 + 52 * i, `(${n(b)})^${k}`, 'start'); label(s, w - 25, 35 + 52 * i, n(b ** k, 6), 'end'); if (i < 4) line(s, 35, 47 + 52 * i, w - 35, 47 + 52 * i, GRID); }
    a.info(`(${n(b)})^${e} = ${n(b ** e, 6)}`, [['Tényezők / reciprok', e > 0 ? Array(e).fill(`(${n(b)})`).join(' · ') : e === 0 ? '1 (az alap nem nulla)' : `1 / (${n(b)})^${-e}`], ['Zárójel nélkül: −|a|ⁿ', n(-(Math.abs(b) ** e), 6)]], 'A zárójelezett negatív alapnál a kitevő párossága is számít.');
  };
};
renderers.powerRules = a => {
  a.range('m', a.definition.sameExponent ? 'Első alap' : 'Első kitevő', 1, 5, 1, 2); a.range('k', a.definition.sameExponent ? 'Második alap' : 'Második kitevő', 1, 5, 1, 3);
  return () => { const { m, k } = a.state, same = a.definition.sameExponent, { s, w } = a.figure('Hatványazonosság tényezősorokkal', 250);
    const strings = same ? [Array(3).fill(m).join(' · '), Array(3).fill(k).join(' · '), Array(3).fill(`(${m} · ${k})`).join(' · ')] : [Array(m).fill('a').join(' · '), Array(k).fill('a').join(' · '), Array(m + k).fill('a').join(' · ')];
    strings.forEach((t, i) => label(s, w / 2, 45 + i * 75, t, 'middle', i === 1 ? RED : PEN));
    a.info(same ? `${m}³ · ${k}³ = (${m} · ${k})³` : `a^${m} · a^${k} = a^${m + k}`, [['Összekapcsolás', same ? 'Mindhárom helyen egy-egy tényezőpár.' : `${m} + ${k} darab a tényező.`], ['Feltétel', same ? 'Itt pozitív egész kitevővel dolgozunk.' : 'Osztásnál az alap nem lehet nulla.']], same ? 'A kitevő változatlan: az alapokat szorozzuk össze.' : 'A közös alap megmarad, a tényezők darabszáma adódik össze.');
  };
};
renderers.primes = a => {
  a.select('p', 'Szita lépése', [['1', 'Kiindulás'], ['2', 'A 2 többszörösei'], ['3', 'A 3 többszörösei is'], ['5', 'Az 5 többszörösei is'], ['7', 'A 7 többszörösei is']], '2');
  return () => { const p = Number(a.state.p), { s, w } = a.figure('Eratoszthenész szitája 1 és 100 között', 330), cell = (w - 20) / 10;
    for (let i = 1; i <= 100; i++) { const crossed = i === 1 || [2, 3, 5, 7].some(q => q <= p && i > q && i % q === 0), x = 10 + (i - 1) % 10 * cell, y = 10 + Math.floor((i - 1) / 10) * 30; if (!crossed) rect(s, x, y, cell - 2, 27, PEN); label(s, x + (cell - 2) / 2, y + 18, i, 'middle', crossed ? MUTED : INK); if (crossed) line(s, x + 3, y + 22, x + cell - 5, y + 5, RED); }
    a.info('1 nem prímszám', [['Utolsó kiválasztott prím', p === 1 ? 'Még nincs' : String(p)], ['Miért elég a 7?', '√100 = 10; a következő prím 11.']], 'A kiválasztott prímet megtartjuk, csak a nála nagyobb többszöröseit húzzuk ki.');
  };
};
renderers.gcd = a => {
  a.range('x', 'Első szám', 2, 120, 1, 24); a.range('y', 'Második szám', 2, 120, 1, 36);
  return () => { const { x, y } = a.state, fx = factors(x), fy = factors(y), g = gcd(x, y), { s, w } = a.figure('Két szám prímtényezői', 260), common = factors(g);
    const row = (fs, yy) => { const remain = common.slice(), cw = (w - 40) / Math.max(1, fs.length); fs.forEach((f, i) => { const at = remain.indexOf(f), shared = at >= 0; if (shared) remain.splice(at, 1); rect(s, 20 + i * cw, yy, cw - 4, 36, shared ? GREEN : PEN); label(s, 20 + (i + .5) * cw - 2, yy + 24, f); }); };
    row(fx, 45); row(fy, 125); label(s, w / 2, 220, 'Zöld: párosítható közös tényezők');
    a.info(`LNKO = ${g}; LKKT = ${x / g * y}`, [['Első felbontás', fx.join(' · ')], ['Második felbontás', fy.join(' · ')], ['LNKO · LKKT', `${g} · ${x / g * y} = ${x * y}`]], 'Minden közös prímtényezőből csak a mindkét számban meglévő példányokat párosítjuk.');
  };
};
renderers.scientific = a => {
  a.range('m', 'Normálalak szorzója', 1, 9.9, .1, 3.2); a.range('e', 'Tízes kitevő', -6, 6, 1, 3);
  return () => { const { m, e } = a.state, { s, w } = a.figure('A normálalak és a tízes hatványai', 240), x = m * 10 ** e;
    label(s, w / 2, 65, `${n(m)} · 10^${e}`, 'middle', PEN); line(s, w / 2, 90, w / 2, 135, RED, 2); label(s, w / 2, 170, x.toLocaleString('hu-HU', { maximumFractionDigits: 8 }));
    a.info(`${n(m)} · 10^${e}`, [['Szorzó feltétele', '1 ≤ a < 10'], ['Kitevő', String(e)], ['Érték', x.toLocaleString('hu-HU', { maximumFractionDigits: 8 })]], 'A pozitív kitevő nagyít, a negatív kitevő kicsinyít; a szorzó végig 1 és 10 közötti marad.');
  };
};
renderers.variables = a => {
  a.range('x', 'x oldalhossz', 1, 10, 1, 4); a.range('y', 'y oldalhossz', 1, 8, 1, 3);
  return () => { const { x, y } = a.state, { s, w } = a.figure('Változó oldalú téglalap'), scale = Math.min((w - 65) / 10, 22); rect(s, 30, 40, x * scale, y * scale); label(s, 30 + x * scale / 2, 28, `x = ${x}`); label(s, 30 + x * scale / 2, 65 + y * scale, `y = ${y}`);
    a.info(`T = xy = ${x * y}`, [['Kerület', `2x + 2y = ${2 * x + 2 * y}`], ['Terület', `x · y = ${x * y}`]], 'A képlet ugyanaz marad, miközben a betűk helyére más szám kerül.'); };
};
renderers.polynomial = a => {
  a.range('p', 'Első x-tag együtthatója', -4, 4, 1, 3); a.range('q', 'Második x-tag együtthatója', -4, 4, 1, -2); a.range('c', 'Konstans tag', -4, 4, 1, 2);
  return () => { const { p, q, c } = a.state, { s, w } = a.figure('Előjeles x-lapkák és konstansok', 270), cw = (w - 40) / 8;
    [p, q, c].forEach((v, r) => { for (let i = 0; i < Math.abs(v); i++) { rect(s, 20 + i * cw, 20 + r * 75, cw - 4, r === 2 ? 32 : 45, v < 0 ? RED : PEN); label(s, 20 + (i + .5) * cw - 2, 44 + r * 75, (v < 0 ? '−' : '+') + (r === 2 ? '1' : 'x')); } });
    a.info(`${p}x + (${q}x) + (${c}) = ${p + q}x + (${c})`, [['x-tagok együtthatója', String(p + q)], ['Konstans', String(c)], ['Kioltható x-párok', String(p * q < 0 ? Math.min(Math.abs(p), Math.abs(q)) : 0)]], 'Kék: pozitív, piros: negatív lapka. Egy +x és egy −x összege nulla. A konstans nem vonható össze az x-taggal.'); };
};
renderers.identity = a => {
  a.range('x', 'a', 2, 8, 1, 5); a.range('y', 'b', 2, 8, 1, 3);
  return () => { const { x, y } = a.state, { s, w } = a.figure('Az összeg négyzete négy területből', 310), k = Math.min((w - 55) / (x + y), 240 / (x + y)), xx = (w - (x + y) * k) / 2, yy = 25;
    [[0, 0, x, x, PEN, 'a²'], [x, 0, y, x, GREEN, 'ab'], [0, x, x, y, GREEN, 'ab'], [x, x, y, y, RED, 'b²']].forEach(([px, py, bw, bh, col, t]) => { rect(s, xx + px * k, yy + py * k, bw * k, bh * k, col); label(s, xx + (px + bw / 2) * k, yy + (py + bh / 2) * k + 4, t); });
    a.info('(a + b)² = a² + 2ab + b²', [['a²', String(x * x)], ['Két ab együtt', `2 · ${x * y} = ${2 * x * y}`], ['b²', String(y * y)], ['Teljes terület', String((x + y) ** 2)]], 'A két ab téglalap elhelyezkedése eltér, de a területük azonos.'); };
};
renderers.factor = a => {
  a.range('k', 'Közös tényező', 1, 6, 1, 3); a.range('x', 'Első szélesség', 1, 6, 1, 4); a.range('y', 'Második szélesség', 1, 6, 1, 2);
  return () => { const { k, x, y } = a.state, { s, w } = a.figure('Kiemelés téglalapok összeillesztésével', 260), sc = Math.min((w - 55) / (x + y), 28); rect(s, 25, 45, x * sc, k * sc); rect(s, 25 + x * sc, 45, y * sc, k * sc, RED); label(s, 25 + x * sc / 2, 32, x); label(s, 25 + (x + y / 2) * sc, 32, y); label(s, 25 + (x + y) * sc / 2, 75 + k * sc, `Közös magasság: ${k}`);
    a.info(`${k} · ${x} + ${k} · ${y} = ${k} · (${x} + ${y})`, [['Tagok területe', `${k * x} + ${k * y}`], ['Összesen', String(k * (x + y))]], 'A kiemelt tényező a két téglalap közös magassága.'); };
};
renderers.rational = a => {
  a.range('k', 'Kizárt érték', -3, 3, 1, 1); a.range('x', 'Behelyettesített x', -5, 5, .5, 2);
  return () => { const { k, x } = a.state, f = t => t + 2, g = a.graph('Egyszerűsített függvény, a kizárt helyen lyukkal', [-5, 5], [-4, 8]); g.curve(f);
    node('circle', { cx: g.X(k), cy: g.Y(f(k)), r: 6, fill: 'var(--card)', stroke: RED, 'stroke-width': 2 }, g.g);
    if (x !== k) dot(g.g, g.X(x), g.Y(f(x)), GREEN);
    a.info(`((x − (${k}))(x + 2)) / (x − (${k}))`, [['Egyszerűsített alak', 'x + 2'], ['Eredeti kikötés', `x ≠ ${k}`], ['Behelyettesítés', x === k ? 'Az eredeti tört nincs értelmezve.' : `x = ${n(x)} → ${n(f(x))}`]], 'Egyszerűsíteni tényezővel lehet. A nevező eredeti zérushelye az egyszerűsítés után is kizárt marad.'); };
};
renderers.divisibility = a => {
  a.range('d', 'Utolsó számjegy', 0, 9, 1, 4);
  return () => { const d = a.state.d, v = 1230 + d, { s, w } = a.figure('Oszthatósági feltételek ugyanarra a számra', 290);
    [2, 3, 4, 5, 6, 9, 10].forEach((p, i) => { const y = 25 + i * 35; label(s, 25, y, `${p}-vel`, 'start'); label(s, w - 25, y, v % p === 0 ? 'osztható' : `maradék: ${v % p}`, 'end', v % p === 0 ? GREEN : MUTED); });
    a.info(`123${d}`, [['Számjegyösszeg', String(6 + d)], ['Utolsó két jegy', String(30 + d)], ['Utolsó jegy', String(d)]], 'Keress olyan utolsó jegyet, amellyel a szám egyszerre osztható 3-mal és 4-gyel.'); };
};
renderers.base = a => {
  a.range('value', 'Tízes számrendszerbeli érték', 0, 63, 1, 27); a.select('base', 'Számrendszer alapja', [['2', '2'], ['3', '3'], ['5', '5'], ['8', '8']], '2');
  return () => { const v = a.state.value, b = Number(a.state.base), digits = v.toString(b), { s, w } = a.figure('Helyiértékes felbontás', 260), cw = (w - 30) / digits.length;
    [...digits].forEach((d, i) => { const e = digits.length - i - 1; rect(s, 15 + i * cw, 50, cw - 4, 55); label(s, 15 + (i + .5) * cw - 2, 83, d); label(s, 15 + (i + .5) * cw - 2, 133, `${b}^${e}`); label(s, 15 + (i + .5) * cw - 2, 165, Number(d) * b ** e); });
    a.info(`${digits} (${b}-es alap) = ${v} (10-es alap)`, [['Kifejtés', [...digits].map((d, i) => `${d}·${b}^${digits.length - i - 1}`).join(' + ')]], 'A dobozok alatt a helyiérték és az adott számjegy értéke látható.'); };
};
renderers.logic = a => {
  a.select('direction', 'Állítás iránya', [['forward', 'Négyzet ⇒ téglalap'], ['reverse', 'Téglalap ⇒ négyzet']], 'forward');
  return () => { const reverse = a.state.direction === 'reverse', { s, w } = a.figure('A négyzetek a téglalapok részhalmazát alkotják', 280);
    rect(s, 20, 30, w - 40, 210, PEN); rect(s, 40, 100, w - 80, 110, GREEN); label(s, w / 2, 62, 'Téglalapok'); label(s, w / 2, 128, 'Négyzetek');
    rect(s, 50, 155, 30, 30, GREEN); rect(s, w - 105, 70, 65, 22, RED);
    a.info(reverse ? 'Téglalap ⇒ négyzet: hamis' : 'Négyzet ⇒ téglalap: igaz', [['Ellenpélda', reverse ? 'A 2 × 3-as téglalap nem négyzet.' : 'Nincs: minden négyzet téglalap.'], ['Négyzetnek lenni', 'Elégséges feltétel a téglalaphoz.'], ['Téglalapnak lenni', 'Szükséges feltétel a négyzethez.']], 'Fordítsd meg a nyilat, és figyeld meg, melyik irányt cáfolja a piros téglalap.'); };
};
renderers.boxes = a => {
  a.range('k', 'Dobozok száma', 2, 6, 1, 4); a.range('p', 'Tárgyak száma', 1, 30, 1, 9);
  return () => { const { k, p } = a.state, { s, w } = a.figure('A lehető legegyenletesebben szétosztott tárgyak', 280), cw = (w - 20) / k, q = Math.floor(p / k), r = p % k;
    for (let i = 0; i < k; i++) { rect(s, 10 + i * cw, 30, cw - 5, 195, GRID); const count = q + (i < r ? 1 : 0); for (let j = 0; j < count; j++) dot(s, 10 + (i + .5) * cw - 2, 205 - j * 16, j === q ? RED : PEN, 5); label(s, 10 + (i + .5) * cw - 2, 250, count); }
    a.info(`Legalább ⌈${p}/${k}⌉ = ${Math.ceil(p / k)}`, [['Mit garantál?', `Valamelyik dobozban legalább ${Math.ceil(p / k)} tárgy van.`], ['Ábrázolt elosztás', 'A lehető legegyenletesebb.']], 'A legnagyobb doboztartalom ennél kisebb semmilyen más elosztással nem lehet.'); };
};
renderers.counting = a => {
  a.range('n', 'Összes elem', 3, 7, 1, 5);
  if (a.definition.mode !== 'permutation') a.range('k', 'Kiválasztott elemek', 1, 3, 1, 2); else a.state.k = 2;
  if (a.definition.mode === 'variation') a.select('repeat', 'Ismétlés', [['no', 'Nincs ismétlés'], ['yes', 'Lehet ismétlés']], 'no'); else a.state.repeat = 'no';
  return () => { const { n: total, k, repeat } = a.state, mode = a.definition.mode, count = mode === 'permutation' ? total : k, replacement = repeat === 'yes' && mode === 'variation', choices = Array.from({ length: count }, (_, i) => replacement ? total : total - i), ordered = choices.reduce((p, x) => p * x, 1), answer = mode === 'combination' ? choose(total, k) : ordered, { s, w } = a.figure('Helyenkénti választási lehetőségek', 280), cw = (w - 30) / count;
    choices.forEach((x, i) => { rect(s, 15 + i * cw, 70, cw - 4, 60); label(s, 15 + (i + .5) * cw - 2, 105, x); label(s, 15 + (i + .5) * cw - 2, 155, `${i + 1}.`); });
    if (mode === 'combination') label(s, w / 2, 220, `Egy csoport: ${k}! = ${fact(k)} sorrend.`);
    a.info(mode === 'combination' ? `C(${total}; ${k}) = ${n(answer)}` : `${choices.join(' · ')} = ${n(answer)}`, [['Sorrend', mode === 'combination' ? 'Nem számít: osztunk k!-sal.' : 'Számít.'], ['Eredmény', n(answer)], ['Ismétlés', replacement ? 'Engedélyezett.' : 'Ebben a modellben nincs.']], 'A dobozban az adott helyen még rendelkezésre álló választások száma látható.'); };
};
renderers.irrational = a => {
  a.range('digits', 'Tizedes közelítés pontossága', 0, 5, 1, 1);
  return () => { const d = a.state.digits, scale = 10 ** d, lo = Math.floor(Math.SQRT2 * scale) / scale, hi = lo + 1 / scale, { s, w } = a.figure('Az egységnégyzet átlója √2 hosszú', 290), k = Math.min(w - 80, 150), x = (w - k) / 2;
    rect(s, x, 30, k, k); line(s, x, 30 + k, x + k, 30, RED, 3); label(s, w / 2, 20, '1'); label(s, w / 2, 65 + k, 'Átló: √2');
    const X = v => 30 + (v - 1) * (w - 60); line(s, X(1), 255, X(2), 255); line(s, X(lo), 255, X(hi), 255, GREEN, 5); dot(s, X(Math.SQRT2), 255, RED); label(s, X(1), 280, '1'); label(s, X(2), 280, '2');
    a.info(`${n(lo, 5)} < √2 < ${n(hi, 5)}`, [['Alsó közelítés négyzete', n(lo ** 2, 10)], ['Felső közelítés négyzete', n(hi ** 2, 10)], ['Összehasonlítás', 'A 2 a két négyzet közé esik.']], 'A tizedes közelítés szűkíthető. A szám pontos helyét az átló hossza adja, nem egy véges tizedes tört.'); };
};
renderers.root = a => {
  a.range('x', 'x', -6, 6, .5, -3);
  return () => { const x = a.state.x, { s, w } = a.figure('A négyzet oldala mindig nemnegatív', 280), sc = Math.min((w - 70) / 6, 28); rect(s, (w - Math.abs(x) * sc) / 2, 30, Math.abs(x) * sc, Math.abs(x) * sc); label(s, w / 2, 235, `Terület: x² = ${n(x * x)}`);
    a.info(`√(x²) = |x| = ${n(Math.abs(x))}`, [['x', n(x)], ['Négyzet területe', n(x * x)], ['Oldalhossz', n(Math.abs(x))]], 'Negatív x esetén sem lehet negatív a négyzet oldalhossza.'); };
};
renderers.simplifyRoot = a => {
  a.range('k', 'Kiemelhető tényező', 1, 5, 1, 2); a.select('m', 'Gyök alatt maradó szám', [['2', '2'], ['3', '3'], ['5', '5'], ['7', '7']], '3');
  return () => { const k = a.state.k, m = Number(a.state.m), { s, w } = a.figure('Négyzetszámnyi azonos területdarab', 290), cell = Math.min((w - 45) / k, 220 / k), xx = (w - k * cell) / 2;
    for (let y = 0; y < k; y++) for (let x = 0; x < k; x++) { rect(s, xx + x * cell, 20 + y * cell, cell - 2, cell - 2); if (cell > 28) label(s, xx + (x + .5) * cell, 24 + (y + .5) * cell, m); }
    a.info(`√${k * k * m} = ${k}√${m}`, [['Területdarabok', `${k}² = ${k * k}`], ['Egy kis négyzet oldala', `√${m}`], ['Teljes oldalhossz', `${k}√${m}`], ...(a.definition.sum ? [['Összevonás', `${k}√${m} + 2√${m} = ${k + 2}√${m}`]] : [])], 'A terület k²-szeresére, az oldalhossz k-szorosára nő.'); };
};
renderers.nthRoot = a => {
  a.range('x', 'Gyökjel alatti szám', -16, 16, 1, -8); a.select('degree', 'Gyökkitevő', [['2', '2 (páros)'], ['3', '3 (páratlan)'], ['4', '4 (páros)'], ['5', '5 (páratlan)']], '3');
  return () => { const x = a.state.x, k = Number(a.state.degree), valid = x >= 0 || k % 2 === 1, value = valid ? Math.sign(x) * Math.abs(x) ** (1 / k) : NaN, f = t => t ** k, g = a.graph('A hatványfüggvény és a keresett gyök', [-3, 3], [-20, 20]); g.curve(f); g.curve(() => x, RED); if (valid) dot(g.g, g.X(value), g.Y(x), GREEN);
    a.info(`${k}. gyök (${x}) = ${n(value)}`, [['Valós gyök', valid ? n(value) : 'Páros gyök negatív számból nincs.'], ['Visszaellenőrzés', valid ? `(${n(value)})^${k} ≈ ${x}` : 'Nincs valós gyökérték.']], 'Páros gyöknél a nemnegatív értéket választjuk; a páros hatvány görbéjének negatív metszéspontja nem gyökérték.'); };
};
renderers.fractionalPower = a => {
  a.select('base', 'Alap', [['4', '4'], ['8', '8'], ['16', '16'], ['27', '27']], '8'); a.range('p', 'Kitevő számlálója', 1, 4, 1, 2); a.select('q', 'Kitevő nevezője', [['2', '2'], ['3', '3'], ['4', '4']], '3');
  return () => { const b = Number(a.state.base), p = a.state.p, q = Number(a.state.q), root = b ** (1 / q), { s, w } = a.figure('Törtkitevő felbontása gyökvonásra és hatványozásra', 250);
    [[`${b}`, 45], [`${q}. gyök: ${n(root)}`, 120], [`${p}. hatvány: ${n(root ** p)}`, 195]].forEach(([t, y]) => label(s, w / 2, y, t)); line(s, w / 2, 60, w / 2, 95, PEN, 2); line(s, w / 2, 135, w / 2, 170, PEN, 2);
    a.info(`${b}^(${p}/${q}) = (⁽${q}⁾√${b})^${p}`, [['Gyökvonás után', n(root)], ['Hatványozás után', n(b ** (p / q))]], 'A nevező a gyökkitevő, a számláló a hatványkitevő. Itt pozitív alapokkal dolgozunk.'); };
};
renderers.completeSquare = a => {
  a.range('p', 'Fél együttható (p)', 1, 5, 1, 2); a.range('x', 'x a területmodellben', 2, 6, 1, 4); a.select('show', 'Kiegészítés', [['no', 'A hiányzó sarok'], ['yes', 'A sarok pótlása']], 'no');
  return () => { const { p, x, show } = a.state, { s, w } = a.figure('x² + 2px kiegészítése teljes négyzetté', 300), sc = Math.min((w - 45) / (x + p), 235 / (x + p)), xx = (w - (x + p) * sc) / 2;
    rect(s, xx, 25, x * sc, x * sc); rect(s, xx + x * sc, 25, p * sc, x * sc, GREEN); rect(s, xx, 25 + x * sc, x * sc, p * sc, GREEN); const corner = rect(s, xx + x * sc, 25 + x * sc, p * sc, p * sc, RED, show === 'yes' ? .2 : 0); if (show === 'no') corner.setAttribute('stroke-dasharray', '4 4');
    a.info(`x² + ${2 * p}x + ${p * p} = (x + ${p})²`, [['Pótolt terület', `p² = ${p * p}`], ['Eredeti kifejezés', `(x + ${p})² − ${p * p}`]], 'A négyzet két oldalán egy-egy px téglalap van; a hiányzó sarok területe p².'); };
};
renderers.quadratic = a => {
  a.range('a', 'a együttható', a.definition.parameter ? -2 : 1, 2, 1, 1); a.range('b', 'b együttható', -6, 6, 1, -2); a.range('c', 'c együttható', -4, 4, 1, -2);
  return () => { const { a: aa, b, c } = a.state, q = quadratic(aa, b, c), g = a.graph('A másodfokú vagy elfajuló egyenlet grafikonja', [-5, 5], [-10, 15]); g.curve(x => aa * x * x + b * x + c); q.roots.forEach(x => dot(g.g, g.X(x), g.Y(0), RED, 5));
    a.info(`${aa}x² + (${b})x + (${c}) = 0`, [['Diszkrimináns', q.d == null ? 'Nem másodfokú egyenlet.' : n(q.d)], ['Megoldások', q.all ? 'Minden valós szám.' : q.roots.length ? q.roots.map(x => n(x)).join('; ') : 'Nincs valós megoldás.'], ['Egyenlet foka', String(q.degree)]], 'A piros pontok az x tengellyel közös pontok. A látható ablakon kívüli gyök is szerepel a felsorolásban.'); };
};
renderers.viete = a => {
  a.range('r', 'Első gyök', -3, 3, .5, -1); a.range('t', 'Második gyök', -3, 3, .5, 2);
  return () => { const { r, t } = a.state, g = a.graph('Gyökökből felépülő parabola', [-5, 5], [-10, 15]); g.curve(x => (x - r) * (x - t)); [r, t].forEach(x => dot(g.g, g.X(x), g.Y(0), RED, 5));
    a.info(`(x − (${n(r)}))(x − (${n(t)}))`, [['Gyökök összege', `${n(r + t)} = −b`], ['Gyökök szorzata', `${n(r * t)} = c`], ['Kifejtve', `x² − (${n(r + t)})x + (${n(r * t)})`]], 'Itt a főegyüttható 1. Azonos gyököknél kettős gyököt kapsz.'); };
};
renderers.substitution = a => {
  a.range('r', 'Első t-gyök', -4, 4, 1, 1); a.range('s', 'Második t-gyök', -4, 4, 1, 4);
  return () => { const { r, s: t } = a.state, roots = [...new Set([r, t].filter(v => v >= 0).flatMap(v => v === 0 ? [0] : [-Math.sqrt(v), Math.sqrt(v)]))].sort((x, y) => x - y), { s, w } = a.figure('t = x²: a negatív t nem vezet valós x-hez', 270);
    [r, t].forEach((v, i) => { const y = 75 + 110 * i; label(s, 30, y, `t = ${v}`, 'start', v < 0 ? RED : PEN); line(s, w * .35, y - 5, w * .47, y - 5); label(s, w - 20, y, v < 0 ? 'Nincs valós x' : v === 0 ? 'x = 0' : `x = ±√${v}`, 'end'); });
    a.info(`x⁴ − (${r + t})x² + (${r * t}) = 0`, [['Helyettesítés', 't = x², ezért t ≥ 0'], ['Valós x-megoldások', roots.length ? roots.map(x => n(x)).join('; ') : 'Nincs.']], 'Egy pozitív t-gyökhöz két x tartozik; t = 0 esetén egy. Az ismétlődő megoldást egyszer számoljuk.'); };
};
renderers.systems = a => {
  a.range('m', 'Egyenes meredeksége', -3, 3, .5, 1); a.range('c', 'Egyenes tengelymetszete', -4, 4, .5, 2);
  return () => { const { m, c } = a.state, q = quadratic(1, -m, -c), g = a.graph('Parabola és egyenes metszéspontjai', [-4, 4], [-5, 12]); g.curve(x => x * x); g.curve(x => m * x + c, RED); q.roots.forEach(x => dot(g.g, g.X(x), g.Y(x * x), GREEN, 5));
    a.info(`y = x²; y = ${n(m)}x + (${n(c)})`, [['Kivonás után', `x² − (${n(m)})x − (${n(c)}) = 0`], ['Megoldáspárok', q.roots.length ? q.roots.map(x => `(${n(x)}; ${n(x * x)})`).join('; ') : 'Nincs közös pont.']], 'A teljes megoldás számpár: az x értékét vissza kell helyettesíteni y meghatározásához.'); };
};
renderers.inequality = a => {
  a.range('r', 'Első gyök', -3, 2, .5, -1); a.range('t', 'Második gyök', -2, 3, .5, 2); a.select('a', 'Nyílás', [['1', 'Felfelé'], ['-1', 'Lefelé']], '1'); a.select('rel', 'Reláció', [['lt', '< 0'], ['le', '≤ 0'], ['gt', '> 0'], ['ge', '≥ 0']], 'le');
  return () => { const { r, t, rel } = a.state, aa = Number(a.state.a), f = x => aa * (x - r) * (x - t), g = a.graph('Másodfokú egyenlőtlenség megoldása', [-5, 5], [-8, 12]), ok = y => rel === 'lt' ? y < 0 : rel === 'le' ? y <= 0 : rel === 'gt' ? y > 0 : y >= 0, closed = rel === 'le' || rel === 'ge'; g.curve(f);
    const points = [-5, ...new Set([r, t].sort((x, y) => x - y)), 5]; for (let i = 0; i < points.length - 1; i++) if (ok(f((points[i] + points[i + 1]) / 2))) line(g.g, g.X(points[i]), g.Y(0), g.X(points[i + 1]), g.Y(0), GREEN, 6);
    [...new Set([r, t])].forEach(x => node('circle', { cx: g.X(x), cy: g.Y(0), r: 5, fill: closed ? GREEN : 'var(--card)', stroke: GREEN, 'stroke-width': 2 }, g.g));
    a.info(`${aa}(x − (${n(r)}))(x − (${n(t)})) ${rel === 'lt' ? '<' : rel === 'le' ? '≤' : rel === 'gt' ? '>' : '≥'} 0`, [['Zöld szakasz', 'A megoldáshalmaz látható része.'], ['Végpontok', closed ? 'A gyökök is megoldások.' : 'A gyökök nem megoldások.']], 'Egybeeső gyököknél próbáld ki mind a négy relációt.'); };
};
renderers.radical = a => {
  a.select('step', 'Egyenlet alakja', [['original', 'Eredeti'], ['squared', 'Négyzetre emelve'], ['check', 'Ellenőrzés']], 'original');
  return () => { const squared = a.state.step === 'squared', g = a.graph('Gyökös egyenlet: valódi és hamis jelölt', [-2, 9], squared ? [-2, 40] : [-7, 6]); g.curve(x => squared ? x + 2 : Math.sqrt(x + 2)); g.curve(x => squared ? (x - 4) ** 2 : x - 4, RED); dot(g.g, g.X(7), g.Y(squared ? 9 : 3), GREEN, 5);
    if (squared) dot(g.g, g.X(2), g.Y(4), RED, 5);
    if (a.state.step === 'check') { dot(g.g, g.X(2), g.Y(2)); dot(g.g, g.X(2), g.Y(-2), RED); line(g.g, g.X(2), g.Y(-2), g.X(2), g.Y(2), MUTED, 1, '4 4'); }
    a.info(squared ? 'x + 2 = (x − 4)²' : '√(x + 2) = x − 4', [['Kék görbe', squared ? 'x + 2' : '√(x + 2)'], ['Piros görbe', squared ? '(x − 4)²' : 'x − 4'], ['Jelöltek négyzetre emelés után', '2; 7'], ['Eredeti egyenlet megoldása', a.state.step === 'check' ? 'Csak 7; x = 2-nél 2 ≠ −2.' : 'Ellenőrizd a jelölteket az eredetiben.']], 'Az eredeti jobb oldalnak nemnegatívnak kell lennie: x ≥ 4.'); };
};
renderers.rectangle = a => {
  a.range('sum', 'Fél kerület', 6, 20, 1, 10); a.range('ratio', 'Első oldal a fél kerület százalékában', 10, 90, 5, 20);
  return () => { const { sum, ratio } = a.state, x = sum * ratio / 100, y = sum - x, { s, w } = a.figure('Állandó kerületű téglalap és az azonos kerületű négyzet', 290), sc = Math.min((w - 50) / sum, 225 / sum), cx = w / 2, cy = 130;
    rect(s, cx - x * sc / 2, cy - y * sc / 2, x * sc, y * sc); const square = rect(s, cx - sum / 4 * sc, cy - sum / 4 * sc, sum / 2 * sc, sum / 2 * sc, RED, 0); square.setAttribute('stroke-dasharray', '5 4'); label(s, w / 2, 265, `${n(x)} × ${n(y)}`);
    a.info(`T = x(${sum} − x) = ${n(x * y)}`, [['Kerület', String(2 * sum)], ['Legnagyobb terület', n((sum / 2) ** 2)], ['Számtani közép', n(sum / 2)], ['Mértani közép', n(Math.sqrt(x * y))]], a.definition.problem ? `Példafeladat: ${2 * sum} egység kerítéssel milyen téglalap alakú területet keríthetünk körbe?` : 'A piros szaggatott négyzetnél maximális a terület; ekkor a két közép egyenlő.'); };
};
renderers.expEquation = a => {
  a.select('base', 'Alap', [['0.5', '1/2'], ['2', '2'], ['3', '3']], '2'); a.range('rhs', 'Jobb oldal', -1, 8, .5, 4);
  return () => { const b = Number(a.state.base), rhs = a.state.rhs, x = rhs > 0 ? Math.log(rhs) / Math.log(b) : NaN, g = a.graph('Exponenciális görbe és vízszintes egyenes', [-4, 4], [-2, 10]); g.curve(t => b ** t); g.curve(() => rhs, RED); if (rhs > 0) dot(g.g, g.X(x), g.Y(rhs), GREEN, 5);
    a.info(`${n(b)}^x = ${n(rhs)}`, [['Valós megoldás', rhs > 0 ? n(x) : 'Nincs: a hatvány értéke pozitív.'], ['Kék', `${n(b)}^x`], ['Piros', n(rhs)]], 'Válassz 1-nél kisebb alapot és nempozitív jobb oldalt is.'); };
};
renderers.logDefinition = a => {
  a.select('base', 'Alap', [['0.5', '1/2'], ['2', '2'], ['3', '3'], ['10', '10']], '2'); a.range('exponent', 'Kitevő', -3, 3, .5, 2);
  return () => { const b = Number(a.state.base), e = a.state.exponent, value = b ** e, { s, w } = a.figure('Hatványozás és logaritmus egymás fordított kérdése', 240);
    label(s, w / 2, 65, `${n(b)}^${n(e)} = ${n(value)}`, 'middle', PEN); line(s, 35, 110, w - 35, 110, MUTED); label(s, w / 2, 170, `log${n(b)} (${n(value)}) = ${n(e)}`, 'middle', RED);
    a.info('A logaritmus eredménye a kitevő.', [['Alap', n(b)], ['Argumentum', n(value)], ['Logaritmus', n(e)]], 'Az alap pozitív és nem 1, az argumentum pozitív. A negatív logaritmusérték is teljesen szabályos.'); };
};
renderers.logRules = a => {
  a.range('p', 'Első kitevő', -3, 3, 1, 2); a.range('q', 'Második kitevő', -3, 3, 1, 1); a.select('op', 'Azonosság', [['product', 'Szorzat logaritmusa'], ['quotient', 'Hányados logaritmusa']], 'product');
  return () => { const { p, q, op } = a.state, e = op === 'product' ? p + q : p - q, { s, w } = a.figure('Kitevőműveletek és logaritmusazonosságok', 250);
    [`u = 2^${p} = ${n(2 ** p)}`, `v = 2^${q} = ${n(2 ** q)}`, `u ${op === 'product' ? '·' : '/'} v = 2^${e}`].forEach((t, i) => label(s, w / 2, 45 + i * 75, t));
    a.info(op === 'product' ? 'log₂(uv) = log₂u + log₂v' : 'log₂(u/v) = log₂u − log₂v', [['Első logaritmus', p], ['Második logaritmus', q], ['Eredmény', e]], 'Az u és v argumentumok végig pozitívak.'); };
};
renderers.logEquation = a => {
  a.range('shift', 'Eltolás (k)', -3, 3, 1, 1); a.range('rhs', 'Jobb oldal', -2, 3, .5, 1);
  return () => { const { shift: k, rhs } = a.state, answer = k + 2 ** rhs, g = a.graph('Logaritmikus egyenlet és értelmezési tartomány', [k - 2, k + 10], [-5, 5]); g.curve(x => x > k ? Math.log2(x - k) : NaN, PEN, k + .01, k + 10); g.curve(() => rhs, RED); line(g.g, g.X(k), g.Y(-5), g.X(k), g.Y(5), MUTED, 1, '4 4'); dot(g.g, g.X(answer), g.Y(rhs), GREEN, 5);
    a.info(`log₂(x − (${k})) = ${n(rhs)}`, [['Értelmezési tartomány', `x > ${k}`], ['Megoldás', `x = ${k} + 2^${n(rhs)} = ${n(answer)}`], ['Argumentum ellenőrzése', n(answer - k) + ' > 0']], 'A szaggatott függőleges az értelmezési tartomány határa; nem része a tartománynak.'); };
};
renderers.solid = a => {
  a.range('x', 'Téglatest hossza', 2, 8, 1, 6); a.range('y', 'Téglatest szélessége', 2, 6, 1, 4); a.range('z', 'Téglatest magassága', 1, 8, 1, 5); a.select('flat', 'Nézet', [['solid', 'Segédháromszög a testben'], ['flat', 'Segédháromszög síkban']], 'solid');
  return () => { const { x, y, z, flat } = a.state, base = Math.hypot(x, y), d = Math.hypot(base, z), { s, w } = a.figure('Testátló, alaplapátló és magasság', 320), sc = Math.min((w - 60) / (x + y * .5), 200 / (z + y * .45)), P = (xx, yy, zz) => [30 + sc * (xx + yy * .5), 265 - sc * (zz + yy * .45)];
    if (flat === 'solid') {
      const vertices = [P(0, 0, 0), P(x, 0, 0), P(x, y, 0), P(0, y, 0), P(0, 0, z), P(x, 0, z), P(x, y, z), P(0, y, z)];
      [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => line(s, ...vertices[i], ...vertices[j], MUTED)); polygon(s, [vertices[0], vertices[2], vertices[6]], PEN, .15); line(s, ...vertices[0], ...vertices[6], RED, 3);
    } else { const k = Math.min((w - 65) / base, 220 / z), pts = [[30, 265], [30 + base * k, 265], [30 + base * k, 265 - z * k]]; polygon(s, pts); label(s, 30 + base * k / 2, 288, n(base)); label(s, w - 15, 150, z, 'end'); line(s, ...pts[0], ...pts[2], RED, 3); }
    a.info('d² = a² + b² + c²', [['Alaplapátló', n(base)], ['Testátló', n(d)], ['Alaplappal bezárt szög', n(Math.atan2(z, base) * 180 / Math.PI) + '°']], 'A testátló vetülete az alaplap átlója. E kettő és a magasság derékszögű háromszöget alkot.'); };
};
renderers.triangle = a => {
  a.range('side', 'a oldal (BC)', 2, 10, .5, 6); a.range('angle', 'α az A csúcsnál (°)', 20, 80, 5, 30);
  return () => { const side = a.state.side, alpha = a.state.angle, c = 8, roots = ssa(side, c, alpha), { s, w } = a.figure('A B középpontú kör metszéspontjai az AC félegyenessel', 320), sc = Math.min((w - 40) / (c + side + 3), 250 / (2 * side + 2)), X = x => 20 + (x + Math.max(0, side - c)) * sc, Y = y => 160 - y * sc;
    node('circle', { cx: X(c), cy: Y(0), r: side * sc, fill: 'none', stroke: MUTED, 'stroke-dasharray': '4 4' }, s); const L = c + side; line(s, X(0), Y(0), X(L * Math.cos(rad(alpha))), Y(L * Math.sin(rad(alpha))), GRID);
    roots.forEach((v, i) => { const pt = [X(v * Math.cos(rad(alpha))), Y(v * Math.sin(rad(alpha)))]; polygon(s, [[X(0), Y(0)], [X(c), Y(0)], pt], i ? RED : PEN); label(s, pt[0], pt[1] - 8, `C${i + 1}`); }); label(s, X(0), Y(0) + 22, 'A'); label(s, X(c), Y(0) + 22, 'B');
    a.info(`${roots.length} lehetséges háromszög`, [['AB = c', '8'], ['BC = a', n(side)], ['α', `${alpha}°`], ['AC oldal(ak)', roots.length ? roots.map(x => n(x)).join('; ') : 'Nincs.']], 'A félegyenes a rögzített α szöget, a kör a rögzített a oldalt fejezi ki. Csak a pozitív hosszúságú, nem elfajuló háromszögeket számoljuk.'); };
};
renderers.survey = a => {
  a.range('base', 'Parti alapszakasz (m)', 50, 300, 10, 100); a.range('alpha', 'Első irányszög (°)', 20, 70, 5, 40); a.range('beta', 'Második irányszög (°)', 20, 70, 5, 55);
  return () => { const { base, alpha, beta } = a.state, height = base / (1 / Math.tan(rad(alpha)) + 1 / Math.tan(rad(beta))), x = height / Math.tan(rad(alpha)), ac = height / Math.sin(rad(alpha)), bc = height / Math.sin(rad(beta)), { s, w } = a.figure('Két parti pontból meghatározott vízi célpont', 300), sc = Math.min((w - 55) / base, 210 / height), X = t => 25 + sc * t, Y = t => 250 - sc * t;
    polygon(s, [[X(0), Y(0)], [X(base), Y(0)], [X(x), Y(height)]]); line(s, X(x), Y(0), X(x), Y(height), RED, 1.5, '4 4'); dot(s, X(x), Y(height), RED, 5); label(s, X(0), 275, 'A'); label(s, X(base), 275, 'B'); label(s, X(x), Y(height) - 10, 'Célpont');
    a.info(`γ = ${180 - alpha - beta}°`, [['A–célpont', n(ac, 1) + ' m'], ['B–célpont', n(bc, 1) + ' m'], ['Távolság a part egyenesétől', n(height, 1) + ' m']], 'Szemléltető síkbeli modell: az A és B pontból a part felőli belső szögeket mérjük.'); };
};
renderers.vectors = a => {
  a.range('x', 'a vektor x koordinátája', -4, 4, 1, 3); a.range('y', 'a vektor y koordinátája', -4, 4, 1, 1); a.range('u', 'b vektor x koordinátája', -4, 4, 1, -1); a.range('v', 'b vektor y koordinátája', -4, 4, 1, 2);
  return () => { const { x, y, u, v } = a.state, g = a.graph('Vektorösszeg és paralelogramma', [-9, 9], [-9, 9]); arrow(g.g, g.X(0), g.Y(0), g.X(x), g.Y(y), PEN); arrow(g.g, g.X(x), g.Y(y), g.X(x + u), g.Y(y + v), RED); line(g.g, g.X(0), g.Y(0), g.X(u), g.Y(v), RED, 1.5, '4 4'); line(g.g, g.X(u), g.Y(v), g.X(x + u), g.Y(y + v), PEN, 1.5, '4 4'); arrow(g.g, g.X(0), g.Y(0), g.X(x + u), g.Y(y + v), GREEN); dot(g.g, g.X(x + u), g.Y(y + v), GREEN, 5);
    a.info(`a + b = (${x + u}; ${y + v})`, [['Kék: a', `(${x}; ${y})`], ['Piros: b', `(${u}; ${v})`], ['Zöld: eredő', `(${x + u}; ${y + v})`]], 'A piros vektort eltoljuk a kék végpontjához; az iránya és hossza nem változik.'); };
};
renderers.dot = a => {
  a.range('angle', 'Vektorok szöge (°)', 0, 180, 5, 60); a.range('length', 'b vektor hossza', 1, 5, .5, 3);
  return () => { const { angle, length } = a.state, px = length * Math.cos(rad(angle)), py = length * Math.sin(rad(angle)), { s, w } = a.figure('A vektor vetülete előjeles', 300), sc = Math.min((w - 55) / 11, 34), X = x => w / 2 + x * sc, Y = y => 240 - y * sc;
    line(s, X(-5), Y(0), X(5), Y(0), GRID); arrow(s, X(0), Y(0), X(4), Y(0), PEN); arrow(s, X(0), Y(0), X(px), Y(py), RED); line(s, X(px), Y(py), X(px), Y(0), MUTED, 1, '4 4'); line(s, X(0), Y(0) + 9, X(px), Y(0) + 9, GREEN, 4); dot(s, X(px), Y(0) + 9, GREEN); label(s, X(4), Y(0) + 30, '|a| = 4');
    a.info(`a · b = 4 · ${n(length)} · cos ${angle}°`, [['Előjeles vetület', n(px)], ['Skaláris szorzat', n(4 * px)], ['Szög típusa', angle === 90 ? 'Derékszög: a szorzat nulla.' : angle < 90 ? 'Hegyesszög: pozitív szorzat.' : 'Tompaszög: negatív szorzat.']], 'A zöld szakasz a b vektor előjeles vetületét jelzi az a irányára.'); };
};
renderers.angleAddition = a => {
  a.range('alpha', 'α (°)', 0, 180, 15, 30); a.range('beta', 'β (°)', 0, 180, 15, 45);
  return () => { const { alpha, beta } = a.state, sum = alpha + beta, { s, w } = a.figure('Két egymást követő forgatás az egységkörön', 310), radius = Math.min((w - 70) / 2, 115), cx = w / 2, cy = 150, X = t => cx + radius * Math.cos(rad(t)), Y = t => cy - radius * Math.sin(rad(t));
    node('circle', { cx, cy, r: radius, fill: 'none', stroke: MUTED }, s); line(s, cx - radius - 10, cy, cx + radius + 10, cy, GRID); line(s, cx, cy - radius - 10, cx, cy + radius + 10, GRID); line(s, cx, cy, X(alpha), Y(alpha), PEN, 2); line(s, cx, cy, X(sum), Y(sum), RED, 3); line(s, X(sum), Y(sum), X(sum), cy, GREEN, 1.5, '4 4'); dot(s, X(sum), Y(sum), RED, 5);
    a.info(`α + β = ${sum}°`, [['cos(α + β)', n(Math.cos(rad(sum)))], ['cosα·cosβ − sinα·sinβ', n(Math.cos(rad(alpha)) * Math.cos(rad(beta)) - Math.sin(rad(alpha)) * Math.sin(rad(beta)))], ['sin(α + β)', n(Math.sin(rad(sum)))], ['sinα·cosβ + cosα·sinβ', n(Math.sin(rad(alpha)) * Math.cos(rad(beta)) + Math.cos(rad(alpha)) * Math.sin(rad(beta)))]], 'Kék sugár: az első forgatás után. Piros sugár: a két forgatás után. A táblázatban az összegképletek két oldala összehasonlítható.'); };
};

function kiegeszit(def, hely) {
  if (def.grafikon) return def;
  const description = descriptions[hely]; if (!description) return def;
  def.grafikon = box => mount(box, description);
  def.grafikonCim = description.title;
  def.grafikonTag = 'kísérletezz';
  return def;
}
window.Szemleltetesek = { kiegeszit, leirasok: descriptions, matematika: math };
})();
