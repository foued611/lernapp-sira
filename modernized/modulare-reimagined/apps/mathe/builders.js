// Aufgaben-Erzeuger der Mathe-Werkstatt. Herkunft: legacy/modulare/apps/mathe/builders.js.
// Jeder Erzeuger bekommt rng und zieht daraus genau so oft und in derselben Reihenfolge wie die Legacy-Fassung (globaler Zufall).
// So ergibt ein Seed in Legacy und Neubau dieselben Fragen (Dual-Execution: analysis/modulare/dual/mathe_dual.mjs).
// Änderungen an der Reihenfolge der Zufallsaufrufe brechen diesen Vergleich.
//
// Eine Aufgabe: { prompt, answer, wrong[], why, numeric?, value?, check?, choiceOnly?, label? }
//   numeric     Antwort ist eine Zahl, geprüft mit numCheck(value)
//   check       eigener Prüfer (Brüche und Wahrscheinlichkeiten)
//   choiceOnly  nur Auswahl, kein Eintippen
import { choiceQuestion, typedQuestion, esc, distinctSlots } from '../../runde/index.js';
import { pick, shuffle, rnd, fmt, nearby, numCheck, probCheck, MINUS } from '../../helfer/index.js';
import { par, linear, frac, termCheck } from './math.js';

// Inhalte kommen aus content/mathe/ (siehe init). Hier liegt nur die Logik der Aufgaben.
let UNITS = [];
let SITUATIONS = [];

/** Bekommt Seitenliste und Aufgabendaten, bevor die erste Runde entsteht. */
export function init({ data, manifest }) {
  UNITS = manifest.units;
  SITUATIONS = data.situations;
}

// Höchstzahl an Versuchen, bis eine Aufgabe drei falsche Antworten hat. Danach ein Fehler statt einer Endlosschleife.
export const MAX_TRIES = 200;

// Eine Zahl ungleich null (Legacy nz).
const nz = (a, b, rng) => { let n = 0; while (n === 0) n = rnd(a, b, rng); return n; };

// --- Aufgabenvorlagen. Jede liefert { prompt, answer, wrong[], why, numeric?, value? } ---

function addSub(rng) {
  const a = nz(-12, 12, rng), b = nz(-12, 12, rng), sub = rng() < 0.5;
  const r = sub ? a - b : a + b;
  const expr = `${fmt(a)} ${sub ? MINUS : '+'} ${par(b)}`;
  const wrong = sub ? [a + b, -(a - b), Math.abs(a) - Math.abs(b)] : [-(a + b), Math.abs(a) + Math.abs(b), a - b];
  return { prompt: expr, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, wrong, rng).map(fmt),
    why: sub ? `Subtrahieren heißt Gegenzahl addieren: ${fmt(a)} + ${par(-b)} = ${fmt(r)}.` : `${fmt(a)} + ${par(b)} = ${fmt(r)}. Bei verschiedenen Vorzeichen rechnest du den Unterschied der Beträge.` };
}

function mulDiv(rng) {
  const a = nz(-9, 9, rng), b = nz(-9, 9, rng), div = rng() < 0.4;
  const r = div ? a : a * b;
  const expr = div ? `${fmt(a * b)} : ${par(b)}` : `${par(a)} · ${par(b)}`;
  const wrong = [-r, Math.abs(r), a + b];
  return { prompt: expr, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, wrong, rng).map(fmt),
    why: `${(a < 0) === (b < 0) ? 'Gleiche' : 'Verschiedene'} Vorzeichen ergeben ${(a < 0) === (b < 0) ? 'Plus' : 'Minus'}, also ${fmt(r)}.` };
}

function collect(rng) {
  const a = rnd(2, 9, rng), b = rnd(2, 9, rng), c = rnd(1, 6, rng), r = a + b - c;
  const prompt = `${a}x + ${b}x ${MINUS} ${c}x`;
  return { prompt, answer: `${r}x`, wrong: [`${a + b + c}x`, `${a + b - c}`, `${a * b - c}x`], why: `Gleichartige Summanden zusammenfassen: ${a} + ${b} ${MINUS} ${c} = ${r}, also ${r}x.` };
}

