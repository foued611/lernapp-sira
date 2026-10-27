// Tests für die Wochenmissionen: Zählen, Wochenwechsel am Montag, Grenze 90 %, jede Mission nur einmal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS, missionProgress, recordMission } from '../src/missions.js';

// 2026-10-26 ist ein Montag, 2026-10-25 der Sonntag davor.
const MONDAY = '2026-10-26';
const SUNDAY_BEFORE = '2026-10-25';
const profileOf = (week) => ({ xp: 0, ...(week ? { week } : {}) });
const freshWeek = (extra = {}) => ({ start: '2026-10-19', units: [], refreshes: 0, strong: 0, done: [], ...extra });
const event = (extra = {}) => ({ unit: null, refreshed: false, accuracy: 0.5, ...extra });

test('MISSIONS: drei feste Missionen mit stabilen IDs', () => {
  assert.deepEqual(MISSIONS.map((m) => [m.id, m.need]), [['units3', 3], ['refresh1', 1], ['strong90', 1]]);
  assert.ok(Object.isFrozen(MISSIONS));
});

test('missionProgress: ohne Wochenblock steht alles auf null und nichts ist erledigt', () => {
  const progress = missionProgress(profileOf(), MONDAY);
  assert.deepEqual(progress.map((m) => [m.id, m.count, m.need, m.done]), [
    ['units3', 0, 3, false], ['refresh1', 0, 1, false], ['strong90', 0, 1, false]
  ]);
});

test('missionProgress: liest nur, ein Block aus der Vorwoche zählt nicht und bleibt unverändert', () => {
  const week = freshWeek({ units: ['a', 'b', 'c'], done: ['units3'] });
  const profile = profileOf(week);
  const progress = missionProgress(profile, MONDAY);
  assert.equal(progress[0].count, 0);
  assert.equal(progress[0].done, false);
  assert.deepEqual(profile.week, freshWeek({ units: ['a', 'b', 'c'], done: ['units3'] }));
});

test('missionProgress: zeigt zwei von drei Seiten, begrenzt den Zähler auf das Ziel', () => {
  const two = missionProgress(profileOf(freshWeek({ units: ['a', 'b'] })), SUNDAY_BEFORE);
  assert.equal(two[0].count, 2);
  const many = missionProgress(profileOf(freshWeek({ units: ['a', 'b', 'c', 'd'], strong: 5, done: ['units3', 'strong90'] })), SUNDAY_BEFORE);
  assert.deepEqual(many.map((m) => [m.count, m.done]), [[3, true], [0, false], [1, true]]);
});

test('Woche wird am Montag zurückgesetzt', () => {
  const profile = profileOf(freshWeek({ units: ['a', 'b'], refreshes: 1, strong: 1, done: ['refresh1', 'strong90'] }));
  recordMission(profile, event({ unit: 'c' }), MONDAY);
  assert.deepEqual(profile.week, { start: MONDAY, units: ['c'], refreshes: 0, strong: 0, done: [] });
});

test('Am Sonntag gehört die Runde noch zur Woche, die am Montag davor begann', () => {
  const profile = profileOf(freshWeek({ units: ['a'] }));
  recordMission(profile, event({ unit: 'b' }), SUNDAY_BEFORE);
  assert.equal(profile.week.start, '2026-10-19');
  assert.deepEqual(profile.week.units, ['a', 'b']);
});

test('Ohne Wochenblock oder mit kaputtem Block entsteht ein frischer Block', () => {
  const none = profileOf();
  recordMission(none, event({ unit: 'a' }), MONDAY);
  assert.deepEqual(none.week, { start: MONDAY, units: ['a'], refreshes: 0, strong: 0, done: [] });
  const broken = profileOf({ start: MONDAY, units: 'a', refreshes: 'x', strong: null, done: 7 });
  recordMission(broken, event({ unit: 'b' }), MONDAY);
  assert.deepEqual(broken.week, { start: MONDAY, units: ['b'], refreshes: 0, strong: 0, done: [] });
});

test('units3 ist nach drei verschiedenen Seiten erfüllt, nicht bei derselben dreimal', () => {
  const same = profileOf();
  for (let i = 0; i < 3; i += 1) {
    assert.deepEqual(recordMission(same, event({ unit: 'a' }), MONDAY).completed, []);
  }
  assert.deepEqual(same.week.units, ['a']);
  assert.deepEqual(same.week.done, []);

  const three = profileOf();
  assert.deepEqual(recordMission(three, event({ unit: 'a' }), MONDAY).completed, []);
  assert.deepEqual(recordMission(three, event({ unit: 'b' }), MONDAY).completed, []);
  assert.deepEqual(recordMission(three, event({ unit: 'c' }), MONDAY).completed, ['units3']);
  assert.deepEqual(three.week.done, ['units3']);
});

test('Runden ohne Seite (Endgegner, Schnellrunde, Blitz) zählen nicht zu units3', () => {
  const profile = profileOf();
  recordMission(profile, event({ unit: null }), MONDAY);
  assert.deepEqual(profile.week.units, []);
});

test('refresh1 ist mit der ersten bezahlten Auffrischung erfüllt', () => {
  const profile = profileOf();
  assert.deepEqual(recordMission(profile, event({ unit: 'a', refreshed: false }), MONDAY).completed, []);
  assert.deepEqual(recordMission(profile, event({ unit: 'a', refreshed: true }), MONDAY).completed, ['refresh1']);
  assert.equal(profile.week.refreshes, 1);
});

test('jede Mission zahlt genau einmal', () => {
  const profile = profileOf();
  assert.deepEqual(recordMission(profile, event({ accuracy: 0.9 }), MONDAY).completed, ['strong90']);
  assert.deepEqual(recordMission(profile, event({ accuracy: 1 }), MONDAY).completed, []);
  assert.equal(profile.week.strong, 2);
  assert.deepEqual(profile.week.done, ['strong90']);
  // Auch eine zweite Auffrischung meldet refresh1 nicht noch einmal.
  assert.deepEqual(recordMission(profile, event({ refreshed: true }), MONDAY).completed, ['refresh1']);
  assert.deepEqual(recordMission(profile, event({ refreshed: true }), MONDAY).completed, []);
});

test('Eine Runde kann mehrere Missionen auf einmal erfüllen', () => {
  const profile = profileOf(freshWeek({ units: ['a', 'b'] }));
  const { completed } = recordMission(profile, event({ unit: 'c', refreshed: true, accuracy: 0.95 }), SUNDAY_BEFORE);
  assert.deepEqual(completed, ['units3', 'refresh1', 'strong90']);
  assert.deepEqual(profile.week.done, ['units3', 'refresh1', 'strong90']);
});

test('Grenze 90 % zählt als stark', () => {
  const at = profileOf();
  recordMission(at, event({ accuracy: 0.9 }), MONDAY);
  assert.equal(at.week.strong, 1);
  const below = profileOf();
  recordMission(below, event({ accuracy: 0.89 }), MONDAY);
  assert.equal(below.week.strong, 0);
  assert.deepEqual(below.week.done, []);
});

test('In der neuen Woche zahlt dieselbe Mission wieder', () => {
  const profile = profileOf();
  recordMission(profile, event({ accuracy: 1 }), SUNDAY_BEFORE);
  assert.deepEqual(profile.week.done, ['strong90']);
  assert.deepEqual(recordMission(profile, event({ accuracy: 1 }), MONDAY).completed, ['strong90']);
});

test('recordMission prüft den Tag', () => {
  assert.throws(() => recordMission(profileOf(), event(), '26.10.2026'), TypeError);
});
