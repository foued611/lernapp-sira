// Dual-Execution Zahlenwerkstatt: Legacy-Erzeuger und Neubau mit gleichem Seed. Beide ziehen aus demselben Zufallsstrom
// (mulberry32, wie helfer/random.js createRng). Legacy liest Math.random, deshalb wird es für jeden Legacy-Lauf ersetzt.
// Verglichen werden Fragen (Art, Label, Anzeige, Optionen, Antwort, Erklärung, Zuordnung, Prüfer-Ergebnisse).
//
// Bekannte Darstellungsunterschiede (keine Änderung der Aufgabe):
//   - Legacy setzt Schreibmaschinenschrift als <span class="mono">. Der Neubau nutzt <b>, weil richText nur
//     b, strong, i, em, p, ul, ol, li, br kennt. Vor dem Vergleich wird genau dieses span in <b> übersetzt, sonst nichts.
//   - help (Spickzettel) wird nicht verglichen: der Neubau gibt ihn als Text aus, Legacy als HTML-Kasten.
//   - reveal und promptStyle werden nicht verglichen (Anzeige bzw. nur Neubau).
// Eingaben: Die Prüfung zählt nur mit den Eingaben '', 'x', die Antwort und die Antwort in Großbuchstaben. Eingaben,
// bei denen Legacy und Neubau absichtlich verschieden sind (Leerraum, führende Null, 0x), stehen separat im Ergebnis.
//
// Aufruf aus dem Projektordner: node analysis/modulare/dual/info-zahlen_dual.mjs [anzahl-seeds]
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HIER, '..', '..', '..');
const LEGACY = join(ROOT, 'legacy', 'modulare', 'apps', 'informatik');
const NEU = join(ROOT, 'modernized', 'modulare-reimagined');
const SEEDS = Number(process.argv[2] || 200);

const { createRng } = await import(pathToFileURL(join(NEU, 'helfer', 'index.js')).href);
const neu = await import(pathToFileURL(join(NEU, 'apps', 'info-zahlen', 'builders.js')).href);
const legacy = await import(pathToFileURL(join(LEGACY, 'builders.js')).href);

const lese = (datei) => JSON.parse(readFileSync(join(ROOT, 'content', 'info-zahlen', datei), 'utf8'));
const paket = () => ({ manifest: lese('manifest.json'), data: lese('data.json') });
legacy.init(paket());
neu.init(paket());
const units = paket().manifest.units;

