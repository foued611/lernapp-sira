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
