// RULE-137: Texteingabe wird vor dem Vergleich vereinheitlicht. Groß/Klein, Apostroph und Leerzeichen gleich,
// Akzente nur im zweiten Schritt (almost). Eine Funktion für alles: normalise in src/text.js (ui.js:20-24).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, normalise, stripAccents, compareTyped } from '../index.js';
import { sampleTyped, rngFor } from './helpers.js';

test('RULE-137: Groß und Klein werden gleich behandelt', () => {
  assert.equal(compareTyped('MÄDCHEN', 'mädchen'), 'ok');
});

test('RULE-137: umgebende und doppelte Leerzeichen werden entfernt', () => {
  assert.equal(normalise('   Qu’est-ce   que   '), "qu'est-ce que");
  assert.equal(compareTyped('  je   suis ', 'je suis'), 'ok');
});

test('RULE-137: typografischer Apostroph gilt wie der gerade', () => {
  assert.equal(compareTyped('Qu’est-ce', "qu'est-ce"), 'ok');
});

test('RULE-137: Backtick und Akut werden wie Apostroph gewertet (ui.js:21)', () => {
  assert.equal(normalise('l`homme'), "l'homme");
  assert.equal(normalise('l´homme'), "l'homme");
});

test('RULE-137: normalise nimmt Akzente nicht weg, das macht erst der Akzent-Vergleich', () => {
  assert.equal(normalise('Mädchen'), 'mädchen');
  assert.equal(stripAccents('Mädchen'), 'Madchen');
  assert.equal(compareTyped('Madchen', 'Mädchen'), 'almost');
});

test('RULE-137: normalise ist idempotent', () => {
  const once = normalise('  Qu’EST  ce ');
  assert.equal(normalise(once), once);
});

test('RULE-137: nur Leerzeichen sind keine Antwort und werden in der Runde nicht geprüft', () => {
  const round = createRound({ pool: [sampleTyped('Leer')], size: 1, rng: rngFor() });
  const submitted = round.submit({ text: '   ' });
  assert.equal(submitted.accepted, false);
  assert.equal(submitted.reason, 'no-answer');
  assert.equal(round.status(), 'ask', 'die Frage bleibt offen, ohne Herzverlust');
  assert.equal(round.current().hearts, 5);
  assert.deepEqual(submitted.events, []);
});
