/*
 * Matek gyakorló – egyszerű .docx-készítő (külső könyvtár nélkül).
 * Bekezdések, félkövér/dőlt/felső-alsó index, tabulátor, képek (PNG) és egyszerű táblázatok.
 *
 * Docx.build(blocks) → Blob
 *  blocks: [{ t: 'p', runs, align, indent: { left, hanging }, before, after, keepNext, pageBreakBefore, tabs: [twip] }
 *           { t: 'table', rows: [[runs, …], …], header: true }]
 *  runs:   [{ text, b, i, sup, sub, size }  |  { tab: true }  |  { br: true }
 *           { img: { data: Uint8Array (PNG), w: px, h: px }, pos: félpont (függőleges eltolás) }]
 */
(function () {
'use strict';
const enc = new TextEncoder();
const xe = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- ZIP (tömörítés nélkül, „store”) ---------- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zip(files) {   // files: [{ name, data: Uint8Array }]
  const parts = [], central = []; let off = 0;
  for (const f of files) {
    const name = enc.encode(f.name), d = f.data, crc = crc32(d);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, 0, true); h.setUint16(12, 0x21, true); h.setUint32(14, crc, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true);
    h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(new Uint8Array(h.buffer), name, d);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
    c.setUint16(12, 0, true); c.setUint16(14, 0x21, true); c.setUint32(16, crc, true); c.setUint32(20, d.length, true); c.setUint32(24, d.length, true);
    c.setUint16(28, name.length, true); c.setUint32(42, off, true);
    central.push(new Uint8Array(c.buffer), name);
    off += 30 + name.length + d.length;
  }
  const csize = central.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csize, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

/* ---------- WordprocessingML ---------- */
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
const EMU = 9525;   // 1 px (96 dpi) EMU-ban

function build(blocks) {
  const media = []; let pid = 0;
  const run = r => {
    if (r.tab) return '<w:r><w:tab/></w:r>';
    if (r.br) return '<w:r><w:br/></w:r>';
    if (r.img) {
      media.push(r.img.data); const n = media.length; pid++;
      const cx = Math.max(1, Math.round(r.img.w * EMU)), cy = Math.max(1, Math.round(r.img.h * EMU));
      return `<w:r>${r.pos ? `<w:rPr><w:position w:val="${Math.round(r.pos)}"/></w:rPr>` : ''}<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${pid}" name="Képlet ${pid}"/>` +
        `<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${pid}" name="kep${n}.png"/><pic:cNvPicPr/></pic:nvPicPr>` +
        `<pic:blipFill><a:blip r:embed="rImg${n}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }
    const pr = (r.b ? '<w:b/>' : '') + (r.i ? '<w:i/>' : '') + (r.sup ? '<w:vertAlign w:val="superscript"/>' : r.sub ? '<w:vertAlign w:val="subscript"/>' : '') + (r.size ? `<w:sz w:val="${Math.round(r.size * 2)}"/>` : '') + (r.color ? `<w:color w:val="${r.color}"/>` : '');
    return `<w:r>${pr ? `<w:rPr>${pr}</w:rPr>` : ''}<w:t xml:space="preserve">${xe(r.text || '')}</w:t></w:r>`;
  };
  const para = p => {
    const pr = (p.keepNext ? '<w:keepNext/>' : '') + (p.pageBreakBefore ? '<w:pageBreakBefore/>' : '') +
      (p.tabs && p.tabs.length ? `<w:tabs>${p.tabs.map(x => `<w:tab w:val="${x < 0 ? 'right' : 'left'}" w:pos="${Math.abs(x)}"/>`).join('')}</w:tabs>` : '') +
      `<w:spacing w:before="${p.before || 0}" w:after="${p.after == null ? 80 : p.after}"/>` +
      (p.indent ? `<w:ind w:left="${p.indent.left || 0}"${p.indent.hanging ? ` w:hanging="${p.indent.hanging}"` : ''}/>` : '') +
      (p.align ? `<w:jc w:val="${p.align === 'center' ? 'center' : p.align === 'right' ? 'right' : 'left'}"/>` : '');
    return `<w:p><w:pPr>${pr}</w:pPr>${(p.runs || []).map(run).join('')}</w:p>`;
  };
  const table = t => {
    const cols = Math.max(...t.rows.map(r => r.length));
    const b = '<w:top w:val="single" w:sz="4" w:color="808080"/><w:left w:val="single" w:sz="4" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:color="808080"/><w:right w:val="single" w:sz="4" w:color="808080"/><w:insideH w:val="single" w:sz="4" w:color="808080"/><w:insideV w:val="single" w:sz="4" w:color="808080"/>';
    return `<w:tbl><w:tblPr><w:tblBorders>${b}</w:tblBorders>${t.indent ? `<w:tblInd w:w="${t.indent}" w:type="dxa"/>` : ''}<w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${'<w:gridCol/>'.repeat(cols)}</w:tblGrid>` +
      t.rows.map((r, ri) => `<w:tr>${Array.from({ length: cols }, (_, ci) => `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>${para({ runs: (r[ci] || []).map(x => ri === 0 && t.header ? Object.assign({ b: true }, x) : x), after: 0, align: 'center' })}</w:tc>`).join('')}</w:tr>`).join('') +
      '</w:tbl>' + para({ runs: [], after: 60 });
  };
  const body = blocks.map(x => x.t === 'table' ? table(x) : para(x)).join('');
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}` +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>${media.map((_, i) => `<Relationship Id="rImg${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/kep${i + 1}.png"/>`).join('')}</Relationships>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="hu-HU"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>`;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`;
  const root = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rDoc" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  return zip([
    { name: '[Content_Types].xml', data: enc.encode(types) },
    { name: '_rels/.rels', data: enc.encode(root) },
    { name: 'word/document.xml', data: enc.encode(doc) },
    { name: 'word/styles.xml', data: enc.encode(styles) },
    { name: 'word/_rels/document.xml.rels', data: enc.encode(rels) },
    ...media.map((d, i) => ({ name: `word/media/kep${i + 1}.png`, data: d }))
  ]);
}
window.Docx = { build, zip };
})();
