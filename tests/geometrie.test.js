import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circumcenter, incircle, dist, at } from '../apps/geometrie/geom.js';
import { POOLS, init } from '../apps/geometrie/builders.js';
import { diskSource } from './helpers.js';

// Die Erzeuger bekommen Seiten und Aufgabendaten wie im Browser aus content/geometrie/.
{ const bundle = await diskSource().load('geometrie'); init({ data: bundle.data, manifest: bundle.manifest }); }
import { numCheck } from '../core/js/mathkit.js';

test('Umkreismittelpunkt ist von allen Ecken gleich weit entfernt', () => {
  for (let i = 0; i < 100; i++) {
    const A = [Math.random() * 300, Math.random() * 300], B = [Math.random() * 300, Math.random() * 300], C = [Math.random() * 300, Math.random() * 300];
    const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]));
    if (area < 500) continue;
    const U = circumcenter(A, B, C);
    assert.ok(Math.abs(dist(U, A) - dist(U, B)) < 1e-6 && Math.abs(dist(U, B) - dist(U, C)) < 1e-6);
  }
});

test('Inkreis berührt alle drei Seiten (gleicher Abstand)', () => {
  const A = [30, 220], B = [220, 200], C = [90, 50];
  const { I, r } = incircle(A, B, C);
  const d = (P, Q) => Math.abs((Q[0] - P[0]) * (P[1] - I[1]) - (P[0] - I[0]) * (Q[1] - P[1])) / dist(P, Q);
  for (const [P, Q] of [[A, B], [B, C], [C, A]]) assert.ok(Math.abs(d(P, Q) - r) < 1e-6);
});

test('Punkt auf dem Kreis: Winkel stimmen mit at() überein', () => {
  const [x, y] = at(0, 0, 10, 90);
  assert.ok(Math.abs(x) < 1e-9 && Math.abs(y + 10) < 1e-9);
});

test('jede Aufgabe: richtige Antwort ist nicht unter den falschen, Zahlen werden akzeptiert', () => {
  for (const [unit, pool] of Object.entries(POOLS)) {
    for (let i = 0; i < 200; i++) for (const gen of pool) {
      const it = gen();
      assert.ok(!it.wrong.includes(it.answer), `${unit}: ${it.prompt}`);
      assert.ok(it.wrong.length >= 3 || it.wrong.length >= 2, `${unit}: ${it.prompt}`);
      if (it.numeric) assert.equal(numCheck(it.value)(it.answer), 'ok', `${unit}: ${it.prompt}`);
    }
  }
});

test('Winkelaufgaben rechnen richtig', () => {
  const num = (s) => Number(s.replace(/[^\d,−-]/g, '').replace('−', '-').replace(',', '.'));
  for (let i = 0; i < 300; i++) {
    const [, , sum, gs] = POOLS.winkel;
    let it = sum();
    const [a, b] = [...it.prompt.matchAll(/= (\d+)°/g)].map((m) => Number(m[1]));
    assert.equal(num(it.answer), 180 - a - b, it.prompt);
    it = gs();
    const top = Number(it.prompt.match(/Winkel (\d+)°/)[1]);
    assert.equal(num(it.answer), (180 - top) / 2, it.prompt);
    const [, tb] = [POOLS.thales[0], POOLS.thales[1]];
    it = tb();
    const al = Number(it.prompt.match(/α = (\d+)°/)[1]);
    assert.equal(num(it.answer), 90 - al, it.prompt);
  }
});
