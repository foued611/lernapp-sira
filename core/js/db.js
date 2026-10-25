// Browser-Datenbank: IndexedDB mit automatischem Ausweichen auf localStorage.
// Das Schema ist bewusst offen: "docs" speichert beliebige JSON-Dokumente unter einem Schlüssel,
// "log" speichert beliebige Ereignisse (z. B. beendete Runden). Neue Felder brauchen keine Migration.
// Neue Sammlungen: DB_VERSION erhöhen und in upgrade() ergänzen (siehe AGENTS.md).

const DB_NAME = 'lernwerkstatt';
const DB_VERSION = 1;
const PREFIX = 'lernwerkstatt:';
const LOG_KEY = `${PREFIX}log`;
const LOG_MAX = 1000;

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

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB fehlt')); return; }
    let request;
    try { request = indexedDB.open(DB_NAME, DB_VERSION); } catch (error) { reject(error); return; }
    request.onupgradeneeded = () => upgrade(request.result);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('IndexedDB blockiert'));
  });
}

/** Haupt-Backend. Alle Methoden sind asynchron. */
function idbBackend(db) {
  const tx = (store, mode = 'readonly') => db.transaction(store, mode).objectStore(store);
  return {
    name: 'indexeddb',
    async get(key) {
      const row = await wrap(tx('docs').get(key));
      return row ? row.value : undefined;
    },
    async put(key, value) { await wrap(tx('docs', 'readwrite').put({ key, value, updatedAt: Date.now() })); },
    async remove(key) { await wrap(tx('docs', 'readwrite').delete(key)); },
    async all() {
      const rows = await wrap(tx('docs').getAll());
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },
    async legacy(key) {
      // Alte Daten aus localStorage übernehmen und danach dort entfernen.
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return undefined;
        localStorage.removeItem(key);
        return JSON.parse(raw);
      } catch (error) { return undefined; }
    },
    async logAdd(entry) { await wrap(tx('log', 'readwrite').add(entry)); },
    async logList({ app, limit = 200 } = {}) {
      const rows = await wrap(tx('log').getAll());
      const filtered = app ? rows.filter((r) => r.app === app) : rows;
      return filtered.slice(-limit);
    },
    async logReplace(entries) {
      const store = tx('log', 'readwrite');
      await wrap(store.clear());
      for (const entry of entries) { const { id, ...rest } = entry; await wrap(tx('log', 'readwrite').add(rest)); }
    }
  };
}

/** Ausweichlösung: localStorage, wenn vorhanden, sonst nur Arbeitsspeicher. Schreibt synchron. */
function fallbackBackend() {
  const memory = new Map();
  const read = (key) => { try { return localStorage.getItem(key); } catch (error) { return memory.get(key) ?? null; } };
  const write = (key, raw) => { try { localStorage.setItem(key, raw); } catch (error) { memory.set(key, raw); } };
  const keys = () => { try { return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)); } catch (error) { return [...memory.keys()]; } };
  const readLog = () => { try { return JSON.parse(read(LOG_KEY)) || []; } catch (error) { return []; } };
  return {
    name: 'localstorage',
    sync: true,
    async get(key) { const raw = read(key); return raw ? JSON.parse(raw) : undefined; },
    async put(key, value) { write(key, JSON.stringify(value)); },
    async remove(key) { try { localStorage.removeItem(key); } catch (error) { memory.delete(key); } },
    async all() { return Object.fromEntries(keys().filter((k) => k !== LOG_KEY).map((k) => [k, JSON.parse(read(k))])); },
    async legacy() { return undefined; },
    async logAdd(entry) { write(LOG_KEY, JSON.stringify([...readLog(), { id: Date.now() + Math.random(), ...entry }].slice(-LOG_MAX))); },
    async logList({ app, limit = 200 } = {}) { const rows = readLog(); return (app ? rows.filter((r) => r.app === app) : rows).slice(-limit); },
    async logReplace(entries) { write(LOG_KEY, JSON.stringify(entries.slice(-LOG_MAX))); }
  };
}

let opening = null;

/** Öffnet die Datenbank genau einmal. Gibt immer ein funktionierendes Backend zurück. */
export function getDB() {
  if (!opening) {
    opening = openIndexedDB()
      .then(async (db) => {
        const backend = idbBackend(db);
        await backend.get('__probe'); // schlägt fehl, wenn der Browser IndexedDB sperrt
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (error) { /* optional */ }
        return backend;
      })
      .catch(() => fallbackBackend());
  }
  return opening;
}

/** Nur für Tests: zurücksetzen, damit ein neues Backend gewählt wird. */
export function resetDBForTests() { opening = null; }

// --- Sicherung ---------------------------------------------------------------

/** Alle Daten als einfaches Objekt (für den Download). */
export async function exportAll() {
  const db = await getDB();
  return { app: 'lernwerkstatt', format: 1, exportedAt: new Date().toISOString(), docs: await db.all(), log: await db.logList({ limit: LOG_MAX }) };
}

/** Spielt eine Sicherung ein. Vorhandene Dokumente mit gleichem Schlüssel werden ersetzt. */
export async function importAll(data) {
  if (!data || data.app !== 'lernwerkstatt' || typeof data.docs !== 'object') throw new Error('Das ist keine Sicherung der Lernwerkstatt.');
  const db = await getDB();
  for (const [key, value] of Object.entries(data.docs)) {
    if (key.startsWith(PREFIX) && value && typeof value === 'object') await db.put(key, value);
  }
  if (Array.isArray(data.log)) await db.logReplace(data.log);
}

/** Ein Ereignis ins Protokoll schreiben. Fehler bremsen die App nie. */
export async function logEvent(entry) {
  try { await (await getDB()).logAdd({ ts: Date.now(), ...entry }); } catch (error) { /* Protokoll ist optional */ }
}

export async function listEvents(options) {
  try { return await (await getDB()).logList(options); } catch (error) { return []; }
}
