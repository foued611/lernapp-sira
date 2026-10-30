// Der Katalog entsteht aus den Manifesten. Hier stimmt er mit der Logik und den Inhalten überein, sonst fehlt eine Kachel
// oder eine Kachel führt ins Leere.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalog } from '../../inhalte/index.js';
import { LIVE, validateRegistry } from '../../seiten/registry.js';
import { logicIds } from '../index.js';
import { APPS, paketVon } from './laden.js';

test('KATALOG: ist gültig und hat jede App genau einmal', () => {
  assert.deepEqual(validateRegistry(APPS), []);
});

test('KATALOG: jede App mit Logik steht im Katalog und umgekehrt', () => {
  const live = APPS.filter((e) => e.status === LIVE).map((e) => e.id).sort();
  assert.deepEqual(live, [...logicIds()].sort());
});

test('KATALOG: Seiten stimmen mit dem Manifest überein', () => {
  for (const entry of APPS) {
    const { manifest } = paketVon(entry.id);
    assert.deepEqual(entry.units.map((u) => u.id), manifest.units.map((u) => u.id), `${entry.id}: Seiten`);
  }
});

test('KATALOG: jede Live-App gliedert ihre Seiten in Kapitel', () => {
  for (const entry of APPS.filter((e) => e.status === LIVE)) {
    const { manifest } = paketVon(entry.id);
    assert.ok(manifest.groups?.length >= 2, `${entry.id}: Kapitel fehlen`);
    assert.deepEqual(manifest.units.filter((u) => !u.group).map((u) => u.id), [], `${entry.id}: Seiten ohne Kapitel`);
  }
});

test('KATALOG: die Reihenfolge kommt aus order, Pakete ohne catalog fehlen', () => {
  const a = { id: 'a', title: 'A', units: [], catalog: { subject: 'S', desc: 'D', order: 2 } };
  const b = { id: 'b', title: 'B', units: [], catalog: { subject: 'S', desc: 'D', order: 1 } };
  const ohne = { id: 'vorlage', title: 'V', units: [] };
  assert.deepEqual(buildCatalog([a, ohne, b]).map((e) => e.id), ['b', 'a']);
});

test('KATALOG: Seiten im Katalog tragen nur, was Kachel und Suche brauchen', () => {
  for (const entry of APPS) {
    for (const unit of entry.units) assert.deepEqual(Object.keys(unit).sort(), ['chapter', 'de', 'id', 'title']);
  }
  assert.equal(buildCatalog([{ id: 'a', title: 'A', catalog: { subject: 'S', desc: 'D', order: 1 }, units: [] }])[0].status, 'live');
});
