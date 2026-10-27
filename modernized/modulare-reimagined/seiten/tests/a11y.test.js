// Bedienung, Kontrast und Design-Tokens (SEITE-A11Y). Liest die CSS-Dateien als Text und prüft sie.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Startseite } from '../startseite.js';
import { AppHome } from '../apphome.js';
import { appDefaults, profileDefaults } from '../rahmen.js';
import { bootFixture, configOf, DAY } from './helpers.js';

const h = createElement;
const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const tokens = read('tokens.css');
const styles = read('seiten.css');

// Der Block vor "@media (prefers-color-scheme: dark)" ist hell, der danach dunkel.
const [lightBlock, darkBlock = ''] = tokens.split('@media (prefers-color-scheme: dark)');

function valuesOf(block) {
  const values = {};
  for (const [, name, value] of block.matchAll(/--(color-[a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) values[name] = value;
  return values;
}

// WCAG-Kontrast zweier Hex-Farben.
function luminance(hex) {
  const channel = (i) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const PAIRS = [
  ['color-text', 'color-surface', 4.5],
  ['color-muted', 'color-surface', 4.5],
  ['color-on-accent', 'color-accent', 4.5],
  ['color-ok', 'color-surface', 4.5],
  ['color-warn', 'color-surface', 4.5],
  ['color-focus', 'color-surface', 3]
];

test('SEITE-A11Y Alle Farben, die die Stylesheets benutzen, sind in den Tokens definiert', () => {
  const used = new Set([...styles.matchAll(/var\(--([a-z-]+)\)/g)].map((m) => m[1]));
  for (const name of used) {
    assert.match(tokens, new RegExp(`--${name}:`), `--${name} fehlt in tokens.css`);
  }
});

test('SEITE-A11Y Es gibt einen dunklen Block, der die Farben ersetzt', () => {
  assert.ok(darkBlock.includes(':root'), 'dunkler Block fehlt');
  assert.ok(Object.keys(valuesOf(darkBlock)).length >= 10, 'die dunklen Werte sind vollständig');
});

test('SEITE-A11Y Die Textfarben haben in hell und dunkel genug Kontrast (4,5 zu 1, Fokus 3 zu 1)', () => {
  for (const [label, block] of [['hell', lightBlock], ['dunkel', darkBlock]]) {
    const values = valuesOf(block);
    for (const [fg, bg, min] of PAIRS) {
      const ratio = contrast(values[fg], values[bg]);
      assert.ok(ratio >= min, `${label}: ${fg} auf ${bg} hat ${ratio.toFixed(2)} zu 1, nötig ${min}`);
    }
  }
});

test('SEITE-A11Y Der sichtbare Fokus ist im Stylesheet mit einem Rahmen definiert', () => {
  assert.match(styles, /:focus-visible\s*\{[^}]*outline:\s*3px/);
});

test('SEITE-A11Y Knöpfe sind mindestens 44 px hoch, über das Token', () => {
  assert.match(tokens, /--touch-min:\s*44px/);
  assert.match(styles, /min-height:\s*var\(--touch-min\)/);
});

test('SEITE-A11Y Bewegung lässt sich abschalten, wenn das System es verlangt', () => {
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.confetti\s*\{\s*display:\s*none/);
});

test('SEITE-A11Y Die Stylesheets enthalten keine festen Farbwerte, nur Tokens', () => {
  assert.equal(/#[0-9a-fA-F]{3,6}\b/.test(styles), false, 'seiten.css nutzt nur var(--color-…)');
});

test('SEITE-A11Y Das Namensfeld hat eine Beschriftung, die nicht nur ein Platzhalter ist', async () => {
  const boot = await bootFixture();
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.match(markup, /aria-label="Dein Name"/);
  assert.match(markup, /placeholder="Wie heißt du\?"/);
});

const pathMarkup = () => {
  const markup = renderToStaticMarkup(h(AppHome, {
    config: configOf(), app: { ...appDefaults(), stars: { start: 3 }, last: { start: DAY } }, profile: profileDefaults(), day: DAY,
    rec: null, open: false, notice: null, storeMessage: null, persistent: false, resetPhase: 'idle', profileStore: null,
    onStudy() {}, onStart() {}, onReset() {}, onName() {}
  }));
  return /<ol class="path"[\s\S]*?<\/ol>/.exec(markup)[0];
};

test('SEITE-A11Y Jede Station des Lernpfads ist ein Button mit Text, der Zustand steht als Wort da', () => {
  const stations = pathMarkup().match(/<li[\s\S]*?<\/li>/g);
  assert.equal(stations.length, 2);
  for (const station of stations) {
    const button = /<button[^>]*type="button"[^>]*>([\s\S]*?)<\/button>/.exec(station);
    assert.ok(button, 'die Station ist ein Button');
    const text = button[1].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
    assert.match(text, /\b(Offen|Geübt|Gemeistert|Zeit zum Auffrischen)\b/, 'Zustand als Text, nicht nur Farbe');
    assert.match(text, /Seite/, 'der Titel der Seite steht im Button');
  }
});

test('SEITE-A11Y Die Stationen des Lernpfads sind mindestens 44 px hoch, ohne feste Farben', () => {
  const base = read('design/styles/base.css');
  const rule = /\.node\{[^}]*\}/.exec(base)[0];
  assert.match(rule, /min-height:\s*(var\(--touch-min,\s*44px\)|44px)/);
  const mapRules = base.split('\n').filter((line) => /^\.(node|path|station|state)/.test(line)).join('\n');
  assert.equal(/#[0-9a-fA-F]{3,6}\b/.test(mapRules), false, 'Lernpfad-CSS nutzt nur Tokens');
});
