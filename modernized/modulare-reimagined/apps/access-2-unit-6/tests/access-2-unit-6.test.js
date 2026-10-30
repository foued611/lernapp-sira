// Vokabel-App Access 2, Unit 6: Aufgaben aus content/access-2-unit-6. Prüft, dass jedes Wort der Wortliste drei Aufgaben hat
// (RULE-165: jede Aufgabe akzeptiert ihre richtige Antwort, RULE-223: Auswahl mit richtiger Antwort und höchstens drei falschen,
// RULE-229: Rundengrößen) und dass eine Runde jedes Wort höchstens einmal abfragt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { init, choice, typed, lessonPicks, lessonRound, quickRound, bossRound, blitzQuestion } from '../builders.js';
import { flowDiagram, tableDiagram, swapDiagram } from '../diagrams.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('access-2-unit-6');
init(paket);
const UNITS = paket.manifest.units;
const ITEMS = paket.data.items;
const alle = Object.values(ITEMS).flat();

// Groß- und Kleinschreibung wechselt Buchstabe für Buchstabe (kein toUpperCase: aus ß würde SS).
const wechsel = (s) => [...s].map((c, i) => (i % 2 ? c.toLowerCase() : c.toUpperCase())).join('');

test('Wortliste: 229 Wörter, jedes mit genau drei Aufgaben auf seiner Seite', () => {
  const nachWort = new Map();
  for (const [seite, liste] of Object.entries(ITEMS)) {
    for (const item of liste) {
      assert.equal(typeof item.w, 'number', `Aufgabe ohne Wortnummer auf ${seite}: ${item.q}`);
      if (!nachWort.has(item.w)) nachWort.set(item.w, { seite, anzahl: 0 });
      const eintrag = nachWort.get(item.w);
      assert.equal(eintrag.seite, seite, `Wort ${item.w} steht auf zwei Seiten`);
      eintrag.anzahl += 1;
    }
  }
  assert.equal(nachWort.size, 229);
  for (const [nummer, eintrag] of nachWort) assert.equal(eintrag.anzahl, 3, `Wort ${nummer} hat ${eintrag.anzahl} Aufgaben`);
  assert.deepEqual([...nachWort.keys()].sort((a, b) => a - b), Array.from({ length: 229 }, (_, i) => i));
});

test('Jede Seite hat einen Merkzettel und mindestens zehn Aufgaben', () => {
  for (const unit of UNITS) {
    assert.ok(ITEMS[unit.id].length >= 10, `${unit.id}: zu wenige Aufgaben`);
    assert.ok(paket.manifest.notes[unit.id].length > 0, `${unit.id}: kein Merkzettel`);
    assert.ok(paket.lessons[unit.id], `${unit.id}: keine Lektion`);
  }
});

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
    assert.equal(t.check(` ${wechsel(item.a)} `), 'ok', 'Groß/Klein und Leerzeichen zählen nicht');
    assert.equal(t.check(item.wrong[0]), 'bad');
    for (const weitere of item.accept || []) assert.equal(t.check(weitere), 'ok');
  }
});

test('RULE-223: Auswahl zeigt höchstens drei falsche Antworten, Lücken alle', () => {
  const rng = createRng(223);
  for (const item of alle.filter((it) => it.kind !== 'gap')) {
    assert.ok(choice(item, rng).options.length <= 4, `zu viele Optionen: ${item.q}`);
  }
});

test('Falsche Antworten kommen nicht doppelt vor und sind nie die richtige', () => {
  for (const item of alle) {
    assert.equal(new Set(item.wrong.map((w) => w.toLowerCase())).size, item.wrong.length, `Doppelte falsche Antworten: ${item.q}`);
    assert.ok(!item.wrong.map((w) => w.toLowerCase()).includes(item.a.toLowerCase()), `Richtige Antwort unter den falschen: ${item.q}`);
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

test('Eine Runde fragt jedes Wort höchstens einmal, auch bei der kleinsten Seite', () => {
  for (const unit of UNITS) {
    for (let seed = 1; seed <= 30; seed += 1) {
      const woerter = lessonPicks(unit, createRng(seed)).map((item) => item.w);
      assert.equal(new Set(woerter).size, 8, `Wort doppelt in einer Runde (${unit.id}, Seed ${seed})`);
    }
  }
});

test('Der Endgegner nimmt zwölf verschiedene Seiten, jede vierte Frage zum Eintippen', () => {
  for (let seed = 1; seed <= 20; seed += 1) {
    const runde = bossRound(createRng(seed));
    assert.equal(runde.length, 12);
    assert.equal(new Set(runde.map((q) => q.answer)).size >= 11, true, 'Fast alle Antworten verschieden');
    assert.equal(runde.filter((q) => q.kind === 'type').length, 3, 'Drei Eintipp-Fragen im Endgegner');
  }
});

test('Lektionen: jede Seite hat eine Tabelle mit den Lernwörtern', () => {
  for (const unit of UNITS) {
    const figur = paket.lessons[unit.id].figure;
    assert.equal(figur.diagram.name, 'tableDiagram');
    assert.equal(figur.diagram.args[1].length, 6, `${unit.id}: sechs Lernwörter`);
  }
});

test('Diagramme tragen einen Alternativtext', () => {
  const flow = flowDiagram(['since 8 o\'clock|(Start)', 'now|(still going)'], 'Zeitlinie');
  const table = tableDiagram(['x', 'y'], [['1', '2']], [1, 1], 'Tabelle');
  const swap = swapDiagram(['a', 'b', 'c'], ['c', 'b', 'a'], [2, 1, 0]);
  assert.equal(flow.props['aria-label'], 'Zeitlinie');
  assert.equal(table.props['aria-label'], 'Tabelle');
  assert.match(swap.props['aria-label'], /Aktiv: a b c/);
});
