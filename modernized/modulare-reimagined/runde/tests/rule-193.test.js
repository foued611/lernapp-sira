// RULE-193: Wird eine Runde vorzeitig verlassen, bleibt die bereits verdiente XP. Es entsteht kein Rundenergebnis.
// Jede Antwort liefert ein XP-Ereignis, damit die Oberfläche sie speichern kann, bevor die Runde endet.
// Die Combo-Zahlen sind legacy quiz.js:123-124 und blitz.js:42-43. Sie gehören zur XP je Antwort.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, createBlitz } from '../index.js';
import { sampleChoice, sampleTyped, correctResponse, rngFor } from './helpers.js';

const sumXP = (events) => events.reduce((total, e) => total + e.amount, 0);

test('RULE-193: jede beantwortete Frage liefert genau ein XP-Ereignis', () => {
  const pool = ['A', 'B', 'C'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 3, rng: rngFor(9) });
  const events = [];
  while (round.status() !== 'done') {
    events.push(...round.submit(correctResponse(round.current().question)).events);
    round.next();
  }
  assert.equal(events.length, 3);
  assert.equal(events.every((e) => e.type === 'xp'), true);
  assert.equal(round.result().xp, sumXP(events));
});

test('RULE-193: Verlassen nach zwei richtigen Antworten behält 20 XP und liefert kein Ergebnis', () => {
  const pool = ['A', 'B', 'C', 'D'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 4, rng: rngFor(4) });
  const events = [];
  for (let i = 0; i < 2; i++) {
    events.push(...round.submit(correctResponse(round.current().question)).events);
    round.next();
  }
  round.leave();

  assert.equal(round.status(), 'left');
  assert.equal(sumXP(events), 20);
  assert.equal(round.result(), null, 'kein Rundenergebnis nach dem Verlassen');
  assert.equal(round.current(), null);
  assert.deepEqual(round.next(), { done: false, result: null });
});

test('RULE-193: nach dem Verlassen werden keine Antworten mehr angenommen', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  round.leave();
  const submitted = round.submit({ pick: 'a' });
  assert.equal(submitted.accepted, false);
  assert.equal(submitted.reason, 'closed');
});

test('RULE-193: Verlassen mitten in der Rückmeldung nach einer Falschantwort gibt kein Ergebnis', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  round.submit({ pick: 'b' });
  round.leave();
  assert.equal(round.status(), 'left');
  assert.equal(round.result(), null);
});

test('RULE-193: Combo multipliziert die XP je Antwort, höchstens mit 4 (quiz.js:124, profile.js:73)', () => {
  const pool = Array.from({ length: 12 }, (_, i) => sampleChoice(`Q${i}`));
  const round = createRound({ pool, size: 12, rng: rngFor(2) });
  const amounts = [];
  while (round.status() !== 'done') {
    amounts.push(round.submit(correctResponse(round.current().question)).events[0].amount);
    round.next();
  }
  assert.deepEqual(amounts, [10, 10, 20, 20, 20, 30, 30, 30, 40, 40, 40, 40]);
});

test('RULE-193: knapp richtig gibt 5 XP und lässt die Combo stehen (quiz.js:125-126)', () => {
  // Alle Fragen sind gleich, damit die Reihenfolge der Runde egal ist.
  const pool = [sampleTyped('T'), sampleTyped('T'), sampleTyped('T')];
  const round = createRound({ pool, size: 3, rng: rngFor(1) });
  const answers = [{ text: 'chanté' }, { text: 'chante' }, { text: 'chanté' }];
  const amounts = [];
  for (const response of answers) {
    amounts.push(round.submit(response).events[0].amount);
    round.next();
  }
  assert.deepEqual(amounts, [10, 5, 10]);
});

test('RULE-193: Blitz gibt 5 XP je Treffer mal Combo-Faktor und zählt die Combo weiter', () => {
  const question = sampleChoice('B');
  const blitz = createBlitz({ nextQuestion: () => question, now: () => 0 });
  const amounts = [1, 2, 3].map(() => blitz.pick('a').events[0].amount);
  assert.deepEqual(amounts, [5, 5, 10]);
});

test('RULE-193: Blitz verlassen behält die XP und liefert kein Ergebnis', () => {
  let t = 0;
  const blitz = createBlitz({ nextQuestion: () => sampleChoice('B'), now: () => t });
  blitz.pick('a');
  blitz.leave();
  t = 60_000;
  assert.equal(blitz.finish(), null, 'nach dem Verlassen gibt es kein Ergebnis, auch nach Ablauf der Zeit');
  assert.equal(blitz.status(), 'left');
});

test('RULE-193: Blitz liefert das Ergebnis erst nach Ablauf der 45 Sekunden', () => {
  let t = 0;
  const blitz = createBlitz({ nextQuestion: () => sampleChoice('B'), now: () => t });
  blitz.pick('a');
  assert.equal(blitz.finish(), null, 'vor Ablauf kein Ergebnis');
  assert.equal(blitz.timeLeft(), 45_000);

  t = 45_000;
  assert.equal(blitz.current().over, true);
  const result = blitz.finish();
  assert.deepEqual(result, { mode: 'blitz', score: 1, xp: 5, bestCombo: 1, wrong: 0 });
  assert.equal(blitz.finish(), result, 'ein zweiter Aufruf liefert dasselbe Ergebnis');
});

test('RULE-193: Blitz nimmt nach Ablauf keine Antwort mehr an, ohne XP', () => {
  let t = 0;
  const blitz = createBlitz({ nextQuestion: () => sampleChoice('B'), now: () => t });
  t = 45_000;
  const late = blitz.pick('a');
  assert.equal(late.accepted, false);
  assert.equal(late.reason, 'over');
  assert.deepEqual(late.events, []);
});

test('RULE-193: Blitz braucht Auswahlfragen', () => {
  assert.throws(
    () => createBlitz({ nextQuestion: () => sampleTyped('T'), now: () => 0 }),
    TypeError
  );
});
