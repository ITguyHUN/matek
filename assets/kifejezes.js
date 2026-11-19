/*
 * Matek gyakorló – kifejezés-ellenőrző.
 * A diák által beírt képletet (LaTeX a képletmezőből, vagy begépelt alak: (x+3)^2, sqrt(2), sin(2x), ]1;5[, x<=3)
 * összeveti a feladat helyes válaszával: valasz: { kifejezes: '(x+3)^2', alak: 'szorzat' }.
 *
 * NEM szimbolikusan dolgozik, hanem behelyettesítéssel:
 *  - kifejezés: sok véletlen pontban ugyanannyi-e a kettő;
 *  - reláció, intervallum, halmaz, periodikus megoldás: ugyanazok a számok tartoznak-e bele.
 * Így nem kell számítógépes algebra, és a hibához ellenpéldát is tud mutatni.
 * Leírás a feladatíróknak: tananyag/README.md („Kifejezés mint válasz”). Tesztek: test/kifejezes.test.cjs
 */
(function (root) {
const REL = { '<': '<', '>': '>', '=': '=', '\\lt': '<', '\\gt': '>', '\\le': '≤', '\\leq': '≤', '\\leqslant': '≤', '≤': '≤',
  '\\ge': '≥', '\\geq': '≥', '\\geqslant': '≥', '≥': '≥', '\\ne': '≠', '\\neq': '≠', '≠': '≠' };
const SZOR = ['*', '\\cdot', '\\times', '·', '×'], OSZT = ['/', ':', '\\div', '÷'];
const FV = { '\\sin': 'sin', '\\cos': 'cos', '\\tg': 'tg', '\\ctg': 'ctg', '\\lg': 'lg', '\\ln': 'ln', '\\log': 'log' };
const ALIAS = { '\\lbrack': '[', '\\rbrack': ']', '\\tan': '\\tg', '\\cot': '\\ctg', '\\cotg': '\\ctg', '\\degree': '°', '∞': '\\infty', '∈': '\\in', '∪': '\\cup', '∩': '\\cap',
  '∖': '\\setminus', '\\backslash': '\\setminus', '∅': '\\emptyset', '\\varnothing': '\\emptyset', '\\vee': '\\lor', '\\wedge': '\\land', 'π': '\\pi', '±': '\\pm',
  'ℝ': '\\szhR', 'ℤ': '\\szhZ', 'ℕ': '\\szhN', 'ℚ': '\\szhQ' };
const SZH = { '\\szhR': 'R', '\\szhZ': 'Z', '\\szhN': 'N', '\\szhQ': 'Q' };
const PARAM = ['k', 'n', 'm', 'l'];   // egész paraméter betűi a periodikus megoldásokban: x = π/6 + 2kπ

const GEPELT = ['ctg', 'sin', 'cos', 'tg', 'tan', 'cot', 'log', 'lg', 'ln', 'sqrt', 'pi'];

function tokenek(src) {
  const s = String(src).replace(/\{,\}/g, '.').replace(/[−–]/g, '-')
    .replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠')          // billentyűzetről gépelt alak
    .replace(/\\(text|textrm|mathrm|operatorname)\{\s*vagy\s*\}|vagy/g, ' \\lor ').replace(/\\(text|textrm|mathrm|operatorname)\{\s*és\s*\}|és/g, ' \\land ')
    .replace(/\\operatorname\{(\w+)\}/g, ' \\$1 ')
    .replace(/\\exponentialE/g, ' e ').replace(/\\imaginaryI/g, ' i ').replace(/\\differentialD/g, ' d ')
    .replace(/\\mathbb\s*\{\s*([RZNQ])\s*\}|\\([RZNQ])(?![a-zA-Z])/g, (m, a, b) => ` \\szh${a || b} `)
    .replace(/(?<![a-zA-Z\\])([a-zA-Z])_\{?\d\}?/g, '$1')                 // x_1, x_2: az index nem számít
    .replace(/\\left\s*(\\[lr]?vert|\|)/g, ' \\absL ').replace(/\\right\s*(\\[lr]?vert|\|)/g, ' \\absR ')
    .replace(/\\(left|right|mleft|mright|displaystyle)(?![a-zA-Z])/g, '')
    .replace(/\\\{/g, ' \\lbrace ').replace(/\\\}/g, ' \\rbrace ')
    .replace(/\\[,;:! ]/g, ' ');
  // a betűvel begépelt függvénynév (sin, log, sqrt, pi) is egy jel, nem betűk szorzata
  const t = (s.match(/\\[a-zA-Z]+|\d+(?:[.,]\d+)?|ctg|sin|cos|tg|tan|cot|log|lg|ln|sqrt|pi|[a-zA-Z]|\S/g) || []).map(x => ALIAS[x] || (GEPELT.includes(x) ? ALIAS['\\' + x] || '\\' + x : x));
  // a „k ∈ ℤ” kiegészítés (vesszővel, zárójelben is) csak a paramétert nevezi meg, a halmazon nem változtat
  for (let j = 0; j < t.length - 2; j++) if (PARAM.includes(t[j]) && t[j + 1] === '\\in' && t[j + 2] === '\\szhZ') {
    let a = j, b = j + 3;
    if (t[a - 1] === '(' && t[b] === ')') { a--; b++; }
    if ([',', ';'].includes(t[a - 1])) a--;
    t.splice(a, b - a); j = a - 1;
  }
  return t;
}

/* LaTeX → fa. Kifejezés: num, var, neg, add, sub, mul, div, pow, gyok, abs, fn.
 * Állítás (számhalmazt ír le): rel, vagy, es, iv (intervallum), veges ({…}), unio, metszet, kiv.
 * Hibánál magyar üzenetű Error. */
function ertelmez(src) {
  const t = tokenek(src); let i = 0, abs = 0;
  const hiba = m => { throw new Error(m); };
  const betu = x => /^[a-zA-Z]$/.test(x), szam = x => /^\d/.test(x);
  const kezdArg = x => x !== undefined && (szam(x) || betu(x) || ['(', '{', '\\frac', '\\sqrt', '\\pi', '\\infty', '\\absL'].includes(x) || (x === '|' && !abs));
  const kezd = x => kezdArg(x) || !!FV[x];
  const kell = x => { if (t[i++] !== x) hiba(x === ')' ? 'hiányzik egy bezáró zárójel' : 'valami hiányzik a kifejezésből'); };
  const fok = a => ({ k: 'mul', a, b: { k: 'num', v: Math.PI / 180 } });
  // LaTeX-argumentum: {…} vagy egyetlen jel (ezért \log_23 = 2-es alapú logaritmus 3, nem 23-as alap)
  const arg = () => {
    if (t[i] === '{') { i++; const e = osszeg(); kell('}'); return e; }
    if (szam(t[i]) && t[i].length > 1) { const c = t[i][0]; t[i] = t[i].slice(1); return { k: 'num', v: +c }; }
    return elemi();
  };
  function elemi() {
    const x = t[i++];
    if (x === undefined) hiba('a kifejezés vége hiányzik');
    if (szam(x)) return { k: 'num', v: +x.replace(',', '.') };
    if (x === 'e') return { k: 'num', v: Math.E };
    if (betu(x)) return { k: 'var', n: x };
    if (x === '\\pi') return { k: 'num', v: Math.PI };
    if (x === '\\infty') return { k: 'num', v: Infinity };
    if (x === '(') { const e = osszeg(); kell(')'); return e; }
    if (x === '{') { const e = osszeg(); kell('}'); return e; }
    if (x === '\\frac') { const a = arg(), b = arg(); return { k: 'div', a, b }; }
    if (x === '\\sqrt') { let n = null; if (t[i] === '[') { i++; n = osszeg(); kell(']'); } return { k: 'gyok', a: arg(), n }; }
    if (x === '\\absL') { const e = osszeg(); kell('\\absR'); return { k: 'abs', a: e }; }
    if (x === '|') { abs++; const e = osszeg(); kell('|'); abs--; return { k: 'abs', a: e }; }
    if (FV[x]) {
      let alap = null, kit = null;                       // \log_a, \sin^2
      for (let j = 0; j < 2; j++) { if (t[i] === '_') { i++; alap = arg(); } else if (t[i] === '^') { i++; kit = arg(); } }
      let a;
      if (t[i] === '(') a = elemi();                     // sin(…): csak a zárójel az argumentum
      else if (t[i] === '-') { i++; a = { k: 'neg', a: hatvany() }; }
      else if (kezdArg(t[i])) { a = hatvany(); while (kezdArg(t[i])) a = { k: 'mul', a, b: hatvany() }; }   // sin 2x = sin(2x)
      else hiba(`a ${FV[x]} után hiányzik, minek a ${FV[x]}-át kéred`);
      const f = { k: 'fn', f: FV[x], a, alap };
      return kit ? { k: 'pow', a: f, b: kit } : f;
    }
    if (x === '\\placeholder') hiba('maradt egy üres hely');
    hiba(x === ')' ? 'eggyel több a bezáró zárójel' : `ezt a jelet itt nem értem: ${x.replace(/^\\/, '')}`);
  }
  function hatvany() {
    let b = elemi();
    for (;;) {
      if (t[i] === '°') { i++; b = fok(b); }
      else if (t[i] === '^' && t[i + 1] === '\\circ') { i += 2; b = fok(b); }
      else if (t[i] === '^' && t[i + 1] === '{' && t[i + 2] === '\\circ' && t[i + 3] === '}') { i += 4; b = fok(b); }
      else if (t[i] === '^') { i++; b = { k: 'pow', a: b, b: t[i] === '-' ? elojel() : arg() }; }
      else return b;
    }
  }
  function elojel() {
    if (t[i] === '-') { i++; return { k: 'neg', a: elojel() }; }
    if (t[i] === '+') { i++; return elojel(); }
    if (t[i] === '\\pm') { i++; return { k: 'pm', a: elojel() }; }      // ±: a relációt két ágra bontjuk (lásd allitas)
    return hatvany();
  }
  function szorzat() {
    let a = elojel();
    for (;;) {
      const x = t[i];
      if (SZOR.includes(x)) { i++; a = { k: 'mul', a, b: elojel() }; }
      else if (OSZT.includes(x)) { i++; a = { k: 'div', a, b: elojel() }; }
      else if (kezd(x)) a = { k: 'mul', a, b: hatvany() };      // kimaradt szorzásjel: 2x, 3(x+1), 5√2, 2 sin x
      else return a;
    }
  }
  function osszeg() {
    let a = szorzat();
    for (;;) {
      if (t[i] === '+') { i++; a = { k: 'add', a, b: szorzat() }; }
      else if (t[i] === '-') { i++; a = { k: 'sub', a, b: szorzat() }; }
      else if (t[i] === '\\pm') { i++; a = { k: 'add', a, b: { k: 'pm', a: szorzat() } }; }
      else return a;
    }
  }
  /* Halmazok. Intervallum magyar jelöléssel: ]a;b[ nyílt, [a;b] zárt; a két vég között pontosvessző. */
  function halmazElem() {
    const x = t[i++];
    if (x === '\\emptyset') return { k: 'veges', elemek: [] };
    if (SZH[x]) {                                          // ℝ, ℤ, ℕ, ℚ, felső indexben + vagy −: ℝ⁺, ℤ⁻
      let elojel = 0; const kapcsos = t[i + 1] === '{', z = t[i] === '^' ? t[i + (kapcsos ? 2 : 1)] : '';
      if (z === '+' || z === '-') { elojel = z === '+' ? 1 : -1; i += kapcsos ? 4 : 2; }
      return { k: 'szh', h: SZH[x], elojel };
    }
    if (x === '\\lbrace') {
      const elemek = [];
      if (t[i] !== '\\rbrace') { elemek.push(osszeg()); while (t[i] === ';') { i++; elemek.push(osszeg()); } }
      if (t[i++] !== '\\rbrace') hiba('hiányzik a halmaz bezáró kapcsos zárójele');
      return { k: 'veges', elemek };
    }
    if (x === '[' || x === ']') {
      const a = osszeg(); if (t[i++] !== ';') hiba('az intervallum két vége közé pontosvessző kell');
      const b = osszeg(), z = t[i++]; if (z !== ']' && z !== '[') hiba('hiányzik az intervallum bezáró szögletes zárójele');
      return { k: 'iv', a, b, nyA: x === ']', nyB: z === '[' };
    }
    hiba('itt halmazt vagy intervallumot várok');
  }
  function halmaz() {
    const M = { '\\cup': 'unio', '\\cap': 'metszet', '\\setminus': 'kiv' };
    let a = halmazElem(); while (M[t[i]]) { const k = M[t[i++]]; a = { k, a, b: halmazElem() }; } return a;
  }
  function allitas() {
    if (betu(t[i]) && t[i + 1] === '\\in') { i += 2; return halmaz(); }                    // „x ∈ …”
    if (['[', ']', '\\lbrace', '\\emptyset'].includes(t[i]) || SZH[t[i]]) return halmaz();
    const fa = osszeg();
    if (!REL[t[i]]) return fa;
    const tagok = [fa], jelek = []; while (REL[t[i]]) { jelek.push(REL[t[i++]]); tagok.push(osszeg()); }
    const r = { k: 'rel', tagok, jelek };
    return vanBenne(r, c => c.k === 'pm') ? { k: 'vagy', a: pmCsere(r, 1), b: pmCsere(r, -1) } : r;   // x = ±a  →  x = a vagy x = −a
  }
  let fa = allitas();
  const L = { '\\lor': 'vagy', '\\land': 'es', ';': 'vagy', ',': 'vagy' };   // „x = 1; x = 2” felsorolás is vagy
  while (L[t[i]]) { const k = L[t[i++]], b = allitas(); if (!predE(fa) || !predE(b)) hiba('a pontosvessző, a „vagy” és az „és” két oldalán reláció vagy halmaz álljon'); fa = { k, a: fa, b }; }
  if (i < t.length) hiba(t[i] === ')' ? 'eggyel több a bezáró zárójel' : `ezt a jelet itt nem értem: ${t[i].replace(/^\\/, '')}`);
  return fa;
}
const predE = n => ['rel', 'vagy', 'es', 'iv', 'veges', 'szh', 'unio', 'metszet', 'kiv'].includes(n.k);
const pmCsere = (n, s) => !n || typeof n !== 'object' ? n : Array.isArray(n) ? n.map(c => pmCsere(c, s))
  : n.k === 'pm' ? (s > 0 ? pmCsere(n.a, s) : { k: 'neg', a: pmCsere(n.a, s) }) : Object.fromEntries(Object.entries(n).map(([k, c]) => [k, pmCsere(c, s)]));

function ertek(n, env) {
  switch (n.k) {
    case 'num': return n.v;
    case 'var': return env[n.n];
    case 'neg': return -ertek(n.a, env);
    case 'add': return ertek(n.a, env) + ertek(n.b, env);
    case 'sub': return ertek(n.a, env) - ertek(n.b, env);
    case 'mul': return ertek(n.a, env) * ertek(n.b, env);
    case 'div': return ertek(n.a, env) / ertek(n.b, env);
    case 'pow': return Math.pow(ertek(n.a, env), ertek(n.b, env));
    case 'abs': return Math.abs(ertek(n.a, env));
    case 'gyok': { const a = ertek(n.a, env), k = n.n ? ertek(n.n, env) : 2; return a < 0 && k % 2 === 1 ? -Math.pow(-a, 1 / k) : Math.pow(a, 1 / k); }
    case 'fn': { const a = ertek(n.a, env);
      switch (n.f) {
        case 'sin': return Math.sin(a); case 'cos': return Math.cos(a); case 'tg': return Math.tan(a); case 'ctg': return 1 / Math.tan(a);
        case 'ln': return Math.log(a); case 'lg': return Math.log10(a);
        case 'log': return n.alap ? Math.log(a) / Math.log(ertek(n.alap, env)) : Math.log10(a);
      } }
  }
  return NaN;
}
const gyerekek = n => [n.a, n.b, n.n, n.alap, ...(n.tagok || []), ...(n.elemek || [])].filter(c => c && typeof c === 'object');
function bejar(n, f) { f(n); gyerekek(n).forEach(c => bejar(c, f)); }
function valtozok(n) { const s = new Set(); bejar(n, c => { if (c.k === 'var') s.add(c.n); }); return [...s]; }

const kozel = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));
const hu = x => (Math.round(x * 1000) / 1000).toLocaleString('hu-HU');
function igazE(r, env) {
  const v = r.tagok.map(x => ertek(x, env));
  if (v.some(x => !isFinite(x))) return false;
  return r.jelek.every((j, k) => { const a = v[k], b = v[k + 1], e = kozel(a, b);
    return j === '<' ? a < b && !e : j === '>' ? a > b && !e : j === '≤' ? a < b || e : j === '≥' ? a > b || e : j === '=' ? e : !e; });
}

