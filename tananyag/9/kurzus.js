/*
 * 9. évfolyam – tananyag-leíró (Sokszínű matematika 9., Mozaik; Sokszínű matematika feladatgyűjtemény 9–10;
 * OH Matematika 9. (NAT 2020); Maxim Matematika 9.)
 * A fájl elején a 9.-es fejezetek közös segédfüggvényei vannak (window.M9), alatta a tananyag leírása.
 * A fejezetek SORRENDJE egyben a megnyitási sorrend is.
 */
(function () {
/* ---------- véletlen ---------- */
const R0 = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
function keverd(t) { const a = t.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* k darab különböző egész [a; b]-ből (kizárt értékek nélkül) */
function kulonbozo(k, a, b, kiz = []) { const out = []; let g = 0; while (out.length < k && g++ < 500) { const x = R(a, b); if (!out.includes(x) && !kiz.includes(x)) out.push(x); } return out; }
/* feleletválasztós kérdés: a helyes válasz és a rossz válaszok összekeverve → { valasztas, helyes } */
function valaszt(jo, rosszak) { const t = keverd([jo, ...rosszak]); return { valasztas: t, helyes: t.indexOf(jo) }; }

/* ---------- törtek (F objektumok: { n, d }) ---------- */
const isF = c => c && typeof c === 'object';
const toF = c => isF(c) ? F(c.n, c.d) : F(c, 1);
const val = c => isF(c) ? c.n / c.d : c;
const fsub = (a, b) => fadd(toF(a), F(-toF(b).n, toF(b).d));
const fmul = (a, b) => { a = toF(a); b = toF(b); return F(a.n * b.n, a.d * b.d); };
const fdiv = (a, b) => { a = toF(a); b = toF(b); return F(a.n * b.d, a.d * b.n); };
const fsum = (...t) => t.reduce((s, x) => fadd(s, toF(x)), F(0));
/* abszolút érték TeX-alakja (egész, tizedes vagy tört) */
function absT(c) { if (isF(c)) { const n = Math.abs(c.n); return c.d === 1 ? String(n) : T`\frac{${n}}{${c.d}}`; } return nt(Math.abs(c)); }
/* szám TeX-ben, előjellel */
function sz(c) { if (isF(c)) return ft(F(c.n, c.d)); return nt(c); }
/* negatív szám vagy tört zárójelben (szorzásnál, hatványozásnál, behelyettesítésnél) */
function zj(c) { return val(c) < 0 || (isF(c) && c.d !== 1) ? T`\left(${sz(c)}\right)` : sz(c); }
/* csak a negatív szám kerül zárójelbe */
function zjn(c) { return val(c) < 0 ? T`\left(${sz(c)}\right)` : sz(c); }
/* előjeles tag összeghez: +3, -5 (0 esetén üres) */
function el(c) { const v = val(c); return v === 0 ? '' : (v > 0 ? '+' : '-') + absT(c); }

/* ---------- egy- és többváltozós egytagú kifejezések ---------- */
/* változórész: { a: 2, b: 1 } → a^{2}b; a sorrend az objektum sorrendje */
function valtozoT(vars) { return Object.entries(vars || {}).filter(([, e]) => e !== 0).map(([b, e]) => e === 1 ? b : `${b}^{${e}}`).join(''); }
/* egytagú kifejezés: együttható (szám vagy tört) + változórész */
function tagT(c, vars) { const x = val(c), v = valtozoT(vars); if (x === 0) return '0'; if (!v) return sz(c); return (x < 0 ? '-' : '') + (Math.abs(x) === 1 ? '' : absT(c)) + v; }
/* több tag összege: [[c, vars], …] vagy kész TeX-tagok; a 0 együtthatójú tagok kimaradnak */
function tagokT(lista) {
  let s = '';
  for (const t of lista) { const x = Array.isArray(t) ? tagT(t[0], t[1]) : t; if (x === '0' || x === '') continue; s += (s && x[0] !== '-' ? '+' : '') + x; }
  return s || '0';
}

/* ---------- egyváltozós polinomok: együtthatók NÖVEKVŐ fokszám szerint (p[i] = xⁱ együtthatója) ---------- */
const pTrim = p => { const q = p.slice(); while (q.length > 1 && q[q.length - 1] === 0) q.pop(); return q; };
const pAdd = (p, q) => pTrim(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => (p[i] || 0) + (q[i] || 0)));
const pScale = (p, k) => pTrim(p.map(c => c * k));
const pSub = (p, q) => pAdd(p, pScale(q, -1));
const pMul = (p, q) => { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return pTrim(r); };
const pPow = (p, n) => { let r = [1]; for (let i = 0; i < n; i++) r = pMul(r, p); return r; };
const pEval = (p, x) => p.reduce((s, c, i) => s + c * x ** i, 0);
const pDeg = p => pTrim(p).length - 1;
/* TeX: csökkenő fokszám szerint rendezve */
function pT(p, v = 'x') {
  const t = pTrim(p); let s = '';
  for (let i = t.length - 1; i >= 0; i--) {
    const c = t[i]; if (c === 0) continue;
    const vp = i === 0 ? '' : i === 1 ? v : `${v}^{${i}}`;
    const co = (Math.abs(c) === 1 && i > 0) ? '' : String(Math.abs(c));
    s += (c < 0 ? '-' : (s ? '+' : '')) + co + vp;
  }
  return s || '0';
}
/* ax + b alakú (lineáris) kifejezés TeX-ben */
const linT = (a, b, v = 'x') => pT([b, a], v);
/* zárójelezett lineáris tényező: (2x-3) */
const zlinT = (a, b, v = 'x') => `(${linT(a, b, v)})`;

/* ---------- számelmélet ---------- */
function primTenyezok(n) { const out = []; let p = 2; n = Math.abs(n); while (n > 1 && p * p <= n) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) out.push([p, e]); p++; } if (n > 1) out.push([n, 1]); return out; }
/* prímtényezős alak TeX-ben: 2^{3}\cdot 3^{2}\cdot 5 */
const primT = n => primTenyezok(n).map(([p, e]) => e === 1 ? String(p) : `${p}^{${e}}`).join(T`\cdot `);
const kitevo = (n, p) => { let e = 0; while (n % p === 0 && n) { n /= p; e++; } return e; };
const osztokSzama = n => primTenyezok(n).reduce((s, [, e]) => s * (e + 1), 1);
const osztok = n => { const o = []; for (let d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; };
const prim = n => n >= 2 && primTenyezok(n).length === 1 && primTenyezok(n)[0][1] === 1;
const lkkt = (a, b) => a / gcd(a, b) * b;
const lnkoT = (...t) => t.reduce((s, x) => gcd(s, x));
const lkktT = (...t) => t.reduce((s, x) => lkkt(s, x));
/* hatvány maradéka (BigInt, nagy kitevőre is pontos) */
function hatvMod(a, e, m) { let r = 1n, b = BigInt(a) % BigInt(m), k = BigInt(e); const M = BigInt(m); if (b < 0n) b += M; while (k > 0n) { if (k & 1n) r = r * b % M; b = b * b % M; k >>= 1n; } return Number(r); }
const nagyHatv = (a, e) => BigInt(a) ** BigInt(e);

/* ---------- számrendszerek ---------- */
const toBase = (n, b) => n.toString(b).toUpperCase();
const fromBase = (s, b) => parseInt(s, b);
/* alsó indexes számrendszerbeli szám TeX-ben: 1011_{2} */
const alapT = (s, b) => T`${s}_{${b}}`;
/* helyiértékes kifejtés TeX-ben: 2\cdot 5^3+1\cdot 5^2+… */
function kifejtesT(s, b) { const n = s.length; return s.split('').map((d, i) => ({ d, k: n - 1 - i })).filter(x => x.d !== '0').map(x => x.k === 0 ? x.d : x.k === 1 ? T`${x.d}\cdot ${b}` : T`${x.d}\cdot ${b}^{${x.k}}`).join('+'); }

/* ---------- normálalak ---------- */
/* x = a·10^k, 1 ≤ |a| < 10; a-t 10 értékes jegyre kerekítve */
function normal(x) { if (x === 0) return { a: 0, k: 0 }; let k = Math.floor(Math.log10(Math.abs(x))); let a = +(x / 10 ** k).toPrecision(10); if (Math.abs(a) >= 10) { a = +(a / 10).toPrecision(10); k++; } if (Math.abs(a) < 1) { a = +(a * 10).toPrecision(10); k--; } return { a, k }; }
const normalT = (a, k) => T`${nt(a)}\cdot 10^{${k}}`;
/* tizedes tört kiírása tudományos jelölés nélkül, ezres tagolással (TeX) */
function tizedesT(x) {
  const neg = x < 0; x = Math.abs(x);
  let s = x >= 1e-7 && x < 1e21 ? x.toFixed(12).replace(/\.?0+$/, '') : String(x);
  if (/e/i.test(s)) { const [m, e] = s.split(/e/i); const k = +e; const [i, f = ''] = m.split('.'); const dig = i + f; if (k < 0) s = '0.' + '0'.repeat(-k - 1) + dig; else s = (dig + '0'.repeat(Math.max(0, k - f.length))).replace(/^0+(?=\d)/, ''); }
  let [ip, fp = ''] = s.split('.');
  ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  fp = fp.replace(/(\d{3})(?=\d)/g, '$1\\,');
  return (neg ? '-' : '') + ip + (fp ? '{,}' + fp : '');
}

/* ---------- magyar toldalékok számok után ---------- */
function az(n) {
  n = Math.round(n); if (n < 0) return 'a';
  if (n >= 1000) { const t = Math.floor(n / 1000) % 1000; return n >= 1e6 ? az(Math.floor(n / 1e6)) : (t === 1 ? 'az' : az(t)); }
  if (n >= 100) { const h = Math.floor(n / 100); return h === 5 ? 'az' : 'a'; }
  if (n >= 10) return Math.floor(n / 10) === 5 ? 'az' : 'a';
  return n === 1 || n === 5 ? 'az' : 'a';
}
const Az = n => az(n) === 'az' ? 'Az' : 'A';
function utolsoSzo(n) { n = Math.abs(Math.round(n)); if (n === 0) return 'nulla'; if (n % 10) return ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc'][n % 10];
  if (n % 100) return ['', 'tíz', 'húsz', 'harminc', 'negyven', 'ötven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'][(n / 10) % 10]; if (n % 1000) return 'száz'; return n % 1e6 ? 'ezer' : 'millió'; }
const VEL = { nulla: 'val', egy: 'gyel', 'kettő': 'vel', 'három': 'mal', 'négy': 'gyel', 'öt': 'tel', hat: 'tal', 'hét': 'tel', nyolc: 'cal', kilenc: 'cel', 'tíz': 'zel', 'húsz': 'szal', harminc: 'cal', negyven: 'nel', 'ötven': 'nel', hatvan: 'nal', hetven: 'nel', nyolcvan: 'nal', kilencven: 'nel', 'száz': 'zal', ezer: 'rel', 'millió': 'val' };
const SZOR = { nulla: 'o', egy: 'e', 'kettő': 'e', 'három': 'o', 'négy': 'e', 'öt': 'ö', hat: 'o', 'hét': 'e', nyolc: 'o', kilenc: 'e', 'tíz': 'e', 'húsz': 'o', harminc: 'o', negyven: 'e', 'ötven': 'e', hatvan: 'o', hetven: 'e', nyolcvan: 'o', kilencven: 'e', 'száz': 'o', ezer: 'e', 'millió': 'o' };
/* 12-vel, 13-mal, 20-szal */
const vel = n => `${n}-${VEL[utolsoSzo(n)]}`;
/* 3-szor, 5-ször */
const szer = n => `${n}-${{ e: 'szer', o: 'szor', 'ö': 'ször' }[SZOR[utolsoSzo(n)]]}`;
/* 3-as, 5-ös, 2-es számrendszer */
const ASZ = { nulla: 'ás', egy: 'es', 'kettő': 'es', 'három': 'as', 'négy': 'es', 'öt': 'ös', hat: 'os', 'hét': 'es', nyolc: 'as', kilenc: 'es', 'tíz': 'es', 'húsz': 'as', harminc: 'as', negyven: 'es', 'ötven': 'es', hatvan: 'as', hetven: 'es', nyolcvan: 'as', kilencven: 'es', 'száz': 'as', ezer: 'es', 'millió': 'os' };
const asos = n => `${n}-${ASZ[utolsoSzo(n)]}`;
/* 3-nak, 5-nek */
const nak = n => `${n}-${['egy', 'kettő', 'négy', 'öt', 'hét', 'kilenc', 'tíz', 'negyven', 'ötven', 'hetven', 'ezer'].includes(utolsoSzo(n)) ? 'nek' : 'nak'}`;

/* ---------- HTML-biztos képletek (a „<” után szóköz, ha betű követi) ---------- */
const MATH = /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;
const lt = s => typeof s === 'string' ? s.replace(MATH, m => m.replace(/<(?=[A-Za-z|!?\/])/g, '< ')) : s;
function tisztitP(p) { if (!p) return p; ['kerdes', 'tipp', 'allitas', 'miert'].forEach(k => { if (p[k] != null) p[k] = lt(p[k]); }); if (Array.isArray(p.megoldas)) p.megoldas = p.megoldas.map(lt); return p; }
function tisztit(d) {
  ['bevezeto', 'elmelet'].forEach(k => { d[k] = lt(d[k]); });
  if (d.mintapelda) { d.mintapelda.feladat = lt(d.mintapelda.feladat); d.mintapelda.lepesek = (d.mintapelda.lepesek || []).map(lt); }
  if (Array.isArray(d.igazHamis)) d.igazHamis = d.igazHamis.map(x => typeof x.general === 'function' ? Object.assign({}, x, { general() { return tisztitP(x.general.call(x)); } }) : tisztitP(Object.assign({}, x)));
  Object.values(d.feladatok || {}).forEach(g => { const eredeti = g.general; g.general = function () { return tisztitP(eredeti.call(this)); }; });
  return d;
}

/* kérdés: utasítás + kiemelt képlet */
const kerd = (utasitas, tex) => tex ? T`<p>${utasitas}</p>\[${tex}\]` : `<p>${utasitas}</p>`;

const FMT9 = { egesz: 'egész szám', tort: 'egész szám vagy tört, pl. 3/2', halmaz: 'egy vagy több szám, pontosvesszővel: 1; 2 (ha nincs: nincs)',
  szam: 'szám (egész, tört vagy tizedes tört)', tizedes: 'tizedes tört, pl. 3,75', szamjegy: 'a számjegyek egymás után, pl. 10213', nemneg: 'nemnegatív egész szám' };

window.M9 = { R0, keverd, kulonbozo, valaszt, isF, toF, val, fsub, fmul, fdiv, fsum, absT, sz, zj, zjn, el, valtozoT, tagT, tagokT,
  pTrim, pAdd, pScale, pSub, pMul, pPow, pEval, pDeg, pT, linT, zlinT,
  primTenyezok, primT, kitevo, osztokSzama, osztok, prim, lkkt, lnkoT, lkktT, hatvMod, nagyHatv,
  toBase, fromBase, alapT, kifejtesT, normal, normalT, tizedesT, az, Az, vel, szer, asos, nak, tisztit, kerd, FMT9 };
})();

