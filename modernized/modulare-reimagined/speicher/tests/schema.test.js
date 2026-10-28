// SCHEMA-FELDER: bekannte Felder von Profil und App-Stand haben feste Typen (SEC-001, Pflicht laut Person).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { openStore } from '../index.js';
import { blobOf } from './helpers.js';

const PROFILE_KEY = 'lernwerkstatt:profile';
const APP_KEY = 'lernwerkstatt:app:mathe';
const PROFILE_DEFAULTS = { name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } };
const APP_DEFAULTS = { xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {} };

// Eine Sicherung mit einem einzelnen Dokument. Das Format ist Version 1 (RULE-256).
const sicherung = (docs) => ({ app: 'lernwerkstatt', format: 1, exportedAt: '2026-10-26T00:00:00.000Z', docs, log: [] });

test('SCHEMA-FELDER: Eine Sicherung mit falschem Feldtyp im Profil wird ganz abgelehnt, nichts wird geschrieben', async () => {
  const factory = new IDBFactory();
  const h = await openStore({ indexedDB: factory, localStorage: null });
  const ergebnis = await h.importAll(blobOf(sicherung({ [PROFILE_KEY]: { name: 'Testkind', xp: 'viel' } })), { confirm: true });
  assert.equal(ergebnis.ok, false);
  const profile = await h.createStore(PROFILE_KEY, PROFILE_DEFAULTS);
  assert.deepEqual(profile.state, PROFILE_DEFAULTS);
  h.close();
});

test('SCHEMA-FELDER: Tagesziel, Wochenblock und Fehler-Abruf haben feste Typen, falsche Werte werden abgelehnt', async () => {
  const bad = [
    { [PROFILE_KEY]: { goal: 'viel' } },
    { [PROFILE_KEY]: { week: { start: '2026-10-26', units: 'mathe/a', done: [], refreshes: 0, strong: 0 } } },
    { [PROFILE_KEY]: { week: { start: 'Montag', units: [], done: [], refreshes: 0, strong: 0 } } },
    { 'lernwerkstatt:app:mathe': { missed: { a: 'Lücke füllen' } } },
    { 'lernwerkstatt:app:mathe': { refreshes: -1 } }
  ];
  for (const docs of bad) {
    const factory = new IDBFactory();
    const h = await openStore({ indexedDB: factory, localStorage: null });
    const ergebnis = await h.importAll(blobOf(sicherung(docs)), { confirm: true });
    assert.equal(ergebnis.ok, false, JSON.stringify(docs));
    h.close();
  }
});

test('SCHEMA-FELDER: Stände mit Sternen außerhalb 0 bis 3 oder Quoten über 1 werden abgelehnt', async () => {
  const factory = new IDBFactory();
  const h = await openStore({ indexedDB: factory, localStorage: null });
  const sterne = await h.importAll(blobOf(sicherung({ [APP_KEY]: { ...APP_DEFAULTS, stars: { 'mathe-1': 5 } } })), { confirm: true });
  const quote = await h.importAll(blobOf(sicherung({ [APP_KEY]: { ...APP_DEFAULTS, acc: { 'mathe-1': 1.5 } } })), { confirm: true });
  assert.equal(sterne.ok, false);
  assert.equal(quote.ok, false);
  h.close();
});

test('SCHEMA-FELDER: Unbekannte Felder bleiben erhalten, bekannte Felder mit richtigem Typ werden übernommen (RULE-207)', async () => {
  const factory = new IDBFactory();
  const h = await openStore({ indexedDB: factory, localStorage: null });
  const doc = { ...PROFILE_DEFAULTS, name: 'Testkind', xp: 12, theme: 'dunkel' };
  const ergebnis = await h.importAll(blobOf(sicherung({ [PROFILE_KEY]: doc })), { confirm: true });
  assert.equal(ergebnis.ok, true);
  const profile = await h.createStore(PROFILE_KEY, PROFILE_DEFAULTS);
  assert.equal(profile.state.xp, 12);
  assert.equal(profile.state.theme, 'dunkel');
  h.close();
});

test('SCHEMA-FELDER: Ein gespeicherter Stand mit falschem Feldtyp wird gesichert, die App startet mit Standardwerten (RULE-135)', async () => {
  const factory = new IDBFactory();
  const first = await openStore({ indexedDB: factory, localStorage: null });
  const profile = await first.createStore(PROFILE_KEY, PROFILE_DEFAULTS);
  profile.state.xp = 'viel'; // schreibt ein falsches Dokument, wie es ein fremder Code täte
  await profile.save();
  first.close();

  const second = await openStore({ indexedDB: factory, localStorage: null });
  const again = await second.createStore(PROFILE_KEY, PROFILE_DEFAULTS);
  assert.deepEqual(again.state, PROFILE_DEFAULTS);
  assert.ok(again.recovered, 'der falsche Stand muss als gesichert gemeldet werden');
  const sicherungen = await second.exportAll();
  const kopie = Object.entries(sicherungen.docs).find(([key]) => key.startsWith('lernwerkstatt:rohdaten:'));
  assert.ok(kopie, 'der Rohstand muss als Sicherung im Dokumentenspeicher liegen');
  assert.equal(kopie[1].reason, 'schema-mismatch');
  second.close();
});

test('SCHEMA-FELDER: Ein gültiges Profil mit typischen Werten passiert die Prüfung', async () => {
  const factory = new IDBFactory();
  const h = await openStore({ indexedDB: factory, localStorage: null });
  const doc = { name: 'Testkind', xp: 120, streak: 3, lastDay: '2026-10-25', lastApp: 'mathe', day: { d: '2026-10-25', xp: 40 } };
  const ergebnis = await h.importAll(blobOf(sicherung({ [PROFILE_KEY]: doc })), { confirm: true });
  assert.equal(ergebnis.ok, true);
  h.close();
});
