// Tests für die tägliche Serie: Folgetag, Gnadentag, Neustart nach einer Pause und Verfall.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak, updateStreak } from '../src/streak.js';
import { dayDiff } from '../src/dates.js';

// Abläufe aus dem Verhaltensvertrag: Serie startet am 20.10.2026.
const newProfile = () => ({ streak: 1, lastDay: '2026-10-20', lastApp: '' });

test('RULE-208: Die Serie wächst um eins am Folgetag', () => {
  const profile = newProfile();
  updateStreak(profile, '2026-10-21');
  assert.equal(profile.streak, 2);
});

test('RULE-208: Zweimal am selben Tag zählt einmal', () => {
  const profile = newProfile();
  updateStreak(profile, '2026-10-21');
  updateStreak(profile, '2026-10-21');
  assert.equal(profile.streak, 2);
});

test('RULE-208: Ein ausgelassener Tag (Gnadentag) lässt die Serie weiterlaufen', () => {
  const profile = newProfile();
  updateStreak(profile, '2026-10-21');
  updateStreak(profile, '2026-10-23');
  assert.equal(profile.streak, 3);
});

test('RULE-208: Nach vier Tagen Pause beginnt die Serie wieder bei 1', () => {
  const profile = newProfile();
  updateStreak(profile, '2026-10-21');
  updateStreak(profile, '2026-10-23');
  updateStreak(profile, '2026-10-27');
  assert.equal(profile.streak, 1);
  assert.equal(profile.lastDay, '2026-10-27');
});

test('RULE-208: currentStreak bleibt bis zum Gnadentag bestehen und verfällt danach auf 0', () => {
  const profile = { streak: 1, lastDay: '2026-10-27', lastApp: '' };
  assert.equal(currentStreak(profile, '2026-10-28'), 1);
  assert.equal(currentStreak(profile, '2026-10-29'), 1);
  assert.equal(currentStreak(profile, '2026-11-05'), 0);
});

test('RULE-208: Ohne vorherige Übung startet die Serie bei 1', () => {
  const profile = { streak: 0, lastDay: '', lastApp: '' };
  updateStreak(profile, '2026-10-25');
  assert.equal(profile.streak, 1);
  assert.equal(currentStreak({ streak: 0, lastDay: '', lastApp: '' }, '2026-10-25'), 0);
});

test('RULE-208: Die Tageszählung stimmt über die Sommerzeitumstellung', () => {
  // 29. März 2026 ist der Tag der Umstellung in Deutschland. Der Abstand bleibt genau ein Tag.
  assert.equal(dayDiff('2026-03-28', '2026-03-29'), 1);
  assert.equal(dayDiff('2026-03-28', '2026-03-30'), 2);
});
