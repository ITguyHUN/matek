# Tananyag hozzáadása

```
tananyag/
  sablon-fejezet.js          ← ebből indulj ki egy új fejezetnél
  11/
    kurzus.js                ← a 11. évfolyam leírója: témakörök és fejezetek sorrendje
    hatvany-gyok-log/        ← egy témakör mappája
      01-hatvanyozas.js      ← egy fejezet = egy fájl
      …
  9/  10/  7/                ← további évfolyamok ugyanígy (saját kurzus.js-sel)
```

A felhasználó a **Tananyag** oszlopban kapja meg, melyik mappa töltődjön be neki, például `11`.

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

Minden témakörnek külön nyitási lánca van, és mindegyiknek az első fejezete nyitott. Ha egy témakört átmenetileg el akarsz rejteni, add hozzá: `aktiv: false`.

## Új évfolyam

Hozz létre egy `tananyag/9/kurzus.js` fájlt a fentiek szerint, a táblázatban pedig a 9.-esek Tananyag oszlopába írd be: `9`.

## A fejezetfájl mezői

| Mező | Kötelező | Leírás |
|---|---|---|
| `id` | igen | egyedi azonosító |
| `cim`, `rovid` | igen / nem | teljes cím, illetve rövid név a menübe |
| `bevezeto` | nem | 1–2 mondatos bevezető |
| `elmelet` | nem | HTML; a képletek `\( … \)` (szövegközi) vagy `\[ … \]` (kiemelt) jelöléssel |
| `igazHamis` | nem | `[{ allitas, igaz: true/false, miert }]` |
| `mintapelda` | nem | `{ feladat, lepesek: [ … ] }`, a lépések egyenként bonthatók ki |
| `grafikon` | nem | `'exp'`, `'log'`, vagy egy saját `function (doboz) { … }` |
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

Ha egy feladattípus ne kerüljön be a próba-témazáróba, add hozzá: `proba: false`. A feleletválasztós típusok eleve kimaradnak belőle.

**Cukorka és streak.** Egy feladat attól számít „újnak”, hogy a kérdés szövege (`kerdes`) más, mint a korábban megoldottaké. Egy fejezet teljesítéséhez alapbeállítással 3 × 10 = 30 új feladat kell, ezért a fejezet feladattípusainak együtt bőven ennél több különböző feladatot kell tudniuk adni. Egy 3–4 változatos típus hamar „kifogy”.

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
