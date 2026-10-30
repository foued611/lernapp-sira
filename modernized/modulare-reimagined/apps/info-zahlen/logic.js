// Logik der Zahlenwerkstatt: Aufgaben, Diagramme und die Theorie mit Spielzeugen. Inhalte liegen in content/info-zahlen/.
// Herkunft: legacy/modulare/apps/informatik/logic.js.
import { logicOf } from '../../runde/index.js';
import { createBuilders } from './builders.js';
import * as diagrams from './diagrams.js';
import { Theory } from './theory.js';

export default { diagrams, Theory, create: (paket) => logicOf(createBuilders(paket)) };
