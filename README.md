# Matek gyakorló

Interaktív gyakorlóoldal a következőkkel:
- belépés csak a táblázatban felsorolt felhasználóknak;
- cukorka, amely sorban nyitja a fejezeteket, és napi sorozat (streak);
- tanári felület, amely csoportonként mutatja a diákok megoldásait.

A weboldal GitHub Pages-en fut, az adatokat egy Google Táblázat tárolja (Google Apps Script).

## Mappaszerkezet

```
index.html                 az oldal váza (ritkán kell hozzányúlni)
config.js                  BEÁLLÍTÁSOK: szerver URL, cukorka-, nyitási és streak-alapértékek, verzió
assets/
  app.js                   az alkalmazás (belépés, gyakorlás, próba, tanári felület)
  rules.js                 cukorka/nyitás/streak szabályai (a Code.gs aljára is be van másolva)
  dolgozat.js              dolgozat- és témazáró-készítő (tanári eszköz)
  docx.js                  Word-fájl (.docx) készítése a dolgozatkészítőhöz
  mathlib.js               segédfüggvények a feladatgenerátorokhoz
  style.css                megjelenés
tananyag/
  README.md                ← új fejezet / témakör / évfolyam hozzáadása
  sablon-fejezet.js
  11/kurzus.js             11. évfolyam: témakörök, fejezetsorrend
  11/hatvany-gyok-log/     10 fejezet, mindegyik külön fájlban
  7/kurzus.js              7. évfolyam (Sokszínű matematika 7., 1–4. lecke)
  7/racionalis-arany-szazalek/  6 fejezet: alakok, számegyenes, műveletek, sorrend, arányosság, százalék
apps-script/Code.gs        a Google Táblázat mögötti szerverkód
felhasznalok_minta.xlsx    minta a felhasználói listához
```

## Telepítés

1. **Google Táblázat.** Hozz létre egy új táblázatot, és nyisd meg a **Bővítmények → Apps Script** menüt. Másold be az `apps-script/Code.gs` tartalmát, mentsd el, majd futtasd a `setup` függvényt, és engedélyezd a hozzáférést.
2. **Felhasználók.** A `setup` létrehoz egy „Felhasználók” lapot. Ide másold be a `felhasznalok_minta.xlsx` mintájára készített listát.

   | Felhasználónév | Jelszó | Név | Csoport | Tananyag | Szerep |
   |---|---|---|---|---|---|
   | kiss.anna | Kv7-29 | Kiss Anna | 11.A | 11, 10 | diák |
   | tanar | … | Tanár Úr | * | 11 | tanár |

   - Csak az léphet be, aki ezen a lapon szerepel. Ha valakit törölsz, vagy megváltoztatod a jelszavát, azonnal kijelentkezik.
   - Több „Felhasználók…” kezdetű lap is lehet, például „Felhasználók 11.A” vagy „Felhasználók 11.B”.
   - A Tananyag oszlopba több évfolyam is írható vesszővel, például `11, 10`. Az első a diák saját anyaga, ez nyílik meg alapból. A többit a kezdőlapon választhatja ki gyakorláshoz. Minden évfolyam haladása (cukorka, nyitott fejezetek) külön számít, a napi sorozat közös.
   - A tanár **csak a saját csoportjait** látja: a Csoport oszlopába a csoportjai kerülnek vesszővel elválasztva, például `11.A, 11.B`. `*` = minden csoport (pl. munkaközösség-vezetőnek). Üres Csoport oszloppal a tanár egy csoportot sem lát. A tanár Tananyag oszlopa adja meg, mely évfolyamokból készíthet dolgozatot.
   - A **Matek gyakorló → Felhasználók ellenőrzése** menüpont összesíti, hány diák van csoportonként, és kinek hiányzik a jelszava.
3. **Webalkalmazás.** Válaszd a **Telepítés → Új telepítés → Webalkalmazás** lehetőséget, ezekkel a beállításokkal:
   - Végrehajtás mint: **Én**
   - Hozzáférés: **Bárki**

   Másold ki a `…/exec` végű URL-t.
4. **config.js.** Írd be az URL-t a `vegpont: ''` sorba, majd töltsd fel a teljes mappát a GitHub-repóba. A Pages a repó gyökeréből szolgál ki, a `.nojekyll` fájl maradjon benne.

Ha később módosítod a Code.gs-t: **Telepítés → Telepítések kezelése → szerkesztés → Verzió: Új verzió**. Így az URL nem változik.

## Szabályok

