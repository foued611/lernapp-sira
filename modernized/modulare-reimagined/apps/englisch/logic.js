// Logik der Englisch-Werkstatt. Fragen, Lektionen, Trophäen und Seiten liegen in content/englisch/.
// Herkunft: legacy apps/englisch/logic.js.
import { logicOf } from '../../runde/index.js';
import { createBuilders } from './builders.js';
import * as diagrams from './diagrams.js';

export default { diagrams, create: (paket) => logicOf(createBuilders(paket)) };
