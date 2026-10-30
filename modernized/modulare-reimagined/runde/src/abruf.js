// Fehler-Abruf (Spec 5.2): Aus dem Pool einer Lektionsrunde werden Fragen gezogen, und mindestens eine Frage aus
// den Fehlerkategorien der letzten Runde ist garantiert dabei. Die Kategorie ist q.skill, ohne Angabe das Etikett. "Garantiert dabei" heißt nicht "vorn": createRound
// mischt die Reihenfolge ohnehin. Zufall nur über rng.
// Die Garantie gilt nur für Kategorien, die im Pool vorkommen. Eine Kategorie, die die Aufgabenerzeuger nicht mehr liefern,
// kann nicht zurückkommen. Das ist gewollt: dann gibt es keine Frage, die man wiederholen könnte.
import { shuffle } from '../../helfer/index.js';

/**
 * @param {object[]} pool           Fragen mit skill oder label
 * @param {string[]} missedSkills   Kategorien der Fragen, die in der letzten Runde im ersten Versuch falsch waren
 * @param {number} size             Zahl der Fragen, die zurückkommen (ohne Zurücklegen)
 * @param {()=>number} rng          Zufall in [0, 1)
 * @returns {object[]}              höchstens size Fragen, neue Liste, der Pool bleibt unverändert
 */
export function withMissed(pool, missedSkills, size, rng) {
  if (typeof rng !== 'function') throw new TypeError('rng ist Pflicht, z. B. createRng(seed)');
  const skills = new Set(Array.isArray(missedSkills) ? missedSkills : []);
  const hits = (q) => skills.has(q.skill ?? q.label);
  const shuffled = shuffle(pool, rng);
  const picked = shuffled.slice(0, size);
  if (picked.length === 0 || picked.some(hits)) return picked;
  // Keine der gezogenen Fragen trifft. Die erste Treffer-Frage aus dem Rest ersetzt die letzte Ziehung.
  const hit = shuffled.slice(size).find(hits);
  if (hit) picked[picked.length - 1] = hit;
  return picked;
}
