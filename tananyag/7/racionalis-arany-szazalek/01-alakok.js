/*
 * 1. fejezet – A racionális számok alakjai
 * Témakör: Racionális számok, arányosság, százalék (7. évfolyam, TK 1. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, sf, tbl, randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, $, esc } = M7;
  const FMT = M7.FMT7;
  const G = {};

  G.tort2tized = { ch: 'alak', name: 'Törtből tizedes tört', make() {
    const d = P([2, 4, 5, 8, 20, 25, 40, 50, 16, 125]);
    let n; do { n = R(1, 3 * d); } while (gcd(n, d) !== 1);
    const neg = R(0, 2) === 0; const f = F(neg ? -n : n, d); const v = fv(f);
    const w = Math.floor(n / d), r = n % d; let k = 0, p = 1; while (p % d !== 0) { p *= 10; k++; } const m = p / d;
    const sol = [T`\[\frac{${r}}{${d}}=\frac{${r}\cdot ${m}}{${d}\cdot ${m}}=\frac{${r * m}}{${bigT(p)}}=${nt(r / d)}\]`];
    if (w > 0) sol.push(T`Az egészrészt hozzáadjuk: \(${w}+${nt(r / d)}=${nt(w + r / d)}\).`);
    sol.push(T`Tehát \(${fmix(f)}=${nt(v)}\).`);
    return { q: T`<p>Írd fel tizedes tört alakban!</p>\[${R(0, 1) ? fmix(f) : ft(f)}\]`, ans: { vals: [v], form: 'dec' }, ansText: hu(v), fmt: FMT.dec,
      hint: T`A törtvonal osztást jelent (számláló : nevező). Gyorsabb, ha bővíted a törtet, hogy a nevező 10, 100 vagy 1000 legyen.`, sol };
  } };

  G.tipus = { ch: 'alak', name: 'Milyen tizedes tört?', make() {
    const t = R(0, 2); let n, d;
    if (t === 0) { d = P([3, 4, 5, 6, 7, 8]); n = d * R(-6, 6) || d * 2; }
    else if (t === 1) { const hid = { 12: 3, 15: 3, 30: 3, 35: 7 }; d = P([4, 8, 20, 25, 40, 12, 15, 30, 35]); if (hid[d]) { do { n = hid[d] * R(1, 9); } while (n % d === 0); } else { do { n = R(1, 40); } while (gcd(n, d) !== 1); } }
    else { d = P([3, 6, 7, 9, 11, 12, 13, 15, 18, 22]); do { n = R(1, 3 * d); } while (n % d === 0); }
    if (R(0, 3) === 0) n = -n;
    const f = F(n, d); const cls = f.d === 1 ? 0 : finDen(f.d) ? 1 : 2;
    const opts = ['egész szám', 'véges tizedes tört', 'végtelen szakaszos tizedes tört'];
    const sol = [];
    if (f.n !== n || f.d !== d) sol.push(T`Először egyszerűsítünk: \(\frac{${n}}{${d}}=${ft(f)}\).`);
    if (cls === 0) sol.push(T`A nevező 1 lett, tehát \(${ft(f)}\) <b>egész szám</b>.`);
    else { const pf = primeF(f.d).join(T`\cdot `);
      sol.push(primeF(f.d).length === 1 ? T`A nevező, \(${f.d}\), prímszám.` : T`A nevező prímtényezős alakja: \(${f.d}=${pf}\).`);
      sol.push(cls === 1 ? T`Csak 2-es és 5-ös prímtényező van benne, ezért <b>véges</b> tizedes tört: \(${ft(f)}=${nt(fv(f))}\).`
        : T`Van benne 2-től és 5-től különböző prímtényező, ezért <b>végtelen szakaszos</b>: \(${ft(f)}=${decTex(f)}=${decLong(f).replace('−', '-').replace(/,/g, '{,}')}\).`); }
    return { q: T`<p>Milyen számot kapunk, ha tizedes tört alakba írjuk?</p>\[\frac{${n}}{${d}}\]`, ans: { choice: opts, correct: cls, why: 'Nem jó. Előbb egyszerűsíts, majd vizsgáld meg a nevező prímtényezőit!' },
      ansText: opts[cls], fmt: '', hint: T`Egyszerűsíts! Ha a nevező 1, egész szám. Ha a nevező prímtényezői csak 2-esek és 5-ösek, véges; különben végtelen szakaszos.`, sol };
  } };

  G.tized2tort = { ch: 'alak', name: 'Tizedes törtből tört', make() {
    const k = R(1, 3); const p = 10 ** k; let N;
    do { N = R(1, p * 3); } while (N % 10 === 0 || gcd(N, p) === 1 && R(0, 2) > 0);
    const neg = R(0, 2) === 0; const f = F(neg ? -N : N, p); const g = gcd(N, p);
    const dec = (neg ? '-' : '') + nt(N / p);
    const sol = [T`\(${k}\) tizedesjegy van, ezért ${['', 'tizedekről', 'századokról', 'ezredekről'][k]} van szó: \[${dec}=${neg ? '-' : ''}\frac{${N}}{${bigT(p)}}\]`];
    sol.push(g > 1 ? T`Egyszerűsítünk (a számláló és a nevező legnagyobb közös osztója \(${g}\)): \[${neg ? '-' : ''}\frac{${N}}{${bigT(p)}}=${ft(f)}\]` : 'A tört már nem egyszerűsíthető.');
    return { q: T`<p>Írd fel tört alakban, a lehető legegyszerűbb formában!</p>\[${dec}\]`, ans: { vals: [fv(f)], form: 'frac' }, ansText: fplain(f), fmt: FMT.fs,
      hint: 'Hány tizedesjegy van? 1 → tized, 2 → század, 3 → ezred. Utána egyszerűsíts!', sol };
  } };

  G.szakaszos = { ch: 'alak', name: 'Szakaszos tizedes tört', make() {
    const t = R(0, 3); let f, tex, sol;
    if (t === 0) { const a = R(1, 8); f = F(a, 9); tex = T`0{,}\dot{${a}}`;
      sol = [T`Tudjuk: \(\frac19=1:9=0{,}111\ldots=0{,}\dot{1}\).`, T`\[0{,}\dot{${a}}=${a}\cdot 0{,}\dot{1}=\frac{${a}}{9}${f.d !== 9 ? '=' + ft(f) : ''}\]`]; }
    else if (t === 1) { let ab; do { ab = R(10, 98); } while (ab % 11 === 0); f = F(ab, 99); const s = String(ab);
      tex = T`0{,}\dot{${s[0]}}\dot{${s[1]}}`;
      sol = [T`Kétjegyű szakasz: \(\frac{1}{99}=0{,}010101\ldots=0{,}\dot{0}\dot{1}\).`, T`\[0{,}\dot{${s[0]}}\dot{${s[1]}}=${ab}\cdot\frac{1}{99}=\frac{${ab}}{99}${f.d !== 99 ? '=' + ft(f) : ''}\]`]; }
    else if (t === 2) { const c = R(1, 4), a = R(1, 8); f = F(9 * c + a, 9); tex = T`${c}{,}\dot{${a}}`;
      sol = [T`Bontsuk egészrészre és törtrészre: \(${c}{,}\dot{${a}}=${c}+0{,}\dot{${a}}\).`, T`\[${c}+\frac{${a}}{9}=\frac{${9 * c}}{9}+\frac{${a}}{9}=${ft(f)}\]`]; }
    else { const b = R(1, 9), a = R(1, 9); f = F(9 * b + a, 90); tex = T`0{,}${b}\dot{${a}}`;
      sol = [T`Csak a második jegy ismétlődik: \(0{,}${b}\dot{${a}}=0{,}${b}+0{,}0\dot{${a}}\).`, T`\(0{,}0\dot{${a}}\) a \(0{,}\dot{${a}}=\frac{${a}}{9}\) tizedrésze, azaz \(\frac{${a}}{90}\).`,
        T`\[\frac{${b}}{10}+\frac{${a}}{90}=\frac{${9 * b}}{90}+\frac{${a}}{90}=\frac{${9 * b + a}}{90}${f.d !== 90 ? '=' + ft(f) : ''}\]`]; }
    return { q: T`<p>Írd fel tört alakban, egyszerűsítve!</p>\[${tex}=${decLong(f).replace(/,/g, '{,}')}\]`, ans: { vals: [fv(f)], form: 'frac' }, ansText: fplain(f), fmt: FMT.fs,
      hint: T`Használd fel: \(0{,}\dot{1}=\frac19\) és \(0{,}\dot{0}\dot{1}=\frac{1}{99}\).`, sol };
  } };

  G.helyertek = { ch: 'alak', name: 'Hányadik jegy?', make() {
    const d = P([7, 7, 11, 13, 27, 37, 3]); let n; do { n = R(1, d - 1); } while (gcd(n, d) !== 1);
    const f = F(n, d); const rep = decParts(f).rep; const L = rep.length;
    const k = P([20, 30, 50, 100, 2026, 2027]); const m = k % L; const digit = +rep[(m === 0 ? L : m) - 1];
    const sol = [T`Végezzük el az osztást: \(\frac{${n}}{${d}}=${decTex(f)}=0{,}${rep.repeat(Math.max(2, Math.ceil(12 / L))).slice(0, Math.max(12, 2 * L))}\ldots\)`,
      T`Az ismétlődő szakasz: <b>${rep}</b>, ez ${L} jegyű.`,
      m === 0 ? T`\(${k}=${k / L}\cdot ${L}\), tehát a ${k}. jegy épp egy szakasz <b>utolsó</b> jegye: <b>${digit}</b>.`
        : T`\(${k}=${Math.floor(k / L)}\cdot ${L}+${m}\), tehát a ${k}. jegy a szakasz ${m}. jegye: <b>${digit}</b>.`];
    return { q: T`<p>Milyen számjegy áll a tizedesvessző után a <b>${k}.</b> helyen?</p>\[\frac{${n}}{${d}}\]`, ans: { vals: [digit], int: true }, ansText: String(digit), fmt: 'egy számjegy',
      hint: 'Végezd el az osztást, keresd meg az ismétlődő szakaszt, és nézd meg, mennyi maradékot ad a helyiérték sorszáma a szakasz hosszával osztva!', sol };
  } };

  Tananyag.fejezet({
    id: 'alak',
    cim: 'A racionális számok alakjai',
    rovid: 'Alakok',
    bevezeto: T`Ugyanaz a szám többféle „ruhában” is megjelenhet: törtként, tizedes törtként, vegyes számként. Ebben a fejezetben az átöltöztetést gyakoroljuk.`,
    elmelet: T`<div class="prose"><p><b>Racionális szám</b> az, ami felírható két egész szám hányadosaként: \(\dfrac{a}{b}\), ahol \(b\ne 0\). Minden egész szám racionális, pl. \(-4=\dfrac{-12}{3}\).</p>
<p><b>Tört → tizedes tört:</b> a törtvonal osztást jelent, tehát számlálót osztunk a nevezővel. Háromféle eredményt kaphatunk:</p></div>
<div class="tbl"><table><tr><th>Eredmény</th><th>Példa</th><th>Mikor?</th></tr>
<tr><td>egész szám</td><td>\(-\frac{12}{3}=-4\)</td><td>a nevező osztója a számlálónak</td></tr>
<tr><td>véges tizedes tört</td><td>\(\frac{15}{4}=3{,}75\)</td><td>az egyszerűsített tört nevezőjében csak 2-es és 5-ös prímtényező van</td></tr>
<tr><td>végtelen szakaszos tizedes tört</td><td>\(\frac{1}{9}=0{,}111\ldots=0{,}\dot{1}\)</td><td>a nevezőben más prímtényező is van</td></tr></table></div>
<div class="prose"><p><b>Tizedes tört → tört:</b> annyi tizedesjegy, ahány 0 a nevezőben, utána egyszerűsítünk:</p></div>
<div class="mathbox">\[0{,}2=\frac{2}{10}=\frac15\qquad -3{,}25=-\frac{325}{100}=-\frac{13}{4}\]</div>
<div class="prose"><p><b>Szakaszos tizedes tört → tört:</b> a pont a számjegy fölött az ismétlődő szakaszt jelöli. Érdemes megjegyezni:</p></div>
<div class="mathbox">\[0{,}\dot{1}=\frac19,\qquad 0{,}\dot{6}=6\cdot\frac19=\frac23,\qquad 0{,}\dot{0}\dot{1}=\frac{1}{99},\qquad 0{,}\dot{9}=9\cdot\frac19=1\]</div>
<div class="prose"><p>Ugyanaz a racionális szám többféle alakban is felírható: \(1=\frac33=0{,}\dot{9}\).</p></div>`,
    igazHamis: [
      { allitas: T`Minden egész szám racionális szám.`, igaz: true, miert: T`Minden egész szám felírható törtként: \(5=\frac51\), \(-3=\frac{-6}{2}\).` },
      { allitas: T`\(\frac{7}{20}\) végtelen szakaszos tizedes tört.`, igaz: false, miert: T`\(20=2\cdot2\cdot5\), csak 2-es és 5-ös prímtényező van benne, ezért véges: \(\frac{7}{20}=\frac{35}{100}=0{,}35\).` },
      { allitas: T`\(0{,}\dot{3}=\frac{3}{10}\)`, igaz: false, miert: T`\(\frac{3}{10}=0{,}3\) (véges). A \(0{,}\dot{3}=0{,}333\ldots=\frac13\).` },
      { allitas: T`A \(\frac{3}{12}\) véges tizedes tört, pedig a 12-ben van 3-as prímtényező.`, igaz: true, miert: T`Előbb egyszerűsíteni kell: \(\frac{3}{12}=\frac14=0{,}25\). A szabály az egyszerűsített tört nevezőjére vonatkozik.` },
      { allitas: T`\(0{,}\dot{9}=1\)`, igaz: true, miert: T`\(0{,}\dot{9}=9\cdot 0{,}\dot{1}=9\cdot\frac19=1\). Ugyanannak a számnak két alakja.` }
    ],
    mintapelda: {
      feladat: T`Írjuk fel tört alakban: \(1{,}2\dot{3}\) (azaz \(1{,}2333\ldots\))`,
      lepesek: [
        T`Bontsuk részekre: \(1{,}2\dot{3}=1+0{,}2+0{,}0\dot{3}\).`,
        T`A \(0{,}0\dot{3}\) a \(0{,}\dot{3}=\frac13\) tizedrésze: \(0{,}0\dot{3}=\frac{1}{30}\).`,
        T`\[1+\frac{2}{10}+\frac{1}{30}=\frac{30}{30}+\frac{6}{30}+\frac{1}{30}=\frac{37}{30}\]`,
        T`Ellenőrzés: \(37:30=1{,}2333\ldots\) ✔`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
