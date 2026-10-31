// Deutsch-Werkstatt 5/6: Aufgaben aus content/deutsch-5-6. Prüft RULE-165 (jede Aufgabe akzeptiert ihre richtige Antwort),
// RULE-223 (Auswahl mit richtiger Antwort und höchstens drei falschen) und RULE-229 (Rundengrößen).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import logic from '../logic.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('deutsch-5-6');
const { choice, typed, lessonRound, quickRound, bossRound, blitzQuestion } = logic.pool(paket);
const UNITS = paket.manifest.units;
const ITEMS = paket.data.items;
const alle = Object.values(ITEMS).flat();

test('RULE-165: jede Auswahlaufgabe hat ihre richtige Antwort unter den Optionen', () => {
  const rng = createRng(165);
  for (const item of alle) {
    const q = choice(item, rng);
    assert.equal(q.kind, 'choice');
    assert.ok(q.options.some((o) => o.id === item.a), `Antwort fehlt bei: ${item.q}`);
  }
});

test('RULE-165: jede Eingabeaufgabe akzeptiert ihre eigene Antwort', () => {
  for (const item of alle.filter((it) => it.kind === 'gap')) {
    const q = typed(item);
    assert.equal(q.check(item.a), 'ok', `check verwirft die Antwort: ${item.a}`);
  }
});

test('RULE-223: Auswahl zeigt die richtige Antwort und höchstens drei falsche, nie eine weitere', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const rng = createRng(seed);
    for (const item of alle.filter((it) => it.kind !== 'gap')) {
      const q = choice(item, rng);
      assert.ok(q.options.length <= 4, `mehr als vier Optionen bei: ${item.q}`);
      const erlaubt = [item.a, ...item.wrong];
      for (const o of q.options) assert.ok(erlaubt.includes(o.id), `unbekannte Option: ${o.id}`);
    }
  }
});

test('RULE-223: die richtige Antwort steht nicht immer an derselben Stelle', () => {
  const item = ITEMS[UNITS[0].id].find((it) => it.kind !== 'gap');
  const stellen = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const q = choice(item, createRng(seed));
    stellen.add(q.options.findIndex((o) => o.id === item.a));
  }
  assert.ok(stellen.size > 1, 'die Antwort liegt immer an derselben Stelle');
});

test('RULE-229: Lektionsrunde 8 Fragen, Endgegner 12, Schnellrunde 5, Blitz ist Auswahl', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = createRng(seed);
    const unit = UNITS[seed % UNITS.length];
    const lektion = lessonRound(unit, rng);
    assert.equal(lektion.length, 8);
    assert.equal(bossRound(rng).length, 12);
    assert.equal(quickRound(rng).length, 5);
    assert.equal(blitzQuestion(rng).kind, 'choice');
  }
});

test('Gleicher Seed ergibt dieselben Aufgaben', () => {
  const a = lessonRound(UNITS[0], createRng(42));
  const b = lessonRound(UNITS[0], createRng(42));
  // Die Prüffunktion der Eingabeaufgaben ist je Aufruf neu, darum vergleichen wir die sichtbaren Teile.
  const sicht = (round) => round.map((q) => [q.kind, q.prompt, q.answer, (q.options || []).map((o) => o.id)]);
  assert.deepEqual(sicht(a), sicht(b));
});

test('Lückensätze zeigen die Lücke als {{blank}} und den Hinweis als sub', () => {
  const gap = alle.find((it) => it.kind === 'gap');
  const q = choice(gap, createRng(7));
  assert.match(q.prompt, /\{\{blank\}\}/);
  assert.equal(q.sub, gap.q);
  assert.ok(q.options.every((o) => o.fill !== undefined), 'eine Option ohne Füllwert');
});
