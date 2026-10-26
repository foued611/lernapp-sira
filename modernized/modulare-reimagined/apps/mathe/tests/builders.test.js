// Mathe-Werkstatt: RULE-165 (jede Aufgabe hat ihre Antwort), RULE-223 (Auswahl mit höchstens drei falschen Antworten),
// RULE-229 (Rundengrößen), Reproduzierbarkeit mit gleichem Seed und die Grenze der Versuche (MAX_TRIES).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { init, POOLS, make, choice, typed, MAX_TRIES } from '../builders.js';
import logic from '../logic.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('mathe');
logic.init(paket);
const UNITS = paket.manifest.units;

// Fragen mit Prüferfunktion lassen sich nicht mit deepEqual vergleichen. Ersatz: Form, Antworten und Prüfergebnisse.
const kanonisch = (fragen) => fragen.map((q) => ({
  ...q,
  check: q.check ? q.check(q.answer) : undefined
}));

test('RULE-165: jede Auswahlaufgabe hat ihre richtige Antwort unter den Optionen, jede Zahlenaufgabe akzeptiert sie', () => {
  for (const [i, unit] of UNITS.entries()) {
    const rng = createRng(165 + i);
    for (let n = 0; n < 300; n++) {
      const item = make(unit.id, rng);
      const q = choice(item, rng);
      assert.ok(q.options.some((o) => o.id === item.answer), `Antwort fehlt bei ${unit.id}: ${item.prompt}`);
      if (item.numeric) {
        assert.equal(typed(item).check(item.answer), 'ok', `Zahlenprüfer verwirft ${item.answer} bei ${unit.id}`);
      }
    }
  }
});

test('RULE-165: jede Eingabeaufgabe akzeptiert ihre eigene Antwort (Zahlen, Brüche und Terme)', () => {
  for (const [i, unit] of UNITS.entries()) {
    const rng = createRng(1650 + i);
    for (let n = 0; n < 300; n++) {
      const item = make(unit.id, rng);
      if (item.choiceOnly) continue;
      assert.equal(typed(item).check(item.answer), 'ok', `${unit.id}: ${item.prompt} -> ${item.answer}`);
    }
  }
});

test('RULE-223: Auswahl zeigt die richtige Antwort und höchstens drei falsche, nur aus den Angaben der Aufgabe', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const rng = createRng(seed);
    for (const unit of UNITS) {
      const item = make(unit.id, rng);
      const q = choice(item, rng);
      assert.ok(q.options.length >= 2 && q.options.length <= 4, `Optionenzahl bei: ${item.prompt}`);
      const erlaubt = [item.answer, ...item.wrong];
      for (const o of q.options) assert.ok(erlaubt.includes(o.id), `unbekannte Option ${o.id} bei: ${item.prompt}`);
    }
  }
});

test('RULE-223: die richtige Antwort steht nicht immer an derselben Stelle', () => {
  const item = { prompt: 'Wie viel sind 5 % von 40 €?', answer: '2', numeric: true, value: 2, wrong: ['1', '3', '4'], why: 'x' };
  const stellen = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const q = choice(item, createRng(seed));
    stellen.add(q.options.findIndex((o) => o.id === item.answer));
  }
  assert.ok(stellen.size > 1, 'die Antwort liegt immer an derselben Stelle');
});

test('RULE-229: Lektionsrunde 8 Fragen, Endgegner 12, Schnellrunde 5, Blitz ist Auswahl', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = createRng(seed);
    const unit = UNITS[seed % UNITS.length];
    const lektion = logic.rounds.lesson(unit, rng);
    assert.equal(lektion.length, 8);
    // Eingabe nur an jeder dritten Stelle (Position 3, 6 ...), wie in Legacy.
    lektion.forEach((q, i) => {
      if (q.kind === 'type') assert.equal(i % 3, 2);
    });
    const boss = logic.rounds.boss(rng);
    assert.equal(boss.length, 12);
    boss.forEach((q, i) => {
      if (q.kind === 'type') assert.equal(i % 4, 3);
    });
    assert.equal(logic.rounds.quick(rng).length, 5);
    assert.equal(logic.blitz(rng).kind, 'choice');
  }
});

test('Gleicher Seed ergibt dieselben Aufgaben, anderer Seed andere', () => {
  const a = kanonisch(logic.rounds.lesson(UNITS[0], createRng(42)));
  const b = kanonisch(logic.rounds.lesson(UNITS[0], createRng(42)));
  const c = kanonisch(logic.rounds.lesson(UNITS[0], createRng(43)));
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
});

test('Eine Aufgabe braucht drei verschiedene falsche Antworten; sonst bricht der Erzeuger mit Fehler ab', () => {
  assert.equal(MAX_TRIES, 200);
  const rng = createRng(7);
  for (const unit of UNITS) {
    const item = make(unit.id, rng);
    assert.ok(item.wrong.length >= 3, unit.id);
    assert.ok(!item.wrong.includes(item.answer), unit.id);
    assert.equal(new Set(item.wrong).size, item.wrong.length, unit.id);
  }
  const leer = { ...POOLS, testpool: [() => ({ prompt: 'x', answer: '1', wrong: [], why: 'x' })] };
  assert.throws(() => {
    const original = POOLS.vorzeichen;
    POOLS.vorzeichen = leer.testpool;
    try { make('vorzeichen', rng); } finally { POOLS.vorzeichen = original; }
  }, RangeError);
});

test('Zufall nur über rng: die Erzeuger wechseln ihre Aufgaben mit dem Seed', () => {
  const fragen = new Set();
  for (let seed = 1; seed <= 30; seed++) fragen.add(make('gleichungen', createRng(seed)).prompt);
  assert.ok(fragen.size > 5, `nur ${fragen.size} verschiedene Aufgaben in 30 Seeds`);
});
