/**
 * Matek gyakorló – Google Apps Script háttér (Google Táblázat)
 *
 * Lapok a táblázatban
 *  - „Felhasználók” (vagy bármely „Felhasználók…” kezdetű lap, pl. „Felhasználók 11.A”):
 *      Felhasználónév | Jelszó | Név | Csoport | Tananyag | Szerep
 *    Ezt TE töltöd ki (Excelből bemásolva vagy importálva). Csak az itt szereplők léphetnek be.
 *    Szerep: „diák” (alapértelmezés) vagy „tanár”. Tanárnál a Csoport mező: a látható csoportok
 *    vesszővel elválasztva, vagy üresen / „*” = minden csoport.
 *  - „Állapot”, „Megoldások”, „Próbák”, „Csoportnyitás”: ezeket a program tölti.
 *
 * TELEPÍTÉS
 *  1. Új Google Táblázat → Bővítmények → Apps Script → másold be ezt a fájlt → Mentés.
 *  2. Futtasd a „setup” függvényt (engedélyezd a hozzáférést).
 *  3. Töltsd ki a „Felhasználók” lapot.
 *  4. Telepítés → Új telepítés → Webalkalmazás; Végrehajtás mint: Én; Hozzáférés: Bárki → Telepítés.
 *  5. A kapott …/exec URL-t írd be a weboldal config.js fájljába (vegpont).
 * Kódmódosítás után: Telepítés → Telepítések kezelése → szerkesztés → Új verzió (így az URL marad).
 */

const LAP = { allapot: 'Állapot', megoldasok: 'Megoldások', probak: 'Próbák', nyitas: 'Csoportnyitás', szint: 'Csoportszint', korlat: 'Csoportkorlát', hazi: 'Házi feladatok' };
const FELH_ELOTAG = 'Felhasználók';
const IDOZONA = 'Europe/Budapest';
const MAX_HIBAS_BELEPES = 10;   // ennyi hibás jelszó után 15 percre zárol

const FEJLEC = {
  felhasznalok: ['Felhasználónév', 'Jelszó', 'Név', 'Csoport', 'Tananyag', 'Szerep'],
  allapot: ['Felhasználónév', 'Név', 'Csoport', 'Tananyag', 'Utolsó aktivitás', 'Cukorka', 'Összes cukorka', 'Napi sorozat', 'Legjobb sorozat',
            'Helyes megoldások', 'Próbák száma', 'Utolsó próba (%)', 'adat'],
  megoldasok: ['Időpont', 'Felhasználónév', 'Név', 'Csoport', 'Témakör', 'Fejezet', 'Feladattípus', 'Feladat', 'Válasz',
               'Helyes válasz', 'Eredmény', 'Új feladat', 'Cukorka', 'fejezet_id', 'temakor_id', 'azonosító', 'Házi'],
  probak: ['Időpont', 'Felhasználónév', 'Név', 'Csoport', 'Témakör', 'Pont', 'Max', 'Százalék', 'Jegy',
           'Ismétlendő fejezetek', 'Részletek', 'temakor_id', 'azonosító'],
  nyitas: ['Csoport', 'Tananyag', 'Témakör', 'Nyitva eddig (fejezet sorszáma)', 'Fejezet', 'Módosította', 'Időpont'],
  szint: ['Csoport', 'Tananyag', 'Szint', 'Módosította', 'Időpont'],
  korlat: ['Csoport', 'Tananyag', 'Témakör', 'Cukorkával nyitható legfeljebb (fejezet sorszáma)', 'Fejezet', 'Módosította', 'Időpont'],
  hazi: ['azonosító', 'Csoport', 'Tananyag', 'Cím', 'Határidő', 'Feladatok', 'adat', 'Létrehozta', 'Időpont', 'Törölve']
};

/* ===================== Webes belépési pontok ===================== */

function doGet() {
  return json_({ ok: true, msg: 'A Matek gyakorló háttérszolgáltatása működik.' });
}

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad' }); }
  const ir = ['sync', 'tUnlock', 'tLevel', 'tLimit', 'tHazi'].indexOf(d.action) >= 0;
  const lock = ir ? LockService.getScriptLock() : null;
  if (lock && !lock.tryLock(25000)) return json_({ ok: false, error: 'busy' });
  try { return json_(kezel_(d)); }
  catch (err) { return json_({ ok: false, error: 'server', detail: String(err && err.stack || err) }); }
  finally { if (lock) lock.releaseLock(); }
}

function kezel_(d) {
  if (d.action === 'login') return belepes_(d);
  const u = azonosit_(d);
  if (!u) return { ok: false, error: 'auth' };
  switch (d.action) {
    case 'load': return betolt_(u);
    case 'sync': return szinkron_(u, d);
    case 'tOverview': return u.role === 'tanar' ? tanarAttekintes_(u, d) : { ok: false, error: 'jog' };
    case 'tLog': return u.role === 'tanar' ? tanarNaplo_(u, d) : { ok: false, error: 'jog' };
    case 'tUnlock': return u.role === 'tanar' ? tanarNyitas_(u, d) : { ok: false, error: 'jog' };
    case 'tLevel': return u.role === 'tanar' ? tanarSzint_(u, d) : { ok: false, error: 'jog' };
    case 'tLimit': return u.role === 'tanar' ? tanarKorlat_(u, d) : { ok: false, error: 'jog' };
    case 'tHazi': return u.role === 'tanar' ? tanarHazi_(u, d) : { ok: false, error: 'jog' };
  }
  return { ok: false, error: 'action' };
}

/* ===================== Felhasználók, belépés ===================== */

function normFejlec_(h) {
  return String(h).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}
function felhasznalok_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const out = {};
  ss.getSheets().forEach(function (sh) {
    if (sh.getName().indexOf(FELH_ELOTAG) !== 0) return;
    const v = sh.getDataRange().getValues();
    if (v.length < 2) return;
    const n = v[0].map(normFejlec_);
    const idx = function () { const c = Array.prototype.slice.call(arguments); for (let i = 0; i < n.length; i++) if (c.indexOf(n[i]) >= 0) return i; return -1; };
    const H = {
      user: idx('felhasznalonev', 'felhasznalo', 'username', 'user', 'azonosito', 'login'),
      pass: idx('jelszo', 'password', 'pass'),
      name: idx('nev', 'name', 'teljesnev', 'tanulo', 'tanulonev'),
      group: idx('csoport', 'osztaly', 'group', 'class', 'csoportok'),
      course: idx('tananyag', 'evfolyam', 'kurzus', 'course'),
      role: idx('szerep', 'role', 'jogosultsag', 'tipus')
    };
    if (H.user < 0 || H.pass < 0) return;
    for (let i = 1; i < v.length; i++) {
      const user = String(v[i][H.user]).trim();
      if (!user) continue;
      const key = user.toLowerCase();
      if (out[key]) continue;
      const roleTxt = H.role >= 0 ? normFejlec_(v[i][H.role]) : '';
      out[key] = {
        user: user, key: key,
        pass: String(v[i][H.pass]).trim(),
        name: (H.name >= 0 ? String(v[i][H.name]).trim() : '') || user,
        group: H.group >= 0 ? String(v[i][H.group]).trim() : '',
        courses: H.course >= 0 ? String(v[i][H.course]).split(/[,;\s]+/).map(function (x) { return x.trim().replace(/\.0+$/, ''); }).filter(String) : [],
        role: /^(tanar|teacher|admin|oktato)/.test(roleTxt) ? 'tanar' : 'diak'
      };
    }
  });
  Object.keys(out).forEach(function (k) { out[k].course = out[k].courses[0] || ''; });
  return out;
}
function titok_() {
  const p = PropertiesService.getScriptProperties();
  let s = p.getProperty('TITOK');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('TITOK', s); }
  return s;
}
function hex_(bytes) { return bytes.map(function (b) { return ((b + 256) % 256).toString(16).padStart(2, '0'); }).join(''); }
function token_(u) {
  return hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, titok_() + '|' + u.key + '|' + u.pass + '|' + u.role, Utilities.Charset.UTF_8)).slice(0, 40);
}
function profil_(u) { return { user: u.user, name: u.name, group: u.group, course: u.course, courses: u.courses, role: u.role }; }
function azonosit_(d) {
  const u = felhasznalok_()[String(d.user || '').trim().toLowerCase()];
  if (!u || !u.pass || !d.token || String(d.token) !== token_(u)) return null;
  return u;
}
function belepes_(d) {
  const key = String(d.user || '').trim().toLowerCase();
  const cache = CacheService.getScriptCache(), ck = 'hiba:' + key;
  const hibak = Number(cache.get(ck) || 0);
  if (hibak >= MAX_HIBAS_BELEPES) return { ok: false, error: 'zarolt' };
  const u = felhasznalok_()[key];
  if (!u || !u.pass || String(d.pass || '') !== u.pass) {
    cache.put(ck, String(hibak + 1), 900);
    return { ok: false, error: 'hibas' };
  }
  cache.remove(ck);
  const a = allapotOlvas_(u);
  return { ok: true, token: token_(u), profile: profil_(u), state: kliens_(a.state), groupUnlock: csoportNyitas_(u.group, u.courses), groupLevel: csoportSzint_(u.group, u.courses),
    groupLimit: csoportKorlat_(u.group, u.courses), hazik: csoportHazik_(u.group, u.courses, false) };
}
function betolt_(u) {
  const a = allapotOlvas_(u);
  return { ok: true, profile: profil_(u), state: kliens_(a.state), groupUnlock: csoportNyitas_(u.group, u.courses), groupLevel: csoportSzint_(u.group, u.courses),
    groupLimit: csoportKorlat_(u.group, u.courses), hazik: csoportHazik_(u.group, u.courses, false) };
}

