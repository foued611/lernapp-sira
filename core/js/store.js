// Zustand einer Einheit (Profil, App): im Speicher schnell lesbar, in der Browser-Datenbank dauerhaft.
// Flexibles Schema: gespeicherte Felder bleiben erhalten, neue Standardfelder werden beim Laden ergänzt.
// Eine Migration ist nur nötig, wenn sich die Bedeutung vorhandener Felder ändert.
import { getDB } from './db.js';

const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));

/** Führt gespeicherte Daten über die Standardwerte, auch in verschachtelten Objekten. */
export function deepMerge(base, data) {
  const out = { ...base };
  for (const [key, value] of Object.entries(data)) {
    out[key] = isPlain(value) && isPlain(base[key]) ? deepMerge(base[key], value) : value;
  }
  return out;
}

/**
 * Lädt (oder legt an) ein Dokument. Danach ist state synchron nutzbar, save() schreibt im Hintergrund.
 * @param {string} key        eindeutiger Schlüssel, z. B. "lernwerkstatt:app:fr-verben"
 * @param {object} defaults   Startzustand
 * @param {{version?:number, migrate?:(old:object, fromVersion:number)=>object}} [options]
 */
export async function createStore(key, defaults, { version = 1, migrate } = {}) {
  const db = await getDB();
  let stored;
  try { stored = await db.get(key); } catch (error) { stored = undefined; }
  if (stored === undefined) {
    stored = await db.legacy(key);
    if (stored !== undefined && !db.sync) { try { await db.put(key, stored); } catch (error) { /* wird beim nächsten save() erneut versucht */ } }
  }

  const fresh = () => clone(defaults);
  let state = fresh();
  if (isPlain(stored)) {
    try {
      let data = clone(stored);
      const from = data.__v || 1;
      if (from !== version && migrate) data = migrate(data, from);
      delete data.__v;
      state = deepMerge(fresh(), data);
    } catch (error) {
      state = fresh();
    }
  }

  const store = {
    state,
    backend: db.name,
    save() {
      db.put(key, { ...store.state, __v: version }).catch(() => { /* Speicher voll oder gesperrt: die App läuft weiter */ });
    },
    reset() {
      store.state = fresh();
      store.save();
    }
  };
  return store;
}
