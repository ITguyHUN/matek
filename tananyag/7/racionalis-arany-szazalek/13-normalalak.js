/*
 * 13. fejezet – Nagyon nagy számok: a normálalak
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 10. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { tbl } = M7;
  const G = {};
  /* véletlen „mantissza”: 1 ≤ a < 10, legfeljebb 3 tizedesjegy */
  const mant = () => { const d = P([0, 1, 1, 2, 2, 3]); let a; do { a = R(10 ** d, 10 ** (d + 1) - 1) / 10 ** d; } while (a >= 10 || a < 1); return +a.toFixed(d); };
  const na = (a, k) => T`${nt(a)}\cdot 10^{${k}}`;                  // normálalak TeX-ben
  const szam = (a, k) => Math.round(a * 10 ** k);                    // a·10^k értéke (k ≥ tizedesjegyek)
  const dec = a => (String(a).split('.')[1] || '').length;
  function normal(x) { let k = 0; while (x >= 10) { x /= 10; k++; } while (x < 1) { x *= 10; k--; } return [+x.toFixed(10), k]; }
  const TOL = { tol: 1e-9 };

  G.kitevo = { name: 'Normálalak: a kitevő', make() {
    const a = mant(), k = R(Math.max(3, dec(a)), 13); const n = szam(a, k);
    return { q: T`<p>Írd fel normálalakban! Mi kerül a kérdőjel helyére?</p>\[${bigT(n)}=${nt(a)}\cdot 10^{?}\]`, ans: { vals: [k] }, ansText: String(k), fmt: 'egész szám (a kitevő)',
      hint: 'Hány helyiértékkel kell a tizedesvesszőt balra tolni, hogy 1 és 10 közötti számot kapj? Annyi a kitevő.',
      sol: [T`A tizedesvesszőt \(${k}\) hellyel toljuk balra: \(${bigT(n)}=${na(a, k)}\).`] };
  } };

  G.mantissza = { name: 'Normálalak: az első tényező', make() {
    const a = mant(), k = R(Math.max(3, dec(a)), 12); const n = szam(a, k);
    return { q: T`<p>Írd fel normálalakban! Mi kerül a kérdőjel helyére?</p>\[${bigT(n)}=\;?\cdot 10^{${k}}\]`, ans: { vals: [a] }, ansText: hu(a), fmt: 'szám (1 és 10 között)',
      hint: 'Az első tényező legalább 1, de 10-nél kisebb szám. Annyi jegyet írj a vessző elé, amennyi kell – egyet!',
      sol: [T`\(10^{${k}}=${bigT(10 ** k)}\), és \(${bigT(n)}:${bigT(10 ** k)}=${nt(a)}\).`, T`\[${bigT(n)}=${na(a, k)}\]`] };
  } };

  G.visszair = { name: 'Normálalakból szám', make() {
    const a = mant(), k = R(Math.max(2, dec(a)), 10); const n = szam(a, k);
    return { q: T`<p>Írd fel a számot a szokásos alakban!</p>\[${na(a, k)}\]`, ans: { vals: [n], tolRel: 1e-12 }, ansText: big(n), fmt: 'szám, pl. 620 000',
      hint: T`Szorzás \(10^{${k}}\)-nel: a tizedesvesszőt \(${k}\) hellyel jobbra toljuk, a hiányzó helyekre 0-t írunk.`,
      sol: [T`\[${na(a, k)}=${nt(a)}\cdot ${bigT(10 ** k)}=${bigT(n)}\]`] };
  } };

  G.szavakkal = { name: 'Millió, milliárd, billió', make() {
    const [nev, e] = P([['ezer', 3], ['millió', 6], ['milliárd', 9], ['billió', 12]]); const x = P([R(2, 9), R(11, 99) / 10, R(101, 999) / 100, R(12, 98)]);
    const [a, k0] = normal(x); const k = k0 + e;
    const ctx = P([['A Föld kora kb.', 'év'], ['Egy ország lakossága kb.', 'fő'], ['Egy bolygó távolsága a Naptól kb.', 'km'], ['Egy város éves költségvetése kb.', 'Ft'], ['Egy galaxisban kb.', 'csillag van']]);
    return { q: T`<p>${ctx[0]} ${hu(x)} ${nev} ${ctx[1]}. Írd fel normálalakban: \(${nt(a)}\cdot 10^{?}\). Mi a kitevő?</p>`, ans: { vals: [k] }, ansText: String(k), fmt: 'egész szám (a kitevő)',
      hint: `1 ${nev} = 10^${e}. Ha az első tényező nem 1 és 10 közé esik, igazítsd ki!`,
      sol: [T`1 ${nev} \(=10^{${e}}\), tehát \(${nt(x)}\) ${nev} \(=${nt(x)}\cdot 10^{${e}}\).`, k0 ? T`\(${nt(x)}=${nt(a)}\cdot 10^{${k0}}\), így \(${na(a, k)}\).` : T`\(${na(a, k)}\) – ez már normálalak.`] };
  } };

  G.prefix = { name: 'Mértékegységek és a 10 hatványai', make() {
    const opts = [['km', 'm', 3], ['km', 'cm', 5], ['km', 'mm', 6], ['kg', 'g', 3], ['t', 'kg', 3], ['t', 'g', 6], ['hl', 'l', 2], ['m³', 'dm³', 3], ['m³', 'cm³', 6], ['km²', 'm²', 6], ['GB', 'B', 9], ['MW', 'W', 6], ['kW', 'W', 3], ['Mm', 'm', 6], ['GHz', 'Hz', 9]];
    const [nagy, kis, e] = P(opts); const x = P([R(2, 9), R(12, 99) / 10, R(11, 99)]); const [a, k0] = normal(x); const k = k0 + e;
    return { q: T`<p>Váltsd át, és írd fel normálalakban! Mi a kitevő?</p>\[${nt(x)}\text{ ${nagy}}=${nt(a)}\cdot 10^{?}\text{ ${kis}}\]`, ans: { vals: [k] }, ansText: String(k), fmt: 'egész szám (a kitevő)',
      hint: `1 ${nagy} = 10^${e} ${kis}.`, sol: [T`1 ${nagy} \(=10^{${e}}\) ${kis}, ezért \(${nt(x)}\) ${nagy} \(=${nt(x)}\cdot 10^{${e}}\) ${kis}${k0 ? T` \(=${na(a, k)}\) ${kis}` : ''}.`] };
  } };

  G.szorzas = { name: 'Szorzás, osztás normálalakban', make() {
    const op = R(0, 1); const m1 = () => P([R(10, 99) / 10, R(1, 9)]); let a = m1(), b = m1(); const k = R(2, 12), m = R(2, 9); let A, K;
    if (op === 0) { [A, K] = normal(a * b); K += k + m; }
    else { if (a < b && R(0, 1)) [a, b] = [b, a]; [A, K] = normal(a / b); K += k - m; if (!Number.isInteger(+(A * 1000).toFixed(6)) || K < 1) return G.szorzas.make(); }
    A = +A.toFixed(6); const askK = R(0, 1) === 1;
    const tex = op === 0 ? T`(${na(a, k)})\cdot(${na(b, m)})` : T`\frac{${na(a, k)}}{${na(b, m)}}`;
    return { q: T`<p>Végezd el a műveletet, és add meg az eredményt normálalakban: \(${askK ? T`${nt(A)}\cdot 10^{?}` : T`?\cdot 10^{${K}}`}\)!</p>\[${tex}\]`, ans: askK ? { vals: [K] } : { vals: [A], tol: 1e-6 }, ansText: askK ? String(K) : hu(A), fmt: askK ? 'egész szám (a kitevő)' : 'szám (1 és 10 között)',
      hint: op === 0 ? 'Szorozd össze külön az első tényezőket és külön a 10-hatványokat (kitevők összeadódnak)! Ha az első tényező 10 vagy nagyobb lesz, igazítsd ki.' : 'Oszd el külön az első tényezőket és külön a 10-hatványokat (kitevők kivonódnak)! Ha az első tényező 1-nél kisebb lesz, igazítsd ki.',
      sol: [op === 0 ? T`\(${nt(a)}\cdot ${nt(b)}=${nt(+(a * b).toFixed(8))}\), \(10^{${k}}\cdot 10^{${m}}=10^{${k + m}}\)` : T`\(${nt(a)}:${nt(b)}=${nt(+(a / b).toFixed(8))}\), \(10^{${k}}:10^{${m}}=10^{${k - m}}\)`,
        T`\[${tex}=${nt(op === 0 ? +(a * b).toFixed(8) : +(a / b).toFixed(8))}\cdot 10^{${op === 0 ? k + m : k - m}}=${na(A, K)}\]`] };
  } };

  G.osszead = { name: 'Összeadás, kivonás normálalakban', make() {
    const a = mant(), b = mant(); const k = R(4, 9), d = R(1, 2); const x = szam(a, k), y = szam(b, k - d); const plus = R(0, 1) === 1 || x <= y;
    const s = plus ? x + y : x - y; const [A, K] = normal(s); const askK = R(0, 1) === 1;
    return { q: T`<p>Végezd el a műveletet, és add meg az eredményt normálalakban: \(${askK ? T`${nt(A)}\cdot 10^{?}` : T`?\cdot 10^{${K}}`}\)!</p>\[${na(a, k)}${plus ? '+' : '-'}${na(b, k - d)}\]`, ans: askK ? { vals: [K] } : { vals: [A], tol: 1e-6 }, ansText: askK ? String(K) : hu(A), fmt: askK ? 'egész szám (a kitevő)' : 'szám (1 és 10 között)',
      hint: 'Összeadásnál nincs „kitevő-szabály”! Írd át a számokat szokásos alakba (vagy ugyanarra a 10-hatványra), és úgy add össze őket.',
      sol: [T`\(${na(a, k)}=${bigT(x)}\), \(${na(b, k - d)}=${bigT(y)}\)`, T`\(${bigT(x)}${plus ? '+' : '-'}${bigT(y)}=${bigT(s)}=${na(A, K)}\)`] };
  } };

  G.hanyszor = { name: 'Hányszor nagyobb?', make() {
    const b = P([1, 2, 3, 4, 5, 1.5, 2.5]); const q = P([2, 3, 4, 5, 6, 8, 10, 20, 25, 50]); const m = R(2, 8), d = R(1, 5);
    let [a, ka] = normal(b * q); ka += m + d; a = +a.toFixed(6); const v = +((a * 10 ** ka) / (b * 10 ** m)).toFixed(6);
    const ctx = R(0, 1) === 0;
    return { q: ctx ? T`<p>A Nap átlagos távolsága a Földtől kb. \(1{,}5\cdot 10^{8}\) km, a Holdé kb. \(3{,}84\cdot 10^{5}\) km. Hányszor messzebb van a Nap, mint a Hold? (Egészre kerekítve)</p>`.replace(/^/, '') : T`<p>Hányszorosa az első szám a másodiknak?</p>\[${na(a, ka)}\qquad\text{és}\qquad ${na(b, m)}\]`,
      ans: ctx ? { vals: [391], tol: 1.01 } : { vals: [v], tolRel: 1e-9 }, ansText: ctx ? '391' : big(v), fmt: 'szám',
      hint: 'Osztással: az első tényezőket és a 10-hatványokat külön osztjuk el.',
      sol: ctx ? [T`\(\frac{1{,}5\cdot 10^8}{3{,}84\cdot 10^5}=\frac{1{,}5}{3{,}84}\cdot 10^{3}\approx0{,}3906\cdot1000\approx391\)`, 'Kb. 391-szer messzebb van.']
        : [T`\(\frac{${na(a, ka)}}{${na(b, m)}}=\frac{${nt(a)}}{${nt(b)}}\cdot 10^{${ka - m}}=${nt(+(a / b).toFixed(6))}\cdot ${bigT(10 ** (ka - m))}=${bigT(v)}\)`] };
  } };

  G.osszehasonlit = { name: 'Melyik a nagyobb?', make() {
    let a = mant(), b = mant(), k = R(3, 12), m = k + P([-1, 0, 0, 1]); if (m === k && a === b) b = +(b + 0.1).toFixed(3);
    const x = a * 10 ** k, y = b * 10 ** m; const c = Math.abs(x - y) < 1e-9 * x ? 1 : x < y ? 0 : 2; const s = ['<', '=', '>'];
    return { q: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${na(a, k)}\;\square\;${na(b, m)}\]`, ans: { choice: s, correct: c }, ansText: s[c], fmt: '',
      hint: 'Normálalakban először a kitevőket hasonlítsd össze: a nagyobb kitevőjű a nagyobb. Ha egyformák, az első tényező dönt.',
      sol: [k !== m ? `A kitevők: ${k} és ${m}. A ${Math.max(k, m)} a nagyobb, ezért ${k > m ? 'az első' : 'a második'} szám a nagyobb.` : `A kitevők egyformák, az első tényező dönt: ${hu(a)} ${s[c]} ${hu(b)}.`, T`\(${na(a, k)}${s[c]}${na(b, m)}\)`] };
  } };

  G.melyikNormal = { name: 'Melyik normálalak?', make() {
    const a = mant(), k = R(3, 10); const fake1 = [T`${nt(+(a * 10).toFixed(4))}\cdot 10^{${k - 1}}`, T`${nt(+(a / 10).toFixed(5))}\cdot 10^{${k + 1}}`, na(a, k + 1), na(a, k - 1)];
    const opts = [na(a, k), ...fake1.sort(() => Math.random() - 0.5).slice(0, 2)]; const ord = [0, 1, 2].sort(() => Math.random() - 0.5); const L = ['A', 'B', 'C'];
    return { q: T`<p>Melyik a <b>${big(szam(a, k))}</b> normálalakja?</p><p>${ord.map((j, i) => T`<b>${L[i]})</b> \(${opts[j]}\)`).join(' &nbsp; ')}</p>`, ans: { choice: L, correct: ord.indexOf(0) }, ansText: L[ord.indexOf(0)], fmt: '',
      hint: 'A normálalakban az első tényező legalább 1, de kisebb 10-nél, a második tényező 10 egész kitevős hatványa.',
      sol: [T`\(${na(a, k)}\) – itt \(1\le ${nt(a)}<10\). A többi vagy nem normálalak (az első tényező nem 1 és 10 közé esik), vagy más számot jelent (rossz a kitevő).`] };
  } };

  Tananyag.fejezet({
    id: 'normal',
    cim: 'Nagyon nagy számok: a normálalak',
    rovid: 'Normálalak',
    bevezeto: T`A Huygens-űrszonda több mint 1 400 000 000 km-t tett meg. Ennyi nullát nehéz leírni – a 10 hatványaival rövidebb: \(1{,}4\cdot10^9\) km.`,
    elmelet: T`${tbl(['milliárd', 'százmillió', 'tízmillió', 'millió', 'százezer', 'tízezer', 'ezer', 'száz', 'tíz', 'egy'], [['10⁹', '10⁸', '10⁷', '10⁶', '10⁵', '10⁴', '10³', '10²', '10¹', '1']])}
<div class="prose"><p>Egy szám <b>normálalakja</b> olyan szorzat, amelynek első tényezője <b>legalább 1, de 10-nél kisebb</b>, a második tényezője pedig a <b>10 egész kitevős hatványa</b>:</p></div>
<div class="mathbox">\[3\,560\,000=3{,}56\cdot1\,000\,000=3{,}56\cdot10^{6}\]</div>
<div class="prose"><ul>
<li><b>Hogyan írjuk fel?</b> A tizedesvesszőt annyi hellyel toljuk balra, hogy egyetlen (nem 0) jegy maradjon előtte. Ahány hellyel toltuk, annyi a kitevő.</li>
<li><b>Visszafelé:</b> \(6{,}2\cdot10^{5}=620\,000\) – a vesszőt 5 hellyel jobbra toljuk.</li>
<li>Nem normálalak: \(35\cdot10^{4}\) (az első tényező nagyobb 10-nél) és \(0{,}35\cdot10^{6}\) (kisebb 1-nél). Mindkettő helyesen: \(3{,}5\cdot10^{5}\).</li></ul></div>
${tbl(['előtag', 'deka', 'hektó', 'kilo', 'mega', 'giga', 'tera'], [['jele', 'dk', 'h', 'k', 'M', 'G', 'T'], ['értéke', '10¹', '10²', '10³', '10⁶', '10⁹', '10¹²']])}
<div class="prose"><p><b>Műveletek:</b> szorzásnál és osztásnál a hatványozás azonosságait használjuk, a végén kiigazítjuk az első tényezőt:</p></div>
<div class="mathbox">\[(3\cdot10^4)\cdot(4{,}3\cdot10^{10})=12{,}9\cdot10^{14}=1{,}29\cdot10^{15}\qquad\frac{6{,}5\cdot10^9}{5\cdot10^5}=1{,}3\cdot10^4\]</div>
<div class="prose"><p><b>Összeadásnál</b> nincs ilyen szabály: azonos 10-hatványra hozunk: \(2{,}3\cdot10^4+3{,}2\cdot10^5=0{,}23\cdot10^5+3{,}2\cdot10^5=3{,}43\cdot10^5\).</p></div>`,
    igazHamis: [
      { allitas: T`\(45\cdot10^{3}\) normálalak.`, igaz: false, miert: T`Az első tényező, a 45 nagyobb 10-nél. Helyesen: \(4{,}5\cdot10^4\).` },
      { allitas: T`\(7\,000\,000=7\cdot10^{6}\)`, igaz: true, miert: T`Hat 0 van a 7 után.` },
      { allitas: T`\(2{,}5\cdot10^{4}=250\,000\)`, igaz: false, miert: T`\(2{,}5\cdot10\,000=25\,000\).` },
      { allitas: T`\(3\cdot10^{8}>9\cdot10^{7}\)`, igaz: true, miert: T`\(3\cdot10^8=30\cdot10^7>9\cdot10^7\). A nagyobb kitevő dönt.` },
      { allitas: T`1 milliárd \(=10^{9}\)`, igaz: true, miert: T`1 milliárd = 1 000 000 000, 9 db 0.` },
      { allitas: T`\((2\cdot10^3)\cdot(3\cdot10^4)=6\cdot10^{12}\)`, igaz: false, miert: T`A kitevők összeadódnak: \(6\cdot10^{7}\).` },
      { allitas: T`\(2\cdot10^5+3\cdot10^5=5\cdot10^{10}\)`, igaz: false, miert: T`Összeadásnál a 10-hatvány marad: \(5\cdot10^5\).` },
      { allitas: T`5 GB (gigabájt) \(=5\cdot10^{9}\) bájt.`, igaz: true, miert: T`A giga előtag \(10^9\)-t jelent.` },
      { general() { const a = mant(), k = R(3, 9); const ok = R(0, 1) === 1; const kk = ok ? k : k + P([-1, 1]); return { allitas: T`\(${bigT(szam(a, k))}=${na(a, kk)}\)`, igaz: kk === k, miert: T`\(${bigT(szam(a, k))}=${na(a, k)}\).` }; } }
    ],
    mintapelda: {
      feladat: T`A Hold–Föld távolság 384 404 km, a Nap–Föld távolság kb. 150 millió km. Hányszorosa a Nap–Föld távolság a Hold–Föld távolságnak?`,
      lepesek: [
        T`Normálalakban: \(384\,404\approx3{,}84\cdot10^5\) km és \(150\,000\,000=1{,}5\cdot10^8\) km.`,
        T`\[\frac{1{,}5\cdot10^8}{3{,}84\cdot10^5}=\frac{1{,}5}{3{,}84}\cdot10^{8-5}\approx0{,}39\cdot10^3=390\]`,
        T`A Nap kb. <b>390-szer</b> messzebb van tőlünk, mint a Hold.`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
