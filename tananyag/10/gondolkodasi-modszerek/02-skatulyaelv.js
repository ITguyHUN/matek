/*
 * Gondolkodási módszerek / 2. fejezet – A skatulyaelv
 * Témakör: Gondolkodási módszerek (Sokszínű matematika 10., 1. fejezet 2. lecke; TK 24/1–12; FGY 2019–2027, 2080–2081)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { kulonbozo, az, FMT10 } = M10;
  const feladatok = {};
  const SZINEK = ['piros', 'kék', 'zöld', 'sárga', 'fehér', 'fekete', 'lila', 'narancssárga'];
  const TARGY = [['golyó', 'golyót', 'egy dobozban', 'húzunk ki'], ['zokni', 'zoknit', 'egy sötét fiókban', 'veszünk ki'], ['kesztyű', 'kesztyűt', 'egy kosárban', 'veszünk ki'], ['cukorka', 'cukorkát', 'egy zacskóban', 'veszünk ki'], ['ceruza', 'ceruzát', 'egy tolltartóban', 'veszünk ki']];

  feladatok.alap = { nev: 'Legalább hányat kell kivenni?', general() {
    const t = R(0, 2);
    if (t === 0) { const n = R(2, 6), k = R(2, 6); const tg = P(TARGY); const szin = SZINEK.slice(0, n);
      return { kerdes: `<p>${tg[2][0].toUpperCase() + tg[2].slice(1)} sok ${tg[0]} van, mindegyik ${szin.slice(0, -1).join(', ')} vagy ${szin[n - 1]} színű (mindegyik színből legalább ${k} darab). Legalább hány ${tg[1]} kell kivennünk becsukott szemmel, hogy biztosan legyen közöttük ${k} azonos színű?</p>`,
        valasz: { ertekek: [(k - 1) * n + 1] }, formatum: FMT10.egesz,
        tipp: `A legrosszabb esetet nézd: mindegyik színből ${k - 1} darabot húzunk ki. A következő már biztosan ${az(k)} ${k}. egyforma.`,
        megoldas: [`A legrosszabb esetben ${n} színből egyenként ${k - 1} darabot húzunk: ${n} · ${k - 1} = ${(k - 1) * n} darab, és még nincs ${k} egyforma.`, `A következő (${(k - 1) * n + 1}.) már biztosan ${az(k)} ${k}. azonos színű lesz: ${(k - 1) * n + 1}.`] };
    }
    if (t === 1) { const [n, nev] = P([[7, 'a hét ugyanazon napján'], [12, 'ugyanabban a hónapban'], [366, 'az év ugyanazon napján (szökőévet is számítva)'], [31, 'a hónap ugyanazon napján']]); const k = n > 31 ? 2 : R(2, 5);
      return { kerdes: `<p>Legalább hány embernek kell összegyűlnie, hogy biztosan legyen közöttük ${k}, akik ${nev} születtek?</p>`,
        valasz: { ertekek: [(k - 1) * n + 1] }, formatum: FMT10.egesz,
        tipp: `A skatulyák: ${n} lehetőség. A legrosszabb esetben mindegyikbe ${k - 1} ember jut.`,
        megoldas: [`${n} · ${k - 1} = ${(k - 1) * n} emberre még elképzelhető, hogy egyik „skatulyában” sincs ${k}.`, `${(k - 1) * n + 1} ember esetén már biztosan van ${k} egyforma: ${(k - 1) * n + 1}.`] };
    }
    const k = R(2, 4); const m = 6;
    return { kerdes: `<p>Legalább hányszor kell feldobni egy szabályos dobókockát, hogy biztosan legyen ${k} egyforma dobás?</p>`,
      valasz: { ertekek: [(k - 1) * m + 1] }, formatum: FMT10.egesz, tipp: `6 lehetséges eredmény van; a legrosszabb esetben mindegyik ${k - 1}-szer jön ki.`,
      megoldas: [`6 · ${k - 1} = ${(k - 1) * m} dobásnál még lehet, hogy nincs ${k} egyforma; a következő dobás után már biztosan van: ${(k - 1) * m + 1}.`] };
  } };

  feladatok.korlatos = { nev: 'Különböző darabszámú színek', general() {
    const n = R(3, 4); const db = kulonbozo(n, 3, 21).sort((a, b) => a - b); const szin = SZINEK.slice(0, n); const tg = P(TARGY);
    const t = R(0, 2); const ossz = db.reduce((a, b) => a + b, 0);
    const leir = szin.map((s, i) => `${db[i]} ${s}`).join(', ');
    let kerd, ans, mo;
    if (t === 0) { kerd = `hogy biztosan legyen közöttük <b>mindegyik színből</b>`; ans = ossz - db[0] + 1; mo = [`A legrosszabb esetben a legkevesebb (${db[0]} darabos) színen kívül minden mást kihúzunk: ${ossz - db[0]} darab.`, `A következő biztosan a hiányzó színből van: ${ans}.`]; }
    else if (t === 1) { kerd = `hogy biztosan legyen közöttük <b>két különböző színű</b>`; ans = db[n - 1] + 1; mo = [`A legrosszabb esetben először mind a ${db[n - 1]} darabot kihúzzuk a legtöbb darabos színből.`, `A következő már más színű: ${ans}.`]; }
    else { const k = R(3, Math.min(8, db[n - 1])); kerd = `hogy biztosan legyen közöttük <b>${k} azonos színű</b>`; ans = db.reduce((a, b) => a + Math.min(b, k - 1), 0) + 1;
      mo = [`A legrosszabb esetben minden színből legfeljebb ${k - 1} darabot húzunk (ha kevesebb van, az összeset): ${db.map(b => Math.min(b, k - 1)).join(' + ')} = ${ans - 1}.`, `A következő biztosan ${az(k)} ${k}. azonos színű: ${ans}.`]; }
    return { kerdes: `<p>${tg[2][0].toUpperCase() + tg[2].slice(1)} ${leir} ${tg[0]} van. Legalább hány ${tg[1]} kell becsukott szemmel kivennünk, ${kerd}?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Gondold végig a legrosszabb (legszerencsétlenebb) esetet, és adj hozzá egyet!', megoldas: mo };
  } };

  feladatok.legalabb = { nev: 'Legalább hány esik egy skatulyába?', general() {
    const [m, nev, mi] = P([[7, 'a hét ugyanazon napján', 'születésnap'], [12, 'ugyanabban a hónapban', 'születésnap'], [5, 'ugyanazt az osztályzatot kapta', 'dolgozat'], [4, 'ugyanabba az évszakba esik a születésnapja', 'évszak']]);
    const N = R(m + 3, 8 * m + 5); const ans = Math.ceil(N / m);
    const kerdes = mi === 'dolgozat' ? `<p>Egy ${N} fős évfolyam dolgozatot írt (osztályzatok: 1–5). Legalább hány diák van, aki biztosan ${nev}?</p><p>(Add meg azt a legnagyobb számot, amennyit biztosan állíthatunk.)</p>`
      : `<p>Egy ${N} fős társaságban legalább hány ember van, akinek biztosan ${mi === 'évszak' ? nev : nev + ' van a születésnapja'}?</p><p>(Add meg azt a legnagyobb számot, amennyit biztosan állíthatunk.)</p>`;
    return { kerdes, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: `${N} „tárgyat” osztunk szét ${m} „skatulyába”. Ha mindegyikbe legfeljebb k jutna, összesen legfeljebb ${m}k tárgy lenne.`,
      megoldas: [`${m} · ${ans - 1} = ${m * (ans - 1)} < ${N}, ezért valamelyik skatulyába legalább ${ans} jut.`, `${ans}-nél többet nem állíthatunk biztosan: az elemek eloszthatók úgy, hogy egyik skatulyába se jusson ${ans} + 1.`] };
  } };

  feladatok.maradek = { nev: 'Maradékok, számjegyek', general() {
    const t = R(0, 2);
    if (t === 0) { const m = R(3, 25);
      return { kerdes: `<p>Legalább hány egész számot kell kiválasztanunk, hogy biztosan legyen közöttük kettő, amelyek különbsége osztható ${M10.vel(m)}?</p>`,
        valasz: { ertekek: [m + 1] }, formatum: FMT10.egesz, tipp: `Két szám különbsége pontosan akkor osztható ${M10.vel(m)}, ha ${M10.vel(m)} osztva ugyanazt a maradékot adják. Hány különböző maradék van?`,
        megoldas: [`${m}-féle maradék lehet (0, 1, …, ${m - 1}): ezek a skatulyák.`, `${m} számnál még lehet mind különböző maradékú; ${m + 1} számnál már biztosan van két azonos maradékú: ${m + 1}.`] }; }
    if (t === 1) { const k = R(2, 6);
      return { kerdes: `<p>Legalább hány pozitív egész számot kell felírnunk, hogy biztosan legyen közöttük ${k}, amelyeknek az utolsó számjegye megegyezik?</p>`,
        valasz: { ertekek: [10 * (k - 1) + 1] }, formatum: FMT10.egesz, tipp: '10-féle utolsó számjegy lehet (0–9).',
        megoldas: [`10 skatulya (utolsó jegy), mindegyikben legfeljebb ${k - 1}: ${10 * (k - 1)} szám; a következővel már biztosan van ${k}: ${10 * (k - 1) + 1}.`] }; }
    const n = R(3, 15); const X = R(2, 8); const T0 = (X - 1) * n + 1;
    return { kerdes: `<p>Egy zsákban többféle játék van, mindegyik fajtából ugyanannyi. Ahhoz, hogy biztosan legyen közöttük ${X} egyforma, legalább ${T0} játékot kell kivenni. Hányféle játék van a zsákban?</p>`,
      valasz: { ertekek: [n] }, formatum: FMT10.egesz, tipp: `Ha n féle játék van, a legrosszabb esetben mindegyikből ${X - 1} darabot veszünk ki; a következő ${az(X)} ${X}. egyforma.`,
      megoldas: [`(${X} − 1) · n + 1 = ${T0} ⇒ ${X - 1}n = ${T0 - 1} ⇒ n = ${n}.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'gskat',
    cim: 'A skatulyaelv',
    rovid: 'Skatulyaelv',
    bevezeto: 'Ha több tárgyat teszünk a skatulyákba, mint ahány skatulya van, akkor valamelyik skatulyába legalább két tárgy kerül. Egyszerű elv – meglepően sok feladat megoldása.',
    elmelet: T`<div class="mathbox">\[n\text{ skatulyába }n+1\text{ tárgy}\ \Rightarrow\ \text{valamelyikben legalább 2 van}\]</div>
<div class="prose"><ul>
<li><b>Általánosítás:</b> ha \(n\) skatulyába \(n\cdot k+1\) tárgyat teszünk, valamelyikbe legalább \(k+1\) kerül.</li>
<li>„Legalább hányat kell kivenni, hogy biztosan…?” – gondold végig a <b>legrosszabb esetet</b>, és adj hozzá egyet.</li>
<li>Ha a színekből különböző darabszám van, figyelj arra, hogy egy színből legfeljebb annyit vehetsz ki, ahány van.</li>
<li>„Legalább hány esik biztosan ugyanabba?” – \(N\) tárgy, \(m\) skatulya: legalább \(\left\lceil\frac{N}{m}\right\rceil\) (felfelé kerekítve).</li></ul></div>`,
    igazHamis: [
      { allitas: '13 ember között biztosan van kettő, akik ugyanabban a hónapban születtek.', igaz: true, miert: '12 hónap van, 13 > 12.' },
      { allitas: '12 ember között biztosan van kettő, akik ugyanabban a hónapban születtek.', igaz: false, miert: 'Lehet, hogy mind a 12 más hónapban született.' },
      { allitas: '3 színű zokniból 4 darabot kivéve biztosan van egy pár (két azonos színű).', igaz: true, miert: '3 skatulya, 4 tárgy.' },
      { allitas: '36 tanuló közül biztosan van 6, akik a hét ugyanazon napján születtek.', igaz: true, miert: '7 · 5 = 35 < 36.' },
      { general() { const m = R(3, 12); const jo = R(0, 1) === 1; const db = jo ? m + 1 : m;
        return { allitas: `${db} egész szám között biztosan van kettő, amelyek ${M10.vel(m)} osztva ugyanazt a maradékot adják.`, igaz: db > m, miert: `${m}-féle maradék van; ${db > m ? `${db} > ${m}` : `${db} számnál még mind különbözhet`}.` }; } }
    ],
    mintapelda: {
      feladat: 'Egy dobozban 14 piros, 17 kék és 21 zöld golyó van. Legkevesebb hány golyót kell kivenni, hogy biztosan legyen mindegyik színből?',
      lepesek: ['A legrosszabb esetben a két legnagyobb darabszámú színből vesszük ki az összeset: 17 + 21 = 38 golyó, és még nincs piros.', 'A 39. golyó már biztosan piros.', 'Válasz: 39 golyót.']
    },
    feladatok
  }));
})();
