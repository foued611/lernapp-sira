// Ein Dokument (Profil, Stand einer App) mit Standardwerten, Versionsfeld und Schutz vor stillem Überschreiben.
// Legacy: core/js/store.js. Jede Abweichung ist an der Stelle begründet.
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
    legacyPending: false, // Altstand liegt noch im localStorage, weil das Übernehmen nicht bestätigt wurde
    save: () => saveState(ctx, store, version),
    reset: () => {
      store.state = clone(defaults);
      return saveState(ctx, store, version);
    }
  };

  let found;
  try {
    found = await readStored(ctx, key);
  } catch (error) {
    // Ein Lesefehler ist nicht "nichts gespeichert". Sonst würde der nächste save() den Stand mit Standardwerten überschreiben (store.js:27).
    store.blocked = { reason: 'read-failed', message: READ_FAILED, cause: error };
    return store;
  }
  if (found.status !== 'absent') await adopt(ctx, store, found, { defaults, version, migrate });
  return store;
}

async function readStored(ctx, key) {
  const primary = await ctx.backend.readDoc(key);
  if (primary.status !== 'absent') return { ...primary, source: 'primary' };
  return { ...(await ctx.backend.readLegacy(key)), source: 'legacy' };
}

async function adopt(ctx, store, found, options) {
  if (found.status === 'ok' && isPlain(found.value)) {
    const bad = firstBadField(store.key, found.value);
    if (!bad) {
      if (found.source === 'legacy') await takeLegacy(ctx, store, found.value);
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

// Altstand aus localStorage übernehmen. Erst nach bestätigtem Schreiben wird er entfernt (RULE-187, db.js:58 löschte vorher).
async function takeLegacy(ctx, store, value) {
  try {
    await ctx.backend.writeDoc(store.key, value);
    await ctx.backend.removeLegacy(store.key);
  } catch (error) {
    store.legacyPending = true; // der nächste erfolgreiche save() räumt den Altstand auf
  }
}

// Führt den gespeicherten Stand über die Standardwerte. Der Versionsstand wird geprüft, eine Umstellung ist nur bei Versionswechsel nötig.
function applyStored(store, stored, { defaults, version, migrate }) {
  let data = clone(stored);
  const from = data.__v || 1; // store.js:38: fehlendes Versionsfeld gilt als Version 1
  try {
    if (from !== version && migrate) data = migrate(data, from);
    if (!isPlain(data)) throw new Error('Die Umstellung lieferte kein Objekt.');
  } catch (error) {
    // SCHULD-1: Scheitert die Umstellung, bleibt der gespeicherte Stand unangetastet (store.js:42-44 überschrieb ihn).
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
  if (found.source === 'legacy') {
    try {
      await ctx.backend.removeLegacy(store.key);
    } catch (error) {
      store.legacyPending = true;
    }
  }
}

async function saveState(ctx, store, version) {
  if (store.blocked) return { ok: false, error: store.blocked.message };
  try {
    // Der Aufruf kopiert den Zustand sofort. Spätere Änderungen am Objekt landen nicht im Schreibvorgang.
    await ctx.backend.writeDoc(store.key, { ...store.state, __v: version });
  } catch (error) {
    // store.js:51 verschluckte den Fehler. Hier kommt er zurück, damit die Oberfläche ihn zeigen kann.
    return { ok: false, error: SAVE_FAILED, cause: error };
  }
  if (store.legacyPending) await dropLegacyPending(ctx, store);
  return { ok: true };
}

async function dropLegacyPending(ctx, store) {
  try {
    await ctx.backend.removeLegacy(store.key);
    store.legacyPending = false;
  } catch (error) {
    // Bleibt stehen. Der nächste erfolgreiche save() versucht es erneut.
  }
}
