// Englisch-Werkstatt: Aufgaben aus content/englisch. Prüft RULE-165 (jede Aufgabe akzeptiert ihre richtige Antwort),
// RULE-223 (Auswahl mit richtiger Antwort und höchstens drei falschen) und RULE-229 (Rundengrößen).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { createBuilders } from '../builders.js';
import { flowDiagram, tableDiagram, swapDiagram } from '../diagrams.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('englisch');
const { choice, typed, lessonPicks, lessonRound, quickRound, bossRound, blitzQuestion } = createBuilders(paket);
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
    assert.equal(t.check(` ${item.a.toUpperCase()} `), 'ok', 'Groß/Klein und Leerzeichen zählen nicht');
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
  const flow = flowDiagram(['since 8 o\'clock|(Start)', 'now|(still going)'], 'Zeitlinie');
  const table = tableDiagram(['x', 'y'], [['1', '2']], [1, 1], 'Tabelle');
  const swap = swapDiagram(['a', 'b', 'c'], ['c', 'b', 'a'], [2, 1, 0]);
  assert.equal(flow.props['aria-label'], 'Zeitlinie');
  assert.equal(table.props['aria-label'], 'Tabelle');
  assert.match(swap.props['aria-label'], /Aktiv: a b c/);
});

// ---- Vokabel-Seiten (Access 2, Unit 6): jede Aufgabe trägt die Nummer w ihres Worts ----
const VOKABELN = UNITS.filter((u) => ITEMS[u.id].some((it) => it.w !== undefined));

test('Vokabeln: 15 Seiten mit 229 Wörtern, jedes Wort hat genau drei Aufgaben auf einer Seite', () => {
  assert.equal(VOKABELN.length, 15);
  const nachWort = new Map();
  for (const unit of VOKABELN) {
    for (const item of ITEMS[unit.id]) {
      assert.equal(typeof item.w, 'number', `Aufgabe ohne Wortnummer auf ${unit.id}: ${item.q}`);
      const eintrag = nachWort.get(item.w) || { seite: unit.id, anzahl: 0 };
      assert.equal(eintrag.seite, unit.id, `Wort ${item.w} steht auf zwei Seiten`);
      eintrag.anzahl += 1;
      nachWort.set(item.w, eintrag);
    }
  }
  assert.equal(nachWort.size, 229);
  for (const [nummer, eintrag] of nachWort) assert.equal(eintrag.anzahl, 3, `Wort ${nummer} hat ${eintrag.anzahl} Aufgaben`);
  assert.deepEqual([...nachWort.keys()].sort((a, b) => a - b), Array.from({ length: 229 }, (_, i) => i));
});

test('Vokabeln: falsche Antworten sind nie doppelt und nie die richtige', () => {
  for (const unit of VOKABELN) {
    for (const item of ITEMS[unit.id]) {
      const falsch = item.wrong.map((w) => w.toLowerCase());
      assert.equal(new Set(falsch).size, falsch.length, `Doppelte falsche Antworten: ${item.q}`);
      assert.ok(!falsch.includes(item.a.toLowerCase()), `Richtige Antwort unter den falschen: ${item.q}`);
    }
  }
});

test('Vokabeln: Merkzettel, Lektion und Tabelle mit sechs Lernwörtern je Seite', () => {
  for (const unit of VOKABELN) {
    assert.ok(paket.manifest.notes[unit.id].length > 0, `${unit.id}: kein Merkzettel`);
    const figur = paket.lessons[unit.id].figure;
    assert.equal(figur.diagram.name, 'tableDiagram');
    assert.equal(figur.diagram.args[1].length, 6, `${unit.id}: sechs Lernwörter`);
  }
});

test('Vokabeln: eine Runde fragt 8 verschiedene Wörter, die Hälfte zum Eintippen', () => {
  for (const unit of VOKABELN) {
    for (let seed = 1; seed <= 30; seed += 1) {
      const woerter = lessonPicks(unit, createRng(seed)).map((item) => item.w);
      assert.equal(new Set(woerter).size, 8, `Wort doppelt in einer Runde (${unit.id}, Seed ${seed})`);
    }
    assert.ok(lessonRound(unit, createRng(3)).some((q) => q.kind === 'type'), `${unit.id}: keine Eintipp-Frage`);
  }
});

test('Endgegner: zwölf verschiedene Seiten, Vokabel-Seiten kommen vor', () => {
  let mitVokabeln = 0;
  for (let seed = 1; seed <= 40; seed += 1) {
    const runde = bossRound(createRng(seed));
    assert.equal(runde.length, 12);
    assert.ok(runde.filter((q) => q.kind === 'type').length <= 3);
    if (runde.some((q) => VOKABELN.some((u) => ITEMS[u.id].some((it) => it.a === q.answer)))) mitVokabeln += 1;
  }
  assert.ok(mitVokabeln > 30, 'Vokabel-Seiten fehlen im Endgegner');
});