Ezek csak bejelentkezett diákra vonatkoznak. Belépés nélkül, helyi módban nincs cukorka, sorozat és zárolás, minden fejezet nyitva van.

- **Beállítások szintjei:** a `config.js` adja az alapértékeket (`joValaszCukorkahoz`, `cukorkaNyitashoz`, `streakNapiMin`). Ezeket évfolyamonként felülírhatod a `tananyag/<évfolyam>/kurzus.js`-ben, a nyitási árat ezen felül témakörönként és fejezetenként is (lásd `tananyag/README.md`).
- **Cukorka:** a témakör *legutolsó nyitott* fejezetében akkor jár egy cukorka, ha a fejezet **minden feladattípusából** összegyűlt `joValaszCukorkahoz` (alapból 10) jó megoldás. A fejezet tetején típusonként látszik az állás.
  - Egy típus számlálója legfeljebb a beállított értékig nő, tehát nem lehet egy típusból „előre gyűjteni”; a cukorka után minden számláló újraindul.
  - Közép szintű csoportnál csak a közép típusok kötelezők; egy emelt feladat jó megoldása 2-t ér, és a leghátrébb álló típushoz adódik.
  - Csak olyan feladat számít, amelyet a diák korábban még nem oldott meg, és nem nézte meg előtte a megoldását.
  - Hibás válasz, vagy ha megnézi a megoldást, annak a típusnak a számlálóját nullázza.
  - A már korábban megoldott feladat nem számít bele a sorozatba, de nem is nullázza.
- **Fejezetnyitás:** ha összegyűlt a következő fejezet ára (`cukorkaNyitashoz`, fejezetenként eltérhet), a fejezet tetején megjelenik a **Megnyitom** gomb. A diák erre kattintva nyitja meg a fejezetet, és az ára ekkor jön le a cukorkáiból. Amíg nem kattint, a cukorkák megmaradnak, és tovább gyűlnek.
- **Próba-témazáró:** csak akkor nyílik meg, ha a témakör minden fejezete teljesítve van: az utolsó fejezetben is összegyűlt a próba ára (`proba: { cukorka: … }`, alapból a témakör `cukorkaNyitashoz` értéke), és a diák a gombbal megnyitotta. Tanári fiókkal és helyi módban mindig nyitva van.
- **Témakör- és évfolyamválasztás:** ha egy évfolyamnak több témaköre van, vagy a diáknak több évfolyama, a kezdőlapon választhat közöttük. Az oldal megjegyzi a választást, a menü pedig mindig a kiválasztott témakört mutatja.
- **Napi sorozat:** az a nap számít, amelyen a diák legalább `streakNapiMin` (alapból 1, évfolyamonként eltérhet) új feladatot old meg egy évfolyam legutolsó nyitott fejezetében. Több évfolyamnál a sorozat közös, de mindegyik évfolyamban a saját feltétele számít.
  - Ha kihagy egy napot, a sorozat újraindul.
  - **Kivétel:** ha már egyik témakörben sincs megnyitható új fejezet, a sorozat nem vész el. Ha később új fejezet kerül a tananyagba, a diák következő belépésétől számítva újra a szokásos szabály él.
- **Közép / emelt szint:** a fejezetek, feladattípusok és igaz-hamis állítások megjelölhetők emelt szintűként (`szint: 'emelt'`). A Tanári felületen csoportonként és évfolyamonként beállítható a szint. Közép szintnél az emelt feladatok külön, alatta jelennek meg: ott egy jó megoldás kettőt ér, és csak a második hibás válasz (ugyanarra a feladatra) vagy a megoldás megnézése nullázza a sorozatot. Emelt szintnél minden feladat egy felületen van. Részletek: `tananyag/README.md`.
- **Cukorkához szükséges jó válaszok:** a szükséges darabszám (`joValaszCukorkahoz`, feladattípusonként értendő) témakörönként is megadható a `kurzus.js`-ben.
- **Haladási korlát:** a Tanári felületen csoportonként és témakörönként megadható, hogy a diákok cukorkával legfeljebb melyik fejezetig nyithatnak, hogy ne haladjanak az óra elé. A cukorka közben gyűlik, és a korlát emelése után felhasználható. A csoportnyitás ettől függetlenül működik.
- **Házi feladat:** a Tanári felület **Házi feladat** fülén kiadható: címmel, határidővel, és feladattípusonként azzal, hogy hány helyes megoldás kell. A diákok a menü tetején, a kezdőlapon és minden oldal tetején látják. Csak a még meg nem oldott, segítség (megoldás megnézése) nélküli helyes megoldások számítanak. A házi **nem számít bele semmilyen gyűjthető dologba** (cukorka, típusszámlálók, napi sorozat). A tanár diákonként látja az állást, és hogy határidőre vagy késve lett-e kész. A határidő után 14 napig a diákok is látják a házit.
  - Ha a házi (vagy egy része) kész, a házi oldalán **zölden lezárul**: ott már nem lehet tovább dolgozni, a gyakorlás a fejezetben folytatható (ott a cukorka is gyűlik).
  - Ha lejárt a határidő, és nincs kész, **piros** (a kezdőlapon, a felső sávban, a házi oldalán és a tanári táblázatban is); késve még befejezhető.
