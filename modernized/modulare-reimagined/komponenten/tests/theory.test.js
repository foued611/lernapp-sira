import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  initialPractice,
  practiceReducer,
  PracticeView,
  ExampleSentences,
  TheoryPage,
  thirdCell
} from '../theory.js';

const h = createElement;

// Erfundene Verbdaten in der Form von legacy franzoesisch-verben/model.js (Felder je Verb, sechs Personen).
const aimer = {
  key: 'aimer',
  inf: 'aimer',
  de: 'lieben',
  irr: false,
  stem: 'aim',
  ends: ['e', 'es', '', 'ons', 'ez', 'ent'],
  forms: ['aime', 'aimes', 'aime', 'aimons', 'aimez', 'aiment'],
  labels: ["j'", 'tu', 'il', 'nous', 'vous', 'ils']
};
const aller = {
  key: 'aller',
  inf: 'aller',
  de: 'gehen',
  irr: true,
  stem: '',
  ends: [],
  forms: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
  deF: ['gehe', 'gehst', 'geht', 'gehen', 'geht', 'gehen'],
  labels: ['je', 'tu', 'il', 'nous', 'vous', 'ils']
};
const verbs = [aimer, aller];

const base = { selfTest: false, revealed: [] };

test('RULE-222 beim Öffnen steht das erste Verb der Seite in der Tabelle', () => {
  assert.equal(initialPractice(verbs).verbKey, 'aimer');
  const markup = renderToStaticMarkup(h(PracticeView, { verbs, state: initialPractice(verbs), dispatch: () => {} }));
  assert.match(markup, /<h2>aimer<\/h2>/);
  assert.match(markup, /Endung -e/);
});

test('RULE-222 dritte Spalte: unregelmäßig zeigt die Übersetzung, regelmäßig Endung oder keine Endung', () => {
  assert.equal(thirdCell(aller, 1), 'gehst');
  assert.equal(thirdCell(aimer, 0), 'Endung -e');
  assert.equal(thirdCell(aimer, 2), 'keine Endung');
  const markup = renderToStaticMarkup(h(PracticeView, { verbs: [aller], state: { verbKey: 'aller', ...base }, dispatch: () => {} }));
  assert.match(markup, /<td class="third">gehe<\/td>/);
  assert.doesNotMatch(markup, /Endung -/);
});

test('RULE-222 Selbsttest deckt alle sechs Formen ab, jede als Knopf', () => {
  const state = { verbKey: 'aimer', selfTest: true, revealed: [] };
  const markup = renderToStaticMarkup(h(PracticeView, { verbs, state, dispatch: () => {} }));
  assert.equal(markup.split('class="fm-reveal"').length - 1, 6);
  assert.doesNotMatch(markup, /class="stem"/, 'keine Form sichtbar');
});

test('RULE-222 aufgedeckte Form ist im Selbsttest sichtbar, die übrigen bleiben verdeckt', () => {
  const state = { verbKey: 'aimer', selfTest: true, revealed: [1] };
  const markup = renderToStaticMarkup(h(PracticeView, { verbs, state, dispatch: () => {} }));
  assert.equal(markup.split('class="fm-reveal"').length - 1, 5);
  assert.match(markup, /<span class="stem">aim<\/span><span class="end">es<\/span>/);
});

test('RULE-222 Antippen deckt nur im Selbsttest auf, doppelt zählt nicht', () => {
  const off = practiceReducer({ verbKey: 'aimer', ...base }, { type: 'reveal', index: 0 });
  assert.deepEqual(off.revealed, [], 'ohne Selbsttest passiert nichts');
  const on = practiceReducer({ verbKey: 'aimer', selfTest: true, revealed: [] }, { type: 'reveal', index: 0 });
  const again = practiceReducer(on, { type: 'reveal', index: 0 });
  assert.deepEqual(again.revealed, [0]);
  assert.equal(practiceReducer(on, { type: 'reveal', index: 9 }), on, 'Index außerhalb der sechs Formen');
});

test('RULE-222 Verbwechsel verdeckt die Formen neu, der Selbsttest bleibt eingeschaltet', () => {
  const state = { verbKey: 'aimer', selfTest: true, revealed: [0, 3] };
  const next = practiceReducer(state, { type: 'selectVerb', key: 'aller' });
  assert.deepEqual(next, { verbKey: 'aller', selfTest: true, revealed: [] });
});

