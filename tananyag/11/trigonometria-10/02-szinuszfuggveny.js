/*
 * Kiegészítő anyag (10. évfolyam) 2. – A szinusz- és a koszinuszfüggvény (Sokszínű matematika 10., Szögfüggvények 1–3. lecke)
 * Témakör: Kiegészítő anyag (10.) a 11.-es trigonometriához · segédfüggvények: TR (tananyag/11/kurzus.js)
 */
(function () {
  const { f, FN, mc } = TR;
  const feladatok = {};
  const R0 = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
  /* f(x) = a·fn(b·x − u) + v  TeX-ben */
  function fT(fn, a, b, u, v) {
    const arg = (b === 1 ? 'x' : b + 'x') + (u === 0 ? '' : u > 0 ? T`-${u}^{\circ}` : T`+${-u}^{\circ}`);
    const aT = a === 1 ? '' : a === -1 ? '-' : (typeof a === 'object' ? ft(a) : a);
    return T`${aT}${FN[fn]}\left(${arg}\right)${v === 0 ? '' : v > 0 ? '+' + v : v}`;
  }
  const RAC = [0, 30, 90, 150, 180, 210, 270, 330];   // ezeknél a szinusz racionális
  const RACC = [0, 60, 90, 120, 180, 240, 270, 300];  // ezeknél a koszinusz racionális

  feladatok.fvErtek = { nev: 'Helyettesítési érték', general() {
    const fn = P(['sin', 'cos']); const a = P([1, 2, 3, -1, -2, 4]); const u = P([0, 0, 30, 60, 90, -30, -90, 45]); const v = R(-3, 3);
    const t = P(fn === 'sin' ? RAC : RACC) + 360 * P([0, 0, 1, -1]); const x0 = t + u;
    const val = F(Math.round(2 * a * f(fn, t)) + 2 * v, 2);
    return { kerdes: T`<p>Számítsd ki a függvény értékét az \(x=${x0}^{\circ}\) helyen!</p>\[f(x)=${fT(fn, a, 1, u, v)}\]`, valasz: { ertekek: [fv(val)] }, formatum: FMT.frac,
      tipp: 'Először a zárójelben lévő szöget számold ki, utána a szögfüggvény értékét (egységkör!), végül szorozz és adj hozzá.',
      megoldas: [T`\[f(${x0}^{\circ})=${a === 1 ? '' : a === -1 ? '-' : a}${FN[fn]}\left(${t}^{\circ}\right)${v === 0 ? '' : v > 0 ? '+' + v : v}=${a === 1 ? '' : a === -1 ? '-' : a + '\\cdot'}\left(${ft(F(Math.round(2 * f(fn, t)), 2))}\right)${v === 0 ? '' : v > 0 ? '+' + v : v}=${ft(val)}\]`] };
  } };

  feladatok.fvSzelso = { nev: 'Legnagyobb, legkisebb érték', general() {
    const fn = P(['sin', 'cos']); const a = R0(-5, 5); const b = P([1, 1, 2, 3]); const u = P([0, 30, 45, 60, 90]); const v = R(-6, 6); const max = R(0, 1) === 1;
    const val = max ? v + Math.abs(a) : v - Math.abs(a);
    return { kerdes: T`<p>Mennyi a függvény ${max ? 'legnagyobb' : 'legkisebb'} értéke?</p>\[f(x)=${fT(fn, a, b, u, v)}\]`, valasz: { ertekek: [val] }, formatum: 'egész szám',
      tipp: T`\(-1\le ${FN[fn]}(\dots)\le 1\). Szorozd meg \(${a}\)-gyel (negatív szorzónál megfordul a sorrend), majd add hozzá \(${v}\)-et.`,
      megoldas: [T`\[-1\le ${FN[fn]}(\dots)\le 1\quad\Rightarrow\quad ${v - Math.abs(a)}\le f(x)\le ${v + Math.abs(a)}\]`, T`A ${max ? 'legnagyobb' : 'legkisebb'} érték: \(${val}\). Az értékkészlet: \([${v - Math.abs(a)};\ ${v + Math.abs(a)}]\).`] };
  } };

  feladatok.fvPeriodus = { nev: 'Periódus', general() {
    const fn = P(['sin', 'cos']); const b = P([2, 3, 4, 5, 6, F(1, 2), F(1, 3), F(2, 3), F(3, 2)]); const bF = typeof b === 'object' ? b : F(b);
    const per = F(360 * bF.d, bF.n); const a = P([1, 2, 3, -1]); const v = R(-3, 3);
    const bT = typeof b === 'object' ? ft(b) : String(b);
    return { kerdes: T`<p>Mennyi a függvény (legkisebb pozitív) periódusa fokban?</p>\[f(x)=${a === 1 ? '' : a === -1 ? '-' : a}${FN[fn]}\left(${bT}x\right)${v === 0 ? '' : v > 0 ? '+' + v : v}\]`, valasz: { ertekek: [fv(per)] }, formatum: 'szám (fok)',
      tipp: T`A \(${FN[fn]}\,x\) periódusa \(360^{\circ}\). Ha \(x\) helyett \(bx\) áll, a grafikon \(b\)-szeresére „összenyomódik”: a periódus \(\frac{360^{\circ}}{b}\). A szorzó és az eltolás nem változtat rajta.`,
      megoldas: [T`\[p=\frac{360^{\circ}}{${bT}}=${nt(fv(per))}^{\circ}\]`] };
  } };

  feladatok.fvMaxHely = { nev: 'Hol van a maximum, minimum?', general() {
    const fn = P(['sin', 'cos']); const u = P([10, 20, 30, 45, 60, 90, 120, -30, -45, -60, -90, 15, 75]); const a = P([1, 2, 3, -1, -2]); const max = R(0, 1) === 1;
    // a·fn(x − u): fn max helye t0 (sin: 90°, cos: 0°); negatív a esetén megfordul
    const keres = (max === (a > 0)) ? (fn === 'sin' ? 90 : 0) : (fn === 'sin' ? 270 : 180);
    const x = ((keres + u) % 360 + 360) % 360;
    return { kerdes: T`<p>A \([0^{\circ};\ 360^{\circ}[\) intervallum melyik pontjában veszi fel a függvény a ${max ? 'legnagyobb' : 'legkisebb'} értékét?</p>\[f(x)=${fT(fn, a, 1, u, 0)}\]`, valasz: { ertekek: [x] }, formatum: 'szám (fok)',
      tipp: T`A \(${FN[fn]}\) ${fn === 'sin' ? T`a \(90^{\circ}\)-nál maximális, a \(270^{\circ}\)-nál minimális` : T`a \(0^{\circ}\)-nál maximális, a \(180^{\circ}\)-nál minimális`}. Negatív szorzónál a maximum és a minimum helyet cserél. A \(${u > 0 ? 'x-' + u : 'x+' + (-u)}^{\circ}\) az egész grafikont ${u > 0 ? 'jobbra' : 'balra'} tolja \(${Math.abs(u)}^{\circ}\)-kal.`,
      megoldas: [T`A zárójelben álló szögnek \(${keres}^{\circ}\)-nak kell lennie: \(x${u > 0 ? '-' + u : '+' + (-u)}^{\circ}=${keres}^{\circ}\Rightarrow x=${keres + u}^{\circ}\)${keres + u !== x ? T`, ami \([0^{\circ};360^{\circ}[\)-ban \(${x}^{\circ}\)` : ''}.`] };
  } };

  const INT = [[0, 90], [90, 180], [180, 270], [270, 360], [90, 270], [-90, 90], [0, 180], [180, 360]];
  feladatok.fvMonoton = { nev: 'Monotonitás', general() {
    const fn = P(['sin', 'cos']); const [lo, hi] = R(0, 2) === 0 ? P(INT) : (() => { const l = R(-6, 11) * 30; return [l, l + R(1, 6) * 30]; })(); const neg = R(0, 3) === 0;
    let up = 0, down = 0; for (let x = lo; x < hi; x += 1) { const d = (neg ? -1 : 1) * (f(fn, x + 1) - f(fn, x)); if (d > 1e-12) up++; else if (d < -1e-12) down++; }
    const h = down === 0 ? 0 : up === 0 ? 1 : 2;
    return { kerdes: T`<p>Milyen a függvény menete a \([${lo}^{\circ};\ ${hi}^{\circ}]\) intervallumon?</p>\[f(x)=${neg ? '-' : ''}${FN[fn]}\,x\]`,
      valasz: { valasztas: ['szigorúan növekvő', 'szigorúan csökkenő', 'nem monoton'], helyes: h },
      tipp: T`Képzeld el (vagy rajzold fel) a grafikont: a \(\sin x\) \([-90^{\circ};90^{\circ}]\)-on nő, \([90^{\circ};270^{\circ}]\)-on csökken; a \(\cos x\) \([0^{\circ};180^{\circ}]\)-on csökken, \([180^{\circ};360^{\circ}]\)-on nő.${neg ? ' A negatív előjel megfordítja.' : ''}`,
      megoldas: [`Az intervallumon a függvény ${['szigorúan növekvő', 'szigorúan csökkenő', 'nem monoton (van, ahol nő, és van, ahol csökken)'][h]}.`] };
  } };

  Tananyag.fejezet({
    id: 'trigk2',
    szint: 'emelt',
    cim: 'A szinusz- és a koszinuszfüggvény (10.)',
    rovid: 'Szinuszfüggvény',
    bevezeto: T`A 10. évfolyam anyaga: a szögfüggvények mint függvények – grafikon, értékkészlet, periódus, transzformációk.`,
    elmelet: T`<div class="prose"><p><b>Tulajdonságok</b> (\(x\) fokban):</p><ul>
<li>Értelmezési tartomány: minden valós szám; értékkészlet: \([-1;\ 1]\).</li>
<li>Periódus: \(360^{\circ}\) (\(2\pi\)).</li>
<li>\(\sin x\): zérushelyek \(k\cdot180^{\circ}\); maximum \(90^{\circ}+k\cdot360^{\circ}\)-nál; páratlan függvény.</li>
<li>\(\cos x\): zérushelyek \(90^{\circ}+k\cdot180^{\circ}\); maximum \(k\cdot360^{\circ}\)-nál; páros függvény; \(\cos x=\sin(x+90^{\circ})\).</li></ul>
<p><b>Transzformációk:</b> \(f(x)=a\sin(bx-u)+v\)</p><ul>
<li>\(a\): függőleges nyújtás (\(|a|\)), negatívnál tükrözés; értékkészlet \([v-|a|;\ v+|a|]\);</li>
<li>\(b\): vízszintes zsugorítás, a periódus \(\frac{360^{\circ}}{b}\);</li>
<li>\(u\): vízszintes eltolás, \(v\): függőleges eltolás.</li></ul></div>`,
    igazHamis: [
      { allitas: T`A \(\sin x\) függvény értékkészlete \([-1;\ 1]\).`, igaz: true, miert: T`Az egységkör pontjának \(y\) koordinátája.` },
      { allitas: T`A \(3\sin x\) legnagyobb értéke 3.`, igaz: true, miert: T`\(\sin x\le1\), így \(3\sin x\le3\), és \(x=90^{\circ}\)-nál egyenlő.` },
      { allitas: T`A \(\sin 2x\) periódusa \(720^{\circ}\).`, igaz: false, miert: T`\(\frac{360^{\circ}}{2}=180^{\circ}\): a grafikon összenyomódik.` },
      { allitas: T`A \(\cos x\) páros függvény.`, igaz: true, miert: T`\(\cos(-x)=\cos x\): a grafikon az \(y\) tengelyre szimmetrikus.` },
      { allitas: T`A \(\sin x+2\) függvénynek van zérushelye.`, igaz: false, miert: T`\(\sin x+2\ge1\gt0\).` },
      { allitas: T`A \(\sin x\) a \([0^{\circ};\ 180^{\circ}]\) intervallumon növekvő.`, igaz: false, miert: T`\(90^{\circ}\)-ig nő, utána csökken.` }
    ],
    mintapelda: {
      feladat: T`Add meg az \(f(x)=2\sin(x-30^{\circ})+1\) függvény értékkészletét és a maximum helyét \([0^{\circ};360^{\circ}[\)-ban!`,
      lepesek: [
        T`\(-1\le\sin(x-30^{\circ})\le1\Rightarrow -2\le 2\sin(\dots)\le2\Rightarrow -1\le f(x)\le 3\).`,
        T`Az értékkészlet \([-1;\ 3]\).`,
        T`Maximum, ha \(x-30^{\circ}=90^{\circ}\), azaz \(x=120^{\circ}\).`
      ]
    },
    grafikon: TR.gorbe(), grafikonCim: 'Szinusz- és koszinuszgörbe', grafikonTag: 'vízszintes egyenessel',
    feladatok
  });
})();
