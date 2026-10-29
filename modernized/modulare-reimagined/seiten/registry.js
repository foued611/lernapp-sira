// Liste der Lern-Apps für die Startseite. Die Einträge stammen aus legacy/modulare/registry.js:18-66.
// Bewusst ohne Seitenzahl: die kommt aus dem Inhaltspaket jeder App (RULE-259). Ohne Farben: das Fach steht als Text.
import { assertAppId } from '../inhalte/index.js';
import { trackOf } from '../komponenten/tracks.js';

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
  Biologie: '#2E9E5B'
});

// Eine Kachel öffnet die App über ?app=<id> (siehe startseite.js). Die alten Pfade apps/<name>/index.html
// gibt es in diesem Neubau nicht mehr.
export const APPS = Object.freeze([
  { id: 'mathe', subject: 'Mathematik', title: 'Mathe-Werkstatt', desc: 'Vorzeichen, Terme, Gleichungen, Prozente, Zinsen, Dreisatz, Daten und Zufall. Mit Waage, Zahlenstrahl und Kacheln erklärt.', status: LIVE },
  { id: 'geometrie', subject: 'Mathematik', title: 'Geometrie-Werkstatt', desc: 'Mittelsenkrechte, Winkelhalbierende, Dreiecke konstruieren, Winkel, Thales, Umkreis und Inkreis.', status: LIVE },
  { id: 'englisch', subject: 'Englisch', title: 'Englisch-Werkstatt', desc: 'Simple Past, Present Perfect, Konditionalsätze, Relativsätze, Passiv und indirekte Rede. Nach den Units von Access 3.', status: LIVE },
  { id: 'decouvertes-2', subject: 'Französisch', title: 'Französisch-Werkstatt', desc: 'Découvertes 2: Passé composé, Pronomen, vouloir, pouvoir und Verben auf -ir. Dazu das Cahier de Verbes (être, avoir, aller, faire, Présent) und die Zahlen auf Französisch.', status: LIVE },
  { id: 'info-zahlen', subject: 'Informatik', title: 'Zahlenwerkstatt', desc: 'Binär und Hexadezimal: Lampen schalten, umrechnen und addieren wie ein Computer.', status: LIVE },
  { id: 'deutsch', subject: 'Deutsch', title: 'Deutsch-Werkstatt', desc: 'Inhaltsangabe, Adverbialsätze, Kommas, das und dass, Passiv, sprachliche Bilder, Rechtschreibung und Lesen.', status: LIVE },
  { id: 'physik', subject: 'Physik', title: 'Physik-Werkstatt', desc: 'Schall, Licht und Mechanik nach dem Bildungsplan Klasse 7/8: Schwingungen, Frequenz, Spiegel, Brechung, Geschwindigkeit und Kräfte.', status: LIVE },
  { id: 'geographie', subject: 'Geographie', title: 'Geographie-Werkstatt', desc: 'Erdoberfläche, Klima und Vegetation, Tropen, Klimawandel, Polarzone, Bevölkerung, Entwicklungsstand und Welthandel. Nach den Kapiteln 1 bis 8 von Unsere Erde.', status: LIVE },
  { id: 'biologie', subject: 'Biologie', title: 'Biologie-Werkstatt', desc: 'Zelle, Fotosynthese, Zellatmung, Ernährung und Verdauung, Lunge, Blut und Kreislauf, Fortpflanzung. Nach den Kapiteln 1 bis 3 von Biosphäre 7/8.', status: LIVE }
]);

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
