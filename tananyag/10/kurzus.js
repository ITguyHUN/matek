/*
 * 10. évfolyam – tananyag-leíró (Sokszínű matematika 10., Mozaik; feladatgyűjtemény 9–10; OH Matematika 10.)
 * A fájl elején a 10.-es fejezetek közös segédfüggvényei vannak (window.M10), alatta a tananyag leírása.
 * A fejezetek SORRENDJE egyben a megnyitási sorrend is.
 */
(function () {
/* ---------- véletlen ---------- */
const R0 = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
function keverd(t) { const a = t.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* k darab különböző egész [a; b]-ből (kizárt értékek nélkül) */
function kulonbozo(k, a, b, kiz = []) { const out = []; let g = 0; while (out.length < k && g++ < 500) { const x = R(a, b); if (!out.includes(x) && !kiz.includes(x)) out.push(x); } return out; }

/* ---------- számok TeX-ben ---------- */
const isF = c => c && typeof c === 'object';
const val = c => isF(c) ? c.n / c.d : c;
/* abszolút érték TeX-alakja (egész vagy tört) */
function absT(c) { if (isF(c)) { const n = Math.abs(c.n); return c.d === 1 ? String(n) : T`\frac{${n}}{${c.d}}`; } return nt(Math.abs(c)); }
/* szám TeX-ben, előjellel (egész, tizedes vagy tört objektum) */
function sz(c) { if (isF(c)) return ft(F(c.n, c.d)); return nt(c); }
/* negatív szám zárójelben (pl. szorzásnál, behelyettesítésnél) */
function zj(c) { return val(c) < 0 ? T`\left(${sz(c)}\right)` : sz(c); }
/* előjeles tag összeghez: +3, -5 (0 esetén üres) */
function el(c) { const v = val(c); return v === 0 ? '' : (v > 0 ? '+' : '-') + absT(c); }
/* előjeles tag változóval: +3x, -x, +x (0 esetén üres) */
function tg(c, v = 'x') { const x = val(c); return x === 0 ? '' : (x > 0 ? '+' : '-') + (Math.abs(x) === 1 ? '' : absT(c)) + v; }

/* ---------- polinom TeX: együtthatók csökkenő fokszám szerint ---------- */
function poly(cs, v = 'x') {
  const n = cs.length - 1; let s = '';
  cs.forEach((c, i) => {
    const d = n - i, x = val(c); if (x === 0) return;
    const vp = d === 0 ? '' : d === 1 ? v : `${v}^{${d}}`;
    const co = (Math.abs(x) === 1 && d > 0) ? '' : absT(c);
    s += (x < 0 ? '-' : (s ? '+' : '')) + co + vp;
  });
  return s || '0';
}
const q2 = (a, b, c, v = 'x') => poly([a, b, c], v);
const l1 = (p, q, v = 'x') => poly([p, q], v);
/* (x − r) alakú tényező, r tört is lehet: (x-3), (x+2), (2x-1) */
function tenyezo(r, v = 'x') { const f = isF(r) ? F(r.n, r.d) : F(r, 1); return f.d === 1 ? (f.n === 0 ? v : `(${v}${el(-f.n)})`) : `(${f.d}${v}${el(-f.n)})`; }

/* ---------- gyökök ---------- */
function gyokEgysz(n, k = 2) { /* n = s^k · m, a legnagyobb ilyen s-sel */ let s = 1; for (let t = Math.floor(Math.pow(n, 1 / k) + 1e-9); t >= 2; t--) if (n % (t ** k) === 0) { s = t; break; } return { s, m: n / (s ** k) }; }
function gy(s, m, k = 2) { const r = k === 2 ? T`\sqrt{${m}}` : T`\sqrt[${k}]{${m}}`; if (m === 1) return String(s); if (s === 1) return r; if (s === -1) return '-' + r; return `${s}${r}`; }
const negyzet = n => n >= 0 && Number.isInteger(Math.sqrt(n));
const fakt = n => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; };
const binom = (n, k) => { if (k < 0 || k > n) return 0; let p = 1; for (let i = 1; i <= k; i++) p = p * (n - k + i) / i; return Math.round(p); };

/* ---------- másodfokú egyenlet: együtthatók gyökökből ---------- */
/* gyökök (egész vagy tört objektum) → [a, b, c] egész együtthatók, a > 0, legnagyobb közös osztó nélkül; k: szorzó */
function egyutthatok(r1, r2, k = 1) {
  const f1 = isF(r1) ? F(r1.n, r1.d) : F(r1, 1), f2 = isF(r2) ? F(r2.n, r2.d) : F(r2, 1);
  let a = f1.d * f2.d, b = -(f1.n * f2.d + f2.n * f1.d), c = f1.n * f2.n;
  const g = gcd(gcd(a, b), c) || 1; a /= g; b /= g; c /= g;
  return [a * k, b * k, c * k];
}
/* véletlen „szép” tört gyök: egész vagy p/q (q = 2, 3, 4, 5) */
function tortGyok(maxN = 6) { const q = P([2, 2, 3, 3, 4, 5]); let p; do { p = R(-maxN * q, maxN * q); } while (p % q === 0 || p === 0); return F(p, q); }

/* megoldóképlet lépései; a, b, c egészek; → { lep, gyokok (növekvő számok), D } */
function keplet(a, b, c, v = 'x') {
  const D = b * b - 4 * a * c, lep = [];
  lep.push(T`\(a=${a},\; b=${b},\; c=${c}\)`);
  lep.push(T`\[D=b^2-4ac=${zj(b)}^2-4\cdot ${zj(a)}\cdot ${zj(c)}=${D}\]`);
  if (D < 0) { lep.push(T`\(D<0\), ezért az egyenletnek nincs valós gyöke.`); return { lep, gyokok: [], D }; }
  const n2a = 2 * a;
  if (D === 0) { const r = F(-b, n2a); lep.push(T`\(D=0\), egy (kettős) gyök: \[${v}=\frac{-b}{2a}=\frac{${-b}}{${n2a}}=${ft(r)}\]`); return { lep, gyokok: [fv(r)], D }; }
  if (negyzet(D)) {
    const s = Math.sqrt(D), r1 = F(-b - s, n2a), r2 = F(-b + s, n2a);
    lep.push(T`\[${v}_{1,2}=\frac{-b\pm\sqrt{D}}{2a}=\frac{${-b}\pm ${s}}{${n2a}}\]`);
    lep.push(T`\[${v}_1=\frac{${-b + s}}{${n2a}}=${ft(r2)},\qquad ${v}_2=\frac{${-b - s}}{${n2a}}=${ft(r1)}\]`);
    return { lep, gyokok: [fv(r1), fv(r2)].sort((x, y) => x - y), D };
  }
  const { s, m } = gyokEgysz(D); const x1 = (-b - Math.sqrt(D)) / n2a, x2 = (-b + Math.sqrt(D)) / n2a;
  lep.push(T`\[${v}_{1,2}=\frac{${-b}\pm\sqrt{${D}}}{${n2a}}${s > 1 ? T`=\frac{${-b}\pm ${gy(s, m)}}{${n2a}}` : ''}\]`);
  lep.push(T`\[${v}_1\approx ${nt(+x2.toFixed(3))},\qquad ${v}_2\approx ${nt(+x1.toFixed(3))}\]`);
  return { lep, gyokok: [x1, x2], D };
}
/* gyökök felsorolása TeX-ben: x_1=…, x_2=… */
function gyokokT(gyk, v = 'x') {
  const t = gyk.map(r => isF(r) ? ft(F(r.n, r.d)) : (Number.isInteger(r) ? String(r) : nt(+r.toFixed(4))));
  if (!t.length) return 'nincs valós megoldás';
  if (t.length === 1) return T`${v}=${t[0]}`;
  return t.map((s, i) => T`${v}_{${i + 1}}=${s}`).join(T`,\; `);
}
/* szám olvasható alakja (válaszmintához) */
function frSz(n, d = 1) { const f = F(n, d); return f.d === 1 ? hu(f.n) : (f.n < 0 ? '−' : '') + Math.abs(f.n) + '/' + f.d; }

/* névelő egész szám elé: „az 1”, „az 5”, „az 50”, „az 1000”, de „a 2”, „a 100” */
function az(n) {
  n = Math.round(n); if (n < 0) return 'a';
  if (n >= 1000) { const t = Math.floor(n / 1000) % 1000; return n >= 1e6 ? az(Math.floor(n / 1e6)) : (t === 1 ? 'az' : az(t)); }
  if (n >= 100) { const h = Math.floor(n / 100); return h === 5 ? 'az' : 'a'; }
  if (n >= 10) return Math.floor(n / 10) === 5 ? 'az' : 'a';
  return n === 1 || n === 5 ? 'az' : 'a';
}
const Az = n => az(n) === 'az' ? 'Az' : 'A';
/* toldalékok számok után (az utolsó kiejtett szó szerint): 12-vel, 13-mal, 20-szal; 3-szor, 5-ször; 3-szorosa */
function utolsoSzo(n) { n = Math.abs(Math.round(n)); if (n === 0) return 'nulla'; if (n % 10) return ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc'][n % 10];
  if (n % 100) return ['', 'tíz', 'húsz', 'harminc', 'negyven', 'ötven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'][(n / 10) % 10]; if (n % 1000) return 'száz'; return n % 1e6 ? 'ezer' : 'millió'; }
const VEL = { nulla: 'val', egy: 'gyel', 'kettő': 'vel', 'három': 'mal', 'négy': 'gyel', 'öt': 'tel', hat: 'tal', 'hét': 'tel', nyolc: 'cal', kilenc: 'cel', 'tíz': 'zel', 'húsz': 'szal', harminc: 'cal', negyven: 'nel', 'ötven': 'nel', hatvan: 'nal', hetven: 'nel', nyolcvan: 'nal', kilencven: 'nel', 'száz': 'zal', ezer: 'rel', 'millió': 'val' };
const SZOR = { nulla: 'o', egy: 'e', 'kettő': 'e', 'három': 'o', 'négy': 'e', 'öt': 'ö', hat: 'o', 'hét': 'e', nyolc: 'o', kilenc: 'e', 'tíz': 'e', 'húsz': 'o', harminc: 'o', negyven: 'e', 'ötven': 'e', hatvan: 'o', hetven: 'e', nyolcvan: 'o', kilencven: 'e', 'száz': 'o', ezer: 'e', 'millió': 'o' };
const vel = n => `${n}-${VEL[utolsoSzo(n)]}`;
const szer = n => `${n}-${{ e: 'szer', o: 'szor', 'ö': 'ször' }[SZOR[utolsoSzo(n)]]}`;
const szerese = n => `${n}-${{ e: 'szerese', o: 'szorosa', 'ö': 'szöröse' }[SZOR[utolsoSzo(n)]]}`;
/* szám rövid magyar alakja (feleletválasztós szövegekhez) */
const hs = x => hu(+(+x).toFixed(4));

/* ---------- parabola-rajzoló (grafikon: M10.parabola) ---------- */
let rajzSzam = 0;
function parabola(opt = {}) {
  return function (box) {
    const id = 'pb' + (++rajzSzam);
    const AK = [{ l: '−2', v: -2 }, { l: '−1', v: -1 }, { l: '−1/2', v: -0.5 }, { l: '1/2', v: 0.5 }, { l: '1', v: 1 }, { l: '2', v: 2 }];
    let a = 1, u = 0, v = opt.elojel ? -4 : 0;
    box.innerHTML = `<div class="plot"><div class="canvasbox"><canvas aria-label="A parabola"></canvas></div>
     <div class="ctrl"><div class="ftex" id="${id}f"></div>
      <div><span>Főegyüttható (a)</span><div class="row" id="${id}a">${AK.map(b => `<button class="chip" data-v="${b.v}" aria-pressed="${b.v === 1}">${b.l}</button>`).join('')}</div></div>
      <label for="${id}u">Vízszintes eltolás: u = <b id="${id}uv">0</b><input type="range" id="${id}u" min="-5" max="5" step="1" value="0"></label>
      <label for="${id}v">Függőleges eltolás: v = <b id="${id}vv">${hu(v)}</b><input type="range" id="${id}v" min="-5" max="5" step="1" value="${v}"></label>
      <dl class="props" id="${id}p"></dl></div></div>`;
    const cv = box.querySelector('canvas'), cb = box.querySelector('.canvasbox'), S = 6;
    const f = x => a * (x - u) ** 2 + v;
    const N = x => hu(+(+x).toFixed(3));
    const zerusok = () => { const t = -v / a; if (t < 0) return []; if (t === 0) return [u]; const s = Math.sqrt(t); return [u - s, u + s]; };
    const kif = (x, nev) => x === 0 ? nev : x > 0 ? `${nev} − ${N(x)}` : `${nev} + ${N(-x)}`;
    function formula() {
      const al = (AK.find(k => k.v === a) || { l: a }).l;
      const aT = a === 1 ? '' : a === -1 ? '−' : (al.includes('/') ? `(${al})·` : al);
      const b = -2 * a * u, c = a * u * u + v;
      const tag = (k, s, elso) => k === 0 ? '' : (k < 0 ? ' − ' : (elso ? '' : ' + ')) + (Math.abs(k) === 1 && s ? '' : N(Math.abs(k))) + s;
      const kif2 = tag(a, 'x²', true) + tag(b, 'x', false) + tag(c, '', false);
      return `f(x) = ${aT}${u === 0 ? 'x²' : `(${kif(u, 'x')})²`}${v ? (v > 0 ? ' + ' + v : ' − ' + (-v)) : ''}${a !== 1 || u !== 0 ? `<br><span class="small">= ${kif2.trim()}</span>` : ''}`;
    }
    function props() {
      const z = zerusok(), fel = a > 0;
      const rows = [['Csúcspont', `C(${N(u)}; ${N(v)})`], ['Tengely', `x = ${N(u)}`],
        ['Zérushely', z.length ? z.map(N).join(' és ') : 'nincs'],
        ['Értékkészlet', fel ? `y ≥ ${N(v)}` : `y ≤ ${N(v)}`],
        [fel ? 'Minimum' : 'Maximum', `${N(v)}, az x = ${N(u)} helyen`],
        ['Monotonitás', fel ? `x ≤ ${N(u)}: csökkenő; x ≥ ${N(u)}: növekvő` : `x ≤ ${N(u)}: növekvő; x ≥ ${N(u)}: csökkenő`]];
      if (opt.elojel) {
        let poz, neg;
        if (z.length === 2) { const k = `${N(z[0])} < x < ${N(z[1])}`, kv = `x < ${N(z[0])} vagy x > ${N(z[1])}`; poz = fel ? kv : k; neg = fel ? k : kv; }
        else if (z.length === 1) { poz = fel ? `x ≠ ${N(z[0])}` : 'nincs'; neg = fel ? 'nincs' : `x ≠ ${N(z[0])}`; }
        else { poz = fel ? 'minden valós x' : 'nincs'; neg = fel ? 'nincs' : 'minden valós x'; }
        rows.push(['f(x) > 0', poz], ['f(x) < 0', neg]);
      }
      box.querySelector(`#${id}p`).innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
      box.querySelector(`#${id}f`).innerHTML = formula();
    }
    function draw() {
      if (!document.body.contains(cv)) return;
      const W = cb.clientWidth || 400, dpr = window.devicePixelRatio || 1;
      cv.width = W * dpr; cv.height = W * dpr; const c = cv.getContext('2d'); if (!c) return; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(document.documentElement), col = n => cs.getPropertyValue(n).trim();
      const k = W / (2 * S), X = x => (x + S) * k, Y = y => (S - y) * k;
      c.fillStyle = col('--card'); c.fillRect(0, 0, W, W);
      c.strokeStyle = col('--gridline'); c.lineWidth = 1;
      for (let i = -S; i <= S; i++) { c.beginPath(); c.moveTo(X(i), 0); c.lineTo(X(i), W); c.stroke(); c.beginPath(); c.moveTo(0, Y(i)); c.lineTo(W, Y(i)); c.stroke(); }
      c.strokeStyle = col('--muted'); c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.moveTo(X(0), 0); c.lineTo(X(0), W); c.stroke();
      c.fillStyle = col('--muted'); c.font = `11px ${col('--f-mono') || 'monospace'}`; c.textAlign = 'center';
      for (let i = -S + 1; i < S; i++) { if (i === 0 || i % 2) continue; c.fillText(String(i).replace('-', '−'), X(i), Y(0) + 14); c.textAlign = 'right'; c.fillText(String(i).replace('-', '−'), X(0) - 5, Y(i) + 4); c.textAlign = 'center'; }
      if (opt.elojel) {   /* az x tengely színezése: zöld, ahol f(x) > 0; piros, ahol f(x) < 0 */
        const L = 600; c.lineWidth = 5;
        for (let i = 0; i < L; i++) { const x0 = -S + 2 * S * i / L, x1 = -S + 2 * S * (i + 1) / L, y = f((x0 + x1) / 2);
          if (Math.abs(y) < 1e-12) continue; c.strokeStyle = y > 0 ? col('--green') : col('--red'); c.beginPath(); c.moveTo(X(x0), Y(0)); c.lineTo(X(x1), Y(0)); c.stroke(); }
      }
      c.strokeStyle = col('--red'); c.lineWidth = 1.2; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(X(u), 0); c.lineTo(X(u), W); c.stroke(); c.setLineDash([]);
      const gorbe = (fn, color, w, dash) => { c.strokeStyle = color; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); let on = false;
        for (let i = 0; i <= 900; i++) { const t = -S - 1 + (2 * S + 2) * i / 900, y = fn(t); if (!isFinite(y) || Math.abs(y) > 40) { on = false; continue; }
          if (!on) { c.moveTo(X(t), Y(y)); on = true; } else c.lineTo(X(t), Y(y)); }
        c.stroke(); c.setLineDash([]); };
      if (a !== 1 || u !== 0 || v !== 0) gorbe(x => x * x, col('--muted'), 1.5, [3, 4]);
      gorbe(f, col('--pen'), 2.6);
      const pont = (x, y) => { if (Math.abs(x) > S || Math.abs(y) > S) return; c.fillStyle = col('--pen'); c.beginPath(); c.arc(X(x), Y(y), 4, 0, 7); c.fill(); };
      pont(u, v); zerusok().forEach(x => pont(x, 0));
      c.textAlign = 'left'; c.font = `12px ${col('--f-body') || 'sans-serif'}`;
      const leg = [[col('--pen'), 'f(x)'], [col('--red'), 'tengely']]; if (a !== 1 || u || v) leg.push([col('--muted'), 'y = x²']);
      leg.forEach((l, i) => { c.fillStyle = col('--card'); c.fillRect(8, 8 + i * 18, 90, 18); c.fillStyle = l[0]; c.fillRect(12, 15 + i * 18, 14, 3); c.fillStyle = col('--ink'); c.fillText(l[1], 32, 20 + i * 18); });
    }
    const upd = () => { props(); draw(); };
    box.querySelector(`#${id}a`).onclick = e => { const b = e.target.closest('.chip'); if (!b) return; a = +b.dataset.v; box.querySelectorAll(`#${id}a .chip`).forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); };
    const su = box.querySelector(`#${id}u`), sv = box.querySelector(`#${id}v`);
    su.oninput = () => { u = +su.value; box.querySelector(`#${id}uv`).textContent = hu(u); upd(); };
    sv.oninput = () => { v = +sv.value; box.querySelector(`#${id}vv`).textContent = hu(v); upd(); };
    if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(cb);
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw); } catch (e) {}
    upd();
  };
}

