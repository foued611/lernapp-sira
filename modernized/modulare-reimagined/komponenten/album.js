// Sammelalbum (legacy/modulare/core/js/views/home.js:33-42). Die Stufe kommt aus den Sternen einer Seite:
// 0 gesperrt, 1 Bronze, 2 Silber, 3 Gold (RULE-220). Seiten ohne Karte werden übersprungen.
import { createElement } from 'react';
import { starsOf } from './ui.js';

const h = createElement;

// Index = Sternzahl. Legacy: home.js:34 (medal), Stufe 0 ist die gesperrte Karte.
export const TIERS = Object.freeze(['Gesperrt', 'Bronze', 'Silber', 'Gold']);

/** Stufe aus der Sternzahl. Keine ganze Zahl zählt als 0, Werte über 3 als 3. */
export function tierOf(stars) {
  if (!Number.isInteger(stars)) return 0;
  return Math.min(3, Math.max(0, stars));
}

/** Eine Karte. Ohne Karte im Inhalt wird nichts gezeichnet. */
export function AlbumCard({ unit, stars }) {
  if (!unit || !unit.card) return null;
  const tier = tierOf(stars);
  const style = typeof unit.color === 'string' ? { '--lc': unit.color } : undefined;
  // Gesperrt: bewusst ohne Namen und Fakt, nur mit dem Hinweis, wie man sie freischaltet (home.js:40).
  const body =
    tier === 0
      ? [
          h('span', { key: 'm', className: 'medal' }, TIERS[0]),
          h('h3', { key: 'h' }, 'Geheimkarte'),
          h('p', { key: 'p' }, `Schaffe die Seite „${unit.title}“, um sie freizuschalten.`)
        ]
      : [
          h('span', { key: 'm', className: 'medal' }, TIERS[tier]),
          h('h3', { key: 'h' }, unit.card.name),
          h('p', { key: 'p' }, unit.card.fact)
        ];
  return h('article', { className: `gcard t${tier}`, style }, ...body);
}

/** Das Album. Hat keine Seite eine Karte, entfällt der ganze Abschnitt (home.js:35). */
export function Album({ units, stars }) {
  const withCard = (units || []).filter((u) => u && u.card);
  if (withCard.length === 0) return null;
  return h(
    'section',
    null,
    h('h2', null, 'Sammelalbum'),
    h('p', { className: 'muted album-intro' }, 'Für jede Seite gibt es eine Karte. Mit mehr Sternen wird sie wertvoller: Bronze, Silber, Gold.'),
    h(
      'div',
      { className: 'album' },
      ...withCard.map((u) => h(AlbumCard, { key: u.id, unit: u, stars: starsOf(stars, u.id) }))
    )
  );
}
