/*
 * 7. fejezet – A logaritmus azonosságai
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.logossz = { nev: 'Összevonás', general() {
    const kind = R(0, 2);
    if (kind === 0) { const [a, b] = P([[2, 5], [4, 25], [20, 5], [50, 2], [8, 125], [25, 40], [50, 20], [4, 250], [200, 5], [2, 50], [0.5, 20], [0.2, 50], [0.25, 400]]);
      const prod = +(a * b).toFixed(8); const k = Math.round(Math.log10(prod));
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\lg ${nt(a)}+\lg ${nt(b)}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: T`\(\lg x+\lg y=\lg(xy)\).`, megoldas: [T`\[\lg ${nt(a)}+\lg ${nt(b)}=\lg\left(${nt(a)}\cdot ${nt(b)}\right)=\lg ${nt(prod)}=${k}\]`] }; }
    if (kind === 1) { const b = P([2, 3, 5]); const C = P([2, 3, 5, 6, 7]); const k = R(1, b === 5 ? 2 : 3); const A = C * b ** k; const L = lgOf(b);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${L} ${A}-${L} ${C}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: T`\(\log_a x-\log_a y=\log_a\dfrac{x}{y}\).`, megoldas: [T`\[${L} ${A}-${L} ${C}=${L}\frac{${A}}{${C}}=${L} ${b ** k}=${k}\]`] }; }
    const e = P([{ b: 10, m: 2, u: 5, w: '4', op: '+', k: 2 }, { b: 10, m: 3, u: 2, w: '125', op: '+', k: 3 }, { b: 10, m: 2, u: 2, w: '25', op: '+', k: 2 },
      { b: 10, m: 3, u: 5, w: '8', op: '+', k: 3 }, { b: 6, m: 2, u: 3, w: '4', op: '+', k: 2 }, { b: 2, m: 3, u: 2, w: '4', op: '+', k: 5 },
      { b: 10, m: 2, u: 50, w: '25', op: '-', k: 2 }, { b: 2, m: 2, u: 12, w: '9', op: '-', k: 4 }, { b: 3, m: 2, u: 6, w: T`\frac{3}{4}`, op: '+', k: 3 }]);
    const L = lgOf(e.b);
    const comb = e.op === '+' ? T`${L}\left(${e.u ** e.m}\cdot ${e.w}\right)` : T`${L}\frac{${e.u ** e.m}}{${e.w}}`;
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${e.m}${L} ${e.u}${e.op}${L} ${e.w}\]`, valasz: { ertekek: [e.k] }, formatum: 'egész szám',
      tipp: T`Először a szorzót vidd fel kitevőbe: \(k\cdot\log_a x=\log_a x^{k}\). Utána vond össze egy logaritmusba.`,
      megoldas: [T`\[${e.m}${L} ${e.u}${e.op}${L} ${e.w}=${L} ${e.u}^{${e.m}}${e.op}${L} ${e.w}=${comb}=${L} ${e.b ** e.k}=${e.k}\]`] };
  } };

  feladatok.attere = { nev: 'Áttérés, hányados', general() {
    if (R(0, 2) > 0) { const c = P([2, 3, 5]); const top = c === 5 ? 3 : 4; const m = R(1, top); let n = R(1, top); while (n === m) n = R(1, top);
      const L = P([T`\lg`, T`\log_{7}`, T`\log_{6}`]);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\frac{${L} ${c ** m}}{${L} ${c ** n}}\]`, valasz: { ertekek: [m / n] }, formatum: FMT.frac,
        tipp: T`Írd fel a számokat \(${c}\) hatványaként, és hozd ki a kitevőt szorzónak. Vigyázz: \(\dfrac{\lg a}{\lg b}\ne\lg\dfrac{a}{b}\)!`,
        megoldas: [T`\[\frac{${L} ${c}^{${m}}}{${L} ${c}^{${n}}}=\frac{${m}\cdot ${L} ${c}}{${n}\cdot ${L} ${c}}=${ft(F(m, n))}\]`] }; }
    const a = P([2, 3]); const mid = P([3, 5, 7].filter(x => x !== a)); const k = R(2, 4);
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\log_{${a}} ${mid}\cdot\log_{${mid}} ${a ** k}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: T`Térj át 10-es alapra: \(\log_a b=\dfrac{\lg b}{\lg a}\). A szorzatban valami ki fog esni.`,
      megoldas: [T`\[\frac{\lg ${mid}}{\lg ${a}}\cdot\frac{\lg ${a ** k}}{\lg ${mid}}=\frac{\lg ${a ** k}}{\lg ${a}}=\log_{${a}} ${a ** k}=${k}\]`] };
  } };

  feladatok.lg23 = { nev: 'lg 2 és lg 3 segítségével', general() {
    let a, b, c, N;
    do { a = R(-1, 3); b = R(0, 2); c = R(-1, 1); N = 2 ** a * 3 ** b * 10 ** c; }
    while (Math.abs(N - 1) < 1e-9 || N > 500 || Math.abs(N * 1000 - Math.round(N * 1000)) > 1e-6 || (a === 0 && b === 0));
    const val = a * 0.301 + b * 0.477 + c;
    const fac = [], lin2 = [];
    if (a) { fac.push(a === 1 ? '2' : T`2^{${a}}`); lin2.push(T`${a === 1 ? '' : a === -1 ? '-' : a}\lg 2`); }
    if (b) { fac.push(b === 1 ? '3' : T`3^{${b}}`); lin2.push(T`${b === 1 ? '' : b}\lg 3`); }
    if (c) { fac.push(c === 1 ? '10' : T`10^{${c}}`); lin2.push(String(c)); }
    const linT = lin2.join('+').replace(/\+-/g, '-');
    return { kerdes: T`<p>Tudjuk, hogy \(\lg 2\approx 0{,}301\) és \(\lg 3\approx 0{,}477\). Számítsd ki ezek segítségével, számológép nélkül!</p>\[\lg ${nt(N)}\]`,
      valasz: { ertekek: [val], tol: 0.0015 }, formatum: 'tizedes tört, 3 tizedesjegy',
      tipp: T`Írd fel a számot 2, 3 és 10 hatványainak szorzataként (pl. \(1{,}5=\frac{3}{2}\), \(5=\frac{10}{2}\)), aztán bontsd szét az azonosságokkal.`,
      megoldas: [T`\[\lg ${nt(N)}=\lg\left(${fac.join('\\cdot ')}\right)=${linT}\approx ${nt(+val.toFixed(3))}\]`] };
  } };

  feladatok.calc = { nev: 'Számológéppel', general() {
    const b = P([2, 3, 5, 7, 0.5, 1.05, 1.1]); let c, v;
    do { c = P([3, 5, 6, 7, 10, 20, 50, 100]); v = Math.log(c) / Math.log(b); } while (Math.abs(v - Math.round(v)) < 1e-9);
    return { kerdes: T`<p>Számítsd ki számológéppel, két tizedesjegyre kerekítve!</p>\[\log_{${nt(b)}} ${c}\]`, valasz: { ertekek: [v], tol: 0.006 }, formatum: 'tizedes tört, pl. 2,73',
      tipp: T`Térj át 10-es alapra: \(\log_a b=\dfrac{\lg b}{\lg a}\). A számológépen ez a „log” gomb.`,
      megoldas: [T`\[\log_{${nt(b)}} ${c}=\frac{\lg ${c}}{\lg ${nt(b)}}\approx\frac{${nt(+Math.log10(c).toFixed(4))}}{${nt(+Math.log10(b).toFixed(4))}}\approx ${nt(+v.toFixed(2))}\]`] };
  } };

  Tananyag.fejezet({
    id: 'azon',
    cim: 'A logaritmus azonosságai',
    rovid: 'Log. azonosságok',
    bevezeto: T`A logaritmus azonosságai a hatványazonosságok „fordításai”: a szorzásból összeadás, a hatványozásból szorzás lesz.`,
    elmelet: T`<div class="mathbox">\[\log_a(xy)=\log_a x+\log_a y\qquad \log_a\frac{x}{y}=\log_a x-\log_a y\qquad \log_a x^{k}=k\log_a x\]\[\log_a b=\frac{\log_c b}{\log_c a}=\frac{\lg b}{\lg a}\qquad \log_a b=\frac{1}{\log_b a}\]</div>
<div class="tbl"><table><thead><tr><th>Hatványazonosság</th><th>Logaritmus-azonosság</th></tr></thead><tbody>
<tr><td>\(a^m\cdot a^n=a^{m+n}\)</td><td>\(\log(xy)=\log x+\log y\)</td></tr>
<tr><td>\(a^m:a^n=a^{m-n}\)</td><td>\(\log\frac{x}{y}=\log x-\log y\)</td></tr>
<tr><td>\((a^m)^k=a^{mk}\)</td><td>\(\log x^k=k\log x\)</td></tr></tbody></table></div>
<div class="prose"><p>Az azonosságok csak <b>azonos alapú</b> logaritmusokra működnek; különböző alapnál előbb át kell térni.</p></div>`,
    igazHamis: [
    { allitas: T`\(\lg(x+y)=\lg x+\lg y\)`, igaz: false, miert: T`Összeg logaritmusára nincs azonosság. A szorzat logaritmusa bontható összegre.` },
    { allitas: T`\(\dfrac{\lg 8}{\lg 2}=\lg 4\)`, igaz: false, miert: T`Ez áttérés: \(\dfrac{\lg 8}{\lg 2}=\log_2 8=3\).` },
    { allitas: T`\(2\lg x=\lg\left(x^2\right)\) \((x>0)\)`, igaz: true, miert: T`\(k\log x=\log x^k\).` },
    { allitas: T`\((\lg x)^2=2\lg x\)`, igaz: false, miert: T`A \(2\lg x\) a \(\lg(x^2)\)-tel egyenlő, nem \((\lg x)^2\)-tel.` },
    { allitas: T`\(\lg 25+\lg 4=2\)`, igaz: true, miert: T`\(\lg(25\cdot 4)=\lg 100=2\).` }
    ],
    mintapelda: {
      feladat: T`Számítsd ki: \(2\lg 5+\lg 4\), majd \(\log_3 20\) értékét számológéppel.`,
      lepesek: [
      T`A szorzót felvisszük kitevőbe: \(2\lg 5=\lg 5^2=\lg 25\).`,
      T`\[\lg 25+\lg 4=\lg(25\cdot 4)=\lg 100=2\]`,
      T`A \(\log_3 20\)-hoz áttérünk 10-es alapra:`,
      T`\[\log_3 20=\frac{\lg 20}{\lg 3}\approx\frac{1{,}3010}{0{,}4771}\approx 2{,}73\]`
      ]
    },
    feladatok
  });
})();
