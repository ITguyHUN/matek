/*
 * 12. fejezet – Szögfüggvények tetszőleges szögre, forgásszögek (10. évf. anyaga; emelt)
 * Témakör: Trigonometria (11. évfolyam) · segédfüggvények: TR (tananyag/11/kurzus.js)
 */
(function () {
  const { f, FN, nevErtek, mc, mod360 } = TR;
  const feladatok = {};
  const FNEV = ['sin', 'cos', 'tg'];
  const negyed = m => m < 90 ? 'I.' : m < 180 ? 'II.' : m < 270 ? 'III.' : 'IV.';
  /* egy szög megjelenítése: néha 360°-nál nagyobb vagy negatív alak */
  function szogAlak(m) { const k = P([0, 0, 0, 1, -1]); return m + 360 * k; }

  feladatok.sfElojel = { nev: 'Előjel', general() {
    let m; do { m = R(1, 359); } while (m % 90 === 0); const fn = P(FNEV); const d = szogAlak(m); const v = f(fn, d);
    return { kerdes: T`<p>Milyen előjelű a következő szám? (Számológép nélkül!)</p>\[${FN[fn]}\left(${d}^{\circ}\right)\]`,
      valasz: { valasztas: ['pozitív', 'negatív'], helyes: v > 0 ? 0 : 1 },
      tipp: T`Melyik síknegyedbe esik a szög? Az egységkörön a \(\cos\) az \(x\), a \(\sin\) az \(y\) koordináta; a \(\operatorname{tg}\) pozitív, ha a kettő azonos előjelű.`,
      megoldas: [T`${d !== m ? T`\(${d}^{\circ}\) ugyanoda mutat, mint \(${m}^{\circ}\) (360° többszörösével tér el). ` : ''}A szög a ${negyed(m)} síknegyedbe esik.`,
        T`Ott a ${fn === 'sin' ? 'szinusz (y)' : fn === 'cos' ? 'koszinusz (x)' : 'tangens (y/x)'} ${v > 0 ? 'pozitív' : 'negatív'}.`] };
  } };

  const NSZ = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  const MIND = ['0', '1/2', '−1/2', '√2/2', '−√2/2', '√3/2', '−√3/2', '1', '−1', '√3', '−√3', '√3/3', '−√3/3', 'nincs értelmezve'];
  feladatok.sfPontos = { nev: 'Pontos érték', general() {
    const m = P(NSZ.filter(x => x % 90 !== 0).concat([0, 90, 180, 270])); const fn = P(FNEV); const d = szogAlak(m); const e = nevErtek(fn, d);
    // rossz opciók: ugyanaz előjel nélkül / ellentett, és szomszédos értékek
    const absT = e.txt.replace('−', ''); const ell = e.txt.startsWith('−') ? absT : (e.txt === '0' || e.txt === 'nincs értelmezve' ? '1' : '−' + e.txt);
    const csal = { '1/2': ['√3/2', '√2/2'], '√3/2': ['1/2', '√2/2'], '√2/2': ['1/2', '√3/2'], '√3': ['√3/3', '1'], '√3/3': ['√3', '1'], '1': ['0', '1/2'], '0': ['1', 'nincs értelmezve'], 'nincs értelmezve': ['0', '1'] }[absT];
    const sgn = e.txt.startsWith('−') ? '−' : ''; const rossz = [ell, ...csal.map(x => (x === '0' || x === 'nincs értelmezve') ? x : sgn + x), ...MIND];
    const v = mc(e.txt, rossz);
    const ref = m % 90 === 0 ? null : (m < 90 ? m : m < 180 ? 180 - m : m < 270 ? m - 180 : 360 - m);
    return { kerdes: T`<p>Mennyi a pontos értéke? (Számológép nélkül!)</p>\[${FN[fn]}\left(${d}^{\circ}\right)\]`, valasz: v,
      tipp: T`Vezesd vissza hegyesszögre (a vízszintes tengelytől mért szögre), és döntsd el az előjelet a síknegyed alapján.`,
      megoldas: ref === null ? [T`${d !== m ? T`\(${d}^{\circ}\equiv ${m}^{\circ}\). ` : ''}A szög iránya a koordinátatengelyen van, a hozzá tartozó egységköri pont \((${Math.round(f('cos', m))};\ ${Math.round(f('sin', m))})\).`, T`\[${FN[fn]}\left(${d}^{\circ}\right)=${e.tex}\]`]
        : [T`${d !== m ? T`\(${d}^{\circ}\equiv ${m}^{\circ}\). ` : ''}\(${m}^{\circ}\) a ${negyed(m)} síknegyedben van, a hozzá tartozó hegyesszög \(${ref}^{\circ}\).`, T`\[${FN[fn]}\left(${d}^{\circ}\right)=${e.tex.startsWith('-') ? '-' : ''}${FN[fn]}\,${ref}^{\circ}=${e.tex}\]`] };
  } };

  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  feladatok.sfPitagorasz = { nev: 'Egyik értékből a többi', general() {
    const [p, q, h] = P(TRIP); const sw = R(0, 1); const s0 = sw ? p : q, c0 = sw ? q : p; // |sin| = s0/h, |cos| = c0/h
    const nq = R(1, 4); const sgS = nq <= 2 ? 1 : -1, sgC = (nq === 1 || nq === 4) ? 1 : -1;
    const sin = F(sgS * s0, h), cos = F(sgC * c0, h), tg = F(sgS * sgC * s0, c0);
    const adott = P(['sin', 'cos']); const kerd = P(['sin', 'cos', 'tg'].filter(x => x !== adott)); const V = { sin, cos, tg };
    const tart = ['0^{\\circ}\\lt\\alpha\\lt 90^{\\circ}', '90^{\\circ}\\lt\\alpha\\lt 180^{\\circ}', '180^{\\circ}\\lt\\alpha\\lt 270^{\\circ}', '270^{\\circ}\\lt\\alpha\\lt 360^{\\circ}'][nq - 1];
    const masik = adott === 'sin' ? 'cos' : 'sin';
    return { kerdes: T`<p>Tudjuk, hogy \(${FN[adott]}\alpha=${ft(V[adott])}\) és \(${tart}\). Mennyi \(${FN[kerd]}\alpha\)?</p>`, valasz: { ertekek: [fv(V[kerd])] }, formatum: FMT.frac,
      tipp: T`\(\sin^2\alpha+\cos^2\alpha=1\); az előjelet a síknegyed dönti el. \(\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\).`,
      megoldas: [T`\[${FN[masik]}^{2}\alpha=1-\left(${ft(V[adott])}\right)^{2}=\frac{${V[masik].n ** 2}}{${h * h}}\quad\Rightarrow\quad ${FN[masik]}\alpha=\pm\frac{${Math.abs(V[masik].n)}}{${h}}\]`,
        T`A ${['I.', 'II.', 'III.', 'IV.'][nq - 1]} síknegyedben \(${FN[masik]}\alpha${V[masik].n > 0 ? '\\gt' : '\\lt'}0\), ezért \(${FN[masik]}\alpha=${ft(V[masik])}\).`,
        ...(kerd === 'tg' ? [T`\[\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}=${ft(tg)}\]`] : [])] };
  } };

  feladatok.sfVissza = { nev: 'Visszavezetés hegyesszögre', general() {
    let m; do { m = R(91, 359); } while (m % 90 === 0); const fn = P(FNEV); const d = szogAlak(m);
    const ref = m < 180 ? 180 - m : m < 270 ? m - 180 : 360 - m; const sg = Math.sign(f(fn, m));
    return { kerdes: T`<p>Írd fel hegyesszög szögfüggvényével! Melyik hegyesszög kerül a négyzet helyére?</p>\[${FN[fn]}\left(${d}^{\circ}\right)=${sg < 0 ? '-' : ''}${FN[fn]}\,\square^{\circ}\]`,
      valasz: { ertekek: [ref] }, formatum: 'egész szám (fok)',
      tipp: T`A ${'II.'} negyedben \(180^{\circ}-\alpha\), a III.-ban \(\alpha-180^{\circ}\), a IV.-ben \(360^{\circ}-\alpha\) a hozzá tartozó hegyesszög.`,
      megoldas: [T`${d !== m ? T`\(${d}^{\circ}\equiv ${m}^{\circ}\); ` : ''}a ${negyed(m)} síknegyedben a hegyesszög: \(${m < 180 ? `180^{\\circ}-${m}^{\\circ}` : m < 270 ? `${m}^{\\circ}-180^{\\circ}` : `360^{\\circ}-${m}^{\\circ}`}=${ref}^{\\circ}\).`,
        T`Ott a(z) \(${FN[fn]}\) ${sg > 0 ? 'pozitív' : 'negatív'}, így \(${FN[fn]}\left(${d}^{\circ}\right)=${sg < 0 ? '-' : ''}${FN[fn]}\,${ref}^{\circ}\).`] };
  } };

  Tananyag.fejezet({
    id: 'trigk1',
    szint: 'emelt',
    cim: 'Szögfüggvények tetszőleges szögre (ismétlés)',
    rovid: 'Forgásszögek',
    bevezeto: T`A szinusztétel, a koszinusztétel és a trigonometrikus egyenletek tompaszögekkel és 360°-nál nagyobb szögekkel is dolgoznak: ehhez kell az egységkör.`,
    elmelet: T`<div class="prose"><p><b>Egységkör:</b> az origó körüli 1 sugarú körön az \(\alpha\) szöghöz tartozó pont koordinátái \(P(\cos\alpha;\ \sin\alpha)\). A tangens: \(\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\) (ha \(\cos\alpha\ne0\)).</p>
<p><b>Előjelek:</b> I. negyed: mind pozitív; II.: csak a sin pozitív; III.: csak a tg pozitív; IV.: csak a cos pozitív.</p>
<p><b>Visszavezetés hegyesszögre:</b></p></div>
<div class="mathbox">\[\sin(180^{\circ}-\alpha)=\sin\alpha\qquad \cos(180^{\circ}-\alpha)=-\cos\alpha\qquad \sin(-\alpha)=-\sin\alpha\qquad \cos(-\alpha)=\cos\alpha\]\[\sin(\alpha+360^{\circ})=\sin\alpha\qquad \cos(\alpha+360^{\circ})=\cos\alpha\qquad \operatorname{tg}(\alpha+180^{\circ})=\operatorname{tg}\alpha\]</div>
<div class="prose"><p><b>Pitagoraszi összefüggés:</b> \(\sin^2\alpha+\cos^2\alpha=1\) minden szögre. A radiánról az 1. fejezetben olvashatsz: \(180^{\circ}=\pi\).</p></div>`,
    igazHamis: [
      { allitas: T`\(\sin 150^{\circ}=\sin 30^{\circ}\)`, igaz: true, miert: T`\(\sin(180^{\circ}-\alpha)=\sin\alpha\).` },
      { allitas: T`\(\cos 120^{\circ}=\cos 60^{\circ}\)`, igaz: false, miert: T`\(\cos 120^{\circ}=-\cos 60^{\circ}=-\frac12\).` },
      { allitas: T`Tompaszög koszinusza negatív.`, igaz: true, miert: T`A II. síknegyedben az egységkör pontjának \(x\) koordinátája negatív.` },
      { allitas: T`\(\operatorname{tg} 90^{\circ}\) nincs értelmezve.`, igaz: true, miert: T`\(\cos 90^{\circ}=0\), nullával nem osztunk.` },
      { allitas: T`\(\sin(-30^{\circ})=\frac12\)`, igaz: false, miert: T`A szinusz páratlan: \(\sin(-30^{\circ})=-\frac12\).` },
      { allitas: T`\(\cos 400^{\circ}=\cos 40^{\circ}\)`, igaz: true, miert: T`\(400^{\circ}=40^{\circ}+360^{\circ}\), a koszinusz 360° szerint periodikus.` },
      { allitas: T`Van olyan szög, amelyre \(\sin\alpha=1{,}2\).`, igaz: false, miert: T`\(-1\le\sin\alpha\le 1\) minden szögre.` },
      { allitas: T`\(\pi\) radián \(=180^{\circ}\)`, igaz: true, miert: T`A teljes kör \(2\pi\) radián \(=360^{\circ}\).` }
    ],
    mintapelda: {
      feladat: T`Számítsd ki: \(\cos 240^{\circ}\).`,
      lepesek: [
        T`\(240^{\circ}\) a III. síknegyedben van (180° és 270° között).`,
        T`A hozzá tartozó hegyesszög: \(240^{\circ}-180^{\circ}=60^{\circ}\).`,
        T`A III. negyedben a koszinusz negatív, ezért \(\cos 240^{\circ}=-\cos 60^{\circ}=-\frac12\).`
      ]
    },
    grafikon: M11.egysegkor({ max: 360 }), grafikonCim: 'Egységkör – forgásszögek', grafikonTag: 'teljes kör',
    feladatok
  });
})();
