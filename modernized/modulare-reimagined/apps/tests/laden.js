// Lädt ein Inhaltspaket aus content/ für Tests (dieselben Dateien, die der Browser per fetch holt).
// Liegt im Ordner tests/, damit der Testlauf sie nicht als Testdatei findet.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
