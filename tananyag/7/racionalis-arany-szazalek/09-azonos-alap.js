/*
 * 9. fejezet – Műveletek azonos alapú hatványokkal
 * Témakör: Természetes számok, racionális számok (7. évfolyam, TK I. fejezet 7. lecke)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 7/kurzus.js elején vannak (M7).
 */
(function () {
  const { fplain } = M7;
  const G = {};
  const ALAP = [2, 3, 5, 7, 10, -2, -3, 0.1, 'a', 'x', 'b', F(2, 3), F(1, 2)];
  const bt = a => typeof a === 'object' ? T`\left(${ft(a)}\right)` : typeof a === 'string' ? a : a < 0 || !Number.isInteger(a) ? T`(${nt(a)})` : String(a);
  const pw = (a, n) => n === 1 && R(0, 1) === 0 ? bt(a) : `${bt(a)}^{${n}}`;   // néha az 1-es kitevőt nem írjuk ki
  const pwx = (a, n) => `${bt(a)}^{${n}}`;
  const kerdes = a => T`<p>Írd fel egyetlen hatványként! Mi lesz a <b>kitevő</b>? (A hatványalap: \(${bt(a)}\).)</p>`;
  const valtozat = (fn) => fn;

  G.szorzas = { name: 'Azonos alapú hatványok szorzása', make() {
    const a = P(ALAP); const k = R(2, 3); const ns = Array.from({ length: k }, () => R(1, 9)); const s = ns.reduce((x, y) => x + y, 0);
    const tex = ns.map(n => pw(a, n)).join(T`\cdot `);
    return { q: kerdes(a) + T`\[${tex}\]`, ans: { vals: [s] }, ansText: String(s), fmt: 'egész szám (a kitevő)',
      hint: T`Azonos alapú hatványok szorzásakor a kitevőket összeadjuk: \(a^m\cdot a^n=a^{m+n}\). Ha nincs kiírva kitevő, az 1.`,
      sol: [T`\[${tex}=${bt(a)}^{${ns.join('+')}}=${pwx(a, s)}\]`] };
  } };

  G.osztas = { name: 'Azonos alapú hatványok osztása', make() {
    const a = P(ALAP); const n = R(1, 8), m = n + R(1, 9); const frac = R(0, 1) === 1;
    const tex = frac ? T`\frac{${pwx(a, m)}}{${pwx(a, n)}}` : T`${pwx(a, m)}:${pwx(a, n)}`;
    return { q: kerdes(a) + T`\[${tex}\]`, ans: { vals: [m - n] }, ansText: String(m - n), fmt: 'egész szám (a kitevő)',
      hint: T`Azonos alapú hatványok osztásakor a kitevőket kivonjuk: \(a^m:a^n=a^{m-n}\) (a számláló kitevőjéből a nevezőét).`,
      sol: [T`\[${tex}=${bt(a)}^{${m}-${n}}=${pwx(a, m - n)}\]`, T`(Szorzatként felírva \(${n}\) tényező egyszerűsíthető ki.)`] };
  } };

  G.hatvHatv = { name: 'Hatvány hatványozása', make() {
    const a = P(ALAP); const m = R(2, 6), n = R(2, 5); const dbl = R(0, 3) === 0; const k = dbl ? R(2, 3) : 1;
    const tex = dbl ? T`\left(\left(${pwx(a, m)}\right)^{${n}}\right)^{${k}}` : T`\left(${pwx(a, m)}\right)^{${n}}`;
    return { q: kerdes(a) + T`\[${tex}\]`, ans: { vals: [m * n * k] }, ansText: String(m * n * k), fmt: 'egész szám (a kitevő)',
      hint: T`Hatványt úgy hatványozunk, hogy a kitevőket összeszorozzuk: \(\left(a^m\right)^n=a^{m\cdot n}\).`,
      sol: [T`\[${tex}=${bt(a)}^{${m}\cdot ${n}${dbl ? T`\cdot ${k}` : ''}}=${pwx(a, m * n * k)}\]`] };
  } };

  G.vegyes = { name: 'Vegyes: szorzás, osztás, hatványozás', make() {
    const a = P(ALAP); const t = R(0, 3); let tex, e, sol;
    const p = R(2, 6), q = R(1, 5), r = R(2, 4), s = R(1, 4);
    if (t === 0) { e = p + q - s; if (e < 1) return G.vegyes.make(); tex = T`\frac{${pwx(a, p)}\cdot ${pwx(a, q)}}{${pwx(a, s)}}`; sol = [T`Számláló: \(${bt(a)}^{${p}+${q}}=${pwx(a, p + q)}\)`, T`Osztás: \(${bt(a)}^{${p + q}-${s}}=${pwx(a, e)}\)`]; }
    else if (t === 1) { e = p * r + q; tex = T`\left(${pwx(a, p)}\right)^{${r}}\cdot ${pwx(a, q)}`; sol = [T`\(\left(${pwx(a, p)}\right)^{${r}}=${pwx(a, p * r)}\)`, T`\(${pwx(a, p * r)}\cdot ${pwx(a, q)}=${pwx(a, e)}\)`]; }
    else if (t === 2) { e = (p + q) * r - s; tex = T`\frac{\left(${pwx(a, p)}\cdot ${pwx(a, q)}\right)^{${r}}}{${pwx(a, s)}}`; sol = [T`Zárójel: \(${pwx(a, p + q)}\)`, T`Hatványozás: \(\left(${pwx(a, p + q)}\right)^{${r}}=${pwx(a, (p + q) * r)}\)`, T`Osztás: \(${pwx(a, (p + q) * r - s)}\)`]; }
    else { e = p * r - q * s; if (e < 1) return G.vegyes.make(); tex = T`\frac{\left(${pwx(a, p)}\right)^{${r}}}{\left(${pwx(a, q)}\right)^{${s}}}`; sol = [T`\(\left(${pwx(a, p)}\right)^{${r}}=${pwx(a, p * r)}\), \(\left(${pwx(a, q)}\right)^{${s}}=${pwx(a, q * s)}\)`, T`\(${pwx(a, p * r)}:${pwx(a, q * s)}=${pwx(a, e)}\)`]; }
    return { q: kerdes(a) + T`\[${tex}\]`, ans: { vals: [e] }, ansText: String(e), fmt: 'egész szám (a kitevő)',
      hint: 'Haladj lépésenként: először a zárójel, aztán a hatvány hatványozása, végül a szorzás (kitevők összeadása) és az osztás (kivonás).', sol };
  } };

  G.ertek = { name: 'Számold ki ügyesen!', make() {
    const a = P([2, 2, 3, 5, 10, -2, -3]); const t = R(0, 2); let tex, e;
    if (t === 0) { const m = R(5, 20), n = m - R(1, a === 2 || a === -2 ? 6 : 3); e = m - n; tex = T`\frac{${bt(a)}^{${m}}}{${bt(a)}^{${n}}}`; }
    else if (t === 1) { const m = R(4, 12), n = R(2, 9), k = m + n - R(1, a === 2 || a === -2 ? 6 : 3); e = m + n - k; if (e < 1) return G.ertek.make(); tex = T`\frac{${bt(a)}^{${m}}\cdot ${bt(a)}^{${n}}}{${bt(a)}^{${k}}}`; }
    else { const m = R(2, 4), r = R(2, 4), k = m * r - R(1, a === 2 || a === -2 ? 5 : 2); e = m * r - k; if (e < 1 || k < 1) return G.ertek.make(); tex = T`\frac{\left(${bt(a)}^{${m}}\right)^{${r}}}{${bt(a)}^{${k}}}`; }
    const v = a ** e;
    return { q: T`<p>Számítsd ki a kifejezés értékét! (Ne a hatványokat számold ki külön – használd az azonosságokat!)</p>\[${tex}\]`, ans: { vals: [v] }, ansText: String(v), fmt: 'egész szám',
      hint: 'Írd fel egyetlen hatványként, és csak a végén számold ki az értékét!', sol: [T`\[${tex}=${pwx(a, e)}=${bigT(v)}\]`] };
  } };

  G.hianyzo = { name: 'Hiányzó kitevő', make() {
    const a = P([2, 3, 5, 7, 10, 'a', 'x']); const t = R(0, 2); const m = R(2, 9), n = R(2, 9); let tex, x;
    if (t === 0) { x = n; tex = T`${pwx(a, m)}\cdot ${bt(a)}^{\square}=${pwx(a, m + n)}`; }
    else if (t === 1) { x = n; tex = T`${bt(a)}^{${m + n}}:${bt(a)}^{\square}=${pwx(a, m)}`; }
    else { x = n; tex = T`\left(${bt(a)}^{\square}\right)^{${m}}=${pwx(a, m * n)}`; }
    return { q: T`<p>Mit írjunk a négyzet helyére, hogy igaz legyen az egyenlőség?</p>\[${tex}\]`, ans: { vals: [x] }, ansText: String(x), fmt: 'egész szám',
      hint: 'Melyik azonosságot kell használni? Szorzásnál összeadjuk, osztásnál kivonjuk, hatványozásnál szorozzuk a kitevőket.',
      sol: [t === 0 ? T`\(${m}+\square=${m + n}\), tehát \(\square=${x}\).` : t === 1 ? T`\(${m + n}-\square=${m}\), tehát \(\square=${x}\).` : T`\(\square\cdot ${m}=${m * n}\), tehát \(\square=${x}\).`] };
  } };

  G.osszeg = { name: 'Azonos hatványok összege', szint: 'emelt', make() {
    const a = P([2, 2, 3, 3, 5]); const k = a === 5 ? 5 : P([a, a * a]); const n = R(2, 8); const e = n + (k === a ? 1 : 2);
    const tex = Array(k).fill(pwx(a, n)).join('+');
    return { q: T`<p>Írd fel egyetlen hatványként! Mi lesz a kitevő? (Az alap: \(${a}\).)</p>\[${tex}\]`, ans: { vals: [e] }, ansText: String(e), fmt: 'egész szám (a kitevő)',
      hint: T`Az összeadás itt ismételt összeadás: ${k} darab egyforma tag = ${k}·(a tag). És a ${k} maga is a(z) ${a} hatványa!`,
      sol: [T`\[${tex}=${k}\cdot ${pwx(a, n)}=${k === a ? '' : T`${a}^2\cdot ${pwx(a, n)}=`}${pwx(a, e)}\]`, 'Vigyázat: összeadásra NINCS azonosság, itt csak azért működik, mert a tagok egyformák.'] };
  } };

  G.osszehasonlit = { name: 'Melyik a nagyobb?', make() {
    const a = P([2, 3, 5]); const x1 = R(1, 6), x2 = R(1, 6), y1 = R(1, 6), y2 = R(1, 6); const t = R(0, 1);
    const L = t ? T`${pwx(a, x1)}\cdot ${pwx(a, x2)}` : T`\left(${pwx(a, x1)}\right)^{${x2}}`, eL = t ? x1 + x2 : x1 * x2;
    const Rt = t ? T`\left(${pwx(a, y1)}\right)^{${y2}}` : T`${pwx(a, y1)}\cdot ${pwx(a, y2)}`, eR = t ? y1 * y2 : y1 + y2;
    const c = eL < eR ? 0 : eL === eR ? 1 : 2; const s = ['<', '=', '>'];
    return { q: T`<p>Melyik reláció kerül a négyzet helyére?</p>\[${L}\;\square\;${Rt}\]`, ans: { choice: s, correct: c }, ansText: s[c], fmt: '',
      hint: 'Írd fel mindkét oldalt egyetlen hatványként! Azonos (1-nél nagyobb) alapnál a nagyobb kitevőjű a nagyobb.',
      sol: [T`Bal oldal: \(${pwx(a, eL)}\), jobb oldal: \(${pwx(a, eR)}\).`, T`\(${eL}${s[c]}${eR}\), ezért \(${pwx(a, eL)}${s[c]}${pwx(a, eR)}\).`] };
  } };

  G.atiras = { name: 'Közös alapra hozás', szint: 'emelt', make() {
    const t = R(0, 2); let tex, e, sol;
    if (t === 0) { const m = R(2, 6), n = R(2, 6); e = 2 * m + n; tex = T`4^{${m}}\cdot 2^{${n}}`; sol = [T`\(4=2^2\), ezért \(4^{${m}}=\left(2^2\right)^{${m}}=2^{${2 * m}}\).`, T`\(2^{${2 * m}}\cdot2^{${n}}=2^{${e}}\)`]; }
    else if (t === 1) { const m = R(2, 5), n = R(1, 6); e = 3 * m + n; tex = T`8^{${m}}\cdot 2^{${n}}`; sol = [T`\(8=2^3\), ezért \(8^{${m}}=2^{${3 * m}}\).`, T`\(2^{${3 * m}}\cdot2^{${n}}=2^{${e}}\)`]; }
    else { const m = R(3, 7), n = R(1, m - 1); e = 2 * m - n; tex = T`\frac{4^{${m}}}{2^{${n}}}`; sol = [T`\(4^{${m}}=2^{${2 * m}}\)`, T`\(2^{${2 * m}}:2^{${n}}=2^{${e}}\)`]; }
    return { q: T`<p>Írd fel 2 hatványaként! Mi lesz a kitevő?</p>\[${tex}\]`, ans: { vals: [e] }, ansText: String(e), fmt: 'egész szám (a kitevő)',
      hint: T`Írd fel a 4-et és a 8-at is 2 hatványaként: \(4=2^2\), \(8=2^3\).`, sol };
  } };

  Tananyag.fejezet({
    id: 'azalap',
    cim: 'Műveletek azonos alapú hatványokkal',
    rovid: 'Azonos alap',
    bevezeto: T`\(2^3\cdot2^4\) – ki kell számolni mindkét hatványt? Nem kell! Az azonos alapú hatványokkal egyszerű szabályok szerint számolhatunk.`,
    elmelet: T`<div class="prose"><p><b>Azonos alapú hatványok</b> azok, amelyeknek ugyanaz az alapja, pl. \(2^3\), \(2^5\), \(2^8\).</p></div>
<div class="mathbox">\[3^2\cdot3^4=(3\cdot3)\cdot(3\cdot3\cdot3\cdot3)=3^{6}=3^{2+4}\]</div>
<div class="tbl"><table><tr><th>Szabály</th><th>Képlet</th><th>Példa</th></tr>
<tr><td>szorzás: a kitevők összeadódnak</td><td>\(a^m\cdot a^n=a^{m+n}\)</td><td>\(2^3\cdot2^4=2^7\)</td></tr>
<tr><td>osztás: a kitevők kivonódnak</td><td>\(a^m:a^n=a^{m-n}\)</td><td>\(5^7:5^3=5^4\)</td></tr>
<tr><td>hatvány hatványa: a kitevők szorzódnak</td><td>\(\left(a^m\right)^n=a^{m\cdot n}\)</td><td>\(\left(3^2\right)^4=3^8\)</td></tr></table></div>
<div class="prose"><ul>
<li>Ha nincs kiírva a kitevő, az 1: \(2\cdot2^5=2^1\cdot2^5=2^6\).</li>
<li>Az osztást törtként is írhatjuk: \(\dfrac{3^5}{3^2}=\dfrac{3\cdot3\cdot3\cdot3\cdot3}{3\cdot3}=3\cdot3\cdot3=3^3\) (két 3-as tényezővel egyszerűsítünk).</li>
<li><b>Összeadásra nincs ilyen szabály!</b> \(2^3+2^4=8+16=24\), ez nem \(2^7\). De egyforma tagoknál: \(2^5+2^5=2\cdot2^5=2^6\).</li>
<li>Vigyázz: \(\left(3^2\right)^3=3^6\), de \(3^{\left(2^3\right)}=3^8\).</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(2^3\cdot2^4=2^{12}\)`, igaz: false, miert: T`Szorzásnál a kitevőket összeadjuk: \(2^{3+4}=2^7\).` },
      { allitas: T`\(5^8:5^2=5^4\)`, igaz: false, miert: T`Osztásnál kivonjuk: \(5^{8-2}=5^6\).` },
      { allitas: T`\(\left(7^2\right)^5=7^{10}\)`, igaz: true, miert: T`Hatvány hatványánál szorzunk: \(2\cdot5=10\).` },
      { allitas: T`\(3^2+3^3=3^5\)`, igaz: false, miert: T`\(9+27=36\), de \(3^5=243\). Összeadásra nincs azonosság.` },
      { allitas: T`\(2^{10}+2^{10}=2^{11}\)`, igaz: true, miert: T`\(2^{10}+2^{10}=2\cdot2^{10}=2^{11}\).` },
      { allitas: T`\(x\cdot x^4=x^4\)`, igaz: false, miert: T`\(x=x^1\), tehát \(x^{1+4}=x^5\).` },
      { allitas: T`\(\frac{10^9}{10^6}=1000\)`, igaz: true, miert: T`\(10^{9-6}=10^3=1000\).` },
      { allitas: T`\(4^3=2^6\)`, igaz: true, miert: T`\(4^3=\left(2^2\right)^3=2^6=64\).`, szint: 'emelt' },
      { general() { const m = R(2, 7), n = R(2, 7); const ok = R(0, 1) === 1; const e = ok ? m + n : m * n; return { allitas: T`\(a^{${m}}\cdot a^{${n}}=a^{${e}}\)`, igaz: e === m + n, miert: T`A kitevők összeadódnak: \(${m}+${n}=${m + n}\).` }; } },
      { general() { const m = R(2, 5), n = R(2, 5); const ok = R(0, 1) === 1; const e = ok ? m * n : m + n; return { allitas: T`\(\left(b^{${m}}\right)^{${n}}=b^{${e}}\)`, igaz: e === m * n, miert: T`A kitevők szorzódnak: \(${m}\cdot ${n}=${m * n}\).` }; } }
    ],
    mintapelda: {
      feladat: T`Számítsuk ki: \(\dfrac{\left(5^2\right)^3\cdot5^4}{5^9}\)`,
      lepesek: [
        T`Hatvány hatványa: \(\left(5^2\right)^3=5^{2\cdot3}=5^6\).`,
        T`Szorzás: \(5^6\cdot5^4=5^{6+4}=5^{10}\).`,
        T`Osztás: \(5^{10}:5^9=5^{10-9}=5^1\).`,
        T`\[\frac{\left(5^2\right)^3\cdot5^4}{5^9}=5\]`
      ]
    },
    feladatok: M7.wrap(G)
  });
})();
