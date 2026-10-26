// Tests für die Reihenfolge der Schreibvorgänge: Altstand erst nach bestätigtem Commit löschen (SCHULD-2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KEY, defaults, resetDatabase, openTestStore, fakeStorage, faultyIndexedDB } from './helpers.js';

test('SCHULD-2 der Altstand wird erst nach dem Commit der IndexedDB-Transaktion entfernt', async (t) => {
  await resetDatabase();
  const events = [];
  const legacy = fakeStorage({ onRemove: (key) => events.push(`ls-remove:${key}`) });
  legacy.setItem(KEY, JSON.stringify({ xp: 40, __v: 1 }));
  const observed = faultyIndexedDB({
    committed: (names, mode) => {
      if (mode === 'readwrite') events.push(`commit:${names.join(',')}`);
    }
  });
  const handle = await openTestStore(t, { indexedDB: observed, localStorage: legacy });
  await handle.createStore(KEY, defaults());
  assert.deepEqual(events, ['commit:docs', `ls-remove:${KEY}`]);
});

test('SCHULD-2 entfernt der Altstand nicht vor dem Schreiben, wenn der Commit fehlschlägt', async (t) => {
  await resetDatabase();
  const legacy = fakeStorage();
  legacy.setItem(KEY, JSON.stringify({ xp: 40, __v: 1 }));
  const failing = faultyIndexedDB({
    put: (name, row) => {
      if (row.key === KEY) throw new Error('Schreibfehler');
    }
  });
  const handle = await openTestStore(t, { indexedDB: failing, localStorage: legacy });
  await handle.createStore(KEY, defaults());
  assert.equal(JSON.parse(legacy.getItem(KEY)).xp, 40);
});
