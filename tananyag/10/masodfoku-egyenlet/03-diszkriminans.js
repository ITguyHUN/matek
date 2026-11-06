/*
 * 3. fejezet – A diszkrimináns: a gyökök száma, paraméteres feltételek
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 2. lecke 6–8. feladat; FGY 2164–2168)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, zj, el, tg, sz, keplet, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;
  const Dt = (a, b, c) => T`D=${zj(b)}^2-4\cdot ${zj(a)}\cdot ${zj(c)}=${b * b - 4 * a * c}`;
  /* véletlen egyenlet adott D-előjellel: s = −1, 0, 1 */
  function egyenlet(s) {
    for (let g = 0; g < 500; g++) {
      const a = R0(-5, 6), b = R(-12, 12), c = R(-15, 15); const D = b * b - 4 * a * c;
      if (Math.sign(D) === s) return [a, b, c];
    }
    return s === 0 ? [1, -6, 9] : s > 0 ? [1, -5, 6] : [1, 2, 5];
  }
  /* egyenlet kirakása, néha átrendezve: a x² + b x + c = 0 ↔ a x² + (b−r)x = −c − r x … */
  function kirak(a, b, c) {
    const t = R(0, 3);
    if (t === 0) return T`${q2(a, b, c)}=0`;
    if (t === 1) return T`${q2(a, 0, c)}=${l1(-b, 0)}`;
    if (t === 2) return T`${q2(a, b, 0)}=${-c}`;
    const r = R0(-4, 4), s = R0(-6, 6); return T`${q2(a, b + r, c + s)}=${l1(r, s)}`;
  }

  feladatok.dszam = { nev: 'A diszkrimináns kiszámítása', general() {
    const [a, b, c] = egyenlet(P([-1, 0, 1, 1]));
    return { kerdes: T`<p>Rendezd az egyenletet \(ax^2+bx+c=0\) alakra, és számítsd ki a diszkriminánsát!</p>\[${kirak(a, b, c)}\]`,
      valasz: { ertekek: [b * b - 4 * a * c] }, formatum: FMT10.egesz,
      tipp: T`\(D=b^2-4ac\). A negatív együtthatókat zárójelbe téve helyettesítsd be!`,
      megoldas: [T`Rendezve: \(${q2(a, b, c)}=0\), tehát \(a=${a}\), \(b=${b}\), \(c=${c}\).`, T`\[${Dt(a, b, c)}\]`] };
  } };

  feladatok.gyokszam = { nev: 'Hány valós gyöke van?', general() {
    const s = P([-1, -1, 0, 1, 1]); let a, b, c;
    if (s === 0) { const k = R0(-6, 6), m = P([1, 1, 2, 3, -1]); const n = P([1, 1, 1, 2]); a = m * n * n; b = 2 * m * n * k; c = m * k * k; }
    else [a, b, c] = egyenlet(s);
    const D = b * b - 4 * a * c, n = D > 0 ? 2 : D === 0 ? 1 : 0;
    return { kerdes: T`<p>Hány valós gyöke van az egyenletnek? (Az egyenletet nem kell megoldani.)</p>\[${kirak(a, b, c)}\]`,
      valasz: { ertekek: [n] }, formatum: 'egész szám: 0, 1 vagy 2',
      tipp: T`Elég a diszkrimináns előjele: \(D>0\): 2 gyök; \(D=0\): 1 gyök; \(D<0\): nincs valós gyök.`,
      megoldas: [T`Rendezve: \(${q2(a, b, c)}=0\).`, T`\[${Dt(a, b, c)}\]`, T`\(D${D > 0 ? '>' : D === 0 ? '=' : '<'}0\), tehát ${n === 0 ? 'nincs valós gyöke' : n === 1 ? 'egy (kettős) gyöke van' : 'két különböző valós gyöke van'}.`] };
  } };

  feladatok.paramc = { nev: 'Paraméter a konstans tagban', general() {
    const a = P([1, 1, 1, 2, 3, 5, -1]); const b = R0(-12, 12); const hatar = F(b * b, 4 * a);   // D = b² − 4ac = 0 ⇔ c = b²/(4a)
    const h = fv(hatar); const t = R(0, 2);
    const eq = T`${q2(a, b, 0)}+c=0`;
    let kerd, ans, mo;
    if (t === 0) { kerd = T`Határozd meg \(c\) értékét úgy, hogy az egyenletnek <b>egy (kettős)</b> valós gyöke legyen!`; ans = h; mo = T`\(D=0\iff c=${ft(hatar)}\).`; }
    else if (t === 1) { const kell = a > 0 ? Math.ceil(h - 1e-9) - 1 : Math.floor(h + 1e-9) + 1; kerd = T`Melyik az a ${a > 0 ? 'legnagyobb' : 'legkisebb'} <b>egész</b> \(c\), amelyre az egyenletnek két különböző valós gyöke van?`; ans = kell;
      mo = T`\(D>0\iff ${b * b}${el(-4 * a)}c>0\iff c${a > 0 ? '<' : '>'}${ft(hatar)}\). A keresett egész: \(${kell}\).`; }
    else { const kell = a > 0 ? Math.floor(h + 1e-9) + 1 : Math.ceil(h - 1e-9) - 1; kerd = T`Melyik az a ${a > 0 ? 'legkisebb' : 'legnagyobb'} <b>egész</b> \(c\), amelyre az egyenletnek nincs valós gyöke?`; ans = kell;
      mo = T`\(D<0\iff c${a > 0 ? '>' : '<'}${ft(hatar)}\). A keresett egész: \(${kell}\).`; }
    return { kerdes: T`<p>Adott az egyenlet, ahol \(c\) valós paraméter:</p>\[${eq}\]<p>${kerd}</p>`,
      valasz: { ertekek: [ans] }, formatum: t === 0 ? FMT10.tort : FMT10.egesz,
      tipp: T`Írd fel a diszkriminánst \(c\)-vel: \(D=${b * b}${el(-4 * a)}c\). Egy gyök: \(D=0\); két gyök: \(D>0\); nincs gyök: \(D<0\).`,
      megoldas: [T`\[D=${zj(b)}^2-4\cdot ${zj(a)}\cdot c=${b * b}${el(-4 * a)}c\]`, mo],
      _ell: w => { const D = b * b - 4 * a * w; return t === 0 ? egy(D, 0) : t === 1 ? D > 0 && b * b - 4 * a * (w + (a > 0 ? 1 : -1)) <= 0 : D < 0 && b * b - 4 * a * (w - (a > 0 ? 1 : -1)) >= 0; } };
  } };

  feladatok.paramb = { nev: 'Paraméter a lineáris tagban', general() {
    // a x² + b x + c = 0 kettős gyök ⇔ b² = 4ac; 4ac teljes négyzet
    const m = P([1, 1, 1, 2, 3, 5, -1, -2]);   // a = m·s², c = m·t² → 4ac = (2mst)²
    const s = P([1, 1, 2, 3]), t = R(1, 9); const a = m * s * s, c = m * t * t; const B = Math.abs(2 * m * s * t);
    const tip = R(0, 2);
    if (tip < 2) return { kerdes: T`<p>Adott az egyenlet, ahol \(b\) valós paraméter:</p>\[${q2(a, 0, 0)}+bx${el(c)}=0\]<p>Mely \(b\) értékek esetén lesz az egyenletnek <b>egy (kettős)</b> valós gyöke? (Mindegyiket add meg!)</p>`,
      valasz: { ertekek: [-B, B] }, formatum: FMT10.halmaz,
      tipp: T`\(D=b^2-4\cdot ${a}\cdot ${c}=b^2-${4 * a * c}\). Kettős gyök: \(D=0\). Figyelj: \(b^2=k\)-nak két megoldása van!`,
      megoldas: [T`\[D=b^2-4\cdot ${a}\cdot ${c}=b^2-${4 * a * c}=0\]`, T`\[b^2=${B * B}\quad\Rightarrow\quad b=\pm${B}\]`],
      _ell: w => egy(w * w - 4 * a * c, 0) };
    // pozitív b esetén mennyi a kettős gyök?
    const r = F(-B, 2 * a);
    return { kerdes: T`<p>Az egyenletben \(b\) pozitív valós paraméter:</p>\[${q2(a, 0, 0)}+bx${el(c)}=0\]<p>Az egyenletnek egy (kettős) gyöke van. Mennyi ez a gyök?</p>`,
      valasz: { ertekek: [fv(r)] }, formatum: FMT10.tort,
      tipp: T`Előbb határozd meg \(b\)-t a \(D=0\) feltételből, majd a kettős gyök: \(x=-\frac{b}{2a}\).`,
      megoldas: [T`\(D=b^2-${4 * a * c}=0\Rightarrow b=${B}\) (mert \(b>0\)).`, T`\[x=-\frac{b}{2a}=-\frac{${B}}{${2 * a}}=${ft(r)}\]`],
      _ell: w => egy(a * w * w + B * w + c, 0) };
  } };

  feladatok.parama = { nev: 'Paraméter a főegyütthatóban', general() {
    const t = R(0, 1); const b = R0(-10, 10); let c = R0(-8, 8);
    if (t === 0) {   // egyik gyöke x0 → a
      let x0, A; do { x0 = R0(-5, 5); A = F(-(b * x0 + c), x0 * x0); } while (A.n === 0);
      return { kerdes: T`<p>Az \(ax^2${tg(b)}${el(c)}=0\) egyenletben határozd meg az \(a\) paraméter értékét úgy, hogy az egyenlet egyik megoldása \(x=${x0}\) legyen!</p>`,
        valasz: { ertekek: [fv(A)] }, formatum: FMT10.tort,
        tipp: T`Ha \(x=${x0}\) megoldás, akkor behelyettesítve igaz egyenlőséget kapunk.`,
        megoldas: [T`\[a\cdot ${zj(x0)}^2${el(b)}\cdot ${zj(x0)}${el(c)}=0\]`, T`\[${x0 * x0}a${el(b * x0 + c)}=0\quad\Rightarrow\quad a=${ft(A)}\]`],
        _ell: w => egy(w * x0 * x0 + b * x0 + c, 0) };
    }
    // kettős gyök → a = b²/(4c)
    const A = F(b * b, 4 * c);
    return { kerdes: T`<p>Az \(ax^2${tg(b)}${el(c)}=0\) egyenletben (\(a\neq0\)) határozd meg \(a\) értékét úgy, hogy az egyenletnek két egyenlő (kettős) gyöke legyen!</p>`,
      valasz: { ertekek: [fv(A)] }, formatum: FMT10.tort,
      tipp: T`Kettős gyök: \(D=b^2-4ac=0\). Itt \(b=${b}\) és \(c=${c}\) ismert, \(a\) az ismeretlen.`,
      megoldas: [T`\[D=${zj(b)}^2-4\cdot a\cdot ${zj(c)}=${b * b}${el(-4 * c)}a=0\]`, T`\[a=${ft(A)}\]`],
      _ell: w => egy(b * b - 4 * w * c, 0) };
  } };

  feladatok.masik = { nev: 'Ismert gyökből a paraméter', general() {
    const x1 = R0(-7, 7); let x2; do { x2 = R0(-9, 9); } while (x2 === x1);
    const a = P([1, 1, 1, 2]); const p = -a * (x1 + x2), q = a * x1 * x2; const t = R(0, 2);
    if (t === 0) return { kerdes: T`<p>Az alábbi egyenlet egyik gyöke \(${x1}\). Mennyi \(p\)?</p>\[${q2(a, 0, 0)}+px${el(q)}=0\]`,
      valasz: { ertekek: [p] }, formatum: FMT10.egesz, tipp: T`Helyettesítsd be az \(x=${x1}\) gyököt, és oldd meg \(p\)-re.`,
      megoldas: [T`\[${a === 1 ? '' : a + T`\cdot `}${zj(x1)}^2+p\cdot ${zj(x1)}${el(q)}=0\quad\Rightarrow\quad ${x1}p=${-(a * x1 * x1 + q)}\quad\Rightarrow\quad p=${p}\]`],
      _ell: w => egy(a * x1 * x1 + w * x1 + q, 0) };
    if (t === 1) return { kerdes: T`<p>Az alábbi egyenlet egyik gyöke \(${x1}\). Mennyi \(q\)?</p>\[${q2(a, p, 0)}+q=0\]`,
      valasz: { ertekek: [q] }, formatum: FMT10.egesz, tipp: T`Helyettesítsd be az \(x=${x1}\) gyököt, és fejezd ki \(q\)-t.`,
      megoldas: [T`\[${a === 1 ? '' : a + T`\cdot `}${zj(x1)}^2${el(p)}\cdot ${zj(x1)}+q=0\quad\Rightarrow\quad q=${q}\]`],
      _ell: w => egy(a * x1 * x1 + p * x1 + w, 0) };
    return { kerdes: T`<p>Az alábbi egyenlet egyik gyöke \(${x1}\). Mennyi a másik gyöke?</p>\[${q2(a, 0, 0)}+px${el(q)}=0\]`,
      valasz: { ertekek: [x2] }, formatum: FMT10.egesz, tipp: T`Előbb határozd meg \(p\)-t behelyettesítéssel, utána oldd meg az egyenletet.`,
      megoldas: [T`Behelyettesítve \(x=${x1}\)-et: \(p=${p}\).`, T`\[${q2(a, p, q)}=0\quad\Rightarrow\quad x_1=${x1},\; x_2=${x2}\]`],
      _ell: w => egy(a * w * w + p * w + q, 0) && w !== x1 };
  } };

  feladatok.mparam = { nev: 'Paraméter több együtthatóban', szint: 'emelt', general() {
    // m x² + (2k m + q) x + (k² m + s) = 0 → D = 4(kq − s)·m + q² (lineáris m-ben)
    let k, q, s; do { k = R0(-3, 3); q = R0(-5, 5); s = R(-6, 6); } while (s === k * q);
    const M = F(q * q, 4 * (s - k * q));
    const bT = T`(${l1(2 * k, q, 'm')})x`, cT = T`${l1(k * k, s, 'm')}`;
    const kerdes = T`<p>Az egyenletben \(m\neq0\) valós paraméter:</p>\[mx^2+${bT}+${cT.startsWith('-') ? T`(${cT})` : cT}=0\]<p>Mely \(m\) esetén lesz az egyenletnek két egyenlő (kettős) gyöke?</p>`;
    return { kerdes, valasz: { ertekek: [fv(M)] }, formatum: FMT10.tort,
      tipp: T`Írd fel a diszkriminánst \(m\)-mel kifejezve: \(D=(${l1(2 * k, q, 'm')})^2-4m(${l1(k * k, s, 'm')})\), és oldd meg a \(D=0\) egyenletet.`,
      megoldas: [T`\[D=(${l1(2 * k, q, 'm')})^2-4m(${l1(k * k, s, 'm')})=${l1(4 * (k * q - s), q * q, 'm')}\]`, T`\[D=0\quad\Rightarrow\quad m=${ft(M)}\]`],
      _ell: w => egy((2 * k * w + q) ** 2 - 4 * w * (k * k * w + s), 0) };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mdiszkr',
    cim: 'A diszkrimináns és a gyökök száma',
    rovid: 'Diszkrimináns',
    bevezeto: T`Az egyenlet megoldása nélkül is eldönthető, hány valós gyöke van: ezt a \(D=b^2-4ac\) diszkrimináns előjele mutatja meg.`,
    elmelet: T`<div class="mathbox">\[ax^2+bx+c=0\quad (a\neq0),\qquad D=b^2-4ac\]</div>
<div class="tbl"><table><tr><th>Diszkrimináns</th><th>Valós gyökök száma</th><th>A parabola és az x tengely</th></tr>
<tr><td>\(D>0\)</td><td>két különböző gyök</td><td>két metszéspont</td></tr>
<tr><td>\(D=0\)</td><td>egy (kettős) gyök: \(x=-\frac{b}{2a}\)</td><td>érinti</td></tr>
<tr><td>\(D<0\)</td><td>nincs valós gyök</td><td>nincs közös pont</td></tr></table></div>
<div class="prose"><ul>
<li><b>Paraméteres feladat:</b> írd fel \(D\)-t a paraméterrel, majd oldd meg a \(D=0\), \(D>0\) vagy \(D<0\) feltételt.</li>
<li>Ha a paraméter a főegyütthatóban van, külön gondold meg az \(a=0\) esetet: ekkor az egyenlet nem másodfokú, hanem elsőfokú!</li>
<li>Ha \(a\) és \(c\) ellentétes előjelű, akkor \(-4ac>0\), így \(D>0\): biztosan két gyök van.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Ha \(D<0\), akkor az egyenletnek nincs valós gyöke.`, igaz: true, miert: T`A megoldóképletben negatív szám állna a gyökjel alatt.` },
      { allitas: T`Az \(x^2-4x+4=0\) egyenlet diszkriminánsa 0.`, igaz: true, miert: T`\(16-16=0\); a kettős gyök \(x=2\).` },
      { allitas: T`Ha az \(ax^2+bx+c=0\) egyenletben \(a\) és \(c\) ellentétes előjelű, akkor az egyenletnek két valós gyöke van.`, igaz: true, miert: T`\(ac<0\Rightarrow -4ac>0\Rightarrow D=b^2-4ac>0\).` },
      { allitas: T`A \(2x^2-3x+5=0\) egyenlet diszkriminánsa \(9+40=49\).`, igaz: false, miert: T`\(D=(-3)^2-4\cdot2\cdot5=9-40=-31\).` },
      { allitas: T`Ha \(D=0\), az egyenletnek nincs megoldása.`, igaz: false, miert: T`\(D=0\) esetén egy (kettős) gyök van: \(x=-\frac{b}{2a}\).` },
      { allitas: T`Az \(x^2+bx-1=0\) egyenletnek minden valós \(b\) esetén két különböző valós gyöke van.`, igaz: true, miert: T`\(D=b^2+4>0\).`, szint: 'emelt' },
      { allitas: T`Az \(ax^2+2x+1=0\) egyenletnek \(a=0\) esetén is lehet megoldása.`, igaz: true, miert: T`\(a=0\): \(2x+1=0\Rightarrow x=-\frac12\) (elsőfokú egyenlet).` },
      { general() { const [a, b, c] = egyenlet(P([-1, 0, 1])); const D = b * b - 4 * a * c; const kiir = R(0, 1) ? D : D + P([-8, -4, 4, 8]);
        return { allitas: T`\(${q2(a, b, c)}=0\): ennek az egyenletnek a diszkriminánsa \(${kiir}\).`, igaz: kiir === D, miert: T`\(${Dt(a, b, c)}\).` }; } },
      { general() { const s = P([-1, 0, 1]); const [a, b, c] = egyenlet(s); const n = s > 0 ? 2 : s === 0 ? 1 : 0; const kiir = R(0, 1) ? n : P([0, 1, 2].filter(x => x !== n));
        return { allitas: T`\(${q2(a, b, c)}=0\): ennek az egyenletnek ${kiir === 0 ? 'nincs valós gyöke' : kiir === 1 ? 'pontosan egy valós gyöke van' : 'két különböző valós gyöke van'}.`, igaz: kiir === n, miert: T`\(${Dt(a, b, c)}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Az \(x^2+bx+2=0\) egyenletben határozzuk meg \(b\) értékét úgy, hogy az egyenletnek a) két különböző, b) egy, c) nulla valós gyöke legyen!`,
      lepesek: [
        T`A diszkrimináns: \(D=b^2-4\cdot1\cdot2=b^2-8\).`,
        T`a) \(D>0\iff b^2>8\iff b<-2\sqrt2\) vagy \(b>2\sqrt2\).`,
        T`b) \(D=0\iff b^2=8\iff b=\pm2\sqrt2\).`,
        T`c) \(D<0\iff b^2<8\iff -2\sqrt2<b<2\sqrt2\).`
      ]
    },
    feladatok
  }));
})();
