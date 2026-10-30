// Schreibt content/katalog.json aus den Manifesten. Läuft vor build und dev, damit die Liste nie von Hand gepflegt wird.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCatalog } from './inhalte/index.js';

const ORDNER = 'public/content';
const manifeste = readdirSync(ORDNER, { withFileTypes: true })
  .filter((eintrag) => eintrag.isDirectory())
  .map((eintrag) => JSON.parse(readFileSync(join(ORDNER, eintrag.name, 'manifest.json'), 'utf8')));

writeFileSync(join(ORDNER, 'katalog.json'), JSON.stringify(buildCatalog(manifeste)));
