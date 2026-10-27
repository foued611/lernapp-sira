import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Lesson, checkFeedback } from '../lesson.js';
import { diagram, rect, text } from '../svg.js';
import { richText } from '../rich.js';

const h = createElement;

// Testdaten im Format von content/<id>/lessons.json (Felder wie in legacy lesson.js:8-19). Erfunden, keine Lernstoffe.
const full = {
  goal: 'Du kannst ein Beispiel durchrechnen.',
  tldr: ['Erster Satz.', 'Zweiter Satz mit <b>Fett</b>.'],
  analogy: { title: 'Stell dir vor: ein Vergleich', html: '<p>Ein Absatz.</p>' },
  figure: { diagram: { name: 'flow', args: [['A', 'B'], 'Ablauf'] }, caption: 'Bildunterschrift' },
  steps: { title: 'So geht es', items: ['Schritt eins', 'Schritt zwei', 'Schritt drei'] },
  pitfall: { html: '<p>Die Falle.</p>' },
  rule: 'Der Merksatz.',
  check: {
    q: 'Welche Antwort stimmt?',
    options: [
      { id: 'a', html: 'Antwort A' },
      { id: 'b', html: 'Antwort B' }
    ],
    answer: 'b',
    why: 'Weil B stimmt.'
  }
};

const diagrams = {
  flow: (steps, label) => diagram(520, 100, label, [rect(10, 10, 50, 20, 'box'), text(12, 20, steps.join(' '))])
};

const draw = (props) => renderToStaticMarkup(h(Lesson, props));

test('RULE-136 fehlende Lektion zeichnet nichts und meldet es über onProblem', () => {
  const problems = [];
  const markup = draw({ lesson: undefined, unitId: 'inhaltsangabe', onProblem: (p) => problems.push(p) });
  assert.equal(markup, '');
  assert.deepEqual(problems, [{ type: 'lesson', unitId: 'inhaltsangabe' }]);
});

test('RULE-136 fehlende Lektion erfindet keinen Ersatztext', () => {
  const markup = draw({ lesson: null, unitId: 'x' });
  assert.equal(markup, '');
  assert.doesNotMatch(markup, /Ziel|In 30 Sekunden|Mini-Check/);
});

test('RULE-136 fehlende optionale Teile werden nicht gezeichnet und nicht ersetzt', () => {
  const markup = draw({ lesson: { goal: 'Nur ein Ziel.' } });
  assert.match(markup, /Nur ein Ziel\./);
  assert.doesNotMatch(markup, /In 30 Sekunden|Stell dir vor|Typische Falle|Merksatz|Mini-Check|Schritt/);
  assert.doesNotMatch(markup, /<figure|<ol|<button/);
});

test('RULE-136 unbekanntes Diagramm entfällt ohne Ersatzbild und wird gemeldet', () => {
  const problems = [];
  const markup = draw({ lesson: full, unitId: 'x', diagrams: {}, onProblem: (p) => problems.push(p) });
  // Minou ist auch ein svg, deshalb nur die Diagrammklasse prüfen.
  assert.doesNotMatch(markup, /<figure|<svg class="dg"/);
  assert.deepEqual(problems, [{ type: 'diagram', name: 'flow' }]);
});

test('RULE-136 Diagramm, das beim Zeichnen fehlschlägt, bricht die Seite nicht ab', () => {
  const problems = [];
  const broken = { flow: () => diagram(10, 10, '', []) };
  const markup = draw({ lesson: full, unitId: 'x', diagrams: broken, onProblem: (p) => problems.push(p) });
  assert.match(markup, /In 30 Sekunden/);
  assert.equal(problems.length, 1);
  assert.equal(problems[0].type, 'diagram');
});

test('RULE-136 Inhalts-HTML wird nur für erlaubte Tags übersetzt, Fremdes bleibt Text', () => {
  const markup = renderToStaticMarkup(h('div', null, richText('<script>alert(1)</script> <b>fett</b> <img src=x onerror=y>')));
  assert.match(markup, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(markup, /<b>fett<\/b>/);
  assert.match(markup, /&lt;img src=x onerror=y&gt;/);
  assert.doesNotMatch(markup, /<script|<img/);
});

test('RULE-136 offene erlaubte Tags werden am Ende geschlossen', () => {
  assert.equal(renderToStaticMarkup(h('div', null, richText('<p>offen'))), '<div><p>offen</p></div>');
});

test('RULE-136 vollständige Lektion zeigt alle Teile in fester Reihenfolge', () => {
  const markup = draw({ lesson: full, unitId: 'x', diagrams });
  const order = ['Ziel', 'In 30 Sekunden', 'Stell dir vor: ein Vergleich', 'Bildunterschrift', 'So geht es', 'Typische Falle', 'Merksatz', 'Mini-Check'];
  const positions = order.map((s) => markup.indexOf(s));
  assert.ok(positions.every((p) => p >= 0), `alle Teile vorhanden: ${positions}`);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(markup, /<svg class="dg"/);
});

test('KOMP-A11Y Schritte: nur der erste ist sichtbar, der Knopf zeigt den nächsten', () => {
  const markup = draw({ lesson: full, unitId: 'x', diagrams });
  // Zwei spätere Schritte und die leere Rückmeldung der Mini-Check-Frage (legacy: hidden) sind ausgeblendet.
  assert.equal(markup.split('hidden=""').length - 1, 3, 'zwei Schritte und die leere Rückmeldung sind versteckt');
  assert.match(markup, /<button type="button" class="btn ghost small">Nächster Schritt<\/button>/);
});

test('KOMP-A11Y Mini-Check: Rückmeldung ist eine Statusmeldung und ihr Text sagt richtig oder falsch', () => {
  const markup = draw({ lesson: full, unitId: 'x', diagrams });
  assert.match(markup, /class="lsn-fb" role="status"/);
  assert.match(markup, /role="group" aria-label="Antwortmöglichkeiten"/);
  assert.equal(checkFeedback(full.check, 'b').text, 'Richtig! Weil B stimmt.');
  assert.equal(checkFeedback(full.check, 'a').text, 'Nicht ganz. Weil B stimmt.');
  assert.equal(checkFeedback(full.check, 'a').right, false);
});

test('KOMP-A11Y Mini-Check: Antwortknöpfe sind echte Schaltflächen', () => {
  const markup = draw({ lesson: full, unitId: 'x', diagrams });
  assert.equal(markup.split('<button type="button" class="opt"').length - 1, 2);
  assert.doesNotMatch(markup, /data-lsn|onclick/i);
});
