// Gamification, die für alle Apps gleich gilt: Profil, XP, Level, Tagesziel, Streak.
// Reine Funktionen auf Zustandsobjekten, damit sie ohne Browser getestet werden können.
import { createStore } from './store.js';

export const GOAL = 30;
export const PROFILE_KEY = 'lernwerkstatt:profile';
export const appKey = (appId) => `lernwerkstatt:app:${appId}`;
// Standardtitel der Niveaus. Eine App kann eigene mit config.words.levelTitles setzen.
export const TITLES = ['Neuling', 'Entdecker', 'Könner', 'Profi', 'Meister', 'Expert', 'Legende'];

/** Nach so vielen Tagen ohne Übung ist eine Seite zum Auffrischen fällig. */
export const DUE_DAYS = 3;

export const profileDefaults = () => ({ name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } });
// last = letzter Übungstag je Seite, acc = letzte Genauigkeit je Seite. Beides steuert Auffrischen und gezieltes Training.
export const appDefaults = () => ({ xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {} });

// Beide sind asynchron, weil die Browser-Datenbank erst geöffnet werden muss.
export const openProfile = () => createStore(PROFILE_KEY, profileDefaults());
export const openApp = (appId, extra = {}) => createStore(appKey(appId), { ...appDefaults(), ...extra });

export const today = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

export const dayDiff = (from, to) =>
  Math.round((new Date(`${to}T12:00:00`) - new Date(`${from}T12:00:00`)) / 864e5);

/** Niveau n beginnt bei 30·n·(n−1) XP. */
export const lvlAt = (n) => 30 * n * (n - 1);
export const levelOf = (xp) => {
  let n = 1;
  while (xp >= lvlAt(n + 1)) n++;
  return n;
};
export const titleOf = (level, titles = TITLES) => titles[Math.min(level - 1, titles.length - 1)];

export const dailyXP = (profile, day = today()) => (profile.day && profile.day.d === day ? profile.day.xp : 0);

/** Eine Serie bleibt bestehen, wenn höchstens ein Tag ausgelassen wurde (Gnadentag). */
export const streakNow = (profile, day = today()) =>
  profile.lastDay && dayDiff(profile.lastDay, day) <= 2 ? profile.streak : 0;

export function touchStreak(profile, day = today()) {
  if (profile.lastDay === day) return;
  profile.streak = profile.lastDay && dayDiff(profile.lastDay, day) <= 2 ? profile.streak + 1 : 1;
  profile.lastDay = day;
}

/**
 * Schreibt XP in Profil und App gut.
 * @returns {{levelUp: number|null, goalHit: boolean}}
 */
export function addXP(profile, app, amount, day = today()) {
  const levelBefore = levelOf(profile.xp);
  const goalBefore = dailyXP(profile, day);
  profile.xp += amount;
  app.xp += amount;
  if (!profile.day || profile.day.d !== day) profile.day = { d: day, xp: 0 };
  profile.day.xp += amount;
  const levelAfter = levelOf(profile.xp);
  return {
    levelUp: levelAfter > levelBefore ? levelAfter : null,
    goalHit: goalBefore < GOAL && profile.day.xp >= GOAL
  };
}

/** Zieht XP ab (z. B. Spickzettel). XP werden nie negativ. */
export function spendXP(profile, app, amount) {
  profile.xp = Math.max(0, profile.xp - amount);
  app.xp = Math.max(0, app.xp - amount);
}

export const multiplier = (combo) => Math.min(4, Math.floor(combo / 3) + 1);

/** Sterne nach Trefferquote: ≥90 % drei, ≥70 % zwei, sonst einer. Null bei Misserfolg. */
export const starsFor = (accuracy, failed) => (failed ? 0 : accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1);

/** Eine Seite ist fällig, wenn sie schon Sterne hat, aber seit DUE_DAYS Tagen nicht geübt wurde. */
export function isDue(app, unitId, day = today()) {
  const last = app.last && app.last[unitId];
  return Boolean(last) && (app.stars[unitId] || 0) > 0 && dayDiff(last, day) >= DUE_DAYS;
}

/**
 * Welche Seite sollte als Nächstes trainiert werden? Zuerst fällige (die älteste), danach die mit der
 * schwächsten letzten Runde (unter 90 %). Gibt null zurück, wenn gerade nichts ansteht.
 */
export function weakestUnit(app, units, day = today()) {
  const due = units.filter((u) => isDue(app, u.id, day)).sort((a, b) => dayDiff(app.last[b.id], app.last[a.id]));
  if (due.length) return { unit: due[0], reason: 'Zeit zum Auffrischen' };
  const weak = units
    .filter((u) => app.acc && typeof app.acc[u.id] === 'number' && app.acc[u.id] < 0.9 && (app.stars[u.id] || 0) < 3)
    .sort((a, b) => app.acc[a.id] - app.acc[b.id]);
  return weak.length ? { unit: weak[0], reason: 'Hier ist noch Luft nach oben' } : null;
}
