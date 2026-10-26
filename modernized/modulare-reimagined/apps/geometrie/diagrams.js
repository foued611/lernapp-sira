// Konstruktionsbilder der Geometrie-Werkstatt (Herkunft: legacy/modulare/apps/geometrie/diagrams.js).
// Alle Punkte werden berechnet, nicht von Hand getippt.
import { diagram, text, path, line, rect, arrow } from '../../komponenten/svg.js';
import { at, arc, segment, dot, fullCircle, rightAngle, circumcenter, incircle, dist, f1, rad } from './geom.js';

/** Mittelsenkrechte: zwei Bögen mit gleichem Radius, Gerade durch die Schnittpunkte. */
export function perpDiagram() {
  const A = [90, 150], B = [370, 150], M = [230, 150], r = 170, h = Math.sqrt(r * r - 140 * 140), th = (Math.acos(140 / r) * 180) / Math.PI;
  const P = [230, 150 - h], Q = [230, 150 + h];
  return diagram(520, 300, 'Mittelsenkrechte der Strecke AB: Zwei Kreisbögen mit gleichem Radius um A und B schneiden sich in zwei Punkten, durch sie läuft die Gerade. Der Punkt P ist von A und B gleich weit entfernt.', [
    segment(A, B), arc(A[0], A[1], r, -th - 14, th + 14), arc(B[0], B[1], r, 180 - th - 14, 180 + th + 14),
    line(230, 20, 230, 280, 'gl'), rightAngle(M, 90, 0, 14),
    segment(A, P, 'ln-soft'), segment(B, P, 'ln-soft'),
    text(150, 100, 'gleich lang', 'sm mu'), text(318, 100, 'gleich lang', 'sm mu'),
    ...dot(A, 'A', -4, 24), ...dot(B, 'B', 4, 24), ...dot(M, 'M', 16, 24), ...dot(P, 'P', 16, -2), ...dot(Q, '', 0, 0)
  ]);
}

/** Winkelhalbierende eines Winkels von deg Grad. */
export function bisectorDiagram(deg = 70) {
  const S = [70, 210], h = deg / 2, r0 = 70, r1 = 80;
  const U = at(S[0], S[1], r0, 0), V = at(S[0], S[1], r0, deg);
  // Abstand d des Schnittpunkts W auf der Winkelhalbierenden: |W-U| = r1
  const c = Math.cos(rad(h)), disc = (r0 * c) ** 2 - (r0 * r0 - r1 * r1);
  const d = r0 * c + Math.sqrt(disc), W = at(S[0], S[1], d, h);
  const ang = (P, Q) => (Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * 180) / Math.PI;
  const L1 = at(S[0], S[1], 78, h / 2), L2 = at(S[0], S[1], 90, h + h / 2);
  return diagram(520, 290, `Winkelhalbierende: Ein Winkel von ${deg} Grad wird durch einen Bogen um den Scheitel und zwei gleich große Bögen in zwei Winkel von je ${f1(h)} Grad geteilt.`, [
    segment(S, at(S[0], S[1], 400, 0)), segment(S, at(S[0], S[1], 400, deg)),
    arc(S[0], S[1], r0, -6, deg + 6), arc(U[0], U[1], r1, ang(U, W) - 14, ang(U, W) + 14), arc(V[0], V[1], r1, ang(V, W) - 14, ang(V, W) + 14),
    segment(S, at(S[0], S[1], 380, h), 'gl'),
    arc(S[0], S[1], 36, 2, h - 2, 'gc'), arc(S[0], S[1], 46, h + 2, deg - 2, 'gc'),
    text(L1[0], L1[1] + 5, `${f1(h)}°`, 'sm'), text(L2[0] - 2, L2[1] + 2, `${f1(h)}°`, 'sm'),
    ...dot(S, 'S', -14, 24), ...dot(U, '', 0, 0), ...dot(V, '', 0, 0), ...dot(W, 'W', 14, -4),
    text(330, 270, `Winkel ${deg}° geteilt in zweimal ${f1(h)}°`, 'md mono')
  ]);
}

