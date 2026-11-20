/*
 * Matek gyakorló – koordináta-rendszer.
 *  - Grafikon.kep({ ablak, gorbek, pontok })  kész ábra (SVG) a kérdésbe, megoldásba, dolgozatba;
 *  - Grafikon.mezo(hely, valasz, o)           pontlerakós bevitel: a diák rácspontokat jelöl be, a görbét a program húzza meg;
 *  - Grafikon.ellenoriz(valasz, be)           a bejelölt pontok ellenőrzése.
 * Függvényábrázolásnál (valasz: { grafikon: 'x^2-4x+3', fajta: 'parabola' }) két pont határozza meg a grafikont:
 * a jellegzetes pont (tengelypont, töréspont, kezdőpont) és még egy; egyenesnél bármely két pontja.
 * Leírás a feladatíróknak: tananyag/README.md („Grafikon mint válasz”). Tesztek: test/grafikon.test.cjs
 */
(function (root) {
  const K = typeof module === 'object' && module.exports ? require('./kifejezes.js') : root.Kifejezes;
  const ALAP = [-6, 6, -6, 6];   // xmin, xmax, ymin, ymax
  const hu = n => String(Math.round(n * 1000) / 1000).replace('-', '−').replace('.', ',');

  /* Két pontból függvény. null: a két pont így nem határoz meg grafikont (a `hiba` szöveg mondja meg, miért). */
  const FAJTAK = {
    egyenes: { cimkek: ['A', 'B'], sugo: 'Jelölj be két pontot, amelyen a grafikon átmegy.', hiba: 'A két pont egymás fölött van – ez nem függvény grafikonja.',
      fv: ([p, q]) => p.x === q.x ? null : x => p.y + (q.y - p.y) / (q.x - p.x) * (x - p.x) },
    parabola: { cimkek: ['T', 'P'], sugo: 'Előbb a tengelypontot (T) jelöld be, utána a grafikon egy másik pontját (P).', hiba: 'A P pont ne a tengelypont fölött vagy alatt legyen.',
      fv: ([t, p]) => p.x === t.x ? null : x => (p.y - t.y) / (p.x - t.x) ** 2 * (x - t.x) ** 2 + t.y },
    abs: { cimkek: ['T', 'P'], sugo: 'Előbb a töréspontot (T) jelöld be, utána a grafikon egy másik pontját (P).', hiba: 'A P pont ne a töréspont fölött vagy alatt legyen.',
      fv: ([t, p]) => p.x === t.x ? null : x => (p.y - t.y) / Math.abs(p.x - t.x) * Math.abs(x - t.x) + t.y },
    gyok: { cimkek: ['K', 'P'], sugo: 'Előbb a kezdőpontot (K) jelöld be, utána a grafikon egy másik pontját (P).', hiba: 'A P pont a kezdőponttól jobbra legyen.',
      fv: ([k, p]) => p.x <= k.x ? null : x => x < k.x ? NaN : (p.y - k.y) / Math.sqrt(p.x - k.x) * Math.sqrt(x - k.x) + k.y }
  };
  const fajtaOf = v => FAJTAK[v.fajta || 'egyenes'];
  const fuggveny = g => typeof g === 'function' ? g : K.fuggveny(g);

  /* ---------- kirajzolás ---------- */
  /* o: { ablak, gorbek: [TeX vagy függvény], hatter: [ugyanígy, halványabban], pontok: [{ x, y, c (címke), kij }], cimke (aria-label) } */
  function svg(o = {}) {
    const [x0, x1, y0, y1] = o.ablak || ALAP, c = 28, m = 16, W = (x1 - x0) * c + 2 * m, H = (y1 - y0) * c + 2 * m;
    const X = x => Math.round((m + (x - x0) * c) * 100) / 100, Y = y => Math.round((m + (y1 - y) * c) * 100) / 100;
    // a vágókeret azonosítója csak az ablaktól függ: ugyanaz az ábra mindig ugyanazt a szöveget adja (a kérdés szövege azonosítja a feladatot)
    const id = `gk${[x0, x1, y0, y1].join('_').replace(/[^\w]/g, 'm')}`;
    const ritka = Math.max(x1 - x0, y1 - y0) > 14 ? 2 : 1, tx = Math.min(Math.max(0, x0), x1), ty = Math.min(Math.max(0, y0), y1);
    let s = '';
    for (let x = Math.ceil(x0); x <= x1; x++) s += `<line x1="${X(x)}" y1="${m}" x2="${X(x)}" y2="${H - m}" stroke="currentColor" stroke-opacity="${x === 0 ? .8 : .16}" stroke-width="${x === 0 ? 1.6 : 1}"/>`;
    for (let y = Math.ceil(y0); y <= y1; y++) s += `<line x1="${m}" y1="${Y(y)}" x2="${W - m}" y2="${Y(y)}" stroke="currentColor" stroke-opacity="${y === 0 ? .8 : .16}" stroke-width="${y === 0 ? 1.6 : 1}"/>`;
    s += '<g font-size="10" fill="currentColor" fill-opacity=".75" font-family="sans-serif">';
    for (let x = Math.ceil(x0); x <= x1; x++) if (x && x % ritka === 0) s += `<text x="${X(x)}" y="${Y(ty) + 12}" text-anchor="middle">${hu(x)}</text>`;
    for (let y = Math.ceil(y0); y <= y1; y++) if (y && y % ritka === 0) s += `<text x="${X(tx) - 5}" y="${Y(y) + 3.5}" text-anchor="end">${hu(y)}</text>`;
    s += `<text x="${W - m + 4}" y="${Y(ty) - 5}" font-style="italic" font-size="12">x</text><text x="${X(tx) + 6}" y="${m - 4}" font-style="italic" font-size="12">y</text></g>`;
    const gorbe = (g, osztaly) => {
      const f = fuggveny(g); let d = '', toll = false;
      for (let k = 0; k <= (x1 - x0) * 20; k++) {
        const x = x0 + k / 20, y = f(x);
        if (!isFinite(y) || y < y0 - 2 || y > y1 + 2) { toll = false; continue; }
        d += `${toll ? 'L' : 'M'}${X(x)} ${Y(y)}`; toll = true;
      }
      return d ? `<path class="${osztaly}" d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" clip-path="url(#${id})"/>` : '';
    };
    s += `<clipPath id="${id}"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}"/></clipPath>`;
    (o.hatter || []).forEach(g => { s += gorbe(g, 'g-hatter'); });
    (o.gorbek || []).forEach(g => { s += gorbe(g, 'g-gorbe'); });
    (o.pontok || []).forEach(p => {
      s += `<circle class="g-pont${p.kij ? ' kijelolt' : ''}" cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" fill="currentColor"/>`;
      if (p.c) s += `<text class="g-cimke" x="${X(p.x) + 9}" y="${Y(p.y) - 8}" font-size="13" font-weight="700" fill="currentColor" font-family="sans-serif">${p.c}</text>`;
    });
    return `<svg class="grafikon" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.cimke || 'Koordináta-rendszer'}" data-w="${W}">${s}</svg>`;
  }
  const kep = o => `<div class="grafikon-kep">${svg(o)}</div>`;

  /* ---------- ellenőrzés ---------- */
  const racs = v => { const [x0, x1, y0, y1] = v.ablak || ALAP, l = v.lepes || 1, ki = []; for (let x = x0; x <= x1 + 1e-9; x += l) for (let y = y0; y <= y1 + 1e-9; y += l) ki.push({ x: +x.toFixed(6), y: +y.toFixed(6) }); return ki; };
  const kulcs = p => `${p.x};${p.y}`, pontT = p => `(${hu(p.x)}; ${hu(p.y)})`;
  /* Ugyanaz a függvény-e a kettő az ablakban. null, ha igen; különben az első eltérés helye (egész helyet keres előbb). */
  function elteres(f, g, v) {
    const [x0, x1, y0, y1] = v.ablak || ALAP, hely = [], lathato = y => !isFinite(y) || (y >= y0 && y <= y1);
    for (let x = Math.ceil(x0); x <= x1; x++) hely.push(x);
    for (let k = 0; k <= (x1 - x0) * 4; k++) hely.push(x0 + k / 4);
    let elso = null;
    for (const x of hely) {
      const a = f(x), b = g(x); if (isFinite(a) === isFinite(b) && (!isFinite(a) || Math.abs(a - b) <= 1e-6)) continue;
      if (lathato(a) && lathato(b)) return { x, a, b };   // olyan ellenpélda kell, amely a rácson is látszik
      elso = elso || { x, a, b };
    }
    return elso;
  }
  /* be: { pontok: [{ x, y }, …] } → { ok: true } | { ok: false, uzenet } | { forma: true, uzenet } */
  function ellenoriz(valasz, be) {
    const p = (be && be.pontok) || [];
    if (valasz.pontok) {   // pontok bejelölése (zérushely, tengelypont, metszéspont …): a sorrend nem számít
      const kell = new Set(valasz.pontok.map(([x, y]) => kulcs({ x, y }))), van = new Set(p.map(kulcs));
      if (van.size !== kell.size) return { ok: false, uzenet: `${van.size} pontot jelöltél be, ${kell.size} kell.` };
      const rossz = p.find(q => !kell.has(kulcs(q)));
      return rossz ? { ok: false, uzenet: `A ${pontT(rossz)} pont nem jó helyen van.` } : { ok: true };
    }
    const F = fajtaOf(valasz);
    if (p.length < 2) return { forma: true, uzenet: 'Jelöld be mind a két pontot.' };
    const f = F.fv(p); if (!f) return { forma: true, uzenet: F.hiba };
    const e = elteres(f, K.fuggveny(valasz.grafikon), valasz);
    if (!e) return { ok: true };
    return { ok: false, uzenet: !isFinite(e.b) ? `Az x = ${hu(e.x)} helyen a függvény nincs értelmezve, a rajzodon mégis van ott pont.`
      : !isFinite(e.a) ? `Az x = ${hu(e.x)} helyen a függvény értéke ${hu(e.b)}, a rajzodon ott nincs grafikon.`
      : `Például az x = ${hu(e.x)} helyen a rajzolt grafikon ${hu(e.a)} magasan jár, a függvény értéke ott ${hu(e.b)}.` };
  }
  /* A helyes grafikont meghatározó két rácspont (megoldáshoz és a tesztekhez). null: a megadott ablakban, rácspontokkal nem rajzolható meg. */
  function megoldasPontok(valasz) {
    if (valasz.pontok) return valasz.pontok.map(([x, y]) => ({ x, y }));
    const F = fajtaOf(valasz), g = K.fuggveny(valasz.grafikon), rajta = racs(valasz).filter(p => { const y = g(p.x); return isFinite(y) && Math.abs(y - p.y) < 1e-9; });
    for (const a of rajta) for (const b of rajta) { if (a === b) continue; const f = F.fv([a, b]); if (f && !elteres(f, g, valasz)) return [a, b]; }
    return null;
  }
  const naplo = (valasz, be) => be.pontok.map((p, i) => `${valasz.pontok ? '' : fajtaOf(valasz).cimkek[i] || ''}(${p.x};${p.y})`).join(' ');

  /* ---------- pontlerakós bevitel ---------- */
  /* Koppintás üres rácspontra: új pont (vagy ha már megvan mind, a kijelölt pont oda ugrik). Koppintás pontra: kijelölés.
   * Egérrel húzni is lehet, a pontok gombjain a nyílbillentyűk is mozgatnak. Vissza: { ertek(), hiany(), lezar(), fokusz() } */
  function mezo(hely, valasz, o = {}) {
    const ab = valasz.ablak || ALAP, lep = valasz.lepes || 1, F = valasz.pontok ? null : fajtaOf(valasz), max = F ? 2 : valasz.legfeljebb || 6;
    const cimke = i => F ? F.cimkek[i] : String.fromCharCode(65 + i);
    let pontok = [], kij = -1, zarva = false, huz = -1, huzott = false;
    hely.innerHTML = `<div class="grafikon-mezo"><p class="small">${F ? F.sugo : 'Koppints a rácspontokra a bejelöléshez.'} A kijelölt pontot új helyre koppintva, egérrel húzva vagy a nyílbillentyűkkel mozgathatod.</p><div class="grafikon-kep" tabindex="-1"></div><div class="g-pontok" role="group" aria-label="${o.cimke || 'Bejelölt pontok'}"></div></div>`;
    const lap = hely.querySelector('.grafikon-kep'), sav = hely.querySelector('.g-pontok');
    const szorit = (n, a, b) => Math.min(b, Math.max(a, n)), illeszt = n => +(Math.round(n / lep) * lep).toFixed(6);
    function rajzol() {
      const f = F && pontok.length === 2 ? F.fv(pontok) : null, fokusz = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.pi : null;
      lap.innerHTML = svg({ ablak: ab, hatter: valasz.rajz ? [valasz.rajz] : [], gorbek: f ? [f] : [], pontok: pontok.map((p, i) => ({ x: p.x, y: p.y, c: cimke(i), kij: i === kij && !zarva })), cimke: 'Koordináta-rendszer, ide jelölheted be a pontokat' });
      sav.innerHTML = pontok.map((p, i) => `<button type="button" class="chip" data-pi="${i}" aria-pressed="${i === kij}" ${zarva ? 'disabled' : ''}>${cimke(i)} ${pontT(p)}</button>`).join('')
        // léptetőgombok: telefonon sűrű a rács, ujjal nehéz pontosan eltalálni egy rácspontot
        + (kij >= 0 && !zarva ? `<span class="g-nyilak" role="group" aria-label="A kijelölt pont léptetése">${[['-1,0', '←', 'balra'], ['0,1', '↑', 'fel'], ['0,-1', '↓', 'le'], ['1,0', '→', 'jobbra']].map(n => `<button type="button" class="btn sm" data-lep="${n[0]}" aria-label="${n[2]}">${n[1]}</button>`).join('')}</span>` : '')
        + (pontok.length && !zarva ? `${F ? '' : '<button type="button" class="btn sm ghost" data-torol="1">Kijelölt törlése</button>'}<button type="button" class="btn sm ghost" data-torol="mind">Újrakezdem</button>` : '');
      if (fokusz != null) { const g = sav.querySelector(`[data-pi="${fokusz}"]`); if (g) g.focus(); }
    }
    const racspont = e => {   // az egér/ujj helye rácspontra kerekítve
      const el = lap.querySelector('svg'), r = el.getBoundingClientRect(), k = +el.dataset.w / r.width;
      return { x: szorit(illeszt(ab[0] + ((e.clientX - r.left) * k - 16) / 28), ab[0], ab[1]), y: szorit(illeszt(ab[3] - ((e.clientY - r.top) * k - 16) / 28), ab[2], ab[3]) };
    };
    const hol = g => pontok.findIndex(p => p.x === g.x && p.y === g.y);
    lap.addEventListener('pointerdown', e => { if (zarva || e.pointerType !== 'mouse') return; const i = hol(racspont(e)); if (i >= 0) { huz = kij = i; huzott = false; lap.setPointerCapture(e.pointerId); } });
    lap.addEventListener('pointermove', e => { if (huz < 0) return; const g = racspont(e); if (hol(g) < 0) { pontok[huz] = g; huzott = true; rajzol(); } });
    lap.addEventListener('pointerup', () => { huz = -1; });
    lap.addEventListener('click', e => {
      if (zarva) return; if (huzott) { huzott = false; return; }
      const g = racspont(e), i = hol(g);
      if (i >= 0) kij = i; else if (pontok.length < max) { pontok.push(g); kij = pontok.length - 1; } else if (kij >= 0) pontok[kij] = g;
      rajzol();
    });
    const leptet = (i, dx, dy) => {   // egy rácslépés; másik pontra nem léphet rá, az ablakból nem megy ki
      const g = { x: szorit(illeszt(pontok[i].x + dx * lep), ab[0], ab[1]), y: szorit(illeszt(pontok[i].y + dy * lep), ab[2], ab[3]) };
      if (hol(g) < 0) { pontok[i] = g; kij = i; rajzol(); }
    };
    sav.addEventListener('click', e => {
      const t = e.target.closest('[data-torol]'), p = e.target.closest('[data-pi]'), l = e.target.closest('[data-lep]');
      if (l) { if (kij >= 0) leptet(kij, ...l.dataset.lep.split(',').map(Number)); return; }
      if (t) { if (t.dataset.torol === 'mind') pontok = []; else if (kij >= 0) pontok.splice(kij, 1); kij = pontok.length - 1; }
      else if (p) kij = +p.dataset.pi; else return;
      rajzol();
    });
    sav.addEventListener('keydown', e => {
      const p = e.target.closest('[data-pi]'), d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!p || !d || zarva) return;
      e.preventDefault(); leptet(+p.dataset.pi, d[0], d[1]);
    });
    rajzol();
    return {
      ertek: () => pontok.length >= (F ? 2 : 1) ? { pontok: pontok.map(p => ({ x: p.x, y: p.y })) } : null,
      hiany: () => F ? 'Jelöld be mind a két pontot a koordináta-rendszerben.' : 'Jelölj be legalább egy pontot.',
      lezar() { zarva = true; rajzol(); }, fokusz() { lap.focus({ preventScroll: true }); }
    };
  }

  const API = { kep, svg, mezo, ellenoriz, megoldasPontok, naplo, FAJTAK };
  if (typeof module === 'object' && module.exports) module.exports = API; else root.Grafikon = API;
})(typeof window !== 'undefined' ? window : globalThis);
