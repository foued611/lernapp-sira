// Reproduction of SCHULD-1..3, SEC-001, RULE-126, RULE-187, RULE-256 against the LEGACY code.
// Read-only on legacy/modulare: the legacy modules are imported, never edited.
// Each test asserts the DEFECT CONDITION: PASS = defect occurs in legacy; FAIL = defect not observed.
// Fault injection: IDBObjectStore get/put/add/clear are wrapped in this process; hooks[name] may throw.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const LEGACY = '/Users/dghaies/Sites/lernapp-sira/legacy/modulare';
const require = createRequire(join(LEGACY, 'package.json'));
const { IDBFactory, IDBObjectStore } = require('fake-indexeddb');

const load = (rel) => import(pathToFileURL(join(LEGACY, rel)).href);
const dbMod = await load('core/js/db.js');
const { createStore } = await load('core/js/store.js');
const { getDB, resetDBForTests, exportAll, importAll, logEvent, listEvents } = dbMod;

// --- fault injection and traces ---------------------------------------------
const hooks = {};
const trace = [];
for (const name of ['get', 'put', 'add', 'clear']) {
  const original = IDBObjectStore.prototype[name];
  IDBObjectStore.prototype[name] = function (...args) {
    trace.push(`idb.${name}:${this.name}`);
    if (hooks[name]) hooks[name](this.name, args);
    return original.apply(this, args);
  };
}

const realLocalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
function installLocalStorage() {
  const map = new Map();
  const fake = {
    getItem: (k) => { trace.push(`ls.getItem:${k}`); return map.has(k) ? map.get(k) : null; },
    setItem: (k, v) => { trace.push(`ls.setItem:${k}`); map.set(k, String(v)); },
    removeItem: (k) => { trace.push(`ls.removeItem:${k}`); map.delete(k); },
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
    _map: map
  };
  Object.defineProperty(globalThis, 'localStorage', { value: fake, configurable: true, writable: true });
  return fake;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readRaw(storeName) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('lernwerkstatt', 1);
    open.onsuccess = () => {
      const db = open.result;
      const req = db.transaction(storeName, 'readonly').objectStore(storeName).getAll();
      req.onsuccess = () => { db.close(); resolve(req.result); };
      req.onerror = () => reject(req.error);
    };
    open.onerror = () => reject(open.error);
  });
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  resetDBForTests();
  trace.length = 0;
  for (const k of Object.keys(hooks)) delete hooks[k];
  installLocalStorage();
});

afterEach(() => {
  for (const k of Object.keys(hooks)) delete hooks[k];
  if (realLocalStorageDescriptor) Object.defineProperty(globalThis, 'localStorage', realLocalStorageDescriptor);
  else delete globalThis.localStorage;
});

// --- SCHULD-1 ------------------------------------------------------------------
test('SCHULD-1 store.js:27,42-44,51: failed read or failed migration, then save(), overwrites stored data with defaults; write error is swallowed', async () => {
  const be = await getDB(); // open first, so the probe is not hit by the injected fault

  // (a) failing read
  const keyA = 'lernwerkstatt:app:sch1a';
  await be.put(keyA, { xp: 480, stars: { 'u-1': 3 }, __v: 1 });
  hooks.get = (store) => { if (store === 'docs') throw new Error('injected read failure'); };
  const a = await createStore(keyA, { xp: 0, stars: {} });
  hooks.get = null;
  a.save();
  await sleep(50);
  let row = (await readRaw('docs')).find((r) => r.key === keyA);
  console.log(`OBSERVED SCHULD-1a: after failed read + save(), stored xp=${row.value.xp} stars=${JSON.stringify(row.value.stars)} (seeded xp=480)`);
  assert.equal(row.value.xp, 0, 'defect present: stored 480 overwritten by defaults');

  // (b) failing migration
  const keyB = 'lernwerkstatt:app:sch1b';
  await be.put(keyB, { xp: 300, __v: 1 });
  const b = await createStore(keyB, { xp: 0 }, { version: 2, migrate: () => { throw new Error('injected migration failure'); } });
  b.save();
  await sleep(50);
  row = (await readRaw('docs')).find((r) => r.key === keyB);
  console.log(`OBSERVED SCHULD-1b: after failed migration + save(), stored xp=${row.value.xp} (seeded xp=300)`);
  assert.equal(row.value.xp, 0, 'defect present: stored 300 overwritten by defaults');

  // (c) write error: save() reports nothing, data silently lost
  const keyC = 'lernwerkstatt:app:sch1c';
  const c = await createStore(keyC, { xp: 0 });
  hooks.put = (store) => { if (store === 'docs') throw new Error('injected write failure'); };
  const unhandled = [];
  const onUnhandled = (e) => unhandled.push(e);
  process.on('unhandledRejection', onUnhandled);
  let thrown = null;
  c.state.xp = 50;
  try { c.save(); } catch (e) { thrown = e; }
  await sleep(50);
  process.off('unhandledRejection', onUnhandled);
  hooks.put = null;
  row = (await readRaw('docs')).find((r) => r.key === keyC);
  console.log(`OBSERVED SCHULD-1c: save() threw=${thrown !== null}, unhandled rejections=${unhandled.length}, row stored=${row !== undefined}`);
  assert.equal(thrown, null, 'defect present: save() reports nothing to caller');
  assert.equal(unhandled.length, 0, 'defect present: no error surfaces');
  assert.equal(row, undefined, 'defect present: write silently lost');
});

