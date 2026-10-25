// Kleine Helfer für Diagramme als SVG-Text. Farben kommen über CSS-Klassen (core/styles/lesson.css),
// deshalb passen die Bilder zu hell und dunkel. Alle Texte werden maskiert.
import { esc } from './ui.js';

const ARROW = '<defs><marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arw-head" d="M0 0 L10 5 L0 10 z"/></marker></defs>';

/** Rahmen eines Diagramms. label ist der Alternativtext für Screenreader. */
export const svg = (width, height, inner, label) =>
  `<svg class="dg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${ARROW}${inner}</svg>`;

export const rect = (x, y, w, h, cls, r = 10) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
export const circle = (x, y, r, cls) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
export const text = (x, y, value, cls = 'md') => `<text class="${cls}" x="${x}" y="${y}">${esc(value)}</text>`;
export const line = (x1, y1, x2, y2, cls = 'ln') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
export const arrow = (x1, y1, x2, y2) => `<line class="ar" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
export const path = (d, cls = 'ln') => `<path class="${cls}" d="${d}"/>`;
