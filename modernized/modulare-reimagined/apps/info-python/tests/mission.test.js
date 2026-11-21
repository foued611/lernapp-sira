// Missionen: Jede Musterlösung muss laufen, ihre eigene Prüfung bestehen und die Pflichtwörter enthalten. Der Startcode und
// leere oder falsche Antworten dürfen nicht bestehen. So fällt eine Mission auf, die man ohne Aufgabe lösen könnte.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runProgram } from '../python-mini.js';
import { checkMission, missionsOf } from '../mission.js';
import { paketVon } from '../../tests/laden.js';

const paket = paketVon('info-python');
const MISSIONS = paket.data.missions;
const UNITS = paket.manifest.units;

test('Jede Seite hat mindestens vier Missionen mit Stufen von leicht nach schwer', () => {
  for (const unit of UNITS) {
    const list = missionsOf(paket.data, unit.id);
    assert.ok(list.length >= 4, `${unit.id}: ${list.length} Missionen`);
    const levels = list.map((m) => m.level);
    assert.deepEqual(levels, [...levels].sort((a, b) => a - b), `${unit.id}: Stufen steigen nicht`);
    assert.ok(levels.every((l) => [1, 2, 3].includes(l)));
    assert.ok(Math.max(...levels) >= 2, `${unit.id}: keine schwierigere Mission`);
  }
});

test('Missionen: eindeutige Kennungen, bekannte Seiten, alle Felder', () => {
  const ids = MISSIONS.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const m of MISSIONS) {
    assert.ok(UNITS.some((u) => u.id === m.unit), m.id);
    for (const f of ['title', 'task', 'hint', 'solution']) assert.ok(String(m[f]).trim().length > 4, `${m.id}: ${f}`);
    assert.ok(m.id.startsWith(`${m.unit}-`), `${m.id}: Kennung beginnt mit der Seite`);
    if (m.kind === 'print') assert.ok(Array.isArray(m.expect) && m.expect.length, `${m.id}: expect fehlt`);
  }
});

for (const m of MISSIONS) {
  test(`Mission ${m.id}: Lösung besteht, Startcode und Leeres bestehen nicht`, () => {
    const solved = runProgram(m.solution);
    assert.equal(solved.error, null, `Musterlösung fehlerhaft: ${solved.error?.message}`);
    const verdict = checkMission(m, m.solution);
    assert.equal(verdict.ok, true, `${m.id}: ${verdict.text}`);
    assert.equal(checkMission(m, '').ok, false, 'leerer Code darf nicht bestehen');
    assert.equal(checkMission(m, m.start ?? '').ok, false, 'der Startcode allein darf nicht bestehen');
    assert.equal(checkMission(m, 'forwad(1)').status, 'fehler');
  });
}

test('Pflichtwörter: Ein richtiges Bild ohne for gilt bei Schleifen-Missionen nicht', () => {
  const m = MISSIONS.find((x) => x.id === 'schleifen-quadrat-schleife');
  const ohne = 'forward(80)\nleft(90)\nforward(80)\nleft(90)\nforward(80)\nleft(90)\nforward(80)\nleft(90)';
  const v = checkMission(m, ohne);
  assert.equal(v.ok, false);
  assert.equal(v.status, 'regel');
  assert.match(v.text, /for/);
  assert.equal(checkMission(m, m.solution.replace('range(4)', 'range(4)  ')).ok, true, 'Leerzeichen zählen nicht');
});

test('Rückmeldungen: Ausgabe, zu wenig, zu viel', () => {
  const hallo = MISSIONS.find((x) => x.id === 'python-start-hallo-welt');
  assert.equal(checkMission(hallo, 'print("hallo welt")').status, 'ausgabe');
  assert.equal(checkMission(hallo, 'x = 1').status, 'leer');
  const linie = MISSIONS.find((x) => x.id === 'turtle-start-linie');
  assert.equal(checkMission(linie, 'forward(50)').status, 'fehlt');
  assert.equal(checkMission(linie, 'forward(100)\nforward(50)').status, 'zuviel');
  assert.equal(checkMission(linie, 'penup()\nforward(100)').status, 'leer');
});
