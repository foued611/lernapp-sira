// Kalendertage als Zeichenkette 'YYYY-MM-DD'. Die Regeln bekommen den Tag von außen,
// damit sie nie die Uhr lesen. So bleiben sie in Tests fest und ohne Browser prüfbar.

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 864e5;

/**
 * Wirft einen Fehler, wenn der Tag nicht im Format YYYY-MM-DD vorliegt oder im Kalender nicht existiert
 * (2026-02-30). Ohne die zweite Prüfung würde Date.UTC still in den nächsten Monat rechnen.
 */
export function assertDay(day) {
  const [year, month, date] = typeof day === 'string' && DAY_PATTERN.test(day) ? day.split('-').map(Number) : [];
  // Date.UTC deutet Jahre 0 bis 99 als 1900 bis 1999, deshalb muss das Jahr selbst ab 1 liegen.
  const exists = year >= 1 && month >= 1 && month <= 12
    && new Date(Date.UTC(year, month - 1, date)).getUTCDate() === date;
  if (!exists) {
    throw new TypeError(`Ungültiger Tag (erwartet YYYY-MM-DD): ${day}`);
  }
  return day;
}

/** Gibt es diesen Tag? Für Werte aus dem Speicher, die nicht zum Absturz führen dürfen. */
export function isDay(day) {
  try {
    assertDay(day);
    return true;
  } catch (error) {
    return false;
  }
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

/** Montag der Woche, in der der Tag liegt, als 'YYYY-MM-DD'. Die Woche läuft Montag bis Sonntag. */
export function weekStart(day) {
  const time = toUTC(day);
  const weekday = new Date(time).getUTCDay(); // Sonntag = 0
  const sinceMonday = (weekday + 6) % 7;
  return new Date(time - sinceMonday * MS_PER_DAY).toISOString().slice(0, 10);
}
