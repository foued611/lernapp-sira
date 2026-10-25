// Startet eine App: Inhalte laden, Konfiguration bauen, Shell einhängen. Jede App ruft nur bootApp() auf.
// Inhaltsquelle: standardmäßig die JSON-Dateien in content/. Soll später eine Datenbank-API liefern, genügt im HTML
//   <meta name="lw-content-api" content="https://…">
// Dann werden die Inhalte von dort geholt und lokal zwischengespeichert (offline nutzbar).
import { createStaticSource, createHttpSource, withCache } from './content.js';
import { buildConfig } from './appconfig.js';
import { mountApp } from './shell.js';
import { esc } from './ui.js';

export function defaultSource(doc = document, loc = location) {
  const api = doc.querySelector('meta[name="lw-content-api"]');
  const local = createStaticSource(new URL('../../content/', loc.href).href);
  return api && api.content ? withCache(createHttpSource(api.content)) : local;
}

/** @param {{id:string, logic:object, source?:object}} o */
export async function bootApp({ id, logic, source = defaultSource() }) {
  const header = document.getElementById('hdr'), main = document.getElementById('app');
  try {
    const bundle = await source.load(id);
    await mountApp(buildConfig(bundle, logic), { header, main });
  } catch (error) {
    main.innerHTML = `<section class="card" style="padding:24px"><h1>Das hat nicht geklappt</h1><p>Die Inhalte konnten nicht geladen werden. Prüfe die Verbindung und lade die Seite neu.</p><p class="muted" style="font-size:13px">${esc(error.message)}</p></section>`;
    console.error(error);
  }
}
