# Tananyag hozzáadása

```
tananyag/
  sablon-fejezet.js          ← ebből indulj ki egy új fejezetnél
  11/
    kurzus.js                ← a 11. évfolyam leírója: témakörök és fejezetek sorrendje
    hatvany-gyok-log/        ← egy témakör mappája
      01-hatvanyozas.js      ← egy fejezet = egy fájl
      …
    trigonometria/           ← 9 fejezet (Sokszínű matematika 11., A trigonometria alkalmazásai);
                               a 08 (skaláris szorzat) és a 09 (trig. egyenletek) emelt szintű.
                               Közös segédfüggvények a 11/kurzus.js elején: M11 (fokos sin/cos, kerekítés,
                               közelítő válasz tűréssel, interaktív egységkör és háromszög).
  7/
    kurzus.js                ← a 7. évfolyam leírója (az elején a 7.-es fejezetek közös segédfüggvényei: M7)
    racionalis-arany-szazalek/  ← 6 fejezet (Sokszínű matematika 7., 1–4. lecke)
  10/
    kurzus.js                ← a 10. évfolyam leírója (az elején a közös segédfüggvények: M10, parabola-rajzoló)
    masodfoku-egyenlet/      ← 12 fejezet (Sokszínű matematika 10., 3. fejezet)
    vizsga-gyokvonas/        ← vizsgatematika 1. témakör (négyzetgyök, n-edik gyök), 4 fejezet
  9/
    kurzus.js                ← a 9. évfolyam leírója (az elején a közös segédfüggvények: M9 – polinomok, törtek, számelmélet, számrendszerek)
    algebra-szamelmelet/     ← II. fejezet: Algebra és számelmélet, 11 lecke (Sokszínű matematika 9.)
```

A felhasználó a **Tananyag** oszlopban kapja meg, melyik mappa töltődjön be neki, például `11`. Több is megadható vesszővel, például `11, 10`. Ilyenkor a kezdőlapon évfolyamot is választhat, az első a saját évfolyama.

## Új fejezet

1. Másold a `sablon-fejezet.js` fájlt a témakör mappájába, például `hatvany-gyok-log/11-uj.js` néven.
2. Írd át az `id`-t. Ennek **egyedinek** kell lennie az évfolyamon belül, és nem lehet benne ékezet vagy szóköz.
3. Írd be a fájlnevet a `kurzus.js` `fejezetek` listájába. **A lista sorrendje egyben a megnyitási sorrend is.**
4. A `config.js`-ben írd át a `verzio` értékét, például a mai dátumra, hogy a diákok böngészője biztosan az új fájlt töltse le.

Az `id`-t és a fájlok sorrendjét a tanév közben ne változtasd meg, mert ezekhez kötődik a diákok haladása. Új fejezetet a lista végére érdemes tenni.

## Új témakör

A `kurzus.js` `temakorok` listájához adj hozzá egy új elemet:

```js
{ id: 'trig', cim: 'Trigonometria', mappa: 'trigonometria', cukorkaNyitashoz: 8,
  proba: { feladatszam: 12 }, fejezetek: ['01-szogfuggvenyek.js', '02-…'] }
```

Minden témakörnek külön nyitási lánca van, és mindegyiknek az első fejezete nyitott. Egy cukorkához a legutolsó nyitott fejezet minden feladattípusából `joValaszCukorkahoz` jó megoldás kell; ez a szám témakörönként is megadható: `joValaszCukorkahoz: 8`.

## Cukorka és streak évfolyamonként, fejezetenként

A `config.js` adja az alapértékeket, a `kurzus.js` ezeket felülírhatja:

```js
Tananyag.kurzus({
  cim: 'Matek 7',
  joValaszCukorkahoz: 8,     // ebben az évfolyamban 8 egymás utáni jó megoldás = 1 cukorka
  cukorkaNyitashoz: 2,       // egy fejezet ára ebben az évfolyamban (ha a témakör/fejezet nem ad meg mást)
  streakNapiMin: 3,          // napi sorozathoz 3 új feladat kell aznap ebben az évfolyamban
  temakorok: [{
    id: 'rac', cim: '…', mappa: '…',
    cukorkaNyitashoz: 3,                     // a témakör fejezeteinek ára
    proba: { feladatszam: 12, cukorka: 5 },  // a próba-témazáró nyitási ára
    fejezetek: [
      '01-alakok.js',                        // az első fejezet mindig nyitott (ára nincs)
      { fajl: '02-szamegyenes.js', cukorka: 1 },   // ezt 1 cukorkáért lehet megnyitni
      '03-muveletek.js',                     // ez a témakör árába (3) kerül
      { fajl: '04-sorrend.js', cukorka: 5 }
    ]
  }]
});
```