/* HTML-biztos képletek: a képleten belüli „<” után szóköz kerül, ha betű követi (pl. „1<x<3”),
   különben a böngésző HTML-címkének olvasná. A fejezetfájlok a Tananyag.fejezet(M10.tisztit({ … })) alakot használják. */
const MATH = /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;
const lt = s => typeof s === 'string' ? s.replace(MATH, m => m.replace(/<(?=[A-Za-z|!?\/])/g, '< ')) : s;
function tisztitP(p) { if (!p) return p; ['kerdes', 'tipp', 'allitas', 'miert'].forEach(k => { if (p[k] != null) p[k] = lt(p[k]); }); if (Array.isArray(p.megoldas)) p.megoldas = p.megoldas.map(lt); return p; }
/* Fejezet-nyilvántartás: a vizsgafejezetek a tananyag-fejezetek feladattípusait használják (lásd atvesz, vizsga). */
const REG = {};
function tisztit(d) {
  if (d && d.id) REG[d.id] = d;
  ['bevezeto', 'elmelet'].forEach(k => { d[k] = lt(d[k]); });
  if (d.mintapelda) { d.mintapelda.feladat = lt(d.mintapelda.feladat); d.mintapelda.lepesek = (d.mintapelda.lepesek || []).map(lt); }
  if (Array.isArray(d.igazHamis)) d.igazHamis = d.igazHamis.map(x => typeof x.general === 'function' ? Object.assign({}, x, { general() { return tisztitP(x.general.call(x)); } }) : tisztitP(Object.assign({}, x)));
  Object.values(d.feladatok || {}).forEach(g => { const eredeti = g.general; g.general = function () { return tisztitP(eredeti.call(this)); }; });
  return d;
}

