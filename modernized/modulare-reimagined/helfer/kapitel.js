// Kapitel des Lernpfads. Die Liste groups im Manifest gibt die Reihenfolge vor, die Seiten verweisen per group darauf.

/** Seiten je Kapitel, in der Reihenfolge von groups. Ohne groups eine Liste ohne Überschrift. */
export function pathGroups(units, groups = []) {
  if (!groups.length) return [{ id: null, title: null, units }];
  return groups.map(({ id, title, klasse }) => ({ id, title, klasse, units: units.filter((u) => u.group === id) }));
}

/** Seiten in der Reihenfolge des Lernpfads. Sie kann vom Manifest abweichen: Neue Seiten stehen dort immer hinten. */
export const unitsInPath = (units, groups = []) => pathGroups(units, groups).flatMap((group) => group.units);
