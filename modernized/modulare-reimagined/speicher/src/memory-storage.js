// Arbeitsspeicher mit der Form von localStorage. Letzte Stufe, wenn weder IndexedDB noch localStorage nutzbar sind.
// Damit läuft der Speicher-Zweig ohne Sonderweg weiter. Die Daten überleben einen Neuladen nicht.

export function createMemoryStorage() {
  const items = new Map();
  return {
    get length() {
      return items.size;
    },
    key: (index) => [...items.keys()][index] ?? null,
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => {
      items.set(key, String(value));
    },
    removeItem: (key) => {
      items.delete(key);
    }
  };
}