const FMT10 = { egesz: 'egész szám', tort: 'egész szám vagy tört, pl. 3/2', halmaz: 'egy vagy több szám, pontosvesszővel: 1; 2 (ha nincs: nincs)', kerek: 'tizedes tört két tizedesjegyre, pl. 2,41', szam: 'szám' };

/* Vizsga: egy tananyag-fejezet feladattípusának átvétele. A forrásfejezet is be van töltve (minden aktív témakör
   fejezete betöltődik), a generátort csak feladatkészítéskor keressük meg – így a betöltési sorrend mindegy.
   FONTOS: a forrásfejezet témakörét ne kapcsold ki (aktiv: false), különben a vizsgafeladat nem készül el. */
function atvesz(forras, tipus, nev, opt = {}) {
  return Object.assign({ nev, general() {
    const d = REG[forras], g = d && d.feladatok && d.feladatok[tipus];
    if (!g) throw new Error(`A(z) „${forras}” fejezet „${tipus}” feladattípusa nincs betöltve.`);
    return g.general();
  } }, opt);
}
/* Vizsgafejezet: a saját szövegei tisztítva; az igaz–hamis kérdésbankot a forrásfejezetekből veszi (csak közép szintűek). */
function vizsga(d, forrasok = [], ihDb = 10) {
  const sajat = Array.isArray(d.igazHamis) ? d.igazHamis : [];
  delete d.igazHamis;
  ['bevezeto', 'elmelet'].forEach(k => { d[k] = lt(d[k]); });
  if (d.mintapelda) { d.mintapelda.feladat = lt(d.mintapelda.feladat); d.mintapelda.lepesek = (d.mintapelda.lepesek || []).map(lt); }
  Object.values(d.feladatok || {}).forEach(g => { const eredeti = g.general; g.general = function () { return tisztitP(eredeti.call(this)); }; });
  Object.defineProperty(d, 'igazHamis', { enumerable: true, configurable: true, get() {
    const lista = sajat.slice();
    forrasok.forEach(f => { const x = REG[f]; if (x && Array.isArray(x.igazHamis)) x.igazHamis.forEach(e => { if (e.szint !== 'emelt') lista.push(e); }); });
    return lista;
  } });
  if (d.id) REG[d.id] = d;
  return d;
}
/* tananyag-hivatkozások a vizsgafejezetek elméletéhez */
const gyakorlo = (tk, fgy) => `<div class="prose small"><p><b>Gyakorló feladatok (vizsgatematika):</b> ${tk ? `Tankönyv: ${tk}` : ''}${tk && fgy ? ' · ' : ''}${fgy ? `Sokszínű matematika feladatgyűjtemény 9–10: ${fgy}` : ''}</p></div>`;

