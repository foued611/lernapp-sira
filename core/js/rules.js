// Trophäen-Regeln als Daten. So können Trophäen in einer Datenbank stehen, ohne dass dort Code gespeichert wird.
// Eine Regel ist ein Objekt mit "type". Unbekannte Typen sind ein Fehler, damit Tippfehler nicht still "nie erreicht" bedeuten.
//
//   { type: 'anyUnit' }                          mindestens eine Seite hat einen Stern
//   { type: 'unit', id, stars?: 1 }               Seite id hat mindestens stars Sterne (Standard 1)
//   { type: 'units', ids: [...] }                 alle genannten Seiten haben einen Stern
//   { type: 'perfectRound' }                      Runde ohne Fehler (nicht im Blitz)
//   { type: 'combo', min }                        längste Serie in der Runde
//   { type: 'blitz', min }                        Punkte im Blitz
//   { type: 'boss' }                              Endgegner besiegt
//   { type: 'streak', days }                      Tage in Folge geübt
//   { type: 'all' | 'any', rules: [...] }         Kombinationen

const started = (state, id, min = 1) => (state.app.stars[id] || 0) >= min;

const TYPES = {
  anyUnit: (r, s, res, units) => units.some((u) => started(s, u.id)),
  unit: (r, s) => started(s, r.id, r.stars || 1),
  units: (r, s) => r.ids.every((id) => started(s, id)),
  perfectRound: (r, s, res) => res.mode !== 'blitz' && !res.failed && res.wrong === 0 && res.almost === 0,
  combo: (r, s, res) => res.bestCombo >= r.min,
  blitz: (r, s, res) => res.mode === 'blitz' && res.score >= r.min,
  boss: (r, s, res) => res.mode === 'boss' && !res.failed,
  streak: (r, s) => s.streak >= r.days,
  all: (r, s, res, units) => r.rules.every((x) => evaluateRule(x, s, res, units)),
  any: (r, s, res, units) => r.rules.some((x) => evaluateRule(x, s, res, units))
};

export const ruleTypes = () => Object.keys(TYPES);

/** Prüft eine Regel gegen Zustand und Rundenergebnis. */
export function evaluateRule(rule, state, result, units) {
  const fn = TYPES[rule && rule.type];
  if (!fn) throw new Error(`Unbekannte Trophäen-Regel: ${rule && rule.type}`);
  return Boolean(fn(rule, state, result || {}, units));
}

/** Prüft eine Regel auf Aufbau (ohne sie auszuwerten). Gibt eine Liste von Fehlern zurück. */
export function ruleErrors(rule, unitIds, path = 'rule') {
  const errors = [];
  if (!rule || !TYPES[rule.type]) return [`${path}: unbekannter Typ "${rule && rule.type}"`];
  if (rule.type === 'unit' && !unitIds.includes(rule.id)) errors.push(`${path}: Seite "${rule.id}" gibt es nicht`);
  if (rule.type === 'units') (rule.ids || []).forEach((id) => { if (!unitIds.includes(id)) errors.push(`${path}: Seite "${id}" gibt es nicht`); });
  if (rule.type === 'units' && !Array.isArray(rule.ids)) errors.push(`${path}: ids fehlt`);
  if ((rule.type === 'all' || rule.type === 'any')) {
    if (!Array.isArray(rule.rules) || !rule.rules.length) errors.push(`${path}: rules fehlt`);
    else rule.rules.forEach((x, i) => errors.push(...ruleErrors(x, unitIds, `${path}.rules[${i}]`)));
  }
  if (rule.type === 'combo' && !(rule.min > 0)) errors.push(`${path}: min fehlt`);
  if (rule.type === 'blitz' && !(rule.min > 0)) errors.push(`${path}: min fehlt`);
  if (rule.type === 'streak' && !(rule.days > 0)) errors.push(`${path}: days fehlt`);
  return errors;
}
