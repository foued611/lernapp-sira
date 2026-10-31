// Die echten Apps laufen durch den Rahmen: Inhaltspaket und Logik werden gebaut, dann startet eine Runde jeder Art.
// Prüft die Verdrahtung (Zufall wird bis in die Erzeuger durchgereicht), nicht die Aufgaben selbst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig } from '../../inhalte/index.js';
import { createRng } from '../../helfer/index.js';
import { appDefaults, profileDefaults, startRound } from '../../seiten/ablauf.js';
import { logicFor, paketVon } from './laden.js';

for (const id of ['deutsch', 'geometrie']) {
  test(`ANBINDUNG: ${id} startet Lektion, Schnellrunde und Endgegner durch den Rahmen`, () => {
    const config = buildConfig(paketVon(id), logicFor(id));
    const app = { ...appDefaults(), stars: Object.fromEntries(config.units.map((u) => [u.id, 1])) };
    const profile = profileDefaults();

    const lektion = startRound({ config, mode: 'lesson', unit: config.units[0], app, profile, rng: createRng(5) });
    assert.equal(lektion.ok, true, lektion.message);
    assert.equal(lektion.round.current().total, 8);

    const schnell = startRound({ config, mode: 'quick', app, profile, rng: createRng(6) });
    assert.equal(schnell.ok, true, schnell.message);
    assert.equal(schnell.round.current().total, 5);

    const boss = startRound({ config, mode: 'boss', app, profile, rng: createRng(7) });
    assert.equal(boss.ok, true, boss.message);
    assert.equal(boss.round.current().total, 12);
  });
}

test('ANBINDUNG: Gleicher Seed startet dieselbe Runde', () => {
  const config = buildConfig(paketVon('deutsch'), logicFor('deutsch'));
  const app = appDefaults();
  const profile = profileDefaults();
  // Über JSON verglichen: Eingabefragen tragen eine eigene Prüffunktion, die nie dieselbe Referenz hat.
  const start = () => JSON.stringify(startRound({ config, mode: 'lesson', unit: config.units[2], app, profile, rng: createRng(11) }).round.current().question);
  assert.equal(start(), start());
});

test('ANBINDUNG: eine Seite ohne Logik meldet, statt zu starten', () => {
  const config = buildConfig(paketVon('deutsch'), logicFor('deutsch'));
  const ohne = { ...config, rounds: undefined };
  const result = startRound({ config: ohne, mode: 'quick', app: appDefaults(), profile: profileDefaults(), rng: createRng(1) });
  assert.equal(result.ok, false);
  assert.ok(result.message);
});
