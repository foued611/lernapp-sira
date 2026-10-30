// Logik je App (AGENTS.md, App-Vertrag). Die Seiten holen sie über loadLogic(id) erst beim Öffnen, deshalb liegt jede App in
// einem eigenen Paket. Eine App ohne Eintrag hat keine Logik. apps/tests/katalog.test.js prüft die Liste gegen den Katalog.
const LOGIC = {
  deutsch: () => import('./deutsch/logic.js'),
  mathe: () => import('./mathe/logic.js'),
  'info-zahlen': () => import('./info-zahlen/logic.js'),
  geometrie: () => import('./geometrie/logic.js'),
  englisch: () => import('./englisch/logic.js'),
  'decouvertes-2': () => import('./decouvertes/logic.js'),
  physik: () => import('./physik/logic.js'),
  geographie: () => import('./geographie/logic.js'),
  biologie: () => import('./biologie/logic.js'),
  musik: () => import('./musik/logic.js')
};

// Eigene Optik der Apps mit Spielzeugen. Vite löst den Import auf, node:test ruft ihn nie auf.
const STYLE = {
  'decouvertes-2': () => import('./decouvertes/verben/app.css'),
  'info-zahlen': () => import('./info-zahlen/app.css'),
  geometrie: () => import('./geometrie/app.css')
};

/** IDs aller Apps mit Logik. */
export const logicIds = () => Object.keys(LOGIC);

/** Logik der App mit der Kennung id, sonst ein leeres Objekt. */
export const loadLogic = async (id) => (Object.hasOwn(LOGIC, id) ? (await LOGIC[id]()).default : {});

/** Optik der App, falls sie eigene hat. */
export const loadStyle = async (id) => { if (Object.hasOwn(STYLE, id)) await STYLE[id](); };
