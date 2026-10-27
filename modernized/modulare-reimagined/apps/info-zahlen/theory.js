// Theorieseite der Zahlenwerkstatt (Herkunft: legacy/modulare/apps/informatik/theory.js, renderTheory).
// Kopf mit Titel, Lektion mit Spielzeug, Merkzettel und Übungsknopf. Lektion und Merkzettel kommen aus config
// (content/info-zahlen). Das Spielzeug sitzt zwischen Bild und Schritt für Schritt, wie in Legacy.
import { createElement } from 'react';
import { Lesson } from '../../komponenten/lesson.js';
import { Notes } from '../../komponenten/theory.js';
import { TrackLabel, trackOf } from '../../komponenten/tracks.js';
import { Button } from '../../komponenten/ui.js';
import * as diagrams from './diagrams.js';
import { TOYS } from './spielzeuge.js';

const h = createElement;

/**
 * @param {{ unit: object, config: object, onStart: () => void }} props
 * config.lessons[unit.id] ist die Lektion, config.notes[unit.id] der Merkzettel, config.tracks die Lernstränge.
 */
export function Theory({ unit, config, onStart }) {
  const Toy = TOYS[unit.id];
  const track = trackOf(config.tracks, unit);
  return h(
    'div',
    { className: 'theory-stack zw-theory' },
    h(
      'section',
      { className: 'card tcard' },
      h(
        'div',
        { className: 'thead' },
        h('h1', null, unit.title),
        h('span', { className: 'de' }, unit.de || ''),
        h(TrackLabel, { track })
      )
    ),
    h(Lesson, {
      lesson: config.lessons ? config.lessons[unit.id] : undefined,
      unitId: unit.id,
      diagrams,
      toy: Toy ? h(Toy, { accent: unit.color }) : null
    }),
    h(Notes, { notes: config.notes ? config.notes[unit.id] : undefined }),
    h('div', null, h(Button, { onClick: () => onStart() }, 'Übung starten · 8 Aufgaben'))
  );
}
