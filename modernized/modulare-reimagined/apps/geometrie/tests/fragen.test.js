// Inhaltsprüfung: Erzeugte Geometrie-Fragen werden unabhängig nachgerechnet und auf sinnlose Werte geprüft.
// Entstanden aus "Ein Haus ist 1,5 m lang" und der Frage zur Dreiecksungleichung, deren Antwort immer Nein war.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng, MINUS } from '../../../helfer/index.js';
import { init, make, POOLS } from '../builders.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('geometrie');
init(paket);
const UNITS = paket.manifest.units;
const RUNS = 800;
const zahl = (text) => Number(String(text).replace(MINUS, '-').replace(',', '.').replace(/[^\d.-]/g, ''));
const zahlen = (text) => [...text.matchAll(/\d+(?:,\d+)?/g)].map((m) => zahl(m[0]));
const gen = (name, pool) => POOLS[pool].find((fn) => fn.name === name);

test('Keine Option ist negativ oder doppelt, Längen und Winkel sind größer als 0', () => {
  for (const [i, unit] of UNITS.entries()) {
    const rng = createRng(400 + i);
    for (let n = 0; n < RUNS; n++) {
      const item = make(unit.id, rng);
      const alle = [item.answer, ...item.wrong];
      assert.equal(new Set(alle).size, alle.length, item.prompt);
      if (!item.numeric) continue;
      for (const text of alle) assert.ok(zahl(text) > 0, `${item.prompt}: ${text}`);
    }
  }
});

test('Dreiecksungleichung: Die Antwort folgt aus den Seiten, und beide Antworten kommen vor', () => {
  const rng = createRng(401);
  const fn = gen('dreieckUngleichung', 'dreiecke');
  const gesehen = new Set();
  for (let n = 0; n < RUNS; n++) {
    const item = fn(rng);
    const [a, b, c] = zahlen(item.prompt);
    const möglich = a + b > c && a + c > b && b + c > a;
    assert.equal(item.answer.startsWith('Ja'), möglich, item.prompt);
    gesehen.add(möglich);
  }
  assert.equal(gesehen.size, 2);
});

test('Maßstab: Die Größe des Gegenstands ist glaubwürdig und die Umrechnung stimmt', () => {
  const rng = createRng(402);
  const fn = gen('zeichnung', 'groessen');
  for (let n = 0; n < RUNS; n++) {
    const item = fn(rng);
    const [meter, , massstab] = zahlen(item.prompt);
    assert.equal(zahl(item.answer), meter * 100 / massstab, item.prompt);
    if (item.prompt.startsWith('Ein Haus')) assert.ok(meter >= 8, item.prompt);
    if (item.prompt.startsWith('Ein Zimmer')) assert.ok(meter >= 3, item.prompt);
  }
});

test('Winkelpaare: Nebenwinkel ergeben 180°, die anderen sind gleich groß, 90° kommt nicht vor', () => {
  const rng = createRng(403);
  const fn = gen('winkelPaar', 'winkel');
  for (let n = 0; n < RUNS; n++) {
    const item = fn(rng);
    const [a] = zahlen(item.prompt);
    assert.notEqual(a, 90);
    assert.equal(zahl(item.answer), item.prompt.includes('Nebenwinkel') ? 180 - a : a, item.prompt);
  }
});

test('Eindeutigkeit: Die Daten stimmen mit dem Sinussatz und der Winkelsumme überein', () => {
  // Unabhängige Probe, nicht aus dem Lehrstoff: Zahl der Lösungen bei SsW aus sin β = b · sin α / a.
  const zahlSsW = (a, b, alpha) => {
    const s = b * Math.sin(alpha * Math.PI / 180) / a;
    if (s > 1) return 0;
    const b1 = Math.asin(s) * 180 / Math.PI;
    return [b1, 180 - b1].filter((beta) => alpha + beta < 180).length;
  };
  assert.equal(zahlSsW(5, 7, 40), 2);
  assert.equal(zahlSsW(7, 5, 40), 1);
  const texte = Object.fromEntries(paket.data.eindeutig.map(([given, ans]) => [given, ans]));
  assert.equal(Object.entries(texte).filter(([g]) => g.startsWith('a = 5'))[0][1], 'zwei verschiedene Dreiecke');
  assert.equal(Object.entries(texte).filter(([g]) => g.startsWith('a = 7'))[0][1], 'genau ein Dreieck');
});

test('Die richtige Antwort fällt bei festen Fragen nicht durch ihre Länge auf', () => {
  for (const key of ['msFacts', 'whFacts', 'drFacts', 'thFacts', 'krFacts', 'grFacts', 'prFacts']) {
    for (const fakt of paket.data[key]) {
      const längste = Math.max(...fakt.wrong.map((w) => w.length));
      assert.ok(fakt.answer.length <= längste * 1.6, `${fakt.prompt}: ${fakt.answer}`);
    }
  }
});
