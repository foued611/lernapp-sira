// Vielfalt in Übungen: dieselbe Aufgabe (gleicher Text, gleiche Antwort) kommt in einer Runde und im Blitz nicht zweimal.
// Der Schlüssel zählt Text und Antwort, nicht die Reihenfolge der Optionen. Zufall nur über rng.
import { pick } from '../../helfer/index.js';

const plain = (html = '') => String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Schlüssel einer Frage: Art, Titel, Fragetext ohne Markup, richtige Antwort, bei Zuordnungen die Werte links. */
export const questionKey = (q) => [q.kind, q.label, plain(q.prompt), q.answer ?? '', (q.leftValues || []).join('|')].join('\u0001');

/**
 * Baut count Fragen Platz für Platz. makeAt(i, rng) liefert die Frage für Platz i. Ein Platz wird neu gewürfelt,
 * solange er eine schon gezeigte Frage liefert. Nach maxTries (Wertebereich erschöpft) bleibt die letzte Kandidatin,
 * damit die Runde trotzdem voll wird.
 */
export function distinctSlots(count, rng, makeAt, maxTries = 40) {
  const seen = new Set();
  const out = [];
  for (let i = 0; i < count; i++) {
    let q = null;
    for (let t = 0; t < maxTries; t++) {
      q = makeAt(i, rng);
      const key = questionKey(q);
      if (!seen.has(key)) {
        seen.add(key);
        break;
      }
    }
    out.push(q);
  }
  return out;
}

/** Zieht count Fragen aus den Erzeugern (jeder ist eine Funktion rng => Frage), ohne Dubletten. */
export const distinctQuestions = (makers, count, rng, maxTries = 40) => distinctSlots(count, rng, () => pick(makers, rng)(rng), maxTries);
