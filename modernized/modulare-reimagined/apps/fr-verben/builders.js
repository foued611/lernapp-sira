// Aus dem Lernstoff (content/fr-verben/, über model.js) werden Fragen im Fragenformat von runde/index.js.
// Herkunft: legacy/modulare/apps/franzoesisch-verben/builders.js. Die Reihenfolge der Zufallsaufrufe ist dieselbe
// wie dort, damit gleicher Seed in Legacy und Neubau dieselben Fragen ergibt (analysis/modulare/dual/fr-verben_dual.mjs).
// Zufall kommt nur als rng herein (AGENTS.md). rng steht immer als letzter Parameter.
import { choiceQuestion, typedQuestion, matchQuestion, option, esc, normalise, compareTyped } from '../../runde/index.js';
import { pick, shuffle } from '../../helfer/index.js';
import { V, UNITS, SP, TRAP, HINT, PRON, PQV } from './model.js';

const PERSONS = [0, 1, 2, 3, 4, 5];
const CHIP_ID = 'verb';

export const elides = (v) => /^[aeiouhéèêàâîôû]/i.test(v.forms[0]);
export const lab = (v, p) => (p === 0 ? (elides(v) ? "j'" : 'je') : PRON[p]);
const subjectFor = (v, p, rng) => (p === 0 ? (elides(v) ? "j'" : 'je ') : pick(PQV[p], rng) + ' ');

/** Erklärung zur Form, wird bei Fehlern angezeigt. */
export function hint(v, p) {
  if (HINT[v.key]) return HINT[v.key][p];
  const ending = v.ends[p];
  let text = `${v.inf}: Stamm „${v.stem}-“ plus ` + (ending ? `Endung „-${ending}“.` : 'keine Endung.');
  if (v.group === 'ir' && p >= 3) text += ' Bei -ir-Verben kommt im Plural -iss- dazu.';
  if (v.group === 're' && p === 2) text += ' Das d vom Stamm bleibt stehen.';
  if (v.group === 'er' && p !== 3 && p !== 4) text += ' Du hörst die Endung nicht, musst sie aber schreiben.';
  return text;
}

/** Falsche, aber plausible Antworten: typische Fehlformen zuerst, dann andere Formen desselben Verbs. */
export function distract(v, p, count, rng) {
  const answer = v.forms[p];
  const others = shuffle([...new Set(v.forms)].filter((f) => f !== answer), rng);
  const traps = (TRAP[v.key] && TRAP[v.key][p]) || [];
  return [...traps.slice(0, 1), ...others].filter((x, i, all) => all.indexOf(x) === i).slice(0, count);
}

// Verbetikett wie im Legacy-Chip "Verb: être · sein". Das Etikett nutzt die Strang-Darstellung des Rahmens (TrackLabel).
const chipOf = (v) => ({ id: CHIP_ID, label: `Verb: ${v.inf} · ${v.de}` });
// Spickzettel-Inhalt mit erlaubten Tags (richText kennt nur b, br ...): je Person ein Zeilenumbruch.
const helpOf = (v) => PERSONS.map((i) => `${esc(lab(v, i))} <b>${esc(v.forms[i])}</b>`).join('<br>');
const gap = (fr) => fr.split('___').map(esc).join('{{blank}}');
const filled = (fr, form) => fr.split('___').map(esc).join(`<b>${esc(form)}</b>`);
const optionFor = (form) => option(form, esc(form), form);

