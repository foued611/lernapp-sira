// Prüfung und Hilfen für den App-Katalog (content/katalog.json, aus den Manifesten gebaut). Eine Kachel öffnet die App über
// ?app=<id> (siehe startseite.js). Die Farben je Fach sind Darstellung und stehen deshalb hier, nicht im Inhalt.
import { assertAppId } from '../inhalte/index.js';
import { trackOf } from '../helfer/index.js';

export const LIVE = 'live';
export const SOON = 'soon';

// Farbe je Fach für Kacheln und Weiter-Karte. Werte wie in legacy/modulare/registry.js:9-16.
export const SUBJECT_COLORS = Object.freeze({
  Französisch: '#9B7BFF',
  Mathematik: '#4CC3F5',
  Deutsch: '#FF6B88',
  Englisch: '#3DD6B0',
  Informatik: '#FF9F43',
  Physik: '#8BD450',
  Geographie: '#E0A82E',
  Biologie: '#2E9E5B',
  Musik: '#C97B3A'
});

const isText = (value) => typeof value === 'string' && value.trim() !== '';

/** Fehler der Liste als Texte. Leer heißt gültig. Doppelte Kennungen fallen auf, sonst gäbe es zwei Kacheln mit einem Speicher. */
export function validateRegistry(entries) {
  if (!Array.isArray(entries)) return ['Die App-Liste ist keine Liste.'];
  const errors = [];
  const seen = new Set();
  entries.forEach((entry, index) => {
    const where = `App ${index}`;
    if (!entry || typeof entry !== 'object') {
      errors.push(`${where}: kein Objekt`);
      return;
    }
    try {
      assertAppId(entry.id);
    } catch (error) {
      errors.push(`${where}: ungültige Kennung`);
    }
    if (seen.has(entry.id)) errors.push(`${where}: Kennung doppelt (${entry.id})`);
    seen.add(entry.id);
    if (!isText(entry.title)) errors.push(`${where}: Titel fehlt`);
    if (!isText(entry.subject)) errors.push(`${where}: Fach fehlt`);
    if (entry.status !== LIVE && entry.status !== SOON) errors.push(`${where}: Status muss live oder soon sein`);
  });
  return errors;
}

/** Fächer in der Reihenfolge der Liste, ohne Dopplungen. Für die Auswahl auf der Startseite. */
export const subjectsOf = (entries) => [...new Set(entries.map((entry) => entry.subject))];

/** Strang einer Seite für das Etikett. Ohne Strang: null, also kein Etikett (RULE-258). */
export const unitTrack = (tracks, unit) => trackOf(tracks, unit);