function collectMixed(rng) {
  const a = rnd(3, 9, rng), c = rnd(1, 2, rng), k = rnd(2, 9, rng), m = rnd(2, 9, rng);
  const ra = a - c, rc = k + m;
  return { prompt: `${a}x + ${k} ${MINUS} ${c}x + ${m}`, answer: linear(ra, rc), wrong: [linear(a + c, rc), `${ra + rc}x`, linear(ra, k - m)],
    why: `Die x-Summanden: ${a}x ${MINUS} ${c}x = ${ra}x. Die Zahlen: ${k} + ${m} = ${rc}. Zusammen: ${linear(ra, rc)}.` };
}

function expand(rng) {
  const f = rnd(2, 9, rng), c = rnd(1, 9, rng);
  return { prompt: `${f} · (x + ${c})`, answer: linear(f, f * c), wrong: [linear(f, c), linear(1, f * c), linear(f, f + c)],
    why: `Distributivgesetz: ${f}·x + ${f}·${c} = ${linear(f, f * c)}. Der Faktor gilt für jeden Summanden.` };
}

function minusBracket(rng) {
  const k = rnd(5, 20, rng), c = rnd(1, 9, rng);
  return { prompt: `${k} ${MINUS} (x ${MINUS} ${c})`, answer: linear(-1, k + c), wrong: [linear(-1, k - c), linear(1, k + c), linear(-1, c - k)],
    why: `Minus vor der Klammer dreht beide Vorzeichen um: ${k} ${MINUS} x + ${c} = ${linear(-1, k + c)}.` };
}

function ausklammern(rng) {
  const g = pick([2, 3, 4, 5, 6], rng), a = rnd(2, 5, rng), c = rnd(2, 6, rng), A = g * a, C = g * c;
  const right = `${g} · (${linear(a, c)})`;
  return { prompt: `Klammere den größten gemeinsamen Faktor aus: ${linear(A, C)}`, answer: right,
    wrong: [`${g} · (${linear(a, C)})`, `${g * 2} · (${linear(a, c)})`, `${a} · (${linear(g, c)})`, `${g} · (${linear(A, c)})`],
    choiceOnly: true, label: 'Ausklammern',
    why: `Gemeinsamer Faktor von ${A} und ${C} ist ${g}. Teile jeden Summanden durch ${g}: ${linear(a, c)}. Probe durch Ausmultiplizieren: ${g}·${a}x + ${g}·${c} = ${linear(A, C)}.` };
}

function solve(rng) {
  const x = nz(-9, 9, rng), a = rnd(2, 9, rng), b = nz(-12, 12, rng), c = a * x + b;
  const prompt = `${linear(a, b)} = ${fmt(c)}`;
  const wrong = [(c + b) / a, c - b, x * -1, (c - b) * a];
  return { prompt, answer: fmt(x), value: x, numeric: true, wrong: nearby(x, wrong.filter(Number.isInteger), rng).map(fmt),
    why: `${b < 0 ? '+' + Math.abs(b) : MINUS + b}: ${a}x = ${fmt(c - b)}. Dann : ${a}, und es folgt x = ${fmt(x)}. Probe: ${a}·${par(x)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)} = ${fmt(c)}.`, label: 'Löse nach x auf' };
}

function anzahlLoesungen(rng) {
  const k = rnd(2, 5, rng), c = rnd(1, 6, rng), d = rnd(1, 6, rng) + c;
  const cases = [
    [`${linear(k, c)} = ${linear(k, d)}`, 'keine Lösung', `Auf beiden Seiten steht ${k}x. Zieht man es ab, bleibt ${c} = ${d}. Das ist falsch, also gibt es keine Lösung.`],
    [`${k} · (x + ${c}) = ${linear(k, k * c)}`, 'unendlich viele Lösungen', `Links ausmultiplizieren ergibt ${linear(k, k * c)}, genau die rechte Seite. Die Gleichung stimmt für jedes x.`],
    [`${linear(k, c)} = ${k * (c + 1) + c}`, 'genau eine Lösung', `Hier steht links ein x-Term und rechts nur eine Zahl. Das ergibt genau einen Wert für x.`]
  ];
  const [eq, ans, why] = pick(cases, rng);
  const all = ['keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen', 'genau zwei Lösungen'];
  return { prompt: eq, answer: ans, wrong: all.filter((o) => o !== ans), choiceOnly: true, label: 'Wie viele Lösungen hat die Gleichung?', why };
}

