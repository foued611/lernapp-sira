// Rechenhelfer der Mathe-Werkstatt und die Prüfer (Zahlen, Terme, Wahrscheinlichkeiten). Herkunft: legacy/modulare/tests/mathe.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng, fmt, numCheck, nearby, probCheck } from '../../../helfer/index.js';
import { par, linear, frac, termCheck } from '../math.js';

test('Zahlen werden mit Minuszeichen und Komma ausgegeben', () => {
  assert.equal(fmt(-3.5), '−3,5');
  assert.equal(par(-2), '(−2)');
  assert.equal(par(4), '4');
});

test('Zahlenprüfer akzeptiert Komma, Punkt, Minusvarianten und Einheiten', () => {
  const c = numCheck(-2.5);
  for (const v of ['-2,5', '-2.5', '−2,5', ' -2,5 ']) assert.equal(c(v), 'ok', v);
  assert.equal(numCheck(30)('30 €'), 'ok');
  assert.equal(numCheck(30)('3'), 'bad');
  assert.equal(numCheck(0)(''), 'bad');
});

test('Termprüfer ignoriert Leerzeichen und Malpunkt', () => {
  assert.equal(termCheck('4x + 12')('4x+12'), 'ok');
  assert.equal(termCheck('4x + 12')('4 x + 12'), 'ok');
  assert.equal(termCheck('4x + 12')('4x + 21'), 'bad');
  assert.equal(termCheck(linear(-1, 13))('-x+13'), 'ok');
});

test('linear schreibt Terme ohne überflüssige Teile', () => {
  assert.equal(linear(1, 0), 'x');
  assert.equal(linear(-1, 5), '−x + 5');
  assert.equal(linear(3, -2), '3x − 2');
  assert.equal(linear(0, 7), '7');
});

test('frac kürzt Brüche und gibt ganze Zahlen ohne Nenner aus', () => {
  assert.equal(frac(2, 6), '1/3');
  assert.equal(frac(4, 2), '2');
  assert.equal(frac(0, 6), '0');
});

test('nearby liefert drei verschiedene falsche Zahlen', () => {
  for (let i = 0; i < 50; i++) {
    const r = nearby(i - 25, [i, i - 25, i - 25], createRng(i + 1));
    assert.equal(new Set(r).size, 3);
    assert.ok(!r.includes(i - 25));
  }
});

test('Wahrscheinlichkeiten: Prüfer akzeptiert Bruch, Dezimalzahl und Prozent, nicht aber falsche Werte', () => {
  const c = probCheck(0.25);
  for (const v of ['1/4', '2/8', '0,25', '0.25', '25 %', '25%']) assert.equal(c(v), 'ok', v);
  for (const v of ['1/3', '25', '', '1/0']) assert.equal(c(v), 'bad', v);
});
