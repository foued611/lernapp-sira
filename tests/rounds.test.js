import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finalizeRound } from '../core/js/rounds.js';
import { profileDefaults, appDefaults } from '../core/js/profile.js';
import { BADGES } from '../apps/franzoesisch-verben/badges.js';
import { UNITS } from '../apps/franzoesisch-verben/data.js';

const config = { id: 'fr-verben', badges: BADGES };
const unit = (id) => UNITS.find((u) => u.id === id);
const lesson = (id, extra = {}) => ({ mode: 'lesson', unit: unit(id), failed: false, accuracy: 1, correct: 8, almost: 0, wrong: 0, bestCombo: 8, xp: 100, ...extra });

function run(result, state = {}) {
  const profile = Object.assign(profileDefaults(), state.profile);
  const app = Object.assign(appDefaults(), state.app);
  finalizeRound({ config, profile, app, result, day: '2026-10-25' });
  return { profile, app, result };
}

test('Erfolgreiche Runde vergibt Sterne, Bestwert und erste Trophäen', () => {
  const { app, result } = run(lesson('etre'));
  assert.equal(result.stars, 3);
  assert.equal(app.stars.etre, 3);
  const ids = result.newBadges.map((b) => b.id);
  for (const id of ['first', 'etre3', 'perfect', 'combo5']) assert.ok(ids.includes(id), id);
  assert.ok(app.badges.first);
});

test('Ein schlechteres Ergebnis überschreibt keine bessere Wertung', () => {
  const { app } = run(lesson('etre', { accuracy: 0.5 }), { app: { stars: { etre: 3 } } });
  assert.equal(app.stars.etre, 3);
});

test('Gescheiterte Runde: 0 Sterne, kein Fortschritt, keine perfect-Trophäe', () => {
  const { app, result } = run(lesson('aller', { failed: true, accuracy: 0.4, wrong: 5, correct: 2 }));
  assert.equal(result.stars, 0);
  assert.equal(app.stars.aller, undefined);
  assert.ok(!result.newBadges.some((b) => b.id === 'perfect'));
});

test('"Les Quatre" und "Endungs-Ass" nach den jeweiligen Seiten', () => {
  const four = run(lesson('faire'), { app: { stars: { etre: 1, avoir: 1, aller: 1 } } });
  assert.ok(four.result.newBadges.some((b) => b.id === 'four'));
  const regs = run(lesson('irre'), { app: { stars: { er: 1 } } });
  assert.ok(regs.result.newBadges.some((b) => b.id === 'regs'));
});

test('Boss gewonnen: 50 Bonus-XP und Trophäe, verloren: nichts', () => {
  const won = run({ mode: 'boss', failed: false, accuracy: 0.9, correct: 11, almost: 0, wrong: 1, bestCombo: 6, xp: 80 });
  assert.equal(won.result.bonus, 50);
  assert.equal(won.profile.xp, 50);
  assert.ok(won.result.newBadges.some((b) => b.id === 'boss'));
  const lost = run({ mode: 'boss', failed: true, accuracy: 0.3, correct: 3, almost: 0, wrong: 3, bestCombo: 2, xp: 20 });
  assert.equal(lost.result.bonus, 0);
  assert.ok(!lost.result.newBadges.some((b) => b.id === 'boss'));
});

test('Blitz: Bestwert wird nur verbessert, Trophäe ab 10', () => {
  const a = run({ mode: 'blitz', score: 12, xp: 60, bestCombo: 4 }, { app: { best: { blitz: 8 } } });
  assert.equal(a.app.best.blitz, 12);
  assert.ok(a.result.newBadges.some((b) => b.id === 'blitz10'));
  const b = run({ mode: 'blitz', score: 5, xp: 20, bestCombo: 1 }, { app: { best: { blitz: 8 } } });
  assert.equal(b.app.best.blitz, 8);
  assert.ok(!b.result.newBadges.some((x) => x.id === 'blitz10'));
});

test('Streak-Trophäe nach drei Tagen, Profil merkt sich die zuletzt genutzte App', () => {
  const { profile, result } = run(lesson('etre'), { profile: { streak: 2, lastDay: '2026-10-24' } });
  assert.equal(profile.streak, 3);
  assert.equal(profile.lastApp, 'fr-verben');
  assert.ok(result.newBadges.some((b) => b.id === 'streak3'));
});

test('Bereits erhaltene Trophäen werden nicht doppelt vergeben', () => {
  const { result } = run(lesson('etre'), { app: { badges: { first: true, perfect: true } } });
  const ids = result.newBadges.map((b) => b.id);
  assert.ok(!ids.includes('first') && !ids.includes('perfect'));
});

test('Trophäen-IDs sind eindeutig', () => {
  assert.equal(new Set(BADGES.map((b) => b.id)).size, BADGES.length);
});
