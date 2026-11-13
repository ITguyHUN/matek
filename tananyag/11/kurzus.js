/*
 * 11. évfolyam – tananyag-leíró
 * A fájl elején a trigonometria-fejezetek közös segédfüggvényei vannak (window.M11), alatta a tananyag leírása.
 * Új témakör: vegyél fel egy új elemet a `temakorok` listába, és hozd létre a mappáját a fejezetfájlokkal.
 * Új fejezet: hozd létre a fájlt a témakör mappájában, és írd be a `fejezetek` listába a megfelelő helyre.
 * A fejezetek SORRENDJE egyben a megnyitási sorrend is.
 */
(function () {
/* ---------- szögfüggvények fokban ---------- */
const RAD = Math.PI / 180;
const sinD = x => Math.sin(x * RAD), cosD = x => Math.cos(x * RAD), tgD = x => Math.tan(x * RAD);
const asinD = v => Math.asin(Math.max(-1, Math.min(1, v))) / RAD;
const acosD = v => Math.acos(Math.max(-1, Math.min(1, v))) / RAD;
const atgD = v => Math.atan(v) / RAD;

/* ---------- kerekítés, számok ---------- */
const kerek = (x, d = 2) => { const k = 10 ** d; return Math.round((x + Math.sign(x) * 1e-9) * k) / k; };
/* véletlen tizedes tört [a; b]-ben, d tizedesjeggyel (0 tizedesnél egész) */
const tiz = (a, b, d = 1) => { const k = 10 ** d; return R(Math.round(a * k), Math.round(b * k)) / k; };
/* szám TeX-ben (tizedesvesszővel), d tizedesjegyre kerekítve */
const sz = (x, d = 2) => nt(kerek(x, d));
/* szög TeX-ben: 36{,}9^\circ */
const fk = (x, d = 1) => `${sz(x, d)}^\\circ`;
/* szöveges szám (−, vessző) */
const hs = (x, d = 2) => hu(kerek(x, d));
/* közelítő válaszok: a kulcs a kerekített érték; a tűrés elnyeli a részeredmények kerekítését */
const hossz = (v, d = 2) => ({ ertekek: [kerek(v, d)], tol: Math.max(d >= 2 ? 0.02 : 0.11, Math.abs(v) * 0.004), forma: 'tizedes' });
const szog = (...v) => ({ ertekek: v.map(x => kerek(x, 1)), tol: 0.15, forma: v.length === 1 ? 'tizedes' : undefined });
const FH = { hossz: 'szám, két tizedesjegyre kerekítve', szog: 'fokban, egy tizedesjegyre kerekítve', szogok: 'fokban, egy tizedesjegyre; több érték esetén pontosvesszővel elválasztva' };

/* ---------- nevezetes szögek pontos értékei ----------
   tex: a pontos érték TeX-alakja; f: ha racionális, tört objektum; v: közelítő érték */
const S3 = T`\sqrt{3}`, S2 = T`\sqrt{2}`;
const NEV = {
  sin: { 0: ['0', F(0)], 30: [T`\frac{1}{2}`, F(1, 2)], 45: [T`\frac{${S2}}{2}`], 60: [T`\frac{${S3}}{2}`], 90: ['1', F(1)],
         120: [T`\frac{${S3}}{2}`], 135: [T`\frac{${S2}}{2}`], 150: [T`\frac{1}{2}`, F(1, 2)], 180: ['0', F(0)] },
  cos: { 0: ['1', F(1)], 30: [T`\frac{${S3}}{2}`], 45: [T`\frac{${S2}}{2}`], 60: [T`\frac{1}{2}`, F(1, 2)], 90: ['0', F(0)],
         120: [T`-\frac{1}{2}`, F(-1, 2)], 135: [T`-\frac{${S2}}{2}`], 150: [T`-\frac{${S3}}{2}`], 180: ['-1', F(-1)] },
  tg:  { 0: ['0', F(0)], 30: [T`\frac{${S3}}{3}`], 45: ['1', F(1)], 60: [S3], 120: [T`-${S3}`], 135: ['-1', F(-1)], 150: [T`-\frac{${S3}}{3}`], 180: ['0', F(0)] }
};
const fnT = { sin: T`\sin`, cos: T`\cos`, tg: T`\operatorname{tg}` };
const fnV = { sin: sinD, cos: cosD, tg: tgD };
/* négyzetük racionális: sin²60 = 3/4 stb. */
const negyzetF = (fn, x) => { const v = fnV[fn](x); return F(Math.round(v * v * 12), 12); };

/* ---------- pitagoraszi számhármasok (befogó, befogó, átfogó) ---------- */
const PIT = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61]];

