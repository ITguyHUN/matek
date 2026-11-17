/*
 * 6. fejezet – Háromszögek megoldása (szinusz- és koszinusztétel együtt)
 * Témakör: Trigonometria (11. évfolyam) · közös segédfüggvények: M11 (tananyag/11/kurzus.js)
 */
(function () {
  const { nv, sinD, cosD, asinD, acosD, kerek, tiz, sz, fk, hossz, szog, FH } = M11;
  const feladatok = {};
  const SZOG = { a: T`\alpha`, b: T`\beta`, c: T`\gamma` };
  function haromOldal(min = 3, max = 25) { let a, b, c; do { a = tiz(min, max, 1); b = tiz(min, max, 1); c = tiz(min, max, 1); } while (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1); return [a, b, c]; }
  const keverd = t => { const a = t.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  feladatok.melyik = { nev: 'Melyik tétellel kezdjünk?', general() {
    const [x, y, z] = keverd(['a', 'b', 'c']); const eset = R(0, 4);
    const o = () => T`${sz(tiz(3, 20, 1), 1)}`, s = () => R(20, 110);
    let adat, helyes, miert;
    if (eset === 0) { adat = T`\(${x}=${o()}\) cm, \(${y}=${o()}\) cm, \(${z}=${o()}\) cm`; helyes = 1; miert = 'Három oldal adott: bármelyik szög a koszinusztételből (cos-ra rendezve) számolható.'; }
    else if (eset === 1) { adat = T`\(${x}=${o()}\) cm, \(${y}=${o()}\) cm és \(${SZOG[z]}=${s()}^\circ\)`; helyes = 1; miert = T`Két oldal és a közbezárt szög (\(${SZOG[z]}\) ${nv(x)} \(${x}\) és ${nv(y)} \(${y}\) oldal között van): a harmadik oldal koszinusztétellel.`; }
    else if (eset === 2) { const p = R(20, 80), q = R(20, 80); adat = T`\(${x}=${o()}\) cm, \(${SZOG[y]}=${p}^\circ\) és \(${SZOG[z]}=${q}^\circ\)`; helyes = 0; miert = T`Két szög adott, így a harmadik is (\(180^\circ\)-ból). Ezzel az \(${x}\) oldal és a vele szemközti szög „teljes pár”: szinusztétel.`; }
    else if (eset === 3) { adat = T`\(${x}=${o()}\) cm, \(${y}=${o()}\) cm és \(${SZOG[x]}=${s()}^\circ\)`; helyes = 0; miert = T`Az \(${x}\) oldal és a vele szemközti \(${SZOG[x]}\) „teljes pár”, így szinusztétellel kapjuk \(\sin ${SZOG[y]}\)-t. (A koszinusztétel is működne, de másodfokú egyenletre vezet.)`; }
    else { adat = T`\(${SZOG[z]}=90^\circ\), \(${x}=${o()}\) cm és \(${SZOG[x]}=${R(15, 75)}^\circ\)`; helyes = 2; miert = 'Derékszögű háromszög: elég a hegyesszögek szögfüggvényeit használni (a szinusztétel is helyes eredményt ad, csak hosszabb).'; }
    return { kerdes: T`<p>Egy háromszögről ezt tudjuk: ${adat}. Melyik összefüggéssel érdemes kezdeni a hiányzó adatok kiszámítását?</p>`,
      valasz: { valasztas: ['szinusztétel', 'koszinusztétel', 'derékszögű háromszög szögfüggvényei'], helyes },
      tipp: 'Van-e „teljes pár” (oldal és a vele szemközti szög)? Ha igen: szinusztétel. Ha nincs, de két oldal és a közbezárt szög vagy három oldal adott: koszinusztétel. Derékszögű háromszögben elég a sin, cos, tg.',
      megoldas: [miert] };
  } };

  feladatok.sasSzog = { nev: 'Két oldal, közbezárt szög → másik szög', general() {
    const [x, y, z] = keverd(['a', 'b', 'c']);   /* adott: y, z és a köztük lévő szög (x-szel szemközti) */
    const p = tiz(4, 20, 1), q = tiz(4, 20, 1), g = R(25, 140);
    const o = Math.sqrt(p * p + q * q - 2 * p * q * cosD(g));
    const ker = R(0, 1) ? y : z, kp = ker === y ? p : q, mas = ker === y ? q : p;
    const cs = (o * o + mas * mas - kp * kp) / (2 * o * mas), sk = acosD(cs);
    return { kerdes: T`<p>Egy háromszögben \(${y}=${sz(p, 1)}\) cm, \(${z}=${sz(q, 1)}\) cm és \(${SZOG[x]}=${g}^\circ\). Mekkora ${nv(SZOG[ker])} \(${SZOG[ker]}\) szög?</p>`,
      valasz: szog(sk), formatum: FH.szog,
      tipp: T`1. lépés: koszinusztétellel ${nv(x)} \(${x}\) oldal. 2. lépés: ${nv(SZOG[ker])} \(${SZOG[ker]}\) koszinusztétellel (cos-ra rendezve), vagy szinusztétellel – de ez utóbbinál vigyázz, a szög tompaszög is lehet!`,
      megoldas: [T`\[${x}^2=${sz(p, 1)}^2+${sz(q, 1)}^2-2\cdot ${sz(p, 1)}\cdot ${sz(q, 1)}\cdot\cos ${g}^\circ\approx ${sz(o * o)}\quad\Rightarrow\quad ${x}\approx ${sz(o, 3)}\]`,
        T`\[\cos ${SZOG[ker]}=\frac{${x}^2+${ker === y ? z : y}^2-${ker}^2}{2\cdot ${x}\cdot ${ker === y ? z : y}}\approx\frac{${sz(o * o)}+${sz(mas * mas)}-${sz(kp * kp)}}{2\cdot ${sz(o, 3)}\cdot ${sz(mas, 1)}}\approx ${sz(cs, 4)}\]`,
        T`\[${SZOG[ker]}\approx ${fk(sk)}\]`] };
  } };

  feladatok.sssTerulet = { nev: 'Terület három oldalból', general() {
    const [a, b, c] = haromOldal(3, 20); const ga = acosD((a * a + b * b - c * c) / (2 * a * b)), Tr = a * b * sinD(ga) / 2;
    return { kerdes: T`<p>Egy háromszög oldalai \(${sz(a, 1)}\) cm, \(${sz(b, 1)}\) cm és \(${sz(c, 1)}\) cm. Mekkora a területe?</p>`,
      valasz: hossz(Tr), formatum: 'cm², ' + FH.hossz,
      tipp: 'Koszinusztétellel számold ki az egyik szöget (például a harmadik oldallal szemközti szöget), majd T = a·b·sin γ / 2.',
      megoldas: [T`Legyen \(a=${sz(a, 1)}\), \(b=${sz(b, 1)}\), \(c=${sz(c, 1)}\).`, T`\[\cos\gamma=\frac{a^2+b^2-c^2}{2ab}=\frac{${sz(a * a)}+${sz(b * b)}-${sz(c * c)}}{${sz(2 * a * b)}}\approx ${sz((a * a + b * b - c * c) / (2 * a * b), 4)}\quad\Rightarrow\quad\gamma\approx ${fk(ga, 2)}\]`,
        T`\[T=\frac{a\cdot b\cdot\sin\gamma}{2}\approx ${sz(Tr)}\ \text{cm}^2\]`] };
  } };

  feladatok.belsoSzakasz = { nev: 'Súlyvonal, magasság', general() {
    const [a, b, c] = haromOldal(4, 20); const al = acosD((b * b + c * c - a * a) / (2 * b * c));
    const eset = R(0, 1);
    const elso = T`\[\cos\alpha=\frac{b^2+c^2-a^2}{2bc}=\frac{${sz(b * b)}+${sz(c * c)}-${sz(a * a)}}{${sz(2 * b * c)}}\approx ${sz(cosD(al), 4)}\quad\Rightarrow\quad\alpha\approx ${fk(al, 2)}\]`;
    const fej = T`<p>Az \(ABC\) háromszög oldalai \(a=${sz(a, 1)}\) cm, \(b=${sz(b, 1)}\) cm és \(c=${sz(c, 1)}\) cm.</p>`;
    if (eset === 0) { const s = Math.sqrt(b * b + c * c / 4 - b * c * cosD(al));
      return { kerdes: T`${fej}<p>Milyen hosszú a \(C\) csúcsból induló súlyvonal (\(s_c\))?</p>`, valasz: hossz(s), formatum: 'cm, ' + FH.hossz,
        tipp: T`A súlyvonal a \(C\) csúcsot az \(AB\) oldal \(F\) felezőpontjával köti össze. Az \(AFC\) háromszögben ismert \(AC=b\), \(AF=\frac{c}{2}\) és köztük az \(\alpha\) szög – amit előbb ki kell számolni.`,
        megoldas: [elso, T`\[s_c^2=b^2+\left(\frac{c}{2}\right)^2-2\cdot b\cdot\frac{c}{2}\cdot\cos\alpha\approx ${sz(s * s)}\quad\Rightarrow\quad s_c\approx ${sz(s)}\ \text{cm}\]`] }; }
    const m = b * sinD(al);
    return { kerdes: T`${fej}<p>Milyen hosszú a \(C\) csúcsból induló magasság (\(m_c\))?</p>`, valasz: hossz(m), formatum: 'cm, ' + FH.hossz,
      tipp: T`Számold ki az \(\alpha\) szöget koszinusztétellel. A \(C\)-ből húzott magasság talppontjával kapott derékszögű háromszögben \(m_c=b\cdot\sin\alpha\).`,
      megoldas: [elso, T`\[m_c=b\cdot\sin\alpha\approx ${sz(b, 1)}\cdot\sin ${fk(al, 2)}\approx ${sz(m)}\ \text{cm}\]`] };
  } };

  feladatok.kerulet = { nev: 'Kerület két szögből és egy oldalból', general() {
    let al, be; do { al = R(25, 110); be = R(20, 100); } while (al + be > 160);
    const ga = 180 - al - be, a = tiz(3, 20, 1), b = a * sinD(be) / sinD(al), c = a * sinD(ga) / sinD(al), k = a + b + c;
    return { kerdes: T`<p>Egy háromszögben \(a=${sz(a, 1)}\) cm, \(\beta=${be}^\circ\) és \(\gamma=${ga}^\circ\). Mekkora a háromszög kerülete?</p>`,
      valasz: hossz(k), formatum: 'cm, ' + FH.hossz,
      tipp: T`Előbb \(\alpha=180^\circ-\beta-\gamma\), majd szinusztétellel \(b\) és \(c\).`,
      megoldas: [T`\[\alpha=180^\circ-${be}^\circ-${ga}^\circ=${al}^\circ\]`, T`\[b=\frac{a\sin\beta}{\sin\alpha}\approx ${sz(b)},\qquad c=\frac{a\sin\gamma}{\sin\alpha}\approx ${sz(c)}\]`, T`\[K=a+b+c\approx ${sz(k)}\ \text{cm}\]`] };
  } };

  feladatok.korulirt = { nev: 'Köré írt kör sugara három oldalból', szint: 'emelt', general() {
    const [a, b, c] = haromOldal(4, 20); const al = acosD((b * b + c * c - a * a) / (2 * b * c)), Rr = a / (2 * sinD(al));
    return { kerdes: T`<p>Egy háromszög oldalai \(a=${sz(a, 1)}\) cm, \(b=${sz(b, 1)}\) cm és \(c=${sz(c, 1)}\) cm. Mekkora a köré írt kör sugara?</p>`,
      valasz: hossz(Rr), formatum: 'cm, ' + FH.hossz, tipp: T`Koszinusztétellel egy szög (pl. \(\alpha\)), majd \(\frac{a}{\sin\alpha}=2R\).`,
      megoldas: [T`\[\cos\alpha=\frac{b^2+c^2-a^2}{2bc}\approx ${sz(cosD(al), 4)}\quad\Rightarrow\quad\alpha\approx ${fk(al, 2)}\]`, T`\[R=\frac{a}{2\sin\alpha}\approx ${sz(Rr)}\ \text{cm}\]`] };
  } };

  Tananyag.fejezet({
    id: 'trig06',
    cim: 'Háromszögek megoldása',
    rovid: 'Háromszögek megoldása',
    bevezeto: 'Három független adatból (amelyek közül legalább egy oldal) a háromszög minden adata kiszámítható. A kérdés mindig az, melyik tétellel induljunk.',
    elmelet: T`<div class="tbl"><table><tr><th>Adott</th><th>Első lépés</th><th>Megjegyzés</th></tr>
<tr><td>3 oldal (o, o, o)</td><td>koszinusztétel → egy szög</td><td>érdemes a legnagyobb szöggel kezdeni (kiderül, tompa-e)</td></tr>
<tr><td>2 oldal + közbezárt szög (o, sz, o)</td><td>koszinusztétel → 3. oldal</td><td>utána a kisebbik szöget szinusztétellel, vagy koszinusztétellel</td></tr>
<tr><td>1 oldal + 2 szög</td><td>3. szög = 180° − …, szinusztétel</td><td>mindig egyértelmű</td></tr>
<tr><td>2 oldal + az egyikkel szemközti szög (o, o, sz)</td><td>szinusztétel → a másik szemközti szög</td><td>0, 1 vagy 2 megoldás – ellenőrizd!</td></tr>
<tr><td>derékszögű háromszög</td><td>sin, cos, tg, Pitagorasz-tétel</td><td>a tételek is működnek, de hosszabb</td></tr></table></div>
<div class="prose"><p><b>Megoldási terv</b> (érettségin ezt is pontozzák):</p>
<ul><li>Ábra a szokásos jelölésekkel; az adatok és a keresett mennyiség bejelölése.</li>
<li>Melyik háromszögben dolgozom? (Összetett ábrán részháromszögeket keress: súlyvonal, magasság, átló.)</li>
<li>A tétel felírása betűkkel, aztán behelyettesítés.</li>
<li><b>Kerekítés:</b> a részeredményeket legalább 3–4 tizedesjegyre tartsd meg (vagy a számológép memóriájában), csak a végeredményt kerekítsd.</li>
<li>Ellenőrzés: szögek összege \(180^\circ\); nagyobb oldallal szemben nagyobb szög.</li>
<li><b>Szöget szinusztétellel</b> mindig a kisebb oldallal szemben számolj (az biztosan hegyesszög), a legnagyobbat inkább koszinusztétellel.</li></ul>
<p><b>Súlyvonal, magasság:</b> az \(s_c\) súlyvonal az \(AFC\) háromszögben (\(F\) az \(AB\) felezőpontja) koszinusztétellel számolható, ha \(\alpha\) ismert. A magasság: \(m_c=b\sin\alpha=a\sin\beta\).</p></div>`,
    igazHamisDb: 4,
    igazHamis: [
      { allitas: T`Három szög ismeretében a háromszög oldalai kiszámíthatók.`, igaz: false, miert: 'Csak az oldalak aránya; a hasonló háromszögeknek ugyanazok a szögei.' },
      { allitas: T`Ha két oldal és a közbezárt szög adott, a harmadik oldalt koszinusztétellel számoljuk.`, igaz: true, miert: 'Nincs teljes pár, így a szinusztétel nem indítható.' },
      { allitas: T`Szöget szinusztétellel érdemes a legnagyobb oldallal szemben számolni.`, igaz: false, miert: 'A legnagyobb szög lehet tompaszög, amit a sin⁻¹ nem ad meg. A kisebb oldallal szembeni szög biztosan hegyesszög.' },
      { allitas: T`A részeredményeket érdemes legalább 3–4 tizedesjegyre megtartani.`, igaz: true, miert: 'A korai kerekítés hibája összeadódik, és a végeredmény eltérhet.' },
      { allitas: T`Ha egy háromszögben \(a=10\), \(b=6\), \(c=5\), akkor a háromszög tompaszögű.`, igaz: true, miert: T`\(10^2=100\gt 6^2+5^2=61\).` },
      { allitas: T`Egy háromszög magassága kiszámítható így: \(m_c=b\cdot\sin\alpha\).`, igaz: true, miert: T`A \(C\)-ből húzott magasság talppontjánál derékszögű háromszög keletkezik, átfogója \(b\).` },
      { allitas: T`Ha \(a=7\), \(b=4\) és \(c=2\), akkor ez egy tompaszögű háromszög.`, igaz: false, miert: T`Nincs ilyen háromszög: \(4+2\lt 7\) (háromszög-egyenlőtlenség).` },
      { allitas: T`Egy háromszög súlyvonala koszinusztétellel számolható, ha a háromszög három oldala ismert.`, igaz: true, miert: 'Előbb egy szöget kell kiszámolni, aztán a súlyvonalat tartalmazó részháromszögben újra koszinusztétel.' },
      { allitas: T`A „két oldal és a nagyobbikkal szemközti szög” adatokból mindig pontosan egy háromszög szerkeszthető.`, igaz: true, miert: 'A kisebb oldallal szemközti szög kisebb, tehát hegyesszög: egyértelmű.' }
    ],
    mintapelda: {
      feladat: T`Egy háromszögben \(b=8\) cm, \(c=11\) cm, \(\alpha=52^\circ\). Számítsd ki a háromszög hiányzó adatait!`,
      lepesek: [
        T`Két oldal és a közbezárt szög → koszinusztétel: \[a^2=8^2+11^2-2\cdot 8\cdot 11\cdot\cos 52^\circ\approx 76{,}64\quad\Rightarrow\quad a\approx 8{,}754\ \text{cm}\]`,
        T`A kisebbik ismeretlen szög a \(b\)-vel (8 cm) szemközti \(\beta\), mert \(b\lt a\lt c\). Szinusztétellel: \[\sin\beta=\frac{8\cdot\sin 52^\circ}{8{,}754}\approx 0{,}7201\quad\Rightarrow\quad\beta\approx 46{,}06^\circ\]`,
        T`\[\gamma=180^\circ-52^\circ-46{,}06^\circ\approx 81{,}94^\circ\]`,
        T`Ellenőrzés: a legnagyobb oldallal (\(c=11\)) szemben van a legnagyobb szög (\(\gamma\)). Terület: \(T=\frac{8\cdot 11\cdot\sin 52^\circ}{2}\approx 34{,}67\ \text{cm}^2\).`
      ]
    },
    feladatok
  });
})();