test('RULE-222 Selbsttest ein- oder ausschalten setzt die Aufdeckungen zurück', () => {
  const state = { verbKey: 'aimer', selfTest: true, revealed: [2] };
  const off = practiceReducer(state, { type: 'toggleSelfTest' });
  assert.deepEqual(off, { verbKey: 'aimer', selfTest: false, revealed: [] });
  assert.deepEqual(practiceReducer(off, { type: 'toggleSelfTest' }).selfTest, true);
});

test('RULE-222 Beispielsätze zeigen die ersten drei Sätze, die Form ist markiert', () => {
  const examples = [
    { fr: "Je ___ la musique.", form: 'aime', de: 'Ich liebe Musik.' },
    { fr: 'Tu ___ le sport.', form: 'aimes', de: 'Du liebst Sport.' },
    { fr: 'Il ___ danser.', form: 'aime', de: 'Er tanzt gern.' },
    { fr: 'Nous ___ lire.', form: 'aimons', de: 'Wir lesen gern.' }
  ];
  const markup = renderToStaticMarkup(h(ExampleSentences, { examples }));
  assert.equal(markup.split('<li>').length - 1, 3);
  assert.doesNotMatch(markup, /aimons/);
  assert.match(markup, /<span class="mk">aime<\/span> la musique\./);
});

test('RULE-222 Theorieseite: Tabelle, dann Lektion, dann Beispiele', () => {
  const lesson = { goal: 'Ziel.', tldr: ['Satz.'], analogy: { title: 'Vergleich', html: '<p>x</p>' } };
  const markup = renderToStaticMarkup(
    h(TheoryPage, {
      unit: { id: 'aimer', title: 'Verben auf -er', de: 'Gruppe 1', track: 'lrs' },
      lesson,
      tracks: { lrs: { label: 'LRS-Förderung' } },
      verbs,
      examples: [{ fr: 'Je ___.', form: 'aime', de: 'Ich liebe.' }],
      notes: [['Merke', 'Endung -e in der ersten Person.']]
    })
  );
  const table = markup.indexOf('class="conj"');
  const lessonAt = markup.indexOf('In 30 Sekunden');
  const examplesAt = markup.indexOf('So sieht das im Satz aus');
  assert.ok(table > 0 && lessonAt > table && examplesAt > lessonAt);
  assert.match(markup, /Merkzettel/);
  assert.match(markup, /LRS-Förderung/);
  assert.match(markup, /Übung starten/);
});

test('RULE-136 Theorieseite ohne Lektion bleibt benutzbar und meldet die fehlende Lektion', () => {
  const problems = [];
  const markup = renderToStaticMarkup(
    h(TheoryPage, {
      unit: { id: 'nur-verb', title: 'Ohne Lektion' },
      lesson: undefined,
      onProblem: (p) => problems.push(p)
    })
  );
  assert.match(markup, /Ohne Lektion/);
  assert.match(markup, /Übung starten/);
  assert.doesNotMatch(markup, /In 30 Sekunden|Mini-Check/);
  assert.deepEqual(problems, [{ type: 'lesson', unitId: 'nur-verb' }]);
});

test('KOMP-A11Y Konjugationstabelle hat einen Namen, Verbwahl zeigt den Zustand als aria-pressed', () => {
  const state = { verbKey: 'aller', selfTest: true, revealed: [] };
  const markup = renderToStaticMarkup(h(PracticeView, { verbs, state, dispatch: () => {} }));
  assert.match(markup, /<table class="conj" aria-label="Formen von aller">/);
  assert.match(markup, /class="chip" aria-pressed="false"[^>]*>aimer</);
  assert.match(markup, /class="chip on" aria-pressed="true"[^>]*>aller</);
  assert.match(markup, /aria-label="Form für tu aufdecken"/);
});

test('KOMP-A11Y Die Hinweistext zur Endung ist Text und nicht nur Farbe', () => {
  const markup = renderToStaticMarkup(h(PracticeView, { verbs: [aimer], state: { verbKey: 'aimer', ...base }, dispatch: () => {} }));
  assert.match(markup, /Die Endung ist hervorgehoben\./);
  assert.doesNotMatch(markup, /Gelb/);
});
