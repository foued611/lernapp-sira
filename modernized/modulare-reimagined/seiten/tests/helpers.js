// Gemeinsame Helfer der Tests. Kein Netz, kein Browser. Die Uhr und der Zufall kommen von außen.
// Der Speicher ist der echte Speicher im Arbeitsspeicher (openStore ohne IndexedDB und localStorage).
import { choiceQuestion } from '../../runde/index.js';
import { createRng } from '../../helfer/index.js';
import { openStore } from '../../speicher/index.js';
import { bootSeiten } from '../boot.js';

export const DAY = '2026-10-26';
export const NAME = 'Zoëx';

/** Mittag des Testtages in der Ortszeit. So fällt der Tageswechsel nie in den Test. */
export const nowMs = () => new Date(`${DAY}T12:00:00`).getTime();

export const memoryHandle = () => openStore({ indexedDB: null, localStorage: null });

export const TRACKS = Object.freeze({ lrs: { label: 'LRS-Förderung', desc: 'Zusatzmaterial für die Förderung' } });

// Zwei Seiten. Die zweite hängt am Strang lrs, die erste nicht (RULE-258).
export const UNITS = Object.freeze([
  { id: 'start', title: 'Erste Seite', de: 'Beschreibung', color: '#4CC3F5' },
  { id: 'weiter', title: 'Zweite Seite', de: 'Beschreibung', color: '#FF9F43', track: 'lrs' }
]);

export const UNIT_IDS = UNITS.map((u) => u.id);

/** Fragen mit einer richtigen und einer falschen Option. Die richtige Option ist immer id "richtig". */
export function questions(count, tag, seed = 1) {
  const rng = createRng(seed);
  return Array.from({ length: count }, (_, i) => choiceQuestion({
    label: `${tag}-${i + 1}`,
    prompt: `Frage ${i + 1} zu ${tag}`,
    answer: 'richtig',
    choices: ['richtig', 'falsch'],
    rng,
    why: 'Weil es so ist.'
  }));
}

/** Eine Konfiguration in der Form, die buildConfig liefert. Rundenquellen liefern Fragen aus questions(). */
export function configOf({ units = UNITS, bossUnlocked, quick = true, boss = true, blitz = true } = {}) {
  const blitzRng = createRng(4);
  return {
    id: 'mathe',
    title: 'Mathe-Werkstatt',
    greeting: 'Hallo',
    intro: 'Starte irgendwo.',
    tracks: TRACKS,
    units,
    lessons: {},
    notes: {},
    data: {},
    resources: [],
    rounds: {
      lesson: (unit) => questions(10, unit.id),
      quick: quick ? () => questions(6, 'quick', 2) : undefined,
      boss: boss ? () => questions(14, 'boss', 3) : undefined
    },
    // Eine Auswahlfrage je Aufruf, wie der Blitz sie braucht (kind choice).
    blitz: blitz ? () => choiceQuestion({ label: 'Blitz', prompt: 'Blitz-Frage', answer: 'richtig', choices: ['richtig', 'falsch'], rng: blitzRng, why: 'Weil es so ist.' }) : undefined,
    bossUnlocked,
    badges: [
      { id: 'first', n: 'Erster Schritt', d: 'Die erste Seite geschafft', rule: { type: 'anyUnit' } },
      { id: 'perfect', n: 'Perfekt', d: 'Eine Runde ohne Fehler', rule: { type: 'perfectRound' } }
    ],
    words: undefined
  };
}

/** Ein gültiges Inhaltspaket, im Code gebaut. Form wie bei inhalte/ (manifest, lessons, badges, data). */
export function bundleFor(id) {
  const lesson = () => ({
    goal: 'Du kannst die Testseite erklären.',
    tldr: ['Ein Satz.', 'Noch ein Satz.'],
    analogy: { title: 'Vergleich', html: '<p>Stell dir eine <b>Kiste</b> vor.</p>' },
    figure: { caption: 'Ein Bild', diagram: { name: 'probeDiagram', args: [] } },
    steps: { title: 'Beispiel', items: ['Erster Schritt.', 'Zweiter Schritt.'] },
    pitfall: { html: '<p>Die typische Falle.</p>' },
    rule: 'Der Merksatz.',
    check: {
      q: 'Welche Antwort stimmt?',
      options: [{ id: 'a', html: '<p>A</p>' }, { id: 'b', html: '<p>B</p>' }, { id: 'c', html: '<p>C</p>' }],
      answer: 'a',
      why: 'Weil A richtig ist.'
    }
  });
  return {
    manifest: {
      schema: 1,
      id,
      title: `Testapp ${id}`,
      greeting: 'Hallo',
      intro: 'Starte irgendwo.',
      tracks: TRACKS,
      units: [
        { id: 'start', title: 'Erste Seite', de: 'Beschreibung', ic: '1', color: '#4CC3F5', card: { name: 'Karte', fact: 'Ein Fakt.' } },
        { id: 'weiter', title: 'Zweite Seite', de: 'Beschreibung', ic: '2', color: '#FF9F43', track: 'lrs', card: { name: 'Karte', fact: 'Ein Fakt.' } }
      ],
      resources: [],
      notes: {}
    },
    lessons: { start: lesson(), weiter: lesson() },
    badges: [{ id: 'first', n: 'Erster Schritt', d: 'Die erste Seite geschafft', rule: { type: 'anyUnit' } }],
    data: {}
  };
}

