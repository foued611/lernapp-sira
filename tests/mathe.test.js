import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, par, numCheck, termCheck, probCheck, linear, nearby } from '../apps/mathe/math.js';
import { POOLS, init } from '../apps/mathe/builders.js';
import { diskSource } from './helpers.js';

// Die Erzeuger bekommen Seiten und Aufgabendaten wie im Browser aus content/mathe/.
{ const bundle = await diskSource().load('mathe'); init({ data: bundle.data, manifest: bundle.manifest }); }

test('Zahlen werden mit Minuszeichen und Komma ausgegeben', () => {
  assert.equal(fmt(-3.5), '−3,5');
  assert.equal(par(-2), '(−2)');
  assert.equal(par(4), '4');
});

test('Zahlenprüfer akzeptiert Komma, Punkt, Minusvarianten und Einheiten', () => {
  const c = numCheck(-2.5);
  for (const v of ['-2,5', '-2.5', '−2,5', ' -2,5 ']) assert.equal(c(v), 'ok', v);
  assert.equal(numCheck(30)('30 €'), 'ok');
  assert.equal(numCheck(30)('3'), 'bad');
  assert.equal(numCheck(0)(''), 'bad');
});

test('Termprüfer ignoriert Leerzeichen und Malpunkt', () => {
  assert.equal(termCheck('4x + 12')('4x+12'), 'ok');
  assert.equal(termCheck('4x + 12')('4 x + 12'), 'ok');
  assert.equal(termCheck('4x + 12')('4x + 21'), 'bad');
  assert.equal(termCheck(linear(-1, 13))('-x+13'), 'ok');
});

test('linear schreibt Terme ohne überflüssige Teile', () => {
  assert.equal(linear(1, 0), 'x');
  assert.equal(linear(-1, 5), '−x + 5');
  assert.equal(linear(3, -2), '3x − 2');
  assert.equal(linear(0, 7), '7');
});

test('nearby liefert drei verschiedene falsche Zahlen', () => {
  for (let i = 0; i < 50; i++) {
    const r = nearby(i - 25, [i, i - 25, i - 25]);
    assert.equal(new Set(r).size, 3);
    assert.ok(!r.includes(i - 25));
  }
});

test('jede Aufgabe: Antwort stimmt, Prüfer erkennt sie', () => {
  for (const [unit, pool] of Object.entries(POOLS)) {
    for (let i = 0; i < 300; i++) for (const gen of pool) {
      const it = gen();
      if (it.numeric) assert.equal(numCheck(it.value)(it.answer), 'ok', `${unit}: ${it.prompt} -> ${it.answer}`);
      else if (!it.choiceOnly) assert.equal(termCheck(it.answer)(it.answer), 'ok', `${unit}: ${it.prompt}`);
    }
  }
});

test('Rechenaufgaben: Ergebnis wird unabhängig nachgerechnet', () => {
  const val = (s) => Number(s.replace(/−/g, '-').replace(',', '.'));
  for (let i = 0; i < 300; i++) {
    const it = POOLS.vorzeichen[0]();
    const m = it.prompt.match(/^(\S+) ([+−]) (\(?\S+?\)?)$/);
    const a = val(m[1]), b = val(m[3].replace(/[()]/g, ''));
    assert.equal(val(it.answer), m[2] === '+' ? a + b : a - b, it.prompt);
  }
  for (let i = 0; i < 300; i++) {
    const it = POOLS.gleichungen[0]();
    const [l, r] = it.prompt.split(' = ');
    const x = val(it.answer);
    const m = l.match(/^(\d+)x(?: ([+−]) (\d+))?$/);
    const b = m[3] ? (m[2] === '+' ? 1 : -1) * Number(m[3]) : 0;
    assert.equal(Number(m[1]) * x + b, val(r), it.prompt);
  }
});

