/*
 * 2. fejezet – A másodfokú egyenlet megoldóképlete (hiányos egyenletek, teljes négyzet, megoldóképlet)
 * Témakör: A másodfokú egyenlet (10. évfolyam, Sokszínű matematika 10., 3. fejezet 2. lecke; FGY 2157–2163)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, q2, l1, sz, zj, el, tenyezo, egyutthatok, tortGyok, keplet, gyokokT, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-7;
  const KERD = T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket; ha nincs, írd: nincs.</p>`;
  const valasz = gyk => gyk.length ? { ertekek: gyk.map(fv) } : { nincs: true };

  feladatok.hianyos = { nev: 'Hiányos másodfokú egyenletek', general() {
    const t = R(0, 5);
    if (t <= 2) {   // ax² + c = 0 vagy ax² = k
      const a = P([1, 1, 2, 3, 4, 5, 9]); const nincs = R(0, 5) === 0;
      let r; if (a === 4 || a === 9) { const q = Math.sqrt(a); r = F(P([1, 3, 5, 7, 2 * q + 1]), q); } else r = F(R(1, 13), 1);
      const k = fv(F(r.n * r.n, r.d * r.d)) * a;            // a·r² (egész)
      const kk = Math.round(k);
      const eq = nincs ? (R(0, 1) ? T`${a === 1 ? '' : a}x^2+${kk}=0` : T`${a === 1 ? '' : a}x^2=-${kk}`) : (R(0, 1) ? T`${a === 1 ? '' : a}x^2-${kk}=0` : T`${a === 1 ? '' : a}x^2=${kk}`);
      const gyk = nincs ? [] : [F(-r.n, r.d), r];
      return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gyk), formatum: FMT10.halmaz,
        tipp: T`Rendezd \(x^2=\dots\) alakra. Ha a jobb oldal pozitív, két ellentett gyök van; ha negatív, nincs valós megoldás.`,
        megoldas: nincs ? [T`\[x^2=${-kk}${a === 1 ? '' : T`:${a}`}\]`, T`Egy valós szám négyzete nem lehet negatív, ezért nincs valós megoldás.`]
          : [T`\[x^2=${a === 1 ? kk : T`\frac{${kk}}{${a}}=${ft(F(kk, a))}`}\]`, T`\[x=\pm${ft(r)}\quad\Rightarrow\quad ${gyokokT(gyk)}\]`],
        _ell: w => w === 'nincs' ? nincs : egy(a * w * w, kk) };
    }
    // ax² + bx = 0
    const a = R0(-5, 6), b = R0(-15, 15); const forma = R(0, 1);
    const eq = forma === 0 ? T`${q2(a, b, 0)}=0` : T`${q2(a, 0, 0)}=${l1(-b, 0)}`;
    const gyk = [F(0, 1), F(-b, a)].sort((x, y) => fv(x) - fv(y));
    return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gyk), formatum: FMT10.halmaz,
      tipp: T`Rendezz 0-ra, és emeld ki \(x\)-et! Egy szorzat akkor 0, ha valamelyik tényezője 0. <b>Ne oszd el</b> az egyenletet \(x\)-szel, mert elveszíted az \(x=0\) gyököt!`,
      megoldas: [T`\[${q2(a, b, 0)}=0\quad\Rightarrow\quad x\left(${l1(a, b)}\right)=0\]`, T`\(x=0\) vagy \(${l1(a, b)}=0\Rightarrow x=${ft(F(-b, a))}\).`, T`\[${gyokokT(gyk)}\]`],
      _ell: w => egy(a * w * w + b * w, 0) };
  } };

  feladatok.szorzat = { nev: 'Szorzat nulla', general() {
    const k = P([1, 1, 2, 3, -2, 5, 7]); const r1 = R(0, 3) === 0 ? F(0, 1) : (R(0, 2) === 0 ? tortGyok(4) : F(R0(-9, 9), 1));
    let r2; do { r2 = R(0, 2) === 0 ? tortGyok(4) : F(R0(-9, 9), 1); } while (fv(r2) === fv(r1));
    // tényezők: (q x − p) alak, néha (p − q x) sorrendben
    const tz = r => { if (r.n === 0) return 'x'; const ford = R(0, 2) === 0; if (r.d === 1) return ford ? `(${r.n}-x)` : `(x${el(-r.n)})`; return ford ? `(${r.n}-${r.d}x)` : `(${r.d}x${el(-r.n)})`; };
    const kT = k === 1 ? '' : k === -1 ? '-' : k + T`\cdot `;
    const eq = T`${kT}${tz(r1)}\cdot ${tz(r2)}=0`;
    const gyk = [r1, r2].sort((x, y) => fv(x) - fv(y));
    return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gyk), formatum: FMT10.halmaz,
      tipp: 'Egy szorzat értéke akkor és csak akkor 0, ha valamelyik tényezője 0. Ne bontsd fel a zárójeleket!',
      megoldas: [k === 1 ? 'Valamelyik tényező 0:' : T`\(${k}\neq 0\), így valamelyik másik tényező 0:`, T`\[${gyokokT(gyk)}\]`],
      _ell: w => egy(k * (r1.d * w - r1.n) * (r2.d * w - r2.n), 0) };
  } };

  feladatok.negyzetes = { nev: 'Négyzet = szám alak', general() {
    const m = P([1, 1, 1, 2, 3, -1]); const n = R0(-9, 9); const nincs = R(0, 6) === 0;
    const s = R(1, 12); const k = s * s; const plusz = R(0, 2) === 0 ? R(1, 30) : 0;
    const bal = T`\left(${l1(m, n)}\right)^2`;
    let eq, gyk = [];
    if (nincs) { const kk = R(1, 20); eq = R(0, 1) ? T`${bal}+${kk + plusz}=${plusz}` : T`${bal}=-${kk}`; }
    else { eq = plusz ? T`${bal}+${plusz}=${k + plusz}` : T`${bal}=${k}`; gyk = [F(s - n, m), F(-s - n, m)].sort((x, y) => fv(x) - fv(y)); }
    return { kerdes: KERD + T`\[${eq}\]`, valasz: valasz(gyk), formatum: FMT10.halmaz,
      tipp: T`Ne bontsd fel a zárójelet! Ha \(A^2=k\) és \(k>0\), akkor \(A=\sqrt{k}\) vagy \(A=-\sqrt{k}\) (mert \(\sqrt{A^2}=|A|\)).`,
      megoldas: nincs ? [T`A bal oldalon álló négyzet nem lehet negatív, a jobb oldal (rendezés után) negatív: nincs valós megoldás.`]
        : [plusz ? T`\[${bal}=${k}\]` : T`Gyököt vonunk: \(\left|${l1(m, n)}\right|=${s}\).`, T`\[${l1(m, n)}=${s}\quad\text{vagy}\quad ${l1(m, n)}=-${s}\]`, T`\[${gyokokT(gyk)}\]`],
      _ell: w => w === 'nincs' ? nincs : egy((m * w + n) ** 2, k) };
  } };

  feladatok.teljnegyzet = { nev: 'Teljes négyzetté alakítással', general() {
    const h = R0(-8, 8); let d; do { d = R(0, 10); } while (d === 0 && R(0, 2) > 0);   // (x+h)² = d²
    const p = 2 * h, q = h * h - d * d;                    // x² + px + q = 0, gyökök: −h ± d
    const jobb = R(0, 1) === 0;
    let eq, f;
    if (jobb) { const r = R(-6, 6), s = R(-12, 12); eq = T`${q2(1, p + r, q + s)}=${l1(r, s) === '0' ? '0' : l1(r, s)}`; f = x => x * x + (p + r) * x + q + s - (r * x + s); }
    else { eq = T`${q2(1, p, q)}=0`; f = x => x * x + p * x + q; }
    const gyk = d === 0 ? [F(-h, 1)] : [F(-h - d, 1), F(-h + d, 1)];
    return { kerdes: T`<p>Oldd meg teljes négyzetté alakítással! Ha több megoldás van, pontosvesszővel válaszd el őket.</p>\[${eq}\]`, valasz: valasz(gyk), formatum: FMT10.halmaz,
      tipp: T`Rendezd 0-ra, majd: \(x^2${el(p)}x=\left(x${el(h)}\right)^2-${h * h}\).`,
      megoldas: [jobb ? T`Rendezés után: \(${q2(1, p, q)}=0\).` : '', T`\[\left(x${el(h)}\right)^2-${h * h}${el(q)}=0\quad\Rightarrow\quad\left(x${el(h)}\right)^2=${d * d}\]`,
        d === 0 ? T`\[x${el(h)}=0\quad\Rightarrow\quad x=${-h}\]` : T`\[x${el(h)}=\pm${d}\quad\Rightarrow\quad ${gyokokT(gyk)}\]`].filter(Boolean),
      _ell: w => egy(f(w), 0) };
  } };

  feladatok.keplet = { nev: 'Megoldóképlet', general() {
    const t = R(0, 9); let a, b, c;
    if (t <= 3) { const [r1, r2] = M10.kulonbozo(2, -10, 10); [a, b, c] = egyutthatok(r1, r2, P([1, 1, 1, -1, 2])); }
    else if (t <= 7) { const r1 = tortGyok(4); let r2; do { r2 = R(0, 1) ? tortGyok(4) : F(R(-6, 6), 1); } while (fv(r2) === fv(r1)); [a, b, c] = egyutthatok(r1, r2, R(0, 4) === 0 ? -1 : 1); if (Math.abs(a) > 30 || Math.abs(c) > 60) return feladatok.keplet.general(); }
    else if (t === 8) { const r = R(0, 1) ? tortGyok(3) : F(R0(-7, 7), 1); [a, b, c] = egyutthatok(r, r); }
    else { a = P([1, 2, 3, -1]); b = R(-6, 6); c = (a > 0 ? 1 : -1) * R(Math.ceil((b * b + 1) / (4 * Math.abs(a))), 15); }
    const K = keplet(a, b, c);
    return { kerdes: KERD + T`\[${q2(a, b, c)}=0\]`, valasz: K.gyokok.length ? { ertekek: K.gyokok } : { nincs: true }, formatum: FMT10.halmaz,
      tipp: T`\(ax^2+bx+c=0\Rightarrow x_{1,2}=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}\). Először a diszkriminánst (\(D=b^2-4ac\)) számold ki!`,
      megoldas: K.lep, _ell: w => w === 'nincs' ? K.D < 0 : egy(a * w * w + b * w + c, 0) };
  } };

  feladatok.rendez = { nev: 'Rendezés után megoldóképlettel', general() {
    // cél: A x² + B x + C = 0 szép gyökökkel; kirakva (p1 x + q1)(p2 x + q2) [+ (p3x+q3)(p4x+q4)] = d x + e
    const r1 = R(0, 2) ? F(R(-8, 8), 1) : tortGyok(3); let r2; do { r2 = R(0, 1) ? F(R(-8, 8), 1) : tortGyok(3); } while (fv(r2) === fv(r1));
    const [A, B, C] = egyutthatok(r1, r2);
    const ket = R(0, 2) === 0;
    let p1, q1, p2, q2_, p3 = 0, q3 = 0, p4 = 0, q4 = 0, g = 0;
    for (; g < 200; g++) {
      p1 = R0(-3, 3); p2 = R0(-3, 3); q1 = R0(-7, 7); q2_ = R0(-7, 7);
      if (ket) { p3 = R0(-3, 3); p4 = R0(-3, 3); q3 = R0(-7, 7); q4 = R0(-7, 7); }
      if (p1 * p2 + p3 * p4 === A) break;
    }
    if (g >= 200) return feladatok.rendez.general();
    const Lx = p1 * q2_ + q1 * p2 + p3 * q4 + q3 * p4, L0 = q1 * q2_ + q3 * q4;
    const d = Lx - B, e = L0 - C;
    const szT = (p, q) => T`\left(${l1(p, q)}\right)`;
    const bal = szT(p1, q1) + T`\cdot ` + szT(p2, q2_) + (ket ? '+' + szT(p3, q3) + T`\cdot ` + szT(p4, q4) : '');
    const jobb = l1(d, e);
    const f = x => (p1 * x + q1) * (p2 * x + q2_) + (ket ? (p3 * x + q3) * (p4 * x + q4) : 0) - (d * x + e);
    const K = keplet(A, B, C);
    return { kerdes: KERD + T`\[${bal}=${jobb}\]`, valasz: { ertekek: K.gyokok }, formatum: FMT10.halmaz,
      tipp: 'Bontsd fel a zárójeleket, vonj össze, és rendezd az egyenletet ax² + bx + c = 0 alakra. Utána jöhet a megoldóképlet.',
      megoldas: [T`Kibontva a bal oldal: \(${q2(A, Lx, L0)}\).`, T`Rendezve: \(${q2(A, B, C)}=0\).`, ...K.lep.slice(1)],
      _ell: w => egy(f(w), 0) };
  } };

  feladatok.kerek = { nev: 'Irracionális gyökök (kerekítve)', general() {
    let a, b, c, D;
    do { a = P([1, 1, 2, 3, -1, -2]); b = R(-9, 9); c = R(-9, 9); D = b * b - 4 * a * c; } while (D <= 0 || M10.negyzet(D) || c === 0);
    const K = keplet(a, b, c);
    const gyk = K.gyokok.map(x => +x.toFixed(2));
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! A gyököket két tizedesjegyre kerekítve add meg, pontosvesszővel elválasztva.</p>\[${q2(a, b, c)}=0\]`,
      valasz: { ertekek: gyk, tol: 0.006, forma: 'tizedes' }, formatum: FMT10.kerek,
      tipp: T`A diszkrimináns nem négyzetszám, ezért a gyökök irracionálisak. Számold ki \(\sqrt{D}\)-t számológéppel, és csak a végén kerekíts!`,
      megoldas: [...K.lep, T`Kerekítve: \(x_1\approx ${nt(gyk[1])}\), \(x_2\approx ${nt(gyk[0])}\).`],
      _ell: w => K.gyokok.some(x => Math.abs(x - w) <= 0.0051) };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'mkeplet',
    cim: 'A másodfokú egyenlet megoldóképlete',
    rovid: 'Megoldóképlet',
    bevezeto: T`Az \(ax^2+bx+c=0\) egyenlet minden esetben megoldható a megoldóképlettel – de a hiányos egyenleteknél és a szorzat alakban adott egyenleteknél gyorsabb, ha nem azt használjuk.`,
    elmelet: T`<div class="tbl"><table><tr><th>Egyenlet</th><th>Módszer</th><th>Példa</th></tr>
<tr><td>\(ax^2+c=0\)</td><td>\(x^2=-\frac{c}{a}\), gyökvonás</td><td>\(3x^2=27\Rightarrow x=\pm3\)</td></tr>
<tr><td>\(ax^2+bx=0\)</td><td>kiemelés: \(x(ax+b)=0\)</td><td>\(x^2-5x=0\Rightarrow x=0;\ 5\)</td></tr>
<tr><td>\(a(x-p)(x-q)=0\)</td><td>szorzat = 0, ha egyik tényező 0</td><td>\(x=p\) vagy \(x=q\)</td></tr>
<tr><td>\((mx+n)^2=k\)</td><td>\(mx+n=\pm\sqrt{k}\)</td><td>\((x-5)^2=121\Rightarrow x=16;\ -6\)</td></tr>
<tr><td>\(ax^2+bx+c=0\)</td><td>teljes négyzet vagy megoldóképlet</td><td>lásd lent</td></tr></table></div>
<div class="mathbox">\[ax^2+bx+c=0\ (a\neq0)\quad\Longrightarrow\quad x_{1,2}=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\]</div>
<div class="prose"><ul>
<li>Először mindig <b>rendezz</b>: egyik oldalon 0, a másikon \(ax^2+bx+c\).</li>
<li>A \(D=b^2-4ac\) a <b>diszkrimináns</b>: \(D>0\): két gyök, \(D=0\): egy (kettős) gyök, \(D<0\): nincs valós gyök.</li>
<li>Negatív szám behelyettesítésekor használj zárójelet: \(b=-3\) esetén \(b^2=(-3)^2=9\), és \(-b=3\).</li>
<li>Ha minden együttható osztható ugyanazzal a számmal, egyszerűsíts előbb: \(2x^2-20x+50=0\Rightarrow x^2-10x+25=0\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`Az \(x^2=16\) egyenlet egyetlen megoldása \(x=4\).`, igaz: false, miert: T`\((-4)^2=16\) is igaz, tehát \(x=\pm4\).` },
      { allitas: T`Az \(x^2-5x=0\) egyenletet \(x\)-szel osztva \(x=5\) adódik, és ez az összes megoldás.`, igaz: false, miert: T`Az osztással elveszett az \(x=0\) gyök. Helyesen: \(x(x-5)=0\Rightarrow x=0\) vagy \(x=5\).` },
      { allitas: T`Az \(x^2+9=0\) egyenletnek nincs valós megoldása.`, igaz: true, miert: T`\(x^2=-9\), de valós szám négyzete nem negatív.` },
      { allitas: T`A \(-2x^2+x+1=0\) egyenletben \(a=-2\), \(b=1\), \(c=1\).`, igaz: true, miert: T`Az együtthatók az előjelükkel együtt értendők.` },
      { allitas: T`Az \(x^2-6x+9=0\) egyenletnek két különböző valós gyöke van.`, igaz: false, miert: T`\(x^2-6x+9=(x-3)^2\), így \(D=0\): egyetlen (kettős) gyök, \(x=3\).` },
      { allitas: T`Ha \((x-3)(x+2)=6\), akkor \(x-3=6\) vagy \(x+2=6\).`, igaz: false, miert: T`A „szorzat = 0” szabály csak akkor használható, ha a jobb oldal 0. Itt rendezni kell: \(x^2-x-12=0\).` },
      { allitas: T`A megoldóképletben a gyök alatt \(b^2-4ac\) áll.`, igaz: true, miert: T`\(x_{1,2}=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\).` },
      { allitas: T`\((x+1)^2=4\) esetén \(x+1=2\), tehát \(x=1\) az egyetlen megoldás.`, igaz: false, miert: T`\(x+1=-2\) is lehet, így \(x=-3\) is megoldás.` },
      { general() { const r = R(2, 12), a = P([1, 2, 3]); return { allitas: T`\(${a === 1 ? '' : a}x^2=${a * r * r}\): az egyenlet megoldásai \(${r}\) és \(${-r}\).`, igaz: true, miert: T`\(x^2=${r * r}\Rightarrow x=\pm${r}\).` }; } },
      { general() { const [p, q] = M10.kulonbozo(2, -7, 7); const jo = R(0, 1) === 1; return { allitas: T`Az \(${tenyezo(p)}${tenyezo(q)}=0\) egyenlet megoldásai: \(${jo ? p : -p}\) és \(${jo ? q : -q}\).`, igaz: jo || (p === 0 && q === 0), miert: T`A tényezők akkor 0-k, ha \(x=${p}\), illetve \(x=${q}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Oldjuk meg: \(-4x^2+x=-3\)`,
      lepesek: [
        T`Rendezés: \(-4x^2+x+3=0\). Az együtthatók: \(a=-4\), \(b=1\), \(c=3\).`,
        T`Diszkrimináns: \(D=1^2-4\cdot(-4)\cdot3=1+48=49\).`,
        T`\[x_{1,2}=\frac{-1\pm\sqrt{49}}{2\cdot(-4)}=\frac{-1\pm7}{-8}\]`,
        T`\(x_1=\frac{6}{-8}=-\frac34\), \(x_2=\frac{-8}{-8}=1\).`,
        T`Ellenőrzés \(x=1\)-re: \(-4+1=-3\). ✓`
      ]
    },
    feladatok
  }));
})();
