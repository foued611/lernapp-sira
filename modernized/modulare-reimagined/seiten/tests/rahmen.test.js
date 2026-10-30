// Rahmen einer App: Rundenlebenszyklus, Speichern, Protokoll, zweistufiges Zurücksetzen und Endgegner-Sperre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRng } from '../../helfer/index.js';
import { openApp, openProfile, PROFILE_KEY } from '../../speicher/index.js';
import { NO_STORAGE, appDefaults, bossOpen, profileDefaults, resetApp, resetAppState, resetStep, settleLeave, leaveNotice, settleRound, startRound, evaluateRound } from '../ablauf.js';
import { AppFrame, Play } from '../rahmen.js';
import { messagesOf } from '../ergebnis.js';
import { MSG } from '../boot.js';
import { bootFixture, configOf, DAY, memoryHandle, NAME, playAll, UNIT_IDS } from './helpers.js';

const h = createElement;

// Eine Runde auf der ersten Seite, mit echtem Speicher und echter Auswertung.
async function setup({ logOk = true } = {}) {
  const handle = await memoryHandle();
  const config = configOf();
  const profileStore = await openProfile(handle, profileDefaults());
  const appStore = await openApp(handle, config.id, appDefaults());
  const log = logOk ? (row) => handle.logEvent(row) : async () => ({ ok: false, error: 'Das Ereignis konnte nicht gespeichert werden.' });
  return { handle, config, profileStore, appStore, log };
}

async function finishLesson(env, { wrong = false, unit = env.config.units[0], day = DAY } = {}) {
  const started = startRound({
    config: env.config, mode: 'lesson', unit, app: env.appStore.state, profile: env.profileStore.state, rng: createRng(5)
  });
  assert.equal(started.ok, true);
  const roundResult = playAll(started.round, { wrong });
  return settleRound({
    appId: env.config.id, mode: 'lesson', unit, roundResult,
    profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore,
    log: env.log, day, badges: env.config.badges, unitIds: UNIT_IDS
  });
}

test('RULE-195 Rundenende: Auswertung, Speichern und Protokoll laufen in einem Ablauf, das Ergebnis kommt danach', async () => {
  const env = await setup();
  const out = await finishLesson(env);
  assert.equal(out.saved.ok, true);
  assert.equal(out.logged.ok, true);
  assert.equal(out.summary.stars, 3, 'alle richtig ergibt drei Sterne');
  assert.equal(out.summary.accuracy, 1);
  assert.equal(env.appStore.state.stars.start, 3);
});

test('RULE-247 Protokoll: eine Lektionsrunde schreibt gapDays und prevAcc, sonst keine neuen Felder', async () => {
  const env = await setup();
  // Erste Übung am 24.10., dann am 26.10. (DAY). Der Abstand ist 2 Tage, die Vorwerte kommen aus der ersten Runde.
  const first = await finishLesson(env, { day: '2026-10-24' });
  const rows = [];
  env.log = (row) => { rows.push(row); return env.handle.logEvent(row); };
  await finishLesson(env);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].gapDays, 2);
  assert.equal(rows[0].prevAcc, first.summary.accuracy);
  assert.deepEqual(
    Object.keys(rows[0]).sort(),
    ['accuracy', 'app', 'failed', 'gapDays', 'mode', 'prevAcc', 'score', 'stars', 'type', 'unit', 'xp']
  );
});

test('RULE-247 Protokoll: bei der ersten Übung sind gapDays und prevAcc null', async () => {
  const env = await setup();
  const rows = [];
  env.log = (row) => { rows.push(row); return env.handle.logEvent(row); };
  await finishLesson(env);
  assert.equal(rows[0].gapDays, null);
  assert.equal(rows[0].prevAcc, null);
});

test('RULE-195 Schlägt das Protokoll fehl, bleibt das Ergebnis und die Meldung steht dabei', async () => {
  const env = await setup({ logOk: false });
  const out = await finishLesson(env);
  assert.equal(out.summary.stars, 3, 'das Ergebnis bleibt erhalten');
  assert.deepEqual(messagesOf(out), ['Das Ereignis konnte nicht gespeichert werden.']);
});

