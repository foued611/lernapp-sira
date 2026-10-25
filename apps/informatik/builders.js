// Baut aus Zufallszahlen Fragen im Quiz-Format (siehe core/js/quiz.js).
import { esc, shuffle, pick } from '../../core/js/ui.js';
import { UNITS } from './data.js';
import {
  HEX, toBin, toHex, rnd, placeSum, placeDigits, onesWeights, checker, distractors, mono,
  explainBinToDec, explainDecToBin, explainHexToDec, explainDecToHex, explainBinToHex, explainAdd
} from './numbers.js';

const RANGE = { easy: [2, 15], mid: [10, 63], hard: [40, 255] };
const cheatsheet = '<p class="muted" style="margin:0 0 6px">Hex-Ziffern</p><div class="cheat">' +
  HEX.split('').map((c, i) => `<span>${c}=${i}</span>`).join('') + '</div>';
const weightsSheet = '<p class="muted" style="margin:0 0 6px">Stellenwerte</p><div class="cheat">' +
  [128, 64, 32, 16, 8, 4, 2, 1].map((w) => `<span>${w}</span>`).join('') + '</div>';

function choice({ label, prompt, answer, wrong, why, reveal, help, promptStyle = 'big', chip }) {
  const options = shuffle([answer, ...distractors(answer, wrong, 3)]).map((v) => ({ id: v, html: mono(v) }));
  return { kind: 'choice', label, chip, prompt, promptStyle, answer, options, reveal: reveal || mono(answer), why, help };
}

function typed({ label, prompt, answer, type, why, help, placeholder, promptStyle = 'big' }) {
  return { kind: 'type', label, prompt, promptStyle, answer, check: checker(type, answer), accents: false, placeholder, reveal: mono(answer), why, help };
}

const flipBits = (bin) => bin.split('').map((c) => (c === '1' ? '0' : '1')).join('');
const reversed = (bin) => bin.split('').reverse().join('');

// --- Seite 1: Stellenwerte -------------------------------------------------

export function placeValueQ() {
  const kind = rnd(0, 2);
  const n = rnd(100, 9999);
  const d = placeDigits(n);
  const names = ['Tausender', 'Hunderter', 'Zehner', 'Einer'];
  if (kind === 0) {
    const i = rnd(0, 3);
    const digit = d[i];
    const value = String(Number(digit) * [1000, 100, 10, 1][i]);
    return choice({
      label: 'Stellenwert erkennen',
      prompt: `Welchen Wert hat die <b>${digit}</b> in ${mono(String(n))}?`,
      promptStyle: 'sentence',
      answer: value,
      wrong: [Number(digit) * 10 * [1000, 100, 10, 1][i], Number(digit), Number(digit) * [1000, 100, 10, 1][Math.min(3, i + 1)], Number(digit) * [1000, 100, 10, 1][Math.max(0, i - 1)]],
      why: `Die ${digit} steht an der ${names[i]}-Stelle (${names[i]} = ${[1000, 100, 10, 1][i]}). Also ${digit} × ${[1000, 100, 10, 1][i]} = ${value}.`
    });
  }
  if (kind === 1) {
    return choice({
      label: 'Zahl zerlegen',
      prompt: `Zerlege ${mono(String(n))}:`,
      promptStyle: 'sentence',
      answer: placeSum(n),
      wrong: [placeSum(Number(d.slice().reverse().join(''))), placeSum(n + 10), placeSum(n - 100), placeSum(Number(d[1] + d[0] + d[3] + d[2]))],
      why: `Jede Ziffer wird mit ihrem Stellenwert multipliziert: ${placeSum(n)}.`
    });
  }
  return typed({
    label: 'Zahl zusammensetzen',
    prompt: `${placeSum(n).replace(/×/g, ' × ')} = ?`,
    answer: String(n),
    type: 'dec',
    why: `Rechne jeden Teil aus und addiere: ${placeSum(n)} = ${n}.`,
    placeholder: 'Zahl eintippen'
  });
}

// --- Seite 2: Binär lesen --------------------------------------------------

export function binToDecQ(level = 'mid') {
  const [lo, hi] = RANGE[level];
  const n = rnd(lo, hi);
  const bin = toBin(n);
  const answer = String(n);
  if (rnd(0, 1)) {
    return choice({
      label: 'Binär → Normal',
      prompt: `Was ist ${mono(bin)} als normale Zahl?`, promptStyle: 'sentence',
      answer, wrong: [parseInt(reversed(bin), 2), parseInt(flipBits(bin), 2), n + 1, n - 1, n + 2],
      why: explainBinToDec(bin), help: weightsSheet
    });
  }
  return typed({
    label: 'Binär → Normal', prompt: `Was ist ${mono(bin)} als normale Zahl?`, promptStyle: 'sentence',
    answer, type: 'dec', why: explainBinToDec(bin), help: weightsSheet, placeholder: 'z. B. 42'
  });
}

