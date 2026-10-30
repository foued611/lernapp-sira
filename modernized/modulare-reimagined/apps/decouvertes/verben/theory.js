// Theorieseite des Cahier de Verbes (Herkunft: legacy/modulare/apps/franzoesisch-verben/theory.js).
// Verbseiten des Cahier de Verbes (Konjugationstabelle mit Selbsttest). Die Weiche in theory.js wählt sie für Seiten mit verbs.
// Die Zustände der Tabelle (Verbwechsel, Selbsttest) kommen aus komponenten/theory.js, Lektion, Beispiele und Merkzettel ebenso.
import { createElement, Fragment, useReducer } from 'react';
import { Lesson } from '../../../komponenten/lesson.js';
import { Notes, initialPractice, practiceReducer, thirdCell } from '../../../komponenten/theory.js';
import { trackOf } from '../../../helfer/index.js';
import { TrackLabel } from '../../../komponenten/tracks.js';
import { Button } from '../../../komponenten/ui.js';
import { SpeakButton } from '../sprache.js';
import { elides } from './builders.js';

const h = createElement;
const PERSONS = [0, 1, 2, 3, 4, 5];

/** Theorie für ein Verbmodell (model.js). lab kommt aus den Erzeugern, diagrams aus createVerbDiagrams. */
export function createVerbTheory({ V, SP }, { lab }, diagrams) {
  /** Formzelle: bei unregelmäßigen Verben das ganze Wort, bei regelmäßigen Stamm plus Endung. */
  function formCell(verb, i) {
    if (verb.irr) return h('b', null, verb.forms[i]);
    const ending = verb.ends[i];
    return h(Fragment, null, h('span', { className: 'stem' }, verb.stem), h('span', { className: 'end' }, ending ? ending : '∅'));
  }

  /** Konjugationstabelle mit Verbwechsel, Selbsttest und Vorlesen je Zeile. Titel gehört zur selben Karte (wie Legacy). */
  function Conjugation({ unit, head }) {
    const verbs = unit.verbs.map((key) => V[key]);
    const [state, dispatch] = useReducer(practiceReducer, verbs, initialPractice);
    const verb = verbs.find((v) => v.key === state.verbKey) || verbs[0];

    const chips = verbs.length > 1
      ? h(
        'div',
        { className: 'chips', role: 'group', 'aria-label': 'Verb wählen' },
        ...verbs.map((v) => h(
          'button',
          {
            key: v.key, type: 'button', className: v.key === verb.key ? 'chip on' : 'chip',
            'aria-pressed': v.key === verb.key, onClick: () => dispatch({ type: 'selectVerb', key: v.key })
          },
          v.inf
        ))
      )
      : null;
    const selfTest = h(
      'button',
      {
        type: 'button', className: state.selfTest ? 'chip on' : 'chip', 'aria-pressed': state.selfTest,
        onClick: () => dispatch({ type: 'toggleSelfTest' })
      },
      'Selbsttest: Formen abdecken'
    );

    const rows = PERSONS.map((i) => {
      const hidden = state.selfTest && !state.revealed.includes(i);
      const speech = lab(verb, i) + (i === 0 && elides(verb) ? '' : ' ') + verb.forms[i];
      return h(
        'tr',
        { key: i },
        h('th', { scope: 'row', className: 'pr' }, lab(verb, i)),
        h(
          'td',
          { className: `fm${hidden ? ' hid' : ''}` },
          hidden
            ? h('button', {
              type: 'button', className: 'fm-reveal', 'aria-label': `Form für ${lab(verb, i)} aufdecken`,
              onClick: () => dispatch({ type: 'reveal', index: i })
            }, 'tippen')
            : h('span', { className: 'val' }, formCell(verb, i))
        ),
        h('td', { className: 'third' }, thirdCell(verb, i)),
        h('td', { className: 'sp' }, h(SpeakButton, { text: speech }))
      );
    });

    return h(
      'section',
      { className: 'card tcard conj-card' },
      head,
      h('div', { className: 'conj-controls' }, chips, selfTest),
      h('table', { className: 'conj', 'aria-label': `Formen von ${verb.inf}` }, h('tbody', null, ...rows)),
      verb.irr ? null : h('p', { className: 'muted conj-note' }, 'Gelb markiert ist die Endung. Der Stamm bleibt gleich.')
    );
  }

  /** Drei Beispielsätze. Die Form steht markiert in der Lücke, Vorlesen spricht den ganzen Satz. */
  function Examples({ unit }) {
    const examples = (SP[unit.id] || []).slice(0, 3);
    if (examples.length === 0) return null;
    return h(
      'section',
      { className: 'card' },
      h('h3', { className: 'ex-title' }, 'So sieht das im Satz aus'),
      h(
        'ul',
        { className: 'ex' },
        ...examples.map((s) => {
          const form = s.v.forms[s.p];
          const [before, after = ''] = s.fr.split('___');
          return h(
            'li',
            { key: s.id },
            h(
              'div',
              null,
              h('div', { className: 'fr' }, before, h('span', { className: 'mk' }, form), after),
              h('div', { className: 'de' }, s.de)
            ),
            h(SpeakButton, { text: s.fr.replace('___', form) })
          );
        })
      )
    );
  }

  /**
   * Die Theorieseite einer Seite: Kopf, Konjugation, Lektion, Beispiele, Merkzettel, Übungsknopf.
   * Props nach App-Vertrag (AGENTS.md): unit, config (Lektionen, Merkzettel, Lernstränge), onStart().
   */
  function Theory({ unit, config, onStart }) {
    const verb = V[unit.verbs[0]];
    const track = trackOf(config.tracks, unit);
    const head = h(
      'div',
      { className: 'thead' },
      h('h1', null, unit.irr ? verb.inf : unit.title),
      h('span', { className: 'de' }, unit.irr ? `${verb.de} · unregelmäßig` : unit.de),
      h(TrackLabel, { track })
    );
    return h(
      'div',
      { className: 'theory-stack' },
      h(Conjugation, { unit, head }),
      h(Lesson, { lesson: (config.lessons || {})[unit.id], unitId: unit.id, diagrams }),
      h(Examples, { unit }),
      h(Notes, { notes: (config.notes || {})[unit.id] }),
      h('div', null, h(Button, { onClick: () => { if (typeof onStart === 'function') onStart(); } }, 'Übung starten · 8 Aufgaben'))
    );
  }

  return { Theory };
}
