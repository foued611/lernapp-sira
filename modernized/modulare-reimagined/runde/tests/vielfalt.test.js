// Vielfalt: keine Aufgabe zweimal in einer Runde, keine im Blitz, solange der Wertebereich reicht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choiceQuestion } from '../src/questions.js';
import { questionKey, distinctQuestions, freshPool } from '../src/vielfalt.js';
import { createBlitz } from '../src/blitz.js';
import { createRng } from '../../helfer/index.js';

const ask = (n) => choiceQuestion({ label: 'Test', prompt: `Frage ${n}`, answer: 'a', choices: ['a', 'b'], rng: createRng(n) });

test('questionKey: gleiche Frage mit anderer Optionsreihenfolge hat denselben Schlüssel', () => {
  const x = choiceQuestion({ label: 'L', prompt: 'Wie viel?', answer: '2', choices: ['1', '2', '3'], rng: createRng(1) });
  const y = choiceQuestion({ label: 'L', prompt: 'Wie viel?', answer: '2', choices: ['3', '2', '1'], rng: createRng(9) });
  assert.equal(questionKey(x), questionKey(y));
});

test('distinctQuestions: keine Dublette, auch wenn der Erzeuger immer dieselbe Frage liefert, solange es Alternativen gibt', () => {
  const makers = [() => ask(1), () => ask(2), () => ask(3)];
  for (let seed = 1; seed <= 50; seed++) {
    const qs = distinctQuestions(makers, 3, createRng(seed));
    assert.equal(new Set(qs.map(questionKey)).size, 3, `Seed ${seed}`);
  }
});

test('distinctQuestions: läuft auch weiter, wenn der Wertebereich erschöpft ist', () => {
  const qs = distinctQuestions([() => ask(1)], 4, createRng(3));
  assert.equal(qs.length, 4);
});

test('Blitz: eine Frage kommt in einer Sitzung nicht zweimal, solange neue da sind', () => {
  const pool = [1, 2, 3, 4, 5].map(ask);
  let i = 0;
  // Der Erzeuger liefert nacheinander alle Fragen, dann immer die erste (Wertebereich erschöpft).
  const nextQuestion = () => (i < pool.length ? pool[i++] : pool[0]);
  let t = 0;
  const blitz = createBlitz({ nextQuestion, now: () => t, seconds: 45 });
  const seen = [questionKey(blitz.current().question)];
  for (let k = 0; k < 4; k++) {
    const r = blitz.pick(blitz.current().question.answer);
    assert.equal(r.accepted, true);
    seen.push(questionKey(blitz.current().question));
  }
  assert.equal(new Set(seen).size, 5);
});

test('freshPool: zieht bevorzugt Fragen, die noch nicht richtig waren', () => {
  const old = ask(100);
  const known = new Set([questionKey(old)]);
  let n = 0;
  // Jede Runde liefert eine bekannte Frage und zwei neue.
  const generate = () => [old, ask(200 + 2 * n), ask(201 + 2 * n++)];
  const pool = freshPool(generate, 4, known);
  const keys = pool.map(questionKey);
  assert.equal(keys.includes(questionKey(old)), false);
  assert.equal(new Set(keys).size, pool.length);
  assert.ok(pool.length >= 4);
});

test('freshPool: reichen die neuen nicht, kommen bekannte dazu, damit die Runde voll wird', () => {
  const only = ask(1);
  const pool = freshPool(() => [only], 3, new Set([questionKey(only)]));
  assert.equal(pool.length, 1);
});

test('Blitz: bekannte Aufgaben kommen nach Möglichkeit nicht', () => {
  const known = [1, 2].map(ask);
  const fresh = [3, 4, 5].map(ask);
  const all = [...known, ...fresh];
  let i = 0;
  const nextQuestion = () => all[i++ % all.length];
  let t = 0;
  const blitz = createBlitz({ nextQuestion, now: () => t, seconds: 45, known: new Set(known.map(questionKey)) });
  const seen = [];
  for (let k = 0; k < 3; k++) {
    seen.push(questionKey(blitz.current().question));
    blitz.pick(blitz.current().question.answer);
  }
  assert.ok(seen.every((key) => !known.map(questionKey).includes(key)));
});
