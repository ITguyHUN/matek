/*
 * Vizsga 1. / 2. fejezet – A négyzetgyökvonás azonosságai
 * Vizsgatematika 10.ABCD, 1. témakör: Négyzetgyök, n-edik gyök. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz1azon',
    cim: 'A négyzetgyökvonás azonosságai',
    rovid: 'Négyzetgyök-azonosságok',
    bevezeto: T`Értelmezési tartomány, a négyzetgyök azonosságai, kiemelés és bevitel, két gyökös szám összehasonlítása.`,
    elmelet: T`<div class="tbl"><table><tr><th>Azonosság</th><th>Feltétel</th></tr>
<tr><td>\(\sqrt{ab}=\sqrt a\cdot\sqrt b\)</td><td>\(a,b\ge0\)</td></tr>
<tr><td>\(\sqrt{\frac ab}=\frac{\sqrt a}{\sqrt b}\)</td><td>\(a\ge0,\ b>0\)</td></tr>
<tr><td>\(\left(\sqrt a\right)^k=\sqrt{a^k}\)</td><td>\(a\ge0\)</td></tr>
<tr><td>\(\sqrt{a^2}=|a|\)</td><td>minden valós \(a\)</td></tr></table></div>
<div class="prose"><ul><li>Kiemelés: \(\sqrt{72}=6\sqrt2\); bevitel: \(3\sqrt5=\sqrt{45}\). Összehasonlításnál vidd be a tényezőket a gyökjel alá.</li>
<li>\(\sqrt{f(x)}\) ott értelmezett, ahol \(f(x)\ge0\).</li></ul></div>` + gyakorlo('47/1–5, 6ab, 7ab', '2100, 2102, 2105, 2110, 2111'),
    feladatok: {
      ertelmezes: atvesz('vgy1', 'ertelmezes', 'Értelmezési tartomány'),   // FGY 2100
      azonossag: atvesz('vgy1', 'azonossag', 'Szorzat, hányados, hatvány'),   // TK 47/3
      kiemeles: atvesz('vgy1', 'kiemeles', 'Kiemelés a gyökjel alól'),   // FGY 2110
      bevitel: atvesz('vgy1', 'bevitel', 'Bevitel a gyökjel alá'),   // FGY 2110, TK 47/2
      hasonlit: atvesz('vgy1', 'hasonlit', 'Melyik a nagyobb?')   // TK 47/1, FGY 2102, 2105, 2111
    }
  }, ['vgy1']));
})();
