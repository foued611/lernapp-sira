// Ergebnisansicht: Titel, Sterne als Text, Feier-Hinweis, Bonus-Texte und Wege weiter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ergebnis, messagesOf, resultModel, wordsFor, DEFAULT_WORDS } from '../ergebnis.js';
import { profileDefaults } from '../ablauf.js';
import { DAY, configOf } from './helpers.js';

const h = createElement;
const words = wordsFor(configOf());

function summary(over = {}) {
  return {
    mode: 'lesson', unitId: 'start', failed: false, accuracy: 1, correct: 8, wrong: 0, almost: 0, bestCombo: 8,
    relearned: 0, xp: 50, bonus: 0, stars: 3, refresh: false, levelUp: null, goalHit: false, newBadges: [],
    ...over
  };
}

const model = (over, profileOver = {}) => resultModel(summary(over), { profile: { ...profileDefaults(), ...profileOver }, day: DAY, words });

test('RULE-195 Das Ergebnis zeigt Titel, Sterne als Text und die Zahlen der Runde', () => {
  const markup = renderToStaticMarkup(h(Ergebnis, { model: model({}), onAction: () => {} }));
  assert.match(markup, /Perfekt!/);
  assert.match(markup, /3 von 3 Sternen/);
  assert.match(markup, /100 %/);
});

test('RULE-195 Eine gescheiterte Runde heißt Noch nicht geschafft, hat null Sterne und keinen Feier-Hinweis', () => {
  const result = model({ failed: true, stars: 0, accuracy: 0.4, xp: 0 });
  assert.equal(result.title, 'Noch nicht geschafft');
  assert.equal(result.stars, 0);
  assert.equal(result.celebrate, false);
  assert.equal(result.mood, 'hmm');
});

test('RULE-195 Der Feier-Hinweis kommt bei zwei Sternen, beim Endgegner-Sieg oder beim Tagesziel', () => {
  assert.equal(model({ stars: 2 }).celebrate, true);
  assert.equal(model({ stars: 1 }).celebrate, false);
  assert.equal(model({ mode: 'boss', stars: 1 }).celebrate, true);
  assert.equal(model({ stars: 1, goalHit: true }).celebrate, true);
});

test('RULE-195 Die Auffrischung nennt ihren Bonus, der Endgegner seinen', () => {
  assert.match(model({ refresh: true }).subtitle, /10 Bonus-XP/);
  assert.match(model({ mode: 'boss' }).subtitle, /50 Bonus-XP/);
});

test('RULE-195 Eine neue Stufe erscheint als Zeile mit dem Stufennamen', () => {
  assert.equal(model({ levelUp: 2 }).levelLine, 'Niveau 2 erreicht · Entdecker');
});

test('RULE-195 Die Tagesziel-Zeile sagt, ob das Ziel erreicht ist, mit der Zahl der Restpunkte', () => {
  assert.equal(model({}, { day: { d: DAY, xp: 30 } }).daily.reached, true);
  const markup = renderToStaticMarkup(h(Ergebnis, { model: model({}, { day: { d: DAY, xp: 12 } }), onAction: () => {} }));
  assert.match(markup, /Tagesziel: noch 18 XP/);
});

test('RULE-195 Speicherfehler kommen als Meldungen zurück, gelungene Speicherung erzeugt keine', () => {
  assert.deepEqual(messagesOf({ saved: { ok: true }, logged: { ok: true } }), []);
  assert.deepEqual(
    messagesOf({ saved: { ok: false, error: 'Der Fortschritt konnte nicht gespeichert werden.' }, logged: { ok: true } }),
    ['Der Fortschritt konnte nicht gespeichert werden.']
  );
});

test('SEITE-A11Y Die Ergebnisaktionen sind Knöpfe mit Text und einem Typ', () => {
  const markup = renderToStaticMarkup(h(Ergebnis, { model: model({}), onAction: () => {} }));
  const buttons = markup.match(/<button[^>]*>[^<]*<\/button>/g) || [];
  // Nach einer Lektionsrunde gibt es wie in Legacy result.js auch den Theorie-Knopf.
  assert.equal(buttons.length, 3);
  for (const tag of buttons) assert.match(tag, /type="button"/);
  assert.match(markup, />Nochmal</);
  assert.match(markup, />Theorie</);
  assert.match(markup, />Zum Lernpfad</);
});

test('SEITE-A11Y Die Standardwörter bleiben, wenn eine App nichts überschreibt', () => {
  assert.equal(DEFAULT_WORDS.resultTitles.length, 3);
  assert.equal(wordsFor({}).resultTitles[0], 'Geschafft!');
});

test('SEITE-WOCHENZIEL Die Ergebnisansicht rechnet mit dem gewählten Tagesziel', () => {
  const result = model({}, { goal: 50, day: { d: DAY, xp: 20 } });
  assert.equal(result.daily.goal, 50);
  assert.equal(result.daily.reached, false);
  const markup = renderToStaticMarkup(h(Ergebnis, { model: result, onAction: () => {} }));
  assert.match(markup, /Tagesziel: noch 30 XP/);
  assert.equal(model({}, { goal: 20, day: { d: DAY, xp: 20 } }).daily.reached, true);
});

test('SEITE-MISSIONEN Das Ergebnis nennt die erfüllten Missionen mit ihrer XP, ohne Missionen gibt es keinen Satz', () => {
  assert.equal(model({ missions: [] }).missionLine, null);
  assert.equal(model({ missions: ['units3'] }).missionLine, 'Wochenmission erfüllt: Übe 3 verschiedene Seiten · +20 XP');
  assert.equal(
    model({ missions: ['units3', 'strong90'] }).missionLine,
    'Wochenmissionen erfüllt: Übe 3 verschiedene Seiten, Schaffe eine Runde mit mindestens 90 % · +40 XP'
  );
});
