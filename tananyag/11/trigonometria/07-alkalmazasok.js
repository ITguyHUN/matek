/*
 * 7. fejezet – A trigonometria gyakorlati alkalmazásai
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 */
(function () {
  const { sinD, cosD, tgD, asinD, acosD, kerek, tiz, sz, fk, hossz, szog, FH } = M11;
  const feladatok = {};

  feladatok.toronyMagassag = { nev: 'Magasság két megfigyelési pontból', general() {
    const d = R(20, 200), al = R(12, 50), be = al + R(6, 30); if (be > 80) return this.general();
    const h = d * sinD(al) * sinD(be) / sinD(be - al), x = h / tgD(be), eset = R(0, 2);
    const fej = T`<p>Egy torony talppontja felé haladva egy egyenes, vízszintes úton két pontból mérjük a torony tetejének emelkedési szögét. Az első pontból \(${al}^\circ\)-ot, a toronyhoz \(${d}\) m-rel közelebbi második pontból \(${be}^\circ\)-ot mérünk. (A műszer magasságától eltekintünk.)</p>`;
    const l1 = T`A torony csúcsa \(C\), a két mérési pont \(A\) (távolabbi) és \(B\). Az \(ABC\) háromszögben \(A\)-nál \(${al}^\circ\), \(B\)-nél \(180^\circ-${be}^\circ=${180 - be}^\circ\), így \(C\)-nél \(${be}^\circ-${al}^\circ=${be - al}^\circ\).`;
    const l2 = T`\[BC=\frac{${d}\cdot\sin ${al}^\circ}{\sin ${be - al}^\circ}\approx ${sz(d * sinD(al) / sinD(be - al))}\ \text{m}\]`;
    if (eset < 2) return { kerdes: T`${fej}<p>Milyen magas a torony?</p>`, valasz: hossz(h), formatum: 'm, ' + FH.hossz,
      tipp: 'Az ABC háromszögben (két mérési pont és a csúcs) ismert egy oldal és két szög: szinusztétellel BC, majd a B-nél lévő derékszögű háromszögben a magasság.',
      megoldas: [l1, l2, T`\[h=BC\cdot\sin ${be}^\circ\approx ${sz(h)}\ \text{m}\]`] };
    return { kerdes: T`${fej}<p>Milyen messze van a második mérési pont a torony talppontjától?</p>`, valasz: hossz(x), formatum: 'm, ' + FH.hossz,
      tipp: 'Előbb számold ki szinusztétellel a második pont és a csúcs távolságát, utána a derékszögű háromszögben a vízszintes távolságot.',
      megoldas: [l1, l2, T`\[x=BC\cdot\cos ${be}^\circ\approx ${sz(x)}\ \text{m}\]`] };
  } };

  feladatok.dombTorony = { nev: 'Domb tetején álló torony', general() {
    const t = R(15, 60), al = R(8, 35), be = al + R(4, 15); if (be > 70) return this.general();
    const x = t / (tgD(be) - tgD(al)), h = x * tgD(al);
    return { kerdes: T`<p>Egy domb tetején \(${t}\) m magas adótorony áll. A völgyben lévő pontból a torony talppontja \(${al}^\circ\)-os, a csúcsa \(${be}^\circ\)-os emelkedési szögben látszik. Milyen magas a domb (a mérési pont szintjéhez képest)?</p>`,
      valasz: hossz(h), formatum: 'm, ' + FH.hossz,
      tipp: T`Legyen \(x\) a vízszintes távolság. A két derékszögű háromszögből: \(x\cdot\operatorname{tg} ${be}^\circ-x\cdot\operatorname{tg} ${al}^\circ=${t}\). Másik út: a mérési pont, a torony talpa és csúcsa alkotta háromszögben szinusztétel.`,
      megoldas: [T`\[x\cdot\operatorname{tg} ${be}^\circ=h+${t},\qquad x\cdot\operatorname{tg} ${al}^\circ=h\]`, T`\[x=\frac{${t}}{\operatorname{tg} ${be}^\circ-\operatorname{tg} ${al}^\circ}\approx ${sz(x)}\ \text{m}\]`, T`\[h=x\cdot\operatorname{tg} ${al}^\circ\approx ${sz(h)}\ \text{m}\]`] };
  } };

  feladatok.navigacio = { nev: 'Útvonal, irányváltás', general() {
    const s1 = tiz(3, 40, 1), s2 = tiz(3, 40, 1), fi = R(20, 150), belso = 180 - fi;
    const d = Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * cosD(belso)), ki = R(0, 1) ? 'hajó' : 'túrázó';
    return { kerdes: T`<p>Egy ${ki} a kiindulási pontjából egyenesen \(${sz(s1, 1)}\) km-t halad, majd \(${fi}^\circ\)-kal ${P(['balra', 'jobbra'])} fordul, és még \(${sz(s2, 1)}\) km-t tesz meg egyenesen. Milyen messze van ekkor a kiindulási ponttól?</p>`,
      valasz: hossz(d), formatum: 'km, ' + FH.hossz,
      tipp: T`Rajzold le! Ha \(${fi}^\circ\)-kal fordul, a két útszakasz a fordulópontnál \(180^\circ-${fi}^\circ\)-os szöget zár be. Ez a két ismert oldal közti szög.`,
      megoldas: [T`A fordulópontnál a háromszög szöge \(180^\circ-${fi}^\circ=${belso}^\circ\).`, T`\[d^2=${sz(s1, 1)}^2+${sz(s2, 1)}^2-2\cdot ${sz(s1, 1)}\cdot ${sz(s2, 1)}\cdot\cos ${belso}^\circ\approx ${sz(d * d)}\quad\Rightarrow\quad d\approx ${sz(d)}\ \text{km}\]`] };
  } };

  feladatok.telek = { nev: 'Telek, kert, kerítés', general() {
    const p = R(15, 90), q = R(15, 90), fi = R(30, 150), r = Math.sqrt(p * p + q * q - 2 * p * q * cosD(fi)), eset = R(0, 2);
    const fej = T`<p>Egy háromszög alakú telek két oldala \(${p}\) m és \(${q}\) m, ezek \(${fi}^\circ\)-os szöget zárnak be.</p>`;
    if (eset === 0) return { kerdes: T`${fej}<p>Hány méter kerítés kell a telek teljes körbekerítéséhez?</p>`, valasz: hossz(p + q + r), formatum: 'm, ' + FH.hossz,
      tipp: 'A harmadik oldal koszinusztétellel, a kerítés hossza a kerület.',
      megoldas: [T`\[c^2=${p}^2+${q}^2-2\cdot ${p}\cdot ${q}\cdot\cos ${fi}^\circ\approx ${sz(r * r)}\quad\Rightarrow\quad c\approx ${sz(r)}\ \text{m}\]`, T`\[K=${p}+${q}+${sz(r)}\approx ${sz(p + q + r)}\ \text{m}\]`] };
    if (eset === 1) { const ar = R(8, 40) * 1000, Tr = p * q * sinD(fi) / 2;
      return { kerdes: T`${fej}<p>Mennyibe kerül a telek, ha négyzetmétere \(${bigT(ar)}\) Ft? Az árat ezer forintra kerekítve add meg!</p>`, valasz: { ertekek: [Math.round(Tr * ar / 1000) * 1000], tol: 1001 }, formatum: 'Ft, ezresekre kerekítve',
        tipp: 'Terület: T = a·b·sin γ / 2, majd szorozd meg a négyzetméterárral.',
        megoldas: [T`\[T=\frac{${p}\cdot ${q}\cdot\sin ${fi}^\circ}{2}\approx ${sz(Tr)}\ \text{m}^2\]`, T`\[${sz(Tr)}\cdot ${bigT(ar)}\approx ${bigT(Math.round(Tr * ar / 1000) * 1000)}\ \text{Ft}\]`] }; }
    const be = acosD((p * p + r * r - q * q) / (2 * p * r));
    return { kerdes: T`${fej}<p>Mekkora szöget zár be a harmadik oldal a \(${p}\) m-es oldallal?</p>`, valasz: szog(be), formatum: FH.szog,
      tipp: 'Koszinusztétellel előbb a harmadik oldal, aztán koszinusztétellel (cos-ra rendezve) a keresett szög. A keresett szöggel a q oldal van szemben.',
      megoldas: [T`\[c\approx ${sz(r, 3)}\ \text{m}\]`, T`\[\cos\beta=\frac{${p}^2+c^2-${q}^2}{2\cdot ${p}\cdot c}\approx ${sz((p * p + r * r - q * q) / (2 * p * r), 4)}\quad\Rightarrow\quad\beta\approx ${fk(be)}\]`] };
  } };

  feladatok.hur = { nev: 'Húr és középponti szög', general() {
    const r = tiz(3, 25, 1), eset = R(0, 2);
    if (eset === 0) { const fi = R(20, 170), h = 2 * r * sinD(fi / 2);
      return { kerdes: T`<p>Egy \(${sz(r, 1)}\) cm sugarú körben egy húrhoz tartozó középponti szög \(${fi}^\circ\). Milyen hosszú a húr?</p>`, valasz: hossz(h), formatum: 'cm, ' + FH.hossz,
        tipp: 'A középpontot a húr végpontjaival összekötve egyenlő szárú háromszöget kapsz. A szárak r hosszúak; a magasság felezi a szárszöget és a húrt.',
        megoldas: [T`\[\frac{h}{2}=r\cdot\sin\frac{${fi}^\circ}{2}\quad\Rightarrow\quad h=2\cdot ${sz(r, 1)}\cdot\sin ${nt(fi / 2)}^\circ\approx ${sz(h)}\ \text{cm}\]`, 'Koszinusztétellel is: h² = r² + r² − 2r²·cos φ.'] }; }
    const h = tiz(1, 2 * r - 0.5, 1), fi = 2 * asinD(h / (2 * r));
    if (eset === 1) return { kerdes: T`<p>Egy \(${sz(r, 1)}\) cm sugarú körben a \(${sz(h, 1)}\) cm hosszú húr mekkora középponti szögben látszik?</p>`, valasz: szog(fi), formatum: FH.szog,
      tipp: T`A félhúr és a sugár egy derékszögű háromszöget alkot: \(\sin\frac{\varphi}{2}=\frac{h/2}{r}\).`,
      megoldas: [T`\[\sin\frac{\varphi}{2}=\frac{${nt(kerek(h / 2, 2))}}{${sz(r, 1)}}\approx ${sz(h / (2 * r), 4)}\quad\Rightarrow\quad\frac{\varphi}{2}\approx ${fk(fi / 2, 2)}\quad\Rightarrow\quad\varphi\approx ${fk(fi)}\]`] };
    const d = Math.sqrt(r * r - h * h / 4);
    return { kerdes: T`<p>Egy \(${sz(r, 1)}\) cm sugarú körben egy húr \(${sz(h, 1)}\) cm hosszú. Milyen messze van a húr a kör középpontjától?</p>`, valasz: hossz(d), formatum: 'cm, ' + FH.hossz,
      tipp: 'A középpontból a húrra bocsátott merőleges felezi a húrt. Pitagorasz-tétel a sugárral és a félhúrral (vagy a fél középponti szög koszinuszával).',
      megoldas: [T`\[d=\sqrt{r^2-\left(\frac{h}{2}\right)^2}=\sqrt{${sz(r, 1)}^2-${nt(kerek(h / 2, 2))}^2}\approx ${sz(d)}\ \text{cm}\]`] };
  } };

  feladatok.ketPont = { nev: 'Két hozzáférhetetlen pont távolsága', szint: 'emelt', general() {
    /* C és D az innenső parton (CD = d); a túlparti A-t és B-t mérjük: ACD∢ = a1, ACB irány helyett: BCD∢ = b1, ADC∢ = a2, BDC∢ = b2 */
    const d = R(60, 300), a1 = R(70, 120), b1 = R(25, 60), a2 = R(25, 60), b2 = R(70, 120);
    if (a1 + a2 > 160 || b1 + b2 > 160) return this.general();
    const CA = d * sinD(a2) / sinD(180 - a1 - a2), CB = d * sinD(b2) / sinD(180 - b1 - b2), g = a1 - b1;
    if (g < 10) return this.general();
    const AB = Math.sqrt(CA * CA + CB * CB - 2 * CA * CB * cosD(g));
    return { kerdes: T`<p>Egy folyó túlpartján lévő \(A\) és \(B\) pont távolságát akarjuk megmérni. Az innenső parton kijelöltük a \(C\) és \(D\) pontot, \(CD=${d}\) m. A mért szögek: \(ACD\sphericalangle=${a1}^\circ\), \(BCD\sphericalangle=${b1}^\circ\), \(ADC\sphericalangle=${a2}^\circ\), \(BDC\sphericalangle=${b2}^\circ\). (Az \(A\) és \(B\) pont a \(CD\) egyenes ugyanazon oldalán van.) Milyen messze van egymástól \(A\) és \(B\)?</p>`,
      valasz: hossz(AB), formatum: 'm, ' + FH.hossz,
      tipp: 'Az ACD és a BCD háromszögben szinusztétellel számold ki CA-t és CB-t, aztán az ACB háromszögben koszinusztétel (ACB∢ = ACD∢ − BCD∢).',
      megoldas: [T`\[CAD\sphericalangle=180^\circ-${a1}^\circ-${a2}^\circ=${180 - a1 - a2}^\circ,\qquad CA=\frac{${d}\cdot\sin ${a2}^\circ}{\sin ${180 - a1 - a2}^\circ}\approx ${sz(CA)}\]`,
        T`\[CBD\sphericalangle=180^\circ-${b1}^\circ-${b2}^\circ=${180 - b1 - b2}^\circ,\qquad CB=\frac{${d}\cdot\sin ${b2}^\circ}{\sin ${180 - b1 - b2}^\circ}\approx ${sz(CB)}\]`,
        T`\[ACB\sphericalangle=${a1}^\circ-${b1}^\circ=${g}^\circ,\qquad AB^2=CA^2+CB^2-2\cdot CA\cdot CB\cdot\cos ${g}^\circ\quad\Rightarrow\quad AB\approx ${sz(AB)}\ \text{m}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig07',
    cim: 'A trigonometria gyakorlati alkalmazásai',
    rovid: 'Alkalmazások',
    bevezeto: 'Magasság- és távolságmérés, navigáció, telkek: a valós problémákat háromszögekre bontjuk, és a megfelelő tétellel számolunk.',
    elmelet: T`<div class="prose"><p><b>Fogalmak</b></p><ul>
<li><b>Emelkedési szög:</b> a vízszintes és a felfelé néző látóirány szöge. <b>Depressziószög:</b> a vízszintes és a lefelé néző látóirány szöge. A kettő váltószög: ha \(A\)-ból \(B\) \(\delta\) szögben lefelé látszik, akkor \(B\)-ből \(A\) \(\delta\) szögben felfelé.</li>
<li><b>Lejtő, út emelkedése:</b> \(p\%\) emelkedés → \(\operatorname{tg}\alpha=\frac{p}{100}\).</li>
<li><b>Irányváltás:</b> ha valaki \(\varphi\) szöggel fordul, a két útszakasz a fordulópontnál \(180^\circ-\varphi\) szöget zár be.</li>
<li><b>Húr és középponti szög:</b> \(h=2r\sin\frac{\varphi}{2}\).</li></ul>
<p><b>Modellezés lépései</b></p><ul>
<li>Ábra! Felülnézet (térkép) vagy oldalnézet – a feladat szövegéből döntsd el.</li>
<li>Jelöld a derékszögeket (függőleges torony, vízszintes talaj).</li>
<li>Keress egy háromszöget, amelyben 3 adat ismert; számold ki belőle a „híd” adatot (pl. egy távolságot), és lépj át a következő háromszögbe.</li>
<li>Válaszolj a kérdésre mondatban, mértékegységgel, a feladatnak megfelelő kerekítéssel.</li></ul>
<p><b>Tipikus érettségi helyzet:</b> két mérési pont egy egyenesen a torony felé, két emelkedési szög. A két pont és a csúcs által alkotott háromszögben a csúcsnál lévő szög a két emelkedési szög különbsége; ebben a háromszögben szinusztétel, majd a derékszögű háromszögben a magasság.</p></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`Ha egy torony csúcsa \(30^\circ\)-os emelkedési szögben látszik, akkor a torony magassága a vízszintes távolság fele.`, igaz: false, miert: T`\(h=x\cdot\operatorname{tg} 30^\circ\approx 0{,}577x\). A „fele” a 30°-os derékszögű háromszögben a szemközti befogó és az átfogó aránya.` },
      { allitas: T`A depressziószög és az emelkedési szög váltószögek, ezért egyenlők.`, igaz: true, miert: 'A két vízszintes egyenes párhuzamos, a látóirány a szelőjük.' },
      { allitas: T`Ha egy hajó \(40^\circ\)-kal elfordul, a két útszakasz által bezárt szög \(40^\circ\).`, igaz: false, miert: T`A háromszög belső szöge a fordulópontnál \(180^\circ-40^\circ=140^\circ\).` },
      { allitas: T`Egy \(r\) sugarú körben a \(60^\circ\)-os középponti szöghöz tartozó húr hossza \(r\).`, igaz: true, miert: 'A középpont és a húr két végpontja egyenlő oldalú háromszöget alkot.' },
      { allitas: T`Egy 10%-os emelkedésű út \(10^\circ\)-os szöget zár be a vízszintessel.`, igaz: false, miert: T`\(\operatorname{tg}\alpha=0{,}1\), \(\alpha\approx 5{,}7^\circ\).` },
      { allitas: T`Ha a megfigyelőhöz közelebb lépünk, a torony csúcsának emelkedési szöge nő.`, igaz: true, miert: T`\(\operatorname{tg}\alpha=\frac{h}{x}\): kisebb \(x\) → nagyobb tangens → nagyobb hegyesszög.` },
      { allitas: T`Két hozzáférhetetlen pont távolsága is kiszámítható, ha egy ismert hosszúságú alapvonal végpontjaiból megmérjük a pontok irányszögeit.`, igaz: true, szint: 'emelt', miert: 'Két szinusztétel és egy koszinusztétel adja (háromszögelés).' }
    ],
    mintapelda: {
      feladat: T`Egy templomtorony felé haladva egy pontból a torony csúcsa \(24^\circ\)-os, 50 m-rel közelebbről \(37^\circ\)-os emelkedési szögben látszik. Milyen magas a torony?`,
      lepesek: [
        T`Jelölés: \(A\) a távolabbi, \(B\) a közelebbi pont, \(C\) a csúcs, \(T\) a torony talppontja. Az \(ABC\) háromszögben \(A\)-nál \(24^\circ\), \(B\)-nél \(180^\circ-37^\circ=143^\circ\), \(C\)-nél \(37^\circ-24^\circ=13^\circ\).`,
        T`Szinusztétel: \[BC=\frac{50\cdot\sin 24^\circ}{\sin 13^\circ}\approx 90{,}41\ \text{m}\]`,
        T`A \(BTC\) derékszögű háromszögben: \[h=BC\cdot\sin 37^\circ\approx 54{,}41\ \text{m}\]`,
        'Válasz: a torony kb. 54,4 m magas.'
      ]
    },
    feladatok
  });
})();
