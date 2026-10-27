// Tests für die Trophäen-Regeln: Auswertung und Prüfung des Aufbaus.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTrophyRule, ruleErrors } from '../src/trophies.js';

const state = (stars = {}, streak = 0) => ({ profile: {}, app: { stars }, streak });
const lesson = { mode: 'lesson', failed: false, wrong: 0, almost: 0, bestCombo: 0, score: 0 };

test('RULE-132: Ein unbekannter Typ wirft einen Fehler, auch ein Objekt-Name wie "constructor"', () => {
  assert.throws(() => evaluateTrophyRule({ type: 'bogus' }, state()), /Unbekannte Trophäen-Regel/);
  assert.throws(() => evaluateTrophyRule({ type: 'constructor' }, state()), /Unbekannte Trophäen-Regel/);
});

test('RULE-132: ruleErrors meldet unbekannte Seiten, fehlende Angaben und leere Kombinationen', () => {
  const unitIds = ['a'];
  assert.deepEqual(ruleErrors({ type: 'unit', id: 'x' }, unitIds), ['rule: Seite "x" gibt es nicht']);
  assert.deepEqual(ruleErrors({ type: 'units', ids: ['a', 'b'] }, unitIds), ['rule: Seite "b" gibt es nicht']);
  assert.deepEqual(ruleErrors({ type: 'units' }, unitIds), ['rule: ids fehlt']);
  assert.deepEqual(ruleErrors({ type: 'combo' }, unitIds), ['rule: min fehlt']);
  assert.deepEqual(ruleErrors({ type: 'streak', days: 0 }, unitIds), ['rule: days fehlt']);
  assert.deepEqual(ruleErrors({ type: 'all', rules: [] }, unitIds), ['rule: rules fehlt']);
  assert.deepEqual(ruleErrors({ type: 'nope' }, unitIds), ['rule: unbekannter Typ "nope"']);
});

test('RULE-132: ruleErrors gibt für eine vollständige Regel keine Fehler zurück', () => {
  const rule = { type: 'any', rules: [{ type: 'boss' }, { type: 'streak', days: 3 }] };
  assert.deepEqual(ruleErrors(rule, []), []);
});

test('RULE-260: anyUnit, unit und units zählen eine Seite ab einem Stern, fehlende Seiten als 0', () => {
  const s = state({ a: 1, b: 2 });
  assert.equal(evaluateTrophyRule({ type: 'anyUnit' }, s, lesson, ['x', 'a']), true);
  assert.equal(evaluateTrophyRule({ type: 'anyUnit' }, s, lesson, ['x']), false);
  assert.equal(evaluateTrophyRule({ type: 'unit', id: 'a' }, s), true);
  assert.equal(evaluateTrophyRule({ type: 'unit', id: 'b', stars: 2 }, s), true);
  assert.equal(evaluateTrophyRule({ type: 'unit', id: 'b', stars: 3 }, s), false);
  assert.equal(evaluateTrophyRule({ type: 'units', ids: ['a', 'b'] }, s), true);
  assert.equal(evaluateTrophyRule({ type: 'units', ids: ['a', 'x'] }, s), false);
});

test('RULE-257: combo verlangt die Mindest-Combo, blitz die Mindestpunkte im Blitz', () => {
  assert.equal(evaluateTrophyRule({ type: 'combo', min: 5 }, state(), { ...lesson, bestCombo: 5 }), true);
  assert.equal(evaluateTrophyRule({ type: 'combo', min: 5 }, state(), { ...lesson, bestCombo: 4 }), false);
  const blitz = { ...lesson, mode: 'blitz', score: 10 };
  assert.equal(evaluateTrophyRule({ type: 'blitz', min: 10 }, state(), blitz), true);
  assert.equal(evaluateTrophyRule({ type: 'blitz', min: 10 }, state(), { ...blitz, mode: 'lesson' }), false);
});

test('RULE-261: perfectRound verlangt eine fehlerfreie Runde außerhalb des Blitz', () => {
  const perfect = { type: 'perfectRound' };
  assert.equal(evaluateTrophyRule(perfect, state(), lesson), true);
  assert.equal(evaluateTrophyRule(perfect, state(), { ...lesson, mode: 'blitz' }), false);
  assert.equal(evaluateTrophyRule(perfect, state(), { ...lesson, wrong: 1 }), false);
  assert.equal(evaluateTrophyRule(perfect, state(), { ...lesson, almost: 1 }), false);
  assert.equal(evaluateTrophyRule(perfect, state(), { ...lesson, failed: true }), false);
});

