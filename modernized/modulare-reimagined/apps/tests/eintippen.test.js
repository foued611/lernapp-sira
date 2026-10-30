// Eintippen über alle Apps mit Aufgabenlisten: Die Lektionsrunde tippt die Hälfte, soweit die Seite eintippbare Lücken hat.
// Verbseiten bauen ihre Runde selbst, sie zählen hier nicht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConfig } from '../../inhalte/index.js';
import { createRng } from '../../helfer/index.js';
import { TYPED_PER_LESSON, isTypeable } from '../../runde/index.js';
import { chapterQuestions } from '../../seiten/ablauf.js';
import { LIVE } from '../../seiten/registry.js';
import { APPS, logicFor, paketVon } from './laden.js';

const WIEDERHOLUNGEN = 20;

for (const entry of APPS.filter((e) => e.status === LIVE && paketVon(e.id).data.items)) {
  const paket = paketVon(entry.id);
  const config = buildConfig(paket, logicFor(entry.id));
  const seiten = config.units.filter((unit) => !unit.verbs);

  test(`EINTIPPEN: ${entry.id} tippt je Seite so viel, wie eintippbare Lücken da sind`, () => {
    for (const unit of seiten) {
      const möglich = paket.data.items[unit.id].filter(isTypeable);
      // Eine Vokabel-Runde fragt 8 verschiedene Wörter. Es zählen also die Wörter, nicht die Aufgaben.
      const woerter = new Set(möglich.map((item) => item.w ?? item));
      const erwartet = Math.min(TYPED_PER_LESSON, woerter.size);
      for (let seed = 1; seed <= WIEDERHOLUNGEN; seed += 1) {
        const runde = config.rounds.lesson(unit, createRng(seed));
        assert.equal(runde.filter((q) => q.kind === 'type').length, erwartet, `${unit.id}, Seed ${seed}`);
      }
    }
  });

  // Der Kapitel-Test nimmt die vorderen Fragen jeder Lektionsrunde. Stünden die Eingabefragen vorn, wäre er fast nur Tippen.
  test(`EINTIPPEN: ${entry.id} tippt im Kapitel-Test nicht mehr als in der Lektion`, () => {
    const lesson = (unit, rng) => config.rounds.lesson(unit, rng);
    const kapitel = config.units.filter((unit) => !unit.verbs).slice(0, 5);
    let getippt = 0;
    for (let seed = 1; seed <= WIEDERHOLUNGEN * 5; seed += 1) {
      getippt += chapterQuestions(kapitel, lesson, 10, createRng(seed)).filter((q) => q.kind === 'type').length;
    }
    assert.ok(getippt / (WIEDERHOLUNGEN * 5 * 10) <= 0.6, `Anteil ${getippt / (WIEDERHOLUNGEN * 5 * 10)}`);
  });

  test(`EINTIPPEN: ${entry.id} tippt keine Antwort über zwei Wörter`, () => {
    const lang = (q) => q.kind === 'type' && q.answer.trim().split(/\s+/).length > 2;
    for (let seed = 1; seed <= WIEDERHOLUNGEN; seed += 1) {
      const rng = createRng(seed);
      for (const unit of seiten) assert.equal(config.rounds.lesson(unit, rng).filter(lang).length, 0, unit.id);
      assert.equal(config.rounds.boss(rng).filter(lang).length, 0, `Endgegner, Seed ${seed}`);
    }
  });
}
