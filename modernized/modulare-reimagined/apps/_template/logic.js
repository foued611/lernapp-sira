// Logik einer neuen App. Kopieren nach apps/<id>/, dann in apps/index.js eintragen.
import { init, lessonRound, quickRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound }, blitz: blitzQuestion };
