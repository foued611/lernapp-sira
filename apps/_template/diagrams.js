// Diagramme der Vorlage. Eine Lektion verweist in lessons.json mit { "diagram": { "name": "sumDiagram", "args": [2, 3, "+"] } } darauf.
import { svg, rect, text } from '../../core/js/svg.js';

export function sumDiagram(a, b, op) {
  const result = op === '+' ? a + b : a * b;
  return svg(520, 120,
    rect(40, 30, 120, 60, 'box') + text(100, 70, String(a), 'lg mono') +
    text(200, 70, op, 'lg') +
    rect(240, 30, 120, 60, 'box') + text(300, 70, String(b), 'lg mono') +
    text(400, 70, '=', 'lg') +
    rect(430, 30, 80, 60, 'hi') + text(470, 70, String(result), 'lg mono on-sun'),
    `Rechnung ${a} ${op} ${b}`);
}
