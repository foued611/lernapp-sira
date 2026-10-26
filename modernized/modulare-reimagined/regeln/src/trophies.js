// Trophäen-Regeln als Daten (rules.js). Eine Regel ist ein Objekt mit "type".
// Unbekannte Typen sind ein Fehler. So bedeutet ein Tippfehler nicht still "nie erreicht".
//
//   { type: 'anyUnit' }                     mindestens eine Seite hat einen Stern
//   { type: 'unit', id, stars? }            Seite id hat mindestens stars Sterne (Standard 1)
//   { type: 'units', ids }                  alle genannten Seiten haben einen Stern
//   { type: 'perfectRound' }                Runde ohne Fehler (nicht im Blitz)
//   { type: 'combo', min }                  längste Combo der Runde
//   { type: 'blitz', min }                  Punkte im Blitz
//   { type: 'boss' }                        Endgegner besiegt
//   { type: 'streak', days }                Tage in Folge geübt
//   { type: 'all' | 'any', rules }          Kombinationen

// Eine Seite gilt als begonnen, sobald sie mindestens einen Stern hat. Fehlende Seiten zählen als 0.
const started = (state, unitId, min = 1) => ((state.app.stars && state.app.stars[unitId]) || 0) >= min;

const TYPES = {
  anyUnit: (rule, state, result, unitIds) => unitIds.some((id) => started(state, id)),
  unit: (rule, state) => started(state, rule.id, rule.stars || 1),
  units: (rule, state) => rule.ids.every((id) => started(state, id)),
  // Eine knapp falsche Antwort (almost) zählt hier als Fehler (rules.js:20).
  perfectRound: (rule, state, result) =>
    result.mode !== 'blitz' && !result.failed && result.wrong === 0 && result.almost === 0,
  combo: (rule, state, result) => result.bestCombo >= rule.min,
  blitz: (rule, state, result) => result.mode === 'blitz' && result.score >= rule.min,
  boss: (rule, state, result) => result.mode === 'boss' && !result.failed,
  streak: (rule, state) => state.streak >= rule.days,
  all: (rule, state, result, unitIds) => rule.rules.every((x) => evaluateTrophyRule(x, state, result, unitIds)),
  any: (rule, state, result, unitIds) => rule.rules.some((x) => evaluateTrophyRule(x, state, result, unitIds))
};

// Object.hasOwn statt TYPES[type], damit Namen wie "constructor" nicht als Typ durchgehen.
const knownType = (type) => Object.hasOwn(TYPES, type);

export const trophyRuleTypes = () => Object.keys(TYPES);

/**
 * Prüft eine Regel gegen Zustand, Rundenergebnis und Seitenliste.
 * @param {object} rule
 * @param {{profile: object, app: object, streak: number}} state
 * @param {object} [result]
 * @param {string[]} [unitIds]
 */
export function evaluateTrophyRule(rule, state, result = {}, unitIds = []) {
  const type = rule && rule.type;
  if (!knownType(type)) throw new Error(`Unbekannte Trophäen-Regel: ${type}`);
  return Boolean(TYPES[type](rule, state, result, unitIds));
}

/** Prüft den Aufbau einer Regel, ohne sie auszuwerten. Gibt die Fehler als Liste zurück (rules.js:39-52). */
export function ruleErrors(rule, unitIds, path = 'rule') {
  if (!rule || !knownType(rule.type)) return [`${path}: unbekannter Typ "${rule && rule.type}"`];
  const errors = [];
  const missingUnit = (id) => `${path}: Seite "${id}" gibt es nicht`;
  if (rule.type === 'unit' && !unitIds.includes(rule.id)) errors.push(missingUnit(rule.id));
  if (rule.type === 'units') {
    if (!Array.isArray(rule.ids)) errors.push(`${path}: ids fehlt`);
    else rule.ids.forEach((id) => { if (!unitIds.includes(id)) errors.push(missingUnit(id)); });
  }
  if (rule.type === 'all' || rule.type === 'any') {
    if (!Array.isArray(rule.rules) || !rule.rules.length) errors.push(`${path}: rules fehlt`);
    else rule.rules.forEach((x, i) => errors.push(...ruleErrors(x, unitIds, `${path}.rules[${i}]`)));
  }
  if (rule.type === 'combo' && !(rule.min > 0)) errors.push(`${path}: min fehlt`);
  if (rule.type === 'blitz' && !(rule.min > 0)) errors.push(`${path}: min fehlt`);
  if (rule.type === 'streak' && !(rule.days > 0)) errors.push(`${path}: days fehlt`);
  return errors;
}
