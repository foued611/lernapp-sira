// Tests für die Auswertung einer beendeten Runde: Sterne, Auffrischen, Endgegner, Bestwerte, Trophäen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finishRound } from '../src/round.js';
import { weekStart } from '../src/dates.js';

const newProfile = (extra = {}) => ({ xp: 0, day: { d: '', xp: 0 }, streak: 0, lastDay: '', lastApp: '', ...extra });
const newApp = (extra = {}) => ({ xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {}, ...extra });
// Eine Runde mit 90 % oder eine Auffrischung erfüllt auch Wochenmissionen (+20 XP je Mission). Wo ein Test nur den
// Bonus der Runde prüft, sind die Missionen der Woche des Tages schon erledigt.
const missionsDone = (day) => ({ start: weekStart(day), units: ['x', 'y', 'z'], refreshes: 1, strong: 1, done: ['units3', 'refresh1', 'strong90'] });
const PERFECT = { id: 'perfect', rule: { type: 'perfectRound' } };
const BOSS = { id: 'boss', rule: { type: 'boss' } };

test('RULE-064: Ein Blitz-Ergebnis vergibt nie Sterne, der Punkte-Bestwert wird aber gespeichert', () => {
  const app = newApp();
  const result = finishRound({
    appId: 'mathe', mode: 'blitz', accuracy: 1, score: 40, profile: newProfile(), app, day: '2026-10-25'
  });
  assert.equal(result.stars, 0);
  assert.equal(app.best.blitz, 40);
  assert.deepEqual(app.stars, {});
});

test('RULE-257: finishRound reicht die Blitz-Fehler an die Trophäe weiter (blitz10 mit maxWrong)', () => {
  const blitz10 = { id: 'blitz10', rule: { type: 'blitz', min: 10, maxWrong: 1 } };
  const run = (wrong) => finishRound({
    appId: 'mathe', mode: 'blitz', accuracy: 0.8, score: 10, wrong, badges: [blitz10],
    profile: newProfile(), app: newApp(), day: '2026-10-25'
  });
  assert.deepEqual(run(1).newBadges.map((b) => b.id), ['blitz10']);
  assert.deepEqual(run(2).newBadges, []);
});

test('RULE-064: Gespeicherte Sterne gehen nur nach oben', () => {
  const app = newApp({ stars: { u1: 3 } });
  finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'u1' }, accuracy: 0.4, profile: newProfile(), app, day: '2026-10-25'
  });
  assert.equal(app.stars.u1, 3);
});

test('RULE-071: Endgegner gewonnen gibt 50 Bonus-XP und die Trophäe', () => {
  const profile = newProfile({ week: missionsDone('2026-10-25') });
  const app = newApp();
  const result = finishRound({
    appId: 'mathe', mode: 'boss', accuracy: 0.9, failed: false, badges: [BOSS],
    profile, app, day: '2026-10-25'
  });
  assert.equal(result.bonus, 50);
  assert.equal(profile.xp, 50);
  assert.equal(app.xp, 50);
  assert.equal(app.best.boss, true);
  assert.deepEqual(result.newBadges.map((b) => b.id), ['boss']);
});

test('RULE-071: Endgegner verloren gibt weder Bonus noch Trophäe', () => {
  const profile = newProfile();
  const app = newApp();
  const result = finishRound({
    appId: 'mathe', mode: 'boss', accuracy: 0.3, failed: true, badges: [BOSS],
    profile, app, day: '2026-10-25'
  });
  assert.equal(result.bonus, 0);
  assert.equal(profile.xp, 0);
  assert.equal(app.best.boss, undefined);
  assert.deepEqual(result.newBadges, []);
});

test('RULE-189: Eine gescheiterte Lektionsrunde hat keine Sterne und die Seite ist ohne Stern', () => {
  const app = newApp();
  const result = finishRound({
    appId: 'franz', mode: 'lesson', unit: { id: 'aller' }, accuracy: 0.4, failed: true,
    wrong: 5, almost: 0, profile: newProfile(), app, day: '2026-10-25'
  });
  assert.equal(result.stars, 0);
  assert.equal(app.stars.aller, undefined);
});

