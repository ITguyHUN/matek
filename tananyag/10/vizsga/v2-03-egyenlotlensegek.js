/*
 * Vizsga 2. / 3. fejezet – Másodfokú egyenlőtlenségek
 * Vizsgatematika 10.ABCD, 2. témakör: Másodfokú egyenletek. A vizsgafejezetben csak a tematika szerinti feladattípusok szerepelnek;
 * a generátorok a tananyag-fejezetekből jönnek (M10.atvesz), a forrás a megjegyzésben.
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { atvesz, gyakorlo } = M10;

  /* FGY 2188: törtes egyenlőtlenségek (a nevező mindig pozitív, illetve egy elsőfokú tényező a nevezőben) */
  const { R0, l1, q2, kulonbozo, FMT10 } = M10;
  const REL = { lt: '<', gt: '>', le: T`\le `, ge: T`\ge ` };
  const tortes = { nev: 'Törtes egyenlőtlenség', general() {
    const t = R(0, 1); const rel = P(['lt', 'le', 'gt', 'ge']); const neg = rel === 'lt' || rel === 'le'; const zart = rel === 'le' || rel === 'ge';
    if (t === 0) {   // (x − a) / (x² + k) REL 0  ⇔  x − a REL 0
      const a = R(-9, 9), k = R(1, 12); const ans = neg ? (zart ? a : a - 1) : (zart ? a : a + 1);
      return { kerdes: T`<p>Melyik a ${neg ? 'legnagyobb' : 'legkisebb'} egész szám, amely kielégíti az egyenlőtlenséget?</p>\[\frac{${l1(1, -a)}}{x^2+${k}}${REL[rel]}0\]`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
        tipp: T`A nevező minden valós \(x\)-re pozitív (\(x^2+${k}\ge${k}>0\)), így a tört előjele a számlálóéval egyezik.`,
        megoldas: [T`\(x^2+${k}>0\), ezért \(${l1(1, -a)}${REL[rel]}0\iff x${neg ? (zart ? T`\le ` : '<') : (zart ? T`\ge ` : '>')}${a}\).`, T`A keresett egész: \(${ans}\).`] };
    }
    const [a, b] = kulonbozo(2, -8, 8); const lo = Math.min(a, b), hi = Math.max(a, b);
    const g = x => (x - a) / (x - b); const ok = x => x !== b && (rel === 'lt' ? g(x) < 0 : rel === 'le' ? g(x) <= 0 : rel === 'gt' ? g(x) > 0 : g(x) >= 0);
    const be = []; for (let n = lo; n <= hi; n++) if (ok(n)) be.push(n);
    const kerd = neg ? 'Hány egész szám elégíti ki az egyenlőtlenséget?' : `Hány egész szám <b>nem</b> elégíti ki az egyenlőtlenséget?`;
    const ans = neg ? be.length : (hi - lo + 1) - be.length;
    return { kerdes: T`<p>${kerd}</p>\[\frac{${l1(1, -a)}}{${l1(1, -b)}}${REL[rel]}0\]`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`Kikötés: \(x\neq${b}\). Egy tört akkor negatív, ha a számláló és a nevező ellentétes előjelű; akkor pozitív, ha azonos előjelű.`,
      megoldas: [T`Kikötés: \(x\neq${b}\). A tört előjele a \((${l1(1, -a)})(${l1(1, -b)})\) szorzatéval egyezik; a kritikus pontok \(${lo}\) és \(${hi}\).`,
        neg ? T`A tört a két kritikus pont között ${rel === 'le' ? 'nempozitív (a számláló gyöke is jó, a nevezőé nem)' : 'negatív'}: \(${be.join(';\\ ') || '–'}\), összesen ${ans}.` : T`A tört a két kritikus ponton kívül pozitív${rel === 'ge' ? T` (és \(x=${a}\)-ben 0)` : ''}; nem megoldás a \([${lo};\,${hi}]\) intervallum ${ans} egész száma közül azok, amelyek nem teljesítik.`, `Válasz: ${ans}.`] };
  } };

  Tananyag.fejezet(M10.vizsga({
    id: 'vz2egyl',
    cim: 'Másodfokú egyenlőtlenségek',
    rovid: 'Egyenlőtlenségek',
    bevezeto: T`Másodfokú egyenlőtlenségek megoldása a parabola segítségével; egész megoldások; törtes egyenlőtlenségek.`,
    elmelet: T`<div class="prose"><ol><li>Rendezd 0-ra, oldd meg a hozzá tartozó egyenletet.</li><li>Vázold a parabolát (\(a>0\): felfelé, \(a<0\): lefelé nyitott).</li><li>Olvasd le, hol pozitív, illetve negatív a kifejezés; \(\le,\ge\) esetén a gyökök is megoldások.</li></ol>
<ul><li>Törtes egyenlőtlenség: a nevező nem lehet 0; a tört előjele a számláló és a nevező előjelétől függ.</li></ul></div>` + gyakorlo('81/1–3', '2184–2186, 2188'),
    feladatok: {
      halmaz: atvesz('megyenlotl', 'halmaz', 'Melyik a megoldáshalmaz?'),   // TK 81/1–2, FGY 2184, 2185
      egesz: atvesz('megyenlotl', 'egesz', 'Egész megoldások'),   // TK 81/3, FGY 2186
      legk: atvesz('megyenlotl', 'legk', 'Legkisebb / legnagyobb egész megoldás'),   // FGY 2185
      tortes   // FGY 2188 (ebben a fájlban)
    }
  }, ['megyenlotl']));
})();
