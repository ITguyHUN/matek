/*
 * Matek gyakorló – közös segédfüggvények a feladatgenerátorokhoz és a válaszellenőrzéshez.
 * A fejezetfájlok ezeket globálisan használják (T, R, P, F, ft, nt …). Leírás: tananyag/README.md
 */
const T = String.raw;
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const P = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; };
function F(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; }
const fv = f => f.n / f.d;
const fadd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
function fpow(f, e) { return e >= 0 ? F(f.n ** e, f.d ** e) : F(f.d ** (-e), f.n ** (-e)); }
function ft(f) { if (f.d === 1) return String(f.n); return (f.n < 0 ? '-' : '') + T`\frac{${Math.abs(f.n)}}{${f.d}}`; }
function nt(x) { return String(+(+x).toFixed(10)).replace('.', '{,}'); }
function hu(x, dec) { const s = dec == null ? String(+(+x).toFixed(10)) : (+x).toFixed(dec); return s.replace('-', '−').replace('.', ','); }
function big(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function bigT(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'); }
const xs = (s, v = 'x') => s === 0 ? v : (s > 0 ? `${v}+${s}` : `${v}-${-s}`);
const pt = v => v === 0 ? '' : (v > 0 ? `+${v}` : `-${-v}`);
const mulX = (i, e) => i === 1 ? (e === 'x' ? 'x' : e) : (e === 'x' ? `${i}x` : `${i}(${e})`);
const lin = (p, q) => (p === 1 ? 'x' : `${p}x`) + (q === 0 ? '' : q > 0 ? `+${q}` : `-${-q}`);
const yk = i => i === 1 ? 'y' : i === -1 ? '-y' : `${i}y`;
function lgOf(b) { return b === 10 ? T`\lg` : T`\log_{${b}}`; }
function linCoef(B, term) { /* -B·term */ if (B === 0) return ''; if (B > 0) return B === 1 ? `-${term}` : `-${B}${term}`; return B === -1 ? `+${term}` : `+${-B}${term}`; }
const cst = C => C === 0 ? '' : (C > 0 ? `+${C}` : `-${-C}`);
const FMT = { frac: 'egész vagy tört', dec: 'tizedes tört', set: 'egy vagy több szám', int: 'egész szám' };


/* ===== Válasz értelmezése és ellenőrzése ===== */
function valaszErtelmez(str) {
  let s = String(str).trim().toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, ' ');
  if (!s) return null;
  s = s.replace(/^[a-z]\s*[=∈]\s*/, '');
  const parts = s.split(/;|\bés\b|\bvagy\b|\|/).map(t => t.trim().replace(/^[a-z]_?\d?\s*=\s*/, '')).filter(Boolean);
  const out = []; const meta = [];
  for (const p00 of parts) {
    if (/^nincs/.test(p00) || p00 === 'ø' || p00 === '∅') { out.push('nincs'); meta.push({}); continue; }
    // mértékegység, százalékjel a végén (pl. „12 000 Ft”, „37,5%”, „1,6 km”)
    const p0 = p00.replace(/\s*(forint|ft|dkg|kg|km|cm|mm|m³|m3|m|g|liter|l|óra|nap|perc|hónap|oldal|db|fok|°|%)\.?$/, '').trim() || p00;
    let m = p0.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);            // vegyes szám: 2 1/4
    if (m) { const v = (m[1] === '-' ? -1 : 1) * (+m[2] + (+m[3]) / (+m[4])); out.push(v); meta.push({ tort: true, egysz: gcd(+m[3], +m[4]) === 1 && +m[3] < +m[4] }); continue; }
    m = p0.replace(/\s/g, '').match(/^([+-]?)(\d*)[.,](\d*)\((\d+)\)$/);  // szakaszos tizedes tört: 0,(3) vagy 1,2(3)
    if (m) { const pre = m[3], rep = m[4]; const v = (m[1] === '-' ? -1 : 1) * (+(m[2] || 0) + (pre ? +pre / 10 ** pre.length : 0) + (+rep) / ((10 ** rep.length - 1) * 10 ** pre.length)); out.push(v); meta.push({ szakaszos: true }); continue; }
    let p = p0.replace(/\s/g, ''); let pm = false;
    if (p.startsWith('±') || p.startsWith('+-')) { pm = true; p = p.replace(/^(±|\+-)/, ''); }
    const num = t => { t = t.replace(',', '.'); if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return NaN; return parseFloat(t); };
    let v, mt = { tort: false };
    if (p.includes('/')) { const [a, b] = p.split('/'); const A = num(a), B = num(b); v = A / B; mt = { tort: true, egysz: Number.isInteger(A) && Number.isInteger(B) && B > 0 && gcd(A, B) === 1 }; } else v = num(p);
    if (!isFinite(v)) return { hiba: p00 };
    out.push(v); meta.push(mt); if (pm) { out.push(-v); meta.push(mt); }
  }
  out.meta = meta;
  return out;
}
function valaszEllenoriz(valasz, ertelmezett) {
  if (!ertelmezett || ertelmezett.hiba) return { ok: false, rossz: true };
  // „Írj egy számot a két szám közé!” típus: bármely szám jó, ami szigorúan a két érték között van
  if (valasz.kozott) { if (ertelmezett.length !== 1 || typeof ertelmezett[0] !== 'number') return { ok: false, darab: true, van: ertelmezett.length, kell: 1 };
    const [lo, hi] = valasz.kozott; return { ok: ertelmezett[0] > lo + 1e-12 && ertelmezett[0] < hi - 1e-12 }; }
  if (valasz.nincs) return { ok: ertelmezett.length === 1 && ertelmezett[0] === 'nincs' };
  if (ertelmezett.includes('nincs')) return { ok: false };
  const want = valasz.ertekek.slice().sort((a, b) => a - b), got = ertelmezett.slice().sort((a, b) => a - b);
  const close = (a, b) => valasz.tolRel ? Math.abs(a - b) <= valasz.tolRel * Math.abs(b) + 1 : Math.abs(a - b) <= (valasz.tol || 1e-6);
  const uniq = []; for (const g of got) if (!uniq.some(u => close(u, g))) uniq.push(g);
  if (uniq.length !== want.length) return { ok: false, darab: true, van: uniq.length, kell: want.length };
  const ok = want.every((w, i) => close(uniq[i], w));
  // kötelező alak (forma: 'tizedes' vagy 'tort'): jó érték, de nem a kért alakban → nem számít hibának, csak szólunk
  if (ok && valasz.forma && ertelmezett.meta && ertelmezett.meta.length === 1) {
    const mt = ertelmezett.meta[0];
    if (valasz.forma === 'tizedes' && mt.tort) return { ok: false, forma: 'tizedes' };
    if (valasz.forma === 'tort' && !mt.tort && !Number.isInteger(want[0])) return { ok: false, forma: 'tort' };
    if (valasz.forma === 'tort' && mt.tort && !mt.egysz) return { ok: false, forma: 'egyszerusit' };
  }
  return { ok };
}
/* A helyes válasz olvasható alakja (tanári nézethez, naplóhoz). */
function valaszSzoveg(valasz) {
  if (!valasz) return '';
  if (valasz.valasztas) return valasz.valasztas[valasz.helyes];
  if (valasz.nincs) return 'nincs';
  if (valasz.kozott) return valasz.pelda ? `pl. ${valasz.pelda}` : `${hu(valasz.kozott[0], 4)} és ${hu(valasz.kozott[1], 4)} között`;
  if (valasz.forma === 'tizedes') return (valasz.ertekek || []).map(x => hu(x)).join('; ');
  const f = x => {
    if (Math.abs(x - Math.round(x)) < 1e-9) return hu(Math.round(x));
    // lánctört-közelítés: a legegyszerűbb tört, amely pontosan megadja az értéket
    let h0 = 1, h1 = 0, k0 = 0, k1 = 1, y = x;
    for (let i = 0; i < 25; i++) {
      const a = Math.floor(y);
      [h0, h1] = [a * h0 + h1, h0]; [k0, k1] = [a * k0 + k1, k0];
      if (k0 > 1e6) break;
      if (Math.abs(h0 / k0 - x) < 1e-12 * Math.max(1, Math.abs(x))) return `${h0}/${k0}`.replace('-', '−');
      if (y - a < 1e-15) break;
      y = 1 / (y - a);
    }
    return hu(+x.toFixed(4));
  };
  return (valasz.ertekek || []).map(f).join('; ');
}
