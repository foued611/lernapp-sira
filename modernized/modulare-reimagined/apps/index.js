// Logik je App (AGENTS.md, App-Vertrag). Die Seiten holen sie über logicFor(id). Eine App ohne Eintrag hat keine Logik:
// ihre Kacheln zeigen dann die Meldung "nicht geladen" (RULE-202 und Phase 5b).
import deutsch from './deutsch/logic.js';
import mathe from './mathe/logic.js';
import infoZahlen from './info-zahlen/logic.js';
import geometrie from './geometrie/logic.js';
import englisch from './englisch/logic.js';
import decouvertes from './decouvertes/logic.js';
import physik from './physik/logic.js';
import geographie from './geographie/logic.js';
import biologie from './biologie/logic.js';

const LOGIC = { deutsch, geometrie, mathe, englisch, 'decouvertes-2': decouvertes, 'info-zahlen': infoZahlen, physik, geographie, biologie };

/** Logik der App mit der Kennung id, sonst ein leeres Objekt. */
export const logicFor = (id) => (Object.hasOwn(LOGIC, id) ? LOGIC[id] : {});
