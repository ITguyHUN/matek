/*
 * 1. fejezet – Hatványozás egész kitevőre
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.negkitevo = { nev: 'Negatív kitevő', general() {
    const t = R(0, 3); let tex, val, sol;
    if (t === 0) { const a = P([2, 3, 4, 5, 6, 7, 10]); const n = a === 10 ? R(1, 5) : a <= 3 ? R(1, 5) : R(1, 3);
      tex = T`${a}^{-${n}}`; val = F(1, a ** n); sol = [T`\[${a}^{-${n}}=\frac{1}{${a}^{${n}}}=${ft(val)}\]`]; }
    else if (t === 1) { const [p, q] = P([[2, 3], [1, 2], [3, 4], [2, 5], [3, 5], [1, 3], [4, 3], [5, 2]]); const n = R(1, 3);
      tex = T`\left(\frac{${p}}{${q}}\right)^{-${n}}`; val = F(q ** n, p ** n);
      sol = [T`\[\left(\frac{${p}}{${q}}\right)^{-${n}}=\left(\frac{${q}}{${p}}\right)^{${n}}=${ft(val)}\]`, 'Negatív kitevőnél a tört megfordul (reciprok), a kitevő pozitív lesz.']; }
    else if (t === 2) { const a = P([2, 3, 5]); const n = R(1, 3); tex = T`(-${a})^{-${n}}`; val = F((-1) ** n, a ** n);
      sol = [T`\[(-${a})^{-${n}}=\frac{1}{(-${a})^{${n}}}=\frac{1}{${(-a) ** n}}=${ft(val)}\]`, n % 2 ? 'Páratlan kitevő esetén a negatív alap hatványa negatív.' : 'Páros kitevő esetén a negatív alap hatványa pozitív.']; }
    else { const a = R(2, 6); let b = R(2, 9); while (b === a) b = R(2, 9); const m = P([1, 1, 2]), n = m === 2 ? 1 : P([1, 2]); const op = P(['+', '-']);
      const A = a ** m, B = b ** n; val = op === '+' ? F(A + B, A * B) : F(B - A, A * B);
      tex = T`${a}^{-${m}}${op}${b}^{-${n}}`;
      sol = [T`\[${a}^{-${m}}${op}${b}^{-${n}}=\frac{1}{${A}}${op}\frac{1}{${B}}=${ft(val)}\]`, 'Közös nevezőre hozunk, és egyszerűsítünk, ha lehet.']; }
    return { kerdes: T`<p>Számítsd ki!</p>\[${tex}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: T`A negatív kitevő reciprokot jelent: \(a^{-n}=\dfrac{1}{a^n}\). Ettől a szám nem lesz negatív!`, megoldas: sol };
  } };

  feladatok.egyhatvany = { nev: 'Közös alapra hozás', general() {
    const p = P([2, 3]); const B = p === 2 ? [[2, 1], [4, 2], [8, 3], [16, 4]] : [[3, 1], [9, 2], [27, 3]];
    const nz = (a, b) => { let e = 0; while (e === 0) e = R(a, b); return e; };
    const b1 = P(B), b2 = P(B), b3 = P(B); const e1 = nz(-2, 3), e2 = nz(-2, 3), e3 = nz(-2, 3);
    const k1 = b1[1] * e1, k2 = b2[1] * e2, k3 = b3[1] * e3, k = k1 + k2 - k3;
    return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\frac{${b1[0]}^{${e1}}\cdot ${b2[0]}^{${e2}}}{${b3[0]}^{${e3}}}=${p}^{\,\square}\]`,
      valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: T`Írd fel mindegyik alapot \(${p}\) hatványaként (pl. \(${B[2][0]}=${p}^{${B[2][1]}}\)). Szorzásnál a kitevők összeadódnak, osztásnál kivonódnak.`,
      megoldas: [T`\[\frac{${p}^{${k1}}\cdot ${p}^{${k2}}}{${p}^{${k3}}}=${p}^{${k1}+(${k2})-(${k3})}=${p}^{${k}}\]`, T`A keresett kitevő: \(${k}\).`] };
  } };

  feladatok.kiemeles = { nev: 'Kiemelés', general() {
    const p = P([2, 3, 5]); const v = P(['n', 'n', 'k', 'x']);
    const db = R(0, 2) === 0 ? 3 : 2; const pool = p === 5 ? [-1, 0, 1, 2] : [-1, 0, 1, 2, 3];
    const es = []; while (es.length < db) { const e = P(pool); if (!es.includes(e)) es.push(e); } es.sort((a, b) => b - a);
    const sg = es.map((e, i) => i === 0 ? 1 : P([1, -1]));
    const m = Math.min(...es); const d = R(0, 2) === 0 ? m - 1 : m;   // a nevező kitevője (n+d)
    const ex = e => e === 0 ? v : e > 0 ? `${v}+${e}` : `${v}-${-e}`;
    const num = es.map((e, i) => (i === 0 ? '' : sg[i] > 0 ? '+' : '-') + T`${p}^{${ex(e)}}`).join('');
    const val = es.reduce((s, e, i) => s + sg[i] * p ** (e - d), 0);
    if (val === 0) return this.general();
    const inner = es.map((e, i) => (i === 0 ? '' : sg[i] > 0 ? '+' : '-') + (e - d === 0 ? "1" : e - d === 1 ? String(p) : T`${p}^{${e - d}}`)).join('');
    const innerV = es.map((e, i) => (i === 0 ? '' : sg[i] > 0 ? '+' : '-') + p ** (e - d)).join('');
    return { kerdes: T`<p>Egyszerűsíts, és számítsd ki! (\(${v}\) tetszőleges egész szám)</p>\[\frac{${num}}{${p}^{${ex(d)}}}\]`,
      valasz: { ertekek: [val] }, formatum: 'egész szám',
      tipp: T`Összeget nem lehet „összevonni”, de ki lehet emelni: emeld ki a számlálóból a nevezőben álló \(${p}^{${ex(d)}}\)-t, utána egyszerűsíts.`,
      megoldas: [T`\[\frac{${p}^{${ex(d)}}\left(${inner}\right)}{${p}^{${ex(d)}}}=${innerV}=${val}\]`] };
  } };

  /* ---- Normálalak ---- */
  function normSzam(M, k) { // M: egész mantissza-jegyek (pl. 52 → 5,2), az érték M/10^(len-1) · 10^k
    const s = String(M), e = k - (s.length - 1);
    let ip, dp;
    if (e >= 0) { ip = s + '0'.repeat(e); dp = ''; }
    else if (-e < s.length) { ip = s.slice(0, s.length + e); dp = s.slice(s.length + e); }
    else { ip = '0'; dp = '0'.repeat(-e - s.length) + s; }
    const grp = ip.length > 4 ? ip.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : ip;
    return grp + (dp ? '{,}' + dp : '');
  }
  const mant = M => { const s = String(M); return s.length === 1 ? s : s[0] + '{,}' + s.slice(1); };
  feladatok.normalalak = { nev: 'Normálalak', general() {
    const kind = R(0, 3);
    if (kind === 0) { // szám → kitevő
      const M = P([R(1, 9), R(11, 99), R(11, 99), R(101, 999)]); if (M % 10 === 0) return this.general();
      let k; do { k = R(-7, 9); } while (k === 0);
      const val = normSzam(M, k);
      return { kerdes: T`<p>Írd fel normálalakban! Melyik szám kerül a négyzet helyére?</p>\[${val}=${mant(M)}\cdot 10^{\,\square}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: T`Normálalak: \(a\cdot 10^{k}\), ahol \(1\le a<10\). Számold meg, hány helyiértékkel kell a tizedesvesszőt elmozdítani. Ha a szám 1-nél kisebb, a kitevő negatív.`,
        megoldas: [T`A tizedesvesszőt ${Math.abs(k)} helyiértékkel kell ${k > 0 ? 'balra' : 'jobbra'} vinni, hogy \(${mant(M)}\) legyen belőle:`, T`\[${val}=${mant(M)}\cdot 10^{${k}}\]`] }; }
    // műveletek normálalakban: a mantisszát megadjuk, a kitevőt kérdezzük
    const A = R(11, 95), B = R(11, 95); if (A % 10 === 0 || B % 10 === 0) return this.general();
    const p = R(-9, 9), q = R(-9, 9);
    if (kind === 1) { // szorzás
      let c = A * B / 100, kk = p + q; if (c >= 10) { c /= 10; kk += 1; }
      return { kerdes: T`<p>Végezd el a műveletet, és add meg az eredményt normálalakban! Melyik szám kerül a négyzet helyére?</p>\[\left(${nt(A / 10)}\cdot 10^{${p}}\right)\cdot\left(${nt(B / 10)}\cdot 10^{${q}}\right)=${nt(+c.toFixed(6))}\cdot 10^{\,\square}\]`,
        valasz: { ertekek: [kk] }, formatum: 'egész szám',
        tipp: T`A mantisszákat összeszorzod, a 10 kitevőit összeadod. Ha a szorzat 10 vagy nagyobb, még egyszer normálalakra kell hozni.`,
        megoldas: [T`\[${nt(A / 10)}\cdot ${nt(B / 10)}=${nt(A * B / 100)},\qquad 10^{${p}}\cdot 10^{${q}}=10^{${p + q}}\]`, ...(A * B / 100 >= 10 ? [T`\[${nt(A * B / 100)}\cdot 10^{${p + q}}=${nt(+c.toFixed(6))}\cdot 10^{1}\cdot 10^{${p + q}}=${nt(+c.toFixed(6))}\cdot 10^{${kk}}\]`] : [T`\[=${nt(+c.toFixed(6))}\cdot 10^{${kk}}\]`])] }; }
    if (kind === 2) { // osztás: (C·10^p) : (B·10^q), C = A*B/10 → hányados A/10 vagy ...
      const Bm = P([2, 4, 5, 8, 16, 25].filter(x => x < 10 || x === 16 || x === 25)) ; const b = Bm >= 10 ? Bm / 10 : Bm;
      const a = R(11, 95) / 10; const prod = +(a * b).toFixed(6);
      let top = prod, kp = p; if (top >= 10) { top = +(top / 10).toFixed(6); kp = p + 1; }
      // (top·10^kp) : (b·10^q) = a·10^(p-q)
      return { kerdes: T`<p>Végezd el a műveletet, és add meg az eredményt normálalakban! Melyik szám kerül a négyzet helyére?</p>\[\left(${nt(top)}\cdot 10^{${kp}}\right):\left(${nt(b)}\cdot 10^{${q}}\right)=${nt(a)}\cdot 10^{\,\square}\]`,
        valasz: { ertekek: [p - q] }, formatum: 'egész szám',
        tipp: T`A mantisszákat elosztod, a 10 kitevőit kivonod egymásból. Ha a hányados 1-nél kisebb, még normálalakra kell hozni.`,
        megoldas: [T`\[${nt(top)}:${nt(b)}=${nt(+(top / b).toFixed(6))},\qquad 10^{${kp}}:10^{${q}}=10^{${kp - q}}\]`, ...(top / b < 1 ? [T`\[${nt(+(top / b).toFixed(6))}\cdot 10^{${kp - q}}=${nt(a)}\cdot 10^{-1}\cdot 10^{${kp - q}}=${nt(a)}\cdot 10^{${p - q}}\]`] : [T`\[=${nt(a)}\cdot 10^{${p - q}}\]`])] }; }
    // hatványozás
    const a = P([2, 3, 4, 5, 1.5, 2.5, 1.2, 1.1]); const n = a >= 4 ? 2 : P([2, 3]); const r = R(-6, 6);
    let c = +(a ** n).toFixed(6), kk = r * n; if (c >= 10) { c = +(c / 10).toFixed(6); kk += 1; }
    if (r === 0) return this.general();
    return { kerdes: T`<p>Végezd el a műveletet, és add meg az eredményt normálalakban! Melyik szám kerül a négyzet helyére?</p>\[\left(${nt(a)}\cdot 10^{${r}}\right)^{${n}}=${nt(c)}\cdot 10^{\,\square}\]`,
      valasz: { ertekek: [kk] }, formatum: 'egész szám',
      tipp: T`Szorzat hatványa: \((a\cdot b)^n=a^n\cdot b^n\), és \(\left(10^{k}\right)^{n}=10^{kn}\).`,
      megoldas: [T`\[\left(${nt(a)}\cdot 10^{${r}}\right)^{${n}}=${nt(a)}^{${n}}\cdot 10^{${r * n}}=${nt(+(a ** n).toFixed(6))}\cdot 10^{${r * n}}${a ** n >= 10 ? T`=${nt(c)}\cdot 10^{${kk}}` : ''}\]`] };
  } };

  /* ---- Azonosságok változóval ---- */
  feladatok.hatvanyvalt = { nev: 'Egy hatványként (változóval)', general() {
    const v = P(['a', 'b', 'x', 'y']); const nz = () => P([-3, -2, -1, 1, 2, 3, 4]);
    const db = R(0, 1) ? 3 : 2; const fs = []; for (let i = 0; i < db; i++) fs.push({ p: nz(), q: R(0, 2) ? nz() : 1 });
    const nNum = db === 3 ? P([1, 2]) : P([1, 1, 2]); const den = fs.slice(nNum), num = fs.slice(0, nNum);
    const tx = f => f.q === 1 ? T`${v}^{${f.p}}` : T`\left(${v}^{${f.p}}\right)^{${f.q}}`;
    const numT = num.map(tx).join('\\cdot '), denT = den.map(tx).join('\\cdot ');
    const ex = num.reduce((s, f) => s + f.p * f.q, 0) - den.reduce((s, f) => s + f.p * f.q, 0);
    const tex = den.length ? T`\frac{${numT}}{${denT}}` : numT;
    const eT = f => f.p * f.q < 0 ? `(${f.p * f.q})` : String(f.p * f.q);
    const sum = num.map(eT).join('+') + den.map(f => '-' + eT(f)).join('');
    return { kerdes: T`<p>Írd fel \(${v}\) egyetlen hatványaként! (\(${v}\ne 0\)) Melyik szám kerül a négyzet helyére?</p>\[${tex}=${v}^{\,\square}\]`, valasz: { ertekek: [ex] }, formatum: 'egész szám',
      tipp: T`Hatvány hatványánál a kitevők szorzódnak, szorzásnál összeadódnak, osztásnál kivonódnak.`,
      megoldas: [T`\[${tex}=${v}^{${sum}}=${v}^{${ex}}\]`] };
  } };

  /* ---- Számolás különböző alapú hatványokkal ---- */
  feladatok.hatvanyertek = { nev: 'Értéke különböző alapokkal', general() {
    const [p, q] = P([[2, 3], [2, 5], [2, 3]]);
    const bases = [{ b: p * q, ep: 1, eq: 1 }, { b: p, ep: 1, eq: 0 }, { b: q, ep: 0, eq: 1 }, P([{ b: p * p, ep: 2, eq: 0 }, { b: q * q, ep: 0, eq: 2 }])];
    for (let t = 0; t < 200; t++) {
      const use = bases.map(B => ({ B, e: R(-3, 3), up: R(0, 1) === 1 })).filter(x => x.e !== 0);
      if (use.length < 3) continue;
      let ep = 0, eq = 0; use.forEach(x => { const s = x.up ? 1 : -1; ep += s * x.e * x.B.ep; eq += s * x.e * x.B.eq; });
      if (Math.abs(ep) > (p === 2 ? 5 : 3) || Math.abs(eq) > 2 || (ep === 0 && eq === 0)) continue;
      const up = use.filter(x => x.up), dn = use.filter(x => !x.up);
      if (!up.length || !dn.length) continue;
      const tx = x => x.e === 1 ? String(x.B.b) : T`${x.B.b}^{${x.e}}`;
      const vv = fpow(F(p), ep), ww = fpow(F(q), eq); const res = F(vv.n * ww.n, vv.d * ww.d);
      const pw = (b, e) => e === 1 ? String(b) : T`${b}^{${e}}`;
      const conv = x => { const parts = []; if (x.B.ep) parts.push(pw(p, x.B.ep * x.e)); if (x.B.eq) parts.push(pw(q, x.B.eq * x.e)); return parts.join('\\cdot '); };
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\frac{${up.map(tx).join('\\cdot ')}}{${dn.map(tx).join('\\cdot ')}}\]`, valasz: { ertekek: [fv(res)] }, formatum: FMT.frac,
        tipp: T`Bontsd fel az alapokat prímtényezőkre (pl. \(${p * q}=${p}\cdot ${q}\), \(${bases[3].b}=${bases[3].ep ? p : q}^2\)), és külön számold a \(${p}\) és a \(${q}\) kitevőjét!`,
        megoldas: [T`\[\frac{${up.map(conv).join('\\cdot ')}}{${dn.map(conv).join('\\cdot ')}}=${p}^{${ep}}\cdot ${q}^{${eq}}=${ft(res)}\]`] };
    }
    return this.general();
  } };

  /* ---- Összehasonlítás közös kitevővel ---- */
  feladatok.hatvanyrel = { nev: 'Melyik nagyobb?', general() {
    const kind = R(0, 2);
    if (kind === 2) { // közös alap: (p^i)^m vs (p^j)^n
      const p = P([2, 3]); const B = p === 2 ? [4, 8, 16, 32] : [9, 27, 81]; const ix = x => Math.round(Math.log(x) / Math.log(p));
      const a = P(B); let b = P(B); while (b === a) b = P(B); const m = R(3, 12); let n = Math.round(m * ix(a) / ix(b)) + R(-1, 1); if (n < 2) n = 2; if (n === m) return this.general();
      const L = ix(a) * m, Rr = ix(b) * n; const c = L < Rr ? 0 : L === Rr ? 1 : 2;
      return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${a}^{${m}}\;\square\;${b}^{${n}}\]`, valasz: { valasztas: ['<', '=', '>'], helyes: c },
        tipp: T`Írd fel mindkét számot \(${p}\) hatványaként.`,
        megoldas: [T`\[${a}^{${m}}=${p}^{${L}},\qquad ${b}^{${n}}=${p}^{${Rr}}\]`, T`Mivel \(${L}${['<', '=', '>'][c]}${Rr}\), ezért \(${a}^{${m}}${['<', '=', '>'][c]}${b}^{${n}}\).`] }; }
    // különböző alap, közös kitevő: a^(s k) vs b^(t k)
    const pairs = [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7], [2, 10]];
    const [a, b] = P(pairs); const s = R(1, 4), t = R(1, 3); const x = a ** s, y = b ** t; if (x === y || x > 400 || y > 400 || Math.max(x, y) / Math.min(x, y) > 2.6) return this.general();
    const k = R(3, 25); const neg = kind === 1;
    const E1 = s * k * (neg ? -1 : 1), E2 = t * k * (neg ? -1 : 1);
    let c = x < y ? 0 : 2; if (neg) c = 2 - c;
    const sw = R(0, 1) === 1;
    const L = sw ? T`${b}^{${E2}}` : T`${a}^{${E1}}`, Rt = sw ? T`${a}^{${E1}}` : T`${b}^{${E2}}`; if (sw) c = 2 - c;
    const rel = ['<', '=', '>'][c];
    const kk = neg ? -k : k;
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére? (Számológép nélkül!)</p>\[${L}\;\square\;${Rt}\]`, valasz: { valasztas: ['<', '=', '>'], helyes: c },
      tipp: T`Hozd a két hatványt azonos kitevőre: \(a^{mn}=\left(a^{m}\right)^{n}\). Azonos ${neg ? 'negatív ' : ''}kitevőnél az alapokat kell összehasonlítani.`,
      megoldas: [T`\[${a}^{${E1}}=${s === 1 ? '' : T`\left(${a}^{${s}}\right)^{${kk}}=`}${x}^{${kk}},\qquad ${b}^{${E2}}=${t === 1 ? '' : T`\left(${b}^{${t}}\right)^{${kk}}=`}${y}^{${kk}}\]`,
        neg ? T`Negatív kitevőnél a kisebb alap adja a nagyobb értéket (reciprok!). Ezért \(${L}${rel}${Rt}\).` : T`Mivel \(${Math.min(x, y)}<${Math.max(x, y)}\), ezért \(${L}${rel}${Rt}\).`] };
  } };

  Tananyag.fejezet({
    id: 'hatvany',
    cim: 'Hatványozás egész kitevőre',
    rovid: 'Hatványozás',
    bevezeto: T`A hatványazonosságok minden későbbi fejezet alapjai: a logaritmus azonosságai ezeknek a „kifordított” változatai.`,
    elmelet: T`<div class="prose"><p><b>Definíciók</b></p></div>
<div class="mathbox">\[a^n=\underbrace{a\cdot a\cdots a}_{n\ \text{tényező}},\qquad a^1=a,\qquad a^0=1\ (a\ne 0),\qquad a^{-n}=\frac{1}{a^n}\ (a\ne 0)\]</div>
<div class="prose"><p><b>Azonosságok</b> (a, b ≠ 0; n, m egész)</p></div>
<div class="mathbox">\[a^n\cdot a^m=a^{n+m}\qquad \frac{a^n}{a^m}=a^{n-m}\qquad (a^n)^m=a^{n\cdot m}\]\[(a\cdot b)^n=a^n\cdot b^n\qquad \left(\frac{a}{b}\right)^n=\frac{a^n}{b^n}\qquad \left(\frac{a}{b}\right)^{-n}=\left(\frac{b}{a}\right)^n\]</div>
<div class="prose"><p><b>Normálalak:</b> \(a\cdot 10^k\), ahol \(1\le a<10\) és \(k\) egész. Például \(0{,}00052=5{,}2\cdot 10^{-4}\), \(340\,000=3{,}4\cdot 10^{5}\).</p></div>`,
    igazHamis: [
    { allitas: T`\((-2)^4=-2^4\)`, igaz: false, miert: T`\((-2)^4=16\), de \(-2^4=-16\): a kitevő csak arra vonatkozik, ami közvetlenül előtte áll.` },
    { allitas: T`\(3^{-2}=-9\)`, igaz: false, miert: T`\(3^{-2}=\frac{1}{9}\). A negatív kitevő reciprokot jelent, nem negatív számot.` },
    { allitas: T`\(2^3\cdot 2^4=2^7\)`, igaz: true, miert: T`Azonos alapú hatványok szorzásakor a kitevők összeadódnak, az alap marad.` },
    { allitas: T`\(2^3+2^4=2^7\)`, igaz: false, miert: T`Összeget nem lehet így összevonni: \(2^3+2^4=8+16=24\), kiemeléssel \(2^3(1+2)\).` },
    { allitas: T`\((a+b)^2=a^2+b^2\)`, igaz: false, miert: T`\((a+b)^2=a^2+2ab+b^2\). A hatványozás összegre nem bontható szét.` },
    { allitas: T`\((2^3)^2=2^9\)`, igaz: false, miert: T`Hatvány hatványánál a kitevők szorzódnak: \((2^3)^2=2^6=64\). A \(2^{3^2}=2^9\) más kifejezés.` },
    { allitas: T`\(5^{-1}\cdot 5^{1}=0\)`, igaz: false, miert: T`\(5^{-1}\cdot 5^{1}=5^{0}=1\).` },
    { allitas: T`\(0{,}00034=3{,}4\cdot 10^{-4}\)`, igaz: true, miert: T`A tizedesvesszőt 4 hellyel kell jobbra vinni, ezért a kitevő \(-4\).` },
    { allitas: T`\(4^{5}=2^{10}\)`, igaz: true, miert: T`\(4^5=(2^2)^5=2^{10}=1024\).` },
    { allitas: T`\(2^{30}>3^{20}\)`, igaz: false, miert: T`\(2^{30}=8^{10}\) és \(3^{20}=9^{10}\), és \(8<9\).` },
    { allitas: T`\((-1)^{2025}=-1\)`, igaz: true, miert: T`\(-1\) páratlan kitevőjű hatványa \(-1\).` }
    ],
    mintapelda: {
      feladat: T`Számítsd ki: \(\dfrac{2^{-3}\cdot 4^{2}}{8^{-1}}\)`,
      lepesek: [
      T`Mindent 2 hatványaként írunk fel: \(4^2=(2^2)^2=2^4\) és \(8^{-1}=(2^3)^{-1}=2^{-3}\).`,
      T`\[\frac{2^{-3}\cdot 2^{4}}{2^{-3}}\]`,
      T`A kitevők: szorzásnál összeadunk, osztásnál kivonunk: \(-3+4-(-3)=4\).`,
      T`\[=2^{4}=16\]`,
      T`Tanulság: a különböző alapokat hozd közös, lehetőleg prím alapra.`
      ]
    },
    feladatok
  });
})();
