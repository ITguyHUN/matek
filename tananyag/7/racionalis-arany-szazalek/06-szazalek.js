/*
 * 6. fejezet – Százalékszámítás
 * Témakör: Racionális számok, arányosság, százalék (7. évfolyam, TK 4. lecke)
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
<li><b>Kördiagram:</b> a teljes kör 360° = 100%, így 1% = 3,6°.</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(40\%=\frac25\)`, igaz: true, miert: T`\(40\%=\frac{40}{100}=\frac25\).` },
      { allitas: T`Ha egy árat 20%-kal növelünk, majd 20%-kal csökkentünk, visszakapjuk az eredetit.`, igaz: false, miert: T`\(1{,}2\cdot0{,}8=0{,}96\), tehát az eredeti 96%-a lesz. A második 20% nagyobb alapból számolódik.` },
      { allitas: T`8 literes fogyasztás 15%-kal csökkentve 6,8 liter.`, igaz: true, miert: T`\(8\cdot0{,}85=6{,}8\).` },
      { allitas: T`Ha 120% = 600, akkor az alap 720.`, igaz: false, miert: T`Az alap a 100%: \(600:1{,}2=500\). (A 720 a 600 120%-a lenne.)` },
      { allitas: T`Kördiagramon a 25%-hoz 90°-os középponti szög tartozik.`, igaz: true, miert: T`\(360°\cdot0{,}25=90°\), ez a kör negyede.` }
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
