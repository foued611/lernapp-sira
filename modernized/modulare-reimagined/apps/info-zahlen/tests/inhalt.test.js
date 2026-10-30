// Inhaltsprüfung: Erzeugte Fragen werden unabhängig nachgerechnet und auf verratene oder doppeldeutige Fragen geprüft.
// Entstanden aus "Welchen Wert hat die 0 in 352?" (die Null steht gar nicht da) und "Welchen Wert hat die 5 in 5525?".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { init, placeValueQ, lampsQ, largestWeightQ, decToBinQ, binToDecQ, hexToDecQ, decToHexQ, binToHexQ, hexToBinQ, addQ, carryQ, makersFor } from '../builders.js';
import { askablePlaces, WEIGHTS } from '../numbers.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('info-zahlen');
init(paket);
const RUNS = 1500;
const ohneMarkup = (html) => html.replace(/<[^>]+>/g, '');
const zahlen = (q) => [...ohneMarkup(q.prompt).matchAll(/[0-9A-F]+/g)].map((m) => m[0]);

test('Stellenwert: gefragt wird nur nach einer Ziffer, die eindeutig in der Zahl steht', () => {
  const rng = createRng(500);
  let geprüft = 0;
  for (let i = 0; i < RUNS; i++) {
    const q = placeValueQ(rng);
    if (q.label !== 'Stellenwert erkennen') continue;
    geprüft++;
    const [ziffer, zahl] = zahlen(q);
    assert.equal(zahl.split(ziffer).length - 1, 1, ohneMarkup(q.prompt));
    assert.notEqual(ziffer, '0', ohneMarkup(q.prompt));
    const stelle = zahl.length - 1 - zahl.indexOf(ziffer);
    assert.equal(q.answer, String(Number(ziffer) * 10 ** stelle), ohneMarkup(q.prompt));
    assert.equal(q.options.length, 4);
  }
  assert.ok(geprüft > 100);
});

test('askablePlaces lässt Nullen und doppelte Ziffern aus', () => {
  assert.deepEqual(askablePlaces(352), [1, 2, 3]);
  assert.deepEqual(askablePlaces(5525), [2]);
  assert.deepEqual(askablePlaces(1111), []);
});

test('Lampen: Es leuchten mindestens zwei, und die Summe stimmt', () => {
  const rng = createRng(501);
  for (let i = 0; i < RUNS; i++) {
    const q = lampsQ(rng);
    const teile = ohneMarkup(q.prompt).match(/leuchten: (.*)\. Wie/)[1].split(' + ').map(Number);
    assert.ok(teile.length >= 2, q.prompt);
    assert.equal(q.answer, String(teile.reduce((a, b) => a + b, 0)));
  }
});

test('Größter Stellenwert: Die Zahl selbst ist keine Zweierpotenz, alle Optionen sind Zweierpotenzen', () => {
  const rng = createRng(502);
  for (let i = 0; i < RUNS; i++) {
    const q = largestWeightQ(rng);
    const [n] = zahlen(q).map(Number);
    assert.ok(!WEIGHTS.includes(n), q.prompt);
    assert.equal(Number(q.answer), 2 ** Math.floor(Math.log2(n)), q.prompt);
    for (const o of q.options) assert.equal(Math.log2(Number(o.id)) % 1, 0, `${q.prompt}: ${o.id}`);
  }
});

test('Binäroptionen sind alle verschieden viel wert, die Antwort ist die einzige richtige', () => {
  const rng = createRng(503);
  for (const stufe of ['easy', 'mid', 'hard']) {
    for (let i = 0; i < RUNS; i++) {
      const q = decToBinQ(stufe, rng);
      if (q.kind !== 'choice') continue;
      const werte = q.options.map((o) => parseInt(o.id, 2));
      assert.equal(new Set(werte).size, werte.length, `${q.prompt}: ${q.options.map((o) => o.id)}`);
      const [n] = zahlen(q).map(Number);
      assert.equal(werte.filter((w) => w === n).length, 1, q.prompt);
    }
  }
});

test('Umrechnungen stimmen über alle Stufen', () => {
  const rng = createRng(504);
  for (let i = 0; i < RUNS; i++) {
    const a = binToDecQ('mid', rng);
    assert.equal(Number(a.answer), parseInt(zahlen(a)[0], 2));
    const b = hexToDecQ('hard', rng);
    assert.equal(Number(b.answer), parseInt(zahlen(b)[0], 16));
    const c = decToHexQ('hard', rng);
    assert.equal(parseInt(c.answer, 16), Number(zahlen(c)[0]));
    const d = binToHexQ('mid', rng);
    assert.equal(parseInt(d.answer, 16), parseInt(zahlen(d)[0], 2));
    const e = hexToBinQ(rng);
    assert.equal(parseInt(e.answer, 2), parseInt(zahlen(e)[0], 16));
    assert.equal(e.answer.length, 8);
    const f = addQ('mid', rng);
    const [x, y] = zahlen(f);
    assert.equal(parseInt(f.answer, 2), parseInt(x, 2) + parseInt(y, 2));
  }
});

test('Hex-Optionen sind verschieden, und Eintippen akzeptiert Kleinbuchstaben und 0x', () => {
  const rng = createRng(505);
  for (let i = 0; i < RUNS; i++) {
    const q = binToHexQ('mid', rng);
    if (q.kind === 'type') {
      for (const eingabe of [q.answer.toLowerCase(), `0x${q.answer}`, ` ${q.answer} `]) assert.equal(q.check(eingabe), 'ok', eingabe);
    } else {
      assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    }
  }
});

test('Binär-Regel: Erklärung passt zur Rechnung', () => {
  const rng = createRng(506);
  for (let i = 0; i < 200; i++) {
    const q = carryQ(rng);
    const summe = ohneMarkup(q.prompt).replace(' = ?', '').split(' + ').map(Number).reduce((a, b) => a + b, 0);
    assert.equal(parseInt(q.answer, 2), summe, q.prompt);
    assert.equal(q.why.includes('merke'), summe >= 2, q.why);
  }
});

test('Jeder Seite bleibt ein Erzeuger, und keine Frage zeigt die Antwort im Fragetext', () => {
  const rng = createRng(507);
  for (const unit of paket.manifest.units) {
    for (const make of makersFor(unit.id)) {
      for (let i = 0; i < 300; i++) {
        const q = make(rng);
        if (q.kind === 'match' || q.label === 'Zahl zerlegen') continue;
        const genannt = zahlen(q);
        // 1 + 0 = 1 sind Rechenregeln und die Einer-Stelle hat den Wert ihrer Ziffer: Das Ergebnis steht dort zwangsläufig im Text.
        if (q.label === 'Binär-Regel' || q.label === 'Stellenwert erkennen') continue;
        assert.ok(!genannt.includes(q.answer), `${unit.id}: ${q.prompt} -> ${q.answer}`);
      }
    }
  }
});
