// Startseite einer App (AppHome): Karte "Diese Woche" mit den drei Wochenmissionen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppHome, stationState } from '../apphome.js';
import { appDefaults, profileDefaults } from '../rahmen.js';
import { configOf, DAY, UNITS } from './helpers.js';

const h = createElement;
const noop = () => {};

// DAY (2026-10-26) ist ein Montag, die Woche beginnt am selben Tag.
const weekOf = (extra = {}) => ({ start: DAY, units: [], refreshes: 0, strong: 0, done: [], ...extra });

function render(profileExtra = {}) {
  const profile = { ...profileDefaults(), ...profileExtra };
  return renderToStaticMarkup(h(AppHome, {
    config: configOf(), app: appDefaults(), profile, day: DAY, rec: null, open: false, notice: null, storeMessage: null,
    persistent: false, resetPhase: 'idle', profileStore: null, onStudy: noop, onStart: noop, onReset: noop, onName: noop
  }));
}

// Der Teil der Karte "Diese Woche", damit andere Teile der Seite die Treffer nicht verfälschen.
const cardOf = (markup) => {
  const match = /<section class="card week"[\s\S]*?<\/section>/.exec(markup);
  assert.ok(match, 'Karte "Diese Woche" fehlt');
  return match[0];
};

test('SEITE-MISSIONEN Die Karte "Diese Woche" zeigt zwei von drei Seiten bei zwei verschiedenen Seiten', () => {
  const card = cardOf(render({ week: weekOf({ units: ['start', 'weiter'] }) }));
  assert.match(card, /Diese Woche/);
  assert.match(card, /2 von 3 Seiten/);
});

test('SEITE-MISSIONEN Ohne Wochenblock zeigt die Karte drei offene Missionen mit Nullstand', () => {
  const card = cardOf(render());
  assert.equal(card.match(/<li/g).length, 3);
  assert.match(card, /0 von 3 Seiten/);
  assert.match(card, /0 von 1 Auffrischung/);
  assert.match(card, /0 von 1 Runde/);
  assert.equal(card.match(/Offen/g).length, 3);
  assert.doesNotMatch(card, /Erledigt/);
});

test('SEITE-MISSIONEN Eine erledigte Mission trägt das Häkchen und den Text "Erledigt", nicht nur eine Farbe', () => {
  const card = cardOf(render({ week: weekOf({ strong: 1, done: ['strong90'] }) }));
  const done = /<li[^>]*>(?:(?!<\/li>)[\s\S])*Runde(?:(?!<\/li>)[\s\S])*<\/li>/.exec(card)[0];
  assert.match(done, /Erledigt/);
  assert.match(done, /<svg[^>]*aria-hidden="true"/);
  assert.match(done, /1 von 1 Runde/);
  assert.equal(card.match(/Erledigt/g).length, 1);
  assert.equal(card.match(/Offen/g).length, 2);
});

test('SEITE-MISSIONEN Eine Woche aus der Vergangenheit zählt nicht, die Karte steht wieder auf null', () => {
  const card = cardOf(render({ week: weekOf({ start: '2026-10-19', units: ['start', 'weiter', 'x'], done: ['units3'] }) }));
  assert.match(card, /0 von 3 Seiten/);
  assert.doesNotMatch(card, /Erledigt/);
});

test('SEITE-MISSIONEN Die Karte nennt die Belohnung von 20 XP je Mission', () => {
  assert.match(cardOf(render()), /20 XP/);
});

// --- Lernpfad-Karte (Spec 5.8): Stationen in Manifest-Reihenfolge, weich freigeschaltet ---

const FRESH = '2026-10-25'; // einen Tag vor DAY: nicht fällig
const OLD = '2026-10-20'; // sechs Tage vor DAY: ab 3 Tagen fällig, mit starker Genauigkeit erst ab 7

const appWith = (extra = {}) => ({ ...appDefaults(), ...extra });
const U = (id) => ({ id });

function renderApp(app, { open = false, units = UNITS } = {}) {
  return renderToStaticMarkup(h(AppHome, {
    config: configOf({ units }), app, profile: profileDefaults(), day: DAY, rec: null, open, notice: null, storeMessage: null,
    persistent: false, resetPhase: 'idle', profileStore: null, onStudy: noop, onStart: noop, onReset: noop, onName: noop
  }));
}

// Der Teil "Dein Lernpfad", damit Spielmodi und Sammelalbum die Treffer nicht verfälschen.
const pathOf = (markup) => {
  const match = /<ol class="path"[\s\S]*?<\/ol>/.exec(markup);
  assert.ok(match, 'Lernpfad-Karte fehlt');
  return match[0];
};
const stationsOf = (path) => path.match(/<li[\s\S]*?<\/li>/g);

test('SEITE-PFAD stationState: offen ohne Stern', () => {
  assert.equal(stationState(appWith(), U('start'), DAY), 'offen');
  assert.equal(stationState(appWith({ stars: { start: 0 } }), U('start'), DAY), 'offen');
});

test('SEITE-PFAD stationState: geübt bei 1 und 2 Sternen', () => {
  assert.equal(stationState(appWith({ stars: { start: 1 }, last: { start: FRESH } }), U('start'), DAY), 'geübt');
  assert.equal(stationState(appWith({ stars: { start: 2 }, last: { start: FRESH } }), U('start'), DAY), 'geübt');
});

