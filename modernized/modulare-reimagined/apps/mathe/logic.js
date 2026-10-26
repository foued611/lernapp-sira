// Logik der Mathe-Werkstatt: Aufgaben-Erzeuger und Diagramme. Alle Inhalte (Seiten, Lektionen, Trophäen, Daten)
// liegen in content/mathe/. Herkunft: legacy/modulare/apps/mathe/logic.js. Die App hat keine eigene Theorie und
// keine eigene Endgegner-Freischaltung; es gilt der Standard aus seiten/rahmen.js (bossOpen).
import { init, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';

export default { init, diagrams, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
