// Logik je App (AGENTS.md, App-Vertrag). Die Seiten holen sie über logicFor(id). Eine App ohne Eintrag hat keine Logik:
// ihre Kacheln zeigen dann die Meldung "nicht geladen" (RULE-202 und Phase 5b).
import deutsch from './deutsch/logic.js';
import mathe from './mathe/logic.js';
import frVerben from './fr-verben/logic.js';
import infoZahlen from './info-zahlen/logic.js';
import geometrie from './geometrie/logic.js';
import englisch from './englisch/logic.js';

const LOGIC = { deutsch, geometrie, mathe, englisch, 'fr-verben': frVerben, 'info-zahlen': infoZahlen };

/** Logik der App mit der Kennung id, sonst ein leeres Objekt. */
export const logicFor = (id) => (Object.hasOwn(LOGIC, id) ? LOGIC[id] : {});
