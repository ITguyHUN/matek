/*
 * FEJEZETSABLON – másold a témakör mappájába új néven (pl. 11-uj-fejezet.js),
 * töltsd ki, majd írd be a fájlnevet a kurzus.js `fejezetek` listájába.
 * Részletes leírás: tananyag/README.md
 */
(function () {
  const feladatok = {};

  /* Egy feladattípus: a general() minden hívásra ÚJ, véletlenszerű feladatot ad vissza. */
  feladatok.peldaTipus = {
    nev: 'Példa feladattípus',              // a gomb felirata a gyakorlásnál
    // szint: 'emelt',                      // emelt szintű feladattípus (alapból a fejezet szintje, az pedig közép)
    general() {
      const a = R(2, 9), b = R(2, 9);         // R(min, max): véletlen egész
      return {
        kerdes: T`<p>Számítsd ki!</p>\[${a}\cdot ${b}\]`,
        valasz: { ertekek: [a * b] },         // több megoldás: [x1, x2]; közelítő: { ertekek: [v], tol: 0.01 }
        formatum: 'egész szám',
        tipp: 'Szorozd össze a két számot.',
        megoldas: [T`\[${a}\cdot ${b}=${a * b}\]`]
      };
    }
  };

  /* Feleletválasztós típus (a próba-témazáróba nem kerül be). */
  feladatok.peldaValasztos = {
    nev: 'Melyik nagyobb?',
    general() {
      const a = R(1, 20), b = R(1, 20);
      return {
        kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${a}\;\square\;${b}\]`,
        valasz: { valasztas: ['<', '=', '>'], helyes: a < b ? 0 : a === b ? 1 : 2 },
        tipp: 'Hasonlítsd össze a két számot.',
        megoldas: [T`\(${a}${a < b ? '<' : a === b ? '=' : '>'}${b}\)`]
      };
    }
  };

  Tananyag.fejezet({
    id: 'pelda',                               // EGYEDI az egész tananyagban (ékezet, szóköz nélkül)
    cim: 'Példafejezet teljes címe',
    rovid: 'Példafejezet',                     // rövid név a menüben
    bevezeto: 'Egy-két mondat arról, miről szól a fejezet.',
    elmelet: T`<div class="prose"><p>Szöveg, képletek: \(a^2+b^2=c^2\).</p></div>
<div class="mathbox">\[x_{1,2}=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\]</div>`,
    // szint: 'emelt',                         // az egész fejezet emelt szintű (elhagyható; alapból közép)
    igazHamisDb: 4,                            // ennyi állítást húz egyszerre a kérdésbankból (elhagyható)
    igazHamis: [                               // kérdésbank: minél több, annál változatosabb
      { allitas: T`\(2+2=5\)`, igaz: false, miert: 'Kettő meg kettő az négy.' },
      { allitas: T`\(2^{10}>1000\)`, igaz: true, miert: T`\(2^{10}=1024\).`, szint: 'emelt' },
      { general() { const a = R(2, 9); return { allitas: T`\(${a}\cdot 0=${a}\)`, igaz: false, miert: 'Nullával szorozva 0.' }; } }
    ],
    mintapelda: {
      feladat: T`Oldd meg: \(x+3=5\)`,
      lepesek: ['Vonjunk ki mindkét oldalból 3-at.', T`\[x=2\]`]
    },
    // grafikon: 'exp' | 'log' | function (doboz) { … saját interaktív elem … }   (elhagyható)
    feladatok
  });
})();
