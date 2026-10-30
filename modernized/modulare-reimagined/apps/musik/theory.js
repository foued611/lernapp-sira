// Theorieseite der Musik-Werkstatt: wie die Standardseite, dazu nach dem Bild die Karte "Zum Anhören" mit den Klangbeispielen
// der Seite (content/musik/data.json, klang). Der Ton entsteht erst nach einem Tipp, nie von selbst.
import { createElement, useEffect, useRef, useState } from 'react';
import { trackOf } from '../../helfer/index.js';
import { Lesson } from '../../komponenten/lesson.js';
import { Notes } from '../../komponenten/theory.js';
import { TrackLabel } from '../../komponenten/tracks.js';
import { Button } from '../../komponenten/ui.js';
import * as diagrams from './diagrams.js';
import { klangOf } from './klang.js';
import { createPlayer } from './klang-audio.js';

const h = createElement;

/** Karte mit den Beispielen einer Seite. Ohne Beispiele wird nichts gezeichnet. */
export function KlangBox({ unitId, host = globalThis }) {
  const sounds = klangOf(unitId);
  const [playing, setPlaying] = useState(null);
  const [problem, setProblem] = useState(false);
  const player = useRef(null);

  // Beim Verlassen der Seite verstummt der Ton.
  useEffect(
    () => () => {
      if (player.current) player.current.stop();
    },
    []
  );

  if (sounds.length === 0) return null;

  const toggle = (sound) => {
    if (playing === sound.id && player.current) {
      player.current.stop();
      return;
    }
    if (!player.current) player.current = createPlayer(host);
    const ok = player.current.play(sound, () => setPlaying((current) => (current === sound.id ? null : current)));
    setProblem(!ok);
    if (ok) setPlaying(sound.id);
  };

  return h(
    'section',
    { className: 'card lsn lsn-klang' },
    h('h2', null, 'Zum Anhören'),
    h(
      'p',
      { className: 'muted' },
      'Die Klänge entstehen live im Browser, ohne Aufnahmen. Sie klingen nicht wie echte Instrumente, zeigen aber, worauf es ankommt. Mit Stopp kannst du jederzeit abbrechen.'
    ),
    h(
      'ul',
      { className: 'klang-list' },
      ...sounds.map((sound) => {
        const on = playing === sound.id;
        return h(
          'li',
          { key: sound.id },
          h('div', null, h('b', null, sound.label), h('p', { className: 'muted' }, sound.hint)),
          h(
            'button',
            {
              type: 'button',
              className: on ? 'chip on' : 'chip',
              'aria-pressed': on,
              'aria-label': `${on ? 'Stopp' : 'Anhören'}: ${sound.label}`,
              onClick: () => toggle(sound)
            },
            on ? 'Stopp' : 'Anhören'
          )
        );
      })
    ),
    problem ? h('p', { role: 'status', className: 'muted' }, 'Dein Browser kann hier keine Klänge abspielen.') : null
  );
}

/**
 * @param {{ unit: object, config: object, onStart: () => void }} props
 * config.lessons[unit.id] ist die Lektion, config.notes[unit.id] der Merkzettel, config.tracks die Lernstränge.
 */
export function Theory({ unit, config, onStart }) {
  const track = trackOf(config.tracks, unit);
  return h(
    'div',
    { className: 'theory-stack' },
    h(
      'section',
      { className: 'card tcard' },
      h('div', { className: 'thead' }, h('h1', null, unit.title), h('span', { className: 'de' }, unit.de || ''), h(TrackLabel, { track }))
    ),
    h(Lesson, {
      lesson: config.lessons ? config.lessons[unit.id] : undefined,
      unitId: unit.id,
      diagrams,
      toy: h(KlangBox, { unitId: unit.id })
    }),
    h(Notes, { notes: config.notes ? config.notes[unit.id] : undefined }),
    h('div', null, h(Button, { onClick: () => onStart() }, 'Übung starten'))
  );
}