/** Dreieck aus drei Seiten (SSS), Maßstab 40 px pro cm. */
export function sssDiagram(a = 4, b = 5, c = 6) {
  const k = 40, A = [80, 230], B = [A[0] + c * k, 230];
  const x = (b * b - a * a + c * c) / (2 * c) * k, y = Math.sqrt((b * k) ** 2 - x * x), C = [A[0] + x, 230 - y];
  const angA = (Math.atan2(y, x) * 180) / Math.PI, angB = 180 - (Math.atan2(y, c * k - x) * 180) / Math.PI;
  return diagram(520, 270, `Dreieck aus drei Seiten: Strecke c mit ${c} cm zeichnen, dann Kreisbogen mit Radius ${b} cm um A und Kreisbogen mit Radius ${a} cm um B. Der Schnittpunkt ist die Ecke C.`, [
    segment(A, B), segment(A, C), segment(B, C),
    arc(A[0], A[1], b * k, angA - 10, angA + 10), arc(B[0], B[1], a * k, angB - 10, angB + 10),
    ...dot(A, 'A', -4, 24), ...dot(B, 'B', 4, 24), ...dot(C, 'C', 0, -12),
    text((A[0] + B[0]) / 2, 256, `c = ${c} cm`, 'md mono'),
    text(A[0] + x / 2 - 26, 230 - y / 2, `b = ${b} cm`, 'sm mono'),
    text((B[0] + C[0]) / 2 + 40, 230 - y / 2, `a = ${a} cm`, 'sm mono')
  ]);
}

/** Zwei sich schneidende Geraden mit Winkel alpha. */
export function anglesDiagram(alpha = 60) {
  const O = [260, 130], d1 = 10, d2 = 10 + alpha, R = 200;
  const sets = [[d1, d2, alpha, 'α'], [d2, d1 + 180, 180 - alpha, 'β'], [d1 + 180, d2 + 180, alpha, 'α'], [d2 + 180, d1 + 360, 180 - alpha, 'β']];
  const marks = sets.flatMap(([a0, a1, val, name], i) => {
    const m = at(O[0], O[1], 62, (a0 + a1) / 2);
    return [arc(O[0], O[1], 30 + (i % 2) * 6, a0 + 3, a1 - 3, 'gc'), text(m[0], m[1] + 5, `${name} = ${val}°`, 'sm mono')];
  });
  return diagram(520, 260, `Zwei sich schneidende Geraden: Gegenüberliegende Winkel (Scheitelwinkel) sind je ${alpha} Grad, die Nachbarwinkel (Nebenwinkel) je ${180 - alpha} Grad.`, [
    segment(at(O[0], O[1], R, d1), at(O[0], O[1], R, d1 + 180)), segment(at(O[0], O[1], R, d2), at(O[0], O[1], R, d2 + 180)),
    ...marks, ...dot(O, '', 0, 0)
  ]);
}

/** Thaleskreis: C auf dem Halbkreis über AB. */
export function thalesDiagram(gamma = 62) {
  const M = [260, 190], r = 150, A = [M[0] - r, M[1]], B = [M[0] + r, M[1]], C = at(M[0], M[1], r, gamma);
  const dA = (Math.atan2(-(A[1] - C[1]), A[0] - C[0]) * 180) / Math.PI, dB = (Math.atan2(-(B[1] - C[1]), B[0] - C[0]) * 180) / Math.PI;
  return diagram(520, 252, 'Thaleskreis: Der Punkt C liegt auf dem Halbkreis über der Strecke AB. Das Dreieck ABC hat bei C einen rechten Winkel.', [
    path(`M${A[0]} ${A[1]} A${r} ${r} 0 0 1 ${B[0]} ${B[1]}`, 'ln-soft'),
    segment(A, B), segment(A, C), segment(B, C), segment(M, C, 'ln-soft'),
    rightAngle(C, dA, dB, 16), text(C[0], C[1] + 36, '90°', 'sm mono'),
    ...dot(A, 'A', -4, 24), ...dot(B, 'B', 4, 24), ...dot(C, 'C', 4, -12), ...dot(M, 'M', 0, 24),
    text(260, 238, 'Durchmesser AB = Hypotenuse', 'sm mu')
  ]);
}

