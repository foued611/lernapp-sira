// Prüft ein Inhaltspaket (Bundle) beim Laden. Kommt es aus einer Datenbank, fangen wir kaputte Daten hier ab,
// bevor die App halb kaputt aussieht. Die strenge Prüfung per JSON-Schema läuft in den Tests (schemas/).
import { ruleErrors } from './rules.js';

const LESSON_KEYS = ['goal', 'tldr', 'analogy', 'figure', 'steps', 'pitfall', 'rule', 'check'];

/** Nur relative Pfade: kein Schema (javascript:, https:), kein führender Slash, kein "..", keine Leerzeichen oder Anführungszeichen. */
export const isSafeHref = (href) => typeof href === 'string' && /^(?![a-zA-Z][a-zA-Z0-9+.-]*:)(?!\/)(?!.*\.\.)[^\s"'<>]+$/.test(href);

/** Gibt eine Liste verständlicher Fehler zurück. Leer heißt gültig. */
export function bundleErrors(bundle) {
  const errors = [];
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  if (!isObj(bundle)) return ['Inhaltspaket fehlt'];
  const { manifest, lessons, badges } = bundle;
  if (!isObj(manifest)) return ['manifest fehlt'];
  if (!/^[a-z0-9-]+$/.test(manifest.id || '')) errors.push('manifest.id: Kleinbuchstaben, Ziffern, Bindestrich');
  ['title', 'greeting', 'intro'].forEach((k) => { if (!manifest[k]) errors.push(`manifest.${k} fehlt`); });
  if (!Array.isArray(manifest.units) || !manifest.units.length) return [...errors, 'manifest.units fehlt'];
  const ids = manifest.units.map((u) => u.id);
  if (new Set(ids).size !== ids.length) errors.push('Seiten-IDs sind nicht eindeutig');
  manifest.units.forEach((u) => ['id', 'title', 'de', 'ic', 'color'].forEach((k) => { if (!u[k]) errors.push(`Seite ${u.id || '?'}: ${k} fehlt`); }));
  const tracks = isObj(manifest.tracks) ? manifest.tracks : {};
  Object.entries(tracks).forEach(([k, t]) => { if (!t || !t.label) errors.push(`tracks.${k}: label fehlt`); });
  manifest.units.forEach((u) => { if (u.track && !tracks[u.track]) errors.push(`Seite ${u.id}: Strang "${u.track}" ist in tracks nicht definiert`); });
  (manifest.resources || []).forEach((r, i) => {
    if (r && r.track && !tracks[r.track]) errors.push(`resources[${i}]: Strang "${r.track}" ist in tracks nicht definiert`);
    if (!r || !r.title) errors.push(`resources[${i}]: title fehlt`);
    if (!r || !isSafeHref(r.href)) errors.push(`resources[${i}]: href muss ein relativer Pfad sein`);
  });
  if (!isObj(lessons)) errors.push('lessons fehlt');
  else ids.forEach((id) => {
    const l = lessons[id];
    if (!l) { errors.push(`Lektion fehlt: ${id}`); return; }
    LESSON_KEYS.forEach((k) => { if (!l[k]) errors.push(`Lektion ${id}: ${k} fehlt`); });
    if (l.figure && !l.figure.svg && !l.figure.diagram) errors.push(`Lektion ${id}: figure braucht diagram oder svg`);
  });
  if (!Array.isArray(badges) || !badges.length) errors.push('badges fehlen');
  else {
    const badgeIds = badges.map((b) => b.id);
    if (new Set(badgeIds).size !== badgeIds.length) errors.push('Trophäen-IDs sind nicht eindeutig');
    badges.forEach((b) => { ['id', 'n', 'd'].forEach((k) => { if (!b[k]) errors.push(`Trophäe ${b.id || '?'}: ${k} fehlt`); }); errors.push(...ruleErrors(b.rule, ids, `Trophäe ${b.id}.rule`)); });
  }
  return errors;
}

export function assertBundle(bundle) {
  const errors = bundleErrors(bundle);
  if (errors.length) throw new Error(`Inhalte ungültig:\n- ${errors.slice(0, 10).join('\n- ')}`);
  return bundle;
}
