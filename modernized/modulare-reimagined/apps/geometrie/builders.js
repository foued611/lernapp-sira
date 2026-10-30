// Erzeugt Geometrie-Fragen (Herkunft: legacy/modulare/apps/geometrie/builders.js). Rechenaufgaben mit Zufallswerten,
// dazu Begriffs- und Konstruktionsfragen als feste Auswahl. Seit der Inhaltsprüfung vom 2026-10-30 weichen einige Erzeuger bewusst
// von der Legacy-Fassung ab, der Vergleich analysis/modulare/dual/geometrie_dual.mjs gilt deshalb nicht mehr.
//
// Schuld 6 (Endlosschleife): Ein Erzeuger, der keine Aufgabe mit drei falschen Antworten findet, bricht nach
// MAX_TRIES Versuchen mit einer Fehlermeldung ab. Die Seite zeigt dann "Die Aufgaben konnten nicht erzeugt werden."
import { choiceQuestion, typedQuestion, esc, distinctSlots } from '../../runde/index.js';
import { pick, shuffle, rnd, fmt, nearby, MINUS, numCheck } from '../../helfer/index.js';

// Seiten und Aufgabendaten kommen aus content/geometrie/ (siehe createBuilders). Hier liegt nur die Logik der Aufgaben.
const asWords = (list) => list.map((item) => ({ ...item, choiceOnly: true }));

export const MAX_TRIES = 200;

const D = '°';
// Längen und Winkel sind positiv. Sonst stünde bei kleinen Lösungen "−8 cm" unter den Optionen.
const positive = (value, extras, rng) => {
  const found = nearby(value, extras, rng).filter((v) => v > 0);
  for (let d = 1; found.length < 3; d++) if (!found.includes(value + d)) found.push(value + d);
  return found;
};

// Numerische Aufgabe. extras sind bevorzugte falsche Zahlen, die übrigen Plätze füllt nearby() mit rng.
const num = ({ value, prompt, why, label, extras = [], unit = '' }, rng) => ({
  prompt, answer: fmt(value) + unit, value, numeric: true, why, label,
  wrong: positive(value, extras, rng).map((v) => fmt(v) + unit), unit
});
const words = (prompt, answer, wrong, why, label) => ({ prompt, answer, wrong, why, label, choiceOnly: true });

// --- Mittelsenkrechte ---------------------------------------------------------------------------

function gleichWeit(rng) {
  const x = rnd(3, 12, rng);
  return num({
    value: x, prompt: `Der Punkt P liegt auf der Mittelsenkrechten der Strecke AB. Es ist PA = ${x} cm. Wie lang ist PB?`,
    why: `Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt. Also ist PB = PA = ${x} cm.`,
    label: 'Rechne', extras: [x * 2, x / 2, x + 1], unit: ' cm'
  }, rng);
}

function mitteStrecke(rng) {
  const h = rnd(2, 9, rng);
  return num({
    value: h, prompt: `Die Strecke AB ist ${2 * h} cm lang. Die Mittelsenkrechte schneidet AB im Punkt M. Wie lang ist AM?`,
    why: `M ist der Mittelpunkt der Strecke. AM = ${2 * h} cm : 2 = ${h} cm.`,
    label: 'Rechne', extras: [2 * h, h + 2, h * 2 + 1], unit: ' cm'
  }, rng);
}

function zirkelRadius(rng) {
  const ab = pick([4, 6, 8, 10], rng), h = ab / 2;
  return words(`Du konstruierst die Mittelsenkrechte der Strecke AB mit AB = ${ab} cm. Welchen Zirkelradius darfst du einstellen?`,
    `mehr als ${h} cm`, [`genau ${h} cm`, `weniger als ${h} cm`, `nur genau ${ab} cm`],
    `Die Kreisbögen um A und B müssen sich in zwei Punkten schneiden. Das klappt nur, wenn der Radius größer ist als die Hälfte der Strecke (${h} cm). Bei genau ${h} cm berühren sich die Bögen nur in M, bei weniger treffen sie sich gar nicht.`, 'Konstruktion');
}

