// Rechenhelfer nur für die Mathe-Werkstatt: Terme, Klammern und Brüche. Herkunft: legacy/modulare/apps/mathe/math.js
// und core/js/mathkit.js (frac, gcd, clean). Zahlen, Minuszeichen und Zahlenprüfer kommen aus helfer/.
import { MINUS, fmt } from '../../helfer/index.js';

// Eingabe vereinheitlichen wie helfer/number.js (cleanInput). Dort nicht exportiert, deshalb hier eine Kopie.
const baseInput = (raw) => String(raw).trim().toLowerCase().replace(/−|–/g, '-').replace(/\s+/g, '');
const cleanInput = (raw) => baseInput(raw).replace(/[€%°]|euro|grad|cm|m²?/g, '');

/** Zahl in Klammern, wenn negativ: 5 + (−3). */
export const par = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));

/** Termprüfer: Leerzeichen, Malpunkt und Minuszeichen-Varianten sind egal. */
const termNorm = (s) => cleanInput(s).replace(/[·*]/g, '').replace(/^\+/, '');
export const termCheck = (answer) => (input) => (termNorm(input) === termNorm(answer) ? 'ok' : 'bad');

/** Term wie "3x + 12" aus Koeffizient und Konstante. */
export function linear(a, c, v = 'x') {
  const head = a === 0 ? '' : a === 1 ? v : a === -1 ? `${MINUS}${v}` : `${fmt(a)}${v}`;
  if (a === 0) return fmt(c);
  if (c === 0) return head;
  return `${head} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
}

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** Gekürzter Bruch als Text: frac(2, 6) ergibt "1/3", frac(4, 2) ergibt "2". */
export function frac(n, d) {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
}
