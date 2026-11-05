/*
 * 11. évfolyam – tananyag-leíró
 * Új témakör: vegyél fel egy új elemet a `temakorok` listába, és hozd létre a mappáját a fejezetfájlokkal.
 * Új fejezet: hozd létre a fájlt a témakör mappájában, és írd be a `fejezetek` listába a megfelelő helyre.
 * A fejezetek SORRENDJE egyben a megnyitási sorrend is.
 */
Tananyag.kurzus({
  cim: 'Matek 11',
  alcim: '11. évfolyam · középszintű érettségi',
  jelek: 'aⁿ · ⁿ√a · logₐ b',
  // alapTemakor: 'hgl',   // melyik témakör legyen kiválasztva, amíg a diák nem választ mást (elhagyható)
  // Évfolyamszintű szabályok (elhagyhatók – akkor a config.js értéke érvényes):
  // joValaszCukorkahoz: 10,   // egy cukorkához minden feladattípusból ennyi új jó megoldás kell (témakörnél is megadható)
  // cukorkaNyitashoz: 1,      // egy fejezet nyitási ára ebben az évfolyamban
  // streakNapiMin: 1,         // napi sorozathoz ennyi új feladat kell aznap
  temakorok: [
    {
      id: 'hgl',
      cim: 'Hatvány, gyök, logaritmus',
      mappa: 'hatvany-gyok-log',
      cukorkaNyitashoz: 1,          // ennyi cukorkába kerül egy fejezet; elhagyható (akkor az évfolyam / config.js értéke)
      proba: { feladatszam: 12 },   // próba-témazáró: ennyi feladat; nyitási ára: proba: { feladatszam: 12, cukorka: 2 }
      // Fejezetenként eltérő ár: a fájlnév helyett { fajl: '…js', cukorka: 2 } – ennyibe kerül megnyitni AZT a fejezetet.
      fejezetek: [
        '01-hatvanyozas.js',
        '02-gyokvonas.js',
        '03-tortkitevo.js',
        '04-exp-fuggveny.js',
        '05-exp-egyenletek.js',
        '06-logaritmus.js',
        '07-log-azonossagok.js',
        '08-log-fuggveny.js',
        '09-log-egyenletek.js',
        '10-alkalmazasok.js'
      ]
    }
    // , { id: 'trig', cim: 'Trigonometria', mappa: 'trigonometria', fejezetek: ['01-szogfuggvenyek.js', …] }
  ]
});