// --- Winkelhalbierende -----------------------------------------------------------------------------

function haelfte(rng) {
  const h = rnd(15, 60, rng);
  return num({
    value: h, prompt: `Der Winkel α = ${2 * h}${D} wird von einer Winkelhalbierenden geteilt. Wie groß ist jeder Teilwinkel?`,
    why: `Die Winkelhalbierende teilt in zwei gleich große Teile: ${2 * h}${D} : 2 = ${h}${D}.`,
    label: 'Rechne', extras: [2 * h, 90 - h, h + 10], unit: D
  }, rng);
}

function ganzerWinkel(rng) {
  const h = rnd(15, 60, rng);
  return num({
    value: 2 * h, prompt: `Eine Winkelhalbierende teilt einen Winkel in zwei Teile zu je ${h}${D}. Wie groß ist der ganze Winkel?`,
    why: `Zwei gleiche Teile ergeben den ganzen Winkel: 2 · ${h}${D} = ${2 * h}${D}.`,
    label: 'Rechne', extras: [h, h + 90, 3 * h], unit: D
  }, rng);
}

// --- Dreiecke konstruieren ---------------------------------------------------------------------------

function dreieckSeiten(rng) {
  let a, b, c;
  let tries = 0;
  do {
    if (++tries > MAX_TRIES) throw new RangeError(`Keine Seitenlängen für ein Dreieck nach ${MAX_TRIES} Versuchen`);
    a = rnd(3, 9, rng); b = rnd(3, 9, rng); c = rnd(3, 9, rng);
  } while (a + b <= c || a + c <= b || b + c <= a);
  return words(`Gegeben sind die Seiten a = ${a} cm, b = ${b} cm und c = ${c} cm. Wie viele verschiedene Dreiecke passen dazu?`, 'genau eines',
    ['keines', 'unendlich viele', 'genau zwei'],
    `Bei drei Seiten (SSS) gibt es höchstens ein Dreieck, gespiegelte und gedrehte Lagen zählen nicht als neues Dreieck. Weil jede Seite kürzer ist als die beiden anderen zusammen, gibt es auch eines.`, 'Eindeutigkeit');
}

function dreieckUngleichung(rng) {
  // Mal geht es, mal nicht. Wäre die Antwort immer Nein, müsste niemand rechnen. c ist stets die längste Seite.
  const a = rnd(2, 6, rng), b = rnd(2, 6, rng), c = a + b + pick([-1, 0, 1, 3], rng);
  const yes = 'Ja, die zwei kürzeren Seiten sind zusammen länger als die längste.';
  const no = 'Nein, die zwei kürzeren Seiten sind zusammen nicht länger als die längste.';
  const possible = c < a + b;
  const why = possible
    ? `${a} cm + ${b} cm = ${a + b} cm, das ist mehr als c = ${c} cm. Die Kreisbögen schneiden sich, das Dreieck lässt sich zeichnen.`
    : c === a + b
      ? `${a} cm + ${b} cm ergeben genau c = ${c} cm. Die Bögen berühren sich nur auf der Strecke, es entsteht kein Dreieck. Zwei Seiten müssen zusammen immer länger sein als die dritte.`
      : `Die Seiten ${a} cm und ${b} cm sind zusammen nur ${a + b} cm lang und reichen nicht bis zur Seite c = ${c} cm. Die Kreisbögen schneiden sich nicht. Zwei Seiten müssen zusammen immer länger sein als die dritte.`;
  return words(`Kann man ein Dreieck mit a = ${a} cm, b = ${b} cm und c = ${c} cm zeichnen?`, possible ? yes : no,
    [possible ? no : yes, 'Ja, drei Seiten ergeben immer ein Dreieck.', 'Nein, alle drei Seiten müssen gleich lang sein.'], why, 'Dreiecksungleichung');
}

function kongruenzsatz(rng, { theorems }) {
  const [given, name] = pick(theorems, rng);
  return words(`Gegeben sind ${given}. Welcher Kongruenzsatz passt?`, name, ['SSS', 'SWS', 'WSW', 'SsW'].filter((n) => n !== name),
    `${name} steht für „${given}“. Mit dieser Angabe ist das Dreieck bis auf Spiegelung und Drehung eindeutig festgelegt.`, 'Kongruenzsatz');
}

