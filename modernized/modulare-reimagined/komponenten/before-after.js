// Vorher-Nachher-Diagramm (RULE-266). Legacy: legacy/modulare/apps/deutsch/diagrams.js:35-47.
// Oben und unten je eine Reihe Kästen. Ein Pfeil führt von top[i] zu bottom[map[i]].
// Ziel-Kästen sind hervorgehoben ('hi'), alle übrigen unten bekommen 'acc'.
// Abweichung: Ein ungültiger Index in map erzeugt keinen Pfeil. Legacy stürzt dabei ab (diagrams.js:45).
import { diagram, rect, text, arrow } from './svg.js';

const lines = (value) => String(value).split('|');

// Mehrzeilige Texte, mit "|" getrennt. Zentriert um cy (legacy diagrams.js:9).
function multiLine(cx, cy, value, cls) {
  const parts = lines(value);
  return parts.map((l, i) => text(cx, cy + (i - (parts.length - 1) / 2) * 18 + 5, l, cls));
}

const isIndex = (value, length) => Number.isInteger(value) && value >= 0 && value < length;

export function swapDiagram(top, bottom, map, labels = ['Aktiv', 'Passiv']) {
  if (!Array.isArray(top) || !Array.isArray(bottom) || !Array.isArray(map)) {
    throw new TypeError('swapDiagram: top, bottom und map müssen Listen sein.');
  }
  if (top.length === 0 || bottom.length === 0) {
    throw new TypeError('swapDiagram: beide Reihen brauchen mindestens einen Kasten.');
  }
  const [topLabel = 'Aktiv', bottomLabel = 'Passiv'] = labels;

  // Gleiche Geometrie wie legacy diagrams.js:37-41.
  const place = (list, y) =>
    list.map((t, i) => {
      const w = Math.floor(440 / list.length) - 8;
      const x = 70 + (i * 440) / list.length + 4;
      return { x, w, y, t, cx: x + w / 2 };
    });
  const upper = place(top, 20);
  const lower = place(bottom, 130);

  // Nur Paare, deren Indizes in beiden Reihen liegen. Die übrigen werden still übergangen.
  const pairs = map
    .map((j, i) => ({ i, j }))
    .filter(({ i, j }) => isIndex(i, top.length) && isIndex(j, bottom.length));
  const targets = new Set(pairs.map(({ j }) => j));

  const labelled = [
    text(34, 62, topLabel, 'sm mu'),
    text(34, 172, bottomLabel, 'sm mu')
  ];
  const upperBoxes = upper.flatMap((p) => [rect(p.x, p.y, p.w, 56, 'box', 8), ...multiLine(p.cx, p.y + 28, p.t, 'sm')]);
  const lowerBoxes = lower.flatMap((p, j) => {
    const target = targets.has(j);
    return [
      rect(p.x, p.y, p.w, 56, target ? 'hi' : 'acc', 8),
      ...multiLine(p.cx, p.y + 28, p.t, target ? 'sm on-sun' : 'sm on-acc')
    ];
  });
  // Pfeile zuletzt, damit sie über den Kästen liegen (legacy diagrams.js:45).
  const arrows = pairs.map(({ i, j }) => arrow(upper[i].cx, 80, lower[j].cx, 126));

  // Die Beschreibung für Screenreader enthält keine Trennzeichen (legacy diagrams.js:46).
  const label = `${topLabel}: ${top.join(' ')}. ${bottomLabel}: ${bottom.join(' ')}`.replace(/\|/g, ' ');
  return diagram(520, 200, label, [labelled, upperBoxes, lowerBoxes, arrows]);
}
