/*
 * 3. fejezet – Műveletek racionális számokkal
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK 2. lecke)
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
    sol.push(T`\[${fp(a)}\cdot ${fp(b)}=${neg ? '-' : ''}\frac{${Math.abs(a.n) / g1}\cdot ${Math.abs(b.n) / g2}}{${a.d / g2}\cdot ${b.d / g1}}=${ft(res)}\]`);
    return { q: T`<p>Végezd el a szorzást!</p>\[${fp(a)}\cdot ${fp(b)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'Számlálót a számlálóval, nevezőt a nevezővel szorzunk – de előtte érdemes keresztben egyszerűsíteni. Az előjelet külön döntsd el!', sol };
  } };

  G.oszt = { ch: 'muv', name: 'Osztás', make() {
    const a = smallFrac(10), b = smallFrac(10); const mixed = R(0, 2) === 0 && Math.abs(a.n) > a.d;
    const res = fdiv(a, b); const rb = F(b.d, b.n);
    const sol = [];
    if (mixed) sol.push(T`Vegyes számot előbb törtté alakítunk: \(${fmix(a)}=${ft(a)}\).`);
    sol.push(T`Osztás helyett szorzunk az osztó reciprokával: \(${ft(b)}\) reciproka \(${ft(rb)}\).`);
    sol.push(T`\[${mixed ? fmixp(a) : fp(a)}:${fp(b)}=${fp(a)}\cdot ${fp(rb)}=${ft(res)}${Math.abs(res.n) > res.d && res.d > 1 ? '=' + fmix(res) : ''}\]`);
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

  /* ---- Bővítés (2026. november): további feladattípusok ---- */

  G.egeszek = { ch: 'muv', name: 'Egész számok előjelekkel', make() {
    const k = R(3, 5); const xs = Array.from({ length: k }, () => R(-25, 25) || 7); const ops = Array.from({ length: k - 1 }, () => P(['+', '-']));
    let v = xs[0]; ops.forEach((o, i) => { v = o === '+' ? v + xs[i + 1] : v - xs[i + 1]; });
    const tex = xs[0] + ops.map((o, i) => o + (xs[i + 1] < 0 ? `(${xs[i + 1]})` : xs[i + 1])).join('');
    const egysz = xs[0] + ops.map((o, i) => { const y = o === '+' ? xs[i + 1] : -xs[i + 1]; return y < 0 ? `-${-y}` : `+${y}`; }).join('');
    return { q: T`<p>Számítsd ki!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: hu(v), fmt: 'egész szám',
      hint: 'Negatív szám hozzáadása = kivonás; negatív szám kivonása = hozzáadás. Utána balról jobbra haladj!',
      sol: [T`A zárójelek elhagyása után: \(${egysz}\)`, T`Külön összeadhatod a pozitívakat és a negatívakat is: \(${v}\).`] };
  } };

  G.vegyesSzamok = { ch: 'muv', name: 'Vegyes számok összeadása, kivonása', make() {
    const mk = () => { const d = R(2, 9); let r; do { r = R(1, d - 1); } while (gcd(r, d) !== 1); return F(R(1, 6) * d + r, d); };
    const a = mk(), b = mk(); const plus = R(0, 1) === 1; const res = plus ? fadd(a, b) : fsub(a, b);
    return { q: T`<p>Végezd el a műveletet! Az eredményt vegyes számként is beírhatod (pl. <code>2 1/4</code>).</p>\[${fmix(a)}${plus ? '+' : '-'}${fmix(b)}\]`, ans: { vals: [fv(res)] }, ansText: fmixplain(res), fmt: 'szám, vegyes szám vagy tört',
      hint: 'Alakítsd áltörtté, vagy külön számold az egészeket és a törtrészeket (közös nevezővel)!',
      sol: [T`Áltörtté alakítva: \(${fmix(a)}=${ft(a)}\), \(${fmix(b)}=${ft(b)}\).`, T`\[${ft(a)}${plus ? '+' : '-'}${ft(b)}=${ft(res)}${Math.abs(res.n) > res.d && res.d > 1 ? '=' + fmix(res) : ''}\]`] };
  } };

  G.tortTizedes = { ch: 'muv', name: 'Tört és tizedes tört együtt', make() {
    const dec = P([0.25, 0.5, 0.75, 0.2, 0.4, 0.6, 0.8, 1.5, 1.25, 2.5, 0.125, 0.3, 0.7, 1.2]) * P([1, 1, -1]); const fd = F(Math.round(dec * 1000), 1000);
    const f = smallFrac(9); const op = P(['+', '-', T`\cdot`, ':']);
    const res = op === '+' ? fadd(fd, f) : op === '-' ? fsub(fd, f) : op === ':' ? fdiv(fd, f) : fmul(fd, f);
    return { q: T`<p>Számítsd ki!</p>\[${ntp(dec)}${op}${fp(f)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'Írd át a tizedes törtet közönséges törtté (pl. 0,75 = 3/4), és úgy számolj!',
      sol: [T`\(${nt(dec)}=${ft(fd)}\)`, T`\[${fp(fd)}${op}${fp(f)}=${ft(res)}\]`] };
  } };

  G.hianyzo = { ch: 'muv', name: 'Melyik szám hiányzik?', make() {
    const x = smallFrac(8), a = smallFrac(8); const t = R(0, 3); let tex, b, sol;
    if (t === 0) { b = fadd(x, a); tex = T`\square+${fp(a)}=${ft(b)}`; sol = [T`\(\square=${ft(b)}-${fp(a)}=${ft(x)}\)`]; }
    else if (t === 1) { b = fsub(x, a); tex = T`\square-${fp(a)}=${ft(b)}`; sol = [T`\(\square=${ft(b)}+${fp(a)}=${ft(x)}\)`]; }
    else if (t === 2) { b = fmul(x, a); tex = T`${fp(a)}\cdot\square=${ft(b)}`; sol = [T`\(\square=${ft(b)}:${fp(a)}=${fp(b)}\cdot ${fp(F(a.d, a.n))}=${ft(x)}\)`]; }
    else { b = fdiv(a, x); tex = T`${fp(a)}:\square=${ft(b)}`; sol = [T`Az osztó = osztandó : hányados.`, T`\(\square=${fp(a)}:${fp(b)}=${ft(x)}\)`]; }
    return { q: T`<p>Melyik szám kerül a négyzet helyére?</p>\[${tex}\]`, ans: { vals: [fv(x)] }, ansText: fplain(x), fmt: FMT.frac,
      hint: 'Használd a művelet „fordítottját”: összeadás ↔ kivonás, szorzás ↔ osztás. Ellenőrizz visszahelyettesítéssel!', sol: sol.concat([T`Ellenőrzés: visszaírva igaz az egyenlőség.`]) };
  } };

  G.szovegesMuv = { ch: 'muv', name: 'Szöveges feladatok', make() {
    const t = R(0, 3);
    if (t === 0) { const h0 = R(-12, 4), d1 = R(3, 12), d2 = R(2, 15); const v = h0 + d1 - d2;
      return { q: `<p>Reggel ${hu(h0)} °C volt. Délig ${d1} fokot emelkedett a hőmérséklet, estére pedig ${d2} fokot csökkent. Hány fok volt este?</p>`, ans: { vals: [v] }, ansText: hu(v), fmt: 'egész szám (°C)',
        hint: 'Az emelkedés hozzáadás, a csökkenés kivonás.', sol: [T`\(${h0}+${d1}-${d2}=${v}\) °C`] }; }
    if (t === 1) { const d = P([2, 3, 4, 5, 6, 8]); const fa = F(R(1, d - 1), d); const L = d * R(2, 12) * P([1, 2]); const ki = L * fa.n / fa.d; const be = L * R(1, 4) / 4;
      if (!Number.isInteger(be)) return G.szovegesMuv.make();
      const v = L - ki + be;
      return { q: T`<p>Egy ${L} literes hordó tele van vízzel. Kiengedtük a víz \(${ft(fa)}\) részét, majd ${hu(be)} litert visszatöltöttünk. Hány liter víz van most a hordóban?</p>`, ans: { vals: [v] }, ansText: hu(v), fmt: 'szám (liter)',
        hint: 'Előbb számold ki, hány liter a kiengedett rész!', sol: [T`Kiengedtünk \(${L}\cdot ${ft(fa)}=${ki}\) litert, maradt \(${L - ki}\) liter.`, T`Visszatöltés után: \(${L - ki}+${be}=${v}\) liter.`] }; }
    if (t === 2) { const m = R(-120, -20), up = R(10, -m - 5); const v = m + up;
      return { q: `<p>Egy búvár ${-m} m mélyen van a tengerszint alatt (ez −${-m} m). Felúszik ${up} métert. Hol van most a tengerszinthez képest? (Tengerszint felett pozitív, alatta negatív.)</p>`, ans: { vals: [v] }, ansText: hu(v), fmt: 'egész szám (m)',
        hint: 'A felfelé mozgás hozzáadás.', sol: [T`\(${m}+${up}=${v}\) m`] }; }
    const ar = P([0.25, 0.5, 0.75, 1.5, 2.5, 1.25, 0.4, 0.6, 1.2, 0.8]); const fb = R(0, 1) === 1; const per = P([480, 640, 720, 960, 1200, 360]);
    const v = +(ar * per).toFixed(2);
    return { q: `<p>${hu(ar)} kg ${fb ? 'sajtot' : 'szőlőt'} vettünk, amelynek kilója ${per} Ft. Mennyit fizettünk?</p>`, ans: { vals: [v] }, ansText: hu(v), fmt: 'szám (Ft)',
      hint: 'Mennyiség · egységár.', sol: [T`\(${nt(ar)}\cdot ${per}=${nt(v)}\) Ft`] };
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
<div class="prose"><p><b>Tizedes törtek:</b> szorzásnál vessző nélkül szorzunk, majd annyi tizedesjegyet jelölünk, ahány a tényezőkben összesen van (\(0{,}2\cdot0{,}3=0{,}06\)). Osztásnál bővítünk, hogy az osztó egész legyen (\(1{,}2:0{,}04=120:4=30\)).</p></div>
<div class="prose"><p><b>Hiányzó szám:</b> a művelet megfordításával kapjuk meg. Ha \(\square\cdot\frac23=\frac49\), akkor \(\square=\frac49:\frac23=\frac49\cdot\frac32=\frac23\). Ha \(\frac34:\square=\frac12\), akkor \(\square=\frac34:\frac12=\frac32\) (osztó = osztandó : hányados).</p>
<p><b>Tört és tizedes tört együtt:</b> érdemes mindent törtté alakítani: \(0{,}75+\frac16=\frac34+\frac16=\frac{9}{12}+\frac{2}{12}=\frac{11}{12}\).</p></div>`,
    igazHamis: [
      { allitas: T`\(\frac12+\frac13=\frac25\)`, igaz: false, miert: T`A nevezőket nem adjuk össze! \(\frac36+\frac26=\frac56\).` },
      { allitas: T`\(\left(-\frac23\right)\cdot\left(-\frac34\right)=\frac12\)`, igaz: true, miert: T`Két negatív szorzata pozitív, és \(\frac{2\cdot3}{3\cdot4}=\frac{6}{12}=\frac12\).` },
      { allitas: T`\(\frac34:\frac12=\frac38\)`, igaz: false, miert: T`Osztásnál a reciprokkal szorzunk: \(\frac34\cdot\frac21=\frac32\). (A \(\frac38\) a szorzat lenne.)` },
      { allitas: T`Két negatív szám hányadosa negatív.`, igaz: false, miert: T`Azonos előjelűek hányadosa pozitív: \((-6):(-2)=3\).` },
      { allitas: T`\(0{,}2\cdot 0{,}3=0{,}6\)`, igaz: false, miert: T`\(2\cdot3=6\), és összesen 2 tizedesjegy kell: \(0{,}06\).` },
      { allitas: T`\(-8-(-3)=-11\)`, igaz: false, miert: T`Negatív szám kivonása = hozzáadás: \(-8+3=-5\).` },
      { allitas: T`\(2\frac12+1\frac23=4\frac16\)`, igaz: true, miert: T`\(\frac52+\frac53=\frac{15}{6}+\frac{10}{6}=\frac{25}{6}=4\frac16\).` },
      { allitas: T`Ha egy pozitív számot 1-nél kisebb pozitív számmal szorzunk, az eredmény kisebb lesz az eredeti számnál.`, igaz: true, miert: T`Pl. \(10\cdot0{,}5=5<10\). Az 1-nél kisebb szorzó „csökkent”.` },
      { allitas: T`Ha egy pozitív számot 1-nél kisebb pozitív számmal osztunk, az eredmény kisebb lesz.`, igaz: false, miert: T`Nagyobb lesz: \(10:0{,}5=20\). Ugyanaz, mint a reciprokkal (2-vel) szorozni.` },
      { allitas: T`\(0{,}25\cdot\frac{4}{5}=\frac15\)`, igaz: true, miert: T`\(0{,}25=\frac14\), és \(\frac14\cdot\frac45=\frac15\).` },
      { general() { const a = R(-9, 9) || 2, b = R(-9, 9) || -5; const neg = a * b < 0; return { allitas: T`\((${a})\cdot(${b})\) negatív.`, igaz: neg, miert: T`\((${a})\cdot(${b})=${a * b}\). ${a * b === 0 ? 'A 0 se nem pozitív, se nem negatív.' : neg ? 'Különböző előjelű tényezők szorzata negatív.' : 'Azonos előjelű tényezők szorzata pozitív.'}` }; } }
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