function eindeutig(rng, { eindeutige }) {
  const [given, ans, why] = pick(eindeutige, rng);
  const all = ['genau ein Dreieck', 'zwei verschiedene Dreiecke', 'unendlich viele Dreiecke', 'kein Dreieck'];
  return words(`Wie viele Dreiecke passen zu den Angaben? ${given}`, ans, all.filter((o) => o !== ans), why, 'Eindeutigkeit');
}

// --- Winkel und Beweise ----------------------------------------------------------------------------------

const ANGLE_KINDS = [
  ['Scheitelwinkel', (a) => a, 'Scheitelwinkel liegen sich gegenüber und sind gleich groß.'],
  ['Nebenwinkel', (a) => 180 - a, 'Nebenwinkel ergeben zusammen 180°.'],
  ['Stufenwinkel', (a) => a, 'An parallelen Geraden sind Stufenwinkel gleich groß.'],
  ['Wechselwinkel', (a) => a, 'An parallelen Geraden sind Wechselwinkel gleich groß.']
];

function winkelPaar(rng) {
  const [kind, fn, why] = pick(ANGLE_KINDS, rng);
  // Bei 90° sind alle vier Winkel gleich, da gibt es nichts zu unterscheiden.
  let a = 90;
  while (a === 90) a = rnd(2, 17, rng) * 10;
  const v = fn(a);
  const needsParallel = kind === 'Stufenwinkel' || kind === 'Wechselwinkel';
  return num({
    value: v, prompt: `${needsParallel ? 'Zwei parallele Geraden werden von einer dritten geschnitten.' : 'Zwei Geraden schneiden sich.'} Ein Winkel misst ${a}${D}. Wie groß ist sein ${kind}?`,
    why: `${why} Also ${fmt(v)}${D}.`, label: 'Winkel', extras: [180 - a, a, 360 - a, a + 10], unit: D
  }, rng);
}

function winkelsumme(rng) {
  const a = rnd(30, 80, rng), b = rnd(30, 80, rng), c = 180 - a - b;
  return num({
    value: c, prompt: `Ein Dreieck hat die Winkel α = ${a}${D} und β = ${b}${D}. Wie groß ist γ?`,
    why: `Die Winkelsumme im Dreieck ist 180°. γ = 180${D} ${MINUS} ${a}${D} ${MINUS} ${b}${D} = ${c}${D}.`,
    label: 'Winkelsumme', extras: [a + b, 360 - a - b, c + 10], unit: D
  }, rng);
}

function gleichschenklig(rng) {
  const base = rnd(25, 75, rng), top = 180 - 2 * base;
  return num({
    value: base, prompt: `Ein gleichschenkliges Dreieck hat an der Spitze den Winkel ${top}${D}. Wie groß ist jeder Basiswinkel?`,
    why: `Die zwei Basiswinkel sind gleich groß. (180${D} ${MINUS} ${top}${D}) : 2 = ${base}${D}.`,
    label: 'Gleichschenklig', extras: [top, 180 - top, base + 10], unit: D
  }, rng);
}

// --- Thales -----------------------------------------------------------------------------------------------------

function thalesGamma(rng) {
  return num({
    value: 90, prompt: 'Der Punkt C liegt auf dem Halbkreis über der Strecke AB (Thaleskreis). Wie groß ist der Winkel bei C?',
    why: 'Satz des Thales: Der Winkel im Halbkreis ist immer ein rechter Winkel, also 90°.', label: 'Thales', extras: [60, 180, 45], unit: D
  }, rng);
}

function thalesBeta(rng) {
  const a = rnd(20, 70, rng);
  return num({
    value: 90 - a, prompt: `Das Dreieck ABC hat bei C einen rechten Winkel (C liegt auf dem Thaleskreis über AB). Es ist α = ${a}${D}. Wie groß ist β?`,
    why: `Bei C sind es 90°. Die Winkelsumme ist 180°, also β = 180${D} ${MINUS} 90${D} ${MINUS} ${a}${D} = ${90 - a}${D}.`,
    label: 'Thales', extras: [a, 180 - a, 90 + a], unit: D
  }, rng);
}

