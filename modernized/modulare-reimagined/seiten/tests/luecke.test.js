// Die Lücke zeigt nur das Wort, nie den ganzen Satz (reveal). Sonst steht der Satz nach der Antwort doppelt da.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../helfer/index.js';
import { choiceQuestion, typedQuestion, option } from '../../runde/index.js';
import { blankFill } from '../spiel.js';

const auswahl = () => choiceQuestion({
  label: 'Lücke füllen', prompt: "J'ai {{blank}} ans.", answer: 'douze', reveal: "J'ai <b>douze</b> ans.",
  choices: ['douze', 'onze'].map((w) => option(w, w, w)), rng: createRng(1)
});
const eingabe = () => typedQuestion({
  label: 'Schreibe das fehlende Wort', prompt: "J'ai {{blank}} ans.", answer: 'douze', reveal: "J'ai <b>douze</b> ans."
});

test('SEITE-LUECKE nach der Antwort steht das richtige Wort in der Lücke, bei Auswahl und Eingabe', () => {
  assert.equal(blankFill(auswahl(), true, null), 'douze');
  assert.equal(blankFill(eingabe(), true, null), 'douze');
});

test('SEITE-LUECKE vor der Antwort steht die gewählte Option in der Lücke, ohne Auswahl nichts', () => {
  const q = auswahl();
  const index = q.options.findIndex((o) => o.id === 'onze');
  assert.equal(blankFill(q, false, index), 'onze');
  assert.equal(blankFill(q, false, null), null);
  assert.equal(blankFill(eingabe(), false, null), null);
});

test('SEITE-LUECKE Sonderzeichen werden maskiert', () => {
  const q = typedQuestion({ label: 'x', prompt: '{{blank}} Satz', answer: 'a<b' });
  assert.equal(blankFill(q, true, null), 'a&lt;b');
});
