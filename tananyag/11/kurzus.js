/*
 * 11. évfolyam – tananyag-leíró
 * Új témakör: vegyél fel egy új elemet a `temakorok` listába, és hozd létre a mappáját a fejezetfájlokkal.
 * Új fejezet: hozd létre a fájlt a témakör mappájában, és írd be a `fejezetek` listába a megfelelő helyre.
 * A fejezetek SORRENDJE egyben a megnyitási sorrend is.
 */
Tananyag.kurzus({
  cim: 'Matek 11',
  alcim: '11. évfolyam · középszintű érettségi',
  temakorok: [
    {
      id: 'hgl',
      cim: 'Hatvány, gyök, logaritmus',
      mappa: 'hatvany-gyok-log',
      cukorkaNyitashoz: 3,          // ennyi cukorkába kerül a következő fejezet; elhagyható (akkor a config.js értéke)
      proba: { feladatszam: 12 },   // próba-témazáró: ennyi feladat a már megnyitott fejezetekből
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