test('RULE-195 Eine gescheiterte Lektionsrunde gibt keine Sterne und keinen Bonus', async () => {
  const env = await setup();
  const out = await finishLesson(env, { wrong: true });
  assert.equal(out.summary.failed, true);
  assert.equal(out.summary.stars, 0);
  assert.equal(out.summary.bonus, 0);
});

test('RULE-195 Ein Rundenabbruch protokolliert nichts und vergibt keine Sterne', async () => {
  const env = await setup();
  const started = startRound({
    config: env.config, mode: 'lesson', unit: env.config.units[0], app: env.appStore.state, profile: env.profileStore.state, rng: createRng(9)
  });
  started.round.submit({ pick: 'richtig' });
  started.round.leave();
  assert.equal(started.round.status(), 'left');
  assert.equal(started.round.result(), null, 'ohne Ende gibt es kein Ergebnis');
  assert.deepEqual(await env.handle.listEvents({ app: env.config.id }), []);
  assert.equal(env.appStore.state.stars.start, undefined);
});

test('RULE-247 Nach einer Runde sind Profil und App-Stand gespeichert', async () => {
  const env = await setup();
  await finishLesson(env);
  const profileAgain = await env.handle.createStore(PROFILE_KEY, profileDefaults());
  const appAgain = await openApp(env.handle, env.config.id, appDefaults());
  assert.ok(profileAgain.state.xp > 0, 'XP sind im Profil angekommen');
  assert.equal(profileAgain.state.lastApp, env.config.id);
  assert.equal(appAgain.state.stars.start, 3);
  assert.equal(typeof appAgain.state.xp, 'number');
});

test('RULE-247 Die Runde steht genau einmal im Protokoll, mit App und Seite', async () => {
  const env = await setup();
  await finishLesson(env);
  const rows = await env.handle.listEvents({ app: env.config.id });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].type, 'round');
  assert.equal(rows[0].app, env.config.id);
  assert.equal(rows[0].unit, 'start');
});

test('RULE-247 Ohne Speicher läuft die Auswertung weiter, nichts wird gespeichert und die Meldung sagt es', async () => {
  const profile = profileDefaults();
  const app = appDefaults();
  const config = configOf();
  const started = startRound({ config, mode: 'lesson', unit: config.units[0], app, profile, rng: createRng(3) });
  const out = await settleRound({
    appId: config.id, mode: 'lesson', unit: config.units[0], roundResult: playAll(started.round),
    profile, app, profileStore: null, appStore: null, log: async () => ({ ok: false, error: NO_STORAGE }), day: DAY,
    badges: config.badges, unitIds: UNIT_IDS
  });
  assert.equal(out.saved.ok, false);
  assert.equal(out.saved.error, NO_STORAGE);
  assert.equal(out.summary.stars, 3);
});

test('RULE-133 Zurücksetzen braucht zwei Bestätigungen: der erste Klick öffnet nur die Frage', () => {
  const first = resetStep('idle', 'start');
  assert.deepEqual(first, { phase: 'ask', reset: false });
  const second = resetStep(first.phase, 'confirm');
  assert.deepEqual(second, { phase: 'idle', reset: true });
});

test('RULE-133 Ein Bestätigen ohne vorherige Frage tut nichts', () => {
  assert.deepEqual(resetStep('idle', 'confirm'), { phase: 'idle', reset: false });
});

test('RULE-133 Jede andere Navigation bricht die Bestätigung ab', () => {
  assert.deepEqual(resetStep('ask', 'cancel'), { phase: 'idle', reset: false });
  assert.deepEqual(resetStep('ask', 'navigate'), { phase: 'idle', reset: false });
});

test('RULE-133 Der zweite Klick setzt nur den App-Stand zurück, Name und Gesamt-XP bleiben', async () => {
  const env = await setup();
  await finishLesson(env);
  env.profileStore.state.name = NAME;
  const xpBefore = env.profileStore.state.xp;
  const streakBefore = env.profileStore.state.streak;
  assert.equal(resetStep('ask', 'confirm').reset, true);
  const done = await resetApp(env.appStore.state, env.appStore);
  assert.equal(done.ok, true);
  assert.equal(env.profileStore.state.name, NAME);
  assert.equal(env.profileStore.state.xp, xpBefore);
  assert.equal(env.profileStore.state.streak, streakBefore);
  assert.equal(env.appStore.state.stars.start, undefined);
});

