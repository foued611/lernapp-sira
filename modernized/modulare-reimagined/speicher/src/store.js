// Ein Dokument (Profil, Stand einer App) mit Standardwerten, Versionsfeld und Schutz vor stillem Überschreiben.
import { RAW_PREFIX } from './constants.js';
import { clone, deepMerge, isPlain } from './util.js';
import { firstBadField } from './schema.js';

const READ_FAILED = 'Der gespeicherte Fortschritt konnte nicht gelesen werden. Damit er nicht überschrieben wird, speichert die App vorerst nicht.';
const MIGRATION_FAILED = 'Der gespeicherte Fortschritt konnte nicht umgestellt werden. Damit er nicht überschrieben wird, speichert die App vorerst nicht.';
const RAW_FAILED = 'Der unlesbare gespeicherte Stand konnte nicht gesichert werden. Damit er nicht überschrieben wird, speichert die App vorerst nicht.';
const SAVE_FAILED = 'Der Fortschritt konnte nicht gespeichert werden.';

/**
 * Lädt (oder legt an) ein Dokument. Danach ist state synchron nutzbar. save() schreibt und meldet das Ergebnis.
 * @param ctx      { backend, now } aus open.js
 * @param key      Schlüssel, z. B. "lernwerkstatt:app:fr-verben"
 * @param defaults Startzustand
 * @param options  { version = 1, migrate(old, fromVersion) }
 */
export async function createStore(ctx, key, defaults, { version = 1, migrate } = {}) {
  const store = {
    key,
    backend: ctx.backend.name,
    state: clone(defaults),
    recovered: null, // gesetzt, wenn ein gespeicherter Stand nicht übernommen wurde und gesichert ist (RULE-135)
    blocked: null, // gesetzt, wenn Schreiben gesperrt ist, damit nichts überschrieben wird (SCHULD-1)
    save: () => saveState(ctx, store, version),
    reset: () => {
      store.state = clone(defaults);
      return saveState(ctx, store, version);
    }
  };

  let found;
  try {
    found = await ctx.backend.readDoc(key);
  } catch (error) {
    // Ein Lesefehler ist nicht "nichts gespeichert". Sonst würde der nächste save() den Stand mit Standardwerten überschreiben.
    store.blocked = { reason: 'read-failed', message: READ_FAILED, cause: error };
    return store;
  }
  if (found.status !== 'absent') await adopt(ctx, store, found, { defaults, version, migrate });
  return store;
}

async function adopt(ctx, store, found, options) {
  if (found.status === 'ok' && isPlain(found.value)) {
    const bad = firstBadField(store.key, found.value);
    if (!bad) {
      applyStored(store, found.value, options);
      return;
    }
    // Falscher Feldtyp: wie ein unlesbarer Stand behandeln, damit nichts still verloren geht (SEC-001, RULE-135).
    await keepRaw(ctx, store, { ...found, reason: 'schema-mismatch' });
    return;
  }
  // Unlesbar oder kein Objekt: erst sichern, dann mit Standardwerten starten (RULE-135).
  await keepRaw(ctx, store, found);
}

// Führt den gespeicherten Stand über die Standardwerte. Der Versionsstand wird geprüft, eine Umstellung ist nur bei Versionswechsel nötig.
function applyStored(store, stored, { defaults, version, migrate }) {
  let data = clone(stored);
  const from = data.__v || 1; // fehlendes Versionsfeld gilt als Version 1
  try {
    if (from !== version && migrate) data = migrate(data, from);
    if (!isPlain(data)) throw new Error('Die Umstellung lieferte kein Objekt.');
  } catch (error) {
    // SCHULD-1: Scheitert die Umstellung, bleibt der gespeicherte Stand unangetastet.
    store.blocked = { reason: 'migration-failed', message: MIGRATION_FAILED, cause: error };
    return;
  }
  delete data.__v;
  // RULE-207: unbekannte Felder bleiben, neue Standardfelder kommen dazu, auch in verschachtelten Objekten.
  store.state = deepMerge(clone(defaults), data);
}

async function keepRaw(ctx, store, found) {
  const reason = found.reason ?? (found.status === 'corrupt' ? 'unreadable' : 'not-object');
  const raw = found.status === 'corrupt' ? found.raw : JSON.stringify(found.value);
  const stamp = ctx.now();
  const backupKey = `${RAW_PREFIX}${store.key}:${stamp}`;
  try {
    await ctx.backend.writeDoc(backupKey, {
      key: store.key,
      reason,
      raw,
      savedAt: new Date(stamp).toISOString()
    });
  } catch (error) {
    // Ohne gesicherte Kopie bleibt das Original stehen. Schreiben wird gesperrt (RULE-135).
    store.blocked = { reason: 'raw-backup-failed', message: RAW_FAILED, cause: error };
    return;
  }
  store.recovered = { reason, backupKey };
}

async function saveState(ctx, store, version) {
  if (store.blocked) return { ok: false, error: store.blocked.message };
  try {
    // Der Aufruf kopiert den Zustand sofort. Spätere Änderungen am Objekt landen nicht im Schreibvorgang.
    await ctx.backend.writeDoc(store.key, { ...store.state, __v: version });
  } catch (error) {
    // Der Fehler kommt zurück, damit die Oberfläche ihn zeigen kann.
    return { ok: false, error: SAVE_FAILED, cause: error };
  }
  return { ok: true };
}
