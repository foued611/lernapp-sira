// INHALTE-KONFIG: buildConfig macht aus Paket und Logik die App-Konfiguration. Reiner Teil, ohne Browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig, resolveFigure } from '../index.js';
import { diagramNames, listPackages, readPackage, validBundle } from './helpers.js';

/** Stubs für alle Diagrammnamen eines Pakets. Der Inhalt der Stubs ist hier egal, nur die Verdrahtung zählt. */
function stubDiagrams(bundle) {
  return Object.fromEntries(diagramNames(bundle.lessons).map((name) => [name, (...args) => `<svg data-stub="${name}" data-args="${args.length}"></svg>`]));
}

test('INHALTE-KONFIG: jedes echte Paket ergibt eine Konfiguration mit allen Seiten und Lektionen', () => {
  for (const id of listPackages()) {
    const bundle = readPackage(id);
    const config = buildConfig(bundle, { diagrams: stubDiagrams(bundle) });
    assert.equal(config.id, bundle.manifest.id, id);
    assert.equal(config.units.length, bundle.manifest.units.length, id);
    for (const unit of config.units) {
      assert.ok(config.lessons[unit.id], `${id}: Lektion fehlt für ${unit.id}`);
    }
  }
});

test('INHALTE-KONFIG: Diagrammverweise werden durch svg-Text ersetzt, Bildunterschrift bleibt', () => {
  const bundle = validBundle();
  const config = buildConfig(bundle, { diagrams: { probeDiagram: (...args) => `<svg data-n="${args.length}"></svg>` } });
  assert.equal(config.lessons.start.figure.svg, '<svg data-n="0"></svg>');
  assert.equal(config.lessons.start.figure.caption, 'Ein Bild');
});

test('INHALTE-KONFIG: fehlendes Diagramm bricht laut ab und nennt die Seite', () => {
  assert.throws(() => buildConfig(validBundle(), { diagrams: {} }), /Diagramm "probeDiagram" gibt es nicht \(start\)/);
});

test('INHALTE-KONFIG: resolveFigure lässt fertiges svg unverändert', () => {
  const figure = { svg: '<svg></svg>', caption: 'x' };
  assert.equal(resolveFigure(figure), figure);
});

test('INHALTE-KONFIG: init bekommt Daten und Manifest, bevor die Lektionen entstehen', () => {
  const bundle = validBundle();
  bundle.data = { fragen: [1] };
  const calls = [];
  buildConfig(bundle, {
    diagrams: { probeDiagram: () => { calls.push('diagram'); return '<svg></svg>'; } },
    init: (arg) => calls.push(['init', arg.data, arg.manifest.id])
  });
  assert.deepEqual(calls[0], ['init', { fragen: [1] }, 'probe-app']);
  assert.equal(calls[1], 'diagram');
});

test('INHALTE-KONFIG: ein ungültiges Paket ergibt keine Konfiguration', () => {
  const bundle = validBundle();
  delete bundle.manifest.title;
  assert.throws(() => buildConfig(bundle, { diagrams: {} }), /das ganze Paket wird abgelehnt/);
});

test('INHALTE-KONFIG: Trophäen werten über die injizierte Regel-Funktion aus', () => {
  const bundle = validBundle();
  const seen = [];
  const config = buildConfig(bundle, { diagrams: { probeDiagram: () => '<svg></svg>' } }, {
    evaluateRule: (rule, state, result, units) => { seen.push([rule.type, units.length]); return state.ok === true; }
  });
  const badge = config.badges.find((b) => b.id === 'both');
  assert.equal(badge.when({ ok: true }, {}), true);
  assert.equal(badge.when({ ok: false }, {}), false);
  assert.deepEqual(seen[0], ['units', 2]);
});

test('INHALTE-KONFIG: ohne injizierte Regel-Funktion meldet die Auswertung den Fehler', () => {
  const config = buildConfig(validBundle(), { diagrams: { probeDiagram: () => '<svg></svg>' } });
  assert.throws(() => config.badges[0].when({}, {}), /evaluateRule fehlt/);
});

test('INHALTE-KONFIG: Theorie nutzt logic.theory vor der injizierten Standard-Theorie', () => {
  const calls = [];
  const logic = { diagrams: { probeDiagram: () => '<svg></svg>' }, theory: (box, unit) => calls.push(['logic', unit.id, box]) };
  const config = buildConfig(validBundle(), logic, { renderDefaultTheory: () => calls.push(['default']) });
  config.theory('box', { id: 'start' }, {});
  assert.deepEqual(calls, [['logic', 'start', 'box']]);
});

test('INHALTE-KONFIG: ohne Theorie-Ansicht meldet der Aufruf den Fehler', () => {
  const config = buildConfig(validBundle(), { diagrams: { probeDiagram: () => '<svg></svg>' } });
  assert.throws(() => config.theory('box', { id: 'start' }, {}), /renderDefaultTheory wurde nicht injiziert/);
});
