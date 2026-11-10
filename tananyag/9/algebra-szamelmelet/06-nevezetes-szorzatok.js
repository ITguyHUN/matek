/*
 * II. Algebra és számelmélet / 6. Nevezetes szorzatok
 * (Sokszínű matematika 9., II/6. lecke; FGY 1153–1160, 1188–1192; OH Matematika 9., 31–32. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, kulonbozo, tagT, tagokT, pAdd, pScale, pMul, pPow, pEval, pT, linT, zj, zjn, fmul, FMT9 } = M9;
  const feladatok = {};
  const el0 = c => c === 0 ? '' : (c > 0 ? '+' : '-') + Math.abs(c);

  /* két tag: [együttható, változórész] → TeX; a változórész objektum, pl. { x: 2 } */
  const tag = (c, v) => tagT(c, v);
  const szorozV = (v1, v2) => { const o = {}; [v1, v2].forEach(v => Object.entries(v).forEach(([b, e]) => { o[b] = (o[b] || 0) + e; })); return o; };
  const vkulcs = v => Object.entries(v).filter(([, e]) => e).sort().map(([b, e]) => b + e).join('') || '1';
  /* két tagú kifejezés hatványa / szorzata tagonként: [[c, vars], …] → összevont tagok */
  function osszevon(tagok) { const m = new Map(); tagok.forEach(([c, v]) => { const k = vkulcs(v); const r = m.get(k); if (r) r[0] = M9.fsum(r[0], c); else m.set(k, [M9.toF(c), v]); }); return [...m.values()].filter(([c]) => c.n !== 0); }
  const fokTag = ([, v]) => -Object.values(v).reduce((s, e) => s + e, 0);
  const ossT = tagok => tagokT(tagok.slice().sort((a, b) => fokTag(a) - fokTag(b)).map(([c, v]) => [c.d === 1 ? c.n : c, v]));
  const VAR = () => P([['x', 'y'], ['a', 'b'], ['x', 'y']]);
  /* egy véletlen „tag”: együttható + változó(k) */
  function veltag(betu, maxc = 6, maxe = 1) { const c = R(1, maxc); const v = betu ? { [betu]: R(1, maxe) } : {}; return [c, v]; }

  /* ---------- (a ± b)² ---------- */
  feladatok.negyzet = { nev: 'Kéttagú kifejezés négyzete', general() {
    const [u, w] = VAR(); const t = R(0, 3); let A, B;
    if (t === 0) { A = [R(1, 5), { [u]: 1 }]; B = [R(1, 9), {}]; }
    else if (t === 1) { A = [R(1, 6), { [u]: 1 }]; B = [R(1, 6), { [w]: 1 }]; }
    else if (t === 2) { A = [R(1, 4), { [u]: R(2, 3) }]; B = [R(1, 5), { [w]: R(1, 2) }]; }
    else { A = [F(R(1, 3), P([2, 3, 4])), { [u]: 1 }]; B = [F(1, P([2, 3, 4])), {}]; if (fv(A[0]) === 1) A[0] = F(2, 3); }
    const s = P([1, -1]); B = [fmul(B[0], s), B[1]];
    const tagok = osszevon([[fmul(A[0], A[0]), szorozV(A[1], A[1])], [fmul(2, fmul(A[0], B[0])), szorozV(A[1], B[1])], [fmul(B[0], B[0]), szorozV(B[1], B[1])]]);
    const kozep = tagok[1]; const melyik = R(0, 3) ? 1 : P([0, 2]); const kerd = tagok[melyik];
    const kerdT = Object.keys(kerd[1]).length ? T`ennek a tagnak az együtthatója: \(${valtT(kerd[1])}\)` : 'a konstans tag';
    const kif = T`\left(${tag(A[0], A[1])}${s > 0 ? '+' : '-'}${tag(M9.toF(Math.abs(fv(B[0])) === fv(B[0]) ? B[0] : F(-B[0].n, B[0].d)), B[1])}\right)^2`;
    return { kerdes: T`<p>Végezd el a négyzetre emelést! Mennyi lesz az eredményben ${kerdT}?</p>\[${kif}\]`, valasz: { ertekek: [fv(kerd[0])] }, formatum: FMT9.tort,
      tipp: T`\((a+b)^2=a^2+2ab+b^2\) és \((a-b)^2=a^2-2ab+b^2\). Ne felejtsd el a kétszeres szorzatot!`,
      megoldas: [T`\[${kif}=${ossT(tagok)}\]`, T`A kétszeres szorzat: \(2\cdot ${zj(A[0])}\cdot ${zj(B[0])}=${ft(kozep[0])}\).`] };
  } };
  const valtT = v => M9.valtozoT(v);

  /* ---------- (a + b)(a − b) ---------- */
  feladatok.kulonbseg = { nev: 'Összeg és különbség szorzata', general() {
    const [u, w] = VAR(); const t = R(0, 2);
    let A = [R(1, 9), { [u]: t === 2 ? R(2, 3) : 1 }], B = t === 0 ? [R(1, 9), {}] : [R(1, 9), { [w]: R(1, 2) }];
    const forditott = R(0, 2) === 0;   // (b + a)(b − a) helyett (a + b)(b − a)
    const AT = tag(A[0], A[1]), BT = tag(B[0], B[1]);
    const kif = forditott ? T`(${AT}+${BT})(${BT}-${AT})` : (R(0, 1) ? T`(${AT}+${BT})(${AT}-${BT})` : T`(${AT}-${BT})(${AT}+${BT})`);
    const elso = forditott ? B : A, masik = forditott ? A : B;
    const t1 = [elso[0] * elso[0], szorozV(elso[1], elso[1])], t2 = [-masik[0] * masik[0], szorozV(masik[1], masik[1])];
    const kerd = R(0, 1) ? t1 : t2;
    const nev = Object.keys(kerd[1]).length ? T`ennek a tagnak az együtthatója: \(${valtT(kerd[1])}\)` : 'a konstans tag';
    return { kerdes: T`<p>Végezd el a szorzást! Mennyi lesz az eredményben ${nev}?</p>\[${kif}\]`, valasz: { ertekek: [kerd[0]] }, formatum: FMT9.egesz,
      tipp: T`\((a+b)(a-b)=a^2-b^2\). Figyeld meg, melyik tag áll a különbségben elöl – az lesz az \(a\)!`,
      megoldas: [T`\[${kif}=${tagokT([t1, t2])}\]`] };
  } };

  /* ---------- (a ± b)³ ---------- */
  feladatok.kob = { nev: 'Kéttagú kifejezés köbe', general() {
    const v = P(['x', 'y', 't']); const a = R(1, 3), b = R0(-4, 4);
    const p = pPow([b, a], 3); const e = R(0, 3); const kerdT = e === 0 ? 'a konstans tag' : T`ennek a tagnak az együtthatója: \(${tagT(1, { [v]: e })}\)`;
    const kif = T`(${linT(a, b, v)})^3`;
    return { kerdes: T`<p>Végezd el a köbre emelést! Mennyi lesz az eredményben ${kerdT}?</p>\[${kif}\]`, valasz: { ertekek: [p[e]] }, formatum: FMT9.egesz,
      tipp: T`\((a+b)^3=a^3+3a^2b+3ab^2+b^3\) és \((a-b)^3=a^3-3a^2b+3ab^2-b^3\).`,
      megoldas: [T`\(a=${tagT(a, { [v]: 1 })}\), \(b=${b}\):`, T`\[${kif}=${a === 1 ? v : T`(${a}${v})`}^3+3\cdot ${a === 1 ? v : T`(${a}${v})`}^2\cdot ${zjn(b)}+3\cdot ${tagT(a, { [v]: 1 })}\cdot ${zjn(b)}^2+${zjn(b)}^3=${pT(p, v)}\]`] };
  } };

  /* ---------- hiányzó tag (teljes négyzet) ---------- */
  feladatok.hianyzo = { nev: 'Mi hiányzik?', general() {
    const v = P(['x', 'a', 'y']); const p = R(1, 6), q = R0(-9, 9);
    const A = p * p, B = 2 * p * q, C = q * q; const h = R(0, 4);
    const xT = (k, kit) => { const s = k < 0 ? '-' : '+'; return s + (Math.abs(k) === 1 ? '' : Math.abs(k)) + v + (kit === 2 ? '^2' : ''); };
    const pT2 = k => (k === 1 ? '' : k) + v;
    let bal, jobb, ans;
    const jobbAlap = T`\left(${pT2(p)}${el0(q)}\right)^2`;
    if (h === 0) { bal = T`${A === 1 ? '' : A}${v}^2${xT(B, 1)}+\square`; jobb = jobbAlap; ans = C; }
    else if (h === 1) { bal = T`${A === 1 ? '' : A}${v}^2${B < 0 ? '-' : '+'}\square ${v}+${C}`; jobb = jobbAlap; ans = Math.abs(B); }
    else if (h === 2) { bal = T`\square\, ${v}^2${xT(B, 1)}+${C}`; jobb = jobbAlap; ans = A; }
    else if (h === 3) { bal = T`${A === 1 ? '' : A}${v}^2${xT(B, 1)}+${C}`; jobb = T`\left(${pT2(p)}${q < 0 ? '-' : '+'}\square\right)^2`; ans = Math.abs(q); }
    else { bal = T`${A === 1 ? '' : A}${v}^2${xT(B, 1)}+${C}`; jobb = T`\left(\square\, ${v}${el0(q)}\right)^2`; ans = p; }
    return { kerdes: T`<p>Mi kerül a négyzet helyére, hogy azonosságot kapjunk? (Pozitív számot írj!)</p>\[${bal}=${jobb}\]`, valasz: { ertekek: [ans] }, formatum: FMT9.egesz,
      tipp: T`\((a\pm b)^2=a^2\pm2ab+b^2\): a középső tag a két tag szorzatának kétszerese.`,
      megoldas: [T`\[${jobbAlap}=${A === 1 ? '' : A}${v}^2${xT(B, 1)}+${C}\]`, T`A hiányzó szám: \(${ans}\).`] };
  } };

  /* ---------- összetett kifejezések ---------- */
  feladatok.osszetett = { nev: 'Összetett kifejezések', general() {
    const v = P(['x', 'a', 'c']); const db = R(2, 3); let p = [0]; const reszek = [];
    const fajtak = ['n+', 'n-', 'k', 'n+'];
    for (let i = 0; i < db; i++) {
      const f = P(fajtak); const a = R(1, 5), b = R(1, 6); const s = i === 0 ? 1 : P([1, -1]); const m = R(0, 3) === 0 ? R(2, 3) : 1;
      let q, tx;
      if (f === 'n+') { q = pPow([b, a], 2); tx = T`(${linT(a, b, v)})^2`; }
      else if (f === 'n-') { q = pPow([-b, a], 2); tx = T`(${linT(a, -b, v)})^2`; }
      else { q = pMul([b, a], [-b, a]); tx = T`(${linT(a, b, v)})(${linT(a, -b, v)})`; }
      p = pAdd(p, pScale(q, s * m));
      reszek.push((i === 0 ? '' : (s > 0 ? '+' : '-')) + (m > 1 ? T`${m}\cdot ` : '') + tx);
    }
    const kif = reszek.join('');
    if (R(0, 2) === 0) { const x = R0(-3, 3); const er = pEval(p, x);
      return { kerdes: T`<p>Hozd egyszerűbb alakra a nevezetes szorzatok segítségével, majd számítsd ki az értékét, ha \(${v}=${x}\)!</p>\[${kif}\]`, valasz: { ertekek: [er] }, formatum: FMT9.egesz,
        tipp: 'Bontsd ki a nevezetes szorzatokat, figyelj a kivonásra (zárójelbe tedd a kifejtett alakot!), vond össze, és csak a végén helyettesíts.',
        megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`\(${v}=${x}\) esetén: \(${er}\).`] }; }
    const e = R(0, M9.pDeg(p)); const kerdT = e === 0 ? 'a konstans tag' : T`ennek a tagnak az együtthatója: \(${tagT(1, { [v]: e })}\)`;
    return { kerdes: T`<p>Hozd egyszerűbb alakra a nevezetes szorzatok segítségével! Mennyi lesz ${kerdT}?</p>\[${kif}\]`, valasz: { ertekek: [p[e] || 0] }, formatum: FMT9.egesz,
      tipp: 'A kivonandó nevezetes szorzat kifejtett alakját tedd zárójelbe, és úgy bontsd fel: minden tag előjele megfordul!',
      megoldas: [T`\[${kif}=${pT(p, v)}\]`] };
  } };

  /* ---------- ügyes számolás ---------- */
  feladatok.fejszamolas = { nev: 'Ügyes számolás', general() {
    const t = R(0, 4);
    if (t === 0) { const k = P([10, 100, 1000, 10000, 50, 20, 30, 40, 60]); const d = R(1, k >= 100 ? 9 : 4);
      return { kerdes: T`<p>Számítsd ki ügyesen, számológép nélkül!</p>\[${k - d}\cdot ${k + d}\]`, valasz: { ertekek: [k * k - d * d] }, formatum: FMT9.egesz,
        tipp: T`\((a-b)(a+b)=a^2-b^2\)`, megoldas: [T`\[(${k}-${d})(${k}+${d})=${k}^2-${d}^2=${k * k}-${d * d}=${k * k - d * d}\]`] }; }
    if (t === 1) { const k = P([10, 20, 30, 50, 100, 1000]); const d = R0(-3, 3); const n = k + d;
      return { kerdes: T`<p>Számítsd ki ügyesen, számológép nélkül!</p>\[${n}^2\]`, valasz: { ertekek: [n * n] }, formatum: FMT9.egesz,
        tipp: T`Írd fel a számot \(${k}${el0(d)}\) alakban, és használd az \((a\pm b)^2\) azonosságot!`,
        megoldas: [T`\[(${k}${el0(d)})^2=${k}^2${d > 0 ? '+' : '-'}2\cdot ${k}\cdot ${Math.abs(d)}+${Math.abs(d)}^2=${k * k}${d > 0 ? '+' : '-'}${2 * k * Math.abs(d)}+${d * d}=${n * n}\]`] }; }
    if (t === 2) { const [a, b] = kulonbozo(2, 11, 99).sort((x, y) => y - x); const [c, d] = [a + R(5, 300), b + R(1, 99)];
      const sz = (a - b) * (a + b), ne = (c - d) * (c + d); if (ne === 0 || sz === 0) return this.general(); const v = F(sz, ne);
      return { kerdes: T`<p>Számítsd ki ügyesen, számológép nélkül! (Az eredményt egyszerűsített törtként add meg.)</p>\[\frac{${a}^2-${b}^2}{${c}^2-${d}^2}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: T`Alakítsd szorzattá a számlálót és a nevezőt is: \(a^2-b^2=(a-b)(a+b)\).`,
        megoldas: [T`\[\frac{(${a}-${b})(${a}+${b})}{(${c}-${d})(${c}+${d})}=\frac{${a - b}\cdot ${a + b}}{${c - d}\cdot ${c + d}}=${ft(v)}\]`] }; }
    if (t === 3) { const n = P([25, 35, 45, 55, 65, 75, 85, 95, 105, 115]); const k = Math.floor(n / 10);
      return { kerdes: T`<p>Számítsd ki ügyesen, számológép nélkül!</p>\[${n}^2\]`, valasz: { ertekek: [n * n] }, formatum: FMT9.egesz,
        tipp: T`\((10k+5)^2=100k(k+1)+25\)`, megoldas: [T`\[(${10 * k}+5)^2=${10 * k}^2+2\cdot ${10 * k}\cdot 5+25=${100 * k * k}+${100 * k}+25=${n * n}\]`] }; }
    const a = R(31, 99), b = R(11, a - 5);
    return { kerdes: T`<p>Számítsd ki ügyesen, számológép nélkül!</p>\[${a}^2-${b}^2\]`, valasz: { ertekek: [a * a - b * b] }, formatum: FMT9.egesz,
      tipp: T`\(a^2-b^2=(a-b)(a+b)\)`, megoldas: [T`\[(${a}-${b})(${a}+${b})=${a - b}\cdot ${a + b}=${a * a - b * b}\]`] };
  } };

  /* ---------- a + b és ab ismeretében (emelt) ---------- */
  feladatok.trukk = { nev: 'Számolás a + b és ab ismeretében', szint: 'emelt', general() {
    const t = R(0, 4); let x0, y0; do { [x0, y0] = [R(-9, 9), R(-9, 9)]; } while (x0 === 0 || y0 === 0 || x0 + y0 === 0);
    const s = x0 + y0, p = x0 * y0;   // valós a, b létezik: a = x0, b = y0
    if (t === 0) return { kerdes: T`<p>Tudjuk, hogy \(a+b=${s}\) és \(a\cdot b=${p}\). Mennyi \(a^2+b^2\)?</p>`, valasz: { ertekek: [s * s - 2 * p] }, formatum: FMT9.egesz,
      tipp: T`\((a+b)^2=a^2+2ab+b^2\), ebből fejezd ki \(a^2+b^2\)-et!`, megoldas: [T`\[a^2+b^2=(a+b)^2-2ab=${zjn(s)}^2-2\cdot ${zjn(p)}=${s * s - 2 * p}\]`] };
    if (t === 1) return { kerdes: T`<p>Tudjuk, hogy \(a+b=${s}\) és \(a\cdot b=${p}\). Mennyi \((a-b)^2\)?</p>`, valasz: { ertekek: [s * s - 4 * p] }, formatum: FMT9.egesz,
      tipp: T`\((a-b)^2=a^2-2ab+b^2=(a+b)^2-4ab\)`, megoldas: [T`\[(a-b)^2=(a+b)^2-4ab=${zjn(s)}^2-4\cdot ${zjn(p)}=${s * s - 4 * p}\]`] };
    if (t === 2) { const [s2, p2] = (() => { let u, w; do { [u, w] = [R(-5, 5), R(-5, 5)]; } while (u === 0 || w === 0 || u + w === 0); return [u + w, u * w]; })(); return { kerdes: T`<p>Tudjuk, hogy \(a+b=${s2}\) és \(a\cdot b=${p2}\). Mennyi \(a^3+b^3\)?</p>`, valasz: { ertekek: [s2 ** 3 - 3 * p2 * s2] }, formatum: FMT9.egesz,
      tipp: T`\((a+b)^3=a^3+b^3+3ab(a+b)\)`, megoldas: [T`\[a^3+b^3=(a+b)^3-3ab(a+b)=${zjn(s2)}^3-3\cdot ${zjn(p2)}\cdot ${zjn(s2)}=${s2 ** 3 - 3 * p2 * s2}\]`] }; }
    if (t === 3) { const d = x0 - y0 || 2, q = x0 * y0; if (Math.abs(d) > 9) return this.general(); return { kerdes: T`<p>Két szám különbsége \(a-b=${d}\), a szorzatuk \(a\cdot b=${q}\). Mennyi a köbeik különbsége, \(a^3-b^3\)?</p>`, valasz: { ertekek: [d ** 3 + 3 * q * d] }, formatum: FMT9.egesz,
      tipp: T`\((a-b)^3=a^3-b^3-3ab(a-b)\)`, megoldas: [T`\[a^3-b^3=(a-b)^3+3ab(a-b)=${zjn(d)}^3+3\cdot ${zjn(q)}\cdot ${zjn(d)}=${d ** 3 + 3 * q * d}\]`] }; }
    const d = x0 - y0; if (d === 0 || Math.abs(d) > 12) return this.general(); return { kerdes: T`<p>Tudjuk, hogy \(a-b=${d}\) és \(a\cdot b=${p}\). Mennyi \(a^2+b^2\)?</p>`, valasz: { ertekek: [d * d + 2 * p] }, formatum: FMT9.egesz,
      tipp: T`\((a-b)^2=a^2-2ab+b^2\)`, megoldas: [T`\[a^2+b^2=(a-b)^2+2ab=${zjn(d)}^2+2\cdot ${zjn(p)}=${d * d + 2 * p}\]`] };
  } };

  /* ---------- teljes négyzetté alakítás ---------- */
  feladatok.teljesNegyzet = { nev: 'Teljes négyzetté alakítás', general() {
    const a = R(0, 3) ? 1 : P([2, 3, -1]); const u = R0(-6, 6), v = R(-12, 12);
    const p = [a * u * u + v, -2 * a * u, a];   // a(x−u)² + v
    const mit = R(0, 2) ? 'v' : 'u';
    const alak = a === 1 ? T`(x-u)^2+v` : T`${a === -1 ? '-' : a}(x-u)^2+v`;
    return { kerdes: T`<p>Alakítsd \(${alak}\) alakra a kifejezést! Mennyi ${mit === 'v' ? T`a \(v\)` : T`az \(u\)`}?</p>\[${pT(p)}\]`, valasz: { ertekek: [mit === 'v' ? v : u] }, formatum: FMT9.egesz,
      tipp: a === 1 ? T`Az \(x\) együtthatójának a fele adja a zárójelben a számot: \(x^2${el0(-2 * u)}x=(x${el0(-u)})^2-${u * u}\).` : T`Először emeld ki ${a === -1 ? T`a \(-1\)-et` : T`a ${a}-${a === 2 ? 't' : 'at'}`} az első két tagból!`,
      megoldas: [a === 1 ? T`\[x^2${el0(-2 * u)}x${el0(u * u + v)}=(x${el0(-u)})^2-${u * u}${el0(u * u + v)}=(x${el0(-u)})^2${el0(v)}\]` : T`\[${pT(p)}=${a === -1 ? '-' : a}\left(x^2${el0(-2 * u)}x\right)${el0(a * u * u + v)}=${a === -1 ? '-' : a}\left((x${el0(-u)})^2-${u * u}\right)${el0(a * u * u + v)}=${a === -1 ? '-' : a}(x${el0(-u)})^2${el0(v)}\]`,
        T`Tehát \(u=${u}\) és \(v=${v}\).`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg6',
    cim: 'Nevezetes szorzatok',
    rovid: 'Nevezetes szorzatok',
    bevezeto: 'Kéttagú kifejezések négyzete és köbe, összeg és különbség szorzata; alkalmazásuk fejszámolásban és teljes négyzetté alakításban.',
    elmelet: T`<div class="tbl"><table><tr><th>Azonosság</th><th>Példa</th></tr>
<tr><td>\((a+b)^2=a^2+2ab+b^2\)</td><td>\((x+3)^2=x^2+6x+9\)</td></tr>
<tr><td>\((a-b)^2=a^2-2ab+b^2\)</td><td>\((2x-5)^2=4x^2-20x+25\)</td></tr>
<tr><td>\((a+b)(a-b)=a^2-b^2\)</td><td>\((3a+4)(3a-4)=9a^2-16\)</td></tr>
<tr><td>\((a+b)^3=a^3+3a^2b+3ab^2+b^3\)</td><td>\((x+1)^3=x^3+3x^2+3x+1\)</td></tr>
<tr><td>\((a-b)^3=a^3-3a^2b+3ab^2-b^3\)</td><td>\((x-2)^3=x^3-6x^2+12x-8\)</td></tr></table></div>
<div class="prose"><ul><li><b>Gyakori hiba:</b> \((a+b)^2\neq a^2+b^2\) – a kétszeres szorzat (\(2ab\)) nem maradhat el!</li>
<li><b>Fejszámolás:</b> \(98\cdot102=100^2-2^2=9996\); \(\;103^2=100^2+2\cdot100\cdot3+9=10\,609\).</li>
<li><b>Teljes négyzetté alakítás:</b> \(x^2-8x+20=(x-4)^2-16+20=(x-4)^2+4\).</li>
<li>Ha \(a+b\) és \(ab\) ismert: \(a^2+b^2=(a+b)^2-2ab\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\((a+b)^2=a^2+b^2\)`, igaz: false, miert: T`Hiányzik a \(2ab\) tag.` },
      { allitas: T`\((x-3)^2=x^2-6x+9\)`, igaz: true, miert: T`\(2\cdot x\cdot3=6x\), és \((-3)^2=9\).` },
      { allitas: T`\((x-3)^2=x^2-6x-9\)`, igaz: false, miert: T`\((-3)^2=+9\).` },
      { allitas: T`\((2x+5)(2x-5)=4x^2-25\)`, igaz: true, miert: T`\((2x)^2-5^2\).` },
      { allitas: T`\((2x+5)(5-2x)=4x^2-25\)`, igaz: false, miert: T`\((5+2x)(5-2x)=25-4x^2\).` },
      { allitas: T`\((a-b)^2=(b-a)^2\)`, igaz: true, miert: T`\(b-a=-(a-b)\), és az ellentett négyzete ugyanaz.` },
      { allitas: T`\((a-b)^3=(b-a)^3\)`, igaz: false, miert: T`\((b-a)^3=-(a-b)^3\).` },
      { allitas: T`\(99\cdot101=9999\)`, igaz: true, miert: T`\(100^2-1^2=9999\).` },
      { allitas: T`\((x+1)^3=x^3+1\)`, igaz: false, miert: T`\((x+1)^3=x^3+3x^2+3x+1\).` },
      { allitas: T`\(x^2+10x+25=(x+5)^2\)`, igaz: true, miert: T`\(2\cdot x\cdot5=10x\), \(5^2=25\).` },
      { allitas: T`\(x^2+6x+4=(x+2)^2\)`, igaz: false, miert: T`\((x+2)^2=x^2+4x+4\).` },
      { allitas: T`\(x^2-8x+20=(x-4)^2+4\)`, igaz: true, miert: T`\((x-4)^2=x^2-8x+16\), és \(16+4=20\).` },
      { allitas: T`Ha \(a+b=5\) és \(ab=6\), akkor \(a^2+b^2=13\).`, igaz: true, miert: T`\(25-2\cdot6=13\).` },
      { general() { const a = R(1, 5), b = R(1, 9), s = P([1, -1]); const jo = 2 * a * b * s; const mut = R(0, 1) ? jo : a * b * s;
        return { allitas: T`\((${a === 1 ? '' : a}x${s > 0 ? '+' : '-'}${b})^2=${a * a === 1 ? '' : a * a}x^2${mut > 0 ? '+' : '-'}${Math.abs(mut)}x+${b * b}\)`, igaz: mut === jo, miert: T`A kétszeres szorzat: \(2\cdot ${a === 1 ? '' : a}x\cdot ${b}=${2 * a * b}x\).` }; } }
    ],
    mintapelda: {
      feladat: T`Hozzuk egyszerűbb alakra: \((3a-1)^2-(2a+3)(2a-3)+(a+2)^2\)`,
      lepesek: [T`\((3a-1)^2=9a^2-6a+1\)`, T`\((2a+3)(2a-3)=4a^2-9\) – ezt kivonjuk, ezért zárójelbe tesszük: \(-(4a^2-9)=-4a^2+9\).`, T`\((a+2)^2=a^2+4a+4\)`, T`Összevonva: \[9a^2-6a+1-4a^2+9+a^2+4a+4=6a^2-2a+14\]`]
    },
    feladatok
  }));
})();
