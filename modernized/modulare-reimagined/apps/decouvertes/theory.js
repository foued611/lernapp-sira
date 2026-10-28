// Theorie der Französisch-Werkstatt. Weiche je Seite: Verbseiten (verbs) mit Konjugationstabelle,
// Zahlen-Seiten (hoeren) mit Hör-Tabelle, alle anderen mit der Standardseite und ihren Diagrammen.
import { createElement } from 'react';
import { TheoryPage } from '../../komponenten/theory.js';
import * as diagrams from './diagrams.js';
import { Theory as VerbTheory } from './verben/theory.js';
import { ZahlenTheory } from './zahlen/theory.js';

const h = createElement;

export function Theory(props) {
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
}
