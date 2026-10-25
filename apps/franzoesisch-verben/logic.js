// Logik des Cahier de Verbes: Modell, Aufgaben-Erzeuger, Diagramme und die Theorie-Seite mit Konjugationstabelle.
// Lernstoff liegt in content/fr-verben/.
import { init } from './model.js';
import { lessonRound, bossRound, quickRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, theory: renderTheory, rounds: { lesson: lessonRound, boss: bossRound, quick: quickRound }, blitz: blitzQuestion };
