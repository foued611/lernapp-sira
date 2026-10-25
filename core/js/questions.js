// Gemeinsame Fragenbauer für alle Apps. Sie erzeugen Fragen im Format aus core/js/quiz.js.
// Eine App muss sie nicht nutzen, spart sich damit aber das Zusammenbauen von Optionen und Prüffunktion.
import { esc, shuffle } from './ui.js';

/** Eine Antwortoption. id ist der gespeicherte Wert, html die Anzeige (Standard: der maskierte Wert). */
export const option = (id, html = esc(id), fill) => (fill === undefined ? { id, html } : { id, html, fill });

/**
 * Auswahlfrage. answer muss in choices vorkommen. choices sind Texte oder fertige Optionen.
 * @param {object} o
 * @param {string} o.label     kleine Überschrift
 * @param {string} o.prompt    Fragetext (HTML, Daten vorher mit esc() maskieren)
 * @param {string} o.answer    richtige Antwort (id)
 * @param {(string|object)[]} o.choices   alle Antworten, die richtige eingeschlossen
 * @param {(value:string)=>string} [o.format]  Anzeige je Text, Standard esc()
 */
export function choiceQuestion({ label, prompt, answer, choices, format = esc, why, reveal, help, chip, sub, promptStyle = 'sentence', optionsLayout }) {
  const options = shuffle(choices.map((c) => (typeof c === 'string' ? option(c, format(c)) : c)));
  return { kind: 'choice', label, chip, prompt, promptStyle, sub, answer, options, optionsLayout, reveal: reveal || format(answer), why, help };
}

/** Eingabefrage. check: (eingabe) => 'ok' | 'almost' | 'bad'. */
export function typedQuestion({ label, prompt, answer, check, placeholder, accents, why, reveal, help, chip, sub, promptStyle = 'sentence', format = esc }) {
  return { kind: 'type', label, chip, prompt, promptStyle, sub, answer, check, placeholder, accents, reveal: reveal || format(answer), why, help };
}
