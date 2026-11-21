// Vergleich zweier Zeichnungen der Schildkröte: Eine Mission gilt als geschafft, wenn Siras Linien dieselben Stellen
// bedecken wie die Musterlösung. Reihenfolge, Richtung und Aufteilung der Linien spielen keine Rolle, nur das Bild.
// Die Zeichnung wird dafür in kleine Felder zerlegt (CELL). Ein Feld zählt als getroffen, wenn im Nachbarfeld
// gezeichnet wurde, damit Rundungen bei Winkeln wie 360/7 nicht stören.

export const CELL = 4;
const COVER_MIN = 0.97;
const EXTRA_MAX = 0.03;

const key = (cx, cy) => `${cx},${cy}`;

/** Menge der Felder, die eine Zeichnung berührt (Linien und Punkte). */
export function cellsOf({ segments = [], dots = [] }) {
  const cells = new Set();
  const add = (x, y) => cells.add(key(Math.round(x / CELL), Math.round(y / CELL)));
  for (const s of segments) {
    const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
    const n = Math.max(1, Math.ceil(len / (CELL / 2)));
    for (let i = 0; i <= n; i++) add(s.x1 + ((s.x2 - s.x1) * i) / n, s.y1 + ((s.y2 - s.y1) * i) / n);
  }
  for (const d of dots) add(d.x, d.y);
  return cells;
}

const near = (set, cell) => {
  const [cx, cy] = cell.split(',').map(Number);
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (set.has(key(cx + dx, cy + dy))) return true;
  return false;
};

/**
 * Vergleicht Siras Zeichnung mit dem Ziel.
 * @returns {{ ok: boolean, cover: number, extra: number, empty: boolean }} cover: Anteil des Ziels, der gezeichnet ist.
 * extra: Anteil der eigenen Zeichnung, der nicht zum Ziel gehört.
 */
export function compareDrawings(target, mine) {
  const t = cellsOf(target);
  const m = cellsOf(mine);
  if (!m.size || !t.size) return { ok: false, cover: 0, extra: m.size ? 1 : 0, empty: !m.size };
  let hit = 0;
  t.forEach((c) => { if (near(m, c)) hit++; });
  let extra = 0;
  m.forEach((c) => { if (!near(t, c)) extra++; });
  const cover = hit / t.size;
  const extraShare = extra / m.size;
  return { ok: cover >= COVER_MIN && extraShare <= EXTRA_MAX, cover, extra: extraShare, empty: false };
}

/** Sichtfenster (viewBox) um eine oder mehrere Zeichnungen, mit Rand und mindestens 240 x 240. */
export function boundsOf(...drawings) {
  let minX = -120; let maxX = 120; let minY = -120; let maxY = 120;
  for (const d of drawings) {
    const pts = [...(d.segments || []).flatMap((s) => [[s.x1, s.y1], [s.x2, s.y2]]), ...(d.dots || []).map((p) => [p.x, p.y])];
    for (const [x, y] of pts) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  }
  const pad = 24;
  const w = maxX - minX + 2 * pad;
  const h = maxY - minY + 2 * pad;
  const size = Math.max(w, h);
  return { x: (minX + maxX) / 2 - size / 2, y: (minY + maxY) / 2 - size / 2, size };
}
