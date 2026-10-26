// Tests für Sicherung: Export, Einspielen mit Bestätigung, Protokoll zusammenführen, Prüfung der Datei.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  KEY, defaults, resetDatabase, openTestStore, faultyIndexedDB, blobOf, backupOf
} from './helpers.js';

const OTHER_APP_KEY = 'lernwerkstatt:app:fr-verben';

async function seed(handle) {
  const profile = await handle.createStore(KEY, defaults());
  profile.state.xp = 5;
  await profile.save();
  const app = await handle.createStore(OTHER_APP_KEY, defaults());
  app.state.xp = 6;
  await app.save();
  await handle.logEvent({ app: 'x', type: 'round', stars: 3 });
  await handle.logEvent({ app: 'y', type: 'round', stars: 1 });
}

test('RULE-256 Export enthält alle Dokumente und alle Ereignisse, Einspielen stellt sie nach einem Löschen wieder her', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  await seed(handle);
  const exported = await handle.exportAll();
  assert.equal(exported.app, 'lernwerkstatt');
  assert.equal(exported.format, 1);
  assert.equal(Object.keys(exported.docs).length, 2);
  assert.equal(exported.log.length, 2);
  await handle.close();

  await resetDatabase();
  const fresh = await openTestStore(t);
  const result = await fresh.importAll(blobOf(exported), { confirm: true });
  assert.equal(result.ok, true);
  const restored = await (await fresh.createStore(KEY, defaults())).state;
  assert.equal(restored.xp, 5);
  assert.equal((await fresh.listEvents({ app: 'x' })).length, 1);
  assert.equal((await fresh.listEvents()).length, 2);
});

test('RULE-256 Export kürzt das Protokoll nicht, auch nicht über 1000 Zeilen', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  const log = Array.from({ length: 1005 }, (_, index) => ({ ts: index + 1, app: 'x', type: 'round', stars: index % 4 }));
  const result = await handle.importAll(blobOf(backupOf({ log })), { confirm: true });
  assert.equal(result.ok, true);
  const exported = await handle.exportAll();
  assert.equal(exported.log.length, 1005);
});

test('RULE-256 fremde Dateien werden mit Meldung abgelehnt, ohne etwas zu schreiben', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  await seed(handle);
  const foreign = [
    { nope: 1 },
    { app: 'andere-app', format: 1, docs: { [KEY]: { xp: 99 } } },
    { app: 'lernwerkstatt', format: 2, docs: { [KEY]: { xp: 99 } } }
  ];
  for (const file of foreign) {
    const result = await handle.importAll(blobOf(file), { confirm: true });
    assert.equal(result.ok, false);
    assert.equal(typeof result.error, 'string');
  }
  const { docs } = await handle.exportAll();
  assert.equal(docs[KEY].xp, 5);
});

test('RULE-256 Dateien über 20 MB werden abgelehnt, ohne sie zu lesen', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  let read = false;
  const big = {
    size: 20 * 1024 * 1024 + 1,
    text: async () => {
      read = true;
      return '{}';
    }
  };
  const result = await handle.importAll(big, { confirm: true });
  assert.equal(result.ok, false);
  assert.match(result.error, /zu groß/);
  assert.equal(read, false);
});

test('RULE-126 der Plan zeigt die Änderungen und schreibt nichts', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  await seed(handle);
  const backup = backupOf({
    docs: { [KEY]: { xp: 99, __v: 1 } },
    log: [{ ts: 5, app: 'c', type: 'round', stars: 2 }]
  });
  const result = await handle.planImport(blobOf(backup));
  assert.equal(result.ok, true);
  assert.deepEqual(result.plan.docs, [{ key: KEY, status: 'replaced' }]);
  assert.equal(result.plan.logNew, 1);
  assert.equal(result.plan.logDuplicates, 0);
  const { docs, log } = await handle.exportAll();
  assert.equal(docs[KEY].xp, 5);
  assert.equal(log.length, 2);
});

test('RULE-126 Einspielen ohne Bestätigung schreibt nichts und verlangt die Bestätigung', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  await seed(handle);
  const result = await handle.importAll(blobOf(backupOf({ docs: { [KEY]: { xp: 99 } } })));
  assert.equal(result.ok, false);
  assert.equal(result.needsConfirm, true);
  assert.equal((await handle.exportAll()).docs[KEY].xp, 5);
});

test('RULE-126 Einspielen führt das Protokoll zusammen, Dokumente außerhalb der Sicherung bleiben', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  await seed(handle);
  const [existingX] = await handle.listEvents({ app: 'x' });
  const backup = backupOf({
    docs: { [KEY]: { xp: 9, __v: 1 } },
    log: [existingX, { ts: 5, app: 'c', type: 'round', stars: 2 }]
  });
  const result = await handle.importAll(blobOf(backup), { confirm: true });
  assert.equal(result.ok, true);
  const { docs, log } = await handle.exportAll();
  assert.equal(log.length, 3, 'zwei vorhandene und eine neue Zeile, die bekannte Zeile zählt nicht doppelt');
  assert.equal(docs[KEY].xp, 9);
  assert.equal(docs[OTHER_APP_KEY].xp, 6, 'nicht in der Sicherung, also unverändert');
});