/* --- Kifejezések: null, ha a két fa egyenlő; különben a diáknak szóló magyarázat (ellenpéldával). --- */
function kulonbseg(A, B, vars) {
  const tart = [[-4, 4], [0.1, 10], [1, 100]];      // több tartomány, hogy a gyök és a logaritmus értelmezési tartományába is essen pont
  let jo = 0;
  for (let k = 0; k < 90 && jo < 8; k++) {
    const [lo, hi] = tart[k % 3], env = Object.fromEntries(vars.map(v => [v, Math.round((lo + Math.random() * (hi - lo)) * 1000) / 1000]));
    const b = ertek(B, env); if (!isFinite(b)) continue;
    const a = ertek(A, env); if (!isFinite(a) || !kozel(a, b)) return ellenpelda(A, B, vars);
    jo++;
  }
  return jo ? null : 'Ezt nem tudtam összehasonlítani a helyes válasszal.';
}
function ellenpelda(A, B, vars) {
  if (!vars.length) { const a = ertek(A, {}), b = ertek(B, {});
    return hu(a) === hu(b) ? 'Majdnem: kerekített értéket írtál. A pontos értéket add meg (törttel, gyökkel).' : `A te válaszod értéke ${hu(a)}, a helyesé ${hu(b)}.`; }
  for (const x of [2, 3, 1, -1, 0, 4, -2, 5]) {
    const env = Object.fromEntries(vars.map((v, j) => [v, x + j])), a = ertek(A, env), b = ertek(B, env);
    if (isFinite(a) && isFinite(b) && !kozel(a, b)) return `Például ${vars.map(v => `${v} = ${hu(env[v])}`).join(', ')} esetén a tiéd ${hu(a)}, a helyes ${hu(b)}.`;
  }
  return 'Nem minden értékre egyezik a helyes válasszal.';
}

