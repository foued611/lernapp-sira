// Tests für den Zufall mit Seed (HELFER-RNG). Jeder Testname beginnt mit der Kennung HELFER-RNG.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng, shuffle, pick } from '../random.js';

/** Liest die ersten `count` Werte eines Generators. */
function take(rng, count) {
  return Array.from({ length: count }, () => rng());
}

test('HELFER-RNG gleicher Seed liefert dieselbe Folge, damit Tests reproduzierbar sind', () => {
  assert.deepEqual(take(createRng(42), 20), take(createRng(42), 20));
});

test('HELFER-RNG verschiedene Seeds liefern verschiedene Folgen', () => {
  assert.notDeepEqual(take(createRng(1), 10), take(createRng(2), 10));
});

test('HELFER-RNG jeder Wert liegt in [0, 1), auch über 10000 Ziehungen', () => {
  const rng = createRng(12345);
  for (let i = 0; i < 10000; i++) {
    const r = rng();
    assert.ok(r >= 0 && r < 1, `Wert ${r} außerhalb [0, 1)`);
  }
});

test('HELFER-RNG Seed muss eine ganze Zahl von 0 bis 2^32-1 sein', () => {
  for (const bad of [1.5, '3', NaN, undefined]) {
    assert.throws(() => createRng(bad), TypeError, String(bad));
  }
  for (const bad of [-1, 2 ** 32]) {
    assert.throws(() => createRng(bad), RangeError, String(bad));
  }
  assert.doesNotThrow(() => createRng(0));
  assert.doesNotThrow(() => createRng(2 ** 32 - 1));
});

test('HELFER-RNG shuffle liefert eine Permutation und lässt die Eingabe unverändert', () => {
  const list = ['a', 'b', 'c', 'd', 'e'];
  const before = list.slice();
  const out = shuffle(list, createRng(7));
  assert.deepEqual(list, before);
  assert.deepEqual([...out].sort(), [...before].sort());
});

test('HELFER-RNG shuffle mit gleichem Seed ergibt dieselbe Reihenfolge', () => {
  const list = [1, 2, 3, 4, 5, 6];
  assert.deepEqual(shuffle(list, createRng(99)), shuffle(list, createRng(99)));
});

test('HELFER-RNG shuffle und pick ohne Generator werfen einen Fehler statt auf Math.random zurückzufallen', () => {
  assert.throws(() => shuffle([1, 2], undefined), TypeError);
  assert.throws(() => pick([1, 2], undefined), TypeError);
});

test('HELFER-RNG shuffle und pick rufen Math.random nie auf', () => {
  const original = Math.random;
  Math.random = () => {
    throw new Error('Math.random darf in helfer/ nicht genutzt werden');
  };
  try {
    const rng = createRng(7);
    shuffle([1, 2, 3], rng);
    pick([1, 2, 3], rng);
  } finally {
    Math.random = original;
  }
});

test('HELFER-RNG pick liefert ein Element der Liste und wirft bei leerer Liste einen Fehler', () => {
  const list = ['x', 'y', 'z'];
  const rng = createRng(3);
  for (let i = 0; i < 50; i++) {
    assert.ok(list.includes(pick(list, rng)));
  }
  assert.throws(() => pick([], createRng(3)), RangeError);
});

test('HELFER-RNG ein Generator, der einen Wert außerhalb [0, 1) liefert, bricht mit RangeError ab', () => {
  const broken = () => 1;
  assert.throws(() => shuffle([1, 2, 3], broken), RangeError);
  assert.throws(() => pick([1, 2, 3], () => -0.1), RangeError);
});

test('HELFER-RNG Zufallsposition der richtigen Antwort: über 200 Seeds landet sie auf jeder Position, keine dominiert', () => {
  const RIGHT = 'richtig';
  const list = [RIGHT, 'falsch a', 'falsch b', 'falsch c'];
  const counts = [0, 0, 0, 0];
  for (let seed = 1; seed <= 200; seed++) {
    const out = shuffle(list, createRng(seed));
    assert.deepEqual([...out].sort(), [...list].sort(), `Seed ${seed} ist keine Permutation`);
    counts[out.indexOf(RIGHT)]++;
  }
  // Bei gleichmäßiger Mischung liegt jede Position bei etwa 50 von 200. Die Grenzen sind weit gesetzt.
  for (const [position, count] of counts.entries()) {
    assert.ok(count >= 20 && count <= 100, `Position ${position}: ${count} von 200`);
  }
});

test('HELFER-RNG pick über 200 Seeds deckt jedes Element der Liste ab', () => {
  const list = ['eins', 'zwei', 'drei', 'vier'];
  const seen = new Set();
  for (let seed = 1; seed <= 200; seed++) {
    seen.add(pick(list, createRng(seed)));
  }
  assert.equal(seen.size, list.length);
});
