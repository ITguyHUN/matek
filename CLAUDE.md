# Matek gyakorló – útmutató Claude-nak

Statikus weboldal build nélkül: `index.html` + `assets/*.js` + `tananyag/`. A tananyag fejezetfájlokból áll, minden fejezet
feladat**generátorokat** tartalmaz. A leggyakoribb kérés: forrás (tankönyv, feladatgyűjtemény, PDF, fénykép, tematika) alapján
új fejezetet vagy feladattípusokat írni.

## Honnan dolgozz

| Fájl | Mire való |
|---|---|
| `tananyag/sablon-fejezet.js` | **Mintatár:** minden válaszfajtára működő példa. Ebből másolj. |
| `tananyag/README.md` | A mezők és válaszfajták leírása, a kurzus.js felépítése, segédfüggvények. |
| `tananyag/<évfolyam>/kurzus.js` | Témakörök, fejezetsorrend, és az évfolyam közös segédfüggvényei (M7, M9, M10, M11, TR). |
| a témakör meglévő fejezetei | A stílus, a nehézség és a segédfüggvények használatának mintája – olvass el egyet-kettőt, mielőtt írsz. |

## Feladatírás forrásból – lépések

1. **Olvasd el a forrást, és bontsd feladattípusokra.** Egy típus = egyféle gondolatmenet (pl. „kiemelés”, „zérushely leolvasása”).
   Egy fejezetbe 5–9 típus való. A forrás feladatait **ne másold át szó szerint**: a típust vedd át, a számokat a generátor sorsolja.
2. **Válassz válaszfajtát** típusonként (lásd lent). Ha a feladat kifejezést, relációt vagy grafikont vár, ne alakítsd át
   „mi kerül a négyzet helyére” típusú számos kérdéssé – van rá valódi beviteli mód.
3. **Másold a sablont** a témakör mappájába (`NN-rovid-nev.js`), töröld a felesleges típusokat, írd meg a sajátjaidat.
   Töltsd ki a fejezet mezőit is: `bevezeto`, `elmelet`, `igazHamis` (tipikus hibákból, 8–15 állítás), `mintapelda`.
4. **Próbáld ki:** `npm run feladat -- tananyag/…/fajl.js` – típusonként kiír néhány legenerált feladatot válasszal és megoldással,
   és jelzi a formai hibákat. Olvasd el a mintákat: jó-e a kérdés, helyes-e a válasz, érthető-e a megoldás. Javíts, amíg hibátlan.
5. **Kösd be:** a fájlnév a `kurzus.js` `fejezetek` listájának **végére**; a `config.js`-ben írd át a `verzio`-t a mai dátumra.
6. **Futtasd:** `npm test` – zöldnek kell lennie. Ha kérik, nézd meg böngészőben is: `npm run dev`, majd `#<évfolyam>/<id>`.

## Melyik válaszfajta mire jó

| A válasz | `valasz` | Példa a sablonban |
|---|---|---|
| egy szám | `{ ertekek: [12] }` | `peldaTipus` |
| több szám / nincs megoldás | `{ ertekek: [2, -3] }` / `{ nincs: true }` | `peldaTobbMegoldas` |
| közelítő érték | `{ ertekek: [v], tol: 0.006 }` | `peldaKozelito` |
| kötelezően tizedes vagy tört alak | `{ ertekek: [v], forma: 'tizedes' }` | `peldaForma` |
| bármi két érték között | `{ kozott: [a, b], pelda }` | `peldaKozott` |
| választás néhány lehetőségből | `{ valasztas: […], helyes: 0 }` | `peldaValasztos` |
| algebrai kifejezés | `{ kifejezes: '(x-4)(x+4)', alak: 'szorzat' }` | `peldaKifejezes`, `peldaKifejtett` |
| reláció, intervallum, halmaz, periodikus megoldás | `{ kifejezes: 'x<5' }` | `peldaEgyenlotlenseg` |
| függvény ábrázolása | `{ grafikon: '2x-3', fajta: 'egyenes' }` | `peldaAbrazolas`, `peldaAbszolut` |
| pontok bejelölése | `{ pontok: [[-2, 0], [3, 0]], rajz }` | `peldaPontok` |
| ábra a kérdésben (leolvasás) | `Grafikon.kep({ gorbek: […] })` a `kerdes`-ben | `peldaLeolvasas` |

