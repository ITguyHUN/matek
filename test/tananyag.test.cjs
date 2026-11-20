/*
 * A teljes tananyag (és a sablon) ellenőrzése: minden fejezet betölt, minden feladattípus sokszor legenerálható,
 * és minden legenerált feladat formailag rendben van. Új vagy géppel írt fejezet hibái itt buknak ki, mielőtt diák látná.
 * Egyetlen fájl kipróbálása mintafeladatokkal: npm run feladat -- tananyag/…/fajl.js
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { betolt, feladatHibak, general, SABLON } = require('./tananyag-betolto.cjs');

const HUZAS = 60, KULONBOZO = 15;   // ennyi húzásból legalább ennyi különböző kérdés kell (a kérdés szövege azonosítja a feladatot)
const T = betolt();
test.after(() => T.bezar());

test('minden fejezetfájl betölt', () => assert.deepEqual(T.hibak, []));

test('a fejezetek mezői rendben vannak, az azonosítók egyediek', () => {
  const latott = new Map();
  for (const { fajl, evf, fejezet: f } of T.fejezetek) {
    assert.match(String(f.id), /^[A-Za-z0-9_-]+$/, `${fajl}: az id csak betű, szám, - és _ lehet`);
    const kulcs = `${evf}/${f.id}`;
    assert.ok(!latott.has(kulcs), `${fajl}: az id (${f.id}) már foglalt: ${latott.get(kulcs)}`); latott.set(kulcs, fajl);
    assert.ok(typeof f.cim === 'string' && f.cim.trim(), `${fajl}: hiányzik a cim`);
    assert.ok(f.feladatok && Object.keys(f.feladatok).length, `${fajl}: nincs feladattípus`);
    for (const [tip, g] of Object.entries(f.feladatok)) {
      assert.ok(typeof (g.nev || g.name) === 'string', `${fajl} / ${tip}: hiányzik a nev`);
      assert.equal(typeof (g.general || g.make), 'function', `${fajl} / ${tip}: hiányzik a general()`);
    }
    for (const x of f.igazHamis || []) {
      const a = typeof x.general === 'function' ? x.general() : x;
      assert.ok(typeof a.allitas === 'string' && a.allitas.trim() && typeof a.igaz === 'boolean', `${fajl}: hibás igaz-hamis állítás (allitas, igaz kell)`);
    }
    if (f.mintapelda) assert.ok(typeof f.mintapelda.feladat === 'string' && Array.isArray(f.mintapelda.lepesek) && f.mintapelda.lepesek.length, `${fajl}: a mintapelda { feladat, lepesek: […] } alakú legyen`);
  }
});

test(`minden feladattípus ${HUZAS}-szor legenerálható, a feladatok hibátlanok és elég változatosak`, () => {
  let db = 0; const bajok = [];
  for (const { fajl, fejezet } of T.fejezetek) for (const [tip, g] of Object.entries(fejezet.feladatok)) {
    const hol = `${fajl} / ${tip}`, kerdesek = new Set(), hibak = new Set();
    for (let i = 0; i < HUZAS; i++) {
      let p; try { p = general(g); } catch (e) { hibak.add(`a general() hibát dobott: ${e.message}`); continue; }
      feladatHibak(p, T.ablak).forEach(h => hibak.add(h)); kerdesek.add(p && p.kerdes); db++;
    }
    if (kerdesek.size < KULONBOZO) hibak.add(`${HUZAS} húzásból csak ${kerdesek.size} különböző kérdés (legalább ${KULONBOZO} kell): sorsolj több adatot`);
    const fajtak = new Map(); hibak.forEach(h => { const k = h.replace(/: [\s\S]*/, ''); if (!fajtak.has(k)) fajtak.set(k, h); });   // egyféle hiba egyszer, egy példával
    fajtak.forEach(h => bajok.push(`${hol}: ${h}`));
  }
  assert.deepEqual(bajok, []);
  assert.ok(db > 30000, `kevés feladat futott le (${db})`);
});

test('a sablonban minden válaszfajtára van példa', () => {
  const sablon = T.fejezetek.find(f => f.fajl === SABLON).fejezet, van = new Set(), mezok = new Set();
  for (const g of Object.values(sablon.feladatok)) {
    for (const k of ['szint', 'proba']) if (g[k] != null) mezok.add(k);
    for (let i = 0; i < 40; i++) {
      const p = general(g), v = p.valasz;
      Object.keys(v).forEach(k => van.add(k)); Object.keys(p).forEach(k => mezok.add(k));
      if (v.kifejezes && /[<>]|\\[lg]e\b/.test(v.kifejezes)) van.add('reláció');
      if (v.fajta) van.add('fajta:' + v.fajta);
      if (/class="grafikon-kep"/.test(p.kerdes)) van.add('ábra a kérdésben');
      if ((p.megoldas || []).some(m => /class="grafikon-kep"/.test(m))) van.add('ábra a megoldásban');
    }
  }
  for (const k of ['ertekek', 'nincs', 'tol', 'forma', 'kozott', 'pelda', 'valasztas', 'helyes', 'kifejezes', 'alak', 'tagok', 'reláció', 'grafikon', 'fajta:egyenes', 'fajta:abs', 'ablak', 'pontok', 'rajz', 'ábra a kérdésben', 'ábra a megoldásban'])
    assert.ok(van.has(k), `a sablonból hiányzik példa erre: ${k}`);
  for (const k of ['kerdes', 'valasz', 'formatum', 'tipp', 'megoldas', '_ell', 'billentyuzet', 'szint', 'proba']) assert.ok(mezok.has(k), `a sablonból hiányzik példa erre a mezőre: ${k}`);
  for (const k of ['id', 'cim', 'rovid', 'bevezeto', 'elmelet', 'igazHamis', 'igazHamisDb', 'mintapelda', 'feladatok']) assert.ok(sablon[k] != null, `a sablon fejezetéből hiányzik: ${k}`);
});
