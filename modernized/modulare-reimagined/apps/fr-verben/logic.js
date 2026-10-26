// Logik des Cahier de Verbes: Modell, Aufgaben-Erzeuger, Diagramme und die Theorieseite mit Sprachausgabe.
// Herkunft: legacy/modulare/apps/franzoesisch-verben/logic.js. Lernstoff liegt in content/fr-verben/.
import { init } from './model.js';
import { lessonRound, bossRound, quickRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';
import { Theory } from './theory.js';

export default { init, diagrams, Theory, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
