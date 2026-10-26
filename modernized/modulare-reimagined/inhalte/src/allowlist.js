// Erlaubtes Markup in Inhaltspaketen (SEC-003). Einzige Stelle, an der Tags und Attribute stehen.
//
// Warum: html- und svg-Felder kommen aus Paketen, die später aus einer Datenbank stammen können.
// Die App gibt sie als Markup aus (legacy core/js/lesson.js, core/js/qtypes.js). Legacy prüfte beides
// nicht (legacy core/js/validate.js, SEC-003). Alles, was hier fehlt, wird abgelehnt. Ein Eintrag kommt
// nur dazu, wenn Inhalte ihn wirklich brauchen, und dann mit Test.
//
// Schlüssel sind Kleinbuchstaben. Der Prüfer vergleicht Tag- und Attributnamen ohne Groß/Klein.

/**
 * HTML-Felder (html, Markup in tldr/items/q). Stand: legacy content/ nutzt nur <p> und <b>,
 * ohne jedes Attribut. Ein leeres Array heißt: keine Attribute erlaubt.
 */
export const HTML_TAGS = {
  p: [],
  b: []
};

/**
 * svg-Felder. In legacy content/ kommt kein svg-Feld vor, Diagramme entstehen über logic.js.
 * Die Liste folgt deshalb den Tags und Attributen, die legacy core/js/svg.js erzeugt.
 * Keine Verweise nach außen (href, use, image), keine Skripte, keine Ereignisse.
 */
export const SVG_TAGS = {
  svg: ['class', 'viewbox', 'role', 'aria-label', 'xmlns', 'width', 'height'],
  defs: [],
  marker: ['id', 'viewbox', 'refx', 'refy', 'markerwidth', 'markerheight', 'orient'],
  path: ['class', 'd'],
  rect: ['class', 'x', 'y', 'width', 'height', 'rx'],
  circle: ['class', 'cx', 'cy', 'r'],
  line: ['class', 'x1', 'y1', 'x2', 'y2'],
  text: ['class', 'x', 'y']
};

/**
 * Ausdrücklich verboten, mit eigener Meldung. Die Allow-list lehnt diese Tags ohnehin ab; die Liste
 * macht den Grund im Fehler sichtbar. Die Namen sind klein geschrieben.
 */
export const FORBIDDEN_TAGS = new Set([
  'script', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'style',
  'link', 'meta', 'base', 'form', 'a', 'img', 'use', 'image', 'foreignobject',
  'animate', 'animatemotion', 'animatetransform', 'set'
]);
