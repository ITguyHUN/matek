/*
 * Matek gyakorló – játékszabályok (cukorka, fejezetnyitás, streak).
 * UGYANEZ a kód fut a böngészőben és a Google Apps Script háttérben (Code.gs alja),
 * ezért ha módosítod, a Code.gs-be is másold át.
 *
 * Szabályok
 *  - Számlálás: a témakör LEGUTOLSÓ NYITOTT fejezetében minden olyan helyes megoldás számít,
 *    amelyet a tanuló korábban még nem oldott meg, és nem nézte meg előtte a megoldást.
 *    Hibás válasz nem nulláz (nem egymás utáni jó megoldásokat, hanem új megoldott feladatokat számol).
 *  - Cukorka: a legutolsó nyitott fejezet MINDEN feladattípusából (ctx.tipusok[fejezet]) össze kell
 *    gyűlnie `kombo` (alapból 10) jó megoldásnak; ekkor jár 1 cukorka (témakörönkénti „pénztárcába”),
 *    és minden típus számlálója újraindul (egy típus számlálója legfeljebb `kombo`). Csak az ÚJ feladatok
 *    helyes megoldása számít; hibás válasz vagy a megoldás megnézése nem nulláz. (Ha a ctx nem adja meg a típusokat: egyetlen
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
 *  - Macaron: a TELJESÍTETT fejezetekben (a legutolsó nyitott előttiek, ill. a próba megnyitása után
 *    mind) típusonként gyűlik: ha egy feladattípusból újra összegyűlik `kombo` új feladat helyes
 *    megoldása, az 1 macaron (témakörönkénti „dobozba”: st.mac). Macaronnal nyílik a próba-témazáró
 *    (ctx.macar[témakör].proba), közép szintű csoportnál pedig az emelt (láncon kívüli) fejezetek is
 *    (ctx.macar[témakör].emelt; st.kiegNy[fejezet]).
 *  - Nyitási korlát: ctx.limit[témakör] = az a láncpozíció, ameddig a tanuló cukorkával nyithat
 *    (a tanár állítja, hogy ne haladjon az óra elé); a csoportnyitás ettől függetlenül érvényes.
 *  - Házi feladat ('hazi' esemény): csak a házi saját számlálóját növeli (st.hazi[azonosító]),
 *    semmilyen gyűjthető dologba (cukorka, macaron, sorozat, napi sorozat) nem számít bele.
 *    A db helyes megoldásnak EGYMÁS UTÁN kell meglennie (hibás válasz / a megoldás megnézése nulláz).
 *    Házi sorozat (st.hs): határidőre kész házi +1; ha egy házi határideje lejár, és nincs kész, nullázódik.
 *    ctx.hazi = { azonosító: { tetel: { 'fejezet|típus': db }, hatarido: 'ÉÉÉÉ-HH-NN' } }
 *  - Napi sorozat (streak): az a nap számít, amelyen a tanuló legalább `streakMin` új feladatot
 *    old meg egy témakör legutolsó nyitott fejezetében (a `streakMin` évfolyamonként / témakörönként eltérhet). Ha egy nap kimarad, újraindul – KIVÉVE, ha már
 *    egyik témakörben sincs megnyitható új fejezet: ilyenkor a sorozat nem vész el.
 *
 * ctx = { order: {temakorId: [fejezetId, …]}, groupUnlock: {temakorId: index},
 *         need: {temakorId: db | [db, …]}   (tömb: i. elem = az i. fejezet utáni nyitás ára),
 *         kombo: db | {évfolyam: db, 'évfolyam/témakör': db}, streakMin: db | {évfolyam: db}, szint: {évfolyam: 'kozep'|'emelt'},
 *         kieg: {fejezetId: láncbeli fejezetId}, tipusok: {fejezetId: [feladattípus, …]}, today: 'ÉÉÉÉ-HH-NN' }
 */
