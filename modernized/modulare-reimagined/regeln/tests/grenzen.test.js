// Phase-1-Grenzen: reine Logik ohne Oberfläche, ohne Speicher und ohne globalen Zufall.
// Der Test liest die Quelldateien als Text, damit er ohne Browser läuft.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Diese Muster dürfen in den Phase-1-Diensten nicht vorkommen (Brief §3, Architektur "Abhängigkeitsregeln").
const verboten = [
  /from\s+['"]react/,
  /from\s+['"]\.\.\/\.\.\/(speicher|components|pages|apps)/,
  /\bdocument\./,
  /\bindexedDB\b/,
  /\blocalStorage\b/,
  /\bMath\.random\b/,
];

// Quelldateien eines Dienstes, ohne tests/-Ordner.
function quelldateien(ordner) {
  const treffer = [];
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) {
      if (eintrag.name !== 'tests') treffer.push(...quelldateien(pfad));
    } else if (eintrag.name.endsWith('.js')) {
      treffer.push(pfad);
    }
  }
  return treffer;
}

for (const dienst of ['regeln', 'helfer']) {
  test(`PHASE1-GRENZEN: ${dienst} nutzt keine Oberfläche, keinen Speicher und keinen globalen Zufall`, () => {
    for (const datei of quelldateien(join(wurzel, dienst))) {
      const text = readFileSync(datei, 'utf8');
      for (const muster of verboten) {
        assert.doesNotMatch(text, muster, `${datei} verletzt ${muster}`);
      }
    }
  });
}

test('PHASE1-GRENZEN: regeln und helfer laden ohne document', async () => {
  await import(pathToFileURL(join(wurzel, 'regeln', 'index.js')).href);
  await import(pathToFileURL(join(wurzel, 'helfer', 'index.js')).href);
  assert.equal(typeof globalThis.document, 'undefined');
});
