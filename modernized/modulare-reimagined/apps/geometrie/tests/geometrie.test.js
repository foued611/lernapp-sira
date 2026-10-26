// Geometrie-Werkstatt: RULE-165 (jede Aufgabe hat ihre Antwort), RULE-229 (Rundengrößen) und Schuld 6
// (Erzeuger bricht nach MAX_TRIES ab statt zu hängen). Diagramme liefern einen Alternativtext.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { init, make, MAX_TRIES, POOLS, choice, typed, lessonRound, quickRound, bossRound, blitzQuestion } from '../builders.js';
import * as diagrams from '../diagrams.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('geometrie');
init(paket);
const UNITS = paket.manifest.units;

test('RULE-165: jede Aufgabe einer Seite hat ihre Antwort unter den Optionen oder akzeptiert sie als Zahl', () => {
  const rng = createRng(165);
  for (const unit of UNITS) {
    for (let i = 0; i < 300; i++) {
      const item = make(unit.id, rng);
      const q = choice(item, rng);
      assert.ok(q.options.some((o) => o.id === item.answer), `Antwort fehlt bei ${unit.id}: ${item.prompt}`);
      if (item.numeric && !item.choiceOnly) {
        assert.equal(typed(item).check(item.answer), 'ok', `Zahlenprüfer verwirft ${item.answer} bei ${unit.id}`);
      }
    }
  }
});

test('RULE-229: Lektionsrunde 8 Fragen, Endgegner 12, Schnellrunde 5, Blitz ist Auswahl', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = createRng(seed);
    const unit = UNITS[seed % UNITS.length];
    assert.equal(lessonRound(unit, rng).length, 8);
    assert.equal(bossRound(rng).length, 12);
    assert.equal(quickRound(rng).length, 5);
    assert.equal(blitzQuestion(rng).kind, 'choice');
  }
});

test('Schuld 6: ein Erzeuger ohne brauchbare Aufgabe bricht nach MAX_TRIES mit Fehler ab', () => {
  const kaputt = 'kaputt';
  POOLS[kaputt] = [() => ({ prompt: 'x', answer: 'a', wrong: ['a'], why: 'x', label: 'x' })];
  try {
    assert.throws(() => make(kaputt, createRng(1)), (error) => error instanceof RangeError && error.message.includes(String(MAX_TRIES)));
  } finally {
    delete POOLS[kaputt];
  }
});

test('Gleicher Seed ergibt dieselben Aufgaben', () => {
  assert.deepEqual(lessonRound(UNITS[0], createRng(9)), lessonRound(UNITS[0], createRng(9)));
});

test('Diagramme haben einen Alternativtext und liefern ein svg-Element', () => {
  for (const unit of UNITS) {
    const name = paket.lessons[unit.id].figure.diagram.name;
    const element = diagrams[name](...(paket.lessons[unit.id].figure.diagram.args || []));
    assert.equal(element.type, 'svg', `${name} liefert kein svg`);
    assert.equal(element.props.role, 'img');
    assert.ok(element.props['aria-label'].length > 10, `${name} ohne Alternativtext`);
  }
});
