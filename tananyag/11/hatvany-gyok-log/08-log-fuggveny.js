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
    { allitas: T`Minden \(\log_a x\) grafikonja átmegy az \((1;0)\) ponton.`, igaz: true, miert: T`\(\log_a 1=0\) minden megengedett alapra.` }
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
