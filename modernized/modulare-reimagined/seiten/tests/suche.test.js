// Suche: findet Seiten über alle Apps aus dem Katalog.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MAX_HITS, Suche, searchUnits } from '../suche.js';

const h = createElement;

const apps = [
  { id: 'mathe', title: 'Mathe-Werkstatt', subject: 'Mathematik', status: 'live', units: [
    { id: 'prozent', title: 'Prozentrechnung', de: 'Prozentsatz, Grundwert', chapter: 'Kapitel VI: Prozente' },
    { id: 'zinsen', title: 'Zinsrechnung', de: 'Zins und Prozent', chapter: 'Kapitel VI: Prozente' }
  ] },
  { id: 'franz', title: 'Französisch-Werkstatt', subject: 'Französisch', status: 'live', units: [{ id: 'etre', title: 'être', de: 'sein', chapter: 'Verben' }] },
  { id: 'bald', title: 'Bald', subject: 'Bio', status: 'soon', units: [{ id: 'prozent', title: 'Prozent bald', de: 'x' }] }
];

test('SEITE-SUCHE Findet Seiten, Titel gehen vor, Treffer verlinken auf die Seite', () => {
  const { total, hits } = searchUnits(apps, 'prozent');
  assert.equal(total, 2);
  assert.deepEqual(hits.map((hit) => hit.title), ['Prozentrechnung', 'Zinsrechnung']);
  assert.equal(hits[0].href, '?app=mathe&seite=prozent');
  assert.equal(hits[0].where, 'Mathe-Werkstatt · Kapitel VI: Prozente');
});

test('SEITE-SUCHE Groß, klein und Akzente zählen nicht, mehrere Wörter grenzen ein', () => {
  assert.equal(searchUnits(apps, 'ETRE').hits[0].title, 'être');
  assert.equal(searchUnits(apps, 'mathe zins').total, 1);
  assert.equal(searchUnits(apps, 'mathe etre').total, 0);
});

test('SEITE-SUCHE Zu kurze Anfragen suchen nicht, Apps ohne Live-Status fehlen', () => {
  assert.equal(searchUnits(apps, 'p').total, 0);
  assert.equal(searchUnits(apps, '   ').total, 0);
  assert.equal(searchUnits(apps, 'bald').total, 0);
});

test('SEITE-SUCHE Die Liste bleibt kurz, total zählt alle', () => {
  const viele = [{ id: 'a', title: 'A', subject: 'S', status: 'live', units: Array.from({ length: 20 }, (_, i) => ({ id: `s${i}`, title: `Seite ${i}`, de: 'x' })) }];
  const { total, hits } = searchUnits(viele, 'seite');
  assert.equal(total, 20);
  assert.equal(hits.length, MAX_HITS);
});

test('SEITE-SUCHE Das Feld hat einen Namen, Treffer und Leerstand sagen es als Text', () => {
  const treffer = renderToStaticMarkup(h(Suche, { apps, initial: 'prozent' }));
  assert.match(treffer, /aria-label="Thema in allen Apps suchen"/);
  assert.match(treffer, /2 Seiten gefunden/);
  assert.match(treffer, /href="\?app=mathe&amp;seite=prozent"/);
  assert.match(renderToStaticMarkup(h(Suche, { apps, initial: 'xyzzy' })), /Nichts gefunden/);
});
