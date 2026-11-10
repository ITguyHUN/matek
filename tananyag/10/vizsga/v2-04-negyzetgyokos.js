/*
 * Vizsga 2. / 4. fejezet – Négyzetgyökös egyenletek
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  /* TK 93/2: értelmezési tartomány vizsgálatával megoldható egyenletek */
  const { R0, l1, FMT10 } = M10;
  const ertelmezes = { nev: 'Megoldás az értelmezési tartománnyal', general() {
    const a = R(-9, 9); const t = R(0, 3);
    let eq, gy, mo;
    if (t === 0) { eq = T`\sqrt{${l1(1, -a)}}+\sqrt{${l1(-1, a)}}=0`; gy = [a]; mo = T`Mindkét gyök értelmezett: \(x\ge${a}\) és \(x\le${a}\), tehát csak \(x=${a}\) jöhet szóba; ekkor \(0+0=0\). ✓`; }
    else if (t === 1) { const k = R(1, 9); eq = T`\sqrt{${l1(1, -a)}}+\sqrt{${l1(-1, a)}}=${k}`; gy = []; mo = T`Csak \(x=${a}\) értelmezett, de ekkor a bal oldal 0, nem \(${k}\): nincs megoldás.`; }
    else if (t === 2) { const d = R(1, 6); eq = T`\sqrt{${l1(1, -a)}}=\sqrt{${l1(-1, a - d)}}`; gy = []; mo = T`Az értelmezési tartomány: \(x\ge${a}\) és \(x\le${a - d}\) – nincs ilyen \(x\), tehát nincs megoldás.`; }
    else { const k = R(1, 9); eq = T`\sqrt{${l1(1, -a)}}+${k}=0`; gy = []; mo = T`\(\sqrt{${l1(1, -a)}}\ge0\), így a bal oldal legalább \(${k}\): nincs megoldás.`; }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! (Ha nincs megoldás, írd: nincs.)</p>\[${eq}\]`,
      valasz: gy.length ? { ertekek: gy } : { nincs: true }, formatum: FMT10.halmaz,
      tipp: 'Először nézd meg, mely x-ekre értelmezett az egyenlet (a gyök alatt nem lehet negatív szám). Sokszor ez már el is dönti a kérdést.',
      megoldas: [mo] };
  } };

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2gyok',
    cim: 'Négyzetgyökös egyenletek',
    rovid: 'Négyzetgyökös egyenletek',
    bevezeto: T`Értelmezési tartomány, négyzetre emelés, hamis gyökök kiszűrése ellenőrzéssel.`,
    elmelet: T`<div class="prose"><ol><li>Értelmezési tartomány (gyök alatt \(\ge0\)).</li><li>A gyökös tag egyedül az egyik oldalon; a másik oldal sem lehet negatív.</li><li>Négyzetre emelés, megoldás.</li><li><b>Ellenőrzés</b> – a négyzetre emelés hamis gyököt hozhat!</li></ol></div>` + gyakorlo('93/1, 2, 4', '2200, 2201, 2203'),
    feladatok: {
      alap: atvesz('mgyokos', 'alap', 'Egyszerű gyökös egyenlet'),   // TK 93/1, FGY 2200
      ertelmezes,   // TK 93/2 (ebben a fájlban)
      ketgyok: atvesz('mgyokos', 'ketgyok', 'Két gyök egyenlősége'),   // FGY 2200
      linearis: atvesz('mgyokos', 'linearis', 'Gyök = elsőfokú kifejezés'),   // FGY 2201
      osszeg: atvesz('mgyokos', 'osszeg', 'Két gyök összege, különbsége')   // TK 93/4, FGY 2203
    }
  }, ['mgyokos']));
})();
