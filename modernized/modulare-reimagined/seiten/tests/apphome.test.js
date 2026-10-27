// Startseite einer App (AppHome): Karte "Diese Woche" mit den drei Wochenmissionen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppHome } from '../apphome.js';
import { appDefaults, profileDefaults } from '../rahmen.js';
import { configOf, DAY } from './helpers.js';

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
