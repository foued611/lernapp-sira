// Feste Namen aus dem Legacy-Code. Sie stehen in gespeicherten Daten und werden nie umbenannt.
// Quelle: legacy/modulare/core/js/db.js:6-10 und profile.js:6-7.

export const DB_NAME = 'lernwerkstatt';

// Bewusst 1: Legacy und Neubau teilen dieselbe Datenbank (Koexistenz). Erhöhen nur mit Migrationsplan.
export const DB_VERSION = 1;

export const PREFIX = 'lernwerkstatt:';
export const LOG_KEY = 'lernwerkstatt:log';
export const PROFILE_KEY = 'lernwerkstatt:profile';
export const APP_KEY_PREFIX = 'lernwerkstatt:app:';

// Probe für den localStorage-Zweig: wird sofort wieder entfernt.
export const PROBE_KEY = 'lernwerkstatt:__probe';

// Ablage für unlesbare oder fremd geformte Stände (RULE-135). Der Schlüssel endet auf den Zeitstempel.
export const RAW_PREFIX = 'lernwerkstatt:rohdaten:';

export const BACKUP_APP = 'lernwerkstatt';
export const BACKUP_FORMAT = 1;

// Obergrenze für eine Sicherungsdatei beim Einspielen. Die Prüfung läuft vor dem Lesen der Datei.
export const MAX_IMPORT_BYTES = 20 * 1024 * 1024;

// Standardanzahl bei listEvents (db.js:63).
export const DEFAULT_EVENT_LIMIT = 200;
