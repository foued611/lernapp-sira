// Theorieseite der Python-Werkstatt: Kopf, Lektion mit dem Code-Labor, Merkzettel und Übungsknopf.
// Aufbau wie apps/info-zahlen/theory.js. Das Labor ersetzt das Spielzeug und liest Missionen aus config.data.
import { createElement } from 'react';
import { Lesson } from '../../komponenten/lesson.js';
import { Notes } from '../../komponenten/theory.js';
import { trackOf } from '../../helfer/index.js';
import { TrackLabel } from '../../komponenten/tracks.js';
import { Button } from '../../komponenten/ui.js';
import * as diagrams from './diagrams.js';
import { Labor } from './labor.js';

const h = createElement;

/** @param {{ unit: object, config: object, onStart: () => void }} props */
export function Theory({ unit, config, onStart }) {
  const track = trackOf(config.tracks, unit);
  return h(
    'div',
    { className: 'theory-stack pw-theory' },
    h(
      'section',
      { className: 'card tcard' },
      h('div', { className: 'thead' }, h('h1', null, unit.title), h('span', { className: 'de' }, unit.de || ''), h(TrackLabel, { track }))
    ),
    h(Lesson, {
      lesson: config.lessons ? config.lessons[unit.id] : undefined,
      unitId: unit.id,
      diagrams,
      toy: h(Labor, { unit, accent: unit.color, data: config.data })
    }),
    h(Notes, { notes: config.notes ? config.notes[unit.id] : undefined }),
    h('div', null, h(Button, { onClick: () => onStart() }, 'Übung starten · 8 Aufgaben'))
  );
}
