// Logik der Musik-Werkstatt. Fragen, Lektionen, Trophäen und Seiten liegen in content/musik/, die Klangbeispiele in data.klang.
// Vorlage: apps/englisch/logic.js. Die Theorieseite (theory.js) zeigt zusätzlich die Klangbeispiele.
import { init as initItems, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import * as diagrams from './diagrams.js';
import { initKlang } from './klang.js';
import { Theory } from './theory.js';

/** Aufgaben und Klangbeispiele bekommen dasselbe Paket, bevor die erste Seite entsteht. */
function init(paket) {
  initItems(paket);
  initKlang(paket.data);
}

export default { init, diagrams, Theory, rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound }, blitz: blitzQuestion };
