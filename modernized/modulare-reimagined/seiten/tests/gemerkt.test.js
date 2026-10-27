// Gemerkte Aufgaben: richtige Antworten werden je App gespeichert und bei neuen Runden bevorzugt übergangen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choiceQuestion, questionKey } from '../../runde/index.js';
import { createRng } from '../../helfer/index.js';
import { SEEN_MAX, knownOf, rememberRight, startRound } from '../rahmen.js';

const ask = (n) => choiceQuestion({ label: 'Test', prompt: `Frage ${n}`, answer: 'a', choices: ['a', 'b'], rng: createRng(n) });

test('SEITE-VIELFALT rememberRight merkt eine Aufgabe und knownOf liefert sie wieder', () => {
  const app = { seen: {} };
  rememberRight(app, ask(1));
  assert.equal(knownOf(app).has(questionKey(ask(1))), true);
  assert.equal(knownOf(app).has(questionKey(ask(2))), false);
});

test('SEITE-VIELFALT rememberRight begrenzt den Stand und wirft die ältesten Schlüssel weg', () => {
  const app = { seen: {} };
  for (let n = 0; n < SEEN_MAX + 5; n++) rememberRight(app, ask(n));
  assert.equal(Object.keys(app.seen).length, SEEN_MAX);
  assert.equal(knownOf(app).has(questionKey(ask(0))), false);
  assert.equal(knownOf(app).has(questionKey(ask(SEEN_MAX + 4))), true);
});

test('SEITE-VIELFALT startRound: eine neue Lektion nimmt bekannte Aufgaben nur, wenn es nicht genug neue gibt', () => {
  const fresh = Array.from({ length: 10 }, (_, i) => ask(300 + i));
  const old = ask(900);
  const config = { units: [{ id: 'u' }], rounds: { lesson: () => [old, ...fresh.slice(0, 8)] } };
  const known = new Set([questionKey(old)]);
  const started = startRound({ config, mode: 'lesson', unit: { id: 'u' }, app: {}, profile: {}, rng: createRng(5), known });
  assert.equal(started.ok, true);
  const keys = [];
  for (let k = 0; k < 8; k++) {
    keys.push(questionKey(started.round.current().question));
    started.round.submit({ pick: started.round.current().question.answer });
    started.round.next();
  }
  assert.equal(keys.includes(questionKey(old)), false);
});
