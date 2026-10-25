// Gemeinsame Prüfungen für alle Apps. Beschreibt den App-Vertrag aus AGENTS.md als ausführbaren Test.
import assert from 'node:assert/strict';

export function assertValidQuestion(q) {
  assert.ok(['choice', 'type', 'match'].includes(q.kind), `kind: ${q.kind}`);
  assert.ok(q.label, 'label fehlt');
  if (q.kind === 'choice') {
    const ids = q.options.map((o) => o.id);
    assert.ok(ids.includes(q.answer), `Antwort fehlt in den Optionen: ${q.label}`);
    assert.equal(new Set(ids).size, ids.length, 'Optionen müssen eindeutig sein');
    assert.ok(ids.length >= 2 && ids.length <= 4, 'zwei bis vier Optionen');
    if (q.prompt && q.prompt.includes('{{blank}}')) assert.ok(q.options.every((o) => o.fill !== undefined), 'Lücke braucht fill');
  }
  if (q.kind === 'type') {
    assert.ok(q.answer, 'answer fehlt');
    if (q.check) assert.equal(q.check(q.answer), 'ok', 'die richtige Antwort muss ok sein');
  }
  if (q.kind === 'match') {
    assert.equal(q.left.length, q.right.length);
    assert.equal(q.left.length, q.leftValues.length);
    assert.deepEqual([...q.leftValues].sort(), q.right.map((r) => r.value).sort());
  }
}

/** Prüft eine App-Konfiguration gegen den App-Vertrag. */
export function assertValidConfig(config, { rounds = 20 } = {}) {
  assert.ok(config.id && /^[a-z0-9-]+$/.test(config.id), 'id: Kleinbuchstaben, Ziffern, Bindestrich');
  assert.ok(config.title, 'title fehlt');
  assert.ok(Array.isArray(config.units) && config.units.length > 0, 'units fehlen');
  assert.equal(new Set(config.units.map((u) => u.id)).size, config.units.length, 'unit-IDs eindeutig');
  config.units.forEach((u) => ['id', 'title', 'de', 'ic', 'color'].forEach((k) => assert.ok(u[k], `unit.${k} fehlt bei ${u.id}`)));
  assert.equal(typeof config.theory, 'function', 'theory muss eine Funktion sein');
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
