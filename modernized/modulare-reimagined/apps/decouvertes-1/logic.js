// Logik der Französisch-Werkstatt zu Découvertes 1. Fragen, Lektionen, Trophäen und Seiten liegen in content/decouvertes-1/.
// Vorlage ist apps/englisch/logic.js: Pool-App mit Vokabel-Seiten.
import { logicOf } from '../../runde/index.js';
import { createBuilders } from './builders.js';
import * as diagrams from './diagrams.js';

export default { diagrams, create: (paket) => logicOf(createBuilders(paket)) };
