// Kleine Helfer ohne Abhängigkeiten: Typprüfung, Kopie, Zusammenführen mit Standardwerten.

export const isPlain = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Kopie über JSON. Der Zustand wird so von der Kopie im Speicher getrennt, wie es der gespeicherte Stand ohnehin ist.
export const clone = (value) => JSON.parse(JSON.stringify(value));

// Gleiche Werte ergeben immer den gleichen Text, unabhängig von der Reihenfolge der Schlüssel.
// Gebraucht, um dieselbe Protokollzeile beim Einspielen zu erkennen (RULE-126).
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (isPlain(value)) {
    const parts = Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`);
    return `{${parts.join(',')}}`;
  }
  return JSON.stringify(value);
}

// Gespeicherte Felder gewinnen über die Standardwerte, auch in verschachtelten Objekten (store.js:10-16).
// Ein Schlüssel "__proto__" aus einer Datei würde sonst den Prototyp des Ergebnisses ändern. Er wird übersprungen.
export function deepMerge(base, data) {
  const out = { ...base };
  for (const [key, value] of Object.entries(data)) {
    if (key === '__proto__') continue;
    out[key] = isPlain(value) && isPlain(base[key]) ? deepMerge(base[key], value) : value;
  }
  return out;
}
