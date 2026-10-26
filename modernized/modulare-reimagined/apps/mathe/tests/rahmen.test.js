// RULE-206: Endgegner freigeschaltet, wenn alle Seiten mindestens einen Stern haben. Die Mathe-Werkstatt hat keine
// eigene Freischaltung (Legacy hat keine), deshalb gilt der Standard der Rahmenfunktion bossOpen aus seiten/rahmen.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bossOpen, profileDefaults } from '../../../seiten/rahmen.js';
import logic from '../logic.js';
import { paketVon } from '../../tests/laden.js';

const UNIT_IDS = paketVon('mathe').manifest.units.map((u) => u.id);

test('RULE-206: ohne eigene Regel ist der Endgegner frei, wenn jede Seite einen Stern hat', () => {
  assert.equal(logic.bossUnlocked, undefined, 'die Mathe-App hat eine eigene Regel, der Test muss angepasst werden');
  const alle = { stars: Object.fromEntries(UNIT_IDS.map((id) => [id, 1])) };
  const fast = { stars: Object.fromEntries(UNIT_IDS.slice(1).map((id) => [id, 2])) };
  assert.equal(bossOpen({ app: alle, unitIds: UNIT_IDS, bossUnlocked: logic.bossUnlocked, profile: profileDefaults() }), true);
  assert.equal(bossOpen({ app: fast, unitIds: UNIT_IDS, bossUnlocked: logic.bossUnlocked, profile: profileDefaults() }), false);
  assert.equal(bossOpen({ app: { stars: {} }, unitIds: UNIT_IDS, bossUnlocked: logic.bossUnlocked, profile: profileDefaults() }), false);
});
