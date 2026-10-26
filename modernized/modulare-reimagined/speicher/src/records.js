// Gemeinsame Regeln für Datensätze, für beide Zweige gleich. Reine Funktionen, ohne Speicherzugriff.
import { LOG_KEY, PREFIX, PROBE_KEY } from './constants.js';
import { canonical, isPlain } from './util.js';

/** Liest einen Schlüssel aus einem localStorage-artigen Speicher. Unlesbares JSON wird als Rohtext gemeldet. */
export function readRaw(storage, key) {
  const raw = storage.getItem(key);
  if (raw === null || raw === undefined) return { status: 'absent' };
  try {
    return { status: 'ok', value: JSON.parse(raw) };
  } catch (error) {
    return { status: 'corrupt', raw };
  }
}

/**
 * Trennt Dokumente für den Export: nur Schlüssel der Lernwerkstatt mit Objektwert.
 * Alles andere wird genannt, nicht still mitexportiert. Eine Sicherung mit so einem Eintrag wäre beim Einspielen abgelehnt.
 */
export function splitDocs(entries) {
  const docs = {};
  const skipped = [];
  for (const [key, value] of entries) {
    const usable = typeof key === 'string' && key.startsWith(PREFIX) && key !== LOG_KEY && key !== PROBE_KEY;
    if (usable && isPlain(value)) docs[key] = value;
    else skipped.push(key);
  }
  return { docs, skipped };
}

export const withoutId = (row) => {
  const { id, ...rest } = row;
  return rest;
};

/**
 * Welche Protokollzeilen beim Einspielen wirklich neu sind (RULE-126).
 * Eine Zeile gilt als vorhanden, wenn alle Felder außer der id gleich sind. Doppelte Zeilen in der Datei zählen nur einmal.
 * Dadurch bleibt Einspielen derselben Sicherung ohne Wirkung.
 */
export function newLogRows(existing, incoming) {
  const seen = new Set(existing.map((row) => canonical(withoutId(row))));
  const fresh = [];
  for (const row of incoming) {
    const rest = withoutId(row);
    const key = canonical(rest);
    if (seen.has(key)) continue;
    seen.add(key);
    fresh.push(rest);
  }
  return fresh;
}

/** Gibt neuen Zeilen fortlaufende ids, die nach der höchsten vorhandenen id weitergehen. */
export function withIds(rows, existing) {
  let next = existing.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
  return rows.map((row) => ({ id: next++, ...row }));
}
