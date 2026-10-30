// Gerüst der Inhalts-Apps: gemeinsame Erzeuger und Fehler-Abruf je Aufgabe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPool, isTypeable, logicOf, poolApp, skillOf } from '../index.js';
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

test('POOL: geteilter skill holt alle Aufgaben dazu zurück', () => {
  const p = paket();
  p.data.items.a[0].skill = 'rechnen';
  p.data.items.a[1].skill = 'rechnen';
  const { recall } = createPool(p);
  assert.deepEqual(recall({ id: 'a' }, ['rechnen'], rngFor(1)).map((q) => q.answer), ['A1', 'A2']);
});

test('POOL: level ändert an der Frage nur das Feld level', () => {
  const ohne = paket();
  const mit = paket();
  mit.data.items.a = mit.data.items.a.map((entry) => ({ ...entry, level: 2 }));
  const fragen = (p) => createPool(p).lessonRound(p.manifest.units[0], rngFor(1));
  const alsText = (liste) => JSON.stringify(liste.map(({ level, ...frage }) => frage));
  assert.equal(alsText(fragen(mit)), alsText(fragen(ohne)));
  assert.ok(fragen(mit).every((frage) => frage.level === 2));
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

// Zehn Aufgaben, davon so viele Lücken wie angegeben.
const seite = (lücken, antwort = (n) => `A${n}`) => ({
  manifest: { units: [{ id: 'a' }] },
  data: {
    items: {
      a: Array.from({ length: 10 }, (_, n) => (n < lücken
        ? { ...item(n, { a: antwort(n) }), kind: 'gap', s: `Satz ${n} mit ___.` }
        : item(n)))
    }
  }
});
const getippt = (fragen) => fragen.filter((q) => q.kind === 'type');

test('POOL: Lektionsrunde tippt die Hälfte, auch wenn die Lücken knapp sind', () => {
  const { lessonRound } = createPool(seite(4));
  for (let seed = 1; seed <= 200; seed += 1) {
    const runde = lessonRound({ id: 'a' }, rngFor(seed));
    assert.equal(runde.length, 8);
    assert.equal(getippt(runde).length, 4, `Seed ${seed}`);
  }
});

test('POOL: mehr Lücken als Eingabeplätze bleiben Auswahl', () => {
  const { lessonRound } = createPool(seite(10));
  for (let seed = 1; seed <= 50; seed += 1) assert.equal(getippt(lessonRound({ id: 'a' }, rngFor(seed))).length, 4);
});

test('POOL: Seite mit wenigen Lücken tippt alle, Runde bleibt voll', () => {
  const { lessonRound } = createPool(seite(2));
  for (let seed = 1; seed <= 50; seed += 1) {
    const runde = lessonRound({ id: 'a' }, rngFor(seed));
    assert.equal(runde.length, 8);
    assert.equal(getippt(runde).length, 2);
  }
});

test('POOL: Antworten bis zwei Wörter sind eintippbar, längere bleiben Auswahl', () => {
  assert.equal(isTypeable({ kind: 'gap', a: 'Schall' }), true);
  assert.equal(isTypeable({ kind: 'gap', a: 'will help' }), true);
  assert.equal(isTypeable({ kind: 'gap', a: 'vom Lot weg' }), false);
  assert.equal(isTypeable({ a: 'Schall' }), false);
  const dreiWörter = seite(10, (n) => (n % 2 ? `kurz${n}` : `ein langes Wort${n}`));
  const { lessonRound, bossRound } = createPool(dreiWörter);
  for (let seed = 1; seed <= 50; seed += 1) {
    const fragen = [...lessonRound({ id: 'a' }, rngFor(seed)), ...bossRound(rngFor(seed))];
    assert.ok(getippt(fragen).every((q) => q.answer.startsWith('kurz')), `Seed ${seed}`);
  }
});

test('POOL: gleicher Seed liefert dieselbe Lektionsrunde', () => {
  const { lessonRound } = createPool(seite(6));
  const bild = (seed) => JSON.stringify(lessonRound({ id: 'a' }, rngFor(seed)));
  assert.equal(bild(5), bild(5));
  assert.notEqual(bild(5), bild(6));
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
