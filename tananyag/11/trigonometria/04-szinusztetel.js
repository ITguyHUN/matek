/*
 * 4. fejezet – A szinusztétel
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 */
(function () {
  const { nv, sinD, asinD, kerek, tiz, sz, fk, hossz, szog, FH, abraHaromszog } = M11;
  const feladatok = {};
  /* betűhármasok: oldal + szemközti szög */
  const B = [{ o: 'a', s: T`\alpha` }, { o: 'b', s: T`\beta` }, { o: 'c', s: T`\gamma` }];
  const harom = () => { const i = R(0, 2), j = (i + R(1, 2)) % 3, k = 3 - i - j; return [B[i], B[j], B[k]]; };

  feladatok.oldal = { nev: 'Oldal két szögből és egy oldalból', general() {
    const [X, Y, Z] = harom(); let sx, sy; do { sx = R(20, 120); sy = R(15, 120); } while (sx + sy > 165);
    const sz0 = 180 - sx - sy, x = tiz(3, 25, 1);
    if (R(0, 1)) {   /* adott: x, a szemközti szög és az y-nal szemközti szög → y */
      const y = x * sinD(sy) / sinD(sx);
      return { kerdes: T`<p>Egy háromszögben \(${X.o}=${sz(x, 1)}\) cm, \(${X.s}=${sx}^\circ\) és \(${Y.s}=${sy}^\circ\). Milyen hosszú ${nv(Y.o)} \(${Y.o}\) oldal?</p>`,
        valasz: hossz(y), formatum: 'cm, ' + FH.hossz, tipp: T`Az ismert oldal és a vele szemközti szög egy „teljes pár”. Szinusztétel: \(\frac{${Y.o}}{${X.o}}=\frac{\sin ${Y.s}}{\sin ${X.s}}\).`,
        megoldas: [T`\[\frac{${Y.o}}{${sz(x, 1)}}=\frac{\sin ${sy}^\circ}{\sin ${sx}^\circ}\quad\Rightarrow\quad ${Y.o}=\frac{${sz(x, 1)}\cdot\sin ${sy}^\circ}{\sin ${sx}^\circ}\approx ${sz(y)}\ \text{cm}\]`] };
    }
    /* adott: x és a másik két szög (a szemközti szöget előbb ki kell számolni) → y */
    const y = x * sinD(sy) / sinD(sx);
    return { kerdes: T`<p>Egy háromszögben \(${X.o}=${sz(x, 1)}\) cm, \(${Y.s}=${sy}^\circ\) és \(${Z.s}=${sz0}^\circ\). Milyen hosszú ${nv(Y.o)} \(${Y.o}\) oldal?</p>`,
      valasz: hossz(y), formatum: 'cm, ' + FH.hossz, tipp: T`Előbb számold ki az ismert oldallal szemközti szöget: \(${X.s}=180^\circ-${Y.s}-${Z.s}\). Utána szinusztétel.`,
      megoldas: [T`\[${X.s}=180^\circ-${sy}^\circ-${sz0}^\circ=${sx}^\circ\]`, T`\[${Y.o}=\frac{${sz(x, 1)}\cdot\sin ${sy}^\circ}{\sin ${sx}^\circ}\approx ${sz(y)}\ \text{cm}\]`] };
  } };

  feladatok.szog = { nev: 'Szög: a nagyobb oldallal szemközti szög adott', general() {
    const [X, Y] = harom(); const sx = R(0, 3) === 0 ? R(95, 150) : R(25, 89);
    const x = tiz(5, 25, 1); let y; do { y = tiz(2, x - 0.5, 1); } while (y >= x);
    const s = y * sinD(sx) / x, sy = asinD(s);
    return { kerdes: T`<p>Egy háromszögben \(${X.o}=${sz(x, 1)}\) cm, \(${Y.o}=${sz(y, 1)}\) cm és \(${X.s}=${sx}^\circ\). Mekkora ${nv(Y.s)} \(${Y.s}\) szög?</p>`,
      valasz: szog(sy), formatum: FH.szog,
      tipp: T`Szinusztétel: \(\sin ${Y.s}=\frac{${Y.o}\cdot\sin ${X.s}}{${X.o}}\). Mivel \(${Y.o}\lt ${X.o}\), ${nv(Y.s)} \(${Y.s}\) kisebb, mint \(${X.s}\): csak hegyesszög lehet.`,
      megoldas: [T`\[\frac{\sin ${Y.s}}{\sin ${sx}^\circ}=\frac{${sz(y, 1)}}{${sz(x, 1)}}\quad\Rightarrow\quad\sin ${Y.s}=\frac{${sz(y, 1)}\cdot\sin ${sx}^\circ}{${sz(x, 1)}}\approx ${sz(s, 4)}\]`,
        T`\[${Y.s}\approx ${fk(sy)}\]`, T`A \(180^\circ-${fk(sy)}\) nem jó: kisebb oldallal szemben kisebb szög van, \(${Y.s}\lt ${X.s}\)${sx > 90 ? ' (és egy háromszögben csak egy tompaszög lehet)' : ''}.`] };
  } };

  feladatok.ketMegoldas = { nev: 'Hány háromszög? (0, 1 vagy 2 megoldás)', general() {
    const [X, Y] = harom(); const sx = R(20, 70); const eset = P([2, 2, 2, 1, 0]);
    let x, y;
    if (eset === 2) { y = tiz(6, 25, 1); const lo = y * sinD(sx); x = tiz(Math.ceil((lo + 0.3) * 10) / 10, y - 0.3, 1); if (!(x > lo + 0.2 && x < y - 0.2)) return this.general(); }
    else if (eset === 1) { y = tiz(4, 20, 1); x = tiz(y + 0.3, y + 10, 1); }
    else { y = tiz(6, 25, 1); const lo = y * sinD(sx); if (lo < 1.3) return this.general(); x = tiz(1, lo - 0.3, 1); if (x >= lo - 0.2) return this.general(); }
    const s = y * sinD(sx) / x;
    const fej = T`<p>Egy háromszögben \(${X.o}=${sz(x, 1)}\) cm, \(${Y.o}=${sz(y, 1)}\) cm és \(${X.s}=${sx}^\circ\). Mekkora lehet ${nv(Y.s)} \(${Y.s}\) szög?</p><p>Add meg az összes lehetséges értéket! Ha nincs ilyen háromszög, írd: nincs.</p>`;
    const elso = T`\[\sin ${Y.s}=\frac{${Y.o}\cdot\sin ${X.s}}{${X.o}}=\frac{${sz(y, 1)}\cdot\sin ${sx}^\circ}{${sz(x, 1)}}\approx ${sz(s, 4)}\]`;
    const tipp = T`Szinusztétellel számold ki \(\sin ${Y.s}\)-t. Ha nagyobb 1-nél, nincs megoldás. Ha nem, a \(${Y.s}\) hegyesszög és a kiegészítő szöge is szóba jön: ellenőrizd, hogy a háromszög szögeinek összege \(180^\circ\) alatt marad-e (a nagyobb oldallal szemben van-e a nagyobb szög).`;
    if (eset === 0) return { kerdes: fej, valasz: { nincs: true }, formatum: 'fokban, vagy: nincs', tipp,
      megoldas: [elso, T`\(\sin ${Y.s}\gt 1\) nem lehet, tehát ilyen háromszög nem létezik. (Az \(${X.o}\) oldal rövidebb, mint a \(${Y.o}\cdot\sin ${X.s}\approx ${sz(y * sinD(sx))}\) magasság.)`] };
    const b1 = asinD(s), b2 = 180 - b1;
    if (eset === 1) return { kerdes: fej, valasz: szog(b1), formatum: FH.szogok, tipp,
      megoldas: [elso, T`\[${Y.s}_1\approx ${fk(b1)}\]`, T`A \(${Y.s}_2=180^\circ-${fk(b1)}=${fk(b2)}\) nem jó: \(${Y.o}\lt ${X.o}\), ezért \(${Y.s}\lt ${X.s}=${sx}^\circ\) kell legyen. Egy megoldás van.`] };
    return { kerdes: fej, valasz: szog(b1, b2), formatum: FH.szogok, tipp,
      megoldas: [elso, T`\[${Y.s}_1\approx ${fk(b1)}\qquad ${Y.s}_2=180^\circ-${fk(b1)}\approx ${fk(b2)}\]`, T`Mindkettő jó, mert \(${Y.o}\gt ${X.o}\) miatt \(${Y.s}\gt ${X.s}\) mindkét esetben teljesül, és \(${sx}^\circ+${fk(b2)}\lt 180^\circ\). Két különböző háromszög létezik.`] };
  } };

  feladatok.legnagyobb = { nev: 'Leghosszabb, legrövidebb oldal', general() {
    let al, be; do { al = R(15, 120); be = R(15, 120); } while (al + be > 160 || Math.abs(al - be) < 4 || Math.abs(180 - al - be - al) < 4 || Math.abs(180 - al - be - be) < 4);
    const sz3 = [al, be, 180 - al - be]; const min = Math.min(...sz3), max = Math.max(...sz3);
    const L = tiz(3, 20, 1), forditva = R(0, 1);
    const ered = forditva ? L * sinD(min) / sinD(max) : L * sinD(max) / sinD(min);
    return { kerdes: T`<p>Egy háromszög két szöge \(${al}^\circ\) és \(${be}^\circ\), ${forditva ? 'leghosszabb' : 'legrövidebb'} oldala \(${sz(L, 1)}\) cm. Milyen hosszú a ${forditva ? 'legrövidebb' : 'leghosszabb'} oldala?</p>`,
      valasz: hossz(ered), formatum: 'cm, ' + FH.hossz,
      tipp: 'Számold ki a harmadik szöget. A legnagyobb szöggel szemben van a leghosszabb, a legkisebbel szemben a legrövidebb oldal. Utána szinusztétel.',
      megoldas: [T`A harmadik szög \(180^\circ-${al}^\circ-${be}^\circ=${180 - al - be}^\circ\). A legkisebb szög \(${min}^\circ\), a legnagyobb \(${max}^\circ\).`,
        T`\[\frac{x}{${sz(L, 1)}}=\frac{\sin ${forditva ? min : max}^\circ}{\sin ${forditva ? max : min}^\circ}\quad\Rightarrow\quad x\approx ${sz(ered)}\ \text{cm}\]`] };
  } };

  feladatok.szoveges = { nev: 'Hozzáférhetetlen pont távolsága', general() {
    const d = R(40, 400), al = R(30, 85), be = R(30, 85), ga = 180 - al - be; if (ga < 15) return this.general();
    const AC = d * sinD(be) / sinD(ga), BC = d * sinD(al) / sinD(ga), eset = R(0, 2);
    const fej = T`<p>Egy folyó egyenes partján kijelöltük az \(A\) és \(B\) pontot, \(AB=${d}\) m. A túlparton álló \(C\) fát \(A\)-ból az \(AB\) egyenessel \(${al}^\circ\)-os, \(B\)-ből \(${be}^\circ\)-os szögben látjuk.</p>`;
    if (eset === 0) return { kerdes: T`${fej}<p>Milyen messze van a fa az \(A\) ponttól?</p>`, valasz: hossz(AC), formatum: 'm, ' + FH.hossz,
      tipp: T`Az \(ABC\) háromszögben ismert egy oldal és a rajta fekvő két szög. A \(C\)-nél lévő szög \(180^\circ-${al}^\circ-${be}^\circ\). Az \(AC\) oldallal a \(B\)-nél lévő szög van szemben.`,
      megoldas: [T`\[ACB\sphericalangle=180^\circ-${al}^\circ-${be}^\circ=${ga}^\circ\]`, T`\[\frac{AC}{${d}}=\frac{\sin ${be}^\circ}{\sin ${ga}^\circ}\quad\Rightarrow\quad AC\approx ${sz(AC)}\ \text{m}\]`] };
    if (eset === 1) return { kerdes: T`${fej}<p>Milyen messze van a fa a \(B\) ponttól?</p>`, valasz: hossz(BC), formatum: 'm, ' + FH.hossz,
      tipp: T`A \(C\)-nél lévő szög \(180^\circ-${al}^\circ-${be}^\circ\). A \(BC\) oldallal az \(A\)-nál lévő szög van szemben.`,
      megoldas: [T`\[ACB\sphericalangle=${ga}^\circ\qquad\frac{BC}{${d}}=\frac{\sin ${al}^\circ}{\sin ${ga}^\circ}\quad\Rightarrow\quad BC\approx ${sz(BC)}\ \text{m}\]`] };
    const h = AC * sinD(al);
    return { kerdes: T`${fej}<p>Milyen széles a folyó (milyen messze van a fa az \(AB\) egyenestől)?</p>`, valasz: hossz(h), formatum: 'm, ' + FH.hossz,
      tipp: T`Előbb számold ki szinusztétellel az \(AC\) távolságot, majd a \(C\)-ből az \(AB\)-re bocsátott merőleges derékszögű háromszögében: \(m=AC\cdot\sin ${al}^\circ\).`,
      megoldas: [T`\[ACB\sphericalangle=${ga}^\circ\qquad AC=\frac{${d}\cdot\sin ${be}^\circ}{\sin ${ga}^\circ}\approx ${sz(AC)}\ \text{m}\]`, T`\[m=AC\cdot\sin ${al}^\circ\approx ${sz(h)}\ \text{m}\]`] };
  } };

  feladatok.korulirt = { nev: 'Körülírt kör sugara', szint: 'emelt', general() {
    const [X] = harom(); const sx = R(15, 165);
    if (R(0, 1)) { const x = tiz(3, 25, 1), Rr = x / (2 * sinD(sx));
      return { kerdes: T`<p>Egy háromszögben \(${X.o}=${sz(x, 1)}\) cm és \(${X.s}=${sx}^\circ\). Mekkora a háromszög köré írt kör sugara?</p>`, valasz: hossz(Rr), formatum: 'cm, ' + FH.hossz,
        tipp: T`A szinusztétel teljes alakja: \(\frac{a}{\sin\alpha}=\frac{b}{\sin\beta}=\frac{c}{\sin\gamma}=2R\).`,
        megoldas: [T`\[2R=\frac{${X.o}}{\sin ${X.s}}=\frac{${sz(x, 1)}}{\sin ${sx}^\circ}\quad\Rightarrow\quad R\approx ${sz(Rr)}\ \text{cm}\]`] }; }
    const Rr = tiz(2, 15, 1), x = 2 * Rr * sinD(sx);
    return { kerdes: T`<p>Egy háromszög köré írt körének sugara \(${sz(Rr, 1)}\) cm, egyik szöge \(${X.s}=${sx}^\circ\). Milyen hosszú a vele szemközti \(${X.o}\) oldal?</p>`, valasz: hossz(x), formatum: 'cm, ' + FH.hossz,
      tipp: T`\(${X.o}=2R\cdot\sin ${X.s}\).`, megoldas: [T`\[${X.o}=2R\sin ${X.s}=2\cdot ${sz(Rr, 1)}\cdot\sin ${sx}^\circ\approx ${sz(x)}\ \text{cm}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig04',
    cim: 'A szinusztétel',
    rovid: 'Szinusztétel',
    bevezeto: 'Bármely háromszögben az oldalak úgy aránylanak egymáshoz, mint a velük szemközti szögek szinuszai.',
    elmelet: T`<div class="prose">${abraHaromszog()}<p><b>Szinusztétel.</b> Bármely háromszögben két oldal aránya egyenlő a velük szemközti szögek szinuszának arányával:</p></div>
<div class="mathbox">\[\frac{a}{b}=\frac{\sin\alpha}{\sin\beta}\qquad\text{vagyis}\qquad \frac{a}{\sin\alpha}=\frac{b}{\sin\beta}=\frac{c}{\sin\gamma}\qquad a:b:c=\sin\alpha:\sin\beta:\sin\gamma\]</div>
<div class="prose"><p><b>Bizonyítás</b> (érettségin szóban kérhetik): húzzuk be a \(C\) csúcsból az \(m_c\) magasságot. Az \(A\)-nál és a \(B\)-nél lévő derékszögű háromszögben \(m_c=b\sin\alpha\) és \(m_c=a\sin\beta\) (tompa szög esetén a kiegészítő szöggel, de \(\sin(180^\circ-\beta)=\sin\beta\)). Tehát \(b\sin\alpha=a\sin\beta\), átrendezve \(\frac{a}{b}=\frac{\sin\alpha}{\sin\beta}\).</p>
<p><b>Mikor használjuk?</b> Ha van egy „teljes pár” (egy oldal és a vele szemközti szög), és még egy adat:</p>
<ul><li>két szög és egy oldal → a harmadik szög \(180^\circ\)-ból, utána a hiányzó oldalak;</li>
<li>két oldal és az egyikkel szemközti szög → a másik oldallal szemközti szög. Ilyenkor vigyázat:
<ul><li>ha a <b>nagyobb</b> oldallal szemközti szög adott, egy megoldás van (a keresett szög hegyesszög);</li>
<li>ha a <b>kisebb</b> oldallal szemközti szög adott, \(\sin\beta\)-ból két szög jöhet: \(\beta_1\) és \(180^\circ-\beta_1\). Mindkettőt ellenőrizni kell, és lehet 2, 1 vagy 0 megoldás (ha \(\sin\beta\gt 1\)).</li></ul></li></ul>
<p>Hasznos: <b>nagyobb oldallal szemben nagyobb szög</b> van. A legnagyobb szöggel szemben a leghosszabb oldal fekszik.</p>
<p><span class="lvl emelt">emelt</span> A közös hányados a köré írt kör átmérője: \(\frac{a}{\sin\alpha}=2R\).</p></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`Bármely háromszögben \(a\cdot\sin\beta=b\cdot\sin\alpha\).`, igaz: true, miert: T`Ez a szinusztétel átrendezve; mindkét oldal a \(C\)-ből húzott magasság.` },
      { allitas: T`Ha \(\alpha=2\beta\), akkor \(a=2b\).`, igaz: false, miert: T`Az oldalak a szögek <i>szinuszával</i> arányosak, nem a szögekkel. Pl. \(\alpha=60^\circ\), \(\beta=30^\circ\): \(a:b=\sqrt3:1\).` },
      { allitas: T`Egy háromszögben a legnagyobb szöggel szemben van a leghosszabb oldal.`, igaz: true, miert: 'Ez a háromszög egyik alaptulajdonsága; a szinusztétel szerint is így van.' },
      { allitas: T`Ha \(a=5\), \(b=8\) és \(\alpha=30^\circ\), akkor két különböző háromszög is van ezekkel az adatokkal.`, igaz: true, miert: T`\(\sin\beta=\frac{8\cdot 0{,}5}{5}=0{,}8\), \(\beta\approx 53{,}1^\circ\) vagy \(126{,}9^\circ\), és mindkettő mellett marad hely a harmadik szögnek.` },
      { allitas: T`Ha \(a=8\), \(b=5\) és \(\alpha=30^\circ\), akkor két különböző háromszög is van.`, igaz: false, miert: T`Most a nagyobb oldallal szemközti szög adott: \(\beta\lt\alpha\), így \(\beta\) csak hegyesszög lehet; egy megoldás van.` },
      { allitas: T`Ha \(a=3\), \(b=10\) és \(\alpha=40^\circ\), akkor nincs ilyen háromszög.`, igaz: true, miert: T`\(\sin\beta=\frac{10\cdot\sin 40^\circ}{3}\approx 2{,}14\gt 1\).` },
      { allitas: T`Az egyenlő oldalú háromszögben \(\frac{a}{\sin\alpha}=\frac{a}{\sin 60^\circ}\) mindhárom oldalra ugyanaz.`, igaz: true, miert: 'Minden oldal és minden szög egyenlő.' },
      { allitas: T`A szinusztétel csak hegyesszögű háromszögekre igaz.`, igaz: false, miert: 'Tompaszögű és derékszögű háromszögre is igaz (a bizonyításban sin(180° − β) = sin β).' },
      { allitas: T`Ha egy háromszög szögei \(30^\circ\), \(60^\circ\), \(90^\circ\), akkor az oldalak aránya \(1:\sqrt3:2\).`, igaz: true, miert: T`\(\sin 30^\circ:\sin 60^\circ:\sin 90^\circ=\frac12:\frac{\sqrt3}{2}:1=1:\sqrt3:2\).` },
      { allitas: T`Szinusztétellel közvetlenül kiszámítható a harmadik oldal, ha két oldal és a közbezárt szög adott.`, igaz: false, miert: 'Ilyenkor nincs „teljes pár” (oldal és szemközti szög); a koszinusztétel kell.' },
      { allitas: T`A \(\frac{a}{\sin\alpha}\) hányados a köré írt kör átmérőjével egyenlő.`, igaz: true, szint: 'emelt', miert: T`\(\frac{a}{\sin\alpha}=2R\) (a kerületi szögek tételéből).` },
      { general() { const a = R(20, 70), b = R(20, 70); if (a === b) return { allitas: T`Ha \(\alpha=\beta\), akkor \(a=b\).`, igaz: true, miert: 'Egyenlő szögekkel szemben egyenlő oldalak vannak.' };
        const jo = R(0, 1); return { allitas: T`Ha egy háromszögben \(\alpha=${a}^\circ\) és \(\beta=${b}^\circ\), akkor \(a${(a > b) === !!jo ? '\\gt' : '\\lt'} b\).`, igaz: !!jo, miert: T`Nagyobb szöggel szemben nagyobb oldal van: \(${a > b ? 'a\\gt b' : 'a\\lt b'}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy háromszögben \(a=7\) cm, \(b=10\) cm és \(\alpha=40^\circ\). Mekkora lehet a \(\beta\) szög és a \(c\) oldal?`,
      lepesek: [
        T`Szinusztétel: \[\sin\beta=\frac{b\sin\alpha}{a}=\frac{10\cdot\sin 40^\circ}{7}\approx 0{,}9183\]`,
        T`\(\beta_1\approx 66{,}7^\circ\) vagy \(\beta_2\approx 113{,}3^\circ\). A kisebb oldallal (\(a\)) szemközti szög adott, ezért mindkettőt meg kell vizsgálni: \(40^\circ+113{,}3^\circ\lt 180^\circ\), tehát mindkettő jó.`,
        T`1. eset: \(\gamma_1=180^\circ-40^\circ-66{,}7^\circ=73{,}3^\circ\), \(c_1=\frac{7\sin 73{,}3^\circ}{\sin 40^\circ}\approx 10{,}43\) cm.`,
        T`2. eset: \(\gamma_2=180^\circ-40^\circ-113{,}3^\circ=26{,}7^\circ\), \(c_2=\frac{7\sin 26{,}7^\circ}{\sin 40^\circ}\approx 4{,}89\) cm.`,
        'Két háromszög felel meg a feltételeknek.'
      ]
    },
    grafikon: M11.haromszog({ mod: 'szinusz' }),
    grafikonCim: 'Szinusztétel a gyakorlatban',
    grafikonTag: 'a / sin α mindig ugyanannyi',
    feladatok
  });
})();
