/*
 * Vizsga 2. / 5. fejezet – Magasabb fokú és törtes egyenletek
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2mag',
    cim: 'Magasabb fokú és törtes egyenletek',
    rovid: 'Magasabb fokú, törtes',
    bevezeto: T`Új ismeretlen bevezetése (bikvadratikus, ismétlődő kifejezés), harmad- és hatodfokú egyenletek, törtes egyenletek kikötéssel.`,
    elmelet: T`<div class="prose"><ul><li>\(ax^4+bx^2+c=0\): \(y=x^2\ge0\). \(ax^6+bx^3+c=0\): \(y=x^3\).</li>
<li>Ismétlődő kifejezés, pl. \((x^2+6x)(x^2+6x+4)=77\): \(y=x^2+6x\), a zárójeleket ne bontsd fel.</li>
<li>Törtes egyenlet: kikötés → szorzás a közös nevezővel → a kikötést nem teljesítő gyökök hamis gyökök.</li></ul></div>` + gyakorlo('77/1–4', '2162, 2177, 2179, 2180'),
    feladatok: {
      kobos: atvesz('mvissza', 'kobos', 'Harmad- és hatodfokú'),   // TK 77/1
      bikvad: atvesz('mvissza', 'bikvad', 'Negyedfokú (bikvadratikus)'),   // TK 77/2, FGY 2177
      ujvalt: atvesz('mvissza', 'ujvalt', 'Új változó bevezetése'),   // TK 77/3–4, FGY 2179, 2180
      tortes: atvesz('mvissza', 'tortes', 'Törtes egyenletek')   // FGY 2162
    }
  }, ['mvissza']));
})();
