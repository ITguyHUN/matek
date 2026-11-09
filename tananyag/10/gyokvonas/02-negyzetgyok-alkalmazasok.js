/*
 * A gyökvonás / 3. fejezet – A négyzetgyökvonás azonosságainak alkalmazása
 * Témakör: A gyökvonás (Sokszínű matematika 10., 2. fejezet; vizsgatematika 1. témakör; TK 50/1–2; FGY 2102–2103, 2112–2131)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, el, zj, keverd, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;
  const ALAP = [2, 3, 5, 6, 7, 10];
  const gT = (c, m) => (c === 1 ? '' : c === -1 ? '-' : c) + T`\sqrt{${m}}`;          // c·√m
  /* p + q√m TeX-alakja */
  const pq = (p, q, m) => { if (q === 0) return sz(p); const g = (Math.abs(fv(q)) === 1 ? (fv(q) < 0 ? '-' : '') : (fv(q) < 0 ? '-' : '') + absT(q)) + T`\sqrt{${m}}`; return fv(p) === 0 ? g : sz(p) + (fv(q) > 0 ? '+' : '') + g; };
  const sz = M10.sz, absT = M10.absT;

  feladatok.osszevon = { nev: 'Összevonás', general() {
    const m = P(ALAP); const n = R(2, 4); const tagok = []; let ossz = 0; const ss = M10.kulonbozo(n, 1, 7);
    for (let i = 0; i < n; i++) { const s = ss[i], c = (i === 0 ? 1 : P([1, -1])) * P([1, 1, 1, 2, 3]); tagok.push([c, s]); ossz += c * s; }
    if (ossz === 0) return feladatok.osszevon.general();
    const tex = tagok.map(([c, s], i) => (i && c > 0 ? '+' : '') + gT(c, s * s * m)).join('');
    return { kerdes: T`<p>Végezd el az összevonást! Mi kerül a négyzet helyére?</p>\[${tex}=\square\sqrt{${m}}\]`,
      valasz: { ertekek: [ossz] }, formatum: FMT10.egesz,
      tipp: T`Hozd minden tagot \(k\sqrt{${m}}\) alakra (kiemelés a gyökjel alól), aztán vond össze az együtthatókat.`,
      megoldas: [T`\[${tagok.map(([c, s], i) => (i && c > 0 ? '+' : '') + (c * s === 1 ? '' : c * s === -1 ? '-' : c * s) + T`\sqrt{${m}}`).join('')}=${ossz}\sqrt{${m}}\]`] };
  } };

  feladatok.szorzas = { nev: 'Szorzás, nevezetes azonosságok', general() {
    const m = P(ALAP); const t = R(0, 2);
    let p1, q1, p2, q2;   // (p1√m + q1)(p2√m + q2)
    if (t === 0) { p1 = R0(-4, 4); q1 = R0(-7, 7); p2 = p1; q2 = -q1; }            // (a√m + b)(a√m − b)
    else if (t === 1) { p1 = R0(-3, 4); q1 = R0(-6, 6); p2 = p1; q2 = q1; }           // négyzet
    else { p1 = R0(-3, 4); q1 = R0(-6, 6); p2 = R0(-3, 4); q2 = R0(-6, 6); }
    const P0 = p1 * p2 * m + q1 * q2, Q0 = p1 * q2 + q1 * p2;
    const tag = (p, q) => T`\left(${gT(p, m)}${el(q)}\right)`;
    const bal = t === 1 ? T`${tag(p1, q1)}^2` : tag(p1, q1) + tag(p2, q2);
    const melyik = Q0 === 0 ? 0 : R(0, 1);
    return { kerdes: T`<p>Végezd el a műveleteket! Az eredmény \(p+q\sqrt{${m}}\) alakú (\(p,q\) egész). Mennyi ${melyik ? T`\(q\)` : T`\(p\)`}?</p>\[${bal}\]`,
      valasz: { ertekek: [melyik ? Q0 : P0] }, formatum: FMT10.egesz,
      tipp: t === 0 ? T`\((a+b)(a-b)=a^2-b^2\)` : t === 1 ? T`\((a+b)^2=a^2+2ab+b^2\), és \(\left(\sqrt{${m}}\right)^2=${m}\).` : 'Szorozz minden tagot minden taggal, majd vond össze a racionális és a gyökös tagokat külön.',
      megoldas: [T`\[${bal}=${p1 * p2 * m}${el(p1 * q2)}\sqrt{${m}}${el(q1 * p2)}\sqrt{${m}}${el(q1 * q2)}=${pq(P0, Q0, m)}\]`.replace(/([+-])1\\sqrt/g, '$1\\sqrt'), T`Tehát \(p=${P0}\), \(q=${Q0}\).`] };
  } };

  feladatok.gyoktelenit = { nev: 'A nevező gyöktelenítése', general() {
    const t = R(0, 2); const m = P(ALAP);
    if (t === 0) {   // a / (k√m) = c√m
      const k = P([1, 1, 2, 3]); const a = R(1, 12) * (R(0, 1) ? m : 1); const c = F(a, k * m);
      return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Mi kerül a négyzet helyére? (Tört is lehet.)</p>\[\frac{${a}}{${gT(k, m)}}=\square\cdot\sqrt{${m}}\]`,
        valasz: { ertekek: [fv(c)] }, formatum: FMT10.tort, tipp: T`Bővíts \(\sqrt{${m}}\)-mal: \(\sqrt{${m}}\cdot\sqrt{${m}}=${m}\).`,
        megoldas: [T`\[\frac{${a}}{${gT(k, m)}}=\frac{${a}\sqrt{${m}}}{${k === 1 ? '' : k + T`\cdot `}${m}}=${ft(c)}\sqrt{${m}}\]`], _ell: w => egy(w * Math.sqrt(m), a / (k * Math.sqrt(m))) };
    }
    // a / (√m ± n) = a(√m ∓ n)/(m − n²) = p + q√m
    let n; do { n = R(1, 4); } while (n * n === m);
    const plusz = R(0, 1) === 1; const nev = m - n * n; const a = R(0, 1) ? nev * R0(-4, 4) : R0(-12, 12);
    // a(√m ∓ n)/nev → q = a/nev, p = ∓ a n / nev
    const q = F(a, nev), p = F((plusz ? -1 : 1) * a * n, nev); const melyik = R(0, 1);
    return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Az eredmény \(p+q\sqrt{${m}}\) alakú. Mennyi ${melyik ? T`\(q\)` : T`\(p\)`}?</p>\[\frac{${a}}{\sqrt{${m}}${plusz ? '+' : '-'}${n}}\]`,
      valasz: { ertekek: [fv(melyik ? q : p)] }, formatum: FMT10.tort,
      tipp: T`Bővíts a nevező „konjugáltjával”: \(\sqrt{${m}}${plusz ? '-' : '+'}${n}\). A nevező: \((a+b)(a-b)=a^2-b^2\).`,
      megoldas: [T`\[\frac{${a}\left(\sqrt{${m}}${plusz ? '-' : '+'}${n}\right)}{\left(\sqrt{${m}}${plusz ? '+' : '-'}${n}\right)\left(\sqrt{${m}}${plusz ? '-' : '+'}${n}\right)}=\frac{${a}\left(\sqrt{${m}}${plusz ? '-' : '+'}${n}\right)}{${m}-${n * n}}\]`, T`\[=${pq(p, q, m)}\]`, T`Tehát \(p=${ft(p)}\), \(q=${ft(q)}\).`],
      _ell: w => { const v = a / (Math.sqrt(m) + (plusz ? n : -n)); return melyik ? egy(fv(p) + w * Math.sqrt(m), v) : egy(w + fv(q) * Math.sqrt(m), v); } };
  } };

  feladatok.behelyettesit = { nev: 'Helyettesítési érték', general() {
    // x = p + √m; x² − 2p x + c = m − p² + c
    const m = P(ALAP), p = R0(-5, 5), c = R(-10, 10); const t = R(0, 1);
    if (t === 0) { const ans = m - p * p + c;
      return { kerdes: T`<p>Számítsd ki a kifejezés pontos értékét, ha \(x=${p}+\sqrt{${m}}\)!</p>\[x^2${el(-2 * p)}x${el(c)}\]`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
        tipp: T`\(x^2=\left(${p}+\sqrt{${m}}\right)^2=${p * p + m}${el(2 * p)}\sqrt{${m}}\). A gyökös tagok kiesnek!`,
        megoldas: [T`\[x^2=${p * p + m}${el(2 * p)}\sqrt{${m}},\qquad ${-2 * p}x=${-2 * p * p}${el(-2 * p)}\sqrt{${m}}\]`, T`\[x^2${el(-2 * p)}x${el(c)}=${p * p + m}${el(-2 * p * p)}${el(c)}=${ans}\]`],
        _ell: w => { const x = p + Math.sqrt(m); return Math.abs(x * x - 2 * p * x + c - w) < 1e-9; } }; }
    // 1/(a + √m) + 1/(a − √m)
    let a; do { a = R(1, 6); } while (a * a === m);
    const ans = F(2 * a, a * a - m);
    return { kerdes: T`<p>Számítsd ki a kifejezés pontos értékét!</p>\[\frac{1}{${a}+\sqrt{${m}}}+\frac{1}{${a}-\sqrt{${m}}}\]`,
      valasz: { ertekek: [fv(ans)] }, formatum: FMT10.tort, tipp: T`Közös nevező: \((${a}+\sqrt{${m}})(${a}-\sqrt{${m}})=${a * a}-${m}\).`,
      megoldas: [T`\[\frac{(${a}-\sqrt{${m}})+(${a}+\sqrt{${m}})}{${a * a}-${m}}=\frac{${2 * a}}{${a * a - m}}=${ft(ans)}\]`],
      _ell: w => egy(w, 1 / (a + Math.sqrt(m)) + 1 / (a - Math.sqrt(m))) };
  } };

  feladatok.sorrend = { nev: 'Nagyság szerinti sorrend', general() {
    const elemek = []; let g = 0;
    while (elemek.length < 3 && g++ < 100) { const a = R(1, 7), m = P([2, 3, 5, 6, 7]); const v = a * a * m; if (!elemek.some(e => e.v === v)) elemek.push({ v, s: `${a === 1 ? '' : a}√${m}` }); }
    const helyes = elemek.slice().sort((x, y) => x.v - y.v).map(e => e.s).join(' < ');
    const opc = new Set([helyes]); let gg = 0;
    while (opc.size < 4 && gg++ < 50) opc.add(keverd(elemek).map(e => e.s).join(' < '));
    const lista = keverd([...opc]);
    return { kerdes: T`<p>Melyik a helyes nagyság szerinti sorrend? (Számológép nélkül döntsd el!)</p>\[${elemek.map(e => e.s.replace(/√(\d+)/, T`\sqrt{$1}`)).join(T`,\quad `)}\]`,
      valasz: { valasztas: lista, helyes: lista.indexOf(helyes) }, tipp: 'Vidd be a tényezőket a gyökjel alá, és hasonlítsd össze a gyök alatti számokat.',
      megoldas: [elemek.map(e => T`\(${e.s.replace(/√(\d+)/, T`\sqrt{$1}`)}=\sqrt{${e.v}}\)`).join(', '), `Sorrend: ${helyes}.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'vgy2',
    cim: 'A négyzetgyök-azonosságok alkalmazása',
    rovid: 'Gyökös kifejezések',
    bevezeto: T`Összevonás, szorzás, a nevező gyöktelenítése: a vizsgán ezek a leggyakoribb négyzetgyökös feladatok.`,
    elmelet: T`<div class="tbl"><table><tr><th>Művelet</th><th>Módszer</th><th>Példa</th></tr>
<tr><td>összevonás</td><td>kiemelés, csak azonos gyökös tagok vonhatók össze</td><td>\(\sqrt{72}-\sqrt{32}+\sqrt8=6\sqrt2-4\sqrt2+2\sqrt2=4\sqrt2\)</td></tr>
<tr><td>szorzás</td><td>tagonként; nevezetes azonosságok</td><td>\((\sqrt7+\sqrt3)(\sqrt7-\sqrt3)=7-3=4\)</td></tr>
<tr><td>négyzetre emelés</td><td>\((a+b)^2=a^2+2ab+b^2\)</td><td>\((3+\sqrt2)^2=11+6\sqrt2\)</td></tr>
<tr><td>gyöktelenítés (1)</td><td>bővítés \(\sqrt b\)-vel</td><td>\(\frac{6}{\sqrt3}=\frac{6\sqrt3}{3}=2\sqrt3\)</td></tr>
<tr><td>gyöktelenítés (2)</td><td>bővítés a konjugálttal</td><td>\(\frac{4}{\sqrt5-1}=\frac{4(\sqrt5+1)}{5-1}=\sqrt5+1\)</td></tr></table></div>
<div class="prose"><ul>
<li>\(\sqrt a+\sqrt b\neq\sqrt{a+b}\) – különböző gyökös tagokat nem lehet összevonni: \(\sqrt2+\sqrt3\) már nem egyszerűsíthető.</li>
<li>A konjugált: \(\sqrt a+b\) párja \(\sqrt a-b\); szorzatuk \(a-b^2\) (gyökmentes).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(\sqrt2+\sqrt3=\sqrt5\)`, igaz: false, miert: T`\(\sqrt2+\sqrt3\approx3{,}15\), \(\sqrt5\approx2{,}24\).` },
      { allitas: T`\(\sqrt{50}-\sqrt{18}=\sqrt{8}\)`, igaz: true, miert: T`\(5\sqrt2-3\sqrt2=2\sqrt2=\sqrt8\).` },
      { allitas: T`\(\sqrt{50}-\sqrt{18}=\sqrt{32}\)`, igaz: false, miert: T`\(5\sqrt2-3\sqrt2=2\sqrt2=\sqrt8\), nem \(\sqrt{32}\) (a gyök alatti számokat nem lehet kivonni).` },
      { allitas: T`\((\sqrt5-\sqrt3)(\sqrt5+\sqrt3)=2\)`, igaz: true, miert: T`\(5-3=2\).` },
      { allitas: T`\((1+\sqrt2)^2=3\)`, igaz: false, miert: T`\((1+\sqrt2)^2=1+2\sqrt2+2=3+2\sqrt2\).` },
      { allitas: T`\(\frac{1}{\sqrt2}=\frac{\sqrt2}{2}\)`, igaz: true, miert: T`Bővítve \(\sqrt2\)-vel: \(\frac{\sqrt2}{2}\).` },
      { allitas: T`\(\frac{2}{\sqrt3-1}=\sqrt3+1\)`, igaz: true, miert: T`\(\frac{2(\sqrt3+1)}{3-1}=\sqrt3+1\).` },
      { allitas: T`\(2\sqrt3\cdot3\sqrt2=6\sqrt5\)`, igaz: false, miert: T`\(2\cdot3\cdot\sqrt{3\cdot2}=6\sqrt6\).` }
    ],
    mintapelda: {
      feladat: T`Gyöktelenítsük: \(\dfrac{12}{\sqrt7-\sqrt3}\)`,
      lepesek: [T`Bővítsünk a konjugálttal: \(\sqrt7+\sqrt3\).`, T`\[\frac{12(\sqrt7+\sqrt3)}{(\sqrt7-\sqrt3)(\sqrt7+\sqrt3)}=\frac{12(\sqrt7+\sqrt3)}{7-3}\]`, T`\[=3(\sqrt7+\sqrt3)=3\sqrt7+3\sqrt3\]`]
    },
    feladatok
  }));
})();
