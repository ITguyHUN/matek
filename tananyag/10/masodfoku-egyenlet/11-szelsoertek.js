/*
 * 11. fejezet – Szélsőérték-feladatok (emelt szintű tananyag)
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 9. lecke; FGY 2217–2222)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, el, zj, kulonbozo, az, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;

  feladatok.fuggveny = { nev: 'Szélsőérték intervallumon', general() {
    const a = P([1, 1, 2, -1, -2]); const u = R(-4, 4), v = R(-8, 8); const b = -2 * a * u, c = a * u * u + v;
    const f = x => a * x * x + b * x + c;
    let p, q; do { p = R(-6, 4); q = p + R(2, 6); } while (false);
    const benne = u >= p && u <= q;
    const ertekek = [f(p), f(q)]; if (benne) ertekek.push(v);
    const mx = Math.max(...ertekek), mn = Math.min(...ertekek); const t = R(0, 1);
    return { kerdes: T`<p>Adott az \(f(x)=${q2(a, b, c)}\) függvény a \([${p};\,${q}]\) intervallumon. Mennyi a függvény <b>${t ? 'legnagyobb' : 'legkisebb'}</b> értéke ezen az intervallumon?</p>`,
      valasz: { ertekek: [t ? mx : mn] }, formatum: FMT10.egesz,
      tipp: T`Hozd \(a(x-u)^2+v\) alakra. A szélsőérték a csúcspontban (ha az intervallumba esik) vagy az intervallum valamelyik végpontjában van.`,
      megoldas: [T`\[f(x)=${a === 1 ? '' : a === -1 ? '-' : a}${u === 0 ? 'x^2' : T`\left(x${el(-u)}\right)^2`}${el(v)}\]`,
        benne ? T`A csúcs \(x=${u}\) helye az intervallumba esik: \(f(${u})=${v}\).` : T`A csúcs \(x=${u}\) helye nincs az intervallumban, így a függvény itt monoton.`,
        T`Végpontok: \(f(${p})=${f(p)}\), \(f(${q})=${f(q)}\).`, T`${t ? 'Legnagyobb' : 'Legkisebb'} érték: \(${t ? mx : mn}\).`] };
  } };

  feladatok.kerites = { nev: 'Kerítés: legnagyobb terület', general() {
    const t = R(0, 2);
    if (t === 0) { const K = 4 * R(5, 60); const x = K / 4;
      return { kerdes: T`<p>Egy téglalap alakú kertet \(${K}\) méter hosszú kerítéssel kerítünk körbe. Legfeljebb hány \(\text{m}^2\) lehet a kert területe?</p>`,
        valasz: { ertekek: [x * x] }, formatum: 'szám (m²)', tipp: T`Ha az egyik oldal \(x\), a másik \(${K / 2}-x\). A terület \(x(${K / 2}-x)\) – ez egy lefelé nyitott parabola.`,
        megoldas: [T`\[T(x)=x(${K / 2}-x)=-x^2+${K / 2}x=-\left(x-${x}\right)^2+${x * x}\]`, T`A maximum \(x=${x}\) m-nél (négyzet): \(${x * x}\ \text{m}^2\).`], _ell: w => egy(w, x * x) }; }
    const K = 4 * R(5, 50); const y = K / 4, xx = K / 2; const kerd = R(0, 1);
    return { kerdes: T`<p>Egy folyóparti téglalap alakú telket \(${K}\) méter kerítéssel kerítünk be úgy, hogy a folyó felőli oldalra nem kell kerítés. ${kerd ? T`Legfeljebb hány \(\text{m}^2\) lehet a telek területe?` : 'Milyen hosszú (m) legyen a folyóval párhuzamos oldal, hogy a terület a legnagyobb legyen?'}</p>`,
      valasz: { ertekek: [kerd ? xx * y : xx] }, formatum: kerd ? 'szám (m²)' : 'szám (m)',
      tipp: T`Legyen a folyóra merőleges két oldal \(y\), a párhuzamos \(${K}-2y\). A terület \(y(${K}-2y)\).`,
      megoldas: [T`\[T(y)=y(${K}-2y)=-2y^2+${K}y=-2\left(y-${y}\right)^2+${xx * y}\]`, T`A maximum \(y=${y}\) m-nél: a párhuzamos oldal \(${xx}\) m, a terület \(${xx * y}\ \text{m}^2\).`] };
  } };

  feladatok.felbontas = { nev: 'Szám felbontása két részre', general() {
    const N = 2 * R(3, 60); const t = R(0, 2);
    if (t === 0) return { kerdes: T`<p>Bontsd fel ${az(N)} \(${N}\)-t két szám összegére úgy, hogy a két szám <b>szorzata</b> a lehető legnagyobb legyen! Mennyi ez a legnagyobb szorzat?</p>`,
      valasz: { ertekek: [N * N / 4] }, formatum: FMT10.egesz, tipp: T`A két szám \(x\) és \(${N}-x\); a szorzat \(x(${N}-x)\) maximumát keresd.`,
      megoldas: [T`\[x(${N}-x)=-\left(x-${N / 2}\right)^2+${N * N / 4}\]`, T`Maximum \(x=${N / 2}\)-nél: \(${N / 2}\cdot${N / 2}=${N * N / 4}\).`] };
    if (t === 1) return { kerdes: T`<p>Bontsd fel ${az(N)} \(${N}\)-t két szám összegére úgy, hogy a két szám <b>négyzetösszege</b> a lehető legkisebb legyen! Mennyi ez a legkisebb négyzetösszeg?</p>`,
      valasz: { ertekek: [N * N / 2] }, formatum: FMT10.egesz, tipp: T`\(x^2+(${N}-x)^2\) minimumát keresd: alakítsd teljes négyzetté!`,
      megoldas: [T`\[x^2+(${N}-x)^2=2x^2-${2 * N}x+${N * N}=2\left(x-${N / 2}\right)^2+${N * N / 2}\]`, T`Minimum \(x=${N / 2}\)-nél: \(${N * N / 2}\).`] };
    const d = R(1, 10); // két szám különbsége d, szorzatuk minimális
    return { kerdes: T`<p>Két szám különbsége \(${d}\). Mekkora lehet a szorzatuk legkisebb értéke?</p>`,
      valasz: { ertekek: [-d * d / 4] }, formatum: FMT10.tort, tipp: T`A számok \(x\) és \(x+${d}\); a szorzat \(x^2+${d}x\).`,
      megoldas: [T`\[x(x+${d})=x^2+${d}x=\left(x+${ft(F(d, 2))}\right)^2-${ft(F(d * d, 4))}\]`, T`Minimum: \(${ft(F(-d * d, 4))}\), amikor a két szám \(${ft(F(-d, 2))}\) és \(${ft(F(d, 2))}\).`] };
  } };

  feladatok.haromszog = { nev: 'Téglalap a háromszögben', general() {
    const a = 2 * R(3, 15), b = 2 * R(3, 15); const kerd = R(0, 1);
    return { kerdes: T`<p>Egy derékszögű háromszög befogói \(${a}\) cm és \(${b}\) cm. A háromszögbe téglalapot írunk úgy, hogy két oldala a befogókra essen, negyedik csúcsa pedig az átfogóra. ${kerd ? T`Legfeljebb mekkora (\(\text{cm}^2\)) a téglalap területe?` : T`Mekkora (cm) a téglalap ${a} cm-es befogóra eső oldala, ha a területe a legnagyobb?`}</p>`,
      valasz: { ertekek: [kerd ? a * b / 4 : a / 2] }, formatum: kerd ? 'szám (cm²)' : 'szám (cm)',
      tipp: T`Ha a ${a} cm-es befogóra eső oldal \(x\), a hasonló háromszögekből a másik oldal \(${b}\cdot\frac{${a}-x}{${a}}\).`,
      megoldas: [T`\[T(x)=x\cdot\frac{${b}}{${a}}(${a}-x)=-\frac{${b}}{${a}}\left(x^2-${a}x\right)\]`, T`Maximum \(x=${a / 2}\)-nél (a befogó fele): \(T=${a / 2}\cdot${b / 2}=${a * b / 4}\ \text{cm}^2\).`] };
  } };

  feladatok.hajok = { nev: 'Legkisebb távolság (mozgás)', general() {
    // két test merőleges utakon a metszéspont felé halad: d(t)² = (A − v1 t)² + (B − v2 t)²
    const k = P([10, 20, 30]); const [p, q] = P([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]); const v1 = p * k, v2 = q * k; const n = Math.sqrt(p * p + q * q) * k;
    const A = 10 * R(5, 40), B = 10 * R(5, 40); const ts = (A * v1 + B * v2) / (n * n); const dmin = Math.abs(A * v2 - B * v1) / n;
    const kerd = R(0, 1);
    return { kerdes: T`<p>Két hajó egymásra merőleges egyenes pályán halad a pályák metszéspontja felé: az egyik \(${v1}\,\frac{\text{km}}{\text{h}}\), a másik \(${v2}\,\frac{\text{km}}{\text{h}}\) sebességgel. Délben az első \(${A}\) km-re, a második \(${B}\) km-re van a metszésponttól. ${kerd ? 'Mekkora lesz a két hajó legkisebb távolsága (km)?' : 'Hány óra múlva lesznek a legközelebb egymáshoz?'} (Ha kell, két tizedesre kerekíts.)</p>`,
      valasz: { ertekek: [kerd ? dmin : ts], tol: 0.006 }, formatum: 'szám, két tizedesre kerekítve',
      tipp: T`\(t\) óra múlva a távolságok a metszésponttól \(${A}-${v1}t\) és \(${B}-${v2}t\). A távolság négyzete ezek négyzetösszege – egy \(t\)-ben másodfokú függvény.`,
      megoldas: [T`\[d^2(t)=(${A}-${v1}t)^2+(${B}-${v2}t)^2=${n * n}t^2-${2 * (A * v1 + B * v2)}t+${A * A + B * B}\]`,
        T`A minimum helye: \(t=\frac{${2 * (A * v1 + B * v2)}}{2\cdot${n * n}}${Number.isInteger(ts * 100) ? '=' : T`\approx`}${nt(+ts.toFixed(2))}\) óra.`,
        T`A legkisebb távolság: \(d_{\min}\approx${nt(+dmin.toFixed(2))}\) km.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mszelso',
    cim: 'Szélsőérték-feladatok',
    rovid: 'Szélsőérték-feladatok',
    szint: 'emelt',
    bevezeto: T`Mikor a legnagyobb egy terület, mikor a legkisebb egy távolság? Ha a vizsgált mennyiség egy változó másodfokú függvénye, a válasz a parabola csúcspontjában van.`,
    elmelet: T`<div class="mathbox">\[f(x)=ax^2+bx+c=a\left(x+\frac{b}{2a}\right)^2+c-\frac{b^2}{4a}\]</div>
<div class="prose"><ul>
<li>A szélsőérték helye \(x=-\frac{b}{2a}\), értéke \(c-\frac{b^2}{4a}\); \(a>0\): minimum, \(a<0\): maximum.</li>
<li><b>Lépések:</b> válassz változót → írd fel a vizsgált mennyiséget a változó függvényeként → teljes négyzet → értelmezd az eredményt (a változó csak a feladat szerint értelmes értékeket vehet fel!).</li>
<li>Zárt intervallumon a szélsőérték a csúcsban vagy az intervallum valamelyik végpontjában van.</li>
<li>Adott összegű két szám szorzata akkor maximális, négyzetösszege akkor minimális, ha egyenlők.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Az \(f(x)=-x^2+6x\) függvény legnagyobb értéke 9.`, igaz: true, miert: T`\(-(x-3)^2+9\), a maximum \(x=3\)-nál 9.` },
      { allitas: T`A \(100\) m kerítéssel bekeríthető legnagyobb területű téglalap \(30\times20\) méteres.`, igaz: false, miert: T`A négyzet a legjobb: \(25\times25\), \(625\ \text{m}^2>600\ \text{m}^2\).` },
      { allitas: T`Zárt intervallumon egy másodfokú függvény szélsőértéke mindig a csúcspontban van.`, igaz: false, miert: 'Ha a csúcs nincs az intervallumban, a szélsőérték a végpontokban van.' },
      { allitas: T`Az \(x^2-4x+7\) kifejezés legkisebb értéke 3.`, igaz: true, miert: T`\((x-2)^2+3\ge3\).` }
    ],
    mintapelda: {
      feladat: T`Bontsuk fel a 40-et két szám összegére úgy, hogy négyzetösszegük minimális legyen!`,
      lepesek: [T`A számok \(x\) és \(40-x\). A négyzetösszeg: \(x^2+(40-x)^2=2x^2-80x+1600\).`,
        T`Teljes négyzet: \(2(x-20)^2+800\).`, T`A minimum \(x=20\)-nál van: a két szám \(20\) és \(20\), a négyzetösszeg \(800\).`]
    },
    feladatok
  }));
})();
