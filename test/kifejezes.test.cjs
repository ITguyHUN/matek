/* A kifejezés-ellenőrző (assets/kifejezes.js) tesztjei: minden sor egy beírt válasz és az elvárt ítélet. */
const test = require('node:test');
const assert = require('node:assert/strict');
const { ellenoriz, ertelmez, halmazKulonbseg } = require('../assets/kifejezes.js');
const jo = (k, be, alak, tobbi) => ellenoriz(Object.assign({ kifejezes: k, alak }, tobbi), be);

const T = [
    // teljes szorzattá alakítás: a mérce a feladatíró válasza
    [jo('6x^{2}y\\left(2x-3y+1\\right)', '6x^2y(2x-3y+1)', 'szorzat').ok === true, 'kiemelés több változóval'],
    [jo('6x^{2}y\\left(2x-3y+1\\right)', '-6x^2y(-2x+3y-1)', 'szorzat').ok === true, 'negatív tényező kiemelése'],
    [jo('6x^{2}y\\left(2x-3y+1\\right)', '2x(6x^2y-9xy^2+3xy)', 'szorzat').forma === true, 'nem a legnagyobb közös tényező'],
    [jo('6x^{2}y\\left(2x-3y+1\\right)', '3x^2y(4x-6y+2)', 'szorzat').forma === true, 'szám még kiemelhető'],
    [jo('3x^{2}(x+2)^2', '3x^2(x^2+4x+4)', 'szorzat').forma === true, 'többlépéses: félúton'],
    [jo('3x^{2}(x+2)^2', '3x\\cdot x(x+2)(x+2)', 'szorzat').ok === true, 'többlépéses: kész'],
    [jo('(x-6)(x+6)', '1\\cdot(x^2-36)', 'szorzat').forma === true, 'egyszer a zárójel nem szorzattá alakítás'],
    [jo('(2a-6)(2a+6)', '(2a-6)(2a+6)', 'szorzat').ok === true, 'ha a mintaválaszban is maradt szám, nem kéri a kiemelést'],
    [jo('(2a-6)(2a+6)', '4(a-3)(a+3)', 'szorzat').ok === true, 'a mintaválasznál jobban bontott alak is jó'],
    [jo('(a+3)(b-2)', '(b-2)(3+a)', 'szorzat').ok === true, 'csoportosítás két változóval'],
    [jo('(x+3)^2', '\\left(x+3\\right)^2', 'szorzat').ok === true, 'szorzat alak'],
    [jo('(x+3)^2', '\\left(3+x\\right)\\left(x+3\\right)', 'szorzat').ok === true, 'felcserélt tényezők'],
    [jo('(x+3)^2', 'x^2+6x+9', 'szorzat').forma === true, 'jó érték, rossz alak'],
    [jo('(x+3)^2', 'x^2+9', 'szorzat').ok === false, 'hiányzó kétszeres szorzat'],
    [jo('4x^2-12x+9', '4x^2-12x+9', 'kifejtett').ok === true, 'kifejtett'],
    [jo('4x^2-12x+9', '\\left(2x-3\\right)^2', 'kifejtett').forma === true, 'felbontatlan zárójel'],
    [jo('5\\sqrt{2}', '5\\sqrt{2}', 'gyok').ok === true, 'gyök'],
    [jo('5\\sqrt{2}', '\\sqrt{50}', 'gyok').forma === true, 'ki nem hozott tényező'],
    [jo('\\frac{1}{2}x', '0{,}5x').ok === true, 'tört és tizedesvessző'],
    [jo('(x+3)^2', '\\left(x+3').forma === true, 'hiányzó zárójel'],
    [jo('\\left|x-2\\right|', '|x-2|').ok === true, 'abszolút érték'],
    // relációk
    [jo('x<5', '5>x').ok === true, 'megfordított egyenlőtlenség'],
    [jo('x<5', 'x\\le5').ok === false, 'határpont'],
    [jo('x\\le5', 'x<=5').ok === true, 'gépelt <='],
    [jo('x\\ge-3', '-3\\le x').ok === true, 'negatív határ'],
    [jo('x<\\frac{1}{3}', 'x<0{,}34').ok === false, 'nem rácsra eső határ'],
    // intervallumok, halmazok
    [jo(']-\\infty;5[', 'x<5').ok === true, 'intervallum = reláció'],
    [jo(']-\\infty;5[', '\\left]-\\infty;5\\right]').ok === false, 'nyílt és zárt vég'],
    [jo(']2;7[', '2<x<7').ok === true, 'láncolt reláció'],
    [jo('[1;4]', 'x\\in\\left[1;4\\right]').ok === true, 'x ∈ előtag'],
    [jo('x<-2\\lor x>3', ']-\\infty;-2[\\cup]3;\\infty[').ok === true, 'unió = vagy'],
    [jo(']-\\infty;-2[\\cup]3;\\infty[', 'x<-2\\text{ vagy }x>3').ok === true, 'szöveges vagy'],
    [jo('\\lbrace-2;3\\rbrace', '\\lbrace3;-2\\rbrace').ok === true, 'halmaz sorrendje'],
    [jo('\\lbrace-2;3\\rbrace', 'x=-2\\lor x=3').ok === true, 'halmaz = egyenlőségek'],
    [jo('\\lbrace-2;3\\rbrace', '\\lbrace-2\\rbrace').ok === false, 'hiányzó elem'],
    [jo('\\mathbb{R}\\setminus\\lbrace2\\rbrace', 'x\\ne2').ok === true, 'ℝ ∖ {2}'],
    [jo('x<5', 'x+5').forma === true, 'kifejezés állítás helyett'],
    [jo(']1;6[', '(x-1)(x-6)<0').forma === true, 'a feladat visszaírása nem megoldás'],
    [jo('\\lbrace-2;3\\rbrace', 'x_1=-2;x_2=3').ok === true, 'indexes felsorolás'],
    // periodikus megoldások (egész paraméter)
    [jo('x=\\frac{\\pi}{6}+2k\\pi\\lor x=\\frac{5\\pi}{6}+2k\\pi', 'x=\\frac{5\\pi}{6}+2k\\pi;x=\\frac{\\pi}{6}+2k\\pi,k\\in\\mathbb{Z}').ok === true, 'két megoldássereg, k ∈ ℤ'],
    [jo('x=\\frac{\\pi}{6}+2k\\pi\\lor x=\\frac{5\\pi}{6}+2k\\pi', 'x=30\\degree+n\\cdot360\\degree\\lor x=150\\degree+n\\cdot360\\degree').ok === true, 'fokban, n paraméterrel'],
    [jo('x=\\frac{\\pi}{6}+2k\\pi\\lor x=\\frac{5\\pi}{6}+2k\\pi', 'x=\\frac{\\pi}{6}-2k\\pi\\lor x=-\\frac{7\\pi}{6}+2k\\pi').ok === true, 'eltolt felírás'],
    [jo('x=\\frac{\\pi}{6}+2k\\pi\\lor x=\\frac{5\\pi}{6}+2k\\pi', 'x=\\left(-1\\right)^k\\frac{\\pi}{6}+k\\pi').ok === true, 'tömör (−1)^k alak'],
    [jo('x=\\frac{\\pi}{6}+2k\\pi\\lor x=\\frac{5\\pi}{6}+2k\\pi', 'x=\\frac{\\pi}{6}+2k\\pi').ok === false, 'hiányzó megoldássereg'],
    [jo('x=\\frac{\\pi}{4}+k\\pi', 'x=\\frac{\\pi}{4}+2k\\pi').ok === false, 'rossz periódus'],
    [jo('x=\\pm\\frac{\\pi}{3}+2k\\pi', 'x=\\frac{\\pi}{3}+2k\\pi\\lor x=\\frac{5\\pi}{3}+2k\\pi').ok === true, '± két ága'],
    [jo('x=\\frac{\\pi}{4}+k\\pi', '\\lbrace\\frac{\\pi}{4}+k\\pi\\rbrace').ok === true, 'paraméteres halmaz'],
    [jo(']2k\\pi;\\pi+2k\\pi[', '2k\\pi<x<\\pi+2k\\pi').ok === true, 'periodikus intervallum'],
    [jo(']2k\\pi;\\pi+2k\\pi[', '\\left]2k\\pi;\\pi+2k\\pi\\right]').ok === false, 'periodikus intervallum vége'],
    [jo('x=k\\pi', '\\sin x=0').forma === true, 'visszaírt trigonometrikus egyenlet'],
    // számhalmazok
    [jo('\\mathbb{Z}', 'x\\in\\mathbb{Z}').ok === true, 'ℤ'],
    [jo('\\mathbb{Z}', '\\mathbb{N}').ok === false, 'ℤ ≠ ℕ'],
    [jo('\\mathbb{N}', 'x\\in\\mathbb{Z}\\land x\\ge0').ok === true, 'ℕ = nemnegatív egészek'],
    [jo('\\mathbb{Q}', '\\mathbb{R}').ok === false, 'ℚ ≠ ℝ'],
    [jo('\\mathbb{R}\\setminus\\mathbb{Q}', '\\mathbb{R}\\setminus\\mathbb{Q}').ok === true, 'irracionális számok'],
    [jo('\\mathbb{R}^+', 'x>0').ok === true, 'ℝ⁺'],
    [jo('\\lbrace3;4;5\\rbrace', 'x\\in\\mathbb{Z}\\land2<x<6').ok === true, 'egészek egy intervallumban'],
    // gyökkeresés: érintő és távoli gyökök
    [halmazKulonbseg(ertelmez('(x-1{,}1)^2>0'), ertelmez('x\\ne1{,}1'), 'x') === null, 'érintő gyök rácson kívül'],
    [halmazKulonbseg(ertelmez('(x-1{,}1)^2\\le0'), ertelmez('\\lbrace1{,}1\\rbrace'), 'x') === null, 'érintő gyök, egyelemű megoldás'],
    [halmazKulonbseg(ertelmez('(x-1{,}1)^2>0'), ertelmez('\\mathbb{R}'), 'x') !== null, 'érintő gyök kimarad'],
    [jo('x<100', 'x<101').ok === false, 'határ ±30-on kívül'],
    [jo('x<2500', 'x<2600').ok === false, 'távoli határ'],
    [jo('x\\ge1200', 'x>1200').ok === false, 'távoli határpont'],
    // szögfüggvények, logaritmus
    [jo('\\sin 2x', '2\\sin x\\cos x').ok === true, 'kétszeres szög'],
    [jo('\\sin 2x', '2\\sin x\\cos x', 'egyfv').forma === true, 'nem egyetlen függvény'],
    [jo('\\sin 2x', '\\sin\\left(2x\\right)', 'egyfv').ok === true, 'egyetlen függvény'],
    [jo('\\cos x', '\\sin\\left(\\frac{\\pi}{2}-x\\right)').ok === true, 'pótszög'],
    [jo('\\cos 2x', '\\cos^2x-\\sin^2x').ok === true, 'sin^2 jelölés'],
    [jo('\\frac{1}{2}', '\\sin30\\degree').ok === true, 'fok'],
    [jo('\\frac{\\sqrt{2}}{2}', '0{,}707').ok === false, 'kerekített érték'],
    [jo('\\log_{2}{15}', '\\log_23+\\log_25').ok === true, 'logaritmus összege'],
    [jo('\\log_{2}{15}', '\\log_2\\left(15\\right)', 'egyfv', { argSzam: true }).ok === true, 'egyetlen logaritmus'],
    [jo('2', '\\lg100').ok === true, 'lg'],
    [jo('\\sin x', '\\sin y').forma === true, 'idegen betű: elírás, nem hibás válasz'],
    [jo('\\sin 2x+\\log_{2}x+\\sqrt{2}\\pi', 'sin(2x)+log_2(x)+sqrt(2)pi').ok === true, 'betűvel gépelt függvénynevek']
];
for (const [siker, nev] of T) test(nev, () => assert.ok(siker));

