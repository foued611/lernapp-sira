// Prüft Markup in Inhaltspaketen gegen die Allow-list (SEC-003).
//
// Warum eigener Prüfer statt Regex auf "<script": Ein Tokenizer lehnt alles ab, was er nicht sauber
// lesen kann (Kommentare, CDATA, halbe Tags, "<" im Text). Eine Blacklist würde solche Stellen übersehen.
// Legacy prüfte html und svg gar nicht (legacy core/js/validate.js).
import { HTML_TAGS, SVG_TAGS, FORBIDDEN_TAGS } from './allowlist.js';

// Ein Tag: optional "/", Name, Attribute mit optionalem Wert, optional "/" vor ">".
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>=`]+))?)*)\s*(\/?)>/y;
const ATTR = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>=`]+)))?/g;
const SCHEME = /^(javascript|vbscript|data):/i;

/** Hebt Zeichenentities der Form &#106; und &#x6a; auf, damit "&#106;avascript:" nicht durchrutscht. */
const decodeNumeric = (value) => value.replace(/&#(x[0-9a-f]+|[0-9]+);?/gi, (_, code) => {
  const point = code[0] === 'x' || code[0] === 'X' ? parseInt(code.slice(1), 16) : parseInt(code, 10);
  // Ungültige Codepunkte würden fromCodePoint werfen. Sie werden zu nichts, der Rest bleibt geprüft.
  return point <= 0x10ffff ? String.fromCodePoint(point) : '';
});

/** Attributwert für die Schema-Prüfung: Entities auflösen, Leerzeichen und Steuerzeichen entfernen. */
const normalizeValue = (value) => decodeNumeric(value).replace(/[\u0000- ]/g, '');

function attributeErrors(name, rawAttrs, permitted) {
  const errors = [];
  for (const match of rawAttrs.matchAll(ATTR)) {
    const attr = match[1].toLowerCase();
    const value = normalizeValue(match[2] ?? match[3] ?? match[4] ?? '');
    // Ereignis-Attribute (onclick, onerror ...) führen beliebigen Code aus, egal an welchem Tag.
    if (attr.startsWith('on')) errors.push(`Ereignis-Attribut "${attr}" an <${name}> ist verboten`);
    else if (!permitted.includes(attr)) errors.push(`Attribut "${attr}" an <${name}> ist nicht erlaubt`);
    if (SCHEME.test(value)) errors.push(`URL mit Schema an <${name}> ist verboten (javascript:, data:)`);
  }
  return errors;
}

/**
 * Prüft einen Text als Markup. mode 'html' für html-Felder, 'svg' für svg-Felder.
 * Gibt eine Liste von Fehlern zurück. Leer heißt gültig.
 */
export function markupErrors(text, mode = 'html') {
  const allowed = mode === 'svg' ? SVG_TAGS : HTML_TAGS;
  const errors = [];
  const open = [];
  if (mode === 'svg' && !/^\s*<svg[\s>]/i.test(text)) errors.push('svg-Feld muss mit <svg> beginnen');
  let pos = 0;
  let at = text.indexOf('<', pos);
  while (at !== -1) {
    TAG.lastIndex = at;
    const match = TAG.exec(text);
    if (!match) return [...errors, `"<" ohne gültiges Tag an Position ${at} (Kommentare und Sonderformen sind nicht erlaubt)`];
    pos = TAG.lastIndex;
    at = text.indexOf('<', pos);
    const [, closing, rawName, rawAttrs, selfClosing] = match;
    const name = rawName.toLowerCase();
    if (FORBIDDEN_TAGS.has(name)) { errors.push(`Tag <${name}> ist verboten`); continue; }
    if (!Object.hasOwn(allowed, name)) { errors.push(`Tag <${name}> ist nicht erlaubt`); continue; }
    if (closing) {
      if (rawAttrs || selfClosing) errors.push(`schließendes Tag </${name}> mit Attributen`);
      else if (open.pop() !== name) errors.push(`</${name}> passt nicht zum geöffneten Tag`);
      continue;
    }
    errors.push(...attributeErrors(name, rawAttrs, allowed[name]));
    // "<b/>" lesen HTML-Parser als offenes Tag. Die Prüfung und der Browser müssen gleich lesen, daher nur in svg.
    if (selfClosing) {
      if (mode === 'html') errors.push(`"/>" ist im HTML-Markup nicht erlaubt (<${name}>)`);
      continue;
    }
    open.push(name);
  }
  if (open.length) errors.push(`nicht geschlossen: <${open.join('>, <')}>`);
  if (mode === 'svg' && !/<\/svg>\s*$/i.test(text)) errors.push('svg-Feld muss mit </svg> enden');
  return errors;
}

/** Prüft jedes Markup-Feld im Paket: alle Werte unter "html" und "svg" sowie jeder Text mit "<". */
export function bundleMarkupErrors(bundle) {
  const errors = [];
  const walk = (value, key, path) => {
    if (typeof value === 'string') {
      if (key === 'svg') errors.push(...markupErrors(value, 'svg').map((e) => `${path}: ${e}`));
      else if (key === 'html' || value.includes('<')) errors.push(...markupErrors(value, 'html').map((e) => `${path}: ${e}`));
      return;
    }
    if (Array.isArray(value)) value.forEach((item, i) => walk(item, key, `${path}[${i}]`));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => walk(v, k, path ? `${path}.${k}` : k));
  };
  walk(bundle, '', '');
  return errors;
}
