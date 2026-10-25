// Logik der Zahlenwerkstatt: Aufgaben-Erzeuger, Diagramme und die Theorie-Spielzeuge. Inhalte liegen in content/info-zahlen/.
import { init, lessonRound, bossRound, quickRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, theory: renderTheory, rounds: { lesson: lessonRound, boss: bossRound, quick: quickRound }, blitz: blitzQuestion };
