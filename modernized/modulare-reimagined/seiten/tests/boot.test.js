// Start: Inhalte aller Apps vor der Anzeige, Speicher ohne Abbruch, Fehler je App, Prüfung der Adresse und der App-Liste.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MSG, bootSeiten, parseRoute } from '../boot.js';
import { validateRegistry, LIVE } from '../registry.js';
import { bootFixture, REGISTRY, throwingHandle, DAY } from './helpers.js';

test('RULE-202 Ein Speicher, der nicht öffnet, bricht den Start nicht ab', async () => {
  const boot = await bootFixture({ openStorage: async () => { throw new Error('gesperrt'); } });
  assert.equal(boot.ok, true);
  assert.equal(boot.state.storage.status, 'unavailable');
  assert.equal(boot.state.storage.message, MSG.unavailable);
  assert.equal(boot.state.profileStore, null);
});

test('RULE-202 Ein Profil, das beim Öffnen wirft, ergibt den leeren Zustand statt eines Absturzes', async () => {
  const boot = await bootFixture({ openStorage: async () => throwingHandle() });
  assert.equal(boot.ok, true);
  assert.equal(boot.state.profileStore, null);
  assert.equal(boot.state.apps.every((app) => app.storeMessage === MSG.unavailable || app.entry.status !== LIVE), true);
});

test('RULE-202 Die Startseite kommt ohne Inhalte aus, eine App lädt ihre erst beim Öffnen', async () => {
  const start = await bootFixture();
  const appOf = (boot, id) => boot.state.apps.find((a) => a.entry.id === id);
  assert.equal(appOf(start, 'mathe').config, null, 'die Startseite braucht nur den Katalog');
  assert.equal(appOf(start, 'mathe').units.length, 2);
  assert.ok(appOf(start, 'mathe').appStore && appOf(start, 'deutsch').appStore, 'der Stand aller Apps ist da');
  assert.equal(start.state.day, DAY);

  const offen = await bootFixture({ search: '?app=mathe' });
  assert.equal(appOf(offen, 'mathe').config.units.length, 2);
  assert.ok(appOf(offen, 'mathe').appStore);
  assert.equal(appOf(offen, 'deutsch').config, null, 'andere Apps bleiben ungeladen');
  assert.equal(appOf(offen, 'deutsch').appStore, null);
  assert.equal(appOf(offen, 'physik').config, null, 'eine Platzhalter-App hat keine Inhalte');
});

test('RULE-202 Ohne Katalog gibt es eine Meldung statt eines Abbruchs', async () => {
  const source = { catalog: async () => { throw new Error('offline'); } };
  const boot = await bootSeiten({ source, openStorage: async () => null });
  assert.equal(boot.ok, false);
  assert.equal(boot.message, MSG.catalog);
});

test('RULE-202 Der Katalog kommt aus der Quelle, wenn keine Liste übergeben wird', async () => {
  const source = { catalog: async () => REGISTRY };
  const boot = await bootSeiten({ source, openStorage: async () => null });
  assert.equal(boot.ok, true);
  assert.equal(boot.state.apps.length, REGISTRY.length);
});

test('SEITE-SPEICHER-FEHLER Ein Ladefehler betrifft nur die geöffnete App', async () => {
  const boot = await bootFixture({ failing: ['deutsch'], search: '?app=deutsch' });
  const deutsch = boot.state.apps.find((a) => a.entry.id === 'deutsch');
  const mathe = boot.state.apps.find((a) => a.entry.id === 'mathe');
  assert.equal(deutsch.error, MSG.appLoad);
  assert.equal(deutsch.config, null);
  assert.equal(mathe.error, null);
});

test('RULE-259 Die Seitenzahl kommt aus dem Katalog, der aus den Manifesten entsteht', async () => {
  const boot = await bootFixture();
  const mathe = boot.state.apps.find((a) => a.entry.id === 'mathe');
  assert.equal(mathe.units.length, 2);
});

test('RULE-259 Eine doppelte Kennung in der App-Liste stoppt den Start mit einer Meldung', async () => {
  const boot = await bootFixture({ registry: [...REGISTRY, { ...REGISTRY[0] }] });
  assert.equal(boot.ok, false);
  assert.equal(boot.message, MSG.registry);
  assert.ok(boot.problems.some((p) => p.includes('doppelt')));
});

test('RULE-259 Eine Kennung mit Großbuchstaben oder Schrägstrich wird abgelehnt', () => {
  const problems = validateRegistry([
    { id: 'Mathe', fach: 'mathematik', klassen: [7], subject: 'Mathematik', title: 'A', status: LIVE },
    { id: '../x', fach: 'mathematik', klassen: [7], subject: 'Mathematik', title: 'B', status: LIVE }
  ]);
  assert.equal(problems.length, 2);
  assert.deepEqual(validateRegistry(REGISTRY), []);
});

test('SEITE-SPEICHER-FEHLER Eine App-Kennung aus der Adresse wird geprüft, bevor sie einen Speicherschlüssel bildet', () => {
  assert.equal(parseRoute('?app=mathe'), 'mathe');
  assert.equal(parseRoute('?app=../profile'), null);
  assert.equal(parseRoute('?app=Mathe'), null);
  assert.equal(parseRoute(''), null);
  assert.equal(parseRoute(undefined), null);
});