// --- SCHULD-2 ------------------------------------------------------------------
test('SCHULD-2 db.js:57-59,68-71: legacy localStorage entry is removed before IDB write commits; logReplace clears then re-adds in separate transactions', async () => {
  const ls = installLocalStorage();
  const key = 'lernwerkstatt:app:sch2';
  ls._map.set(key, JSON.stringify({ xp: 77, stars: {} }));
  await getDB();
  hooks.put = (store) => { if (store === 'docs') throw new Error('injected write failure'); };
  const store = await createStore(key, { xp: 0, stars: {} });
  hooks.put = null;
  const legacyStillThere = ls._map.has(key);
  const idbRow = (await readRaw('docs')).find((r) => r.key === key);
  console.log(`OBSERVED SCHULD-2a: in-memory xp=${store.state.xp}, localStorage key still present=${legacyStillThere}, IDB row=${idbRow !== undefined}`);
  assert.equal(legacyStillThere, false, 'defect present: legacy localStorage key removed');
  assert.equal(idbRow, undefined, 'defect present: IDB has no copy of the legacy data');

  // logReplace: clear commits, then the second add fails
  await logEvent({ app: 'old', n: 1 });
  await logEvent({ app: 'old', n: 2 });
  await logEvent({ app: 'old', n: 3 });
  const be = await getDB();
  let adds = 0;
  hooks.add = (storeName) => { if (storeName === 'log' && ++adds === 2) throw new Error('injected add failure'); };
  let rejected = false;
  try { await be.logReplace([{ app: 'new', n: 1 }, { app: 'new', n: 2 }, { app: 'new', n: 3 }]); } catch { rejected = true; }
  hooks.add = null;
  const logRows = await readRaw('log');
  console.log(`OBSERVED SCHULD-2b: logReplace rejected=${rejected}, log rows after=${logRows.length} [${logRows.map((r) => r.app + r.n).join(',')}] (before: 3 old rows)`);
  assert.equal(rejected, true);
  assert.equal(logRows.length, 1, 'defect present: old log cleared, only the first new row remains');
  assert.equal(logRows.some((r) => r.app === 'old'), false, 'defect present: old rows gone');
});

// --- SCHULD-3 ------------------------------------------------------------------
test('SCHULD-3 db.js:126-133: importAll with an invalid log row writes docs, replaces the log, then throws (partial state)', async () => {
  await getDB();
  await logEvent({ app: 'old', n: 1 });
  await logEvent({ app: 'old', n: 2 });
  const backup = {
    app: 'lernwerkstatt', format: 1,
    docs: { 'lernwerkstatt:profile': { name: 'Testkind', xp: 5 } },
    log: [{ app: 'new', ts: 1, n: 1 }, { app: 'new', ts: 2, n: 2 }, null, { app: 'new', ts: 4, n: 4 }]
  };
  let error = null;
  try { await importAll(backup); } catch (e) { error = e; }
  const docs = await readRaw('docs');
  const log = await readRaw('log');
  console.log(`OBSERVED SCHULD-3: importAll error=${error ? error.constructor.name + ': ' + error.message : 'none'}; docs written=${docs.map((r) => r.key).join(',')}; log rows=${log.map((r) => r.app + r.n).join(',')}`);
  assert.ok(error, 'importAll rejects after partial work');
  assert.ok(docs.some((r) => r.key === 'lernwerkstatt:profile'), 'defect present: docs already written');
  assert.deepEqual(log.map((r) => r.app), ['new', 'new'], 'defect present: old log replaced by the first two rows');

  // Brief's example (ts as string) does not fail in IDB: no validation, row accepted silently
  let tsError = null;
  try { await importAll({ app: 'lernwerkstatt', format: 1, docs: {}, log: [{ app: 'new', ts: 'abc' }] }); } catch (e) { tsError = e; }
  console.log(`OBSERVED SCHULD-3 (ts as string): error=${tsError ? tsError.message : 'none'}`);
  assert.equal(tsError, null, 'defect present: invalid-typed row accepted without validation');
});

