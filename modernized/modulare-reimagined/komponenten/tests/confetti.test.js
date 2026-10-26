import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Confetti, confettiPieces } from '../confetti.js';

const h = createElement;

test('KOMP-A11Y Konfetti wird bei reduzierter Bewegung nicht gezeichnet', () => {
  assert.equal(renderToStaticMarkup(h(Confetti, { reduced: true })), '');
});

test('KOMP-A11Y Konfetti ohne Angabe des Flags bleibt still (sicherer Standard)', () => {
  assert.equal(renderToStaticMarkup(h(Confetti, {})), '');
});

test('KOMP-A11Y Konfetti ohne reduzierte Bewegung ist dekorativ, hat 46 Teile und ist für einen Seed reproduzierbar', () => {
  const markup = renderToStaticMarkup(h(Confetti, { reduced: false, seed: 7 }));
  assert.match(markup, /aria-hidden="true"/);
  assert.equal(markup.split('class="cf"').length - 1, confettiPieces(7).length);
  assert.equal(confettiPieces(7).length, 46);
  assert.equal(markup, renderToStaticMarkup(h(Confetti, { reduced: false, seed: 7 })));
});