var Szabalyok = (function () {
  function ujAllapot() {
    return { v: 3, ch: {}, solved: {}, unlock: {}, purse: {}, combo: {}, hiba: {}, tc: {}, hazi: {}, mac: {}, mc: {}, kiegNy: {}, macAll: 0,
             hs: { cur: 0, best: 0, ok: [], miss: [] },
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
    ['purse', 'combo', 'mac'].forEach(function (f) {
      if (s[f] && typeof s[f] === 'object') Object.keys(s[f]).forEach(function (k) { u[f][k] = egesz(s[f][k], 0, 1e6); });
    });
    if (s.mc && typeof s.mc === 'object') Object.keys(s.mc).slice(0, 100).forEach(function (m) {
      var o = s.mc[m]; if (!o || typeof o !== 'object') return;
      u.mc[m] = {}; Object.keys(o).slice(0, 300).forEach(function (g) { u.mc[m][String(g).slice(0, 140)] = egesz(o[g], 0, 1e6); });
    });
    if (s.kiegNy && typeof s.kiegNy === 'object') Object.keys(s.kiegNy).slice(0, 300).forEach(function (k) { if (s.kiegNy[k]) u.kiegNy[String(k).slice(0, 80)] = 1; });
    u.macAll = egesz(s.macAll, 0, 1e7);
    if (s.hs && typeof s.hs === 'object') u.hs = { cur: egesz(s.hs.cur, 0, 1e5), best: egesz(s.hs.best, 0, 1e5),
      ok: Array.isArray(s.hs.ok) ? s.hs.ok.map(String).slice(-60) : [], miss: Array.isArray(s.hs.miss) ? s.hs.miss.map(String).slice(-60) : [] };
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
    if (v && typeof v === 'object') { var x = v[kurzusOf(mod)]; if (x == null) x = v['*']; return x == null ? def : x; }
    return v == null ? def : v;
  }
  function kombo(ctx, mod) {
    var v = ctx.kombo;
    if (v && typeof v === 'object' && v[mod] != null) return Math.max(1, Number(v[mod]) || 10);   // témakörönként
    return Math.max(1, evfErtek(v, mod, 10) || 10);
  }
  function streakMin(ctx, mod) {
    var v = ctx.streakMin;
    if (v && typeof v === 'object' && v[mod] != null) return Math.max(1, Number(v[mod]) || 1);   // témakörönként
    return Math.max(1, evfErtek(v, mod, 1) || 1);
  }
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

  /* Macaronár: mit = 'proba' | 'emelt' (alapból 2) */
  function macAr(ctx, mod, mit) {
    var o = ctx.macar && ctx.macar[mod], v = o && o[mit];
    return v == null ? 2 : Math.max(0, Number(v) || 0);
  }

  /* Mit lehet most megnyitni: { idx, ar, eleg, proba, ch, penz } vagy null, ha már minden nyitva.
     A fejezetek cukorkába kerülnek, a próba-témazáró macaronba (penz: 'macaron'). */
  function kovetkezo(st, ctx, mod) {
    var order = (ctx.order && ctx.order[mod]) || [];
    var eff = szint(st, ctx, mod);
    if (!order.length || eff >= order.length) return null;
    var proba = eff + 1 >= order.length, lim = ctx.limit && ctx.limit[mod];
    var a = proba ? macAr(ctx, mod, 'proba') : ar(ctx, mod, eff), van = proba ? (st.mac[mod] || 0) : (st.purse[mod] || 0);
    return { idx: eff + 1, ar: a, eleg: van >= a, proba: proba, ch: proba ? '' : order[eff + 1], penz: proba ? 'macaron' : 'cukorka',
             korlat: lim != null && eff + 1 > lim };   // a tanár még nem engedi ennyire előre
  }
  /* Közép szintű csoportnál egy emelt (láncon kívüli) fejezet: { nyitva, elerheto, ar, eleg } vagy null. */
  function kieg(st, ctx, ch) {
    var anchor = ctx.kieg && ctx.kieg[ch]; if (!anchor) return null;
    var mod = null;
    Object.keys(ctx.order || {}).forEach(function (m) { if (ctx.order[m].indexOf(anchor) >= 0) mod = m; });
    if (!mod) return null;
    var a = macAr(ctx, mod, 'emelt');
    return { mod: mod, anchor: anchor, nyitva: !!st.kiegNy[ch], elerheto: ctx.order[mod].indexOf(anchor) <= front(st, ctx, mod), ar: a, eleg: (st.mac[mod] || 0) >= a };
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
    haziSorozat(st, ctx);
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
    if (ev.kind === 'nyitas' && ctx.kieg && ctx.kieg[ev.ch]) {   // emelt fejezet macaronért (közép szint)
      var kg = kieg(st, ctx, ev.ch);
      if (!kg || kg.nyitva || !kg.elerheto || !kg.eleg) return fx;
      st.kiegNy[ev.ch] = 1; st.mac[kg.mod] = (st.mac[kg.mod] || 0) - kg.ar;
      fx.nyitott = ev.ch; fx.ar = kg.ar; fx.penz = 'macaron';
      return fx;
    }
    if (ev.kind === 'nyitas') {
      var kov = kovetkezo(st, ctx, ev.mod);
      if (!kov || !kov.eleg || kov.korlat || (kov.proba ? ev.ch !== 'proba' : ev.ch !== kov.ch)) return fx;
      st.unlock[ev.mod] = kov.idx;
      if (kov.penz === 'macaron') st.mac[ev.mod] = (st.mac[ev.mod] || 0) - kov.ar;
      else st.purse[ev.mod] = (st.purse[ev.mod] || 0) - kov.ar;
      fx.penz = kov.penz;
      st.combo[ev.mod] = 0; st.tc[ev.mod] = {};
      if (kov.proba) fx.proba = true; else fx.nyitott = kov.ch;
      fx.ar = kov.ar;
      frissit(st, ctx);
      return fx;
    }
    var idx = order.indexOf(ev.ch), f = front(st, ctx, ev.mod);
    var anchor = ctx.kieg && ctx.kieg[ev.ch];
    if (anchor && !st.kiegNy[ev.ch]) anchor = null;   // meg nem nyitott emelt fejezet: nem jár érte semmi
    var tel = order.length > 0 && szint(st, ctx, ev.mod) >= order.length;   // a próba nyitva → minden fejezet teljesítve
    var poz = idx >= 0 ? idx : (anchor ? order.indexOf(anchor) : -1);
    var frontban = f >= 0 && !tel && poz >= 0 && poz === f;
    var keszben = f >= 0 && poz >= 0 && (poz < f || (tel && poz === f));   // teljesített fejezet → macaron
    var mk = ev.ch + '|' + ev.gen, mcs = keszben ? (st.mc[ev.mod] || (st.mc[ev.mod] = {})) : null;
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
    /* A cukorka- és macaron-számlálók az ÚJ (még meg nem oldott) feladatok helyes megoldását számolják;
       hibás válasz vagy a megoldás megnézése nem nulláz (a megnézett feladat utólagos megoldása nem számít). */
    allas();
    if (ev.kind === 'megoldas') return fx;
    var c = st.ch[ev.ch] || (st.ch[ev.ch] = { ok: 0, tried: 0, candy: 0 });
    c.tried++;
    if (!ev.ok) { allas(); return fx; }
    delete st.hiba[ev.mod];
    c.ok++;
    if (ev.helped) { fx.ok2 = 'segitseg'; return fx; }
    var list = st.solved[ev.ch] || (st.solved[ev.ch] = []);
    if (list.indexOf(ev.sig) >= 0) { fx.ok2 = 'ismert'; return fx; }
    list.push(ev.sig);
    fx.uj = true;
    if (keszben) {   // teljesített fejezet: típusonként macaron
      fx.ertek = bonusz ? 2 : 1;
      mcs[mk] = (mcs[mk] || 0) + fx.ertek;
      if (mcs[mk] >= kb) { mcs[mk] = 0; st.mac[ev.mod] = (st.mac[ev.mod] || 0) + 1; st.macAll++; fx.macaron = true; }
      fx.macTipus = true; fx.kombo = mcs[mk]; fx.ok2 = 'macaron';
      var kv2 = kovetkezo(st, ctx, ev.mod);
      if (fx.macaron && kv2 && kv2.penz === 'macaron' && kv2.eleg && !kv2.korlat) fx.nyithato = kv2;
      return fx;
    }
    if (!frontban) { fx.ok2 = 'nemfront'; return fx; }
    // napi sorozat
    var s = st.streak, day = ev.day || ctx.today;
    if (s.day && day < s.day) day = s.day;
    if (s.day !== day) { s.day = day; s.dayCount = 0; s.napi = {}; }
    s.dayCount++;
    // témakörönként számol: a napi sorozathoz egy témakörben kell meglennie aznap streakMin új feladatnak
    s.napi[ev.mod] = (s.napi[ev.mod] || 0) + 1;
    if (s.napi[ev.mod] >= streakMin(ctx, ev.mod) && s.last !== day && (!s.last || day > s.last)) {
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
    haziSorozat(st, ctx);
    var x = st.hazi[ev.hid] || (st.hazi[ev.hid] = { db: {}, s: [], kesz: '' });
    fx.haziDb = x.db[k] || 0; fx.haziKell = kell;
    var kesz = (x.db[k] || 0) >= kell;
    // egymás utáni jó megoldások: hibás válasz vagy a megoldás megnézése nullázza (a már kész részt nem)
    if (!ev.ok || ev.megnez) { if (!kesz) { fx.haziNull = (x.db[k] || 0) > 0; x.db[k] = 0; fx.haziDb = 0; } return fx; }
    if (ev.helped) { fx.ok2 = 'segitseg'; return fx; }
    if (x.s.indexOf(ev.sig) >= 0) { fx.ok2 = 'ismert'; return fx; }
    x.s.push(ev.sig); if (x.s.length > 200) x.s.splice(0, x.s.length - 200);
    x.db[k] = Math.min(kell, (x.db[k] || 0) + 1);
    fx.haziDb = x.db[k]; fx.uj = true;
    if (!x.kesz && Object.keys(h.tetel).every(function (t) { return (x.db[t] || 0) >= h.tetel[t]; })) {
      x.kesz = ev.day || ctx.today; x.s = []; fx.haziKesz = true;
      // házi sorozat: határidőre kész → +1
      if ((!h.hatarido || x.kesz <= h.hatarido) && st.hs.ok.indexOf(ev.hid) < 0) {
        st.hs.ok.push(ev.hid); if (st.hs.ok.length > 60) st.hs.ok.shift();
        st.hs.cur++; if (st.hs.cur > st.hs.best) st.hs.best = st.hs.cur; fx.haziSorozat = st.hs.cur;
      }
    }
    return fx;
  }
  /* Házi sorozat: ha egy házi határideje lejárt, és nem lett kész határidőre, a sorozat nullázódik (egyszer). */
  function haziSorozat(st, ctx) {
    var today = ctx.today || '';
    Object.keys(ctx.hazi || {}).forEach(function (hid) {
      var h = ctx.hazi[hid], hd = h && h.hatarido;
      if (!hd || !today || hd >= today) return;
      var x = st.hazi[hid], idoben = x && x.kesz && x.kesz <= hd;
      if (!idoben && st.hs.miss.indexOf(hid) < 0) { st.hs.cur = 0; st.hs.miss.push(hid); if (st.hs.miss.length > 60) st.hs.miss.shift(); }
    });
    return st;
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
           aktualisStreak: aktualisStreak, ar: ar, kovetkezo: kovetkezo, kieg: kieg, macAr: macAr, haziSorozat: haziSorozat, szint: szint, kombo: kombo, streakMin: streakMin, kozepSzint: kozepSzint, penz: penz, tomorit: tomorit, azonosito: azonosito };
})();
if (typeof window !== 'undefined') window.Szabalyok = Szabalyok;
