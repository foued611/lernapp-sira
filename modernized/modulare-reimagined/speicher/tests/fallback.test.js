// Tests für die Ausweichstufen: IndexedDB, localStorage, Arbeitsspeicher. Die App muss ohne Speicher laufen (AGENTS.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KEY, defaults, openTestStore, fakeStorage } from './helpers.js';

test('SPEICHER-FALLBACK ohne IndexedDB und localStorage läuft der Speicher im Arbeitsspeicher', async (t) => {
  const handle = await openTestStore(t, { indexedDB: null, localStorage: null });
  assert.equal(handle.backend, 'memory');
  const store = await handle.createStore(KEY, defaults());
  store.state.xp = 12;
  assert.deepEqual(await store.save(), { ok: true });
  assert.equal((await handle.logEvent({ app: 'x', type: 'round', stars: 2 })).ok, true);
  assert.equal((await handle.listEvents()).length, 1);
  const { docs } = await handle.exportAll();
  assert.equal(docs[KEY].xp, 12);
});

test('SPEICHER-FALLBACK wirft IndexedDB beim Öffnen, wird localStorage genutzt und bleibt dort erhalten', async (t) => {
  const storage = fakeStorage();
  const broken = {
    open() {
      throw new Error('IndexedDB gesperrt');
    }
  };
  const first = await openTestStore(t, { indexedDB: broken, localStorage: storage });
  assert.equal(first.backend, 'localstorage');
  const store = await first.createStore(KEY, defaults());
  store.state.xp = 30;
  assert.deepEqual(await store.save(), { ok: true });
  await first.close();

  const second = await openTestStore(t, { indexedDB: broken, localStorage: storage });
  assert.equal((await second.createStore(KEY, defaults())).state.xp, 30);
});

test('SPEICHER-FALLBACK ein localStorage, der nicht schreibt, wird übersprungen und der Arbeitsspeicher gewählt', async (t) => {
  const refusing = fakeStorage({ failWrites: () => true });
  const handle = await openTestStore(t, { indexedDB: null, localStorage: refusing });
  assert.equal(handle.backend, 'memory');
});

test('SPEICHER-FALLBACK ein Schreibfehler nach dem Start wird gemeldet, nicht verschluckt', async (t) => {
  let refuse = false;
  const storage = fakeStorage({ failWrites: () => refuse });
  const handle = await openTestStore(t, { indexedDB: null, localStorage: storage });
  const store = await handle.createStore(KEY, defaults());
  refuse = true;
  const result = await store.save();
  assert.equal(result.ok, false);
  assert.match(result.error, /nicht gespeichert/);
});
