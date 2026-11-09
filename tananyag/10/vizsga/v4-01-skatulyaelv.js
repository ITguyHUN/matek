/*
 * Vizsga 4. / 1. fejezet – Skatulyaelv
 * Vizsgatematika 10.ABCD, 4. témakör: Kombinatorika, valószínűségszámítás. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz4skat',
    cim: 'Skatulyaelv',
    rovid: 'Skatulyaelv',
    bevezeto: T`„Legalább hányat kell kivenni, hogy biztosan…?” – a legrosszabb eset végiggondolása.`,
    elmelet: T`<div class="prose"><ul><li>\(n\) skatulyába \(n+1\) tárgy: valamelyikben legalább 2 van; \(nk+1\) tárgy: valamelyikben legalább \(k+1\).</li><li>Gondold végig a legrosszabb esetet, és adj hozzá egyet.</li></ul></div>` + gyakorlo('24/1–12', ''),
    feladatok: {
      alap: atvesz('gskat', 'alap', 'Legalább hányat kell kivenni?'),
      korlatos: atvesz('gskat', 'korlatos', 'Különböző darabszámú színek'),
      legalabb: atvesz('gskat', 'legalabb', 'Legalább hány esik egy skatulyába?'),
      maradek: atvesz('gskat', 'maradek', 'Maradékok, számjegyek')
    }
  }, ['gskat']));
})();
