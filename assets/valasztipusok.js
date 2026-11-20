/*
 * Matek gyakorló – választípusok nyilvántartása.
 * Egy feladat `valasz` mezőjéből derül ki, milyen bevitel és ellenőrzés tartozik hozzá. A szám (ertekek, nincs, kozott)
 * és a feleletválasztás (valasztas) az app.js-ben és a mathlib.js-ben van; minden további típus ITT jelentkezik be,
 * és ettől kezdve a gyakorlás, a házi, a próba-témazáró, a tanári nézet és a dolgozatkészítő magától kezeli.
 *
 * Új típus:  Valasztipus.regisztral({
 *   nev: 'sajat',
 *   illik:     valasz => valasz.sajat != null,                 // ehhez a válaszhoz tartozik-e
 *   elokeszit: cb => cb(),                                     // (elhagyható) betöltés a bevitel előtt
 *   bevitel:   (hely, feladat, o) => ({ ertek, lezar, fokusz, hiany, gombHely }),
 *                                                              // beviteli felület a `hely` elembe; o: { cimke, enter, mutat, tomor }
 *                                                              // ertek(): a beírt válasz, vagy null/'' ha még nincs; hiany(): mit írjunk ki ilyenkor
 *                                                              // gombHely: ide kerül az „Ellenőrzés” gomb (elhagyható: a hely végére)
 *   ellenoriz: (valasz, be) => ({ ok: true }),                 // vagy { ok: false, uzenet }, vagy { forma: true, uzenet } (alaki gond, nem számít hibának)
 *   keplet:    valasz => 'TeX',                                // a helyes válasz képletként (tanári nézet, megoldókulcs)
 *   szoveg:    valasz => 'szöveg',                             // a helyes válasz a naplóba
 *   naplo:     (valasz, be) => 'szöveg',                       // (elhagyható) a diák válasza a naplóba; alapból String(be)
 *   nyomtat:   feladat => 'HTML',                              // (elhagyható) ami a nyomtatott dolgozatban a kérdés alá kerül (pl. üres koordináta-rendszer)
 *   hibaElotag: 'Nem jó. '                                     // (elhagyható) a hibaüzenet eleje
 * });
 */
(function () {
  const lista = [];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  window.Valasztipus = {
    regisztral(t) { lista.push(t); return t; },
    keres(valasz) { return valasz ? lista.find(t => t.illik(valasz)) || null : null; }
  };

  /* Kifejezés, reláció, intervallum, halmaz: képletmező + jelbillentyűzet (kepletmezo.js), ellenőrzés: kifejezes.js */
  Valasztipus.regisztral({
    nev: 'kifejezes',
    illik: v => v.kifejezes != null,
    elokeszit: cb => Kepletmezo.betolt(cb),
    bevitel(hely, p, o) {
      hely.innerHTML = `<div class="ansrow"></div>${o.tomor ? '' : `<div class="fmt">${p.formatum ? `Formátum: ${esc(p.formatum)} · ` : ''}${Kepletmezo.SUGO}</div>`}<div class="kb-hely"></div>`;
      const sor = hely.firstElementChild, m = Kepletmezo.mezo(sor, { cimke: o.cimke, enter: o.enter, kbHely: hely.lastElementChild, lap: p.billentyuzet, mutat: o.mutat });
      return { ertek: m.ertek, lezar: m.lezar, fokusz: m.fokusz, gombHely: sor };
    },
    ellenoriz: (v, be) => Kifejezes.ellenoriz(v, be),
    hibaElotag: 'Nem egyenlő a helyes válasszal. ',
    keplet: v => v.kifejezes,
    szoveg: v => v.kifejezes
  });

  /* Függvényábrázolás: a diák két pontot jelöl be, a görbét a program húzza meg (grafikon.js) */
  const szam = n => String(n).replace('.', '{,}');
  Valasztipus.regisztral({
    nev: 'grafikon',
    illik: v => v.grafikon != null,
    bevitel: (hely, p, o) => Grafikon.mezo(hely, p.valasz, o),
    ellenoriz: (v, be) => Grafikon.ellenoriz(v, be),
    keplet: v => `f(x)=${v.grafikon}`,
    szoveg: v => `f(x) = ${v.grafikon}`,
    naplo: (v, be) => Grafikon.naplo(v, be),
    nyomtat: p => Grafikon.kep({ ablak: p.valasz.ablak })
  });

  /* Pontok bejelölése a koordináta-rendszerben (zérushely, tengelypont, metszéspont …); a `rajz` görbéje látszik a rácson */
  Valasztipus.regisztral({
    nev: 'pontok',
    illik: v => Array.isArray(v.pontok),
    bevitel: (hely, p, o) => Grafikon.mezo(hely, p.valasz, o),
    ellenoriz: (v, be) => Grafikon.ellenoriz(v, be),
    keplet: v => v.pontok.map(([x, y]) => `(${szam(x)};\\,${szam(y)})`).join(',\\ '),
    szoveg: v => v.pontok.map(([x, y]) => `(${x}; ${y})`).join(', '),
    naplo: (v, be) => Grafikon.naplo(v, be),
    nyomtat: p => Grafikon.kep({ ablak: p.valasz.ablak, gorbek: p.valasz.rajz ? [p.valasz.rajz] : [] })
  });
})();
