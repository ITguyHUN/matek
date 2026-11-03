/*
 * 4. fejezet – Az exponenciális függvény
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  const EXPB = [{ t: '2', n: 2, d: 1 }, { t: '3', n: 3, d: 1 }, { t: T`\left(\frac{1}{2}\right)`, n: 1, d: 2 }];
  feladatok.expjell = { nev: 'Függvény jellemzése', general() {
    const A = P(EXPB); const u = R(-2, 2); const kind = R(0, 2); let v, k;
    if (kind === 2) { k = A.n === 2 ? R(0, 3) : A.n === 3 ? R(0, 2) : R(-3, 0); v = -fv(fpow(F(A.n, A.d), k)); } else v = R(-3, 3);
    const f = T`f(x)=${A.t}^{${xs(-u)}}${pt(v)}`;
    if (kind === 0) return { kerdes: T`<p>Mi a grafikon vízszintes aszimptotájának egyenlete? Add meg a hiányzó számot!</p>\[${f}\qquad y=\square\]`, valasz: { ertekek: [v] }, formatum: 'egész szám',
      tipp: T`Az \(a^x\) aszimptotája az \(y=0\) egyenes. A függőleges eltolás az aszimptotát is eltolja.`,
      megoldas: [T`Az alapfüggvény aszimptotája \(y=0\). A \(${pt(v) || '+0'}\) tag \(${Math.abs(v)}\)-vel ${v >= 0 ? 'felfelé' : 'lefelé'} tolja a grafikont, így az aszimptota: \(y=${v}\).`] };
    if (kind === 1) { const val = fadd(fpow(F(A.n, A.d), -u), F(v));
      return { kerdes: T`<p>Hol metszi a grafikon az \(y\) tengelyt? Számítsd ki \(f(0)\)-t!</p>\[${f}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
        tipp: 'Helyettesíts x helyére 0-t.',
        megoldas: [T`\[f(0)=${A.t}^{${-u}}${pt(v)}=${ft(fpow(F(A.n, A.d), -u))}${pt(v)}=${ft(val)}\]`] }; }
    return { kerdes: T`<p>Hol van a függvény zérushelye?</p>\[${f}\qquad x=\square\]`, valasz: { ertekek: [u + k] }, formatum: 'egész szám',
      tipp: 'A zérushelyen f(x) = 0. Rendezd az egyenletet, majd hozd közös alapra.',
      megoldas: [T`\[${A.t}^{${xs(-u)}}=${-v}=${A.t}^{${k}}\]`, T`\[${xs(-u)}=${k}\quad\Rightarrow\quad x=${u + k}\]`] };
  } };

  feladatok.expossz = { nev: 'Melyik nagyobb?', general() {
    const B = P([{ t: '2', v: 2 }, { t: '3', v: 3 }, { t: T`0{,}5`, v: .5 }, { t: T`\left(\frac{2}{3}\right)`, v: 2 / 3 }, { t: T`1{,}5`, v: 1.5 }]);
    const L = [-2, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3]; const p = P(L); let q = P(L); while (q === p) q = P(L);
    const gt = (B.v > 1) === (p > q); const correct = gt ? 2 : 0;
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${B.t}^{${nt(p)}}\;\square\;${B.t}^{${nt(q)}}\]`, valasz: { valasztas: ['<', '=', '>'], helyes: correct },
      tipp: 'Ha az alap nagyobb 1-nél, a függvény szigorúan nő: nagyobb kitevő → nagyobb érték. Ha az alap 0 és 1 közé esik, fordítva.',
      megoldas: [T`Az alap \(${B.t}\) ${B.v > 1 ? 'nagyobb 1-nél, így a függvény szigorúan növekvő' : '0 és 1 közé esik, így a függvény szigorúan csökkenő'}. Mivel \(${nt(p)}${p > q ? '>' : '<'}${nt(q)}\), ezért \(${B.t}^{${nt(p)}}${gt ? '>' : '<'}${B.t}^{${nt(q)}}\).`] };
  } };

  Tananyag.fejezet({
    id: 'expfv',
    cim: 'Az exponenciális függvény',
    rovid: 'Exponenciális függvény',
    grafikon: 'exp',
    bevezeto: T`Az f(x) = aˣ (a > 0, a ≠ 1) függvény szigorúan monoton. Ebből következik az exponenciális egyenletek alaptétele.`,
    elmelet: T`<div class="mathbox">\[a^{x}=a^{y}\iff x=y\qquad (a>0,\ a\ne 1)\]</div>
<div class="tbl"><table><thead><tr><th>Tulajdonság</th><th>a &gt; 1 (pl. 2ˣ)</th><th>0 &lt; a &lt; 1 (pl. (1/2)ˣ)</th></tr></thead><tbody>
<tr><td>Értelmezési tartomány</td><td>minden valós szám</td><td>minden valós szám</td></tr>
<tr><td>Értékkészlet</td><td>pozitív valós számok</td><td>pozitív valós számok</td></tr>
<tr><td>Monotonitás</td><td>szigorúan növekvő</td><td>szigorúan csökkenő</td></tr>
<tr><td>Zérushely, szélsőérték</td><td>nincs</td><td>nincs</td></tr>
<tr><td>Nevezetes pont</td><td>(0; 1)</td><td>(0; 1)</td></tr>
<tr><td>Aszimptota</td><td>y = 0 (balra)</td><td>y = 0 (jobbra)</td></tr></tbody></table></div>
<div class="prose"><ul>
<li>\(g(x)=a^{x-u}+v\): eltolás a \(\mathbf{v}(u;\,v)\) vektorral. Vigyázz: \(x-u\) esetén <b>jobbra</b>, \(x+u\) esetén <b>balra</b> tolunk!</li>
<li>Az aszimptota is eltolódik: \(y=v\); az értékkészlet a \(v\)-nél nagyobb számok halmaza.</li>
<li>\(a^x\) és \((1/a)^x\) grafikonja egymás tükörképe az \(y\) tengelyre.</li></ul></div>`,
    igazHamis: [
    { allitas: T`A \(0{,}5^x\) függvény szigorúan csökkenő.`, igaz: true, miert: T`Az alap 0 és 1 közé esik, így a függvény csökken.` },
    { allitas: T`Az \(a^x\) függvénynek van zérushelye.`, igaz: false, miert: T`aˣ minden x-re pozitív, ezért sosem nulla.` },
    { allitas: T`A \(2^x+1\) értékkészlete a pozitív számok halmaza.`, igaz: false, miert: T`Az eltolás miatt az értékkészlet az 1-nél nagyobb számok halmaza.` },
    { allitas: T`\(2^{x-3}\) grafikonja a \(2^x\) grafikonja 3-mal balra tolva.`, igaz: false, miert: T`\(x-3\) esetén <b>jobbra</b> tolunk 3-mal.` }
    ],
    mintapelda: {
      feladat: T`Ábrázold és jellemezd: \(f(x)=2^{x-1}-4\)`,
      lepesek: [
      T`Alapfüggvény: \(2^x\); eltolás a \(\mathbf v(1;\,-4)\) vektorral (1-gyel jobbra, 4-gyel le).`,
      T`Aszimptota: \(y=-4\); értékkészlet: a \(-4\)-nél nagyobb valós számok.`,
      T`Zérushely: \(2^{x-1}=4=2^2\Rightarrow x-1=2\Rightarrow x=3\).`,
      T`\(y\) tengelymetszet: \(f(0)=2^{-1}-4=-3{,}5\).`,
      T`Szigorúan növekvő, szélsőértéke nincs. Próbáld ki lent a grafikonrajzolóval: alap 2, u = 1, v = −4.`
      ]
    },
    feladatok
  });
})();
