// Erzeugt Geometrie-Fragen. Rechenaufgaben mit Zufallswerten, dazu Begriffs- und Konstruktionsfragen als feste Auswahl.
import { choiceQuestion, typedQuestion } from '../../core/js/questions.js';
import { esc, pick, shuffle } from '../../core/js/ui.js';
import { rnd, fmt, nearby, numCheck } from '../../core/js/mathkit.js';
import { UNITS } from './data.js';

const D = '°';
const num = (value, prompt, why, label, extras = [], unit = '') => ({
  prompt, answer: fmt(value) + unit, value, numeric: true, why, label,
  wrong: nearby(value, extras).map((v) => fmt(v) + unit), unit
});
const words = (prompt, answer, wrong, why, label) => ({ prompt, answer, wrong, why, label, choiceOnly: true });

// --- Mittelsenkrechte ---------------------------------------------------------------------------

function gleichWeit() {
  const x = rnd(3, 12);
  return num(x, `Der Punkt P liegt auf der Mittelsenkrechten der Strecke AB. Es ist PA = ${x} cm. Wie lang ist PB?`,
    `Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt. Also ist PB = PA = ${x} cm.`, 'Rechne', [x * 2, x / 2, x + 1], ' cm');
}

function mitteStrecke() {
  const h = rnd(2, 9);
  return num(h, `Die Strecke AB ist ${2 * h} cm lang. Die Mittelsenkrechte schneidet AB im Punkt M. Wie lang ist AM?`,
    `M ist der Mittelpunkt der Strecke. AM = ${2 * h} cm : 2 = ${h} cm.`, 'Rechne', [2 * h, h + 2, h * 2 + 1], ' cm');
}

function zirkelRadius() {
  const ab = pick([4, 6, 8, 10]), h = ab / 2;
  return words(`Du konstruierst die Mittelsenkrechte der Strecke AB mit AB = ${ab} cm. Welchen Zirkelradius darfst du einstellen?`,
    `mehr als ${h} cm`, [`genau ${h} cm`, `weniger als ${h} cm`, `genau ${ab * 2} cm, sonst nichts`],
    `Die Kreisbögen um A und B müssen sich in zwei Punkten schneiden. Das klappt nur, wenn der Radius größer ist als die Hälfte der Strecke (${h} cm). Bei genau ${h} cm berühren sich die Bögen nur in M, bei weniger treffen sie sich gar nicht.`, 'Konstruktion');
}

const MS_FACTS = [
  words('Was gilt für jeden Punkt der Mittelsenkrechten von AB?', 'Er ist von A und B gleich weit entfernt.',
    ['Er liegt auf der Strecke AB.', 'Er ist doppelt so weit von A wie von B entfernt.', 'Er liegt immer genau 90° von A entfernt.'],
    'Das ist die wichtigste Eigenschaft der Mittelsenkrechten. Darum benutzt man sie, um einen Punkt zu finden, der von zwei Orten gleich weit weg ist.', 'Eigenschaft'),
  words('Wie misst du den Abstand eines Punktes P von einer Geraden g?', 'Länge der senkrechten Strecke von P zu g',
    ['Länge irgendeiner Strecke von P zu g', 'Länge der längsten Strecke von P zu g', 'Abstand von P zum Anfang der Geraden'],
    'Der kürzeste Weg von einem Punkt zu einer Geraden führt senkrecht auf sie zu. Diese Länge heißt Abstand.', 'Abstand'),
  words('Womit beginnst du die Konstruktion der Mittelsenkrechten von AB?', 'Mit einem Kreisbogen um A, der AB halb überschreitet',
    ['Mit dem Lineal durch die Mitte von AB', 'Mit dem Geodreieck an einer beliebigen Stelle', 'Mit einem Kreis um M'],
    'Erst zwei gleich große Kreisbögen um A und um B, danach die Gerade durch die beiden Schnittpunkte. Die Mitte M kennst du am Anfang noch nicht.', 'Konstruktion')
];

// --- Winkelhalbierende -----------------------------------------------------------------------------

