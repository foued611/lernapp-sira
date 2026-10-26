// Zweig IndexedDB. Gleiche Datenbank, gleiches Schema und gleiche Dokumentform wie die Legacy-App
// (db.js:6-24, 39-51). Jede Schreibung läuft in genau einer readwrite-Transaktion (SCHULD-2, db.js:68-71).
// Erst nach dem Commit gilt sie als bestätigt.
import { DB_NAME, DB_VERSION } from './constants.js';
import { newLogRows, readRaw, splitDocs, withoutId } from './records.js';

const IDB_PROBE = '__probe'; // Legacy-Probe (db.js:105)

const wrap = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

function upgrade(db) {
  if (!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', { keyPath: 'key' });
  if (!db.objectStoreNames.contains('log')) {
    const log = db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
    log.createIndex('app', 'app');
    log.createIndex('ts', 'ts');
  }
}

/** Öffnet die Datenbank. "Blockiert" gilt als Fehler, damit der Aufrufer auf einen anderen Speicher ausweicht (db.js:34). */
export function openDatabase(factory) {
  return new Promise((resolve, reject) => {
    let request;
    let blocked = false;
    try {
      request = factory.open(DB_NAME, DB_VERSION);
    } catch (error) {
      reject(error);
      return;
    }
    request.onupgradeneeded = () => upgrade(request.result);
    request.onsuccess = () => {
      // Kam die Verbindung nach dem Blockieren doch noch, wird sie geschlossen statt offen zu bleiben.
      if (blocked) request.result.close();
      else resolve(request.result);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      blocked = true;
      reject(new Error('IndexedDB blockiert'));
    };
  });
}

// Führt body in genau einer Transaktion aus. Wirft body oder scheitert der Commit, wird abgebrochen:
// es bleibt keine Teilschreibung zurück. Ohne den Abbruch würde die Transaktion die bis dahin gestellten Aufträge festschreiben.
async function inTransaction(db, names, mode, body) {
  const tx = db.transaction(names, mode);
  const finished = new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error || new Error('Transaktion abgebrochen'));
  });
  // Der Abbruch nach einem Fehler im body ist gewollt. Die Ablehnung darf nicht als unbehandelt gelten.
  finished.catch(() => {});
  const stores = Object.fromEntries(names.map((name) => [name, tx.objectStore(name)]));
  try {
    const result = await body(stores);
    await finished;
    return result;
  } catch (error) {
    try {
      tx.abort();
    } catch (abortError) {
      // Die Transaktion ist schon beendet. Dann gab es nichts mehr abzubrechen.
    }
    throw error;
  }
}

/**
 * IndexedDB-Zweig. readLegacy liest den Altstand aus localStorage, ohne ihn zu löschen (db.js:53-61).
 * Gelöscht wird er erst über removeLegacy, nachdem das Schreiben in IndexedDB bestätigt ist (RULE-187).
 */
export function createIdbBackend({ db, now, legacyStorage }) {
  const readDoc = (key) => inTransaction(db, ['docs'], 'readonly', async ({ docs }) => {
    const row = await wrap(docs.get(key));
    return row === undefined ? { status: 'absent' } : { status: 'ok', value: row.value };
  });

  const writeDoc = (key, value) => inTransaction(db, ['docs'], 'readwrite', ({ docs }) =>
    wrap(docs.put({ key, value, updatedAt: now() })));

  const readLegacy = async (key) => {
    if (!legacyStorage) return { status: 'absent' };
    try {
      return readRaw(legacyStorage, key);
    } catch (error) {
      return { status: 'absent' }; // Ein Lesefehler am Altstand darf nichts löschen, also gilt er als nicht vorhanden.
    }
  };

  const removeLegacy = async (key) => {
    if (legacyStorage) legacyStorage.removeItem(key);
  };

  const listDocs = () => inTransaction(db, ['docs'], 'readonly', async ({ docs }) => {
    const rows = await wrap(docs.getAll());
    return splitDocs(rows.map((row) => [row.key, row.value]));
  });

  const listLog = () => inTransaction(db, ['log'], 'readonly', ({ log }) => wrap(log.getAll()));

  const appendLog = (row) => inTransaction(db, ['log'], 'readwrite', ({ log }) =>
    wrap(log.add(withoutId(row))));

  // Sicherung einspielen: Dokumente ersetzen, Protokoll zusammenführen. Alles in einer Transaktion (SCHULD-3, RULE-126).
  const importAtomic = ({ docs: entries, logRows }) =>
    inTransaction(db, ['docs', 'log'], 'readwrite', async ({ docs, log }) => {
      for (const [key, value] of Object.entries(entries)) {
        await wrap(docs.put({ key, value, updatedAt: now() }));
      }
      const existing = await wrap(log.getAll());
      for (const row of newLogRows(existing, logRows)) {
        await wrap(log.add(row));
      }
    });

  return {
    name: 'indexeddb',
    readDoc,
    writeDoc,
    readLegacy,
    removeLegacy,
    listDocs,
    listLog,
    appendLog,
    importAtomic,
    probe: () => readDoc(IDB_PROBE),
    close: async () => db.close()
  };
}