/* ===================== Szinkronizálás ===================== */

function ctxTisztit_(c, gu, gl, gk, hazik) {
  c = c || {};
  const order = {}, need = {};
  Object.keys(c.order || {}).slice(0, 50).forEach(function (m) {
    if (Array.isArray(c.order[m])) order[szoveg_(m, 60)] = c.order[m].slice(0, 300).map(function (x) { return szoveg_(x, 80); });
  });
  Object.keys(c.need || {}).slice(0, 50).forEach(function (m) {
    const n = c.need[m];
    need[szoveg_(m, 60)] = Array.isArray(n) ? n.slice(0, 300).map(function (x) { return egesz_(x, 0, 100); }) : egesz_(n, 0, 100);
  });
  /* szám, vagy évfolyamonként: { '11': 10, '7': 8 } */
  const evf = function (v, def, max) {
    if (v && typeof v === 'object') { const o = {}; Object.keys(v).slice(0, 100).forEach(function (k) { o[szoveg_(k, 60)] = egesz_(v[k] || def, 1, max); }); return o; }
    return egesz_(v || def, 1, max);
  };
  /* emelt szintű (láncon kívüli) fejezet → láncbeli fejezet, amelyhez tartozik */
  const kieg = {};
  if (c.kieg && typeof c.kieg === 'object') Object.keys(c.kieg).slice(0, 300).forEach(function (k) { kieg[szoveg_(k, 80)] = szoveg_(c.kieg[k], 80); });
  /* fejezet → a cukorkához kötelező feladattípusok */
  const tipusok = {};
  if (c.tipusok && typeof c.tipusok === 'object') Object.keys(c.tipusok).slice(0, 300).forEach(function (k) {
    if (Array.isArray(c.tipusok[k])) tipusok[szoveg_(k, 80)] = c.tipusok[k].slice(0, 40).map(function (g) { return szoveg_(g, 60); });
  });
  return { order: order, need: need, kombo: evf(c.kombo, 10, 100), streakMin: evf(c.streakMin, 1, 50), groupUnlock: gu,
           szint: gl || {}, kieg: kieg, tipusok: tipusok, limit: gk || {}, hazi: haziCtx_(hazik || []), today: ma_() };
}
function szinkron_(u, d) {
  const gu = csoportNyitas_(u.group, u.courses), gl = csoportSzint_(u.group, u.courses), gk = csoportKorlat_(u.group, u.courses);
  const hazik = csoportHazik_(u.group, u.courses, false), haziCim = {};
  hazik.forEach(function (h) { haziCim[h.id] = h.cim; });
  const ctx = ctxTisztit_(d.ctx, gu, gl, gk, hazik);
  const a = allapotOlvas_(u);
  const st = a.state;
  Szabalyok.frissit(st, ctx);
  const tegnap = Szabalyok.elozoNap(ctx.today);
  const most = new Date();
  const naplo = [];
  (Array.isArray(d.events) ? d.events : []).slice(0, 60).forEach(function (e0) {
    if (!e0 || typeof e0 !== 'object') return;
    const ev = {
      eid: szoveg_(e0.eid, 40), kind: ['megoldas', 'nyitas', 'hazi'].indexOf(e0.kind) >= 0 ? e0.kind : 'valasz', hid: szoveg_(e0.hid, 40),
      mod: szoveg_(e0.mod, 60), ch: szoveg_(e0.ch, 80), gen: szoveg_(e0.gen, 60), sig: szoveg_(e0.sig, 20),
      ok: e0.ok === true, helped: e0.helped === true, emelt: e0.emelt === true, day: szoveg_(e0.day, 10)
    };
    if (!ev.eid || !ev.ch) return;
    if (ev.day !== ctx.today && ev.day !== tegnap) ev.day = ctx.today;
    const fx = Szabalyok.alkalmaz(st, ev, ctx);
    if (fx.dup || ev.kind === 'nyitas') return;   // a fejezetnyitás nem kerül a Megoldások lapra
    naplo.push([most, u.user, u.name, u.group, szoveg_(e0.modCim || ev.mod, 80), szoveg_(e0.chCim, 120), szoveg_(e0.genNev, 80),
      cella_(szoveg_(e0.q, 600)), cella_(szoveg_(e0.a, 120)), cella_(szoveg_(e0.helyes, 120)),
      ev.kind === 'megoldas' ? 'megnézte a megoldást' : (ev.ok ? (ev.helped ? 'helyes (megoldás után)' : 'helyes') : 'hibás'),
      ev.kind === 'hazi' ? '' : fx.uj ? (fx.ertek === 2 ? 'igen (emelt: 2×)' : 'igen') : '', fx.cukorka ? (fx.cukorkaDb || 1) : '', ev.ch, ev.mod, ev.eid,
      ev.kind === 'hazi' ? (haziCim[ev.hid] || ev.hid) + (fx.uj ? ' (+1)' : '') : '']);
  });
  if (naplo.length) sorokHozzaad_(lap_(LAP.megoldasok), naplo);

  const tesztek = (Array.isArray(d.tests) ? d.tests : []).slice(0, 10);
  let probaSzam = 0, utolsoPct = null;
  if (tesztek.length) {
    const ps = lap_(LAP.probak);
    const vanMar = azonositok_(ps, 'azonosító', 400);
    const sorok = [];
    tesztek.forEach(function (t) {
      const tid = szoveg_(t.tid, 40);
      if (!tid || vanMar[tid]) return;
      const max = egesz_(t.max, 1, 200), score = egesz_(t.score, 0, max), pct = Math.round(100 * score / max);
      const weak = (Array.isArray(t.weak) ? t.weak : []).map(function (x) { return szoveg_(x, 60); }).join(', ');
      const det = t.detail && typeof t.detail === 'object' ? Object.keys(t.detail).slice(0, 40).map(function (k) {
        const v = t.detail[k]; return szoveg_(k, 60) + ': ' + egesz_(v && v[0], 0, 99) + '/' + egesz_(v && v[1], 0, 99); }).join('; ') : '';
      sorok.push([most, u.user, u.name, u.group, szoveg_(t.modCim || t.mod, 80), score, max, pct / 100, egesz_(t.grade, 1, 5), weak || '–', det, szoveg_(t.mod, 40), tid]);
      probaSzam++; utolsoPct = pct;
    });
    if (sorok.length) {
      sorokHozzaad_(ps, sorok);
      ps.getRange(ps.getLastRow() - sorok.length + 1, 8, sorok.length, 1).setNumberFormat('0%');
    }
  }
  Szabalyok.tomorit(st, ctx);
  allapotIr_(u, a.row, st, ctx, probaSzam, utolsoPct);
  return { ok: true, profile: profil_(u), state: kliens_(st), groupUnlock: gu, groupLevel: gl, groupLimit: gk, hazik: hazik };
}

