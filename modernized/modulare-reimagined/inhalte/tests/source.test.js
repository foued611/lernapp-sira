// INHALTE-QUELLE: statische Quelle (JSON-Dateien) und HTTP-Quelle (API). Beide nehmen fetch injiziert.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHttpSource, createStaticSource, assertAppId } from '../index.js';
import { fakeFetch, validBundle } from './helpers.js';

const BASE = 'https://lernapp.example/content';

function staticRoutes(id, bundle = validBundle()) {
  return {
    [`${BASE}/${id}/manifest.json`]: { body: bundle.manifest },
    [`${BASE}/${id}/lessons.json`]: { body: bundle.lessons },
    [`${BASE}/${id}/badges.json`]: { body: bundle.badges }
  };
}

test('INHALTE-QUELLE: statische Quelle lädt die Dateien, eine fehlende data.json wird als {} eingesetzt', async () => {
  const bundle = validBundle();
  const fetchFn = fakeFetch(staticRoutes('probe-app', bundle));
  const loaded = await createStaticSource(BASE, fetchFn).load('probe-app');
  assert.deepEqual(loaded.manifest, bundle.manifest);
  assert.deepEqual(loaded.data, {});
  assert.deepEqual(fetchFn.calls.map((c) => c.url).sort(), [
    `${BASE}/probe-app/badges.json`,
    `${BASE}/probe-app/lessons.json`,
    `${BASE}/probe-app/manifest.json`,
    `${BASE}/probe-app/data.json`
  ].sort());
});

test('INHALTE-QUELLE: statische Quelle liest vorhandene data.json', async () => {
  const bundle = validBundle();
  bundle.data = { fragen: [{ prompt: 'Eins und eins?' }] };
  const routes = { ...staticRoutes('probe-app', bundle), [`${BASE}/probe-app/data.json`]: { body: bundle.data } };
  const loaded = await createStaticSource(BASE, fakeFetch(routes)).load('probe-app');
  assert.deepEqual(loaded.data, bundle.data);
});

test('INHALTE-QUELLE: fehlt eine Pflichtdatei, wird geworfen und nichts Teilweises geliefert', async () => {
  const routes = staticRoutes('probe-app');
  delete routes[`${BASE}/probe-app/lessons.json`];
  await assert.rejects(createStaticSource(BASE, fakeFetch(routes)).load('probe-app'), /Inhalt nicht gefunden.*lessons\.json \(404\)/);
});

test('INHALTE-QUELLE: Basis-URL mit und ohne Schrägstrich am Ende gibt dieselben Adressen', async () => {
  const routes = staticRoutes('probe-app');
  const withSlash = fakeFetch(routes);
  const withoutSlash = fakeFetch(routes);
  await createStaticSource(`${BASE}/`, withSlash).load('probe-app');
  await createStaticSource(BASE, withoutSlash).load('probe-app');
  assert.deepEqual(withSlash.calls.map((c) => c.url), withoutSlash.calls.map((c) => c.url));
});

test('INHALTE-QUELLE: ungültige App-Kennung wird vor dem Abruf abgelehnt (kein Pfad-Trick)', async () => {
  for (const id of ['../geheim', 'Mathe', 'a/b', '', 'x y']) {
    const fetchFn = fakeFetch({});
    await assert.rejects(createStaticSource(BASE, fetchFn).load(id), /Ungültige App-Kennung/, id);
    assert.equal(fetchFn.calls.length, 0, `kein Abruf für "${id}"`);
  }
  assert.equal(assertAppId('mathe-2'), 'mathe-2');
});

test('INHALTE-QUELLE: ohne injizierte fetch-Funktion wird nichts gebaut (kein globales fetch)', () => {
  assert.throws(() => createStaticSource(BASE), /fetch-Funktion/);
  assert.throws(() => createHttpSource(BASE, 'fake-key'), /fetch-Funktion/);
});

test('INHALTE-QUELLE: globales fetch wird nie benutzt, auch wenn es existiert', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('globales fetch benutzt'); };
  try {
    const loaded = await createStaticSource(BASE, fakeFetch(staticRoutes('probe-app'))).load('probe-app');
    assert.ok(loaded.manifest);
  } finally {
    globalThis.fetch = original;
  }
});

test('INHALTE-QUELLE: HTTP-Quelle ruft <base>/apps/<id>/content auf, mit Accept und Bearer-Kopf', async () => {
  const bundle = validBundle();
  const fetchFn = fakeFetch({ [`${BASE}/apps/probe-app/content`]: { body: bundle } });
  const loaded = await createHttpSource(BASE, 'fake-key-123', fetchFn).load('probe-app');
  assert.deepEqual(loaded, bundle);
  assert.equal(fetchFn.calls.length, 1);
  assert.equal(fetchFn.calls[0].url, `${BASE}/apps/probe-app/content`);
  assert.equal(fetchFn.calls[0].init.headers.Accept, 'application/json');
  assert.equal(fetchFn.calls[0].init.headers.Authorization, 'Bearer fake-key-123');
});

test('INHALTE-QUELLE: der Zugangsschlüssel steht nie in der URL und nicht in einer Fehlermeldung', async () => {
  const fetchFn = fakeFetch({});
  const source = createHttpSource(BASE, 'fake-key-geheim', fetchFn);
  await assert.rejects(source.load('probe-app'), (error) => {
    assert.ok(!error.message.includes('fake-key-geheim'));
    return /Inhalte nicht erreichbar \(404\)/.test(error.message);
  });
  assert.ok(!fetchFn.calls[0].url.includes('fake-key-geheim'));
});

test('INHALTE-QUELLE: HTTP-Quelle ohne Zugangsschlüssel wird nicht gebaut', () => {
  assert.throws(() => createHttpSource(BASE, '', fakeFetch({})), /Zugangsschlüssel/);
  assert.throws(() => createHttpSource(BASE, undefined, fakeFetch({})), /Zugangsschlüssel/);
});

test('INHALTE-QUELLE: HTTP-Quelle prüft das Paket, das die API liefert', async () => {
  const broken = validBundle();
  delete broken.lessons.start;
  const fetchFn = fakeFetch({ [`${BASE}/apps/probe-app/content`]: { body: broken } });
  await assert.rejects(createHttpSource(BASE, 'fake-key', fetchFn).load('probe-app'), /das ganze Paket wird abgelehnt/);
});
