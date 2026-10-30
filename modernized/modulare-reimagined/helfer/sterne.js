// Sterne einer Seite aus dem gespeicherten Stand. Liegt hier, weil Ablauf und Oberfläche dieselbe Prüfung brauchen.

/** Sterne einer Seite. Fehlt der Eintrag oder ist er keine ganze Zahl, sind es 0. */
export const starsOf = (stars, id) =>
  stars && Object.hasOwn(stars, id) && Number.isInteger(stars[id]) ? stars[id] : 0;
