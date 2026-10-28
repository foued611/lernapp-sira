// Übernahme früherer Apps in die Französisch-Werkstatt. Das Cahier de Verbes war eine eigene App (fr-verben) und
// ist jetzt eine Hälfte von decouvertes-2. Sein Fortschritt (Sterne, Punkte, Trophäen) wird einmal umgezogen.
// Die alte Speicherzeile bleibt stehen, damit nichts verloren geht. "merged" verhindert, dass zweimal gezählt wird.
export const UEBERNAHMEN = Object.freeze([
  {
    from: 'fr-verben',
    into: 'decouvertes-2',
    // Trophäen mit gleicher Kennung, aber anderer Regel. Der alte Stand wird unter der neuen Kennung gelesen.
    badgeRenames: Object.freeze({ 'besser-geworden': 'besser-geworden-verben' })
  }
]);

const FIELDS_OF_MAPS = ['stars', 'badges', 'best', 'last', 'acc', 'seen', 'missed'];

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

// Zwei Werte derselben Kennung: Zahlen nehmen den höheren Wert, Listen die Vereinigung, sonst bleibt der Zielwert.
function mergeValue(a, b) {
  if (isNumber(a) && isNumber(b)) return Math.max(a, b);
  if (Array.isArray(a) && Array.isArray(b)) return [...new Set([...a, ...b])];
  return a;
}

function mergeMap(target, source, renames = {}) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const name = renames[key] || key;
    out[name] = Object.hasOwn(out, name) ? mergeValue(out[name], value) : value;
  }
  return out;
}

/** Hat der alte Stand überhaupt etwas Gespieltes? Sonst gibt es nichts zu übernehmen. */
export function hasProgress(state) {
  if (!state) return false;
  return state.xp > 0 || FIELDS_OF_MAPS.some((field) => Object.keys(state[field] || {}).length > 0);
}

/**
 * Führt den Stand der alten App in den Stand der neuen. Gibt einen neuen Stand zurück, die Eingaben bleiben unverändert.
 * XP werden addiert, Sterne, Bestwerte und Trophäen übernommen (der höhere Wert gewinnt, Trophäen werden umbenannt).
 */
export function mergeAppState(target, source, { badgeRenames = {}, fromId } = {}) {
  const out = { ...target, xp: (target.xp || 0) + (source.xp || 0) };
  for (const field of FIELDS_OF_MAPS) {
    out[field] = mergeMap(target[field] || {}, source[field] || {}, field === 'badges' ? badgeRenames : {});
  }
  out.merged = { ...(target.merged || {}), [fromId]: true };
  return out;
}
