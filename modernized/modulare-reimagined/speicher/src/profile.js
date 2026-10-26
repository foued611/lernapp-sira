// Profil und App-Stand als Dokumente. Legacy: core/js/profile.js:6-7 und 19-20.
// Die Standardwerte kommen vom Aufrufer (regeln). So kennt der Speicher keine Spielregeln.
import { APP_KEY_PREFIX, PROFILE_KEY } from './constants.js';

export { PROFILE_KEY };

export const appKey = (appId) => `${APP_KEY_PREFIX}${appId}`;

export const openProfile = (db, defaults, options) => db.createStore(PROFILE_KEY, defaults, options);

export const openApp = (db, appId, defaults, options) => db.createStore(appKey(appId), defaults, options);