function haelfte() {
  const h = rnd(15, 60);
  return num(h, `Der Winkel α = ${2 * h}${D} wird von einer Winkelhalbierenden geteilt. Wie groß ist jeder Teilwinkel?`,
    `Die Winkelhalbierende teilt in zwei gleich große Teile: ${2 * h}${D} : 2 = ${h}${D}.`, 'Rechne', [2 * h, 90 - h, h + 10], D);
}

function ganzerWinkel() {
  const h = rnd(15, 60);
  return num(2 * h, `Eine Winkelhalbierende teilt einen Winkel in zwei Teile zu je ${h}${D}. Wie groß ist der ganze Winkel?`,
    `Zwei gleiche Teile ergeben den ganzen Winkel: 2 · ${h}${D} = ${2 * h}${D}.`, 'Rechne', [h, h + 90, 3 * h], D);
}

const WH_FACTS = [
  words('Was gilt für jeden Punkt auf der Winkelhalbierenden?', 'Er hat zu beiden Schenkeln denselben Abstand.',
    ['Er hat vom Scheitel den Abstand 0.', 'Er liegt auf einem der beiden Schenkel.', 'Er ist von beiden Schenkeln 90° entfernt.'],
    'Genau deshalb ist die Winkelhalbierende nützlich: Sie findet alle Punkte, die zu zwei Geraden gleichen Abstand haben.', 'Eigenschaft'),
  words('Wie konstruierst du eine Winkelhalbierende?', 'Bogen um den Scheitel, dann zwei gleich große Bögen um die Schnittpunkte mit den Schenkeln',
    ['Zwei Bögen um die Endpunkte der Schenkel', 'Mit dem Lineal in die Mitte zwischen die Schenkel zeichnen', 'Den Winkel messen und mit dem Geodreieck halbieren'],
    'So geht es nur mit Zirkel und Lineal: Der Bogen um den Scheitel S liefert zwei Punkte U und V. Von U und V aus zeichnest du zwei gleich große Bögen. Ihr Schnittpunkt W liegt auf der Winkelhalbierenden.', 'Konstruktion')
];

// --- Dreiecke konstruieren ---------------------------------------------------------------------------

function dreieckSeiten() {
  let a, b, c;
  do { a = rnd(3, 9); b = rnd(3, 9); c = rnd(3, 9); } while (a + b <= c || a + c <= b || b + c <= a);
  return words(`Ein Dreieck hat die Seiten a = ${a} cm, b = ${b} cm und c = ${c} cm. Wie viele Dreiecke gibt es dazu?`, 'genau eines (bis auf Spiegelung und Drehung)',
    ['kein einziges', 'unendlich viele', 'genau zwei verschiedene'],
    `Bei drei Seiten (SSS) gibt es höchstens ein Dreieck, und weil jede Seite kürzer ist als die beiden anderen zusammen, gibt es auch eines.`, 'Eindeutigkeit');
}

function dreieckUngleichung() {
  const a = rnd(2, 6), b = rnd(2, 6), c = a + b + rnd(1, 4);
  return words(`Kann man ein Dreieck mit a = ${a} cm, b = ${b} cm und c = ${c} cm zeichnen?`, 'Nein, a + b ist nicht größer als c',
    ['Ja, mit SSS geht es immer', 'Ja, aber nur mit einem Winkelmesser', 'Ja, wenn man c etwas kürzer zeichnet'],
    `Die beiden kurzen Seiten ${a} cm und ${b} cm sind zusammen nur ${a + b} cm lang und reichen nicht bis zur Seite c = ${c} cm. Die Kreisbögen schneiden sich nicht. Zwei Seiten müssen zusammen immer länger sein als die dritte.`, 'Dreiecksungleichung');
}

const THEOREMS = [
  ['drei Seiten', 'SSS'],
  ['zwei Seiten und der eingeschlossene Winkel', 'SWS'],
  ['eine Seite und die beiden anliegenden Winkel', 'WSW'],
  ['zwei Seiten und der Winkel, der der längeren Seite gegenüberliegt', 'SsW']
];

