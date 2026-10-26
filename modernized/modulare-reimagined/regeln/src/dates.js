// Kalendertage als Zeichenkette 'YYYY-MM-DD'. Die Regeln bekommen den Tag von außen,
// damit sie nie die Uhr lesen. So bleiben sie in Tests fest und ohne Browser prüfbar.

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 864e5;

/** Wirft einen Fehler, wenn der Tag nicht im Format YYYY-MM-DD vorliegt. */
export function assertDay(day) {
  if (typeof day !== 'string' || !DAY_PATTERN.test(day)) {
    throw new TypeError(`Ungültiger Tag (erwartet YYYY-MM-DD): ${day}`);
  }
  return day;
}

const toUTC = (day) => {
  const [year, month, date] = assertDay(day).split('-').map(Number);
  return Date.UTC(year, month - 1, date);
};

/**
 * Anzahl Kalendertage von from bis to (negativ, wenn to vor from liegt).
 * Rechnet mit UTC, damit die Sommerzeitumstellung den Abstand nicht um eine Stunde kippt.
 */
export function dayDiff(from, to) {
  return Math.round((toUTC(to) - toUTC(from)) / MS_PER_DAY);
}
