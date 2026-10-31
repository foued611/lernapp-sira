// Logik der Deutsch-Werkstatt 5/6. Fragen, Lektionen, Trophäen und Seiten liegen in content/deutsch-5-6/.
import { poolApp } from '../../runde/index.js';
import * as diagrams from './diagrams.js';

export default poolApp({ diagrams, typedLabel: 'Schreibe das Wort' });
