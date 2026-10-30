// Fehler-Abruf (Spec 5.2): Fragen aus Fehlerkategorien der letzten Runde sind in der nächsten Runde garantiert dabei.
// Die Reihenfolge bleibt zufällig, createRound mischt sie ohnehin.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle } from '../../helfer/index.js';
import { withMissed } from '../src/abruf.js';
import { sampleChoice, rngFor } from './helpers.js';

const POOL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const pool = () => POOL_LABELS.map((l) => sampleChoice(l));
const labelsOf = (list) => list.map((q) => q.label);

test('ABRUF: Eine Frage mit missed-Label ist in der Auswahl, auch wenn sie sonst herausfiele', () => {
  // Ohne Abruf fehlt Label H bei manchen Seeds in den ersten drei. Mit Abruf ist H immer dabei.
  let without = 0;
  for (let seed = 1; seed <= 30; seed += 1) {
    const plain = labelsOf(shuffle(pool(), rngFor(seed)).slice(0, 3));
    if (!plain.includes('H')) without += 1;
    const picked = withMissed(pool(), ['H'], 3, rngFor(seed));
    assert.equal(picked.length, 3);
    assert.ok(labelsOf(picked).includes('H'), `Seed ${seed}: H fehlt`);
  }
  assert.ok(without > 0, 'die Prüfung wäre sonst wirkungslos');
});

test('ABRUF: Die Auswahl hat keine Dubletten und kommt aus dem Pool', () => {
  const picked = withMissed(pool(), ['B', 'C'], 5, rngFor(4));
  const labels = labelsOf(picked);
  assert.equal(new Set(labels).size, 5);
  labels.forEach((l) => assert.ok(POOL_LABELS.includes(l)));
});

test('ABRUF: Ohne missed-Labels gilt shuffle(pool, rng).slice(0, size) mit gleichem Seed', () => {
  const expected = labelsOf(shuffle(pool(), rngFor(9)).slice(0, 4));
  assert.deepEqual(labelsOf(withMissed(pool(), [], 4, rngFor(9))), expected);
});

test('ABRUF: Ohne Treffer im Pool gilt ebenfalls shuffle(pool, rng).slice(0, size)', () => {
  const expected = labelsOf(shuffle(pool(), rngFor(9)).slice(0, 4));
  assert.deepEqual(labelsOf(withMissed(pool(), ['Z'], 4, rngFor(9))), expected);
});

test('ABRUF: Gleicher Seed gibt gleiche Auswahl', () => {
  const a = labelsOf(withMissed(pool(), ['G', 'H'], 4, rngFor(21)));
  const b = labelsOf(withMissed(pool(), ['G', 'H'], 4, rngFor(21)));
  assert.deepEqual(a, b);
});

test('ABRUF: Der Pool des Aufrufers bleibt unverändert', () => {
  const p = pool();
  withMissed(p, ['H'], 3, rngFor(2));
  assert.deepEqual(labelsOf(p), POOL_LABELS);
});

test('ABRUF: Liegt die Auswahl schon im Pool-Umfang, bleibt jede Frage genau einmal (size gleich Poolgröße)', () => {
  const picked = withMissed(pool(), ['A'], POOL_LABELS.length, rngFor(5));
  assert.deepEqual(labelsOf(picked).sort(), [...POOL_LABELS]);
});

test('ABRUF: Mehrere Fragen mit missed-Label: mindestens eine ist dabei', () => {
  const p = [...pool(), sampleChoice('H'), sampleChoice('H')];
  for (let seed = 1; seed <= 20; seed += 1) {
    assert.ok(labelsOf(withMissed(p, ['H'], 2, rngFor(seed))).includes('H'));
  }
});

test('ABRUF: Ohne rng gibt es einen Fehler, kein Math.random', () => {
  assert.throws(() => withMissed(pool(), ['A'], 3), TypeError);
});

test('ABRUF: Ein kaputter missed-Wert zählt wie keiner', () => {
  const expected = labelsOf(shuffle(pool(), rngFor(9)).slice(0, 4));
  assert.deepEqual(labelsOf(withMissed(pool(), undefined, 4, rngFor(9))), expected);
  assert.deepEqual(labelsOf(withMissed(pool(), 'A', 4, rngFor(9))), expected);
});

test('ABRUF: skill geht vor label, sonst gilt das Etikett wie bisher', () => {
  const gleich = ['eins', 'zwei', 'drei', 'vier'].map((skill) => ({ ...sampleChoice('Wähle'), skill }));
  for (let seed = 1; seed <= 20; seed += 1) {
    assert.ok(withMissed(gleich, ['vier'], 2, rngFor(seed)).some((q) => q.skill === 'vier'), `Seed ${seed}`);
  }
});
