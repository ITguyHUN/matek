/*
 * 3. fejezet – A háromszög területe (trigonometrikus területképlet)
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 */
(function () {
  const { sinD, asinD, kerek, tiz, sz, fk, hossz, szog, FH, abraHaromszog } = M11;
  const feladatok = {};
  /* oldalpárok a közbezárt szöggel */
  const PAR = [['a', 'b', T`\gamma`], ['b', 'c', T`\alpha`], ['a', 'c', T`\beta`]];
  const szogNev = { [T`\gamma`]: 'γ', [T`\alpha`]: 'α', [T`\beta`]: 'β' };

  feladatok.terulet = { nev: 'Terület két oldalból és a közbezárt szögből', general() {
    const [x, y, g] = P(PAR);
    if (R(0, 3) === 0) {   /* pontos eset: 30°, 150° vagy 90° */
      const a = R(3, 24), b = R(3, 24), fi = P([30, 150, 90]), Tr = a * b * sinD(fi) / 2;
      return { kerdes: T`<p>Egy háromszögben \(${x}=${a}\) cm, \(${y}=${b}\) cm, a két oldal által bezárt szög \(${g}=${fi}^\circ\). Mekkora a háromszög területe?</p>`,
        valasz: { ertekek: [kerek(Tr, 2)], tol: 0.02 }, formatum: 'cm², pontos érték (egész vagy tizedes tört)',
        tipp: T`\(T=\frac{${x}\cdot ${y}\cdot\sin ${g}}{2}\); ${fi === 90 ? T`\(\sin 90^\circ=1\)` : T`\(\sin ${fi}^\circ=\frac12\)`}.`,
        megoldas: [T`\[T=\frac{${a}\cdot ${b}\cdot\sin ${fi}^\circ}{2}=\frac{${a}\cdot ${b}\cdot ${fi === 90 ? '1' : T`\frac12`}}{2}=${nt(kerek(Tr, 2))}\ \text{cm}^2\]`] };
    }
    const a = tiz(2, 25, 1), b = tiz(2, 25, 1), fi = R(0, 1) ? R(10, 170) : tiz(10, 170, 1), Tr = a * b * sinD(fi) / 2;
    return { kerdes: T`<p>Egy háromszögben \(${x}=${sz(a, 1)}\) cm, \(${y}=${sz(b, 1)}\) cm, és \(${g}=${fk(fi)}\). Mekkora a háromszög területe?</p>`,
      valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz,
      tipp: T`A \(${g}\) éppen a \(${x}\) és a \(${y}\) oldal által bezárt szög, ezért \(T=\frac{${x}\cdot ${y}\cdot\sin ${g}}{2}\).${fi > 90 ? ' Tompaszög szinusza is pozitív, a képlet ugyanúgy működik.' : ''}`,
      megoldas: [T`\[T=\frac{${x}\cdot ${y}\cdot\sin ${g}}{2}=\frac{${sz(a, 1)}\cdot ${sz(b, 1)}\cdot\sin ${fk(fi)}}{2}\approx ${sz(Tr)}\ \text{cm}^2\]`] };
  } };

  feladatok.oldal = { nev: 'Hiányzó oldal a területből', general() {
    const [x, y, g] = P(PAR); const a = tiz(2, 20, 1), fi = R(15, 165), b = tiz(2, 20, 1), Tr = kerek(a * b * sinD(fi) / 2, 2);
    const bb = 2 * Tr / (a * sinD(fi));
    return { kerdes: T`<p>Egy háromszög területe \(${sz(Tr)}\ \text{cm}^2\), egyik oldala \(${x}=${sz(a, 1)}\) cm, és \(${g}=${fi}^\circ\), ahol \(${g}\) ${M11.nv(x)} \(${x}\) és ${M11.nv(y)} \(${y}\) oldal által bezárt szög. Milyen hosszú ${M11.nv(y)} \(${y}\) oldal?</p>`,
      valasz: hossz(bb), formatum: 'cm, ' + FH.hossz,
      tipp: T`Írd fel a területképletet, és fejezd ki belőle ${M11.nv(y)} \(${y}\) oldalt: \(${y}=\frac{2T}{${x}\cdot\sin ${g}}\).`,
      megoldas: [T`\[${sz(Tr)}=\frac{${sz(a, 1)}\cdot ${y}\cdot\sin ${fi}^\circ}{2}\quad\Rightarrow\quad ${y}=\frac{2\cdot ${sz(Tr)}}{${sz(a, 1)}\cdot\sin ${fi}^\circ}\approx ${sz(bb)}\ \text{cm}\]`] };
  } };

  feladatok.szog = { nev: 'A közbezárt szög a területből', general() {
    const [x, y, g] = P(PAR); const a = tiz(3, 20, 1), b = tiz(3, 20, 1);
    let s; do { s = R(10, 95) / 100; } while (s > 0.97);
    const Tr = kerek(a * b * s / 2, 2), sv = 2 * Tr / (a * b); if (sv >= 0.985) return this.general();
    const f1 = asinD(sv);
    return { kerdes: T`<p>Egy háromszögben \(${x}=${sz(a, 1)}\) cm, \(${y}=${sz(b, 1)}\) cm, a terület \(${sz(Tr)}\ \text{cm}^2\). Mekkora lehet a két oldal által bezárt \(${g}\) szög?</p><p>Add meg az összes lehetséges értéket!</p>`,
      valasz: szog(f1, 180 - f1), formatum: FH.szogok,
      tipp: T`\(\sin ${g}=\frac{2T}{${x}\cdot ${y}}\). Ne feledd: egy szinuszértékhez \(0^\circ\) és \(180^\circ\) között két szög tartozik!`,
      megoldas: [T`\[\sin ${g}=\frac{2T}{${x}\cdot ${y}}=\frac{2\cdot ${sz(Tr)}}{${sz(a, 1)}\cdot ${sz(b, 1)}}\approx ${sz(sv, 4)}\]`, T`\[${g}_1\approx ${fk(f1)}\qquad ${g}_2=180^\circ-${g}_1\approx ${fk(180 - f1)}\]`, T`Mindkét szöggel létezik ilyen háromszög: egyszer hegyesszög, egyszer tompaszög a \(${g}\).`] };
  } };

  feladatok.negyszog = { nev: 'Paralelogramma, rombusz, szabályos sokszög', general() {
    const eset = R(0, 3);
    if (eset === 0) { const a = tiz(3, 20, 1), b = tiz(3, 20, 1), al = R(20, 160), Tr = a * b * sinD(al);
      return { kerdes: T`<p>Egy paralelogramma két szomszédos oldala \(${sz(a, 1)}\) cm és \(${sz(b, 1)}\) cm, az általuk bezárt szög \(${al}^\circ\). Mekkora a paralelogramma területe?</p>`,
        valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz, tipp: 'Az egyik átló a paralelogrammát két egybevágó háromszögre bontja; mindkettő területe a·b·sin α / 2.',
        megoldas: [T`\[T=a\cdot b\cdot\sin\alpha=${sz(a, 1)}\cdot ${sz(b, 1)}\cdot\sin ${al}^\circ\approx ${sz(Tr)}\ \text{cm}^2\]`] }; }
    if (eset === 1) { const a = tiz(3, 15, 1), s = R(20, 95) / 100, Tr = kerek(a * a * s, 2), al = asinD(Tr / (a * a));
      return { kerdes: T`<p>Egy rombusz oldala \(${sz(a, 1)}\) cm, területe \(${sz(Tr)}\ \text{cm}^2\). Mekkora a rombusz hegyesszöge?</p>`,
        valasz: szog(al), formatum: FH.szog, tipp: T`A rombusz területe \(T=a^2\cdot\sin\alpha\). A tompaszögének szinusza ugyanennyi, de most a hegyesszöget kérdezzük.`,
        megoldas: [T`\[\sin\alpha=\frac{T}{a^2}=\frac{${sz(Tr)}}{${sz(a, 1)}^2}\approx ${sz(Tr / (a * a), 4)}\quad\Rightarrow\quad\alpha\approx ${fk(al)}\]`] }; }
    if (eset === 2) { const n = P([5, 6, 8, 9, 10, 12]), r = tiz(2, 15, 1), Tr = n * r * r * sinD(360 / n) / 2;
      return { kerdes: T`<p>Egy szabályos ${n}-szög köré írt körének sugara \(${sz(r, 1)}\) cm. Mekkora a sokszög területe?</p>`,
        valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz, tipp: T`A középpontot a csúcsokkal összekötve ${n} egybevágó egyenlő szárú háromszöget kapsz. A szárak hossza \(r\), a szárszög \(\frac{360^\circ}{${n}}\).`,
        megoldas: [T`\[\varphi=\frac{360^\circ}{${n}}=${fk(360 / n)}\qquad T=${n}\cdot\frac{r^2\sin\varphi}{2}=${n}\cdot\frac{${sz(r, 1)}^2\cdot\sin ${fk(360 / n)}}{2}\approx ${sz(Tr)}\ \text{cm}^2\]`] }; }
    const b = tiz(3, 20, 1), al = R(15, 80), fi = 180 - 2 * al, Tr = b * b * sinD(fi) / 2;
    return { kerdes: T`<p>Egy egyenlő szárú háromszög szára \(${sz(b, 1)}\) cm, az alapon fekvő szögei \(${al}^\circ\)-osak. Mekkora a háromszög területe?</p>`,
      valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz, tipp: 'Számold ki a két szár által bezárt szöget (a szárszöget) a belső szögek összegéből, aztán használd a területképletet a két szárral.',
      megoldas: [T`\[\text{szárszög}=180^\circ-2\cdot ${al}^\circ=${fi}^\circ\]`, T`\[T=\frac{b^2\cdot\sin ${fi}^\circ}{2}=\frac{${sz(b, 1)}^2\cdot\sin ${fi}^\circ}{2}\approx ${sz(Tr)}\ \text{cm}^2\]`] };
  } };

  feladatok.osszetett = { nev: 'Terület vegyes adatokból', general() {
    const eset = R(0, 2);
    if (eset === 0) { /* két oldal és két szög: előbb a harmadik szög kell */
      const a = tiz(3, 20, 1), al = R(25, 80), be = R(25, 80), ga = 180 - al - be, b = kerek(a * sinD(be) / sinD(al), 1), Tr = a * b * sinD(ga) / 2;
      return { kerdes: T`<p>Egy háromszögben \(a=${sz(a, 1)}\) cm, \(b=${sz(b, 1)}\) cm, \(\alpha=${al}^\circ\) és \(\beta=${be}^\circ\). Mekkora a háromszög területe?</p>`,
        valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz, tipp: T`Az \(a\) és \(b\) oldal által bezárt szög a \(\gamma\). Előbb számold ki: \(\gamma=180^\circ-\alpha-\beta\).`,
        megoldas: [T`\[\gamma=180^\circ-${al}^\circ-${be}^\circ=${ga}^\circ\]`, T`\[T=\frac{a\cdot b\cdot\sin\gamma}{2}=\frac{${sz(a, 1)}\cdot ${sz(b, 1)}\cdot\sin ${ga}^\circ}{2}\approx ${sz(Tr)}\ \text{cm}^2\]`] }; }
    if (eset === 1) { /* derékszögű háromszögből: magasság */
      const c = tiz(4, 25, 1), al = R(15, 75), Tr = c * c * sinD(al) * M11.cosD(al) / 2;
      return { kerdes: T`<p>Egy derékszögű háromszög átfogója \(${sz(c, 1)}\) cm, egyik hegyesszöge \(${al}^\circ\). Mekkora a területe?</p>`,
        valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz, tipp: 'Számold ki a két befogót (c·sin α és c·cos α), a terület a szorzatuk fele.',
        megoldas: [T`\[a=c\sin ${al}^\circ\approx ${sz(c * sinD(al))},\quad b=c\cos ${al}^\circ\approx ${sz(c * M11.cosD(al))}\]`, T`\[T=\frac{a\cdot b}{2}\approx ${sz(Tr)}\ \text{cm}^2\]`] }; }
    /* telek: négyszög egy átlóval két háromszögre */
    const e = R(20, 80), p = R(15, 60), q = R(15, 60), f1 = R(30, 150), f2 = R(30, 150), T1 = e * p * sinD(f1) / 2, T2 = e * q * sinD(f2) / 2;
    return { kerdes: T`<p>Egy négyszög alakú telek \(AC\) átlója \(${e}\) m. Az \(ABC\) háromszögben \(AB=${p}\) m és \(BAC\sphericalangle=${f1}^\circ\); az \(ACD\) háromszögben \(AD=${q}\) m és \(CAD\sphericalangle=${f2}^\circ\). Mekkora a telek területe? (A telek konvex négyszög.)</p>`,
      valasz: hossz(T1 + T2), formatum: 'm², ' + FH.hossz, tipp: 'Az átló két háromszögre bontja a telket. Mindkettőben ismert két oldal és a közbezárt szög.',
      megoldas: [T`\[T_1=\frac{${e}\cdot ${p}\cdot\sin ${f1}^\circ}{2}\approx ${sz(T1)}\qquad T_2=\frac{${e}\cdot ${q}\cdot\sin ${f2}^\circ}{2}\approx ${sz(T2)}\]`, T`\[T=T_1+T_2\approx ${sz(T1 + T2)}\ \text{m}^2\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig03',
    cim: 'A háromszög területe két oldalból és a közbezárt szögből',
    rovid: 'Háromszög területe',
    bevezeto: 'Ha ismerjük két oldalt és az általuk bezárt szöget, a háromszög területe magasság nélkül is kiszámítható.',
    elmelet: T`<div class="prose">${abraHaromszog()}<p>Az \(a\) oldalhoz tartozó magasság a \(C\) csúcsból: \(m_a=b\cdot\sin\gamma\) (tompa \(\gamma\) esetén is, mert \(\sin(180^\circ-\gamma)=\sin\gamma\)). Ezt a \(T=\frac{a\cdot m_a}{2}\) képletbe írva:</p></div>
<div class="mathbox">\[T=\frac{a\cdot b\cdot\sin\gamma}{2}=\frac{b\cdot c\cdot\sin\alpha}{2}=\frac{a\cdot c\cdot\sin\beta}{2}\]</div>
<div class="prose"><p>Mindig <b>két oldal</b> és az <b>általuk bezárt szög</b> kell! Ha a szög nem a két ismert oldal között van, előbb ki kell számolni a megfelelő szöget (belső szögek összege, szinusztétel).</p>
<ul><li><b>Paralelogramma:</b> \(T=a\cdot b\cdot\sin\alpha\); <b>rombusz:</b> \(T=a^2\sin\alpha\).</li>
<li><b>Szabályos \(n\)-szög</b> a köré írt kör \(r\) sugarából: \(T=n\cdot\frac{r^2\sin\frac{360^\circ}{n}}{2}\).</li>
<li><b>Visszafelé:</b> ha a terület és a két oldal adott, \(\sin\gamma=\frac{2T}{ab}\). Ebből két szög is adódhat (\(\gamma\) és \(180^\circ-\gamma\)), mindkettő jó lehet.</li>
<li>A területet adott szög mellett \(\gamma=90^\circ\) teszi a legnagyobbá: \(\sin\gamma\le 1\).</li></ul></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`Ha egy háromszögben \(a=6\), \(b=10\) és \(\gamma=30^\circ\), akkor a területe 15.`, igaz: true, miert: T`\(T=\frac{6\cdot 10\cdot\frac12}{2}=15\).` },
      { allitas: T`A \(T=\frac{ab\sin\gamma}{2}\) képlet tompaszögű háromszögre nem használható.`, igaz: false, miert: 'Tompaszög szinusza is pozitív, a képlet minden háromszögre érvényes.' },
      { allitas: T`Két háromszögben \(a=5\), \(b=8\), az egyikben \(\gamma=50^\circ\), a másikban \(\gamma=130^\circ\). A két háromszög területe egyenlő.`, igaz: true, miert: T`\(\sin 50^\circ=\sin 130^\circ\).` },
      { allitas: T`Ha két oldal hosszát rögzítjük, a háromszög területe akkor a legnagyobb, ha a közbezárt szög \(90^\circ\).`, igaz: true, miert: T`\(\sin\gamma\le 1\), egyenlőség csak \(90^\circ\)-nál.` },
      { allitas: T`Ha a közbezárt szöget kétszeresére növeljük (két oldal változatlan), a terület is kétszeresére nő.`, igaz: false, miert: T`A terület \(\sin\gamma\)-val arányos, nem \(\gamma\)-val. Pl. \(\sin 60^\circ\ne 2\sin 30^\circ\).` },
      { allitas: T`Egy 6 cm oldalú rombusz területe, ha egyik szöge \(150^\circ\), \(18\ \text{cm}^2\).`, igaz: true, miert: T`\(T=6^2\cdot\sin 150^\circ=36\cdot\frac12=18\).` },
      { allitas: T`A paralelogramma területe \(\frac{a\cdot b\cdot\sin\alpha}{2}\).`, igaz: false, miert: 'A paralelogramma két egybevágó háromszögből áll, így T = a·b·sin α (nincs osztás 2-vel).' },
      { allitas: T`Ha a két oldal mindegyikét kétszeresére növeljük (a szög változatlan), a terület négyszeresére nő.`, igaz: true, miert: T`\(\frac{2a\cdot 2b\cdot\sin\gamma}{2}=4\cdot\frac{ab\sin\gamma}{2}\).` },
      { allitas: T`Egy egyenlő oldalú, 4 cm oldalú háromszög területe \(4\sqrt3\ \text{cm}^2\).`, igaz: true, miert: T`\(T=\frac{4\cdot 4\cdot\sin 60^\circ}{2}=8\cdot\frac{\sqrt3}{2}=4\sqrt3\).` },
      { allitas: T`Ha \(T=10\), \(a=5\), \(b=8\), akkor \(\gamma\) csak \(30^\circ\) lehet.`, igaz: false, miert: T`\(\sin\gamma=\frac{20}{40}=\frac12\), így \(\gamma=30^\circ\) vagy \(\gamma=150^\circ\).` },
      { general() { const a = R(2, 12), b = R(2, 12), fi = P([30, 150]), jo = R(0, 1), Tv = a * b / 4 * (jo ? 1 : 2);
        return { allitas: T`Ha \(a=${a}\), \(b=${b}\) és \(\gamma=${fi}^\circ\), akkor a háromszög területe \(${nt(Tv)}\).`, igaz: !!jo, miert: T`\(T=\frac{${a}\cdot ${b}\cdot\sin ${fi}^\circ}{2}=\frac{${a * b}\cdot\frac12}{2}=${nt(a * b / 4)}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy háromszög két oldala 7 cm és 9 cm, területe \(25\ \text{cm}^2\). Mekkora lehet a két oldal által bezárt szög?`,
      lepesek: [
        T`\[25=\frac{7\cdot 9\cdot\sin\gamma}{2}\quad\Rightarrow\quad\sin\gamma=\frac{50}{63}\approx 0{,}7937\]`,
        T`\[\gamma_1=\sin^{-1}0{,}7937\approx 52{,}5^\circ\]`,
        T`\[\gamma_2=180^\circ-52{,}5^\circ=127{,}5^\circ\]`,
        'Mindkét szöggel létezik háromszög, mindkettőnek 25 cm² a területe. Válasz: kb. 52,5° vagy 127,5°.'
      ]
    },
    grafikon: M11.haromszog({ mod: 'terulet' }),
    grafikonCim: 'Háromszög két oldallal és a közbezárt szöggel',
    grafikonTag: 'figyeld a területet',
    feladatok
  });
})();
