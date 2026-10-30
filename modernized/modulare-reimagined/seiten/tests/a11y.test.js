// Bedienung, Kontrast und Design-Tokens (SEITE-A11Y). Liest die CSS-Dateien als Text und prüft sie.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Startseite } from '../startseite.js';
import { AppHome } from '../apphome.js';
import { appDefaults, profileDefaults } from '../ablauf.js';
import { bootFixture, configOf, DAY } from './helpers.js';

const h = createElement;
const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const tokens = read('design/styles/tokens.css');
// Die Stylesheets, die die Produktion lädt (app.css). Tokens stehen nur in tokens.css.
const STYLES = ['base.css', 'quiz.css', 'lesson.css', 'dashboard.css', 'bausteine.css'];
const styles = STYLES.map((name) => read(`design/styles/${name}`)).join('\n');

// Farben, die das Markup zur Laufzeit per style="--c: …" setzt (Fachfarbe, Akzent der Seite).
const INLINE = ['c', 'lc'];

// Der Block vor "@media (prefers-color-scheme:dark)" ist hell, der danach dunkel.
const [lightBlock, darkBlock = ''] = tokens.split('@media (prefers-color-scheme:dark)');

function valuesOf(block) {
  const values = {};
  for (const [, name, value] of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) values[name] = value;
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
  ['text', 'card', 4.5],
  ['muted', 'card', 4.5],
  ['btn-fg', 'btn-bg', 4.5],
  ['ok', 'card', 4.5]
];

test('SEITE-A11Y Alle Farben, die die Stylesheets benutzen, sind in den Tokens definiert', () => {
  const used = new Set([...styles.matchAll(/var\(--([a-z-]+)\)/g)].map((m) => m[1]));
  for (const name of used) {
    if (INLINE.includes(name)) continue;
    assert.match(tokens, new RegExp(`--${name}:`), `--${name} fehlt in tokens.css`);
  }
});

test('SEITE-A11Y Es gibt einen dunklen Block, der die Farben ersetzt', () => {
  assert.ok(darkBlock.includes('[data-theme="dark"]'), 'dunkler Block fehlt');
  assert.ok(Object.keys(valuesOf(darkBlock)).length >= 10, 'die dunklen Werte sind vollständig');
});

test('SEITE-A11Y Die Textfarben haben in hell und dunkel genug Kontrast (4,5 zu 1)', () => {
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

test('SEITE-A11Y Im Hero nutzt der Fokus die Vordergrundfarbe, weil --ink dort dem Hintergrund gleicht', () => {
  const base = read('design/styles/base.css');
  assert.match(base, /\.hero\s+:focus-visible\s*\{[^}]*outline-color:\s*var\(--hero-fg\)/);
});

test('SEITE-A11Y Bewegung lässt sich abschalten, wenn das System es verlangt', () => {
  assert.match(styles, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /\.confetti\s*\{\s*display:\s*none/);
});

test('SEITE-A11Y Knöpfe und Links sind mindestens 44 px hoch', () => {
  const base = read('design/styles/base.css');
  assert.match(base, /\.btn\{min-height:44px/);
  assert.match(base, /\.link\{display:inline-flex;align-items:center;min-height:44px/);
  assert.match(base, /\.chip\{min-height:44px/);
});

test('SEITE-A11Y Die Stylesheets enthalten keine festen Farbwerte, nur Tokens', () => {
  assert.equal(/#[0-9a-fA-F]{3,6}\b/.test(styles), false, 'die Design-Stylesheets nutzen nur var(--…)');
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
  assert.match(rule, /min-height:\s*var\(--touch-min\)/);
  assert.match(read('design/styles/tokens.css'), /--touch-min:\s*44px/, 'der Wert steht einmal in den Tokens');
  const mapRules = base.split('\n').filter((line) => /^\.(node|path|station|state)/.test(line)).join('\n');
  assert.equal(/#[0-9a-fA-F]{3,6}\b/.test(mapRules), false, 'Lernpfad-CSS nutzt nur Tokens');
});
