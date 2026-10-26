import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertValidQuestion, diskSource } from './helpers.js';
import { init, lessonRound, bossRound, typed, choice } from '../apps/deutsch/builders.js';
import { flowDiagram, tableDiagram, swapDiagram } from '../apps/deutsch/diagrams.js';

const bundle = await diskSource().load('deutsch');
init({ data: bundle.data, manifest: bundle.manifest });
const items = Object.entries(bundle.data.items);

test('Deutsch: jede Aufgabe ist in sich stimmig', () => {
  for (const [unit, list] of items) {
    assert.ok(list.length >= 10, `${unit}: zu wenige Aufgaben`);
    assert.equal(new Set(list.map((i) => `${i.q}|${i.s || ''}|${i.a}`)).size, list.length, `${unit}: doppelte Aufgabe`);
    for (const item of list) {
      const id = `${unit}: ${item.q} ${item.s || ''}`;
      assert.ok(item.why && item.why.length > 10, `${id}: Erklärung fehlt`);
      assert.ok(!item.wrong.includes(item.a), `${id}: richtige Antwort steht bei den falschen`);
      assert.equal(new Set(item.wrong).size, item.wrong.length, `${id}: falsche Antworten doppelt`);
      if (item.kind === 'gap') {
        assert.equal(item.s.split('___').length, 2, `${id}: genau eine Lücke`);
        assert.ok(item.wrong.length >= 1);
      } else {
        assert.ok(item.wrong.length >= 3, `${id}: mindestens drei falsche Antworten`);
      }
    }
  }
});

test('Deutsch: Lücken-Aufgaben lassen sich auswählen und eintippen', () => {
  for (const [, list] of items) for (const item of list.filter((i) => i.kind === 'gap')) {
    const c = choice(item);
    assertValidQuestion(c);
    assert.ok(c.options.some((o) => o.id === item.a && o.fill === item.a));
    const t = typed(item);
    assertValidQuestion(t);
    assert.equal(t.check(item.a), 'ok');
    // Wechselnde Groß-/Kleinschreibung statt toUpperCase(): Das macht aus „ß“ ein „SS“ und würde die Aufgabe verfälschen.
    const mixedCase = [...item.a].map((c, i) => (c === 'ß' ? c : i % 2 ? c.toLowerCase() : c.toUpperCase())).join('');
    assert.equal(t.check(` ${mixedCase} `), 'ok', 'Groß/Klein und Leerzeichen werden toleriert');
    assert.equal(t.check(item.wrong[0]), 'bad');
  }
});

test('Deutsch: Runden liefern gültige Fragen', () => {
  for (let n = 0; n < 100; n++) {
    for (const unit of bundle.manifest.units) { const round = lessonRound(unit); assert.equal(round.length, 8); round.forEach(assertValidQuestion); }
    bossRound().forEach(assertValidQuestion);
  }
});

test('Deutsch: Diagramme sind gültiges SVG und enthalten ihre Texte', () => {
  const flow = flowDiagram(['A|B', 'C'], 'Test');
  const table = tableDiagram(['x', 'y'], [['1', '2'], ['3', '4']]);
  const swap = swapDiagram(['a', 'b', 'c'], ['c', 'b', 'a', 'd'], [2, 1, 0]);
  for (const s of [flow, table, swap]) { assert.match(s, /^<svg/); assert.match(s, /role="img"/); }
  assert.match(flow, />A</);
  assert.match(table, />4</);
  assert.match(swap, />d</);
});
