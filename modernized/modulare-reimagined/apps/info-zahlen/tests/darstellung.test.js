// Darstellung der Zahlenwerkstatt: Diagramme und Theorieseiten als HTML. Die Oberfläche läuft im Browser,
// deshalb prüfen wir das gerenderte Markup mit react-dom/server.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { buildConfig } from '../../../inhalte/index.js';
import logic from '../logic.js';
import * as diagrams from '../diagrams.js';
import { Theory } from '../theory.js';
import { paketVon } from '../../tests/laden.js';

const h = createElement;
const config = buildConfig(paketVon('info-zahlen'), logic);
const ALLE = [
  ['placeDiagram', [352]], ['lampDiagram', [[0, 0, 0, 0, 1, 0, 1, 1]]], ['blocksDiagram', [13]],
  ['addDiagram', [11, 6]], ['hexPlaceDiagram', ['2F']], ['nibbleDiagram', [[1, 1, 0, 1, 0, 1, 1, 0]]]
];

for (const [name, args] of ALLE) {
  test(`Diagramm ${name} liefert ein SVG mit role img und aria-label`, () => {
    const html = renderToString(diagrams[name](...args));
    assert.match(html, /^<svg /);
    assert.match(html, /role="img"/);
    assert.match(html, /aria-label="[^"]+"/);
  });
}

test('Diagramme schreiben Daten maskiert, kein Markup aus Text', () => {
  const html = renderToString(diagrams.placeDiagram(352));
  assert.ok(!html.includes('<script'));
  assert.ok(html.includes('352 = 3×100'));
});

for (const unit of config.units) {
  test(`Theorie ${unit.id}: Kopf, Lektion, Spielzeug, Merkzettel und Übungsknopf`, () => {
    const html = renderToString(h(Theory, { unit, config, onStart: () => {} }));
    assert.ok(html.includes(unit.title), 'Titel fehlt');
    assert.ok(html.includes('Merkzettel'), 'Merkzettel fehlt');
    assert.ok(html.includes('Übung starten · 8 Aufgaben'), 'Übungsknopf fehlt');
    assert.ok(html.includes('Ziel'), 'Lektionsziel fehlt');
    assert.ok(html.includes('zw-toy'), 'Spielzeug fehlt');
    assert.ok(html.includes('role="img"'), 'Bild der Lektion fehlt');
  });
}

test('Lampen-Spielzeug: Schalter mit aria-pressed und Stellenwert im Namen', () => {
  const unit = config.units.find((u) => u.id === 'binaer');
  const html = renderToString(h(Theory, { unit, config, onStart: () => {} }));
  assert.match(html, /aria-pressed="false"[^>]*aria-label="Stellenwert 128"/);
  assert.match(html, /aria-pressed="true"[^>]*aria-label="Stellenwert 8"/);
  assert.match(html, /00001011 → 8 \+ 2 \+ 1 = <b>11<\/b>/);
});

test('Hex-Spielzeug: Schieberegler mit Beschriftung und Anfangswert 200 als C8', () => {
  const unit = config.units.find((u) => u.id === 'hex');
  const html = renderToString(h(Theory, { unit, config, onStart: () => {} }));
  assert.match(html, /type="range"/);
  assert.ok(html.includes('Zahl wählen'));
  assert.ok(html.includes('C8'));
});

test('Vierergruppen-Spielzeug zeigt zwei Gruppen mit Hex-Ziffern', () => {
  const unit = config.units.find((u) => u.id === 'binhex');
  const html = renderToString(h(Theory, { unit, config, onStart: () => {} }));
  assert.equal((html.match(/class="zw-nib"/g) || []).length, 2);
  assert.ok(html.includes('>D<'));
  assert.ok(html.includes('>6<'));
});
