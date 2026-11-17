/*
 * 2. fejezet – Tompaszögek szögfüggvényei, összefüggések
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 */
(function () {
  const { sinD, cosD, tgD, asinD, acosD, atgD, kerek, fk, szog, FH, PIT, fnT } = M11;
  const feladatok = {};
  const S2 = T`\sqrt{2}`, S3 = T`\sqrt{3}`;
  const kT = k => k === 1 ? '' : `${k}\\cdot `;
  const zj = t => t.startsWith('-') ? `\\left(${t}\\right)` : t;

  const TAG = [
    { t: T`\cos 120^\circ`, s: T`\left(-\frac{1}{2}\right)`, f: F(-1, 2) }, { t: T`\sin 150^\circ`, s: T`\frac{1}{2}`, f: F(1, 2) },
    { t: T`\operatorname{tg} 135^\circ`, s: T`(-1)`, f: F(-1) }, { t: T`\cos 180^\circ`, s: T`(-1)`, f: F(-1) },
    { t: T`\sin 90^\circ`, s: '1', f: F(1) }, { t: T`\cos 90^\circ`, s: '0', f: F(0) }, { t: T`\sin 180^\circ`, s: '0', f: F(0) },
    { t: T`\cos^2 150^\circ`, s: T`\left(-\frac{${S3}}{2}\right)^2`, f: F(3, 4) }, { t: T`\sin^2 120^\circ`, s: T`\left(\frac{${S3}}{2}\right)^2`, f: F(3, 4) },
    { t: T`\cos^2 135^\circ`, s: T`\left(-\frac{${S2}}{2}\right)^2`, f: F(1, 2) }, { t: T`\sin^2 135^\circ`, s: T`\left(\frac{${S2}}{2}\right)^2`, f: F(1, 2) },
    { t: T`\operatorname{tg}^2 120^\circ`, s: T`\left(-${S3}\right)^2`, f: F(3) }, { t: T`\operatorname{tg}^2 150^\circ`, s: T`\left(-\frac{${S3}}{3}\right)^2`, f: F(1, 3) },
    { t: T`\sin 120^\circ\cdot\cos 150^\circ`, s: T`\frac{${S3}}{2}\cdot\left(-\frac{${S3}}{2}\right)`, f: F(-3, 4) },
    { t: T`\operatorname{tg} 120^\circ\cdot\operatorname{tg} 150^\circ`, s: T`\left(-${S3}\right)\cdot\left(-\frac{${S3}}{3}\right)`, f: F(1) },
    { t: T`\sin 135^\circ\cdot\cos 135^\circ`, s: T`\frac{${S2}}{2}\cdot\left(-\frac{${S2}}{2}\right)`, f: F(-1, 2) },
    { t: T`\cos 120^\circ\cdot\cos 60^\circ`, s: T`\left(-\frac{1}{2}\right)\cdot\frac{1}{2}`, f: F(-1, 4) },
    { t: T`\operatorname{tg} 150^\circ\cdot\operatorname{tg} 60^\circ`, s: T`\left(-\frac{${S3}}{3}\right)\cdot ${S3}`, f: F(-1) },
    { t: T`\sin 150^\circ\cdot\cos 120^\circ`, s: T`\frac{1}{2}\cdot\left(-\frac{1}{2}\right)`, f: F(-1, 4) }
  ];
  feladatok.tompaErtek = { nev: 'Nevezetes tompaszögek', general() {
    const a = P(TAG); let b; do { b = P(TAG); } while (b === a);
    const k1 = P([1, 1, 2, 3, 4]), k2 = P([1, 2, 3, 4, 6]), m = P([1, -1]);
    const ered = fadd(F(k1 * a.f.n, a.f.d), F(m * k2 * b.f.n, b.f.d)); const op = m > 0 ? '+' : '-';
    return { kerdes: T`<p>Számítsd ki számológép nélkül, pontosan!</p>\[${kT(k1)}${a.t}${op}${kT(k2)}${b.t}\]`,
      valasz: { ertekek: [fv(ered)] }, formatum: FMT.frac,
      tipp: T`Vezesd vissza hegyesszögre: \(\sin(180^\circ-\alpha)=\sin\alpha\), \(\cos(180^\circ-\alpha)=-\cos\alpha\), \(\operatorname{tg}(180^\circ-\alpha)=-\operatorname{tg}\alpha\). Például \(\cos 120^\circ=-\cos 60^\circ=-\frac12\).`,
      megoldas: [T`\[${kT(k1)}${a.s}${op}${kT(k2)}${b.s}=${kT(k1)}${k1 === 1 ? ft(a.f) : zj(ft(a.f))}${op}${kT(k2)}${zj(ft(b.f))}=${ft(ered)}\]`] };
  } };

  /* pontos értékek a visszakereséshez */
  const PONTOS = [
    { fn: 'sin', t: T`\frac{1}{2}`, sz: [30, 150] }, { fn: 'sin', t: T`\frac{${S2}}{2}`, sz: [45, 135] }, { fn: 'sin', t: T`\frac{${S3}}{2}`, sz: [60, 120] }, { fn: 'sin', t: '1', sz: [90] },
    { fn: 'cos', t: T`-\frac{1}{2}`, sz: [120] }, { fn: 'cos', t: T`-\frac{${S2}}{2}`, sz: [135] }, { fn: 'cos', t: T`-\frac{${S3}}{2}`, sz: [150] }, { fn: 'cos', t: '0', sz: [90] }, { fn: 'cos', t: T`\frac{1}{2}`, sz: [60] },
    { fn: 'tg', t: T`-1`, sz: [135] }, { fn: 'tg', t: T`-${S3}`, sz: [120] }, { fn: 'tg', t: T`-\frac{${S3}}{3}`, sz: [150] }, { fn: 'tg', t: T`${S3}`, sz: [60] }
  ];
  feladatok.visszakeres = { nev: 'Szög az értékből (0° és 180° között)', general() {
    const fel = T`<p>Egy háromszög egyik szöge \(\alpha\). Mekkora lehet \(\alpha\), ha</p>`;
    if (R(0, 3) === 0) { const e = P(PONTOS);
      return { kerdes: T`${fel}\[${fnT[e.fn]}\alpha=${e.t}\,?\]<p>Add meg az összes lehetséges értéket!</p>`, valasz: { ertekek: e.sz }, formatum: 'fokban; több érték esetén pontosvesszővel elválasztva',
        tipp: T`Nevezetes érték! Gondolj a \(30^\circ\), \(45^\circ\), \(60^\circ\) szögekre és a kiegészítő szögre. A szinusz a hegyes- és a tompaszögre is pozitív, a koszinusz és a tangens a tompaszögre negatív.`,
        megoldas: [e.sz.length === 2 ? T`A szinusz egy hegyesszögre és annak kiegészítő szögére ugyanannyi: \(\alpha_1=${e.sz[0]}^\circ\), \(\alpha_2=180^\circ-${e.sz[0]}^\circ=${e.sz[1]}^\circ\).` : T`\(0^\circ\) és \(180^\circ\) között egyetlen ilyen szög van: \(\alpha=${e.sz[0]}^\circ\).`] }; }
    const fn = P(['sin', 'sin', 'cos', 'tg']);
    if (fn === 'sin') { const v = R(5, 98) / 100, a1 = asinD(v);
      return { kerdes: T`${fel}\[\sin\alpha=${nt(v)}\,?\]<p>Add meg az összes lehetséges értéket!</p>`, valasz: szog(a1, 180 - a1), formatum: FH.szogok,
        tipp: T`A számológép csak a hegyesszöget adja meg (\(\sin^{-1}\)). A kiegészítő szögnek (\(180^\circ-\alpha\)) ugyanannyi a szinusza, és az is lehet egy háromszög szöge!`,
        megoldas: [T`\[\alpha_1=\sin^{-1} ${nt(v)}\approx ${fk(a1)}\]`, T`\[\alpha_2=180^\circ-${fk(a1)}\approx ${fk(180 - a1)}\]`, 'Mindkettő lehet egy háromszög szöge.'] }; }
    if (fn === 'cos') { let v; do { v = R(-95, 95) / 100; } while (Math.abs(v) < 0.03); const a = acosD(v);
      return { kerdes: T`${fel}\[\cos\alpha=${nt(v)}\,?\]<p>Add meg az összes lehetséges értéket!</p>`, valasz: szog(a), formatum: FH.szogok,
        tipp: v < 0 ? T`Negatív koszinusz → tompaszög. A számológép \(\cos^{-1}\) gombja \(0^\circ\) és \(180^\circ\) között egyetlen szöget ad, és ez a jó.` : 'Pozitív koszinusz → hegyesszög; 0° és 180° között csak egy ilyen szög van.',
        megoldas: [T`\[\alpha=\cos^{-1}\left(${nt(v)}\right)\approx ${fk(a)}\]`, T`A koszinusz \(0^\circ\) és \(180^\circ\) között minden értéket csak egyszer vesz fel, ezért ez az egyetlen megoldás.`] }; }
    let v; do { v = R(-400, 400) / 100; } while (Math.abs(v) < 0.1); const a0 = atgD(v), a = v > 0 ? a0 : 180 + a0;
    return { kerdes: T`${fel}\[\operatorname{tg}\alpha=${nt(v)}\,?\]<p>Add meg az összes lehetséges értéket!</p>`, valasz: szog(a), formatum: FH.szogok,
      tipp: v < 0 ? T`Negatív tangens → tompaszög. A számológép negatív szöget ad (\(\tan^{-1}\)); ehhez adj \(180^\circ\)-ot, vagy keresd meg a \(|${nt(v)}|\) tangensű hegyesszöget, és vond ki \(180^\circ\)-ból.` : 'Pozitív tangens → hegyesszög.',
      megoldas: v > 0 ? [T`\[\alpha=\operatorname{tg}^{-1} ${nt(v)}\approx ${fk(a)}\]`] : [T`\[\operatorname{tg}^{-1} ${nt(-v)}\approx ${fk(-a0)}\quad\Rightarrow\quad\alpha=180^\circ-${fk(-a0)}\approx ${fk(a)}\]`] };
  } };

  feladatok.atiras = { nev: 'Kiegészítő szög', general() {
    const x = R(91, 179), y = 180 - x, eset = R(0, 3);
    if (eset === 0) return { kerdes: T`<p>Melyik hegyesszög kerül a négyzet helyére?</p>\[\sin ${x}^\circ=\sin\,\square\]`, valasz: { ertekek: [y] }, formatum: 'fokban, egész szám',
      tipp: T`\(\sin(180^\circ-\alpha)=\sin\alpha\).`, megoldas: [T`\[\sin ${x}^\circ=\sin(180^\circ-${x}^\circ)=\sin ${y}^\circ\]`] };
    if (eset === 1) return { kerdes: T`<p>Melyik hegyesszög kerül a négyzet helyére?</p>\[\cos ${x}^\circ=-\cos\,\square\]`, valasz: { ertekek: [y] }, formatum: 'fokban, egész szám',
      tipp: T`\(\cos(180^\circ-\alpha)=-\cos\alpha\).`, megoldas: [T`\[\cos ${x}^\circ=-\cos(180^\circ-${x}^\circ)=-\cos ${y}^\circ\]`] };
    if (eset === 2) return { kerdes: T`<p>Melyik hegyesszög kerül a négyzet helyére?</p>\[\operatorname{tg} ${x}^\circ=-\operatorname{tg}\,\square\]`, valasz: { ertekek: [y] }, formatum: 'fokban, egész szám',
      tipp: T`\(\operatorname{tg}(180^\circ-\alpha)=-\operatorname{tg}\alpha\).`, megoldas: [T`\[\operatorname{tg} ${x}^\circ=-\operatorname{tg}(180^\circ-${x}^\circ)=-\operatorname{tg} ${y}^\circ\]`] };
    return { kerdes: T`<p>Melyik tompaszög kerül a négyzet helyére?</p>\[\sin ${y}^\circ=\sin\,\square\]`, valasz: { ertekek: [x] }, formatum: 'fokban, egész szám',
      tipp: 'A hegyesszög és a kiegészítő szöge szinusza egyenlő.', megoldas: [T`\[\sin ${y}^\circ=\sin(180^\circ-${y}^\circ)=\sin ${x}^\circ\]`] };
  } };

  feladatok.egybolMasik = { nev: 'Egy szögfüggvényből a többi', general() {
    const [p0, q0, r] = P(PIT); const [p, q] = R(0, 1) ? [p0, q0] : [q0, p0];   // α tompaszög: sin = p/r, cos = −q/r, tg = −p/q
    const ert = { sin: F(p, r), cos: F(-q, r), tg: F(-p, q) };
    const nev = { sin: T`\sin\alpha`, cos: T`\cos\alpha`, tg: T`\operatorname{tg}\alpha` };
    const adott = P(['sin', 'cos', 'cos', 'tg']); const ker = P(['sin', 'cos', 'tg'].filter(x => x !== adott));
    const lep = [];
    if (adott === 'sin') lep.push(T`\[\cos^2\alpha=1-\sin^2\alpha=1-\frac{${p * p}}{${r * r}}=\frac{${q * q}}{${r * r}}\]`, T`Mivel \(\alpha\) tompaszög, \(\cos\alpha\lt 0\): \(\cos\alpha=-\frac{${q}}{${r}}\).`);
    else if (adott === 'cos') lep.push(T`\[\sin^2\alpha=1-\cos^2\alpha=1-\frac{${q * q}}{${r * r}}=\frac{${p * p}}{${r * r}}\]`, T`A szinusz \(0^\circ\) és \(180^\circ\) között pozitív: \(\sin\alpha=\frac{${p}}{${r}}\).`);
    else lep.push(T`A tangens abszolút értéke \(\frac{${p}}{${q}}\): vegyünk egy derékszögű háromszöget \(${p}\) és \(${q}\) befogóval, az átfogója \(\sqrt{${p}^2+${q}^2}=${r}\).`, T`Tompaszögre \(\sin\alpha=\frac{${p}}{${r}}\gt 0\) és \(\cos\alpha=-\frac{${q}}{${r}}\lt 0\).`);
    if (ker === 'tg') lep.push(T`\[\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}=\frac{${p}/${r}}{-${q}/${r}}=-\frac{${p}}{${q}}\]`);
    else lep.push(T`\[${nev[ker]}=${ft(ert[ker])}\]`);
    return { kerdes: T`<p>Az \(\alpha\) tompaszögre \(${nev[adott]}=${ft(ert[adott])}\). Számítsd ki pontosan \(${nev[ker]}\) értékét!</p>`,
      valasz: { ertekek: [fv(ert[ker])] }, formatum: 'tört alakban (pl. −5/12)',
      tipp: T`Használd a \(\sin^2\alpha+\cos^2\alpha=1\) és a \(\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\) összefüggést. Figyelj az előjelre: tompaszögre a szinusz pozitív, a koszinusz és a tangens negatív.`,
      megoldas: lep };
  } };

  /* előjel: egy szögfüggvény értékének előjele */
  const elojel = (fn, x) => { const v = M11.fnV[fn](x); return Math.abs(v) < 1e-9 ? 0 : Math.sign(v); };
  feladatok.elojel = { nev: 'Milyen előjelű?', general() {
    const szogek = () => R(0, 4) === 0 ? P([90, 180]) : R(1, 179);
    const fa = P(['sin', 'cos', 'tg']), fb = P(['sin', 'cos', 'tg']); let x, y;
    do { x = szogek(); } while (fa === 'tg' && x === 90);
    do { y = szogek(); } while (fb === 'tg' && y === 90);
    const muv = P(['\\cdot', '\\cdot', '+']);
    const sa = elojel(fa, x), sb = elojel(fb, y);
    let s; if (muv === '\\cdot') s = sa * sb; else { const v = M11.fnV[fa](x) + M11.fnV[fb](y); s = Math.abs(v) < 1e-9 ? 0 : Math.sign(v); }
    if (muv === '+' && sa * sb < 0) return this.general();   // ellentétes előjelű összeg: számológép nélkül nem dönthető el
    const jel = v => v > 0 ? 'pozitív' : v < 0 ? 'negatív' : '0';
    return { kerdes: T`<p>Számológép nélkül: milyen előjelű a kifejezés értéke?</p>\[${fnT[fa]} ${x}^\circ ${muv} ${fnT[fb]} ${y}^\circ\]`,
      valasz: { valasztas: ['negatív', '0', 'pozitív'], helyes: s + 1 },
      tipp: T`\(0^\circ\) és \(180^\circ\) között a szinusz nem negatív; a koszinusz és a tangens hegyesszögre pozitív, tompaszögre negatív. \(\cos 90^\circ=0\), \(\sin 180^\circ=0\), \(\operatorname{tg} 180^\circ=0\).`,
      megoldas: [T`\(${fnT[fa]} ${x}^\circ\) ${jel(sa)}, \(${fnT[fb]} ${y}^\circ\) ${jel(sb)}, így ${muv === '+' ? 'az összeg' : 'a szorzat'} ${jel(s)}.`] };
  } };

  feladatok.osszehasonlit = { nev: 'Melyik nagyobb?', general() {
    const fn = P(['sin', 'sin', 'cos']); let x = R(5, 175), y;
    const eset = R(0, 3);
    if (eset === 0) y = 180 - x; else if (eset === 1 && fn === 'cos') y = 180 - x; else do { y = R(5, 175); } while (y === x);
    if (x === y) return this.general();
    const vx = M11.fnV[fn](x), vy = M11.fnV[fn](y); const d = vx - vy;
    const helyes = Math.abs(d) < 1e-9 ? 1 : d < 0 ? 0 : 2;
    const red = z => fn === 'sin' && z > 90 ? T`\sin ${z}^\circ=\sin ${180 - z}^\circ` : fn === 'cos' && z > 90 ? T`\cos ${z}^\circ=-\cos ${180 - z}^\circ` : T`${fnT[fn]} ${z}^\circ`;
    return { kerdes: T`<p>Számológép nélkül: melyik reláció kerül a négyzet helyére?</p>\[${fnT[fn]} ${x}^\circ\;\square\;${fnT[fn]} ${y}^\circ\]`,
      valasz: { valasztas: ['<', '=', '>'], helyes },
      tipp: fn === 'sin' ? T`Írd át a tompaszöget hegyesszögre: \(\sin(180^\circ-\alpha)=\sin\alpha\). Hegyesszögekre a szinusz nő.` : T`A koszinusz \(0^\circ\)-tól \(180^\circ\)-ig folyamatosan csökken (1-től −1-ig).`,
      megoldas: [fn === 'sin' ? T`\(${red(x)}\) és \(${red(y)}\). Hegyesszögekre a szinusz nő, ezért \(\sin ${x}^\circ${['\\lt', '=', '\\gt'][helyes]}\sin ${y}^\circ\).`
        : T`A koszinusz \(0^\circ\) és \(180^\circ\) között szigorúan csökken, ezért \(${x}^\circ${x < y ? '\\lt' : '\\gt'}${y}^\circ\) miatt \(\cos ${x}^\circ${['\\lt', '=', '\\gt'][helyes]}\cos ${y}^\circ\).`] };
  } };

  Tananyag.fejezet({
    id: 'trig02',
    cim: 'Tompaszögek szögfüggvényei, összefüggések',
    rovid: 'Tompaszögek',
    bevezeto: 'A szinusz- és a koszinusztételhez tompaszögek szögfüggvényei is kellenek. Ezeket a kiegészítő szög segítségével vezetjük vissza hegyesszögekre.',
    elmelet: T`<div class="prose"><p>Az egységkörön az \(\alpha\) szöggel elforgatott sugár végpontja \(P(\cos\alpha;\ \sin\alpha)\). Hegyesszögre ez ugyanazt adja, mint a derékszögű háromszög; ezzel a szögfüggvényeket \(0^\circ\) és \(180^\circ\) között minden szögre értelmezzük. Tompaszögre a pont a bal felső negyedbe esik: az első koordinátája (a koszinusz) negatív, a második (a szinusz) pozitív.</p>
<p><b>Kiegészítő szög</b> (\(\alpha\) és \(180^\circ-\alpha\) tükörképek az \(y\) tengelyre):</p></div>
<div class="mathbox">\[\sin(180^\circ-\alpha)=\sin\alpha\qquad \cos(180^\circ-\alpha)=-\cos\alpha\qquad \operatorname{tg}(180^\circ-\alpha)=-\operatorname{tg}\alpha\]</div>
<div class="tbl"><table><tr><th>\(\alpha\)</th><th>\(0^\circ\)</th><th>\(90^\circ\)</th><th>\(120^\circ\)</th><th>\(135^\circ\)</th><th>\(150^\circ\)</th><th>\(180^\circ\)</th></tr>
<tr><td>\(\sin\alpha\)</td><td>\(0\)</td><td>\(1\)</td><td>\(\frac{\sqrt3}{2}\)</td><td>\(\frac{\sqrt2}{2}\)</td><td>\(\frac12\)</td><td>\(0\)</td></tr>
<tr><td>\(\cos\alpha\)</td><td>\(1\)</td><td>\(0\)</td><td>\(-\frac12\)</td><td>\(-\frac{\sqrt2}{2}\)</td><td>\(-\frac{\sqrt3}{2}\)</td><td>\(-1\)</td></tr>
<tr><td>\(\operatorname{tg}\alpha\)</td><td>\(0\)</td><td>nincs</td><td>\(-\sqrt3\)</td><td>\(-1\)</td><td>\(-\frac{\sqrt3}{3}\)</td><td>\(0\)</td></tr></table></div>
<div class="prose"><p>Továbbra is igaz: \(\sin^2\alpha+\cos^2\alpha=1\) és \(\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\) (ha \(\alpha\ne 90^\circ\)).</p>
<p><b>Szög meghatározása az értékből</b> (\(0^\circ\lt\alpha\lt 180^\circ\), például egy háromszög szöge):</p>
<ul><li>\(\sin\alpha=c\) (\(0\lt c\lt 1\)): <b>két</b> megoldás, \(\alpha_1=\sin^{-1}c\) és \(\alpha_2=180^\circ-\alpha_1\). Ez okozza majd a szinusztételnél a „két háromszög” esetét.</li>
<li>\(\cos\alpha=c\): <b>egy</b> megoldás, \(\alpha=\cos^{-1}c\) (a számológép negatív \(c\)-re a tompaszöget adja).</li>
<li>\(\operatorname{tg}\alpha=c\lt 0\): a számológép negatív szöget ad; a helyes szög \(180^\circ+\operatorname{tg}^{-1}c\).</li></ul></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`\(\sin 120^\circ=\sin 60^\circ\)`, igaz: true, miert: 'Kiegészítő szögek szinusza egyenlő.' },
      { allitas: T`\(\cos 120^\circ=\cos 60^\circ\)`, igaz: false, miert: T`\(\cos 120^\circ=-\cos 60^\circ=-\frac12\).` },
      { allitas: T`Tompaszög koszinusza negatív.`, igaz: true, miert: 'Az egységkörön a pont a bal felső negyedbe esik, első koordinátája negatív.' },
      { allitas: T`Tompaszög szinusza negatív.`, igaz: false, miert: 'Az egységkörön a pont az x tengely felett van, a második koordinátája pozitív.' },
      { allitas: T`\(\operatorname{tg} 90^\circ=1\)`, igaz: false, miert: T`\(\cos 90^\circ=0\), ezért a \(\frac{\sin 90^\circ}{\cos 90^\circ}\) hányados nincs értelmezve.` },
      { allitas: T`Ha egy háromszög egyik szögére \(\sin\alpha=0{,}5\), akkor \(\alpha=30^\circ\).`, igaz: false, miert: T`\(\alpha=150^\circ\) is lehet, mert \(\sin 150^\circ=0{,}5\).` },
      { allitas: T`Ha egy háromszög egyik szögére \(\cos\alpha=-0{,}5\), akkor \(\alpha=120^\circ\).`, igaz: true, miert: 'A koszinusz 0° és 180° között minden értéket pontosan egyszer vesz fel.' },
      { allitas: T`\(\sin^2 130^\circ+\cos^2 130^\circ=1\)`, igaz: true, miert: 'Az összefüggés minden szögre igaz (az egységkör pontjára x² + y² = 1).' },
      { allitas: T`\(\cos 180^\circ=-1\)`, igaz: true, miert: T`A \(180^\circ\)-kal elforgatott egységvektor \((-1;\,0)\).` },
      { allitas: T`\(\operatorname{tg} 135^\circ=1\)`, igaz: false, miert: T`\(\operatorname{tg} 135^\circ=-\operatorname{tg} 45^\circ=-1\).` },
      { allitas: T`Egy háromszögnek legfeljebb egy olyan szöge lehet, amelynek a koszinusza negatív.`, igaz: true, miert: 'Negatív koszinusz → tompaszög, és egy háromszögben legfeljebb egy tompaszög van.' },
      { allitas: T`A koszinuszfüggvény \(0^\circ\) és \(180^\circ\) között csökken.`, igaz: true, miert: '1-ről (0°-nál) −1-re (180°-nál) csökken folyamatosan.' },
      { general() { const x = R(95, 175), jo = R(0, 1);
        return { allitas: T`\(\cos ${x}^\circ=${jo ? '-' : ''}\cos ${180 - x}^\circ\)`, igaz: !!jo, miert: T`\(\cos(180^\circ-\alpha)=-\cos\alpha\), így \(\cos ${x}^\circ=-\cos ${180 - x}^\circ\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy háromszög \(\beta\) szögére \(\sin\beta=0{,}8\). Mekkora lehet \(\beta\), és mennyi ekkor \(\cos\beta\)?`,
      lepesek: [
        T`Számológéppel: \(\beta_1=\sin^{-1}0{,}8\approx 53{,}13^\circ\).`,
        T`A kiegészítő szög szinusza ugyanennyi: \(\beta_2=180^\circ-53{,}13^\circ=126{,}87^\circ\). Mindkettő lehet egy háromszög szöge!`,
        T`\[\cos^2\beta=1-0{,}8^2=0{,}36\quad\Rightarrow\quad\cos\beta=\pm 0{,}6\]`,
        T`Hegyesszögre (\(\beta_1\)) \(\cos\beta=0{,}6\), tompaszögre (\(\beta_2\)) \(\cos\beta=-0{,}6\).`
      ]
    },
    grafikon: M11.egysegkor({ max: 180 }),
    grafikonCim: 'Egységkör – 0° és 180° között',
    grafikonTag: 'kapcsold be a kiegészítő szöget',
    feladatok
  });
})();
