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
    const p = P([2, 3, 5]); let tex, x0, sol;
    if (R(0, 2) > 0) { const a = R(1, 2); const plus = R(0, 1) === 1; const s = plus ? '+' : '-'; const K = plus ? p ** a + 1 : p ** a - 1;
      x0 = R(0, p === 5 ? 2 : 3); const Rv = K * p ** x0;
      tex = T`${p}^{x+${a}}${s}${p}^{x}=${Rv}`;
      sol = [T`\[${p}^{x}\cdot ${p}^{${a}}${s}${p}^{x}=${Rv}\]`, T`\[${p}^{x}\left(${p ** a}${s}1\right)=${Rv}\quad\Rightarrow\quad ${K}\cdot ${p}^{x}=${Rv}\]`, T`\[${p}^{x}=${p ** x0}\quad\Rightarrow\quad x=${x0}\]`]; }
    else { x0 = R(1, p === 5 ? 2 : 3); const Rv = (p * p + 1) * p ** (x0 - 1);
      tex = T`${p}^{x+1}+${p}^{x-1}=${Rv}`;
      sol = [T`Emeljük ki a legkisebb hatványt, \(${p}^{x-1}\)-et:`, T`\[${p}^{x-1}\left(${p}^{2}+1\right)=${Rv}\quad\Rightarrow\quad ${p * p + 1}\cdot ${p}^{x-1}=${Rv}\]`, T`\[${p}^{x-1}=${p ** (x0 - 1)}\quad\Rightarrow\quad x-1=${x0 - 1}\quad\Rightarrow\quad x=${x0}\]`]; }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán!</p>\[${tex}\]`, valasz: { ertekek: [x0] }, formatum: 'egész szám',
      tipp: T`Bontsd szét a hatványt: \(${p}^{x+1}=${p}\cdot ${p}^{x}\). Emeld ki \(${p}^{x}\)-et (vagy a legkisebb hatványt), így \(${p}^{x}=\text{szám}\) alakot kapsz.`, megoldas: sol };
  } };

  feladatok.expC = { nev: 'C) Új változó', general() {
    const p = P([2, 3]); const k1 = R(0, 2); const y1 = p ** k1; let y2, k2 = null;
    if (R(0, 1)) { do { k2 = R(0, 2); } while (k2 === k1); y2 = p ** k2; } else { do { y2 = -R(1, 6); } while (y2 === -y1); }
    const B = y1 + y2, C = y1 * y2;
    const tex = T`${p * p}^{x}${linCoef(B, T`\cdot ${p}^{x}`).replace(/^([+-])\\cdot /, '$1')}${cst(C)}=0`;
    const yq = T`y^{2}${linCoef(B, 'y')}${cst(C)}=0`;
    const sol = [T`Legyen \(y=${p}^{x}>0\). Ekkor \(${p * p}^{x}=\left(${p}^{x}\right)^{2}=y^{2}\).`, T`\[${yq}\quad\Rightarrow\quad y_1=${y1},\; y_2=${y2}\]`];
    const vals = [k1];
    if (y2 < 0) sol.push(T`Az \(y_2=${y2}\) nem lehet, mert \(${p}^{x}\) mindig pozitív.`);
    sol.push(T`\[${p}^{x}=${y1}\quad\Rightarrow\quad x=${k1}\]`);
    if (k2 !== null) { vals.push(k2); sol.push(T`\[${p}^{x}=${y2}\quad\Rightarrow\quad x=${k2}\]`); }
    return { kerdes: T`<p>Oldd meg a valós számok halmazán! Ha több megoldás van, pontosvesszővel válaszd el őket.</p>\[${tex}\]`, valasz: { ertekek: vals }, formatum: FMT.set,
      tipp: T`Vezess be új változót: \(y=${p}^{x}\). Ekkor \(${p * p}^{x}=y^2\), és másodfokú egyenletet kapsz. Ne feledd: \(y>0\)!`, megoldas: sol };
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
    { allitas: T`Ha \(y=2^x\), akkor \(4^x=y^2\).`, igaz: true, miert: T`\(4^x=(2^2)^x=(2^x)^2=y^2\).` }
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
