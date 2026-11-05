/*
 * Matek gyakorló – alkalmazás
 * Betöltés → belépés → tananyag → gyakorlás (cukorka, streak) → próba → tanári felület
 */
(function () {
'use strict';

/* ===================== Alapok ===================== */
const CFG = window.BEALLITAS || {};
const ENDPOINT = String(CFG.vegpont || '').trim();
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lsGet = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
const lsSet = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const dayKey = (d = new Date()) => {
  try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); }
  catch (e) { return d.toISOString().slice(0, 10); }
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const pad2 = n => String(n).padStart(2, '0');
const stripHtml = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

const ICON = {
  candy: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 16 2.5 10.5v11zM23 16l6.5-5.5v11z" fill="currentColor" opacity=".55"/><circle cx="16" cy="16" r="8.5" fill="currentColor"/><path d="M10.5 13.2c3.2-2.4 7.6-2.4 11 .8M10.5 18.8c3.2 2.4 7.6 2.4 11-.8" stroke="var(--card)" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".75"/></svg>',
  flame: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.5c1.2 5.3 7.5 8.2 7.5 15.5a7.5 7.5 0 0 1-15 0c0-4.3 2.1-6.6 4.3-8.6 0 3 1.1 4.4 3.1 5.4-1-4.4 0-8.3.1-12.3z" fill="currentColor"/><path d="M16 29.5a4.2 4.2 0 0 1-4.2-4.2c0-2.2 1.2-3.3 3.1-5.2.1 2.1 1.1 3 2.9 3.3 1.3.9 2.4 1.9 2.4 1.9a4.2 4.2 0 0 1-4.2 4.2z" fill="var(--card)" opacity=".55"/></svg>',
  lock: '<svg viewBox="0 0 24 24" width="13" height="13" class="ico" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="13" height="13" class="ico" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function typeset(el) {
  if (window.MathJax && MathJax.typesetPromise) {
    try { MathJax.typesetClear && MathJax.typesetClear([el]); } catch (e) {}
    MathJax.typesetPromise([el]).catch(() => {});
  }
}
function toast(html, ms = 4200) {
  const box = $('#toasts'); if (!box) return;
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; box.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

/* ===================== Tananyag-betöltő ===================== */
const KURZUS_DEF = {}, FEJEZET_DEF = {}, KURZUSOK = {};
const FEJ = {};              // 'évfolyam/fejezet' → { ch, t, K }
const BETOLTESI_HIBAK = [];
window.Tananyag = {
  kurzus(def) { const s = document.currentScript; KURZUS_DEF[s ? s.dataset.kurzus : '_'] = def; },
  fejezet(def) { const s = document.currentScript; FEJEZET_DEF[s ? s.dataset.hely : '_'] = def; }
};
function script(src, data) {
  return new Promise((res, rej) => {
    const el = document.createElement('script');
    el.src = src + (CFG.verzio ? '?v=' + encodeURIComponent(CFG.verzio) : '');
    Object.assign(el.dataset, data || {});
    el.onload = () => res();
    el.onerror = () => rej(new Error('Nem található: ' + src));
    document.head.appendChild(el);
  });
}
async function betoltKurzus(id) {
  id = String(id || CFG.alapTananyag || '11');
  if (KURZUSOK[id]) return KURZUSOK[id];
  await script(`tananyag/${id}/kurzus.js`, { kurzus: id });
  const def = KURZUS_DEF[id];
  if (!def) throw new Error(`A tananyag/${id}/kurzus.js nem hívta meg a Tananyag.kurzus(…) függvényt.`);
  const szam = (v, def) => (v === '' || v == null || !isFinite(Number(v))) ? def : Math.max(0, Math.round(Number(v)));
  /* évfolyamonként felülírható szabályok (kurzus.js), különben a config.js értékei */
  const K = { id, cim: def.cim || id, alcim: def.alcim || '', jelek: def.jelek || '', alapTemakor: def.alapTemakor || '', temakorok: [], fej: {},
              kombo: Math.max(1, szam(def.joValaszCukorkahoz, CFG.joValaszCukorkahoz || 10)),
              streakMin: Math.max(1, szam(def.streakNapiMin, CFG.streakNapiMin || 1)),
              need: szam(def.cukorkaNyitashoz, szam(CFG.cukorkaNyitashoz, 3)) };
  const temak = (def.temakorok || []).filter(t => t && t.aktiv !== false);
  /* fejezet a listában: 'fajl.js' vagy { fajl: 'fajl.js', cukorka: 2 } (a cukorka = ennek a fejezetnek a nyitási ára) */
  const fajlNev = f => (f && typeof f === 'object') ? String(f.fajl || f.file || '') : String(f || '');
  await Promise.all(temak.map(t => Promise.all((t.fejezetek || []).map((f0, i) => {
    const f = fajlNev(f0);
    const hely = `${id}/${t.id}/${i}`;
    return script(`tananyag/${id}/${t.mappa ? t.mappa + '/' : ''}${f}`, { hely }).catch(e => BETOLTESI_HIBAK.push(e.message));
  }))));
  for (const t of temak) {
    const need = szam(t.cukorkaNyitashoz, K.need);
    const T = { id: t.id, key: `${id}/${t.id}`, kid: id, cim: t.cim || t.id, need,
                kombo: t.joValaszCukorkahoz != null ? Math.max(1, szam(t.joValaszCukorkahoz, K.kombo)) : 0,   // témakörönként felülírható
                probaDb: (t.proba && t.proba.feladatszam) || 12, probaAr: szam(t.proba && t.proba.cukorka, need), fejezetek: [] };
    (t.fejezetek || []).forEach((f0, i) => {
      const f = fajlNev(f0);
      const d = FEJEZET_DEF[`${id}/${t.id}/${i}`];
      if (!d) return;
      const hibak = [];
      if (!d.id) hibak.push('hiányzik az id');
      if (!d.feladatok || !Object.keys(d.feladatok).length) hibak.push('nincs egy feladattípus sem');
      if (d.id && K.fej[d.id]) hibak.push(`az id („${d.id}”) már foglalt`);
      if (hibak.length) { BETOLTESI_HIBAK.push(`${f}: ${hibak.join(', ')}`); return; }
      const ch = Object.assign({}, d, { mod: T.key, key: `${id}/${d.id}`, kid: id, fajl: f, rovid: d.rovid || d.cim, gens: Object.keys(d.feladatok) });
      /* szint: a fejezetfájlban (szint: 'emelt') vagy a kurzus.js-ben ({ fajl, szint: 'emelt' }); alapból közép */
      ch.szint = szintNorm(f0 && typeof f0 === 'object' && f0.szint ? f0.szint : d.szint, 'kozep');
      ch.genSzint = {};
      ch.gens.forEach(g => { const x = d.feladatok[g]; ch.genSzint[g] = szintNorm(x.szint || (x.emelt ? 'emelt' : ''), ch.szint); });
      ch.gensK = ch.gens.filter(g => ch.genSzint[g] === 'kozep');
      ch.gensE = ch.gens.filter(g => ch.genSzint[g] === 'emelt');
      /* igaz-hamis kérdésbank: [{ allitas, igaz, miert, szint }] vagy [{ general() { return { allitas, igaz, miert }; }, szint }] */
      ch.igazHamis = (Array.isArray(d.igazHamis) ? d.igazHamis : []).filter(Boolean).map(x => Object.assign({}, x, { szint: szintNorm(x.szint, ch.szint) }));
      ch.ihDb = szam(d.igazHamisDb, szam(def.igazHamisDb, szam(CFG.igazHamisDb, 4))) || 4;
      if (ch.szint === 'emelt' || ch.gensE.length || ch.igazHamis.some(x => x.szint === 'emelt')) K.vanEmelt = true;
      ch.ar = szam(f0 && typeof f0 === 'object' ? f0.cukorka : null, need);   // ennyibe kerül megnyitni ezt a fejezetet
      ch.idx = T.fejezetek.length;
      T.fejezetek.push(ch);
      K.fej[ch.id] = { ch, t: T };
      FEJ[ch.key] = { ch, t: T, K };
    });
    if (T.fejezetek.length) K.temakorok.push(T);
  }
  KURZUSOK[id] = K;
  return K;
}

function szintNorm(v, def) { const x = String(v || '').trim().toLowerCase(); return /^e/.test(x) ? 'emelt' : /^k/.test(x) ? 'kozep' : (def || 'kozep'); }
const SZINT_NEV = { kozep: 'közép', emelt: 'emelt' };
const szintCimke = (sz, k) => (k || K) && ((k || K).vanEmelt) ? `<span class="lvl ${sz}" title="${SZINT_NEV[sz]} szintű">${SZINT_NEV[sz]}</span>` : '';

/* Nyitási lánc egy témakörhöz. Közép szintű csoportnál az emelt fejezetek kimaradnak a láncból
   („kiegészítő” fejezetek): annál a láncbeli fejezetnél gyűlik bennük a cukorka, amely után következnek.
   → { lanc: [fejezet], poz: {kulcs: láncpozíció}, kieg: {kulcs: láncbeli fejezet kulcsa}, arak: [db] } */
const LANC_CACHE = new Map();
function lancOf(t, kozep) {
  const ck = t.key + '|' + (kozep ? 'k' : 'e');
  if (LANC_CACHE.has(ck)) return LANC_CACHE.get(ck);
  let lanc = kozep ? t.fejezetek.filter(c => c.szint !== 'emelt') : t.fejezetek.slice();
  if (!lanc.length) lanc = t.fejezetek.slice();
  const poz = {}, kieg = {};
  lanc.forEach((c, i) => { poz[c.key] = i; });
  let utolso = 0;
  t.fejezetek.forEach(c => { if (c.key in poz) utolso = poz[c.key]; else { poz[c.key] = utolso; kieg[c.key] = lanc[utolso].key; } });
  /* arak[i] = az i. láncpozícióról továbblépés ára (a következő fejezeté, az utolsó után a próbáé) */
  const arak = lanc.map((c, i) => i + 1 < lanc.length ? lanc[i + 1].ar : t.probaAr);
  const r = { lanc, poz, kieg, arak };
  LANC_CACHE.set(ck, r);
  return r;
}

/* Hivatkozások: #11/hatvany, #11/proba-hgl */
const chHref = ch => `#${ch.key}`;
const probaHref = t => `#${t.kid}/proba-${t.id}`;

/* ===================== Munkamenet és állapot ===================== */
let K = null;                 // aktuális (kiválasztott) tananyag
let KS = [];                  // a felhasználó összes betöltött tananyaga
let profile = null;           // { user, name, group, course, role }
let sess = null;              // { user, token }
let store = { state: Szabalyok.ujAllapot(), queue: [], tests: [], gu: {}, gl: {}, gk: {}, hk: [] };
let syncState = 'local';
const isTeacher = () => profile && profile.role === 'tanar';
/* Játékelemek (cukorka, sorozat, zárolás) csak bejelentkezett diáknak. */
const jatek = () => !!(ENDPOINT && sess && profile && profile.role !== 'tanar');
/* jó-válasz-sorozat hossza egy cukorkához (évfolyamonként: kurzus.js → joValaszCukorkahoz) */
/* x: témakör (objektum vagy 'évfolyam/témakör' kulcs) vagy évfolyam-azonosító; a témakör saját értéke elsőbbséget kap */
const KOMBO = x => {
  const tk = x && typeof x === 'object' ? x : (typeof x === 'string' && x.includes('/') ? KS.concat(Object.values(KURZUSOK)).map(k => k.temakorok.find(t => t.key === x)).find(Boolean) : null);
  if (tk && tk.kombo) return tk.kombo;
  const kid = tk ? tk.kid : x;
  const k = (kid && KURZUSOK[kid]) || K; return (k && k.kombo) || CFG.joValaszCukorkahoz || 10;
};
const STREAKMIN = kid => { const k = (kid && KURZUSOK[kid]) || K; return (k && k.streakMin) || CFG.streakNapiMin || 1; };
/* A csoport beállított szintje az évfolyamban: közép → az emelt feladatok külön, kedvezménnyel. */
const kozepCsop = kid => jatek() && (store.gl || {})[kid] === 'kozep';
const L = t => lancOf(t, kozepCsop(t.kid));
const lpoz = ch => L(FEJ[ch.key].t).poz[ch.key];
/* A cukorkához kötelező feladattípusok egy fejezetben: közép szintű csoportnál csak a közép típusok. */
const kotelezo = (ch, kozep) => kozep && ch.gensK.length ? ch.gensK : ch.gens;
/* Típusonkénti állás a témakör legutolsó nyitott fejezetében: { fc, req, tc, kb, kesz } */
function tipusAllas(t, st, kozep, front) {
  const fc = lancOf(t, kozep).lanc[front];
  const req = fc ? kotelezo(fc, kozep) : [], tc = (st.tc || {})[t.key] || {}, kb = KOMBO(t);
  return { fc, req, tc, kb, kesz: req.filter(g => (tc[g] || 0) >= kb).length };
}
const allasDiak = t => tipusAllas(t, store.state, kozepCsop(t.kid), frontIdx(t.key));
const kurzusCtx = (kl, kozepFn) => {
  const order = {}, need = {}, kombo = {}, streakMin = {}, kieg = {}, szint = {}, tipusok = {};
  kl.forEach(k => { kombo[k.id] = k.kombo; k.temakorok.forEach(t => { if (t.kombo) kombo[t.key] = t.kombo; }); streakMin[k.id] = k.streakMin; const kz = !!kozepFn(k.id); szint[k.id] = kz ? 'kozep' : 'emelt';
    k.temakorok.forEach(t => { const l = lancOf(t, kz); order[t.key] = l.lanc.map(c => c.key); need[t.key] = l.arak; Object.assign(kieg, l.kieg);
      l.lanc.forEach(c => { tipusok[c.key] = kotelezo(c, kz); }); }); });
  return { order, need, kombo, streakMin, kieg, szint, tipusok };
};
const storeKey = () => 'mg:adat:' + (sess ? sess.user.toLowerCase() : '_helyi');
const loadStore = () => {
  const d = lsGet(storeKey()) || {};
  store = { state: Szabalyok.migral(Szabalyok.normal(d.state), kurzusLista()[0]), queue: (d.queue || []).filter(e => String(e.mod || '').includes('/')), tests: d.tests || [], gu: d.gu || {}, gl: d.gl || {}, gk: d.gk || {}, hk: Array.isArray(d.hk) ? d.hk : [] };
};
/* A felhasználó tananyagai: profil (Tananyag oszlop, pl. „11, 10”) vagy config.js. */
function kurzusLista() {
  let l = profile && Array.isArray(profile.courses) && profile.courses.length ? profile.courses : (profile && profile.course ? [profile.course] : []);
  if (!l.length) l = Array.isArray(CFG.alapTananyag) ? CFG.alapTananyag : String(CFG.alapTananyag || '11').split(/[,;\s]+/);
  return l.map(String).filter(Boolean);
}
const saveStore = () => lsSet(storeKey(), store);
function ctx() {
  return Object.assign(kurzusCtx(KS, kozepCsop), { groupUnlock: store.gu || {}, limit: store.gk || {}, hazi: haziCtx(store.hk), today: dayKey() });
}
/* A témakör következő nyitása: { idx, ar, eleg, proba, ch } vagy null */
const kovetkezo = t => Szabalyok.kovetkezo(store.state, ctx(), t.key);
/* A cukorka felhasználása: a gombra kattintva nyílik meg a következő fejezet (vagy a próba). */
function nyit(modKey) {
  const t = KS.map(k => k.temakorok.find(x => x.key === modKey)).find(Boolean);
  if (!t || !jatek()) return;
  const kov = kovetkezo(t);
  if (!kov) return;
  if (kov.korlat) { toast(`${ICON.lock}<span>Ezt a fejezetet a tanár még nem engedte megnyitni.</span>`); return; }
  if (!kov.eleg) { toast(`${ICON.candy}<span>Ehhez ${kov.ar} cukorka kell, neked most ${store.state.purse[t.key] || 0} van.</span>`); return; }
  const fx = rogzit({ kind: 'nyitas', mod: t.key, ch: kov.proba ? 'proba' : kov.ch, sig: '', ok: false, helped: false });
  const cel = fx.nyitott && FEJ[fx.nyitott] ? chHref(FEJ[fx.nyitott].ch) : fx.proba ? probaHref(t) : '';
  if (cel && location.hash !== cel) location.hash = cel; else route();
}
/* Nyitógomb (vagy tájékoztatás, ha még nincs elég cukorka). */
function nyitasGomb(t, kov) {
  kov = kov || kovetkezo(t);
  if (!kov || !jatek()) return '';
  const cel = kov.proba ? 'Próba-témazáró' : esc(FEJ[kov.ch] ? FEJ[kov.ch].ch.rovid : '');
  const purse = store.state.purse[t.key] || 0;
  if (kov.korlat) return `<button class="btn" disabled title="A tanár még nem engedte, hogy ennyire előre haladj.">${ICON.lock} ${cel}: a tanár még nem engedte megnyitni</button>`;
  return kov.eleg
    ? `<button class="btn primary" data-nyit="${esc(t.key)}">${ICON.candy.replace('<svg', '<svg width="16" height="16" class="ico"')} Megnyitom: ${cel} (−${kov.ar} cukorka)</button>`
    : `<button class="btn" disabled title="Még ${kov.ar - purse} cukorka hiányzik">${ICON.lock} ${cel}: ${purse}/${kov.ar} cukorka</button>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-nyit]'); if (!b || b.disabled) return;
  e.preventDefault(); b.disabled = true; nyit(b.dataset.nyit);
});
const frontIdx = modKey => Szabalyok.front(store.state, ctx(), modKey);
const probaNyitva = t => !jatek() || Szabalyok.teljesitett(store.state, ctx(), t.key);
/* Kiválasztott témakör (eszközönként, felhasználónként megjegyezve). */
let aktTema = null;
const temaKey = () => 'mg:tema:' + (sess ? sess.user.toLowerCase() : '_helyi') + ':' + (K ? K.id : '');
const kurzusKey = () => 'mg:kurzus:' + (sess ? sess.user.toLowerCase() : '_helyi');
function setKurzus(id) {
  const k = KS.find(x => x.id === id); if (!k || k === K) return false;
  K = k; aktTema = null; lsSet(kurzusKey(), id); renderHeader(); return true;
}
function aktivTema() {
  if (!K || !K.temakorok.length) return null;
  let t = K.temakorok.find(x => x.id === aktTema);
  if (!t) {
    const saved = lsGet(temaKey());
    t = K.temakorok.find(x => x.id === saved) || K.temakorok.find(x => x.id === K.alapTemakor) || K.temakorok[0];
    aktTema = t.id;
  }
  return t;
}
function setTema(id) { if (aktTema === id) return; aktTema = id; lsSet(temaKey(), id); }
function chStatus(ch) {
  if (!jatek()) return 'open';
  const f = frontIdx(ch.mod), p = lpoz(ch);
  return p < f ? 'done' : p === f ? 'cur' : 'locked';
}

/* ===================== Szerver ===================== */
async function api(action, data) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 25000);
  try {
    const r = await fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(Object.assign({ action }, data)), signal: ctl.signal, redirect: 'follow' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
const auth = () => ({ user: sess.user, token: sess.token });
let syncTimer = null, syncPromise = null, dirty = false;
function setSync(s) { syncState = s; renderAcct(); }
function scheduleSync(delay = 1500) {
  if (!ENDPOINT || !sess || isTeacher()) return;
  dirty = true; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, delay);
  if (syncState !== 'saving') setSync('pending');
}
function syncNow() {
  if (!ENDPOINT || !sess || isTeacher()) return Promise.resolve();
  if (syncPromise) { dirty = true; return syncPromise; }
  clearTimeout(syncTimer); dirty = false; setSync('saving');
  const me = sess;
  const glElotte = JSON.stringify([store.gl || {}, store.gk || {}, (store.hk || []).map(h => h.id)]);
  syncPromise = (async () => {
    try {
      do {
        const events = store.queue.slice(0, 40), tests = store.tests.slice(0, 5);
        const c = ctx();
        const res = await api('sync', Object.assign(auth(), { events, tests, ctx: { order: c.order, need: c.need, kombo: c.kombo, streakMin: c.streakMin, kieg: c.kieg, tipusok: c.tipusok } }));
        if (sess !== me) return;
        if (!res.ok) { if (res.error === 'auth') return authLost(); throw new Error(res.error); }
        const sentE = new Set(events.map(e => e.eid)), sentT = new Set(tests.map(t => t.tid));
        store.queue = store.queue.filter(e => !sentE.has(e.eid));
        store.tests = store.tests.filter(t => !sentT.has(t.tid));
        store.gu = res.groupUnlock || {}; store.gl = res.groupLevel || {}; store.gk = res.groupLimit || {}; store.hk = res.hazik || [];
        store.state = Szabalyok.normal(res.state);
        const c2 = ctx();
        store.queue.forEach(e => Szabalyok.alkalmaz(store.state, e, c2));
        Szabalyok.frissit(store.state, c2);
        if (res.profile) applyProfile(res.profile);
        saveStore();
      } while ((store.queue.length || store.tests.length) && sess === me);
      setSync('saved');
      if (JSON.stringify([store.gl || {}, store.gk || {}, (store.hk || []).map(h => h.id)]) !== glElotte) route(); else refreshChrome();
    } catch (e) {
      if (sess === me) { setSync('error'); clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 30000); }
    } finally {
      syncPromise = null;
      if (dirty && sess === me && syncState !== 'error') scheduleSync(800);
    }
  })();
  return syncPromise;
}
function applyProfile(p) {
  profile = Object.assign({}, profile, p);
  if (sess) { sess.profile = profile; lsSet('mg:sess', sess); }
}
function authLost() {
  logout();
  notice = { cls: 'no', text: 'A bejelentkezésed már nem érvényes (például megváltozott a jelszó). Lépj be újra!' };
  renderLogin();
}
function logout() {
  clearTimeout(syncTimer); aktTema = null; KS = []; sess = null; profile = null; dirty = false; lsSet('mg:sess', null); setSync('local');
}
async function logoutClick() {
  if (sess && !isTeacher() && (store.queue.length || store.tests.length)) {
    const b = $('#logout'); if (b) b.textContent = 'Mentés…';
    await syncNow();
    if (store.queue.length || store.tests.length) { toast('Nem sikerült mindent elmenteni. Ellenőrizd az internetkapcsolatot, és próbáld újra.'); renderAcct(); return; }
  }
  logout(); notice = { cls: 'info', text: 'Kijelentkeztél.' }; renderLogin();
}
addEventListener('pagehide', () => {
  if (!ENDPOINT || !sess || isTeacher() || !(store.queue.length || store.tests.length)) return;
  const c = ctx();
  try { fetch(ENDPOINT, { method: 'POST', keepalive: true, body: JSON.stringify(Object.assign({ action: 'sync' }, auth(), { events: store.queue.slice(0, 40), tests: store.tests.slice(0, 5), ctx: { order: c.order, need: c.need, kombo: c.kombo, streakMin: c.streakMin, kieg: c.kieg, tipusok: c.tipusok } })) }); } catch (e) {}
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && dirty) syncNow(); });

/* ===================== Esemény → szabályok ===================== */
function rogzit(ev) {
  if (!jatek()) return { ok: ev.ok, nincsJatek: true };
  ev.eid = uid(); ev.day = dayKey();
  const fx = Szabalyok.alkalmaz(store.state, ev, ctx());
  store.queue.push(ev);
  saveStore(); scheduleSync();
  const kid = String(ev.mod || '').split('/')[0];
  if (fx.cukorka && !fx.nyithato) toast(`${ICON.candy}<span>Minden feladattípusból megvan a ${KOMBO(ev.mod)} jó megoldás: +1 cukorka!</span>`, 3500);
  if (fx.nyithato) { const n = FEJ[ev.ch]; if (n) toast(`${ICON.candy}<span>+1 cukorka! Már elég cukorkád van: ${nyitasGomb(n.t, fx.nyithato)}</span>`, 9000); }
  if (fx.streak) toast(`${ICON.flame}<span>A mai napod megvan! Napi sorozat: ${store.state.streak.cur} nap.</span>`, 4500);
  if (fx.nyitott) { const n = FEJ[fx.nyitott]; if (n) toast(`${ICON.check}<span>Megnyitottad: <a href="${chHref(n.ch)}">${esc(n.ch.cim)}</a> (−${fx.ar} cukorka)</span>`, 7000); }
  if (fx.proba) { const tt = KS.map(k => k.temakorok.find(x => x.key === ev.mod)).find(Boolean); if (tt) toast(`${ICON.check}<span>Teljesítetted a témakört! Megnyitottad a <a href="${probaHref(tt)}">próba-témazárót</a> (−${fx.ar} cukorka)</span>`, 8000); }
  refreshChrome();
  return fx;
}

/* ===================== Fejléc, menü ===================== */
let notice = null;
function renderStats() {
  const el = $('#stats');
  if (!K || !jatek()) { el.innerHTML = isTeacher() ? '<span class="stat flame off">Tanári fiók</span>' : ''; return; }
  const st = store.state, today = dayKey(), c = ctx();
  const cur = Szabalyok.aktualisStreak(st, today, c);
  const ma = st.streak.day === today ? ((st.streak.napi || {})[K.id] || 0) : 0, min = STREAKMIN(K.id);
  const done = st.streak.last === today, vedett = Szabalyok.kesz(st, c);
  const sub = done ? 'ma kész' : vedett ? 'nem vész el' : min > 1 ? `ma ${Math.min(ma, min)}/${min}` : 'ma még nincs';
  el.innerHTML = `<span class="stat candy" title="Elkölthető cukorkák (összesen eddig ${st.candy})">${ICON.candy}${Szabalyok.penz(st)}<small>cukorka</small></span>
    <span class="stat flame ${cur ? '' : 'off'}" title="Napi sorozat · legjobb: ${st.streak.best} nap${vedett ? ' · nincs új fejezet, ezért a sorozat nem vész el' : ''}">${ICON.flame}${cur}<small>nap · ${sub}</small></span>`;
}
function renderAcct() {
  const el = $('#acct'); if (!el) return;
  if (!ENDPOINT || !sess) { el.hidden = true; return; }
  el.hidden = false;
  const lab = { pending: ['mentés…', ''], saving: ['mentés…', ''], saved: ['mentve', 'ok'], error: ['nincs kapcsolat, később újrapróbálom', 'err'], local: ['', ''] }[syncState] || ['', ''];
  const grp = isTeacher() ? (!profile.group || profile.group.trim() === '*' ? 'minden csoport' : profile.group) : profile.group;
  el.innerHTML = `<span><b>${esc(profile.name)}</b>${grp ? ' · ' + esc(grp) : ''}</span>${lab[0] && !isTeacher() ? `<span class="sync ${lab[1]}">${lab[0]}</span>` : ''}<button class="linkbtn" id="logout">Kijelentkezés</button>`;
  $('#logout').onclick = logoutClick;
}
function renderToc(active) {
  const toc = $('#toc');
  if (!K) { toc.innerHTML = ''; return; }
  let h = '';
  /* tanári menü legfelül */
  if (isTeacher() || !ENDPOINT) {
    if (isTeacher()) h += `<a href="#tanar" class="tmenu" ${active === 'tanar' ? 'aria-current="page"' : ''}><span class="n">★</span><span>Tanári felület</span><span></span></a>`;
    h += `<a href="#dolgozat" class="tmenu" ${active === 'dolgozat' ? 'aria-current="page"' : ''}><span class="n">✎</span><span>Dolgozatkészítő</span><span></span></a><div class="sep"></div>`;
  }
  const hk = jatek() ? diakHazik() : [];
  if (hk.length) { const nyitott = hk.filter(h => !haziAllas(h).kesz).length;
    h += `<a href="#hazi" class="tmenu hazimenu" ${String(active).startsWith('hazi') ? 'aria-current="page"' : ''}><span class="n">✍</span><span>Házi feladat</span><span class="p ${hk.some(lejartHazi) ? 'hzpiros' : nyitott ? 'cur' : 'done'}">${nyitott ? nyitott : ICON.check}</span></a><div class="sep"></div>`; }
  h += `<a href="#start" ${active === 'start' ? 'aria-current="page"' : ''}><span class="n">◦</span><span>Kezdőlap</span><span></span></a>`;
  const tt = aktivTema();
  if (KS.length > 1) h += `<a href="#start" class="modsw" title="Évfolyam váltása a kezdőlapon"><span class="n">⇄</span><span>${esc(K.cim)}</span><span class="p">váltás</span></a>`;
  for (const t of tt ? [tt] : []) {
    h += K.temakorok.length > 1
      ? `<a href="#start" class="modsw" title="Témakör váltása a kezdőlapon"><span class="n">⇄</span><span>${esc(t.cim)}</span><span class="p">váltás</span></a>`
      : `<div class="mod">${esc(t.cim)}</div>`;
    for (const c of t.fejezetek) {
      const s = chStatus(c), pn = probaNyitva(t) && jatek();
      const right = s === 'locked' ? ICON.lock : s === 'done' || (s === 'cur' && pn) ? `<span class="p done">${ICON.check}</span>` : s === 'cur' ? (a => `<span class="p cur" title="kész feladattípusok (mindegyikből ${a.kb} jó megoldás kell)">${a.kesz}/${a.req.length}</span>`)(allasDiak(t)) : '<span></span>';
      h += `<a href="${chHref(c)}" class="${s === 'locked' ? 'locked' : ''}" ${active === c.key ? 'aria-current="page"' : ''}><span class="n">${pad2(c.idx + 1)}</span><span>${esc(c.rovid)}${c.szint === 'emelt' && K.vanEmelt ? ' <span class="lvl emelt sm" title="emelt szintű">E</span>' : ''}</span>${right}</a>`;
    }
    const pk = `${t.kid}/proba-${t.id}`, pOpen = probaNyitva(t);
    h += `<a href="${probaHref(t)}" class="${pOpen ? '' : 'locked'}" ${active === pk ? 'aria-current="page"' : ''}><span class="n">✎</span><span>Próba-témazáró</span>${pOpen ? '<span></span>' : ICON.lock}</a>`;
  }
  toc.innerHTML = h;
  const cur = toc.querySelector('[aria-current="page"]'); if (cur && window.innerWidth < 880) cur.scrollIntoView({ inline: 'center', block: 'nearest' });
}
function renderHeader() {
  $('#apptitle').textContent = K ? K.cim : (CFG.cim || 'Matek gyakorló');
  $('#appsub').textContent = K ? [K.alcim, CFG.cim].filter(Boolean).join(' · ') : '';
  if (K && K.jelek && $('#strip')) $('#strip').textContent = K.jelek;   // a fejléc jelsora tananyagonként (kurzus.js: jelek)
  document.title = K ? `${K.cim} – ${CFG.cim || 'Matek gyakorló'}` : (CFG.cim || 'Matek gyakorló');
}
function refreshChrome() {
  renderStats(); renderAcct(); renderToc(currentId());
  const m = $('#meter'); if (m && m.dataset.ch && FEJ[m.dataset.ch]) m.outerHTML = meterHtml(FEJ[m.dataset.ch].ch);
  const ks = $('#kurzusok'); if (ks) ks.innerHTML = kurzusValaszto();
  const hc = $('#homecards'); if (hc) hc.innerHTML = homeCards();
  const tp = $('#topics'); if (tp) tp.innerHTML = temaValaszto();
}

/* ===================== Belépés ===================== */
function renderLogin() {
  K = null; renderHeader(); renderStats(); renderAcct(); renderToc();
  $('#layout').classList.add('solo');
  const m = $('#main');
  m.innerHTML = `<div class="loginpage">
    <div><div class="eyebrow">${esc(CFG.cim || 'Matek gyakorló')}</div><h2 class="ch">Belépés</h2>
    <p class="small">A felhasználónevet és a jelszót a tanárodtól kapod.</p></div>
    ${notice ? `<div class="fb ${notice.cls}" role="status">${esc(notice.text)}</div>` : ''}
    <form id="lg-form" novalidate>
      <label for="lg-user">Felhasználónév<input id="lg-user" autocomplete="username" autocapitalize="off" spellcheck="false" maxlength="60"></label>
      <label for="lg-pass">Jelszó<input id="lg-pass" type="password" autocomplete="current-password" maxlength="60"></label>
      <button class="btn primary" type="submit" id="lg-go">Belépés</button>
    </form>
    <div class="fb" id="lg-msg" hidden></div>
  </div>`;
  notice = null;
  const msg = (cls, t) => { const x = $('#lg-msg'); x.hidden = false; x.className = 'fb ' + cls; x.textContent = t; };
  const ERR = { hibas: 'Hibás felhasználónév vagy jelszó.', zarolt: 'Túl sok sikertelen próbálkozás. Várj 15 percet, vagy szólj a tanárnak.', busy: 'A szerver éppen foglalt, próbáld újra pár másodperc múlva.' };
  $('#lg-form').onsubmit = async e => {
    e.preventDefault();
    const user = $('#lg-user').value.trim(), pass = $('#lg-pass').value;
    if (!user || !pass) return msg('no', 'Add meg a felhasználónevet és a jelszót.');
    const b = $('#lg-go'); b.disabled = true; b.textContent = 'Belépés…';
    try {
      const res = await api('login', { user, pass });
      if (!res.ok) { msg('no', ERR[res.error] || 'Nem sikerült belépni.'); return; }
      sess = { user: res.profile.user, token: res.token, profile: res.profile };
      profile = res.profile; lsSet('mg:sess', sess);
      loadStore();
      const serverState = Szabalyok.normal(res.state);
      store.gu = res.groupUnlock || {}; store.gl = res.groupLevel || {}; store.gk = res.groupLimit || {}; store.hk = res.hazik || [];
      store.state = serverState;
      await startCourse();
      store.queue.forEach(ev => Szabalyok.alkalmaz(store.state, ev, ctx()));
      Szabalyok.frissit(store.state, ctx());
      saveStore(); refreshChrome();
      if (store.queue.length || store.tests.length) scheduleSync(300); else setSync('saved');
      toast(`Szia, ${esc(profile.name)}!`, 2500);
    } catch (err) {
      msg('no', err && /Nem található|kurzus/.test(err.message) ? err.message : 'Nem sikerült elérni a szervert. Ellenőrizd az internetkapcsolatot.');
    } finally { if (document.body.contains(b)) { b.disabled = false; b.textContent = 'Belépés'; } }
  };
  if (!('ontouchstart' in window)) $('#lg-user').focus();
}

/* ===================== Kezdőlap ===================== */
function kurzusValaszto() {
  if (KS.length < 2) return '';
  return `<section class="blk"><h3>Évfolyam <span class="tag">gyakorolhatsz más évfolyam anyagából is</span></h3><div class="chips" role="group" aria-label="Évfolyam választása">${KS.map(k =>
    `<button class="chip" data-evf="${esc(k.id)}" aria-pressed="${k === K}">${esc(k.cim)}</button>`).join('')}</div></section>`;
}
function temaInfo(t) {
  if (!jatek()) return `${t.fejezetek.length} fejezet`;
  if (Szabalyok.teljesitett(store.state, ctx(), t.key)) return `${ICON.check} teljesítve · ${store.state.purse[t.key] || 0} cukorka`;
  return `${frontIdx(t.key) + 1}/${L(t).lanc.length} fejezet nyitva · ${store.state.purse[t.key] || 0} cukorka`;
}
function temaValaszto() {
  if (K.temakorok.length < 2) return '';
  const akt = aktivTema();
  return `<section class="blk"><h3>Témakörök <span class="tag">válassz</span></h3><div class="topics" role="group" aria-label="Témakör választása">${K.temakorok.map(t => {
    const info = temaInfo(t);
    return `<button class="tcard" data-tema="${esc(t.id)}" aria-pressed="${t.id === akt.id}"><strong>${esc(t.cim)}</strong><span class="d">${info}</span></button>`;
  }).join('')}</div></section>`;
}
function homeCards() {
  const akt = aktivTema();
  return (akt ? [akt] : []).map(t => {
    const pn = probaNyitva(t);
    const cards = t.fejezetek.map(c => {
      const s = chStatus(c);
      const d = s === 'locked' ? `${ICON.lock} zárva` : s === 'done' || (s === 'cur' && jatek() && pn) ? `${ICON.check} teljesítve` : s === 'cur' ? `${ICON.candy.replace('<svg', '<svg width="15" height="15" class="ico"')} itt gyűlik a cukorka` : `${c.gens.length} feladattípus`;
      return `<a class="ccard" href="${chHref(c)}"${s === 'locked' ? ' style="opacity:.6"' : ''}><span class="n">${pad2(c.idx + 1)} ${c.szint === 'emelt' ? szintCimke('emelt') : ''}</span><strong>${esc(c.cim)}</strong><span class="d">${d}</span></a>`;
    }).join('');
    return `<section class="blk"><h3>${K.temakorok.length > 1 ? 'Fejezetek: ' : ''}${esc(t.cim)} <span class="tag">${temaInfo(t).replace(/<svg[\s\S]*?<\/svg>\s*/, '')}</span></h3>
      <div class="cards">${cards}<a class="ccard test" href="${probaHref(t)}"${pn ? '' : ' style="opacity:.6"'}><span class="n">${t.probaDb} feladat</span><strong>Próba-témazáró</strong><span class="d">${pn ? 'A témakör összes fejezetéből' : `${ICON.lock} minden fejezet teljesítése után nyílik meg`}</span></a></div></section>`;
  }).join('');
}
function renderHome() {
  const m = $('#main');
  const akt = aktivTema();
  const kov = akt && jatek() ? kovetkezo(akt) : null;
  const need = kov ? kov.ar : akt ? akt.need : K.need, min = STREAKMIN(K.id), kombo = akt ? KOMBO(akt) : KOMBO(K.id);
  const arak = akt ? [...new Set(akt.arak)] : [need];
  m.innerHTML = `<div class="eyebrow">${esc(K.alcim || '')}</div>
    <h2 class="ch">${profile && profile.name ? `Szia, ${esc(profile.name.split(' ').slice(-1)[0])}!` : 'Gyakoroljunk!'}</h2>
    ${notice ? `<div class="fb ${notice.cls} notice" role="status">${esc(notice.text)}</div>` : ''}
    ${BETOLTESI_HIBAK.length && isTeacher() || BETOLTESI_HIBAK.length && !ENDPOINT ? `<div class="fb no"><b>Tananyag-betöltési hibák:</b><br>${BETOLTESI_HIBAK.map(esc).join('<br>')}</div>` : ''}
    ${isTeacher() ? `<p class="lead">Tanári fiókkal minden fejezet nyitva van, és a gyakorlásod nem kerül a statisztikába. A diákok eredményeit a <a href="#tanar">Tanári felületen</a> látod.</p>` : ''}
    ${haziKartyak()}
    <div id="kurzusok">${kurzusValaszto()}</div>
    <div id="topics">${temaValaszto()}</div>
    <div id="homecards">${homeCards()}</div>
    ${kov && kov.eleg && !kov.korlat ? `<div class="ansrow">${nyitasGomb(akt, kov)}</div>` : ''}
    ${jatek() ? `<section class="blk"><h3>Így működik</h3><div class="how">
        <div><b>${ICON.candy.replace('<svg', '<svg width="18" height="18" class="ico" style="color:var(--candy)"')} Cukorka</b><span>A legutolsó nyitott fejezetben akkor kapsz egy cukorkát, ha a fejezet <b>minden feladattípusából</b> összegyűlt ${kombo} jó megoldás. Csak a még meg nem oldott feladatok számítanak; hibás válasz vagy a megoldás megnézése annak a típusnak a számlálóját nullázza.</span></div>
        <div><b>${ICON.check} Fejezetnyitás</b><span>Ha összegyűlt elég cukorkád, a <b>Megnyitom</b> gombbal nyithatod meg a következő fejezetet; az ára le is jön a számládról. ${arak.length > 1 ? `Fejezetenként ${Math.min(...arak)}–${Math.max(...arak)} cukorkába kerül, a következő ${need} cukorka.` : `Egy fejezet ${need} cukorkába kerül.`} A már teljesített fejezetekben bármikor gyakorolhatsz, de ott nem jár cukorka.</span></div>
        <div><b>${ICON.flame.replace('<svg', '<svg width="18" height="18" class="ico" style="color:var(--flame)"')} Napi sorozat</b><span>Ha egy nap legalább ${min === 1 ? 'egy' : min} új feladatot megoldasz a legutolsó nyitott fejezetben, nő a sorozatod. Ha kihagysz egy napot, újraindul; ha viszont már nincs megnyitható új fejezet, nem vész el.</span></div></div></section>` : ''}
    ${!ENDPOINT ? `<div class="foot"><span>Helyi mód (nincs beállítva szerver): belépés, cukorka és napi sorozat nélkül.</span></div>` : ''}`;
  notice = null;
  const ks = $('#kurzusok');
  if (ks) ks.onclick = e => {
    const b = e.target.closest('[data-evf]'); if (!b) return;
    if (setKurzus(b.dataset.evf)) route();
  };
  const tp = $('#topics');
  if (tp) tp.onclick = e => {
    const b = e.target.closest('[data-tema]'); if (!b) return;
    setTema(b.dataset.tema);
    tp.innerHTML = temaValaszto(); $('#homecards').innerHTML = homeCards(); renderToc('start');
  };
}

/* ===================== Fejezet ===================== */
function meterHtml(ch) {
  if (isTeacher()) return `<div class="meter" id="meter" data-ch="${ch.id}"><div class="row"><b>Tanári nézet</b><span class="small">A gyakorlófeladatoknál látod a helyes választ is.</span></div></div>`;
  if (!jatek()) return '';
  const t = FEJ[ch.key].t, s = chStatus(ch), st = store.state;
  const f = frontIdx(ch.mod), frontCh = L(t).lanc[f];
  const next = L(t).lanc[lpoz(ch) + 1];
  if (s === 'done') return `<div class="meter done" id="meter" data-ch="${ch.key}"><div class="row"><b>${ICON.check} Teljesítetted ezt a fejezetet</b>
    <span class="small">Itt bármikor gyakorolhatsz, de cukorka most a(z) <a href="${chHref(frontCh)}">${esc(frontCh.rovid)}</a> fejezetben jár.</span></div></div>`;
  const purse = st.purse[t.key] || 0, kesz = probaNyitva(t);
  const kov = kovetkezo(t), ar = kov ? kov.ar : 0, A = allasDiak(t);
  const tipusok = A.req.map(g => { const n = Math.min(A.kb, A.tc[g] || 0), ok = n >= A.kb;
    return `<span class="tip${ok ? ' ok' : ''}" title="${esc(A.fc.feladatok[g].nev || g)}: ${n}/${A.kb}"><span class="tn">${ok ? ICON.check + ' ' : ''}${esc(A.fc.feladatok[g].nev || g)}</span><span class="tb"><span style="width:${Math.round(100 * n / A.kb)}%"></span></span><span class="tv">${n}/${A.kb}</span></span>`; }).join('');
  const icons = !kesz && ar <= 30 ? Array.from({ length: Math.max(ar, Math.min(purse, 30)) }, (_, i) => ICON.candy.replace('<svg', `<svg${i < purse ? '' : ' class="empty"'} style="color:var(--candy)"`)).join('') : '';
  const txt = kesz ? `Cukorkáid: <b>${purse}</b> · ${ICON.check} Teljesítetted a témakört, a <a href="${probaHref(t)}">próba-témazáró</a> nyitva. Itt tovább gyűjtheted a cukorkát.`
    : next ? `Cukorkáid: <b>${purse}</b> · ${ar} cukorkáért megnyithatod: <b>${esc(next.rovid)}</b>`
    : `Cukorkáid: <b>${purse}</b> · Ez az utolsó fejezet: ${ar} cukorkáért megnyithatod a <b>próba-témazárót</b>.`;
  return `<div class="meter" id="meter" data-ch="${ch.key}">
    <div class="row"><b>Egy cukorkához mindegyik feladattípusból ${A.kb} jó megoldás kell · kész: ${A.kesz}/${A.req.length}</b><span class="small">Hibás válasz vagy a megoldás megnézése csak annak a típusnak a számlálóját nullázza.</span></div>
    <div class="tipusok">${tipusok}</div>
    <div class="row"><span>${txt}</span><span class="candies" aria-hidden="true">${icons}</span></div>
    ${kov ? `<div class="row">${nyitasGomb(t, kov)}</div>` : ''}</div>`;
}
function renderLocked(ch) {
  const t = FEJ[ch.key].t, f = frontIdx(ch.mod), fc = L(t).lanc[f], kov = lpoz(ch) === f + 1 && !L(t).kieg[ch.key];
  $('#main').innerHTML = `<div class="eyebrow">${pad2(ch.idx + 1)}. fejezet · ${esc(t.cim)}</div><h2 class="ch">${esc(ch.cim)}</h2>
    <div class="lockbox">${ICON.lock.replace('width="13" height="13"', 'width="34" height="34"')}
    <p class="lead">Ez a fejezet még zárva van. Gyűjts cukorkát a legutolsó nyitott fejezetben (<b>${esc(fc.cim)}</b>), és a cukorkáiddal sorban megnyithatod a következőket.${kov ? ` Ennek a fejezetnek az ára: <b>${ch.ar} cukorka</b>.` : ''}${L(t).kieg[ch.key] ? ` Ez egy <b>emelt szintű</b> kiegészítő fejezet: akkor nyílik meg, amikor a(z) <b>${esc(FEJ[L(t).kieg[ch.key]].ch.rovid)}</b> fejezetet megnyitod.` : ''}</p>
    <div class="ansrow">${kov ? nyitasGomb(t) : ''}<a class="btn${kov ? '' : ' primary'}" href="${chHref(fc)}">Tovább: ${esc(fc.rovid)} →</a></div></div>`;
}
function renderChapter(ch) {
  if (chStatus(ch) === 'locked') return renderLocked(ch);
  const t = FEJ[ch.key].t, next = t.fejezetek[ch.idx + 1];
  const m = $('#main');
  m.innerHTML = `<div class="eyebrow">${pad2(ch.idx + 1)}. fejezet · ${esc(t.cim)}</div>
   <h2 class="ch">${esc(ch.cim)} ${ch.szint === 'emelt' ? szintCimke('emelt', FEJ[ch.key].K) : ''}</h2>${ch.bevezeto ? `<p class="lead">${ch.bevezeto}</p>` : ''}
   ${meterHtml(ch)}
   ${ch.elmelet ? `<section class="blk"><h3>Elmélet</h3>${ch.elmelet}</section>` : ''}
   ${ch.igazHamis.length ? `<section class="blk"><h3>Igaz vagy hamis? <span class="tag">tipikus hibák</span></h3><div id="tf"></div></section>` : ''}
   ${ch.mintapelda ? `<section class="blk"><h3>Mintapélda</h3><div class="task prose">${ch.mintapelda.feladat}</div><ol class="steps" id="steps"></ol>
     <div class="ansrow"><button class="btn" id="stepn">Következő lépés</button><button class="btn ghost" id="stepall">Mind látszódjon</button></div></section>` : ''}
   ${ch.grafikon ? `<section class="blk"><h3>${esc(ch.grafikonCim || 'Grafikonrajzoló')} <span class="tag">${esc(ch.grafikonTag || 'kísérletezz')}</span></h3><div id="plot"></div></section>` : ''}
   ${gyakorlasHtml(ch)}
   <div class="foot">${next ? `<a class="btn" href="${chHref(next)}">${chStatus(next) === 'locked' ? ICON.lock + ' ' : ''}Tovább: ${esc(next.rovid)} →</a>` : `<a class="btn primary" href="${probaHref(t)}">${probaNyitva(t) ? '' : ICON.lock + ' '}Próba-témazáró →</a>`}</div>`;
  if (ch.igazHamis.length) igazHamisBank($('#tf'), ch);
  if (ch.mintapelda) {
    const lep = ch.mintapelda.lepesek || [];
    let shown = 0; const st = $('#steps');
    const showStep = () => {
      if (shown >= lep.length) return;
      const li = document.createElement('li'); li.innerHTML = `<div>${lep[shown++]}</div>`; st.appendChild(li); typeset(li);
      if (shown >= lep.length) { $('#stepn').disabled = true; $('#stepall').disabled = true; }
    };
    showStep();
    $('#stepn').onclick = showStep; $('#stepall').onclick = () => { while (shown < lep.length) showStep(); };
  }
  if (ch.grafikon) {
    if (typeof ch.grafikon === 'function') { try { ch.grafikon($('#plot')); } catch (e) { $('#plot').textContent = 'Hiba az interaktív elemben: ' + e.message; } }
    else makePlotter($('#plot'), ch.grafikon);
  }
  gyakorlasIndit(ch);
  typeset(m);
}

/* ===================== Igaz vagy hamis – kérdésbank ===================== */
/* Minden megnyitáskor (és az „Új kérdések” gombra) véletlenszerűen húz `igazHamisDb` darabot a bankból.
   Közép szintű csoportnál az emelt szintű állítások külön, alatta jelennek meg. */
function igazHamisBank(box, ch) {
  const K0 = FEJ[ch.key].K, kz = kozepCsop(ch.kid);
  const csoportok = kz
    ? [{ cim: '', lista: ch.igazHamis.filter(x => x.szint !== 'emelt') }, { cim: 'Nehezebb állítások <span class="lvl emelt">emelt</span>', lista: ch.igazHamis.filter(x => x.szint === 'emelt') }].filter(g => g.lista.length)
    : [{ cim: '', lista: ch.igazHamis }];
  const huz = lista => {
    const idx = lista.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx.slice(0, Math.min(ch.ihDb, idx.length)).map(i => {
      const x = lista[i];
      if (typeof x.general === 'function') { try { return Object.assign({ szint: x.szint }, x.general.call(x)); } catch (e) { return null; } }
      return x;
    }).filter(y => y && y.allitas);
  };
  let aktiv = [];
  const rajzol = () => {
    aktiv = [];
    box.innerHTML = csoportok.map((g, gi) => {
      const elemek = huz(g.lista);
      return `${g.cim ? `<h4 class="sub">${g.cim}</h4>` : ''}<div class="tf">${elemek.map(x => { const i = aktiv.push(x) - 1;
        return `<div class="tfc" data-tfc="${i}"><div class="st">${!kz ? szintCimke(x.szint, K0) + ' ' : ''}${x.allitas}</div><div class="btns"><button class="btn sm" data-i="${i}" data-v="1">Igaz</button><button class="btn sm" data-i="${i}" data-v="0">Hamis</button></div><div class="why" hidden></div></div>`; }).join('')}</div>`;
    }).join('') + (csoportok.some(g => g.lista.length > ch.ihDb || g.lista.some(x => typeof x.general === 'function'))
      ? `<div class="ansrow" style="margin-top:10px"><button class="btn ghost" data-tfuj>Új kérdések</button><span class="small">${ch.igazHamis.length} állítás a kérdésbankban</span></div>` : '');
    typeset(box);
  };
  box.onclick = e => {
    if (e.target.closest('[data-tfuj]')) { rajzol(); return; }
    const b = e.target.closest('button[data-i]'); if (!b) return;
    const x = aktiv[+b.dataset.i], card = box.querySelector(`[data-tfc="${b.dataset.i}"]`);
    const right = (b.dataset.v === '1') === !!x.igaz; card.className = 'tfc ' + (right ? 'ok' : 'no');
    const w = card.querySelector('.why'); w.hidden = false; w.innerHTML = `<b>${right ? 'Eltaláltad' : 'Nem talált'}: az állítás ${x.igaz ? 'igaz' : 'hamis'}.</b>${x.miert || ''}`; typeset(w);
  };
  rajzol();
}

/* ===================== Gyakorlás: szintek szerinti felület ===================== */
/* Közép szintű csoport: a közép feladatok fent, az emelt feladatok külön, alatta (kedvezményes szabályokkal).
   Minden más esetben (emelt szintű csoport, tanár, helyi mód) egy felületen az összes feladat. */
function gyakorlasReszek(ch) {
  if (kozepCsop(ch.kid) && ch.gensE.length) {
    const r = [];
    if (ch.gensK.length) r.push({ id: 'pr', gens: ch.gensK, emeltResz: false });
    r.push({ id: 'pre', gens: ch.gensE, emeltResz: true });
    return r;
  }
  return [{ id: 'pr', gens: ch.gens, emeltResz: false }];
}
function gyakorlasHtml(ch) {
  return gyakorlasReszek(ch).map(r => r.emeltResz
    ? `<section class="blk emeltresz"><h3>Nehezebb feladatok <span class="lvl emelt">emelt</span> <span class="tag">nem kötelező</span></h3>
       <p class="small">Itt egy jó megoldás <b>kettőt ér</b> a sorozatban. Egy hibás válasz még nem nullázza a sorozatot, csak ha ugyanarra a feladatra másodszor is hibázol, vagy ha megnézed a megoldást.</p>
       <div class="practice" id="${r.id}"></div></section>`
    : `<section class="blk"><h3>Gyakorlás</h3><div class="practice" id="${r.id}"></div></section>`).join('');
}
function gyakorlasIndit(ch) {
  gyakorlasReszek(ch).forEach(r => makePractice($('#' + r.id), ch, r));
}

/* ===================== Gyakorlás ===================== */
function feladatKeszit(ch, gid) {
  const g = ch.feladatok[gid];
  const p = (g.general || g.make).call(g);
  const sig = Szabalyok.azonosito(ch.id + '/' + gid + '|' + p.kerdes);
  return { gid, g, p, sig };
}
function fbText(res) {
  if (res.rossz) return 'Ezt nem tudom számként értelmezni. Törtet így írj: 3/2, tizedest így: 1,5, több megoldást pontosvesszővel: 1; 2.';
  if (res.forma === 'tizedes') return 'Az érték jó, de <b>tizedes tört alakban</b> kérjük (pl. 0,375).';
  if (res.forma === 'tort') return 'Az érték jó, de <b>tört alakban</b> kérjük (pl. 3/8).';
  if (res.forma === 'egyszerusit') return 'Az érték jó, de <b>egyszerűsítsd</b> tovább a törtet!';
  if (res.darab) return res.kell > res.van ? `Nem jó, vagy hiányzik megoldás: ennek a feladatnak ${res.kell} megoldása van.` : `Túl sok megoldást adtál meg: ennek a feladatnak ${res.kell} megoldása van.`;
  return 'Nem jó. Próbáld újra, vagy kérj tippet!';
}
function makePractice(box, ch, resz) {
  resz = resz || { id: 'pr', gens: ch.gens, emeltResz: false };
  const gens = resz.gens, K0 = FEJ[ch.key].K, mutatSzint = K0.vanEmelt && !resz.emeltResz && !kozepCsop(ch.kid);
  let gid = 'mix', cur = null, solved = false, revealed = false;
  box.innerHTML = `<div class="chips" role="group" aria-label="Feladattípus" ${gens.length === 1 && resz.hazi ? 'hidden' : ''}><button class="chip" data-g="mix" aria-pressed="true">Vegyes</button>${gens.map(g => `<button class="chip" data-g="${esc(g)}" aria-pressed="false">${esc(ch.feladatok[g].nev || g)}</button>`).join('')}</div>
   <div class="prob" id="q" aria-live="polite"></div>
   <div id="inp"></div>
   <div class="fb" id="fb" hidden></div>
   <div class="ansrow"><button class="btn ghost" id="hint">Tipp</button><button class="btn ghost" id="solb">Megoldás</button><button class="btn" id="newp">Új feladat</button></div>
   <div class="solbox" id="sol" hidden></div>`;
  const chips = box.querySelector('.chips');
  chips.onclick = e => { const b = e.target.closest('.chip'); if (!b) return; gid = b.dataset.g; chips.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); newProblem(); };
  const fb = (cls, html) => { const f = $('#fb', box); f.hidden = false; f.className = 'fb ' + cls; f.innerHTML = html; typeset(f); };
  const event = (kind, ok, a) => ({
    kind: resz.hazi ? 'hazi' : kind, hid: resz.hazi || undefined, ok, helped: revealed, emelt: ch.genSzint[cur.gid] === 'emelt', mod: ch.mod, modCim: `${FEJ[ch.key].K.cim} · ${FEJ[ch.key].t.cim}`, ch: ch.key, chCim: ch.cim, gen: cur.gid, genNev: cur.g.nev || cur.gid, sig: cur.sig,
    q: stripHtml(cur.p.kerdes).slice(0, 600), a: String(a == null ? '' : a).slice(0, 120), helyes: valaszSzoveg(cur.p.valasz)
  });
  function submit(ok, a, rawRes) {
    if (solved) return;
    const fx = rogzit(event('valasz', ok, a));
    if (resz.hazi) {   // házi feladat: csak a házi számlálója változik
      if (!ok) { fb('no', rawRes ? fbText(rawRes) : 'Nem jó. Gondold végig még egyszer, vagy kérj tippet!'); return; }
      solved = true;
      fb('ok', fx.nincsJatek ? 'Helyes!' : fx.haziKesz ? `Helyes! ${ICON.check} <b>A házi feladat kész!</b>`
        : fx.ok2 === 'segitseg' ? 'Helyes, de mivel előtte megnézted a megoldást, ez nem számít bele a házi feladatba.'
        : fx.ok2 === 'ismert' ? 'Helyes! Ezt a feladatot már megoldottad, nem számít újra.'
        : fx.haziKell ? `Helyes! Házi: ${fx.haziDb}/${fx.haziKell}${fx.haziDb >= fx.haziKell ? ' – ez a rész kész.' : '.'}` : 'Helyes!');
      if (resz.frissit) resz.frissit();
      return;
    }
    if (!ok) { fb('no', (rawRes ? fbText(rawRes) : 'Nem jó. Gondold végig még egyszer, vagy kérj tippet!') + (fx.elsoHiba ? ' Emelt szintű feladat: az első hibás válasz még nem nullázza a számlálót.' : fx.nullazva ? ` A(z) ${esc(((ch.feladatok[fx.tipus] || {}).nev) || 'feladattípus')} számlálója nullázódott.` : '')); return; }
    solved = true;
    let msg = 'Helyes!';
    if (fx.nincsJatek) msg = 'Helyes!';
    else if (fx.cukorka) msg = `Helyes! ${ICON.candy.replace('<svg', '<svg width="18" height="18" class="ico"')} Minden feladattípusból megvan a ${KOMBO(ch.mod)} jó megoldás: +1 cukorka.${fx.nyithato ? ' Már elég cukorkád van a következő nyitáshoz – a fenti <b>Megnyitom</b> gombbal nyithatod meg.' : ''}`;
    else if (fx.uj && !fx.ok2 && fx.osszTipus) {
      const tn = esc((ch.feladatok[fx.tipus] || FEJ[ch.key].t.fejezetek.map(c => c.feladatok[fx.tipus]).find(Boolean) || {}).nev || fx.tipus);
      msg = fx.tele ? `Helyes! Ebből a típusból (${tn}) már megvan a ${KOMBO(ch.mod)} jó megoldás – a cukorkához a többi típus kell (kész: ${fx.keszTipus}/${fx.osszTipus}).`
        : `Helyes!${fx.ertek === 2 ? ` Emelt szintű feladat: 2 jó megoldásnak számít, a leghátrébb álló típushoz (${tn}) adódik.` : ''} ${tn}: ${fx.kombo}/${KOMBO(ch.mod)} · kész típusok: ${fx.keszTipus}/${fx.osszTipus}.`;
    }
    else if (fx.uj && !fx.ok2) msg = `Helyes!${fx.ertek === 2 ? ' Emelt szintű feladat: 2 jó válasznak számít.' : ''} Sorozat: ${fx.kombo}/${KOMBO(ch.mod)}.`;
    else if (fx.ok2 === 'segitseg') msg = 'Helyes, de mivel előtte megnézted a megoldást, ezért nem jár érte cukorka.';
    else if (fx.ok2 === 'ismert') msg = 'Helyes! Ezt a feladatot már korábban megoldottad, ezért most nem jár érte cukorka.';
    else if (fx.ok2 === 'nemfront') { const t = FEJ[ch.key].t, fc = L(t).lanc[frontIdx(ch.mod)]; msg = `Helyes! Cukorka csak a legutolsó nyitott fejezetben jár: <a href="${chHref(fc)}">${esc(fc.rovid)}</a>.`; }
    fb('ok', msg);
  }
  function newProblem() {
    let jelolt = gens;
    if (gid === 'mix' && jatek() && !resz.emeltResz && chStatus(ch) === 'cur') {   // „Vegyes”: előbb a még hiányzó típusok
      const A = allasDiak(FEJ[ch.key].t), hianyzik = gens.filter(g => A.req.includes(g) && (A.tc[g] || 0) < A.kb);
      if (hianyzik.length) jelolt = hianyzik;
    }
    const id = gid === 'mix' ? P(jelolt) : gid;
    try { cur = feladatKeszit(ch, id); }
    catch (e) { $('#q', box).innerHTML = `<p class="err">Hiba a(z) „${esc(id)}” feladattípusban: ${esc(e.message)}</p>`; return; }
    solved = false; revealed = false;
    const known = (store.state.solved[ch.key] || []).includes(cur.sig);
    const badge = !jatek() ? '' : known ? '<span class="badge old">már megoldottad</span>' : '<span class="badge new">új feladat</span>';
    const lvl = mutatSzint || resz.emeltResz ? szintCimke(ch.genSzint[id], K0) : '';
    $('#q', box).innerHTML = `<div class="eyebrow" style="margin-bottom:4px">${esc(cur.g.nev || id)} ${lvl} ${badge}</div>${cur.p.kerdes}
      ${isTeacher() ? `<div class="teach">Helyes válasz: <b>${esc(valaszSzoveg(cur.p.valasz))}</b></div>` : ''}`;
    $('#fb', box).hidden = true; $('#sol', box).hidden = true;
    const inp = $('#inp', box), v = cur.p.valasz;
    if (v.valasztas) {
      inp.innerHTML = `<div class="choices">${v.valasztas.map((o, i) => `<button class="btn" data-c="${i}">${esc(o)}</button>`).join('')}</div>`;
      inp.querySelector('.choices').onclick = e => { const b = e.target.closest('[data-c]'); if (!b || solved) return; submit(+b.dataset.c === v.helyes, v.valasztas[+b.dataset.c]); };
    } else {
      inp.innerHTML = `<div class="ansrow"><input id="ans-${esc(ch.id)}-${resz.id}" type="text" autocomplete="off" spellcheck="false" aria-label="Válasz" placeholder="Válasz"><button class="btn primary" id="chk">Ellenőrzés</button></div>
       <div class="fmt">Formátum: ${esc(cur.p.formatum || '')} · tört: <code>3/2</code> · tizedes: <code>1,5</code> · vegyes szám: <code>2 1/4</code> · szakaszos: <code>0,(3)</code> · több megoldás: <code>1; 2</code> · ha nincs: <code>nincs</code></div>`;
      const field = $('input', inp);
      const go = () => {
        if (solved) return;
        if (!field.value.trim()) return;
        const res = valaszEllenoriz(v, valaszErtelmez(field.value));
        if (res.rossz || res.forma) { fb(res.forma ? 'info' : 'no', fbText(res)); return; }   // alaki hiba: nem számít rossz válasznak
        submit(res.ok, field.value.trim(), res);
      };
      $('#chk', inp).onclick = go; field.onkeydown = e => { if (e.key === 'Enter') go(); };
      try { if (matchMedia('(pointer:fine)').matches) field.focus({ preventScroll: true }); } catch (e) {}
    }
    typeset(box);
  }
  $('#hint', box).onclick = () => { if (cur) fb('info', '<b>Tipp:</b> ' + (cur.p.tipp || 'Ehhez a feladathoz nincs tipp.')); };
  $('#solb', box).onclick = () => {
    if (!cur) return;
    const s = $('#sol', box); s.hidden = false;
    const v = cur.p.valasz;
    s.innerHTML = '<p><b>Megoldás</b></p>' + (cur.p.megoldas || []).map(x => /^\s*\\\[/.test(x) ? `<div class="mathbox">${x}</div>` : `<p>${x}</p>`).join('') + (v.valasztas ? `<p>Helyes válasz: <b>${esc(v.valasztas[v.helyes])}</b></p>` : '');
    if (!revealed && !solved && !resz.hazi) { const fx = rogzit(event('megoldas', false, '')); if (fx.nullazva) s.insertAdjacentHTML('afterbegin', '<p class="small">A megoldás megnézése nullázta a jó válaszok sorozatát.</p>'); }
    revealed = true;
    typeset(s);
  };
  $('#newp', box).onclick = newProblem;
  newProblem();
}

/* ===================== Grafikonrajzoló (exp / log) ===================== */
function makePlotter(box, mode) {
  const BASES = [{ l: '1/3', v: 1 / 3 }, { l: '1/2', v: .5 }, { l: '2', v: 2 }, { l: '3', v: 3 }, { l: '10', v: 10 }];
  let a = 2, u = 0, v = 0, inv = false;
  const isExp = mode === 'exp';
  box.innerHTML = `<div class="plot"><div class="canvasbox"><canvas aria-label="A függvény grafikonja"></canvas></div>
   <div class="ctrl"><div class="ftex" id="pf"></div>
    <div><span>Alap (a)</span><div class="row" id="pb">${BASES.map(b => `<button class="chip" data-v="${b.v}" aria-pressed="${b.v === 2}">${b.l}</button>`).join('')}</div></div>
    <label for="pu-${mode}">Vízszintes eltolás: u = <b id="puv">0</b><input type="range" id="pu-${mode}" min="-5" max="5" step="1" value="0"></label>
    <label for="pv-${mode}">Függőleges eltolás: v = <b id="pvv">0</b><input type="range" id="pv-${mode}" min="-5" max="5" step="1" value="0"></label>
    <label class="chk" for="pi-${mode}"><input type="checkbox" id="pi-${mode}"> Tükörkép az y = x egyenesre (inverz)</label>
    <dl class="props" id="pp"></dl></div></div>`;
  const cv = $('canvas', box), cb = $('.canvasbox', box);
  const S = 6;
  const f = x => isExp ? Math.pow(a, x - u) + v : (x - u > 0 ? Math.log(x - u) / Math.log(a) + v : NaN);
  const g0 = x => isExp ? Math.pow(a, x) : (x > 0 ? Math.log(x) / Math.log(a) : NaN);
  const fmtN = x => hu(+x.toFixed(3));
  function formula() {
    const blab = (BASES.find(b => b.v === a) || { l: a }).l; const bb = String(blab).includes('/') ? `(${blab})` : blab;
    const xpart = u === 0 ? 'x' : (u > 0 ? `x − ${u}` : `x + ${-u}`);
    const vpart = v === 0 ? '' : (v > 0 ? ` + ${v}` : ` − ${-v}`);
    return isExp ? `f(x) = ${bb}<sup>${xpart}</sup>${vpart}` : `f(x) = log<sub>${blab}</sub>(${xpart})${vpart}`;
  }
  function props() {
    const inc = a > 1; let rows;
    if (isExp) {
      const zero = v < 0 ? 'x = ' + fmtN(u + Math.log(-v) / Math.log(a)) : 'nincs';
      rows = [['Ért. tartomány', 'minden valós szám'], ['Értékkészlet', `y > ${hu(v)}`], ['Monotonitás', inc ? 'szig. növekvő' : 'szig. csökkenő'], ['Aszimptota', `y = ${hu(v)}`], ['Zérushely', zero], ['y-metszet', 'y = ' + fmtN(Math.pow(a, -u) + v)]];
    } else {
      const yint = u < 0 ? 'y = ' + fmtN(Math.log(-u) / Math.log(a) + v) : 'nincs (x = 0 nincs az ÉT-ben)';
      rows = [['Ért. tartomány', `x > ${hu(u)}`], ['Értékkészlet', 'minden valós szám'], ['Monotonitás', inc ? 'szig. növekvő' : 'szig. csökkenő'], ['Aszimptota', `x = ${hu(u)}`], ['Zérushely', 'x = ' + fmtN(u + Math.pow(a, -v))], ['y-metszet', yint]];
    }
    $('#pp', box).innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
    $('#pf', box).innerHTML = formula();
  }
  function draw() {
    if (!document.body.contains(cv)) return;
    const W = cb.clientWidth || 400, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = W * dpr; const c = cv.getContext('2d'); if (!c) return; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(document.documentElement); const col = n => cs.getPropertyValue(n).trim();
    const k = W / (2 * S); const X = x => (x + S) * k, Y = y => (S - y) * k;
    c.fillStyle = col('--card'); c.fillRect(0, 0, W, W);
    c.strokeStyle = col('--gridline'); c.lineWidth = 1;
    for (let i = -S; i <= S; i++) { c.beginPath(); c.moveTo(X(i), 0); c.lineTo(X(i), W); c.stroke(); c.beginPath(); c.moveTo(0, Y(i)); c.lineTo(W, Y(i)); c.stroke(); }
    c.strokeStyle = col('--muted'); c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.moveTo(X(0), 0); c.lineTo(X(0), W); c.stroke();
    c.fillStyle = col('--muted'); c.font = `11px ${col('--f-mono') || 'monospace'}`; c.textAlign = 'center';
    for (let i = -S + 1; i < S; i++) { if (i === 0 || i % 2) continue; c.fillText(String(i).replace('-', '−'), X(i), Y(0) + 14); c.textAlign = 'right'; c.fillText(String(i).replace('-', '−'), X(0) - 5, Y(i) + 4); c.textAlign = 'center'; }
    const curve = (fn, color, width, dash, swap) => {
      c.strokeStyle = color; c.lineWidth = width; c.setLineDash(dash || []); c.beginPath(); let on = false;
      const N = 900; for (let i = 0; i <= N; i++) { const t = -S - 1 + (2 * S + 2) * i / N; const y = fn(t);
        if (!isFinite(y) || Math.abs(y) > 40) { on = false; continue; }
        const px = swap ? X(y) : X(t), py = swap ? Y(t) : Y(y);
        if (!on) { c.moveTo(px, py); on = true; } else c.lineTo(px, py); }
      c.stroke(); c.setLineDash([]);
    };
    c.strokeStyle = col('--red'); c.lineWidth = 1.2; c.setLineDash([6, 5]); c.beginPath();
    if (isExp) { c.moveTo(0, Y(v)); c.lineTo(W, Y(v)); } else { c.moveTo(X(u), 0); c.lineTo(X(u), W); } c.stroke(); c.setLineDash([]);
    if (u !== 0 || v !== 0) curve(g0, col('--muted'), 1.5, [3, 4], false);
    if (inv) { c.strokeStyle = col('--muted'); c.setLineDash([2, 4]); c.beginPath(); c.moveTo(X(-S), Y(-S)); c.lineTo(X(S), Y(S)); c.stroke(); c.setLineDash([]); curve(f, col('--green'), 2, [8, 5], true); }
    curve(f, col('--pen'), 2.6, null, false);
    const dot = (x, y) => { if (!isFinite(x) || !isFinite(y) || Math.abs(x) > S || Math.abs(y) > S) return; c.fillStyle = col('--pen'); c.beginPath(); c.arc(X(x), Y(y), 4, 0, 7); c.fill(); };
    if (isExp) { dot(0, Math.pow(a, -u) + v); if (v < 0) dot(u + Math.log(-v) / Math.log(a), 0); }
    else { dot(u + Math.pow(a, -v), 0); if (u < 0) dot(0, Math.log(-u) / Math.log(a) + v); }
    c.textAlign = 'left'; c.font = `12px ${col('--f-body') || 'sans-serif'}`;
    const leg = [[col('--pen'), 'f(x)'], [col('--red'), 'aszimptota']]; if (u || v) leg.push([col('--muted'), 'alapfüggvény']); if (inv) leg.push([col('--green'), 'inverz']);
    leg.forEach((l, i) => { c.fillStyle = col('--card'); c.fillRect(8, 8 + i * 18, 110, 18); c.fillStyle = l[0]; c.fillRect(12, 15 + i * 18, 14, 3); c.fillStyle = col('--ink'); c.fillText(l[1], 32, 20 + i * 18); });
  }
  const upd = () => { props(); draw(); };
  $('#pb', box).onclick = e => { const b = e.target.closest('.chip'); if (!b) return; a = +b.dataset.v; box.querySelectorAll('#pb .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); };
  const su = $(`#pu-${mode}`, box), sv = $(`#pv-${mode}`, box);
  su.oninput = () => { u = +su.value; $('#puv', box).textContent = hu(u); upd(); };
  sv.oninput = () => { v = +sv.value; $('#pvv', box).textContent = hu(v); upd(); };
  $(`#pi-${mode}`, box).onchange = e => { inv = e.target.checked; draw(); };
  if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(cb);
  upd();
  redraw = draw;
}
let redraw = null;
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => redraw && redraw()); } catch (e) {}

