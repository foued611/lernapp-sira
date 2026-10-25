// Erzeugt Mathe-Fragen aus Zufallszahlen. Jede Aufgabe kennt typische Fehlerwege und bietet sie als falsche Antworten an.
import { choiceQuestion, typedQuestion } from '../../core/js/questions.js';
import { esc } from '../../core/js/ui.js';
import { UNITS } from './data.js';
import { rnd, fmt, par, MINUS, nearby, numCheck, termCheck, probCheck, frac, linear, pick, shuffle } from './math.js';

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
    why: `Zuerst wird das ${plus ? 'Plus' : 'Minus'} neben dem x rückgängig gemacht (${step}). Das Teilen durch ${a} kommt danach.`, label: 'Welcher Umformungsschritt kommt zuerst?', choiceOnly: true };
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


const KAP = [200, 400, 500, 800, 1000, 1500, 2000, 2500, 4000];
const ZINS = [1, 2, 3, 4, 5];

function zinsen() {
  const k = pick(KAP), p = pick(ZINS), z = k * p / 100;
  return { prompt: `Lena legt ${fmt(k)} € für ein Jahr zu ${p} % Zinsen an. Wie viel Zinsen bekommt sie?`, answer: fmt(z), value: z, numeric: true, wrong: nearby(z, [k + z, k * p, k / p]).map(fmt),
    why: `Jahreszinsen = Kapital · Zinssatz = ${fmt(k)} · ${p}/100 = ${fmt(z)} €.` };
}

function kapital() {
  const k = pick(KAP), p = pick(ZINS), z = k * p / 100;
  return { prompt: `Ein Sparbuch bringt bei ${p} % Zinssatz in einem Jahr ${fmt(z)} € Zinsen. Wie hoch ist das Kapital?`, answer: fmt(k), value: k, numeric: true, wrong: nearby(k, [z * p, k / 2, z + p]).map(fmt),
    why: `${p} % entsprechen ${fmt(z)} €. 1 % sind ${fmt(z / p)} €, 100 % sind ${fmt(k)} €. Das Kapital ist der Grundwert.` };
}

function zinssatz() {
  const k = pick(KAP), p = pick(ZINS), z = k * p / 100;
  return { prompt: `Auf ${fmt(k)} € gibt es nach einem Jahr ${fmt(z)} € Zinsen. Wie hoch ist der Zinssatz in Prozent?`, answer: String(p), value: p, numeric: true, wrong: nearby(p, [100 - p, p * 2, z / 10]).map(fmt),
    why: `Zinssatz = Zinsen : Kapital = ${fmt(z)} : ${fmt(k)} = ${p / 100} = ${p} %.` };
}

function zinsMonate() {
  const k = pick([1200, 2400, 3600, 6000]), p = pick([2, 3, 4, 5]), m = pick([3, 6, 9]), z = k * p / 100 * m / 12;
  return { prompt: `${fmt(k)} € werden ${m} Monate lang zu ${p} % angelegt. Wie hoch sind die Zinsen?`, answer: fmt(z), value: z, numeric: true, wrong: nearby(z, [k * p / 100, z * 2, k * p / 100 * m]).map(fmt),
    why: `Für ein ganzes Jahr gäbe es ${fmt(k * p / 100)} €. ${m} Monate sind ${m}/12 eines Jahres: ${fmt(k * p / 100)} · ${m}/12 = ${fmt(z)} €.` };
}

function dreisatzProp() {
  const n1 = pick([3, 4, 5, 6, 8]), u = pick([2, 3, 4, 5, 6]), n2 = pick([2, 7, 9, 10, 12].filter((n) => n !== n1)), p1 = n1 * u, r = n2 * u;
  return { prompt: `${n1} Hefte kosten ${p1} €. Wie viel kosten ${n2} Hefte?`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [p1 + (n2 - n1), p1 * n2, p1 * n1 / n2]).map(fmt),
    why: `Je mehr Hefte, desto mehr Geld (proportional). 1 Heft kostet ${p1} : ${n1} = ${u} €. ${n2} Hefte kosten ${n2} · ${u} = ${fmt(r)} €.` };
}

