// Baut aus Inhalten (Bundle, Daten) und Logik (Fragen-Erzeuger, Diagramme, Sonderseiten) die App-Konfiguration,
// die shell.js erwartet (App-Vertrag, siehe AGENTS.md). Reine Funktion, deshalb in Node testbar.
import { assertBundle } from './validate.js';
import { evaluateRule } from './rules.js';
import { renderDefaultTheory } from './theory.js';

/**
 * Logik einer App:
 *   rounds    { lesson(unit), quick?(), boss?() }   Fragen-Erzeuger
 *   blitz?    () => Frage
 *   diagrams? { name: (...args) => svg-Text }        Bilder, auf die Lektionen per Namen verweisen
 *   init?     ({ data, manifest }) => void           bekommt die Daten, bevor Fragen entstehen
 *   theory?   (box, unit, ctx) => void               Sonderseite statt der Standard-Theorie
 *   bossUnlocked? (ctx) => boolean
 */
export function resolveFigure(figure, diagrams = {}, where = '') {
  if (figure.svg) return figure;
  const { name, args = [] } = figure.diagram;
  if (typeof diagrams[name] !== 'function') throw new Error(`Diagramm "${name}" gibt es nicht${where ? ` (${where})` : ''}`);
  return { svg: diagrams[name](...args), caption: figure.caption };
}

export function buildConfig(bundle, logic) {
  assertBundle(bundle);
  const { manifest, badges, data } = bundle;
  if (logic.init) logic.init({ data, manifest });
  const lessons = Object.fromEntries(Object.entries(bundle.lessons).map(([id, spec]) => [id, { ...spec, figure: resolveFigure(spec.figure, logic.diagrams, id) }]));
  const notes = manifest.notes || {};
  const view = { lessons, notes, data, manifest };
  const render = logic.theory || renderDefaultTheory;
  return {
    id: manifest.id,
    title: manifest.title,
    greeting: manifest.greeting,
    intro: manifest.intro,
    bossTitle: manifest.bossTitle,
    words: manifest.words,
    inputChars: manifest.inputChars,
    dashboardHref: manifest.dashboardHref,
    units: manifest.units,
    lessons,
    notes,
    data,
    theory: (box, unit, api) => render(box, unit, { ...view, ...api }),
    rounds: logic.rounds,
    blitz: logic.blitz,
    bossUnlocked: logic.bossUnlocked,
    badges: badges.map((b) => ({ id: b.id, n: b.n, d: b.d, rule: b.rule, when: (state, result) => evaluateRule(b.rule, state, result, manifest.units) }))
  };
}
