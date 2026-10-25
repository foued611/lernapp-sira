// Speicher auf localStorage: sicher (try/catch), mit Version und Migration.

/**
 * @param {string} key        eindeutiger Schlüssel, z. B. "lernwerkstatt:app:fr-verben"
 * @param {object} defaults   Startzustand; wird bei jedem Laden mit dem Gespeicherten zusammengeführt
 * @param {{version?:number, migrate?:(old:object, fromVersion:number)=>object}} [options]
 */
export function createStore(key, defaults, { version = 1, migrate } = {}) {
  const fresh = () => JSON.parse(JSON.stringify(defaults));

  function read() {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fresh();
      let data = JSON.parse(raw);
      const from = data.__v || 1;
      if (from !== version && migrate) data = migrate(data, from);
      delete data.__v;
      return Object.assign(fresh(), data);
    } catch (error) {
      return fresh();
    }
  }

  const store = {
    state: read(),
    save() {
      try {
        localStorage.setItem(key, JSON.stringify({ ...store.state, __v: version }));
      } catch (error) {
        /* Speicher voll oder gesperrt: die App läuft ohne Speichern weiter. */
      }
    },
    reset() {
      store.state = fresh();
      store.save();
    }
  };
  return store;
}
