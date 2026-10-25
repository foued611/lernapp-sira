// Logik der Vorlage: Aufgaben-Erzeuger und Diagramme. Alles andere (Seiten, Lektionen, Trophäen, Aufgabendaten)
// steht in content/vorlage/. Theorie und Trophäen kommen aus dem Kern, hier ist nichts dafür nötig.
import { init, lessonRound, quickRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound }, blitz: blitzQuestion };
