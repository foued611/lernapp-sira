// Diagramme der Zahlenwerkstatt. Reine Textbausteine (SVG), deshalb ohne Browser testbar.
import { svg, rect, circle, text, line, arrow, path } from '../../core/js/svg.js';
import { WEIGHTS, HEX, toBin, onesWeights } from './numbers.js';

/** Stellenwert-Haus: vier Fächer, jede Stelle ist 10-mal so viel wert wie die rechts daneben. */
export function placeDiagram(n = 352) {
  const digits = String(n).padStart(4, '0').split('');
  const names = ['Tausender', 'Hunderter', 'Zehner', 'Einer'];
  const weights = [1000, 100, 10, 1];
  let out = '';
  digits.forEach((d, i) => {
    const x = 20 + i * 126;
    out += rect(x, 40, 96, 130, i === 3 ? 'hi' : 'box');
    out += text(x + 48, 30, names[i], 'sm mu');
    out += text(x + 48, 105, d, `lg mono${i === 3 ? ' on-sun' : ''}`);
    out += text(x + 48, 150, `${d} × ${weights[i]}`, `sm mono${i === 3 ? ' on-sun' : ''}`);
    if (i < 3) {
      out += text(x + 111, 96, '× 10', 'sm mu');
      out += arrow(x + 126, 108, x + 98, 108);
    }
  });
  const parts = digits.map((d, i) => `${d}×${weights[i]}`).filter((p) => !p.startsWith('0'));
  out += text(260, 206, 'Nach links wird jede Stelle 10-mal so viel wert', 'sm mu');
  out += text(260, 238, `${Number(n)} = ${parts.join(' + ')}`, 'md mono');
  return svg(520, 252, out, `Stellenwert-Tafel der Zahl ${n}: Tausender, Hunderter, Zehner und Einer`);
}

/** Lampenreihe mit Verdopplung. bits: 8 Werte aus 0 und 1. */
export function lampDiagram(bits = [0, 0, 0, 0, 1, 0, 1, 1]) {
  let out = '';
  bits.forEach((b, i) => {
    const x = 36 + i * 64;
    out += circle(x, 78, 24, b ? 'hi' : 'off');
    out += text(x, 85, String(b), `md mono ${b ? 'on-sun' : 'mu'}`);
    out += text(x, 130, String(WEIGHTS[i]), 'md mono');
    if (i < 7) out += text(x + 32, 44, '÷2', 'sm mu');
  });
  out += text(260, 22, 'Die Werte halbieren sich nach rechts und verdoppeln sich nach links', 'sm mu');
  const lit = WEIGHTS.filter((w, i) => bits[i]);
  out += text(260, 168, `${lit.length ? lit.join(' + ') : '0'} = ${lit.reduce((a, b) => a + b, 0)}`, 'lg mono');
  return svg(520, 185, out, `Acht Lampen mit den Stellenwerten 128 bis 1. Leuchtende Lampen ergeben zusammen ${lit.reduce((a, b) => a + b, 0)}`);
}

/** Balken, der sich aus Stellenwert-Klötzen zusammensetzt (z. B. 13 = 8 + 4 + 1). */
export function blocksDiagram(n = 13) {
  const parts = onesWeights(toBin(n));
  const scale = 440 / n;
  let x = 40, out = text(260, 24, `So baust du ${n} aus Stellenwerten`, 'md');
  parts.forEach((w, i) => {
    const width = w * scale;
    out += rect(x, 50, width - 4, 60, i % 2 ? 'hi' : 'acc', 8);
    out += text(x + (width - 4) / 2, 88, String(w), `md mono ${i % 2 ? 'on-sun' : 'on-acc'}`);
    x += width;
  });
  out += path('M40 124 L40 134 L480 134 L480 124');
  out += text(260, 158, `${parts.join(' + ')} = ${n}`, 'md mono');
  out += text(260, 190, `Darum: ${n} = ${toBin(n)}`, 'lg mono');
  const all = WEIGHTS.slice(WEIGHTS.indexOf(Math.max(...WEIGHTS.filter((w) => w <= n)))).map((w) => `${w}:${parts.includes(w) ? 1 : 0}`).join('  ');
  out += text(260, 214, all, 'sm mu mono');
  return svg(520, 226, out, `Die Zahl ${n} besteht aus den Stellenwerten ${parts.join(', ')}. Binär ist das ${toBin(n)}`);
}

