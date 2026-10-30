// Biologie-Werkstatt: Aufgaben aus content/biologie. Prüft RULE-165 (jede Aufgabe akzeptiert ihre richtige Antwort),
// RULE-223 (Auswahl mit richtiger Antwort und höchstens drei falschen) und RULE-229 (Rundengrößen).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import logic from '../logic.js';
import { flowDiagram, tableDiagram, swapDiagram } from '../diagrams.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('biologie');
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

test('RULE-165: jede Lückenaufgabe akzeptiert ihre Antwort und lehnt eine falsche ab', () => {
  for (const item of alle.filter((it) => it.kind === 'gap')) {
    const t = typed(item);
    assert.equal(t.check(item.a), 'ok');
    // Wechselnde Schreibweise statt toUpperCase(): Das macht aus „ß“ ein „SS“.
    const mixedCase = [...item.a].map((c, i) => (c === 'ß' ? c : i % 2 ? c.toLowerCase() : c.toUpperCase())).join('');
    assert.equal(t.check(` ${mixedCase} `), 'ok', 'Groß/Klein und Leerzeichen zählen nicht');
    assert.equal(t.check(item.wrong[0]), 'bad');
  }
});

test('RULE-223: Auswahl zeigt höchstens drei falsche Antworten, Lücken alle', () => {
  const rng = createRng(223);
  for (const item of alle.filter((it) => it.kind !== 'gap')) {
    assert.ok(choice(item, rng).options.length <= 4, `zu viele Optionen: ${item.q}`);
  }
});

test('RULE-229: Runden haben ihre Größe, und gleicher Seed ergibt dieselbe Runde', () => {
  const rng = createRng(229);
  for (const unit of UNITS) assert.equal(lessonRound(unit, rng).length, 8);
  assert.equal(quickRound(rng).length, 5);
  assert.equal(bossRound(rng).length, 12);
  assert.ok(blitzQuestion(rng));
  const a = lessonRound(UNITS[0], createRng(7)).map((q) => q.answer);
  const b = lessonRound(UNITS[0], createRng(7)).map((q) => q.answer);
  assert.deepEqual(a, b);
});

test('Diagramme tragen einen Alternativtext', () => {
  const flow = flowDiagram(['Zelle|(klein)', 'Gewebe|(größer)'], 'Stufen');
  const table = tableDiagram(['x', 'y'], [['1', '2']], [1, 1], 'Tabelle');
  const swap = swapDiagram(['a', 'b', 'c'], ['c', 'b', 'a'], [2, 1, 0]);
  assert.equal(flow.props['aria-label'], 'Stufen');
  assert.equal(table.props['aria-label'], 'Tabelle');
  assert.match(swap.props['aria-label'], /Aktiv: a b c/);
});
