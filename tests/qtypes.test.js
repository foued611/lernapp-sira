import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerQuestionType, questionKinds, questionType, defaultCheck, renderQuestion, validateQuestion, findAction } from '../core/js/qtypes.js';

const run = (extra = {}) => ({ state: 'ask', sel: null, typed: '', fb: null, m: null, ...extra });

test('die drei Standardtypen sind registriert', () => {
  assert.deepEqual(questionKinds().slice(0, 3), ['choice', 'type', 'match']);
  assert.throws(() => questionType('gibtsnicht'), /Unbekannter Fragetyp/);
});

test('defaultCheck unterscheidet ok, fast (Akzent) und falsch', () => {
  const c = defaultCheck({ answer: 'chanté' });
  assert.equal(c('chanté'), 'ok');
  assert.equal(c('chante'), 'almost');
  assert.equal(c('gesungen'), 'bad');
});

test('Auswahl: Bewertung und Prüfen-Freigabe', () => {
  const q = { kind: 'choice', label: 'x', answer: 'b', options: [{ id: 'a', html: 'A' }, { id: 'b', html: 'B' }] };
  const t = questionType('choice');
  assert.equal(t.canCheck(q, run()), false);
  assert.equal(t.grade(q, run({ sel: 1 })), 'ok');
  assert.equal(t.grade(q, run({ sel: 0 })), 'bad');
});

test('Zuordnen: Anfangszustand und Render ohne Fehler', () => {
  const q = { kind: 'match', label: 'm', left: ['1', '2'], right: [{ html: 'x', value: 'a' }, { html: 'y', value: 'b' }], leftValues: ['a', 'b'] };
  const m = questionType('match').init(q);
  assert.equal(m.n, 0);
  assert.match(renderQuestion(q, run({ m }), {}), /data-act="mleft"/);
  validateQuestion(q, assert);
});

test('eigener Fragetyp lässt sich ohne Änderung am Kern anmelden', () => {
  registerQuestionType('ja-nein', {
    validate: (q, a) => a.ok(typeof q.answer === 'boolean'),
    render: (q, r, p) => `${p.label}<button data-act="jn-ja">Ja</button>`,
    canCheck: (q, r) => r.sel !== null,
    grade: (q, r) => ((r.sel === 1) === q.answer ? 'ok' : 'bad'),
    actions: { 'jn-ja': () => {} }
  });
  const q = { kind: 'ja-nein', label: 'Stimmt das?', answer: true };
  validateQuestion(q, assert);
  assert.match(renderQuestion(q, run(), {}), /jn-ja/);
  assert.equal(questionType('ja-nein').grade(q, run({ sel: 1 })), 'ok');
  assert.equal(typeof findAction('jn-ja'), 'function');
});

test('Frage ohne Label ist ungültig', () => {
  assert.throws(() => validateQuestion({ kind: 'type', answer: 'a' }, assert));
});
