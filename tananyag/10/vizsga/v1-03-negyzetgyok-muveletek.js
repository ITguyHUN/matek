/*
 * Vizsga 1. / 3. fejezet – Műveletek négyzetgyökös kifejezésekkel
 * Vizsgatematika 10.ABCD, 1. témakör: Négyzetgyök, n-edik gyök. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz1muv',
    cim: 'Műveletek négyzetgyökös kifejezésekkel',
    rovid: 'Gyökös műveletek',
    bevezeto: T`Összevonás, szorzás nevezetes azonosságokkal, a nevező gyöktelenítése, helyettesítési érték.`,
    elmelet: T`<div class="prose"><ul>
<li>Összevonás: csak azonos gyökös tagok: \(\sqrt{72}-\sqrt{32}+\sqrt8=6\sqrt2-4\sqrt2+2\sqrt2=4\sqrt2\).</li>
<li>Nevezetes azonosságok: \((\sqrt a+\sqrt b)(\sqrt a-\sqrt b)=a-b\); \((p+q\sqrt m)^2=p^2+2pq\sqrt m+q^2m\).</li>
<li>Gyöktelenítés: \(\frac{a}{\sqrt b}=\frac{a\sqrt b}{b}\); \(\frac{a}{\sqrt m-n}=\frac{a(\sqrt m+n)}{m-n^2}\).</li></ul></div>` + gyakorlo('47/3, 4, 6ab, 7ab', '2103, 2104, 2106, 2107, 2108, 2109'),
    feladatok: {
      osszevon: atvesz('vgy2', 'osszevon', 'Összevonás'),   // FGY 2106, TK 47/3
      szorzas: atvesz('vgy2', 'szorzas', 'Szorzás, nevezetes azonosságok'),   // FGY 2103, 2104
      gyoktelenit: atvesz('vgy2', 'gyoktelenit', 'A nevező gyöktelenítése'),   // FGY 2107, 2108, TK 47/4
      konjugalt: atvesz('vgy4', 'konjugalt', 'Gyöktelenítés két gyökkel'),   // FGY 2108
      behelyettesit: atvesz('vgy2', 'behelyettesit', 'Helyettesítési érték')   // TK 47/7, FGY 2109
    }
  }, ['vgy2']));
})();
