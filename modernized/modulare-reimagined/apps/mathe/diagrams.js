// Diagramme der Mathe-Werkstatt (Herkunft: legacy/modulare/apps/mathe/diagrams.js). Alle Zahlen werden berechnet,
// nicht von Hand getippt. Die Bausteine liefern React-Elemente (komponenten/svg.js), daher kein Text-Markup.
// Ein Baustein, der eine Liste liefert (tile), wird als Teilliste in parts eingesetzt; diagram() flacht sie ab.
import { diagram, rect, circle, text, line, arrow } from '../../komponenten/svg.js';
import { fmt, MINUS } from '../../helfer/index.js';

/** Zahlenstrahl von -8 bis 8: Start bei a, Sprung um b. */
export function lineDiagram(a = 3, b = -5) {
  const X = (v) => 260 + v * 28, r = a + b;
  const parts = [line(X(-8) - 10, 110, X(8) + 10, 110, 'ln')];
  for (let v = -8; v <= 8; v++) {
    parts.push(line(X(v), 104, X(v), 116, 'ln-soft'));
    if (v % 2 === 0) parts.push(text(X(v), 138, fmt(v), `sm mono${v === 0 ? '' : ' mu'}`));
  }
  parts.push(arrow(X(a), 70, X(r), 70));
  parts.push(text((X(a) + X(r)) / 2, 54, `${b > 0 ? '+' : MINUS}${Math.abs(b)}`, 'md mono'));
  parts.push(circle(X(a), 110, 9, 'box'), circle(X(r), 110, 10, 'hi'));
  parts.push(text(X(a), 175, `Start ${fmt(a)}`, 'sm mu'), text(X(r), 175, `Ziel ${fmt(r)}`, 'md mono'));
  return diagram(520, 210, `Zahlenstrahl: Start bei ${fmt(a)}, ${b > 0 ? 'nach rechts' : 'nach links'} um ${Math.abs(b)}, Ziel ${fmt(r)}`, parts);
}

/** Kacheln: x-Kacheln und Einer-Kacheln, links zwei Gruppen, rechts zusammengefasst. */
export function tilesDiagram(a1 = 2, c1 = 3, a2 = 1, c2 = 2) {
  const tile = (x, y, cls, label) => [rect(x, y, 34, 34, cls, 6), text(x + 17, y + 24, label, `md mono${cls === 'hi' ? ' on-sun' : ''}`)];
  const parts = [];
  const group = (x0, y0, a, c) => {
    for (let i = 0; i < a; i++) parts.push(tile(x0 + i * 40, y0, 'box', 'x'));
    for (let i = 0; i < c; i++) parts.push(tile(x0 + i * 40, y0 + 42, 'hi', '1'));
  };
  group(20, 30, a1, c1);
  parts.push(text(20 + Math.max(a1, c1) * 40 + 14, 62, '+', 'lg'));
  group(20 + Math.max(a1, c1) * 40 + 44, 30, a2, c2);
  const A = a1 + a2, C = c1 + c2, y = 140;
  parts.push(text(260, 128, 'zusammenfassen', 'sm mu'), arrow(260, 132, 260, 146));
  const w = Math.max(A, C) * 40;
  for (let i = 0; i < A; i++) parts.push(tile(260 - w / 2 + i * 40, y + 20, 'box', 'x'));
  for (let i = 0; i < C; i++) parts.push(tile(260 - w / 2 + i * 40, y + 62, 'hi', '1'));
  parts.push(text(260, y + 124, `${a1 === 1 ? '' : a1}x + ${c1} + ${a2 === 1 ? '' : a2}x + ${c2} = ${A}x + ${C}`, 'md mono'));
  return diagram(520, 300, `Kacheln: ${a1}x und ${c1} plus ${a2}x und ${c2} ergibt ${A}x und ${C}`, parts);
}

