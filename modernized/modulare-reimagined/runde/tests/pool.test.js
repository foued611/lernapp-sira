// Gerüst der Inhalts-Apps: gemeinsame Erzeuger und Fehler-Abruf je Aufgabe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPool, logicOf, poolApp, skillOf } from '../index.js';
import { rngFor } from './helpers.js';

const item = (n, extra = {}) => ({ q: `Frage ${n}`, a: `A${n}`, wrong: ['x', 'y', 'z'], why: 'Weil.', ...extra });
const paket = () => ({
  manifest: { units: [{ id: 'a', track: 't' }, { id: 'b' }], tracks: { t: { label: 'Strang' } } },
  data: { items: { a: [item(1), item(2), { ...item(3), kind: 'gap', s: 'Ein ___ Satz.' }], b: [item(4)] } }
});

test('POOL: skillOf nimmt die genaueste Angabe', () => {
  assert.equal(skillOf({ skill: 's', w: 'w', label: 'l', s: 'satz', q: 'q' }), 's');
  assert.equal(skillOf({ w: 'w', label: 'l', q: 'q' }), 'w');
  assert.equal(skillOf({ label: 'l', q: 'q' }), 'l');
  assert.equal(skillOf({ s: 'satz', q: 'q' }), 'satz');
  assert.equal(skillOf({ q: 'q' }), 'q');
});

test('POOL: Fragen tragen ihren skill, Eingabe und Auswahl gleich', () => {
  const p = paket();
  const { choice, typed } = createPool(p);
  const gap = p.data.items.a[2];
  assert.equal(choice(gap, rngFor(1)).skill, 'Ein ___ Satz.');
  assert.equal(typed(gap).skill, 'Ein ___ Satz.');
});

test('POOL: recall liefert genau die Aufgaben der Seite mit diesem skill', () => {
  const { recall } = createPool(paket());
  assert.deepEqual(recall({ id: 'a' }, ['Frage 2', 'Frage 4'], rngFor(1)).map((q) => q.answer), ['A2']);
  assert.deepEqual(recall({ id: 'gibt-es-nicht' }, ['Frage 2'], rngFor(1)), []);
});

test('POOL: Strang nur mit withTrack, Etikett der Eingabe wählbar', () => {
  const p = paket();
  const ohne = createPool(p).choice(p.data.items.a[0], rngFor(1));
  assert.equal(ohne.chip, undefined);
  const mit = createPool(p, { withTrack: true, typedLabel: 'Tippen' });
  assert.equal(mit.choice(p.data.items.a[0], rngFor(1)).chip.label, 'Strang');
  assert.equal(mit.choice(p.data.items.b[0], rngFor(1)).chip, null);
  assert.equal(mit.typed(p.data.items.a[2]).label, 'Tippen');
});

test('POOL: poolApp erfüllt den App-Vertrag', () => {
  const diagrams = { d: () => '' };
  const app = poolApp({ diagrams });
  assert.equal(app.diagrams, diagrams);
  const { rounds, blitz } = app.create(paket());
  assert.equal(rounds.lesson({ id: 'a' }, rngFor(2)).length, 8);
  assert.equal(rounds.quick(rngFor(2)).length, 5);
  assert.equal(rounds.boss(rngFor(2)).length, 12);
  assert.equal(blitz(rngFor(2)).kind, 'choice');
  assert.deepEqual(Object.keys(logicOf({})), ['rounds', 'blitz']);
});
