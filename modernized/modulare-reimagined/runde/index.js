// Öffentliche Schnittstelle des Dienstes runde. Andere Teile importieren nur von hier.
// Der Dienst kennt keinen Speicher, kein DOM und keinen Zufall außer dem übergebenen rng.
export { createRound } from './src/round.js';
export { withMissed } from './src/abruf.js';
export { createBlitz } from './src/blitz.js';
export { choiceQuestion, typedQuestion, matchQuestion, option } from './src/questions.js';
export { createPool, isGap, logicOf, poolApp, skillOf } from './src/pool.js';
export { esc, normalise, stripAccents } from './src/text.js';
export { compareTyped } from './src/check.js';
export { questionKey, uniqueQuestions, distinctQuestions, distinctSlots, freshPool } from './src/vielfalt.js';
export { HEARTS, XP, BLITZ_SECONDS, PEEK_XP } from './src/rules.js';