export function lampsQ() {
  const n = rnd(3, 255);
  const bin = toBin(n).padStart(8, '0');
  const lit = onesWeights(bin);
  return choice({
    label: 'Lampen lesen',
    prompt: `Diese Lampen leuchten: ${mono(lit.join(' + '))}. Wie lautet die Zahl?`, promptStyle: 'sentence',
    answer: String(n), wrong: [n + 1, n - 1, n + 16, n - 2, lit.length],
    why: `Zähle die leuchtenden Stellenwerte zusammen: ${lit.join(' + ')} = ${n}.`, help: weightsSheet
  });
}

// --- Seite 3: Normal → Binär ----------------------------------------------

export function decToBinQ(level = 'mid') {
  const [lo, hi] = RANGE[level];
  const n = rnd(lo, hi);
  const bin = toBin(n);
  if (rnd(0, 1)) {
    return choice({
      label: 'Normal → Binär',
      prompt: `Schreibe ${mono(String(n))} binär.`, promptStyle: 'sentence',
      answer: bin, wrong: [reversed(bin), flipBits(bin), toBin(n + 1), toBin(n - 1), toBin(n + 2)],
      why: explainDecToBin(n), help: weightsSheet
    });
  }
  return typed({
    label: 'Normal → Binär', prompt: `Schreibe ${mono(String(n))} binär.`, promptStyle: 'sentence',
    answer: bin, type: 'bin', why: explainDecToBin(n), help: weightsSheet, placeholder: 'z. B. 1010'
  });
}

export function largestWeightQ() {
  const n = rnd(5, 255);
  const w = [128, 64, 32, 16, 8, 4, 2, 1].find((x) => x <= n);
  return choice({
    label: 'Den Anfang finden',
    prompt: `Welcher Stellenwert ist der <b>größte</b>, der noch in ${mono(String(n))} passt?`, promptStyle: 'sentence',
    answer: String(w), wrong: [w * 2, w / 2, n, w * 4].map(Math.floor),
    why: `${w} passt noch hinein (${w} ≤ ${n}), der nächstgrößere Stellenwert ${w * 2} aber nicht. Dort fängst du an.`, help: weightsSheet
  });
}

// --- Seite 4: Binär addieren ----------------------------------------------

export function addQ(level = 'mid') {
  const max = level === 'easy' ? 7 : level === 'mid' ? 15 : 63;
  const a = rnd(1, max), b = rnd(1, max);
  return typed({
    label: 'Binär addieren',
    prompt: `${mono(toBin(a))} + ${mono(toBin(b))} = ?`,
    answer: toBin(a + b), type: 'bin', why: explainAdd(a, b),
    help: '<div class="cheat"><span>0+0=0</span><span>0+1=1</span><span>1+1=10</span><span>1+1+1=11</span></div>',
    placeholder: 'Ergebnis binär'
  });
}

export function carryQ() {
  const rules = [['1 + 1', '10', 'Das Ergebnis ist 10: schreibe 0 und merke dir 1.'], ['1 + 1 + 1', '11', 'Das Ergebnis ist 11: schreibe 1 und merke dir 1.'], ['1 + 0', '1', 'Hier gibt es keinen Übertrag.'], ['0 + 0', '0', 'Hier gibt es keinen Übertrag.']];
  const [sum, answer, why] = pick(rules);
  return choice({
    label: 'Binär-Regel', prompt: `${mono(sum)} = ?`, promptStyle: 'big',
    answer, wrong: ['0', '1', '10', '11', '2'], why: `Binär gibt es keine 2. ${why}`
  });
}

// --- Seite 5: Hexadezimal --------------------------------------------------

export function hexToDecQ(level = 'mid') {
  const n = level === 'easy' ? rnd(10, 15) : level === 'mid' ? rnd(16, 99) : rnd(40, 255);
  const hex = toHex(n);
  if (rnd(0, 1)) {
    return choice({
      label: 'Hex → Normal', prompt: `Was ist ${mono(hex)} (hex) als normale Zahl?`, promptStyle: 'sentence',
      answer: String(n), wrong: [parseInt(hex.split('').reverse().join(''), 16), n + 1, n - 1, n + 16, parseInt(hex, 10)],
      why: explainHexToDec(n), help: cheatsheet
    });
  }
  return typed({
    label: 'Hex → Normal', prompt: `Was ist ${mono(hex)} (hex) als normale Zahl?`, promptStyle: 'sentence',
    answer: String(n), type: 'dec', why: explainHexToDec(n), help: cheatsheet, placeholder: 'z. B. 47'
  });
}

export function decToHexQ(level = 'mid') {
  const n = level === 'easy' ? rnd(10, 31) : level === 'mid' ? rnd(16, 99) : rnd(40, 255);
  const hex = toHex(n);
  if (rnd(0, 1)) {
    return choice({
      label: 'Normal → Hex', prompt: `Schreibe ${mono(String(n))} als Hex-Zahl.`, promptStyle: 'sentence',
      answer: hex, wrong: [hex.split('').reverse().join(''), toHex(n + 1), toHex(n - 1), toHex(n + 16), String(n)],
      why: explainDecToHex(n), help: cheatsheet
    });
  }
  return typed({
    label: 'Normal → Hex', prompt: `Schreibe ${mono(String(n))} als Hex-Zahl.`, promptStyle: 'sentence',
    answer: hex, type: 'hex', why: explainDecToHex(n), help: cheatsheet, placeholder: 'z. B. 2F'
  });
}