/* --- Állítások (reláció, intervallum, halmaz): benne van-e x a leírt számhalmazban. --- */
/* Egész paraméter (k, n, m, l) az állításban: x = π/6 + 2kπ. shortcut: állításonként egy paraméterrel számol, kettő kell → bővíteni */
function parOf(n, v) { if (n._p === undefined) n._p = valtozok(n).find(p => p !== v && PARAM.includes(p)) || null; return n._p; }
/* Van-e olyan egész k, amelyre telj(k) igaz. Jelöltek: az fk függvények (k-ban lineárisak) zérushelye körüli egészek;
 * ha valamelyik nem lineáris (pl. (−1)^k·π/6 + kπ), végigpróbálja −200…200-ig. */
function vanEgesz(fk, telj) {
  const jel = new Set([0]); let linearis = true;
  for (const f of fk) {
    const f0 = f(0), s = f(1) - f0;
    if (!kozel(f(2) - f(1), s)) linearis = false;
    else if (Math.abs(s) > 1e-12) { const r = -f0 / s; for (const d of [-1, 0, 1]) { jel.add(Math.floor(r) + d); jel.add(Math.ceil(r) + d); } }
  }
  if (!linearis) for (let k = -200; k <= 200; k++) jel.add(k);
  return [...jel].some(telj);
}
/* Racionális-e: lebegőpontos számról nem dönthető el, ezért „kis nevezőjű tört-e”. A mintapontok között szándékosan vannak irracionálisak (IRR). */
function racE(x) { for (let d = 1; d <= 360; d++) if (Math.abs(x * d - Math.round(x * d)) < 1e-9) return true; return false; }
function benne(n, x, v) {
  switch (n.k) {
    case 'rel': { const p = parOf(n, v); if (!p) return igazE(n, { [v]: x });
      const env = k => ({ [v]: x, [p]: k });
      return vanEgesz(n.jelek.map((_, j) => k => ertek(n.tagok[j], env(k)) - ertek(n.tagok[j + 1], env(k))), k => igazE(n, env(k))); }
    case 'vagy': case 'unio': return benne(n.a, x, v) || benne(n.b, x, v);
    case 'es': case 'metszet': return benne(n.a, x, v) && benne(n.b, x, v);
    case 'kiv': return benne(n.a, x, v) && !benne(n.b, x, v);
    case 'veges': return n.elemek.some(e => { const p = parOf(e, v);
      return p ? vanEgesz([k => ertek(e, { [p]: k }) - x], k => kozel(ertek(e, { [p]: k }), x)) : kozel(ertek(e, {}), x); });
    case 'iv': { const p = parOf(n, v), A = k => ertek(n.a, { [p]: k }), B = k => ertek(n.b, { [p]: k });
      const ben = k => { const a = A(k), b = B(k); return (n.nyA ? x > a && !kozel(x, a) : x > a || kozel(x, a)) && (n.nyB ? x < b && !kozel(x, b) : x < b || kozel(x, b)); };
      return p ? vanEgesz([k => A(k) - x, k => B(k) - x], ben) : ben(0); }
    case 'szh': { const egesz = kozel(x, Math.round(x));   // ℝ, ℤ, ℕ (0-val), ℚ; elojel: ℝ⁺, ℤ⁻ …
      return (n.h === 'R' || (n.h === 'Z' && egesz) || (n.h === 'N' && egesz && x > -0.5) || (n.h === 'Q' && racE(x))) && (!n.elojel || (n.elojel > 0 ? x > 0 : x < 0) && !kozel(x, 0)); }
  }
  return false;
}
/* Mintavételi rács a gyökkereséshez: ±30-ig negyedenként, ±300-ig egészenként, onnan ±1 000 000-ig 1,25-szörös lépésekkel. */
const XS = (() => { const p = []; for (let k = 1; k <= 120; k++) p.push(k / 4); for (let x = 31; x <= 300; x++) p.push(x); for (let x = 375; x < 1e6; x *= 1.25) p.push(Math.round(x)); return [...p.map(x => -x).reverse(), 0, ...p]; })();
/* A bal(x) = jobb(x) egyenlet gyökei a rácson: előjelváltásnál felezéssel, érintésnél (páros multiplicitás, nincs előjelváltás) |bal − jobb| minimumát keresve.
 * shortcut: két szomszédos rácspont közé eső gyökpárt, illetve ±30-on kívüli érintő gyököt nem biztos, hogy megtalál */
