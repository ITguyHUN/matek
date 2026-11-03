/*
 * 1. fejezet – Hatványozás egész kitevőre
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.negkitevo = { nev: 'Negatív kitevő', general() {
    const t = R(0, 3); let tex, val, sol;
    if (t === 0) { const a = P([2, 3, 4, 5, 10]); const n = a === 10 ? R(1, 4) : R(1, 3);
      tex = T`${a}^{-${n}}`; val = F(1, a ** n); sol = [T`\[${a}^{-${n}}=\frac{1}{${a}^{${n}}}=${ft(val)}\]`]; }
    else if (t === 1) { const [p, q] = P([[2, 3], [1, 2], [3, 4], [2, 5], [3, 5], [1, 3], [4, 3], [5, 2]]); const n = R(1, 3);
      tex = T`\left(\frac{${p}}{${q}}\right)^{-${n}}`; val = F(q ** n, p ** n);
      sol = [T`\[\left(\frac{${p}}{${q}}\right)^{-${n}}=\left(\frac{${q}}{${p}}\right)^{${n}}=${ft(val)}\]`, 'Negatív kitevőnél a tört megfordul (reciprok), a kitevő pozitív lesz.']; }
    else if (t === 2) { const a = P([2, 3, 5]); const n = R(1, 3); tex = T`(-${a})^{-${n}}`; val = F((-1) ** n, a ** n);
      sol = [T`\[(-${a})^{-${n}}=\frac{1}{(-${a})^{${n}}}=\frac{1}{${(-a) ** n}}=${ft(val)}\]`, n % 2 ? 'Páratlan kitevő esetén a negatív alap hatványa negatív.' : 'Páros kitevő esetén a negatív alap hatványa pozitív.']; }
    else { const a = R(2, 6); let b = R(2, 6); while (b === a) b = R(2, 6); tex = T`${a}^{-1}+${b}^{-1}`; val = F(a + b, a * b);
      sol = [T`\[${a}^{-1}+${b}^{-1}=\frac{1}{${a}}+\frac{1}{${b}}=\frac{${b}}{${a * b}}+\frac{${a}}{${a * b}}=${ft(val)}\]`]; }
    return { kerdes: T`<p>Számítsd ki!</p>\[${tex}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: T`A negatív kitevő reciprokot jelent: \(a^{-n}=\dfrac{1}{a^n}\). Ettől a szám nem lesz negatív!`, megoldas: sol };
  } };

  feladatok.egyhatvany = { nev: 'Közös alapra hozás', general() {
    const p = P([2, 3]); const B = p === 2 ? [[2, 1], [4, 2], [8, 3], [16, 4]] : [[3, 1], [9, 2], [27, 3]];
    const nz = (a, b) => { let e = 0; while (e === 0) e = R(a, b); return e; };
    const b1 = P(B), b2 = P(B), b3 = P(B); const e1 = nz(-2, 3), e2 = nz(-2, 3), e3 = nz(-2, 3);
    const k1 = b1[1] * e1, k2 = b2[1] * e2, k3 = b3[1] * e3, k = k1 + k2 - k3;
    return { kerdes: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\frac{${b1[0]}^{${e1}}\cdot ${b2[0]}^{${e2}}}{${b3[0]}^{${e3}}}=${p}^{\,\square}\]`,
      valasz: { ertekek: [k] }, formatum: 'egész szám',
      tipp: T`Írd fel mindegyik alapot \(${p}\) hatványaként (pl. \(${B[2][0]}=${p}^{${B[2][1]}}\)). Szorzásnál a kitevők összeadódnak, osztásnál kivonódnak.`,
      megoldas: [T`\[\frac{${p}^{${k1}}\cdot ${p}^{${k2}}}{${p}^{${k3}}}=${p}^{${k1}+(${k2})-(${k3})}=${p}^{${k}}\]`, T`A keresett kitevő: \(${k}\).`] };
  } };

  feladatok.kiemeles = { nev: 'Kiemelés', general() {
    const p = P([2, 3, 5]); const a = R(1, p === 5 ? 2 : 3); const b = R(0, a - 1); const plus = R(0, 1) === 1;
    const s = plus ? '+' : '-'; const val = plus ? p ** a + p ** b : p ** a - p ** b;
    const ex = b === 0 ? 'n' : `n+${b}`;
    return { kerdes: T`<p>Egyszerűsíts, és számítsd ki! (\(n\) tetszőleges egész szám)</p>\[\frac{${p}^{n+${a}}${s}${p}^{${ex}}}{${p}^{n}}\]`,
      valasz: { ertekek: [val] }, formatum: 'egész szám',
      tipp: T`Összeget nem lehet „összevonni”, de ki lehet emelni: emeld ki a számlálóból \(${p}^{n}\)-t, utána egyszerűsíts.`,
      megoldas: [T`\[\frac{${p}^{n}\left(${p}^{${a}}${s}${p}^{${b}}\right)}{${p}^{n}}=${p ** a}${s}${p ** b}=${val}\]`] };
  } };

  Tananyag.fejezet({
    id: 'hatvany',
    cim: 'Hatványozás egész kitevőre',
    rovid: 'Hatványozás',
    bevezeto: T`A hatványazonosságok minden későbbi fejezet alapjai: a logaritmus azonosságai ezeknek a „kifordított” változatai.`,
    elmelet: T`<div class="prose"><p><b>Definíciók</b></p></div>
<div class="mathbox">\[a^n=\underbrace{a\cdot a\cdots a}_{n\ \text{tényező}},\qquad a^1=a,\qquad a^0=1\ (a\ne 0),\qquad a^{-n}=\frac{1}{a^n}\ (a\ne 0)\]</div>
<div class="prose"><p><b>Azonosságok</b> (a, b ≠ 0; n, m egész)</p></div>
<div class="mathbox">\[a^n\cdot a^m=a^{n+m}\qquad \frac{a^n}{a^m}=a^{n-m}\qquad (a^n)^m=a^{n\cdot m}\]\[(a\cdot b)^n=a^n\cdot b^n\qquad \left(\frac{a}{b}\right)^n=\frac{a^n}{b^n}\qquad \left(\frac{a}{b}\right)^{-n}=\left(\frac{b}{a}\right)^n\]</div>
<div class="prose"><p><b>Normálalak:</b> \(a\cdot 10^k\), ahol \(1\le a<10\) és \(k\) egész. Például \(0{,}00052=5{,}2\cdot 10^{-4}\), \(340\,000=3{,}4\cdot 10^{5}\).</p></div>`,
    igazHamis: [
    { allitas: T`\((-2)^4=-2^4\)`, igaz: false, miert: T`\((-2)^4=16\), de \(-2^4=-16\): a kitevő csak arra vonatkozik, ami közvetlenül előtte áll.` },
    { allitas: T`\(3^{-2}=-9\)`, igaz: false, miert: T`\(3^{-2}=\frac{1}{9}\). A negatív kitevő reciprokot jelent, nem negatív számot.` },
    { allitas: T`\(2^3\cdot 2^4=2^7\)`, igaz: true, miert: T`Azonos alapú hatványok szorzásakor a kitevők összeadódnak, az alap marad.` },
    { allitas: T`\(2^3+2^4=2^7\)`, igaz: false, miert: T`Összeget nem lehet így összevonni: \(2^3+2^4=8+16=24\), kiemeléssel \(2^3(1+2)\).` },
    { allitas: T`\((a+b)^2=a^2+b^2\)`, igaz: false, miert: T`\((a+b)^2=a^2+2ab+b^2\). A hatványozás összegre nem bontható szét.` }
    ],
    mintapelda: {
      feladat: T`Számítsd ki: \(\dfrac{2^{-3}\cdot 4^{2}}{8^{-1}}\)`,
      lepesek: [
      T`Mindent 2 hatványaként írunk fel: \(4^2=(2^2)^2=2^4\) és \(8^{-1}=(2^3)^{-1}=2^{-3}\).`,
      T`\[\frac{2^{-3}\cdot 2^{4}}{2^{-3}}\]`,
      T`A kitevők: szorzásnál összeadunk, osztásnál kivonunk: \(-3+4-(-3)=4\).`,
      T`\[=2^{4}=16\]`,
      T`Tanulság: a különböző alapokat hozd közös, lehetőleg prím alapra.`
      ]
    },
    feladatok
  });
})();
