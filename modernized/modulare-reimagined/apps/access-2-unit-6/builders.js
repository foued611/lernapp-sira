// Macht aus den Aufgaben in content/access-2-unit-6/data.json Fragen im Quiz-Format (siehe runde/src/questions.js).
// Vorlage: apps/englisch/builders.js. Zufall kommt immer als rng herein (AGENTS.md), ohne rng gibt es keine Aufgabe.
//
// Eine Aufgabe: { q, s?, kind?, a, wrong[], why, label?, accept?, w? }
//   w       Nummer des Worts in der Wortliste. Zu jedem Wort gibt es drei Aufgaben (Lücke, Englisch zu Deutsch, Deutsch zu Englisch).
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
    label: 'Schreibe das Wort', prompt: gapText(item.s), sub: item.q, answer: item.a,
    check: (input) => (accepted.includes(normalise(input)) ? 'ok' : 'bad'), placeholder: 'Wort eintippen',
    reveal: filled(item.s, item.a), why: item.why
  });
}

// Aufgaben einer Seite, nach Wort gruppiert. So fragt eine Runde jedes Wort höchstens einmal ab.
const byWord = (unitId) => {
  const groups = new Map();
  for (const item of ITEMS[unitId]) {
    const key = item.w ?? item.q;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()];
};

// Eine Aufgabe aus der Gruppe eines Worts. Auf Wunsch eine Lückenaufgabe, damit die Schreibweise geübt wird.
const itemOf = (group, wantGap, rng) => {
  const gaps = group.filter(isGap);
  return wantGap && gaps.length ? gaps[0] : pick(group, rng);
};

/** Die 8 Aufgaben einer Runde: 8 verschiedene Wörter der Seite, an jedem dritten Platz ein Wort mit Lücke (Schreibübung). */
export function lessonPicks(unit, rng) {
  const pool = shuffle(byWord(unit.id), rng);
  return Array.from({ length: 8 }, (_, i) => {
    const wantGap = i % 3 === 2;
    const at = wantGap ? Math.max(0, pool.findIndex((group) => group.some(isGap))) : 0;
    return itemOf(pool.splice(at, 1)[0], wantGap, rng);
  });
}

/** 8 Fragen einer Seite zu 8 verschiedenen Wörtern, jede dritte zum Eintippen (wenn das Wort eine Lücke hat). */
export function lessonRound(unit, rng) {
  return lessonPicks(unit, rng).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));
}

const anyItem = (rng) => pick(ITEMS[pick(UNITS, rng).id], rng);
export const quickRound = (rng) => Array.from({ length: 5 }, () => choice(anyItem(rng), rng));
export const blitzQuestion = (rng) => choice(anyItem(rng), rng);
// Endgegner: 12 Fragen aus 12 verschiedenen Seiten, jede vierte zum Eintippen. Eine Stichprobe, kein vollständiger Test.
export const bossRound = (rng) => shuffle(UNITS, rng).slice(0, 12).map((unit, i) => {
  const wantGap = i % 4 === 3;
  const groups = byWord(unit.id);
  const usable = wantGap ? groups.filter((group) => group.some(isGap)) : groups;
  const item = itemOf(pick(usable, rng), wantGap, rng);
  return wantGap && isGap(item) ? typed(item) : choice(item, rng);
});