function gyokok(bal, jobb, hatar, ki) {
  const f = x => bal(x) - jobb(x), nulla = x => kozel(bal(x), jobb(x));
  const H = 1e-4, lejt = x => Math.abs(f(x + H)) - Math.abs(f(x - H));   // |f| meredekségének előjele: a minimumhely felezéssel pontosan megvan
  let x0, f0, x1, f1;
  for (const x of XS) {
    if (Math.abs(x) > hatar) continue;
    const fx = f(x);
    if (nulla(x)) ki.push(x);
    else if (isFinite(f1) && isFinite(fx)) {
      if (f1 * fx < 0) { let lo = x1, hi = x; for (let s = 0; s < 60; s++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } ki.push((lo + hi) / 2); }
      else if (isFinite(f0) && f0 * f1 > 0 && Math.abs(f1) < Math.abs(f0) && Math.abs(f1) <= Math.abs(fx)) {
        let a = x0, b = x; for (let s = 0; s < 60; s++) { const m = (a + b) / 2; if (lejt(m) > 0) b = m; else a = m; }
        if (nulla((a + b) / 2)) ki.push((a + b) / 2);
      }
    }
    x0 = x1; f0 = f1; x1 = x; f1 = fx;
  }
}
/* Ahol a halmaz „váltani” tud: intervallumvégek, felsorolt elemek, a relációk két oldalának metszéspontjai.
 * Paraméteres (periodikus) állításnál k = −40…40, a ±60-on belüli pontok. */
