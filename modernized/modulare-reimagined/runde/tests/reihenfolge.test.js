// Reihenfolge einer Runde: von leicht nach schwer, wenn die Aufgaben ein level tragen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../helfer/index.js';
import { choiceQuestion } from '../src/questions.js';
import { createRound } from '../src/round.js';
import { answerAndNext, correctResponse } from './helpers.js';

const frage = (n, level) => ({ ...choiceQuestion({ label: 'T', prompt: `Frage ${n}`, answer: 'a', choices: ['a', 'b'], rng: createRng(n) }), level });
const reihe = (round) => Array.from({ length: round.current().total }, () => {
  const { question } = round.current();
  answerAndNext(round, correctResponse(question));
  return question;
});
const pool = [3, 1, 2, 3, 1, 2].map((level, i) => frage(i, level));

test('REIHENFOLGE: ramp sortiert nach level, ohne level steht in der Mitte', () => {
  const round = createRound({ pool: [...pool, frage(9, undefined)], size: 7, rng: createRng(4), ramp: true });
  assert.deepEqual(reihe(round).map((q) => q.level ?? 2), [1, 1, 2, 2, 2, 3, 3]);
});

test('REIHENFOLGE: Ohne ramp bleibt die Runde gemischt', () => {
  const levels = Array.from({ length: 10 }, (_, seed) => reihe(createRound({ pool, size: 6, rng: createRng(seed + 1) })).map((q) => q.level).join(''));
  assert.ok(levels.some((text) => text !== '112233'));
});

test('REIHENFOLGE: Ohne level ändert ramp nichts, gleicher Seed bleibt gleich', () => {
  const ohne = [1, 2, 3, 4, 5].map((n) => frage(n, undefined));
  const titel = (ramp) => reihe(createRound({ pool: ohne, size: 5, rng: createRng(7), ramp })).map((q) => q.prompt);
  assert.deepEqual(titel(true), titel(false));
});
