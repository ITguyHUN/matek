/*
 * 11. fejezet – Oszthatóság, prímszámok, prímtényezős felbontás
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 9. lecke: Prímszámvadászat)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { primeF, tbl } = M7;
  const G = {};
  const isPrime = n => { if (n < 2) return false; for (let p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; };
  /* prímtényezős alak hatványokkal: 360 → 2^3·3^2·5 */
  function pfTex(n) { const f = primeF(n); const m = {}; f.forEach(p => { m[p] = (m[p] || 0) + 1; }); return Object.keys(m).map(p => m[p] > 1 ? `${p}^{${m[p]}}` : p).join(T`\cdot `); }
  function pfMap(n) { const m = {}; primeF(n).forEach(p => { m[p] = (m[p] || 0) + 1; }); return m; }
  const divisors = n => { const d = []; for (let k = 1; k <= n; k++) if (n % k === 0) d.push(k); return d; };
  const SZABALY = {
    2: 'az utolsó jegye páros (0, 2, 4, 6, 8)', 5: 'az utolsó jegye 0 vagy 5', 10: 'az utolsó jegye 0',
    4: 'az utolsó két jegyéből álló szám osztható 4-gyel', 25: 'az utolsó két jegyéből álló szám osztható 25-tel (00, 25, 50, 75)', 100: 'az utolsó két jegye 0',
    8: 'az utolsó három jegyéből álló szám osztható 8-cal', 3: 'a számjegyeinek összege osztható 3-mal', 9: 'a számjegyeinek összege osztható 9-cel',
    6: 'osztható 2-vel és 3-mal is', 12: 'osztható 3-mal és 4-gyel is', 15: 'osztható 3-mal és 5-tel is', 18: 'osztható 2-vel és 9-cel is' };
  const ragV = d => ({ 2: '2-vel', 3: '3-mal', 4: '4-gyel', 5: '5-tel', 6: '6-tal', 8: '8-cal', 9: '9-cel', 10: '10-zel', 12: '12-vel', 15: '15-tel', 18: '18-cal', 25: '25-tel', 100: '100-zal' }[d]);
  const jegyOsszeg = n => String(n).split('').reduce((s, c) => s + +c, 0);
  const indok = (n, d) => {
    if ([3, 9].includes(d)) return T`A számjegyek összege \(${String(n).split('').join('+')}=${jegyOsszeg(n)}\), ez ${jegyOsszeg(n) % d ? 'nem ' : ''}osztható ${ragV(d)}.`;
    if ([4, 25].includes(d)) return T`Az utolsó két jegy: \(${n % 100}\), ez ${(n % 100) % d ? 'nem ' : ''}osztható ${ragV(d)}.`;
    if (d === 8) return T`Az utolsó három jegy: \(${n % 1000}\), ez ${(n % 1000) % 8 ? 'nem ' : ''}osztható 8-cal.`;
    if ([2, 5, 10].includes(d)) return `Az utolsó jegy ${n % 10}.`;
    if (d === 100) return `Az utolsó két jegy ${String(n % 100).padStart(2, '0')}.`;
    const [p, q] = { 6: [2, 3], 12: [4, 3], 15: [3, 5], 18: [2, 9] }[d]; return `${ragV(p)} ${n % p ? 'nem' : ''} osztható, ${ragV(q)} ${n % q ? 'nem' : ''} osztható.`.replace(/\s+/g, ' ');
  };

  G.osztheto = { name: 'Osztható-e?', make() {
    const d = P([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 25, 100]); let n = R(1000, 99999); if (R(0, 1)) n = n - n % d; if (n < 1000) n += d * 100;
    const ok = n % d === 0; const opts = ['igen', 'nem'];
    return { q: `<p>Osztható-e a(z) <b>${big(n)}</b> ${ragV(d)}?</p>`, ans: { choice: opts, correct: ok ? 0 : 1 }, ansText: opts[ok ? 0 : 1], fmt: '',
      hint: `Egy szám akkor osztható ${ragV(d)}, ha ${SZABALY[d]}.`, sol: [indok(n, d), `Tehát <b>${ok ? 'osztható' : 'nem osztható'}</b>.`] };
  } };

  G.szamjegy = { name: 'Melyik számjegy kerülhet a helyére?', make() {
    const d = P([3, 9, 4, 6, 5, 8, 12, 15, 2, 25, 18]); const len = R(4, 6); let digs, pos, ok;
    do { digs = Array.from({ length: len }, (_, i) => i === 0 ? R(1, 9) : R(0, 9)); pos = R(1, len - 1);
      ok = []; for (let c = 0; c <= 9; c++) { const x = digs.slice(); x[pos] = c; if (+x.join('') % d === 0) ok.push(c); } } while (!ok.length || ok.length === 10);
    const shown = digs.map((c, i) => i === pos ? T`\square` : c).join('');
    return { q: T`<p>Mely számjegyek írhatók a négyzet helyére, hogy a szám osztható legyen ${ragV(d)}? Add meg az összeset, pontosvesszővel elválasztva!</p>\[${shown}\]`,
      ans: { vals: ok }, ansText: ok.join('; '), fmt: 'számjegyek, pl. 2; 5; 8',
      hint: `Egy szám akkor osztható ${ragV(d)}, ha ${SZABALY[d]}. Próbáld ki sorban a 0, 1, …, 9 jegyeket!`,
      sol: [`Szabály: ${SZABALY[d]}.`, `A megfelelő számjegyek: <b>${ok.join(', ')}</b>.`, `Például: ${ok.slice(0, 2).map(c => { const x = digs.slice(); x[pos] = c; return big(+x.join('')); }).join(', ')}.`] };
  } };

  G.prim = { name: 'Prím vagy összetett?', make() {
    let n; const t = R(0, 3); if (t === 0) { do { n = R(2, 200); } while (!isPrime(n)); } else if (t === 1) n = P([0, 1, 51, 57, 87, 91, 119, 133, 143, 161, 169, 187, 209, 221, 2]); else n = R(2, 250);
    const opts = ['prímszám', 'összetett szám', 'egyik sem']; const k = n < 2 ? 2 : isPrime(n) ? 0 : 1;
    const d = k === 1 ? divisors(n).find(x => x > 1 && x < n) : null;
    return { q: `<p>Milyen szám a(z) <b>${n}</b>?</p>`, ans: { choice: opts, correct: k }, ansText: opts[k], fmt: '',
      hint: 'Prímszám: pontosan két osztója van (1 és önmaga). Elég a négyzetgyökéig keresni prímosztót. A 0 és az 1 egyik csoportba sem tartozik.',
      sol: [k === 2 ? `A(z) ${n} se nem prím, se nem összetett.` : k === 0 ? `A(z) ${n}-nek csak két osztója van: 1 és ${n}. <b>Prímszám.</b>` : T`\(${n}=${d}\cdot ${n / d}\), tehát van más osztója is: <b>összetett szám</b>.`] };
  } };

  G.felbontas = { name: 'Prímtényezős felbontás', make() {
    let n; do { n = P([2, 2, 3, 2, 5, 3, 7]) ** R(1, 4) * P([1, 3, 5, 7, 9, 11, 25, 15, 6, 10]) * P([1, 2, 3, 5, 7]); } while (n < 24 || n > 5000 || primeF(n).length < 3);
    const m = pfMap(n); const ps = Object.keys(m).map(Number); const t = R(0, 3); let q, v, fmt;
    if (t === 0) { const p = P(ps); q = `Mennyi a(z) ${p} kitevője?`; v = m[p]; fmt = 'egész szám'; }
    else if (t === 1) { q = 'Hány különböző prímtényezője van?'; v = ps.length; fmt = 'egész szám'; }
    else if (t === 2) { q = 'Mi a legnagyobb prímtényezője?'; v = Math.max(...ps); fmt = 'egész szám'; }
    else { q = 'Hány prímtényező szorzata (az ismétlődőket is számolva)?'; v = primeF(n).length; fmt = 'egész szám'; }
    return { q: `<p>Bontsd prímtényezőkre a(z) <b>${big(n)}</b> számot! ${q}</p>`, ans: { vals: [v] }, ansText: String(v), fmt,
      hint: 'Oszd a számot a legkisebb prímmel (2, 3, 5, 7, …), amíg lehet, és folytasd a hányadossal!',
      sol: [T`\(${n}=${primeF(n).join(T`\cdot `)}=${pfTex(n)}\)`, `A válasz: <b>${v}</b>.`] };
  } };

  G.szorzatbol = { name: 'Melyik szám ez?', make() {
    const ps = [2, 3, 5, 7, 11]; let n, tex; do { const k = R(2, 3); const ch = ps.slice().sort(() => Math.random() - 0.5).slice(0, k).sort((a, b) => a - b); const ex = ch.map(() => R(1, 3));
      n = ch.reduce((s, p, i) => s * p ** ex[i], 1); tex = ch.map((p, i) => ex[i] > 1 ? `${p}^{${ex[i]}}` : String(p)).join(T`\cdot `); } while (n > 3000);
    return { q: T`<p>Melyik számnak ez a prímtényezős felbontása?</p>\[${tex}\]`, ans: { vals: [n] }, ansText: String(n), fmt: 'egész szám',
      hint: 'Számold ki a hatványokat, és szorozd össze őket!', sol: [T`\(${tex}=${bigT(n)}\)`] };
  } };

  G.maradek = { name: 'Maradék fejben', make() {
    const d = P([2, 3, 4, 5, 9, 10, 25, 100]); const n = R(1000, 999999); const r = n % d;
    return { q: `<p>Mennyi maradékot ad a(z) <b>${big(n)}</b> ${{ 2: '2-vel', 3: '3-mal', 4: '4-gyel', 5: '5-tel', 9: '9-cel', 10: '10-zel', 25: '25-tel', 100: '100-zal' }[d]} osztva?</p>`, ans: { vals: [r] }, ansText: String(r), fmt: 'egész szám',
      hint: [3, 9].includes(d) ? `A szám ${d}-es maradéka ugyanannyi, mint a számjegyei összegének ${d}-es maradéka.` : [4, 25, 100].includes(d) ? 'Elég az utolsó két jegyből álló számot nézni.' : 'Elég az utolsó jegyet nézni.',
      sol: [[3, 9].includes(d) ? T`Jegyek összege: \(${jegyOsszeg(n)}\); \(${jegyOsszeg(n)}\) ${ragV(d)} osztva \(${r}\) maradékot ad.` : [4, 25, 100].includes(d) ? T`Az utolsó két jegy: \(${n % 100}\), ennek maradéka \(${r}\).` : T`Az utolsó jegy: \(${n % 10}\), maradék \(${r}\).`] };
  } };

  G.osztok = { name: 'Egy szám összes osztója', make() {
    let n; do { n = R(12, 100); } while (divisors(n).length < 4 || divisors(n).length > 12);
    const ds = divisors(n); const ask = R(0, 2);
    if (ask === 0) return { q: `<p>Add meg a(z) <b>${n}</b> összes pozitív osztóját, pontosvesszővel elválasztva!</p>`, ans: { vals: ds }, ansText: ds.join('; '), fmt: 'számok, pl. 1; 2; 4',
      hint: 'Keresd meg az osztópárokat: 1·n, 2·…, 3·…, amíg a két tényező „össze nem ér”.', sol: [`Osztópárok: ${ds.filter(x => x * x <= n).map(x => `${x}·${n / x}`).join(', ')}.`, `Az osztók: <b>${ds.join(', ')}</b> (${ds.length} darab).`] };
    if (ask === 1) return { q: `<p>Hány pozitív osztója van a(z) <b>${n}</b> számnak?</p>`, ans: { vals: [ds.length] }, ansText: String(ds.length), fmt: 'egész szám',
      hint: 'Írd fel az osztópárokat! (Ha a szám négyzetszám, az egyik pár két egyforma számból áll – azt csak egyszer számold.)', sol: [`Osztópárok: ${ds.filter(x => x * x <= n).map(x => `${x}·${n / x}`).join(', ')}.`, `Összesen <b>${ds.length}</b> osztó.`] };
    const vd = ds.filter(x => x !== 1 && x !== n);
    return { q: `<p>Mi a(z) <b>${n}</b> legnagyobb valódi osztója? (Valódi osztó: az 1-től és a számtól különböző osztó.)</p>`, ans: { vals: [Math.max(...vd)] }, ansText: String(Math.max(...vd)), fmt: 'egész szám',
      hint: 'Oszd el a számot a legkisebb (1-nél nagyobb) osztójával!', sol: [T`A legkisebb valódi osztó \(${Math.min(...vd)}\), ezért a legnagyobb \(${n}:${Math.min(...vd)}=${Math.max(...vd)}\).`] };
  } };

  G.primekKozott = { name: 'Hány prím van?', make() {
    const lo = R(1, 150), hi = lo + R(10, 40); const ps = []; for (let k = lo; k <= hi; k++) if (isPrime(k)) ps.push(k);
    return { q: `<p>Hány prímszám van ${lo} és ${hi} között (a határokat is beleértve)?</p>`, ans: { vals: [ps.length] }, ansText: String(ps.length), fmt: 'egész szám',
      hint: 'A páros számok (a 2 kivételével) és az 5-re végződők (az 5 kivételével) biztosan nem prímek. A többit vizsgáld meg 3-mal, 7-tel, 11-gyel!',
      sol: [ps.length ? `A prímek: ${ps.join(', ')}.` : 'Nincs köztük prím.', `Ez <b>${ps.length}</b> darab.`] };
  } };

  G.osztokSzama = { name: 'Osztók száma a felbontásból', szint: 'emelt', make() {
    const ps = [2, 3, 5, 7].sort(() => Math.random() - 0.5).slice(0, R(2, 3)).sort((a, b) => a - b); const ex = ps.map(() => R(1, 4));
    const tex = ps.map((p, i) => ex[i] > 1 ? `${p}^{${ex[i]}}` : String(p)).join(T`\cdot `); const v = ex.reduce((s, e) => s * (e + 1), 1);
    return { q: T`<p>Hány pozitív osztója van ennek a számnak?</p>\[${tex}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: T`Egy osztóban minden prím 0-tól a kitevőjéig bármilyen kitevővel szerepelhet. Pl. \(2^3\)-ból 4 lehetőség: \(2^0,2^1,2^2,2^3\).`,
      sol: [`Lehetőségek prímenként: ${ps.map((p, i) => `${p}: ${ex[i] + 1}`).join(', ')}.`, T`Szorzási szabály: \(${ex.map(e => e + 1).join(T`\cdot `)}=${v}\).`] };
  } };

  Tananyag.fejezet({
    id: 'oszt',
    cim: 'Oszthatóság, prímszámok, prímtényezős felbontás',
    rovid: 'Prímszámok',
    bevezeto: T`Melyik szám osztható 3-mal anélkül, hogy elosztanánk? Mi az a prímszám, és hogyan bontható fel minden szám prímek szorzatára?`,
    elmelet: T`<div class="prose"><p><b>Oszthatósági szabályok.</b> Egy természetes szám osztható</p></div>
<div class="tbl"><table><tr><th>…-vel</th><th>ha</th><th>példa</th></tr>
<tr><td>2, 5, 10</td><td>az utolsó jegye osztható vele</td><td>3740 osztható 2-vel, 5-tel, 10-zel</td></tr>
<tr><td>4, 25, 100</td><td>az utolsó két jegyéből álló szám osztható vele</td><td>5716: 16 osztható 4-gyel</td></tr>
<tr><td>8, 125</td><td>az utolsó három jegyéből álló szám osztható vele</td><td>13 128: 128 = 8 · 16</td></tr>
<tr><td>3, 9</td><td>a számjegyei összege osztható vele</td><td>4572: 4+5+7+2 = 18 → osztható 3-mal és 9-cel</td></tr>
<tr><td>6</td><td>osztható 2-vel és 3-mal is</td><td>4572</td></tr>
<tr><td>12</td><td>osztható 3-mal és 4-gyel is</td><td>5712</td></tr></table></div>
<div class="prose"><p><b>Prímszám</b> (törzsszám): pontosan két pozitív osztója van, az 1 és önmaga: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, … A 2 az egyetlen páros prím.</p>
<p><b>Összetett szám:</b> kettőnél több osztója van (4, 6, 8, 9, …). A <b>0 és az 1</b> se nem prím, se nem összetett.</p>
<p><b>A számelmélet alaptétele:</b> minden összetett szám felírható prímszámok szorzataként, és ez a felbontás – a tényezők sorrendjétől eltekintve – egyértelmű.</p></div>
<div class="mathbox">\[\begin{array}{r|l}360&2\\180&2\\90&2\\45&3\\15&3\\5&5\\1&\end{array}\qquad 360=2\cdot2\cdot2\cdot3\cdot3\cdot5=2^3\cdot3^2\cdot5\]</div>
<div class="prose"><p><b>Prím-e?</b> Elég a szám négyzetgyökéig keresni prímosztót: a 97-hez a 2, 3, 5, 7 vizsgálata elég (\(11^2=121>97\)), egyik sem osztja, tehát a 97 prím.</p></div>`,
    igazHamis: [
      { allitas: T`Az 1 prímszám.`, igaz: false, miert: T`Az 1-nek csak egy osztója van. A prímnek pontosan kettő.` },
      { allitas: T`A 2 az egyetlen páros prímszám.`, igaz: true, miert: T`Minden más páros szám osztható 2-vel is, így legalább három osztója van.` },
      { allitas: T`Ha egy szám osztható 3-mal, akkor 9-cel is.`, igaz: false, miert: T`Ellenpélda: 12 osztható 3-mal, de 9-cel nem.` },
      { allitas: T`Ha egy szám osztható 9-cel, akkor 3-mal is.`, igaz: true, miert: T`A 3 osztója a 9-nek, így minden 9-cel osztható szám 3-mal is osztható.` },
      { allitas: T`Ha egy szám osztható 2-vel és 4-gyel, akkor 8-cal is.`, igaz: false, miert: T`Ellenpélda: 12 osztható 2-vel és 4-gyel, 8-cal nem.` },
      { allitas: T`A 91 prímszám.`, igaz: false, miert: T`\(91=7\cdot13\).` },
      { allitas: T`\(2^2\cdot3\cdot5=60\)`, igaz: true, miert: T`\(4\cdot3\cdot5=60\).` },
      { allitas: T`Két prímszám összege mindig páros.`, igaz: false, miert: T`Ellenpélda: \(2+3=5\).` },
      { allitas: T`Két páratlan prímszám összege nem lehet 2007.`, igaz: true, miert: T`Két páratlan szám összege páros, a 2007 páratlan. (\(2+2005\) sem jó: \(2005=5\cdot401\).)`, szint: 'emelt' },
      { general() { const n = P([R(10, 99), 97, 89, 83, 79, 73, 71, 67, 61, 59, 53]); const p = isPrime(n); return { allitas: T`A(z) ${n} prímszám.`, igaz: p, miert: p ? T`Nincs 1-en és önmagán kívül osztója.` : T`\(${n}=${primeF(n).join(T`\cdot `)}\).` }; } },
      { general() { const d = P([3, 4, 6, 9]); const n = R(100, 9999); const ok = n % d === 0; return { allitas: T`A(z) ${big(n)} osztható ${ragV(d)}.`, igaz: ok, miert: indok(n, d) }; } }
    ],
    mintapelda: {
      feladat: T`Mely számjegyek írhatók a \(\square\) helyére, hogy a \(3\square52\) osztható legyen 12-vel?`,
      lepesek: [
        T`12-vel osztható = 3-mal és 4-gyel is osztható (mert \(12=3\cdot4\), és a 3 és a 4 relatív prímek).`,
        T`4-gyel: az utolsó két jegy, 52 osztható 4-gyel ✔ – bármilyen jegy jó lehet.`,
        T`3-mal: \(3+\square+5+2=10+\square\) osztható 3-mal → \(\square=2,\,5\) vagy \(8\).`,
        T`Tehát: <b>2, 5, 8</b> (3252, 3552, 3852 – mindegyik osztható 12-vel).`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
