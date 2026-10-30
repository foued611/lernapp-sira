// Logik der Biologie-Werkstatt. Fragen, Lektionen, Trophäen und Seiten liegen in content/biologie/.
// Vorlage: apps/englisch/logic.js.
import { poolApp } from '../../runde/index.js';
import * as diagrams from './diagrams.js';

export default poolApp({ diagrams, typedLabel: 'Schreibe die Form' });
