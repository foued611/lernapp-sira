// Suche über alle Seiten aller Apps. Die Daten stehen im Katalog, Inhalte müssen dafür nicht geladen werden.
// searchUnits ist rein, die Ansicht zeichnet nur.
import { createElement, useState } from 'react';
import { normalise, stripAccents } from '../runde/index.js';
import { LIVE } from './registry.js';
import { searchOf } from './adresse.js';

const h = createElement;

// Ab zwei Zeichen. Ein einzelner Buchstabe träfe fast jede Seite.
export const MIN_QUERY = 2;
export const MAX_HITS = 8;

const fold = (text) => stripAccents(normalise(text || ''));

// Niedriger ist besser: Treffer am Titelanfang vor Treffern im Titel vor Treffern nur im Rest.
function rankOf(title, words) {
  if (title.startsWith(words[0])) return 0;
  return words.every((word) => title.includes(word)) ? 1 : 2;
}

/**
 * Sucht in Titel, Beschreibung, Kapitel, App und Fach. Alle Wörter der Anfrage müssen vorkommen.
 * @returns {{ total: number, hits: object[] }} hits sind höchstens MAX_HITS Treffer, total zählt alle.
 */
export function searchUnits(entries, query) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (fold(query).length < MIN_QUERY) return { total: 0, hits: [] };
  const found = entries
    .filter((entry) => entry.status === LIVE)
    .flatMap((entry) => (entry.units ?? []).map((unit) => {
      const title = fold(unit.title);
      const text = fold([unit.title, unit.de, unit.chapter, entry.title, entry.subject].join(' '));
      return { entry, unit, title, text };
    }))
    .filter(({ text }) => words.every((word) => text.includes(word)))
    .map((item) => ({ ...item, rank: rankOf(item.title, words) }))
    .sort((a, b) => a.rank - b.rank);
  return {
    total: found.length,
    hits: found.slice(0, MAX_HITS).map(({ entry, unit }) => ({
      key: `${entry.id}/${unit.id}`,
      title: unit.title,
      where: [entry.title, unit.chapter].filter(Boolean).join(' · '),
      href: searchOf(entry.id, unit.id)
    }))
  };
}

const countText = (total) => (total === 1 ? '1 Seite gefunden' : `${total} Seiten gefunden`);

/** Das Suchfeld. Der Stand bleibt hier, die Startseite muss nichts davon wissen. */
export function Suche({ apps, initial = '' }) {
  const [query, setQuery] = useState(initial);
  const { total, hits } = searchUnits(apps, query);
  const active = fold(query).length >= MIN_QUERY;
  return h(
    'section',
    { className: 'suche', role: 'search' },
    h('input', { type: 'search', value: query, placeholder: 'Thema suchen, z. B. Prozent', 'aria-label': 'Thema in allen Apps suchen', autoComplete: 'off', onChange: (event) => setQuery(event.target.value) }),
    active ? h('p', { className: 'muted', role: 'status' }, total ? countText(total) : 'Nichts gefunden. Versuch ein anderes Wort.') : null,
    hits.length
      ? h('ul', { className: 'treffer' }, ...hits.map((hit) => h(
        'li',
        { key: hit.key },
        h('a', { href: hit.href }, h('b', null, hit.title), h('small', null, hit.where))
      )))
      : null,
    total > MAX_HITS ? h('p', { className: 'muted' }, `Die ersten ${MAX_HITS} von ${total}. Ein zweites Wort grenzt die Suche ein.`) : null
  );
}
