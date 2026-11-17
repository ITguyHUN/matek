/*
 * 10. fejezet – Vektorok a koordináta-rendszerben (Sokszínű matematika 10., Vektorok 1–4. lecke)
 * Témakör: Trigonometria (11. évfolyam) · segédfüggvények: TR (tananyag/11/kurzus.js)
 */
(function () {
  const { n2, v2 } = TR;
  const feladatok = {};
  const R0 = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
  const zj = x => x < 0 ? `(${x})` : String(x);
  const vT = (n, v) => T`\vec{${n}}(${v[0]};\ ${v[1]})`;
  const kT = (k, v, elso) => (k < 0 ? '-' : elso ? '' : '+') + (Math.abs(k) === 1 ? '' : Math.abs(k)) + T`\vec{${v}}`;
  const melyik = () => R(0, 1);   // 0: első, 1: második koordináta
  const KN = ['első', 'második'];

  feladatok.vkMuvelet = { nev: 'Műveletek koordinátákkal', general() {
    const a = [R(-9, 9), R(-9, 9)], b = [R(-9, 9), R(-9, 9)]; const p = R0(-4, 4), q = R0(-4, 4); const i = melyik();
    const c = [p * a[0] + q * b[0], p * a[1] + q * b[1]];
    return { kerdes: T`<p>\(${vT('a', a)}\) és \(${vT('b', b)}\). Mennyi a \(\vec c=${kT(p, 'a', true)}${kT(q, 'b', false)}\) vektor <b>${KN[i]}</b> koordinátája?</p>`,
      valasz: { ertekek: [c[i]] }, formatum: 'egész szám',
      tipp: 'Számmal szorzásnál minden koordinátát szorzol, összeadásnál a megfelelő koordinátákat adod össze.',
      megoldas: [T`\[\vec c=${p}\cdot(${a[0]};\ ${a[1]})${q < 0 ? '' : '+'}${q}\cdot(${b[0]};\ ${b[1]})=(${c[0]};\ ${c[1]})\]`, `A ${KN[i]} koordináta: ${c[i]}.`.replace('-', '−')] };
  } };

  feladatok.vkPontok = { nev: 'Vektor két pontból, hossz', general() {
    const A = [R(-9, 9), R(-9, 9)], B = [R(-9, 9), R(-9, 9)]; const d = [B[0] - A[0], B[1] - A[1]]; if (d[0] === 0 && d[1] === 0) return this.general();
    const sq = d[0] ** 2 + d[1] ** 2, L = Math.sqrt(sq), egesz = Number.isInteger(L);
    if (R(0, 1)) { const i = melyik(); return { kerdes: T`<p>\(A(${A[0]};\ ${A[1]})\) és \(B(${B[0]};\ ${B[1]})\). Mennyi az \(\overrightarrow{AB}\) vektor ${KN[i]} koordinátája?</p>`,
      valasz: { ertekek: [d[i]] }, formatum: 'egész szám', tipp: T`\(\overrightarrow{AB}=B-A\): a végpont koordinátáiból vonjuk ki a kezdőpontéit.`,
      megoldas: [T`\[\overrightarrow{AB}=(${B[0]}-${zj(A[0])};\ ${B[1]}-${zj(A[1])})=(${d[0]};\ ${d[1]})\]`] }; }
    return { kerdes: T`<p>Milyen hosszú az \(AB\) szakasz, ha \(A(${A[0]};\ ${A[1]})\) és \(B(${B[0]};\ ${B[1]})\)?${egesz ? '' : ' (Két tizedesjegyre)'}</p>`,
      valasz: egesz ? { ertekek: [L] } : v2(L), formatum: egesz ? 'szám' : 'tizedes tört',
      tipp: T`\(|\overrightarrow{AB}|=\sqrt{(b_1-a_1)^2+(b_2-a_2)^2}\).`,
      megoldas: [T`\[\overrightarrow{AB}=(${d[0]};\ ${d[1]}),\qquad |\overrightarrow{AB}|=\sqrt{${zj(d[0])}^{2}+${zj(d[1])}^{2}}=\sqrt{${sq}}${egesz ? '=' + L : T`\approx ${n2(L)}`}\]`] };
  } };

  feladatok.vkFelezo = { nev: 'Felezőpont, súlypont', general() {
    const i = melyik();
    if (R(0, 1)) { const A = [R(-9, 9), R(-9, 9)], B = [R(-9, 9), R(-9, 9)]; const Fp = [F(A[0] + B[0], 2), F(A[1] + B[1], 2)];
      return { kerdes: T`<p>\(A(${A[0]};\ ${A[1]})\) és \(B(${B[0]};\ ${B[1]})\). Mennyi az \(AB\) szakasz felezőpontjának ${KN[i]} koordinátája?</p>`,
        valasz: { ertekek: [fv(Fp[i])] }, formatum: FMT.frac, tipp: T`A felezőpont koordinátái a végpontok koordinátáinak átlagai: \(F\left(\frac{a_1+b_1}{2};\ \frac{a_2+b_2}{2}\right)\).`,
        megoldas: [T`\[F\left(\frac{${A[0]}+${zj(B[0])}}{2};\ \frac{${A[1]}+${zj(B[1])}}{2}\right)=F\left(${ft(Fp[0])};\ ${ft(Fp[1])}\right)\]`] }; }
    const A = [R(-9, 9), R(-9, 9)], B = [R(-9, 9), R(-9, 9)], C = [R(-9, 9), R(-9, 9)]; const S = [F(A[0] + B[0] + C[0], 3), F(A[1] + B[1] + C[1], 3)];
    return { kerdes: T`<p>Egy háromszög csúcsai \(A(${A[0]};\ ${A[1]})\), \(B(${B[0]};\ ${B[1]})\), \(C(${C[0]};\ ${C[1]})\). Mennyi a súlypont ${KN[i]} koordinátája?</p>`,
      valasz: { ertekek: [fv(S[i])] }, formatum: FMT.frac, tipp: T`A súlypont koordinátái a csúcsok koordinátáinak átlagai: \(S\left(\frac{a_1+b_1+c_1}{3};\ \frac{a_2+b_2+c_2}{3}\right)\).`,
      megoldas: [T`\[S\left(\frac{${A[0]}+${zj(B[0])}+${zj(C[0])}}{3};\ \frac{${A[1]}+${zj(B[1])}+${zj(C[1])}}{3}\right)=S\left(${ft(S[0])};\ ${ft(S[1])}\right)\]`] };
  } };

  feladatok.vkFelbont = { nev: 'Felbontás két vektorra', general() {
    const a = [R(-6, 6), R(-6, 6)], b = [R(-6, 6), R(-6, 6)]; const det = a[0] * b[1] - a[1] * b[0]; if (det === 0) return this.general();
    const x = R(-4, 4), y = R(-4, 4); if (x === 0 && y === 0) return this.general(); const c = [x * a[0] + y * b[0], x * a[1] + y * b[1]];
    const kerd = R(0, 1) ? 'x' : 'y';
    return { kerdes: T`<p>Írd fel a \(${vT('c', c)}\) vektort \(\vec c=x\cdot\vec a+y\cdot\vec b\) alakban, ahol \(${vT('a', a)}\) és \(${vT('b', b)}\)! Mennyi \(${kerd}\)?</p>`,
      valasz: { ertekek: [kerd === 'x' ? x : y] }, formatum: 'szám',
      tipp: 'Írd fel koordinátánként: két egyenletből álló, kétismeretlenes lineáris egyenletrendszert kapsz x-re és y-ra.',
      megoldas: [T`\[\begin{cases}${a[0]}x${b[0] < 0 ? '' : '+'}${b[0]}y=${c[0]}\\ ${a[1]}x${b[1] < 0 ? '' : '+'}${b[1]}y=${c[1]}\end{cases}\quad\Rightarrow\quad x=${x},\ y=${y}\]`] };
  } };

  feladatok.vkParhuzamos = { nev: 'Párhuzamosság, egyenlőség', general() {
    if (R(0, 1)) { const b = [R0(-9, 9), R0(-9, 9)]; const fix = R0(-9, 9); const hol = R(0, 1); const p = F(fix * b[hol], b[1 - hol]);
      const aT = hol === 0 ? T`(p;\ ${fix})` : T`(${fix};\ p)`;
      return { kerdes: T`<p>Milyen \(p\) esetén párhuzamos az \(\vec a${aT}\) és a \(${vT('b', b)}\) vektor?</p>`, valasz: { ertekek: [fv(p)] }, formatum: FMT.frac,
        tipp: T`Párhuzamos vektorok koordinátái arányosak: \(\frac{a_1}{b_1}=\frac{a_2}{b_2}\), azaz \(a_1b_2-a_2b_1=0\).`,
        megoldas: [T`\[${hol === 0 ? T`p\cdot ${zj(b[1])}-${zj(fix)}\cdot ${zj(b[0])}` : T`${zj(fix)}\cdot ${zj(b[1])}-p\cdot ${zj(b[0])}`}=0\quad\Rightarrow\quad p=${ft(p)}\]`] }; }
    // ABCD paralelogramma negyedik csúcsa: D = A + C − B
    const A = [R(-8, 8), R(-8, 8)], B = [R(-8, 8), R(-8, 8)], C = [R(-8, 8), R(-8, 8)]; if ((B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]) === 0) return this.general();
    const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; const i = melyik();
    return { kerdes: T`<p>Az \(ABCD\) paralelogramma három csúcsa \(A(${A[0]};\ ${A[1]})\), \(B(${B[0]};\ ${B[1]})\), \(C(${C[0]};\ ${C[1]})\). Mennyi a \(D\) csúcs ${KN[i]} koordinátája?</p>`,
      valasz: { ertekek: [D[i]] }, formatum: 'egész szám', tipp: T`Paralelogrammában \(\overrightarrow{AD}=\overrightarrow{BC}\), tehát \(D=A+(C-B)\).`,
      megoldas: [T`\[\overrightarrow{BC}=(${C[0] - B[0]};\ ${C[1] - B[1]}),\qquad D=A+\overrightarrow{BC}=(${D[0]};\ ${D[1]})\]`] };
  } };

  Tananyag.fejezet({
    id: 'trigk3',
    cim: 'Vektorok a koordináta-rendszerben (ismétlés)',
    rovid: 'Vektorok',
    bevezeto: T`A skaláris szorzathoz és a koordináta-geometriához szükséges 10.-es alapok: vektorműveletek koordinátákkal, felezőpont, súlypont, felbontás.`,
    elmelet: T`<div class="prose"><p>Az \(\vec i(1;\ 0)\) és \(\vec j(0;\ 1)\) bázisvektorokkal minden síkvektor egyértelműen felírható: \(\vec a=a_1\vec i+a_2\vec j\), ekkor \(\vec a(a_1;\ a_2)\).</p></div>
<div class="mathbox">\[\vec a+\vec b=(a_1+b_1;\ a_2+b_2)\qquad \lambda\vec a=(\lambda a_1;\ \lambda a_2)\qquad |\vec a|=\sqrt{a_1^2+a_2^2}\qquad \overrightarrow{AB}=(b_1-a_1;\ b_2-a_2)\]</div>
<div class="prose"><ul><li>Felezőpont: \(F\left(\frac{a_1+b_1}{2};\ \frac{a_2+b_2}{2}\right)\); súlypont: \(S\left(\frac{a_1+b_1+c_1}{3};\ \frac{a_2+b_2+c_2}{3}\right)\).</li>
<li>Párhuzamos vektorok: \(\vec a=\lambda\vec b\), azaz a koordináták arányosak.</li>
<li>Két nem párhuzamos vektorral bármely síkvektor egyértelműen felbontható: \(\vec c=x\vec a+y\vec b\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`Az \((2;\ 3)\) és a \((4;\ 6)\) vektor párhuzamos.`, igaz: true, miert: T`\((4;\ 6)=2\cdot(2;\ 3)\).` },
      { allitas: T`\(A(1;\ 2)\), \(B(4;\ 6)\) esetén \(AB=5\).`, igaz: true, miert: T`\(\sqrt{3^2+4^2}=5\).` },
      { allitas: T`\(\overrightarrow{AB}=A-B\)`, igaz: false, miert: T`\(\overrightarrow{AB}=B-A\): végpontból a kezdőpont.` },
      { allitas: T`A \((0;\ 0)\), \((6;\ 0)\), \((0;\ 6)\) csúcsú háromszög súlypontja \((2;\ 2)\).`, igaz: true, miert: T`\(\left(\frac{6}{3};\ \frac{6}{3}\right)\).` },
      { allitas: T`\(|\vec a+\vec b|=|\vec a|+|\vec b|\) mindig.`, igaz: false, miert: T`Csak azonos irányú vektoroknál; általában \(|\vec a+\vec b|\le|\vec a|+|\vec b|\) (háromszög-egyenlőtlenség).` }
    ],
    mintapelda: {
      feladat: T`Bontsd fel a \(\vec c(7;\ 0)\) vektort az \(\vec a(1;\ 2)\) és \(\vec b(3;\ -1)\) vektorok irányába!`,
      lepesek: [
        T`\(\vec c=x\vec a+y\vec b\): \(x+3y=7\) és \(2x-y=0\).`,
        T`A második egyenletből \(y=2x\); behelyettesítve \(7x=7\), \(x=1\), \(y=2\).`,
        T`\(\vec c=\vec a+2\vec b\). Ellenőrzés: \((1;2)+(6;-2)=(7;0)\). ✓`
      ]
    },
    feladatok
  });
})();
