// Erzeugt Mathe-Fragen aus Zufallszahlen. Jede Aufgabe kennt typische Fehlerwege und bietet sie als falsche Antworten an.
import { choiceQuestion, typedQuestion } from '../../core/js/questions.js';
import { esc } from '../../core/js/ui.js';
import { UNITS } from './data.js';
import { rnd, fmt, par, MINUS, nearby, numCheck, termCheck, linear, pick, shuffle } from './math.js';

const nz = (a, b) => { let n = 0; while (n === 0) n = rnd(a, b); return n; };

// --- Aufgabenvorlagen. Jede liefert { prompt, answer, wrong[], why, numeric?, value? } ---

function addSub() {
  const a = nz(-12, 12), b = nz(-12, 12), sub = Math.random() < 0.5;
  const r = sub ? a - b : a + b;
  const expr = `${fmt(a)} ${sub ? MINUS : '+'} ${par(b)}`;
  const wrong = sub ? [a + b, -(a - b), Math.abs(a) - Math.abs(b)] : [-(a + b), Math.abs(a) + Math.abs(b), a - b];
  return { prompt: expr, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, wrong).map(fmt),
    why: sub ? `Subtrahieren heißt Gegenzahl addieren: ${fmt(a)} + ${par(-b)} = ${fmt(r)}.` : `${fmt(a)} + ${par(b)} = ${fmt(r)}. Bei verschiedenen Vorzeichen rechnest du den Unterschied der Beträge.` };
}

function mulDiv() {
  const a = nz(-9, 9), b = nz(-9, 9), div = Math.random() < 0.4;
  const r = div ? a : a * b;
  const expr = div ? `${fmt(a * b)} : ${par(b)}` : `${par(a)} · ${par(b)}`;
  const wrong = [-r, Math.abs(r), a + b];
  return { prompt: expr, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, wrong).map(fmt),
    why: `${(a < 0) === (b < 0) ? 'Gleiche' : 'Verschiedene'} Vorzeichen ergeben ${(a < 0) === (b < 0) ? 'Plus' : 'Minus'}, also ${fmt(r)}.` };
}

function collect() {
  const a = rnd(2, 9), b = rnd(2, 9), c = rnd(1, 6), r = a + b - c;
  const prompt = `${a}x + ${b}x ${MINUS} ${c}x`;
  return { prompt, answer: `${r}x`, wrong: [`${a + b + c}x`, `${a + b - c}`, `${a * b - c}x`], why: `Gleichartige Summanden zusammenfassen: ${a} + ${b} ${MINUS} ${c} = ${r}, also ${r}x.` };
}

function collectMixed() {
  const a = rnd(3, 9), c = rnd(1, 2), k = rnd(2, 9), m = rnd(2, 9);
  const ra = a - c, rc = k + m;
  return { prompt: `${a}x + ${k} ${MINUS} ${c}x + ${m}`, answer: linear(ra, rc), wrong: [linear(a + c, rc), `${ra + rc}x`, linear(ra, k - m)],
    why: `Die x-Summanden: ${a}x ${MINUS} ${c}x = ${ra}x. Die Zahlen: ${k} + ${m} = ${rc}. Zusammen: ${linear(ra, rc)}.` };
}

function expand() {
  const f = rnd(2, 9), c = rnd(1, 9);
  return { prompt: `${f} · (x + ${c})`, answer: linear(f, f * c), wrong: [linear(f, c), linear(1, f * c), linear(f, f + c)],
    why: `Distributivgesetz: ${f}·x + ${f}·${c} = ${linear(f, f * c)}. Der Faktor gilt für jeden Summanden.` };
}

function minusBracket() {
  const k = rnd(5, 20), c = rnd(1, 9);
  return { prompt: `${k} ${MINUS} (x ${MINUS} ${c})`, answer: linear(-1, k + c), wrong: [linear(-1, k - c), linear(1, k + c), linear(-1, c - k)],
    why: `Minus vor der Klammer dreht beide Vorzeichen um: ${k} ${MINUS} x + ${c} = ${linear(-1, k + c)}.` };
}

function solve() {
  const x = nz(-9, 9), a = rnd(2, 9), b = nz(-12, 12), c = a * x + b;
  const prompt = `${linear(a, b)} = ${fmt(c)}`;
  const wrong = [(c + b) / a, c - b, x * -1, (c - b) * a];
  return { prompt, answer: fmt(x), value: x, numeric: true, wrong: nearby(x, wrong.filter(Number.isInteger)).map(fmt),
    why: `${b < 0 ? '+' + Math.abs(b) : MINUS + b}: ${a}x = ${fmt(c - b)}. Dann : ${a}, und es folgt x = ${fmt(x)}. Probe: ${a}·${par(x)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)} = ${fmt(c)}.`, label: 'Löse nach x auf' };
}

function firstStep() {
  const a = rnd(2, 9), b = rnd(2, 15), x = rnd(2, 9), c = a * x + b, plus = Math.random() < 0.5;
  const eq = plus ? `${a}x + ${b} = ${c}` : `${a}x ${MINUS} ${b} = ${a * x - b}`;
  const step = plus ? `| ${MINUS} ${b}` : `| + ${b}`;
  return { prompt: eq, answer: step, wrong: [`| : ${a}`, plus ? `| + ${b}` : `| ${MINUS} ${b}`, `| · ${a}`],
    why: `Zuerst wird das ${plus ? 'Plus' : 'Minus'} neben dem x rückgängig gemacht (${step}). Das Teilen durch ${a} kommt danach.`, label: 'Welcher Umformungsschritt kommt zuerst?', words: true };
}

