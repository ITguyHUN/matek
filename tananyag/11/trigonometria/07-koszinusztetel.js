/*
 * 5. fejezet – A koszinusztétel
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 */
(function () {
  const { nv, sinD, cosD, acosD, kerek, tiz, sz, fk, hossz, szog, FH, EIS, PIT, abraHaromszog } = M11;
  const feladatok = {};
  /* betűk: a keresett oldal (o) a szemközti szöggel (s), a másik két oldal (p, q) */
  const K = [{ o: 'a', s: T`\alpha`, p: 'b', q: 'c' }, { o: 'b', s: T`\beta`, p: 'a', q: 'c' }, { o: 'c', s: T`\gamma`, p: 'a', q: 'b' }];
  const zj = x => x < 0 ? T`\left(${nt(x)}\right)` : nt(x);

  feladatok.oldal = { nev: 'Harmadik oldal (két oldal és a közbezárt szög)', general() {
    const L = P(K);
    if (R(0, 2) === 0) { const g = P([60, 120]); const [p, q, o] = P(EIS[g]);
      return { kerdes: T`<p>Egy háromszögben \(${L.p}=${p}\) cm, \(${L.q}=${q}\) cm és \(${L.s}=${g}^\circ\). Milyen hosszú ${nv(L.o)} \(${L.o}\) oldal? (Pontos értéket kapsz.)</p>`,
        valasz: { ertekek: [o] }, formatum: 'cm, egész szám',
        tipp: T`Koszinusztétel: \(${L.o}^2=${L.p}^2+${L.q}^2-2${L.p}${L.q}\cos ${L.s}\); \(\cos ${g}^\circ=${g === 60 ? T`\frac12` : T`-\frac12`}\).`,
        megoldas: [T`\[${L.o}^2=${p}^2+${q}^2-2\cdot ${p}\cdot ${q}\cdot\cos ${g}^\circ=${p * p}+${q * q}${g === 60 ? '-' : '+'}${p * q}=${o * o}\]`, T`\[${L.o}=\sqrt{${o * o}}=${o}\ \text{cm}\]`] }; }
    const p = tiz(2, 25, 1), q = tiz(2, 25, 1), g = R(0, 1) ? R(10, 170) : tiz(10, 170, 1);
    const o2 = p * p + q * q - 2 * p * q * cosD(g), o = Math.sqrt(o2);
    return { kerdes: T`<p>Egy háromszögben \(${L.p}=${sz(p, 1)}\) cm, \(${L.q}=${sz(q, 1)}\) cm és \(${L.s}=${fk(g)}\). Milyen hosszú ${nv(L.o)} \(${L.o}\) oldal?</p>`,
      valasz: hossz(o), formatum: 'cm, ' + FH.hossz,
      tipp: T`Két oldal és a közbezárt szög adott → koszinusztétel. ${g > 90 ? 'Tompaszög koszinusza negatív, így a −2bc·cos α tag pozitív lesz!' : ''}`,
      megoldas: [T`\[${L.o}^2=${sz(p, 1)}^2+${sz(q, 1)}^2-2\cdot ${sz(p, 1)}\cdot ${sz(q, 1)}\cdot\cos ${fk(g)}\approx ${sz(o2, 2)}\]`, T`\[${L.o}\approx\sqrt{${sz(o2, 2)}}\approx ${sz(o)}\ \text{cm}\]`] };
  } };

  /* érvényes háromszög három oldallal */
  function haromOldal() { let a, b, c; do { a = R(3, 30); b = R(3, 30); c = R(3, 30); } while (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1); return [a, b, c]; }
  feladatok.szog = { nev: 'Szög három oldalból', general() {
    const L = P(K); let o, p, q, pontos = false;
    if (R(0, 3) === 0) { const g = P([60, 120]); [p, q, o] = P(EIS[g]); pontos = true; } else { [o, p, q] = haromOldal(); }
    const cv = (p * p + q * q - o * o) / (2 * p * q), s = acosD(cv);
    return { kerdes: T`<p>Egy háromszög oldalai \(${L.o}=${o}\) cm, \(${L.p}=${p}\) cm és \(${L.q}=${q}\) cm. Mekkora ${nv(L.s)} \(${L.s}\) szög?</p>`,
      valasz: pontos ? { ertekek: [Math.round(s)] } : szog(s), formatum: pontos ? 'fokban (pontos érték)' : FH.szog,
      tipp: T`A \(${L.s}\) szöggel szemközti oldal ${nv(L.o)} \(${L.o}\). Írd fel rá a koszinusztételt, és fejezd ki \(\cos ${L.s}\)-t: \(\cos ${L.s}=\frac{${L.p}^2+${L.q}^2-${L.o}^2}{2${L.p}${L.q}}\).`,
      megoldas: [T`\[${o}^2=${p}^2+${q}^2-2\cdot ${p}\cdot ${q}\cdot\cos ${L.s}\]`, T`\[\cos ${L.s}=\frac{${p * p}+${q * q}-${o * o}}{${2 * p * q}}=\frac{${p * p + q * q - o * o}}{${2 * p * q}}${pontos ? '' : T`\approx ${sz(cv, 4)}`}\]`,
        pontos ? T`\[\cos ${L.s}=${cv > 0 ? T`\frac12` : T`-\frac12`}\quad\Rightarrow\quad ${L.s}=${Math.round(s)}^\circ\]` : T`\[${L.s}\approx ${fk(s)}\]`] };
  } };

  feladatok.tipus = { nev: 'Hegyes-, derék- vagy tompaszögű?', general() {
    let o; const eset = R(0, 2);
    if (eset === 1) { const [x, y, z] = P(PIT), k = R(1, 3); o = [x * k, y * k, z * k]; }
    else { o = haromOldal(); const m = Math.max(...o); const rest = o.filter((_, i) => i !== o.indexOf(m)); if (rest[0] ** 2 + rest[1] ** 2 === m * m) return this.general(); }
    o.sort(() => Math.random() - 0.5);
    const m = Math.max(...o), i = o.indexOf(m), r = o.filter((_, j) => j !== i), d = r[0] ** 2 + r[1] ** 2 - m * m;
    const helyes = d > 0 ? 0 : d === 0 ? 1 : 2;
    return { kerdes: T`<p>Egy háromszög oldalai \(${o[0]}\), \(${o[1]}\) és \(${o[2]}\) egység. Milyen a háromszög a szögei szerint?</p>`,
      valasz: { valasztas: ['hegyesszögű', 'derékszögű', 'tompaszögű'], helyes },
      tipp: T`Csak a legnagyobb szöget kell vizsgálni, az a leghosszabb oldallal szemben van. A koszinusztételből: ha \(c^2\lt a^2+b^2\), a szög hegyes; ha egyenlő, derékszög; ha nagyobb, tompa.`,
      megoldas: [T`A leghosszabb oldal \(${m}\): \(${m}^2=${m * m}\), a másik kettő négyzetösszege \(${r[0]}^2+${r[1]}^2=${r[0] ** 2 + r[1] ** 2}\).`,
        T`${d > 0 ? T`\(${m * m}\lt ${r[0] ** 2 + r[1] ** 2}\)` : d === 0 ? T`\(${m * m}=${r[0] ** 2 + r[1] ** 2}\)` : T`\(${m * m}\gt ${r[0] ** 2 + r[1] ** 2}\)`}, így a legnagyobb szög koszinusza ${d > 0 ? 'pozitív: a háromszög hegyesszögű' : d === 0 ? '0: a háromszög derékszögű' : 'negatív: a háromszög tompaszögű'}.`] };
  } };

  feladatok.masodfoku = { nev: 'Oldal, ha nem a közbezárt szög adott', general() {
    const g = P([60, 60, 120]); const [a, b, c] = P(EIS[g].filter(t => t[2] <= 40));
    /* L.s: az adott szög, L.o: vele szemközti (ismert) oldal, L.p: ismert szomszédos oldal, L.q: keresett oldal */
    const L = P(K), q = L.q, pp = L.p;
    const gyokok = g === 60 ? [b, a - b].filter(x => x > 0) : [b];
    const egyedi = [...new Set(gyokok)].sort((x, y) => x - y);
    const C = a * a - c * c, Bk = g === 60 ? -a : a;
    const egyT = T`${q}^2${Bk < 0 ? '-' : '+'}${Math.abs(Bk)}${q}${C === 0 ? '' : (C > 0 ? '+' : '-') + Math.abs(C)}=0`;
    return { kerdes: T`<p>Egy háromszögben \(${pp}=${a}\) cm, \(${L.o}=${c}\) cm és \(${L.s}=${g}^\circ\). Milyen hosszú lehet ${nv(q)} \(${q}\) oldal?</p><p>Add meg az összes lehetséges értéket!</p>`,
      valasz: { ertekek: egyedi }, formatum: 'cm, egész szám(ok), pontosvesszővel elválasztva',
      tipp: T`Írd fel a koszinusztételt ${nv(L.o)} \(${L.o}\) oldalra (vele szemben van ${nv(L.s)} \(${L.s}\)): ez \(${q}\)-ra nézve másodfokú egyenlet. A negatív gyök nem lehet oldalhossz.`,
      megoldas: [T`\[${c}^2=${a}^2+${q}^2-2\cdot ${a}\cdot ${q}\cdot\cos ${g}^\circ\quad\Rightarrow\quad ${c * c}=${a * a}+${q}^2${g === 60 ? '-' : '+'}${a}${q}\]`, T`\[${egyT}\]`,
        g === 60 ? (egyedi.length === 2 ? T`\(${q}_1=${egyedi[0]}\), \(${q}_2=${egyedi[1]}\); mindkettő pozitív, így két háromszög is megfelel.` : T`Gyökök: \(${q}_1=${b}\) és \(${q}_2=${a - b}\). Ez utóbbi nem pozitív, így csak \(${q}=${b}\) cm jó.`)
          : T`Gyökök: \(${q}_1=${b}\) és \(${q}_2=${-a - b}\). Csak a pozitív jó: \(${q}=${b}\) cm.`] };
  } };

  feladatok.atlo = { nev: 'Paralelogramma átlója, erők eredője', general() {
    const eset = R(0, 2);
    if (eset < 2) { const a = tiz(3, 20, 1), b = tiz(3, 20, 1), al = R(25, 85), rovid = eset === 0;
      const e = Math.sqrt(a * a + b * b - 2 * a * b * cosD(al)), f = Math.sqrt(a * a + b * b + 2 * a * b * cosD(al));
      return { kerdes: T`<p>Egy paralelogramma két szomszédos oldala \(${sz(a, 1)}\) cm és \(${sz(b, 1)}\) cm, hegyesszöge \(${al}^\circ\). Milyen hosszú a ${rovid ? 'rövidebb' : 'hosszabb'} átlója?</p>`,
        valasz: hossz(rovid ? e : f), formatum: 'cm, ' + FH.hossz,
        tipp: rovid ? 'A rövidebb átló a hegyesszöggel szemben van: a két oldal és a hegyesszög egy háromszöget alkot.' : T`A hosszabb átló a tompaszöggel (\(180^\circ-${al}^\circ\)) szemben van.`,
        megoldas: rovid ? [T`\[e^2=${sz(a, 1)}^2+${sz(b, 1)}^2-2\cdot ${sz(a, 1)}\cdot ${sz(b, 1)}\cdot\cos ${al}^\circ\approx ${sz(e * e)}\quad\Rightarrow\quad e\approx ${sz(e)}\ \text{cm}\]`]
          : [T`\[f^2=${sz(a, 1)}^2+${sz(b, 1)}^2-2\cdot ${sz(a, 1)}\cdot ${sz(b, 1)}\cdot\cos ${180 - al}^\circ\approx ${sz(f * f)}\quad\Rightarrow\quad f\approx ${sz(f)}\ \text{cm}\]`] }; }
    const F1 = R(20, 300), F2 = R(20, 300), fi = R(20, 160), Re = Math.sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * cosD(fi));
    return { kerdes: T`<p>Egy testre egy pontban két erő hat: \(${F1}\) N és \(${F2}\) N nagyságú, a hatásvonalaik \(${fi}^\circ\)-os szöget zárnak be. Mekkora az eredő erő nagysága?</p>`,
      valasz: hossz(Re), formatum: 'N, ' + FH.hossz,
      tipp: T`Az eredő a két erővektor által kifeszített paralelogramma átlója. Az erőháromszögben a két erővel szemközti szög nem \(${fi}^\circ\), hanem \(180^\circ-${fi}^\circ\)!`,
      megoldas: [T`\[F^2=${F1}^2+${F2}^2-2\cdot ${F1}\cdot ${F2}\cdot\cos ${180 - fi}^\circ\approx ${sz(Re * Re)}\]`, T`\[F\approx ${sz(Re)}\ \text{N}\]`] };
  } };

  feladatok.szoveges = { nev: 'Távolság két irányból', general() {
    const eset = R(0, 1);
    if (eset === 0) { const v1 = R(10, 40), v2 = R(10, 40), t = P([0.5, 1, 1.5, 2, 2.5, 3]), fi = R(30, 150);
      const s1 = v1 * t, s2 = v2 * t, d = Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * cosD(fi));
      return { kerdes: T`<p>Egy kikötőből egyszerre indul két hajó, egyenes pályán. Az egyik \(${v1}\ \frac{\text{km}}{\text{h}}\), a másik \(${v2}\ \frac{\text{km}}{\text{h}}\) sebességgel halad, a pályáik \(${fi}^\circ\)-os szöget zárnak be. Milyen messze lesznek egymástól \(${nt(t)}\) óra múlva?</p>`,
        valasz: hossz(d), formatum: 'km, ' + FH.hossz, tipp: 'Számold ki, mekkora utat tett meg a két hajó; ez két oldal, a közbezárt szög a pályák szöge.',
        megoldas: [T`\[s_1=${v1}\cdot ${nt(t)}=${nt(s1)}\ \text{km},\qquad s_2=${v2}\cdot ${nt(t)}=${nt(s2)}\ \text{km}\]`, T`\[d^2=${nt(s1)}^2+${nt(s2)}^2-2\cdot ${nt(s1)}\cdot ${nt(s2)}\cdot\cos ${fi}^\circ\approx ${sz(d * d)}\quad\Rightarrow\quad d\approx ${sz(d)}\ \text{km}\]`] }; }
    const p = R(50, 600), q = R(50, 600), fi = R(25, 155), d = Math.sqrt(p * p + q * q - 2 * p * q * cosD(fi));
    return { kerdes: T`<p>Egy tó két szélén álló \(A\) és \(B\) fa távolságát akarjuk meghatározni. Egy \(C\) pontból \(CA=${p}\) m és \(CB=${q}\) m, az \(ACB\) szög \(${fi}^\circ\). Milyen messze van egymástól a két fa?</p>`,
      valasz: hossz(d), formatum: 'm, ' + FH.hossz, tipp: 'Két oldal és a közbezárt szög ismert: koszinusztétel.',
      megoldas: [T`\[AB^2=${p}^2+${q}^2-2\cdot ${p}\cdot ${q}\cdot\cos ${fi}^\circ\approx ${sz(d * d, 1)}\quad\Rightarrow\quad AB\approx ${sz(d)}\ \text{m}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig05',
    cim: 'A koszinusztétel',
    rovid: 'Koszinusztétel',
    bevezeto: 'A Pitagorasz-tétel általánosítása: bármely háromszögben kiszámítható a harmadik oldal két oldalból és a közbezárt szögből, illetve a szögek a három oldalból.',
    elmelet: T`<div class="prose">${abraHaromszog()}<p><b>Koszinusztétel.</b> Bármely háromszögben egy oldal négyzete egyenlő a másik két oldal négyzetösszegéből kivonva a két oldal és az általuk bezárt szög koszinuszának kétszeres szorzatát:</p></div>
<div class="mathbox">\[c^2=a^2+b^2-2ab\cos\gamma\qquad a^2=b^2+c^2-2bc\cos\alpha\qquad b^2=a^2+c^2-2ac\cos\beta\]</div>
<div class="prose"><ul><li>\(\gamma=90^\circ\) esetén \(\cos\gamma=0\), és visszakapjuk a Pitagorasz-tételt.</li>
<li><b>Mikor használjuk?</b> (1) Két oldal és a közbezárt szög adott → a harmadik oldal. (2) Három oldal adott → bármelyik szög: \[\cos\gamma=\frac{a^2+b^2-c^2}{2ab}\] Itt a koszinuszból a szög egyértelmű (negatív érték → tompaszög), nincs „két megoldás” csapda.</li>
<li><b>Melyik szög?</b> Mindig az az oldal áll a bal oldalon, amelyikkel a szög szemben van.</li>
<li><b>Hegyes, derék vagy tompa?</b> A leghosszabb oldallal (\(c\)) szemközti szög: \(c^2\lt a^2+b^2\) → hegyesszög, \(c^2=a^2+b^2\) → derékszög, \(c^2\gt a^2+b^2\) → tompaszög.</li>
<li>Ha két oldal és az egyikkel <i>szemközti</i> szög adott, a koszinusztétel a harmadik oldalra másodfokú egyenletet ad (lehet 2, 1 vagy 0 pozitív gyök) – ugyanaz a helyzet, mint a szinusztételnél.</li>
<li><b>Gyakori hiba:</b> a \(2ab\cos\gamma\)-t a számológépen zárójel nélkül, vagy a \(-2ab\)-t előbb kivonva számolni. Biztos sorrend: először \(a^2+b^2\), aztán \(2ab\cos\gamma\), és a kettő különbsége.</li></ul>
<p><span class="lvl emelt">emelt</span> <b>Bizonyítás</b> vektorokkal: \(\vec c=\vec a-\vec b\), így \(c^2=\vec c\cdot\vec c=a^2+b^2-2\,\vec a\cdot\vec b=a^2+b^2-2ab\cos\gamma\).</p></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`A koszinusztétel a Pitagorasz-tétel általánosítása.`, igaz: true, miert: T`\(\gamma=90^\circ\)-ra \(\cos\gamma=0\), és \(c^2=a^2+b^2\).` },
      { allitas: T`Ha \(a=3\), \(b=5\) és \(\gamma=120^\circ\), akkor \(c=7\).`, igaz: true, miert: T`\(c^2=9+25-2\cdot 15\cdot\left(-\frac12\right)=49\).` },
      { allitas: T`Ha \(a=5\), \(b=8\) és \(\gamma=60^\circ\), akkor \(c=7\).`, igaz: true, miert: T`\(c^2=25+64-2\cdot 40\cdot\frac12=49\).` },
      { allitas: T`A 4, 5, 6 oldalú háromszög tompaszögű.`, igaz: false, miert: T`\(6^2=36\lt 4^2+5^2=41\): a legnagyobb szög is hegyesszög.` },
      { allitas: T`A 4, 5, 7 oldalú háromszög tompaszögű.`, igaz: true, miert: T`\(7^2=49\gt 4^2+5^2=41\).` },
      { allitas: T`Három oldalból a koszinusztétellel számolt szög lehet kétértelmű, mint a szinusztételnél.`, igaz: false, miert: 'A koszinusz 0° és 180° között minden értéket egyszer vesz fel, a szög egyértelmű.' },
      { allitas: T`Ha a \(\gamma\) szög tompaszög, akkor \(c^2\gt a^2+b^2\).`, igaz: true, miert: T`\(\cos\gamma\lt 0\), így \(-2ab\cos\gamma\gt 0\).` },
      { allitas: T`A koszinusztételben a \(2ab\cos\gamma\) tagot mindig ki kell vonni, tehát \(c\) mindig kisebb, mint \(\sqrt{a^2+b^2}\).`, igaz: false, miert: 'Tompaszögnél a koszinusz negatív, ezért a kivonás valójában hozzáadás: c nagyobb lesz.' },
      { allitas: T`Paralelogramma két átlójának négyzetösszege egyenlő az oldalak négyzetösszegével.`, igaz: true, miert: T`\(e^2+f^2=(a^2+b^2-2ab\cos\alpha)+(a^2+b^2+2ab\cos\alpha)=2a^2+2b^2\), ami a négy oldal négyzetösszege.` },
      { allitas: T`Ha két oldal és a közbezárt szög adott, a háromszög egyértelműen meghatározott.`, igaz: true, miert: 'Ez az egybevágóság egyik alapesete (oldal, szög, oldal).' },
      { general() { const g = P([60, 120]); const [a, b, c] = P(EIS[g].filter(t => t[2] <= 20)); const jo = R(0, 1), cc = jo ? c : c + P([-1, 1]);
        return { allitas: T`Ha \(a=${a}\), \(b=${b}\) és \(\gamma=${g}^\circ\), akkor \(c=${cc}\).`, igaz: !!jo, miert: T`\(c^2=${a * a}+${b * b}${g === 60 ? '-' : '+'}${a * b}=${c * c}\), így \(c=${c}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy háromszög oldalai 5 cm, 7 cm és 9 cm. Mekkora a legnagyobb szöge, és mekkora a területe?`,
      lepesek: [
        'A legnagyobb szög a leghosszabb (9 cm-es) oldallal szemben van; legyen ez γ.',
        T`\[9^2=5^2+7^2-2\cdot 5\cdot 7\cdot\cos\gamma\quad\Rightarrow\quad\cos\gamma=\frac{25+49-81}{70}=-\frac{7}{70}=-0{,}1\]`,
        T`\[\gamma=\cos^{-1}(-0{,}1)\approx 95{,}7^\circ\quad\text{(tompaszög)}\]`,
        T`\[T=\frac{5\cdot 7\cdot\sin 95{,}7^\circ}{2}\approx 17{,}41\ \text{cm}^2\]`
      ]
    },
    grafikon: M11.haromszog({ mod: 'koszinusz' }),
    grafikonCim: 'Koszinusztétel a gyakorlatban',
    grafikonTag: 'állítsd a szöget 90° fölé',
    feladatok
  });
})();
