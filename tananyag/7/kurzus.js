/*
 * 7. évfolyam – tananyag-leíró (Sokszínű matematika 7., Mozaik, 1–4. lecke)
 * A fájl elején a 7.-es fejezetek közös segédfüggvényei vannak (window.M7), alatta a tananyag leírása.
 * A fejezetek SORRENDJE egyben a megnyitási sorrend is.
 */
(function () {
const fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
const fp = f => f.n < 0 ? T`\left(${ft(f)}\right)` : ft(f);
function fmix(f) { if (f.d === 1 || Math.abs(f.n) < f.d) return ft(f); const a = Math.abs(f.n); return (f.n < 0 ? '-' : '') + Math.floor(a / f.d) + T`\frac{${a % f.d}}{${f.d}}`; }
const fmixp = f => f.n < 0 ? T`\left(${fmix(f)}\right)` : fmix(f);
const ntp = x => x < 0 ? T`(${nt(x)})` : nt(x);
function fplain(f) { if (f.d === 1) return hu(f.n); return (f.n < 0 ? '−' : '') + Math.abs(f.n) + '/' + f.d; }
function fmixplain(f) { if (f.d === 1 || Math.abs(f.n) < f.d) return fplain(f); const a = Math.abs(f.n); return (f.n < 0 ? '−' : '') + Math.floor(a / f.d) + ' ' + (a % f.d) + '/' + f.d; }
const finDen = d => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
function primeF(n) { const out = []; let p = 2; while (n > 1) { while (n % p === 0) { out.push(p); n /= p; } p++; } return out; }
function decParts(f) {
  const neg = f.n < 0; let n = Math.abs(f.n); const d = f.d;
  const ip = Math.floor(n / d); let r = n % d; const seen = {}; const digs = [];
  while (r !== 0 && seen[r] === undefined) { seen[r] = digs.length; r *= 10; digs.push(Math.floor(r / d)); r %= d; }
  if (r === 0) return { neg, ip, pre: digs.join(''), rep: '' };
  const k = seen[r]; return { neg, ip, pre: digs.slice(0, k).join(''), rep: digs.slice(k).join('') };
}
function decTex(f) { const p = decParts(f); let s = (p.neg ? '-' : '') + p.ip; if (!p.pre && !p.rep) return s; s += '{,}' + p.pre;
  if (p.rep.length === 1) s += T`\dot{${p.rep}}`; else if (p.rep) s += T`\dot{${p.rep[0]}}` + p.rep.slice(1, -1) + T`\dot{${p.rep.slice(-1)}}`; return s; }
function decLong(f) { const p = decParts(f); let s = (p.neg ? '−' : '') + p.ip; if (!p.pre && !p.rep) return s; s += ',' + p.pre;
  if (p.rep) s += (p.rep.repeat(Math.ceil(6 / p.rep.length))).slice(0, Math.max(6 - p.pre.length, p.rep.length * 2)) + '…'; return s; }
const FMT7 = { frac: 'egész szám vagy tört', dec: 'tizedes tört, pl. 0,375', fs: 'tört (egyszerűsítve), pl. 3/8', num: 'szám' };
const sf = (n, d) => (n < 0 ? '-' : '') + T`\frac{${Math.abs(n)}}{${d}}`;
function tbl(head, rows) { return `<div class="tbl"><table class="mini"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`; }
function randRat() { const t = R(0, 3); let f;
  if (t === 0) { const d = P([2, 4, 5, 8, 10, 20, 25]); f = F(R(-3 * d, 3 * d), d); }
  else if (t === 1) { const d = P([3, 6, 7, 9, 11, 12]); f = F(R(-3 * d, 3 * d), d); }
  else { const d = P([10, 100]); f = F(R(-3 * d, 3 * d), d); }
  return f; }
function showRat(f, style) { // style: 0 tört, 1 tizedes (ha véges), 2 vegyes
  if ((style === 1 || f.d >= 10) && finDen(f.d) && f.d > 1) return { tex: nt(fv(f)), txt: hu(fv(f)) };
  if (style === 2 && Math.abs(f.n) > f.d && f.d > 1) return { tex: fmix(f), txt: fmixplain(f) };
  return { tex: ft(f), txt: fplain(f) }; }
function decApprox(f) { return finDen(f.d) ? nt(fv(f)) : decLong(f).replace('−', '-').replace(/,/g, '{,}'); }
const smallFrac = (maxd = 12) => { let d, n; do { d = R(2, maxd); n = R(-2 * d, 2 * d); } while (n === 0 || n % d === 0); return F(n, d); };
/* rajzolási segédek a számegyeneshez és az arányosságrajzolóhoz */
const $ = (q, el = document) => el.querySelector(q);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function setupCanvas(cv, W, H) { const dpr = window.devicePixelRatio || 1; cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); return c; }
const FMTLINE = 'tört: <code>3/8</code> · tizedes: <code>0,375</code> · vegyes szám: <code>2 1/4</code> · szakaszos: <code>0,(3)</code>';
/* a fejezetfájlok generátorainak átalakítása a rendszer formátumára */
function conv(p) {
  const a = p.ans; let valasz;
  if (a.choice) valasz = { valasztas: a.choice, helyes: a.correct };
  else if (a.between) valasz = { kozott: a.between, pelda: p.ansText };
  else { valasz = { ertekek: a.vals }; if (a.tol) valasz.tol = a.tol; if (a.form === 'dec') valasz.forma = 'tizedes'; if (a.form === 'frac') valasz.forma = 'tort'; }
  return { kerdes: p.q, valasz, formatum: p.fmt, tipp: p.hint, megoldas: p.sol };
}
function wrap(G) { const out = {}; for (const [id, g] of Object.entries(G)) out[id] = { nev: g.name, general() { return conv(g.make()); } }; return out; }
/* a 7.-es interaktív elemek stílusa (egyszer kerül be az oldalba) */
if (!document.getElementById('m7-stilus')) { const st = document.createElement('style'); st.id = 'm7-stilus'; st.textContent = `
.choices .btn{min-width:0}
table.mini{min-width:0}
table.mini th,table.mini td{text-align:center;font-family:var(--f-mono);font-variant-numeric:tabular-nums;padding:6px 12px;white-space:nowrap}
table.mini th:first-child,table.mini td:first-child{color:var(--muted)}
.ctrl table.mini th,.ctrl table.mini td{padding:4px 7px;font-size:.85rem}
.prob .tbl{margin-top:6px}
.nl{display:flex;flex-direction:column;gap:10px}
.nl input{width:min(520px,100%) !important}
.nlbox{width:100%;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--card)}
.nlbox canvas{display:block;width:100%}
.prose ol{margin:.3rem 0;padding-left:1.3rem}`; document.head.appendChild(st); }
window.M7 = { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, FMT7, sf, tbl,
  randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, wrap, $, esc };
})();

Tananyag.kurzus({
  cim: 'Matek 7',
  alcim: '7. évfolyam · Sokszínű matematika 7. (Mozaik)',
  jelek: 'a/b · 0,375 · 0,3̇ · x : y · p%',   // a fejléc fölötti jelsor (elhagyható)
  temakorok: [
    {
      id: 'rac',
      cim: 'Racionális számok, arányosság, százalék',
      mappa: 'racionalis-arany-szazalek',
      cukorkaNyitashoz: 3,          // ennyi cukorkába kerül a következő fejezet; elhagyható (akkor a config.js értéke)
      proba: { feladatszam: 12 },   // próba-témazáró: ennyi feladat a témakör fejezeteiből
      fejezetek: [
        '01-alakok.js',
        '02-szamegyenes.js',
        '03-muveletek.js',
        '04-sorrend.js',
        '05-aranyossag.js',
        '06-szazalek.js'
      ]
    }
  ]
});
