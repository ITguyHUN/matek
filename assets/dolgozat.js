/*
 * Matek gyakorló – dolgozat- és témazáró-készítő (tanári eszköz).
 * A tanár kiválasztja, melyik feladattípusból hány részfeladatot kér, és hogy melyik feladatba kerüljön
 * (egy feladatban több típus is lehet, típusonként külön pontszámmal); a részfeladatok a), b), c) …
 * jelet kapnak. Tetszőleges számú csoport (A, B, C, …) és megoldókulcs is kérhető.
 * Letöltés: .docx (a képletek képként) és PDF (a böngésző nyomtatásával: „Mentés PDF-ként”).
 */
(function () {
'use strict';
const BETUK = 'abcdefghijklmnopqrstuvwxyz';
const CSOPORT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let H = null;          // az app.js segédfüggvényei
let DG = null;         // a készítő állapota
let EREDMENY = null;   // a legutóbb generált dolgozat

const $ = (q, el = document) => el.querySelector(q);
const lsKey = kid => 'mg:dolgozat:' + kid;
const JEGYEK = [5, 4, 3, 2, 1];
const SORSZ = { 5: '5-ös', 4: '4-es', 3: '3-as', 2: '2-es' };
const ALAP_PCT = [85, 70, 55, 40];   // az 5, 4, 3, 2 alsó határa százalékban

function render(helpers) {
  H = helpers;
  const m = H.main();
  const KS = H.KS();
  if (!KS.length) { m.innerHTML = '<p>Nincs betöltött tananyag.</p>'; return; }
  if (!DG || !KS.some(k => k.id === DG.kid)) DG = alapAllapot(KS[0].id);
  m.innerHTML = `<div class="eyebrow">Tanári eszköz</div><h2 class="ch">Dolgozatkészítő</h2>
    <p class="lead">Add meg, melyik feladattípusból hány részfeladatot kérsz. Alapból minden típus külön feladat lesz a), b), c)… részekkel; a <b>feladat</b> mezőben megadhatod, melyik feladatba kerüljön (így egy feladatban több típus is lehet), a <b>pont</b> mezőben pedig, hány pontot ér egy részfeladata. A <b>Témazáró</b> gomb egy témakör minden feladattípusát kitölti.</p>
    <section class="blk dg-beall"><h3>Beállítások</h3><div class="tctrl">
      ${KS.length > 1 ? `<label for="dgk">Évfolyam<select id="dgk">${KS.map(k => `<option value="${H.esc(k.id)}" ${k.id === DG.kid ? 'selected' : ''}>${H.esc(k.cim)}</option>`).join('')}</select></label>` : ''}
      <label for="dgc">Cím<input id="dgc" type="text" value="${H.esc(DG.cim)}"></label>
      <label for="dgv">Csoportok száma<span class="dg-egys"><input id="dgv" type="number" min="1" max="26" value="${DG.valt}" style="width:4.5em"><span class="dg-me" id="dgvb">${csopBetuk(DG.valt)}</span></span></label>
      <label for="dgh">Hely a megoldásnak<select id="dgh">${[['0', 'nincs'], ['1', 'kevés'], ['2', 'közepes'], ['3', 'sok']].map(([v, n]) => `<option value="${v}" ${+v === DG.hely ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label for="dgp">Alap pont / részfeladat<input id="dgp" type="number" min="1" max="10" value="${DG.pont}" style="width:5em"></label>
    </div><div class="tctrl dg-chk">
      <label class="chk"><input type="checkbox" id="dgnev" ${DG.nev ? 'checked' : ''}> Név, osztály, dátum sor</label>
      <label class="chk"><input type="checkbox" id="dgptab" ${DG.ptab ? 'checked' : ''}> Ponttáblázat</label>
      <label class="chk"><input type="checkbox" id="dgjegy" ${DG.jegy ? 'checked' : ''}> Ponthatárok (jegyek)</label>
      <label class="chk"><input type="checkbox" id="dgkulcs" ${DG.kulcs ? 'checked' : ''}> Megoldókulcs</label>
      <label class="chk"><input type="checkbox" id="dgreszl" ${DG.reszl ? 'checked' : ''}> Részletes megoldások a kulcsban</label>
    </div><div class="tctrl dg-hatar">
      <label for="dghm">Ponthatárok megadása<select id="dghm"><option value="pct" ${DG.hm === 'pct' ? 'selected' : ''}>százalékban</option><option value="pont" ${DG.hm === 'pont' ? 'selected' : ''}>pontban</option></select></label>
      ${[5, 4, 3, 2].map((j, i) => `<label>${SORSZ[j]} alsó határa<span class="dg-egys"><input type="number" min="0" data-hat="${i}" value="${hatarErtekek()[i]}" style="width:5.5em"><span class="dg-me">${DG.hm === 'pont' ? 'pont' : '%'}</span></span></label>`).join('')}
    </div><p class="small" id="dghprev"></p></section>
    <section class="blk"><h3>Feladatok <span class="tag" id="dgossz"></span></h3>
      <div class="tctrl dg-listafej"><button class="btn sm" id="dgnull">Minden darabszám 0</button>
        <label class="chk"><input type="checkbox" id="dgcsak" ${DG.csak ? 'checked' : ''}> csak a kiválasztott típusok látszanak</label></div>
      <div id="dglista" class="${DG.csak ? 'dg-csak' : ''}"></div>
      <div class="ansrow" style="margin-top:12px"><button class="btn primary" id="dggen">Dolgozat generálása</button></div></section>
    <div id="dgout"></div>`;
  const kurzus = () => KS.find(k => k.id === DG.kid);
  const listaRajz = () => { $('#dglista').innerHTML = listaHtml(kurzus()); osszesit(); };
  listaRajz();
  const kk = $('#dgk'); if (kk) kk.onchange = e => { ment(); DG = alapAllapot(e.target.value); render(H); };
  const opt = () => {
    const regiPont = DG.pont;
    DG.cim = $('#dgc').value; DG.valt = Math.max(1, Math.min(26, Math.round(+$('#dgv').value || 1))); DG.hely = +$('#dgh').value; DG.pont = Math.max(1, Math.min(10, +$('#dgp').value || 1));
    $('#dgvb').textContent = csopBetuk(DG.valt);
    if (regiPont !== DG.pont) document.querySelectorAll('[data-rp]').forEach(x => { x.placeholder = DG.pont; });
    DG.nev = $('#dgnev').checked; DG.jegy = $('#dgjegy').checked; DG.ptab = $('#dgptab').checked; DG.kulcs = $('#dgkulcs').checked; DG.reszl = $('#dgreszl').checked; ment(); osszesit();
  };
  $('.dg-beall').addEventListener('change', e => { if (!e.target.closest('.dg-hatar')) opt(); });
  $('#dgc').addEventListener('input', opt); $('#dgv').addEventListener('input', opt);
  $('#dgcsak').onchange = e => { DG.csak = e.target.checked; $('#dglista').classList.toggle('dg-csak', DG.csak); ment(); };
  /* ponthatárok: százalék ↔ pont váltáskor átszámolja az értékeket a jelenlegi összpontszámmal */
  $('#dghm').onchange = e => {
    const ossz = osszPont(), uj = e.target.value;
    if (uj === DG.hm) return;
    if (uj === 'pont') DG.hpt = DG.hp.map(p => Math.ceil(ossz * p / 100));
    else if (ossz) DG.hp = DG.hpt.map(v => Math.round(100 * v / ossz));
    DG.hm = uj; ment();
    document.querySelectorAll('[data-hat]').forEach((x, i) => { x.value = hatarErtekek()[i]; });
    document.querySelectorAll('.dg-me').forEach(x => { x.textContent = uj === 'pont' ? 'pont' : '%'; });
    osszesit();
  };
  $('.dg-hatar').addEventListener('input', e => {
    const i = e.target.closest('[data-hat]'); if (!i) return;
    const v = Math.max(0, Math.round(+i.value || 0));
    (DG.hm === 'pont' ? DG.hpt : DG.hp)[+i.dataset.hat] = DG.hm === 'pont' ? v : Math.min(100, v);
    ment(); osszesit();
  });
  $('#dglista').addEventListener('input', e => {
    const x = e.target.closest('input[data-rp],input[data-fsz],input[data-db]'); if (!x) return;
    const [mezo, max] = x.dataset.rp ? ['rp', 100] : x.dataset.fsz ? ['fsz', 99] : ['db', 26];
    const k = x.dataset[mezo], v = Math.max(0, Math.min(max, Math.round(+x.value || 0)));
    if (v) DG[mezo][k] = v; else delete DG[mezo][k];
    if (mezo === 'db') x.closest('.dg-tipus').classList.toggle('on', !!v);
    ment(); osszesit();
  });
  $('#dglista').addEventListener('click', e => {
    /* fejezetenként: minden típus ugyanarra a számra, illetve nullázás */
    const fb = e.target.closest('[data-fejmind],[data-fejnull]');
    if (fb) {
      const ck = fb.dataset.fejmind || fb.dataset.fejnull, ch = kurzus().temakorok.flatMap(t => t.fejezetek).find(c => c.key === ck), box = fb.closest('.dg-fej');
      if (!ch) return;
      const n = fb.dataset.fejmind ? Math.max(1, Math.min(26, Math.round(+box.querySelector('.dg-fejdb').value || 1))) : 0;
      if (n) ch.gens.forEach(g => { DG.db[ch.key + '|' + g] = n; }); else nullaz([ch]);
      box.querySelectorAll('[data-db]').forEach(i => { i.value = n; i.closest('.dg-tipus').classList.toggle('on', !!n); });
      if (!n) box.querySelectorAll('[data-fsz]').forEach(i => { i.value = ''; });
      ment(); osszesit();
      return;
    }
    const nb = e.target.closest('[data-tznull]');
    if (nb) { const t = kurzus().temakorok.find(x => x.id === nb.dataset.tznull); nullaz(t.fejezetek); listaRajz(); H.toast(`Nullázva: ${H.esc(t.cim)}`); return; }
    const b = e.target.closest('[data-tz]'); if (!b) return;
    const t = kurzus().temakorok.find(x => x.id === b.dataset.tz);
    const box = b.closest('.dg-tema'), db = Math.max(1, Math.min(26, +box.querySelector('.dg-tzdb').value || 2)), csakKozep = box.querySelector('.dg-tzsz').value === 'kozep';
    temazaro(t, db, csakKozep);
    $('#dgc').value = DG.cim; listaRajz();
    H.toast(`A témazáró feladatai kitöltve: ${H.esc(t.cim)}${csakKozep ? ' (csak közép szint)' : ''}.`);
  });
  $('#dgnull').onclick = () => { DG.db = {}; DG.fsz = {}; ment(); listaRajz(); };
  $('#dggen').onclick = () => generalas(kurzus());
}

function alapAllapot(kid) {
  let s = null; try { s = JSON.parse(localStorage.getItem(lsKey(kid)) || 'null'); } catch (e) {}
  const d = Object.assign({ kid, cim: 'Dolgozat', valt: 2, hely: 2, pont: 1, nev: true, jegy: true, ptab: true, kulcs: true, reszl: false, csak: false,
    db: {}, rp: {}, fsz: {}, hm: 'pct', hp: ALAP_PCT.slice(), hpt: [0, 0, 0, 0] }, s || {}, { kid });
  ['db', 'rp', 'fsz'].forEach(k => { if (!d[k] || typeof d[k] !== 'object') d[k] = {}; });
  delete d.fp;   // régi formátum (feladatonkénti összpont) – már részfeladatonkénti pont van
  if (!Array.isArray(d.hp) || d.hp.length !== 4) d.hp = ALAP_PCT.slice();
  if (!Array.isArray(d.hpt) || d.hpt.length !== 4) d.hpt = [0, 0, 0, 0];
  return d;
}
const hatarErtekek = () => DG.hm === 'pont' ? DG.hpt : DG.hp;
const csopBetuk = n => n <= 1 ? 'egy változat' : n <= 6 ? CSOPORT.slice(0, n).split('').join(', ') : `A–${CSOPORT[n - 1]}`;
/* egy részfeladat pontszáma: a típusnál megadott érték, vagy az alap pont/részfeladat */
const reszPont = k => DG.rp[k] || DG.pont;
const osszPont = () => { const K = H.KS().find(k => k.id === DG.kid); return K ? kivalasztott(K).reduce((a, x) => a + x.p, 0) : 0; };
function nullaz(fejezetek) {
  ['db', 'fsz'].forEach(m => Object.keys(DG[m]).forEach(k => { if (fejezetek.some(ch => k.startsWith(ch.key + '|'))) delete DG[m][k]; }));
  ment();
}
function ment() { try { localStorage.setItem(lsKey(DG.kid), JSON.stringify(DG)); } catch (e) {} }

function listaHtml(K) {
  return K.temakorok.map(t => `<details class="dg-tema" open><summary><b>${H.esc(t.cim)}</b></summary>
    <div class="tctrl dg-tzrow"><button class="btn sm" data-tz="${H.esc(t.id)}">Témazáró ebből a témakörből</button><button class="btn sm ghost" data-tznull="${H.esc(t.id)}">Témakör nullázása</button>
      <label>részfeladat / típus<input class="dg-tzdb" type="number" min="1" max="26" value="2" style="width:4.5em"></label>
      <label>szint<select class="dg-tzsz"><option value="emelt">minden feladat</option><option value="kozep">csak közép</option></select></label></div>
    ${t.fejezetek.map(ch => `<div class="dg-fej"><div class="dg-fejcim"><span>${String(ch.idx + 1).padStart(2, '0')}. ${H.esc(ch.cim)} ${ch.szint === 'emelt' ? H.szintCimke('emelt', K) : ''}</span>
      <span class="dg-fejall"><input type="number" min="1" max="26" value="2" class="dg-fejdb" aria-label="részfeladat minden típushoz" title="ennyi részfeladat a fejezet minden típusából"><button class="btn sm" data-fejmind="${H.esc(ch.key)}" title="a fejezet minden típusa erre a számra">minden típushoz</button><button class="btn sm ghost" data-fejnull="${H.esc(ch.key)}" title="a fejezet minden típusa 0">nullázás</button></span></div>
      ${ch.gens.map(g => { const k = H.esc(ch.key + '|' + g); return `<div class="dg-tipus${DG.db[ch.key + '|' + g] ? ' on' : ''}"><input type="number" min="0" max="26" data-db="${k}" value="${DG.db[ch.key + '|' + g] || 0}" title="részfeladatok száma" aria-label="részfeladatok száma"><span class="dg-tnev">${H.esc(ch.feladatok[g].nev || g)} ${H.szintCimke(ch.genSzint[g], K)}</span><label class="dg-fpl">feladat<input type="number" min="1" max="99" data-fsz="${k}" value="${DG.fsz[ch.key + '|' + g] || ''}" placeholder="–" title="melyik feladatba kerüljön (üresen: külön feladat)"></label><label class="dg-fpl">pont<input type="number" min="1" max="100" data-rp="${k}" value="${DG.rp[ch.key + '|' + g] || ''}" placeholder="${DG.pont}" title="egy részfeladat pontszáma (üresen: alap pont)"></label></div>`; }).join('')}</div>`).join('')}
  </details>`).join('');
}
function kivalasztott(K) {
  const out = [];
  K.temakorok.forEach(t => t.fejezetek.forEach(ch => ch.gens.forEach(g => { const k = ch.key + '|' + g, n = DG.db[k]; if (n) out.push({ t, ch, g, k, n, rp: reszPont(k), p: n * reszPont(k) }); })));
  // feladatba sorolás: a megadott sorszám, különben a típus saját helye a listában
  out.forEach((x, i) => { x.szam = DG.fsz[x.k] || (i + 1); x.sajat = !DG.fsz[x.k]; x.poz = i; });
  const sorrend = [...new Set(out.slice().sort((a, b) => a.szam - b.szam || a.poz - b.poz).map(x => x.szam))];
  out.forEach(x => { x.feladat = sorrend.indexOf(x.szam) + 1; });
  return out;
}
/* A kiválasztott típusok feladatokba csoportosítva: [[típus, …], …] */
function csoportosit(l) {
  const m = new Map();
  l.slice().sort((a, b) => a.feladat - b.feladat || a.poz - b.poz).forEach(x => { if (!m.has(x.feladat)) m.set(x.feladat, []); m.get(x.feladat).push(x); });
  return [...m.values()];
}
function osszesit() {
  const K = H.KS().find(k => k.id === DG.kid), l = kivalasztott(K);
  const resz = l.reduce((a, x) => a + x.n, 0);
  const ossz = l.reduce((a, x) => a + x.p, 0);
  const fdb = new Set(l.map(x => x.feladat)).size;
  const el = $('#dgossz'); if (el) el.textContent = l.length ? `${fdb} feladat · ${l.length} típus · ${resz} részfeladat · ${ossz} pont` : 'még nincs kiválasztva';
  // a „feladat” mezők helykitöltője: hányadik feladatba kerül most a típus
  const hol = {}; l.forEach(x => { hol[x.k] = x.feladat; });
  document.querySelectorAll('[data-fsz]').forEach(i => { i.placeholder = hol[i.dataset.fsz] ? `${hol[i.dataset.fsz]}.` : '–'; });
  const pv = $('#dghprev');
  if (pv) {
    const L = alsoHatarok(ossz, DG), rossz = L.slice(0, 4).some((v, i) => i < 3 && v <= L[i + 1]);
    pv.innerHTML = !ossz ? 'A ponthatárok a feladatok kiválasztása után látszanak.'
      : `Összesen ${ossz} pont → ` + hatarok(ossz, DG).map((h, i) => `<b>${JEGYEK[i]}</b>: ${h}`).join(' · ') +
        (rossz ? ' <span class="err">· A határoknak jegyenként csökkenniük kell!</span>' : '') + (DG.hm === 'pont' && L[0] > ossz ? ' <span class="err">· Az 5-ös határa nagyobb az összpontszámnál!</span>' : '');
  }
}
function temazaro(t, db, csakKozep) {
  nullaz(t.fejezetek);
  t.fejezetek.forEach(ch => ch.gens.forEach(g => {
    if (ch.feladatok[g].proba === false) return;
    if (csakKozep && ch.genSzint[g] === 'emelt') return;
    DG.db[ch.key + '|' + g] = db;
  }));
  DG.cim = `Témazáró – ${t.cim}`;
  ment();
}

/* ---------- generálás ---------- */
const tisztit = html => {
  const d = document.createElement('div'); d.innerHTML = html;
  d.querySelectorAll('input,button,canvas,script,style,.ansrow,.fmt').forEach(x => x.remove());
  return d.innerHTML.trim();
};
const elsoP = html => { const m = /^\s*(<p>[\s\S]*?<\/p>)/.exec(html); return m ? m[1] : null; };
function feladatResz(x) {
  const items = [], seen = new Set();
  for (let guard = 0; items.length < x.n && guard < x.n * 25; guard++) {
    let it; try { it = H.feladatKeszit(x.ch, x.g); } catch (e) { break; }
    if (seen.has(it.p.kerdes)) continue;
    seen.add(it.p.kerdes);
    items.push({ kerdes: tisztit(it.p.kerdes), valasz: it.p.valasz, megoldas: it.p.megoldas || [] });
  }
  // közös utasítás (azonos első bekezdés) kiemelése a feladat fejlécébe
  let utasitas = '';
  const e0 = items.length ? elsoP(items[0].kerdes) : null;
  if (e0 && items.every(i => elsoP(i.kerdes) === e0)) { utasitas = e0.replace(/^<p>|<\/p>$/g, ''); items.forEach(i => { i.kerdes = i.kerdes.replace(e0, '').trim(); }); }
  items.forEach(i => { i.rp = x.rp; });
  return { nev: x.ch.feladatok[x.g].nev || x.g, utasitas, items, rp: x.rp, ch: x.ch };
}
/* Egy feladat egy vagy több típusból: a részfeladatok betűjele folytatólagos, mindegyiknél a saját pontja. */
function feladat(tipusok) {
  const reszek = tipusok.map(feladatResz).filter(r => r.items.length);
  if (!reszek.length) return null;
  let utasitas = '';
  if (reszek.length === 1) utasitas = reszek[0].utasitas || H.esc(reszek[0].nev);
  else if (reszek[0].utasitas && reszek.every(r => r.utasitas === reszek[0].utasitas)) utasitas = reszek[0].utasitas;
  else reszek.forEach(r => { if (r.utasitas) r.items[0].elo = r.utasitas; });   // a típus saját utasítása az első részfeladata előtt
  const items = [].concat(...reszek.map(r => r.items));
  return { utasitas, items, pont: items.reduce((a, i) => a + i.rp, 0) };
}
function generalas(K) {
  const l = kivalasztott(K);
  if (!l.length) { H.toast('Előbb adj meg darabszámot legalább egy feladattípusnál.'); return; }
  const cs = csoportosit(l);
  const valtozatok = Array.from({ length: DG.valt }, (_, v) => ({ betu: DG.valt > 1 ? CSOPORT[v] : '', feladatok: cs.map(feladat).filter(Boolean) }));
  EREDMENY = { opt: Object.assign({}, DG), K, valtozatok };
  const out = $('#dgout');
  out.innerHTML = `<section class="blk"><h3>Előnézet</h3>
    <div class="ansrow dg-gombok"><button class="btn primary" id="dgdocx">Letöltés: Word (.docx)</button><button class="btn primary" id="dgpdf">Letöltés: PDF</button><button class="btn ghost" id="dgujra">Új feladatok (újragenerálás)</button><span class="small" id="dgst"></span></div>
    <p class="small">PDF: a megnyíló nyomtatási ablakban válaszd a <b>Mentés PDF-ként</b> célt. A Word-fájlban a képletek képként szerepelnek, a szöveg szerkeszthető.</p>
    <div id="dgnyomtat">${nyomtatHtml(EREDMENY)}</div></section>`;
  H.typeset($('#dgnyomtat'));
  $('#dgujra').onclick = () => generalas(K);
  $('#dgpdf').onclick = pdf;
  $('#dgdocx').onclick = () => docx().catch(e => { $('#dgst').textContent = 'Hiba: ' + e.message; });
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
const helyPx = h => [0, 50, 110, 200][h] || 0;
function valasztasHtml(v) { return v && v.valasztas ? `<p class="dg-val">${v.valasztas.map((o, i) => `<span>${String.fromCharCode(65 + i)}) ${H.esc(o)}</span>`).join('\u2003\u2003')}</p>` : ''; }
function nyomtatHtml(E) {
  const o = E.opt;
  const lapok = E.valtozatok.map((V, vi) => {
    const ossz = V.feladatok.reduce((a, f) => a + f.pont, 0);
    return `<div class="dg-lap" data-v="${vi}">
      <div class="dg-fejlec"><div class="dg-cim">${H.esc(o.cim)}${V.betu ? ` <span class="dg-csop">${V.betu} csoport</span>` : ''}</div>
      ${o.nev ? '<div class="dg-nevsor"><span>Név: ______________________________</span><span>Osztály: ________</span><span>Dátum: ____________</span></div>' : ''}</div>
      ${V.feladatok.map((f, fi) => `<div class="dg-f"><div class="dg-fcim" data-u="${vi}-${fi}"><b>${fi + 1}.</b> <span class="dg-ut">${f.utasitas}</span><span class="dg-pont">…… / ${f.pont} pont</span></div>
        ${f.items.map((it, ii) => `${it.elo ? `<div class="dg-elo" data-e="${vi}-${fi}-${ii}">${it.elo}</div>` : ''}<div class="dg-r" data-k="${vi}-${fi}-${ii}"><span class="dg-betu">${f.items.length > 1 ? BETUK[ii] + ')' : ''}</span><div class="dg-rt">${it.kerdes}${valasztasHtml(it.valasz)}</div>${f.items.length > 1 ? `<span class="dg-rpont">(${it.rp} p)</span>` : ''}</div>${o.hely ? `<div class="dg-hely" style="height:${helyPx(o.hely)}px"></div>` : ''}`).join('')}</div>`).join('')}
      ${o.ptab ? ponttablazat(V.feladatok, ossz).map(sorok => `<table class="dg-ptab">${sorok.map((r, ri) => `<tr>${r.map((c, ci) => ci === 0 ? `<th>${c}</th>` : ri === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`).join('') : `<div class="dg-ossz">Összesen: …… / ${ossz} pont</div>`}
      ${o.jegy ? `<table class="dg-jegy"><tr><th>Jegy</th>${JEGYEK.map(j => `<td>${j}</td>`).join('')}</tr><tr><th>Pont</th>${hatarok(ossz, o).map(h => `<td>${h}</td>`).join('')}</tr></table>` : ''}
    </div>`;
  }).join('');
  const kulcs = o.kulcs ? E.valtozatok.map((V, vi) => `<div class="dg-lap dg-kulcs"><div class="dg-cim">Megoldókulcs – ${H.esc(o.cim)}${V.betu ? ` · ${V.betu} csoport` : ''}</div>
    ${V.feladatok.map((f, fi) => `<div class="dg-kf"><b>${fi + 1}.</b> ${f.items.map((it, ii) => `<span class="dg-kv">${f.items.length > 1 ? BETUK[ii] + ') ' : ''}${H.esc(H.valaszSzoveg(it.valasz))}</span>`).join('')}
      ${o.reszl ? f.items.map((it, ii) => `<div class="dg-reszl" data-m="${vi}-${fi}-${ii}">${f.items.length > 1 ? `<b>${BETUK[ii]})</b> ` : ''}${it.megoldas.map(x => /^\s*\\\[/.test(x) ? `<div>${x}</div>` : `<p>${x}</p>`).join('')}</div>`).join('') : ''}</div>`).join('')}</div>`).join('') : '';
  return lapok + kulcs;
}
/* Az 5, 4, 3, 2, 1 alsó határa pontban (o.hm: 'pct' → százalékból számolva, 'pont' → a megadott pontok). */
function alsoHatarok(ossz, o) {
  const L = o.hm === 'pont' ? o.hpt.map(v => Math.max(0, Math.round(+v || 0))) : o.hp.map(p => Math.ceil(ossz * (+p || 0) / 100));
  return L.concat([0]);
}
/* Pontsávok jegyenként (5 → 1), pl. '26–30' */
function hatarok(ossz, o) {
  const L = alsoHatarok(ossz, o);
  return L.map((also, i) => {
    let felso = i === 0 ? ossz : Math.min(ossz, L[i - 1] - 1);
    also = Math.min(also, ossz);
    return felso < also ? '–' : also === felso ? `${also}` : `${also}–${felso}`;
  });
}
/* Ponttáblázat: Feladat / Max. pont / Elért pont; legfeljebb 12 feladat egy sorban */
function ponttablazat(fel, ossz) {
  const out = [];
  for (let i = 0; i < fel.length; i += 12) {
    const resz = fel.slice(i, i + 12), utolso = i + 12 >= fel.length;
    out.push([
      ['Feladat', ...resz.map((_, j) => `${i + j + 1}.`), ...(utolso ? ['Összesen'] : [])],
      ['Max. pont', ...resz.map(f => `${f.pont}`), ...(utolso ? [`${ossz}`] : [])],
      ['Elért pont', ...resz.map(() => ''), ...(utolso ? [''] : [])]
    ]);
  }
  return out;
}

/* ---------- PDF: nyomtatás ---------- */
function pdf() {
  const regi = document.title, el = $('#dgnyomtat'), hely = el.parentNode, utana = el.nextSibling;
  document.title = (EREDMENY.opt.cim || 'Dolgozat').replace(/[\\/:*?"<>|]+/g, ' ');
  document.body.appendChild(el);   // nyomtatáskor csak a dolgozat látszik (a többi rész display:none)
  document.body.classList.add('dg-print');
  let kesz = false;
  const vissza = () => { if (kesz) return; kesz = true; document.body.classList.remove('dg-print'); hely.insertBefore(el, utana); document.title = regi; window.removeEventListener('afterprint', vissza); };
  window.addEventListener('afterprint', vissza);
  setTimeout(() => { window.print(); setTimeout(vissza, 1500); }, 50);
}

/* ---------- DOCX ---------- */
const TW = 9638;              // szövegszélesség twipben (A4, 2 cm margó)
const PX_PT = 11 * 96 / 72;   // 11 pt betűméret pixelben
async function docx() {
  const st = $('#dgst'); st.textContent = 'Word-fájl készítése…';
  if (window.MathJax && MathJax.startup && MathJax.startup.promise) await Promise.race([MathJax.startup.promise, new Promise(r => setTimeout(r, 8000))]);
  await new Promise(r => setTimeout(r, 30));
  const root = $('#dgnyomtat'), E = EREDMENY, o = E.opt;
  kepSzam = 0; kepOssz = root.querySelectorAll('mjx-container').length;
  const base = parseFloat(getComputedStyle($('.dg-rt', root) || root).fontSize) || 16;
  const skala = PX_PT / base;
  const B = [];
  let li = 0;
  for (const V of E.valtozatok) {
    const vi = li++;
    B.push({ t: 'p', pageBreakBefore: vi > 0, runs: [{ text: o.cim + (V.betu ? ` – ${V.betu} csoport` : ''), b: true, size: 16 }], after: 120 });
    if (o.nev) B.push({ t: 'p', runs: [{ text: 'Név: ______________________________    Osztály: ________    Dátum: ____________' }], after: 240 });
    for (let fi = 0; fi < V.feladatok.length; fi++) {
      const f = V.feladatok[fi];
      const fej = root.querySelector(`[data-u="${vi}-${fi}"] .dg-ut`);
      const fr = await inline(fej, skala);
      B.push({ t: 'p', keepNext: true, before: 200, after: 80, tabs: [-TW], runs: [{ text: `${fi + 1}. `, b: true }, ...fr, { tab: true }, { text: `…… / ${f.pont} pont` }] });
      for (let ii = 0; ii < f.items.length; ii++) {
        const eloEl = f.items[ii].elo && root.querySelector(`[data-e="${vi}-${fi}-${ii}"]`);
        if (eloEl) B.push({ t: 'p', keepNext: true, before: 80, after: 40, indent: { left: 340 }, runs: (await inline(eloEl, skala)).map(r => Object.assign({ i: !r.img }, r)) });
        const el = root.querySelector(`[data-k="${vi}-${fi}-${ii}"] .dg-rt`);
        const bl = await blokkok(el, skala, { left: 567 }, true);
        const betu = f.items.length > 1 ? BETUK[ii] + ')' : '';
        if (bl.length && bl[0].t === 'p' && betu) { bl[0].runs.unshift({ text: betu }, { tab: true }); bl[0].indent = { left: 567, hanging: 340 }; bl[0].tabs = [567, -TW]; }
        else if (betu) bl.unshift({ t: 'p', runs: [{ text: betu }], indent: { left: 567, hanging: 340 }, tabs: [567, -TW] });
        if (betu && bl.length) bl[0].runs.push({ tab: true }, { text: `(${f.items[ii].rp} p)`, color: '555555' });
        if (o.hely && bl.length) bl[bl.length - 1].after = [0, 600, 1300, 2300][o.hely];
        B.push(...bl);
      }
    }
    const ossz = V.feladatok.reduce((a, f) => a + f.pont, 0);
    if (o.ptab) {
      B.push({ t: 'p', before: 240, keepNext: true, runs: [{ text: 'Ponttáblázat', b: true }] });
      ponttablazat(V.feladatok, ossz).forEach(sorok => B.push({ t: 'table', header: true, rows: sorok.map(r => r.map((c, ci) => [{ text: c || ' ', b: ci === 0 }])) }));
    } else B.push({ t: 'p', before: 240, align: 'right', runs: [{ text: `Összesen: …… / ${ossz} pont`, b: true }] });
    if (o.jegy) {
      B.push({ t: 'p', before: 120, keepNext: true, runs: [{ text: 'Ponthatárok', b: true }] });
      B.push({ t: 'table', header: true, rows: [[[{ text: 'Jegy' }], ...JEGYEK.map(j => [{ text: String(j) }])], [[{ text: 'Pont', b: true }], ...hatarok(ossz, o).map(h => [{ text: h }])]] });
    }
  }
  if (o.kulcs) {
    const kulcsLapok = root.querySelectorAll('.dg-kulcs');
    for (let vi = 0; vi < E.valtozatok.length; vi++) {
      const V = E.valtozatok[vi];
      B.push({ t: 'p', pageBreakBefore: true, runs: [{ text: `Megoldókulcs – ${o.cim}${V.betu ? ` · ${V.betu} csoport` : ''}`, b: true, size: 14 }], after: 160 });
      for (let fi = 0; fi < V.feladatok.length; fi++) {
        const f = V.feladatok[fi];
        const runs = [{ text: `${fi + 1}. `, b: true }];
        f.items.forEach((it, ii) => { runs.push({ text: `${f.items.length > 1 ? BETUK[ii] + ') ' : ''}${H.valaszSzoveg(it.valasz)}${ii < f.items.length - 1 ? ';   ' : ''}` }); });
        B.push({ t: 'p', runs, after: 60 });
        if (o.reszl) for (let ii = 0; ii < f.items.length; ii++) {
          const el = kulcsLapok[vi] && kulcsLapok[vi].querySelector(`[data-m="${vi}-${fi}-${ii}"]`);
          if (el) B.push(...await blokkok(el, skala, { left: 567 }));
        }
      }
    }
  }
  const blob = window.Docx.build(B);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = (o.cim || 'dolgozat').replace(/[\\/:*?"<>|]+/g, ' ').trim() + '.docx';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  st.textContent = 'A Word-fájl elkészült.';
}

/* HTML-részlet → docx bekezdések (a MathJax-képletek PNG-képként) */
const BLOKK = /^(P|DIV|H[1-6]|UL|OL|LI|TABLE|SECTION)$/;
async function blokkok(el, skala, indent, balra) {
  const out = []; let cur = [];
  const flush = (extra) => { if (cur.some(r => r.img || (r.text && r.text.trim()))) out.push(Object.assign({ t: 'p', runs: cur, indent: indent ? { left: indent.left } : undefined }, extra || {})); cur = []; };
  async function jar(n, fmt) {
    if (n.nodeType === 3) { const tx = n.nodeValue.replace(/\s+/g, ' '); if (tx.trim() || (tx && cur.length)) cur.push(Object.assign({ text: tx }, fmt)); return; }
    if (n.nodeType !== 1) return;
    const tag = n.tagName;
    if (tag === 'MJX-CONTAINER') {
      const disp = n.getAttribute('display') === 'true';
      const kep = await svgKep(n, skala);
      if (!kep) return;
      if (disp && balra) { cur.push({ img: kep.img, pos: -Math.max(0, kep.img.h * 0.75 - 8) }); flush(); }   // részfeladatban: a betűjel mellé, balra
      else if (disp) { flush(); out.push({ t: 'p', align: 'center', runs: [{ img: kep.img }], indent: indent ? { left: indent.left } : undefined, before: 40, after: 80 }); }
      else cur.push({ img: kep.img, pos: kep.pos });
      return;
    }
    if (tag === 'BR') { cur.push({ br: true }); return; }
    if (tag === 'TABLE') {
      flush();
      const rows = [];
      for (const tr of n.querySelectorAll('tr')) { const r = []; for (const td of tr.children) r.push(await inline(td, skala)); rows.push(r); }
      out.push({ t: 'table', rows, header: !!n.querySelector('th'), indent: indent ? indent.left : 0 });
      return;
    }
    const f2 = Object.assign({}, fmt);
    if (tag === 'B' || tag === 'STRONG') f2.b = true;
    if (tag === 'I' || tag === 'EM') f2.i = true;
    if (tag === 'SUP') f2.sup = true;
    if (tag === 'SUB') f2.sub = true;
    const blokk = BLOKK.test(tag);
    if (blokk) flush();
    for (const c of Array.from(n.childNodes)) await jar(c, f2);
    if (blokk) flush();
  }
  for (const c of Array.from(el ? el.childNodes : [])) await jar(c, {});
  flush();
  return out;
}
async function inline(el, skala) {
  const bl = await blokkok(el, skala);
  const runs = [];
  bl.forEach((b, i) => { if (b.t === 'p') { if (i) runs.push({ text: ' ' }); runs.push(...b.runs); } });
  return runs;
}
/* MathJax SVG → PNG (a globális glifgyorsítótár hivatkozásait beemeli) */
let kepSzam = 0, kepOssz = 0;
async function svgKep(cont, skala) {
  kepSzam++;
  if (kepSzam % 10 === 0) { const st = $('#dgst'); if (st) st.textContent = `Word-fájl készítése… (${kepSzam}/${kepOssz} képlet)`; }
  const svg = cont.querySelector('svg'); if (!svg) return null;
  const r = svg.getBoundingClientRect(); if (!r.width || !r.height) return null;
  const NS = 'http://www.w3.org/2000/svg', XL = 'http://www.w3.org/1999/xlink';
  const c = svg.cloneNode(true);
  const defs = document.createElementNS(NS, 'defs'), volt = new Set();
  c.querySelectorAll('use').forEach(u => {
    const id = (u.getAttribute('xlink:href') || u.getAttribute('href') || '').replace(/^#/, '');
    if (id && !volt.has(id)) { volt.add(id); const d = document.getElementById(id); if (d) defs.appendChild(d.cloneNode(true)); }
  });
  c.insertBefore(defs, c.firstChild);
  c.setAttribute('xmlns', NS); c.setAttribute('xmlns:xlink', XL);
  c.setAttribute('width', r.width); c.setAttribute('height', r.height);
  c.setAttribute('color', '#000'); c.style.color = '#000';
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(c));
  const img = new Image(); img.src = src;
  const ido = (pr, ms) => Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error('időtúllépés')), ms))]);
  try { await ido(img.decode(), 5000); } catch (e) { return null; }
  const k = 3, cv = document.createElement('canvas');
  cv.width = Math.ceil(r.width * k); cv.height = Math.ceil(r.height * k);
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
  let blob;
  try { blob = await ido(new Promise(res => cv.toBlob(res, 'image/png')), 5000); } catch (e) { blob = null; }
  if (!blob) return null;
  const data = new Uint8Array(await blob.arrayBuffer());
  // függőleges igazítás: a vertical-align (ex) → félpont
  const va = /vertical-align:\s*(-?[\d.]+)ex/.exec(svg.getAttribute('style') || '');
  const hEx = parseFloat(svg.getAttribute('height')) || 0;
  const exPx = hEx ? r.height / hEx : 0;
  const pos = va && exPx ? parseFloat(va[1]) * exPx * skala * 0.75 * 2 : 0;
  return { img: { data, w: r.width * skala, h: r.height * skala }, pos };
}

window.Dolgozat = { render };
})();
