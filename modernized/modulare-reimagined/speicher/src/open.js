// Wählt beim Öffnen den Zweig: IndexedDB, dann localStorage, zuletzt Arbeitsspeicher (RULE-186).
// Kein globaler Singleton. Jeder Aufruf bekommt seinen Speicher, damit Tests eigene Speicher injizieren können.
import { PROBE_KEY } from './constants.js';
import { createIdbBackend, openDatabase } from './backend-idb.js';
import { createStorageBackend } from './backend-storage.js';
import { createMemoryStorage } from './memory-storage.js';
import { createStore } from './store.js';
import { listEvents, logEvent } from './log.js';
import { exportAll, importAll, planImport } from './backup.js';

// Der Zugriff auf localStorage kann in manchen Browsern selbst werfen (Datenschutzeinstellungen). Dann gibt es keinen.
const globalOrNull = (name) => {
  try {
    return globalThis[name] ?? null;
  } catch (error) {
    return null;
  }
};

/**
 * Öffnet den Speicher. Optionen (alle optional):
 *   indexedDB     Factory mit open(). Explizit null heißt: nicht vorhanden.
 *   localStorage  Storage-artiges Objekt. Explizit null heißt: nicht vorhanden.
 *   now           Uhr in Millisekunden, für Tests.
 * Gibt immer einen funktionierenden Speicher zurück, im schlimmsten Fall im Arbeitsspeicher.
 */
export async function openStore(options = {}) {
  // "in" unterscheidet "nicht übergeben" (Browser-Global) von "explizit null" (nicht vorhanden).
  const indexedDB = 'indexedDB' in options ? options.indexedDB : globalOrNull('indexedDB');
  const localStorage = 'localStorage' in options ? options.localStorage : globalOrNull('localStorage');
  const now = options.now ?? (() => Date.now());
  const backend = await chooseBackend({ indexedDB, localStorage, now });
  return createHandle({ backend, now });
}

async function chooseBackend({ indexedDB, localStorage, now }) {
  if (indexedDB) {
    const idb = await tryIndexedDB(indexedDB, now);
    if (idb) return idb;
  }
  if (localStorage && storageWorks(localStorage)) return createStorageBackend('localstorage', localStorage);
  return createStorageBackend('memory', createMemoryStorage());
}

// Eine IndexedDB, die sich öffnen lässt, aber nicht beschreibbar ist, gilt als nicht nutzbar.
async function tryIndexedDB(factory, now) {
  let db = null;
  try {
    db = await openDatabase(factory);
    const backend = createIdbBackend({ db, now });
    await backend.probe(); // schlägt fehl, wenn der Browser IndexedDB sperrt
    return backend;
  } catch (error) {
    if (db) db.close();
    return null;
  }
}

// Schreibprobe. Ein Speicher, der Schreiben verweigert, wird gar nicht erst gewählt.
function storageWorks(storage) {
  try {
    storage.setItem(PROBE_KEY, '1');
    storage.removeItem(PROBE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

function createHandle(ctx) {
  return {
    backend: ctx.backend.name,
    createStore: (key, defaults, options) => createStore(ctx, key, defaults, options),
    logEvent: (entry) => logEvent(ctx, entry),
    listEvents: (options) => listEvents(ctx, options),
    exportAll: () => exportAll(ctx),
    planImport: (file) => planImport(ctx, file),
    importAll: (file, options) => importAll(ctx, file, options),
    close: () => ctx.backend.close()
  };
}