test('RULE-205 Zurücksetzen leert XP, Sterne, Trophäen, Bestwerte und Verlauf der App', async () => {
  const app = {
    xp: 40, stars: { start: 3 }, badges: { first: true }, best: { blitz: 12, boss: true }, last: { start: DAY }, acc: { start: 0.8 }
  };
  resetAppState(app);
  assert.deepEqual(app, appDefaults());
  assert.equal(app.xp, 0);
  assert.deepEqual(app.stars, {});
});

test('RULE-205 Der leere Stand wird gespeichert und kommt beim Neuladen als Standard zurück', async () => {
  const env = await setup();
  await finishLesson(env);
  await resetApp(env.appStore.state, env.appStore);
  const reloaded = await openApp(env.handle, env.config.id, appDefaults());
  assert.equal(reloaded.state.xp, 0);
  assert.deepEqual(reloaded.state.stars, {});
});

test('RULE-257 Der Rahmen gibt die falschen Blitz-Antworten an die Trophäe weiter', () => {
  const badges = [{ id: 'blitz-sauber', n: 'Sauber', d: 'x', rule: { type: 'blitz', min: 1, maxWrong: 0 } }];
  const round = (wrong) => ({ mode: 'blitz', failed: false, accuracy: 0.5, correct: 5, wrong, almost: 0, bestCombo: 0, score: 5, xp: 0 });
  const run = (wrong) => evaluateRound({ appId: 'x', mode: 'blitz', roundResult: round(wrong), profile: profileDefaults(), app: appDefaults(), day: DAY, badges, unitIds: UNIT_IDS });
  assert.deepEqual(run(1).newBadges, [], 'ein Fehler über der Grenze von null');
  assert.deepEqual(run(0).newBadges.map((b) => b.id), ['blitz-sauber']);
});

test('RULE-206 Der Endgegner bleibt gesperrt, solange eine Seite keinen Stern hat', () => {
  const app = { stars: { start: 2 } };
  assert.equal(bossOpen({ app, unitIds: UNIT_IDS, profile: profileDefaults() }), false);
  const config = configOf();
  const started = startRound({ config, mode: 'boss', app, profile: profileDefaults(), rng: createRng(1) });
  assert.equal(started.ok, false);
  assert.match(started.message, /gesperrt/);
  assert.equal(started.round, undefined, 'es entsteht keine Runde');
});

test('RULE-206 Der Endgegner ist offen, wenn jede Seite mindestens einen Stern hat, und startet mit 12 Aufgaben und 3 Herzen', () => {
  const app = { stars: { start: 1, weiter: 1 } };
  assert.equal(bossOpen({ app, unitIds: UNIT_IDS, profile: profileDefaults() }), true);
  const started = startRound({ config: configOf(), mode: 'boss', app, profile: profileDefaults(), rng: createRng(4) });
  assert.equal(started.ok, true);
  const cur = started.round.current();
  assert.equal(cur.total, 12);
  assert.equal(cur.maxHearts, 3);
});

test('RULE-206 Eine App kann die Freischaltung selbst setzen', () => {
  const locked = { stars: {} };
  assert.equal(bossOpen({ app: locked, unitIds: UNIT_IDS, bossUnlocked: () => true, profile: profileDefaults() }), true);
  const full = { stars: { start: 3, weiter: 3 } };
  assert.equal(bossOpen({ app: full, unitIds: UNIT_IDS, bossUnlocked: () => false, profile: profileDefaults() }), false);
});

test('RULE-206 Die gesperrte Seite nennt die Sperre als Text, nicht nur als Farbe', async () => {
  const boot = await bootFixture({ search: '?app=mathe' });
  const app = boot.state.apps.find((a) => a.entry.id === 'mathe');
  const markup = renderToStaticMarkup(h(AppFrame, { app, profileStore: boot.state.profileStore, day: DAY, storage: boot.state.storage }));
  assert.match(markup, /Noch gesperrt/);
  assert.match(markup, /alle Seiten mindestens einen Stern haben/, 'die Sperre steht als Text, Wortlaut wie Legacy home.js');
  assert.match(markup, /disabled=""/, 'der Knopf ist gesperrt');
});

