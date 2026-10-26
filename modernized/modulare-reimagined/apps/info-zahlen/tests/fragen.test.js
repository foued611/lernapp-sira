// Zahlenwerkstatt: Fragen und Runden. Prüft RULE-165 (jede Aufgabe ist gültig und ihre Antwort wird akzeptiert),
// RULE-223 (Auswahl mit richtiger Antwort und höchstens drei falschen) und RULE-229 (Rundengrößen).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { init, makersFor, lessonRound, quickRound, bossRound, blitzQuestion } from '../builders.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('info-zahlen');
init(paket);
const UNITS = paket.manifest.units;

/** Prüft eine einzelne Frage auf den Vertrag. Gibt die Fehlerliste zurück, leer heißt gültig. */
function fehler(q) {
  const out = [];
  if (!['choice', 'type', 'match'].includes(q.kind)) out.push(`unbekannte Art ${q.kind}`);
  if (q.kind === 'choice') {
    const ids = q.options.map((o) => o.id);
    if (ids.length < 2 || ids.length > 4) out.push(`${ids.length} Optionen`);
    if (new Set(ids).size !== ids.length) out.push('doppelte Optionen');
    if (!ids.includes(q.answer)) out.push(`Antwort ${q.answer} fehlt in den Optionen`);
  }
  if (q.kind === 'type') {
    if (q.check(q.answer) !== 'ok') out.push(`check verwirft die Antwort ${q.answer}`);
    if (q.check('') === 'ok') out.push('leere Eingabe wird akzeptiert');
  }
  if (q.kind === 'match') {
    if (q.left.length !== q.right.length || q.left.length !== q.leftValues.length) out.push('Zuordnung ungleich lang');
    const rechts = q.right.map((r) => r.value).sort().join();
    if (rechts !== [...q.leftValues].sort().join()) out.push('Werte passen nicht zusammen');
  }
  return out;
}

for (const unit of UNITS) {
  test(`RULE-165: Seite ${unit.id} liefert mindestens 300 gültige Aufgaben mit akzeptierter Antwort`, () => {
    const makers = makersFor(unit.id);
    assert.ok(makers.length > 0, `keine Erzeuger für ${unit.id}`);
    const rng = createRng(165 + unit.id.length);
    for (let i = 0; i < 300; i++) {
      const q = makers[i % makers.length](rng);
      const fehlerListe = fehler(q);
      assert.deepEqual(fehlerListe, [], `${unit.id} Aufgabe ${i}: ${q.prompt}`);
    }
  });
}

test('RULE-223: Auswahl zeigt die richtige Antwort und höchstens drei falsche, keine weitere', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const rng = createRng(seed);
    for (const unit of UNITS) {
      for (const make of makersFor(unit.id)) {
        const q = make(rng);
        if (q.kind === 'choice') assert.ok(q.options.length <= 4, `mehr als vier Optionen bei ${unit.id}`);
      }
    }
  }
});

test('RULE-223: die richtige Antwort wechselt die Stelle zwischen den Seeds', () => {
  const make = makersFor('stellen')[0];
  const stellen = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const q = make(createRng(seed));
    if (q.kind === 'choice') stellen.add(q.options.findIndex((o) => o.id === q.answer));
  }
  assert.ok(stellen.size > 1, 'die Antwort liegt immer an derselben Stelle');
});

test('RULE-229: Lektion 8 Fragen, Endgegner 12, Schnellrunde 5, Blitz ist Auswahl (200 Seeds)', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = createRng(seed);
    const unit = UNITS[seed % UNITS.length];
    assert.equal(lessonRound(unit, rng).length, 8);
    assert.equal(bossRound(rng).length, 12);
    assert.equal(quickRound(rng).length, 5);
    assert.equal(blitzQuestion(rng).kind, 'choice');
  }
});

test('Gleicher Seed ergibt dieselben Aufgaben', () => {
  const a = JSON.stringify(lessonRound(UNITS[0], createRng(42)));
  const b = JSON.stringify(lessonRound(UNITS[0], createRng(42)));
  assert.equal(a, b);
});

test('Eingabe wird nach normalise() verglichen: Groß/Klein und Leerraum am Rand zählen nicht', () => {
  const hex = makersFor('hex')[1];
  let q;
  for (let seed = 1; q?.kind !== 'type' && seed < 500; seed++) q = hex(createRng(seed));
  // Die Antwort ist eine Dezimalzahl. Ein Leerzeichen am Rand und ein falscher Wert sind die Grenzfälle.
  assert.equal(q.check(` ${q.answer} `), 'ok');
  assert.equal(q.check(`${q.answer}7`), 'bad');
});

test('Eingabe bei Hex: Groß- und Kleinschreibung zählen nicht', () => {
  const binToHex = makersFor('binhex')[1];
  let q;
  for (let seed = 1; seed < 500 && !(q?.kind === 'type' && /[A-F]/.test(q.answer)); seed++) q = binToHex(createRng(seed));
  assert.ok(q && /[A-F]/.test(q.answer), 'keine Hex-Eingabeaufgabe gefunden');
  assert.equal(q.check(q.answer.toLowerCase()), 'ok');
  assert.equal(q.check(q.answer === 'F0' ? 'F1' : 'F0'), 'bad');
});

test('Zuordnung: die Antwort ist eine Liste je Vierergruppe, jeder Wert genau einmal rechts', () => {
  const match = makersFor('binhex')[3];
  for (let seed = 1; seed <= 50; seed++) {
    const q = match(createRng(seed));
    assert.equal(q.kind, 'match');
    assert.equal(q.left.length, 4);
    assert.deepEqual(fehler(q), []);
  }
});
