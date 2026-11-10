/*
 * Gondolkodási módszerek / 1. fejezet – Szükséges, elégséges, szükséges és elégséges feltétel
 * Témakör: Gondolkodási módszerek (Sokszínű matematika 10., 1. fejezet 1. lecke; FGY 2001–2018, 2078–2079)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, keverd, vel, az, FMT10 } = M10;
  const feladatok = {};
  const lnko = gcd, lkkt = (a, b) => a / gcd(a, b) * b;

  /* állításpárok: { A, B, ab: A ⇒ B igaz?, ba: B ⇒ A igaz?, miert } */
  const BANK = [
    ['a négyszög négyzet', 'a négyszög rombusz', true, false, 'Minden négyzet rombusz, de nem minden rombusz négyzet.'],
    ['a négyszög téglalap', 'a négyszög paralelogramma', true, false, 'Minden téglalap paralelogramma, fordítva nem.'],
    ['a négyszög átlói felezik egymást', 'a négyszög paralelogramma', true, true, 'Ez a paralelogramma egyik jellemző tulajdonsága.'],
    ['a négyszög mind a négy oldala egyenlő hosszú', 'a négyszög rombusz', true, true, 'Ez éppen a rombusz definíciója.'],
    ['a háromszög szabályos', 'a háromszög egyenlő szárú', true, false, 'A szabályos háromszög egyenlő szárú is, de van nem szabályos egyenlő szárú háromszög.'],
    ['a háromszögnek van két egyenlő szöge', 'a háromszög egyenlő szárú', true, true, 'Egyenlő oldalakkal szemben egyenlő szögek vannak, és fordítva.'],
    ['az n egész szám páros', 'az n² páros', true, true, 'Páros szám négyzete páros, páratlané páratlan.'],
    ['az n egész szám utolsó számjegye 0', 'az n osztható 5-tel', true, false, 'A 0-ra végződő szám osztható 5-tel, de pl. a 15 is osztható 5-tel.'],
    ['az n egész szám számjegyeinek összege osztható 3-mal', 'az n osztható 3-mal', true, true, 'Ez a 3-mal való oszthatóság szabálya.'],
    ['az n egész szám osztható 6-tal', 'az n páros', true, false, 'A 6 többszörösei párosak, de pl. a 4 nem osztható 6-tal.'],
    ['a háromszög derékszögű', 'a háromszög leghosszabb oldalának négyzete egyenlő a másik két oldal négyzetösszegével', true, true, 'Pitagorasz tétele és megfordítása.'],
    ['két valós szám szorzata 0', 'a két szám közül legalább az egyik 0', true, true, 'Egy szorzat pontosan akkor 0, ha valamelyik tényezője 0.'],
    ['két egész szám összege páros', 'mindkét szám páros', false, true, 'Két páros szám összege páros, de pl. 3 + 5 = 8 is páros.'],
    ['x² = 9', 'x = 3', false, true, 'Ha x = 3, akkor x² = 9, de x = −3 esetén is x² = 9.'],
    ['a pozitív egész szám prím', 'a szám páratlan', false, false, 'A 2 prím és páros; a 9 páratlan, de nem prím.'],
    ['az n egész szám utolsó két jegyéből álló szám osztható 4-gyel', 'az n osztható 4-gyel', true, true, 'Ez a 4-gyel való oszthatóság szabálya.'],
    ['a négyszög négyzet', 'a négyszög átlói merőlegesek egymásra', true, false, 'A négyzet átlói merőlegesek, de a rombuszé (vagy a deltoidé) is.'],
    ['a két szám egyenlő', 'a két szám négyzete egyenlő', true, false, 'Ha a = b, akkor a² = b²; de 2² = (−2)².']
  ];
  /* paraméteres pár */
  function par() {
    const t = R(0, 4);
    if (t <= 1) {   // oszthatóság
      const L = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
      let a, b; do { a = P(L); b = P(L); } while (a === b || (a % b !== 0 && b % a !== 0 && R(0, 2) > 0));
      return { A: `az n pozitív egész szám osztható ${vel(a)}`, B: `az n osztható ${vel(b)}`, ab: a % b === 0, ba: b % a === 0,
        miert: `${a % b === 0 ? `Ha egy szám osztható ${vel(a)}, akkor ${vel(b)} is, mert ${b} | ${a}.` : `Pl. ${az(a)} ${a} osztható ${vel(a)}, de ${vel(b)} nem.`} ${b % a === 0 ? `Ha osztható ${vel(b)}, akkor ${vel(a)} is, mert ${a} | ${b}.` : `Pl. ${az(b)} ${b} osztható ${vel(b)}, de ${vel(a)} nem.`}` };
    }
    if (t === 2) { const [a, b] = M10.kulonbozo(2, -6, 9);
      return { A: `x > ${hu(a)}`, B: `x > ${hu(b)}`, ab: a >= b, ba: b >= a, miert: `Ha x > ${hu(Math.max(a, b))}, akkor x > ${hu(Math.min(a, b))} is teljesül, fordítva nem (pl. x = ${hu((a + b) / 2)}).` }; }
    const d = R(1, 9);
    if (t === 3) return { A: `x > ${d}`, B: `x² > ${d * d}`, ab: true, ba: false, miert: `Ha x > ${d}, akkor x² > ${d * d}. De x = −${d + 1} esetén x² > ${d * d}, mégsem igaz, hogy x > ${d}.` };
    return { A: `|x| > ${d}`, B: `x² > ${d * d}`, ab: true, ba: true, miert: `Mindkét oldal nemnegatív, így x² > ${d * d} ⇔ |x| > ${d}.` };
  }
  function allitasPar() { const p = R(0, 1) ? par() : (b => ({ A: b[0], B: b[1], ab: b[2], ba: b[3], miert: b[4] }))(P(BANK)); return R(0, 3) === 0 ? { A: p.B, B: p.A, ab: p.ba, ba: p.ab, miert: p.miert } : p; }
  const OPC = ['szükséges, de nem elégséges', 'elégséges, de nem szükséges', 'szükséges és elégséges', 'se nem szükséges, se nem elégséges'];

  feladatok.feltetel = { nev: 'Milyen feltétel?', general() {
    const p = allitasPar(); const h = p.ab && p.ba ? 2 : p.ba ? 0 : p.ab ? 1 : 3;
    return { kerdes: `<p>Az <b>A</b> állítás milyen feltétele a <b>B</b> állításnak?</p><p>A: ${p.A}.<br>B: ${p.B}.</p>`,
      valasz: { valasztas: OPC, helyes: h },
      tipp: 'A elégséges feltétele B-nek, ha A-ból következik B (A ⇒ B). A szükséges feltétele B-nek, ha B-ből következik A (B ⇒ A).',
      megoldas: [`A ⇒ B: ${p.ab ? 'igaz' : 'hamis'}; B ⇒ A: ${p.ba ? 'igaz' : 'hamis'}.`, p.miert, `Tehát A ${OPC[h]} feltétele B-nek.`] };
  } };

  const OPC2 = ['az állítás és a megfordítása is igaz', 'csak az állítás igaz', 'csak a megfordítása igaz', 'egyik sem igaz'];
  feladatok.megfordit = { nev: 'Állítás és megfordítása', general() {
    const p = allitasPar(); const h = p.ab && p.ba ? 0 : p.ab ? 1 : p.ba ? 2 : 3;
    return { kerdes: `<p>Tekintsük az állítást: <b>„Ha ${p.A}, akkor ${p.B}.”</b></p><p>Mi igaz az állításra és a megfordítására?</p>`,
      valasz: { valasztas: OPC2, helyes: h },
      tipp: 'A „Ha A, akkor B” megfordítása: „Ha B, akkor A”. Egy állítás hamis, ha van ellenpélda.',
      megoldas: [`Az állítás (A ⇒ B) ${p.ab ? 'igaz' : 'hamis'}, a megfordítása (B ⇒ A) ${p.ba ? 'igaz' : 'hamis'}.`, p.miert] };
  } };

  feladatok.legkisebb = { nev: 'Feltétel kiszámítása', general() {
    const t = R(0, 3);
    if (t <= 1) { const L = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15]; let a, b; do { a = P(L); b = P(L); } while (a === b);
      if (t === 0) return { kerdes: `<p>Melyik az a legkisebb pozitív egész m, amelyre az „n osztható m-mel” állítás <b>elégséges</b> feltétele annak, hogy az n egész szám osztható ${vel(a)} és ${vel(b)} is?</p>`,
        valasz: { ertekek: [lkkt(a, b)] }, formatum: FMT10.egesz,
        tipp: `Ha n osztható m-mel, akkor osztható legyen ${vel(a)} és ${vel(b)} is: m legyen mindkettő többszöröse.`,
        megoldas: [`Az m-nek közös többszörösnek kell lennie; a legkisebb ilyen: [${a}; ${b}] = ${lkkt(a, b)}.`] };
      return { kerdes: `<p>Melyik az a legnagyobb pozitív egész m, amelyre az „n osztható m-mel” állítás <b>szükséges</b> feltétele annak, hogy az n egész szám osztható ${vel(a)} vagy ${vel(b)}?</p>`,
        valasz: { ertekek: [lnko(a, b)] }, formatum: FMT10.egesz,
        tipp: `Szükséges feltétel: ha n osztható ${vel(a)} vagy ${vel(b)}, akkor biztosan osztható m-mel. Ehhez m mindkét számnak osztója kell legyen.`,
        megoldas: [`m közös osztója ${a}-nak és ${b}-nek; a legnagyobb ilyen: (${a}; ${b}) = ${lnko(a, b)}.`] }; }
    const c = R(2, 120); const k = Math.ceil(Math.sqrt(c) - 1e-12);
    if (t === 2) return { kerdes: `<p>Melyik az a legkisebb egész k, amelyre az „x > k” állítás <b>elégséges</b> feltétele annak, hogy x² > ${c}? (x valós szám)</p>`,
      valasz: { ertekek: [k] }, formatum: FMT10.egesz,
      tipp: `x > k-ból következzen x² > ${c}. Ehhez k ≥ √${c} kell.`,
      megoldas: [T`\(x>k\Rightarrow x^2>${c}\) pontosan akkor teljesül minden valós \(x\)-re, ha \(k\ge\sqrt{${c}}\approx${nt(+Math.sqrt(c).toFixed(2))}\). A legkisebb ilyen egész: \(k=${k}\).`] };
    const d = R(1, 12);
    return { kerdes: `<p>Melyik az a legnagyobb egész k, amelyre az „x > k” állítás <b>szükséges</b> feltétele annak, hogy x > ${d}? (x valós szám)</p>`,
      valasz: { ertekek: [d] }, formatum: FMT10.egesz,
      tipp: `Szükséges feltétel: x > ${d}-ból következzen x > k. Ez akkor igaz, ha k ≤ ${d}.`,
      megoldas: [`Ha k ≤ ${d}, akkor x > ${d} ⇒ x > k. Ha k > ${d}, akkor pl. x = ${d} + (k − ${d})/2 ellenpélda. A legnagyobb ilyen egész: ${d}.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'gfelt',
    cim: 'Szükséges és elégséges feltétel',
    rovid: 'Feltételek',
    bevezeto: 'A matematikai állítások legtöbbször „ha …, akkor …” alakúak. Ebben a fejezetben azt gyakoroljuk, mikor következik egyik állításból a másik.',
    elmelet: T`<div class="tbl"><table><tr><th>Kifejezés</th><th>Jelentés</th><th>Példa</th></tr>
<tr><td>A <b>elégséges</b> feltétele B-nek</td><td>\(A\Rightarrow B\)</td><td>„négyzet” ⇒ „rombusz”</td></tr>
<tr><td>A <b>szükséges</b> feltétele B-nek</td><td>\(B\Rightarrow A\)</td><td>„rombusz” szükséges feltétele a „négyzet”-nek</td></tr>
<tr><td>A <b>szükséges és elégséges</b> feltétele B-nek</td><td>\(A\Leftrightarrow B\)</td><td>„két szöge egyenlő” ⇔ „egyenlő szárú”</td></tr></table></div>
<div class="prose"><ul>
<li>A „Ha A, akkor B” állítás <b>megfordítása</b>: „Ha B, akkor A”. Egy igaz állítás megfordítása lehet hamis.</li>
<li>Egy „ha …, akkor …” állítás cáfolatához elég egy <b>ellenpélda</b>.</li>
<li>„Akkor és csak akkor” = szükséges és elégséges feltétel: az állítás és a megfordítása is igaz.</li></ul></div>`,
    igazHamis: [
      { allitas: '„A szám osztható 4-gyel” elégséges feltétele annak, hogy „a szám páros”.', igaz: true, miert: 'A 4 többszörösei párosak.' },
      { allitas: '„A szám páros” elégséges feltétele annak, hogy „a szám osztható 4-gyel”.', igaz: false, miert: 'Ellenpélda: a 6 páros, de 4-gyel nem osztható.' },
      { allitas: 'Ha egy állítás igaz, akkor a megfordítása is igaz.', igaz: false, miert: 'Pl. „ha négyzet, akkor rombusz” igaz, de a megfordítása hamis.' },
      { allitas: '„A háromszög két oldala egyenlő” szükséges és elégséges feltétele annak, hogy „a háromszög egyenlő szárú”.', igaz: true, miert: 'Ez a definíció.' },
      { allitas: 'Egy „ha …, akkor …” állítás cáfolatához elég egyetlen ellenpélda.', igaz: true, miert: 'Ha egy esetben A igaz, de B hamis, az állítás nem igaz általánosan.' },
      { general() { const p = allitasPar(); const kerd = R(0, 1); const allit = kerd ? p.ab : p.ba;
        return { allitas: `„${p.A}” ${kerd ? 'elégséges' : 'szükséges'} feltétele annak, hogy „${p.B}”.`, igaz: allit, miert: p.miert }; } }
    ],
    mintapelda: {
      feladat: 'Milyen feltétele az „x > 3” állítás az „x² > 9” állításnak?',
      lepesek: ['x > 3 ⇒ x² > 9 igaz, tehát az „x > 3” elégséges feltétel.', 'x² > 9 ⇒ x > 3 hamis: x = −4 esetén x² = 16 > 9, de x < 3.', 'Tehát az „x > 3” elégséges, de nem szükséges feltétele az „x² > 9” állításnak.']
    },
    feladatok
  }));
})();
