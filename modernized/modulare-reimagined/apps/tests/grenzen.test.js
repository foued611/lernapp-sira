// Grenzen der Fach-Apps: reine Logik ohne Browser, ohne globalen Zufall und ohne Abhängigkeit zwischen Apps (AGENTS.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const APPS = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = readdirSync(APPS, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== 'tests').map((e) => e.name);
const LOGIK = ['builders.js', 'logic.js', 'geom.js'];

for (const app of ORDNER) {
  for (const datei of LOGIK) {
    const pfad = join(APPS, app, datei);
    let text;
    try {
      text = readFileSync(pfad, 'utf8');
    } catch (error) {
      continue;
    }
    test(`APPS-GRENZEN: ${app}/${datei} nutzt keinen globalen Zufall, kein document und keine anderen Apps`, () => {
      assert.doesNotMatch(text, /Math\.random/, `${pfad} nutzt Math.random`);
      assert.doesNotMatch(text, /\bdocument\./, `${pfad} greift auf document zu`);
      for (const andere of ORDNER.filter((o) => o !== app)) {
        assert.doesNotMatch(text, new RegExp(`from\\s+['"][./]*apps/${andere}/`), `${pfad} importiert aus apps/${andere}`);
        assert.doesNotMatch(text, new RegExp(`from\\s+['"]\\.\\./${andere}/`), `${pfad} importiert aus ${andere}`);
      }
    });
  }
}

test('APPS-GRENZEN: jede App mit Logik hat eine logic.js mit Standardexport', async () => {
  for (const app of ORDNER) {
    const pfad = join(APPS, app, 'logic.js');
    let text;
    try {
      text = readFileSync(pfad, 'utf8');
    } catch (error) {
      continue;
    }
    assert.match(text, /export default/, `${pfad} hat keinen Standardexport`);
  }
  assert.ok(ORDNER.length >= 3, 'erwartet mindestens deutsch, geometrie und _template');
});
