// Prüft Sicherungen und Protokollzeilen, bevor etwas geschrieben wird (SCHULD-3, SEC-001).
// Legacy prüfte nur app und docs und ließ das Protokoll ungeprüft durch (db.js:126-133).
import { BACKUP_APP, BACKUP_FORMAT, LOG_KEY, PREFIX } from './constants.js';
import { isPlain } from './util.js';
import { firstBadField } from './schema.js';

export class BackupError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BackupError';
  }
}

const MAX_TEXT = 200; // Zeichen je Text im Protokoll
const MAX_KEY = 200; // Zeichen je Schlüssel im Dokumentenspeicher
const MAX_DEPTH = 32; // Verschachtelungstiefe, begrenzt die Rekursion bei fremden Dateien
const FORBIDDEN_FIELDS = new Set(['__proto__']);

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isText = (value) => typeof value === 'string' && value.length > 0 && value.length <= MAX_TEXT;
const isNullableText = (value) => value === null || isText(value);
const isFlag = (value) => typeof value === 'boolean';
const isShortScalar = (value) => {
  if (typeof value === 'string') return value.length <= MAX_TEXT;
  return value === null || typeof value === 'boolean' || isNumber(value);
};

// Erwartete Typen der bekannten Felder. Die Runden der Legacy-App schreiben genau diese (shell.js:104).
// Eine Map statt eines Objekts, damit Namen wie "constructor" nicht den Prototyp treffen.
const FIELD_TYPES = new Map([
  ['id', isNumber],
  ['ts', isNumber],
  ['app', isText],
  ['type', isText],
  ['mode', isNullableText],
  ['unit', isNullableText],
  ['accuracy', isNumber],
  ['stars', isNumber],
  ['failed', isFlag],
  ['score', isNumber],
  ['xp', isNumber]
]);

const fail = (path, detail) => new BackupError(`Ungültige Daten bei ${path}: ${detail}.`);

/** Eine Protokollzeile: ts und app sind Pflicht, bekannte Felder haben feste Typen, unbekannte nur einfache Werte. */
export function validateLogRow(row, path = 'Ereignis') {
  if (!isPlain(row)) throw fail(path, 'erwartet ein Objekt');
  if (!isNumber(row.ts)) throw fail(`${path}.ts`, 'erwartet eine Zahl');
  if (!isText(row.app)) throw fail(`${path}.app`, 'erwartet einen Text');
  for (const [field, value] of Object.entries(row)) {
    const where = `${path}.${field}`;
    if (FORBIDDEN_FIELDS.has(field)) throw fail(where, 'unzulässiger Feldname');
    if (FIELD_TYPES.has(field)) {
      if (!FIELD_TYPES.get(field)(value)) throw fail(where, 'falscher Typ');
    } else if (!isShortScalar(value)) {
      throw fail(where, 'nur einfache Werte sind erlaubt');
    }
  }
}

// Ein Dokumentwert darf nur JSON-Bausteine enthalten. Funktionen oder Klassen gibt es in einer Datei nicht.
function checkTree(value, path, depth = 0) {
  if (depth > MAX_DEPTH) throw fail(path, 'zu tief verschachtelt');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw fail(path, 'keine endliche Zahl');
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkTree(item, `${path}[${index}]`, depth + 1));
    return;
  }
  if (isPlain(value)) {
    for (const [field, item] of Object.entries(value)) {
      if (FORBIDDEN_FIELDS.has(field)) throw fail(`${path}.${field}`, 'unzulässiger Feldname');
      checkTree(item, `${path}.${field}`, depth + 1);
    }
    return;
  }
  throw fail(path, 'unzulässiger Wert');
}

function validateDoc(key, value) {
  const where = `docs["${String(key).slice(0, 60)}"]`;
  if (typeof key !== 'string' || !key.startsWith(PREFIX) || key === LOG_KEY || key.length > MAX_KEY) {
    throw fail(where, 'Schlüssel gehört nicht zur Lernwerkstatt');
  }
  if (!isPlain(value)) throw fail(where, 'erwartet ein Objekt');
  checkTree(value, where);
  // SEC-001: bekannte Felder haben feste Typen. Ein Text in xp würde sonst gespeichert.
  const bad = firstBadField(key, value);
  if (bad) throw fail(`${where}.${bad}`, 'falscher Typ');
}

/**
 * Prüft eine geparste Sicherung vollständig. Wirft beim ersten Fehler, bevor irgendetwas geschrieben wird.
 * Fremde Dateien (app oder format passen nicht) bekommen die Meldung aus legacy db.js:127 bzw. eine Formatmeldung (RULE-256).
 */
export function validateBackup(data) {
  if (!isPlain(data) || data.app !== BACKUP_APP) throw new BackupError('Das ist keine Sicherung der Lernwerkstatt.');
  if (data.format !== BACKUP_FORMAT) throw new BackupError('Dieses Sicherungsformat wird nicht unterstützt.');
  if (!isPlain(data.docs)) throw fail('docs', 'erwartet ein Objekt');
  for (const [key, value] of Object.entries(data.docs)) validateDoc(key, value);
  const log = data.log === undefined ? [] : data.log;
  if (!Array.isArray(log)) throw fail('log', 'erwartet eine Liste');
  log.forEach((row, index) => validateLogRow(row, `log[${index}]`));
  return { docs: data.docs, log };
}
