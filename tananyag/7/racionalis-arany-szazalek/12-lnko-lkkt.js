/*
 * 12. fejezet – Legnagyobb közös osztó, legkisebb közös többszörös
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 9. lecke: Prímszámvadászat)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { primeF } = M7;
  const G = {};
  const lcm = (a, b) => a / gcd(a, b) * b;
  function pfMap(n) { const m = {}; primeF(n).forEach(p => { m[p] = (m[p] || 0) + 1; }); return m; }
  const texOf = m => Object.keys(m).map(Number).sort((a, b) => a - b).filter(p => m[p] > 0).map(p => m[p] > 1 ? `${p}^{${m[p]}}` : String(p)).join(T`\cdot `) || '1';
  const pfTex = n => n === 1 ? '1' : texOf(pfMap(n));
  /* két szám, amelyeknek van érdekes közös osztójuk */
  function par(max = 400) { let a, b; do { const g = P([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 18, 20, 24, 25, 30]); a = g * R(2, 15); b = g * R(2, 15); } while (a === b || a > max || b > max || a % b === 0 || b % a === 0 && R(0, 2)); return [a, b]; }

  G.lnko = { name: 'Legnagyobb közös osztó', make() {
    const [a, b] = par(); const g = gcd(a, b);
    return { q: T`<p>Határozd meg a két szám legnagyobb közös osztóját!</p>\[(${a};\,${b})=\,?\]`, ans: { vals: [g] }, ansText: String(g), fmt: 'egész szám',
      hint: 'Bontsd prímtényezőkre mindkét számot, és szorozd össze a KÖZÖS prímtényezőket a LEGKISEBB előforduló kitevőn!',
      sol: [T`\(${a}=${pfTex(a)}\), \(${b}=${pfTex(b)}\)`, T`Közös prímtényezők a kisebbik kitevőn: \((${a};\,${b})=${pfTex(g)}=${g}\)`] };
  } };

  G.lkkt = { name: 'Legkisebb közös többszörös', make() {
    let a, b; do { a = R(4, 60); b = R(4, 60); } while (a === b || gcd(a, b) === 1 && R(0, 2) || lcm(a, b) > 2000 || a % b === 0 || b % a === 0); const l = lcm(a, b);
    return { q: T`<p>Határozd meg a két szám legkisebb közös többszörösét!</p>\[[${a};\,${b}]=\,?\]`, ans: { vals: [l] }, ansText: String(l), fmt: 'egész szám',
      hint: 'Bontsd prímtényezőkre a számokat, és szorozd össze az ÖSSZES előforduló prímtényezőt a LEGNAGYOBB kitevőn!',
      sol: [T`\(${a}=${pfTex(a)}\), \(${b}=${pfTex(b)}\)`, T`Minden prímtényező a nagyobbik kitevőn: \([${a};\,${b}]=${pfTex(l)}=${bigT(l)}\)`] };
  } };

  G.harom = { name: 'Három szám', make() {
    const lk = R(0, 1) === 1; let a, b, c;
    if (lk) { do { a = R(2, 20); b = R(2, 20); c = R(2, 20); } while (new Set([a, b, c]).size < 3 || lcm(lcm(a, b), c) > 1000); const l = lcm(lcm(a, b), c);
      return { q: T`<p>Határozd meg a legkisebb közös többszöröst!</p>\[[${a};\,${b};\,${c}]=\,?\]`, ans: { vals: [l] }, ansText: String(l), fmt: 'egész szám',
        hint: 'Az összes előforduló prímtényező a legnagyobb kitevőn.', sol: [T`\(${a}=${pfTex(a)}\), \(${b}=${pfTex(b)}\), \(${c}=${pfTex(c)}\)`, T`\([${a};\,${b};\,${c}]=${pfTex(l)}=${l}\)`] }; }
    do { const g = P([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]); a = g * R(1, 12); b = g * R(1, 12); c = g * R(1, 12); } while (new Set([a, b, c]).size < 3 || Math.max(a, b, c) > 150);
    const g = gcd(gcd(a, b), c);
    return { q: T`<p>Határozd meg a legnagyobb közös osztót!</p>\[(${a};\,${b};\,${c})=\,?\]`, ans: { vals: [g] }, ansText: String(g), fmt: 'egész szám',
      hint: 'Csak az a prímtényező kerül bele, amelyik MINDHÁROM számban szerepel, a legkisebb kitevőn.', sol: [T`\(${a}=${pfTex(a)}\), \(${b}=${pfTex(b)}\), \(${c}=${pfTex(c)}\)`, T`\((${a};\,${b};\,${c})=${pfTex(g)}=${g}\)`] };
  } };

  G.felbontott = { name: 'Prímtényezős alakból', make() {
    const ps = [2, 3, 5, 7]; const A = {}, B = {}; ps.forEach(p => { A[p] = R(0, 3); B[p] = R(0, 3); }); if (Object.values(A).every(x => !x) || Object.values(B).every(x => !x)) return G.felbontott.make();
    const Gm = {}, Lm = {}; ps.forEach(p => { Gm[p] = Math.min(A[p], B[p]); Lm[p] = Math.max(A[p], B[p]); });
    const val = m => ps.reduce((s, p) => s * p ** m[p], 1); const lk = R(0, 1) === 1; const v = val(lk ? Lm : Gm); if (v > 1e6 || texOf(A) === texOf(B)) return G.felbontott.make();
    return { q: T`<p>Határozd meg a két szám ${lk ? 'legkisebb közös többszörösét' : 'legnagyobb közös osztóját'}, és add meg az értékét!</p>\[a=${texOf(A)}\qquad b=${texOf(B)}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: lk ? 'Minden prím a NAGYOBBIK kitevőn.' : 'Csak a közös prímek, a KISEBBIK kitevőn. Ha nincs közös prímtényező, a legnagyobb közös osztó 1.',
      sol: [T`\(${lk ? '[a;\\,b]' : '(a;\\,b)'}=${texOf(lk ? Lm : Gm)}=${bigT(v)}\)`] };
  } };

  G.egyszerusit = { name: 'Törtek egyszerűsítése, közös nevező', make() {
    if (R(0, 1) === 0) { const [a, b] = par(300); const g = gcd(a, b); const f = F(a, b);
      return { q: T`<p>Egyszerűsítsd a törtet a lehető legjobban! (A legnagyobb közös osztóval egy lépésben is lehet.)</p>\[\frac{${a}}{${b}}\]`, ans: { vals: [a / b], form: 'frac' }, ansText: `${f.n}/${f.d}`, fmt: 'tört, pl. 3/4',
        hint: 'Keresd meg a számláló és a nevező legnagyobb közös osztóját!', sol: [T`\((${a};\,${b})=${g}\)`, T`\[\frac{${a}}{${b}}=\frac{${a}:${g}}{${b}:${g}}=${ft(f)}\]`] }; }
    let d1, d2; do { d1 = R(4, 30); d2 = R(4, 30); } while (d1 === d2 || gcd(d1, d2) === 1 || d1 % d2 === 0 || d2 % d1 === 0); const n1 = R(1, d1 - 1), n2 = R(1, d2 - 1); const L = lcm(d1, d2); const s = fadd(F(n1, d1), F(n2, d2));
    return { q: T`<p>Végezd el az összeadást! (Közös nevező: a nevezők legkisebb közös többszöröse.)</p>\[\frac{${n1}}{${d1}}+\frac{${n2}}{${d2}}\]`, ans: { vals: [fv(s)], form: 'frac' }, ansText: `${s.n}/${s.d}`, fmt: 'tört (egyszerűsítve)',
      hint: 'A legkisebb közös nevező a nevezők legkisebb közös többszöröse.', sol: [T`\([${d1};\,${d2}]=${L}\)`, T`\[\frac{${n1 * L / d1}}{${L}}+\frac{${n2 * L / d2}}{${L}}=\frac{${n1 * L / d1 + n2 * L / d2}}{${L}}${s.d !== L ? '=' + ft(s) : ''}\]`] };
  } };

  G.relativ = { name: 'Relatív prímek?', make() {
    let a, b; do { a = R(4, 60); b = R(4, 60); } while (a === b); const g = gcd(a, b); const opts = ['igen, relatív prímek', 'nem relatív prímek'];
    return { q: `<p>Relatív prímek-e a(z) <b>${a}</b> és a(z) <b>${b}</b>?</p>`, ans: { choice: opts, correct: g === 1 ? 0 : 1 }, ansText: opts[g === 1 ? 0 : 1], fmt: '',
      hint: 'Két szám relatív prím, ha a legnagyobb közös osztójuk 1 (nincs közös prímtényezőjük). Nem kell hozzá, hogy prímek legyenek!',
      sol: [T`\(${a}=${pfTex(a)}\), \(${b}=${pfTex(b)}\)`, g === 1 ? 'Nincs közös prímtényező, a legnagyobb közös osztó 1: <b>relatív prímek</b>.' : T`A legnagyobb közös osztó \(${g}\ne1\): <b>nem relatív prímek</b>.`] };
  } };

  G.szovegesLnko = { name: 'Szöveges: közös osztó', make() {
    const [a, b] = par(240); const g = gcd(a, b); const t = R(0, 2);
    const q = [`<p>Egy virágárus ${a} szál tulipánt és ${b} szál nárciszt szeretne csokrokba kötni úgy, hogy minden csokorban ugyanannyi tulipán és ugyanannyi nárcisz legyen, és ne maradjon virág. Legfeljebb hány csokrot köthet?</p>`,
      `<p>Egy ${a} cm × ${b} cm-es téglalap alakú lemezt egybevágó, minél nagyobb négyzetekre vágunk (hulladék nélkül). Mekkora lesz egy négyzet oldala?</p>`,
      `<p>Egy edző ${a} labdát és ${b} mezt oszt szét csapatok között úgy, hogy minden csapat ugyanannyi labdát és ugyanannyi mezt kapjon, és semmi ne maradjon. Legfeljebb hány csapat lehet?</p>`][t];
    return { q, ans: { vals: [g] }, ansText: String(g), fmt: t === 1 ? 'szám (cm)' : 'egész szám',
      hint: 'A csoportok száma (illetve a négyzet oldala) mindkét mennyiségnek osztója kell legyen – és a lehető legnagyobb.',
      sol: [T`A keresett szám a(z) ${a} és ${b} közös osztója, a lehető legnagyobb: \((${a};\,${b})=${g}\).`, t === 1 ? `A négyzetek oldala ${g} cm (${a / g} · ${b / g} = ${a * b / g / g} darab).` : `Egy csoportba ${a / g}, illetve ${b / g} darab jut.`] };
  } };

  G.szovegesLkkt = { name: 'Szöveges: közös többszörös', make() {
    let a, b; do { a = P([4, 6, 8, 9, 10, 12, 15, 18, 20, 24, 25, 30, 40, 45]); b = P([4, 6, 8, 9, 10, 12, 15, 18, 20, 24, 25, 30, 40, 45]); } while (a === b || a % b === 0 || b % a === 0 || lcm(a, b) > 360); const l = lcm(a, b); const t = R(0, 2);
    if (t === 0) { const h = R(5, 8); const tot = h * 60 + l; return { q: `<p>Egy buszállomásról reggel ${h} órakor egyszerre indul két járat. Az egyik ${a}, a másik ${b} percenként indul. Hány perc múlva indulnak legközelebb újra egyszerre?</p>`, ans: { vals: [l] }, ansText: String(l), fmt: 'szám (perc)',
      hint: 'Az időpontnak mindkét indulási időköz többszörösének kell lennie – a lehető legkisebbnek.', sol: [T`\([${a};\,${b}]=${l}\)`, `${l} perc múlva, azaz ${Math.floor(tot / 60)} óra ${tot % 60} perckor.`] }; }
    if (t === 1) return { q: `<p>Két jelzőlámpa egyszerre villant fel. Az egyik ${a}, a másik ${b} másodpercenként villan. Legkevesebb hány másodperc múlva villannak újra egyszerre?</p>`, ans: { vals: [l] }, ansText: String(l), fmt: 'szám (másodperc)',
      hint: 'Mindkét időköz közös többszöröse kell, a legkisebb.', sol: [T`\([${a};\,${b}]=${l}\) másodperc.`] };
    return { q: `<p>Egy csomag cukorkát ${a} gyerek között is és ${b} gyerek között is maradék nélkül szét lehet osztani egyenlően. Legalább hány cukorka van a csomagban?</p>`, ans: { vals: [l] }, ansText: String(l), fmt: 'egész szám',
      hint: 'A cukorkák száma osztható kell legyen mindkét számmal.', sol: [T`A legkisebb ilyen szám: \([${a};\,${b}]=${l}\).`] };
  } };

  G.osszefugges = { name: 'Osztó · többszörös = szorzat', szint: 'emelt', make() {
    const [a, b] = par(200); const g = gcd(a, b), l = lcm(a, b);
    return { q: `<p>Két szám legnagyobb közös osztója ${g}, legkisebb közös többszöröse ${big(l)}. Az egyik szám ${a}. Mennyi a másik?</p>`, ans: { vals: [b] }, ansText: String(b), fmt: 'egész szám',
      hint: T`Két szám szorzata egyenlő a legnagyobb közös osztójuk és a legkisebb közös többszörösük szorzatával: \(a\cdot b=(a;b)\cdot[a;b]\).`,
      sol: [T`\(${a}\cdot b=${g}\cdot ${bigT(l)}=${bigT(g * l)}\)`, T`\(b=${bigT(g * l)}:${a}=${b}\)`] };
  } };

  Tananyag.fejezet({
    id: 'lnko',
    cim: 'Legnagyobb közös osztó, legkisebb közös többszörös',
    rovid: 'Osztó, többszörös',
    bevezeto: T`Hány egyforma csokrot köthetünk? Mikor indul újra egyszerre a két busz? A prímtényezős felbontás segítségével gyorsan megkapjuk a választ.`,
    elmelet: T`<div class="prose"><p><b>Legnagyobb közös osztó</b> – jele \((a;b)\): a két szám közös osztói közül a legnagyobb. <b>Legkisebb közös többszörös</b> – jele \([a;b]\): a két szám pozitív közös többszörösei közül a legkisebb.</p></div>
<div class="mathbox">\[360=2^3\cdot3^2\cdot5\qquad 600=2^3\cdot3\cdot5^2\]
\[(360;\,600)=2^3\cdot3\cdot5=120\qquad [360;\,600]=2^3\cdot3^2\cdot5^2=1800\]</div>
<div class="tbl"><table><tr><th></th><th>melyik prímek?</th><th>milyen kitevőn?</th></tr>
<tr><td>legnagyobb közös osztó</td><td>csak a <b>közösek</b></td><td>a <b>legkisebb</b> előforduló kitevőn</td></tr>
<tr><td>legkisebb közös többszörös</td><td><b>minden</b> előforduló prím</td><td>a <b>legnagyobb</b> előforduló kitevőn</td></tr></table></div>
<div class="prose"><ul>
<li>Ha két szám legnagyobb közös osztója 1, <b>relatív prímeknek</b> nevezzük őket: pl. 8 és 15 (egyik sem prím!). Ilyenkor \([8;15]=8\cdot15=120\).</li>
<li>Mindig igaz: \((a;b)\cdot[a;b]=a\cdot b\). Pl. \(12\cdot 18=216=6\cdot 36\).</li>
<li><b>Mire jó?</b> Törtek egyszerűsítéséhez a legnagyobb közös osztó, közös nevezőhöz a legkisebb közös többszörös kell. Szöveges feladatoknál: „egyenlő részekre osztás, a lehető legnagyobb rész” → osztó; „mikor esik újra egybe” → többszörös.</li></ul></div>`,
    igazHamis: [
      { allitas: T`\((12;\,18)=6\)`, igaz: true, miert: T`\(12=2^2\cdot3\), \(18=2\cdot3^2\), közös: \(2\cdot3=6\).` },
      { allitas: T`\([4;\,6]=24\)`, igaz: false, miert: T`\(4=2^2\), \(6=2\cdot3\), így \([4;6]=2^2\cdot3=12\). A 24 közös többszörös, de nem a legkisebb.` },
      { allitas: T`A 8 és a 15 relatív prímek.`, igaz: true, miert: T`\(8=2^3\), \(15=3\cdot5\): nincs közös prímtényező, \((8;15)=1\).` },
      { allitas: T`Relatív prímek csak prímszámok lehetnek.`, igaz: false, miert: T`Pl. 8 és 9 relatív prímek, pedig egyik sem prím.` },
      { allitas: T`Ha \(a\) osztója \(b\)-nek, akkor \((a;\,b)=a\).`, igaz: true, miert: T`Pl. \((6;\,18)=6\): az \(a\) közös osztó, és nagyobb nem lehet nála.` },
      { allitas: T`Két szám legkisebb közös többszöröse mindig a szorzatuk.`, igaz: false, miert: T`Csak relatív prímeknél. \([6;\,8]=24\), de \(6\cdot8=48\).` },
      { allitas: T`\((a;\,b)\cdot[a;\,b]=a\cdot b\) minden pozitív egész \(a\), \(b\) esetén.`, igaz: true, miert: T`A közös prímek a kisebb és a nagyobb kitevőn együtt pontosan a két szám összes prímtényezőjét adják.`, szint: 'emelt' },
      { general() { const [a, b] = par(120); const g = gcd(a, b); const ok = R(0, 1) === 1; const v = ok ? g : g * P([2, 3]); return { allitas: T`\((${a};\,${b})=${v}\)`, igaz: v === g, miert: T`\(${a}=${pfTex(a)}\), \(${b}=${pfTex(b)}\), így \((${a};\,${b})=${g}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Egy kikötőből január 1-jén egyszerre indul két hajó. Az egyik 4 havonta, a másik 6 havonta tér vissza. Mikor találkoznak legközelebb a kikötőben?`,
      lepesek: [
        T`A visszatérések: az első 4, 8, 12, … hónap múlva, a második 6, 12, 18, … hónap múlva.`,
        T`Mindkettő többszöröse kell: a legkisebb közös többszörös. \(4=2^2\), \(6=2\cdot3\).`,
        T`\([4;\,6]=2^2\cdot3=12\) hónap.`,
        T`Tehát egy év múlva, a következő év <b>január 1-jén</b> találkoznak.`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
