// Kleine Geometrie-Helfer für die Diagramme. Koordinaten wie in SVG (y wächst nach unten), Winkel in Grad gegen den Uhrzeigersinn.
import { path, text } from '../../core/js/svg.js';

export const rad = (d) => (d * Math.PI) / 180;
export const f1 = (n) => Math.round(n * 10) / 10;
/** Punkt auf einem Kreis um (cx, cy) im Winkel deg. */
export const at = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Kreisbogen von Winkel a0 bis a1 (gegen den Uhrzeigersinn). */
export function arc(cx, cy, r, a0, a1, cls = 'ln-soft') {
  const [x0, y0] = at(cx, cy, r, a0), [x1, y1] = at(cx, cy, r, a1);
  return path(`M${f1(x0)} ${f1(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${f1(x1)} ${f1(y1)}`, cls);
}

export const segment = (a, b, cls = 'ln') => path(`M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}`, cls);
export const dot = (p, label, dx = 0, dy = -10) =>
  `<circle class="gp" cx="${f1(p[0])}" cy="${f1(p[1])}" r="4.5"/>${label ? text(p[0] + dx, p[1] + dy, label, 'md') : ''}`;
export const fullCircle = (c, r, cls = 'ln') => `<circle class="${cls}" cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}"/>`;

/** Kleines Quadrat für den rechten Winkel im Punkt p, zwischen den Richtungen d1 und d2 (Grad). */
export function rightAngle(p, d1, d2, s = 14) {
  const a = at(p[0], p[1], s, d1), b = at(p[0], p[1], s, d2), c = [a[0] + b[0] - p[0], a[1] + b[1] - p[1]];
  return path(`M${f1(a[0])} ${f1(a[1])} L${f1(c[0])} ${f1(c[1])} L${f1(b[0])} ${f1(b[1])}`, 'ln');
}

export const circumcenter = (A, B, C) => {
  const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const ux = ((A[0] ** 2 + A[1] ** 2) * (B[1] - C[1]) + (B[0] ** 2 + B[1] ** 2) * (C[1] - A[1]) + (C[0] ** 2 + C[1] ** 2) * (A[1] - B[1])) / d;
  const uy = ((A[0] ** 2 + A[1] ** 2) * (C[0] - B[0]) + (B[0] ** 2 + B[1] ** 2) * (A[0] - C[0]) + (C[0] ** 2 + C[1] ** 2) * (B[0] - A[0])) / d;
  return [ux, uy];
};

export function incircle(A, B, C) {
  const a = dist(B, C), b = dist(A, C), c = dist(A, B), s = a + b + c;
  const I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
  const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
  return { I, r: (2 * area) / s };
}
