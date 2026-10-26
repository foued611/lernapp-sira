// Öffentliche Schnittstelle des Dienstes speicher. Andere Teile importieren nur von hier.
// Einziger Zugang zu IndexedDB und localStorage. Schreibfehler kommen als Ergebnis zurück, nicht als Stille.
export { openStore } from './src/open.js';
export { appKey, openApp, openProfile, PROFILE_KEY } from './src/profile.js';
export { BackupError } from './src/validate.js';
