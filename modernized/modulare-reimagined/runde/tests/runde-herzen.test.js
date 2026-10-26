// RUNDE-HERZEN: Herzen je Runde. 5 in der normalen Runde, 3 im Endgegner (quiz.js:66).
// Ein Fehler kostet ein Herz. Knapp richtig kostet keins. Ohne Herz ist die Runde gescheitert.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound } from '../index.js';
import { sampleChoice, sampleMatch, sampleTyped, correctResponse, wrongResponse, rngFor } from './helpers.js';

test('RUNDE-HERZEN: normale Runde startet mit 5 Herzen', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  const view = round.current();
  assert.equal(view.hearts, 5);
  assert.equal(view.maxHearts, 5);
});

test('RUNDE-HERZEN: Endgegner startet mit 3 Herzen', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor(), boss: true });
  assert.equal(round.current().hearts, 3);
  assert.equal(round.current().maxHearts, 3);
});

test('RUNDE-HERZEN: eine falsche Antwort kostet genau ein Herz', () => {
  const round = createRound({ pool: [sampleChoice('X'), sampleChoice('Y')], size: 2, rng: rngFor(2) });
  round.submit(wrongResponse(round.current().question));
  assert.equal(round.current().hearts, 4);
});

test('RUNDE-HERZEN: auch im Endgegner kostet eine falsche Antwort ein Herz (quiz.js:128)', () => {
  const round = createRound({ pool: [sampleChoice('X'), sampleChoice('Y')], size: 2, rng: rngFor(2), boss: true });
  round.submit(wrongResponse(round.current().question));
  assert.equal(round.current().hearts, 2);
});

test('RUNDE-HERZEN: knapp richtig kostet kein Herz', () => {
  const round = createRound({ pool: [sampleTyped('A')], size: 1, rng: rngFor() });
  round.submit({ text: 'chante' });
  assert.equal(round.current().hearts, 5);
});

test('RUNDE-HERZEN: ohne Herz ist die Runde gescheitert, auch wenn Fragen übrig sind', () => {
  // Sechs verschiedene Fragen, alle falsch. Nach dem fünften Fehler ist Schluss, die sechste kommt nicht mehr.
  // Eine Wiederholung kostet kein Herz (quiz.js:113-121), deshalb zählen nur Erstfehler.
  const pool = ['A', 'B', 'C', 'D', 'E', 'F'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 6, rng: rngFor() });
  let asked = 0;
  while (round.status() !== 'done') {
    round.submit(wrongResponse(round.current().question));
    asked++;
    round.next();
  }
  assert.equal(asked, 5);
  assert.equal(round.result().failed, true);
  assert.equal(round.result().wrong, 5);
  assert.equal(round.result().accuracy, 0);
});

test('RUNDE-HERZEN: eine Runde mit Herzen übrig ist nicht gescheitert', () => {
  // Eine falsche Antwort, danach nur richtige, inklusive der Wiederholung am Ende.
  const pool = ['A', 'B'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 2, rng: rngFor(4) });
  let first = true;
  while (round.status() !== 'done') {
    const q = round.current().question;
    round.submit(first ? wrongResponse(q) : correctResponse(q));
    first = false;
    round.next();
  }
  assert.equal(round.result().failed, false);
  assert.equal(round.result().wrong, 1);
});

test('RUNDE-HERZEN: Zuordnung kostet nur beim ersten Fehlgriff ein Herz (qtypes.js:175-177)', () => {
  const round = createRound({ pool: [sampleMatch()], size: 1, rng: rngFor() });
  round.submit({ left: 0, right: 1 });
  assert.equal(round.current().hearts, 4);
  round.submit({ left: 1, right: 2 });
  assert.equal(round.current().hearts, 4, 'der zweite Fehlgriff kostet kein weiteres Herz');
  assert.equal(round.current().combo, 0);
});

test('RUNDE-HERZEN: Zuordnung mit dem letzten Herz ist gescheitert', () => {
  const round = bossRoundWithMatchLast();
  assert.equal(round.current().hearts, 1);

  const submitted = round.submit({ left: 0, right: 1 });
  assert.equal(submitted.outcome, 'bad');
  assert.equal(submitted.events[0].amount, 0);
  assert.equal(round.current().hearts, 0, 'das Herz wird nur einmal abgezogen');

  round.next();
  assert.equal(round.status(), 'done');
  assert.equal(round.result().failed, true);
  assert.equal(round.result().wrong, 3);
});

// Die Fragenreihenfolge kommt aus dem Zufall. Wir suchen einen Seed, bei dem die Zuordnung an dritter Stelle steht.
// So bleibt nach zwei falschen Auswahlfragen genau ein Herz für die Zuordnung übrig.
function bossRoundWithMatchLast() {
  for (let seed = 0; seed < 200; seed++) {
    const pool = [sampleChoice('A'), sampleChoice('B'), sampleMatch('Z')];
    const round = createRound({ pool, size: 3, rng: rngFor(seed), boss: true });
    for (let i = 0; i < 2; i++) {
      const view = round.current();
      if (view.question.kind !== 'choice') break;
      round.submit(wrongResponse(view.question));
      round.next();
    }
    const view = round.current();
    if (view && view.index === 2 && view.question.kind === 'match') return round;
  }
  throw new Error('kein Seed mit der Zuordnung an dritter Stelle gefunden');
}
