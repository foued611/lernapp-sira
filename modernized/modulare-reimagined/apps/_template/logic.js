// Logik einer neuen App. Kopieren nach apps/<id>/, dann in apps/index.js eintragen.
// Steht der Stoff ganz im Inhalt, reicht das. Eigene Rechenaufgaben: siehe apps/mathe/builders.js (createBuilders).
import { poolApp } from '../../runde/index.js';
import * as diagrams from './diagrams.js';

export default poolApp({ diagrams });