test('RULE-189: Eine gescheiterte Lektionsrunde bekommt keine Perfekt-Trophäe', () => {
  const app = newApp();
  const result = finishRound({
    appId: 'franz', mode: 'lesson', unit: { id: 'aller' }, accuracy: 0.4, failed: true,
    wrong: 5, almost: 0, badges: [PERFECT], profile: newProfile(), app, day: '2026-10-25'
  });
  assert.deepEqual(result.newBadges, []);
  assert.equal(app.badges.perfect, undefined);
});

test('RULE-189: Auch ohne Fehlerzähler verhindert ein Misserfolg die Perfekt-Trophäe', () => {
  const app = newApp();
  const result = finishRound({
    appId: 'franz', mode: 'lesson', unit: { id: 'aller' }, accuracy: 0.4, failed: true,
    wrong: 0, almost: 0, badges: [PERFECT], profile: newProfile(), app, day: '2026-10-25'
  });
  assert.deepEqual(result.newBadges, []);
});

test('RULE-194: Abschluss speichert Tag und Genauigkeit und zahlt den Auffrischen-Bonus einmal', () => {
  const profile = newProfile({ week: missionsDone('2026-10-10') });
  const app = newApp({ stars: { a: 2 }, last: { a: '2026-10-01' } });

  const first = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.9,
    profile, app, day: '2026-10-10'
  });
  assert.equal(first.refresh, true);
  assert.equal(first.bonus, 10);
  assert.equal(app.xp, 10);
  assert.equal(app.last.a, '2026-10-10');
  assert.equal(app.acc.a, 0.9);

  const second = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 1,
    profile, app, day: '2026-10-10'
  });
  assert.equal(second.refresh, false);
  assert.equal(second.bonus, 0);
  assert.equal(app.xp, 10);
});

test('RULE-194: Bei einer gescheiterten Runde gibt es keinen Auffrischen-Bonus (rounds.js:19)', () => {
  const app = newApp({ stars: { a: 2 }, last: { a: '2026-10-01' } });
  const result = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.3, failed: true,
    profile: newProfile(), app, day: '2026-10-10'
  });
  assert.equal(result.refresh, false);
  assert.equal(app.xp, 0);
});

test('RULE-208: Eine Runde am Folgetag erhöht die Serie und merkt sich die App', () => {
  const profile = newProfile({ streak: 1, lastDay: '2026-10-24' });
  finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8,
    profile, app: newApp(), day: '2026-10-25'
  });
  assert.equal(profile.streak, 2);
  assert.equal(profile.lastDay, '2026-10-25');
  assert.equal(profile.lastApp, 'mathe');
});

test('RULE-208: Eine Runde mit Serie 2 an einem Gnadentag-Abstand gibt Serie 3', () => {
  // Am 23. geübt, am 25. wieder: ein Tag ausgelassen, die Serie bleibt bestehen.
  const profile = newProfile({ streak: 2, lastDay: '2026-10-23' });
  finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8,
    profile, app: newApp(), day: '2026-10-25'
  });
  assert.equal(profile.streak, 3);
});

test('RULE-208: Ein zweites Ergebnis am selben Tag ändert die Serie nicht', () => {
  const profile = newProfile({ streak: 2, lastDay: '2026-10-25' });
  finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8,
    profile, app: newApp(), day: '2026-10-25'
  });
  assert.equal(profile.streak, 2);
});

test('prevAcc: erste Übung ergibt null, die zweite den alten Wert (vor dem Überschreiben gelesen)', () => {
  const profile = newProfile();
  const app = newApp();
  const first = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.6, profile, app, day: '2026-10-25'
  });
  assert.equal(first.prevAcc, null);
  assert.equal(app.acc.a, 0.6);

  const second = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.9, profile, app, day: '2026-10-25'
  });
  assert.equal(second.prevAcc, 0.6);
  assert.equal(app.acc.a, 0.9);
});

