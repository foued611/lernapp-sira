// Sicherung: Export, Prüfung und Einspielen. Legacy: core/js/db.js:117-133 und views/backup.js.
// Die Datei-Oberfläche (Download, Dateiwahl, Neuladen) bleibt beim Aufrufer.
import { BACKUP_APP, BACKUP_FORMAT, MAX_IMPORT_BYTES } from './constants.js';
import { newLogRows } from './records.js';
import { BackupError, validateBackup } from './validate.js';

/** Alles, was der Speicher hält: alle Dokumente und das komplette Protokoll (RULE-256). */
export async function exportAll(ctx) {
  const { docs, skipped } = await ctx.backend.listDocs();
  // Keine Obergrenze. Legacy schnitt auf die letzten 1000 Zeilen ab (db.js:122).
  const log = await ctx.backend.listLog();
  return {
    app: BACKUP_APP,
    format: BACKUP_FORMAT,
    exportedAt: new Date(ctx.now()).toISOString(),
    docs,
    log,
    skipped
  };
}

// Liest die Datei. Die Größe wird vor dem Lesen geprüft, damit eine riesige Datei nicht erst in den Speicher geladen wird.
async function readFile(file) {
  const size = typeof file === 'string' ? new TextEncoder().encode(file).byteLength : Number(file?.size);
  if (!Number.isFinite(size)) throw new BackupError('Die Datei konnte nicht gelesen werden.');
  if (size > MAX_IMPORT_BYTES) throw new BackupError('Die Sicherung ist zu groß (höchstens 20 MB).');
  const text = typeof file === 'string' ? file : await file.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new BackupError('Die Datei ist kein gültiges JSON.');
  }
}

// Plan: welche Dokumente ersetzt oder neu angelegt werden und wie viele Protokollzeilen neu sind.
async function buildPlan(ctx, backup) {
  const docs = [];
  for (const key of Object.keys(backup.docs)) {
    const current = await ctx.backend.readDoc(key);
    docs.push({ key, status: current.status === 'absent' ? 'new' : 'replaced' });
  }
  const existing = await ctx.backend.listLog();
  const logNew = newLogRows(existing, backup.log).length;
  return { docs, logNew, logDuplicates: backup.log.length - logNew };
}

async function prepare(ctx, file) {
  let backup;
  try {
    backup = validateBackup(await readFile(file));
  } catch (error) {
    const message = error instanceof BackupError ? error.message : 'Die Datei konnte nicht gelesen werden.';
    return { ok: false, error: message, cause: error };
  }
  try {
    return { ok: true, backup, plan: await buildPlan(ctx, backup) };
  } catch (error) {
    return { ok: false, error: 'Der Speicher konnte nicht gelesen werden.', cause: error };
  }
}

/** Zeigt, was eingespielt würde. Schreibt nichts. */
export async function planImport(ctx, file) {
  const prepared = await prepare(ctx, file);
  return prepared.ok ? { ok: true, plan: prepared.plan } : { ok: false, error: prepared.error };
}

/**
 * Spielt eine Sicherung ein. Ohne confirm: true wird nichts geschrieben, nur der Plan geliefert (RULE-126).
 * Dokumente mit gleichem Schlüssel werden ersetzt, fehlende bleiben. Das Protokoll wird zusammengeführt, nicht ersetzt.
 */
export async function importAll(ctx, file, { confirm = false } = {}) {
  const prepared = await prepare(ctx, file);
  if (!prepared.ok) return { ok: false, error: prepared.error };
  if (confirm !== true) return { ok: false, needsConfirm: true, plan: prepared.plan };
  try {
    // Eine Transaktion: entweder alles oder nichts (SCHULD-3).
    await ctx.backend.importAtomic({ docs: prepared.backup.docs, logRows: prepared.backup.log });
    return { ok: true, plan: prepared.plan };
  } catch (error) {
    return { ok: false, error: 'Die Sicherung konnte nicht eingespielt werden. Es wurde nichts geändert.', cause: error };
  }
}
