// Prüfer für Wahrscheinlichkeiten: Bruch, Dezimalzahl (0 bis 1) und Prozent sind gleichwertig (RULE-112).
// Herkunft: legacy/modulare/core/js/mathkit.js:37-44. Reine Funktionen, kein DOM.
import { baseInput, TOLERANCE } from './number.js';

// Nur einfache Dezimalschreibweise: "0.25", ".5", "5.". Keine Vorzeichen, kein Exponent, kein Hex.
// Number() würde "" als 0 lesen und "1e-1" als 0,1; beides ist bei Wahrscheinlichkeiten ein Fehler.
const DECIMAL = /^(\d+\.?\d*|\.\d+)$/;

/** Liest eine Dezimalzahl, sonst null. Leere Teile wie in "%" oder "/4" sind damit ungültig. */
function parseDecimal(text) {
  return DECIMAL.test(text) ? Number(text) : null;
}

/** Liest Bruch, Dezimalzahl oder Prozent als Zahlenwert. Ungültig oder Nenner 0 ergibt null. */
function parseProbability(raw) {
  // Komma wird zum Punkt. Danach ist "0,25" und "0.25" dieselbe Eingabe.
  const text = baseInput(raw).replace(/,/g, '.');
  if (text.endsWith('%')) {
    const percent = parseDecimal(text.slice(0, -1));
    return percent === null ? null : percent / 100;
  }
  const parts = text.split('/');
  if (parts.length === 1) return parseDecimal(text);
  // "1/2/3" ist kein Bruch. Legacy las stillschweigend 1/2 (mathkit.js:42), das wird hier abgelehnt.
  if (parts.length !== 2) return null;
  const numerator = parseDecimal(parts[0]);
  const denominator = parseDecimal(parts[1]);
  if (numerator === null || denominator === null || denominator === 0) return null;
  return numerator / denominator;
}

/**
 * Wahrscheinlichkeitsprüfer. Ergibt 'ok' oder 'bad'.
 * Der Wert muss im Bereich 0 bis 1 liegen; ein Wert außerhalb ist immer falsch.
 * Eine nackte Zahl wie "25" wird als Dezimalzahl gelesen (also 25) und nicht als 25 % abgelehnt.
 */
export function probCheck(value) {
  return (input) => {
    const probability = parseProbability(input);
    return probability !== null && probability >= 0 && probability <= 1 && Math.abs(probability - value) < TOLERANCE
      ? 'ok'
      : 'bad';
  };
}
