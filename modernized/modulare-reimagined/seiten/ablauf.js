// Ablauf einer App: Lebenszyklus einer Runde (starten, auswerten, speichern, protokollieren) und Zurücksetzen in zwei
// Schritten. Ohne React, damit auch andere Oberflächen und Tests ihn nutzen können. Die Regeln stehen in regeln/, die
// Aufgaben in runde/. Alles ist rein oder async über injizierte Speicher. Die Ansicht dazu steht in rahmen.js.
import { createRound, freshPool, questionKey, uniqueQuestions, withMissed } from '../runde/index.js';
import { starsOf } from '../helfer/index.js';
import { awardXP, finishRound, isRefreshDue, updateStreak, weakestUnit } from '../regeln/index.js';
import { NO_STORAGE } from './name.js';

/** Aufgaben je Runde (Spec RULE-229): Lektion 8, Endgegner 12, Schnellrunde 5, Kapitel-Test 10. Blitz ist nicht enthalten. */
export const ROUND_SIZE = Object.freeze({ lesson: 8, quick: 5, boss: 12, chapter: 10 });

export { NO_STORAGE };
const LEFT_SAVE_FAILED = 'Die XP konnten nicht gespeichert werden.';
export const RESET_DONE = 'Der Fortschritt dieser App ist zurückgesetzt. Name und Gesamt-XP bleiben.';
const NO_TASKS = 'Für diese Runde gibt es noch keine Aufgaben.';
const CHAPTER_LOCKED = 'Der Kapitel-Test öffnet, sobald jede Seite des Kapitels mindestens einen Stern hat.';
const QUICK_LOCKED = 'Übe zuerst eine Seite. Die 2-Minuten-Runde wiederholt, was du schon gelernt hast.';
const BOSS_LOCKED = 'Der Endgegner ist noch gesperrt. Erst braucht jede Seite mindestens einen Stern.';

// Gleicher Aufbau wie legacy/modulare/core/js/profile.js:14 und 16.
export const profileDefaults = () => ({ name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } });
// last und acc steuern Auffrischen und gezieltes Training (legacy profile.js:15).
// seen: Schlüssel der Aufgaben, die richtig beantwortet wurden. Neue Runden bevorzugen andere (runde/src/vielfalt.js).
// chapters: je Kapitel der beste Kapitel-Test { acc, day }.
// missed: je Seite die Kategorien (skill, sonst Etikett) der Fragen, die in der letzten Lektionsrunde im ersten Versuch falsch waren (Fehler-Abruf).
// refreshes: Zahl der bezahlten Auffrischungen (Trophäe refresh, Wochenmission refresh1 zählt separat).
// merged: Quellen, deren Stand schon in diese App übernommen wurde (seiten/uebernahme.js).
export const appDefaults = () => ({ xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {}, seen: {}, missed: {}, refreshes: 0, merged: {}, chapters: {} });
// Obergrenze je App, damit der Stand klein bleibt. Die ältesten Schlüssel fallen zuerst weg.
export const SEEN_MAX = 2000;
export const RIGHT = Object.freeze(new Set(['ok', 'almost']));

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

/** Seiten, die schon geübt sind (mindestens ein Stern). */
export const practisedUnits = (app, units) => units.filter((u) => starsOf(app.stars, u.id) > 0);

/**
 * Welche Seite kommt nach unitId? Die nächste ohne Stern im Pfad, hinten angekommen geht es vorn weiter.
 * Ist nichts mehr offen, die erste fällige. Sonst null. Wer gezielt springt, bleibt so an seiner Stelle im Pfad.
 */
export function followingUnit(app, units, unitId, day) {
  const at = units.findIndex((u) => u.id === unitId);
  const order = [...units.slice(at + 1), ...units.slice(0, Math.max(at, 0))];
  return order.find((u) => starsOf(app.stars, u.id) === 0) || order.find((u) => isRefreshDue(app, u.id, day)) || null;
}

/** Der Kapitel-Test lohnt erst ab zwei Seiten. Bei einer wäre er nur die Lektionsrunde dieser Seite. */
export const hasChapterTest = (group) => group.units.length >= 2;

/** Seiten des Kapitels, die noch keinen Stern haben. Der Test öffnet, wenn es keine mehr gibt. */
export const chapterMissing = (app, group) => group.units.filter((u) => starsOf(app.stars, u.id) === 0);

/**
 * Aufgaben für den Kapitel-Test: abwechselnd aus den Seiten, aus jeder etwa gleich viele. Die Lektionsrunden liefern sie,
 * deshalb braucht keine App eigenen Code. unitId sagt später, welche Seite noch sitzen muss.
 */
