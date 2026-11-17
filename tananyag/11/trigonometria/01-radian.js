/*
 * 1. fejezet – A szög mérése: fok és radián (ívmérték)
 * Témakör: Trigonometria (11. évfolyam) · segédfüggvények: TR (tananyag/11/kurzus.js)
 */
(function () {
  const { n2, v2, vSzog, nevErtek, mc, FN } = TR;
  const feladatok = {};
  const NEVF = [F(1, 6), F(1, 4), F(1, 3), F(1, 2), F(2, 3), F(3, 4), F(5, 6), F(1), F(7, 6), F(5, 4), F(4, 3), F(3, 2), F(5, 3), F(7, 4), F(11, 6), F(2)];
  /* k·π TeX-ben (k tört) */
  const piT = q => { const n = Math.abs(q.n); const s = q.n < 0 ? '-' : ''; if (q.d === 1) return s + (n === 1 ? '' : n) + T`\pi`; return s + T`\frac{${n === 1 ? '' : n}\pi}{${q.d}}`; };
  const vel = () => P([F(R(1, 72) * 5, 180), P(NEVF), P(NEVF), F(R(1, 24) * 15, 180), F(-R(1, 12) * 15, 180)]);

  feladatok.rdFokbol = { nev: 'Fokból radiánba', general() {
    const q = vel(); const d = 180 * q.n / q.d;
    return { kerdes: T`<p>Add meg radiánban! Melyik szám kerül a négyzet helyére?</p>\[${nt(d)}^{\circ}=\square\cdot\pi\]`, valasz: { ertekek: [fv(q)] }, formatum: FMT.frac,
      tipp: T`\(180^{\circ}=\pi\) radián, tehát \(1^{\circ}=\frac{\pi}{180}\). Szorozd meg a fokot \(\frac{\pi}{180}\)-nal, és egyszerűsíts.`,
      megoldas: [T`\[${nt(d)}^{\circ}=${nt(d)}\cdot\frac{\pi}{180}=${piT(q)}\]`] };
  } };

  feladatok.rdRadianbol = { nev: 'Radiánból fokba', general() {
    const q = vel(); const d = 180 * q.n / q.d;
    if (R(0, 3) === 0) { const x = R(5, 60) / 10; const dd = x * 180 / Math.PI;
      return { kerdes: T`<p>Hány fokos az \(${nt(x)}\) radiános szög? (Két tizedesjegyre)</p>`, valasz: vSzog(dd), formatum: 'fokban, pl. 57,30',
        tipp: T`\(1\) radián \(=\frac{180^{\circ}}{\pi}\approx 57{,}30^{\circ}\).`, megoldas: [T`\[${nt(x)}\cdot\frac{180^{\circ}}{\pi}\approx ${n2(dd)}^{\circ}\]`] }; }
    return { kerdes: T`<p>Hány fokos az a szög, amelynek radiánban mért nagysága</p>\[${piT(q)}\ ?\]`, valasz: { ertekek: [d] }, formatum: 'szám (fok)',
      tipp: T`Írj \(\pi\) helyére \(180^{\circ}\)-ot.`, megoldas: [T`\[${piT(q)}=${ft(q)}\cdot 180^{\circ}=${nt(d)}^{\circ}\]`] };
  } };

  feladatok.rdIv = { nev: 'Ívhossz', general() {
    const r = R(2, 30); const kind = R(0, 2);
    if (kind === 0) { const q = P(NEVF); const i = r * Math.PI * fv(q);
      return { kerdes: T`<p>Egy \(${r}\) cm sugarú körben mekkora a \(${piT(q)}\) radiános középponti szöghöz tartozó ív hossza? (cm, két tizedesjegyre)</p>`, valasz: v2(i), formatum: 'tizedes tört (cm)',
        tipp: T`Radiánban az ívhossz egyszerű: \(i=r\cdot\alpha\).`, megoldas: [T`\[i=r\alpha=${r}\cdot ${piT(q)}\approx ${n2(i)}\ \text{cm}\]`] }; }
    if (kind === 1) { const d = R(10, 350); const i = r * d * Math.PI / 180;
      return { kerdes: T`<p>Egy \(${r}\) cm sugarú körben mekkora a \(${d}^{\circ}\)-os középponti szöghöz tartozó ív hossza? (cm, két tizedesjegyre)</p>`, valasz: v2(i), formatum: 'tizedes tört (cm)',
        tipp: T`Váltsd át a szöget radiánba, utána \(i=r\cdot\alpha\). (Fokkal: \(i=2r\pi\cdot\frac{\alpha}{360^{\circ}}\).)`, megoldas: [T`\[\alpha=${d}\cdot\frac{\pi}{180}\approx ${nt(+(d * Math.PI / 180).toFixed(4))},\qquad i=${r}\cdot\alpha\approx ${n2(i)}\ \text{cm}\]`] }; }
    const i = R(3, 60); const a = i / r; const fokban = R(0, 1) === 1;
    return { kerdes: T`<p>Egy \(${r}\) cm sugarú körben egy ív hossza \(${i}\) cm. Mekkora a hozzá tartozó középponti szög ${fokban ? 'fokban' : 'radiánban'}? (Két tizedesjegyre)</p>`,
      valasz: fokban ? vSzog(a * 180 / Math.PI) : v2(a), formatum: fokban ? 'fokban' : 'tizedes tört (radián)',
      tipp: T`\(\alpha=\frac{i}{r}\) radián${fokban ? T`, majd szorozd \(\frac{180^{\circ}}{\pi}\)-vel` : ''}.`,
      megoldas: [T`\[\alpha=\frac{${i}}{${r}}\approx ${nt(+a.toFixed(4))}\ \text{rad}${fokban ? T`\approx ${n2(a * 180 / Math.PI)}^{\circ}` : ''}\]`] };
  } };

  feladatok.rdKorcikk = { nev: 'Körcikk területe', general() {
    const r = R(2, 25); if (R(0, 1)) { const q = P(NEVF.filter(x => fv(x) < 2)); const t = r * r * Math.PI * fv(q) / 2;
      return { kerdes: T`<p>Mekkora a területe annak a \(${r}\) cm sugarú körcikknek, amelynek középponti szöge \(${piT(q)}\) radián? (cm², két tizedesjegyre)</p>`, valasz: v2(t), formatum: 'tizedes tört (cm²)',
        tipp: T`\(T=\frac{r^{2}\alpha}{2}\) (α radiánban) – a teljes kör \(r^2\pi\) területének \(\frac{\alpha}{2\pi}\)-szerese.`, megoldas: [T`\[T=\frac{${r}^{2}\cdot ${piT(q)}}{2}\approx ${n2(t)}\ \text{cm}^2\]`] }; }
    const d = R(10, 350); const t = r * r * Math.PI * d / 360;
    return { kerdes: T`<p>Mekkora a területe annak a \(${r}\) cm sugarú körcikknek, amelynek középponti szöge \(${d}^{\circ}\)? (cm², két tizedesjegyre)</p>`, valasz: v2(t), formatum: 'tizedes tört (cm²)',
      tipp: T`\(T=r^2\pi\cdot\frac{\alpha}{360^{\circ}}\), vagy radiánnal \(T=\frac{r^2\alpha}{2}\).`, megoldas: [T`\[T=${r}^{2}\pi\cdot\frac{${d}}{360}\approx ${n2(t)}\ \text{cm}^2\]`] };
  } };

  feladatok.rdSzogfv = { nev: 'Szögfüggvény radiánban', general() {
    const q0 = P(NEVF), k = P([0, 0, 2, -2, 4]); const q = F(q0.n + k * q0.d, q0.d); const d = 180 * q.n / q.d; const fn = P(['sin', 'cos', 'tg']); const e = nevErtek(fn, d);
    const MIND = ['0', '1/2', '−1/2', '√2/2', '−√2/2', '√3/2', '−√3/2', '1', '−1', '√3', '−√3', '√3/3', '−√3/3', 'nincs értelmezve'];
    const ell = e.txt.startsWith('−') ? e.txt.slice(1) : (e.txt === '0' || e.txt === 'nincs értelmezve') ? '1' : '−' + e.txt;
    return { kerdes: T`<p>Mennyi a pontos értéke? (Számológép nélkül!)</p>\[${FN[fn]}\,${piT(q)}\]`, valasz: mc(e.txt, [ell, ...TR.keverd(MIND)]),
      tipp: T`Váltsd át fokba (\(\pi=180^{\circ}\)), és használd a nevezetes szögek értékeit és az egységkört.`,
      megoldas: [T`\[${piT(q)}=${nt(d)}^{\circ},\qquad ${FN[fn]}\,${nt(d)}^{\circ}=${e.tex}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig00',
    cim: 'A szög mérése: fok és radián',
    rovid: 'Fok és radián',
    bevezeto: T`A szöget nemcsak fokban, hanem a hozzá tartozó ív hosszával is mérhetjük. Ez a radián (ívmérték) – a szögfüggvények grafikonjain és a fizikában ezt használjuk.`,
    elmelet: T`<div class="prose"><p><b>Definíció:</b> egy középponti szög nagysága radiánban a hozzá tartozó ív hosszának és a kör sugarának hányadosa: \(\alpha=\frac{i}{r}\). Az egységkörön (\(r=1\)) <b>a szög radiánban éppen az ív hossza</b>.</p>
<p><b>1 radián</b> az a szög, amelyhez a sugárral egyenlő hosszú ív tartozik (\(\approx57{,}3^{\circ}\)). A teljes kör kerülete \(2\pi r\), ezért</p></div>
<div class="mathbox">\[360^{\circ}=2\pi\ \text{rad},\qquad 180^{\circ}=\pi\ \text{rad},\qquad 1^{\circ}=\frac{\pi}{180}\ \text{rad},\qquad 1\ \text{rad}=\frac{180^{\circ}}{\pi}\approx57{,}3^{\circ}\]</div>
<div class="tbl"><table><tr><th>fok</th><td>\(30^{\circ}\)</td><td>\(45^{\circ}\)</td><td>\(60^{\circ}\)</td><td>\(90^{\circ}\)</td><td>\(120^{\circ}\)</td><td>\(180^{\circ}\)</td><td>\(270^{\circ}\)</td><td>\(360^{\circ}\)</td></tr>
<tr><th>radián</th><td>\(\frac{\pi}{6}\)</td><td>\(\frac{\pi}{4}\)</td><td>\(\frac{\pi}{3}\)</td><td>\(\frac{\pi}{2}\)</td><td>\(\frac{2\pi}{3}\)</td><td>\(\pi\)</td><td>\(\frac{3\pi}{2}\)</td><td>\(2\pi\)</td></tr></table></div>
<div class="prose"><p><b>Ívhossz és körcikk</b> (α radiánban): \(i=r\alpha\), \(T=\frac{r^2\alpha}{2}\).</p>
<p>A radián jelét általában nem írjuk ki: \(\sin\frac{\pi}{6}\) azt jelenti, hogy \(\sin30^{\circ}\). A számológépen ehhez RAD módot kell választani!</p>
<p><b>Az ábrán</b> a szög az egységkör ívhossza (piros): ha az ívet „letekerjük” a vízszintes tengelyre, ott pontosan ekkora szakaszt kapunk. A pont magassága a szög szinusza – így születik a szinuszgörbe.</p></div>`,
    igazHamis: [
      { allitas: T`\(\pi\) radián \(=180^{\circ}\)`, igaz: true, miert: T`A félkör ívhossza az egységkörön \(\pi\).` },
      { allitas: T`1 radián nagyobb, mint \(60^{\circ}\).`, igaz: false, miert: T`\(1\ \text{rad}\approx57{,}3^{\circ}\).` },
      { allitas: T`\(\frac{\pi}{4}=45^{\circ}\)`, igaz: true, miert: T`\(\frac{180^{\circ}}{4}=45^{\circ}\).` },
      { allitas: T`Egy 10 cm sugarú körben az 1 radiános középponti szöghöz 10 cm-es ív tartozik.`, igaz: true, miert: T`\(i=r\alpha=10\cdot1\).` },
      { allitas: T`\(\sin\pi=1\)`, igaz: false, miert: T`\(\sin180^{\circ}=0\); \(\sin\frac{\pi}{2}=1\).` },
      { allitas: T`A \(2\pi\) radiános szög egy teljes fordulat.`, igaz: true, miert: T`\(2\pi=360^{\circ}\).` }
    ],
    mintapelda: {
      feladat: T`Egy 12 cm sugarú körben mekkora a \(150^{\circ}\)-os középponti szöghöz tartozó ív hossza?`,
      lepesek: [
        T`Radiánban: \(150^{\circ}=150\cdot\frac{\pi}{180}=\frac{5\pi}{6}\).`,
        T`\(i=r\alpha=12\cdot\frac{5\pi}{6}=10\pi\approx31{,}42\) cm.`
      ]
    },
    grafikon: TR.korGorbe({ radian: true }), grafikonCim: 'A szög mint ívhossz', grafikonTag: 'egységkör → számegyenes',
    feladatok
  });
})();