- **Csoportnyitás:** a Tanári felületen egy csoportnak megnyithatod a fejezeteket egy adott pontig. A lista utolsó eleme („Minden fejezet + próba-témazáró”) a próbát is megnyitja. Ilyenkor a cukorka és a sorozat ettől a fejezettől kezdve gyűlik. A tanári felületen a csoport mellett tananyagot (évfolyamot) és témakört is választhatsz.
- A régebbi fejezetekben szabadon lehet gyakorolni, de ott nem jár jutalom. Ezért nem lehet „farmolni”.

## Dolgozatkészítő (tanári eszköz)

A menü tetején, a **Dolgozatkészítő** pontban (tanári fiókkal, illetve helyi módban):

- Évfolyamonként, témakörönként és fejezetenként felsorolja a feladattípusokat. Mindegyiknél megadható: hány részfeladat legyen belőle, **melyik feladatba** kerüljön (üresen: külön feladat), és hány **pontot** ér egy részfeladata (üresen: az alap pont).
- Egy feladatban több típus is lehet; a részfeladatok betűjele (a, b, c, …) folytatólagos, mindegyik mellett ott a pontszáma. Ha a részfeladatok ugyanazzal az utasítással kezdődnek, az a feladat fejlécébe kerül.
- **Nullázás:** „Minden darabszám 0” (a lista tetején) és témakörönként „Témakör nullázása”. A „csak a kiválasztott típusok látszanak” kapcsolóval a lista a kiválasztottakra szűkíthető.
- **Témazáró ebből a témakörből:** a témakör minden feladattípusát kitölti a megadott darabszámmal (a próba-témazáróból kizárt, `proba: false` típusok kivételével), igény szerint csak a közép szintűekkel.
- **Pontozás:** a feladat pontszáma a részfeladatai pontjainak összege. Ebből készül a **ponttáblázat** (Feladat / Max. pont / Elért pont, összesen).
- **Ponthatárok:** az 5-ös, 4-es, 3-as, 2-es alsó határa megadható **százalékban** (alapból 85/70/55/40%) vagy **pontban**; váltáskor az értékek átszámolódnak. Az előnézet a pontsávokat is mutatja, és szól, ha a határok nem csökkenőek.
- Beállítható még: cím, csoportok száma (számmal; a betűjel A, B, C, … – mindegyik csoport más feladatokat kap), hely a megoldásnak, név-osztály-dátum sor, megoldókulcs (részletes megoldásokkal is).
- **Letöltés:** Word (.docx) – a képletek képként, a szöveg szerkeszthető; PDF – a böngésző nyomtatási ablakában „Mentés PDF-ként”.

## Táblázat lapjai

| Lap | Tartalom |
|---|---|
| Felhasználók | ezt te töltöd ki |
| Állapot | diákonként: elkölthető és összes cukorka, napi sorozat, helyes megoldások, próbák |
| Megoldások | minden beküldött válasz: feladat, válasz, helyes válasz, eredmény, kapott-e cukorkát |
| Próbák | beadott próba-témazárók pontszámmal és jeggyel |
| Csoportnyitás | a Tanári felületen beállított nyitások |
| Csoportszint | a Tanári felületen beállított feladatszint (közép / emelt) csoportonként és évfolyamonként |
| Csoportkorlát | meddig nyithatnak a diákok cukorkával (haladási korlát) |
| Házi feladatok | a kiadott házi feladatok (a Törölve oszlop kitöltésével el is rejthető) |

## Helyi kipróbálás

Ha a `vegpont` üres, az oldal belépés nélkül, helyi módban fut: nincs cukorka, napi sorozat és zárolás. Ez új fejezetek kipróbálására jó. Megnyithatod közvetlenül az `index.html`-t is. Ha a böngésző így nem tölti be a fejezeteket, indíts a mappában egy kis webszervert, például `python -m http.server`, majd nyisd meg a http://localhost:8000 címet.