export function hexDigitQ() {
  const i = rnd(10, 15);
  return choice({
    label: 'Hex-Ziffer', prompt: `Welchen Wert hat die Hex-Ziffer ${mono(HEX[i])}?`, promptStyle: 'sentence',
    answer: String(i), wrong: [i - 1, i + 1, i - 2, 16, 9],
    why: `Nach der 9 geht es mit Buchstaben weiter: A=10, B=11, C=12, D=13, E=14, F=15. Also ${HEX[i]} = ${i}.`, help: cheatsheet
  });
}

// --- Seite 6: Binär ↔ Hex --------------------------------------------------

export function binToHexQ(level = 'mid') {
  const n = level === 'easy' ? rnd(1, 15) : rnd(16, 255);
  const bin = toBin(n).padStart(level === 'easy' ? 4 : 8, '0');
  const hex = toHex(n);
  if (rnd(0, 1)) {
    return choice({
      label: 'Binär → Hex', prompt: `Übersetze ${mono(bin)} in Hex.`, promptStyle: 'sentence',
      answer: hex, wrong: [hex.split('').reverse().join(''), toHex(n + 1), toHex(n - 1), String(n)],
      why: explainBinToHex(bin), help: cheatsheet
    });
  }
  return typed({
    label: 'Binär → Hex', prompt: `Übersetze ${mono(bin)} in Hex.`, promptStyle: 'sentence',
    answer: hex, type: 'hex', why: explainBinToHex(bin), help: cheatsheet, placeholder: 'z. B. 2F'
  });
}

export function hexToBinQ() {
  const n = rnd(16, 255);
  const hex = toHex(n);
  const bin = toBin(n).padStart(8, '0');
  return typed({
    label: 'Hex → Binär', prompt: `Übersetze ${mono(hex)} in Binär (8 Bits).`, promptStyle: 'sentence',
    answer: bin, type: 'bin',
    why: `Jede Hex-Ziffer wird zu vier Bits: ${hex.split('').map((c) => `${c} = ${toBin(parseInt(c, 16)).padStart(4, '0')}`).join(', ')}.`,
    help: cheatsheet, placeholder: '8 Bits'
  });
}

export function nibbleMatchQ() {
  const values = shuffle([1, 2, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 4);
  return {
    kind: 'match', label: 'Verbinde Vierergruppe und Hex-Ziffer',
    left: values.map((v) => esc(toBin(v).padStart(4, '0'))), leftValues: values.map((v) => HEX[v]),
    right: shuffle(values.map((v) => HEX[v])).map((h) => ({ value: h, html: esc(h) })),
    why: 'Zähle bei jeder Vierergruppe 8, 4, 2 und 1 zusammen, über denen eine 1 steht.', help: cheatsheet
  };
}

// --- Runden ---------------------------------------------------------------

const POOLS = {
  stellen: [placeValueQ],
  binaer: [() => binToDecQ('easy'), () => binToDecQ('mid'), lampsQ],
  dez2bin: [() => decToBinQ('easy'), () => decToBinQ('mid'), largestWeightQ],
  addieren: [carryQ, () => addQ('easy'), () => addQ('mid')],
  hex: [hexDigitQ, () => hexToDecQ('easy'), () => hexToDecQ('mid'), () => decToHexQ('easy'), () => decToHexQ('mid')],
  binhex: [() => binToHexQ('easy'), () => binToHexQ('mid'), hexToBinQ, nibbleMatchQ]
};

/** Eine Runde für eine Seite: 8 Fragen, die sich nicht direkt wiederholen. */
export function lessonRound(unit) {
  const pool = POOLS[unit.id];
  const out = [];
  let last = null;
  for (let i = 0; i < 8; i++) {
    let make;
    do { make = pick(pool); } while (pool.length > 1 && make === last);
    last = make;
    out.push(make());
  }
  return out;
}

const allMakers = () => UNITS.flatMap((u) => POOLS[u.id]);
const mixed = (count) => Array.from({ length: count }, () => pick(allMakers())());

export const bossRound = () => mixed(12);
export const quickRound = () => mixed(5);

/** Blitz: nur Auswahlfragen, damit man schnell antworten kann. */
export function blitzQuestion() {
  const makers = [placeValueQ, () => binToDecQ('easy'), lampsQ, () => decToBinQ('easy'), carryQ, hexDigitQ, () => hexToDecQ('easy'), () => binToHexQ('easy')];
  for (let i = 0; i < 30; i++) {
    const q = pick(makers)();
    if (q.kind === 'choice') return q;
  }
  return carryQ();
}