test('prevAcc: außerhalb einer Lektionsrunde null', () => {
  const result = finishRound({
    appId: 'mathe', mode: 'quick', accuracy: 0.8, profile: newProfile(), app: newApp({ acc: { a: 0.5 } }), day: '2026-10-25'
  });
  assert.equal(result.prevAcc, null);
});

test('gapDays: erste Übung einer Seite ergibt null', () => {
  const result = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8, profile: newProfile(), app: newApp(), day: '2026-10-27'
  });
  assert.equal(result.gapDays, null);
});

test('gapDays: zählt Tage seit der letzten Übung derselben Seite, vor dem Überschreiben gelesen', () => {
  const app = newApp({ last: { a: '2026-10-24', b: '2026-10-01' } });
  const result = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8, profile: newProfile(), app, day: '2026-10-27'
  });
  assert.equal(result.gapDays, 3, 'nur die eigene Seite zählt, nicht Seite b');
  assert.equal(app.last.a, '2026-10-27');
});

test('gapDays: am selben Tag ist es 0, außerhalb einer Lektionsrunde null', () => {
  const same = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8, profile: newProfile(),
    app: newApp({ last: { a: '2026-10-27' } }), day: '2026-10-27'
  });
  assert.equal(same.gapDays, 0);
  const quick = finishRound({
    appId: 'mathe', mode: 'quick', accuracy: 0.8, profile: newProfile(),
    app: newApp({ last: { a: '2026-10-24' } }), day: '2026-10-27'
  });
  assert.equal(quick.gapDays, null);
});

test('improved-Trophäe: Anstieg von 60 auf 90 Prozent wird in derselben Runde vergeben', () => {
  const rule = { id: 'besser', rule: { type: 'improved', unit: 'a', by: 0.2 } };
  const app = newApp({ acc: { a: 0.6 }, stars: { a: 1 }, last: { a: '2026-10-24' } });
  const result = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.9, badges: [rule],
    profile: newProfile(), app, day: '2026-10-25'
  });
  assert.deepEqual(result.newBadges.map((b) => b.id), ['besser']);
});

test('retryRight: kommt als Zahl aus der Runde ins Ergebnis, Standard 0', () => {
  const base = { appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8, day: '2026-10-25' };
  const withRetries = finishRound({ ...base, retryRight: 2, profile: newProfile(), app: newApp() });
  assert.equal(withRetries.retryRight, 2);
  const without = finishRound({ ...base, profile: newProfile(), app: newApp() });
  assert.equal(without.retryRight, 0);
});

test('retryRecovered-Trophäe: zwei richtige Wiederholungen lösen sie aus', () => {
  const rule = { id: 'dranbleiber', rule: { type: 'retryRecovered', min: 2 } };
  const result = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.8, retryRight: 2, badges: [rule],
    profile: newProfile(), app: newApp(), day: '2026-10-25'
  });
  assert.deepEqual(result.newBadges.map((b) => b.id), ['dranbleiber']);
});

test('app.refreshes: zählt jede bezahlte Auffrischung und löst die refresh-Trophäe aus', () => {
  const rule = { id: 'frisch', rule: { type: 'refresh', count: 2 } };
  const app = newApp({ stars: { a: 2 }, last: { a: '2026-10-01' } });
  const profile = newProfile();
  const first = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.9, badges: [rule], profile, app, day: '2026-10-10'
  });
  assert.equal(first.refresh, true);
  assert.equal(app.refreshes, 1);
  assert.deepEqual(first.newBadges, []);

  app.last.a = '2026-10-01';
  const second = finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.9, badges: [rule], profile, app, day: '2026-10-20'
  });
  assert.equal(app.refreshes, 2);
  assert.deepEqual(second.newBadges.map((b) => b.id), ['frisch']);
});

test('app.refreshes: eine gescheiterte Runde zählt nicht', () => {
  const app = newApp({ stars: { a: 2 }, last: { a: '2026-10-01' } });
  finishRound({
    appId: 'mathe', mode: 'lesson', unit: { id: 'a' }, accuracy: 0.3, failed: true,
    profile: newProfile(), app, day: '2026-10-10'
  });
  assert.equal(app.refreshes, undefined);
});

