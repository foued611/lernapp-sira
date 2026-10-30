// Auswertung einer beendeten Runde (rounds.js): Sterne, Auffrischen, Bestwerte, Endgegner,
// Serie und Trophäen. Verändert profile und app. Das Ergebnis ist ein neues Objekt.
import { BOSS_BONUS_XP, MISSION_REWARD_XP, REFRESH_BONUS_XP } from './constants.js';
import { assertDay, dayDiff } from './dates.js';
import { currentStreak, updateStreak } from './streak.js';
import { isRefreshDue, nextReviewStep, reviewStep, starsFor } from './progress.js';
import { awardXP } from './xp.js';
import { evaluateTrophyRule } from './trophies.js';
import { recordMission } from './missions.js';

const MODES = new Set(['lesson', 'boss', 'quick', 'blitz', 'chapter']);

// Bonus-XP gutschreiben und Niveau-Aufstieg oder Tagesziel in das Ergebnis übernehmen.
function payBonus(ctx, amount) {
  const { result, profile, app, day } = ctx;
  result.bonus += amount;
  const paid = awardXP(profile, app, amount, day);
  // Mehrere Gutschriften können mehrere Stufen überspringen. Gemeldet wird die höchste erreichte Stufe.
  if (paid.levelUp) result.levelUp = Math.max(result.levelUp || 0, paid.levelUp);
  if (paid.goalHit) result.goalHit = true;
}

// Übungstag, Genauigkeit und Sterne einer Lektionsrunde speichern.
function settleLesson(ctx, unitId, missedSkills) {
  const { result, app, day } = ctx;
  // Auffrischen wird vor dem Speichern des Übungstags geprüft. Danach wäre die Seite nicht mehr fällig.
  // Eine gescheiterte Runde bekommt keinen Bonus (rounds.js:19).
  const due = isRefreshDue(app, unitId, day);
  // Die Stufe wird vor dem neuen Stand gelesen: Sie hängt ohne Eintrag an der alten Genauigkeit.
  if (due) {
    if (!app.box || typeof app.box !== 'object' || Array.isArray(app.box)) app.box = {};
    app.box[unitId] = nextReviewStep(reviewStep(app, unitId), result.stars);
  }
  if (due && !result.failed) {
    result.refresh = true;
    app.refreshes = (app.refreshes || 0) + 1;
    payBonus(ctx, REFRESH_BONUS_XP);
  }
  app.last[unitId] = day;
  app.acc[unitId] = result.accuracy;
  // Fehlerkategorien für den Abruf (Spec 5.2). Ersetzt den alten Stand, sammelt nicht. Auch eine gescheiterte Runde speichert.
  // Ein fremder Wert aus einer Sicherung oder alten Version wird ersetzt. Ein Text würde beim Schreiben werfen.
  if (!app.missed || typeof app.missed !== 'object' || Array.isArray(app.missed)) app.missed = {};
  app.missed[unitId] = Array.isArray(missedSkills) ? [...missedSkills] : [];
  // Sterne gehen nur nach oben. Ein schwächerer Versuch nimmt keinen Stern weg (rounds.js:28).
  // Ohne Stern bleibt der Eintrag leer (RULE-189).
  if (result.stars > ((app.stars && app.stars[unitId]) || 0)) app.stars[unitId] = result.stars;
}

// Der Kapitel-Test misst, was sitzt. Er verändert keine Sterne und zählt nicht als Übung der Seiten. Es gilt der Bestwert.
function settleChapter(ctx, groupId) {
  const { result, app, day } = ctx;
  app.chapters = app.chapters || {};
  result.prevBest = app.chapters[groupId]?.acc ?? null;
  if (result.accuracy > (result.prevBest ?? -1)) app.chapters[groupId] = { acc: result.accuracy, day };
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
  // Die erfüllten Missionen stehen im Ergebnis, damit die Ansicht sie nennen kann.
  ctx.result.missions = completed;
  if (completed.length) payBonus(ctx, completed.length * MISSION_REWARD_XP);
}

/**
 * @param {object} input
 * @param {string} input.appId          Kennung der App (landet in profile.lastApp)
 * @param {'lesson'|'boss'|'quick'|'blitz'|'chapter'} input.mode
 * @param {{id: string}} [input.unit]   Seite; Pflicht bei mode 'lesson'
 * @param {{id: string}} [input.group]  Kapitel; Pflicht bei mode 'chapter'
 * @param {boolean} [input.failed]
 * @param {number} input.accuracy       0 bis 1, berechnet mit roundAccuracy
 * @param {number} [input.wrong]
 * @param {number} [input.almost]
 * @param {number} [input.bestCombo]
 * @param {number} [input.retryRight]   richtige Wiederholungen der Runde (zweiter Versuch), kommt aus dem Rundenergebnis
 * @param {string[]} [input.missedSkills] Labels der im ersten Versuch falschen Fragen (Rundenergebnis), nur Lektionsrunden
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
    appId, mode, unit, group, failed = false, accuracy, wrong = 0, almost = 0, bestCombo = 0, score = 0, retryRight = 0, missedSkills = [],
    levelUp = null, goalHit = false, badges = [], unitIds = [], profile, app, day
  } = input;
  assertDay(day);
  if (!MODES.has(mode)) throw new TypeError(`Unbekannter Rundenmodus: ${mode}`);
  if (mode === 'lesson' && !(unit && unit.id)) throw new TypeError('Lektionsrunde ohne Seite');
  if (mode === 'chapter' && !(group && group.id)) throw new TypeError('Kapitel-Test ohne Kapitel');
  if (!(accuracy >= 0 && accuracy <= 1)) throw new RangeError(`Genauigkeit muss zwischen 0 und 1 liegen: ${accuracy}`);

  // Blitz vergibt nie Sterne (rounds.js:11).
  const stars = mode === 'blitz' ? 0 : starsFor(accuracy, failed);
  // Der alte Wert muss vor settleLesson gelesen werden, das app.acc überschreibt. Nur Lektionsrunden haben einen.
  const prevAcc = mode === 'lesson' && app.acc ? (app.acc[unit.id] ?? null) : null;
  // Ebenso der letzte Übungstag der Seite: settleLesson setzt app.last auf heute. Ohne Eintrag null.
  const lastDay = mode === 'lesson' && app.last ? app.last[unit.id] : undefined;
  // Liegt der letzte Übungstag in der Zukunft (Uhr zurückgestellt), zählt 0 statt einer negativen Zahl.
  const gapDays = lastDay ? Math.max(0, dayDiff(lastDay, day)) : null;
  const result = {
    mode, failed, accuracy, wrong, almost, bestCombo, score, retryRight, prevAcc, gapDays,
    unitId: mode === 'lesson' ? unit.id : null,
    groupId: mode === 'chapter' ? group.id : null,
    prevBest: null,
    stars, bonus: 0, refresh: false, levelUp, goalHit, newBadges: [], missions: []
  };
  const ctx = { result, profile, app, day };

  app.stars = app.stars || {};
  app.last = app.last || {};
  app.acc = app.acc || {};
  app.best = app.best || {};
  app.badges = app.badges || {};

  if (mode === 'lesson') settleLesson(ctx, unit.id, missedSkills);
  if (mode === 'chapter') settleChapter(ctx, group.id);
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
