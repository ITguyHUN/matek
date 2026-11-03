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

  // Ennyi egymás utáni jó megoldás (új feladat, a legutolsó nyitott fejezetben) ér 1 cukorkát.
  joValaszCukorkahoz: 10,

  // Ennyi cukorkába kerül a következő fejezet megnyitása (a nyitás levonja a cukorkák közül).
  // Témakörönként felülírható a kurzus.js-ben (cukorkaNyitashoz).
  cukorkaNyitashoz: 3,

  // Napi streak: ennyi ÚJ feladatot kell aznap megoldani a legutolsó nyitott fejezetben.
  streakNapiMin: 1,

  // Ha bármelyik tananyagfájlt módosítod, írd át ezt (pl. a mai dátumra),
  // hogy a diákok böngészője biztosan az új változatot töltse le.
  verzio: '2026-11-03b'
};