/* ===================== Állapot lap ===================== */

function allapotOlvas_(u) {
  const sh = lap_(LAP.allapot), H = fejlecTerkep_(sh);
  const last = sh.getLastRow();
  if (last >= 2) {
    const keys = sh.getRange(2, H['Felhasználónév'], last - 1, 1).getValues();
    for (let i = 0; i < keys.length; i++) {
      if (String(keys[i][0]).trim().toLowerCase() === u.key) {
        const raw = sh.getRange(i + 2, H.adat).getValue();
        let st = null; try { st = JSON.parse(raw || 'null'); } catch (e) { st = null; }
        return { row: i + 2, state: Szabalyok.migral(Szabalyok.normal(st), u.courses[0] || '11') };
      }
    }
  }
  return { row: 0, state: Szabalyok.ujAllapot() };
}
function allapotIr_(u, row, st, ctx, probaPlusz, utolsoPct) {
  const sh = lap_(LAP.allapot), H = fejlecTerkep_(sh), lc = sh.getLastColumn();
  let vals;
  if (row) vals = sh.getRange(row, 1, 1, lc).getValues()[0];
  else vals = new Array(lc).fill('');
  let helyes = 0; Object.keys(st.ch).forEach(function (k) { helyes += st.ch[k].ok; });
  const tegye = function (h, v) { if (H[h]) vals[H[h] - 1] = v; };
  tegye('Felhasználónév', u.user); tegye('Név', u.name); tegye('Csoport', u.group); tegye('Tananyag', u.courses.join(', '));
  tegye('Utolsó aktivitás', new Date()); tegye('Cukorka', Szabalyok.penz(st)); tegye('Összes cukorka', st.candy);
  tegye('Napi sorozat', Szabalyok.aktualisStreak(st, ctx.today, ctx)); tegye('Legjobb sorozat', st.streak.best);
  tegye('Helyes megoldások', helyes);
  tegye('Próbák száma', (Number(vals[H['Próbák száma'] - 1]) || 0) + (probaPlusz || 0));
  if (utolsoPct != null) tegye('Utolsó próba (%)', utolsoPct);
  tegye('adat', JSON.stringify(st));
  if (row) sh.getRange(row, 1, 1, lc).setValues([vals]);
  else sh.appendRow(vals);
}
function kliens_(st) { return st; }

/* ===================== Csoportnyitás ===================== */

/* A csoportnak megnyitott fejezetek: { 'évfolyam/témakör': sorszám (0-tól; = fejezetszám → próba is) } */
function csoportNyitas_(group, courses) {
  const out = {};
  if (!group) return out;
  courses = (courses || []).map(String);
  const sh = lap_(LAP.nyitas), v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    const c = String(v[i][1]).trim().replace(/\.0+$/, '');
    if (egyezik_(v[i][0], group) && courses.indexOf(c) >= 0) {
      out[c + '/' + String(v[i][2]).trim()] = Math.max(0, egesz_(v[i][3], 1, 1000) - 1);
    }
  }
  return out;
}
function tanarNyitas_(u, d) {
  const groups = lathatoCsoportok_(u, felhasznalok_());
  const g = String(d.group || '');
  if (groups.indexOf(g) < 0) return { ok: false, error: 'jog' };
  const course = szoveg_(d.course, 20), mod = szoveg_(d.mod, 40), idx = egesz_(d.idx, 0, 999);
  const sh = lap_(LAP.nyitas), v = sh.getDataRange().getValues();
  const sor = [g, course, mod, idx + 1, szoveg_(d.chCim, 120), u.name, new Date()];
  let found = 0;
  for (let i = 1; i < v.length; i++) {
    if (egyezik_(v[i][0], g) && String(v[i][1]).trim() === course && String(v[i][2]).trim() === mod) { found = i + 1; break; }
  }
  if (found) sh.getRange(found, 1, 1, sor.length).setValues([sor]); else sh.appendRow(sor);
  return { ok: true, groupUnlock: csoportNyitas_(g, [course]) };
}

/* ===================== Csoportszint ===================== */

/* A csoport beállított feladatszintje évfolyamonként: { '11': 'kozep' | 'emelt' } (nincs megadva = minden feladat együtt). */
function csoportSzint_(group, courses) {
  const out = {};
  if (!group) return out;
  courses = (courses || []).map(String);
  const sh = lap_(LAP.szint), v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    const c = String(v[i][1]).trim().replace(/\.0+$/, '');
    if (egyezik_(v[i][0], group) && courses.indexOf(c) >= 0) out[c] = /^k/i.test(String(v[i][2]).trim()) ? 'kozep' : 'emelt';
  }
  return out;
}
function tanarSzint_(u, d) {
  const groups = lathatoCsoportok_(u, felhasznalok_());
  const g = String(d.group || '');
  if (groups.indexOf(g) < 0) return { ok: false, error: 'jog' };
  const course = szoveg_(d.course, 20), szint = d.szint === 'kozep' ? 'közép' : 'emelt';
  const sh = lap_(LAP.szint), v = sh.getDataRange().getValues();
  const sor = [g, course, szint, u.name, new Date()];
  let found = 0;
  for (let i = 1; i < v.length; i++) {
    if (egyezik_(v[i][0], g) && String(v[i][1]).trim().replace(/\.0+$/, '') === course) { found = i + 1; break; }
  }
  if (found) sh.getRange(found, 1, 1, sor.length).setValues([sor]); else sh.appendRow(sor);
  return { ok: true, groupLevel: csoportSzint_(g, [course]) };
}

/* ===================== Nyitási korlát ===================== */

/* Meddig nyithat a csoport cukorkával: { 'évfolyam/témakör': láncpozíció (0-tól; = fejezetszám → a próba is) } */
function csoportKorlat_(group, courses) {
  const out = {};
  if (!group) return out;
  courses = (courses || []).map(String);
  const sh = lap_(LAP.korlat), v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    const c = String(v[i][1]).trim().replace(/\.0+$/, '');
    if (egyezik_(v[i][0], group) && courses.indexOf(c) >= 0 && String(v[i][3]).trim() !== '') {
      out[c + '/' + String(v[i][2]).trim()] = Math.max(0, egesz_(v[i][3], 1, 1000) - 1);
    }
  }
  return out;
}
function tanarKorlat_(u, d) {
  const groups = lathatoCsoportok_(u, felhasznalok_());
  const g = String(d.group || '');
  if (groups.indexOf(g) < 0) return { ok: false, error: 'jog' };
  const course = szoveg_(d.course, 20), mod = szoveg_(d.mod, 40), nincs = d.idx === null || d.idx === '' || d.idx < 0;
  const sh = lap_(LAP.korlat), v = sh.getDataRange().getValues();
  const sor = [g, course, mod, nincs ? '' : egesz_(d.idx, 0, 999) + 1, nincs ? 'nincs korlát' : szoveg_(d.chCim, 120), u.name, new Date()];
  let found = 0;
  for (let i = 1; i < v.length; i++) {
    if (egyezik_(v[i][0], g) && String(v[i][1]).trim().replace(/\.0+$/, '') === course && String(v[i][2]).trim() === mod) { found = i + 1; break; }
  }
  if (found) sh.getRange(found, 1, 1, sor.length).setValues([sor]); else sh.appendRow(sor);
  return { ok: true, groupLimit: csoportKorlat_(g, [course]) };
}

