import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '../icons.js';

const h = createElement;

test('KOMP-A11Y Icon ist dekorativ: aria-hidden und kein Alternativtext', () => {
  const markup = renderToStaticMarkup(h(Icon, { name: 'star' }));
  assert.match(markup, /aria-hidden="true"/);
  assert.doesNotMatch(markup, /role=|aria-label/);
});

test('KOMP-A11Y Icon mit unbekanntem Namen zeichnet nichts, ohne leeren Pfad', () => {
  const markup = renderToStaticMarkup(h(Icon, { name: 'gibt-es-nicht' }));
  assert.equal(markup, '');
  assert.doesNotMatch(renderToStaticMarkup(h(Icon, { name: 'constructor' })), /undefined|<path/);
});

test('KOMP-A11Y Icon übernimmt den festen Pfad des Namens und zusätzliche Klassen', () => {
  const markup = renderToStaticMarkup(h(Icon, { name: 'heart', className: 'on' }));
  assert.match(markup, /class="ic on"/);
  assert.match(markup, /d="M12 21\.35l-1\.45-1\.32/);
});
