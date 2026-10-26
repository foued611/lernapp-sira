import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { swapDiagram } from '../before-after.js';

const h = createElement;

const count = (markup, needle) => markup.split(needle).length - 1;

// Aktiv oben, Passiv unten. map[i] ist der Index unten für top[i], z. B. [3, 0, 2] verbindet oben 0 mit unten 3.
const top = ['Der Hund', 'beißt', 'den Mann'];
const bottom = ['Der Mann', 'wird', 'vom Hund', 'gebissen'];

test('RULE-266 jeder Kasten oben bekommt genau einen Pfeil zum Ziel unten', () => {
  const markup = renderToStaticMarkup(h('div', null, swapDiagram(top, bottom, [3, 0, 2])));
  assert.equal(count(markup, 'class="ar"'), 3);
  // Pfeile enden bei 126 (Reihe unten) und beginnen bei 80 (Reihe oben).
  assert.equal(count(markup, 'y1="80"'), 3);
  assert.equal(count(markup, 'y2="126"'), 3);
});

test('RULE-266 Zielkästen unten sind hervorgehoben (hi), die übrigen bekommen acc', () => {
  const markup = renderToStaticMarkup(h('div', null, swapDiagram(['A', 'B'], ['x', 'y', 'z'], [2, 0])));
  assert.equal(count(markup, 'class="hi"'), 2, 'zwei Ziele');
  assert.equal(count(markup, 'class="acc"'), 1, 'ein Kasten ohne Pfeil');
  assert.equal(count(markup, 'class="sm on-sun"'), 2);
  assert.equal(count(markup, 'class="sm on-acc"'), 1);
});

test('RULE-266 Kastenbreite ist floor(440 / n) - 8, zwei Kästen 212, drei Kästen 138', () => {
  assert.match(renderToStaticMarkup(h('div', null, swapDiagram(['A', 'B'], ['x', 'y'], [0, 1]))), /width="212"/);
  assert.match(renderToStaticMarkup(h('div', null, swapDiagram(top, bottom, [0, 1, 2]))), /width="138"/);
});

test('RULE-266 Beschriftung der Reihen ist standardmäßig Aktiv und Passiv', () => {
  const markup = renderToStaticMarkup(h('div', null, swapDiagram(['A'], ['B'], [0])));
  assert.match(markup, />Aktiv</);
  assert.match(markup, />Passiv</);
  const custom = renderToStaticMarkup(h('div', null, swapDiagram(['A'], ['B'], [0], ['Vorher', 'Nachher'])));
  assert.match(custom, />Vorher</);
  assert.match(custom, />Nachher</);
});

test('RULE-266 ungültige Indizes erzeugen keinen Pfeil und brechen nicht ab', () => {
  let markup = '';
  assert.doesNotThrow(() => {
    markup = renderToStaticMarkup(h('div', null, swapDiagram(['A', 'B'], ['x'], [5, 0, 1.5, -1])));
  });
  // Einziges gültiges Paar: oben Index 1 (map[1] = 0) nach unten Index 0. Alle anderen Paare sind ungültig.
  assert.equal(count(markup, 'class="ar"'), 1, 'nur das gültige Paar bekommt einen Pfeil');
  assert.equal(count(markup, 'class="hi"'), 1);
});

test('KOMP-A11Y Diagramm hat role="img" und eine Beschreibung ohne Trennzeichen', () => {
  const markup = renderToStaticMarkup(h('div', null, swapDiagram(['Der Hund'], ['Der Mann|wird'], [0])));
  assert.match(markup, /role="img"/);
  assert.match(markup, /aria-label="Aktiv: Der Hund\. Passiv: Der Mann wird"/);
});

test('RULE-266 leere oder keine Listen werfen einen klaren Fehler statt eines leeren Bildes', () => {
  assert.throws(() => swapDiagram([], ['x'], []), TypeError);
  assert.throws(() => swapDiagram(['a'], ['b'], 'nicht-eine-liste'), TypeError);
});