const originalRandom = Math.random;
function mitSeed(seed, fn) {
  Math.random = createRng(seed);
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

// Nur das span der Schreibmaschinenschrift wird übersetzt. Alles andere bleibt, wie es ist.
const markup = (s) => (typeof s === 'string' ? s.replace(/<span class="mono">([\s\S]*?)<\/span>/g, '<b>$1</b>') : s);

// Kanonische Form einer Frage: nur die Felder, die Anzeige und Prüfung bestimmen.
const kanonisch = (q) => ({
  kind: q.kind,
  label: q.label,
  prompt: markup(q.prompt) ?? null,
  answer: q.answer ?? null,
  sub: q.sub ?? null,
  options: q.options ? q.options.map((o) => ({ id: o.id, html: markup(o.html), fill: o.fill ?? null })) : null,
  left: q.left ? q.left.map(markup) : null,
  leftValues: q.leftValues ?? null,
  right: q.right ? q.right.map((r) => ({ value: r.value, html: markup(r.html) })) : null,
  placeholder: q.placeholder ?? null,
  why: markup(q.why) ?? null,
  checks: q.check ? ['', 'x', q.answer, q.answer.toUpperCase()].map((eingabe) => q.check(eingabe)) : null
});

// Eingaben, bei denen die Neufassung bewusst anders urteilt. Nur zur Information, nicht als Abweichung gezählt.
const lockerEingaben = (q) => (q.check ? [q.answer.toLowerCase(), ` ${q.answer} `, `0${q.answer}`, `0x${q.answer.toLowerCase()}`, q.answer.split('').join(' ')] : []);

const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const abweichungen = [];
const lockerUnterschiede = [];
let vergleiche = 0;
let lockerPruefungen = 0;


// Vielfalt (runde/src/vielfalt.js): Legacy zieht Aufgaben ohne Rücksicht auf Dubletten. Der Neubau zieht eine Aufgabe
// neu, wenn sie in der Runde schon vorkommt. Ab der ersten Dublette laufen beide Zufallsfolgen auseinander. Eine
// Abweichung gilt deshalb nur dann als erklärt, wenn die Legacy-Runde selbst eine Dublette hat. Alles andere bleibt
// eine echte Abweichung.
const schluessel = (q) => JSON.stringify([q.kind, q.label, String(q.prompt ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), q.answer ?? null, q.leftValues ?? null]);
const hatDublette = (fragen) => new Set(fragen.map(schluessel)).size < fragen.length;
// Index der ersten Dublette. Bis dahin müssen beide Runden gleich sein, denn der Neubau zieht erst an dieser Stelle neu.
const ersteDublette = (fragen) => {
  const gesehen = new Set();
  return fragen.findIndex((q) => {
    const k = schluessel(q);
    if (gesehen.has(k)) return true;
    gesehen.add(k);
    return false;
  });
};
let erklaertDurchVielfalt = 0;

// Eine Abweichung ist erklärt, wenn die Legacy-Runde eine Dublette hat UND alle Fragen davor gleich sind.
// Nur so bleibt die Prüfung vor der Dublette scharf: Gleich ist dort Pflicht.
function vergleiche1(art, seed, a, b, extra = {}, legacyFragen = null) {
  vergleiche++;
  if (gleich(a, b)) return;
  if (legacyFragen && hatDublette(legacyFragen)) {
    const k = ersteDublette(legacyFragen);
    if (gleich(a.slice(0, k), b.slice(0, k))) {
      erklaertDurchVielfalt++;
      return;
    }
  }
  abweichungen.push({ seed, art, ...extra, legacy: a, neu: b });
}

function locker(seed, art, altFrage, neuFrage) {
  if (!altFrage.check || !neuFrage.check) return;
  for (const eingabe of lockerEingaben(altFrage)) {
    lockerPruefungen++;
    const a = altFrage.check(eingabe);
    const b = neuFrage.check(eingabe);
    if (a !== b) lockerUnterschiede.push({ seed, art, eingabe, legacy: a, neu: b, antwort: altFrage.answer });
  }
}

for (let seed = 1; seed <= SEEDS; seed++) {
  for (const unit of units) {
    const alt = mitSeed(seed, () => legacy.lessonRound(unit));
    const neue = neu.lessonRound(unit, createRng(seed));
    vergleiche1('lesson', seed, alt.map(kanonisch), neue.map(kanonisch), { unit: unit.id }, alt);
    alt.forEach((q, i) => locker(seed, `lesson:${unit.id}`, q, neue[i]));
  }
  const schnellAlt = mitSeed(seed, () => legacy.quickRound());
  const schnellNeu = neu.quickRound(createRng(seed));
  vergleiche1('quick', seed, schnellAlt.map(kanonisch), schnellNeu.map(kanonisch), {}, schnellAlt);
  schnellAlt.forEach((q, i) => locker(seed, 'quick', q, schnellNeu[i]));

  const bossAlt = mitSeed(seed, () => legacy.bossRound());
  const bossNeu = neu.bossRound(createRng(seed));
  vergleiche1('boss', seed, bossAlt.map(kanonisch), bossNeu.map(kanonisch), {}, bossAlt);
  bossAlt.forEach((q, i) => locker(seed, 'boss', q, bossNeu[i]));

  const blitzAlt = mitSeed(seed, () => legacy.blitzQuestion());
  const blitzNeu = neu.blitzQuestion(createRng(seed));
  vergleiche1('blitz', seed, kanonisch(blitzAlt), kanonisch(blitzNeu));
  locker(seed, 'blitz', blitzAlt, blitzNeu);
}

const arten = {};
for (const a of abweichungen) arten[a.art] = (arten[a.art] || 0) + 1;

// Lockere Eingaben nach Art gruppiert, damit man sieht, welche Gewohnheit wegfällt.
const kategorie = (u) => {
  if (u.eingabe.startsWith('0x')) return '0x-Präfix';
  if (u.eingabe.trim() !== u.eingabe.trim().replace(/\s+/g, '')) return 'Leerzeichen zwischen Zeichen';
  if (u.eingabe.length > 1 && u.eingabe.startsWith('0')) return 'führende Null';
  return 'andere';
};
const lockerNachArt = {};
for (const u of lockerUnterschiede) lockerNachArt[kategorie(u)] = (lockerNachArt[kategorie(u)] || 0) + 1;

const ergebnis = {
  seeds: SEEDS,
  vergleiche,
  abweichungen: abweichungen.length,
  erklaertDurchVielfalt,
  abweichungenNachArt: arten,
  beispiele: abweichungen.slice(0, 5),
  lockerPruefungen,
  lockerUnterschiede: lockerUnterschiede.length,
  lockerNachArt,
  lockerBeispiele: lockerUnterschiede.slice(0, 5)
};
console.log(JSON.stringify(ergebnis, null, 2));
process.exitCode = abweichungen.length === 0 ? 0 : 1;
