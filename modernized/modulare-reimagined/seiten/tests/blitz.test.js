// Blitz: Lauf, Treffer und Combo, Auswertung wie eine Runde ohne Sterne, Verlassen und Ergebnis-Ansicht.
// Die Uhr ist eine Zahl, die der Test vorstellt. Der Zufall ist ein Seed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../helfer/index.js';
import { openApp, openProfile } from '../../speicher/index.js';
import { appDefaults, profileDefaults, settleBlitzLeave, settleRound } from '../rahmen.js';
import { blitzRoundResult, startBlitz } from '../blitz.js';
import { resultModel, wordsFor } from '../ergebnis.js';
import { configOf, DAY, memoryHandle, UNIT_IDS } from './helpers.js';

const BLITZ_BADGE = { id: 'blitz10', n: 'Blitzrechner', d: '10 richtige im Blitz', rule: { type: 'blitz', min: 10 } };

function clock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms) => { t += ms; } };
}

function runOf(config, clk) {
  const started = startBlitz({ config, rng: createRng(1), now: clk.now });
  assert.equal(started.ok, true);
  return started.run;
}

test('RULE-229 Ohne Blitz in der App gibt es keinen Lauf', () => {
  const started = startBlitz({ config: configOf({ blitz: false }), rng: createRng(1), now: () => 0 });
  assert.equal(started.ok, false);
  assert.match(started.message, /keinen Blitz/);
});

test('RULE-166 Treffer zählen und bauen die Combo auf, ein Fehler setzt sie zurück', () => {
  const clk = clock();
  const run = runOf(configOf(), clk);
  assert.equal(run.pick('richtig').outcome, 'ok');
  assert.equal(run.pick('richtig').outcome, 'ok');
  assert.equal(run.current().score, 2);
  assert.equal(run.current().combo, 2);
  assert.equal(run.pick('falsch').outcome, 'bad');
  assert.equal(run.current().combo, 0);
  assert.equal(run.current().score, 2);
});

test('RULE-229 Vor Ablauf der Zeit gibt es kein Ergebnis, danach keine Antwort mehr', () => {
  const clk = clock();
  const run = runOf(configOf(), clk);
  run.pick('richtig');
  assert.equal(run.finish(), null);
  clk.advance(45_000);
  assert.equal(run.pick('richtig').accepted, false);
  const result = run.finish();
  assert.equal(result.mode, 'blitz');
  assert.equal(result.score, 1);
  assert.equal(result.xp, 5);
  assert.equal(run.finish(), result, 'ein zweiter Aufruf liefert dasselbe Ergebnis');
});

test('RULE-195 Die Genauigkeit zählt richtige Antworten an allen Antworten', () => {
  assert.deepEqual(blitzRoundResult({ score: 3, xp: 15, bestCombo: 3 }, 4).accuracy, 0.75);
  assert.equal(blitzRoundResult({ score: 0, xp: 0, bestCombo: 0 }, 0).accuracy, 0);
  assert.equal(blitzRoundResult({ score: 3, xp: 15, bestCombo: 3 }, 4).failed, false);
});

test('RULE-193 Verlassen zahlt die XP der Treffer aus, ohne Auswertung', async () => {
  const clk = clock();
  const config = configOf();
  const handle = await memoryHandle();
  const profileStore = await openProfile(handle, profileDefaults());
  const appStore = await openApp(handle, config.id, appDefaults());
  const run = runOf(config, clk);
  run.pick('richtig');
  const { earned, answered } = run.leave();
  assert.equal(earned, 5);
  assert.equal(answered, 1);
  const outcome = await settleBlitzLeave({
    earned, answered, profile: profileStore.state, app: appStore.state, profileStore, appStore, day: DAY
  });
  assert.equal(outcome.saved.ok, true);
  assert.equal(profileStore.state.xp, 5);
  assert.equal(appStore.state.best.blitz, undefined, 'Verlassen ist kein Rundenergebnis');
});

test('RULE-195 Ein beendeter Blitz setzt den Bestwert, gibt Trophäe und keine Sterne', async () => {
  const clk = clock();
  const config = configOf();
  config.badges = [...config.badges, BLITZ_BADGE];
  const handle = await memoryHandle();
  const profileStore = await openProfile(handle, profileDefaults());
  const appStore = await openApp(handle, config.id, appDefaults());
  const run = runOf(config, clk);
  for (let i = 0; i < 10; i += 1) run.pick('richtig');
  clk.advance(45_000);
  const outcome = await settleRound({
    appId: config.id, mode: 'blitz', unit: null, roundResult: run.finish(),
    profile: profileStore.state, app: appStore.state, profileStore, appStore,
    log: (row) => handle.logEvent(row), day: DAY, badges: config.badges, unitIds: UNIT_IDS
  });
  assert.equal(outcome.summary.score, 10);
  assert.equal(outcome.summary.stars, 0);
  assert.equal(appStore.state.best.blitz, 10);
  assert.deepEqual(outcome.summary.newBadges.map((b) => b.id), ['blitz10']);
  assert.equal(outcome.logged.ok, true);
});

test('RULE-195 Die Ergebnis-Ansicht zeigt Blitz ohne Sterne und mit Blitz-Titel', () => {
  const model = resultModel(
    { mode: 'blitz', failed: false, accuracy: 0.5, stars: 0, score: 12, xp: 60, bonus: 0, bestCombo: 4, newBadges: [], refresh: false, goalHit: false, levelUp: null },
    { profile: profileDefaults(), day: DAY, words: wordsFor(configOf()) }
  );
  assert.equal(model.stars, null);
  assert.equal(model.title, 'Blitzschnell!');
  assert.equal(model.facts[0].value, 12);
  assert.equal(model.celebrate, true);
});
