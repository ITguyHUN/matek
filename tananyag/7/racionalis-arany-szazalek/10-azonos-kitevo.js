/*
 * 10. fejezet – Műveletek azonos kitevőjű hatványokkal
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 8. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fplain } = M7;
  const G = {};
  const bt = a => typeof a === 'object' ? T`\left(${ft(a)}\right)` : a < 0 || !Number.isInteger(a) ? T`(${nt(a)})` : String(a);
  const pwx = (a, n) => `${bt(a)}^{${n}}`;
  /* szorzatpárok, amelyek szép számot adnak */
  const PAR = [[2, 5], [4, 25], [5, 20], [2, 50], [4, 5], [8, 125], [25, 4], [0.5, 2], [0.2, 5], [0.25, 4], [1.5, 2], [2.5, 4], [3, 5], [2, 3], [5, 6], [0.5, 6], [0.1, 30], [2.5, 2], [20, 5]];

  G.szorzat = { name: 'Azonos kitevőjű hatványok szorzása', make() {
    let [a, b] = P(PAR); if (R(0, 1)) [a, b] = [b, a]; const c = +(a * b).toFixed(6); const n = Math.abs(c) >= 30 ? R(2, 3) : c >= 10 ? R(2, 5) : R(2, 6); const v = +(c ** n).toFixed(8);
    return { q: T`<p>Számítsd ki ügyesen!</p>\[${pwx(a, n)}\cdot ${pwx(b, n)}\]`, ans: { vals: [v] }, ansText: hu(v), fmt: 'szám',
      hint: T`Azonos kitevőjű hatványokat úgy szorzunk, hogy az alapokat szorozzuk össze: \(a^n\cdot b^n=(a\cdot b)^n\).`,
      sol: [T`\[${pwx(a, n)}\cdot ${pwx(b, n)}=(${nt(a)}\cdot ${nt(b)})^{${n}}=${pwx(c, n)}=${Number.isInteger(v) ? bigT(v) : nt(v)}\]`] };
  } };

  G.hanyados = { name: 'Azonos kitevőjű hatványok osztása', make() {
    const [a, b] = P([[6, 3], [10, 5], [27, 9], [12, 4], [15, 5], [20, 4], [36, 12], [9, 3], [100, 20], [14, 7], [8, 4], [30, 6], [-10, 5], [-6, 2], [21, 7], [12, 3]]); const c = a / b; const n = Math.abs(c) >= 5 ? R(2, 3) : R(2, 6); const v = c ** n; const frac = R(0, 1) === 1;
    const tex = frac ? T`\frac{${pwx(a, n)}}{${pwx(b, n)}}` : T`${pwx(a, n)}:${pwx(b, n)}`;
    return { q: T`<p>Számítsd ki ügyesen!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: T`Azonos kitevőjű hatványokat úgy osztunk, hogy az alapokat osztjuk el: \(a^n:b^n=(a:b)^n\).`,
      sol: [T`\[${tex}=\left(\frac{${a}}{${b}}\right)^{${n}}=${pwx(c, n)}=${bigT(v)}\]`] };
  } };

  G.tortHatvany = { name: 'Tört hatványozása', make() {
    let n0, d0; do { n0 = R(1, 7) * P([1, 1, -1]); d0 = R(2, 9); } while (gcd(n0, d0) !== 1); const f = F(n0, d0); const n = Math.abs(f.n) > 4 || f.d > 5 ? 2 : R(2, 4); const v = fpow(f, n);
    return { q: T`<p>Számítsd ki! (Egyszerűsített törtként add meg.)</p>\[${pwx(f, n)}\]`, ans: { vals: [fv(v)], form: 'frac' }, ansText: fplain(v), fmt: 'tört, pl. 9/16',
      hint: T`Törtet úgy hatványozunk, hogy a számlálót és a nevezőt külön hatványozzuk: \(\left(\frac ab\right)^n=\frac{a^n}{b^n}\).`,
      sol: [T`\[${pwx(f, n)}=\frac{${f.n < 0 ? `(${f.n})` : f.n}^{${n}}}{${f.d}^{${n}}}=${ft(v)}\]`] };
  } };

  G.szorzatHatvany = { name: 'Szorzat hatványozása', make() {
    const t = R(0, 2);
    if (t === 0) { const a = R(2, 5), b = R(2, 5), n = R(2, 3); const v = (a * b) ** n;
      return { q: T`<p>Számítsd ki kétféleképpen is – mennyi az értéke?</p>\[(${a}\cdot ${b})^{${n}}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
        hint: T`Szorzatot tényezőnként is hatványozhatunk: \((a\cdot b)^n=a^n\cdot b^n\).`, sol: [T`\((${a}\cdot ${b})^{${n}}=${a * b}^{${n}}=${v}\)`, T`vagy: \(${a}^{${n}}\cdot ${b}^{${n}}=${a ** n}\cdot ${b ** n}=${v}\)`] }; }
    if (t === 1) { const k = R(2, 5), n = R(2, 4), v = k ** n; const x = P(['x', 'a', 'y', 'b']);
      return { q: T`<p>Bontsd fel a zárójelet! Mennyi lesz az együttható (a betű előtti szám)?</p>\[(${k}${x})^{${n}}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
        hint: 'Mindkét tényezőt hatványozni kell – a számot is!', sol: [T`\[(${k}${x})^{${n}}=${k}^{${n}}\cdot ${x}^{${n}}=${v}${x}^{${n}}\]`, T`Gyakori hiba: \(${k}${x}^{${n}}\) – itt a ${k}-t elfelejtették hatványozni.`] }; }
    const k = R(2, 3), m = R(2, 4), n = R(2, 3); const x = P(['x', 'a']); const e = m * n;
    return { q: T`<p>Bontsd fel a zárójelet! Mi lesz a(z) \(${x}\) kitevője?</p>\[\left(${k}${x}^{${m}}\right)^{${n}}\]`, ans: { vals: [e] }, ansText: String(e), fmt: 'egész szám',
      hint: 'Tényezőnként hatványozunk, és a hatvány hatványánál a kitevők szorzódnak.', sol: [T`\[\left(${k}${x}^{${m}}\right)^{${n}}=${k}^{${n}}\cdot\left(${x}^{${m}}\right)^{${n}}=${k ** n}${x}^{${e}}\]`] };
  } };

  G.fejben = { name: 'Fejszámolás azonosságokkal', make() {
    const t = R(0, 3); let tex, v, sol;
    if (t === 0) { const [a, b] = P([[4, 25], [2, 5], [8, 125], [5, 20], [2, 50]]); const n = a * b >= 100 ? R(2, 4) : R(3, 8); v = (a * b) ** n; tex = T`${a}^{${n}}\cdot ${b}^{${n}}`; sol = [T`\(${a}^{${n}}\cdot ${b}^{${n}}=(${a}\cdot ${b})^{${n}}=${a * b}^{${n}}=${bigT(v)}\)`]; }
    else if (t === 1) { const [a, b] = P([[0.5, 2], [0.25, 4], [0.2, 5], [0.125, 8], [1.5, F(2, 3)], [2.5, 0.4]]); const n = R(5, 20); v = 1; tex = T`${bt(a)}^{${n}}\cdot ${bt(b)}^{${n}}`; sol = [T`\(${nt(a)}\cdot ${typeof b === 'object' ? ft(b) : nt(b)}=1\), ezért \(${tex}=1^{${n}}=1\).`]; }
    else if (t === 2) { const n = R(3, 6), m = R(1, 3); v = 10 ** n * 2 ** m; tex = T`2^{${n + m}}\cdot 5^{${n}}`; sol = [T`\(2^{${n + m}}=2^{${m}}\cdot 2^{${n}}\)`, T`\(2^{${m}}\cdot(2\cdot 5)^{${n}}=${2 ** m}\cdot ${bigT(10 ** n)}=${bigT(v)}\)`]; }
    else { const n = R(3, 9); const k = P([2, 3]); v = k ** n; tex = T`\frac{${6 * k}^{${n}}}{6^{${n}}}`; sol = [T`\(\left(\frac{${6 * k}}{6}\right)^{${n}}=${k}^{${n}}=${v}\)`]; }
    return { q: T`<p>Számold ki fejben, az azonosságok segítségével!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'szám',
      hint: 'Keress olyan párokat, amelyek szorzata 10, 100, 1000 vagy 1! Azonos kitevőnél az alapokat összeszorozhatod.', sol };
  } };

  G.vegyes = { name: 'Vegyes feladatok', make() {
    const t = R(0, 2); let tex, v, sol;
    if (t === 0) { const a = R(2, 4), n = R(2, 4), m = R(2, 3); const e = n * m; v = 10 ** (e - R(1, Math.min(4, e - 1))); const k = Math.log10(v); tex = T`\frac{\left(2^{${n}}\cdot 5^{${n}}\right)^{${m}}}{10^{${e - k}}}`; sol = [T`\(\left(2^{${n}}\cdot5^{${n}}\right)^{${m}}=\left(10^{${n}}\right)^{${m}}=10^{${e}}\)`, T`\(10^{${e}}:10^{${e - k}}=10^{${k}}=${bigT(v)}\)`]; }
    else if (t === 1) { const n = R(2, 4); v = 6 ** n; const p = R(1, 3); tex = T`\frac{2^{${n + p}}\cdot 3^{${n}}}{2^{${p}}}`; sol = [T`\(2^{${n + p}}:2^{${p}}=2^{${n}}\)`, T`\(2^{${n}}\cdot3^{${n}}=6^{${n}}=${v}\)`]; }
    else { const n = R(2, 5); v = n % 2 ? -(10 ** n) : 10 ** n; tex = T`(-2)^{${n}}\cdot 5^{${n}}`; sol = [T`\((-2)^{${n}}\cdot5^{${n}}=(-2\cdot5)^{${n}}=(-10)^{${n}}=${v < 0 ? '-' : ''}${bigT(Math.abs(v))}\)`]; }
    return { q: T`<p>Számítsd ki!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: 'Használd a tanult azonosságokat lépésenként (azonos alap: kitevők; azonos kitevő: alapok).', sol };
  } };

  G.hianyzo = { name: 'Mit írjunk a helyére?', make() {
    const t = R(0, 2); let tex, x, sol;
    if (t === 0) { const a = R(2, 6), b = R(2, 6), n = R(2, 4); x = b; tex = T`${a}^{${n}}\cdot\square^{${n}}=${a * b}^{${n}}`; sol = [T`\(${a}\cdot\square=${a * b}\), tehát \(\square=${b}\).`]; }
    else if (t === 1) { const b = R(2, 5), c = R(2, 5), n = R(2, 5); x = b * c; tex = T`\square^{${n}}:${b}^{${n}}=${c}^{${n}}`; sol = [T`\(\square:${b}=${c}\), tehát \(\square=${b * c}\).`]; }
    else { const a = P([2, 4, 5, 8, 20, 25]); const b = 100 / a; const n = R(2, 6); x = b; tex = T`${a}^{${n}}\cdot\square^{${n}}=100^{${n}}`; sol = [T`\(${a}\cdot\square=100\), tehát \(\square=${b}\).`]; }
    return { q: T`<p>Melyik szám kerül a négyzet helyére?</p>\[${tex}\]`, ans: { vals: [x] }, ansText: String(x), fmt: 'egész szám',
      hint: 'A kitevők egyformák – mit kell tudnia az alapoknak?', sol };
  } };

  G.sorrendbe = { name: 'Melyik a nagyobb?', make() {
    const t = R(0, 2); let L, Rr, l, r, sol;
    if (t === 0) { const n = R(3, 8); l = 2 ** n * 5 ** n; r = 10 ** (n + P([-1, 0, 1])); L = T`2^{${n}}\cdot 5^{${n}}`; Rr = T`10^{${Math.log10(r)}}`; sol = [T`\(2^{${n}}\cdot5^{${n}}=10^{${n}}\)`]; }
    else if (t === 1) { const n = R(2, 6); const a = P([2, 3]); l = (a * 2) ** n; r = a ** n * 2 ** (n + P([-1, 0, 1])); L = T`${2 * a}^{${n}}`; Rr = T`${a}^{${n}}\cdot 2^{${Math.round(Math.log2(r / a ** n))}}`; sol = [T`\(${2 * a}^{${n}}=${a}^{${n}}\cdot2^{${n}}\)`]; }
    else { const n = R(2, 5); l = (2 / 3) ** n; r = (3 / 4) ** n; const sw = R(0, 1); if (sw) [l, r] = [r, l]; L = sw ? T`\left(\frac34\right)^{${n}}` : T`\left(\frac23\right)^{${n}}`; Rr = sw ? T`\left(\frac23\right)^{${n}}` : T`\left(\frac34\right)^{${n}}`; sol = [T`Azonos kitevőnél (pozitív alapoknál) a nagyobb alapú a nagyobb: \(\frac23<\frac34\).`]; }
    const c = Math.abs(l - r) < 1e-12 * Math.max(1, l) ? 1 : l < r ? 0 : 2; const s = ['<', '=', '>'];
    return { q: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${L}\;\square\;${Rr}\]`, ans: { choice: s, correct: c }, ansText: s[c], fmt: '',
      hint: 'Alakítsd át az egyik oldalt az azonosságokkal, hogy könnyű legyen összehasonlítani!', sol: sol.concat([T`Tehát \(${L}${s[c]}${Rr}\).`]) };
  } };

  Tananyag.fejezet({
    id: 'azkit',
    cim: 'Műveletek azonos kitevőjű hatványokkal',
    rovid: 'Azonos kitevő',
    bevezeto: T`\(2^3\cdot5^3=?\) Ki lehet számolni \(8\cdot125\)-ként is, de sokkal gyorsabb így: \((2\cdot5)^3=10^3=1000\).`,
    elmelet: T`<div class="mathbox">\[2^3\cdot5^3=(2\cdot2\cdot2)\cdot(5\cdot5\cdot5)=(2\cdot5)\cdot(2\cdot5)\cdot(2\cdot5)=(2\cdot5)^3=10^3\]</div>
<div class="tbl"><table><tr><th>Szabály</th><th>Képlet</th><th>Példa</th></tr>
<tr><td>azonos kitevőjű hatványok szorzata</td><td>\(a^n\cdot b^n=(a\cdot b)^n\)</td><td>\(4^3\cdot25^3=100^3\)</td></tr>
<tr><td>azonos kitevőjű hatványok hányadosa</td><td>\(a^n:b^n=(a:b)^n\)</td><td>\(\dfrac{27^5}{9^5}=3^5\)</td></tr>
<tr><td>szorzat hatványa (fordítva)</td><td>\((a\cdot b)^n=a^n\cdot b^n\)</td><td>\((3x)^2=9x^2\)</td></tr>
<tr><td>tört hatványa</td><td>\(\left(\dfrac ab\right)^n=\dfrac{a^n}{b^n}\)</td><td>\(\left(\dfrac23\right)^3=\dfrac{8}{27}\)</td></tr></table></div>
<div class="prose"><p><b>Az öt hatványazonosság együtt:</b></p><ol>
<li>\(a^m\cdot a^n=a^{m+n}\)</li><li>\(a^m:a^n=a^{m-n}\)</li><li>\(\left(a^m\right)^n=a^{m\cdot n}\)</li><li>\(a^n\cdot b^n=(ab)^n\)</li><li>\(a^n:b^n=\left(\frac ab\right)^n\)</li></ol>
<p><b>Ötletek fejszámoláshoz:</b> keress olyan alapokat, amelyek szorzata 10, 100 vagy 1: \(0{,}5^{8}\cdot2^{8}=1^8=1\), \(2^{7}\cdot5^{5}=2^2\cdot10^5=400\,000\).</p>
<p>Figyelj: \((2x)^3=8x^3\), nem \(2x^3\)! Összegre nincs ilyen szabály: \((2+3)^2\ne2^2+3^2\).</p></div>`,
    igazHamis: [
      { allitas: T`\(2^4\cdot5^4=10^4\)`, igaz: true, miert: T`\((2\cdot5)^4=10^4\).` },
      { allitas: T`\(2^3\cdot3^3=6^6\)`, igaz: false, miert: T`A kitevő nem változik: \((2\cdot3)^3=6^3\).` },
      { allitas: T`\((3x)^2=3x^2\)`, igaz: false, miert: T`A 3-at is hatványozni kell: \((3x)^2=9x^2\).` },
      { allitas: T`\(\left(\frac{1}{2}\right)^{10}\cdot 2^{10}=1\)`, igaz: true, miert: T`\(\left(\frac12\cdot2\right)^{10}=1^{10}=1\).` },
      { allitas: T`\(\frac{15^4}{5^4}=3^4\)`, igaz: true, miert: T`\(\left(\frac{15}{5}\right)^4=3^4\).` },
      { allitas: T`\((2+5)^3=2^3+5^3\)`, igaz: false, miert: T`\(7^3=343\), de \(8+125=133\). Összegre nincs ilyen azonosság.` },
      { allitas: T`\(\left(-\frac23\right)^3=\frac{8}{27}\)`, igaz: false, miert: T`Páratlan kitevő → negatív: \(-\frac{8}{27}\).` },
      { allitas: T`\(2^{10}\cdot5^{9}=2\cdot10^9\)`, igaz: true, miert: T`\(2^{10}=2\cdot2^9\), és \(2^9\cdot5^9=10^9\).`, szint: 'emelt' },
      { general() { const a = R(2, 5), b = R(2, 5), n = R(2, 4); const ok = R(0, 1) === 1; const c = ok ? a * b : a + b; return { allitas: T`\(${a}^{${n}}\cdot ${b}^{${n}}=${c}^{${n}}\)`, igaz: c === a * b, miert: T`Az alapok szorzódnak: \(${a}\cdot ${b}=${a * b}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki: \(\dfrac{\left(2^3\cdot5^3\right)^2}{10^4}\)`,
      lepesek: [
        T`Azonos kitevő: \(2^3\cdot5^3=(2\cdot5)^3=10^3\).`,
        T`Hatvány hatványa: \(\left(10^3\right)^2=10^6\).`,
        T`Azonos alapú osztás: \(10^6:10^4=10^2\).`,
        T`\[\frac{\left(2^3\cdot5^3\right)^2}{10^4}=10^2=100\]`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
