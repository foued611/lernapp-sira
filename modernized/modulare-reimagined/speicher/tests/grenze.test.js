// Grenze: nur speicher/ greift auf IndexedDB oder localStorage zu (CLAUDE.md, AGENTS.md). Der Test liest den Code
// der anderen Ordner als Text. Kommentare zählen nicht, weil sie den Zugriff nur beschreiben.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const OUTSIDE = ['regeln', 'helfer', 'runde', 'inhalte', 'komponenten', 'seiten', 'apps'];
const ZUGRIFF = /\b(indexedDB|localStorage)\b/;

// Entfernt Blockkommentare und Zeilenkommentare. Strings mit "//" kommen im Code selten vor und stören hier nicht.
export const ohneKommentare = (text) => text
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:\\])\/\/.*$/gm, '$1');

export function dateienIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) return dateienIn(pfad);
    const testOrdner = pfad.split('/').includes('tests');
    return name.endsWith('.js') && !name.endsWith('.test.js') && !testOrdner ? [pfad] : [];
  });
}

export function zugriffe(dateien) {
  return dateien.flatMap((pfad) => {
    const zeilen = ohneKommentare(readFileSync(pfad, 'utf8')).split('\n');
    return zeilen
      .map((zeile, i) => ({ zeile, i }))
      .filter(({ zeile }) => ZUGRIFF.test(zeile))
      .map(({ i }) => `${relative(ROOT, pfad)}:${i + 1}`);
  });
}

test('SPEICHER-GRENZE Außerhalb von speicher/ gibt es keinen Zugriff auf IndexedDB oder localStorage', () => {
  const dateien = OUTSIDE.flatMap((ordner) => dateienIn(join(ROOT, ordner)));
  assert.ok(dateien.length > 50, 'es werden Dateien gelesen');
  assert.deepEqual(zugriffe(dateien), [], 'diese Stellen greifen direkt auf den Speicher zu');
});

test('SPEICHER-GRENZE Die Prüfung erkennt einen Zugriff und ignoriert einen Kommentar darüber', () => {
  assert.deepEqual(zugriffe([]), []);
  const text = '// localStorage wird hier nur erwähnt\nconst a = window.localStorage.getItem("x");\n/* indexedDB */';
  const treffer = ohneKommentare(text).split('\n').filter((zeile) => ZUGRIFF.test(zeile));
  assert.equal(treffer.length, 1);
});
