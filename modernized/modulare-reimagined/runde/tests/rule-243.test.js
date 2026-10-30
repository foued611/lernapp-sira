// RULE-243: Zweiter Versuch. Eine falsche Frage kommt am Ende derselben Runde einmal wieder.
// Dazu gehört RULE-067 (zählt nicht für Genauigkeit, kostet kein Herz), das hier mit geprüft wird.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRound, typedQuestion } from '../index.js';
import { sampleChoice, sampleMatch, wrongResponse, correctResponse, rngFor, zeroRng } from './helpers.js';

test('RULE-243: falsche Frage kommt am Ende der Runde einmal wieder', () => {
  const pool = ['A', 'B', 'C'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 3, rng: rngFor(3) });

  const first = round.current().question.label;
  round.submit(wrongResponse(round.current().question));
  round.next();
  const labels = [];
  while (round.status() !== 'done') {
    const view = round.current();
    labels.push(view.question.label);
    round.submit(correctResponse(view.question));
    round.next();
  }

  // Erst die übrigen zwei, dann die falsche Frage noch einmal als letzte.
  assert.equal(labels.length, 3);
  assert.equal(labels.at(-1), first);
  assert.equal(labels.filter((l) => l === first).length, 1);
});

test('RULE-243: die Wiederholung ist als solche markiert', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  round.submit(wrongResponse(round.current().question));
  round.next();

  const view = round.current();
  assert.equal(view.retry, true);
  assert.equal(view.question.retry, true);
});

test('RULE-243: die Wiederholung hat neu gemischte Optionen, dieselben ids', () => {
  const original = sampleChoice('X');
  // zeroRng mischt die Optionen bei jedem Aufruf um, die Reihenfolge ändert sich also sicher.
  const round = createRound({ pool: [original], size: 1, rng: zeroRng });
  const askedIds = round.current().question.options.map((o) => o.id);
  round.submit(wrongResponse(round.current().question));
  round.next();

  const retryIds = round.current().question.options.map((o) => o.id);
  assert.deepEqual([...retryIds].sort(), [...askedIds].sort());
  assert.notDeepEqual(retryIds, original.options.map((o) => o.id));
});

test('RULE-243: eine falsche Wiederholung kommt nicht ein drittes Mal', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  let asked = 0;
  while (round.status() !== 'done') {
    asked++;
    round.submit(wrongResponse(round.current().question));
    round.next();
  }
  assert.equal(asked, 2);
});

test('RULE-243: im Endgegner gibt es keine Wiederholung', () => {
  // Eine falsche Antwort, danach nur richtige. Mit Wiederholung kämen vier Fragen, ohne drei.
  const pool = ['A', 'B', 'C'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 3, rng: rngFor(3), boss: true });
  let asked = 0;
  let firstAnswer = true;
  while (round.status() !== 'done') {
    asked++;
    const q = round.current().question;
    round.submit(firstAnswer ? wrongResponse(q) : correctResponse(q));
    firstAnswer = false;
    round.next();
  }
  assert.equal(asked, 3);
  assert.equal(round.result().boss, true);
});

test('RULE-243: Zuordnungen kommen nicht wieder', () => {
  const round = createRound({ pool: [sampleMatch()], size: 1, rng: rngFor() });
  // Ein Fehlgriff, dann alle Paare richtig. Das Ergebnis ist knapp richtig, nicht falsch.
  round.submit({ left: 0, right: 1 });
  round.submit({ left: 0, right: 0 });
  round.submit({ left: 1, right: 1 });
  round.submit({ left: 2, right: 2 });
  round.next();

  assert.equal(round.status(), 'done');
  assert.equal(round.result().total, 1);
  assert.equal(round.result().almost, 1);
});

test('RULE-243: richtige Wiederholung zählt nicht für Genauigkeit (RULE-067) und kostet kein Herz', () => {
  // Zwei Fragen, die erste falsch: 0 Punkte, zweite richtig, Wiederholung richtig.
  const pool = [sampleChoice('X'), sampleChoice('Y')];
  const round = createRound({ pool, size: 2, rng: rngFor(5) });

  round.submit(wrongResponse(round.current().question));
  round.next();
  round.submit(correctResponse(round.current().question));
  round.next();
  const retry = round.submit(correctResponse(round.current().question));
  assert.equal(retry.outcome, 'ok');
  assert.equal(retry.events[0].amount, 5);
  round.next();

  const result = round.result();
  assert.equal(result.correct, 1, 'die Wiederholung zählt nicht als richtig');
  assert.equal(result.relearned, 1);
  assert.equal(result.accuracy, 0.5, 'Nenner bleibt die Zahl der Originalfragen');
  assert.equal(result.wrong, 1);
});

