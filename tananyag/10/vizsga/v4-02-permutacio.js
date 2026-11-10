/*
 * Vizsga 4. / 2. fejezet – Permutáció
 * Vizsgatematika 10.ABCD, 4. témakör: Kombinatorika, valószínűségszámítás. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz4perm',
    cim: 'Permutáció (sorba rendezés)',
    rovid: 'Permutáció',
    bevezeto: T`Különböző és ismétlődő elemek sorba rendezése, feltételek, körbe rendezés.`,
    elmelet: T`<div class="prose"><ul><li>\(n\) különböző elem sorrendje: \(n!\). Ismétléses permutáció: \(\frac{n!}{k_1!\,k_2!\cdots}\).</li><li>Körbe rendezés: \((n-1)!\).</li><li>A 0 nem állhat egy szám első helyén.</li></ul></div>` + gyakorlo('28/1–14', '2028–2041'),
    feladatok: {
      perm: atvesz('gsorba', 'perm', 'Különböző elemek sorrendje'),   // FGY 2028–2034
      ismperm: atvesz('gsorba', 'ismperm', 'Ismétléses permutáció'),   // TK 28/3–7, FGY 2035–2041
      feltetel: atvesz('gsorba', 'feltetel', 'Sorba rendezés feltétellel'),   // TK 28/1–2
      kor: atvesz('gsorba', 'kor', 'Körbe rendezés'),   // TK 28/1, 9
      szamjegy: atvesz('gsorba', 'szamjegy', 'Számok a megadott jegyekből')
    }
  }, ['gsorba']));
})();