test('RULE-126 dieselbe Sicherung zweimal eingespielt ergibt keine doppelten Ereignisse', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  const backup = backupOf({ log: [{ ts: 1, app: 'x', type: 'round', stars: 3 }, { ts: 2, app: 'y', type: 'round', stars: 1 }] });
  await handle.importAll(blobOf(backup), { confirm: true });
  await handle.importAll(blobOf(backup), { confirm: true });
  assert.equal((await handle.listEvents()).length, 2);
});

test('SEC-001 Dokumentschlüssel ohne Präfix werden abgelehnt, nichts wird geschrieben', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  const file = backupOf({ docs: { evil: { a: 1 }, [KEY]: { xp: 99 } } });
  const result = await handle.importAll(blobOf(file), { confirm: true });
  assert.equal(result.ok, false);
  assert.equal((await handle.exportAll()).docs[KEY], undefined);
});

test('SEC-001 Dokumentwerte müssen Objekte sein', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  for (const value of ['text', [1, 2], null, 42]) {
    const result = await handle.importAll(blobOf(backupOf({ docs: { [KEY]: value } })), { confirm: true });
    assert.equal(result.ok, false, `Wert ${JSON.stringify(value)} muss abgelehnt werden`);
  }
  assert.deepEqual((await handle.exportAll()).docs, {});
});

test('SEC-001 Protokollzeilen mit falschen Feldtypen werden abgelehnt, nichts wird geschrieben', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  const badRows = [
    { ts: '2026', app: 'x', type: 'round' },
    { ts: 1, app: 7, type: 'round' },
    { ts: 1, app: 'x', type: 'round', stars: 'drei' },
    { ts: 1, app: 'x', type: 'round', failed: 'ja' },
    { ts: 1, app: 'x', type: 'round', extra: { verschachtelt: true } }
  ];
  for (const row of badRows) {
    const result = await handle.importAll(blobOf(backupOf({ docs: { [KEY]: { xp: 99 } }, log: [row] })), { confirm: true });
    assert.equal(result.ok, false, `Zeile ${JSON.stringify(row)} muss abgelehnt werden`);
  }
  const { docs, log } = await handle.exportAll();
  assert.equal(docs[KEY], undefined);
  assert.equal(log.length, 0);
});

test('SEC-001 Feldnamen __proto__ in einer Datei werden abgelehnt', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  const text = '{"app":"lernwerkstatt","format":1,"docs":{"lernwerkstatt:profile":{"__proto__":{"admin":true},"xp":1}}}';
  const result = await handle.importAll(new Blob([text]), { confirm: true });
  assert.equal(result.ok, false);
  assert.equal((await handle.exportAll()).docs[KEY], undefined);
});

test('SEC-001 logEvent lehnt Zeilen ab, die der Import ablehnen würde', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  const bad = await handle.logEvent({ app: 'x', type: 'round', stars: { drei: 3 } });
  assert.equal(bad.ok, false);
  const good = await handle.logEvent({ app: 'x', type: 'round', stars: 3 });
  assert.equal(good.ok, true);
  assert.equal((await handle.listEvents()).length, 1);
});

test('SCHULD-3 eine ungültige Protokollzeile bricht ab, bevor auch nur ein Dokument geschrieben wird', async (t) => {
  await resetDatabase();
  const handle = await openTestStore(t);
  await seed(handle);
  const file = backupOf({
    docs: { [KEY]: { xp: 99 } },
    log: [{ ts: 1, app: 'x', type: 'round' }, null]
  });
  const result = await handle.importAll(blobOf(file), { confirm: true });
  assert.equal(result.ok, false);
  const { docs, log } = await handle.exportAll();
  assert.equal(docs[KEY].xp, 5);
  assert.equal(log.length, 2);
});

test('SCHULD-3 ein Fehler mitten im Schreiben lässt Dokumente und Protokoll unverändert', async (t) => {
  await resetDatabase();
  const seeded = await openTestStore(t);
  await seed(seeded);
  await seeded.close();

  const failing = faultyIndexedDB({
    add: (name, row) => {
      if (name === 'log' && row.app === 'boom') throw new Error('Schreibfehler');
    }
  });
  const handle = await openTestStore(t, { indexedDB: failing });
  const file = backupOf({
    docs: { [KEY]: { xp: 99 } },
    log: [{ ts: 1, app: 'ok', type: 'round' }, { ts: 2, app: 'boom', type: 'round' }]
  });
  const result = await handle.importAll(blobOf(file), { confirm: true });
  assert.equal(result.ok, false);
  await handle.close();

  const check = await openTestStore(t);
  const { docs, log } = await check.exportAll();
  assert.equal(docs[KEY].xp, 5);
  assert.equal(log.length, 2);
});

test('SCHULD-3 das Einspielen läuft in genau einer readwrite-Transaktion', async (t) => {
  await resetDatabase();
  const modes = [];
  const observed = faultyIndexedDB({
    transaction: (names, mode) => {
      if (mode === 'readwrite') modes.push(names.join(','));
    }
  });
  const handle = await openTestStore(t, { indexedDB: observed });
  const file = backupOf({ docs: { [KEY]: { xp: 1 } }, log: [{ ts: 1, app: 'x', type: 'round' }] });
  const result = await handle.importAll(blobOf(file), { confirm: true });
  assert.equal(result.ok, true);
  assert.deepEqual(modes, ['docs,log']);
});