function aufstellen(rng) {
  const k = rnd(2, 6, rng), c = rnd(2, 9, rng), x = rnd(2, 8, rng), r = k * x + c;
  const eq = `${k}x + ${c} = ${r}`;
  return { prompt: `Das ${k}-Fache einer Zahl, vermehrt um ${c}, ergibt ${r}. Welche Gleichung gehört dazu?`, answer: eq,
    wrong: [`${k + c}x = ${r}`, `${k}x ${MINUS} ${c} = ${r}`, `${c}x + ${k} = ${r}`, `${k}(x + ${c}) = ${r}`], choiceOnly: true, label: 'Gleichung aufstellen',
    why: `„Das ${k}-Fache einer Zahl“ ist ${k}x. „Vermehrt um ${c}“ heißt + ${c}. „Ergibt ${r}“ ist = ${r}. Lösung: x = ${x}.` };
}

function firstStep(rng) {
  const a = rnd(2, 9, rng), b = rnd(2, 15, rng), x = rnd(2, 9, rng), c = a * x + b, plus = rng() < 0.5;
  const eq = plus ? `${a}x + ${b} = ${c}` : `${a}x ${MINUS} ${b} = ${a * x - b}`;
  const step = plus ? `| ${MINUS} ${b}` : `| + ${b}`;
  return { prompt: eq, answer: step, wrong: [`| : ${a}`, plus ? `| + ${b}` : `| ${MINUS} ${b}`, `| · ${a}`],
    why: `Zuerst wird das ${plus ? 'Plus' : 'Minus'} neben dem x rückgängig gemacht (${step}). Das Teilen durch ${a} kommt danach.`, label: 'Welcher Umformungsschritt kommt zuerst?', choiceOnly: true };
}

const GRUND = [40, 50, 60, 80, 120, 150, 200, 250, 400, 500, 800];
const SATZ = [5, 10, 20, 25, 30, 40, 50, 75];

function prozentwert(rng) {
  const g = pick(GRUND, rng), p = pick(SATZ, rng), w = g * p / 100;
  return { prompt: `Wie viel sind ${p} % von ${g} €?`, answer: fmt(w), value: w, numeric: true, wrong: nearby(w, [g - w, g + w, p], rng).map(fmt),
    why: `${p} % = ${p}/100. Also ${g} · ${p}/100 = ${fmt(w)} €.` };
}

function grundwert(rng) {
  const g = pick(GRUND, rng), p = pick(SATZ, rng), w = g * p / 100;
  return { prompt: `${p} % eines Preises sind ${fmt(w)} €. Wie hoch ist der ganze Preis (der Grundwert)?`, answer: fmt(g), value: g, numeric: true, wrong: nearby(g, [w * p, g / 2, w + p], rng).map(fmt),
    why: `${p} % sind ${fmt(w)} €. 1 % sind ${fmt(w / p)} €. 100 % sind ${fmt(g)} €.` };
}

function prozentsatz(rng) {
  const g = pick(GRUND, rng), p = pick(SATZ, rng), w = g * p / 100;
  return { prompt: `Von ${g} Schülern spielen ${fmt(w)} ein Instrument. Wie viel Prozent sind das?`, answer: String(p), value: p, numeric: true, wrong: nearby(p, [100 - p, w, p * 2], rng).map(String),
    why: `Prozentsatz = Prozentwert : Grundwert = ${fmt(w)} : ${g} = ${p / 100} = ${p} %.` };
}

