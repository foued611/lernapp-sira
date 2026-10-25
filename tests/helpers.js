// Gemeinsame Prüfungen für alle Apps. Beschreibt den App-Vertrag aus AGENTS.md als ausführbaren Test.
import assert from 'node:assert/strict';
import { validateQuestion } from '../core/js/qtypes.js';

export function assertValidQuestion(q) {
  validateQuestion(q, assert);
}

/** Prüft eine App-Konfiguration gegen den App-Vertrag. */
export function assertValidConfig(config, { rounds = 20 } = {}) {
  assert.ok(config.id && /^[a-z0-9-]+$/.test(config.id), 'id: Kleinbuchstaben, Ziffern, Bindestrich');
  assert.ok(config.title, 'title fehlt');
  assert.ok(Array.isArray(config.units) && config.units.length > 0, 'units fehlen');
  assert.equal(new Set(config.units.map((u) => u.id)).size, config.units.length, 'unit-IDs eindeutig');
  config.units.forEach((u) => ['id', 'title', 'de', 'ic', 'color'].forEach((k) => assert.ok(u[k], `unit.${k} fehlt bei ${u.id}`)));
  assert.equal(typeof config.theory, 'function', 'theory muss eine Funktion sein');
  assert.ok(config.lessons && config.units.every((u) => config.lessons[u.id]), 'lessons: jede Seite braucht eine Lektion');
  assert.equal(typeof config.rounds.lesson, 'function', 'rounds.lesson fehlt');
  assert.ok(Array.isArray(config.badges) && config.badges.length > 0, 'badges fehlen');
  assert.equal(new Set(config.badges.map((b) => b.id)).size, config.badges.length, 'badge-IDs eindeutig');
  config.badges.forEach((b) => ['id', 'n', 'd'].forEach((k) => assert.ok(b[k], `badge.${k} fehlt`)));
  config.badges.forEach((b) => assert.equal(typeof b.when, 'function', `badge.when fehlt bei ${b.id}`));

  for (let i = 0; i < rounds; i++) {
    for (const unit of config.units) {
      const round = config.rounds.lesson(unit);
      assert.ok(round.length >= 3, `Runde zu kurz bei ${unit.id}`);
      round.forEach(assertValidQuestion);
    }
    for (const mode of ['boss', 'quick']) {
      if (config.rounds[mode]) config.rounds[mode]().forEach(assertValidQuestion);
    }
    if (config.blitz) {
      const q = config.blitz();
      assert.equal(q.kind, 'choice', 'Blitz braucht Auswahlfragen');
      assertValidQuestion(q);
    }
  }
}

/** Prüft eine Lektionsbeschreibung (core/js/lesson.js). Die Diagramme müssen gültiges XML sein. */
export async function assertValidLesson(spec, name = 'Lektion') {
  const { JSDOM } = await import('jsdom');
  assert.ok(spec.goal && spec.goal.length > 15, `${name}: goal fehlt`);
  assert.ok(Array.isArray(spec.tldr) && spec.tldr.length >= 2 && spec.tldr.length <= 4, `${name}: tldr braucht 2 bis 4 Sätze`);
  assert.ok(spec.analogy && spec.analogy.title && spec.analogy.html, `${name}: analogy fehlt`);
  assert.ok(spec.figure && spec.figure.caption && spec.figure.svg.startsWith('<svg'), `${name}: figure fehlt`);
  new JSDOM(spec.figure.svg, { contentType: 'image/svg+xml' }); // wirft bei fehlerhaftem XML
  assert.ok(/role="img"/.test(spec.figure.svg) && /aria-label="[^"]{10,}"/.test(spec.figure.svg), `${name}: Diagramm braucht eine Beschreibung (aria-label)`);
  assert.ok(spec.steps && spec.steps.items.length >= 3, `${name}: Beispiel braucht mindestens 3 Schritte`);
  assert.ok(spec.pitfall && spec.pitfall.html, `${name}: pitfall fehlt`);
  assert.ok(spec.rule, `${name}: rule fehlt`);
  const ids = spec.check.options.map((o) => o.id);
  assert.ok(spec.check.q && ids.length >= 3 && ids.includes(spec.check.answer) && new Set(ids).size === ids.length, `${name}: check ungültig`);
  assert.ok(spec.check.why, `${name}: check.why fehlt`);
}
