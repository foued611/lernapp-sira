// Grenzen der Fach-Apps: ohne Browser-Zugriff und ohne globalen Zufall (AGENTS.md). Gilt für jede Datei einer App,
// auch in Unterordnern. Die Import-Richtung prüft seiten/tests/schichten.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const APPS = join(dirname(fileURLToPath(import.meta.url)), '..');

function quellen(ordner) {
  return readdirSync(ordner, { withFileTypes: true }).flatMap((eintrag) => {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) return eintrag.name === 'tests' ? [] : quellen(pfad);
    return eintrag.name.endsWith('.js') ? [pfad] : [];
  });
}

for (const pfad of quellen(APPS)) {
  test(`APPS-GRENZEN: ${relative(APPS, pfad)} nutzt keinen globalen Zufall und kein document`, () => {
    const text = readFileSync(pfad, 'utf8');
    assert.doesNotMatch(text, /Math\.random/, `${pfad} nutzt Math.random`);
    assert.doesNotMatch(text, /\bdocument\./, `${pfad} greift auf document zu`);
  });
}
