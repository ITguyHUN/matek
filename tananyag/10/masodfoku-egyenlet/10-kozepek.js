/*
 * 10. fejezet – A számtani és a mértani közép
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 8. lecke; FGY 2212–2216)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, kulonbozo, az, Az, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;
  const MT = (a, b) => Math.sqrt(a * b);

  feladatok.kozepek = { nev: 'Két szám közepei', general() {
    // a = m·u², b = m·v² → mértani közép m·u·v egész
    let m, u, v; do { m = P([1, 1, 2, 3, 5, 6, 7, 10]); [u, v] = kulonbozo(2, 1, 9); } while (m * Math.max(u, v) ** 2 > 2100);
    const a = m * u * u, b = m * v * v; const A = F(a + b, 2), G = m * u * v; const t = R(0, 2);
    const x = Math.min(a, b), y = Math.max(a, b);
    const ans = t === 0 ? fv(A) : t === 1 ? G : fv(A) - G;
    const kerdes = t < 2 ? T`<p>Határozd meg ${az(x)} \(${x}\) és ${az(y)} \(${y}\) ${t === 0 ? 'számtani' : 'mértani'} közepét!</p>`
      : T`<p>Mennyivel nagyobb ${az(x)} \(${x}\) és ${az(y)} \(${y}\) számtani közepe a mértani közepüknél?</p>`;
    return { kerdes,
      valasz: { ertekek: [ans] }, formatum: FMT10.tort,
      tipp: T`Számtani közép: \(A=\frac{a+b}{2}\); mértani közép: \(G=\sqrt{ab}\).`,
      megoldas: [T`\[A=\frac{${a}+${b}}{2}=${ft(A)},\qquad G=\sqrt{${a}\cdot ${b}}=\sqrt{${a * b}}=${G}\]`, t === 2 ? T`\(A-G=${ft(A)}-${G}=${ft(F(a + b - 2 * G, 2))}\)` : ''].filter(Boolean),
      _ell: w => egy(w, [(a + b) / 2, MT(a, b), (a + b) / 2 - MT(a, b)][t]) };
  } };

  feladatok.hianyzo = { nev: 'A hiányzó szám', general() {
    const t = R(0, 1);
    if (t === 0) { const a = R(2, 60), A = R(2, 60); const b = 2 * A - a; if (b === a || b <= 0 && R(0, 2)) return feladatok.hianyzo.general();
      return { kerdes: T`<p>Két szám számtani közepe \(${A}\), az egyik szám \(${a}\). Mennyi a másik szám?</p>`, valasz: { ertekek: [b] }, formatum: FMT10.egesz,
        tipp: T`\(\frac{${a}+x}{2}=${A}\)`, megoldas: [T`\[\frac{${a}+x}{2}=${A}\quad\Rightarrow\quad x=2\cdot${A}-${a}=${b}\]`], _ell: w => egy((a + w) / 2, A) }; }
    // G² = a·b; néha tört eredmény
    const G = R(3, 40); let a; const osztok = []; for (let d = 2; d < G * G; d++) if ((G * G) % d === 0 && d !== G) osztok.push(d);
    a = osztok.length && R(0, 2) ? P(osztok) : R(2, 2 * G);
    if (a === G) a++;
    const b = F(G * G, a);
    return { kerdes: T`<p>Két pozitív szám mértani közepe \(${G}\), az egyik szám \(${a}\). Mennyi a másik szám?</p>`, valasz: { ertekek: [fv(b)] }, formatum: FMT10.tort,
      tipp: T`\(\sqrt{${a}\cdot x}=${G}\Rightarrow ${a}x=${G}^2\).`, megoldas: [T`\[\sqrt{${a}x}=${G}\quad\Rightarrow\quad ${a}x=${G * G}\quad\Rightarrow\quad x=${ft(b)}\]`],
      _ell: w => egy(Math.sqrt(a * w), G) };
  } };

  feladatok.negyzet = { nev: 'Téglalap és négyzet', general() {
    let u, v, m; do { m = P([1, 2, 3, 4, 5]); [u, v] = kulonbozo(2, 1, 9); } while (m * Math.max(u, v) ** 2 > 200);
    const a = m * u * u, b = m * v * v; const t = R(0, 2);
    if (t === 0) return { kerdes: T`<p>Egy téglalap oldalai \(${a}\) cm és \(${b}\) cm. Mekkora annak a négyzetnek az oldala (cm-ben), amelynek <b>területe</b> egyenlő a téglalap területével?</p>`,
      valasz: { ertekek: [m * u * v] }, formatum: 'szám (cm)', tipp: 'A négyzet oldala a két téglalapoldal mértani közepe.',
      megoldas: [T`\[x^2=${a}\cdot${b}=${a * b}\quad\Rightarrow\quad x=\sqrt{${a * b}}=${m * u * v}\ \text{cm}\]`], _ell: w => egy(w * w, a * b) };
    if (t === 1) return { kerdes: T`<p>Egy téglalap oldalai \(${a}\) cm és \(${b}\) cm. Mekkora annak a négyzetnek az oldala (cm-ben), amelynek <b>kerülete</b> egyenlő a téglalap kerületével?</p>`,
      valasz: { ertekek: [(a + b) / 2] }, formatum: 'szám (cm)', tipp: 'A négyzet oldala a két téglalapoldal számtani közepe.',
      megoldas: [T`\[4x=2\cdot(${a}+${b})\quad\Rightarrow\quad x=\frac{${a}+${b}}{2}=${nt((a + b) / 2)}\ \text{cm}\]`], _ell: w => egy(4 * w, 2 * (a + b)) };
    return { kerdes: T`<p>Egy \(${m * u * v}\) cm oldalú négyzettel egyenlő területű téglalap egyik oldala \(${a}\) cm. Hány cm a téglalap másik oldala?</p>`,
      valasz: { ertekek: [b] }, formatum: 'szám (cm)', tipp: 'A két terület egyenlő: a négyzet területét oszd el a téglalap ismert oldalával.',
      megoldas: [T`\[${m * u * v}^2=${a}\cdot x\quad\Rightarrow\quad x=\frac{${(m * u * v) ** 2}}{${a}}=${b}\ \text{cm}\]`], _ell: w => egy(a * w, (m * u * v) ** 2) };
  } };

  const SEB = [[40, 60], [60, 90], [80, 120], [30, 60], [60, 120], [45, 90], [36, 45], [70, 105], [50, 75], [90, 60], [100, 150], [20, 30], [60, 40], [84, 140], [72, 90]];
  feladatok.atlagseb = { nev: 'Átlagsebesség', general() {
    const t = R(0, 2);
    if (t === 0) { let [v1, v2] = P(SEB); if (R(0, 1)) [v1, v2] = [v2, v1]; const h = F(2 * v1 * v2, v1 + v2);
      return { kerdes: T`<p>Egy autó az út első felét \(${v1}\,\frac{\text{km}}{\text{h}}\), a második felét \(${v2}\,\frac{\text{km}}{\text{h}}\) sebességgel tette meg. Mekkora volt az átlagsebessége (km/h)?</p>`,
        valasz: { ertekek: [fv(h)], tol: 0.006 }, formatum: 'szám (km/h), ha kell, két tizedesre kerekítve',
        tipp: T`Az átlagsebesség = teljes út / teljes idő. Legyen a fél út \(s\) km. (Nem a két sebesség számtani közepe!)`,
        megoldas: [T`\[t=\frac{s}{${v1}}+\frac{s}{${v2}},\qquad v_{\text{átl}}=\frac{2s}{\frac{s}{${v1}}+\frac{s}{${v2}}}=\frac{2\cdot${v1}\cdot${v2}}{${v1}+${v2}}=${ft(h)}\]`, 'Ez a két sebesség harmonikus közepe.'],
        _ell: w => Math.abs(w - 2 * v1 * v2 / (v1 + v2)) < 0.006 }; }
    if (t === 1) { const v1 = 10 * R(3, 12), v2 = 10 * R(3, 12), t1 = R(1, 3), t2 = R(1, 4); const v = F(v1 * t1 + v2 * t2, t1 + t2);
      return { kerdes: T`<p>Egy autó \(${t1}\) órán át \(${v1}\,\frac{\text{km}}{\text{h}}\), majd \(${t2}\) órán át \(${v2}\,\frac{\text{km}}{\text{h}}\) sebességgel haladt. Mekkora volt az átlagsebessége (km/h)?</p>`,
        valasz: { ertekek: [fv(v)], tol: 0.006 }, formatum: 'szám (km/h), ha kell, két tizedesre kerekítve',
        tipp: 'Átlagsebesség = teljes út / teljes idő.', megoldas: [T`\[v_{\text{átl}}=\frac{${t1}\cdot${v1}+${t2}\cdot${v2}}{${t1}+${t2}}=\frac{${v1 * t1 + v2 * t2}}{${t1 + t2}}${fv(v) === Math.round(fv(v)) ? '' : T`\approx`}${fv(v) === Math.round(fv(v)) ? '=' + fv(v) : nt(+fv(v).toFixed(2))}\]`],
        _ell: w => Math.abs(w - fv(v)) < 0.006 }; }
    // út: s km, megtette t óra perc alatt
    const s = 10 * R(5, 30), perc = 15 * R(4, 16); const v = F(s * 60, perc);
    return { kerdes: T`<p>Egy autó \(${s}\) km-t tett meg ${Math.floor(perc / 60)} óra ${perc % 60 ? perc % 60 + ' perc' : ''} alatt. Mennyi volt az átlagsebessége (km/h)?</p>`,
      valasz: { ertekek: [fv(v)], tol: 0.006 }, formatum: 'szám (km/h), ha kell, két tizedesre kerekítve',
      tipp: 'Váltsd át az időt órára: 1 perc = 1/60 óra.', megoldas: [T`\[t=\frac{${perc}}{60}\ \text{h}=${ft(F(perc, 60))}\ \text{h},\qquad v=\frac{${s}}{${ft(F(perc, 60))}}=${nt(+fv(v).toFixed(2))}\ \frac{\text{km}}{\text{h}}\]`],
      _ell: w => Math.abs(w - fv(v)) < 0.006 };
  } };

  feladatok.szazalek = { nev: 'Átlagos százalékos változás', general() {
    const no = R(0, 1) === 1; const p1 = R(2, 25), p2 = R(2, 25);
    const q1 = no ? 1 + p1 / 100 : 1 - p1 / 100, q2_ = no ? 1 + p2 / 100 : 1 - p2 / 100;
    const g = Math.sqrt(q1 * q2_); const pct = Math.abs(g - 1) * 100;
    const ans = +pct.toFixed(2);
    const mi = P(['Egy üzem termelése', 'Egy termék ára', 'Egy város lakossága', 'A benzin ára']);
    return { kerdes: T`<p>${mi} az első évben \(${p1}\%\)-kal, a másodikban \(${p2}\%\)-kal ${no ? 'nőtt' : 'csökkent'}. Átlagosan hány százalékkal ${no ? 'nőtt' : 'csökkent'} évente? (Két tizedesjegyre kerekítve add meg a százalékot.)</p>`,
      valasz: { ertekek: [ans], tol: 0.006, forma: 'tizedes' }, formatum: 'szám (százalék), két tizedesre, pl. 12,36',
      tipp: T`Ugyanazt a végeredményt kell kapni, ha mindkét évben ugyanannyi a változás: \(q^2=${nt(q1)}\cdot${nt(q2_)}\). Ez a változási tényezők <b>mértani</b> közepe.`,
      megoldas: [T`\[q=\sqrt{${nt(q1)}\cdot ${nt(q2_)}}=\sqrt{${nt(+(q1 * q2_).toFixed(6))}}\approx ${nt(+g.toFixed(4))}\]`, T`Az átlagos évi ${no ? 'növekedés' : 'csökkenés'}: \(\approx ${nt(ans)}\%\).`],
      _ell: w => Math.abs(w - pct) <= 0.0051 };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mkozep',
    cim: 'A számtani és a mértani közép',
    rovid: 'Közepek',
    bevezeto: T`Két pozitív szám számtani közepe sosem kisebb a mértani közepüknél. Ez az egyszerű egyenlőtlenség sok szélsőérték-feladat kulcsa.`,
    elmelet: T`<div class="mathbox">\[A=\frac{a+b}{2}\qquad G=\sqrt{ab}\qquad (a,b\ge0)\]</div>
<div class="mathbox">\[\frac{a+b}{2}\ge\sqrt{ab},\quad\text{egyenlőség pontosan akkor, ha } a=b\]</div>
<div class="prose"><ul>
<li><b>Bizonyítás:</b> \(\left(\sqrt a-\sqrt b\right)^2\ge0\Rightarrow a-2\sqrt{ab}+b\ge0\Rightarrow\frac{a+b}{2}\ge\sqrt{ab}\).</li>
<li><b>Geometria:</b> az \(a\), \(b\) oldalú téglalappal egyenlő területű négyzet oldala \(\sqrt{ab}\); egyenlő kerületűé \(\frac{a+b}2\).</li>
<li><b>Átlagos százalékos változás:</b> a változási tényezők mértani közepe (pl. \(+20\%\), majd \(-4\%\): \(\sqrt{1{,}2\cdot0{,}96}\)).</li>
<li><b>Átlagsebesség</b> egyenlő hosszú útszakaszokra: a harmonikus közép \(\frac{2v_1v_2}{v_1+v_2}\) – nem a számtani közép!</li>
<li>Adott összegű két pozitív szám szorzata akkor a legnagyobb, ha a két szám egyenlő.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Két pozitív szám mértani közepe nem lehet nagyobb a számtani közepüknél.`, igaz: true, miert: T`\(\frac{a+b}{2}\ge\sqrt{ab}\).` },
      { allitas: T`A 4 és a 9 mértani közepe 6,5.`, igaz: false, miert: T`\(\sqrt{36}=6\); a 6,5 a számtani közép.` },
      { allitas: T`Ha az út első felét 40, a másodikat 60 km/h-val tesszük meg, az átlagsebesség 50 km/h.`, igaz: false, miert: T`\(\frac{2\cdot40\cdot60}{100}=48\) km/h – a lassabb szakaszon több időt töltünk.` },
      { allitas: T`Adott kerületű téglalapok közül a négyzet területe a legnagyobb.`, igaz: true, miert: T`Az oldalak összege állandó, és \(ab\le\left(\frac{a+b}{2}\right)^2\), egyenlőség \(a=b\) esetén.` },
      { allitas: T`Ha \(a=b\), akkor \(\frac{a+b}{2}=\sqrt{ab}\).`, igaz: true, miert: T`\(\frac{2a}{2}=a=\sqrt{a^2}\) (\(a\ge0\)).` },
      { general() { const u = R(1, 6), v = R(1, 6); const a = u * u, b = v * v; const jo = R(0, 1) === 1;
        return { allitas: T`${Az(a)} \(${a}\) és ${az(b)} \(${b}\) mértani közepe \(${jo ? u * v : (a + b) / 2}\).`, igaz: jo || u * v === (a + b) / 2, miert: T`\(\sqrt{${a}\cdot${b}}=${u * v}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy 2 m hosszú fonalból téglalapot formázunk. Mikor lesz a területe a legnagyobb?`,
      lepesek: [
        T`Az oldalak: \(x\) és \(1-x\) (méterben), összegük állandó: \(1\).`,
        T`A terület \(x(1-x)\), ami a két oldal mértani közepének négyzete.`,
        T`\(\sqrt{x(1-x)}\le\frac{x+(1-x)}{2}=\frac12\), egyenlőség \(x=1-x\), azaz \(x=\frac12\) esetén.`,
        T`A legnagyobb terület \(\frac14\ \text{m}^2\): a négyzet.`
      ]
    },
    feladatok
  }));
})();
