// Zahlen-Helfer der Zahlenwerkstatt (numbers.js). Die Erwartungen stammen aus der Legacy-Fassung.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { toBin, toHex, HEX, placeSum, placeDigits, onesWeights, decToBinSteps, distractors, explainBinToDec } from '../numbers.js';
import { clampInt, lampSum, hexView, adderView, nibbleView, decToBinRows } from '../spielzeuge.js';
import { normalise } from '../../../runde/index.js';

test('Umrechnung Binär und Hex', () => {
  assert.equal(toBin(13), '1101');
  assert.equal(toHex(255), 'FF');
  assert.equal(HEX[10], 'A');
});

test('Stellenwerte zerlegen', () => {
  assert.equal(placeSum(352), '3×100 + 5×10 + 2×1');
  assert.equal(placeSum(0), '0');
  assert.deepEqual(placeDigits(352), ['0', '3', '5', '2']);
  assert.deepEqual(onesWeights('1011'), [8, 2, 1]);
});

test('Normal nach Binär: die Schritte ergeben für jede Zahl von 0 bis 255 die Zahl selbst', () => {
  for (let n = 0; n <= 255; n++) {
    const bits = decToBinSteps(n).map((s) => (s.fits ? '1' : '0')).join('');
    assert.equal(parseInt(bits || '0', 2), n, `n=${n}`);
  }
});

test('Binär lesen erklärt den Weg über die Stellenwerte', () => {
  assert.match(explainBinToDec('1011'), /8 \+ 2 \+ 1 = 11/);
});

test('Ablenker sind eindeutig, enthalten nie die Antwort und sind genau drei', () => {
  const rng = createRng(9);
  for (let i = 0; i < 200; i++) {
    const answer = String(Math.floor(rng() * 200));
    const wrong = distractors(answer, [answer, 'NaN', '-3', answer, String(Number(answer) + 1)]);
    assert.equal(new Set(wrong).size, wrong.length);
    assert.ok(!wrong.includes(answer));
    assert.equal(wrong.length, 3);
  }
});

test('Eingaben vergleicht die App nach normalise(): Leerraum am Rand und Groß/Klein zählen nicht', () => {
  assert.equal(normalise(' 1010 '), normalise('1010'));
  assert.equal(normalise('2f'), normalise('2F'));
  assert.notEqual(normalise('47'), normalise('48'));
});

test('Begrenzung der Eingabe: leer und ungültig zählen als 0, Obergrenze gilt', () => {
  assert.equal(clampInt('', 255), 0);
  assert.equal(clampInt('abc', 255), 0);
  assert.equal(clampInt('-5', 255), 0);
  assert.equal(clampInt('300', 255), 255);
  assert.equal(clampInt('47', 255), 47);
});

test('Lampen: Summe der leuchtenden Stellenwerte (Legacy-Erwartung: 139 nach dem Schalten der 128)', () => {
  assert.deepEqual(lampSum([0, 0, 0, 0, 1, 0, 1, 1]), { bitsText: '00001011', parts: '8 + 2 + 1', value: 11 });
  assert.equal(lampSum([1, 0, 0, 0, 1, 0, 1, 1]).value, 139);
  assert.equal(lampSum([0, 0, 0, 0, 0, 0, 0, 0]).parts, '0');
});

test('Hex-Schieberegler: 47 ist 2F, mit Rest und Ziffern', () => {
  const v = hexView(47);
  assert.equal(v.hex, '2F');
  assert.equal(v.bin, '101111');
  assert.equal(v.q, 2);
  assert.equal(v.r, 15);
});

test('Schriftliche Addition: beide Zahlen gleich breit, Summe in Binär', () => {
  const v = adderView(11, 6);
  assert.equal(v.sum, '10001');
  assert.equal(v.a, ' 1011');
  assert.equal(v.b, '  110');
  assert.equal(v.dec, 17);
});

test('Vierergruppen: 1101 ist 13, also D', () => {
  assert.deepEqual(nibbleView([1, 1, 0, 1]), { bits: '1101', value: 13, hex: 'D' });
});

test('Umrechnung zeigt jede Zeile und das Ergebnis', () => {
  const rows = decToBinRows(13);
  assert.equal(rows.length, decToBinSteps(13).length + 1);
  assert.ok(rows.at(-1).props.children.props.children.includes('13 = 1101'));
});
