/*
 * 7. fejezet – Kamatszámítás. Gazdálkodj okosan!
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 5. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { tbl } = M7;
  const G = {};
  /* pénzösszeg legfeljebb 2 tizedesjeggyel, ezres tagolással: TeX-ben (ft2) és szövegben (hu2) */
  const tag = (x, sep, vessz) => { const v = +x.toFixed(2); const [i, d] = String(Math.abs(v)).split('.'); return (v < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) + (d ? vessz + d : ''); };
  const ft2 = x => tag(x, '\\,', '{,}');
  const hu2 = x => tag(x, ' ', ',');
  const szorzo = p => 1 + p / 100;
  const TOKEK = [5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000, 200000];

  G.egyEv = { name: 'Kamat egy évre', make() {
    const T0 = P(TOKEK), p = P([2, 3, 4, 5, 6, 7, 8, 10, 12, 2.5, 3.5, 4.5]); const kam = T0 * p / 100; const ask = R(0, 1);
    return { q: `<p>${big(T0)} Ft-ot egy évre betétbe teszünk ${hu(p)}%-os éves kamatra. ${ask ? 'Mennyi pénzünk lesz egy év múlva?' : 'Mennyi kamatot kapunk egy év alatt?'}</p>`,
      ans: { vals: [ask ? T0 + kam : kam] }, ansText: hu(ask ? T0 + kam : kam), fmt: 'szám (Ft)',
      hint: ask ? `Egy év múlva a betét ${hu(100 + p)}%-a lesz, azaz ${hu(szorzo(p))}-szerese.` : `A kamat a betét ${hu(p)}%-a.`,
      sol: ask ? [T`\(${bigT(T0)}\cdot ${nt(szorzo(p))}=${bigT(T0 + kam)}\) Ft`, T`(A kamat \(${bigT(kam)}\) Ft.)`] : [T`\(${bigT(T0)}\cdot ${nt(p / 100)}=${bigT(kam)}\) Ft`] };
  } };

  G.tobbEv = { name: 'Kamatos kamat több évre', make() {
    const T0 = P(TOKEK), p = P([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]), n = R(2, 4); const q = szorzo(p);
    const rows = []; let v = T0; for (let i = 1; i <= n; i++) { v = v * q; rows.push(v); } const V = +v.toFixed(2);
    return { q: `<p>${big(T0)} Ft-ot ${n} évre lekötünk évi ${p}%-os kamatos kamatra (a kamat minden év végén hozzáadódik a betéthez, és tovább kamatozik). Mennyi pénzünk lesz ${n} év múlva? <i>(Két tizedesjegyre kerekítve, ha kell. Számológép használható.)</i></p>`,
      ans: { vals: [V], tol: 0.011 }, ansText: hu2(V), fmt: 'szám (Ft)',
      hint: `Minden évben ${hu(q)}-szeresére nő a pénz. ${n} év alatt: ${big(T0)} · ${hu(q)}${'·' + hu(q)}${n > 2 ? '·…' : ''}`,
      sol: rows.map((x, i) => T`${i + 1}. év végén: \(${i === 0 ? bigT(T0) : ft2(rows[i - 1])}\cdot ${nt(q)}=${ft2(x)}\) Ft`).concat([T`Röviden: \(${bigT(T0)}\cdot ${nt(q)}^{${n}}\approx${ft2(V)}\) Ft.`]) };
  } };

  G.kezdo = { name: 'Mennyit kell betenni?', make() {
    const p = P([2, 4, 5, 8, 10, 20, 25]); const n = p >= 10 ? R(1, 2) : 1; const q = szorzo(p); const T0 = P([4000, 8000, 10000, 16000, 20000, 40000, 50000, 80000]); const Tn = +(T0 * q ** n).toFixed(4);
    if (!Number.isInteger(Tn * 100)) return G.kezdo.make();
    return { q: `<p>Mennyi pénzt kell ma betennünk a bankba évi ${p}%-os kamat mellett, hogy ${n === 1 ? 'egy év' : 'két év'} múlva ${hu2(Tn)} Ft-unk legyen?${n === 2 ? ' (A kamat tovább kamatozik.)' : ''}</p>`, ans: { vals: [T0], tol: 0.011 }, ansText: String(T0), fmt: 'szám (Ft)',
      hint: `Visszafelé számolunk: évente ${hu(q)}-szeresére nő a pénz, tehát ${hu(q)}-del ${n === 2 ? 'kétszer ' : ''}osztunk.`,
      sol: n === 1 ? [T`${100 + p}% \(=${ft2(Tn)}\) Ft, tehát a 100%: \(${ft2(Tn)}:${nt(q)}=${bigT(T0)}\) Ft.`]
        : [T`Egy év múlva: \(${ft2(Tn)}:${nt(q)}=${ft2(T0 * q)}\) Ft kellett legyen.`, T`Ma: \(${ft2(T0 * q)}:${nt(q)}=${bigT(T0)}\) Ft.`] };
  } };

  G.kamatlab = { name: 'Hány százalékos a kamat?', make() {
    const T0 = P(TOKEK), p = P([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 2.5, 1.5]); const T1 = T0 * szorzo(p);
    if (!Number.isInteger(T1 * 100)) return G.kamatlab.make();
    return { q: `<p>Egy ${big(T0)} Ft-os betét egy év alatt ${hu2(T1)} Ft-ra nőtt. Hány százalékos volt az éves kamat?</p>`, ans: { vals: [p] }, ansText: hu(p), fmt: 'szám (%)',
      hint: 'Mennyi a kamat forintban? Ez hány százaléka a betett összegnek?',
      sol: [T`A kamat: \(${ft2(T1)}-${bigT(T0)}=${ft2(T1 - T0)}\) Ft.`, T`\(${ft2(T1 - T0)}:${bigT(T0)}=${nt(p / 100)}=${nt(p)}\%\)`] };
  } };

  G.hitel = { name: 'Vásárlás hitelre', make() {
    const ar = P([20000, 30000, 40000, 50000, 60000, 80000, 120000, 150000]); const onr = ar * P([0.2, 0.25, 0.3, 0.4, 0.5]); const p = P([8, 10, 12, 15, 18, 20, 25]);
    const hitel = ar - onr; const vissza = hitel * szorzo(p); const ossz = onr + vissza; const ask = R(0, 1);
    return { q: `<p>Egy ${big(ar)} Ft-os ${P(['kerékpárt', 'laptopot', 'telefont', 'hűtőszekrényt'])} úgy is megvehetünk, hogy most ${big(onr)} Ft-ot fizetünk, a hiányzó összeget pedig egy év múlva, ${p}% kamattal együtt. ${ask ? 'Mennyibe kerül így ténylegesen?' : 'Mennyit kell egy év múlva fizetnünk?'}</p>`,
      ans: { vals: [ask ? ossz : vissza] }, ansText: hu(ask ? ossz : vissza), fmt: 'szám (Ft)',
      hint: 'A kamatot csak a hiányzó összegre (a hitelre) számítják fel!',
      sol: [T`A hitel: \(${bigT(ar)}-${bigT(onr)}=${bigT(hitel)}\) Ft.`, T`Egy év múlva: \(${bigT(hitel)}\cdot ${nt(szorzo(p))}=${bigT(vissza)}\) Ft.`].concat(ask ? [T`Összesen: \(${bigT(onr)}+${bigT(vissza)}=${bigT(ossz)}\) Ft (\(${bigT(ossz - ar)}\) Ft-tal több).`] : []) };
  } };

  G.ertekvesztes = { name: 'Értékcsökkenés', make() {
    const T0 = P([100000, 200000, 400000, 500000, 800000, 1000000, 2000000, 4000000]); const p = P([5, 10, 15, 20, 25]); const n = R(1, 3); const q = 1 - p / 100; const V = +(T0 * q ** n).toFixed(2);
    const mit = P(['egy autó', 'egy motor', 'egy számítógép', 'egy gép']);
    return { q: `<p>${mit[0].toUpperCase() + mit.slice(1)} értéke ${big(T0)} Ft. Évente az aktuális értékének ${p}%-át veszíti el. Mennyit ér ${n === 1 ? 'egy' : n === 2 ? 'két' : 'három'} év múlva?</p>`, ans: { vals: [V], tol: 0.011 }, ansText: hu2(V), fmt: 'szám (Ft)',
      hint: `Évente az érték ${100 - p}%-a marad meg: ${hu(q)}-szeresére csökken.`,
      sol: [T`Szorzó: \(1-${nt(p / 100)}=${nt(q)}\).`, T`\(${bigT(T0)}\cdot ${nt(q)}${n > 1 ? `^{${n}}` : ''}=${ft2(V)}\) Ft`] };
  } };

  G.ajanlat = { name: 'Melyik ajánlat jobb?', proba: false, make() {
    const T0 = P([10000, 15000, 20000, 30000, 50000]); const n = 3; const p = P([5, 8, 10]); const fix = Math.round(T0 * R(p - 2, p + 2) / 100 / 100) * 100; const egy = P([15, 20, 25, 30, 33]);
    const A = T0 * szorzo(p) ** n, B = T0 + n * fix, C = T0 * (1 + egy / 100);
    const vals = [A, B, C]; const best = vals.indexOf(Math.max(...vals)); if (vals.filter(v => Math.abs(v - vals[best]) < 1).length > 1) return G.ajanlat.make();
    const opts = ['Spóri Bank', 'Pazar Bank', 'Gavallér Bank'];
    return { q: `<p>${big(T0)} Ft-ot szeretnénk 3 évre befektetni. Melyik bank ajánlata a legjobb?</p><ul><li><b>Spóri Bank:</b> évi ${p}% kamatos kamat.</li><li><b>Pazar Bank:</b> minden év végén ${big(fix)} Ft-ot ad hozzá a betéthez.</li><li><b>Gavallér Bank:</b> 3 év után egyszerre ${egy}%-kal növeli a betett összeget.</li></ul>`,
      ans: { choice: opts, correct: best }, ansText: opts[best], fmt: '',
      hint: 'Számold ki mindhárom bankban a 3 év utáni összeget!',
      sol: [T`Spóri: \(${bigT(T0)}\cdot ${nt(szorzo(p))}^3\approx${ft2(A)}\) Ft`, T`Pazar: \(${bigT(T0)}+3\cdot ${bigT(fix)}=${bigT(B)}\) Ft`, T`Gavallér: \(${bigT(T0)}\cdot ${nt(1 + egy / 100)}=${ft2(C)}\) Ft`, `A legtöbbet a <b>${opts[best]}</b> fizeti.`] };
  } };

  G.novekedes = { name: 'Hány százalékos a növekedés összesen?', make() {
    const p = P([3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50]), n = R(2, p >= 20 ? 3 : 4); const m = szorzo(p) ** n; const tot = +((m - 1) * 100).toFixed(4);
    const c = R(0, 2);
    const q = [`<p>Egy betét évente ${p}%-kal nő (kamatos kamattal). Hány százalékkal lesz több pénzünk ${n} év alatt az eredetinél?</p>`,
      `<p>Egy város lakossága ${n} éven át minden évben ${p}%-kal nőtt (mindig az előző évihez képest). Összesen hány százalékkal nőtt a lakosság ez alatt?</p>`,
      `<p>Egy baktériumtenyészet tömege óránként ${p}%-kal nő. Hány százalékkal nő a tömege ${n} óra alatt?</p>`][c];
    return { q: q + '<p><i>(Két tizedesjegyre kerekítve; számológép használható.)</i></p>', ans: { vals: [tot], tol: 0.006 }, ansText: hu(+tot.toFixed(2)), fmt: 'szám (%)',
      hint: `Nem ${n}·${p}%! A szorzók összeszorzódnak: ${hu(szorzo(p))}${('·' + hu(szorzo(p))).repeat(n - 1)}.`,
      sol: [T`\(${nt(szorzo(p))}^{${n}}\approx${nt(+m.toFixed(6))}\), azaz az eredeti \(${nt(+(m * 100).toFixed(4))}\%\)-a.`, T`A növekedés kb. \(${nt(+tot.toFixed(2))}\%\) (több, mint \(${n}\cdot ${p}\%=${n * p}\%\)).`] };
  } };

  G.meddig = { name: 'Hány év alatt éri el?', szint: 'emelt', make() {
    const T0 = P([5000, 10000, 20000, 50000]), p = P([5, 8, 10, 12, 15, 20]); const cel = T0 * P([1.3, 1.5, 1.8, 2, 2.5]); let n = 0, v = T0; while (v < cel - 1e-9) { v *= szorzo(p); n++; } if (n > 8) return G.meddig.make();
    return { q: `<p>${big(T0)} Ft-ot évi ${p}%-os kamatos kamatra teszünk. Legalább hány év kell ahhoz, hogy a pénzünk elérje a ${big(cel)} Ft-ot?</p>`, ans: { vals: [n] }, ansText: String(n), fmt: 'egész szám (év)',
      hint: `Szorozd évről évre ${hu(szorzo(p))}-del, amíg el nem éred a célt!`,
      sol: (() => { const out = []; let w = T0; for (let i = 1; i <= n; i++) { w *= szorzo(p); if (i >= n - 1) out.push(T`${i}. év végén: \(\approx${ft2(w)}\) Ft ${w >= cel - 1e-9 ? '✔' : T`\(\lt ${bigT(cel)}\)`}`); } return out.concat([`Tehát legalább <b>${n} év</b> kell.`]); })() };
  } };

  Tananyag.fejezet({
    id: 'kamat',
    cim: 'Kamatszámítás. Gazdálkodj okosan!',
    rovid: 'Kamat',
    bevezeto: T`Mennyit ér a pénzünk a bankban egy, két, három év múlva? Mennyibe kerül valójában egy hitelre vett kerékpár? A kamatszámítás a százalékszámítás alkalmazása.`,
    elmelet: T`<div class="prose"><p>A bank a nála elhelyezett pénzért (betét) <b>kamatot</b> fizet: évente a betét bizonyos százalékát. Ez a <b>kamatláb</b>, pl. évi 8%.</p>
<p>8%-os kamat → 8%-os növekedés → a betét 108%-a lesz → <b>1,08-szoros</b> lesz.</p></div>
<div class="mathbox">\[\text{1 év múlva: }T\cdot\left(1+\frac{p}{100}\right)\]</div>
<div class="prose"><p><b>Kamatos kamat:</b> ha a pénzt több évre bent hagyjuk, a második évben már a megnövelt összeg kamatozik tovább. Így a pénz minden évben ugyanannyiszorosára nő:</p></div>
${tbl(['', 'kezdetben', '1 év múlva', '2 év múlva', '3 év múlva'], [['5000 Ft, 8%', '5000', '5400', '5832', '6298,56']])}
<div class="mathbox">\[5000\cdot1{,}08\cdot1{,}08\cdot1{,}08=5000\cdot1{,}08^{3}\approx 6299\text{ Ft}\]</div>
<div class="prose"><ul>
<li>3 év alatt a növekedés \(1{,}08^3\approx1{,}2598\), azaz kb. 25,98% – <b>több</b>, mint \(3\cdot8\%=24\%\).</li>
<li><b>Hitel:</b> ha mi kérünk kölcsön, nekünk kell kamatot fizetni. 10 000 Ft hitel 15% kamattal egy év múlva \(10\,000\cdot1{,}15=11\,500\) Ft-ot jelent.</li>
<li><b>Értékcsökkenés:</b> ha valami évente 10%-ot veszít az értékéből, akkor évente 0,9-szeresére csökken.</li>
<li><b>Visszafelé:</b> ha 5% kamattal egy év múlva 21 000 Ft lesz, akkor most \(21\,000:1{,}05=20\,000\) Ft-ot kell betenni.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Évi 10%-os kamatos kamattal 2 év alatt 20%-kal nő a pénzünk.`, igaz: false, miert: T`\(1{,}1\cdot1{,}1=1{,}21\), tehát 21%-kal nő.` },
      { allitas: T`8%-os kamatnál a betét 1 év múlva 1,08-szorosára nő.`, igaz: true, miert: T`\(100\%+8\%=108\%=1{,}08\).` },
      { allitas: T`Ha egy autó évente 10%-ot veszít az értékéből, 10 év múlva semmit sem ér.`, igaz: false, miert: T`Mindig a meglévő érték 90%-a marad: \(0{,}9^{10}\approx0{,}35\), még kb. 35%-ot ér.` },
      { allitas: T`10 000 Ft hitel 20% kamattal egy év múlva 12 000 Ft visszafizetést jelent.`, igaz: true, miert: T`\(10\,000\cdot1{,}2=12\,000\).` },
      { allitas: T`Ha egy év múlva 5%-os kamattal 21 000 Ft-unk lesz, akkor 19 950 Ft-ot tettünk be.`, igaz: false, miert: T`Nem a 21 000-ből vonunk le 5%-ot! \(21\,000:1{,}05=20\,000\) Ft.` },
      { allitas: T`A kamatos kamatnál a második évben több kamatot kapunk, mint az elsőben.`, igaz: true, miert: T`A második évben már a megnövelt összeg kamatozik.` },
      { general() { const T0 = P([10000, 20000, 50000]), p = P([5, 10, 20]); const ok = R(0, 1) === 1; const v = ok ? T0 * (1 + p / 100) ** 2 : T0 * (1 + 2 * p / 100);
        return { allitas: T`\(${bigT(T0)}\) Ft évi ${p}%-os kamatos kamattal 2 év alatt \(${ft2(v)}\) Ft-ra nő.`, igaz: Math.abs(v - T0 * (1 + p / 100) ** 2) < 0.01, miert: T`\(${bigT(T0)}\cdot ${nt(1 + p / 100)}^2=${ft2(T0 * (1 + p / 100) ** 2)}\) Ft.` }; } }
    ],
    mintapelda: {
      feladat: T`Nóra 5000 Ft-ját évi 8%-os kamatos kamatra teszi. a) Mennyi pénze lesz 3 év múlva? b) Hány év alatt éri el a 7500 Ft-ot?`,
      lepesek: [
        T`Évente 1,08-szorosára nő: 1 év után \(5400\) Ft, 2 év után \(5832\) Ft, 3 év után \(6298{,}56\) Ft.`,
        T`Röviden: \(5000\cdot1{,}08^3\approx6299\) Ft. Ez kb. 25,98%-os növekedés.`,
        T`b) Folytatjuk: 4 év: \(\approx6802\) Ft, 5 év: \(\approx7347\) Ft, 6 év: \(\approx7934\) Ft.`,
        T`Tehát legalább <b>6 év</b> kell, hogy elérje a 7500 Ft-ot.`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
