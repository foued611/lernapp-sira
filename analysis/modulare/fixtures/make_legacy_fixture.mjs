// Erzeugt die Legacy-Fixture. Die Daten schreibt der ALTE Code (legacy/modulare/core/js),
// damit die neue Datenschicht gegen echte Legacy-Daten geprüft wird.
// Der Name ist erfunden. Aufruf: node make_legacy_fixture.mjs <legacy-klon> <ausgabeordner>
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [legacy, out] = process.argv.slice(2);
if (!legacy || !out) {
  console.error('Aufruf: node make_legacy_fixture.mjs <legacy-klon> <ausgabeordner>');
  process.exit(1);
}

// fake-indexeddb kommt aus dem Legacy-Klon, damit nichts Neues installiert wird.
const require = createRequire(join(legacy, 'package.json'));
const { IDBFactory } = require('fake-indexeddb');
globalThis.indexedDB = new IDBFactory();

const load = (rel) => import(pathToFileURL(join(legacy, rel)).href);
const { createStore } = await load('core/js/store.js');
const { logEvent, exportAll } = await load('core/js/db.js');

const PROFILE_DEFAULTS = { name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } };
const APP_DEFAULTS = { xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {} };

const profile = await createStore('lernwerkstatt:profile', PROFILE_DEFAULTS);
Object.assign(profile.state, { name: 'Testkind', xp: 120, streak: 3, lastDay: '2026-10-25', lastApp: 'mathe', day: { d: '2026-10-25', xp: 40 } });
profile.save();

const app = await createStore('lernwerkstatt:app:mathe', APP_DEFAULTS);
Object.assign(app.state, { xp: 120, stars: { 'mathe-1': 3, 'mathe-2': 1 }, badges: { perfekt: true }, best: { blitz: 12 }, last: { 'mathe-1': '2026-10-24' }, acc: { 'mathe-1': 0.9 } });
app.save();

await logEvent({ app: 'mathe', type: 'round', mode: 'lesson', unit: 'mathe-1', accuracy: 0.9, stars: 3, failed: false, xp: 40 });
await logEvent({ app: 'mathe', type: 'round', mode: 'blitz', unit: null, failed: false, score: 12, xp: 20 });

// save() schreibt im Hintergrund. Kurz warten, damit alles in der Datenbank liegt.
await new Promise((resolve) => setTimeout(resolve, 300));

// Rohe Sammlungen lesen, so wie sie im Browser liegen (Schema v1 aus db.js).
function readAll(name) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('lernwerkstatt', 1);
    open.onsuccess = () => {
      const db = open.result;
      const request = db.transaction(name, 'readonly').objectStore(name).getAll();
      request.onsuccess = () => { db.close(); resolve(request.result); };
      request.onerror = () => reject(request.error);
    };
    open.onerror = () => reject(open.error);
  });
}

const dump = { docs: await readAll('docs'), log: await readAll('log') };
const backup = await exportAll();
const expected = {
  profile: { ...PROFILE_DEFAULTS, ...profile.state },
  app: { ...APP_DEFAULTS, ...app.state },
  logCount: dump.log.length,
};

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'legacy-idb-dump.json'), JSON.stringify(dump, null, 2) + '\n');
writeFileSync(join(out, 'legacy-backup.json'), JSON.stringify(backup, null, 2) + '\n');
writeFileSync(join(out, 'expected.json'), JSON.stringify(expected, null, 2) + '\n');
console.log(`docs ${dump.docs.length}, log ${dump.log.length}, backup format ${backup.format}`);
process.exit(0);
