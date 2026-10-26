// RULE-151: Getippte Antwort. Exakt richtig ist 'ok', nur abweichende Akzente ergeben 'almost', alles andere ist 'bad'.
// Herkunft: legacy/modulare/core/js/qtypes.js:37-43 (defaultCheck). Die Vereinheitlichung davor steht bei RULE-137.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, compareTyped, typedQuestion } from '../index.js';
import { sampleTyped, rngFor, answerAndNext } from './helpers.js';

test('RULE-151: exakt gleiche Schreibweise ist ok', () => {
  assert.equal(compareTyped('chanté', 'chanté'), 'ok');
});

test('RULE-151: nur abweichende Akzente ergeben almost (chante statt chanté)', () => {
  assert.equal(compareTyped('chante', 'chanté'), 'almost');
});

test('RULE-151: nur abweichende Akzente ergeben almost (etes statt êtes)', () => {
  assert.equal(compareTyped('etes', 'êtes'), 'almost');
});

test('RULE-151: falsches Wort ist bad, auch wenn es ähnlich klingt', () => {
  assert.equal(compareTyped('chanted', 'chanté'), 'bad');
  assert.equal(compareTyped('gesungen', 'chanté'), 'bad');
});

test('RULE-151: ein zusätzliches Zeichen ist bad, nicht almost', () => {
  assert.equal(compareTyped('chanté!', 'chanté'), 'bad');
});

test('RULE-151: Akzentfehler in der Runde geben knapp richtig mit 5 XP und ohne Herzverlust', () => {
  const round = createRound({ pool: [sampleTyped('Akzent')], size: 1, rng: rngFor() });
  const submitted = round.submit({ text: 'chante' });
  assert.equal(submitted.outcome, 'almost');
  assert.deepEqual(submitted.events, [{ type: 'xp', amount: 5, multiplier: 1 }]);

  const view = round.current();
  assert.equal(view.hearts, 5);
  assert.equal(view.status, 'feedback');
});

test('RULE-151: falsche Eingabe in der Runde kostet ein Herz', () => {
  const round = createRound({ pool: [sampleTyped('Falsch')], size: 1, rng: rngFor() });
  const submitted = round.submit({ text: 'gesungen' });
  assert.equal(submitted.outcome, 'bad');
  assert.equal(submitted.events[0].amount, 0);
  assert.equal(round.current().hearts, 4);
});

test('RULE-151: eigene check-Funktion ersetzt den Vergleich und bekommt die Eingabe roh', () => {
  // Herkunft: qtypes.js:121 (q.check || defaultCheck). Zahlenfragen brauchen das, etwa mit helfer/number.js.
  const seen = [];
  const question = typedQuestion({
    label: 'Zahl', prompt: 'Wie viel?', answer: '42',
    check: (input) => { seen.push(input); return input.trim() === '42' ? 'ok' : 'bad'; }
  });
  const round = createRound({ pool: [question], size: 1, rng: rngFor() });
  // typedQuestion prüft die richtige Antwort beim Bau schon einmal. Diesen Aufruf zählen wir nicht mit.
  seen.length = 0;
  const { submitted } = answerAndNext(round, { text: '  42 ' });
  assert.equal(submitted.outcome, 'ok');
  assert.deepEqual(seen, ['  42 '], 'die Eingabe wird ohne Vorbehandlung übergeben');
});

test('RULE-151: check muss die richtige Antwort als ok bewerten', () => {
  assert.throws(
    () => typedQuestion({ label: 'Kaputt', prompt: 'x', answer: '42', check: () => 'bad' }),
    TypeError
  );
});
