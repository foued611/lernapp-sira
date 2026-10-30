// App-Katalog: was die Startseite von jeder App braucht, ohne ihre Inhalte zu laden. Quelle ist allein das Manifest,
// katalog.mjs schreibt daraus beim Bauen content/katalog.json. Ein Paket ohne Feld catalog (die Vorlage) erscheint nicht.

const LIVE = 'live';

/** Eintrag einer App. Von den Seiten bleibt nur, was Kacheln und Empfehlung zeigen. */
export function catalogEntry(manifest) {
  const { subject, desc, status = LIVE } = manifest.catalog;
  return {
    id: manifest.id,
    subject,
    title: manifest.title,
    desc,
    status,
    boss: Boolean(manifest.bossTitle),
    tracks: manifest.tracks ?? {},
    units: manifest.units.map(({ id, title, track }) => (track ? { id, title, track } : { id, title }))
  };
}

/** Liste aller Apps in der Reihenfolge von catalog.order. */
export function buildCatalog(manifests) {
  return manifests
    .filter((manifest) => manifest.catalog)
    .sort((a, b) => a.catalog.order - b.catalog.order)
    .map(catalogEntry);
}
