// Aufgaben der Zahlenwerkstatt im Quiz-Format (runde/index.js). Herkunft: legacy/modulare/apps/informatik/builders.js.
// Zufall nur über rng (helfer createRng). Seit der Inhaltsprüfung vom 2026-10-30 ziehen einige Erzeuger bewusst anders als
// die Legacy-Fassung, damit keine verratenen Fragen entstehen. Der Vergleich analysis/modulare/dual/info-zahlen_dual.mjs gilt deshalb nicht mehr.
//
// Abweichungen von Legacy in der Darstellung:
//   - Schreibmaschinenschrift (span.mono) wird zu <b>, weil richText nur b, strong, i, em, p, ul, ol, li, br kennt.
//   - help (Spickzettel) ist Text. Die Oberfläche zeigt ihn über den Spickzettel-Knopf.
//   - Eingaben werden nach normInput() verglichen wie in Legacy (Leerzeichen, 0x und führende Nullen werden entfernt).
import { choiceQuestion, typedQuestion, matchQuestion, esc, distinctQuestions, distinctSlots } from '../../runde/index.js';
import { pick, shuffle, rnd } from '../../helfer/index.js';
import {
  HEX, WEIGHTS, toBin, toHex, placeDigits, placeSum, askablePlaces, onesWeights, distractors,
  explainBinToDec, explainDecToBin, explainHexToDec, explainDecToHex, explainBinToHex, explainAdd
} from './numbers.js';

let UNITS = [];

/** Bekommt die Seitenliste, bevor die erste Runde entsteht (AGENTS.md: Erzeuger lesen daraus, nie per Import). */
export function init({ manifest }) {
  UNITS = manifest.units;
}

// Schreibmaschinenschrift gibt es in richText nicht. Fett hebt die Zahl trotzdem heraus.
const mono = (text) => `<b>${esc(text)}</b>`;
const WEIGHT_VALUES = [1000, 100, 10, 1];
const RANGE = { easy: [2, 15], mid: [10, 63], hard: [40, 255] };

const weightsHelp = `Stellenwerte: ${WEIGHTS.join(', ')}`;
const hexHelp = `Hex-Ziffern: ${HEX.split('').map((c, i) => `${c}=${i}`).join(' ')}`;
const addHelp = '0+0=0 · 0+1=1 · 1+1=10 · 1+1+1=11';

/** Eingabe vereinheitlichen wie legacy/modulare/apps/informatik/numbers.js (normInput): ohne Leerzeichen, ohne 0x,
 * ohne führende Nullen, Hex in Großbuchstaben. Ungültige Eingaben ergeben null und sind damit falsch. */
export function normInput(raw, type) {
  const s = String(raw).trim().toUpperCase().replace(/[\s_]+/g, '').replace(/^0X/, '');
  if (type === 'dec') return /^\d+$/.test(s) ? String(parseInt(s, 10)) : null;
  if (type === 'bin') return /^[01]+$/.test(s) ? s.replace(/^0+(?=.)/, '') : null;
  return /^[0-9A-F]+$/.test(s) ? s.replace(/^0+(?=.)/, '') : null;
}

// Eingabe gilt nur, wenn sie nach normInput() gleich der gespeicherten Antwort ist (Regel für Eingabefragen).
const checker = (type, answer) => (input) => (normInput(input, type) === normInput(answer, type) ? 'ok' : 'bad');

/** Auswahlfrage. Höchstens drei falsche Antworten (RULE-223), die Reihenfolge mischt rng. */
function choice({ answer, wrong, ...rest }, rng) {
  return choiceQuestion({
    ...rest, answer, rng, choices: [answer, ...distractors(answer, wrong, 3)], format: mono, promptStyle: rest.promptStyle || 'big'
  });
}

/** Eingabefrage. Die Prüfung vergleicht nur die gespeicherte Antwort. */
function typed({ type, answer, ...rest }) {
  return typedQuestion({ ...rest, answer, check: checker(type, answer), format: mono, promptStyle: rest.promptStyle || 'big' });
}

const flipBits = (bin) => bin.split('').map((c) => (c === '1' ? '0' : '1')).join('');
const reversed = (bin) => bin.split('').reverse().join('');
// Führende Nullen weg. Sonst stünden 01 und 1 als zwei verschiedene Optionen da, obwohl sie gleich viel wert sind.
const plainBin = (bin) => toBin(parseInt(bin, 2));

// --- Seite 1: Stellenwerte -------------------------------------------------

