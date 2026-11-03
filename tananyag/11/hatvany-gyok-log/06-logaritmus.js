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
    if (R(0, 1) === 0) { const b = P([{ t: '2', n: 2, d: 1 }, { t: '3', n: 3, d: 1 }, { t: '4', n: 4, d: 1 }, { t: '5', n: 5, d: 1 }, { t: '10', n: 10, d: 1 }, { t: T`\frac{1}{2}`, n: 1, d: 2 }]);
      const k = b.n >= 4 ? R(-2, 2) : R(-3, 3); const x = fpow(F(b.n, b.d), k); const L = b.n === 10 ? T`\lg` : T`\log_{${b.t}}`;
      return { kerdes: T`<p>Határozd meg \(x\) értékét!</p>\[${L} x=${k}\]`, valasz: { ertekek: [fv(x)] }, formatum: FMT.frac,
        tipp: T`\(\log_a x=c \iff x=a^{c}\).`, megoldas: [T`\[x=${b.d === 1 ? b.t : T`\left(${b.t}\right)`}^{${k}}=${ft(x)}\]`] }; }
    const c = P([2, 3, 4, 5]); let k = P([2, 3, -1, -2]); if (c >= 4 && k === 3) k = 2; const N = fpow(F(c), k);
    return { kerdes: T`<p>Határozd meg \(x\) értékét!</p>\[\log_{x} ${ft(N)}=${k}\]`, valasz: { ertekek: [c] }, formatum: 'egész szám',
      tipp: T`A definíció szerint \(x^{${k}}=${ft(N)}\). Az alap csak pozitív és 1-től különböző szám lehet!`,
      megoldas: [T`\[x^{${k}}=${ft(N)}=${c}^{${k}}\]`, T`Mivel az alap pozitív, \(x=${c}\).${k % 2 === 0 ? T` (A \(-${c}\) nem lehet alap.)` : ''}`] };
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
    { allitas: T`\(\log_a 1=0\) minden megengedett \(a\)-ra.`, igaz: true, miert: T`\(a^0=1\).` }
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
