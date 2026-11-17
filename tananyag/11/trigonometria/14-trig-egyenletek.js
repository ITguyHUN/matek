/*
 * 9. fejezet – Forgásszögek, ívmérték, trigonometrikus egyenletek (emelt szint)
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 * A 2024-től érvényes követelmények szerint a valós számokon értelmezett trigonometria és az ívmérték emelt szintű.
 */
(function () {
  const { sinD, cosD, tgD, asinD, acosD, atgD, kerek, fk, szog, FH, fnT, fnV } = M11;
  const feladatok = {};
  const S2 = T`\sqrt{2}`, S3 = T`\sqrt{3}`;
  const R0 = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
  const mod360 = x => ((x % 360) + 360) % 360;
  const egyedi = t => { const o = []; t.map(x => kerek(mod360(x), 6)).sort((a, b) => a - b).forEach(x => { if (!o.some(y => Math.abs(y - x) < 1e-6)) o.push(x); }); return o; };
  const lista = t => t.length ? t.map(x => `${nt(kerek(x, 2))}^\\circ`).join(T`;\ `) : T`\text{nincs}`;

  feladatok.ivmertek = { nev: 'Fok és ívmérték', general() {
    const eset = R(0, 2);
    if (eset === 0) { const d = P([2, 3, 4, 6, 12]), n = R0(-2 * d, 4 * d), f = F(n, d);
      return { kerdes: T`<p>Hány fokos az a szög, amelynek ívmértéke</p>\[${f.d === 1 ? (f.n === 1 ? '' : f.n === -1 ? '-' : f.n) : (f.n < 0 ? '-' : '') + T`\frac{${Math.abs(f.n) === 1 ? '' : Math.abs(f.n)}\pi}{${f.d}}`}${f.d === 1 ? T`\pi` : ''}\,?\]`,
        valasz: { ertekek: [180 * fv(f)] }, formatum: 'fokban, egész szám', tipp: T`\(\pi\ \text{radián}=180^\circ\), ezért \(\pi\) helyére \(180^\circ\)-ot írhatsz.`,
        megoldas: [T`\[${ft(f)}\cdot 180^\circ=${180 * fv(f)}^\circ\]`] }; }
    if (eset === 1) { const fok = P([15, 30, 36, 45, 60, 72, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330, 360, 400, 540, 720, -30, -45, -90, -120]), f = F(fok, 180);
      return { kerdes: T`<p>Írd fel a \(${fok}^\circ\)-os szöget ívmértékben! Hányszorosa ez \(\pi\)-nek?</p>`, valasz: { ertekek: [fv(f)] }, formatum: 'a π együtthatója (egész vagy tört, pl. 3/4)',
        tipp: T`\(1^\circ=\frac{\pi}{180}\) radián.`, megoldas: [T`\[${fok}^\circ=${fok}\cdot\frac{\pi}{180}=${ft(f)}\pi\]`] }; }
    const r = R(5, 60) / 10, fok = r * 180 / Math.PI;
    return { kerdes: T`<p>Hány fokos a \(${nt(r)}\) radiános szög?</p>`, valasz: szog(fok), formatum: FH.szog, tipp: T`\(1\ \text{rad}=\frac{180^\circ}{\pi}\approx 57{,}3^\circ\).`,
      megoldas: [T`\[${nt(r)}\cdot\frac{180^\circ}{\pi}\approx ${fk(fok)}\]`] };
  } };

  /* forgásszögek nevezetes értékei: racionális eredményűek */
  const FORG = [];
  [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 45, 135, 225, 315].forEach(x => {
    ['sin', 'cos', 'tg'].forEach(fn => { const v = fnV[fn](x); if (fn === 'tg' && Math.abs(cosD(x)) < 1e-9) return;
      const fr = [0, 1, -1, 0.5, -0.5].find(t => Math.abs(t - v) < 1e-9); if (fr === undefined) return; FORG.push({ fn, x, f: F(Math.round(fr * 2), 2) }); });
  });
  feladatok.forgasszog = { nev: 'Forgásszög szögfüggvénye', general() {
    const e = P(FORG), k = P([0, 0, 1, -1, 2]), szog0 = e.x + 360 * k;
    const red = mod360(szog0), neg = red > 180 ? (red > 270 ? 'IV.' : 'III.') : red > 90 ? 'II.' : 'I.';
    const ref = red <= 90 ? red : red <= 180 ? 180 - red : red <= 270 ? red - 180 : 360 - red;
    return { kerdes: T`<p>Számítsd ki pontosan!</p>\[${fnT[e.fn]}\left(${szog0}^\circ\right)\]`, valasz: { ertekek: [fv(e.f)] }, formatum: FMT.frac,
      tipp: T`A szinusz és a koszinusz periódusa \(360^\circ\), a tangensé \(180^\circ\). Vidd a szöget \(0^\circ\) és \(360^\circ\) közé, nézd meg, melyik síknegyedbe esik (előjel), és keresd meg a hozzá tartozó hegyesszöget.`,
      megoldas: [k ? T`\[${fnT[e.fn]}\left(${szog0}^\circ\right)=${fnT[e.fn]}\,${red}^\circ\]` : '', T`A \(${red}^\circ\) ${red % 90 === 0 ? 'tengelyen van' : `${neg === 'I.' ? 'az' : 'a'} ${neg} síknegyedben van, a hozzá tartozó hegyesszög \\(${ref}^\\circ\\)`}.`, T`\[${fnT[e.fn]}\,${red}^\circ=${ft(e.f)}\]`].filter(Boolean) };
  } };

  /* alapegyenletek: sin x = c, cos x = c, tg x = c a [0°; 360°) intervallumon */
  const PONT = { sin: [[F(1, 2), T`\frac12`], [F(-1, 2), T`-\frac12`], [null, T`\frac{${S2}}{2}`, Math.SQRT1_2], [null, T`-\frac{${S3}}{2}`, -Math.sqrt(3) / 2], [F(1), '1'], [F(-1), '-1'], [F(0), '0'], [F(3, 2), T`\frac32`]],
    cos: [[F(1, 2), T`\frac12`], [F(-1, 2), T`-\frac12`], [null, T`\frac{${S3}}{2}`, Math.sqrt(3) / 2], [null, T`-\frac{${S2}}{2}`, -Math.SQRT1_2], [F(1), '1'], [F(0), '0'], [F(-2), '-2']],
    tg: [[F(1), '1'], [F(-1), '-1'], [null, S3, Math.sqrt(3)], [null, T`-\frac{${S3}}{3}`, -Math.sqrt(3) / 3], [F(0), '0']] };
  function megold(fn, c) {
    if (fn === 'tg') { const a = atgD(c); return egyedi([a, a + 180]); }
    if (Math.abs(c) > 1 + 1e-12) return [];
    if (fn === 'sin') { const a = asinD(c); return egyedi([a, 180 - a]); }
    const a = acosD(c); return egyedi([a, -a]);
  }
  feladatok.alapegyenlet = { nev: 'sin x = c, cos x = c, tg x = c', general() {
    const fn = P(['sin', 'cos', 'tg']); let c, cT;
    if (R(0, 2) > 0) { const e = P(PONT[fn]); c = e[0] ? fv(e[0]) : e[2]; cT = e[1]; }
    else { do { c = R(-95, 95) / 100; } while (Math.abs(c) < 0.05 || [0.5, -0.5].includes(c)); if (fn === 'tg') c = R(-50, 50) / 10 || 2.5; cT = nt(c); }
    const m = megold(fn, c);
    const kerdes = T`<p>Oldd meg a \([0^\circ;\,360^\circ[\) intervallumon!</p>\[${fnT[fn]}\,x=${cT}\]<p>Add meg az összes megoldást fokban, pontosvesszővel elválasztva! Ha nincs megoldás, írd: nincs.</p>`;
    const tipp = fn === 'sin' ? T`Ha \(x_1\) megoldás, akkor \(180^\circ-x_1\) is. Negatív szöget \(360^\circ\) hozzáadásával vigyél az intervallumba.`
      : fn === 'cos' ? T`Ha \(x_1\) megoldás, akkor \(-x_1\), azaz \(360^\circ-x_1\) is.` : T`A tangens periódusa \(180^\circ\): ha \(x_1\) megoldás, \(x_1+180^\circ\) is.`;
    if (!m.length) return { kerdes, valasz: { nincs: true }, formatum: 'fokban, vagy: nincs', tipp, megoldas: [T`\(|${cT}|\gt 1\), a ${fn === 'sin' ? 'szinusz' : 'koszinusz'} értéke pedig \(-1\) és \(1\) közé esik: nincs megoldás.`] };
    const pontos = m.every(x => Math.abs(x - Math.round(x)) < 1e-6);
    return { kerdes, valasz: pontos ? { ertekek: m.map(Math.round) } : szog(...m), formatum: pontos ? 'fokban, egész számok' : FH.szogok, tipp,
      megoldas: [T`Az összes valós megoldás: ${fn === 'tg' ? T`\(x=${fk(m[0], 2)}+k\cdot 180^\circ\)` : m.length === 1 ? T`\(x=${fk(m[0], 2)}+k\cdot 360^\circ\)` : T`\(x_1=${fk(m[0], 2)}+k\cdot 360^\circ\), \(x_2=${fk(m[1], 2)}+k\cdot 360^\circ\)`} (\(k\in\mathbb Z\)).`,
        T`A \([0^\circ;\,360^\circ[\) intervallumba eső megoldások: \(${lista(m)}\).`] };
  } };

  /* másodfokúra visszavezethető: a·u² + b·u + c = 0, u = sin x vagy cos x */
  const GY = [F(1), F(-1), F(1, 2), F(-1, 2), F(0), F(2), F(-2), F(3, 2), F(-3, 2), F(3)];
  feladatok.masodfoku = { nev: 'Másodfokúra visszavezethető egyenlet', general() {
    const fn = P(['sin', 'cos']); let r1, r2; do { r1 = P(GY); r2 = P(GY); } while ((r1.n === r2.n && r1.d === r2.d) || (Math.abs(fv(r1)) > 1 && Math.abs(fv(r2)) > 1));
    /* (r1.d·u − r1.n)(r2.d·u − r2.n) */
    const A = r1.d * r2.d, B = -(r1.d * r2.n + r2.d * r1.n), C = r1.n * r2.n;
    const u = fn === 'sin' ? T`\sin x` : T`\cos x`;
    const tag = (k, s, elso) => k === 0 ? '' : (k < 0 ? '-' : elso ? '' : '+') + (Math.abs(k) === 1 && s ? '' : Math.abs(k)) + s;
    const egy = tag(A, T`${fn === 'sin' ? T`\sin^2 x` : T`\cos^2 x`}`, true) + tag(B, u, false) + tag(C, '', false);
    const mo = egyedi([...megold(fn, fv(r1)), ...megold(fn, fv(r2))]);
    const lep = [r1, r2].map(r => { const v = fv(r); return Math.abs(v) > 1 ? T`\(${u}=${ft(r)}\): nincs megoldás, mert \(|${ft(r)}|\gt 1\).` : T`\(${u}=${ft(r)}\): \(x\in\{${lista(megold(fn, v))}\}\).`; });
    return { kerdes: T`<p>Oldd meg a \([0^\circ;\,360^\circ[\) intervallumon!</p>\[${egy}=0\]<p>Add meg az összes megoldást fokban, pontosvesszővel elválasztva!</p>`,
      valasz: { ertekek: mo.map(Math.round) }, formatum: 'fokban, egész számok',
      tipp: T`Legyen \(y=${u}\). Oldd meg az \(y\)-ra kapott másodfokú egyenletet, és dobd el azt a gyököt, amely nem esik \(-1\) és \(1\) közé.`,
      megoldas: [T`\(y=${u}\) helyettesítéssel: \(${A === 1 ? '' : A}y^2${tag(B, 'y', false)}${tag(C, '', false)}=0\), gyökei \(y_1=${ft(r1)}\), \(y_2=${ft(r2)}\).`, ...lep, T`Összesen: \(${lista(mo)}\).`] };
  } };

  feladatok.osszetettArg = { nev: 'Összetett argumentum: sin 2x, cos(x − 30°)', general() {
    const fn = P(['sin', 'cos']), eset = R(0, 1);
    const ertek = P(fn === 'sin' ? [[0.5, T`\frac12`], [-0.5, T`-\frac12`], [1, '1'], [0, '0'], [Math.sqrt(3) / 2, T`\frac{${S3}}{2}`]] : [[0.5, T`\frac12`], [-0.5, T`-\frac12`], [0, '0'], [-1, '-1'], [Math.SQRT1_2, T`\frac{${S2}}{2}`]]);
    const alap = megold(fn, ertek[0]);   /* t ∈ [0; 360) */
    let x = [], arg, lep;
    if (eset === 0) { const k = P([2, 3]); arg = T`${k}x`;
      alap.forEach(t => { for (let j = 0; j < k; j++) x.push((t + 360 * j) / k); }); x = egyedi(x);
      lep = T`\(${k}x=t\) helyettesítéssel \(t\in\{${lista(alap)}\}+n\cdot 360^\circ\). Osztva \(${k}\)-${k === 2 ? 'vel' : 'mal'}: \(x=\frac{t}{${k}}+n\cdot ${360 / k}^\circ\).`; }
    else { const s = P([30, 45, 60, 90, -30, -60]); arg = s > 0 ? T`x-${s}^\circ` : T`x+${-s}^\circ`;
      x = egyedi(alap.map(t => t + s)); lep = T`\(${arg}=t\), ahol \(t\in\{${lista(alap)}\}+n\cdot 360^\circ\), így \(x=t${s > 0 ? '+' : '-'}${Math.abs(s)}^\circ\), majd a \([0^\circ;\,360^\circ[\) intervallumba visszük.`; }
    return { kerdes: T`<p>Oldd meg a \([0^\circ;\,360^\circ[\) intervallumon!</p>\[${fnT[fn]}\left(${arg}\right)=${ertek[1]}\]<p>Add meg az összes megoldást fokban, pontosvesszővel elválasztva!</p>`,
      valasz: { ertekek: x.map(v => kerek(v, 6)), tol: 0.01 }, formatum: 'fokban; több érték esetén pontosvesszővel elválasztva',
      tipp: 'Az argumentumot (a szögfüggvény mögötti kifejezést) nevezd el t-nek, oldd meg t-re az összes periódussal, és csak a végén térj vissza x-re. sin 2x esetén a [0°; 360°[ intervallumban kétszer annyi megoldás lehet!',
      megoldas: [lep, T`Megoldások: \(${lista(x)}\).`] };
  } };

  Tananyag.fejezet({
    id: 'trig09',
    cim: 'Forgásszögek, ívmérték, trigonometrikus egyenletek',
    rovid: 'Trig. egyenletek',
    szint: 'emelt',
    bevezeto: 'A szögfüggvények tetszőleges forgásszögre, és a trigonometrikus egyenletek megoldása. (A 2024-től érvényes követelmények szerint emelt szintű anyag.)',
    elmelet: T`<div class="prose"><p><b>Forgásszög.</b> Az egységkörön az \(\alpha\) szöggel elforgatott egységvektor végpontja \(P(\cos\alpha;\ \sin\alpha)\) – most már bármilyen \(\alpha\)-ra (negatívra és \(360^\circ\)-nál nagyobbra is). \(\operatorname{tg}\alpha=\frac{\sin\alpha}{\cos\alpha}\) (\(\alpha\ne 90^\circ+k\cdot 180^\circ\)).</p></div>
<div class="tbl"><table><tr><th>Síknegyed</th><th>I. (0°–90°)</th><th>II. (90°–180°)</th><th>III. (180°–270°)</th><th>IV. (270°–360°)</th></tr>
<tr><td>\(\sin\)</td><td>+</td><td>+</td><td>−</td><td>−</td></tr><tr><td>\(\cos\)</td><td>+</td><td>−</td><td>−</td><td>+</td></tr><tr><td>\(\operatorname{tg}\)</td><td>+</td><td>−</td><td>+</td><td>−</td></tr></table></div>
<div class="mathbox">\[\sin(\alpha+360^\circ)=\sin\alpha\quad\cos(\alpha+360^\circ)=\cos\alpha\quad\operatorname{tg}(\alpha+180^\circ)=\operatorname{tg}\alpha\quad\sin(-\alpha)=-\sin\alpha\quad\cos(-\alpha)=\cos\alpha\]</div>
<div class="prose"><p><b>Ívmérték:</b> \(180^\circ=\pi\) radián, \(1\ \text{rad}\approx 57{,}3^\circ\). A szög ívmértéke az egységkörből kivágott ív hossza.</p>
<p><b>Alapegyenletek</b> (\(k\in\mathbb Z\)):</p></div>
<div class="mathbox">\[\sin x=c\ (|c|\le 1):\ x_1=\sin^{-1}c+k\cdot 360^\circ,\quad x_2=180^\circ-\sin^{-1}c+k\cdot 360^\circ\]
\[\cos x=c\ (|c|\le 1):\ x=\pm\cos^{-1}c+k\cdot 360^\circ\qquad \operatorname{tg} x=c:\ x=\operatorname{tg}^{-1}c+k\cdot 180^\circ\]</div>
<div class="prose"><ul><li>\(|c|\gt 1\) esetén a szinusz- és koszinusz-egyenletnek nincs megoldása.</li>
<li><b>Másodfokúra visszavezethető</b> egyenlet: \(y=\sin x\) (vagy \(\cos x\)) helyettesítés, a gyököket \([-1;\,1]\)-re ellenőrizni. Ha \(\sin^2 x\) és \(\cos x\) is szerepel: \(\sin^2 x=1-\cos^2 x\).</li>
<li><b>Összetett argumentum</b> (\(\sin 2x\), \(\cos(x-30^\circ)\)): előbb az argumentumra oldjuk meg a periódussal együtt, csak utána osztunk/tolunk.</li>
<li>Ha az egyenletet egy intervallumon kell megoldani, a végén válogassuk ki az ide eső \(k\) értékeket.</li></ul></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`\(\sin 210^\circ=-\frac12\)`, igaz: true, miert: T`III. síknegyed, a hegyesszög \(30^\circ\), a szinusz negatív.` },
      { allitas: T`\(\cos 300^\circ=-\frac12\)`, igaz: false, miert: T`IV. síknegyedben a koszinusz pozitív: \(\cos 300^\circ=\frac12\).` },
      { allitas: T`\(\operatorname{tg} 225^\circ=1\)`, igaz: true, miert: T`A tangens periódusa \(180^\circ\): \(\operatorname{tg} 225^\circ=\operatorname{tg} 45^\circ=1\).` },
      { allitas: T`A \(\sin x=1{,}2\) egyenletnek nincs valós megoldása.`, igaz: true, miert: 'A szinusz értékkészlete [−1; 1].' },
      { allitas: T`A \(\cos x=\frac12\) egyenletnek a \([0^\circ;\,360^\circ[\) intervallumban egy megoldása van.`, igaz: false, miert: T`Kettő: \(60^\circ\) és \(300^\circ\).` },
      { allitas: T`\(\pi\) radián \(180^\circ\).`, igaz: true, miert: 'Az egységkör félkerülete π.' },
      { allitas: T`A \(\sin 2x=1\) egyenletnek a \([0^\circ;\,360^\circ[\) intervallumban két megoldása van.`, igaz: true, miert: T`\(2x=90^\circ+k\cdot 360^\circ\Rightarrow x=45^\circ+k\cdot 180^\circ\): \(45^\circ\) és \(225^\circ\).` },
      { allitas: T`\(\sin(-30^\circ)=\frac12\)`, igaz: false, miert: T`A szinusz páratlan: \(\sin(-30^\circ)=-\sin 30^\circ=-\frac12\).` },
      { allitas: T`\(\cos(-60^\circ)=\frac12\)`, igaz: true, miert: T`A koszinusz páros: \(\cos(-60^\circ)=\cos 60^\circ\).` }
    ],
    mintapelda: {
      feladat: T`Oldd meg a valós számok halmazán: \(2\cos^2 x+3\cos x-2=0\).`,
      lepesek: [
        T`Legyen \(y=\cos x\): \(2y^2+3y-2=0\), \(y_{1,2}=\frac{-3\pm\sqrt{9+16}}{4}=\frac{-3\pm 5}{4}\), azaz \(y_1=\frac12\), \(y_2=-2\).`,
        T`\(\cos x=-2\): nincs megoldás, mert \(|{-2}|\gt 1\).`,
        T`\(\cos x=\frac12\): \(x=\pm 60^\circ+k\cdot 360^\circ\) (\(k\in\mathbb Z\)), ívmértékben \(x=\pm\frac{\pi}{3}+2k\pi\).`
      ]
    },
    grafikon: M11.egysegkor({ max: 360 }),
    grafikonCim: 'Egységkör – forgásszögek',
    grafikonTag: 'teljes kör',
    feladatok
  });
})();
