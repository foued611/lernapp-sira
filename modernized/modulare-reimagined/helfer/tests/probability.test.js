// Tests für den Wahrscheinlichkeitsprüfer (RULE-112). Jeder Testname beginnt mit der Regel-ID.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { probCheck } from '../probability.js';

test('RULE-112 Bruch, Dezimalzahl und Prozent sind für 0,25 gleichwertig: 1/4, 2/8, 0,25, 0.25, 25 % und 25%', () => {
  const check = probCheck(0.25);
  for (const input of ['1/4', '2/8', '0,25', '0.25', '25 %', '25%']) {
    assert.equal(check(input), 'ok', input);
  }
});

test('RULE-112 falsch für 0,25: 1/3, die nackte Zahl 25, leere Eingabe und Nenner 0', () => {
  const check = probCheck(0.25);
  for (const input of ['1/3', '25', '', '1/0']) {
    assert.equal(check(input), 'bad', input);
  }
});

test('RULE-112 eine Zahl ohne Prozentzeichen wird als Dezimalzahl gelesen und nicht abgelehnt: "1" gilt für 1, "0,5" für 0,5', () => {
  assert.equal(probCheck(1)('1'), 'ok');
  assert.equal(probCheck(0.5)('0,5'), 'ok');
});

test('RULE-112 ein Wert außerhalb 0 bis 1 ist falsch, auch wenn er wie Prozent aussieht: 125 %, 3/2, -0,25', () => {
  assert.equal(probCheck(1)('125%'), 'bad');
  assert.equal(probCheck(1)('3/2'), 'bad');
  assert.equal(probCheck(0.25)('-0,25'), 'bad');
  assert.equal(probCheck(1)('100%'), 'ok');
});

test('RULE-112 Nenner 0 ist falsch, auch wenn Zähler und Nenner 0 sind: 1/0, 0/0 und 1/0,0', () => {
  const check = probCheck(0.25);
  assert.equal(check('1/0'), 'bad');
  assert.equal(check('0/0'), 'bad');
  assert.equal(check('1/0,0'), 'bad');
});

test('RULE-112 leere Eingabe ist falsch, auch wenn nur ein Zeichen wie % oder / dasteht', () => {
  // Legacy las "%" und "/4" als 0 (Number("") ist 0), deshalb wird hier mit dem Wert 0 geprüft.
  const check = probCheck(0);
  for (const input of ['', '%', '/4', '1/']) {
    assert.equal(check(input), 'bad', input);
  }
});

test('RULE-112 ein Bruch mit zwei Schrägstrichen ist falsch: 1/2/3 wird nicht als 1/2 gewertet', () => {
  assert.equal(probCheck(0.5)('1/2/3'), 'bad');
});

test('RULE-112 ein zweites Komma macht die Dezimalzahl ungültig: 0,2,5 ist falsch', () => {
  assert.equal(probCheck(0.25)('0,2,5'), 'bad');
});

test('RULE-112 Leerzeichen in Bruch und Prozent werden ignoriert: "2 / 8" gilt für 0,25 und "12,5 %" für 1/8', () => {
  assert.equal(probCheck(0.25)('2 / 8'), 'ok');
  const eighth = probCheck(1 / 8);
  for (const input of ['1/8', '0,125', '12,5 %']) {
    assert.equal(eighth(input), 'ok', input);
  }
});

test('RULE-112 Prozent wird durch 100 geteilt: "0,25 %" ist 0,0025 und damit falsch für 0,25', () => {
  assert.equal(probCheck(0.25)('0,25 %'), 'bad');
});

test('RULE-112 ohne Rundung: 0,333 ist für 1/3 falsch, 1/3 richtig', () => {
  const check = probCheck(1 / 3);
  assert.equal(check('1/3'), 'ok');
  assert.equal(check('0,333'), 'bad');
  assert.equal(check('33,3 %'), 'bad');
});

test('RULE-112 Exponent- und Hex-Schreibweise wird nicht als Wahrscheinlichkeit gelesen (Abweichung von Legacy)', () => {
  // Legacy Number() las "1e-1" als 0,1. Bei Wahrscheinlichkeiten ist das kein Schreibweg für Schüler.
  assert.equal(probCheck(0.1)('1e-1'), 'bad');
  assert.equal(probCheck(0.1)('0x1'), 'bad');
});
