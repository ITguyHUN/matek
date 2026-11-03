/*
 * 4. fejezet – Műveleti sorrend, emeletes törtek
 * Témakör: Racionális számok, arányosság, százalék (7. évfolyam, TK 2. lecke)
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
    if (mul) sol.push(T`Zárójelfelbontással is mehet: \(${fp(a)}\cdot${fp(c)}${op}${fp(b)}\cdot${fp(c)}=${ft(fmul(a, c))}${op}${fp(fmul(b, c))}=${ft(res)}\).`);
    return { q: T`<p>Számítsd ki!</p>\[\left(${ft(a)}${op}${fp(b)}\right)${mul ? T`\cdot` : ':'}${fp(c)}\]`, ans: { vals: [fv(res)] }, ansText: fplain(res), fmt: FMT.frac,
      hint: 'A zárójelben lévő műveletet végezd el először! Szorzásnál a zárójelet fel is bonthatod.', sol };
  } };

  G.emeletes = { ch: 'sorr', name: 'Emeletes tört', make() {
    const t = R(0, 2); let tex, res, sol;
    if (t === 0) { const a = smallFrac(9), b = smallFrac(9); res = fdiv(a, b); tex = T`\dfrac{\;${ft(a)}\;}{\;${ft(b)}\;}`;
      sol = [T`A főtörtvonal osztást jelent: \(${fp(a)}:${fp(b)}\).`, T`\[${fp(a)}\cdot${fp(F(b.d, b.n))}=${ft(res)}\]`]; }
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
        sol: [T`1. nap: \(${N}\cdot${ft(p)}=${first}\) oldal, maradt \(${N}-${first}=${rem}\).`, T`2. nap: \(${rem}\cdot${ft(q)}=${second}\) oldal, maradt \(${rem}-${second}=${left}\).`, `Hátra van: <b>${left}</b> oldal.`] }; }
    const p = F(...P([[3, 8], [2, 5], [5, 9], [3, 7], [1, 4], [2, 3]])); const rest = F(p.d - p.n, p.d); const km = rest.n * R(2, 9); const tot = km * p.d / rest.n;
    return { q: T`<p>Egy túraútvonal \(${ft(p)}\) részét már megtettük, még ${km} km van hátra. Milyen hosszú az egész útvonal?</p>`,
      ans: { vals: [tot] }, ansText: String(tot), fmt: 'szám (km)', hint: T`Ha \(${ft(p)}\) részét megtettük, a hátralévő rész az egész hányad része?`,
      sol: [T`Hátra van: \(1-${ft(p)}=${ft(rest)}\) rész.`, T`\(${ft(rest)}\) rész = ${km} km, tehát \(\frac{1}{${rest.d}}\) rész = \(${km}:${rest.n}=${km / rest.n}\) km.`, T`Az egész: \(${km / rest.n}\cdot ${rest.d}=${tot}\) km.`] };
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
<div class="prose"><p><b>Törtrész a maradékból:</b> ha valaminek előbb a \(\frac25\) részét, utána a <i>maradék</i> \(\frac13\) részét vesszük el, a második törtrész már nem az egészre, hanem a maradékra vonatkozik.</p></div>`,
    igazHamis: [
      { allitas: T`\(2+3\cdot4=20\)`, igaz: false, miert: T`A szorzás az első: \(2+12=14\).` },
      { allitas: T`\((1:2):3=1:(2:3)\)`, igaz: false, miert: T`Bal oldal: \(\frac12:3=\frac16\); jobb oldal: \(1:\frac23=\frac32\). Osztásnál a zárójelezés számít!` },
      { allitas: T`\(\frac23\cdot\left(\frac34-\frac32\right)=\frac23\cdot\frac34-\frac23\cdot\frac32\)`, igaz: true, miert: T`Ez a zárójelfelbontás: a szorzó a zárójel minden tagjára vonatkozik.` },
      { allitas: T`\(6:(2+1)=6:2+6:1\)`, igaz: false, miert: T`Bal oldal: \(6:3=2\); jobb oldal: \(3+6=9\). Összeggel osztva nem lehet tagonként osztani.` },
      { allitas: T`\(\dfrac{\frac12}{3}=\dfrac{1}{\frac23}\)`, igaz: false, miert: T`A főtörtvonal dönt: bal oldal \(\frac12:3=\frac16\), jobb oldal \(1:\frac23=\frac32\).` }
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