// --- SEC-001 -------------------------------------------------------------------
test('SEC-001 db.js:126-130: importAll stores a docs key without the lernwerkstatt: prefix and a non-object value', async () => {
  await getDB();
  await importAll({ app: 'lernwerkstatt', format: 1, docs: { 'evil:key': 5 }, log: [] });
  const docs = await readRaw('docs');
  console.log(`OBSERVED SEC-001: stored docs keys=${JSON.stringify(docs.map((r) => r.key))}`);
  assert.ok(docs.some((r) => r.key === 'evil:key'), 'defect present: key without prefix stored');
});

test('SEC-001 narrower (characterization): prefixed key with an array value is accepted; prefixed key with a number is rejected', async () => {
  await getDB();
  await importAll({ app: 'lernwerkstatt', format: 1, docs: { 'lernwerkstatt:arr': [1, 2], 'lernwerkstatt:num': 5 }, log: [] });
  const docs = await readRaw('docs');
  const keys = docs.map((r) => r.key);
  console.log(`OBSERVED SEC-001 narrower: stored keys=${JSON.stringify(keys)}`);
  assert.deepEqual(keys, ['lernwerkstatt:arr']);
});

// --- RULE-126 ------------------------------------------------------------------
test('RULE-126 db.js:132: restoring a backup replaces the event log instead of merging', async () => {
  await getDB();
  await logEvent({ app: 'old', n: 1 });
  await logEvent({ app: 'old', n: 2 });
  await importAll({ app: 'lernwerkstatt', format: 1, docs: {}, log: [{ app: 'new', ts: 10, n: 9 }] });
  const log = await readRaw('log');
  console.log(`OBSERVED RULE-126: rows before import=2 (old), after import=${log.length} [${log.map((r) => r.app + r.n).join(',')}]`);
  assert.equal(log.length, 1, 'defect present: count is 1, the 2 existing rows were replaced');
  assert.equal(log.some((r) => r.app === 'old'), false);
});

// --- RULE-187 ------------------------------------------------------------------
test('RULE-187 db.js:54-60: legacy localStorage copy is removed (and read) before the IDB put confirms', async () => {
  const ls = installLocalStorage();
  const key = 'lernwerkstatt:app:r187';
  ls._map.set(key, JSON.stringify({ xp: 9, stars: {} }));
  await getDB();
  trace.length = 0;
  const store = await createStore(key, { xp: 0, stars: {} });
  const iRemove = trace.indexOf(`ls.removeItem:${key}`);
  const iPut = trace.indexOf('idb.put:docs');
  console.log(`OBSERVED RULE-187: call order=${trace.join(' > ')}; in-memory xp=${store.state.xp}`);
  assert.ok(iRemove !== -1 && iPut !== -1, 'both calls happen');
  assert.ok(iRemove < iPut, 'defect present: localStorage removeItem runs before the IDB put');
});

// --- RULE-256 ------------------------------------------------------------------
test('RULE-256 db.js:122: exportAll truncates the log to the last 1000 entries', { timeout: 120000 }, async () => {
  await getDB();
  for (let i = 1; i <= 1005; i++) await logEvent({ app: 'mathe', n: i });
  const raw = await readRaw('log');
  const backup = await exportAll();
  console.log(`OBSERVED RULE-256: stored log rows=${raw.length}, exported log rows=${backup.log.length}, first exported n=${backup.log[0].n}`);
  assert.equal(raw.length, 1005, 'precondition: 1005 rows stored');
  assert.equal(backup.log.length, 1000, 'defect present: export holds only 1000 rows');
  assert.equal(backup.log[0].n, 6, 'defect present: rows 1-5 dropped from the backup');
});
