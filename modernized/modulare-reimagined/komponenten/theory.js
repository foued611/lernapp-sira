// Standard-Theorieseite (legacy/modulare/core/js/theory.js:7-19) und Konjugationstabelle mit Selbsttest
// (RULE-222, Vorlage legacy/modulare/apps/franzoesisch-verben/theory.js:33-83).
// Die Lektion steht außerhalb der Tabelle. Verbwechsel und Selbsttest ändern nur die Tabelle.
import { createElement, Fragment, useReducer } from 'react';
import { Lesson } from './lesson.js';
import { trackOf } from '../helfer/index.js';
import { TrackLabel } from './tracks.js';
import { Button } from './ui.js';

const h = createElement;

const PERSONS = 6;

/**
 * Anfangszustand. Das erste Verb der Seite steht in der Tabelle, der Selbsttest ist aus (RULE-222).
 * Legacy: theory.js:34.
 */
export function initialPractice(verbs) {
  const first = Array.isArray(verbs) && verbs.length > 0 ? verbs[0].key : null;
  return { verbKey: first, selfTest: false, revealed: [] };
}

/**
 * Zustand der Tabelle. Reine Funktion, ohne DOM.
 * - Verbwechsel: neues Verb, aufgedeckte Formen werden verdeckt. Der Selbsttest bleibt eingeschaltet (theory.js:75).
 * - Selbsttest umschalten: alles wird verdeckt (theory.js:76).
 * - Antippen: nur im Selbsttest deckt eine Form auf, keine Doppeleinträge (theory.js:77).
 */
export function practiceReducer(state, action) {
  switch (action.type) {
    case 'selectVerb':
      return { ...state, verbKey: action.key, revealed: [] };
    case 'toggleSelfTest':
      return { ...state, selfTest: !state.selfTest, revealed: [] };
    case 'reveal': {
      const index = action.index;
      if (!state.selfTest || !Number.isInteger(index) || index < 0 || index >= PERSONS) return state;
      if (state.revealed.includes(index)) return state;
      return { ...state, revealed: [...state.revealed, index] };
    }
    default:
      return state;
  }
}

/** Die Zeile zur Person. Die Bezeichnung (je, j', il …) liefert der Inhalt (verb.labels). */
const labelOf = (verb, i) => (Array.isArray(verb.labels) ? verb.labels[i] || '' : '');

/** Formzelle: bei unregelmäßigen Verben das ganze Wort, bei regelmäßigen Stamm plus Endung (theory.js:26-30). */
function formCell(verb, i) {
  const form = verb.forms[i] || '';
  if (verb.irr) return h('b', null, form);
  const ending = Array.isArray(verb.ends) ? verb.ends[i] : '';
  return h(Fragment, null, h('span', { className: 'stem' }, verb.stem || ''), h('span', { className: 'end' }, ending ? ending : '∅'));
}

/** Dritte Spalte: bei unregelmäßigen Verben die deutsche Form, sonst die Endung oder "keine Endung" (theory.js:59). */
export function thirdCell(verb, i) {
  if (verb.irr) return Array.isArray(verb.deF) ? verb.deF[i] || '' : '';
  const ending = Array.isArray(verb.ends) ? verb.ends[i] : '';
  return ending ? `Endung -${ending}` : 'keine Endung';
}

/**
 * Präsentation der Tabelle, ohne eigenen Zustand. Sie bekommt den Zustand und sendet Aktionen zurück.
 * Der Selbsttest verdeckt jede Form mit einem Knopf, damit er auch per Tastatur bedienbar ist (KOMP-A11Y).
 */