export function placeValueQ(rng) {
  const kind = rnd(0, 2, rng);
  let n = rnd(100, 9999, rng);
  // Gefragt wird nur nach einer Ziffer, die genau einmal in der Zahl steht und keine Null ist. Bei 5525 wäre "die 5" nicht eindeutig.
  while (kind === 0 && askablePlaces(n).length === 0) n = rnd(100, 9999, rng);
  const d = placeDigits(n);
  const names = ['Tausender', 'Hunderter', 'Zehner', 'Einer'];
  if (kind === 0) {
    const i = pick(askablePlaces(n), rng);
    const digit = d[i];
    const value = String(Number(digit) * WEIGHT_VALUES[i]);
    return choice({
      label: 'Stellenwert erkennen',
      prompt: `Welchen Wert hat die <b>${digit}</b> in ${mono(String(n))}?`,
      promptStyle: 'sentence',
      answer: value,
      wrong: WEIGHT_VALUES.map((w) => Number(digit) * w),
      why: `Die ${digit} steht an der ${names[i]}-Stelle (${names[i]} = ${WEIGHT_VALUES[i]}). Also ${digit} × ${WEIGHT_VALUES[i]} = ${value}.`
    }, rng);
  }
  if (kind === 1) {
    return choice({
      label: 'Zahl zerlegen',
      prompt: `Zerlege ${mono(String(n))} in Stellenwerte:`,
      promptStyle: 'sentence',
      answer: placeSum(n),
      wrong: [Number(d.slice().reverse().join('')), n + 10, n - 100, Number(d[1] + d[0] + d[3] + d[2]), n + 100, n + 1].filter((v) => v > 0).map(placeSum),
      why: `Jede Ziffer wird mit ihrem Stellenwert multipliziert: ${placeSum(n)}.`
    }, rng);
  }
  return typed({
    label: 'Zahl zusammensetzen',
    prompt: `${placeSum(n).replace(/×/g, ' × ')} = ?`,
    answer: String(n),
    why: `Rechne jeden Teil aus und addiere: ${placeSum(n)} = ${n}.`,
    placeholder: 'Zahl eintippen'
  });
}

// --- Seite 2: Binär lesen --------------------------------------------------

export function binToDecQ(level, rng) {
  const [lo, hi] = RANGE[level];
  const n = rnd(lo, hi, rng);
  const bin = toBin(n);
  const answer = String(n);
  if (rnd(0, 1, rng)) {
    return choice({
      label: 'Binär → Normal',
      prompt: `Was ist ${mono(bin)} als normale Zahl?`, promptStyle: 'sentence',
      answer, wrong: [parseInt(reversed(bin), 2), parseInt(flipBits(bin), 2), n + 1, n - 1, n + 2],
      why: explainBinToDec(bin), help: weightsHelp
    }, rng);
  }
  return typed({
    label: 'Binär → Normal', prompt: `Was ist ${mono(bin)} als normale Zahl?`, promptStyle: 'sentence',
    answer, why: explainBinToDec(bin), help: weightsHelp, placeholder: 'z. B. 42'
  });
}

export function lampsQ(rng) {
  // Mindestens zwei Lampen: Bei nur einer Lampe stünde die Antwort schon in der Frage.
  let n = rnd(3, 255, rng);
  while (onesWeights(toBin(n)).length < 2) n = rnd(3, 255, rng);
  const bin = toBin(n).padStart(8, '0');
  const lit = onesWeights(bin);
  return choice({
    label: 'Lampen lesen',
    prompt: `Diese Lampen leuchten: ${mono(lit.join(' + '))}. Wie lautet die Zahl?`, promptStyle: 'sentence',
    answer: String(n), wrong: [n + 1, n - 1, n + 16, n - 2, lit.length],
    why: `Zähle die leuchtenden Stellenwerte zusammen: ${lit.join(' + ')} = ${n}.`, help: weightsHelp
  }, rng);
}

// --- Seite 3: Normal → Binär ----------------------------------------------

export function decToBinQ(level, rng) {
  const [lo, hi] = RANGE[level];
  const n = rnd(lo, hi, rng);
  const bin = toBin(n);
  if (rnd(0, 1, rng)) {
    return choice({
      label: 'Normal → Binär',
      prompt: `Schreibe ${mono(String(n))} binär.`, promptStyle: 'sentence',
      answer: bin, wrong: [reversed(bin), flipBits(bin), toBin(n + 1), toBin(n - 1), toBin(n + 2)].map(plainBin),
      why: explainDecToBin(n), help: weightsHelp
    }, rng);
  }
  return typed({
    label: 'Normal → Binär', prompt: `Schreibe ${mono(String(n))} binär.`, promptStyle: 'sentence',
    answer: bin, why: explainDecToBin(n), help: weightsHelp, placeholder: 'z. B. 1010'
  });
}