function rabatt(rng) {
  const g = pick([40, 60, 80, 120, 150, 200], rng), p = pick([10, 20, 25, 50], rng), n = g * (100 - p) / 100;
  return { prompt: `Eine Jacke kostet ${g} €. Im Sale gibt es ${p} % Rabatt. Was kostet sie jetzt?`, answer: fmt(n), value: n, numeric: true, wrong: nearby(n, [g * p / 100, g + g * p / 100, g - p], rng).map(fmt),
    why: `Rabatt: ${fmt(g * p / 100)} €. Neuer Preis: ${g} ${MINUS} ${fmt(g * p / 100)} = ${fmt(n)} €. Kurz: Du zahlst ${100 - p} %.` };
}

const KAP = [200, 400, 500, 800, 1000, 1500, 2000, 2500, 4000];
const ZINS = [1, 2, 3, 4, 5];

function zinsen(rng) {
  const k = pick(KAP, rng), p = pick(ZINS, rng), z = k * p / 100;
  return { prompt: `Lena legt ${fmt(k)} € für ein Jahr zu ${p} % Zinsen an. Wie viel Zinsen bekommt sie?`, answer: fmt(z), value: z, numeric: true, wrong: nearby(z, [k + z, k * p, k / p], rng).map(fmt),
    why: `Jahreszinsen = Kapital · Zinssatz = ${fmt(k)} · ${p}/100 = ${fmt(z)} €.` };
}

function kapital(rng) {
  const k = pick(KAP, rng), p = pick(ZINS, rng), z = k * p / 100;
  return { prompt: `Ein Sparbuch bringt bei ${p} % Zinssatz in einem Jahr ${fmt(z)} € Zinsen. Wie hoch ist das Kapital?`, answer: fmt(k), value: k, numeric: true, wrong: nearby(k, [z * p, k / 2, z + p], rng).map(fmt),
    why: `${p} % entsprechen ${fmt(z)} €. 1 % sind ${fmt(z / p)} €, 100 % sind ${fmt(k)} €. Das Kapital ist der Grundwert.` };
}

function zinssatz(rng) {
  const k = pick(KAP, rng), p = pick(ZINS, rng), z = k * p / 100;
  return { prompt: `Auf ${fmt(k)} € gibt es nach einem Jahr ${fmt(z)} € Zinsen. Wie hoch ist der Zinssatz in Prozent?`, answer: String(p), value: p, numeric: true, wrong: nearby(p, [100 - p, p * 2, z / 10], rng).map(fmt),
    why: `Zinssatz = Zinsen : Kapital = ${fmt(z)} : ${fmt(k)} = ${p / 100} = ${p} %.` };
}

function zinsMonate(rng) {
  const k = pick([1200, 2400, 3600, 6000], rng), p = pick([2, 3, 4, 5], rng), m = pick([3, 6, 9], rng), z = k * p / 100 * m / 12;
  return { prompt: `${fmt(k)} € werden ${m} Monate lang zu ${p} % angelegt. Wie hoch sind die Zinsen?`, answer: fmt(z), value: z, numeric: true, wrong: nearby(z, [k * p / 100, z * 2, k * p / 100 * m], rng).map(fmt),
    why: `Für ein ganzes Jahr gäbe es ${fmt(k * p / 100)} €. ${m} Monate sind ${m}/12 eines Jahres: ${fmt(k * p / 100)} · ${m}/12 = ${fmt(z)} €.` };
}

function zinseszins(rng) {
  const [k, p, n] = pick([[1000, 10, 2], [2000, 10, 2], [1000, 10, 3], [2000, 5, 2], [4000, 5, 2], [4000, 10, 2]], rng);
  const r = k * (1 + p / 100) ** n;
  return { prompt: `${fmt(k)} € werden ${n} Jahre zu ${p} % angelegt, die Zinsen bleiben auf dem Konto (Zinseszins). Wie viel Geld ist es am Ende?`, answer: fmt(r), value: r, numeric: true,
    wrong: nearby(r, [k * (1 + n * p / 100), k * p / 100 * n, k * (1 + p / 100) * n], rng).map(fmt),
    why: `Jedes Jahr wächst das Kapital auf ${100 + p} %, also mal ${fmt(1 + p / 100)}. Nach ${n} Jahren: ${fmt(k)} · ${fmt(1 + p / 100)}${n === 2 ? ' · ' + fmt(1 + p / 100) : n === 3 ? ' · ' + fmt(1 + p / 100) + ' · ' + fmt(1 + p / 100) : ''} = ${fmt(r)} €. Ohne Zinseszins wären es weniger.` };
}

