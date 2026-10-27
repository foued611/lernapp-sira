// Gemeinsame Bausteine: Button, Fortschritt, Sterne. Die Legacy-Fassungen stecken in
// legacy/modulare/core/js/views/home.js:8-9 (Sterne) und legacy/modulare/dashboard.js:19 (erledigt).
import { createElement } from 'react';
import { Icon } from './icons.js';

const h = createElement;

/**
 * Eine Seite gilt ab 2 von 3 Sternen als erledigt. Das ist eine Entscheidung der Person (RULE-075, siehe
 * analysis/modulare/RULE_REVIEWS.md). Legacy zählte schon ab einem Stern (dashboard.js:19).
 */
export const DONE_STARS = 2;

/** Sterne einer Seite. Fehlt der Eintrag oder ist er keine ganze Zahl, sind es 0. */
export const starsOf = (stars, id) =>
  stars && Object.hasOwn(stars, id) && Number.isInteger(stars[id]) ? stars[id] : 0;

/** Anzahl erledigter Seiten. Zählt nur die übergebenen Seiten, veraltete IDs erhöhen die Zahl nicht. */
export function doneUnits(stars, unitIds, threshold = DONE_STARS) {
  return unitIds.filter((id) => starsOf(stars, id) >= threshold).length;
}

/** Prozent, gerundet (.5 nach oben wie in dashboard.js:50), auf 0 bis 100 begrenzt. Ohne Seiten: 0 statt NaN. */
export function progressOf(done, total) {
  if (!(total > 0)) return 0;
  return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
}

/**
 * Knopf. Die Mindestgröße von 44 px kommt aus der CSS-Klasse .btn (seiten/design/styles/base.css), nicht aus einem
 * inline style. Standard-Typ ist button, damit ein Knopf in einem Formular nichts absendet.
 */
export function Button({ variant = 'primary', small = false, className = '', type = 'button', children, ...rest }) {
  const classes = ['btn'];
  if (variant === 'ghost') classes.push('ghost');
  if (variant === 'sun') classes.push('sun');
  if (small) classes.push('small');
  if (className) classes.push(className);
  return h('button', { type, className: classes.join(' '), ...rest }, children);
}

/** Fortschrittsbalken. Der Prozentwert steht als Text daneben, nicht nur als Balkenlänge. */
export function ProgressBar({ done, total, label = 'Fortschritt' }) {
  const pct = progressOf(done, total);
  return h(
    'div',
    { className: 'progress' },
    h(
      'div',
      {
        className: 'progress-track',
        role: 'progressbar',
        'aria-label': label,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': pct
      },
      // Die Breite ist ein berechneter Wert, deshalb ein Inline-Stil. Farben bleiben in der CSS-Klasse.
      h('div', { className: 'progress-fill', style: { width: `${pct}%` } })
    ),
    h('p', { className: 'progress-text' }, `${done} von ${total} Seiten erledigt (${pct} %)`)
  );
}

/**
 * Sterne als Symbole plus sichtbarer Text "2 von 3 Sternen". Die Symbole sind dekorativ, damit die
 * Anzahl nie nur über Farbe oder Form vermittelt wird.
 */
export function StarRow({ stars }) {
  const n = Math.min(3, Math.max(0, Number.isInteger(stars) ? stars : 0));
  return h(
    'span',
    { className: 'stars-row' },
    h(
      'span',
      { className: 'stars', 'aria-hidden': 'true' },
      ...[1, 2, 3].map((i) => h(Icon, { key: i, name: 'star', className: i <= n ? 'on' : '' }))
    ),
    h('span', { className: 'stars-text' }, `${n} von 3 Sternen`)
  );
}
