// Logik der Mathe-Werkstatt: Aufgaben-Erzeuger und Diagramme. Alle Inhalte (Seiten, Lektionen, Trophäen, Daten)
// liegen in content/mathe/. Herkunft: legacy/modulare/apps/mathe/logic.js. Die App hat keine eigene Theorie und
// keine eigene Endgegner-Freischaltung; es gilt der Standard aus seiten/ablauf.js (bossOpen).
import { logicOf } from '../../runde/index.js';
import { createBuilders } from './builders.js';
import * as diagrams from './diagrams.js';

export default { diagrams, create: (paket) => logicOf(createBuilders(paket)) };
