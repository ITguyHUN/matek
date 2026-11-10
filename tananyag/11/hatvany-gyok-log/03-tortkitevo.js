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

  feladatok.kettohatvany = { nev: 'Írd fel 2 vagy 3 hatványaként', general() {
    const c = P([2, 2, 3]); const p = c === 2 ? R(0, 3) : R(0, 2), n = P([2, 3, 4]), q = R(1, n - 1), rec = R(0, 2) === 0;
    let e = F(p * n + q, n); if (rec) e = F(-e.n, e.d);
    const root = n === 2 ? T`\sqrt{${c ** q}}` : T`\sqrt[${n}]{${c ** q}}`;
    const core = (p > 0 ? String(c ** p) : '') + root; const tex = rec ? T`\frac{1}{${core}}` : core;
    const parts = (p > 0 ? T`${c ** p}=${c}^{${p}},\qquad ` : '') + T`${root}=${c}^{${ft(F(q, n))}}`;
    return { kerdes: T`<p>Írd fel ${c} hatványaként! Melyik szám kerül a négyzet helyére?</p>\[${tex}=${c}^{\,\square}\]`, valasz: { ertekek: [fv(e)] }, formatum: FMT.frac,
      tipp: T`\(\sqrt[n]{${c}^q}=${c}^{q/n}\). Szorzásnál a kitevők összeadódnak, a reciprok kitevője az ellentett.`,
      megoldas: (p === 0 && !rec) ? [T`\[${parts}\]`] : [T`\[${parts}\]`, T`\[${tex}=${rec ? T`\frac{1}{${c}^{${ft(F(p * n + q, n))}}}=` : ''}${c}^{${ft(e)}}\]`] };
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

  /* ---- Hányadik hatványa? (egymásba ágyazott gyökök) ---- */
  feladatok.hanyadik = { nev: 'Hányadik hatványa?', general() {
    const c = P([2, 3, 5, 7]); const cp = k => k === 1 ? String(c) : String(c ** k);
    const rt = (n, x) => n === 2 ? T`\sqrt{${x}}` : T`\sqrt[${n}]{${x}}`;
    const kind = R(0, 3); let tex, e, sol;
    if (kind === 0) { // ⁿ√(c^a · ᵐ√(c^b))
      const n = P([2, 3, 4]), m = P([2, 3]); const a = R(1, c === 2 ? 3 : 2), b = R(1, m - 1 + (c === 2 ? 1 : 0)); if (c ** b > 64 || b % m === 0) return this.general();
      tex = rt(n, cp(a) + rt(m, cp(b))); e = F(a * m + b, m * n);
      sol = [T`\[${rt(m, cp(b))}=${c}^{${ft(F(b, m))}},\qquad ${cp(a)}${rt(m, cp(b))}=${c}^{${a}+${ft(F(b, m))}}=${c}^{${ft(F(a * m + b, m))}}\]`, T`\[${tex}=\left(${c}^{${ft(F(a * m + b, m))}}\right)^{\frac{1}{${n}}}=${c}^{${ft(e)}}\]`]; }
    else if (kind === 1) { // c^a / ⁿ√(c^b)
      const n = P([2, 3, 4, 5]); const a = R(0, 2), b = R(1, n + 1); if (c ** b > 343 || (a === 0 && b % n === 0)) return this.general();
      tex = T`\frac{${a === 0 ? 1 : cp(a)}}{${rt(n, cp(b))}}`; e = F(a * n - b, n);
      sol = [T`\[${tex}=\frac{${c}^{${a}}}{${c}^{${ft(F(b, n))}}}=${c}^{${a}-${ft(F(b, n))}}=${c}^{${ft(e)}}\]`]; }
    else if (kind === 2) { // ⁿ√(c^a) · ᵐ√(c^b)
      const n = P([2, 3, 4]); let m = P([2, 3, 5]); if (m === n) m = n + 1; const a = R(1, 3), b = R(1, 2); if (c ** a > 343) return this.general();
      tex = T`${rt(n, cp(a))}\cdot ${rt(m, cp(b))}`; e = fadd(F(a, n), F(b, m));
      sol = [T`\[${tex}=${c}^{${ft(F(a, n))}}\cdot ${c}^{${ft(F(b, m))}}=${c}^{${ft(F(a, n))}+${ft(F(b, m))}}=${c}^{${ft(e)}}\]`]; }
    else { // ⁿ√(ᵐ√ (c^a))  vagy  1/(c·√c)
      if (R(0, 1)) { const n = P([2, 3]), m = P([2, 3, 4]); const a = R(1, 3); if (c ** a > 343) return this.general();
        tex = rt(n, rt(m, cp(a))); e = F(a, n * m); sol = [T`\[${tex}=${rt(n * m, cp(a))}=${c}^{${ft(e)}}\]`, 'Gyökből gyököt vonva a gyökkitevők összeszorzódnak.']; }
      else { const a = R(1, 2), n = P([2, 3]); tex = T`\frac{1}{${cp(a)}${rt(n, c)}}`; e = F(-(a * n + 1), n);
        sol = [T`\[${cp(a)}${rt(n, c)}=${c}^{${a}+${ft(F(1, n))}}=${c}^{${ft(F(a * n + 1, n))}}\quad\Rightarrow\quad ${tex}=${c}^{${ft(e)}}\]`]; }
    }
    return { kerdes: T`<p>${{ 2: 'A 2-nek', 3: 'A 3-nak', 5: 'Az 5-nek', 7: 'A 7-nek' }[c]} hányadik hatványa a következő szám? Melyik szám kerül a négyzet helyére?</p>\[${tex}=${c}^{\,\square}\]`, valasz: { ertekek: [fv(e)] }, formatum: FMT.frac,
      tipp: T`Írj át minden gyököt törtkitevős hatványra: \(\sqrt[n]{${c}^{k}}=${c}^{k/n}\). Utána használd a hatványazonosságokat.`, megoldas: sol };
  } };

  /* ---- Kifejezés értéke ---- */
  const TK = [[4, 1, 2, 2], [9, 1, 2, 3], [16, 1, 2, 4], [25, 1, 2, 5], [36, 1, 2, 6], [49, 1, 2, 7], [100, 1, 2, 10], [8, 1, 3, 2], [27, 1, 3, 3], [64, 1, 3, 4], [125, 1, 3, 5], [8, 2, 3, 4], [27, 2, 3, 9], [64, 2, 3, 16],
    [125, 2, 3, 25], [16, 3, 4, 8], [81, 3, 4, 27], [16, 1, 4, 2], [81, 1, 4, 3], [4, 3, 2, 8], [9, 3, 2, 27], [25, 3, 2, 125], [32, 2, 5, 4], [32, 3, 5, 8], [32, 1, 5, 2], [1000, 2, 3, 100], [64, 5, 6, 32]];
  function tkTag() { const [b, m, n, v] = P(TK); const neg = R(0, 2) === 0; const e = F(neg ? -m : m, n);
    const dec = (n === 2 || n === 4 || n === 5) && R(0, 3) === 0; const eT = dec ? nt(fv(e)) : ft(e);
    return { tex: T`${b}^{${eT}}`, val: neg ? F(1, v) : F(v), sol: neg ? T`\frac{1}{${v}}` : String(v) }; }
  const fmul = (a, b) => F(a.n * b.n, a.d * b.d), fdiv = (a, b) => F(a.n * b.d, a.d * b.n), fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  feladatok.tortossz = { nev: 'Kifejezés értéke', general() {
    const A = tkTag(), B = tkTag(); const op = P(['+', '-', '\\cdot ', ':']);
    const val = op === '+' ? fadd(A.val, B.val) : op === '-' ? fsub(A.val, B.val) : op === ':' ? fdiv(A.val, B.val) : fmul(A.val, B.val);
    const wrap = x => /^\\frac/.test(x) ? T`${x}` : x;
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${A.tex}${op}${B.tex}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: T`Mindkét hatványt külön számold ki: a kitevő nevezője a gyökkitevő, a számlálója a hatványkitevő; negatív kitevő → reciprok. Tizedes kitevőt írj át törtre.`,
      megoldas: [T`\[${A.tex}=${A.sol},\qquad ${B.tex}=${B.sol}\]`, T`\[${wrap(A.sol)}${op}${wrap(B.sol)}=${ft(val)}\]`] };
  } };

  /* ---- Egyenlet törtkitevővel ---- */
  feladatok.tortegy = { nev: 'Egyenlet törtkitevővel', general() {
    const c = P([2, 3, 4, 5, 6, 7, 8, 9, 10]); const n = P([2, 3, 4]); let m = P([1, 2, 3, 5, -1, -2, -3]); if (gcd(Math.abs(m), n) !== 1) return this.general();
    const x0 = c ** n; if (x0 > 1000 || c ** Math.abs(m) > 1000) return this.general();
    const v = fpow(F(c), m); const e = F(m, n);
    return { kerdes: T`<p>Oldd meg a pozitív valós számok halmazán!</p>\[x^{${ft(e)}}=${ft(v)}\]`, valasz: { ertekek: [x0] }, formatum: 'szám',
      tipp: T`Emeld mindkét oldalt a kitevő reciprokára mint kitevőre: \(\left(x^{${ft(e)}}\right)^{${ft(F(n, m))}}=x^{1}=x\).`,
      megoldas: [Math.abs(m) === 1 ? T`\[x=\left(${ft(v)}\right)^{${ft(F(n, m))}}=${c}^{${n}}=${x0}\]` : T`\[x=\left(${ft(v)}\right)^{${ft(F(n, m))}}=\left(${c}^{${m}}\right)^{${ft(F(n, m))}}=${c}^{${n}}=${x0}\]`] };
  } };

  /* ---- Különböző gyökök összehasonlítása ---- */
  feladatok.gyokrel = { nev: 'Melyik nagyobb?', general() {
    const a = P([2, 3, 4, 5, 6]); let b = P([2, 3, 4, 5, 6]); if (a === b) return this.general();
    const x = R(2, 12), y = R(2, 12); const L = a * b / gcd(a, b);
    const X = BigInt(x) ** BigInt(L / a), Y = BigInt(y) ** BigInt(L / b);
    const c = X < Y ? 0 : X === Y ? 1 : 2;
    if (c !== 1 && Math.abs(Math.log(x) / a - Math.log(y) / b) > 0.25) return this.general();  // ne legyen túl könnyű
    const rt = (n, v) => n === 2 ? T`\sqrt{${v}}` : T`\sqrt[${n}]{${v}}`;
    const pw = (v, k) => k === 1 ? String(v) : T`${v}^{${k}}`;
    const big = X.toString().length <= 7;
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére? (Számológép nélkül!)</p>\[${rt(a, x)}\;\square\;${rt(b, y)}\]`, valasz: { valasztas: ['<', '=', '>'], helyes: c },
      tipp: T`Írd fel mindkettőt törtkitevővel, és emeld mindkét (pozitív) számot a(z) ${L}. hatványra: így eltűnnek a gyökök.`,
      megoldas: [T`\[\left(${rt(a, x)}\right)^{${L}}=${x}^{${L / a}}${big ? '=' + X.toString() : ''},\qquad \left(${rt(b, y)}\right)^{${L}}=${y}^{${L / b}}${big && Y.toString().length <= 7 ? '=' + Y.toString() : ''}\]`,
        T`Pozitív számoknál a nagyobbik hatványa a nagyobb, ezért \(${rt(a, x)}${['<', '=', '>'][c]}${rt(b, y)}\).`] };
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
    { allitas: T`\(x^{\frac12}\cdot x^{\frac13}=x^{\frac56}\)`, igaz: true, miert: T`A kitevők összeadódnak: \(\frac12+\frac13=\frac56\).` },
    { allitas: T`\(27^{\frac13}=9\)`, igaz: false, miert: T`\(27^{1/3}=\sqrt[3]{27}=3\). A kitevő nem osztót jelent.` },
    { allitas: T`\(\sqrt[3]{x^{2}}=x^{\frac23}\) \((x>0)\)`, igaz: true, miert: T`A gyökkitevő kerül a nevezőbe, a hatványkitevő a számlálóba.` },
    { allitas: T`\(4^{0{,}5}=2\)`, igaz: true, miert: T`\(0{,}5=\frac12\), és \(4^{1/2}=\sqrt4=2\).` },
    { allitas: T`\(\sqrt{2}<\sqrt[3]{3}\)`, igaz: true, miert: T`Hatodik hatványra emelve: \(2^3=8<3^2=9\).` },
    { allitas: T`\((-27)^{\frac13}=-3\)`, igaz: false, miert: T`Törtkitevős hatványt csak pozitív alapra értelmezünk, így \((-27)^{1/3}\) nincs értelmezve (bár \(\sqrt[3]{-27}=-3\)).` }
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