const stripPronoun = (s) => s.replace(/^(j'|je |tu |il |elle |on |nous |vous |ils |elles )/, '');

/**
 * Prüft getippte Formen. Pronomen davor sind erlaubt, ein fehlender Akzent zählt als "fast" (compareTyped).
 * Legacy: franzoesisch-verben/builders.js checkForm, Vergleich unverändert.
 */
export function checkForm(answer) {
  return (input) => compareTyped(stripPronoun(normalise(input)), answer);
}

/** Auswahl zu einer Form: richtige Form plus höchstens drei Ablenker, gemischt. */
export function choiceQ(it, rng) {
  const { v, p } = it, answer = v.forms[p];
  const choices = [answer, ...distract(v, p, 3, rng)].map(optionFor);
  return choiceQuestion({
    label: 'Lücke füllen', chip: chipOf(v), prompt: gap(it.fr), sub: it.de, answer, choices,
    reveal: filled(it.fr, answer), why: hint(v, p), help: helpOf(v), rng
  });
}

/** Eingabe einer Form. Gilt nur, was checkForm akzeptiert. */
export function typeQ(it) {
  const { v, p } = it, answer = v.forms[p];
  return typedQuestion({
    label: 'Schreibe die richtige Form', chip: chipOf(v), prompt: gap(it.fr), sub: it.de, answer,
    check: checkForm(answer), placeholder: 'Form eintippen', reveal: filled(it.fr, answer), why: hint(v, p), help: helpOf(v)
  });
}

/** Der ganze Satz wird als Auswahl angeboten, je Option mit einer anderen Form. */
export function sentenceQ(it, rng) {
  const { v, p } = it, answer = v.forms[p];
  const choices = [answer, ...distract(v, p, 2, rng)].map((f) => option(f, esc(it.fr.replace('___', f))));
  return choiceQuestion({
    label: 'Welcher Satz ist richtig?', chip: chipOf(v), sub: it.de, answer, choices, optionsLayout: 'list',
    reveal: filled(it.fr, answer), why: hint(v, p), help: helpOf(v), rng
  });
}

/** Konjugation aus Pronomen und Infinitiv: Eingabe der Form. */
export function formQ(v, p, rng) {
  const answer = v.forms[p], subject = subjectFor(v, p, rng).trim();
  return typedQuestion({
    label: 'Konjugiere im Présent', prompt: `${esc(subject)} + ${esc(v.inf)} → ?`, promptStyle: 'big', sub: v.de, answer,
    check: checkForm(answer), placeholder: `z. B. ${v.forms[3]}`, reveal: esc(`${subject} ${answer}`), why: hint(v, p), help: helpOf(v)
  });
}

/** Welche Endung fehlt? Nur bei regelmäßigen Verben, mit drei Ablenkern. */
export function endingQ(v, p, rng) {
  const answer = v.ends[p], subject = subjectFor(v, p, rng);
  const pool = shuffle([...new Set(v.ends)].filter((e) => e && e !== answer), rng).slice(0, 3);
  const choices = [answer, ...pool].map((e) => option(e, `-${esc(e)}`, e));
  return choiceQuestion({
    label: 'Welche Endung fehlt?', chip: chipOf(v), prompt: `${esc(subject)}${esc(v.stem)}{{blank}}`, promptStyle: 'big',
    answer, choices, reveal: `${esc(subject)}${esc(v.stem)}<b>${esc(answer)}</b>`, why: hint(v, p), help: helpOf(v), rng
  });
}

/** Pronomen den Formen zuordnen. Die Shell zeigt diese Fragen in der aktuellen Fassung noch nicht an. */
export function matchQ(v, rng) {
  return matchQuestion({
    label: 'Verbinde Pronomen und Form', chip: chipOf(v), left: PERSONS.map((i) => esc(lab(v, i))),
    leftValues: v.forms.slice(), right: shuffle(v.forms, rng).map((f) => ({ value: f, html: esc(f) })),
    why: 'Schau dir die Tabelle noch einmal an.', help: helpOf(v)
  });
}

// Zieht eine Person. Bei needEnding nur Personen mit Endung (regelmäßige Verben).
const randomPerson = (v, needEnding, rng) => {
  let p;
  do { p = pick(PERSONS, rng); } while (needEnding && !v.ends[p]);
  return p;
};

/** Wählt Beispielsätze so, dass sich innerhalb einer Runde möglichst keiner wiederholt. */
function sentencePicker(rng) {
  const used = {};
  return (unit) => {
    const pool = SP[unit.id], free = pool.filter((s) => !used[s.id]);
    const item = pick(free.length ? free : pool, rng);
    used[item.id] = 1;
    return item;
  };
}

function build(type, unit, next, rng) {
  if (type === 'choice') return choiceQ(next(unit), rng);
  if (type === 'type') return typeQ(next(unit));
  if (type === 'sent') return sentenceQ(next(unit), rng);
  const v = V[pick(unit.verbs, rng)];
  if (type === 'form') return formQ(v, randomPerson(v, false, rng), rng);
  if (type === 'end') return unit.irr ? choiceQ(next(unit), rng) : endingQ(v, randomPerson(v, true, rng), rng);
  return matchQ(v, rng);
}

const LESSON_IRREGULAR = ['choice', 'choice', 'form', 'match', 'type', 'sent', 'choice', 'type'];
const LESSON_REGULAR = ['choice', 'end', 'form', 'match', 'type', 'sent', 'end', 'type'];
const BOSS = ['choice', 'type', 'sent', 'form', 'choice', 'end', 'match', 'type', 'sent', 'choice', 'form', 'type'];
const QUICK = ['choice', 'sent', 'choice', 'end', 'type'];

/** 8 Fragen einer Seite. */
export function lessonRound(unit, rng) {
  const next = sentencePicker(rng);
  return (unit.irr ? LESSON_IRREGULAR : LESSON_REGULAR).map((t) => build(t, unit, next, rng));
}

function mixedRound(types, rng) {
  const next = sentencePicker(rng);
  return types.map((t) => {
    const unit = t === 'end' ? pick(UNITS.filter((u) => !u.irr), rng) : pick(UNITS, rng);
    return build(t, unit, next, rng);
  });
}

export const bossRound = (rng) => mixedRound(BOSS, rng);
export const quickRound = (rng) => mixedRound(QUICK, rng);

/** Eine Frage für den Blitz-Modus (immer Auswahl). */
export function blitzQuestion(rng) {
  const unit = pick(UNITS, rng);
  if (!unit.irr && rng() < 0.25) {
    const v = V[pick(unit.verbs, rng)];
    return endingQ(v, randomPerson(v, true, rng), rng);
  }
  return choiceQ(pick(SP[unit.id], rng), rng);
}
