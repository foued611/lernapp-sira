// Vertragstest für die Vorlage apps/_template: die Vorlage muss mit ihrem eigenen Lernstoff laufen, sonst ist sie
// kein Startpunkt für eine neue App (AGENTS.md: "Neue App anlegen").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import logic from '../logic.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('vorlage');
logic.init(paket);
const UNITS = paket.manifest.units;

test('VORLAGE: Runden und Blitz liefern gültige Fragen', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const rng = createRng(seed);
    assert.equal(logic.rounds.lesson(UNITS[seed % UNITS.length], rng).length, 8);
    assert.equal(logic.rounds.quick(rng).length, 5);
    assert.equal(logic.blitz(rng).kind, 'choice');
  }
});

test('VORLAGE: das Beispieldiagramm hat einen Alternativtext', () => {
  const element = logic.diagrams.boxDiagram('Test');
  assert.equal(element.props.role, 'img');
  assert.match(element.props['aria-label'], /Test/);
});
