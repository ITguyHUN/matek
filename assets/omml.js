/*
 * Matek gyakorló – MathML → OMML (Word-egyenlet) átalakító a dolgozatkészítőhöz.
 * A Word-fájlba így szerkeszthető egyenletek kerülnek (nem képek).
 * Omml.fromTex(tex, display) → '<m:oMath>…</m:oMath>' vagy null, ha nem sikerült (ekkor kép marad).
 * A MathML-t a MathJax adja (MathJax.tex2mml); a gyakori szerkezeteket kezeli: tört, hatvány, index,
 * gyök, n-edik gyök, zárójelpár (\left … \right), ékezet (pont, vonal), alá-/fölékapcsos, táblázat, szöveg.
 */
(function () {
'use strict';
const xe = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FONT = '<w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr>';
const run = (t, egyenes, szoveg) => t === '' ? '' :
  `<m:r>${egyenes || szoveg ? `<m:rPr>${szoveg ? '<m:nor/>' : ''}<m:sty m:val="p"/></m:rPr>` : ''}${FONT}<m:t xml:space="preserve">${xe(t)}</m:t></m:r>`;
const LATHATATLAN = /[⁡⁢⁣⁤]/g;
const EKEZET = { '˙': '̇', '.': '̇', '¨': '̈', '^': '̂', 'ˆ': '̂', '~': '̃', '˜': '̃',
                 '→': '⃗', '⃗': '⃗', '´': '́', '`': '̀', 'ˇ': '̌', '˘': '̆' };
const VONAL = /^[¯‾―_̲—-]$/;
const NARY = /^[∑∏∫∬∭∮⋂⋃]$/;
const gyerek = el => Array.from(el.children);
const szoveg = el => (el.textContent || '').replace(LATHATATLAN, '');

function elem(el) {
  const t = el.localName;
  const c = gyerek(el);
  switch (t) {
    case 'math': case 'mstyle': case 'mpadded': case 'menclose': case 'mtd': return sor(c);
    case 'semantics': return c.length ? elem(c[0]) : '';
    case 'annotation': case 'annotation-xml': case 'mphantom': case 'none': case 'mprescripts': return '';
    case 'mrow': return mrow(el);
    case 'mi': { const x = szoveg(el); return run(x, el.getAttribute('mathvariant') === 'normal' || x.length > 1); }
    case 'mn': return run(szoveg(el), true);
    case 'mo': return run(szoveg(el), true);
    case 'mtext': case 'ms': return run(szoveg(el).replace(/ /g, ' '), false, true);
    case 'mspace': { const w = parseFloat(el.getAttribute('width') || '0'); return w >= 0.15 ? run(w >= 0.9 ? ' ' : ' ', true) : ''; }
    case 'mfrac': {
      const nincsVonal = /^0/.test(el.getAttribute('linethickness') || '');
      return `<m:f>${nincsVonal ? '<m:fPr><m:type m:val="noBar"/></m:fPr>' : ''}<m:num>${elem(c[0])}</m:num><m:den>${elem(c[1])}</m:den></m:f>`;
    }
    case 'msup': return `<m:sSup><m:e>${elem(c[0])}</m:e><m:sup>${elem(c[1])}</m:sup></m:sSup>`;
    case 'msub': return `<m:sSub><m:e>${elem(c[0])}</m:e><m:sub>${elem(c[1])}</m:sub></m:sSub>`;
    case 'msubsup': return `<m:sSubSup><m:e>${elem(c[0])}</m:e><m:sub>${elem(c[1])}</m:sub><m:sup>${elem(c[2])}</m:sup></m:sSubSup>`;
    case 'msqrt': return `<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>${sor(c)}</m:e></m:rad>`;
    case 'mroot': return `<m:rad><m:deg>${elem(c[1])}</m:deg><m:e>${elem(c[0])}</m:e></m:rad>`;
    case 'mover': return folott(el, c);
    case 'munder': return alatt(el, c);
    case 'munderover': {
      const alap = szoveg(c[0]).trim();
      if (NARY.test(alap)) return `<m:nary><m:naryPr><m:chr m:val="${xe(alap)}"/></m:naryPr><m:sub>${elem(c[1])}</m:sub><m:sup>${elem(c[2])}</m:sup><m:e/></m:nary>`;
      return `<m:limUpp><m:e><m:limLow><m:e>${elem(c[0])}</m:e><m:lim>${elem(c[1])}</m:lim></m:limLow></m:e><m:lim>${elem(c[2])}</m:lim></m:limUpp>`;
    }
    case 'mtable': return `<m:m>${c.map(tr => `<m:mr>${gyerek(tr).map(td => `<m:e>${elem(td)}</m:e>`).join('')}</m:mr>`).join('')}</m:m>`;
    case 'mtr': case 'mlabeledtr': return sor(c);
    case 'mmultiscripts': return sor(c);
    default: return sor(c);
  }
}
/* Egy sorozat elemei: a tizedes törtet (2{,}5 → mn , mn) egy számként, a |…| párt abszolútérték-zárójelként írja. */
const vesszo = el => el && ((el.localName === 'mo' && szoveg(el) === ',') || (el.localName === 'mrow' && el.children.length === 1 && el.children[0].localName === 'mo' && szoveg(el.children[0]) === ','));
const fuggo = el => el && ((el.localName === 'mo' && szoveg(el).trim() === '|') || (el.localName === 'mrow' && el.children.length === 1 && el.children[0].localName === 'mo' && szoveg(el.children[0]).trim() === '|'));
function sor(c) {
  let out = '';
  for (let i = 0; i < c.length; i++) {
    const el = c[i];
    if (el.localName === 'mn') {   // szám + tizedesvessző + szám → egy szám
      let t = szoveg(el), j = i;
      while (vesszo(c[j + 1]) && c[j + 2] && c[j + 2].localName === 'mn') { t += ',' + szoveg(c[j + 2]); j += 2; }
      out += run(t, true); i = j; continue;
    }
    if (fuggo(el)) {   // |…| → abszolútérték
      let j = i + 1; while (j < c.length && !fuggo(c[j])) j++;
      if (j < c.length && j > i + 1) { out += `<m:d><m:dPr><m:begChr m:val="|"/><m:endChr m:val="|"/></m:dPr><m:e>${sor(c.slice(i + 1, j))}</m:e></m:d>`; i = j; continue; }
    }
    out += elem(el);
  }
  return out;
}
/* \left( … \right) → Word-zárójelpár, amely a tartalomhoz nő */
function mrow(el) {
  const c = gyerek(el);
  if (c.length >= 2) {
    const a = c[0], z = c[c.length - 1];
    const nyit = a.localName === 'mo' && (a.getAttribute('data-mjx-texclass') === 'OPEN' || a.getAttribute('fence') === 'true');
    const zar = z.localName === 'mo' && (z.getAttribute('data-mjx-texclass') === 'CLOSE' || z.getAttribute('fence') === 'true');
    if (nyit && zar && el.getAttribute('data-mjx-texclass') === 'INNER') {
      return `<m:d><m:dPr><m:begChr m:val="${xe(szoveg(a))}"/><m:endChr m:val="${xe(szoveg(z))}"/></m:dPr><m:e>${sor(c.slice(1, -1))}</m:e></m:d>`;
    }
  }
  return sor(c);
}
function folott(el, c) {
  const jel = szoveg(c[1]).trim();
  if (VONAL.test(jel) && c[1].localName === 'mo') return `<m:bar><m:barPr><m:pos m:val="top"/></m:barPr><m:e>${elem(c[0])}</m:e></m:bar>`;
  if (jel === '⏞') return `<m:groupChr><m:groupChrPr><m:chr m:val="⏞"/><m:pos m:val="top"/><m:vertJc m:val="bot"/></m:groupChrPr><m:e>${elem(c[0])}</m:e></m:groupChr>`;
  if (c[1].localName === 'mo' && (el.getAttribute('accent') === 'true' || EKEZET[jel])) {
    return `<m:acc><m:accPr><m:chr m:val="${xe(EKEZET[jel] || jel)}"/></m:accPr><m:e>${elem(c[0])}</m:e></m:acc>`;
  }
  return `<m:limUpp><m:e>${elem(c[0])}</m:e><m:lim>${elem(c[1])}</m:lim></m:limUpp>`;
}
function alatt(el, c) {
  const jel = szoveg(c[1]).trim();
  if (jel === '⏟') return `<m:groupChr><m:groupChrPr><m:chr m:val="⏟"/><m:pos m:val="bot"/><m:vertJc m:val="top"/></m:groupChrPr><m:e>${elem(c[0])}</m:e></m:groupChr>`;
  if (VONAL.test(jel) && c[1].localName === 'mo') return `<m:bar><m:barPr><m:pos m:val="bot"/></m:barPr><m:e>${elem(c[0])}</m:e></m:bar>`;
  const alap = szoveg(c[0]).trim();
  if (NARY.test(alap)) return `<m:nary><m:naryPr><m:chr m:val="${xe(alap)}"/><m:supHide m:val="1"/></m:naryPr><m:sub>${elem(c[1])}</m:sub><m:sup/><m:e/></m:nary>`;
  return `<m:limLow><m:e>${elem(c[0])}</m:e><m:lim>${elem(c[1])}</m:lim></m:limLow>`;
}

function fromMathML(mml) {
  const doc = new DOMParser().parseFromString(mml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) return null;
  const tartalom = elem(doc.documentElement);
  return tartalom ? `<m:oMath>${tartalom}</m:oMath>` : null;
}
function fromTex(tex, display) {
  try {
    if (!window.MathJax || !MathJax.tex2mml) return null;
    return fromMathML(MathJax.tex2mml(tex, { display: !!display }));
  } catch (e) { return null; }
}
window.Omml = { fromMathML, fromTex };
})();
