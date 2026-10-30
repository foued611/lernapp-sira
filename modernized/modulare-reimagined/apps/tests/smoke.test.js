// Smoke über alle Live-Apps aus seiten/registry.js: Inhalte laden, Logik verdrahten, jede Seite zeichnen,
// jede Rundenart starten. Ein Fehler in einer App fällt hier auf, bevor jemand die Seite öffnet (scripts/smoke.mjs in Legacy).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { buildConfig } from '../../inhalte/index.js';
import { createRng } from '../../helfer/index.js';
import { appDefaults, profileDefaults, startRound } from '../../seiten/ablauf.js';
import { TheoryScreen } from '../../seiten/rahmen.js';
import { APPS, LIVE } from '../../seiten/registry.js';
import { logicFor } from '../index.js';
import { paketVon } from './laden.js';

const h = createElement;
const live = APPS.filter((entry) => entry.status === LIVE);

for (const entry of live) {
  test(`SMOKE: ${entry.id} lädt, zeichnet jede Seite und startet alle Rundenarten`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    assert.ok(config.units.length > 0, 'keine Seiten');
    const alleSterne = { ...appDefaults(), stars: Object.fromEntries(config.units.map((u) => [u.id, 1])) };
    const profile = profileDefaults();

    for (const unit of config.units) {
      const html = renderToString(h(TheoryScreen, { config, unit, onBack: () => {}, onStart: () => {} }));
      assert.ok(html.includes(unit.title), `Seite ${unit.id} zeigt ihren Titel nicht`);

      const lektion = startRound({ config, mode: 'lesson', unit, app: alleSterne, profile, rng: createRng(unit.id.length) });
      assert.equal(lektion.ok, true, `${unit.id}: ${lektion.message}`);
      assert.equal(lektion.round.current().total, 8);
    }

    const schnell = startRound({ config, mode: 'quick', app: alleSterne, profile, rng: createRng(2) });
    assert.equal(schnell.ok, true, schnell.message);
    assert.equal(schnell.round.current().total, 5);

    if (config.rounds && typeof config.rounds.boss === 'function') {
      const boss = startRound({ config, mode: 'boss', app: alleSterne, profile, rng: createRng(3) });
      assert.equal(boss.ok, true, boss.message);
      assert.equal(boss.round.current().total, 12);
    }
  });
}

test('SMOKE: die Liste der Live-Apps hat mindestens fünf Einträge (deutsch, geometrie, mathe, info-zahlen, decouvertes-2)', () => {
  assert.ok(live.length >= 5, `nur ${live.length} Live-Apps`);
});
