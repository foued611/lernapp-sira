// Feldtypen der bekannten Dokumente: Profil und Stand einer App (Phase 2, Pflicht laut Person).
// Legacy prüfte nur, dass ein Objekt unter dem Präfix liegt. Felder wie xp als Text fielen durch (SEC-001).
// Unbekannte Felder bleiben erlaubt (RULE-207). Fehlende Felder bekommen die Standardwerte.
import { APP_KEY_PREFIX, PROFILE_KEY } from './constants.js';
import { isPlain } from './util.js';

const isInt = (value) => Number.isInteger(value) && value >= 0;
// Der Tag muss im Kalender existieren. 2026-02-31 sähe gültig aus, regeln/ wirft dabei aber (assertDay).
const isDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) === value;
};
const isOptionalDate = (value) => value === '' || isDate(value);
const isUnit = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
const isStars = (value) => Number.isInteger(value) && value >= 0 && value <= 3;
const isFlag = (value) => typeof value === 'boolean';
const isShortText = (max) => (value) => typeof value === 'string' && value.length <= max;

// Eine Karte aus Schlüssel und Wert: jeder Wert muss den Prüfer bestehen.
const mapOf = (check) => (value) => isPlain(value) && Object.values(value).every(check);

const DAY_TYPES = {
  d: isOptionalDate,
  xp: isInt
};

const isTextList = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
// Der Wochenblock aus regeln/missions.js. Der Speicher schreibt nur vollständige Blöcke, also prüft er sie vollständig.
const isWeekBlock = (value) => isPlain(value) && isDate(value.start) && isTextList(value.units) && isTextList(value.done)
  && isInt(value.refreshes) && isInt(value.strong);

const PROFILE_TYPES = {
  name: isShortText(20),
  xp: isInt,
  streak: isInt,
  lastDay: isOptionalDate,
  lastApp: isShortText(40),
  day: (value) => isPlain(value) && Object.entries(value).every(([field, item]) => !DAY_TYPES[field] || DAY_TYPES[field](item)),
  goal: isInt,
  week: isWeekBlock
};

const APP_TYPES = {
  xp: isInt,
  stars: mapOf(isStars),
  badges: mapOf(isFlag),
  best: (value) => isPlain(value) && (value.blitz === undefined || isInt(value.blitz)) && (value.boss === undefined || isFlag(value.boss)),
  last: mapOf(isOptionalDate),
  box: mapOf(isInt),
  chapters: mapOf((value) => isPlain(value) && isUnit(value.acc) && isDate(value.day)),
  acc: mapOf(isUnit),
  refreshes: isInt,
  missed: mapOf(isTextList)
};

/** Liefert das Schema für einen Schlüssel oder null, wenn der Schlüssel kein bekanntes Dokument ist. */
export function schemaFor(key) {
  if (key === PROFILE_KEY) return PROFILE_TYPES;
  if (typeof key === 'string' && key.startsWith(APP_KEY_PREFIX)) return APP_TYPES;
  return null;
}

/**
 * Prüft die bekannten Felder eines Dokuments. Gibt null zurück, wenn alles passt,
 * sonst den Namen des ersten falschen Feldes. Unbekannte Felder werden nicht geprüft.
 */
export function firstBadField(key, value) {
  const types = schemaFor(key);
  if (!types || !isPlain(value)) return null;
  for (const [field, item] of Object.entries(value)) {
    if (!Object.hasOwn(types, field)) continue;
    if (!types[field](item)) return field;
  }
  return null;
}
