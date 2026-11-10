/*
 * Vizsga 4. / 4. fejezet – Ismétlés nélküli kombináció
 * Vizsgatematika 10.ABCD, 4. témakör: Kombinatorika, valószínűségszámítás. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz4komb',
    cim: 'Ismétlés nélküli kombináció',
    rovid: 'Kombináció',
    bevezeto: T`Kiválasztás, amikor a sorrend nem számít: küldöttség, lottó, kézfogások, átlók.`,
    elmelet: T`<div class="mathbox">\[\binom nk=\frac{n(n-1)\cdots(n-k+1)}{k!}=\frac{n!}{k!\,(n-k)!}\]</div>` + gyakorlo('', '2068–2073'),
    feladatok: {
      komb: atvesz('gkomb', 'komb', 'Kiválasztás, a sorrend nem számít'),
      feltetel: atvesz('gkomb', 'feltetel', 'Kiválasztás feltétellel'),
      atlo: atvesz('gkomb', 'atlo', 'Átlók, szakaszok'),
      modell: atvesz('gkomb', 'modell', 'Melyik modell illik ide?')
    }
  }, ['gkomb']));
})();