function kritikus(n, v, ki = []) {
  const be = (p, f) => { if (!p) ki.push(f(0)); else for (let k = -40; k <= 40; k++) { const y = f(k); if (Math.abs(y) <= 60) ki.push(y); } };
  if (n.k === 'iv') { const p = parOf(n, v); be(p, k => ertek(n.a, { [p]: k })); be(p, k => ertek(n.b, { [p]: k })); }
  else if (n.k === 'veges') n.elemek.forEach(e => { const p = parOf(e, v); be(p, k => ertek(e, { [p]: k })); });
  else if (n.k === 'szh') { if (n.elojel) ki.push(0); }
  else if (n.k === 'rel') { const p = parOf(n, v);
    for (let k = p ? -40 : 0; k <= (p ? 40 : 0); k++) n.jelek.forEach((_, j) =>
      gyokok(x => ertek(n.tagok[j], { [v]: x, [p]: k }), x => ertek(n.tagok[j + 1], { [v]: x, [p]: k }), p ? 60 : Infinity, ki)); }
  else gyerekek(n).forEach(c => kritikus(c, v, ki));
  return ki.filter(isFinite);
}
/* π többszöröse olvashatóan: 7π/6 */
function szep(x) {
  for (const d of [1, 2, 3, 4, 6]) { const m = Math.round(x * d / Math.PI);
    if (m && kozel(x * d / Math.PI, m)) return `${m === 1 ? '' : m === -1 ? '−' : String(m).replace('-', '−')}π${d > 1 ? '/' + d : ''}`; }
  return '';
}
const EPS = 1e-2, IRR = Array.from({ length: 11 }, (_, j) => j - 5 + Math.SQRT2 / 10);
function halmazKulonbseg(A, B, v) {
  const egesz = [], negyed = [];
  for (let k = 0; k <= 120; k++) for (const s of k ? [1, -1] : [1]) (k % 4 ? negyed : egesz).push(s * k / 4);
  const kr = [...kritikus(A, v), ...kritikus(B, v)].sort((p, q) => Math.abs(p) - Math.abs(q));
  // elöl az egészek és a nullához közeli pontok: szebb ellenpélda; a kritikus pontok mellett ±EPS is (nyílt/zárt vég, érintő gyök)
  for (const x of [...egesz, ...negyed, ...kr, ...kr.flatMap(p => [p - EPS, p + EPS]), ...IRR, ...XS.filter(p => Math.abs(p) > 30)]) {
    const a = benne(A, x, v), b = benne(B, x, v);
    if (a !== b) {
      const sz = szep(x), hol = IRR.includes(x) ? `egy irracionális szám (${v} ≈ ${hu(x)})` : `${v} ${sz || Number.isInteger(x * 4) ? '=' : '≈'} ${sz || hu(x)}`;
      return `Például ${hol} ${b ? 'megoldás, de a te válaszodból kimarad' : 'a te válaszod szerint megoldás, pedig nem az'}.`;
    }
  }
  return null;
}

