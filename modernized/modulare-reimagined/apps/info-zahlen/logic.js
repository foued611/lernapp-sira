// Logik der Zahlenwerkstatt: Aufgaben, Diagramme und die Theorie mit Spielzeugen. Inhalte liegen in content/info-zahlen/.
// Herkunft: legacy/modulare/apps/informatik/logic.js.
import { init, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';
import { Theory } from './theory.js';

export default {
  init,
  diagrams,
  Theory,
  rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound },
  blitz: blitzQuestion
};
