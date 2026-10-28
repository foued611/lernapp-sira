// Übernahme des Cahier de Verbes in die Französisch-Werkstatt: XP addieren, Sterne und Bestwerte nehmen den höheren Wert,
// Trophäen mit gleicher Kennung und anderer Regel werden umbenannt, und ein leerer alter Stand ändert nichts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appDefaults } from '../rahmen.js';
import { hasProgress, mergeAppState, UEBERNAHMEN } from '../uebernahme.js';

const old = { ...appDefaults(), refreshes: 2, xp: 40, stars: { etre: 2, avoir: 1 }, best: { etre: 0.8 }, badges: { first: true, 'besser-geworden': true } };
const neu = { ...appDefaults(), xp: 10, stars: { etre: 1, quel: 3 }, best: { etre: 0.5 }, badges: { first: true } };

test('RULE-256 Übernahme: XP werden addiert, Sterne und Bestwerte nehmen den höheren Wert', () => {
  const merged = mergeAppState(neu, old, { fromId: 'fr-verben' });
  assert.equal(merged.xp, 50);
  assert.equal(merged.refreshes, 2);
  assert.deepEqual(merged.stars, { etre: 2, quel: 3, avoir: 1 });
  assert.equal(merged.best.etre, 0.8);
});

test('RULE-256 Übernahme: Trophäen mit umbenannter Kennung landen unter der neuen Kennung', () => {
  const [rule] = UEBERNAHMEN;
  const merged = mergeAppState(neu, old, { badgeRenames: rule.badgeRenames, fromId: rule.from });
  assert.equal(merged.badges['besser-geworden-verben'], true);
  assert.equal(Object.hasOwn(merged.badges, 'besser-geworden'), false, 'die Kennung der anderen Seite darf nicht übernommen werden');
  assert.equal(merged.badges.first, true);
});

test('RULE-256 Übernahme: der Stand wird als erledigt markiert, die Eingaben bleiben unverändert', () => {
  const before = JSON.stringify(neu);
  const merged = mergeAppState(neu, old, { fromId: 'fr-verben' });
  assert.equal(merged.merged['fr-verben'], true);
  assert.equal(JSON.stringify(neu), before);
});

test('RULE-256 Übernahme: ein leerer alter Stand gilt als nichts zu übernehmen', () => {
  assert.equal(hasProgress(appDefaults()), false);
  assert.equal(hasProgress(old), true);
  assert.equal(hasProgress(null), false);
});
