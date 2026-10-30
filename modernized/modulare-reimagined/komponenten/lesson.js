// Lektion (legacy/modulare/core/js/lesson.js:22-72). Reihenfolge: Ziel, In 30 Sekunden, Stell dir vor,
// Bild, [Spielzeug], Schritt für Schritt, Falle und Merksatz, Mini-Check.
// Jeder Teil ist optional. Fehlt er, wird er nicht gezeichnet, ohne Ersatztext (RULE-136).
// Fehlt die ganze Lektion, wird nichts gezeichnet und onProblem meldet es. Eine Ersatzlektion gibt es nicht.
import { createElement, Fragment, useState } from 'react';
import { Mascot } from './mascot.js';
import { richText } from './rich.js';
import { Button } from './ui.js';

const h = createElement;

const report = (onProblem, problem) => {
  if (typeof onProblem === 'function') onProblem(problem);
};

const section = (cls, ...children) => h('section', { className: `card lsn ${cls}` }, ...children);

const hash = (text) => [...text].reduce((sum, c) => Math.imul(sum ^ c.codePointAt(0), 16777619) >>> 0, 2166136261);

/**
 * Antworten des Mini-Checks in fester, aber je Frage anderer Reihenfolge. In den Daten steht die richtige oft zuerst.
 * Ohne Zufall: Die Lektion hat kein rng und soll beim Neuzeichnen nicht springen.
 */
export const checkOptions = (check) => [...check.options].sort((a, b) => hash(a.id + check.q) - hash(b.id + check.q));

/**
 * Rückmeldung zur Mini-Prüfung. Der Text sagt "Richtig!" oder "Nicht ganz.", die Farbe ist nur Zusatz (KOMP-A11Y).
 * Legacy: lesson.js:61-70.
 */
export function checkFeedback(check, chosenId) {
  const right = chosenId === check.answer;
  return { right, text: `${right ? 'Richtig! ' : 'Nicht ganz. '}${check.why || ''}` };
}

/**
 * Diagramm-Verweis { diagram: { name, args } } über die Diagrammliste der App (AGENTS.md: Diagramme in logic.js).
 * Unbekannter Name oder Fehler beim Zeichnen: kein Bild, und die App bekommt eine Meldung.
 */
function resolveFigure(figure, diagrams, onProblem) {
  // buildConfig zeichnet Verweise schon beim Laden und legt das Bild als svg ab (inhalte/src/appconfig.js).
  if (figure && figure.svg) return figure.svg;
  const ref = figure && figure.diagram;
  if (!ref) return null;
  const make = diagrams && Object.hasOwn(diagrams, ref.name) ? diagrams[ref.name] : null;
  if (typeof make !== 'function') {
    report(onProblem, { type: 'diagram', name: ref.name });
    return null;
  }
  try {
    return make(...(Array.isArray(ref.args) ? ref.args : []));
  } catch (error) {
    report(onProblem, { type: 'diagram', name: ref.name, error: error.message });
    return null;
  }
}

/**
 * @param {{ lesson?: object, unitId?: string, diagrams?: object, toy?: object, onProblem?: Function }} props
 *   toy: optionales Spielzeug der App, wird nach dem Bild gezeigt (kein Pflichtteil).
 */
