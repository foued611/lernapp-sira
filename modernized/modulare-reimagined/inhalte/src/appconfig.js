// Baut aus Inhalten (Bundle) und Logik (Fragen-Erzeuger, Diagramme, Sonderseiten) das App-Konfigurationsobjekt.
// Legacy-Vorlage: core/js/appconfig.js (der reine Teil). Ohne Browser-Code, deshalb in Node testbar.
//
// Die Auswertung der Trophäen-Regeln (regeln/) und die Standard-Theorie (components/) kommen injiziert.
// Dieses Modul importiert sie nicht. So bleibt die Grenze zwischen Inhalt und Darstellung sauber.
import { assertBundle } from './bundle.js';

/**
 * Logik einer App (siehe AGENTS.md, App-Vertrag):
 *   create    ({ data, manifest }) => { rounds, blitz?, diagrams?, Theory? }. Baut die Erzeuger für genau dieses Paket und hält
 *             keinen Stand im Modul. So können zwei Apps dieselbe Logik mit anderem Inhalt nutzen (Klasse 7 und 8).
 *   rounds    { lesson(unit), quick?(), boss?() }
 *   blitz?    () => Frage
 *   diagrams? { name: (...args) => svg-Text }
 *   theory?   (box, unit, ctx) => void (Legacy-Form, im Neubau nicht genutzt)
 *   Theory?   React-Komponente { unit, config, onStart } für eine eigene Theorieseite (Spielzeuge). Fehlt sie, zeigt der Rahmen die Standardseite.
 *   bossUnlocked? (state) => boolean
 */

/** Ersetzt einen Diagramm-Verweis { diagram: { name, args } } durch fertiges svg. Fehlt das Diagramm, bricht es laut ab. */
export function resolveFigure(figure, diagrams = {}, where = '') {
  if (figure.svg) return figure;
  const { name, args = [] } = figure.diagram;
  if (typeof diagrams[name] !== 'function') throw new Error(`Diagramm "${name}" gibt es nicht${where ? ` (${where})` : ''}`);
  return { svg: diagrams[name](...args), caption: figure.caption };
}

/**
 * deps.evaluateRule(rule, state, result, units) aus regeln/ und deps.renderDefaultTheory(box, unit, ctx)
 * aus components/. Fehlt eine, meldet der Aufruf das klar, statt still falsch zu werden.
 */
export function buildConfig(bundle, logic, deps = {}) {
  assertBundle(bundle);
  const { manifest, badges, data } = bundle;
  // create bekommt die Daten, bevor die erste Runde entsteht (AGENTS.md). Erzeuger lesen daraus, nie per Import.
  const app = logic.create ? { ...logic, ...logic.create({ data, manifest }) } : logic;
  const lessons = Object.fromEntries(
    Object.entries(bundle.lessons).map(([id, spec]) => [id, { ...spec, figure: resolveFigure(spec.figure, app.diagrams, id) }])
  );
  const notes = manifest.notes ?? {};
  const view = { lessons, notes, data, manifest };
  return {
    id: manifest.id,
    title: manifest.title,
    greeting: manifest.greeting,
    intro: manifest.intro,
    bossTitle: manifest.bossTitle,
    words: manifest.words,
    inputChars: manifest.inputChars,
    dashboardHref: manifest.dashboardHref,
    tracks: manifest.tracks ?? {},
    units: manifest.units,
    groups: manifest.groups ?? [],
    resources: manifest.resources ?? [],
    lessons,
    notes,
    data,
    theory: (box, unit, api) => {
      const render = app.theory ?? deps.renderDefaultTheory;
      if (!render) throw new Error('Keine Theorie-Ansicht: app.theory fehlt und renderDefaultTheory wurde nicht injiziert');
      return render(box, unit, { ...view, ...api });
    },
    Theory: app.Theory ?? null,
    rounds: app.rounds,
    blitz: app.blitz,
    bossUnlocked: app.bossUnlocked,
    badges: badges.map((b) => ({
      id: b.id,
      n: b.n,
      d: b.d,
      rule: b.rule,
      when: (state, result) => {
        if (!deps.evaluateRule) throw new Error('Trophäen-Auswertung nicht injiziert (evaluateRule fehlt)');
        // regeln erwartet Seiten-IDs (trophies.js: anyUnit prüft unitIds), nicht die Seiten-Objekte.
        return Boolean(deps.evaluateRule(b.rule, state, result, manifest.units.map((u) => u.id)));
      }
    }))
  };
}
