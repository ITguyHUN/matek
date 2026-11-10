/*
 * Vizsga 1. / 5. fejezet – Műveletek n-edik gyökökkel
 * Vizsgatematika 10.ABCD, 1. témakör: Négyzetgyök, n-edik gyök. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz1nmuv',
    cim: 'Műveletek n-edik gyökökkel',
    rovid: 'n-edik gyök: műveletek',
    bevezeto: T`Kiemelés és összevonás, egyetlen gyökjel alá írás, a nevező gyöktelenítése.`,
    elmelet: T`<div class="prose"><ul>
<li>Kiemelés: \(\sqrt[3]{54}=\sqrt[3]{27\cdot2}=3\sqrt[3]2\); összevonás: \(\sqrt[3]{16}+\sqrt[3]{54}-\sqrt[3]{250}=2\sqrt[3]2+3\sqrt[3]2-5\sqrt[3]2=0\).</li>
<li>Közös gyökkitevő: \(\sqrt2\cdot\sqrt[3]2=\sqrt[6]{2^3}\cdot\sqrt[6]{2^2}=\sqrt[6]{32}\).</li>
<li>Gyöktelenítés: \(\frac{6}{\sqrt[3]3}=\frac{6\sqrt[3]9}{3}=2\sqrt[3]9\).</li></ul></div>` + gyakorlo('56/3–5', '2130, 2131, 2143'),
    feladatok: {
      kiemeles: atvesz('vgy3', 'kiemeles', 'Kiemelés a gyökjel alól'),   // TK 56/4
      osszevon: atvesz('vgy3', 'osszevon', 'Összevonás'),   // TK 56/4, FGY 2130
      kozos: atvesz('vgy3', 'kozos', 'Egyetlen gyökjel alá írás'),   // TK 56/3, FGY 2131, 2143
      gyoktelen: atvesz('vgy3', 'gyoktelen', 'Gyöktelenítés n-edik gyökkel')   // TK 56/5
    }
  }, ['vgy3']));
})();