export function largestWeightQ(rng) {
  // Keine Zweierpotenz: Sonst wäre die gesuchte Zahl schon die gefragte.
  let n = rnd(5, 255, rng);
  while (WEIGHTS.includes(n)) n = rnd(5, 255, rng);
  const w = WEIGHTS.find((x) => x <= n);
  return choice({
    label: 'Den Anfang finden',
    prompt: `Welcher Stellenwert ist der <b>größte</b>, der noch in ${mono(String(n))} passt?`, promptStyle: 'sentence',
    answer: String(w), wrong: [w * 2, w / 2, w / 4, w * 4],
    why: `${w} passt noch hinein (${w} ≤ ${n}), der nächstgrößere Stellenwert ${w * 2} aber nicht. Dort fängst du an.`, help: weightsHelp
  }, rng);
}

// --- Seite 4: Binär addieren ----------------------------------------------

export function addQ(level, rng) {
  const max = level === 'easy' ? 7 : level === 'mid' ? 15 : 63;
  const a = rnd(1, max, rng), b = rnd(1, max, rng);
  return typed({
    label: 'Binär addieren',
    prompt: `${mono(toBin(a))} + ${mono(toBin(b))} = ?`,
    answer: toBin(a + b), why: explainAdd(a, b),
    help: addHelp,
    placeholder: 'Ergebnis binär'
  });
}

export function carryQ(rng) {
  const rules = [
    ['1 + 1', '10', 'Binär gibt es keine 2. Das Ergebnis ist 10: schreibe 0 und merke dir 1.'],
    ['1 + 1 + 1', '11', 'Binär gibt es keine 3. Das Ergebnis ist 11: schreibe 1 und merke dir 1.'],
    ['1 + 0', '1', 'Das Ergebnis ist kleiner als 2, passt also in eine Stelle. Es gibt keinen Übertrag.'],
    ['0 + 0', '0', 'Null plus null bleibt null, auch im Binärsystem. Es gibt keinen Übertrag.']
  ];
  const [sum, answer, why] = pick(rules, rng);
  return choice({
    label: 'Binär-Regel', prompt: `${mono(sum)} = ?`, promptStyle: 'big',
    answer, wrong: ['0', '1', '10', '11', '2'], why
  }, rng);
}

// --- Seite 5: Hexadezimal --------------------------------------------------

export function hexToDecQ(level, rng) {
  const n = level === 'easy' ? rnd(10, 15, rng) : level === 'mid' ? rnd(16, 99, rng) : rnd(40, 255, rng);
  const hex = toHex(n);
  if (rnd(0, 1, rng)) {
    return choice({
      label: 'Hex → Normal', prompt: `Was ist ${mono(hex)} (hex) als normale Zahl?`, promptStyle: 'sentence',
      answer: String(n), wrong: [/^\d+$/.test(hex) ? Number(hex) : NaN, parseInt(hex.split('').reverse().join(''), 16), n + 1, n - 1, n + 16],
      why: explainHexToDec(n), help: hexHelp
    }, rng);
  }
  return typed({
    label: 'Hex → Normal', prompt: `Was ist ${mono(hex)} (hex) als normale Zahl?`, promptStyle: 'sentence',
    answer: String(n), why: explainHexToDec(n), help: hexHelp, placeholder: 'z. B. 47'
  });
}

export function decToHexQ(level, rng) {
  const n = level === 'easy' ? rnd(10, 31, rng) : level === 'mid' ? rnd(16, 99, rng) : rnd(40, 255, rng);
  const hex = toHex(n);
  if (rnd(0, 1, rng)) {
    return choice({
      label: 'Normal → Hex', prompt: `Schreibe ${mono(String(n))} als Hex-Zahl.`, promptStyle: 'sentence',
      answer: hex, wrong: [hex.split('').reverse().join(''), toHex(n + 1), toHex(n - 1), toHex(n + 16), String(n)],
      why: explainDecToHex(n), help: hexHelp
    }, rng);
  }
  return typed({
    label: 'Normal → Hex', prompt: `Schreibe ${mono(String(n))} als Hex-Zahl.`, promptStyle: 'sentence',
    answer: hex, why: explainDecToHex(n), help: hexHelp, placeholder: 'z. B. 2F'
  });
}

export function hexDigitQ(rng) {
  const i = rnd(10, 15, rng);
  return choice({
    label: 'Hex-Ziffer', prompt: `Welchen Wert hat die Hex-Ziffer ${mono(HEX[i])}?`, promptStyle: 'sentence',
    answer: String(i), wrong: [i - 1, i + 1, i - 2, 16, 9],
    why: `Nach der 9 geht es mit Buchstaben weiter: A=10, B=11, C=12, D=13, E=14, F=15. Also ${HEX[i]} = ${i}.`, help: hexHelp
  }, rng);
}

// --- Seite 6: Binär ↔ Hex --------------------------------------------------

