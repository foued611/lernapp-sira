// Fehler-Abruf in Apps, deren Fragen alle dasselbe Etikett tragen: genau die falsche Aufgabe kommt wieder, nicht irgendeine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../helfer/index.js';
import { buildConfig } from '../../inhalte/index.js';
import { skillOf } from '../../runde/index.js';
import { appDefaults, profileDefaults, startRound } from '../../seiten/ablauf.js';
import { logicFor, paketVon } from './laden.js';

// Spielt die Runde richtig durch und sammelt, was gefragt wurde.
function skillsPlayed(round) {
  const skills = [];
  for (let guard = 0; guard < 50 && round.current(); guard += 1) {
    const q = round.current().question;
    if (!q.retry) skills.push(q.skill);
    round.submit(q.kind === 'type' ? { text: q.answer } : { pick: q.answer });
    round.next();
  }
  return skills;
}

for (const id of ['englisch', 'decouvertes-2', 'biologie', 'physik']) {
  test(`ABRUF: ${id} holt die falsche Aufgabe in die nächste Lektion`, () => {
    const paket = paketVon(id);
    const config = buildConfig(paket, logicFor(id));
    const unit = config.units.find((u) => !u.verbs);
    const item = paket.data.items[unit.id].at(-1);
    const app = { ...appDefaults(), missed: { [unit.id]: [skillOf(item)] } };
    for (let seed = 1; seed <= 25; seed += 1) {
      const started = startRound({ config, mode: 'lesson', unit, app, profile: profileDefaults(), rng: createRng(seed) });
      assert.equal(started.ok, true);
      assert.ok(skillsPlayed(started.round).includes(skillOf(item)), `Seed ${seed}: Aufgabe fehlt`);
    }
  });
}

test('ABRUF: Aufgaben einer Seite tragen genug verschiedene skill-Werte', () => {
  const { manifest, data } = paketVon('englisch');
  const items = data.items[manifest.units[0].id];
  assert.ok(new Set(items.map(skillOf)).size > items.length / 3);
});
