import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Album, AlbumCard, tierOf } from '../album.js';

const h = createElement;

const unit = { id: 'nomen', title: 'Nomen', color: '#4CC3F5', card: { name: 'Die Wortart', fact: 'Nomen schreibt man groß.' } };
const card = (stars) => renderToStaticMarkup(h(AlbumCard, { unit, stars }));

test('RULE-220 ohne Stern ist die Karte gesperrt und heißt Geheimkarte', () => {
  const markup = card(0);
  assert.match(markup, /class="gcard t0"/);
  assert.match(markup, />Gesperrt</);
  assert.match(markup, /Geheimkarte/);
  assert.match(markup, /Schaffe die Seite „Nomen“, um sie freizuschalten\./);
  assert.doesNotMatch(markup, /Die Wortart|Nomen schreibt/, 'Name und Fakt bleiben verborgen');
});

test('RULE-220 ein Stern ergibt Bronze', () => {
  const markup = card(1);
  assert.match(markup, /class="gcard t1"/);
  assert.match(markup, />Bronze</);
  assert.match(markup, /Die Wortart/);
});

test('RULE-220 zwei Sterne ergeben Silber', () => {
  const markup = card(2);
  assert.match(markup, /class="gcard t2"/);
  assert.match(markup, />Silber</);
});

test('RULE-220 drei Sterne ergeben Gold', () => {
  const markup = card(3);
  assert.match(markup, /class="gcard t3"/);
  assert.match(markup, />Gold</);
  assert.match(markup, /Nomen schreibt man groß\./);
});

test('RULE-220 Stufe bleibt im Bereich 0 bis 3, ungültige Werte zählen als gesperrt', () => {
  assert.equal(tierOf(4), 3);
  assert.equal(tierOf(-1), 0);
  assert.equal(tierOf(undefined), 0);
  assert.equal(tierOf(NaN), 0);
  assert.equal(tierOf('2'), 0, 'Text ist keine Sternzahl');
});

test('RULE-220 Seiten ohne Karte werden übersprungen, ohne Karte kein Abschnitt', () => {
  const plain = { id: 'ohne', title: 'Ohne Karte' };
  const markup = renderToStaticMarkup(h(Album, { units: [plain, unit], stars: { nomen: 2, ohne: 3 } }));
  assert.equal(markup.split('<article').length - 1, 1);
  assert.equal(renderToStaticMarkup(h(Album, { units: [plain], stars: {} })), '');
});

test('RULE-220 Album liest die Sterne je Seite über die eigene ID', () => {
  const markup = renderToStaticMarkup(h(Album, { units: [unit], stars: { nomen: 3 } }));
  assert.match(markup, /Sammelalbum/);
  assert.match(markup, /class="gcard t3"/);
  const constructorStars = renderToStaticMarkup(h(Album, { units: [{ ...unit, id: 'constructor' }], stars: {} }));
  assert.match(constructorStars, /class="gcard t0"/);
});

test('KOMP-A11Y Stufe steht als Text auf der Karte, nicht nur als Farbe', () => {
  assert.match(card(2), /class="medal">Silber</);
});
