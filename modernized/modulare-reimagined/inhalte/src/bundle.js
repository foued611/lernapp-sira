// Prüft ein Inhaltspaket (Bundle) als Ganzes (RULE-143). Ein Fehler lehnt das ganze Paket ab, nie Teile davon.
// Warum: Eine App mit halb geladenem Inhalt wirkt kaputt und speichert Fortschritt auf fehlende Seiten.
//
// Legacy-Vorlage: core/js/validate.js:11-45 (bundleErrors). Ergänzt um Felder, die das Schema verlangt
// (card, color, notes) und um die Prüfungen für Materiallinks (RULE-144) und Markup (SEC-003).
// Das JSON-Schema selbst prüft nur der Test (INHALTE-SCHEMA), zur Laufzeit gibt es keine Schema-Bibliothek.
import { materialErrors } from './material.js';
import { bundleMarkupErrors } from './markup.js';
import { ruleErrors } from './rule.js';

const LESSON_KEYS = ['goal', 'tldr', 'analogy', 'figure', 'steps', 'pitfall', 'rule', 'check'];
// Kennungen: Kleinbuchstaben, Ziffern, Bindestrich. Sie stehen in gespeicherten Daten und werden nie umbenannt.
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const COLOR = /^#[0-9A-Fa-f]{6}$/;

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isId = (v) => typeof v === 'string' && ID.test(v);
const hasDuplicates = (list) => new Set(list).size !== list.length;

/** Alle Fehler des Pakets. Leere Liste heißt gültig. Es werden alle Fehler gesammelt, nicht nur der erste. */
export function bundleErrors(bundle) {
  if (!isObj(bundle)) return ['Inhaltspaket fehlt'];
  const errors = [];
  if (bundle.data !== undefined && !isObj(bundle.data)) errors.push('data muss ein Objekt sein');
  const manifest = manifestErrors(bundle.manifest);
  errors.push(...manifest.errors);
  errors.push(...lessonErrors(bundle.lessons, manifest.unitIds));
  errors.push(...badgeErrors(bundle.badges, manifest.unitIds));
  errors.push(...bundleMarkupErrors(bundle));
  return errors;
}

/** Prüft das Manifest. unitIds sind die gültigen Seiten-IDs, die Lektionen und Trophäen brauchen. */
function manifestErrors(manifest) {
  if (!isObj(manifest)) return { errors: ['manifest fehlt'], unitIds: [] };
  const errors = [];
  if (manifest.schema !== 1) errors.push('manifest.schema muss 1 sein');
  if (!isId(manifest.id)) errors.push('manifest.id: Kleinbuchstaben, Ziffern, Bindestrich');
  ['title', 'greeting', 'intro'].forEach((k) => { if (!isText(manifest[k])) errors.push(`manifest.${k} fehlt`); });
  if (!Array.isArray(manifest.units) || !manifest.units.length) return { errors: [...errors, 'manifest.units fehlt'], unitIds: [] };

  const unitIds = manifest.units.map((u) => (isObj(u) ? u.id : undefined));
  if (hasDuplicates(unitIds)) errors.push('Seiten-IDs sind nicht eindeutig');
  manifest.units.forEach((u, i) => errors.push(...unitErrors(u, i)));

  const tracks = manifest.tracks === undefined ? {} : manifest.tracks;
  if (!isObj(tracks)) errors.push('manifest.tracks muss ein Objekt sein');
  else errors.push(...trackErrors(tracks));
  manifest.units.forEach((u) => {
    if (isObj(u) && u.track !== undefined && !(isObj(tracks) && Object.hasOwn(tracks, u.track))) errors.push(`Seite ${u.id}: Strang "${u.track}" ist in tracks nicht definiert`);
  });

  errors.push(...resourceErrors(manifest.resources, isObj(tracks) ? tracks : {}));
  errors.push(...notesErrors(manifest.notes, unitIds));
  return { errors, unitIds: unitIds.filter(isId) };
}

