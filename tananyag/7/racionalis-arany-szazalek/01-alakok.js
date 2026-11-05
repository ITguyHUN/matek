/*
 * 1. fejezet – A racionális számok alakjai
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK 1. lecke)
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

  /* ---- Bővítés (2026. november): további feladattípusok ---- */

  G.bovit = { ch: 'alak', name: 'Bővítés, egyszerűsítés', make() {
    let n, d; do { d = R(2, 12); n = R(1, 2 * d); } while (gcd(n, d) !== 1 || n === d);
    const k = R(2, 9); const t = R(0, 3);
    if (t === 0) return { q: T`<p>Mit írjunk a kérdőjel helyére?</p>\[\frac{${n}}{${d}}=\frac{?}{${d * k}}\]`, ans: { vals: [n * k] }, ansText: String(n * k), fmt: 'egész szám',
      hint: 'Hányszorosára nőtt a nevező? Ugyanannyiszorosára kell nőnie a számlálónak is.',
      sol: [T`A nevező \(${d}\to${d * k}\), tehát \(${k}\)-szorosára nőtt.`, T`A számlálót is \(${k}\)-szorosára bővítjük: \(${n}\cdot ${k}=${n * k}\).`, T`\[\frac{${n}}{${d}}=\frac{${n * k}}{${d * k}}\]`] };
    if (t === 1) return { q: T`<p>Mit írjunk a kérdőjel helyére?</p>\[\frac{${n}}{${d}}=\frac{${n * k}}{?}\]`, ans: { vals: [d * k] }, ansText: String(d * k), fmt: 'egész szám',
      hint: 'Hányszorosára nőtt a számláló? Ugyanannyiszorosára kell nőnie a nevezőnek is.',
      sol: [T`A számláló \(${n}\to${n * k}\), tehát \(${k}\)-szorosára nőtt.`, T`A nevező: \(${d}\cdot ${k}=${d * k}\).`, T`\[\frac{${n}}{${d}}=\frac{${n * k}}{${d * k}}\]`] };
    const g = gcd(n * k, d * k);
    return { q: T`<p>Egyszerűsítsd a törtet a lehető legjobban!</p>\[\frac{${n * k}}{${d * k}}\]`, ans: { vals: [n / d], form: 'frac' }, ansText: `${n}/${d}`, fmt: FMT.fs,
      hint: 'Keresd meg a számláló és a nevező legnagyobb közös osztóját, és azzal oszd el mindkettőt!',
      sol: [T`A számláló és a nevező legnagyobb közös osztója: \((${n * k};\,${d * k})=${g}\).`, T`\[\frac{${n * k}}{${d * k}}=\frac{${n * k}:${g}}{${d * k}:${g}}=\frac{${n}}{${d}}\]`] };
  } };

  G.vegyes = { ch: 'alak', name: 'Vegyes szám és áltört', make() {
    const d = R(2, 12); let r; do { r = R(1, d - 1); } while (gcd(r, d) !== 1); const w = R(1, 9); const neg = R(0, 3) === 0;
    const n = w * d + r; const s = neg ? '-' : '';
    if (R(0, 1) === 0) return { q: T`<p>Írd fel áltört alakban (egy törtként)!</p>\[${s}${w}\frac{${r}}{${d}}\]`, ans: { vals: [(neg ? -1 : 1) * n / d], form: 'frac' }, ansText: `${neg ? '−' : ''}${n}/${d}`, fmt: 'tört, pl. 17/5',
      hint: 'Az egészeket is írd át ugyanilyen nevezőjű törtté, és add hozzá a törtrészt!',
      sol: [T`\(${w}\) egész \(=\frac{${w * d}}{${d}}\).`, T`\[${s}${w}\frac{${r}}{${d}}=${s}\left(\frac{${w * d}}{${d}}+\frac{${r}}{${d}}\right)=${s}\frac{${n}}{${d}}\]`] };
    return { q: T`<p>Írd fel vegyes szám alakban! (Pl. <code>2 1/4</code>)</p>\[${s}\frac{${n}}{${d}}\]`, ans: { vals: [(neg ? -1 : 1) * n / d] }, ansText: `${neg ? '−' : ''}${w} ${r}/${d}`, fmt: 'vegyes szám, pl. 2 1/4',
      hint: 'Végezd el a maradékos osztást: a hányados az egészrész, a maradék a számláló.',
      sol: [T`\(${n}:${d}=${w}\), maradék \(${r}\) (mert \(${w}\cdot ${d}=${w * d}\)).`, T`\[${s}\frac{${n}}{${d}}=${s}${w}\frac{${r}}{${d}}\]`] };
  } };

  G.szakaszosIr = { ch: 'alak', name: 'Törtből szakaszos tizedes tört', make() {
    const d = P([3, 6, 9, 11, 12, 15, 18, 22, 30, 33, 7]); let n; do { n = R(1, 2 * d); } while (gcd(n, d) !== 1 || finDen(d));
    const f = F(R(0, 4) === 0 ? -n : n, d); const p = decParts(f);
    const txt = (p.neg ? '−' : '') + p.ip + ',' + p.pre + '(' + p.rep + ')';
    return { q: T`<p>Írd fel tizedes tört alakban, az ismétlődő szakaszt zárójelbe téve! (Pl. <code>0,(3)</code> vagy <code>1,2(36)</code>)</p>\[${ft(f)}\]`,
      ans: { vals: [fv(f)], form: 'dec' }, ansText: txt, fmt: 'szakaszos tizedes tört, pl. 0,(3)',
      hint: 'Végezd el az osztást (számláló : nevező)! Ha egy maradék ismét előjön, onnantól ismétlődnek a jegyek.',
      sol: [T`\(${Math.abs(f.n)}:${f.d}=${decLong(F(Math.abs(f.n), f.d)).replace(/,/g, '{,}')}\)`, T`Az ismétlődő szakasz: <b>${p.rep}</b>${p.pre ? `, előtte nem ismétlődő rész: <b>${p.pre}</b>` : ''}.`, T`\[${ft(f)}=${decTex(f)}\]`, `Beírva: <code>${txt}</code>`] };
  } };

  G.ellentett = { ch: 'alak', name: 'Ellentett, reciprok, abszolút érték', make() {
    const f = smallFrac(9); const t = R(0, 3); const dec = R(0, 1) === 1 && finDen(f.d);
    const shown = dec ? nt(fv(f)) : ft(f); const shownP = f.n < 0 ? T`\left(${shown}\right)` : shown;
    if (t === 0) { const r = F(-f.n, f.d); return { q: T`<p>Mi az ellentettje?</p>\[${shown}\]`, ans: { vals: [fv(r)] }, ansText: fplain(r), fmt: FMT.frac,
      hint: 'Az ellentett a 0-ra tükrözött szám: ugyanakkora, de ellenkező előjelű.', sol: [T`\(${shown}\) ellentettje \(${dec ? nt(fv(r)) : ft(r)}\), mert összegük \(0\).`] }; }
    if (t === 1) { const r = F(f.d, f.n); return { q: T`<p>Mi a reciproka?</p>\[${shown}\]`, ans: { vals: [fv(r)] }, ansText: fplain(r), fmt: FMT.frac,
      hint: 'A reciprok: a számláló és a nevező helyet cserél. Az előjel marad! (A szám és reciproka szorzata 1.)',
      sol: dec ? [T`Előbb törtté alakítunk: \(${shown}=${ft(f)}\).`, T`A reciproka \(${ft(r)}\), mert \(${fp(f)}\cdot ${fp(r)}=1\).`] : [T`\(${ft(f)}\) reciproka \(${ft(r)}\), mert \(${fp(f)}\cdot ${fp(r)}=1\).`] }; }
    if (t === 2) { const r = F(Math.abs(f.n), f.d); return { q: T`<p>Számítsd ki!</p>\[\left|${shown}\right|\]`, ans: { vals: [fv(r)] }, ansText: fplain(r), fmt: FMT.frac,
      hint: 'Az abszolút érték a szám távolsága a 0-tól, ezért sosem negatív.', sol: [T`\(\left|${shown}\right|=${dec ? nt(fv(r)) : ft(r)}\), mert ennyire van a 0-tól.`] }; }
    const r = F(-f.d, f.n); return { q: T`<p>Mi a reciprokának az ellentettje?</p>\[${shown}\]`, ans: { vals: [fv(r)] }, ansText: fplain(r), fmt: FMT.frac,
      hint: 'Két lépésben: előbb a reciprok (számláló–nevező csere), utána az ellentett (előjelváltás).',
      sol: [T`Reciproka: \(${ft(F(f.d, f.n))}\).`, T`Ennek ellentettje: \(${ft(r)}\).`] };
  } };

  G.egyenlo = { ch: 'alak', name: 'Melyik ugyanaz a szám?', make() {
    const pool = [[1, 4], [3, 4], [2, 5], [3, 8], [5, 8], [1, 20], [7, 20], [3, 25], [9, 40], [5, 4], [7, 5], [11, 8], [13, 20], [1, 3], [2, 3], [5, 6], [1, 6], [7, 9], [4, 11], [7, 8], [4, 5], [9, 20], [1, 8]];
    const [n, d] = P(pool); const f = F(n, d); const k = R(2, 6);
    const dec = finDen(d) ? nt(n / d) : decTex(f);
    const showFrac = R(0, 1) === 0; const show = showFrac ? ft(f) : dec;
    const correct = showFrac ? (R(0, 1) ? dec : T`\frac{${n * k}}{${d * k}}`) : (R(0, 1) ? ft(f) : T`\frac{${n * k}}{${d * k}}`);
    // tipikus tévesztések
    const mis = n < d ? T`0{,}${n}${d}` : T`${n}{,}${d}`; const misV = n < d ? +('0.' + n + d) : +(n + '.' + d);
    const wr = [[T`\frac{${d}}{${n}}`, d / n], [mis, misV], [T`\frac{${n + 1}}{${d + 1}}`, (n + 1) / (d + 1)], [T`\frac{${n * k}}{${d * k + k}}`, n / (d + 1)]];
    const opts = [[correct, n / d]]; for (const w of wr.sort(() => Math.random() - 0.5)) if (opts.length < 4 && opts.every(o => Math.abs(o[1] - w[1]) > 1e-9)) opts.push(w);
    const ord = opts.map((_, i) => i).sort(() => Math.random() - 0.5); const labels = ['A', 'B', 'C', 'D'].slice(0, opts.length);
    const helyes = ord.indexOf(0);
    return { q: T`<p>Melyik egyenlő ezzel a számmal?</p>\[${show}\]<p>${ord.map((j, i) => T`<b>${labels[i]})</b> \(${opts[j][0]}\)`).join(' &nbsp; ')}</p>`,
      ans: { choice: labels, correct: helyes }, ansText: labels[helyes], fmt: '',
      hint: 'Írd át mindegyiket ugyanarra az alakra (pl. tizedes törtre), vagy egyszerűsíts!',
      sol: [T`\(${show}=${correct}\), tehát a helyes válasz: <b>${labels[helyes]})</b>.`, T`Gyakori hiba: \(${mis}\) – a számláló és a nevező számjegyei egymás mellé írva nem adják a tört értékét.`] };
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
<div class="prose"><p>Ugyanaz a racionális szám többféle alakban is felírható: \(1=\frac33=0{,}\dot{9}\).</p></div>
<div class="prose"><p><b>Bővítés, egyszerűsítés:</b> a tört értéke nem változik, ha a számlálót és a nevezőt ugyanazzal a (0-tól különböző) számmal szorozzuk vagy osztjuk: \(\frac34=\frac{15}{20}\), \(\frac{42}{56}=\frac{3}{4}\) (osztva 14-gyel, a legnagyobb közös osztóval).</p>
<p><b>Vegyes szám ↔ áltört:</b> \(2\frac35=\frac{2\cdot5+3}{5}=\frac{13}{5}\), és fordítva: \(\frac{17}{4}\): \(17:4=4\), maradék 1, tehát \(4\frac14\).</p>
<p><b>Reciprok:</b> a számláló és a nevező helyet cserél (\(-\frac25\to-\frac52\)); a szám és a reciproka szorzata 1. A 0-nak nincs reciproka.</p></div>`,
    igazHamis: [
      { allitas: T`Minden egész szám racionális szám.`, igaz: true, miert: T`Minden egész szám felírható törtként: \(5=\frac51\), \(-3=\frac{-6}{2}\).` },
      { allitas: T`\(\frac{7}{20}\) végtelen szakaszos tizedes tört.`, igaz: false, miert: T`\(20=2\cdot2\cdot5\), csak 2-es és 5-ös prímtényező van benne, ezért véges: \(\frac{7}{20}=\frac{35}{100}=0{,}35\).` },
      { allitas: T`\(0{,}\dot{3}=\frac{3}{10}\)`, igaz: false, miert: T`\(\frac{3}{10}=0{,}3\) (véges). A \(0{,}\dot{3}=0{,}333\ldots=\frac13\).` },
      { allitas: T`A \(\frac{3}{12}\) véges tizedes tört, pedig a 12-ben van 3-as prímtényező.`, igaz: true, miert: T`Előbb egyszerűsíteni kell: \(\frac{3}{12}=\frac14=0{,}25\). A szabály az egyszerűsített tört nevezőjére vonatkozik.` },
      { allitas: T`\(0{,}\dot{9}=1\)`, igaz: true, miert: T`\(0{,}\dot{9}=9\cdot 0{,}\dot{1}=9\cdot\frac19=1\). Ugyanannak a számnak két alakja.` },
      { allitas: T`\(\frac{18}{24}=\frac34\)`, igaz: true, miert: T`Mindkettőt 6-tal osztva: \(\frac{18:6}{24:6}=\frac34\).` },
      { allitas: T`\(2\frac13=\frac{6}{3}\)`, igaz: false, miert: T`\(2\frac13=\frac{2\cdot3+1}{3}=\frac73\). A \(\frac63\) csak 2.` },
      { allitas: T`A \(-\frac35\) reciproka \(\frac53\).`, igaz: false, miert: T`A reciprok előjele ugyanaz: \(-\frac53\), mert \(\left(-\frac35\right)\cdot\left(-\frac53\right)=1\).` },
      { allitas: T`Van olyan racionális szám, amely egyenlő a saját ellentettjével.`, igaz: true, miert: T`A 0: ellentettje önmaga, \(-0=0\).` },
      { allitas: T`\(\frac{3}{8}=0{,}38\)`, igaz: false, miert: T`\(3:8=0{,}375\). A számjegyeket nem írhatjuk egymás mellé!` },
      { allitas: T`\(\frac{1}{7}\) tizedes tört alakjában a szakasz 6 jegyű.`, igaz: true, miert: T`\(\frac17=0{,}\dot{1}4285\dot{7}\): a 142857 ismétlődik.`, szint: 'emelt' },
      { general() { const d = P([3, 6, 7, 9, 11, 12, 13]); const n = R(1, d - 1); const g = gcd(n, d); const nn = n / g, dd = d / g; const fin = finDen(dd);
        return { allitas: T`\(\frac{${n}}{${d}}\) véges tizedes tört.`, igaz: fin, miert: fin ? T`Egyszerűsítve \(\frac{${nn}}{${dd}}\), a nevezőben csak 2-es és 5-ös prímtényező van: \(${nt(nn / dd)}\).` : T`Egyszerűsítve \(${ft(F(nn, dd))}\), a nevezőben van 2-től és 5-től különböző prímtényező, ezért végtelen szakaszos.` }; } }
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
