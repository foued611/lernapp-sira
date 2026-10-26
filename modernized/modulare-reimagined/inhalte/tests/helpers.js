// Gemeinsame Helfer der Tests. Echte Pakete und das Schema liegen im Projektstamm (content/, schemas/) und werden nur gelesen.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// tests -> inhalte -> modulare-reimagined -> modernized -> lernapp-sira (Projektstamm)
export const REPO_ROOT = resolve(here, '../../../..');
export const CONTENT_DIR = join(REPO_ROOT, 'content');
export const SCHEMA_PATH = join(REPO_ROOT, 'schemas/bundle.schema.json');

const readJSON = (path) => JSON.parse(readFileSync(path, 'utf8'));

/** Alle Paket-Ordner unter content/, sortiert. Jeder Ordner ist ein Paket, auch vorlage. */
export function listPackages() {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Liest ein Paket so, wie die statische Quelle es tut: data.json fehlt, dann {}. */
export function readPackage(id) {
  const dir = join(CONTENT_DIR, id);
  const data = existsSync(join(dir, 'data.json')) ? readJSON(join(dir, 'data.json')) : {};
  return {
    manifest: readJSON(join(dir, 'manifest.json')),
    lessons: readJSON(join(dir, 'lessons.json')),
    badges: readJSON(join(dir, 'badges.json')),
    data
  };
}

/** Namen aller Diagramm-Verweise, damit Tests für jeden Namen einen Stub bauen können. */
export function diagramNames(lessons) {
  return Object.values(lessons)
    .map((lesson) => lesson.figure && lesson.figure.diagram && lesson.figure.diagram.name)
    .filter(Boolean);
}

function lesson() {
  return {
    goal: 'Du kannst die Testseite erklären.',
    tldr: ['Ein Satz.', 'Noch ein Satz.'],
    analogy: { title: 'Vergleich', html: '<p>Stell dir eine <b>Kiste</b> vor.</p>' },
    figure: { caption: 'Ein Bild', diagram: { name: 'probeDiagram', args: [] } },
    steps: { title: 'Beispiel', items: ['Erster Schritt.', 'Zweiter Schritt.'] },
    pitfall: { html: '<p>Die typische Falle.</p>' },
    rule: 'Der Merksatz.',
    check: {
      q: 'Welche Antwort stimmt?',
      options: [
        { id: 'a', html: '<p>A</p>' },
        { id: 'b', html: '<p>B</p>' },
        { id: 'c', html: '<p>C</p>' }
      ],
      answer: 'a',
      why: 'Weil A richtig ist.'
    }
  };
}

/** Ein kleines, gültiges Paket, im Code gebaut. Die Tests verändern eine Kopie davon. */
export function validBundle() {
  return {
    manifest: {
      schema: 1,
      id: 'probe-app',
      title: 'Testapp',
      greeting: 'Hallo',
      intro: 'Starte irgendwo.',
      tracks: { lrs: { label: 'LRS-Förderung', desc: 'Zusatzmaterial' } },
      units: [
        { id: 'start', title: 'Erste Seite', de: 'Beschreibung', ic: '1', color: '#4CC3F5', card: { name: 'Karte', fact: 'Ein Fakt.' } },
        { id: 'weiter', title: 'Zweite Seite', de: 'Beschreibung', ic: '2', color: '#FF9F43', track: 'lrs', card: { name: 'Karte', fact: 'Ein Fakt.' } }
      ],
      resources: [{ title: 'Merkblatt', desc: 'PDF zum Drucken', track: 'lrs', href: 'files/merkblatt.pdf' }],
      notes: { start: [['Merke', 'Beim Addieren zählst du zusammen.']] }
    },
    lessons: { start: lesson(), weiter: lesson() },
    badges: [
      { id: 'first', n: 'Erster Schritt', d: 'Die erste Seite geschafft', rule: { type: 'anyUnit' } },
      { id: 'both', n: 'Beide Seiten', d: 'Beide Seiten begonnen', rule: { type: 'units', ids: ['start', 'weiter'] } }
    ],
    data: {}
  };
}

/** Antwort-Attrappe für fetch: { ok, status, json() }. Kein Netz, kein globales fetch. */
export function fakeFetch(routes) {
  const calls = [];
  const fetchFn = async (url, init) => {
    calls.push({ url, init });
    const route = routes[url];
    if (!route) return { ok: false, status: 404, json: async () => ({}) };
    const status = route.status ?? 200;
    return { ok: status >= 200 && status < 300, status, json: async () => route.body };
  };
  return Object.assign(fetchFn, { calls });
}