test('SEITE-PFAD stationState: gemeistert bei 3 Sternen', () => {
  assert.equal(stationState(appWith({ stars: { start: 3 }, last: { start: FRESH } }), U('start'), DAY), 'gemeistert');
});

test('SEITE-PFAD stationState: fällig hat Vorrang vor geübt und gemeistert', () => {
  assert.equal(stationState(appWith({ stars: { start: 2 }, last: { start: OLD } }), U('start'), DAY), 'fällig');
  assert.equal(stationState(appWith({ stars: { start: 3 }, last: { start: OLD } }), U('start'), DAY), 'fällig');
  // Starke Genauigkeit verlängert die Frist auf 7 Tage: sechs Tage sind noch nicht fällig.
  assert.equal(stationState(appWith({ stars: { start: 3 }, last: { start: OLD }, acc: { start: 0.95 } }), U('start'), DAY), 'gemeistert');
});

test('SEITE-PFAD stationState: ohne Stern nie fällig, auch mit altem Tag', () => {
  assert.equal(stationState(appWith({ last: { start: OLD } }), U('start'), DAY), 'offen');
});

test('SEITE-PFAD Fehlendes app.stars und fehlende Einträge lassen die Karte nicht abstürzen', () => {
  for (const app of [appWith({ stars: undefined }), appWith({ stars: {}, last: undefined, acc: undefined }), appWith({ stars: { start: 1 } })]) {
    const path = pathOf(renderApp(app));
    assert.equal(stationsOf(path).length, UNITS.length);
  }
  assert.equal(stationState(appWith({ stars: undefined }), U('start'), DAY), 'offen');
});

test('SEITE-PFAD Die Stationen stehen in der Reihenfolge des Manifests, je Seite genau eine', () => {
  const units = [
    { id: 'c', title: 'Drittes', de: 'x', color: '#4CC3F5' },
    { id: 'a', title: 'Erstes', de: 'x', color: '#4CC3F5' },
    { id: 'b', title: 'Zweites', de: 'x', color: '#4CC3F5' }
  ];
  const path = pathOf(renderApp(appWith(), { units }));
  const order = [...path.matchAll(/<span class="stitle">([^<]+)<\/span>/g)].map((m) => m[1]);
  assert.deepEqual(order, ['Drittes', 'Erstes', 'Zweites']);
});

test('SEITE-PFAD Jede Station nennt ihren Zustand als Text', () => {
  const app = appWith({ stars: { start: 3 }, last: { start: FRESH } });
  const [first, second] = stationsOf(pathOf(renderApp(app)));
  assert.match(first, /Gemeistert/);
  assert.match(second, /Offen/);
  const due = stationsOf(pathOf(renderApp(appWith({ stars: { start: 2 }, last: { start: OLD } }))))[0];
  assert.match(due, /Zeit zum Auffrischen/);
  const practised = stationsOf(pathOf(renderApp(appWith({ stars: { start: 1 }, last: { start: FRESH } }))))[0];
  assert.match(practised, /Geübt/);
});

test('SEITE-PFAD Die nächste Station ist hervorgehoben, aber nicht gesperrt', () => {
  const app = appWith({ stars: { start: 2 }, last: { start: FRESH } });
  const path = pathOf(renderApp(app));
  const [first, second] = stationsOf(path);
  assert.doesNotMatch(first, /Als Nächstes/);
  assert.match(second, /Als Nächstes/);
  assert.match(second, /class="node next"/);
  assert.match(second, /aria-current="step"/);
  assert.equal(/disabled/.test(path), false, 'keine Station ist gesperrt');
});

test('SEITE-PFAD Ohne Sterne ist die erste Station die nächste, jede Station bleibt anklickbar', () => {
  const path = pathOf(renderApp(appWith()));
  const [first, second] = stationsOf(path);
  assert.match(first, /Als Nächstes/);
  assert.doesNotMatch(second, /Als Nächstes/);
  assert.equal((path.match(/<button/g) || []).length, UNITS.length);
  assert.equal(/disabled/.test(path), false);
});

test('SEITE-PFAD Sind alle Seiten geübt, gibt es keine "Als Nächstes"-Markierung', () => {
  const app = appWith({ stars: { start: 1, weiter: 3 }, last: { start: FRESH, weiter: FRESH } });
  assert.doesNotMatch(pathOf(renderApp(app)), /Als Nächstes/);
});

test('SEITE-PFAD Eine fällige Station ist vor der ersten Station ohne Stern die nächste', () => {
  const app = appWith({ stars: { weiter: 1 }, last: { weiter: OLD } });
  const [first, second] = stationsOf(pathOf(renderApp(app)));
  assert.doesNotMatch(first, /Als Nächstes/, 'die Seite ohne Stern steht nicht vorn');
  assert.match(second, /Als Nächstes/);
  assert.match(second, /Zeit zum Auffrischen/);
});

test('SEITE-PFAD Der Endgegner bleibt gesperrt, solange er nicht offen ist, und öffnet mit open', () => {
  assert.match(renderApp(appWith(), { open: false }), /<button[^>]*disabled=""[^>]*>Noch gesperrt</);
  assert.doesNotMatch(renderApp(appWith(), { open: true }), /Noch gesperrt/);
});