function dreisatzProp(rng) {
  const n1 = pick([3, 4, 5, 6, 8], rng), u = pick([2, 3, 4, 5, 6], rng), n2 = pick([2, 7, 9, 10, 12].filter((n) => n !== n1), rng), p1 = n1 * u, r = n2 * u;
  return { prompt: `${n1} Hefte kosten ${p1} €. Wie viel kosten ${n2} Hefte?`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [p1 + (n2 - n1), p1 * n2, p1 * n1 / n2], rng).map(fmt),
    why: `Je mehr Hefte, desto mehr Geld (proportional). 1 Heft kostet ${p1} : ${n1} = ${u} €. ${n2} Hefte kosten ${n2} · ${u} = ${fmt(r)} €.` };
}

function dreisatzAnti(rng) {
  const w1 = pick([2, 3, 4, 6], rng), d = pick([6, 8, 12, 24], rng), total = w1 * d;
  const w2 = pick([2, 3, 4, 6, 8, 12].filter((w) => w !== w1 && total % w === 0), rng), r = total / w2;
  return { prompt: `${w1} Arbeiter brauchen für eine Aufgabe ${d} Tage. Wie lange brauchen ${w2} Arbeiter?`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [d * w2 / w1, d + (w2 - w1), total], rng).map(fmt),
    why: `Mehr Arbeiter, weniger Tage (antiproportional). Das Produkt bleibt gleich: ${w1} · ${d} = ${total} Arbeitertage. Geteilt durch ${w2} Arbeiter sind das ${fmt(r)} Tage.` };
}

function erkennen(rng) {
  const [s, a] = pick(SITUATIONS, rng);
  const all = ['proportional', 'antiproportional', 'weder noch', 'beides'];
  const why = { proportional: 'Doppelt so viel von der einen Größe heißt doppelt so viel von der anderen.', antiproportional: 'Doppelt so viel von der einen Größe heißt nur halb so viel von der anderen. Das Produkt bleibt gleich.', 'weder noch': 'Hier gibt es keine feste Regel. Der Zusammenhang ist weder ein festes Vielfaches noch ein festes Produkt.' };
  return { prompt: s, answer: a, wrong: all.filter((o) => o !== a), choiceOnly: true, label: 'Welche Zuordnung ist das?', why: why[a] };
}

// --- Daten und Zufall ---

const sum = (xs) => xs.reduce((s, v) => s + v, 0);
const list = (xs) => xs.join(', ');

function mittelwert(rng) {
  const n = pick([4, 5, 6], rng), xs = Array.from({ length: n - 1 }, () => rnd(1, 12, rng));
  let last = rnd(1, 12, rng);
  while ((sum(xs) + last) % n) last = (last % 12) + 1;
  xs.push(last);
  const r = sum(xs) / n, med = [...xs].sort((a, b) => a - b);
  return { prompt: `Berechne den Mittelwert: ${list(xs)}`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [sum(xs), Math.max(...xs), med[Math.floor(n / 2)]], rng).map(fmt),
    why: `Mittelwert = Summe : Anzahl. Summe: ${sum(xs)}, Anzahl: ${n}. ${sum(xs)} : ${n} = ${fmt(r)}.` };
}

