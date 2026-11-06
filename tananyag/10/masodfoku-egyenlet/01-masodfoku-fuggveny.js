/*
 * 1. fejezet – A másodfokú egyenlet és függvény (teljes négyzetté alakítás, csúcspont, zérushely)
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 1. lecke; FGY 2149–2156)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, sz, zj, el, absT, FMT10 } = M10;
  const feladatok = {};
  const fx = (a, b, c) => x => a * x * x + b * x + c;
  /* a(x − u)² + v TeX-alakja */
  function csT(a, u, v) {
    const av = typeof a === 'object' ? a.n / a.d : a;
    const aT = av === 1 ? '' : av === -1 ? '-' : sz(a);
    const uv = typeof u === 'object' ? u.n / u.d : u;
    const zar = uv === 0 ? 'x^2' : T`\left(x${el(typeof u === 'object' ? F(-u.n, u.d) : -u)}\right)^2`;
    return aT + zar + el(v);
  }
  const egy = (x, y) => Math.abs(x - y) < 1e-9;

  feladatok.telj = { nev: 'Teljes négyzetté alakítás', general() {
    const fel = R(0, 4) === 0;                       // néha fél egész u (pl. x² + 5x + 1)
    const a = fel ? 1 : P([1, 1, 1, 1, 2, 3, -1, -2]);
    let u, v, b, c;
    if (fel) { const k = P([-7, -5, -3, -1, 1, 3, 5, 7]); u = F(k, 2); b = -k; c = R(-10, 10); v = F(4 * c - k * k, 4); }
    else { u = R0(-6, 6); v = R(-12, 12); b = -2 * a * u; c = a * u * u + v; }
    const uv = fv(typeof u === 'object' ? u : F(u)), vv = typeof v === 'object' ? fv(v) : v;
    const cT = typeof v === 'object' ? ft(F(Math.round(c * 4), 4)) : c;
    const bal = q2(a, b, typeof v === 'object' ? F(Math.round(c * 4), 4) : c);
    const aT = a === 1 ? '' : a === -1 ? '-' : String(a);
    const kerdV = R(0, 1) === 0;
    const jobb = kerdV ? T`${aT}\left(x${el(typeof u === 'object' ? F(-u.n, u.d) : -u)}\right)^2+\square` : T`${aT}\left(x+\square\right)^2${el(v)}`;
    const ans = kerdV ? vv : -uv;
    const f = fx(a, b, c);
    const lep = [];
    if (a !== 1) lep.push(T`Emeljük ki a főegyütthatót az első két tagból: \(${q2(a, b, c)}=${a === -1 ? '-' : a}\left(${q2(1, b / a, 0)}\right)${el(cT)}\).`);
    const h = typeof u === 'object' ? F(-u.n, u.d) : -u;     // b/(2a)
    lep.push((a !== 1 ? 'A zárójelben: ' : 'Az első két tag: ') + T`\(${q2(1, -2 * uv, 0)}=\left(x${el(h)}\right)^2-${typeof h === 'object' ? T`\left(${absT(h)}\right)^2` : T`${Math.abs(h)}^2`}\).`);
    lep.push(T`\[${bal}=${csT(a, u, v)}\]`);
    return { kerdes: T`<p>Alakítsd teljes négyzetté! Mi kerül a négyzet helyére?</p>\[${bal}=${jobb}\]`,
      valasz: { ertekek: [ans] }, formatum: typeof v === 'object' ? FMT10.tort : FMT10.egesz,
      tipp: T`\(x^2+bx=\left(x+\frac{b}{2}\right)^2-\left(\frac{b}{2}\right)^2\). Ha \(a\neq 1\), előbb emeld ki \(a\)-t az első két tagból.`,
      megoldas: lep, _ell: w => kerdV ? [0, 1, 2.5].every(x => egy(a * (x - uv) ** 2 + w, f(x))) : [0, 1, 2.5].every(x => egy(a * (x + w) ** 2 + vv, f(x))) };
  } };

  feladatok.csucs = { nev: 'Csúcspont, szélsőérték', general() {
    const a = P([1, 1, 1, -1, -1, 2, -2, 3, -3]); const u = R(-6, 6), v = R(-10, 10);
    const b = -2 * a * u, c = a * u * u + v; const f = fx(a, b, c);
    const t = R(0, 3);
    const min = a > 0;
    const kerd = [T`Add meg a parabola csúcspontjának <b>első</b> koordinátáját!`, T`Add meg a parabola csúcspontjának <b>második</b> koordinátáját!`,
      T`Mennyi a függvény <b>${min ? 'minimum' : 'maximum'}ának értéke</b>?`, T`Melyik \(x\) helyen veszi fel a függvény a <b>${min ? 'minimum' : 'maximum'}át</b>?`][t];
    const ans = t === 0 || t === 3 ? u : v;
    return { kerdes: T`<p>Adott a valós számok halmazán értelmezett függvény:</p>\[f(x)=${q2(a, b, c)}\]<p>${kerd}</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`Alakítsd teljes négyzetté: \(f(x)=a(x-u)^2+v\). A csúcspont \(C(u;v)\). (Képlettel: \(u=-\frac{b}{2a}\).)`,
      megoldas: [T`\[f(x)=${q2(a, b, c)}=${csT(a, u, v)}\]`, T`A csúcspont: \(C(${u};\,${v})\). Mivel \(a${min ? '>' : '<'}0\), a parabola ${min ? 'felfelé' : 'lefelé'} nyitott, így ${min ? 'minimuma' : 'maximuma'} van: \(${v}\), az \(x=${u}\) helyen.`],
      _ell: w => { const x0 = -b / (2 * a); return t === 0 || t === 3 ? egy(w, x0) : egy(w, f(x0)); } };
  } };

  feladatok.zerus = { nev: 'Zérushelyek', general() {
    const k = R(0, 9); let a, b, c, lep;
    if (k <= 6) {   // két egész zérushely
      a = P([1, 1, 1, -1, 2, -2, 3]); const [p, q] = M10.kulonbozo(2, -8, 8);
      b = -a * (p + q); c = a * p * q;
    } else if (k === 7) { a = P([1, -1, 2]); const p = R0(-6, 6); b = -2 * a * p; c = a * p * p; }   // egy zérushely
    else { a = P([1, -1, 2, -2]); const u = R(-5, 5), v = (a > 0 ? 1 : -1) * R(1, 8); b = -2 * a * u; c = a * u * u + v; }   // nincs
    const K = M10.keplet(a, b, c);
    const D = b * b - 4 * a * c;
    const ans = K.gyokok;
    const f = fx(a, b, c);
    return { kerdes: T`<p>Határozd meg a függvény zérushelyeit! Ha több van, pontosvesszővel válaszd el őket; ha nincs, írd: nincs.</p>\[f(x)=${q2(a, b, c)}\]`,
      valasz: ans.length ? { ertekek: ans } : { nincs: true }, formatum: FMT10.halmaz,
      tipp: T`A zérushely ott van, ahol \(f(x)=0\). Oldd meg az \(${q2(a, b, c)}=0\) egyenletet (teljes négyzetté alakítással vagy a megoldóképlettel).`,
      megoldas: [T`Megoldandó: \(${q2(a, b, c)}=0\).`, ...K.lep],
      _ell: w => w === 'nincs' ? D < 0 : egy(f(w), 0), _mind: vs => vs.length === (D > 0 ? 2 : 1) || 'darabszám' };
  } };

  feladatok.ertekk = { nev: 'Értékkészlet, monotonitás', general() {
    const a = P([1, 2, 3, -1, -2, F(1, 2), F(-1, 2)]); const av = typeof a === 'object' ? fv(a) : a;
    const u = R(-6, 6), v = R(-9, 9); const t = R(0, 2); const fel = av > 0;
    const kif = R(0, 1) === 0 || typeof a === 'object' ? csT(a, u, v) : q2(av, -2 * av * u, av * u * u + v);
    let kerd, ans;
    if (t === 0) { kerd = T`A függvény értékkészlete: \(\{y\in\mathbb{R}\mid y${fel ? T`\ge ` : T`\le `} \square\}\). Mi kerül a négyzet helyére?`; ans = v; }
    else if (t === 1) { kerd = T`A függvény a \(]-\infty;\,\square]\) intervallumon szigorúan ${fel ? 'csökkenő' : 'növekvő'}. Mi kerül a négyzet helyére?`; ans = u; }
    else { kerd = T`A függvény a \([\square;\,\infty[\) intervallumon szigorúan ${fel ? 'növekvő' : 'csökkenő'}. Mi kerül a négyzet helyére?`; ans = u; }
    return { kerdes: T`<p>Adott a valós számok halmazán értelmezett függvény:</p>\[f(x)=${kif}\]<p>${kerd}</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`Hozd \(a(x-u)^2+v\) alakra. A csúcspont \(C(u;v)\): itt fordul meg a parabola, és itt van a legkisebb (\(a>0\)) vagy legnagyobb (\(a<0\)) érték.`,
      megoldas: [T`\[f(x)=${csT(a, u, v)}\]`, T`Csúcspont: \(C(${u};\,${v})\), a parabola ${fel ? 'felfelé' : 'lefelé'} nyitott.`,
        fel ? T`Értékkészlet: \(y\ge ${v}\). Az \(x\le ${u}\) részen csökkenő, az \(x\ge ${u}\) részen növekvő.` : T`Értékkészlet: \(y\le ${v}\). Az \(x\le ${u}\) részen növekvő, az \(x\ge ${u}\) részen csökkenő.`] };
  } };

  feladatok.szabaly = { nev: 'Hozzárendelési szabály felírása', general() {
    const t = R(0, 2);
    if (t === 0) {   // csúcs + egy pont → a
      const a = P([1, 2, 3, -1, -2, -3, F(1, 2), F(-1, 2)]); const av = typeof a === 'object' ? fv(a) : a;
      const u = R(-4, 4), v = R(-6, 6); let x0; do { x0 = u + P([-2, -1, 1, 2, 3]); } while (typeof a === 'object' && (x0 - u) % 2 !== 0);
      const y0 = av * (x0 - u) ** 2 + v;
      return { kerdes: T`<p>Egy másodfokú függvény grafikonjának csúcspontja \(C(${u};\,${v})\), és a grafikon átmegy a \(P(${x0};\,${y0})\) ponton. A függvény hozzárendelési szabálya \(f(x)=a(x-u)^2+v\) alakú. Mennyi \(a\)?</p>`,
        valasz: { ertekek: [av] }, formatum: FMT10.tort,
        tipp: T`Írd fel: \(f(x)=a${u === 0 ? 'x^2' : T`\left(x${el(-u)}\right)^2`}${el(v)}\), majd helyettesítsd be a \(P\) pont koordinátáit.`,
        megoldas: [T`\[f(x)=a${u === 0 ? 'x^2' : T`\left(x${el(-u)}\right)^2`}${el(v)}\]`, T`\[${y0}=a\cdot ${zj(x0 - u)}^2${el(v)}\quad\Rightarrow\quad ${(x0 - u) ** 2}a=${y0 - v}\quad\Rightarrow\quad a=${sz(a)}\]`],
        _ell: w => egy(w * (x0 - u) ** 2 + v, y0) };
    }
    if (t === 1) {   // zérushelyek + y-tengelymetszet → a
      const [p, q] = M10.kulonbozo(2, -6, 6, [0]); const a = P([1, 2, 3, -1, -2, -3]); const c = a * p * q;
      return { kerdes: T`<p>Egy másodfokú függvény zérushelyei \(${p}\) és \(${q}\), grafikonja az \(y\) tengelyt a \((0;\,${c})\) pontban metszi. A hozzárendelési szabály \(f(x)=a(x-x_1)(x-x_2)\) alakban írható fel. Mennyi \(a\)?</p>`,
        valasz: { ertekek: [a] }, formatum: FMT10.egesz,
        tipp: T`\(f(x)=a\cdot ${M10.tenyezo(p)}${M10.tenyezo(q)}\). Helyettesíts be \(x=0\)-t: \(f(0)=${c}\).`,
        megoldas: [T`\[f(x)=a${M10.tenyezo(p)}${M10.tenyezo(q)}\]`, T`\[f(0)=a\cdot ${zj(-p)}\cdot ${zj(-q)}=${p * q}a=${c}\quad\Rightarrow\quad a=${a}\]`],
        _ell: w => egy(w * p * q, c) };
    }
    // csúcs + a ismert → f(0) vagy f(k) értéke
    const a = P([1, -1, 2, -2]); const u = R(-4, 4), v = R(-6, 6); const k = R(-3, 3);
    const ans = a * (k - u) ** 2 + v;
    return { kerdes: T`<p>Az \(f(x)=${a === 1 ? '' : a === -1 ? '-' : a}x^2+bx+c\) függvény grafikonjának csúcspontja \(C(${u};\,${v})\). Mennyi \(f(${k})\)?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: T`A csúcspont ismeretében: \(f(x)=${a === 1 ? '' : a === -1 ? '-' : a}(x-u)^2+v\). Ide helyettesíts be.`,
      megoldas: [T`\[f(x)=${csT(a, u, v)}\]`, T`\[f(${k})=${a === 1 ? '' : a === -1 ? '-' : a + T`\cdot `}${zj(k - u)}^2${el(v)}=${ans}\]`] };
  } };

  feladatok.param = { nev: 'Paraméter meghatározása', general() {
    const t = R(0, 3);
    const a = P([1, 1, 1, 2, -1]); const u = R0(-5, 5); const b = -2 * a * u;   // b páros többszörös, hogy szép legyen
    const hatar = a * u * u;   // b²/(4a)
    const f0 = T`f(x)=${q2(a, b, 0)}+q`;
    if (t === 0) return { kerdes: T`<p>Adott az \(${f0}\) függvény. Határozd meg \(q\) értékét úgy, hogy a függvénynek <b>pontosan egy</b> zérushelye legyen!</p>`,
      valasz: { ertekek: [hatar] }, formatum: FMT10.egesz,
      tipp: 'Pontosan egy zérushely akkor van, ha a parabola csúcspontja az x tengelyen van, azaz a szélsőérték 0.',
      megoldas: [T`\[f(x)=${csT(a, u, 0)}${el(-hatar)}+q\]`, T`A csúcspont második koordinátája \(q${el(-hatar)}\). Ez 0, ha \(q=${hatar}\).`],
      _ell: w => egy(b * b - 4 * a * w, 0) };
    if (t === 1) { const m = R(-9, 9);
      return { kerdes: T`<p>Adott az \(${f0}\) függvény. Határozd meg \(q\) értékét úgy, hogy a függvény ${a > 0 ? 'minimuma' : 'maximuma'} \(${m}\) legyen!</p>`,
        valasz: { ertekek: [m + hatar] }, formatum: FMT10.egesz,
        tipp: T`Teljes négyzetté alakítás után a szélsőérték a konstans tag: \(a(x-u)^2+v\) esetén \(v\).`,
        megoldas: [T`\[f(x)=${csT(a, u, 0)}${el(-hatar)}+q\]`, T`A szélsőérték: \(q${el(-hatar)}=${m}\), tehát \(q=${m + hatar}\).`],
        _ell: w => egy(w - b * b / (4 * a), m) }; }
    if (t === 2) { const aa = P([1, 1, 2]); const uu = R0(-5, 5); const bb = -2 * aa * uu; const h = aa * uu * uu; const poz = R(0, 1) === 0;
      const cc = aa > 0 && poz ? h + 1 : h - 1;
      return { kerdes: T`<p>Adott az \(f(x)=${q2(aa, bb, 0)}+q\) függvény. Melyik az a ${poz ? 'legkisebb' : 'legnagyobb'} <b>egész</b> \(q\), amelyre a függvény ${poz ? 'minden értéke pozitív' : 'grafikonja metszi az x tengelyt (van két zérushelye)'}?</p>`,
        valasz: { ertekek: [cc] }, formatum: FMT10.egesz,
        tipp: T`A felfelé nyitott parabola ${poz ? 'minden értéke pozitív, ha a minimuma pozitív' : 'két pontban metszi az x tengelyt, ha a minimuma negatív'}.`,
        megoldas: [T`\[f(x)=${csT(aa, uu, 0)}${el(-h)}+q\]`, T`A minimum: \(q${el(-h)}\). ${poz ? T`\(q${el(-h)}>0\iff q>${h}\)` : T`\(q${el(-h)}<0\iff q<${h}\)`}, így a keresett egész: \(q=${cc}\).`] }; }
    // adott zérushely → q
    const z = R(-6, 6); const qq = -(a * z * z + b * z);
    return { kerdes: T`<p>Adott az \(${f0}\) függvény. Határozd meg \(q\) értékét úgy, hogy az \(x=${z}\) zérushelye legyen a függvénynek!</p>`,
      valasz: { ertekek: [qq] }, formatum: FMT10.egesz,
      tipp: T`Zérushely: \(f(${z})=0\). Helyettesíts be, és oldd meg \(q\)-ra.`,
      megoldas: [T`\[f(${z})=${a === 1 ? '' : a === -1 ? '-' : a + T`\cdot `}${zj(z)}^2${b < 0 ? '-' : '+'}${Math.abs(b)}\cdot ${zj(z)}+q=${a * z * z + b * z}+q=0\]`, T`\[q=${qq}\]`],
      _ell: w => egy(a * z * z + b * z + w, 0) };
  } };

  feladatok.pq = { nev: 'Együtthatók a csúcspontból', szint: 'emelt', general() {
    const u = R0(-6, 6), v = R(-12, 12); const p = -2 * u, q = u * u + v; const melyik = R(0, 1);
    return { kerdes: T`<p>Az \(f(x)=x^2+px+q\) függvény minimumát az \(x=${u}\) helyen veszi fel, és a minimum értéke \(${v}\). Mennyi ${melyik ? T`\(q\)` : T`\(p\)`}?</p>`,
      valasz: { ertekek: [melyik ? q : p] }, formatum: FMT10.egesz,
      tipp: T`A feltételekből \(f(x)=\left(x${el(-u)}\right)^2${el(v)}\). Bontsd fel a zárójelet, és hasonlítsd össze az együtthatókat.`,
      megoldas: [T`\[f(x)=\left(x${el(-u)}\right)^2${el(v)}=${q2(1, p, q)}\]`, T`Tehát \(p=${p}\) és \(q=${q}\).`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mfv',
    cim: 'A másodfokú függvény és a teljes négyzet',
    rovid: 'Másodfokú függvény',
    bevezeto: T`A másodfokú egyenletek megoldásának kulcsa a <b>teljes négyzetté alakítás</b>. Ebből leolvasható a parabola csúcspontja, a szélsőérték és az is, hogy hány zérushely van.`,
    elmelet: T`<div class="prose"><p>A másodfokú függvény: \(f(x)=ax^2+bx+c\), ahol \(a\neq 0\). Grafikonja <b>parabola</b>: \(a>0\) esetén felfelé, \(a<0\) esetén lefelé nyitott.</p>
<p><b>Teljes négyzetté alakítás:</b> \(x^2+bx=\left(x+\frac{b}{2}\right)^2-\left(\frac{b}{2}\right)^2\). Ha \(a\neq1\), előbb kiemeljük \(a\)-t.</p></div>
<div class="mathbox">\[2x^2+12x+16=2\left(x^2+6x\right)+16=2\left[(x+3)^2-9\right]+16=2(x+3)^2-2\]</div>
<div class="tbl"><table><tr><th>Alak</th><th>Mit olvasunk le belőle?</th></tr>
<tr><td>\(f(x)=a(x-u)^2+v\)</td><td>csúcspont \(C(u;v)\), tengely \(x=u\), szélsőérték \(v\)</td></tr>
<tr><td>\(f(x)=a(x-x_1)(x-x_2)\)</td><td>zérushelyek \(x_1\), \(x_2\)</td></tr>
<tr><td>\(f(x)=ax^2+bx+c\)</td><td>\(f(0)=c\) (y-tengelymetszet); \(u=-\frac{b}{2a}\)</td></tr></table></div>
<div class="prose"><ul>
<li>Transzformációk: \(x^2\to (x-u)^2\): eltolás \(u\)-val jobbra; \(+v\): eltolás \(v\)-vel felfelé; \(a\cdot\): nyújtás (\(|a|>1\)) vagy zsugorítás (\(|a|<1\)), \(a<0\) esetén tükrözés is.</li>
<li>Zérushelyek száma: 0, 1 vagy 2 – attól függ, hogy a csúcspont az x tengely melyik oldalán van, illetve rajta van-e.</li>
<li>\(a>0\): minimum \(v\), értékkészlet \(y\ge v\); \(a<0\): maximum \(v\), értékkészlet \(y\le v\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(x^2-6x+5=(x-3)^2-4\)`, igaz: true, miert: T`\((x-3)^2=x^2-6x+9\), és \(9-4=5\).` },
      { allitas: T`\(x^2+4x+1=(x+4)^2-15\)`, igaz: false, miert: T`A zárójelben \(\frac{b}{2}=2\) áll: \((x+2)^2-3\).` },
      { allitas: T`Az \(f(x)=(x+2)^2-5\) parabola csúcspontja \(C(2;-5)\).`, igaz: false, miert: T`\((x+2)^2=(x-(-2))^2\), tehát \(C(-2;-5)\).` },
      { allitas: T`Az \(f(x)=-2(x-1)^2+3\) függvénynek maximuma van.`, igaz: true, miert: T`\(a=-2<0\), a parabola lefelé nyitott, maximuma \(3\).` },
      { allitas: T`Az \(f(x)=x^2+4\) függvénynek nincs zérushelye.`, igaz: true, miert: T`\(x^2+4\ge4>0\) minden valós \(x\)-re.` },
      { allitas: T`Egy másodfokú függvénynek lehet három zérushelye.`, igaz: false, miert: T`A parabola legfeljebb két pontban metszheti az x tengelyt.` },
      { allitas: T`Az \(f(x)=ax^2+bx+c\) grafikonja az \(y\) tengelyt a \((0;c)\) pontban metszi.`, igaz: true, miert: T`\(f(0)=c\).` },
      { allitas: T`Az \(f(x)=\frac12x^2\) grafikonja „szélesebb”, mint az \(x^2\) normálparaboláé.`, igaz: true, miert: T`\(|a|<1\) esetén a parabola zsugorodik az \(y\) tengely irányában, ezért szélesebbnek látszik.` },
      { general() { const u = R0(-5, 5), v = R0(-6, 6); const jo = R(0, 1) === 1; const uu = jo ? u : -u;
        return { allitas: T`Az \(f(x)=${csT(1, u, v)}\) függvény csúcspontja \(C(${uu};\,${v})\).`, igaz: uu === u, miert: T`\(a(x-u)^2+v\) alakból \(C(u;v)=C(${u};\,${v})\).` }; } },
      { general() { const u = R(-4, 4), v = R0(-6, 6); const a = P([1, -1]);
        const igaz = (a > 0 && v > 0) || (a < 0 && v < 0);
        return { allitas: T`Az \(f(x)=${csT(a, u, v)}\) függvénynek nincs zérushelye.`, igaz, miert: igaz ? T`A csúcspont \((${u};\,${v})\), és a parabola ${a > 0 ? 'felfelé' : 'lefelé'} nyílik, így nem éri el az x tengelyt.` : T`A csúcspont \((${u};\,${v})\) az x tengely másik oldalán van, mint amerre a parabola nyílik, ezért két zérushely van.` }; } }
    ],
    mintapelda: {
      feladat: T`Ábrázoljuk és jellemezzük az \(f(x)=2x^2+12x+16\) függvényt!`,
      lepesek: [
        T`Teljes négyzetté alakítás: \(f(x)=2\left(x^2+6x\right)+16=2\left[(x+3)^2-9\right]+16=2(x+3)^2-2\).`,
        T`Transzformációk: az \(x^2\) parabolát 3-mal balra toljuk, kétszeresére nyújtjuk, majd 2-vel lefelé toljuk. Csúcspont: \(C(-3;-2)\).`,
        T`Zérushelyek: \(2(x+3)^2-2=0\Rightarrow (x+3)^2=1\Rightarrow x+3=\pm1\), tehát \(x_1=-4\), \(x_2=-2\).`,
        T`Monotonitás: \(x\le-3\) esetén csökkenő, \(x\ge-3\) esetén növekvő. Minimum: \(-2\), az \(x=-3\) helyen. Értékkészlet: \(y\ge-2\).`
      ]
    },
    grafikon: M10.parabola(),
    grafikonCim: 'Parabola-rajzoló',
    feladatok
  }));
})();
