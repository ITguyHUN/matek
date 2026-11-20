/*
 * A tananyag betöltése Node alatt (böngésző nélkül) és egy feladat formai ellenőrzése.
 * Használja: test/tananyag.test.cjs (npm test) és test/minta-feladatok.cjs (npm run feladat).
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const gyoker = path.resolve(__dirname, '..');
const SABLON = 'tananyag/sablon-fejezet.js';

/* Vissza: { fejezetek: [{ fajl, evf, fejezet }], hibak: [szöveg], ablak, bezar() }. csakFajl: csak ezt az egy fejezetfájlt adja vissza. */
function betolt(csakFajl) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only', url: 'https://example.test/' });
  const kor = dom.getInternalVMContext(), fut = f => vm.runInContext(fs.readFileSync(path.join(gyoker, f), 'utf8'), kor, { filename: f });
  let kurzus = null, fejezet = null; const fejezetek = [], hibak = [];
  dom.window.Tananyag = { kurzus(d) { kurzus = d; }, fejezet(d) { fejezet = d; } };
  ['assets/mathlib.js', 'assets/kifejezes.js', 'assets/grafikon.js'].forEach(fut);
  const egy = (fajl, evf) => { fejezet = null; try { fut(fajl); if (!fejezet) throw new Error('nem hívja meg a Tananyag.fejezet()-et'); fejezetek.push({ fajl, evf, fejezet }); } catch (e) { hibak.push(`${fajl}: ${e.message}`); } };
  const cel = csakFajl ? csakFajl.replace(/\\/g, '/').replace(/^\.\//, '') : null;
  for (const evf of fs.readdirSync(path.join(gyoker, 'tananyag')).filter(d => fs.existsSync(path.join(gyoker, 'tananyag', d, 'kurzus.js')))) {
    kurzus = null; fut(`tananyag/${evf}/kurzus.js`);   // a kurzus.js adja az évfolyam közös segédfüggvényeit (M9, M10 …) is
    if (evf === '9' && (!cel || cel === SABLON)) egy(SABLON, 'sablon');
    for (const tk of kurzus.temakorok) for (const e of tk.fejezetek) {
      if (String(e).startsWith('//')) continue;
      const fajl = `tananyag/${evf}/${tk.mappa}/${typeof e === 'string' ? e : e.fajl}`;
      if (!cel || cel === fajl) egy(fajl, evf);
    }
    if (cel && cel.startsWith(`tananyag/${evf}/`) && !fejezetek.some(f => f.fajl === cel) && fs.existsSync(path.join(gyoker, cel))) egy(cel, evf);   // még nincs a kurzus.js-ben
  }
  return { fejezetek, hibak, ablak: dom.window, bezar: () => dom.window.close() };
}

const szovegE = x => typeof x === 'string' && x.trim() !== '';
const veges = x => typeof x === 'number' && isFinite(x);
const FAJTAK = ['ertekek', 'nincs', 'valasztas', 'kozott', 'kifejezes', 'grafikon', 'pontok'];
/* A képletek (\( … \), \[ … \]) kigyűjtése egy szövegből */
const kepletek = s => String(s).match(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g) || [];