// RULE-056 (Entscheidung 2026-10-26): Bei gerader Anzahl ist der Median das Mittel der beiden mittleren Werte.
function median(rng) {
  const n = pick([5, 6, 7, 8], rng);
  let xs;
  do xs = Array.from({ length: n }, () => rnd(1, 15, rng)); while (new Set(xs).size < n - 1);
  const s = [...xs].sort((a, b) => a - b);
  const middle = n % 2 ? [s[(n - 1) / 2]] : [s[n / 2 - 1], s[n / 2]];
  const r = middle.reduce((a, b) => a + b, 0) / middle.length;
  const extras = n % 2 ? [xs[(n - 1) / 2], sum(xs) / n, s[n - 1]] : [...middle, sum(xs) / n, s[n - 1]];
  const why = n % 2
    ? `Erst der Größe nach ordnen: ${list(s)}. Der Median ist der Wert in der Mitte, hier ${fmt(r)}.`
    : `Erst der Größe nach ordnen: ${list(s)}. Bei einer geraden Anzahl ist der Median das Mittel der beiden mittleren Werte: (${fmt(middle[0])} + ${fmt(middle[1])}) : 2 = ${fmt(r)}.`;
  return { prompt: `Bestimme den Median: ${list(xs)}`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, extras, rng).map(fmt), why };
}

function spannweite(rng) {
  const xs = Array.from({ length: 6 }, () => rnd(2, 30, rng)), mx = Math.max(...xs), mn = Math.min(...xs), r = mx - mn;
  return { prompt: `Wie groß ist die Spannweite? ${list(xs)}`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [mx, mn, mx + mn], rng).map(fmt),
    why: `Spannweite = größter Wert minus kleinster Wert = ${mx} ${MINUS} ${mn} = ${r}.` };
}

function modus(rng) {
  const m = rnd(1, 9, rng), others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m), rng).slice(0, 3);
  const xs = shuffle([m, m, m, ...others, others[0]], rng);
  return { prompt: `Welcher Wert kommt am häufigsten vor (Modus)? ${list(xs)}`, answer: fmt(m), value: m, numeric: true, wrong: nearby(m, [...others, Math.max(...xs)], rng).map(fmt),
    why: `Der Modus ist der häufigste Wert. Die ${m} steht dreimal in der Liste, jeder andere Wert höchstens zweimal.` };
}

const EVENTS = [
  ['eine gerade Zahl', 3], ['eine Zahl größer als 4', 2], ['eine Zahl kleiner als 3', 2], ['die Zahl 6', 1], ['eine Zahl, die kleiner als 7 ist', 6], ['keine 6', 5]
];

function wuerfel(rng) {
  const [text, k] = pick(EVENTS, rng), r = k / 6;
  const wrong = [frac(6 - k, 6), frac(k, 5), frac(1, k + 1), frac(k + 1, 6), frac(6, k), frac(k, 3)].filter((w) => w !== frac(k, 6));
  return { prompt: `Wie groß ist die Wahrscheinlichkeit, mit einem Würfel ${text} zu würfeln?`, answer: frac(k, 6), check: probCheck(r), value: r, wrong: [...new Set(wrong)],
    why: `Laplace: günstige Ergebnisse : alle Ergebnisse. Es gibt ${k} günstige von 6, also ${k}/6 = ${frac(k, 6)}.` };
}

function urne(rng) {
  const r = rnd(2, 6, rng), b = rnd(2, 6, rng), n = r + b, c = rnd(1, 2, rng);
  const color = c === 1 ? 'rote' : 'blaue', k = c === 1 ? r : b, fav = frac(k, n);
  return { prompt: `In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, eine ${color} Kugel zu ziehen?`, answer: fav, check: probCheck(k / n), value: k / n,
    wrong: [...new Set([frac(n - k, n), frac(k, n - k), frac(1, n), frac(k, n + 1), frac(n - k, k)])].filter((x) => x !== fav),
    why: `${k} günstige Kugeln, ${n} Kugeln insgesamt. P = ${k}/${n}${fav === `${k}/${n}` ? '' : ' = ' + fav}.` };
}