const GRUND = [40, 50, 60, 80, 120, 150, 200, 250, 400, 500, 800];
const SATZ = [5, 10, 20, 25, 30, 40, 50, 75];

function prozentwert() {
  const g = pick(GRUND), p = pick(SATZ), w = g * p / 100;
  return { prompt: `Wie viel sind ${p} % von ${g} €?`, answer: fmt(w), value: w, numeric: true, wrong: nearby(w, [g - w, g + w, p]).map(fmt),
    why: `${p} % = ${p}/100. Also ${g} · ${p}/100 = ${fmt(w)} €.` };
}

function grundwert() {
  const g = pick(GRUND), p = pick(SATZ), w = g * p / 100;
  return { prompt: `${p} % eines Preises sind ${fmt(w)} €. Wie hoch ist der ganze Preis (der Grundwert)?`, answer: fmt(g), value: g, numeric: true, wrong: nearby(g, [w * p, g / 2, w + p]).map(fmt),
    why: `${p} % sind ${fmt(w)} €. 1 % sind ${fmt(w / p)} €. 100 % sind ${fmt(g)} €.` };
}

function prozentsatz() {
  const g = pick(GRUND), p = pick(SATZ), w = g * p / 100;
  return { prompt: `Von ${g} Schülern spielen ${fmt(w)} ein Instrument. Wie viel Prozent sind das?`, answer: String(p), value: p, numeric: true, wrong: nearby(p, [100 - p, w, p * 2]).map(String),
    why: `Prozentsatz = Prozentwert : Grundwert = ${fmt(w)} : ${g} = ${p / 100} = ${p} %.` };
}

function rabatt() {
  const g = pick([40, 60, 80, 120, 150, 200]), p = pick([10, 20, 25, 50]), n = g * (100 - p) / 100;
  return { prompt: `Eine Jacke kostet ${g} €. Im Sale gibt es ${p} % Rabatt. Was kostet sie jetzt?`, answer: fmt(n), value: n, numeric: true, wrong: nearby(n, [g * p / 100, g + g * p / 100, g - p]).map(fmt),
    why: `Rabatt: ${fmt(g * p / 100)} €. Neuer Preis: ${g} ${MINUS} ${fmt(g * p / 100)} = ${fmt(n)} €. Kurz: Du zahlst ${100 - p} %.` };
}

export const POOLS = {
  vorzeichen: [addSub, addSub, mulDiv],
  terme: [collect, collectMixed, expand, minusBracket],
  gleichungen: [solve, solve, firstStep],
  prozent: [prozentwert, grundwert, prozentsatz, rabatt]
};

// --- Aufgabe zu Frage ---

function choice(item) {
  const label = item.label || (item.numeric && !item.prompt.includes('?') ? 'Berechne' : item.prompt.includes('?') ? 'Rechne und wähle' : 'Vereinfache');
  return choiceQuestion({
    label, prompt: esc(item.prompt), promptStyle: item.prompt.length > 28 ? 'sentence' : 'big',
    answer: item.answer, choices: [item.answer, ...item.wrong.slice(0, 3)], format: (v) => `<span class="mono">${esc(v)}</span>`, why: item.why
  });
}

function typed(item) {
  const check = item.words ? undefined : item.numeric ? numCheck(item.value) : termCheck(item.answer);
  return typedQuestion({
    label: item.words ? 'Schreibe den Schritt' : 'Gib das Ergebnis ein', prompt: esc(item.prompt), promptStyle: item.prompt.length > 28 ? 'sentence' : 'big',
    answer: item.answer, check, placeholder: item.numeric ? 'Zahl eintippen' : item.words ? '| …' : 'Term eintippen', why: item.why, format: (v) => `<span class="mono">${esc(v)}</span>`
  });
}

// Eine Aufgabe mit mindestens drei verschiedenen falschen Antworten. Sonst wird neu gewürfelt.
function make(unitId) {
  for (;;) {
    const item = pick(POOLS[unitId])();
    item.wrong = [...new Set(item.wrong)].filter((w) => w !== item.answer);
    if (item.wrong.length >= 3) return item;
  }
}
const canType = (item) => !item.words;

/** 8 Fragen, jede dritte zum Eintippen. */
export function lessonRound(unit) {
  return Array.from({ length: 8 }, (_, i) => {
    const item = make(unit.id);
    return i % 3 === 2 && canType(item) ? typed(item) : choice(item);
  });
}

const anyItem = () => make(pick(UNITS).id);
export const quickRound = () => Array.from({ length: 5 }, () => choice(anyItem()));
export const blitzQuestion = () => choice(anyItem());
export const bossRound = () => Array.from({ length: 12 }, (_, i) => {
  const item = make(UNITS[i % UNITS.length].id);
  return i % 4 === 3 && canType(item) ? typed(item) : choice(item);
});
