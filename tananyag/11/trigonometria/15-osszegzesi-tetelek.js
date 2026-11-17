/*
 * 10. fejezet – Összegzési (addíciós) tételek és alkalmazásaik (Sokszínű matematika 11., 7–8. lecke) – emelt szint
 * Témakör: A trigonometria alkalmazásai (11. évfolyam)
 */
(function () {
  const { sinD, cosD, tgD, FN, mc } = TR;
  const feladatok = {};
  const S6 = Math.sqrt(6), S2 = Math.SQRT2, S3 = Math.sqrt(3);
  const CIMK = [[(S6 - S2) / 4, '(√6 − √2)/4', T`\frac{\sqrt6-\sqrt2}{4}`], [(S6 + S2) / 4, '(√6 + √2)/4', T`\frac{\sqrt6+\sqrt2}{4}`], [2 - S3, '2 − √3', T`2-\sqrt3`], [2 + S3, '2 + √3', T`2+\sqrt3`]];
  function cimke(x) { const e = CIMK.find(c => Math.abs(Math.abs(x) - c[0]) < 1e-9); return { txt: (x < 0 ? '−' : '') + (x < 0 && e[1].includes('/') ? e[1] : x < 0 ? '(' + e[1] + ')' : e[1]), tex: (x < 0 ? '-' : '') + (x < 0 && !e[2].startsWith('\\frac') ? `\\left(${e[2]}\\right)` : e[2]) }; }
  const BONT = { 15: [45, -30], 75: [45, 30], 105: [60, 45], 165: [120, 45], 195: [150, 45], 255: [210, 45], 285: [240, 45], 345: [300, 45] };

  feladatok.adPontos = { nev: 'Pontos érték (15°, 75°, …)', general() {
    const d = P(Object.keys(BONT).map(Number)); const fn = P(['sin', 'cos', 'tg', 'sin', 'cos']); const k = P([0, 0, 1, -1, 2]); const dd = d + 360 * k;
    const v = fn === 'sin' ? sinD(d) : fn === 'cos' ? cosD(d) : tgD(d); const c = cimke(v);
    const csal = fn === 'tg' ? ['2 − √3', '2 + √3', '−(2 − √3)', '−(2 + √3)', '√3/3'] : ['(√6 − √2)/4', '(√6 + √2)/4', '−(√6 − √2)/4', '−(√6 + √2)/4', '(√6 − √2)/2'];
    const [x, y] = BONT[d]; const op = y < 0 ? '-' : '+'; const yy = Math.abs(y);
    const kepl = { sin: T`\sin(x${op}y)=\sin x\cos y${op}\cos x\sin y`, cos: T`\cos(x${op}y)=\cos x\cos y${op === '+' ? '-' : '+'}\sin x\sin y`, tg: T`\operatorname{tg}(x${op}y)=\frac{\operatorname{tg}x${op}\operatorname{tg}y}{1${op === '+' ? '-' : '+'}\operatorname{tg}x\operatorname{tg}y}` }[fn];
    return { kerdes: T`<p>Mennyi a pontos értéke? (Összegzési tétellel, számológép nélkül)</p>\[${FN[fn]}\left(${dd}^{\circ}\right)\]`, valasz: mc(c.txt, csal),
      tipp: T`Írd fel a szöget két nevezetes szög összegeként vagy különbségeként: \(${d}^{\circ}=${x}^{\circ}${op}${yy}^{\circ}\).`,
      megoldas: [T`${k ? T`\(${dd}^{\circ}\equiv ${d}^{\circ}\) (360° többszörösével tér el). ` : ''}\(${d}^{\circ}=${x}^{\circ}${op}${yy}^{\circ}\), és \(${kepl}\).`, T`\[${FN[fn]}\left(${dd}^{\circ}\right)=${c.tex}\]`] };
  } };

  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
  function szog() { const [p, q, h] = P(TRIP); const sw = R(0, 1); const nq = P([1, 1, 2]); const s = F(sw ? p : q, h), c = F((nq === 2 ? -1 : 1) * (sw ? q : p), h); return { s, c, nq }; }
  const tart = (v, nq) => nq === 1 ? T`0^{\circ}\lt ${v}\lt 90^{\circ}` : T`90^{\circ}\lt ${v}\lt 180^{\circ}`;
  feladatok.adErtek = { nev: 'Összeg, különbség szögfüggvénye', general() {
    const A = szog(), B = szog(); const adA = P(['sin', 'cos']), adB = P(['sin', 'cos']); const fn = P(['sin', 'cos']); const op = P(['+', '-']);
    const val = fn === 'sin' ? (op === '+' ? fadd(fmul(A.s, B.c), fmul(A.c, B.s)) : fadd(fmul(A.s, B.c), fmul(F(-A.c.n, A.c.d), B.s)))
      : (op === '+' ? fadd(fmul(A.c, B.c), fmul(F(-A.s.n, A.s.d), B.s)) : fadd(fmul(A.c, B.c), fmul(A.s, B.s)));
    const ad = (X, n) => n === 'sin' ? X.s : X.c;
    return { kerdes: T`<p>Tudjuk, hogy \(${FN[adA]}\alpha=${ft(ad(A, adA))}\), ahol \(${tart('\\alpha', A.nq)}\), és \(${FN[adB]}\beta=${ft(ad(B, adB))}\), ahol \(${tart('\\beta', B.nq)}\). Mennyi \(${FN[fn]}(\alpha${op}\beta)\)?</p>`,
      valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: T`Először számold ki mindkét szög hiányzó szögfüggvényét (\(\sin^2+\cos^2=1\), az előjelet a síknegyed adja), utána alkalmazd az összegzési tételt.`,
      megoldas: [T`\(\sin\alpha=${ft(A.s)}\), \(\cos\alpha=${ft(A.c)}\); \(\sin\beta=${ft(B.s)}\), \(\cos\beta=${ft(B.c)}\).`,
        fn === 'sin' ? T`\[\sin(\alpha${op}\beta)=\sin\alpha\cos\beta${op}\cos\alpha\sin\beta=${ft(val)}\]` : T`\[\cos(\alpha${op}\beta)=\cos\alpha\cos\beta${op === '+' ? '-' : '+'}\sin\alpha\sin\beta=${ft(val)}\]`] };
  } };

  feladatok.adKetszeres = { nev: 'Kétszeres szög', general() {
    const A = szog(); const ad = P(['sin', 'cos']); const kerd = P(['sin', 'cos', 'tg']);
    const s2 = fmul(F(2), fmul(A.s, A.c)), c2 = fadd(fmul(A.c, A.c), F(-A.s.n * A.s.n, A.s.d * A.s.d)); const V = { sin: s2, cos: c2, tg: F(s2.n * c2.d, s2.d * c2.n) };
    return { kerdes: T`<p>Tudjuk, hogy \(${FN[ad]}\alpha=${ft(ad === 'sin' ? A.s : A.c)}\) és \(${tart('\\alpha', A.nq)}\). Mennyi \(${FN[kerd]}\,2\alpha\)?</p>`,
      valasz: { ertekek: [fv(V[kerd])] }, formatum: FMT.frac,
      tipp: T`\(\sin2\alpha=2\sin\alpha\cos\alpha\), \(\cos2\alpha=\cos^2\alpha-\sin^2\alpha\), \(\operatorname{tg}2\alpha=\frac{\sin2\alpha}{\cos2\alpha}\).`,
      megoldas: [T`\(\sin\alpha=${ft(A.s)}\), \(\cos\alpha=${ft(A.c)}\).`, T`\[\sin2\alpha=2\cdot ${ft(A.s)}\cdot\left(${ft(A.c)}\right)=${ft(s2)},\qquad \cos2\alpha=\left(${ft(A.c)}\right)^{2}-\left(${ft(A.s)}\right)^{2}=${ft(c2)}\]`,
        ...(kerd === 'tg' ? [T`\[\operatorname{tg}2\alpha=${ft(V.tg)}\]`] : [])] };
  } };

  const RAC_S = [0, 30, 90, 150, 180, 210, 270, 330], RAC_C = [0, 60, 90, 120, 180, 240, 270, 300];
  const ertek = (fn, d) => { const v = fn === 'sin' ? sinD(d) : cosD(d); return F(Math.round(2 * v), 2); };
  feladatok.adOsszevon = { nev: 'Összevonás összegzési tétellel', general() {
    const kind = R(0, 2);
    if (kind === 2) { const A = P([15, 45, 75, 105, 135, 165]); const val = ertek('sin', 2 * A);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[2\sin ${A}^{\circ}\cos ${A}^{\circ}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
        tipp: T`\(2\sin\alpha\cos\alpha=\sin2\alpha\).`, megoldas: [T`\[2\sin ${A}^{\circ}\cos ${A}^{\circ}=\sin ${2 * A}^{\circ}=${ft(val)}\]`] }; }
    const fn = kind === 0 ? 'sin' : 'cos'; const t = P(fn === 'sin' ? RAC_S : RAC_C); const plus = R(0, 1) === 1;
    let A, B; if (plus) { A = R(Math.max(1, t - 170), Math.min(179, t - 1)); B = t - A; } else { A = R(t + 1, Math.min(359, t + 170)); B = A - t; }
    if (!(A > 0 && B > 0) || A === B) return this.general();
    const val = ertek(fn, t);
    const tex = fn === 'sin' ? T`\sin ${A}^{\circ}\cos ${B}^{\circ}${plus ? '+' : '-'}\cos ${A}^{\circ}\sin ${B}^{\circ}` : T`\cos ${A}^{\circ}\cos ${B}^{\circ}${plus ? '-' : '+'}\sin ${A}^{\circ}\sin ${B}^{\circ}`;
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${tex}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: fn === 'sin' ? T`\(\sin x\cos y\pm\cos x\sin y=\sin(x\pm y)\).` : T`\(\cos x\cos y\mp\sin x\sin y=\cos(x\pm y)\).`,
      megoldas: [T`\[${tex}=${FN[fn]}(${A}^{\circ}${plus ? '+' : '-'}${B}^{\circ})=${FN[fn]}\,${t}^{\circ}=${ft(val)}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig10',
    szint: 'emelt',
    cim: 'Összegzési tételek',
    rovid: 'Összegzési tételek',
    bevezeto: T`Két szög összegének és különbségének szögfüggvényei – a 15°, 75°, 105° pontos értékei és a kétszeres szögek képletei ebből jönnek. (Emelt szintű anyag.)`,
    elmelet: T`<div class="mathbox">\[\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta\]\[\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta\]\[\operatorname{tg}(\alpha\pm\beta)=\frac{\operatorname{tg}\alpha\pm\operatorname{tg}\beta}{1\mp\operatorname{tg}\alpha\operatorname{tg}\beta}\]</div>
<div class="prose"><p><b>Kétszeres szögek</b> (\(\beta=\alpha\)):</p></div>
<div class="mathbox">\[\sin2\alpha=2\sin\alpha\cos\alpha\qquad \cos2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha\]</div>
<div class="prose"><p>Például \(\sin75^{\circ}=\sin(45^{\circ}+30^{\circ})=\frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2}+\frac{\sqrt2}{2}\cdot\frac12=\frac{\sqrt6+\sqrt2}{4}\).</p></div>`,
    igazHamis: [
      { allitas: T`\(\sin(\alpha+\beta)=\sin\alpha+\sin\beta\)`, igaz: false, miert: T`Például \(\sin(30^{\circ}+60^{\circ})=1\), de \(\sin30^{\circ}+\sin60^{\circ}\approx1{,}37\).` },
      { allitas: T`\(\cos2\alpha=1-2\sin^2\alpha\)`, igaz: true, miert: T`\(\cos^2\alpha-\sin^2\alpha\), és \(\cos^2\alpha=1-\sin^2\alpha\).` },
      { allitas: T`\(\sin 15^{\circ}=\cos 75^{\circ}\)`, igaz: true, miert: T`Pótszögek.` },
      { allitas: T`\(\cos(\alpha-\beta)=\cos\alpha\cos\beta-\sin\alpha\sin\beta\)`, igaz: false, miert: T`Különbségnél \(+\) a jel: \(\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta\).` },
      { allitas: T`\(\sin2\alpha\le 2\sin\alpha\) minden hegyesszögre.`, igaz: true, miert: T`\(\sin2\alpha=2\sin\alpha\cos\alpha\), és \(0\lt\cos\alpha\le1\).` }
    ],
    mintapelda: {
      feladat: T`\(\sin\alpha=\frac35\), \(\alpha\) hegyesszög. Mennyi \(\sin2\alpha\) és \(\cos2\alpha\)?`,
      lepesek: [
        T`\(\cos\alpha=\sqrt{1-\frac{9}{25}}=\frac45\) (hegyesszög, tehát pozitív).`,
        T`\(\sin2\alpha=2\cdot\frac35\cdot\frac45=\frac{24}{25}\).`,
        T`\(\cos2\alpha=\frac{16}{25}-\frac{9}{25}=\frac{7}{25}\).`
      ]
    },
    feladatok
  });
})();
