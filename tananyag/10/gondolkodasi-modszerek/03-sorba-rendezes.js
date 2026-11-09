/*
 * Gondolkodási módszerek / 3. fejezet – Sorba rendezési problémák (permutáció, ismétléses permutáció)
 * Témakör: Gondolkodási módszerek (Sokszínű matematika 10., 1. fejezet 3. lecke; TK 28/1–14; FGY 2028–2052)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { fakt, kulonbozo, az, FMT10 } = M10;
  const feladatok = {};
  const B = x => bigT(x);
  const NEVEK = ['Anna', 'Bence', 'Csilla', 'Dani', 'Emma', 'Feri', 'Gabi', 'Hanna', 'Ivett', 'Jani'];
  /* magyar betűk: kétjegyű és háromjegyű betűk egynek számítanak */
  function betuk(szo) { const out = []; let i = 0; const s = szo.toUpperCase();
    while (i < s.length) { const h3 = s.substr(i, 3), h2 = s.substr(i, 2);
      if (h3 === 'DZS') { out.push(h3); i += 3; } else if (['CS', 'DZ', 'GY', 'LY', 'NY', 'SZ', 'TY', 'ZS'].includes(h2)) { out.push(h2); i += 2; } else { out.push(s[i]); i++; } }
    return out; }
  const SZAVAK = ['SZEGED', 'MATEMATIKA', 'ANANÁSZ', 'KAKAÓ', 'BANÁN', 'PAPAGÁJ', 'KUKORICA', 'KALAPÁCS', 'TAPOLCA', 'BALATON', 'PANNONHALMA', 'ABRAKADABRA', 'MISSISSIPPI', 'SZOMBATHELY', 'NAGYKANIZSA', 'TISZA', 'DEBRECEN', 'KECSKEMÉT', 'MOSONMAGYARÓVÁR', 'LEGO', 'ALMA', 'PITYPANG'];

  feladatok.perm = { nev: 'Különböző elemek sorrendje', general() {
    const n = R(3, 10); const [mit, hogy] = P([['ember', 'Hányféle sorrendben léphet be az ajtón'], ['különböző könyv', 'Hányféle sorrendben tehetjük fel a polcra egymás mellé'],
      ['futó', 'Hányféle sorrendben érhet célba (holtverseny nélkül)'], ['különböző kocsi', 'Hányféle sorrendben akaszthatjuk a mozdony után'], ['különböző virágtő', 'Hányféle sorrendben ültethetjük el egy sorba'], ['tanuló', 'Hányféle sorrendben állhat sorba a menzán'], ['különböző betű', 'Hányféle sorrendben írhatjuk le egymás után'], ['különböző színű golyó', 'Hányféle sorrendben rakhatjuk egy sorba'], ['zeneszám', 'Hányféle sorrendben játszhatja le a lejátszó'], ['előadó', 'Hányféle sorrendben léphet fel egy koncerten']]);
    return { kerdes: `<p>${n} ${mit}. ${hogy}?</p>`, valasz: { ertekek: [fakt(n)] }, formatum: FMT10.egesz,
      tipp: T`Az első helyre ${n}, a másodikra ${n - 1}, … elem közül választhatunk: \(${n}!\).`,
      megoldas: [T`\[${n}!=${Array.from({ length: n }, (_, i) => n - i).join(T`\cdot `)}=${B(fakt(n))}\]`] };
  } };

  feladatok.ismperm = { nev: 'Ismétléses permutáció', general() {
    const t = R(0, 2);
    if (t === 0) { const szo = P(SZAVAK); const bt = betuk(szo); const db = {}; bt.forEach(b => { db[b] = (db[b] || 0) + 1; });
      const ism = Object.entries(db).filter(([, v]) => v > 1); const ans = Math.round(fakt(bt.length) / ism.reduce((p, [, v]) => p * fakt(v), 1));
      if (ans > 5e7) return feladatok.ismperm.general();
      return { kerdes: `<p>Hányféle (nem feltétlenül értelmes) szót kaphatunk, ha a(z) <b>${szo}</b> szó betűit minden lehetséges sorrendbe rakjuk? (A kétjegyű betűk, pl. SZ, GY, egy betűnek számítanak.)</p>`.replace('a(z)', ['A', 'E', 'I', 'O', 'U', 'Á', 'É', 'Í', 'Ó', 'Ö', 'Ő', 'Ú', 'Ü', 'Ű'].includes(szo[0]) ? 'az' : 'a'),
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
        tipp: 'Ha az ismétlődő betűk is különbözők lennének, n! sorrend lenne. Az egyforma betűk egymás közti cseréje nem ad új szót: ezek sorrendjével osztani kell.',
        megoldas: [`Betűk (${bt.length} db): ${bt.join(', ')}.${ism.length ? ' Ismétlődők: ' + ism.map(([b, v]) => `${b} (${v}×)`).join(', ') + '.' : ' Mindegyik különböző.'}`,
          T`\[${ism.length ? T`\frac{${bt.length}!}{${ism.map(([, v]) => v + '!').join(T`\cdot `)}}` : `${bt.length}!`}=${B(ans)}\]`] };
    }
    if (t === 1) { const [a, b, c] = [R(1, 4), R(1, 4), R(0, 3)]; const n = a + b + c; const ans = fakt(n) / (fakt(a) * fakt(b) * fakt(c));
      const reszek = [[a, 'piros'], [b, 'kék'], [c, 'zöld']].filter(x => x[0] > 0);
      return { kerdes: `<p>${reszek.map(x => `${x[0]} ${x[1]}`).join(', ')} golyót egy sorba rakunk (az azonos színű golyók egyformák). Hányféle színsorrend alakulhat ki?</p>`.replace(/, (?=[^,]*golyót)/, ' és '),
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Ismétléses permutáció: n!-t osztjuk az egyforma elemek darabszámainak faktoriálisaival.',
        megoldas: [T`\[\frac{${n}!}{${reszek.map(x => x[0] + '!').join(T`\cdot `)}}=${B(ans)}\]`] };
    }
    const n = R(4, 12), k = R(1, n - 1); const ans = Math.round(fakt(n) / (fakt(k) * fakt(n - k)));
    return { kerdes: `<p>Egy érmét ${n}-szor feldobunk, és a dobások sorrendjét is feljegyezzük. Hány olyan dobássorozat van, amelyben pontosan ${k} fej van?</p>`.replace(`${n}-szor`, M10.szer(n)),
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: `${k} fej (F) és ${n - k} írás (I) sorrendjét kell megszámolni: ismétléses permutáció.`,
      megoldas: [T`\[\frac{${n}!}{${k}!\cdot ${n - k}!}=${B(ans)}\]`] };
  } };

  feladatok.feltetel = { nev: 'Sorba rendezés feltétellel', general() {
    const t = R(0, 5);
    if (t <= 3) { const n = R(4, 9); const [a, b] = M10.keverd(NEVEK).slice(0, 2); const fo = `${n} gyerek (köztük ${a} és ${b})`;
      const v = [[`${a} és ${b} egymás mellett álljon`, 2 * fakt(n - 1), T`2\cdot ${n - 1}!`, `${a}-t és ${b}-t „összeragasztjuk” egy elemmé: ${n - 1} elem sorrendje, és a párt kétféleképpen rendezhetjük.`],
        [`${a} és ${b} ne álljon egymás mellett`, fakt(n) - 2 * fakt(n - 1), T`${n}!-2\cdot ${n - 1}!`, `Az összes sorrendből levonjuk azokat, ahol egymás mellett állnak.`],
        [`${a} álljon az első helyen`, fakt(n - 1), T`${n - 1}!`, `Az első hely rögzített, a többiek sorrendje tetszőleges.`],
        [`${a} és ${b} a sor két szélén álljon`, 2 * fakt(n - 2), T`2\cdot ${n - 2}!`, `A két szélső helyre kétféleképpen állhatnak, a többiek a középső ${n - 2} helyen tetszőleges sorrendben.`]][t];
      return { kerdes: `<p>${fo} sorba áll. Hányféleképpen tehetik meg, ha azt szeretnénk, hogy ${v[0]}?</p>`, valasz: { ertekek: [v[1]] }, formatum: FMT10.egesz,
        tipp: 'Gondold végig, melyik elemek helye kötött, és mi a többiek szabad sorrendje!', megoldas: [v[3], T`\[${v[2]}=${B(v[1])}\]`] }; }
    if (t === 4) { const k = R(2, 5); const ans = fakt(k) * 2 ** k;
      return { kerdes: `<p>${k} házaspár egy sorban ül le a moziban (egymás melletti székekre). Hányféleképpen ülhetnek le, ha minden házaspár egymás mellett ül?</p>`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'A párokat egy-egy egységnek tekintve előbb a párok sorrendjét, majd a párokon belüli sorrendet számold!',
        megoldas: [T`A ${k} pár sorrendje \(${k}!\), mindegyik páron belül 2 sorrend: \[${k}!\cdot 2^{${k}}=${B(ans)}\]`] }; }
    const k = R(2, 5); const ans = 2 * fakt(k) ** 2;
    return { kerdes: `<p>${k} fiú és ${k} lány sorba áll úgy, hogy fiúk és lányok felváltva következnek. Hány ilyen sorrend van?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Kezdhet fiú vagy lány (2 lehetőség); utána a fiúk egymás közti és a lányok egymás közti sorrendje.',
      megoldas: [T`\[2\cdot ${k}!\cdot ${k}!=${B(ans)}\]`] };
  } };

  feladatok.kor = { nev: 'Körbe rendezés', general() {
    const n = R(3, 12); const t = R(0, 2);
    if (t === 0) return { kerdes: `<p>${n} ${P(['ember', 'vendég', 'gyerek', 'lovag', 'barát'])} ül le egy kerek asztal köré. Hányféleképpen ülhetnek le, ha csak az számít, hogy kinek ki a jobb és ki a bal oldali szomszédja?</p>`,
      valasz: { ertekek: [fakt(n - 1)] }, formatum: FMT10.egesz, tipp: 'Az elforgatással egymásba vihető ülésrendek egyformák: rögzítsd egy ember helyét!',
      megoldas: [`Egy ember helyét rögzítjük, a többiek sorrendje: (${n} − 1)!`, T`\[${n - 1}!=${B(fakt(n - 1))}\]`] };
    const m = Math.max(n, 3); const ans = fakt(m - 1) / 2;
    return { kerdes: t === 1 ? `<p>${m} különböző kulcsot fűzünk fel egy kulcskarikára. Hányféleképpen tehetjük ezt meg? (A karika elforgatása és megfordítása nem ad új elrendezést.)</p>` : `<p>${m} különböző gyöngyből nyakláncot fűzünk. Hány különböző nyaklánc készülhet? (Az elforgatás és a megfordítás nem ad új nyakláncot.)</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Körbe rendezésnél (n − 1)! sorrend van; ha a megfordítás sem számít, ezt még 2-vel osztjuk.',
      megoldas: [T`\[\frac{(${m}-1)!}{2}=\frac{${B(fakt(m - 1))}}{2}=${B(ans)}\]`] };
  } };

  feladatok.szamjegy = { nev: 'Számok a megadott jegyekből', general() {
    const t = R(0, 2);
    if (t === 0) { const nulla = R(0, 1) === 1; const n = R(3, 6); const jegyek = (nulla ? [0, ...kulonbozo(n - 1, 1, 9)] : kulonbozo(n, 1, 9)).sort((a, b) => a - b);
      const ans = nulla ? fakt(n) - fakt(n - 1) : fakt(n);
      return { kerdes: `<p>Hány különböző ${n}-jegyű számot írhatunk fel a ${jegyek.join(', ')} számjegyekből, ha mindegyiket pontosan egyszer használjuk fel?</p>`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: nulla ? 'A 0 nem állhat az első helyen! Az összes sorrendből vond le azokat, amelyek 0-val kezdődnek.' : 'Ez a számjegyek sorba rendezése.',
        megoldas: [nulla ? T`\[${n}!-${n - 1}!=${B(fakt(n))}-${B(fakt(n - 1))}=${B(ans)}\]` : T`\[${n}!=${B(ans)}\]`] }; }
    if (t === 1) { const n = R(4, 6); const jegyek = kulonbozo(n, 1, 9).sort((a, b) => a - b); const ps = jegyek.filter(x => x % 2 === 0).length;
      if (!ps) return feladatok.szamjegy.general();
      const ans = ps * fakt(n - 1);
      return { kerdes: `<p>A ${jegyek.join(', ')} számjegyek mindegyikét pontosan egyszer felhasználva ${n}-jegyű számokat írunk fel. Hány ezek közül a <b>páros</b>?</p>`,
        valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: 'Az utolsó helyre csak páros számjegy kerülhet. Utána a többi jegy sorrendje tetszőleges.',
        megoldas: [`Az utolsó jegy ${ps}-féle lehet (${jegyek.filter(x => x % 2 === 0).join(', ')}), a többi ${n - 1} jegy sorrendje (${n - 1})!:`, T`\[${ps}\cdot ${n - 1}!=${B(ans)}\]`] }; }
    // ismétlődő jegyek
    const a = R(1, 9); let b; do { b = R(0, 9); } while (b === a); const ka = R(2, 3), kb = R(1, 3); const n = ka + kb;
    let ans = fakt(n) / (fakt(ka) * fakt(kb)); let mo = T`\[\frac{${n}!}{${ka}!\cdot ${kb}!}=${ans}\]`;
    if (b === 0) { const roszz = fakt(n - 1) / (fakt(ka) * fakt(kb - 1)); mo = T`\[\frac{${n}!}{${ka}!\cdot ${kb}!}-\frac{${n - 1}!}{${ka}!\cdot ${kb - 1}!}=${ans}-${roszz}=${ans - roszz}\]`; ans -= roszz; }
    const jegyes = d => `${d}-${['s', 'es', 'es', 'as', 'es', 'ös', 'os', 'es', 'as', 'es'][d]}`;
    return { kerdes: `<p>Hány különböző ${n}-jegyű szám írható fel ${ka} darab ${jegyes(a)} és ${kb} darab ${jegyes(b)} számjeggyel (mindegyiket felhasználva)?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz, tipp: b === 0 ? 'Ismétléses permutáció, de a 0-val kezdődő sorrendeket le kell vonni!' : 'Ismétléses permutáció.',
      megoldas: [mo] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'gsorba',
    cim: 'Sorba rendezési problémák',
    rovid: 'Sorba rendezés',
    bevezeto: 'Hányféle sorrendben…? A kérdésre a válasz a faktoriális – ha pedig egyforma elemek is vannak, osztanunk kell.',
    elmelet: T`<div class="tbl"><table><tr><th>Feladat</th><th>Képlet</th><th>Példa</th></tr>
<tr><td>\(n\) különböző elem sorrendje (permutáció)</td><td>\(n!=n\cdot(n-1)\cdot\ldots\cdot2\cdot1\)</td><td>5 ember: \(5!=120\)</td></tr>
<tr><td>ismétléses permutáció (\(k_1,k_2,\dots\) egyforma)</td><td>\(\dfrac{n!}{k_1!\cdot k_2!\cdots}\)</td><td>a, a, a, b, b: \(\frac{5!}{3!\cdot2!}=10\)</td></tr>
<tr><td>\(n\) elem körbe rendezése</td><td>\((n-1)!\)</td><td>5 ember kerek asztalnál: \(4!=24\)</td></tr></table></div>
<div class="prose"><ul>
<li>Megállapodás: \(0!=1\) és \(1!=1\).</li>
<li><b>Egymás mellett:</b> a két elemet „összeragasztjuk”: \(2\cdot(n-1)!\). <b>Nem egymás mellett:</b> összes − egymás mellett.</li>
<li>Számjegyekből képzett számoknál a 0 nem állhat az első helyen.</li></ul></div>`,
    igazHamis: [
      { allitas: T`\(5!=120\)`, igaz: true, miert: T`\(5\cdot4\cdot3\cdot2\cdot1=120\).` },
      { allitas: T`\(0!=0\)`, igaz: false, miert: T`Megállapodás szerint \(0!=1\).` },
      { allitas: 'A SZEGED szó betűiből 6! = 720 különböző betűsor rakható ki.', igaz: false, miert: T`Az SZ egy betű, és az E kétszer szerepel: \(\frac{5!}{2!}=60\).` },
      { allitas: '4 ember egy kerek asztal körül (csak a szomszédok számítanak) 6-féleképpen ülhet le.', igaz: true, miert: T`\((4-1)!=6\).` },
      { allitas: T`\(\frac{6!}{4!}=30\)`, igaz: true, miert: T`\(\frac{720}{24}=30\), vagy \(6\cdot5\).` },
      { general() { const n = R(3, 7); const jo = R(0, 1) === 1; const v = jo ? fakt(n) : fakt(n) / n;
        return { allitas: `${n} különböző könyvet ${v}-féleképpen tehetünk sorba a polcon.`, igaz: v === fakt(n), miert: T`\(${n}!=${fakt(n)}\).` }; } }
    ],
    mintapelda: {
      feladat: 'Hány ötbetűs „szó” rakható ki az a, a, a, b, b betűkből?',
      lepesek: ['Ha a betűk mind különbözők lennének: 5! = 120 sorrend.', 'Az a betűk egymás közti 3! = 6 cseréje és a b betűk 2! = 2 cseréje nem ad új szót.', T`\[\frac{5!}{3!\cdot 2!}=\frac{120}{12}=10\]`]
    },
    feladatok
  }));
})();