**Macaron:** `macaronProbahoz` (a próba ára) és `macaronEmelthez` (emelt fejezet ára közép szintű csoportnál) évfolyam- és témakörszinten is megadható; a próbánál `proba: { feladatszam: 12, macaron: 3 }` is.

A `joValaszCukorkahoz` a témakörnél is megadható (elsőbbség: témakör → évfolyam → `config.js`).

Elsőbbség (nyitási ár): fejezet `cukorka` → témakör `cukorkaNyitashoz` → évfolyam `cukorkaNyitashoz` → `config.js`. A `cukorka: 0` is megengedett (ingyen nyitható, de a gombra kattintani akkor is kell).

A nyitás **nem automatikus**: amikor összegyűlt az ár, a fejezetben (és a zárt fejezet, ill. a próba oldalán) megjelenik a **Megnyitom** gomb, és a cukorka a kattintáskor jön le. Ha egy témakört átmenetileg el akarsz rejteni, add hozzá: `aktiv: false`.

A 10.-es fejezetfájlok a `Tananyag.fejezet(M10.tisztit({ … }))` alakot használják: ez a képletekben a betű előtti `<` jelet (pl. `1<x<3`) HTML-biztossá teszi.

Ha legalább két témakör van, a kezdőlapon megjelenik a **témakörválasztó**, a menü pedig mindig csak a kiválasztott témakör fejezeteit mutatja. A választást az oldal megjegyzi. Azt, hogy kezdetben melyik témakör legyen kiválasztva, a `kurzus.js`-ben adhatod meg: `alapTemakor: 'trig'`. Ez hasznos, amikor az órán új témakörbe léptek.

## Új évfolyam

Hozz létre egy `tananyag/9/kurzus.js` fájlt a fentiek szerint, a táblázatban pedig a 9.-esek Tananyag oszlopába írd be: `9`.

## A fejezetfájl mezői

| Mező | Kötelező | Leírás |
|---|---|---|
| `id` | igen | egyedi azonosító |
| `cim`, `rovid` | igen / nem | teljes cím, illetve rövid név a menübe |
| `bevezeto` | nem | 1–2 mondatos bevezető |
| `elmelet` | nem | HTML; a képletek `\( … \)` (szövegközi) vagy `\[ … \]` (kiemelt) jelöléssel |
| `igazHamis` | nem | kérdésbank: `[{ allitas, igaz: true/false, miert, szint }]`; egy elem lehet generátor is: `{ general() { return { allitas, igaz, miert }; } }` |
| `igazHamisDb` | nem | ennyi állítást húz egyszerre véletlenszerűen a bankból (alapból a `config.js` → `igazHamisDb`, 4); az „Új kérdések” gomb újat húz |
| `szint` | nem | `'kozep'` (alapból) vagy `'emelt'`: a fejezet szintje, egyben a feladattípusok és állítások alapszintje |
| `mintapelda` | nem | `{ feladat, lepesek: [ … ] }`, a lépések egyenként bonthatók ki |
| `grafikon` | nem | `'exp'`, `'log'`, vagy egy saját `function (doboz) { … }` |
| `grafikonCim`, `grafikonTag` | nem | a grafikon-szakasz címe és címkéje (alapból „Grafikonrajzoló”, „kísérletezz”) |
| `feladatok` | igen | `{ azonosito: { nev, general() } }` |

A `general()` minden hívásra **új, véletlenszerű** feladatot ad vissza:

```js
{ kerdes: '…HTML + TeX…',
  valasz: { ertekek: [2, -3] }        // vagy { nincs: true }, vagy { valasztas: ['<','=','>'], helyes: 2 }
                                      // közelítő érték: { ertekek: [2.81], tol: 0.006 }; nagy szám: tolRel
  formatum: 'egész szám',
  tipp: '…',
  megoldas: ['…', '\\[ … \\]'] }
```

További válaszfajták:

| `valasz` | Jelentés |
|---|---|
| `{ ertekek: [0.375], forma: 'tizedes' }` | csak tizedes tört alakban fogadja el (a `3/8` nem jó) |
| `{ ertekek: [0.375], forma: 'tort' }` | csak egyszerűsített tört alakban fogadja el (a `0,375` és a `6/16` nem jó) |
| `{ kozott: [0.6, 0.666], pelda: '19/30' }` | bármely szám jó, ami szigorúan a két érték közé esik |

