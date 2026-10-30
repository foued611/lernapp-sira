// RULE-185: Jedes erfolgreich geladene Paket wird gespeichert. Scheitert das Laden, gilt das letzte gespeicherte.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withCache, cacheKey } from '../index.js';
import { validBundle } from './helpers.js';

/** Speicher-Attrappe mit get und put. Fehler lassen sich pro Methode einschalten. */
function memoryCache({ initial = {}, failPut = false, failGet = false } = {}) {
  const store = new Map(Object.entries(initial));
  return {
    store,
    get: async (key) => {
      if (failGet) throw new Error('Lesefehler');
      return store.get(key);
    },
    put: async (key, value) => {
      if (failPut) throw new Error('Schreibfehler');
      store.set(key, value);
    }
  };
}

/** Quelle, die ein Paket liefert oder einen Fehler wirft. */
function sourceReturning(resultOrError) {
  return {
    name: 'fake',
    load: async () => {
      if (resultOrError instanceof Error) throw resultOrError;
      return resultOrError;
    }
  };
}

test('RULE-185: erfolgreich geladenes Paket wird unter lernwerkstatt:content:<id> gespeichert', async () => {
  const cache = memoryCache();
  const bundle = validBundle();
  const loaded = await withCache(sourceReturning(bundle), cache).load('probe-app');
  assert.equal(loaded, bundle);
  assert.equal(cacheKey('probe-app'), 'lernwerkstatt:content:probe-app');
  assert.equal(cache.store.get('lernwerkstatt:content:probe-app'), bundle);
});

test('RULE-185: scheitert das Laden, kommt das zuletzt gespeicherte Paket', async () => {
  const stored = validBundle();
  const cache = memoryCache({ initial: { 'lernwerkstatt:content:probe-app': stored } });
  const source = sourceReturning(new Error('Netz weg'));
  assert.equal(await withCache(source, cache).load('probe-app'), stored);
});

test('RULE-185: ohne gespeichertes Paket wird der ursprüngliche Fehler weitergereicht', async () => {
  const original = new Error('Netz weg');
  const cache = memoryCache();
  await assert.rejects(withCache(sourceReturning(original), cache).load('probe-app'), (error) => error === original);
});

test('RULE-185: ein frisch geladenes, ungültiges Paket löst den Rückgriff auf den Speicher aus', async () => {
  const stored = validBundle();
  const cache = memoryCache({ initial: { 'lernwerkstatt:content:probe-app': stored } });
  const invalid = validBundle();
  delete invalid.lessons.weiter;
  assert.equal(await withCache(sourceReturning(invalid), cache).load('probe-app'), stored);
  // Das ungültige Paket darf den gespeicherten Stand nicht überschreiben.
  assert.equal(cache.store.get('lernwerkstatt:content:probe-app'), stored);
});

test('RULE-185: ein frisch geladenes, ungültiges Paket ohne Speicher wirft den Prüfungsfehler', async () => {
  const invalid = validBundle();
  delete invalid.lessons.weiter;
  await assert.rejects(withCache(sourceReturning(invalid), memoryCache()).load('probe-app'), /das ganze Paket wird abgelehnt/);
});

test('RULE-185: ein gespeichertes, ungültiges Paket wirft den Prüfungsfehler', async () => {
  const broken = validBundle();
  delete broken.badges;
  const cache = memoryCache({ initial: { 'lernwerkstatt:content:probe-app': broken } });
  await assert.rejects(withCache(sourceReturning(new Error('Netz weg')), cache).load('probe-app'), /das ganze Paket wird abgelehnt/);
});

test('RULE-185: Schreibfehler im Speicher werden ignoriert, das frische Paket wird trotzdem geliefert', async () => {
  const bundle = validBundle();
  const loaded = await withCache(sourceReturning(bundle), memoryCache({ failPut: true })).load('probe-app');
  assert.equal(loaded, bundle);
});

test('RULE-185: Lesefehler im Speicher gilt wie "kein Paket" und reicht den Quellenfehler weiter', async () => {
  const original = new Error('Netz weg');
  await assert.rejects(withCache(sourceReturning(original), memoryCache({ failGet: true })).load('probe-app'), (error) => error === original);
});

test('RULE-185: withCache verlangt get und put, es gibt keinen stillen Standard-Speicher', () => {
  assert.throws(() => withCache(sourceReturning(validBundle()), undefined), /get und put/);
  assert.throws(() => withCache(sourceReturning(validBundle()), { get: async () => undefined }), /get und put/);
});

test('RULE-185: der Name der Quelle wird mit +cache erweitert', () => {
  assert.equal(withCache({ name: 'http', load: async () => validBundle() }, memoryCache()).name, 'http+cache');
});

test('INHALTE-CACHE: der Katalog bleibt offline verfügbar', async () => {
  const stored = new Map();
  const cache = { get: async (k) => stored.get(k), put: async (k, v) => { stored.set(k, v); } };
  const list = [{ id: 'probe-app' }];
  assert.deepEqual(await withCache({ name: 'x', catalog: async () => list }, cache).catalog(), list);
  const offline = { name: 'x', catalog: async () => { throw new Error('offline'); } };
  assert.deepEqual(await withCache(offline, cache).catalog(), list);
  stored.clear();
  await assert.rejects(withCache(offline, cache).catalog(), /offline/);
});
