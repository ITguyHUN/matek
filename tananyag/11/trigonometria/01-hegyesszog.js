/*
 * 1. fejezet – Hegyesszögek szögfüggvényei (ismétlés)
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const { nv, sinD, cosD, tgD, asinD, acosD, atgD, tiz, sz, fk, hossz, szog, FH, PIT, fnT, abraDerek } = M11;
  const feladatok = {};
  const S2 = T`\sqrt{2}`, S3 = T`\sqrt{3}`;
  const kT = k => k === 1 ? '' : `${k}\\cdot `;

  /* nevezetes szögek: olyan tagok, amelyek értéke racionális */
  const TAG = [
    { t: T`\sin 30^\circ`, s: T`\frac{1}{2}`, f: F(1, 2) }, { t: T`\cos 60^\circ`, s: T`\frac{1}{2}`, f: F(1, 2) },
    { t: T`\operatorname{tg} 45^\circ`, s: '1', f: F(1) }, { t: T`\sin 90^\circ`, s: '1', f: F(1) }, { t: T`\cos 0^\circ`, s: '1', f: F(1) },
    { t: T`\sin^2 45^\circ`, s: T`\left(\frac{${S2}}{2}\right)^2`, f: F(1, 2) }, { t: T`\cos^2 45^\circ`, s: T`\left(\frac{${S2}}{2}\right)^2`, f: F(1, 2) },
    { t: T`\sin^2 60^\circ`, s: T`\left(\frac{${S3}}{2}\right)^2`, f: F(3, 4) }, { t: T`\cos^2 30^\circ`, s: T`\left(\frac{${S3}}{2}\right)^2`, f: F(3, 4) },
    { t: T`\sin^2 30^\circ`, s: T`\left(\frac{1}{2}\right)^2`, f: F(1, 4) }, { t: T`\cos^2 60^\circ`, s: T`\left(\frac{1}{2}\right)^2`, f: F(1, 4) },
    { t: T`\operatorname{tg}^2 60^\circ`, s: T`\left(${S3}\right)^2`, f: F(3) }, { t: T`\operatorname{tg}^2 30^\circ`, s: T`\left(\frac{${S3}}{3}\right)^2`, f: F(1, 3) },
    { t: T`\operatorname{tg} 30^\circ\cdot\operatorname{tg} 60^\circ`, s: T`\frac{${S3}}{3}\cdot ${S3}`, f: F(1) },
    { t: T`\sin 60^\circ\cdot\cos 30^\circ`, s: T`\frac{${S3}}{2}\cdot\frac{${S3}}{2}`, f: F(3, 4) },
    { t: T`\sin 45^\circ\cdot\cos 45^\circ`, s: T`\frac{${S2}}{2}\cdot\frac{${S2}}{2}`, f: F(1, 2) },
    { t: T`\sin 60^\circ\cdot\operatorname{tg} 60^\circ`, s: T`\frac{${S3}}{2}\cdot ${S3}`, f: F(3, 2) },
    { t: T`\cos 30^\circ\cdot\operatorname{tg} 30^\circ`, s: T`\frac{${S3}}{2}\cdot\frac{${S3}}{3}`, f: F(1, 2) },
    { t: T`\sin 30^\circ\cdot\cos 60^\circ`, s: T`\frac{1}{2}\cdot\frac{1}{2}`, f: F(1, 4) }
  ];

  feladatok.nevezetes = { nev: 'Nevezetes szögek', general() {
    const a = P(TAG); let b; do { b = P(TAG); } while (b === a);
    const k1 = P([1, 1, 2, 3, 4]), k2 = P([1, 2, 3, 4, 6]), m = P([1, -1]);
    const ered = fadd(F(k1 * a.f.n, a.f.d), F(m * k2 * b.f.n, b.f.d));
    const op = m > 0 ? '+' : '-';
    return { kerdes: T`<p>Számítsd ki számológép nélkül, pontosan!</p>\[${kT(k1)}${a.t}${op}${kT(k2)}${b.t}\]`,
      valasz: { ertekek: [fv(ered)] }, formatum: FMT.frac,
      tipp: T`Írd be a nevezetes szögek pontos értékeit: \(\sin 30^\circ=\frac12\), \(\sin 45^\circ=\frac{\sqrt2}{2}\), \(\sin 60^\circ=\frac{\sqrt3}{2}\), \(\operatorname{tg} 30^\circ=\frac{\sqrt3}{3}\), \(\operatorname{tg} 60^\circ=\sqrt3\).`,
      megoldas: [T`\[${kT(k1)}${a.s}${op}${kT(k2)}${b.s}=${kT(k1)}${ft(a.f)}${op}${kT(k2)}${ft(b.f)}=${ft(ered)}\]`] };
  } };

  /* derékszögű háromszög: γ = 90°, a = BC (α-val szemközti), b = CA (α melletti), c = AB (átfogó) */
  const ADAT = T`<p>Az \(ABC\) derékszögű háromszögben \(\gamma=90^\circ\) (a szokásos jelölésekkel: \(c\) az átfogó, \(a\) az \(\alpha\)-val szemközti befogó).</p>`;
  feladatok.derekOldal = { nev: 'Hiányzó oldal', general() {
    const al = tiz(15, 75, R(0, 2) ? 0 : 1), betaAdott = R(0, 3) === 0, sz0 = betaAdott ? T`\beta=${fk(90 - al)}` : T`\alpha=${fk(al)}`;
    const elo = betaAdott ? [T`\(\alpha=90^\circ-\beta=${fk(al)}\)`] : [];
    const L = tiz(3, 30, 1), eset = R(0, 5);
    const E = [
      { adott: T`c=${sz(L, 1)}`, ker: 'a', v: L * sinD(al), lep: T`\[\sin\alpha=\frac{a}{c}\ \Rightarrow\ a=c\cdot\sin\alpha=${sz(L, 1)}\cdot\sin ${fk(al)}`, fn: 'szinusz' },
      { adott: T`c=${sz(L, 1)}`, ker: 'b', v: L * cosD(al), lep: T`\[\cos\alpha=\frac{b}{c}\ \Rightarrow\ b=c\cdot\cos\alpha=${sz(L, 1)}\cdot\cos ${fk(al)}`, fn: 'koszinusz' },
      { adott: T`b=${sz(L, 1)}`, ker: 'a', v: L * tgD(al), lep: T`\[\operatorname{tg}\alpha=\frac{a}{b}\ \Rightarrow\ a=b\cdot\operatorname{tg}\alpha=${sz(L, 1)}\cdot\operatorname{tg} ${fk(al)}`, fn: 'tangens' },
      { adott: T`a=${sz(L, 1)}`, ker: 'c', v: L / sinD(al), lep: T`\[\sin\alpha=\frac{a}{c}\ \Rightarrow\ c=\frac{a}{\sin\alpha}=\frac{${sz(L, 1)}}{\sin ${fk(al)}}`, fn: 'szinusz' },
      { adott: T`b=${sz(L, 1)}`, ker: 'c', v: L / cosD(al), lep: T`\[\cos\alpha=\frac{b}{c}\ \Rightarrow\ c=\frac{b}{\cos\alpha}=\frac{${sz(L, 1)}}{\cos ${fk(al)}}`, fn: 'koszinusz' },
      { adott: T`a=${sz(L, 1)}`, ker: 'b', v: L / tgD(al), lep: T`\[\operatorname{tg}\alpha=\frac{a}{b}\ \Rightarrow\ b=\frac{a}{\operatorname{tg}\alpha}=\frac{${sz(L, 1)}}{\operatorname{tg} ${fk(al)}}`, fn: 'tangens' }
    ][eset];
    return { kerdes: T`${ADAT}<p>Adott: \(${E.adott}\) cm és \(${sz0}\). Mekkora ${nv(E.ker)} \(${E.ker}\) oldal?</p>`,
      valasz: hossz(E.v), formatum: 'cm, ' + FH.hossz,
      tipp: `Melyik két oldal szerepel (az adott és a keresett)? Az α-hoz képest szemközti befogó, szomszédos befogó vagy átfogó? Ez dönti el, hogy a ${E.fn}t kell használni.`,
      megoldas: [...elo, T`${E.lep}\approx ${sz(E.v)}\ \text{cm}\]`] };
  } };

  feladatok.derekSzog = { nev: 'Hegyesszög két oldalból', general() {
    const eset = R(0, 2); let a, b, c, al, lep;
    if (eset === 0) { a = tiz(2, 20, 1); b = tiz(2, 20, 1); al = atgD(a / b); lep = T`\[\operatorname{tg}\alpha=\frac{a}{b}=\frac{${sz(a, 1)}}{${sz(b, 1)}}\approx ${sz(a / b, 4)}`; }
    else if (eset === 1) { c = tiz(5, 30, 1); a = tiz(1, c - 0.5, 1); al = asinD(a / c); lep = T`\[\sin\alpha=\frac{a}{c}=\frac{${sz(a, 1)}}{${sz(c, 1)}}\approx ${sz(a / c, 4)}`; }
    else { c = tiz(5, 30, 1); b = tiz(1, c - 0.5, 1); al = acosD(b / c); lep = T`\[\cos\alpha=\frac{b}{c}=\frac{${sz(b, 1)}}{${sz(c, 1)}}\approx ${sz(b / c, 4)}`; }
    const ad = [a != null ? T`a=${sz(a, 1)}` : null, b != null ? T`b=${sz(b, 1)}` : null, c != null ? T`c=${sz(c, 1)}` : null].filter(Boolean).join(T`\ \text{cm},\ `);
    const kerB = R(0, 3) === 0;
    return { kerdes: T`${ADAT}<p>Adott: \(${ad}\ \text{cm}\). Mekkora ${kerB ? 'a' : 'az'} \(${kerB ? T`\beta` : T`\alpha`}\) szög?</p>`,
      valasz: szog(kerB ? 90 - al : al), formatum: FH.szog,
      tipp: 'Válaszd ki azt a szögfüggvényt, amelyik pont a két adott oldal arányát adja, majd a számológép inverz gombjával (sin⁻¹, cos⁻¹, tan⁻¹) számold ki a szöget. A számológép DEG (fok) módban legyen!',
      megoldas: [T`${lep}\ \Rightarrow\ \alpha\approx ${fk(al)}\]`, kerB ? T`\[\beta=90^\circ-\alpha\approx ${fk(90 - al)}\]` : ''].filter(Boolean) };
  } };

  feladatok.egybolMasik = { nev: 'Egy szögfüggvényből a többi', general() {
    const [p0, q0, r] = P(PIT); const [p, q] = R(0, 1) ? [p0, q0] : [q0, p0];   // p: szemközti, q: szomszédos befogó, r: átfogó
    const ert = { sin: F(p, r), cos: F(q, r), tg: F(p, q) };
    const nev = { sin: T`\sin\alpha`, cos: T`\cos\alpha`, tg: T`\operatorname{tg}\alpha` };
    const adott = P(['sin', 'cos', 'tg']); const ker = P(['sin', 'cos', 'tg'].filter(x => x !== adott));
    const lep = adott === 'tg'
      ? T`Vegyünk fel egy derékszögű háromszöget, amelyben a szemközti befogó \(${p}\), a szomszédos \(${q}\) egység. Az átfogó Pitagorasz-tétellel: \(\sqrt{${p}^2+${q}^2}=${r}\).`
      : T`Vegyünk fel egy derékszögű háromszöget, amelyben ${adott === 'sin' ? 'a szemközti befogó' : 'a szomszédos befogó'} \(${adott === 'sin' ? p : q}\), az átfogó \(${r}\) egység. A harmadik oldal Pitagorasz-tétellel: \(\sqrt{${r}^2-${adott === 'sin' ? p : q}^2}=${adott === 'sin' ? q : p}\).`;
    return { kerdes: T`<p>Az \(\alpha\) hegyesszögre \(${nev[adott]}=${ft(ert[adott])}\). Számítsd ki pontosan \(${nev[ker]}\) értékét!</p>`,
      valasz: { ertekek: [fv(ert[ker])] }, formatum: 'tört alakban (pl. 12/13)',
      tipp: T`Rajzolj derékszögű háromszöget a megadott oldalaránnyal, és számold ki a harmadik oldalt Pitagorasz-tétellel. (Másik út: \(\sin^2\alpha+\cos^2\alpha=1\).)`,
      megoldas: [lep, T`\[${nev[ker]}=${ft(ert[ker])}\]`] };
  } };

  feladatok.alkalmazas = { nev: 'Gyakorlati feladat', general() {
    const eset = R(0, 5);
    if (eset === 0) { const L = tiz(3, 9, 1), fi = R(55, 80);
      return { kerdes: T`<p>Egy \(${sz(L, 1)}\) m hosszú létra a falnak támaszkodik, és \(${fi}^\circ\)-os szöget zár be a vízszintes talajjal. Milyen magasan éri el a létra a falat?</p>`,
        valasz: hossz(L * sinD(fi)), formatum: 'm, ' + FH.hossz, tipp: 'A létra az átfogó, a fal menti magasság a talajjal bezárt szöggel szemközti befogó.',
        megoldas: [T`\[m=L\cdot\sin ${fi}^\circ=${sz(L, 1)}\cdot\sin ${fi}^\circ\approx ${sz(L * sinD(fi))}\ \text{m}\]`] }; }
    if (eset === 1) { const s = tiz(8, 60, 1), fi = R(20, 65);
      return { kerdes: T`<p>Egy torony árnyéka a vízszintes talajon \(${sz(s, 1)}\) m hosszú, a napsugarak \(${fi}^\circ\)-os szöget zárnak be a talajjal. Milyen magas a torony?</p>`,
        valasz: hossz(s * tgD(fi)), formatum: 'm, ' + FH.hossz, tipp: 'A torony és az árnyéka egy derékszögű háromszög két befogója. A szöggel szemközti befogó a torony.',
        megoldas: [T`\[h=s\cdot\operatorname{tg} ${fi}^\circ=${sz(s, 1)}\cdot\operatorname{tg} ${fi}^\circ\approx ${sz(s * tgD(fi))}\ \text{m}\]`] }; }
    if (eset === 2) { const p = P([4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20, 25]);
      return { kerdes: T`<p>Egy út emelkedése \(${p}\%\), vagyis 100 m vízszintes távolságon \(${p}\) m-t emelkedik. Mekkora szöget zár be az út a vízszintessel?</p>`,
        valasz: szog(atgD(p / 100)), formatum: FH.szog, tipp: 'Az emelkedés (függőleges) és a vízszintes távolság a két befogó; a tangens a kettő hányadosa.',
        megoldas: [T`\[\operatorname{tg}\alpha=\frac{${p}}{100}=${nt(p / 100)}\ \Rightarrow\ \alpha\approx ${fk(atgD(p / 100))}\]`] }; }
    if (eset === 3) { const z = R(30, 120), fi = R(25, 70), k = tiz(1, 1.8, 1);
      return { kerdes: T`<p>Egy sárkány zsinórja \(${z}\) m hosszú, kifeszítve \(${fi}^\circ\)-os szöget zár be a vízszintessel. A zsinórt \(${sz(k, 1)}\) m magasan tartják. Milyen magasan van a sárkány a talaj felett?</p>`,
        valasz: hossz(z * sinD(fi) + k), formatum: 'm, ' + FH.hossz, tipp: 'A zsinór az átfogó; a kéz feletti magasság a szöggel szemközti befogó. Ne felejtsd el hozzáadni a kéz magasságát!',
        megoldas: [T`\[m=${z}\cdot\sin ${fi}^\circ+${sz(k, 1)}\approx ${sz(z * sinD(fi))}+${sz(k, 1)}\approx ${sz(z * sinD(fi) + k)}\ \text{m}\]`] }; }
    if (eset === 4) { const h = P([30, 40, 45, 50, 60, 75, 80, 90, 100, 120]), fi = P([3, 4, 5, 6]);
      return { kerdes: T`<p>Egy \(${h}\) cm magas lépcső mellé akadálymentes rámpát építenek, amely legfeljebb \(${fi}^\circ\)-os szöget zárhat be a vízszintessel. Legalább milyen hosszú legyen a rámpa (a ferde felülete)?</p>`,
        valasz: hossz(h / sinD(fi) / 100), formatum: 'méterben, ' + FH.hossz, tipp: 'A rámpa az átfogó, a szinttávolság a szöggel szemközti befogó. Az eredményt méterben add meg!',
        megoldas: [T`\[L=\frac{${h}}{\sin ${fi}^\circ}\approx ${sz(h / sinD(fi), 1)}\ \text{cm}\approx ${sz(h / sinD(fi) / 100)}\ \text{m}\]`] }; }
    const h = tiz(10, 80, 1), d = tiz(20, 150, 1);
    return { kerdes: T`<p>Egy \(${sz(h, 1)}\) m magas világítótorony tetejéről egy hajót \(${sz(d, 1)}\) m vízszintes távolságban látnak. Mekkora szögben látszik a hajó a vízszinteshez képest lefelé (depressziószög)?</p>`,
      valasz: szog(atgD(h / d)), formatum: FH.szog, tipp: 'Rajzold le! A lefelé mért szög váltószöge a hajónál mért emelkedési szögnek; a magasság és a vízszintes távolság a két befogó.',
      megoldas: [T`\[\operatorname{tg}\delta=\frac{${sz(h, 1)}}{${sz(d, 1)}}\approx ${sz(h / d, 4)}\ \Rightarrow\ \delta\approx ${fk(atgD(h / d))}\]`] };
  } };

  feladatok.potszog = { nev: 'Pótszög, sin²α + cos²α = 1', general() {
    const x = R(1, 89), eset = R(0, 4);
    if (eset === 0) { const fn = P([['sin', 'cos'], ['cos', 'sin']]);
      return { kerdes: T`<p>Melyik hegyesszög kerül a négyzet helyére?</p>\[${fnT[fn[0]]} ${x}^\circ=${fnT[fn[1]]}\,\square\]`, valasz: { ertekek: [90 - x] }, formatum: 'fokban, egész szám',
        tipp: T`Pótszögek: \(\sin\alpha=\cos(90^\circ-\alpha)\) és \(\cos\alpha=\sin(90^\circ-\alpha)\).`, megoldas: [T`\[${fnT[fn[0]]} ${x}^\circ=${fnT[fn[1]]}(90^\circ-${x}^\circ)=${fnT[fn[1]]} ${90 - x}^\circ\]`] }; }
    if (eset === 1) { const k = R(2, 9);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${k}\sin^2 ${x}^\circ+${k}\sin^2 ${90 - x}^\circ\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: T`\(\sin ${90 - x}^\circ=\cos ${x}^\circ\), és \(\sin^2\alpha+\cos^2\alpha=1\).`, megoldas: [T`\[${k}\left(\sin^2 ${x}^\circ+\cos^2 ${x}^\circ\right)=${k}\cdot 1=${k}\]`] }; }
    if (eset === 2) { const k = R(2, 6);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${k}\cdot\operatorname{tg} ${x}^\circ\cdot\operatorname{tg} ${90 - x}^\circ\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: T`\(\operatorname{tg}(90^\circ-\alpha)=\frac{\cos\alpha}{\sin\alpha}=\frac{1}{\operatorname{tg}\alpha}\).`, megoldas: [T`\[\operatorname{tg} ${x}^\circ\cdot\operatorname{tg} ${90 - x}^\circ=\frac{\sin ${x}^\circ}{\cos ${x}^\circ}\cdot\frac{\cos ${x}^\circ}{\sin ${x}^\circ}=1,\ \text{így az érték } ${k}.\]`] }; }
    if (eset === 3) { const k = R(2, 9), m = R(1, 9);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${m + k}-${k}\cos^2 ${x}^\circ-${k}\sin^2 ${x}^\circ\]`, valasz: { ertekek: [m] }, formatum: 'egész szám',
        tipp: T`Emeld ki a \(${k}\)-t: \(\cos^2\alpha+\sin^2\alpha=1\).`, megoldas: [T`\[${m + k}-${k}\left(\cos^2 ${x}^\circ+\sin^2 ${x}^\circ\right)=${m + k}-${k}=${m}\]`] }; }
    const k = R(2, 9);
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\frac{${k}\sin ${x}^\circ}{\cos ${90 - x}^\circ}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: T`\(\cos(90^\circ-\alpha)=\sin\alpha\).`, megoldas: [T`\[\cos ${90 - x}^\circ=\sin ${x}^\circ,\ \text{így}\ \frac{${k}\sin ${x}^\circ}{\sin ${x}^\circ}=${k}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig01',
    cim: 'Hegyesszögek szögfüggvényei (ismétlés)',
    rovid: 'Hegyesszögek',
    bevezeto: 'A derékszögű háromszög oldalainak arányai csak a hegyesszögtől függenek: ezek a szögfüggvények. Ismétlés a 10. évfolyamból, ez minden további fejezet alapja.',
    elmelet: T`<div class="prose"><p>Az \(ABC\) derékszögű háromszögben (\(\gamma=90^\circ\)) az \(\alpha\) hegyesszögre:</p></div>
<div class="prose">${abraDerek()}</div>
<div class="mathbox">\[\sin\alpha=\frac{\text{szemközti befogó}}{\text{átfogó}}=\frac{a}{c}\qquad \cos\alpha=\frac{\text{szomszédos befogó}}{\text{átfogó}}=\frac{b}{c}\qquad \operatorname{tg}\alpha=\frac{\text{szemközti befogó}}{\text{szomszédos befogó}}=\frac{a}{b}\]</div>
<div class="prose"><p><b>Nevezetes szögek</b> (ezeket fejből kell tudni):</p></div>
<div class="tbl"><table><tr><th>\(\alpha\)</th><th>\(30^\circ\)</th><th>\(45^\circ\)</th><th>\(60^\circ\)</th></tr>
<tr><td>\(\sin\alpha\)</td><td>\(\frac{1}{2}\)</td><td>\(\frac{\sqrt2}{2}\)</td><td>\(\frac{\sqrt3}{2}\)</td></tr>
<tr><td>\(\cos\alpha\)</td><td>\(\frac{\sqrt3}{2}\)</td><td>\(\frac{\sqrt2}{2}\)</td><td>\(\frac{1}{2}\)</td></tr>
<tr><td>\(\operatorname{tg}\alpha\)</td><td>\(\frac{\sqrt3}{3}\)</td><td>\(1\)</td><td>\(\sqrt3\)</td></tr></table></div>
<div class="prose"><p><b>Összefüggések</b> (minden hegyesszögre):</p></div>
<div class="mathbox">\[\sin(90^\circ-\alpha)=\cos\alpha\qquad \cos(90^\circ-\alpha)=\sin\alpha\qquad \sin^2\alpha+\cos^2\alpha=1\qquad \operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\]</div>
<div class="prose"><ul><li>Hegyesszögre \(0\lt\sin\alpha\lt 1\) és \(0\lt\cos\alpha\lt 1\), mert a befogó rövidebb az átfogónál. A tangens bármilyen pozitív szám lehet.</li>
<li>Ha \(\alpha\) nő, \(\sin\alpha\) és \(\operatorname{tg}\alpha\) nő, \(\cos\alpha\) csökken.</li>
<li><b>Számológép:</b> fok (DEG) módban számolj! Szögből értéket a sin, cos, tan gombbal, értékből szöget a \(\sin^{-1}\), \(\cos^{-1}\), \(\tan^{-1}\) (SHIFT + sin…) gombbal kapsz.</li>
<li><b>Megoldási terv:</b> 1) ábra, a derékszög és a szög megjelölése; 2) melyik oldal adott, melyik a keresett az adott szöghöz képest; 3) a két oldalt összekapcsoló szögfüggvény; 4) rendezés, számolás; 5) mértékegység, ésszerűség (az átfogó a leghosszabb!).</li></ul></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`\(\sin 30^\circ=\cos 60^\circ\)`, igaz: true, miert: T`A \(30^\circ\) és a \(60^\circ\) pótszögek, ezért \(\sin 30^\circ=\cos 60^\circ=\frac12\).` },
      { allitas: T`\(\operatorname{tg} 45^\circ=1\)`, igaz: true, miert: 'Az egyenlő szárú derékszögű háromszögben a két befogó egyenlő, hányadosuk 1.' },
      { allitas: T`Van olyan hegyesszög, amelyre \(\sin\alpha=1{,}2\).`, igaz: false, miert: 'A szemközti befogó mindig rövidebb az átfogónál, így hegyesszög szinusza 1-nél kisebb.' },
      { allitas: T`Ha az \(\alpha\) hegyesszög nő, akkor \(\cos\alpha\) is nő.`, igaz: false, miert: 'A koszinusz hegyesszögekre csökken: cos 0° = 1, cos 90° = 0.' },
      { allitas: T`\(\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\)`, igaz: true, miert: T`\(\frac{a/c}{b/c}=\frac{a}{b}=\operatorname{tg}\alpha\).` },
      { allitas: T`Minden hegyesszögre \(\sin^2\alpha+\cos^2\alpha=1\).`, igaz: true, miert: T`\(\frac{a^2}{c^2}+\frac{b^2}{c^2}=\frac{a^2+b^2}{c^2}=1\) a Pitagorasz-tétel miatt.` },
      { allitas: T`\(\sin 60^\circ=2\cdot\sin 30^\circ\)`, igaz: false, miert: T`\(\sin 60^\circ=\frac{\sqrt3}{2}\approx 0{,}87\), míg \(2\sin 30^\circ=1\). A szinusz nem arányos a szöggel.` },
      { allitas: T`\(\operatorname{tg} 60^\circ=\sqrt3\)`, igaz: true, miert: T`\(\frac{\sin 60^\circ}{\cos 60^\circ}=\frac{\sqrt3/2}{1/2}=\sqrt3\).` },
      { allitas: T`Hegyesszög tangense lehet 1-nél nagyobb.`, igaz: true, miert: T`Például \(\operatorname{tg} 60^\circ=\sqrt3\approx 1{,}73\). Ha a szemközti befogó a hosszabb, a tangens nagyobb 1-nél.` },
      { allitas: T`\(\sin 40^\circ\gt\sin 50^\circ\)`, igaz: false, miert: 'Hegyesszögekre a szinusz nő, így sin 40° < sin 50°.' },
      { allitas: T`\(\cos 20^\circ=\sin 70^\circ\)`, igaz: true, miert: T`Pótszögek: \(\cos\alpha=\sin(90^\circ-\alpha)\).` },
      { allitas: T`Ha egy derékszögű háromszög minden oldalát kétszeresére nagyítjuk, a hegyesszögeinek szinusza is kétszeresére nő.`, igaz: false, miert: 'Hasonló háromszögekben az oldalak aránya (és a szögek) nem változik, így a szögfüggvények sem.' },
      { general() { const x = R(5, 85), jo = R(0, 1), y = jo ? 90 - x : P([x, 180 - x, 90 + x].filter(t => t !== 90 - x && t < 180));
        return { allitas: T`\(\sin ${x}^\circ=\cos ${y}^\circ\)`, igaz: !!jo, miert: jo ? T`\(${x}^\circ+${y}^\circ=90^\circ\), pótszögek.` : T`\(\sin ${x}^\circ=\cos ${90 - x}^\circ\); a \(${y}^\circ\) nem a \(${x}^\circ\) pótszöge.` }; } }
    ],
    mintapelda: {
      feladat: T`Egy 12 m magas épület tetejéről egy fa tövét \(28^\circ\)-os depressziószögben (a vízszinteshez képest lefelé) látjuk. Milyen messze van a fa az épülettől?`,
      lepesek: [
        'Rajz: az épület (12 m) és a fa távolsága (x) egy derékszögű háromszög két befogója.',
        T`A fa tövénél mért emelkedési szög a depressziószög váltószöge, tehát szintén \(28^\circ\). Ehhez a szöghöz az épület a szemközti, a távolság a szomszédos befogó.`,
        T`\[\operatorname{tg} 28^\circ=\frac{12}{x}\quad\Rightarrow\quad x=\frac{12}{\operatorname{tg} 28^\circ}\approx\frac{12}{0{,}5317}\approx 22{,}57\ \text{m}\]`,
        'Ellenőrzés: kis szög → a távolság nagyobb, mint a magasság. Válasz: kb. 22,6 m.'
      ]
    },
    grafikon: M11.egysegkor({ max: 90 }),
    grafikonCim: 'Egységkör – hegyesszögek',
    grafikonTag: 'húzd a csúszkát',
    feladatok
  });
})();
