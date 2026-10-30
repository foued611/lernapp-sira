// Offline-Zwischenspeicher für Bundles (RULE-185). Legacy-Vorlage: core/js/content.js:46-67.
//
// Jedes erfolgreich geladene Paket wird gespeichert. Scheitert das Laden später (etwa ohne Netz), kommt
// das letzte gespeicherte Paket. Ist keines da, reicht der ursprüngliche Fehler weiter.
// Der Speicher wird injiziert (get, put). Der Speicher-Dienst liefert ihn später. Dieses Modul hat
// keinen eigenen Zugriff auf IndexedDB oder localStorage.
import { assertBundle } from './bundle.js';

/** Schlüssel bleibt wie in der Legacy-App. Er steht in gespeicherten Daten und wird nie umbenannt. */
export const cacheKey = (appId) => `lernwerkstatt:content:${appId}`;

const CATALOG_KEY = 'lernwerkstatt:katalog';

/** Hüllt eine Quelle mit dem Zwischenspeicher. cache braucht get(key) und put(key, value). */
export function withCache(source, cache) {
  if (!cache || typeof cache.get !== 'function' || typeof cache.put !== 'function') {
    throw new Error('withCache braucht einen Speicher mit get und put (injiziert)');
  }
  return {
    name: `${source.name}+cache`,
    async catalog() {
      try {
        const list = await source.catalog();
        await Promise.resolve(cache.put(CATALOG_KEY, list)).catch(() => {});
        return list;
      } catch (loadError) {
        const cached = await Promise.resolve().then(() => cache.get(CATALOG_KEY)).catch(() => undefined);
        if (cached === undefined || cached === null) throw loadError;
        return cached;
      }
    },
    async load(appId) {
      const key = cacheKey(appId);
      try {
        // Auch ein frisch geladenes Paket wird geprüft. Ist es ungültig, greift der Rückgriff wie bei einem Netzfehler.
        const bundle = assertBundle(await source.load(appId));
        try {
          await cache.put(key, bundle);
        } catch {
          // Schreibfehler sind hinnehmbar. Die App zeigt das frische Paket trotzdem.
        }
        return bundle;
      } catch (loadError) {
        let cached;
        try {
          cached = await cache.get(key);
        } catch {
          // Lesefehler gilt wie "kein Paket". Der Fehler der Quelle ist die wichtigere Auskunft.
          cached = undefined;
        }
        if (cached === undefined || cached === null) throw loadError;
        // Ein gespeichertes Paket wird erneut geprüft. Ist es ungültig, kommt der Prüfungsfehler.
        return assertBundle(cached);
      }
    }
  };
}
