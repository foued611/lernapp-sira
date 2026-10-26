// RULE-166: Auswahlfrage. Richtig nur bei passender Option (id, nicht Text). Geprüft werden kann erst nach einer Wahl.
// Herkunft: legacy/modulare/core/js/qtypes.js:93-94 (canCheck, grade). Gilt auch für den Blitz (blitz.js:35).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, createBlitz, choiceQuestion } from '../index.js';
import { rngFor, zeroRng } from './helpers.js';

// Zwei Optionen zeigen denselben Text, nur die id unterscheidet sie.
const sameText = () => choiceQuestion({
  label: 'Tier',
  prompt: 'Welche Option?',
  answer: 'hund-richtig',
  choices: [{ id: 'hund-richtig', html: 'Hund' }, { id: 'hund-falsch', html: 'Hund' }, { id: 'katze', html: 'Katze' }],
  rng: rngFor()
});

test('RULE-166: die richtige Option-id ist ok', () => {
  const round = createRound({ pool: [sameText()], size: 1, rng: zeroRng });
  const submitted = round.submit({ pick: 'hund-richtig' });
  assert.equal(submitted.outcome, 'ok');
});

test('RULE-166: eine andere Option ist bad, auch wenn der Text gleich ist', () => {
  const round = createRound({ pool: [sameText()], size: 1, rng: zeroRng });
  const submitted = round.submit({ pick: 'hund-falsch' });
  assert.equal(submitted.outcome, 'bad', 'der Text "Hund" allein entscheidet nichts');
});

test('RULE-166: ohne Wahl wird nicht geprüft, die Frage bleibt offen', () => {
  const round = createRound({ pool: [sameText()], size: 1, rng: zeroRng });
  const submitted = round.submit({});
  assert.equal(submitted.accepted, false);
  assert.equal(submitted.reason, 'no-answer');
  assert.equal(round.status(), 'ask');
  assert.deepEqual(submitted.events, [], 'ohne Prüfung kein XP-Ereignis');
});

test('RULE-166: eine Option, die es nicht gibt, ist ein Fehler und keine Antwort', () => {
  const round = createRound({ pool: [sameText()], size: 1, rng: zeroRng });
  assert.throws(() => round.submit({ pick: 'nicht-da' }), RangeError);
  assert.equal(round.status(), 'ask');
});

test('RULE-166: im Blitz zählt ebenfalls nur die Option-id', () => {
  const blitz = createBlitz({ nextQuestion: () => sameText(), now: () => 0 });
  const wrong = blitz.pick('hund-falsch');
  assert.equal(wrong.outcome, 'bad');
  const right = blitz.pick('hund-richtig');
  assert.equal(right.outcome, 'ok');
});
