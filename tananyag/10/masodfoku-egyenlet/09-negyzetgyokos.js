/*
 * 9. fejezet – Négyzetgyökös egyenletek
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 7. lecke; FGY 2198–2207; OH 34–36.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, el, tg, zj, kulonbozo, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;
  const KERD = T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket; ha nincs, írd: nincs.</p>`;
  const gyk = (a, b) => T`\sqrt{${l1(a, b)}}`;
  const valasz = g => g.length ? { ertekek: g.slice().sort((x, y) => x - y) } : { nincs: true };
  const sq = x => x >= -1e-12 ? Math.sqrt(Math.max(0, x)) : NaN;

  feladatok.alap = { nev: 'Egyszerű gyökös egyenlet', general() {
    const a = P([1, 1, 2, 3, 4, 5, -1, -2]); const nincs = R(0, 5) === 0;
    let x0, c, b; do { x0 = R(-8, 12); c = R(0, 7); b = c * c - a * x0; } while (Math.abs(b) > 40);
    const d = R(0, 2) === 0 ? R0(-6, 6) : 0;   // √(…) + d = c + d alak
    const cc = nincs ? -R(1, 6) : c;
    const eq = d ? T`${gyk(a, b)}${el(d)}=${cc + d}` : T`${gyk(a, b)}=${cc}`;
    return { kerdes: KERD + T`\[${eq}\]`, valasz: nincs ? { nincs: true } : { ertekek: [x0] }, formatum: FMT10.halmaz,
      tipp: T`Ha a gyök egyedül áll az egyik oldalon, és a másik oldal nemnegatív, négyzetre emelhetsz. Egy négyzetgyök értéke sosem negatív!`,
      megoldas: nincs ? [d ? T`Rendezve: \(${gyk(a, b)}=${cc}\).` : '', T`A bal oldal (négyzetgyök) nem lehet negatív, a jobb oldal negatív: nincs megoldás.`].filter(Boolean)
        : [d ? T`Rendezve: \(${gyk(a, b)}=${c}\).` : '', T`\[${l1(a, b)}=${c * c}\quad\Rightarrow\quad x=${x0}\]`, T`Ellenőrzés: \(\sqrt{${a * x0 + b}}=${c}\). ✓`].filter(Boolean),
      _ell: w => w === 'nincs' ? nincs : egy(sq(a * w + b) + d, cc + d) };
  } };

  feladatok.linearis = { nev: 'Gyök = elsőfokú kifejezés', general() {
    // (x + c)² = a x + b gyökei x0 (jó) és x1 (jó vagy hamis)
    for (let g = 0; g < 300; g++) {
      const c = R(-6, 6); const x0 = R(-c, -c + 9); const hamis = R(0, 2) > 0;
      const x1 = hamis ? R(-c - 9, -c - 1) : R(-c, -c + 9);
      if (x1 === x0) continue;
      const a = 2 * c + x0 + x1, b = c * c - x0 * x1;
      if (a === 0 || Math.abs(b) > 60) continue;
      const jo = [x0, x1].filter(x => x + c >= 0);
      const jobb = R(0, 3) === 0 ? null : l1(1, c);
      const eq = jobb ? T`${gyk(a, b)}=${jobb}` : T`${gyk(a, b)}${tg(-1)}=${c}`;   // √(…) − x = c alak is
      return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(jo), formatum: FMT10.halmaz,
        tipp: T`Kikötés: a jobb oldal nem lehet negatív (\(x${el(c)}\ge0\)), és a gyök alatt sem állhat negatív szám. Négyzetre emelés után <b>ellenőrizz</b>!`,
        megoldas: [jobb ? '' : T`Rendezve: \(${gyk(a, b)}=${l1(1, c)}\).`, T`Négyzetre emelve: \(${l1(a, b)}=\left(${l1(1, c)}\right)^2=${q2(1, 2 * c, c * c)}\).`,
          T`Rendezve: \(${q2(1, 2 * c - a, c * c - b)}=0\Rightarrow x=${x0}\) vagy \(x=${x1}\).`,
          hamis ? T`Ellenőrzés: \(x=${x1}\) esetén a jobb oldal \(${x1 + c}<0\), így ez hamis gyök. A megoldás: \(x=${x0}\).` : T`Ellenőrzés: mindkét gyök esetén a jobb oldal nemnegatív, és a gyök értéke valóban egyenlő vele.`].filter(Boolean),
        _ell: w => egy(sq(a * w + b), w + c), _mind: vs => vs.length === jo.length || 'darab' };
    }
    return feladatok.alap.general();
  } };

  feladatok.ketgyok = { nev: 'Két gyök egyenlősége', general() {
    let a, b, c, d, x0;
    do { a = R0(-5, 6); c = R0(-5, 6); x0 = R(-8, 10); b = R(-15, 15); d = a * x0 + b - c * x0; } while (a === c || Math.abs(d) > 40);
    const ok = a * x0 + b >= 0;   // ha negatív, nincs megoldás
    return { kerdes: KERD + T`\[${gyk(a, b)}=${gyk(c, d)}\]`, valasz: ok ? { ertekek: [x0] } : { nincs: true }, formatum: FMT10.halmaz,
      tipp: T`Négyzetre emelve elsőfokú egyenletet kapsz. A végén ellenőrizd, hogy a gyök alatt nem áll-e negatív szám!`,
      megoldas: [T`\[${l1(a, b)}=${l1(c, d)}\quad\Rightarrow\quad x=${x0}\]`, ok ? T`Ellenőrzés: mindkét oldalon \(\sqrt{${a * x0 + b}}\) áll. ✓` : T`Ellenőrzés: \(x=${x0}\) esetén a gyök alatt \(${a * x0 + b}<0\) állna, ezért nincs megoldás.`],
      _ell: w => w === 'nincs' ? !ok : egy(sq(a * w + b), sq(c * w + d)) };
  } };

  feladatok.osszeg = { nev: 'Két gyök összege, különbsége', general() {
    // √(x + p) ± √(x + q) = k, egyetlen megoldás x0
    const s = R(0, 7); let t; do { t = R(0, 7); } while (t === s);
    const x0 = R(-6, 10); const p = s * s - x0, q = t * t - x0; const kul = R(0, 1) === 1 && s > t;
    const k = kul ? s - t : s + t;
    const eq = kul ? T`\sqrt{${l1(1, p)}}-\sqrt{${l1(1, q)}}=${k}` : T`\sqrt{${l1(1, p)}}+\sqrt{${l1(1, q)}}=${k}`;
    return { kerdes: KERD + T`\[${eq}\]`, valasz: { ertekek: [x0] }, formatum: FMT10.halmaz,
      tipp: T`Vidd át az egyik gyököt a másik oldalra, és emeld négyzetre! Így egy gyök marad – azt rendezd egyedül, és emeld újra négyzetre.`,
      megoldas: [T`\[\sqrt{${l1(1, p)}}=${k}${kul ? '+' : '-'}\sqrt{${l1(1, q)}}\]`,
        T`Négyzetre emelve és rendezve: \(${kul ? '' : '-'}${2 * k}\sqrt{${l1(1, q)}}=${p - k * k - q}\), ebből \(\sqrt{${l1(1, q)}}=${t}\).`,
        T`\[${l1(1, q)}=${t * t}\quad\Rightarrow\quad x=${x0}\]`, T`Ellenőrzés: \(\sqrt{${s * s}}${kul ? '-' : '+'}\sqrt{${t * t}}=${s}${kul ? '-' : '+'}${t}=${k}\). ✓`],
      _ell: w => egy(sq(w + p) + (kul ? -1 : 1) * sq(w + q), k) };
  } };

  feladatok.ujvalt = { nev: 'Új ismeretlen bevezetése', general() {
    // x + b√x + c = 0, y = √x ≥ 0; y-gyökök: y1 > 0, y2 lehet negatív
    const y1 = R(1, 9); let y2; do { y2 = R(-8, 9); } while (y2 === y1 || y2 === 0);
    const b = -(y1 + y2), c = y1 * y2; const k = P([1, 1, 1, 2]);
    const eq = T`${k === 1 ? '' : k}x${b === 0 ? '' : (b < 0 ? '-' : '+') + (Math.abs(k * b) === 1 ? '' : Math.abs(k * b)) + T`\sqrt{x}`}${el(k * c)}=0`;
    const jo = [y1, y2].filter(y => y > 0).map(y => y * y);
    return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(jo), formatum: FMT10.halmaz,
      tipp: T`Legyen \(y=\sqrt{x}\ (y\ge0)\). Ekkor \(x=y^2\), és \(y\)-ra másodfokú egyenletet kapsz.`,
      megoldas: [T`\(y=\sqrt{x}\ge0\): \(${q2(k, k * b, k * c, 'y')}=0\Rightarrow y_1=${y1},\ y_2=${y2}\).`,
        y2 < 0 ? T`Az \(y_2=${y2}<0\) nem lehet (a gyök nem negatív). \(\sqrt{x}=${y1}\Rightarrow x=${y1 * y1}\).` : T`\(\sqrt{x}=${y1}\Rightarrow x=${y1 * y1}\); \(\sqrt{x}=${y2}\Rightarrow x=${y2 * y2}\).`],
      _ell: w => w >= 0 && egy(k * w + k * b * Math.sqrt(w) + k * c, 0) };
  } };

  feladatok.abszolut = { nev: 'Teljes négyzet a gyök alatt', general() {
    const p = R(-6, 6); const t = R(0, 2);
    const rad = q2(1, -2 * p, p * p);
    if (t < 2) {   // √((x−p)²) = k
      const k = R(0, 8); const neg = R(0, 6) === 0;
      const g = neg ? [] : (k === 0 ? [p] : [p - k, p + k]);
      return { kerdes: KERD + T`\[\sqrt{${rad}}=${neg ? -R(1, 5) : k}\]`, valasz: valasz(g), formatum: FMT10.halmaz,
        tipp: T`A gyök alatt teljes négyzet áll: \(${rad}=\left(x${el(-p)}\right)^2\). És \(\sqrt{A^2}=|A|\)!`,
        megoldas: neg ? [T`A négyzetgyök értéke nem lehet negatív: nincs megoldás.`] : [T`\[\sqrt{\left(x${el(-p)}\right)^2}=\left|x${el(-p)}\right|=${k}\]`, k === 0 ? T`\(x=${p}\)` : T`\(x${el(-p)}=${k}\) vagy \(x${el(-p)}=-${k}\), tehát \(x=${p + k}\) vagy \(x=${p - k}\).`],
        _ell: w => w === 'nincs' ? (neg || g.length === 0) : egy(Math.abs(w - p), k) && !neg };
    }
    // √((x−p)²) = m x + c → |x − p| = m x + c
    let m, c, jel = [];
    for (let g0 = 0; g0 < 50 && !jel.length; g0++) { m = P([2, 3, -2, -3, 0, 0]); jel = []; for (let cc = -8; cc <= 8; cc++) if ((p + cc) % (1 - m) === 0 && (p - cc) % (1 + m) === 0) jel.push(cc); }
    c = P(jel);
    const x1 = (p + c) / (1 - m), x2 = (p - c) / (1 + m);   // x − p = m x + c (x ≥ p), illetve p − x = m x + c (x < p)
    const g = [...new Set([x1 >= p ? x1 : null, x2 < p ? x2 : null].filter(x => x !== null))];
    const jobb = m === 0 ? String(c) : l1(m, c);
    return { kerdes: KERD + T`\[\sqrt{${rad}}=${jobb}\]`, valasz: valasz(g), formatum: FMT10.halmaz,
      tipp: T`\(\sqrt{${rad}}=\left|x${el(-p)}\right|\). Vizsgáld külön az \(x\ge${p}\) és az \(x<${p}\) esetet!`,
      megoldas: [T`\[\left|x${el(-p)}\right|=${jobb}\]`, T`Ha \(x\ge${p}\): \(x${el(-p)}=${jobb}\Rightarrow x=${x1}\)${x1 >= p ? ' – megfelel.' : T` – ez nem teljesíti az \(x\ge${p}\) feltételt.`}`,
        T`Ha \(x<${p}\): \(-x${el(p)}=${jobb}\Rightarrow x=${x2}\)${x2 < p ? ' – megfelel.' : T` – ez nem teljesíti az \(x<${p}\) feltételt.`}`],
      _ell: w => w === 'nincs' ? g.length === 0 : egy(Math.abs(w - p), m * w + c), _mind: vs => vs.length === g.length || 'darab' };
  } };

  feladatok.egyenlotlenseg = { nev: 'Négyzetgyökös egyenlőtlenség', szint: 'emelt', general() {
    const a = P([1, 2, 3, 4, 5]); const b = R(-10, 10); const c = R(1, 6); const rel = P(['lt', 'le']);
    // √(ax + b) < c ⇔ 0 ≤ ax + b < c²
    const ok = n => a * n + b >= 0 && (rel === 'lt' ? a * n + b < c * c : a * n + b <= c * c);
    const ints = []; for (let n = Math.ceil(-b / a) - 1; n <= Math.ceil((c * c - b) / a) + 1; n++) if (ok(n)) ints.push(n);
    return { kerdes: T`<p>Hány egész szám elégíti ki az egyenlőtlenséget?</p>\[${gyk(a, b)}${rel === 'lt' ? '<' : T`\le `}${c}\]`,
      valasz: { ertekek: [ints.length] }, formatum: FMT10.egesz,
      tipp: T`Két feltétel: a gyök alatt nemnegatív szám áll (\(${l1(a, b)}\ge0\)), és a négyzetre emelt egyenlőtlenség is teljesül.`,
      megoldas: [T`\[0\le ${l1(a, b)}${rel === 'lt' ? '<' : T`\le `}${c * c}\quad\iff\quad ${ft(F(-b, a))}\le x${rel === 'lt' ? '<' : T`\le `}${ft(F(c * c - b, a))}\]`, T`Egész megoldások: \(${ints.join(';\\ ') || '–'}\), összesen ${ints.length}.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mgyokos',
    cim: 'Négyzetgyökös egyenletek',
    rovid: 'Négyzetgyökös egyenletek',
    bevezeto: T`A négyzetre emelés nem ekvivalens átalakítás: új, „hamis” gyökök keletkezhetnek. Ezért a négyzetgyökös egyenleteknél az ellenőrzés a megoldás része!`,
    elmelet: T`<div class="prose"><ol>
<li><b>Értelmezési tartomány:</b> a gyök alatt nem állhat negatív szám.</li>
<li><b>Rendezés:</b> a gyökös tag kerüljön egyedül az egyik oldalra.</li>
<li><b>Feltétel:</b> a másik oldal sem lehet negatív (\(\sqrt{A}\ge0\)).</li>
<li><b>Négyzetre emelés</b>, majd a kapott egyenlet megoldása.</li>
<li><b>Ellenőrzés</b> az eredeti egyenletbe helyettesítéssel.</li></ol></div>
<div class="mathbox">\[\sqrt{x+2}=x-4\ \Rightarrow\ x+2=x^2-8x+16\ \Rightarrow\ x^2-9x+14=0\ \Rightarrow\ x=7\ \text{vagy}\ x=2\]</div>
<div class="prose"><ul>
<li>Ellenőrzés: \(x=7\): \(\sqrt9=3=7-4\) ✓; \(x=2\): \(\sqrt4=2\neq-2\) ✗ (hamis gyök).</li>
<li>\(\sqrt{A^2}=|A|\), például \(\sqrt{x^2-4x+4}=|x-2|\).</li>
<li>Ha \(\sqrt{x}\) és \(x\) is szerepel, vezess be új ismeretlent: \(y=\sqrt{x}\), \(x=y^2\), \(y\ge0\).</li>
<li>Két gyök esetén: egyiket átviszed, négyzetre emelsz, a maradék gyököt elkülöníted, és újra négyzetre emelsz.</li></ul></div>`,
    igazHamis: [
      { allitas: T`A \(\sqrt{x}=-3\) egyenlet megoldása \(x=9\).`, igaz: false, miert: T`\(\sqrt9=3\neq-3\). A négyzetgyök nem lehet negatív: nincs megoldás.` },
      { allitas: T`A négyzetre emelés ekvivalens átalakítás.`, igaz: false, miert: T`Hamis gyök keletkezhet: \(x=2\) után \(x^2=4\)-nek \(x=-2\) is megoldása.` },
      { allitas: T`\(\sqrt{(x-3)^2}=x-3\) minden valós \(x\)-re.`, igaz: false, miert: T`\(\sqrt{(x-3)^2}=|x-3|\), ami \(x<3\) esetén \(3-x\).` },
      { allitas: T`\(\sqrt{a+b}=\sqrt a+\sqrt b\) minden nemnegatív \(a\), \(b\) esetén.`, igaz: false, miert: T`Például \(\sqrt{9+16}=5\), de \(\sqrt9+\sqrt{16}=7\).` },
      { allitas: T`A négyzetgyökös egyenletek megoldásait mindig ellenőrizni kell.`, igaz: true, miert: 'A négyzetre emelés miatt hamis gyök keletkezhet.' },
      { allitas: T`Ha \(y=\sqrt{x}\), akkor \(y\) negatív értéke nem ad megoldást.`, igaz: true, miert: T`\(\sqrt{x}\ge0\) minden értelmezett \(x\)-re.` },
      { general() { const s = R(1, 9), k = R(-5, 5); const x0 = s * s - k; const jo = R(0, 1) === 1;
        return { allitas: T`A \(\sqrt{${l1(1, k)}}=${s}\) egyenlet megoldása \(x=${jo ? x0 : x0 + P([-2, -1, 1, 2])}\).`, igaz: jo, miert: T`\(${l1(1, k)}=${s * s}\Rightarrow x=${x0}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Oldjuk meg: \(\sqrt{2x+3}=x\)`,
      lepesek: [
        T`Feltétel: \(2x+3\ge0\) és \(x\ge0\) (a jobb oldal sem lehet negatív).`,
        T`Négyzetre emelve: \(2x+3=x^2\Rightarrow x^2-2x-3=0\Rightarrow x=3\) vagy \(x=-1\).`,
        T`Az \(x=-1\) nem teljesíti az \(x\ge0\) feltételt (\(\sqrt1=1\neq-1\)), hamis gyök.`,
        T`Ellenőrzés \(x=3\)-ra: \(\sqrt9=3\). ✓ A megoldás: \(x=3\).`
      ]
    },
    feladatok
  }));
})();
