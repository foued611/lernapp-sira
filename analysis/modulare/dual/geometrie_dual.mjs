// Dual-Execution Geometrie: Legacy-Erzeuger und Neubau mit gleichem Seed. Legacy liest Math.random direkt, deshalb wird
// es für jeden Legacy-Lauf durch den Seed-Generator aus helfer/random.js (createRng, mulberry32) ersetzt. Der Neubau
// bekommt denselben Generator als rng. Verglichen werden Art, Etikett, Anzeige, Optionen, Antwort, Erklärung und die
// Ergebnisse der Antwortprüfer mit festen Eingaben.
//
// Bewusst nicht verglichen: reveal (nur Auszeichnung der Antwort). Die Legacy-Auszeichnung <span class="mono"> in
// Zahlenoptionen wird vor dem Vergleich entfernt, der Neubau gibt nur den sichtbaren Text aus (Regel 4, richText).
//
// Bekannte Absicht (keine Abweichung der Aufgabe, sondern der Prüfung): Der Neubau prüft die Einheit der Eingabe.
// "5 m" ist für eine Aufgabe in cm falsch (helfer/number.js:57). Legacy entfernt die Einheit und akzeptiert es.
// Diese Eingaben stehen getrennt im Ergebnis (lockerUnterschiede) und zählen nicht als Abweichung.
//
// Aufruf aus dem Projektordner (Wurzel lernapp-sira): node analysis/modulare/dual/geometrie_dual.mjs [anzahl-seeds]
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HIER, '..', '..', '..');
const LEGACY = join(ROOT, 'legacy', 'modulare', 'apps', 'geometrie');
const NEU = join(ROOT, 'modernized', 'modulare-reimagined');
const SEEDS = Number(process.argv[2] || 200);

const { createRng } = await import(pathToFileURL(join(NEU, 'helfer', 'index.js')).href);
const neu = await import(pathToFileURL(join(NEU, 'apps', 'geometrie', 'builders.js')).href);
const legacy = await import(pathToFileURL(join(LEGACY, 'builders.js')).href);

const lese = (datei) => JSON.parse(readFileSync(join(ROOT, 'content', 'geometrie', datei), 'utf8'));
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

// Sichtbarer Text einer Option oder Frage: alle Auszeichnungen weg. Legacy setzt Zahlen in span.mono, der Neubau nicht.
const sichtbar = (html) => String(html ?? '').replace(/<[^>]+>/g, '');

// Kanonische Form einer Frage: nur die Felder, die Anzeige und Prüfung bestimmen. Prüfer werden mit festen Eingaben befragt.
const kanonisch = (q) => ({
  kind: q.kind,
  label: q.label,
  chip: q.chip ? String(q.chip.label ?? q.chip) : null,
  prompt: q.prompt,
  promptStyle: q.promptStyle,
  sub: q.sub ?? null,
  answer: q.answer,
  options: q.options ? q.options.map((o) => ({ id: o.id, text: sichtbar(o.html), fill: o.fill ?? null })) : null,
  placeholder: q.placeholder ?? null,
  why: q.why,
  checks: q.check ? ['', 'x', q.answer, q.answer.toUpperCase()].map((eingabe) => q.check(eingabe)) : null
});

// Eingaben mit der jeweils anderen Einheit. Die Zahl steht vorn, die Einheit der Aufgabe wird durch eine andere ersetzt.
// Nur zur Information: Der Neubau sagt 'bad', Legacy 'ok'. Das ist die Einheitenprüfung, keine Rechenabweichung.
const EINHEITEN = [' cm', ' m', '°'];
const lockerEingaben = (q) => {
  if (!q.check) return [];
  const eigene = EINHEITEN.find((u) => q.answer.endsWith(u));
  const zahl = q.answer.replace(/\s*[^\d,.\-]+$/, '');
  if (!eigene || !zahl) return [];
  return EINHEITEN.filter((u) => u !== eigene).map((u) => `${zahl}${u}`);
};

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
    const altRunde = mitSeed(seed, () => legacy.lessonRound(unit));
    const neuRunde = neu.lessonRound(unit, createRng(seed));
    vergleiche1('lesson', seed, altRunde.map(kanonisch), neuRunde.map(kanonisch), { unit: unit.id }, altRunde);
    altRunde.forEach((q, i) => locker(seed, `lesson:${unit.id}`, q, neuRunde[i]));
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

// Einheitenprüfung nach Richtung: legacy ok / neu bad ist die erwartete Absicht. Alles andere fällt auf.
const lockerNachArt = {};
for (const u of lockerUnterschiede) {
  const kat = u.legacy === 'ok' && u.neu === 'bad' ? 'falsche Einheit: legacy ok, neu bad' : 'anders';
  lockerNachArt[kat] = (lockerNachArt[kat] || 0) + 1;
}

const ergebnis = {
  seeds: SEEDS,
  vergleiche,
  abweichungen: abweichungen.length,
  erklaertDurchVielfalt,
  abweichungenNachArt: arten,
  beispiele: abweichungen.slice(0, 5),
  // Je Abweichung die erste verschiedene Frage: Etikett und Anzeige. Damit ist sichtbar, wo die Abweichung liegt.
  nachFrage: abweichungen.reduce((m, a) => {
    const alt = Array.isArray(a.legacy) ? a.legacy : [a.legacy];
    const neuListe = Array.isArray(a.neu) ? a.neu : [a.neu];
    const i = alt.findIndex((q, k) => JSON.stringify(q) !== JSON.stringify(neuListe[k]));
    const frage = i >= 0 ? alt[i] : alt[0];
    const name = frage && frage.prompt ? String(frage.prompt).replace(/<[^>]*>/g, '').slice(0, 60) : String(frage && frage.label);
    m[name] = (m[name] || 0) + 1;
    return m;
  }, {}),
  lockerPruefungen,
  lockerUnterschiede: lockerUnterschiede.length,
  lockerNachArt,
  lockerBeispiele: lockerUnterschiede.slice(0, 5)
};
console.log(JSON.stringify(ergebnis, null, 2));
process.exitCode = abweichungen.length === 0 ? 0 : 1;
