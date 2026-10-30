// Vielfalt in Übungen: dieselbe Aufgabe (gleicher Text, gleiche Antwort) kommt in einer Runde und im Blitz nicht zweimal.
// Der Schlüssel zählt Text und Antwort, nicht die Reihenfolge der Optionen. Zufall nur über rng.
import { pick } from '../../helfer/index.js';
import { esc } from './text.js';

const plain = (html = '') => String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Schlüssel einer Frage: Art, Titel, Fragetext ohne Markup, richtige Antwort, bei Zuordnungen die Werte links. */
// Nicht ändern: gespeicherte seen-Schlüssel hängen daran, eine Änderung bräuchte eine Migration.
export const questionKey = (q) => [q.kind, q.label, plain(q.prompt), q.answer ?? '', (q.leftValues || []).join('|')].join('\u0001');

/**
 * Schlüssel einer Aufgabe über ihre Fassungen (Auswahl, Eingabe, ganzer Satz): Text mit eingesetzter Antwort, dazu die Antwort.
 * Stehen zwei Fassungen in einer Runde, verrät die Auswahl die getippte Antwort. Die Satz-Fassung hat keinen Fragetext,
 * ihren Satz trägt reveal. Zuordnungen haben nur eine Fassung.
 */
export const taskKey = (q) => {
  if (q.kind === 'match') return questionKey(q);
  const text = q.prompt ? plain(q.prompt).replaceAll('{{blank}}', esc(q.answer)) : plain(q.reveal);
  return [text, q.answer].join('\u0001');
};

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

/**
 * Element für Platz i von count: Die Liste wird in count Abschnitte geteilt, jeder Platz zieht zufällig aus seinem.
 * So deckt eine kurze Runde die ganze Liste ab, und über mehrere Runden kommt jedes Element dran.
 */
export function spreadPick(list, i, count, rng) {
  const start = Math.floor((i * list.length) / count);
  const end = Math.max(start + 1, Math.floor(((i + 1) * list.length) / count));
  return pick(list.slice(start, end), rng);
}

/** Fragen ohne Dubletten, die erste bleibt. Mit keyOf = taskKey zählen die Fassungen einer Aufgabe als Dublette. */
export function uniqueQuestions(questions, keyOf = questionKey) {
  const seen = new Set();
  return questions.filter((q) => {
    const key = keyOf(q);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Zieht count Fragen aus den Erzeugern (jeder ist eine Funktion rng => Frage), ohne Dubletten. */
export const distinctQuestions = (makers, count, rng, maxTries = 40) => distinctSlots(count, rng, () => pick(makers, rng)(rng), maxTries);

/**
 * Die Aufgabenquelle für eine Runde, die Aufgaben bevorzugt, die noch nicht richtig beantwortet wurden.
 * generate() liefert eine Runde (Liste von Fragen). known ist die Menge der Schlüssel, die schon richtig waren.
 * Es werden so lange Runden gezogen, bis genug neue Fragen da sind. Reichen die neuen nicht, kommen die bekannten
 * dazu (der Wertebereich ist erschöpft). Der Pool hat mindestens size Fragen, createRound zieht daraus.
 * Je Aufgabe bleibt eine Fassung. Eine neue schlägt eine bekannte: Wer die Auswahl konnte, darf jetzt tippen.
 */
export function freshPool(generate, size, known = new Set(), tries = 30) {
  const fresh = new Map();
  const stale = new Map();
  for (let t = 0; t < tries && fresh.size < size; t++) {
    for (const q of generate()) {
      const task = taskKey(q);
      if (fresh.has(task)) continue;
      if (known.has(questionKey(q))) {
        if (!stale.has(task)) stale.set(task, q);
      } else {
        stale.delete(task);
        fresh.set(task, q);
      }
    }
  }
  const pool = [...fresh.values()];
  return pool.length >= size ? pool : [...pool, ...[...stale.values()].slice(0, size - pool.length)];
}
