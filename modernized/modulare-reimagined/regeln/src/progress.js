// Fortschritt je Seite: Sterne, Trefferquote, Auffrischen und Empfehlung.
import {
  ALMOST_WEIGHT, DUE_DAYS, DUE_DAYS_STRONG, MAX_STARS, REFRESH_STRONG_ACCURACY, REVIEW_STEPS, STAR_THRESHOLDS,
  WEAK_ACCURACY
} from './constants.js';
import { assertDay, dayDiff } from './dates.js';

const OUTCOMES = new Set(['ok', 'almost', 'bad']);

/**
 * Sterne aus der Trefferquote: 3 ab 90 %, 2 ab 70 %, sonst 1.
 * Eine gescheiterte Runde gibt 0 Sterne, egal wie hoch die Quote war (profile.js:76).
 */
export function starsFor(accuracy, failed) {
  if (failed) return 0;
  if (accuracy >= STAR_THRESHOLDS.three) return 3;
  if (accuracy >= STAR_THRESHOLDS.two) return 2;
  return 1;
}

/**
 * Trefferquote einer Runde: richtige Erstantworten plus halb so viele knapp richtige,
 * geteilt durch die Zahl der ursprünglichen Fragen (quiz.js:147-149).
 * Wiederholungen (retry) zählen nicht, auch wenn sie richtig sind (quiz.js:113-121).
 * Fehlende Fragen zählen als Fehler, weil der Nenner die Originalzahl bleibt.
 * @param {{outcome: 'ok'|'almost'|'bad', retry?: boolean}[]} attempts
 * @param {number} originalCount  Zahl der Fragen, mit denen die Runde begann
 */
export function roundAccuracy(attempts, originalCount) {
  if (!Number.isInteger(originalCount) || originalCount < 1) {
    throw new RangeError(`Originalzahl der Fragen muss ≥ 1 sein: ${originalCount}`);
  }
  let correct = 0;
  let almost = 0;
  for (const attempt of attempts) {
    if (!OUTCOMES.has(attempt.outcome)) throw new TypeError(`Unbekanntes Ergebnis: ${attempt.outcome}`);
    // Nur Erstversuche zählen. Eine Wiederholung hilft der Quote nicht.
    if (attempt.retry) continue;
    if (attempt.outcome === 'ok') correct += 1;
    else if (attempt.outcome === 'almost') almost += 1;
  }
  return (correct + ALMOST_WEIGHT * almost) / originalCount;
}

const starsOf = (app, unitId) => (app.stars && app.stars[unitId]) || 0;

/** Stufe einer Seite in REVIEW_STEPS. Ohne gespeicherte Stufe entscheidet die letzte Genauigkeit, wie bei alten Ständen. */
export function reviewStep(app, unitId) {
  const step = app.box && app.box[unitId];
  if (Number.isInteger(step)) return Math.min(Math.max(step, 0), REVIEW_STEPS.length - 1);
  const acc = app.acc && app.acc[unitId];
  return typeof acc === 'number' && acc >= REFRESH_STRONG_ACCURACY ? REVIEW_STEPS.indexOf(DUE_DAYS_STRONG) : REVIEW_STEPS.indexOf(DUE_DAYS);
}

/**
 * Stufe nach einer Lektionsrunde auf einer fälligen Seite. Sitzt die Seite (ab 2 Sternen), geht es eine Stufe weiter.
 * Sonst beginnt der kurze Abstand von vorn, denn dann war der Abstand zu lang.
 */
export function nextReviewStep(step, stars) {
  return stars >= 2 ? Math.min(step + 1, REVIEW_STEPS.length - 1) : 0;
}

/**
 * Eine Seite ist fällig, wenn sie schon einen Stern hat und der Abstand ihrer Stufe vorbei ist (reviewStep).
 * Seiten ohne Stufe: DUE_DAYS, bei einer letzten Genauigkeit ab REFRESH_STRONG_ACCURACY DUE_DAYS_STRONG.
 */
export function isRefreshDue(app, unitId, day) {
  assertDay(day);
  const last = app.last && app.last[unitId];
  if (!last || starsOf(app, unitId) <= 0) return false;
  return dayDiff(last, day) >= REVIEW_STEPS[reviewStep(app, unitId)];
}

// ISO-Tage ('YYYY-MM-DD') sortieren lexikografisch genauso wie in der Zeit.
const byOldestPractice = (app) => (a, b) => {
  const lastA = app.last[a.id];
  const lastB = app.last[b.id];
  return lastA < lastB ? -1 : lastA > lastB ? 1 : 0;
};

/**
 * Welche Seite als Nächstes? Zuerst die fällige, die am längsten nicht geübt wurde.
 * Sonst die Seite mit der niedrigsten letzten Genauigkeit unter 90 % und weniger als drei Sternen.
 * Gibt null zurück, wenn nichts ansteht (profile.js:84-95).
 * @returns {{unit: object, reason: 'refresh'|'weak'}|null}
 *   reason ist ein Code. Die Oberfläche macht daraus den Text.
 */
export function weakestUnit(app, units, day) {
  assertDay(day);
  const due = units.filter((u) => isRefreshDue(app, u.id, day)).sort(byOldestPractice(app));
  if (due.length) return { unit: due[0], reason: 'refresh' };

  const weak = units
    .filter((u) => typeof (app.acc && app.acc[u.id]) === 'number'
      && app.acc[u.id] < WEAK_ACCURACY
      && starsOf(app, u.id) < MAX_STARS)
    .sort((a, b) => app.acc[a.id] - app.acc[b.id]);
  return weak.length ? { unit: weak[0], reason: 'weak' } : null;
}
