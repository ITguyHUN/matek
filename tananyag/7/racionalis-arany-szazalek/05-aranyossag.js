/*
 * 5. fejezet – Arányos következtetések
 * Témakör: Racionális számok, arányosság, százalék (7. évfolyam, TK 3. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, sf, tbl, randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, $, esc } = M7;
  const FMT = M7.FMT7;
  const G = {};

  G.egyenes = { ch: 'arany', name: 'Egyenes arányosság', make() {
    const ctx = P([['füzet', 'db', 'Ft'], ['alma', 'kg', 'Ft'], ['benzin', 'liter', 'Ft'], ['zsemle', 'db', 'Ft']]);
    const unit = ctx[0] === 'benzin' ? R(55, 66) * 10 : ctx[0] === 'zsemle' ? R(6, 15) * 10 : R(15, 60) * 10;
    const n = R(2, 8); let m; do { m = R(2, 15); } while (m === n);
    return { q: `<p>${n} ${ctx[1]} ${ctx[0]} ára ${big(n * unit)} Ft. Mennyibe kerül ${m} ${ctx[1]}?</p>`, ans: { vals: [m * unit] }, ansText: String(m * unit), fmt: 'szám (Ft)',
      hint: 'Következtess előbb 1 egységre (1 db, 1 kg, 1 liter árára)!',
      sol: [T`Egyenes arányosság: kétszer annyiért kétszer annyit fizetünk.`, T`1 ${ctx[1]}: \(${bigT(n * unit)}:${n}=${unit}\) Ft.`, T`${m} ${ctx[1]}: \(${unit}\cdot ${m}=${bigT(m * unit)}\) Ft.`] };
  } };

  G.forditott = { ch: 'arany', name: 'Fordított arányosság', make() {
    const t = R(0, 2); const K = P([24, 36, 48, 60, 72, 120, 144]); const divs = []; for (let i = 2; i <= 16; i++) if (K % i === 0 && K / i <= 60) divs.push(i);
    const a = P(divs); let b; do { b = P(divs); } while (b === a);
    const C = [['munkás', 'nap alatt végez a munkával', 'munkásnap', 'nap'], ['szivattyú', 'óra alatt üríti ki a medencét', 'szivattyúóra', 'óra'], ['traktor', 'nap alatt szántja fel a földet', 'traktornap', 'nap']][t];
    return { q: `<p>${a} ${C[0]} ${K / a} ${C[1]}. Mennyi idő alatt végez ugyanezzel ${b} ${C[0]}?</p>`, ans: { vals: [K / b] }, ansText: hu(K / b), fmt: 'szám',
      hint: `Több ${C[0]} kevesebb idő alatt végez: ez fordított arányosság. Mennyi idő kellene 1 ${C[0]}nak?`,
      sol: [`Fordított arányosság: a ${C[0]}ok száma és az idő szorzata állandó.`, T`\(${a}\cdot ${K / a}=${K}\) (${C[2]}).`, T`\(${K}:${b}=${hu(K / b).replace(',', '{,}')}\), tehát <b>${hu(K / b)} ${C[3]}</b>.`] };
  } };

  G.tablazat = { ch: 'arany', name: 'Arányossági táblázat', make() {
    const dir = R(0, 1) === 0;
    if (dir) { const c = P([1.5, 2, 2.5, 3, 4, 0.5, 1.2, 6]); const xs = [R(1, 3), R(4, 6), R(7, 12)]; const ask = R(0, 1);
      const ys = xs.map(x => +(c * x).toFixed(6));
      const cells = ask ? [[xs[0], xs[1], '?'], [hu(ys[0]), hu(ys[1]), '']] : [[xs[0], xs[1], ''], [hu(ys[0]), hu(ys[1]), '?']];
      if (ask) { cells[1][2] = hu(ys[2]); return { q: `<p><b>x</b> és <b>y</b> egyenesen arányos. Mennyi kerül a kérdőjel helyére?</p>` + tbl(['x', ...cells[0]], [['y', ...cells[1]]]),
        ans: { vals: [xs[2]] }, ansText: String(xs[2]), fmt: 'szám', hint: 'Egyenes arányosságnál az y : x hányados állandó.',
        sol: [T`\(y:x=${nt(ys[0])}:${xs[0]}=${nt(c)}\) állandó.`, T`\(x=y:${nt(c)}=${nt(ys[2])}:${nt(c)}=${xs[2]}\)`] }; }
      return { q: `<p><b>x</b> és <b>y</b> egyenesen arányos. Mennyi kerül a kérdőjel helyére?</p>` + tbl(['x', ...cells[0].slice(0, 2), xs[2]], [['y', ...cells[1]]]),
        ans: { vals: [ys[2]] }, ansText: hu(ys[2]), fmt: 'szám', hint: 'Egyenes arányosságnál az y : x hányados állandó.',
        sol: [T`\(y:x=${nt(ys[0])}:${xs[0]}=${nt(c)}\) állandó.`, T`\(y=${nt(c)}\cdot ${xs[2]}=${nt(ys[2])}\)`] }; }
    const K = P([12, 18, 24, 30, 36, 48, 60]); const dv = []; for (let i = 1; i <= K; i++) if (K % i === 0) dv.push(i);
    let x1, x2, x3; do { x1 = P(dv); x2 = P(dv); x3 = P(dv); } while (new Set([x1, x2, x3]).size < 3);
    return { q: `<p><b>x</b> és <b>y</b> fordítottan arányos. Mennyi kerül a kérdőjel helyére?</p>` + tbl(['x', x1, x2, x3], [['y', K / x1, K / x2, '?']]),
      ans: { vals: [K / x3] }, ansText: String(K / x3), fmt: 'szám', hint: 'Fordított arányosságnál az x · y szorzat állandó.',
      sol: [T`\(x\cdot y=${x1}\cdot ${K / x1}=${K}\) állandó.`, T`\(y=${K}:${x3}=${K / x3}\)`] };
  } };

  G.terkep = { ch: 'arany', name: 'Méretarány', make() {
    const M = P([10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000]); const t = R(0, 1);
    const kmPerCm = M / 100000;
    if (t === 0) { const cm = P([2, 3, 4, 5, 6, 8, 2.5, 3.5, 4.5, 6.4, 7.2, 12]); const km = +(cm * kmPerCm).toFixed(6);
      return { q: `<p>Egy térkép méretaránya 1 : ${big(M)}. Két település távolsága a térképen ${hu(cm)} cm. Hány km a valóságban?</p>`, ans: { vals: [km] }, ansText: hu(km), fmt: 'szám (km)',
        hint: '1 cm a térképen hány cm a valóságban? Utána válts át: 100 cm = 1 m, 1000 m = 1 km, tehát 100 000 cm = 1 km.',
        sol: [T`1 cm a térképen \(${bigT(M)}\) cm \(=${nt(kmPerCm)}\) km a valóságban (mert \(100\,000\) cm = 1 km).`, T`\(${nt(cm)}\cdot ${nt(kmPerCm)}=${nt(km)}\) km.`] }; }
    const cm = P([2, 3, 4, 5, 6, 8, 10, 12, 1.5, 2.5]); const km = +(cm * kmPerCm).toFixed(6);
    return { q: `<p>Egy térkép méretaránya 1 : ${big(M)}. A valóságban ${hu(km)} km hosszú utat hány cm-es szakasz jelöl a térképen?</p>`, ans: { vals: [cm] }, ansText: hu(cm), fmt: 'szám (cm)',
      hint: 'Számold ki, hány km-nek felel meg a térképen 1 cm!',
      sol: [T`1 cm a térképen \(${nt(kmPerCm)}\) km a valóságban.`, T`\(${nt(km)}:${nt(kmPerCm)}=${nt(cm)}\) cm.`] };
  } };

  G.osztas = { ch: 'arany', name: 'Arányos osztás', make() {
    const three = R(0, 2) === 0; const pr = three ? [R(1, 5), R(1, 5), R(1, 5)] : [R(1, 7), R(1, 7)]; if (new Set(pr).size < pr.length || pr.reduce((g, x) => gcd(g, x)) > 1) return G.osztas.make();
    const sum = pr.reduce((s, x) => s + x, 0); const unit = P([50, 100, 150, 200, 250, 500, 1000, 1500]); const tot = sum * unit;
    const who = three ? ['Anna', 'Bence', 'Csilla'] : ['Anna', 'Bence']; const k = R(0, pr.length - 1);
    return { q: `<p>${who.join(three ? ', ' : ' és ').replace(/, (?=[^,]*$)/, ' és ')} ${pr.join(' : ')} arányban osztoznak ${big(tot)} Ft-on. Mennyit kap ${who[k]}?</p>`,
      ans: { vals: [pr[k] * unit] }, ansText: String(pr[k] * unit), fmt: 'szám (Ft)', hint: 'Add össze az arányszámokat: ennyi egyenlő részre kell osztani a pénzt.',
      sol: [T`Összesen \(${pr.join('+')}=${sum}\) egyenlő rész.`, T`1 rész: \(${bigT(tot)}:${sum}=${bigT(unit)}\) Ft.`, T`${who[k]} ${pr[k]} részt kap: \(${pr[k]}\cdot ${bigT(unit)}=${bigT(pr[k] * unit)}\) Ft.`] };
  } };

  G.osszetett = { ch: 'arany', name: 'Összetett következtetés', make() {
    const per = P([2, 3, 4, 5, 6, 8, 10]); const e1 = R(2, 6), h1 = R(2, 6); const V1 = per * e1 * h1;
    const t = R(0, 1);
    if (t === 0) { let e2, h2; do { e2 = R(1, 9); h2 = R(1, 9); } while (e2 === e1 && h2 === h1);
      return { q: `<p>${e1} ember ${h1} hónap alatt ${V1} m³ vizet fogyaszt. Mennyit fogyaszt ${e2} ember ${h2} hónap alatt? (Mindenki ugyanannyit fogyaszt.)</p>`,
        ans: { vals: [per * e2 * h2] }, ansText: String(per * e2 * h2), fmt: 'szám (m³)', hint: 'A fogyasztás egyenesen arányos az emberek számával ÉS az idővel is. Mennyit fogyaszt 1 ember 1 hónap alatt?',
        sol: [T`1 ember 1 hónap alatt: \(${V1}:${e1}:${h1}=${per}\) m³.`, T`${e2} ember ${h2} hónap alatt: \(${per}\cdot ${e2}\cdot ${h2}=${per * e2 * h2}\) m³.`] }; }
    const dv = []; for (let i = 1; i <= e1 * h1 * 3; i++) if ((e1 * h1) % i === 0 && i !== e1) dv.push(i);
    const e2 = P(dv.length ? dv : [1]); const h2 = e1 * h1 / e2;
    return { q: `<p>${e1} ember ${h1} hónap alatt fogyaszt el egy tartálynyi vizet. Hány hónap alatt fogyasztja el ugyanezt ${e2} ember?</p>`,
      ans: { vals: [h2] }, ansText: hu(h2), fmt: 'szám (hónap)', hint: 'Adott vízmennyiségnél az emberek száma és az idő fordítottan arányos.',
      sol: [T`Fordított arányosság: ember · hónap = állandó: \(${e1}\cdot ${h1}=${e1 * h1}\).`, T`\(${e1 * h1}:${e2}=${nt(h2)}\) hónap.`] };
  } };

  /* Arányosságrajzoló: egyenes és fordított arányosság grafikonja, táblázattal */
  function makeRatio(box) {
    let dir = true, k = 6;
    box.innerHTML = `<div class="plot"><div class="canvasbox"><canvas aria-label="Az arányosság grafikonja"></canvas></div>
     <div class="ctrl"><div class="row" id="rt"><button class="chip" data-t="1" aria-pressed="true">Egyenes</button><button class="chip" data-t="0" aria-pressed="false">Fordított</button></div>
      <label for="rk">Az állandó: <b id="rkv"></b><input type="range" id="rk" min="1" max="24" step="1" value="6"></label>
      <div class="ftex" id="rf"></div><div id="rtab"></div><p class="fmt" id="rnote"></p></div></div>`;
    const cv = $('canvas', box), cb = $('.canvasbox', box);
    const c0 = () => dir ? k / 4 : k;
    const f = x => dir ? c0() * x : c0() / x;
    function info() {
      const cc = c0(); $('#rkv', box).textContent = hu(cc);
      $('#rf', box).innerHTML = dir ? `y = ${hu(cc)} · x &nbsp;&nbsp;(y : x = ${hu(cc)})` : `x · y = ${hu(cc)} &nbsp;&nbsp;(y = ${hu(cc)} : x)`;
      const xs = [1, 2, 3, 4, 6]; const ys = xs.map(x => +f(x).toFixed(2));
      $('#rtab', box).innerHTML = tbl(['x', ...xs], [['y', ...ys.map(y => hu(y))], [dir ? 'y:x' : 'x·y', ...xs.map(() => hu(cc))]]);
      $('#rnote', box).textContent = dir ? 'Ha x kétszeresére nő, y is kétszeresére nő. A grafikon origón átmenő egyenes.' : 'Ha x kétszeresére nő, y a felére csökken. A grafikon görbe (hiperbola), sosem éri el a tengelyeket.';
    }
    function draw() {
      const W = cb.clientWidth || 400; const c = setupCanvas(cv, W, W);
      const xm = 9, ym = dir ? Math.max(4, Math.ceil(c0() * 8 / 4) * 4 + 2) : Math.max(4, Math.ceil(c0() / 4) * 4 + 2);
      const pad = 34, X = x => pad + x / xm * (W - pad - 12), Y = y => W - pad - y / ym * (W - pad - 12);
      c.fillStyle = cssv('--card'); c.fillRect(0, 0, W, W);
      const ystep = ym <= 12 ? 1 : ym <= 30 ? 2 : ym <= 60 ? 5 : 10;
      c.strokeStyle = cssv('--gridline'); c.lineWidth = 1;
      for (let i = 0; i <= xm; i++) { c.beginPath(); c.moveTo(X(i), Y(0)); c.lineTo(X(i), Y(ym)); c.stroke(); }
      for (let j = 0; j <= ym; j += ystep) { c.beginPath(); c.moveTo(X(0), Y(j)); c.lineTo(X(xm), Y(j)); c.stroke(); }
      c.strokeStyle = cssv('--muted'); c.lineWidth = 1.3; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(xm), Y(0)); c.moveTo(X(0), Y(0)); c.lineTo(X(0), Y(ym)); c.stroke();
      c.fillStyle = cssv('--muted'); c.font = `11px ${cssv('--f-mono') || 'monospace'}`; c.textAlign = 'center';
      for (let i = 1; i <= xm; i++) c.fillText(i, X(i), Y(0) + 15);
      c.textAlign = 'right'; for (let j = ystep; j <= ym; j += ystep) c.fillText(j, X(0) - 6, Y(j) + 4);
      c.textAlign = 'left'; c.fillText('x', X(xm) - 10, Y(0) - 6); c.fillText('y', X(0) + 6, Y(ym) + 12);
      c.save(); c.beginPath(); c.rect(X(0), Y(ym), X(xm) - X(0), Y(0) - Y(ym)); c.clip();
      c.strokeStyle = cssv('--pen'); c.lineWidth = 2.6; c.beginPath(); let on = false;
      for (let i = 0; i <= 600; i++) { const x = 0.02 + (xm - 0.02) * i / 600; const y = f(x); if (y > ym * 1.5) { on = false; continue; } const px = X(x), py = Y(y); if (!on) { c.moveTo(px, py); on = true; } else c.lineTo(px, py); }
      c.stroke(); c.restore();
      c.fillStyle = cssv('--pen'); for (const x of [1, 2, 3, 4, 6, 8]) { const y = f(x); if (y <= ym) { c.beginPath(); c.arc(X(x), Y(y), 4, 0, 7); c.fill(); } }
      // kiemelt téglalap: fordítottnál x·y terület, egyenesnél hasonló háromszög
      c.strokeStyle = cssv('--red'); c.setLineDash([5, 4]); c.lineWidth = 1.2;
      const hx = dir ? 4 : 2, hy = f(hx); if (hy <= ym) { c.beginPath(); c.moveTo(X(hx), Y(0)); c.lineTo(X(hx), Y(hy)); c.lineTo(X(0), Y(hy)); c.stroke(); }
      c.setLineDash([]);
    }
    const upd = () => { info(); draw(); };
    $('#rt', box).onclick = e => { const b = e.target.closest('.chip'); if (!b) return; dir = b.dataset.t === '1'; box.querySelectorAll('#rt .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); };
    const sl = $('#rk', box); sl.oninput = () => { k = +sl.value; upd(); };
    if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(cb);
    upd();
  }

  Tananyag.fejezet({
    id: 'arany',
    cim: 'Arányos következtetések',
    rovid: 'Arányosság',
    bevezeto: T`Ha kétszer annyi, akkor kétszer annyi? Vagy feleannyi? Egyenes és fordított arányosság, méretarány, arányos osztás.`,
    elmelet: T`<div class="prose"><p>Két szám <b>aránya</b> a hányadosuk: 12 és 16 aránya \(\frac{12}{16}=\frac34\), másképpen \(12:16=3:4\).</p></div>
<div class="tbl"><table><tr><th></th><th>Egyenes arányosság</th><th>Fordított arányosság</th></tr>
<tr><td>jelentés</td><td>ahányszorosára nő az egyik, annyiszorosára nő a másik</td><td>ahányszorosára nő az egyik, annyiad részére csökken a másik</td></tr>
<tr><td>állandó</td><td>\(y:x\) = állandó (hányados)</td><td>\(x\cdot y\) = állandó (szorzat)</td></tr>
<tr><td>példa</td><td>vásárolt mennyiség és ár</td><td>munkások száma és a munka ideje; sebesség és menetidő</td></tr></table></div>
<div class="prose"><ul>
<li><b>Következtetés egységre:</b> előbb 1 darabra, 1 főre, 1 órára számolunk, aztán a kérdezett mennyiségre.</li>
<li><b>Méretarány</b> 1 : 25 000 → 1 cm a térképen \(25\,000\) cm \(=250\) m \(=0{,}25\) km a valóságban. (\(100\,000\) cm = 1 km.)</li>
<li><b>Összetett következtetés:</b> minden mennyiségről külön döntsd el, egyenesen vagy fordítottan arányos-e a keresett mennyiséggel.</li>
<li><b>Arányos osztás</b> 3 : 5 arányban → \(3+5=8\) egyenlő részre osztunk, az egyik 3, a másik 5 részt kap.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Ugyanazon az úton az autó sebessége és a menetidő egyenesen arányos.`, igaz: false, miert: T`Kétszer gyorsabban feleannyi idő alatt érünk oda: ez fordított arányosság.` },
      { allitas: T`12 és 16 aránya 3 : 4.`, igaz: true, miert: T`\(\frac{12}{16}=\frac34\) (egyszerűsítés 4-gyel).` },
      { allitas: T`1 : 50 000 méretarányú térképen 1 cm a valóságban 500 m.`, igaz: true, miert: T`\(50\,000\) cm \(=500\) m.` },
      { allitas: T`Egy gyerek életkora és testmagassága egyenesen arányos.`, igaz: false, miert: T`Egy 10 éves nem kétszer olyan magas, mint egy 5 éves. Ez nem arányosság.` },
      { allitas: T`Ha 3 munkás 12 nap alatt végez, akkor 6 munkás 24 nap alatt.`, igaz: false, miert: T`Kétszer annyi munkás feleannyi idő alatt végez: \(3\cdot12=36\), \(36:6=6\) nap.` }
    ],
    mintapelda: {
      feladat: T`Egy 4 tagú család 4 hónap alatt 120 m³ vizet fogyaszt. a) Mennyit fogyaszt 2 ember 2 hónap alatt? b) Hány ember fogyaszt el 120 m³ vizet 1 hónap alatt?`,
      lepesek: [
        T`a) A fogyasztás egyenesen arányos az emberek számával és az idővel is.`,
        T`Feleannyi ember (4 → 2): feleannyi víz, \(120:2=60\) m³ (4 hónap alatt).`,
        T`Feleannyi idő (4 → 2 hónap): ismét feleannyi, \(60:2=30\) m³. Tehát 2 ember 2 hónap alatt <b>30 m³</b> vizet fogyaszt.`,
        T`b) Ha a vízmennyiség állandó (120 m³), az idő és az emberek száma fordítottan arányos.`,
        T`Negyedannyi idő (4 → 1 hónap) → négyszer annyi ember: \(4\cdot4=16\) ember.`
      ]
    },
    grafikon: makeRatio, grafikonCim: 'Arányosságrajzoló', grafikonTag: 'kísérletezz',
    feladatok: M7.wrap(G)
  });
})();
