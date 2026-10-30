// RULE-206 über alle Live-Apps: Der Endgegner ist frei, wenn jede Seite mindestens einen Stern hat. Die Apps haben
// keine eigene Freischaltung (Legacy hat keine), deshalb gilt die Regel aus seiten/rahmen.js für alle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig } from '../../inhalte/index.js';
import { createRng } from '../../helfer/index.js';
import { bossOpen, profileDefaults } from '../../seiten/ablauf.js';
import { LIVE } from '../../seiten/registry.js';
import { APPS, logicFor, paketVon } from './laden.js';

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

// Zu welcher Seite gehört eine Frage? Die Erklärung (why) steht je Aufgabe im Inhalt.
const seiteVon = (items) => new Map(Object.entries(items).flatMap(([unit, list]) => list.map((item) => [item.why, unit])));

for (const entry of APPS.filter((e) => e.status === LIVE && paketVon(e.id).data.items)) {
  test(`ENDGEGNER: ${entry.id} fragt über mehrere Runden jede Seite ab`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    const items = paketVon(entry.id).data.items;
    const seiten = seiteVon(items);
    const getroffen = new Set();
    for (let seed = 1; seed <= 300; seed++) {
      for (const frage of config.rounds.boss(createRng(seed))) getroffen.add(seiten.get(frage.why));
    }
    assert.deepEqual(Object.keys(items).filter((unit) => !getroffen.has(unit)), []);
  });
}