/* ---------- egész oldalú háromszögek 60°-os, ill. 120°-os szöggel (c² = a² + b² ∓ ab) ---------- */
const EIS = { 60: [], 120: [] };
for (let a = 1; a <= 24; a++) for (let b = 1; b <= 24; b++) {
  [[60, a * a + b * b - a * b], [120, a * a + b * b + a * b]].forEach(([g, c2]) => { const c = Math.round(Math.sqrt(c2)); if (c * c === c2 && !(g === 60 && a === b)) EIS[g].push([a, b, c]); });
}

/* ---------- háromszög megoldása (a teljes adatsor) ---------- */
function haromszogSAS(b, c, al) { const a = Math.sqrt(b * b + c * c - 2 * b * c * cosD(al)); const be = acosD((a * a + c * c - b * b) / (2 * a * c)); return { a, b, c, al, be, ga: 180 - al - be }; }

/* ---------- rajzolás: közös vászon-előkészítés ---------- */
let rajzSzam = 0;
function vaszon(cv, cb, arany = 1) {
  const W = cb.clientWidth || 400, H = Math.round(W * arany), dpr = window.devicePixelRatio || 1;
  cb.style.aspectRatio = String(+(1 / arany).toFixed(4)); cv.width = W * dpr; cv.height = H * dpr;
  const c = cv.getContext('2d'); if (!c) return null; c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cs = getComputedStyle(document.documentElement), col = n => cs.getPropertyValue(n).trim();
  c.fillStyle = col('--card'); c.fillRect(0, 0, W, H);
  return { c, W, H, col };
}
const hv = x => hu(+(+x).toFixed(4));

