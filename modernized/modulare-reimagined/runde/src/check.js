// Vergleich getippter Antworten (RULE-151). Herkunft: legacy/modulare/core/js/qtypes.js:37-43 (defaultCheck).
import { normalise, stripAccents } from './text.js';

/**
 * 'ok' bei gleicher Schreibweise nach normalise(). 'almost' nur, wenn sich beide allein in Akzenten
 * unterscheiden (êtes und etes). Alles andere ist 'bad'. Akzente fallen nur in diesem zweiten Vergleich weg.
 */
export function compareTyped(input, answer) {
  const given = normalise(input);
  const expected = normalise(answer);
  if (given === expected) return 'ok';
  return stripAccents(given) === stripAccents(expected) ? 'almost' : 'bad';
}