test('RULE-195 Die Ergebnisdaten haben einen festen Aufbau aus Runde und Auswertung', async () => {
  const env = await setup();
  const out = await finishLesson(env);
  assert.deepEqual(Object.keys(out.summary).sort(), [
    'accuracy', 'almost', 'bestCombo', 'bonus', 'correct', 'failed', 'goalHit', 'groupId', 'levelUp', 'missions', 'mode', 'newBadges',
    'prevBest', 'refresh', 'relearned', 'score', 'stars', 'unitId', 'weakUnits', 'wrong', 'xp'
  ]);
  assert.equal(out.summary.unitId, 'start');
  assert.equal(out.summary.mode, 'lesson');
});

test('RULE-195 Die App-Seite ohne Speicher zeigt den Lernpfad, Fortschritt wird nicht erfunden', async () => {
  const boot = await bootFixture({ openStorage: async () => null, search: '?app=mathe' });
  const app = boot.state.apps.find((a) => a.entry.id === 'mathe');
  assert.equal(app.appStore, null, 'es gibt keinen gespeicherten Stand');
  const markup = renderToStaticMarkup(h(AppFrame, { app, profileStore: null, day: DAY, storage: boot.state.storage }));
  assert.match(markup, /Dein Lernpfad/);
  assert.match(markup, /Erste Seite/);
  assert.match(markup, /Ohne Speicher/);
});

test('RULE-202 Im Arbeitsspeicher steht die Speicher-Meldung auf der App-Seite, der Satz "gespeichert" fehlt', async () => {
  const boot = await bootFixture({ search: '?app=mathe' });
  assert.equal(boot.state.storage.status, 'memory', 'ohne IndexedDB und localStorage läuft der Stand im Arbeitsspeicher');
  const app = boot.state.apps.find((a) => a.entry.id === 'mathe');
  const markup = renderToStaticMarkup(h(AppFrame, { app, profileStore: boot.state.profileStore, day: DAY, storage: boot.state.storage }));
  assert.ok(markup.includes(MSG.memory), 'die Meldung steht auf der Seite');
  assert.doesNotMatch(markup, /wird in diesem Browser gespeichert/, 'der Satz über das Speichern gilt nur mit echtem Speicher');
});

test('RULE-195 Die Spielansicht zeigt das Urteil als Text und den Weiter-Knopf erst nach der Antwort', async () => {
  const config = configOf();
  const started = startRound({
    config, mode: 'lesson', unit: config.units[0], app: appDefaults(), profile: profileDefaults(), rng: createRng(8)
  });
  const props = { session: started, onAnswer() {}, onNext() {}, onLeave() {} };
  const before = renderToStaticMarkup(h(Play, props));
  assert.match(before, /class="pbar"/, 'Fortschrittsbalken wie Legacy quiz.js');
  assert.match(before, /aria-label="5 Herzen"/, 'Herzen als Symbole mit Text für Screenreader');
  assert.equal(before.includes('Weiter'), false, 'vor der Antwort kein Weiter');
  started.round.submit({ pick: started.round.current().question.answer });
  const after = renderToStaticMarkup(h(Play, props));
  assert.match(after, /Richtig!/, 'das Urteil steht als Text da');
  assert.match(after, />Weiter</);
  assert.match(after, /disabled=""/, 'die Antwortmöglichkeiten sind nach der Antwort gesperrt');
});

test('RULE-258 Jede Seite steht im Lernpfad genau einmal, und nur die Seite mit Strang hat das Etikett', async () => {
  const boot = await bootFixture({ search: '?app=mathe' });
  const app = boot.state.apps.find((a) => a.entry.id === 'mathe');
  const markup = renderToStaticMarkup(h(AppFrame, { app, profileStore: boot.state.profileStore, day: DAY, storage: boot.state.storage }));
  assert.equal(markup.split('<span class="stitle">Erste Seite</span>').length - 1, 1, 'Erste Seite genau einmal');
  assert.equal(markup.split('<span class="stitle">Zweite Seite</span>').length - 1, 1, 'Zweite Seite genau einmal');
  assert.equal((markup.match(/class="trk trk-lrs"/g) || []).length, 1, 'das Etikett nur an der Seite mit Strang');
});

