// Theorieseite einer Zahlen-Seite: Kopf, Lektion, Hör-Tabelle, Merkzettel, Übungsknopf.
// Die Hör-Tabelle kommt aus dem Inhalt (Feld hoeren der Seite im Manifest): Ziffern und französisches Wort je Zeile.
// Zuerst hören und lesen, dann selbst schreiben. So sitzt die Aussprache, bevor die Schreibweise geprüft wird.
import { createElement } from 'react';
import { Lesson } from '../../../komponenten/lesson.js';
import { Notes } from '../../../komponenten/theory.js';
import { TrackLabel, trackOf } from '../../../komponenten/tracks.js';
import { Button } from '../../../komponenten/ui.js';
import { SpeakButton } from '../sprache.js';
import * as diagrams from '../diagrams.js';

const h = createElement;

/** Tabelle mit Ziffern, Wort und Vorlesen. Ohne Eintrag im Manifest fehlt sie ganz. */
function Hoeren({ rows }) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return h(
    'section',
    { className: 'card' },
    h('h3', { className: 'ex-title' }, 'Hör zu und sprich nach'),
    h(
      'table',
      { className: 'conj', 'aria-label': 'Zahlen mit Aussprache' },
      h('tbody', null, ...rows.map(([digits, word]) => h(
        'tr',
        { key: digits },
        h('th', { scope: 'row', className: 'pr' }, digits),
        h('td', { className: 'fm' }, h('span', { className: 'val' }, word)),
        h('td', { className: 'sp' }, h(SpeakButton, { text: word }))
      )))
    )
  );
}

/** Zahlen-Seite. Props nach App-Vertrag: unit, config (Lektionen, Merkzettel, Lernstränge), onStart(). */
export function ZahlenTheory({ unit, config, onStart }) {
  const track = trackOf(config.tracks, unit);
  return h(
    'div',
    { className: 'theory-stack' },
    h(
      'section',
      { className: 'card tcard' },
      h('div', { className: 'thead' }, h('h1', null, unit.title), h('span', { className: 'de' }, unit.de || ''), h(TrackLabel, { track }))
    ),
    h(Lesson, { lesson: (config.lessons || {})[unit.id], unitId: unit.id, diagrams }),
    h(Hoeren, { rows: unit.hoeren }),
    h(Notes, { notes: (config.notes || {})[unit.id] }),
    h('div', null, h(Button, { onClick: () => { if (typeof onStart === 'function') onStart(); } }, 'Übung starten · 8 Aufgaben'))
  );
}