function thalesRadius(rng) {
  const r = rnd(2, 9, rng);
  return num({
    value: r, prompt: `Die Hypotenuse eines rechtwinkligen Dreiecks ist ${2 * r} cm lang. Wie groß ist der Radius des Umkreises?`,
    why: `Die Hypotenuse ist der Durchmesser des Thaleskreises. Radius = ${2 * r} cm : 2 = ${r} cm.`,
    label: 'Thales', extras: [2 * r, r + 1, 2 * r + 2], unit: ' cm'
  }, rng);
}

// --- Umkreis und Inkreis --------------------------------------------------------------------------------------

function umkreisLage(rng) {
  const kind = pick(['spitzwinkliges', 'rechtwinkliges', 'stumpfwinkliges'], rng);
  const ans = { spitzwinkliges: 'innerhalb des Dreiecks', rechtwinkliges: 'auf einer Seite des Dreiecks', stumpfwinkliges: 'außerhalb des Dreiecks' }[kind];
  const all = ['innerhalb des Dreiecks', 'auf einer Seite des Dreiecks', 'außerhalb des Dreiecks', 'in einer Ecke des Dreiecks'];
  return words(`Ein ${kind} Dreieck: Wo liegt der Mittelpunkt des Umkreises?`, ans, all.filter((o) => o !== ans),
    { spitzwinkliges: 'Bei drei spitzen Winkeln treffen sich die Mittelsenkrechten im Inneren.', rechtwinkliges: 'Beim rechten Winkel ist die Hypotenuse Durchmesser des Thaleskreises, der Mittelpunkt liegt in ihrer Mitte.', stumpfwinkliges: 'Beim stumpfen Winkel wandert der Mittelpunkt aus dem Dreieck hinaus.' }[kind], 'Lage');
}

// --- Größen durch Konstruieren bestimmen (Maßstab) ------------------------------------------------------

const SCALES = [50, 100, 200, 500];
const meters = (cm, scale) => (cm * scale) / 100;

function wirklichkeit(rng) {
  const n = pick(SCALES, rng), d = rnd(2, 9, rng), m = meters(d, n);
  return num({
    value: m, prompt: `Eine Zeichnung hat den Maßstab 1 : ${n}. Eine Strecke ist darin ${d} cm lang. Wie viele Meter sind das in Wirklichkeit?`,
    why: `Maßstab 1 : ${n} heißt: 1 cm in der Zeichnung sind ${n} cm in Wirklichkeit. ${d} · ${n} cm = ${d * n} cm = ${fmt(m)} m.`,
    label: 'Maßstab', extras: [d * n, m * 10, m / 10, d + n / 100], unit: ' m'
  }, rng);
}

function zeichnung(rng) {
  // Gegenstand und Maßstab passen zusammen. Bei 1 : 50 käme sonst ein Haus von 1,5 m heraus.
  const [n, thing, min] = pick([[50, 'Ein Zimmer', 6], [100, 'Ein Boot', 3], [200, 'Ein Haus', 4]], rng);
  const d = rnd(min, 12, rng), real = meters(d, n);
  return num({
    value: d, prompt: `${thing} ist ${fmt(real)} m lang. Du zeichnest es im Maßstab 1 : ${n}. Wie viele Zentimeter lang wird es in der Zeichnung?`,
    why: `${fmt(real)} m = ${real * 100} cm. Im Maßstab 1 : ${n} teilst du durch ${n}: ${real * 100} cm : ${n} = ${d} cm.`,
    label: 'Maßstab', extras: [real * 100, d * 10, real * n, d + 2], unit: ' cm'
  }, rng);
}