test('RULE-244: boss gilt nur für einen gewonnenen Endgegner', () => {
  const boss = { type: 'boss' };
  assert.equal(evaluateTrophyRule(boss, state(), { ...lesson, mode: 'boss' }), true);
  assert.equal(evaluateTrophyRule(boss, state(), { ...lesson, mode: 'boss', failed: true }), false);
  assert.equal(evaluateTrophyRule(boss, state(), lesson), false);
});

test('RULE-245: streak gilt ab der geforderten Zahl Tage in Folge', () => {
  assert.equal(evaluateTrophyRule({ type: 'streak', days: 3 }, state({}, 3)), true);
  assert.equal(evaluateTrophyRule({ type: 'streak', days: 4 }, state({}, 3)), false);
});

test('RULE-246: all verlangt alle Teilregeln, any mindestens eine', () => {
  // Eine Lektionsrunde ist fehlerfrei, aber kein Endgegner: nur eine der beiden Teilregeln trifft zu.
  const both = { type: 'all', rules: [{ type: 'boss' }, { type: 'perfectRound' }] };
  assert.equal(evaluateTrophyRule(both, state(), lesson), false);
  assert.equal(evaluateTrophyRule(both, state(), { ...lesson, mode: 'boss' }), true);
  const either = { type: 'any', rules: [{ type: 'boss' }, { type: 'streak', days: 5 }] };
  assert.equal(evaluateTrophyRule(either, state({}, 1), lesson), false);
  assert.equal(evaluateTrophyRule(either, state({}, 5), lesson), true);
});

test('improved wahr bei Anstieg um mindestens by', () => {
  const s = { profile: {}, app: { acc: { a: 0.9 } }, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'improved', unit: 'a', by: 0.2 }, s, { prevAcc: 0.6 }), true);
});

test('improved feuert nicht ohne vorherigen Wert', () => {
  const s = { profile: {}, app: { acc: { a: 0.9 } }, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'improved', unit: 'a', by: 0.2 }, s, { prevAcc: null }), false);
});

test('improved feuert nicht bei zu kleinem Anstieg', () => {
  const s = { profile: {}, app: { acc: { a: 0.7 } }, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'improved', unit: 'a', by: 0.2 }, s, { prevAcc: 0.6 }), false);
});

test('improved verträgt Rundungsfehler an der Grenze (0.7 - 0.5)', () => {
  const s = { profile: {}, app: { acc: { a: 0.7 } }, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'improved', unit: 'a', by: 0.2 }, s, { prevAcc: 0.5 }), true);
});

test('improved gilt nur für die Seite der Runde', () => {
  const s = { profile: {}, app: { acc: { a: 0.9, b: 0.3 } }, streak: 0 };
  const rule = { type: 'improved', unit: 'a', by: 0.2 };
  assert.equal(evaluateTrophyRule(rule, s, { unitId: 'b', prevAcc: 0.6 }), false);
  assert.equal(evaluateTrophyRule(rule, s, { unitId: 'a', prevAcc: 0.6 }), true);
});

test('retryRecovered zählt richtige Wiederholungen', () => {
  const s = { profile: {}, app: {}, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'retryRecovered', min: 2 }, s, { retryRight: 2 }), true);
  assert.equal(evaluateTrophyRule({ type: 'retryRecovered', min: 2 }, s, { retryRight: 1 }), false);
  assert.equal(evaluateTrophyRule({ type: 'retryRecovered', min: 2 }, s, {}), false);
});

test('refresh zählt app.refreshes', () => {
  assert.equal(evaluateTrophyRule({ type: 'refresh', count: 1 }, { profile: {}, app: { refreshes: 1 }, streak: 0 }, {}), true);
  assert.equal(evaluateTrophyRule({ type: 'refresh', count: 2 }, { profile: {}, app: { refreshes: 1 }, streak: 0 }, {}), false);
  assert.equal(evaluateTrophyRule({ type: 'refresh', count: 1 }, { profile: {}, app: {}, streak: 0 }, {}), false);
});

test('ruleErrors prüft die Pflichtfelder der neuen Typen', () => {
  const ids = ['a'];
  assert.deepEqual(ruleErrors({ type: 'improved', unit: 'a', by: 0.2 }, ids), []);
  assert.equal(ruleErrors({ type: 'improved', unit: 'x', by: 0.2 }, ids).length, 1);
  assert.equal(ruleErrors({ type: 'improved', unit: 'a' }, ids).length, 1);
  assert.deepEqual(ruleErrors({ type: 'retryRecovered', min: 2 }, ids), []);
  assert.equal(ruleErrors({ type: 'retryRecovered' }, ids).length, 1);
  assert.deepEqual(ruleErrors({ type: 'refresh', count: 1 }, ids), []);
  assert.equal(ruleErrors({ type: 'refresh' }, ids).length, 1);
});