/* ---------- interaktív egységkör (grafikon: M11.egysegkor({ max: 90 | 180 | 360 })) ---------- */
function egysegkor(opt = {}) {
  const max = opt.max || 180;
  return function (box) {
    const id = 'ek' + (++rajzSzam);
    let al = 30, kieg = false;
    box.innerHTML = `<div class="plot"><div class="canvasbox"><canvas aria-label="Egységkör"></canvas></div>
     <div class="ctrl"><div class="ftex" id="${id}f"></div>
      <label for="${id}a">A szög: α = <b id="${id}av">${al}°</b><input type="range" id="${id}a" min="0" max="${max}" step="1" value="${al}"></label>
      <div><span>Nevezetes szögek</span><div class="row" id="${id}n">${[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330].filter(x => x <= max).map(x => `<button class="chip" data-v="${x}">${x}°</button>`).join('')}</div></div>
      ${max >= 180 ? `<label class="chk" for="${id}k"><input type="checkbox" id="${id}k"> A kiegészítő szög is (180° − α)</label>` : ''}
      <dl class="props" id="${id}p"></dl></div></div>`;
    const cv = box.querySelector('canvas'), cb = box.querySelector('.canvasbox');
    const pont = x => ({ x: cosD(x), y: sinD(x) });
    const pontos = (fn, x) => { const e = NEV[fn][x]; return e ? e[0].replace(/\\sqrt\{(\d)\}/g, '√$1').replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/-/g, '−') : null; };
    const ertek = (fn, x) => { if (fn === 'tg' && Math.abs(cosD(x)) < 1e-9) return 'nincs értelmezve'; const p = pontos(fn, x); const v = hv(Math.abs(fnV[fn](x)) < 1e-12 ? 0 : fnV[fn](x)); return p ? (/[\/√]/.test(p) ? p + ' ≈ ' + v : p) : '≈ ' + v; };
    function props() {
      const rows = [['sin α', ertek('sin', al)], ['cos α', ertek('cos', al)], ['tg α', ertek('tg', al)]];
      if (kieg && al <= 180) rows.push(['sin(180° − α)', ertek('sin', 180 - al)], ['cos(180° − α)', ertek('cos', 180 - al)]);
      rows.push(['sin²α + cos²α', '1']);
      box.querySelector(`#${id}p`).innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
      const nyolcad = al === 0 ? 'nullszög' : al < 90 ? 'hegyesszög' : al === 90 ? 'derékszög' : al < 180 ? 'tompaszög' : al === 180 ? 'egyenesszög' : al < 360 ? 'homorú szög' : 'teljesszög';
      box.querySelector(`#${id}f`).innerHTML = `α = ${al}° (${nyolcad})<br><span class="small">P(cos α; sin α) = P(${hv(cosD(al))}; ${hv(sinD(al))})</span>`;
    }
    function draw() {
      if (!document.body.contains(cv)) return;
      const felso = max <= 180, k0 = vaszon(cv, cb, felso ? 0.62 : 1); if (!k0) return; const { c, W, H, col } = k0;
      const r = felso ? W * 0.36 : W * 0.34, ox = W / 2, oy = felso ? H * 0.82 : H / 2;
      const X = x => ox + x * r, Y = y => oy - y * r;
      c.strokeStyle = col('--gridline'); c.lineWidth = 1;
      for (let i = -4; i <= 4; i++) { const t = i / 2; c.beginPath(); c.moveTo(X(t), 0); c.lineTo(X(t), H); c.stroke(); c.beginPath(); c.moveTo(0, Y(t)); c.lineTo(W, Y(t)); c.stroke(); }
      c.strokeStyle = col('--muted'); c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.moveTo(X(0), 0); c.lineTo(X(0), H); c.stroke();
      c.fillStyle = col('--muted'); c.font = `11px ${col('--f-mono') || 'monospace'}`; c.textAlign = 'center';
      [[-1, '−1'], [1, '1']].forEach(([t, l]) => { c.fillText(l, X(t), Y(0) + 14); c.textAlign = 'right'; c.fillText(l, X(0) - 5, Y(t) + 4); c.textAlign = 'center'; });
      c.strokeStyle = col('--muted'); c.lineWidth = 1.5; c.beginPath(); c.arc(ox, oy, r, felso ? Math.PI : 0, felso ? 2 * Math.PI : 2 * Math.PI); c.stroke();
      /* tangens-egyenes x = 1 */
      c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(1), 0); c.lineTo(X(1), H); c.stroke(); c.setLineDash([]);
      const rajzSzog = (sz0, szin, vastag) => {
        const p = pont(sz0);
        c.strokeStyle = szin; c.lineWidth = vastag; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(p.x), Y(p.y)); c.stroke();
        c.lineWidth = 1; c.beginPath(); c.arc(ox, oy, r * 0.18, 0, -sz0 * RAD, true); c.stroke();
        c.fillStyle = szin; c.beginPath(); c.arc(X(p.x), Y(p.y), 4.5, 0, 7); c.fill();
        return p;
      };
      if (kieg && al <= 180) {
        const q = rajzSzog(180 - al, col('--muted'), 1.6);
        c.setLineDash([4, 4]); c.strokeStyle = col('--muted'); c.beginPath(); c.moveTo(X(q.x), Y(q.y)); c.lineTo(X(-q.x), Y(q.y)); c.stroke(); c.setLineDash([]);
      }
      const p = rajzSzog(al, col('--pen'), 2.6);
      /* cos: vízszintes, zöld; sin: függőleges, piros */
      c.lineWidth = 4; c.strokeStyle = col('--green'); c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(p.x), Y(0)); c.stroke();
      c.strokeStyle = col('--red'); c.beginPath(); c.moveTo(X(p.x), Y(0)); c.lineTo(X(p.x), Y(p.y)); c.stroke();
      /* tg: a sugár egyenesének metszése az x = 1 egyenessel */
      if (Math.abs(p.x) > 1e-6) { const t = p.y / p.x; if (Math.abs(t) < (felso ? 2.2 : 1.4)) {
        c.lineWidth = 1.2; c.setLineDash([2, 3]); c.strokeStyle = col('--pen'); c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(1), Y(t)); c.stroke(); c.setLineDash([]);
        c.lineWidth = 4; c.strokeStyle = col('--flame') || col('--pen'); c.beginPath(); c.moveTo(X(1), Y(0)); c.lineTo(X(1), Y(t)); c.stroke(); } }
      c.textAlign = 'left'; c.font = `12px ${col('--f-body') || 'sans-serif'}`;
      [[col('--green'), 'cos α'], [col('--red'), 'sin α'], [col('--flame') || col('--pen'), 'tg α']].forEach((l, i) => {
        c.fillStyle = col('--card'); c.fillRect(8, 8 + i * 18, 70, 18); c.fillStyle = l[0]; c.fillRect(12, 15 + i * 18, 14, 3); c.fillStyle = col('--ink'); c.fillText(l[1], 32, 20 + i * 18); });
    }
    const upd = () => { box.querySelector(`#${id}av`).textContent = al + '°'; box.querySelector(`#${id}a`).value = al; props(); draw(); };
    box.querySelector(`#${id}a`).oninput = e => { al = +e.target.value; upd(); };
    box.querySelector(`#${id}n`).onclick = e => { const b = e.target.closest('.chip'); if (!b) return; al = +b.dataset.v; upd(); };
    const kk = box.querySelector(`#${id}k`); if (kk) kk.onchange = () => { kieg = kk.checked; upd(); };
    if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(cb);
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw); } catch (e) {}
    upd();
  };
}

