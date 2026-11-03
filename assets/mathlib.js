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
  const out = [];
  for (const p0 of parts) {
    if (/^nincs/.test(p0) || p0 === 'ø' || p0 === '∅') { out.push('nincs'); continue; }
    let p = p0.replace(/\s/g, ''); let pm = false;
    if (p.startsWith('±') || p.startsWith('+-')) { pm = true; p = p.replace(/^(±|\+-)/, ''); }
    const num = t => { t = t.replace(',', '.'); if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return NaN; return parseFloat(t); };
    let v;
    if (p.includes('/')) { const [a, b] = p.split('/'); v = num(a) / num(b); } else v = num(p);
    if (!isFinite(v)) return { hiba: p0 };
    out.push(v); if (pm) out.push(-v);
  }
  return out;
}
function valaszEllenoriz(valasz, ertelmezett) {
  if (!ertelmezett || ertelmezett.hiba) return { ok: false, rossz: true };
  if (valasz.nincs) return { ok: ertelmezett.length === 1 && ertelmezett[0] === 'nincs' };
  if (ertelmezett.includes('nincs')) return { ok: false };
  const want = valasz.ertekek.slice().sort((a, b) => a - b), got = ertelmezett.slice().sort((a, b) => a - b);
  const close = (a, b) => valasz.tolRel ? Math.abs(a - b) <= valasz.tolRel * Math.abs(b) + 1 : Math.abs(a - b) <= (valasz.tol || 1e-6);
  const uniq = []; for (const g of got) if (!uniq.some(u => close(u, g))) uniq.push(g);
  if (uniq.length !== want.length) return { ok: false, darab: true, van: uniq.length, kell: want.length };
  return { ok: want.every((w, i) => close(uniq[i], w)) };
}
/* A helyes válasz olvasható alakja (tanári nézethez, naplóhoz). */
function valaszSzoveg(valasz) {
  if (!valasz) return '';
  if (valasz.valasztas) return valasz.valasztas[valasz.helyes];
  if (valasz.nincs) return 'nincs';
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
