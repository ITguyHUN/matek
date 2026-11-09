/*
 * Vizsga 2. / 8. fejezet – A diszkrimináns
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2disz',
    cim: 'A diszkrimináns',
    rovid: 'Diszkrimináns',
    bevezeto: T`A gyökök száma a diszkrimináns előjeléből; paraméter meghatározása adott számú gyökhöz.`,
    elmelet: T`<div class="tbl"><table><tr><th>\(D=b^2-4ac\)</th><th>valós gyökök</th></tr><tr><td>\(D>0\)</td><td>két különböző</td></tr><tr><td>\(D=0\)</td><td>egy (kettős): \(x=-\frac{b}{2a}\)</td></tr><tr><td>\(D<0\)</td><td>nincs</td></tr></table></div>
<div class="prose"><ul><li>Paraméteres feladat: írd fel \(D\)-t a paraméterrel, és oldd meg a \(D=0\), \(D>0\) vagy \(D<0\) feltételt.</li>
<li>Ha a paraméter a főegyütthatóban van, az \(a=0\) eset külön vizsgálandó.</li></ul></div>` + gyakorlo('66/6–8, 87/1, 4', '2163, 2164'),
    feladatok: {
      dszam: atvesz('mdiszkr', 'dszam', 'A diszkrimináns kiszámítása'),
      gyokszam: atvesz('mdiszkr', 'gyokszam', 'Hány valós gyöke van?'),
      paramc: atvesz('mdiszkr', 'paramc', 'Paraméter a konstans tagban'),   // TK 66/8, FGY 2163
      paramb: atvesz('mdiszkr', 'paramb', 'Paraméter a lineáris tagban'),   // TK 66/7
      parama: atvesz('mdiszkr', 'parama', 'Paraméter a főegyütthatóban'),   // TK 66/6, FGY 2164
      egyenlo: atvesz('mparam', 'egyenlo', 'Két egyenlő gyök'),   // TK 87/1
      nincsgyok: atvesz('mparam', 'nincsgyok', 'Mikor nincs valós gyök?')   // TK 87/4
    }
  }, ['mdiszkr']));
})();
