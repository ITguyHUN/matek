/*
 * A gyökvonás / 1. fejezet – Racionális számok, irracionális számok
 * Témakör: A gyökvonás (Sokszínű matematika 10., 2. fejezet 1. lecke; vizsgatematika 1. témakör; TK 41/1–4; FGY 2092–2099)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { R0, keverd, FMT10 } = M10;
  const feladatok = {};
  const egy = (x, y) => Math.abs(x - y) < 1e-9;

  /* p/q (q > 0) tizedes tört alakja: egészrész, előszakasz, szakasz (üres, ha véges) */
  function tizedes(p, q) {
    const neg = p < 0; p = Math.abs(p);
    const egesz = Math.floor(p / q); let r = p % q; const jegyek = []; const lat = {};
    while (r !== 0 && !(r in lat) && jegyek.length < 60) { lat[r] = jegyek.length; r *= 10; jegyek.push(Math.floor(r / q)); r %= q; }
    if (r === 0) return { neg, egesz, elo: jegyek.join(''), szak: '' };
    const k = lat[r]; return { neg, egesz, elo: jegyek.slice(0, k).join(''), szak: jegyek.slice(k).join('') };
  }
  /* TeX: 0{,}1\dot{6};  0{,}\dot{3}\dot{6};  0{,}\dot{1}4\dot{2} */
  function tizT(t) {
    let s = (t.neg ? '-' : '') + t.egesz;
    if (!t.elo && !t.szak) return s;
    s += '{,}' + t.elo;
    if (t.szak) { const d = t.szak.split(''); s += d.length === 1 ? `\\dot{${d[0]}}` : `\\dot{${d[0]}}${d.slice(1, -1).join('')}\\dot{${d[d.length - 1]}}`; }
    return s;
  }
  const tizSz = t => (t.neg ? '−' : '') + t.egesz + (t.elo || t.szak ? ',' + t.elo + (t.szak ? `(${t.szak})` : '') : '');

  feladatok.tizedes = { nev: 'Tört átírása tizedes törtté', general() {
    const q = P([4, 8, 16, 20, 25, 40, 3, 6, 9, 11, 12, 15, 18, 22, 30, 33, 37, 45, 7]);
    let p; do { p = R(1, 3 * q); } while (gcd(p, q) !== 1);
    const t = tizedes(p, q);
    return { kerdes: T`<p>Írd fel tizedes tört alakban! (Szakaszos tizedes törtnél a szakaszt tedd zárójelbe, pl. 0,1(6).)</p>\[\frac{${p}}{${q}}\]`,
      valasz: { ertekek: [p / q], forma: 'tizedes' }, formatum: 'véges vagy szakaszos tizedes tört, pl. 0,375 vagy 0,1(6)',
      tipp: 'Végezd el az osztást! Ha a maradék ismétlődik, onnantól a jegyek is ismétlődnek (szakaszos tizedes tört). A tört akkor véges tizedes tört, ha a nevezőnek (egyszerűsítés után) csak 2 és 5 a prímtényezője.',
      megoldas: [T`\[\frac{${p}}{${q}}=${tizT(t)}\]`, t.szak ? `Szakaszos tizedes tört; beírva: ${tizSz(t)}` : 'Véges tizedes tört, mert a nevező prímtényezői csak 2 és 5.'] };
  } };

  feladatok.tort = { nev: 'Szakaszos tizedes tört átírása törtté', general() {
    let p, q, t;
    do { q = P([3, 6, 9, 11, 12, 15, 18, 22, 27, 30, 33, 36, 37, 44, 45, 55, 66, 74, 90, 99, 111, 198, 333]); p = R(1, 3 * q); t = tizedes(p, q); }
    while (gcd(p, q) !== 1 || !t.szak || t.szak.length > 3 || t.elo.length > 2);
    const n = t.elo.length, k = t.szak.length;
    const A = Number(String(t.egesz) + t.elo + t.szak), B = Number(String(t.egesz) + t.elo);
    const sz = A - B, nev = (10 ** k - 1) * 10 ** n;
    return { kerdes: T`<p>Írd fel két egész szám hányadosaként, egyszerűsített tört alakban!</p>\[${tizT(t)}\]`,
      valasz: { ertekek: [p / q], forma: 'tort' }, formatum: 'egyszerűsített tört, pl. 7/15',
      tipp: T`Legyen \(x=${tizT(t)}\). Szorozd meg \(x\)-et úgy (10, 100, … -zal), hogy a szakaszok egymás alá kerüljenek, majd vond ki a két egyenletet egymásból.`,
      megoldas: [T`\[${10 ** (n + k)}x=${tizT({ egesz: A, elo: '', szak: t.szak })}${n ? T`,\qquad ${10 ** n}x=${tizT({ egesz: B, elo: '', szak: t.szak })}` : T`,\qquad x=${tizT(t)}`}\]`,
        T`\[${10 ** (n + k) - 10 ** n}x=${sz}\quad\Rightarrow\quad x=\frac{${sz}}{${nev}}=\frac{${p}}{${q}}\]`],
      _ell: w => egy(w, p / q) };
  } };

  const NEMN = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 18, 20, 24, 27, 32, 45, 50];
  function racElem() {
    const t = R(0, 9); const m = P(NEMN), k = R(2, 9);
    switch (t) {
      case 0: return R(0, 1) ? { tex: T`\sqrt{${m}}`, rac: false } : { tex: T`\sqrt{${k * k}}`, rac: true };
      case 1: return { tex: T`${k}+\sqrt{${m}}`, rac: false };
      case 2: { const a = P([2, 3, 5]), b = R(1, 4), c = R(1, 4); return { tex: T`\sqrt{${a * b * b}}\cdot\sqrt{${a * c * c}}`, rac: true }; }
      case 3: { const a = P([2, 3, 5, 6]), b = R(2, 5); return R(0, 1) ? { tex: T`\frac{\sqrt{${a * b * b}}}{\sqrt{${a}}}`, rac: true } : { tex: T`\frac{\sqrt{${a * b}}}{\sqrt{${a}}}`, rac: Number.isInteger(Math.sqrt(b)) }; }
      case 4: return { tex: T`\left(\sqrt{${m}}\right)^2`, rac: true };
      case 5: return { tex: T`\sqrt{${m}}-\left(${k}+\sqrt{${m}}\right)`, rac: true };
      case 6: return R(0, 1) ? { tex: T`\sqrt[3]{${k ** 3}}`, rac: true } : { tex: T`\sqrt[3]{${P([2, 3, 4, 9, 10, 25])}}`, rac: false };
      case 7: { const p = R(1, 20), q = P([3, 7, 9, 11]); return { tex: T`\frac{${p}}{${q}}`, rac: true }; }
      case 8: return { tex: P([T`\pi`, T`2\pi`, T`\pi+1`]), rac: false };
      default: { const a = R(1, 9), b = R(2, 9); return { tex: T`${a}{,}\dot{${b}}`, rac: true }; }
    }
  }
  feladatok.racionalis = { nev: 'Racionális vagy irracionális?', general() {
    const e = racElem(); const opc = ['racionális', 'irracionális'];
    return { kerdes: T`<p>Racionális vagy irracionális szám?</p>\[${e.tex}\]`, valasz: { valasztas: opc, helyes: e.rac ? 0 : 1 },
      tipp: 'Racionális az a szám, amely felírható két egész szám hányadosaként (véges vagy szakaszos tizedes tört). Végezd el a lehetséges egyszerűsítéseket!',
      megoldas: [T`\(${e.tex}\) ${e.rac ? 'racionális' : 'irracionális'}.`, e.rac ? 'Egyszerűsítés után egész szám vagy tört (illetve szakaszos tizedes tört) adódik.' : 'Nem négyzetszám (köbszám) gyöke irracionális; racionális és irracionális szám összege is irracionális.'] };
  } };

  feladatok.kozott = { nev: 'Gyökök becslése', general() {
    const t = R(0, 2);
    if (t < 2) { const n = t === 0 ? 2 : P([2, 3]); let a; do { a = R(2, n === 2 ? 400 : 900); } while (Math.round(a ** (1 / n)) ** n === a);
      const f = Math.floor(a ** (1 / n) + 1e-12); const gT = n === 2 ? T`\sqrt{${a}}` : T`\sqrt[3]{${a}}`;
      return { kerdes: T`<p>Melyik két szomszédos egész szám közé esik a szám? Add meg a <b>kisebbiket</b>!</p>\[${gT}\]`,
        valasz: { ertekek: [f] }, formatum: FMT10.egesz,
        tipp: n === 2 ? 'Keresd meg azt a két szomszédos négyzetszámot, amelyek közé a gyökjel alatti szám esik.' : 'Keresd meg azt a két szomszédos köbszámot, amelyek közé a gyökjel alatti szám esik.',
        megoldas: [T`\(${f}^{${n}}=${f ** n}<${a}<${(f + 1) ** n}=${f + 1}^{${n}}\), ezért \(${f}<${gT}<${f + 1}\).`],
        _ell: w => w ** n < a && (w + 1) ** n > a }; }
    const a = R(2, 120), b = a + R(20, 200); const ints = []; for (let k = 0; k * k <= b; k++) if (k * k > a && k * k < b) ints.push(k);
    return { kerdes: T`<p>Hány egész szám van \(\sqrt{${a}}\) és \(\sqrt{${b}}\) között?</p>`, valasz: { ertekek: [ints.length] }, formatum: FMT10.egesz,
      tipp: T`Az egész \(k\) akkor van a két gyök között, ha \(${a}<k^2<${b}\) (pozitív \(k\) esetén).`,
      megoldas: [T`\(${a}<k^2<${b}\) teljesül: \(k=${ints.join(';\\ ') || '–'}\), összesen ${ints.length} egész szám.`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'vgy0',
    cim: 'Racionális és irracionális számok',
    rovid: 'Racionális, irracionális',
    bevezeto: T`Minden racionális szám véges vagy szakaszos tizedes tört – és fordítva. Ami nem ilyen (például \(\sqrt2\) vagy \(\pi\)), az irracionális.`,
    elmelet: T`<div class="prose"><p><b>Racionális szám:</b> két egész szám hányadosaként felírható szám: \(\frac pq\), \(p,q\in\mathbb Z\), \(q\neq0\). Tizedes tört alakja véges vagy végtelen szakaszos.</p>
<p><b>Irracionális szám:</b> nem írható fel két egész szám hányadosaként; tizedes tört alakja végtelen, nem szakaszos (pl. \(\sqrt2\), \(\sqrt3\), \(\pi\)).</p></div>
<div class="tbl"><table><tr><th>Átalakítás</th><th>Módszer</th><th>Példa</th></tr>
<tr><td>tört → tizedes tört</td><td>osztás; ha egy maradék ismétlődik, szakasz kezdődik</td><td>\(\frac16=0{,}1\dot6\)</td></tr>
<tr><td>szakaszos → tört</td><td>\(x\)-et 10 hatványaival szorozzuk, majd kivonunk</td><td>\(100x-x=36{,}\dot3\dot6-0{,}\dot3\dot6=36\Rightarrow x=\frac{36}{99}=\frac4{11}\)</td></tr></table></div>
<div class="prose"><ul>
<li>Egyszerűsített tört pontosan akkor véges tizedes tört, ha a nevező prímtényezői között csak 2 és 5 van.</li>
<li>Ha \(n\) pozitív egész, de nem négyzetszám, akkor \(\sqrt n\) irracionális.</li>
<li>Racionális + irracionális = irracionális; két irracionális szám összege vagy szorzata lehet racionális is (\(\sqrt2\cdot\sqrt2=2\)).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(\frac{3}{8}\) véges tizedes tört.`, igaz: true, miert: T`\(8=2^3\); \(\frac38=0{,}375\).` },
      { allitas: T`\(\frac{1}{6}\) véges tizedes tört.`, igaz: false, miert: T`A nevezőben 3 is van: \(\frac16=0{,}1\dot6\).` },
      { allitas: T`\(0{,}\dot9=1\)`, igaz: true, miert: T`\(10x-x=9\Rightarrow x=1\).` },
      { allitas: T`Két irracionális szám összege mindig irracionális.`, igaz: false, miert: T`\(\sqrt2+(-\sqrt2)=0\).` },
      { allitas: T`Egy racionális és egy irracionális szám összege mindig irracionális.`, igaz: true, miert: 'Ha racionális lenne, az irracionális szám két racionális különbségeként racionális lenne.' },
      { allitas: T`\(\sqrt{16}\) irracionális.`, igaz: false, miert: T`\(\sqrt{16}=4\).` },
      { allitas: T`\(\sqrt{2}\cdot\sqrt{8}\) racionális.`, igaz: true, miert: T`\(\sqrt{16}=4\).` },
      { general() { const q = P([3, 7, 9, 11, 12, 15]), p = R(1, q - 1); const t = tizedes(p, q); return { allitas: T`\(\frac{${p}}{${q}}\) véges tizedes tört.`, igaz: !t.szak, miert: T`\(\frac{${p}}{${q}}=${tizT(t)}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Írjuk fel két egész szám hányadosaként: \(x=2{,}1\dot3\)`,
      lepesek: [T`\(100x=213{,}\dot3\) és \(10x=21{,}\dot3\).`, T`Kivonva: \(90x=192\).`, T`\(x=\frac{192}{90}=\frac{32}{15}\).`]
    },
    feladatok
  }));
})();