// Ein Rundenstart mit dem echten Speicher. Die Antworten geben die Runde in den gewünschten Zustand.
async function startedWith(env, correctAnswers) {
  const started = startRound({
    config: env.config, mode: 'lesson', unit: env.config.units[0], app: env.appStore.state, profile: env.profileStore.state, rng: createRng(11)
  });
  for (let i = 0; i < correctAnswers; i += 1) {
    started.round.submit({ pick: started.round.current().question.answer });
    started.round.next();
  }
  return started;
}

test('RULE-193 Beim Verlassen bleiben die verdienten XP erhalten: Profil, App und Tagesbilanz, gespeichert', async () => {
  const env = await setup();
  const started = await startedWith(env, 2);
  const out = await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(out.earned, 20, 'zwei richtige Antworten ergeben 20 XP');
  assert.equal(out.saved.ok, true);
  assert.equal(env.profileStore.state.xp, 20);
  assert.equal(env.appStore.state.xp, 20);
  assert.deepEqual(env.profileStore.state.day, { d: DAY, xp: 20 });
  const reopened = await env.handle.createStore(PROFILE_KEY, profileDefaults());
  assert.equal(reopened.state.xp, 20, 'die XP sind im Speicher angekommen');
});

test('RULE-193 Verlassen wertet die Runde nicht: kein Ergebnis, kein Protokoll, keine Sterne, kein lastApp', async () => {
  const env = await setup();
  const started = await startedWith(env, 2);
  await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(started.round.status(), 'left');
  assert.equal(started.round.result(), null, 'kein Rundenergebnis');
  assert.deepEqual(await env.handle.listEvents({ app: env.config.id }), [], 'kein Protokolleintrag');
  assert.equal(env.appStore.state.stars.start, undefined, 'keine Sterne');
  assert.equal(env.profileStore.state.lastApp, '', 'die Runde setzt die zuletzt genutzte App nicht');
  assert.equal(env.appStore.state.last.start, undefined, 'kein Übungstag je Seite');
});

test('RULE-193 Ohne verdiente XP passiert beim Verlassen nichts am Speicher', async () => {
  const env = await setup();
  const started = await startedWith(env, 0);
  const out = await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(out.earned, 0);
  assert.equal(env.profileStore.state.xp, 0);
  assert.equal(leaveNotice(out), 'Runde nicht gewertet. Es gab noch keine Antwort.');
});

test('RULE-193 Der Hinweis nach dem Verlassen ist ehrlich: die XP stehen gut, die Runde zählt nicht', () => {
  assert.equal(leaveNotice({ earned: 20, answered: 2, saved: { ok: true } }), 'Runde nicht gewertet. 20 XP wurden gutgeschrieben. Der Übungstag zählt für die Serie.');
  assert.match(leaveNotice({ earned: 20, answered: 2, saved: { ok: false, error: 'x' } }), /Runde nicht gewertet\. Die XP konnten nicht gespeichert werden\./);
});

test('RULE-193 Ohne Speicher sind die XP nur im Arbeitsspeicher und der Hinweis sagt, dass sie nicht gespeichert sind', async () => {
  const env = await setup();
  const started = await startedWith(env, 1);
  const out = await settleLeave({
    round: started.round, profile: profileDefaults(), app: appDefaults(), profileStore: null, appStore: null, day: DAY
  });
  assert.equal(out.earned, 10);
  assert.equal(out.saved.ok, false);
  assert.match(leaveNotice(out), /nicht gespeichert/);
});

