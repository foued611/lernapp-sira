// App-Katalog: was die Startseite von jeder App braucht, ohne ihre Inhalte zu laden. Quelle ist allein das Manifest,
// katalog.mjs schreibt daraus beim Bauen content/katalog.json. Ein Paket ohne Feld catalog (die Vorlage) erscheint nicht.

const LIVE = 'live';

/** Eintrag einer App. Von den Seiten bleibt, was Kachel und Suche brauchen: die ID zählt den Fortschritt, der Rest wird gesucht. */
export function catalogEntry(manifest) {
  const { fach, klassen, lehrwerk, subject, desc, status = LIVE } = manifest.catalog;
  const chapterOf = (unit) => (manifest.groups ?? []).find((group) => group.id === unit.group)?.title;
  return {
    id: manifest.id,
    fach,
    klassen,
    lehrwerk,
    subject,
    title: manifest.title,
    desc,
    status,
    units: manifest.units.map((unit) => ({ id: unit.id, title: unit.title, de: unit.de, chapter: chapterOf(unit) }))
  };
}

/** Liste aller Apps in der Reihenfolge von catalog.order. */
export function buildCatalog(manifests) {
  return manifests
    .filter((manifest) => manifest.catalog)
    .sort((a, b) => a.catalog.order - b.catalog.order)
    .map(catalogEntry);
}