Alaki hiba esetén az oldal szól („tizedes tört alakban kérjük”, „egyszerűsítsd tovább”), de ez nem számít rossz válasznak, és nem nullázza a sorozatot. A diák beírhat vegyes számot (`2 1/4`), szakaszos tizedes törtet (`0,(3)` vagy `1,2(3)`), és a válasz végén mértékegységet vagy százalékjelet is (`12 000 Ft`, `37,5%`, `1,6 km`).

A `kurzus.js`-ben a `jelek` mező adja meg a fejléc fölötti jelsort (pl. `jelek: 'a/b · 0,375 · p%'`).

Ha egy feladattípus ne kerüljön be a próba-témazáróba, add hozzá: `proba: false`.

## Közép és emelt szint

- **Fejezet:** a fejezetfájlban `szint: 'emelt'`, vagy a `kurzus.js`-ben `{ fajl: '10-alkalmazasok.js', szint: 'emelt' }`.
- **Feladattípus:** `feladatok.x = { nev: '…', szint: 'emelt', general() { … } }`. Ha nincs megadva, a fejezet szintjét kapja.
- **Igaz-hamis állítás:** `{ allitas: '…', igaz: true, szint: 'emelt' }`.

A szint a feladatnál látszik (KÖZÉP / EMELT címke), ha az évfolyamban van emelt jelölés.

A **csoport szintjét** a Tanári felületen állítod be (Feladatszint), évfolyamonként:

| Csoport szintje | Mit lát a diák |
|---|---|
| **Emelt** (alapértelmezés) | minden feladat egy felületen, a szokásos szabályokkal |
| **Közép** | a közép feladatok a „Gyakorlás” részben; az emelt feladatok külön, alatta („Nehezebb feladatok”). Ott egy jó megoldás **kettőt ér**, és az első hibás válasz még nem nullázza a sorozatot – csak a második ugyanarra a feladatra, vagy ha megnézi a megoldást. Az emelt állítások is külön, alatta jelennek meg. |

Közép szintű csoportnál az **emelt fejezetek kimaradnak a nyitási láncból** (nem kell megnyitni őket, nem kerülnek cukorkába). Akkor válnak elérhetővé, amikor az előttük álló fejezet megnyílik, és amíg az a legutolsó nyitott fejezet, bennük is gyűlik a cukorka. A próba-témazáró ilyenkor csak közép feladatokat ad.

A csoport szintjét lehetőleg a témakör elején állítsd be: a nyitott fejezetek sorszáma a lánchoz igazodik, ezért menet közbeni váltásnál a diákok nyitott fejezetei eltolódhatnak. A feleletválasztós típusok eleve kimaradnak belőle.

**Cukorka és streak.** Egy feladat attól számít „újnak”, hogy a kérdés szövege (`kerdes`) más, mint a korábban megoldottaké. Egy fejezet teljesítéséhez (ár × feladattípusok száma × `joValaszCukorkahoz`) új feladat kell, például 1 × 3 × 10 = 30, ezért a fejezet feladattípusainak együtt bőven ennél több különböző feladatot kell tudniuk adni. Egy 3–4 változatos típus hamar „kifogy”.

## Segédfüggvények (assets/mathlib.js)

| Függvény | Jelentés |
|---|---|
| ``T`…` `` | nyers szöveg (a `\` jelek megmaradnak), TeX-hez |
| `R(a, b)`, `P(tömb)` | véletlen egész [a; b]-ben, illetve véletlen elem |
| `F(n, d)`, `fv`, `fadd`, `fpow`, `ft` | tört létrehozása, értéke, összeadása, hatványa, TeX-alakja |
| `nt(x)` | szám TeX-ben, tizedesvesszővel |
| `hu(x, tizedes)` | szám magyar írásmóddal (−, vessző) |
| `big(x)`, `bigT(x)` | ezres tagolás szövegben, illetve TeX-ben |
| `xs(s)`, `pt(v)`, `lin(p, q)`, `mulX`, `yk`, `linCoef`, `cst`, `lgOf` | előjelhelyes kifejezésdarabok |
| `FMT.frac`, `FMT.dec`, `FMT.set`, `FMT.int` | szokásos formátumszövegek |

## Ellenőrzés

Bejelentkezés nélkül, helyi módban (amikor a `config.js` → `vegpont` üres) a kezdőlap kiírja, ha valamelyik fejezetfájl nem töltődött be vagy hibás. Tanári fiókkal ugyanez a kezdőlapon látszik. Tanári fiókkal minden fejezet nyitva van, és a gyakorlásnál a helyes válasz is megjelenik, így az új feladattípusokat gyorsan ki lehet próbálni.
