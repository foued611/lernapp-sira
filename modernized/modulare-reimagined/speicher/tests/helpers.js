// Testhilfen. Die simulierte IndexedDB kommt von fake-indexeddb und wird nur in Tests geladen.
import 'fake-indexeddb/auto';
import { openStore } from '../index.js';

export const KEY = 'lernwerkstatt:profile';

export const defaults = () => ({ xp: 0, stars: {}, day: { d: '', xp: 0 } });

/** Leert die simulierte Datenbank. Offene Verbindungen müssen vorher geschlossen sein. */
export function resetDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('lernwerkstatt');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Löschen blockiert: offene Verbindung'));
  });
}

/** Öffnet einen Speicher für einen Test. Die Verbindung wird nach dem Test geschlossen. */
export async function openTestStore(t, options = {}) {
  const handle = await openStore({ indexedDB, localStorage: null, ...options });
  t.after(() => handle.close());
  return handle;
}

/** Storage-artiges Objekt mit optionalem Fehlerschalter und Beobachtung des Entfernens. */
export function fakeStorage({ failWrites = () => false, onRemove = () => {} } = {}) {
  const items = new Map();
  return {
    get length() {
      return items.size;
    },
    key: (index) => [...items.keys()][index] ?? null,
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem(key, value) {
      if (failWrites()) throw new Error('QuotaExceededError');
      items.set(key, String(value));
    },
    removeItem(key) {
      onRemove(key);
      items.delete(key);
    }
  };
}

/**
 * Simulierte IndexedDB mit Haken. Ein Haken ist eine Funktion (storeName, arg). Sie darf werfen,
 * dann schlägt der Aufruf synchron fehl, genau wie ein echter Fehler im Zugriff.
 * Hooks: get(store, key), put(store, row), add(store, row), transaction(names, mode), committed(names, mode).
 */
export function faultyIndexedDB(hooks = {}) {
  return {
    open(name, version) {
      const request = indexedDB.open(name, version);
      // Der Listener steht vor dem onsuccess des Dienstes und sieht die Verbindung daher zuerst.
      request.addEventListener('success', () => patchDatabase(request.result, hooks));
      return request;
    }
  };
}

function patchDatabase(db, hooks) {
  const realTransaction = db.transaction.bind(db);
  db.transaction = (names, mode) => {
    const list = [names].flat();
    hooks.transaction?.(list, mode);
    const tx = realTransaction(names, mode);
    tx.addEventListener('complete', () => hooks.committed?.(list, mode));
    return new Proxy(tx, {
      get(target, prop) {
        if (prop === 'objectStore') return (name) => wrapStore(target.objectStore(name), name, hooks);
        const value = Reflect.get(target, prop, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      }
    });
  };
}

function wrapStore(store, name, hooks) {
  return new Proxy(store, {
    get(target, prop) {
      const hook = hooks[prop];
      if (typeof hook === 'function' && typeof target[prop] === 'function') {
        return (arg) => {
          hook(name, arg);
          return target[prop](arg);
        };
      }
      const value = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) : value;
    }
  });
}

/** Schreibt einen Rohwert in die docs-Sammlung, ohne den Dienst. So entstehen Stände, die der Dienst selbst nicht schreiben würde. */
export function writeRawRow(key, value) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('lernwerkstatt', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('docs', { keyPath: 'key' });
      const log = db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
      log.createIndex('app', 'app');
      log.createIndex('ts', 'ts');
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('docs', 'readwrite');
      tx.objectStore('docs').put({ key, value, updatedAt: 0 });
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
  });
}

/** Sicherungsdatei als Blob, wie sie der Browser liefert. */
export const blobOf = (object) => new Blob([JSON.stringify(object)], { type: 'application/json' });

export const backupOf = ({ docs = {}, log = [] } = {}) => ({
  app: 'lernwerkstatt',
  format: 1,
  exportedAt: '2026-10-26T10:00:00.000Z',
  docs,
  log
});
