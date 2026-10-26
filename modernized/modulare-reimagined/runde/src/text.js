// Textvergleich, eine Stelle für alle Fragetypen (RULE-137).
// Herkunft: legacy/modulare/core/js/ui.js:6-7 (esc) und ui.js:20-24 (norm, stripAccents).
// helfer hat kein esc, deshalb steht hier eine Kopie. Zusammenlegen, sobald es ein gemeinsames Textmodul gibt.

/** HTML-Sonderzeichen maskieren (ui.js:6-7). Für Daten, die später in html landen. */
export function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Eingabe für den Vergleich vereinheitlichen: Kleinbuchstaben, ein Apostroph, einfache Leerzeichen.
 * Übernommen aus ui.js:21 samt ` und ´. Beide sind keine typografischen Apostrophe, aber die Legacy-App
 * akzeptiert sie als Apostroph, und ein Wechsel würde bestehende Antworten anders bewerten.
 */
export function normalise(text) {
  return String(text).trim().toLowerCase().replace(/[’`´]/g, "'").replace(/\s+/g, ' ');
}

/** Akzente entfernen. Wird nur für den Vergleich "fast richtig" benutzt (ui.js:23-24). */
export function stripAccents(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}
