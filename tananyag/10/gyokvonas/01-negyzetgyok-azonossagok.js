/*
 * A gyökvonás / 2. fejezet – A négyzetgyök és azonosságai
 * Témakör: A gyökvonás (Sokszínű matematika 10., 2. fejezet; vizsgatematika 1. témakör; TK 41/1–4, 47/1–5; FGY 2100–2111)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, gy, gyokEgysz, l1, el, zj, az, keverd, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;
  const NEM_NEGYZET = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

  feladatok.ertek = { nev: 'Négyzetgyök kiszámítása', general() {
    const t = R(0, 4); let tex, ans, mo;
    if (t === 0) { const a = R(2, 12), b = R(2, 12); tex = T`\sqrt{${a * a}\cdot ${b * b}}`; ans = a * b; mo = T`\(\sqrt{${a * a}}\cdot\sqrt{${b * b}}=${a}\cdot ${b}=${a * b}\)`; }
    else if (t === 1) { const a = R(1, 12); let b; do { b = R(2, 15); } while (gcd(a, b) !== 1); tex = T`\sqrt{\frac{${a * a}}{${b * b}}}`; ans = a / b; mo = T`\(\frac{\sqrt{${a * a}}}{\sqrt{${b * b}}}=\frac{${a}}{${b}}\)`; }
    else if (t === 2) { const a = R(1, 15), k = P([1, 2]); const v = a / 10 ** k; tex = T`\sqrt{${nt((a * a) / 10 ** (2 * k))}}`; ans = v; mo = T`\(${nt(v)}^2=${nt((a * a) / 10 ** (2 * k))}\), tehát a gyök \(${nt(v)}\).`; }
    else if (t === 3) { const b = P([2, 3, 5]), n = P([2, 4, 6]); tex = T`\sqrt{${b}^{${n}}}`; ans = b ** (n / 2); mo = T`\(\sqrt{${b}^{${n}}}=${b}^{${n / 2}}=${ans}\), mert \(\left(${b}^{${n / 2}}\right)^2=${b}^{${n}}\).`; }
    else { const a = R0(-15, 15); tex = T`\sqrt{${zj(a)}^2}`; ans = Math.abs(a); mo = T`\(\sqrt{a^2}=|a|\), tehát \(\sqrt{${zj(a)}^2}=|${a}|=${ans}\).`; }
    return { kerdes: T`<p>Számítsd ki számológép nélkül!</p>\[${tex}\]`, valasz: { ertekek: [ans] }, formatum: FMT10.szam + ' (egész, tört vagy tizedes tört)',
      tipp: T`Egy nemnegatív szám négyzetgyöke az a <b>nemnegatív</b> szám, amelynek a négyzete az adott szám. \(\sqrt{ab}=\sqrt a\sqrt b\), \(\sqrt{\frac ab}=\frac{\sqrt a}{\sqrt b}\), \(\sqrt{a^2}=|a|\).`,
      megoldas: [mo], _ell: w => w >= 0 && egy(w * w, ans * ans) };
  } };

  feladatok.azonossag = { nev: 'Szorzat, hányados, hatvány', general() {
    const t = R(0, 3); let tex, ans, mo;
    if (t === 0) { const m = P(NEM_NEGYZET), p = R(1, 6), q = R(1, 6); const a = m * p * p, b = m * q * q; tex = T`\sqrt{${a}}\cdot\sqrt{${b}}`; ans = m * p * q; mo = T`\(\sqrt{${a}\cdot ${b}}=\sqrt{${a * b}}=${ans}\)`; }
    else if (t === 1) { const m = P(NEM_NEGYZET), k = R(2, 9); const a = m * k * k; tex = R(0, 1) ? T`\frac{\sqrt{${a}}}{\sqrt{${m}}}` : T`\sqrt{${a}}:\sqrt{${m}}`; ans = k; mo = T`\(\sqrt{\frac{${a}}{${m}}}=\sqrt{${k * k}}=${k}\)`; }
    else if (t === 2) { const m = P(NEM_NEGYZET), n = P([2, 4, 6]); const c = R(1, 3); tex = T`${c === 1 ? '' : c}\left(\sqrt{${m}}\right)^{${n}}`; ans = c * m ** (n / 2); mo = T`\(\left(\sqrt{${m}}\right)^{${n}}=${m}^{${n / 2}}\), így az érték \(${ans}\).`; }
    else { const m = P(NEM_NEGYZET); const [p, q] = M10.kulonbozo(2, 1, 5); tex = T`\sqrt{${m * p}}\cdot\sqrt{${m * q}}\cdot\sqrt{${p * q}}`; ans = m * p * q; mo = T`\(\sqrt{${m * p}\cdot ${m * q}\cdot ${p * q}}=\sqrt{${(m * p * q) ** 2}}=${ans}\)`; }
    return { kerdes: T`<p>Számítsd ki az azonosságok segítségével!</p>\[${tex}\]`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`\(\sqrt a\cdot\sqrt b=\sqrt{ab}\); \(\frac{\sqrt a}{\sqrt b}=\sqrt{\frac ab}\); \(\left(\sqrt a\right)^k=\sqrt{a^k}\) (\(a,b\ge0\)).`, megoldas: [mo] };
  } };

  feladatok.kiemeles = { nev: 'Kiemelés a gyökjel alól', general() {
    const m = P(NEM_NEGYZET), k = R(2, 12); const n = k * k * m; const c = R(0, 3) === 0 ? R(2, 4) : 1;
    return { kerdes: T`<p>Hozd egyszerűbb alakra! Mi kerül a négyzet helyére?</p>\[${c === 1 ? '' : c}\sqrt{${n}}=\square\sqrt{${m}}\]`,
      valasz: { ertekek: [c * k] }, formatum: FMT10.egesz,
      tipp: T`Bontsd a gyökjel alatti számot egy négyzetszám és egy másik szám szorzatára: \(${n}=${k * k}\cdot${m}\).`,
      megoldas: [T`\[${c === 1 ? '' : c}\sqrt{${n}}=${c === 1 ? '' : c}\sqrt{${k * k}\cdot ${m}}=${c === 1 ? '' : c + T`\cdot `}${k}\sqrt{${m}}=${c * k}\sqrt{${m}}\]`] };
  } };

  feladatok.bevitel = { nev: 'Bevitel a gyökjel alá', general() {
    const t = R(0, 2);
    if (t < 2) { const m = P(NEM_NEGYZET), k = R(2, 10);
      return { kerdes: T`<p>Vidd be a tényezőt a gyökjel alá! Mi kerül a négyzet helyére?</p>\[${k}\sqrt{${m}}=\sqrt{\square}\]`,
        valasz: { ertekek: [k * k * m] }, formatum: FMT10.egesz, tipp: T`\(k\sqrt m=\sqrt{k^2m}\), ha \(k\ge0\).`,
        megoldas: [T`\[${k}\sqrt{${m}}=\sqrt{${k}^2\cdot ${m}}=\sqrt{${k * k * m}}\]`] }; }
    const m = P(NEM_NEGYZET), k = R(2, 6); let d; do { d = R(2, 6); } while (gcd(k, d) !== 1 && R(0, 1));
    const v = F(k * k * m, d * d);
    return { kerdes: T`<p>Vidd be a tényezőt a gyökjel alá! Mi kerül a négyzet helyére? (Tört is lehet.)</p>\[\frac{${k}}{${d}}\sqrt{${m}}=\sqrt{\square}\]`,
      valasz: { ertekek: [fv(v)] }, formatum: FMT10.tort, tipp: T`\(\frac{k}{d}\sqrt m=\sqrt{\frac{k^2m}{d^2}}\).`,
      megoldas: [T`\[\frac{${k}}{${d}}\sqrt{${m}}=\sqrt{\frac{${k * k}\cdot ${m}}{${d * d}}}=\sqrt{${ft(v)}}\]`] };
  } };

  feladatok.ertelmezes = { nev: 'Értelmezési tartomány', general() {
    const t = R(0, 2);
    if (t < 2) { const a = R0(-6, 6), b = R(-12, 12); const h = F(-b, a); const pozA = a > 0;
      return { kerdes: T`<p>Mely valós \(x\) értékekre értelmezhető a kifejezés? Az értelmezési tartomány \(x${pozA ? T`\ge ` : T`\le `}\square\) alakú. Mi kerül a négyzet helyére?</p>\[\sqrt{${l1(a, b)}}\]`,
        valasz: { ertekek: [fv(h)] }, formatum: FMT10.tort, tipp: 'A négyzetgyök alatt nem állhat negatív szám.',
        megoldas: [T`\[${l1(a, b)}\ge0\quad\iff\quad x${pozA ? T`\ge ` : T`\le `}${ft(h)}\]`, pozA ? '' : 'Negatív számmal osztva az egyenlőtlenség iránya megfordul.'].filter(Boolean),
        _ell: w => egy(a * w + b, 0) }; }
    // √(x−p)·√(x−q)  vs  √((x−p)(x−q)): hány egész szám nincs az értelmezési tartományban a [p−5; q+5]-ből? → helyette: legkisebb egész
    const [p, q] = M10.kulonbozo(2, -8, 8).sort((u, v) => u - v);
    const kulon = R(0, 1) === 1;
    const kif = kulon ? T`\sqrt{${l1(1, -p)}}\cdot\sqrt{${l1(1, -q)}}` : T`\sqrt{(${l1(1, -p)})(${l1(1, -q)})}`;
    const L = p - R(0, 4), U = q + R(0, 4);
    const benne = []; for (let n = L; n <= U; n++) if (kulon ? n >= q : (n <= p || n >= q)) benne.push(n);
    return { kerdes: T`<p>A \([${L};\,${U}]\) intervallum egész számai közül hány tartozik a kifejezés értelmezési tartományába?</p>\[${kif}\]`,
      valasz: { ertekek: [benne.length] }, formatum: FMT10.egesz,
      tipp: kulon ? T`Mindkét gyök alatt nemnegatív számnak kell állnia: \(x\ge${p}\) <b>és</b> \(x\ge${q}\).` : T`Itt egyetlen gyök van: a szorzat legyen nemnegatív. Ez akkor teljesül, ha a két tényező azonos előjelű (vagy valamelyik 0).`,
      megoldas: [kulon ? T`Értelmezési tartomány: \(x\ge${q}\).` : T`Értelmezési tartomány: \(x\le${p}\) vagy \(x\ge${q}\).`, T`A \([${L};\,${U}]\) egészei közül ezek: \(${benne.join(';\\ ')}\), összesen ${benne.length}.`] };
  } };

  feladatok.hasonlit = { nev: 'Melyik a nagyobb?', general() {
    let a, m, b, n; do { a = R(2, 9); m = P(NEM_NEGYZET); b = R(2, 9); n = P(NEM_NEGYZET); } while (a === b && m === n || R(0, 4) > 0 && a * a * m === b * b * n);
    const A = a * a * m, B = b * b * n; const c = A < B ? 0 : A === B ? 1 : 2; const s = ['<', '=', '>'];
    return { kerdes: T`<p>Melyik reláció kerül a négyzet helyére? (Számológép nélkül döntsd el!)</p>\[${a}\sqrt{${m}}\;\square\;${b}\sqrt{${n}}\]`,
      valasz: { valasztas: s, helyes: c }, tipp: T`Vidd be a tényezőt a gyökjel alá mindkét oldalon, és hasonlítsd össze a gyök alatti számokat!`,
      megoldas: [T`\(${a}\sqrt{${m}}=\sqrt{${A}}\), \(${b}\sqrt{${n}}=\sqrt{${B}}\).`, T`\(${A}${s[c]}${B}\), ezért \(${a}\sqrt{${m}}${s[c]}${b}\sqrt{${n}}\).`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'vgy1',
    cim: 'A négyzetgyök és azonosságai',
    rovid: 'Négyzetgyök-azonosságok',
    bevezeto: T`A négyzetgyök fogalma és azonosságai: kiemelés, bevitel, értelmezési tartomány, összehasonlítás.`,
    elmelet: T`<div class="prose"><p>Egy nemnegatív \(a\) szám <b>négyzetgyöke</b> az a nemnegatív szám, amelynek négyzete \(a\): \(\sqrt a\ge0\) és \(\left(\sqrt a\right)^2=a\).</p></div>
<div class="tbl"><table><tr><th>Azonosság</th><th>Feltétel</th><th>Példa</th></tr>
<tr><td>\(\sqrt{ab}=\sqrt a\cdot\sqrt b\)</td><td>\(a,b\ge0\)</td><td>\(\sqrt{72}=\sqrt{36}\cdot\sqrt2=6\sqrt2\)</td></tr>
<tr><td>\(\sqrt{\frac ab}=\frac{\sqrt a}{\sqrt b}\)</td><td>\(a\ge0,\ b>0\)</td><td>\(\sqrt{\frac{9}{25}}=\frac35\)</td></tr>
<tr><td>\(\left(\sqrt a\right)^k=\sqrt{a^k}\)</td><td>\(a\ge0\)</td><td>\(\left(\sqrt3\right)^4=9\)</td></tr>
<tr><td>\(\sqrt{a^2}=|a|\)</td><td>minden valós \(a\)</td><td>\(\sqrt{(-5)^2}=5\)</td></tr></table></div>
<div class="prose"><ul>
<li><b>Kiemelés:</b> \(\sqrt{50}=\sqrt{25\cdot2}=5\sqrt2\). <b>Bevitel:</b> \(3\sqrt5=\sqrt{9\cdot5}=\sqrt{45}\).</li>
<li><b>Összehasonlítás:</b> vidd be a tényezőket a gyökjel alá: \(5\sqrt3=\sqrt{75}>\sqrt{72}=6\sqrt2\).</li>
<li><b>Értelmezés:</b> \(\sqrt{f(x)}\) ott értelmezett, ahol \(f(x)\ge0\).</li>
<li>Összegre <b>nincs</b> azonosság: \(\sqrt{9+16}=5\neq\sqrt9+\sqrt{16}=7\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(\sqrt{16}=\pm4\)`, igaz: false, miert: T`A négyzetgyök definíció szerint nemnegatív: \(\sqrt{16}=4\).` },
      { allitas: T`\(\sqrt{(-7)^2}=-7\)`, igaz: false, miert: T`\(\sqrt{(-7)^2}=\sqrt{49}=7=|-7|\).` },
      { allitas: T`\(\sqrt{9+16}=\sqrt9+\sqrt{16}\)`, igaz: false, miert: T`\(\sqrt{25}=5\), de \(3+4=7\). Összegre nincs ilyen azonosság.` },
      { allitas: T`\(\sqrt{72}=6\sqrt2\)`, igaz: true, miert: T`\(72=36\cdot2\).` },
      { allitas: T`\(3\sqrt5=\sqrt{15}\)`, igaz: false, miert: T`\(3\sqrt5=\sqrt{9\cdot5}=\sqrt{45}\).` },
      { allitas: T`\(\sqrt{x^2}=x\) minden valós \(x\)-re.`, igaz: false, miert: T`Negatív \(x\)-re hamis: \(\sqrt{x^2}=|x|\).` },
      { allitas: T`\(\sqrt{0{,}04}=0{,}2\)`, igaz: true, miert: T`\(0{,}2^2=0{,}04\).` },
      { allitas: T`A \(\sqrt{x-3}\) kifejezés \(x=2\)-re is értelmezett.`, igaz: false, miert: T`\(x-3=-1<0\).` },
      { general() { const m = P(NEM_NEGYZET), k = R(2, 9); const jo = R(0, 1) === 1; const kk = jo ? k : k + P([-1, 1]);
        return { allitas: T`\(\sqrt{${k * k * m}}=${kk}\sqrt{${m}}\)`, igaz: kk === k, miert: T`\(${k * k * m}=${k * k}\cdot${m}\), így \(\sqrt{${k * k * m}}=${k}\sqrt{${m}}\).` }; } },
      { general() { const m = P(NEM_NEGYZET), k = R(2, 8); const jo = R(0, 1) === 1;
        return { allitas: T`\(${k}\sqrt{${m}}=\sqrt{${jo ? k * k * m : k * m}}\)`, igaz: jo || k * m === k * k * m, miert: T`\(${k}\sqrt{${m}}=\sqrt{${k}^2\cdot${m}}=\sqrt{${k * k * m}}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Melyik a nagyobb: \(5\sqrt3\) vagy \(3\sqrt5\)?`,
      lepesek: [T`Vigyük be a tényezőket a gyökjel alá: \(5\sqrt3=\sqrt{25\cdot3}=\sqrt{75}\).`, T`\(3\sqrt5=\sqrt{9\cdot5}=\sqrt{45}\).`, T`Mivel \(75>45\), és a nagyobb számnak nagyobb a négyzetgyöke: \(5\sqrt3>3\sqrt5\).`]
    },
    feladatok
  }));
})();
