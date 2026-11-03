/*
 * 9. fejezet – Logaritmikus egyenletek
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.logA = { nev: 'A) Definíció alapján', general() {
    const b = P([2, 3, 5, 10]); const k = b === 2 ? R(0, 4) : b === 3 ? R(0, 3) : R(0, 2); const p = P([1, 1, 2, 3]); const x0 = R(-3, 6); const q = b ** k - p * x0;
    const L = lgOf(b);
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${L}\left(${lin(p, q)}\right)=${k}\]`, valasz: { ertekek: [x0] }, formatum: 'egész szám',
      tipp: T`\(\log_a(\dots)=c\) esetén \((\dots)=a^{c}\). Ne felejtsd el a feltételt: a logaritmus mögött pozitív szám áll.`,
      megoldas: [T`Feltétel: \(${lin(p, q)}>0\).`, T`\[${lin(p, q)}=${b}^{${k}}=${b ** k}\quad\Rightarrow\quad ${p === 1 ? '' : p}x=${b ** k - q}\quad\Rightarrow\quad x=${x0}\]`, T`Ellenőrzés: \(${lin(p, q).replace('x', '\\cdot(' + x0 + ')').replace(/^\\cdot/, '')}=${b ** k}>0\), tehát jó.`] };
  } };

  const LOGB_POOL = [[10, 1, 3, 2], [10, 1, -3, 5], [10, 1, 9, 1], [10, 2, 15, 5], [10, 2, -15, 20], [10, 2, 21, 4], [2, 3, 2, 2], [2, 3, -2, 4], [2, 3, 7, 1], [2, 4, 6, 2], [2, 4, -6, 8], [2, 4, 15, 1], [3, 2, 8, 1], [3, 3, 6, 3], [3, 3, -6, 9], [2, 5, 4, 4], [2, 5, -4, 8], [5, 2, 24, 1], [2, 6, 12, 4]];
  feladatok.logB = { nev: 'B) Azonossággal', general() {
    if (R(0, 2) > 0) { const [b, k, d, r] = P(LOGB_POOL); const N = b ** k; const other = -N / r; const L = lgOf(b);
      return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${L} x+${L}\left(${xs(d)}\right)=${k}\]`, valasz: { ertekek: [r] }, formatum: 'egész szám',
        tipp: T`Első lépés a feltétel: \(x>0\) és \(${xs(d)}>0\). Utána vond össze: \(\log_a x+\log_a y=\log_a(xy)\).`,
        megoldas: [T`Feltétel: \(x>${Math.max(0, -d)}\).`, T`\[${L}\bigl(x(${xs(d)})\bigr)=${k}\quad\Rightarrow\quad x(${xs(d)})=${N}\]`, T`\[x^{2}${d > 0 ? '+' : '-'}${Math.abs(d) === 1 ? '' : Math.abs(d)}x-${N}=0\quad\Rightarrow\quad x_1=${r},\; x_2=${other}\]`, T`Az \(x_2=${other}\) nem felel meg a feltételnek, így a megoldás: \(x=${r}\).`] }; }
    const x0 = R(1, 6); const p = R(1, 4); let r = R(1, 4); while (r === p) r = R(1, 4); let q; do { q = R(-3, 5); } while (p * x0 + q <= 0); const s = p * x0 + q - r * x0;
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[\lg\left(${lin(p, q)}\right)=\lg\left(${lin(r, s)}\right)\]`, valasz: { ertekek: [x0] }, formatum: 'egész szám',
      tipp: T`A logaritmusfüggvény szigorúan monoton, ezért \(\lg A=\lg B\) esetén \(A=B\). Végül ellenőrizd, hogy mindkét oldalon pozitív szám áll-e a logaritmus mögött.`,
      megoldas: [T`\[${lin(p, q)}=${lin(r, s)}\quad\Rightarrow\quad ${p - r === 1 ? '' : p - r === -1 ? '-' : p - r}x=${s - q}\quad\Rightarrow\quad x=${x0}\]`, T`Ellenőrzés: mindkét oldalon \(\lg ${p * x0 + q}\) áll, és \(${p * x0 + q}>0\), tehát jó.`] };
  } };

  feladatok.logC = { nev: 'C) Új változó', general() {
    const b = P([2, 3, 10]); const y1 = R(-2, 3); let y2 = R(-2, 3); while (y2 === y1) y2 = R(-2, 3);
    const B = y1 + y2, C = y1 * y2; const L = lgOf(b);
    const tex = T`\left(${L} x\right)^{2}${linCoef(B, T`${L} x`)}${cst(C)}=0`;
    const x1 = fpow(F(b), y1), x2 = fpow(F(b), y2);
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket.</p>\[${tex}\]`, valasz: { ertekek: [fv(x1), fv(x2)] }, formatum: FMT.set,
      tipp: T`Legyen \(y=${L} x\). Másodfokú egyenletet kapsz; itt \(y\) lehet negatív is! Végül \(x=${b}^{y}\).`,
      megoldas: [T`Feltétel: \(x>0\). Legyen \(y=${L} x\):`, T`\[y^{2}${linCoef(B, 'y')}${cst(C)}=0\quad\Rightarrow\quad y_1=${y1},\; y_2=${y2}\]`, T`\[x_1=${b}^{${y1}}=${ft(x1)},\qquad x_2=${b}^{${y2}}=${ft(x2)}\]`] };
  } };

  feladatok.logD = { nev: 'D) Logaritmussal (sz)', general() {
    const kind = R(0, 2); let tex, v, sol;
    if (kind === 0) { const a = P([2, 3, 5, 7, 1.05, 1.2]); let c; do { c = P([5, 7, 10, 15, 20, 50, 100]); v = Math.log(c) / Math.log(a); } while (Math.abs(v - Math.round(v)) < 1e-9);
      tex = T`${nt(a)}^{x}=${c}`; sol = [T`\[x=\log_{${nt(a)}} ${c}=\frac{\lg ${c}}{\lg ${nt(a)}}\approx ${nt(+v.toFixed(2))}\]`]; }
    else if (kind === 1) { const K = P([2, 3, 4, 5]); const a = P([2, 3]); let m; do { m = P([5, 7, 10, 20]); v = Math.log(m) / Math.log(a); } while (Math.abs(v - Math.round(v)) < 1e-9);
      tex = T`${K}\cdot ${a}^{x}=${K * m}`; sol = [T`\[${a}^{x}=${m}\quad\Rightarrow\quad x=\frac{\lg ${m}}{\lg ${a}}\approx ${nt(+v.toFixed(2))}\]`]; }
    else { const a = P([2, 3, 5]); let c, w; do { c = P([7, 10, 15, 20, 40]); w = Math.log(c) / Math.log(a); } while (Math.abs(w - Math.round(w)) < 1e-9); v = w - 1;
      tex = T`${a}^{x+1}=${c}`; sol = [T`\[x+1=\frac{\lg ${c}}{\lg ${a}}\approx ${nt(+w.toFixed(3))}\quad\Rightarrow\quad x\approx ${nt(+v.toFixed(2))}\]`]; }
    return { kerdes: T`<p>Oldd meg számológéppel! Az eredményt két tizedesjegyre kerekítsd.</p>\[${tex}\]`, valasz: { ertekek: [v], tol: 0.006 }, formatum: 'tizedes tört, pl. 2,81',
      tipp: T`Ha \(a^{x}=b\), és \(b\) nem írható fel \(a\) hatványaként: \(x=\log_a b=\dfrac{\lg b}{\lg a}\).`, megoldas: sol };
  } };

  Tananyag.fejezet({
    id: 'logegy',
    cim: 'Logaritmikus egyenletek',
    rovid: 'Logaritmikus egyenletek',
    bevezeto: T`A leggyakoribb pontvesztés az értelmezési tartomány elfelejtése. Minden megoldás négy lépés: feltétel → átalakítás → logaritmus elhagyása → ellenőrzés.`,
    elmelet: T`<div class="tbl"><table><thead><tr><th>Típus</th><th>Felismerés</th><th>Teendő</th></tr></thead><tbody>
<tr><td><b>A) Definíció</b></td><td>egyetlen logaritmus = szám</td><td>\(\log_a A=c\Rightarrow A=a^c\)</td></tr>
<tr><td><b>B) Azonosságok</b></td><td>több logaritmus összege, különbsége</td><td>összevonás egy logaritmusba, aztán A vagy monotonitás</td></tr>
<tr><td><b>C) Új változó</b></td><td>\((\log x)^2\) is szerepel</td><td>\(y=\log x\); itt \(y\) negatív is lehet!</td></tr>
<tr><td><b>D) Logaritmussal</b></td><td>\(a^x=b\), b nem hatványa a-nak</td><td>\(x=\log_a b=\frac{\lg b}{\lg a}\)</td></tr></tbody></table></div>
<div class="prose"><ul>
<li>Hibás: \(\lg(x+3)=\lg x+\lg 3\).</li>
<li>Hibás: \(\lg x+\lg(x-3)=1\)-ből \(x+x-3=10\). Helyesen: \(x(x-3)=10\).</li>
<li>C típusnál a negatív \(y\) is jó: \(\log_2 x=-1\Rightarrow x=\frac12\).</li></ul></div>`,
    igazHamis: [
    { allitas: T`\(\lg x+\lg(x-3)=1\)-ből \(x+x-3=10\).`, igaz: false, miert: T`A szorzat logaritmusa az összeg: \(x(x-3)=10\).` },
    { allitas: T`A \(\log_2 x=-1\) egyenletnek nincs megoldása.`, igaz: false, miert: T`\(x=2^{-1}=\frac12\). A logaritmus értéke lehet negatív.` },
    { allitas: T`A kapott gyököket ellenőrizni kell az értelmezési tartományra.`, igaz: true, miert: T`Az összevonás bővítheti az értelmezési tartományt, így hamis gyök is keletkezhet.` }
    ],
    mintapelda: {
      feladat: T`Oldd meg: \(\lg x+\lg(x-3)=1\)`,
      lepesek: [
      T`Feltétel: \(x>0\) és \(x-3>0\), tehát \(x>3\).`,
      T`\[\lg\bigl(x(x-3)\bigr)=1\quad\Rightarrow\quad x^2-3x=10\]`,
      T`\[x^2-3x-10=0\quad\Rightarrow\quad x_1=5,\ x_2=-2\]`,
      T`Az \(x=-2\) nem felel meg a feltételnek, így az egyetlen megoldás \(x=5\).`
      ]
    },
    feladatok
  });
})();
