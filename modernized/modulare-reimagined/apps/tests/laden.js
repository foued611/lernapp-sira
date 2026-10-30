// Lädt ein Inhaltspaket aus content/ für Tests (dieselben Dateien, die der Browser per fetch holt).
// Liegt im Ordner tests/, damit der Testlauf sie nicht als Testdatei findet.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalog } from '../../inhalte/index.js';
import { loadLogic, logicIds } from '../index.js';

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', 'content');

const lese = (id, datei) => JSON.parse(readFileSync(join(CONTENT, id, datei), 'utf8'));

/** Paket { manifest, lessons, badges, data } der App mit dieser Kennung. */
export function paketVon(id) {
  return {
    manifest: lese(id, 'manifest.json'),
    lessons: lese(id, 'lessons.json'),
    badges: lese(id, 'badges.json'),
    data: lese(id, 'data.json')
  };
}

/** Der Katalog aus den Manifesten, wie katalog.mjs ihn schreibt. */
export const APPS = buildCatalog(
  readdirSync(CONTENT, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => lese(e.name, 'manifest.json'))
);

// Tests greifen synchron auf die Logik zu. Sie wird hier einmal vorab geladen.
const LOGIK = Object.fromEntries(await Promise.all(logicIds().map(async (id) => [id, await loadLogic(id)])));

/** Logik der App, schon geladen. */
export const logicFor = (id) => LOGIK[id] ?? {};
