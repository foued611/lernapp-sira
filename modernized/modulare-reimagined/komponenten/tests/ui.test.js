import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, ProgressBar, StarRow, doneUnits, progressOf, starsOf, DONE_STARS } from '../ui.js';

const h = createElement;

const cssPath = new URL('../komponenten.css', import.meta.url);

test('RULE-075 eine Seite gilt ab 2 von 3 Sternen als erledigt, 1 Stern zählt nicht', () => {
  assert.equal(DONE_STARS, 2);
  assert.equal(doneUnits({ a: 1 }, ['a']), 0);
  assert.equal(doneUnits({ a: 2 }, ['a']), 1);
  assert.equal(doneUnits({ a: 3 }, ['a']), 1);
});

test('RULE-075 erledigt zählt nur Seiten der Liste, veraltete IDs erhöhen die Zahl nicht', () => {
  const stars = { a: 2, b: 3, c: 1, gelöscht: 3 };
  assert.equal(doneUnits(stars, ['a', 'b', 'c']), 2);
});

test('RULE-075 Prozent: 4 von 9 ergeben 44, 9 von 9 ergeben 100, ohne Seiten 0 statt NaN', () => {
  assert.equal(progressOf(4, 9), 44);
  assert.equal(progressOf(9, 9), 100);
  assert.equal(progressOf(0, 0), 0);
  assert.equal(progressOf(12, 9), 100, 'nie über 100');
});

test('RULE-075 Fortschritt steht als Text mit Prozent, der Balken ergänzt nur', () => {
  const markup = renderToStaticMarkup(h(ProgressBar, { done: 4, total: 9 }));
  assert.match(markup, /4 von 9 Seiten erledigt \(44 %\)/);
  assert.match(markup, /width:44%/);
});

test('RULE-075 Sterne einer Seite sind über ihre ID nachschlagbar, Unbekanntes zählt als 0', () => {
  assert.equal(starsOf({ a: 2 }, 'a'), 2);
  assert.equal(starsOf({ a: 2 }, 'b'), 0);
  assert.equal(starsOf({}, 'constructor'), 0);
  assert.equal(starsOf({ a: '2' }, 'a'), 0);
});

test('KOMP-A11Y Fortschritt ist ein progressbar mit Prozentwert für Hilfstechnik', () => {
  const markup = renderToStaticMarkup(h(ProgressBar, { done: 4, total: 9, label: 'Lernfortschritt' }));
  assert.match(markup, /role="progressbar"/);
  assert.match(markup, /aria-valuenow="44"/);
  assert.match(markup, /aria-label="Lernfortschritt"/);
});

test('KOMP-A11Y Sterne: sichtbarer Text "2 von 3 Sternen", die Symbole sind verborgen', () => {
  const markup = renderToStaticMarkup(h(StarRow, { stars: 2 }));
  assert.match(markup, />2 von 3 Sternen</);
  assert.match(markup, /<span class="stars" aria-hidden="true">/);
  assert.equal(markup.split('class="ic on"').length - 1, 2);
  assert.equal(markup.split('class="ic"').length - 1, 1);
});

test('KOMP-A11Y Sterne ohne Wertung zeigen 0 von 3 als Text', () => {
  assert.match(renderToStaticMarkup(h(StarRow, { stars: undefined })), />0 von 3 Sternen</);
});

test('KOMP-A11Y Knopf: Standardtyp button, Größe kommt aus der Klasse btn, kein inline style', () => {
  const markup = renderToStaticMarkup(h(Button, { variant: 'ghost', small: true }, 'Los'));
  assert.equal(markup, '<button type="button" class="btn ghost small">Los</button>');
  assert.doesNotMatch(markup, /style=/);
});

test('KOMP-A11Y Mindestgröße 44 px steht in der Klasse .btn der Komponenten-CSS', () => {
  const css = readFileSync(cssPath, 'utf8');
  const rule = css.match(/(?:^|\n)\.btn,[\s\S]*?\{([^}]*)\}/);
  assert.ok(rule, 'Regel für .btn fehlt');
  assert.match(rule[1], /min-height:\s*44px/);
  assert.match(rule[1], /min-width:\s*44px/);
});
