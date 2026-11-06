/*
 * 5. fejezet – Másodfokúra visszavezethető egyenletek: magasabb fokú és törtes egyenletek
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 4. lecke; FGY 2163–2164, 2177–2183; OH 24.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, poly, q2, l1, zj, el, kulonbozo, gyokokT, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;
  const KERD = T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket; ha nincs, írd: nincs.</p>`;
  const rendezett = a => a.slice().sort((x, y) => x - y);
  const valasz = gy => gy.length ? { ertekek: rendezett(gy) } : { nincs: true };
  const gyT = gy => gy.length ? gyokokT(rendezett(gy).map(x => Number.isInteger(x) ? F(x, 1) : F(Math.round(x * 36), 36))) : T`\text{nincs valós megoldás}`;

  feladatok.bikvad = { nev: 'Negyedfokú (bikvadratikus)', general() {
    // y = x²; y-gyökök: négyzetszám, tört négyzet, negatív
    const YK = [F(1, 1), F(4, 1), F(9, 1), F(16, 1), F(25, 1), F(36, 1), F(49, 1), F(64, 1), F(-3, 1), F(-7, 1), F(1, 4), F(9, 4), F(1, 9), F(4, 9), F(-1, 1), F(-4, 1), F(-9, 1), F(-2, 1), F(-5, 1)];
    let y1, y2; do { y1 = P(YK); y2 = P(YK); } while (fv(y1) === fv(y2) || (y1.d > 1 && y2.d > 1 && y1.d !== y2.d) || (fv(y1) < 0 && fv(y2) < 0 && R(0, 2)));
    const d = y1.d * y2.d / gcd(y1.d, y2.d);
    const [a, b, c] = M10.egyutthatok(y1, y2, d === 1 ? P([1, 1, 1, 2, 3, -1]) : 1);
    const gy = []; [y1, y2].forEach(y => { if (fv(y) > 0) { const s = Math.sqrt(fv(y)); gy.push(-s, s); } });
    return { kerdes: KERD + T`\[${poly([a, 0, b, 0, c])}=0\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
      tipp: T`Vezess be új ismeretlent: \(y=x^2\). Az \(${q2(a, b, c, 'y')}=0\) másodfokú egyenlet gyökeiből \(x=\pm\sqrt{y}\) – de csak a nemnegatív \(y\)-okból!`,
      megoldas: [T`Legyen \(y=x^2\ (\ge0)\): \(${q2(a, b, c, 'y')}=0\).`, T`\[y_1=${ft(y1)},\qquad y_2=${ft(y2)}\]`,
        ...[y1, y2].map(y => fv(y) < 0 ? T`\(x^2=${ft(y)}\): nincs valós megoldás.` : T`\(x^2=${ft(y)}\Rightarrow x=\pm${ft(F(Math.round(Math.sqrt(y.n)), Math.round(Math.sqrt(y.d))))}\)`),
        T`Megoldások: \(${gyT(gy)}\).`],
      _ell: w => w === 'nincs' ? gy.length === 0 : egy(a * w ** 4 + b * w * w + c, 0) };
  } };

  feladatok.ujvalt = { nev: 'Új változó bevezetése', general() {
    const t = R(0, 2);
    if (t === 0) {   // (x − p)⁴ + b(x − p)² + c = 0
      const p = R0(-5, 5); let s1, s2; do { [s1, s2] = kulonbozo(2, 1, 4); } while (false);
      const neg = R(0, 3) === 0; const y1 = s1 * s1, y2 = neg ? -R(1, 6) : s2 * s2;
      const b = -(y1 + y2), c = y1 * y2; const z = `\\left(x${el(-p)}\\right)`;
      const gy = [p - s1, p + s1]; if (!neg) gy.push(p - s2, p + s2);
      return { kerdes: KERD + T`\[${z}^4${b === 0 ? '' : (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b))}${z}^2${el(c)}=0\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
        tipp: T`Legyen \(y=\left(x${el(-p)}\right)^2\). Ne bontsd fel a zárójeleket!`,
        megoldas: [T`\(y=\left(x${el(-p)}\right)^2\): \(${q2(1, b, c, 'y')}=0\Rightarrow y_1=${y1},\ y_2=${y2}\).`,
          T`\(\left(x${el(-p)}\right)^2=${y1}\Rightarrow x${el(-p)}=\pm${s1}\)${neg ? T`; az \(y_2=${y2}<0\) nem ad megoldást.` : T`; \(\left(x${el(-p)}\right)^2=${y2}\Rightarrow x${el(-p)}=\pm${s2}\).`}`,
          T`Megoldások: \(${gyT(gy)}\).`],
        _ell: w => egy((w - p) ** 4 + b * (w - p) ** 2 + c, 0) };
    }
    // y = x² + kx; y-értékek x-gyökpárokból: y = r(r + k)
    const k = R0(-6, 6); let r1, r2, y1, y2;
    do { r1 = R(-6, 6); r2 = R(-6, 6); y1 = r1 * (r1 + k); y2 = r2 * (r2 + k); } while (y1 === y2 || Math.abs(y1) > 40 || Math.abs(y2) > 40);
    const gy = [...new Set([r1, -k - r1, r2, -k - r2])];
    const z = T`\left(${q2(1, k, 0)}\right)`;
    let eq, mo;
    if (t === 1) { const d = -(y1 + y2), e = -y1 * y2;   // y(y + d) − e = 0
      eq = d === 0 ? T`${z}^2${el(-e)}=0` : T`${z}\cdot\left(${q2(1, k, d)}\right)${el(-e)}=0`; mo = T`Legyen \(y=${q2(1, k, 0)}\): \(y(y${el(d)})${el(-e)}=0\Rightarrow ${q2(1, d, -e, 'y')}=0\).`; }
    else { const b = -(y1 + y2), c = y1 * y2; eq = T`${z}^2${b === 0 ? '' : (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b))}${z}${el(c)}=0`; mo = T`Legyen \(y=${q2(1, k, 0)}\): \(${q2(1, b, c, 'y')}=0\).`; }
    return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
      tipp: T`Ne bontsd fel a zárójeleket! Vezesd be az \(y=${q2(1, k, 0)}\) új ismeretlent.`,
      megoldas: [mo, T`\[y_1=${y1},\qquad y_2=${y2}\]`, T`\(${q2(1, k, -y1)}=0\Rightarrow x=${r1}\) vagy \(x=${-k - r1}\); \(${q2(1, k, -y2)}=0\Rightarrow x=${r2}\) vagy \(x=${-k - r2}\).`, T`Megoldások: \(${gyT(gy)}\).`],
      _ell: w => { const y = w * w + k * w; return egy((y - y1) * (y - y2), 0); } };
  } };

  feladatok.kobos = { nev: 'Harmad- és hatodfokú', general() {
    const KOB = [-64, -27, -8, -1, 1, 8, 27, 64];
    const t = R(0, 2);
    if (t === 0) { const n = P([3, 3, 4]); let a, sr, nincs = false;
      if (n === 3) { if (R(0, 3) === 0) { const q = P([2, 3]); sr = F(R0(-2 * q, 2 * q), q); if (sr.d === 1) sr = F(sr.n * 2 + 1, 2); a = sr.d ** 3; } else { sr = F(R0(-5, 5), 1); a = P([1, 1, 2, 3, 4, 5]); } }
      else { sr = F(R(1, 4), 1); a = P([1, 1, 2, 3]); nincs = R(0, 3) === 0; }
      const k = fv(F(a * sr.n ** n, sr.d ** n)) * (nincs ? -1 : 1);   // a·x^n = k
      const gy = n === 3 ? [fv(sr)] : (nincs ? [] : [-fv(sr), fv(sr)]);
      const aT = a === 1 ? '' : a;
      const eq = R(0, 1) ? T`${aT}x^{${n}}${el(-k)}=0` : T`${aT}x^{${n}}=${k}`;
      return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
        tipp: n === 3 ? T`Páratlan kitevő: \(x^3=k\)-nak mindig pontosan egy valós megoldása van, \(x=\sqrt[3]{k}\) (negatív \(k\)-ra is).` : T`Páros kitevő: \(x^4=k\) esetén \(k>0\) mellett két ellentett megoldás van, \(k<0\) esetén nincs.`,
        megoldas: [T`\[x^{${n}}=${ft(F(k, a))}\]`, gy.length ? T`\[${gyT(gy)}\]` : T`Páros kitevőjű hatvány nem lehet negatív: nincs valós megoldás.`],
        _ell: w => w === 'nincs' ? gy.length === 0 : egy(a * w ** n, k) }; }
    // x⁶ + b x³ + c = 0
    let y1, y2; do { y1 = P(KOB); y2 = P(KOB); } while (y1 === y2);
    const b = -(y1 + y2), c = y1 * y2; const gy = [Math.round(Math.cbrt(y1)), Math.round(Math.cbrt(y2))];
    return { kerdes: KERD + T`\[${poly([1, 0, 0, b, 0, 0, c])}=0\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
      tipp: T`Legyen \(y=x^3\). (Itt \(y\) negatív is lehet, hiszen negatív szám köbe negatív.)`,
      megoldas: [T`\(y=x^3\): \(${q2(1, b, c, 'y')}=0\Rightarrow y_1=${y1},\ y_2=${y2}\).`, T`\(x^3=${y1}\Rightarrow x=${gy[0]}\); \(x^3=${y2}\Rightarrow x=${gy[1]}\).`],
      _ell: w => egy(w ** 6 + b * w ** 3 + c, 0) };
  } };

  feladatok.kiemel = { nev: 'Kiemeléssel', general() {
    const t = R(0, 2);
    if (t === 0) {   // a x³ + b x² + c x = 0, két egész gyök + 0
      const [r1, r2] = kulonbozo(2, -8, 8, [0]); const a = P([1, 1, 2, -1]);
      const gy = [0, r1, r2];
      return { kerdes: KERD + T`\[${poly([a, -a * (r1 + r2), a * r1 * r2, 0])}=0\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
        tipp: T`Emeld ki \(x\)-et! \(x\cdot(\dots)=0\): vagy \(x=0\), vagy a zárójelben álló másodfokú kifejezés 0.`,
        megoldas: [T`\[x\left(${q2(a, -a * (r1 + r2), a * r1 * r2)}\right)=0\]`, T`\(x=0\), vagy \(${q2(a, -a * (r1 + r2), a * r1 * r2)}=0\Rightarrow x=${r1};\ ${r2}\).`],
        _ell: w => egy(w * (a * w * w - a * (r1 + r2) * w + a * r1 * r2), 0) }; }
    if (t === 1) {   // x⁴ − k² x² = 0 vagy a x⁴ = b x²
      const s = R(1, 9); const a = P([1, 1, 2, 3]);
      const gy = [0, -s, s];
      const eq = R(0, 1) ? T`${poly([a, 0, -a * s * s, 0, 0])}=0` : T`${poly([a, 0, 0, 0, 0])}=${a * s * s}x^2`;
      return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
        tipp: T`Rendezz 0-ra, és emeld ki \(x^2\)-et! Ne oszd el \(x^2\)-tel az egyenletet, mert elveszíted a 0 gyököt.`,
        megoldas: [T`\[${a === 1 ? '' : a}x^2\left(x^2-${s * s}\right)=0\]`, T`\(x^2=0\Rightarrow x=0\); \(x^2=${s * s}\Rightarrow x=\pm${s}\).`],
        _ell: w => egy(a * w ** 4 - a * s * s * w * w, 0) }; }
    // csoportosítás: x³ + p x² − k² x − p k² = (x + p)(x² − k²)
    const p = R0(-7, 7), k = R(1, 6); if (Math.abs(p) === k) return feladatok.kiemel.general();
    const gy = [-p, -k, k];
    return { kerdes: KERD + T`\[${poly([1, p, -k * k, -p * k * k])}=0\]`, valasz: valasz(gy), formatum: FMT10.halmaz,
      tipp: T`Csoportosíts: az első két tagból \(x^2\)-et, a második kettőből \(${-k * k}\)-et emelj ki!`,
      megoldas: [T`\[x^2\left(x${el(p)}\right)-${k * k}\left(x${el(p)}\right)=\left(x${el(p)}\right)\left(x^2-${k * k}\right)=0\]`, T`\[${gyT(gy)}\]`],
      _ell: w => egy(w ** 3 + p * w * w - k * k * w - p * k * k, 0) };
  } };

  feladatok.tortes = { nev: 'Törtes egyenletek', general() {
    const t = R(0, 3);
    if (t === 0) {   // x + k/x = m
      const [r1, r2] = kulonbozo(2, -9, 9, [0]); const k = r1 * r2, m = r1 + r2; const val = R(0, 1);
      const eq = val ? T`x${k < 0 ? '-' : '+'}\frac{${Math.abs(k)}}{x}=${m}` : T`\frac{${Math.abs(k)}}{x}=${l1(-1, m)}`.replace(/^/, k < 0 ? '-' : '');
      return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz([r1, r2]), formatum: FMT10.halmaz,
        tipp: T`Kikötés: \(x\neq0\). Szorozd meg az egyenlet mindkét oldalát \(x\)-szel!`,
        megoldas: [T`Kikötés: \(x\neq0\). \(x\)-szel szorozva: \(x^2${el(k)}=${m === 0 ? '0' : l1(m, 0)}\Rightarrow ${q2(1, -m, k)}=0\).`, T`\[${gyT([r1, r2])}\]`, 'Mindkettő megfelel a kikötésnek.'],
        _ell: w => w !== 0 && egy(w + k / w, m) };
    }
    if (t === 1) {   // A/(x−p) + B/(x−q) = C
      for (let g = 0; g < 300; g++) {
        const [p, q] = kulonbozo(2, -6, 6); const C = P([1, 1, 2, -1, 3]); const [r1, r2] = kulonbozo(2, -8, 8, [p, q]);
        const S = C * (r1 + r2 - p - q), K = C * (r1 * r2 - p * q);
        if ((K - S * q) % (p - q) !== 0) continue;
        const B = (K - S * q) / (p - q), A = S - B; if (A === 0 || B === 0 || Math.abs(A) > 20 || Math.abs(B) > 20) continue;
        const tag = (X, z) => (X < 0 ? '-' : '') + T`\frac{${Math.abs(X)}}{${l1(1, -z)}}`;
        const eq = tag(A, p) + (B > 0 ? '+' : '') + tag(B, q) + '=' + C;
        return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz([r1, r2]), formatum: FMT10.halmaz,
          tipp: T`Kikötés: \(x\neq${p}\), \(x\neq${q}\). Szorozd meg mindkét oldalt a nevezők szorzatával: \((${l1(1, -p)})(${l1(1, -q)})\).`,
          megoldas: [T`Kikötés: \(x\neq ${p}\) és \(x\neq ${q}\).`, T`\[${A}\left(${l1(1, -q)}\right)${el(B)}\left(${l1(1, -p)}\right)=${C === 1 ? '' : C}\left(${l1(1, -p)}\right)\left(${l1(1, -q)}\right)\]`,
            T`Rendezve: \(${q2(C, -C * (r1 + r2), C * r1 * r2)}=0\Rightarrow ${gyT([r1, r2])}\).`, 'Mindkét gyök megfelel a kikötésnek.'],
          _ell: w => w !== p && w !== q && egy(A / (w - p) + B / (w - q), C) };
      }
      return feladatok.tortes.general();
    }
    // (x+a)/(x−p) + (x+b)/(x−q) = (Ex+G)/((x−p)(x−q)), hamis gyökkel is
    for (let g = 0; g < 300; g++) {
      const [p, q] = kulonbozo(2, -6, 6); const a = R(-6, 6), b = R(-6, 6);
      if (a === -p || b === -q) continue;
      const hamis = R(0, 2) > 0; const r1 = hamis ? P([p, q]) : kulonbozo(1, -8, 8, [p, q])[0]; const r2 = kulonbozo(1, -8, 8, [p, q, r1])[0];
      const E = a + b - p - q + 2 * (r1 + r2), G = -a * q - b * p - 2 * r1 * r2;
      if (Math.abs(E) > 30 || Math.abs(G) > 60) continue;
      const nev = q2(1, -(p + q), p * q);
      const jo = [r1, r2].filter(x => x !== p && x !== q);
      const szaml = l1(E, G);
      const eq = T`\frac{${l1(1, a)}}{${l1(1, -p)}}+\frac{${l1(1, b)}}{${l1(1, -q)}}=\frac{${szaml}}{${nev}}`;
      return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(jo), formatum: FMT10.halmaz,
        tipp: T`Alakítsd szorzattá a jobb oldali nevezőt: \(${nev}=(${l1(1, -p)})(${l1(1, -q)})\). Kikötés: \(x\neq${p}\), \(x\neq${q}\). Szorozz a közös nevezővel, és a végén ellenőrizd a kikötést!`,
        megoldas: [T`Közös nevező: \((${l1(1, -p)})(${l1(1, -q)})\); kikötés: \(x\neq${p}\), \(x\neq${q}\).`,
          T`\[(${l1(1, a)})(${l1(1, -q)})+(${l1(1, b)})(${l1(1, -p)})=${szaml}\]`,
          T`Rendezve: \(${q2(2, -2 * (r1 + r2), 2 * r1 * r2)}=0\Rightarrow x=${r1}\) vagy \(x=${r2}\).`,
          hamis ? T`Az \(x=${r1}\) nem felel meg a kikötésnek (hamis gyök), így a megoldás: \(x=${r2}\).` : 'Mindkét gyök megfelel a kikötésnek.'],
        _ell: w => w !== p && w !== q && egy((w + a) / (w - p) + (w + b) / (w - q), (E * w + G) / ((w - p) * (w - q))),
        _mind: vs => vs.length === jo.length || 'darab' };
    }
    return feladatok.tortes.general();
  } };

  feladatok.harmadfok = { nev: 'Egész gyök keresése (harmadfokú)', szint: 'emelt', general() {
    const r = R0(-4, 4); const t = R(0, 1); let a2, b2, gy;   // (x − r)(x² + a2 x + b2)
    if (t === 0) { const [s1, s2] = kulonbozo(2, -5, 5, [r]); a2 = -(s1 + s2); b2 = s1 * s2; gy = [r, s1, s2]; }
    else { a2 = R(-3, 3); b2 = R(Math.floor(a2 * a2 / 4) + 1, 8); gy = [r]; }
    const c3 = [1, a2 - r, b2 - r * a2, -r * b2];
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! (Tipp: keress egész gyököt a konstans tag osztói között.) A megoldásokat pontosvesszővel válaszd el.</p>\[${poly(c3)}=0\]`,
      valasz: valasz(gy), formatum: FMT10.halmaz,
      tipp: T`Ha egy egész együtthatós, 1 főegyütthatójú polinomnak van egész gyöke, az osztója a konstans tagnak. Próbáld ki \(\pm1,\pm2,\dots\)-t, majd emeld ki az \((x-r)\) tényezőt.`,
      megoldas: [T`Próbálgatással: \(x=${r}\) gyök, mert a behelyettesítés 0-t ad.`, T`\[${poly(c3)}=\left(x${el(-r)}\right)\left(${q2(1, a2, b2)}\right)\]`,
        t === 0 ? T`\(${q2(1, a2, b2)}=0\Rightarrow x=${gy[1]};\ ${gy[2]}\).` : T`Az \(${q2(1, a2, b2)}=0\) egyenletnek nincs valós gyöke (\(D=${a2 * a2 - 4 * b2}<0\)), így az egyetlen megoldás \(x=${r}\).`],
      _ell: w => egy(c3[0] * w ** 3 + c3[1] * w * w + c3[2] * w + c3[3], 0), _mind: vs => vs.length === gy.length || 'darab' };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mvissza',
    cim: 'Másodfokúra visszavezethető egyenletek',
    rovid: 'Magasabb fokú, törtes',
    bevezeto: T`Sok egyenlet nem másodfokú, de egy ügyes lépéssel – új ismeretlen, kiemelés vagy a nevezők eltüntetése – azzá tehető.`,
    elmelet: T`<div class="tbl"><table><tr><th>Típus</th><th>Felismerés</th><th>Teendő</th></tr>
<tr><td>bikvadratikus</td><td>\(ax^4+bx^2+c=0\)</td><td>\(y=x^2\ (y\ge0)\)</td></tr>
<tr><td>hatodfokú</td><td>\(ax^6+bx^3+c=0\)</td><td>\(y=x^3\) (\(y\) negatív is lehet)</td></tr>
<tr><td>ismétlődő kifejezés</td><td>\((x^2+6x)(x^2+6x+4)=77\)</td><td>\(y=x^2+6x\), a zárójeleket ne bontsd fel!</td></tr>
<tr><td>nincs konstans tag</td><td>\(x^3-5x^2+6x=0\)</td><td>kiemelés: \(x(x^2-5x+6)=0\)</td></tr>
<tr><td>törtes</td><td>ismeretlen a nevezőben</td><td>kikötés → szorzás a közös nevezővel → ellenőrzés</td></tr></table></div>
<div class="prose"><ul>
<li><b>Törtes egyenletnél</b> az első lépés mindig a <b>kikötés</b>: a nevező nem lehet 0. A kapott gyökök közül a kikötést nem teljesítők <b>hamis gyökök</b>.</li>
<li>Ha a nevező másodfokú (pl. \(x^2-25\)), alakítsd szorzattá: \((x-5)(x+5)\). Ez lesz a közös nevező.</li>
<li>\(y=x^2\) esetén a negatív \(y\) nem ad valós megoldást; \(y=x^3\) esetén igen: \(x^3=-8\Rightarrow x=-2\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`Az \(x^4-5x^2+4=0\) egyenletnek 4 valós megoldása van.`, igaz: true, miert: T`\(y=x^2\): \(y=1\) vagy \(y=4\), így \(x=\pm1,\ \pm2\).` },
      { allitas: T`Az \(x^4+3x^2-4=0\) egyenletnek 4 valós megoldása van.`, igaz: false, miert: T`\(y=1\) vagy \(y=-4\); az utóbbi nem ad megoldást: csak \(x=\pm1\).` },
      { allitas: T`Az \(x^3=-27\) egyenletnek nincs valós megoldása.`, igaz: false, miert: T`\(x=-3\), hiszen \((-3)^3=-27\).` },
      { allitas: T`Az \(x^3=4x\) egyenletet \(x\)-szel osztva megkapjuk az összes megoldást.`, igaz: false, miert: T`Elveszik az \(x=0\) gyök. Helyesen: \(x(x^2-4)=0\Rightarrow x=0;\ \pm2\).` },
      { allitas: T`A törtes egyenlet megoldása után ellenőrizni kell, hogy a gyök nem teszi-e 0-vá valamelyik nevezőt.`, igaz: true, miert: 'A közös nevezővel való szorzás bővítheti a megoldáshalmazt: hamis gyök keletkezhet.' },
      { allitas: T`\(\frac{x+5}{x-5}+\frac{x-5}{x+5}=\frac{100}{x^2-25}\) megoldásai \(x=\pm5\).`, igaz: false, miert: T`Rendezve \(x^2=25\), de \(x=\pm5\) mindkettő kizárt (a nevező 0 lenne). Nincs megoldás.` },
      { allitas: T`Az \(x^2-25\) kifejezés szorzat alakja \((x-5)(x+5)\).`, igaz: true, miert: T`Nevezetes azonosság: \(a^2-b^2=(a-b)(a+b)\).` },
      { general() { const k = P([1, 4, 9, 16, 25]); const s = Math.sqrt(k); const neg = R(0, 1) === 1;
        return { allitas: T`Az \(x^4=${neg ? -k * k : k * k}\) egyenletnek két valós megoldása van.`, igaz: !neg, miert: neg ? T`Páros kitevőjű hatvány nem lehet negatív.` : T`\(x^2=${k}\Rightarrow x=\pm${s}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Oldjuk meg: \((x^2+6x)\cdot(x^2+6x+4)-77=0\)`,
      lepesek: [
        T`Legyen \(y=x^2+6x\). Ekkor \(y(y+4)-77=0\), azaz \(y^2+4y-77=0\).`,
        T`\(y_1=7\), \(y_2=-11\).`,
        T`\(x^2+6x=7\Rightarrow x^2+6x-7=0\Rightarrow x=1\) vagy \(x=-7\).`,
        T`\(x^2+6x=-11\Rightarrow x^2+6x+11=0\): \(D=36-44<0\), nincs valós megoldás.`,
        T`A megoldások: \(x_1=-7\), \(x_2=1\).`
      ]
    },
    feladatok
  }));
})();
