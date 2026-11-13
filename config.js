/*
 * Matek gyakorló – beállítások
 * Ezt a fájlt kell szerkesztened telepítéskor.
 */
window.BEALLITAS = {
  // A Google Apps Script webalkalmazás URL-je (…/exec a vége).
  // Üresen hagyva „helyi mód”: nincs belépés, a haladás csak a böngészőben marad (teszteléshez jó).
  vegpont: 'https://script.google.com/macros/s/AKfycbwewOCystIZyruR6xlQQAZpDzAsCBP7dxw9oTK67yEY1bF9wFHbZuWm_ygDSjVgQbQEEQ/exec',

  // Az oldal neve a fejlécben.
  cim: 'Matek gyakorló',

  // Melyik tananyag töltődjön be, ha a felhasználónál nincs megadva (vagy helyi módban).
  // A tananyag mappája: tananyag/<azonosító>/kurzus.js
  alapTananyag: '11',

  // ALAPÉRTÉKEK – mindhárom felülírható évfolyamonként a tananyag/<évfolyam>/kurzus.js-ben.

  // Egy cukorkához a legutolsó nyitott fejezet MINDEN feladattípusából ennyi jó megoldás (új feladat) kell.
  // (kurzus.js: joValaszCukorkahoz)
  joValaszCukorkahoz: 10,

  // Ennyi cukorkába kerül a következő fejezet megnyitása. A diák a „Megnyitom” gombbal nyitja meg,
  // és a nyitás levonja az árát. Felülírható évfolyamonként, témakörönként és fejezetenként is
  // a kurzus.js-ben (cukorkaNyitashoz, ill. a fejezetnél { fajl: '…', cukorka: 2 }).
  cukorkaNyitashoz: 1,

  // Napi streak: ennyi ÚJ feladatot kell aznap megoldani a legutolsó nyitott fejezetben.
  // (kurzus.js: streakNapiMin)
  streakNapiMin: 1,

  // Igaz-hamis kérdésbank: ennyi állítás jelenik meg egyszerre (fejezetenként: igazHamisDb).
  igazHamisDb: 4,

  // Ha bármelyik tananyagfájlt módosítod, írd át ezt (pl. a mai dátumra),
  // hogy a diákok böngészője biztosan az új változatot töltse le.
  verzio: '2026-11-13'
};
