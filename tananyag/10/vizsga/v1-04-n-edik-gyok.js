/*
 * Vizsga 1. / 4. fejezet – Az n-edik gyök és azonosságai
 * Vizsgatematika 10.ABCD, 1. témakör: Négyzetgyök, n-edik gyök. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz1nedik',
    cim: 'Az n-edik gyök és azonosságai',
    rovid: 'n-edik gyök',
    bevezeto: T`Az n-edik gyök kiszámítása, a gyökvonás azonosságai, összehasonlítás.`,
    elmelet: T`<div class="prose"><ul>
<li>Páratlan \(n\): \(\sqrt[n]a\) minden valós \(a\)-ra értelmezett (\(\sqrt[3]{-8}=-2\)); páros \(n\): csak \(a\ge0\)-ra, és \(\sqrt[n]a\ge0\).</li>
<li>\(\sqrt[n]a\cdot\sqrt[n]b=\sqrt[n]{ab}\), \(\frac{\sqrt[n]a}{\sqrt[n]b}=\sqrt[n]{\frac ab}\), \(\left(\sqrt[n]a\right)^k=\sqrt[n]{a^k}\), \(\sqrt[n]{\sqrt[k]a}=\sqrt[nk]a\).</li>
<li>\(\sqrt[n]{a^n}=a\), ha \(n\) páratlan; \(\sqrt[n]{a^n}=|a|\), ha \(n\) páros.</li></ul></div>` + gyakorlo('50/1–2, 56/1–2', '2125–2129'),
    feladatok: {
      ertek: atvesz('vgy3', 'ertek', 'n-edik gyök kiszámítása'),   // TK 50/1, FGY 2125
      valtozo: atvesz('vgy4', 'valtozo', 'Egyszerűsítés változóval'),   // TK 50/2, FGY 2126
      azonossag: atvesz('vgy3', 'azonossag', 'Az n-edik gyök azonosságai'),   // TK 56/1, FGY 2127
      konjszorzat: atvesz('vgy3', 'konjszorzat', 'Szorzat nevezetes azonossággal'),   // FGY 2128
      hasonlit: atvesz('vgy3', 'hasonlit', 'Melyik a nagyobb?')   // TK 56/2, FGY 2129
    }
  }, ['vgy3']));
})();
