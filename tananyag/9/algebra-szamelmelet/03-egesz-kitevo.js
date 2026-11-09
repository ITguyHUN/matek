/*
 * II. Algebra és számelmélet / 3. Hatványozás egész kitevőre (0 és negatív kitevő)
 * (Sokszínű matematika 9., II/3. lecke; FGY 1124–1128, 1133; OH Matematika 9., 23–24. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { R0, zj, tagT, kitevo, FMT9 } = M9;
  const feladatok = {};
  const REL = ['<', '=', '>'];
  /* hatvány TeX: alap (egész vagy tört) zárójelezve, ha kell */
  const hT = (b, e) => T`${zj(b)}^{${e}}`;
  /* (p/q)^e pontos értéke törtként (kis számokra) */
  const fhatv = (b, e) => fpow(M9.toF(b), e);

  /* ---------- érték ---------- */
  feladatok.ertek = { nev: '0 és negatív kitevő', general() {
    const t = R(0, 5); let tex, v, lep;
    if (t === 0) { const a = R0(-6, 6), n = R(1, Math.abs(a) > 3 ? 3 : 5); tex = hT(a, -n); v = fhatv(a, -n); lep = n === 1 ? T`\(a^{-1}=\frac1a\): a szám reciproka.` : T`\(${hT(a, -n)}=\frac{1}{${hT(a, n)}}=\frac{1}{${a ** n}}\)`; }
    else if (t === 1) { const q = R(2, 7); let p; do { p = R0(-6, 6); } while (gcd(p, q) !== 1 || Math.abs(p) === 1 && R(0, 1)); const n = R(1, 3); const b = F(p, q);
      tex = T`\left(${ft(b)}\right)^{-${n}}`; v = fhatv(b, -n); lep = T`\(\left(\frac ab\right)^{-n}=\left(\frac ba\right)^n\): \(\left(${ft(F(q, p))}\right)^{${n}}\)`; }
    else if (t === 2) { const a = P([R0(-9, 9), F(R0(-5, 5), R(2, 7)), 0.5, -1.5, 100]); tex = T`${zj(a)}^{0}`; v = F(1); lep = T`Minden 0-tól különböző szám nulladik hatványa 1.`; }
    else if (t === 3) { const d = P([1, 2, 5]), n = R(1, 3); const x = d / 10; tex = T`${nt(x)}^{-${n}}`; v = F(10 ** n, d ** n); lep = T`\(${nt(x)}=\frac{${d}}{10}\), így \(${nt(x)}^{-${n}}=\left(\frac{10}{${d}}\right)^{${n}}\)`; }
    else if (t === 4) { const a = R(2, 5), n = R(1, 3); tex = T`-${a}^{-${n}}`; v = F(-1, a ** n); lep = T`A hatványozás erősebb a negatív előjelnél: \(-${a}^{-${n}}=-\frac{1}{${a}^{${n}}}\)`; }
    else { const n = R(1, 6); tex = T`10^{-${n}}`; v = F(1, 10 ** n); lep = T`\(10^{-${n}}=\frac{1}{10^{${n}}}=${nt(10 ** -n)}\)`; }
    return { kerdes: T`<p>Számítsd ki a hatvány értékét!</p>\[${tex}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
      tipp: T`\(a^0=1\) és \(a^{-n}=\frac1{a^n}\) (\(a\neq0\)). Tört negatív kitevős hatványa: \(\left(\frac ab\right)^{-n}=\left(\frac ba\right)^n\).`,
      megoldas: [lep, T`\[${tex}=${ft(v)}\]`] };
  } };

  /* ---------- hányadik hatványa? ---------- */
  feladatok.hanyadik = { nev: 'Hányadik hatványa?', general() {
    const p = P([2, 2, 3, 3, 5, 10]); const max = { 2: 10, 3: 6, 5: 4, 10: 6 }[p];
    const e = R(-max, max); const t = R(0, 3); let tex, lep;
    if (t === 0 || e === 0) { tex = e >= 0 ? String(p ** e) : T`\frac{1}{${p ** -e}}`; lep = e >= 0 ? T`\(${p ** e}=${p}^{${e}}\)` : T`\(\frac{1}{${p ** -e}}=\frac{1}{${p}^{${-e}}}=${p}^{${e}}\)`; }
    else if (t === 1 && p === 10) { tex = nt(10 ** e); lep = e < 0 ? T`\(${nt(10 ** e)}=\frac{1}{${10 ** -e}}=10^{${e}}\)` : T`\(${10 ** e}=10^{${e}}\)`; }
    else if (t === 1 && p === 2 && e < 0 && e >= -5) { tex = nt(2 ** e); lep = T`\(${nt(2 ** e)}=\frac{1}{${2 ** -e}}=2^{${e}}\)`; }
    else { // (p^k)^m vagy (1/p^k)^m alakban
      const ks = [1, 2, 3].filter(k => e % k === 0 && Math.abs(p ** k) <= 125 && k > 1); if (!ks.length) return this.general();
      const k = P(ks), m = e / k; const b = p ** k;
      tex = R(0, 1) ? T`\left(\frac{1}{${b}}\right)^{${-m}}` : T`${b}^{${m}}`; lep = T`\(${b}=${p}^{${k}}\), így az eredmény \(${p}^{${k}\cdot ${zj(m)}}=${p}^{${e}}\)`; }
    return { kerdes: T`<p>${M9.Az(p)} ${p} hányadik hatványa a következő szám? (A kitevő lehet 0 vagy negatív is.)</p>\[${tex}\]`,
      valasz: { ertekek: [e] }, formatum: FMT9.egesz, tipp: T`\(\frac1{${p}^n}=${p}^{-n}\), és \(${p}^0=1\).`, megoldas: [lep] };
  } };

  /* ---------- azonosságok: kitevő ---------- */
  feladatok.azonossag = { nev: 'Azonosságok egész kitevőre', general() {
    const a = P(['a', 'x', 'b', 'y']);
    for (let g = 0; g < 100; g++) {
      const t = R(0, 3); let tex, e, lep;
      const ki = n => n < 0 ? T`{${n}}` : `{${n}}`;
      if (t === 0) { const [m, n, k] = [R0(-8, 8), R0(-8, 8), R0(-8, 8)]; e = m + n - k; tex = T`${a}^${ki(m)}\cdot ${a}^${ki(n)}:${a}^${ki(k)}`; lep = T`\(${m}+${zj(n)}-${zj(k)}=${e}\)`; }
      else if (t === 1) { const [m, n, k] = [R0(-5, 5), R0(-4, 4), R0(-9, 9)]; e = m * n + k; tex = T`\left(${a}^${ki(m)}\right)^${ki(n)}\cdot ${a}^${ki(k)}`; lep = T`\(${m}\cdot ${zj(n)}+${zj(k)}=${e}\)`; }
      else if (t === 2) { const [m, n, k] = [R0(-6, 6), R0(-3, 3), R0(-8, 8)]; e = k - m * n; tex = T`\frac{${a}^${ki(k)}}{\left(${a}^${ki(m)}\right)^${ki(n)}}`; lep = T`\(${k}-${zj(m)}\cdot ${zj(n)}=${e}\)`; }
      else { const [m, n] = [R(2, 6), R(2, 6)]; e = -m - n; tex = T`\frac{1}{${a}^{${m}}\cdot ${a}^{${n}}}`; lep = T`\(\frac{1}{${a}^{${m + n}}}=${a}^{${-m - n}}\)`; }
      if (Math.abs(e) > 30 || (t < 3 && e === 0 && R(0, 2))) continue;
      return { kerdes: T`<p>Írd fel egyetlen hatványként! Mi kerül a négyzet helyére? (\(${a}\neq0\))</p>\[${tex}=${a}^{\square}\]`,
        valasz: { ertekek: [e] }, formatum: FMT9.egesz,
        tipp: 'Az azonosságok egész kitevőkre is érvényesek: szorzásnál összeadjuk, osztásnál kivonjuk, hatványozásnál összeszorozzuk a kitevőket. Figyelj az előjelekre!',
        megoldas: [T`A kitevő: ${lep}.`, T`\[${tex}=${a}^{${e}}\]`] };
    }
  } };

  /* ---------- számolás ---------- */
  const ALAP = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 25, 27];
  const vek = n => [kitevo(n, 2), kitevo(n, 3), kitevo(n, 5)];
  feladatok.szamolas = { nev: 'Számolás negatív kitevőkkel', general() {
    if (R(0, 2) === 0) {   // összegek: (a^{-1} + b^{-1})^{-1} stb.
      const t = R(0, 2);
      if (t === 0) { const [a, b] = [R(2, 9), R(2, 9)]; const s = fadd(F(1, a), F(1, b)); const v = F(s.d, s.n);
        return { kerdes: T`<p>Számítsd ki!</p>\[\left(${a}^{-1}+${b}^{-1}\right)^{-1}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort, tipp: T`\(a^{-1}=\frac1a\). Előbb a zárójelen belüli összeget számold ki!`,
          megoldas: [T`\[\left(\frac1{${a}}+\frac1{${b}}\right)^{-1}=\left(${ft(s)}\right)^{-1}=${ft(v)}\]`] }; }
      if (t === 1) { const [a, m, b, n] = [R(2, 5), R(1, 3), R(2, 5), R(1, 2)]; const v = fadd(F(1, a ** m), F(-1, b ** n));
        return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{-${m}}-${b}^{-${n}}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort, tipp: T`\(a^{-n}=\frac{1}{a^n}\), majd hozd közös nevezőre a törteket!`,
          megoldas: [T`\[\frac{1}{${a ** m}}-\frac{1}{${b ** n}}=${ft(v)}\]`] }; }
      const a = R(2, 5), b = R(2, 4), c = R(1, 3); const v = fadd(fadd(F(1, a), F(b * b)), F(-c));
      return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{-1}+\left(\frac{1}{${b}}\right)^{-2}-${c}\cdot ${R(2, 9)}^{0}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: T`\(a^{-1}=\frac1a\), \(\left(\frac1b\right)^{-2}=b^2\), és bármely 0-tól különböző szám nulladik hatványa 1.`,
        megoldas: [T`\[\frac{1}{${a}}+${b * b}-${c}\cdot 1=${ft(v)}\]`] };
    }
    for (let g = 0; g < 3000; g++) {
      const tagok = n => Array.from({ length: n }, () => [P(ALAP), R0(-4, 4)]);
      const fent = tagok(2), lent = tagok(R(1, 2));
      if (![...fent, ...lent].some(([, k]) => k < 0)) continue;
      const e = [0, 0, 0];
      fent.forEach(([b, k]) => vek(b).forEach((x, i) => { e[i] += x * k; }));
      lent.forEach(([b, k]) => vek(b).forEach((x, i) => { e[i] -= x * k; }));
      const szam = 2 ** Math.max(e[0], 0) * 3 ** Math.max(e[1], 0) * 5 ** Math.max(e[2], 0), nev = 2 ** Math.max(-e[0], 0) * 3 ** Math.max(-e[1], 0) * 5 ** Math.max(-e[2], 0);
      if (szam > 200 || nev > 50 || (szam === 1 && nev === 1)) continue;
      const tx = l => l.map(([b, k]) => T`${b}^{${k}}`).join(T`\cdot `);
      const kit = i => e[i] === 0 ? null : T`${[2, 3, 5][i]}^{${e[i]}}`;
      const v = F(szam, nev);
      return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\frac{${tx(fent)}}{${tx(lent)}}\]`, valasz: { ertekek: [fv(v)] }, formatum: FMT9.tort,
        tipp: 'Írd fel minden alapot prímtényezők szorzataként, és vond össze a kitevőket! A negatív kitevőjű tényező a tört másik szintjére vihető át pozitív kitevővel.',
        megoldas: [T`Prímhatványokra bontva és a kitevőket összevonva: \[${[0, 1, 2].map(kit).filter(Boolean).join(T`\cdot `)}=${ft(v)}\]`] };
    }
  } };

  /* ---------- melyik a nagyobb? ---------- */
  const big = (b, e) => { const f = M9.toF(b); const n = BigInt(f.n), d = BigInt(f.d); return e >= 0 ? [n ** BigInt(e), d ** BigInt(e)] : [d ** BigInt(-e), n ** BigInt(-e)]; };
  feladatok.hasonlit = { nev: 'Melyik a nagyobb?', general() {
    let A, m, B, n; const t = R(0, 3);
    if (t === 0) { [A, B] = P([[6, 3], [5, 4], [10, 20], [2, 3], [4, 8], [9, 27], [5, 25], [12, 3]]); m = -R(2, 8); n = -R(2, 8); if (R(0, 1)) [A, B, m, n] = [B, A, n, m]; }
    else if (t === 1) { const q = R(2, 5), p = R(1, q - 1); A = F(p, q); B = F(q, p); m = -R(2, 5); n = R(2, 5) * P([1, -1]); }
    else if (t === 2) { A = F(R(1, 3), R(4, 7)); m = -R(1, 4); B = R(2, 4); n = R(1, 3); }
    else { A = P([2, 4, 8]); B = P([2, 4, 8, 16]); m = -R(2, 9); n = -R(2, 9); }
    const [a1, b1] = big(A, m), [a2, b2] = big(B, n); const X = a1 * b2, Y = a2 * b1; const c = X < Y ? 0 : X === Y ? 1 : 2;
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére? (Számológép nélkül döntsd el!)</p>\[${hT(A, m)}\;\square\;${hT(B, n)}\]`,
      valasz: { valasztas: REL, helyes: c }, tipp: T`Írd át a negatív kitevős hatványokat törtté: \(a^{-n}=\frac1{a^n}\). Pozitív számok közül annak a reciproka nagyobb, amelyik kisebb.`,
      megoldas: [T`\(${hT(A, m)}=${ft(F(Number(a1), Number(b1)))}\) és \(${hT(B, n)}=${ft(F(Number(a2), Number(b2)))}\)`.replace(/NaN|Infinity/g, '?'), T`Ezért \(${hT(A, m)}${REL[c]}${hT(B, n)}\).`] };
  } };

  /* ---------- exponenciális egyenlet (egész megoldás) ---------- */
  feladatok.egyenlet = { nev: 'Melyik kitevőre?', general() {
    const p = P([2, 3, 5, 10]); const max = { 2: 7, 3: 5, 5: 3, 10: 5 }[p];
    for (let g = 0; g < 100; g++) {
      const ka = P([1, 1, 2, -1, -2]), x = R(-max, max); const e = ka * x;   // (p^ka)^x = p^e
      if (Math.abs(p ** Math.abs(ka)) > 100) continue;
      const alap = ka > 0 ? String(p ** ka) : T`\frac{1}{${p ** -ka}}`;
      let jobb = e >= 0 ? String(p ** e) : T`\frac{1}{${p ** -e}}`;
      if (p === 10 && e < 0 && R(0, 1)) jobb = nt(10 ** e);
      if (Math.abs(e) > max + 2) continue;
      const kx = ka === 1 ? 'x' : ka === -1 ? '-x' : `${ka}x`;
      return { kerdes: T`<p>Melyik egész számra igaz az egyenlőség?</p>\[${ka > 0 ? alap : T`\left(${alap}\right)`}^{x}=${jobb}\]`, valasz: { ertekek: [x] }, formatum: FMT9.egesz,
        tipp: `Írd fel mindkét oldalt ${p} hatványaként, és hasonlítsd össze a kitevőket!`,
        megoldas: [ka === 1 ? T`\(${jobb}=${p}^{${e}}\), tehát \(x=${x}\).` : T`\(${ka > 0 ? alap : T`\left(${alap}\right)`}^{x}=${p}^{${kx}}\) és \(${jobb}=${p}^{${e}}\).`, ka === 1 ? T`Ellenőrzés: \(${p}^{${x}}=${jobb}\).` : T`\(${kx}=${e}\implies x=${x}\)`] };
    }
  } };

  /* ---------- betűs kifejezés ---------- */
  feladatok.betus = { nev: 'Betűs kifejezések negatív kitevővel', general() {
    const [u, w] = P([['a', 'b'], ['x', 'y']]);
    for (let g = 0; g < 200; g++) {
      const c = P([1, 2, 3, -2]), m = R0(-4, 4), n = R0(-3, 3), e = P([-1, -2, -3, 2]), r = R0(-5, 5), s = R(-3, 3);
      const k = fhatv(c, e); const p = m * e + r, q = n * e + s;
      if (Math.abs(k.n) > 50 || k.d > 30 || p === 0 || Math.abs(p) > 15 || Math.abs(q) > 15) continue;
      const vars = q ? { [u]: p, [w]: q } : { [u]: p };
      const mit = q ? P(['k', 'p', 'q', 'p']) : P(['k', 'p']);
      const nev = { k: 'az együttható', p: T`az \(${u}\) kitevője`, q: T`az \(${w}\) kitevője` }[mit];
      const tex = T`\left(${tagT(c, { [u]: m, [w]: n })}\right)^{${e}}\cdot ${tagT(1, s ? { [u]: r, [w]: s } : { [u]: r })}`;
      const ered = T`${k.n === 1 && k.d === 1 ? '' : k.n === -1 && k.d === 1 ? '-' : ft(k)}${M9.valtozoT(vars)}`;
      return { kerdes: T`<p>Hozd \(k\cdot ${u}^{p}${q ? T`${w}^{q}` : ''}\) alakra a kifejezést! Mennyi ${nev}? (A betűk nem nullák.)</p>\[${tex}\]`,
        valasz: { ertekek: [mit === 'k' ? fv(k) : { p, q }[mit]] }, formatum: mit === 'k' ? FMT9.tort : FMT9.egesz,
        tipp: T`\((ab)^n=a^nb^n\), \(\left(a^m\right)^n=a^{mn}\), \(a^m\cdot a^n=a^{m+n}\) – negatív kitevőkre is. Az együtthatót is hatványozni kell: \(2^{-2}=\frac14\).`,
        megoldas: [T`\[${tex}=${ered}\]`] };
    }
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg3',
    cim: 'Hatványozás egész kitevőre',
    rovid: '0 és negatív kitevő',
    bevezeto: 'A hatvány fogalmát kiterjesztjük 0 és negatív egész kitevőre úgy, hogy az azonosságok továbbra is érvényesek maradjanak (permanenciaelv).',
    elmelet: T`<div class="prose"><p>Ha \(a\neq0\) és \(n\) pozitív egész, akkor</p></div>
<div class="mathbox">\[a^0=1,\qquad a^{-n}=\frac{1}{a^n},\qquad \left(\frac ab\right)^{-n}=\left(\frac ba\right)^{n}\]</div>
<div class="prose"><ul><li>Példák: \(5^0=1\), \(2^{-3}=\frac18\), \(\left(\frac23\right)^{-2}=\frac94\), \(0{,}1^{-2}=100\).</li>
<li>A \(0^0\) és a \(0\) negatív kitevős hatványa <b>nincs értelmezve</b>.</li>
<li>A negatív kitevő <b>nem</b> teszi negatívvá a számot: \(2^{-3}=\frac18>0\). Viszont \(-2^{-2}=-\frac14\), mert az előjel a hatványon kívül van.</li>
<li>A hatványozás minden azonossága érvényes egész kitevőkre is (ez a <b>permanenciaelv</b>): \(a^{-3}\cdot a^{5}=a^{2}\), \(a^{2}:a^{6}=a^{-4}\), \(\left(a^{-2}\right)^{3}=a^{-6}\).</li>
<li>Törtben a negatív kitevőjű tényező átvihető a tört másik szintjére pozitív kitevővel: \(\frac{2^{-3}}{5^{-2}}=\frac{5^2}{2^3}\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(2^{-3}=-8\)`, igaz: false, miert: T`\(2^{-3}=\frac1{2^3}=\frac18\).` },
      { allitas: T`\(7^0=0\)`, igaz: false, miert: T`Minden 0-tól különböző szám nulladik hatványa 1.` },
      { allitas: T`\((-5)^0=1\)`, igaz: true, miert: T`A \(-5\neq0\), így a nulladik hatványa 1.` },
      { allitas: T`\(\left(\frac23\right)^{-2}=\frac94\)`, igaz: true, miert: T`\(\left(\frac32\right)^2=\frac94\).` },
      { allitas: T`\(0{,}5^{-1}=2\)`, igaz: true, miert: T`\(0{,}5=\frac12\), a reciproka 2.` },
      { allitas: T`A pozitív számok minden egész kitevőjű hatványa pozitív.`, igaz: true, miert: 'Pozitív számok szorzata és reciproka is pozitív.' },
      { allitas: T`Az egész számok negatív egész kitevőjű hatványai nem egész számok.`, igaz: false, miert: T`Pl. \(1^{-2}=1\) és \((-1)^{-3}=-1\) egészek.` },
      { allitas: T`Van olyan negatív szám, amelynek negatív kitevőjű hatványa pozitív.`, igaz: true, miert: T`Pl. \((-2)^{-2}=\frac14\).` },
      { allitas: T`\(10^{-3}=0{,}001\)`, igaz: true, miert: T`\(\frac{1}{1000}=0{,}001\).` },
      { allitas: T`\(a^{-2}\cdot a^{5}=a^{-10}\) (\(a\neq0\))`, igaz: false, miert: T`Szorzásnál összeadjuk a kitevőket: \(a^3\).` },
      { allitas: T`\(\left(a^{-2}\right)^{-3}=a^{6}\) (\(a\neq0\))`, igaz: true, miert: T`\((-2)\cdot(-3)=6\).` },
      { allitas: T`\(0^{-1}=0\)`, igaz: false, miert: 'A 0 negatív kitevős hatványa nincs értelmezve (0-val nem lehet osztani).' },
      { allitas: T`\(6^{-3}<3^{-6}\)`, igaz: false, miert: T`\(6^{-3}=\frac1{216}\), \(3^{-6}=\frac1{729}\), és \(\frac1{216}>\frac1{729}\).` },
      { allitas: T`\(2^{-1}+2^{-1}=1\)`, igaz: true, miert: T`\(\frac12+\frac12=1\).` },
      { allitas: T`\(2^{-1}+3^{-1}=5^{-1}\)`, igaz: false, miert: T`\(\frac12+\frac13=\frac56\neq\frac15\).` },
      { general() { const a = R(2, 5), n = R(1, 3); const jo = F(1, a ** n); const mut = R(0, 1) ? jo : F(-1, a ** n);
        return { allitas: T`\(${a}^{-${n}}=${ft(mut)}\)`, igaz: mut.n === jo.n, miert: T`\(${a}^{-${n}}=\frac{1}{${a ** n}}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki: \(\dfrac{4^{-2}\cdot 8^{3}}{2^{-5}}\)`,
      lepesek: [T`Írjunk fel mindent 2 hatványaként: \(4^{-2}=2^{-4}\), \(8^3=2^9\).`, T`A számláló: \(2^{-4}\cdot2^{9}=2^{5}\).`, T`Osztunk: \(2^{5}:2^{-5}=2^{5-(-5)}=2^{10}\).`, T`\[2^{10}=1024\]`]
    },
    feladatok
  }));
})();
