// Fragenbauer (Schuld 4): Apps liefern Daten, der Rundenablauf steckt nur in createRound.
// Herkunft: legacy/modulare/core/js/questions.js und die Prüfungen in qtypes.js (validate).
// Zufall kommt als rng herein, damit die Reihenfolge der Optionen in Tests reproduzierbar ist.
import { shuffle } from '../../helfer/index.js';
import { esc } from './text.js';

const requireText = (value, name) => {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${name} fehlt oder ist leer`);
};

const requireRng = (rng) => {
  if (typeof rng !== 'function') throw new TypeError('rng ist Pflicht, z. B. createRng(seed)');
};

/** Eine Antwortoption. id ist der gespeicherte Wert, html die Anzeige (Standard: die maskierte id). */
export const option = (id, html = esc(id), fill) => (fill === undefined ? { id, html } : { id, html, fill });

/**
 * Auswahlfrage. answer ist eine Option-id und muss in choices vorkommen.
 * Die Optionen werden mit rng gemischt, damit die richtige Antwort nie an derselben Stelle steht (questions.js:18).
 * @param {object} o
 * @param {string} o.label
 * @param {string} o.prompt               Fragetext, html. Daten vorher mit esc() maskieren.
 * @param {string} o.answer               richtige Option-id
 * @param {(string|object)[]} o.choices   Texte oder fertige Optionen, die richtige eingeschlossen
 * @param {()=>number} o.rng              Zufall in [0, 1)
 * @param {(value:string)=>string} [o.format]  Anzeige je Text, Standard esc()
 */
export function choiceQuestion({
  label, prompt, answer, choices, rng, format = esc, why, reveal, help, chip, sub, promptStyle = 'sentence', optionsLayout
}) {
  requireRng(rng);
  requireText(label, 'label');
  requireText(answer, 'answer');
  if (!Array.isArray(choices)) throw new TypeError('choices muss eine Liste sein');

  const all = choices.map((c) => (typeof c === 'string' ? option(c, format(c)) : c));
  const ids = all.map((o) => o.id);
  if (!ids.includes(answer)) throw new TypeError(`Antwort fehlt in den Optionen: ${label}`);
  if (new Set(ids).size !== ids.length) throw new TypeError(`Optionen müssen eindeutig sein: ${label}`);
  if (ids.length < 2 || ids.length > 4) throw new RangeError(`zwei bis vier Optionen nötig: ${label}`);
  // Eine Lücke im Text braucht für jede Option den Füllwert, sonst bleibt sie leer (qtypes.js:81).
  if (prompt && prompt.includes('{{blank}}') && !all.every((o) => o.fill !== undefined)) {
    throw new TypeError(`Lücke braucht fill: ${label}`);
  }

  return {
    kind: 'choice', label, chip, prompt, promptStyle, sub, answer,
    options: shuffle(all, rng), optionsLayout,
    reveal: reveal || format(answer), why, help
  };
}

/**
 * Eingabefrage. check ist optional und ersetzt den Standardvergleich (z. B. für Zahlen).
 * Die richtige Antwort muss von check als 'ok' bewertet werden (qtypes.js:106).
 */
export function typedQuestion({
  label, prompt, answer, check, placeholder, accents, why, reveal, help, chip, sub, promptStyle = 'sentence', format = esc
}) {
  requireText(label, 'label');
  requireText(answer, 'answer');
  if (check !== undefined && typeof check !== 'function') throw new TypeError('check muss eine Funktion sein');
  if (check && check(answer) !== 'ok') throw new TypeError(`die richtige Antwort muss ok sein: ${label}`);

  return {
    kind: 'type', label, chip, prompt, promptStyle, sub, answer, check, placeholder, accents,
    reveal: reveal || format(answer), why, help
  };
}

/**
 * Zuordnungsfrage. left sind Anzeigen (html), right sind { value, html }, leftValues gibt je linkem Eintrag den Wert an.
 * Die Reihenfolge rechts bleibt, wie sie geliefert wird (legacy qtypes.js:146-151).
 */
export function matchQuestion({ label, left, right, leftValues, chip, why, help }) {
  requireText(label, 'label');
  if (!Array.isArray(left) || !Array.isArray(right) || !Array.isArray(leftValues)) {
    throw new TypeError(`Zuordnung braucht left, right und leftValues als Listen: ${label}`);
  }
  if (left.length !== right.length || left.length !== leftValues.length) {
    throw new TypeError(`Zuordnung: links, rechts und Werte müssen gleich lang sein: ${label}`);
  }
  // Jeder Wert links muss rechts genau einmal vorkommen, sonst ließe sich die Frage nicht lösen.
  const sortedLeft = [...leftValues].sort();
  const sortedRight = right.map((r) => r.value).sort();
  if (sortedLeft.some((value, i) => value !== sortedRight[i])) {
    throw new TypeError(`Werte links und rechts passen nicht zusammen: ${label}`);
  }

  return { kind: 'match', label, chip, left, right, leftValues, why, help };
}
