/*
 * 8. fejezet – A logaritmusfüggvény
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.logjell = { nev: 'Függvény jellemzése', general() {
    const A = P([{ t: '2', n: 2, d: 1 }, { t: '3', n: 3, d: 1 }, { t: T`\frac{1}{2}`, n: 1, d: 2 }]);
    const u = R(-3, 3), v = R(-2, 2), kind = R(0, 2);
    const arg = u === 0 ? ' x' : T`\left(${xs(-u)}\right)`;
    const f = T`f(x)=\log_{${A.t}}${arg}${pt(v)}`;
    if (kind === 0) return { kerdes: T`<p>Add meg az értelmezési tartományt!</p>\[${f}\qquad x>\square\]`, valasz: { ertekek: [u] }, formatum: 'egész szám',
      tipp: 'A logaritmus mögötti kifejezésnek pozitívnak kell lennie.', megoldas: [T`\[${xs(-u)}>0\quad\Rightarrow\quad x>${u}\]`, T`Az aszimptota is itt van: \(x=${u}\).`] };
    if (kind === 1) { const z = fadd(F(u), fpow(F(A.n, A.d), -v));
      return { kerdes: T`<p>Hol van a függvény zérushelye?</p>\[${f}\qquad x=\square\]`, valasz: { ertekek: [fv(z)] }, formatum: FMT.frac,
        tipp: T`A zérushelyen \(f(x)=0\). Rendezd: \(\log_a(\dots)=\text{szám}\), majd használd a definíciót.`,
        megoldas: [T`\[\log_{${A.t}}${arg}=${-v}\quad\Rightarrow\quad ${xs(-u)}=${A.d === 1 ? A.t : T`\left(${A.t}\right)`}^{${-v}}=${ft(fpow(F(A.n, A.d), -v))}\quad\Rightarrow\quad x=${ft(z)}\]`] }; }
    const k = A.n === 2 ? R(0, 3) : A.n === 3 ? R(0, 2) : R(-3, 0); const x0 = u + fv(fpow(F(A.n, A.d), k));
    return { kerdes: T`<p>Számítsd ki a helyettesítési értéket!</p>\[${f}\qquad f(${x0})=\;?\]`, valasz: { ertekek: [k + v] }, formatum: 'egész szám',
      tipp: 'Helyettesíts be, és számold ki a logaritmust a definícióval.',
      megoldas: [T`\[f(${x0})=\log_{${A.t}}${fpow(F(A.n, A.d), k).d === 1 ? ' ' + ft(fpow(F(A.n, A.d), k)) : ft(fpow(F(A.n, A.d), k))}${pt(v)}=${k}${pt(v)}=${k + v}\]`] };
  } };

  feladatok.logcmp = { nev: 'Melyik nagyobb?', general() {
    if (R(0, 1) === 0) { const B = P([{ t: '2', v: 2 }, { t: '3', v: 3 }, { t: T`0{,}5`, v: .5 }, { t: T`\frac{1}{3}`, v: 1 / 3 }]);
      const L = [2, 3, 5, 7, 10, 0.5]; const p = P(L); let q = P(L); while (q === p) q = P(L);
      const gt = (B.v > 1) === (p > q);
      return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[\log_{${B.t}} ${nt(p)}\;\square\;\log_{${B.t}} ${nt(q)}\]`, valasz: { valasztas: ['<', '=', '>'], helyes: gt ? 2 : 0 },
        tipp: 'Ha az alap nagyobb 1-nél, a logaritmusfüggvény szigorúan nő; ha 0 és 1 közé esik, szigorúan csökken.',
        megoldas: [T`Az alap ${B.v > 1 ? 'nagyobb 1-nél, a függvény szigorúan nő' : '0 és 1 közé esik, a függvény szigorúan csökken'}. Mivel \(${nt(p)}${p > q ? '>' : '<'}${nt(q)}\), ezért \(\log_{${B.t}} ${nt(p)}${gt ? '>' : '<'}\log_{${B.t}} ${nt(q)}\).`] }; }
    const a = P([2, 3]); const m = P(a === 2 ? [3, 5, 6, 7, 8, 10, 12, 16, 20] : [2, 5, 8, 9, 10, 20, 27, 30]); const k = R(1, 3); const ak = a ** k;
    const c = m > ak ? 2 : m < ak ? 0 : 1;
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[\log_{${a}} ${m}\;\square\;${k}\]`, valasz: { valasztas: ['<', '=', '>'], helyes: c },
      tipp: T`Írd fel a jobb oldalt is \(${a}\)-es alapú logaritmusként: \(${k}=\log_{${a}} ${ak}\).`,
      megoldas: [T`\(${k}=\log_{${a}} ${ak}\), és a függvény szigorúan nő, ezért \(\log_{${a}} ${m}${['<', '=', '>'][c]}${k}\).`] };
  } };

  const LBT = [{ t: '2', f: F(2) }, { t: '3', f: F(3) }, { t: '10', f: F(10) }, { t: '5', f: F(5) }, { t: T`\frac{1}{2}`, f: F(1, 2) }, { t: T`\frac{1}{3}`, f: F(1, 3) }, { t: T`0{,}2`, f: F(1, 5) }];
  const lgB = B => B.t === '10' ? T`\lg` : T`\log_{${B.t}}`;

  feladatok.lfAlap = { nev: 'Alap a grafikon pontjából', general() {
    const a = P([F(2), F(3), F(4), F(5), F(6), F(10), F(1, 2), F(1, 3), F(1, 4), F(2, 3), F(3, 2), F(1, 5)]);
    let k; do { k = R(-3, 3); } while (k === 0 || k === 1 || Math.max(a.n, a.d) ** Math.abs(k) > 1000);
    const u = R(0, 2) === 0 ? R(-4, 4) : 0; const x = fadd(fpow(a, k), F(u));
    const f = u ? T`f(x)=\log_{a}\left(${xs(-u)}\right)` : T`f(x)=\log_{a} x`;
    return { kerdes: T`<p>Az \(${f}\) (\(a>0,\ a\ne 1\)) függvény grafikonja átmegy a \(P\left(${ft(x)};\ ${k}\right)\) ponton. Mennyi \(a\)?</p>`, valasz: { ertekek: [fv(a)] }, formatum: FMT.frac,
      tipp: T`Helyettesíts be, és írd át hatvány alakba: \(\log_a N=${k}\iff a^{${k}}=N\).`,
      megoldas: [T`\[\log_{a} ${u ? T`\left(${ft(x)}${u > 0 ? '-' + u : '+' + (-u)}\right)` : ft(x)}=${k}\quad\Rightarrow\quad a^{${k}}=${ft(fpow(a, k))}\quad\Rightarrow\quad a=${ft(a)}\]`, Math.abs(k) % 2 === 0 ? T`(A negatív érték nem lehet alap.)` : ''].filter(Boolean) };
  } };

  feladatok.lfMonoton = { nev: 'Növekvő vagy csökkenő?', general() {
    const B = P(LBT); const c = P([1, 1, -1, 2, -2, 3, -3]); const u = R(-4, 4), v = R(-3, 3); const tukor = R(0, 3) === 0;
    const arg = tukor ? (u === 0 ? '-x' : T`${u}-x`) : xs(-u);
    const novo = ((fv(B.f) > 1) !== tukor) === (c > 0);
    const f = T`f(x)=${c === 1 ? '' : c === -1 ? '-' : c}${lgB(B)}\left(${arg}\right)${pt(v)}`;
    return { kerdes: T`<p>Milyen a függvény menete az értelmezési tartományán?</p>\[${f}\]`, valasz: { valasztas: ['szigorúan növekvő', 'szigorúan csökkenő'], helyes: novo ? 0 : 1 },
      tipp: T`\(\log_a x\) nő, ha \(a>1\), és csökken, ha \(0<a<1\). A negatív szorzó és a \(-x\) (tükrözés) megfordítja a menetet, az eltolás nem.`,
      megoldas: [T`Az alap ${fv(B.f) > 1 ? 'nagyobb 1-nél' : '0 és 1 közé esik'}.${tukor ? ' A −x tükrözi a grafikont az y tengelyre: ez megfordítja a menetet.' : ''}${c < 0 ? ' A negatív szorzó is megfordítja.' : ''}`, `Tehát a függvény szigorúan ${novo ? 'növekvő' : 'csökkenő'}.`] };
  } };

  feladatok.lfTartomany = { nev: 'Értelmezési tartomány (egészek)', general() {
    const kind = R(0, 2);
    if (kind === 0) { const a = R(-5, 3), b = R(a + 3, 9); const p = P([1, 2, 3]);
      // lg(p(x−a)) + log2(b − x) → a < x < b
      const L1 = P([T`\lg`, T`\log_{3}`]), L2 = P([T`\log_{2}`, T`\log_{\frac{1}{2}}`]);
      const in1 = p === 1 ? xs(-a) : (p + 'x' + pt(-p * a)); const n = b - a - 1;
      return { kerdes: T`<p>Hány egész szám tartozik az értelmezési tartományba?</p>\[f(x)=${L1}\left(${in1}\right)-${L2}\left(${b}-x\right)\]`, valasz: { ertekek: [n] }, formatum: 'egész szám (darab)',
        tipp: 'Írd fel külön-külön, mikor pozitív a két logaritmus mögötti kifejezés, és vedd a közös részt.',
        megoldas: [T`\[${in1}>0\Rightarrow x>${a},\qquad ${b}-x>0\Rightarrow x<${b}\]`, T`Közös rész: \(${a}<x<${b}\), ebben ${n} egész szám van.`] }; }
    if (kind === 1) { // log_{x−a}(b − x): x > a, x ≠ a+1, x < b
      const a = R(-3, 4), b = R(a + 3, a + 9); const n = b - a - 2;
      return { kerdes: T`<p>Hány egész szám tartozik az értelmezési tartományba?</p>\[f(x)=\log_{${xs(-a)}}\left(${b}-x\right)\]`, valasz: { ertekek: [n] }, formatum: 'egész szám (darab)',
        tipp: 'Az alap pozitív és 1-től különböző, a logaritmus mögötti szám pozitív.',
        megoldas: [a === 0 ? T`Alap: \(x>0\) és \(x\ne 1\). Szám: \(${b}-x>0\Rightarrow x<${b}\).` : T`Alap: \(${xs(-a)}>0\Rightarrow x>${a}\), és \(${xs(-a)}\ne 1\Rightarrow x\ne ${a + 1}\). Szám: \(${b}-x>0\Rightarrow x<${b}\).`, T`A szóba jövő egészek: \(${Array.from({ length: n }, (_, i) => a + 2 + i).join(';\\ ')}\) (az \(x=${a + 1}\) kimarad), összesen ${n} darab.`] }; }
    // lg((x−a)(b−x)) → a < x < b  (másodfokú)
    const a = R(-5, 3), b = R(a + 2, a + 8); const n = b - a - 1;
    const B = a + b, C = -a * b; // (x−a)(b−x) = −x² + (a+b)x − ab
    const q = T`-x^{2}${B === 0 ? '' : B > 0 ? '+' + (B === 1 ? '' : B) + 'x' : '-' + (B === -1 ? '' : -B) + 'x'}${cst(-a * b)}`;
    return { kerdes: T`<p>Hány egész szám tartozik az értelmezési tartományba?</p>\[f(x)=\lg\left(${q}\right)\]`, valasz: { ertekek: [n] }, formatum: 'egész szám (darab)',
      tipp: 'Oldd meg a másodfokú egyenlőtlenséget: a lefelé nyíló parabola a két zérushelye között pozitív.',
      megoldas: [T`\[${q}>0\iff (x${pt(-a)})(${b}-x)>0\]`, T`A zérushelyek \(${a}\) és \(${b}\), a parabola lefelé nyílik, így \(${a}<x<${b}\): ${n} egész szám.`] };
  } };

  feladatok.lfBecsles = { nev: 'Két egész szám közé', general() {
    const b = P([2, 2, 3, 3, 5, 10]); let N, v;
    do { N = P([R(3, 200), R(3, 60), P([0.3, 0.2, 0.15, 0.05, 0.4, 0.7, 0.01, 0.03])]); v = Math.log(N) / Math.log(b); } while (Math.abs(v - Math.round(v)) < 1e-6);
    const n = Math.floor(v); const L = b === 10 ? T`\lg` : T`\log_{${b}}`;
    const lo = b ** n, hi = b ** (n + 1); const fT = x => x >= 1 ? String(x) : T`\frac{1}{${Math.round(1 / x)}}`;
    return { kerdes: T`<p>Melyik két szomszédos egész szám közé esik a következő szám? Add meg a kisebbiket! (Számológép nélkül!)</p>\[${L} ${nt(N)}\]`, valasz: { ertekek: [n] }, formatum: 'egész szám',
      tipp: T`Keresd meg, \(${b}\) melyik két szomszédos egész kitevős hatványa közé esik a szám. A ${L === T`\lg` ? 'tízes alapú ' : ''}logaritmusfüggvény szigorúan nő.`,
      megoldas: [T`\[${b}^{${n}}=${fT(lo)}<${nt(N)}<${fT(hi)}=${b}^{${n + 1}}\]`, T`A függvény szigorúan nő, ezért \(${n}<${L} ${nt(N)}<${n + 1}\).`] };
  } };

  Tananyag.fejezet({
    id: 'logfv',
    cim: 'A logaritmusfüggvény',
    rovid: 'Logaritmusfüggvény',
    grafikon: 'log',
    bevezeto: T`A logₐ x függvény az aˣ inverze: grafikonjaik egymás tükörképei az y = x egyenesre.`,
    elmelet: T`<div class="tbl"><table><thead><tr><th>Tulajdonság</th><th>a &gt; 1 (pl. log₂ x)</th><th>0 &lt; a &lt; 1 (pl. log₁/₂ x)</th></tr></thead><tbody>
<tr><td>Értelmezési tartomány</td><td>pozitív valós számok</td><td>pozitív valós számok</td></tr>
<tr><td>Értékkészlet</td><td>minden valós szám</td><td>minden valós szám</td></tr>
<tr><td>Monotonitás</td><td>szigorúan növekvő</td><td>szigorúan csökkenő</td></tr>
<tr><td>Zérushely</td><td>x = 1</td><td>x = 1</td></tr>
<tr><td>Nevezetes pontok</td><td>(1; 0) és (a; 1)</td><td>(1; 0) és (a; 1)</td></tr>
<tr><td>Aszimptota</td><td>x = 0 (y tengely)</td><td>x = 0 (y tengely)</td></tr></tbody></table></div>
<div class="prose"><ul>
<li>A szigorú monotonitás miatt: \(\log_a x=\log_a y\iff x=y\) \((x,y>0)\).</li>
<li>Eltoláskor az <b>értelmezési tartomány is változik</b>: \(\log_2(x-3)\) csak \(x>3\) esetén értelmezett, aszimptotája \(x=3\).</li>
<li>\(\log_{1/2}x=-\log_2 x\): a két grafikon egymás tükörképe az \(x\) tengelyre.</li></ul></div>`,
    igazHamis: [
    { allitas: T`\(\log_2 x\) értelmezési tartománya a pozitív számok halmaza.`, igaz: true, miert: T`Csak pozitív számnak van logaritmusa.` },
    { allitas: T`\(\log_{1/2}x\) szigorúan növekvő.`, igaz: false, miert: T`Az alap 0 és 1 közé esik, ezért szigorúan csökkenő.` },
    { allitas: T`\(\log_2(x-3)\) aszimptotája az \(x=3\) egyenes.`, igaz: true, miert: T`\(x-3>0\Rightarrow x>3\); a grafikon a \(x=3\) egyeneshez simul.` },
    { allitas: T`Minden \(\log_a x\) grafikonja átmegy az \((1;0)\) ponton.`, igaz: true, miert: T`\(\log_a 1=0\) minden megengedett alapra.` },
    { allitas: T`\(\log_3 x\) grafikonja átmegy a \((3;\,1)\) ponton.`, igaz: true, miert: T`\(\log_3 3=1\). Minden \(\log_a x\) grafikonja átmegy az \((a;\,1)\) ponton.` },
    { allitas: T`\(\lg 50\) értéke 1 és 2 közé esik.`, igaz: true, miert: T`\(10<50<100\), és az \(\lg\) szigorúan nő, így \(1<\lg 50<2\).` },
    { allitas: T`\(\log_2(-x)\) értelmezési tartománya a negatív számok halmaza.`, igaz: true, miert: T`\(-x>0\iff x<0\).` },
    { allitas: T`\(\log_2 x\) és \(2^x\) grafikonja egymás tükörképe az \(x\) tengelyre.`, igaz: false, miert: T`Inverz függvények: grafikonjuk az \(y=x\) egyenesre tükrös.` },
    { allitas: T`\(\log_{\frac13}5>\log_{\frac13}4\)`, igaz: false, miert: T`Az alap 1-nél kisebb, a függvény csökkenő: \(5>4\) miatt \(\log_{1/3}5<\log_{1/3}4\).` }
    ],
    mintapelda: {
      feladat: T`Ábrázold és jellemezd: \(f(x)=\log_2(x+4)-1\)`,
      lepesek: [
      T`Alapfüggvény: \(\log_2 x\); eltolás a \(\mathbf v(-4;\,-1)\) vektorral (4-gyel balra, 1-gyel le).`,
      T`Értelmezési tartomány: \(x+4>0\Rightarrow x>-4\). Aszimptota: \(x=-4\).`,
      T`Zérushely: \(\log_2(x+4)=1\Rightarrow x+4=2\Rightarrow x=-2\).`,
      T`\(y\) tengelymetszet: \(f(0)=\log_2 4-1=1\).`,
      T`Szigorúan növekvő, értékkészlete minden valós szám. Próbáld ki lent: alap 2, u = −4, v = −1.`
      ]
    },
    feladatok
  });
})();
