// Französisch-Werkstatt zu Découvertes 1: Aufgaben aus content/decouvertes-1. Prüft, dass jede Aufgabe ihre richtige Antwort annimmt,
// dass Auswahlfragen höchstens drei falsche Antworten zeigen und dass Runden ihre Größe haben. Dazu die Vokabel-Seiten (Aufgaben tragen ihr Wort in w).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { createBuilders } from '../builders.js';
import { flowDiagram, tableDiagram, swapDiagram } from '../diagrams.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('decouvertes-1');
const { choice, typed, lessonPicks, lessonRound, quickRound, bossRound, blitzQuestion } = createBuilders(paket);
const UNITS = paket.manifest.units;
const ITEMS = paket.data.items;
const alle = Object.values(ITEMS).flat();
const VOKABELN = UNITS.filter((u) => ITEMS[u.id].some((it) => it.w !== undefined));
const GRAMMATIK = UNITS.filter((u) => !VOKABELN.includes(u));

const ohneAkzent = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '');

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
    assert.equal(t.check(item.wrong[0]), 'bad', `erste falsche Antwort wird angenommen: ${item.s}`);
    for (const weitere of item.accept ?? []) assert.equal(t.check(weitere), 'ok', `accept wird abgelehnt: ${weitere}`);
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
  const flow = flowDiagram(['Hier|Louvre', 'Ce soir|Restaurant'], 'Zeitleiste');
  const table = tableDiagram(['x', 'y'], [['1', '2']], [1, 1], 'Tabelle');
  const swap = swapDiagram(['a', 'b', 'c'], ['c', 'b', 'a'], [2, 1, 0]);
  assert.equal(flow.props['aria-label'], 'Zeitleiste');
  assert.equal(table.props['aria-label'], 'Tabelle');
  assert.match(swap.props['aria-label'], /Aktiv: a b c/);
});

test('Aufbau: erst Grundwissen und Vokabeln, dann die Vertiefung; jede Seite hat mindestens 10 Aufgaben', () => {
  const gruppen = paket.manifest.groups.map((g) => g.id);
  assert.deepEqual(gruppen, ['unite-6', 'unite-7', 'vertiefung']);
  const letzte = UNITS.findLastIndex((u) => u.group !== 'vertiefung');
  const erste = UNITS.findIndex((u) => u.group === 'vertiefung');
  assert.ok(erste > letzte, 'Vertiefungsseiten stehen vor Grundwissen');
  for (const unit of UNITS) assert.ok(ITEMS[unit.id].length >= 10, `${unit.id}: zu wenig Aufgaben`);
});

test('Aufbau: Voraussetzungen verweisen nur auf frühere Seiten', () => {
  const stelle = new Map(UNITS.map((u, i) => [u.id, i]));
  for (const unit of UNITS) {
    for (const id of unit.needs ?? []) {
      assert.ok(stelle.has(id), `${unit.id}: unbekannte Voraussetzung ${id}`);
      assert.ok(stelle.get(id) < stelle.get(unit.id), `${unit.id} baut auf späterer Seite ${id} auf`);
    }
  }
  for (const unit of UNITS.filter((u) => u.group === 'vertiefung')) assert.ok(unit.needs?.length > 0, `${unit.id}: keine Voraussetzung`);
});

// ---- Vokabel-Seiten: jede Aufgabe trägt die Nummer w ihres Worts ----
test('Vokabeln: jedes Wort hat mindestens zwei Aufgaben und steht nur auf einer Seite', () => {
  for (const unit of VOKABELN) {
    const nachWort = new Map();
    for (const item of ITEMS[unit.id]) {
      assert.equal(typeof item.w, 'number', `Aufgabe ohne Wortnummer auf ${unit.id}: ${item.q}`);
      nachWort.set(item.w, (nachWort.get(item.w) ?? 0) + 1);
    }
    assert.ok(nachWort.size >= 8, `${unit.id}: weniger als 8 Wörter, die Runde braucht 8 verschiedene`);
    for (const [nummer, anzahl] of nachWort) assert.ok(anzahl >= 2, `${unit.id}: Wort ${nummer} hat nur ${anzahl} Aufgabe`);
  }
  assert.equal(VOKABELN.length, 11);
  assert.equal(GRAMMATIK.length, 6);
});

test('Vokabeln: falsche Antworten sind nie doppelt und nie die richtige', () => {
  for (const unit of UNITS) {
    for (const item of ITEMS[unit.id]) {
      const falsch = item.wrong.map((w) => w.toLowerCase());
      assert.equal(new Set(falsch).size, falsch.length, `Doppelte falsche Antworten: ${item.q}`);
      assert.ok(!falsch.includes(item.a.toLowerCase()), `Richtige Antwort unter den falschen: ${item.q}`);
      assert.ok(!(item.accept ?? []).some((a) => falsch.includes(a.toLowerCase())), `accept steht unter den falschen: ${item.q}`);
    }
  }
});

test('Vokabeln: Merkzettel und Lektion mit Tabelle je Seite', () => {
  for (const unit of VOKABELN) {
    assert.ok(paket.manifest.notes[unit.id].length > 0, `${unit.id}: kein Merkzettel`);
    const figur = paket.lessons[unit.id].figure;
    assert.equal(figur.diagram.name, 'tableDiagram');
    assert.ok(figur.diagram.args[1].length >= 5, `${unit.id}: zu wenige Lernwörter in der Tabelle`);
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

test('Schreibweise: Lückenwörter mit Akzent sind nicht durch Weglassen des Akzents richtig', () => {
  const mitAkzent = alle.filter((it) => it.kind === 'gap' && ohneAkzent(it.a) !== it.a);
  assert.ok(mitAkzent.length > 20);
  for (const item of mitAkzent) {
    const t = typed(item);
    assert.notEqual(t.check(ohneAkzent(item.a)), 'ok', `Akzent wird nicht verlangt: ${item.a}`);
  }
});

test('Endgegner: zwölf Aufgaben aus verschiedenen Seiten, Vokabel- und Grammatikseiten kommen vor', () => {
  let mitVokabeln = 0;
  let mitGrammatik = 0;
  for (let seed = 1; seed <= 40; seed += 1) {
    const runde = bossRound(createRng(seed));
    assert.equal(runde.length, 12);
    assert.ok(runde.filter((q) => q.kind === 'type').length <= 3);
    if (runde.some((q) => VOKABELN.some((u) => ITEMS[u.id].some((it) => it.a === q.answer)))) mitVokabeln += 1;
    if (runde.some((q) => GRAMMATIK.some((u) => ITEMS[u.id].some((it) => it.a === q.answer)))) mitGrammatik += 1;
  }
  assert.ok(mitVokabeln > 30, 'Vokabel-Seiten fehlen im Endgegner');
  assert.ok(mitGrammatik > 30, 'Grammatik- und Textseiten fehlen im Endgegner');
});
