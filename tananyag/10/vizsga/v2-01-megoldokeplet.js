/*
 * Vizsga 2. / 1. fejezet – A megoldóképlet alkalmazása
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2kep',
    cim: 'A megoldóképlet alkalmazása',
    rovid: 'Megoldóképlet',
    bevezeto: T`Hiányos egyenletek, szorzat alak, teljes négyzet, a megoldóképlet és a rendezés utáni megoldás.`,
    elmelet: T`<div class="mathbox">\[ax^2+bx+c=0\ (a\neq0)\quad\Rightarrow\quad x_{1,2}=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\]</div>
<div class="prose"><ul><li>Hiányos egyenletnél nem kell a képlet: \(ax^2+c=0\Rightarrow x^2=-\frac ca\); \(ax^2+bx=0\Rightarrow x(ax+b)=0\).</li>
<li>Először rendezz 0-ra; negatív együtthatót zárójelben helyettesíts be.</li></ul></div>` + gyakorlo('66/1–5', '2157–2161'),
    feladatok: {
      hianyos: atvesz('mkeplet', 'hianyos', 'Hiányos másodfokú egyenletek'),   // FGY 2157, 2158
      szorzat: atvesz('mkeplet', 'szorzat', 'Szorzat nulla'),   // FGY 2157
      negyzetes: atvesz('mkeplet', 'negyzetes', 'Négyzet = szám alak'),   // TK 66/2
      teljnegyzet: atvesz('mkeplet', 'teljnegyzet', 'Teljes négyzetté alakítással'),   // TK 66/3, FGY 2159
      keplet: atvesz('mkeplet', 'keplet', 'Megoldóképlet'),   // TK 66/4, FGY 2160
      rendez: atvesz('mkeplet', 'rendez', 'Rendezés után megoldóképlettel')   // TK 66/5, FGY 2161
    }
  }, ['mkeplet']));
})();
