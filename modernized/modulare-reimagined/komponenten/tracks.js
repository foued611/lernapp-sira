// Lernstränge (legacy/modulare/core/js/tracks.js:5-9). Ein Etikett erscheint nur bei Seiten,
// die einem definierten Strang angehören (RULE-258). Alles andere bleibt ohne Etikett.
import { createElement } from 'react';

const h = createElement;

/**
 * Der Strang einer Seite oder Ressource, oder null (= Standardprogramm).
 * Object.hasOwn statt tracks[key]: sonst würde ein Schlüssel wie "constructor" einen Prototyp-Wert liefern.
 * id steht zuletzt, damit ein Eintrag im Manifest sie nicht überschreiben kann.
 */
export function trackOf(tracks, item) {
  const key = item && item.track;
  if (typeof key !== 'string' || !tracks || !Object.hasOwn(tracks, key)) return null;
  return { ...tracks[key], id: key };
}

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
