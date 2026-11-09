/*
 * Vizsga 2. / 7. fejezet – Szöveges feladatok
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2szov',
    cim: 'Másodfokú egyenletre vezető szöveges feladatok',
    rovid: 'Szöveges feladatok',
    bevezeto: T`Számok, geometria, mozgás, közös munka, átlók és mérkőzések, ár és mennyiség.`,
    elmelet: T`<div class="prose"><ol><li>Válaszd meg az ismeretlent (mértékegységgel!).</li><li>Írd fel az egyenletet a szöveg alapján.</li><li>Oldd meg.</li><li>Ellenőrizd a szöveg alapján: csak az értelmes gyök (pozitív hossz, idő, darabszám) a megoldás.</li></ol></div>` + gyakorlo('106/1–7', '2220–2232'),
    feladatok: {
      szamok: atvesz('mszoveg', 'szamok', 'Számokra vonatkozó feladatok'),   // FGY 2220, 2221, 2226
      geometria: atvesz('mszoveg', 'geometria', 'Geometriai feladatok'),   // TK 106/1, 6, FGY 2223, 2225
      mozgas: atvesz('mszoveg', 'mozgas', 'Mozgásos feladatok'),   // TK 106/5, FGY 2227
      munka: atvesz('mszoveg', 'munka', 'Közös munka'),   // TK 106/7, FGY 2228, 2232
      kombi: atvesz('mszoveg', 'kombi', 'Átlók, mérkőzések, kézfogások'),   // TK 106/3, 4, FGY 2224, 2230
      penz: atvesz('mszoveg', 'penz', 'Ár és mennyiség')   // FGY 2222, 2229
    }
  }, ['mszoveg']));
})();