/* ===================== Házi feladat ===================== */

function datum_(v) { return v instanceof Date ? Utilities.formatDate(v, IDOZONA, 'yyyy-MM-dd') : String(v || '').trim().slice(0, 10); }
/* A csoport házi feladatai. mind=false (diák): csak a még aktuálisak (határidő után 14 napig látszanak). */
function csoportHazik_(group, courses, mind) {
  const out = [];
  if (!group) return out;
  courses = (courses || []).map(String);
  const sh = lap_(LAP.hazi), H = fejlecTerkep_(sh), v = sh.getDataRange().getValues();
  const hatar = Utilities.formatDate(new Date(Date.now() - 14 * 864e5), IDOZONA, 'yyyy-MM-dd');
  for (let i = 1; i < v.length; i++) {
    const r = v[i], c = String(r[H['Tananyag'] - 1]).trim().replace(/\.0+$/, '');
    if (!egyezik_(r[H['Csoport'] - 1], group) || courses.indexOf(c) < 0 || String(r[H['Törölve'] - 1]).trim()) continue;
    const hd = datum_(r[H['Határidő'] - 1]);
    if (!mind && hd && hd < hatar) continue;
    let tetel = []; try { tetel = JSON.parse(r[H.adat - 1] || '[]'); } catch (e) { tetel = []; }
    out.push({ id: String(r[H['azonosító'] - 1]), kurzus: c, cim: String(r[H['Cím'] - 1] || ''), hatarido: hd, tetel: tetel,
               letrehozta: String(r[H['Létrehozta'] - 1] || ''), ido: iso_(r[H['Időpont'] - 1]) });
  }
  out.sort(function (a, b) { return String(a.hatarido).localeCompare(String(b.hatarido)); });
  return out;
}
function haziCtx_(hazik) {
  const o = {};
  hazik.forEach(function (h) { const t = {}; (h.tetel || []).forEach(function (x) { if (x && x.k) t[String(x.k)] = egesz_(x.db, 1, 100); }); o[h.id] = { tetel: t }; });
  return o;
}
/* Új házi (d.hazi = { cim, hatarido, tetel: [{ k: 'fejezet|típus', db, nev, chCim }] }) vagy törlés (d.torol = azonosító). */
function tanarHazi_(u, d) {
  const groups = lathatoCsoportok_(u, felhasznalok_());
  const g = String(d.group || ''), course = szoveg_(d.course, 20);
  if (groups.indexOf(g) < 0) return { ok: false, error: 'jog' };
  const sh = lap_(LAP.hazi), H = fejlecTerkep_(sh);
  if (d.torol) {
    const v = sh.getDataRange().getValues();
    for (let i = 1; i < v.length; i++) if (String(v[i][H['azonosító'] - 1]) === String(d.torol) && egyezik_(v[i][H['Csoport'] - 1], g)) sh.getRange(i + 1, H['Törölve']).setValue('igen (' + u.name + ')');
  } else {
    const h = d.hazi || {};
    const tetel = (Array.isArray(h.tetel) ? h.tetel : []).slice(0, 60).map(function (x) {
      return { k: szoveg_(x.k, 140), db: egesz_(x.db, 1, 100), nev: szoveg_(x.nev, 80), chCim: szoveg_(x.chCim, 120) };
    }).filter(function (x) { return x.k.indexOf('|') > 0; });
    if (!tetel.length) return { ok: false, error: 'ures' };
    const hd = /^\d{4}-\d{2}-\d{2}$/.test(String(h.hatarido || '')) ? String(h.hatarido) : '';
    const sor = new Array(sh.getLastColumn()).fill('');
    const tegye = function (k, val) { if (H[k]) sor[H[k] - 1] = val; };
    tegye('azonosító', Utilities.getUuid().slice(0, 8)); tegye('Csoport', g); tegye('Tananyag', course); tegye('Cím', szoveg_(h.cim, 120) || 'Házi feladat');
    tegye('Határidő', hd ? "'" + hd : ''); tegye('Feladatok', tetel.map(function (x) { return x.db + ' × ' + x.nev + ' (' + x.chCim + ')'; }).join('; '));
    tegye('adat', JSON.stringify(tetel)); tegye('Létrehozta', u.name); tegye('Időpont', new Date());
    sh.appendRow(sor);
  }
  return { ok: true, hazik: csoportHazik_(g, [course], true) };
}

/* ===================== Tanári lekérdezések ===================== */

function csoportLista_(s) { return String(s || '').split(/[,;]/).map(function (x) { return x.trim(); }).filter(String); }
function egyezik_(a, b) { return String(a).trim().toLowerCase() === String(b).trim().toLowerCase(); }
function lathatoCsoportok_(u, users) {
  const mind = {};
  Object.keys(users).forEach(function (k) { const x = users[k]; if (x.role === 'diak' && x.group) mind[x.group] = true; });
  const all = Object.keys(mind).sort();
  // a tanár csak a saját csoportjait látja (Felhasználók lap → Csoport oszlop); „*” = minden csoport
  const sajat = csoportLista_(u.group);
  if (sajat.indexOf('*') >= 0) return all;
  return all.filter(function (g) { return sajat.some(function (s) { return egyezik_(s, g); }); });
}
function tanarAttekintes_(u, d) {
  const users = felhasznalok_();
  const groups = lathatoCsoportok_(u, users);
  const group = groups.indexOf(d.group) >= 0 ? d.group : (groups[0] || '');
  const diakok = Object.keys(users).map(function (k) { return users[k]; })
    .filter(function (x) { return x.role === 'diak' && egyezik_(x.group, group); })
    .sort(function (a, b) { return a.name.localeCompare(b.name, 'hu'); });
  // állapotok
  const sh = lap_(LAP.allapot), H = fejlecTerkep_(sh), allapot = {};
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    const key = String(v[i][H['Felhasználónév'] - 1]).trim().toLowerCase();
    let st = null; try { st = JSON.parse(v[i][H.adat - 1] || 'null'); } catch (e) { st = null; }
    const fu = users[key];
    st = Szabalyok.migral(Szabalyok.normal(st), (fu && fu.courses[0]) || '11'); st.solved = {}; st.seen = []; Object.keys(st.hazi || {}).forEach(function (h) { st.hazi[h].s = []; });
    allapot[key] = { state: st, last: v[i][H['Utolsó aktivitás'] - 1] };
  }
  // próbák
  const ps = lap_(LAP.probak), P = fejlecTerkep_(ps), probak = {};
  const pv = ps.getDataRange().getValues();
  for (let i = pv.length - 1; i >= 1; i--) {
    const key = String(pv[i][P['Felhasználónév'] - 1]).trim().toLowerCase();
    if (!probak[key]) probak[key] = [];
    if (probak[key].length >= 20) continue;
    probak[key].push({ t: iso_(pv[i][P['Időpont'] - 1]), mod: String(pv[i][P.temakor_id - 1] || ''), score: pv[i][P.Pont - 1], max: pv[i][P.Max - 1],
      pct: Math.round(Number(pv[i][P['Százalék'] - 1]) * 100), grade: pv[i][P.Jegy - 1], weak: String(pv[i][P['Ismétlendő fejezetek'] - 1] || '') });
  }
  const tananyagok = {};
  diakok.forEach(function (x) { x.courses.forEach(function (c, j) { tananyagok[c] = (tananyagok[c] || 0) + (j === 0 ? 100 : 1); }); });
  const courseList = Object.keys(tananyagok).sort(function (a, b) { return tananyagok[b] - tananyagok[a]; });
  if (!courseList.length && u.course) courseList.push(u.course);
  const course = courseList.indexOf(String(d.course || '')) >= 0 ? String(d.course) : (courseList[0] || u.course || '');
  return {
    ok: true, groups: groups, group: group, course: course, courses: courseList,
    groupUnlock: csoportNyitas_(group, [course]), groupLevel: csoportSzint_(group, [course]),
    groupLimit: csoportKorlat_(group, [course]), hazik: csoportHazik_(group, [course], true),
    students: diakok.map(function (x) {
      const a = allapot[x.key];
      return { user: x.user, name: x.name, course: x.course, last: a ? iso_(a.last) : '', state: a ? a.state : Szabalyok.ujAllapot(), tests: probak[x.key] || [] };
    })
  };
}
function tanarNaplo_(u, d) {
  const groups = lathatoCsoportok_(u, felhasznalok_());
  const group = String(d.group || '');
  if (groups.indexOf(group) < 0) return { ok: false, error: 'jog' };
  const sh = lap_(LAP.megoldasok), H = fejlecTerkep_(sh);
  const v = sh.getDataRange().getValues();
  const limit = egesz_(d.limit, 1, 500), student = String(d.student || '').toLowerCase(), ch = String(d.ch || ''), mod = String(d.mod || '');
  const rows = [];
  for (let i = v.length - 1; i >= 1 && rows.length < limit; i--) {
    const r = v[i];
    if (!egyezik_(r[H.Csoport - 1], group)) continue;
    if (student && String(r[H['Felhasználónév'] - 1]).trim().toLowerCase() !== student) continue;
    if (ch && String(r[H.fejezet_id - 1]) !== ch) continue;
    if (mod && H.temakor_id && String(r[H.temakor_id - 1]) !== mod) continue;
    const ered = String(r[H['Eredmény'] - 1]);
    if (d.onlyWrong && ered !== 'hibás') continue;
    rows.push({
      t: iso_(r[H['Időpont'] - 1]), user: r[H['Felhasználónév'] - 1], name: r[H['Név'] - 1], chCim: r[H.Fejezet - 1], gen: r[H['Feladattípus'] - 1],
      q: String(r[H.Feladat - 1]), a: String(r[H['Válasz'] - 1]), helyes: String(r[H['Helyes válasz'] - 1]),
      kind: ered === 'megnézte a megoldást' ? 'megoldas' : 'valasz', ok: ered.indexOf('helyes') === 0, helped: ered.indexOf('megoldás') >= 0,
      hazi: H['Házi'] ? String(r[H['Házi'] - 1] || '') : '',
      novel: /^igen/.test(String(r[H['Új feladat'] - 1])), emelt2: /emelt/.test(String(r[H['Új feladat'] - 1])), candy: !!r[H.Cukorka - 1]
    });
  }
  return { ok: true, rows: rows };
}

