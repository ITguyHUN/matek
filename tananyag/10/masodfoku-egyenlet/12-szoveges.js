/*
 * 12. fejezet – Másodfokú egyenletre vezető problémák (szöveges feladatok)
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 10. lecke; FGY 2223–2240)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, el, zj, kulonbozo, az, Az, vel, szer, szerese, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;
  const PIT = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [20, 21, 29], [9, 40, 41], [15, 20, 25], [10, 24, 26], [12, 35, 37]];

  feladatok.szamok = { nev: 'Számokra vonatkozó feladatok', general() {
    const t = R(0, 3);
    if (t === 0) {   // különbség d, szorzat P → (a; a − d) két megoldás
      const b = R(1, 15), d = R(2, 14); const a = b + d; const Pr = a * b;
      return { kerdes: T`<p>Két szám különbsége \(${d}\), szorzatuk \(${Pr}\). Melyik lehet a <b>nagyobbik</b> szám? (Minden lehetőséget adj meg.)</p>`,
        valasz: { ertekek: [-b, a] }, formatum: FMT10.halmaz,
        tipp: T`Legyen a nagyobbik szám \(x\), a kisebbik \(x-${d}\). Ekkor \(x(x-${d})=${Pr}\). Negatív megoldás is lehet!`,
        megoldas: [T`\[x(x-${d})=${Pr}\quad\Rightarrow\quad ${q2(1, -d, -Pr)}=0\quad\Rightarrow\quad x_1=${a},\ x_2=${-b}\]`, T`A számpárok: \(${a}\) és \(${b}\), illetve \(${-b}\) és \(${-a}\).`],
        _ell: w => egy(w * (w - d), Pr) };
    }
    if (t === 1) {   // összeg S, négyzetösszeg Q
      const [a, b] = kulonbozo(2, 1, 20).sort((x, y) => y - x); const S = a + b, Q = a * a + b * b;
      return { kerdes: T`<p>Két szám összege \(${S}\), négyzetösszegük \(${Q}\). Melyik ez a két szám? (A két számot pontosvesszővel elválasztva add meg.)</p>`,
        valasz: { ertekek: [b, a] }, formatum: FMT10.halmaz,
        tipp: T`Legyen az egyik \(x\), a másik \(${S}-x\): \(x^2+(${S}-x)^2=${Q}\).`,
        megoldas: [T`\[x^2+(${S}-x)^2=${Q}\quad\Rightarrow\quad ${q2(2, -2 * S, S * S - Q)}=0\quad\Rightarrow\quad x_1=${a},\ x_2=${b}\]`, T`A két szám: \(${a}\) és \(${b}\).`],
        _ell: w => egy(w * w + (S - w) ** 2, Q) };
    }
    if (t === 2) {   // két szomszédos egész szorzata k-val több, mint összegük m-szerese
      const n = R(-12, 15), m = P([2, 3, 5, 10]); const k = n * (n + 1) - m * (2 * n + 1);
      // x(x+1) − m(2x+1) = k → x² + (1−2m)x − m − k = 0
      const B = 1 - 2 * m, C = -m - k; const D = B * B - 4 * C; const s = Math.sqrt(D); const x2 = (-B - s) / 2, x1 = (-B + s) / 2;
      const gy = [x1, x2].filter(x => Number.isInteger(x));
      return { kerdes: T`<p>Két szomszédos egész szám szorzata ${vel(Math.abs(k))} ${k >= 0 ? 'több' : 'kevesebb'}, mint az összegük ${szerese(m)}. Melyik lehet a <b>kisebbik</b> szám? (Minden lehetőséget adj meg.)</p>`,
        valasz: { ertekek: gy.sort((u, v) => u - v) }, formatum: FMT10.halmaz,
        tipp: T`A két szám \(x\) és \(x+1\): \(x(x+1)=${m}(2x+1)${el(k)}\).`,
        megoldas: [T`\[x(x+1)=${m}(2x+1)${el(k)}\quad\Rightarrow\quad ${q2(1, B, C)}=0\]`, T`Gyökök: \(${gy.join(T`;\ `)}\). A számpárok: ${gy.map(x => T`\(${x}\) és \(${x + 1}\)`).join(', illetve ')}.`],
        _ell: w => Number.isInteger(w) && egy(w * (w + 1), m * (2 * w + 1) + k) };
    }
    // egy szám és a nála 1-gyel (k-val) nagyobb szám szorzata d-vel több, mint az eredeti szám
    const k = P([1, 2, 3]); const x0 = R(2, 12); const d = x0 * (x0 + k) - x0;
    const B = k - 1, C = -d; const D = B * B - 4 * C; const s = Math.sqrt(D); const gy = [(-B - s) / 2, (-B + s) / 2].filter(Number.isInteger);
    return { kerdes: T`<p>Ha egy számot megszorzunk a nála ${vel(k)} nagyobb számmal, a szorzat ${vel(d)} lesz nagyobb az eredeti számnál. Melyik ez a szám? (Minden lehetőséget adj meg.)</p>`,
      valasz: { ertekek: gy.length === 2 ? gy : [x0] }, formatum: FMT10.halmaz,
      tipp: T`\(x(x+${k})=x+${d}\)`,
      megoldas: [T`\[x(x+${k})=x+${d}\quad\Rightarrow\quad ${q2(1, B, C)}=0\]`, T`\[${gy.length === 2 ? T`x_1=${gy[1]},\ x_2=${gy[0]}` : T`x=${x0}`}\]`],
      _ell: w => egy(w * (w + k), w + d) };
  } };

  feladatok.geometria = { nev: 'Geometriai feladatok', general() {
    const t = R(0, 3);
    if (t === 0) { const [p, q, r] = P(PIT); const m = P([1, 1, 2, 3]); const a = p * m, b = q * m, c = r * m; const Tr = a * b / 2;
      return { kerdes: T`<p>Egy derékszögű háromszög területe \(${Tr}\ \text{cm}^2\), átfogója \(${c}\) cm. Mekkora a <b>rövidebb</b> befogója (cm)?</p>`,
        valasz: { ertekek: [Math.min(a, b)] }, formatum: 'szám (cm)',
        tipp: T`\(ab=${2 * Tr}\) és \(a^2+b^2=${c * c}\). Fejezd ki \(b\)-t az elsőből, vagy használd: \((a+b)^2=a^2+b^2+2ab\).`,
        megoldas: [T`\[a^2+\left(\frac{${2 * Tr}}{a}\right)^2=${c * c}\quad\Rightarrow\quad a^4-${c * c}a^2+${(2 * Tr) ** 2}=0\]`, T`\(a^2=${a * a}\) vagy \(a^2=${b * b}\): a befogók \(${a}\) és \(${b}\) cm.`],
        _ell: w => egy(w, Math.min(a, b)) }; }
    if (t === 1) { const a = R(2, 25); let b; do { b = R(2, 30); } while (b === a); const K = 2 * (a + b), Tr = a * b;
      return { kerdes: T`<p>Egy téglalap kerülete \(${K}\) cm, területe \(${Tr}\ \text{cm}^2\). Mekkora a <b>hosszabb</b> oldala (cm)?</p>`,
        valasz: { ertekek: [Math.max(a, b)] }, formatum: 'szám (cm)', tipp: T`Az oldalak összege \(${a + b}\), szorzata \(${Tr}\): \(x(${a + b}-x)=${Tr}\).`,
        megoldas: [T`\[x(${a + b}-x)=${Tr}\quad\Rightarrow\quad ${q2(1, -(a + b), Tr)}=0\quad\Rightarrow\quad x=${a}\ \text{vagy}\ x=${b}\]`, T`Az oldalak: \(${Math.min(a, b)}\) cm és \(${Math.max(a, b)}\) cm.`] }; }
    if (t === 2) { const x = R(3, 20), d = R(1, 9); const S = x * x + (x + d) ** 2;
      return { kerdes: T`<p>Két négyzet területének összege \(${S}\ \text{cm}^2\). Az egyik négyzet oldala \(${d}\) cm-rel nagyobb, mint a másiké. Mekkora a <b>kisebbik</b> négyzet oldala (cm)?</p>`,
        valasz: { ertekek: [x] }, formatum: 'szám (cm)', tipp: T`\(x^2+(x+${d})^2=${S}\)`,
        megoldas: [T`\[x^2+(x+${d})^2=${S}\quad\Rightarrow\quad ${q2(2, 2 * d, d * d - S)}=0\]`, T`A pozitív gyök: \(x=${x}\) cm (a negatív gyök nem lehet oldalhossz).`], _ell: w => w > 0 && egy(w * w + (w + d) ** 2, S) }; }
    // téglalap: oldalak különbsége d, átló e
    const [p, q, r] = P(PIT); const m = P([1, 1, 2, 3]); const a = p * m, b = q * m, e = r * m;
    return { kerdes: T`<p>Egy téglalap egyik oldala \(${b - a}\) cm-rel hosszabb a másiknál, átlója \(${e}\) cm. Mekkora a téglalap <b>területe</b> (\(\text{cm}^2\))?</p>`,
      valasz: { ertekek: [a * b] }, formatum: 'szám (cm²)', tipp: T`Pitagorasz-tétel: \(x^2+(x+${b - a})^2=${e}^2\).`,
      megoldas: [T`\[x^2+(x+${b - a})^2=${e * e}\quad\Rightarrow\quad ${q2(2, 2 * (b - a), (b - a) ** 2 - e * e)}=0\quad\Rightarrow\quad x=${a}\]`, T`Az oldalak \(${a}\) és \(${b}\) cm, a terület \(${a * b}\ \text{cm}^2\).`] };
  } };

  feladatok.mozgas = { nev: 'Mozgásos feladatok', general() {
    // s/v − s/(v + dv) = dt → s·dv = dt·v·(v + dv)
    for (let g = 0; g < 300; g++) {
      const jarmu = P([['kerékpáros', 'kerékpározott', 10, 30, [2, 3, 4, 5]], ['autó', 'haladt', 40, 120, [5, 10, 15, 20]], ['vonat', 'haladt', 40, 120, [10, 15, 20, 30]], ['motoros', 'haladt', 30, 90, [5, 10, 15]]]);
      const v = R(jarmu[2], jarmu[3]), dv = P(jarmu[4]), dt = P([1, 1, 2, 3]);
      const s = dt * v * (v + dv) / dv; if (!Number.isInteger(s) || s > 1000 || s < 20) continue;
      const kerd = R(0, 1);
      return { kerdes: T`<p>Egy ${jarmu[0]} \(${s}\) km-es utat tett meg állandó sebességgel. Ha óránként \(${dv}\) km-rel többet tett volna meg, \(${dt}\) órával hamarabb ért volna célba. ${kerd ? 'Mekkora sebességgel (km/h) ' + jarmu[1] + '?' : 'Hány óráig tartott az út?'}</p>`,
        valasz: { ertekek: [kerd ? v : s / v] }, formatum: 'szám',
        tipp: T`Ha a sebesség \(v\), az idő \(\frac{${s}}{v}\). A gyorsabb változatnál \(\frac{${s}}{v+${dv}}\). A különbség \(${dt}\) óra.`,
        megoldas: [T`\[\frac{${s}}{v}-\frac{${s}}{v+${dv}}=${dt}\quad\Rightarrow\quad ${dt === 1 ? '' : dt}v(v+${dv})=${s * dv}\]`, T`\[${q2(dt, dt * dv, -s * dv, 'v')}=0\quad\Rightarrow\quad v=${v}\ \tfrac{\text{km}}{\text{h}}\]`, T`(A negatív gyök nem lehet sebesség.) Az út ideje: \(\frac{${s}}{${v}}=${nt(s / v)}\) óra.`],
        _ell: w => kerd ? egy(s / w - s / (w + dv), dt) : egy(w, s / v) };
    }
    return feladatok.geometria.general();
  } };

  const MUNKA = []; for (let x = 2; x <= 30; x++) for (let d = 1; d <= 30; d++) { const Tn = x * (x + d), Td = 2 * x + d; if (Tn % Td === 0) MUNKA.push([x, d, Tn / Td]); }
  feladatok.munka = { nev: 'Közös munka', general() {
    const [x, d, Tt] = P(MUNKA); const kerd = R(0, 1);
    const kik = P([['Anya és lánya', 'kitakarítják a lakást', 'az anyának', 'a lányának'], ['Két csap', 'megtölt egy medencét', 'az egyik csapnak', 'a másiknak'], ['Két festő', 'kifest egy termet', 'az egyik festőnek', 'a másiknak'], ['Két kombájn', 'learat egy táblát', 'az egyik gépnek', 'a másiknak']]);
    return { kerdes: T`<p>${kik[0]} együtt \(${Tt}\) óra alatt ${kik[1]}. Külön-külön dolgozva ${kik[2]} \(${d}\) órával kevesebb időre van szüksége, mint ${kik[3]}. Hány óra alatt végezne egyedül ${kerd ? 'a gyorsabb' : 'a lassabb'}?</p>`,
      valasz: { ertekek: [kerd ? x : x + d] }, formatum: 'szám (óra)',
      tipp: T`Ha a gyorsabbnak \(x\) óra kell, óránként a munka \(\frac1x\) részét végzi; a lassabb \(\frac{1}{x+${d}}\) részét. Együtt: \(\frac1x+\frac1{x+${d}}=\frac1{${Tt}}\).`,
      megoldas: [T`\[\frac1x+\frac1{x+${d}}=\frac1{${Tt}}\quad\Rightarrow\quad ${Tt}(2x+${d})=x(x+${d})\quad\Rightarrow\quad ${q2(1, d - 2 * Tt, -d * Tt)}=0\]`, T`A pozitív gyök \(x=${x}\): a gyorsabb ${x}, a lassabb ${x + d} óra alatt végezne.`],
      _ell: w => kerd ? egy(1 / w + 1 / (w + d), 1 / Tt) : egy(1 / w + 1 / (w - d), 1 / Tt) };
  } };

  feladatok.kombi = { nev: 'Átlók, mérkőzések, kézfogások', general() {
    const t = R(0, 3);
    if (t === 0) { const n = R(5, 30); const K = n * (n - 3) / 2;
      return { kerdes: T`<p>Hány oldalú az a konvex sokszög, amelynek \(${K}\) átlója van?</p>`, valasz: { ertekek: [n] }, formatum: FMT10.egesz,
        tipp: T`Egy \(n\) oldalú konvex sokszög átlóinak száma \(\frac{n(n-3)}{2}\).`,
        megoldas: [T`\[\frac{n(n-3)}{2}=${K}\quad\Rightarrow\quad n^2-3n-${2 * K}=0\quad\Rightarrow\quad n=${n}\]`, '(A negatív gyök nem lehet oldalszám.)'], _ell: w => egy(w * (w - 3) / 2, K) }; }
    if (t === 1) { const n = R(4, 30); const M = n * (n - 1) / 2; const kk = P(['Egy bajnokságban minden csapat egyszer játszott mindegyik másikkal', 'Egy társaságban mindenki mindenkivel egyszer kezet fogott', 'Egy sakkversenyen mindenki mindenkivel egy partit játszott']);
      return { kerdes: T`<p>${kk}, összesen \(${M}\) alkalommal. Hány ${kk.includes('csapat') ? 'csapat' : kk.includes('sakk') ? 'versenyző' : 'ember'} volt?</p>`, valasz: { ertekek: [n] }, formatum: FMT10.egesz,
        tipp: T`\(n\) résztvevő esetén a párok száma \(\frac{n(n-1)}{2}\).`,
        megoldas: [T`\[\frac{n(n-1)}{2}=${M}\quad\Rightarrow\quad n^2-n-${2 * M}=0\quad\Rightarrow\quad n=${n}\]`], _ell: w => egy(w * (w - 1) / 2, M) }; }
    if (t === 2) { // átlók száma k-val több, mint az oldalaké
      let n, k; do { n = R(6, 30); k = n * (n - 3) / 2 - n; } while (k <= 0);
      return { kerdes: T`<p>Hány oldalú az a konvex sokszög, amelynek ${vel(k)} több átlója van, mint oldala?</p>`,
        valasz: { ertekek: [n] }, formatum: FMT10.egesz, tipp: T`\(\frac{n(n-3)}{2}=n+${k}\)`,
        megoldas: [T`\[\frac{n(n-3)}{2}=n+${k}\quad\Rightarrow\quad n^2-5n-${2 * k}=0\quad\Rightarrow\quad n=${n}\]`], _ell: w => egy(w * (w - 3) / 2, w + k) }; }
    // két képviselő választása: ha kétszer annyian lennének, k-val több lehetőség
    const n = R(8, 35); const k = (2 * n) * (2 * n - 1) / 2 - n * (n - 1) / 2;
    return { kerdes: T`<p>Egy osztályból két képviselőt választanak. Ha kétszer annyian lennének az osztályban, ${vel(k)} több lehetőség lenne a két ember kiválasztására. Hányan vannak az osztályban?</p>`,
      valasz: { ertekek: [n] }, formatum: FMT10.egesz, tipp: T`\(n\) emberből \(\frac{n(n-1)}{2}\)-féleképpen választhatunk kettőt.`,
      megoldas: [T`\[\frac{2n(2n-1)}{2}-\frac{n(n-1)}{2}=${k}\quad\Rightarrow\quad 3n^2-n-${2 * k}=0\quad\Rightarrow\quad n=${n}\]`], _ell: w => egy(w * (2 * w - 1) - w * (w - 1) / 2, k) };
  } };

  feladatok.penz = { nev: 'Ár és mennyiség', general() {
    // S/(p − dp) − S/p = k → S·dp = k·p·(p − dp)
    for (let g = 0; g < 400; g++) {
      const p = 10 * R(5, 60), dp = 10 * R(1, 15), k = R(1, 12); if (dp >= p) continue;
      const S = k * p * (p - dp) / dp; if (!Number.isInteger(S) || S % 100 !== 0 || S > 30000 || S % p !== 0) continue;
      const tg = P([{ nom: 'muskátlipalánta', tobb: 'muskátlipalántákat', olcso: 'petúniát', acc: 'muskátlipalántát' }, { nom: 'füzet', tobb: 'füzeteket', olcso: 'spirálfüzetet', acc: 'füzetet' }, { nom: 'könyv', tobb: 'könyveket', olcso: 'zsebkönyvet', acc: 'könyvet' }, { nom: 'mozijegy', tobb: 'mozijegyeket', olcso: 'diákjegyet', acc: 'mozijegyet' }]);
      const kerd = R(0, 1);
      return { kerdes: T`<p>Eszter \(${bigT(S)}\) Ft-ért ${tg.tobb} vásárol. Ha a darabonként ${dp} Ft-tal olcsóbb ${tg.olcso} választaná, ${k} darabbal többet tudna venni. ${kerd ? `Mennyibe kerül egy ${tg.nom} (Ft)?` : `Hány darab ${tg.acc} tud venni?`}</p>`,
        valasz: { ertekek: [kerd ? p : S / p] }, formatum: 'egész szám',
        tipp: T`Ha a drágább ára \(x\) Ft, akkor \(\frac{${bigT(S)}}{x}\) darabot vehet; az olcsóbból \(\frac{${bigT(S)}}{x-${dp}}\) darabot.`,
        megoldas: [T`\[\frac{${bigT(S)}}{x-${dp}}-\frac{${bigT(S)}}{x}=${k}\quad\Rightarrow\quad ${bigT(S * dp)}=${k}x(x-${dp})\]`, T`\[${q2(k, -k * dp, 0)}-${bigT(S * dp)}=0\quad\Rightarrow\quad x=${p}\]`, T`Egy ${tg.nom} ${p} Ft, ebből \(${bigT(S)}:${p}=${S / p}\) darabot vehet.`],
        _ell: w => kerd ? egy(S / (w - dp) - S / w, k) : egy(w, S / p) };
    }
    return feladatok.kombi.general();
  } };

  feladatok.hajitas = { nev: 'Függőleges hajítás', general() {
    // h(t) = −5t² + v t + h0, földet ér T másodperc múlva
    const T0 = R(3, 12), v = 5 * R(1, 2 * T0 - 1); const h0 = 5 * T0 * T0 - v * T0; if (h0 <= 0) return feladatok.hajitas.general();
    const t = R(0, 2);
    const hmax = h0 + v * v / 20;
    const kerd = ['Hány másodperc múlva ér földet?', 'Milyen magasan (m, a földtől mérve) van a pálya legmagasabb pontja?', `Milyen magasan (m) lesz 2 másodperc múlva?`][t];
    const ans = t === 0 ? T0 : t === 1 ? hmax : -20 + 2 * v + h0;
    return { kerdes: T`<p>Egy \(${h0}\) méter magas toronyból függőlegesen fellőnek egy kis rakétát. A földtől mért magassága (méterben) \(t\) másodperc múlva: \(h(t)=-5t^2+${v}t+${h0}\). ${kerd}</p>`,
      valasz: { ertekek: [ans], tol: 0.006 }, formatum: 'szám',
      tipp: t === 0 ? T`Földet éréskor \(h(t)=0\); csak a pozitív gyök jó.` : t === 1 ? T`A legnagyobb magasság a parabola csúcspontja: \(t=-\frac{b}{2a}=\frac{${v}}{10}\).` : 'Helyettesíts be t = 2-t.',
      megoldas: t === 0 ? [T`\[-5t^2+${v}t+${h0}=0\quad\Rightarrow\quad ${q2(1, -v / 5, -h0 / 5, 't')}=0\quad\Rightarrow\quad t=${T0}\]`, '(A negatív gyök nem jó.)']
        : t === 1 ? [T`\[h(t)=-5\left(t-${nt(v / 10)}\right)^2+${nt(hmax)}\]`, T`A legnagyobb magasság \(${nt(hmax)}\) m, \(${nt(v / 10)}\) s-nál.`]
        : [T`\[h(2)=-5\cdot4+${v}\cdot2+${h0}=${ans}\ \text{m}\]`] };
  } };

  feladatok.szazalek = { nev: 'Kétszeri százalékos változás', szint: 'emelt', general() {
    const p = 5 * R(1, 12); const k = P([2, 3]); const t = R(0, 2) ? 0 : 1;
    if (t === 0) { const ossz = Math.round(((1 + p / 100) * (1 + k * p / 100) - 1) * 10000) / 100;
      return { kerdes: T`<p>Egy termék árát kétszer emelték: másodszor ${szer(k)} annyi százalékkal, mint először. A két emelés után az ár összesen \(${nt(ossz)}\%\)-kal lett magasabb. Hány százalékkal emelték az árat <b>először</b>?</p>`,
        valasz: { ertekek: [p] }, formatum: 'szám (százalék)', tipp: T`Ha először \(x\%\), akkor a szorzótényezők \(1+\frac{x}{100}\) és \(1+\frac{${k}x}{100}\); szorzatuk \(${nt(1 + ossz / 100)}\).`,
        megoldas: [T`\[\left(1+\frac{x}{100}\right)\left(1+\frac{${k}x}{100}\right)=${nt(1 + ossz / 100)}\]`, T`Rendezve (\(y=\frac{x}{100}\)): \(${k}y^2+${k + 1}y-${nt(ossz / 100)}=0\Rightarrow y=${nt(p / 100)}\), tehát \(x=${p}\%\).`],
        _ell: w => Math.abs((1 + w / 100) * (1 + k * w / 100) - 1 - ossz / 100) < 1e-9 }; }
    // emelés p%, majd csökkentés p/2 %-kal → összesen +r%
    const q = P([10, 20, 30, 40, 50, 60]); const r = Math.round(((1 + q / 100) * (1 - q / 200) - 1) * 10000) / 100;
    if (r <= 0) return feladatok.szazalek.general();
    return { kerdes: T`<p>Egy termék árát karácsony előtt felemelték, januárban pedig feleannyi százalékkal csökkentették, mint amennyivel emelték. A két változás után az ár \(${nt(r)}\%\)-kal lett magasabb az eredetinél. Hány százalékkal emelték az árat?</p>`,
      valasz: { ertekek: [q, 100 - q].filter(x => Math.abs((1 + x / 100) * (1 - x / 200) - 1 - r / 100) < 1e-9).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => a - b) }, formatum: FMT10.halmaz + ' (százalék)',
      tipp: T`\(\left(1+\frac{x}{100}\right)\left(1-\frac{x}{200}\right)=${nt(1 + r / 100)}\)`,
      megoldas: [T`\[\left(1+\frac{x}{100}\right)\left(1-\frac{x}{200}\right)=${nt(1 + r / 100)}\]`, T`Rendezve: \(x^2-100x+${nt(r * 200)}=0\Rightarrow x=${q}\) vagy \(x=${100 - q}\). Mindkettő értelmes megoldás lehet.`],
      _ell: w => Math.abs((1 + w / 100) * (1 - w / 200) - 1 - r / 100) < 1e-9 };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mszoveg',
    cim: 'Másodfokú egyenletre vezető problémák',
    rovid: 'Szöveges feladatok',
    bevezeto: T`A szöveges feladat megoldása négy lépés: ismeretlen választása → egyenlet felírása → megoldás → a kapott gyökök értelmezése a szöveg alapján (lehet-e negatív, egész stb.).`,
    elmelet: T`<div class="tbl"><table><tr><th>Témakör</th><th>Tipikus egyenlet</th></tr>
<tr><td>két szám, összeg és szorzat</td><td>\(x(S-x)=P\)</td></tr>
<tr><td>sokszög átlói</td><td>\(\frac{n(n-3)}{2}=k\)</td></tr>
<tr><td>mindenki mindenkivel</td><td>\(\frac{n(n-1)}{2}=k\)</td></tr>
<tr><td>mozgás (út, idő, sebesség)</td><td>\(\frac{s}{v}-\frac{s}{v+\Delta v}=\Delta t\)</td></tr>
<tr><td>közös munka</td><td>\(\frac1x+\frac1{x+d}=\frac1T\)</td></tr>
<tr><td>derékszögű háromszög</td><td>\(a^2+b^2=c^2\), \(T=\frac{ab}{2}\)</td></tr></table></div>
<div class="prose"><ul>
<li>A kapott gyökök közül csak az fogadható el, amely a szöveg feltételeinek is megfelel: oldalhossz, sebesség, idő pozitív; darabszám, oldalszám pozitív egész.</li>
<li>Írd le, mit jelöl az ismeretlen (mértékegységgel együtt)!</li>
<li>A végén szövegesen válaszolj, és ellenőrizd az eredményt a szöveg alapján!</li></ul></div>`,
    igazHamis: [
      { allitas: T`Egy 10 oldalú konvex sokszögnek 35 átlója van.`, igaz: true, miert: T`\(\frac{10\cdot7}{2}=35\).` },
      { allitas: T`Ha 8 csapat körmérkőzést játszik, 56 mérkőzés lesz.`, igaz: false, miert: T`\(\frac{8\cdot7}{2}=28\): minden párt csak egyszer számolunk.` },
      { allitas: T`Egy szöveges feladat egyenletének negatív gyöke is lehet a feladat megoldása, ha például hőmérsékletről van szó.`, igaz: true, miert: 'A szöveg dönti el, mely értékek értelmesek.' },
      { allitas: T`Ha egy munkát az egyik ember 3, a másik 6 óra alatt végez el, együtt 4,5 óra kell.`, igaz: false, miert: T`\(\frac13+\frac16=\frac12\): együtt 2 óra alatt végeznek.` },
      { general() { const n = R(4, 20); const jo = R(0, 1) === 1; const k = jo ? n * (n - 3) / 2 : n * (n - 1) / 2;
        return { allitas: T`Egy ${n} oldalú konvex sokszögnek ${k} átlója van.`, igaz: k === n * (n - 3) / 2, miert: T`\(\frac{${n}\cdot${n - 3}}{2}=${n * (n - 3) / 2}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy társaság 80 km-t kerékpározott. Ha óránként 4 km-rel többet tettek volna meg, 1 órával hamarabb értek volna célba. Mekkora volt a sebességük?`,
      lepesek: [T`Legyen a sebesség \(v\) km/h. Az idő \(\frac{80}{v}\) óra, a gyorsabb változatnál \(\frac{80}{v+4}\) óra.`,
        T`\[\frac{80}{v}-\frac{80}{v+4}=1\quad\Rightarrow\quad 80(v+4)-80v=v(v+4)\quad\Rightarrow\quad v^2+4v-320=0\]`,
        T`\(v=16\) vagy \(v=-20\). A sebesség pozitív: \(v=16\) km/h.`,
        T`Ellenőrzés: \(80:16=5\) óra, \(80:20=4\) óra, a különbség valóban 1 óra. ✓`]
    },
    feladatok
  }));
})();
