// Diagramme der Deutsch-Werkstatt (Herkunft: legacy/modulare/apps/deutsch/diagrams.js). Drei flexible Bausteine,
// die Lektionen aus den Daten füllen:
//   flowDiagram   Kästen mit Pfeilen (Ablauf)
//   tableDiagram  Tabelle mit Kopfzeile
//   swapDiagram   zwei Zeilen mit Pfeilen dazwischen (z. B. Aktiv und Passiv)
// Zeilenumbrüche in Texten mit "|". Die Bausteine liefern React-Elemente (komponenten/svg.js).
import { diagram, rect, text, arrow } from '../../komponenten/svg.js';

const lines = (s) => String(s).split('|');
const multi = (cx, cy, s, cls) => lines(s).map((l, i, all) => text(cx, cy + (i - (all.length - 1) / 2) * 18 + 5, l, cls));

/** Ablauf von links nach rechts. steps: Texte, der erste kann hervorgehoben werden. */
export function flowDiagram(steps, label = 'Ablauf') {
  const n = steps.length, gap = 36, w = Math.floor((500 - gap * (n - 1)) / n), h = 74;
  const parts = [];
  steps.forEach((s, i) => {
    const x = 10 + i * (w + gap);
    parts.push(rect(x, 30, w, h, i === 0 ? 'hi' : 'box', 10), ...multi(x + w / 2, 30 + h / 2, s, `sm${i === 0 ? ' on-sun' : ''}`));
    if (i < n - 1) parts.push(arrow(x + w + 4, 30 + h / 2, x + w + gap - 4, 30 + h / 2));
  });
  return diagram(520, 134, `${label}: ${steps.map((s) => lines(s).join(' ')).join(', dann ')}`, parts);
}

/** Tabelle. widths: Anteile der Spalten (Summe egal). */
export function tableDiagram(head, rows, widths = head.map(() => 1), label = 'Tabelle') {
  const total = widths.reduce((a, b) => a + b, 0), W = 500, rh = 36;
  const xs = widths.map((_, i) => 10 + (widths.slice(0, i).reduce((a, b) => a + b, 0) / total) * W);
  const ws = widths.map((w) => (w / total) * W);
  const parts = [];
  const row = (cells, y, cls, tcls) => cells.forEach((c, i) => parts.push(rect(xs[i], y, ws[i], rh, cls, 6), text(xs[i] + ws[i] / 2, y + 23, c, tcls)));
  row(head, 8, 'hi', 'sm on-sun');
  rows.forEach((r, k) => row(r, 8 + (k + 1) * (rh + 4), 'box', 'sm'));
  return diagram(520, 16 + (rows.length + 1) * (rh + 4), `${label}: ${head.join(', ')}. ${rows.map((r) => r.join(' - ')).join('; ')}`, parts);
}

/** Zwei Zeilen mit Kästen. Pfeile verbinden oben[i] mit unten[map[i]]. */
export function swapDiagram(top, bottom, map, labels = ['Aktiv', 'Passiv']) {
  const place = (list, y) => list.map((t, i) => {
    const w = Math.floor(440 / list.length) - 8, x = 70 + (i * 440) / list.length + 4;
    return { x, w, y, t, cx: x + w / 2 };
  });
  const a = place(top, 20), b = place(bottom, 130);
  const parts = [text(34, 62, labels[0], 'sm mu'), text(34, 172, labels[1], 'sm mu')];
  a.forEach((p) => parts.push(rect(p.x, p.y, p.w, 56, 'box', 8), ...multi(p.cx, p.y + 28, p.t, 'sm')));
  b.forEach((p, i) => parts.push(
    rect(p.x, p.y, p.w, 56, map.includes(i) ? 'hi' : 'acc', 8),
    ...multi(p.cx, p.y + 28, p.t, map.includes(i) ? 'sm on-sun' : 'sm on-acc')
  ));
  map.forEach((j, i) => parts.push(arrow(a[i].cx, 80, b[j].cx, 126)));
  return diagram(520, 200, `${labels[0]}: ${top.join(' ')}. ${labels[1]}: ${bottom.join(' ')}`.replace(/\|/g, ' '), parts);
}
