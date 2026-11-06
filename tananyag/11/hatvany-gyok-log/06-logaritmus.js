/*
 * 6. fejezet – A logaritmus fogalma
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.logertek = { nev: 'Logaritmus kiszámítása', general() {
    const c = P([2, 3, 5, 10]); const i = P(c === 10 ? [1, 1, -1] : [1, 1, 2, -1]);
    const baseTex = i === 1 ? String(c) : i === 2 ? String(c * c) : T`\frac{1}{${c}}`;
    const L = (i === 1 && c === 10) ? T`\lg` : T`\log_{${baseTex}}`;
    let jn, jd = 1, argTex;
    if (R(0, 3) === 0) { jn = P([1, 3, -1]); jd = 2; argTex = jn === 1 ? T`\sqrt{${c}}` : jn === 3 ? T`${c}\sqrt{${c}}` : T`\frac{1}{\sqrt{${c}}}`; }
    else { do { jn = R(-3, 4); } while (c ** Math.abs(jn) > 10000); argTex = jn >= 0 ? String(c ** jn) : T`\frac{1}{${c ** (-jn)}}`; }
    const ans = F(jn, jd * i); const bpow = i === 1 ? String(c) : i === 2 ? T`${c}^{2}` : T`${c}^{-1}`;
    return { kerdes: T`<p>Számítsd ki!</p>\[${L}\,${argTex}\]`, valasz: { ertekek: [fv(ans)] }, formatum: FMT.frac,
      tipp: T`\(\log_a b\) az a kitevő, amelyre \(a\)-t emelve \(b\)-t kapunk. Írd fel az alapot és a számot is \(${c}\) hatványaként!`,
      megoldas: [T`\[${L}\,${argTex}=y\iff \left(${bpow}\right)^{y}=${argTex}\]`, (i === 1 ? T`\[${c}^{y}=${c}^{${ft(F(jn, jd))}}\quad\Rightarrow\quad y=${ft(ans)}\]` : T`\[${c}^{${yk(i)}}=${c}^{${ft(F(jn, jd))}}\quad\Rightarrow\quad ${yk(i)}=${ft(F(jn, jd))}\quad\Rightarrow\quad y=${ft(ans)}\]`)] };
  } };

  feladatok.logdef = { nev: 'x a definícióból', general() {
    const kind = R(0, 2);
    if (kind < 2) { const b = P([{ t: '2', n: 2, d: 1 }, { t: '3', n: 3, d: 1 }, { t: '4', n: 4, d: 1 }, { t: '5', n: 5, d: 1 }, { t: '6', n: 6, d: 1 }, { t: '7', n: 7, d: 1 }, { t: '10', n: 10, d: 1 },
        { t: T`\frac{1}{2}`, n: 1, d: 2 }, { t: T`\frac{1}{3}`, n: 1, d: 3 }, { t: T`\frac{2}{3}`, n: 2, d: 3 }, { t: '9', n: 9, d: 1 }, { t: '16', n: 16, d: 1 }, { t: '8', n: 8, d: 1 }]);
      let k, x; const sq = { 4: 2, 9: 3, 16: 4 }, cb = { 8: 2 };
      if (kind === 1 && (sq[b.n] || cb[b.n])) { const r = sq[b.n] ? 2 : 3; const root = sq[b.n] || cb[b.n]; const m = P([1, 3, -1, r === 3 ? 2 : 5, -3]); if (gcd(Math.abs(m), r) !== 1 || root ** Math.abs(m) > 1000) return this.general(); k = F(m, r); x = fpow(F(root), m); }
      else { const lim = Math.max(b.n, b.d) >= 6 ? 2 : 3; let kk; do { kk = R(-lim, lim); } while (Math.max(b.n, b.d) ** Math.abs(kk) > 1000); k = F(kk); x = fpow(F(b.n, b.d), kk); }
      const L = b.n === 10 ? T`\lg` : T`\log_{${b.t}}`;
      return { kerdes: T`<p>Határozd meg \(x\) értékét!</p>\[${L} x=${ft(k)}\]`, valasz: { ertekek: [fv(x)] }, formatum: FMT.frac,
        tipp: T`\(\log_a x=c \iff x=a^{c}\).`, megoldas: [T`\[x=${b.d === 1 ? b.t : T`\left(${b.t}\right)`}^{${ft(k)}}=${ft(x)}\]`] }; }
    const c = P([2, 3, 4, 5, 6, 7, 8, 9, 10]); let k = P([2, 3, -1, -2, -3, F(1, 2), F(3, 2), F(1, 3), F(2, 3), F(-1, 2)]); if (typeof k === 'number') k = F(k);
    const N = fpow(F(c), 1); // x = c, N = c^k
    let Nv; if (k.d === 1) { Nv = fpow(F(c), k.n); } else { const r = Math.round(c ** (1 / k.d)); if (r ** k.d !== c) return this.general(); Nv = fpow(F(r), k.n); }
    if (Math.max(Nv.n, Nv.d) > 1000 || Math.max(Nv.n, Nv.d) === 1) return this.general();
    return { kerdes: T`<p>Határozd meg \(x\) értékét!</p>\[\log_{x} ${ft(Nv)}=${ft(k)}\]`, valasz: { ertekek: [c] }, formatum: 'szám',
      tipp: T`A definíció szerint \(x^{${ft(k)}}=${ft(Nv)}\). Az alap csak pozitív és 1-től különböző szám lehet!`,
      megoldas: [T`\[x^{${ft(k)}}=${ft(Nv)}\quad\Rightarrow\quad x=${Nv.d === 1 ? Nv.n : T`\left(${ft(Nv)}\right)`}^{${ft(F(k.d, k.n))}}=${c}\]`, k.d === 1 && k.n % 2 === 0 ? T`(A \(-${c}\) nem lehet alap.)` : ''].filter(Boolean) };
  } };

  feladatok.logalap = { nev: 'a^(log_a b) = b', general() {
    const kind = R(0, 3);
    if (kind === 3) { const a = P([2, 3]); const m = P([2, 3, 5, 7].filter(t => t !== a));
      return { kerdes: T`<p>Számítsd ki!</p>\[${a * a}^{\log_{${a}} ${m}}\]`, valasz: { ertekek: [m * m] }, formatum: 'egész szám',
        tipp: T`Írd fel az alapot \(${a}\) hatványaként, és használd: \(a^{\log_a b}=b\).`,
        megoldas: [T`\[${a * a}^{\log_{${a}} ${m}}=\left(${a}^{2}\right)^{\log_{${a}} ${m}}=\left(${a}^{\log_{${a}} ${m}}\right)^{2}=${m}^{2}=${m * m}\]`] }; }
    const a = P([2, 3, 5, 10]); const L = lgOf(a);
    if (kind === 0) { const m = P([2, 3, 4, 6, 7, 11].filter(t => t !== a));
      return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{${L} ${m}}\]`, valasz: { ertekek: [m] }, formatum: 'egész szám', tipp: T`\(a^{\log_a b}=b\): ez maga a logaritmus definíciója.`, megoldas: [T`\[${a}^{${L} ${m}}=${m}\]`] }; }
    if (kind === 1) { const k = P([2, 3]); const m = P([2, 3, 4].filter(t => t !== a));
      return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{${k}${L} ${m}}\]`, valasz: { ertekek: [m ** k] }, formatum: 'egész szám', tipp: T`\(a^{k\cdot\log_a b}=\left(a^{\log_a b}\right)^{k}\).`,
        megoldas: [T`\[${a}^{${k}${L} ${m}}=\left(${a}^{${L} ${m}}\right)^{${k}}=${m}^{${k}}=${m ** k}\]`] }; }
    const m = P([2, 3, 4, 7].filter(t => t !== a));
    return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{1+${L} ${m}}\]`, valasz: { ertekek: [a * m] }, formatum: 'egész szám', tipp: T`\(a^{1+x}=a\cdot a^{x}\).`,
      megoldas: [T`\[${a}^{1+${L} ${m}}=${a}^{1}\cdot ${a}^{${L} ${m}}=${a}\cdot ${m}=${a * m}\]`] };
  } };

  feladatok.logErtTart = { nev: 'Értelmezési tartomány', general() {
    const L = () => P([T`\lg`, T`\log_{2}`, T`\log_{3}`, T`\log_{5}`, T`\log_{\frac{1}{2}}`]);
    if (R(0, 2) > 0) { const a = P([1, 2, 3, 4, 5, -1, -2, -3, -4]); const b = R(-9, 9); const B = F(-b, a);
      const lin = (a === 1 ? 'x' : a === -1 ? '-x' : a + 'x') + (b === 0 ? '' : b > 0 ? '+' + b : String(b)); const rel = a > 0 ? '>' : '<';
      const lead = R(0, 1) ? T`f(x)=${L()}\left(${lin}\right)` : T`f(x)=${R(1, 5)}+${L()}\left(${lin}\right)`;
      return { kerdes: T`<p>Mi a függvény értelmezési tartománya (a valós számok legbővebb részhalmaza)? Add meg a hiányzó számot!</p>\[${lead}\qquad x${rel}\square\]`, valasz: { ertekek: [fv(B)] }, formatum: FMT.frac,
        tipp: 'Logaritmusa csak pozitív számnak van: a logaritmus mögötti kifejezés legyen nagyobb 0-nál. Negatív számmal osztva megfordul a reláció!',
        megoldas: [a === 1 ? T`\[${lin}>0\quad\Rightarrow\quad x>${ft(B)}\]` : T`\[${lin}>0\quad\Rightarrow\quad ${a === -1 ? '-' : a}x>${-b}\quad\Rightarrow\quad x${rel}${ft(B)}\]`] }; }
    const a = R(-6, 4), b = R(a + 2, 9); const n = b - a - 1;
    return { kerdes: T`<p>Hány egész szám tartozik a függvény értelmezési tartományába?</p>\[f(x)=${L()}\left(${xs(-a)}\right)+${L()}\left(${b}-x\right)\]`, valasz: { ertekek: [n] }, formatum: 'egész szám (darab)',
      tipp: 'Mindkét logaritmus mögött pozitív számnak kell állnia: írd fel a két feltételt, és vedd a közös részüket.',
      megoldas: [T`\[${xs(-a)}>0\Rightarrow x>${a},\qquad ${b}-x>0\Rightarrow x<${b}\]`, T`Tehát \(${a}<x<${b}\). Az ide eső egészek: \(${Array.from({ length: n }, (_, i) => a + 1 + i).join(';\\ ')}\), összesen ${n} darab.`] };
  } };

  feladatok.logBeagy = { nev: 'Egymásba ágyazott logaritmus', general() {
    // log_a( log_b N ),  log_b N = m = a^k
    const outer = P([{ a: 2, t: '2' }, { a: 3, t: '3' }, { a: 4, t: '4' }, { a: 0.5, t: T`\frac{1}{2}` }, { a: 9, t: '9' }, { a: 5, t: '5' }, { a: 8, t: '8' }, { a: 16, t: '16' }]);
    const ks = { 2: [0, 1, 2, 3, 4], 3: [0, 1, 2], 4: [1, 2], 0.5: [-1, -2, -3, -4], 9: [1], 5: [0, 1], 8: [1], 16: [1] }[outer.a]; const k = P(ks); const m = Math.round(outer.a ** k);
    const inner = P([2, 3, 5, 10].filter(b => b ** m <= 1e6)); if (!inner) return this.general(); const N = inner ** m;
    const Li = inner === 10 ? T`\lg` : T`\log_{${inner}}`, Lo = outer.a === 10 ? T`\lg` : T`\log_{${outer.t}}`;
    const NT = N >= 10000 ? (inner === 10 ? T`10^{${m}}` : bigT(N)) : String(N);
    const oT = outer.a === 0.5 ? T`\left(\frac{1}{2}\right)` : outer.t;
    if (R(0, 1) === 0) // x-et keressük
      return { kerdes: T`<p>Oldd meg a pozitív valós számok halmazán!</p>\[${Lo}\left(${Li} x\right)=${k}\]`, valasz: { ertekek: [N] }, formatum: 'szám',
        tipp: 'Kívülről befelé haladj: a definíció szerint a külső logaritmus mögötti kifejezés az alap megfelelő hatványa.',
        megoldas: [T`\[${Li} x=${oT}^{${k}}=${m}\]`, T`\[x=${inner}^{${m}}=${NT}\]`] };
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${Lo}\left(${Li} ${NT}\right)\]`, valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: 'Belülről kifelé haladj: először a belső logaritmust számold ki.',
      megoldas: [inner === 10 && N >= 10000 ? T`\[${Li} ${NT}=${m}\]` : T`\[${Li} ${NT}=${m},\quad\text{mert}\quad ${inner}^{${m}}=${NT}\]`, T`\[${Lo} ${m}=${k},\quad\text{mert}\quad ${oT}^{${k}}=${m}\]`] };
  } };

  feladatok.logGyokos = { nev: 'Gyökös alap vagy szám', general() {
    const c = P([2, 3, 5, 7]); const cp = k => String(c ** k);
    const BASES = [{ t: String(c), e: F(1) }, { t: cp(2), e: F(2) }, { t: T`\sqrt{${c}}`, e: F(1, 2) }, { t: T`\frac{1}{${c}}`, e: F(-1) }, { t: T`\sqrt[3]{${c}}`, e: F(1, 3) }];
    const ARGS = [{ t: cp(2), e: F(2) }, { t: cp(3), e: F(3) }, { t: T`\sqrt{${c}}`, e: F(1, 2) }, { t: T`\sqrt[3]{${cp(2)}}`, e: F(2, 3) }, { t: T`${c}\sqrt{${c}}`, e: F(3, 2) },
      { t: T`\frac{1}{${c}}`, e: F(-1) }, { t: T`\frac{1}{\sqrt{${c}}}`, e: F(-1, 2) }, { t: T`\frac{1}{${cp(2)}}`, e: F(-2) }, { t: T`\sqrt[4]{${c}}`, e: F(1, 4) }, { t: T`${cp(2)}\sqrt{${c}}`, e: F(5, 2) }];
    const B = P(BASES), A = P(ARGS); if ((B.e.n === 1 && B.e.d === 1 && A.e.d === 1) || fv(A.e) === fv(B.e)) return this.general();
    if (c ** 3 > 343 && /3/.test(A.t)) return this.general();
    const ans = F(A.e.n * B.e.d, A.e.d * B.e.n);
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[\log_{${B.t}} ${A.t}\]`, valasz: { ertekek: [fv(ans)] }, formatum: FMT.frac,
      tipp: T`Írd fel az alapot és a számot is \(${c}\) hatványaként (a gyököt törtkitevővel), majd használd a definíciót: \(\left(${c}^{${ft(B.e)}}\right)^{y}=${c}^{${ft(A.e)}}\).`,
      megoldas: fv(B.e) === 1 ? [T`\[\log_{${c}} ${A.t}=y\iff ${c}^{y}=${c}^{${ft(A.e)}}\quad\Rightarrow\quad y=${ft(ans)}\]`] : [T`\[\log_{${B.t}} ${A.t}=y\iff \left(${c}^{${ft(B.e)}}\right)^{y}=${c}^{${ft(A.e)}}\]`, T`\[${B.e.d === 1 ? (B.e.n === 1 ? '' : B.e.n === -1 ? '-' : B.e.n) : ft(B.e) + '\\,'}y=${ft(A.e)}\quad\Rightarrow\quad y=${ft(ans)}\]`] };
  } };

  feladatok.logAlap2 = { nev: 'Hatvány logaritmusos kitevővel', general() {
    const a = P([2, 3, 5, 10]); const L = lgOf(a); const kind = R(0, 4);
    const bs = [2, 3, 4, 5, 6, 7, 9, 11].filter(t => t !== a);
    if (kind === 0) { const b = P(bs); const k = R(1, a === 10 ? 2 : 3); const val = F(a ** k, b);
      return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{${k}-${L} ${b}}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
        tipp: T`\(a^{x-y}=\dfrac{a^{x}}{a^{y}}\), és \(a^{\log_a b}=b\).`, megoldas: [T`\[${a}^{${k}-${L} ${b}}=\frac{${a}^{${k}}}{${a}^{${L} ${b}}}=\frac{${a ** k}}{${b}}${val.d === b ? '' : T`=${ft(val)}`}\]`] }; }
    if (kind === 1) { const b = P(bs.filter(t => t <= 7)); const m = a === 10 ? 2 : P([2, 3]); if (a ** m > 1000) return this.general();
      return { kerdes: T`<p>Számítsd ki!</p>\[${a ** m}^{${L} ${b}}\]`, valasz: { ertekek: [b ** m] }, formatum: 'egész szám',
        tipp: T`Írd fel az alapot \(${a}\) hatványaként: \(${a ** m}=${a}^{${m}}\).`, megoldas: [T`\[${a ** m}^{${L} ${b}}=\left(${a}^{${L} ${b}}\right)^{${m}}=${b}^{${m}}=${b ** m}\]`] }; }
    if (kind === 2) { const b = P(bs); return { kerdes: T`<p>Számítsd ki!</p>\[\left(\frac{1}{${a}}\right)^{${L} ${b}}\]`, valasz: { ertekek: [1 / b] }, formatum: FMT.frac,
        tipp: T`\(\frac{1}{${a}}=${a}^{-1}\).`, megoldas: [T`\[\left(${a}^{-1}\right)^{${L} ${b}}=\left(${a}^{${L} ${b}}\right)^{-1}=${b}^{-1}=\frac{1}{${b}}\]`] }; }
    if (kind === 3) { const b = P(bs), c = P(bs.filter(t => t !== b)); const op = R(0, 1) ? '+' : '-'; const val = op === '+' ? F(b * c) : F(b, c);
      return { kerdes: T`<p>Számítsd ki!</p>\[${a}^{${L} ${b}${op}${L} ${c}}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
        tipp: T`\(a^{x+y}=a^{x}\cdot a^{y}\), \(a^{x-y}=\dfrac{a^{x}}{a^{y}}\), és \(a^{\log_a b}=b\).`,
        megoldas: [T`\[${a}^{${L} ${b}${op}${L} ${c}}=${a}^{${L} ${b}}${op === '+' ? '\\cdot ' : ':'}${a}^{${L} ${c}}=${b}${op === '+' ? '\\cdot ' : ':'}${c}=${ft(val)}\]`] }; }
    const sq = P([4, 9, 16, 25, 36, 49]); return { kerdes: T`<p>Számítsd ki!</p>\[\left(\sqrt{${a}}\right)^{${L} ${sq}}\]`, valasz: { ertekek: [Math.sqrt(sq)] }, formatum: 'egész szám',
      tipp: T`\(\sqrt{${a}}=${a}^{\frac12}\), így a kitevőben \(\frac12\cdot\log_{${a}} ${sq}\) áll.`, megoldas: [T`\[\left(${a}^{\frac{1}{2}}\right)^{${L} ${sq}}=\left(${a}^{${L} ${sq}}\right)^{\frac{1}{2}}=${sq}^{\frac{1}{2}}=${Math.sqrt(sq)}\]`] };
  } };

  Tananyag.fejezet({
    id: 'log',
    cim: 'A logaritmus fogalma',
    rovid: 'A logaritmus',
    bevezeto: T`A logaritmus egy kitevő: logₐ b az a szám, amelyre az a alapot emelve b-t kapunk.`,
    elmelet: T`<div class="mathbox">\[\log_a b=c\iff a^{c}=b\qquad (a>0,\ a\ne 1,\ b>0)\qquad\text{ezért}\qquad a^{\log_a b}=b\]</div>
<div class="prose"><p>Példák: \(\log_2 8=3\), mert \(2^3=8\); \(\log_3\frac19=-2\), mert \(3^{-2}=\frac19\); \(\log_5 1=0\), mert \(5^0=1\).</p>
<ul><li><b>Feltételek:</b> az alap pozitív és nem 1; a logaritmus mögötti szám pozitív. Negatív számnak és 0-nak nincs logaritmusa.</li>
<li><b>Jelölések:</b> \(\lg b=\log_{10} b\) (számológépen „log”), \(\ln b=\log_e b\), ahol \(e\approx 2{,}718\).</li></ul></div>
<div class="mathbox">\[\log_a 1=0,\qquad \log_a a=1,\qquad \log_a a^{k}=k,\qquad a^{\log_a b}=b\]</div>`,
    igazHamis: [
    { allitas: T`\(\log_2 8=4\)`, igaz: false, miert: T`\(\log_2 8=3\), mert \(2^3=8\). A logaritmus nem osztás!` },
    { allitas: T`\(\lg 0{,}01=-2\)`, igaz: true, miert: T`\(10^{-2}=0{,}01\). A logaritmus lehet negatív, csak a mögötte álló szám nem.` },
    { allitas: T`\(\log_3 0=1\)`, igaz: false, miert: T`\(\log_3 0\) nincs értelmezve, mert 3 egyik hatványa sem 0.` },
    { allitas: T`\(\log_a 1=0\) minden megengedett \(a\)-ra.`, igaz: true, miert: T`\(a^0=1\).` },
    { allitas: T`\(\log_{2}\frac18=-3\)`, igaz: true, miert: T`\(2^{-3}=\frac18\).` },
    { allitas: T`\(\log_{\sqrt3} 9=2\)`, igaz: false, miert: T`\(\left(\sqrt3\right)^{4}=9\), tehát \(\log_{\sqrt3}9=4\).` },
    { allitas: T`\(5^{\log_5 7}=7\)`, igaz: true, miert: T`\(a^{\log_a b}=b\): ez maga a definíció.` },
    { allitas: T`\(\lg(-100)=-2\)`, igaz: false, miert: T`Negatív számnak nincs logaritmusa; \(\lg 0{,}01=-2\).` },
    { allitas: T`\(\log_{1} 5\) nincs értelmezve.`, igaz: true, miert: T`Az 1 nem lehet alap, mert minden hatványa 1.` }
    ],
    mintapelda: {
      feladat: T`Számítsd ki: \(\log_4 8\)`,
      lepesek: [
      T`Jelöljük \(c\)-vel, és írjuk fel hatványként: \(\log_4 8=c\iff 4^c=8\).`,
      T`Közös alapra hozunk (5. fejezet!): \[2^{2c}=2^{3}\]`,
      T`\[2c=3\quad\Rightarrow\quad c=\frac32\]`
      ]
    },
    feladatok
  });
})();