// Wochenmissionen: 2026-10-26 ist ein Montag. Die Belohnung läuft über awardXP (Tagesziel, Level).
const MISSION_DAY = '2026-10-26';
const lesson = (extra) => finishRound({ appId: 'mathe', mode: 'lesson', accuracy: 0.5, ...extra });

test('Wochenmission: strong90 zahlt 20 XP über awardXP und nur einmal pro Woche', () => {
  const profile = newProfile();
  const app = newApp();
  const first = lesson({ unit: { id: 'a' }, accuracy: 0.9, profile, app, day: MISSION_DAY });
  assert.equal(first.bonus, 20);
  assert.equal(profile.xp, 20);
  assert.equal(app.xp, 20);
  assert.equal(profile.day.xp, 20);
  assert.deepEqual(profile.week.done, ['strong90']);

  const second = lesson({ unit: { id: 'a' }, accuracy: 1, profile, app, day: MISSION_DAY });
  assert.equal(second.bonus, 0);
  assert.equal(profile.xp, 20);
});

test('Wochenmission: drei verschiedene Seiten bringen 20 XP, dieselbe Seite dreimal nicht', () => {
  const same = newProfile();
  const sameApp = newApp();
  for (let i = 0; i < 3; i += 1) lesson({ unit: { id: 'a' }, profile: same, app: sameApp, day: MISSION_DAY });
  assert.equal(same.xp, 0);

  const profile = newProfile();
  const app = newApp();
  ['a', 'b', 'c'].forEach((id) => lesson({ unit: { id }, profile, app, day: MISSION_DAY }));
  assert.equal(profile.xp, 20);
  assert.deepEqual(profile.week.done, ['units3']);
});

test('Wochenmission: Auffrischen und starke Runde zugleich zahlen je 20 XP, jede Mission einmal', () => {
  const profile = newProfile();
  const app = newApp({ stars: { a: 2 }, last: { a: '2026-10-20' } });
  const result = lesson({ unit: { id: 'a' }, accuracy: 0.95, profile, app, day: MISSION_DAY });
  assert.equal(result.refresh, true);
  // 10 Auffrischen-Bonus, 20 für refresh1, 20 für strong90.
  assert.equal(result.bonus, 50);
  assert.equal(profile.xp, 50);
  assert.equal(app.xp, 50);
  assert.deepEqual(profile.week.done, ['refresh1', 'strong90']);
});

test('Wochenmission: Level-Aufstieg und Tagesziel durch die Mission stehen im Ergebnis', () => {
  const profile = newProfile({ xp: 45, day: { d: MISSION_DAY, xp: 15 } });
  const result = lesson({ unit: { id: 'a' }, accuracy: 0.9, profile, app: newApp(), day: MISSION_DAY });
  assert.equal(profile.xp, 65);
  assert.equal(result.levelUp, 2);
  assert.equal(result.goalHit, true);
});

test('Wochenmission: eine gescheiterte Runde zählt nicht', () => {
  const profile = newProfile();
  lesson({ unit: { id: 'a' }, accuracy: 0.9, failed: true, profile, app: newApp(), day: MISSION_DAY });
  assert.equal(profile.xp, 0);
  assert.equal(profile.week, undefined);
});

test('Wochenmission: Der Endgegner zählt zur starken Runde, aber nicht zu den Seiten', () => {
  const profile = newProfile();
  const result = finishRound({ appId: 'mathe', mode: 'boss', accuracy: 0.9, profile, app: newApp(), day: MISSION_DAY });
  // 50 Endgegner-Bonus plus 20 für strong90.
  assert.equal(result.bonus, 70);
  assert.deepEqual(profile.week.units, []);
});

test('Wochenmission: In der neuen Woche zahlt dieselbe Mission wieder', () => {
  const profile = newProfile();
  const app = newApp();
  lesson({ unit: { id: 'a' }, accuracy: 1, profile, app, day: '2026-10-25' });
  lesson({ unit: { id: 'a' }, accuracy: 1, profile, app, day: MISSION_DAY });
  assert.equal(profile.xp, 40);
});
