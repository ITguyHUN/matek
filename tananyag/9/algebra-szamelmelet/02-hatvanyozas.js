/*
 * II. Algebra és számelmélet / 2. Hatványozás (pozitív egész kitevő, azonosságok)
 * (Sokszínű matematika 9., II/2. lecke; FGY 1111–1132; OH Matematika 9., 23–24. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, keverd, zj, tagT, nagyHatv, kitevo, primT, FMT9 } = M9;
  const feladatok = {};
  const REL = ['<', '=', '>'];

  /* ---------- hatvány értéke ---------- */
  feladatok.ertek = { nev: 'Hatvány értéke', general() {
    const t = R(0, 5); let tex, v, mo;
    if (t === 0) { const a = R0(-5, 5), n = R(2, a * a > 9 ? 3 : 5); tex = T`${zj(a)}^{${n}}`; v = F(a ** n); mo = T`\(${zj(a)}^{${n}}=${Array(n).fill(zj(a)).join(T`\cdot `)}=${a ** n}\)`; }
    else if (t === 1) { const a = R(2, 5), n = R(2, a > 3 ? 3 : 5); tex = T`-${a}^{${n}}`; v = F(-(a ** n)); mo = T`A hatványozást végezzük el először: \(-${a}^{${n}}=-(${a}^{${n}})=${-(a ** n)}\). (Ez nem ugyanaz, mint \((-${a})^{${n}}=${(-a) ** n}\).)`; }
    else if (t === 2) { const q = R(2, 6); let p; do { p = R0(-5, 5); } while (gcd(p, q) !== 1); const n = R(2, 4); const f = fpow(F(p, q), n);
      tex = T`\left(${ft(F(p, q))}\right)^{${n}}`; v = f; mo = T`\(\left(\frac{a}{b}\right)^n=\frac{a^n}{b^n}\): \(${p < 0 ? (n % 2 ? '-' : '') : ''}\frac{${Math.abs(p) ** n}}{${q ** n}}\)`; }
    else if (t === 3) { const d = P([1, 2, 3, 5]), n = R(2, 4); const x = d / 10; tex = T`${nt(x)}^{${n}}`; v = F(d ** n, 10 ** n); mo = T`\(${nt(x)}^{${n}}=\frac{${d ** n}}{${10 ** n}}=${nt(+(x ** n).toFixed(8))}\)`; }
    else if (t === 4) { const n = R(1, 30); tex = T`(-1)^{${n}}`; v = F(n % 2 ? -1 : 1); mo = T`A \(-1\) páros kitevős hatványa \(1\), páratlan kitevős hatványa \(-1\). A ${n} ${n % 2 ? 'páratlan' : 'páros'}.`; }
    else { const a = R(2, 4), m = R(2, 3), n = R(2, 3); const s = R(0, 1) ? -1 : 1; tex = T`\left(${s < 0 ? '-' : ''}${a}^{${m}}\right)^{${n}}`; v = F((s * a ** m) ** n); mo = T`\(\left(${s < 0 ? '-' : ''}${a}^{${m}}\right)^{${n}}=${s < 0 ? T`\left(-${a ** m}\right)` : a ** m}^{${n}}=${(s * a ** m) ** n}\)`; }
    return { kerdes: T`<p>Számítsd ki a hatvány értékét!</p>\[${tex}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
      tipp: 'Negatív szám páros kitevős hatványa pozitív, páratlan kitevős hatványa negatív. Figyelj, hogy a negatív előjel a zárójelen belül vagy kívül van!',
      megoldas: [mo, T`Az eredmény: \(${ft(v)}\).`] };
  } };

  /* ---------- azonosságok: kitevő ---------- */
  feladatok.azonossag = { nev: 'Azonosságok: kitevő', general() {
    const a = P(['a', 'x', 'b', 'y']);
    for (let g = 0; g < 100; g++) {
      const t = R(0, 3); let tex, e, lep;
      if (t === 0) { const [m, n, k] = [R(2, 9), R(2, 9), R(2, 9)]; e = m + n - k; tex = T`${a}^{${m}}\cdot ${a}^{${n}}:${a}^{${k}}`; lep = T`\(${m}+${n}-${k}=${e}\)`; }
      else if (t === 1) { const [m, n, k] = [R(2, 5), R(2, 4), R(1, 9)]; e = m * n + k; tex = T`\left(${a}^{${m}}\right)^{${n}}\cdot ${a}^{${k}}`; lep = T`\(${m}\cdot ${n}+${k}=${e}\)`; }
      else if (t === 2) { const [m, n, p, q, k] = [R(2, 4), R(2, 3), R(2, 4), R(2, 3), R(2, 12)]; e = m * n + p * q - k; tex = T`\frac{\left(${a}^{${m}}\right)^{${n}}\cdot \left(${a}^{${p}}\right)^{${q}}}{${a}^{${k}}}`; lep = T`\(${m}\cdot ${n}+${p}\cdot ${q}-${k}=${e}\)`; }
      else { const [m, n, k, l] = [R(2, 6), R(2, 4), R(2, 5), R(1, 3)]; e = m * n - k * l + 1; tex = T`\frac{${a}^{${m * n}}\cdot ${a}}{\left(${a}^{${k}}\right)^{${l}}}`; lep = T`\(${m * n}+1-${k}\cdot ${l}=${e}\)`; }
      if (e < 1 || e > 40) continue;
      return { kerdes: T`<p>Írd fel egyetlen hatványként! Mi kerül a négyzet helyére? (\(${a}\neq0\))</p>\[${tex}=${a}^{\square}\]`,
        valasz: { ertekek: [e] }, formatum: FMT9.egesz,
        tipp: T`\(${a}^m\cdot ${a}^n=${a}^{m+n}\), \(\;${a}^m:${a}^n=${a}^{m-n}\), \(\;\left(${a}^m\right)^n=${a}^{mn}\)`,
        megoldas: [T`A kitevő: ${lep}.`, T`\[${tex}=${a}^{${e}}\]`] };
    }
  } };

  /* ---------- betűs kifejezések egyszerűsítése ---------- */
  feladatok.betus = { nev: 'Betűs kifejezések egyszerűsítése', general() {
    const [u, w] = P([['a', 'b'], ['x', 'y']]);
    for (let g = 0; g < 100; g++) {
      const t = R(0, 2); let tex, k, p, q;
      if (t === 0) { const c = R0(-3, 3), m = R(1, 4), n = R(1, 3), e = R(2, 3), d = R0(-4, 4), r = R(1, 3), s = R(1, 4);
        tex = T`\left(${tagT(c, { [u]: m, [w]: n })}\right)^{${e}}\cdot ${d < 0 ? T`\left(${tagT(d, { [u]: r, [w]: s })}\right)` : tagT(d, { [u]: r, [w]: s })}`;
        k = c ** e * d; p = m * e + r; q = n * e + s; }
      else if (t === 1) { const c = R0(-3, 3), m = R(1, 3), e = R(2, 3), d = R(2, 4), r = R(1, 3), f = 2;
        tex = T`\left(${tagT(c, { [u]: m })}\right)^{${e}}\cdot\left(${tagT(d, { [u]: r })}\right)^{${f}}`; k = c ** e * d ** f; p = m * e + r * f; q = 0; }
      else { const m = R(1, 3), n = R(2, 4), e = R(2, 4), r = R(1, 3), s = R(1, 3), f = 2, c = R(2, 6);
        tex = T`\frac{${c * c}\left(${tagT(1, { [u]: m, [w]: n })}\right)^{${e}}}{\left(${tagT(c, { [u]: r, [w]: s })}\right)^{${f}}}`; k = 1; p = m * e - r * f; q = n * e - s * f; }
      if (p < 1 || q < 0 || Math.abs(k) > 2000) continue;
      const vars = q ? { [u]: p, [w]: q } : { [u]: p };
      const mit = q ? P(['k', 'p', 'q']) : P(['k', 'p']);
      const nev = { k: 'az együttható', p: T`az \(${u}\) kitevője`, q: T`az \(${w}\) kitevője` }[mit];
      return { kerdes: T`<p>Hozd egyszerűbb alakra a kifejezést! Mennyi lesz az eredményben ${nev}?</p>\[${tex}\]`,
        valasz: { ertekek: [{ k, p, q }[mit]] }, formatum: FMT9.egesz,
        tipp: T`Szorzatot tényezőnként emelünk hatványra: \((ab)^n=a^nb^n\), \(\left(a^m\right)^n=a^{mn}\). Az együtthatót is hatványozni kell!`,
        megoldas: [T`\[${tex}=${tagT(k, vars)}\]`] };
    }
  } };

  /* ---------- számolás az azonosságokkal ---------- */
  const ALAP = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 25, 27, 30, 36];
  const vek = n => [kitevo(n, 2), kitevo(n, 3), kitevo(n, 5)];
  feladatok.szamolas = { nev: 'Számolás azonosságokkal', general() {
    for (let g = 0; g < 2000; g++) {
      const tagok = n => Array.from({ length: n }, () => [P(ALAP), R(2, 7)]);
      const fent = tagok(R(1, 2) + (R(0, 2) === 0 ? 1 : 0)), lent = tagok(2);
      const e = [0, 0, 0];
      fent.forEach(([b, k]) => vek(b).forEach((x, i) => { e[i] += x * k; }));
      lent.forEach(([b, k]) => vek(b).forEach((x, i) => { e[i] -= x * k; }));
      const szam = 2 ** Math.max(e[0], 0) * 3 ** Math.max(e[1], 0) * 5 ** Math.max(e[2], 0), nev = 2 ** Math.max(-e[0], 0) * 3 ** Math.max(-e[1], 0) * 5 ** Math.max(-e[2], 0);
      if (szam > 300 || nev > 30 || (szam === 1 && nev === 1)) continue;
      if (e.reduce((s, x) => s + Math.abs(x), 0) < 1) continue;
      if (fent.concat(lent).reduce((s, [, k]) => s + k, 0) < 12) continue;
      const tx = l => l.map(([b, k]) => T`${b}^{${k}}`).join(T`\cdot `);
      const ptx = l => l.map(([b, k]) => { const pt = primT(b); return pt.includes('cdot') || pt.includes('^') ? T`\left(${pt}\right)^{${k}}` : T`${pt}^{${k}}`; }).join(T`\cdot `);
      const kit = (i, s) => { const p = [2, 3, 5][i]; return e[i] * s > 0 ? (e[i] * s === 1 ? String(p) : T`${p}^{${e[i] * s}}`) : null; };
      const fentR = [0, 1, 2].map(i => kit(i, 1)).filter(Boolean).join(T`\cdot `) || '1', lentR = [0, 1, 2].map(i => kit(i, -1)).filter(Boolean).join(T`\cdot `);
      const v = F(szam, nev);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\frac{${tx(fent)}}{${tx(lent)}}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: 'Bontsd fel az alapokat prímszámok szorzatára (pl. 12 = 2²·3), majd az azonos alapú hatványokat vond össze!',
        megoldas: [T`\[\frac{${ptx(fent)}}{${ptx(lent)}}\]`, T`Az azonos alapú hatványok kitevőit összevonva: \[${lentR ? T`\frac{${fentR}}{${lentR}}` : fentR}=${ft(v)}\]`] };
    }
  } };

  /* ---------- melyik a nagyobb? ---------- */
  const CSALAD = [[2, [2, 4, 8, 16, 32]], [3, [3, 9, 27, 81]], [5, [5, 25, 125]]];
  feladatok.hasonlit = { nev: 'Melyik a nagyobb?', general() {
    const t = R(0, 2); let A, m, B, n, lep;
    if (t < 2) {   // azonos alapra hozható
      const [p, cs] = P(CSALAD); let ia, ib;
      do { [ia, ib] = [R(0, cs.length - 1), R(0, cs.length - 1)]; } while (ia === ib);
      A = cs[ia]; B = cs[ib]; m = R(2, 12); n = R(2, 12); if (R(0, 4) === 0) { const L = (ia + 1) * m; if (L % (ib + 1) === 0) n = L / (ib + 1); }
      lep = [T`Írjuk fel mindkettőt ${p} hatványaként: \(${A}^{${m}}=\left(${p}^{${ia + 1}}\right)^{${m}}=${p}^{${(ia + 1) * m}}\), \(${B}^{${n}}=${p}^{${(ib + 1) * n}}\).`];
    } else {         // azonos kitevőre hozható: 2^30 és 3^20
      const k = R(2, 100); const [[a, b], [x, y]] = P([[[2, 3], [3, 2]], [[2, 5], [5, 2]], [[3, 5], [4, 3]], [[2, 3], [5, 3]], [[3, 2], [2, 3]], [[5, 2], [3, 3]], [[2, 7], [3, 4]], [[4, 3], [5, 2]], [[6, 2], [3, 3]], [[2, 10], [10, 3]]]);
      A = a; m = x * k; B = b; n = y * k;
      lep = [T`Közös kitevőre hozzuk: \(${A}^{${m}}=\left(${A}^{${x}}\right)^{${k}}=${A ** x}^{${k}}\), \(${B}^{${n}}=\left(${B}^{${y}}\right)^{${k}}=${B ** y}^{${k}}\).`];
    }
    const X = nagyHatv(A, m), Y = nagyHatv(B, n); const c = X < Y ? 0 : X === Y ? 1 : 2;
    lep.push(T`Ezért \(${A}^{${m}}${REL[c]}${B}^{${n}}\).`);
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére? (Számológép nélkül döntsd el!)</p>\[${A}^{${m}}\;\square\;${B}^{${n}}\]`,
      valasz: { valasztas: REL, helyes: c }, tipp: 'Hozd a két hatványt azonos alapra vagy azonos kitevőre!', megoldas: lep };
  } };

  /* ---------- utolsó számjegy ---------- */
  feladatok.utolso = { nev: 'Utolsó számjegy', general() {
    const a = P([2, 3, 4, 7, 8, 9, 12, 13, 17, 18, 19, 22, 23, 27, 33]), n = R(15, 2030);
    const ut = a % 10; const ciklus = []; let x = ut; do { ciklus.push(x); x = x * ut % 10; } while (x !== ut);
    const j = ciklus[(n - 1) % ciklus.length];
    return { kerdes: T`<p>Melyik számjegyre végződik a hatvány?</p>\[${a}^{${n}}\]`, valasz: { ertekek: [j] }, formatum: 'egy számjegy',
      tipp: T`Csak az alap utolsó jegye számít. Írd fel az első néhány hatvány utolsó jegyét: ismétlődni fognak!`,
      megoldas: ciklus.length === 1 ? [T`A ${ut}-re végződő számok minden hatványa ${ut}-re végződik.`] : [T`Az alap utolsó jegye ${ut}; a hatványok utolsó jegyei: \(${ciklus.join(',\\ ')},\ \dots\) – ezek ${ciklus.length}-esével ismétlődnek.`, T`\(${n}=${ciklus.length}\cdot ${Math.floor(n / ciklus.length)}+${n % ciklus.length}\), ezért a ciklus ${(n - 1) % ciklus.length + 1}. elemét kell venni: \(${j}\).`] };
  } };

  /* ---------- hány nullára végződik? ---------- */
  feladatok.nullak = { nev: 'Hány nullára végződik?', general() {
    const tenyezok = keverd([[P([2, 4, 8, 16]), R(3, 60)], [P([5, 25, 125]), R(3, 60)], ...(R(0, 1) ? [[P([10, 20, 50]), R(2, 30)]] : [])]);
    let e2 = 0, e5 = 0; tenyezok.forEach(([b, k]) => { e2 += kitevo(b, 2) * k; e5 += kitevo(b, 5) * k; });
    const db = Math.min(e2, e5);
    return { kerdes: T`<p>Hány nullára végződik a szorzat?</p>\[${tenyezok.map(([b, k]) => T`${b}^{${k}}`).join(T`\cdot `)}\]`, valasz: { ertekek: [db] }, formatum: FMT9.egesz,
      tipp: 'Minden 0 a szám végén egy 10 = 2 · 5 tényezőből jön. Számold meg, hány 2-es és hány 5-ös prímtényező van!',
      megoldas: [T`A 2-es prímtényezők száma: \(${e2}\), az 5-ösöké: \(${e5}\).`, T`Ebből \(${db}\) darab \(2\cdot5=10\) tényező alkotható, tehát ${db} nullára végződik.`] };
  } };

  /* ---------- hányadik hatvány? ---------- */
  feladatok.kitevo = { nev: 'Hányadik hatvány?', general() {
    const [p, cs] = P(CSALAD); const t = R(0, 1);
    if (t === 0) { let ia, ib; do { ia = R(1, cs.length - 1); ib = R(0, cs.length - 1); } while (ia === ib); const x = R(2, 9); const T0 = (ia + 1) * x; if (T0 % (ib + 1)) return this.general();
      const n = T0 / (ib + 1);
      return { kerdes: T`<p>Hányadik hatványra kell emelni a bal oldali számot, hogy a jobb oldalit kapjuk? Mi kerül a négyzet helyére?</p>\[${cs[ia]}^{\square}=${cs[ib]}^{${n}}\]`,
        valasz: { ertekek: [x] }, formatum: FMT9.egesz, tipp: `Írd fel mindkét számot ${p} hatványaként!`,
        megoldas: [T`\(${cs[ia]}^{x}=\left(${p}^{${ia + 1}}\right)^x=${p}^{${ia + 1}x}\), és \(${cs[ib]}^{${n}}${ib ? T`=${p}^{${T0}}` : ''}\).`, T`\(${ia + 1}x=${T0}\), tehát \(x=${x}\).`] }; }
    const s = R(1, cs.length - 1), u = R(2, 4), x = R(2, 6); const T0 = (s + 1) * u * x; const ib = R(0, cs.length - 1); if (T0 % (ib + 1)) return this.general();
    const n = T0 / (ib + 1);
    return { kerdes: T`<p>Mi kerül a négyzet helyére?</p>\[\left(${cs[s]}^{${u}}\right)^{\square}=${cs[ib]}^{${n}}\]`, valasz: { ertekek: [x] }, formatum: FMT9.egesz,
      tipp: `Írd fel mindkét oldalt ${p} hatványaként, és hasonlítsd össze a kitevőket!`,
      megoldas: [T`Bal oldal: \(\left(${p}^{${(s + 1) * u}}\right)^{\square}=${p}^{${(s + 1) * u}\cdot\square}\); jobb oldal: \(${p}^{${T0}}\).`, T`\(${(s + 1) * u}\cdot\square=${T0}\), tehát \(\square=${x}\).`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg2',
    cim: 'Hatványozás pozitív egész kitevőre',
    rovid: 'Hatványozás',
    bevezeto: 'A hatvány fogalma és a hatványozás azonosságai: hatványérték, összevonás, egyszerűsítés, összehasonlítás, utolsó jegy.',
    elmelet: T`<div class="prose"><p>Ha \(a\) valós szám és \(n\ge2\) egész, akkor \(a^n\) az az \(n\)-tényezős szorzat, amelynek minden tényezője \(a\): \(a^n=a\cdot a\cdots a\). Továbbá \(a^1=a\). Az \(a\) az <b>alap</b>, az \(n\) a <b>kitevő</b>.</p>
<ul><li>Negatív szám páros kitevős hatványa pozitív, páratlan kitevős hatványa negatív: \((-2)^4=16\), \((-2)^3=-8\).</li>
<li>Vigyázz: \(-2^4=-16\), mert a hatványozást végezzük el előbb.</li></ul></div>
<div class="tbl"><table><tr><th>Azonosság</th><th>Példa</th></tr>
<tr><td>\(a^m\cdot a^n=a^{m+n}\)</td><td>\(2^3\cdot2^4=2^7\)</td></tr>
<tr><td>\(a^m:a^n=a^{m-n}\) \((a\neq0,\ m>n)\)</td><td>\(5^7:5^4=5^3\)</td></tr>
<tr><td>\((a\cdot b)^n=a^n\cdot b^n\)</td><td>\((2x)^3=8x^3\)</td></tr>
<tr><td>\(\left(\frac ab\right)^n=\frac{a^n}{b^n}\) \((b\neq0)\)</td><td>\(\left(\frac23\right)^3=\frac{8}{27}\)</td></tr>
<tr><td>\(\left(a^m\right)^n=a^{m\cdot n}\)</td><td>\(\left(3^2\right)^5=3^{10}\)</td></tr></table></div>
<div class="prose"><p><b>Összehasonlítás:</b> hozd a hatványokat azonos alapra (\(8^5=2^{15}\), \(16^4=2^{16}\)) vagy azonos kitevőre (\(2^{30}=8^{10}\), \(3^{20}=9^{10}\)).</p></div>`,
    igazHamis: [
      { allitas: T`\(-2^4=16\)`, igaz: false, miert: T`\(-2^4=-(2^4)=-16\); csak \((-2)^4=16\).` },
      { allitas: T`\(2^3\cdot2^4=2^{12}\)`, igaz: false, miert: T`Azonos alapú hatványok szorzásakor a kitevők összeadódnak: \(2^7\).` },
      { allitas: T`\(\left(2^3\right)^4=2^{12}\)`, igaz: true, miert: T`Hatvány hatványozásakor a kitevők összeszorzódnak.` },
      { allitas: T`\(2^3+2^3=2^4\)`, igaz: true, miert: T`\(2^3+2^3=2\cdot2^3=2^4\).` },
      { allitas: T`\(3^4+3^4=6^4\)`, igaz: false, miert: T`\(3^4+3^4=2\cdot3^4=162\), de \(6^4=1296\).` },
      { allitas: T`\((2x)^3=2x^3\)`, igaz: false, miert: T`\((2x)^3=8x^3\): a 2-t is köbre kell emelni.` },
      { allitas: T`Negatív szám páratlan kitevős hatványa negatív.`, igaz: true, miert: 'Páratlan sok negatív tényező szorzata negatív.' },
      { allitas: T`\(2^{30}>3^{20}\)`, igaz: false, miert: T`\(2^{30}=8^{10}\), \(3^{20}=9^{10}\), és \(8<9\).` },
      { allitas: T`\(4^8=8^4\)`, igaz: false, miert: T`\(4^8=2^{16}\), \(8^4=2^{12}\).` },
      { allitas: T`\(4^6=8^4\)`, igaz: true, miert: T`Mindkettő \(2^{12}\).` },
      { allitas: T`\(1^{100}=100\)`, igaz: false, miert: T`Az 1 minden hatványa 1.` },
      { allitas: T`\(0{,}1^3=0{,}001\)`, igaz: true, miert: T`\(\left(\frac1{10}\right)^3=\frac1{1000}\).` },
      { allitas: T`A \(2^{10}\cdot5^{8}\) szám 10 nullára végződik.`, igaz: false, miert: T`Csak 8 darab \(2\cdot5\) pár van, így 8 nullára végződik.` },
      { allitas: T`\(\frac{a^{12}}{a^4}=a^3\) \((a\neq0)\)`, igaz: false, miert: T`Osztáskor a kitevőket kivonjuk: \(a^8\).` },
      { general() { const a = R0(-4, 4), n = R(2, 5); const jo = a ** n; const mut = R(0, 1) ? jo : -jo;
        return { allitas: T`\(${zj(a)}^{${n}}=${mut}\)`, igaz: mut === jo, miert: T`\(${zj(a)}^{${n}}=${jo}\).` }; } },
      { general() { const m = R(2, 6), n = R(2, 6); const jo = m + n; const mut = R(0, 1) ? jo : m * n; if (jo === m * n) return { allitas: T`\(a^{${m}}\cdot a^{${n}}=a^{${jo}}\)`, igaz: true, miert: 'A kitevők összeadódnak.' };
        return { allitas: T`\(a^{${m}}\cdot a^{${n}}=a^{${mut}}\)`, igaz: mut === jo, miert: T`Szorzáskor a kitevők összeadódnak: \(a^{${jo}}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Melyik a nagyobb: \(2^{30}\) vagy \(3^{20}\)?`,
      lepesek: [T`A kitevők legnagyobb közös osztója 10, ezért hozzuk őket 10-es kitevőre.`, T`\(2^{30}=\left(2^3\right)^{10}=8^{10}\)`, T`\(3^{20}=\left(3^2\right)^{10}=9^{10}\)`, T`Azonos kitevőnél a nagyobb pozitív alapú hatvány a nagyobb: \(8^{10}<9^{10}\), tehát \(2^{30}<3^{20}\).`]
    },
    feladatok
  }));
})();
