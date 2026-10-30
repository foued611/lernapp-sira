// Adresse: Links auf eine Seite und ihr Weg in die App.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { searchOf, unitFromSearch } from '../adresse.js';
import { AppFrame } from '../rahmen.js';
import { parseRoute } from '../boot.js';
import { bootFixture, DAY } from './helpers.js';

const h = createElement;

test('SEITE-ADRESSE searchOf baut den Adressteil, unitFromSearch liest die Seite zurück', () => {
  assert.equal(searchOf('mathe'), '?app=mathe');
  assert.equal(searchOf('mathe', 'terme'), '?app=mathe&seite=terme');
  assert.equal(unitFromSearch('?app=mathe&seite=terme'), 'terme');
  assert.equal(unitFromSearch('?app=mathe'), null);
  assert.equal(parseRoute('?app=mathe&seite=terme'), 'mathe');
});

const frameWith = async (startUnit) => {
  const boot = await bootFixture({ search: '?app=mathe' });
  const app = boot.state.apps.find((a) => a.entry.id === 'mathe');
  return renderToStaticMarkup(h(AppFrame, { app, profileStore: boot.state.profileStore, day: DAY, storage: boot.state.storage, startUnit }));
};

test('SEITE-ADRESSE Ein Link auf eine Seite öffnet ihre Theorie', async () => {
  assert.match(await frameWith('weiter'), /Zum Lernpfad/);
});

test('SEITE-ADRESSE Eine unbekannte Seite führt zum Lernpfad', async () => {
  const markup = await frameWith('gibt-es-nicht');
  assert.match(markup, /Dein Lernpfad/);
  assert.doesNotMatch(markup, /Zum Lernpfad/);
});
