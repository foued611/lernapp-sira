// Logik der Vokabel-App Access 2, Unit 6. Fragen, Lektionen, Trophäen und Seiten liegen in content/access-2-unit-6/.
// Vorlage: apps/englisch/logic.js.
import { init, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
