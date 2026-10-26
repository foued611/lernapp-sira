// Tests für Sterne, Trefferquote, Auffrischen und die Empfehlung für die nächste Übung.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRefreshDue, roundAccuracy, starsFor, weakestUnit } from '../src/progress.js';

const units = [{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }];

test('RULE-064: 3 Sterne ab 90 %, 2 ab 70 %, sonst 1', () => {
  assert.equal(starsFor(1.0, false), 3);
  assert.equal(starsFor(0.9, false), 3);
  assert.equal(starsFor(0.89, false), 2);
  assert.equal(starsFor(0.7, false), 2);
  assert.equal(starsFor(0.69, false), 1);
  assert.equal(starsFor(0.1, false), 1);
});

test('RULE-064: Eine gescheiterte Runde gibt 0 Sterne, auch bei hoher Quote', () => {
  assert.equal(starsFor(1.0, true), 0);
  assert.equal(starsFor(0.4, true), 0);
});

test('RULE-067: Wiederholungen zählen nicht, auch wenn sie richtig sind', () => {
  // Drei Fragen. Q1 falsch im Erstversuch, dann richtig in der Wiederholung. Q2 und Q3 richtig.
  const attempts = [
    { outcome: 'bad' },
    { outcome: 'ok' },
    { outcome: 'ok' },
    { outcome: 'ok', retry: true }
  ];
  assert.ok(Math.abs(roundAccuracy(attempts, 3) - 2 / 3) < 1e-9);
});

test('RULE-067: Eine knapp richtige Wiederholung zählt auch nicht halb', () => {
  const attempts = [{ outcome: 'bad' }, { outcome: 'ok' }, { outcome: 'almost', retry: true }];
  assert.equal(roundAccuracy(attempts, 2), 1 / 2);
});

test('RULE-069: richtig plus halb knapp, geteilt durch die Originalzahl (7 + 1 von 10 = 0,8)', () => {
  const attempts = [
    ...Array.from({ length: 7 }, () => ({ outcome: 'ok' })),
    ...Array.from({ length: 2 }, () => ({ outcome: 'almost' })),
    { outcome: 'bad' }
  ];
  assert.ok(Math.abs(roundAccuracy(attempts, 10) - 0.8) < 1e-9);
});

test('RULE-069: Unbeantwortete Fragen zählen als Fehler, der Nenner bleibt die Originalzahl', () => {
  // Fünf Fragen, nur zwei beantwortet, beide richtig: 2/5 statt 2/2.
  assert.equal(roundAccuracy([{ outcome: 'ok' }, { outcome: 'ok' }], 5), 0.4);
});

test('RULE-069: Eine Runde ohne Fragen ist kein gültiger Nenner', () => {
  assert.throws(() => roundAccuracy([], 0), RangeError);
});

test('RULE-194: Eine Seite ist nach 3 Tagen fällig, nach 2 Tagen noch nicht', () => {
  const app = { stars: { u1: 2 }, last: { u1: '2026-10-07' } };
  assert.equal(isRefreshDue(app, 'u1', '2026-10-09'), false);
  assert.equal(isRefreshDue(app, 'u1', '2026-10-10'), true);
});

test('RULE-194: Eine Seite ohne Sterne ist nie fällig', () => {
  const app = { stars: {}, last: { u1: '2026-10-01' } };
  assert.equal(isRefreshDue(app, 'u1', '2026-10-20'), false);
});

test('RULE-242: Fällige Seiten gehen vor, die am längsten nicht geübte zuerst', () => {
  const app = {
    stars: { u1: 1, u2: 1, u3: 1 },
    last: { u1: '2026-10-05', u2: '2026-10-01', u3: '2026-10-09' }
  };
  const pick = weakestUnit(app, units, '2026-10-10');
  assert.equal(pick.unit.id, 'u2');
  assert.equal(pick.reason, 'refresh');
});

test('RULE-242: Eine fällige Seite schlägt eine schwächere Seite', () => {
  const app = {
    stars: { u1: 1, u2: 1, u3: 1 },
    last: { u1: '2026-10-01', u2: '2026-10-09', u3: '2026-10-09' },
    acc: { u1: 0.8, u2: 0.1, u3: 0.1 }
  };
  assert.equal(weakestUnit(app, units, '2026-10-10').unit.id, 'u1');
});

test('RULE-242: Ohne Fälligkeit wird die Seite mit der niedrigsten Quote unter 90 % empfohlen', () => {
  const app = {
    stars: { u1: 1, u2: 1, u3: 1 },
    last: { u1: '2026-10-09', u2: '2026-10-09', u3: '2026-10-09' },
    acc: { u1: 0.6, u2: 0.5, u3: 0.95 }
  };
  const pick = weakestUnit(app, units, '2026-10-10');
  assert.equal(pick.unit.id, 'u2');
  assert.equal(pick.reason, 'weak');
});

test('RULE-242: Seiten mit drei Sternen oder ohne gespeicherte Quote werden nicht empfohlen', () => {
  const app = {
    stars: { u1: 3, u2: 1 },
    last: { u1: '2026-10-09', u2: '2026-10-09' },
    acc: { u1: 0.2 }
  };
  assert.equal(weakestUnit(app, units, '2026-10-10'), null);
});

test('RULE-242: Ohne fällige oder schwache Seite gibt es keine Empfehlung', () => {
  const app = { stars: { u1: 3 }, last: { u1: '2026-10-09' }, acc: { u1: 0.95 } };
  assert.equal(weakestUnit(app, units, '2026-10-10'), null);
});
