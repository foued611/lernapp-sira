// Macht aus den Aufgaben in content/deutsch/data.json Fragen im Quiz-Format (siehe core/js/quiz.js).
//
// Eine Aufgabe: { q, s?, kind?, a, wrong[], why, label?, accept? }
//   q       Frage oder Anweisung (reiner Text)
//   s       optional: ein Beispielsatz, der unter der Frage steht
//   kind    'gap' = Lückensatz. In s steht ___ als Lücke. Dann sind Auswahl und Eintippen möglich
//   a       richtige Antwort, wrong: falsche Antworten (bei 'gap' genügt eine)
//   accept  optional: weitere richtige Eingaben beim Eintippen
import { esc, shuffle, pick, norm } from '../../core/js/ui.js';
import { trackOf, trackBadge } from '../../core/js/tracks.js';
import { choiceQuestion, typedQuestion, option } from '../../core/js/questions.js';

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
const filled = (s, word) => s.split('___').map(esc).join(`<span class="mk">${esc(word)}</span>`);

/** Etikett des Strangs (z. B. LRS-Förderung) über der Frage, leer im Standardprogramm. */
const chipFor = (item) => trackBadge(trackOf(TRACKS, OWNER.get(item)));

export function choice(item) {
  const label = item.label || (isGap(item) ? 'Lücke füllen' : 'Wähle die richtige Antwort');
  if (isGap(item)) {
    const options = shuffle([item.a, ...item.wrong]).map((w) => option(w, esc(w), w));
    return { kind: 'choice', label, chip: chipFor(item), prompt: gapText(item.s), sub: item.q, answer: item.a, options, reveal: filled(item.s, item.a), why: item.why };
  }
  return choiceQuestion({
    label, chip: chipFor(item), prompt: esc(item.q) + (item.s ? `<br><em>${esc(item.s)}</em>` : ''), answer: item.a,
    choices: [item.a, ...shuffle(item.wrong).slice(0, 3)], why: item.why, optionsLayout: item.a.length > 40 ? 'list' : undefined
  });
}

export function typed(item) {
  const accepted = [item.a, ...(item.accept || [])].map(norm);
  return typedQuestion({
    label: 'Schreibe das Wort', chip: chipFor(item), prompt: gapText(item.s), sub: item.q, answer: item.a,
    check: (input) => (accepted.includes(norm(input)) ? 'ok' : 'bad'), placeholder: 'Wort eintippen',
    reveal: filled(item.s, item.a), why: item.why
  });
}

const pickItems = (unitId, count) => {
  const pool = shuffle(ITEMS[unitId]);
  return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
};

/** 8 Fragen einer Seite, jede dritte Lücke zum Eintippen. */
export function lessonRound(unit) {
  return pickItems(unit.id, 8).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item)));
}

const anyItem = () => pick(ITEMS[pick(UNITS).id]);
export const quickRound = () => Array.from({ length: 5 }, () => choice(anyItem()));
export const blitzQuestion = () => choice(anyItem());
export const bossRound = () => Array.from({ length: 12 }, (_, i) => {
  const item = pick(ITEMS[UNITS[i % UNITS.length].id]);
  return i % 4 === 3 && isGap(item) ? typed(item) : choice(item);
});
