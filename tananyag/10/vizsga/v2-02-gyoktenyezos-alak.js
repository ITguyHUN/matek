/*
 * Vizsga 2. / 2. fejezet – Gyöktényezős alak, gyökök és együtthatók
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2gyt',
    cim: 'Gyöktényezős alak',
    rovid: 'Gyöktényezős alak',
    bevezeto: T`Szorzattá alakítás a gyökök segítségével, egyenlet felírása adott gyökökhöz, Viète-formulák.`,
    elmelet: T`<div class="mathbox">\[ax^2+bx+c=a(x-x_1)(x-x_2),\qquad x_1+x_2=-\frac ba,\quad x_1x_2=\frac ca\]</div>` + gyakorlo('', '2168–2171'),
    feladatok: {
      szorzatta: atvesz('mviete', 'szorzatta', 'Szorzattá alakítás'),   // FGY 2168
      felir: atvesz('mviete', 'felir', 'Egyenlet felírása a gyökökből'),   // FGY 2169, 2170
      viete: atvesz('mviete', 'viete', 'Viète-formulák')   // FGY 2171
    }
  }, ['mviete']));
})();
