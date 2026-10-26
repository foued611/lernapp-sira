// Vorlage für Aufgaben-Erzeuger (Herkunft: legacy/modulare/apps/_template/builders.js). Kopieren, dann anpassen.
// Der Lernstoff steht in content/vorlage/data.json und kommt über init() hierher. Zufall kommt als rng herein.
import { choiceQuestion, typedQuestion, esc, normalise } from '../../runde/index.js';
import { pick, shuffle } from '../../helfer/index.js';

let UNITS = [];
let ITEMS = {};

/** Bekommt Seitenliste und Aufgabendaten, bevor die erste Runde entsteht. */
export function init({ data, manifest }) {
  UNITS = manifest.units;
  ITEMS = data.items;
}

// Auswahl: die richtige Antwort und höchstens drei falsche (RULE-223).
function choice(item, rng) {
  return choiceQuestion({
    label: 'Wähle die richtige Antwort', prompt: esc(item.q), answer: item.a,
    choices: [item.a, ...shuffle(item.wrong, rng).slice(0, 3)], why: item.explain, rng
  });
}

// Eingabe: nur die gespeicherte Antwort gilt, nach normalise() verglichen.
function typed(item) {
  const answer = normalise(item.a);
  return typedQuestion({
    label: 'Schreibe die Antwort', prompt: esc(item.q), answer: item.a, placeholder: 'Antwort eintippen', why: item.explain,
    check: (input) => (normalise(input) === answer ? 'ok' : 'bad')
  });
}

/** Eine Runde für eine Seite: 8 Fragen, abwechselnd Auswahl und Eingabe. */
export function lessonRound(unit, rng) {
  const pool = shuffle(ITEMS[unit.id], rng);
  return Array.from({ length: 8 }, (_, i) => {
    const item = pool[i % pool.length];
    return i % 3 === 2 ? typed(item) : choice(item, rng);
  });
}

const anyItem = (rng) => pick(ITEMS[pick(UNITS, rng).id], rng);
export const quickRound = (rng) => Array.from({ length: 5 }, () => choice(anyItem(rng), rng));
export const blitzQuestion = (rng) => choice(anyItem(rng), rng);
