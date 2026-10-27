// Dual-Execution Mathe: Legacy-Erzeuger und Neubau mit gleichem Seed. Legacy liest Math.random direkt, deshalb wird
// es für jeden Legacy-Lauf durch den Seed-Generator aus helfer/random.js (createRng, mulberry32) ersetzt. Der Neubau
// bekommt denselben Generator als rng. Verglichen werden Art, Etikett, Anzeige, Optionen, Antwort, Erklärung und die
// Ergebnisse der Antwortprüfer mit festen Eingaben.
// Bewusst nicht verglichen: reveal (nur Auszeichnung) und Legacy-Auszeichnung <span class="mono"> in Optionen:
// der Neubau gibt nur Text aus (richText erlaubt kein span, Regel 4), verglichen wird deshalb der sichtbare Text.
// Aufruf aus dem Projektordner (Wurzel lernapp-sira): node analysis/modulare/dual/mathe_dual.mjs [anzahl-seeds]
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HIER, '..', '..', '..');
const LEGACY = join(ROOT, 'legacy', 'modulare', 'apps', 'mathe');
const NEU = join(ROOT, 'modernized', 'modulare-reimagined');
const SEEDS = Number(process.argv[2] || 200);

const { createRng } = await import(pathToFileURL(join(NEU, 'helfer', 'index.js')).href);
const neu = await import(pathToFileURL(join(NEU, 'apps', 'mathe', 'builders.js')).href);
const legacy = await import(pathToFileURL(join(LEGACY, 'builders.js')).href);

const lese = (datei) => JSON.parse(readFileSync(join(ROOT, 'content', 'mathe', datei), 'utf8'));
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

const sichtbar = (html) => String(html).replace(/<[^>]+>/g, '');

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

const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const abweichungen = [];
let vergleiche = 0;


// Vielfalt (runde/src/vielfalt.js): Legacy zieht Aufgaben ohne Rücksicht auf Dubletten. Der Neubau zieht eine Aufgabe
// neu, wenn sie in der Runde schon vorkommt. Ab der ersten Dublette laufen beide Zufallsfolgen auseinander. Eine
// Abweichung gilt deshalb nur dann als erklärt, wenn die Legacy-Runde selbst eine Dublette hat. Alles andere bleibt
// eine echte Abweichung.
const schluessel = (q) => JSON.stringify([q.kind, q.label, String(q.prompt ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), q.answer ?? null, q.leftValues ?? null]);
const hatDublette = (fragen) => new Set(fragen.map(schluessel)).size < fragen.length;
let erklaertDurchVielfalt = 0;

function vergleiche1(art, seed, a, b, extra = {}, legacyFragen = null) {
  vergleiche++;
  if (gleich(a, b)) return;
  if (legacyFragen && hatDublette(legacyFragen)) erklaertDurchVielfalt++;
  else abweichungen.push({ seed, art, ...extra, legacy: a, neu: b });
}

for (let seed = 1; seed <= SEEDS; seed++) {
  for (const unit of units) {
    const altRunde = mitSeed(seed, () => legacy.lessonRound(unit));
    const a = altRunde.map(kanonisch);
    const b = neu.lessonRound(unit, createRng(seed)).map(kanonisch);
    vergleiche1('lesson', seed, a, b, { unit: unit.id }, altRunde);
  }
  const quick = [mitSeed(seed, () => legacy.quickRound()), neu.quickRound(createRng(seed))];
  vergleiche1('quick', seed, quick[0].map(kanonisch), quick[1].map(kanonisch), {}, quick[0]);
  const boss = [mitSeed(seed, () => legacy.bossRound()), neu.bossRound(createRng(seed))];
  vergleiche1('boss', seed, boss[0].map(kanonisch), boss[1].map(kanonisch), {}, boss[0]);
  vergleiche1('blitz', seed, kanonisch(mitSeed(seed, () => legacy.blitzQuestion())), kanonisch(neu.blitzQuestion(createRng(seed))));
}

const ergebnis = {
  seeds: SEEDS,
  vergleiche,
  abweichungen: abweichungen.length,
  erklaertDurchVielfalt,
  abweichungenNachArt: abweichungen.reduce((m, a) => ((m[a.unit ?? a.art] = (m[a.unit ?? a.art] || 0) + 1), m), {}),
  // Je Abweichung die erste verschiedene Frage: Etikett und Anzeige. Damit ist sichtbar, ob es die Regel RULE-056 ist.
  nachFrage: abweichungen.reduce((m, a) => {
    const alt = Array.isArray(a.legacy) ? a.legacy : [a.legacy];
    const neu = Array.isArray(a.neu) ? a.neu : [a.neu];
    const i = alt.findIndex((q, k) => JSON.stringify(q) !== JSON.stringify(neu[k]));
    const frage = i >= 0 ? alt[i] : alt[0];
    const schluessel = frage && frage.prompt ? String(frage.prompt).replace(/<[^>]*>/g, '').slice(0, 60) : String(frage && frage.label);
    m[schluessel] = (m[schluessel] || 0) + 1;
    return m;
  }, {}),
  beispiele: abweichungen.slice(0, 2).map(({ legacy, neu, ...rest }) => rest)
};
console.log(JSON.stringify(ergebnis, null, 2));
process.exitCode = abweichungen.length === 0 ? 0 : 1;
