// Ergebnisse der Aufgaben werden unabhängig nachgerechnet (Legacy-Prüfung aus legacy/modulare/tests/mathe.test.js,
// hier mit rng). Die Dual-Execution vergleicht nur Legacy mit Neubau; diese Tests prüfen die Mathematik selbst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../../helfer/index.js';
import { POOLS } from '../builders.js';

const val = (s) => Number(s.replace(/−/g, '-').replace(',', '.'));

test('Rechenaufgaben: Vorzeichen und Gleichungen stimmen', () => {
  const rng = createRng(11);
  for (let i = 0; i < 300; i++) {
    const it = POOLS.vorzeichen[0](rng);
    const m = it.prompt.match(/^(\S+) ([+−]) (\(?\S+?\)?)$/);
    const a = val(m[1]), b = val(m[3].replace(/[()]/g, ''));
    assert.equal(val(it.answer), m[2] === '+' ? a + b : a - b, it.prompt);
  }
  for (let i = 0; i < 300; i++) {
    const it = POOLS.gleichungen[0](rng);
    const [l, r] = it.prompt.split(' = ');
    const x = val(it.answer);
    const m = l.match(/^(\d+)x(?: ([+−]) (\d+))?$/);
    const b = m[3] ? (m[2] === '+' ? 1 : -1) * Number(m[3]) : 0;
    assert.equal(Number(m[1]) * x + b, val(r), it.prompt);
  }
});

test('Zinsen und Dreisatz: Ergebnis wird unabhängig nachgerechnet', () => {
  const rng = createRng(12);
  const nums = (s) => (s.replace(/\d+\.\d+|\d{1,3}(?:\.\d{3})+/g, (m) => m.replace('.', '')).match(/\d+(?:,\d+)?/g) || []).map((n) => Number(n.replace(',', '.')));
  const [zinsen,, , monate] = POOLS.zinsen;
  const [prop, anti] = POOLS.zuordnungen;
  for (let i = 0; i < 300; i++) {
    const z = zinsen(rng);
    const [k, p] = nums(z.prompt);
    assert.equal(val(z.answer), k * p / 100, z.prompt);
    const m = monate(rng);
    const [k2, mo, p2] = nums(m.prompt);
    assert.equal(val(m.answer), k2 * p2 / 100 * mo / 12, m.prompt);
    const a = prop(rng);
    const [n1, p1, n2] = nums(a.prompt);
    assert.equal(val(a.answer), (p1 / n1) * n2, a.prompt);
    const b = anti(rng);
    const [w1, d, w2] = nums(b.prompt);
    assert.equal(val(b.answer), (w1 * d) / w2, b.prompt);
  }
});

test('Daten und Zufall: Ergebnisse unabhängig nachgerechnet', () => {
  const rng = createRng(13);
  const ints = (s) => (s.split(': ')[1] || '').split(', ').map(Number);
  const [mw, med, span, mod] = POOLS.daten;
  for (let i = 0; i < 300; i++) {
    let it = mw(rng), xs = ints(it.prompt);
    assert.equal(val(it.answer), xs.reduce((a, b) => a + b, 0) / xs.length, it.prompt);
    it = med(rng); xs = ints(it.prompt);
    // RULE-056: bei gerader Anzahl das Mittel der beiden mittleren Werte.
    const sorted = [...xs].sort((a, b) => a - b);
    const mid = xs.length % 2 ? sorted[(xs.length - 1) / 2] : (sorted[xs.length / 2 - 1] + sorted[xs.length / 2]) / 2;
    assert.equal(val(it.answer), mid, it.prompt);
    it = span(rng); xs = it.prompt.split('? ')[1].split(', ').map(Number);
    assert.equal(val(it.answer), Math.max(...xs) - Math.min(...xs), it.prompt);
    it = mod(rng); xs = it.prompt.split('? ')[1].split(', ').map(Number);
    const counts = xs.reduce((m, v) => ((m[v] = (m[v] || 0) + 1), m), {});
    const top = Math.max(...Object.values(counts));
    assert.deepEqual(Object.keys(counts).filter((k) => counts[k] === top), [String(val(it.answer))], it.prompt);
  }
});

