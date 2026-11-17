/*
 * 8. fejezet – Vektorok skaláris szorzata (emelt szint)
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 * A 2024-től érvényes követelmények szerint a skaláris szorzat csak az emelt szintű érettségi része.
 */
(function () {
  const { cosD, acosD, kerek, tiz, sz, fk, hossz, szog, FH } = M11;
  const feladatok = {};
  const R0 = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
  const vT = (n, x, y) => T`\vec{${n}}(${x};\,${y})`;
  const zj = x => x < 0 ? T`(${x})` : String(x);

  feladatok.definicio = { nev: 'Skaláris szorzat a definícióból', general() {
    if (R(0, 1)) { const a = R(2, 12), b = R(2, 12), fi = P([0, 60, 90, 120, 180, 60, 120]), v = a * b * Math.round(cosD(fi) * 2) / 2;
      return { kerdes: T`<p>Két vektor hossza \(|\vec a|=${a}\) és \(|\vec b|=${b}\), hajlásszögük \(${fi}^\circ\). Számítsd ki pontosan \(\vec a\cdot\vec b\) értékét!</p>`,
        valasz: { ertekek: [v] }, formatum: 'szám (pontos érték)', tipp: T`\(\vec a\cdot\vec b=|\vec a|\cdot|\vec b|\cdot\cos\varphi\).`,
        megoldas: [T`\[\vec a\cdot\vec b=${a}\cdot ${b}\cdot\cos ${fi}^\circ=${a * b}\cdot ${zj(nt(Math.round(cosD(fi) * 2) / 2))}=${nt(v)}\]`] }; }
    const a = tiz(1, 12, 1), b = tiz(1, 12, 1), fi = R(5, 175), v = a * b * cosD(fi);
    return { kerdes: T`<p>Két vektor hossza \(|\vec a|=${sz(a, 1)}\) és \(|\vec b|=${sz(b, 1)}\), hajlásszögük \(${fi}^\circ\). Mekkora a skaláris szorzatuk?</p>`,
      valasz: { ertekek: [kerek(v, 2)], tol: Math.max(0.02, Math.abs(v) * 0.004), forma: 'tizedes' }, formatum: FH.hossz, tipp: T`\(\vec a\cdot\vec b=|\vec a|\cdot|\vec b|\cdot\cos\varphi\). Tompaszögnél negatív!`,
      megoldas: [T`\[\vec a\cdot\vec b=${sz(a, 1)}\cdot ${sz(b, 1)}\cdot\cos ${fi}^\circ\approx ${sz(v)}\]`] };
  } };

  feladatok.koordinata = { nev: 'Skaláris szorzat koordinátákból', general() {
    const a1 = R(-9, 9), a2 = R(-9, 9), b1 = R(-9, 9), b2 = R(-9, 9); if (!(a1 || a2) || !(b1 || b2)) return this.general();
    const v = a1 * b1 + a2 * b2;
    return { kerdes: T`<p>Számítsd ki a vektorok skaláris szorzatát!</p>\[${vT('a', a1, a2)}\qquad ${vT('b', b1, b2)}\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
      tipp: T`\(\vec a\cdot\vec b=a_1b_1+a_2b_2\).`, megoldas: [T`\[\vec a\cdot\vec b=${zj(a1)}\cdot ${zj(b1)}+${zj(a2)}\cdot ${zj(b2)}=${a1 * b1}${a2 * b2 < 0 ? '' : '+'}${a2 * b2}=${v}\]`] };
  } };

  feladatok.hajlasszog = { nev: 'Két vektor hajlásszöge', general() {
    const a1 = R(-8, 8), a2 = R(-8, 8), b1 = R(-8, 8), b2 = R(-8, 8); if (!(a1 || a2) || !(b1 || b2)) return this.general();
    const sk = a1 * b1 + a2 * b2, la = Math.hypot(a1, a2), lb = Math.hypot(b1, b2), c = sk / (la * lb); if (Math.abs(Math.abs(c) - 1) < 1e-9) return this.general();
    const fi = acosD(c);
    return { kerdes: T`<p>Mekkora szöget zár be a két vektor?</p>\[${vT('a', a1, a2)}\qquad ${vT('b', b1, b2)}\]`, valasz: szog(fi), formatum: FH.szog,
      tipp: T`\(\cos\varphi=\frac{\vec a\cdot\vec b}{|\vec a|\cdot|\vec b|}\), ahol \(|\vec a|=\sqrt{a_1^2+a_2^2}\).`,
      megoldas: [T`\[\vec a\cdot\vec b=${sk},\qquad |\vec a|=\sqrt{${a1 * a1 + a2 * a2}},\qquad |\vec b|=\sqrt{${b1 * b1 + b2 * b2}}\]`, T`\[\cos\varphi=\frac{${sk}}{\sqrt{${a1 * a1 + a2 * a2}}\cdot\sqrt{${b1 * b1 + b2 * b2}}}\approx ${sz(c, 4)}\quad\Rightarrow\quad\varphi\approx ${fk(fi)}\]`] };
  } };

  feladatok.meroleges = { nev: 'Merőlegesség paraméterrel', general() {
    const b1 = R0(-6, 6), b2 = R0(-6, 6), a2 = R(-9, 9), hol = R(0, 1);
    /* a(p; a2) ⟂ b(b1; b2): p·b1 + a2·b2 = 0  →  p = −a2·b2 / b1 */
    const p = F(-a2 * b2, b1);
    const aT = hol ? T`\vec a(p;\,${a2})` : T`\vec a(${a2};\,p)`, bT = hol ? vT('b', b1, b2) : vT('b', b2, b1);
    return { kerdes: T`<p>Milyen \(p\) értékre merőleges egymásra a két vektor?</p>\[${aT}\qquad ${bT}\]`, valasz: { ertekek: [fv(p)] }, formatum: FMT.frac,
      tipp: T`Két (nem nulla) vektor pontosan akkor merőleges, ha a skaláris szorzatuk 0.`,
      megoldas: [T`\[${hol ? T`p\cdot ${zj(b1)}+${zj(a2)}\cdot ${zj(b2)}` : T`${zj(a2)}\cdot ${zj(b2)}+p\cdot ${zj(b1)}`}=0\quad\Rightarrow\quad ${b1}p=${-a2 * b2}\quad\Rightarrow\quad p=${ft(p)}\]`] };
  } };

  feladatok.hossz = { nev: 'Összeg, különbség hossza', general() {
    const a = R(2, 12), b = R(2, 12), fi = P([60, 120, 90, 45, 135, 30, 150, R(20, 160)]), plusz = R(0, 1);
    const v = Math.sqrt(a * a + b * b + (plusz ? 2 : -2) * a * b * cosD(fi));
    return { kerdes: T`<p>\(|\vec a|=${a}\), \(|\vec b|=${b}\), a két vektor hajlásszöge \(${fi}^\circ\). Milyen hosszú az \(\vec a${plusz ? '+' : '-'}\vec b\) vektor?</p>`,
      valasz: hossz(v), formatum: FH.hossz,
      tipp: T`\(|\vec a${plusz ? '+' : '-'}\vec b|^2=(\vec a${plusz ? '+' : '-'}\vec b)^2=|\vec a|^2${plusz ? '+' : '-'}2\,\vec a\cdot\vec b+|\vec b|^2\).`,
      megoldas: [T`\[|\vec a${plusz ? '+' : '-'}\vec b|^2=${a}^2+${b}^2${plusz ? '+' : '-'}2\cdot ${a}\cdot ${b}\cdot\cos ${fi}^\circ\approx ${sz(v * v)}\quad\Rightarrow\quad|\vec a${plusz ? '+' : '-'}\vec b|\approx ${sz(v)}\]`] };
  } };

  feladatok.haromszog = { nev: 'Háromszög szöge koordinátákból', general() {
    const pt = () => [R(-6, 8), R(-6, 8)]; const A = pt(), B = pt(), C = pt();
    const u = [B[0] - A[0], B[1] - A[1]], w = [C[0] - A[0], C[1] - A[1]], kr = u[0] * w[1] - u[1] * w[0];
    if (Math.abs(kr) < 4) return this.general();
    const sk = u[0] * w[0] + u[1] * w[1], c = sk / (Math.hypot(...u) * Math.hypot(...w)), fi = acosD(c);
    return { kerdes: T`<p>Mekkora az \(ABC\) háromszög \(A\) csúcsánál lévő szöge?</p>\[A(${A[0]};\,${A[1]})\qquad B(${B[0]};\,${B[1]})\qquad C(${C[0]};\,${C[1]})\]`,
      valasz: szog(fi), formatum: FH.szog,
      tipp: T`Az \(A\)-nál lévő szög az \(\overrightarrow{AB}\) és az \(\overrightarrow{AC}\) vektor hajlásszöge. (Vektor koordinátái: végpont − kezdőpont.)`,
      megoldas: [T`\[\overrightarrow{AB}(${u[0]};\,${u[1]}),\qquad\overrightarrow{AC}(${w[0]};\,${w[1]})\]`, T`\[\cos\alpha=\frac{${sk}}{\sqrt{${u[0] ** 2 + u[1] ** 2}}\cdot\sqrt{${w[0] ** 2 + w[1] ** 2}}}\approx ${sz(c, 4)}\quad\Rightarrow\quad\alpha\approx ${fk(fi)}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig08',
    cim: 'Vektorok skaláris szorzata',
    rovid: 'Skaláris szorzat',
    szint: 'emelt',
    bevezeto: 'Két vektorból egy számot képző művelet, amellyel szög, merőlegesség és hossz is számolható. (A 2024-től érvényes követelmények szerint emelt szintű anyag.)',
    elmelet: T`<div class="prose"><p><b>Definíció.</b> Két vektor skaláris szorzata a hosszuk és a hajlásszögük koszinuszának szorzata:</p></div>
<div class="mathbox">\[\vec a\cdot\vec b=|\vec a|\cdot|\vec b|\cdot\cos\varphi\qquad\text{koordinátákkal:}\qquad\vec a\cdot\vec b=a_1b_1+a_2b_2\]</div>
<div class="prose"><ul><li>Az eredmény <b>szám</b> (nem vektor). Hegyesszögnél pozitív, derékszögnél 0, tompaszögnél negatív.</li>
<li><b>Merőlegesség:</b> \(\vec a\perp\vec b\iff\vec a\cdot\vec b=0\) (nem nulla vektorokra).</li>
<li>\(\vec a\cdot\vec a=|\vec a|^2\), így \(|\vec a|=\sqrt{a_1^2+a_2^2}\).</li>
<li><b>Hajlásszög:</b> \(\cos\varphi=\frac{\vec a\cdot\vec b}{|\vec a|\cdot|\vec b|}\).</li>
<li>Tulajdonságok: \(\vec a\cdot\vec b=\vec b\cdot\vec a\), \((\lambda\vec a)\cdot\vec b=\lambda(\vec a\cdot\vec b)\), \(\vec a\cdot(\vec b+\vec c)=\vec a\cdot\vec b+\vec a\cdot\vec c\).</li>
<li>Ezekből: \(|\vec a\pm\vec b|^2=|\vec a|^2\pm 2\,\vec a\cdot\vec b+|\vec b|^2\) – ez éppen a koszinusztétel.</li></ul></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`Két vektor skaláris szorzata vektor.`, igaz: false, miert: 'A skaláris szorzat szám (skalár).' },
      { allitas: T`Ha \(\vec a\cdot\vec b\lt 0\), akkor a két vektor tompaszöget zár be.`, igaz: true, miert: T`A hosszak pozitívak, így \(\cos\varphi\lt 0\).` },
      { allitas: T`Az \(\vec a(2;\,3)\) és \(\vec b(3;\,-2)\) vektorok merőlegesek.`, igaz: true, miert: T`\(2\cdot 3+3\cdot(-2)=0\).` },
      { allitas: T`\(\vec a\cdot\vec a=|\vec a|\)`, igaz: false, miert: T`\(\vec a\cdot\vec a=|\vec a|^2\).` },
      { allitas: T`Egységvektorok skaláris szorzata a hajlásszögük koszinusza.`, igaz: true, miert: T`\(1\cdot 1\cdot\cos\varphi\).` },
      { allitas: T`Ha \(\vec a\cdot\vec b=\vec a\cdot\vec c\) és \(\vec a\ne\vec 0\), akkor \(\vec b=\vec c\).`, igaz: false, miert: 'Csak annyi következik, hogy a b − c vektor merőleges a-ra.' },
      { allitas: T`\((\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2\)`, igaz: true, miert: 'A disztributivitás és a kommutativitás miatt a vegyes tagok kiesnek.' },
      { general() { const a1 = R(-5, 5), a2 = R(-5, 5), b1 = R(-5, 5), b2 = R(-5, 5), v = a1 * b1 + a2 * b2, jo = R(0, 1), w = jo ? v : v + P([-2, -1, 1, 2]);
        return { allitas: T`Az \(\vec a(${a1};\,${a2})\) és \(\vec b(${b1};\,${b2})\) vektorok skaláris szorzata \(${w}\).`, igaz: !!jo, miert: T`\(${zj(a1)}\cdot ${zj(b1)}+${zj(a2)}\cdot ${zj(b2)}=${v}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Mekkora szöget zár be az \(\vec a(3;\,4)\) és a \(\vec b(-5;\,12)\) vektor?`,
      lepesek: [
        T`\[\vec a\cdot\vec b=3\cdot(-5)+4\cdot 12=33\]`,
        T`\[|\vec a|=\sqrt{9+16}=5,\qquad|\vec b|=\sqrt{25+144}=13\]`,
        T`\[\cos\varphi=\frac{33}{5\cdot 13}=\frac{33}{65}\approx 0{,}5077\quad\Rightarrow\quad\varphi\approx 59{,}5^\circ\]`
      ]
    },
    feladatok
  });
})();