function dreisatzAnti() {
  const w1 = pick([2, 3, 4, 6]), d = pick([6, 8, 12, 24]), total = w1 * d;
  const w2 = pick([2, 3, 4, 6, 8, 12].filter((w) => w !== w1 && total % w === 0)), r = total / w2;
  return { prompt: `${w1} Arbeiter brauchen für eine Aufgabe ${d} Tage. Wie lange brauchen ${w2} Arbeiter?`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [d * w2 / w1, d + (w2 - w1), total]).map(fmt),
    why: `Mehr Arbeiter, weniger Tage (antiproportional). Das Produkt bleibt gleich: ${w1} · ${d} = ${total} Arbeitertage. Geteilt durch ${w2} Arbeiter sind das ${fmt(r)} Tage.` };
}

const SITUATIONS = [
  ['Anzahl der Brötchen ↔ Preis', 'proportional'], ['Anzahl der Kopien ↔ Gesamtkosten', 'proportional'], ['gelaufene Zeit bei gleichem Tempo ↔ Strecke', 'proportional'],
  ['Anzahl der Arbeiter ↔ Zeit für dieselbe Arbeit', 'antiproportional'], ['Geschwindigkeit ↔ Fahrzeit auf einer festen Strecke', 'antiproportional'], ['Anzahl der Teilnehmer ↔ Preis pro Person bei festem Gesamtpreis', 'antiproportional'],
  ['Alter eines Kindes ↔ seine Körpergröße', 'weder noch'], ['Schuhgröße ↔ Mathenote', 'weder noch']
];

function erkennen() {
  const [s, a] = pick(SITUATIONS);
  const all = ['proportional', 'antiproportional', 'weder noch', 'beides'];
  const why = { proportional: 'Doppelt so viel von der einen Größe heißt doppelt so viel von der anderen.', antiproportional: 'Doppelt so viel von der einen Größe heißt nur halb so viel von der anderen. Das Produkt bleibt gleich.', 'weder noch': 'Hier gibt es keine feste Regel. Der Zusammenhang ist weder ein festes Vielfaches noch ein festes Produkt.' };
  return { prompt: s, answer: a, wrong: all.filter((o) => o !== a), choiceOnly: true, label: 'Welche Zuordnung ist das?', why: why[a] };
}

// --- Daten und Zufall ---

const sum = (xs) => xs.reduce((s, v) => s + v, 0);
const list = (xs) => xs.join(', ');

function mittelwert() {
  const n = pick([4, 5, 6]), xs = Array.from({ length: n - 1 }, () => rnd(1, 12));
  let last = rnd(1, 12);
  while ((sum(xs) + last) % n) last = (last % 12) + 1;
  xs.push(last);
  const r = sum(xs) / n, med = [...xs].sort((a, b) => a - b);
  return { prompt: `Berechne den Mittelwert: ${list(xs)}`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [sum(xs), Math.max(...xs), med[Math.floor(n / 2)]]).map(fmt),
    why: `Mittelwert = Summe : Anzahl. Summe: ${sum(xs)}, Anzahl: ${n}. ${sum(xs)} : ${n} = ${fmt(r)}.` };
}

function median() {
  const n = pick([5, 7]);
  let xs;
  do xs = Array.from({ length: n }, () => rnd(1, 15)); while (new Set(xs).size < n - 1);
  const s = [...xs].sort((a, b) => a - b), r = s[(n - 1) / 2];
  return { prompt: `Bestimme den Median: ${list(xs)}`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [xs[(n - 1) / 2], sum(xs) / n, s[n - 1]]).map(fmt),
    why: `Erst der Größe nach ordnen: ${list(s)}. Der Median ist der Wert in der Mitte, hier ${fmt(r)}.` };
}

function spannweite() {
  const xs = Array.from({ length: 6 }, () => rnd(2, 30)), mx = Math.max(...xs), mn = Math.min(...xs), r = mx - mn;
  return { prompt: `Wie groß ist die Spannweite? ${list(xs)}`, answer: fmt(r), value: r, numeric: true, wrong: nearby(r, [mx, mn, mx + mn]).map(fmt),
    why: `Spannweite = größter Wert minus kleinster Wert = ${mx} ${MINUS} ${mn} = ${r}.` };
}

