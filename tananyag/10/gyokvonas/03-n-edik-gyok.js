/*
 * A gyökvonás / 4. fejezet – Az n-edik gyök és azonosságai
 * Témakör: A gyökvonás (Sokszínű matematika 10., 2. fejezet; vizsgatematika 1. témakör; TK 56/1–5; FGY 2125–2143)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, kulonbozo, zj, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;
  const gyk = (n, a) => n === 2 ? T`\sqrt{${a}}` : T`\sqrt[${n}]{${a}}`;
  const gT = (c, n, m) => (c === 1 ? '' : c === -1 ? '-' : c) + gyk(n, m);
  const lnko = gcd, lkkt = (a, b) => a * b / gcd(a, b);
  const NK = { 3: [2, 3, 4, 5, 6, 7, 9, 10], 4: [2, 3, 5, 6, 7], 5: [2, 3, 4] };

  feladatok.ertek = { nev: 'n-edik gyök kiszámítása', general() {
    const t = R(0, 5); let n, tex, ans, nincs = false, mo;
    if (t <= 1) { n = P([3, 3, 4, 5]); const k = n === 3 ? R(1, 10) : n === 4 ? R(1, 6) : R(1, 3); const neg = n % 2 === 1 && R(0, 1) === 1;
      const a = (neg ? -1 : 1) * k ** n; tex = gyk(n, a); ans = neg ? -k : k; mo = T`\(${zj(ans)}^{${n}}=${a}\)`; }
    else if (t === 2) { n = P([3, 4, 5]); const p = R(1, n === 5 ? 2 : 4); let q; do { q = R(2, n === 5 ? 3 : 5); } while (gcd(p, q) !== 1); const ng = n % 2 === 1 && R(0, 1) === 1; tex = gyk(n, (ng ? '-' : '') + T`\frac{${p ** n}}{${q ** n}}`); ans = (ng ? -1 : 1) * p / q; mo = T`\(\left(${ans < 0 ? '-' : ''}\frac{${p}}{${q}}\right)^{${n}}=${ans < 0 ? '-' : ''}\frac{${p ** n}}{${q ** n}}\)`; }
    else if (t === 3) { n = P([3, 3, 4]); const k = R(1, 9), neg = n === 3 && R(0, 1) === 1; const v = (neg ? -1 : 1) * k / 10; tex = gyk(n, nt(+(v ** n).toFixed(8))); ans = v; mo = T`\(${zj(v)}^{${n}}=${nt(+(v ** n).toFixed(8))}\)`.replace(/\\left\((-?\d+)\\right\)/, '($1)'); }
    else if (t === 4) { n = P([4, 6]); const a = -(R(1, 4) ** n); tex = gyk(n, a); nincs = true; mo = T`Páros gyökkitevő esetén a gyökjel alatt nem állhat negatív szám: \(${gyk(n, a)}\) nincs értelmezve.`; }
    else { n = P([3, 4, 6]); const b = P([2, 3]); const e = n * R(1, n === 6 ? 1 : 2); tex = gyk(n, T`${b}^{${e}}`); ans = b ** (e / n); mo = T`\(${gyk(n, T`${b}^{${e}}`)}=${b}^{${e / n}}=${ans}\)`; }
    return { kerdes: T`<p>Számítsd ki számológép nélkül! (Ha a kifejezés nincs értelmezve, írd: nincs.)</p>\[${tex}\]`,
      valasz: nincs ? { nincs: true } : { ertekek: [ans] }, formatum: FMT10.szam + ' (vagy: nincs)',
      tipp: T`\(\sqrt[n]{a}\) az a szám, amelynek \(n\)-edik hatványa \(a\). Páratlan \(n\)-re negatív \(a\) is lehet, páros \(n\)-re csak \(a\ge0\), és ekkor a gyök is nemnegatív.`,
      megoldas: [mo, nincs ? '' : T`Tehát \(${tex}=${sz(ans)}\).`].filter(Boolean), _ell: w => w === 'nincs' ? nincs : true };
  } };
  const sz = x => Number.isInteger(x) ? String(x) : M10.sz(F(Math.round(x * 1000), 1000));

  feladatok.azonossag = { nev: 'Az n-edik gyök azonosságai', general() {
    const t = R(0, 2); let tex, ans, mo;
    const n = P([3, 3, 4]);
    if (t === 0) { const m = P(NK[n]), p = R(1, 4), q = R(1, 4); let x = m * p ** n, y = m ** (n - 1) * q ** n; if (R(0, 1)) [x, y] = [y, x];
      if (x > 5000 || y > 5000) return feladatok.azonossag.general();
      tex = T`${gyk(n, x)}\cdot ${gyk(n, y)}`; ans = m * p * q; mo = T`\(${gyk(n, `${x}\\cdot ${y}`)}=${gyk(n, x * y)}=${ans}\)`; }
    else if (t === 1) { const m = P(NK[n]), k = R(2, n === 3 ? 6 : 4); const x = m * k ** n; tex = T`\frac{${gyk(n, x)}}{${gyk(n, m)}}`; ans = k; mo = T`\(${gyk(n, T`\frac{${x}}{${m}}`)}=${gyk(n, k ** n)}=${k}\)`; }
    else { const a = P([2, 3, 4, 5]); const e = n * R(1, 2); const c = R(1, 2); tex = T`${c === 1 ? '' : c}\left(${gyk(n, a)}\right)^{${e}}`; ans = c * a ** (e / n); mo = T`\(\left(${gyk(n, a)}\right)^{${e}}=${a}^{${e / n}}\), így az érték \(${ans}\).`; }
    return { kerdes: T`<p>Számítsd ki az azonosságok segítségével!</p>\[${tex}\]`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`\(\sqrt[n]{a}\cdot\sqrt[n]{b}=\sqrt[n]{ab}\); \(\frac{\sqrt[n]{a}}{\sqrt[n]{b}}=\sqrt[n]{\frac ab}\); \(\left(\sqrt[n]{a}\right)^k=\sqrt[n]{a^k}\).`, megoldas: [mo] };
  } };

  feladatok.konjszorzat = { nev: 'Szorzat nevezetes azonossággal', general() {
    // ⁿ√(p − √q) · ⁿ√(p + √q) = ⁿ√(p² − q) = r,  vagy  ⁿ√(√q − p) · ⁿ√(√q + p) = ⁿ√(q − p²) = r
    for (let g = 0; g < 200; g++) {
      const n = P([3, 3, 4]); const fordit = n === 3 && R(0, 1) === 1; const p = R(1, n === 3 ? 12 : 9), r = R(1, n === 3 ? 4 : 2);
      const q = fordit ? r ** n + p * p : p * p - r ** n;
      if (q <= 1 || Number.isInteger(Math.sqrt(q))) continue;
      const A = fordit ? T`\sqrt{${q}}-${p}` : T`${p}-\sqrt{${q}}`, B = fordit ? T`\sqrt{${q}}+${p}` : T`${p}+\sqrt{${q}}`;
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${gyk(n, A)}\cdot ${gyk(n, B)}\]`,
        valasz: { ertekek: [r] }, formatum: FMT10.egesz,
        tipp: T`Vond egy gyökjel alá a szorzatot, és használd: \((a-b)(a+b)=a^2-b^2\).`,
        megoldas: [T`\[${gyk(n, T`\left(${A}\right)\left(${B}\right)`)}=${gyk(n, fordit ? T`${q}-${p * p}` : T`${p * p}-${q}`)}=${gyk(n, r ** n)}=${r}\]`] };
    }
    return feladatok.azonossag.general();
  } };

  feladatok.kiemeles = { nev: 'Kiemelés a gyökjel alól', general() {
    const n = P([3, 3, 3, 4]); const m = P(NK[n]); const k = n === 3 ? R(2, 6) : R(2, 4); const c = P([1, 1, 1, 2, 3, -1]);
    if (k ** n * m > 3000) return feladatok.kiemeles.general();
    return { kerdes: T`<p>Hozd egyszerűbb alakra! Mi kerül a négyzet helyére?</p>\[${gT(c, n, k ** n * m)}=\square${gyk(n, m)}\]`,
      valasz: { ertekek: [c * k] }, formatum: FMT10.egesz,
      tipp: T`Keresd meg a gyökjel alatti szám legnagyobb ${n === 3 ? 'köbszám' : 'negyedik hatvány'} osztóját!`,
      megoldas: [T`\[${gT(c, n, k ** n * m)}=${c === 1 ? '' : c === -1 ? '-' : c + T`\cdot `}${gyk(n, `${k ** n}\\cdot ${m}`)}=${c * k}${gyk(n, m)}\]`] };
  } };

  feladatok.osszevon = { nev: 'Összevonás', general() {
    const n = 3; const m = P([2, 3, 4, 5, 6, 7]); const db = R(2, 3); const ss = kulonbozo(db, 1, 5); let ossz = 0; const tagok = [];
    ss.forEach((s, i) => { const c = (i ? P([1, -1]) : 1) * P([1, 1, 2]); tagok.push([c, s]); ossz += c * s; });
    if (ossz === 0) return feladatok.osszevon.general();
    const tex = tagok.map(([c, s], i) => (i && c > 0 ? '+' : '') + gT(c, n, s ** 3 * m)).join('');
    return { kerdes: T`<p>Végezd el az összevonást! Mi kerül a négyzet helyére?</p>\[${tex}=\square${gyk(n, m)}\]`,
      valasz: { ertekek: [ossz] }, formatum: FMT10.egesz, tipp: T`Hozd minden tagot \(k${gyk(n, m)}\) alakra (kiemelés a gyökjel alól), aztán vond össze.`,
      megoldas: [T`\[${tagok.map(([c, s], i) => (i && c * s > 0 ? '+' : '') + gT(c * s, n, m)).join('')}=${ossz}${gyk(n, m)}\]`] };
  } };

  feladatok.kozos = { nev: 'Közös gyökkitevő, gyök gyöke', general() {
    const t = R(0, 3);
    if (t === 3) { const [p, q] = kulonbozo(2, 2, 5); const a = R(1, p + 2), b = R(1, q + 2); const L = lkkt(p, q); const e = a * L / p + b * L / q;
      const xa = a === 1 ? 'x' : `x^{${a}}`, xb = b === 1 ? 'x' : `x^{${b}}`;
      return { kerdes: T`<p>Írd fel egyetlen gyökjellel (\(x>0\))! Mi kerül a négyzet helyére?</p>\[${gyk(p, xa)}\cdot ${gyk(q, xb)}=\sqrt[${L}]{x^{\square}}\]`,
        valasz: { ertekek: [e] }, formatum: FMT10.egesz,
        tipp: T`Közös gyökkitevő: \(${L}\). Ehhez a gyök alatti kitevőket is szorozni kell: \(${gyk(p, xa)}=\sqrt[${L}]{x^{${a * L / p}}}\).`,
        megoldas: [T`\[${gyk(p, xa)}\cdot ${gyk(q, xb)}=\sqrt[${L}]{x^{${a * L / p}}}\cdot\sqrt[${L}]{x^{${b * L / q}}}=\sqrt[${L}]{x^{${e}}}\]`] }; }
    if (t === 0) { const a = P([2, 3, 5]); const [p, q] = kulonbozo(2, 2, 4); const L = lkkt(p, q); const e = L / p + L / q;
      return { kerdes: T`<p>Írd fel egyetlen gyökjellel! Mi kerül a négyzet helyére?</p>\[${gyk(p, a)}\cdot ${gyk(q, a)}=\sqrt[${L}]{\square}\]`,
        valasz: { ertekek: [a ** e] }, formatum: FMT10.egesz,
        tipp: T`Hozd közös gyökkitevőre (\(${L}\)): \(${gyk(p, a)}=\sqrt[${L}]{${a}^{${L / p}}}\), \(${gyk(q, a)}=\sqrt[${L}]{${a}^{${L / q}}}\).`,
        megoldas: [T`\[${gyk(p, a)}\cdot ${gyk(q, a)}=\sqrt[${L}]{${a}^{${L / p}}}\cdot\sqrt[${L}]{${a}^{${L / q}}}=\sqrt[${L}]{${a}^{${e}}}=\sqrt[${L}]{${a ** e}}\]`] }; }
    if (t === 1) { const ks = [P([2, 3]), P([2, 3, 4])]; if (R(0, 1)) ks.push(2); const N = ks.reduce((x, y) => x * y, 1);
      let tex = 'x'; ks.forEach(k => { tex = gyk(k, tex); });
      return { kerdes: T`<p>Írd fel egyetlen gyökjellel (\(x\ge0\))! Mi lesz a gyökkitevő?</p>\[${tex}=\sqrt[\square]{x}\]`,
        valasz: { ertekek: [N] }, formatum: FMT10.egesz, tipp: T`\(\sqrt[n]{\sqrt[k]{x}}=\sqrt[nk]{x}\): a gyökkitevők összeszorzódnak.`,
        megoldas: [T`A gyökkitevők szorzata: \(${ks.join(T`\cdot `)}=${N}\), tehát \(${tex}=\sqrt[${N}]{x}\).`] }; }
    // egyszerűsítés: ^(nk)√(a^k) = ^n√a
    const a = P([2, 3, 5, 7]); const n = P([2, 3]), k = P([2, 3]); const N = n * k;
    return { kerdes: T`<p>Egyszerűsítsd a gyökkitevőt! Mi kerül a négyzet helyére?</p>\[\sqrt[${N}]{${a ** k}}=${n === 2 ? T`\sqrt{\square}` : T`\sqrt[${n}]{\square}`}\]`,
      valasz: { ertekek: [a] }, formatum: FMT10.egesz, tipp: T`\(\sqrt[nk]{a^k}=\sqrt[n]{a}\) (\(a\ge0\)). Írd fel a gyök alatti számot hatványként!`,
      megoldas: [T`\[\sqrt[${N}]{${a ** k}}=\sqrt[${N}]{${a}^{${k}}}=${gyk(n, a)}\]`] };
  } };

  feladatok.hasonlit = { nev: 'Melyik a nagyobb?', general() {
    let a, m, b, n; do { a = R(2, 5); m = P([2, 3, 4, 5, 6, 7, 9, 10, 11]); b = R(2, 5); n = P([2, 3, 4, 5, 6, 7, 9, 10, 11]); } while (a === b && m === n);
    const A = a ** 3 * m, B = b ** 3 * n; const c = A < B ? 0 : A === B ? 1 : 2; const s = ['<', '=', '>'];
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére? (Számológép nélkül döntsd el!)</p>\[${a}\sqrt[3]{${m}}\;\square\;${b}\sqrt[3]{${n}}\]`,
      valasz: { valasztas: s, helyes: c }, tipp: T`Vidd be a tényezőt a köbgyök alá: \(a\sqrt[3]{m}=\sqrt[3]{a^3m}\).`,
      megoldas: [T`\(${a}\sqrt[3]{${m}}=\sqrt[3]{${A}}\), \(${b}\sqrt[3]{${n}}=\sqrt[3]{${B}}\).`, T`\(${A}${s[c]}${B}\), ezért \(${a}\sqrt[3]{${m}}${s[c]}${b}\sqrt[3]{${n}}\).`] };
  } };

  feladatok.gyoktelen = { nev: 'Gyöktelenítés n-edik gyökkel', general() {
    const n = P([3, 3, 4]); const b = P([2, 3, 5]); const d = P([1, 1, 2, 3]); const a = R(0, 1) ? b * d * R(1, 9) : R(1, 20); const cF = F(a, b * d); const c = fv(cF);
    return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Mi kerül a négyzet helyére? (Tört is lehet.)</p>\[\frac{${a}}{${gT(d, n, b)}}=\square\cdot ${gyk(n, b ** (n - 1))}\]`,
      valasz: { ertekek: [c] }, formatum: FMT10.tort,
      tipp: T`Bővítsd a törtet ezzel: \(${gyk(n, b ** (n - 1))}\). Így a nevezőben \(${gyk(n, b ** n)}=${b}\) lesz.`,
      megoldas: [T`\[\frac{${a}}{${gT(d, n, b)}}=\frac{${a}\cdot ${gyk(n, b ** (n - 1))}}{${gT(d, n, b)}\cdot ${gyk(n, b ** (n - 1))}}=\frac{${a}\cdot ${gyk(n, b ** (n - 1))}}{${d * b}}=${c === 1 ? '' : ft(cF) + T`\cdot `}${gyk(n, b ** (n - 1))}\]`],
      _ell: w => egy(w * Math.pow(b ** (n - 1), 1 / n), a / (d * Math.pow(b, 1 / n))) };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'vgy3',
    cim: 'Az n-edik gyök és azonosságai',
    rovid: 'n-edik gyök',
    bevezeto: T`A négyzetgyök azonosságai tetszőleges \(n\)-edik gyökre is érvényesek – csak arra kell figyelni, hogy páros vagy páratlan-e a gyökkitevő.`,
    elmelet: T`<div class="prose"><ul>
<li><b>Páratlan \(n\)</b> (\(n=3,5,\dots\)): \(\sqrt[n]{a}\) minden valós \(a\)-ra értelmezett; az a szám, amelynek \(n\)-edik hatványa \(a\). Például \(\sqrt[3]{-8}=-2\).</li>
<li><b>Páros \(n\)</b> (\(n=2,4,\dots\)): csak \(a\ge0\)-ra értelmezett, és \(\sqrt[n]{a}\ge0\). Például \(\sqrt[4]{81}=3\), \(\sqrt[4]{-16}\) nincs értelmezve.</li></ul></div>
<div class="tbl"><table><tr><th>Azonosság</th><th>Példa</th></tr>
<tr><td>\(\sqrt[n]{a}\cdot\sqrt[n]{b}=\sqrt[n]{ab}\)</td><td>\(\sqrt[3]{4}\cdot\sqrt[3]{16}=\sqrt[3]{64}=4\)</td></tr>
<tr><td>\(\frac{\sqrt[n]{a}}{\sqrt[n]{b}}=\sqrt[n]{\frac ab}\)</td><td>\(\frac{\sqrt[3]{54}}{\sqrt[3]{2}}=\sqrt[3]{27}=3\)</td></tr>
<tr><td>\(\left(\sqrt[n]{a}\right)^k=\sqrt[n]{a^k}\)</td><td>\(\left(\sqrt[3]{5}\right)^6=5^2=25\)</td></tr>
<tr><td>\(\sqrt[n]{\sqrt[k]{a}}=\sqrt[nk]{a}\)</td><td>\(\sqrt{\sqrt[3]{x}}=\sqrt[6]{x}\)</td></tr>
<tr><td>\(\sqrt[nk]{a^{mk}}=\sqrt[n]{a^m}\)</td><td>\(\sqrt[6]{25}=\sqrt[3]{5}\)</td></tr></table></div>
<div class="prose"><ul>
<li>A páros kitevős azonosságok \(a,b\ge0\) esetén érvényesek.</li>
<li><b>Kiemelés:</b> \(\sqrt[3]{54}=\sqrt[3]{27\cdot2}=3\sqrt[3]{2}\). <b>Közös gyökkitevő:</b> \(\sqrt2\cdot\sqrt[3]2=\sqrt[6]{2^3}\cdot\sqrt[6]{2^2}=\sqrt[6]{32}\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(\sqrt[3]{-27}=-3\)`, igaz: true, miert: T`\((-3)^3=-27\).` },
      { allitas: T`\(\sqrt[4]{-16}=-2\)`, igaz: false, miert: T`Páros gyökkitevőnél negatív szám gyöke nincs értelmezve; \((-2)^4=16\).` },
      { allitas: T`\(\sqrt[3]{2}\cdot\sqrt[3]{4}=2\)`, igaz: true, miert: T`\(\sqrt[3]{8}=2\).` },
      { allitas: T`\(\sqrt{2}\cdot\sqrt[3]{2}=\sqrt[5]{4}\)`, igaz: false, miert: T`Közös kitevőre hozva: \(\sqrt[6]{8}\cdot\sqrt[6]{4}=\sqrt[6]{32}\).` },
      { allitas: T`\(\sqrt{\sqrt[3]{x}}=\sqrt[6]{x}\) (\(x\ge0\))`, igaz: true, miert: 'A gyökkitevők összeszorzódnak.' },
      { allitas: T`\(\sqrt[3]{54}=3\sqrt[3]{2}\)`, igaz: true, miert: T`\(54=27\cdot2\).` },
      { allitas: T`\(\sqrt[3]{8+27}=2+3\)`, igaz: false, miert: T`Összegre nincs azonosság: \(\sqrt[3]{35}\approx3{,}27\).` },
      { general() { const k = R(2, 5), m = P([2, 3, 5]); const jo = R(0, 1) === 1;
        return { allitas: T`\(\sqrt[3]{${k ** 3 * m}}=${jo ? k : k * k}\sqrt[3]{${m}}\)`, igaz: jo, miert: T`\(${k ** 3 * m}=${k ** 3}\cdot${m}\), így \(${k}\sqrt[3]{${m}}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Végezzük el: \(\sqrt[3]{16}+\sqrt[3]{54}-\sqrt[3]{250}\)`,
      lepesek: [T`\(\sqrt[3]{16}=\sqrt[3]{8\cdot2}=2\sqrt[3]{2}\)`, T`\(\sqrt[3]{54}=\sqrt[3]{27\cdot2}=3\sqrt[3]{2}\)`, T`\(\sqrt[3]{250}=\sqrt[3]{125\cdot2}=5\sqrt[3]{2}\)`, T`\[2\sqrt[3]{2}+3\sqrt[3]{2}-5\sqrt[3]{2}=0\]`]
    },
    feladatok
  }));
})();
