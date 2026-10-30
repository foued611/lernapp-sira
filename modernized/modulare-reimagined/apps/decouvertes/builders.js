// Französisch-Werkstatt: Aufgaben wie in jeder Pool-App (runde/src/pool.js), dazu die Seiten des Cahier de Verbes.
// Seiten mit verbs kommen aus verben/builders.js, alle anderen aus data.items.
// Zufall kommt immer als rng herein (AGENTS.md), ohne rng gibt es keine Aufgabe.
import { createPool, isGap } from '../../runde/index.js';
import { pick } from '../../helfer/index.js';
import { createModel } from './verben/model.js';
import { createVerbBuilders } from './verben/builders.js';

/** Erzeuger für ein Inhaltspaket. Der Stand liegt hier, nicht im Modul. */
export function createBuilders(paket) {
  const pool = createPool(paket);
  const { units, items, choice, typed, lessonRound: itemRound } = pool;
  const model = createModel(paket);
  const verbs = createVerbBuilders(model);

  /** 8 Fragen einer Seite, jede dritte Lücke zum Eintippen. Verbseiten haben ihre eigene Runde. */
  const lessonRound = (unit, rng) => (unit.verbs ? verbs.lessonRound(unit, rng) : itemRound(unit, rng));

  // Eine Frage aus einer beliebigen Seite. Verbseiten liefern eine Verbfrage, die anderen eine Aufgabe aus data.items.
  const questionIn = (unit, rng) => (unit.verbs ? verbs.verbQuestion(unit, rng) : choice(pick(items[unit.id], rng), rng));

  const quickRound = (rng) => Array.from({ length: 5 }, () => questionIn(pick(units, rng), rng));
  // Blitz gibt immer Auswahl aus (Blitz hat keine Eingabe).
  const blitzQuestion = (rng) => {
    const unit = pick(units, rng);
    return unit.verbs ? verbs.verbBlitz(unit, rng) : choice(pick(items[unit.id], rng), rng);
  };

  // 12 Fragen, gleichmäßig über alle Seiten verteilt (sonst kämen die hinteren Seiten nie dran).
  const bossRound = (rng) => Array.from({ length: 12 }, (_, i) => {
    const unit = units[Math.floor((i * units.length) / 12)];
    if (unit.verbs) return verbs.verbQuestion(unit, rng);
    const item = pick(items[unit.id], rng);
    return i % 4 === 3 && isGap(item) ? typed(item) : choice(item, rng);
  });

  return { ...pool, model, verbs, lessonRound, quickRound, bossRound, blitzQuestion };
}