function modus() {
  const m = rnd(1, 9), others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m)).slice(0, 3);
  const xs = shuffle([m, m, m, ...others, others[0]]);
  return { prompt: `Welcher Wert kommt am häufigsten vor (Modus)? ${list(xs)}`, answer: fmt(m), value: m, numeric: true, wrong: nearby(m, [...others, Math.max(...xs)]).map(fmt),
    why: `Der Modus ist der häufigste Wert. Die ${m} steht dreimal in der Liste, jeder andere Wert höchstens zweimal.` };
}

const EVENTS = [
  ['eine gerade Zahl', 3], ['eine Zahl größer als 4', 2], ['eine Zahl kleiner als 3', 2], ['die Zahl 6', 1], ['eine Zahl, die kleiner als 7 ist', 6], ['keine 6', 5]
];

function wuerfel() {
  const [text, k] = pick(EVENTS), r = k / 6;
  const wrong = [frac(6 - k, 6), frac(k, 5), frac(1, k + 1), frac(k + 1, 6), frac(6, k), frac(k, 3)].filter((w) => w !== frac(k, 6));
  return { prompt: `Wie groß ist die Wahrscheinlichkeit, mit einem Würfel ${text} zu würfeln?`, answer: frac(k, 6), check: probCheck(r), value: r, wrong: [...new Set(wrong)],
    why: `Laplace: günstige Ergebnisse : alle Ergebnisse. Es gibt ${k} günstige von 6, also ${k}/6 = ${frac(k, 6)}.` };
}

function urne() {
  const r = rnd(2, 6), b = rnd(2, 6), n = r + b, w = frac(r, n), c = rnd(1, 2);
  const color = c === 1 ? 'rote' : 'blaue', k = c === 1 ? r : b, fav = frac(k, n);
  return { prompt: `In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, eine ${color} Kugel zu ziehen?`, answer: fav, check: probCheck(k / n), value: k / n,
    wrong: [...new Set([frac(n - k, n), frac(k, n - k), frac(1, n), frac(k, n + 1), frac(n - k, k)])].filter((x) => x !== fav),
    why: `${k} günstige Kugeln, ${n} Kugeln insgesamt. P = ${k}/${n}${fav === `${k}/${n}` ? '' : ' = ' + fav}.` };
}

function relativ() {
  const n = pick([20, 25, 40, 50, 100]), k = rnd(2, n - 2), r = k / n;
  return { prompt: `Eine Münze wurde ${n}-mal geworfen. Dabei fiel ${k}-mal Zahl. Wie groß ist die relative Häufigkeit für Zahl?`, answer: fmt(r), check: probCheck(r), value: r,
    wrong: [fmt((n - k) / n), fmt(k / (n - k)), fmt(n / k)].filter((x) => x !== fmt(r)).concat([fmt(Math.round((k + 1) / n * 1000) / 1000)]),
    why: `Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche = ${k} : ${n} = ${fmt(r)} (also ${fmt(r * 100)} %).` };
}

export const POOLS = {
  vorzeichen: [addSub, addSub, mulDiv],
  terme: [collect, collectMixed, expand, minusBracket],
  gleichungen: [solve, solve, firstStep],
  prozent: [prozentwert, grundwert, prozentsatz, rabatt],
  zinsen: [zinsen, kapital, zinssatz, zinsMonate],
  zuordnungen: [dreisatzProp, dreisatzAnti, erkennen, dreisatzProp, dreisatzAnti],
  daten: [mittelwert, median, spannweite, modus],
  zufall: [wuerfel, urne, relativ]
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
  const check = item.choiceOnly ? undefined : item.check || (item.numeric ? numCheck(item.value) : termCheck(item.answer));
  return typedQuestion({
    label: 'Gib das Ergebnis ein', prompt: esc(item.prompt), promptStyle: item.prompt.length > 28 ? 'sentence' : 'big',
    answer: item.answer, check, placeholder: item.check ? 'Bruch, Dezimalzahl oder Prozent' : item.numeric ? 'Zahl eintippen' : item.choiceOnly ? '| …' : 'Term eintippen', why: item.why, format: (v) => `<span class="mono">${esc(v)}</span>`
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
const canType = (item) => !item.choiceOnly;

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
