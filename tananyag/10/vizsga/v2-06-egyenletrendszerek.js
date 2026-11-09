/*
 * Vizsga 2. / 6. fejezet – Egyenletrendszerek
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2rsz',
    cim: 'Másodfokú egyenletrendszerek',
    rovid: 'Egyenletrendszerek',
    bevezeto: T`Elsőfokú és másodfokú egyenletből álló rendszerek megoldása behelyettesítéssel.`,
    elmelet: T`<div class="prose"><ol><li>Az elsőfokú egyenletből fejezd ki az egyik ismeretlent.</li><li>Helyettesítsd be a másodfokúba, és oldd meg.</li><li>Mindegyik gyökhöz számold ki a másik ismeretlent: a megoldás számpár.</li></ol>
<ul><li>\(x+y=S,\ xy=P\): \(x\) és \(y\) a \(t^2-St+P=0\) egyenlet gyökei.</li></ul></div>` + gyakorlo('', '2178, 2181'),
    feladatok: {
      behely: atvesz('mrendszer', 'behely', 'Elsőfokú és másodfokú (behelyettesítés)'),   // FGY 2178, 2181
      osszszorz: atvesz('mrendszer', 'osszszorz', 'Összeg/különbség és szorzat'),   // FGY 2178
      negyzetossz: atvesz('mrendszer', 'negyzetossz', 'Négyzetösszeg és összeg/különbség'),
      szorzatlin: atvesz('mrendszer', 'szorzatlin', 'Szorzat és lineáris egyenlet')
    }
  }, ['mrendszer']));
})();
