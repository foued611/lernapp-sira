// Legacy-Daten: die neue Datenschicht liest, was der alte Code geschrieben hat.
// Die Fixture entsteht aus dem Legacy-Klon (analysis/modulare/fixtures/make_legacy_fixture.mjs).
// Der Name darin ist erfunden.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IDBFactory } from 'fake-indexeddb';
import { openStore } from '../index.js';
import { blobOf } from './helpers.js';

const hier = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const lade = (name) => JSON.parse(readFileSync(join(hier, name), 'utf8'));
const dump = lade('legacy-idb-dump.json');
const backup = lade('legacy-backup.json');
const expected = lade('expected.json');

// Standardwerte wie beim Erzeugen der Fixture. Die neue Datenschicht ergänzt damit fehlende Felder.
const PROFILE_DEFAULTS = { name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } };
const APP_DEFAULTS = { xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {} };

// Ereignisse ohne die vergebene id vergleichen, die Legacy und Neubau unterschiedlich ausgeben können.
const ohneId = ({ id, ...rest }) => rest;

// Schema wie in legacy/modulare/core/js/db.js (upgrade()). Der Test prüft, dass die neue Datenschicht genau dieses Layout liest.
function legacyDatenbank(factory, daten) {
  return new Promise((resolve, reject) => {
    const open = factory.open('lernwerkstatt', 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      db.createObjectStore('docs', { keyPath: 'key' });
      const log = db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
      log.createIndex('app', 'app');
      log.createIndex('ts', 'ts');
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(['docs', 'log'], 'readwrite');
      for (const doc of daten.docs) tx.objectStore('docs').put(doc);
      for (const row of daten.log) tx.objectStore('log').put(row);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
    open.onerror = () => reject(open.error);
  });
}

test('LEGACY-LESEN: Profil und App-Stand aus der Legacy-Datenbank werden feldgenau gelesen', async () => {
  const factory = new IDBFactory();
  await legacyDatenbank(factory, dump);
  const h = await openStore({ indexedDB: factory, localStorage: null });
  assert.equal(h.backend, 'indexeddb');

  const profile = await h.createStore('lernwerkstatt:profile', PROFILE_DEFAULTS);
  const app = await h.createStore('lernwerkstatt:app:mathe', APP_DEFAULTS);
  assert.deepEqual(profile.state, expected.profile);
  assert.deepEqual(app.state, expected.app);
  h.close();
});

test('LEGACY-LESEN: Das Ereignisprotokoll aus der Legacy-Datenbank bleibt vollständig und in Reihenfolge', async () => {
  const factory = new IDBFactory();
  await legacyDatenbank(factory, dump);
  const h = await openStore({ indexedDB: factory, localStorage: null });

  const rows = await h.listEvents({ app: 'mathe', limit: 10 });
  assert.equal(rows.length, expected.logCount);
  assert.deepEqual(rows.map(ohneId), dump.log.map(ohneId));
  h.close();
});

test('LEGACY-SICHERUNG: Eine Sicherung des Legacy-Codes wird vollständig eingespielt', async () => {
  const factory = new IDBFactory();
  const h = await openStore({ indexedDB: factory, localStorage: null });

  const plan = await h.planImport(blobOf(backup));
  assert.equal(plan.ok, true);

  const ergebnis = await h.importAll(blobOf(backup), { confirm: true });
  assert.equal(ergebnis.ok, true);

  const profile = await h.createStore('lernwerkstatt:profile', PROFILE_DEFAULTS);
  const app = await h.createStore('lernwerkstatt:app:mathe', APP_DEFAULTS);
  assert.deepEqual(profile.state, expected.profile);
  assert.deepEqual(app.state, expected.app);

  const rows = await h.listEvents({ app: 'mathe', limit: 10 });
  assert.deepEqual(rows.map(ohneId), backup.log.map(ohneId));
  h.close();
});
