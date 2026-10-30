// Macht aus den Aufgaben in content/physik/data.json Fragen im Quiz-Format (siehe runde/src/questions.js).
// Herkunft: Eigene App (Neubau)/builders.js. Zufall kommt immer als rng herein (AGENTS.md), ohne rng gibt es keine Aufgabe.
//
// Eine Aufgabe: { q, s?, kind?, a, wrong[], why, label?, accept? }
//   q       Frage oder Anweisung (reiner Text)
//   s       optional: ein Satz, der unter der Frage steht
//   kind    'gap' = Lückensatz. In s steht ___ als Lücke. Dann sind Auswahl und Eintippen möglich
//   a       richtige Antwort, wrong: falsche Antworten (bei 'gap' genügt eine, sonst mindestens drei)
//   accept  optional: weitere richtige Eingaben beim Eintippen
import { choiceQuestion, typedQuestion, option, esc, normalise } from '../../runde/index.js';
import { pick, shuffle } from '../../helfer/index.js';

let UNITS = [];
let ITEMS = {};

/** Bekommt Seitenliste und Aufgaben, bevor die erste Runde entsteht. */
export function init({ data, manifest }) {
  UNITS = manifest.units;
  ITEMS = data.items;
}

const isGap = (item) => item.kind === 'gap';
const gapText = (s) => s.split('___').map(esc).join('{{blank}}');
// Das richtige Wort fett in der Lücke. Nur <b> ist im Inhaltsmarkup erlaubt (SEC-003).
const filled = (s, word) => s.split('___').map(esc).join(`<b>${esc(word)}</b>`);

/** Auswahlfrage. Lückensätze zeigen alle falschen Antworten, sonst höchstens drei (RULE-223). */
export function choice(item, rng) {
  const label = item.label || (isGap(item) ? 'Lücke füllen' : 'Wähle die richtige Antwort');
  if (isGap(item)) {
    const choices = [item.a, ...item.wrong].map((w) => option(w, esc(w), w));
    return choiceQuestion({
      label, prompt: gapText(item.s), sub: item.q, answer: item.a, choices,
      reveal: filled(item.s, item.a), why: item.why, rng
    });
  }
  return choiceQuestion({
    label, prompt: esc(item.q) + (item.s ? `<br><em>${esc(item.s)}</em>` : ''), answer: item.a,
    choices: [item.a, ...shuffle(item.wrong, rng).slice(0, 3)], why: item.why, rng,
    optionsLayout: item.a.length > 40 ? 'list' : undefined
  });
}

/** Eingabefrage. Gilt nur, was nach normalise() gleich ist (Groß/Klein und Leerzeichen zählen nicht). */
export function typed(item) {
  const accepted = [item.a, ...(item.accept || [])].map(normalise);
  return typedQuestion({
    label: 'Schreibe das fehlende Wort', prompt: gapText(item.s), sub: item.q, answer: item.a,
    check: (input) => (accepted.includes(normalise(input)) ? 'ok' : 'bad'), placeholder: 'Wort eintippen',
    reveal: filled(item.s, item.a), why: item.why
  });
}

const pickItems = (unitId, count, rng) => {
  const pool = shuffle(ITEMS[unitId], rng);
  return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
};

/** 8 Fragen einer Seite, jede dritte Lücke zum Eintippen. */
export function lessonRound(unit, rng) {
  return pickItems(unit.id, 8, rng).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));
}

const anyItem = (rng) => pick(ITEMS[pick(UNITS, rng).id], rng);
export const quickRound = (rng) => Array.from({ length: 5 }, () => choice(anyItem(rng), rng));
export const blitzQuestion = (rng) => choice(anyItem(rng), rng);
export const bossRound = (rng) => Array.from({ length: 12 }, (_, i) => {
  const item = pick(ITEMS[UNITS[i % UNITS.length].id], rng);
  return i % 4 === 3 && isGap(item) ? typed(item) : choice(item, rng);
});
