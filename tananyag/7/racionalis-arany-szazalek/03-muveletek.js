/*
 * 3. fejezet – Műveletek racionális számokkal
 * Témakör: Racionális számok, arányosság, százalék (7. évfolyam, TK 2. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, sf, tbl, randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, $, esc } = M7;
  const FMT = M7.FMT7;
  const G = {};

  G.osszead = { ch: 'muv', name: 'Összeadás, kivonás', make() {
    const a = smallFrac(), b = smallFrac(); const plus = R(0, 1) === 1;
    const res = plus ? fadd(a, b) : fsub(a, b); const D = a.d * b.d / gcd(a.d, b.d);
    const an = a.n * D / a.d, bn = b.n * D / b.d; const op = plus ? '+' : '-';
    const sol = [T`Közös nevező (a nevezők legkisebb közös többszöröse): \(${D}\).`,
      T`\[${ft(a)}${op}${fp(b)}=\frac{${an}}{${D}}${op}${bn < 0 ? T`\left(\frac{${bn}}{${D}}\right)` : T`\frac{${bn}}{${D}}`}=\frac{${an}${plus ? (bn < 0 ? '-' + (-bn) : '+' + bn) : (bn < 0 ? '+' + (-bn) : '-' + bn)}}{${D}}=\frac{${plus ? an + bn : an - bn}}{${D}}\]`];
    if (res.d !== D || Math.abs(res.n) > res.d) sol.push(T`\[=${ft(res)}${Math.abs(res.n) > res.d && res.d > 1 ? '=' + fmix(res) : ''}\]`);
    if (!plus && b.n < 0) sol.push('Ne feledd: negatív szám kivonása ugyanaz, mint az ellentettjének hozzáadása.');
    return { q: T`<p>Végezd el a műveletet!</p>\[${ft(a)}${op}${fp(b)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'Hozd a törteket közös nevezőre, és csak a számlálókat add össze (vond ki)! Figyelj az előjelekre!', sol };
  } };

  G.szoroz = { ch: 'muv', name: 'Szorzás', make() {
    let a, b; do { a = smallFrac(10); b = smallFrac(10); } while (gcd(a.n, b.d) === 1 && gcd(b.n, a.d) === 1 && R(0, 2) > 0);
    const res = fmul(a, b); const neg = (a.n < 0) !== (b.n < 0);
    const g1 = gcd(a.n, b.d), g2 = gcd(b.n, a.d);
    const sol = [T`Előjel: ${neg ? 'egy negatív tényező → az eredmény <b>negatív</b>' : (a.n < 0 ? 'két negatív tényező → az eredmény <b>pozitív</b>' : 'mindkét tényező pozitív')}.`];
    if (g1 > 1 || g2 > 1) sol.push('Szorzás előtt keresztben egyszerűsítünk (az egyik tört számlálóját és a másik tört nevezőjét ugyanazzal a számmal osztjuk).');
    sol.push(T`\[${fp(a)}\cdot${fp(b)}=${neg ? '-' : ''}\frac{${Math.abs(a.n) / g1}\cdot ${Math.abs(b.n) / g2}}{${a.d / g2}\cdot ${b.d / g1}}=${ft(res)}\]`);
    return { q: T`<p>Végezd el a szorzást!</p>\[${fp(a)}\cdot${fp(b)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'Számlálót a számlálóval, nevezőt a nevezővel szorzunk – de előtte érdemes keresztben egyszerűsíteni. Az előjelet külön döntsd el!', sol };
  } };

  G.oszt = { ch: 'muv', name: 'Osztás', make() {
    const a = smallFrac(10), b = smallFrac(10); const mixed = R(0, 2) === 0 && Math.abs(a.n) > a.d;
    const res = fdiv(a, b); const rb = F(b.d, b.n);
    const sol = [];
    if (mixed) sol.push(T`Vegyes számot előbb törtté alakítunk: \(${fmix(a)}=${ft(a)}\).`);
    sol.push(T`Osztás helyett szorzunk az osztó reciprokával: \(${ft(b)}\) reciproka \(${ft(rb)}\).`);
    sol.push(T`\[${mixed ? fmixp(a) : fp(a)}:${fp(b)}=${fp(a)}\cdot${fp(rb)}=${ft(res)}${Math.abs(res.n) > res.d && res.d > 1 ? '=' + fmix(res) : ''}\]`);
    return { q: T`<p>Végezd el az osztást!</p>\[${mixed ? fmixp(a) : fp(a)}:${fp(b)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: T`Törttel úgy osztunk, hogy a reciprokával szorzunk: \(\frac{a}{b}:\frac{c}{d}=\frac{a}{b}\cdot\frac{d}{c}\).`, sol };
  } };

  G.tizedes = { ch: 'muv', name: 'Tizedes törtek', make() {
    const t = R(0, 1);
    if (t === 0) { const a = R(-60, 60) / 10 || 1.5, b = P([0.2, 0.4, 0.5, 2.5, 1.5, 0.3, 1.2, 0.25, 0.04, 0.6]) * P([1, -1]); const res = +(a * b).toFixed(6);
      const da = (String(Math.abs(a)).split('.')[1] || '').length, db = (String(Math.abs(b)).split('.')[1] || '').length;
      const ia = Math.round(Math.abs(a) * 10 ** da), ib = Math.round(Math.abs(b) * 10 ** db);
      return { q: T`<p>Végezd el a szorzást!</p>\[${ntp(a)}\cdot ${ntp(b)}\]`, ans: { vals: [res] }, ansText: hu(res), fmt: FMT.dec,
        hint: 'Szorozz tizedesvessző nélkül, majd annyi tizedesjegyet jelölj ki az eredményben, ahány a két tényezőben összesen van!',
        sol: [T`Előjel: ${(a < 0) !== (b < 0) ? 'negatív' : 'pozitív'}.`, T`Vessző nélkül: \(${ia}\cdot ${ib}=${ia * ib}\).`, T`Tizedesjegyek száma: \(${da}+${db}=${da + db}\), így az eredmény \(${nt(res)}\).`] }; }
    const b = P([0.2, 0.4, 0.5, 0.25, 0.04, 0.05, 0.3, 1.2, 0.6]) * P([1, -1]); const q = R(-40, 40) || 7; const a = +(b * q / P([1, 1, 10])).toFixed(6); const res = +(a / b).toFixed(6);
    const db = (String(Math.abs(b)).split('.')[1] || '').length; const s = 10 ** db;
    return { q: T`<p>Végezd el az osztást!</p>\[${ntp(a)}:${ntp(b)}\]`, ans: { vals: [res] }, ansText: hu(res), fmt: 'szám, pl. 30 vagy 2,5',
      hint: 'Bővítsd az osztandót és az osztót is 10-zel, 100-zal… úgy, hogy az osztó egész szám legyen!',
      sol: [T`Bővítünk (mindkét számot \(${s}\)${s === 10 ? '-zel' : s === 1000 ? '-rel' : '-zal'} szorozzuk): \[${ntp(a)}:${ntp(b)}=${ntp(+(a * s).toFixed(6))}:${ntp(+(b * s).toFixed(6))}=${nt(res)}\]`, `Előjel: ${(a < 0) !== (b < 0) ? 'különböző előjelűek → negatív' : 'azonos előjelűek → pozitív'}.`] };
  } };

  Tananyag.fejezet({
    id: 'muv',
    cim: 'Műveletek racionális számokkal',
    rovid: 'Műveletek',
    bevezeto: T`Összeadás, kivonás, szorzás, osztás törtekkel és tizedes törtekkel – az előjelekre figyelve.`,
    elmelet: T`<div class="mathbox">\[\frac ab\pm\frac cd=\frac{ad\pm cb}{bd}\qquad \frac ab\cdot\frac cd=\frac{a\cdot c}{b\cdot d}\qquad \frac ab:\frac cd=\frac ab\cdot\frac dc\]</div>
<div class="prose"><ul>
<li><b>Összeadás, kivonás:</b> közös nevezőre hozunk (a nevezők legkisebb közös többszörösére), csak a számlálókat adjuk össze.</li>
<li><b>Negatív szám kivonása</b> = az ellentett hozzáadása: \(a-(-b)=a+b\).</li>
<li><b>Szorzás:</b> előtte egyszerűsíts keresztben! \(\frac{4}{9}\cdot\frac{3}{8}=\frac{1}{3}\cdot\frac{1}{2}=\frac16\).</li>
<li><b>Osztás:</b> az osztó <b>reciprokával</b> szorzunk. A reciprok: számláló és nevező csere (\(\frac57\to\frac75\)). A 0-nak nincs reciproka.</li>
<li><b>Vegyes számmal</b> előbb törtté alakítunk: \(2\frac14=\frac94\).</li></ul></div>
<div class="tbl"><table><tr><th>Előjelszabály</th><th>szorzás</th><th>osztás</th></tr>
<tr><td>azonos előjelűek</td><td>\((+)\cdot(+)=(+)\), \((-)\cdot(-)=(+)\)</td><td>\((-):(-)=(+)\)</td></tr>
<tr><td>különböző előjelűek</td><td>\((+)\cdot(-)=(-)\)</td><td>\((-):(+)=(-)\)</td></tr></table></div>
<div class="prose"><p><b>Tizedes törtek:</b> szorzásnál vessző nélkül szorzunk, majd annyi tizedesjegyet jelölünk, ahány a tényezőkben összesen van (\(0{,}2\cdot0{,}3=0{,}06\)). Osztásnál bővítünk, hogy az osztó egész legyen (\(1{,}2:0{,}04=120:4=30\)).</p></div>`,
    igazHamis: [
      { allitas: T`\(\frac12+\frac13=\frac25\)`, igaz: false, miert: T`A nevezőket nem adjuk össze! \(\frac36+\frac26=\frac56\).` },
      { allitas: T`\(\left(-\frac23\right)\cdot\left(-\frac34\right)=\frac12\)`, igaz: true, miert: T`Két negatív szorzata pozitív, és \(\frac{2\cdot3}{3\cdot4}=\frac{6}{12}=\frac12\).` },
      { allitas: T`\(\frac34:\frac12=\frac38\)`, igaz: false, miert: T`Osztásnál a reciprokkal szorzunk: \(\frac34\cdot\frac21=\frac32\). (A \(\frac38\) a szorzat lenne.)` },
      { allitas: T`Két negatív szám hányadosa negatív.`, igaz: false, miert: T`Azonos előjelűek hányadosa pozitív: \((-6):(-2)=3\).` },
      { allitas: T`\(0{,}2\cdot 0{,}3=0{,}6\)`, igaz: false, miert: T`\(2\cdot3=6\), és összesen 2 tizedesjegy kell: \(0{,}06\).` }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki: \(\left(-2\frac14\right):1\frac12\)`,
      lepesek: [
        T`A vegyes számokat törtté alakítjuk: \(-2\frac14=-\frac94\) és \(1\frac12=\frac32\).`,
        T`Osztás helyett a reciprokkal szorzunk: \[-\frac94:\frac32=-\frac94\cdot\frac23\]`,
        T`Keresztben egyszerűsítünk (9 és 3 → 3 és 1; 4 és 2 → 2 és 1): \[-\frac{3}{2}\cdot\frac{1}{1}=-\frac32=-1\frac12\]`,
        T`Előjel: negatív osztva pozitívval negatív. ✔`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