function massstabFinden(rng) {
  const n = pick(SCALES, rng), d = rnd(2, 8, rng), real = meters(d, n);
  const fmtScale = (v) => `1 : ${v}`;
  return words(`Eine Strecke ist in Wirklichkeit ${fmt(real)} m lang und in der Zeichnung ${d} cm. Welchen Maßstab hat die Zeichnung?`, fmtScale(n),
    [fmtScale(n * 10), fmtScale(n / 2), fmtScale(n * 2)].filter((o) => o !== fmtScale(n)),
    `${fmt(real)} m = ${real * 100} cm. ${real * 100} cm : ${d} cm = ${n}. Also steht 1 cm in der Zeichnung für ${n} cm in Wirklichkeit: Maßstab 1 : ${n}.`, 'Maßstab');
}

function hoeheBaum(rng) {
  const e = rnd(6, 30, rng);
  return num({
    value: e, prompt: `Du stehst ${e} m vom Fuß eines Baumes entfernt und peilst die Spitze unter einem Winkel von 45° an. Die Augenhöhe lässt du weg. Wie hoch ist der Baum?`,
    why: `Das Dreieck hat einen rechten Winkel am Boden und einen Winkel von 45°. Der dritte Winkel ist auch 45°, das Dreieck ist gleichschenklig. Also ist die Höhe so groß wie der Abstand: ${e} m.`,
    label: 'Konstruieren', extras: [2 * e, e / 2, e + 45], unit: ' m'
  }, rng);
}

// --- Geometrische Probleme lösen ---------------------------------------------------------------------------------

function thalesMitte(rng) {
  const a = rnd(20, 70, rng);
  return num({
    value: 180 - 2 * a, prompt: `C liegt auf dem Halbkreis über AB, M ist der Mittelpunkt von AB. Der Winkel MAC misst ${a}${D}. Wie groß ist der Winkel AMC?`,
    why: `MA und MC sind Radien, das Dreieck AMC ist gleichschenklig. Die Basiswinkel bei A und C sind beide ${a}${D}. Winkel AMC = 180${D} ${MINUS} 2 · ${a}${D} = ${180 - 2 * a}${D}.`,
    label: 'Problem lösen', extras: [a, 180 - a, 2 * a, 90 - a], unit: D
  }, rng);
}

function thalesGleichschenklig(rng) {
  return num({
    value: 45, prompt: 'Das Dreieck ABC hat bei C einen rechten Winkel und ist gleichschenklig (CA = CB). Wie groß ist der Winkel bei A?',
    why: 'Die Winkelsumme ist 180°. Bei C sind es 90°, bleiben 90° für zwei gleiche Winkel: 90° : 2 = 45°.', label: 'Problem lösen', extras: [90, 30, 60], unit: D
  }, rng);
}

function aussenwinkel(rng) {
  const a = rnd(30, 80, rng), b = rnd(30, 80, rng), c = 180 - a - b;
  return num({
    value: a + b, prompt: `Im Dreieck ABC ist α = ${a}${D} und β = ${b}${D}. Die Seite BC wird über C hinaus verlängert. Der Nebenwinkel zu γ heißt Außenwinkel. Wie groß ist er?`,
    why: `Erst γ: 180${D} ${MINUS} ${a}${D} ${MINUS} ${b}${D} = ${c}${D}. Der Außenwinkel ist Nebenwinkel zu γ: 180${D} ${MINUS} ${c}${D} = ${a + b}${D}. Er ist so groß wie α + β.`,
    label: 'Problem lösen', extras: [c, 180 - a, 180 - b, a + b + c], unit: D
  }, rng);
}

function winkelKette(rng) {
  const a = rnd(20, 50, rng), t = 180 - 2 * a;
  return num({
    value: t, prompt: `Ein gleichschenkliges Dreieck hat Basiswinkel von ${a}${D}. Wie groß ist der Winkel an der Spitze?`,
    why: `Die Winkelsumme ist 180${D}. Zwei Basiswinkel ergeben ${2 * a}${D}, bleiben ${t}${D} für die Spitze.`,
    label: 'Problem lösen', extras: [a, 180 - a, 90 - a], unit: D
  }, rng);
}

