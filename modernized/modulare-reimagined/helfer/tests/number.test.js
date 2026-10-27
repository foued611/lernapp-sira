// Tests für den Zahlenprüfer (RULE-128). Jeder Testname beginnt mit der Regel-ID, damit die Rückverfolgung gilt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numCheck, roundTo, unitOfInput } from '../number.js';

test('RULE-128 Sollwert 2,5 ist ohne Rundung richtig bei 2,5, 2.5, 2,5 cm und 2,50', () => {
  const check = numCheck(2.5);
  for (const input of ['2,5', '2.5', '2,5 cm', '2,50']) {
    assert.equal(check(input), 'ok', input);
  }
});

test('RULE-128 Sollwert 2,5 ist falsch bei leerer Eingabe, 2,4, abc und 5/2', () => {
  const check = numCheck(2.5);
  for (const input of ['', '2,4', 'abc', '5/2']) {
    assert.equal(check(input), 'bad', input);
  }
});

test('RULE-128 typografisches Minus (U+2212) und Leerzeichen in der Zahl werden vor dem Vergleich entfernt', () => {
  assert.equal(numCheck(-2.5)('−2,5'), 'ok');
  assert.equal(numCheck(1000)('1 000'), 'ok');
});

test('RULE-128 Einheiten €, Grad, m und m² werden entfernt, bevor die Zahl gelesen wird', () => {
  assert.equal(numCheck(30)('30 €'), 'ok');
  assert.equal(numCheck(45)('45°'), 'ok');
  assert.equal(numCheck(8)('8 m²'), 'ok');
  assert.equal(numCheck(8)('8 m'), 'ok');
  assert.equal(numCheck(50)('50 %'), 'ok');
});

test('RULE-128 nur das erste Komma wird als Dezimalzeichen gelesen, ein zweites macht die Eingabe falsch', () => {
  assert.equal(numCheck(1000.5)('1,000,5'), 'bad');
});

test('RULE-128 ohne Rundungsangabe gilt exakte Übereinstimmung: 0,333 ist für 1/3 falsch', () => {
  assert.equal(numCheck(1 / 3)('0,333'), 'bad');
  assert.equal(numCheck(1 / 3)('1/3'), 'bad');
});

test('RULE-128 mit drei Stellen ist 0,333 richtig für 1/3, auch mit Punkt als Dezimalzeichen', () => {
  const check = numCheck(1 / 3, { places: 3 });
  assert.equal(check('0,333'), 'ok');
  assert.equal(check('0.333'), 'ok');
});

test('RULE-128 mit drei Stellen ist 0,33 falsch, 0,3333 ebenfalls, weil die Eingabe nicht auf die verlangte Stellenzahl gerundet ist', () => {
  const check = numCheck(1 / 3, { places: 3 });
  assert.equal(check('0,33'), 'bad');
  assert.equal(check('0,3333'), 'bad');
  assert.equal(check('1/3'), 'bad');
});

test('RULE-128 Rundung ist kaufmännisch: 2,345 auf zwei Stellen ist 2,35, nicht 2,34', () => {
  const check = numCheck(2.345, { places: 2 });
  assert.equal(check('2,35'), 'ok');
  assert.equal(check('2,34'), 'bad');
});

test('RULE-128 Rundung geht vom Betrag aus: -2,5 auf null Stellen ist -3', () => {
  const check = numCheck(-2.5, { places: 0 });
  assert.equal(check('−3'), 'ok');
  assert.equal(check('-2'), 'bad');
});

test('RULE-128 auf null Stellen gerundet: 2,5 wird zu 3, also ist 2,5 falsch', () => {
  const check = numCheck(2.5, { places: 0 });
  assert.equal(check('3'), 'ok');
  assert.equal(check('2,5'), 'bad');
});

test('RULE-128 roundTo rundet 1,005 auf zwei Stellen zu 1,01, obwohl der Binärwert knapp darunter liegt', () => {
  assert.equal(roundTo(1.005, 2), 1.01);
  assert.equal(roundTo(0.125, 2), 0.13);
});

test('RULE-128 roundTo lässt sehr große Werte unverändert, weil dort keine Nachkommastellen mehr existieren', () => {
  assert.equal(roundTo(1e21, 2), 1e21);
});

test('RULE-128 ungültige Stellenzahl (negativ, Bruch, Text) wirft RangeError beim Erzeugen des Prüfers', () => {
  assert.throws(() => numCheck(1, { places: -1 }), RangeError);
  assert.throws(() => numCheck(1, { places: 1.5 }), RangeError);
  assert.throws(() => numCheck(1, { places: '2' }), RangeError);
});

test('RULE-150 Einheit der Aufgabe: 2,5 m ist für eine Aufgabe in cm falsch, 250 und 250 cm sind richtig', () => {
  const check = numCheck(250, { unit: ' cm' });
  assert.equal(check('2,5 m'), 'bad');
  assert.equal(check('250 cm'), 'ok');
  assert.equal(check('250'), 'ok', 'ohne Einheit gilt die Zahl wie bisher');
});

test('RULE-150 Einheit wird mit der Schreibweise verglichen: grad ist ° und euro ist €, m² ist nicht m', () => {
  assert.equal(numCheck(45, { unit: '°' })('45 grad'), 'ok');
  assert.equal(numCheck(30, { unit: ' €' })('30 euro'), 'ok');
  assert.equal(numCheck(8, { unit: ' m²' })('8 m'), 'bad');
  assert.equal(numCheck(8, { unit: ' m²' })('8 m²'), 'ok');
});

test('RULE-150 ohne Einheit in der Aufgabe wird nichts verglichen, auch wenn die Eingabe eine Einheit hat', () => {
  assert.equal(numCheck(2.5, { unit: '' })('2,5 m'), 'ok');
  assert.equal(numCheck(2.5)('2,5 m'), 'ok');
});

test('RULE-150 unitOfInput liest die Einheit am Ende, Zahlen ohne Einheit ergeben leer', () => {
  assert.equal(unitOfInput('2,5 m'), 'm');
  assert.equal(unitOfInput('8 m²'), 'm²');
  assert.equal(unitOfInput('45 grad'), '°');
  assert.equal(unitOfInput('2,5'), '');
  assert.equal(unitOfInput('−6'), '');
});
