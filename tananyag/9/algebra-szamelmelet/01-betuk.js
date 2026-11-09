/*
 * II. Algebra és számelmélet / 1. Betűk használata a matematikában
 * (Sokszínű matematika 9., II/1. lecke; FGY 1101–1110; OH Matematika 9., 27. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, keverd, valaszt, toF, fsub, fmul, fdiv, fsum, sz, zj, zjn, tagT, tagokT, linT, pT, pEval, kulonbozo, vel, nak, az, FMT9 } = M9;
  const feladatok = {};

  /* ---------- helyettesítési érték ---------- */
  const SABLON = [
    { v: 'ab', e: '3a-2b', s: (A, B) => T`3\cdot ${A}-2\cdot ${B}`, f: (a, b) => fsub(fmul(3, a), fmul(2, b)) },
    { v: 'ab', e: 'a^2-b^2', s: (A, B) => T`${A}^2-${B}^2`, f: (a, b) => fsub(fmul(a, a), fmul(b, b)) },
    { v: 'ab', e: '(a-b)^2', s: (A, B) => T`\left(${A}-${B}\right)^2`, f: (a, b) => fmul(fsub(a, b), fsub(a, b)) },
    { v: 'ab', e: '2a^2b', s: (A, B) => T`2\cdot ${A}^2\cdot ${B}`, f: (a, b) => fmul(fmul(2, fmul(a, a)), b) },
    { v: 'ab', e: '-a^2+3b', s: (A, B) => T`-${A}^2+3\cdot ${B}`, f: (a, b) => fadd(fmul(-1, fmul(a, a)), fmul(3, b)) },
    { v: 'ab', e: T`\frac{a+b}{a-b}`, s: (A, B) => T`\frac{${A}+${B}}{${A}-${B}}`, f: (a, b) => fdiv(fadd(a, b), fsub(a, b)) },
    { v: 'abc', e: 'a-bc', s: (A, B, C) => T`${A}-${B}\cdot ${C}`, f: (a, b, c) => fsub(a, fmul(b, c)) },
    { v: 'abc', e: '-2abc', s: (A, B, C) => T`-2\cdot ${A}\cdot ${B}\cdot ${C}`, f: (a, b, c) => fmul(-2, fmul(a, fmul(b, c))) },
    { v: 'ac', e: '6c-2a', s: (A, B, C) => T`6\cdot ${C}-2\cdot ${A}`, f: (a, b, c) => fsub(fmul(6, c), fmul(2, a)) },
    { v: 'abc', e: 'a+6bc', s: (A, B, C) => T`${A}+6\cdot ${B}\cdot ${C}`, f: (a, b, c) => fadd(a, fmul(6, fmul(b, c))) },
    { v: 'ab', e: T`\frac{a}{b}+\frac{b}{a}`, s: (A, B) => T`\frac{${A}}{${B}}+\frac{${B}}{${A}}`, f: (a, b) => fadd(fdiv(a, b), fdiv(b, a)) },
    { v: 'abc', e: 'a^3-2bc', s: (A, B, C) => T`${A}^3-2\cdot ${B}\cdot ${C}`, f: (a, b, c) => fsub(fmul(a, fmul(a, a)), fmul(2, fmul(b, c))) },
    { v: 'abc', e: T`\frac{a+2c}{b-a}`, s: (A, B, C) => T`\frac{${A}+2\cdot ${C}}{${B}-${A}}`, f: (a, b, c) => fdiv(fadd(a, fmul(2, c)), fsub(b, a)) },
    { v: 'ab', e: '4a^2-5b', s: (A, B) => T`4\cdot ${A}^2-5\cdot ${B}`, f: (a, b) => fsub(fmul(4, fmul(a, a)), fmul(5, b)) },
    { v: 'ab', e: '(2a+b)(a-b)', s: (A, B) => T`\left(2\cdot ${A}+${B}\right)\cdot\left(${A}-${B}\right)`, f: (a, b) => fmul(fadd(fmul(2, a), b), fsub(a, b)) },
    { v: 'abc', e: T`\frac{-3abc}{2a+1}`, s: (A, B, C) => T`\frac{-3\cdot ${A}\cdot ${B}\cdot ${C}}{2\cdot ${A}+1}`, f: (a, b, c) => fdiv(fmul(-3, fmul(a, fmul(b, c))), fadd(fmul(2, a), 1)) }
  ];
  const TORTEK = [F(1, 2), F(-1, 2), F(1, 3), F(-1, 3), F(2, 3), F(3, 2), F(-3, 2), F(1, 4), F(-3, 4)];
  const ertekT = (nev, x) => T`${nev}=${sz(x)}`;

  feladatok.helyettesites = { nev: 'Helyettesítési érték', general() {
    for (let g = 0; g < 200; g++) {
      const s = P(SABLON);
      const tortes = R(0, 2) === 0;
      const a = toF(R0(-6, 6)), b = tortes && s.v === 'ab' ? P(TORTEK) : toF(R0(-6, 6)), c = s.v.includes('c') ? (tortes || R(0, 1) ? P(TORTEK) : toF(R0(-5, 5))) : null;
      let v; try { v = s.f(a, b, c); } catch (e) { continue; }
      if (!v || v.d === 0 || !isFinite(v.n) || Math.abs(v.n) > 400 || v.d > 36) continue;
      const nevek = s.v.split('').map(l => ertekT(l, { a, b, c }[l]));
      const tex = s.s(zj(a), zj(b), c && zj(c));
      return { kerdes: T`<p>Számítsd ki a kifejezés helyettesítési értékét, ha \(${nevek.join(T`,\ `)}\)!</p>\[${s.e}\]`,
        valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: 'Írd a betűk helyére a számokat zárójelben! Ügyelj a műveleti sorrendre: először hatványozás, majd szorzás, osztás, végül összeadás, kivonás.',
        megoldas: [T`\[${s.e}=${tex}=${ft(v)}\]`] };
    }
  } };

  /* ---------- értelmezési tartomány ---------- */
  feladatok.ertelmezes = { nev: 'Értelmezési tartomány', general() {
    const t = R(0, 7); let tex, rossz, lep;
    if (t === 0) { const r = R0(-5, 5), s = R(-9, 9), p = R0(-6, 6), q = R(-9, 9); const h = F(-s, r);
      tex = T`\frac{${linT(p, q)}}{${linT(r, s)}}`; rossz = [h]; lep = T`\(${linT(r, s)}=0\iff x=${ft(h)}\)`; }
    else if (t === 1) { const [p, q] = kulonbozo(2, -9, 9); const A = R(1, 9), B = R(1, 9); const op = P(['+', '-']);
      tex = T`\frac{${A}}{${linT(1, -p)}}${op}\frac{${B}}{${linT(1, q === 0 ? 0 : -q)}}`; rossz = [F(p), F(q)]; lep = T`\(${linT(1, -p)}=0\iff x=${p}\), illetve \(${linT(1, -q)}=0\iff x=${q}\)`; }
    else if (t === 2) { const k = R(1, 9), m = R(-6, 6);
      tex = T`\frac{${linT(1, m)}}{x^2-${k * k}}`; rossz = [F(k), F(-k)]; lep = T`\(x^2-${k * k}=0\iff x^2=${k * k}\iff x=${k}\) vagy \(x=-${k}\)`; }
    else if (t === 3) { const p = R0(-8, 8), A = R(1, 9), B = R(1, 9);
      tex = T`\frac{${A}}{x}-\frac{${B}}{${linT(1, -p)}}`; rossz = [F(0), F(p)]; lep = T`Az első nevező: \(x\neq0\); a második: \(${linT(1, -p)}\neq0\iff x\neq${p}\)`; }
    else if (t === 4) { const k = R(1, 9), m = R(1, 9);
      tex = R(0, 1) ? T`\frac{${linT(m, R(-5, 5))}}{x^2+${k}}` : T`\frac{x}{${k}}+\frac{${m}}{x^2+${k}}`; rossz = [];
      lep = T`\(x^2\ge0\), ezért \(x^2+${k}\ge${k}>0\): a nevező sohasem 0.`; }
    else if (t === 5) { let p, q; do { [p, q] = kulonbozo(2, -8, 8); } while (p === -q);
      tex = T`\frac{${linT(R0(-4, 4), R(-6, 6))}}{(${linT(1, -p)})(${linT(1, q)})}`; rossz = [F(p), F(-q)];
      lep = T`Egy szorzat akkor 0, ha valamelyik tényezője 0: \(x=${p}\) vagy \(x=${-q}\).`; }
    else if (t === 6) { const a = R(2, 6), b = R0(-9, 9);
      tex = T`\frac{${linT(1, R(1, 6))}}{x(${linT(a, b)})}`; rossz = [F(0), F(-b, a)];
      lep = T`\(x(${linT(a, b)})=0\iff x=0\) vagy \(${linT(a, b)}=0\), azaz \(x=${ft(F(-b, a))}\).`; }
    else { const a = R(2, 9), b = R0(-9, 9);
      tex = T`\frac{${linT(R0(-5, 5), b)}}{${a}}`; rossz = [];
      lep = T`A nevezőben nincs változó (értéke \(${a}\)), így sohasem 0; a számlálóban bármilyen szám állhat.`; }
    return { kerdes: T`<p>Mely valós számokra <b>nem</b> értelmezhető a kifejezés? Add meg mindet! (Ha minden valós számra értelmezhető, írd: nincs.)</p>\[${tex}\]`,
      valasz: rossz.length ? { ertekek: rossz.map(fv) } : { nincs: true }, formatum: FMT9.halmaz,
      tipp: 'Egy törtkifejezés ott nem értelmezhető, ahol a nevezője 0. Keresd meg, mely x-re lesz valamelyik nevező 0!',
      megoldas: [lep, rossz.length ? T`A kifejezés nem értelmezhető: \(x=${rossz.map(ft).join(T`;\ `)}\). Az értelmezési tartomány: \(\mathbb{R}\setminus\{${rossz.map(ft).join(';')}\}\).` : T`A kifejezés minden valós számra értelmezhető: \(\mathrm{ÉT}=\mathbb{R}\).`] };
  } };

  /* ---------- együttható, fokszám ---------- */
  function egytag(betuk) { const vars = {}; betuk.forEach(b => { if (R(0, 2)) vars[b] = R(1, 3); }); if (!Object.keys(vars).length) vars[P(betuk)] = R(1, 3); return vars; }
  feladatok.egyutthato = { nev: 'Együttható, fokszám', general() {
    const betuk = P([['x', 'y', 'z'], ['a', 'b', 'c'], ['x', 'y'], ['a', 'b']]);
    const kerdesTipus = P(['e', 'f']);
    if (R(0, 2) === 0) {   // egyetlen egytagú kifejezés
      const v = egytag(betuk); const c = R(0, 3) === 0 ? P([-1, 1]) : R0(-9, 9) * P([1, 1, 1, 0.1]);
      const tex = tagT(+c.toFixed(1), v); const fok = Object.values(v).reduce((s, e) => s + e, 0);
      return { kerdes: T`<p>Mennyi az egytagú kifejezés ${kerdesTipus === 'e' ? '<b>együtthatója</b>' : '<b>fokszáma</b>'}?</p>\[${tex}\]`,
        valasz: { ertekek: [kerdesTipus === 'e' ? +c.toFixed(1) : fok] }, formatum: kerdesTipus === 'e' ? FMT9.szam : FMT9.egesz,
        tipp: kerdesTipus === 'e' ? 'Az együttható a változók előtt álló számszorzó (előjellel együtt). Ha nincs kiírva, akkor 1 vagy −1.' : 'Az egytagú kifejezés fokszáma a benne szereplő változók kitevőinek összege.',
        megoldas: [kerdesTipus === 'e' ? T`Az együttható: \(${nt(+c.toFixed(1))}\).` : (Object.keys(v).length > 1 ? T`A kitevők összege: \(${Object.values(v).join('+')}=${fok}\).` : T`A fokszám: \(${fok}\).`)] };
    }
    const v1 = egytag(betuk), v2 = egytag(betuk);
    const c1 = R0(-9, 9) * P([1, 1, 0.1]), c2 = R0(-9, 9) * P([1, 0.1, 0.5]);
    const C1 = +c1.toFixed(1), C2 = +c2.toFixed(1); const C = +(C1 * C2).toFixed(4);
    const v = {}; betuk.forEach(b => { const e = (v1[b] || 0) + (v2[b] || 0); if (e) v[b] = e; });
    const fok = Object.values(v).reduce((s, e) => s + e, 0);
    const t2 = tagT(C2, v2);
    const tex = T`${tagT(C1, v1)}\cdot ${C2 < 0 ? T`\left(${t2}\right)` : t2}`;
    return { kerdes: T`<p>Végezd el a szorzást! Mennyi a kapott egytagú kifejezés ${kerdesTipus === 'e' ? '<b>együtthatója</b>' : '<b>fokszáma</b>'}?</p>\[${tex}\]`,
      valasz: { ertekek: [kerdesTipus === 'e' ? C : fok] }, formatum: kerdesTipus === 'e' ? FMT9.szam : FMT9.egesz,
      tipp: 'Az együtthatókat összeszorozzuk, az azonos alapú hatványok kitevőit összeadjuk.',
      megoldas: [T`\[${tex}=${tagT(C, v)}\]`, kerdesTipus === 'e' ? T`Az együttható: \(${nt(C)}\).` : (Object.keys(v).length > 1 ? T`A fokszám a kitevők összege: \(${Object.values(v).join('+')}=${fok}\).` : T`A fokszám: \(${fok}\).`)] };
  } };

  /* ---------- egynemű tagok összevonása ---------- */
  feladatok.osszevonas = { nev: 'Egynemű tagok összevonása', general() {
    if (R(0, 2) === 0) {   // kétváltozós: cd² és d²c egyneműek
      const [u, w] = P([['c', 'd'], ['x', 'y'], ['a', 'b']]);
      const fajtak = [{ k: 'A', t: [`${u}${w}^{2}`, `${w}^{2}${u}`] }, { k: 'B', t: [`${u}^{2}`] }, { k: 'C', t: [`${w}`] }, { k: 'D', t: [`${u}^{2}${w}`, `${w}${u}^{2}`] }, { k: 'E', t: [''] }];
      const tagok = []; const n = R(7, 9);
      for (let i = 0; i < n; i++) { const f = i < 3 ? fajtak[i % 2 === 0 ? 0 : 3] : P(fajtak); tagok.push({ k: f.k, c: R0(-6, 6), t: P(f.t) }); }
      const kerdezett = P(['A', 'D']);
      const ossz = tagok.filter(x => x.k === kerdezett).reduce((s, x) => s + x.c, 0);
      const tagTex = x => x.t === '' ? String(x.c) : (Math.abs(x.c) === 1 ? (x.c < 0 ? '-' : '') : x.c) + x.t;
      const kif = tagokT(keverd(tagok).map(tagTex));
      const nev = kerdezett === 'A' ? `${u}${w}^{2}` : `${u}^{2}${w}`;
      const resz = tagok.filter(x => x.k === kerdezett);
      return { kerdes: T`<p>Vond össze az egynemű tagokat! Mennyi lesz az összevonás után ennek a tagnak az együtthatója: \(${nev}\)?</p>\[${kif}\]`,
        valasz: { ertekek: [ossz] }, formatum: FMT9.egesz,
        tipp: T`Egyneműek azok a tagok, amelyekben ugyanazok a változók ugyanazon a kitevőn szerepelnek – a sorrend nem számít, pl. \(${u}${w}^2=${w}^2${u}\).`,
        megoldas: [T`Ezzel egynemű tagok: \(${tagokT(resz.map(tagTex))}\).`, resz.length > 1 ? T`Az együtthatók összege: \(${resz.map(x => x.c).join('+').replace(/\+-/g, '-')}=${ossz}\).` : T`Egyetlen ilyen tag van, az együtthatója \(${ossz}\).`] };
    }
    const v = P(['a', 'b', 'x']); const maxFok = R(2, 3); const n = R(7, 10);
    const tagok = []; for (let i = 0; i < n; i++) tagok.push({ e: i <= maxFok ? i : R(0, maxFok), c: R0(-6, 6) });
    const p = Array(maxFok + 1).fill(0); tagok.forEach(x => { p[x.e] += x.c; });
    const kif = tagokT(keverd(tagok).map(x => [x.c, x.e ? { [v]: x.e } : {}]));
    const mit = R(0, 3);
    if (mit === 0) { const k = R0(-3, 3); const ert = pEval(p, k);
      return { kerdes: T`<p>Vond össze az egynemű tagokat, majd számítsd ki a kifejezés értékét, ha \(${v}=${k}\)!</p>\[${kif}\]`,
        valasz: { ertekek: [ert] }, formatum: FMT9.egesz, tipp: 'Előbb vond össze az egynemű tagokat, így kevesebbet kell számolni.',
        megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`\(${v}=${k}\) esetén az érték: \(${ert}\).`] }; }
    const e = R(0, maxFok); const nev = e === 0 ? 'a konstans tag (a változót nem tartalmazó tag)' : T`ennek a tagnak az együtthatója: \(${tagT(1, { [v]: e })}\)`;
    return { kerdes: T`<p>Vond össze az egynemű tagokat! Mennyi lesz az összevonás után ${nev}?</p>\[${kif}\]`,
      valasz: { ertekek: [p[e]] }, formatum: FMT9.egesz, tipp: 'Csak az azonos változórészű (egynemű) tagokat lehet összevonni: ilyenkor az együtthatóikat adjuk össze.',
      megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`A kérdezett együttható: \(${p[e]}\).`] };
  } };

  /* ---------- számok algebrai alakja, maradék ---------- */
  feladatok.maradek = { nev: 'Számok algebrai alakja', general() {
    const t = R(0, 2);
    if (t === 0) { const a = R(3, 12); let b; do { b = R(-a - 5, 3 * a); } while (b % a === 0); const m = ((b % a) + a) % a;
      return { kerdes: T`<p>Az \(n\) tetszőleges egész szám. Mennyi maradékot adnak ${vel(a)} osztva a következő alakú számok?</p>\[${linT(a, b, 'n')}\]`,
        valasz: { ertekek: [m] }, formatum: FMT9.nemneg,
        tipp: T`Írd át a számot \(${a}k+r\) alakba, ahol \(0\le r<${a}\)!`,
        megoldas: [b < 0 ? T`\[${linT(a, b, 'n')}=${a}n-${a * Math.ceil(-b / a)}+${m}=${a}(${linT(1, -Math.ceil(-b / a), 'n')})+${m}\]` : T`\[${linT(a, b, 'n')}=${a}n+${b - m}+${m}=${a}(${linT(1, (b - m) / a, 'n')})+${m}\]`, T`A maradék: \(${m}\).`] }; }
    if (t === 1) { const c = R(2, 6), k = R(2, 4), a = c * k; let b; do { b = R(1, 3 * a); } while (b % c === 0); const m = b % c;
      return { kerdes: T`<p>Az \(n\) tetszőleges egész szám. Mennyi maradékot adnak ${vel(c)} osztva a következő alakú számok?</p>\[${linT(a, b, 'n')}\]`,
        valasz: { ertekek: [m] }, formatum: FMT9.nemneg, tipp: T`A \(${a}n\) osztható ${vel(c)}, ezért csak a \(${b}\) maradéka számít.`,
        megoldas: [T`\[${linT(a, b, 'n')}=${c}\cdot ${k}n+${b}\]`, T`A \(${b}\) ${vel(c)} osztva \(${m}\) maradékot ad, ezért a maradék \(${m}\).`] }; }
    const a = R(3, 13), r = R(1, a - 1); const also = P([100, 100, 1000]);
    const n = Math.ceil((also - r) / a); const x = a * n + r;
    return { kerdes: T`<p>Melyik a legkisebb ${also === 100 ? 'háromjegyű' : 'négyjegyű'} szám a következő alakú számok között? (\(n\) egész szám)</p>\[${linT(a, r, 'n')}\]`,
      valasz: { ertekek: [x] }, formatum: FMT9.egesz, tipp: T`Ezek a számok ${vel(a)} osztva ${r} maradékot adnak. Keresd meg ${az(also)} ${also}-hoz legközelebbi, legalább ekkora ilyen számot!`,
      megoldas: [T`\(${linT(a, r, 'n')}\ge ${also}\iff n\ge ${ft(F(also - r, a))}\), a legkisebb ilyen egész: \(n=${n}\).`, T`\(${a}\cdot ${n}+${r}=${x}\)`] };
  } };

  /* ---------- szövegből kifejezés (feleletválasztós) ---------- */
  const SZOVEG = [
    ['két szám, \\(a\\) és \\(b\\) négyzetének összege', 'a² + b²', ['(a + b)²', 'a + b²', '2a + 2b']],
    ['két szám, \\(a\\) és \\(b\\) összegének négyzete', '(a + b)²', ['a² + b²', 'a + b²', '2(a + b)']],
    ['két szám, \\(a\\) és \\(b\\) különbségének a fele', '(a − b)/2', ['a − b/2', '(a + b)/2', '2(a − b)']],
    ['egy szám (\\(x\\)) kétszeresénél 3-mal kisebb szám', '2x − 3', ['3 − 2x', '2(x − 3)', 'x/2 − 3']],
    ['egy szám (\\(x\\)) reciprokánál 2-vel nagyobb szám', '1/x + 2', ['1/(x + 2)', '2/x', 'x + 2']],
    ['két egymást követő egész szám szorzata (\\(n\\) a kisebbik)', 'n(n + 1)', ['n · n + 1', '2n + 1', 'n² − 1']],
    ['egy tetszőleges páratlan szám (\\(n\\) egész)', '2n + 1', ['2n', 'n + 1', '3n']],
    ['egy tetszőleges, 3-mal osztható szám (\\(n\\) egész)', '3n', ['n + 3', 'n/3', '3n + 1']],
    ['a kétjegyű szám, amelynek tízesjegye \\(a\\), egyesjegye \\(b\\)', '10a + b', ['ab', 'a + b', '10b + a']],
    ['három egymást követő egész szám összege (\\(n\\) a középső)', '3n', ['3n + 3', 'n + 3', '3n + 1']],
    ['egy szám (\\(x\\)) harmadának és 5-nek a különbsége', 'x/3 − 5', ['(x − 5)/3', '3x − 5', '5 − x/3']],
    ['egy szám (\\(x\\)) négyzeténél 4-gyel nagyobb szám kétszerese', '2(x² + 4)', ['2x² + 4', '(2x)² + 4', '2(x + 4)²']],
    ['az \\(a\\) és \\(b\\) oldalú téglalap kerülete', '2(a + b)', ['a · b', '2a + b', 'a + b']],
    ['egy szám (\\(x\\)) 20%-kal megnövelt értéke', '1,2x', ['x + 20', '0,2x', '1,02x']],
    ['két szám, \\(a\\) és \\(b\\) számtani közepe', '(a + b)/2', ['a + b/2', '2(a + b)', '(a · b)/2']],
    ['egy 4-gyel osztva 3 maradékot adó szám (\\(n\\) egész)', '4n + 3', ['3n + 4', '4n − 3', '4 + 3n']]
  ];
  /* számokkal paraméterezett sablonok – így sokféle kérdés jön ki */
  const SZOVEG_P = [
    () => { const k = R(2, 9), m = R(2, 9); return [`egy szám (\\(x\\)) ${k}-szeresénél ${m}-${M9.vel(m).split('-')[1]} kisebb szám`, `${k}x − ${m}`, [`${m} − ${k}x`, `${k}(x − ${m})`, `x/${k} − ${m}`]]; },
    () => { const k = R(2, 9); return [`egy szám (\\(x\\)) és ${k} összegének a négyzete`, `(x + ${k})²`, [`x² + ${k}²`, `x + ${k}²`, `${k}(x + ${k})`]]; },
    () => { const k = R(3, 12), r = R(1, k - 1); return [`egy ${M9.vel(k)} osztva ${r} maradékot adó szám (\\(n\\) egész)`, `${k}n + ${r}`, [`${r}n + ${k}`, `${k}n − ${r}`, `${k}(n + ${r})`]]; },
    () => { const k = R(2, 9); return [`egy szám (\\(x\\)) ${k}-${M9.vel(k).split('-')[1]} nagyobb számnak a reciproka`, `1/(x + ${k})`, [`1/x + ${k}`, `${k}/x`, `x + 1/${k}`]]; },
    () => { const p = P([10, 20, 25, 30, 40]); return [`egy szám (\\(x\\)) ${p}%-kal csökkentett értéke`, `${String(1 - p / 100).replace('.', ',')}x`, [`x − ${p}`, `${String(p / 100).replace('.', ',')}x`, `${String(1 + p / 100).replace('.', ',')}x`]]; },
    () => { const k = P([2, 4, 5, 6]); return [`${k} egymást követő egész szám összege, ha a legkisebb \\(n\\)`, `${k}n + ${k * (k - 1) / 2}`, [`${k}n`, `${k}n + ${k}`, `n + ${k * (k - 1) / 2}`]]; }
  ];
  feladatok.kifejezes = { nev: 'Szövegből kifejezés', general() {
    const [szoveg, jo, rossz] = R(0, 1) ? P(SZOVEG) : P(SZOVEG_P)(); const v = valaszt(jo, rossz);
    return { kerdes: `<p>Melyik kifejezés jelenti a következőt?</p><p><i>${szoveg}</i></p>`, valasz: v,
      tipp: 'Olvasd el lassan, és figyeld, melyik műveletet kell utoljára elvégezni! „Összegének négyzete”: előbb összeadunk, aztán négyzetre emelünk.',
      megoldas: [`A helyes kifejezés: ${jo}`] };
  } };

  /* ---------- szöveges feladatok ---------- */
  feladatok.szoveges = { nev: 'Szöveges feladatok kifejezésekkel', general() {
    const t = R(0, 5);
    if (t === 0) { const x = R(3, 15); const k = 6 * x;
      return { kerdes: T`<p>Egy háromszög oldalainak hossza (cm-ben) egymást követő páros számok. A legrövidebb oldal \(2x-2\). Mekkora a háromszög kerülete, ha \(x=${x}\)?</p>`,
        valasz: { ertekek: [k] }, formatum: 'egész szám (cm)', tipp: T`A három oldal: \(2x-2\), \(2x\), \(2x+2\).`,
        megoldas: [T`\[K=(2x-2)+2x+(2x+2)=6x\]`, T`\(x=${x}\) esetén \(K=6\cdot ${x}=${k}\) cm.`] }; }
    if (t === 1) { const d = R(1, 8);
      return { kerdes: T`<p>Egy kétjegyű szám tízesjegye \(a\), egyesjegye \(b\), és \(a-b=${d}\). Mennyivel nagyobb ez a szám annál a kétjegyű számnál, amelyet a jegyei felcserélésével kapunk?</p>`,
        valasz: { ertekek: [9 * d] }, formatum: FMT9.egesz, tipp: T`A szám \(10a+b\), a felcserélt \(10b+a\).`,
        megoldas: [T`\[(10a+b)-(10b+a)=9a-9b=9(a-b)\]`, T`\(9\cdot ${d}=${9 * d}\)`] }; }
    if (t === 2) { const s = R(5, 17);
      return { kerdes: T`<p>Egy kétjegyű szám jegyeinek összege ${s}. Mennyi a szám és a jegyei felcserélésével kapott szám összege?</p>`,
        valasz: { ertekek: [11 * s] }, formatum: FMT9.egesz, tipp: T`A szám \(10a+b\), a felcserélt \(10b+a\), és \(a+b=${s}\).`,
        megoldas: [T`\[(10a+b)+(10b+a)=11a+11b=11(a+b)\]`, T`\(11\cdot ${s}=${11 * s}\)`] }; }
    if (t === 3) { const n = R(-20, 60); const S = 3 * n + 3; const lg = n + 2;
      return { kerdes: T`<p>Három egymást követő egész szám összege \(${S}\). Melyik a legnagyobb közülük?</p>`,
        valasz: { ertekek: [lg] }, formatum: FMT9.egesz, tipp: T`Ha a legkisebb \(n\), akkor a számok \(n\), \(n+1\), \(n+2\), összegük \(3n+3\).`,
        megoldas: [T`\[3n+3=${S}\implies n=${n}\]`, T`A számok: \(${n};\ ${n + 1};\ ${n + 2}\); a legnagyobb \(${lg}\).`] }; }
    if (t === 4) { const m = R(3, 9); const r = R(1, m - 1); const e = R(2, 3); const mar = r ** e % m;
      return { kerdes: T`<p>Egy egész szám ${vel(m)} osztva ${r} maradékot ad. Mennyi maradékot ad ${vel(m)} osztva a szám ${e === 2 ? 'négyzete' : 'köbe'}?</p>`,
        valasz: { ertekek: [mar] }, formatum: FMT9.nemneg, tipp: T`Írd fel a számot \(${m}n+${r}\) alakban, és emeld ${e === 2 ? 'négyzetre' : 'köbre'}! A ${m}n-et tartalmazó tagok oszthatók ${vel(m)}.`,
        megoldas: [T`\((${m}n+${r})^{${e}}\) kifejtésében a \(${r}^{${e}}=${r ** e}\) kivételével minden tag osztható ${vel(m)}.`, T`\(${r ** e}\) ${vel(m)} osztva \(${mar}\) maradékot ad.`] }; }
    const a = R(3, 12), k = R(2, 9), x = R(2, 15);
    return { kerdes: T`<p>Egy téglalap egyik oldala \(a\) cm, a másik oldala ${k} cm-rel hosszabb. Írd fel a kerületét \(a\) segítségével, és számítsd ki, ha \(a=${x}\)!</p>`,
      valasz: { ertekek: [4 * x + 2 * k] }, formatum: 'egész szám (cm)', tipp: T`\(K=2\bigl(a+(a+${k})\bigr)\)`,
      megoldas: [T`\[K=2\bigl(a+(a+${k})\bigr)=4a+${2 * k}\]`, T`\(a=${x}\): \(K=4\cdot ${x}+${2 * k}=${4 * x + 2 * k}\) cm.`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg1',
    cim: 'Betűk használata a matematikában',
    rovid: 'Betűk, kifejezések',
    bevezeto: 'Algebrai kifejezések: helyettesítési érték, értelmezési tartomány, együttható, fokszám, egynemű tagok, és hogyan írunk le számokat betűkkel.',
    elmelet: T`<div class="prose"><p>Az <b>algebrai kifejezésben</b> számok és betűk (változók) szerepelnek, műveleti jelekkel összekapcsolva. Ha a betűk helyére számokat írunk, és elvégezzük a műveleteket, a kifejezés <b>helyettesítési értékét</b> kapjuk.</p>
<ul><li>Negatív számot és törtet <b>zárójelben</b> helyettesítünk be: \(a=-3\) esetén \(a^2=(-3)^2=9\), de \(-a^2=-(-3)^2=-9\).</li>
<li><b>Értelmezési tartomány:</b> azok a számok, amelyekre a kifejezés kiszámítható. Törtkifejezésnél a nevező nem lehet 0: \(\frac{x+1}{x-4}\) esetén \(x\neq4\).</li>
<li><b>Egytagú kifejezés</b>: számok és változók szorzata, pl. \(-3a^2b\). Az <b>együtthatója</b> \(-3\), a <b>fokszáma</b> a kitevők összege: \(2+1=3\).</li>
<li><b>Egynemű</b> tagok: a változórészük megegyezik (\(5xy^2\) és \(-2y^2x\)). Csak ezeket lehet összevonni: \(5xy^2-2y^2x=3xy^2\).</li></ul></div>
<div class="tbl"><table><tr><th>Szám</th><th>Algebrai alak (\(n\) egész)</th></tr>
<tr><td>páros / páratlan szám</td><td>\(2n\) / \(2n+1\)</td></tr>
<tr><td>5-tel osztva 3 maradékot ad</td><td>\(5n+3\)</td></tr>
<tr><td>egymást követő egészek</td><td>\(n,\ n+1,\ n+2\)</td></tr>
<tr><td>kétjegyű szám (jegyei \(a\), \(b\))</td><td>\(10a+b\)</td></tr></table></div>`,
    igazHamis: [
      { allitas: T`\(-3^2=9\)`, igaz: false, miert: T`A hatványozás erősebb a negatív előjelnél: \(-3^2=-9\). Viszont \((-3)^2=9\).` },
      { allitas: T`Ha \(a=-3\), akkor \(a^2=9\).`, igaz: true, miert: T`\((-3)^2=9\).` },
      { allitas: T`Az \(\frac{x+2}{x-5}\) kifejezés az \(x=5\) helyen nem értelmezhető.`, igaz: true, miert: 'Ott a nevező 0.' },
      { allitas: T`Az \(\frac{x+2}{x-5}\) kifejezés az \(x=-2\) helyen nem értelmezhető.`, igaz: false, miert: T`\(x=-2\)-nél a számláló 0, a tört értéke 0 – ez megengedett.` },
      { allitas: T`A \(3a^2b\) és a \(-5ba^2\) egynemű kifejezések.`, igaz: true, miert: 'A változórészük ugyanaz, csak a sorrend más.' },
      { allitas: T`A \(3x\) és a \(3x^2\) egynemű kifejezések.`, igaz: false, miert: 'Az x kitevője különböző.' },
      { allitas: T`A \(2x^3y\) egytagú kifejezés fokszáma 3.`, igaz: false, miert: T`A fokszám a kitevők összege: \(3+1=4\).` },
      { allitas: T`A \(-x^2y\) együtthatója \(-1\).`, igaz: true, miert: T`\(-x^2y=(-1)\cdot x^2y\).` },
      { allitas: T`Ha \(n\) egész szám, akkor \(2n+1\) mindig páratlan.`, igaz: true, miert: 'Páros számnál 1-gyel nagyobb.' },
      { allitas: T`Ha \(n\) egész szám, akkor \(n^2+1\) mindig páratlan.`, igaz: false, miert: T`\(n=1\) esetén \(1^2+1=2\) páros.` },
      { allitas: T`\(a^2+b^2=(a+b)^2\) minden valós \(a\), \(b\) esetén.`, igaz: false, miert: T`Pl. \(a=b=1\): \(2\neq4\).` },
      { allitas: T`Az \(\frac{1}{x^2+1}\) kifejezés minden valós számra értelmezhető.`, igaz: true, miert: T`\(x^2+1\ge1\), a nevező sohasem 0.` },
      { allitas: T`Az \(5n-2\) alakú számok (\(n\) egész) 5-tel osztva 2 maradékot adnak.`, igaz: false, miert: T`\(5n-2=5(n-1)+3\), a maradék 3.` },
      { allitas: T`\(x+x+x=x^3\)`, igaz: false, miert: T`\(x+x+x=3x\); \(x\cdot x\cdot x=x^3\).` },
      { general() { const k = R0(-5, 5), u = R0(-3, 3); const jo = k * k - u * k; const mut = R(0, 1) ? jo : jo + P([-2, 2, 2 * k * k]);
        return { allitas: T`Ha \(x=${k}\), akkor \(x^2${u > 0 ? '-' : '+'}${Math.abs(u)}x=${mut}\).`, igaz: mut === jo, miert: T`\(${zjn(k)}^2${u > 0 ? '-' : '+'}${Math.abs(u)}\cdot ${zjn(k)}=${k * k}${u * k > 0 ? '-' : '+'}${Math.abs(u * k)}=${jo}\).` }; } },
      { general() { const a = R(3, 9); let b; do { b = R(1, 20); } while (b % a === 0); const m = b % a; const mut = R(0, 1) ? m : (m + R(1, a - 1)) % a;
        return { allitas: T`A \(${a}n+${b}\) alakú számok (\(n\) egész) ${vel(a)} osztva ${mut} maradékot adnak.`, igaz: mut === m, miert: T`\(${b}\) ${vel(a)} osztva ${m} maradékot ad, a \(${a}n\) pedig osztható ${vel(a)}.` }; } }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki a \(3a^2-2ab\) kifejezés helyettesítési értékét, ha \(a=-2\) és \(b=\frac12\)!`,
      lepesek: [T`Írjuk a betűk helyére a számokat zárójelben: \[3\cdot(-2)^2-2\cdot(-2)\cdot\frac12\]`, T`Először hatványozunk: \((-2)^2=4\), így \(3\cdot4=12\).`, T`A szorzat: \(2\cdot(-2)\cdot\frac12=-2\).`, T`\[12-(-2)=14\]`]
    },
    feladatok
  }));
})();
