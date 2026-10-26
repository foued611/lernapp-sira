// Serie über aufeinanderfolgende Übungstage mit einem Gnadentag (profile.js:39-47).
import { STREAK_MAX_GAP_DAYS } from './constants.js';
import { assertDay, dayDiff } from './dates.js';

// Die Serie lebt weiter, solange der letzte Übungstag höchstens zwei Kalendertage zurückliegt.
// Die Grenze ist "bis zu zwei Tage Abstand", also ein ausgelassener Tag.
const withinGrace = (profile, day) =>
  Boolean(profile.lastDay) && dayDiff(profile.lastDay, day) <= STREAK_MAX_GAP_DAYS;

/** Serie am Tag day. Ist sie abgelaufen, ist das 0. */
export function currentStreak(profile, day) {
  assertDay(day);
  return withinGrace(profile, day) ? profile.streak : 0;
}

/**
 * Trägt einen Übungstag in die Serie ein. Mehrere Übungen am selben Tag zählen nur einmal.
 * Verändert profile.
 */
export function updateStreak(profile, day) {
  assertDay(day);
  if (profile.lastDay === day) return;
  // Nach einer längeren Pause beginnt die Serie wieder bei 1.
  profile.streak = withinGrace(profile, day) ? profile.streak + 1 : 1;
  profile.lastDay = day;
}
