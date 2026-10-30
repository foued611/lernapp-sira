// Logik der Musik-Werkstatt. Fragen, Lektionen, Trophäen und Seiten liegen in content/musik/, die Klangbeispiele in data.klang.
// Vorlage: apps/englisch/logic.js. Die Theorieseite (theory.js) zeigt zusätzlich die Klangbeispiele.
import { poolApp } from '../../runde/index.js';
import * as diagrams from './diagrams.js';
import { Theory } from './theory.js';

export default poolApp({ diagrams, Theory, typedLabel: 'Schreibe die Form' });
