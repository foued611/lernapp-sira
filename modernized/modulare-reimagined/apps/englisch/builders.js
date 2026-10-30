// Macht aus den Aufgaben in content/englisch/data.json Fragen im Quiz-Format (siehe runde/src/questions.js).
// Herkunft: legacy apps/englisch/builders.js. Zufall kommt immer als rng herein (AGENTS.md), ohne rng gibt es keine Aufgabe.
//
// Eine Aufgabe: { q, s?, kind?, a, wrong[], why, label?, accept? }
//   q       Frage oder Anweisung (reiner Text)
//   s       optional: ein Satz, der unter der Frage steht
//   kind    'gap' = Lückensatz. In s steht ___ als Lücke. Dann sind Auswahl und Eintippen möglich
//   a       richtige Antwort, wrong: falsche Antworten (bei 'gap' genügt eine, sonst mindestens drei)
//   accept  optional: weitere richtige Eingaben beim Eintippen
//   w       nur bei den Vokabel-Seiten: Nummer des Worts. Zu jedem Wort gibt es drei Aufgaben, eine Runde fragt jedes Wort höchstens einmal.
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
    label: item.w === undefined ? 'Schreibe die Form' : 'Schreibe das Wort', prompt: gapText(item.s), sub: item.q, answer: item.a,
    check: (input) => (accepted.includes(normalise(input)) ? 'ok' : 'bad'), placeholder: 'Wort eintippen',
    reveal: filled(item.s, item.a), why: item.why
  });
}

const pickItems = (unitId, count, rng) => {
  const pool = shuffle(ITEMS[unitId], rng);
  return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
};

const isVocab = (unitId) => ITEMS[unitId].some((item) => item.w !== undefined);

// Aufgaben einer Vokabel-Seite, nach Wort gruppiert.
const byWord = (unitId) => {
  const groups = new Map();
  for (const item of ITEMS[unitId]) {
    if (!groups.has(item.w)) groups.set(item.w, []);
    groups.get(item.w).push(item);
  }
  return [...groups.values()];
};

// Eine Aufgabe aus der Gruppe eines Worts. Auf Wunsch eine Lückenaufgabe, damit die Schreibweise geübt wird.
const itemOf = (group, wantGap, rng) => {
  const gaps = group.filter(isGap);
  return wantGap && gaps.length ? gaps[0] : pick(group, rng);
};

/** Die 8 Aufgaben einer Vokabel-Runde: 8 verschiedene Wörter, an jedem dritten Platz ein Wort mit Lücke (Schreibübung). */
export function lessonPicks(unit, rng) {
  const pool = shuffle(byWord(unit.id), rng);
  return Array.from({ length: 8 }, (_, i) => {
    const wantGap = i % 3 === 2;
    const at = wantGap ? Math.max(0, pool.findIndex((group) => group.some(isGap))) : 0;
    return itemOf(pool.splice(at, 1)[0], wantGap, rng);
  });
}

/** 8 Fragen einer Seite, jede dritte Lücke zum Eintippen. Vokabel-Seiten fragen 8 verschiedene Wörter. */
export function lessonRound(unit, rng) {
  if (isVocab(unit.id)) return lessonPicks(unit, rng).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));
  return pickItems(unit.id, 8, rng).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));
}

const anyItem = (rng) => pick(ITEMS[pick(UNITS, rng).id], rng);
export const quickRound = (rng) => Array.from({ length: 5 }, () => choice(anyItem(rng), rng));
export const blitzQuestion = (rng) => choice(anyItem(rng), rng);
// Endgegner: 12 Fragen aus 12 verschiedenen, zufällig gewählten Seiten (Grammatik und Vokabeln), jede vierte zum Eintippen.
export const bossRound = (rng) => shuffle(UNITS, rng).slice(0, 12).map((unit, i) => {
  const wantGap = i % 4 === 3;
  let item;
  if (isVocab(unit.id)) {
    const groups = byWord(unit.id);
    item = itemOf(pick(wantGap ? groups.filter((group) => group.some(isGap)) : groups, rng), wantGap, rng);
  } else {
    item = pick(ITEMS[unit.id], rng);
  }
  return wantGap && isGap(item) ? typed(item) : choice(item, rng);
});
