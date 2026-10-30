// Logik der Deutsch-Werkstatt. Fragen, Lektionen, Trophäen und Seiten liegen in content/deutsch/.
// Herkunft: legacy/modulare/apps/deutsch/logic.js.
import { poolApp } from '../../runde/index.js';
import * as diagrams from './diagrams.js';

export default poolApp({ diagrams, typedLabel: 'Schreibe das Wort', withTrack: true });
