// Logik der Französisch-Werkstatt (Découvertes 2 und Cahier de Verbes). Fragen, Lektionen, Trophäen und Seiten
// liegen in content/decouvertes-2/. Eigene App (Neubau)/logic.js.
import { init as initItems, lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import { init as initVerben } from './verben/model.js';
import * as itemDiagrams from './diagrams.js';
import { personDiagram, endingsDiagram } from './verben/diagrams.js';
import { Theory } from './theory.js';

/** Beide Bücher bekommen dieselben Daten. Das Verbmodell übernimmt nur die Seiten mit verbs. */
function init(paket) {
  initItems(paket);
  initVerben(paket);
}

export default {
  init,
  diagrams: { ...itemDiagrams, personDiagram, endingsDiagram },
  Theory,
  rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound },
  blitz: blitzQuestion
};
