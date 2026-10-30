// Theorie der Französisch-Werkstatt. Weiche je Seite: Verbseiten (verbs) mit Konjugationstabelle,
// Zahlen-Seiten (hoeren) mit Hör-Tabelle, alle anderen mit der Standardseite und ihren Diagrammen.
import { createElement } from 'react';
import { TheoryPage } from '../../komponenten/theory.js';
import * as diagrams from './diagrams.js';
import { createVerbTheory } from './verben/theory.js';
import { ZahlenTheory } from './zahlen/theory.js';

const h = createElement;

/** Theorieseite der App. Verbseiten brauchen das Modell des Inhaltspakets, deshalb entsteht sie je Paket. */
export function createTheory(model, verbs, verbDiagrams) {
  const { Theory: VerbTheory } = createVerbTheory(model, verbs, verbDiagrams);
  return function Theory(props) {
    const { unit, config, onStart } = props;
    if (unit.verbs) return h(VerbTheory, props);
    if (unit.hoeren) return h(ZahlenTheory, props);
    return h(TheoryPage, {
      unit,
      lesson: config.lessons[unit.id],
      notes: config.notes[unit.id],
      tracks: config.tracks,
      diagrams,
      onStart: () => onStart()
    });
  };
}
