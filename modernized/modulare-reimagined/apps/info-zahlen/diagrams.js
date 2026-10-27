// Diagramme der Zahlenwerkstatt als React-Elemente (komponenten/svg.js). Herkunft: legacy/modulare/apps/informatik/diagrams.js.
// Koordinaten und CSS-Klassen sind unverändert, damit das Bild in Legacy und Neubau gleich aussieht.
// Nur die Diagrammfunktionen werden exportiert: logic.js gibt das ganze Modul als diagrams weiter.
import { diagram, rect, circle, text, line, arrow, path } from '../../komponenten/svg.js';
import { WEIGHTS, HEX, toBin, onesWeights } from './numbers.js';

/** Stellenwert-Haus: vier Fächer, jede Stelle ist 10-mal so viel wert wie die rechts daneben. */
export function placeDiagram(n = 352) {
  const digits = String(n).padStart(4, '0').split('');
  const names = ['Tausender', 'Hunderter', 'Zehner', 'Einer'];
  const weights = [1000, 100, 10, 1];
  const parts = [];
  digits.forEach((d, i) => {
    const x = 20 + i * 126;
    parts.push(rect(x, 40, 96, 130, i === 3 ? 'hi' : 'box'));
    parts.push(text(x + 48, 30, names[i], 'sm mu'));
    parts.push(text(x + 48, 105, d, `lg mono${i === 3 ? ' on-sun' : ''}`));
    parts.push(text(x + 48, 150, `${d} × ${weights[i]}`, `sm mono${i === 3 ? ' on-sun' : ''}`));
    if (i < 3) {
      parts.push(text(x + 111, 96, '× 10', 'sm mu'));
      parts.push(arrow(x + 126, 108, x + 98, 108));
    }
  });
  const shown = digits.map((d, i) => `${d}×${weights[i]}`).filter((p) => !p.startsWith('0'));
  parts.push(text(260, 206, 'Nach links wird jede Stelle 10-mal so viel wert', 'sm mu'));
  parts.push(text(260, 238, `${Number(n)} = ${shown.join(' + ')}`, 'md mono'));
  return diagram(520, 252, `Stellenwert-Tafel der Zahl ${n}: Tausender, Hunderter, Zehner und Einer`, parts);
}

/** Lampenreihe mit Verdopplung. bits: 8 Werte aus 0 und 1. */
export function lampDiagram(bits = [0, 0, 0, 0, 1, 0, 1, 1]) {
  const parts = [];
  bits.forEach((b, i) => {
    const x = 36 + i * 64;
    parts.push(circle(x, 78, 24, b ? 'hi' : 'off'));
    parts.push(text(x, 85, String(b), `md mono ${b ? 'on-sun' : 'mu'}`));
    parts.push(text(x, 130, String(WEIGHTS[i]), 'md mono'));
    if (i < 7) parts.push(text(x + 32, 44, '÷2', 'sm mu'));
  });
  parts.push(text(260, 22, 'Nach rechts halbieren, nach links verdoppeln', 'sm mu'));
  const lit = WEIGHTS.filter((w, i) => bits[i]);
  parts.push(text(260, 168, `${lit.length ? lit.join(' + ') : '0'} = ${lit.reduce((a, b) => a + b, 0)}`, 'lg mono'));
  return diagram(520, 185, `Acht Lampen mit den Stellenwerten 128 bis 1. Leuchtende Lampen ergeben zusammen ${lit.reduce((a, b) => a + b, 0)}`, parts);
}

/** Balken, der sich aus Stellenwert-Klötzen zusammensetzt (z. B. 13 = 8 + 4 + 1). */
export function blocksDiagram(n = 13) {
  const found = onesWeights(toBin(n));
  const scale = 440 / n;
  const parts = [text(260, 24, `So baust du ${n} aus Stellenwerten`, 'md')];
  let x = 40;
  found.forEach((w, i) => {
    const width = w * scale;
    parts.push(rect(x, 50, width - 4, 60, i % 2 ? 'hi' : 'acc', 8));
    parts.push(text(x + (width - 4) / 2, 88, String(w), `md mono ${i % 2 ? 'on-sun' : 'on-acc'}`));
    x += width;
  });
  parts.push(path('M40 124 L40 134 L480 134 L480 124'));
  parts.push(text(260, 158, `${found.join(' + ')} = ${n}`, 'md mono'));
  parts.push(text(260, 190, `Darum: ${n} = ${toBin(n)}`, 'lg mono'));
  const all = WEIGHTS.slice(WEIGHTS.indexOf(Math.max(...WEIGHTS.filter((w) => w <= n)))).map((w) => `${w}:${found.includes(w) ? 1 : 0}`).join('  ');
  parts.push(text(260, 214, all, 'sm mu mono'));
  return diagram(520, 226, `Die Zahl ${n} besteht aus den Stellenwerten ${found.join(', ')}. Binär ist das ${toBin(n)}`, parts);
}

