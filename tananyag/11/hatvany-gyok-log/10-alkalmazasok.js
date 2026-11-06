/*
 * 10. fejezet – Gyakorlati alkalmazások
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.kamat = { nev: 'Kamatos kamat', general() {
    const T0 = R(2, 20) * 50000, p = R(2, 8), q = 1 + p / 100;
    if (R(0, 1) === 0) { const n = R(2, 10); const val = T0 * q ** n;
      return { kerdes: `<p>${big(T0)} Ft-ot beteszünk a bankba évi ${p}%-os kamatos kamatra. Mennyi pénzünk lesz ${n} év múlva? (Ft-ra kerekítve)</p>`,
        valasz: { ertekek: [Math.round(val)], tolRel: 0.0005 }, formatum: 'egész szám (Ft)',
        tipp: T`\(T_n=T_0\cdot\left(1+\frac{p}{100}\right)^{n}\)`,
        megoldas: [T`\[T_{${n}}=${bigT(T0)}\cdot ${nt(q)}^{${n}}\approx ${bigT(val)}\ \text{Ft}\]`] }; }
    const m = P([1.5, 2, 3]); const ex = Math.log(m) / Math.log(q); const n = Math.ceil(ex);
    return { kerdes: `<p>${big(T0)} Ft-ot beteszünk a bankba évi ${p}%-os kamatos kamatra. Hány év múlva éri el vagy haladja meg először a pénzünk a ${big(T0 * m)} Ft-ot?</p>`,
      valasz: { ertekek: [n] }, formatum: 'egész szám (év)',
      tipp: T`Írd fel: \(${bigT(T0)}\cdot ${nt(q)}^{n}\ge ${bigT(T0 * m)}\). Oszd el, majd vegyél logaritmust. A végén felfelé kerekíts!`,
      megoldas: [T`\[${nt(q)}^{n}\ge ${nt(m)}\quad\Rightarrow\quad n\ge\frac{\lg ${nt(m)}}{\lg ${nt(q)}}\approx ${nt(+ex.toFixed(2))}\]`, `Tehát ${n} év múlva.`] };
  } };

  feladatok.csokk = { nev: 'Értékcsökkenés', general() {
    const V0 = R(3, 12) * 1000000; const p = P([5, 8, 10, 12, 15, 20]); const q = 1 - p / 100;
    if (R(0, 1) === 0) { const n = R(2, 6); const val = V0 * q ** n;
      return { kerdes: `<p>Egy ${big(V0)} Ft-os autó értéke évente ${p}%-kal csökken. Mennyit ér ${n} év múlva? (Ft-ra kerekítve)</p>`,
        valasz: { ertekek: [Math.round(val)], tolRel: 0.0005 }, formatum: 'egész szám (Ft)',
        tipp: T`Csökkenésnél a szorzó \(q=1-\frac{p}{100}=${nt(q)}\).`,
        megoldas: [T`\[${bigT(V0)}\cdot ${nt(q)}^{${n}}\approx ${bigT(val)}\ \text{Ft}\]`] }; }
    const ex = Math.log(0.5) / Math.log(q); const n = Math.floor(ex) + 1;
    return { kerdes: `<p>Egy ${big(V0)} Ft-os autó értéke évente ${p}%-kal csökken. Hány év múlva ér először kevesebbet, mint az eredeti ár fele?</p>`,
      valasz: { ertekek: [n] }, formatum: 'egész szám (év)',
      tipp: T`\(${nt(q)}^{n}<0{,}5\). Logaritmus után vigyázz: \(\lg ${nt(q)}\) negatív, osztáskor megfordul a reláció!`,
      megoldas: [T`\[n>\frac{\lg 0{,}5}{\lg ${nt(q)}}\approx ${nt(+ex.toFixed(2))}\]`, `Tehát ${n} év múlva.`] };
  } };

  feladatok.felez = { nev: 'Felezési idő', general() {
    const Th = P([3, 5, 8, 10, 12, 20]); const N0 = P([80, 100, 160, 200, 320, 400, 640]);
    if (R(0, 1) === 0) { const k = R(1, 5); const t = Th * k; const val = N0 / 2 ** k;
      return { kerdes: `<p>Egy radioaktív izotóp felezési ideje ${Th} nap. Kezdetben ${N0} mg van belőle. Hány mg marad ${t} nap múlva?</p>`,
        valasz: { ertekek: [val], tol: 0.01 }, formatum: 'szám (mg)',
        tipp: `${t} nap alatt hányszor feleződik a mennyiség?`,
        megoldas: [T`\(${t}:${Th}=${k}\) felezés: \[${N0}\cdot\left(\frac{1}{2}\right)^{${k}}=${nt(val)}\ \text{mg}\]`] }; }
    const f = P([0.2, 0.1, 0.3, 0.05]); const t = Th * Math.log(f) / Math.log(0.5);
    return { kerdes: `<p>Egy radioaktív izotóp felezési ideje ${Th} nap. Hány nap múlva marad belőle az eredeti mennyiség ${hu(f * 100)}%-a? (egy tizedesjegyre kerekítve)</p>`,
      valasz: { ertekek: [+t.toFixed(1)], tol: 0.051, forma: 'tizedes' }, formatum: 'tizedes tört, pl. 34,6',
      tipp: T`\(\left(\frac12\right)^{t/${Th}}=${nt(f)}\). Vegyél logaritmust!`,
      megoldas: [T`\[\frac{t}{${Th}}=\frac{\lg ${nt(f)}}{\lg 0{,}5}\quad\Rightarrow\quad t\approx ${nt(+t.toFixed(1))}\ \text{nap}\]`] };
  } };

  feladatok.skala = { nev: 'Logaritmikus skálák (pH, dB, Richter)', general() {
    const kind = R(0, 4);
    if (kind === 0) { const m = P([1, 2, 2.5, 3, 3.2, 4, 5, 6, 6.3, 8]); const k = R(2, 12); const c = m * 10 ** -k; const ph = -Math.log10(c);
      return { kerdes: T`<p>Egy oldat pH-értéke \(\mathrm{pH}=-\lg\left[\mathrm{H}^{+}\right]\), ahol \(\left[\mathrm{H}^{+}\right]\) az oxóniumion-koncentráció mol/dm³-ben. Mennyi a pH, ha \(\left[\mathrm{H}^{+}\right]=${nt(m)}\cdot 10^{-${k}}\)? (Két tizedesjegyre kerekítve)</p>`,
        valasz: { ertekek: [+ph.toFixed(2)], tol: 0.006, forma: 'tizedes' }, formatum: 'tizedes tört, pl. 4,52',
        tipp: T`\(\lg\left(a\cdot 10^{-k}\right)=\lg a-k\).`,
        megoldas: [T`\[\mathrm{pH}=-\lg\left(${nt(m)}\cdot 10^{-${k}}\right)=-\left(\lg ${nt(m)}-${k}\right)=${k}-\lg ${nt(m)}\approx ${nt(+ph.toFixed(2))}\]`] }; }
    if (kind === 1) { const a = R(1, 6), d = R(1, 4); const b = a + d;
      return { kerdes: `<p>Az egyik oldat pH-ja ${a}, a másiké ${b}. Hányszor nagyobb az első oldat oxóniumion-koncentrációja, mint a másodiké? (pH = −lg [H⁺])</p>`,
        valasz: { ertekek: [10 ** d] }, formatum: 'egész szám',
        tipp: T`\(\left[\mathrm{H}^{+}\right]=10^{-\mathrm{pH}}\). Egy egységnyi pH-különbség tízszeres koncentrációt jelent.`,
        megoldas: [T`\[\frac{10^{-${a}}}{10^{-${b}}}=10^{${b}-${a}}=10^{${d}}=${bigT(10 ** d)}\]`] }; }
    if (kind === 2) { const f = P([2, 3, 4, 5, 8, 20, 50, 200, 500]); const dL = 10 * Math.log10(f);
      return { kerdes: T`<p>A hangerősségszint \(L=10\cdot\lg\dfrac{I}{I_0}\) decibel, ahol \(I\) a hang intenzitása. Hány decibellel nő a hangerősségszint, ha az intenzitás a ${{ 2: 'kétszeresére', 3: 'háromszorosára', 4: 'négyszeresére', 5: 'ötszörösére', 8: 'nyolcszorosára', 20: 'hússzorosára', 50: 'ötvenszeresére', 200: 'kétszázszorosára', 500: 'ötszázszorosára' }[f]} nő? (Egy tizedesjegyre kerekítve)</p>`,
        valasz: { ertekek: [+dL.toFixed(1)], tol: 0.051, forma: 'tizedes' }, formatum: 'tizedes tört (dB)',
        tipp: T`\(10\lg\dfrac{${f}I}{I_0}-10\lg\dfrac{I}{I_0}=10\lg ${f}\).`,
        megoldas: [T`\[\Delta L=10\lg\frac{${f}I}{I_0}-10\lg\frac{I}{I_0}=10\lg ${f}\approx ${nt(+dL.toFixed(1))}\ \text{dB}\]`] }; }
    if (kind === 3) { const n = R(1, 5); const L1 = R(2, 6) * 10;
      return { kerdes: T`<p>A hangerősségszint \(L=10\cdot\lg\dfrac{I}{I_0}\) decibel. Egy ${L1} dB-es zajforrás helyett ${L1 + 10 * n} dB-es szól. Hányszorosára nőtt a hang intenzitása?</p>`,
        valasz: { ertekek: [10 ** n] }, formatum: 'egész szám',
        tipp: T`Ha \(L\) 10 dB-lel nő, az intenzitás tízszeresére nő.`,
        megoldas: [T`\[10\lg\frac{I_2}{I_1}=${10 * n}\quad\Rightarrow\quad \lg\frac{I_2}{I_1}=${n}\quad\Rightarrow\quad \frac{I_2}{I_1}=10^{${n}}=${bigT(10 ** n)}\]`] }; }
    const M1 = P([4, 4.5, 5, 5.5, 6, 6.5]); const d = P([0.5, 1, 1.5, 2, 2.5, 3]); const M2 = M1 + d; const ratio = 10 ** d;
    return { kerdes: T`<p>A földrengés Richter-skála szerinti erőssége \(M=\lg\dfrac{A}{A_0}\), ahol \(A\) a kitérés legnagyobb amplitúdója. Hányszorosa egy ${hu(M2)} erősségű földrengés amplitúdója egy ${hu(M1)} erősségűének? ${Number.isInteger(d) ? '' : '(Egészre kerekítve)'}</p>`,
      valasz: Number.isInteger(d) ? { ertekek: [ratio] } : { ertekek: [Math.round(ratio)], tol: 0.51 }, formatum: Number.isInteger(d) ? 'egész szám' : 'egész szám (kerekítve)',
      tipp: T`\(\lg\dfrac{A_2}{A_1}=M_2-M_1\).`,
      megoldas: [T`\[\lg\frac{A_2}{A_1}=${nt(M2)}-${nt(M1)}=${nt(d)}\quad\Rightarrow\quad \frac{A_2}{A_1}=10^{${nt(d)}}${Number.isInteger(d) ? '=' + bigT(ratio) : T`\approx ${Math.round(ratio)}`}\]`] };
  } };

  feladatok.szaporodas = { nev: 'Szaporodás, növekedés', general() {
    const kind = R(0, 2);
    if (kind === 0) { const Tg = P([15, 20, 22, 25, 30, 40]); const n = R(2, 10); const t = Tg * n;
      return { kerdes: T`<p>Egy baktériumpopuláció egyedszáma \(N(t)=N_0\cdot 2^{\frac{t}{${Tg}}}\) szerint nő, ahol \(t\) percben értendő. Hányszorosára nő a baktériumok száma ${t} perc alatt?</p>`,
        valasz: { ertekek: [2 ** n] }, formatum: 'egész szám',
        tipp: `${t} perc alatt hányszor duplázódik meg a populáció?`,
        megoldas: [T`\[\frac{N(${t})}{N_0}=2^{\frac{${t}}{${Tg}}}=2^{${n}}=${2 ** n}\]`] }; }
    if (kind === 1) { const N0 = P([300, 500, 800, 1000, 1500, 2000]); const N1 = P([10000, 20000, 50000, 100000, 1000000]); const h = P([1, 1, 2, 3]);
      const t = h * Math.log(N1 / N0) / Math.log(2);
      return { kerdes: `<p>Egy laboratóriumban ${big(N0)} baktériummal indul a tenyészet, és a baktériumok száma ${h === 1 ? 'óránként' : h + ' óránként'} megduplázódik. Hány óra múlva lesz az egyedszám ${big(N1)}? (Egy tizedesjegyre kerekítve)</p>`,
        valasz: { ertekek: [+t.toFixed(1)], tol: 0.051, forma: 'tizedes' }, formatum: 'tizedes tört (óra)',
        tipp: T`Írd fel: \(${bigT(N0)}\cdot 2^{${h === 1 ? 't' : T`t/${h}`}}=${bigT(N1)}\), oszd el, majd vegyél logaritmust.`,
        megoldas: [T`\[2^{${h === 1 ? 't' : T`\frac{t}{${h}}`}}=\frac{${bigT(N1)}}{${bigT(N0)}}=${ft(F(N1, N0))}\quad\Rightarrow\quad ${h === 1 ? 't' : T`\frac{t}{${h}}`}=\frac{\lg ${ft(F(N1, N0)).replace(/^\\frac/, '\\tfrac')}}{\lg 2}\quad\Rightarrow\quad t\approx ${nt(+t.toFixed(1))}\ \text{óra}\]`] }; }
    const p = P([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5]); const t = Math.log(2) / Math.log(1 + p / 100); const mi = P(['Egy város lakossága', 'Egy ország népessége', 'Egy erdő faállománya', 'Egy cég árbevétele']);
    return { kerdes: `<p>${mi} évente ${hu(p)}%-kal nő. Hány év alatt duplázódik meg? (Egy tizedesjegyre kerekítve)</p>`,
      valasz: { ertekek: [+t.toFixed(1)], tol: 0.051, forma: 'tizedes' }, formatum: 'tizedes tört (év)',
      tipp: T`\(\left(1+\frac{${nt(p)}}{100}\right)^{n}=2\), vegyél logaritmust.`,
      megoldas: [T`\[${nt(1 + p / 100)}^{n}=2\quad\Rightarrow\quad n=\frac{\lg 2}{\lg ${nt(1 + p / 100)}}\approx ${nt(+t.toFixed(1))}\ \text{év}\]`] };
  } };

  feladatok.atlagvalt = { nev: 'Átlagos évi változás', general() {
    const ctx = P([{ a: 'Egy város lakossága', u: 'fő', V: [20000, 35000, 50000, 80000, 120000] }, { a: 'Egy lakás ára', u: 'Ft', V: [20e6, 25e6, 32e6, 40e6] }, { a: 'Egy cég éves forgalma', u: 'Ft', V: [50e6, 80e6, 120e6, 200e6] }, { a: 'Egy autó értéke', u: 'Ft', V: [6e6, 8e6, 10e6, 12e6], csokk: true }]);
    const V0 = P(ctx.V); const n = R(3, 12); const ptrue = (ctx.csokk || R(0, 3) === 0 ? -1 : 1) * R(15, 90) / 10;
    const V1raw = V0 * (1 + ptrue / 100) ** n; const unit = V1raw > 1e6 ? 1e5 : 100; const V1 = Math.round(V1raw / unit) * unit;
    const q = (V1 / V0) ** (1 / n); const pp = (q - 1) * 100; const nov = pp > 0;
    return { kerdes: `<p>${ctx.a} ${n} év alatt ${big(V0)} ${ctx.u === 'fő' ? 'főről' : 'Ft-ról'} ${big(V1)} ${ctx.u === 'fő' ? 'főre' : 'Ft-ra'} ${nov ? 'nőtt' : 'csökkent'}. Átlagosan évente hány százalékkal ${nov ? 'nőtt' : 'csökkent'}? (Két tizedesjegyre kerekítve)</p>`,
      valasz: { ertekek: [+Math.abs(pp).toFixed(2)], tol: 0.006, forma: 'tizedes' }, formatum: 'tizedes tört (%), pl. 3,25',
      tipp: T`Ha az évi szorzó \(q\), akkor \(${bigT(V0)}\cdot q^{${n}}=${bigT(V1)}\). Fejezd ki \(q\)-t (${n}. gyököt vonsz), és \(p=(q-1)\cdot 100\).`,
      megoldas: [T`\[q^{${n}}=\frac{${bigT(V1)}}{${bigT(V0)}}\quad\Rightarrow\quad q=\sqrt[${n}]{\frac{${bigT(V1)}}{${bigT(V0)}}}\approx ${nt(+q.toFixed(5))}\]`, T`Az átlagos évi ${nov ? 'növekedés' : 'csökkenés'}: \(${nov ? '(q-1)' : '(1-q)'}\cdot 100\approx ${nt(+Math.abs(pp).toFixed(2))}\%\).`] };
  } };

  Tananyag.fejezet({
    id: 'alk',
    cim: 'Gyakorlati alkalmazások',
    rovid: 'Alkalmazások',
    bevezeto: T`A szöveges feladatok szinte mind ugyanarra a képletre épülnek: egy mennyiség egyenlő időközönként ugyanannyiszorosára változik.`,
    elmelet: T`<div class="mathbox">\[N(t)=N_0\cdot q^{t},\qquad q=1+\frac{p}{100}\ \text{(növekedés)},\qquad q=1-\frac{p}{100}\ \text{(csökkenés)}\]\[T_n=T_0\left(1+\frac{p}{100}\right)^{n}\ \text{(kamatos kamat)},\qquad N(t)=N_0\left(\frac12\right)^{t/T}\ \text{(felezési idő)}\]\[\text{pH}=-\lg[\text{H}^+],\qquad L=10\cdot\lg\frac{I}{I_0}\ \text{dB}\]</div>
<div class="prose"><ul><li>Ha a végérték a kérdés: helyettesíts be.</li>
<li>Ha az idő a kérdés: oszd el \(N_0\)-lal, majd vegyél logaritmust (9. fejezet D típus).</li>
<li>„Mikor haladja meg?” típusú kérdésnél felfelé kerekítünk. Ha \(q<1\), a \(\lg q\) negatív: osztáskor megfordul a reláció!</li></ul></div>`,
    igazHamis: [
    { allitas: T`Évi 5%-os kamatos kamatnál 3 év alatt a tőke 15%-kal nő.`, igaz: false, miert: T`\(1{,}05^3\approx 1{,}1576\), tehát kb. 15,76%-kal: a kamat is kamatozik.` },
    { allitas: T`8 napos felezési idő mellett 24 nap múlva az eredeti mennyiség 1/8-a marad.`, igaz: true, miert: T`24 nap = 3 felezés: \(\left(\frac12\right)^3=\frac18\).` },
    { allitas: T`Ha valami évente 10%-kal csökken, 2 év múlva az eredeti 80%-a marad.`, igaz: false, miert: T`\(0{,}9^2=0{,}81\), tehát 81%.` },
    { allitas: T`Ha a pH 2-vel csökken, az oxóniumion-koncentráció százszorosára nő.`, igaz: true, miert: T`\(\left[\mathrm{H}^+\right]=10^{-\mathrm{pH}}\), és \(10^{2}=100\).` },
    { allitas: T`Évi 10%-os növekedéssel 10 év alatt pontosan duplázódik az érték.`, igaz: false, miert: T`\(1{,}1^{10}\approx 2{,}59\): kamatos kamatnál a növekedés több mint kétszeres.` },
    { allitas: T`Évi 20%-os csökkenés, majd évi 20%-os növekedés után az eredeti értéket kapjuk vissza.`, igaz: false, miert: T`\(0{,}8\cdot 1{,}2=0{,}96\): 4%-kal kevesebb lesz.` },
    { allitas: T`10 dB-es növekedés az intenzitás tízszeresét jelenti.`, igaz: true, miert: T`\(10\lg\frac{I_2}{I_1}=10\Rightarrow \frac{I_2}{I_1}=10\).` },
    { allitas: T`Három felezési idő után az eredeti mennyiség \(\frac18\) része marad meg.`, igaz: true, miert: T`\(\left(\frac12\right)^{3}=\frac18\).` }
    ],
    mintapelda: {
      feladat: T`500 000 Ft-ot beteszünk évi 4%-os kamatos kamatra. Mennyi lesz 5 év múlva, és mikor haladja meg az 1 millió Ft-ot?`,
      lepesek: [
      T`\[T_5=500\,000\cdot 1{,}04^{5}\approx 608\,326\ \text{Ft}\]`,
      T`\[500\,000\cdot 1{,}04^{n}=1\,000\,000\quad\Rightarrow\quad 1{,}04^{n}=2\]`,
      T`\[n=\frac{\lg 2}{\lg 1{,}04}\approx 17{,}67\]`,
      T`Felfelé kerekítünk: a 18. év végén haladja meg először az 1 millió forintot.`
      ]
    },
    feladatok
  });
})();