// Listen aus dem Inhalt kommen beim Ziehen aus dem Kontext (createBuilders).
const fixed = (liste) => (rng, kontext) => pick(kontext[liste], rng);
export const POOLS = {
  mittelsenkrechte: [gleichWeit, mitteStrecke, zirkelRadius, fixed('ms'), fixed('ms')],
  winkelhalbierende: [haelfte, ganzerWinkel, fixed('wh'), haelfte],
  dreiecke: [dreieckSeiten, dreieckUngleichung, kongruenzsatz, eindeutig, eindeutig, fixed('dr')],
  winkel: [winkelPaar, winkelPaar, winkelsumme, gleichschenklig],
  thales: [thalesGamma, thalesBeta, thalesBeta, thalesRadius, fixed('th')],
  kreise: [fixed('kr'), fixed('kr'), umkreisLage, thalesRadius],
  groessen: [wirklichkeit, zeichnung, massstabFinden, hoeheBaum, fixed('gr')],
  probleme: [thalesMitte, thalesGleichschenklig, aussenwinkel, winkelKette, fixed('pr')]
};

/** Eine Aufgabe der Seite mit drei verschiedenen falschen Antworten. Nach MAX_TRIES Versuchen gibt es einen Fehler. */
export function make(unitId, rng, kontext) {
  for (let tries = 1; tries <= MAX_TRIES; tries++) {
    const generate = pick(POOLS[unitId], rng);
    const item = { ...generate(rng, kontext) };
    item.wrong = [...new Set(item.wrong)].filter((w) => w !== item.answer);
    if (item.wrong.length >= 3) return item;
  }
  throw new RangeError(`Keine Aufgabe für ${unitId} mit drei falschen Antworten nach ${MAX_TRIES} Versuchen`);
}

// Zahlen stehen als Text in den Optionen. Die Anzeige ist Text, kein Markup, weil nur <b> und <p> erlaubt sind (SEC-003).
export function choice(item, rng) {
  return choiceQuestion({
    label: item.label || 'Wähle die richtige Antwort', prompt: esc(item.prompt), promptStyle: 'sentence',
    answer: item.answer, choices: [item.answer, ...shuffle(item.wrong, rng).slice(0, 3)], why: item.why, rng
  });
}

export function typed(item) {
  return typedQuestion({
    label: 'Gib das Ergebnis ein', prompt: esc(item.prompt), promptStyle: 'sentence', answer: item.answer,
    check: numCheck(item.value, { unit: item.unit }), placeholder: item.unit ? `Zahl eintippen (${item.unit.trim()})` : 'Zahl eintippen', why: item.why
  });
}

const canType = (item) => item.numeric && !item.choiceOnly;

/** Erzeuger für ein Inhaltspaket. Der Stand liegt hier, nicht im Modul. */
export function createBuilders({ data, manifest }) {
  const units = manifest.units;
  const kontext = {
    ms: asWords(data.msFacts), wh: asWords(data.whFacts), dr: asWords(data.drFacts), th: asWords(data.thFacts),
    kr: asWords(data.krFacts), gr: asWords(data.grFacts), pr: asWords(data.prFacts),
    theorems: data.theorems, eindeutige: data.eindeutig
  };
  const makeIn = (unitId, rng) => make(unitId, rng, kontext);

  /** 8 Fragen, jede dritte zum Eintippen. */
  function lessonRound(unit, rng) {
    // Jeder Platz wird neu gewürfelt, solange er eine schon gezeigte Aufgabe liefert (runde/src/vielfalt.js).
    return distinctSlots(8, rng, (i, r) => {
      const item = makeIn(unit.id, r);
      return i % 3 === 2 && canType(item) ? typed(item) : choice(item, r);
    });
  }

  const anyItem = (rng) => makeIn(pick(units, rng).id, rng);
  const quickRound = (rng) => distinctSlots(5, rng, (_, r) => choice(anyItem(r), r));
  const blitzQuestion = (rng) => choice(anyItem(rng), rng);
  const bossRound = (rng) => distinctSlots(12, rng, (i, r) => {
    const item = makeIn(units[i % units.length].id, r);
    return i % 4 === 3 && canType(item) ? typed(item) : choice(item, r);
  });

  return { make: makeIn, lessonRound, quickRound, bossRound, blitzQuestion };
}
