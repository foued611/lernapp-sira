import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toBin, toHex, normInput, checker, decToBinSteps, onesWeights, placeSum, distractors, HEX } from '../apps/informatik/numbers.js';
import * as b from '../apps/informatik/builders.js';
import config from '../apps/informatik/config.js';
import { assertValidQuestion } from './helpers.js';

test('Umrechnung Binär und Hex', () => {
  assert.equal(toBin(13), '1101');
  assert.equal(toHex(255), 'FF');
  assert.equal(HEX[10], 'A');
});

test('Stellenwerte zerlegen', () => {
  assert.equal(placeSum(352), '3×100 + 5×10 + 2×1');
  assert.equal(placeSum(0), '0');
  assert.deepEqual(onesWeights('1011'), [8, 2, 1]);
});

test('Normal → Binär Schritte ergeben die richtige Zahl', () => {
  for (let n = 0; n <= 255; n++) {
    const bits = decToBinSteps(n).map((s) => (s.fits ? '1' : '0')).join('');
    assert.equal(parseInt(bits || '0', 2), n, `n=${n}`);
  }
});

test('Eingaben werden großzügig geprüft', () => {
  assert.equal(normInput(' 1010 ', 'bin'), '1010');
  assert.equal(normInput('0010', 'bin'), '10');
  assert.equal(normInput('0x2f', 'hex'), '2F');
  assert.equal(normInput('2 F', 'hex'), '2F');
  assert.equal(normInput('12', 'bin'), null);
  assert.equal(normInput('abc', 'dec'), null);
  assert.equal(checker('hex', '2F')('2f'), 'ok');
  assert.equal(checker('bin', '1010')('01010'), 'ok');
  assert.equal(checker('dec', '47')('48'), 'bad');
});

test('Ablenker sind eindeutig und enthalten nie die Antwort', () => {
  for (let i = 0; i < 200; i++) {
    const answer = String(Math.floor(Math.random() * 200));
    const wrong = distractors(answer, [answer, 'NaN', '-3', answer, answer + 1]);
    assert.equal(new Set(wrong).size, wrong.length);
    assert.ok(!wrong.includes(answer));
    assert.equal(wrong.length, 3);
  }
});

test('Jeder Fragengenerator liefert gültige Fragen mit richtiger Antwort', () => {
  const makers = Object.entries(b).filter(([name]) => name.endsWith('Q') && name !== 'blitzQuestion');
  assert.ok(makers.length >= 12);
  for (let i = 0; i < 300; i++) {
    for (const [, make] of makers) {
      const q = make();
      assertValidQuestion(q);
      if (q.kind === 'type') assert.equal(q.check(q.answer), 'ok');
    }
  }
});

test('Rechenfragen haben mathematisch richtige Antworten', () => {
  for (let i = 0; i < 300; i++) {
    const q = b.addQ('hard');
    const [a, c] = q.prompt.match(/[01]+/g).map((x) => parseInt(x, 2));
    assert.equal(parseInt(q.answer, 2), a + c);
    const h = b.hexToDecQ('hard');
    if (h.kind === 'type') assert.equal(parseInt(h.prompt.match(/class="mono">([0-9A-F]+)</)[1], 16), Number(h.answer));
  }
});

test('Konfiguration nutzt eigene Wörter', () => {
  assert.equal(config.words.resultTitles.length, 3);
});
