import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';

// Jeder Test bekommt eine frische, leere Datenbank.
beforeEach(async () => {
  globalThis.indexedDB = new IDBFactory();
  globalThis.localStorage = undefined;
  (await import('../core/js/db.js')).resetDBForTests();
});

const { createStore, deepMerge } = await import('../core/js/store.js');
const db = await import('../core/js/db.js');

test('deepMerge ergänzt neue Standardfelder und behält unbekannte', () => {
  const merged = deepMerge({ a: 1, n: { x: 1, y: 2 } }, { n: { x: 9 }, extra: true });
  assert.deepEqual(merged, { a: 1, n: { x: 9, y: 2 }, extra: true });
});

test('Store speichert in IndexedDB und lädt wieder', async () => {
  const a = await createStore('lernwerkstatt:t', { xp: 0, stars: {} });
  assert.equal(a.backend, 'indexeddb');
  a.state.xp = 12; a.state.stars.x = 3;
  a.save();
  await new Promise((r) => setTimeout(r, 20));
  db.resetDBForTests();
  const b = await createStore('lernwerkstatt:t', { xp: 0, stars: {} });
  assert.equal(b.state.xp, 12);
  assert.equal(b.state.stars.x, 3);
});

test('Altes Schema bekommt neue Felder, unbekannte bleiben', async () => {
  const a = await createStore('lernwerkstatt:s', { xp: 0 });
  a.state.alt = 'bleibt'; a.save();
  await new Promise((r) => setTimeout(r, 20));
  db.resetDBForTests();
  const b = await createStore('lernwerkstatt:s', { xp: 0, neu: { feld: 1 } });
  assert.equal(b.state.alt, 'bleibt');
  assert.deepEqual(b.state.neu, { feld: 1 });
});

test('Migration läuft bei neuer Version', async () => {
  const a = await createStore('lernwerkstatt:m', { punkte: 0 }, { version: 1 });
  a.state.punkte = 5; a.save();
  await new Promise((r) => setTimeout(r, 20));
  db.resetDBForTests();
  const b = await createStore('lernwerkstatt:m', { xp: 0 }, { version: 2, migrate: (old) => ({ xp: old.punkte * 10 }) });
  assert.equal(b.state.xp, 50);
});

test('Reset setzt auf Standard zurück', async () => {
  const a = await createStore('lernwerkstatt:r', { xp: 0 });
  a.state.xp = 9; a.save(); a.reset();
  assert.equal(a.state.xp, 0);
});

test('Protokoll, Export und Import', async () => {
  await db.logEvent({ app: 'x', type: 'round', stars: 3 });
  await db.logEvent({ app: 'y', type: 'round', stars: 1 });
  assert.equal((await db.listEvents({ app: 'x' })).length, 1);
  const s = await createStore('lernwerkstatt:e', { xp: 0 });
  s.state.xp = 7; s.save();
  await new Promise((r) => setTimeout(r, 20));
  const backup = await db.exportAll();
  assert.equal(backup.docs['lernwerkstatt:e'].xp, 7);
  assert.equal(backup.log.length, 2);

  globalThis.indexedDB = new IDBFactory();
  db.resetDBForTests();
  await db.importAll(JSON.parse(JSON.stringify(backup)));
  const again = await createStore('lernwerkstatt:e', { xp: 0 });
  assert.equal(again.state.xp, 7);
  assert.equal((await db.listEvents()).length, 2);
  await assert.rejects(() => db.importAll({ nope: 1 }));
});

test('Ohne IndexedDB und ohne localStorage läuft die App im Arbeitsspeicher weiter', async () => {
  globalThis.indexedDB = undefined;
  db.resetDBForTests();
  const s = await createStore('lernwerkstatt:f', { xp: 0 });
  assert.equal(s.backend, 'localstorage');
  s.state.xp = 3; s.save();
  assert.equal(s.state.xp, 3);
});
