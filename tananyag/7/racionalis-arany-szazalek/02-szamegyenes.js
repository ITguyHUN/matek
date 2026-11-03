/*
 * 2. fejezet – Összehasonlítás, számegyenes
 * Témakör: Racionális számok, arányosság, százalék (7. évfolyam, TK 1. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, sf, tbl, randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, $, esc } = M7;
  const FMT = M7.FMT7;
  const G = {};


  G.relacio = { ch: 'rend', name: 'Melyik a nagyobb?', make() {
    const a = randRat(); let b, A, B;
    if (R(0, 4) === 0) { const k = R(2, 4); b = a; A = { tex: (a.n < 0 ? '-' : '') + T`\frac{${Math.abs(a.n) * k}}{${a.d * k}}` }; B = { tex: finDen(a.d) ? nt(fv(a)) : decTex(a) }; }
    else { do { b = randRat(); } while (Math.abs(fv(b) - fv(a)) < 1e-9 || Math.abs(fv(b) - fv(a)) > 1.2); A = showRat(a, R(0, 2)); B = showRat(b, R(0, 2)); }
    const va = fv(a), vb = fv(b); const c = Math.abs(va - vb) < 1e-12 ? 2 : va < vb ? 0 : 1;
    const opts = ['<', '>', '='];
    return { q: T`<p>Melyik relációjel kerül a négyzet helyére?</p>\[${A.tex}\quad\square\quad ${B.tex}\]`,
      ans: { choice: opts, correct: c, why: 'Nem jó. Írd át mindkét számot tizedes tört alakba, és helyiértékenként hasonlítsd össze őket!' }, ansText: opts[c], fmt: '',
      hint: 'Írd fel mindkét számot tizedes tört alakban (vagy közös nevezővel)! Negatív számoknál a 0-tól messzebb lévő a kisebb.',
      sol: [T`\[${A.tex}=${decApprox(a)}\qquad ${B.tex}=${decApprox(b)}\]`, T`Tehát \(${A.tex}\ ${[T`\lt`, T`\gt`, '='][c]}\ ${B.tex}\).`] };
  } };

  G.szelso = { ch: 'rend', name: 'Legnagyobb, legkisebb', make() {
    const xs = []; while (xs.length < 4) { const f = randRat(); if (Math.abs(fv(f)) <= 3 && !xs.some(x => Math.abs(fv(x) - fv(f)) < 0.004)) xs.push(f); }
    const shown = xs.map(f => showRat(f, R(0, 2))); const max = R(0, 1) === 1;
    const vals = xs.map(fv); const best = vals.indexOf(max ? Math.max(...vals) : Math.min(...vals));
    const order = xs.map((f, i) => i).sort((i, j) => vals[i] - vals[j]);
    return { q: T`<p>Melyik a <b>${max ? 'legnagyobb' : 'legkisebb'}</b> szám?</p>\[${shown.map(s => s.tex).join(T`;\qquad `)}\]`, ans: { choice: shown.map(s => s.txt), correct: best, why: 'Nem jó. Írd át mindet tizedes tört alakba, és állítsd sorba őket!' },
      ansText: shown[best].txt, fmt: '', hint: 'Írd át mindegyiket tizedes törtté! Negatív számok közül az a kisebb, amelyik messzebb van a 0-tól.',
      sol: [T`Tizedes tört alakban: ${xs.map((f, i) => T`\(${shown[i].tex}=${decApprox(f)}\)`).join(';\ ')}.`,
        T`Növekvő sorrend: \[${order.map(i => shown[i].tex).join(T`\ \lt\ `)}\]`, `A ${max ? 'legnagyobb' : 'legkisebb'}: <b>${shown[best].txt}</b>.`] };
  } };

  G.kozott = { ch: 'rend', name: 'Két szám között', make() {
    let a, b; do { a = F(R(-15, 15), R(2, 9)); b = F(R(-15, 15), R(2, 9)); } while (!(fv(b) > fv(a) && fv(b) - fv(a) < 0.5) || a.d === 1 || b.d === 1);
    const m = F(a.n * b.d + b.n * a.d, 2 * a.d * b.d);
    const D = a.d * b.d / gcd(a.d, b.d);
    return { q: T`<p>Írj egy olyan racionális számot, amely a két szám <b>közé</b> esik!</p>\[${ft(a)}\quad\text{és}\quad ${ft(b)}\]`,
      ans: { between: [fv(a), fv(b)] }, ansText: fplain(m), fmt: 'egy szám (tört vagy tizedes tört)',
      hint: 'Két szám átlaga mindig közöttük van a számegyenesen. Vagy: hozd közös nevezőre, és bővíts tovább!',
      sol: [T`1. módszer – a két szám átlaga: \[\left(${ft(a)}+${fp(b)}\right):2=${ft(fadd(a, b))}:2=${ft(m)}\]`,
        T`2. módszer – közös nevező, majd bővítés 10-szeresére: \(${ft(a)}=${sf(a.n * D / a.d * 10, D * 10)}\), \(${ft(b)}=${sf(b.n * D / b.d * 10, D * 10)}\); a kettő között van például \(${sf(a.n * D / a.d * 10 + 1, D * 10)}\).`,
        'Bármely két különböző racionális szám között végtelen sok racionális szám van.'] };
  } };

  G.egeszek = { ch: 'rend', name: 'Egészek két szám között', make() {
    let a, b; do { a = F(R(-40, 10), R(2, 9)); b = F(R(-10, 40), R(2, 9)); } while (fv(b) - fv(a) < 1.5 || a.d === 1 || b.d === 1 || fv(b) - fv(a) > 9);
    const lo = Math.floor(fv(a)) + 1, hi = Math.ceil(fv(b)) - 1; const cnt = hi - lo + 1;
    return { q: T`<p>Hány egész szám van a két szám között?</p>\[${fmix(a)}\quad\text{és}\quad ${fmix(b)}\]`, ans: { vals: [cnt], int: true }, ansText: String(cnt), fmt: 'egész szám',
      hint: 'Írd át a számokat tizedes tört alakba, és képzeld el őket a számegyenesen!',
      sol: [T`\(${fmix(a)}\approx ${nt(+fv(a).toFixed(3))}\) és \(${fmix(b)}\approx ${nt(+fv(b).toFixed(3))}\).`, T`A közöttük lévő egészek: \(${cnt <= 6 ? Array.from({ length: cnt }, (_, i) => lo + i).join(',\\ ') : `${lo}, ${lo + 1}, \\ldots, ${hi}`}\).`, `Ez összesen <b>${cnt}</b> egész szám.`] };
  } };

  /* Számegyenes: a beírt számokat ábrázolja és sorba rendezi */
  function makeNumberLine(box) {
    box.innerHTML = `<div class="nl"><div class="ansrow"><input id="nlin" type="text" autocomplete="off" spellcheck="false" aria-label="Számok pontosvesszővel elválasztva" value="-3/4; 0,6; 2/3; -1 1/5; 0,67; 0,(3)"><button class="btn primary" id="nlgo">Ábrázol</button><button class="btn ghost" id="nlrnd">Véletlen számok</button></div>
     <div class="fmt">Pontosvesszővel válaszd el a számokat. ${FMTLINE}</div>
     <div class="nlbox"><canvas aria-label="Számegyenes a megadott számokkal"></canvas></div>
     <div class="fb info" id="nlord" aria-live="polite"></div></div>`;
    const cv = $('canvas', box), cb = $('.nlbox', box), inp = $('#nlin', box);
    let pts = [];
    function read() {
      pts = []; const bad = [];
      for (const part of inp.value.split(';').map(s => s.trim()).filter(Boolean)) { const r = valaszErtelmez(part); if (r && !r.hiba && r.length === 1 && typeof r[0] === 'number') pts.push({ l: part.replace(/-/g, '−'), v: r[0] }); else bad.push(part); }
      const sorted = pts.slice().sort((a, b) => a.v - b.v);
      let txt = sorted.length ? '<b>Növekvő sorrend:</b> ' + sorted.map((p, i) => (i ? (Math.abs(p.v - sorted[i - 1].v) < 1e-12 ? ' = ' : ' &lt; ') : '') + esc(p.l)).join('') : 'Írj be legalább egy számot!';
      if (bad.length) txt += `<br>Nem értelmezhető: ${bad.map(esc).join(', ')}`;
      $('#nlord', box).innerHTML = txt; draw();
    }
    function draw() {
      const W = cb.clientWidth || 600, H = 170; const c = setupCanvas(cv, W, H);
      c.fillStyle = cssv('--card'); c.fillRect(0, 0, W, H);
      if (!pts.length) return;
      let lo = Math.floor(Math.min(...pts.map(p => p.v))), hi = Math.ceil(Math.max(...pts.map(p => p.v)));
      if (hi - lo < 2) { lo -= 1; hi += 1; } if (hi - lo > 40) { lo = Math.max(lo, -20); hi = Math.min(hi, 20); }
      const pad = 28, X = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad), Y0 = H / 2;
      c.strokeStyle = cssv('--muted'); c.lineWidth = 1.4; c.beginPath(); c.moveTo(pad - 14, Y0); c.lineTo(W - pad + 14, Y0); c.stroke();
      c.beginPath(); c.moveTo(W - pad + 14, Y0); c.lineTo(W - pad + 6, Y0 - 5); c.moveTo(W - pad + 14, Y0); c.lineTo(W - pad + 6, Y0 + 5); c.stroke();
      const sub = (hi - lo) <= 6 ? 10 : (hi - lo) <= 12 ? 2 : 1;
      c.font = `12px ${cssv('--f-mono') || 'monospace'}`; c.textAlign = 'center';
      for (let i = lo * sub; i <= hi * sub; i++) { const v = i / sub, x = X(v), major = i % sub === 0;
        c.strokeStyle = major ? cssv('--muted') : cssv('--line'); c.beginPath(); c.moveTo(x, Y0 - (major ? 7 : 4)); c.lineTo(x, Y0 + (major ? 7 : 4)); c.stroke();
        if (major) { c.fillStyle = cssv('--muted'); c.fillText(String(v).replace('-', '−'), x, Y0 + 22); } }
      const sorted = pts.slice().sort((a, b) => a.v - b.v); const rows = [[], [], [], []];
      c.font = `600 13px ${cssv('--f-body') || 'sans-serif'}`;
      sorted.forEach((p, i) => { if (p.v < lo - 1e-9 || p.v > hi + 1e-9) return; const x = X(p.v); const w = c.measureText(p.l).width + 10;
        let r = 0; while (r < 3 && rows[r].some(([a, b]) => x - w / 2 < b && x + w / 2 > a)) r++; rows[r].push([x - w / 2, x + w / 2]);
        const ly = r < 2 ? Y0 - 30 - r * 22 : Y0 + 44 + (r - 2) * 20;
        c.strokeStyle = cssv('--pen'); c.lineWidth = 1; c.beginPath(); c.moveTo(x, Y0); c.lineTo(x, r < 2 ? ly + 4 : ly - 14); c.stroke();
        c.fillStyle = cssv('--pen'); c.beginPath(); c.arc(x, Y0, 4.5, 0, 7); c.fill();
        c.fillStyle = cssv('--ink'); c.fillText(p.l, x, ly); });
    }
    $('#nlgo', box).onclick = read; inp.onkeydown = e => { if (e.key === 'Enter') read(); };
    $('#nlrnd', box).onclick = () => { const xs = []; for (let i = 0; i < 5; i++) { const f = randRat(); const s = showRat(f, R(0, 2)).txt; xs.push(s.replace('−', '-')); } inp.value = xs.join('; '); read(); };
    if (window.ResizeObserver) new ResizeObserver(() => draw()).observe(cb);
    read();
  }

  Tananyag.fejezet({
    id: 'rend',
    cim: 'Összehasonlítás, számegyenes',
    rovid: 'Számegyenes',
    bevezeto: T`Melyik a nagyobb: \(\frac23\) vagy \(0{,}67\)? Sorba rendezés, számegyenes, és egy meglepő tény: két racionális szám között mindig van újabb.`,
    elmelet: T`<div class="prose"><p><b>Hogyan hasonlítsunk össze két racionális számot?</b></p><ul>
<li><b>Tizedes tört alakban</b>, helyiértékenként: \(\frac23=0{,}666\ldots<0{,}670=0{,}67\).</li>
<li><b>Közös nevezővel</b>: \(\frac34\) vagy \(\frac57\)? \(\frac{21}{28}>\frac{20}{28}\), tehát \(\frac34>\frac57\).</li>
<li><b>Negatív számoknál</b> az a kisebb, amelyik messzebb van a 0-tól: \(-0{,}7<-0{,}65\).</li></ul>
<p><b>Két szám között mindig van újabb racionális szám</b>, például a két szám átlaga:</p></div>
<div class="mathbox">\[\frac23<\frac{\frac23+\frac34}{2}=\frac{17}{24}<\frac34\]</div>
<div class="prose"><p>Ezért két racionális szám között <b>végtelen sok</b> racionális szám van. Egész számokból viszont csak véges sok: \(-\frac73\) és \(\frac{11}{4}\) között a \(-2,-1,0,1,2\) – öt darab.</p>
<p><b>Ellentett</b>: a 0-ra tükrözött szám (\(\frac23\) ellentettje \(-\frac23\)). <b>Abszolút érték</b>: a szám távolsága a 0-tól (\(|-1{,}5|=1{,}5\)).</p></div>`,
    igazHamis: [
      { allitas: T`\(-\frac12<-\frac13\)`, igaz: true, miert: T`\(-0{,}5<-0{,}333\ldots\): a \(-\frac12\) van messzebb a 0-tól, ezért kisebb.` },
      { allitas: T`\(\frac23<0{,}67\)`, igaz: true, miert: T`\(\frac23=0{,}666\ldots\), és a századok helyén \(6<7\).` },
      { allitas: T`\(\frac14\) és \(\frac13\) között nincs racionális szám, mert a nevezők szomszédos számok.`, igaz: false, miert: T`Például \(0{,}3\) vagy az átlaguk, \(\frac{7}{24}\) is közéjük esik. Két racionális szám között végtelen sok van.` },
      { allitas: T`\(-0{,}7>-0{,}65\)`, igaz: false, miert: T`\(-0{,}7\) messzebb van a 0-tól, ezért kisebb: \(-0{,}7<-0{,}65\).` },
      { allitas: T`Ha \(a>b>0\), akkor \(\frac1a<\frac1b\).`, igaz: true, miert: T`Pozitív számoknál a nagyobb szám reciproka a kisebb: pl. \(4>2\), de \(\frac14<\frac12\).` }
    ],
    mintapelda: {
      feladat: T`Rendezzük növekvő sorrendbe: \(0{,}3;\ -\frac{7}{10};\ \frac38;\ -0{,}\dot{6};\ 0{,}\dot{6}\)`,
      lepesek: [
        T`Írjunk át mindent tizedes tört alakba: \(-\frac{7}{10}=-0{,}7\), \(\frac38=3:8=0{,}375\), \(-0{,}\dot6=-0{,}666\ldots\), \(0{,}\dot6=0{,}666\ldots\).`,
        T`Negatívak: \(-0{,}7\) messzebb van a 0-tól, mint \(-0{,}666\ldots\), ezért \(-0{,}7<-0{,}\dot6\).`,
        T`Pozitívak helyiértékenként: \(0{,}300<0{,}375<0{,}666\ldots\)`,
        T`\[-\frac{7}{10}<-0{,}\dot6<0{,}3<\frac38<0{,}\dot6\]`
      ]
    },
    grafikon: makeNumberLine, grafikonCim: 'Számegyenes', grafikonTag: 'ábrázolj bármit',
    feladatok: M7.wrap(G)
  });
})();
