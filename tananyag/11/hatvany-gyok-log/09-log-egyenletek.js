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
    const b = P([2, 3, 5, 10]); const lim = b === 2 ? 4 : b === 3 ? 3 : 2;
    const y1 = R(-lim, lim); let y2 = R(-lim, lim); while (y2 === y1) y2 = R(-lim, lim);
    const B = y1 + y2, C = y1 * y2; const L = lgOf(b);
    const x1 = fpow(F(b), y1), x2 = fpow(F(b), y2);
    // a lineáris tag néha logaritmus-azonossággal „elrejtve”: B·log x = log x^B
    const hide = B !== 0 && Math.abs(B) >= 2 && Math.abs(B) <= 4 && R(0, 1) === 1;
    const linT = hide ? (B > 0 ? T`-${L}\left(x^{${B}}\right)` : T`+${L}\left(x^{${-B}}\right)`) : linCoef(B, T`${L} x`);
    const tex = T`\left(${L} x\right)^{2}${linT}${cst(C)}=0`;
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket.</p>\[${tex}\]`, valasz: { ertekek: [fv(x1), fv(x2)] }, formatum: FMT.set,
      tipp: T`${hide ? T`Előbb alakítsd át: \(${L}\left(x^{${Math.abs(B)}}\right)=${Math.abs(B)}${L} x\). ` : ''}Legyen \(y=${L} x\). Másodfokú egyenletet kapsz; itt \(y\) lehet negatív is! Végül \(x=${b}^{y}\).`,
      megoldas: [T`Feltétel: \(x>0\).${hide ? T` Mivel \(${L}\left(x^{${Math.abs(B)}}\right)=${Math.abs(B)}${L} x\), ezért` : ''} ${hide ? 'legyen' : 'Legyen'} \(y=${L} x\):`, T`\[y^{2}${linCoef(B, 'y')}${cst(C)}=0\quad\Rightarrow\quad y_1=${y1},\; y_2=${y2}\]`, T`\[x_1=${b}^{${y1}}=${ft(x1)},\qquad x_2=${b}^{${y2}}=${ft(x2)}\]`] };
  } };

  feladatok.logD = { nev: 'D) Logaritmussal (sz)', general() {
    const kind = R(0, 2); let tex, v, sol;
    if (kind === 0) { const a = P([2, 3, 5, 7, 1.05, 1.2]); let c; do { c = P([5, 7, 10, 15, 20, 50, 100]); v = Math.log(c) / Math.log(a); } while (Math.abs(v - Math.round(v)) < 1e-9);
      tex = T`${nt(a)}^{x}=${c}`; sol = [T`\[x=\log_{${nt(a)}} ${c}=\frac{\lg ${c}}{\lg ${nt(a)}}\approx ${nt(+v.toFixed(2))}\]`]; }
    else if (kind === 1) { const K = P([2, 3, 4, 5]); const a = P([2, 3]); let m; do { m = P([5, 7, 10, 20]); v = Math.log(m) / Math.log(a); } while (Math.abs(v - Math.round(v)) < 1e-9);
      tex = T`${K}\cdot ${a}^{x}=${K * m}`; sol = [T`\[${a}^{x}=${m}\quad\Rightarrow\quad x=\frac{\lg ${m}}{\lg ${a}}\approx ${nt(+v.toFixed(2))}\]`]; }
    else { const a = P([2, 3, 5]); let c, w; do { c = P([7, 10, 15, 20, 40]); w = Math.log(c) / Math.log(a); } while (Math.abs(w - Math.round(w)) < 1e-9); v = w - 1;
      tex = T`${a}^{x+1}=${c}`; sol = [T`\[x+1=\frac{\lg ${c}}{\lg ${a}}\approx ${nt(+w.toFixed(3))}\quad\Rightarrow\quad x\approx ${nt(+v.toFixed(2))}\]`]; }
    return { kerdes: T`<p>Oldd meg számológéppel! Az eredményt két tizedesjegyre kerekítsd.</p>\[${tex}\]`, valasz: { ertekek: [+v.toFixed(2)], tol: 0.006, forma: 'tizedes' }, formatum: 'tizedes tört, pl. 2,81',
      tipp: T`Ha \(a^{x}=b\), és \(b\) nem írható fel \(a\) hatványaként: \(x=\log_a b=\dfrac{\lg b}{\lg a}\).`, megoldas: sol };
  } };


  const fp = f => f.d === 1 ? hu(f.n) : (f.n < 0 ? '−' : '') + Math.abs(f.n) + '/' + f.d;
  const sub = (p, q, x) => (p === 1 ? '' : p + '\\cdot ') + (x < 0 ? `(${x})` : x) + (q === 0 ? '' : q > 0 ? '+' + q : String(q));
  const linT = (p, q) => (p === 1 ? 'x' : p === -1 ? '-x' : p + 'x') + (q === 0 ? '' : q > 0 ? '+' + q : String(q));

  feladatok.logE = { nev: 'E) Különbség, hányados', general() {
    const b = P([2, 3, 5, 10]); const L = lgOf(b);
    const x0 = R(-2, 8), r = R(1, 3); let s0 = R(-6, 6); const D = r * x0 + s0; if (D <= 0 || D > 8) return this.general();
    const m = P([2, 3, 4, 5, 6]); const p = R(1, 6); if (p === m * r) return this.general(); const q = m * D - p * x0; if (Math.abs(q) > 40) return this.general();
    const kind = R(0, 2); let tex, first;
    const rhsLog = (b === 2 && m === 4) ? '2' : (b === 2 && m === 2) || (b === 3 && m === 3) || (b === 5 && m === 5) ? '1' : T`${L} ${m}`;
    if (kind === 0) { tex = T`${L}\left(${linT(p, q)}\right)-${L}\left(${linT(r, s0)}\right)=${rhsLog}`; first = T`\[${L}\frac{${linT(p, q)}}{${linT(r, s0)}}=${L} ${m}\quad\Rightarrow\quad \frac{${linT(p, q)}}{${linT(r, s0)}}=${m}\]`; }
    else if (kind === 1) { tex = T`${L}\left(${linT(p, q)}\right)=${L}\left(${linT(r, s0)}\right)+${L} ${m}`; first = T`\[${L}\left(${linT(p, q)}\right)=${L}\bigl(${m}(${linT(r, s0)})\bigr)\quad\Rightarrow\quad ${linT(p, q)}=${m}(${linT(r, s0)})\]`; }
    else { tex = T`${L}\left(${linT(p, q)}\right)-${L} ${m}=${L}\left(${linT(r, s0)}\right)`; first = T`\[${L}\frac{${linT(p, q)}}{${m}}=${L}\left(${linT(r, s0)}\right)\quad\Rightarrow\quad ${linT(p, q)}=${m}(${linT(r, s0)})\]`; }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${tex}\]`, valasz: { ertekek: [x0] }, formatum: 'egész szám',
      tipp: T`Feltétel: mindkét logaritmus mögött pozitív szám áll. Utána vonj össze egy-egy logaritmussá (\(\log A-\log B=\log\frac{A}{B}\)${rhsLog === '1' || rhsLog === '2' ? T`; a jobb oldalt írd fel így: \(${rhsLog}=${L} ${m}\)` : ''}), és használd, hogy a logaritmusfüggvény kölcsönösen egyértelmű.`,
      megoldas: [T`Feltétel: \(${linT(p, q)}>0\) és \(${linT(r, s0)}>0\).`, first, T`\[${linT(p, q)}=${linT(m * r, m * s0)}\quad\Rightarrow\quad x=${x0}\]`, T`Ellenőrzés: \(x=${x0}\) esetén \(${sub(p, q, x0)}=${p * x0 + q}>0\) és \(${sub(r, s0, x0)}=${D}>0\), tehát jó.`] };
  } };

  feladatok.logF = { nev: 'F) Az alap az ismeretlen', general() {
    const r = R(2, 9), t = -R(1, 6); // x² = px + q gyökei: r és t
    const p = r + t, q = -r * t;
    if (R(0, 2) > 0) {
      return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[\log_{x}\left(${p === 0 ? '' : linT(p, 0)}${p === 0 ? q : '+' + q}\right)=2\]`, valasz: { ertekek: [r] }, formatum: 'egész szám',
        tipp: T`Feltétel: \(x>0\), \(x\ne 1\). A definíció szerint \(x^{2}\) egyenlő a logaritmus mögötti kifejezéssel.`,
        megoldas: [T`Feltétel: \(x>0\) és \(x\ne 1\).`, T`\[x^{2}=${p === 0 ? '' : linT(p, 0)}${p === 0 ? q : '+' + q}\quad\Rightarrow\quad x^{2}${linCoef(p, 'x')}-${q}=0\quad\Rightarrow\quad x_1=${r},\ x_2=${t}\]`, T`Az \(x_2=${t}\) nem lehet alap (negatív), így a megoldás \(x=${r}\).`] }; }
    // log_x(a x² + b x) = 3 → x³ = a x² + b x → x² − a x − b = 0
    const a = p, b2 = q; // x² − a x − b2 = 0 → gyökök r, t
    const inner = (a === 0 ? '' : a === 1 ? 'x^{2}' : a === -1 ? '-x^{2}' : a + 'x^{2}') + (a === 0 ? b2 + 'x' : '+' + b2 + 'x');
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[\log_{x}\left(${inner}\right)=3\]`, valasz: { ertekek: [r] }, formatum: 'egész szám',
      tipp: T`Feltétel: \(x>0\), \(x\ne 1\). A definíció szerint \(x^{3}\) egyenlő a logaritmus mögötti kifejezéssel; utána oszthatsz \(x\)-szel, mert \(x\ne 0\).`,
      megoldas: [T`Feltétel: \(x>0\) és \(x\ne 1\).`, T`\[x^{3}=${inner}\quad\Rightarrow\quad x^{2}=${a === 0 ? '' : linT(a, 0)}${a === 0 ? b2 : '+' + b2}\quad\Rightarrow\quad x_1=${r},\ x_2=${t}\]`, T`Az \(x_2=${t}\) nem lehet alap (negatív), így a megoldás \(x=${r}\).`] };
  } };

  feladatok.logG = { nev: 'G) Egyenlőtlenség', general() {
    const B = P([{ t: '2', v: 2 }, { t: '3', v: 3 }, { t: '5', v: 5 }, { t: '10', v: 10 }, { t: T`\frac{1}{2}`, v: 0.5 }, { t: T`\frac{1}{3}`, v: 1 / 3 }]);
    const L = B.v === 10 ? T`\lg` : T`\log_{${B.t}}`; const small = B.v < 1;
    const k = B.v === 10 ? R(0, 2) : small ? R(-3, 1) : R(0, 3); const bk = small ? fpow(F(B.v === 0.5 ? 2 : 3), -k) : fpow(F(B.v), k);
    if (fv(bk) > 150) return this.general();
    const p = R(1, 5), q = R(-8, 8);
    const rels = ['<', '>', '≤', '≥'], relT = { '<': '<', '>': '>', '≤': '\\le ', '≥': '\\ge ' }, flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
    const rel = P(rels); const rel2 = small ? flip[rel] : rel;  // p x + q  rel2  b^k
    const Bd = F(bk.n - q * bk.d, p * bk.d); const dom = F(-q, p);
    const strict = r => r === '≤' ? '<' : r === '≥' ? '>' : r;
    let ok;
    if (rel2 === '>' || rel2 === '≥') ok = `x ${rel2} ${fp(Bd)}`;
    else ok = `${fp(dom)} < x ${rel2} ${fp(Bd)}`;
    const noDom = rel2 === '<' || rel2 === '≤' ? `x ${rel2} ${fp(Bd)}` : `${fp(dom)} < x ${flip[rel2]} ${fp(Bd)}`;
    const rel2f = flip[rel2]; const wrongFlip = (rel2f === '>' || rel2f === '≥') ? `x ${rel2f} ${fp(Bd)}` : `${fp(dom)} < x ${rel2f} ${fp(Bd)}`;
    let alt = wrongFlip === noDom ? `x ${rel2f} ${fp(Bd)}` : noDom;
    let wrongB = F(bk.n * 1 + q * bk.d, p * bk.d); if (fv(wrongB) === fv(Bd)) wrongB = fadd(Bd, F(1));
    const wr3 = (rel2 === '>' || rel2 === '≥') ? `x ${rel2} ${fp(wrongB)}` : `${fp(dom)} < x ${rel2} ${fp(wrongB)}`;
    const opts = [ok, wrongFlip, alt, wr3].filter((x, i, a) => a.indexOf(x) === i);
    while (opts.length < 4) opts.push(`x ${rel2} ${fp(fadd(Bd, F(opts.length)))}`);
    if (fv(Bd) <= fv(dom)) return this.general();
    const ord = opts.map((_, i) => i).sort(() => Math.random() - 0.5);
    const lin = linT(p, q);
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${L}\left(${lin}\right)${relT[rel]}${k}\]`, valasz: { valasztas: ord.map(i => opts[i]), helyes: ord.indexOf(0) },
      tipp: T`Két dologra figyelj: (1) feltétel: \(${lin}>0\); (2) írd fel a jobb oldalt is \(${B.t}\) alapú logaritmusként. ${small ? 'Az alap 1-nél kisebb, ezért a logaritmus elhagyásakor megfordul a reláció!' : 'Az alap nagyobb 1-nél, a reláció marad.'}`,
      megoldas: [T`Feltétel: \(${lin}>0\Rightarrow x>${ft(dom)}\).`, T`\[${L}\left(${lin}\right)${relT[rel]}${L} ${ft(bk)}\quad\Rightarrow\quad ${lin}${relT[rel2]}${ft(bk)}\quad\Rightarrow\quad x${relT[rel2]}${ft(Bd)}\]`,
        (rel2 === '>' || rel2 === '≥') ? T`Ez a feltételt is biztosítja (mert \(${ft(Bd)}>${ft(dom)}\)), így a megoldás: \(x${relT[rel2]}${ft(Bd)}\).` : T`A feltétellel együtt: \(${ft(dom)}<x${relT[rel2]}${ft(Bd)}\).`] };
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
    { allitas: T`A kapott gyököket ellenőrizni kell az értelmezési tartományra.`, igaz: true, miert: T`Az összevonás bővítheti az értelmezési tartományt, így hamis gyök is keletkezhet.` },
    { allitas: T`A \(\lg x=-1\) egyenletnek nincs megoldása.`, igaz: false, miert: T`\(x=10^{-1}=0{,}1\). A logaritmus értéke lehet negatív.` },
    { allitas: T`A \(\log_2(x-3)+\log_2(x+3)=4\) megoldásai \(x=5\) és \(x=-5\).`, igaz: false, miert: T`\(x^2-9=16\) gyökei \(\pm5\), de a feltétel \(x>3\), így csak \(x=5\) jó.` },
    { allitas: T`A \(\log_{0{,}5}x<1\) egyenlőtlenség megoldása \(x>0{,}5\).`, igaz: true, miert: T`\(\log_{0{,}5}x<\log_{0{,}5}0{,}5\); az alap 1-nél kisebb, így \(x>0{,}5\) (ez a feltételt is biztosítja).` },
    { allitas: T`A \(\log_x 9=2\) egyenlet megoldása \(x=\pm3\).`, igaz: false, miert: T`Az alap csak pozitív lehet, így \(x=3\).` }
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
