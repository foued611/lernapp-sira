// Etiketten der Lernstränge. Welcher Strang gilt, sagt trackOf (helfer/tracks.js).
import { createElement } from 'react';

const h = createElement;

/** Kleines Etikett, z. B. "LRS-Förderung". Der Text ist sichtbar, die Farbe ist nur Zusatz. */
export function TrackLabel({ track }) {
  if (!track) return null;
  return h('span', { className: `trk trk-${track.id}`, title: track.desc || undefined }, track.label);
}

/**
 * Kleines Info-Feld über der Frage. Ein Verbchip (chip.verb = { inf, de }) sieht aus wie legacy .vchip
 * ("Verb: être · sein"), alles andere ist ein Lernstrang-Etikett.
 */
export function QuestionChip({ chip }) {
  if (!chip) return null;
  if (chip.verb) {
    return h('span', { className: 'vchip' }, 'Verb: ', h('b', null, chip.verb.inf), ` · ${chip.verb.de}`);
  }
  return h(TrackLabel, { track: chip });
}