test('Wahrscheinlichkeiten: jede Aufgabe hat einen Wert zwischen 0 und 1, den ihr Prüfer akzeptiert', () => {
  const rng = createRng(14);
  for (let i = 0; i < 300; i++) for (const gen of POOLS.zufall) {
    const it = gen(rng);
    assert.equal(it.check(it.answer), 'ok', it.prompt);
    assert.ok(it.value > 0 && it.value <= 1, it.prompt);
    assert.ok(!it.wrong.includes(it.answer));
  }
});

test('Zinseszins, Ausklammern, Aufstellen und Lösungsanzahl stimmen', () => {
  const rng = createRng(15);
  const [, , , , zz] = POOLS.zinsen;
  const [, , , , aus] = POOLS.terme;
  const [, , , auf, anz] = POOLS.gleichungen;
  for (let i = 0; i < 300; i++) {
    const z = zz(rng);
    const [k, n, p] = [z.prompt.match(/^(\d+) €/)[1], z.prompt.match(/(\d+) Jahre/)[1], z.prompt.match(/zu (\d+) %/)[1]].map(Number);
    assert.ok(Math.abs(val(z.answer) - k * (1 + p / 100) ** n) < 1e-6, z.prompt);
    const a = aus(rng);
    const m = a.prompt.match(/: (\d+)x \+ (\d+)$/), r = a.answer.match(/^(\d+) · \((\d+)x \+ (\d+)\)$/);
    assert.equal(Number(r[1]) * Number(r[2]), Number(m[1]));
    assert.equal(Number(r[1]) * Number(r[3]), Number(m[2]));
    const q = auf(rng);
    const [, k2, c2, r2] = q.answer.match(/^(\d+)x \+ (\d+) = (\d+)$/).map(Number);
    assert.ok((r2 - c2) % k2 === 0, q.prompt);
    const l = anz(rng);
    assert.ok(['keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen'].includes(l.answer));
  }
});

test('Kredit und Tilgung: Ergebnis wird unabhängig nachgerechnet', () => {
  const rng = createRng(16);
  const kval = (s) => Number(s.replace(/−/g, '-').replace(',', '.').replace(/\.(?=\d{3}\b)/g, ''));
  const nums = (s) => (s.replace(/\d+\.\d{3}\b/g, (m) => m.replace('.', '')).match(/\d+(?:,\d+)?/g) || []).map((n) => Number(n.replace(',', '.')));
  const [zins, rate, rest, zweites, laufzeit] = POOLS.kredit;
  for (let i = 0; i < 300; i++) {
    let it = zins(rng), [k, p] = nums(it.prompt);
    assert.equal(kval(it.answer), k * p / 100, it.prompt);
    it = rate(rng); const [k2, p2, t2] = nums(it.prompt);
    assert.equal(kval(it.answer), t2 + k2 * p2 / 100, it.prompt);
    it = rest(rng); const [k3, t3, m3] = nums(it.prompt);
    assert.equal(kval(it.answer), k3 - m3 * t3, it.prompt);
    assert.ok(m3 * t3 < k3, 'Restschuld bleibt positiv');
    it = zweites(rng); const [k4, t4, p4] = nums(it.prompt);
    assert.equal(kval(it.answer), (k4 - t4) * p4 / 100, it.prompt);
    it = laufzeit(rng); const [k5, t5] = nums(it.prompt);
    assert.equal(kval(it.answer), k5 / t5, it.prompt);
  }
});

test('RULE-056: Median-Aufgaben mit gerader Anzahl kommen vor', () => {
  const rng = createRng(56);
  const [, med] = POOLS.daten;
  let gerade = 0;
  for (let i = 0; i < 300; i++) {
    const xs = med(rng).prompt.split(': ')[1].split(', ');
    if (xs.length % 2 === 0) gerade++;
  }
  assert.ok(gerade > 0, 'keine Reihe mit gerader Anzahl erzeugt');
});
