// Tests für den Altstand im localStorage (RULE-187) und die Reihenfolge von Schreiben und Löschen (SCHULD-2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KEY, defaults, resetDatabase, openTestStore, fakeStorage, faultyIndexedDB } from './helpers.js';

test('RULE-187 Altstand aus localStorage wird in IndexedDB übernommen, Version bleibt, der alte Eintrag wird entfernt', async (t) => {
  await resetDatabase();
  const legacy = fakeStorage();
  legacy.setItem(KEY, JSON.stringify({ xp: 40, stars: { u1: 1 }, __v: 1 }));
  const handle = await openTestStore(t, { localStorage: legacy });
  assert.equal(handle.backend, 'indexeddb');
  const store = await handle.createStore(KEY, defaults());
  assert.equal(store.state.xp, 40);
  assert.equal(store.state.stars.u1, 1);
  assert.equal(legacy.getItem(KEY), null);
  const { docs } = await handle.exportAll();
  assert.equal(docs[KEY].xp, 40);
  assert.equal(docs[KEY].__v, 1);
});

test('RULE-187 scheitert das Schreiben in IndexedDB, bleibt der Altstand im localStorage und wird beim nächsten Speichern übernommen', async (t) => {
  await resetDatabase();
  const legacy = fakeStorage();
  legacy.setItem(KEY, JSON.stringify({ xp: 40, __v: 1 }));
  let failuresLeft = 1;
  const flaky = faultyIndexedDB({
    put: (name, row) => {
      if (row.key === KEY && failuresLeft > 0) {
        failuresLeft -= 1;
        throw new Error('Schreibfehler');
      }
    }
  });
  const handle = await openTestStore(t, { indexedDB: flaky, localStorage: legacy });
  const store = await handle.createStore(KEY, defaults());
  assert.equal(store.state.xp, 40, 'der Fortschritt ist trotzdem da');
  assert.notEqual(legacy.getItem(KEY), null, 'der Altstand wird nicht gelöscht, solange das Schreiben fehlschlägt');

  assert.deepEqual(await store.save(), { ok: true });
  assert.equal(legacy.getItem(KEY), null);
});
