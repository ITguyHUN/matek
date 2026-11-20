/*
 * Egy fejezetfájl kipróbálása böngésző nélkül: típusonként kiír néhány legenerált feladatot (kérdés, válasz, megoldás),
 * és jelzi a formai hibákat. Feladatírás közben ezzel lehet gyorsan ránézni, mit ad a generátor.
 *
 *   npm run feladat -- tananyag/9/algebra-szamelmelet/07-szorzatta-alakitas.js            (minden típus, 3-3 feladat)
 *   npm run feladat -- tananyag/9/algebra-szamelmelet/07-szorzatta-alakitas.js kiemeles 5  (egy típus, 5 feladat)
 *   npm run feladat                                                                        (a sablon)
 * A fájl akkor is kipróbálható, ha még nincs beírva a kurzus.js-be.
 */
const { betolt, feladatHibak, general, SABLON } = require('./tananyag-betolto.cjs');
const [fajl = SABLON, csakTipus, dbArg] = process.argv.slice(2), db = +dbArg || 3;

const sima = s => String(s).replace(/<svg[\s\S]*?<\/svg>/g, ' [ábra] ').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const valaszSzoveg = v => v.nincs ? 'nincs megoldás' : v.valasztas ? `${v.valasztas[v.helyes]}  (lehetőségek: ${v.valasztas.join(' | ')})`
  : v.kozott ? `bármi ${v.kozott[0]} és ${v.kozott[1]} között${v.pelda ? `, pl. ${v.pelda}` : ''}`
  : v.kifejezes != null ? `${v.kifejezes}${v.alak ? `  [alak: ${v.alak}]` : ''}`
  : v.grafikon != null ? `grafikon: f(x) = ${v.grafikon}  [${v.fajta || 'egyenes'}]`
  : v.pontok ? `pontok: ${v.pontok.map(p => `(${p.join('; ')})`).join(', ')}`
  : `${v.ertekek.join('; ')}${v.tol ? `  [±${v.tol}]` : ''}${v.tolRel ? `  [±${v.tolRel * 100}%]` : ''}${v.forma ? `  [alak: ${v.forma}]` : ''}`;

const T = betolt(fajl); let baj = T.hibak.length;
T.hibak.forEach(h => console.log('BETÖLTÉSI HIBA –', h));
const f = T.fejezetek[0];
if (!f) { if (!baj) console.log(`Nincs ilyen fejezetfájl: ${fajl}`); process.exit(1); }
console.log(`${f.fajl}\n${f.fejezet.cim}  (id: ${f.fejezet.id}, ${Object.keys(f.fejezet.feladatok).length} feladattípus)\n`);
for (const [tip, g] of Object.entries(f.fejezet.feladatok)) {
  if (csakTipus && tip !== csakTipus) continue;
  const kerdesek = new Set(), hibak = new Set(), mintak = [];
  for (let i = 0; i < 60; i++) {
    let p; try { p = general(g); } catch (e) { hibak.add(`a general() hibát dobott: ${e.message}`); continue; }
    feladatHibak(p, T.ablak).forEach(h => hibak.add(h));
    if (p && !kerdesek.has(p.kerdes) && mintak.length < db) mintak.push(p);
    kerdesek.add(p && p.kerdes);
  }
  console.log(`── ${tip} – ${g.nev || g.name}${g.szint ? ` [${g.szint}]` : ''}${g.proba === false ? ' [próbából kizárva]' : ''}   (60 húzásból ${kerdesek.size} különböző kérdés)`);
  mintak.forEach((p, i) => {
    console.log(`  ${i + 1}. ${sima(p.kerdes)}`);
    console.log(`     válasz:   ${valaszSzoveg(p.valasz)}`);
    if (p.tipp) console.log(`     tipp:     ${sima(p.tipp)}`);
    if (p.megoldas) console.log(`     megoldás: ${p.megoldas.map(sima).join('  →  ')}`);
  });
  if (kerdesek.size < 15) hibak.add(`csak ${kerdesek.size} különböző kérdés (legalább 15 kell)`);
  const fajtak = new Map(); hibak.forEach(h => { const k = h.replace(/: [\s\S]*/, ''); if (!fajtak.has(k)) fajtak.set(k, h); });   // egyféle hiba egyszer, egy példával
  fajtak.forEach(h => console.log(`  HIBA – ${h}`)); baj += fajtak.size;
  console.log('');
}
T.bezar();
console.log(baj ? `${baj} hiba – javítsd, mielőtt a kurzus.js-be kerül.` : 'Formai hiba nincs. A tartalmat (jó-e a feladat, helyes-e a megoldás) a fenti mintákon ellenőrizd.');
process.exit(baj ? 1 : 0);
