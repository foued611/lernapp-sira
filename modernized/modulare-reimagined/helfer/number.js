// Zahlenprüfer für Eingaben: Komma oder Punkt, typografische Minuszeichen und Einheiten sind erlaubt.
// Herkunft: legacy/modulare/core/js/mathkit.js:9-21 (Prüfer), :13-15 (Bereinigung). Reine Funktionen, kein DOM.

// Abweichung unter dieser Grenze gilt als gleich (mathkit.js:20). Gilt für Rundung und exakten Vergleich.
export const TOLERANCE = 1e-9;

/** Vereinheitlicht die Eingabe: Kleinbuchstaben, Leerzeichen weg, U+2212 und En-Dash werden zu '-'. */
export function baseInput(raw) {
  return String(raw).trim().toLowerCase().replace(/−|–/g, '-').replace(/\s+/g, '');
}

/** Entfernt Einheiten, damit "30 €", "8 cm" oder "45°" als Zahl lesbar sind (mathkit.js:15). */
export function cleanInput(raw) {
  return baseInput(raw).replace(/[€%°]|euro|grad|cm|m²?/g, '');
}

/**
 * Kaufmännisch runden auf `places` Nachkommastellen: 0,5 geht vom Betrag her nach oben.
 * Math.round allein rundet -2,5 zu -2 und ist bei Binärbrüchen unsicher (2,345 -> 2,34).
 * Deshalb wird die Stelle in der Dezimaldarstellung verschoben, nicht im Binärwert.
 */
export function roundTo(value, places) {
  const [mantissa, exponent] = Math.abs(value).toExponential().split('e');
  const shifted = Math.round(Number(`${mantissa}e${Number(exponent) + places}`));
  // Ab 2^53 gibt es keine Nachkommastellen mehr; dann ist Runden ohnehin wirkungslos.
  if (!Number.isSafeInteger(shifted)) return value;
  const rounded = Number(`${shifted}e${-places}`);
  return value < 0 ? -rounded : rounded;
}

/**
 * Zahlenprüfer. Ergibt 'ok' oder 'bad'.
 * Ohne `places` gilt exakte Übereinstimmung (bis 1e-9). Mit `places` wird der Sollwert auf so viele
 * Nachkommastellen gerundet, wie die Aufgabe verlangt, und die Eingabe muss genau dieser Wert sein
 * (RULE-128). Eine genauere Eingabe ist damit falsch: 0,3333 gilt bei drei Stellen nicht für 1/3.
 */
export function numCheck(answer, { places } = {}) {
  if (places !== undefined && !(Number.isInteger(places) && places >= 0)) {
    throw new RangeError('places muss eine ganze Zahl ab 0 sein');
  }
  const target = places === undefined ? answer : roundTo(answer, places);
  return (input) => {
    const cleaned = cleanInput(input);
    // Nur das erste Komma wird ersetzt, wie im Legacy-Code. Ein zweites Komma macht die Zahl ungültig.
    const value = Number(cleaned.replace(',', '.'));
    // Leere Eingabe prüfen wir vorab, weil Number('') sonst 0 ergibt.
    return cleaned !== '' && Number.isFinite(value) && Math.abs(value - target) < TOLERANCE ? 'ok' : 'bad';
  };
}

// Rechenhelfer für Mathe-nahe Apps (Geometrie heute, Mathe und Physik später). Herkunft: legacy/modulare/core/js/mathkit.js:5-7, 22-28.
// Jede Funktion mit Zufall bekommt rng als letzten Parameter. Die Reihenfolge der Zufallsaufrufe entspricht der Legacy-Fassung,
// damit gleicher Seed gleiche Aufgaben ergibt (Dual-Execution in analysis/modulare).
import { shuffle } from './random.js';

export const MINUS = '−';

/** Ganze Zahl von a bis b einschließlich, mit rng. */
export function rnd(a, b, rng) {
  return a + Math.floor(rng() * (b - a + 1));
}

/** Zahl mit Minuszeichen und Komma, z. B. -3.5 wird "−3,5". Gerundet auf drei Nachkommastellen. */
export function fmt(n) {
  return (n < 0 ? MINUS : '') + String(Math.abs(Math.round(n * 1000) / 1000)).replace('.', ',');
}

/** Drei falsche Zahlen in der Nähe der Lösung, ohne die Lösung und ohne Doppelte. Extras werden zuerst genommen. */
export function nearby(answer, extras = [], rng) {
  const set = new Set(extras.filter((v) => v !== answer && Number.isFinite(v)));
  for (const d of shuffle([1, -1, 2, -2, 10, -10, 3], rng)) {
    if (set.size >= 3) break;
    if (answer + d !== answer) set.add(answer + d);
  }
  return [...set].slice(0, 3);
}
