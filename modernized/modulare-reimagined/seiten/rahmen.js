// Rahmen einer App: Lebenszyklus einer Runde (starten, auswerten, speichern, protokollieren), Zurücksetzen
// in zwei Schritten und die Seite der App. Die Regeln stehen in regeln/, die Aufgaben in runde/.
// Die Modellfunktionen oben sind rein bzw. async über injizierte Speicher. Die Komponenten unten zeichnen nur.
import { createElement, useReducer, useState } from 'react';
import { BLITZ_SECONDS, createRound, freshPool, questionKey } from '../runde/index.js';
import { createRng } from '../helfer/index.js';
import { REFRESH_BONUS_XP, awardXP, currentStreak, dailyXP, finishRound, isRefreshDue, updateStreak, weakestUnit } from '../regeln/index.js';
import { Button, StarRow, starsOf } from '../komponenten/ui.js';
import { TrackLabel } from '../komponenten/tracks.js';
import { richText } from '../komponenten/rich.js';
import { TheoryPage } from '../komponenten/theory.js';
import { BlitzPlay, startBlitz } from './blitz.js';
import { NO_STORAGE } from './name.js';
import { AppHeader, AppHome } from './apphome.js';
import { Play } from './spiel.js';
import { saveName } from './name.js';
import { Ergebnis, messagesOf, resultModel, wordsFor } from './ergebnis.js';
import { Sicherung } from './sicherung.js';
import { unitTrack } from './registry.js';

const h = createElement;

/** Aufgaben je Runde (Spec RULE-229): Lektion 8, Endgegner 12, Schnellrunde 5. Blitz ist nicht enthalten. */
export const ROUND_SIZE = Object.freeze({ lesson: 8, quick: 5, boss: 12 });

export { NO_STORAGE } from './name.js';
const LEFT_SAVE_FAILED = 'Die XP konnten nicht gespeichert werden.';
export const RESET_DONE = 'Der Fortschritt dieser App ist zurückgesetzt. Name und Gesamt-XP bleiben.';
const NO_TASKS = 'Für diese Runde gibt es noch keine Aufgaben.';
const BOSS_LOCKED = 'Der Endgegner ist noch gesperrt. Erst braucht jede Seite mindestens einen Stern.';

// Gleicher Aufbau wie legacy/modulare/core/js/profile.js:14 und 16.
export const profileDefaults = () => ({ name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } });
// last und acc steuern Auffrischen und gezieltes Training (legacy profile.js:15).
// seen: Schlüssel der Aufgaben, die richtig beantwortet wurden. Neue Runden bevorzugen andere (runde/src/vielfalt.js).
export const appDefaults = () => ({ xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {}, seen: {} });
// Obergrenze je App, damit der Stand klein bleibt. Die ältesten Schlüssel fallen zuerst weg.
export const SEEN_MAX = 2000;
const RIGHT = Object.freeze(new Set(['ok', 'almost']));

/** Schlüssel der schon richtig beantworteten Aufgaben als Menge. */
export const knownOf = (app) => new Set(Object.keys(app.seen || {}));

/** Merkt eine richtig beantwortete Aufgabe und speichert im Hintergrund. Gibt nichts zurück. */
export function rememberRight(app, question, appStore = null) {
  if (!question) return;
  const seen = { ...(app.seen || {}), [questionKey(question)]: true };
  const keys = Object.keys(seen);
  app.seen = keys.length > SEEN_MAX ? Object.fromEntries(keys.slice(keys.length - SEEN_MAX).map((k) => [k, true])) : seen;
  if (appStore) appStore.save();
}

// Gründe für die Empfehlung, als Text. Der Code kommt aus regeln/ (weakestUnit).
export const REASON_TEXT = Object.freeze({ refresh: 'Zeit zum Auffrischen', weak: 'Hier ist noch Luft nach oben' });

const failure = (message, cause) => ({ ok: false, message, cause });

