import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertValidQuestion, diskSource } from './helpers.js';
import { init, lessonRound, bossRound, typed, choice } from '../apps/englisch/builders.js';
import { flowDiagram, tableDiagram, swapDiagram } from '../apps/englisch/diagrams.js';

const bundle = await diskSource().load('englisch');
init({ data: bundle.data, manifest: bundle.manifest });
const items = Object.entries(bundle.data.items);

test('Englisch: jede Seite hat genug Aufgaben, und die Aufgaben sind in sich stimmig', () => {
  assert.deepEqual(items.map(([unit]) => unit).sort(), bundle.manifest.units.map((u) => u.id).sort());
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

test('Englisch: Lücken-Aufgaben lassen sich auswählen und eintippen', () => {
  for (const [, list] of items) for (const item of list.filter((i) => i.kind === 'gap')) {
    const c = choice(item);
    assertValidQuestion(c);
    assert.ok(c.options.some((o) => o.id === item.a && o.fill === item.a));
    const t = typed(item);
    assertValidQuestion(t);
    assert.equal(t.check(item.a), 'ok');
    assert.equal(t.check(` ${item.a.toUpperCase()} `), 'ok', 'Groß/Klein und Leerzeichen werden toleriert');
    assert.equal(t.check(item.wrong[0]), 'bad');
  }
});

test('Englisch: Runden liefern gültige Fragen', () => {
  for (let n = 0; n < 100; n++) {
    for (const unit of bundle.manifest.units) { const round = lessonRound(unit); assert.equal(round.length, 8); round.forEach(assertValidQuestion); }
    bossRound().forEach(assertValidQuestion);
  }
});

test('Englisch: Diagramme sind gültiges SVG und enthalten ihre Texte', () => {
  const flow = flowDiagram(['since 8 o\'clock|(Start)', 'now|(still going)'], 'Test');
  const table = tableDiagram(['x', 'y'], [['1', '2'], ['3', '4']], [1, 1], 'Test');
  const swap = swapDiagram(['a', 'b', 'c'], ['c', 'b', 'a'], [2, 1, 0]);
  for (const s of [flow, table, swap]) { assert.match(s, /^<svg/); assert.match(s, /role="img"/); }
  assert.match(flow, /since 8 o&#39;clock|since 8 o'clock/);
  assert.match(table, />4</);
  assert.match(swap, />c</);
});

test('Englisch: jede Seite hat eine Lektion mit allen Pflichtteilen', () => {
  for (const unit of bundle.manifest.units) {
    const lesson = bundle.lessons[unit.id];
    assert.ok(lesson, `${unit.id}: Lektion fehlt`);
    assert.ok(lesson.check.options.some((o) => o.id === lesson.check.answer), `${unit.id}: Antwort des Mini-Checks fehlt`);
  }
});
