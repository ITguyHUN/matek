/*
 * 3. fejezet – Törtkitevőjű hatvány
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.tortertek = { nev: 'Törtkitevős hatvány', general() {
    const n = P([2, 2, 3, 3, 4]); const c = n === 2 ? P([2, 3, 4, 5, 6, 7, 9, 10]) : n === 3 ? P([2, 3, 4, 5, 10]) : P([2, 3]);
    let m = P([1, 2, 3, -1, -2, -3]); if (c ** Math.abs(m) > 1000) m = Math.sign(m) * 2;
    const recip = R(0, 3) === 0; const base = c ** n;
    const baseTex = recip ? T`\left(\frac{1}{${base}}\right)` : String(base);
    const ef = F(m, n); let expTex = ft(ef); if ((ef.d === 2 || ef.d === 4) && R(0, 1)) expTex = nt(m / n);
    const val = recip ? fpow(F(1, c), m) : fpow(F(c), m);
    const rv = c ** (n / ef.d); const rvT = recip ? T`\frac{1}{${rv}}` : String(rv);
    const rootT = ef.d === 2 ? T`\sqrt{${recip ? T`\frac{1}{${base}}` : base}}` : T`\sqrt[${ef.d}]{${recip ? T`\frac{1}{${base}}` : base}}`;
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${baseTex}^{${expTex}}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: 'Tizedes kitevőt írd át törtre. A tört nevezője a gyökkitevő, a számlálója a hatványkitevő; negatív kitevő → reciprok.',
      megoldas: [T`\[${baseTex}^{${ft(ef)}}=\left(${rootT}\right)^{${ef.n}}=\left(${rvT}\right)^{${ef.n}}=${ft(val)}\]`] };
  } };

  feladatok.kettohatvany = { nev: 'Írd fel 2 hatványaként', general() {
    const p = R(0, 3), n = P([2, 3, 4]), q = R(1, n - 1), rec = R(0, 2) === 0;
    let e = F(p * n + q, n); if (rec) e = F(-e.n, e.d);
    const root = n === 2 ? T`\sqrt{${2 ** q}}` : T`\sqrt[${n}]{${2 ** q}}`;
    const core = (p > 0 ? String(2 ** p) : '') + root; const tex = rec ? T`\frac{1}{${core}}` : core;
    const parts = (p > 0 ? T`${2 ** p}=2^{${p}},\qquad ` : '') + T`${root}=2^{${ft(F(q, n))}}`;
    return { kerdes: T`<p>Írd fel 2 hatványaként! Melyik szám kerül a négyzet helyére?</p>\[${tex}=2^{\,\square}\]`, valasz: { ertekek: [fv(e)] }, formatum: FMT.frac,
      tipp: T`\(\sqrt{2^q}=2^{q/2}\), \(\sqrt[3]{2^q}=2^{q/3}\). Szorzásnál a kitevők összeadódnak, a reciprok kitevője az ellentett.`,
      megoldas: (p === 0 && !rec) ? [T`\[${parts}\]`] : [T`\[${parts}\]`, T`\[${tex}=${rec ? T`\frac{1}{2^{${ft(F(p * n + q, n))}}}=` : ''}2^{${ft(e)}}\]`] };
  } };

  feladatok.xhatvany = { nev: 'Egyetlen hatványként', general() {
    const a = P([2, 3, 4, 6]), c = P([2, 3, 4, 6]); const b = R(1, 5), d = R(1, 5); const mul = R(0, 1) === 1;
    const rt = (i, e) => { const inner = e === 1 ? 'x' : T`x^{${e}}`; return i === 2 ? T`\sqrt{${inner}}` : T`\sqrt[${i}]{${inner}}`; };
    const e = fadd(F(b, a), F(mul ? d : -d, c));
    const tex = mul ? T`${rt(a, b)}\cdot ${rt(c, d)}` : T`\frac{${rt(a, b)}}{${rt(c, d)}}`;
    return { kerdes: T`<p>Írd fel egyetlen hatványként! (\(x>0\)) Melyik szám kerül a négyzet helyére?</p>\[${tex}=x^{\,\square}\]`, valasz: { ertekek: [fv(e)] }, formatum: FMT.frac,
      tipp: T`Írd át a gyököket törtkitevőre: \(\sqrt[n]{x^m}=x^{m/n}\). Szorzásnál összeadod, osztásnál kivonod a kitevőket (közös nevezőre hozva).`,
      megoldas: [T`\[x^{${ft(F(b, a))}}${mul ? '\\cdot ' : ':'}x^{${ft(F(d, c))}}=x^{${ft(F(b, a))}${mul ? '+' : '-'}${ft(F(d, c))}}=x^{${ft(e)}}\]`] };
  } };

  Tananyag.fejezet({
    id: 'tort',
    cim: 'Törtkitevőjű hatvány',
    rovid: 'Törtkitevő',
    bevezeto: T`A törtkitevő a gyökvonás másik írásmódja: a nevező a gyökkitevő, a számláló a hatványkitevő.`,
    elmelet: T`<div class="mathbox">\[a^{\frac{m}{n}}=\sqrt[n]{a^{m}}=\left(\sqrt[n]{a}\right)^{m},\qquad a^{\frac{1}{n}}=\sqrt[n]{a},\qquad a^{-\frac{m}{n}}=\frac{1}{\sqrt[n]{a^m}}\qquad (a>0)\]</div>
<div class="prose"><ul>
<li>Az alap csak <b>pozitív</b> lehet: \((-8)^{1/3}\) nincs értelmezve (bár \(\sqrt[3]{-8}=-2\)).</li>
<li>Az 1. fejezet minden azonossága érvényes törtkitevőre is.</li>
<li>Tizedes kitevőt írj át törtre: \(0{,}5=\frac12\), \(0{,}75=\frac34\), \(1{,}5=\frac32\).</li>
<li>Irracionális kitevő (pl. \(2^{\sqrt2}\)) is értelmezett pozitív alapra, egyre pontosabb racionális közelítésekkel. Így lesz \(a^x\) minden valós \(x\)-re értelmezve.</li></ul></div>`,
    igazHamis: [
    { allitas: T`\(8^{\frac23}=4\)`, igaz: true, miert: T`\(\sqrt[3]{8}=2\), és \(2^2=4\).` },
    { allitas: T`\(16^{-\frac12}=-4\)`, igaz: false, miert: T`\(16^{-1/2}=\frac{1}{\sqrt{16}}=\frac14\). Negatív kitevőtől nem lesz negatív a szám.` },
    { allitas: T`\(8^{\frac23}=8\cdot\frac23\)`, igaz: false, miert: T`A kitevő nem szorzó! Először gyököt vonunk, azután hatványozunk.` },
    { allitas: T`\(x^{\frac12}\cdot x^{\frac13}=x^{\frac56}\)`, igaz: true, miert: T`A kitevők összeadódnak: \(\frac12+\frac13=\frac56\).` }
    ],
    mintapelda: {
      feladat: T`Számítsd ki: \(27^{-\frac23}\)`,
      lepesek: [
      T`Negatív kitevő → reciprok.`,
      T`\[27^{-\frac23}=\frac{1}{27^{\frac23}}\]`,
      T`A nevező (3) a gyökkitevő, a számláló (2) a hatványkitevő.`,
      T`\[=\frac{1}{\left(\sqrt[3]{27}\right)^{2}}=\frac{1}{3^{2}}=\frac{1}{9}\]`
      ]
    },
    feladatok
  });
})();
