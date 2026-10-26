// Prüft alle Inhaltspakete in content/ gegen das JSON-Schema (Ajv) und gegen die Querverweise, die ein Schema nicht kennt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { diskSource } from './helpers.js';
import { ruleErrors } from '../core/js/rules.js';
import { bundleErrors } from '../core/js/validate.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = JSON.parse(await readFile(root + 'schemas/bundle.schema.json', 'utf8'));
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
const ids = (await readdir(root + 'content', { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name);

test('jeder Ordner in content/ gehört zu einer App der Registry oder zur Vorlage', async () => {
  const { APPS } = await import('../registry.js');
  const known = new Set([...APPS.map((a) => a.id), 'vorlage']);
  ids.forEach((id) => assert.ok(known.has(id), `content/${id} gehört zu keiner App`));
  APPS.filter((a) => a.status === 'live').forEach((a) => assert.ok(ids.includes(a.id), `content/${a.id} fehlt`));
});

for (const id of ids) {
  test(`Schema und Querverweise: ${id}`, async () => {
    const bundle = await diskSource().load(id);
    assert.ok(validate(bundle), JSON.stringify(validate.errors, null, 1).slice(0, 1500));
    assert.equal(bundle.manifest.id, id, 'manifest.id muss dem Ordnernamen entsprechen');
    const unitIds = bundle.manifest.units.map((u) => u.id);
    assert.equal(new Set(unitIds).size, unitIds.length, 'Seiten-IDs eindeutig');
    assert.deepEqual(Object.keys(bundle.lessons).sort(), [...unitIds].sort(), 'jede Seite hat genau eine Lektion');
    Object.keys(bundle.manifest.notes || {}).forEach((u) => assert.ok(unitIds.includes(u), `Merkzettel für unbekannte Seite ${u}`));
    assert.equal(new Set(bundle.badges.map((b) => b.id)).size, bundle.badges.length, 'Trophäen-IDs eindeutig');
    bundle.badges.forEach((b) => assert.deepEqual(ruleErrors(b.rule, unitIds, b.id), []));
    Object.entries(bundle.lessons).forEach(([unit, l]) => assert.ok(l.check.options.some((o) => o.id === l.check.answer), `${unit}: Antwort des Mini-Checks fehlt in den Optionen`));
  });
}

test('Schema lehnt kaputte Pakete ab', async () => {
  const good = await diskSource().load('vorlage');
  const bad = (edit) => { const copy = structuredClone(good); edit(copy); return validate(copy); };
  assert.ok(!bad((b) => { delete b.manifest.title; }), 'Titel fehlt');
  assert.ok(!bad((b) => { b.manifest.units[0].color = 'rot'; }), 'Farbe ungültig');
  assert.ok(!bad((b) => { delete b.lessons.start.figure.diagram; }), 'Bild fehlt');
  assert.ok(!bad((b) => { b.badges[0].rule = { type: 'zauberei' }; }), 'Regeltyp unbekannt');
  assert.ok(!bad((b) => { b.lessons.start.tldr = ['nur einer']; }), 'zu wenige Kernsätze');
  assert.ok(!bad((b) => { b.manifest.schema = 2; }), 'Schemaversion');
  assert.ok(bad((b) => { b.manifest.resources = [{ title: 'Blatt', href: 'files/blatt.pdf' }]; }), 'relativer Pfad ist erlaubt');
  for (const href of ['javascript:alert(1)', 'https://example.org/x.pdf', '/x.pdf', '../x.pdf', 'files/a b.pdf']) {
    assert.ok(!bad((b) => { b.manifest.resources = [{ title: 'Blatt', href }]; }), `Schema lehnt href ab: ${href}`);
    const copy = structuredClone(good);
    copy.manifest.resources = [{ title: 'Blatt', href }];
    assert.ok(bundleErrors(copy).length > 0, `Laufzeitprüfung lehnt href ab: ${href}`);
  }
});

test('Strang-Verweise: unbekannter Strang wird gemeldet', async () => {
  const { bundleErrors } = await import('../core/js/validate.js');
  const b = structuredClone(await diskSource().load('deutsch'));
  assert.deepEqual(bundleErrors(b), []);
  b.manifest.units[0].track = 'xyz';
  assert.ok(bundleErrors(b).some((e) => e.includes('xyz')));
});
