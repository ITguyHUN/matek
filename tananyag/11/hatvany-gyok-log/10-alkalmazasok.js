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
      valasz: { ertekek: [t], tol: 0.051 }, formatum: 'tizedes tört, pl. 34,6',
      tipp: T`\(\left(\frac12\right)^{t/${Th}}=${nt(f)}\). Vegyél logaritmust!`,
      megoldas: [T`\[\frac{t}{${Th}}=\frac{\lg ${nt(f)}}{\lg 0{,}5}\quad\Rightarrow\quad t\approx ${nt(+t.toFixed(1))}\ \text{nap}\]`] };
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
    { allitas: T`Ha valami évente 10%-kal csökken, 2 év múlva az eredeti 80%-a marad.`, igaz: false, miert: T`\(0{,}9^2=0{,}81\), tehát 81%.` }
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
