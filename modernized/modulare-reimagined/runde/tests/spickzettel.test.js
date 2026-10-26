// Spickzettel (legacy quiz.js:168-173): kostet 3 XP einmal je Runde, nur bei offener Frage, nur mit Hilfetext.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, choiceQuestion, option } from '../index.js';
import { createRng } from '../../helfer/index.js';

const frage = (n, help) => choiceQuestion({
  label: 'Test', prompt: `Frage ${n}`, answer: 'a', choices: [option('a'), option('b')], rng: createRng(n), help
});

test('SPICKZETTEL: das erste Öffnen kostet 3 XP, weitere Öffnungen in derselben Runde kosten nichts', () => {
  const round = createRound({ pool: [frage(1, 'Hilfe'), frage(2, 'Hilfe')], size: 2, rng: createRng(1) });
  round.submit({ pick: 'a' });
  round.next();
  round.peek();
  assert.equal(round.current().peeked, true);
  round.submit({ pick: 'a' });
  const done = round.next();
  assert.equal(done.done, true);
  // Erste Antwort 10 XP, dann 3 XP Abzug, zweite Antwort (Combo 2, Faktor 1) 10 XP.
  assert.equal(done.result.xp, 17);
});

test('SPICKZETTEL: ohne Hilfetext und nach der Antwort wird nichts abgezogen', () => {
  const round = createRound({ pool: [frage(3, undefined)], size: 1, rng: createRng(2) });
  assert.equal(round.peek().accepted, false);
  round.submit({ pick: 'a' });
  assert.equal(round.peek().accepted, false);
});

test('SPICKZETTEL: der Abzug geht nicht unter 0 XP', () => {
  const round = createRound({ pool: [frage(4, 'Hilfe')], size: 1, rng: createRng(3) });
  // Vor der ersten Antwort hat die Runde 0 XP. Der Abzug bleibt bei 0, danach zählt nur die Antwort.
  round.peek();
  round.submit({ pick: 'a' });
  const done = round.next();
  assert.equal(done.done, true);
  assert.equal(done.result.xp, 10);
});