/* ---------- interaktív háromszög (grafikon: M11.haromszog({ mod: 'terulet' | 'szinusz' | 'koszinusz' })) ----------
   Két oldal (b, c) és a közbezárt szög (α) állítható; a többi adatot a koszinusz- és szinusztétel adja. */
function haromszog(opt = {}) {
  const mod = opt.mod || 'koszinusz';
  return function (box) {
    const id = 'hsz' + (++rajzSzam);
    let b = 6, c = 8, al = 50;
    box.innerHTML = `<div class="plot"><div class="canvasbox"><canvas aria-label="Háromszög"></canvas></div>
     <div class="ctrl"><div class="ftex" id="${id}f"></div>
      <label for="${id}b">b oldal = <b id="${id}bv">${b}</b><input type="range" id="${id}b" min="1" max="12" step="0.5" value="${b}"></label>
      <label for="${id}c">c oldal = <b id="${id}cv">${c}</b><input type="range" id="${id}c" min="1" max="12" step="0.5" value="${c}"></label>
      <label for="${id}a">α szög (a b és c közti szög) = <b id="${id}av">${al}°</b><input type="range" id="${id}a" min="5" max="170" step="1" value="${al}"></label>
      <dl class="props" id="${id}p"></dl></div></div>`;
    const cv = box.querySelector('canvas'), cb = box.querySelector('.canvasbox');
    function props() {
      const h = haromszogSAS(b, c, al), Tr = b * c * sinD(al) / 2, Rk = h.a / (2 * sinD(al));
      const tipus = Math.max(h.al, h.be, h.ga) > 90.05 ? 'tompaszögű' : Math.max(h.al, h.be, h.ga) > 89.95 ? 'derékszögű' : 'hegyesszögű';
      const rows = [['a oldal', hs(h.a)], ['β', hs(h.be, 1) + '°'], ['γ', hs(h.ga, 1) + '°'], ['Terület', hs(Tr)], ['Típus', tipus]];
      if (mod !== 'terulet') rows.push(['a / sin α', hs(h.a / sinD(h.al), 3)], ['b / sin β', hs(h.b / sinD(h.be), 3)], ['c / sin γ', hs(h.c / sinD(h.ga), 3)]);
      if (mod === 'szinusz') rows.push(['Körülírt kör sugara', hs(Rk)]);
      box.querySelector(`#${id}p`).innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
      const f = mod === 'terulet' ? `T = b·c·sin α / 2 = ${hs(b)}·${hs(c)}·sin ${al}° / 2 ≈ ${hs(Tr)}`
        : mod === 'szinusz' ? `a : b : c = sin α : sin β : sin γ<br><span class="small">a / sin α = b / sin β = c / sin γ ≈ ${hs(h.a / sinD(al), 3)}</span>`
        : `a² = b² + c² − 2bc·cos α<br><span class="small">a² = ${hs(b)}² + ${hs(c)}² − 2·${hs(b)}·${hs(c)}·cos ${al}° ≈ ${hs(h.a * h.a)} → a ≈ ${hs(h.a)}</span>`;
      box.querySelector(`#${id}f`).innerHTML = f;
    }
    function draw() {
      if (!document.body.contains(cv)) return;
      const k0 = vaszon(cv, cb, 0.7); if (!k0) return; const { c: g, W, H, col } = k0;
      /* A az origóban, B a (c; 0) pontban, C = b·(cos α; sin α) */
      const P = { A: [0, 0], B: [c, 0], C: [b * cosD(al), b * sinD(al)] };
      const xs0 = Object.values(P).map(p => p[0]), ys0 = Object.values(P).map(p => p[1]);
      const minx = Math.min(...xs0), maxx = Math.max(...xs0), maxy = Math.max(...ys0);
      const k = Math.min((W - 60) / (maxx - minx || 1), (H - 60) / (maxy || 1));
      const X = x => 30 + (x - minx) * k + ((W - 60) - (maxx - minx) * k) / 2, Y = y => H - 30 - y * k;
      const pt = n => [X(P[n][0]), Y(P[n][1])];
      g.fillStyle = col('--pen-soft'); g.strokeStyle = col('--pen'); g.lineWidth = 2.4;
      g.beginPath(); g.moveTo(...pt('A')); g.lineTo(...pt('B')); g.lineTo(...pt('C')); g.closePath(); g.fill(); g.stroke();
      /* α ív */
      g.strokeStyle = col('--red'); g.lineWidth = 1.5; g.beginPath(); g.arc(...pt('A'), 22, 0, -al * RAD, true); g.stroke();
      g.font = `600 13px ${col('--f-body') || 'sans-serif'}`; g.fillStyle = col('--ink');
      const cim = (n, dx, dy) => { const [x, y] = pt(n); g.fillText(n, x + dx, y + dy); };
      g.textAlign = 'center'; cim('A', -10, 16); cim('B', 10, 16); cim('C', 0, -8);
      const kozep = (p, q, dx, dy, l) => { const [x1, y1] = pt(p), [x2, y2] = pt(q); g.fillStyle = col('--muted'); g.fillText(l, (x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy); };
      kozep('A', 'B', 0, 16, 'c'); kozep('A', 'C', -10, -4, 'b'); kozep('B', 'C', 10, -4, 'a');
      g.fillStyle = col('--red'); const [ax, ay] = pt('A'); g.fillText('α', ax + 32 * cosD(al / 2), ay - 32 * sinD(al / 2) + 4);
    }
    const upd = () => { box.querySelector(`#${id}bv`).textContent = hu(b); box.querySelector(`#${id}cv`).textContent = hu(c); box.querySelector(`#${id}av`).textContent = al + '°'; props(); draw(); };
    box.querySelector(`#${id}b`).oninput = e => { b = +e.target.value; upd(); };
    box.querySelector(`#${id}c`).oninput = e => { c = +e.target.value; upd(); };
    box.querySelector(`#${id}a`).oninput = e => { al = +e.target.value; upd(); };
    if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(cb);
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw); } catch (e) {}
    upd();
  };
}

