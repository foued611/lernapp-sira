// Materiallinks (manifest.resources[].href) sind nur relative Pfade im Ordner files/ (RULE-144, SEC-002).
//
// Legacy core/js/validate.js:8 prüfte nur ein Muster. Ein Backslash ließ es durch. Browser lesen "\"
// wie "/", daher wird "\\evil.example/x" zu einem Link auf fremden Host (SEC-002). Deshalb hier zuerst
// der Backslash-Test, dann die Form, dann eine Ursprungsprüfung mit new URL().

const BASE = 'https://materialien.invalid/apps/app/index.html';
const BASE_DIR = '/apps/app/';
const FILES_DIR = 'files/';
const SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
// Dateinamen: Buchstaben und Ziffern (auch Umlaute), Punkt, Bindestrich, Unterstrich. Kein Prozentzeichen,
// damit kodierte Pfade wie %2e%2e nicht als Dateiname durchgehen.
const SEGMENT = /^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u;

/** Liste der Gründe, warum href nicht passt. Leer heißt erlaubt. */
export function materialErrors(href) {
  if (typeof href !== 'string' || href === '') return ['href fehlt'];
  if (href.includes('\\')) return ['Backslash ist nicht erlaubt (SEC-002)'];
  if (/\s/.test(href)) return ['Leerzeichen sind nicht erlaubt'];
  if (/["'<>]/.test(href)) return ['Anführungszeichen und spitze Klammern sind nicht erlaubt'];
  if (SCHEME.test(href)) return ['absolute URL oder Schema (https:, javascript:, data:) ist nicht erlaubt'];
  if (href.startsWith('/')) return ['absoluter Pfad mit führendem Schrägstrich ist nicht erlaubt'];
  if (href.includes('..')) return ['".." ist nicht erlaubt'];
  if (!href.startsWith(FILES_DIR)) return ['Material muss im Ordner files/ liegen'];
  if (!href.slice(FILES_DIR.length).split('/').every((part) => SEGMENT.test(part))) return ['Dateiname enthält ungültige Zeichen'];
  return originErrors(href);
}

/** Ursprungsprüfung: der aufgelöste Link muss auf derselben Herkunft bleiben und unter files/ landen. */
function originErrors(href) {
  const base = new URL(BASE);
  const url = new URL(href, base);
  if (url.origin !== base.origin) return ['Link verlässt die eigene Herkunft (SEC-002)'];
  if (!url.pathname.startsWith(`${BASE_DIR}${FILES_DIR}`)) return ['Link verlässt den Ordner files/'];
  return [];
}

export const isSafeMaterialHref = (href) => materialErrors(href).length === 0;
