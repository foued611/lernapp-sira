// Der Weg durch eine App: Einstieg, nächster Schritt nach der Runde, Rückweg zur Station.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppHome, revealStation } from '../apphome.js';
import { appDefaults, followingUnit, practisedUnits, profileDefaults } from '../ablauf.js';
import { Ergebnis, resultModel, wordsFor } from '../ergebnis.js';
import { TheoryScreen } from '../rahmen.js';
import { configOf, DAY } from './helpers.js';

const h = createElement;
const noop = () => {};
const units = [{ id: 'a', title: 'Eins' }, { id: 'b', title: 'Zwei' }, { id: 'c', title: 'Drei' }];

const home = (app, props = {}) => renderToStaticMarkup(h(AppHome, {
  config: configOf(), app: { ...appDefaults(), ...app }, profile: profileDefaults(), day: DAY, rec: null, open: false, notice: null, storeMessage: null,
  persistent: false, resetPhase: 'idle', profileStore: null, onStudy: noop, onStart: noop, onReset: noop, onName: noop, ...props
}));

const summary = (extra = {}) => ({
  mode: 'lesson', unitId: 'a', failed: false, accuracy: 0.8, correct: 6, wrong: 2, almost: 0, bestCombo: 3, relearned: 0, score: 0, xp: 40, bonus: 0,
  stars: 2, refresh: false, levelUp: null, goalHit: false, newBadges: [], missions: [], ...extra
});
const model = (extra, next = units[1]) => resultModel(summary(extra), { profile: profileDefaults(), day: DAY, words: wordsFor({}), next });

test('SEITE-LERNFLUSS Geübt ist eine Seite ab einem Stern', () => {
  assert.deepEqual(practisedUnits({ stars: { b: 1 } }, units), [units[1]]);
  assert.deepEqual(practisedUnits({ stars: {} }, units), []);
});

test('SEITE-LERNFLUSS Ohne Sterne zeigt der Kopf den Einstieg in die erste Seite statt der Zufallsrunde', () => {
  const markup = home({});
  assert.match(markup, /Starte mit Erste Seite/);
  assert.doesNotMatch(markup, /2-Minuten-Runde/);
});

test('SEITE-LERNFLUSS Mit einer geübten Seite zeigt der Kopf die 2-Minuten-Runde', () => {
  const markup = home({ stars: { start: 1 } });
  assert.match(markup, /2-Minuten-Runde/);
  assert.doesNotMatch(markup, /Starte mit/);
});

test('SEITE-LERNFLUSS Weiter geht es mit der nächsten offenen Seite hinter der aktuellen', () => {
  assert.equal(followingUnit({ stars: { a: 2 } }, units, 'a', DAY).id, 'b');
  assert.equal(followingUnit({ stars: { b: 2 } }, units, 'b', DAY).id, 'c');
});

test('SEITE-LERNFLUSS Am Ende des Pfads geht es vorn mit der ersten offenen Seite weiter', () => {
  assert.equal(followingUnit({ stars: { c: 2 } }, units, 'c', DAY).id, 'a');
});

test('SEITE-LERNFLUSS Ist nichts mehr offen, kommt die fällige Seite, sonst nichts', () => {
  const stars = { a: 3, b: 3, c: 3 };
  assert.equal(followingUnit({ stars, last: { a: DAY, b: '2026-10-01', c: DAY }, acc: {} }, units, 'a', DAY).id, 'b');
  assert.equal(followingUnit({ stars, last: { a: DAY, b: DAY, c: DAY }, acc: {} }, units, 'a', DAY), null);
});

test('SEITE-LERNFLUSS Ab zwei Sternen führt der Hauptknopf zur nächsten Seite', () => {
  const m = model();
  assert.deepEqual(m.actions.map((a) => a.id), ['next', 'again', 'theory', 'home']);
  assert.equal(m.actions[0].label, 'Weiter: Zwei');
  assert.deepEqual(m.actions.filter((a) => a.primary).map((a) => a.id), ['next']);
});

test('SEITE-LERNFLUSS Mit einem Stern oder gescheitert bleibt Nochmal der Hauptknopf, es gibt kein Weiter', () => {
  for (const extra of [{ stars: 1 }, { stars: 0, failed: true }]) {
    const m = model(extra);
    assert.deepEqual(m.actions.map((a) => a.id), ['again', 'theory', 'home']);
    assert.deepEqual(m.actions.filter((a) => a.primary).map((a) => a.id), ['again']);
  }
});

