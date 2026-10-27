// Wochenmissionen: drei feste Aufgaben pro Woche (Montag bis Sonntag), die Lernhandlungen zählen, keine Zeit.
// Die Funktionen hier zählen nur. Die XP-Belohnung zahlt die Rundenauswertung (round.js) über awardXP,
// damit Tagesziel und Level wie bei jedem anderen Bonus wirken.
import { assertDay, weekStart } from './dates.js';

/** Ab dieser Genauigkeit zählt eine Runde als stark (gleiche Schwelle wie 3 Sterne). */
const STRONG_ACCURACY = 0.9;

// IDs sind gespeicherte Daten (profile.week.done) und bleiben stabil.
export const MISSIONS = Object.freeze([
  Object.freeze({ id: 'units3', need: 3 }),
  Object.freeze({ id: 'refresh1', need: 1 }),
  Object.freeze({ id: 'strong90', need: 1 })
]);

// Wie viel schon erreicht ist, je Mission aus dem Wochenblock gelesen.
const COUNTERS = Object.freeze({
  units3: (week) => week.units.length,
  refresh1: (week) => week.refreshes,
  strong90: (week) => week.strong
});

const freshWeek = (start) => ({ start, units: [], refreshes: 0, strong: 0, done: [] });
const isCount = (value) => Number.isInteger(value) && value >= 0;

// Ein Block aus einem Backup oder einer älteren Version kann beliebig aussehen. Nur ein vollständiger Block zählt.
const isWeek = (week, start) => Boolean(week) && week.start === start
  && Array.isArray(week.units) && Array.isArray(week.done) && isCount(week.refreshes) && isCount(week.strong);

/**
 * Der Wochenstand für diesen Tag, ohne das Profil zu verändern. Gehört der gespeicherte Block zu einer anderen
 * Woche (oder fehlt er), ist es ein leerer Block.
 */
const weekFor = (profile, day) => {
  const start = weekStart(day);
  return isWeek(profile.week, start) ? profile.week : freshWeek(start);
};

/**
 * Fortschritt der drei Missionen für die Anzeige. Rein lesend.
 * @returns {{id: string, need: number, count: number, done: boolean}[]} count ist auf need begrenzt.
 */
export function missionProgress(profile, day) {
  const week = weekFor(profile, day);
  return MISSIONS.map(({ id, need }) => ({
    id,
    need,
    count: Math.min(need, COUNTERS[id](week)),
    done: week.done.includes(id)
  }));
}

/**
 * Verbucht eine beendete Runde im Wochenblock des Profils und setzt den Block zurück, wenn eine neue Woche
 * begonnen hat. Der Tag kommt von außen.
 * @param {object} profile
 * @param {{unit?: string|null, refreshed?: boolean, accuracy: number, strongEligible?: boolean}} event unit nur bei Lektionsrunden;
 *   strongEligible false: die Runde zählt nicht für die starke Runde (Blitz hat keine echte Genauigkeit)
 * @param {string} day YYYY-MM-DD
 * @returns {{completed: string[]}} die IDs der Missionen, die diese Runde zum ersten Mal erfüllt hat
 */
export function recordMission(profile, event, day) {
  assertDay(day);
  const week = weekFor(profile, day);
  profile.week = week;
  const { unit = null, refreshed = false, accuracy, strongEligible = true } = event;
  if (unit && !week.units.includes(unit)) week.units.push(unit);
  if (refreshed) week.refreshes += 1;
  if (strongEligible && accuracy >= STRONG_ACCURACY) week.strong += 1;
  const completed = MISSIONS
    .filter(({ id, need }) => !week.done.includes(id) && COUNTERS[id](week) >= need)
    .map(({ id }) => id);
  week.done.push(...completed);
  return { completed };
}
