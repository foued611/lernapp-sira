// Diagramme als React-Elemente. Farben kommen über CSS-Klassen (lesson.css), damit sie in hell und dunkel passen.
// Anders als legacy/modulare/core/js/svg.js:8-16 wird nichts als Text zusammengesetzt: Daten landen nur als
// React-Kinder oder Attribute und werden dadurch maskiert. Der Alternativtext ist Pflicht (AGENTS.md).
import { createElement } from 'react';

const h = createElement;

const SVG_NS = 'http://www.w3.org/2000/svg';

// Pfeilspitze wie in legacy svg.js:5. Die ID ist fest, deshalb teilen sich Diagramme auf einer Seite dieselbe Definition.
function arrowDefs() {
  return h(
    'defs',
    null,
    h(
      'marker',
      { id: 'arw', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' },
      h('path', { className: 'arw-head', d: 'M0 0 L10 5 L0 10 z' })
    )
  );
}

/**
 * Rahmen eines Diagramms. children darf verschachtelte Arrays enthalten (z. B. aus flatMap).
 * Ohne label wird nichts gezeichnet: ein Bild ohne Alternativtext ist nicht zugänglich.
 */
export function diagram(width, height, label, children = []) {
  if (typeof label !== 'string' || label.trim() === '') {
    throw new TypeError('Diagramm ohne Alternativtext: label fehlt (role="img" braucht aria-label).');
  }
  return h(
    'svg',
    { className: 'dg', viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': label, xmlns: SVG_NS },
    arrowDefs(),
    ...children.flat()
  );
}

// Die Helfer entsprechen legacy svg.js:11-16, geben aber Elemente statt Text zurück.
export const rect = (x, y, w, boxHeight, cls, r = 10) =>
  h('rect', { className: cls, x, y, width: w, height: boxHeight, rx: r });
export const circle = (x, y, r, cls) => h('circle', { className: cls, cx: x, cy: y, r });
export const text = (x, y, value, cls = 'md') => h('text', { className: cls, x, y }, String(value));
export const line = (x1, y1, x2, y2, cls = 'ln') => h('line', { className: cls, x1, y1, x2, y2 });
export const arrow = (x1, y1, x2, y2) => line(x1, y1, x2, y2, 'ar');
export const path = (d, cls = 'ln') => h('path', { className: cls, d });