/* Egy legenerált feladat hibái (üres tömb: rendben). ablak: a betolt() ablaka (Kifejezes, Grafikon innen jön). */
function feladatHibak(p, ablak) {
  const h = [];
  if (!p || typeof p !== 'object') return ['a general() nem adott vissza feladatot'];
  if (!szovegE(p.kerdes)) h.push('hiányzik a kerdes');
  const v = p.valasz, fajta = v && typeof v === 'object' ? FAJTAK.filter(k => v[k] != null && v[k] !== false) : [];
  if (!fajta.length) h.push(`a valasz egyik ismert fajtát sem tartalmazza (${FAJTAK.join(', ')})`);
  else if (fajta.length > 1 && !(fajta.includes('pontok') && fajta.length === 1)) h.push(`a valasz több fajtát kever: ${fajta.join(', ')}`);
  else try {
    const f = fajta[0];
    if (f === 'ertekek') {
      if (!Array.isArray(v.ertekek) || !v.ertekek.length || !v.ertekek.every(veges)) h.push('az ertekek véges számok nem üres listája legyen');
      if (v.forma != null && !['tizedes', 'tort'].includes(v.forma)) h.push(`ismeretlen forma: ${v.forma}`);
      for (const k of ['tol', 'tolRel']) if (v[k] != null && !(veges(v[k]) && v[k] > 0)) h.push(`a ${k} pozitív szám legyen`);
    } else if (f === 'valasztas') {
      if (!Array.isArray(v.valasztas) || v.valasztas.length < 2) h.push('a valasztas legalább két lehetőség legyen');
      else if (!Number.isInteger(v.helyes) || v.helyes < 0 || v.helyes >= v.valasztas.length) h.push('a helyes a jó lehetőség sorszáma (0-tól)');
      else if (new Set(v.valasztas.map(String)).size !== v.valasztas.length) h.push('két választási lehetőség azonos');
    } else if (f === 'kozott') {
      if (!Array.isArray(v.kozott) || v.kozott.length !== 2 || !v.kozott.every(veges) || !(v.kozott[0] < v.kozott[1])) h.push('a kozott [alsó, felső] legyen, alsó < felső');
    } else if (f === 'kifejezes') {
      const e = ablak.Kifejezes.ellenoriz(v, v.kifejezes);
      if (!e.ok) h.push(`a megadott kifejezes nem megy át a saját ellenőrzésén: ${e.uzenet}`);
    } else if (f === 'grafikon' || f === 'pontok') {
      const [x0, x1, y0, y1] = v.ablak || [-6, 6, -6, 6], pontok = ablak.Grafikon.megoldasPontok(v);
      if (!pontok || !pontok.length) h.push('a grafikon nem rajzolható meg rácspontokkal a megadott ablakban');
      else if (!pontok.every(q => veges(q.x) && veges(q.y) && q.x >= x0 && q.x <= x1 && q.y >= y0 && q.y <= y1)) h.push('a megoldás pontjai kilógnak az ablakból');
      else if (!ablak.Grafikon.ellenoriz(v, { pontok }).ok) h.push('a saját megoldása nem megy át az ellenőrzésen');
    }
    // _ell: a feladatíró saját próbája – a megadott válasz behelyettesítve teljesíti-e a feladatot
    if (typeof p._ell === 'function') {
      const ertekek = f === 'nincs' ? ['nincs'] : f === 'ertekek' ? v.ertekek : [];
      if (!ertekek.every(w => p._ell(w))) h.push('a megadott válasz nem teljesíti a feladat saját próbáját (_ell)');
    }
  } catch (e) { h.push(`a valasz ellenőrzése hibát dobott: ${e.message}`); }
  if (p.megoldas != null && !(Array.isArray(p.megoldas) && p.megoldas.length && p.megoldas.every(szovegE))) h.push('a megoldas nem üres szövegek listája legyen');
  if (p.tipp != null && !szovegE(p.tipp)) h.push('a tipp szöveg legyen');
  const szovegek = [p.kerdes, p.tipp, ...(Array.isArray(p.megoldas) ? p.megoldas : [])].filter(x => typeof x === 'string');
  for (const s of szovegek) {
    const db = j => s.split(j).length - 1;
    if (db('\\(') !== db('\\)') || db('\\[') !== db('\\]')) { h.push(`páratlan képlethatároló: ${s.slice(0, 60)}`); break; }
    if (/\bundefined\b|\bNaN\b|\[object /.test(s.replace(/<svg[\s\S]*?<\/svg>/g, ''))) { h.push(`a szövegbe „undefined” vagy „NaN” került: ${s.slice(0, 60)}`); break; }
    // képletben a betű előtti < jel HTML-elemnek látszik, és elnyeli a folytatást (9–10. évf.: az M9/M10.tisztit javítja)
    if (kepletek(s).some(k => /<[A-Za-z!?\/]/.test(k))) { h.push(`képletben < után közvetlenül betű áll (írj szóközt vagy \\lt-t): ${s.slice(0, 60)}`); break; }
  }
  return h;
}
const general = g => (g.general || g.make).call(g);

module.exports = { betolt, feladatHibak, general, SABLON };