/** Umkreis (links) und Inkreis (rechts) desselben Dreiecks. */
export function circlesDiagram() {
  const T = (o) => [[o + 30, 220], [o + 220, 200], [o + 90, 50]];
  const [A, B, C] = T(0), [A2, B2, C2] = T(260);
  const U = circumcenter(A, B, C), R = dist(U, A);
  const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  const { I, r } = incircle(A2, B2, C2);
  return diagram(520, 296, 'Links der Umkreis eines Dreiecks mit den drei Mittelsenkrechten, die sich im Mittelpunkt U treffen. Rechts der Inkreis desselben Dreiecks mit den drei Winkelhalbierenden, die sich im Mittelpunkt I treffen.', [
    segment(A, B), segment(B, C), segment(C, A), fullCircle(U, R, 'gc'),
    ...[[A, B], [B, C], [C, A]].map(([P, Q]) => segment(mid(P, Q), U, 'ln-soft')),
    ...dot(U, 'U', 12, -8), text(130, 20, 'Umkreis', 'md'), text(130, 288, 'Mittelsenkrechten', 'sm mu'),
    segment(A2, B2), segment(B2, C2), segment(C2, A2), fullCircle(I, r, 'gc'),
    ...[A2, B2, C2].map((P) => segment(P, I, 'ln-soft')),
    ...dot(I, 'I', 12, -8), text(390, 20, 'Inkreis', 'md'), text(390, 288, 'Winkelhalbierende', 'sm mu')
  ]);
}

/** Maßstab: oben die Zeichnung in cm, unten die Wirklichkeit in m. Alle Werte werden berechnet. */
export function scaleDiagram(d = 4, n = 200) {
  const real = (d * n) / 100, w = 60 * d, x0 = 70;
  const label = `Maßstab 1 zu ${n}: ${d} Zentimeter in der Zeichnung sind ${f1(real)} Meter in Wirklichkeit`.replace('.', ',');
  return diagram(520, 200, label, [
    text(260, 24, `Maßstab 1 : ${n}`, 'md'),
    text(52, 74, 'Zeichnung', 'sm mu'), rect(x0 + 40, 56, w, 28, 'box', 6), text(x0 + 40 + w / 2, 76, `${d} cm`, 'md mono'),
    arrow(x0 + 40 + w / 2, 90, x0 + 40 + w / 2, 128),
    text(x0 + 40 + w / 2 + 70, 114, `mal ${n}`, 'sm mu'),
    text(52, 164, 'Wirklichkeit', 'sm mu'), rect(x0 + 40, 140, w, 36, 'hi', 6),
    text(x0 + 40 + w / 2, 164, `${f1(real)} m`.replace('.', ','), 'md mono on-sun')
  ]);
}

/** Problem lösen: Thaleskreis mit Mittelpunkt M. Das Dreieck AMC ist gleichschenklig, alle Winkel werden berechnet. */
export function problemDiagram(alpha = 35) {
  const M = [260, 190], r = 140, A = [M[0] - r, M[1]], B = [M[0] + r, M[1]], C = at(M[0], M[1], r, 2 * alpha);
  return diagram(520, 252, `Thaleskreis mit Mittelpunkt M. Im gleichschenkligen Dreieck AMC sind die Basiswinkel ${alpha} Grad, der Winkel bei M ist ${180 - 2 * alpha} Grad.`, [
    path(`M${A[0]} ${A[1]} A${r} ${r} 0 0 1 ${B[0]} ${B[1]}`, 'ln-soft'),
    segment(A, B), segment(A, C), segment(B, C), segment(M, C, 'ln-soft'),
    ...dot(A, 'A', -4, 24), ...dot(B, 'B', 4, 24), ...dot(C, 'C', 4, -12), ...dot(M, 'M', 0, 24),
    text(A[0] + 52, A[1] - 8, `${alpha}°`, 'sm mono'), text(C[0] - 24, C[1] + 34, `${alpha}°`, 'sm mono'),
    text(M[0] - 40, M[1] - 20, `${180 - 2 * alpha}°`, 'sm mono'),
    text(260, 238, 'MA und MC sind Radien: Dreieck AMC ist gleichschenklig', 'sm mu')
  ]);
}