Ha a forrás olyan feladatot kér, amire nincs válaszfajta (bizonyítás, szerkesztés, indoklás, szöveges kifejtés), **ne erőltesd**:
írd meg a kiszámolható részét, vagy hagyd ki, és a végén sorold fel, mit hagytál ki és miért.

## Szabályok, amelyeket a teszt is számon kér

- **A `kerdes` szövege azonosítja a feladatot.** 60 húzásból legalább 15 különböző kérdés kell; jó típus több százat tud.
  A különbség legyen a kérdés szövegében (számok, betűk), ne csak a válaszban.
- **A megadott válasznak át kell mennie a saját ellenőrzésén:** kifejezésnél a kért `alak`-ban add meg; grafikonnál a
  jellegzetes pont és még egy pont legyen rácspont az ablakban.
- **Nincs `undefined`, `NaN`, páratlan `\(` … `\)`** a szövegekben. Képletben a `<` után ne álljon közvetlenül betű
  (`a < b` vagy `\lt`), különben a böngésző HTML-elemnek nézi.
- **Számos feladathoz írj `_ell` próbát**, ahol lehet: `_ell: w => Math.abs(a * w + b) < 1e-9`. Ez a válaszodat a feladatba
  helyettesítve ellenőrzi, tehát a számolási hibádat is megfogja.

## Minőség (ezt a teszt nem látja, neked kell)

- **Szép eredmények:** egész vagy egyszerű tört, ha a téma mást nem kíván. Elfajuló esetnél (0 nevező, egybeeső gyökök,
  1-es együttható furcsa kiírása) sorsolj újra: `do { … } while (…)` vagy `return this.general()`.
- **Magyar jelölés:** tizedesvessző (`nt(x)` → `1{,}5`), szorzás `\cdot`, osztás `:`, intervallum `]a;b[`, pont `(x;\,y)`,
  `\tg`, `\ctg`, `\lg`. A szöveg tegező, rövid, felszólító: „Oldd meg…”, „Számítsd ki…”.
- **`megoldas`:** lépésenként, a végén az eredmény; a `\[ … \]`-lel kezdődő elem kiemelt képlet. **`tipp`:** az első lépésre
  vezet rá, az eredményt nem árulja el.
- **Szint:** ami az emelt szintű érettségi anyaga, kapjon `szint: 'emelt'` jelölést.
- TeX-et mindig ``T`…` `` sablonnal írj (a `\` megmarad). Előjeles tagokhoz, együtthatókhoz használd a segédfüggvényeket
  (`pt`, `lin`, `xs`, az évfolyam `M…` készlete), ne kézzel fűzd a `+-` jeleket.

## Amihez ne nyúlj kérés nélkül

- **Meglévő `id`-k és a fejezetek sorrendje** – ezekhez kötődik a diákok haladása.
- **Új típus meglévő, élő fejezetben** – megnöveli a cukorkához szükséges munkát; csak ha kérik.
- **`assets/rules.js` és `apps-script/Code.gs`** – a játékszabályok két példányban élnek, együtt kell változniuk.
- **`config.js` → `vegpont`** – az éles szerver címe.

## Parancsok

```sh
npm ci                                        # egyszer, a tesztekhez
npm run feladat -- tananyag/9/…/fajl.js       # mintafeladatok és formai hibák egy fejezetből (típus és darabszám is adható)
npm test                                      # minden: ellenőrzők, teljes tananyag, sablon
npm run dev                                   # helyi előnézet minden évfolyammal (http://localhost:3000)
```

Új válaszfajta (ha a meglévők nem elegek): `assets/valasztipusok.js`, leírás a fájl elején és a `tananyag/README.md` végén.
