// Inhaltsquellen: Woher kommen Seiten, Lektionen, Trophäen und Aufgabenpools einer App?
//
// Eine Quelle ist ein Objekt { name, load(appId) → Promise<Bundle> }. Ein Bundle hat immer dieselbe Form:
//   { manifest, lessons, badges, data }     (siehe schemas/bundle.schema.json und docs/inhalte.md)
// Heute liefert createStaticSource die JSON-Dateien aus content/<appId>/. Später kann createHttpSource
// dieselbe Form aus einer Datenbank-API holen. Die Apps merken davon nichts.
import { getDB } from './db.js';
import { assertBundle } from './validate.js';

const PARTS = [['manifest', true], ['lessons', true], ['badges', true], ['data', false]];

async function getJSON(fetchFn, url, required) {
  const response = await fetchFn(url);
  if (!response.ok) {
    if (!required) return undefined;
    throw new Error(`Inhalt nicht gefunden: ${url} (${response.status})`);
  }
  return response.json();
}

/** JSON-Dateien: <baseUrl>/<appId>/manifest.json, lessons.json, badges.json, data.json (optional). */
export function createStaticSource(baseUrl, fetchFn = (...args) => fetch(...args)) {
  const base = String(baseUrl).replace(/\/?$/, '/');
  return {
    name: 'static',
    async load(appId) {
      const [manifest, lessons, badges, data] = await Promise.all(PARTS.map(([part, required]) => getJSON(fetchFn, `${base}${appId}/${part}.json`, required)));
      return assertBundle({ manifest, lessons, badges, data: data || {} });
    }
  };
}

/** API: GET <apiUrl>/apps/<appId>/content liefert das Bundle als JSON. Für eine spätere Datenbank. */
export function createHttpSource(apiUrl, fetchFn = (...args) => fetch(...args), headers = {}) {
  const base = String(apiUrl).replace(/\/$/, '');
  return {
    name: 'http',
    async load(appId) {
      const response = await fetchFn(`${base}/apps/${encodeURIComponent(appId)}/content`, { headers: { Accept: 'application/json', ...headers } });
      if (!response.ok) throw new Error(`Inhalte nicht erreichbar (${response.status})`);
      return assertBundle(await response.json());
    }
  };
}

/**
 * Legt jedes erfolgreich geladene Bundle lokal ab (IndexedDB) und liefert es bei fehlendem Netz von dort.
 * So bleibt die App offline nutzbar, auch wenn die Inhalte aus einer Datenbank kommen.
 */
export function withCache(source, storage = { get: async (k) => (await getDB()).get(k), put: async (k, v) => (await getDB()).put(k, v) }) {
  const key = (appId) => `lernwerkstatt:content:${appId}`;
  return {
    name: `${source.name}+cache`,
    async load(appId) {
      try {
        const bundle = await source.load(appId);
        try { await storage.put(key(appId), bundle); } catch (error) { /* Cache ist optional */ }
        return bundle;
      } catch (error) {
        let cached;
        try { cached = await storage.get(key(appId)); } catch (e) { /* weiter */ }
        if (cached) return assertBundle(cached);
        throw error;
      }
    }
  };
}
