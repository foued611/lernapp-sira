// Rechenhelfer für Mathe-nahe Apps (Mathe, Geometrie, später Physik): Zahlen ausgeben und Eingaben tolerant prüfen.
// Kein Browser-Code, deshalb in Node testbar.
import { shuffle } from './ui.js';

export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const MINUS = '\u2212';

/** Ganze oder Dezimalzahl mit Minuszeichen und Komma, z. B. -3.5 -> "−3,5". */
export const fmt = (n) => (n < 0 ? MINUS : '') + String(Math.abs(Math.round(n * 1000) / 1000)).replace('.', ',');
/** In Klammern, wenn negativ: 5 + (−3). */
export const par = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));

export const base = (s) => String(s).trim().toLowerCase().replace(/\u2212|\u2013/g, '-').replace(/\s+/g, '');
/** Entfernt Einheiten, damit "30 €", "8 cm" oder "45°" als Zahl lesbar sind. */
export const clean = (s) => base(s).replace(/[€%°]|euro|grad|cm|m²?/g, '');

/** Zahlenprüfer: akzeptiert Komma oder Punkt, beide Minuszeichen und gängige Einheiten. */
export const numCheck = (answer) => (input) => {
  const v = Number(clean(input).replace(',', '.'));
  return clean(input) !== '' && Number.isFinite(v) && Math.abs(v - answer) < 1e-9 ? 'ok' : 'bad';
};

/** Drei falsche Zahlen in der Nähe, ohne die richtige und ohne Doppelte. */
export function nearby(answer, extras = []) {
  const set = new Set(extras.filter((v) => v !== answer && Number.isFinite(v)));
  for (const d of shuffle([1, -1, 2, -2, 10, -10, 3])) { if (set.size >= 3) break; if (answer + d !== answer) set.add(answer + d); }
  return [...set].slice(0, 3);
}

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** Gekürzter Bruch als Text: frac(2, 6) -> "1/3", frac(4, 2) -> "2". */
export function frac(n, d) {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
}

/** Prüfer für Wahrscheinlichkeiten: Bruch, Dezimalzahl oder Prozent sind gleichwertig. */
export const probCheck = (value) => (input) => {
  const s = base(input).replace(',', '.');
  let v;
  if (s.endsWith('%')) v = Number(s.slice(0, -1)) / 100;
  else if (s.includes('/')) { const [a, b] = s.split('/'); v = Number(a) / Number(b); } else v = Number(s);
  return s !== '' && Number.isFinite(v) && Math.abs(v - value) < 1e-9 ? 'ok' : 'bad';
};
