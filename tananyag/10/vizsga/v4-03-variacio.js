/*
 * Vizsga 4. / 3. fejezet – Variáció
 * Vizsgatematika 10.ABCD, 4. témakör: Kombinatorika, valószínűségszámítás. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz4var',
    cim: 'Variáció (kiválasztás, a sorrend számít)',
    rovid: 'Variáció',
    bevezeto: T`Ismétlés nélküli és ismétléses variáció: dobogó, tisztségek, kódok, számok képzése.`,
    elmelet: T`<div class="prose"><ul><li>Ismétlés nélkül: \(n(n-1)\cdots(n-k+1)=\frac{n!}{(n-k)!}\). Ismétléssel: \(n^k\).</li><li>Haladj helyről helyre, és szorozd össze a lehetőségek számát; a megkötéses hellyel kezdd.</li></ul></div>` + gyakorlo('31/1–10', '2053–2067, 2068–2073'),
    feladatok: {
      variacio: atvesz('gvalaszt', 'variacio', 'Kiválasztás, a sorrend számít'),   // FGY 2053–2060
      ismvar: atvesz('gvalaszt', 'ismvar', 'Kiválasztás ismétléssel'),   // FGY 2061–2067
      szamok: atvesz('gvalaszt', 'szamok', 'Számok képzése számjegyekből'),   // TK 31/3, 6, 7
      zaszlo: atvesz('gvalaszt', 'zaszlo', 'Zászlók, színezések')   // TK 31/1–2
    }
  }, ['gvalaszt']));
})();
