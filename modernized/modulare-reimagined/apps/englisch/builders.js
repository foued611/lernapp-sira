// Englisch-Werkstatt: Aufgaben wie in jeder Pool-App (runde/src/pool.js), dazu Vokabel-Seiten. Dort trägt jede Aufgabe ihr Wort in w.
// Herkunft: legacy apps/englisch/builders.js. Zufall kommt immer als rng herein (AGENTS.md), ohne rng gibt es keine Aufgabe.
import { createPool, isGap } from '../../runde/index.js';
import { pick, shuffle } from '../../helfer/index.js';

// Eine Aufgabe aus der Gruppe eines Worts. Auf Wunsch eine Lückenaufgabe, damit die Schreibweise geübt wird.
const itemOf = (group, wantGap, rng) => {
  const gaps = group.filter(isGap);
  return wantGap && gaps.length ? gaps[0] : pick(group, rng);
};

/** Erzeuger für ein Inhaltspaket. Der Stand liegt hier, nicht im Modul. */
export function createBuilders(paket) {
  const pool = createPool(paket);
  const { units, items, choice, typed, pickItems } = pool;
  const isVocab = (unitId) => items[unitId].some((item) => item.w !== undefined);

  // Aufgaben einer Vokabel-Seite, nach Wort gruppiert.
  const byWord = (unitId) => {
    const groups = new Map();
    for (const item of items[unitId]) {
      if (!groups.has(item.w)) groups.set(item.w, []);
      groups.get(item.w).push(item);
    }
    return [...groups.values()];
  };

  /** Die 8 Aufgaben einer Vokabel-Runde: 8 verschiedene Wörter, an jedem dritten Platz ein Wort mit Lücke (Schreibübung). */
  function lessonPicks(unit, rng) {
    const words = shuffle(byWord(unit.id), rng);
    return Array.from({ length: 8 }, (_, i) => {
      const wantGap = i % 3 === 2;
      const at = wantGap ? Math.max(0, words.findIndex((group) => group.some(isGap))) : 0;
      return itemOf(words.splice(at, 1)[0], wantGap, rng);
    });
  }

  /** 8 Fragen einer Seite, jede dritte Lücke zum Eintippen. Vokabel-Seiten fragen 8 verschiedene Wörter. */
  function lessonRound(unit, rng) {
    if (isVocab(unit.id)) return lessonPicks(unit, rng).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));
    return pickItems(unit.id, 8, rng).map((item, i) => (i % 3 === 2 && isGap(item) ? typed(item) : choice(item, rng)));
  }

  // Endgegner: 12 Fragen aus 12 verschiedenen, zufällig gewählten Seiten (Grammatik und Vokabeln), jede vierte zum Eintippen.
  const bossRound = (rng) => shuffle(units, rng).slice(0, 12).map((unit, i) => {
    const wantGap = i % 4 === 3;
    let item;
    if (isVocab(unit.id)) {
      const groups = byWord(unit.id);
      item = itemOf(pick(wantGap ? groups.filter((group) => group.some(isGap)) : groups, rng), wantGap, rng);
    } else {
      item = pick(items[unit.id], rng);
    }
    return wantGap && isGap(item) ? typed(item) : choice(item, rng);
  });

  return { ...pool, lessonPicks, lessonRound, bossRound };
}