/* ===================== Segédfüggvények ===================== */

function lap_(nev) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const kulcs = Object.keys(LAP).filter(function (k) { return LAP[k] === nev; })[0];
  const fej = FEJLEC[kulcs];
  const sh = ss.getSheetByName(nev) || ss.insertSheet(nev);
  const lc = Math.max(sh.getLastColumn(), 1);
  const have = sh.getRange(1, 1, 1, lc).getValues()[0].map(String);
  if (have.every(function (h) { return h === ''; })) { sh.getRange(1, 1, 1, fej.length).setValues([fej]); sh.setFrozenRows(1); }
  else {
    const hiany = fej.filter(function (h) { return have.indexOf(h) < 0; });
    if (hiany.length) sh.getRange(1, have.length + 1, 1, hiany.length).setValues([hiany]);
  }
  return sh;
}
function fejlecTerkep_(sh) {
  const m = {};
  sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].forEach(function (h, i) { if (h !== '') m[String(h)] = i + 1; });
  return m;
}
function sorokHozzaad_(sh, rows) { sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows); }
function azonositok_(sh, fej, n) {
  const H = fejlecTerkep_(sh), last = sh.getLastRow(), out = {};
  if (last < 2 || !H[fej]) return out;
  const from = Math.max(2, last - n);
  sh.getRange(from, H[fej], last - from + 1, 1).getValues().forEach(function (r) { out[String(r[0])] = true; });
  return out;
}
function szoveg_(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max || 200); }
function cella_(s) { return s === '' ? '' : "'" + s; }   // a táblázat ne értelmezze képletnek / dátumnak
function egesz_(v, lo, hi) { let n = Math.round(Number(v)); if (!isFinite(n)) n = lo; return Math.min(hi, Math.max(lo, n)); }
function ma_() { return Utilities.formatDate(new Date(), IDOZONA, 'yyyy-MM-dd'); }
function iso_(v) { if (v instanceof Date) return v.toISOString(); return v ? String(v) : ''; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ===================== Menü, előkészítés ===================== */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Matek gyakorló')
    .addItem('Felhasználók ellenőrzése', 'ellenoriz')
    .addItem('Táblázat előkészítése', 'setup')
    .addToUi();
}

