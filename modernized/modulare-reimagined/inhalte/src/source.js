// Inhaltsquellen: liefern ein Bundle { manifest, lessons, badges, data } für eine App-Kennung.
// Legacy-Vorlage: core/js/content.js:12-44. Die Quelle nimmt die fetch-Funktion als Argument. Sie
// greift nie auf das globale fetch zu, damit Tests und andere Laufzeiten ohne Netz auskommen.
import { assertBundle } from './bundle.js';

const PARTS = [['manifest', true], ['lessons', true], ['badges', true], ['data', false]];
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Prüft die App-Kennung, bevor sie in eine URL wandert. Ohne Prüfung könnte "../" andere Pfade
 * anfassen (legacy content.js:27 setzte die Kennung ungeprüft in die URL).
 */
export function assertAppId(appId) {
  if (typeof appId !== 'string' || !ID.test(appId)) throw new Error(`Ungültige App-Kennung: ${String(appId)}`);
  return appId;
}

function requireFetch(fetchFn) {
  if (typeof fetchFn !== 'function') throw new Error('Inhaltsquelle braucht eine fetch-Funktion (injiziert, kein globales fetch)');
}

async function getJSON(fetchFn, url, required) {
  const response = await fetchFn(url);
  if (!response.ok) {
    if (!required) return undefined;
    throw new Error(`Inhalt nicht gefunden: ${url} (${response.status})`);
  }
  return response.json();
}

/** JSON-Dateien: <baseUrl>/<appId>/manifest.json, lessons.json, badges.json, data.json (optional). */
export function createStaticSource(baseUrl, fetchFn) {
  requireFetch(fetchFn);
  const base = String(baseUrl).replace(/\/?$/, '/');
  return {
    name: 'static',
    async load(appId) {
      assertAppId(appId);
      const [manifest, lessons, badges, data] = await Promise.all(
        PARTS.map(([part, required]) => getJSON(fetchFn, `${base}${appId}/${part}.json`, required))
      );
      return assertBundle({ manifest, lessons, badges, data: data ?? {} });
    }
  };
}

/**
 * API: GET <baseUrl>/apps/<appId>/content liefert das Bundle als JSON (legacy content.js:34-41).
 * Der Zugangsschlüssel kommt als Bearer-Kopf, nie in die URL, damit er nicht in Logs oder im
 * Browser-Verlauf landet. Der Aufrufer liest ihn aus der Umgebung, dieses Modul kennt keinen Speicher dafür.
 */
export function createHttpSource(baseUrl, apiKey, fetchFn) {
  requireFetch(fetchFn);
  if (typeof apiKey !== 'string' || apiKey === '') throw new Error('Zugangsschlüssel für die Inhalte-API fehlt');
  const base = String(baseUrl).replace(/\/$/, '');
  return {
    name: 'http',
    async load(appId) {
      assertAppId(appId);
      const response = await fetchFn(`${base}/apps/${encodeURIComponent(appId)}/content`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` }
      });
      // Die Fehlermeldung nennt nur den Status, nie den Schlüssel.
      if (!response.ok) throw new Error(`Inhalte nicht erreichbar (${response.status})`);
      return assertBundle(await response.json());
    }
  };
}
