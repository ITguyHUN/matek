/*
 * II. Algebra és számelmélet / 5. Egész kifejezések (polinomok)
 * (Sokszínű matematika 9., II/5. lecke; FGY 1151–1152, 1191; OH Matematika 9., 28–30. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, keverd, tagT, tagokT, pAdd, pScale, pSub, pMul, pEval, pDeg, pT, linT, zj, zjn, FMT9 } = M9;
  const feladatok = {};
  const rnd = (fok, max = 5) => { const p = []; for (let i = 0; i <= fok; i++) p.push(R(-max, max)); if (!p[fok]) p[fok] = R0(-max, max); return p; };
  /* a kérdezett együttható: véletlen fokszám a polinom fokáig */
  function kerdez(p, v) {
    const e = R(0, Math.max(pDeg(p), 1)); const c = p[e] || 0;
    const nev = e === 0 ? 'a konstans tag (a változót nem tartalmazó tag)' : T`ennek a tagnak az együtthatója: \(${tagT(1, { [v]: e })}\)`;
    return { e, c, nev };
  }
  const zarT = (p, v) => `(${pT(p, v)})`;

  /* ---------- fokszám ---------- */
  feladatok.fokszam = { nev: 'Polinom fokszáma', general() {
    const t = R(0, 2);
    if (t === 0) {   // egyváltozós, rendezetlen, a legmagasabb fokú tagok kiesnek
      const v = P(['x', 'a', 'y']); const f = R(2, 5); const c = R0(-6, 6);
      const tagok = [[c, f], [-c, f]]; const g = R(1, f - 1); tagok.push([R0(-6, 6), g]); for (let i = 0; i < R(2, 4); i++) tagok.push([R0(-6, 6), R(0, g)]);
      const kiesik = R(0, 2) > 0; if (!kiesik) { let d; do { d = R0(-6, 6); } while (d === -c); tagok[1][0] = d; }
      const p = []; tagok.forEach(([k, e]) => { p[e] = (p[e] || 0) + k; }); for (let i = 0; i < p.length; i++) p[i] = p[i] || 0;
      if (M9.pDeg(p) < 1) return this.general();
      const kif = tagokT(keverd(tagok).map(([k, e]) => [k, e ? { [v]: e } : {}]));
      return { kerdes: T`<p>Hányadfokú a polinom? (Előbb vond össze az egynemű tagokat!)</p>\[${kif}\]`, valasz: { ertekek: [pDeg(p)] }, formatum: FMT9.egesz,
        tipp: 'A polinom fokszáma az összevonás után megmaradó legmagasabb fokú tag fokszáma.', megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`A fokszám: ${pDeg(p)}.`] };
    }
    if (t === 1) {   // többváltozós
      const tagok = []; for (let i = 0; i < R(3, 4); i++) { const vars = {}; ['x', 'y', 'z'].forEach(b => { if (R(0, 1)) vars[b] = R(1, 4); }); tagok.push([R0(-7, 7), vars]); }
      if (tagok.filter(([, vs]) => Object.keys(vs).length).length < 2) return this.general();
      const fok = Math.max(...tagok.map(([, vs]) => Object.values(vs).reduce((s, e) => s + e, 0)));
      return { kerdes: T`<p>Hányadfokú a többváltozós polinom?</p>\[${tagokT(tagok)}\]`, valasz: { ertekek: [fok] }, formatum: FMT9.egesz,
        tipp: 'Egy tag fokszáma a benne szereplő változók kitevőinek összege; a polinomé a legnagyobb ilyen érték.',
        megoldas: [T`A tagok fokszáma: ${tagok.map(([c, vs]) => T`\(${tagT(c, vs)}\): ${Object.values(vs).reduce((s, e) => s + e, 0)}`).join('; ')}.`, T`A legnagyobb: ${fok}.`] };
    }
    const v = 'x'; const a = rnd(R(1, 2), 4), b = rnd(R(1, 2), 4);
    const p = pMul(a, b);
    return { kerdes: T`<p>Hányadfokú lesz a szorzat, ha elvégezzük a szorzást?</p>\[${zarT(a, v)}${zarT(b, v)}\]`, valasz: { ertekek: [pDeg(p)] }, formatum: FMT9.egesz,
      tipp: 'A legmagasabb fokú tagok szorzata adja a szorzat legmagasabb fokú tagját: a fokszámok összeadódnak.',
      megoldas: [T`A legmagasabb fokú tagok szorzata: \(${tagT(a[a.length - 1], { x: pDeg(a) })}\cdot ${b[b.length - 1] < 0 ? T`\left(${tagT(b[b.length - 1], { x: pDeg(b) })}\right)` : tagT(b[b.length - 1], { x: pDeg(b) })}=${tagT(a[a.length - 1] * b[b.length - 1], { x: pDeg(p) })}\).`, T`A fokszám: ${pDeg(p)}.`] };
  } };

  /* ---------- összeadás, kivonás, számmal szorzás ---------- */
  feladatok.osszevonas = { nev: 'Összeadás, kivonás', general() {
    const v = P(['a', 'x', 'b']); const db = R(2, 4); let p = [0]; const reszek = [];
    for (let i = 0; i < db; i++) {
      const q = rnd(2, 5); const k = R(0, 2) ? P([1, -1]) : R0(-4, 4);
      p = pAdd(p, pScale(q, k));
      const elo = i === 0 ? (k === 1 ? '' : k === -1 ? '-' : T`${k}\cdot`) : (k === 1 ? '+' : k === -1 ? '-' : (k > 0 ? T`+${k}\cdot` : T`-${-k}\cdot`));
      reszek.push(elo + zarT(q, v));
    }
    const kif = reszek.join('');
    if (R(0, 3) === 0) { const x = R0(-3, 3); const er = pEval(p, x);
      return { kerdes: T`<p>Végezd el a műveleteket, majd számítsd ki a kifejezés értékét, ha \(${v}=${x}\)!</p>\[${kif}\]`, valasz: { ertekek: [er] }, formatum: FMT9.egesz,
        tipp: 'Bontsd fel a zárójeleket (a mínusz előjel minden tag előjelét megváltoztatja), vond össze az egynemű tagokat, és csak a végén helyettesíts!',
        megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`\(${v}=${x}\) esetén: \(${er}\).`] }; }
    const { c, nev } = kerdez(p, v);
    return { kerdes: T`<p>Végezd el a műveleteket! Mennyi lesz az eredményben ${nev}?</p>\[${kif}\]`, valasz: { ertekek: [c] }, formatum: FMT9.egesz,
      tipp: 'Ha a zárójel előtt mínusz jel áll, a zárójel felbontásakor minden tag előjele megváltozik. Számmal szorzásnál minden tagot szorozni kell.',
      megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`A kérdezett együttható: \(${c}\).`] };
  } };

  /* ---------- szorzás ---------- */
  feladatok.szorzas = { nev: 'Polinomok szorzása', general() {
    const v = P(['x', 'a']); const t = R(0, 2); let kif, p;
    if (t === 0) {   // (ax+b)(cx+d) ± (ex+f)(gx+h)
      const [a, b, c, d, e, f, g, h] = [R0(-5, 5), R0(-6, 6), R0(-5, 5), R0(-6, 6), R0(-5, 5), R0(-6, 6), R0(-5, 5), R0(-6, 6)]; const s = P([1, -1]);
      p = pAdd(pMul([b, a], [d, c]), pScale(pMul([f, e], [h, g]), s));
      kif = T`(${linT(a, b, v)})(${linT(c, d, v)})${s > 0 ? '+' : '-'}(${linT(e, f, v)})(${linT(g, h, v)})`;
    } else if (t === 1) {   // egytagú · polinom ± egytagú · polinom
      const m1 = R(1, 2), c1 = R0(-4, 4), q1 = rnd(2, 4), m2 = R(1, 2), c2 = R0(-4, 4), q2 = rnd(R(1, 2), 4);
      const mono = (c, m) => { const r = Array(m + 1).fill(0); r[m] = c; return r; };
      p = pAdd(pMul(mono(c1, m1), q1), pMul(mono(c2, m2), q2));
      kif = T`${tagT(c1, { [v]: m1 })}${zarT(q1, v)}${c2 > 0 ? '+' : '-'}${tagT(Math.abs(c2), { [v]: m2 })}${zarT(q2, v)}`;
    } else {   // (ax+b)(cx²+dx+e)
      const a = R0(-3, 3), b = R0(-5, 5), q = rnd(2, 4); p = pMul([b, a], q); kif = T`(${linT(a, b, v)})${zarT(q, v)}`;
    }
    const { c, nev } = kerdez(p, v);
    return { kerdes: T`<p>Végezd el a szorzásokat, és vond össze az egynemű tagokat! Mennyi lesz az eredményben ${nev}?</p>\[${kif}\]`, valasz: { ertekek: [c] }, formatum: FMT9.egesz,
      tipp: 'Két polinomot úgy szorzunk össze, hogy az egyik minden tagját megszorozzuk a másik minden tagjával, majd összevonunk.',
      megoldas: [T`\[${kif}=${pT(p, v)}\]`, T`A kérdezett együttható: \(${c}\).`] };
  } };

  /* ---------- többszörös zárójelek ---------- */
  const ZAR = [['(', ')'], ['[', ']'], [T`\{`, T`\}`]];
  feladatok.zarojelek = { nev: 'Többszörös zárójelek', general() {
    const v = 'x'; let p = [R(-6, 6), R0(-4, 4)]; let tex = linT(p[1], p[0], v);
    const melyseg = R(2, 3);
    for (let i = 0; i < melyseg; i++) {
      const [ny, zr] = ZAR[i]; const a = R0(-5, 5), b = R(-6, 6); const s = P([1, -1, -1]); const k = R(0, 3) === 0 ? R(2, 3) : 1;
      const belso = T`${k > 1 ? k + T`\cdot` : ''}\left${ny}${tex}\right${zr}`;
      const elol = R(0, 1) === 1;
      if (elol) { tex = T`${linT(a, b, v)}${s > 0 ? '+' : '-'}${belso}`; }
      else { tex = T`${s > 0 ? '' : '-'}${belso}${a > 0 ? '+' : '-'}${tagT(Math.abs(a), { [v]: 1 })}${b ? (b > 0 ? '+' : '-') + Math.abs(b) : ''}`; }
      p = pAdd([b, a], pScale(p, s * k));
    }
    const mit = R(0, 2);
    if (mit === 2) { const x = R0(-4, 4); const er = pEval(p, x);
      return { kerdes: T`<p>Bontsd fel a zárójeleket belülről kifelé haladva, vond össze a tagokat, majd számítsd ki az értékét, ha \(x=${x}\)!</p>\[${tex}\]`, valasz: { ertekek: [er] }, formatum: FMT9.egesz,
        tipp: 'Mindig a legbelső zárójellel kezdd! A zárójel előtti mínusz jel minden benne lévő tag előjelét megfordítja.', megoldas: [T`\[${tex}=${pT(p, v)}\]`, T`\(x=${x}\) esetén: \(${er}\).`] }; }
    const e = mit; const c = p[e] || 0;
    return { kerdes: T`<p>Bontsd fel a zárójeleket belülről kifelé haladva, és vond össze a tagokat! Mennyi lesz ${e === 1 ? T`az \(x\) együtthatója` : 'a konstans tag'}?</p>\[${tex}\]`, valasz: { ertekek: [c] }, formatum: FMT9.egesz,
      tipp: 'Mindig a legbelső zárójellel kezdd! A zárójel előtti mínusz jel minden benne lévő tag előjelét megfordítja.', megoldas: [T`\[${tex}=${pT(p, v)}\]`] };
  } };

  /* ---------- együtthatók összege, konstans tag (emelt) ---------- */
  feladatok.egyutthatoOsszeg = { nev: 'Együtthatók összege', szint: 'emelt', general() {
    for (let g = 0; g < 200; g++) {
      const p = rnd(R(1, 2), 3); const n = R(2, 2030); const mit = P(['ossz', 'ossz', 'konst', 'fo']);
      const p1 = pEval(p, 1), p0 = p[0], pf = p[p.length - 1];
      const alap = { ossz: p1, konst: p0, fo: pf }[mit];
      if (Math.abs(alap) > 1 && n > 6) continue;
      if (Math.abs(alap) > 1 && Math.abs(alap) ** n > 5000) continue;
      const er = alap ** n === 0 ? 0 : alap ** n;
      const nev = { ossz: 'az együtthatók összege', konst: 'a konstans tag', fo: 'a főegyüttható (a legmagasabb fokú tag együtthatója)' }[mit];
      const lep = { ossz: T`Az együtthatók összege a polinom értéke az \(x=1\) helyen. A zárójelben lévő kifejezés értéke \(x=1\)-nél: \(${p1}\).`, konst: T`A konstans tag a polinom értéke az \(x=0\) helyen. A zárójelben lévő kifejezés értéke \(x=0\)-nál: \(${p0}\).`, fo: T`A zárójelben a legmagasabb fokú tag együtthatója \(${pf}\); a hatvány legmagasabb fokú tagja ennek a tagnak a hatványa.` }[mit];
      return { kerdes: T`<p>Ha a kifejezést polinom alakra hozzuk (elvégezzük a hatványozást), mennyi lesz ${nev}?</p>\[${zarT(p, 'x')}^{${n}}\]`, valasz: { ertekek: [er] }, formatum: FMT9.egesz,
        tipp: mit === 'ossz' ? T`Az együtthatók összegét megkapod, ha \(x\) helyére 1-et írsz.` : mit === 'konst' ? T`A konstans tagot megkapod, ha \(x\) helyére 0-t írsz.` : 'A hatvány legmagasabb fokú tagja a legmagasabb fokú tag hatványa.',
        megoldas: [lep, T`Így ${nev}: \(${zj(alap)}^{${n}}=${er}\).`] };
    }
  } };

  /* ---------- polinomok egyenlősége ---------- */
  feladatok.egyenloseg = { nev: 'Polinomok egyenlősége', general() {
    const t = R(0, 1);
    if (t === 0) {
      const a = R0(-6, 6), b = R(-6, 6), c = R(-9, 9); const s = R0(-4, 4), u = R0(-4, 4);
      const ker = P(['p', 'q']);
      const xT = k => k === 0 ? '' : (k > 0 ? '+' : '-') + (Math.abs(k) === 1 ? '' : Math.abs(k)) + 'x';
      const bal = T`(p${el0(s)})x^2${xT(b)}${el0(c)}`;
      const jobb = T`${tagT(a, { x: 2 })}+(q${el0(u)})x${el0(c)}`;
      const ertek = ker === 'p' ? a - s : b - u;
      return { kerdes: T`<p>Az alábbi két polinom minden \(x\)-re egyenlő. Mennyi ${ker === 'p' ? T`a \(p\)` : T`a \(q\)`} értéke?</p>\[${bal}\equiv ${jobb}\]`,
        valasz: { ertekek: [ertek] }, formatum: FMT9.egesz, tipp: 'Két polinom akkor egyenlő, ha az azonos fokú tagjaik együtthatói rendre megegyeznek.',
        megoldas: [ker === 'p' ? T`Az \(x^2\) együtthatói: \(p${el0(s)}=${a}\), így \(p=${a - s}\).` : T`Az \(x\) együtthatói: \(${b}=q${el0(u)}\), így \(q=${b - u}\).`] };
    }
    const f = R(2, 4), s = R0(-6, 6); const tobbi = rnd(f - 1, 6);
    const kif = T`(k${s > 0 ? '-' : '+'}${Math.abs(s)})x^{${f}}${tagokT(tobbi.map((c, i) => [c, i ? { x: i } : {}]).reverse()).replace(/^(?!-)/, '+')}`;
    return { kerdes: T`<p>Milyen \(k\) értékre lesz a polinom ${['', '', 'első', 'másod', 'harmad'][f]}fokú?</p>\[${kif}\]`, valasz: { ertekek: [s] }, formatum: FMT9.egesz,
      tipp: T`Az \(x^{${f}}\) tagnak el kell tűnnie: az együtthatója legyen 0.`,
      megoldas: [T`\(k${s > 0 ? '-' : '+'}${Math.abs(s)}=0\iff k=${s}\). Ekkor a legmagasabb fokú tag \(${tagT(tobbi[f - 1], { x: f - 1 })}\).`] };
  } };
  const el0 = c => c === 0 ? '' : (c > 0 ? '+' : '-') + Math.abs(c);

  /* ---------- zérushely ---------- */
  feladatok.zerushely = { nev: 'Zérushely', general() {
    const t = R(0, 2);
    if (t === 0) { const a = R0(-6, 6), b = R0(-12, 12); const z = F(-b, a);
      return { kerdes: T`<p>Mi a polinom zérushelye (az a szám, ahol az értéke 0)?</p>\[p(x)=${linT(a, b)}\]`, valasz: { ertekek: [fv(z)] }, formatum: FMT9.tort,
        tipp: T`Oldd meg a \(${linT(a, b)}=0\) egyenletet!`, megoldas: [T`\[${linT(a, b)}=0\iff ${tagT(a, { x: 1 })}=${-b}\iff x=${ft(z)}\]`] }; }
    if (t === 1) { const r = R0(-5, 5), b = R(-7, 7); const c = -(r * r + b * r);
      return { kerdes: T`<p>Mennyi legyen \(c\) értéke, hogy az \(x=${r}\) zérushelye legyen a polinomnak?</p>\[p(x)=x^2${b ? (b > 0 ? '+' : '-') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x' : ''}+c\]`,
        valasz: { ertekek: [c] }, formatum: FMT9.egesz, tipp: T`A zérushelyen a polinom értéke 0: írd be \(x=${r}\)-et, és oldd meg \(c\)-re!`,
        megoldas: [T`\(p(${r})=${zjn(r)}^2${b ? (b > 0 ? '+' : '-') + Math.abs(b) + T`\cdot ${zjn(r)}` : ''}+c=${r * r + b * r}+c=0\), ezért \(c=${c}\).`] }; }
    const [p, q] = M9.kulonbozo(2, -6, 6); const s = R0(-3, 3);
    const poli = pMul([-p, 1], [-q, 1]).map(x => x * s);
    const jelolt = keverd([p, q, ...M9.kulonbozo(3, -7, 7, [p, q])]);
    return { kerdes: T`<p>A következő számok közül melyek a polinom zérushelyei? Add meg mindet!</p><p>\(${jelolt.join(';\\ ')}\)</p>\[p(x)=${pT(poli)}\]`, valasz: { ertekek: [p, q] }, formatum: FMT9.halmaz,
      tipp: 'Helyettesítsd be sorban a számokat: ahol a polinom értéke 0, az zérushely.',
      megoldas: [jelolt.map(x => T`\(p(${x})=${pEval(poli, x)}\)`).join('; '), T`A zérushelyek: \(${Math.min(p, q)}\) és \(${Math.max(p, q)}\).`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg5',
    cim: 'Egész kifejezések (polinomok)',
    rovid: 'Polinomok',
    bevezeto: 'Polinomok fokszáma, összeadása, kivonása és szorzása, a zárójelek felbontása, polinomok egyenlősége és zérushelye.',
    elmelet: T`<div class="prose"><p>Az egytagú kifejezések összegét <b>polinomnak</b> (egész kifejezésnek) nevezzük, pl. \(3x^2-5x+2\). A polinom <b>fokszáma</b> a legmagasabb fokú (nem nulla együtthatójú) tagjának fokszáma.</p>
<ul><li><b>Összeadás, kivonás:</b> felbontjuk a zárójeleket, és összevonjuk az egynemű tagokat. A zárójel előtti mínusz jel minden tag előjelét megfordítja: \(-(a^2-a-3)=-a^2+a+3\).</li>
<li><b>Szorzás:</b> az egyik polinom minden tagját szorozzuk a másik minden tagjával: \((2x-1)(x+3)=2x^2+6x-x-3=2x^2+5x-3\).</li>
<li><b>Többszörös zárójel:</b> belülről kifelé haladunk: \((\ )\to[\ ]\to\{\ \}\).</li>
<li><b>Egyenlőség:</b> két polinom egyenlő, ha az azonos fokú tagok együtthatói rendre egyenlők.</li>
<li><b>Zérushely:</b> az a szám, amelyet behelyettesítve a polinom értéke 0.</li>
<li><b>Hasznos:</b> a \(p(x)\) polinom együtthatóinak összege \(p(1)\), a konstans tagja \(p(0)\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`A \(3x^4+2x-3x^4+x^2\) polinom negyedfokú.`, igaz: false, miert: T`Összevonás után \(x^2+2x\), ez másodfokú.` },
      { allitas: T`\(-(a^2-a-3)=-a^2+a+3\)`, igaz: true, miert: 'A zárójel előtti mínusz minden tag előjelét megfordítja.' },
      { allitas: T`\(-(a^2-a-3)=-a^2-a-3\)`, igaz: false, miert: T`\(-(-a)=+a\) és \(-(-3)=+3\).` },
      { allitas: T`\(2(x^2+3x)=2x^2+3x\)`, igaz: false, miert: T`Minden tagot szorozni kell: \(2x^2+6x\).` },
      { allitas: T`\((x+2)(x+3)=x^2+5x+6\)`, igaz: true, miert: T`\(x^2+3x+2x+6\).` },
      { allitas: T`\((x+2)(x-3)=x^2-6\)`, igaz: false, miert: T`A középső tagok is kellenek: \(x^2-3x+2x-6=x^2-x-6\).` },
      { allitas: T`Két elsőfokú polinom szorzata másodfokú.`, igaz: true, miert: T`A főtagok szorzata \(ax\cdot cx=acx^2\), és \(ac\neq0\).` },
      { allitas: T`Két másodfokú polinom összege mindig másodfokú.`, igaz: false, miert: T`Pl. \((x^2+1)+(-x^2+x)=x+1\) elsőfokú.` },
      { allitas: T`A \(2x^2y^3-xy+4\) polinom ötödfokú.`, igaz: true, miert: T`A \(2x^2y^3\) tag fokszáma \(2+3=5\).` },
      { allitas: T`Az \(x=2\) zérushelye a \(p(x)=x^2-5x+6\) polinomnak.`, igaz: true, miert: T`\(p(2)=4-10+6=0\).` },
      { allitas: T`A \(p(x)=(x-1)^{10}\) polinom együtthatóinak összege 1.`, igaz: false, miert: T`Az együtthatók összege \(p(1)=0^{10}=0\).` },
      { allitas: T`Ha \(ax^2+bx+c\equiv 3x^2-2\), akkor \(b=0\).`, igaz: true, miert: T`A jobb oldalon nincs \(x\)-es tag, az együtthatója 0.` },
      { allitas: T`\(x\cdot x^2=x^2\)`, igaz: false, miert: T`\(x\cdot x^2=x^3\).` },
      { general() { const a = R0(-4, 4), b = R0(-5, 5), c = R0(-4, 4), d = R0(-5, 5); const jo = a * d + b * c; const mut = R(0, 1) ? jo : jo + P([-1, 1]) * R(1, 3);
        return { allitas: T`\((${linT(a, b)})(${linT(c, d)})\) kifejtésében az \(x\) együtthatója \(${mut}\).`, igaz: mut === jo, miert: T`\(${a}\cdot ${zjn(d)}+${zjn(b)}\cdot ${zjn(c)}=${jo}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Hozzuk egyszerűbb alakra: \((3a-1)(2a+3)-(4a-2)(3a+5)\)`,
      lepesek: [T`Az első szorzat: \((3a-1)(2a+3)=6a^2+9a-2a-3=6a^2+7a-3\).`, T`A második szorzat: \((4a-2)(3a+5)=12a^2+20a-6a-10=12a^2+14a-10\).`, T`Kivonjuk (a zárójel előtti mínusz minden előjelet megfordít): \[6a^2+7a-3-12a^2-14a+10\]`, T`Összevonva: \[-6a^2-7a+7\]`]
    },
    feladatok
  }));
})();