/* ===================== Próba-témazáró ===================== */
function renderProba(t) {
  const m = $('#main');
  if (!probaNyitva(t)) {
    const fl = L(t).lanc, fi = frontIdx(t.key), fc = fl[fi];
    m.innerHTML = `<div class="eyebrow">${esc(t.cim)}</div><h2 class="ch">Próba-témazáró</h2>
      <div class="lockbox">${ICON.lock.replace('width="13" height="13"', 'width="34" height="34"')}
      <p class="lead">A próba-témazárót akkor nyithatod meg, ha a témakör minden fejezetét teljesítetted: az utolsó fejezetben is összegyűjtöttél ${t.probaAr} cukorkát.</p>
      <p class="small">Most itt tartasz: <b>${esc(fc.cim)}</b> (${fi + 1}/${fl.length}. fejezet).</p>
      <div class="ansrow">${fi === fl.length - 1 ? nyitasGomb(t) : ''}<a class="btn" href="${chHref(fc)}">Tovább: ${esc(fc.rovid)} →</a></div></div>`;
    return;
  }
  /* közép szintű csoport: csak a láncbeli fejezetek közép szintű feladatai (ha van ilyen) */
  const kz = kozepCsop(t.kid);
  const allowed = kz ? L(t).lanc : t.fejezetek;
  let pool = allowed.map(c => ({ c, gens: (kz ? c.gensK : c.gens).filter(g => c.feladatok[g].proba !== false) })).filter(x => x.gens.length);
  if (!pool.length) pool = t.fejezetek.map(c => ({ c, gens: c.gens.filter(g => c.feladatok[g].proba !== false) })).filter(x => x.gens.length);
  const items = [];
  let guard = 0;
  while (items.length < t.probaDb && pool.length && guard++ < 500) {
    const slot = pool[items.length % pool.length];
    try {
      const it = feladatKeszit(slot.c, P(slot.gens));
      if (it.p.valasz.valasztas) { slot.gens = slot.gens.filter(g => g !== it.gid); if (!slot.gens.length) pool.splice(pool.indexOf(slot), 1); continue; }
      items.push(Object.assign(it, { ch: slot.c }));
    } catch (e) { /* hibás generátor: kihagyjuk */ }
  }
  m.innerHTML = `<div class="eyebrow">${esc(t.cim)}</div><h2 class="ch">Próba-témazáró</h2>
   <p class="lead">${items.length} véletlenszerű feladat a témakör összes fejezetéből, feladatonként 1 pont. Tippet itt nem kapsz; a végén a „Beadás” gombbal értékelheted, és minden feladat megoldását megnézheted.</p>
   <div id="tl"></div>
   <div class="ansrow" style="margin-top:18px"><button class="btn primary" id="sub">Beadás</button><button class="btn" id="again">Új feladatsor</button></div>
   <div id="res" style="margin-top:18px"></div>`;
  $('#tl').innerHTML = items.map((it, i) => `<div class="titem" id="ti${i}"><div class="num">${i + 1}.</div><div class="body"><div class="prob">${it.p.kerdes}</div>
     ${isTeacher() ? `<div class="teach">Helyes válasz: <b>${esc(valaszSzoveg(it.p.valasz))}</b></div>` : ''}
     <div class="ansrow"><input id="pa${i}" type="text" autocomplete="off" spellcheck="false" aria-label="${i + 1}. feladat válasza" placeholder="Válasz"><span class="fmt">${esc(it.p.formatum || '')}</span></div>
     <div class="fb" hidden></div><div class="solbox" hidden></div></div></div>`).join('');
  $('#again').onclick = () => renderProba(t);
  $('#sub').onclick = () => {
    let pts = 0; const byCh = {};
    items.forEach((it, i) => {
      const row = $('#ti' + i), val = $('#pa' + i).value, res = valaszEllenoriz(it.p.valasz, valaszErtelmez(val));
      byCh[it.ch.key] = byCh[it.ch.key] || [0, 0]; byCh[it.ch.key][1]++; if (res.ok) { pts++; byCh[it.ch.key][0]++; }
      row.className = 'titem ' + (res.ok ? 'ok' : 'no');
      const f = row.querySelector('.fb'); f.hidden = false; f.className = 'fb ' + (res.ok ? 'ok' : 'no'); f.innerHTML = res.ok ? 'Helyes, 1 pont.' : (val.trim() ? (res.forma ? fbText(res) + ' 0 pont.' : 'Nem jó, 0 pont.') : 'Nincs válasz, 0 pont.');
      const s = row.querySelector('.solbox'); s.hidden = false; s.innerHTML = (it.p.megoldas || []).map(x => /^\s*\\\[/.test(x) ? `<div class="mathbox">${x}</div>` : `<p>${x}</p>`).join('');
    });
    const max = items.length || 1, pct = Math.round(100 * pts / max);
    const grade = pct >= 85 ? 5 : pct >= 70 ? 4 : pct >= 55 ? 3 : pct >= 40 ? 2 : 1;
    const weak = Object.entries(byCh).filter(([, v]) => v[0] < v[1]).map(([k]) => FEJ[k].ch);
    $('#res').innerHTML = `<div class="result"><div><div class="big">${pts} / ${items.length}</div><div class="fmt">${pct}% · tájékoztató jegy: ${grade}</div></div>
      <div class="prose">${weak.length ? 'Ismételd át: ' + weak.map(c => `<a href="${chHref(c)}">${esc(c.rovid)}</a>`).join(', ') + '.' : 'Minden feladat sikerült. Kérj új feladatsort, és próbáld meg még egyszer!'}</div></div><p class="small" id="sendst"></p>`;
    $('#sub').disabled = true; typeset(m);
    const stEl = $('#sendst');
    if (ENDPOINT && sess && !isTeacher()) {
      store.tests.push({ tid: uid(), mod: t.key, modCim: `${K.cim} · ${t.cim}`, score: pts, max: items.length, pct, grade, weak: weak.map(c => c.rovid), detail: Object.fromEntries(Object.entries(byCh).map(([k, v]) => [FEJ[k].ch.rovid, v])) });
      saveStore(); stEl.textContent = 'Eredmény küldése a tanárnak…';
      syncNow().then(() => { stEl.textContent = store.tests.length ? 'Most nem sikerült elküldeni az eredményt; automatikusan újrapróbálom.' : 'Az eredményt elküldtük a tanárnak.'; });
    }
    $('#res').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
  };
  typeset(m);
}

/* ===================== Tanári felület ===================== */
const TV = { group: '', courseId: '', mod: '', data: null, tab: 'attekintes', student: null, logCh: '', onlyWrong: false };
const fmtTime = s => { if (!s) return '–'; const d = new Date(s); if (isNaN(d)) return esc(s); return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}. ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
/* ===================== Házi feladat ===================== */
/* A házi nem számít bele semmilyen gyűjthető dologba (cukorka, sorozat, napi sorozat) – lásd rules.js. */
const haziCtx = hk => { const o = {}; (hk || []).forEach(h => { const t = {}; (h.tetel || []).forEach(x => { t[x.k] = x.db; }); o[h.id] = { tetel: t }; }); return o; };
const diakHazik = () => (store.hk || []).filter(h => KS.some(k => k.id === h.kurzus));
function haziAllas(h, st) {
  const x = ((st || store.state).hazi || {})[h.id] || { db: {} };
  const tetel = (h.tetel || []).map(t => ({ ...t, van: Math.min(t.db, (x.db || {})[t.k] || 0) }));
  return { tetel, kesz: tetel.every(t => t.van >= t.db), keszNap: x.kesz || '', van: tetel.reduce((a, t) => a + t.van, 0), kell: tetel.reduce((a, t) => a + t.db, 0) };
}
const HONAP = ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'];
const datumSzoveg = d => { const p = String(d || '').split('-').map(Number); return p.length === 3 && p[1] ? `${HONAP[p[1] - 1]} ${p[2]}.` : ''; };
function hataridoSzoveg(d) {
  if (!d) return 'nincs határidő';
  const nap = Math.round((Date.parse(d + 'T00:00:00Z') - Date.parse(dayKey() + 'T00:00:00Z')) / 864e5);
  const rel = nap < 0 ? `lejárt (${-nap} napja)` : nap === 0 ? 'ma' : nap === 1 ? 'holnap' : `még ${nap} nap`;
  return `${datumSzoveg(d)} – ${rel}`;
}
const tetelNev = t => { const n = FEJ[t.k.split('|')[0]]; const g = t.k.split('|')[1]; return n ? (n.ch.feladatok[g] || {}).nev || t.nev || g : t.nev || g; };
/* Felső sáv a diák minden oldalán, ha van még kész nélküli házi. */
function haziSav() {
  if (!jatek()) return;
  const nyitott = diakHazik().filter(h => !haziAllas(h).kesz);
  if (!nyitott.length || currentId() === 'start') return;
  const h = nyitott[0], a = haziAllas(h);
  $('#main').insertAdjacentHTML('afterbegin', `<a class="hazisav${lejartHazi(h) ? ' lejart' : ''}" href="#hazi/${esc(h.id)}"><span class="hs-i">✍</span><span><b>Házi feladat: ${esc(h.cim)}</b> · ${a.van}/${a.kell} kész · határidő: ${esc(hataridoSzoveg(h.hatarido))}${nyitott.length > 1 ? ` · és még ${nyitott.length - 1}` : ''}</span><span class="hs-g">Megoldom →</span></a>`);
}
function haziKartyak() {
  const hk = jatek() ? diakHazik() : [];
  if (!hk.length) return '';
  return `<section class="blk hazik"><h3>Házi feladat <span class="tag">a tanárodtól</span></h3>${hk.map(h => { const a = haziAllas(h);
    return `<a class="hazikartya${a.kesz ? ' kesz' : lejartHazi(h) ? ' lejart' : ''}" href="#hazi/${esc(h.id)}"><div class="hk-fej"><b>${esc(h.cim)}</b><span class="small">határidő: ${esc(hataridoSzoveg(h.hatarido))}</span></div>
      <div class="hk-tetel">${a.tetel.map(t => `<span class="${t.van >= t.db ? 'ok' : ''}">${t.van >= t.db ? ICON.check + ' ' : ''}${esc(tetelNev(t))} ${t.van}/${t.db}</span>`).join('')}</div>
      <div class="hk-lab">${a.kesz ? `${ICON.check} Teljesítve${a.keszNap ? ` (${datumSzoveg(a.keszNap)})` : ''}` : lejartHazi(h) ? `Lejárt, nincs kész: ${a.van}/${a.kell} · Befejezem →` : `${a.van}/${a.kell} helyes megoldás · Megoldom →`}</div></a>`; }).join('')}
    <p class="small">A házi feladat nem számít bele a cukorkába és a sorozatokba – itt a megadott számú helyes megoldás a cél.</p></section>`;
}
function renderHazi(hid) {
  const m = $('#main');
  if (!jatek()) { m.innerHTML = '<p>A házi feladatot bejelentkezett diákként látod.</p>'; return; }
  const h = diakHazik().find(x => x.id === hid);
  if (!h) { m.innerHTML = `<div class="eyebrow">Házi feladat</div><h2 class="ch">Házi feladatok</h2>${haziKartyak() || '<p>Most nincs kiadott házi feladat.</p>'}`; return; }
  const a0 = haziAllas(h);
  /* Egy rész: amíg nincs kész, gyakorolható; ha kész, zöld és lezárt (a fejezetben lehet tovább gyakorolni). */
  const reszHtml = (t, i) => {
    const n = FEJ[t.k.split('|')[0]], kesz = t.van >= t.db;
    const fej = `<h3>${esc(tetelNev(t))} <span class="tag">${n ? esc(n.ch.rovid) : esc(t.chCim || '')}</span> <span class="hz-db">${kesz ? ICON.check + ' ' : ''}${t.van}/${t.db}</span></h3>`;
    if (!n) return fej + '<p class="err">Ez a feladattípus nem található a tananyagban.</p>';
    if (kesz) return fej + `<div class="hz-kesz">${ICON.check} <b>Ez a rész kész.</b> Itt már nem kell tovább dolgoznod. ${chStatus(n.ch) !== 'locked' ? `<a href="${chHref(n.ch)}">Tovább gyakorolok a fejezetben →</a>` : ''}</div>`;
    return fej + `<div class="practice" id="hzp${i}" hidden></div><button class="btn" data-hzny="${i}">Gyakorlás</button>`;
  };
  const fejlec = a => {
    if (a.kesz) return `<div class="hz-allapot ok">${ICON.check} <b>Teljesítetted a házi feladatot!</b>${a.keszNap ? ` (${datumSzoveg(a.keszNap)}${h.hatarido && a.keszNap > h.hatarido ? ', a határidő után' : ''})` : ''}<br>
      <span>A házi lezárult. A gyakorlást a fejezetekben folytathatod – ott a cukorka is gyűlik.</span> <a href="#start">Kezdőlap →</a></div>`;
    if (lejartHazi(h)) return `<div class="hz-allapot no"><b>Lejárt a határidő (${datumSzoveg(h.hatarido)}), és még nem teljesítetted.</b><br><span>Most is befejezheted, de a tanárod késve beadottként látja. Eddig: ${a.van}/${a.kell} helyes megoldás.</span></div>`;
    return `<div class="hz-allapot">${a.van}/${a.kell} helyes megoldás · határidő: ${esc(hataridoSzoveg(h.hatarido))}</div>`;
  };
  m.innerHTML = `<div class="eyebrow">Házi feladat</div><h2 class="ch">${esc(h.cim)}</h2>
    <div id="hzo">${fejlec(a0)}</div>
    ${a0.kesz ? '' : '<p class="small">Minden feladattípusból a megadott számú <b>helyes</b> megoldás kell. Csak a még meg nem oldott feladatok számítanak, és ha előtte megnézed a megoldást, az nem számít bele. A házi nem számít bele a cukorkába és a sorozatokba.</p>'}
    <div class="hazi-oldal${a0.kesz ? ' kesz' : lejartHazi(h) ? ' lejart' : ''}" id="hzlap">${a0.tetel.map((t, i) => `<section class="blk hazi-resz${t.van >= t.db ? ' kesz' : lejartHazi(h) ? ' lejart' : ''}" id="hzs${i}">${reszHtml(t, i)}</section>`).join('')}</div>`;
  /* megoldás után: a darabszám frissül; ha egy rész elkészült, rövid szünet után lezárul (a visszajelzés látszik addig) */
  const frissit = () => {
    const a = haziAllas(h);
    a.tetel.forEach((t, i) => {
      const sec = $(`#hzs${i}`); if (!sec) return;
      const db = sec.querySelector('.hz-db'); if (db) db.innerHTML = `${t.van >= t.db ? ICON.check + ' ' : ''}${t.van}/${t.db}`;
      if (t.van >= t.db && !sec.classList.contains('kesz')) setTimeout(() => { sec.className = 'blk hazi-resz kesz'; sec.innerHTML = reszHtml(t, i); }, 1600);
    });
    if (a.kesz) setTimeout(() => { if (currentId() === 'hazi/' + h.id) renderHazi(h.id); }, 1700);
    else $('#hzo').innerHTML = fejlec(a);
    renderToc(currentId());
  };
  m.onclick = e => {
    const b = e.target.closest('[data-hzny]'); if (!b) return;
    const i = +b.dataset.hzny, t = a0.tetel[i], n = FEJ[t.k.split('|')[0]], box = $(`#hzp${i}`);
    b.remove(); box.hidden = false;
    makePractice(box, n.ch, { id: 'hz' + i, gens: [t.k.split('|')[1]], emeltResz: false, hazi: h.id, frissit });
    typeset(box);
  };
}
const lejartHazi = h => !!h.hatarido && dayKey() > h.hatarido && !haziAllas(h).kesz;
/* Tanári felület – Házi feladat fül */
function tanarHazi(v) {
  const d = TV.data, K0 = TV.course, hk = (d.hazik || []).filter(h => h.kurzus === K0.id);
  const het = new Date(Date.now() + 7 * 864e5), alapHd = dayKey(het);
  const tabla = h => { const tet = h.tetel || [];
    return `<div class="tbl"><table class="hzt"><thead><tr><th>Név</th>${tet.map(t => `<th title="${esc(t.chCim || '')}">${esc(tetelNev(t))}<br><span class="small">${t.db} db</span></th>`).join('')}<th>Állapot</th></tr></thead><tbody>
      ${d.students.map(s => { const a = haziAllas(h, Szabalyok.normal(s.state));
        const allapot = a.kesz ? (h.hatarido && a.keszNap > h.hatarido ? `<span class="hz-keso">kész, késve (${datumSzoveg(a.keszNap)})</span>` : `<span class="hz-ok">${ICON.check} kész (${datumSzoveg(a.keszNap)})</span>`) : h.hatarido && dayKey() > h.hatarido ? `<span class="hz-nincs">nincs kész: ${a.van}/${a.kell}</span>` : `${a.van}/${a.kell}`;
        return `<tr><td><b>${esc(s.name)}</b></td>${a.tetel.map(t => `<td class="num ${t.van >= t.db ? 'hz-ok' : ''}">${t.van}/${t.db}</td>`).join('')}<td>${allapot}</td></tr>`; }).join('')}</tbody></table></div>`; };
  v.innerHTML = `${hk.length ? hk.map(h => `<div class="hzkiadott"><div class="row"><b>${esc(h.cim)}</b><span class="small">határidő: ${esc(hataridoSzoveg(h.hatarido))} · kiadta: ${esc(h.letrehozta || '')}</span><button class="btn sm ghost" data-hztorol="${esc(h.id)}">Törlés</button></div>${tabla(h)}</div>`).join('') : '<p>Ennek a csoportnak ebben a tananyagban nincs kiadott házi feladata.</p>'}
    <section class="blk"><h3>Új házi feladat</h3>
      <div class="tctrl"><label for="hzc">Cím<input id="hzc" type="text" value="Házi feladat" style="width:min(320px,100%)"></label><label for="hzd">Határidő<input id="hzd" type="date" value="${alapHd}"></label></div>
      <p class="small">Add meg, melyik feladattípusból hány helyes megoldás kell. A diákok a menü tetején és minden oldal tetején látják a házit.</p>
      <div id="hzlista">${K0.temakorok.map(t => `<details class="dg-tema"><summary><b>${esc(t.cim)}</b></summary>${t.fejezetek.map(ch => `<div class="dg-fej"><div class="dg-fejcim">${pad2(ch.idx + 1)}. ${esc(ch.cim)}</div>
        ${ch.gens.map(g => `<div class="dg-tipus"><input type="number" min="0" max="50" value="0" data-hz="${esc(ch.key + '|' + g)}" aria-label="helyes megoldások száma"><span class="dg-tnev">${esc(ch.feladatok[g].nev || g)} ${szintCimke(ch.genSzint[g], K0)}</span></div>`).join('')}</div>`).join('')}</details>`).join('')}</div>
      <div class="ansrow" style="margin-top:10px"><button class="btn primary" id="hzki">Házi feladat kiadása</button><span class="small" id="hzst"></span></div></section>`;
  $('#hzki').onclick = async () => {
    const tetel = [...v.querySelectorAll('[data-hz]')].filter(i => +i.value > 0).map(i => { const [ck, g] = i.dataset.hz.split('|'); const ch = FEJ[ck].ch;
      return { k: i.dataset.hz, db: Math.min(50, Math.round(+i.value)), nev: ch.feladatok[g].nev || g, chCim: ch.cim }; });
    const st = $('#hzst');
    if (!tetel.length) { st.textContent = 'Legalább egy feladattípusnál adj meg darabszámot.'; return; }
    st.textContent = 'Mentés…';
    try {
      const r = await api('tHazi', Object.assign(auth(), { group: TV.group, course: K0.id, hazi: { cim: $('#hzc').value, hatarido: $('#hzd').value, tetel } }));
      if (!r.ok) throw new Error(r.error);
      TV.data.hazik = r.hazik || []; drawView(); toast('A házi feladatot kiadtad.');
    } catch (e) { st.textContent = 'Nem sikerült menteni: ' + e.message; }
  };
  v.querySelectorAll('[data-hztorol]').forEach(b => { b.onclick = async () => {
    if (!confirm('Biztosan törlöd ezt a házi feladatot? A diákok nem fogják többé látni.')) return;
    try { const r = await api('tHazi', Object.assign(auth(), { group: TV.group, course: K0.id, torol: b.dataset.hztorol })); if (!r.ok) throw new Error(r.error); TV.data.hazik = r.hazik || []; drawView(); }
    catch (e) { toast('Nem sikerült törölni: ' + esc(e.message)); }
  }; });
}

/* Dolgozatkészítő (assets/dolgozat.js): tanári fiókkal, illetve helyi módban */
function renderDolgozat() {
  const m = $('#main');
  if (ENDPOINT && !isTeacher()) { m.innerHTML = '<p>Ez az oldal csak tanári fiókkal érhető el.</p>'; return; }
  if (!window.Dolgozat) { m.innerHTML = '<p class="err">A dolgozatkészítő nem töltődött be (assets/dolgozat.js).</p>'; return; }
  window.Dolgozat.render({ main: () => $('#main'), KS: () => KS, feladatKeszit, typeset, esc, toast, szintCimke, valaszSzoveg });
}
async function renderTeacher() {
  const m = $('#main');
  if (!isTeacher()) { m.innerHTML = '<p>Ez az oldal csak tanári fiókkal érhető el.</p>'; return; }
  if (!ENDPOINT) { m.innerHTML = '<p>A tanári felülethez be kell állítani a szervert (config.js → vegpont).</p>'; return; }
  m.innerHTML = `<div class="eyebrow">Tanári felület</div><h2 class="ch">Csoportok eredményei</h2>
    <div class="tctrl" id="tctrl"><span class="small">Betöltés…</span></div>
    <div id="tbody"></div>`;
  await loadTeacher();
}
async function loadTeacher() {
  const body = $('#tbody'); if (!body) return;
  try {
    const res = await api('tOverview', Object.assign(auth(), { group: TV.group, course: TV.courseId }));
    if (!res.ok) { if (res.error === 'auth') return authLost(); body.innerHTML = `<p class="err">Hiba: ${esc(res.error)}</p>`; return; }
    TV.data = res; TV.group = res.group || ''; TV.courseId = res.course || kurzusLista()[0];
    TV.course = await betoltKurzus(TV.courseId);
    if (!TV.course.temakorok.some(t => t.id === TV.mod)) TV.mod = (TV.course.temakorok.find(t => t.id === aktTema) || TV.course.temakorok[0] || {}).id || '';
    drawTeacher();
  } catch (e) { body.innerHTML = `<p class="err">Nem sikerült betölteni: ${esc(e.message)}</p>`; }
}
function tMod() { return TV.course.temakorok.find(t => t.id === TV.mod); }
const tKozep = () => ((TV.data && TV.data.groupLevel) || {})[TV.course.id] === 'kozep';
const tLanc = t => lancOf(t, tKozep());
function tCtx() {
  return Object.assign(kurzusCtx([TV.course], tKozep), { groupUnlock: (TV.data.groupUnlock || {}), limit: (TV.data.groupLimit || {}), today: dayKey() });
}
function drawTeacher() {
  const d = TV.data, t = tMod();
  $('#tctrl').innerHTML = `<label for="tg">Csoport<select id="tg">${d.groups.map(g => `<option ${g === TV.group ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label>
    ${(d.courses || []).length > 1 ? `<label for="tk">Tananyag<select id="tk">${d.courses.map(c => `<option value="${esc(c)}" ${c === TV.courseId ? 'selected' : ''}>${esc(c)}. évfolyam</option>`).join('')}</select></label>` : ''}
    <label for="tm">Témakör<select id="tm">${TV.course.temakorok.map(x => `<option value="${esc(x.id)}" ${x.id === TV.mod ? 'selected' : ''}>${esc(x.cim)}</option>`).join('')}</select></label>
    <button class="btn" id="trf">Frissítés</button>`;
  $('#tg').onchange = e => { TV.group = e.target.value; TV.student = null; $('#tbody').innerHTML = '<p class="small">Betöltés…</p>'; loadTeacher(); };
  $('#tm').onchange = e => { TV.mod = e.target.value; drawTeacher(); };
  const tk = $('#tk'); if (tk) tk.onchange = e => { TV.courseId = e.target.value; TV.mod = ''; TV.student = null; $('#tbody').innerHTML = '<p class="small">Betöltés…</p>'; loadTeacher(); };
  $('#trf').onclick = () => { $('#tbody').innerHTML = '<p class="small">Betöltés…</p>'; loadTeacher(); };
  if (!t) { $('#tbody').innerHTML = '<p>Ehhez a csoporthoz nem tartozik betölthető tananyag.</p>'; return; }
  const tl = tLanc(t).lanc;
  const gu = Math.min((d.groupUnlock || {})[t.key] || 0, tl.length);
  const gk = (d.groupLimit || {})[t.key];
  $('#tbody').innerHTML = `
    <section class="blk"><h3>Feladatszint</h3>
      <p class="small"><b>Közép:</b> a közép szintű feladatok a fő gyakorlásban, az emelt szintűek külön, alatta (ott egy jó megoldás kettőt ér, és az első hibás válasz még nem nullázza a sorozatot). Az emelt szintű fejezetek kimaradnak a nyitási láncból, és a próba-témazáró is csak közép feladatokat ad.<br><b>Emelt:</b> minden feladat egy felületen, a szokásos szabályokkal.</p>
      <div class="tctrl"><label for="tsz">A csoport szintje (${esc(TV.course.cim)})<select id="tsz"><option value="emelt" ${tKozep() ? '' : 'selected'}>Emelt – minden feladat együtt</option><option value="kozep" ${tKozep() ? 'selected' : ''}>Közép – emelt feladatok külön</option></select></label>
      <button class="btn" id="tszs">Mentés</button><span class="small" id="tszst"></span></div></section>
    <section class="blk"><h3>Csoportszintű nyitás</h3>
      <p class="small">A kiválasztott fejezetig a csoport minden tagja hozzáfér. A cukorka és a napi sorozat mindenkinél a legutolsó nyitott fejezetben gyűlik, ez lehet a csoportnak megnyitott fejezet is. Az utolsó lehetőség a próba-témazárót is megnyitja.</p>
      <div class="tctrl"><label for="tu">A csoportnak nyitva eddig<select id="tu">${tl.map((c, i) => `<option value="${i}" ${i === gu ? 'selected' : ''}>${pad2(c.idx + 1)}. ${esc(c.rovid)}</option>`).join('')}<option value="${tl.length}" ${gu === tl.length ? 'selected' : ''}>Minden fejezet + próba-témazáró</option></select></label>
      <button class="btn" id="tus">Mentés</button><span class="small" id="tust"></span></div>
      <p class="small" style="margin-top:12px">Haladási korlát: a diákok cukorkával legfeljebb eddig nyithatnak (hogy ne haladjanak az óra elé). A cukorka közben tovább gyűlik, és a korlát emelése után felhasználható.</p>
      <div class="tctrl"><label for="tk2">Cukorkával nyitható legfeljebb<select id="tk2"><option value="-1" ${gk == null ? 'selected' : ''}>nincs korlát</option>${tl.map((c, i) => `<option value="${i}" ${gk === i ? 'selected' : ''}>${pad2(c.idx + 1)}. ${esc(c.rovid)}</option>`).join('')}<option value="${tl.length}" ${gk === tl.length ? 'selected' : ''}>Minden fejezet + próba-témazáró</option></select></label>
      <button class="btn" id="tks">Mentés</button><span class="small" id="tkst"></span></div></section>
    <section class="blk"><div class="tabs"><button class="chip" data-tab="attekintes" aria-pressed="${TV.tab === 'attekintes'}">Áttekintés</button><button class="chip" data-tab="megoldasok" aria-pressed="${TV.tab === 'megoldasok'}">Megoldások</button><button class="chip" data-tab="probak" aria-pressed="${TV.tab === 'probak'}">Próbák</button><button class="chip" data-tab="hazi" aria-pressed="${TV.tab === 'hazi'}">Házi feladat</button></div>
    <div id="tview"></div></section>`;
  $('#tks').onclick = async () => {
    const idx = +$('#tk2').value, st = $('#tkst'); st.textContent = 'Mentés…';
    try {
      const r = await api('tLimit', Object.assign(auth(), { group: TV.group, course: TV.course.id, mod: t.id, idx: idx < 0 ? -1 : idx, chCim: idx < 0 ? '' : idx < tl.length ? tl[idx].cim : 'Próba-témazáró' }));
      if (!r.ok) throw new Error(r.error);
      TV.data.groupLimit = r.groupLimit || {}; st.textContent = 'Elmentve.';
    } catch (e) { st.textContent = 'Nem sikerült menteni: ' + e.message; }
  };
  $('#tus').onclick = async () => {
    const idx = +$('#tu').value, st = $('#tust'); st.textContent = 'Mentés…';
    try {
      const r = await api('tUnlock', Object.assign(auth(), { group: TV.group, course: TV.course.id, mod: t.id, idx, chCim: idx < tl.length ? tl[idx].cim : 'Próba-témazáró' }));
      if (!r.ok) throw new Error(r.error);
      TV.data.groupUnlock = r.groupUnlock || TV.data.groupUnlock; st.textContent = 'Elmentve.'; drawView();
    } catch (e) { st.textContent = 'Nem sikerült menteni: ' + e.message; }
  };
  $('#tszs').onclick = async () => {
    const szint = $('#tsz').value, st = $('#tszst'); st.textContent = 'Mentés…';
    try {
      const r = await api('tLevel', Object.assign(auth(), { group: TV.group, course: TV.course.id, szint }));
      if (!r.ok) throw new Error(r.error);
      TV.data.groupLevel = r.groupLevel || {}; drawTeacher(); $('#tszst').textContent = 'Elmentve.';
    } catch (e) { st.textContent = 'Nem sikerült menteni: ' + e.message; }
  };
  $('#tbody .tabs').onclick = e => { const b = e.target.closest('[data-tab]'); if (!b) return; TV.tab = b.dataset.tab; $('#tbody .tabs').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); drawView(); };
  drawView();
}
function stuCells(stu, t) {
  const c = tCtx(), st = Szabalyok.normal(stu.state);
  const f = Szabalyok.front(st, c, t.key), kesz = Szabalyok.teljesitett(st, c, t.key);
  const poz = tLanc(t).poz;
  return t.fejezetek.map(ch => {
    const i = poz[ch.key];
    const s = st.ch[ch.key] || { ok: 0, tried: 0, candy: 0 };
    const title = `${ch.rovid}: ${s.ok} helyes / ${s.tried} próbálkozás, ${s.candy} cukorka`;
    if (i < f || kesz) return `<td title="${esc(title)}"><span class="cell done">${s.ok}</span></td>`;
    if (i === f) { const A = tipusAllas(t, st, tKozep(), f); return `<td title="${esc(title)} · kész feladattípusok: ${A.kesz}/${A.req.length} (mindegyikből ${A.kb} jó megoldás kell)"><span class="cell cur">${A.kesz}/${A.req.length}</span></td>`; }
    return `<td title="${esc(title)}"><span class="cell lock">${s.ok ? s.ok : '–'}</span></td>`;
  }).join('');
}
function drawView() {
  const v = $('#tview'), d = TV.data, t = tMod(); if (!v) return;
  const today = dayKey();
  if (TV.tab === 'attekintes') {
    if (!d.students.length) { v.innerHTML = '<p>Ebben a csoportban nincs diák. A Felhasználók lapon add meg a csoportot.</p>'; return; }
    v.innerHTML = `<div class="legend"><span><span class="cell done">12</span> teljesített fejezet, helyes megoldások száma</span><span><span class="cell cur">2/5</span> aktuális fejezet: kész feladattípusok (mindegyikből ${KOMBO(t)} jó megoldás)</span><span><span class="cell lock">–</span> zárva</span></div>
      <div class="tbl ttbl"><table><thead><tr><th>Név</th><th>Cukorka</th><th>Sorozat</th><th>Legjobb</th>${t.fejezetek.map(c => `<th title="${esc(c.cim)}">${pad2(c.idx + 1)}</th>`).join('')}<th>Utolsó próba</th><th>Utolsó aktivitás</th></tr></thead>
      <tbody>${d.students.map((s, i) => { const st = Szabalyok.normal(s.state); const lt = (s.tests || []).find(x => x.mod === t.key);
        return `<tr data-i="${i}" class="${TV.student === s.user ? 'sel' : ''}"><td><b>${esc(s.name)}</b><br><span class="small">${esc(s.user)}</span></td><td class="num" title="összesen eddig: ${st.candy}">${Szabalyok.penz(st)}</td><td class="num">${Szabalyok.aktualisStreak(st, today, tCtx())}</td><td class="num">${st.streak.best}</td>${stuCells(s, t)}<td class="num">${lt ? lt.pct + '%' : '–'}</td><td class="small">${s.last ? fmtTime(s.last) : 'még nem lépett be'}</td></tr>`; }).join('')}</tbody></table></div>
      <div id="tstu"></div>`;
    v.querySelector('tbody').onclick = e => { const r = e.target.closest('tr[data-i]'); if (!r) return; const s = d.students[+r.dataset.i]; TV.student = s.user; v.querySelectorAll('tbody tr').forEach(x => x.classList.toggle('sel', x === r)); drawStudent(s); };
    const sel = d.students.find(s => s.user === TV.student); if (sel) drawStudent(sel);
  } else if (TV.tab === 'megoldasok') {
    v.innerHTML = `<div class="tctrl" style="margin:10px 0"><label for="tlc">Fejezet<select id="tlc"><option value="">Mind</option>${t.fejezetek.map(c => `<option value="${esc(c.key)}" ${TV.logCh === c.key ? 'selected' : ''}>${pad2(c.idx + 1)}. ${esc(c.rovid)}</option>`).join('')}</select></label>
      <label class="chk" for="tlw" style="flex-direction:row;align-items:center"><input type="checkbox" id="tlw" ${TV.onlyWrong ? 'checked' : ''}> csak a hibás válaszok</label></div><div id="tlog"><p class="small">Betöltés…</p></div>`;
    $('#tlc').onchange = e => { TV.logCh = e.target.value; loadLog($('#tlog'), {}); };
    $('#tlw').onchange = e => { TV.onlyWrong = e.target.checked; loadLog($('#tlog'), {}); };
    loadLog($('#tlog'), {});
  } else if (TV.tab === 'hazi') {
    tanarHazi(v);
  } else {
    const rows = [];
    d.students.forEach(s => (s.tests || []).forEach(x => { if (x.mod === t.key) rows.push(Object.assign({ name: s.name }, x)); }));
    rows.sort((a, b) => String(b.t).localeCompare(String(a.t)));
    v.innerHTML = rows.length ? `<div class="tbl"><table><thead><tr><th>Időpont</th><th>Név</th><th>Pont</th><th>%</th><th>Jegy</th><th>Ismétlendő</th></tr></thead><tbody>${rows.map(r => `<tr><td class="small">${fmtTime(r.t)}</td><td>${esc(r.name)}</td><td class="num">${r.score}/${r.max}</td><td class="num">${r.pct}%</td><td class="num">${r.grade}</td><td class="small">${esc(r.weak || '–')}</td></tr>`).join('')}</tbody></table></div>`
      : '<p>Ebben a témakörben még senki nem adott be próba-témazárót.</p>';
  }
}
function drawStudent(s) {
  const box = $('#tstu'); if (!box) return;
  box.innerHTML = `<section class="blk"><h3>${esc(s.name)} <span class="tag">${esc(s.user)}</span></h3><div id="tslog"><p class="small">Betöltés…</p></div></section>`;
  loadLog($('#tslog'), { student: s.user });
  box.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
}
async function loadLog(el, opt) {
  const t = tMod();
  try {
    const res = await api('tLog', Object.assign(auth(), { group: TV.group, student: opt.student || '', ch: opt.student ? '' : TV.logCh, mod: t.key, onlyWrong: opt.student ? false : TV.onlyWrong, limit: 150 }));
    if (!res.ok) throw new Error(res.error);
    if (!res.rows.length) { el.innerHTML = '<p class="small">Még nincs beküldött megoldás.</p>'; return; }
    el.innerHTML = `<div class="log">${res.rows.map(r => {
      const cls = r.kind === 'megoldas' ? 'rev' : r.ok ? 'ok' : 'no', mk = r.kind === 'megoldas' ? '?' : r.ok ? '✓' : '✗';
      const extra = [r.novel ? 'új feladat' : '', r.emelt2 ? 'emelt: 2×' : '', r.candy ? '+1 cukorka' : '', r.helped && r.kind !== 'megoldas' ? 'megoldás után' : ''].filter(Boolean).join(' · ');
      return `<div class="logi ${cls}"><span class="mk">${mk}</span><div class="q"><div class="small">${opt.student ? '' : `<b>${esc(r.name)}</b> · `}${esc(r.chCim)} · ${esc(r.gen)}</div><div>${esc(r.q)}</div>
        <div>${r.kind === 'megoldas' ? '<span class="small">Megnézte a megoldást.</span>' : `Válasz: <span class="ans">${esc(r.a)}</span>${r.ok ? '' : ` <span class="small">· helyes: <span class="ans">${esc(r.helyes)}</span></span>`}`}</div></div>
        <div class="meta">${fmtTime(r.t)}${extra ? '<br>' + esc(extra) : ''}</div></div>`; }).join('')}</div>`;
    typeset(el);
  } catch (e) { el.innerHTML = `<p class="err">Nem sikerült betölteni: ${esc(e.message)}</p>`; }
}

/* ===================== Útválasztás, indulás ===================== */
const currentId = () => decodeURIComponent((location.hash || '').slice(1)) || 'start';
/* '11/hatvany' → fejezet; '11/proba-hgl' → próba; régi '#hatvany' alak az aktuális évfolyamban. */
function feloldUt(id) {
  const [kid, rest] = id.includes('/') ? id.split('/', 2) : [K && K.id, id];
  const k = KS.find(x => x.id === kid);
  if (!k || !rest) return null;
  if (k.fej[rest]) return { k, ch: k.fej[rest].ch, t: k.fej[rest].t };
  if (rest.startsWith('proba-')) { const t = k.temakorok.find(x => x.id === rest.slice(6)); if (t) return { k, t, proba: true }; }
  return null;
}
function route() {
  if (!K) return;
  $('#layout').classList.remove('solo');
  redraw = null;
  const id = currentId();
  const u = feloldUt(id);
  if (u) { setKurzus(u.k.id); setTema(u.t.id); }
  if (u && u.ch) renderChapter(u.ch);
  else if (u && u.proba) renderProba(u.t);
  else if (id === 'tanar') renderTeacher();
  else if (id === 'dolgozat') renderDolgozat();
  else if (id === 'hazi' || id.startsWith('hazi/')) renderHazi(id.slice(5));
  else renderHome();
  if (!id.startsWith('hazi')) haziSav();
  renderToc(u ? (u.ch ? u.ch.key : `${u.k.id}/proba-${u.t.id}`) : id);
  renderStats(); renderAcct();
}
window.addEventListener('hashchange', () => {
  route();
  const m = $('#main'); const top = m.getBoundingClientRect().top + window.scrollY - 12;
  if (window.scrollY > top) window.scrollTo({ top, behavior: 'auto' });
});
async function startCourse() {
  const ids = kurzusLista();
  const loaded = [];
  for (const id of ids) {
    try { loaded.push(await betoltKurzus(id)); }
    catch (e) { BETOLTESI_HIBAK.push(e.message); }
  }
  if (!loaded.length) {
    $('#main').innerHTML = `<p class="err">${esc(BETOLTESI_HIBAK.join(' · ') || 'Nincs betölthető tananyag.')}</p><p class="small">Ellenőrizd a tananyag mappáját és a kurzus.js fájlt.</p>`;
    throw new Error('Nincs tananyag');
  }
  KS = loaded;
  const saved = lsGet(kurzusKey());
  K = KS.find(k => k.id === saved) || KS[0];
  aktTema = null;
  if (BETOLTESI_HIBAK.length) console.warn('Tananyag-betöltési hibák:', BETOLTESI_HIBAK);
  renderHeader(); route();
}
const statusSnapshot = () => JSON.stringify([store.gl || {}, store.gk || {}, (store.hk || []).map(h => h.id)]) + KS.map(k => k.temakorok.map(t => t.fejezetek.map(chStatus).join(',') + (probaNyitva(t) ? '+' : '')).join('|')).join('#');
async function boot() {
  renderHeader();
  if (!ENDPOINT) {
    profile = { role: 'diak', name: '', local: true };
    loadStore();
    try { await startCourse(); } catch (e) {}
    return;
  }
  sess = lsGet('mg:sess');
  if (!(sess && sess.user && sess.token && sess.profile)) { sess = null; return renderLogin(); }
  profile = sess.profile;
  loadStore();
  try { await startCourse(); } catch (e) { return; }
  setSync('saving');
  const before = statusSnapshot();
  try {
    const res = await api('load', auth());
    if (!res.ok) { if (res.error === 'auth') return authLost(); throw new Error(res.error); }
    const oldCourses = kurzusLista().join(',');
    applyProfile(res.profile);
    store.gu = res.groupUnlock || {}; store.gl = res.groupLevel || {}; store.gk = res.groupLimit || {}; store.hk = res.hazik || [];
    store.state = Szabalyok.normal(res.state);
    if (kurzusLista().join(',') !== oldCourses) { await startCourse(); }
    store.queue.forEach(ev => Szabalyok.alkalmaz(store.state, ev, ctx()));
    Szabalyok.frissit(store.state, ctx());
    saveStore();
    setSync('saved');
    if (statusSnapshot() !== before) route(); else refreshChrome();
    if (store.queue.length || store.tests.length) scheduleSync(400);
  } catch (e) { setSync('error'); }
}
boot();

/* Tesztekhez és hibakereséshez */
window.__mg = { get store() { return store; }, get K() { return K; }, get KS() { return KS; }, syncNow, route, ctx };
})();
