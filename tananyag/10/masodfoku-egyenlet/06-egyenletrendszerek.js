/*
 * 6. fejezet – Másodfokú egyenletrendszerek
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 4. lecke; FGY 2178, 2180; OH 32.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, zj, el, kulonbozo, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;
  const rendsz = (e1, e2) => T`\[\begin{cases}${e1}\\ ${e2}\end{cases}\]`;
  /* a·x + b·y = c */
  function linXY(a, b, c) { let s = a === 0 ? '' : l1(a, 0); if (b !== 0) s += (b < 0 ? '-' : (s ? '+' : '')) + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y'; return `${s}=${c}`; }
  const fmtP = ([x, y]) => T`(${typeof x === 'object' ? ft(x) : x};\,${typeof y === 'object' ? ft(y) : y})`;
  const kerdesX = mit => T`<p>Oldd meg a valós számpárok halmazán! Add meg a megoldáspárok <b>${mit}</b> pontosvesszővel elválasztva (ha nincs megoldás, írd: nincs).</p>`;

  feladatok.behely = { nev: 'Elsőfokú és másodfokú (behelyettesítés)', general() {
    // y = m x + n egyenes, y = x² + p x + q parabola; metszéspontok x1, x2 (vagy érintés / nincs)
    const m = R(-3, 3), n = R(-6, 6); const t = R(0, 7);
    let x1, x2, p, q, gyk;
    if (t <= 5) { [x1, x2] = kulonbozo(2, -5, 5); p = m - (x1 + x2); q = n + x1 * x2; gyk = [x1, x2]; }
    else if (t === 6) { x1 = R(-4, 4); p = m - 2 * x1; q = n + x1 * x1; gyk = [x1]; }
    else { const u = R(-3, 3); p = m - 2 * u; q = n + u * u + R(1, 6); gyk = []; }   // (x−u)² + pozitív > 0: nincs metszés
    const pontok = gyk.map(x => [x, m * x + n]);
    const ys = [...new Set(pontok.map(pt => pt[1]))];
    const kerdY = R(0, 1) === 1 && ys.length === pontok.length;
    // az egyenes megjelenítése: y = mx + n, vagy átrendezve
    const lin = R(0, 1) ? T`y=${m === 0 ? n : l1(m, n)}` : linXY(-m, 1, n);
    const par = R(0, 1) ? T`y=${q2(1, p, q)}` : T`${q2(1, p, 0)}-y=${-q}`;
    const [e1, e2] = R(0, 1) ? [lin, par] : [par, lin];
    const ans = kerdY ? ys : gyk;
    return { kerdes: kerdesX(kerdY ? 'második (y) koordinátáit' : 'első (x) koordinátáit') + rendsz(e1, e2),
      valasz: ans.length ? { ertekek: ans.slice().sort((a, b) => a - b) } : { nincs: true }, formatum: FMT10.halmaz,
      tipp: T`Fejezd ki \(y\)-t az elsőfokú egyenletből (\(y=${m === 0 ? n : l1(m, n)}\)), és helyettesítsd be a másodfokúba!`,
      megoldas: [T`Az elsőfokúból: \(y=${m === 0 ? n : l1(m, n)}\). Behelyettesítve: \(${m === 0 ? n : l1(m, n)}=${q2(1, p, q)}\).`,
        T`Rendezve: \(${q2(1, p - m, q - n)}=0\).`,
        gyk.length ? T`Megoldások: ${pontok.map(fmtP).map(s => T`\(${s}\)`).join(', ')}.` : T`A diszkrimináns negatív (\(D=${(p - m) ** 2 - 4 * (q - n)}\)), nincs megoldás: az egyenes és a parabola nem metszik egymást.`],
      _ell: w => w === 'nincs' ? gyk.length === 0 : kerdY ? pontok.some(pt => egy(pt[1], w)) : egy(w * w + p * w + q, m * w + n),
      _mind: vs => vs.length === ans.length || 'darab' };
  } };

  feladatok.osszszorz = { nev: 'Összeg/különbség és szorzat', general() {
    const [a, b] = kulonbozo(2, -9, 9); const t = R(0, 1);
    if (t === 0) {   // x + y = S, xy = P → (a; b), (b; a)
      const S = a + b, Pr = a * b;
      return { kerdes: kerdesX('első (x) koordinátáit') + rendsz(linXY(1, 1, S), T`x\cdot y=${Pr}`),
        valasz: { ertekek: [a, b].sort((u, v) => u - v) }, formatum: FMT10.halmaz,
        tipp: T`\(y=${S}-x\); behelyettesítve: \(x(${S}-x)=${Pr}\). (Vagy: \(x\) és \(y\) a \(t^2-${zj(S)}t${el(Pr)}=0\) egyenlet gyökei – Viète!)`,
        megoldas: [T`\(y=${l1(-1, S)}\Rightarrow x\left(${l1(-1, S)}\right)=${Pr}\Rightarrow ${q2(1, -S, Pr)}=0\).`, T`\(x_1=${a}\), \(x_2=${b}\). A megoldáspárok: \(${fmtP([a, b])}\) és \(${fmtP([b, a])}\).`],
        _ell: w => egy(w * (S - w), Pr) };
    }
    // x − y = d, xy = P → (a; b) és (−b; −a)
    const d = a - b, Pr = a * b; if (d === 0) return feladatok.osszszorz.general();
    const xs = [...new Set([a, -b])].sort((u, v) => u - v);
    return { kerdes: kerdesX('első (x) koordinátáit') + rendsz(linXY(1, -1, d), T`x\cdot y=${Pr}`),
      valasz: { ertekek: xs }, formatum: FMT10.halmaz,
      tipp: T`Fejezd ki \(y\)-t: \(y=${l1(1, -d)}\), és helyettesítsd be a második egyenletbe.`,
      megoldas: [T`\(y=${l1(1, -d)}\Rightarrow x\left(${l1(1, -d)}\right)=${Pr}\Rightarrow ${q2(1, -d, -Pr)}=0\).`, T`\(x=${a}\) vagy \(x=${-b}\). A megoldáspárok: \(${fmtP([a, b])}\)${a === -b ? '' : T` és \(${fmtP([-b, -a])}\)`}.`],
      _ell: w => egy(w * (w - d), Pr), _mind: vs => vs.length === xs.length || 'darab' };
  } };

  feladatok.negyzetossz = { nev: 'Négyzetösszeg és összeg/különbség', general() {
    const [a, b] = kulonbozo(2, -7, 7); const R2 = a * a + b * b; const t = R(0, 1);
    if (t === 0) { const S = a + b; const xs = [a, b].sort((u, v) => u - v);
      return { kerdes: kerdesX('első (x) koordinátáit') + rendsz(T`x^2+y^2=${R2}`, linXY(1, 1, S)),
        valasz: { ertekek: xs }, formatum: FMT10.halmaz,
        tipp: T`\(y=${l1(-1, S)}\). Helyettesítsd be: \(x^2+\left(${l1(-1, S)}\right)^2=${R2}\).`,
        megoldas: [T`\[x^2+\left(${l1(-1, S)}\right)^2=${R2}\quad\Rightarrow\quad ${q2(2, -2 * S, S * S - R2)}=0\]`, T`\(x=${a}\) vagy \(x=${b}\); a megoldáspárok: \(${fmtP([a, b])}\) és \(${fmtP([b, a])}\).`],
        _ell: w => egy(w * w + (S - w) ** 2, R2) }; }
    const d = a - b; const xs = [...new Set([a, -b])].sort((u, v) => u - v);
    return { kerdes: kerdesX('első (x) koordinátáit') + rendsz(T`x^2+y^2=${R2}`, linXY(1, -1, d)),
      valasz: { ertekek: xs }, formatum: FMT10.halmaz,
      tipp: T`\(y=${l1(1, -d)}\). Helyettesítsd be az első egyenletbe!`,
      megoldas: [T`\[x^2+\left(${l1(1, -d)}\right)^2=${R2}\quad\Rightarrow\quad ${q2(2, -2 * d, d * d - R2)}=0\]`, T`\(x=${a}\) vagy \(x=${-b}\); a megoldáspárok: \(${fmtP([a, b])}\)${a === -b ? '' : T` és \(${fmtP([-b, -a])}\)`}.`],
      _ell: w => egy(w * w + (w - d) ** 2, R2), _mind: vs => vs.length === xs.length || 'darab' };
  } };

  feladatok.szorzatlin = { nev: 'Szorzat és lineáris egyenlet', general() {
    // y = m x + n, x·y = P → m x² + n x − P = 0, egyik gyök egész (x1)
    const m = P([2, 3, -2, -3, 2]); const x1 = R0(-5, 5); const n = R(-7, 7); const Pr = x1 * (m * x1 + n);
    if (Pr === 0) return feladatok.szorzatlin.general();
    const x2 = F(-n - m * x1, m);   // összeg: −n/m
    if (fv(x2) === x1) return feladatok.szorzatlin.general();
    const xs = [x1, fv(x2)].sort((u, v) => u - v);
    const y2 = F(Pr * x2.d, x2.n);
    return { kerdes: kerdesX('első (x) koordinátáit') + rendsz(linXY(-m, 1, n), T`x\cdot y=${Pr}`),
      valasz: { ertekek: xs }, formatum: FMT10.halmaz + ', törtet így: 3/2',
      tipp: T`Az első egyenletből \(y=${l1(m, n)}\). Helyettesítsd be a szorzatba, és oldd meg a kapott másodfokú egyenletet.`,
      megoldas: [T`\[x\left(${l1(m, n)}\right)=${Pr}\quad\Rightarrow\quad ${q2(m, n, -Pr)}=0\]`, T`\(x_1=${x1}\), \(x_2=${ft(x2)}\).`, T`A megoldáspárok: \(${fmtP([x1, m * x1 + n])}\) és \(${fmtP([x2, y2])}\).`],
      _ell: w => egy(w * (m * w + n), Pr) };
  } };

  feladatok.ketmasod = { nev: 'Két másodfokú egyenlet', szint: 'emelt', general() {
    // x² + y² = R, x² + k y = M → kivonva: y² − k y − (R − M) = 0, gyökei y1, y2
    for (let g = 0; g < 200; g++) {
      const x0 = R(1, 6), y1 = R0(-5, 5); let y2; do { y2 = R0(-6, 6); } while (y2 === y1);
      const R2 = x0 * x0 + y1 * y1, k = y1 + y2, M = R2 + y1 * y2;
      if (k === 0) continue;
      const pk = []; [y1, y2].forEach(y => { const x2 = R2 - y * y; if (x2 > 0) pk.push([-Math.sqrt(x2), y], [Math.sqrt(x2), y]); else if (x2 === 0) pk.push([0, y]); });
      const t = R(0, 1);
      const ys = [...new Set(pk.map(p => p[1]))].sort((a, b) => a - b);
      const xT = x => Number.isInteger(x) ? String(x) : (x < 0 ? '-' : '') + T`\sqrt{${Math.round(x * x)}}`;
      const lista = pk.map(([x, y]) => T`\((${xT(x)};\,${y})\)`).join(', ');
      return { kerdes: t ? T`<p>Hány megoldáspárja van az egyenletrendszernek a valós számpárok halmazán?</p>` + rendsz(T`x^2+y^2=${R2}`, T`x^2${k === 1 ? '+' : k === -1 ? '-' : el(k)}y=${M}`) : kerdesX('második (y) koordinátáit') + rendsz(T`x^2+y^2=${R2}`, T`x^2${k === 1 ? '+' : k === -1 ? '-' : el(k)}y=${M}`),
        valasz: { ertekek: t ? [pk.length] : ys }, formatum: t ? FMT10.egesz : FMT10.halmaz,
        tipp: T`Vond ki a második egyenletet az elsőből: \(x^2\) kiesik, és \(y\)-ra másodfokú egyenletet kapsz. Utána \(x^2=${R2}-y^2\): ez csak akkor ad megoldást, ha nem negatív.`,
        megoldas: [T`Kivonva: \(${q2(1, -k, 0, 'y')}=${R2 - M}\Rightarrow ${q2(1, -k, M - R2)}=0\Rightarrow y_1=${y1},\ y_2=${y2}\).`,
          ...[y1, y2].map(y => R2 - y * y >= 0 ? T`\(y=${y}\): \(x^2=${R2 - y * y}\)${R2 - y * y === 0 ? T`, \(x=0\)` : T`, \(x=\pm${xT(Math.sqrt(R2 - y * y))}\)`}.` : T`\(y=${y}\): \(x^2=${R2 - y * y}<0\), nincs megoldás.`),
          T`Megoldáspárok (${pk.length} db): ${lista}.`],
        _ell: w => t ? w === pk.length : pk.some(p => egy(p[1], w)) };
    }
    return feladatok.behely.general();
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mrendszer',
    cim: 'Másodfokú egyenletrendszerek',
    rovid: 'Egyenletrendszerek',
    bevezeto: T`Ha az egyenletrendszer egyik egyenlete másodfokú, a behelyettesítő módszerrel többnyire egy másodfokú egyenlethez jutunk – így a megoldáspárok száma 0, 1 vagy 2 is lehet.`,
    elmelet: T`<div class="prose"><ol>
<li>Az <b>elsőfokú</b> egyenletből fejezd ki az egyik ismeretlent (amelyiket a legkönnyebb).</li>
<li>Helyettesítsd be a másodfokú egyenletbe, és oldd meg a kapott egyismeretlenes egyenletet.</li>
<li>Mindegyik gyökhöz számold ki a másik ismeretlen értékét (a kifejezett alakból!).</li>
<li>A megoldás <b>számpárok</b> halmaza: \((x;y)\).</li></ol></div>
<div class="mathbox">\[\begin{cases}x+y=7\\ x\cdot y=12\end{cases}\quad\Rightarrow\quad x(7-x)=12\quad\Rightarrow\quad x^2-7x+12=0\]</div>
<div class="prose"><ul>
<li>\(x+y=S\), \(xy=P\) esetén \(x\) és \(y\) a \(t^2-St+P=0\) egyenlet két gyöke (Viète-formulák).</li>
<li>Geometriai jelentés: \(y=mx+n\) és \(y=x^2+px+q\) esetén az egyenes és a parabola közös pontjait keressük: 2 metszéspont, érintés, vagy nincs közös pont.</li>
<li>Két másodfokú egyenletnél gyakran segít, ha kivonjuk őket egymásból (\(x^2\) kiesik).</li></ul></div>`,
    igazHamis: [
      { allitas: T`Egy egyenes és egy parabola legfeljebb két közös pontban metszheti egymást.`, igaz: true, miert: T`A behelyettesítés után másodfokú (vagy elsőfokú) egyenletet kapunk, amelynek legfeljebb két gyöke van.` },
      { allitas: T`Az \(x+y=7\), \(xy=12\) egyenletrendszernek egyetlen megoldása van: \((3;4)\).`, igaz: false, miert: T`A \((4;3)\) számpár is megoldás.` },
      { allitas: T`Ha a behelyettesítés után kapott másodfokú egyenlet diszkriminánsa negatív, az egyenletrendszernek nincs valós megoldása.`, igaz: true, miert: T`Nincs olyan \(x\), amelyhez tartozna megoldáspár.` },
      { allitas: T`Az egyenletrendszer megoldása egyetlen szám.`, igaz: false, miert: T`Kétismeretlenes rendszer megoldása számpár: \((x;y)\).` },
      { allitas: T`Az \(x^2+y^2=25\), \(x+y=7\) rendszer megoldásai \((3;4)\) és \((4;3)\).`, igaz: true, miert: T`\(9+16=25\) és \(3+4=7\); szimmetria miatt a csere is jó.` },
      { general() { const [a, b] = kulonbozo(2, -6, 6); const jo = R(0, 1) === 1; const y = jo ? b : b + P([-1, 1]);
        return { allitas: T`Az \(x+y=${a + b}\), \(xy=${a * b}\) egyenletrendszer egyik megoldása \((${a};\,${y})\).`, igaz: y === b, miert: T`Ellenőrzés: \(${a}+${zj(y)}=${a + y}\), \(${a}\cdot ${zj(y)}=${a * y}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Oldjuk meg: \(\begin{cases}x+2y=3\\ x^2+y=2\end{cases}\)`,
      lepesek: [
        T`Az első egyenletből: \(x=3-2y\).`,
        T`Behelyettesítve a másodikba: \((3-2y)^2+y=2\Rightarrow 9-12y+4y^2+y=2\Rightarrow 4y^2-11y+7=0\).`,
        T`\(y_{1,2}=\frac{11\pm\sqrt{121-112}}{8}=\frac{11\pm3}{8}\): \(y_1=\frac74\), \(y_2=1\).`,
        T`\(y_1=\frac74\Rightarrow x=3-\frac72=-\frac12\); \(y_2=1\Rightarrow x=1\).`,
        T`A megoldáspárok: \(\left(-\frac12;\frac74\right)\) és \((1;1)\).`
      ]
    },
    feladatok
  }));
})();
