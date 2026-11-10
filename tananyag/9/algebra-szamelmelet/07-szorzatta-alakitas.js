/*
 * II. Algebra és számelmélet / 7. A szorzattá alakítás módszerei
 * (Sokszínű matematika 9., II/7. lecke; FGY 1161–1171; OH Matematika 9., 33–34. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, keverd, kulonbozo, tagT, tagokT, valtozoT, pMul, pScale, pT, linT, zjn, FMT9 } = M9;
  const feladatok = {};
  const el0 = c => c === 0 ? '' : (c > 0 ? '+' : '-') + Math.abs(c);
  const xT = (k, v) => k === 0 ? '' : (k > 0 ? '+' : '-') + (Math.abs(k) === 1 ? '' : Math.abs(k)) + v;
  const negyzetSzam = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];

  /* ---------- kiemelés ---------- */
  feladatok.kiemeles = { nev: 'Kiemelés', general() {
    const ketValt = R(0, 1) === 1; const [u, w] = P([['x', 'y'], ['a', 'b']]);
    for (let g = 0; g < 200; g++) {
      const k = R(2, 9); const n = R(2, 3);
      const bels = []; for (let i = 0; i < n; i++) { const c = R0(-7, 7); const v = { [u]: R(0, 3) }; if (ketValt) v[w] = R(0, 3); bels.push([c, v]); }
      // a zárójelben lévő tagok legyenek különbözők, és ne legyen közös tényezőjük
      const kul = new Set(bels.map(([, v]) => valtozoT(v))); if (kul.size < n) continue;
      if (bels.reduce((s, [c]) => gcd(s, c), 0) !== 1) continue;
      if (Math.min(...bels.map(([, v]) => v[u])) !== 0) continue;
      if (ketValt && Math.min(...bels.map(([, v]) => v[w])) !== 0) continue;
      bels.sort((A, B) => (B[1][u] - A[1][u]) || ((B[1][w] || 0) - (A[1][w] || 0)));
      if (bels[0][0] < 0) bels.forEach(t => { t[0] = -t[0]; });
      const ku = R(1, 3), kw = ketValt ? R(1, 2) : 0;
      const kiem = ketValt ? { [u]: ku, [w]: kw } : { [u]: ku };
      const teljes = bels.map(([c, v]) => [c * k, { [u]: v[u] + ku, ...(ketValt ? { [w]: v[w] + kw } : {}) }]);
      const kif = tagokT(teljes); const belsT = tagokT(bels);
      const mit = R(0, 3);
      let jobb, ans;
      if (mit === 0) { jobb = T`\square\, ${valtozoT(kiem)}\left(${belsT}\right)`; ans = k; }
      else if (mit === 1) { jobb = T`${k}${u}^{\square}${ketValt ? valtozoT({ [w]: kw }) : ''}\left(${belsT}\right)`; ans = ku; }
      else { const i = R(1, n - 1); const c = bels[i][0]; const hely = tagokT(bels.map(([cc, v], j) => j === i ? (Object.values(v).some(e => e) ? T`${cc < 0 ? '-' : '+'}\square\, ${valtozoT(v)}` : T`${cc < 0 ? '-' : '+'}\square`) : [cc, v])).replace('++', '+');
        jobb = T`${tagT(k, kiem)}\left(${hely}\right)`; ans = Math.abs(c); }
      return { kerdes: T`<p>Emeld ki a legnagyobb közös tényezőt! Mi kerül a négyzet helyére? (Pozitív számot írj!)</p>\[${kif}=${jobb}\]`, valasz: { ertekek: [ans] }, formatum: FMT9.egesz,
        tipp: 'Kiemeléskor az együtthatók legnagyobb közös osztóját és minden változónak a legkisebb előforduló kitevőjű hatványát emeljük ki.',
        megoldas: [T`A közös tényező: \(${tagT(k, kiem)}\).`, T`\[${kif}=${tagT(k, kiem)}\left(${belsT}\right)\]`] };
    }
  } };

  /* ---------- csoportosítás ---------- */
  feladatok.csoportositas = { nev: 'Csoportosítás', general() {
    const [u, w] = P([['a', 'b'], ['x', 'y'], ['a', 'x']]); const k = P([1, 1, 2, 3]), m = P([1, 1, 2]);
    const p = R0(-7, 7), q = R0(-7, 7);
    // (k·u + p)(m·w + q) = km·uw + kq·u + pm·w + pq
    const tagok = keverd([[k * m, { [u]: 1, [w]: 1 }], [k * q, { [u]: 1 }], [p * m, { [w]: 1 }], [p * q, {}]]);
    const kif = tagokT(tagok);
    const mit = P(['p', 'q']);
    const alak = T`(${k === 1 ? '' : k}${u}+p)(${m === 1 ? '' : m}${w}+q)`;
    return { kerdes: T`<p>Alakítsd szorzattá csoportosítással! Az eredményt \(${alak}\) alakban írva mennyi ${mit === 'p' ? T`a \(p\)` : T`a \(q\)`}?</p>\[${kif}\]`,
      valasz: { ertekek: [mit === 'p' ? p : q] }, formatum: FMT9.egesz,
      tipp: T`Csoportosítsd a tagokat úgy, hogy mindkét csoportból ugyanaz a kéttagú kifejezés legyen kiemelhető! Pl. \(ab+3b-2a-6=b(a+3)-2(a+3)\).`,
      megoldas: [T`\[${tagokT([[k * m, { [u]: 1, [w]: 1 }], [p * m, { [w]: 1 }], [k * q, { [u]: 1 }], [p * q, {}]])}=${m === 1 ? '' : m}${w}(${linT(k, p, u)})${q > 0 ? '+' : '-'}${Math.abs(q)}(${linT(k, p, u)})\]`, T`\[=(${linT(k, p, u)})(${linT(m, q, w)})\]`, T`Tehát \(p=${p}\) és \(q=${q}\).`] };
  } };

  /* ---------- nevezetes szorzatok visszafelé ---------- */
  feladatok.nevezetes = { nev: 'Nevezetes szorzatokkal', general() {
    const v = P(['x', 'a', 'y']); const t = R(0, 5);
    const a = R(1, 7), b = R(1, 11); const aT = (a === 1 ? '' : a) + v;
    if (t <= 1) { const kerd = R(0, 1) ? 'a' : 'b';
      const jobb = kerd === 'a' ? T`(\square\,${v}-${b})(\square\,${v}+${b})` : T`(${aT}-\square)(${aT}+\square)`;
      return { kerdes: T`<p>Alakítsd szorzattá! Mi kerül a négyzetek helyére (mindkét helyre ugyanaz)?</p>\[${a * a === 1 ? '' : a * a}${v}^2-${b * b}=${jobb}\]`, valasz: { ertekek: [kerd === 'a' ? a : b] }, formatum: FMT9.egesz,
        tipp: T`\(A^2-B^2=(A-B)(A+B)\). Melyik kifejezés négyzete \(${a * a === 1 ? '' : a * a}${v}^2\), és melyik számé ${b * b}?`, megoldas: [T`\[${a * a === 1 ? '' : a * a}${v}^2-${b * b}=(${aT})^2-${b}^2=(${aT}-${b})(${aT}+${b})\]`] }; }
    if (t <= 3) { const s = P([1, -1]); const kerd = R(0, 1) ? 'a' : 'b';
      const kif = T`${a * a === 1 ? '' : a * a}${v}^2${s > 0 ? '+' : '-'}${2 * a * b}${v}+${b * b}`;
      const jobb = kerd === 'a' ? T`(\square\, ${v}${s > 0 ? '+' : '-'}${b})^2` : T`(${aT}${s > 0 ? '+' : '-'}\square)^2`;
      return { kerdes: T`<p>Írd fel teljes négyzetként! Mi kerül a négyzet helyére?</p>\[${kif}=${jobb}\]`, valasz: { ertekek: [kerd === 'a' ? a : b] }, formatum: FMT9.egesz,
        tipp: T`\(A^2\pm2AB+B^2=(A\pm B)^2\): keresd meg, minek a négyzete az első és az utolsó tag!`, megoldas: [T`\[${kif}=(${aT})^2${s > 0 ? '+' : '-'}2\cdot ${aT}\cdot ${b}+${b}^2=(${aT}${s > 0 ? '+' : '-'}${b})^2\]`] }; }
    if (t === 4) { const c = R(1, 5); const kob = c ** 3; const s = P([1, -1]);
      return { kerdes: T`<p>Alakítsd szorzattá! Mi kerül a négyzet helyére?</p>\[${v}^3${s > 0 ? '+' : '-'}${kob}=(${v}${s > 0 ? '+' : '-'}${c})(${v}^2${s > 0 ? '-' : '+'}\square\, ${v}+${c * c})\]`, valasz: { ertekek: [c] }, formatum: FMT9.egesz,
        tipp: T`\(A^3-B^3=(A-B)(A^2+AB+B^2)\) és \(A^3+B^3=(A+B)(A^2-AB+B^2)\).`, megoldas: [T`\(${kob}=${c}^3\), így \[${v}^3${s > 0 ? '+' : '-'}${c}^3=(${v}${s > 0 ? '+' : '-'}${c})(${v}^2${s > 0 ? '-' : '+'}${c}${v}+${c * c})\]`] }; }
    const k = R(2, 6), b2 = R(1, 9);   // k·x² − k·b² = k(x−b)(x+b)
    return { kerdes: T`<p>Alakítsd szorzattá (kiemeléssel, majd nevezetes szorzattal)! Mi kerül a négyzet helyére?</p>\[${k}${v}^2-${k * b2 * b2}=${k}(${v}-\square)(${v}+\square)\]`, valasz: { ertekek: [b2] }, formatum: FMT9.egesz,
      tipp: T`Először emeld ki a ${k}-${k === 2 || k === 5 ? (k === 2 ? 't' : 'öt') : k === 3 ? 'at' : k === 6 ? 'ot' : 'et'}, aztán a zárójelben \(A^2-B^2\) áll.`, megoldas: [T`\[${k}${v}^2-${k * b2 * b2}=${k}(${v}^2-${b2 * b2})=${k}(${v}-${b2})(${v}+${b2})\]`] };
  } };

  /* ---------- x² + bx + c szorzattá alakítása ---------- */
  feladatok.masodfoku = { nev: 'x² + bx + c szorzattá alakítása', general() {
    const v = P(['x', 'a', 'y']); const [p, q] = kulonbozo(2, -9, 9).map(x => x || 1);
    if (p === q) return this.general();
    const poli = pMul([p, 1], [q, 1]);
    return { kerdes: T`<p>Alakítsd szorzattá \((${v}+p)(${v}+q)\) alakban! Add meg \(p\) és \(q\) értékét (mindkettőt, pontosvesszővel)!</p>\[${pT(poli, v)}\]`, valasz: { ertekek: [p, q] }, formatum: FMT9.halmaz,
      tipp: T`Keress két számot, amelyek összege \(${p + q}\) és szorzata \(${p * q}\)! (Mert \((${v}+p)(${v}+q)=${v}^2+(p+q)${v}+pq\).)`,
      megoldas: [T`\(${p}+${zjn(q)}=${p + q}\) és \(${p}\cdot ${zjn(q)}=${p * q}\).`, T`\[${pT(poli, v)}=(${linT(1, p, v)})(${linT(1, q, v)})\]`] };
  } };

  /* ---------- többlépéses szorzattá alakítás ---------- */
  feladatok.tobblepes = { nev: 'Többlépéses szorzattá alakítás', general() {
    const v = 'x'; const k = R(1, 6) * P([1, 1, -1]), m = R(1, 3), p = R0(-5, 5); const t = R(0, 1);
    const kx = (() => { const r = Array(m + 1).fill(0); r[m] = k; return r; })();
    const belso = t === 0 ? pMul([p, 1], [p, 1]) : pMul([p, 1], [-p, 1]);
    const poli = pMul(kx, belso);
    const alak = t === 0 ? T`k\cdot x^{m}\,(x+p)^2` : T`k\cdot x^{m}\,(x-p)(x+p)`;
    const mit = P(['k', 'm', 'p']); const ans = { k, m, p: t === 0 ? p : Math.abs(p) }[mit];
    const jobb = t === 0 ? T`${tagT(k, { x: m })}(${linT(1, p)})^2` : T`${tagT(k, { x: m })}(${linT(1, -Math.abs(p))})(${linT(1, Math.abs(p))})`;
    return { kerdes: T`<p>Alakítsd szorzattá \(${alak}\) alakban${t === 1 ? T` (\(p>0\))` : ''}! Mennyi ${mit === 'k' ? T`a \(k\)` : mit === 'm' ? T`az \(m\)` : T`a \(p\)`}?</p>\[${pT(poli)}\]`, valasz: { ertekek: [ans] }, formatum: FMT9.egesz,
      tipp: 'Először emeld ki a közös tényezőt, aztán nézd meg, nevezetes szorzat maradt-e a zárójelben!',
      megoldas: [T`\[${pT(poli)}=${tagT(k, { x: m })}\left(${pT(belso)}\right)=${jobb}\]`] };
  } };

  /* ---------- egyenlet megoldása szorzattá alakítással ---------- */
  feladatok.egyenlet = { nev: 'Egyenlet szorzattá alakítással', general() {
    const t = R(0, 5); let poli, gyokok, lep;
    if (t === 0) { const a = R0(-5, 5), b = R0(-12, 12); poli = [0, b, a]; const g = F(-b, a); gyokok = [0, fv(g)]; lep = T`\(x(${linT(a, b)})=0\), így \(x=0\) vagy \(x=${ft(g)}\).`; }
    else if (t === 1) { const a = R(1, 5), b = R(1, 9); poli = [-b * b, 0, a * a]; const g = F(b, a); gyokok = [fv(g), -fv(g)]; lep = T`\((${a === 1 ? '' : a}x-${b})(${a === 1 ? '' : a}x+${b})=0\), így \(x=${ft(g)}\) vagy \(x=-${ft(g)}\).`; }
    else if (t === 2) { const b = R(1, 6); poli = [0, -b * b, 0, 1]; gyokok = [0, b, -b]; lep = T`\(x(x^2-${b * b})=x(x-${b})(x+${b})=0\), így \(x=0\), \(x=${b}\) vagy \(x=-${b}\).`; }
    else if (t === 3) { const b = R0(-9, 9); poli = [b * b, 2 * b, 1]; gyokok = [-b]; lep = T`\((x${el0(b)})^2=0\), így \(x=${-b}\).`; }
    else if (t === 4) { let p, q; do { [p, q] = kulonbozo(2, -8, 8); } while (p === 0 || q === 0); poli = pMul([-p, 1], [-q, 1]); gyokok = [p, q]; lep = T`\((${linT(1, -p)})(${linT(1, -q)})=0\), így \(x=${p}\) vagy \(x=${q}\).`; }
    else { const a = R(1, 4), b = R0(-9, 9), c = R(1, 3), d = R0(-9, 9); if (F(-b, a).n * F(-d, c).d === F(-d, c).n * F(-b, a).d) return this.general();
      const g1 = F(-b, a), g2 = F(-d, c); gyokok = [fv(g1), fv(g2)];
      return { kerdes: T`<p>Oldd meg az egyenletet! Add meg az összes megoldást!</p>\[(${linT(a, b)})(${linT(c, d)})=0\]`, valasz: { ertekek: gyokok }, formatum: FMT9.halmaz,
        tipp: 'Egy szorzat akkor és csak akkor 0, ha valamelyik tényezője 0.', megoldas: [T`\(${linT(a, b)}=0\iff x=${ft(g1)}\), vagy \(${linT(c, d)}=0\iff x=${ft(g2)}\).`] }; }
    return { kerdes: T`<p>Oldd meg az egyenletet szorzattá alakítással! Add meg az összes megoldást!</p>\[${pT(poli)}=0\]`, valasz: { ertekek: gyokok }, formatum: FMT9.halmaz,
      tipp: 'Alakítsd szorzattá a bal oldalt (kiemelés, nevezetes szorzat), majd használd: egy szorzat akkor 0, ha valamelyik tényezője 0.', megoldas: [lep] };
  } };

  /* ---------- helyettesítés szorzattá alakítás után ---------- */
  feladatok.ertek = { nev: 'Ügyes behelyettesítés', general() {
    const t = R(0, 3);
    if (t === 0) { const s = R(3, 30), d = R(1, 15);
      return { kerdes: T`<p>Tudjuk, hogy \(x+y=${s}\) és \(x-y=${d}\). Mennyi \(x^2-y^2\)?</p>`, valasz: { ertekek: [s * d] }, formatum: FMT9.egesz,
        tipp: T`\(x^2-y^2=(x+y)(x-y)\)`, megoldas: [T`\[x^2-y^2=(x+y)(x-y)=${s}\cdot ${d}=${s * d}\]`] }; }
    if (t === 1) { const s = R0(-12, 12), c = R0(-6, 6);
      return { kerdes: T`<p>Tudjuk, hogy \(a+b=${s}\). Mennyi a kifejezés értéke?</p>\[a^2+2ab+b^2${el0(c)}\]`, valasz: { ertekek: [s * s + c] }, formatum: FMT9.egesz,
        tipp: T`\(a^2+2ab+b^2=(a+b)^2\)`, megoldas: [T`\[(a+b)^2${el0(c)}=${zjn(s)}^2${el0(c)}=${s * s + c}\]`] }; }
    if (t === 2) { const a = R0(-9, 9), s = R0(-12, 12);
      return { kerdes: T`<p>Tudjuk, hogy \(a=${a}\) és \(b+c=${s}\). Mennyi \(ab+ac\)?</p>`, valasz: { ertekek: [a * s] }, formatum: FMT9.egesz,
        tipp: T`Emeld ki az \(a\)-t!`, megoldas: [T`\[ab+ac=a(b+c)=${zjn(a)}\cdot ${zjn(s)}=${a * s}\]`] }; }
    const x = R0(-6, 6), k = R(2, 5), m = R0(-6, 6); let y; do { y = R0(-6, 6); } while (y === x);
    const ert = (k * x + m) * (y - x) ;
    // k·x·y − k·x² + m·y − m·x  =  (kx + m)(y − x)
    return { kerdes: T`<p>Számítsd ki ügyesen (előbb alakítsd szorzattá), ha \(x=${x}\) és \(y=${y}\)!</p>\[${tagokT([[k, { x: 1, y: 1 }], [-k, { x: 2 }], [m, { y: 1 }], [-m, { x: 1 }]])}\]`,
      valasz: { ertekek: [ert] }, formatum: FMT9.egesz, tipp: T`Csoportosíts: \(${k}x(y-x)${m > 0 ? '+' : '-'}${Math.abs(m)}(y-x)\).`,
      megoldas: [T`\[${k}x(y-x)${m > 0 ? '+' : '-'}${Math.abs(m)}(y-x)=(${linT(k, m)})(y-x)\]`, T`\((${k}\cdot ${zjn(x)}${el0(m)})\cdot(${y}-${zjn(x)})=${k * x + m}\cdot ${zjn(y - x)}=${ert}\)`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg7',
    cim: 'A szorzattá alakítás módszerei',
    rovid: 'Szorzattá alakítás',
    bevezeto: 'Kiemelés, csoportosítás, nevezetes szorzatok visszafelé – és mire jó mindez: egyszerűsítés, ügyes számolás, egyenletmegoldás.',
    elmelet: T`<div class="prose"><p>Egy összeget <b>szorzattá alakítunk</b>, ha szorzat alakban írjuk fel. A módszerek:</p>
<ol><li><b>Kiemelés:</b> \(6x^3-10x^2+2x=2x(3x^2-5x+1)\). Kiemeljük az együtthatók legnagyobb közös osztóját és a változók legkisebb kitevőjű hatványát.</li>
<li><b>Csoportosítás:</b> \(ab+3b-2a-6=b(a+3)-2(a+3)=(a+3)(b-2)\).</li>
<li><b>Nevezetes szorzatok visszafelé:</b> \(16x^2-25=(4x-5)(4x+5)\), \(\;x^2-20x+100=(x-10)^2\), \(\;a^3-27=(a-3)(a^2+3a+9)\).</li>
<li><b>\(x^2+bx+c\) alakú kifejezés:</b> ha találunk két számot, amelyek összege \(b\), szorzata \(c\): \(x^2+8x+15=(x+3)(x+5)\).</li></ol>
<p>Gyakran több módszert egymás után kell használni: \(3x^4+12x^3+12x^2=3x^2(x^2+4x+4)=3x^2(x+2)^2\).</p>
<p><b>Alkalmazás:</b> egy szorzat pontosan akkor 0, ha valamelyik tényezője 0: \(x^2-7x=0\iff x(x-7)=0\iff x=0\) vagy \(x=7\).</p></div>`,
    igazHamis: [
      { allitas: T`\(6x^2+9x=3x(2x+3)\)`, igaz: true, miert: T`\(3x\cdot2x=6x^2\) és \(3x\cdot3=9x\).` },
      { allitas: T`\(6x^2+9x=3x(2x+9)\)`, igaz: false, miert: T`\(3x\cdot9=27x\neq9x\). Helyesen: \(3x(2x+3)\).` },
      { allitas: T`\(x^2-9=(x-3)^2\)`, igaz: false, miert: T`\(x^2-9=(x-3)(x+3)\).` },
      { allitas: T`\(x^2+9\) szorzattá alakítható a valós számok körében.`, igaz: false, miert: T`Összeget (\(A^2+B^2\)) nem lehet nevezetes szorzattal szorzattá alakítani – ennek nincs valós zérushelye.` },
      { allitas: T`\(x^2-6x+9=(x-3)^2\)`, igaz: true, miert: T`\((x-3)^2=x^2-6x+9\).` },
      { allitas: T`\(x^2+5x+6=(x+2)(x+3)\)`, igaz: true, miert: T`\(2+3=5\), \(2\cdot3=6\).` },
      { allitas: T`\(x^2-x-6=(x-2)(x+3)\)`, igaz: false, miert: T`\((x-2)(x+3)=x^2+x-6\). Helyesen: \((x-3)(x+2)\).` },
      { allitas: T`\(ax+ay+bx+by=(a+b)(x+y)\)`, igaz: true, miert: T`\(a(x+y)+b(x+y)=(a+b)(x+y)\).` },
      { allitas: T`Az \(x^2=5x\) egyenletnek csak az \(x=5\) a megoldása.`, igaz: false, miert: T`\(x^2-5x=x(x-5)=0\): az \(x=0\) is megoldás. (Ezért nem szabad \(x\)-szel osztani!)` },
      { allitas: T`\(a^3-8=(a-2)(a^2+2a+4)\)`, igaz: true, miert: T`\(A^3-B^3=(A-B)(A^2+AB+B^2)\), \(B=2\).` },
      { allitas: T`\(4x^2-1=(2x-1)(2x+1)\)`, igaz: true, miert: T`\((2x)^2-1^2\).` },
      { allitas: T`\(2x^2-8=2(x-2)^2\)`, igaz: false, miert: T`\(2x^2-8=2(x^2-4)=2(x-2)(x+2)\).` },
      { general() { const p = R0(-6, 6), q = R0(-6, 6); const jo = R(0, 1) === 1; const qq = jo ? q : -q; if (p === q || q === 0) return { allitas: T`\(x^2-4=(x-2)(x+2)\)`, igaz: true, miert: 'Két négyzet különbsége.' };
        return { allitas: T`\(${pT(pMul([p, 1], [q, 1]))}=(${linT(1, p)})(${linT(1, qq)})\)`, igaz: jo, miert: T`\((${linT(1, p)})(${linT(1, q)})=${pT(pMul([p, 1], [q, 1]))}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Alakítsuk szorzattá: \(5x^6-40x^4+80x^2\)`,
      lepesek: [T`Kiemeljük az \(5x^2\)-et: \(5x^2(x^4-8x^2+16)\).`, T`A zárójelben teljes négyzet áll: \(x^4-8x^2+16=(x^2-4)^2\).`, T`Az \(x^2-4\) is szorzattá alakítható: \(x^2-4=(x-2)(x+2)\).`, T`\[5x^6-40x^4+80x^2=5x^2(x-2)^2(x+2)^2\]`]
    },
    feladatok
  }));
})();