export function Lesson({ lesson, unitId, diagrams, toy, onProblem }) {
  const [shown, setShown] = useState(1);
  const [answer, setAnswer] = useState(null);

  if (!lesson || typeof lesson !== 'object') {
    // Die Meldung entsteht im Render. Sie ist idempotent und ändert nichts am Ergebnis.
    report(onProblem, { type: 'lesson', unitId });
    return null;
  }

  // Oberer Teil: Ziel, 30 Sekunden, Vergleich, Bild.
  const goal = lesson.goal
    ? h('section', { className: 'lsn-goal' }, h('span', { className: 'lsn-flag' }, 'Ziel'), ' ', lesson.goal)
    : null;
  const tldr =
    Array.isArray(lesson.tldr) && lesson.tldr.length > 0
      ? section(
          'lsn-tldr',
          h(
            'div',
            { className: 'lsn-who' },
            h(Mascot, { mood: 'happy' }),
            h(
              'div',
              null,
              h('h2', null, 'In 30 Sekunden'),
              h('ul', null, ...lesson.tldr.map((t, i) => h('li', { key: i }, richText(t))))
            )
          )
        )
      : null;
  const analogy =
    lesson.analogy && typeof lesson.analogy === 'object'
      ? section(
          'lsn-analogy',
          lesson.analogy.title ? h('h2', null, lesson.analogy.title) : null,
          h('div', { className: 'lsn-body' }, richText(lesson.analogy.html))
        )
      : null;
  const drawn = resolveFigure(lesson.figure, diagrams, onProblem);
  const figure = drawn
    ? h('figure', { className: 'card lsn lsn-fig' }, drawn, lesson.figure.caption ? h('figcaption', null, richText(lesson.figure.caption)) : null)
    : null;

  // Unterer Teil: Schritte, Falle und Merksatz, Mini-Check.
  const items = lesson.steps && Array.isArray(lesson.steps.items) ? lesson.steps.items : [];
  const steps = items.length
    ? section(
        'lsn-steps',
        lesson.steps.title ? h('h2', null, lesson.steps.title) : null,
        h(
          'ol',
          { className: 'lsn-list' },
          ...items.map((t, i) =>
            h(
              'li',
              { key: i, className: i === 0 ? '' : 'later', hidden: i >= shown ? true : undefined },
              h('span', { className: 'n' }, String(i + 1)),
              h('div', null, richText(t))
            )
          )
        ),
        items.length > 1 && shown < items.length
          ? h(Button, { variant: 'ghost', small: true, onClick: () => setShown((s) => Math.min(items.length, s + 1)) }, 'Nächster Schritt')
          : null
      )
    : null;
  const pitfall =
    lesson.pitfall && lesson.pitfall.html
      ? section('lsn-pit', h('h2', null, 'Typische Falle'), h('div', { className: 'lsn-body' }, richText(lesson.pitfall.html)))
      : null;
  const rule = lesson.rule ? section('lsn-rule', h('h2', null, 'Merksatz'), h('p', { className: 'lsn-mark' }, richText(lesson.rule))) : null;
  const twoColumns = pitfall || rule ? h('div', { className: 'lsn-two' }, pitfall, rule) : null;

  const check = lesson.check && Array.isArray(lesson.check.options) && lesson.check.options.length > 0 ? lesson.check : null;
  const feedback = check && answer !== null ? checkFeedback(check, answer) : null;
  const checkBlock = check
    ? section(
        'lsn-check',
        h('h2', null, 'Mini-Check'),
        h('p', { className: 'lsn-q' }, richText(check.q)),
        h(
          'div',
          { className: 'opts lsn-opts', role: 'group', 'aria-label': 'Antwortmöglichkeiten' },
          ...checkOptions(check).map((o) => {
            // Nach der Antwort sind alle Knöpfe gesperrt. Richtig und falsch bekommen eine Klasse, der Text sagt es auch.
            let state = '';
            if (answer !== null) {
              if (o.id === check.answer) state = ' right';
              else if (o.id === answer) state = ' wrong';
            }
            return h(
              'button',
              {
                key: o.id,
                type: 'button',
                className: `opt${state}`,
                disabled: answer !== null,
                onClick: () => setAnswer(o.id)
              },
              richText(o.html)
            );
          })
        ),
        // Die Rückmeldung ist immer im Baum, damit Screenreader die Änderung als Statusmeldung vorlesen.
        // Ohne Antwort ist sie ausgeblendet (wie legacy lesson.js), sonst bleibt ein leerer Abstand unter den Antworten.
        h('div', { className: feedback ? `lsn-fb ${feedback.right ? 'ok' : 'bad'}` : 'lsn-fb', role: 'status', hidden: !feedback }, feedback ? feedback.text : '')
      )
    : null;

  return h(Fragment, null, goal, tldr, analogy, figure, toy ? h(Fragment, null, toy) : null, steps, twoColumns, checkBlock);
}
