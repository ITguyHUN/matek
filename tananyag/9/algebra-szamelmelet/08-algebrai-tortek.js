/*
 * II. Algebra és számelmélet / 8. Műveletek algebrai törtekkel
 * (Sokszínű matematika 9., II/8. lecke; FGY 1172–1187; OH Matematika 9., 35–36. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, keverd, kulonbozo, tagT, tagokT, pMul, pAdd, pScale, pEval, pT, linT, zjn, lkkt, FMT9 } = M9;
  const feladatok = {};
  const el0 = c => c === 0 ? '' : (c > 0 ? '+' : '-') + Math.abs(c);

  /* tényezők: { p: polinom (növekvő együtthatók), t: TeX szorzat alakban } */
  const L = (a, b) => ({ p: [b, a], t: `(${linT(a, b)})`, gyok: F(-b, a) });                    // ax + b
  const Lp = (a, b0) => { let b = b0; while (gcd(a, b) !== 1) b += b > 0 ? 1 : -1; return L(a, b); };   // ax + b, ahol (a; b) = 1
  const M = (k, m) => { const p = Array(m + 1).fill(0); p[m] = k; return { p, t: tagT(k, m ? { x: m } : {}), gyok: m ? F(0) : null }; };   // k·x^m
  const szorzat = fs => fs.reduce((s, f) => pMul(s, f.p), [1]);
  const szorzatT = fs => { const mon = fs.filter(f => !f.t.startsWith('(')).map(f => f.t).filter(t => t !== '1'), lin = fs.filter(f => f.t.startsWith('(')).map(f => f.t);
    const m = mon.join('').replace(/^-1$/, '-'); const s = m === '-' && !lin.length ? '-1' : m + lin.join('');
    return (!m && lin.length === 1) ? lin[0].slice(1, -1) : (s || '1'); };
  const ertekF = (fs, x) => fs.reduce((s, f) => s * pEval(f.p, x), 1);
  const tilos = fs => fs.filter(f => f.gyok).map(f => fv(f.gyok));
  /* olyan egész x, ahol egyik megadott tényező sem 0 */
  const joX = (fs, a = -5, b = 6) => { for (let g = 0; g < 200; g++) { const x = R(a, b); if (fs.every(f => pEval(f.p, x) !== 0)) return x; } return 7; };

  /* ---------- értelmezési tartomány ---------- */
  feladatok.ertelmezes = { nev: 'Mikor értelmezhető?', general() {
    const t = R(0, 4); let tex, rossz, lep;
    if (t === 0) { const p = R(1, 9), m = R(-6, 6); tex = T`\frac{${linT(1, m)}}{x^2-${p * p}}`; rossz = [p, -p]; lep = T`\(x^2-${p * p}=(x-${p})(x+${p})=0\iff x=${p}\) vagy \(x=-${p}\)`; }
    else if (t === 1) { const p = R0(-9, 9); tex = T`\frac{${R(1, 9)}x}{${pT([0, -p, 1])}}`; rossz = [0, p]; lep = T`\(${pT([0, -p, 1])}=x(${linT(1, -p)})=0\iff x=0\) vagy \(x=${p}\)`; }
    else if (t === 2) { const p = R0(-7, 7); tex = T`\frac{${R(1, 9)}}{${pT([p * p, 2 * p, 1])}}`; rossz = [-p]; lep = T`\(${pT([p * p, 2 * p, 1])}=(x${el0(p)})^2=0\iff x=${-p}\)`; }
    else if (t === 3) { const [p, q] = kulonbozo(2, -7, 7, [0]); tex = T`\frac{${linT(1, R(-5, 5))}}{${pT(pMul([-p, 1], [-q, 1]))}}`; rossz = [p, q]; lep = T`\(${pT(pMul([-p, 1], [-q, 1]))}=(${linT(1, -p)})(${linT(1, -q)})=0\iff x=${p}\) vagy \(x=${q}\)`; }
    else { const p = R(1, 6); tex = T`\frac{${R(1, 5)}}{x-${p}}+\frac{${R(1, 5)}}{x^2-${p * p}}`; rossz = [p, -p]; lep = T`Az első nevező miatt \(x\neq${p}\); a második: \(x^2-${p * p}=(x-${p})(x+${p})\), így \(x\neq\pm${p}\).`; }
    return { kerdes: T`<p>Mely valós számokra <b>nem</b> értelmezhető a kifejezés? Add meg mindet!</p>\[${tex}\]`, valasz: { ertekek: rossz }, formatum: FMT9.halmaz,
      tipp: 'Alakítsd szorzattá a nevező(ke)t! Ahol valamelyik tényező 0, ott a tört nem értelmezhető.',
      megoldas: [lep, T`Az értelmezési tartomány: \(\mathbb{R}\setminus\{${rossz.slice().sort((a, b) => a - b).join(';')}\}\).`] };
  } };

  /* ---------- egyszerűsítés ---------- */
  feladatok.egyszerusites = { nev: 'Egyszerűsítés', general() {
    const t = R(0, 3);
    if (t === 0) {   // egytagúak hányadosa → k·a^m·b^n
      const [u, w] = P([['a', 'b'], ['x', 'y']]);
      const c1 = R(2, 40), c2 = R(2, 40), m1 = R(1, 6), m2 = R(1, 6), n1 = R(1, 5), n2 = R(1, 5);
      const k = F(c1, c2); if (gcd(c1, c2) === 1) return this.general();
      const mit = P(['k', 'm', 'n']);
      const ans = { k: fv(k), m: m1 - m2, n: n1 - n2 }[mit];
      return { kerdes: T`<p>Egyszerűsítsd a törtet, és írd fel \(k\cdot ${u}^{m}${w}^{n}\) alakban (a kitevő lehet negatív is)! Mennyi ${mit === 'k' ? T`a \(k\)` : mit === 'm' ? T`az \(m\)` : T`az \(n\)`}? (A betűk nem nullák.)</p>\[\frac{${c1}${u}^{${m1}}${w}^{${n1}}}{${c2}${u}^{${m2}}${w}^{${n2}}}\]`,
        valasz: { ertekek: [ans] }, formatum: mit === 'k' ? FMT9.tort : FMT9.egesz,
        tipp: T`Az együtthatókat a legnagyobb közös osztójukkal egyszerűsítsd, a hatványoknál a kitevőket vond ki: \(\frac{${u}^{m}}{${u}^{k}}=${u}^{m-k}\).`,
        megoldas: [T`\(\frac{${c1}}{${c2}}=${ft(k)}\), \(\;${u}^{${m1}-${m2}}=${u}^{${m1 - m2}}\), \(\;${w}^{${n1}-${n2}}=${w}^{${n1 - n2}}\).`] };
    }
    // polinomok: (A·C)/(B·C) = A/B
    let A, B, C;
    if (t === 1) { const p = R(1, 9); C = L(1, p); A = L(1, -p); B = M(R(1, 4), 1); }                        // (x²−p²)/(kx²+kpx)
    else if (t === 2) { const [q, r, c] = kulonbozo(3, -8, 8, [0]); C = L(1, -c); A = L(1, -q); B = L(1, -r); }      // (x−q)(x−c)/((x−r)(x−c))
    else { const a = R(1, 3); C = Lp(a, R0(-6, 6)); A = M(R(1, 5), R(0, 2)); B = C; }               // k·x^m·(ax+b) / (ax+b)²
    const sz = szorzat([A, C]), ne = szorzat([B, C]);
    const lin = [A, B].filter(f => f.t.startsWith('('));
    const rejt = P(lin); const c0 = rejt.p[0];
    const boxT = f => f === rejt ? T`(${f.p[1] === 1 ? '' : f.p[1]}x${c0 < 0 ? '-' : '+'}\square)` : f.t;
    const eredm = T`\frac{${boxT(A).replace(/^\((.*)\)$/, '$1')}}{${boxT(B).replace(/^\((.*)\)$/, '$1')}}`;
    return { kerdes: T`<p>Egyszerűsítsd a törtet! Mi kerül az eredményben a négyzet helyére? (Pozitív számot írj!)</p>\[\frac{${pT(sz)}}{${pT(ne)}}=${eredm}\]`,
      valasz: { ertekek: [Math.abs(c0)] }, formatum: FMT9.egesz,
      tipp: 'Alakítsd szorzattá a számlálót és a nevezőt is (kiemelés, nevezetes szorzat, x² + bx + c), majd egyszerűsíts a közös tényezővel!',
      megoldas: [T`\[\frac{${pT(sz)}}{${pT(ne)}}=\frac{${szorzatT([A, C])}}{${szorzatT([B, C])}}=\frac{${A.t.replace(/^\((.*)\)$/, '$1')}}{${B.t.replace(/^\((.*)\)$/, '$1')}}\]`, T`(Kikötés: \(x\neq ${[...new Set(tilos([B, C]))].map(v => ft(F(Math.round(v * 60), 60))).join(T`,\ x\neq `)}\).)`] };
  } };

  /* ---------- szorzás, osztás ---------- */
  feladatok.szorzas = { nev: 'Szorzás, osztás', general() {
    for (let g = 0; g < 200; g++) {
      const [r1, r2, r3] = kulonbozo(3, -6, 6, [0]);
      const L1 = L(1, -r1), L2 = L(1, -r2), L3 = L(1, -r3);
      const m1 = M(R(1, 6), R(1, 2)), m2 = M(R(1, 6), R(1, 3));
      const oszt = R(0, 1) === 1;
      // szorzás: (L1·L2)/m1 · m2/(L2·L3);  osztás: (L1·L2)/m1 : (L2·L3)/m2
      const t1n = [L1, L2], t1d = [m1], t2n = oszt ? [L2, L3] : [m2], t2d = oszt ? [m2] : [L2, L3];
      const resN = [L1, m2], resD = [m1, L3];
      const x = joX([L1, L2, L3, M(1, 1)]);
      const v = F(ertekF(resN, x), ertekF(resD, x));
      if (Math.abs(v.n) > 500 || v.d > 200) continue;
      const fr = (n, d) => T`\frac{${pT(szorzat(n))}}{${pT(szorzat(d))}}`;
      const frF = (n, d) => T`\frac{${szorzatT(n)}}{${szorzatT(d)}}`;
      const kif = T`${fr(t1n, t1d)}${oszt ? ':' : T`\cdot `}${fr(t2n, t2d)}`;
      /* a két egytagú hányadosa egyszerűsítve: k2·x^e2 / (k1·x^e1) */
      const k = F(m2.p[m2.p.length - 1], m1.p[m1.p.length - 1]), e = (m2.p.length - 1) - (m1.p.length - 1);
      const fentM = tagT(k.n, e > 0 ? { x: e } : {}), lentM = tagT(k.d, e < 0 ? { x: -e } : {});
      const fent = (fentM === '1' ? '' : fentM === '-1' ? '-' : fentM) + L1.t, lent = (lentM === '1' ? '' : lentM) + L3.t;
      const bont = x => /^\([^()]*\)$/.test(x) ? x.slice(1, -1) : x;
      const ered = T`\frac{${bont(fent)}}{${bont(lent)}}`;
      return { kerdes: T`<p>Végezd el a műveletet, és egyszerűsíts! Mennyi az eredmény értéke, ha \(x=${x}\)?</p>\[${kif}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: oszt ? 'Törttel úgy osztunk, hogy az osztó reciprokával szorzunk. Előtte alakíts szorzattá, és egyszerűsíts!' : 'Alakítsd szorzattá a számlálókat és a nevezőket, egyszerűsíts, és csak utána szorozz!',
        megoldas: [T`\[${frF(t1n, t1d)}${oszt ? ':' : T`\cdot `}${frF(t2n, t2d)}=${ered}\]`, T`\(x=${x}\) esetén: \(${ft(v)}\).`] };
    }
  } };

  /* ---------- összeadás, kivonás ---------- */
  feladatok.osszeadas = { nev: 'Összeadás, kivonás', general() {
    const t = R(0, 2);
    if (t === 0) {   // a/(bx) ± c/(dx) ± e/(fx)
      const db = R(2, 3); const tagok = []; while (tagok.length < db) { const d = P([1, 2, 3, 4, 5, 6]), a = R(1, 9); if (gcd(a, d) > 1) continue; tagok.push([a * (tagok.length && R(0, 1) ? -1 : 1), d]); }
      const N = tagok.reduce((s, [, d]) => lkkt(s, d), 1);
      const szl = tagok.reduce((s, [a, d]) => s + a * N / d, 0);
      const kif = tagok.map(([a, d], i) => (i && a > 0 ? '+' : a < 0 ? '-' : '') + T`\frac{${Math.abs(a)}}{${d === 1 ? '' : d}x}`).join('');
      return { kerdes: T`<p>Hozd közös nevezőre, és vond össze! Mi kerül a négyzet helyére?</p>\[${kif}=\frac{\square}{${N === 1 ? '' : N}x}\]`, valasz: { ertekek: [szl] }, formatum: FMT9.egesz,
        tipp: 'A közös nevező a nevezők legkisebb közös többszöröse. Bővítsd ennek megfelelően a törteket!',
        megoldas: [T`\[${tagok.map(([a, d], i) => (i && a > 0 ? '+' : a < 0 ? '-' : '') + T`\frac{${Math.abs(a) * N / d}}{${N === 1 ? '' : N}x}`).join('')}=\frac{${szl}}{${N === 1 ? '' : N}x}\]`] };
    }
    const [p, q] = kulonbozo(2, -7, 7); const A = R0(-6, 6), B = R(1, 6); const s = P([1, -1]);
    // A/(x−p) ± B/(x−q) = ((A ± B)x − (Aq ± Bp)) / ((x−p)(x−q))
    const a1 = A + s * B, a0 = -(A * q + s * B * p);
    const kif = T`\frac{${A}}{${linT(1, -p)}}${s > 0 ? '+' : '-'}\frac{${B}}{${linT(1, -q)}}`;
    const nev = T`(${linT(1, -p)})(${linT(1, -q)})`;
    const mit = a1 === 0 ? 'c' : P(['a', 'c']);
    return { kerdes: T`<p>Hozd közös nevezőre, és vond össze! A számláló \(ax+c\) alakú lesz. Mennyi ${mit === 'a' ? T`az \(a\)` : T`a \(c\)`}?</p>\[${kif}=\frac{ax+c}{${nev}}\]`,
      valasz: { ertekek: [mit === 'a' ? a1 : a0] }, formatum: FMT9.egesz,
      tipp: T`A közös nevező \(${nev}\). Az első tört számlálóját \((${linT(1, -q)})\)-vel, a másodikét \((${linT(1, -p)})\)-vel kell szorozni.`,
      megoldas: [T`\[\frac{${A}(${linT(1, -q)})${s > 0 ? '+' : '-'}${B}(${linT(1, -p)})}{${nev}}=\frac{${pT([a0, a1])}}{${nev}}\]`, T`Tehát \(a=${a1}\) és \(c=${a0}\).`] };
  } };

  /* ---------- helyettesítés egyszerűsítés után ---------- */
  feladatok.ertek = { nev: 'Egyszerűsíts, majd helyettesíts!', general() {
    for (let g = 0; g < 200; g++) {
      const [p, q] = kulonbozo(2, -9, 9, [0]); const C = L(1, -p);
      const A = R(0, 1) ? Lp(R(1, 2), R0(-9, 9)) : M(R0(-5, 5), 0), B = R(0, 1) ? L(1, -q) : M(R(1, 6), R(1, 2));
      if (!A.t.startsWith('(') && !B.t.startsWith('(') ) continue;
      if (A.t.startsWith('(') && !B.t.startsWith('(') && gcd(A.p[1], gcd(A.p[0], B.p[B.p.length - 1])) > 1) continue;
      const x = P([F(1, 2), F(-1, 2), F(1, 3), F(3, 2), F(R(11, 99), 1)]);
      // x értéke tört vagy „nagy” egész: így megéri előbb egyszerűsíteni
      const ev = fs => fs.reduce((s, f) => M9.fmul(s, f.p.reduce((u, c, i) => M9.fsum(u, M9.fmul(c, fpow(x, i))), F(0))), F(1));
      const vb = ev([B]); if (vb.n === 0 || ev([C]).n === 0) continue;
      const v = M9.fdiv(ev([A]), vb); if (Math.abs(v.n) > 999 || v.d > 400) continue;
      const sz = szorzat([A, C]), ne = szorzat([B, C]);
      return { kerdes: T`<p>Számítsd ki a kifejezés értékét, ha \(x=${ft(x)}\)! (Érdemes előbb egyszerűsíteni.)</p>\[\frac{${pT(sz)}}{${pT(ne)}}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: 'Alakítsd szorzattá a számlálót és a nevezőt, egyszerűsíts, és csak utána helyettesíts!',
        megoldas: [T`\[\frac{${pT(sz)}}{${pT(ne)}}=\frac{${szorzatT([A, C])}}{${szorzatT([B, C])}}=\frac{${A.t.replace(/^\((.*)\)$/, '$1')}}{${B.t.replace(/^\((.*)\)$/, '$1')}}\]`, T`\(x=${ft(x)}\) esetén: \(${ft(v)}\).`] };
    }
  } };

  /* ---------- összetett törtek (emelt) ---------- */
  feladatok.osszetett = { nev: 'Összetett törtkifejezések', szint: 'emelt', general() {
    const t = R(0, 2); const a = R(t === 1 ? 2 : 1, 6);
    let tex, f, lep;   // f: az egyszerűsített alak kiértékelése
    if (t === 0) { tex = T`\frac{1+\frac{${a}}{x}}{1-\frac{${a * a}}{x^2}}`; f = x => F(x, x - a); lep = T`\[\frac{\frac{x+${a}}{x}}{\frac{x^2-${a * a}}{x^2}}=\frac{x+${a}}{x}\cdot\frac{x^2}{(x-${a})(x+${a})}=\frac{x}{x-${a}}\]`; }
    else if (t === 1) { tex = T`\left(\frac{x}{x-${a}}-1\right)\cdot\frac{x^2-${a * a}}{${a}}`; f = x => F(x + a); lep = T`\[\frac{x-(x-${a})}{x-${a}}\cdot\frac{(x-${a})(x+${a})}{${a}}=\frac{${a}}{x-${a}}\cdot\frac{(x-${a})(x+${a})}{${a}}=x+${a}\]`; }
    else { tex = T`\frac{x}{x-${a}}-\frac{x}{x+${a}}`; f = x => F(2 * a * x, x * x - a * a); lep = T`\[\frac{x(x+${a})-x(x-${a})}{(x-${a})(x+${a})}=\frac{${2 * a}x}{x^2-${a * a}}\]`; }
    let x; do { x = R(-9, 12); } while (x === 0 || Math.abs(x) === a);
    const v = f(x);
    return { kerdes: T`<p>Hozd egyszerűbb alakra, majd számítsd ki az értékét, ha \(x=${x}\)!</p>\[${tex}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
      tipp: 'Végezd el külön a zárójelekben (vagy a számlálóban és a nevezőben) lévő műveleteket, majd szorozz a reciprokkal, és egyszerűsíts!',
      megoldas: [lep, T`\(x=${x}\) esetén: \(${ft(v)}\).`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg8',
    cim: 'Műveletek algebrai törtekkel',
    rovid: 'Algebrai törtek',
    bevezeto: 'Algebrai törtek értelmezése, egyszerűsítése, szorzása, osztása, összeadása és kivonása – a szorzattá alakítás legfontosabb alkalmazása.',
    elmelet: T`<div class="prose"><p>Az <b>algebrai tört</b> olyan tört, amelynek számlálója és nevezője is algebrai kifejezés, pl. \(\frac{x^2-9}{x^2+3x}\).</p>
<ol><li><b>Kikötés:</b> a nevező nem lehet 0. Szorzattá alakítva látszik: \(x^2+3x=x(x+3)\neq0\iff x\neq0,\ x\neq-3\).</li>
<li><b>Egyszerűsítés:</b> szorzattá alakítunk, majd a <b>közös tényezővel</b> osztunk: \[\frac{x^2-9}{x^2+3x}=\frac{(x-3)(x+3)}{x(x+3)}=\frac{x-3}{x}\] Tagot nem lehet egyszerűsíteni: \(\frac{x+3}{x}\neq3\)!</li>
<li><b>Szorzás:</b> számlálót a számlálóval, nevezőt a nevezővel szorzunk (előtte érdemes egyszerűsíteni). <b>Osztás:</b> az osztó reciprokával szorzunk.</li>
<li><b>Összeadás, kivonás:</b> közös nevezőre hozunk (a nevezők legkisebb közös többszöröse), majd a számlálókat vonjuk össze: \[\frac{2}{x-1}-\frac{1}{x+1}=\frac{2(x+1)-(x-1)}{(x-1)(x+1)}=\frac{x+3}{x^2-1}\]</li></ol>
<p>Hasznos: \(b-a=-(a-b)\), ezért \(\frac{a-b}{b-a}=-1\).</p></div>`,
    igazHamis: [
      { allitas: T`\(\frac{x+3}{x}=3\) (\(x\neq0\))`, igaz: false, miert: 'Tagot nem lehet egyszerűsíteni, csak tényezőt.' },
      { allitas: T`\(\frac{x^2-1}{x-1}=x+1\), ha \(x\neq1\).`, igaz: true, miert: T`\(x^2-1=(x-1)(x+1)\).` },
      { allitas: T`\(\frac{a-b}{b-a}=-1\), ha \(a\neq b\).`, igaz: true, miert: T`\(b-a=-(a-b)\).` },
      { allitas: T`\(\frac1a+\frac1b=\frac{2}{a+b}\)`, igaz: false, miert: T`\(\frac1a+\frac1b=\frac{a+b}{ab}\). Pl. \(a=b=1\): \(2\neq1\).` },
      { allitas: T`\(\frac{1}{a}+\frac{1}{b}=\frac{a+b}{ab}\) (\(a,b\neq0\))`, igaz: true, miert: 'Közös nevező: ab.' },
      { allitas: T`Az \(\frac{x}{x^2-4}\) tört az \(x=0\) helyen nem értelmezhető.`, igaz: false, miert: T`A nevező \(x=\pm2\)-nél 0; \(x=0\)-nál a tört értéke 0.` },
      { allitas: T`Az \(\frac{x+2}{x^2-4}\) és az \(\frac{1}{x-2}\) kifejezés értelmezési tartománya ugyanaz.`, igaz: false, miert: T`Az első \(x=-2\)-nél sem értelmezhető, a második igen.` },
      { allitas: T`\(\frac{a}{b}:\frac{c}{d}=\frac{ad}{bc}\) (\(b,c,d\neq0\))`, igaz: true, miert: 'Az osztó reciprokával szorzunk.' },
      { allitas: T`\(\frac{2x}{3}\cdot\frac{6}{x^2}=\frac{4}{x}\) (\(x\neq0\))`, igaz: true, miert: T`\(\frac{12x}{3x^2}=\frac{4}{x}\).` },
      { allitas: T`\(\frac{x^2+4}{x+2}=x+2\)`, igaz: false, miert: T`\(x^2+4\) nem szorzattá alakítható így; \((x+2)^2=x^2+4x+4\).` },
      { allitas: T`\(\frac{3}{x}-\frac{1}{x}=\frac{2}{x}\) (\(x\neq0\))`, igaz: true, miert: 'Azonos nevezőnél a számlálókat vonjuk ki.' },
      { allitas: T`\(\frac{3}{x}-\frac{1}{x}=\frac{2}{0}\)`, igaz: false, miert: 'A nevezőket nem vonjuk ki egymásból.' },
      { general() { const p = R(1, 9); const jo = R(0, 1) === 1;
        return { allitas: T`\(\frac{x^2-${p * p}}{x+${p}}=x${jo ? '-' : '+'}${p}\), ha \(x\neq-${p}\).`, igaz: jo, miert: T`\(x^2-${p * p}=(x-${p})(x+${p})\), így az eredmény \(x-${p}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Végezzük el a műveletet: \(\dfrac{x^2-4}{3x}\cdot\dfrac{6x^2}{x+2}\)`,
      lepesek: [T`Kikötés: \(x\neq0\), \(x\neq-2\).`, T`Szorzattá alakítunk: \(x^2-4=(x-2)(x+2)\).`, T`\[\frac{(x-2)(x+2)}{3x}\cdot\frac{6x^2}{x+2}\]`, T`Egyszerűsítünk \((x+2)\)-vel és \(3x\)-szel: \[2x(x-2)=2x^2-4x\]`]
    },
    feladatok
  }));
})();
