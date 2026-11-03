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
    if (R(0, 2) > 0) { const m = P([2, 3, 5, 6, 7]); const k = R(2, 7); const N = k * k * m;
      return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\sqrt{${N}}=\square\sqrt{${m}}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: 'Bontsd fel a számot két tényezőre úgy, hogy az egyik négyzetszám legyen (4, 9, 16, 25, 36, 49 …).',
        megoldas: [T`\[\sqrt{${N}}=\sqrt{${k * k}\cdot ${m}}=\sqrt{${k * k}}\cdot\sqrt{${m}}=${k}\sqrt{${m}}\]`] }; }
    const m = P([2, 3, 4, 5]); const k = R(2, 4); const N = k ** 3 * m;
    return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\sqrt[3]{${N}}=\square\sqrt[3]{${m}}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: 'Bontsd fel a számot két tényezőre úgy, hogy az egyik köbszám legyen (8, 27, 64 …).',
      megoldas: [T`\[\sqrt[3]{${N}}=\sqrt[3]{${k ** 3}\cdot ${m}}=${k}\sqrt[3]{${m}}\]`] };
  } };

  feladatok.gyokazon = { nev: 'Azonosságok', general() {
    const kind = R(0, 2);
    if (kind === 0) { const s = P([2, 3, 5, 6]); const t = R(1, 3), u = R(2, 3); const a = s * t * t, b = s * u * u, v = s * t * u;
      return { kerdes: T`<p>Számítsd ki!</p>\[\sqrt{${a}}\cdot\sqrt{${b}}\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
        tipp: T`Azonos gyökkitevőjű gyökök szorzata: \(\sqrt{a}\cdot\sqrt{b}=\sqrt{ab}\).`,
        megoldas: [T`\[\sqrt{${a}}\cdot\sqrt{${b}}=\sqrt{${a * b}}=${v}\]`] }; }
    if (kind === 1) { const s = P([2, 3, 5, 7]); const w = R(2, 6); const a = s * w * w;
      return { kerdes: T`<p>Számítsd ki!</p>\[\frac{\sqrt{${a}}}{\sqrt{${s}}}\]`, valasz: { ertekek: [w] }, formatum: 'egész szám',
        tipp: T`Azonos gyökkitevőjű gyökök hányadosa: \(\dfrac{\sqrt{a}}{\sqrt{b}}=\sqrt{\dfrac{a}{b}}\).`,
        megoldas: [T`\[\frac{\sqrt{${a}}}{\sqrt{${s}}}=\sqrt{\frac{${a}}{${s}}}=\sqrt{${w * w}}=${w}\]`] }; }
    const s = P([2, 3]); const t = R(1, 2), u = R(1, 2); const a = s * t ** 3, b = s * s * u ** 3, v = s * t * u;
    return { kerdes: T`<p>Számítsd ki!</p>\[\sqrt[3]{${a}}\cdot\sqrt[3]{${b}}\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
      tipp: T`\(\sqrt[3]{a}\cdot\sqrt[3]{b}=\sqrt[3]{ab}\), utána keresd meg, melyik szám köbe a szorzat.`,
      megoldas: [T`\[\sqrt[3]{${a}}\cdot\sqrt[3]{${b}}=\sqrt[3]{${a * b}}=${v}\]`] };
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
    { allitas: T`\(\sqrt2+\sqrt3=\sqrt5\)`, igaz: false, miert: T`Különböző gyökös tagok nem vonhatók össze; √2 + √3 ≈ 3,15, míg √5 ≈ 2,24.` }
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
