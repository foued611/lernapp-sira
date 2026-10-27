// Auswertung einer beendeten Runde (rounds.js): Sterne, Auffrischen, Bestwerte, Endgegner,
// Serie und Trophäen. Verändert profile und app. Das Ergebnis ist ein neues Objekt.
import { BOSS_BONUS_XP, MISSION_REWARD_XP, REFRESH_BONUS_XP } from './constants.js';
import { assertDay, dayDiff } from './dates.js';
import { currentStreak, updateStreak } from './streak.js';
import { isRefreshDue, starsFor } from './progress.js';
import { awardXP } from './xp.js';
import { evaluateTrophyRule } from './trophies.js';
import { recordMission } from './missions.js';

const MODES = new Set(['lesson', 'boss', 'quick', 'blitz']);

// Bonus-XP gutschreiben und Niveau-Aufstieg oder Tagesziel in das Ergebnis übernehmen.
function payBonus(ctx, amount) {
  const { result, profile, app, day } = ctx;
  result.bonus += amount;
  const paid = awardXP(profile, app, amount, day);
  if (paid.levelUp) result.levelUp = paid.levelUp;
  if (paid.goalHit) result.goalHit = true;
}

// Übungstag, Genauigkeit und Sterne einer Lektionsrunde speichern.
function settleLesson(ctx, unitId, missedLabels) {
  const { result, app, day } = ctx;
  // Auffrischen wird vor dem Speichern des Übungstags geprüft. Danach wäre die Seite nicht mehr fällig.
  // Eine gescheiterte Runde bekommt keinen Bonus (rounds.js:19).
  if (isRefreshDue(app, unitId, day) && !result.failed) {
    result.refresh = true;
    app.refreshes = (app.refreshes || 0) + 1;
    payBonus(ctx, REFRESH_BONUS_XP);
  }
  app.last[unitId] = day;
  app.acc[unitId] = result.accuracy;
  // Fehlerkategorien für den Abruf (Spec 5.2). Ersetzt den alten Stand, sammelt nicht. Auch eine gescheiterte Runde speichert.
  app.missed = app.missed || {};
  app.missed[unitId] = Array.isArray(missedLabels) ? [...missedLabels] : [];
  // Sterne gehen nur nach oben. Ein schwächerer Versuch nimmt keinen Stern weg (rounds.js:28).
  // Ohne Stern bleibt der Eintrag leer (RULE-189).
  if (result.stars > ((app.stars && app.stars[unitId]) || 0)) app.stars[unitId] = result.stars;
}

// Wochenmissionen verbuchen, nachdem die Runde ihre eigenen XP gezahlt hat. Mehrere Missionen in einer Runde
// gehen als eine Gutschrift über payBonus, so meldet sich ein Niveau-Aufstieg nur einmal.
// Eine gescheiterte Runde zählt nicht, wie beim Auffrischen.
// Der Blitz zählt nicht für die starke Runde: seine "Genauigkeit" ist Punkte durch Antworten, keine echte (R12).
// Das Profil gilt für alle Apps, deshalb heißt eine Seite im Wochenblock "app/seite": gleiche Seiten-IDs
// in zwei Apps sind zwei Seiten.
function settleMissions(ctx, appId, unitId) {
  const { result, profile, day } = ctx;
  if (result.failed) return;
  const unit = unitId ? `${appId}/${unitId}` : null;
  const event = { unit, refreshed: result.refresh, accuracy: result.accuracy, strongEligible: result.mode !== 'blitz' };
  const { completed } = recordMission(profile, event, day);
  if (completed.length) payBonus(ctx, completed.length * MISSION_REWARD_XP);
}

