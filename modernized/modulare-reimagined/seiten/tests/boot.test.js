// Start: Inhalte aller Apps vor der Anzeige, Speicher ohne Abbruch, Fehler je App, Prüfung der Adresse und der App-Liste.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MSG, parseRoute } from '../boot.js';
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

test('RULE-202 Die Inhalte aller Apps sind geladen, bevor die Startseite gezeichnet wird', async () => {
  const boot = await bootFixture();
  const mathe = boot.state.apps.find((a) => a.entry.id === 'mathe');
  const physik = boot.state.apps.find((a) => a.entry.id === 'physik');
  assert.equal(mathe.config.units.length, 2, 'die Konfiguration steht schon da');
  assert.equal(physik.config, null, 'eine Platzhalter-App hat keine Inhalte');
  assert.equal(boot.state.day, DAY);
});

test('SEITE-SPEICHER-FEHLER Ein Ladefehler betrifft nur diese App, die anderen bleiben nutzbar', async () => {
  const boot = await bootFixture({ failing: ['deutsch'] });
  const deutsch = boot.state.apps.find((a) => a.entry.id === 'deutsch');
  const mathe = boot.state.apps.find((a) => a.entry.id === 'mathe');
  assert.equal(deutsch.error, MSG.appLoad);
  assert.equal(deutsch.config, null);
  assert.ok(mathe.config && mathe.appStore, 'mathe läuft weiter');
});

test('RULE-259 Die Seitenzahl kommt aus dem Inhaltspaket, nicht aus einer Liste von Hand', async () => {
  assert.equal(REGISTRY.every((entry) => !('units' in entry)), true, 'die Liste trägt keine Seitenzahl');
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
    { id: 'Mathe', subject: 'Mathematik', title: 'A', status: LIVE },
    { id: '../x', subject: 'Mathematik', title: 'B', status: LIVE }
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
