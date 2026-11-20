/*
 * FEJEZETSABLON ÉS MINTATÁR – minden válaszfajtára van benne működő példa.
 * Új fejezethez: másold a témakör mappájába új néven (pl. 11-uj-fejezet.js), hagyd meg a szükséges típusokat,
 * írd át őket, majd írd be a fájlnevet a kurzus.js `fejezetek` listájába.
 * Leírás: tananyag/README.md. Ellenőrzés: npm test, illetve npm run feladat -- tananyag/…/fajl.js
 *
 * Fontos: a `kerdes` szövege azonosítja a feladatot (ettől „új” egy feladat), ezért egy típusnak sok különböző
 * kérdést kell tudnia adni – a számokat mindig sorsold (R, P), ne írj be kész feladatokat.
 */
(function () {
  const feladatok = {};
  const elo = n => n < 0 ? `${n}` : `+${n}`;                          // előjeles tag: +3, -3
  const egyh = (n, v) => (n === 1 ? '' : n === -1 ? '-' : n) + v;      // együttható: x, -x, 3x

  /* 1. Egy szám a válasz. A general() minden hívásra ÚJ, véletlenszerű feladatot ad vissza. */
  feladatok.peldaTipus = {
    nev: 'Példa feladattípus',              // a gomb felirata a gyakorlásnál
    general() {
      const a = R(2, 9), b = R(2, 9);         // R(min, max): véletlen egész
      return {
        kerdes: T`<p>Számítsd ki!</p>\[${a}\cdot ${b}\]`,
        valasz: { ertekek: [a * b] },
        formatum: 'egész szám',               // a mező alatti súgó (FMT.int, FMT.frac, FMT.dec, FMT.set is használható)
        tipp: 'Szorozd össze a két számot.',
        megoldas: [T`\[${a}\cdot ${b}=${a * b}\]`]   // lépések; a \[ … \]-lel kezdődő elem kiemelt képlet lesz
      };
    }
  };

  /* 2. Több megoldás (a diák pontosvesszővel írja: 2; -3), vagy nincs megoldás. Az _ell a feladatíró saját próbája:
   *    az npm test minden megadott értékre meghívja – így a hibásan kiszámolt válasz nem jut ki a diákokhoz. */
  feladatok.peldaTobbMegoldas = {
    nev: 'Másodfokú egyenlet',
    general() {
      const p = R(-6, 6), c = R(-3, 12);       // (x − p)² = c
      const kerdes = T`<p>Oldd meg az egyenletet! Add meg az összes megoldást!</p>\[\left(x${elo(-p)}\right)^2=${c}\]`.replace('x+0', 'x');
      const gy = Math.sqrt(c), szep = c >= 0 && Number.isInteger(gy);
      if (c > 0 && !szep) return this.general();                    // nem szép eredmény: újat sorsolunk
      return {
        kerdes,
        valasz: c < 0 ? { nincs: true } : { ertekek: c === 0 ? [p] : [p - gy, p + gy] },
        formatum: FMT.set,
        tipp: 'Egy szám négyzete nem lehet negatív; ha a jobb oldal pozitív, két szám négyzete is lehet.',
        megoldas: c < 0 ? ['Négyzetszám nem lehet negatív, ezért nincs megoldás.'] : [T`\[x${elo(-p)}=${c === 0 ? '0' : T`\pm ${gy}`}\]`.replace('x+0', 'x'), T`\(x=${c === 0 ? p : `${p - gy}\\) vagy \\(x=${p + gy}`}\)`],
        _ell: w => w === 'nincs' ? c < 0 : Math.abs((w - p) ** 2 - c) < 1e-9
      };
    }
  };

  /* 3. Közelítő érték: a tol az elfogadott eltérés (két tizedesre kerekítve 0.006). Nagy számoknál tolRel: 0.01 = 1%.
   *    A diák mértékegységet is írhat a szám után (cm, kg, Ft, % …), az ellenőrzés levágja. */
  feladatok.peldaKozelito = {
    nev: 'Kör kerülete',
    general() {
      const r = R(2, 30), k = 2 * r * Math.PI;
      return {
        kerdes: T`<p>Mekkora a ${r} cm sugarú kör kerülete? Két tizedesjegyre kerekítve add meg!</p>`,
        valasz: { ertekek: [k], tol: 0.006 },
        formatum: 'tizedes tört, pl. 12,57',
        tipp: T`\(K=2r\pi\)`,
        megoldas: [T`\[K=2\cdot ${r}\cdot \pi\approx ${nt(k.toFixed(2))}\ \text{cm}\]`]   // nt(): tizedesvessző TeX-ben
      };
    }
  };

  /* 4. Kötelező alak: forma: 'tizedes' (a 3/8 nem jó) vagy forma: 'tort' (csak egyszerűsített tört jó).
   *    Rossz alaknál az oldal szól, de nem számít hibának. */
  feladatok.peldaForma = {
    nev: 'Tört és tizedes tört',
    general() {
      const d = P([2, 4, 5, 8, 10, 20, 25]); let n; do { n = R(1, 3 * d); } while (gcd(n, d) !== 1);
      const tizedesbe = R(0, 1) === 1;
      return {
        kerdes: tizedesbe ? T`<p>Írd fel tizedes tört alakban!</p>\[\frac{${n}}{${d}}\]` : T`<p>Írd fel egyszerűsített tört alakban!</p>\[${nt(n / d)}\]`,
        valasz: { ertekek: [n / d], forma: tizedesbe ? 'tizedes' : 'tort' },
        formatum: tizedesbe ? FMT.dec : 'egyszerűsített tört, pl. 3/8',
        tipp: tizedesbe ? 'Bővítsd a törtet úgy, hogy a nevező 10, 100 vagy 1000 legyen.' : 'Írd fel tizedekkel, századokkal, majd egyszerűsíts.',
        megoldas: [T`\[\frac{${n}}{${d}}=${nt(n / d)}\]`]
      };
    }
  };

  /* 5. Bármely szám jó, ami a két érték közé esik (a pelda egy jó válasz a megoldókulcsba). */
  feladatok.peldaKozott = {
    nev: 'Szám két tört között',
    general() {
      const d = R(3, 9), n = R(1, d - 2), d2 = 2 * d;
      return {
        kerdes: T`<p>Írj egy számot, amely a két tört közé esik!</p>\[\frac{${n}}{${d}}\quad\text{és}\quad\frac{${n + 1}}{${d}}\]`,
        valasz: { kozott: [n / d, (n + 1) / d], pelda: `${2 * n + 1}/${d2}` },
        formatum: FMT.frac,
        tipp: 'Bővítsd mindkét törtet: nagyobb nevezőnél már van közöttük tört.',
        megoldas: [T`\[\frac{${n}}{${d}}=\frac{${2 * n}}{${d2}}<\frac{${2 * n + 1}}{${d2}}<\frac{${2 * n + 2}}{${d2}}=\frac{${n + 1}}{${d}}\]`]
      };
    }
  };

  /* 6. Feleletválasztás (a próba-témazáróba nem kerül be). A proba: false bármely típusnál kizárja a próbából. */
  feladatok.peldaValasztos = {
    nev: 'Melyik nagyobb?',
    general() {
      const a = R(1, 20), b = R(1, 20);
      return {
        kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${a}\;\square\;${b}\]`,
        valasz: { valasztas: ['<', '=', '>'], helyes: a < b ? 0 : a === b ? 1 : 2 },
        tipp: 'Hasonlítsd össze a két számot.',
        megoldas: [T`\(${a}${a < b ? '<' : a === b ? '=' : '>'}${b}\)`]   // képletben a < után mindig szám vagy szóköz álljon, ne betű
      };
    }
  };

  /* 7. Kifejezés mint válasz: a diák képletmezőbe ír, és bármelyik egyenértékű alak jó. Az alak (elhagyható) a kért
   *    alakot adja meg: 'szorzat' | 'kifejtett' | 'gyok' | 'egyfv' | 'fvNelkul'. Rossz alak nem számít hibának. */
  feladatok.peldaKifejezes = {
    nev: 'Szorzattá alakítás',
    general() {
      const a = R(2, 12), v = P(['x', 'a', 'y']);
      return {
        kerdes: T`<p>Alakítsd szorzattá!</p>\[${v}^2-${a * a}\]`,
        valasz: { kifejezes: T`(${v}-${a})(${v}+${a})`, alak: 'szorzat' },
        formatum: 'szorzat alak',
        tipp: T`\(A^2-B^2=(A-B)(A+B)\)`,
        megoldas: [T`\[${v}^2-${a * a}=(${v}-${a})(${v}+${a})\]`]
      };
    }
  };
  feladatok.peldaKifejtett = {
    nev: 'Zárójelfelbontás',
    szint: 'emelt',                              // emelt szintű típus (alapból a fejezet szintje, az pedig közép)
    general() {
      const a = R(1, 4), b = R(1, 9), j = P(['+', '-']);
      return {
        kerdes: T`<p>Végezd el a négyzetre emelést, és vond össze!</p>\[\left(${egyh(a, 'x')}${j}${b}\right)^2\]`,
        valasz: { kifejezes: T`${egyh(a * a, 'x')}^2${j}${2 * a * b}x+${b * b}`, alak: 'kifejtett', tagok: 3 },   // tagok: ennyi tagra kell összevonni
        tipp: T`\((a\pm b)^2=a^2\pm 2ab+b^2\)`,
        megoldas: [T`\[\left(${egyh(a, 'x')}${j}${b}\right)^2=${egyh(a * a, 'x')}^2${j}${2 * a * b}x+${b * b}\]`]
      };
    }
  };

  /* 8. Reláció, intervallum, halmaz: a diák bármelyik egyenértékű alakban felelhet (x<5, 5>x, ]-∞;5[).
   *    A feladat visszaírását nem fogadja el. billentyuzet: gépen melyik jellap nyíljon ('jel' | 'fv' | 'halmaz'). */
  feladatok.peldaEgyenlotlenseg = {
    nev: 'Egyenlőtlenség',
    general() {
      const a = P([-4, -3, -2, 2, 3, 4, 5]), n = R(-6, 6), b = R(1, 9) * P([1, -1]), c = a * n + b;
      const jel = P(['<', '\\ge']), ki = a > 0 ? jel : { '<': '>', '\\ge': '\\le' }[jel];
      return {
        kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${egyh(a, 'x')}${elo(b)} ${jel} ${c}\]`,
        valasz: { kifejezes: `x${ki}${n}` },      // lehetne intervallum is: ']-\\infty;5[', halmaz: '\\lbrace-2;3\\rbrace', periodikus: 'x=\\frac{\\pi}{6}+2k\\pi'
        billentyuzet: 'halmaz',
        formatum: 'reláció vagy intervallum, pl. x < 3 vagy ]−∞; 3[',
        tipp: a < 0 ? 'Negatív számmal osztva a relációs jel megfordul.' : 'Rendezd úgy, hogy az x egyedül maradjon.',
        megoldas: [T`\[${egyh(a, 'x')} ${jel} ${c - b}\]`, T`\[x ${ki} ${n}\]`]
      };
    }
  };

  /* 9. Függvényábrázolás: a diák két rácspontot jelöl be, a görbét a program húzza meg.
   *    fajta: 'egyenes' (bármely két pont) | 'parabola' | 'abs' | 'gyok' (jellegzetes pont + még egy pont).
   *    A helyes grafikonnak rácspontokkal megrajzolhatónak kell lennie az ablakban (alapból [-6, 6, -6, 6]). */
  feladatok.peldaAbrazolas = {
    nev: 'Egyenes ábrázolása',
    general() {
      const m = P([-3, -2, -1, 1, 2, 3]), b = R(-4, 4), szabaly = egyh(m, 'x') + (b ? elo(b) : '');
      return {
        kerdes: T`<p>Ábrázold a függvényt!</p>\[f(x)=${szabaly}\]`,
        valasz: { grafikon: szabaly, fajta: 'egyenes' },
        tipp: 'Az y tengelyt a b értéknél metszi; innen egyet jobbra lépve m-mel változik.',
        megoldas: [T`Az \(y\) tengelyt a \((0;\,${b})\) pontban metszi, a meredeksége \(${m}\).`,
          Grafikon.kep({ gorbek: [szabaly], pontok: [{ x: 0, y: b, c: 'A' }, { x: 1, y: m + b, c: 'B' }] })]   // kész ábra a megoldásba
      };
    }
  };
  feladatok.peldaAbszolut = {
    nev: 'Abszolútérték-függvény ábrázolása',
    general() {
      const a = P([1, -1, 2, -2]), u = R(-3, 3), v = a > 0 ? R(-5, 2) : R(-2, 5);
      const szabaly = T`${egyh(a, '')}\left|x${u ? elo(-u) : ''}\right|${v ? elo(v) : ''}`;
      return {
        kerdes: T`<p>Ábrázold a függvényt!</p>\[f(x)=${szabaly}\]`,
        valasz: { grafikon: szabaly, fajta: 'abs', ablak: [-6, 6, -6, 6] },     // lepes: 0.5 fél egységes rácsot ad
        tipp: 'Előbb a töréspontot keresd meg: ott nulla az abszolút érték belseje.',
        megoldas: [T`A töréspont \(T(${u};\,${v})\); innen egyet lépve az érték \(${a}\)-vel változik.`,
          Grafikon.kep({ gorbek: [szabaly], pontok: [{ x: u, y: v, c: 'T' }, { x: u + 1, y: v + a, c: 'P' }] })]
      };
    }
  };

  /* 10. Pontok bejelölése: a rácson a `rajz` görbéje látszik, a diák a kért pontokat jelöli be (a sorrend nem számít).
   *     A szabály a kérdésben is szerepeljen: a kérdés szövege különbözteti meg a feladatokat. */
  feladatok.peldaPontok = {
    nev: 'Zérushelyek bejelölése',
    general() {
      const p = R(-5, -1), q = R(1, 5), szabaly = T`\left(x${elo(-p)}\right)\left(x${elo(-q)}\right)`;
      return {
        kerdes: T`<p>Jelöld be a grafikonon a függvény zérushelyeit!</p>\[f(x)=${szabaly}\]`,
        valasz: { pontok: [[p, 0], [q, 0]], rajz: szabaly, ablak: [-6, 6, -10, 6] },
        tipp: 'A zérushely ott van, ahol a grafikon metszi az x tengelyt.',
        megoldas: [T`Egy szorzat akkor nulla, ha valamelyik tényezője nulla: \(x_1=${p}\), \(x_2=${q}\).`]
      };
    }
  };

  /* 11. Ábra a kérdésben: a Grafikon.kep(…) kész ábrát ad, a válasz bármelyik fajta lehet (itt kifejezés). */
  feladatok.peldaLeolvasas = {
    nev: 'Szabály leolvasása grafikonról',
    proba: false,                                // ez a típus ne kerüljön be a próba-témazáróba
    general() {
      const m = P([-3, -2, -1, 1, 2, 3]), b = R(-4, 4), szabaly = egyh(m, 'x') + (b ? elo(b) : '');
      return {
        kerdes: T`<p>Add meg a grafikonon látható lineáris függvény hozzárendelési szabályát!</p>${Grafikon.kep({ gorbek: [szabaly], cimke: 'Egy egyenes grafikonja' })}`,
        valasz: { kifejezes: szabaly },
        tipp: 'Olvasd le, hol metszi az y tengelyt, és mennyit változik, ha egyet jobbra lépsz.',
        megoldas: [T`\[f(x)=${szabaly}\]`]
      };
    }
  };

  Tananyag.fejezet({
    id: 'pelda',                               // EGYEDI az évfolyamon belül (ékezet, szóköz nélkül); tanév közben ne változtasd
    cim: 'Példafejezet teljes címe',
    rovid: 'Példafejezet',                     // rövid név a menüben
    bevezeto: 'Egy-két mondat arról, miről szól a fejezet.',
    elmelet: T`<div class="prose"><p>Szöveg, képletek: \(a^2+b^2=c^2\).</p></div>
<div class="mathbox">\[x_{1,2}=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\]</div>`,
    // szint: 'emelt',                         // az egész fejezet emelt szintű (elhagyható; alapból közép)
    igazHamisDb: 4,                            // ennyi állítást húz egyszerre a kérdésbankból (elhagyható)
    igazHamis: [                               // kérdésbank a tipikus hibákból: minél több, annál változatosabb
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