/** Waage: ax + b = c, danach nach beiden Umformungen. */
export function balanceDiagram(a = 2, b = 3, x = 4) {
  const c = a * x + b;
  const pan = (cx, label, cls) => [rect(cx - 90, 70, 180, 56, cls), text(cx, 106, label, `lg mono${cls === 'hi' ? ' on-sun' : ''}`)];
  const parts = [line(260, 40, 260, 170, 'ln'), line(110, 55, 410, 55, 'ln'), line(200, 170, 320, 170, 'ln')];
  parts.push(pan(130, `${a}x + ${b}`, 'box'), pan(390, String(c), 'box'));
  parts.push(text(260, 218, `| ${MINUS} ${b}`, 'md mono'), arrow(260, 228, 260, 246));
  parts.push(rect(40, 252, 180, 50, 'box'), text(130, 285, `${a}x = ${c - b}`, 'lg mono'));
  parts.push(rect(300, 252, 180, 50, 'box'), text(390, 285, `| : ${a}`, 'md mono'));
  parts.push(arrow(222, 277, 298, 277));
  parts.push(rect(190, 318, 140, 50, 'hi'), text(260, 351, `x = ${x}`, 'lg mono on-sun'));
  parts.push(arrow(390, 304, 330, 330));
  return diagram(520, 384, `Waage: ${a}x + ${b} = ${c}. Erst minus ${b}, dann geteilt durch ${a}, Ergebnis x = ${x}`, parts);
}

/** Prozentbalken: 100 % oben, p % unten, mit Grundwert und Prozentwert. */
export function percentDiagram(g = 200, p = 25) {
  const w = g * p / 100, W = 440, X0 = 40, pw = (W * p) / 100;
  const parts = [text(260, 28, `Grundwert = 100 % = ${g} €`, 'sm mu')];
  parts.push(rect(X0, 40, W, 44, 'box'));
  parts.push(rect(X0, 110, W, 44, 'box'), rect(X0, 110, pw, 44, 'hi'));
  parts.push(text(X0 + pw / 2, 140, `${p} %`, 'md mono on-sun'));
  parts.push(line(X0 + pw, 84, X0 + pw, 110, 'ln-soft'));
  parts.push(text(260, 188, `Prozentwert = ${fmt(w)} €`, 'md mono'));
  parts.push(text(260, 220, `${g} · ${p}/100 = ${fmt(w)}`, 'md mono mu'));
  return diagram(520, 236, `Balken: ${p} Prozent von ${g} Euro sind ${fmt(w)} Euro`, parts);
}

/** Wertetabelle mit Pfeilen: proportional (Quotient bleibt gleich) oder antiproportional (Produkt bleibt gleich). */
export function tableDiagram(kind = 'prop', k = 3) {
  const xs = [1, 2, 3, 4], total = 12;
  const ys = xs.map((x) => (kind === 'prop' ? x * k : total / x));
  const prop = kind === 'prop';
  const parts = [text(60, 56, prop ? 'Hefte' : 'Arbeiter', 'sm mu'), text(60, 116, prop ? 'Preis in €' : 'Tage', 'sm mu')];
  xs.forEach((x, i) => {
    const cx = 160 + i * 100;
    parts.push(rect(cx - 36, 34, 72, 36, 'box'), text(cx, 59, String(x), 'md mono'));
    parts.push(rect(cx - 36, 94, 72, 36, i === 1 ? 'hi' : 'box'), text(cx, 119, fmt(ys[i]), `md mono${i === 1 ? ' on-sun' : ''}`));
  });
  parts.push(text(260, 168, prop ? 'x 2 oben, x 2 unten: Quotient y : x bleibt gleich' : 'x 2 oben, : 2 unten: Produkt x · y bleibt gleich', 'sm mu'));
  parts.push(text(260, 196, prop ? `Immer ${k} € pro Heft` : `Immer ${total} Arbeitertage`, 'md mono'));
  return diagram(520, 212, prop ? `Tabelle proportional: Preis ist immer ${k} mal die Anzahl` : `Tabelle antiproportional: Anzahl mal Tage ergibt immer ${total}`, parts);
}

/** Zinsen-Zeitstrahl: Kapital wächst um die Zinsen. */
export function interestDiagram(k = 1000, p = 3) {
  const z = k * p / 100;
  const parts = [rect(30, 50, 180, 70, 'box'), text(120, 80, 'Kapital K', 'sm mu'), text(120, 106, `${fmt(k)} €`, 'md mono')];
  parts.push(arrow(212, 85, 298, 85), text(255, 68, `${p} % Zinssatz`, 'sm mu'), text(255, 108, '1 Jahr', 'sm mu'));
  parts.push(rect(300, 50, 190, 70, 'hi'), text(395, 80, 'Zinsen Z', 'sm on-sun'), text(395, 106, `${fmt(z)} €`, 'md mono on-sun'));
  parts.push(text(260, 160, `Z = K · p/100 = ${fmt(k)} · ${p}/100 = ${fmt(z)} €`, 'md mono'));
  return diagram(520, 180, `Kapital ${fmt(k)} Euro bringt bei ${p} Prozent in einem Jahr ${fmt(z)} Euro Zinsen`, parts);
}