/* A tananyag kifejezés típusú feladatai: a feladatíró saját válasza menjen át az ellenőrzésen (érték és kért alak is),
 * különben a diák a helyes megoldást sem tudná beadni. Minden évfolyam minden fejezetét végignézi. */
test('a tananyag minden kifejezés típusú válasza megfelel a saját ellenőrzésének', () => {
  const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
  const { JSDOM } = require('jsdom');   // a kurzusfájlok a document-et is használják
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only', url: 'https://example.test/' });
  const gyoker = path.resolve(__dirname, '..'), kor = dom.getInternalVMContext();
  const fut = f => vm.runInContext(fs.readFileSync(path.join(gyoker, f), 'utf8'), kor, { filename: f });
  let kurzus, fejezet, db = 0;
  dom.window.Tananyag = { kurzus(d) { kurzus = d; }, fejezet(d) { fejezet = d; } };
  fut('assets/mathlib.js');
  for (const evf of [7, 9, 10, 11]) {
    fut(`tananyag/${evf}/kurzus.js`);
    for (const tk of kurzus.temakorok.filter(t => t.aktiv !== false)) for (const e of tk.fejezetek) {
      if (String(e).startsWith('//')) continue;
      const fajl = `tananyag/${evf}/${tk.mappa}/${typeof e === 'string' ? e : e.fajl}`;
      fejezet = null; fut(fajl);
      for (const [tipus, g] of Object.entries(fejezet.feladatok || {})) for (let i = 0; i < 60; i++) {
        const p = (g.general || g.make).call(g);
        if (!p.valasz || !p.valasz.kifejezes) break;
        const e2 = ellenoriz(p.valasz, p.valasz.kifejezes);
        assert.ok(e2.ok, `${fajl} / ${tipus}: ${p.valasz.kifejezes} → ${e2.uzenet}`);
        db++;
      }
    }
  }
  assert.ok(db > 0, 'nincs egyetlen kifejezés típusú feladat sem');
  dom.window.close();
});
