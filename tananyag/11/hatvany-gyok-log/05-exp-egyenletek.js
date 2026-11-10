/*
 * 5. fejezet – Exponenciális egyenletek
 * Témakör: Hatvány, gyök, logaritmus (11. évfolyam)
 * A fájl szerkezetét lásd: tananyag/README.md
 */
(function () {
  const feladatok = {};

  feladatok.expA = { nev: 'A) Közös alap', general() {
    const p = P([2, 3, 5]); const maxI = p === 2 ? 4 : p === 3 ? 3 : 2; let tex, x, sol;
    if (R(0, 1) === 0) { const i = R(1, maxI); let r; do { r = R(-3, 5); } while (r === 0 || p ** Math.abs(r) > 243);
      const right = r > 0 ? String(p ** r) : T`\frac{1}{${p ** (-r)}}`; x = F(r, i);
      tex = T`${p ** i}^{x}=${right}`; sol = [T`\[${p}^{${yk(i).replace('y', 'x')}}=${p}^{${r}}\]`, T`\[${yk(i).replace('y', 'x')}=${r}\quad\Rightarrow\quad x=${ft(x)}\]`]; }
    else { const top = p === 5 ? 2 : 3; const i = R(1, top); let j = R(1, top); while (j === i) j = R(1, top); const s = R(-2, 3), t = R(-2, 3);
      x = F(j * t - i * s, i - j);
      tex = T`${p ** i}^{${xs(s)}}=${p ** j}^{${xs(t)}}`;
      sol = [T`\[${p}^{${mulX(i, xs(s))}}=${p}^{${mulX(j, xs(t))}}\]`, T`\[${mulX(i, xs(s))}=${mulX(j, xs(t))}\quad\Rightarrow\quad x=${ft(x)}\]`]; }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${tex}\]`, valasz: { ertekek: [fv(x)] }, formatum: FMT.frac,
      tipp: T`Írd fel mindkét oldalt \(${p}\) hatványaként. Ha \(a^{A}=a^{B}\), akkor \(A=B\).`, megoldas: sol };
  } };

  feladatok.expB = { nev: 'B) Kiemelés', general() {
    const p = P([2, 2, 3, 3, 5]); const pool = p === 5 ? [-1, 0, 1, 2] : [-2, -1, 0, 1, 2, 3];
    const db = R(0, 2) === 0 ? 3 : 2; const es = []; while (es.length < db) { const e = P(pool); if (!es.includes(e)) es.push(e); } es.sort((a, b) => b - a);
    const cs = es.map((e, i) => i === 0 ? P([1, 1, 1, 2, 3]) : P([1, 1, 2, 3, -1, -1, -2]));
    const m = Math.min(...es); const S = es.reduce((a, e, i) => a + cs[i] * p ** (e - m), 0);
    if (S <= 0) return this.general();
    const t = R(0, p === 5 ? 2 : 3); const x0 = t - m; const Rv = S * p ** t; if (Rv > 3000) return this.general();
    const ex = e => e === 0 ? 'x' : e > 0 ? `x+${e}` : `x-${-e}`;
    const term = (c, e, i) => (i === 0 ? '' : c < 0 ? '-' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c) + '\\cdot ') + T`${p}^{${ex(e)}}`;
    const tex = es.map((e, i) => term(cs[i], e, i)).join('') + '=' + Rv;
    const inner = es.map((e, i) => (i === 0 ? '' : cs[i] < 0 ? '-' : '+') + (Math.abs(cs[i]) === 1 ? '' : Math.abs(cs[i]) + '\\cdot ') + (e - m === 0 ? '1' : e - m === 1 ? p : T`${p}^{${e - m}}`)).join('').replace(/\\cdot 1(?![0-9])/g, '');
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${tex}\]`, valasz: { ertekek: [x0] }, formatum: 'egész szám',
      tipp: T`Emeld ki a legkisebb kitevőjű hatványt, \(${p}^{${ex(m)}}\)-t (pl. \(${p}^{x+1}=${p}\cdot ${p}^{x}\)). Így \(${p}^{${ex(m)}}=\text{szám}\) alakot kapsz.`,
      megoldas: [T`Kiemeljük \(${p}^{${ex(m)}}\)-t:`, T`\[${p}^{${ex(m)}}\left(${inner}\right)=${Rv}\quad\Rightarrow\quad ${S === 1 ? '' : S + '\\cdot '}${p}^{${ex(m)}}=${Rv}\]`,
        T`\[${p}^{${ex(m)}}=${p ** t}=${p}^{${t}}\quad\Rightarrow\quad ${ex(m)}=${t}\quad\Rightarrow\quad x=${x0}\]`] };
  } };

  feladatok.expC = { nev: 'C) Új változó', general() {
    const p = P([2, 2, 3, 3, 5]); const K = p === 5 ? [-1, 0, 1, 2] : p === 3 ? [-1, 0, 1, 2, 3] : [-2, -1, 0, 1, 2, 3, 4];
    const k1 = P(K); const y1 = fpow(F(p), k1); let y2, k2 = null;
    if (R(0, 2) > 0) { do { k2 = P(K); } while (k2 === k1); y2 = fpow(F(p), k2); } else { let r; do { r = R(1, 8); } while (r === fv(y1)); y2 = F(-r); }
    const sum = fadd(y1, y2), prod = F(y1.n * y2.n, y1.d * y2.d);
    const D = sum.d * prod.d / gcd(sum.d, prod.d); const A = D * P([1, 1, 1, 2]);
    const B = -A * sum.n / sum.d, C = A * prod.n / prod.d;
    if (Math.abs(B) > 3000 || Math.abs(C) > 3000 || !Number.isInteger(B) || !Number.isInteger(C)) return this.general();
    const sq = R(0, 2) === 0 ? T`${p}^{2x}` : T`${p * p}^{x}`;
    const tex = T`${A === 1 ? '' : A + '\\cdot '}${sq}${linCoef(-B, T`\cdot ${p}^{x}`).replace(/^([+-])\\cdot /, '$1')}${cst(C)}=0`;
    const yq = T`${A === 1 ? '' : A}y^{2}${linCoef(-B, 'y')}${cst(C)}=0`;
    const sol = [T`Legyen \(y=${p}^{x}>0\). Ekkor \(${sq}=\left(${p}^{x}\right)^{2}=y^{2}\).`, T`\[${yq}\quad\Rightarrow\quad y_1=${ft(y1)},\; y_2=${ft(y2)}\]`];
    const vals = [k1];
    if (k2 === null) sol.push(T`Az \(y_2=${ft(y2)}\) nem lehet, mert \(${p}^{x}\) mindig pozitív.`);
    sol.push(T`\[${p}^{x}=${ft(y1)}\quad\Rightarrow\quad x=${k1}\]`);
    if (k2 !== null) { vals.push(k2); sol.push(T`\[${p}^{x}=${ft(y2)}\quad\Rightarrow\quad x=${k2}\]`); }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket.</p>\[${tex}\]`, valasz: { ertekek: vals }, formatum: FMT.set,
      tipp: T`Vezess be új változót: \(y=${p}^{x}\). Ekkor \(${sq}=y^2\), és másodfokú egyenletet kapsz. Ne feledd: \(y>0\)!`, megoldas: sol };
  } };

  /* plain-text szám a feleletválasztós gombokhoz */
  const fp = f => f.d === 1 ? hu(f.n) : (f.n < 0 ? '−' : '') + Math.abs(f.n) + '/' + f.d;
  const fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);

  feladatok.expAlak = { nev: 'D) Gyökök, szorzatok', general() {
    const p = P([2, 2, 3, 3, 5, 7]); const top = p === 2 ? 3 : 2; const pw = k => k === 1 ? String(p) : String(p ** k);
    const kind = R(0, 3); let tex, x, sol;
    const lin = (a, b) => (a === 1 ? 'x' : a === -1 ? '-x' : a + 'x') + (b === 0 ? '' : b > 0 ? '+' + b : String(b));
    const rhsOf = r => r >= 0 ? (r === 0 ? '1' : pw(r)) : T`\frac{1}{${pw(-r)}}`;
    if (kind === 0) { // A^(x+s) · B^(x+t) = p^r
      const i = R(1, top), j = R(1, top); const s0 = R(-2, 2), t0 = R(-2, 2); const r = R(-2, 4); if (p ** Math.abs(r) > 400) return this.general();
      x = F(r - i * s0 - j * t0, i + j);
      tex = T`${pw(i)}^{${xs(s0)}}\cdot ${pw(j)}^{${xs(t0)}}=${rhsOf(r)}`;
      sol = [T`\[${p}^{${mulX(i, xs(s0))}}\cdot ${p}^{${mulX(j, xs(t0))}}=${p}^{${r}}\]`, T`\[${mulX(i, xs(s0))}+${mulX(j, xs(t0))}=${r}\quad\Rightarrow\quad ${i + j}x${pt(i * s0 + j * t0)}=${r}\quad\Rightarrow\quad x=${ft(x)}\]`]; }
    else if (kind === 1) { // ⁿ√(p^(ax+b)) = p^r
      const n = P([2, 3, 4]); const a = P([1, 2, 3]); const b = R(-3, 3); const r = R(-2, 3); if (p ** Math.abs(r) > 400) return this.general();
      x = F(n * r - b, a);
      tex = T`${n === 2 ? T`\sqrt{${p}^{${lin(a, b)}}}` : T`\sqrt[${n}]{${p}^{${lin(a, b)}}}`}=${rhsOf(r)}`;
      sol = [T`\[${p}^{\frac{${lin(a, b)}}{${n}}}=${p}^{${r}}\quad\Rightarrow\quad \frac{${lin(a, b)}}{${n}}=${r}\]`, T`\[${lin(a, b)}=${n * r}\quad\Rightarrow\quad x=${ft(x)}\]`]; }
    else if (kind === 2) { // p^(x) · √p = p^r · ... ; p^(ax+b) = ᵐ√(p^c)
      const m = P([2, 3]); const c = R(1, 4); if (c % m === 0) return this.general(); const a = P([1, 2, 3]), b = R(-3, 3);
      x = F(c - b * m, a * m);
      tex = T`${p}^{${lin(a, b)}}=${m === 2 ? T`\sqrt{${pw(c)}}` : T`\sqrt[3]{${pw(c)}}`}`;
      sol = [T`\[${p}^{${lin(a, b)}}=${p}^{${ft(F(c, m))}}\quad\Rightarrow\quad ${lin(a, b)}=${ft(F(c, m))}\quad\Rightarrow\quad x=${ft(x)}\]`]; }
    else { // p^(ax+b) / p^(cx+d) = 1/p^r
      const a = R(2, 4), c = R(1, a - 1), b = R(-3, 3), d = R(-3, 3); const r = R(-2, 3); if (p ** Math.abs(r) > 400) return this.general();
      x = F(r - b + d, a - c);
      tex = T`\frac{${pw(1) === String(p) ? p : p}^{${lin(a, b)}}}{${p}^{${lin(c, d)}}}=${rhsOf(r)}`;
      sol = [T`\[${p}^{(${lin(a, b)})-(${lin(c, d)})}=${p}^{${r}}\quad\Rightarrow\quad ${lin(a - c, b - d)}=${r}\quad\Rightarrow\quad x=${ft(x)}\]`]; }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${tex}\]`, valasz: { ertekek: [fv(x)] }, formatum: FMT.frac,
      tipp: T`Írj fel mindent \(${p}\) hatványaként: a gyököt törtkitevővel, a reciprokot negatív kitevővel. Szorzásnál a kitevők összeadódnak, osztásnál kivonódnak.`, megoldas: sol };
  } };

  feladatok.expEgyenlotlen = { nev: 'E) Egyenlőtlenség', general() {
    const p = P([2, 3, 5]); const small = R(0, 2) === 0;
    const baseT = small ? (p === 2 && R(0, 1) ? T`0{,}5` : p === 5 && R(0, 1) ? T`0{,}2` : T`\frac{1}{${p}}`) : String(p);
    const bP = /frac|,/.test(baseT) ? T`\left(${baseT}\right)` : baseT;
    const a = P([1, 2, 3, 4, -1, -2]), q = R(-5, 5); const r = R(-3, 3); if (p ** Math.abs(r) > 125) return this.general();
    // jobb oldal: base^r számként
    const val = small ? fpow(F(1, p), r) : fpow(F(p), r);
    const rels = ['<', '>', '≤', '≥'], relT = { '<': '<', '>': '>', '≤': '\\le ', '≥': '\\ge ' }, flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
    const rel = P(rels); let rel2 = small ? flip[rel] : rel; const B = F(r - q, a); const rel3 = a < 0 ? flip[rel2] : rel2;
    const lin = (a === 1 ? 'x' : a === -1 ? '-x' : a + 'x') + (q === 0 ? '' : q > 0 ? '+' + q : String(q));
    const ok = `x ${rel3} ${fp(B)}`;
    let B2 = F(r + q, a); if (fv(B2) === fv(B)) B2 = fadd(B, F(1));
    const opts = [ok, `x ${flip[rel3]} ${fp(B)}`, `x ${rel3} ${fp(B2)}`, `x ${flip[rel3]} ${fp(B2)}`];
    const ord = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${bP}^{${lin}}${relT[rel]}${ft(val)}\]`, valasz: { valasztas: ord.map(i => opts[i]), helyes: ord.indexOf(0) },
      tipp: T`Írd fel a jobb oldalt is \(${bP}\) hatványaként. ${small ? 'Az alap 0 és 1 közé esik: a függvény csökkenő, ezért a kitevőkre áttérve megfordul a reláció!' : 'Az alap nagyobb 1-nél: a függvény növekvő, a reláció marad.'}${a < 0 ? ' Negatív számmal osztva is megfordul a reláció.' : ''}`,
      megoldas: [T`\[${bP}^{${lin}}${relT[rel]}${bP}^{${r}}\]`, (a === 1 ? T`\[${lin}${relT[rel2]}${r}\quad\Rightarrow\quad x${relT[rel3]}${ft(B)}\]` : T`\[${lin}${relT[rel2]}${r}\quad\Rightarrow\quad ${a === -1 ? '-' : a}x${relT[rel2]}${r - q}\quad\Rightarrow\quad x${relT[rel3]}${ft(B)}\]`)] };
  } };

  feladatok.expRendszer = { nev: 'F) Egyenletrendszer', szint: 'emelt', general() {
    const x0 = R(-1, 3), y0 = R(-1, 3);
    if (R(0, 1) === 0) { // szorzatos
      const p = P([2, 3]); const pw = k => k === 1 ? String(p) : String(p ** k);
      const a1 = R(1, 3), b1 = R(1, 3), a2 = R(1, 3), b2 = R(1, 3); if (a1 * -b2 - b1 * a2 === 0) return this.general();
      const r1 = a1 * x0 + b1 * y0, r2 = a2 * x0 - b2 * y0; if (p ** Math.abs(r1) > 800 || p ** Math.abs(r2) > 800) return this.general();
      const rhs = r => r >= 0 ? String(p ** r) : T`\frac{1}{${p ** -r}}`;
      const det = -a1 * b2 - b1 * a2;
      return { kerdes: T`<p>Oldd meg a valós számpárok halmazán! Add meg \(x+y\) értékét!</p>\[\begin{cases}${pw(a1)}^{x}\cdot ${pw(b1)}^{y}=${rhs(r1)}\\ ${pw(a2)}^{x}:${pw(b2)}^{y}=${rhs(r2)}\end{cases}\]`,
        valasz: { ertekek: [x0 + y0] }, formatum: 'egész szám',
        tipp: T`Írj fel mindent \(${p}\) hatványaként, és tedd egyenlővé a kitevőket: lineáris egyenletrendszert kapsz \(x\)-re és \(y\)-ra.`,
        megoldas: [T`\[\begin{cases}${a1 === 1 ? '' : a1}x+${b1 === 1 ? '' : b1}y=${r1}\\ ${a2 === 1 ? '' : a2}x-${b2 === 1 ? '' : b2}y=${r2}\end{cases}\]`, T`Megoldva: \(x=${x0}\), \(y=${y0}\), így \(x+y=${x0 + y0}\).`] }; }
    // összeges: u = p^x, v = q^y
    const p = P([2, 3]), q = P([2, 3, 5].filter(t => t !== p)); const X = R(0, 4), Y = R(0, 3); const u = p ** X, v = q ** Y; if (u > 81 || v > 125) return this.general();
    const m1 = R(1, 3), n1 = R(1, 3), m2 = R(1, 3), n2 = R(1, 3); if (m1 * -n2 - n1 * m2 === 0) return this.general();
    const c1 = m1 * u + n1 * v, c2 = m2 * u - n2 * v;
    const k = c => c === 1 ? '' : c + '\\cdot ';
    return { kerdes: T`<p>Oldd meg a valós számpárok halmazán! Add meg \(x+y\) értékét!</p>\[\begin{cases}${k(m1)}${p}^{x}+${k(n1)}${q}^{y}=${c1}\\ ${k(m2)}${p}^{x}-${k(n2)}${q}^{y}=${c2}\end{cases}\]`,
      valasz: { ertekek: [X + Y] }, formatum: 'egész szám',
      tipp: T`Legyen \(u=${p}^{x}\) és \(v=${q}^{y}\). Ez lineáris egyenletrendszer \(u\)-ra és \(v\)-re; utána vissza kell helyettesíteni.`,
      megoldas: [T`\[\begin{cases}${m1 === 1 ? '' : m1}u+${n1 === 1 ? '' : n1}v=${c1}\\ ${m2 === 1 ? '' : m2}u-${n2 === 1 ? '' : n2}v=${c2}\end{cases}\quad\Rightarrow\quad u=${u},\ v=${v}\]`,
        T`\[${p}^{x}=${u}\Rightarrow x=${X},\qquad ${q}^{y}=${v}\Rightarrow y=${Y},\qquad x+y=${X + Y}\]`] };
  } };

  Tananyag.fejezet({
    id: 'expegy',
    cim: 'Exponenciális egyenletek',
    rovid: 'Exponenciális egyenletek',
    bevezeto: T`Minden típus célja ugyanaz: elérni az a^(…) = a^(…) alakot. Ha ez nem megy, logaritmus kell (9. fejezet, D típus).`,
    elmelet: T`<div class="tbl"><table><thead><tr><th>Típus</th><th>Felismerés</th><th>Teendő</th></tr></thead><tbody>
<tr><td><b>A) Közös alap</b></td><td>az alapok ugyanannak a számnak a hatványai (2, 4, 8, √2 …)</td><td>mindkét oldalt ugyanannak az alapnak a hatványává alakítod, majd a kitevőket egyenlővé teszed</td></tr>
<tr><td><b>B) Kiemelés</b></td><td>összeg, a kitevők csak konstansban térnek el: \(2^{x+1}+2^x\)</td><td>kiemeled a legkisebb hatványt → \(a^x=\text{szám}\)</td></tr>
<tr><td><b>C) Új változó</b></td><td>\(a^{2x}\) és \(a^x\) is szerepel (pl. \(4^x\) és \(2^x\))</td><td>\(y=a^x\), másodfokú egyenlet; \(y>0\)!</td></tr>
<tr><td><b>D) Azonos kitevő</b></td><td>\(a^x=b^x\)</td><td>osztás: \(\left(\frac ab\right)^x=1\Rightarrow x=0\)</td></tr></tbody></table></div>
<div class="prose"><ul>
<li>\(2^x+2^x=2\cdot 2^x=2^{x+1}\), és <b>nem</b> \(2^{2x}\).</li>
<li>A \(3^x=-9\) egyenletnek nincs megoldása, mert \(3^x>0\).</li>
<li>Új változónál ne felejts visszahelyettesíteni: \(y=4\) még nem a válasz!</li></ul></div>`,
    igazHamis: [
    { allitas: T`\(2^x+2^x=2^{2x}\)`, igaz: false, miert: T`\(2^x+2^x=2\cdot 2^x=2^{x+1}\).` },
    { allitas: T`A \(3^x=-9\) egyenlet megoldása \(x=-2\).`, igaz: false, miert: T`\(3^{-2}=\frac19\). A \(3^x\) mindig pozitív, így nincs megoldás.` },
    { allitas: T`A \(4^x=8\) egyenlet megoldása \(x=\frac32\).`, igaz: true, miert: T`\(2^{2x}=2^3\Rightarrow 2x=3\).` },
    { allitas: T`Ha \(y=2^x\), akkor \(4^x=y^2\).`, igaz: true, miert: T`\(4^x=(2^2)^x=(2^x)^2=y^2\).` },
    { allitas: T`A \(2^{x}=0\) egyenletnek nincs megoldása.`, igaz: true, miert: T`\(2^x>0\) minden valós \(x\)-re.` },
    { allitas: T`A \(9^{x}=27\) egyenlet megoldása \(x=3\).`, igaz: false, miert: T`\(3^{2x}=3^3\Rightarrow x=\frac32\).` },
    { allitas: T`A \(0{,}5^{x}>4\) egyenlőtlenség megoldása \(x<-2\).`, igaz: true, miert: T`\(0{,}5^{x}>0{,}5^{-2}\); az alap 1-nél kisebb, így megfordul a reláció: \(x<-2\).` },
    { allitas: T`\(3^{x+2}=9\cdot 3^{x}\)`, igaz: true, miert: T`\(3^{x+2}=3^{2}\cdot 3^{x}=9\cdot 3^x\).` },
    { allitas: T`Ha \(y=3^x\), akkor \(3^{x+1}=y+1\).`, igaz: false, miert: T`\(3^{x+1}=3\cdot 3^x=3y\).` }
    ],
    mintapelda: {
      feladat: T`Oldd meg: \(4^x-6\cdot 2^x+8=0\)`,
      lepesek: [
      T`Felismerés: \(4^x=(2^x)^2\), tehát C típus. Legyen \(y=2^x>0\).`,
      T`\[y^2-6y+8=0\quad\Rightarrow\quad y_1=2,\ y_2=4\]`,
      T`Mindkét gyök pozitív, egyiket sem kell elvetni.`,
      T`\[2^x=2\Rightarrow x_1=1,\qquad 2^x=4\Rightarrow x_2=2\]`
      ]
    },
    feladatok
  });
})();
