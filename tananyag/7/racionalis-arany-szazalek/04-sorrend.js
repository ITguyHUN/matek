/*
 * 4. fejezet – Műveleti sorrend, emeletes törtek
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK 2. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fsub, fmul, fdiv, fp, fmix, fmixp, ntp, fplain, fmixplain, finDen, primeF, decParts, decTex, decLong, sf, tbl, randRat, showRat, decApprox, smallFrac, cssv, setupCanvas, FMTLINE, $, esc } = M7;
  const FMT = M7.FMT7;
  const G = {};

  G.sorrend = { ch: 'sorr', name: 'Műveleti sorrend', make() {
    const a = smallFrac(6), b = smallFrac(6), c = smallFrac(6); const op1 = P(['+', '-']); const mul = R(0, 1) === 1;
    const bc = mul ? fmul(b, c) : fdiv(b, c); const res = op1 === '+' ? fadd(a, bc) : fsub(a, bc);
    const lr = mul ? fmul(op1 === '+' ? fadd(a, b) : fsub(a, b), c) : fdiv(op1 === '+' ? fadd(a, b) : fsub(a, b), c);
    return { q: T`<p>Számítsd ki! Figyelj a műveleti sorrendre!</p>\[${ft(a)}${op1}${fp(b)}${mul ? T`\cdot` : ':'}${fp(c)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'A szorzás és az osztás megelőzi az összeadást és a kivonást!',
      sol: [T`Először ${mul ? 'a szorzás' : 'az osztás'}: \(${fp(b)}${mul ? T`\cdot` : ':'}${fp(c)}=${ft(bc)}\).`, T`Utána: \(${ft(a)}${op1}${fp(bc)}=${ft(res)}\).`,
        T`(Ha balról jobbra haladtunk volna, hibásan \(${ft(lr)}\) jönne ki.)`] };
  } };

  G.zarojel = { ch: 'sorr', name: 'Zárójelek', make() {
    const a = smallFrac(6), b = smallFrac(6); let c = smallFrac(8); const op = P(['+', '-']); const mul = R(0, 1) === 1;
    const s = op === '+' ? fadd(a, b) : fsub(a, b); if (s.n === 0) return G.zarojel.make();
    const res = mul ? fmul(s, c) : fdiv(s, c);
    const sol = [T`Először a zárójel: \(${ft(a)}${op}${fp(b)}=${ft(s)}\).`, T`Utána: \(${fp(s)}${mul ? T`\cdot` : ':'}${fp(c)}=${ft(res)}\).`];
    if (mul) sol.push(T`Zárójelfelbontással is mehet: \(${fp(a)}\cdot ${fp(c)}${op}${fp(b)}\cdot ${fp(c)}=${ft(fmul(a, c))}${op}${fp(fmul(b, c))}=${ft(res)}\).`);
    return { q: T`<p>Számítsd ki!</p>\[\left(${ft(a)}${op}${fp(b)}\right)${mul ? T`\cdot` : ':'}${fp(c)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'A zárójelben lévő műveletet végezd el először! Szorzásnál a zárójelet fel is bonthatod.', sol };
  } };

  G.emeletes = { ch: 'sorr', name: 'Emeletes tört', make() {
    const t = R(0, 2); let tex, res, sol;
    if (t === 0) { const a = smallFrac(9), b = smallFrac(9); res = fdiv(a, b); tex = T`\dfrac{\;${ft(a)}\;}{\;${ft(b)}\;}`;
      sol = [T`A főtörtvonal osztást jelent: \(${fp(a)}:${fp(b)}\).`, T`\[${fp(a)}\cdot ${fp(F(b.d, b.n))}=${ft(res)}\]`]; }
    else if (t === 1) { const n = R(2, 6), m = R(2, 6); const inner = fadd(F(1), F(1, n)); res = fadd(F(1), fdiv(F(1), inner));
      tex = T`1+\dfrac{1}{1+\dfrac{1}{${n}}}`;
      sol = [T`Belülről kifelé haladunk: \(1+\frac{1}{${n}}=${ft(inner)}\).`, T`\(\dfrac{1}{${ft(inner)}}=${ft(F(inner.d, inner.n))}\) (reciprok).`, T`\[1+${ft(F(inner.d, inner.n))}=${ft(res)}\]`]; }
    else { const a = smallFrac(6), b = smallFrac(6), c = R(2, 9) * P([1, -1]); const num = fadd(a, b); if (num.n === 0) return G.emeletes.make(); res = fdiv(num, F(c));
      tex = T`\dfrac{${ft(a)}+${fp(b)}}{${c}}`;
      sol = [T`Előbb a számlálót számoljuk ki: \(${ft(a)}+${fp(b)}=${ft(num)}\).`, T`Majd osztunk a nevezővel: \(${fp(num)}:${c < 0 ? '(' + c + ')' : c}=${ft(res)}\).`]; }
    return { q: T`<p>Számítsd ki az emeletes tört értékét!</p>\[${tex}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'A főtörtvonal (a leghosszabb, az egyenlőségjellel egy magasságban lévő) határozza meg a sorrendet: a fölötte lévő számot osztjuk az alatta lévővel.', sol };
  } };

  G.tortresz = { ch: 'sorr', name: 'Törtrészek (szöveges)', make() {
    if (R(0, 1) === 0) { const p = F(...P([[2, 5], [1, 3], [3, 8], [1, 4], [2, 7], [3, 10]])); const q = F(...P([[1, 3], [1, 2], [1, 4], [2, 3], [3, 5]]));
      let N = p.d * q.d * R(2, 8); const first = N * p.n / p.d, rem = N - first, second = rem * q.n / q.d, left = rem - second;
      return { q: T`<p>Egy ${N} oldalas könyvnek első nap a \(${ft(p)}\) részét olvasta el Dóri, második nap a <b>maradék</b> \(${ft(q)}\) részét. Hány oldal van még hátra?</p>`,
        ans: { vals: [left], int: true }, ansText: String(left), fmt: 'egész szám (oldal)', hint: 'Figyelj: a második nap a MARADÉK részét olvasta, nem az egész könyvét!',
        sol: [T`1. nap: \(${N}\cdot ${ft(p)}=${first}\) oldal, maradt \(${N}-${first}=${rem}\).`, T`2. nap: \(${rem}\cdot ${ft(q)}=${second}\) oldal, maradt \(${rem}-${second}=${left}\).`, `Hátra van: <b>${left}</b> oldal.`] }; }
    const p = F(...P([[3, 8], [2, 5], [5, 9], [3, 7], [1, 4], [2, 3]])); const rest = F(p.d - p.n, p.d); const km = rest.n * R(2, 9); const tot = km * p.d / rest.n;
    return { q: T`<p>Egy túraútvonal \(${ft(p)}\) részét már megtettük, még ${km} km van hátra. Milyen hosszú az egész útvonal?</p>`,
      ans: { vals: [tot] }, ansText: String(tot), fmt: 'szám (km)', hint: T`Ha \(${ft(p)}\) részét megtettük, a hátralévő rész az egész hányad része?`,
      sol: [T`Hátra van: \(1-${ft(p)}=${ft(rest)}\) rész.`, T`\(${ft(rest)}\) rész = ${km} km, tehát \(\frac{1}{${rest.d}}\) rész = \(${km}:${rest.n}=${km / rest.n}\) km.`, T`Az egész: \(${km / rest.n}\cdot ${rest.d}=${tot}\) km.`] };
  } };

  /* ---- Bővítés (2026. november): további feladattípusok ---- */

  G.egeszKif = { ch: 'sorr', name: 'Műveleti sorrend egész számokkal', make() {
    const t = R(0, 3); let tex, v, sol;
    const a = R(-12, 12) || 5, b = R(-9, 9) || -4, c = R(-9, 9) || 3, d = R(2, 6);
    if (t === 0) { v = a - b * c; tex = T`${a}-${b < 0 ? `(${b})` : b}\cdot ${c < 0 ? `(${c})` : c}`; sol = [T`Először a szorzás: \(${b < 0 ? `(${b})` : b}\cdot ${c < 0 ? `(${c})` : c}=${b * c}\).`, T`\(${a}-${b * c < 0 ? `(${b * c})` : b * c}=${v}\)`]; }
    else if (t === 1) { v = (a - b) * c; tex = T`(${a}-${b < 0 ? `(${b})` : b})\cdot ${c < 0 ? `(${c})` : c}`; sol = [T`Zárójel: \(${a}-${b < 0 ? `(${b})` : b}=${a - b}\).`, T`\(${a - b}\cdot ${c < 0 ? `(${c})` : c}=${v}\)`]; }
    else if (t === 2) { const q = R(-6, 6) || 2; const big2 = q * d; v = big2 / d + a * 2; tex = T`${big2 < 0 ? `(${big2})` : big2}:${d}+${a < 0 ? `(${a})` : a}\cdot 2`; sol = [T`Osztás és szorzás előbb: \(${big2 < 0 ? `(${big2})` : big2}:${d}=${q}\), \(${a < 0 ? `(${a})` : a}\cdot2=${2 * a}\).`, T`\(${q}+${2 * a < 0 ? `(${2 * a})` : 2 * a}=${v}\)`]; }
    else { const e = R(1, 4); v = a - (b - (c + e)) * 2; tex = T`${a}-\left[${b}-(${c}+${e})\right]\cdot2`; sol = [T`Belülről kifelé: \(${c}+${e}=${c + e}\), majd \(${b}-${c + e < 0 ? `(${c + e})` : c + e}=${b - c - e}\).`, T`\(${b - c - e < 0 ? `(${b - c - e})` : b - c - e}\cdot2=${2 * (b - c - e)}\), végül \(${a}-${2 * (b - c - e) < 0 ? `(${2 * (b - c - e)})` : 2 * (b - c - e)}=${v}\).`]; }
    return { q: T`<p>Számítsd ki!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: hu(v), fmt: 'egész szám',
      hint: 'Sorrend: zárójel → szorzás, osztás (balról jobbra) → összeadás, kivonás (balról jobbra). Figyelj az előjelekre!', sol };
  } };

  G.tizedesSorrend = { ch: 'sorr', name: 'Műveleti sorrend tizedes törtekkel', make() {
    const a = R(1, 40) / 10, b = R(1, 9) / 10 * P([1, 10]), c = P([2, 4, 5, 0.5, 0.2, 2.5]); const t = R(0, 2); let tex, v, sol;
    if (t === 0) { v = +(a + b * c).toFixed(6); tex = T`${nt(a)}+${nt(b)}\cdot ${nt(c)}`; sol = [T`\(${nt(b)}\cdot ${nt(c)}=${nt(+(b * c).toFixed(6))}\)`, T`\(${nt(a)}+${nt(+(b * c).toFixed(6))}=${nt(v)}\)`]; }
    else if (t === 1) { v = +((a + b) * c).toFixed(6); tex = T`(${nt(a)}+${nt(b)})\cdot ${nt(c)}`; sol = [T`\(${nt(a)}+${nt(b)}=${nt(+(a + b).toFixed(6))}\)`, T`\(${nt(+(a + b).toFixed(6))}\cdot ${nt(c)}=${nt(v)}\)`]; }
    else { v = +(a - b / c).toFixed(6); tex = T`${nt(a)}-${nt(b)}:${nt(c)}`; sol = [T`\(${nt(b)}:${nt(c)}=${nt(+(b / c).toFixed(6))}\)`, T`\(${nt(a)}-${nt(+(b / c).toFixed(6))}=${nt(v)}\)`]; }
    return { q: T`<p>Számítsd ki!</p>\[${tex}\]`, ans: { vals: [v] }, ansText: hu(v), fmt: 'szám',
      hint: 'A szorzás és az osztás megelőzi az összeadást és a kivonást – tizedes törteknél is!', sol };
  } };

  G.egeszResz = { ch: 'sorr', name: 'Az egész kiszámítása a részből', make() {
    const f = F(...P([[2, 3], [3, 4], [2, 5], [3, 5], [4, 7], [5, 8], [3, 10], [5, 6], [7, 9], [1, 6], [3, 8]])); const k = R(2, 15);
    const c = R(0, 2); const mult = c === 1 ? 100 : 1; const part = f.n * k * mult, whole = f.d * k * mult, unit = k * mult;
    const q = [T`<p>Egy évfolyam tanulóinak \(${ft(f)}\) része, ${part} tanuló jár úszni. Hány tanuló jár az évfolyamra?</p>`,
      T`<p>Dóri a zsebpénzének \(${ft(f)}\) részét, ${big(part)} Ft-ot könyvre költötte. Mennyi volt a zsebpénze?</p>`,
      T`<p>Egy túraútvonal \(${ft(f)}\) részét, ${part} km-t már megtettük. Milyen hosszú az egész útvonal?</p>`][c];
    const u = ['fő', 'Ft', 'km'][c];
    return { q, ans: { vals: [whole] }, ansText: String(whole), fmt: `szám (${u})`,
      hint: T`Ha \(${ft(f)}\) rész ismert, előbb számold ki az \(\frac{1}{${f.d}}\) részt, utána az egészet!`,
      sol: [T`\(${ft(f)}\) rész \(=${bigT(part)}\)`, T`\(\frac{1}{${f.d}}\) rész \(=${bigT(part)}:${f.n}=${bigT(unit)}\)`, T`Az egész: \(${bigT(unit)}\cdot ${f.d}=${bigT(whole)}\) ${u}.`, T`Röviden: \(${bigT(part)}:${ft(f)}=${bigT(whole)}\).`] };
  } };

  G.hanyadResz = { ch: 'sorr', name: 'Hányad része?', make() {
    const b = R(6, 96), a = R(2, b - 1); const f = F(a, b);
    const c = R(0, 2);
    const q = [T`<p>Ha az egész ${b}, akkor a(z) ${a} hányad része az egésznek? Egyszerűsített törtként add meg!</p>`,
      T`<p>Egy ${b} fős évfolyamon ${a} tanuló szemüveges. Az évfolyam hányad része szemüveges? (Egyszerűsített tört)</p>`,
      T`<p>Egy ${b} oldalas könyvből ${a} oldalt már elolvastam. A könyv hányad részét olvastam el? (Egyszerűsített tört)</p>`][c];
    return { q, ans: { vals: [fv(f)], form: 'frac' }, ansText: fplain(f), fmt: FMT.fs,
      hint: 'A részt osztd el az egésszel, és egyszerűsíts!', sol: [T`\(\frac{${a}}{${b}}${f.d !== b ? '=' + ft(f) : ''}\)${f.d !== b ? ` (egyszerűsítve ${gcd(a, b)}-vel)` : ' – ez már nem egyszerűsíthető.'}`] };
  } };

  G.zsebpenz = { ch: 'sorr', name: 'Több lépéses törtrész', make() {
    const p = F(...P([[1, 4], [1, 3], [2, 5], [1, 5], [3, 10]])); const q = F(...P([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]));
    const unit = p.d * q.d * R(1, 6) * P([100, 200, 500]); const s1 = unit * p.n / p.d, r1 = unit - s1, s2 = r1 * q.n / q.d, left = r1 - s2;
    const ask = R(0, 2);
    const qs = ['Mennyi pénze maradt?', 'Mennyit költött összesen?', 'A zsebpénze hányad része maradt meg?'];
    const vals = [left, s1 + s2, left / unit];
    return { q: T`<p>Gergő a ${big(unit)} Ft-os zsebpénzének \(${ft(p)}\) részét moziba vitte, a <b>maradék</b> \(${ft(q)}\) részét pedig ajándékra költötte. ${qs[ask]}</p>`,
      ans: ask === 2 ? { vals: [vals[2]], form: 'frac' } : { vals: [vals[ask]] }, ansText: ask === 2 ? fplain(F(left, unit)) : String(vals[ask]), fmt: ask === 2 ? FMT.fs : 'szám (Ft)',
      hint: 'Figyelj: a második törtrész a MARADÉKRA vonatkozik, nem az egész zsebpénzre!',
      sol: [T`Mozi: \(${bigT(unit)}\cdot ${ft(p)}=${bigT(s1)}\) Ft, maradt \(${bigT(r1)}\) Ft.`, T`Ajándék: \(${bigT(r1)}\cdot ${ft(q)}=${bigT(s2)}\) Ft, maradt \(${bigT(left)}\) Ft.`,
        [T`Maradt: <b>${big(left)} Ft</b>.`, T`Összesen elköltött: \(${bigT(s1)}+${bigT(s2)}=${bigT(s1 + s2)}\) Ft.`, T`Maradt \(\frac{${left}}{${unit}}=${ft(F(left, unit))}\) rész. (Másképp: \(\left(1-${ft(p)}\right)\cdot\left(1-${ft(q)}\right)=${ft(F(left, unit))}\).)`][ask]] };
  } };

  Tananyag.fejezet({
    id: 'sorr',
    cim: 'Műveleti sorrend, emeletes törtek',
    rovid: 'Sorrend',
    bevezeto: T`Mit számoljunk előbb? Zárójel, szorzás-osztás, összeadás-kivonás – és az emeletes törtek főtörtvonala.`,
    elmelet: T`<div class="prose"><p><b>A műveletek sorrendje:</b></p><ol>
<li>zárójelben lévő műveletek (belülről kifelé),</li><li>szorzás és osztás (balról jobbra),</li><li>összeadás és kivonás (balról jobbra).</li></ol>
<p><b>Zárójelfelbontás</b> (összeg szorzása): a zárójel minden tagját megszorozzuk.</p></div>
<div class="mathbox">\[a\cdot(b+c)=a\cdot b+a\cdot c\qquad (b+c):a=b:a+c:a\qquad\text{de}\quad a:(b+c)\ne a:b+a:c\]</div>
<div class="prose"><p>Néha így kevesebb a számolás: \(\frac23\cdot\left(\frac32-\frac34\right)=1-\frac12=\frac12\).</p>
<p><b>Emeletes tört:</b> a <b>főtörtvonal</b> (a leghosszabb, az egyenlőségjellel egy magasságban) határozza meg a sorrendet: a fölötte lévő kifejezést osztjuk az alatta lévővel.</p></div>
<div class="mathbox">\[\frac{\;\frac12\;}{3}=\frac12:3=\frac16\qquad\qquad \frac{1}{\;\frac23\;}=1:\frac23=\frac32\]</div>
<div class="prose"><p><b>Törtrész a maradékból:</b> ha valaminek előbb a \(\frac25\) részét, utána a <i>maradék</i> \(\frac13\) részét vesszük el, a második törtrész már nem az egészre, hanem a maradékra vonatkozik.</p></div>
<div class="prose"><p><b>Az egész kiszámítása:</b> ha egy mennyiség \(\frac35\) része 24, akkor \(\frac15\) része \(24:3=8\), az egész \(8\cdot5=40\). Röviden: \(24:\frac35=40\).</p>
<p><b>Hányad része?</b> A részt osztjuk az egésszel: 18 a 45-nek \(\frac{18}{45}=\frac25\) része.</p>
<p><b>Egész számokkal is</b> ugyanaz a sorrend: \(-6-4\cdot(-3)=-6+12=6\), de \((-6-4)\cdot(-3)=30\).</p></div>`,
    igazHamis: [
      { allitas: T`\(2+3\cdot4=20\)`, igaz: false, miert: T`A szorzás az első: \(2+12=14\).` },
      { allitas: T`\((1:2):3=1:(2:3)\)`, igaz: false, miert: T`Bal oldal: \(\frac12:3=\frac16\); jobb oldal: \(1:\frac23=\frac32\). Osztásnál a zárójelezés számít!` },
      { allitas: T`\(\frac23\cdot\left(\frac34-\frac32\right)=\frac23\cdot\frac34-\frac23\cdot\frac32\)`, igaz: true, miert: T`Ez a zárójelfelbontás: a szorzó a zárójel minden tagjára vonatkozik.` },
      { allitas: T`\(6:(2+1)=6:2+6:1\)`, igaz: false, miert: T`Bal oldal: \(6:3=2\); jobb oldal: \(3+6=9\). Összeggel osztva nem lehet tagonként osztani.` },
      { allitas: T`\(\dfrac{\frac12}{3}=\dfrac{1}{\frac23}\)`, igaz: false, miert: T`A főtörtvonal dönt: bal oldal \(\frac12:3=\frac16\), jobb oldal \(1:\frac23=\frac32\).` },
      { allitas: T`\(10-2\cdot3=24\)`, igaz: false, miert: T`A szorzás az első: \(10-6=4\). A 24 a \((10-2)\cdot3\) lenne.` },
      { allitas: T`\((-2)\cdot(-3)+(-4)=2\)`, igaz: true, miert: T`\((-2)\cdot(-3)=6\), és \(6+(-4)=2\).` },
      { allitas: T`\(24:4:2=12\)`, igaz: false, miert: T`Az osztásokat balról jobbra végezzük: \(24:4=6\), \(6:2=3\). A 12 a \(24:(4:2)\) lenne.` },
      { allitas: T`Ha egy szám \(\frac23\) része 12, akkor a szám 18.`, igaz: true, miert: T`\(\frac13\) része 6, az egész \(3\cdot6=18\).` },
      { allitas: T`Ha elköltjük a pénzünk felét, majd a maradék felét, akkor az egész pénzünk elfogy.`, igaz: false, miert: T`A második fél a maradékból számolódik: \(\frac12\cdot\frac12=\frac14\) rész megmarad.` },
      { general() { const a = R(2, 9), b = R(2, 9), c = R(2, 9); const ok = R(0, 1) === 1; const v = ok ? a + b * c : (a + b) * c; return { allitas: T`\(${a}+${b}\cdot ${c}=${v}\)`, igaz: v === a + b * c, miert: T`Előbb a szorzás: \(${a}+${b * c}=${a + b * c}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki: \(\left(\frac34-\frac12\right)\cdot\left(-\frac45\right)+\frac15\)`,
      lepesek: [
        T`Zárójel: \(\frac34-\frac12=\frac34-\frac24=\frac14\).`,
        T`Szorzás: \(\frac14\cdot\left(-\frac45\right)=-\frac{4}{20}=-\frac15\).`,
        T`Összeadás: \(-\frac15+\frac15=0\).`,
        T`Másik út zárójelfelbontással: \(\frac34\cdot\left(-\frac45\right)-\frac12\cdot\left(-\frac45\right)=-\frac35+\frac25=-\frac15\), majd \(+\frac15\) → \(0\). ✔`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
