/*
 * 8. fejezet – Paraméteres másodfokú egyenletek (emelt szintű tananyag)
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 6. lecke; FGY 2191–2197)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, el, tg, zj, kulonbozo, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;

  feladatok.egyenlo = { nev: 'Két egyenlő gyök', general() {
    const t = R(0, 3);
    if (t === 0) { const s = R(1, 9); const k = P([1, 1, 2, 3]); const C = k * s * s;   // k x² + a x + k s² → D = a² − 4k²s²
      return { kerdes: T`<p>Az \(a\) paraméter mely értékeire lesz az egyenletnek két egyenlő (kettős) gyöke? (Minden értéket adj meg.)</p>\[${k === 1 ? '' : k}x^2+ax+${C}=0\]`,
        valasz: { ertekek: [-2 * k * s, 2 * k * s] }, formatum: FMT10.halmaz,
        tipp: T`\(D=a^2-4\cdot ${k}\cdot ${C}=0\).`,
        megoldas: [T`\[D=a^2-${4 * k * C}=0\quad\Rightarrow\quad a=\pm${2 * k * s}\]`], _ell: w => egy(w * w - 4 * k * C, 0) }; }
    if (t === 1) { const b = R0(-11, 11); const k = P([1, 1, 2, 3, -1]); const A = F(b * b, 4 * k);
      return { kerdes: T`<p>Az \(a\) paraméter mely értékére lesz az egyenletnek két egyenlő (kettős) gyöke?</p>\[${k === 1 ? '' : k === -1 ? '-' : k}x^2${tg(b)}+a=0\]`,
        valasz: { ertekek: [fv(A)] }, formatum: FMT10.tort,
        tipp: T`\(D=${b * b}${el(-4 * k)}a=0\).`, megoldas: [T`\[D=${zj(b)}^2-4\cdot ${zj(k)}\cdot a=${b * b}${el(-4 * k)}a=0\quad\Rightarrow\quad a=${ft(A)}\]`],
        _ell: w => egy(b * b - 4 * k * w, 0) }; }
    if (t === 2) { const m = R(1, 5); const r = R(-4, 4);   // x² − a x + (r a + m² … ) – lásd lent: D = a² − 4(ra + c) = (a − a1)(a − a2)
      const [a1, a2] = [2 * r + 2 * m, 2 * r - 2 * m]; const c = -(a1 * a2) / 4;   // a1 + a2 = 4r, a1·a2 = −4c
      return { kerdes: T`<p>Az \(a\) paraméter mely értékeire lesz az egyenletnek két egyenlő (kettős) gyöke? (Minden értéket adj meg.)</p>\[x^2-ax${r === 0 ? '' : tg(r, 'a')}${el(c)}=0\]`,
        valasz: { ertekek: [a2, a1] }, formatum: FMT10.halmaz,
        tipp: T`\(D=a^2-4\left(${l1(r, c, 'a')}\right)\). Oldd meg a \(D=0\) egyenletet \(a\)-ra!`,
        megoldas: [T`\[D=a^2${tg(-4 * r, 'a')}${el(-4 * c)}=0\]`, T`\[a_1=${a1},\qquad a_2=${a2}\]`], _ell: w => egy(w * w - 4 * (r * w + c), 0) }; }
    // (a − k) x² + b x + c: D = b² − 4(a − k)c = 0
    const k = R(-4, 4), b = R0(-8, 8), c = R0(-5, 5); const A = F(b * b + 4 * k * c, 4 * c);
    if (fv(A) === k) return feladatok.egyenlo.general();
    const fo = k === 0 ? 'a' : T`(a${el(-k)})`;
    return { kerdes: T`<p>Az \(a\) paraméter mely értékére lesz az egyenletnek két egyenlő (kettős) gyöke?</p>\[${fo}x^2${tg(b)}${el(c)}=0\]`,
      valasz: { ertekek: [fv(A)] }, formatum: FMT10.tort,
      tipp: T`Kettős gyök csak másodfokú egyenletnek lehet, ezért \(a\neq${k}\). \(D=${b * b}-4\cdot ${fo}\cdot ${zj(c)}=0\).`,
      megoldas: [T`\[D=${b * b}-4\cdot ${zj(c)}\cdot ${fo}=0\quad\Rightarrow\quad a=${ft(A)}\]`, T`Ez valóban nem ${k}, tehát másodfokú az egyenlet.`], _ell: w => egy(b * b - 4 * (w - k) * c, 0) };
  } };

  feladatok.nincsgyok = { nev: 'Mikor nincs valós gyök?', general() {
    const t = R(0, 2);
    if (t === 2) { const b = R0(-12, 12), c = R(1, 9); const h = F(b * b, 4 * c); const ans = Math.floor(fv(h)) + 1;
      return { kerdes: T`<p>Melyik az a legkisebb egész \(a\), amelyre az egyenletnek <b>nincs</b> valós megoldása?</p>\[ax^2${tg(b)}+${c}=0\]`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
        tipp: T`\(a=0\) esetén elsőfokú az egyenlet, annak van megoldása. \(a\neq0\): \(D=${b * b}-${4 * c}a<0\).`,
        megoldas: [T`\[D=${b * b}-${4 * c}a<0\iff a>${ft(h)}\]`, T`A legkisebb ilyen egész: \(${ans}\).`],
        _ell: w => b * b - 4 * c * w < 0 && b * b - 4 * c * (w - 1) >= 0 }; }
    if (t === 0) { const k = R0(-6, 8); const h = 4 * k; const [lo, hi] = h > 0 ? [0, h] : [h, 0]; const kerd = R(0, 1);
      return { kerdes: kerd ? T`<p>Hány egész \(a\) esetén <b>nincs</b> valós megoldása az egyenletnek?</p>\[x^2-ax${tg(k, 'a')}=0\]` : T`<p>Az egyenletnek akkor nincs valós megoldása, ha \(a\) egy nyílt intervallumba esik. Add meg az intervallum két végpontját!</p>\[x^2-ax${tg(k, 'a')}=0\]`,
        valasz: { ertekek: kerd ? [hi - lo - 1] : [lo, hi] }, formatum: kerd ? FMT10.egesz : FMT10.halmaz,
        tipp: T`\(D=a^2${tg(-4 * k, 'a')}<0\). Ez egy \(a\)-ban másodfokú egyenlőtlenség!`,
        megoldas: [T`\[D=a^2${tg(-4 * k, 'a')}=a\left(a${el(-4 * k)}\right)<0\quad\iff\quad ${lo}<a<${hi}\]`, kerd ? T`Ebben \(${hi - lo - 1}\) egész szám van.` : ''].filter(Boolean) }; }
    const s = R(1, 12); const C = s * s;   // x² + a x + s² → |a| < 2s
    const kerd = R(0, 1);
    return { kerdes: kerd ? T`<p>Hány egész \(a\) esetén <b>nincs</b> valós megoldása az egyenletnek?</p>\[x^2+ax+${C}=0\]` : T`<p>Mi az a legnagyobb egész \(a\), amelyre az egyenletnek <b>nincs</b> valós megoldása?</p>\[x^2+ax+${C}=0\]`,
      valasz: { ertekek: [kerd ? 4 * s - 1 : 2 * s - 1] }, formatum: FMT10.egesz,
      tipp: T`\(D=a^2-${4 * C}<0\iff a^2<${4 * C}\).`,
      megoldas: [T`\[a^2<${4 * C}\iff -${2 * s}<a<${2 * s}\]`, kerd ? T`Egész értékek: \(-${2 * s - 1},\dots,${2 * s - 1}\), összesen ${4 * s - 1}.` : T`A legnagyobb egész: \(${2 * s - 1}\).`] };
  } };

  feladatok.mindenx = { nev: 'Minden x-re pozitív kifejezés', general() {
    // x² − 2b x + (p b + q) > 0 ∀x ⇔ b² − p b − q < 0 ⇔ b1 < b < b2
    const [b1, b2] = kulonbozo(2, -6, 8).sort((x, y) => x - y); const p = b1 + b2, q = -b1 * b2;
    const kerd = R(0, 1);
    const kif = T`x^2-2bx${p === 0 ? '' : tg(p, 'b')}${el(q)}`;
    return { kerdes: kerd ? T`<p>Hány egész \(b\) esetén lesz a kifejezés értéke <b>minden</b> valós \(x\)-re pozitív?</p>\[${kif}\]` : T`<p>Mely \(b\) értékek esetén lesz a kifejezés értéke minden valós \(x\)-re pozitív? A megoldás egy nyílt intervallum: add meg a végpontjait!</p>\[${kif}\]`,
      valasz: { ertekek: kerd ? [b2 - b1 - 1] : [b1, b2] }, formatum: kerd ? FMT10.egesz : FMT10.halmaz,
      tipp: T`Felfelé nyitott parabola akkor pozitív mindenhol, ha nincs zérushelye: \(D<0\). Számold ki \(D\)-t \(b\)-vel!`,
      megoldas: [T`\[D=4b^2-4\left(${p === 0 ? '' : l1(p, 0, 'b')}${el(q)}\right)=4\left(${q2(1, -p, -q, 'b')}\right)<0\]`, T`\[${q2(1, -p, -q, 'b')}<0\iff ${b1}<b<${b2}\]`, kerd ? T`Egész értékek száma: \(${b2 - b1 - 1}\).` : ''].filter(Boolean) };
  } };

  feladatok.megold = { nev: 'Megoldás a paraméterrel', general() {
    // (p x − q b)(r x − s b) = 0, adott b-re
    let p, q, r, s; do { p = P([1, 1, 2, 3]); r = P([1, 2]); q = R0(-5, 5); s = R0(-5, 5); } while (q * r === s * p);
    const A = p * r, B = -(p * s + q * r), C = q * s; const b = R0(-6, 6);
    const kif = T`${A === 1 ? '' : A}x^2${B === 0 ? '' : (B > 0 ? '+' : '-') + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'bx'}${C > 0 ? '+' : '-'}${Math.abs(C) === 1 ? '' : Math.abs(C)}b^2`;
    const x1 = F(q * b, p), x2 = F(s * b, r);
    return { kerdes: T`<p>Oldd meg az egyenletet a \(b\) paraméterrel kifejezve, majd add meg a gyököket \(b=${b}\) esetén! (Pontosvesszővel válaszd el őket.)</p>\[${kif}=0\]`,
      valasz: { ertekek: [fv(x1), fv(x2)].sort((u, v) => u - v) }, formatum: FMT10.halmaz,
      tipp: T`Használd a megoldóképletet úgy, hogy \(b\)-t számként kezeled! A diszkrimináns \(b^2\) egy négyzetszám-szorosa lesz, így a gyök alól kijön.`,
      megoldas: [T`\[D=${B * B - 4 * A * C}b^2\quad\Rightarrow\quad \sqrt{D}=${Math.round(Math.sqrt(B * B - 4 * A * C))}|b|\]`, T`\[x_1=${ft(F(q, p))}b,\qquad x_2=${ft(F(s, r))}b\]`, T`\(b=${b}\) esetén: \(x_1=${ft(x1)}\), \(x_2=${ft(x2)}\).`],
      _ell: w => egy(A * w * w + B * b * w + C * b * b, 0) };
  } };

  feladatok.elojel = { nev: 'A gyökök előjele', general() {
    const p = R(2, 12); const t = R(0, 2);
    if (t < 2) {   // x² ∓ p x + c = 0, két különböző pozitív (negatív) gyök ⇔ 0 < c < p²/4
      const neg = t === 1; const h = F(p * p, 4); const db = Math.ceil(fv(h)) - 1;
      return { kerdes: T`<p>Hány egész \(c\) esetén lesz az egyenletnek két különböző <b>${neg ? 'negatív' : 'pozitív'}</b> gyöke?</p>\[x^2${neg ? '+' : '-'}${p}x+c=0\]`,
        valasz: { ertekek: [db] }, formatum: FMT10.egesz,
        tipp: T`Két különböző valós gyök: \(D>0\). Viète: a gyökök összege \(${neg ? -p : p}\), szorzata \(c\). Két ${neg ? 'negatív' : 'pozitív'} szám szorzata pozitív, összege ${neg ? 'negatív' : 'pozitív'}.`,
        megoldas: [T`\(D=${p * p}-4c>0\iff c<${ft(h)}\).`, T`A gyökök szorzata \(c>0\), összegük \(${neg ? -p : p}\) – ez rendben van.`, T`\(0<c<${ft(h)}\): ${db} egész érték.`] };
    }
    // ellentétes előjelű gyökök: a·c < 0 ⇔ … (a + k) együtthatóval
    const k = R(-6, 6), c = R0(-9, 9);
    // (a + k) x² + b x + c: ellentétes előjelű gyökök ⇔ (a + k)·c < 0
    const b = R(-5, 5); const hat = -k;
    return { kerdes: T`<p>Az \(a\) paraméter mely értékeire lesz az egyenletnek két ellentétes előjelű gyöke? A megoldás \(a${c > 0 ? '<' : '>'}\square\) alakú. Mi kerül a négyzet helyére?</p>\[\left(a${el(k)}\right)x^2${tg(b)}${el(c)}=0\]`,
      valasz: { ertekek: [hat] }, formatum: FMT10.egesz,
      tipp: T`Viète: a gyökök szorzata \(\frac{c}{a${el(k)}}\). Ellentétes előjelű gyököknél ez negatív (ilyenkor \(D>0\) is automatikusan teljesül).`,
      megoldas: [T`\[x_1x_2=\frac{${c}}{a${el(k)}}<0\quad\iff\quad a${el(k)}${c > 0 ? '<' : '>'}0\quad\iff\quad a${c > 0 ? '<' : '>'}${hat}\]`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mparam',
    cim: 'Paraméteres másodfokú egyenletek',
    rovid: 'Paraméteres egyenletek',
    szint: 'emelt',
    bevezeto: T`A paraméter egy betűvel jelölt, rögzítettnek tekintett szám. A kérdés általában az, hogy a paraméter mely értékeire lesz a megoldásoknak valamilyen tulajdonsága.`,
    elmelet: T`<div class="tbl"><table><tr><th>Feltétel</th><th>Matematikai alak</th></tr>
<tr><td>két különböző valós gyök</td><td>\(a\neq0\) és \(D>0\)</td></tr>
<tr><td>két egyenlő (kettős) gyök</td><td>\(a\neq0\) és \(D=0\)</td></tr>
<tr><td>nincs valós gyök</td><td>\(a\neq0\) és \(D<0\) (vagy \(a=0\) és az elsőfokú egyenletnek sincs megoldása)</td></tr>
<tr><td>\(ax^2+bx+c>0\) minden \(x\)-re</td><td>\(a>0\) és \(D<0\)</td></tr>
<tr><td>\(ax^2+bx+c<0\) minden \(x\)-re</td><td>\(a<0\) és \(D<0\)</td></tr>
<tr><td>két pozitív gyök</td><td>\(D>0\), \(x_1x_2=\frac ca>0\), \(x_1+x_2=-\frac ba>0\)</td></tr>
<tr><td>ellentétes előjelű gyökök</td><td>\(\frac ca<0\)</td></tr></table></div>
<div class="prose"><ul>
<li>Ha a paraméter a főegyütthatóban van, az \(a=0\) esetet külön kell vizsgálni.</li>
<li>A \(D\)-re kapott feltétel sokszor maga is egy másodfokú egyenlőtlenség – a paraméterre.</li></ul></div>`,
    igazHamis: [
      { allitas: T`Az \(x^2-ax+4=0\) egyenletnek \(a=4\) és \(a=-4\) esetén van kettős gyöke.`, igaz: true, miert: T`\(D=a^2-16=0\iff a=\pm4\).` },
      { allitas: T`Ha \(c<0\), akkor az \(x^2+bx+c=0\) egyenlet gyökei ellentétes előjelűek.`, igaz: true, miert: T`\(x_1x_2=c<0\), és ilyenkor \(D=b^2-4c>0\).` },
      { allitas: T`Az \(ax^2+2x+1=0\) egyenletnek \(a=1\) esetén két különböző gyöke van.`, igaz: false, miert: T`\(D=4-4a=0\): kettős gyök (\(x=-1\)).` },
      { allitas: T`Az \(x^2+mx+9>0\) egyenlőtlenség minden \(x\)-re teljesül, ha \(-6<m<6\).`, igaz: true, miert: T`\(D=m^2-36<0\iff -6<m<6\).` },
      { allitas: T`Ha \(D>0\) és \(\frac{c}{a}>0\), akkor mindkét gyök pozitív.`, igaz: false, miert: T`Mindkettő negatív is lehet: azt a gyökök összegének előjele dönti el.` }
    ],
    mintapelda: {
      feladat: T`Mely \(m\) esetén lesz az \(mx^2+(m-1)x+1\) kifejezés értéke minden valós \(x\)-re negatív?`,
      lepesek: [
        T`\(m=0\): \(-x+1\), ez nem negatív minden \(x\)-re. Tehát \(m\neq0\).`,
        T`Lefelé nyitott parabola kell: \(m<0\), és ne legyen zérushely: \(D=(m-1)^2-4m<0\).`,
        T`\(m^2-6m+1<0\iff 3-2\sqrt2<m<3+2\sqrt2\) – ezek pozitív számok.`,
        T`Az \(m<0\) feltétellel nincs közös rész: nincs ilyen \(m\).`
      ]
    },
    feladatok
  }));
})();
