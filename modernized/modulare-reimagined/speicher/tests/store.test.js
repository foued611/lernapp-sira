// Tests für den Dokumentspeicher: Laden, Speichern, Zurücksetzen, Versionen, Schutz vor Überschreiben.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  KEY, defaults, resetDatabase, openTestStore, writeRawRow, fakeStorage, faultyIndexedDB
} from './helpers.js';

test('RULE-197 gespeicherter Fortschritt ist nach einem Neustart vorhanden', async (t) => {
  await resetDatabase();
  const first = await openTestStore(t);
  const store = await first.createStore(KEY, defaults());
  store.state.xp = 40;
  store.state.stars.u1 = 2;
  assert.deepEqual(await store.save(), { ok: true });
  await first.close();

  const second = await openTestStore(t);
  const again = await second.createStore(KEY, defaults());
  assert.equal(again.backend, 'indexeddb');
  assert.equal(again.state.xp, 40);
  assert.equal(again.state.stars.u1, 2);
});

test('RULE-197 Zurücksetzen stellt die Standardwerte her, auch nach einem Neustart', async (t) => {
  await resetDatabase();
  const first = await openTestStore(t);
  const store = await first.createStore(KEY, defaults());
  store.state.xp = 40;
  await store.save();
  assert.deepEqual(await store.reset(), { ok: true });
  assert.deepEqual(store.state, defaults());
  await first.close();

  const second = await openTestStore(t);
  assert.equal((await second.createStore(KEY, defaults())).state.xp, 0);
});

test('RULE-207 unbekannte Felder bleiben beim Laden und beim Speichern erhalten', async (t) => {
  await resetDatabase();
  await writeRawRow(KEY, { xp: 40, zukunft: { punkte: 3 }, __v: 1 });
  const handle = await openTestStore(t);
  const store = await handle.createStore(KEY, defaults());
  assert.equal(store.state.zukunft.punkte, 3);
  await store.save();
  const { docs } = await handle.exportAll();
  assert.equal(docs[KEY].zukunft.punkte, 3);
});

test('RULE-207 neue Standardfelder kommen beim Laden dazu, auch verschachtelt', async (t) => {
  await resetDatabase();
  await writeRawRow(KEY, { xp: 40, day: { d: '2026-10-01' }, __v: 1 });
  const handle = await openTestStore(t);
  const withNew = () => ({ ...defaults(), neu: { x: 7 } });
  const store = await handle.createStore(KEY, withNew());
  assert.equal(store.state.xp, 40);
  assert.equal(store.state.day.d, '2026-10-01');
  assert.equal(store.state.day.xp, 0, 'fehlendes verschachteltes Feld kommt aus den Standardwerten');
  assert.equal(store.state.neu.x, 7);
});

test('RULE-207 Migration läuft bei Versionswechsel und setzt die neue Version', async (t) => {
  await resetDatabase();
  await writeRawRow(KEY, { xpAlt: 40, __v: 1 });
  const handle = await openTestStore(t);
  const seen = [];
  const migrate = (old, from) => {
    seen.push(from);
    const { xpAlt, ...rest } = old;
    return { ...rest, xp: xpAlt };
  };
  const store = await handle.createStore(KEY, { xp: 0 }, { version: 2, migrate });
  assert.deepEqual(seen, [1]);
  assert.equal(store.state.xp, 40);
  assert.equal(store.state.xpAlt, undefined);
  await store.save();
  const { docs } = await handle.exportAll();
  assert.equal(docs[KEY].__v, 2);
  assert.equal(docs[KEY].xpAlt, undefined);
});

test('RULE-135 ein gespeicherter Nicht-Objekt-Wert wird zuerst gesichert, dann startet die App mit Standardwerten', async (t) => {
  await resetDatabase();
  await writeRawRow(KEY, [1, 2, 3]);
  const handle = await openTestStore(t);
  const store = await handle.createStore(KEY, defaults());
  assert.deepEqual(store.state, defaults());
  assert.equal(store.recovered.reason, 'not-object');
  assert.match(store.recovered.backupKey, /^lernwerkstatt:rohdaten:lernwerkstatt:profile:\d+$/);
  const { docs } = await handle.exportAll();
  assert.equal(docs[store.recovered.backupKey].raw, '[1,2,3]');
});

