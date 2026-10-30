// Logik der Geometrie-Werkstatt: Aufgaben-Erzeuger und Diagramme. Alle Inhalte liegen in content/geometrie/.
// Herkunft: legacy/modulare/apps/geometrie/logic.js.
import { logicOf } from '../../runde/index.js';
import { createBuilders } from './builders.js';
import * as diagrams from './diagrams.js';

export default { diagrams, create: (paket) => logicOf(createBuilders(paket)) };
