// Feldtypen der bekannten Dokumente: Profil und Stand einer App (Phase 2, Pflicht laut Person).
// Legacy prüfte nur, dass ein Objekt unter dem Präfix liegt. Felder wie xp als Text fielen durch (SEC-001).
// Unbekannte Felder bleiben erlaubt (RULE-207). Fehlende Felder bekommen die Standardwerte.
import { APP_KEY_PREFIX, PROFILE_KEY } from './constants.js';
import { isPlain } from './util.js';

const isInt = (value) => Number.isInteger(value) && value >= 0;
const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
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

const PROFILE_TYPES = {
  name: isShortText(20),
  xp: isInt,
  streak: isInt,
  lastDay: isOptionalDate,
  lastApp: isShortText(40),
  day: (value) => isPlain(value) && Object.entries(value).every(([field, item]) => !DAY_TYPES[field] || DAY_TYPES[field](item))
};

const APP_TYPES = {
  xp: isInt,
  stars: mapOf(isStars),
  badges: mapOf(isFlag),
  best: (value) => isPlain(value) && (value.blitz === undefined || isInt(value.blitz)) && (value.boss === undefined || isFlag(value.boss)),
  last: mapOf(isOptionalDate),
  acc: mapOf(isUnit)
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
