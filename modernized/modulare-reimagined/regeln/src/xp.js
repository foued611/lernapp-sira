// XP, Level, Tagesziel und Combo-Faktor. Verändert nur die übergebenen Zustandsobjekte.
import { COMBO_STEP, DAILY_GOAL_XP, GOAL_CHOICES, MAX_MULTIPLIER } from './constants.js';
import { assertDay } from './dates.js';

/** Niveau n beginnt bei 30·n·(n−1) XP (profile.js:29). */
export const levelThreshold = (n) => 30 * n * (n - 1);

/** Höchstes Niveau, dessen Schwelle erreicht ist. Niveau 1 gilt ab 0 XP (profile.js:30-34). */
export function levelOf(xp) {
  let level = 1;
  while (xp >= levelThreshold(level + 1)) level += 1;
  return level;
}

/** XP des angegebenen Tages. Gehört der Tageseintrag zu einem anderen Tag, ist es 0. */
export function dailyXP(profile, day) {
  return profile.day && profile.day.d === day ? profile.day.xp : 0;
}

/** Tagesziel des Profils: der gewählte Wert aus GOAL_CHOICES, sonst DAILY_GOAL_XP. */
export function dailyGoal(profile) {
  return GOAL_CHOICES.includes(profile.goal) ? profile.goal : DAILY_GOAL_XP;
}

/** Setzt das Tagesziel. Nur Werte aus GOAL_CHOICES sind erlaubt, sonst bleibt das Profil unverändert. */
export function setDailyGoal(profile, value) {
  if (!GOAL_CHOICES.includes(value)) throw new RangeError(`Tagesziel muss eines von ${GOAL_CHOICES.join(', ')} sein: ${value}`);
  profile.goal = value;
}

/**
 * Schreibt XP in Profil, App und Tagesbilanz gut.
 * Meldet einen Level-Aufstieg (neues Niveau) und das Erreichen des Tagesziels, nur beim ersten Mal.
 * @returns {{levelUp: number|null, goalHit: boolean}}
 */
export function awardXP(profile, app, amount, day) {
  assertDay(day);
  if (!(amount >= 0)) throw new RangeError(`XP-Betrag muss ≥ 0 sein: ${amount}`);
  const levelBefore = levelOf(profile.xp);
  const goalBefore = dailyXP(profile, day);
  const goal = dailyGoal(profile);
  profile.xp += amount;
  app.xp += amount;
  // Ein neuer Tag beginnt bei 0. Die Bilanz von gestern zählt nicht zum heutigen Ziel.
  if (!profile.day || profile.day.d !== day) profile.day = { d: day, xp: 0 };
  profile.day.xp += amount;
  const levelAfter = levelOf(profile.xp);
  return {
    levelUp: levelAfter > levelBefore ? levelAfter : null,
    goalHit: goalBefore < goal && profile.day.xp >= goal
  };
}

/** Zieht XP ab. Die Summen werden nie negativ (profile.js:68-71). */
export function spendXP(profile, app, amount) {
  profile.xp = Math.max(0, profile.xp - amount);
  app.xp = Math.max(0, app.xp - amount);
}

/** Combo-Faktor: ×1 bis 2 richtige Antworten in Folge, ×2 ab 3, ×3 ab 6, höchstens ×4 (profile.js:73). */
export const comboMultiplier = (combo) => Math.min(MAX_MULTIPLIER, Math.floor(combo / COMBO_STEP) + 1);
