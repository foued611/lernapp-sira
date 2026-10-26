// INHALTE-SCHEMA: jedes echte Paket aus legacy content/ besteht das JSON-Schema (ajv) und die Laufzeitprüfung.
// Das Schema wird aus der Legacy-App gelesen, nicht kopiert. Ajv ist eine Test-Abhängigkeit.
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import { assertBundle } from '../index.js';
import { SCHEMA_PATH, listPackages, readPackage, validBundle } from './helpers.js';

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
// strict: false, weil das Legacy-Schema bei figure.oneOf "diagram" in required nennt, ohne es in properties
// zu deklarieren. Strict-Modus (strictRequired) bricht daran ab. Das ist ein Befund am Schema, kein Fehler hier.
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);

test('INHALTE-SCHEMA: das Schema wird aus schemas/ im Projektstamm gelesen', () => {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.ok(listPackages().length >= 1, 'keine Pakete unter content/ gefunden');
});

for (const id of listPackages()) {
  test(`INHALTE-SCHEMA: Paket ${id} besteht das JSON-Schema`, () => {
    const bundle = readPackage(id);
    const ok = validate(bundle);
    assert.ok(ok, `${id}: ${JSON.stringify((validate.errors || []).slice(0, 5))}`);
  });

  test(`INHALTE-SCHEMA: Paket ${id} besteht die Laufzeitprüfung`, () => {
    assert.doesNotThrow(() => assertBundle(readPackage(id)));
  });
}

test('INHALTE-SCHEMA: das Schema lehnt einen https-Materiallink ab (Gegenprobe zur Laufzeitprüfung)', () => {
  const bundle = validBundle();
  bundle.manifest.resources[0].href = 'https://evil.example/x.pdf';
  assert.equal(validate(bundle), false);
});

test('INHALTE-SCHEMA: das Schema lehnt unbekannte Felder im Manifest ab', () => {
  const bundle = validBundle();
  bundle.manifest.unbekannt = true;
  assert.equal(validate(bundle), false);
});

test('INHALTE-SCHEMA: das Test-Paket aus dem Code besteht Schema und Laufzeitprüfung', () => {
  assert.equal(validate(validBundle()), true, JSON.stringify(validate.errors));
  assert.doesNotThrow(() => assertBundle(validBundle()));
});
