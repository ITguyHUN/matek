/*
 * 8. fejezet – A hatványozás
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 6. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { tbl, fplain } = M7;
  const G = {};
  /* hatvány TeX-alakja: a negatív, tört és tizedes alapot zárójelbe tesszük */
  const pw = (a, n) => (typeof a === 'object' ? T`\left(${ft(a)}\right)` : a < 0 || !Number.isInteger(a) ? T`(${nt(a)})` : String(a)) + `^{${n}}`;
  const prod = (a, n) => Array(n).fill(typeof a === 'object' ? T`${ft(a)}` : a < 0 || !Number.isInteger(a) ? T`(${nt(a)})` : String(a)).join(T`\cdot `);
  const kitevoNev = n => ['', 'első', 'második', 'harmadik', 'negyedik', 'ötödik', 'hatodik', 'hetedik', 'nyolcadik', 'kilencedik', 'tizedik'][n] || `${n}.`;

  G.ertek = { name: 'Hatvány értéke', make() {
    const opts = [[2, R(2, 10)], [3, R(2, 6)], [4, R(2, 5)], [5, R(2, 5)], [R(6, 12), 2], [R(6, 10), 3], [10, R(2, 7)], [R(11, 20), 2], [1, R(5, 50)], [0, R(2, 9)]];
    const [a, n] = P(opts); const v = a ** n;
    return { q: T`<p>Számítsd ki a hatvány értékét!</p>\[${a}^{${n}}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: T`\(${a}^{${n}}\) azt jelenti: ${n} darab ${a}-es tényező szorzata.`,
      sol: a <= 1 ? [a === 1 ? 'Az 1 minden hatványa 1.' : 'A 0 minden pozitív egész kitevős hatványa 0.'] : [T`\[${a}^{${n}}=${n <= 8 ? prod(a, n) : `${prod(a, 3)}\\cdot\\ldots\\cdot ${a}`}=${bigT(v)}\]`] };
  } };

  G.felir = { name: 'Írd fel hatványként!', make() {
    const a = P([2, 3, 5, 7, -2, -3, 0.1, 10, F(2, 3), F(1, 2), -1]); const n = R(2, 7); const t = R(0, 1);
    if (t === 0) return { q: T`<p>Írd fel a szorzatot hatvány alakban! Mi a <b>kitevő</b>?</p>\[${prod(a, n)}\]`, ans: { vals: [n] }, ansText: String(n), fmt: 'egész szám',
      hint: 'A kitevő a tényezők száma, az alap az ismétlődő tényező.', sol: [T`\[${prod(a, n)}=${pw(a, n)}\]`, `Az alap ${typeof a === 'object' ? T`\(${ft(a)}\)` : hu(a)}, a kitevő <b>${n}</b> (${kitevoNev(n)} hatvány).`] };
    const v = typeof a === 'object' ? fpow(a, n) : null; const num = v ? fv(v) : +(a ** n).toFixed(10);
    return { q: T`<p>Írd fel szorzatként, és számítsd ki!</p>\[${pw(a, n)}\]`, ans: { vals: [num] }, ansText: v ? fplain(v) : hu(num), fmt: v ? 'tört, pl. 8/27' : 'szám',
      hint: 'Írd le annyiszor az alapot, amennyi a kitevő, és szorozd össze! Negatív alapnál figyelj az előjelre.',
      sol: [T`\[${pw(a, n)}=${prod(a, n)}=${v ? ft(v) : nt(num)}\]`] };
  } };

  G.negativ = { name: 'Negatív alap, zárójel', make() {
    const a = R(1, 6), n = R(2, 5); const t = R(0, 3);
    const forms = [[T`(-${a})^{${n}}`, (-a) ** n, T`(-${a})^{${n}}=${prod(-a, n)}`], [T`-${a}^{${n}}`, -(a ** n), T`-${a}^{${n}}=-(${prod(a, n)})`], [T`-(-${a})^{${n}}`, -((-a) ** n), T`-(-${a})^{${n}}=-\left(${(-a) ** n}\right)`], [T`(-1)^{${R(10, 99)}}`, null, '']];
    let [tex, v, s] = forms[t]; if (t === 3) { const k = +tex.match(/\{(\d+)\}/)[1]; v = k % 2 ? -1 : 1; s = T`A \(-1\) páros kitevőn \(1\), páratlanon \(-1\). A kitevő \(${k}\) ${k % 2 ? 'páratlan' : 'páros'}.`; }
    return { q: T`<p>Számítsd ki! Figyelj a zárójelre!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: hu(v), fmt: 'egész szám',
      hint: T`\((-2)^4\): a \(-2\) a hatványalap. \(-2^4\): csak a 2 a hatványalap, a mínuszjel utána jön: \(-2^4=-(2^4)\).`,
      sol: [t === 3 ? s : T`\[${s}=${v}\]`, t === 0 ? `Negatív szám ${n % 2 ? 'páratlan' : 'páros'} kitevőjű hatványa ${n % 2 ? 'negatív' : 'pozitív'}.` : t === 1 ? 'Zárójel nélkül a hatványozás előbb jön, a mínuszjel csak utána.' : ''].filter(Boolean) };
  } };

  G.tortAlap = { name: 'Tört és tizedes tört hatványa', make() {
    if (R(0, 1) === 0) { const f = F(R(1, 5) * P([1, -1]), R(2, 6)); if (f.d === 1) return G.tortAlap.make(); const n = R(2, f.d > 4 ? 3 : 4); const v = fpow(f, n);
      return { q: T`<p>Számítsd ki!</p>\[${pw(f, n)}\]`, ans: { vals: [fv(v)], form: 'frac' }, ansText: fplain(v), fmt: 'tört (egyszerűsítve), pl. 8/27',
        hint: 'Törtet úgy hatványozunk, hogy a számlálót és a nevezőt is hatványozzuk.', sol: [T`\[${pw(f, n)}=\frac{${f.n < 0 ? `(${f.n})` : f.n}^{${n}}}{${f.d}^{${n}}}=${ft(v)}\]`] }; }
    const a = P([0.1, 0.2, 0.3, 0.5, 1.1, 1.2, 0.4, -0.2, -0.1, 1.5]); const n = R(2, 3); const v = +(a ** n).toFixed(8);
    return { q: T`<p>Számítsd ki!</p>\[${pw(a, n)}\]`, ans: { vals: [v], form: 'dec' }, ansText: hu(v), fmt: 'tizedes tört',
      hint: 'Szorozd össze vessző nélkül, és annyi tizedesjegyet jelölj, ahány a tényezőkben összesen van!', sol: [T`\[${pw(a, n)}=${prod(a, n)}=${nt(v)}\]`] };
  } };

  G.kitevo = { name: 'Melyik kitevő?', make() {
    const [a, n] = P([[2, R(3, 12)], [3, R(2, 7)], [4, R(2, 5)], [5, R(2, 5)], [10, R(2, 9)], [7, R(2, 4)], [6, R(2, 4)], [-2, R(3, 9)], [-3, R(3, 5)]]); const v = a ** n;
    return { q: T`<p>Mit írjunk a négyzet helyére, hogy igaz legyen az egyenlőség?</p>\[${a < 0 ? `(${a})` : a}^{\square}=${bigT(v)}\]`, ans: { vals: [n] }, ansText: String(n), fmt: 'egész szám',
      hint: `Szorozd ${a < 0 ? `a (${a})-t` : `a(z) ${a}-t`} önmagával addig, amíg el nem éred a ${big(v)}-t, és számold a tényezőket!`,
      sol: [T`\(${a < 0 ? `(${a})` : a}^{${n}}=${prod(a, n)}=${bigT(v)}\)`, `Tehát a kitevő <b>${n}</b>.`] };
  } };

  G.alap = { name: 'Melyik alap?', make() {
    const n = P([2, 2, 2, 3, 3, 4, 5]); const a = n === 2 ? R(2, 25) : n === 3 ? R(2, 10) : R(2, 5); const v = a ** n; const neg = n === 3 && R(0, 2) === 0;
    return { q: T`<p>Melyik szám kerül a négyzet helyére?</p>\[\square^{${n}}=${neg ? '-' : ''}${bigT(v)}\]`, ans: { vals: [neg ? -a : a] }, ansText: String(neg ? -a : a), fmt: 'egész szám',
      hint: n === 2 ? 'Melyik szám négyzete? (Pozitív számot írj!)' : neg ? 'Negatív szám páratlan kitevőjű hatványa negatív.' : 'Próbálgass: 2, 3, 4, …',
      sol: [T`\(${neg ? `(${-a})` : a}^{${n}}=${neg ? '-' : ''}${bigT(v)}\)`].concat(n % 2 === 0 ? [T`(A \(${-a}\) is jó lenne, mert páros kitevőn ugyanezt adja.)`] : []) };
  } };

  G.elojel = { name: 'Pozitív vagy negatív?', make() {
    const a = R(-9, 9), n = R(1, 101); const tex = a < 0 ? T`(${a})^{${n}}` : T`${a}^{${n}}`; const v = a === 0 ? 1 : (a > 0 || n % 2 === 0) ? 0 : 2;
    const zj = R(0, 3) === 0 && a < 0; const tex2 = zj ? T`-${-a}^{${n}}` : tex; const v2 = zj ? 2 : v;
    const opts = ['pozitív', 'nulla', 'negatív'];
    return { q: T`<p>Milyen előjelű a hatvány értéke?</p>\[${tex2}\]`, ans: { choice: opts, correct: v2 }, ansText: opts[v2], fmt: '',
      hint: 'Pozitív szám minden hatványa pozitív. Negatív szám páros kitevőn pozitív, páratlanon negatív. Figyelj a zárójelre!',
      sol: [zj ? T`Zárójel nélkül: \(-${-a}^{${n}}=-(${-a}^{${n}})\), ez <b>negatív</b>.` : a === 0 ? 'A 0 hatványa 0.' : a > 0 ? 'Pozitív szám hatványa pozitív.' : `A kitevő ${n} ${n % 2 ? 'páratlan' : 'páros'}, ezért ${n % 2 ? 'negatív' : 'pozitív'}.`] };
  } };

  G.osszehasonlit = { name: 'Melyik a nagyobb?', make() {
    const pairs = [[2, 5, 5, 2], [2, 4, 4, 2], [3, 4, 4, 3], [2, 10, 10, 3], [2, 6, 6, 2], [3, 5, 5, 3], [2, 7, 7, 2], [10, 2, 2, 7], [3, 3, 2, 5], [5, 3, 3, 5], [2, 8, 4, 4], [9, 2, 3, 4], [2, 9, 3, 6], [4, 3, 8, 2], [-2, 4, -4, 2], [-3, 3, 2, 3], [-2, 5, -5, 2], [6, 2, 2, 5]];
    const [a, n, b, m] = P(pairs); const sw = R(0, 1); const [A, N, B, M] = sw ? [b, m, a, n] : [a, n, b, m];
    const x = A ** N, y = B ** M; const c = x < y ? 0 : x === y ? 1 : 2; const s = ['<', '=', '>'];
    return { q: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${pw(A, N)}\;\square\;${pw(B, M)}\]`, ans: { choice: s, correct: c }, ansText: s[c], fmt: '',
      hint: 'Számold ki mindkét hatvány értékét!', sol: [T`\(${pw(A, N)}=${x}\) és \(${pw(B, M)}=${y}\), tehát \(${pw(A, N)}${s[c]}${pw(B, M)}\).`] };
  } };

  G.negyzetszam = { name: 'Négyzetszámok, köbszámok', make() {
    const kob = R(0, 2) === 0; const lo = kob ? R(2, 100) : R(10, 300); const hi = lo + (kob ? R(100, 900) : R(50, 600));
    const list = []; for (let k = 1; (kob ? k ** 3 : k * k) <= hi; k++) { const v = kob ? k ** 3 : k * k; if (v >= lo) list.push(v); }
    return { q: `<p>Hány ${kob ? 'köbszám' : 'négyzetszám'} van ${lo} és ${hi} között (a határokat is beleértve)?</p>`, ans: { vals: [list.length] }, ansText: String(list.length), fmt: 'egész szám',
      hint: kob ? 'Köbszám: egy egész szám harmadik hatványa (1, 8, 27, 64, …).' : 'Négyzetszám: egy egész szám négyzete (1, 4, 9, 16, …). Melyik a legkisebb és a legnagyobb, ami belefér?',
      sol: [list.length ? `A ${kob ? 'köbszámok' : 'négyzetszámok'}: ${list.join(', ')}.` : 'Egy sincs közöttük.', `Ez <b>${list.length}</b> darab.`] };
  } };

  G.kifejezes = { name: 'Hatványok műveletekkel', make() {
    const a = R(2, 5), b = R(2, 4), c = R(2, 3), d = R(1, 5); const t = R(0, 3); let tex, v, sol;
    if (t === 0) { v = a ** b + c ** a; tex = T`${a}^{${b}}+${c}^{${a}}`; sol = [T`\(${a}^{${b}}=${a ** b}\), \(${c}^{${a}}=${c ** a}\)`, T`\(${a ** b}+${c ** a}=${v}\)`]; }
    else if (t === 1) { v = 2 * a ** 2 - d; tex = T`2\cdot ${a}^{2}-${d}`; sol = [T`Előbb a hatvány: \(${a}^2=${a * a}\).`, T`\(2\cdot ${a * a}-${d}=${v}\)`]; }
    else if (t === 2) { v = (a + d) ** 2; tex = T`(${a}+${d})^{2}`; sol = [T`Előbb a zárójel: \(${a}+${d}=${a + d}\).`, T`\(${a + d}^2=${v}\) (nem \(${a}^2+${d}^2=${a * a + d * d}\)!)`]; }
    else { v = 10 ** b * a + c ** 3; tex = T`${a}\cdot10^{${b}}+${c}^{3}`; sol = [T`\(10^{${b}}=${bigT(10 ** b)}\), \(${c}^3=${c ** 3}\)`, T`\(${a}\cdot ${bigT(10 ** b)}+${c ** 3}=${bigT(v)}\)`]; }
    return { q: T`<p>Számítsd ki!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: 'Műveleti sorrend: zárójel → hatványozás → szorzás, osztás → összeadás, kivonás.', sol };
  } };

  G.szoveges = { name: 'Szöveges feladatok', make() {
    const t = R(0, 3);
    if (t === 0) { const n = R(3, 10); const v = 2 ** n; return { q: `<p>Egy papírlapot ${n}-szer egymás után félbehajtunk. Hány réteg kerül egymásra?</p>`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: 'Minden hajtás megduplázza a rétegek számát.', sol: [T`Hajtásonként kétszereződik: \(2^{${n}}=${v}\) réteg.`] }; }
    if (t === 1) { const k = R(2, 3), m = R(3, 8); const v = k ** m; return { q: `<p>Egy baktérium percenként ${k === 2 ? 'két' : 'három'} részre osztódik (és mindegyik rész tovább osztódik). Hány baktérium lesz ${m} perc múlva egyetlen baktériumból?</p>`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: `Percenként ${k}-szeresére nő a számuk.`, sol: [T`\(${k}^{${m}}=${v}\)`] }; }
    if (t === 2) { const a = R(2, 15); const ask = R(0, 1); const v = ask ? a ** 3 : 6 * a * a;
      return { q: `<p>Egy kocka éle ${a} cm. Mekkora a ${ask ? 'térfogata (cm³)' : 'felszíne (cm²)'}?</p>`, ans: { vals: [v] }, ansText: String(v), fmt: ask ? 'szám (cm³)' : 'szám (cm²)',
        hint: ask ? 'A kocka térfogata: él³.' : 'A kockának 6 egybevágó négyzetlapja van, egy lap területe él².', sol: [ask ? T`\(V=${a}^3=${v}\) cm³` : T`\(A=6\cdot ${a}^2=6\cdot ${a * a}=${v}\) cm²`] }; }
    const n = R(2, 5); const v = 3 ** n; return { q: `<p>Lánclevél: egy ember ${n === 1 ? '' : ''}3 barátjának küld levelet, és mindegyikük újabb 3-nak, és így tovább. Hány levelet küldenek ki a ${n}. körben?</p>`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: 'Körönként háromszorozódik a levelek száma.', sol: [T`1. kör: 3, 2. kör: \(3^2=9\), …, ${n}. kör: \(3^{${n}}=${v}\).`] };
  } };

  G.utolsoJegy = { name: 'Milyen számjegyre végződik?', szint: 'emelt', make() {
    const a = P([2, 3, 4, 7, 8, 9, 12, 13, 17, 2026, 2027, 33, 8]); const n = R(10, 2026); const L = a % 10; const cyc = []; let x = L; do { cyc.push(x); x = x * L % 10; } while (x !== cyc[0] && cyc.length < 5);
    const d = cyc[(n - 1) % cyc.length];
    return { q: T`<p>Milyen számjegyre végződik?</p>\[${a}^{${n}}\]`, ans: { vals: [d] }, ansText: String(d), fmt: 'egy számjegy',
      hint: 'Csak az utolsó jegy számít! Írd fel az utolsó jegy első néhány hatványának utolsó jegyét, és keress ismétlődést.',
      sol: [T`Az utolsó jegy \(${L}\). A hatványok utolsó jegyei: ${cyc.join(', ')}, ${cyc[0]}, … – ${cyc.length} hosszú ismétlődés.`, T`\(${n}=${Math.floor((n - 1) / cyc.length)}\cdot ${cyc.length}+${(n - 1) % cyc.length + 1}\), tehát a ciklus ${(n - 1) % cyc.length + 1}. tagja: <b>${d}</b>.`] };
  } };

  Tananyag.fejezet({
    id: 'hatv',
    cim: 'A hatványozás',
    rovid: 'Hatványozás',
    bevezeto: T`Ha sokszor ugyanazt a számot szorozzuk, rövidebben is leírhatjuk: \(2\cdot2\cdot2\cdot2\cdot2=2^5\).`,
    elmelet: T`<div class="prose"><p>Az ismételt összeadást szorzással írjuk: \(5+5+5=3\cdot5\). Az ismételt szorzást <b>hatványozással</b>:</p></div>
<div class="mathbox">\[a^{n}=\underbrace{a\cdot a\cdot\ldots\cdot a}_{n\text{ tényező}}\qquad\text{pl. } 5^3=5\cdot5\cdot5=125\]</div>
<div class="prose"><ul>
<li>\(a\) a <b>hatványalap</b> (az ismétlődő tényező), \(n\) a <b>kitevő</b> (a tényezők száma), \(a^n\) a <b>hatvány</b>.</li>
<li>Kiolvasás: \(5^2\) „öt a négyzeten”, \(5^3\) „öt a köbön”, \(5^4\) „öt a negyediken”.</li>
<li>Minden szám első hatványa önmaga: \(a^1=a\). Az 1 minden hatványa 1, a 0 minden pozitív kitevős hatványa 0.</li>
<li><b>Négyzetszámok:</b> 1, 4, 9, 16, 25, …; <b>köbszámok:</b> 1, 8, 27, 64, 125, …</li></ul></div>
${tbl(['n', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], [['2ⁿ', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024'], ['3ⁿ', '3', '9', '27', '81', '243', '729', '', '', '', ''], ['n²', '1', '4', '9', '16', '25', '36', '49', '64', '81', '100'], ['n³', '1', '8', '27', '64', '125', '216', '343', '512', '729', '1000']])}
<div class="prose"><p><b>Negatív alap:</b> páros kitevőn pozitív, páratlanon negatív: \((-3)^2=9\), \((-3)^3=-27\).</p>
<p><b>Figyelj a zárójelre!</b> \((-2)^4=(-2)\cdot(-2)\cdot(-2)\cdot(-2)=16\), de \(-2^4=-(2\cdot2\cdot2\cdot2)=-16\).</p>
<p><b>Tört alap:</b> \(\left(\frac23\right)^3=\frac{2^3}{3^3}=\frac{8}{27}\); tizedes tört: \(0{,}1^3=0{,}001\).</p>
<p><b>Műveleti sorrend:</b> zárójel → hatványozás → szorzás, osztás → összeadás, kivonás.</p></div>`,
    igazHamis: [
      { allitas: T`\(2^3=6\)`, igaz: false, miert: T`\(2^3=2\cdot2\cdot2=8\). A \(6\) a \(2\cdot3\).` },
      { allitas: T`\((-2)^4=-2^4\)`, igaz: false, miert: T`\((-2)^4=16\), de \(-2^4=-16\).` },
      { allitas: T`Negatív szám páros kitevőjű hatványa pozitív.`, igaz: true, miert: T`Páros sok negatív tényező szorzata pozitív, pl. \((-3)^2=9\).` },
      { allitas: T`\(0{,}1^2=0{,}01\)`, igaz: true, miert: T`\(0{,}1\cdot0{,}1=0{,}01\).` },
      { allitas: T`\(2^5>5^2\)`, igaz: true, miert: T`\(2^5=32\), \(5^2=25\).` },
      { allitas: T`\(1^{100}=100\)`, igaz: false, miert: T`Az 1 minden hatványa 1.` },
      { allitas: T`\((2+3)^2=2^2+3^2\)`, igaz: false, miert: T`\((2+3)^2=25\), de \(2^2+3^2=13\).` },
      { allitas: T`\(\left(\frac12\right)^3=\frac18\)`, igaz: true, miert: T`\(\frac{1^3}{2^3}=\frac18\).` },
      { allitas: T`Kettő a négyzeten a köbön nagyobb, mint kettő a köbön a négyzeten.`, igaz: false, miert: T`\((2^2)^3=4^3=64\) és \((2^3)^2=8^2=64\): egyenlők.`, szint: 'emelt' },
      { general() { const a = R(2, 9), n = R(2, 3); const ok = R(0, 1) === 1; const v = ok ? a ** n : a * n; return { allitas: T`\(${a}^{${n}}=${v}\)`, igaz: v === a ** n, miert: T`\(${a}^{${n}}=${prod(a, n)}=${a ** n}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Állítsuk növekvő sorrendbe: \(3^4;\ (-2)^5;\ -5^2;\ (-4)^3\)`,
      lepesek: [
        T`\(3^4=81\)`,
        T`\((-2)^5=-32\) (páratlan kitevő → negatív)`,
        T`\(-5^2=-(5\cdot5)=-25\) (a mínusz nincs a hatványalapban)`,
        T`\((-4)^3=-64\)`,
        T`\[(-4)^3<(-2)^5<-5^2<3^4\]`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
