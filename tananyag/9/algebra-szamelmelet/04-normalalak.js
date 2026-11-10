/*
 * II. Algebra és számelmélet / 4. A számok normálalakja
 * (Sokszínű matematika 9., II/4. lecke; FGY 1130–1137, 1192; OH Matematika 9., 25–26. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, normal, normalT, tizedesT, FMT9 } = M9;
  const feladatok = {};
  const REL = ['<', '=', '>'];
  /* véletlen „szorzó” 1 és 10 között, 1–3 tizedesjeggyel */
  const mant = (jegy = R(1, 3)) => { let a; do { a = R(10 ** jegy, 10 ** (jegy + 1) - 1) / 10 ** jegy; } while (Number.isInteger(a) && jegy > 0 && R(0, 1)); return +a.toFixed(jegy); };
  const ertek = (a, k) => +(a * 10 ** k).toPrecision(12);
  /* az a (szorzó) kérdezése: tizedes tört, kis tűréssel */
  const aValasz = a => ({ ertekek: [a], tol: 1e-9, forma: 'tizedes' });
  const kerdez = () => R(0, 2) ? 'k' : 'a';
  const kerdesSzoveg = m => m === 'k' ? T`Írd fel a számot \(a\cdot10^k\) normálalakban! Mennyi a <b>kitevő</b> (\(k\))?` : T`Írd fel a számot \(a\cdot10^k\) normálalakban! Mennyi az \(a\) <b>szorzó</b> (\(1\le a<10\))?`;

  /* ---------- normálalakba írás ---------- */
  feladatok.normalba = { nev: 'Normálalakba írás', general() {
    const mit = kerdez(); const t = R(0, 2);
    let a = mant(), k = R(-9, 12); if (k === 0 || k === 1) k = R(2, 9);
    let tex, lep;
    if (t < 2) { const x = ertek(a, k); tex = tizedesT(x);
      lep = k > 0 ? T`A tizedesvesszőt ${k} hellyel kell balra vinni, hogy \(1\) és \(10\) közé eső számot kapjunk.` : T`A tizedesvesszőt ${-k} hellyel kell jobbra vinni, hogy \(1\) és \(10\) közé eső számot kapjunk.`; }
    else { const s = R0(-3, 3); const b = +(a * 10 ** s).toPrecision(8); const m = k - s; tex = T`${nt(b)}\cdot 10^{${m}}`;
      lep = T`\(${nt(b)}=${nt(a)}\cdot10^{${s}}\), így \(${nt(b)}\cdot10^{${m}}=${nt(a)}\cdot10^{${s}+${m < 0 ? T`(${m})` : m}}\).`; }
    return { kerdes: T`<p>${kerdesSzoveg(mit)}</p>\[${tex}\]`, valasz: mit === 'k' ? { ertekek: [k] } : aValasz(a), formatum: mit === 'k' ? FMT9.egesz : FMT9.tizedes,
      tipp: T`A normálalak \(a\cdot10^k\), ahol \(1\le a<10\) és \(k\) egész. Nagy számnál \(k\) pozitív, 1-nél kisebb pozitív számnál negatív.`,
      megoldas: [lep, T`\[${tex}=${normalT(a, k)}\]`] };
  } };

  /* ---------- normálalakból tizedes tört ---------- */
  feladatok.tizedes = { nev: 'Normálalakból tizedes tört', general() {
    const a = mant(R(0, 3)); let k = R0(-6, 8);
    const x = ertek(a, k);
    return { kerdes: T`<p>Írd fel a számot tizedes tört (vagy egész szám) alakban!</p>\[${normalT(a, k)}\]`,
      valasz: { ertekek: [x], tol: Math.abs(x) * 1e-9, forma: 'tizedes' }, formatum: 'tizedes tört vagy egész szám, pl. 0,0045 vagy 320000',
      tipp: k > 0 ? T`\(10^{${k}}\)-nel szorozva a tizedesvessző ${k} hellyel jobbra kerül.` : T`\(10^{${k}}\)-nel szorozni ugyanaz, mint \(10^{${-k}}\)-nel osztani: a tizedesvessző ${-k} hellyel balra kerül.`,
      megoldas: [T`\[${normalT(a, k)}=${tizedesT(x)}\]`] };
  } };

  /* ---------- műveletek normálalakban ---------- */
  feladatok.muvelet = { nev: 'Műveletek normálalakkal', general() {
    const mit = kerdez(); const t = R(0, 3); let tex, x, lep;
    if (t === 0) { const a = mant(1), b = mant(1), m = R(-8, 9), n = R(-8, 9); x = a * b * 10 ** (m + n); tex = T`\left(${normalT(a, m)}\right)\cdot\left(${normalT(b, n)}\right)`;
      lep = T`\(${nt(a)}\cdot ${nt(b)}=${nt(+(a * b).toFixed(4))}\) és \(10^{${m}}\cdot10^{${n}}=10^{${m + n}}\).`; }
    else if (t === 1) { const c = mant(1), b = mant(1), n = R(-8, 9), m = R(-8, 9); const a = +(c * b).toPrecision(6); x = c * 10 ** (m - n);
      tex = T`\frac{${normalT(a, m)}}{${normalT(b, n)}}`; lep = T`\(${nt(a)}:${nt(b)}=${nt(c)}\) és \(10^{${m}}:10^{${n}}=10^{${m - n}}\).`; }
    else if (t === 2) { const a = P([1.1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6]), e = P([2, 2, 3]), m = R0(-5, 6); x = a ** e * 10 ** (m * e);
      tex = T`\left(${normalT(a, m)}\right)^{${e}}`; lep = T`\(${nt(a)}^{${e}}=${nt(+(a ** e).toFixed(4))}\) és \(\left(10^{${m}}\right)^{${e}}=10^{${m * e}}\).`; }
    else { const k = R(-6, 9), d = R(1, 2); const a = mant(1), b = mant(1); x = a * 10 ** k + b * 10 ** (k - d);
      tex = T`${normalT(a, k)}+${normalT(b, k - d)}`; lep = T`Írjuk a második tagot is \(10^{${k}}\)-nel: \(${normalT(b, k - d)}=${nt(+(b / 10 ** d).toFixed(4))}\cdot10^{${k}}\), így az összeg \(${nt(+(a + b / 10 ** d).toFixed(4))}\cdot10^{${k}}\).`; }
    const { a: A, k: K } = normal(x);
    return { kerdes: T`<p>Végezd el a műveletet, és add meg az eredményt \(a\cdot10^k\) normálalakban! Mennyi ${mit === 'k' ? T`a kitevő (\(k\))` : T`az \(a\) szorzó`}?</p>\[${tex}\]`,
      valasz: mit === 'k' ? { ertekek: [K] } : aValasz(A), formatum: mit === 'k' ? FMT9.egesz : FMT9.tizedes,
      tipp: T`A szorzókkal és a 10-hatványokkal külön számolj! A végén ellenőrizd, hogy \(1\le a<10\) teljesül-e – ha nem, igazítsd a kitevőt.`,
      megoldas: [lep, T`\[${tex}=${normalT(A, K)}\]`] };
  } };

  /* ---------- összehasonlítás ---------- */
  feladatok.hasonlit = { nev: 'Melyik a nagyobb?', general() {
    const a = mant(R(1, 2)), k = R(-7, 9); const x = ertek(a, k);
    const t = R(0, 2); let b, m;
    if (t === 0) { b = mant(R(1, 2)); m = k; }
    else if (t === 1) { const s = R0(-2, 2); b = +(a * 10 ** s).toPrecision(6); m = k - s; if (R(0, 2)) m += P([-1, 1]); }
    else { b = mant(1); m = k + P([-1, 1]); }
    const y = ertek(b, m); const c = Math.abs(x - y) < 1e-12 * Math.max(Math.abs(x), 1e-300) ? 1 : x < y ? 0 : 2;
    const balT = R(0, 1) ? normalT(a, k) : tizedesT(x); const jobbT = T`${nt(b)}\cdot 10^{${m}}`;
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${balT}\;\square\;${jobbT}\]`, valasz: { valasztas: REL, helyes: c },
      tipp: 'Írd fel mindkét számot normálalakban! Először a kitevőket hasonlítsd össze, egyenlő kitevőnél a szorzókat.',
      megoldas: [...[[balT, normalT(a, k)], [jobbT, normalT(normal(y).a, normal(y).k)]].filter(([u, v]) => u !== v).map(([u, v]) => T`Normálalakban: \(${u}=${v}\).`), c === 1 ? 'A két szám egyenlő.' : normal(x).k !== normal(y).k ? 'A nagyobb kitevőjű szám a nagyobb.' : 'A kitevők egyenlők, így a szorzó dönt.', T`Ezért \(${balT}${REL[c]}${jobbT}\).`] };
  } };

  /* ---------- mértékegység-átváltás ---------- */
  const EGYSEG = [
    { cs: 'hossz', e: [['km', 3], ['m', 0], ['cm', -2], ['mm', -3], [T`\mu\text{m}`, -6], ['nm', -9]] },
    { cs: 'tömeg', e: [['t', 6], ['kg', 3], ['g', 0], ['mg', -3]] },
    { cs: 'idő', e: [['nap', null], ['óra', null], ['s', 0], ['ms', -3]] }
  ];
  feladatok.atvaltas = { nev: 'Mértékegységek normálalakban', general() {
    const cs = P(EGYSEG.slice(0, 2)); let i, j; do { [i, j] = [R(0, cs.e.length - 1), R(0, cs.e.length - 1)]; } while (i === j || Math.abs(cs.e[i][1] - cs.e[j][1]) < 3);
    const [eA, kA] = cs.e[i], [eB, kB] = cs.e[j];
    const a = mant(R(0, 2)), k = R(-3, 4); const x = ertek(a, k);
    const y = x * 10 ** (kA - kB); const { a: A, k: K } = normal(y);
    const ut = s => s.startsWith('\\') ? s : T`\text{${s}}`;
    const mit = kerdez();
    return { kerdes: T`<p>Váltsd át, és add meg az eredményt \(a\cdot10^k\) normálalakban! Mennyi ${mit === 'k' ? T`a kitevő (\(k\))` : T`az \(a\) szorzó`}?</p>\[${tizedesT(x)}\ ${ut(eA)}=\;?\ ${ut(eB)}\]`,
      valasz: mit === 'k' ? { ertekek: [K] } : aValasz(A), formatum: mit === 'k' ? FMT9.egesz : FMT9.tizedes,
      tipp: T`\(1\ ${ut(eA)}=10^{${kA - kB}}\ ${ut(eB)}\).`,
      megoldas: [T`\(1\ ${ut(eA)}=10^{${kA - kB}}\ ${ut(eB)}\), ezért \[${tizedesT(x)}\ ${ut(eA)}=${normalT(a, k)}\cdot10^{${kA - kB}}\ ${ut(eB)}=${normalT(A, K)}\ ${ut(eB)}\]`] };
  } };

  /* ---------- szöveges feladatok ---------- */
  feladatok.szoveges = { nev: 'Szöveges feladatok', general() {
    const t = R(0, 5); let szoveg, x, lep, egyseg;
    if (t === 0) { const perc = P([1, 2, 5, 10, 15, 20, 30, 45, 60]); x = 3e8 * perc * 60; egyseg = 'm';
      szoveg = T`A fény sebessége \(3\cdot10^{8}\ \frac{\text{m}}{\text{s}}\). Hány métert tesz meg a fény ${perc} perc alatt?`; lep = T`\(${perc}\) perc \(=${perc * 60}\) s, így \(s=3\cdot10^{8}\cdot ${perc * 60}\) m.`; }
    else if (t === 1) { const kg = R(50, 75), mrd = P([7, 7.5, 8, 8.2]); x = kg * mrd * 1e9 / 1000; egyseg = 't';
      szoveg = T`Egy ember átlagos tömege ${kg} kg, és körülbelül ${hu(mrd)} milliárd ember él a Földön. Hány tonna az emberiség össztömege?`; lep = T`\(${kg}\cdot ${nt(mrd)}\cdot10^{9}\) kg \(=${normalT(normal(kg * mrd * 1e9).a, normal(kg * mrd * 1e9).k)}\) kg, és 1 t = \(10^3\) kg.`; }
    else if (t === 2) { const db = P([3, 4, 5]), millio = P([2, 5, 10, 20, 50]); x = millio * 1e6 / db / 1000; egyseg = 'kg';
      szoveg = T`${db} hangya tömege 1 gramm. Hány kilogramm egy ${millio} millió hangyát tartalmazó boly hangyáinak össztömege?`; lep = T`\(${millio}\cdot10^{6}:${db}\) g, és 1 kg = 1000 g.`; }
    else if (t === 3) { const h = R(4, 9), sz = P([2, 3]); x = sz ** h; egyseg = 'db';
      szoveg = T`Egy baktériumtenyészetben a baktériumok száma óránként ${sz === 2 ? 'kétszeresére' : 'háromszorosára'} nő. Kezdetben 1 baktérium volt. Hány baktérium lesz ${h} óra múlva?`;
      lep = T`\(${sz}^{${h}}=${sz ** h}\)`; return { kerdes: `<p>${szoveg}</p>`, valasz: { ertekek: [x] }, formatum: FMT9.egesz, tipp: 'Minden órában ugyanannyiszorosára nő: ez hatványozás.', megoldas: [lep] }; }
    else if (t === 4) { const h = P([100, 105, 110]), sz = P([64, 68, 70, 73]), db = P([10, 12, 15]); x = h * sz * 1e4 * db; egyseg = 'db';
      szoveg = T`Egy \(${h}\ \text{m}\times ${sz}\ \text{m}\)-es focipályán 1 cm²-en átlagosan ${db} fűszál nő. Hány fűszál van a pályán?`; lep = T`A terület \(${h * sz}\ \text{m}^2=${h * sz}\cdot10^{4}\ \text{cm}^2\), ezt szorozzuk ${db}-${M9.vel(db).split('-')[1]}.`; }
    else { const fe = P([4.2, 8.6, 11.4, 16.5, 25]); x = fe * 365 * 24 * 3600 * 3e5; egyseg = 'km';
      szoveg = T`Egy csillag ${hu(fe)} fényévnyire van a Földtől. (1 fényév az a távolság, amelyet a fény 1 év = 365 nap alatt tesz meg; a fény sebessége \(3\cdot10^{5}\ \frac{\text{km}}{\text{s}}\).) Hány km ez?`;
      lep = T`1 év \(=365\cdot24\cdot3600\ \text{s}=3{,}1536\cdot10^{7}\ \text{s}\), így a távolság \(${nt(fe)}\cdot3{,}1536\cdot10^{7}\cdot3\cdot10^{5}\) km.`; }
    const { a: A0, k: K } = normal(x); const A = +A0.toFixed(2);
    const mit = kerdez();
    const egysegSz = { m: ' (méterben)', t: ' (tonnában)', kg: ' (kilogrammban)', db: '', km: ' (kilométerben)' }[egyseg];
    return { kerdes: T`<p>${szoveg}</p><p>Add meg az eredményt \(a\cdot10^k\) normálalakban${egysegSz}! Mennyi ${mit === 'k' ? T`a kitevő (\(k\))` : T`az \(a\) szorzó (két tizedesjegyre kerekítve)`}?</p>`,
      valasz: mit === 'k' ? { ertekek: [K] } : { ertekek: [A], tol: 0.0051, forma: 'tizedes' }, formatum: mit === 'k' ? FMT9.egesz : 'tizedes tört, pl. 3,75',
      tipp: 'Számolj a normálalakokkal: a szorzókat és a 10-hatványokat külön szorozd össze!', megoldas: [lep, T`Az eredmény: \(\approx ${normalT(A, K)}\)${egyseg === 'db' ? '' : ' ' + egyseg}.`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg4',
    cim: 'A számok normálalakja',
    rovid: 'Normálalak',
    bevezeto: 'Nagyon nagy és nagyon kicsi számok tömör felírása: normálalakba írás, visszaírás, műveletek, mértékegységek és gyakorlati feladatok.',
    elmelet: T`<div class="prose"><p>Egy pozitív szám <b>normálalakja</b> \(a\cdot10^{k}\), ahol \(1\le a<10\) és \(k\) egész szám.</p>
<ul><li>Nagy szám: \(345\,000=3{,}45\cdot10^{5}\) (a tizedesvessző 5 hellyel balra került, \(k=5\)).</li>
<li>Kicsi szám: \(0{,}000\,72=7{,}2\cdot10^{-4}\) (a tizedesvessző 4 hellyel jobbra került, \(k=-4\)).</li>
<li>1 és 10 közötti szám: \(k=0\), pl. \(4{,}5=4{,}5\cdot10^{0}\).</li>
<li><b>Szorzás, osztás:</b> a szorzókat és a 10-hatványokat külön kezeljük: \((3\cdot10^{5})\cdot(4\cdot10^{-8})=12\cdot10^{-3}=1{,}2\cdot10^{-2}\).</li>
<li><b>Összeadás:</b> előbb azonos kitevőre hozzuk: \(3{,}2\cdot10^{5}+4\cdot10^{4}=3{,}2\cdot10^{5}+0{,}4\cdot10^{5}=3{,}6\cdot10^{5}\).</li>
<li><b>Összehasonlítás:</b> a nagyobb kitevőjű a nagyobb (pozitív számoknál); azonos kitevőnél a szorzó dönt.</li></ul></div>
<div class="tbl"><table><tr><th>Előtag</th><th>kilo (k)</th><th>milli (m)</th><th>mikro (μ)</th><th>nano (n)</th></tr>
<tr><td>Szorzó</td><td>\(10^{3}\)</td><td>\(10^{-3}\)</td><td>\(10^{-6}\)</td><td>\(10^{-9}\)</td></tr></table></div>`,
    igazHamis: [
      { allitas: T`\(23\cdot10^{4}\) normálalakban van.`, igaz: false, miert: T`A szorzónak 1 és 10 között kell lennie: \(2{,}3\cdot10^{5}\).` },
      { allitas: T`\(0{,}000\,5=5\cdot10^{-4}\)`, igaz: true, miert: 'A tizedesvesszőt 4 hellyel kell jobbra vinni.' },
      { allitas: T`\(0{,}000\,5=5\cdot10^{-3}\)`, igaz: false, miert: T`\(5\cdot10^{-3}=0{,}005\).` },
      { allitas: T`\(3\cdot10^{-2}\) negatív szám.`, igaz: false, miert: T`\(3\cdot10^{-2}=0{,}03>0\). A negatív kitevő kicsi pozitív számot jelent.` },
      { allitas: T`\(4\cdot10^{6}>9\cdot10^{5}\)`, igaz: true, miert: T`\(4\,000\,000>900\,000\).` },
      { allitas: T`\(2\cdot10^{-5}>3\cdot10^{-6}\)`, igaz: true, miert: T`\(0{,}000\,02>0{,}000\,003\).` },
      { allitas: T`\((2\cdot10^{3})\cdot(4\cdot10^{5})=8\cdot10^{15}\)`, igaz: false, miert: T`A kitevőket összeadjuk: \(8\cdot10^{8}\).` },
      { allitas: T`\((5\cdot10^{4})\cdot(4\cdot10^{3})=2\cdot10^{8}\)`, igaz: true, miert: T`\(20\cdot10^{7}=2\cdot10^{8}\).` },
      { allitas: T`\(3\cdot10^{4}+2\cdot10^{4}=5\cdot10^{8}\)`, igaz: false, miert: T`Összeadásnál a kitevő nem változik: \(5\cdot10^{4}\).` },
      { allitas: T`\(1\ \text{nm}=10^{-9}\ \text{m}\)`, igaz: true, miert: 'A nano előtag milliárdod részt jelent.' },
      { allitas: T`\(1\ \text{km}=10^{5}\ \text{cm}\)`, igaz: true, miert: T`\(1\ \text{km}=1000\ \text{m}=100\,000\ \text{cm}\).` },
      { allitas: T`\(\frac{6\cdot10^{8}}{3\cdot10^{-2}}=2\cdot10^{6}\)`, igaz: false, miert: T`\(10^{8}:10^{-2}=10^{10}\), tehát \(2\cdot10^{10}\).` },
      { general() { const a = mant(R(1, 2)), k = R0(-6, 7); const x = ertek(a, k); const mut = R(0, 1) ? k : k + P([-1, 1]);
        return { allitas: T`\(${tizedesT(x)}=${normalT(a, mut)}\)`, igaz: mut === k, miert: T`\(${tizedesT(x)}=${normalT(a, k)}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki, és adjuk meg normálalakban: \(\dfrac{(6\cdot10^{5})\cdot(4\cdot10^{-8})}{8\cdot10^{-6}}\)`,
      lepesek: [T`A szorzókkal: \(\frac{6\cdot4}{8}=3\).`, T`A 10-hatványokkal: \(\frac{10^{5}\cdot10^{-8}}{10^{-6}}=10^{5-8-(-6)}=10^{3}\).`, T`Az eredmény: \(3\cdot10^{3}\), ez már normálalak (\(1\le3<10\)).`]
    },
    feladatok
  }));
})();
