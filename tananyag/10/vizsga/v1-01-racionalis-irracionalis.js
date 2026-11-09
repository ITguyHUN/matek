/*
 * Vizsga 1. / 1. fejezet – Racionális és irracionális számok
 * Vizsgatematika 10.ABCD, 1. témakör: Négyzetgyök, n-edik gyök. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz1rac',
    cim: 'Racionális és irracionális számok',
    rovid: 'Racionális, irracionális',
    bevezeto: T`Tört és tizedes tört alak, szakaszos tizedes törtek, racionális és irracionális számok felismerése.`,
    elmelet: T`<div class="prose"><ul>
<li>Racionális szám: \(\frac pq\) alakban felírható (\(p,q\in\mathbb Z,\ q\neq0\)); tizedes tört alakja véges vagy szakaszos.</li>
<li>Szakaszos tizedes tört → tört: \(x=0{,}\dot3\dot6\Rightarrow 100x-x=36\Rightarrow x=\frac{36}{99}=\frac4{11}\).</li>
<li>Nem négyzetszám pozitív egész négyzetgyöke irracionális (pl. \(\sqrt2,\sqrt3,\sqrt5\)).</li></ul></div>` + gyakorlo('41/1–4', ''),
    feladatok: {
      tizedes: atvesz('vgy0', 'tizedes', 'Tört átírása tizedes törtté'),   // TK 41/1
      tort: atvesz('vgy0', 'tort', 'Szakaszos tizedes tört átírása törtté'),   // TK 41/2
      racionalis: atvesz('vgy0', 'racionalis', 'Racionális vagy irracionális?')   // TK 41/3
    }
  }, ['vgy0']));
})();