window.M10 = { R0, keverd, kulonbozo, isF, val, absT, sz, zj, el, tg, poly, q2, l1, tenyezo, gyokEgysz, gy, negyzet, egyutthatok, tortGyok, keplet, gyokokT, frSz, hs, az, Az, vel, szer, szerese, parabola, tisztit, atvesz, vizsga, gyakorlo, REG, binom, fakt, FMT10 };
})();

Tananyag.kurzus({
  cim: 'Matek 10',
  alcim: '10. évfolyam · Sokszínű matematika 10. (Mozaik)',
  jelek: 'n! · ax² + bx + c = 0 · D = b² − 4ac · √a · ⁿ√a',
  alapTemakor: 'masod',      // ez a témakör legyen kiválasztva, amíg a diák nem választ mást
  // Évfolyamszintű szabályok (elhagyhatók – akkor a config.js értéke érvényes):
  joValaszCukorkahoz: 5,     // egy cukorkához minden feladattípusból ennyi új jó megoldás kell
  // cukorkaNyitashoz: 1,
  // streakNapiMin: 1,
  temakorok: [
    /* ---------- Tananyag (a tankönyv fejezetei) ---------- */
    {
      id: 'gondolkodas',
      cim: 'Gondolkodási módszerek',
      mappa: 'gondolkodasi-modszerek',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 12 },
      fejezetek: [
        '01-feltetelek.js',
        '02-skatulyaelv.js',
        '03-sorba-rendezes.js',
        '04-kivalasztas.js',
        '05-kombinacio.js'
      ]
    },
    {
      id: 'gyok',
      cim: 'A gyökvonás',
      mappa: 'gyokvonas',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 12 },
      fejezetek: [
        '00-racionalis-irracionalis.js',
        '01-negyzetgyok-azonossagok.js',
        '02-negyzetgyok-alkalmazasok.js',
        '03-n-edik-gyok.js',
        '04-vegyes.js'
      ]
    },
    {
      id: 'masod',
      cim: 'A másodfokú egyenlet',
      mappa: 'masodfoku-egyenlet',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 15 },
      fejezetek: [
        '01-masodfoku-fuggveny.js',
        '02-megoldokeplet.js',
        '03-diszkriminans.js',
        '04-gyoktenyezos-viete.js',
        '05-visszavezetheto.js',
        '06-egyenletrendszerek.js',
        '07-egyenlotlensegek.js',
        '08-parameteres.js',          // emelt szint (a fájlban: szint: 'emelt')
        '09-negyzetgyokos.js',
        '10-kozepek.js',
        '11-szelsoertek.js',          // emelt szint
        '12-szoveges.js'
      ]
    },
    /* ---------- Vizsga (vizsgatematika 10.ABCD; csak a tematika feladattípusai) ----------
       A vizsgafejezetek a fenti tananyag-fejezetek generátorait használják (M10.atvesz). */
    {
      id: 'vizsga1',
      cim: 'Vizsga 1. · Négyzetgyök, n-edik gyök',
      mappa: 'vizsga',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 12 },
      fejezetek: [
        'v1-01-racionalis-irracionalis.js',
        'v1-02-negyzetgyok-azonossagok.js',
        'v1-03-negyzetgyok-muveletek.js',
        'v1-04-n-edik-gyok.js',
        'v1-05-n-edik-gyok-muveletek.js'
      ]
    },
    {
      id: 'vizsga2',
      cim: 'Vizsga 2. · Másodfokú egyenletek',
      mappa: 'vizsga',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 15 },
      fejezetek: [
        'v2-01-megoldokeplet.js',
        'v2-02-gyoktenyezos-alak.js',
        'v2-03-egyenlotlensegek.js',
        'v2-04-negyzetgyokos.js',
        'v2-05-magasabbfoku-tortes.js',
        'v2-06-egyenletrendszerek.js',
        'v2-07-szoveges.js',
        'v2-08-diszkriminans.js'
      ]
    },
    {
      id: 'vizsga4',
      cim: 'Vizsga 4. · Kombinatorika',
      mappa: 'vizsga',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 12 },
      fejezetek: [
        'v4-01-skatulyaelv.js',
        'v4-02-permutacio.js',
        'v4-03-variacio.js',
        'v4-04-kombinacio.js'
        // 'v4-05-valoszinuseg.js'   ← a klasszikus valószínűségi modell, ha a tankönyv 6. fejezetéhez értetek
      ]
    }
  ]
});