test('RULE-208 Verlassen nach einer Antwort zählt den Übungstag für die Serie, lastApp bleibt unberührt', async () => {
  const env = await setup();
  const started = await startedWith(env, 2);
  const out = await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(out.streakCounted, true);
  assert.equal(env.profileStore.state.streak, 1);
  assert.equal(env.profileStore.state.lastDay, DAY);
  assert.equal(env.profileStore.state.lastApp, '');
  const reopened = await env.handle.createStore(PROFILE_KEY, profileDefaults());
  assert.equal(reopened.state.streak, 1, 'die Serie ist gespeichert');
});

test('RULE-208 Verlassen am Folgetag setzt die laufende Serie fort', async () => {
  const env = await setup();
  env.profileStore.state.streak = 3;
  env.profileStore.state.lastDay = '2026-10-25';
  const started = await startedWith(env, 1);
  await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(env.profileStore.state.streak, 4);
  assert.equal(env.profileStore.state.lastDay, DAY);
});

test('RULE-208 Eine falsche Antwort zählt für die Serie, auch ohne XP', async () => {
  const env = await setup();
  const started = startRound({
    config: env.config, mode: 'lesson', unit: env.config.units[0], app: env.appStore.state, profile: env.profileStore.state, rng: createRng(12)
  });
  started.round.submit({ pick: started.round.current().question.options.find((o) => o.id !== started.round.current().question.answer).id });
  const out = await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(out.earned, 0);
  assert.equal(out.streakCounted, true);
  assert.equal(env.profileStore.state.streak, 1);
});

test('RULE-208 Ohne Antwort ändert sich die Serie nicht und es entsteht kein Übungstag', async () => {
  const env = await setup();
  env.profileStore.state.streak = 3;
  env.profileStore.state.lastDay = '2026-10-25';
  const started = await startedWith(env, 0);
  const out = await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(out.streakCounted, false);
  assert.equal(env.profileStore.state.streak, 3);
  assert.equal(env.profileStore.state.lastDay, '2026-10-25');
  const reopened = await env.handle.createStore(PROFILE_KEY, profileDefaults());
  assert.equal(reopened.state.lastDay, '', 'es wurde nichts geschrieben');
});

test('RULE-208 Am selben Tag zählt die Serie nur einmal', async () => {
  const env = await setup();
  env.profileStore.state.streak = 2;
  env.profileStore.state.lastDay = DAY;
  const started = await startedWith(env, 2);
  await settleLeave({
    round: started.round, profile: env.profileStore.state, app: env.appStore.state,
    profileStore: env.profileStore, appStore: env.appStore, day: DAY
  });
  assert.equal(env.profileStore.state.streak, 2);
});

test('RULE-208 Der Hinweis nennt die Serie, wenn eine Antwort da war', () => {
  assert.match(leaveNotice({ earned: 0, answered: 1, saved: { ok: true } }), /Der Übungstag zählt für die Serie\./);
  assert.equal(leaveNotice({ earned: 0, answered: 0, saved: { ok: true } }), 'Runde nicht gewertet. Es gab noch keine Antwort.');
});

// Fehler-Abruf (Spec 5.2). Die Testseite hat zehn Fragen mit den Labels start-1 bis start-10, eine Lektion zieht acht.
const labelsPlayed = (round) => {
  const labels = [];
  for (let guard = 0; guard < 50 && round.current(); guard += 1) {
    const q = round.current().question;
    if (!q.retry) labels.push(q.label);
    round.submit({ pick: q.answer });
    round.next();
  }
  return labels;
};

test('SEITE-ABRUF Eine Lektionsrunde nimmt eine Frage aus app.missed garantiert in die Runde', async () => {
  const env = await setup();
  const unit = env.config.units[0];
  env.appStore.state.missed = { [unit.id]: ['start-9'] };
  let withoutMissed = 0;
  for (let seed = 1; seed <= 25; seed += 1) {
    const started = startRound({
      config: env.config, mode: 'lesson', unit, app: env.appStore.state, profile: env.profileStore.state, rng: createRng(seed)
    });
    assert.equal(started.ok, true);
    assert.equal(started.round.current().total, 8);
    assert.ok(labelsPlayed(started.round).includes('start-9'), `Seed ${seed}: start-9 fehlt`);
    const plain = startRound({
      config: env.config, mode: 'lesson', unit, app: { ...env.appStore.state, missed: {} }, profile: env.profileStore.state, rng: createRng(seed)
    });
    if (!labelsPlayed(plain.round).includes('start-9')) withoutMissed += 1;
  }
  assert.ok(withoutMissed > 0, 'ohne Abruf fällt start-9 bei manchen Seeds heraus');
});

