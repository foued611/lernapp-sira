// RULE-206 über alle Live-Apps: Der Endgegner ist frei, wenn jede Seite mindestens einen Stern hat. Die Apps haben
// keine eigene Freischaltung (Legacy hat keine), deshalb gilt die Regel aus seiten/rahmen.js für alle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig } from '../../inhalte/index.js';
import { bossOpen, profileDefaults } from '../../seiten/rahmen.js';
import { APPS, LIVE } from '../../seiten/registry.js';
import { logicFor } from '../index.js';
import { paketVon } from './laden.js';

for (const entry of APPS.filter((e) => e.status === LIVE)) {
  test(`RULE-206: ${entry.id} öffnet den Endgegner erst, wenn jede Seite einen Stern hat`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    const ids = config.units.map((u) => u.id);
    const profile = profileDefaults();
    const alle = { stars: Object.fromEntries(ids.map((id) => [id, 1])) };
    const eineFehlt = { stars: Object.fromEntries(ids.slice(1).map((id) => [id, 3])) };
    assert.equal(bossOpen({ app: alle, unitIds: ids, bossUnlocked: config.bossUnlocked, profile }), true);
    assert.equal(bossOpen({ app: eineFehlt, unitIds: ids, bossUnlocked: config.bossUnlocked, profile }), false);
  });
}
