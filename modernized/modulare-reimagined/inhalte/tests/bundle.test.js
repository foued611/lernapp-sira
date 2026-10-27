// RULE-143: Ein Paket wird als Ganzes angenommen oder abgelehnt. Kein Teil-Paket.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertBundle, bundleErrors } from '../index.js';
import { listPackages, readPackage, validBundle } from './helpers.js';

test('RULE-143: gültiges Paket wird unverändert zurückgegeben', () => {
  const bundle = validBundle();
  assert.equal(assertBundle(bundle), bundle);
});

test('RULE-143: jedes echte Paket aus legacy content/ wird als Ganzes angenommen', () => {
  for (const id of listPackages()) {
    assert.doesNotThrow(() => assertBundle(readPackage(id)), `Paket ${id}`);
  }
});

// Jede Zeile verändert genau eine Stelle. Ein einziger Fehler muss das ganze Paket ablehnen.
const mutations = [
  ['fehlende Lektion einer Seite', (b) => { delete b.lessons.weiter; }],
  ['fehlender Lektionsteil (check)', (b) => { delete b.lessons.start.check; }],
  ['figure ohne diagram und svg', (b) => { b.lessons.start.figure = { caption: 'x' }; }],
  ['doppelte Seiten-ID', (b) => { b.manifest.units[1].id = 'start'; }],
  ['ungültige Seiten-ID (Großbuchstaben)', (b) => { b.manifest.units[0].id = 'Start'; }],
  ['Seite ohne Karte', (b) => { delete b.manifest.units[0].card; }],
  ['Farbe ohne #RRGGBB', (b) => { b.manifest.units[0].color = 'blau'; }],
  ['Strang nicht in tracks definiert', (b) => { b.manifest.units[1].track = 'unbekannt'; }],
  ['Strang ohne label', (b) => { b.manifest.tracks.lrs = { desc: 'ohne Name' }; }],
  ['falsches schema (nicht 1)', (b) => { b.manifest.schema = 2; }],
  ['Titel fehlt', (b) => { b.manifest.title = ''; }],
  ['keine Seiten', (b) => { b.manifest.units = []; }],
  ['Trophäe mit unbekannter Seite', (b) => { b.badges[1].rule = { type: 'units', ids: ['start', 'nichtda'] }; }],
  ['Trophäe mit unbekanntem Regeltyp', (b) => { b.badges[0].rule = { type: 'magie' }; }],
  ['Blitz-Regel mit negativem maxWrong', (b) => { b.badges[0].rule = { type: 'blitz', min: 10, maxWrong: -1 }; }],
  ['improved mit unbekannter Seite', (b) => { b.badges[0].rule = { type: 'improved', unit: 'nichtda', by: 0.2 }; }],
  ['improved ohne by', (b) => { b.badges[0].rule = { type: 'improved', unit: 'start' }; }],
  ['retryRecovered ohne min', (b) => { b.badges[0].rule = { type: 'retryRecovered' }; }],
  ['refresh ohne count', (b) => { b.badges[0].rule = { type: 'refresh' }; }],
  ['Trophäen-ID doppelt', (b) => { b.badges[1].id = 'first'; }],
  ['keine Trophäen', (b) => { b.badges = []; }],
  ['Merkzettel nicht als Paare', (b) => { b.manifest.notes.start = ['nur ein Text']; }],
  ['data ist eine Liste', (b) => { b.data = []; }],
  ['Materiallink mit https', (b) => { b.manifest.resources[0].href = 'https://evil.example/x.pdf'; }]
];

for (const [name, mutate] of mutations) {
  test(`RULE-143: ein Fehler (${name}) lehnt das ganze Paket ab`, () => {
    const bundle = validBundle();
    mutate(bundle);
    assert.throws(() => assertBundle(bundle), /das ganze Paket wird abgelehnt/);
  });
}

test('RULE-143: die Regeln blitz mit maxWrong, improved, retryRecovered und refresh werden angenommen', () => {
  const bundle = validBundle();
  const rules = [
    { type: 'blitz', min: 10, maxWrong: 1 },
    { type: 'improved', unit: 'start', by: 0.2 },
    { type: 'retryRecovered', min: 2 },
    { type: 'refresh', count: 1 }
  ];
  bundle.badges = rules.map((rule, i) => ({ id: `neu${i}`, n: 'Neu', d: 'Neu', rule }));
  assert.deepEqual(bundleErrors(bundle), []);
});

test('RULE-143: alle Fehler werden gesammelt, nicht nur der erste', () => {
  const bundle = validBundle();
  delete bundle.lessons.start;
  delete bundle.lessons.weiter;
  bundle.manifest.title = '';
  const errors = bundleErrors(bundle);
  assert.ok(errors.length >= 3, `erwartet mindestens 3 Fehler, erhalten ${errors.length}`);
  try {
    assertBundle(bundle);
    assert.fail('muss werfen');
  } catch (error) {
    assert.deepEqual(error.errors, errors);
  }
});

test('RULE-143: fehlendes oder kaputtes Paket wird abgelehnt', () => {
  assert.deepEqual(bundleErrors(null), ['Inhaltspaket fehlt']);
  assert.deepEqual(bundleErrors('text'), ['Inhaltspaket fehlt']);
  assert.ok(bundleErrors({ lessons: {}, badges: [] }).includes('manifest fehlt'));
});

test('RULE-143: optionales data fehlt, ohne dass das Paket scheitert', () => {
  const bundle = validBundle();
  delete bundle.data;
  assert.doesNotThrow(() => assertBundle(bundle));
});
