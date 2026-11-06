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
    do { a = R(-2, 4); b = R(-1, 3); c = R(-2, 2); N = 2 ** a * 3 ** b * 10 ** c; }
    while (Math.abs(N - 1) < 1e-9 || N > 2000 || N < 0.001 || Math.abs(N * 10000 - Math.round(N * 10000)) > 1e-6 || (a === 0 && b === 0) || (b < 0 && c <= 0));
    const val = a * 0.301 + b * 0.477 + c; const NT = Math.abs(N - Math.round(N)) < 1e-9 ? nt(Math.round(N)) : nt(+N.toFixed(6));
    const fac = [], lin2 = [];
    if (a) { fac.push(a === 1 ? '2' : T`2^{${a}}`); lin2.push(T`${a === 1 ? '' : a === -1 ? '-' : a}\lg 2`); }
    if (b) { fac.push(b === 1 ? '3' : T`3^{${b}}`); lin2.push(T`${b === 1 ? '' : b === -1 ? '-' : b}\lg 3`); }
    if (c) { fac.push(c === 1 ? '10' : T`10^{${c}}`); lin2.push(String(c)); }
    const linT = lin2.join('+').replace(/\+-/g, '-');
    return { kerdes: T`<p>Tudjuk, hogy \(\lg 2\approx 0{,}301\) és \(\lg 3\approx 0{,}477\). Számítsd ki ezek segítségével, számológép nélkül!</p>\[\lg ${NT}\]`,
      valasz: { ertekek: [+val.toFixed(3)], tol: 0.0015, forma: 'tizedes' }, formatum: 'tizedes tört, 3 tizedesjegy',
      tipp: T`Írd fel a számot 2, 3 és 10 hatványainak szorzataként (pl. \(1{,}5=\frac{3}{2}\), \(5=\frac{10}{2}\)), aztán bontsd szét az azonosságokkal.`,
      megoldas: [T`\[\lg ${NT}=\lg\left(${fac.join('\\cdot ')}\right)=${linT}\approx ${nt(+val.toFixed(3))}\]`] };
  } };

  feladatok.calc = { nev: 'Számológéppel', general() {
    const b = P([2, 3, 4, 5, 6, 7, 0.5, 0.8, 0.9, 1.02, 1.05, 1.08, 1.1, 1.5]); let c, v;
    do { c = P([0.2, 0.5, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 30, 50, 100, 1000]); v = Math.log(c) / Math.log(b); } while (c === b || Math.abs(v - Math.round(v)) < 1e-9);
    return { kerdes: T`<p>Számítsd ki számológéppel, két tizedesjegyre kerekítve!</p>\[\log_{${nt(b)}} ${nt(c)}\]`, valasz: { ertekek: [+v.toFixed(2)], tol: 0.006, forma: 'tizedes' }, formatum: 'tizedes tört, pl. 2,73',
      tipp: T`Térj át 10-es alapra: \(\log_a b=\dfrac{\lg b}{\lg a}\). A számológépen ez a „log” gomb.`,
      megoldas: [T`\[\log_{${nt(b)}} ${nt(c)}=\frac{\lg ${nt(c)}}{\lg ${nt(b)}}\approx\frac{${nt(+Math.log10(c).toFixed(4))}}{${nt(+Math.log10(b).toFixed(4))}}\approx ${nt(+v.toFixed(2))}\]`] };
  } };

  const fmul = (a, b) => F(a.n * b.n, a.d * b.d), fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
  const LB = b => b === 10 ? T`\lg` : T`\log_{${b}}`;

  feladatok.logValt = { nev: 'Az ismeretlen szám', general() {
    const b = P([2, 3, 5, 7, 10]); const L = LB(b); const v = P(['a', 'b', 'c', 'x']);
    for (let t = 0; t < 300; t++) {
      const db = R(2, 3); const terms = [];
      for (let i = 0; i < db; i++) { const k = P([1, 1, 1, 2, 2, 3, F(1, 2), F(1, 3)]); const kk = typeof k === 'number' ? F(k) : k;
        let m = kk.d === 2 ? P([4, 9, 16, 25, 36, 49, 64, 81, 100]) : kk.d === 3 ? P([8, 27, 64, 125]) : P([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 24, 25, 30, 36, 40, 50]);
        if (terms.some(x => x.m === m)) { i--; continue; } terms.push({ k: kk, m, s: i === 0 ? 1 : P([1, -1]) }); }
      const konst = R(0, 3) === 0 ? R(1, 2) * P([1, -1]) : 0;
      let val = F(1); for (const x of terms) { const base = x.k.d === 1 ? x.m ** x.k.n : Math.round(x.m ** (x.k.n / x.k.d)); val = x.s > 0 ? fmul(val, F(base)) : fdiv(val, F(base)); }
      if (konst) val = konst > 0 ? fmul(val, F(b ** konst)) : fdiv(val, F(b ** -konst));
      if (Math.max(val.n, val.d) > 2000 || fv(val) === 1) continue;
      const kT = k => k.d === 1 ? (k.n === 1 ? '' : k.n + '\\cdot ') : ft(k) + '\\cdot ';
      const tex = (konst > 0 ? konst + '+' : konst < 0 ? konst : '') + terms.map((x, i) => ((i === 0 && konst >= 0) ? (x.s < 0 ? '-' : '') : (x.s < 0 ? '-' : '+')) + kT(x.k) + L + ' ' + x.m).join('').replace(/^\+/, '');
      const pw = x => x.k.d === 1 && x.k.n === 1 ? String(x.m) : T`${x.m}^{${ft(x.k)}}`;
      const up = terms.filter(x => x.s > 0).map(pw), dn = terms.filter(x => x.s < 0).map(pw);
      if (konst > 0) up.push(T`${b}^{${konst}}`); if (konst < 0) dn.push(T`${b}^{${-konst}}`);
      const arg = dn.length ? T`\frac{${up.join('\\cdot ')}}{${dn.join('\\cdot ')}}` : up.join('\\cdot ');
      return { kerdes: T`<p>Határozd meg \(${v}\) értékét!</p>\[${L} ${v}=${tex}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
        tipp: T`Vond össze a jobb oldalt egyetlen logaritmussá: a szorzót vidd fel kitevőbe, az összeg szorzat, a különbség hányados lesz${konst ? T`; a konstans tagot írd fel logaritmusként: \(${Math.abs(konst)}=${L} ${b ** Math.abs(konst)}\)` : ''}. Utána \(${L} ${v}=${L} N\Rightarrow ${v}=N\).`,
        megoldas: [T`\[${L} ${v}=${L}${dn.length ? '' : '\\left('}${arg}${dn.length ? '' : '\\right)'}=${L} ${ft(val)}\quad\Rightarrow\quad ${v}=${ft(val)}\]`] };
    }
    return this.general();
  } };

  feladatok.logTobb = { nev: 'Több tag összevonása', general() {
    const b = P([2, 3, 5, 6, 10]); const L = LB(b); const k = R(-1, 3);
    for (let t = 0; t < 400; t++) {
      const MS = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30, 32, 36, 40, 45, 48, 50, 60, 64, 72, 75, 80, 81, 100];
      const m1 = P(MS), m2 = P(MS); const c1 = R(1, 3), c2 = R(1, 3) * P([1, -1]); if (m1 === m2) continue;
      const prod = fdiv(fpow(F(b), k), fmul(fpow(F(m1), c1), fpow(F(m2), c2)));
      let m3, s3; if (prod.d === 1) { m3 = prod.n; s3 = 1; } else if (prod.n === 1) { m3 = prod.d; s3 = -1; } else continue;
      if (m3 < 2 || m3 > 200 || m3 === m1 || m3 === m2) continue;
      const kT = c => (c < 0 ? '-' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c));
      const tex = (c1 === 1 ? '' : c1) + L + ' ' + m1 + kT(c2) + L + ' ' + m2 + kT(s3) + L + ' ' + m3;
      const p1 = c1 === 1 ? String(m1) : T`${m1}^{${c1}}`, p2 = Math.abs(c2) === 1 ? String(m2) : T`${m2}^{${Math.abs(c2)}}`;
      const up = [p1], dn = []; (c2 > 0 ? up : dn).push(p2); (s3 > 0 ? up : dn).push(String(m3));
      const N = b ** k; const NT = k >= 0 ? String(N) : T`\frac{1}{${b ** -k}}`;
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${tex}\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
        tipp: T`A szorzókat vidd fel kitevőbe, majd az egészet vond össze egyetlen logaritmussá: \(\log x+\log y=\log(xy)\), \(\log x-\log y=\log\frac{x}{y}\).`,
        megoldas: [T`\[${tex}=${L}\frac{${up.join('\\cdot ')}}{${dn.length ? dn.join('\\cdot ') : 1}}=${L} ${NT}=${k}\]`] };
    }
    return this.general();
  } };

  feladatok.logAlapvalt = { nev: 'Más alapra', general() {
    const kind = R(0, 2);
    if (kind < 2) { const b = P([2, 3, 5]); const opts = [{ t: String(b * b), r: F(2) }, { t: String(b ** 3), r: F(3) }, { t: T`\sqrt{${b}}`, r: F(1, 2) }, { t: T`\frac{1}{${b}}`, r: F(-1) }, { t: T`\frac{1}{${b * b}}`, r: F(-2) }, { t: T`\sqrt[3]{${b}}`, r: F(1, 3) }];
      const o = P(opts); const vv = P([F(R(-6, 12)), F(R(1, 9), 2)]); if (vv.n === 0) return this.general();
      const ans = F(vv.n * o.r.d, vv.d * o.r.n);
      const v = P(['x', 'a', 'N']);
      if (kind === 0) return { kerdes: T`<p>Tudjuk, hogy \(\log_{${b}} ${v}=${ft(vv)}\). Mennyi \(\log_{${o.t}} ${v}\)?</p>`, valasz: { ertekek: [fv(ans)] }, formatum: FMT.frac,
        tipp: T`Térj át ${b}-es alapra: \(\log_{${o.t}} ${v}=\dfrac{\log_{${b}} ${v}}{\log_{${b}} ${o.t}}\), és \(\log_{${b}} ${o.t}=${ft(o.r)}\).`,
        megoldas: [T`\[\log_{${o.t}} ${v}=\frac{\log_{${b}} ${v}}{\log_{${b}} ${o.t}}=\frac{${ft(vv)}}{${ft(o.r)}}=${ft(ans)}\]`] };
      return { kerdes: T`<p>Tudjuk, hogy \(\log_{${o.t}} ${v}=${ft(ans)}\). Mennyi \(\log_{${b}} ${v}\)?</p>`, valasz: { ertekek: [fv(vv)] }, formatum: FMT.frac,
        tipp: T`\(\log_{${b}} ${v}=\log_{${o.t}} ${v}\cdot\log_{${b}} ${o.t}\), és \(\log_{${b}} ${o.t}=${ft(o.r)}\).`,
        megoldas: [T`\[\log_{${b}} ${v}=\log_{${o.t}} ${v}\cdot\log_{${b}} ${o.t}=${ft(ans)}\cdot ${fv(o.r) < 0 ? `(${ft(o.r)})` : ft(o.r)}=${ft(vv)}\]`] }; }
    // log_b x = v → log_x b = 1/v
    const b = P([2, 3, 5, 7, 10]); const pv = P([F(2), F(3), F(4), F(5), F(-2), F(-3), F(1, 2), F(2, 3), F(3, 4), F(3, 2), F(5, 2), F(-1, 2)]); const v = P(['x', 'a', 'N']);
    return { kerdes: T`<p>Tudjuk, hogy \(${LB(b)} ${v}=${ft(pv)}\). Mennyi \(\log_{${v}} ${b}\)?</p>`, valasz: { ertekek: [pv.d / pv.n] }, formatum: FMT.frac,
      tipp: T`\(\log_a b=\dfrac{1}{\log_b a}\): az alap és a szám felcserélésekor a logaritmus a reciprokára változik.`,
      megoldas: [T`\[\log_{${v}} ${b}=\frac{1}{${LB(b)} ${v}}=\frac{1}{${ft(pv)}}=${ft(F(pv.d, pv.n))}\]`] };
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
    { allitas: T`\(\lg 25+\lg 4=2\)`, igaz: true, miert: T`\(\lg(25\cdot 4)=\lg 100=2\).` },
    { allitas: T`\(\log_2 24-\log_2 3=3\)`, igaz: true, miert: T`\(\log_2\frac{24}{3}=\log_2 8=3\).` },
    { allitas: T`\(\log_3 5\cdot\log_5 3=1\)`, igaz: true, miert: T`\(\log_a b=\frac{1}{\log_b a}\), tehát a szorzatuk 1.` },
    { allitas: T`\(\lg 2+\lg 3=\lg 5\)`, igaz: false, miert: T`\(\lg 2+\lg 3=\lg(2\cdot 3)=\lg 6\).` },
    { allitas: T`\(\log_4 x=\frac12\log_2 x\) \((x>0)\)`, igaz: true, miert: T`\(\log_4 x=\dfrac{\log_2 x}{\log_2 4}=\dfrac{\log_2 x}{2}\).` },
    { allitas: T`\(\lg\frac{1}{x}=-\lg x\) \((x>0)\)`, igaz: true, miert: T`\(\lg\frac1x=\lg x^{-1}=-\lg x\).` }
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
