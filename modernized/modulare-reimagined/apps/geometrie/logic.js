// Logik der Geometrie-Werkstatt: Aufgaben-Erzeuger und Diagramme. Alle Inhalte liegen in content/geometrie/.
// Herkunft: legacy/modulare/apps/geometrie/logic.js.
import { init, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
