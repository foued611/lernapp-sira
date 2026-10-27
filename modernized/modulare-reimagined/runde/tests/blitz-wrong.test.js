// Der Blitz zählt falsche Antworten mit. Damit kann eine Trophäe "10 richtige, höchstens ein Fehler" verlangen,
// statt reines Tempo zu belohnen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBlitz } from '../index.js';
import { sampleChoice } from './helpers.js';

// Eine Uhr, die nur von außen weiterläuft.
function clock() {
  let t = 0;
  return { now: () => t, advance: (ms) => { t += ms; } };
}

// Jede Frage hat ein eigenes Label, damit die Vielfalt (questionKey) sie nicht als Wiederholung ablehnt.
function makeBlitz(c) {
  let n = 0;
  return createBlitz({ nextQuestion: () => sampleChoice(`Q${n++}`), now: c.now, seconds: 45 });
}

const wrongOption = (q) => q.options.find((o) => o.id !== q.answer).id;

test('RULE-257: Blitz zählt falsche Antworten mit', () => {
  const c = clock();
  const blitz = makeBlitz(c);
  blitz.pick(blitz.current().question.answer);
  blitz.pick(wrongOption(blitz.current().question));
  c.advance(45_000);
  const result = blitz.finish();
  assert.equal(result.score, 1);
  assert.equal(result.wrong, 1);
});

test('RULE-257: Blitz ohne jede Antwort hat wrong 0', () => {
  const c = clock();
  const blitz = makeBlitz(c);
  c.advance(45_000);
  const result = blitz.finish();
  assert.equal(result.score, 0);
  assert.equal(result.wrong, 0);
});

test('RULE-257: Blitz mit nur richtigen Antworten hat wrong 0, mehrere Fehler werden alle gezählt', () => {
  const c = clock();
  const blitz = makeBlitz(c);
  for (let i = 0; i < 3; i++) blitz.pick(blitz.current().question.answer);
  for (let i = 0; i < 4; i++) blitz.pick(wrongOption(blitz.current().question));
  c.advance(45_000);
  assert.deepEqual(
    { score: blitz.finish().score, wrong: blitz.finish().wrong },
    { score: 3, wrong: 4 }
  );
});

test('RULE-257: Antworten nach Ablauf der Zeit zählen nicht als Fehler', () => {
  const c = clock();
  const blitz = makeBlitz(c);
  c.advance(45_000);
  // Nach Ablauf ist keine Frage mehr offen. Die Antwort ist eine beliebige falsche, sie darf nicht zählen.
  const anyQuestion = sampleChoice('X');
  assert.equal(blitz.pick(wrongOption(anyQuestion)).accepted, false);
  assert.equal(blitz.finish().wrong, 0);
});
