// Ereignisprotokoll (eine Zeile je beendeter Runde). Legacy: core/js/db.js:135-142.
// Fehler bremsen die App nie. Sie werden aber zurückgegeben, damit sie nicht unbemerkt verloren gehen.
import { DEFAULT_EVENT_LIMIT } from './constants.js';
import { withoutId } from './records.js';
import { BackupError, validateLogRow } from './validate.js';

export async function logEvent(ctx, entry) {
  try {
    // ts kommt immer vom Speicher. Legacy ließ einen eigenen ts-Wert zu (db.js:137).
    const row = { ...withoutId(entry), ts: ctx.now() };
    // Dieselbe Prüfung wie beim Einspielen. Sonst entstünde eine Zeile, mit der sich die eigene Sicherung nicht mehr einspielen lässt.
    validateLogRow(row, 'Ereignis');
    await ctx.backend.appendLog(row);
    return { ok: true };
  } catch (error) {
    const message = error instanceof BackupError ? error.message : 'Das Ereignis konnte nicht gespeichert werden.';
    return { ok: false, error: message, cause: error };
  }
}

export async function listEvents(ctx, { app, limit = DEFAULT_EVENT_LIMIT } = {}) {
  try {
    const rows = await ctx.backend.listLog();
    const filtered = app ? rows.filter((row) => row.app === app) : rows;
    // slice(-0) lieferte früher alle Zeilen. Eine Grenze von 0 heißt hier: keine Zeile.
    return limit > 0 ? filtered.slice(-limit) : [];
  } catch (error) {
    return []; // Lesen ist optional: die App läuft ohne Protokoll weiter (db.js:141)
  }
}
