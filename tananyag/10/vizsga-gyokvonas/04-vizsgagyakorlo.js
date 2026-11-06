/*
 * Vizsga 1. témakör / 4. fejezet – Vizsgagyakorló: négyzetgyök és n-edik gyök vegyesen
 * Témakör: Négyzetgyök, n-edik gyök (vizsgatematika 10.ABCD, 1. témakör; FGY 2104–2110, 2126–2131, 2143)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, kulonbozo, keverd, l1, el, zj, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;
  const gyk = (n, a) => n === 2 ? T`\sqrt{${a}}` : T`\sqrt[${n}]{${a}}`;
  const gyS = (n, a) => (n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'][n] + '√') + a;
  const ALAP = [2, 3, 5, 6, 7];

  feladatok.szamol = { nev: 'Pontos érték kiszámítása', general() {
    const t = R(0, 3); let tex, ans, mo;
    if (t === 0) { const m = P(ALAP); const [p, q] = kulonbozo(2, 1, 6); const s = R(0, 1) ? 1 : -1;
      tex = T`\left(\sqrt{${p * p * m}}${s > 0 ? '+' : '-'}\sqrt{${q * q * m}}\right)\cdot\sqrt{${m}}`; ans = (p + s * q) * m;
      mo = T`\(\sqrt{${p * p * m}}=${p === 1 ? '' : p}\sqrt{${m}}\), \(\sqrt{${q * q * m}}=${q === 1 ? '' : q}\sqrt{${m}}\); így \((${p + s * q})\sqrt{${m}}\cdot\sqrt{${m}}=${p + s * q}\cdot ${m}=${ans}\).`; }
    else if (t === 1) { const [a, b] = kulonbozo(2, 2, 15); tex = T`\left(\sqrt{${a}}-\sqrt{${b}}\right)^2+2\sqrt{${a * b}}`; ans = a + b;
      mo = T`\(\left(\sqrt{${a}}-\sqrt{${b}}\right)^2=${a}-2\sqrt{${a * b}}+${b}\), a gyökös tagok kiesnek: \(${ans}\).`; }
    else if (t === 2) { const p = R(1, 6), m = P(ALAP), q = R(1, 6), n = P(ALAP); tex = T`\left(${p === 1 ? '' : p}\sqrt{${m}}\right)^2-\left(${q === 1 ? '' : q}\sqrt{${n}}\right)^2`; ans = p * p * m - q * q * n;
      mo = T`\(${p * p}\cdot ${m}-${q * q}\cdot ${n}=${ans}\)`; }
    else { const m = P(ALAP), k = R(2, 5), c = R(2, 5); const x = m * k * k; tex = T`\frac{\sqrt{${x}}}{\sqrt{${m}}}+\sqrt[3]{${c ** 3}}`; ans = k + c;
      mo = T`\(\sqrt{${x}:${m}}=\sqrt{${k * k}}=${k}\), \(\sqrt[3]{${c ** 3}}=${c}\), összesen \(${ans}\).`; }
    return { kerdes: T`<p>Számítsd ki a kifejezés pontos értékét számológép nélkül!</p>\[${tex}\]`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: 'Kiemelés a gyökjel alól, nevezetes azonosságok, és ne feledd: (√a)² = a.', megoldas: [mo] };
  } };

  feladatok.valtozo = { nev: 'Egyszerűsítés változóval', general() {
    const t = R(0, 3); let tex, e, mo;
    if (t === 0) { const n = P([2, 3]); let a, b; do { a = R(1, 9); b = R(1, 9); } while ((a + b) % n !== 0); tex = T`${gyk(n, `a^{${a}}`)}\cdot ${gyk(n, `a^{${b}}`)}`; e = (a + b) / n;
      mo = T`\(${gyk(n, `a^{${a + b}}`)}=a^{${e}}\)`; }
    else if (t === 1) { const n = P([2, 3]); let a, b; do { a = R(4, 14); b = R(1, a - 1); } while ((a - b) % n !== 0); tex = T`\frac{${gyk(n, `a^{${a}}`)}}{${gyk(n, `a^{${b}}`)}}`; e = (a - b) / n;
      mo = T`\(${gyk(n, `a^{${a - b}}`)}=a^{${e}}\)`; }
    else if (t === 2) { const n = P([2, 3, 4]); const k = R(1, 3); const p = n * R(1, 3); tex = T`\left(${gyk(n, `a^{${k}}`)}\right)^{${p}}`; e = k * p / n; mo = T`\(${gyk(n, `a^{${k * p}}`)}=a^{${e}}\)`; }
    else { const n = P([2, 3]), m = P([2, 3]); const k = n * m * R(1, 2); tex = T`${gyk(n, gyk(m, `a^{${k}}`))}`; e = k / (n * m); mo = T`\(${gyk(n * m, `a^{${k}}`)}=a^{${e}}\)`; }
    return { kerdes: T`<p>Hozd egyszerűbb alakra (\(a>0\))! Az eredmény \(a^{\square}\) alakú. Mi kerül a négyzet helyére?</p>\[${tex}\]`,
      valasz: { ertekek: [e] }, formatum: FMT10.egesz,
      tipp: T`\(\sqrt[n]{a^k}\cdot\sqrt[n]{a^m}=\sqrt[n]{a^{k+m}}\), \(\sqrt[n]{a^{nk}}=a^k\), \(\sqrt[n]{\sqrt[m]{a}}=\sqrt[nm]{a}\).`, megoldas: [mo] };
  } };

  feladatok.konjugalt = { nev: 'Gyöktelenítés két gyökkel', general() {
    let p, q; do { [p, q] = kulonbozo(2, 2, 15); } while (Number.isInteger(Math.sqrt(p)) || Number.isInteger(Math.sqrt(q)));
    if (p < q) [p, q] = [q, p];
    const minusz = R(0, 1) === 1; const nev = p - q; const c = R(0, 1) ? nev * R(1, 5) : R(1, 20); const k = F(c, nev);
    return { kerdes: T`<p>Gyöktelenítsd a nevezőt! Mi kerül a négyzet helyére? (Tört is lehet.)</p>\[\frac{${c}}{\sqrt{${p}}${minusz ? '-' : '+'}\sqrt{${q}}}=\square\cdot\left(\sqrt{${p}}${minusz ? '+' : '-'}\sqrt{${q}}\right)\]`,
      valasz: { ertekek: [fv(k)] }, formatum: FMT10.tort, tipp: T`Bővíts a konjugálttal; a nevező: \(\left(\sqrt{${p}}\right)^2-\left(\sqrt{${q}}\right)^2=${p}-${q}\).`,
      megoldas: [T`\[\frac{${c}\left(\sqrt{${p}}${minusz ? '+' : '-'}\sqrt{${q}}\right)}{${p}-${q}}=${ft(k)}\left(\sqrt{${p}}${minusz ? '+' : '-'}\sqrt{${q}}\right)\]`],
      _ell: w => egy(w * (Math.sqrt(p) + (minusz ? 1 : -1) * Math.sqrt(q)), c / (Math.sqrt(p) + (minusz ? -1 : 1) * Math.sqrt(q))) };
  } };

  feladatok.sorrend = { nev: 'Sorrend: négyzet- és köbgyökök', general() {
    // √a, ∛b, ⁶√c → összehasonlítás a 6. hatványokkal: a³, b², c
    let el3; let g = 0;
    do { const a = R(2, 6), b = R(2, 12), c = R(5, 200); el3 = [{ s: gyS(2, a), v: a ** 3, t: gyk(2, a) }, { s: gyS(3, b), v: b * b, t: gyk(3, b) }, { s: gyS(6, c), v: c, t: gyk(6, c) }]; }
    while (new Set(el3.map(x => x.v)).size < 3 && g++ < 50);
    const helyes = el3.slice().sort((x, y) => x.v - y.v).map(x => x.s).join(' < ');
    const opc = new Set([helyes]); let gg = 0; while (opc.size < 4 && gg++ < 60) opc.add(keverd(el3).map(x => x.s).join(' < '));
    const lista = keverd([...opc]);
    return { kerdes: T`<p>Melyik a helyes nagyság szerinti sorrend? (Számológép nélkül döntsd el!)</p>\[${el3.map(x => x.t).join(T`,\quad `)}\]`,
      valasz: { valasztas: lista, helyes: lista.indexOf(helyes) }, tipp: T`Hozd közös gyökkitevőre (6): \(\sqrt a=\sqrt[6]{a^3}\), \(\sqrt[3]{b}=\sqrt[6]{b^2}\). Utána elég a gyök alatti számokat összehasonlítani.`,
      megoldas: [el3.map(x => T`\(${x.t}=\sqrt[6]{${x.v}}\)`).join(', '), `Sorrend: ${helyes}.`] };
  } };

  feladatok.ertelmezes = { nev: 'Értelmezési tartomány', general() {
    const n = P([2, 3, 4, 4, 5, 6]); const a = R0(-5, 5), b = R(-12, 12);
    if (n % 2 === 1) {
      const opc = keverd(['minden valós szám', `x ≥ ${M10.frSz(-b, a)}`, `x ≤ ${M10.frSz(-b, a)}`, 'egyik valós számra sem']);
      return { kerdes: T`<p>Melyik valós számokra értelmezett a kifejezés?</p>\[${gyk(n, l1(a, b))}\]`,
        valasz: { valasztas: opc, helyes: opc.indexOf('minden valós szám') }, tipp: 'Páratlan gyökkitevő esetén negatív szám gyöke is létezik.',
        megoldas: [T`A gyökkitevő (\(${n}\)) páratlan, ezért a kifejezés minden valós \(x\)-re értelmezett.`] };
    }
    const h = F(-b, a);
    return { kerdes: T`<p>Mely valós \(x\)-ekre értelmezett a kifejezés? Az értelmezési tartomány \(x${a > 0 ? T`\ge ` : T`\le `}\square\) alakú. Mi kerül a négyzet helyére?</p>\[${gyk(n, l1(a, b))}\]`,
      valasz: { ertekek: [fv(h)] }, formatum: FMT10.tort, tipp: T`Páros gyökkitevő (\(${n}\)) esetén a gyökjel alatt nem állhat negatív szám.`,
      megoldas: [T`\[${l1(a, b)}\ge0\quad\iff\quad x${a > 0 ? T`\ge ` : T`\le `}${ft(h)}\]`], _ell: w => egy(a * w + b, 0) };
  } };

  feladatok.abszolut = { nev: 'Abszolút érték a gyök alatt', general() {
    const t = R(0, 1);
    if (t === 0) { let k, m; do { k = R(1, 6); m = R(2, 40); } while (Number.isInteger(Math.sqrt(m)) || k * k === m);
      const nagyobb = Math.sqrt(m) > k; // √((k − √m)²) = |k − √m|
      const p = nagyobb ? -k : k, q = nagyobb ? 1 : -1;
      return { kerdes: T`<p>Írd fel gyökjel nélkül, \(p+q\sqrt{${m}}\) alakban! Mennyi \(p\)?</p>\[\sqrt{\left(${k}-\sqrt{${m}}\right)^2}\]`,
        valasz: { ertekek: [p] }, formatum: FMT10.egesz,
        tipp: T`\(\sqrt{A^2}=|A|\). Melyik a nagyobb: \(${k}\) vagy \(\sqrt{${m}}\)? (Hasonlítsd össze a négyzetüket.)`,
        megoldas: [T`\(${k}^2=${k * k}\) és \(\left(\sqrt{${m}}\right)^2=${m}\), tehát \(${k}${nagyobb ? '<' : '>'}\sqrt{${m}}\).`, T`\[\sqrt{\left(${k}-\sqrt{${m}}\right)^2}=\left|${k}-\sqrt{${m}}\right|=${nagyobb ? T`\sqrt{${m}}-${k}` : T`${k}-\sqrt{${m}}`}\]`, T`Tehát \(p=${p}\), \(q=${q}\).`],
        _ell: w => egy(w + q * Math.sqrt(m), Math.abs(k - Math.sqrt(m))) }; }
    const [u, v] = kulonbozo(2, -6, 6).sort((x, y) => x - y);   // u < x < v esetén √((x−u)²) + √((x−v)²) = v − u
    return { kerdes: T`<p>Mennyi a kifejezés értéke, ha \(${u}<x<${v}\)?</p>\[\sqrt{\left(${l1(1, -u)}\right)^2}+\sqrt{\left(${l1(1, -v)}\right)^2}\]`,
      valasz: { ertekek: [v - u] }, formatum: FMT10.egesz,
      tipp: T`\(\sqrt{A^2}=|A|\). A megadott intervallumon \(x${el(-u)}>0\), de \(x${el(-v)}<0\).`,
      megoldas: [T`\[\left|x${el(-u)}\right|+\left|x${el(-v)}\right|=\left(x${el(-u)}\right)+\left(${l1(-1, v)}\right)=${v - u}\]`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'vgy4',
    cim: 'Vizsgagyakorló: négyzetgyök és n-edik gyök',
    rovid: 'Vizsgagyakorló',
    bevezeto: T`Vegyes, vizsgajellegű feladatok az egész témakörből. Ha valamelyik típus nehezen megy, nézd át az előző három fejezet elméletét!`,
    elmelet: T`<div class="tbl"><table><tr><th>Ellenőrző lista</th><th>Mire figyelj?</th></tr>
<tr><td>értelmezés</td><td>páros gyökkitevőnél a gyök alatt \(\ge0\); páratlannál bármi lehet</td></tr>
<tr><td>\(\sqrt{a^2}\)</td><td>\(=|a|\), nem \(a\)!</td></tr>
<tr><td>összevonás</td><td>csak azonos gyökös tagok: \(2\sqrt3+5\sqrt3=7\sqrt3\), de \(\sqrt2+\sqrt3\) nem vonható össze</td></tr>
<tr><td>szorzás</td><td>\(\sqrt[n]a\sqrt[n]b=\sqrt[n]{ab}\); különböző gyökkitevőnél előbb közös kitevő</td></tr>
<tr><td>gyöktelenítés</td><td>\(\frac{1}{\sqrt a}=\frac{\sqrt a}{a}\); \(\frac{1}{\sqrt a-\sqrt b}=\frac{\sqrt a+\sqrt b}{a-b}\); \(\frac{1}{\sqrt[3]a}=\frac{\sqrt[3]{a^2}}{a}\)</td></tr>
<tr><td>összehasonlítás</td><td>bevitel a gyökjel alá, közös gyökkitevő, majd a gyök alatti számok összehasonlítása</td></tr></table></div>`,
    igazHamis: [
      { allitas: T`\(\sqrt[3]{2}>\sqrt{2}\)`, igaz: false, miert: T`Hatodik hatványra emelve: \(4<8\), tehát \(\sqrt[3]{2}<\sqrt{2}\).` },
      { allitas: T`\(\sqrt{(2-\sqrt5)^2}=\sqrt5-2\)`, igaz: true, miert: T`\(2<\sqrt5\), így \(|2-\sqrt5|=\sqrt5-2\).` },
      { allitas: T`\(\sqrt{a^6}=a^3\) minden valós \(a\)-ra.`, igaz: false, miert: T`\(\sqrt{a^6}=|a^3|=|a|^3\); negatív \(a\)-ra \(a^3<0\).` },
      { allitas: T`\(\sqrt[3]{a^6}=a^2\) minden valós \(a\)-ra.`, igaz: true, miert: T`\((a^2)^3=a^6\), és a köbgyök egyértelmű.` },
      { allitas: T`\(\frac{6}{\sqrt[3]{3}}=2\sqrt[3]{9}\)`, igaz: true, miert: T`Bővítve \(\sqrt[3]{9}\)-cel: \(\frac{6\sqrt[3]{9}}{3}=2\sqrt[3]{9}\).` },
      { allitas: T`\(\sqrt{12}+\sqrt{27}=\sqrt{39}\)`, igaz: false, miert: T`\(2\sqrt3+3\sqrt3=5\sqrt3=\sqrt{75}\).` }
    ],
    mintapelda: {
      feladat: T`Melyik a nagyobb: \(\sqrt[3]{3}\) vagy \(\sqrt{2}\)?`,
      lepesek: [T`Hozzuk közös gyökkitevőre (6): \(\sqrt[3]{3}=\sqrt[6]{3^2}=\sqrt[6]{9}\).`, T`\(\sqrt{2}=\sqrt[6]{2^3}=\sqrt[6]{8}\).`, T`Mivel \(9>8\): \(\sqrt[3]{3}>\sqrt{2}\).`]
    },
    feladatok
  }));
})();
