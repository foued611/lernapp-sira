// Eine App-Logik hält keinen Stand im Modul. Zwei Pakete dürfen sich nicht stören, sonst zeigt Klasse 7 Aufgaben aus
// Klasse 8, sobald beide denselben Code nutzen. Geprüft über die Laufzeit: Runden vor und nach dem zweiten Paket vergleichen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../helfer/index.js';
import { buildConfig } from '../../inhalte/index.js';
import { APPS, LIVE } from '../../seiten/registry.js';
import { logicFor } from '../index.js';
import { paketVon } from './laden.js';

// Ein anderes Paket derselben App: Seiten und alle Listen in den Daten stehen umgekehrt.
const umgekehrt = (wert) => {
  if (Array.isArray(wert)) return wert.map(umgekehrt).reverse();
  if (wert && typeof wert === 'object') return Object.fromEntries(Object.entries(wert).map(([k, v]) => [k, umgekehrt(v)]));
  return wert;
};

const kanonisch = (fragen) => JSON.stringify(fragen, (_, v) => (typeof v === 'function' ? 'fn' : v));

function runden(config) {
  const unit = config.units[0];
  return kanonisch([
    config.rounds.lesson(unit, createRng(7)),
    config.rounds.quick ? config.rounds.quick(createRng(7)) : null,
    config.rounds.boss ? config.rounds.boss(createRng(7)) : null,
    config.blitz ? config.blitz(createRng(7)) : null,
    config.lessons[unit.id].figure.svg ?? null
  ]);
}

for (const { id, status } of APPS) {
  if (status !== LIVE) continue;
  test(`INSTANZEN: ${id} bleibt unverändert, wenn dieselbe Logik ein zweites Paket bekommt`, () => {
    const logic = logicFor(id);
    assert.equal(typeof logic.create, 'function', 'create fehlt');
    assert.equal(logic.init, undefined, 'init darf es nicht mehr geben');
    const paket = paketVon(id);
    const erstes = buildConfig(paket, logic);
    const vorher = runden(erstes);
    const anderes = paketVon(id);
    anderes.data = { ...anderes.data, ...umgekehrt(anderes.data) };
    anderes.manifest = { ...anderes.manifest, units: [...anderes.manifest.units].reverse() };
    logic.create({ data: anderes.data, manifest: anderes.manifest });
    assert.equal(runden(erstes), vorher);
  });
}

test('INSTANZEN: zwei Pakete derselben Logik liefern ihren eigenen Stoff', () => {
  const logic = logicFor('biologie');
  const paket = paketVon('biologie');
  const unit = paket.manifest.units[0];
  const nurEine = { ...paket.data, items: { ...paket.data.items, [unit.id]: paket.data.items[unit.id].slice(0, 1) } };
  const eins = logic.create({ data: nurEine, manifest: paket.manifest });
  const alle = logic.create({ data: paket.data, manifest: paket.manifest });
  const antworten = (app) => new Set(app.rounds.lesson(unit, createRng(1)).map((q) => q.answer));
  assert.equal(antworten(eins).size, 1);
  assert.ok(antworten(alle).size > 1);
});