/* --- A kért alak ellenőrzése (az érték már jó). Üzenet, ha még nem a kért alakban van. --- */
const osszegE = n => n.k === 'add' || n.k === 'sub';
const tenyezok = n => n.k === 'mul' ? [...tenyezok(n.a), ...tenyezok(n.b)] : n.k === 'pow' || n.k === 'neg' ? tenyezok(n.a) : [n];
/* Hány változót tartalmazó tényezőre bomlik (multiplicitással): 3x²(x+2)² → x, x, (x+2), (x+2) = 4 */
function tenyezoDb(n) {
  if (n.k === 'neg' || n.k === 'div') return tenyezoDb(n.a);
  if (n.k === 'mul') return tenyezoDb(n.a) + tenyezoDb(n.b);
  if (n.k === 'pow' && n.b.k === 'num' && Number.isInteger(n.b.v) && n.b.v > 0) return n.b.v * tenyezoDb(n.a);
  return valtozok(n).length ? 1 : 0;
}
/* Kiemelhető-e még szám az összegből: egész helyeken vett (egész) értékeinek legnagyobb közös osztója 1-nél nagyobb */
function kiemelheto(n) {
  const vars = valtozok(n), lnko = (a, b) => b ? lnko(b, a % b) : a; let g = 0;
  for (let j = 0; j < 8; j++) {
    const y = ertek(n, Object.fromEntries(vars.map((v, i) => [v, 1 + ((j * (i + 2) + i) % 7)])));
    if (!isFinite(y) || !kozel(y, Math.round(y))) return false;
    g = lnko(g, Math.abs(Math.round(y)));
  }
  return g > 1;
}
const tagDb = n => osszegE(n) ? tagDb(n.a) + tagDb(n.b) : 1;
const negyzetmentes = v => { for (let d = 2; d * d <= v; d++) if (v % (d * d) === 0) return false; return true; };
const vanBenne = (n, teszt) => { let van = false; bejar(n, c => { if (teszt(c)) van = true; }); return van; };
const megoldott = (r, v) => r.tagok.some(t => t.k === 'var' && t.n === v) && r.tagok.every(t => (t.k === 'var' && t.n === v) || !valtozok(t).includes(v));
function alakHiba(A, valasz, v, B) {
  const EGY = 'Egyenlő a helyes válasszal, de ';
  // állításnál a feladat visszaírása (pl. sin x = 1/2) ugyanazt a halmazt adja – megoldott alak kell: az ismeretlen egyedül álljon
  if (predE(A) && vanBenne(A, c => c.k === 'rel' && !megoldott(c, v))) return `Ez még nincs megoldva: úgy add meg, hogy az ${v} egyedül álljon az egyik oldalon (például ${v} < 3), vagy intervallummal, halmazzal.`;
  if (valasz.alak === 'szorzat') {
    let n = A; while (n.k === 'neg') n = n.a;
    if (!(n.k === 'mul' || n.k === 'pow') || !tenyezok(n).some(osszegE)) return EGY + 'még nem szorzat alak.';
    // a mérce a feladatíró válasza: legalább annyi tényezőre legyen bontva, és ha abban nincs kiemelhető szám, itt se maradjon
    if (tenyezoDb(A) < tenyezoDb(B)) return EGY + 'még tovább alakítható szorzattá.';
    if (!tenyezok(B).filter(osszegE).some(kiemelheto) && tenyezok(A).filter(osszegE).some(kiemelheto)) return EGY + 'a zárójelből még kiemelhető egy közös szám.';
  }
  if (valasz.alak === 'kifejtett') {
    if (vanBenne(A, c => ['mul', 'pow', 'neg', 'div'].includes(c.k) && [c.a, c.b].some(x => x && osszegE(x)))) return EGY + 'még van benne felbontatlan zárójel.';
    if (valasz.tagok && tagDb(A) > valasz.tagok) return EGY + 'még össze lehet vonni tagokat.';
  }
  if (valasz.alak === 'gyok' && vanBenne(A, c => c.k === 'gyok' && !(c.a.k === 'num' && Number.isInteger(c.a.v) && negyzetmentes(c.a.v)))) return EGY + 'a gyökjel alól még kihozható szorzótényező.';
  // egyfv: egyetlen függvény, összeg és további függvény nélkül az argumentumban (argSzam: az argumentum egyetlen szám)
  if (valasz.alak === 'egyfv' && A.k !== 'num' && (A.k !== 'fn' || vanBenne(A.a, c => osszegE(c) || c.k === 'fn') || (valasz.argSzam && A.a.k !== 'num'))) return EGY + `még nem egyetlen ${valasz.minek || 'függvény'}.`;
  if (valasz.alak === 'fvNelkul' && vanBenne(A, c => c.k === 'fn')) return EGY + 'a pontos értéket függvény nélkül add meg.';
  return '';
}

