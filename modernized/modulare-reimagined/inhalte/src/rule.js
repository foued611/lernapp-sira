// Prüft den Aufbau einer Trophäen-Regel (badges.json), nicht ihre Auswertung. Die Auswertung gehört zu regeln/.
// Spiegel von legacy core/js/rules.js (ruleErrors). Die Typen stehen hier, damit das Paket ohne den
// Regel-Dienst geprüft werden kann. Wer einen Typ ergänzt, ändert beide Stellen und den Test.

const LEAF_TYPES = new Set(['anyUnit', 'perfectRound', 'boss']);
const COMBINE_TYPES = new Set(['all', 'any']);
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isPositiveInt = (v, min) => Number.isInteger(v) && v >= min;

/** Fehler in einer Regel. unitIds sind die Seiten-IDs des Pakets, path steht für die Meldung. */
export function ruleErrors(rule, unitIds, path = 'rule') {
  if (!isObj(rule)) return [`${path}: fehlt oder ist kein Objekt`];
  if (LEAF_TYPES.has(rule.type)) return [];
  if (rule.type === 'unit') {
    const starErrors = rule.stars === undefined || [1, 2, 3].includes(rule.stars) ? [] : [`${path}: stars muss 1, 2 oder 3 sein`];
    return [...starErrors, ...unitRefErrors([rule.id], unitIds, path)];
  }
  if (rule.type === 'units') {
    if (!Array.isArray(rule.ids) || !rule.ids.length) return [`${path}: ids fehlt`];
    return unitRefErrors(rule.ids, unitIds, path);
  }
  if (rule.type === 'combo' || rule.type === 'blitz') return isPositiveInt(rule.min, 1) ? [] : [`${path}: min fehlt`];
  if (rule.type === 'streak') return isPositiveInt(rule.days, 2) ? [] : [`${path}: days fehlt`];
  if (COMBINE_TYPES.has(rule.type)) {
    if (!Array.isArray(rule.rules) || !rule.rules.length) return [`${path}: rules fehlt`];
    return rule.rules.flatMap((inner, i) => ruleErrors(inner, unitIds, `${path}.rules[${i}]`));
  }
  return [`${path}: unbekannter Typ "${rule.type}"`];
}

function unitRefErrors(ids, unitIds, path, extra = []) {
  const missing = ids.filter((id) => !unitIds.includes(id)).map((id) => `${path}: Seite "${id}" gibt es nicht`);
  return [...extra, ...missing];
}