export function binToHexQ(level, rng) {
  const n = level === 'easy' ? rnd(1, 15, rng) : rnd(16, 255, rng);
  const bin = toBin(n).padStart(level === 'easy' ? 4 : 8, '0');
  const hex = toHex(n);
  if (rnd(0, 1, rng)) {
    return choice({
      label: 'Binär → Hex', prompt: `Übersetze ${mono(bin)} in Hex.`, promptStyle: 'sentence',
      answer: hex, wrong: [hex.split('').reverse().join(''), toHex(n + 1), toHex(n - 1), String(n)],
      why: explainBinToHex(bin), help: hexHelp
    }, rng);
  }
  return typed({
    label: 'Binär → Hex', prompt: `Übersetze ${mono(bin)} in Hex.`, promptStyle: 'sentence',
    answer: hex, why: explainBinToHex(bin), help: hexHelp, placeholder: 'z. B. 2F'
  });
}

export function hexToBinQ(rng) {
  const n = rnd(16, 255, rng);
  const hex = toHex(n);
  const bin = toBin(n).padStart(8, '0');
  return typed({
    label: 'Hex → Binär', prompt: `Übersetze ${mono(hex)} in Binär (8 Bits).`, promptStyle: 'sentence',
    answer: bin,
    why: `Jede Hex-Ziffer wird zu vier Bits: ${hex.split('').map((c) => `${c} = ${toBin(parseInt(c, 16)).padStart(4, '0')}`).join(', ')}.`,
    help: hexHelp, placeholder: '8 Bits'
  });
}

/** Zuordnung: Vierergruppe zu Hex-Ziffer. */
export function nibbleMatchQ(rng) {
  const values = shuffle([1, 2, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15], rng).slice(0, 4);
  return matchQuestion({
    label: 'Verbinde Vierergruppe und Hex-Ziffer',
    left: values.map((v) => esc(toBin(v).padStart(4, '0'))),
    leftValues: values.map((v) => HEX[v]),
    right: shuffle(values.map((v) => HEX[v]), rng).map((h) => ({ value: h, html: esc(h) })),
    why: 'Zähle bei jeder Vierergruppe 8, 4, 2 und 1 zusammen, über denen eine 1 steht.',
    help: hexHelp
  });
}

// --- Runden ---------------------------------------------------------------
// Jeder Erzeuger bekommt rng. Die Einträge sind feste Funktionen, damit der Vergleich "gleich wie zuletzt" greift.

const POOLS = {
  stellen: [placeValueQ],
  binaer: [(r) => binToDecQ('easy', r), (r) => binToDecQ('mid', r), lampsQ],
  dez2bin: [(r) => decToBinQ('easy', r), (r) => decToBinQ('mid', r), largestWeightQ],
  addieren: [carryQ, (r) => addQ('easy', r), (r) => addQ('mid', r)],
  hex: [hexDigitQ, (r) => hexToDecQ('easy', r), (r) => hexToDecQ('mid', r), (r) => decToHexQ('easy', r), (r) => decToHexQ('mid', r)],
  binhex: [(r) => binToHexQ('easy', r), (r) => binToHexQ('mid', r), hexToBinQ, nibbleMatchQ]
};

/** Erzeuger einer Seite (für Tests und die Dual-Prüfung). */
export const makersFor = (unitId) => POOLS[unitId] || [];

/**
 * Eine Lektionsrunde: 8 verschiedene Fragen (keine Aufgabe kommt zweimal vor, siehe runde/src/vielfalt.js).
 * Gleicher Erzeuger nicht zweimal hintereinander, wie in Legacy. Die Zufallsfolge stimmt bis zur ersten Dublette.
 */
export function lessonRound(unit, rng) {
  const pool = POOLS[unit.id];
  let last = null;
  return distinctSlots(8, rng, (_, r) => {
    let make;
    do { make = pick(pool, r); } while (pool.length > 1 && make === last);
    last = make;
    return make(r);
  });
}

const allMakers = () => UNITS.flatMap((u) => POOLS[u.id]);

export const bossRound = (rng) => distinctQuestions(allMakers(), 12, rng);
export const quickRound = (rng) => distinctQuestions(allMakers(), 5, rng);

/** Blitz: nur Auswahlfragen, damit man schnell antworten kann. */
export function blitzQuestion(rng) {
  const makers = [
    (r) => placeValueQ(r), (r) => binToDecQ('easy', r), lampsQ, (r) => decToBinQ('easy', r),
    carryQ, hexDigitQ, (r) => hexToDecQ('easy', r), (r) => binToHexQ('easy', r)
  ];
  for (let i = 0; i < 30; i++) {
    const q = pick(makers, rng)(rng);
    if (q.kind === 'choice') return q;
  }
  return carryQ(rng);
}