test('SEITE-ABRUF Ohne app.missed oder mit kaputtem Eintrag startet die Runde wie bisher', async () => {
  const env = await setup();
  const unit = env.config.units[0];
  const labelsFor = (missed) => {
    const app = { ...env.appStore.state, missed };
    const started = startRound({ config: env.config, mode: 'lesson', unit, app, profile: env.profileStore.state, rng: createRng(8) });
    assert.equal(started.ok, true);
    return labelsPlayed(started.round);
  };
  const base = labelsFor(undefined);
  assert.deepEqual(labelsFor({}), base);
  assert.deepEqual(labelsFor({ [unit.id]: 'start-9' }), base, 'keine Liste');
  assert.deepEqual(labelsFor({ [unit.id]: [3, null] }), base, 'keine Labels');
  assert.deepEqual(labelsFor(null), base);
});

test('SEITE-ABRUF Die Liste einer anderen Seite wirkt nicht', async () => {
  const env = await setup();
  const unit = env.config.units[1];
  env.appStore.state.missed = { start: ['start-9'] };
  const base = startRound({ config: env.config, mode: 'lesson', unit, app: { ...env.appStore.state, missed: {} }, profile: env.profileStore.state, rng: createRng(8) });
  const other = startRound({ config: env.config, mode: 'lesson', unit, app: env.appStore.state, profile: env.profileStore.state, rng: createRng(8) });
  assert.deepEqual(labelsPlayed(other.round), labelsPlayed(base.round));
});

test('SEITE-ABRUF Schnellrunde und Endgegner ignorieren app.missed', async () => {
  const env = await setup();
  env.appStore.state.missed = { start: ['quick-6'] };
  env.config.units.forEach((u) => { env.appStore.state.stars[u.id] = 1; });
  ['quick', 'boss'].forEach((mode) => {
    const plain = startRound({ config: env.config, mode, app: { ...env.appStore.state, missed: {} }, profile: env.profileStore.state, rng: createRng(6) });
    const withMissedList = startRound({ config: env.config, mode, app: env.appStore.state, profile: env.profileStore.state, rng: createRng(6) });
    assert.deepEqual(labelsPlayed(withMissedList.round), labelsPlayed(plain.round), mode);
  });
});

test('SEITE-ABRUF settleRound speichert die Fehlerkategorien der Runde und ersetzt sie in der nächsten', async () => {
  const env = await setup();
  const unit = env.config.units[0];
  const out = await finishLesson(env, { wrong: true });
  assert.equal(out.saved.ok, true);
  const missed = env.appStore.state.missed[unit.id];
  assert.equal(missed.length, 5, 'fünf Herzen, fünf Fehler im ersten Versuch');
  assert.ok(missed.every((l) => /^start-\d+$/.test(l)));
  const reopened = await openApp(env.handle, env.config.id, appDefaults());
  assert.deepEqual(reopened.state.missed[unit.id], missed, 'gespeichert, auch bei gescheiterter Runde');
  await finishLesson(env);
  assert.deepEqual(env.appStore.state.missed[unit.id], [], 'ersetzt, nicht gesammelt');
});

test('SEITE-ABRUF Das Protokoll bekommt keine neuen Felder', async () => {
  const env = await setup();
  const rows = [];
  env.log = (row) => { rows.push(row); return env.handle.logEvent(row); };
  await finishLesson(env, { wrong: true });
  assert.deepEqual(
    Object.keys(rows[0]).sort(),
    ['accuracy', 'app', 'failed', 'gapDays', 'mode', 'prevAcc', 'score', 'stars', 'type', 'unit', 'xp']
  );
});

test('SEITE-ABRUF Zurücksetzen leert die Fehlerliste der App', () => {
  const app = appDefaults();
  app.missed = { start: ['start-1'] };
  resetAppState(app);
  assert.deepEqual(app.missed, {});
});
