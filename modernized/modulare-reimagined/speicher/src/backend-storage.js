// Zweig localStorage und Arbeitsspeicher. Dieselbe Dokumentform wie im IndexedDB-Zweig,
// damit ein Wechsel des Zweigs die gespeicherten Daten nicht verändert.
import { LOG_KEY, PREFIX } from './constants.js';
import { newLogRows, readRaw, splitDocs, withIds, withoutId } from './records.js';

/**
 * Jede Schreibung ist ein einzelner setItem-Aufruf oder wird bei einem Fehler zurückgerollt.
 * Ein Fehler wird weitergereicht, damit der Aufrufer ihn meldet.
 */
export function createStorageBackend(name, storage) {
  // Ein unlesbares Protokoll wirft. So wird es nicht durch ein neues Protokoll überschrieben (SCHULD-2).
  const readLog = () => {
    const raw = storage.getItem(LOG_KEY);
    if (raw === null || raw === undefined) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Das Protokoll ist unlesbar.');
    return parsed;
  };

  const restore = (before) => {
    for (const [key, raw] of before) {
      if (raw === null || raw === undefined) storage.removeItem(key);
      else storage.setItem(key, raw);
    }
  };

  const listDocs = async () => {
    const entries = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (typeof key !== 'string' || !key.startsWith(PREFIX)) continue; // fremde Schlüssel derselben Herkunft bleiben unangetastet
      const row = readRaw(storage, key);
      entries.push([key, row.status === 'ok' ? row.value : undefined]);
    }
    return splitDocs(entries);
  };

  return {
    name,
    async readDoc(key) {
      return readRaw(storage, key);
    },
    async writeDoc(key, value) {
      storage.setItem(key, JSON.stringify(value));
    },
    listDocs,
    async listLog() {
      return readLog();
    },
    async appendLog(row) {
      const existing = readLog();
      storage.setItem(LOG_KEY, JSON.stringify([...existing, ...withIds([withoutId(row)], existing)]));
    },
    async importAtomic({ docs, logRows }) {
      const before = new Map();
      const remember = (key) => {
        if (!before.has(key)) before.set(key, storage.getItem(key));
      };
      try {
        for (const [key, value] of Object.entries(docs)) {
          remember(key);
          storage.setItem(key, JSON.stringify(value));
        }
        if (logRows.length > 0) {
          remember(LOG_KEY);
          const existing = readLog();
          const fresh = newLogRows(existing, logRows);
          storage.setItem(LOG_KEY, JSON.stringify([...existing, ...withIds(fresh, existing)]));
        }
      } catch (error) {
        restore(before); // Alle Schreibungen der Sicherung rückgängig machen (SCHULD-3)
        throw error;
      }
    },
    async close() {}
  };
}