function relativ(rng) {
  const n = pick([20, 25, 40, 50, 100], rng), k = rnd(2, n - 2, rng), r = k / n;
  return { prompt: `Eine Münze wurde ${n}-mal geworfen. Dabei fiel ${k}-mal Zahl. Wie groß ist die relative Häufigkeit für Zahl?`, answer: fmt(r), check: probCheck(r), value: r,
    wrong: [fmt((n - k) / n), fmt(k / (n - k)), fmt(n / k)].filter((x) => x !== fmt(r)).concat([fmt(Math.round((k + 1) / n * 1000) / 1000)]),
    why: `Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche = ${k} : ${n} = ${fmt(r)} (also ${fmt(r * 100)} %).` };
}

// --- Kredit und Tilgung: gleichbleibende Tilgung, Zinsen immer auf die Restschuld ---

const kredit = (rng) => {
  const n = pick([4, 5, 6, 8, 10], rng), t = pick([100, 200, 250, 300, 400, 500], rng);
  return { n, t, k: n * t, p: pick([2, 3, 4, 5, 6], rng) };
};

function kreditZinsen(rng) {
  const { k, p } = kredit(rng), z = k * p / 100;
  return { prompt: `Tom leiht sich ${fmt(k)} € zu ${p} % Zinsen pro Jahr. Wie hoch sind die Zinsen im ersten Jahr?`, answer: fmt(z), value: z, numeric: true, wrong: nearby(z, [k + z, k * p, k / p], rng).map(fmt),
    why: `Im ersten Jahr schuldet Tom noch den ganzen Kredit. Zinsen = ${fmt(k)} · ${p}/100 = ${fmt(z)} €.` };
}

function kreditRate(rng) {
  const { k, t, p } = kredit(rng), z = k * p / 100, rate = t + z;
  return { prompt: `Ein Kredit über ${fmt(k)} € kostet ${p} % Zinsen pro Jahr. Jedes Jahr werden ${fmt(t)} € getilgt. Wie hoch ist die Rate im ersten Jahr (Tilgung plus Zinsen)?`, answer: fmt(rate), value: rate, numeric: true, wrong: nearby(rate, [z, t, k + z], rng).map(fmt),
    why: `Zinsen im ersten Jahr: ${fmt(k)} · ${p}/100 = ${fmt(z)} €. Rate = Tilgung + Zinsen = ${fmt(t)} + ${fmt(z)} = ${fmt(rate)} €.` };
}

function restschuld(rng) {
  const { n, t, k } = kredit(rng), m = rnd(1, n - 1, rng), rest = k - m * t;
  return { prompt: `Ein Kredit über ${fmt(k)} € wird jedes Jahr mit ${fmt(t)} € getilgt. Wie hoch ist die Restschuld nach ${m} ${m === 1 ? 'Jahr' : 'Jahren'}?`, answer: fmt(rest), value: rest, numeric: true, wrong: nearby(rest, [m * t, k - (m + 1) * t, k + m * t], rng).map(fmt),
    why: `Die Tilgung verkleinert die Schuld. ${m} · ${fmt(t)} = ${fmt(m * t)} € sind getilgt. Restschuld = ${fmt(k)} ${MINUS} ${fmt(m * t)} = ${fmt(rest)} €.` };
}

function zinsenZweitesJahr(rng) {
  const { k, t, p } = kredit(rng), rest = k - t, z = rest * p / 100;
  return { prompt: `Ein Kredit über ${fmt(k)} € wird jährlich mit ${fmt(t)} € getilgt, der Zinssatz ist ${p} %. Wie hoch sind die Zinsen im zweiten Jahr?`, answer: fmt(z), value: z, numeric: true, wrong: nearby(z, [k * p / 100, t * p / 100, rest], rng).map(fmt),
    why: `Im zweiten Jahr zahlt man nur noch Zinsen auf die Restschuld: ${fmt(k)} ${MINUS} ${fmt(t)} = ${fmt(rest)} €. Zinsen = ${fmt(rest)} · ${p}/100 = ${fmt(z)} €.` };
}

