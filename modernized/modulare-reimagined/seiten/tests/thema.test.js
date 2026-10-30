// Umschalter für Hell und Dunkel: Wahl gilt sofort, bleibt gemerkt, und ohne Wahl entscheidet das System.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeToggle, applySavedTheme, currentTheme, setThemePorts, toggleTheme } from '../thema.js';

function umgebung({ saved = null, system = 'light' } = {}) {
  const state = { saved, applied: [] };
  setThemePorts({
    read: () => state.saved,
    save: (theme) => { state.saved = theme; return true; },
    apply: (theme) => state.applied.push(theme),
    systemTheme: () => system
  });
  return state;
}

test('SEITE-THEMA Ohne Wahl gilt das System und data-theme bleibt frei', () => {
  const state = umgebung({ system: 'dark' });
  applySavedTheme();
  assert.equal(currentTheme(), 'dark');
  assert.deepEqual(state.applied, []);
});

test('SEITE-THEMA Eine frühere Wahl gewinnt gegen das System', () => {
  const state = umgebung({ saved: 'light', system: 'dark' });
  applySavedTheme();
  assert.equal(currentTheme(), 'light');
  assert.deepEqual(state.applied, ['light']);
});

test('SEITE-THEMA Umschalten wechselt vom System aus und merkt die Wahl', () => {
  const state = umgebung({ system: 'dark' });
  assert.equal(toggleTheme(), 'light');
  assert.equal(state.saved, 'light');
  assert.equal(toggleTheme(), 'dark');
  assert.deepEqual(state.applied, ['light', 'dark']);
});

test('SEITE-THEMA Der Schalter hat einen festen Namen und zeigt den Zustand als aria-pressed', () => {
  umgebung({ saved: 'dark' });
  const dunkel = renderToStaticMarkup(h(ThemeToggle));
  assert.match(dunkel, /aria-label="Dunkler Modus"/);
  assert.match(dunkel, /aria-pressed="true"/);
  umgebung({ saved: 'light' });
  assert.match(renderToStaticMarkup(h(ThemeToggle)), /aria-pressed="false"/);
});