export function chapterQuestions(units, lesson, size, rng) {
  const lists = units.map((unit) => lesson(unit, rng).map((question) => ({ ...question, unitId: unit.id })));
  return Array.from({ length: size }, (_, i) => {
    const list = lists[i % lists.length];
    return list[Math.floor(i / lists.length) % list.length];
  });
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
function poolFor(config, mode, unit, rng, practised, group) {
  const rounds = config.rounds || {};
  if (mode === 'chapter') return group && typeof rounds.lesson === 'function' ? () => chapterQuestions(group.units, rounds.lesson, ROUND_SIZE.chapter, rng) : null;
  if (mode === 'lesson') return unit && typeof rounds.lesson === 'function' ? () => rounds.lesson(unit, rng) : null;
  if (mode === 'quick') return typeof rounds.quick === 'function' ? () => rounds.quick(rng, practised) : null;
  if (mode === 'boss') return typeof rounds.boss === 'function' ? () => rounds.boss(rng) : null;
  return null;
}

// Fehlerkategorien der Seite aus dem Speicher. Fehlt der Eintrag oder ist er kaputt, gilt [].
const missedOf = (app, unit) => {
  const list = app && app.missed && unit ? app.missed[unit.id] : null;
  return Array.isArray(list) ? list.filter((l) => typeof l === 'string') : [];
};

/**
 * Startet eine Runde. Gibt { ok, round, mode, unit } oder { ok: false, message } zurück und wirft nie.
 * Der Endgegner startet nur, wenn er offen ist (RULE-206).
 */
export function startRound({ config, mode, unit = null, group = null, app, profile, rng, known = new Set() }) {
  if (!Object.hasOwn(ROUND_SIZE, mode)) return failure('Diese Rundenart gibt es nicht.');
  const unitIds = config.units.map((u) => u.id);
  if (mode === 'boss' && !bossOpen({ app, unitIds, bossUnlocked: config.bossUnlocked, profile })) {
    return failure(BOSS_LOCKED);
  }
  // Die Schnellrunde wiederholt. Sie zieht nur aus Seiten mit Stern, sonst käme ungelernter Stoff ohne Theorie.
  const practised = practisedUnits(app, config.units);
  if (mode === 'quick' && config.rounds?.quick && practised.length === 0) return failure(QUICK_LOCKED);
  if (mode === 'chapter' && group && chapterMissing(app, group).length) return failure(CHAPTER_LOCKED);
  const source = poolFor(config, mode, unit, rng, practised, group);
  if (!source) return failure(NO_TASKS);
  try {
    const size = ROUND_SIZE[mode];
    // Der Test soll alle Seiten treffen. Deshalb gilt hier die Verteilung, nicht der Vorrang neuer Aufgaben.
    const fresh = mode === 'chapter' ? uniqueQuestions(source()) : freshPool(source, size, known);
    if (!Array.isArray(fresh) || fresh.length === 0) return failure(NO_TASKS);
    // Nur Lektionsrunden holen Fehlerkategorien der letzten Runde zurück (Spec 5.2). Ohne Liste bleibt alles wie bisher.
    const missed = mode === 'lesson' ? missedOf(app, unit) : [];
    const recalled = missed.length && config.rounds.recall ? config.rounds.recall(unit, missed, rng) : [];
    const candidates = recalled.length ? uniqueQuestions([...recalled, ...fresh]) : fresh;
    const pool = missed.length ? withMissed(candidates, missed, Math.min(size, candidates.length), rng) : fresh;
    const round = createRound({ pool, size: Math.min(size, pool.length), rng, boss: mode === 'boss' });
    return { ok: true, round, mode, unit, group };
  } catch (error) {
    return failure('Die Aufgaben konnten nicht erzeugt werden.', error);
  }
}

/**
 * Wertet ein Rundenergebnis mit regeln/ aus. Verändert profile und app, wie regeln es tut (RULE-195).
 * levelUp und goalHit kommen von der XP-Gutschrift der Runde selbst, damit eine Stufe nicht verloren geht.
 */
export function evaluateRound({ appId, mode, unit, group = null, roundResult, profile, app, day, badges, unitIds, levelUp = null, goalHit = false }) {
  return finishRound({
    appId,
    mode,
    unit: unit || undefined,
    group: group || undefined,
    failed: roundResult.failed,
    accuracy: roundResult.accuracy,
    wrong: roundResult.wrong,
    almost: roundResult.almost,
    bestCombo: roundResult.bestCombo,
    retryRight: roundResult.retryRight || 0,
    missedSkills: roundResult.missedSkills || [],
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
export function summaryOf({ mode, unit, roundResult, result, weakUnits = [] }) {
  return {
    mode,
    unitId: unit ? unit.id : null,
    groupId: result.groupId ?? null,
    prevBest: result.prevBest ?? null,
    weakUnits,
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
    newBadges: result.newBadges,
    missions: result.missions || []
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
export async function settleRound({ appId, mode, unit, group = null, weakUnits = [], roundResult, profile, app, profileStore, appStore, log, day, badges, unitIds }) {
  // Die XP der Runde zählen zuerst (Profil, App, Tagesziel). Legacy tat das während der Runde (quiz.js).
  const paid = awardXP(profile, app, roundResult.xp, day);
  const result = evaluateRound({
    appId, mode, unit, group, roundResult, profile, app, day, badges, unitIds, levelUp: paid.levelUp, goalHit: paid.goalHit
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
    xp: roundResult.xp,
    // Messung für spätere Auswertung: Abstand zur letzten Übung der Seite und Genauigkeit davor. Keine Person.
    gapDays: result.gapDays,
    prevAcc: result.prevAcc,
    // Nur der Kapitel-Test nennt sein Kapitel. Alle anderen Zeilen behalten ihre Form.
    ...(group ? { group: group.id } : {})
  });
  return { result, saved, logged, summary: summaryOf({ mode, unit, roundResult, result, weakUnits }) };
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
