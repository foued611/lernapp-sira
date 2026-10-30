// Gewähltes Farbschema. Es gehört zum Gerät, nicht zum Lernstand, und steht deshalb nicht im Profil und nicht in der
// Sicherung. Der Zugriff ist synchron, damit die Seite beim Laden nicht kurz im falschen Schema aufblitzt.
const THEME_KEY = 'lernwerkstatt-theme';
const THEMES = Object.freeze(['light', 'dark']);

// Der Zugriff auf localStorage kann in manchen Browsern selbst werfen (Datenschutzeinstellungen).
function browserStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Das gespeicherte Schema, sonst null. Dann gilt die Einstellung des Systems. */
export function readTheme(storage = browserStorage()) {
  try {
    const value = storage ? storage.getItem(THEME_KEY) : null;
    return THEMES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

/** Merkt das Schema. Gibt false zurück, wenn es nicht ging. Die Umschaltung gilt dann nur bis zum Neuladen. */
export function saveTheme(theme, storage = browserStorage()) {
  if (!THEMES.includes(theme) || !storage) return false;
  try {
    storage.setItem(THEME_KEY, theme);
    return true;
  } catch {
    return false;
  }
}