test('RULE-243: falsche Wiederholung kostet kein Herz und keine Combo', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  round.submit(wrongResponse(round.current().question));
  round.next();
  assert.equal(round.current().hearts, 4);

  const retry = round.submit(wrongResponse(round.current().question));
  assert.equal(retry.events[0].amount, 0);
  round.next();
  assert.equal(round.result().wrong, 1, 'die zweite Falsche zählt nicht erneut');
  assert.equal(round.current(), null);
});

test('RULE-243: retryRight zählt die richtigen Wiederholungen im Ergebnis', () => {
  const pool = ['A', 'B', 'C'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 3, rng: rngFor(3) });
  // Erste und zweite Frage falsch, dritte richtig. Beide Wiederholungen richtig.
  round.submit(wrongResponse(round.current().question));
  round.next();
  round.submit(wrongResponse(round.current().question));
  round.next();
  round.submit(correctResponse(round.current().question));
  round.next();
  round.submit(correctResponse(round.current().question));
  round.next();
  round.submit(wrongResponse(round.current().question));
  round.next();

  assert.equal(round.result().relearned, 1);
  assert.equal(round.result().retryRight, 1, 'nur die richtige Wiederholung, nicht die falsche');
});

test('RULE-243: ohne Wiederholung ist retryRight 0', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  round.submit(correctResponse(round.current().question));
  round.next();
  assert.equal(round.result().retryRight, 0);
});

// Fehler-Abruf (Spec 5.2): missedSkills sind die Labels der Fragen, deren ERSTER Versuch falsch war.
test('ABRUF: missedSkills nennt das Label einer im ersten Versuch falschen Frage', () => {
  const round = createRound({ pool: [sampleChoice('Lücke füllen')], size: 1, rng: rngFor() });
  round.submit(wrongResponse(round.current().question));
  round.next();
  round.submit(correctResponse(round.current().question));
  round.next();
  assert.deepEqual(round.result().missedSkills, ['Lücke füllen']);
});

test('ABRUF: Eine richtig wiederholte Frage nimmt ihr Label nicht zusätzlich auf, richtige Fragen nie', () => {
  const pool = ['A', 'B', 'C'].map((l) => sampleChoice(l));
  const round = createRound({ pool, size: 3, rng: rngFor(3) });
  const first = round.current().question.label;
  round.submit(wrongResponse(round.current().question));
  round.next();
  while (round.status() !== 'done') {
    round.submit(correctResponse(round.current().question));
    round.next();
  }
  assert.deepEqual(round.result().missedSkills, [first]);
});

test('ABRUF: Eine falsche Wiederholung ändert missedSkills nicht, jedes Label steht nur einmal', () => {
  const pool = [sampleChoice('A'), sampleChoice('A'), sampleChoice('B')];
  const round = createRound({ pool, size: 3, rng: rngFor(1) });
  const seen = [];
  while (round.status() !== 'done') {
    const q = round.current().question;
    if (!q.retry) seen.push(q.label);
    // Alles falsch: Erstversuche und Wiederholungen.
    round.submit(wrongResponse(q));
    round.next();
  }
  const expected = [...new Set(seen)];
  assert.deepEqual(round.result().missedSkills, expected, 'erstes Vorkommen, ohne Dubletten');
});

test('ABRUF: Ein knapp richtiger Erstversuch (almost) zählt nicht als Fehler', () => {
  const q = typedQuestion({ label: 'Verbform', prompt: 'Schreibe chanté', answer: 'chanté', check: (t) => (t === 'chanté' ? 'ok' : 'almost') });
  const round = createRound({ pool: [q], size: 1, rng: rngFor() });
  round.submit({ text: 'irgendwas' });
  round.next();
  assert.deepEqual(round.result().missedSkills, []);
});

test('ABRUF: Eine nur richtige Runde hat leere missedSkills', () => {
  const round = createRound({ pool: [sampleChoice('X')], size: 1, rng: rngFor() });
  round.submit(correctResponse(round.current().question));
  round.next();
  assert.deepEqual(round.result().missedSkills, []);
});