function unitErrors(u, i) {
  if (!isObj(u)) return [`Seite ${i}: kein Objekt`];
  const name = u.id ?? `#${i}`;
  const errors = [];
  if (!isId(u.id)) errors.push(`Seite ${name}: id ungültig`);
  ['title', 'de', 'ic'].forEach((k) => { if (!isText(u[k])) errors.push(`Seite ${name}: ${k} fehlt`); });
  if (typeof u.color !== 'string' || !COLOR.test(u.color)) errors.push(`Seite ${name}: color muss #RRGGBB sein`);
  if (!isObj(u.card) || !isText(u.card.name) || !isText(u.card.fact)) errors.push(`Seite ${name}: card mit name und fact fehlt`);
  return errors;
}

function trackErrors(tracks) {
  return Object.entries(tracks).filter(([, t]) => !isObj(t) || !isText(t.label)).map(([k]) => `tracks.${k}: label fehlt`);
}

/** Materiallinks: nur relative Pfade in files/ (RULE-144). Jeder Grund wird einzeln gemeldet. */
function resourceErrors(resources, tracks) {
  if (resources === undefined) return [];
  if (!Array.isArray(resources)) return ['manifest.resources muss eine Liste sein'];
  return resources.flatMap((r, i) => {
    if (!isObj(r)) return [`resources[${i}]: kein Objekt`];
    const errors = [];
    if (!isText(r.title)) errors.push(`resources[${i}]: title fehlt`);
    errors.push(...materialErrors(r.href).map((reason) => `resources[${i}].href: ${reason}`));
    if (r.track !== undefined && !Object.hasOwn(tracks, r.track)) errors.push(`resources[${i}]: Strang "${r.track}" ist in tracks nicht definiert`);
    return errors;
  });
}

/** Merkzettel: je Seite eine Liste aus [Überschrift, Text]. */
function notesErrors(notes, unitIds) {
  if (notes === undefined) return [];
  if (!isObj(notes)) return ['manifest.notes muss ein Objekt sein'];
  return Object.entries(notes).flatMap(([unitId, pairs]) => {
    if (!unitIds.includes(unitId)) return [`notes: Seite "${unitId}" gibt es nicht`];
    const ok = Array.isArray(pairs) && pairs.every((p) => Array.isArray(p) && p.length === 2 && p.every(isText));
    return ok ? [] : [`notes.${unitId}: Liste aus [Überschrift, Text] erwartet`];
  });
}

function lessonErrors(lessons, unitIds) {
  if (!isObj(lessons)) return ['lessons fehlt'];
  return unitIds.flatMap((id) => {
    const lesson = lessons[id];
    if (!isObj(lesson)) return [`Lektion fehlt: ${id}`];
    const errors = LESSON_KEYS.filter((k) => !lesson[k]).map((k) => `Lektion ${id}: ${k} fehlt`);
    // Ein Bild braucht entweder einen Verweis auf logic.diagrams oder fertiges svg (Schema: oneOf).
    if (lesson.figure && !lesson.figure.svg && !lesson.figure.diagram) errors.push(`Lektion ${id}: figure braucht diagram oder svg`);
    return errors;
  });
}

function badgeErrors(badges, unitIds) {
  if (!Array.isArray(badges) || !badges.length) return ['badges fehlen'];
  const errors = [];
  if (hasDuplicates(badges.map((b) => (isObj(b) ? b.id : undefined)))) errors.push('Trophäen-IDs sind nicht eindeutig');
  badges.forEach((b, i) => {
    if (!isObj(b)) { errors.push(`Trophäe ${i}: kein Objekt`); return; }
    if (!isId(b.id)) errors.push(`Trophäe ${i}: id ungültig`);
    ['n', 'd'].forEach((k) => { if (!isText(b[k])) errors.push(`Trophäe ${b.id ?? i}: ${k} fehlt`); });
    errors.push(...ruleErrors(b.rule, unitIds, `Trophäe ${b.id ?? i}.rule`));
  });
  return errors;
}

/** Wirft bei jedem Fehler. Die Liste aller Fehler hängt am Fehler als errors. */
export function assertBundle(bundle) {
  const errors = bundleErrors(bundle);
  if (errors.length) {
    const error = new Error(`Inhalte ungültig, das ganze Paket wird abgelehnt:\n- ${errors.slice(0, 10).join('\n- ')}`);
    error.errors = errors;
    throw error;
  }
  return bundle;
}
