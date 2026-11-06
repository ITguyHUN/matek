/*
 * 4. fejezet – A gyöktényezős alak. Gyökök és együtthatók közötti összefüggés (Viète-formulák)
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 3. lecke; FGY 2169–2176)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, zj, el, tg, sz, tortGyok, egyutthatok, kulonbozo, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;
  /* (d·x − n) tényező; r = n/d tört objektum */
  const tz = r => r.d === 1 ? (r.n === 0 ? 'x' : `(x${el(-r.n)})`) : `(${r.d}x${el(-r.n)})`;
  const tzBox = r => r.d === 1 ? T`(x+\square)` : T`(${r.d}x+\square)`;
  const gyok = () => R(0, 2) === 0 ? tortGyok(4) : F(R0(-9, 9), 1);
  const kT = k => k === 1 ? '' : k === -1 ? '-' : String(k);

  feladatok.szorzatta = { nev: 'Szorzattá alakítás', general() {
    const r1 = gyok(); let r2; do { r2 = gyok(); } while (fv(r2) === fv(r1) || (r1.d > 1 && r2.d > 1 && R(0, 1)));
    const k = P([1, 1, 1, 1, 2, -1, 3]);
    const a = k * r1.d * r2.d, b = -k * (r1.n * r2.d + r2.n * r1.d), c = k * r1.n * r2.n;
    if (Math.abs(a) > 20 || Math.abs(c) > 80) return feladatok.szorzatta.general();
    const melyik = R(0, 1); const rb = melyik ? r2 : r1;
    const jobb = kT(k) + (melyik ? tz(r1) + tzBox(r2) : tzBox(r1) + tz(r2));
    return { kerdes: T`<p>Alakítsd szorzattá a másodfokú kifejezést! Mi kerül a négyzet helyére?</p>\[${q2(a, b, c)}=${jobb}\]`,
      valasz: { ertekek: [-rb.n] }, formatum: FMT10.egesz,
      tipp: T`Keresd meg az \(${q2(a, b, c)}=0\) egyenlet gyökeit! Ha \(x_1\), \(x_2\) a gyökök, akkor \(ax^2+bx+c=a(x-x_1)(x-x_2)\).`,
      megoldas: [T`Az \(${q2(a, b, c)}=0\) egyenlet gyökei: \(x_1=${ft(r1)}\), \(x_2=${ft(r2)}\).`, T`\[${q2(a, b, c)}=${kT(a)}\left(x${el(F(-r1.n, r1.d))}\right)\left(x${el(F(-r2.n, r2.d))}\right)=${kT(k)}${tz(r1)}${tz(r2)}\]`],
      _ell: w => { const f = x => k * (rb === r1 ? (r1.d * x + w) * (r2.d * x - r2.n) : (r1.d * x - r1.n) * (r2.d * x + w)); return [0, 1, -2].every(x => egy(f(x), a * x * x + b * x + c)); } };
  } };

  feladatok.felir = { nev: 'Egyenlet felírása a gyökökből', general() {
    const t = R(0, 2);
    if (t < 2) { const [x1, x2] = kulonbozo(2, -10, 10); const p = -(x1 + x2), q = x1 * x2; const melyik = R(0, 1);
      return { kerdes: T`<p>Írj fel olyan \(x^2+px+q=0\) alakú egyenletet, amelynek gyökei \(${x1}\) és \(${x2}\)! Mennyi ${melyik ? T`\(q\)` : T`\(p\)`}?</p>`,
        valasz: { ertekek: [melyik ? q : p] }, formatum: FMT10.egesz,
        tipp: T`Gyöktényezős alak: \((x-x_1)(x-x_2)=0\). Vagy Viète-formulákkal: \(p=-(x_1+x_2)\), \(q=x_1x_2\).`,
        megoldas: [T`\[${tz(F(x1, 1))}${tz(F(x2, 1))}=0\quad\Rightarrow\quad ${q2(1, p, q)}=0\]`, T`Tehát \(p=${p}\), \(q=${q}\).`] }; }
    const r1 = tortGyok(4); let r2; do { r2 = R(0, 1) ? tortGyok(3) : F(R0(-6, 6), 1); } while (fv(r1) === fv(r2));
    const [a, b, c] = egyutthatok(r1, r2); const melyik = R(0, 1);
    return { kerdes: T`<p>Írj fel olyan egész együtthatós \(ax^2+bx+c=0\) egyenletet, amelynek gyökei \(${ft(r1)}\) és \(${ft(r2)}\), és \(a\) a lehető legkisebb pozitív egész! Mennyi ${melyik ? T`\(c\)` : T`\(b\)`}?</p>`,
      valasz: { ertekek: [melyik ? c : b] }, formatum: FMT10.egesz,
      tipp: T`Egy tört gyökhöz, például \(\frac{p}{q}\)-hoz, a \((qx-p)\) tényező tartozik. Szorozd össze a két tényezőt!`,
      megoldas: [T`\[${tz(r1)}${tz(r2)}=0\quad\Rightarrow\quad ${q2(a, b, c)}=0\]`, T`Tehát \(a=${a}\), \(b=${b}\), \(c=${c}\).`] };
  } };

  feladatok.viete = { nev: 'Viète-formulák', general() {
    let a, b, c; do { a = P([1, 1, 2, 3, -1, -2, 4, 5]); b = R0(-9, 9); c = R0(-9, 9); } while (b * b - 4 * a * c <= 0);
    const S = F(-b, a), Pr = F(c, a); const t = R(0, 5);
    const nev = ['a gyökök összegét', 'a gyökök szorzatát', T`a gyökök reciprokainak összegét \(\left(\frac{1}{x_1}+\frac{1}{x_2}\right)\)`, T`a gyökök négyzetösszegét \(\left(x_1^2+x_2^2\right)\)`, T`az \(x_1^2x_2+x_1x_2^2\) kifejezés értékét`, T`az \((x_1-x_2)^2\) kifejezés értékét`][t];
    let ans, lep;
    const sT = ft(S), pT = ft(Pr);
    if (t === 0) { ans = S; lep = T`\[x_1+x_2=-\frac{b}{a}=${sT}\]`; }
    else if (t === 1) { ans = Pr; lep = T`\[x_1x_2=\frac{c}{a}=${pT}\]`; }
    else if (t === 2) { ans = F(-b, c); lep = T`\[\frac{1}{x_1}+\frac{1}{x_2}=\frac{x_1+x_2}{x_1x_2}=\frac{${sT}}{${pT}}=${ft(ans)}\]`; }
    else if (t === 3) { ans = F(b * b - 2 * a * c, a * a); lep = T`\[x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2=\left(${sT}\right)^2-2\cdot ${zj(Pr)}=${ft(ans)}\]`; }
    else if (t === 4) { ans = F(-b * c, a * a); lep = T`\[x_1^2x_2+x_1x_2^2=x_1x_2(x_1+x_2)=${zj(Pr)}\cdot ${zj(S)}=${ft(ans)}\]`; }
    else { ans = F(b * b - 4 * a * c, a * a); lep = T`\[(x_1-x_2)^2=(x_1+x_2)^2-4x_1x_2=\left(${sT}\right)^2-4\cdot ${zj(Pr)}=${ft(ans)}\]`; }
    const D = Math.sqrt(b * b - 4 * a * c), x1 = (-b + D) / (2 * a), x2 = (-b - D) / (2 * a);
    const ell = [x1 + x2, x1 * x2, 1 / x1 + 1 / x2, x1 * x1 + x2 * x2, x1 * x1 * x2 + x1 * x2 * x2, (x1 - x2) ** 2][t];
    return { kerdes: T`<p>Az egyenlet megoldása nélkül határozd meg ${nev}!</p>\[${q2(a, b, c)}=0\]`,
      valasz: { ertekek: [fv(ans)] }, formatum: FMT10.tort,
      tipp: T`Viète: \(x_1+x_2=-\frac{b}{a}\), \(x_1x_2=\frac{c}{a}\). A kifejezést írd fel az összeg és a szorzat segítségével!`,
      megoldas: [T`\(D=${b * b - 4 * a * c}>0\), tehát két valós gyök van. \(x_1+x_2=${sT}\), \(x_1x_2=${pT}\).`, lep],
      _ell: w => Math.abs(w - ell) < 1e-6 };
  } };

  feladatok.masik = { nev: 'A másik gyök Viète-tel', general() {
    const x1 = R0(-8, 8); let x2; do { x2 = R0(-9, 9); } while (x2 === x1);
    const a = P([1, 1, 2, 3, -1]); const b = -a * (x1 + x2), c = a * x1 * x2; const t = R(0, 1);
    const kerdes = t ? T`<p>Az alábbi egyenlet egyik gyöke \(${x1}\). A gyökök összegének felhasználásával határozd meg a másik gyököt!</p>\[${q2(a, b, 0)}+c=0\]`
      : T`<p>Az alábbi egyenlet egyik gyöke \(${x1}\). A gyökök szorzatának felhasználásával határozd meg a másik gyököt!</p>\[${a === 1 ? '' : a === -1 ? '-' : a}x^2+bx${el(c)}=0\]`;
    return { kerdes, valasz: { ertekek: [x2] }, formatum: FMT10.egesz,
      tipp: t ? T`\(x_1+x_2=-\frac{b}{a}=${ft(F(-b, a))}\)` : T`\(x_1x_2=\frac{c}{a}=${ft(F(c, a))}\)`,
      megoldas: t ? [T`\[${x1}+x_2=${ft(F(-b, a))}\quad\Rightarrow\quad x_2=${x2}\]`, T`(Ebből \(c=${c}\).)`] : [T`\[${zj(x1)}\cdot x_2=${ft(F(c, a))}\quad\Rightarrow\quad x_2=${x2}\]`, T`(Ebből \(b=${b}\).)`],
      _ell: w => egy(w, x2) };
  } };

  feladatok.tort = { nev: 'Törtek egyszerűsítése', general() {
    const r0 = gyok(); let r1, r2; do { r1 = gyok(); r2 = F(R0(-8, 8), 1); } while (new Set([fv(r0), fv(r1), fv(r2)]).size < 3);
    const k1 = P([1, 1, 1, 2, -1]);
    const num = egyutthatok(r0, r1, 1).map(x => x * k1), den = egyutthatok(r0, r2, 1);
    if (Math.abs(num[0]) > 30 || Math.abs(den[0]) > 30) return feladatok.tort.general();
    const t = R(0, 2);
    // egyszerűsítés után: k1·tz(r1) / tz(r2) (a közös (d0 x − n0) tényező kiesik; egyutthatok() a > 0-ra normál)
    const sN = (num[0] / k1) / (r0.d * r1.d), sD = den[0] / (r0.d * r2.d);   // ±1 előjelkorrekció (normálás miatt)
    const kk = k1 * sN / sD;
    if (!Number.isInteger(kk)) return feladatok.tort.general();
    const fr = T`\frac{${q2(...num)}}{${q2(...den)}}`;
    if (t === 2) { const gyk = [fv(r0), fv(r2)].sort((x, y) => x - y);
      return { kerdes: T`<p>Mely \(x\) értékekre <b>nincs értelmezve</b> a tört? (Pontosvesszővel válaszd el őket.)</p>\[${fr}\]`,
        valasz: { ertekek: gyk }, formatum: FMT10.halmaz,
        tipp: 'A tört ott nincs értelmezve, ahol a nevező 0. Oldd meg a nevezőre felírt másodfokú egyenletet!',
        megoldas: [T`\[${q2(...den)}=0\quad\Rightarrow\quad x=${ft(r0)}\ \text{vagy}\ x=${ft(r2)}\]`],
        _ell: w => egy(den[0] * w * w + den[1] * w + den[2], 0) }; }
    const csupasz = x => x.replace(/^\((.*)\)$/, '$1');   // egyedül álló tényező: zárójel nélkül
    const szamlT = t === 0 ? tzBox(r1) : tz(r1), nevT = csupasz(t === 1 ? T`(x+\square)` : tz(r2));
    const ans = t === 0 ? -r1.n : -r2.n;
    return { kerdes: T`<p>Egyszerűsítsd a törtet! Mi kerül a négyzet helyére?</p>\[${fr}=\frac{${kk === 1 ? csupasz(szamlT) : kT(kk) + szamlT}}{${nevT}}\]`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: 'Alakítsd szorzattá a számlálót és a nevezőt is (a gyökeik segítségével), majd egyszerűsíts a közös tényezővel.',
      megoldas: [T`Számláló: \(${q2(...num)}=${kT(k1 * sN)}${tz(r0)}${tz(r1)}\)`, T`Nevező: \(${q2(...den)}=${kT(sD)}${tz(r0)}${tz(r2)}\)`, T`\[${fr}=\frac{${kT(kk)}${tz(r1)}}{${tz(r2)}}\qquad\left(x\neq ${ft(r0)},\ x\neq ${r2.n}\right)\]`] };
  } };

  feladatok.feltetel = { nev: 'Feltétel a gyökökre', szint: 'emelt', general() {
    const t = R(0, 1);
    if (t === 0) { const q = -R(1, 20); const p0 = R0(-8, 8); const S = p0 * p0 - 2 * q;
      return { kerdes: T`<p>Határozd meg \(p\) értékét úgy, hogy az \(x^2+px${el(q)}=0\) egyenlet \(x_1\), \(x_2\) gyökeire teljesüljön: \(x_1^2+x_2^2=${S}\)! (Minden megoldást adj meg.)</p>`,
        valasz: { ertekek: [-Math.abs(p0), Math.abs(p0)] }, formatum: FMT10.halmaz,
        tipp: T`\(x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2\), és Viète szerint \(x_1+x_2=-p\), \(x_1x_2=${q}\).`,
        megoldas: [T`\[x_1^2+x_2^2=(-p)^2-2\cdot ${zj(q)}=p^2${el(-2 * q)}=${S}\]`, T`\[p^2=${p0 * p0}\quad\Rightarrow\quad p=\pm${Math.abs(p0)}\]`, T`Mivel \(c=${q}<0\), a diszkrimináns minden \(p\)-re pozitív, tehát valóban vannak valós gyökök.`],
        _ell: w => egy(w * w - 2 * q, S) }; }
    const x1 = R0(-6, 6), m = P([2, 3, -2, -3, 4]); const x2 = m * x1; const p = -(x1 + x2), q = x1 * x2;
    return { kerdes: T`<p>Az \(x^2${tg(p)}+q=0\) egyenlet egyik gyöke ${m > 0 ? M10.szerese(m) : `(${m})` + M10.szerese(-m).slice(String(-m).length)} a másiknak. Mennyi \(q\)?</p>`,
      valasz: { ertekek: [q] }, formatum: FMT10.egesz,
      tipp: T`Legyen a gyökök \(t\) és \(${m}t\). Viète: \(t+${zj(m)}t=${-p}\), ebből \(t\), majd \(q=t\cdot ${zj(m)}t\).`,
      megoldas: [T`\[t+${zj(m)}t=${1 + m}t=${-p}\quad\Rightarrow\quad t=${x1}\]`, T`A gyökök: \(${x1}\) és \(${x2}\), tehát \(q=${x1}\cdot ${zj(x2)}=${q}\).`],
      _ell: w => { const D = p * p - 4 * w; if (D < 0) return false; const s = Math.sqrt(D), a1 = (-p + s) / 2, a2 = (-p - s) / 2; return egy(a1, m * a2) || egy(a2, m * a1); } };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mviete',
    cim: 'Gyöktényezős alak, Viète-formulák',
    rovid: 'Gyöktényezős alak, Viète',
    bevezeto: T`Ha ismerjük a gyököket, a másodfokú kifejezést szorzattá alakíthatjuk – és fordítva: a gyökök összege és szorzata az egyenlet megoldása nélkül is leolvasható az együtthatókból.`,
    elmelet: T`<div class="mathbox">\[ax^2+bx+c=a(x-x_1)(x-x_2)\qquad\text{(gyöktényezős alak)}\]</div>
<div class="mathbox">\[x_1+x_2=-\frac{b}{a},\qquad x_1\cdot x_2=\frac{c}{a}\qquad\text{(Viète-formulák)}\]</div>
<div class="prose"><ul>
<li>Gyöktényezős alak csak akkor írható fel, ha van valós gyök (\(D\ge0\)).</li>
<li>Tört gyök: \(x_1=\frac{p}{q}\) esetén a tényező \((qx-p)\). Például \(2x^2-3x-2=(2x+1)(x-2)\).</li>
<li>Hasznos átalakítások: \(x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2\); \(\frac1{x_1}+\frac1{x_2}=\frac{x_1+x_2}{x_1x_2}\); \((x_1-x_2)^2=(x_1+x_2)^2-4x_1x_2\).</li>
<li>Egyenlet felírása: ha a gyökök \(x_1\) és \(x_2\), akkor \(x^2-(x_1+x_2)x+x_1x_2=0\).</li>
<li>Tört egyszerűsítése: a számlálót és a nevezőt is alakítsd szorzattá, és csak <b>tényezővel</b> egyszerűsíts!</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(x^2-5x+6=(x-2)(x-3)\)`, igaz: true, miert: T`A gyökök 2 és 3.` },
      { allitas: T`\(2x^2-3x-2=(x+\frac12)(x-2)\)`, igaz: false, miert: T`Hiányzik a főegyüttható: \(2(x+\frac12)(x-2)=(2x+1)(x-2)\).` },
      { allitas: T`Az \(x^2+3x-10=0\) egyenlet gyökeinek összege 3.`, igaz: false, miert: T`\(x_1+x_2=-\frac{b}{a}=-3\).` },
      { allitas: T`A \(2x^2+5x-1=0\) egyenlet gyökeinek szorzata \(-\frac12\).`, igaz: true, miert: T`\(x_1x_2=\frac{c}{a}=\frac{-1}{2}\).` },
      { allitas: T`Az \(x^2+x+5=0\) egyenlet gyökeinek összege \(-1\), szorzata 5.`, igaz: false, miert: T`\(D=1-20<0\): nincsenek valós gyökök, így valós gyökökről nem beszélhetünk.`, szint: 'emelt' },
      { allitas: T`\(\frac{x^2-4}{x-2}=x+2\) minden valós \(x\)-re.`, igaz: false, miert: T`Az \(x=2\) helyen a bal oldal nincs értelmezve. Az egyenlőség csak \(x\neq2\) esetén igaz.` },
      { allitas: T`\(\frac{x^2+5x}{x}=x^2+5\)`, igaz: false, miert: T`Csak tényezővel lehet egyszerűsíteni: \(\frac{x(x+5)}{x}=x+5\) (\(x\neq0\)).` },
      { general() { const [x1, x2] = kulonbozo(2, -8, 8); const jo = R(0, 1) === 1; const s = jo ? x1 + x2 : -(x1 + x2);
        return { allitas: T`\(${q2(1, -(x1 + x2), x1 * x2)}=0\): ennek az egyenletnek a gyökösszege \(${s}\).`, igaz: s === x1 + x2, miert: T`\(x_1+x_2=-\frac{b}{a}=${x1 + x2}\) (a gyökök \(${x1}\) és \(${x2}\)).` }; } },
      { general() { const [x1, x2] = kulonbozo(2, -8, 8); const jo = R(0, 1) === 1; const q = jo ? x1 * x2 : -x1 * x2;
        return { allitas: T`Ha egy \(x^2+px+q=0\) egyenlet gyökei \(${x1}\) és \(${x2}\), akkor \(q=${q}\).`, igaz: q === x1 * x2, miert: T`\(q=x_1x_2=${x1 * x2}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egyszerűsítsük: \(\dfrac{2x^2-3x-2}{x^2-4}\)`,
      lepesek: [
        T`A számláló gyökei (\(2x^2-3x-2=0\)): \(x_1=2\), \(x_2=-\frac12\). Így \(2x^2-3x-2=2(x-2)\left(x+\frac12\right)=(x-2)(2x+1)\).`,
        T`A nevező: \(x^2-4=(x-2)(x+2)\). Értelmezés: \(x\neq2\), \(x\neq-2\).`,
        T`\[\frac{2x^2-3x-2}{x^2-4}=\frac{(x-2)(2x+1)}{(x-2)(x+2)}=\frac{2x+1}{x+2}\]`
      ]
    },
    feladatok
  }));
})();
