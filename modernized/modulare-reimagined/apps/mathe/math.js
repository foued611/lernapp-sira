// Rechenhelfer nur für die Mathe-Werkstatt: Terme, Klammern und Brüche. Herkunft: legacy/modulare/apps/mathe/math.js
// und core/js/mathkit.js (frac, gcd, clean). Zahlen, Minuszeichen und Zahlenprüfer kommen aus helfer/.
import { MINUS, fmt, shuffle } from '../../helfer/index.js';

// Eingabe vereinheitlichen wie helfer/number.js (cleanInput). Dort nicht exportiert, deshalb hier eine Kopie.
const baseInput = (raw) => String(raw).trim().toLowerCase().replace(/−|–/g, '-').replace(/\s+/g, '');
const cleanInput = (raw) => baseInput(raw).replace(/[€%°]|euro|grad|cm|m²?/g, '');

/** Zahl in Klammern, wenn negativ: 5 + (−3). */
export const par = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));

const termNorm = (s) => cleanInput(s).replace(/[·*]/g, '').replace(/^\+/, '');

// Liest einen zusammengefassten Term "ax + c" in beliebiger Reihenfolge. null, wenn er anders aussieht
// oder noch gleichartige Summanden enthält: 3x + 5x soll nicht als 8x durchgehen.
function parseLinear(raw) {
  const text = termNorm(raw);
  if (!/^[+-]?(\d+x?|x)([+-](\d+x?|x))*$/.test(text)) return null;
  const parsed = { x: null, n: null };
  for (const part of text.match(/[+-]?(\d+x?|x)/g)) {
    const key = part.endsWith('x') ? 'x' : 'n';
    if (parsed[key] !== null) return null;
    const digits = part.replace(/[+x-]/g, '');
    parsed[key] = (part.startsWith('-') ? -1 : 1) * (digits === '' ? 1 : Number(digits));
  }
  return { x: parsed.x ?? 0, n: parsed.n ?? 0 };
}

/** Termprüfer: Leerzeichen, Malpunkt, Minuszeichen-Varianten und die Reihenfolge der Summanden sind egal (13 − x = −x + 13). */
export function termCheck(answer) {
  const target = parseLinear(answer);
  return (input) => {
    const given = parseLinear(input);
    if (target && given) return target.x === given.x && target.n === given.n ? 'ok' : 'bad';
    return termNorm(input) === termNorm(answer) ? 'ok' : 'bad';
  };
}

/** Term wie "3x + 12" aus Koeffizient und Konstante. */
export function linear(a, c, v = 'x') {
  const head = a === 0 ? '' : a === 1 ? v : a === -1 ? `${MINUS}${v}` : `${fmt(a)}${v}`;
  if (a === 0) return fmt(c);
  if (c === 0) return head;
  return `${head} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
}

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** Gekürzter Bruch als Text: frac(2, 6) ergibt "1/3", frac(4, 2) ergibt "2". */
export function frac(n, d) {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
}

/** Auf zwei Nachkommastellen gerundet. Glättet auch Rechenreste wie 1331,0000000000005. */
export const rund = (n) => Math.round(n * 100) / 100;

/** Geldbetrag: 37.5 wird "37,50", 40 bleibt "40". */
export const euro = (n) => (Number.isInteger(rund(n)) ? fmt(n) : rund(n).toFixed(2).replace('.', ','));

/**
 * Drei falsche positive Zahlen für Sachaufgaben. Rechenfehler (extras) zuerst, dann Nachbarn im Maßstab der Lösung.
 * Negative Beträge und Zahlen mit mehr als zwei Nachkommastellen fallen weg, sie schieden ohne Rechnen aus.
 */
export function nah(answer, extras, rng) {
  const target = rund(answer);
  const usable = (v) => Number.isFinite(v) && v > 0 && rund(v) !== target && Math.abs(v - rund(v)) < 1e-9;
  const found = new Set(extras.filter(usable).map(rund));
  const step = target >= 1000 ? 100 : target >= 100 ? 10 : 1;
  for (const d of shuffle([1, -1, 2, -2, 3, -3, 4, 5], rng)) {
    if (found.size >= 3) break;
    const v = target + d * step;
    if (usable(v)) found.add(rund(v));
  }
  return [...found].slice(0, 3);
}