/**
 * @param {object} input
 * @param {string} input.appId          Kennung der App (landet in profile.lastApp)
 * @param {'lesson'|'boss'|'quick'|'blitz'} input.mode
 * @param {{id: string}} [input.unit]   Seite; Pflicht bei mode 'lesson'
 * @param {boolean} [input.failed]
 * @param {number} input.accuracy       0 bis 1, berechnet mit roundAccuracy
 * @param {number} [input.wrong]
 * @param {number} [input.almost]
 * @param {number} [input.bestCombo]
 * @param {number} [input.retryRight]   richtige Wiederholungen der Runde (zweiter Versuch), kommt aus dem Rundenergebnis
 * @param {string[]} [input.missedLabels] Labels der im ersten Versuch falschen Fragen (Rundenergebnis), nur Lektionsrunden
 * @param {number} [input.score]        Punkte, nur für den Blitz-Bestwert
 * @param {number|null} [input.levelUp] Niveau-Aufstieg, den schon die Runde selbst ausgelöst hat
 * @param {boolean} [input.goalHit]     Tagesziel, das schon die Runde selbst erreicht hat
 * @param {{id: string, rule: object}[]} [input.badges]
 * @param {string[]} [input.unitIds]
 * @param {object} input.profile
 * @param {object} input.app
 * @param {string} input.day            Tag der Runde als YYYY-MM-DD
 */
export function finishRound(input) {
  const {
    appId, mode, unit, failed = false, accuracy, wrong = 0, almost = 0, bestCombo = 0, score = 0, retryRight = 0, missedLabels = [],
    levelUp = null, goalHit = false, badges = [], unitIds = [], profile, app, day
  } = input;
  assertDay(day);
  if (!MODES.has(mode)) throw new TypeError(`Unbekannter Rundenmodus: ${mode}`);
  if (mode === 'lesson' && !(unit && unit.id)) throw new TypeError('Lektionsrunde ohne Seite');
  if (!(accuracy >= 0 && accuracy <= 1)) throw new RangeError(`Genauigkeit muss zwischen 0 und 1 liegen: ${accuracy}`);

  // Blitz vergibt nie Sterne (rounds.js:11).
  const stars = mode === 'blitz' ? 0 : starsFor(accuracy, failed);
  // Der alte Wert muss vor settleLesson gelesen werden, das app.acc überschreibt. Nur Lektionsrunden haben einen.
  const prevAcc = mode === 'lesson' && app.acc ? (app.acc[unit.id] ?? null) : null;
  // Ebenso der letzte Übungstag der Seite: settleLesson setzt app.last auf heute. Ohne Eintrag null.
  const lastDay = mode === 'lesson' && app.last ? app.last[unit.id] : undefined;
  const gapDays = lastDay ? dayDiff(lastDay, day) : null;
  const result = {
    mode, failed, accuracy, wrong, almost, bestCombo, score, retryRight, prevAcc, gapDays,
    unitId: mode === 'lesson' ? unit.id : null,
    stars, bonus: 0, refresh: false, levelUp, goalHit, newBadges: []
  };
  const ctx = { result, profile, app, day };

  app.stars = app.stars || {};
  app.last = app.last || {};
  app.acc = app.acc || {};
  app.best = app.best || {};
  app.badges = app.badges || {};

  if (mode === 'lesson') settleLesson(ctx, unit.id, missedLabels);
  if (mode === 'blitz' && score > (app.best.blitz || 0)) app.best.blitz = score;
  // Der Endgegner zahlt nur bei einem Sieg (RULE-071).
  if (mode === 'boss' && !failed) {
    payBonus(ctx, BOSS_BONUS_XP);
    app.best.boss = true;
  }

  settleMissions(ctx, appId, result.unitId);

  updateStreak(profile, day);
  profile.lastApp = appId;

  const state = { profile, app, streak: currentStreak(profile, day) };
  // Eine Trophäe wird nur einmal vergeben. Danach zählt sie als bekannt.
  result.newBadges = badges.filter((b) => !app.badges[b.id] && evaluateTrophyRule(b.rule, state, result, unitIds));
  result.newBadges.forEach((b) => { app.badges[b.id] = true; });
  return result;
}
