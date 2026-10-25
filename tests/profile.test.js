import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelOf, lvlAt, addXP, touchStreak, streakNow, starsFor, multiplier, dailyXP, spendXP, GOAL, profileDefaults, appDefaults } from '../core/js/profile.js';

test('Niveaus beginnen bei 30·n·(n−1) XP', () => {
  assert.equal(lvlAt(2), 60);
  assert.equal(levelOf(0), 1);
  assert.equal(levelOf(59), 1);
  assert.equal(levelOf(60), 2);
  assert.equal(levelOf(180), 3);
});

test('addXP schreibt in Profil, App und Tagesziel und meldet Level-Up und Ziel', () => {
  const profile = profileDefaults(), app = appDefaults();
  const first = addXP(profile, app, 25, '2026-10-25');
  assert.deepEqual(first, { levelUp: null, goalHit: false });
  const second = addXP(profile, app, 40, '2026-10-25');
  assert.equal(second.levelUp, 2);
  assert.equal(second.goalHit, true);
  assert.equal(profile.xp, 65);
  assert.equal(app.xp, 65);
  assert.equal(dailyXP(profile, '2026-10-25'), 65);
  assert.equal(dailyXP(profile, '2026-10-26'), 0);
});

test('Tagesziel wird nur einmal pro Tag gemeldet', () => {
  const profile = profileDefaults(), app = appDefaults();
  assert.equal(addXP(profile, app, GOAL, '2026-10-25').goalHit, true);
  assert.equal(addXP(profile, app, 10, '2026-10-25').goalHit, false);
});

test('Streak: Folgetag zählt, ein ausgelassener Tag bleibt erhalten, danach Neustart', () => {
  const p = profileDefaults();
  touchStreak(p, '2026-10-20');
  touchStreak(p, '2026-10-21');
  assert.equal(p.streak, 2);
  touchStreak(p, '2026-10-21');
  assert.equal(p.streak, 2, 'derselbe Tag zählt nicht doppelt');
  touchStreak(p, '2026-10-23');
  assert.equal(p.streak, 3, 'Gnadentag');
  touchStreak(p, '2026-10-27');
  assert.equal(p.streak, 1, 'zu lange Pause');
  assert.equal(streakNow(p, '2026-10-28'), 1);
  assert.equal(streakNow(p, '2026-11-05'), 0);
});

test('Sterne und Combo-Faktor', () => {
  assert.equal(starsFor(1, false), 3);
  assert.equal(starsFor(0.9, false), 3);
  assert.equal(starsFor(0.7, false), 2);
  assert.equal(starsFor(0.2, false), 1);
  assert.equal(starsFor(1, true), 0);
  assert.deepEqual([0, 2, 3, 6, 9, 30].map(multiplier), [1, 1, 2, 3, 4, 4]);
});

test('spendXP macht XP nie negativ', () => {
  const profile = profileDefaults(), app = appDefaults();
  addXP(profile, app, 2, '2026-10-25');
  spendXP(profile, app, 3);
  assert.equal(profile.xp, 0);
  assert.equal(app.xp, 0);
});

import { isDue, weakestUnit, appDefaults as appDef, DUE_DAYS } from '../core/js/profile.js';
import { finalizeRound as finalize } from '../core/js/rounds.js';

test('Auffrischen: fällig nach DUE_DAYS Tagen, nur mit Sternen', () => {
  const app = { ...appDef(), stars: { a: 2, b: 0 }, last: { a: '2026-10-01', b: '2026-10-01' } };
  assert.equal(isDue(app, 'a', '2026-10-0' + (1 + DUE_DAYS)), true);
  assert.equal(isDue(app, 'a', '2026-10-02'), false);
  assert.equal(isDue(app, 'b', '2026-10-09'), false);
});

test('Gezieltes Training: fällige Seite zuerst, sonst schwächste', () => {
  const units = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const app = { ...appDef(), stars: { a: 1, b: 1, c: 3 }, last: { a: '2026-10-09', b: '2026-10-01' }, acc: { a: 0.5, b: 0.95, c: 0.4 } };
  assert.equal(weakestUnit(app, units, '2026-10-10').unit.id, 'b');
  assert.equal(weakestUnit(app, units, '2026-10-10').reason, 'Zeit zum Auffrischen');
  const app2 = { ...appDef(), stars: { a: 1, c: 3 }, last: { a: '2026-10-09' }, acc: { a: 0.5, c: 0.4 } };
  assert.equal(weakestUnit(app2, units, '2026-10-10').unit.id, 'a');
  assert.equal(weakestUnit(appDef(), units), null);
});

test('Runde beendet: merkt Tag und Genauigkeit, Auffrischen gibt 10 Bonus-XP', () => {
  const profile = { name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } };
  const app = { ...appDef(), stars: { a: 2 }, last: { a: '2026-10-01' } };
  const result = { mode: 'lesson', unit: { id: 'a' }, accuracy: 0.9, failed: false };
  finalize({ config: { id: 'x', badges: [] }, profile, app, result, day: '2026-10-10' });
  assert.equal(result.refresh, true);
  assert.equal(result.bonus, 10);
  assert.equal(app.xp, 10);
  assert.equal(app.last.a, '2026-10-10');
  assert.equal(app.acc.a, 0.9);
  const again = { mode: 'lesson', unit: { id: 'a' }, accuracy: 1, failed: false };
  finalize({ config: { id: 'x', badges: [] }, profile, app, result: again, day: '2026-10-10' });
  assert.equal(again.refresh, undefined);
});
