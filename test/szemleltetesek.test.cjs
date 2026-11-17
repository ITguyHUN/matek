const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');

function environment(width = 360) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="box"></div></body></html>', { runScripts: 'outside-only', url: 'https://example.test/' });
  const context = dom.getInternalVMContext();
  Object.defineProperty(dom.window.HTMLElement.prototype, 'clientWidth', { get: () => width });
  dom.window.ResizeObserver = class { observe() {} disconnect() {} };
  const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  run('assets/mathlib.js'); run('assets/szemleltetesek.js');
  return { dom, window: dom.window, run, lib: dom.window.Szemleltetesek, box: dom.window.document.getElementById('box') };
}

test('másodfokú, lineáris és azonosan nulla egyenlet külön kezelése', () => {
  const e = environment(), q = e.lib.matematika.quadratic;
  assert.deepEqual(Array.from(q(1, -2, 1).roots), [1]);
  assert.equal(q(1, 0, 1).roots.length, 0);
  assert.deepEqual(Array.from(q(0, 2, -6).roots), [3]);
  assert.equal(q(0, 0, 0).all, true);
  assert.equal(q(0, 0, 2).all, false);
  for (let a = -2; a <= 2; a++) for (let b = -6; b <= 6; b++) for (let c = -4; c <= 4; c++) {
    const result = q(a, b, c);
    result.roots.forEach(x => assert.ok(Math.abs(a * x * x + b * x + c) < 1e-8));
  }
  e.dom.window.close();
});

test('szinusztétel: nincs, érintő, két háromszög, egy háromszög és elfajuló határ', () => {
  const e = environment(), ssa = e.lib.matematika.ssa;
  [[3, 0], [4, 1], [6, 2], [8, 1], [9, 1]].forEach(([a, count]) => assert.equal(ssa(a, 8, 30).length, count));
  for (let alpha = 20; alpha <= 80; alpha += 5) for (let a = 2; a <= 10; a += .5) {
    const angle = alpha * Math.PI / 180;
    ssa(a, 8, alpha).forEach(c => { assert.ok(c > 0); assert.ok(Math.abs((c * Math.cos(angle) - 8) ** 2 + (c * Math.sin(angle)) ** 2 - a * a) < 1e-8); });
  }
  e.dom.window.close();
});

test('az összes aktív fejezet kap szemléltetést; a meglévő 15 változatlan', () => {
  const e = environment(); let course, chapter, total = 0, added = 0, preserved = 0;
  e.window.Tananyag = { kurzus(d) { course = d; }, fejezet(d) { chapter = d; } };
  for (const grade of [7, 9, 10, 11]) {
    e.run(`tananyag/${grade}/kurzus.js`);
    for (const topic of course.temakorok.filter(t => t.aktiv !== false)) for (const entry of topic.fejezetek) {
      if (String(entry).startsWith('//')) continue;
      const file = typeof entry === 'string' ? entry : entry.fajl;
      const relative = `${grade}/${topic.mappa}/${file}`;
      chapter = null; e.run('tananyag/' + relative); assert.ok(chapter, relative);
      const old = chapter.grafikon, originalTasks = chapter.feladatok, originalId = chapter.id;
      e.lib.kiegeszit(chapter, relative);
      assert.ok(chapter.grafikon, relative + ': nincs szemléltetés');
      assert.equal(chapter.id, originalId); assert.equal(chapter.feladatok, originalTasks);
      if (old) { preserved++; assert.equal(chapter.grafikon, old); } else added++;
      total++;
    }
  }
  assert.equal(total, 88); assert.equal(preserved, 15); assert.equal(added, 73);
  const unknown = { id: 'uj', feladatok: {} }; e.lib.kiegeszit(unknown, 'ismeretlen'); assert.equal(unknown.grafikon, undefined);
  e.window.close();
});

for (const width of [240, 360, 520]) test(`minden új szemléltetés működik ${width} px szélességen és a vezérlők határértékein`, () => {
  const e = environment(width), doc = e.window.document;
  for (const [relative] of Object.entries(e.lib.leirasok)) {
    const def = {}; e.lib.kiegeszit(def, relative); def.grafikon(e.box);
    const check = () => {
      const svg = e.box.querySelector('svg'); assert.ok(svg, relative);
      assert.ok(!/NaN|Infinity|undefined/.test(svg.outerHTML), relative);
      assert.ok(e.box.querySelector('.ftex').textContent.length, relative);
      assert.ok(e.box.querySelector('.props dd'), relative);
      assert.ok(e.box.querySelector('[aria-live="polite"]'), relative);
      for (const control of e.box.querySelectorAll('input,select')) assert.ok(doc.querySelector(`label[for="${control.id}"]`), relative);
    };
    check();
    for (const input of e.box.querySelectorAll('input[type="range"]')) {
      for (const v of [input.min, input.max]) { input.value = v; input.dispatchEvent(new e.window.Event('input')); check(); }
    }
    for (const select of e.box.querySelectorAll('select')) {
      for (const opt of select.options) { select.value = opt.value; select.dispatchEvent(new e.window.Event('change')); check(); }
    }
  }
  e.window.close();
});

test('hamis gyök ellenőrzése, és a kizárt érték megmarad egyszerűsítés után', () => {
  const e = environment(), def = {};
  e.lib.kiegeszit(def, '10/masodfoku-egyenlet/09-negyzetgyokos.js'); def.grafikon(e.box);
  const select = e.box.querySelector('select'); select.value = 'check'; select.dispatchEvent(new e.window.Event('change'));
  assert.match(e.box.textContent, /2 ≠ −2/);
  const rational = {}; e.lib.kiegeszit(rational, '9/algebra-szamelmelet/08-algebrai-tortek.js'); rational.grafikon(e.box);
  const inputs = e.box.querySelectorAll('input'); inputs[1].value = inputs[0].value; inputs[1].dispatchEvent(new e.window.Event('input'));
  assert.match(e.box.textContent, /eredeti tört nincs értelmezve/);
  e.window.close();
});
