/*
 * Matek gyakorló – játékszabályok (cukorka, fejezetnyitás, streak).
 * UGYANEZ a kód fut a böngészőben és a Google Apps Script háttérben (Code.gs alja),
 * ezért ha módosítod, a Code.gs-be is másold át.
 *
 * Szabályok
 *  - Jó-válasz-sorozat: a témakör LEGUTOLSÓ NYITOTT fejezetében minden olyan helyes megoldás számít,
 *    amelyet a tanuló korábban még nem oldott meg, és nem nézte meg előtte a megoldást.
 *    Hibás válasz vagy a megoldás megnézése (ebben a fejezetben) nullázza a sorozatot.
 *  - `kombo` (alapból 10) egymás utáni jó megoldás = 1 cukorka (témakörönkénti „pénztárcába”).
 *  - Ha a pénztárcában összegyűlik `need` cukorka, megnyílik a következő fejezet, és a nyitás
 *    levonja az árát a pénztárcából. Az utolsó fejezet után ugyanígy a próba-témazáró nyílik meg
 *    (unlock = fejezetek száma → a témakör teljesítve).
 *  - Kulcsok: témakör = 'évfolyam/témakör' (pl. '11/hgl'), fejezet = 'évfolyam/fejezet' (pl. '11/hatvany'),
 *    így egy tanuló több évfolyam anyagát is gyakorolhatja ütközés nélkül.
 *  - Napi sorozat (streak): az a nap számít, amelyen a tanuló legalább `streakMin` új feladatot
 *    old meg a legutolsó nyitott fejezetben. Ha egy nap kimarad, újraindul – KIVÉVE, ha már
 *    egyik témakörben sincs megnyitható új fejezet: ilyenkor a sorozat nem vész el.
 *
 * ctx = { order: {temakorId: [fejezetId, …]}, groupUnlock: {temakorId: index}, need: {temakorId: db},
 *         kombo: db, streakMin: db, today: 'ÉÉÉÉ-HH-NN' }
 */
var Szabalyok = (function () {
  function ujAllapot() {
    return { v: 3, ch: {}, solved: {}, unlock: {}, purse: {}, combo: {},
             streak: { cur: 0, best: 0, last: '', day: '', dayCount: 0, fagy: '' }, candy: 0, seen: [] };
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
    var st = s.streak || {};
    u.streak = { cur: egesz(st.cur, 0, 1e5), best: egesz(st.best, 0, 1e5), last: String(st.last || ''), day: String(st.day || ''),
                 dayCount: egesz(st.dayCount, 0, 1e6), fagy: String(st.fagy || '') };
    u.candy = egesz(s.candy, 0, 1e7);
    u.seen = Array.isArray(s.seen) ? s.seen.map(String).slice(-300) : [];
    return u;
  }

  /* 'ÉÉÉÉ-HH-NN' → előző nap */
  function elozoNap(key) {
    var p = String(key).split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2] - 1)).toISOString().slice(0, 10);
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
    st.ch = p(st.ch); st.solved = p(st.solved); st.unlock = p(st.unlock); st.purse = p(st.purse); st.combo = p(st.combo);
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

  /* Egy esemény feldolgozása. ev = { eid, kind: 'valasz'|'megoldas', mod, ch, sig, ok, helped, day }
     Visszaad: { dup, uj, cukorka, nyitott, ar, streak, ok, ok2, kombo, nullazva }
     ok2: 'segitseg' | 'ismert' | 'nemfront' */
  function alkalmaz(st, ev, ctx) {
    var fx = { dup: false, uj: false, cukorka: false, nyitott: null, proba: false, ar: 0, streak: false, ok: !!ev.ok, ok2: '', kombo: 0, nullazva: false };
    if (ev.eid) {
      if (st.seen.indexOf(ev.eid) >= 0) { fx.dup = true; return fx; }
      st.seen.push(ev.eid);
      if (st.seen.length > 300) st.seen.splice(0, st.seen.length - 300);
    }
    frissit(st, ctx);
    var order = (ctx.order && ctx.order[ev.mod]) || [];
    var idx = order.indexOf(ev.ch), f = front(st, ctx, ev.mod), frontban = idx >= 0 && idx === f;
    var nullaz = function () { if (frontban) { fx.nullazva = (st.combo[ev.mod] || 0) > 0; st.combo[ev.mod] = 0; } };
    fx.kombo = st.combo[ev.mod] || 0;
    if (ev.kind === 'megoldas') { nullaz(); fx.kombo = st.combo[ev.mod] || 0; return fx; }
    var c = st.ch[ev.ch] || (st.ch[ev.ch] = { ok: 0, tried: 0, candy: 0 });
    c.tried++;
    if (!ev.ok) { nullaz(); fx.kombo = st.combo[ev.mod] || 0; return fx; }
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
    if (s.day !== day) { s.day = day; s.dayCount = 0; }
    s.dayCount++;
    if (s.dayCount >= (ctx.streakMin || 1) && s.last !== day && (!s.last || day > s.last)) {
      s.cur = (s.last === elozoNap(day) || (s.fagy && s.cur > 0)) ? s.cur + 1 : 1;
      s.last = day;
      if (s.cur > s.best) s.best = s.cur;
      fx.streak = true;
    }
    // jó-válasz-sorozat → cukorka
    var kombo = ctx.kombo || 10;
    st.combo[ev.mod] = (st.combo[ev.mod] || 0) + 1;
    if (st.combo[ev.mod] >= kombo) {
      st.combo[ev.mod] = 0;
      c.candy++; st.candy++; st.purse[ev.mod] = (st.purse[ev.mod] || 0) + 1;
      fx.cukorka = true;
    }
    fx.kombo = st.combo[ev.mod];
    // fejezetnyitás (az utolsó után a próba-témazáró): a pénztárcából levonja az árát
    var need = (ctx.need && ctx.need[ev.mod]) || 3;
    var eff = Math.max(st.unlock[ev.mod] || 0, (ctx.groupUnlock && ctx.groupUnlock[ev.mod]) || 0);
    if ((st.purse[ev.mod] || 0) >= need && eff < order.length) {
      st.unlock[ev.mod] = eff + 1;
      st.purse[ev.mod] -= need;
      st.combo[ev.mod] = 0;
      if (eff + 1 < order.length) fx.nyitott = order[eff + 1]; else fx.proba = true;
      fx.ar = need;
      frissit(st, ctx);
    }
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
           aktualisStreak: aktualisStreak, penz: penz, tomorit: tomorit, azonosito: azonosito };
})();
if (typeof window !== 'undefined') window.Szabalyok = Szabalyok;
