// Macht aus den Aufgaben in content/deutsch/data.json Fragen im Quiz-Format (siehe runde/src/questions.js).
// Herkunft: legacy/modulare/apps/deutsch/builders.js. Die Reihenfolge der Zufallsaufrufe ist dieselbe wie dort,
// damit gleicher Seed in Legacy und Neubau dieselben Fragen ergibt (Dual-Execution, analysis/modulare).
//
// Eine Aufgabe: { q, s?, kind?, a, wrong[], why, label?, accept? }
//   q       Frage oder Anweisung (reiner Text)
//   s       optional: ein Beispielsatz, der unter der Frage steht
//   kind    'gap' = Lückensatz. In s steht ___ als Lücke. Dann sind Auswahl und Eintippen möglich
//   a       richtige Antwort, wrong: falsche Antworten (bei 'gap' genügt eine)
//   accept  optional: weitere richtige Eingaben beim Eintippen
//
// Zufall kommt immer als rng herein (AGENTS.md: Zufall nur testbar). Ohne rng gibt es keinen Erzeuger.
import { choiceQuestion, typedQuestion, option, esc, normalise } from '../../runde/index.js';
import { pick, shuffle, trackOf } from '../../helfer/index.js';

let UNITS = [];
let ITEMS = {};
let TRACKS = {};
const OWNER = new WeakMap(); // Aufgabe -> Seite, damit Fragen ihren Strang kennen

/** Bekommt Seitenliste und Aufgaben, bevor die erste Runde entsteht. */
export function init({ data, manifest }) {
  UNITS = manifest.units;
  ITEMS = data.items;
  TRACKS = manifest.tracks || {};
  manifest.units.forEach((u) => (ITEMS[u.id] || []).forEach((it) => OWNER.set(it, u)));
}

const isGap = (item) => item.kind === 'gap';
const gapText = (s) => s.split('___').map(esc).join('{{blank}}');
// Das richtige Wort fett in der Lücke. Nur <b> ist im Inhaltsmarkup erlaubt (SEC-003).
const filled = (s, word) => s.split('___').map(esc).join(`<b>${esc(word)}</b>`);
const chipFor = (item) => trackOf(TRACKS, OWNER.get(item)) || null;

/** Auswahlfrage. Lückensätze zeigen alle falschen Antworten, sonst höchstens drei (RULE-223). */
export function choice(item, rng) {
  const label = item.label || (isGap(item) ? 'Lücke füllen' : 'Wähle die richtige Antwort');
  if (isGap(item)) {
    const choices = [item.a, ...item.wrong].map((w) => option(w, esc(w), w));
    return choiceQuestion({
      label, chip: chipFor(item), prompt: gapText(item.s), sub: item.q, answer: item.a, choices,
      reveal: filled(item.s, item.a), why: item.why, rng
    });
  }
  return choiceQuestion({
    label, chip: chipFor(item), prompt: esc(item.q) + (item.s ? `<br><em>${esc(item.s)}</em>` : ''), answer: item.a,
    choices: [item.a, ...shuffle(item.wrong, rng).slice(0, 3)], why: item.why, rng,
    optionsLayout: item.a.length > 40 ? 'list' : undefined
  });
}

/** Eingabefrage. Gilt nur, was nach norm() gleich ist (Akzente und Groß/Klein zählen wie in Legacy). */
export function typed(item) {
  const accepted = [item.a, ...(item.accept || [])].map(normalise);
  return typedQuestion({
    label: 'Schreibe das Wort', chip: chipFor(item), prompt: gapText(item.s), sub: item.q, answer: item.a,
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
