/*
 * Gondolkodási módszerek / 4. fejezet – Kiválasztási problémák (ismétlés nélküli és ismétléses variáció)
 * Témakör: Gondolkodási módszerek (Sokszínű matematika 10., 1. fejezet 4. lecke; TK 31/1–10; FGY 2053–2077)
 * A fájl szerkezetét lásd: tananyag/README.md. A közös segédfüggvények a 10/kurzus.js elején vannak (M10).
 */
(function () {
  const { fakt, kulonbozo, FMT10 } = M10;
  const feladatok = {};
  const B = x => bigT(x);
  const V = (n, k) => { let p = 1; for (let i = 0; i < k; i++) p *= n - i; return p; };     // n!/(n−k)!
  const szorzat = (n, k) => Array.from({ length: k }, (_, i) => n - i).join(T`\cdot `);

  feladatok.variacio = { nev: 'Kiválasztás, a sorrend számít', general() {
    const t = R(0, 3); let n, k, kerd;
    if (t === 0) { n = R(6, 25); k = 3; kerd = `Egy versenyen ${n} versenyző indul. Hányféleképpen alakulhat a dobogó (1., 2. és 3. hely), ha nincs holtverseny?`; }
    else if (t === 1) { n = R(5, 30); k = P([2, 3, 4]); const tiszt = ['elnököt', 'titkárt', 'pénztárost', 'szóvivőt'].slice(0, k); kerd = `Egy ${n} fős osztályban ${tiszt.slice(0, -1).join(', ')} és ${tiszt[k - 1]} választanak (egy ember csak egy tisztséget kaphat). Hányféleképpen tehetik meg?`; }
    else if (t === 2) { n = R(4, 12); k = R(2, Math.min(4, n - 1)); kerd = `${n} gyerek között ${k} különböző ajándékot sorsolunk ki úgy, hogy mindenki legfeljebb egy ajándékot kaphat. Hányféle eredménye lehet a sorsolásnak?`; }
    else { n = R(5, 10); k = R(2, Math.min(5, n - 1)); kerd = `Az 1, 2, …, ${n} számkártyák közül egymás után ${k} kártyát húzunk visszatevés nélkül, és feljegyezzük a húzás sorrendjét. Hányféle eredményt kaphatunk?`; }
    const ans = V(n, k);
    return { kerdes: `<p>${kerd}</p>`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: `Az első helyre ${n}, a másodikra ${n - 1}, … lehetőség: ${k} tényező szorzata.`,
      megoldas: [`Ismétlés nélküli variáció (a sorrend számít, egy elem csak egyszer választható):`, T`\[${szorzat(n, k)}=\frac{${n}!}{${n - k}!}=${B(ans)}\]`] };
  } };

  feladatok.ismvar = { nev: 'Kiválasztás ismétléssel', general() {
    const t = R(0, 4); let n, k, kerd;
    if (t === 0) { n = P([3, 3, 4]); k = R(5, 15); kerd = `Egy ${k} kérdéses tesztben minden kérdésre ${n === 3 ? 'az A, B vagy C' : 'az A, B, C vagy D'} válasz közül kell egyet megjelölni. Hányféleképpen tölthető ki a teszt (ha minden kérdésre válaszolunk)?`; }
    else if (t === 1) { n = P([5, 6, 7, 8, 9, 10]); k = R(3, 6); kerd = `Egy számzár ${k} tárcsáján egyenként ${n === 10 ? '0-tól 9-ig' : `1-től ${n}-ig`} szerepelnek a számjegyek. Hány különböző beállítása van a zárnak?`; }
    else if (t === 2) { n = 6; k = R(2, 7); kerd = `Egy dobókockával ${M10.szer(k)} dobunk egymás után, és feljegyezzük a dobások sorrendjét. Hány különböző dobássorozat lehetséges?`; }
    else if (t === 3) { n = R(3, 12); k = R(2, 5); kerd = `${n} gyerek között ${k} különböző ajándékot sorsolunk ki úgy, hogy egy gyerek több ajándékot is kaphat. Hányféle eredménye lehet a sorsolásnak?`; }
    else { n = 2; k = R(3, 16); kerd = `Egy érmét ${M10.szer(k)} feldobunk, és feljegyezzük a fej–írás sorozatot. Hány különböző sorozat lehetséges?`; }
    const ans = n ** k;
    return { kerdes: `<p>${kerd}</p>`, valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: `Minden helyre (minden lépésben) ugyanannyi, ${n} lehetőség van, egymástól függetlenül.`,
      megoldas: [`Ismétléses variáció: ${k} helyre egyenként ${n} lehetőség.`, T`\[${n}^{${k}}=${B(ans)}\]`] };
  } };

  feladatok.szamok = { nev: 'Számok képzése számjegyekből', general() {
    const nulla = R(0, 1) === 1; const d = R(3, 6); const D = (nulla ? [0, ...kulonbozo(d - 1, 1, 9)] : kulonbozo(d, 1, 9)).sort((a, b) => a - b);
    const ism = R(0, 1) === 1; const k = ism ? R(2, 4) : R(2, Math.min(4, d)); const paros = R(0, 2) === 0 && k >= 2; const z = nulla ? 1 : 0;
    const e = D.filter(x => x % 2 === 0).length; if (paros && !e) return feladatok.szamok.general();
    let ans, mo;
    if (ism && !paros) { ans = (d - z) * d ** (k - 1); mo = T`Az első helyre ${d - z}${nulla ? ' (a 0 nem lehet)' : ''}, a többi ${k - 1} helyre ${d}-${d}: \(${d - z}\cdot ${d}^{${k - 1}}=${B(ans)}\).`; }
    else if (!ism && !paros) { ans = (d - z) * V(d - 1, k - 1); mo = T`Az első helyre ${d - z}${nulla ? ' (a 0 nem lehet)' : ''}, utána a maradék ${d - 1} jegyből ${k - 1} helyre sorrendben: \(${d - z}\cdot ${V(d - 1, k - 1)}=${B(ans)}\).`; }
    else if (ism) { ans = (d - z) * d ** (k - 2) * e; mo = T`Az utolsó jegy páros (${e}-féle), az első nem 0 (${d - z}-féle), a közbülső ${k - 2} hely ${d}-${d}-féle: \(${d - z}\cdot ${d}^{${k - 2}}\cdot ${e}=${B(ans)}\).`; }
    else { ans = 0; D.filter(x => x % 2 === 0).forEach(L => { const elso = L === 0 ? d - 1 : d - 1 - z; ans += elso * V(d - 2, k - 2); });
      mo = T`Az utolsó jegy szerint esetszétválasztás (${D.filter(x => x % 2 === 0).join(', ')}); utána az első jegy (nem 0, nem az utolsó), majd a közbülsők sorrendje. Összesen: \(${B(ans)}\).`; }
    return { kerdes: `<p>A ${D.join(', ')} számjegyekből hány ${k}-jegyű${paros ? ' <b>páros</b>' : ''} szám képezhető, ha egy számjegyet ${ism ? 'többször is' : '<b>csak egyszer</b>'} felhasználhatunk?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: `Haladj helyről helyre! ${nulla ? 'A 0 nem állhat az első helyen. ' : ''}${paros ? 'Páros szám: az utolsó jegy páros. Érdemes az utolsó jeggyel kezdeni.' : ''}`,
      megoldas: [mo],
      _ell: w => { // ellenőrzés teljes felsorolással
        let db = 0; const rek = (pref) => { if (pref.length === k) { if (pref[0] === 0) return; if (paros && pref[k - 1] % 2) return; db++; return; } for (const x of D) { if (!ism && pref.includes(x)) continue; rek([...pref, x]); } };
        rek([]); return db === w; } };
  } };

  feladatok.zaszlo = { nev: 'Zászlók, színezések', general() {
    const n = R(3, 10), k = R(3, 5); const t = R(0, 1);
    const ans = t ? V(n, k) : n * (n - 1) ** (k - 1);
    return { kerdes: `<p>${k} ${P(['vízszintes', 'függőleges'])} sávból álló zászlót készítünk ${n} különböző színből. Hányféle zászló készíthető, ha ${t ? 'minden sáv különböző színű' : 'egy szín többször is előfordulhat, de két szomszédos sáv nem lehet azonos színű'}?</p>`,
      valasz: { ertekek: [ans] }, formatum: FMT10.egesz,
      tipp: t ? 'Az első sáv bármelyik színű lehet, a következő csak a maradékból…' : 'Az első sáv bármelyik színű lehet, a többi csak az előtte lévőtől különböző.',
      megoldas: [t ? T`\[${szorzat(n, k)}=${B(ans)}\]` : T`\[${n}\cdot ${n - 1}^{${k - 1}}=${B(ans)}\]`] };
  } };

  Tananyag.fejezet(M10.tisztit({
    id: 'gvalaszt',
    cim: 'Kiválasztási problémák',
    rovid: 'Kiválasztás',
    bevezeto: 'Több elem közül néhányat választunk ki úgy, hogy a kiválasztás sorrendje is számít. Kérdés: választhatjuk-e ugyanazt többször?',
    elmelet: T`<div class="tbl"><table><tr><th>Feladat</th><th>Képlet</th><th>Példa</th></tr>
<tr><td>\(n\) elemből \(k\) kiválasztása sorrendben, ismétlés nélkül (variáció)</td><td>\(n(n-1)\cdots(n-k+1)=\dfrac{n!}{(n-k)!}\)</td><td>dobogó 10 versenyzőből: \(10\cdot9\cdot8=720\)</td></tr>
<tr><td>\(n\) elemből \(k\) kiválasztása sorrendben, ismétléssel</td><td>\(n^k\)</td><td>4 jegyű PIN-kód: \(10^4\)</td></tr></table></div>
<div class="prose"><ul>
<li>Kérdezd meg magadtól: <b>számít a sorrend?</b> <b>lehet ismétlés?</b></li>
<li>Haladj „helyről helyre” (első hely, második hely, …), és szorozd össze a lehetőségek számát (<b>szorzási szabály</b>).</li>
<li>Ha valamelyik helyre megkötés van (pl. 0 nem lehet az első jegy, a szám páros), azzal a hellyel kezdd!</li></ul></div>`,
    igazHamis: [
      { allitas: '10 versenyzőből a dobogó 10 · 9 · 8 = 720-féleképpen alakulhat.', igaz: true, miert: 'Ismétlés nélküli variáció.' },
      { allitas: 'Egy 4 jegyű PIN-kód (0–9 jegyek, ismétlés megengedett) 10 · 9 · 8 · 7-féle lehet.', igaz: false, miert: T`Ismétléssel: \(10^4=10\,000\).` },
      { allitas: 'Az 1, 2, 3 jegyekből ismétléssel 27 háromjegyű szám képezhető.', igaz: true, miert: T`\(3^3=27\).` },
      { allitas: 'A 0, 1, 2 jegyekből (mindegyiket egyszer használva) 6 háromjegyű szám képezhető.', igaz: false, miert: T`A 0 nem lehet elöl: \(3!-2!=4\).` },
      { general() { const n = R(3, 8), k = R(2, 4); const jo = R(0, 1) === 1; return { allitas: `${n} gyerek között ${k} különböző ajándék, egy gyerek többet is kaphat: ${jo ? n ** k : V(n, k)} lehetőség.`, igaz: jo || n ** k === V(n, k), miert: T`Ismétléses variáció: \(${n}^{${k}}=${n ** k}\).` }; } }
    ],
    mintapelda: {
      feladat: 'Az 1, 2, 3, 4 számjegyekből (ismétlés megengedett) hány 2000-nél nagyobb négyjegyű szám képezhető?',
      lepesek: ['Az első jegy 2, 3 vagy 4 lehet: 3 lehetőség (a 2-vel kezdődők mind nagyobbak 2000-nél, mert nincs 0 jegy).', 'A többi három helyre 4-4 lehetőség van.', T`\[3\cdot4^3=192\]`]
    },
    feladatok
  }));
})();
