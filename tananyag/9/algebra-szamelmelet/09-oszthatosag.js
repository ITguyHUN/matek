/*
 * II. Algebra és számelmélet / 9. Oszthatóság
 * (Sokszínű matematika 9., II/9. lecke; FGY 1192–1203, 1208–1212; OH Matematika 9., 10. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { keverd, primTenyezok, primT, kitevo, osztokSzama, prim, vel, nak, Az, az, FMT9 } = M9;
  const feladatok = {};
  const PRIMEK = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  /* szám prímtényezős alakból, korlát alatt */
  function veletlenSzam(max = 5000, primek = [2, 3, 5, 7, 11]) {
    for (let g = 0; g < 500; g++) { let n = 1; const k = R(2, 4); for (let i = 0; i < k; i++) n *= P(primek) ** R(1, 3); if (n >= 12 && n <= max) return n; }
    return 360;
  }

  /* ---------- oszthatósági szabályok: hiányzó számjegy ---------- */
  const SZABALY = {
    2: 'az utolsó jegy páros', 3: 'a jegyek összege osztható 3-mal', 4: 'az utolsó két jegyből álló szám osztható 4-gyel', 5: 'az utolsó jegy 0 vagy 5',
    6: 'osztható 2-vel és 3-mal is', 8: 'az utolsó három jegyből álló szám osztható 8-cal', 9: 'a jegyek összege osztható 9-cel', 10: 'az utolsó jegy 0',
    12: 'osztható 3-mal és 4-gyel is', 15: 'osztható 3-mal és 5-tel is', 18: 'osztható 2-vel és 9-cel is', 36: 'osztható 4-gyel és 9-cel is', 45: 'osztható 5-tel és 9-cel is', 25: 'az utolsó két jegyből álló szám osztható 25-tel'
  };
  feladatok.szabalyok = { nev: 'Hiányzó számjegy', general() {
    const d = P([3, 4, 6, 9, 12, 15, 18, 36, 45, 8, 25, 6, 12]);
    const hossz = R(4, 7); const jegyek = [R(1, 9)]; for (let i = 1; i < hossz; i++) jegyek.push(R(0, 9));
    const hely = R(0, 3) === 0 ? hossz - 1 : R(1, hossz - 1);   // az x helye (az első jegy nem lehet)
    const jo = []; for (let c = 0; c <= 9; c++) { const j = jegyek.slice(); j[hely] = c; if (Number(j.join('')) % d === 0) jo.push(c); }
    if (jo.length > 5) return this.general();
    const szamT = jegyek.map((c, i) => i === hely ? 'x' : c).join('');
    return { kerdes: T`<p>Mely számjegy(ek) írható(k) az \(x\) helyére, hogy a szám osztható legyen ${vel(d)}? Add meg az összeset! (Ha nincs ilyen, írd: nincs.)</p>\[\overline{${szamT}}\]`,
      valasz: jo.length ? { ertekek: jo } : { nincs: true }, formatum: FMT9.halmaz,
      tipp: `Egy szám akkor osztható ${vel(d)}, ha ${SZABALY[d]}.`,
      megoldas: [`Szabály: ${SZABALY[d]}.`, jo.length ? T`Megfelel: \(x=${jo.join(';\\ ')}\) (pl. \(${jegyek.map((c, i) => i === hely ? jo[0] : c).join('')}=${d}\cdot ${Number(jegyek.map((c, i) => i === hely ? jo[0] : c).join('')) / d}\)).` : 'Egyik számjegy sem felel meg.'] };
  } };

  /* ---------- prímszámok ---------- */
  feladatok.primek = { nev: 'Prímszámok', general() {
    const t = R(0, 2);
    if (t === 0) { const a = R(1, 90), b = a + R(10, 30); const lista = []; for (let n = a; n <= b; n++) if (prim(n)) lista.push(n);
      return { kerdes: T`<p>Hány prímszám van a \([${a};\ ${b}]\) intervallumban?</p>`, valasz: { ertekek: [lista.length] }, formatum: FMT9.egesz,
        tipp: 'Prímszám az az 1-nél nagyobb egész, amelynek pontosan két pozitív osztója van. Egy n számról elég a √n-nél nem nagyobb prímekkel való oszthatóságot vizsgálni.',
        megoldas: [lista.length ? T`A prímek: \(${lista.join(',\\ ')}\) – összesen ${lista.length}.` : 'Nincs ilyen prím.'] }; }
    if (t === 1) { let n, p; do { p = P([7, 11, 13, 17, 19, 23]); n = p * P([7, 11, 13, 17, 19, 23, 29, 31]); } while (n > 900 || n % p);
      const kicsi = primTenyezok(n)[0][0];
      return { kerdes: T`<p>Mi a legkisebb prímosztója ${az(n)} \(${n}\) számnak?</p>`, valasz: { ertekek: [kicsi] }, formatum: FMT9.egesz,
        tipp: T`Próbáld sorban: 2, 3, 5, 7, 11, 13, … Elég \(\sqrt{${n}}\approx${Math.floor(Math.sqrt(n))}\)-ig menni.`, megoldas: [T`\(${n}=${primT(n)}\), a legkisebb prímosztó: ${kicsi}.`] }; }
    const p = P([2, 3, 5]); const k = R(4, 40); const c = P([1, 3, 7, 9]);
    // p + k prím-e? → „Van-e olyan p prím, hogy p + k is prím?” → számolás: hány ilyen p van 50 alatt?
    const lista = PRIMEK.filter(q => q < 50 && prim(q + k));
    return { kerdes: T`<p>Hány olyan 50-nél kisebb \(p\) prímszám van, amelyre \(p+${k}\) is prímszám?</p>`, valasz: { ertekek: [lista.length] }, formatum: FMT9.egesz,
      tipp: k % 2 ? T`Ha \(p\) páratlan, akkor \(p+${k}\) páros. Mi a helyzet \(p=2\)-vel?` : 'Vizsgáld végig az 50-nél kisebb prímeket!',
      megoldas: [k % 2 ? T`${k} páratlan, ezért páratlan \(p\)-re \(p+${k}\) páros és 2-nél nagyobb, tehát nem prím. Csak \(p=2\) jöhet szóba: \(2+${k}=${2 + k}\), ami ${prim(2 + k) ? 'prím' : 'nem prím'}.` : T`A megfelelő prímek: ${lista.length ? T`\(${lista.join(',\\ ')}\)` : 'nincsenek'}.`, `Összesen ${lista.length}.`] };
  } };

  /* ---------- prímtényezős felbontás ---------- */
  feladatok.primtenyezos = { nev: 'Prímtényezős felbontás', general() {
    const n = veletlenSzam(20000); const f = primTenyezok(n); const t = R(0, 2);
    if (t === 0) { const [p, e] = P(f);
      return { kerdes: T`<p>Írd fel ${az(n)} \(${n}\) számot prímtényezők szorzataként! Hányadik hatványon szerepel benne a ${p}?</p>`, valasz: { ertekek: [e] }, formatum: FMT9.egesz,
        tipp: T`Oszd el a számot sorban a legkisebb prímekkel, ameddig lehet!`, megoldas: [T`\(${n}=${primT(n)}\)`, T`A ${p} kitevője: ${e}.`] }; }
    if (t === 1) return { kerdes: T`<p>Hány különböző prímtényezője van ${az(n)} \(${n}\) számnak?</p>`, valasz: { ertekek: [f.length] }, formatum: FMT9.egesz,
      tipp: 'Bontsd fel prímtényezőkre, és számold meg a különböző prímeket!', megoldas: [T`\(${n}=${primT(n)}\), tehát ${f.length} különböző prímtényező van.`] };
    const osszeg = f.reduce((s, [, e]) => s + e, 0);
    return { kerdes: T`<p>Bontsd fel ${az(n)} \(${n}\) számot prímtényezőkre! Hány prímtényezőből áll a szorzat (a többszörösen szereplőket is többször számolva)?</p>`, valasz: { ertekek: [osszeg] }, formatum: FMT9.egesz,
      tipp: 'A kitevők összegét kell venni.', megoldas: [T`\(${n}=${primT(n)}\)`, T`A kitevők összege: \(${f.map(([, e]) => e).join('+')}=${osszeg}\).`] };
  } };

  /* ---------- osztók száma ---------- */
  feladatok.osztok = { nev: 'Osztók száma', general() {
    const t = R(0, 3);
    if (t < 2) { const n = veletlenSzam(t === 0 ? 1000 : 20000); const f = primTenyezok(n); const d = osztokSzama(n);
      return { kerdes: T`<p>Hány pozitív osztója van ${az(n)} \(${n}\) számnak?</p>`, valasz: { ertekek: [d] }, formatum: FMT9.egesz,
        tipp: T`Ha \(n=p_1^{a_1}\cdot p_2^{a_2}\cdots\), akkor az osztók száma \((a_1+1)(a_2+1)\cdots\).`,
        megoldas: [T`\(${n}=${primT(n)}\)`, T`Az osztók száma: \(${f.map(([, e]) => `(${e}+1)`).join(T`\cdot `)}=${d}\).`] }; }
    if (t === 2) { let n; do { n = veletlenSzam(5000); } while (n % 2); const paros = osztokSzama(n) - osztokSzama(n / 2 ** kitevo(n, 2));
      return { kerdes: T`<p>Hány <b>páros</b> pozitív osztója van ${az(n)} \(${n}\) számnak?</p>`, valasz: { ertekek: [paros] }, formatum: FMT9.egesz,
        tipp: 'A páros osztókban a 2 kitevője legalább 1. Vagy: az összes osztóból vond ki a páratlanokat!',
        megoldas: [T`\(${n}=${primT(n)}\)`, T`Összes osztó: ${osztokSzama(n)}; páratlan osztó (a 2-es tényező nélkül): ${osztokSzama(n / 2 ** kitevo(n, 2))}. Páros: \(${osztokSzama(n)}-${osztokSzama(n / 2 ** kitevo(n, 2))}=${paros}\).`] }; }
    const db = P([4, 6, 8, 9, 10, 12]); const lst = []; for (let n = 2; n <= 3000 && lst.length < 1; n++) if (osztokSzama(n) === db) lst.push(n);
    return { kerdes: T`<p>Melyik a legkisebb pozitív egész szám, amelynek pontosan ${db} pozitív osztója van?</p>`, valasz: { ertekek: [lst[0]] }, formatum: FMT9.egesz,
      tipp: T`Az osztók száma \((a_1+1)(a_2+1)\cdots\), ennek kell ${db}-nek lennie. Írd fel a ${db}-t ilyen szorzatként, és a legkisebb prímekre tedd a legnagyobb kitevőket!`.replace(`${db}-nek`, nak(db)).replace(`a ${db}-t`, `ezt a számot`),
      megoldas: [T`\(${lst[0]}=${primT(lst[0])}\), az osztók száma \(${primTenyezok(lst[0]).map(([, e]) => `(${e}+1)`).join(T`\cdot `)}=${db}\).`] };
  } };

  /* ---------- maradékok ---------- */
  feladatok.maradek = { nev: 'Maradékos osztás', general() {
    const m = R(3, 13); const r1 = R(1, m - 1), r2 = R(1, m - 1); const t = R(0, 3);
    let kif, er, lep;
    if (t === 0) { const a = R(1, 5), b = R(1, 5); er = (a * r1 + b * r2) % m; kif = T`${a === 1 ? '' : a}a+${b === 1 ? '' : b}b`; lep = T`\(${a}\cdot ${r1}+${b}\cdot ${r2}=${a * r1 + b * r2}\)`; }
    else if (t === 1) { er = (r1 * r2) % m; kif = 'a\\cdot b'; lep = T`\(${r1}\cdot ${r2}=${r1 * r2}\)`; }
    else if (t === 2) { er = (r1 * r1) % m; kif = 'a^2'; lep = T`\(${r1}^2=${r1 * r1}\)`; }
    else { er = ((r1 - r2) % m + m) % m; kif = 'a-b'; lep = T`\(${r1}-${r2}=${r1 - r2}\)`; }
    return { kerdes: T`<p>Az \(a\) egész szám ${vel(m)} osztva ${r1}, a \(b\) egész szám ${vel(m)} osztva ${r2} maradékot ad. Mennyi maradékot ad ${vel(m)} osztva a következő kifejezés?</p>\[${kif}\]`,
      valasz: { ertekek: [er] }, formatum: FMT9.nemneg,
      tipp: T`Írd fel: \(a=${m}k+${r1}\), \(b=${m}l+${r2}\). ${Az(m)} ${vel(m)} osztható részek nem számítanak – elég a maradékokkal számolni.`,
      megoldas: [T`Elég a maradékokkal számolni: ${lep}.`, T`Ennek ${vel(m)} vett maradéka: \(${er}\).`] };
  } };

  /* ---------- legkisebb szorzó / osztó (emelt) ---------- */
  feladatok.negyzetszam = { nev: 'Négyzetszám, köbszám', szint: 'emelt', general() {
    const k = P([2, 2, 3]); const t = R(0, 1);
    let n; do { n = veletlenSzam(t === 0 ? 30000 : 3000, [2, 3, 5, 7]); } while (primTenyezok(n).every(([, e]) => e % k === 0));
    const f = primTenyezok(n);
    const szorzo = f.reduce((s, [p, e]) => s * p ** ((k - e % k) % k), 1);
    const oszto = f.reduce((s, [p, e]) => s * p ** (e % k), 1);
    if (t === 0 && oszto === n) return this.general();
    const nev = k === 2 ? 'négyzetszámot' : 'köbszámot';
    if (t === 0) return { kerdes: T`<p>Melyik az a legkisebb pozitív egész szám, amellyel ${az(n)} \(${n}\) számot elosztva ${nev} kapunk?</p>`, valasz: { ertekek: [oszto] }, formatum: FMT9.egesz,
      tipp: `Egy szám akkor ${k === 2 ? 'négyzetszám' : 'köbszám'}, ha a prímtényezős alakjában minden kitevő osztható ${k === 2 ? '2-vel' : '3-mal'}.`,
      megoldas: [T`\(${n}=${primT(n)}\)`, T`Azokat a tényezőket kell elhagyni, amelyek miatt a kitevő nem osztható ${k === 2 ? '2-vel' : '3-mal'}: \(${oszto}\). Ekkor \(${n}:${oszto}=${n / oszto}\).`] };
    return { kerdes: T`<p>Melyik az a legkisebb pozitív egész szám, amellyel ${az(n)} \(${n}\) számot megszorozva ${nev} kapunk?</p>`, valasz: { ertekek: [szorzo] }, formatum: FMT9.egesz,
      tipp: `Egy szám akkor ${k === 2 ? 'négyzetszám' : 'köbszám'}, ha a prímtényezős alakjában minden kitevő osztható ${k === 2 ? '2-vel' : '3-mal'}.`,
      megoldas: [T`\(${n}=${primT(n)}\)`, T`A kitevőket ${k === 2 ? '2-vel' : '3-mal'} osztható számra kell kiegészíteni: a szorzó \(${szorzo}\), és \(${n}\cdot ${szorzo}=${n * szorzo}\).`] };
  } };

  /* ---------- osztója-e? ---------- */
  feladatok.osztoE = { nev: 'Osztója-e?', general() {
    const primek = keverd([2, 3, 5, 7]).slice(0, R(2, 3));
    const A = primek.map(p => [p, R(1, 6)]);
    const B = A.map(([p, e]) => [p, R(0, 1) ? R(0, e) : R(0, e + 2)]).filter(([, e]) => e > 0);
    if (!B.length) return this.general();
    if (R(0, 4) === 0) B.push([P([11, 13]), 1]);
    const ok = B.every(([p, e]) => (A.find(x => x[0] === p) || [p, 0])[1] >= e);
    const tx = l => l.map(([p, e]) => e === 1 ? String(p) : `${p}^{${e}}`).join(T`\cdot `);
    return { kerdes: T`<p>Osztója-e az \(A\) számnak a \(B\) szám?</p>\[A=${tx(A)},\qquad B=${tx(B)}\]`, valasz: { valasztas: ['igen', 'nem'], helyes: ok ? 0 : 1 },
      tipp: 'B akkor osztója A-nak, ha B minden prímtényezője legalább akkora kitevővel szerepel A-ban.',
      megoldas: [ok ? 'B minden prímtényezője legalább akkora kitevőn szerepel A-ban, ezért B osztója A-nak.' : T`Nem osztója, mert ${B.filter(([p, e]) => (A.find(x => x[0] === p) || [p, 0])[1] < e).map(([p, e]) => T`a \(${p}\) kitevője B-ben ${e}, A-ban viszont csak ${(A.find(x => x[0] === p) || [p, 0])[1]}`).join('; ')}.`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg9',
    cim: 'Oszthatóság',
    rovid: 'Oszthatóság, prímek',
    bevezeto: 'Oszthatósági szabályok, prímszámok, prímtényezős felbontás, osztók száma és maradékos osztás.',
    elmelet: T`<div class="prose"><p>Az \(a\) egész szám <b>osztója</b> a \(b\) egésznek (\(a\mid b\)), ha van olyan \(k\) egész, hogy \(b=k\cdot a\).</p></div>
<div class="tbl"><table><tr><th>Osztó</th><th>Szabály</th></tr>
<tr><td>2, 5, 10</td><td>az utolsó jegy alapján</td></tr>
<tr><td>4, 25</td><td>az utolsó két jegyből álló szám alapján</td></tr>
<tr><td>8, 125</td><td>az utolsó három jegyből álló szám alapján</td></tr>
<tr><td>3, 9</td><td>a jegyek összege alapján</td></tr>
<tr><td>6, 12, 15, 18, 36…</td><td>relatív prím tényezőkre bontva: \(12=3\cdot4\), \(36=4\cdot9\)</td></tr></table></div>
<div class="prose"><ul><li><b>Prímszám:</b> pontosan két pozitív osztója van (1 és önmaga). Az 1 nem prím. A 2 az egyetlen páros prím.</li>
<li><b>A számelmélet alaptétele:</b> minden 1-nél nagyobb egész egyértelműen felírható prímszámok szorzataként (a sorrendtől eltekintve), pl. \(360=2^3\cdot3^2\cdot5\).</li>
<li><b>Osztók száma:</b> ha \(n=p_1^{a_1}\cdot p_2^{a_2}\cdots p_k^{a_k}\), akkor \(d(n)=(a_1+1)(a_2+1)\cdots(a_k+1)\). Pl. \(d(360)=4\cdot3\cdot2=24\).</li>
<li><b>Maradékok:</b> összeg, különbség, szorzat maradéka a maradékokkal is kiszámolható: ha \(a\) 7-tel osztva 3, \(b\) 5 maradékot ad, akkor \(a+b\) maradéka \((3+5)-7=1\).</li></ul></div>`,
    igazHamis: [
      { allitas: 'Az 1 prímszám.', igaz: false, miert: 'Az 1-nek csak egy pozitív osztója van.' },
      { allitas: 'A 2 az egyetlen páros prímszám.', igaz: true, miert: 'Minden más páros szám osztható 2-vel és önmagával is, így legalább 3 osztója van.' },
      { allitas: 'A 91 prímszám.', igaz: false, miert: T`\(91=7\cdot13\).` },
      { allitas: 'Ha egy szám osztható 4-gyel és 6-tal, akkor 24-gyel is.', igaz: false, miert: T`Pl. 12 osztható 4-gyel és 6-tal, de 24-gyel nem. (Az LKKT csak 12.)` },
      { allitas: 'Ha egy szám osztható 3-mal és 4-gyel, akkor 12-vel is.', igaz: true, miert: 'A 3 és a 4 relatív prímek.' },
      { allitas: T`A \(360\) pozitív osztóinak száma 24.`, igaz: true, miert: T`\(360=2^3\cdot3^2\cdot5\), \(4\cdot3\cdot2=24\).` },
      { allitas: 'Három egymást követő egész szám szorzata mindig osztható 6-tal.', igaz: true, miert: 'Van köztük páros és 3-mal osztható is.' },
      { allitas: 'Két prímszám összege soha nem prím.', igaz: false, miert: T`\(2+3=5\) prím.` },
      { allitas: 'Ha egy szám jegyeinek összege osztható 3-mal, akkor a szám osztható 9-cel.', igaz: false, miert: 'Pl. 12: jegyösszeg 3, de 12 nem osztható 9-cel.' },
      { allitas: 'Minden négyzetszámnak páratlan sok pozitív osztója van.', igaz: true, miert: 'Az osztók párba állíthatók (d és n/d), kivéve a √n-t.' },
      { allitas: 'Van olyan négyzetszám, amely 40-re végződik.', igaz: false, miert: 'Ha egy négyzetszám 0-ra végződik, akkor 00-ra végződik (osztható 10-zel, így 100-zal is).' },
      { allitas: T`Ha \(a\mid b\) és \(a\mid c\), akkor \(a\mid b+c\).`, igaz: true, miert: T`\(b=ka\), \(c=la\), így \(b+c=(k+l)a\).` },
      { general() { const n = veletlenSzam(2000); const jo = osztokSzama(n); const mut = R(0, 1) ? jo : jo + P([-2, 2, 1]);
        return { allitas: T`A \(${n}\) pozitív osztóinak száma ${mut}.`, igaz: mut === jo, miert: T`\(${n}=${primT(n)}\), az osztók száma ${jo}.` }; } }
    ],
    mintapelda: {
      feladat: T`Mely számjegyek írhatók \(x\) helyére, hogy \(\overline{6135x2}\) osztható legyen 12-vel?`,
      lepesek: [T`\(12=3\cdot4\), és a 3 és a 4 relatív prímek, ezért 3-mal és 4-gyel is oszthatónak kell lennie.`, T`4-gyel: az utolsó két jegy, \(\overline{x2}\) osztható 4-gyel: \(x\in\{1;3;5;7;9\}\).`, T`3-mal: a jegyösszeg \(6+1+3+5+x+2=17+x\) osztható 3-mal: \(x\in\{1;4;7\}\).`, T`Mindkettő teljesül: \(x=1\) vagy \(x=7\).`]
    },
    feladatok
  }));
})();
