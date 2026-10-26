// RUNDE-FABRIK: Eine Rundenfabrik für alle Apps (Schuld 4). Apps liefern Fragenpools aus Daten,
// der Rundenablauf steckt nur in createRound. Die Bauer prüfen ihre Eingaben, damit kaputte Daten früh auffallen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, choiceQuestion, typedQuestion, matchQuestion } from '../index.js';
import { sampleChoice, sampleTyped, sampleMatch, correctResponse, rngFor, zeroRng } from './helpers.js';

const choiceArgs = (over = {}) => ({
  label: 'L', prompt: 'P', answer: 'a', choices: ['a', 'b', 'c'], rng: rngFor(), ...over
});

test('RUNDE-FABRIK: choiceQuestion mischt die Optionen mit dem übergebenen Zufall', () => {
  const q = choiceQuestion(choiceArgs({ rng: zeroRng }));
  assert.deepEqual(q.options.map((o) => o.id).sort(), ['a', 'b', 'c']);
  assert.notDeepEqual(q.options.map((o) => o.id), ['a', 'b', 'c'], 'die richtige Antwort steht nicht fest vorn');
});

test('RUNDE-FABRIK: choiceQuestion braucht rng', () => {
  assert.throws(() => choiceQuestion(choiceArgs({ rng: undefined })), TypeError);
});

test('RUNDE-FABRIK: choiceQuestion lehnt eine Antwort ab, die nicht in den Optionen steht', () => {
  assert.throws(() => choiceQuestion(choiceArgs({ answer: 'z' })), TypeError);
});

test('RUNDE-FABRIK: choiceQuestion verlangt zwei bis vier Optionen', () => {
  assert.throws(() => choiceQuestion(choiceArgs({ choices: ['a'] })), RangeError);
  assert.throws(() => choiceQuestion(choiceArgs({ choices: ['a', 'b', 'c', 'd', 'e'] })), RangeError);
});

test('RUNDE-FABRIK: choiceQuestion verlangt eindeutige ids', () => {
  assert.throws(
    () => choiceQuestion(choiceArgs({ choices: [{ id: 'a', html: 'x' }, { id: 'a', html: 'y' }] })),
    TypeError
  );
});

test('RUNDE-FABRIK: choiceQuestion mit Lücke braucht für jede Option einen Füllwert', () => {
  const withBlank = choiceArgs({ prompt: 'Das ist {{blank}}.' });
  assert.throws(() => choiceQuestion(withBlank), TypeError);
  const filled = choiceArgs({
    prompt: 'Das ist {{blank}}.',
    choices: [{ id: 'a', html: 'A', fill: 'eins' }, { id: 'b', html: 'B', fill: 'zwei' }]
  });
  assert.doesNotThrow(() => choiceQuestion(filled));
});

test('RUNDE-FABRIK: matchQuestion lehnt ungleich lange Listen ab', () => {
  assert.throws(
    () => matchQuestion({ label: 'Z', left: ['a'], right: [{ value: '1', html: 'x' }, { value: '2', html: 'y' }], leftValues: ['1'] }),
    TypeError
  );
});

test('RUNDE-FABRIK: matchQuestion lehnt Werte ab, die sich nicht zuordnen lassen', () => {
  assert.throws(
    () => matchQuestion({ label: 'Z', left: ['a', 'b'], right: [{ value: '1', html: 'x' }, { value: '2', html: 'y' }], leftValues: ['1', '9'] }),
    TypeError
  );
});

test('RUNDE-FABRIK: typedQuestion braucht eine Antwort und einen Namen', () => {
  assert.throws(() => typedQuestion({ label: '', prompt: 'x', answer: 'y' }), TypeError);
  assert.throws(() => typedQuestion({ label: 'x', prompt: 'x', answer: '' }), TypeError);
});

test('RUNDE-FABRIK: createRound lehnt einen leeren Pool ab', () => {
  assert.throws(() => createRound({ pool: [], size: 1, rng: rngFor() }), TypeError);
});

test('RUNDE-FABRIK: createRound verlangt size zwischen 1 und der Poolgröße', () => {
  const pool = [sampleChoice('A'), sampleChoice('B')];
  assert.throws(() => createRound({ pool, size: 0, rng: rngFor() }), RangeError);
  assert.throws(() => createRound({ pool, size: 3, rng: rngFor() }), RangeError);
});

test('RUNDE-FABRIK: createRound braucht rng', () => {
  assert.throws(() => createRound({ pool: [sampleChoice('A')], size: 1 }), TypeError);
});

test('RUNDE-FABRIK: createRound lehnt unbekannte Fragetypen im Pool ab', () => {
  assert.throws(() => createRound({ pool: [{ kind: 'frei', label: 'x' }], size: 1, rng: rngFor() }), TypeError);
});

test('RUNDE-FABRIK: createRound zieht size Fragen ohne Zurücklegen', () => {
  const pool = ['A', 'B', 'C', 'D', 'E'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 3, rng: rngFor(11) });
  const labels = [];
  while (round.status() !== 'done') {
    labels.push(round.current().question.label);
    round.submit(correctResponse(round.current().question));
    round.next();
  }
  assert.equal(labels.length, 3);
  assert.equal(new Set(labels).size, 3);
  for (const label of labels) assert.ok(['A', 'B', 'C', 'D', 'E'].includes(label));
});

test('RUNDE-FABRIK: createRound verändert den Pool des Aufrufers nicht', () => {
  const pool = [sampleChoice('A'), sampleChoice('B')];
  const before = JSON.stringify(pool);
  const round = createRound({ pool, size: 2, rng: rngFor(6) });
  round.submit({ pick: 'b' });
  round.next();
  while (round.status() !== 'done') {
    round.submit(correctResponse(round.current().question));
    round.next();
  }
  assert.equal(JSON.stringify(pool), before);
  assert.equal(pool.some((q) => q.retry === true), false);
});

// Löst eine Runde mit richtigen Antworten, egal welcher Fragetyp drankommt.
function solveAll(round) {
  const statuses = [];
  while (round.status() !== 'done') {
    const view = round.current();
    statuses.push(view.status);
    if (view.question.kind === 'match') {
      view.question.leftValues.forEach((_, i) => round.submit({ left: i, right: i }));
    } else {
      round.submit(correctResponse(view.question));
    }
    round.next();
  }
  return statuses;
}

test('RUNDE-FABRIK: zwei verschiedene Pools ergeben Runden mit derselben Struktur', () => {
  // Pool A: nur Auswahlfragen. Pool B: Eingabe- und Zuordnungsfragen. Die Rundenform darf sich nicht unterscheiden.
  const poolA = [sampleChoice('A1'), sampleChoice('A2'), sampleChoice('A3')];
  const poolB = [sampleTyped('B1'), sampleMatch('B2')];
  const roundA = createRound({ pool: poolA, size: 2, rng: rngFor(8) });
  const roundB = createRound({ pool: poolB, size: 2, rng: rngFor(8) });

  // Die Ansicht der Runde hat für jeden Fragetyp dieselben Felder. Nur der Inhalt der Frage unterscheidet sich.
  assert.deepEqual(Object.keys(roundA.current()).sort(), Object.keys(roundB.current()).sort());

  const statusesA = solveAll(roundA);
  const statusesB = solveAll(roundB);
  assert.deepEqual(statusesA, statusesB);

  assert.deepEqual(Object.keys(roundA.result()).sort(), Object.keys(roundB.result()).sort());
  assert.equal(roundA.result().total, 2);
  assert.equal(roundB.result().total, 2);
});
