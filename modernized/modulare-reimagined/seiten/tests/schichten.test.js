// Schichten des Neubaus: wer darf wen importieren (CLAUDE.md). Der Test liest alle Quelldateien als Text und baut
// daraus den Import-Graphen. So fällt eine neue Datei automatisch unter die Regeln, ohne Eintrag in einer Liste.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

// Erlaubte Ziele je Schicht. Alles, was hier nicht steht, ist verboten.
const ERLAUBT = Object.freeze({
  helfer: [],
  regeln: ['helfer'],
  speicher: ['helfer'],
  inhalte: ['helfer'],
  runde: ['helfer', 'regeln'],
  komponenten: ['helfer'],
  apps: ['helfer', 'runde', 'komponenten'],
  seiten: ['helfer', 'regeln', 'speicher', 'inhalte', 'runde', 'komponenten', 'apps']
});
const SCHICHTEN = Object.keys(ERLAUBT);
const OHNE_REACT = ['helfer', 'regeln', 'speicher', 'inhalte', 'runde'];
// Diese Schichten haben eine öffentliche Schnittstelle: andere importieren nur ihre index.js.
const MIT_INDEX = ['helfer', 'regeln', 'speicher', 'inhalte', 'runde'];

const ohneKommentare = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
const importe = (text) => [...ohneKommentare(text).matchAll(/(?:\bfrom|\bimport)\s*\(?\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);

function quellen(ordner) {
  return readdirSync(join(ROOT, ordner), { withFileTypes: true }).flatMap((eintrag) => {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) return eintrag.name === 'tests' ? [] : quellen(pfad);
    return eintrag.name.endsWith('.js') ? [pfad] : [];
  });
}

/** Graph als { datei: [ziel, ...] }. Relative Ziele werden zum Pfad ab der Wurzel, Pakete bleiben wie sie sind. */
function leseGraph() {
  const graph = {};
  for (const datei of SCHICHTEN.flatMap(quellen)) {
    graph[datei] = importe(readFileSync(join(ROOT, datei), 'utf8'))
      .map((ziel) => (ziel.startsWith('.') ? normalize(join(dirname(datei), ziel)) : ziel));
  }
  return graph;
}

const schichtVon = (pfad) => pfad.split('/')[0];
// apps/index.js sammelt die Logik aller Apps und gehört selbst zu keiner App.
const istSammelstelle = (pfad) => pfad === 'apps/index.js';
const appVon = (pfad) => pfad.split('/')[1];

/** Alle Regelverstöße als Texte. Leer heißt sauber. */
export function verstoesse(graph) {
  const fehler = [];
  for (const [datei, ziele] of Object.entries(graph)) {
    const von = schichtVon(datei);
    for (const ziel of ziele) {
      const nach = schichtVon(ziel);
      if (ziel === 'react' || ziel.startsWith('react-dom')) {
        if (OHNE_REACT.includes(von)) fehler.push(`${datei}: ${von} darf React nicht laden`);
      } else if (!SCHICHTEN.includes(nach)) {
        continue;
      } else if (nach === von) {
        if (von === 'apps' && !istSammelstelle(datei) && appVon(datei) !== appVon(ziel)) fehler.push(`${datei}: importiert aus anderer App (${ziel})`);
      } else if (!ERLAUBT[von].includes(nach)) {
        fehler.push(`${datei}: ${von} darf nicht aus ${nach} importieren (${ziel})`);
      } else if (MIT_INDEX.includes(nach) && ziel !== `${nach}/index.js`) {
        fehler.push(`${datei}: nur ${nach}/index.js ist öffentlich (${ziel})`);
      }
    }
  }
  return fehler;
}

/** Aufgaben-Erzeuger laufen ohne Oberfläche: von builders.js darf kein Weg zu React führen, auch nicht über Umwege. */
export function erzeugerMitReact(graph) {
  const erreichtReact = (datei, besucht = new Set()) => {
    if (datei === 'react') return true;
    if (besucht.has(datei)) return false;
    besucht.add(datei);
    return (graph[datei] || []).some((ziel) => erreichtReact(ziel, besucht));
  };
  return Object.keys(graph).filter((datei) => /^apps\/.*builders\.js$/.test(datei) && erreichtReact(datei));
}

test('SEITE-SCHICHTEN Alle Importe halten die Richtung ein', () => {
  const graph = leseGraph();
  assert.ok(Object.keys(graph).length > 50, 'es werden Dateien gelesen');
  assert.deepEqual(verstoesse(graph), []);
});

test('SEITE-SCHICHTEN Aufgaben-Erzeuger erreichen React nicht', () => {
  assert.deepEqual(erzeugerMitReact(leseGraph()), []);
});

test('SEITE-SCHICHTEN Die Regeln schlagen bei Verstößen an', () => {
  assert.equal(verstoesse({ 'komponenten/a.js': ['seiten/b.js'] }).length, 1, 'Richtung');
  assert.equal(verstoesse({ 'apps/mathe/a.js': ['speicher/index.js'] }).length, 1, 'App greift auf Speicher zu');
  assert.equal(verstoesse({ 'apps/mathe/a.js': ['apps/deutsch/b.js'] }).length, 1, 'App greift auf App zu');
  assert.equal(verstoesse({ 'seiten/a.js': ['regeln/src/round.js'] }).length, 1, 'Schnittstelle umgangen');
  assert.equal(verstoesse({ 'runde/src/a.js': ['react'] }).length, 1, 'React in reiner Logik');
  assert.deepEqual(verstoesse({ 'apps/mathe/a.js': ['apps/mathe/b.js', 'runde/index.js', 'komponenten/svg.js'] }), []);
  assert.deepEqual(
    erzeugerMitReact({ 'apps/x/builders.js': ['komponenten/y.js'], 'komponenten/y.js': ['react'] }),
    ['apps/x/builders.js']
  );
});
