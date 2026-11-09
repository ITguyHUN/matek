/*
 * II. Algebra és számelmélet / 11. Számrendszerek
 * (Sokszínű matematika 9., II/11. lecke; FGY 1215–1220, 1222; OH Matematika 9.; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { keverd, kulonbozo, toBase, fromBase, alapT, kifejtesT, asos, az, FMT9 } = M9;
  const feladatok = {};
  const ALSO = '₀₁₂₃₄₅₆₇₈₉';
  const alsoIndex = n => String(n).split('').map(c => ALSO[+c]).join('');
  const szoveg = (s, b) => s + alsoIndex(b);              // feleletválasztós gombokhoz: 1011₂
  const valaszJegy = s => ({ ertekek: [Number(s)] });    // a számjegysor tízesként olvasva (alap ≤ 10)
  /* maradékos osztások sorozata (tízesből b alapúba) */
  function osztasok(n, b) { const sor = []; let x = n; while (x > 0) { sor.push(T`${x}:${b}=${Math.floor(x / b)}\ \text{maradék}\ ${x % b}`); x = Math.floor(x / b); } return sor; }
  const nevAlap = b => `${asos(b)} számrendszer`;

  /* ---------- tízes számrendszerbe ---------- */
  feladatok.tizesbe = { nev: 'Átírás tízes számrendszerbe', general() {
    const b = P([2, 2, 3, 4, 5, 5, 6, 7, 8, 9]); const max = { 2: 255, 3: 728, 4: 1023, 5: 3124, 6: 1295, 7: 2400, 8: 4095, 9: 6560 }[b];
    const n = R(b * b, max); const s = toBase(n, b);
    return { kerdes: T`<p>Írd át tízes számrendszerbe!</p>\[${alapT(s, b)}\]`, valasz: { ertekek: [n] }, formatum: FMT9.egesz,
      tipp: T`Minden helyiérték az alap egy hatványa: jobbról az első \(${b}^0=1\), a második \(${b}^1=${b}\), a harmadik \(${b}^2=${b * b}\), …`,
      megoldas: [T`\[${alapT(s, b)}=${kifejtesT(s, b)}=${n}\]`] };
  } };

  /* ---------- tízesből más alapúba ---------- */
  feladatok.tizesbol = { nev: 'Átírás tízesből más számrendszerbe', general() {
    const b = P([2, 2, 3, 4, 5, 5, 6, 7, 8, 9]); const max = { 2: 200, 3: 700, 4: 1000, 5: 2000, 6: 1200, 7: 2000, 8: 3000, 9: 5000 }[b];
    const n = R(b * b, max); const s = toBase(n, b);
    return { kerdes: T`<p>Írd át ${az(b)} ${nevAlap(b)}be! (Csak a számjegyeket írd be, alsó index nélkül.)</p>\[${n}=\;?_{${b}}\]`, valasz: valaszJegy(s), formatum: FMT9.szamjegy,
      tipp: T`Oszd el a számot maradékosan ${M9.vel(b)}, aztán a hányadost újra, amíg 0 nem lesz. A maradékokat alulról felfelé olvasd össze!`,
      megoldas: [osztasok(n, b).map(x => T`\(${x}\)`).join('<br>'), T`A maradékok alulról felfelé: \(${n}=${alapT(s, b)}\).`] };
  } };

  /* ---------- két nem tízes számrendszer között ---------- */
  feladatok.atvaltas = { nev: 'Átváltás két számrendszer között', general() {
    let [b1, b2] = kulonbozo(2, 2, 9); if (R(0, 2) === 0) [b1, b2] = P([[2, 8], [2, 4], [8, 2], [4, 2], [3, 9], [9, 3]]);
    const n = R(Math.max(b1, b2) ** 2, Math.min(800, b1 ** 5, b2 ** 5)); const s1 = toBase(n, b1), s2 = toBase(n, b2);
    const kulon = (b1 === 2 && [4, 8].includes(b2)) || (b2 === 2 && [4, 8].includes(b1)) || (b1 === 3 && b2 === 9) || (b1 === 9 && b2 === 3);
    return { kerdes: T`<p>Írd át ${az(b2)} ${nevAlap(b2)}be! (Csak a számjegyeket írd be.)</p>\[${alapT(s1, b1)}=\;?_{${b2}}\]`, valasz: valaszJegy(s2), formatum: FMT9.szamjegy,
      tipp: kulon ? (b1 < b2 ? `Mivel ${b2} = ${b1}${b2 === b1 * b1 ? '²' : '³'}, jobbról ${b2 === b1 * b1 ? 'kettesével' : 'hármasával'} csoportosíthatod a jegyeket!` : `Mivel ${b1} = ${b2}${b1 === b2 * b2 ? '²' : '³'}, minden jegy ${b1 === b2 * b2 ? 'két' : 'három'} jeggyé alakítható!`) : 'Legegyszerűbb tízes számrendszeren keresztül: előbb írd át tízesbe, aztán a kért alapúba.',
      megoldas: [T`\(${alapT(s1, b1)}=${kifejtesT(s1, b1)}=${n}\)`, T`\(${n}=${alapT(s2, b2)}\)`] };
  } };

  /* ---------- műveletek ---------- */
  feladatok.muvelet = { nev: 'Műveletek más számrendszerben', general() {
    const b = P([2, 3, 4, 5, 6, 7, 8]); const t = R(0, 2); let x, y, e, jel;
    if (t === 0) { x = R(b * b, b ** 4); y = R(b, b ** 4); e = x + y; jel = '+'; }
    else if (t === 1) { x = R(b * b, b ** 4); y = R(b, x - 1); e = x - y; jel = '-'; }
    else { x = R(b + 1, b ** 3); y = R(2, b * b); e = x * y; jel = T`\cdot `; }
    const sx = toBase(x, b), sy = toBase(y, b), se = toBase(e, b);
    return { kerdes: T`<p>Végezd el a műveletet ${az(b)} ${nevAlap(b)}ben, és az eredményt is így add meg! (Csak a számjegyeket írd be.)</p>\[${alapT(sx, b)}${jel}${alapT(sy, b)}=\;?_{${b}}\]`, valasz: valaszJegy(se), formatum: FMT9.szamjegy,
      tipp: t === 0 ? `Írásban is összeadhatsz, mint tízesben: ha egy helyiértéken az összeg eléri az alapot (${b}), akkor 1-et átviszel a következő helyiértékre. Vagy: írd át tízesbe, számolj, majd írd vissza.` : 'Írd át mindkét számot tízesbe, végezd el a műveletet, majd írd vissza az eredményt!',
      megoldas: [T`Tízesben: \(${x}${jel}${y}=${e}\)`, T`\(${e}=${alapT(se, b)}\)`] };
  } };

  /* ---------- összehasonlítás, rendezés ---------- */
  feladatok.legnagyobb = { nev: 'Melyik a legnagyobb?', general() {
    const alapok = keverd([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
    let ertekek; for (let g = 0; g < 100; g++) { const c = R(20, 120); ertekek = alapok.map(() => c + R(-15, 15)); if (new Set(ertekek).size === 4) break; }
    const sz = alapok.map((b, i) => ({ b, n: ertekek[i], s: toBase(ertekek[i], b) }));
    const max = sz.reduce((m, x) => x.n > m.n ? x : m);
    const kerdMin = R(0, 1) === 1; const min = sz.reduce((m, x) => x.n < m.n ? x : m); const jo = kerdMin ? min : max;
    return { kerdes: T`<p>Melyik szám a ${kerdMin ? 'legkisebb' : 'legnagyobb'}?</p>\[${sz.map(x => alapT(x.s, x.b)).join(T`;\qquad `)}\]`, valasz: { valasztas: sz.map(x => szoveg(x.s, x.b)), helyes: sz.indexOf(jo) },
      tipp: 'Írd át mindegyiket tízes számrendszerbe, és úgy hasonlítsd össze őket!',
      megoldas: [sz.map(x => T`\(${alapT(x.s, x.b)}=${x.n}\)`).join('; '), `A ${kerdMin ? 'legkisebb' : 'legnagyobb'}: ${szoveg(jo.s, jo.b)}.`] };
  } };

  /* ---------- számrendszer-fejtörők ---------- */
  feladatok.alap = { nev: 'Melyik számrendszerben?', general() {
    const t = R(0, 3);
    if (t === 0) { const b = R(3, 9); const s = String(R(1, b - 1)) + String(R(0, b - 1)) + (R(0, 1) ? String(R(0, b - 1)) : ''); const n = fromBase(s, b);
      return { kerdes: T`<p>Melyik számrendszerben igaz az egyenlőség? (Add meg az alapszámot!)</p>\[${s}_{\,?}=${n}\]`, valasz: { ertekek: [b] }, formatum: FMT9.egesz,
        tipp: T`Írd fel a bal oldalt helyiértékekkel, az alapot \(x\)-szel jelölve, és próbálgass! Az alap nagyobb a legnagyobb számjegynél.`,
        megoldas: [T`\(${kifejtesT(s, 'x')}=${n}\)`, T`Az \(x=${b}\) esetén: \(${kifejtesT(s, b)}=${n}\). Tehát ${asos(b)} számrendszerről van szó.`] }; }
    if (t === 1) { const b = P([2, 2, 3, 5, 8]); const n = R(50, 3000); const s = toBase(n, b);
      return { kerdes: T`<p>Hány jegyű ${az(n)} ${n} szám ${az(b)} ${nevAlap(b)}ben?</p>`, valasz: { ertekek: [s.length] }, formatum: FMT9.egesz,
        tipp: T`Keresd meg ${b} hatványai közül, melyek közé esik a szám: ha \(${b}^{k-1}\le n<${b}^{k}\), akkor \(k\) jegyű.`,
        megoldas: [T`\(${b}^{${s.length - 1}}=${b ** (s.length - 1)}\le ${n}<${b ** s.length}=${b}^{${s.length}}\), tehát ${s.length} jegyű: \(${alapT(s, b)}\).`] }; }
    if (t === 2) { const b = R(2, 9), k = R(2, 4); const s = String(b - 1).repeat(k); const n = b ** k - 1;
      return { kerdes: T`<p>Melyik a legnagyobb ${['', '', 'kétjegyű', 'háromjegyű', 'négyjegyű'][k]} szám ${az(b)} ${nevAlap(b)}ben? Add meg tízes számrendszerben!</p>`, valasz: { ertekek: [n] }, formatum: FMT9.egesz,
        tipp: `A legnagyobb számjegy ${b - 1}.`, megoldas: [T`\(${alapT(s, b)}=${b}^{${k}}-1=${n}\)`] }; }
    const b = P([2, 3, 4, 5]); const n = R(10, 400); const s = toBase(n, b); const nulla = s.split('').filter(c => c === '0').length;
    return { kerdes: T`<p>Hány 0 számjegy van ${az(n)} ${n} szám ${az(b)} ${nevAlap(b)}beli alakjában?</p>`,
      valasz: { ertekek: [nulla] }, formatum: FMT9.nemneg, tipp: 'Írd át a számot, és számold meg a nullákat!', megoldas: [T`\(${n}=${alapT(s, b)}\), ebben ${nulla} darab 0 van.`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg11',
    cim: 'Számrendszerek',
    rovid: 'Számrendszerek',
    bevezeto: 'Helyiértékes írásmód tetszőleges alapú számrendszerben: átváltás oda-vissza, műveletek, összehasonlítás.',
    elmelet: T`<div class="prose"><p>A \(b\) alapú számrendszerben (\(b\ge2\) egész) a számjegyek \(0,1,\dots,b-1\), és a helyiértékek jobbról balra \(b^0=1,\ b^1,\ b^2,\ b^3,\dots\)</p></div>
<div class="mathbox">\[2103_{5}=2\cdot5^3+1\cdot5^2+0\cdot5+3=250+25+0+3=278\]</div>
<div class="prose"><ul><li><b>Tízesből \(b\) alapúba:</b> a számot maradékosan osztjuk \(b\)-vel, a hányadost ismét, amíg 0 nem lesz. A maradékokat <b>alulról felfelé</b> olvassuk össze: \[29:2=14\ (1),\ 14:2=7\ (0),\ 7:2=3\ (1),\ 3:2=1\ (1),\ 1:2=0\ (1)\ \Rightarrow\ 29=11101_2\]</li>
<li><b>Kettes ↔ nyolcas, négyes:</b> mivel \(8=2^3\), a kettes számrendszerbeli jegyeket jobbról hármasával csoportosítva rögtön kapjuk a nyolcas jegyeit: \(\underbrace{10}_{2}\,\underbrace{110}_{6}\,\underbrace{011}_{3}{}_2=263_8\).</li>
<li><b>Műveletek:</b> ugyanúgy végezhetők, mint tízesben, csak \(b\)-nél „lépünk át”: \(4_5+3_5=12_5\).</li>
<li>A \(b\) alapú legnagyobb \(k\)-jegyű szám \(b^k-1\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(101_2=5\)`, igaz: true, miert: T`\(4+0+1=5\).` },
      { allitas: T`\(101_2=101\)`, igaz: false, miert: T`\(101_2=1\cdot4+0\cdot2+1=5\).` },
      { allitas: 'Az 5-ös számrendszerben az 5 is számjegy.', igaz: false, miert: 'A számjegyek 0, 1, 2, 3, 4.' },
      { allitas: T`\(10_b=b\) minden \(b\ge2\) alapra.`, igaz: true, miert: T`\(1\cdot b+0=b\).` },
      { allitas: T`\(100_3=9\)`, igaz: true, miert: T`\(3^2=9\).` },
      { allitas: T`\(1111_2=15\)`, igaz: true, miert: T`\(8+4+2+1=15\), vagy \(2^4-1\).` },
      { allitas: T`\(23_4=23_5\)`, igaz: false, miert: T`\(23_4=11\), \(23_5=13\).` },
      { allitas: T`Kettes számrendszerben egy szám pontosan akkor páros, ha 0-ra végződik.`, igaz: true, miert: 'Az utolsó jegy után minden helyiérték páros.' },
      { allitas: T`\(1000_2>1000_3\)`, igaz: false, miert: T`\(8<27\).` },
      { allitas: T`\(3124_5+10232_5=14411_5\)`, igaz: false, miert: T`\(3124_5=414\), \(10232_5=692\), az összeg \(1106=13411_5\).` },
      { allitas: T`\(77_8=63\)`, igaz: true, miert: T`\(7\cdot8+7=63=8^2-1\).` },
      { general() { const b = P([2, 3, 5, 8]); const n = R(5, 60); const s = toBase(n, b); const mut = R(0, 1) ? n : n + P([-1, 1, b]);
        return { allitas: T`\(${alapT(s, b)}=${mut}\)`, igaz: mut === n, miert: T`\(${alapT(s, b)}=${kifejtesT(s, b)}=${n}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Írjuk át az 1956-ot 5-ös számrendszerbe!`,
      lepesek: [T`\(1956:5=391\), maradék 1`, T`\(391:5=78\), maradék 1; \(\;78:5=15\), maradék 3`, T`\(15:5=3\), maradék 0; \(\;3:5=0\), maradék 3`, T`Alulról felfelé olvasva: \(1956=30311_5\). Ellenőrzés: \(3\cdot625+0+3\cdot25+1\cdot5+1=1956\).`]
    },
    feladatok
  }));
})();
