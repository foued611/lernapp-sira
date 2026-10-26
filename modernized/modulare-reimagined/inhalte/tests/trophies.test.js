// INHALTE-TROPHAE: Regression. Trophäen-Regeln bekommen die Seiten-IDs (Strings), nicht die Seiten-Objekte.
// Vorher gab appconfig.js manifest.units weiter, die Auswertung in regeln/ erwartet IDs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig } from '../index.js';
import { validBundle } from './helpers.js';

test('INHALTE-TROPHAE: anyUnit bekommt die beiden Seiten-IDs als Strings und ist mit einem Stern true', () => {
  const received = [];
  // Stub mit der Semantik von anyUnit: mindestens eine der übergebenen Seiten hat einen Stern.
  const evaluateRule = (rule, state, result, units) => {
    received.push({ type: rule.type, units });
    return units.some((id) => (state.app.stars[id] || 0) >= 1);
  };
  const logic = { diagrams: { probeDiagram: () => '<svg></svg>' } };
  const config = buildConfig(validBundle(), logic, { evaluateRule });

  const badge = config.badges.find((b) => b.id === 'first');
  assert.equal(badge.rule.type, 'anyUnit');

  const state = { app: { stars: { weiter: 1 } } };
  assert.equal(badge.when(state, {}), true);

  assert.equal(received.length, 1);
  assert.deepEqual(received[0].units, ['start', 'weiter']);
  assert.ok(received[0].units.every((id) => typeof id === 'string'), 'jede Seite ist eine ID (String)');
});
