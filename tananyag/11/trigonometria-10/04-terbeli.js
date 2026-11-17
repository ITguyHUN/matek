/*
 * Kiegészítő anyag (10. évfolyam) 4. – Síkbeli és térbeli számítások szögfüggvényekkel (Sokszínű matematika 10., Hegyesszögek szögfüggvényei 6. lecke)
 * Témakör: Kiegészítő anyag (10.) a 11.-es trigonometriához · segédfüggvények: TR (tananyag/11/kurzus.js)
 */
(function () {
  const { atgD, tgD, sinD, cosD, n2, fok, v2, vSzog } = TR;
  const feladatok = {};

  feladatok.tbTeglatest = { nev: 'Téglatest: testátló', general() {
    const a = R(2, 20), b = R(2, 20), c = R(2, 20); const d = Math.sqrt(a * a + b * b + c * c), e = Math.sqrt(a * a + b * b);
    if (R(0, 1)) return { kerdes: T`<p>Egy téglatest élei \(${a}\) cm, \(${b}\) cm és \(${c}\) cm (a \(${c}\) cm-es a magasság). Mekkora szöget zár be a testátló az alaplappal? (Fokban, két tizedesjegyre)</p>`,
      valasz: vSzog(atgD(c / e)), formatum: 'fokban',
      tipp: 'A testátló, az alaplap átlója és egy függőleges él derékszögű háromszöget alkot; a keresett szög az alaplap átlójánál van.',
      megoldas: [T`\[e=\sqrt{${a}^{2}+${b}^{2}}=\sqrt{${a * a + b * b}}\approx ${n2(e)}\ \text{cm}\]`, T`\[\operatorname{tg}\varphi=\frac{${c}}{e}\approx ${nt(+(c / e).toFixed(4))}\quad\Rightarrow\quad\varphi\approx ${fok(atgD(c / e))}\]`] };
    return { kerdes: T`<p>Milyen hosszú annak a téglatestnek a testátlója, amelynek élei \(${a}\) cm, \(${b}\) cm és \(${c}\) cm? (cm, két tizedesjegyre)</p>`,
      valasz: v2(d), formatum: 'tizedes tört (cm)', tipp: T`Kétszer Pitagorasz: \(d=\sqrt{a^2+b^2+c^2}\).`,
      megoldas: [T`\[d=\sqrt{${a}^{2}+${b}^{2}+${c}^{2}}=\sqrt{${a * a + b * b + c * c}}\approx ${n2(d)}\ \text{cm}\]`] };
  } };

  feladatok.tbGula = { nev: 'Négyzet alapú gúla', general() {
    const a = R(2, 20), m = R(2, 25); const kind = R(0, 2);
    if (kind === 0) { const f = a * Math.SQRT2 / 2; const al = atgD(m / f);
      return { kerdes: T`<p>Egy négyzet alapú szabályos gúla alapéle \(${a}\) cm, magassága \(${m}\) cm. Mekkora szöget zár be az oldalél az alaplappal? (Fokban, két tizedesjegyre)</p>`,
        valasz: vSzog(al), formatum: 'fokban',
        tipp: 'A magasság talppontja az alaplap középpontja. Az oldalél, a magasság és a fél alaplapátló derékszögű háromszöget alkot.',
        megoldas: [T`\[\frac{d}{2}=\frac{${a}\sqrt2}{2}\approx ${n2(f)}\ \text{cm},\qquad \operatorname{tg}\alpha=\frac{${m}}{d/2}\quad\Rightarrow\quad\alpha\approx ${fok(al)}\]`] }; }
    if (kind === 1) { const be = atgD(m / (a / 2));
      return { kerdes: T`<p>Egy négyzet alapú szabályos gúla alapéle \(${a}\) cm, magassága \(${m}\) cm. Mekkora szöget zár be egy oldallap az alaplappal? (Fokban, két tizedesjegyre)</p>`,
        valasz: vSzog(be), formatum: 'fokban',
        tipp: 'Két sík hajlásszögét a metszésvonalukra (az alapélre) merőleges egyenesek szöge adja: az oldallap magassága és az alapél felezőpontját a középponttal összekötő szakasz (fél alapél).',
        megoldas: [T`\[\operatorname{tg}\beta=\frac{m}{a/2}=\frac{${m}}{${nt(a / 2)}}\quad\Rightarrow\quad\beta\approx ${fok(be)}\]`] }; }
    const al = R(30, 75); const mm = a * Math.SQRT2 / 2 * tgD(al);
    return { kerdes: T`<p>Egy négyzet alapú szabályos gúla alapéle \(${a}\) cm, az oldalélei \(${al}^{\circ}\)-os szöget zárnak be az alaplappal. Milyen magas a gúla? (cm, két tizedesjegyre)</p>`,
      valasz: v2(mm), formatum: 'tizedes tört (cm)', tipp: T`\(m=\frac{d}{2}\cdot\operatorname{tg}\alpha\), ahol \(d=a\sqrt2\) az alaplap átlója.`,
      megoldas: [T`\[m=\frac{${a}\sqrt2}{2}\cdot\operatorname{tg} ${al}^{\circ}\approx ${n2(mm)}\ \text{cm}\]`] };
  } };

  feladatok.tbKup = { nev: 'Kúp, henger', general() {
    const r = R(2, 20), m = R(2, 30); const kind = R(0, 2);
    if (kind === 0) { const ny = 2 * atgD(r / m);
      return { kerdes: T`<p>Egy forgáskúp alapkörének sugara \(${r}\) cm, magassága \(${m}\) cm. Mekkora a kúp nyílásszöge? (Fokban, két tizedesjegyre)</p>`,
        valasz: vSzog(ny), formatum: 'fokban', tipp: T`A nyílásszög a tengelymetszet csúcsánál lévő szög. A fele: \(\operatorname{tg}\frac{\varphi}{2}=\frac{r}{m}\).`,
        megoldas: [T`\[\operatorname{tg}\frac{\varphi}{2}=\frac{${r}}{${m}}\quad\Rightarrow\quad\frac{\varphi}{2}\approx ${fok(ny / 2)}\quad\Rightarrow\quad\varphi\approx ${fok(ny)}\]`] }; }
    if (kind === 1) { const al = R(20, 75), a = R(4, 30); const rr = a * cosD(al), mm = a * sinD(al); const kerdR = R(0, 1) === 1;
      return { kerdes: T`<p>Egy forgáskúp alkotója \(${a}\) cm, és \(${al}^{\circ}\)-os szöget zár be az alaplappal. Mekkora a kúp ${kerdR ? 'alapkörének sugara' : 'magassága'}? (cm, két tizedesjegyre)</p>`,
        valasz: v2(kerdR ? rr : mm), formatum: 'tizedes tört (cm)', tipp: 'Az alkotó, a magasság és az alapkör sugara derékszögű háromszöget alkot; az alkotó az átfogó.',
        megoldas: [T`\[${kerdR ? 'r' : 'm'}=${a}\cdot${kerdR ? '\\cos' : '\\sin'} ${al}^{\circ}\approx ${n2(kerdR ? rr : mm)}\ \text{cm}\]`] }; }
    const fi = atgD(m / (2 * r));
    return { kerdes: T`<p>Egy forgáshenger alapkörének sugara \(${r}\) cm, magassága \(${m}\) cm. Mekkora szöget zár be a tengelymetszet átlója az alaplappal? (Fokban, két tizedesjegyre)</p>`,
      valasz: vSzog(fi), formatum: 'fokban', tipp: T`A tengelymetszet egy \(2r\times m\)-es téglalap.`,
      megoldas: [T`\[\operatorname{tg}\varphi=\frac{m}{2r}=\frac{${m}}{${2 * r}}\quad\Rightarrow\quad\varphi\approx ${fok(fi)}\]`] };
  } };

  feladatok.tbSik = { nev: 'Síkbeli számítások', general() {
    const kind = R(0, 2);
    if (kind === 0) { const r = R(3, 20), al = R(20, 160); const h = 2 * r * sinD(al / 2);
      return { kerdes: T`<p>Egy \(${r}\) cm sugarú körben egy húrhoz \(${al}^{\circ}\)-os középponti szög tartozik. Milyen hosszú a húr? (cm, két tizedesjegyre)</p>`,
        valasz: v2(h), formatum: 'tizedes tört (cm)', tipp: T`A középpontból a húrra bocsátott merőleges felezi a húrt és a középponti szöget: \(\frac{h}{2}=r\sin\frac{\alpha}{2}\).`,
        megoldas: [T`\[h=2\cdot ${r}\cdot\sin ${nt(al / 2)}^{\circ}\approx ${n2(h)}\ \text{cm}\]`] }; }
    if (kind === 1) { const a = R(3, 20), b = R(3, 20); const al = atgD(b / a);
      return { kerdes: T`<p>Egy téglalap oldalai \(${a}\) cm és \(${b}\) cm. Mekkora szöget zár be az átló a(z) \(${a}\) cm-es oldallal? (Fokban, két tizedesjegyre)</p>`,
        valasz: vSzog(al), formatum: 'fokban', tipp: 'Az átló két derékszögű háromszögre bontja a téglalapot.',
        megoldas: [T`\[\operatorname{tg}\varphi=\frac{${b}}{${a}}\quad\Rightarrow\quad\varphi\approx ${fok(al)}\]`] }; }
    const a = R(4, 20), al = R(20, 80); const m = a * sinD(al); // rombusz magassága
    return { kerdes: T`<p>Egy rombusz oldala \(${a}\) cm, egyik szöge \(${al}^{\circ}\). Milyen hosszú a magassága? (cm, két tizedesjegyre)</p>`,
      valasz: v2(m), formatum: 'tizedes tört (cm)', tipp: 'A magasság egy derékszögű háromszög befogója, amelynek átfogója a rombusz oldala.',
      megoldas: [T`\[m=${a}\cdot\sin ${al}^{\circ}\approx ${n2(m)}\ \text{cm}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trigk4',
    cim: 'Síkbeli és térbeli számítások (10.)',
    rovid: 'Térbeli számítások',
    bevezeto: T`A 10.-es anyag: derékszögű háromszögek keresése síkidomokban és testekben – testátló, hajlásszögek, kúp nyílásszöge.`,
    elmelet: T`<div class="prose"><p><b>Módszer:</b> keress a testben derékszögű háromszöget, amelyben két adat ismert, és ebből számold ki a harmadikat.</p><ul>
<li><b>Téglatest testátlója:</b> \(d=\sqrt{a^2+b^2+c^2}\); az alaplappal bezárt szöge: \(\operatorname{tg}\varphi=\frac{c}{\sqrt{a^2+b^2}}\).</li>
<li><b>Egyenes és sík szöge:</b> az egyenes és a síkra eső merőleges vetületének szöge.</li>
<li><b>Két sík szöge:</b> a metszésvonalra mindkét síkban merőleges egyenesek szöge (pl. gúla oldallapja és alaplapja: oldallapmagasság és fél alapél).</li>
<li><b>Forgáskúp:</b> az alkotó \(a\), a magasság \(m\), a sugár \(r\): \(a^2=r^2+m^2\); nyílásszög: \(\operatorname{tg}\frac{\varphi}{2}=\frac rm\).</li>
<li><b>Húr:</b> \(h=2r\sin\frac{\alpha}{2}\), ahol \(\alpha\) a középponti szög.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Egy kocka testátlója \(\sqrt3\)-szorosa az élének.`, igaz: true, miert: T`\(\sqrt{a^2+a^2+a^2}=a\sqrt3\).` },
      { allitas: T`A kocka testátlója \(45^{\circ}\)-os szöget zár be az alaplappal.`, igaz: false, miert: T`\(\operatorname{tg}\varphi=\frac{a}{a\sqrt2}\), \(\varphi\approx35{,}26^{\circ}\).` },
      { allitas: T`Ha egy kúp nyílásszöge \(90^{\circ}\), akkor a magassága egyenlő az alapkör sugarával.`, igaz: true, miert: T`\(\operatorname{tg}45^{\circ}=1=\frac rm\).` },
      { allitas: T`Gúlánál az oldalél és az alaplap szöge nagyobb, mint az oldallap és az alaplap szöge.`, igaz: false, miert: T`Fordítva: ugyanakkora magassághoz az oldalélnél hosszabb vízszintes szakasz (fél átló) tartozik, mint az oldallapnál (fél alapél), ezért az oldalél szöge a kisebb.` }
    ],
    mintapelda: {
      feladat: T`Egy négyzet alapú szabályos gúla alapéle 6 cm, magassága 4 cm. Mekkora szöget zár be az oldallap az alaplappal?`,
      lepesek: [
        T`Az oldallap magasságának talppontja az alapél felezőpontja; ennek távolsága a középponttól \(3\) cm.`,
        T`\(\operatorname{tg}\beta=\frac{4}{3}\Rightarrow\beta\approx53{,}13^{\circ}\).`
      ]
    },
    feladatok
  });
})();
