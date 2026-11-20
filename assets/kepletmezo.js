/*
 * Matek gyakorló – képletmező és jelbillentyűzet a kifejezés típusú válaszokhoz (valasz: { kifejezes: … }).
 * A mező a MathLive <math-field> eleme; a könyvtár csak akkor töltődik le, amikor először kell.
 * Ha nem érhető el (nincs net, lassú hálózat), sima szövegmező lesz belőle – ugyanaz begépelhető: (x+3)^2, sqrt(2), ]1;5[.
 * A billentyűzetből egyetlen példány van: mindig annak a mezőnek a „kb-hely” elemébe ül át, amelyik éppen aktív.
 */
(function () {
  const ALAP = 'https://cdn.jsdelivr.net/npm/mathlive@0.111.4/', FORRAS = ALAP + 'mathlive.min.js';
  let allapot = 0;            // 0: még nem kértük, 1: töltődik, 2: kész, 3: nem sikerült
  const varok = [];
  /* cb(sikerult) – azonnal hív, ha már eldőlt; különben a betöltés (legfeljebb 8 mp) után */
  function betolt(cb) {
    if (allapot === 3 && window.MathfieldElement) allapot = 2;    // közben mégis megjött
    if (allapot >= 2) { cb(allapot === 2); return; }
    varok.push(cb); if (allapot === 1) return; allapot = 1;
    const kesz = ok => {
      if (allapot !== 1) return; allapot = ok ? 2 : 3;
      // utólag beszúrt <script>-nél a MathLive nem találja ki magától a betűkészletek helyét
      if (ok) { MathfieldElement.fontsDirectory = ALAP + 'fonts/'; MathfieldElement.decimalSeparator = ','; MathfieldElement.soundsDirectory = null; }
      varok.splice(0).forEach(f => f(ok));
    };
    const s = document.createElement('script'); s.src = FORRAS;
    s.onload = () => kesz(!!window.MathfieldElement); s.onerror = () => kesz(false);
    document.head.append(s); setTimeout(() => kesz(false), 8000);
  }

  const IKON = {
    torol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5-6 5-6zM12 10l4 4M16 10l-4 4"/></svg>',
    balra: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    jobbra: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };
  /* l: felirat, a: felolvasott név, ins: MathLive-beszúrás (#@ = a kurzor előtti elem, #? = üres hely, #0 = kijelölés),
   * g: mit ír a sima szövegmezőbe (ha nincs: az ins), cmd: MathLive-parancs, sz: szám/betű (nem kék), kis: kisebb betűvel */
  const fv = (nev, parancs) => ({ l: nev, a: nev, ins: `${parancs}\\left(#?\\right)`, g: nev + '(', kis: 1 });
  const iv = (l, a, bal, jobb) => ({ l, a, ins: `\\left\\${bal}#?;#?\\right\\${jobb}`, g: bal === 'rbrack' ? ']' : '[', kis: 1 });
  const B = {
    negyzet: { l: 'x<sup>2</sup>', a: 'négyzet', ins: '#@^{2}', g: '^2' }, hatv: { l: 'x<sup>n</sup>', a: 'hatvány', ins: '#@^{#?}', g: '^' },
    gyok: { l: '√', a: 'négyzetgyök', ins: '\\sqrt{#0}', g: 'sqrt(' }, ngyok: { l: '<sup>n</sup>√', a: 'n-edik gyök', ins: '\\sqrt[#?]{#0}', g: 'sqrt[' },
    tort: { l: '<span class="kb-tort"><i>a</i><i>b</i></span>', a: 'tört', ins: '\\frac{#@}{#?}', g: '/' }, abs: { l: '|x|', a: 'abszolút érték', ins: '\\left|#0\\right|', g: '|' },
    nyit: { l: '(', ins: '(' }, zar: { l: ')', ins: ')' }, pi: { l: 'π', a: 'pí', ins: '\\pi', g: 'pi' },
    kis: { l: '<', a: 'kisebb', ins: '<' }, nagy: { l: '>', a: 'nagyobb', ins: '>' }, kise: { l: '≤', a: 'kisebb vagy egyenlő', ins: '\\le', g: '<=' },
    nagye: { l: '≥', a: 'nagyobb vagy egyenlő', ins: '\\ge', g: '>=' }, nem: { l: '≠', a: 'nem egyenlő', ins: '\\ne', g: '!=' }, egy: { l: '=', a: 'egyenlő', ins: '=' },
    plusz: { l: '+', ins: '+' }, minusz: { l: '−', a: 'mínusz', ins: '-' }, szor: { l: '·', a: 'szorzás', ins: '\\cdot', g: '*' }, oszt: { l: ':', a: 'osztás', ins: ':' },
    vesszo: { l: ',', a: 'tizedesvessző', ins: ',' }, x: { l: 'x', ins: 'x', sz: 1 }, y: { l: 'y', ins: 'y', sz: 1 }, a: { l: 'a', ins: 'a', sz: 1 }, b: { l: 'b', ins: 'b', sz: 1 },
    k: { l: 'k', a: 'k egész paraméter', ins: 'k', sz: 1 }, pm: { l: '±', a: 'plusz-mínusz', ins: '\\pm', g: '±' },
    torol: { l: IKON.torol, a: 'törlés', cmd: 'deleteBackward' }, balra: { l: IKON.balra, a: 'balra', cmd: 'moveToPreviousChar' }, jobbra: { l: IKON.jobbra, a: 'jobbra', cmd: 'moveToNextChar' },
    sin: fv('sin', '\\sin'), cos: fv('cos', '\\cos'), tg: fv('tg', '\\tg'), ctg: fv('ctg', '\\ctg'), lg: fv('lg', '\\lg'), ln: fv('ln', '\\ln'),
    log: { l: 'log<sub>a</sub>', a: 'logaritmus megadott alappal', ins: '\\log_{#?}\\left(#?\\right)', g: 'log_', kis: 1 }, fok: { l: '°', a: 'fok', ins: '\\degree', g: '°' },
    // \left…\right határolók: így a −∞ előtti mínusz előjel marad, nem kivonásként szedődik
    ivNN: iv(']a; b[', 'nyílt intervallum', 'rbrack', 'lbrack'), ivZZ: iv('[a; b]', 'zárt intervallum', 'lbrack', 'rbrack'),
    ivNZ: iv(']a; b]', 'balról nyílt, jobbról zárt intervallum', 'rbrack', 'rbrack'), ivZN: iv('[a; b[', 'balról zárt, jobbról nyílt intervallum', 'lbrack', 'lbrack'),
    vegt: { l: '∞', a: 'végtelen', ins: '\\infty', g: '∞' }, eleme: { l: '∈', a: 'eleme', ins: '\\in', g: '∈' }, unio: { l: '∪', a: 'unió', ins: '\\cup', g: '∪' }, kiv: { l: '∖', a: 'halmazok különbsége', ins: '\\setminus', g: '∖' },
    hz: { l: '{ }', a: 'felsorolt halmaz', ins: '\\lbrace#?\\rbrace', g: '\\{' }, ures: { l: '∅', a: 'üres halmaz', ins: '\\emptyset', g: '∅' },
    valos: { l: 'ℝ', a: 'valós számok halmaza', ins: '\\mathbb{R}', g: 'ℝ' }, egeszek: { l: 'ℤ', a: 'egész számok halmaza', ins: '\\mathbb{Z}', g: 'ℤ' },
    termeszetes: { l: 'ℕ', a: 'természetes számok halmaza', ins: '\\mathbb{N}', g: 'ℕ' }, racionalis: { l: 'ℚ', a: 'racionális számok halmaza', ins: '\\mathbb{Q}', g: 'ℚ' },
    pv: { l: ';', a: 'pontosvessző', ins: ';' },
    vagy: { l: 'vagy', ins: '\\;\\mathrm{vagy}\\;', g: ' vagy ', kis: 1 }, es: { l: 'és', ins: '\\;\\mathrm{és}\\;', g: ' és ', kis: 1 }   // \mathrm, nem \text: a mező matematikai módban marad
  };
  for (let d = 0; d <= 9; d++) B[d] = { l: String(d), ins: String(d), sz: 1 };
  const LAPOK = {   // „m:” előtag: csak telefonon látszik (gépen ott a billentyűzet)
    fo: [7, 8, 9, 'plusz', 'nyit', 'torol', 4, 5, 6, 'minusz', 'zar', 'balra', 1, 2, 3, 'szor', 'negyzet', 'jobbra', 0, 'vesszo', 'x', 'oszt', 'tort', 'gyok'],
    jel: ['negyzet', 'hatv', 'gyok', 'ngyok', 'tort', 'abs', 'nyit', 'zar', 'pi', 'kis', 'nagy', 'kise', 'nagye', 'nem', 'egy', 'm:y', 'm:a', 'm:b'],
    fv: ['sin', 'cos', 'tg', 'ctg', 'lg', 'log', 'ln', 'fok', 'pi', 'pm', 'k', 'vagy', 'm:x', 'm:nyit', 'm:zar', 'm:tort', 'm:balra', 'm:jobbra'],
    halmaz: ['ivNN', 'ivZZ', 'ivNZ', 'ivZN', 'vegt', 'eleme', 'unio', 'kiv', 'hz', 'ures', 'valos', 'egeszek', 'termeszetes', 'racionalis', 'pv', 'vagy', 'es', 'k', 'm:x', 'm:minusz', 'm:balra', 'm:jobbra']
  };
  const LAPNEV = { fo: '123', jel: 'Jelek', fv: 'Függvény', halmaz: 'Halmaz' };
  const telefon = () => { try { return matchMedia('(max-width:759px)').matches; } catch (e) { return false; } };

  let aktiv = null, kb = null;
  function lapValt(id) {
    if (!LAPOK[id] || (id === 'fo' && !telefon())) id = telefon() ? 'fo' : 'jel';
    kb.querySelectorAll('.kb-lap').forEach(b => b.setAttribute('aria-pressed', b.dataset.lap === id));
    kb.querySelectorAll('.kb-racs').forEach(r => { r.hidden = r.dataset.lap !== id; });
  }
  function billentyuzet() {
    if (kb) return kb;
    kb = document.createElement('div'); kb.className = 'kb';
    kb.innerHTML = `<div class="kb-fej" role="group" aria-label="Billentyűzet lapjai">${Object.keys(LAPOK).map(id => `<button type="button" class="kb-lap${id === 'fo' ? ' csak-mobil' : ''}" data-lap="${id}">${LAPNEV[id]}</button>`).join('')}</div>`;
    for (const [lap, lista] of Object.entries(LAPOK)) {
      const racs = document.createElement('div'); racs.className = 'kb-racs'; racs.dataset.lap = lap; racs.hidden = true; racs.setAttribute('role', 'group'); racs.setAttribute('aria-label', LAPNEV[lap]);
      for (const nyers of lista) {
        const mobil = String(nyers).startsWith('m:'), id = mobil ? nyers.slice(2) : nyers, k = B[id], g = document.createElement('button');
        g.type = 'button'; g.className = 'kb-gomb' + (k.sz ? '' : ' jel') + (k.kis ? ' kis' : '') + (mobil ? ' csak-mobil' : ''); g.innerHTML = `<span>${k.l}</span>`; g.dataset.b = id;
        if (k.a) g.setAttribute('aria-label', k.a);
        racs.append(g);
      }
      kb.append(racs);
    }
    kb.addEventListener('pointerdown', e => { if (e.target.closest('.kb-gomb')) e.preventDefault(); });   // a mező ne veszítse el a fókuszt
    kb.addEventListener('click', e => {
      const lap = e.target.closest('.kb-lap'); if (lap) { lapValt(lap.dataset.lap); return; }
      const g = e.target.closest('.kb-gomb'); if (g && aktiv) aktiv.gomb(B[g.dataset.b]);
    });
    return kb;
  }

  /* Mező a `hely` elembe. o: { cimke, enter (függvény), kbHely (ide ül a billentyűzet), lap ('jel' | 'fv' | 'halmaz'), mutat (azonnal látszik a billentyűzet) }
   * Vissza: { el, ertek(), lezar(), fokusz() }. Előtte: Kepletmezo.betolt(cb). */
  function mezo(hely, o) {
    const ml = allapot === 2, el = document.createElement(ml ? 'math-field' : 'input');
    el.className = 'kepletmezo'; el.setAttribute('aria-label', o.cimke || 'Válasz');
    if (!ml) { el.type = 'text'; el.autocomplete = 'off'; el.spellcheck = false; el.placeholder = 'pl. (x+3)^2'; }
    hely.append(el);
    if (ml) { el.mathVirtualKeyboardPolicy = 'manual'; el.menuItems = []; el.smartFence = false; }   // smartFence ki: a ]1;5[ intervallum zárójelei maradjanak, ahogy beírták
    let zarva = false;
    const api = {
      el, ertek: () => String(el.value || '').trim(), fokusz() { el.focus(); },
      lezar() { zarva = true; if (ml) el.readOnly = true; else el.disabled = true; if (kb && o.kbHely && kb.parentNode === o.kbHely) kb.remove(); },
      gomb(k) {
        if (zarva) return;
        if (ml) { if (k.cmd) el.executeCommand(k.cmd); else el.insert(k.ins, { focus: true }); return; }
        const a = el.selectionStart, z = el.selectionEnd, be = (s, e, t) => { el.value = el.value.slice(0, s) + t + el.value.slice(e); el.setSelectionRange(s + t.length, s + t.length); };
        if (k.cmd === 'deleteBackward') be(a === z ? Math.max(0, a - 1) : a, z, '');
        else if (k.cmd) { const p = Math.max(0, Math.min(el.value.length, a + (k.cmd === 'moveToNextChar' ? 1 : -1))); el.setSelectionRange(p, p); }
        else be(a, z, k.g || k.ins);
        el.focus();
      }
    };
    const ide = () => { aktiv = api; if (o.kbHely && !zarva) { const b = billentyuzet(); if (b.parentNode !== o.kbHely) { o.kbHely.append(b); lapValt(telefon() ? 'fo' : o.lap || 'jel'); } } };
    el.addEventListener('focus', ide); el.addEventListener('pointerdown', ide);   // a math-field saját focus eseményt küld (focusin nem jön)
    el.addEventListener('keydown', e => { if (e.key === 'Enter' && o.enter) { e.preventDefault(); o.enter(); } });
    if (o.mutat) ide();
    return api;
  }

  window.Kepletmezo = { betolt, mezo, SUGO: 'Billentyűzetről is megy: <code>^</code> hatvány · <code>/</code> tört · <code>sqrt</code> gyök · <code>sin</code> <code>log</code> függvény · <code>&lt;=</code> ≤ · <code>]1;5[</code> intervallum · <code>Enter</code> ellenőrzés' };
})();
