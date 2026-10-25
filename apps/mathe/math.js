// Rechenhelfer der Mathe-App. Allgemeine Helfer liegen in core/js/mathkit.js, hier nur, was Terme betrifft.
import { pick, shuffle } from '../../core/js/ui.js';
import { fmt, clean, MINUS } from '../../core/js/mathkit.js';

export { rnd, MINUS, fmt, par, numCheck, nearby, gcd, frac, probCheck } from '../../core/js/mathkit.js';
export { pick, shuffle };

/** Termprüfer: Leerzeichen, Malpunkt und Minuszeichen-Varianten sind egal. */
const termNorm = (s) => clean(s).replace(/[·*]/g, '').replace(/^\+/, '');
export const termCheck = (answer) => (input) => (termNorm(input) === termNorm(answer) ? 'ok' : 'bad');

/** Term wie "3x + 12" aus Koeffizient und Konstante. */
export function linear(a, c, v = 'x') {
  const head = a === 0 ? '' : a === 1 ? v : a === -1 ? `${MINUS}${v}` : `${fmt(a)}${v}`;
  if (a === 0) return fmt(c);
  if (c === 0) return head;
  return `${head} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
}