function laufzeit(rng) {
  const { n, t, k } = kredit(rng);
  return { prompt: `Ein Kredit über ${fmt(k)} € wird jedes Jahr mit ${fmt(t)} € getilgt. Nach wie vielen Jahren ist er abbezahlt?`, answer: String(n), value: n, numeric: true, wrong: nearby(n, [k - t, n * 2, n - 1], rng).map(String),
    why: `So oft passt die Tilgung in den Kredit: ${fmt(k)} : ${fmt(t)} = ${n} Jahre.` };
}

export const POOLS = {
  vorzeichen: [addSub, addSub, mulDiv],
  terme: [collect, collectMixed, expand, minusBracket, ausklammern],
  gleichungen: [solve, solve, firstStep, aufstellen, anzahlLoesungen],
  prozent: [prozentwert, grundwert, prozentsatz, rabatt],
  zinsen: [zinsen, kapital, zinssatz, zinsMonate, zinseszins],
  kredit: [kreditZinsen, kreditRate, restschuld, zinsenZweitesJahr, laufzeit],
  zuordnungen: [dreisatzProp, dreisatzAnti, erkennen, dreisatzProp, dreisatzAnti],
  daten: [mittelwert, median, spannweite, modus],
  zufall: [wuerfel, urne, relativ]
};

// --- Aufgabe zu Frage ---

/** Auswahlfrage mit der richtigen Antwort und höchstens drei falschen (RULE-223). Die Reihenfolge wird mit rng gemischt. */
export function choice(item, rng) {
  const label = item.label || (item.numeric && !item.prompt.includes('?') ? 'Berechne' : item.prompt.includes('?') ? 'Rechne und wähle' : 'Vereinfache');
  return choiceQuestion({
    label, prompt: esc(item.prompt), promptStyle: item.prompt.length > 28 ? 'sentence' : 'big',
    answer: item.answer, choices: [item.answer, ...item.wrong.slice(0, 3)], why: item.why, rng
  });
}

/** Eingabefrage. Zahlen und Brüche über ihren Prüfer, Terme über den Termprüfer. */
export function typed(item) {
  const check = item.choiceOnly ? undefined : item.check || (item.numeric ? numCheck(item.value) : termCheck(item.answer));
  return typedQuestion({
    label: 'Gib das Ergebnis ein', prompt: esc(item.prompt), promptStyle: item.prompt.length > 28 ? 'sentence' : 'big',
    answer: item.answer, check, placeholder: item.check ? 'Bruch, Dezimalzahl oder Prozent' : item.numeric ? 'Zahl eintippen' : item.choiceOnly ? '| …' : 'Term eintippen', why: item.why
  });
}

/** Eine Aufgabe mit mindestens drei verschiedenen falschen Antworten. Nach MAX_TRIES Versuchen gibt es einen Fehler. */
export function make(unitId, rng) {
  for (let tries = 1; tries <= MAX_TRIES; tries++) {
    const item = pick(POOLS[unitId], rng)(rng);
    item.wrong = [...new Set(item.wrong)].filter((w) => w !== item.answer);
    if (item.wrong.length >= 3) return item;
  }
  throw new RangeError(`Keine Aufgabe für ${unitId} mit drei falschen Antworten nach ${MAX_TRIES} Versuchen`);
}
const canType = (item) => !item.choiceOnly;

/** 8 Fragen, jede dritte zum Eintippen. */
export function lessonRound(unit, rng) {
  // Jeder Platz wird neu gewürfelt, solange er eine schon gezeigte Aufgabe liefert (runde/src/vielfalt.js).
  return distinctSlots(8, rng, (i, r) => {
    const item = make(unit.id, r);
    return i % 3 === 2 && canType(item) ? typed(item) : choice(item, r);
  });
}

const anyItem = (rng) => make(pick(UNITS, rng).id, rng);
export const quickRound = (rng) => distinctSlots(5, rng, (_, r) => choice(anyItem(r), r));
export const blitzQuestion = (rng) => choice(anyItem(rng), rng);
export const bossRound = (rng) => distinctSlots(12, rng, (i, r) => {
  const item = make(UNITS[i % UNITS.length].id, r);
  return i % 4 === 3 && canType(item) ? typed(item) : choice(item, r);
});
