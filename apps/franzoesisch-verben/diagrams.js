// Diagramme des Cahier de Verbes (SVG-Text, siehe core/js/svg.js).
import { svg, rect, text } from '../../core/js/svg.js';
import { V, PRON } from './model.js';

const VOWEL = /^[aeiouhéèêàâîôû]/i;
const SHORT = ['je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'];

/** Sechs Personen in zwei Reihen (Einzahl oben, Mehrzahl unten). hi = Positionen, die auffallen sollen. */
export function personDiagram(key, hi = []) {
  const v = V[key];
  let out = text(260, 22, 'Einzahl', 'sm mu') + text(260, 152, 'Mehrzahl', 'sm mu');
  v.forms.forEach((form, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 14 + col * 170, y = 32 + row * 134;
    const shown = i === 0 && VOWEL.test(form) ? `j'${form}` : form;
    out += rect(x, y, 160, 96, hi.includes(i) ? 'hi' : 'box');
    out += text(x + 80, y + 22, SHORT[i], `sm ${hi.includes(i) ? 'on-sun' : 'mu'}`);
    out += text(x + 80, y + 58, shown, `lg${hi.includes(i) ? ' on-sun' : ''}`);
    out += text(x + 80, y + 82, v.deF[i], `sm ${hi.includes(i) ? 'on-sun' : 'mu'}`);
  });
  return svg(520, 270, out, `Die Formen von ${v.inf} im Présent: ${v.forms.map((f, i) => `${PRON[i]} ${f}`).join(', ')}`);
}

/**
 * Stamm plus Endung. rows: [{ inf, stem, ends, silent }]. silent = Positionen, die man nicht hört (grau).
 */
export function endingsDiagram(rows) {
  let out = '';
  rows.forEach((row, r) => {
    const y = 14 + r * 124;
    out += text(60, y + 12, row.inf, 'sm mu');
    out += rect(8, y + 22, 104, 62, 'acc');
    out += text(60, y + 62, row.stem + '-', 'lg on-acc');
    row.ends.forEach((end, i) => {
      const x = 124 + i * 65;
      const quiet = (row.silent || []).includes(i);
      out += text(x + 29, y + 12, SHORT[i].replace(' / elle / on', '').replace(' / elles', ''), 'sm mu');
      out += rect(x, y + 22, 58, 62, quiet ? 'box-soft' : 'hi', 12);
      out += text(x + 29, y + 62, end ? '-' + end : '–', `${end.length > 3 ? 'sm' : 'md'} mono${quiet ? ' mu' : ' on-sun'}`);
    });
  });
  const height = rows.length * 124 + 18;
  out += text(260, height - 6, 'Grau: Diese Endung hörst du nicht, du musst sie aber schreiben.', 'sm mu');
  return svg(520, height + 8, out, `Stamm und Endungen: ${rows.map((r) => `${r.inf} hat den Stamm ${r.stem} mit den Endungen ${r.ends.map((e) => e || 'keine').join(', ')}`).join('. ')}`);
}