/* valasz: { kifejezes: '(x+3)^2', alak (elhagyható): 'szorzat' | 'kifejtett' | 'gyok' | 'egyfv' | 'fvNelkul', tagok, minek, argSzam, valtozo }
 * A kifejezes lehet reláció (x<5), intervallum (]-\infty;5[), halmaz (\lbrace1;2\rbrace) is – a diák bármelyik egyenértékű alakban felelhet.
 * Eredmény: { ok: true } | { ok: false, uzenet } | { forma: true, uzenet }  (forma: alaki gond, nem számít hibának) */
function kifejezesEllenoriz(valasz, latex) {
  const B = ertelmez(valasz.kifejezes), hB = predE(B); let A;
  try { A = ertelmez(latex); } catch (e) { return { forma: true, uzenet: `Ezt még nem tudom kiolvasni – ${e.message}.` }; }
  if (!hB && A.k === 'rel' && A.jelek.every(j => j === '=')) A = A.tagok[A.tagok.length - 1];   // „… = (x+3)^2” beírva: a vége a válasz
  if (predE(A) !== hB) return { forma: true, uzenet: hB ? 'Relációt, intervallumot vagy halmazt várok, például x < 3 vagy ]−∞; 3[.' : 'Kifejezést várok, relációs jel nélkül.' };
  const vars = hB ? [valasz.valtozo || valtozok(B).find(v => !PARAM.includes(v)) || 'x'] : valtozok(B);
  const idegen = valtozok(A).find(v => !vars.includes(v) && !(hB && PARAM.includes(v)));     // állításban a k, n, m, l egész paraméter lehet
  if (idegen) return { forma: true, uzenet: `A válaszodban szerepel a(z) ${idegen} betű, ami a feladatban nincs.` };
  const kul = hB ? halmazKulonbseg(A, B, vars[0]) : kulonbseg(A, B, vars);
  if (kul) return { ok: false, uzenet: kul };
  const alak = alakHiba(A, valasz, vars[0], B);
  return alak ? { forma: true, uzenet: alak } : { ok: true };
}

const API = { ellenoriz: kifejezesEllenoriz, ertelmez, halmazKulonbseg };
if (typeof module === 'object' && module.exports) module.exports = API; else root.Kifejezes = API;
})(typeof window !== 'undefined' ? window : globalThis);
