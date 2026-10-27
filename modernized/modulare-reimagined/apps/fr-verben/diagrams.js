// Diagramme des Cahier de Verbes (Herkunft: legacy/modulare/apps/franzoesisch-verben/diagrams.js).
// Die Bausteine liefern React-Elemente (komponenten/svg.js). Farben kommen über die CSS-Klassen aus
// komponenten/lektion.css, damit sie in hell und dunkel passen. Zahlen und Formen kommen aus dem Modell.
import { diagram, rect, text } from '../../komponenten/svg.js';
import { V, PRON } from './model.js';

const VOWEL = /^[aeiouhéèêàâîôû]/i;
const SHORT = ['je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'];

/** Sechs Personen in zwei Reihen (Einzahl oben, Mehrzahl unten). hi = Positionen, die auffallen sollen. */
export function personDiagram(key, hi = []) {
  const v = V[key];
  const parts = [text(260, 22, 'Einzahl', 'sm mu'), text(260, 152, 'Mehrzahl', 'sm mu')];
  v.forms.forEach((form, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 14 + col * 170, y = 32 + row * 134;
    const on = hi.includes(i);
    const shown = i === 0 && VOWEL.test(form) ? `j'${form}` : form;
    parts.push(
      rect(x, y, 160, 96, on ? 'hi' : 'box'),
      text(x + 80, y + 22, SHORT[i], `sm ${on ? 'on-sun' : 'mu'}`),
      text(x + 80, y + 58, shown, `lg${on ? ' on-sun' : ''}`),
      text(x + 80, y + 82, v.deF[i], `sm ${on ? 'on-sun' : 'mu'}`)
    );
  });
  return diagram(520, 270, `Die Formen von ${v.inf} im Présent: ${v.forms.map((f, i) => `${PRON[i]} ${f}`).join(', ')}`, parts);
}

/** Stamm plus Endung. rows: [{ inf, stem, ends, silent }]. silent = Positionen, die man nicht hört (grau). */
export function endingsDiagram(rows) {
  const parts = [];
  rows.forEach((row, r) => {
    const y = 36 + r * 124;
    // Die Grundform steht zentriert über der Zeile, damit sie nicht in die Endungen läuft.
    parts.push(text(260, y - 12, row.inf, 'sm mu'), rect(8, y + 22, 104, 62, 'acc'), text(60, y + 62, `${row.stem}-`, 'lg on-acc'));
    row.ends.forEach((end, i) => {
      const x = 124 + i * 65;
      const quiet = (row.silent || []).includes(i);
      const label = SHORT[i].replace(' / elle / on', '').replace(' / elles', '');
      // Lange Endungen (-issons) werden auf zwei Zeilen verteilt, sonst laufen sie über die Kästen.
      const pieces = end && end.length > 4 ? [`-${end.slice(0, 3)}`, end.slice(3)] : [end ? `-${end}` : '–'];
      parts.push(
        text(x + 29, y + 12, label, 'sm mu'),
        rect(x, y + 22, 58, 62, quiet ? 'box-soft' : 'hi', 12),
        ...pieces.map((p, k) => text(x + 29, y + 62 + (k - (pieces.length - 1) / 2) * 24, p, `${pieces.length > 1 || end.length > 3 ? 'sm' : 'md'} mono${quiet ? ' mu' : ' on-sun'}`))
      );
    });
  });
  const height = rows.length * 124 + 62;
  parts.push(text(260, height - 30, 'Grau: Diese Endung hörst du nicht,', 'sm mu'), text(260, height - 8, 'du musst sie aber schreiben.', 'sm mu'));
  const label = `Stamm und Endungen: ${rows.map((r) => `${r.inf} hat den Stamm ${r.stem} mit den Endungen ${r.ends.map((e) => e || 'keine').join(', ')}`).join('. ')}`;
  return diagram(520, height, label, parts);
}