/** Schriftliche Addition in Binär mit Übertrag. */
export function addDiagram(a = 11, b = 6) {
  const sum = a + b;
  const width = toBin(sum).length;
  const A = toBin(a).padStart(width, '0');
  const B = toBin(b).padStart(width, '0');
  const S = toBin(sum).padStart(width, '0');
  const carry = Array(width + 1).fill(0);
  for (let i = width - 1; i >= 0; i--) carry[i] = (Number(A[i]) + Number(B[i]) + carry[i + 1]) > 1 ? 1 : 0;
  const colX = (i) => 260 + (i - (width - 1) / 2) * 56;
  const parts = [];
  for (let i = 0; i < width; i++) {
    if (carry[i + 1]) {
      parts.push(circle(colX(i), 36, 14, 'hi'));
      parts.push(text(colX(i), 41, '1', 'md mono on-sun'));
    }
    parts.push(text(colX(i), 92, A[i], 'lg mono'));
    parts.push(text(colX(i), 132, B[i], 'lg mono'));
    parts.push(text(colX(i), 192, S[i], 'lg mono'));
  }
  parts.push(text(colX(0) - 56, 132, '+', 'lg mono'));
  parts.push(line(colX(0) - 40, 152, colX(width - 1) + 40, 152));
  parts.push(text(colX(0) - 56, 41, 'Übertrag', 'sm mu'));
  return diagram(520, 215, `Binär addieren: ${toBin(a)} plus ${toBin(b)} ergibt ${toBin(sum)}`, parts);
}

/** Hex-Zahl als Stellenwerte: 2F = 2 × 16 + 15 × 1. */
export function hexPlaceDiagram(hex = '2F') {
  const [hi, lo] = hex.split('');
  const hv = HEX.indexOf(hi);
  const lv = HEX.indexOf(lo);
  const parts = [
    rect(60, 50, 150, 100, 'box'), text(135, 40, 'Sechzehner', 'sm mu'), text(135, 108, hi, 'lg mono'), text(135, 134, `= ${hv}`, 'sm mono mu'),
    rect(310, 50, 150, 100, 'hi'), text(385, 40, 'Einer', 'sm mu'), text(385, 108, lo, 'lg mono on-sun'), text(385, 134, `= ${lv}`, 'sm mono on-sun'),
    text(260, 108, '+', 'lg'),
    text(135, 176, `${hv} × 16 = ${hv * 16}`, 'md mono'), text(385, 176, `${lv} × 1 = ${lv}`, 'md mono'),
    text(260, 214, `${hex} = ${hv * 16} + ${lv} = ${hv * 16 + lv}`, 'lg mono')
  ];
  return diagram(520, 230, `Die Hex-Zahl ${hex} besteht aus ${hv} mal 16 plus ${lv} mal 1 und ist ${hv * 16 + lv}`, parts);
}

/** Acht Bits werden zu zwei Vierergruppen und zwei Hex-Ziffern. */
export function nibbleDiagram(bits = [1, 1, 0, 1, 0, 1, 1, 0]) {
  const parts = [];
  bits.forEach((b, i) => {
    const x = 50 + i * 52 + (i > 3 ? 36 : 0);
    parts.push(rect(x - 20, 40, 40, 44, b ? 'hi' : 'off', 8));
    parts.push(text(x, 70, String(b), `md mono ${b ? 'on-sun' : 'mu'}`));
  });
  const groups = [bits.slice(0, 4), bits.slice(4)];
  groups.forEach((g, gi) => {
    const x1 = 50 + gi * (4 * 52 + 36) - 20;
    const x2 = x1 + 4 * 52 - 12;
    const v = parseInt(g.join(''), 2);
    const cx = (x1 + x2) / 2;
    parts.push(path(`M${x1} 96 L${x1} 106 L${x2} 106 L${x2} 96`));
    parts.push(text(cx, 126, `${g.join('')} = ${v}`, 'md mono'));
    parts.push(arrow(cx, 134, cx, 168));
    parts.push(rect(cx - 28, 174, 56, 56, 'acc', 12));
    parts.push(text(cx, 214, HEX[v], 'lg mono on-acc'));
  });
  parts.push(text(260, 20, 'Von rechts in Vierergruppen schneiden', 'sm mu'));
  const hexLabel = groups.map((g) => HEX[parseInt(g.join(''), 2)]).join(' und ');
  return diagram(520, 246, `Acht Bits werden in zwei Vierergruppen geteilt und zu den Hex-Ziffern ${hexLabel}`, parts);
}
