// Spielzahlen des Rundenmotors. Die Combo-Formel selbst steht in regeln (comboMultiplier), hier wird sie nur benutzt.

/** Herzen je Runde. Der Endgegner hat weniger (quiz.js:66). */
export const HEARTS = Object.freeze({ normal: 5, boss: 3 });

/** Grund-XP je Antwort. Die Combo-Multiplikation kommt dazu (quiz.js:124). */
export const XP = Object.freeze({
  correct: 10, // quiz.js:124
  almost: 5, // quiz.js:126, knapp richtig, ohne Multiplikator
  retry: 5, // quiz.js:115, zweiter Versuch richtig oder knapp
  blitzCorrect: 5 // blitz.js:43, Blitz zahlt weniger je Treffer
});

/** Länge des Blitz-Modus in Sekunden (blitz.js:16). */
export const BLITZ_SECONDS = 45;

/** Spickzettel: kostet einmal je Runde 3 XP (legacy quiz.js:168-173). */
export const PEEK_XP = 3;

/** Erlaubte Ergebnisse einer Antwort. Alles andere ist ein Fehler im Fragetyp. */
export const OUTCOMES = new Set(['ok', 'almost', 'bad']);
