// Diagramme der Vokabel-App Access 2, Unit 6 (Kopie aus apps/englisch/diagrams.js, Format unverändert). Drei Bausteine, die Lektionen aus den Daten füllen:
//   flowDiagram   Kästen mit Pfeilen (Ablauf, zum Beispiel Zeitlinie eines Satzes)
//   tableDiagram  Tabelle mit Kopfzeile (Verbformen, Signalwörter)
//   swapDiagram   zwei Zeilen mit Pfeilen dazwischen (Aktiv und Passiv, direkte und indirekte Rede)
// Zeilenumbrüche in Texten mit "|". Die Bausteine liefern React-Elemente (komponenten/svg.js).
// Die Schrift ist für 375 px gerechnet: lesson.css setzt sie dort auf 20 Einheiten, das ergibt 12 px.
// Damit der Text in die Kästen passt, wird er umbrochen und die Kästen wachsen mit.
import { diagram, rect, text, arrow } from '../../komponenten/svg.js';

const FS = 20; // Schriftgröße in Diagramm-Einheiten (siehe Kommentar oben)
const LH = 24; // Zeilenabstand
const CHAR = 0.6 * FS; // grobe Breite eines Zeichens

const lines = (s) => String(s).split('|');

/** Zeilen für eine Breite in Diagramm-Einheiten. Umbruch nach Wörtern, "|" erzwingt einen Umbruch. */
function wrap(s, width) {
  const max = Math.max(4, Math.floor(width / CHAR));
  return lines(s).flatMap((part) => {
    const out = [];
    let cur = '';
    part.split(' ').forEach((word) => {
      const next = cur ? `${cur} ${word}` : word;
      if (next.length > max && cur) {
        out.push(cur);
        cur = word;
      } else {
        cur = next;
      }
    });
    out.push(cur);
    return out;
  });
}

// Zeilen als Text, vertikal um cy zentriert.
const block = (cx, cy, rows, cls) => rows.map((l, i) => text(cx, cy + (i - (rows.length - 1) / 2) * LH + FS * 0.35, l, cls));

/** Ablauf von links nach rechts. steps: Texte, der erste wird hervorgehoben. */
export function flowDiagram(steps, label = 'Ablauf') {
  const n = steps.length, gap = 36, w = Math.floor((500 - gap * (n - 1)) / n);
  const rows = steps.map((s) => wrap(s, w - 16));
  const h = Math.max(74, Math.max(...rows.map((r) => r.length)) * LH + 24);
  const parts = [];
  rows.forEach((r, i) => {
    const x = 10 + i * (w + gap);
    parts.push(rect(x, 30, w, h, i === 0 ? 'hi' : 'box', 10), ...block(x + w / 2, 30 + h / 2, r, `sm${i === 0 ? ' on-sun' : ''}`));
    if (i < n - 1) parts.push(arrow(x + w + 4, 30 + h / 2, x + w + gap - 4, 30 + h / 2));
  });
  return diagram(520, h + 60, label, parts);
}

/** Tabelle. widths: Anteile der Spalten (Summe egal). */
export function tableDiagram(head, rows, widths = head.map(() => 1), label = 'Tabelle') {
  const total = widths.reduce((a, b) => a + b, 0), W = 500;
  const xs = widths.map((_, i) => 10 + (widths.slice(0, i).reduce((a, b) => a + b, 0) / total) * W);
  const ws = widths.map((w) => (w / total) * W);
  const parts = [];
  const row = (cells, y, cls, tcls) => {
    const split = cells.map((c, i) => wrap(c, ws[i] - 12));
    const rh = Math.max(36, Math.max(...split.map((r) => r.length)) * LH + 12);
    split.forEach((r, i) => parts.push(rect(xs[i], y, ws[i], rh, cls, 6), ...block(xs[i] + ws[i] / 2, y + rh / 2, r, tcls)));
    return rh;
  };
  let y = 8;
  y += row(head, y, 'hi', 'sm on-sun') + 4;
  rows.forEach((r) => {
    y += row(r, y, 'box', 'sm') + 4;
  });
  return diagram(520, y + 4, label, parts);
}

/**
 * Zwei Zeilen mit Kästen. Pfeile verbinden oben[i] mit unten[map[i]]. Die Bezeichnung steht über jeder Zeile.
 * Jeder Kasten bekommt Platz für sein längstes Wort. Bleibt Restbreite, wird sie gleich verteilt.
 */
export function swapDiagram(top, bottom, map, labels = ['Aktiv', 'Passiv']) {
  const x0 = 10, width = 500, gap = 6, charW = 0.55 * FS;
  const place = (list) => {
    const need = list.map((t) => Math.max(...String(t).split(/[| ]/).map((w) => w.length)) * charW + 16);
    const sum = need.reduce((x, y) => x + y, 0), free = width - gap * (list.length - 1);
    const scale = sum <= free ? 1 : free / sum, extra = sum <= free ? (free - sum) / list.length : 0;
    let x = x0;
    return list.map((t, i) => {
      const w = need[i] * scale + extra;
      const p = { x, w, cx: x + w / 2, rows: wrap(t, w - 12) };
      x += w + gap;
      return p;
    });
  };
  const rowHeight = (list) => Math.max(56, Math.max(...list.map((p) => p.rows.length)) * LH + 16);
  const a = place(top), b = place(bottom);
  const ha = rowHeight(a), hb = rowHeight(b);
  const ya = 36, yb = ya + ha + 64;
  const parts = [text(60, ya - 12, labels[0], 'sm mu'), text(60, yb - 12, labels[1], 'sm mu')];
  a.forEach((p) => parts.push(rect(p.x, ya, p.w, ha, 'box', 8), ...block(p.cx, ya + ha / 2, p.rows, 'sm')));
  b.forEach((p, i) => parts.push(
    rect(p.x, yb, p.w, hb, map.includes(i) ? 'hi' : 'acc', 8),
    ...block(p.cx, yb + hb / 2, p.rows, map.includes(i) ? 'sm on-sun' : 'sm on-acc')
  ));
  map.forEach((j, i) => parts.push(arrow(a[i].cx, ya + ha + 4, b[j].cx, yb - 4)));
  return diagram(520, yb + hb + 14, `${labels[0]}: ${top.join(' ')}. ${labels[1]}: ${bottom.join(' ')}`, parts);
}