/** Schriftliche Addition in Binär mit Übertrag. */
export function addDiagram(a = 11, b = 6) {
  const sum = a + b;
  const width = toBin(sum).length;
  const A = toBin(a).padStart(width, '0'), B = toBin(b).padStart(width, '0'), S = toBin(sum).padStart(width, '0');
  const carry = Array(width + 1).fill(0);
  for (let i = width - 1; i >= 0; i--) carry[i] = (Number(A[i]) + Number(B[i]) + carry[i + 1]) > 1 ? 1 : 0;
  const colX = (i) => 260 + (i - (width - 1) / 2) * 56;
  let out = '';
  for (let i = 0; i < width; i++) {
    if (carry[i + 1]) out += circle(colX(i), 36, 14, 'hi') + text(colX(i), 41, '1', 'md mono on-sun');
    out += text(colX(i), 92, A[i], 'lg mono');
    out += text(colX(i), 132, B[i], 'lg mono');
    out += text(colX(i), 192, S[i], 'lg mono');
  }
  out += text(colX(0) - 56, 132, '+', 'lg mono');
  out += line(colX(0) - 40, 152, colX(width - 1) + 40, 152);
  out += text(colX(0) - 56, 41, 'Übertrag', 'sm mu');
  return svg(520, 215, out, `Binär addieren: ${toBin(a)} plus ${toBin(b)} ergibt ${toBin(sum)}`);
}

/** Hex-Zahl als Stellenwerte: 2F = 2 × 16 + 15 × 1. */
export function hexPlaceDiagram(hex = '2F') {
  const [hi, lo] = hex.split('');
  const hv = HEX.indexOf(hi), lv = HEX.indexOf(lo);
  let out = '';
  out += rect(60, 50, 150, 100, 'box') + text(135, 40, 'Sechzehner', 'sm mu') + text(135, 108, hi, 'lg mono') + text(135, 134, `= ${hv}`, 'sm mono mu');
  out += rect(310, 50, 150, 100, 'hi') + text(385, 40, 'Einer', 'sm mu') + text(385, 108, lo, 'lg mono on-sun') + text(385, 134, `= ${lv}`, 'sm mono on-sun');
  out += text(260, 108, '+', 'lg');
  out += text(135, 176, `${hv} × 16 = ${hv * 16}`, 'md mono') + text(385, 176, `${lv} × 1 = ${lv}`, 'md mono');
  out += text(260, 214, `${hex} = ${hv * 16} + ${lv} = ${hv * 16 + lv}`, 'lg mono');
  return svg(520, 230, out, `Die Hex-Zahl ${hex} besteht aus ${hv} mal 16 plus ${lv} mal 1 und ist ${hv * 16 + lv}`);
}

/** Acht Bits werden zu zwei Vierergruppen und zwei Hex-Ziffern. */
export function nibbleDiagram(bits = [1, 1, 0, 1, 0, 1, 1, 0]) {
  let out = '';
  bits.forEach((b, i) => {
    const x = 50 + i * 52 + (i > 3 ? 36 : 0);
    out += rect(x - 20, 40, 40, 44, b ? 'hi' : 'off', 8) + text(x, 70, String(b), `md mono ${b ? 'on-sun' : 'mu'}`);
  });
  const groups = [bits.slice(0, 4), bits.slice(4)];
  groups.forEach((g, gi) => {
    const x1 = 50 + gi * (4 * 52 + 36) - 20, x2 = x1 + 4 * 52 - 12;
    const v = parseInt(g.join(''), 2), cx = (x1 + x2) / 2;
    out += path(`M${x1} 96 L${x1} 106 L${x2} 106 L${x2} 96`);
    out += text(cx, 126, `${g.join('')} = ${v}`, 'md mono');
    out += arrow(cx, 134, cx, 168);
    out += rect(cx - 28, 174, 56, 56, 'acc', 12) + text(cx, 214, HEX[v], 'lg mono on-acc');
  });
  out += text(260, 20, 'Von rechts in Vierergruppen schneiden', 'sm mu');
  return svg(520, 246, out, `Acht Bits werden in zwei Vierergruppen geteilt und zu den Hex-Ziffern ${HEX[parseInt(groups[0].join(''), 2)]} und ${HEX[parseInt(groups[1].join(''), 2)]}`);
}
