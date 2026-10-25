// Aus dem Lernstoff (content/fr-verben/, über model.js) werden Fragen im Quiz-Format (siehe core/js/quiz.js).
import { esc, shuffle, pick, norm, stripAccents } from '../../core/js/ui.js';
import { V, UNITS, SP, TRAP, HINT, PRON, PQV } from './model.js';

export const elides = (v) => /^[aeiouhéèêàâîôû]/i.test(v.forms[0]);
export const lab = (v, p) => (p === 0 ? (elides(v) ? "j'" : 'je') : PRON[p]);
const subjectFor = (v, p) => (p === 0 ? (elides(v) ? "j'" : 'je ') : pick(PQV[p]) + ' ');

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
export function distract(v, p, count) {
  const answer = v.forms[p];
  const others = shuffle([...new Set(v.forms)].filter((f) => f !== answer));
  const traps = (TRAP[v.key] && TRAP[v.key][p]) || [];
  return [...traps.slice(0, 1), ...others].filter((x, i, all) => all.indexOf(x) === i).slice(0, count);
}

const chip = (v) => `<span class="vchip">Verb: <b>${esc(v.inf)}</b> · ${esc(v.de)}</span>`;
const miniTable = (v) => `<table class="mini">${[0, 1, 2, 3, 4, 5].map((i) => `<tr><td>${esc(lab(v, i))}</td><td><b>${esc(v.forms[i])}</b></td></tr>`).join('')}</table>`;
const gap = (fr) => fr.split('___').map(esc).join('{{blank}}');
const filled = (fr, form) => fr.split('___').map(esc).join(`<span class="mk">${esc(form)}</span>`);

/** Prüft getippte Formen. Pronomen davor sind erlaubt, ein fehlender Akzent zählt als "fast". */
export function checkForm(answer) {
  const stripPronoun = (s) => s.replace(/^(j'|je |tu |il |elle |on |nous |vous |ils |elles )/, '');
  return (input) => {
    const given = stripPronoun(norm(input)), expected = norm(answer);
    if (given === expected) return 'ok';
    return stripAccents(given) === stripAccents(expected) ? 'almost' : 'bad';
  };
}

const optionsFor = (v, p, count) => shuffle([v.forms[p], ...distract(v, p, count)]).map((f) => ({ id: f, html: esc(f), fill: f }));

export function choiceQ(it) {
  const { v, p } = it, answer = v.forms[p];
  return { kind: 'choice', label: 'Lücke füllen', chip: chip(v), prompt: gap(it.fr), sub: it.de, answer, options: optionsFor(v, p, 3), reveal: filled(it.fr, answer), why: hint(v, p), help: miniTable(v) };
}

export function typeQ(it) {
  const { v, p } = it, answer = v.forms[p];
  return { kind: 'type', label: 'Schreibe die richtige Form', chip: chip(v), prompt: gap(it.fr), sub: it.de, answer, check: checkForm(answer), placeholder: 'Form eintippen', reveal: filled(it.fr, answer), why: hint(v, p), help: miniTable(v) };
}

export function sentenceQ(it) {
  const { v, p } = it, answer = v.forms[p];
  const options = shuffle([answer, ...distract(v, p, 2)]).map((f) => ({ id: f, html: esc(it.fr.replace('___', f)) }));
  return { kind: 'choice', label: 'Welcher Satz ist richtig?', chip: chip(v), sub: it.de, answer, options, optionsLayout: 'list', reveal: filled(it.fr, answer), why: hint(v, p), help: miniTable(v) };
}

export function formQ(v, p) {
  const answer = v.forms[p], subject = subjectFor(v, p).trim();
  return { kind: 'type', label: 'Konjugiere im Présent', prompt: `${esc(subject)} + ${esc(v.inf)} <span class="muted">→ ?</span>`, promptStyle: 'big', sub: v.de, answer, check: checkForm(answer), placeholder: `z. B. ${v.forms[3]}`, reveal: esc(`${subject} ${answer}`), why: hint(v, p), help: miniTable(v) };
}

export function endingQ(v, p) {
  const answer = v.ends[p], subject = subjectFor(v, p);
  const pool = shuffle([...new Set(v.ends)].filter((e) => e && e !== answer)).slice(0, 3);
  const options = shuffle([answer, ...pool]).map((e) => ({ id: e, html: `-${esc(e)}`, fill: e }));
  return { kind: 'choice', label: 'Welche Endung fehlt?', chip: chip(v), prompt: `${esc(subject)}${esc(v.stem)}{{blank}}`, promptStyle: 'big', answer, options, reveal: `${esc(subject)}${esc(v.stem)}<span class="mk">${esc(answer)}</span>`, why: hint(v, p), help: miniTable(v) };
}

export function matchQ(v) {
  return { kind: 'match', label: 'Verbinde Pronomen und Form', chip: chip(v), left: [0, 1, 2, 3, 4, 5].map((i) => esc(lab(v, i))), leftValues: v.forms.slice(), right: shuffle(v.forms).map((f) => ({ value: f, html: esc(f) })), why: 'Schau dir die Tabelle noch einmal an.', help: miniTable(v) };
}

const randomPerson = (v, needEnding) => {
  let p;
  do { p = Math.floor(Math.random() * 6); } while (needEnding && !v.ends[p]);
  return p;
};

/** Wählt Beispielsätze so, dass sich innerhalb einer Runde möglichst keiner wiederholt. */
function sentencePicker() {
  const used = {};
  return (unit) => {
    const pool = SP[unit.id], free = pool.filter((s) => !used[s.id]);
    const item = pick(free.length ? free : pool);
    used[item.id] = 1;
    return item;
  };
}

function build(type, unit, nextSentence) {
  if (type === 'choice') return choiceQ(nextSentence(unit));
  if (type === 'type') return typeQ(nextSentence(unit));
  if (type === 'sent') return sentenceQ(nextSentence(unit));
  const v = V[pick(unit.verbs)];
  if (type === 'form') return formQ(v, randomPerson(v));
  if (type === 'end') return unit.irr ? choiceQ(nextSentence(unit)) : endingQ(v, randomPerson(v, true));
  return matchQ(v);
}

const LESSON_IRREGULAR = ['choice', 'choice', 'form', 'match', 'type', 'sent', 'choice', 'type'];
const LESSON_REGULAR = ['choice', 'end', 'form', 'match', 'type', 'sent', 'end', 'type'];
const BOSS = ['choice', 'type', 'sent', 'form', 'choice', 'end', 'match', 'type', 'sent', 'choice', 'form', 'type'];
const QUICK = ['choice', 'sent', 'choice', 'end', 'type'];

export function lessonRound(unit) {
  const next = sentencePicker();
  return (unit.irr ? LESSON_IRREGULAR : LESSON_REGULAR).map((t) => build(t, unit, next));
}

function mixedRound(types) {
  const next = sentencePicker();
  return types.map((t) => {
    const unit = t === 'end' ? pick(UNITS.filter((u) => !u.irr)) : pick(UNITS);
    return build(t, unit, next);
  });
}

export const bossRound = () => mixedRound(BOSS);
export const quickRound = () => mixedRound(QUICK);

/** Eine Frage für den Blitz-Modus (immer Auswahl). */
export function blitzQuestion() {
  const unit = pick(UNITS);
  if (!unit.irr && Math.random() < 0.25) {
    const v = V[pick(unit.verbs)];
    return endingQ(v, randomPerson(v, true));
  }
  return choiceQ(pick(SP[unit.id]));
}
