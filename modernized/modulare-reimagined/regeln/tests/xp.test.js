// Tests für Level, XP-Gutschrift, Tagesziel, Combo und XP-Abzug.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { awardXP, comboMultiplier, dailyGoal, dailyXP, levelOf, levelThreshold, setDailyGoal, spendXP } from '../src/xp.js';

const newProfile = () => ({ xp: 0, day: { d: '', xp: 0 }, streak: 0, lastDay: '', lastApp: '' });
const newApp = () => ({ xp: 0 });

test('RULE-061: Niveau n beginnt bei 30·n·(n−1) XP', () => {
  assert.equal(levelThreshold(2), 60);
  assert.equal(levelThreshold(3), 180);
  assert.equal(levelThreshold(4), 360);
});

test('RULE-061: Niveau 1 gilt ab 0 XP, ein Grenzwert gehört zum höheren Niveau', () => {
  assert.equal(levelOf(0), 1);
  assert.equal(levelOf(59), 1);
  assert.equal(levelOf(60), 2);
  assert.equal(levelOf(179), 2);
  assert.equal(levelOf(180), 3);
});

test('RULE-062: 25 XP, dann 40 XP am selben Tag melden Niveau 2 und das Tagesziel', () => {
  const profile = newProfile();
  const app = newApp();
  assert.deepEqual(awardXP(profile, app, 25, '2026-10-25'), { levelUp: null, goalHit: false });
  assert.deepEqual(awardXP(profile, app, 40, '2026-10-25'), { levelUp: 2, goalHit: true });
  assert.equal(profile.xp, 65);
  assert.equal(app.xp, 65);
  assert.equal(profile.day.xp, 65);
  assert.equal(dailyXP(profile, '2026-10-26'), 0);
});

test('RULE-062: Das Tagesziel wird nur einmal gemeldet, auch bei weiteren Gutschriften', () => {
  const profile = newProfile();
  const app = newApp();
  awardXP(profile, app, 30, '2026-10-25');
  assert.equal(awardXP(profile, app, 5, '2026-10-25').goalHit, false);
});

test('RULE-062: Gestrige XP zählen nicht zum Tagesziel von heute', () => {
  const profile = newProfile();
  const app = newApp();
  awardXP(profile, app, 20, '2026-10-25');
  const result = awardXP(profile, app, 15, '2026-10-26');
  assert.equal(result.goalHit, false);
  assert.equal(profile.day.xp, 15);
});

test('RULE-062: Ein Sprung über mehrere Niveaus meldet das erreichte Niveau', () => {
  const profile = newProfile();
  assert.equal(awardXP(profile, newApp(), 200, '2026-10-25').levelUp, 3);
});

test('RULE-063: Combo 0 bis 2 ergibt ×1, 3 bis 5 ergibt ×2', () => {
  for (const combo of [0, 1, 2]) assert.equal(comboMultiplier(combo), 1, `combo ${combo}`);
  for (const combo of [3, 4, 5]) assert.equal(comboMultiplier(combo), 2, `combo ${combo}`);
});

test('RULE-063: Der Faktor steigt in Dreierschritten und ist bei ×4 gedeckelt', () => {
  assert.equal(comboMultiplier(6), 3);
  assert.equal(comboMultiplier(7), 3);
  assert.equal(comboMultiplier(8), 3);
  assert.equal(comboMultiplier(9), 4);
  assert.equal(comboMultiplier(30), 4);
});

test('RULE-172: Abzug von 3 XP bei 2 XP ergibt 0 in Profil und App', () => {
  const profile = { xp: 2 };
  const app = { xp: 2 };
  spendXP(profile, app, 3);
  assert.equal(profile.xp, 0);
  assert.equal(app.xp, 0);
});

test('RULE-172: Abzug aus einem größeren Stand lässt den Rest stehen', () => {
  const profile = { xp: 10 };
  const app = { xp: 10 };
  spendXP(profile, app, 3);
  assert.equal(profile.xp, 7);
  assert.equal(app.xp, 7);
});

test('Standard ist 30 XP ohne gesetztes Ziel', () => {
  assert.equal(dailyGoal({ xp: 0 }), 30);
});

test('gesetztes Ziel wird genutzt', () => {
  assert.equal(dailyGoal({ xp: 0, goal: 50 }), 50);
});

test('unbekannter Wert fällt auf 30 zurück', () => {
  assert.equal(dailyGoal({ xp: 0, goal: 42 }), 30);
});

test('setDailyGoal wirft bei unbekanntem Wert', () => {
  assert.throws(() => setDailyGoal({ xp: 0 }, 42), RangeError);
});

test('setDailyGoal schreibt einen erlaubten Wert ins Profil', () => {
  const profile = newProfile();
  setDailyGoal(profile, 50);
  assert.equal(profile.goal, 50);
});

test('setDailyGoal lässt das Profil bei unbekanntem Wert unverändert', () => {
  const profile = { ...newProfile(), goal: 20 };
  assert.throws(() => setDailyGoal(profile, 42), RangeError);
  assert.equal(profile.goal, 20);
});

test('awardXP meldet das Tagesziel nach dem gewählten Wert, nicht nach 30', () => {
  const profile = { ...newProfile(), goal: 20 };
  assert.equal(awardXP(profile, newApp(), 20, '2026-10-25').goalHit, true);
  const high = { ...newProfile(), goal: 50 };
  assert.equal(awardXP(high, newApp(), 40, '2026-10-25').goalHit, false);
  assert.equal(awardXP(high, newApp(), 10, '2026-10-25').goalHit, true);
});
