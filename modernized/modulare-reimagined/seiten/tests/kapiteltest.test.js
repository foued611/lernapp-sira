// Kapitel-Test: 10 Aufgaben aus allen Seiten eines Kapitels, mit Bestwert und Hinweis, was noch fehlt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRng } from '../../helfer/index.js';
import { buildConfig } from '../../inhalte/index.js';
import { finishRound } from '../../regeln/index.js';
import { AppHome } from '../apphome.js';
import { appDefaults, chapterMissing, chapterQuestions, hasChapterTest, profileDefaults, startRound, stationAfter } from '../ablauf.js';
import { resultModel, wordsFor } from '../ergebnis.js';
import { APPS, logicFor, paketVon } from '../../apps/tests/laden.js';
import { configOf, DAY, questions } from './helpers.js';

const h = createElement;
const noop = () => {};
const group = { id: 'g1', title: 'G1', units: [{ id: 'a' }, { id: 'b' }] };
const lesson = (unit) => questions(8, unit.id);

test('SEITE-KAPITELTEST Die Aufgaben kommen abwechselnd aus allen Seiten und nennen ihre Seite', () => {
  const list = chapterQuestions(group.units, lesson, 10, createRng(1));
  assert.equal(list.length, 10);
  assert.equal(list.filter((q) => q.unitId === 'a').length, 5);
  assert.equal(list.filter((q) => q.unitId === 'b').length, 5);
});

test('SEITE-KAPITELTEST Ab zwei Seiten gibt es einen Test, offen erst mit Stern auf jeder Seite', () => {
  assert.equal(hasChapterTest({ units: [{ id: 'a' }] }), false);
  assert.equal(hasChapterTest(group), true);
  assert.deepEqual(chapterMissing({ stars: { a: 1 } }, group).map((u) => u.id), ['b']);
  assert.deepEqual(chapterMissing({ stars: { a: 1, b: 2 } }, group), []);
});

test('SEITE-KAPITELTEST Gesperrt startet er nicht, offen hat er 10 Aufgaben', () => {
  const config = { ...configOf(), rounds: { lesson } };
  const zu = startRound({ config, mode: 'chapter', group, app: { stars: { a: 1 } }, profile: profileDefaults(), rng: createRng(1) });
  assert.equal(zu.ok, false);
  assert.match(zu.message, /Kapitel-Test/);
  const offen = startRound({ config, mode: 'chapter', group, app: { stars: { a: 1, b: 1 } }, profile: profileDefaults(), rng: createRng(1) });
  assert.equal(offen.ok, true, offen.message);
  assert.equal(offen.round.current().total, 10);
  assert.ok(offen.round.current().question.unitId);
});

const finish = (app, accuracy) => finishRound({ appId: 'x', mode: 'chapter', group: { id: 'g1' }, accuracy, profile: profileDefaults(), app, day: DAY });

test('SEITE-KAPITELTEST Es gilt der Bestwert, Sterne der Seiten bleiben unberührt', () => {
  const app = { ...appDefaults(), stars: { a: 1 } };
  assert.equal(finish(app, 0.6).prevBest, null);
  assert.equal(app.chapters.g1.acc, 0.6);
  const zweiter = finish(app, 0.4);
  assert.equal(zweiter.prevBest, 0.6);
  assert.equal(app.chapters.g1.acc, 0.6);
  finish(app, 0.9);
  assert.equal(app.chapters.g1.acc, 0.9);
  assert.deepEqual(app.stars, { a: 1 });
  assert.deepEqual(app.last, {});
});

test('SEITE-KAPITELTEST Ohne Kapitel lehnt die Auswertung ab', () => {
  assert.throws(() => finishRound({ appId: 'x', mode: 'chapter', accuracy: 1, profile: profileDefaults(), app: appDefaults(), day: DAY }), TypeError);
});

const summary = (extra) => ({ mode: 'chapter', unitId: null, groupId: 'g1', prevBest: null, weakUnits: [], failed: false, accuracy: 0.8, correct: 8, wrong: 2, almost: 0, bestCombo: 3, relearned: 0, score: 0, xp: 40, bonus: 0, stars: 2, refresh: false, levelUp: null, goalHit: false, newBadges: [], missions: [], ...extra });
const model = (extra, options = {}) => resultModel(summary(extra), { profile: profileDefaults(), day: DAY, words: wordsFor({}), ...options });