/** Kalendertag YYYY-MM-DD in der Ortszeit (legacy profile.js:22-23). */
export function dayOf(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Ist der Endgegner offen? RULE-206: erst wenn jede Seite mindestens einen Stern hat. Eine App kann
 * über bossUnlocked selbst entscheiden (legacy shell.js:43). Ohne Seiten ist er offen (RULE-134).
 */
export function bossOpen({ app, unitIds, bossUnlocked, profile }) {
  if (typeof bossUnlocked === 'function') return Boolean(bossUnlocked({ app, profile }));
  return unitIds.every((id) => starsOf(app.stars, id) > 0);
}

// Die Quelle der Aufgaben für eine Rundenart. Ohne Quelle gibt es die Runde nicht. Der Zufall kommt von außen
// (rng), damit die Aufgaben einer Runde reproduzierbar sind.
function poolFor(config, mode, unit, rng) {
  const rounds = config.rounds || {};
  if (mode === 'lesson') return unit && typeof rounds.lesson === 'function' ? () => rounds.lesson(unit, rng) : null;
  if (mode === 'quick') return typeof rounds.quick === 'function' ? () => rounds.quick(rng) : null;
  if (mode === 'boss') return typeof rounds.boss === 'function' ? () => rounds.boss(rng) : null;
  return null;
}

/**
 * Startet eine Runde. Gibt { ok, round, mode, unit } oder { ok: false, message } zurück und wirft nie.
 * Der Endgegner startet nur, wenn er offen ist (RULE-206).
 */
export function startRound({ config, mode, unit = null, app, profile, rng, known = new Set() }) {
  if (!Object.hasOwn(ROUND_SIZE, mode)) return failure('Diese Rundenart gibt es nicht.');
  const unitIds = config.units.map((u) => u.id);
  if (mode === 'boss' && !bossOpen({ app, unitIds, bossUnlocked: config.bossUnlocked, profile })) {
    return failure(BOSS_LOCKED);
  }
  const source = poolFor(config, mode, unit, rng);
  if (!source) return failure(NO_TASKS);
  try {
    const pool = freshPool(source, ROUND_SIZE[mode], known);
    if (!Array.isArray(pool) || pool.length === 0) return failure(NO_TASKS);
    const round = createRound({ pool, size: Math.min(ROUND_SIZE[mode], pool.length), rng, boss: mode === 'boss' });
    return { ok: true, round, mode, unit };
  } catch (error) {
    return failure('Die Aufgaben konnten nicht erzeugt werden.', error);
  }
}

/**
 * Wertet ein Rundenergebnis mit regeln/ aus. Verändert profile und app, wie regeln es tut (RULE-195).
 * levelUp und goalHit kommen von der XP-Gutschrift der Runde selbst, damit eine Stufe nicht verloren geht.
 */
export function evaluateRound({ appId, mode, unit, roundResult, profile, app, day, badges, unitIds, levelUp = null, goalHit = false }) {
  return finishRound({
    appId,
    mode,
    unit: unit || undefined,
    failed: roundResult.failed,
    accuracy: roundResult.accuracy,
    wrong: roundResult.wrong,
    almost: roundResult.almost,
    bestCombo: roundResult.bestCombo,
    score: roundResult.score || 0,
    levelUp,
    goalHit,
    profile,
    app,
    day,
    badges,
    unitIds
  });
}

/** Die Zahlen, die die Ergebnisansicht braucht. Alles aus Runde und Auswertung, nichts aus der Uhr. */
export function summaryOf({ mode, unit, roundResult, result }) {
  return {
    mode,
    unitId: unit ? unit.id : null,
    failed: roundResult.failed,
    accuracy: roundResult.accuracy,
    correct: roundResult.correct,
    wrong: roundResult.wrong,
    almost: roundResult.almost,
    bestCombo: roundResult.bestCombo,
    relearned: roundResult.relearned,
    score: roundResult.score || 0,
    xp: roundResult.xp,
    bonus: result.bonus,
    stars: result.stars,
    refresh: result.refresh,
    levelUp: result.levelUp,
    goalHit: result.goalHit,
    newBadges: result.newBadges
  };
}

// Profil und App-Stand zusammen speichern. Fehlt ein Speicher, gibt es nichts zu speichern (RULE-202).
async function saveBoth(profileStore, appStore) {
  if (!profileStore || !appStore) return { ok: false, error: NO_STORAGE };
  const results = await Promise.all([profileStore.save(), appStore.save()]);
  const failed = results.find((result) => !result.ok);
  return failed ? { ok: false, error: failed.error } : { ok: true };
}

/**
 * Ein Rundenende in einem Ablauf: auswerten, speichern, protokollieren (RULE-195). Das Ergebnis wird
 * erst angezeigt, wenn dieser Ablauf fertig ist. Ein Fehler beim Speichern oder Protokollieren
 * bricht die Anzeige nicht ab, er kommt als Meldung zurück (SEITE-SPEICHER-FEHLER).
 * Protokoll: App, Seite (oder null) und Ergebnisfelder, wie legacy shell.js:104 (RULE-247).
 */
export async function settleRound({ appId, mode, unit, roundResult, profile, app, profileStore, appStore, log, day, badges, unitIds }) {
  // Die XP der Runde zählen zuerst (Profil, App, Tagesziel). Legacy tat das während der Runde (quiz.js).
  const paid = awardXP(profile, app, roundResult.xp, day);
  const result = evaluateRound({
    appId, mode, unit, roundResult, profile, app, day, badges, unitIds, levelUp: paid.levelUp, goalHit: paid.goalHit
  });
  const saved = await saveBoth(profileStore, appStore);
  const logged = await log({
    app: appId,
    type: 'round',
    mode,
    unit: unit ? unit.id : null,
    accuracy: roundResult.accuracy,
    stars: result.stars,
    failed: roundResult.failed,
    score: roundResult.score || 0,
    xp: roundResult.xp
  });
  return { result, saved, logged, summary: summaryOf({ mode, unit, roundResult, result }) };
}

/**
 * Anzahl beantworteter Fragen einer laufenden Runde. Im Rückmeldungsschritt zählt die gerade beantwortete mit.
 * Eine falsche Antwort zählt auch, sie bringt nur keine XP.
 */
const answeredOf = (cur) => {
  if (!cur) return 0;
  return cur.status === 'feedback' ? cur.index + 1 : cur.index;
};

/**
 * Verlassen einer Runde (RULE-193, RULE-208). Es gibt kein Rundenergebnis, keine Sterne und kein Protokoll.
 * Die XP der bisherigen Antworten bleiben und laufen über denselben awardXP-Pfad wie eine beendete Runde.
 * Hat die Person mindestens eine Frage beantwortet, zählt der Tag für die Serie, mit derselben updateStreak-Regel
 * wie eine beendete Runde. Sonst ändert sich nichts. Übungstag je Seite, Sterne, Trophäen und lastApp bleiben unberührt.
 */
export async function settleLeave({ round, profile, app, profileStore, appStore, day }) {
  const cur = round.current();
  const earned = cur ? cur.xp : 0;
  const answered = answeredOf(cur);
  round.leave();
  return settleUnscored({ earned, answered, profile, app, profileStore, appStore, day });
}

// Gemeinsamer Teil beim Verlassen, für Runde und Blitz: XP gutschreiben, Tag für die Serie zählen, speichern.
async function settleUnscored({ earned, answered, profile, app, profileStore, appStore, day }) {
  if (answered === 0) return { earned, answered, saved: { ok: true }, paid: null, streakCounted: false };
  const paid = earned > 0 ? awardXP(profile, app, earned, day) : null;
  updateStreak(profile, day);
  const saved = await saveBoth(profileStore, appStore);
  return { earned, answered, saved, paid, streakCounted: true };
}

/** Blitz verlassen: kein Ergebnis, aber die XP der bisherigen Treffer bleiben (wie bei einer Runde, RULE-193). */
export function settleBlitzLeave({ earned, answered, profile, app, profileStore, appStore, day }) {
  return settleUnscored({ earned, answered, profile, app, profileStore, appStore, day });
}

/** Der Hinweis nach dem Verlassen. Ehrlich: Die XP stehen gut, die Runde zählt nicht (RULE-193). */
export function leaveNotice({ earned, answered, saved }) {
  if (answered === 0) return 'Runde nicht gewertet. Es gab noch keine Antwort.';
  if (!saved.ok) return `Runde nicht gewertet. ${LEFT_SAVE_FAILED}`;
  const xp = earned > 0 ? `${earned} XP wurden gutgeschrieben.` : 'Es gab keine XP.';
  return `Runde nicht gewertet. ${xp} Der Übungstag zählt für die Serie.`;
}

/**
 * Zurücksetzen in zwei Schritten (RULE-133). Der erste Klick öffnet die Bestätigung, der zweite setzt zurück.
 * Jede andere Navigation bricht die Bestätigung ab (legacy shell.js:128). Ein zweiter Klick ohne ersten tut nichts.
 */
export function resetStep(phase, event) {
  if (event === 'start') return { phase: 'ask', reset: false };
  if (event === 'confirm' && phase === 'ask') return { phase: 'idle', reset: true };
  return { phase: 'idle', reset: false };
}

/** Den App-Stand auf die Standardwerte setzen. Profil, Name und Gesamt-XP bleiben (RULE-133, RULE-205). */
export function resetAppState(app) {
  for (const key of Object.keys(app)) delete app[key];
  Object.assign(app, appDefaults());
  return app;
}

/** Setzt den Stand zurück und speichert. Ohne Speicher wird nur der Zustand im Arbeitsspeicher geleert. */
export async function resetApp(app, appStore) {
  resetAppState(app);
  if (!appStore) return { ok: false, error: NO_STORAGE };
  return appStore.save();
}

/** Empfehlung für das Training einer App: erst fällig, sonst die schwächste Seite (RULE-242). */
export function recommendationOf(app, units, day) {
  const found = weakestUnit(app, units, day);
  if (!found) return null;
  return { unit: found.unit, code: found.reason, reason: REASON_TEXT[found.reason] };
}

// Eine Zufallsfolge je Runde aus der Uhr. Tests geben ihre eigene rng-Funktion direkt mit.
const seedNow = () => Math.floor(Date.now()) % 4294967296;

export { Play } from './spiel.js';

// Die Theorie einer Seite mit Rückweg. Der Übungsknopf startet die Lektionsrunde dieser Seite.
// Eine App kann ihre Theorie selbst zeichnen (config.Theory, z. B. mit Spielzeugen). Sonst gilt die Standardseite.
export function TheoryScreen({ config, unit, onBack, onStart }) {
  const page = config.Theory
    ? h(config.Theory, { unit, config, onStart: () => onStart() })
    : h(TheoryPage, {
      unit,
      lesson: config.lessons[unit.id],
      notes: config.notes[unit.id],
      tracks: config.tracks,
      onStart: () => onStart()
    });
  // Wie legacy shell.js:renderTheory: ein Textlink "← Zum Lernpfad" über der Seite.
  return h('div', { className: 'seiten' }, h('button', { type: 'button', className: 'link back', onClick: onBack }, '← Zum Lernpfad'), page);
}

/**
 * Die App-Seite. Hält den Ablauf der Ansicht: Start, Spiel, Speichern, Ergebnis. Die Entscheidungen
 * stehen in den Modellfunktionen oben. Ohne Speicher läuft die Seite mit einem Stand im Arbeitsspeicher.
 */
export function AppFrame({ app, profileStore, day, storage }) {
  const { config, appStore, entry } = app;
  const words = wordsFor(config);
  const [memoryProfile] = useState(profileDefaults);
  const [memoryApp] = useState(appDefaults);
  const profile = profileStore ? profileStore.state : memoryProfile;
  const appState = appStore ? appStore.state : memoryApp;
  const unitIds = config.units.map((u) => u.id);
  const [screen, setScreen] = useState('home');
  const [session, setSession] = useState(null);
  const [settled, setSettled] = useState(null);
  const [notice, setNotice] = useState(null);
  const [resetPhase, setResetPhase] = useState('idle');
  const [theoryUnit, setTheoryUnit] = useState(null);
  const [blitz, setBlitz] = useState(null);
  const [, bump] = useReducer((n) => n + 1, 0);
  // Ohne echten Speicher sagt die Seite das. Die Meldung der App gibt es nur bei blockiertem Speicher.
  const storeMessage = app.storeMessage || (storage.status === 'memory' ? storage.message : null);
  const persistent = storage.status === 'ok';
  const logRow = (row) => (storage.handle ? storage.handle.logEvent(row) : Promise.resolve({ ok: false, error: NO_STORAGE }));

  function begin(mode, unit = null) {
    const started = startRound({ config, mode, unit, app: appState, profile, rng: createRng(seedNow()), known: knownOf(appState) });
    if (!started.ok) {
      setNotice(started.message);
      return;
    }
    setNotice(null);
    setSession(started);
    setScreen('play');
  }

  function peek() {
    session.round.peek();
    bump();
  }

  function answer(response) {
    const question = session.round.current()?.question;
    const step = session.round.submit(response);
    if (step.accepted && RIGHT.has(step.outcome)) rememberRight(appState, question, appStore);
    bump();
  }

  async function advance() {
    const step = session.round.next();
    if (!step.done) {
      bump();
      return;
    }
    setScreen('saving');
    const outcome = await settleRound({
      appId: entry.id,
      mode: session.mode,
      unit: session.unit,
      roundResult: step.result,
      profile,
      app: appState,
      profileStore,
      appStore,
      log: logRow,
      day,
      badges: config.badges,
      unitIds
    });
    setSession(null);
    setSettled(outcome);
    setScreen('result');
  }

  function home() {
    setSession(null);
    setBlitz(null);
    setSettled(null);
    setNotice(null);
    setResetPhase('idle');
    setTheoryUnit(null);
    setScreen('home');
  }

  // Blitz hat keine Seite und keine Runde aus rounds (Legacy: shell.js startBlitzRound).
  function beginBlitz() {
    const started = startBlitz({ config, rng: createRng(seedNow()), known: knownOf(appState), onRight: (q) => rememberRight(appState, q, appStore) });
    if (!started.ok) {
      setNotice(started.message);
      return;
    }
    setNotice(null);
    setBlitz(started.run);
    setScreen('blitz');
  }

  // Die Zeit ist um: der Blitz wird wie eine Runde ausgewertet, nur ohne Sterne (regeln/round.js).
  async function finishBlitz(roundResult) {
    setScreen('saving');
    const outcome = await settleRound({
      appId: entry.id,
      mode: 'blitz',
      unit: null,
      roundResult,
      profile,
      app: appState,
      profileStore,
      appStore,
      log: logRow,
      day,
      badges: config.badges,
      unitIds
    });
    setBlitz(null);
    setSettled(outcome);
    setScreen('result');
  }

  async function leaveBlitz() {
    const { earned, answered } = blitz.leave();
    const outcome = await settleBlitzLeave({ earned, answered, profile, app: appState, profileStore, appStore, day });
    home();
    setNotice(leaveNotice(outcome));
  }

  // Erst die Theorie der Seite, dann die Übung (AGENTS.md: Theorie, direkt danach Übung).
  function study(unit) {
    setNotice(null);
    setTheoryUnit(unit);
    setScreen('theory');
  }

  // Verlassen zahlt die XP der Runde aus, wertet die Runde aber nicht (RULE-193).
  async function leave() {
    if (!session) {
      home();
      return;
    }
    const outcome = await settleLeave({ round: session.round, profile, app: appState, profileStore, appStore, day });
    home();
    setNotice(leaveNotice(outcome));
  }

  async function reset(event) {
    const step = resetStep(resetPhase, event);
    setResetPhase(step.phase);
    if (!step.reset) return;
    const done = await resetApp(appState, appStore);
    setNotice(done.ok ? RESET_DONE : done.error);
    bump();
  }

  // Kopfleiste und Hauptbereich wie legacy/modulare/index.html der App (header.top, main#app).
  const frame = (content, unit = null) => h(
    'div',
    { className: 'shell' },
    h(AppHeader, { config, profile, words, onHome: home, day }),
    h('main', { id: 'app', style: unit ? { '--lc': unit.color } : undefined }, content)
  );

  if (screen === 'play' && session) {
    return frame(h(Play, { session, praise: words.praise, inputChars: config.inputChars || [], onAnswer: answer, onNext: advance, onLeave: leave, onPeek: peek }), session.unit);
  }
  if (screen === 'blitz' && blitz) {
    return frame(h(BlitzPlay, { run: blitz, onFinish: finishBlitz, onLeave: leaveBlitz }));
  }
  if (screen === 'theory' && theoryUnit) {
    return frame(h(TheoryScreen, { config, unit: theoryUnit, onBack: home, onStart: () => begin('lesson', theoryUnit) }), theoryUnit);
  }
  if (screen === 'saving') {
    return frame(h('section', { className: 'card' }, h('p', null, 'Ergebnis wird gespeichert …')));
  }
  if (screen === 'result' && settled) {
    const onAction = (id) => {
      if (id === 'home') home();
      else if (id === 'theory') study(config.units.find((u) => u.id === settled.summary.unitId));
      else if (settled.summary.mode === 'blitz') beginBlitz();
      else begin(settled.summary.mode, settled.summary.unitId ? config.units.find((u) => u.id === settled.summary.unitId) : null);
    };
    return frame(h(Ergebnis, {
      model: resultModel(settled.summary, { profile, day, words }),
      messages: messagesOf(settled),
      onAction
    }));
  }
  const rec = recommendationOf(appState, config.units, day);
  const open = bossOpen({ app: appState, unitIds, bossUnlocked: config.bossUnlocked, profile });
  async function saveNameAndRedraw(raw) {
    await saveName(profileStore, raw);
    bump();
  }
  return frame(h(AppHome, {
    config, app: appState, profile, day, rec, open, notice, storeMessage, persistent, resetPhase, profileStore,
    onStudy: study,
    onStart: (mode, unit) => (mode === 'blitz' ? beginBlitz() : begin(mode, unit || null)),
    onReset: reset,
    onName: saveNameAndRedraw,
    footer: h(Sicherung, { handle: storage.handle, day, includeName: true })
  }));
}
