// Reine Zahlen-Hilfen für Binär und Hex. Kein Browser-Code, deshalb gut testbar.
import { esc } from '../../core/js/ui.js';

export const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];
export const HEX = '0123456789ABCDEF';

export const toBin = (n) => n.toString(2);
export const toHex = (n) => n.toString(16).toUpperCase();
export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/** Ziffern einer Zahl mit 4 Stellen (Tausender bis Einer). */
export const placeDigits = (n) => String(Math.max(0, Math.min(9999, n))).padStart(4, '0').split('');

/** "352" wird zu "3×100 + 5×10 + 2×1". */
export function placeSum(n) {
  const d = placeDigits(n);
  const parts = [[1000, d[0]], [100, d[1]], [10, d[2]], [1, d[3]]].filter((p) => p[1] !== '0').map((p) => `${p[1]}×${p[0]}`);
  return parts.length ? parts.join(' + ') : '0';
}

/** Stellenwerte, über denen in der Binärzahl eine 1 steht. */
export function onesWeights(bin) {
  const len = bin.length;
  return bin.split('').map((c, i) => (c === '1' ? 2 ** (len - 1 - i) : 0)).filter(Boolean);
}

/** Schritte beim Umrechnen von Normal nach Binär: "Passt der Stellenwert noch hinein?" */
export function decToBinSteps(n) {
  const steps = [];
  let rest = n;
  let started = false;
  for (const w of WEIGHTS) {
    if (!started && w > n && w !== 1) continue;
    started = true;
    const fits = w <= rest;
    steps.push({ w, rest, fits });
    if (fits) rest -= w;
  }
  return steps;
}

/** Schritte als HTML (nur Zahlen, daher sicher). */
export function decToBinHTML(n) {
  const rows = decToBinSteps(n).map((s) => (s.fits
    ? `<div><span class="yes">Passt ${s.w} in ${s.rest}? Ja → 1</span><span class="no">Rest ${s.rest - s.w}</span></div>`
    : `<div><span class="no">Passt ${s.w} in ${s.rest}? Nein → 0</span></div>`));
  rows.push(`<div><b>${n} = ${toBin(n)}</b></div>`);
  return rows.join('');
}

/** Kurze Erklärungen als Text für das Feedback. */
export const explainBinToDec = (bin) => {
  const w = onesWeights(bin);
  return `${bin}: ${w.length ? w.join(' + ') : '0'} = ${parseInt(bin, 2)}. Zähle die Stellenwerte zusammen, über denen eine 1 steht.`;
};
export const explainDecToBin = (n) => `${n} = ${toBin(n)}. Gehe von links durch die Stellenwerte (128, 64, 32 …): Passt er noch hinein, schreibe 1 und ziehe ihn ab, sonst 0.`;
export const explainHexToDec = (n) => `${toHex(n)} = ${Math.floor(n / 16)} × 16 + ${n % 16} = ${n}. Die linke Ziffer zählt 16-fach (A=10 … F=15).`;
export const explainDecToHex = (n) => `${n} : 16 = ${Math.floor(n / 16)} Rest ${n % 16}. Das ergibt ${HEX[Math.floor(n / 16)]} und ${HEX[n % 16]}, also ${toHex(n)}.`;
export const explainBinToHex = (bin) => {
  const groups = bin.padStart(Math.ceil(bin.length / 4) * 4, '0').match(/.{4}/g);
  return `Vierergruppen: ${groups.map((g) => `${g} = ${HEX[parseInt(g, 2)]}`).join(', ')}.`;
};
export const explainAdd = (a, b) => `${toBin(a)} = ${a} und ${toBin(b)} = ${b}. ${a} + ${b} = ${a + b} und das ist ${toBin(a + b)}. Rechne von rechts: 1 + 1 = 10, schreibe 0 und merke dir 1.`;

/** Eingabe vereinheitlichen: ohne Leerzeichen, ohne 0x, ohne führende Nullen, Hex in Großbuchstaben. */
export function normInput(raw, type) {
  const s = String(raw).trim().toUpperCase().replace(/[\s_]+/g, '').replace(/^0X/, '');
  if (type === 'dec') return /^\d+$/.test(s) ? String(parseInt(s, 10)) : null;
  if (type === 'bin') return /^[01]+$/.test(s) ? s.replace(/^0+(?=.)/, '') : null;
  return /^[0-9A-F]+$/.test(s) ? s.replace(/^0+(?=.)/, '') : null;
}

/** Prüffunktion für Eingabefragen. */
export const checker = (type, answer) => (input) => (normInput(input, type) === normInput(answer, type) ? 'ok' : 'bad');

/** Falsche Antworten für Auswahlfragen, ohne Dopplungen und ohne die richtige Antwort. */
export function distractors(answer, candidates, count = 3) {
  const seen = new Set([String(answer)]);
  const out = [];
  for (const c of candidates) {
    const v = String(c);
    if (!seen.has(v) && v !== 'NaN' && !v.startsWith('-')) { seen.add(v); out.push(v); }
    if (out.length === count) return out;
  }
  // Auffüllen mit Nachbarzahlen, falls zu wenige Kandidaten da waren
  const num = parseInt(answer, 10);
  for (let d = 1; out.length < count && !Number.isNaN(num); d++) {
    for (const v of [String(num + d), String(num - d)]) {
      if (!seen.has(v) && !v.startsWith('-') && out.length < count) { seen.add(v); out.push(v); }
    }
  }
  return out;
}

export const mono = (text) => `<span class="mono">${esc(text)}</span>`;
