// Diagramme der Mathe-Werkstatt: jedes liefert ein SVG mit role="img" und Alternativtext, und alle Diagramme,
// die content/mathe/lessons.json verlangt, sind vorhanden und lassen sich mit den Argumenten aus dem Inhalt zeichnen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import * as diagrams from '../diagrams.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('mathe');

const referenzen = [];
(function sammle(o) {
  if (Array.isArray(o)) return o.forEach(sammle);
  if (o && typeof o === 'object') {
    if (o.diagram && typeof o.diagram.name === 'string') referenzen.push(o.diagram);
    Object.values(o).forEach(sammle);
  }
})(paket.lessons);

test('MATHE-DIAGRAMM: jedes Diagramm liefert ein SVG mit role="img" und aria-label', () => {
  for (const [name, fn] of Object.entries(diagrams)) {
    const markup = renderToStaticMarkup(fn());
    assert.match(markup, /^<svg /, name);
    assert.match(markup, /role="img"/, name);
    assert.match(markup, /aria-label="[^"]+"/, name);
  }
});

test('MATHE-DIAGRAMM: alle Diagramme aus content/mathe/lessons.json sind vorhanden und zeichnen sich', () => {
  assert.ok(referenzen.length >= 9, 'erwartet mindestens neun Diagrammverweise in den Lektionen');
  for (const { name, args = [] } of referenzen) {
    assert.equal(typeof diagrams[name], 'function', `fehlt: ${name}`);
    const markup = renderToStaticMarkup(diagrams[name](...args));
    assert.match(markup, /role="img"/, name);
  }
});
