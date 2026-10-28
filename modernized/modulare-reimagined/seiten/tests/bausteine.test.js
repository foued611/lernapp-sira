// Bausteine-Stylesheet: die Klassen aus komponenten/ und seiten/ haben in der Produktion Regeln (app.css lädt sie).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const bausteine = read('../design/styles/bausteine.css');
const app = read('../design/styles/app.css');

const CLASSES = ['notice', 'progress-track', 'progress-fill', 'stars-row', 'confetti', 'cf', 'fm-reveal'];

test('SEITE-A11Y app.css lädt das Bausteine-Stylesheet', () => {
  assert.match(app, /@import url\('bausteine\.css'\);/);
});

test('SEITE-A11Y jede Baustein-Klasse hat eine Regel', () => {
  for (const name of CLASSES) {
    assert.match(bausteine, new RegExp(`\\.${name}\\b[^{]*\\{`), `.${name} fehlt`);
  }
});

test('SEITE-A11Y Bausteine nutzen nur Tokens, keine festen Farben', () => {
  assert.equal(/#[0-9a-fA-F]{3,6}\b|rgba?\(/.test(bausteine), false);
});

test('SEITE-A11Y Konfetti entfällt bei reduzierter Bewegung', () => {
  assert.match(bausteine, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.confetti\s*\{\s*display:\s*none/);
});

test('SEITE-A11Y verdecktes Feld hat mindestens 44 px Berührungsfläche', () => {
  assert.match(bausteine, /\.fm-reveal\s*\{[^}]*min-width:\s*44px[^}]*min-height:\s*44px/);
});
