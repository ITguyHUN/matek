/*
 * 6. fejezet – Százalékszámítás
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK 4. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, sf, tbl, randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, $, esc } = M7;
  const FMT = M7.FMT7;
  const G = {};

  const NICEP = [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 120, 150, 2.5, 12.5, 7.5];
  const NICEA = [40, 60, 80, 120, 150, 160, 200, 240, 250, 300, 360, 400, 450, 480, 500, 600, 800, 1200, 1500, 2000, 2400, 3600, 12000];
  const fine = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
  function pickAP() { let A, p; do { A = P(NICEA); p = P(NICEP); } while (!fine(A * p / 100)); return [A, p, +(A * p / 100).toFixed(6)]; }
  G.ertek = { ch: 'szaz', name: 'Százalékérték', make() {
    const [A, p, V] = pickAP();
    return { q: `<p>Az alap ${big(A)}, a százalékláb ${hu(p)}%. Mennyi a százalékérték?</p>`, ans: { vals: [V] }, ansText: hu(V), fmt: 'szám',
      hint: '1% = az alap századrésze. Vagy szorozz a százalékláb tizedes tört alakjával!',
      sol: [T`1%: \(${bigT(A)}:100=${nt(A / 100)}\)`, T`${hu(p)}%: \(${nt(A / 100)}\cdot ${nt(p)}=${nt(V)}\)`, T`(Röviden: \(${bigT(A)}\cdot ${nt(p / 100)}=${nt(V)}\).)`] };
  } };
  G.alap = { ch: 'szaz', name: 'Alap kiszámítása', make() {
    const [A, p, V] = pickAP();
    return { q: `<p>A százalékérték ${hu(V)}, a százalékláb ${hu(p)}%. Mennyi az alap?</p>`, ans: { vals: [A] }, ansText: String(A), fmt: 'szám',
      hint: 'Ha a p% ismert, előbb számold ki az 1%-ot, aztán a 100%-ot!',
      sol: [T`${hu(p)}% \(=${nt(V)}\)`, T`1% \(=${nt(V)}:${nt(p)}=${nt(A / 100)}\)`, T`100% \(=${nt(A / 100)}\cdot 100=${bigT(A)}\)`, T`(Röviden: \(${nt(V)}:${nt(p / 100)}=${bigT(A)}\).)`] };
  } };
  G.lab = { ch: 'szaz', name: 'Százalékláb', make() {
    const [A, p, V] = pickAP();
    return { q: `<p>Az alap ${big(A)}, a százalékérték ${hu(V)}. Hány százalék a százalékláb?</p>`, ans: { vals: [p] }, ansText: hu(p), fmt: 'szám (%)',
      hint: 'Osszd el a részt az egésszel (az alappal), és szorozd 100-zal!',
      sol: [T`\(${nt(V)}:${bigT(A)}=${nt(p / 100)}\)`, T`\(${nt(p / 100)}=${nt(p)}\%\)`] };
  } };
  G.valtozas = { ch: 'szaz', name: 'Növelés, csökkentés', make() {
    const up = R(0, 1) === 1; let A, p; do { A = P(NICEA.concat([8000, 9600, 15000, 24000])); p = P([5, 10, 15, 20, 25, 30, 40, 50, 12, 8]); } while (!fine(A * p / 100));
    const mult = up ? 1 + p / 100 : 1 - p / 100; const B = +(A * mult).toFixed(6); const rev = R(0, 2) === 0;
    if (!rev) return { q: `<p>Egy ${big(A)} Ft-os termék árát ${p}%-kal ${up ? 'megemelték' : 'csökkentették'}. Mennyi az új ár?</p>`, ans: { vals: [B] }, ansText: hu(B), fmt: 'szám (Ft)',
      hint: up ? `${p}%-os növelés után az ár ${100 + p}%-a lesz az eredetinek.` : `${p}%-os csökkentés után az ár ${100 - p}%-a marad meg.`,
      sol: [T`${up ? 'Növelés' : 'Csökkentés'} ${p}%-kal → az új ár az eredeti \(${up ? 100 + p : 100 - p}\%\)-a, azaz \(${nt(mult)}\)-szerese.`, T`\(${bigT(A)}\cdot ${nt(mult)}=${bigT(B)}\) Ft`] };
    return { q: `<p>Egy termék árát ${p}%-kal ${up ? 'megemelték' : 'csökkentették'}, így most ${big(B)} Ft. Mennyi volt az eredeti ár?</p>`, ans: { vals: [A] }, ansText: String(A), fmt: 'szám (Ft)',
      hint: `Az új ár az eredeti ár hány százaléka? Ebből számolj vissza – ne az új árból vonj le (vagy adj hozzá) ${p}%-ot!`,
      sol: [T`Az új ár az eredeti \(${up ? 100 + p : 100 - p}\%\)-a: \(${bigT(B)}\) Ft.`, T`1%: \(${bigT(B)}:${up ? 100 + p : 100 - p}=${nt(A / 100)}\) Ft, 100%: \(${bigT(A)}\) Ft.`, T`(Röviden: \(${bigT(B)}:${nt(mult)}=${bigT(A)}\).)`] };
  } };
  G.atvalt = { ch: 'szaz', name: 'Százalék – tört – tizedes', make() {
    const pool = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 20], [9, 20], [1, 20], [3, 25], [6, 25], [1, 40], [3, 40], [5, 4], [3, 2], [6, 5]];
    const [n, d] = P(pool); const f = F(n, d); const pct = +(100 * n / d).toFixed(6); const t = R(0, 2);
    if (t === 0) return { q: T`<p>Hány százalék?</p>\[${ft(f)}\]`, ans: { vals: [pct] }, ansText: hu(pct), fmt: 'szám (%)', hint: 'Írd át tizedes törtté, és szorozd 100-zal!',
      sol: [T`\(${ft(f)}=${n}:${d}=${nt(n / d)}\)`, T`\(${nt(n / d)}=${nt(pct)}\%\)`] };
    if (t === 1) return { q: T`<p>Hány százalék?</p>\[${nt(n / d)}\]`, ans: { vals: [pct] }, ansText: hu(pct), fmt: 'szám (%)', hint: 'A százalék századrészt jelent: szorozz 100-zal!',
      sol: [T`\(${nt(n / d)}\cdot 100=${nt(pct)}\), tehát \(${nt(pct)}\%\).`] };
    return { q: T`<p>Írd fel tört alakban, egyszerűsítve!</p>\[${nt(pct)}\%\]`, ans: { vals: [n / d], form: 'frac' }, ansText: fplain(f), fmt: FMT.fs, hint: 'p% = p/100. Utána egyszerűsíts!',
      sol: [T`\(${nt(pct)}\%=\frac{${nt(pct)}}{100}${Number.isInteger(pct) ? '' : T`=\frac{${Math.round(pct * 10)}}{1000}`}=${ft(f)}\)`] };
  } };
  G.kordiagram = { ch: 'szaz', name: 'Kördiagram', make() {
    if (R(0, 1) === 0) { const p = P([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 2.5, 12.5]); const deg = +(3.6 * p).toFixed(6);
      return { q: `<p>Egy kördiagramon a „sport” kategória ${hu(p)}%-ot jelent. Mekkora a hozzá tartozó körcikk középponti szöge?</p>`, ans: { vals: [deg] }, ansText: hu(deg), fmt: 'szám (fok)',
        hint: 'A teljes kör 360°, ez felel meg a 100%-nak. 1% = 3,6°.', sol: [T`100% → 360°, 1% → 3,6°.`, T`\(${nt(p)}\cdot 3{,}6=${nt(deg)}°\)`] }; }
    const N = P([20, 24, 30, 36, 40, 45, 60]); let k; do { k = R(1, N - 1); } while (!fine(360 * k / N));
    const deg = +(360 * k / N).toFixed(6);
    return { q: `<p>Egy ${N} fős osztályban ${k} tanuló jár zeneiskolába. Mekkora középponti szögű körcikk ábrázolja őket a kördiagramon?</p>`, ans: { vals: [deg] }, ansText: hu(deg), fmt: 'szám (fok)',
      hint: 'Hányad része az osztálynak? Ugyanannyiad része a 360°-nak!', sol: [T`Arány: \(\frac{${k}}{${N}}\).`, T`\(360°\cdot\frac{${k}}{${N}}=${nt(deg)}°\)`] };
  } };

  /* ---- Bővítés (2026. november): további feladattípusok ---- */

  G.hanySzazalekkal = { ch: 'szaz', name: 'Hány százalékkal változott?', make() {
    let A, p; do { A = P([200, 250, 400, 500, 800, 1200, 1500, 2000, 2400, 3000, 4500, 6000, 8000, 12000, 27000]); p = P([5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 12, 8, 2.5, 12.5]); } while (!fine(A * p / 100));
    const up = R(0, 1) === 1; const B = +(A * (up ? 1 + p / 100 : 1 - p / 100)).toFixed(4);
    const c = R(0, 2);
    const q = [`<p>Egy termék ára ${big(A)} Ft-ról ${big(B)} Ft-ra ${up ? 'emelkedett' : 'csökkent'}. Hány százalékkal ${up ? 'emelkedett' : 'csökkent'} az ár?</p>`,
      `<p>Tavaly ${big(A)} látogató volt a kiállításon, idén ${big(B)}. Hány százalékkal ${up ? 'nőtt' : 'csökkent'} a látogatók száma?</p>`,
      `<p>Egy ${big(A)} Ft-os kabátot ${big(B)} Ft-ért ${up ? 'árulnak a szezon elején' : 'vehettünk meg a leárazáson'}. Hány százalékos volt ${up ? 'az áremelés' : 'a leárazás'}?</p>`][c];
    return { q, ans: { vals: [p] }, ansText: hu(p), fmt: 'szám (%)',
      hint: 'A változást mindig az EREDETI értékhez (a 100%-hoz) viszonyítjuk.',
      sol: [T`A változás: \(${bigT(Math.max(A, B))}-${bigT(Math.min(A, B))}=${bigT(Math.abs(B - A))}\).`, T`Ez az eredeti \(${bigT(A)}\)-nak \(${bigT(Math.abs(B - A))}:${bigT(A)}=${nt(p / 100)}\) része, azaz \(${nt(p)}\%\).`, T`(Másképp: \(${bigT(B)}:${bigT(A)}=${nt(+(B / A).toFixed(6))}\), ez \(${nt(+(100 * B / A).toFixed(4))}\%\), tehát ${up ? 'növekedés' : 'csökkenés'} \(${nt(p)}\%\).)`] };
  } };

  G.egymasUtan = { ch: 'szaz', name: 'Egymás utáni változások', make() {
    const p1 = P([10, 20, 25, 30, 40, 50]), p2 = P([10, 20, 25, 30, 40, 50]); const u1 = R(0, 1) === 1, u2 = R(0, 1) === 1;
    const m = (u1 ? 1 + p1 / 100 : 1 - p1 / 100) * (u2 ? 1 + p2 / 100 : 1 - p2 / 100); const tot = +(Math.abs(m - 1) * 100).toFixed(6);
    if (tot < 1e-9) return G.egymasUtan.make();
    const A = P([2000, 4000, 5000, 8000, 10000, 20000, 25000, 40000]); const B = +(A * m).toFixed(4); const ask = R(0, 1);
    const w = (u, p) => `${p}%-kal ${u ? 'megemelték' : 'csökkentették'}`;
    return { q: ask ? `<p>Egy ${big(A)} Ft-os termék árát előbb ${w(u1, p1)}, majd az új árat ${w(u2, p2)}. Mennyi lett a végső ár?</p>`
        : `<p>Egy termék árát előbb ${w(u1, p1)}, majd az új árat ${w(u2, p2)}. Összesen hány százalékkal ${m > 1 ? 'nőtt' : 'csökkent'} az eredeti ár?</p>`,
      ans: { vals: [ask ? B : tot] }, ansText: hu(ask ? B : tot), fmt: ask ? 'szám (Ft)' : 'szám (%)',
      hint: 'Ne add össze a százalékokat! Szorozd össze a két változás szorzóját (pl. +20% → 1,2; −10% → 0,9).',
      sol: [T`Szorzók: \(${nt(u1 ? 1 + p1 / 100 : 1 - p1 / 100)}\) és \(${nt(u2 ? 1 + p2 / 100 : 1 - p2 / 100)}\).`, T`Együtt: \(${nt(u1 ? 1 + p1 / 100 : 1 - p1 / 100)}\cdot ${nt(u2 ? 1 + p2 / 100 : 1 - p2 / 100)}=${nt(+m.toFixed(6))}\), azaz az eredeti \(${nt(+(m * 100).toFixed(4))}\%\)-a.`,
        ask ? T`\(${bigT(A)}\cdot ${nt(+m.toFixed(6))}=${nt(B)}\) Ft` : T`Ez \(${nt(tot)}\%\)-os ${m > 1 ? 'növekedés' : 'csökkenés'}.`] };
  } };

  G.afa = { ch: 'szaz', name: 'Áfa: nettó és bruttó ár', make() {
    const netto = R(2, 80) * 100; const brutto = +(netto * 1.27).toFixed(2); const ask = R(0, 2);
    if (ask === 0) return { q: `<p>Egy termék nettó ára ${big(netto)} Ft. Az áfa 27%. Mennyi a bruttó ár (amit a vásárló fizet)?</p>`, ans: { vals: [brutto] }, ansText: hu(brutto), fmt: 'szám (Ft)',
      hint: 'Bruttó = nettó + 27% → a nettó 127%-a, azaz 1,27-szerese.', sol: [T`\(${bigT(netto)}\cdot1{,}27=${nt(brutto)}\) Ft`] };
    if (ask === 1) return { q: `<p>Egy termék bruttó ára (27% áfával) ${hu(brutto)} Ft. Mennyi a nettó ára?</p>`, ans: { vals: [netto] }, ansText: String(netto), fmt: 'szám (Ft)',
      hint: 'A bruttó ár a nettó 127%-a. Számolj vissza: ne a bruttóból vonj le 27%-ot!', sol: [T`127% \(=${nt(brutto)}\) Ft`, T`100%: \(${nt(brutto)}:1{,}27=${bigT(netto)}\) Ft`] };
    const afa = +(netto * 0.27).toFixed(2);
    return { q: `<p>Egy termék bruttó ára (27% áfával) ${hu(brutto)} Ft. Hány forint ebből az áfa?</p>`, ans: { vals: [afa] }, ansText: hu(afa), fmt: 'szám (Ft)',
      hint: 'Előbb számold ki a nettó árat (a bruttó a nettó 127%-a), az áfa ennek 27%-a.', sol: [T`Nettó: \(${nt(brutto)}:1{,}27=${bigT(netto)}\) Ft.`, T`Áfa: \(${bigT(netto)}\cdot0{,}27=${nt(afa)}\) Ft (vagy \(${nt(brutto)}-${bigT(netto)}\)).`] };
  } };

  G.oldat = { ch: 'szaz', name: 'Keverékek, oldatok', make() {
    const t = R(0, 2);
    if (t === 0) { const m = P([200, 250, 400, 500, 800, 1000, 1200]); const p = P([2, 4, 5, 8, 10, 12, 15, 20, 25]); const so = m * p / 100;
      return { q: `<p>Hány gramm só van ${m} g ${p}%-os sóoldatban?</p>`, ans: { vals: [so] }, ansText: hu(so), fmt: 'szám (g)', hint: 'Az oldat tömegének ennyi százaléka a só.', sol: [T`\(${m}\cdot ${nt(p / 100)}=${nt(so)}\) g`] }; }
    if (t === 1) { const so = R(1, 12) * 5, viz = so * P([3, 4, 9, 19, 7, 15]); const p = +(100 * so / (so + viz)).toFixed(6);
      return { q: `<p>${so} g cukrot ${viz} g vízben oldunk fel. Hány százalékos lesz az oldat?</p>`, ans: { vals: [p] }, ansText: hu(p), fmt: 'szám (%)',
        hint: 'Az oldat tömege a víz ÉS a cukor együtt! A cukor ennek hány százaléka?', sol: [T`Az oldat tömege: \(${so}+${viz}=${so + viz}\) g.`, T`\(${so}:${so + viz}=${nt(p / 100)}\), azaz \(${nt(p)}\%\).`] }; }
    const viz = P([80, 85, 90, 75]); const friss = P([2, 3, 4, 5, 6, 8, 10]); const szaraz = +(friss * (100 - viz) / 100).toFixed(4);
    return { q: `<p>A friss gomba tömegének ${viz}%-a víz. Szárításkor a víz elpárolog. Hány kg szárított gomba lesz ${friss} kg friss gombából, ha a víz teljesen elpárolog?</p>`, ans: { vals: [szaraz] }, ansText: hu(szaraz), fmt: 'szám (kg)',
      hint: `Ami megmarad, az a nem víz rész: ${100 - viz}%.`, sol: [T`\(100\%-${viz}\%=${100 - viz}\%\) marad meg.`, T`\(${friss}\cdot ${nt((100 - viz) / 100)}=${nt(szaraz)}\) kg`] };
  } };

  G.visszaall = { ch: 'szaz', name: 'Visszaállítás az eredeti árra', szint: 'emelt', make() {
    const pairs = [[25, 20, 1], [20, 100 / 6, 1], [50, 100 / 3, 1], [100, 50, 1], [25, 100 / 3, 0], [20, 25, 0], [50, 100, 0], [10, 100 / 9, 0], [60, 150, 0], [75, 300, 0], [40, 66.66666666666667, 0]];
    const [p, q, up] = P(pairs); if (!Number.isInteger(q) && R(0, 1) === 0) return G.visszaall.make();
    const A = P([1200, 2400, 3600, 4800, 6000, 9000, 12000]); const B = A * (up ? 1 + p / 100 : 1 - p / 100);
    const qtxt = Number.isInteger(q) ? nt(q) : T`${nt(+q.toFixed(2))}\ldots`;
    return { q: `<p>Egy ${big(A)} Ft-os termék árát ${p}%-kal ${up ? 'megemelték' : 'csökkentették'}, így ${big(B)} Ft lett. Hány százalékkal kell az új árat ${up ? 'csökkenteni' : 'növelni'}, hogy újra ${big(A)} Ft legyen?${Number.isInteger(q) ? '' : ' (Két tizedesjegyre kerekítve add meg, vagy törtként!)'}</p>`,
      ans: { vals: [q], tol: Number.isInteger(q) ? 1e-6 : 0.006 }, ansText: Number.isInteger(q) ? String(q) : hu(+q.toFixed(2)), fmt: 'szám (%)',
      hint: `Most az új ár (${big(B)} Ft) a 100%! A változás ${big(Math.abs(B - A))} Ft – ez ennek hány százaléka?`,
      sol: [T`A változás \(${bigT(Math.abs(B - A))}\) Ft, de most az alap \(${bigT(B)}\) Ft.`, T`\(${bigT(Math.abs(B - A))}:${bigT(B)}\cdot100=${qtxt}\%\)`, `Tehát nem ${p}%-kal, hanem ${Number.isInteger(q) ? q : 'kb. ' + hu(+q.toFixed(2))}%-kal kell ${up ? 'csökkenteni' : 'növelni'}.`] };
  } };

  Tananyag.fejezet({
    id: 'szaz',
    cim: 'Százalékszámítás',
    rovid: 'Százalék',
    bevezeto: T`A százalék századrészt jelent. Alap, százalékláb, százalékérték – és a leggyakoribb csapda: visszafelé számolni.`,
    elmelet: T`<div class="mathbox">\[p\%=\frac{p}{100}\qquad\text{pl. } 40\%=\frac{40}{100}=\frac25=0{,}4\qquad \frac34=0{,}75=75\%\]</div>
<div class="tbl"><table><tr><th>Mit keresünk?</th><th>Hogyan?</th><th>Példa</th></tr>
<tr><td>százalékérték</td><td>alap · százalékláb</td><td>240 15%-a: \(240\cdot0{,}15=36\)</td></tr>
<tr><td>alap</td><td>százalékérték : százalékláb</td><td>minek a 35%-a 84? \(84:0{,}35=240\)</td></tr>
<tr><td>százalékláb</td><td>százalékérték : alap</td><td>18 a 72-nek hány %-a? \(18:72=0{,}25=25\%\)</td></tr></table></div>
<div class="prose"><ul>
<li><b>Következtetés 1%-ra:</b> az alap 1%-a az alap századrésze. Ha a 35% = 84, akkor 1% = 2,4, és 100% = 240.</li>
<li><b>Csökkentés 15%-kal</b> → 85% marad → az eredeti <b>0,85-szorosa</b> lesz. <b>Növelés 20%-kal</b> → 120% → az eredeti 1,2-szerese.</li>
<li><b>Visszafelé:</b> ha 20%-os emelés után 72 000 Ft az ár, akkor 120% = 72 000, így az eredeti \(72\,000:1{,}2=60\,000\) Ft. (Nem az új árból vonunk le 20%-ot!)</li>
<li><b>Kördiagram:</b> a teljes kör 360° = 100%, így 1% = 3,6°.</li></ul></div>
<div class="prose"><ul>
<li><b>Hány százalékkal változott?</b> A változást az <b>eredeti</b> értékhez viszonyítjuk: 2400 Ft → 3000 Ft esetén \(600:2400=0{,}25\), azaz 25%-os emelés.</li>
<li><b>Egymás utáni változások:</b> a szorzók összeszorzódnak, a százalékok NEM adódnak össze! \(+20\%\), majd \(-10\%\): \(1{,}2\cdot0{,}9=1{,}08\) → összesen 8%-os növekedés.</li>
<li><b>Áfa:</b> a bruttó ár = nettó ár + 27% áfa, vagyis a nettó ár 1,27-szerese.</li>
<li><b>Oldatok:</b> \(\text{töménység}=\dfrac{\text{oldott anyag}}{\text{oldat (víz + oldott anyag)}}\cdot100\%\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(40\%=\frac25\)`, igaz: true, miert: T`\(40\%=\frac{40}{100}=\frac25\).` },
      { allitas: T`Ha egy árat 20%-kal növelünk, majd 20%-kal csökkentünk, visszakapjuk az eredetit.`, igaz: false, miert: T`\(1{,}2\cdot0{,}8=0{,}96\), tehát az eredeti 96%-a lesz. A második 20% nagyobb alapból számolódik.` },
      { allitas: T`8 literes fogyasztás 15%-kal csökkentve 6,8 liter.`, igaz: true, miert: T`\(8\cdot0{,}85=6{,}8\).` },
      { allitas: T`Ha 120% = 600, akkor az alap 720.`, igaz: false, miert: T`Az alap a 100%: \(600:1{,}2=500\). (A 720 a 600 120%-a lenne.)` },
      { allitas: T`Kördiagramon a 25%-hoz 90°-os középponti szög tartozik.`, igaz: true, miert: T`\(360°\cdot0{,}25=90°\), ez a kör negyede.` },
      { allitas: T`Ha egy ár 2000 Ft-ról 2500 Ft-ra nő, az 25%-os emelés.`, igaz: true, miert: T`\(500:2000=0{,}25=25\%\).` },
      { allitas: T`Ha egy ár 2500 Ft-ról 2000 Ft-ra csökken, az 25%-os csökkentés.`, igaz: false, miert: T`Most a 2500 Ft az alap: \(500:2500=0{,}2=20\%\).` },
      { allitas: T`10%-os, majd újabb 10%-os áremelés összesen 21%-os emelés.`, igaz: true, miert: T`\(1{,}1\cdot1{,}1=1{,}21\).` },
      { allitas: T`30%-os, majd 10%-os árengedmény összesen 40% engedmény.`, igaz: false, miert: T`\(0{,}7\cdot0{,}9=0{,}63\): az ár 63%-a marad, ez 37% engedmény.` },
      { allitas: T`20 g só és 80 g víz keveréke 25%-os sóoldat.`, igaz: false, miert: T`Az oldat 100 g, ebből 20 g só: \(20\%\)-os.` },
      { allitas: T`Ha a kamat 5%-ról 7%-ra nő, az 2 százalékpontos, de 40%-os növekedés.`, igaz: true, miert: T`A különbség \(7-5=2\) százalékpont, de \(2:5=0{,}4\), tehát a kamatláb 40%-kal nőtt.`, szint: 'emelt' },
      { general() { const p = P([10, 20, 25, 50]); return { allitas: T`Ha egy árat ${p}%-kal megemelünk, majd ${p}%-kal csökkentünk, visszakapjuk az eredeti árat.`, igaz: false, miert: T`\(${nt(1 + p / 100)}\cdot ${nt(1 - p / 100)}=${nt(+((1 + p / 100) * (1 - p / 100)).toFixed(4))}\): az eredeti ár \(${nt(+(100 * (1 + p / 100) * (1 - p / 100)).toFixed(2))}\%\)-a lesz.` }; } }
    ],
    mintapelda: {
      feladat: T`Egy autó 100 km-en 8 liter üzemanyagot fogyaszt. Áramvonalasítással a fogyasztás 15%-kal csökkent. a) Mennyi lett a fogyasztás? b) Hány százalékkal nőne újra, ha visszaszerelnénk a régi alkatrészeket?`,
      lepesek: [
        T`a) 15%-os csökkentés → 85% marad: \(8\cdot0{,}85=6{,}8\) liter.`,
        T`b) Most az alap a 6,8 liter! A 8 liter ennek \(8:6{,}8\approx1{,}176\)-szorosa.`,
        T`\(1{,}176\approx117{,}6\%\), tehát kb. <b>17,6%-kal</b> nőne a fogyasztás.`,
        T`Tanulság: nem 15%-kal, mert a növelés a kisebb (új) alapból számolódik.`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
