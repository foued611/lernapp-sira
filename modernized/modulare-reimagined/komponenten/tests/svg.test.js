import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { diagram, rect, text, arrow } from '../svg.js';

const h = createElement;

test('KOMP-A11Y Diagramm hat role="img" und einen aria-label', () => {
  const markup = renderToStaticMarkup(diagram(520, 100, 'Aufbau einer Inhaltsangabe', [rect(10, 10, 50, 20, 'box')]));
  assert.match(markup, /role="img"/);
  assert.match(markup, /aria-label="Aufbau einer Inhaltsangabe"/);
  assert.match(markup, /viewBox="0 0 520 100"/);
});

test('KOMP-A11Y Diagramm ohne Alternativtext wird nicht gezeichnet', () => {
  assert.throws(() => diagram(10, 10, '', []), TypeError);
  assert.throws(() => diagram(10, 10, '   ', []), TypeError);
  assert.throws(() => diagram(10, 10, undefined, []), TypeError);
});

test('KOMP-A11Y Diagramm: Anführungszeichen und Winkelklammern im Alternativtext bleiben Attributtext', () => {
  const markup = renderToStaticMarkup(diagram(10, 10, 'a "b" <c>', []));
  assert.match(markup, /aria-label="a &quot;b&quot; &lt;c&gt;"/);
  assert.doesNotMatch(markup, /<c>/);
});

test('KOMP-A11Y Diagrammtext aus Daten wird maskiert und nicht als Markup gelesen', () => {
  const markup = renderToStaticMarkup(text(0, 0, '<script>x</script>'));
  assert.match(markup, /&lt;script&gt;x&lt;\/script&gt;/);
  assert.doesNotMatch(markup, /<script>/);
});

test('KOMP-A11Y Pfeile und Kästen erhalten ihre Klassen für Hell und Dunkel (CSS statt Farbwerte)', () => {
  assert.match(renderToStaticMarkup(arrow(1, 2, 3, 4)), /class="ar"/);
  assert.doesNotMatch(renderToStaticMarkup(rect(0, 0, 1, 1, 'box')), /fill=|stroke=/);
});
