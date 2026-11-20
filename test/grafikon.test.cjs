/* A koordináta-rendszer (assets/grafikon.js) tesztjei: a bejelölt pontok ellenőrzése és a kirajzolás. */
const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../assets/grafikon.js');
const P = (...p) => ({ pontok: p.map(([x, y]) => ({ x, y })) });
const ell = (grafikon, fajta, ...p) => G.ellenoriz({ grafikon, fajta }, P(...p));

test('egyenes: bármely két pontja jó, a sorrend nem számít', () => {
  assert.equal(ell('2x-3', 'egyenes', [0, -3], [1, -1]).ok, true);
  assert.equal(ell('2x-3', 'egyenes', [3, 3], [-1, -5]).ok, true);
  assert.equal(ell('2x-3', 'egyenes', [0, -3], [1, 0]).ok, false);
  assert.equal(ell('2x-3', 'egyenes', [2, 1], [2, 4]).forma, true, 'függőleges: nem függvény');
  assert.equal(ell('2x-3', 'egyenes', [0, -3]).forma, true, 'egy pont kevés');
  assert.equal(ell('4', 'egyenes', [-2, 4], [5, 4]).ok, true, 'konstans függvény');
});

test('parabola: tengelypont és még egy pont', () => {
  const f = '\\left(x-2\\right)^2-1';
  assert.equal(ell(f, 'parabola', [2, -1], [3, 0]).ok, true);
  assert.equal(ell(f, 'parabola', [2, -1], [0, 3]).ok, true, 'távolabbi pont is jó');
  assert.equal(ell(f, 'parabola', [3, 0], [2, -1]).ok, false, 'felcserélve: nem a tengelypont az első');
  assert.equal(ell(f, 'parabola', [2, -1], [3, 1]).ok, false, 'rossz meredekség');
  assert.equal(ell(f, 'parabola', [-2, -1], [-1, 0]).ok, false, 'rossz irányba eltolva');
  assert.equal(ell(f, 'parabola', [2, -1], [2, 3]).forma, true);
  assert.equal(ell('x^2-4x+3', 'parabola', [2, -1], [3, 0]).ok, true, 'általános alakban megadva is ugyanaz');
  assert.equal(ell('-2x^2', 'parabola', [0, 0], [1, -2]).ok, true, 'lefelé nyitott');
  assert.match(ell(f, 'parabola', [2, -1], [3, 1]).uzenet, /x = /, 'ellenpéldát ad');
  assert.match(ell('x^2+2x+3', 'parabola', [0, 0], [1, 1]).uzenet, /x = −2 .* 4 magasan .* 3\./, 'olyan ellenpéldát ad, amely a rácson is látszik (nem az ablak szélén, 36 és 27)');
});

test('abszolút érték és négyzetgyök', () => {
  assert.equal(ell('\\left|x+1\\right|-2', 'abs', [-1, -2], [0, -1]).ok, true);
  assert.equal(ell('\\left|x+1\\right|-2', 'abs', [-1, -2], [0, 0]).ok, false);
  assert.equal(ell('-2\\left|x\\right|+3', 'abs', [0, 3], [-1, 1]).ok, true, 'bal oldali ponttal is');
  assert.equal(ell('\\sqrt{x+2}-1', 'gyok', [-2, -1], [2, 1]).ok, true);
  assert.equal(ell('\\sqrt{x+2}-1', 'gyok', [-2, -1], [-1, 1]).ok, false);
  assert.equal(ell('\\sqrt{x+2}-1', 'gyok', [-2, -1], [-3, 0]).forma, true, 'a kezdőponttól balra');
});

test('pontok bejelölése: a sorrend nem számít, a darabszám igen', () => {
  const v = { pontok: [[-2, 0], [3, 0]] };
  assert.equal(G.ellenoriz(v, P([3, 0], [-2, 0])).ok, true);
  assert.equal(G.ellenoriz(v, P([-2, 0])).ok, false);
  assert.equal(G.ellenoriz(v, P([-2, 0], [2, 0])).ok, false);
  assert.match(G.ellenoriz(v, P([-2, 0], [2, 0])).uzenet, /\(2; 0\)/);
  assert.equal(G.ellenoriz(v, P([-2, 0], [3, 0], [0, 0])).ok, false);
});

test('megoldás keresése: megrajzolható-e rácspontokkal az ablakban', () => {
  const m = G.megoldasPontok({ grafikon: '\\left(x-2\\right)^2-1', fajta: 'parabola' });
  assert.deepEqual(m[0], { x: 2, y: -1 }, 'az első pont a tengelypont');
  assert.equal(G.ellenoriz({ grafikon: '\\left(x-2\\right)^2-1', fajta: 'parabola' }, { pontok: m }).ok, true);
  assert.equal(G.megoldasPontok({ grafikon: '\\left(x-20\\right)^2', fajta: 'parabola' }), null, 'a tengelypont kívül esik az ablakon');
  assert.equal(G.megoldasPontok({ grafikon: '\\frac{1}{3}x^2', fajta: 'parabola' }).length, 2, 'x = 3-nál van rácspontja');
  assert.equal(G.megoldasPontok({ grafikon: '\\frac{1}{7}x^2+\\frac{1}{2}', fajta: 'parabola' }), null, 'egész rácson nincs két pontja');
  assert.equal(G.megoldasPontok({ grafikon: '\\frac{1}{2}x+\\frac{1}{2}', fajta: 'egyenes', lepes: 0.5 }).length, 2, 'fél egységes rácson megvan');
});

test('kirajzolás: SVG görbével és pontokkal; a napló olvasható', () => {
  const s = G.kep({ gorbek: ['x^2-4'], pontok: [{ x: 0, y: -4, c: 'T' }] });
  assert.match(s, /^<div class="grafikon-kep"><svg class="grafikon"/);
  assert.match(s, /class="g-gorbe"/); assert.match(s, /class="g-pont"/); assert.match(s, />T<\/text>/);
  assert.doesNotMatch(G.kep({}), /g-gorbe/, 'üres rács görbe nélkül');
  assert.doesNotMatch(G.kep({ gorbek: ['\\frac{1}{x}'] }), /NaN|Infinity/, 'szakadásnál nincs hibás koordináta');
  assert.equal(G.naplo({ grafikon: 'x^2', fajta: 'parabola' }, P([2, -1], [3, 0])), 'T(2;-1) P(3;0)');
});