function kongruenzsatz() {
  const [given, name] = pick(THEOREMS);
  return words(`Gegeben sind ${given}. Welcher Kongruenzsatz passt?`, name, ['SSS', 'SWS', 'WSW', 'SsW'].filter((n) => n !== name),
    `${name} steht für „${given}“. Mit dieser Angabe ist das Dreieck bis auf Spiegelung und Drehung eindeutig festgelegt.`, 'Kongruenzsatz');
}

const EINDEUTIG = [
  ['a = 5 cm, b = 7 cm, α = 40°. Der Winkel α liegt der kürzeren Seite a gegenüber.', 'höchstens zwei Dreiecke möglich', 'Liegt der Winkel der kürzeren Seite gegenüber, kann der Kreisbogen die Seite zweimal treffen. Das ist kein Kongruenzsatz.'],
  ['a = 7 cm, b = 5 cm, α = 40°. Der Winkel α liegt der längeren Seite a gegenüber.', 'genau ein Dreieck', 'Der Winkel liegt der längeren Seite gegenüber. Das ist der Kongruenzsatz SsW, das Dreieck ist eindeutig.'],
  ['α = 40°, β = 60°, γ = 80°', 'unendlich viele Dreiecke (verschieden groß)', 'Drei Winkel legen nur die Form fest, nicht die Größe. Man kann das Dreieck beliebig vergrößern. Für Eindeutigkeit braucht man mindestens eine Seite.'],
  ['b = 5 cm, c = 7 cm, α = 50° (α liegt zwischen b und c)', 'genau ein Dreieck', 'Zwei Seiten und der eingeschlossene Winkel: Kongruenzsatz SWS.'],
  ['c = 6 cm, α = 50°, β = 60°', 'genau ein Dreieck', 'Eine Seite und die beiden anliegenden Winkel: Kongruenzsatz WSW.'],
  ['α = 100°, β = 90°, c = 5 cm', 'kein Dreieck', 'Die Winkelsumme im Dreieck ist 180°. Schon 100° + 90° ist 190°, das passt nicht.']
];

function eindeutig() {
  const [given, ans, why] = pick(EINDEUTIG);
  const all = ['genau ein Dreieck', 'höchstens zwei Dreiecke möglich', 'unendlich viele Dreiecke (verschieden groß)', 'kein Dreieck'];
  return words(`Wie viele Dreiecke passen zu den Angaben? ${given}`, ans, all.filter((o) => o !== ans), why, 'Eindeutigkeit');
}

const DR_FACTS = [
  words('Womit beginnst du das Konstruieren eines Dreiecks aus a, b und c?', 'Mit einer Seite, zum Beispiel c',
    ['Mit dem Kreis um C', 'Mit der Höhe', 'Mit dem Umkreis'],
    'Zuerst zeichnest du eine Seite. Die Ecke C findest du danach als Schnittpunkt zweier Kreisbögen, deren Radien die Seiten b und a sind.', 'Konstruktion'),
  words('Wie finden die Kreisbögen bei SSS die Ecke C?', 'C ist der Schnittpunkt von Bogen um A (Radius b) und Bogen um B (Radius a)',
    ['C liegt auf der Mitte von AB', 'C liegt auf dem Bogen um M', 'C liegt auf einem beliebigen Punkt über AB'],
    'C hat von A den Abstand b und von B den Abstand a. Beide Bedingungen zusammen treffen nur auf den Schnittpunkt der Bögen zu.', 'Konstruktion')
];

// --- Winkel und Beweise ----------------------------------------------------------------------------------

const ANGLE_KINDS = [
  ['Scheitelwinkel', (a) => a, 'Scheitelwinkel liegen sich gegenüber und sind gleich groß.'],
  ['Nebenwinkel', (a) => 180 - a, 'Nebenwinkel ergeben zusammen 180°.'],
  ['Stufenwinkel', (a) => a, 'An parallelen Geraden sind Stufenwinkel gleich groß.'],
  ['Wechselwinkel', (a) => a, 'An parallelen Geraden sind Wechselwinkel gleich groß.']
];

