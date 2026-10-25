// Wertet eine beendete Runde aus: Sterne, Bestwerte, Bonus-XP, Streak und Trophäen.
// Reine Logik ohne Oberfläche, damit sie getestet werden kann.
import { addXP, starsFor, streakNow, touchStreak, isDue, today } from './profile.js';

/**
 * Ergänzt das Ergebnis um stars, bonus und newBadges und schreibt Fortschritt in app und profile.
 * @param {{config:{id:string, badges:object[]}, profile:object, app:object, result:object, day?:string}} o
 * @returns {object} dasselbe result-Objekt
 */
export function finalizeRound({ config, profile, app, result, day }) {
  result.stars = result.mode === 'blitz' ? 0 : starsFor(result.accuracy, result.failed);
  result.bonus = 0;
  app.last = app.last || {};
  app.acc = app.acc || {};

  if (result.mode === 'lesson') {
    const id = result.unit.id;
    // Auffrischen (Wiederholen nach ein paar Tagen) belohnen, bevor der Übungstag gespeichert wird.
    if (isDue(app, id, day) && !result.failed) {
      result.refresh = true;
      result.bonus += 10;
      const r = addXP(profile, app, 10, day);
      if (r.levelUp) result.levelUp = r.levelUp;
      if (r.goalHit) result.goalHit = true;
    }
    app.last[id] = day || today();
    app.acc[id] = result.accuracy;
    if (result.stars > (app.stars[id] || 0)) app.stars[id] = result.stars;
  }
  if (result.mode === 'blitz' && result.score > (app.best.blitz || 0)) {
    app.best.blitz = result.score;
  }
  if (result.mode === 'boss' && !result.failed) {
    result.bonus += 50;
    const r = addXP(profile, app, 50, day);
    if (r.levelUp) result.levelUp = r.levelUp;
    if (r.goalHit) result.goalHit = true;
    app.best.boss = true;
  }

  touchStreak(profile, day);
  profile.lastApp = config.id;

  const state = { profile, app, streak: streakNow(profile, day) };
  result.newBadges = config.badges.filter((b) => !app.badges[b.id] && b.when(state, result));
  result.newBadges.forEach((b) => { app.badges[b.id] = true; });
  return result;
}