test('RULE-135 unlesbares JSON im localStorage wird als Rohtext gesichert, das Original bleibt bis zum Speichern stehen', async (t) => {
  const storage = fakeStorage();
  storage.setItem(KEY, '{nicht json');
  const handle = await openTestStore(t, { indexedDB: null, localStorage: storage });
  assert.equal(handle.backend, 'localstorage');
  const store = await handle.createStore(KEY, defaults());
  assert.equal(store.recovered.reason, 'unreadable');
  const { docs } = await handle.exportAll();
  assert.equal(docs[store.recovered.backupKey].raw, '{nicht json');
  assert.equal(storage.getItem(KEY), '{nicht json');
});

test('RULE-135 ohne gesicherte Kopie wird das Original nicht überschrieben', async (t) => {
  await resetDatabase();
  await writeRawRow(KEY, [1, 2, 3]);
  const failing = faultyIndexedDB({
    put: (name, row) => {
      if (row.key.startsWith('lernwerkstatt:rohdaten:')) throw new Error('Schreibfehler');
    }
  });
  const handle = await openTestStore(t, { indexedDB: failing });
  const store = await handle.createStore(KEY, defaults());
  assert.equal(store.blocked.reason, 'raw-backup-failed');
  assert.equal((await store.save()).ok, false);
  const { skipped, docs } = await handle.exportAll();
  assert.ok(skipped.includes(KEY), 'der Original-Eintrag ist noch da');
  assert.equal(Object.keys(docs).length, 0);
});

test('SCHULD-1 ein fehlgeschlagener Lesezugriff sperrt das Speichern, der gespeicherte Stand bleibt erhalten', async (t) => {
  await resetDatabase();
  const seed = await openTestStore(t);
  const seeded = await seed.createStore(KEY, defaults());
  seeded.state.xp = 40;
  await seeded.save();
  await seed.close();

  const failing = faultyIndexedDB({
    get: (name, key) => {
      if (key === KEY) throw new Error('Lesefehler');
    }
  });
  const faulty = await openTestStore(t, { indexedDB: failing });
  const store = await faulty.createStore(KEY, defaults());
  assert.equal(store.blocked.reason, 'read-failed');
  const result = await store.save();
  assert.equal(result.ok, false);
  await faulty.close();

  const check = await openTestStore(t);
  assert.equal((await check.createStore(KEY, defaults())).state.xp, 40);
});

test('SCHULD-1 eine fehlgeschlagene Migration überschreibt den gespeicherten Stand nicht', async (t) => {
  await resetDatabase();
  const seed = await openTestStore(t);
  const seeded = await seed.createStore(KEY, defaults());
  seeded.state.xp = 40;
  await seeded.save();
  await seed.close();

  const handle = await openTestStore(t);
  const store = await handle.createStore(KEY, defaults(), {
    version: 2,
    migrate: () => {
      throw new Error('Umstellung kaputt');
    }
  });
  assert.equal(store.blocked.reason, 'migration-failed');
  const result = await store.save();
  assert.equal(result.ok, false);
  await handle.close();

  const check = await openTestStore(t);
  const { docs } = await check.exportAll();
  assert.equal(docs[KEY].xp, 40);
  assert.equal(docs[KEY].__v, 1);
});

test('SCHULD-1 ein fehlgeschlagenes Schreiben wird von save() gemeldet, nicht verschluckt', async (t) => {
  await resetDatabase();
  const failing = faultyIndexedDB({
    put: (name, row) => {
      if (row.key === KEY) throw new Error('Speicher voll');
    }
  });
  const handle = await openTestStore(t, { indexedDB: failing });
  const store = await handle.createStore(KEY, defaults());
  store.state.xp = 5;
  const result = await store.save();
  assert.equal(result.ok, false);
  assert.match(result.error, /nicht gespeichert/);
});
