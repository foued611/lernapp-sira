// Rechenhelfer der Mathe-App: Zahlen schön ausgeben und Eingaben tolerant prüfen. Kein Browser-Code.
import { pick, shuffle } from '../../core/js/ui.js';

export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const MINUS = '−';

/** Ganze oder Dezimalzahl mit Minuszeichen und Komma, z. B. -3.5 -> "−3,5". */
export const fmt = (n) => (n < 0 ? MINUS : '') + String(Math.abs(Math.round(n * 1000) / 1000)).replace('.', ',');
/** In Klammern, wenn negativ: 5 + (−3). */
export const par = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));

const clean = (s) => String(s).trim().toLowerCase().replace(/−|–/g, '-').replace(/\s+/g, '').replace(/[€%]|euro|cm|m²?/g, '');

/** Zahlenprüfer: akzeptiert Komma oder Punkt und beide Minuszeichen. */
export const numCheck = (answer) => (input) => {
  const v = Number(clean(input).replace(',', '.'));
  return clean(input) !== '' && Number.isFinite(v) && Math.abs(v - answer) < 1e-9 ? 'ok' : 'bad';
};

/** Termprüfer: Leerzeichen, Malpunkt und Minuszeichen-Varianten sind egal. */
const termNorm = (s) => clean(s).replace(/[·*]/g, '').replace(/^\+/, '');
export const termCheck = (answer) => (input) => (termNorm(input) === termNorm(answer) ? 'ok' : 'bad');

/** Drei falsche Zahlen in der Nähe, ohne die richtige und ohne Doppelte. */
export function nearby(answer, extras = []) {
  const set = new Set(extras.filter((v) => v !== answer && Number.isFinite(v)));
  for (const d of shuffle([1, -1, 2, -2, 10, -10, 3])) { if (set.size >= 3) break; if (answer + d !== answer) set.add(answer + d); }
  return [...set].slice(0, 3);
}

/** Term wie "3x + 12" aus Koeffizient und Konstante. */
export function linear(a, c, v = 'x') {
  const head = a === 0 ? '' : a === 1 ? v : a === -1 ? `${MINUS}${v}` : `${fmt(a)}${v}`;
  if (a === 0) return fmt(c);
  if (c === 0) return head;
  return `${head} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
}

export { pick, shuffle };
