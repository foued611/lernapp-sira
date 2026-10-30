// Karte "Heute": fällige Seiten über alle Apps auf der Startseite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Startseite, TODAY_MAX, todayOf } from '../startseite.js';
import { bootFixture, DAY } from './helpers.js';

const h = createElement;

const appWith = (id, last) => ({
  entry: { id, title: `App ${id}` },
  units: Object.keys(last).map((unit) => ({ id: unit, title: `Seite ${unit}` })),
  appStore: { state: { stars: Object.fromEntries(Object.keys(last).map((u) => [u, 2])), last, acc: {} } }
});

test('SEITE-HEUTE Fällige Seiten aller Apps stehen zusammen, die älteste zuerst', () => {
  const today = todayOf([appWith('a', { x: '2026-10-20', neu: DAY }), appWith('b', { y: '2026-10-10' })], DAY);
  assert.equal(today.total, 2);
  assert.deepEqual(today.items.map((item) => item.key), ['b/y', 'a/x']);
  assert.equal(today.items[0].href, '?app=b&seite=y');
  assert.equal(today.items[0].where, 'App b');
});

test('SEITE-HEUTE Die Liste bleibt kurz, total zählt alle', () => {
  const last = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`s${i}`, '2026-10-01']));
  const today = todayOf([appWith('a', last)], DAY);
  assert.equal(today.total, 6);
  assert.equal(today.items.length, TODAY_MAX);
});

test('SEITE-HEUTE Apps ohne Speicher zählen nicht', () => {
  assert.equal(todayOf([{ entry: { id: 'a' }, units: [{ id: 'x' }], appStore: null }], DAY).total, 0);
});

test('SEITE-HEUTE Die Startseite zeigt die Karte nur, wenn etwas fällig ist', async () => {
  const boot = await bootFixture();
  assert.doesNotMatch(renderToStaticMarkup(h(Startseite, { state: boot.state })), /Heute auffrischen/);
  const { state } = boot.state.apps[0].appStore;
  state.stars = { start: 2 };
  state.last = { start: '2026-10-01' };
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.match(markup, /Heute auffrischen/);
  assert.match(markup, /href="\?app=mathe&amp;seite=start"/);
});

test('SEITE-HEUTE Ein kaputter Tag in einer Sicherung stört die Karte nicht', () => {
  const today = todayOf([appWith('a', { x: '2026-02-31', y: '2026-10-01' })], DAY);
  assert.deepEqual(today.items.map((item) => item.key), ['a/y']);
});