/* ---------- egyszerű SVG-ábra az elmélethez (statikus) ---------- */
function abraHaromszog(cimkek = {}) {
  const l = Object.assign({ A: 'A', B: 'B', C: 'C', a: 'a', b: 'b', c: 'c', al: 'α', be: 'β', ga: 'γ' }, cimkek);
  return `<svg viewBox="0 0 260 150" width="260" height="150" role="img" aria-label="Háromszög a szokásos jelölésekkel" style="max-width:100%;color:var(--ink)">
  <polygon points="20,130 240,130 90,20" fill="var(--pen-soft)" stroke="var(--pen)" stroke-width="2"/>
  <g font-size="14" fill="currentColor" font-family="var(--f-body)"><text x="6" y="144">${l.A}</text><text x="242" y="144">${l.B}</text><text x="84" y="14">${l.C}</text>
  <text x="125" y="146" fill="var(--muted)">${l.c}</text><text x="40" y="72" fill="var(--muted)">${l.b}</text><text x="170" y="70" fill="var(--muted)">${l.a}</text>
  <text x="42" y="124" fill="var(--red)">${l.al}</text><text x="210" y="124" fill="var(--red)">${l.be}</text><text x="86" y="46" fill="var(--red)">${l.ga}</text></g></svg>`;
}
function abraDerek() {
  return `<svg viewBox="0 0 260 150" width="260" height="150" role="img" aria-label="Derékszögű háromszög" style="max-width:100%;color:var(--ink)">
  <polygon points="20,130 230,130 230,30" fill="var(--pen-soft)" stroke="var(--pen)" stroke-width="2"/><polyline points="218,130 218,118 230,118" fill="none" stroke="var(--pen)"/>
  <g font-size="13" fill="currentColor" font-family="var(--f-body)"><text x="6" y="144">A</text><text x="234" y="144">C</text><text x="234" y="28">B</text>
  <text x="56" y="124" fill="var(--red)">α</text><text x="102" y="74" fill="var(--muted)">c (átfogó)</text><text x="88" y="146" fill="var(--muted)">b (α melletti befogó)</text>
  <text x="236" y="84" fill="var(--muted)">a</text></g></svg>`;
}