function winkelPaar() {
  const [kind, fn, why] = pick(ANGLE_KINDS), a = rnd(2, 17) * 10, v = fn(a);
  const needsParallel = kind === 'Stufenwinkel' || kind === 'Wechselwinkel';
  return num(v, `${needsParallel ? 'Zwei parallele Geraden werden von einer dritten geschnitten.' : 'Zwei Geraden schneiden sich.'} Ein Winkel misst ${a}${D}. Wie groß ist der ${kind}?`,
    `${why} Also ${fmt(v)}${D}.`, 'Winkel', [180 - a, a, 90 - (a % 90)].filter((x) => x > 0), D);
}

function winkelsumme() {
  const a = rnd(30, 80), b = rnd(30, 80), c = 180 - a - b;
  return num(c, `Ein Dreieck hat die Winkel α = ${a}${D} und β = ${b}${D}. Wie groß ist γ?`,
    `Die Winkelsumme im Dreieck ist 180°. γ = 180${D} ${'−'} ${a}${D} ${'−'} ${b}${D} = ${c}${D}.`, 'Winkelsumme', [a + b, 360 - a - b, c + 10], D);
}

function gleichschenklig() {
  const base = rnd(25, 75), top = 180 - 2 * base;
  return num(base, `Ein gleichschenkliges Dreieck hat an der Spitze den Winkel ${top}${D}. Wie groß ist jeder Basiswinkel?`,
    `Die zwei Basiswinkel sind gleich groß. (180${D} ${'−'} ${top}${D}) : 2 = ${base}${D}.`, 'Gleichschenklig', [top, 180 - top, base + 10], D);
}

// --- Thales -----------------------------------------------------------------------------------------------------

function thalesGamma() {
  return num(90, 'Der Punkt C liegt auf dem Halbkreis über der Strecke AB (Thaleskreis). Wie groß ist der Winkel bei C?',
    'Satz des Thales: Der Winkel im Halbkreis ist immer ein rechter Winkel, also 90°.', 'Thales', [60, 180, 45], D);
}

function thalesBeta() {
  const a = rnd(20, 70);
  return num(90 - a, `Das Dreieck ABC hat bei C einen rechten Winkel (C liegt auf dem Thaleskreis über AB). Es ist α = ${a}${D}. Wie groß ist β?`,
    `Bei C sind es 90°. Die Winkelsumme ist 180°, also β = 180${D} ${'−'} 90${D} ${'−'} ${a}${D} = ${90 - a}${D}.`, 'Thales', [a, 180 - a, 90 + a], D);
}

function thalesRadius() {
  const r = rnd(2, 9);
  return num(r, `Die Hypotenuse eines rechtwinkligen Dreiecks ist ${2 * r} cm lang. Wie groß ist der Radius des Umkreises?`,
    `Die Hypotenuse ist der Durchmesser des Thaleskreises. Radius = ${2 * r} cm : 2 = ${r} cm.`, 'Thales', [2 * r, r + 1, 2 * r + 2], ' cm');
}

const TH_FACTS = [
  words('Wo liegt der Mittelpunkt des Umkreises eines rechtwinkligen Dreiecks?', 'in der Mitte der Hypotenuse',
    ['im Schnittpunkt der Höhen', 'in der Mitte der längeren Kathete', 'außerhalb des Dreiecks'],
    'Die Hypotenuse ist der Durchmesser des Thaleskreises. Ihre Mitte ist daher der Mittelpunkt des Umkreises.', 'Thales'),
  words('Das Dreieck ABC hat bei C einen rechten Winkel. Wo liegt C?', 'auf dem Kreis mit dem Durchmesser AB',
    ['auf der Mittelsenkrechten von AB', 'auf der Winkelhalbierenden bei A', 'auf der Strecke AB'],
    'Das ist die Umkehrung des Satzes von Thales: Ein rechter Winkel bei C bedeutet, dass C auf dem Thaleskreis über AB liegt.', 'Umkehrung')
];

// --- Umkreis und Inkreis --------------------------------------------------------------------------------------

