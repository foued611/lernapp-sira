// Gemeinsame Testhilfen. Die Dateiendung ist nicht .test.js, also läuft diese Datei nicht als eigener Test.
import { choiceQuestion, typedQuestion, matchQuestion } from '../src/questions.js';
import { createRng } from '../../helfer/index.js';

/** Fester Zufall für reproduzierbare Tests. */
export const rngFor = (seed = 7) => createRng(seed);

/** Konstanter Zufall 0. Fisher-Yates zieht dann immer den ersten Platz, die Liste wird also deterministisch umgestellt. */
export const zeroRng = () => 0;

/** Auswahlfrage mit drei Optionen. Die richtige Option ist id 'a'. */
export function sampleChoice(label = 'Auswahl', rng = rngFor()) {
  return choiceQuestion({
    label, prompt: `Frage ${label}`, answer: 'a', choices: ['a', 'b', 'c'], rng
  });
}

/** Eingabefrage, deren richtige Antwort 'chanté' ist. */
export function sampleTyped(label = 'Eingabe') {
  return typedQuestion({ label, prompt: `Schreibe ${label}`, answer: 'chanté' });
}

/** Zuordnung mit drei Paaren. Links i gehört rechts zum Wert i+1. */
export function sampleMatch(label = 'Zuordnung') {
  return matchQuestion({
    label,
    left: ['eins', 'zwei', 'drei'],
    right: [{ value: '1', html: 'I' }, { value: '2', html: 'II' }, { value: '3', html: 'III' }],
    leftValues: ['1', '2', '3']
  });
}

/** Die Antwort, die für eine Frage richtig ist. Zuordnungen brauchen mehrere Schritte und haben keine Einzelantwort. */
export function correctResponse(q) {
  if (q.kind === 'choice') return { pick: q.answer };
  if (q.kind === 'type') return { text: q.answer };
  throw new Error('Zuordnung hat keine Einzelantwort');
}

/** Eine Antwort, die sicher falsch ist. */
export function wrongResponse(q) {
  if (q.kind === 'choice') return { pick: q.options.find((o) => o.id !== q.answer).id };
  if (q.kind === 'type') return { text: 'völlig falsch' };
  throw new Error('Zuordnung hat keine Einzelantwort');
}

/** Beantwortet die aktuelle Frage und geht weiter. Gibt Antwort und Schritt zurück. */
export function answerAndNext(round, response) {
  const submitted = round.submit(response);
  const advanced = round.next();
  return { submitted, advanced };
}