/* névelő betű elé: az a oldal, a b oldal, az α szög, a β szög */
const nv = l => /^(a|e|f|l|m|n|r|s|x|A|E|F|\\alpha|\\varepsilon|α)$/.test(l) ? 'az' : 'a';

window.M11 = { nv, RAD, sinD, cosD, tgD, asinD, acosD, atgD, kerek, tiz, sz, fk, hs, hossz, szog, FH, NEV, fnT, fnV, negyzetF, PIT, EIS, haromszogSAS, egysegkor, haromszog, abraHaromszog, abraDerek };
})();

Tananyag.kurzus({
  cim: 'Matek 11',
  alcim: '11. évfolyam · középszintű érettségi',
  jelek: 'aⁿ · logₐ b · sin α · a² = b² + c² − 2bc·cos α',
  alapTemakor: 'trig',   // ez a témakör legyen kiválasztva, amíg a diák nem választ mást
  // Évfolyamszintű szabályok (elhagyhatók – akkor a config.js értéke érvényes):
  // joValaszCukorkahoz: 10,   // egy cukorkához minden feladattípusból ennyi új jó megoldás kell (témakörnél is megadható)
  // cukorkaNyitashoz: 1,      // egy fejezet nyitási ára ebben az évfolyamban
  // streakNapiMin: 1,         // napi sorozathoz ennyi új feladat kell aznap
  temakorok: [
    {
      id: 'hgl',
      cim: 'Hatvány, gyök, logaritmus',
      mappa: 'hatvany-gyok-log',
      cukorkaNyitashoz: 1,          // ennyi cukorkába kerül egy fejezet; elhagyható (akkor az évfolyam / config.js értéke)
      proba: { feladatszam: 12 },   // próba-témazáró: ennyi feladat; nyitási ára: proba: { feladatszam: 12, cukorka: 2 }
      // Fejezetenként eltérő ár: a fájlnév helyett { fajl: '…js', cukorka: 2 } – ennyibe kerül megnyitni AZT a fejezetet.
      fejezetek: [
        '01-hatvanyozas.js',
        '02-gyokvonas.js',
        '03-tortkitevo.js',
        '04-exp-fuggveny.js',
        '05-exp-egyenletek.js',
        '06-logaritmus.js',
        '07-log-azonossagok.js',
        '08-log-fuggveny.js',
        '09-log-egyenletek.js',
        '10-alkalmazasok.js'
      ]
    },
    {
      id: 'trig',
      cim: 'Trigonometria',
      mappa: 'trigonometria',
      cukorkaNyitashoz: 1,
      joValaszCukorkahoz: 5,        // számológépes feladatok: típusonként 5 új jó megoldás ér egy cukorkát
      proba: { feladatszam: 12 },
      fejezetek: [
        '01-hegyesszog.js',
        '02-tompaszog.js',
        '03-terulet.js',
        '04-szinusztetel.js',
        '05-koszinusztetel.js',
        '06-haromszog-megoldasa.js',
        '07-alkalmazasok.js',
        '08-skalaris-szorzat.js',     // emelt szint (a fájlban: szint: 'emelt')
        '09-trig-egyenletek.js'       // emelt szint
      ]
    }
  ]
});