const KR_FACTS = [
  words('Der Mittelpunkt des Umkreises ist der Schnittpunkt der …', 'Mittelsenkrechten', ['Winkelhalbierenden', 'Höhen', 'Seitenhalbierenden'],
    'Der Mittelpunkt muss von allen drei Ecken gleich weit entfernt sein. Das erfüllen genau die Punkte der Mittelsenkrechten.', 'Umkreis'),
  words('Der Mittelpunkt des Inkreises ist der Schnittpunkt der …', 'Winkelhalbierenden', ['Mittelsenkrechten', 'Höhen', 'Seitenhalbierenden'],
    'Der Mittelpunkt muss von allen drei Seiten gleich weit entfernt sein. Das erfüllen genau die Punkte der Winkelhalbierenden.', 'Inkreis'),
  words('Welcher Kreis geht durch alle drei Ecken eines Dreiecks?', 'der Umkreis', ['der Inkreis', 'der Thaleskreis in jedem Fall', 'der Kreis um den Schwerpunkt'],
    'Der Umkreis läuft durch A, B und C. Der Inkreis dagegen berührt die drei Seiten von innen.', 'Kreise'),
  words('Welcher Kreis berührt alle drei Seiten eines Dreiecks von innen?', 'der Inkreis', ['der Umkreis', 'der Kreis um die längste Seite', 'es gibt keinen solchen Kreis'],
    'Der Inkreis liegt ganz im Dreieck und berührt jede Seite in einem Punkt.', 'Kreise')
];

function umkreisLage() {
  const kind = pick(['spitzwinkliges', 'rechtwinkliges', 'stumpfwinkliges']);
  const ans = { spitzwinkliges: 'innerhalb des Dreiecks', rechtwinkliges: 'in der Mitte der Hypotenuse', stumpfwinkliges: 'außerhalb des Dreiecks' }[kind];
  const all = ['innerhalb des Dreiecks', 'in der Mitte der Hypotenuse', 'außerhalb des Dreiecks', 'immer im Schwerpunkt'];
  return words(`Ein ${kind} Dreieck: Wo liegt der Mittelpunkt des Umkreises?`, ans, all.filter((o) => o !== ans),
    { spitzwinkliges: 'Bei drei spitzen Winkeln treffen sich die Mittelsenkrechten im Inneren.', rechtwinkliges: 'Beim rechten Winkel ist die Hypotenuse Durchmesser des Thaleskreises, der Mittelpunkt liegt auf ihr.', stumpfwinkliges: 'Beim stumpfen Winkel wandert der Mittelpunkt aus dem Dreieck hinaus.' }[kind], 'Lage');
}

const fixed = (list) => () => pick(list);
export const POOLS = {
  mittelsenkrechte: [gleichWeit, mitteStrecke, zirkelRadius, fixed(MS_FACTS), fixed(MS_FACTS)],
  winkelhalbierende: [haelfte, ganzerWinkel, fixed(WH_FACTS), haelfte],
  dreiecke: [dreieckSeiten, dreieckUngleichung, kongruenzsatz, eindeutig, eindeutig, fixed(DR_FACTS)],
  winkel: [winkelPaar, winkelPaar, winkelsumme, gleichschenklig],
  thales: [thalesGamma, thalesBeta, thalesBeta, thalesRadius, fixed(TH_FACTS)],
  kreise: [fixed(KR_FACTS), fixed(KR_FACTS), umkreisLage, thalesRadius]
};

function make(unitId) {
  for (;;) {
    const item = { ...pick(POOLS[unitId])() };
    item.wrong = [...new Set(item.wrong)].filter((w) => w !== item.answer);
    if (item.wrong.length >= 3) return item;
  }
}

const mono = (v) => `<span class="mono">${esc(v)}</span>`;

function choice(item) {
  return choiceQuestion({
    label: item.label || 'Wähle die richtige Antwort', prompt: esc(item.prompt), promptStyle: 'sentence',
    answer: item.answer, choices: [item.answer, ...shuffle(item.wrong).slice(0, 3)], format: item.numeric ? mono : esc, why: item.why
  });
}

function typed(item) {
  return typedQuestion({ label: 'Gib das Ergebnis ein', prompt: esc(item.prompt), promptStyle: 'sentence', answer: item.answer,
    check: numCheck(item.value), placeholder: item.unit ? `Zahl eintippen (${item.unit.trim()})` : 'Zahl eintippen', why: item.why, format: mono });
}

const canType = (item) => item.numeric && !item.choiceOnly;

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
