/*
 * II. Algebra és számelmélet / 10. Legnagyobb közös osztó, legkisebb közös többszörös
 * (Sokszínű matematika 9., II/10. lecke; FGY 1204–1214, 1186–1187; OH Matematika 9., 10. lecke; Maxim Matematika 9.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 9/kurzus.js elején vannak (M9).
 */
(function () {
  const { kulonbozo, primTenyezok, primT, kitevo, lkkt, lnkoT, lkktT, vel, az, Az, FMT9 } = M9;
  const feladatok = {};
  /* számpár közös tényezővel: a = g·u, b = g·v */
  function par(maxG = 60, maxUV = 25) { for (let i = 0; i < 300; i++) { const g = R(2, maxG), [u, v] = kulonbozo(2, 2, maxUV); if (gcd(u, v) === 1 && g * u < 2000 && g * v < 2000) return [g * u, g * v]; } return [420, 560]; }
  const pt = n => primT(n);
  /* a prímtényezős alakokból LNKO és LKKT magyarázata */
  function magyar(sz, mi) {
    const pr = [...new Set(sz.flatMap(n => primTenyezok(n).map(([p]) => p)))].sort((a, b) => a - b);
    const kit = pr.map(p => [p, mi === 'lnko' ? Math.min(...sz.map(n => kitevo(n, p))) : Math.max(...sz.map(n => kitevo(n, p)))]).filter(([, e]) => e > 0);
    return kit.length ? kit.map(([p, e]) => e === 1 ? String(p) : `${p}^{${e}}`).join(T`\cdot `) : '1';
  }
  const jel = (sz, mi) => mi === 'lnko' ? `(${sz.join(';\\,')})` : `[${sz.join(';\\,')}]`;

  /* ---------- LNKO ---------- */
  feladatok.lnko = { nev: 'Legnagyobb közös osztó', general() {
    const harom = R(0, 3) === 0; let sz;
    if (harom) { const g = R(2, 30); const t = kulonbozo(3, 2, 20); if (lnkoT(...t) !== 1) return this.general(); sz = t.map(x => x * g); }
    else sz = par();
    const er = lnkoT(...sz);
    return { kerdes: T`<p>Számítsd ki a számok legnagyobb közös osztóját!</p>\[${jel(sz, 'lnko')}=\;?\]`, valasz: { ertekek: [er] }, formatum: FMT9.egesz,
      tipp: 'Bontsd fel a számokat prímtényezőkre! Az LNKO-ba a közös prímtényezők kerülnek, a legkisebb előforduló kitevőn.',
      megoldas: [sz.map(n => T`\(${n}=${pt(n)}\)`).join(', '), T`\[${jel(sz, 'lnko')}=${magyar(sz, 'lnko')}=${er}\]`] };
  } };

  /* ---------- LKKT ---------- */
  feladatok.lkkt = { nev: 'Legkisebb közös többszörös', general() {
    const harom = R(0, 2) === 0; let sz;
    if (harom) { sz = kulonbozo(3, 4, 40); if (lkktT(...sz) > 5000) return this.general(); }
    else { sz = par(30, 15); if (lkktT(...sz) > 20000) return this.general(); }
    const er = lkktT(...sz);
    return { kerdes: T`<p>Számítsd ki a számok legkisebb közös többszörösét!</p>\[${jel(sz, 'lkkt')}=\;?\]`, valasz: { ertekek: [er] }, formatum: FMT9.egesz,
      tipp: 'Bontsd fel a számokat prímtényezőkre! Az LKKT-ba minden előforduló prímtényező bekerül, a legnagyobb előforduló kitevőn.',
      megoldas: [sz.map(n => T`\(${n}=${pt(n)}\)`).join(', '), T`\[${jel(sz, 'lkkt')}=${magyar(sz, 'lkkt')}=${er}\]`] };
  } };

  /* ---------- prímtényezős alakból ---------- */
  feladatok.primAlak = { nev: 'Prímtényezős alakból', general() {
    const pr = [2, 3, 5, 7].filter(() => R(0, 3) > 0); if (pr.length < 2) return this.general();
    const A = pr.map(p => [p, R(0, 5)]), B = pr.map(p => [p, R(0, 5)]);
    if (A.every(([, e]) => !e) || B.every(([, e]) => !e)) return this.general();
    const tx = l => l.filter(([, e]) => e).map(([p, e]) => e === 1 ? String(p) : `${p}^{${e}}`).join(T`\cdot `);
    const mi = P(['lnko', 'lkkt']); const p = P(pr);
    const eA = A.find(x => x[0] === p)[1], eB = B.find(x => x[0] === p)[1];
    const e = mi === 'lnko' ? Math.min(eA, eB) : Math.max(eA, eB);
    return { kerdes: T`<p>Hányadik hatványon szerepel a ${p} a két szám ${mi === 'lnko' ? 'legnagyobb közös osztójában' : 'legkisebb közös többszörösében'}? (Ha nem szerepel, írj 0-t.)</p>\[A=${tx(A)},\qquad B=${tx(B)}\]`,
      valasz: { ertekek: [e] }, formatum: FMT9.nemneg,
      tipp: mi === 'lnko' ? 'LNKO: minden prím a kisebbik kitevőjén (ha valamelyikben nincs, akkor 0-n).' : 'LKKT: minden prím a nagyobbik kitevőjén.',
      megoldas: [T`A ${p} kitevője \(A\)-ban ${eA}, \(B\)-ben ${eB}.`, T`${mi === 'lnko' ? 'A kisebbik' : 'A nagyobbik'}: ${e}.`] };
  } };

  /* ---------- szöveges feladatok ---------- */
  feladatok.szoveges = { nev: 'Szöveges feladatok', general() {
    const t = R(0, 6);
    if (t === 0) { const [a, b] = kulonbozo(2, 6, 25); const k = lkkt(a, b); const ora = R(6, 8);
      return { kerdes: T`<p>Egy buszállomásról az egyik járat ${a} percenként, a másik ${b} percenként indul. Reggel ${ora} órakor egyszerre indultak. Legközelebb hány perc múlva indulnak ismét egyszerre?</p>`,
        valasz: { ertekek: [k] }, formatum: 'egész szám (perc)', tipp: 'Olyan időtartam kell, amely mindkét számnak többszöröse – a legkisebb ilyen.', megoldas: [T`\([${a};\,${b}]=${k}\), tehát ${k} perc múlva.`] }; }
    if (t === 1) { const [a, b] = par(40, 9).map(x => x * P([1, 1, 2])); const g = gcd(a, b);
      return { kerdes: T`<p>Egy \(${a}\ \text{cm}\times ${b}\ \text{cm}\)-es téglalap alakú lapot egybevágó, egész cm oldalú négyzetekre akarunk vágni, maradék nélkül. Legfeljebb mekkora lehet egy négyzet oldala (cm)?</p>`,
        valasz: { ertekek: [g] }, formatum: 'egész szám (cm)', tipp: 'A négyzet oldalának mindkét oldalhossznak osztójának kell lennie – a legnagyobb ilyen.', megoldas: [T`\((${a};\,${b})=${g}\), tehát ${g} cm.`] }; }
    if (t === 2) { const g = R(12, 300), r = R(3, Math.min(60, g - 1)); const [u, v] = kulonbozo(2, 2, 12); if (gcd(u, v) !== 1) return this.general(); const a = g * u + r, b = g * v + r;
      return { kerdes: T`<p>Melyik az a legnagyobb pozitív egész szám, amellyel ${az(a)} ${a} és ${az(b)} ${b} számot elosztva mindkét esetben ${r} a maradék?</p>`,
        valasz: { ertekek: [g] }, formatum: FMT9.egesz, tipp: T`A keresett szám osztója \(${a}-${r}\)-nek és \(${b}-${r}\)-nek is, és nagyobb ${r}-nél.`,
        megoldas: [T`\(${a}-${r}=${a - r}\), \(${b}-${r}=${b - r}\).`, T`\((${a - r};\,${b - r})=${g}\), és \(${g}>${r}\), tehát a szám ${g}.`] }; }
    if (t === 3) { const oszt = P([[2, 3, 4], [2, 3, 4, 5], [2, 3, 4, 5, 6], [3, 4, 5], [4, 6, 9], [5, 6, 8]]); const r = P([1, 1, -1]);
      const L = lkktT(...oszt); const n = r === 1 ? L + 1 : L - 1;
      return { kerdes: T`<p>Melyik az a legkisebb pozitív egész szám, amely ${oszt.slice(0, -1).join(', ')} és ${oszt[oszt.length - 1]} közül bármelyikkel osztva ${r === 1 ? '1 a maradék' : 'a maradék eggyel kevesebb az osztónál'}?</p>`,
        valasz: { ertekek: [n] }, formatum: FMT9.egesz, tipp: r === 1 ? 'Ha 1-et kivonsz belőle, mindegyikkel osztható számot kapsz.' : 'Ha 1-et hozzáadsz, mindegyikkel osztható számot kapsz.',
        megoldas: [T`\([${oszt.join(';\\,')}]=${L}\)`, T`A keresett szám: \(${L}${r === 1 ? '+' : '-'}1=${n}\).`] }; }
    if (t === 4) { const [a, b] = kulonbozo(2, 8, 40); const k = lkkt(a, b);
      return { kerdes: T`<p>Két egymásba kapcsolódó fogaskeréken ${a}, illetve ${b} fog van. Legalább hányat kell fordulnia a ${a} fogú keréknek, hogy mindkét kerék újra a kiinduló helyzetbe kerüljön?</p>`,
        valasz: { ertekek: [k / a] }, formatum: FMT9.egesz, tipp: 'Az elforduló fogak száma mindkét kerék fogszámának többszöröse.', megoldas: [T`\([${a};\,${b}]=${k}\) fog fordul el, ez a ${a} fogú keréknek \(${k}:${a}=${k / a}\) fordulat.`] }; }
    if (t === 5) { const g = R(3, 15); const [u, v, w] = kulonbozo(3, 2, 9); if (lnkoT(u, v, w) !== 1) return this.general(); const [a, b, c] = [g * u, g * v, g * w];
      return { kerdes: T`<p>${a} alma, ${b} körte és ${c} szilva van. Legfeljebb hány egyforma csomagot készíthetünk úgy, hogy minden gyümölcs csomagba kerüljön, és minden csomagban ugyanannyi alma, körte és szilva legyen?</p>`,
        valasz: { ertekek: [g] }, formatum: FMT9.egesz, tipp: 'A csomagok számának mindhárom számnak osztójának kell lennie.', megoldas: [T`\((${a};\,${b};\,${c})=${g}\), tehát ${g} csomag (egyenként ${u} alma, ${v} körte, ${w} szilva).`] }; }
    const [a, b] = P([[20, 30], [15, 25], [12, 18], [24, 36], [30, 45], [20, 50], [16, 24]]); const k = lkkt(a, b);
    return { kerdes: T`<p>\(${a}\ \text{cm}\times ${b}\ \text{cm}\)-es téglalap alakú lapokból (elforgatás nélkül, egymás mellé rakva) négyzetet raknak ki. Legalább hány lap kell ehhez?</p>`,
      valasz: { ertekek: [(k / a) * (k / b)] }, formatum: FMT9.egesz, tipp: 'A négyzet oldala mindkét oldalhossz többszöröse – a legkisebb ilyen.',
      megoldas: [T`A négyzet oldala: \([${a};\,${b}]=${k}\) cm.`, T`Egy sorban \(${k}:${a}=${k / a}\) lap, egy oszlopban \(${k}:${b}=${k / b}\) lap: összesen \(${k / a}\cdot ${k / b}=${(k / a) * (k / b)}\).`] };
  } };

  /* ---------- törtek ---------- */
  feladatok.tortek = { nev: 'Törtek: egyszerűsítés, közös nevező', general() {
    if (R(0, 1)) { const [a, b] = par(90, 30); const g = gcd(a, b);
      return { kerdes: T`<p>Egyszerűsítsd a törtet a lehető legjobban!</p>\[\frac{${a}}{${b}}\]`, valasz: { ertekek: [a / b], forma: 'tort' }, formatum: 'tört, egyszerűsítve, pl. 3/8',
        tipp: 'A számlálót és a nevezőt a legnagyobb közös osztójukkal oszd el!', megoldas: [T`\((${a};\,${b})=${g}\)`, T`\[\frac{${a}}{${b}}=\frac{${a}:${g}}{${b}:${g}}=${ft(F(a, b))}\]`] }; }
    let [b, d] = kulonbozo(2, 6, 60); const a = R(1, b - 1), c = R(1, d - 1); if (gcd(a, b) > 1 || gcd(c, d) > 1 || gcd(b, d) === 1) return this.general();
    const N = lkkt(b, d); const s = P([1, -1]); const v = fadd(F(a, b), F(s * c, d));
    return { kerdes: T`<p>Végezd el a műveletet (közös nevező: a nevezők legkisebb közös többszöröse)!</p>\[\frac{${a}}{${b}}${s > 0 ? '+' : '-'}\frac{${c}}{${d}}\]`, valasz: { ertekek: [fv(v)], forma: 'tort' }, formatum: 'tört, egyszerűsítve, pl. 3/8',
      tipp: T`A legkisebb közös nevező \([${b};\,${d}]\).`, megoldas: [T`\([${b};\,${d}]=${N}\)`, T`\[\frac{${a * N / b}}{${N}}${s > 0 ? '+' : '-'}\frac{${c * N / d}}{${N}}=\frac{${a * N / b + s * c * N / d}}{${N}}=${ft(v)}\]`] };
  } };

  /* ---------- LNKO · LKKT = a · b ---------- */
  feladatok.osszefugges = { nev: 'LNKO · LKKT = a · b', general() {
    const [a, b] = par(30, 12); const g = gcd(a, b), k = lkkt(a, b); const t = R(0, 2);
    if (t === 0) return { kerdes: T`<p>Két pozitív egész szám szorzata ${a * b}, a legnagyobb közös osztójuk ${g}. Mennyi a legkisebb közös többszörösük?</p>`, valasz: { ertekek: [k] }, formatum: FMT9.egesz,
      tipp: T`\((a;b)\cdot[a;b]=a\cdot b\)`, megoldas: [T`\([a;b]=\frac{a\cdot b}{(a;b)}=\frac{${a * b}}{${g}}=${k}\)`] };
    if (t === 1) return { kerdes: T`<p>Két pozitív egész szám legnagyobb közös osztója ${g}, legkisebb közös többszöröse ${k}. Az egyik szám ${a}. Mennyi a másik?</p>`, valasz: { ertekek: [b] }, formatum: FMT9.egesz,
      tipp: T`\((a;b)\cdot[a;b]=a\cdot b\)`, megoldas: [T`\(b=\frac{(a;b)\cdot[a;b]}{a}=\frac{${g}\cdot ${k}}{${a}}=${b}\)`] };
    return { kerdes: T`<p>Két pozitív egész szám legnagyobb közös osztója ${g}, legkisebb közös többszöröse ${k}. Mennyi a két szám szorzata?</p>`, valasz: { ertekek: [a * b] }, formatum: FMT9.egesz,
      tipp: T`\((a;b)\cdot[a;b]=a\cdot b\)`, megoldas: [T`\(a\cdot b=${g}\cdot ${k}=${a * b}\)`] };
  } };

  /* ---------- relatív prímek (emelt) ---------- */
  feladatok.relativ = { nev: 'Relatív prímek', szint: 'emelt', general() {
    if (R(0, 1)) { let n; do { n = R(10, 64); } while (M9.prim(n)); const l = []; for (let k = 1; k < n; k++) if (gcd(k, n) === 1) l.push(k);
      return { kerdes: T`<p>Hány olyan \(k\) pozitív egész szám van, amelyre \(k<${n}\) és \((k;\,${n})=1\), vagyis \(k\) relatív prím ${az(n)} ${n} számhoz?</p>`,
        valasz: { ertekek: [l.length] }, formatum: FMT9.egesz, tipp: 'Két szám relatív prím, ha a legnagyobb közös osztójuk 1. Hagyd ki azokat, amelyeknek van közös prímtényezőjük a számmal!',
        megoldas: [T`\(${n}=${primT(n)}\); a relatív prímek: \(${l.join(',\\ ')}\).`, `Összesen ${l.length}.`] }; }
    const b = P([6, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24, 28, 30]); const k = b * P([2, 3, 5, 7]); const lst = []; for (let a = 1; a <= k; a++) if (lkkt(a, b) === k) lst.push(a);
    return { kerdes: T`<p>Mely pozitív egész \(a\) számokra igaz? Add meg mindet!</p>\[[a;\,${b}]=${k}\]`, valasz: { ertekek: lst }, formatum: FMT9.halmaz,
      tipp: T`Írd fel prímtényezős alakban mindkét ismert számot! Az \(a\) csak \(${k}\) osztója lehet, és minden olyan prímnél, ahol \(${b}\) kitevője kisebb, az \(a\)-ban kell a nagyobb kitevőnek szerepelnie.`,
      megoldas: [T`\(${b}=${primT(b)}\), \(${k}=${primT(k)}\).`, T`Megfelelő \(a\) értékek: \(${lst.join(';\\ ')}\).`] };
  } };

  Tananyag.fejezet(M9.tisztit({
    id: 'alg10',
    cim: 'Legnagyobb közös osztó, legkisebb közös többszörös',
    rovid: 'LNKO, LKKT',
    bevezeto: 'A legnagyobb közös osztó és a legkisebb közös többszörös kiszámítása prímtényezős felbontással, és alkalmazásuk szöveges feladatokban és törteknél.',
    elmelet: T`<div class="prose"><ul><li><b>Legnagyobb közös osztó</b> (jele: \((a;b)\)): a két szám közös osztói közül a legnagyobb. A <b>közös</b> prímtényezőket vesszük, a <b>legkisebb</b> előforduló kitevőn.</li>
<li><b>Legkisebb közös többszörös</b> (jele: \([a;b]\)): a két szám közös pozitív többszörösei közül a legkisebb. <b>Minden</b> előforduló prímtényezőt veszünk, a <b>legnagyobb</b> kitevőn.</li></ul></div>
<div class="mathbox">\[420=2^2\cdot3\cdot5\cdot7,\qquad 560=2^4\cdot5\cdot7\]
\[(420;560)=2^2\cdot5\cdot7=140,\qquad [420;560]=2^4\cdot3\cdot5\cdot7=1680\]</div>
<div class="prose"><ul><li>Mindig igaz: \((a;b)\cdot[a;b]=a\cdot b\).</li>
<li>Két szám <b>relatív prím</b>, ha \((a;b)=1\); ekkor \([a;b]=a\cdot b\).</li>
<li><b>Mikor melyik?</b> „Egyszerre indulnak újra”, „legkisebb négyzet” → LKKT. „Egyforma részekre vágjuk”, „legnagyobb négyzet”, „legtöbb csomag” → LNKO.</li></ul></div>`,
    igazHamis: [
      { allitas: T`\((12;18)=6\)`, igaz: true, miert: T`\(12=2^2\cdot3\), \(18=2\cdot3^2\), a közös rész \(2\cdot3=6\).` },
      { allitas: T`\([12;18]=216\)`, igaz: false, miert: T`\([12;18]=2^2\cdot3^2=36\). (A 216 a szorzatuk.)` },
      { allitas: 'Két szám legnagyobb közös osztója mindig kisebb mindkét számnál.', igaz: false, miert: 'Ha az egyik osztója a másiknak, az LNKO a kisebbik szám: (6; 12) = 6.' },
      { allitas: 'Két szám legkisebb közös többszöröse nem kisebb a legnagyobb közös osztójuknál.', igaz: true, miert: 'Az LNKO osztója mindkét számnak, ezért az LKKT-nak is.' },
      { allitas: 'Ha két szám relatív prím, akkor a legkisebb közös többszörösük a szorzatuk.', igaz: true, miert: T`\([a;b]=\frac{ab}{(a;b)}=\frac{ab}{1}\).` },
      { allitas: 'Két páros szám nem lehet relatív prím.', igaz: true, miert: 'Mindkettő osztható 2-vel.' },
      { allitas: 'Két különböző prímszám mindig relatív prím.', igaz: true, miert: 'Egyetlen közös pozitív osztójuk az 1.' },
      { allitas: T`Ha \((a;b)=6\) és \([a;b]=36\), akkor \(a\cdot b=216\).`, igaz: true, miert: T`\(6\cdot36=216\).` },
      { allitas: 'Két szomszédos egész szám mindig relatív prím.', igaz: true, miert: 'Közös osztójuk a különbségüknek, az 1-nek is osztója.' },
      { allitas: T`\((15;\,28)=1\)`, igaz: true, miert: T`\(15=3\cdot5\), \(28=2^2\cdot7\): nincs közös prímtényező.` },
      { allitas: T`Ha egy szám osztója \([a;b]\)-nek, akkor osztója \(a\)-nak és \(b\)-nek is.`, igaz: false, miert: T`Pl. \([2;3]=6\), a 6 osztója 6-nak, de 2-nek nem.` },
      { general() { const [a, b] = par(20, 10); const g = gcd(a, b); const mut = R(0, 1) ? g : g * P([2, 3]);
        return { allitas: T`\((${a};\,${b})=${mut}\)`, igaz: mut === g, miert: T`\(${a}=${primT(a)}\), \(${b}=${primT(b)}\), így \((${a};\,${b})=${g}\).` }; } }
    ],
    mintapelda: {
      feladat: 'Melyik az a legnagyobb szám, amellyel az 1848-at és a 6048-at elosztva mindkét esetben 48 a maradék?',
      lepesek: [T`A keresett szám osztója \(1848-48=1800\)-nak és \(6048-48=6000\)-nek is.`, T`\(1800=2^3\cdot3^2\cdot5^2\), \(6000=2^4\cdot3\cdot5^3\).`, T`\((1800;6000)=2^3\cdot3\cdot5^2=600\).`, T`Mivel \(600>48\), a maradék valóban 48 lehet. A keresett szám: 600.`]
    },
    feladatok
  }));
})();