export function PracticeView({ verbs, state, dispatch }) {
  const verb = verbs.find((v) => v.key === state.verbKey) || verbs[0];
  const chips =
    verbs.length > 1
      ? h(
          'div',
          { className: 'chips', role: 'group', 'aria-label': 'Verb wählen' },
          ...verbs.map((v) =>
            h(
              'button',
              {
                key: v.key,
                type: 'button',
                className: v.key === verb.key ? 'chip on' : 'chip',
                'aria-pressed': v.key === verb.key,
                onClick: () => dispatch({ type: 'selectVerb', key: v.key })
              },
              v.inf
            )
          )
        )
      : null;
  const selfTestToggle = h(
    'button',
    {
      type: 'button',
      className: state.selfTest ? 'chip on' : 'chip',
      'aria-pressed': state.selfTest,
      onClick: () => dispatch({ type: 'toggleSelfTest' })
    },
    'Selbsttest: Formen abdecken'
  );
  const rows = Array.from({ length: PERSONS }, (_, i) => {
    const hidden = state.selfTest && !state.revealed.includes(i);
    const cell = hidden
      ? h(
          'button',
          {
            type: 'button',
            className: 'fm-reveal',
            'aria-label': `Form für ${labelOf(verb, i)} aufdecken`,
            onClick: () => dispatch({ type: 'reveal', index: i })
          },
          'Antippen zum Aufdecken'
        )
      : h('span', { className: 'val' }, formCell(verb, i));
    return h(
      'tr',
      { key: i },
      h('th', { scope: 'row', className: 'pr' }, labelOf(verb, i)),
      h('td', { className: 'fm' }, cell),
      h('td', { className: 'third' }, thirdCell(verb, i))
    );
  });

  return h(
    'section',
    { className: 'card tcard conj' },
    h(
      'div',
      { className: 'thead' },
      h('h2', null, verb.inf),
      h('span', { className: 'de' }, verb.irr && verb.de ? `${verb.de} · unregelmäßig` : verb.de || '')
    ),
    h('div', { className: 'conj-controls' }, chips, selfTestToggle),
    h('table', { className: 'conj', 'aria-label': `Formen von ${verb.inf}` }, h('tbody', null, ...rows)),
    verb.irr
      ? null
      : h('p', { className: 'muted conj-hint' }, 'Die Endung ist hervorgehoben. Der Stamm bleibt gleich.')
  );
}

/** Zustand mit useReducer, Darstellung über PracticeView. */
export function ConjugationPractice({ verbs }) {
  const [state, dispatch] = useReducer(practiceReducer, verbs, initialPractice);
  if (!Array.isArray(verbs) || verbs.length === 0) return null;
  return h(PracticeView, { verbs, state, dispatch });
}

/** Drei Beispielsätze. Die Lücke "___" wird mit der Form markiert (theory.js:37-39). */
export function ExampleSentences({ examples }) {
  const shown = Array.isArray(examples) ? examples.slice(0, 3) : [];
  if (shown.length === 0) return null;
  return h(
    'section',
    { className: 'card' },
    h('h3', null, 'So sieht das im Satz aus'),
    h(
      'ul',
      { className: 'ex' },
      ...shown.map((s, i) => {
        const fr = String(s.fr ?? '');
        const at = fr.indexOf('___');
        const before = at < 0 ? fr : fr.slice(0, at);
        const after = at < 0 ? '' : fr.slice(at + 3);
        return h(
          'li',
          { key: i },
          h(
            'div',
            null,
            h('div', { className: 'fr' }, before, at < 0 ? null : h('span', { className: 'mk' }, s.form || ''), after),
            h('div', { className: 'de' }, s.de || '')
          )
        );
      })
    )
  );
}

/** Merkzettel als Paare [Titel, Text]. Ohne Einträge entfällt der Abschnitt (theory.js:15). */
export function Notes({ notes }) {
  const list = Array.isArray(notes) ? notes : [];
  if (list.length === 0) return null;
  return h(
    'section',
    null,
    h('h2', null, 'Merkzettel'),
    h(
      'div',
      { className: 'notes' },
      ...list.map((n, i) => h('div', { key: i, className: 'note' }, h('b', null, n[0] || ''), n[1] || ''))
    )
  );
}

/**
 * Die Theorieseite: Kopf mit Strangetikett, optional Konjugation, Lektion, Beispiele, Merkzettel, Übungsknopf.
 * Fehlt die Lektion, bleibt der Rest der Seite erhalten und onProblem meldet es (RULE-136).
 */
export function TheoryPage({ unit, lesson, notes, tracks, verbs, examples, diagrams, startLabel = 'Übung starten', onStart, onProblem }) {
  const track = trackOf(tracks, unit);
  return h(
    'div',
    { className: 'theory-stack' },
    h(
      'section',
      { className: 'card tcard' },
      h(
        'div',
        { className: 'thead' },
        h('h1', null, unit.title),
        h('span', { className: 'de' }, unit.de || ''),
        h(TrackLabel, { track })
      )
    ),
    Array.isArray(verbs) && verbs.length > 0 ? h(ConjugationPractice, { verbs }) : null,
    h(Lesson, { lesson, unitId: unit.id, diagrams, onProblem }),
    h(ExampleSentences, { examples }),
    h(Notes, { notes }),
    h('div', null, h(Button, { onClick: () => (typeof onStart === 'function' ? onStart(unit.id) : undefined) }, startLabel))
  );
}
