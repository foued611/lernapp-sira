// Logik der Mathe-Werkstatt: Aufgaben-Erzeuger und Diagramme. Alle Inhalte (Seiten, Lektionen, Trophäen, Daten)
// liegen in content/mathe/ und werden über core/js/appconfig.js zugeführt.
import { init, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
