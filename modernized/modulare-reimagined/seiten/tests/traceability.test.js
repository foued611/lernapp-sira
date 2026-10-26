// Rückverfolgbarkeit: jeder Testtitel beginnt mit einer Regel-Kennung oder einer SEITE-Kennung,
// und jede zugewiesene Regel hat mindestens einen Test. Die Prüfung liest die anderen Testdateien als Text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url);
const ASSIGNED = ['RULE-193', 'RULE-208', 'RULE-195', 'RULE-247', 'RULE-133', 'RULE-205', 'RULE-202', 'RULE-206', 'RULE-075', 'RULE-242', 'RULE-258', 'RULE-256', 'RULE-229', 'RULE-166'];
// RULE-259 ist nicht zugewiesen. Die Seitenzahl aus der Liste kommt hinzu und wird unter dieser Kennung geprüft.
const EXTRA = ['RULE-259'];
const PREFIXES = ['SEITE-MASKIERUNG', 'SEITE-A11Y', 'SEITE-SPEICHER-FEHLER'];

function titlesOf() {
  const titles = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.test.js') || file === 'traceability.test.js') continue;
    const text = readFileSync(new URL(file, dir), 'utf8');
    for (const [, title] of text.matchAll(/^test\('([^']+)'/gm)) titles.push(title);
  }
  return titles;
}

const idOf = (title) => {
  const match = /^(RULE-\d{3}|SEITE-[A-Z0-9-]+?)(?= )/.exec(title);
  return match ? match[1] : null;
};

test('META Jeder Testtitel in den anderen Dateien nennt eine erlaubte Kennung', () => {
  const titles = titlesOf();
  assert.ok(titles.length > 50, 'es gibt Tests');
  const allowed = new Set([...ASSIGNED, ...EXTRA, ...PREFIXES]);
  const bad = titles.filter((title) => !allowed.has(idOf(title)));
  assert.deepEqual(bad, [], 'diese Titel haben keine erlaubte Kennung am Anfang');
});

test('META Jede zugewiesene Regel und jede SEITE-Kennung hat mindestens einen Test', () => {
  const titles = titlesOf();
  const counts = Object.fromEntries([...ASSIGNED, ...EXTRA, ...PREFIXES].map((id) => [id, 0]));
  for (const title of titles) {
    const id = idOf(title);
    if (id in counts) counts[id] += 1;
  }
  const missing = [...ASSIGNED, ...PREFIXES].filter((id) => counts[id] === 0);
  assert.deepEqual(missing, [], 'ohne Test: ' + missing.join(', '));
});
