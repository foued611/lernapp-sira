// Inhaltsprüfung der erzeugten Fragen: jede Aufgabe wird unabhängig nachgerechnet und auf sinnlose Werte geprüft.
// Entstanden aus dem Fund "Von 150 Schülern spielen 7,5 ein Instrument" und "8x + 8 = 2 · (4x + 4)".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng, MINUS } from '../../../helfer/index.js';
import { POOLS, choice, typed, createBuilders } from '../builders.js';
import { euro, gcd, nah, termCheck } from '../math.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('mathe');
const { make } = createBuilders(paket);
const UNITS = paket.manifest.units;
const RUNS = 600;

const zahl = (text) => Number(String(text).replace(MINUS, '-').replace(',', '.'));
const zahlen = (text) => [...text.matchAll(/−?\d+(?:,\d+)?/g)].map((m) => zahl(m[0]));
const alleAufgaben = (unitId, seed, each) => {
  const rng = createRng(seed);
  for (let i = 0; i < RUNS; i++) each(make(unitId, rng), rng);
};

test('Antworten und Optionen nutzen Komma und echtes Minuszeichen, nie Rechenreste', () => {
  for (const [i, unit] of UNITS.entries()) {
    alleAufgaben(unit.id, 300 + i, (item) => {
      for (const text of [item.answer, ...item.wrong, item.prompt, item.why]) {
        assert.ok(!/\d\.\d/.test(text), `Punkt statt Komma: ${text}`);
        assert.ok(!/(^|[ (=])-\d/.test(text), `kurzes Minus: ${text}`);
        assert.ok(!/,\d{4}/.test(text), `Rundungsrest: ${text}`);
      }
      assert.ok(!/(^|\s)(0|1)x\b/.test(item.answer), `0x oder 1x: ${item.answer}`);
    });
  }
});

test('Sachaufgaben in Euro und Prozent haben keine negativen oder krummen Optionen', () => {
  for (const unitId of ['prozent', 'zinsen', 'kredit']) {
    alleAufgaben(unitId, 310, (item) => {
      if (!item.unit) return;
      for (const text of [item.answer, ...item.wrong]) {
        assert.ok(zahl(text) > 0, `${item.prompt}: ${text}`);
        assert.ok(!/,\d{3}/.test(text), `${item.prompt}: ${text}`);
      }
    });
  }
});

test('Prozentsatz: es werden nur ganze Personen gezählt', () => {
  const [, , prozentsatz] = POOLS.prozent;
  const rng = createRng(311);
  for (let i = 0; i < RUNS; i++) {
    const item = prozentsatz(rng);
    const [g, w] = zahlen(item.prompt);
    assert.ok(Number.isInteger(w), item.prompt);
    assert.equal(zahl(item.answer), w / g * 100, item.prompt);
    assert.ok(!item.why.includes('.'.repeat(2)) && !/0\.\d/.test(item.why), item.why);
  }
});

test('Ausklammern: der Faktor ist wirklich der größte gemeinsame', () => {
  const [, , , , aus] = POOLS.terme;
  const rng = createRng(312);
  for (let i = 0; i < RUNS; i++) {
    const item = aus(rng);
    const [A, C] = zahlen(item.prompt);
    assert.equal(Number(item.answer.split(' ')[0]), gcd(A, C), item.prompt);
  }
});

test('Vorzeichen: Mal und Geteilt nennen die Vorzeichen der Rechnung, jede Rechnung hat einen negativen Wert', () => {
  const rng = createRng(313);
  for (let i = 0; i < RUNS; i++) {
    const item = POOLS.vorzeichen[2](rng);
    const [a, b] = zahlen(item.prompt);
    const geteilt = item.prompt.includes(':');
    assert.equal(zahl(item.answer), geteilt ? a / b : a * b, item.prompt);
    assert.ok(a < 0 || b < 0, item.prompt);
    assert.ok(Math.abs(b) > 1 && (geteilt || Math.abs(a) > 1), item.prompt);
    assert.equal(item.why.startsWith('Gleiche'), (a < 0) === (b < 0), `${item.prompt}: ${item.why}`);
  }
  for (let i = 0; i < RUNS; i++) {
    const item = POOLS.vorzeichen[0](rng);
    const [a, b] = zahlen(item.prompt);
    assert.equal(zahl(item.answer), item.prompt.includes(' + ') ? a + b : a - b, item.prompt);
    assert.ok(a < 0 || b < 0 || item.prompt.includes(MINUS) && a < b, item.prompt);
  }
});

test('Wahrscheinlichkeiten: keine Option liegt über 1', () => {
  for (const unitId of ['zufall']) {
    alleAufgaben(unitId, 314, (item) => {
      for (const text of [item.answer, ...item.wrong]) {
        const [z, n = 1] = text.split('/').map(zahl);
        assert.ok(z / n <= 1, `${item.prompt}: ${text}`);
      }
    });
  }
});

test('Relative Häufigkeit: eine faire Münze zeigt keine unglaubwürdigen Ergebnisse', () => {
  const rng = createRng(315);
  for (let i = 0; i < RUNS; i++) {
    const item = POOLS.zufall[2](rng);
    const [n, k] = zahlen(item.prompt);
    assert.ok(k / n >= 0.3 && k / n <= 0.7, item.prompt);
  }
});

test('Euro stehen mit zwei Nachkommastellen in Optionen und Auflösung', () => {
  const item = { prompt: 'Wie hoch sind die Zinsen?', answer: '37,5', value: 37.5, unit: '€', numeric: true, wrong: ['50', '75', '12,5'], why: 'x' };
  const q = choice(item, createRng(1));
  assert.deepEqual(q.options.map((o) => o.html).sort(), ['12,50 €', '37,50 €', '50 €', '75 €']);
  assert.equal(q.reveal, '37,50 €');
  assert.equal(euro(40), '40');
  assert.equal(euro(0.5), '0,50');
});

test('Eintippen akzeptiert gleichwertige Schreibweisen', () => {
  assert.equal(termCheck('−x + 13')('13 - x'), 'ok');
  assert.equal(termCheck('−x + 13')('13-x'), 'ok');
  assert.equal(termCheck('3x + 12')('12 + 3x'), 'ok');
  assert.equal(termCheck('x + 4')('1x + 4'), 'ok');
  assert.equal(termCheck('8x')('3x + 5x'), 'bad');
  assert.equal(termCheck('3x + 12')('3x + 13'), 'bad');
  const q = typed({ prompt: '2x + 1 = 9', answer: '4', value: 4, numeric: true, why: 'x' });
  for (const eingabe of ['4', 'x = 4', 'x=4', 'X = 4,0']) assert.equal(q.check(eingabe), 'ok', eingabe);
  assert.equal(q.check('x = 5'), 'bad');
  const p = typed({ prompt: 'Wie viel Prozent?', answer: '25', value: 25, unit: '%', numeric: true, why: 'x' });
  for (const eingabe of ['25', '25 %', '25%', '25 Prozent']) assert.equal(p.check(eingabe), 'ok', eingabe);
});

test('nah liefert plausible Zahlen im Maßstab der Lösung', () => {
  const rng = createRng(316);
  assert.deepEqual(nah(10, [20, 30, 40, 50], rng), [20, 30, 40]);
  assert.ok(nah(2, [-3, 0, 7.123], rng).every((v) => v > 0 && v !== 2));
  assert.ok(nah(1500, [], rng).every((v) => v % 100 === 0));
});