test('Zinsen und Dreisatz: Ergebnis wird unabhängig nachgerechnet', () => {
  const val = (s) => Number(s.replace(/−/g, '-').replace(',', '.'));
  const nums = (s) => (s.replace(/\d+\.\d+|\d{1,3}(?:\.\d{3})+/g, (m) => m.replace('.', '')).match(/\d+(?:,\d+)?/g) || []).map((n) => Number(n.replace(',', '.')));
  for (let i = 0; i < 300; i++) {
    const [zinsen,, , monate] = POOLS.zinsen;
    const z = zinsen();
    const [k, p] = nums(z.prompt);
    assert.equal(val(z.answer), k * p / 100, z.prompt);
    const m = monate();
    const [k2, mo, p2] = nums(m.prompt);
    assert.equal(val(m.answer), k2 * p2 / 100 * mo / 12, m.prompt);
    const [prop, anti] = POOLS.zuordnungen;
    const a = prop();
    const [n1, p1, n2] = nums(a.prompt);
    assert.equal(val(a.answer), (p1 / n1) * n2, a.prompt);
    const b = anti();
    const [w1, d, w2] = nums(b.prompt);
    assert.equal(val(b.answer), (w1 * d) / w2, b.prompt);
  }
});

test('Daten und Zufall: Ergebnisse unabhängig nachgerechnet', () => {
  const val = (s) => Number(s.replace(/−/g, '-').replace(',', '.'));
  const ints = (s) => (s.split(': ')[1] || '').split(', ').map(Number);
  const [mw, med, span, mod] = POOLS.daten;
  for (let i = 0; i < 300; i++) {
    let it = mw(), xs = ints(it.prompt);
    assert.equal(val(it.answer), xs.reduce((a, b) => a + b, 0) / xs.length, it.prompt);
    it = med(); xs = ints(it.prompt);
    assert.equal(val(it.answer), [...xs].sort((a, b) => a - b)[(xs.length - 1) / 2], it.prompt);
    it = span(); xs = it.prompt.split('? ')[1].split(', ').map(Number);
    assert.equal(val(it.answer), Math.max(...xs) - Math.min(...xs), it.prompt);
    it = mod(); xs = it.prompt.split('? ')[1].split(', ').map(Number);
    const counts = xs.reduce((m, v) => ((m[v] = (m[v] || 0) + 1), m), {});
    const top = Math.max(...Object.values(counts));
    assert.deepEqual(Object.keys(counts).filter((k) => counts[k] === top), [String(val(it.answer))], it.prompt);
  }
});

test('Wahrscheinlichkeiten: Prüfer akzeptiert Bruch, Dezimalzahl und Prozent', () => {
  const c = probCheck(0.25);
  for (const v of ['1/4', '2/8', '0,25', '0.25', '25 %', '25%']) assert.equal(c(v), 'ok', v);
  for (const v of ['1/3', '25', '', '1/0']) assert.equal(c(v), 'bad', v);
  for (let i = 0; i < 300; i++) for (const gen of POOLS.zufall) {
    const it = gen();
    assert.equal(it.check(it.answer), 'ok', it.prompt);
    assert.ok(it.value > 0 && it.value <= 1, it.prompt);
    assert.ok(!it.wrong.includes(it.answer));
  }
});

test('Zinseszins, Ausklammern, Aufstellen und Lösungsanzahl stimmen', () => {
  const val = (s) => Number(s.replace(/−/g, '-').replace(',', '.'));
  const [, , , , zz] = POOLS.zinsen;
  const [, , , , aus] = POOLS.terme;
  const [, , , auf, anz] = POOLS.gleichungen;
  for (let i = 0; i < 300; i++) {
    const z = zz();
    const [k, n, p] = [z.prompt.match(/^(\d+) €/)[1], z.prompt.match(/(\d+) Jahre/)[1], z.prompt.match(/zu (\d+) %/)[1]].map(Number);
    assert.ok(Math.abs(val(z.answer) - k * (1 + p / 100) ** n) < 1e-6, z.prompt);
    const a = aus();
    const m = a.prompt.match(/: (\d+)x \+ (\d+)$/), r = a.answer.match(/^(\d+) · \((\d+)x \+ (\d+)\)$/);
    assert.equal(Number(r[1]) * Number(r[2]), Number(m[1]));
    assert.equal(Number(r[1]) * Number(r[3]), Number(m[2]));
    const q = auf();
    const [, k2, c2, r2] = q.answer.match(/^(\d+)x \+ (\d+) = (\d+)$/).map(Number);
    assert.ok((r2 - c2) % k2 === 0, q.prompt);
    const l = anz();
    assert.ok(['keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen'].includes(l.answer));
  }
});
