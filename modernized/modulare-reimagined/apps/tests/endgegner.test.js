// RULE-206 über alle Live-Apps: Der Endgegner ist frei, wenn jede Seite mindestens einen Stern hat. Die Apps haben
// keine eigene Freischaltung (Legacy hat keine), deshalb gilt die Regel aus seiten/rahmen.js für alle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig } from '../../inhalte/index.js';
import { createRng } from '../../helfer/index.js';
import { answerAndNext, correctResponse } from '../../runde/tests/helpers.js';
import { appDefaults, bossOpen, profileDefaults, startRound } from '../../seiten/ablauf.js';
import { LIVE } from '../../seiten/registry.js';
import { APPS, logicFor, paketVon } from './laden.js';

for (const entry of APPS.filter((e) => e.status === LIVE)) {
  test(`RULE-206: ${entry.id} öffnet den Endgegner erst, wenn jede Seite einen Stern hat`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    const ids = config.units.map((u) => u.id);
    const profile = profileDefaults();
    const alle = { stars: Object.fromEntries(ids.map((id) => [id, 1])) };
    const eineFehlt = { stars: Object.fromEntries(ids.slice(1).map((id) => [id, 3])) };
    assert.equal(bossOpen({ app: alle, unitIds: ids, bossUnlocked: config.bossUnlocked, profile }), true);
    assert.equal(bossOpen({ app: eineFehlt, unitIds: ids, bossUnlocked: config.bossUnlocked, profile }), false);
  });
}

// Zu welcher Seite gehört eine Frage? Die Erklärung (why) steht je Aufgabe im Inhalt.
const seiteVon = (items) => new Map(Object.entries(items).flatMap(([unit, list]) => list.map((item) => [item.why, unit])));

for (const entry of APPS.filter((e) => e.status === LIVE && paketVon(e.id).data.items)) {
  test(`ENDGEGNER: ${entry.id} fragt über mehrere Runden jede Seite ab`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    const items = paketVon(entry.id).data.items;
    const seiten = seiteVon(items);
    const getroffen = new Set();
    for (let seed = 1; seed <= 300; seed++) {
      for (const frage of config.rounds.boss(createRng(seed))) getroffen.add(seiten.get(frage.why));
    }
    assert.deepEqual(Object.keys(items).filter((unit) => !getroffen.has(unit)), []);
  });

  test(`SCHNELLRUNDE: ${entry.id} fragt nur Seiten ab, die schon geübt sind`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    const items = paketVon(entry.id).data.items;
    const seiten = seiteVon(items);
    const unit = config.units.find((u) => items[u.id]);
    const app = { ...appDefaults(), stars: { [unit.id]: 1 } };
    for (let seed = 1; seed <= 20; seed++) {
      const start = startRound({ config, mode: 'quick', app, profile: profileDefaults(), rng: createRng(seed) });
      assert.equal(start.ok, true, start.message);
      assert.equal(seiten.get(start.round.current().question.why), unit.id);
    }
    for (let seed = 1; seed <= 50; seed++) {
      for (const frage of config.rounds.quick(createRng(seed), [unit])) assert.equal(seiten.get(frage.why), unit.id);
    }
    if (!unit.verbs) for (let seed = 1; seed <= 50; seed++) assert.equal(seiten.get(config.blitz(createRng(seed), [unit]).why), unit.id);
  });
}

// Diese Apps erzeugen ihre Aufgaben im Code. Die Etiketten zeigen, wie breit eine Runde zieht.
for (const id of ['mathe', 'geometrie', 'info-zahlen']) {
  test(`SCHNELLRUNDE: ${id} fragt nur Seiten ab, die schon geübt sind`, () => {
    const config = buildConfig(paketVon(id), logicFor(id));
    const etiketten = (seiten) => new Set(Array.from({ length: 200 }, (_, seed) => config.rounds.quick(createRng(seed + 1), seiten).map((q) => q.label)).flat());
    const alle = etiketten(config.units);
    const eine = etiketten([config.units[0]]);
    assert.ok(eine.size < alle.size, `${eine.size} von ${alle.size}`);
    assert.ok([...eine].every((label) => alle.has(label)));
  });

  test(`BLITZ: ${id} fragt nur Seiten ab, die schon geübt sind`, () => {
    const config = buildConfig(paketVon(id), logicFor(id));
    const etiketten = (seiten) => new Set(Array.from({ length: 300 }, (_, seed) => config.blitz(createRng(seed + 1), seiten).label));
    const alle = etiketten(config.units);
    const eine = etiketten([config.units[0]]);
    assert.ok(eine.size < alle.size, `${eine.size} von ${alle.size}`);
  });
}

for (const entry of APPS.filter((e) => e.status === LIVE)) {
  test(`BLITZ: ${entry.id} liefert aus jeder einzelnen Seite Auswahlfragen`, () => {
    const config = buildConfig(paketVon(entry.id), logicFor(entry.id));
    for (const unit of config.units) {
      for (let seed = 1; seed <= 20; seed++) assert.equal(config.blitz(createRng(seed), [unit]).kind, 'choice', unit.id);
    }
  });
}

test('SCHNELLRUNDE: ohne geübte Seite startet sie nicht und sagt warum', () => {
  const config = buildConfig(paketVon('mathe'), logicFor('mathe'));
  const start = startRound({ config, mode: 'quick', app: appDefaults(), profile: profileDefaults(), rng: createRng(1) });
  assert.equal(start.ok, false);
  assert.match(start.message, /Seite/);
});

test('REIHENFOLGE: Eine Physik-Lektion läuft von leicht nach schwer', () => {
  const config = buildConfig(paketVon('physik'), logicFor('physik'));
  const app = { ...appDefaults(), stars: Object.fromEntries(config.units.map((u) => [u.id, 1])) };
  const levels = (mode, seed) => {
    const start = startRound({ config, mode, unit: config.units[0], app, profile: profileDefaults(), rng: createRng(seed) });
    return Array.from({ length: start.round.current().total }, () => {
      const { question } = start.round.current();
      answerAndNext(start.round, correctResponse(question));
      return question.level ?? 2;
    });
  };
  const aufsteigend = (list) => list.every((level, i) => i === 0 || list[i - 1] <= level);
  const seeds = Array.from({ length: 20 }, (_, i) => i + 1);
  assert.ok(seeds.every((seed) => aufsteigend(levels('lesson', seed))));
  assert.ok(seeds.some((seed) => new Set(levels('lesson', seed)).size > 1), 'Die Runden mischen die Stufen');
});
