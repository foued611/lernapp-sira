// Dual-Execution Deutsch: Legacy-Erzeuger und Neubau mit gleichem Seed. Beide ziehen aus demselben Zufallsstrom
// (mulberry32, wie helfer/random.js createRng). Legacy liest Math.random, deshalb wird es für jeden Legacy-Lauf ersetzt.
// Verglichen werden Fragen (Anzeige, Optionen, Antwort, Erklärung) und das Ergebnis der Antwortprüfer.
// Aufruf aus dem Projektordner: node analysis/modulare/dual/deutsch_dual.mjs [anzahl-seeds]
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HIER, '..', '..', '..');
const LEGACY = join(ROOT, 'legacy', 'modulare', 'apps', 'deutsch');
const NEU = join(ROOT, 'modernized', 'modulare-reimagined');
const SEEDS = Number(process.argv[2] || 200);

const { createRng } = await import(pathToFileURL(join(NEU, 'helfer', 'index.js')).href);
const neu = await import(pathToFileURL(join(NEU, 'apps', 'deutsch', 'builders.js')).href);
const legacy = await import(pathToFileURL(join(LEGACY, 'builders.js')).href);

const lese = (datei) => JSON.parse(readFileSync(join(ROOT, 'content', 'deutsch', datei), 'utf8'));
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

// Kanonische Form einer Frage: nur die Felder, die Anzeige und Prüfung bestimmen. Prüfer werden mit festen Eingaben befragt.
// Bewusst nicht verglichen: reveal (Legacy setzt span.mk, Neubau <b>, beides nur Auszeichnung) und promptStyle (nur Neubau).
const kanonisch = (q) => ({
  kind: q.kind,
  label: q.label,
  // Legacy liefert ein HTML-Etikett, der Neubau ein Objekt. Verglichen wird der sichtbare Text.
  chip: q.chip ? String(q.chip.label ?? q.chip).replace(/<[^>]+>/g, '') : null,
  prompt: q.prompt,
  sub: q.sub ?? null,
  answer: q.answer,
  options: q.options ? q.options.map((o) => ({ id: o.id, html: o.html, fill: o.fill ?? null })) : null,
  placeholder: q.placeholder ?? null,
  why: q.why,
  checks: q.check ? ['', 'x', q.answer, q.answer.toUpperCase()].map((eingabe) => q.check(eingabe)) : null
});

const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const abweichungen = [];
let vergleiche = 0;

function vergleiche1(art, seed, a, b, extra = {}) {
  vergleiche++;
  if (!gleich(a, b)) abweichungen.push({ seed, art, ...extra });
}

for (let seed = 1; seed <= SEEDS; seed++) {
  for (const unit of units) {
    const a = mitSeed(seed, () => legacy.lessonRound(unit)).map(kanonisch);
    const b = neu.lessonRound(unit, createRng(seed)).map(kanonisch);
    vergleiche1('lesson', seed, a, b, { unit: unit.id });
  }
  const quick = [mitSeed(seed, () => legacy.quickRound()), neu.quickRound(createRng(seed))];
  vergleiche1('quick', seed, quick[0].map(kanonisch), quick[1].map(kanonisch));
  const boss = [mitSeed(seed, () => legacy.bossRound()), neu.bossRound(createRng(seed))];
  vergleiche1('boss', seed, boss[0].map(kanonisch), boss[1].map(kanonisch));
  vergleiche1('blitz', seed, kanonisch(mitSeed(seed, () => legacy.blitzQuestion())), kanonisch(neu.blitzQuestion(createRng(seed))));
}

const ergebnis = {
  seeds: SEEDS,
  vergleiche,
  abweichungen: abweichungen.length,
  beispiele: abweichungen.slice(0, 5)
};
console.log(JSON.stringify(ergebnis, null, 2));
process.exitCode = abweichungen.length === 0 ? 0 : 1;