test('SEITE-LERNFLUSS Ohne nächste Seite und außerhalb der Lektion gibt es kein Weiter', () => {
  assert.equal(model({}, null).actions.some((a) => a.id === 'next'), false);
  assert.equal(model({ mode: 'quick', unitId: null }).actions.some((a) => a.id === 'next'), false);
});

test('SEITE-LERNFLUSS Die Ergebnis-Karte zeichnet den Knopf zur nächsten Seite', () => {
  const markup = renderToStaticMarkup(h(Ergebnis, { model: model(), onAction: noop }));
  assert.match(markup, /Weiter: Zwei/);
});

test('SEITE-LERNFLUSS Jede Station trägt ihre Seite, damit der Rückweg sie findet', () => {
  assert.match(home({}), /data-unit="weiter"/);
});

test('SEITE-LERNFLUSS Die Gruppe mit der zuletzt besuchten Station ist offen', () => {
  const config = { ...configOf({ units: [{ id: 'x', title: 'X', de: 'd', color: '#111111', group: 'g1' }, { id: 'y', title: 'Y', de: 'd', color: '#111111', group: 'g2' }] }), groups: [{ id: 'g1', title: 'G1' }, { id: 'g2', title: 'G2' }] };
  const markup = home({}, { config, focusId: 'y' });
  assert.equal(markup.match(/<details[^>]* open/g).length, 2);
});

test('SEITE-LERNFLUSS Ein Kapitel aus einer anderen Klasse sagt das, ein eigenes nicht', () => {
  const units = [{ id: 'x', title: 'X', de: 'd', color: '#111111', group: 'g1' }, { id: 'y', title: 'Y', de: 'd', color: '#111111', group: 'g2' }];
  const config = { ...configOf({ units }), klassen: [7], groups: [{ id: 'g1', title: 'G1', klasse: 7 }, { id: 'g2', title: 'G2', klasse: 6 }] };
  const markup = home({}, { config });
  assert.equal(markup.match(/aus Klasse/g).length, 1);
  assert.match(markup, /aus Klasse 6/);
});

test('SEITE-LERNFLUSS Gruppen zählen geschafft ab zwei Sternen, wie der Kopf der App', () => {
  const config = { ...configOf({ units: [{ id: 'x', title: 'X', de: 'd', color: '#111111', group: 'g1' }, { id: 'y', title: 'Y', de: 'd', color: '#111111', group: 'g1' }] }), groups: [{ id: 'g1', title: 'G1' }] };
  assert.match(home({ stars: { x: 1, y: 2 } }, { config }), /1 von 2 geschafft/);
});

test('SEITE-LERNFLUSS revealStation scrollt zur Station und setzt den Fokus, ohne erneut zu scrollen', () => {
  const calls = [];
  const button = { focus: (options) => calls.push(['focus', options]) };
  const station = { scrollIntoView: (options) => calls.push(['scroll', options]), querySelector: () => button };
  const root = { querySelector: (selector) => (selector === '[data-unit="b"]' ? station : null) };
  assert.equal(revealStation(root, 'b'), true);
  assert.deepEqual(calls, [['scroll', { block: 'center' }], ['focus', { preventScroll: true }]]);
  assert.equal(revealStation(root, 'fehlt'), false);
});

test('SEITE-LERNFLUSS Direkt üben steht über der Theorie, sobald die Seite geübt ist', () => {
  const config = configOf();
  const render = (practised) => renderToStaticMarkup(h(TheoryScreen, { config, unit: config.units[0], onBack: noop, onStart: noop, practised }));
  assert.match(render(true), /Direkt üben/);
  assert.doesNotMatch(render(false), /Direkt üben/);
});

test('SEITE-LERNFLUSS Ein zugeklapptes Kapitel nennt seine fälligen Seiten', () => {
  const config = { ...configOf({ units: [{ id: 'x', title: 'X', de: 'd', color: '#111111', group: 'g1' }, { id: 'y', title: 'Y', de: 'd', color: '#111111', group: 'g2' }] }), groups: [{ id: 'g1', title: 'G1' }, { id: 'g2', title: 'G2' }] };
  const markup = home({ stars: { x: 2 }, last: { x: '2026-10-01' } }, { config });
  assert.match(markup, /1 von 1 geschafft · 1 fällig/);
  assert.match(markup, /0 von 1 geschafft</);
});
