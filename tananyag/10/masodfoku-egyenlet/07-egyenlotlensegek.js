/*
 * 7. fejezet – Másodfokú egyenlőtlenségek
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 5. lecke; FGY 2184–2190; OH 22–23.)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, el, zj, kulonbozo, keverd, egyutthatok, tortGyok, frSz, FMT10 } = M10;
  const feladatok = {};
  const REL = { lt: '<', gt: '>', le: T`\le `, ge: T`\ge ` };
  const RELsz = { lt: '<', gt: '>', le: '≤', ge: '≥' };
  const fs = f => frSz(f.n, f.d);           // szám szövegesen (−, tört: 3/2)
  /* véletlen egyenlőtlenség: a(x−r1)(x−r2) REL 0, néha átrendezve; → objektum */
  function egyenlotlenseg(opt = {}) {
    const r1 = opt.tort && R(0, 2) === 0 ? tortGyok(3) : F(R(-8, 8), 1); let r2; do { r2 = opt.tort && R(0, 3) === 0 ? tortGyok(3) : F(R(-8, 8), 1); } while (fv(r2) === fv(r1));
    const [lo, hi] = fv(r1) < fv(r2) ? [r1, r2] : [r2, r1];
    const s = R(0, 3) === 0 ? -1 : 1;
    const [a, b, c] = egyutthatok(lo, hi, s);
    const rel = P(['lt', 'gt', 'le', 'ge']);
    let tex;
    const at = R(0, 3);
    if (at === 0) { const p = R0(-5, 5), q = R(-8, 8); tex = T`${q2(a, b + p, c + q)}${REL[rel]}${l1(p, q)}`; }
    else if (at === 1 && c !== 0) tex = T`${q2(a, b, 0)}${REL[rel]}${-c}`;
    else tex = T`${q2(a, b, c)}${REL[rel]}0`;
    // kozott: a megoldás a két gyök között van?
    const negativ = rel === 'lt' || rel === 'le';
    const kozott = (a > 0) === negativ; const zart = rel === 'le' || rel === 'ge';
    return { a, b, c, lo, hi, rel, tex, kozott, zart, f: x => a * x * x + b * x + c };
  }
  const igaz = (E, x) => { const y = E.f(x); return E.rel === 'lt' ? y < -1e-12 : E.rel === 'gt' ? y > 1e-12 : E.rel === 'le' ? y <= 1e-12 : y >= -1e-12; };
  function halmazSz(lo, hi, kozott, zart) {
    const k = zart ? '≤' : '<', n = zart ? '≥' : '>';
    return kozott ? `${fs(lo)} ${k} x ${k} ${fs(hi)}` : `x ${k} ${fs(lo)} vagy x ${n} ${fs(hi)}`;
  }
  function halmazT(lo, hi, kozott, zart) {
    const k = zart ? T`\le ` : '<', n = zart ? T`\ge ` : '>';
    return kozott ? T`${ft(lo)}${k} x${k} ${ft(hi)}` : T`x${k} ${ft(lo)}\ \text{vagy}\ x${n} ${ft(hi)}`;
  }
  const megold = E => [T`Rendezve: \(${q2(E.a, E.b, E.c)}${REL[E.rel]}0\).`, T`A gyökök: \(${q2(E.a, E.b, E.c)}=0\Rightarrow x_1=${ft(E.lo)},\ x_2=${ft(E.hi)}\).`,
    T`A parabola ${E.a > 0 ? 'felfelé' : 'lefelé'} nyitott, így ${E.rel === 'lt' || E.rel === 'le' ? 'negatív' : 'pozitív'} értéket a gyökök ${E.kozott ? 'között' : 'két oldalán'} vesz fel${E.zart ? ' (a gyökökben 0)' : ''}:`, T`\[${halmazT(E.lo, E.hi, E.kozott, E.zart)}\]`];
  const TIPP = T`Rendezd 0-ra, oldd meg a hozzá tartozó egyenletet, és vázold a parabolát! Felfelé nyitott parabola a gyökök között negatív, kívül pozitív.`;

  feladatok.halmaz = { nev: 'Melyik a megoldáshalmaz?', general() {
    const t = R(0, 6);
    if (t <= 4) { const E = egyenlotlenseg({ tort: true });
      const opc = [[true, false], [false, false], [true, true], [false, true]].map(([k, z]) => halmazSz(E.lo, E.hi, k, z));
      const jo = halmazSz(E.lo, E.hi, E.kozott, E.zart);
      const lista = keverd(opc);
      return { kerdes: T`<p>Melyik a megoldáshalmaz a valós számok körében?</p>\[${E.tex}\]`,
        valasz: { valasztas: lista, helyes: lista.indexOf(jo) }, tipp: TIPP, megoldas: megold(E) };
    }
    // nincs két különböző gyök: D = 0 vagy D < 0
    const a = P([1, -1, 2, -2]); const u = R(-6, 6); const d0 = t === 5; const v = d0 ? 0 : (a > 0 ? 1 : -1) * R(1, 6);
    const b = -2 * a * u, c = a * u * u + v; const rel = P(['lt', 'gt', 'le', 'ge']);
    let jo;
    const fel = a > 0;   // ha D<0: felfelé nyitott → mindig pozitív
    if (!d0) jo = (fel === (rel === 'gt' || rel === 'ge')) ? 'minden valós szám' : 'nincs megoldás';
    else { // (x−u)²·a REL 0
      const pozOldal = (rel === 'gt' || rel === 'ge') === fel;   // a parabola „jó oldalon” van
      jo = pozOldal ? (rel === 'gt' || rel === 'lt' ? `x ≠ ${hu(u)}` : 'minden valós szám') : (rel === 'gt' || rel === 'lt' ? 'nincs megoldás' : `x = ${hu(u)}`); }
    const opc = keverd(['minden valós szám', 'nincs megoldás', `x ≠ ${hu(u)}`, `x = ${hu(u)}`]);
    return { kerdes: T`<p>Melyik a megoldáshalmaz a valós számok körében?</p>\[${q2(a, b, c)}${REL[rel]}0\]`,
      valasz: { valasztas: opc, helyes: opc.indexOf(jo) }, tipp: TIPP + T` Ha nincs két különböző gyök, alakítsd teljes négyzetté!`,
      megoldas: [T`Teljes négyzetté alakítva: \(${q2(a, b, c)}=${a === 1 ? '' : a === -1 ? '-' : a}\left(x${el(-u)}\right)^2${el(v)}\).`,
        d0 ? T`A kifejezés értéke \(x=${u}\)-ben 0, máshol ${fel ? 'pozitív' : 'negatív'}.` : T`A kifejezés értéke minden \(x\)-re ${fel ? 'pozitív' : 'negatív'}.`, `A megoldás: ${jo}.`] };
  } };

  feladatok.egesz = { nev: 'Egész megoldások száma', general() {
    let E; do { E = egyenlotlenseg({ tort: true }); } while (!E.kozott || fv(E.hi) - fv(E.lo) > 14);
    const ints = []; for (let n = Math.floor(fv(E.lo)); n <= Math.ceil(fv(E.hi)); n++) if (igaz(E, n)) ints.push(n);
    const t = R(0, 2);
    const kerd = ['Hány egész szám elégíti ki az egyenlőtlenséget?', 'Mennyi az egyenlőtlenséget kielégítő egész számok összege?', 'Melyik a legnagyobb egész szám, amely kielégíti az egyenlőtlenséget?'][t];
    if (!ints.length && t > 0) return feladatok.egesz.general();
    const ans = t === 0 ? ints.length : t === 1 ? ints.reduce((x, y) => x + y, 0) : ints[ints.length - 1];
    return { kerdes: T`<p>${kerd}</p>\[${E.tex}\]`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: TIPP,
      megoldas: [...megold(E), ints.length ? T`Az egész megoldások: \(${ints.join(';\\ ')}\).` : 'Nincs egész megoldás.'] };
  } };

  feladatok.legk = { nev: 'Legkisebb / legnagyobb egész megoldás', general() {
    let E; do { E = egyenlotlenseg({ tort: true }); } while (E.kozott);
    const t = R(0, 1);   // 0: legkisebb pozitív? → a felső félegyenes legkisebb egésze; 1: alsó félegyenes legnagyobb egésze
    let ans = null;
    if (t === 0) { for (let n = Math.floor(fv(E.hi)); n <= Math.ceil(fv(E.hi)) + 1; n++) if (n > fv(E.lo) && igaz(E, n)) { ans = n; break; } }
    else { for (let n = Math.ceil(fv(E.lo)); n >= Math.floor(fv(E.lo)) - 1; n--) if (n < fv(E.hi) && igaz(E, n)) { ans = n; break; } }
    return { kerdes: T`<p>Az egyenlőtlenség megoldáshalmaza két félegyenesből áll. Melyik ${t === 0 ? T`a <b>jobb oldali</b> félegyenes <b>legkisebb</b>` : T`a <b>bal oldali</b> félegyenes <b>legnagyobb</b>`} egész eleme?</p>\[${E.tex}\]`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: TIPP, megoldas: megold(E),
      _ell: w => igaz(E, w) && (t === 0 ? w >= fv(E.hi) - 1e-9 && !(igaz(E, w - 1) && w - 1 >= fv(E.hi) - 1e-9) : w <= fv(E.lo) + 1e-9 && !(igaz(E, w + 1) && w + 1 <= fv(E.lo) + 1e-9)) };
  } };

  feladatok.mindenx = { nev: 'Minden valós x-re teljesül', general() {
    const t = R(0, 1);
    if (t === 0) {   // x² + bx + m > 0 ∀x ⇔ m > b²/4 → legkisebb egész m
      const a = P([1, 1, 2, 3, -1, -2]); const b = R0(-12, 12); const h = F(b * b, 4 * a); const poz = a > 0;
      const rel = poz ? P(['gt', 'ge']) : P(['lt', 'le']);
      const szig = rel === 'gt' || rel === 'lt';
      const ans = poz ? (szig ? Math.floor(fv(h)) + 1 : Math.ceil(fv(h) - 1e-12)) : (szig ? Math.ceil(fv(h)) - 1 : Math.floor(fv(h) + 1e-12));
      return { kerdes: T`<p>Melyik az a ${poz ? 'legkisebb' : 'legnagyobb'} egész \(m\), amelyre az egyenlőtlenség <b>minden</b> valós \(x\)-re teljesül?</p>\[${q2(a, b, 0)}+m${REL[rel]}0\]`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
        tipp: T`A parabola ${poz ? 'felfelé' : 'lefelé'} nyitott. Akkor ${poz ? 'pozitív' : 'negatív'} mindenhol, ha nincs zérushelye: \(D${szig ? '<' : T`\le `}0\).`,
        megoldas: [T`\(D=${b * b}${el(-4 * a)}m\).`, T`\(D${szig ? '<' : T`\le `}0\iff m${poz ? (szig ? '>' : T`\ge `) : (szig ? '<' : T`\le `)}${ft(h)}\). A keresett egész: \(m=${ans}\).`],
        _ell: w => { const D = b * b - 4 * a * w; return szig ? D < 0 : D <= 0; } };
    }
    // x² + m x + k > 0 ∀x ⇔ m² < 4k → hány egész m?
    const s = R(1, 6); const k = s * s; const zart = R(0, 1) === 1;   // ≥ esetén D ≤ 0: −2s ≤ m ≤ 2s
    const db = zart ? 4 * s + 1 : 4 * s - 1;
    return { kerdes: T`<p>Hány egész \(m\) értékre teljesül az egyenlőtlenség <b>minden</b> valós \(x\)-re?</p>\[x^2+mx+${k}${zart ? T`\ge ` : '>'}0\]`,
      valasz: { ertekek: [db] }, formatum: FMT10.egesz,
      tipp: T`Felfelé nyitott parabola: mindenhol ${zart ? 'nemnegatív' : 'pozitív'}, ha \(D${zart ? T`\le ` : '<'}0\). Itt \(D=m^2-${4 * k}\).`,
      megoldas: [T`\(m^2-${4 * k}${zart ? T`\le ` : '<'}0\iff ${-2 * s}${zart ? T`\le ` : '<'}m${zart ? T`\le ` : '<'}${2 * s}\).`, T`Ebben ${db} egész szám van.`] };
  } };

  feladatok.ertelmezes = { nev: 'Értelmezési tartomány', general() {
    const [p, q] = kulonbozo(2, -9, 9).sort((x, y) => x - y); const a = P([1, 1, 2, -1]);
    const [A, B, C] = egyutthatok(p, q, a > 0 ? 1 : -1);
    const fel = A > 0; const t = R(0, 1);
    // √(A x² + B x + C): értelmezve, ha ≥ 0; törtben a nevezőben: > 0
    const kif = t ? T`\sqrt{${q2(A, B, C)}}` : T`\frac{1}{\sqrt{${q2(A, B, C)}}}`;
    const zart = t === 1;
    // fel: értelmezve kívül (zárt/nyílt); le: értelmezve belül
    let ans, kerd;
    if (fel) { // kizárt egészek: a nyílt (vagy zárt) intervallumban
      const ki = []; for (let n = p; n <= q; n++) if (zart ? (n > p && n < q) : true) ki.push(n);
      ans = ki.length; kerd = 'Hány egész szám <b>nem</b> tartozik a kifejezés értelmezési tartományába?'; }
    else { const be = []; for (let n = p; n <= q; n++) if (zart ? true : (n > p && n < q)) be.push(n); ans = be.length; kerd = 'Hány egész szám tartozik a kifejezés értelmezési tartományába?'; }
    return { kerdes: T`<p>Tekintsük a valós számok halmazán a kifejezést:</p>\[${kif}\]<p>${kerd}</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: t ? T`Négyzetgyök alatt nem állhat negatív szám: \(${q2(A, B, C)}\ge0\).` : T`A gyök alatt nemnegatív szám állhat, de a nevező nem lehet 0: \(${q2(A, B, C)}>0\).`,
      megoldas: [T`Feltétel: \(${q2(A, B, C)}${zart ? T`\ge ` : '>'}0\). A gyökök: \(${p}\) és \(${q}\), a parabola ${fel ? 'felfelé' : 'lefelé'} nyitott.`,
        T`Értelmezési tartomány: \(${fel ? halmazT(F(p, 1), F(q, 1), false, zart) : halmazT(F(p, 1), F(q, 1), true, zart)}\).`, `Válasz: ${ans}.`] };
  } };

  feladatok.tortes = { nev: 'Törtes és magasabb fokú egyenlőtlenség', szint: 'emelt', general() {
    const t = R(0, 1);
    if (t === 0) {   // (x − a)/(x − b) REL 0
      const [a, b] = kulonbozo(2, -8, 8); const rel = P(['lt', 'le', 'gt', 'ge']); const neg = rel === 'lt' || rel === 'le';
      const g = x => (x - a) / (x - b);
      const ok = x => x !== b && (rel === 'lt' ? g(x) < 0 : rel === 'le' ? g(x) <= 0 : rel === 'gt' ? g(x) > 0 : g(x) >= 0);
      const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
      if (neg) { const ints = []; for (let n = lo; n <= hi; n++) if (ok(n)) ints.push(n);
        return { kerdes: T`<p>Hány egész szám elégíti ki az egyenlőtlenséget?</p>\[\frac{${l1(1, -a)}}{${l1(1, -b)}}${REL[rel]}0\]`,
          valasz: { ertekek: [ints.length] }, formatum: FMT10.egesz,
          tipp: T`Egy tört akkor negatív, ha a számláló és a nevező ellentétes előjelű. A nevező nem lehet 0 (\(x\neq${b}\))!`,
          megoldas: [T`Kikötés: \(x\neq${b}\). A tört előjele a \((${l1(1, -a)})(${l1(1, -b)})\) szorzatéval egyezik.`, T`Megoldás: ${a < b ? T`\(${a}${rel === 'le' ? T`\le ` : '<'}x<${b}\)` : T`\(${b}<x${rel === 'le' ? T`\le ` : '<'}${a}\)`}.`, T`Egész megoldások: \(${ints.join(';\\ ') || '–'}\), összesen ${ints.length}.`] }; }
      // pozitív: két félegyenes → hány egész NEM megoldás?
      const nem = []; for (let n = lo; n <= hi; n++) if (!ok(n)) nem.push(n);
      return { kerdes: T`<p>Hány olyan egész szám van, amely <b>nem</b> elégíti ki az egyenlőtlenséget?</p>\[\frac{${l1(1, -a)}}{${l1(1, -b)}}${REL[rel]}0\]`,
        valasz: { ertekek: [nem.length] }, formatum: FMT10.egesz,
        tipp: T`Egy tört akkor pozitív, ha a számláló és a nevező azonos előjelű. A nevező nem lehet 0 (\(x\neq${b}\))!`,
        megoldas: [T`Kikötés: \(x\neq${b}\). A tört pozitív, ha \(x<${lo}\) vagy \(x>${hi}\)${rel === 'ge' ? T`; 0 az \(x=${a}\) helyen, ez is megoldás` : ''}.`, T`Nem megoldás: \(${nem.join(';\\ ')}\), összesen ${nem.length} egész szám.`] };
    }
    // x⁴ − (s²+t²)x² + s²t² < 0 → s < |x| < t: egész megoldások száma
    const [s, u] = kulonbozo(2, 1, 6).sort((x, y) => x - y); const zart = R(0, 1) === 1;
    const ints = []; for (let n = -u; n <= u; n++) { const y = n ** 4 - (s * s + u * u) * n * n + s * s * u * u; if (zart ? y <= 0 : y < 0) ints.push(n); }
    return { kerdes: T`<p>Hány egész szám elégíti ki az egyenlőtlenséget?</p>\[x^4-${s * s + u * u}x^2+${s * s * u * u}${zart ? T`\le ` : '<'}0\]`,
      valasz: { ertekek: [ints.length] }, formatum: FMT10.egesz,
      tipp: T`Legyen \(y=x^2\): \(y^2-${s * s + u * u}y+${s * s * u * u}${zart ? T`\le ` : '<'}0\). Ebből \(${s * s}${zart ? T`\le ` : '<'}x^2${zart ? T`\le ` : '<'}${u * u}\).`,
      megoldas: [T`\(${s * s}${zart ? T`\le ` : '<'}x^2${zart ? T`\le ` : '<'}${u * u}\iff ${s}${zart ? T`\le ` : '<'}|x|${zart ? T`\le ` : '<'}${u}\).`, T`Egész megoldások: \(${ints.join(';\\ ') || '–'}\), összesen ${ints.length}.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'megyenlotl',
    cim: 'Másodfokú egyenlőtlenségek',
    rovid: 'Egyenlőtlenségek',
    bevezeto: T`Egy másodfokú egyenlőtlenség megoldásához elég két dolgot tudni: hol metszi a parabola az x tengelyt, és merre nyílik.`,
    elmelet: T`<div class="prose"><ol>
<li>Rendezd 0-ra: \(ax^2+bx+c<0\) (vagy \(>\), \(\le\), \(\ge\)).</li>
<li>Oldd meg az \(ax^2+bx+c=0\) egyenletet (zérushelyek).</li>
<li>Vázold a parabolát: \(a>0\) felfelé, \(a<0\) lefelé nyitott.</li>
<li>Olvasd le, hol van a parabola az x tengely alatt (negatív) vagy felett (pozitív).</li></ol></div>
<div class="tbl"><table><tr><th></th><th>\(a>0\), gyökök \(x_1<x_2\)</th><th>\(a<0\), gyökök \(x_1<x_2\)</th></tr>
<tr><td>\(f(x)<0\)</td><td>\(x_1<x<x_2\)</td><td>\(x<x_1\) vagy \(x>x_2\)</td></tr>
<tr><td>\(f(x)>0\)</td><td>\(x<x_1\) vagy \(x>x_2\)</td><td>\(x_1<x<x_2\)</td></tr></table></div>
<div class="prose"><ul>
<li>\(\le\), \(\ge\) esetén a gyökök is a megoldáshalmazhoz tartoznak.</li>
<li>Ha nincs zérushely (\(D<0\)), a kifejezés előjele állandó: vagy minden valós szám megoldás, vagy egyik sem.</li>
<li>Hibás: \(x^2>9\Rightarrow x>3\). Helyesen: \(x<-3\) vagy \(x>3\).</li>
<li>Negatív számmal szorozva vagy osztva az egyenlőtlenség iránya megfordul: \(-x^2+4>0\iff x^2-4<0\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`Az \(x^2>9\) egyenlőtlenség megoldása \(x>3\).`, igaz: false, miert: T`\(x<-3\) is megoldás: \(x<-3\) vagy \(x>3\).` },
      { allitas: T`Az \(x^2-4x+3<0\) megoldása \(1<x<3\).`, igaz: true, miert: T`A felfelé nyitott parabola a gyökei (1 és 3) között negatív.` },
      { allitas: T`Az \(x^2+1>0\) egyenlőtlenség minden valós számra teljesül.`, igaz: true, miert: T`\(x^2\ge0\), így \(x^2+1\ge1>0\).` },
      { allitas: T`Az \((x-2)^2\le0\) egyenlőtlenségnek nincs megoldása.`, igaz: false, miert: T`\(x=2\) esetén \(0\le0\) igaz.` },
      { allitas: T`A \(-x^2+5x-6\ge0\) egyenlőtlenség megoldása \(2\le x\le3\).`, igaz: true, miert: T`Szorozzuk \(-1\)-gyel (irányváltás): \(x^2-5x+6\le0\), a gyökök között.` },
      { allitas: T`Az \(x^2<5x\) egyenlőtlenséget \(x\)-szel osztva \(x<5\) a teljes megoldás.`, igaz: false, miert: T`Az osztásnál nem tudjuk \(x\) előjelét. Helyesen: \(x^2-5x<0\Rightarrow 0<x<5\).` },
      { allitas: T`Ha \(D<0\) és \(a<0\), akkor \(ax^2+bx+c<0\) minden valós \(x\)-re.`, igaz: true, miert: 'A lefelé nyitott parabola teljes egészében az x tengely alatt van.' },
      { general() { const E = egyenlotlenseg({}); const jo = R(0, 1) === 1; const k = jo ? E.kozott : !E.kozott;
        return { allitas: T`\(${q2(E.a, E.b, E.c)}${REL[E.rel]}0\) megoldása: \(${halmazT(E.lo, E.hi, k, E.zart)}\).`, igaz: k === E.kozott, miert: T`A gyökök \(${ft(E.lo)}\) és \(${ft(E.hi)}\); a parabola ${E.a > 0 ? 'felfelé' : 'lefelé'} nyitott, ezért a megoldás: \(${halmazT(E.lo, E.hi, E.kozott, E.zart)}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Oldjuk meg: \(2x^2-7x-4<0\)`,
      lepesek: [
        T`Az egyenlet: \(2x^2-7x-4=0\), \(D=49+32=81\), \(x_{1,2}=\frac{7\pm9}{4}\): \(x_1=-\frac12\), \(x_2=4\).`,
        T`A parabola felfelé nyitott (\(a=2>0\)), így a két gyök között van az x tengely alatt.`,
        T`\[-\frac12<x<4\]`
      ]
    },
    grafikon: M10.parabola({ elojel: true }),
    grafikonCim: 'Parabola és előjel',
    feladatok
  }));
})();