/** Geordnete Werte als Kacheln. Der Median ist hervorgehoben, darunter Mittelwert und Spannweite (berechnet). */
export function dataDiagram(xs = [3, 9, 4, 4, 7]) {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  // Gerade Anzahl: die beiden mittleren Kacheln sind der Median (RULE-056).
  const middles = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
  const w = 56, x0 = 260 - (n * w) / 2;
  const parts = [text(260, 24, 'der Größe nach geordnet', 'sm mu')];
  s.forEach((v, i) => {
    const hi = middles.includes(i);
    parts.push(rect(x0 + i * w + 3, 40, w - 6, 48, hi ? 'hi' : 'box'), text(x0 + i * w + w / 2, 72, String(v), `md mono${hi ? ' on-sun' : ''}`));
  });
  const labelX = x0 + (middles[0] * w + (middles[middles.length - 1] + 1) * w) / 2;
  parts.push(text(labelX, 112, 'Median', 'sm mu'));
  const mean = s.reduce((a, b) => a + b, 0) / n;
  parts.push(text(260, 150, `Mittelwert = ${s.join(' + ')} : ${n} = ${fmt(mean)}`, 'md mono'));
  parts.push(text(260, 180, `Spannweite = ${s[n - 1]} ${MINUS} ${s[0]} = ${s[n - 1] - s[0]}`, 'md mono'));
  const median = middles.reduce((a, i) => a + s[i], 0) / middles.length;
  return diagram(520, 200, `Werte ${s.join(', ')}: Median ${fmt(median)}, Mittelwert ${fmt(mean)}, Spannweite ${s[n - 1] - s[0]}`, parts);
}

/** Urne mit roten und blauen Kugeln und der Laplace-Formel. */
export function urnDiagram(r = 3, b = 5) {
  const n = r + b, cols = 4;
  const parts = [rect(150, 30, 220, 130, 'box', 24)];
  for (let i = 0; i < n; i++) {
    const cx = 185 + (i % cols) * 50, cy = 62 + Math.floor(i / cols) * 44;
    parts.push(circle(cx, cy, 16, i < r ? 'hi' : 'off'));
  }
  parts.push(text(260, 190, `P(rot) = ${r} : ${n} = ${r}/${n}`, 'md mono'));
  parts.push(text(260, 214, 'günstige Ergebnisse : alle Ergebnisse', 'sm mu'));
  return diagram(520, 230, `Urne mit ${r} roten und ${b} blauen Kugeln, Wahrscheinlichkeit für rot ${r} von ${n}`, parts);
}

/** Restschuld Jahr für Jahr: gleichbleibende Tilgung, Zinsen nur auf den Rest. Alle Zahlen werden berechnet. */
export function kreditDiagram(k = 2000, t = 500, p = 4) {
  const years = Math.min(Math.round(k / t), 5), W = 84, base = 150, top = 36;
  const parts = [];
  for (let i = 0; i < years; i++) {
    const rest = k - i * t, h = Math.round((rest / k) * (base - top)), x = 22 + i * 100;
    parts.push(rect(x, base - h, W, h, i === 0 ? 'hi' : 'box', 8));
    parts.push(text(x + W / 2, base - h + 24, `${fmt(rest)} €`, `sm mono${i === 0 ? ' on-sun' : ''}`));
    parts.push(text(x + W / 2, base + 24, `Jahr ${i + 1}`, 'sm mu'));
    parts.push(text(x + W / 2, base + 50, 'Zinsen', 'sm mu'), text(x + W / 2, base + 76, `${fmt(rest * p / 100)} €`, 'sm mono'));
  }
  parts.push(text(260, 20, `Restschuld, Tilgung ${fmt(t)} €, Zins ${p} %`, 'sm mu'));
  return diagram(520, 236, `Kredit ${fmt(k)} Euro, jedes Jahr ${fmt(t)} Euro getilgt: Die Restschuld sinkt, darum sinken auch die Zinsen`, parts);
}
