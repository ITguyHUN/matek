/*
 * Gondolkodási módszerek / 5. fejezet – Kiválasztás, amikor a sorrend nem számít (ismétlés nélküli kombináció)
 * Témakör: Gondolkodási módszerek (Sokszínű matematika 10., 1. fejezet 4. lecke kiegészítése; vizsgatematika 4. témakör; FGY 2068–2073, 2224, 2230)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { binom, fakt, FMT10 } = M10;
  const feladatok = {};
  const B = x => bigT(x);
  const C = (n, k) => binom(n, k);
  const bT = (n, k) => T`\binom{${n}}{${k}}`;

  feladatok.komb = { nev: 'Kiválasztás, a sorrend nem számít', general() {
    const t = R(0, 5); let n, k, kerd;
    if (t === 0) { n = R(8, 32); k = R(2, 5); kerd = `Egy ${n} fős osztályból ${k} fős küldöttséget választanak. Hányféleképpen tehetik meg?`; }
    else if (t === 1) { [n, k] = P([[90, 5], [45, 6], [35, 7], [49, 6], [20, 3], [30, 4]]); kerd = `Egy lottójátékban ${n} számból ${k}-t kell megjelölni. Hányféleképpen tölthető ki egy szelvény?`; }
    else if (t === 2) { n = R(4, 30); k = 2; kerd = `Egy társaságban ${n} ember van, mindenki mindenkivel egyszer kezet fog. Hány kézfogás történik?`; }
    else if (t === 3) { n = R(4, 20); k = 2; kerd = `Egy körmérkőzéses bajnokságban ${n} csapat vesz részt, mindenki mindenkivel egyszer játszik. Hány mérkőzést rendeznek?`; }
    else if (t === 4) { n = R(4, 15); k = P([2, 3]); kerd = `A síkon ${n} pont van, közülük semelyik három nincs egy egyenesen. Hány ${k === 2 ? 'egyenest határoznak meg' : 'háromszöget határoznak meg (csúcsaik az adott pontok)'}?`; }
    else { n = R(6, 15); k = R(2, 5); kerd = `Egy kosárban ${n} különböző gyümölcs van. Hányféleképpen választhatunk ki közülük ${k}-t (a kiválasztás sorrendje nem számít)?`; }
    const ans = C(n, k);
    return { kerdes: `<p>${kerd}</p>`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`Itt a sorrend nem számít: a sorrendben vett kiválasztások számát (\(${n}\cdot${n - 1}\cdots\)) el kell osztani \(${k}!\)-sal.`,
      megoldas: [T`\[${bT(n, k)}=\frac{${Array.from({ length: k }, (_, i) => n - i).join(T`\cdot `)}}{${k}!}=${B(ans)}\]`] };
  } };

  feladatok.feltetel = { nev: 'Kiválasztás feltétellel', general() {
    const L = R(3, 12), F = R(3, 12), k = R(2, Math.min(5, L + F - 1)); const t = R(0, 2);
    if (t === 0) { const j = R(1, Math.min(k, L)); if (k - j > F) return feladatok.feltetel.general(); const ans = C(L, j) * C(F, k - j);
      return { kerdes: `<p>Egy osztályba ${L} lány és ${F} fiú jár. Hányféleképpen választhatunk ki közülük ${k} fős csoportot úgy, hogy pontosan ${j} lány legyen benne?</p>`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Külön válaszd ki a lányokat és külön a fiúkat, majd szorozd össze (szorzási szabály).',
        megoldas: [T`\[${bT(L, j)}\cdot ${bT(F, k - j)}=${C(L, j)}\cdot ${C(F, k - j)}=${B(ans)}\]`] }; }
    if (t === 1) { const ans = C(L + F, k) - C(F, k);
      return { kerdes: `<p>Egy osztályba ${L} lány és ${F} fiú jár. Hányféleképpen választhatunk ki ${k} fős csoportot úgy, hogy <b>legalább egy</b> lány legyen benne?</p>`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Komplementer: az összes kiválasztásból vond le azokat, amelyekben egyáltalán nincs lány.',
        megoldas: [T`\[${bT(L + F, k)}-${bT(F, k)}=${B(C(L + F, k))}-${B(C(F, k))}=${B(ans)}\]`] }; }
    const n = R(5, 20), kk = R(2, 4); const ans = C(n - 1, kk - 1);
    return { kerdes: `<p>Egy ${n} fős csoportból ${kk} fős bizottságot választanak. Hány olyan bizottság van, amelyben Anna (a csoport egyik tagja) benne van?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: `Anna helye biztos; a többi ${kk - 1} tagot a maradék ${n - 1} emberből kell kiválasztani.`,
      megoldas: [T`\[${bT(n - 1, kk - 1)}=${B(ans)}\]`] };
  } };

  feladatok.atlo = { nev: 'Átlók, szakaszok', general() {
    const n = R(4, 40); const t = R(0, 1);
    if (t === 0) return { kerdes: `<p>Hány átlója van egy konvex ${n} oldalú sokszögnek?</p>`, valasz: { ertekek: [C(n, 2) - n] }, formatum: FMT10.egesz,
      tipp: 'A csúcsok közül kettőt kiválasztva szakaszt kapunk; ezek közül az oldalak nem átlók.',
      megoldas: [T`\[${bT(n, 2)}-${n}=${C(n, 2)}-${n}=${C(n, 2) - n}\quad\left(=\frac{${n}\cdot${n - 3}}{2}\right)\]`] };
    const m = R(4, 25);
    return { kerdes: `<p>Egy szakaszon ${m} pontot jelölünk ki (a két végponttal együtt). Hány olyan szakasz van, amelynek mindkét végpontja a kijelölt pontok közül való?</p>`,
      valasz: { ertekek: [C(m, 2)] }, formatum: FMT10.egesz, tipp: 'Minden szakaszt két végpontja határoz meg; a sorrend nem számít.',
      megoldas: [T`\[${bT(m, 2)}=${C(m, 2)}\]`] };
  } };

  const HELYZET = [
    ['5 könyvet teszünk sorba a polcon.', 0], ['Egy 20 fős osztály 3 fős küldöttséget választ.', 3], ['Egy 20 fős osztályban elnököt, titkárt és pénztárost választanak.', 1],
    ['Egy 6 kérdéses tesztben minden kérdésre igen/nem választ adunk.', 2], ['Kitöltünk egy ötös lottószelvényt.', 3], ['Egy 4 jegyű PIN-kódot választunk (a jegyek ismétlődhetnek).', 2],
    ['8 futó célba érésének sorrendje (holtverseny nélkül).', 0], ['12 csapat körmérkőzést játszik: hány mérkőzés lesz?', 3], ['10 versenyzőből kialakul a dobogó (1–3. hely).', 1],
    ['Egy dobókockával háromszor dobunk, és a dobások sorrendjét is figyeljük.', 2], ['Egy kosár 10 almájából (mind különböző) kiveszünk 4-et.', 3], ['5 ember leül egy padra.', 0],
    ['Egy 30 fős osztályból 2 tanulót sorsolnak ki egy-egy különböző jutalomra.', 1], ['Egy rendszám három betűből és három számjegyből áll.', 2], ['Egy pizzára 8 feltétből 3 különbözőt választunk.', 3], ['7 különböző kulcsot sorban felakasztunk egy kulcstartó 7 kampójára.', 0], ['A 9 kártyából (1–9) 3-at húzunk egymás után visszatevéssel, és feljegyezzük a sorrendet.', 2], ['A 9 kártyából (1–9) 3-at húzunk egymás után visszatevés nélkül, és feljegyezzük a sorrendet.', 1], ['A 9 kártyából (1–9) egyszerre kihúzunk 3-at.', 3], ['A síkon 10 pont közül kettőt összekötünk egy szakasszal.', 3], ['A MATEK szó betűit minden lehetséges sorrendbe rakjuk.', 0], ['Egy 4 sávos zászló sávjait 6 színből színezzük, a színek ismétlődhetnek.', 2], ['Egy 25 fős osztályból egy 5 fős kosárlabdacsapat kezdőötösét jelöljük ki (a posztok nem számítanak).', 3]
  ];
  const MODELL = ['permutáció (sorba rendezés)', 'ismétlés nélküli variáció', 'ismétléses variáció', 'ismétlés nélküli kombináció'];
  feladatok.modell = { nev: 'Melyik modell illik ide?', general() {
    const [szoveg, h] = P(HELYZET);
    return { kerdes: `<p>Melyik kombinatorikai modellel számolhatjuk ki a lehetőségek számát?</p><p><b>${szoveg}</b></p>`, valasz: { valasztas: MODELL, helyes: h },
      tipp: 'Két kérdés: Mindegyik elemet felhasználjuk, vagy csak néhányat? Számít a sorrend? Lehet ismétlés?',
      megoldas: [`${szoveg} → ${MODELL[h]}.`, ['Minden elemet sorba rendezünk.', 'Néhány elemet választunk, a sorrend számít, ismétlés nincs.', 'A sorrend számít, és egy elem többször is választható.', 'Néhány elemet választunk, a sorrend nem számít.'][h]] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'gkomb',
    cim: 'Kiválasztás sorrend nélkül (kombináció)',
    rovid: 'Kombináció',
    bevezeto: 'Küldöttség, lottószelvény, kézfogások: ezekben a feladatokban csak az számít, kiket (miket) választunk ki – a sorrend nem.',
    elmelet: T`<div class="mathbox">\[\binom{n}{k}=\frac{n\cdot(n-1)\cdots(n-k+1)}{k!}=\frac{n!}{k!\,(n-k)!}\]</div>
<div class="prose"><ul>
<li>\(\binom nk\) (olvasd: „\(n\) alatt a \(k\)”): \(n\) különböző elemből \(k\) kiválasztásainak száma, ha a sorrend nem számít.</li>
<li>Miért osztunk \(k!\)-sal? A sorrendben vett kiválasztások (variációk) közül minden kiválasztott \(k\) elemes csoport \(k!\)-szor szerepel.</li>
<li>\(\binom{n}{k}=\binom{n}{n-k}\); \(\binom n0=\binom nn=1\); \(\binom n1=n\).</li>
<li>Kézfogások, mérkőzések, egyenesek: \(\binom n2=\frac{n(n-1)}{2}\). Egy \(n\)-szög átlói: \(\binom n2-n=\frac{n(n-3)}{2}\).</li>
<li>„Legalább egy”: gyakran egyszerűbb az összesből levonni azokat, ahol egy sincs.</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(\binom{5}{2}=10\)`, igaz: true, miert: T`\(\frac{5\cdot4}{2}=10\).` },
      { allitas: T`\(\binom{10}{3}=\binom{10}{7}\)`, igaz: true, miert: T`\(\binom nk=\binom n{n-k}\).` },
      { allitas: '6 ember 30 kézfogást ejt meg, ha mindenki mindenkivel egyszer kezet fog.', igaz: false, miert: T`\(\binom62=15\).` },
      { allitas: 'Egy 20 fős osztályból 3 fős küldöttséget 20 · 19 · 18 = 6840-féleképpen választhatunk.', igaz: false, miert: T`A sorrend nem számít: \(\frac{6840}{3!}=1140\).` },
      { allitas: 'Egy konvex hatszögnek 9 átlója van.', igaz: true, miert: T`\(\frac{6\cdot3}{2}=9\).` },
      { general() { const n = R(4, 12); const jo = R(0, 1) === 1; const v = jo ? C(n, 2) : n * (n - 1);
        return { allitas: `${n} csapat körmérkőzésén (mindenki mindenkivel egyszer) ${v} mérkőzés van.`, igaz: v === C(n, 2), miert: T`\(\binom{${n}}{2}=${C(n, 2)}\).` }; } }
    ],
    mintapelda: {
      feladat: 'Egy 12 lányból és 10 fiúból álló osztályból 3 fős küldöttséget választunk. Hány olyan küldöttség van, amelyben legalább egy fiú van?',
      lepesek: [T`Összes küldöttség: \(\binom{22}{3}=1540\).`, T`Csak lányokból álló: \(\binom{12}{3}=220\).`, T`Legalább egy fiú: \(1540-220=1320\).`]
    },
    feladatok
  }));
})();
