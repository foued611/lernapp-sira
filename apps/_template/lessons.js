// Lektionen der Vorlage. Pro Seite eine Beschreibung mit allen Pflichtteilen (siehe core/js/lesson.js).
// Ersetze Texte und Diagramm. Lass keinen Teil weg: Der Vertragstest prüft sie alle.
import { svg, rect, text } from '../../core/js/svg.js';

const picture = (a, b, op) => svg(520, 120,
  rect(40, 30, 120, 60, 'box') + text(100, 70, String(a), 'lg mono') +
  text(200, 70, op, 'lg') +
  rect(240, 30, 120, 60, 'box') + text(300, 70, String(b), 'lg mono') +
  text(400, 70, '=', 'lg') +
  rect(430, 30, 80, 60, 'hi') + text(470, 70, String(op === '+' ? a + b : a * b), 'lg mono on-sun'),
  `Rechnung ${a} ${op} ${b}`);

const make = (op, a, b, title) => ({
  goal: `Du kannst ${title} erklären und ein Beispiel selbst rechnen.`,
  tldr: ['Hier steht die Kernidee in einem kurzen Satz.', 'Hier der zweite Satz mit dem wichtigsten Merkmal.'],
  analogy: { title: 'Stell dir vor: ein Beispiel aus dem Alltag', html: '<p>Ein Vergleich, den ein 13-Jähriger sofort versteht.</p>' },
  figure: { svg: picture(a, b, op), caption: 'Bildunterschrift: Was zeigt das Bild?' },
  steps: { title: 'So geht es Schritt für Schritt', items: ['Erster Schritt.', 'Zweiter Schritt.', 'Ergebnis und Probe.'] },
  pitfall: { html: '<p>Der häufigste Fehler und wie man ihn vermeidet.</p>' },
  rule: 'Ein Merksatz zum Einprägen.',
  check: { q: `Wie viel ist ${a} ${op} ${b}?`, options: [{ id: String(op === '+' ? a + b : a * b), html: String(op === '+' ? a + b : a * b) }, { id: '0', html: '0' }, { id: '1', html: '1' }], answer: String(op === '+' ? a + b : a * b), why: 'Kurze Erklärung der richtigen Antwort.' }
});

export const LESSONS = { start: make('+', 2, 3, 'das Addieren'), weiter: make('×', 2, 3, 'das Multiplizieren') };