test('SEITE-KAPITELTEST Das Ergebnis nennt die Seiten mit Fehlern und führt zur ersten', () => {
  const m = model({}, { next: { title: 'Seite A' }, weakTitles: ['Seite A', 'Seite B'] });
  assert.match(m.subtitle, /Seite A, Seite B/);
  assert.equal(m.actions[0].label, 'Üben: Seite A');
  assert.equal(m.actions[0].primary, true);
});

test('SEITE-KAPITELTEST Auch ein gescheiterter Test führt zur schwachen Seite', () => {
  assert.equal(model({ failed: true, stars: 0 }, { next: { title: 'Seite A' }, weakTitles: ['Seite A'] }).actions[0].id, 'next');
});

test('SEITE-KAPITELTEST Ohne Fehler und mit neuem Bestwert sagt das Ergebnis beides', () => {
  const m = model({ prevBest: 0.5 });
  assert.match(m.subtitle, /Neuer Bestwert/);
  assert.match(m.subtitle, /Alle Seiten sitzen/);
  assert.equal(m.actions[0].id, 'again');
});

test('SEITE-KAPITELTEST Nach dem Test führt der Rückweg zur letzten Seite des Kapitels', () => {
  const units = [{ id: 'a', group: 'g1' }, { id: 'b', group: 'g1' }, { id: 'c', group: 'g2' }];
  assert.equal(stationAfter({ summary: { groupId: 'g1', unitId: null }, units }), 'b');
  assert.equal(stationAfter({ theoryUnit: { id: 'c' }, units }), 'c');
  assert.equal(stationAfter({ session: { unit: { id: 'a' } }, units }), 'a');
  assert.equal(stationAfter({ summary: { unitId: 'b', groupId: null }, units }), 'b');
  assert.equal(stationAfter({ summary: { unitId: null, groupId: null }, units }), null);
  assert.equal(stationAfter({ units }), null);
});

const render = (app, units) => {
  const config = { ...configOf({ units }), groups: [{ id: 'g1', title: 'G1' }] };
  return renderToStaticMarkup(h(AppHome, { config, app: { ...appDefaults(), ...app }, profile: profileDefaults(), day: DAY, rec: null, open: false, notice: null, storeMessage: null, persistent: false, resetPhase: 'idle', profileStore: null, onStudy: noop, onStart: noop, onReset: noop, onName: noop }));
};
const zwei = [{ id: 'x', title: 'X', de: 'd', color: '#111111', group: 'g1' }, { id: 'y', title: 'Y', de: 'd', color: '#111111', group: 'g1' }];

test('SEITE-KAPITELTEST Der Lernpfad nennt gesperrt, was fehlt, offen Knopf und Bestwert', () => {
  const zu = render({ stars: { x: 1 } }, zwei);
  assert.match(zu, /Noch 1 Seite üben/);
  assert.doesNotMatch(zu, /Test starten/);
  const offen = render({ stars: { x: 1, y: 1 }, chapters: { g1: { acc: 0.8, day: DAY } } }, zwei);
  assert.match(offen, /Test starten/);
  assert.match(offen, /Bestwert: 80 %/);
  assert.doesNotMatch(render({}, zwei.slice(0, 1)), /Kapitel-Test/);
});

for (const entry of APPS) {
  test(`SEITE-KAPITELTEST ${entry.id} liefert für jedes Kapitel ab zwei Seiten 10 Aufgaben`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    const app = { stars: Object.fromEntries(config.units.map((u) => [u.id, 1])) };
    for (const { id, title } of config.groups) {
      const units = config.units.filter((u) => u.group === id);
      if (units.length < 2) continue;
      const start = startRound({ config, mode: 'chapter', group: { id, title, units }, app, profile: profileDefaults(), rng: createRng(id.length) });
      assert.equal(start.ok, true, `${id}: ${start.message}`);
      assert.equal(start.round.current().total, 10, id);
    }
  });
}
