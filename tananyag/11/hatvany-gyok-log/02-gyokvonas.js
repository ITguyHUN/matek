/*
 * 2. fejezet – Az n-edik gyök
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.gyokertek = { nev: 'Gyökvonás', general() {
    const k = R(0, 2); let n = P([2, 3, 4, 5]); if (k === 2) n = P([2, 3]);
    const rt = x => n === 2 ? T`\sqrt{${x}}` : T`\sqrt[${n}]{${x}}`;
    let rad, ans, sol;
    if (k === 0) { const b = R(1, n === 2 ? 12 : n === 3 ? 5 : 3); const neg = R(0, 2) === 0; const r = (neg ? -1 : 1) * b ** n; rad = String(r);
      if (neg && n % 2 === 0) { ans = { nincs: true }; sol = [T`Páros gyökkitevő (\(n=${n}\)) mellett negatív számnak nincs gyöke, mert páros kitevőjű hatvány sosem negatív. A kifejezés <b>nincs értelmezve</b>.`]; }
      else { const v = neg ? -b : b; ans = { ertekek: [v] }; sol = [T`\[${rt(rad)}=${v},\quad\text{mert}\quad ${v < 0 ? '(' + v + ')' : v}^{${n}}=${r}\]`]; } }
    else if (k === 1) { const b = R(2, n === 2 ? 9 : 3); rad = T`\frac{1}{${b ** n}}`; ans = { ertekek: [1 / b] };
      sol = [T`\[${rt(rad)}=\frac{1}{${b}},\quad\text{mert}\quad ${b}^{${n}}=${b ** n}\]`]; }
    else { const b = R(1, 3); const r = (b / 10) ** n; rad = nt(r); ans = { ertekek: [b / 10] };
      sol = [T`\[${rt(rad)}=${nt(b / 10)},\quad\text{mert}\quad ${nt(b / 10)}^{${n}}=${rad}\]`]; }
    return { kerdes: T`<p>Számítsd ki! Ha a kifejezés nincs értelmezve, írd be: <b>nincs</b>.</p>\[${rt(rad)}\]`, valasz: ans, formatum: 'szám vagy „nincs”',
      tipp: 'Keresd azt a számot, amelynek n-edik hatványa a gyökjel alatti szám. Páros gyökkitevőnél a gyökjel alatt nem állhat negatív szám, páratlannál igen.', megoldas: sol };
  } };

  feladatok.gyokkivitel = { nev: 'Kivitel a gyökjel alól', general() {
    const kind = R(0, 5);
    if (kind <= 2) { const m = P([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]); const k = R(2, kind === 2 ? 12 : 9); const N = k * k * m;
      return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\sqrt{${N}}=\square\sqrt{${m}}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: 'Bontsd fel a számot két tényezőre úgy, hogy az egyik a lehető legnagyobb négyzetszám legyen (4, 9, 16, 25, 36, 49 …).',
        megoldas: [T`\[\sqrt{${N}}=\sqrt{${k * k}\cdot ${m}}=\sqrt{${k * k}}\cdot\sqrt{${m}}=${k}\sqrt{${m}}\]`] }; }
    if (kind <= 4) { const m = P([2, 3, 4, 5, 6, 7, 9, 10]); const k = R(2, 5); const neg = kind === 4 && R(0, 1) === 1; const N = (neg ? -1 : 1) * k ** 3 * m;
      return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\sqrt[3]{${N}}=\square\sqrt[3]{${m}}\]`, valasz: { ertekek: [neg ? -k : k] }, formatum: 'egész szám',
        tipp: 'Bontsd fel a számot két tényezőre úgy, hogy az egyik köbszám legyen (8, 27, 64, 125 …). Köbgyöknél a negatív előjel kijöhet a gyökjel elé.',
        megoldas: [T`\[\sqrt[3]{${N}}=\sqrt[3]{${neg ? '-' : ''}${k ** 3}\cdot ${m}}=${neg ? '-' : ''}${k}\sqrt[3]{${m}}\]`] }; }
    const m = P([2, 3, 5]); const k = R(2, 3); const N = k ** 4 * m;
    return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\sqrt[4]{${N}}=\square\sqrt[4]{${m}}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: 'Keress a számban negyedik hatvány tényezőt (16, 81 …).',
      megoldas: [T`\[\sqrt[4]{${N}}=\sqrt[4]{${k ** 4}\cdot ${m}}=${k}\sqrt[4]{${m}}\]`] };
  } };

  feladatok.gyokazon = { nev: 'Azonosságok', general() {
    const kind = R(0, 2);
    if (kind === 0) { const s = P([2, 3, 5, 6, 7, 10]); const t = R(1, 4), u = R(2, 4); const a = s * t * t, b = s * u * u, v = s * t * u;
      return { kerdes: T`<p>Számítsd ki!</p>\[\sqrt{${a}}\cdot\sqrt{${b}}\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
        tipp: T`Azonos gyökkitevőjű gyökök szorzata: \(\sqrt{a}\cdot\sqrt{b}=\sqrt{ab}\).`,
        megoldas: [T`\[\sqrt{${a}}\cdot\sqrt{${b}}=\sqrt{${a * b}}=${v}\]`] }; }
    if (kind === 1) { const s = P([2, 3, 5, 6, 7, 10, 11]); const w = R(2, 9); const a = s * w * w;
      return { kerdes: T`<p>Számítsd ki!</p>\[\frac{\sqrt{${a}}}{\sqrt{${s}}}\]`, valasz: { ertekek: [w] }, formatum: 'egész szám',
        tipp: T`Azonos gyökkitevőjű gyökök hányadosa: \(\dfrac{\sqrt{a}}{\sqrt{b}}=\sqrt{\dfrac{a}{b}}\).`,
        megoldas: [T`\[\frac{\sqrt{${a}}}{\sqrt{${s}}}=\sqrt{\frac{${a}}{${s}}}=\sqrt{${w * w}}=${w}\]`] }; }
    const s = P([2, 3, 5]); const t = R(1, 3), u = R(1, 2); const a = s * t ** 3, b = s * s * u ** 3, v = s * t * u;
    return { kerdes: T`<p>Számítsd ki!</p>\[\sqrt[3]{${a}}\cdot\sqrt[3]{${b}}\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
      tipp: T`\(\sqrt[3]{a}\cdot\sqrt[3]{b}=\sqrt[3]{ab}\), utána keresd meg, melyik szám köbe a szorzat.`,
      megoldas: [T`\[\sqrt[3]{${a}}\cdot\sqrt[3]{${b}}=\sqrt[3]{${a * b}}=${v}\]`] };
  } };

  feladatok.gyokbevitel = { nev: 'Bevitel a gyökjel alá', general() {
    const kind = R(0, 2);
    if (kind < 2) { const k = R(2, 10), m = P([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]);
      return { kerdes: T`<p>Vidd be a szorzót a gyökjel alá! Melyik szám kerül a négyzet helyére?</p>\[${k}\sqrt{${m}}=\sqrt{\square}\]`, valasz: { ertekek: [k * k * m] }, formatum: 'egész szám',
        tipp: T`A gyökjel alá a szorzó négyzetét kell bevinni: \(k\sqrt{a}=\sqrt{k^2a}\).`,
        megoldas: [T`\[${k}\sqrt{${m}}=\sqrt{${k}^{2}\cdot ${m}}=\sqrt{${k * k * m}}\]`] }; }
    const k = R(2, 5), m = P([2, 3, 4, 5, 6]); const neg = R(0, 1) === 1; const v = (neg ? -1 : 1) * k ** 3 * m;
    return { kerdes: T`<p>Vidd be a szorzót a gyökjel alá! Melyik szám kerül a négyzet helyére?</p>\[${neg ? '-' : ''}${k}\sqrt[3]{${m}}=\sqrt[3]{\square}\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
      tipp: T`Köbgyöknél a szorzó köbét kell bevinni: \(k\sqrt[3]{a}=\sqrt[3]{k^3a}\). A negatív előjel is bevihető, mert \((-k)^3=-k^3\).`,
      megoldas: [T`\[${neg ? '-' : ''}${k}\sqrt[3]{${m}}=\sqrt[3]{${neg ? `(-${k})` : k}^{3}\cdot ${m}}=\sqrt[3]{${v}}\]`] };
  } };

  feladatok.gyokosszevon = { nev: 'Összevonás', general() {
    const cube = R(0, 4) === 0; const s = cube ? P([2, 3]) : P([2, 3, 5, 6, 7]);
    const db = R(2, 3); const ks = []; while (ks.length < db) { const k = cube ? R(1, 4) : R(1, 6); if (!ks.includes(k)) ks.push(k); }
    const cs = ks.map((k, i) => (i === 0 ? 1 : P([1, -1])) * P([1, 1, 1, 2, 3]));
    const n = cube ? 3 : 2; const rt = x => cube ? T`\sqrt[3]{${x}}` : T`\sqrt{${x}}`;
    const coef = (c, i) => (i === 0 ? (c < 0 ? '-' : '') : (c < 0 ? '-' : '+')) + (Math.abs(c) === 1 ? '' : Math.abs(c));
    const tex = ks.map((k, i) => coef(cs[i], i) + rt(k ** n * s)).join('');
    const step = ks.map((k, i) => coef(cs[i] * k, i) + rt(s)).join('');
    const ans = ks.reduce((a, k, i) => a + cs[i] * k, 0);
    if (ans === 0) return this.general();
    const ansT = ans === 1 ? '' : ans === -1 ? '-' : String(ans);
    return { kerdes: T`<p>Vond össze! Melyik szám kerül a négyzet helyére?</p>\[${tex}=\square${rt(s)}\]`, valasz: { ertekek: [ans] }, formatum: 'egész szám',
      tipp: T`Vigyél ki minden tagban a gyökjel alól, amit lehet; utána az azonos gyökös tagok ugyanúgy összevonhatók, mint az egynemű kifejezések.`,
      megoldas: [T`\[${tex}=${step}=${ansT}${rt(s)}\]`] };
  } };

  feladatok.gyoktelen = { nev: 'Gyöktelenítés', general() {
    const kind = R(0, 3);
    if (kind === 0) { const m = P([2, 3, 5, 6, 7, 10]); const k = P([1, 2, 3, 4, 5, R(1, 9)]); const a = k * m * P([1, 1, 2]) / (R(0, 3) === 0 ? 1 : 1); const ans = F(a, m);
      return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Melyik szám kerül a négyzet helyére?</p>\[\frac{${a}}{\sqrt{${m}}}=\square\sqrt{${m}}\]`, valasz: { ertekek: [fv(ans)] }, formatum: FMT.frac,
        tipp: T`Bővítsd a törtet \(\sqrt{${m}}\)-mel: a nevezőben \(\sqrt{${m}}\cdot\sqrt{${m}}=${m}\) lesz.`,
        megoldas: [T`\[\frac{${a}}{\sqrt{${m}}}=\frac{${a}\sqrt{${m}}}{\sqrt{${m}}\cdot\sqrt{${m}}}=\frac{${a}\sqrt{${m}}}{${m}}=${ans.d === 1 && ans.n === 1 ? '' : ft(ans)}\sqrt{${m}}\]`] }; }
    if (kind === 1) { // a/(√x − √y) vagy a/(√x + √y)
      const SF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15]; let x = P(SF), y = P(SF); if (x === y) return this.general(); if (x < y) [x, y] = [y, x];
      const plus = R(0, 1) === 1; const d = x - y; const a = d * R(1, 4) * P([1, 1, 2]) ; const ans = F(a, d);
      const den = plus ? T`\sqrt{${x}}+\sqrt{${y}}` : T`\sqrt{${x}}-\sqrt{${y}}`, conj = plus ? T`\sqrt{${x}}-\sqrt{${y}}` : T`\sqrt{${x}}+\sqrt{${y}}`;
      return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Melyik szám kerül a négyzet helyére?</p>\[\frac{${a}}{${den}}=\square\left(${conj}\right)\]`, valasz: { ertekek: [fv(ans)] }, formatum: FMT.frac,
        tipp: T`Bővíts a nevező „párjával”, \((${conj})\)-vel: a nevezőben \((a+b)(a-b)=a^2-b^2\) keletkezik.`,
        megoldas: [T`\[\frac{${a}\left(${conj}\right)}{\left(${den}\right)\left(${conj}\right)}=\frac{${a}\left(${conj}\right)}{${x}-${y}}=${fv(ans) === 1 ? '' : fv(ans) === -1 ? '-' : ft(ans)}\left(${conj}\right)\]`] }; }
    // a/(k ± √y), k² ≠ y
    const k = R(1, 5); const y = P([2, 3, 5, 6, 7, 8, 10, 11, 12, 13]); const d = k * k - y; if (d === 0) return this.general();
    const plus = R(0, 1) === 1; const a = Math.abs(d) * R(1, 3); const ans = F(a, d);
    const den = plus ? T`${k}+\sqrt{${y}}` : T`${k}-\sqrt{${y}}`, conj = plus ? T`${k}-\sqrt{${y}}` : T`${k}+\sqrt{${y}}`;
    return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Melyik szám kerül a négyzet helyére?</p>\[\frac{${a}}{${den}}=\square\left(${conj}\right)\]`, valasz: { ertekek: [fv(ans)] }, formatum: FMT.frac,
      tipp: T`Bővíts \((${conj})\)-vel. A nevező: \(${k}^2-${y}\). Figyelj az előjelre!`,
      megoldas: [T`\[\frac{${a}\left(${conj}\right)}{\left(${den}\right)\left(${conj}\right)}=\frac{${a}\left(${conj}\right)}{${k * k}-${y}}=${fv(ans) === 1 ? '' : fv(ans) === -1 ? '-' : ft(ans)}\left(${conj}\right)\]`] };
  } };

  feladatok.gyoknevezetes = { nev: 'Nevezetes szorzatok gyökökkel', general() {
    const kind = R(0, 3);
    if (kind === 0) { let x = R(2, 30), y = R(2, 20); if (x === y) return this.general();
      return { kerdes: T`<p>Számítsd ki!</p>\[\left(\sqrt{${x}}+\sqrt{${y}}\right)\left(\sqrt{${x}}-\sqrt{${y}}\right)\]`, valasz: { ertekek: [x - y] }, formatum: 'egész szám',
        tipp: T`\((a+b)(a-b)=a^2-b^2\), és \(\left(\sqrt{x}\right)^2=x\).`, megoldas: [T`\[\left(\sqrt{${x}}\right)^{2}-\left(\sqrt{${y}}\right)^{2}=${x}-${y}=${x - y}\]`] }; }
    if (kind === 1) { const a = R(1, 6), b = R(2, 5), y = P([2, 3, 5, 6, 7]); const val = a * a - b * b * y;
      return { kerdes: T`<p>Számítsd ki!</p>\[\left(${a}+${b}\sqrt{${y}}\right)\left(${a}-${b}\sqrt{${y}}\right)\]`, valasz: { ertekek: [val] }, formatum: 'egész szám',
        tipp: T`\((a+b)(a-b)=a^2-b^2\); itt \(\left(${b}\sqrt{${y}}\right)^2=${b * b}\cdot ${y}\).`, megoldas: [T`\[${a}^{2}-\left(${b}\sqrt{${y}}\right)^{2}=${a * a}-${b * b * y}=${val}\]`] }; }
    // (√x ± √y)² ahol xy négyzetszám
    const s = P([2, 3, 5, 6, 7]); const p = R(1, 4); let q = R(1, 4); if (q === p) return this.general();
    const x = s * p * p, y = s * q * q; const plus = kind === 2; const val = x + y + (plus ? 2 : -2) * s * p * q;
    return { kerdes: T`<p>Számítsd ki!</p>\[\left(\sqrt{${x}}${plus ? '+' : '-'}\sqrt{${y}}\right)^{2}\]`, valasz: { ertekek: [val] }, formatum: 'egész szám',
      tipp: T`\((a${plus ? '+' : '-'}b)^2=a^2${plus ? '+' : '-'}2ab+b^2\), és \(\sqrt{${x}}\cdot\sqrt{${y}}=\sqrt{${x * y}}\).`,
      megoldas: [T`\[${x}${plus ? '+' : '-'}2\sqrt{${x}\cdot ${y}}+${y}=${x + y}${plus ? '+' : '-'}2\cdot ${s * p * q}=${val}\]`] };
  } };

  Tananyag.fejezet({
    id: 'gyok',
    cim: 'Az n-edik gyök',
    rovid: 'n-edik gyök',
    bevezeto: T`A gyökvonás a hatványozás visszafelé végzett művelete. Mindig az első kérdés: páros vagy páratlan a gyökkitevő?`,
    elmelet: T`<div class="prose"><ul>
<li><b>n páros:</b> ha \(a\ge 0\), akkor \(\sqrt[n]{a}\) az a <i>nemnegatív</i> szám, amelynek n-edik hatványa \(a\). Negatív számból páros gyök nem vonható.</li>
<li><b>n páratlan:</b> \(\sqrt[n]{a}\) az az egyetlen valós szám, amelynek n-edik hatványa \(a\). Itt \(a\) negatív is lehet: \(\sqrt[3]{-8}=-2\).</li></ul></div>
<div class="mathbox">\[\sqrt{a^2}=|a|,\qquad \sqrt[n]{a}\cdot\sqrt[n]{b}=\sqrt[n]{ab},\qquad \frac{\sqrt[n]{a}}{\sqrt[n]{b}}=\sqrt[n]{\frac{a}{b}},\qquad \left(\sqrt[n]{a}\right)^k=\sqrt[n]{a^k},\qquad \sqrt[k]{\sqrt[n]{a}}=\sqrt[nk]{a}\]</div>
<div class="prose"><ul>
<li><b>Kivitel a gyökjel alól:</b> \(\sqrt{50}=\sqrt{25\cdot 2}=5\sqrt{2}\). Keresd a legnagyobb négyzet- (köb-) szám tényezőt!</li>
<li><b>Bevitel a gyökjel alá:</b> \(3\sqrt{2}=\sqrt{9\cdot 2}=\sqrt{18}\).</li>
<li><b>Összevonás:</b> csak az azonos gyökös tagok: \(2\sqrt3+5\sqrt3=7\sqrt3\).</li>
<li><b>Gyöktelenítés:</b> \(\dfrac{1}{\sqrt a}=\dfrac{\sqrt a}{a}\), \(\dfrac{1}{\sqrt a-\sqrt b}=\dfrac{\sqrt a+\sqrt b}{a-b}\).</li></ul></div>`,
    igazHamis: [
    { allitas: T`\(\sqrt{9+16}=3+4\)`, igaz: false, miert: T`\(\sqrt{9+16}=\sqrt{25}=5\). Összegből nem lehet tagonként gyököt vonni.` },
    { allitas: T`\(\sqrt{4}=\pm 2\)`, igaz: false, miert: T`\(\sqrt4=2\), egyetlen szám. Az \(x^2=4\) egyenletnek van két megoldása, az más kérdés.` },
    { allitas: T`\(\sqrt{(-5)^2}=5\)`, igaz: true, miert: T`\(\sqrt{x^2}=|x|\), így \(\sqrt{(-5)^2}=|-5|=5\).` },
    { allitas: T`\(\sqrt[3]{-8}=-2\)`, igaz: true, miert: T`Páratlan gyökkitevőnél negatív szám is állhat a gyökjel alatt: \((-2)^3=-8\).` },
    { allitas: T`\(\sqrt2+\sqrt3=\sqrt5\)`, igaz: false, miert: T`Különböző gyökös tagok nem vonhatók össze; √2 + √3 ≈ 3,15, míg √5 ≈ 2,24.` },
    { allitas: T`\(\sqrt{50}=5\sqrt{2}\)`, igaz: true, miert: T`\(\sqrt{50}=\sqrt{25\cdot 2}=5\sqrt2\).` },
    { allitas: T`\(3\sqrt{2}=\sqrt{6}\)`, igaz: false, miert: T`A szorzót négyzetre emelve kell bevinni: \(3\sqrt2=\sqrt{9\cdot 2}=\sqrt{18}\).` },
    { allitas: T`\(\dfrac{1}{\sqrt{3}}=\dfrac{\sqrt{3}}{3}\)`, igaz: true, miert: T`\(\sqrt3\)-mal bővítve a nevező \(\sqrt3\cdot\sqrt3=3\).` },
    { allitas: T`\(\left(\sqrt5-\sqrt3\right)\left(\sqrt5+\sqrt3\right)=2\)`, igaz: true, miert: T`\((a-b)(a+b)=a^2-b^2=5-3=2\).` },
    { allitas: T`\(\sqrt[4]{-16}=-2\)`, igaz: false, miert: T`Páros gyökkitevőnél negatív szám gyöke nincs értelmezve; \((-2)^4=16\), nem \(-16\).` },
    { allitas: T`\(\sqrt{x^2}=x\) minden valós \(x\)-re.`, igaz: false, miert: T`\(\sqrt{x^2}=|x|\); például \(\sqrt{(-3)^2}=3\ne -3\).` }
    ],
    mintapelda: {
      feladat: T`Gyöktelenítsd a nevezőt: \(\dfrac{6}{\sqrt5-\sqrt2}\)`,
      lepesek: [
      T`A nevező „párjával”, \((\sqrt5+\sqrt2)\)-vel bővítünk. Így a nevezőben \((a-b)(a+b)=a^2-b^2\) keletkezik.`,
      T`\[\frac{6\,(\sqrt5+\sqrt2)}{(\sqrt5-\sqrt2)(\sqrt5+\sqrt2)}=\frac{6\,(\sqrt5+\sqrt2)}{5-2}\]`,
      T`\[=2\,(\sqrt5+\sqrt2)\]`
      ]
    },
    feladatok
  });
})();
