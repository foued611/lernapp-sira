// Logik der Französisch-Werkstatt (Découvertes 2 und Cahier de Verbes). Fragen, Lektionen, Trophäen und Seiten
// liegen in content/decouvertes-2/. Eigene App (Neubau)/logic.js.
import { logicOf } from '../../runde/index.js';
import { createBuilders } from './builders.js';
import { createVerbDiagrams } from './verben/diagrams.js';
import * as itemDiagrams from './diagrams.js';
import { createTheory } from './theory.js';

export default {
  create(paket) {
    const b = createBuilders(paket);
    const verbDiagrams = createVerbDiagrams(b.model);
    return {
      ...logicOf(b),
      diagrams: { ...itemDiagrams, ...verbDiagrams },
      Theory: createTheory(b.model, b.verbs, verbDiagrams)
    };
  }
};
