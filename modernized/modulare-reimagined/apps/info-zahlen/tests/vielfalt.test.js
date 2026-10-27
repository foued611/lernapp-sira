// Zahlenwerkstatt: eine Übungsrunde enthält keine Aufgabe zweimal (Rückmeldung zur Vielfalt).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { init, lessonRound, quickRound, bossRound } from '../builders.js';
import { questionKey } from '../../../runde/index.js';
import { paketVon } from '../../tests/laden.js';

test('Lektion, Kurzrunde und Endgegner: keine Dubletten', () => {
  const { manifest } = paketVon('info-zahlen');
  init({ manifest });
  for (const unit of manifest.units) {
    for (let seed = 1; seed <= 150; seed++) {
      const qs = lessonRound(unit, createRng(seed * 31 + unit.id.length));
      assert.equal(new Set(qs.map(questionKey)).size, qs.length, `${unit.id}, Seed ${seed}`);
    }
  }
  for (let seed = 1; seed <= 150; seed++) {
    const quick = quickRound(createRng(seed));
    assert.equal(new Set(quick.map(questionKey)).size, quick.length, `Kurzrunde, Seed ${seed}`);
    const boss = bossRound(createRng(seed));
    assert.equal(new Set(boss.map(questionKey)).size, boss.length, `Endgegner, Seed ${seed}`);
  }
});