/** Egyszer futtasd: létrehozza és megformázza a lapokat. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheets().some(function (s) { return s.getName().indexOf(FELH_ELOTAG) === 0; })) {
    const f = ss.insertSheet(FELH_ELOTAG, 0);
    f.getRange(1, 1, 1, FEJLEC.felhasznalok.length).setValues([FEJLEC.felhasznalok]);
    f.getRange(2, 1, 2, 6).setValues([['tanar', 'IdeIrjEgyJelszot', 'Tanár Úr', '*', '11', 'tanár'],
                                       ['minta.diak', '1234', 'Minta Diák', '11.A', '11', 'diák']]);
  }
  ss.getSheets().forEach(function (s) {
    if (s.getName().indexOf(FELH_ELOTAG) !== 0) return;
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, Math.max(s.getLastColumn(), 1)).setFontWeight('bold').setBackground('#fde6ef');
    s.getRange(2, 2, s.getMaxRows() - 1, 1).setNumberFormat('@');   // a jelszó mindig szöveg (ne vesszen el a kezdő 0)
  });
  Object.keys(LAP).forEach(function (k) {
    const sh = lap_(LAP[k]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold').setBackground('#e7edfc').setWrap(true);
  });
  const rejt = { allapot: ['adat'], megoldasok: ['fejezet_id', 'temakor_id', 'azonosító'], probak: ['temakor_id', 'azonosító'], hazi: ['adat', 'azonosító'] };
  Object.keys(rejt).forEach(function (k) {
    const sh = lap_(LAP[k]), H = fejlecTerkep_(sh);
    rejt[k].forEach(function (h) { if (H[h]) sh.hideColumns(H[h]); });
    if (H['Időpont']) sh.getRange(2, H['Időpont'], sh.getMaxRows() - 1, 1).setNumberFormat('yyyy.mm.dd hh:mm');
    if (H['Utolsó aktivitás']) sh.getRange(2, H['Utolsó aktivitás'], sh.getMaxRows() - 1, 1).setNumberFormat('yyyy.mm.dd hh:mm');
  });
  const m = lap_(LAP.megoldasok), MH = fejlecTerkep_(m);
  m.setColumnWidth(MH.Feladat, 380);
  titok_();
}

/** Ellenőrzi a felhasználói lapo(ka)t, és összesítést mutat. */
function ellenoriz() {
  const users = felhasznalok_();
  const keys = Object.keys(users);
  const csoport = {}, hiany = [];
  let tanar = 0;
  keys.forEach(function (k) {
    const u = users[k];
    if (!u.pass) hiany.push(u.user);
    if (u.role === 'tanar') tanar++; else csoport[u.group || '(nincs csoport)'] = (csoport[u.group || '(nincs csoport)'] || 0) + 1;
  });
  const sorok = Object.keys(csoport).sort().map(function (g) { return '  ' + g + ': ' + csoport[g] + ' diák'; });
  SpreadsheetApp.getUi().alert('Felhasználók',
    'Összesen ' + keys.length + ' felhasználó, ebből ' + tanar + ' tanár.\n\n' + sorok.join('\n') +
    (hiany.length ? '\n\nNincs jelszava (nem tud belépni): ' + hiany.join(', ') : ''),
    SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ===================== Játékszabályok (a weboldal assets/rules.js fájljával azonos) ===================== */
/*
 * Matek gyakorló – játékszabályok (cukorka, fejezetnyitás, streak).
 * UGYANEZ a kód fut a böngészőben és a Google Apps Script háttérben (Code.gs alja),
 * ezért ha módosítod, a Code.gs-be is másold át.
 *
 * Szabályok
 *  - Jó-válasz-sorozat: a témakör LEGUTOLSÓ NYITOTT fejezetében minden olyan helyes megoldás számít,
 *    amelyet a tanuló korábban még nem oldott meg, és nem nézte meg előtte a megoldást.
 *    Hibás válasz vagy a megoldás megnézése (ebben a fejezetben) nullázza a sorozatot.
 *  - Cukorka: a legutolsó nyitott fejezet MINDEN feladattípusából (ctx.tipusok[fejezet]) össze kell
 *    gyűlnie `kombo` (alapból 10) jó megoldásnak; ekkor jár 1 cukorka (témakörönkénti „pénztárcába”),
 *    és minden típus számlálója újraindul (egy típus számlálója legfeljebb `kombo`). Hibás válasz vagy a megoldás megnézése
 *    csak annak a típusnak a számlálóját nullázza. (Ha a ctx nem adja meg a típusokat: egyetlen
 *    közös számláló, a régi szabály szerint.)
 *  - A következő fejezetet a tanuló GOMBBAL nyitja meg ('nyitas' esemény), ha van elég cukorkája;
 *    a nyitás levonja az árát a pénztárcából. Az ár fejezetenként eltérhet (need[témakör][i] =
 *    az i. fejezetről továbblépés ára). Az utolsó fejezet után ugyanígy a próba-témazáró nyílik meg
 *    (unlock = fejezetek száma → a témakör teljesítve).
 *  - Kulcsok: témakör = 'évfolyam/témakör' (pl. '11/hgl'), fejezet = 'évfolyam/fejezet' (pl. '11/hatvany'),
 *    így egy tanuló több évfolyam anyagát is gyakorolhatja ütközés nélkül.
 *  - Szintek: ha a csoport beállított szintje KÖZÉP (ctx.szint[évfolyam] = 'kozep'), az emelt szintű
 *    feladat (ev.emelt) helyes megoldása 2 jó válasznak számít, és a leghátrébb álló kötelező
 *    típus számlálójához adódik; az első hibás válasz egy feladatra
 *    még nem nullázza a sorozatot, csak a második (ugyanarra a feladatra), illetve a megoldás megnézése.
 *    Az emelt szintű fejezetek ilyenkor nem részei a nyitási láncnak: ctx.kieg[fejezet] = az a láncbeli
 *    fejezet, amelyhez tartoznak; akkor gyűlik bennük cukorka, ha az a legutolsó nyitott fejezet.
 *  - Nyitási korlát: ctx.limit[témakör] = az a láncpozíció, ameddig a tanuló cukorkával nyithat
 *    (a tanár állítja, hogy ne haladjon az óra elé); a csoportnyitás ettől függetlenül érvényes.
 *  - Házi feladat ('hazi' esemény): csak a házi saját számlálóját növeli (st.hazi[azonosító]),
 *    semmilyen gyűjthető dologba (cukorka, sorozat, napi sorozat, megoldott feladatok) nem számít bele.
 *    ctx.hazi = { azonosító: { tetel: { 'fejezet|típus': db } } }
 *  - Napi sorozat (streak): az a nap számít, amelyen a tanuló legalább `streakMin` új feladatot
 *    old meg egy évfolyam legutolsó nyitott fejezetében (a `streakMin` évfolyamonként eltérhet). Ha egy nap kimarad, újraindul – KIVÉVE, ha már
 *    egyik témakörben sincs megnyitható új fejezet: ilyenkor a sorozat nem vész el.
 *
 * ctx = { order: {temakorId: [fejezetId, …]}, groupUnlock: {temakorId: index},
 *         need: {temakorId: db | [db, …]}   (tömb: i. elem = az i. fejezet utáni nyitás ára),
 *         kombo: db | {évfolyam: db, 'évfolyam/témakör': db}, streakMin: db | {évfolyam: db}, szint: {évfolyam: 'kozep'|'emelt'},
 *         kieg: {fejezetId: láncbeli fejezetId}, tipusok: {fejezetId: [feladattípus, …]}, today: 'ÉÉÉÉ-HH-NN' }
 */
var Szabalyok = (function () {
  function ujAllapot() {
    return { v: 3, ch: {}, solved: {}, unlock: {}, purse: {}, combo: {}, hiba: {}, tc: {}, hazi: {},
             streak: { cur: 0, best: 0, last: '', day: '', dayCount: 0, napi: {}, fagy: '' }, candy: 0, seen: [] };
  }

  function egesz(x, lo, hi) { var n = Math.round(Number(x)); if (!isFinite(n)) n = lo; return Math.min(hi, Math.max(lo, n)); }

  function normal(s) {
    var u = ujAllapot();
    if (!s || typeof s !== 'object') return u;
    u.v = egesz(s.v || 1, 1, 99);
    if (s.ch && typeof s.ch === 'object') {
      Object.keys(s.ch).forEach(function (k) {
        var c = s.ch[k] || {};
        u.ch[k] = { ok: egesz(c.ok, 0, 1e6), tried: egesz(c.tried, 0, 1e6), candy: egesz(c.candy, 0, 1e6) };
      });
    }
    if (s.solved && typeof s.solved === 'object') {
      Object.keys(s.solved).forEach(function (k) { if (Array.isArray(s.solved[k])) u.solved[k] = s.solved[k].map(String).slice(-3000); });
    }
    if (s.unlock && typeof s.unlock === 'object') {
      Object.keys(s.unlock).forEach(function (k) { u.unlock[k] = egesz(s.unlock[k], 0, 1000); });
    }
    ['purse', 'combo'].forEach(function (f) {
      if (s[f] && typeof s[f] === 'object') Object.keys(s[f]).forEach(function (k) { u[f][k] = egesz(s[f][k], 0, 1e6); });
    });
    if (s.tc && typeof s.tc === 'object') Object.keys(s.tc).slice(0, 100).forEach(function (m) {
      var o = s.tc[m]; if (!o || typeof o !== 'object') return;
      u.tc[m] = {}; Object.keys(o).slice(0, 60).forEach(function (g) { u.tc[m][String(g).slice(0, 60)] = egesz(o[g], 0, 1e6); });
    });
    if (s.hazi && typeof s.hazi === 'object') Object.keys(s.hazi).slice(-15).forEach(function (h) {
      var o = s.hazi[h]; if (!o || typeof o !== 'object') return;
      // a kész házinál már nem kell a megoldott feladatok listája (kisebb marad a táblázatcella)
      var x = { db: {}, s: Array.isArray(o.s) && !o.kesz ? o.s.map(String).slice(-200) : [], kesz: String(o.kesz || '') };
      if (o.db && typeof o.db === 'object') Object.keys(o.db).slice(0, 60).forEach(function (k) { x.db[String(k).slice(0, 140)] = egesz(o.db[k], 0, 1000); });
      u.hazi[String(h).slice(0, 40)] = x;
    });
    if (s.hiba && typeof s.hiba === 'object') Object.keys(s.hiba).slice(0, 100).forEach(function (k) { u.hiba[k] = String(s.hiba[k]).slice(0, 20); });
    var st = s.streak || {};
    u.streak = { cur: egesz(st.cur, 0, 1e5), best: egesz(st.best, 0, 1e5), last: String(st.last || ''), day: String(st.day || ''),
                 dayCount: egesz(st.dayCount, 0, 1e6), napi: {}, fagy: String(st.fagy || '') };
    if (st.napi && typeof st.napi === 'object') Object.keys(st.napi).slice(0, 50).forEach(function (k) { u.streak.napi[String(k)] = egesz(st.napi[k], 0, 1e6); });
    u.candy = egesz(s.candy, 0, 1e7);
    u.seen = Array.isArray(s.seen) ? s.seen.map(String).slice(-300) : [];
    return u;
  }

  /* 'ÉÉÉÉ-HH-NN' → előző nap */
  function elozoNap(key) {
    var p = String(key).split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2] - 1)).toISOString().slice(0, 10);
  }

  /* Évfolyamonként megadható érték (szám vagy {évfolyam: szám}); a témakör kulcsa 'évfolyam/témakör'. */
  function kurzusOf(mod) { return String(mod || '').split('/')[0]; }
  function evfErtek(v, mod, def) {
    if (v && typeof v === 'object') { var x = v[kurzusOf(mod)]; return x == null ? def : x; }
    return v == null ? def : v;
  }
  function kombo(ctx, mod) {
    var v = ctx.kombo;
    if (v && typeof v === 'object' && v[mod] != null) return Math.max(1, Number(v[mod]) || 10);   // témakörönként
    return Math.max(1, evfErtek(v, mod, 10) || 10);
  }
  function streakMin(ctx, mod) { return Math.max(1, evfErtek(ctx.streakMin, mod, 1) || 1); }
  /* Igaz, ha a csoport beállított szintje ebben az évfolyamban közép (az emelt feladatok külön, kedvezménnyel). */
  function kozepSzint(ctx, mod) { return evfErtek(ctx.szint, mod, '') === 'kozep'; }

  /* A témakör jelenlegi nyitási szintje (0 = csak az első fejezet nyitott; = fejezetszám → próba is). */
  function szint(st, ctx, mod) { return Math.max(st.unlock[mod] || 0, (ctx.groupUnlock && ctx.groupUnlock[mod]) || 0); }

  /* A következő nyitás ára (az i. szintről továbblépés: i+1. fejezet, ill. az utolsó után a próba). */
  function ar(ctx, mod, i) {
    var n = ctx.need && ctx.need[mod];
    if (Array.isArray(n)) { var x = n[i]; if (x == null) x = n.length ? n[n.length - 1] : 3; return Math.max(0, Number(x) || 0); }
    return n == null ? 3 : Math.max(0, Number(n) || 0);
  }

  /* Mit lehet most megnyitni: { idx, ar, eleg, proba, ch } vagy null, ha már minden nyitva. */
  function kovetkezo(st, ctx, mod) {
    var order = (ctx.order && ctx.order[mod]) || [];
    var eff = szint(st, ctx, mod);
    if (!order.length || eff >= order.length) return null;
    var a = ar(ctx, mod, eff), lim = ctx.limit && ctx.limit[mod];
    return { idx: eff + 1, ar: a, eleg: (st.purse[mod] || 0) >= a, proba: eff + 1 >= order.length, ch: eff + 1 < order.length ? order[eff + 1] : '',
             korlat: lim != null && eff + 1 > lim };   // a tanár még nem engedi ennyire előre
  }

  /* A témakör legutolsó nyitott fejezetének sorszáma (0-tól). */
  function front(st, ctx, mod) {
    var order = (ctx.order && ctx.order[mod]) || [];
    if (!order.length) return -1;
    var u = Math.max(st.unlock[mod] || 0, (ctx.groupUnlock && ctx.groupUnlock[mod]) || 0);
    return Math.min(order.length - 1, u);
  }

  /* Régi (évfolyam nélküli) kulcsok átírása 'évfolyam/…' alakra. */
  function migral(st, kurzus) {
    if (st.v >= 3) return st;
    var p = function (o) { var n = {}; Object.keys(o || {}).forEach(function (k) { n[k.indexOf('/') >= 0 ? k : kurzus + '/' + k] = o[k]; }); return n; };
    st.ch = p(st.ch); st.solved = p(st.solved); st.unlock = p(st.unlock); st.purse = p(st.purse); st.combo = p(st.combo); st.hiba = {}; st.tc = {};
    st.v = 3;
    return st;
  }

  /* Igaz, ha a témakör minden fejezete teljesítve (a próba-témazáró is megnyílt). */
  function teljesitett(st, ctx, mod) {
    var order = (ctx.order && ctx.order[mod]) || [];
    if (!order.length) return false;
    return Math.max(st.unlock[mod] || 0, (ctx.groupUnlock && ctx.groupUnlock[mod]) || 0) >= order.length;
  }

  /* Igaz, ha egyik témakörben sincs már megnyitható új fejezet. */
  function kesz(st, ctx) {
    var mods = Object.keys((ctx && ctx.order) || {}).filter(function (m) { return ctx.order[m].length; });
    if (!mods.length) return false;
    return mods.every(function (m) { return front(st, ctx, m) >= ctx.order[m].length - 1; });
  }

  /* A sorozat „fagyasztásának” kezelése (idempotens; minden feldolgozás előtt fut).
     Ha nincs új fejezet, a sorozat fagyott. Ha később új fejezet kerül a tananyagba, a fagyás
     feloldódik, és a tanulónak a felfedezés napjától számítva a szokásos idő áll rendelkezésére. */
  function frissit(st, ctx) {
    var s = st.streak, today = ctx.today;
    if (kesz(st, ctx)) { if (!s.fagy) s.fagy = today; return st; }
    if (s.fagy) {
      if (s.cur > 0 && s.last && s.last < elozoNap(today)) s.last = elozoNap(today);
      s.fagy = '';
    }
    return st;
  }

  /* Egy esemény feldolgozása. ev = { eid, kind: 'valasz'|'megoldas'|'nyitas', mod, ch, sig, ok, helped, day }
     'nyitas': a tanuló a gombbal megnyitja a következő fejezetet (ch = a megnyitandó fejezet kulcsa,
     a próbánál 'proba'); csak akkor hat, ha ez valóban a következő, és van rá elég cukorka.
     Visszaad: { dup, uj, cukorka, nyitott, ar, streak, ok, ok2, kombo, nullazva }
     ok2: 'segitseg' | 'ismert' | 'nemfront' */
  function alkalmaz(st, ev, ctx) {
    var fx = { dup: false, uj: false, cukorka: false, nyitott: null, proba: false, nyithato: null, ar: 0, streak: false, ok: !!ev.ok, ok2: '', kombo: 0, nullazva: false };
    if (ev.eid) {
      if (st.seen.indexOf(ev.eid) >= 0) { fx.dup = true; return fx; }
      st.seen.push(ev.eid);
      if (st.seen.length > 300) st.seen.splice(0, st.seen.length - 300);
    }
    if (ev.kind === 'hazi') return hazi(st, ev, ctx, fx);
    frissit(st, ctx);
    var order = (ctx.order && ctx.order[ev.mod]) || [];
    if (ev.kind === 'nyitas') {
      var kov = kovetkezo(st, ctx, ev.mod);
      if (!kov || !kov.eleg || kov.korlat || (kov.proba ? ev.ch !== 'proba' : ev.ch !== kov.ch)) return fx;
      st.unlock[ev.mod] = kov.idx;
      st.purse[ev.mod] = (st.purse[ev.mod] || 0) - kov.ar;
      st.combo[ev.mod] = 0; st.tc[ev.mod] = {};
      if (kov.proba) fx.proba = true; else fx.nyitott = kov.ch;
      fx.ar = kov.ar;
      frissit(st, ctx);
      return fx;
    }
    var idx = order.indexOf(ev.ch), f = front(st, ctx, ev.mod);
    var anchor = ctx.kieg && ctx.kieg[ev.ch];
    var frontban = f >= 0 && ((idx >= 0 && idx === f) || (idx < 0 && !!anchor && anchor === order[f]));
    var bonusz = !!ev.emelt && kozepSzint(ctx, ev.mod);
    var kb = kombo(ctx, ev.mod);
    // típusonkénti számlálás: a legutolsó nyitott fejezet kötelező feladattípusai
    var req = f >= 0 && ctx.tipusok && ctx.tipusok[order[f]];
    req = Array.isArray(req) && req.length ? req : null;
    var tc = req ? (st.tc[ev.mod] || (st.tc[ev.mod] = {})) : null;
    var cel = null;   // melyik típus számlálója érintett
    if (req && frontban) {
      if (!bonusz && req.indexOf(ev.gen) >= 0) cel = ev.gen;
      else { cel = req[0]; req.forEach(function (g) { if ((tc[g] || 0) < (tc[cel] || 0)) cel = g; }); }   // a leghátrébb álló típus
    }
    var allas = function () {
      if (req) { fx.tipus = cel; fx.kombo = cel ? (tc[cel] || 0) : 0; fx.keszTipus = req.filter(function (g) { return (tc[g] || 0) >= kb; }).length; fx.osszTipus = req.length; }
      else fx.kombo = st.combo[ev.mod] || 0;
    };
    var nullaz = function () {
      if (frontban) {
        if (req) { fx.nullazva = (tc[cel] || 0) > 0; tc[cel] = 0; }
        else { fx.nullazva = (st.combo[ev.mod] || 0) > 0; st.combo[ev.mod] = 0; }
      }
      delete st.hiba[ev.mod];
    };
    allas();
    if (ev.kind === 'megoldas') { nullaz(); allas(); return fx; }
    var c = st.ch[ev.ch] || (st.ch[ev.ch] = { ok: 0, tried: 0, candy: 0 });
    c.tried++;
    if (!ev.ok) {
      // emelt feladat közép szinten: az első hibás válasz még nem nulláz (csak a második ugyanarra a feladatra)
      if (bonusz && frontban && st.hiba[ev.mod] !== ev.sig) { st.hiba[ev.mod] = ev.sig; fx.elsoHiba = true; }
      else nullaz();
      allas(); return fx;
    }
    delete st.hiba[ev.mod];
    c.ok++;
    if (ev.helped) { fx.ok2 = 'segitseg'; return fx; }
    var list = st.solved[ev.ch] || (st.solved[ev.ch] = []);
    if (list.indexOf(ev.sig) >= 0) { fx.ok2 = 'ismert'; return fx; }
    list.push(ev.sig);
    fx.uj = true;
    if (!frontban) { fx.ok2 = 'nemfront'; return fx; }
    // napi sorozat
    var s = st.streak, day = ev.day || ctx.today;
    if (s.day && day < s.day) day = s.day;
    if (s.day !== day) { s.day = day; s.dayCount = 0; s.napi = {}; }
    s.dayCount++;
    var kid = kurzusOf(ev.mod);
    s.napi[kid] = (s.napi[kid] || 0) + 1;
    if (s.napi[kid] >= streakMin(ctx, ev.mod) && s.last !== day && (!s.last || day > s.last)) {
      s.cur = (s.last === elozoNap(day) || (s.fagy && s.cur > 0)) ? s.cur + 1 : 1;
      s.last = day;
      if (s.cur > s.best) s.best = s.cur;
      fx.streak = true;
    }
    // jó megoldások → cukorka
    fx.ertek = bonusz ? 2 : 1;   // emelt feladat közép szinten: 2 jó válasznak számít
    var kap = function () { c.candy++; st.candy++; st.purse[ev.mod] = (st.purse[ev.mod] || 0) + 1; fx.cukorka = true; fx.cukorkaDb = (fx.cukorkaDb || 0) + 1; };
    if (req) {
      if ((tc[cel] || 0) >= kb) fx.tele = true;   // ebből a típusból már megvan a szükséges szám
      tc[cel] = Math.min(kb, (tc[cel] || 0) + fx.ertek);   // egy típus számlálója legfeljebb kb (nem lehet előre gyűjteni)
      // minden típusból megvan a szükséges szám → cukorka, és minden számláló újraindul
      if (req.every(function (g) { return (tc[g] || 0) >= kb; })) { req.forEach(function (g) { tc[g] = 0; }); kap(); }
    } else {
      st.combo[ev.mod] = (st.combo[ev.mod] || 0) + fx.ertek;
      while (st.combo[ev.mod] >= kb) { st.combo[ev.mod] -= kb; kap(); }
    }
    allas();
    // a fejezetnyitás nem automatikus: jelezzük, ha már van rá elég cukorka (a gombbal nyitható)
    var kv = kovetkezo(st, ctx, ev.mod);
    if (fx.cukorka && kv && kv.eleg && !kv.korlat) fx.nyithato = kv;
    return fx;
  }

  /* Házi feladat: csak a házi számlálója változik (új, segítség nélküli helyes megoldás típusonként). */
  function hazi(st, ev, ctx, fx) {
    fx.hazi = true;
    var h = ctx.hazi && ctx.hazi[ev.hid];
    if (!h || !h.tetel) return fx;
    var k = ev.ch + '|' + ev.gen, kell = h.tetel[k];
    if (!kell) return fx;
    var x = st.hazi[ev.hid] || (st.hazi[ev.hid] = { db: {}, s: [], kesz: '' });
    fx.haziDb = x.db[k] || 0; fx.haziKell = kell;
    if (!ev.ok) return fx;
    if (ev.helped) { fx.ok2 = 'segitseg'; return fx; }
    if (x.s.indexOf(ev.sig) >= 0) { fx.ok2 = 'ismert'; return fx; }
    x.s.push(ev.sig); if (x.s.length > 200) x.s.splice(0, x.s.length - 200);
    x.db[k] = Math.min(kell, (x.db[k] || 0) + 1);
    fx.haziDb = x.db[k]; fx.uj = true;
    if (!x.kesz && Object.keys(h.tetel).every(function (t) { return (x.db[t] || 0) >= h.tetel[t]; })) { x.kesz = ev.day || ctx.today; x.s = []; fx.haziKesz = true; }
    return fx;
  }

  /* A most érvényes streak (0, ha tegnap és ma sem teljesült – kivéve, ha a sorozat fagyott). */
  function aktualisStreak(st, today, ctx) {
    var s = st.streak;
    if (s.last === today || s.last === elozoNap(today)) return s.cur;
    if (ctx) { if (kesz(st, ctx) || s.fagy) return s.cur; }
    else if (s.fagy) return s.cur;
    return 0;
  }
  /* Elkölthető cukorkák (összes témakör). */
  function penz(st) { var n = 0; Object.keys(st.purse || {}).forEach(function (k) { n += st.purse[k]; }); return n; }

  /* Ha az állapot túl nagy egy táblázatcellához, a nem aktuális fejezetek megoldáslistáit rövidíti. */
  function tomorit(st, ctx, max) {
    max = max || 40000;
    var len = JSON.stringify(st).length;
    if (len <= max) return st;
    var fronts = {};
    Object.keys(ctx.order || {}).forEach(function (m) { var f = front(st, ctx, m); if (f >= 0) fronts[ctx.order[m][f]] = true; });
    var keys = Object.keys(st.solved).sort(function (a, b) { return (fronts[a] ? 1 : 0) - (fronts[b] ? 1 : 0); });
    for (var i = 0; i < keys.length && len > max; i++) {
      var l = st.solved[keys[i]];
      if (!fronts[keys[i]]) st.solved[keys[i]] = [];
      else st.solved[keys[i]] = l.slice(Math.floor(l.length / 2));
      len = JSON.stringify(st).length;
    }
    return st;
  }

  /* Rövid, determinisztikus azonosító egy feladat szövegéből (FNV-1a, 32 bit). */
  function azonosito(str) {
    var h = 0x811c9dc5;
    str = String(str);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  return { ujAllapot: ujAllapot, normal: normal, migral: migral, elozoNap: elozoNap, front: front, teljesitett: teljesitett, kesz: kesz, frissit: frissit, alkalmaz: alkalmaz,
           aktualisStreak: aktualisStreak, ar: ar, kovetkezo: kovetkezo, szint: szint, kombo: kombo, streakMin: streakMin, kozepSzint: kozepSzint, penz: penz, tomorit: tomorit, azonosito: azonosito };
})();
if (typeof window !== 'undefined') window.Szabalyok = Szabalyok;
