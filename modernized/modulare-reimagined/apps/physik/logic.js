// Logik der Physik-Werkstatt. Fragen, Lektionen, Trophäen und Seiten liegen in content/physik/.
// Vorlage: apps/englisch/logic.js (gleicher Aufbau).
import { init, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