/** Inhaltsquelle im Speicher. Die Apps in failing liefern einen Ladefehler. */
export function fakeSource(failing = []) {
  return {
    async load(id) {
      if (failing.includes(id)) throw new Error('Inhalt nicht erreichbar');
      return bundleFor(id);
    }
  };
}

// Was der Katalog aus dem Manifest der Testapps übernimmt.
const FIXTURE_ENTRY = Object.freeze({ units: bundleFor('x').manifest.units.map(({ id }) => ({ id })) });

export const REGISTRY = Object.freeze([
  { id: 'mathe', fach: 'mathematik', klassen: [7], subject: 'Mathematik', title: 'Mathe-Werkstatt', desc: 'Zahlen und Gleichungen.', status: 'live', ...FIXTURE_ENTRY },
  { id: 'deutsch', fach: 'deutsch', klassen: [7], subject: 'Deutsch', title: 'Deutsch-Werkstatt', desc: 'Texte und Regeln.', status: 'live', ...FIXTURE_ENTRY },
  { id: 'physik', fach: 'physik', klassen: [7], subject: 'Physik', title: 'Physik-App', desc: 'Kräfte.', status: 'soon' }
]);

// Logik der Testapps: Diagramm für die Lektionen und die Rundenquellen wie in einer echten App (logic.js).
export const LOGIC = Object.freeze({
  diagrams: { probeDiagram: () => '<svg role="img" aria-label="Probe"></svg>' },
  rounds: Object.freeze({
    lesson: (unit) => questions(10, unit.id),
    quick: () => questions(6, 'quick', 2),
    boss: () => questions(14, 'boss', 3)
  })
});

/** Startet die Seiten mit Testquellen. Speicher und Adresse sind einstellbar. */
export async function bootFixture({ failing = [], openStorage = () => memoryHandle(), registry = REGISTRY, search = '' } = {}) {
  return bootSeiten({
    registry,
    source: fakeSource(failing),
    openStorage,
    loadLogic: () => LOGIC,
    now: nowMs,
    search
  });
}

/** Spielt eine Runde bis zum Ende. Mit wrong: true wird immer falsch geantwortet, bis die Herzen leer sind. */
export function playAll(round, { wrong = false } = {}) {
  for (let guard = 0; guard < 200; guard += 1) {
    const cur = round.current();
    if (!cur) break;
    if (cur.status === 'ask') {
      const q = cur.question;
      const pick = wrong ? q.options.find((o) => o.id !== q.answer).id : q.answer;
      round.submit({ pick });
    }
    const step = round.next();
    if (step.done) return step.result;
  }
  throw new Error('Die Runde endet nicht');
}

/** Ein Speicher, der beim Öffnen des Profils wirft. Wie ein Browser, der den Speicher sperrt. */
export const throwingHandle = () => ({
  backend: 'indexeddb',
  createStore: async () => {
    throw new Error('Speicher gesperrt');
  },
  logEvent: async () => ({ ok: false, error: 'Speicher gesperrt' })
});

/** Ein Profil, dessen gespeicherter Stand nicht lesbar ist. Der Speicher meldet das als blocked. */
export const blockedHandle = (message = 'Der gespeicherte Fortschritt konnte nicht gelesen werden.') => ({
  backend: 'indexeddb',
  createStore: async () => ({
    state: {},
    blocked: { reason: 'read-failed', message },
    save: async () => ({ ok: false, error: message })
  }),
  logEvent: async () => ({ ok: true })
});
