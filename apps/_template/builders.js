// Macht aus dem Lernstoff Fragen im Quiz-Format (Beschreibung: core/js/quiz.js).
import { esc, shuffle, pick } from '../../core/js/ui.js';
import { UNITS, ITEMS } from './data.js';

function choice(item) {
  const options = shuffle([item.a, ...item.wrong.slice(0, 3)]).map((v) => ({ id: v, html: esc(v) }));
  return {
    kind: 'choice',
    label: 'Wähle die richtige Antwort',
    prompt: esc(item.q),
    answer: item.a,
    options,
    why: item.explain
  };
}

function typed(item) {
  return {
    kind: 'type',
    label: 'Schreibe die Antwort',
    prompt: esc(item.q),
    answer: item.a,
   
    placeholder: 'Antwort eintippen',
    why: item.explain
  };
}

/** Eine Runde für eine Seite: 8 Fragen, abwechselnd Auswahl und Eingabe. */
export function lessonRound(unit) {
  const pool = shuffle(ITEMS[unit.id]);
  return Array.from({ length: 8 }, (_, i) => (i % 3 === 2 ? typed : choice)(pool[i % pool.length]));
}

const anyItem = () => pick(ITEMS[pick(UNITS).id]);

export const quickRound = () => Array.from({ length: 5 }, () => choice(anyItem()));
export const blitzQuestion = () => choice(anyItem());