Tananyag.kurzus({
  cim: 'Matek 9',
  alcim: '9. évfolyam · Sokszínű matematika 9. (Mozaik)',
  jelek: 'aⁿ · a⁻ⁿ · k·10ⁿ · (a ± b)² · (a; b) · [a; b] · 1011₂',
  // Évfolyamszintű szabályok (elhagyhatók – akkor a config.js értéke érvényes):
  joValaszCukorkahoz: 5,     // egy cukorkához minden feladattípusból ennyi új jó megoldás kell
  // cukorkaNyitashoz: 1,
  // streakNapiMin: 1,
  temakorok: [
    {
      id: 'alg',
      cim: 'Algebra és számelmélet',
      mappa: 'algebra-szamelmelet',
      cukorkaNyitashoz: 1,
      proba: { feladatszam: 15 },
      fejezetek: [
        '01-betuk.js',
        '02-hatvanyozas.js',
        '03-egesz-kitevo.js',
        '04-normalalak.js',
        '05-polinomok.js',
        '06-nevezetes-szorzatok.js',
        '07-szorzatta-alakitas.js',
        '08-algebrai-tortek.js',
        '09-oszthatosag.js',
        '10-lnko-lkkt.js',
        '11-szamrendszerek.js'
      ]
    }
    // , { id: 'fv', cim: 'Függvények', mappa: 'fuggvenyek', fejezetek: ['01-koordinata.js', …] }
  ]
});
