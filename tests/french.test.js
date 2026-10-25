import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertValidQuestion } from './helpers.js';
import { V, UNITS, SP, RAW } from '../apps/franzoesisch-verben/data.js';
import { lessonRound, bossRound, quickRound, blitzQuestion, checkForm, hint, distract } from '../apps/franzoesisch-verben/builders.js';

test('Jede Lernpfad-Seite liefert 8 gültige Fragen (200 Zufallsrunden)', () => {
  for (let n = 0; n < 200; n++) {
    for (const unit of UNITS) {
      const round = lessonRound(unit);
      assert.equal(round.length, 8);
      round.forEach(assertValidQuestion);
    }
  }
});

test('Boss 12, Quick 5, Blitz immer Auswahl', () => {
  for (let n = 0; n < 200; n++) {
    assert.equal(bossRound().length, 12);
    assert.equal(quickRound().length, 5);
    bossRound().forEach(assertValidQuestion);
    quickRound().forEach(assertValidQuestion);
    const b = blitzQuestion();
    assert.equal(b.kind, 'choice');
    assertValidQuestion(b);
  }
});

test('Formen der unregelmäßigen und regelmäßigen Verben stimmen', () => {
  assert.deepEqual(V.etre.forms, ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']);
  assert.deepEqual(V.faire.forms, ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']);
  assert.deepEqual(V.parler.forms, ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent']);
  assert.deepEqual(V.finir.forms, ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent']);
  assert.deepEqual(V.attendre.forms, ['attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent']);
});

test('Jeder Beispielsatz hat genau eine Lücke und eine gültige Person', () => {
  for (const [unit, rows] of Object.entries(RAW)) {
    assert.ok(UNITS.some((u) => u.id === unit), `Unbekannte Seite ${unit}`);
    rows.forEach(([verb, person, fr, de]) => {
      assert.ok(V[verb], `Unbekanntes Verb ${verb}`);
      assert.ok(person >= 0 && person <= 5);
      assert.equal(fr.split('___').length, 2, fr);
      assert.ok(de.length > 3);
    });
    assert.equal(SP[unit].length, rows.length);
  }
});

test('Eingabeprüfung: Pronomen erlaubt, fehlender Akzent ist "fast"', () => {
  const check = checkForm('êtes');
  assert.equal(check('êtes'), 'ok');
  assert.equal(check('vous êtes'), 'ok');
  assert.equal(check('  ÊTES '), 'ok');
  assert.equal(check('etes'), 'almost');
  assert.equal(check('étez'), 'bad');
  assert.equal(checkForm('ai')("j'ai"), 'ok');
  assert.equal(checkForm('ai')('j’ai'), 'ok');
});

test('Hinweise und Ablenker sind vorhanden', () => {
  for (const key of Object.keys(V)) {
    for (let p = 0; p < 6; p++) {
      assert.ok(hint(V[key], p).length > 5);
      assert.ok(!distract(V[key], p, 3).includes(V[key].forms[p]));
    }
  }
});
