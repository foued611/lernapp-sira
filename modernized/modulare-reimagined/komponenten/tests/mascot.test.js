import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Mascot, faceFor } from '../mascot.js';

const h = createElement;

const draw = (mood) => renderToStaticMarkup(h(Mascot, mood === undefined ? {} : { mood }));

test('RULE-217 Minou zeichnet eines der vier Gesichter für eine bekannte Stimmung', () => {
  const faces = ['happy', 'cheer', 'sad', 'hmm'].map(draw);
  assert.equal(new Set(faces).size, 4, 'jede Stimmung hat ein eigenes Gesicht');
});

test('RULE-217 unbekannte oder fehlende Stimmung wird zu fröhlich', () => {
  const happy = draw('happy');
  assert.equal(draw(undefined), happy, 'ohne Argument');
  assert.equal(draw('verwirrt'), happy, 'unbekannte Stimmung');
  assert.equal(draw(null), happy, 'null');
});

test('RULE-217 Prototyp-Schlüssel wie constructor ergeben kein fremdes Gesicht', () => {
  assert.equal(faceFor('constructor'), 'happy');
  assert.equal(faceFor('__proto__'), 'happy');
  assert.equal(draw('toString'), draw('happy'));
});

test('KOMP-A11Y Minou ist dekorativ: aria-hidden, kein role="img" und kein aria-label', () => {
  const markup = draw('cheer');
  assert.match(markup, /aria-hidden="true"/);
  assert.doesNotMatch(markup, /role="img"|aria-label/);
});
