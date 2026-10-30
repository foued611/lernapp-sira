// Klassen: Die Startseite zeigt die Apps der gewählten Klasse, je Fach zusammengefasst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { openProfile, PROFILE_KEY } from '../../speicher/index.js';
import { profileDefaults, DEFAULT_KLASSE } from '../ablauf.js';
import { beforeKlasse, inKlasse, klassenOf } from '../registry.js';
import { KlassenWahl, Startseite, faecherOf, saveKlasse, startseiteModel } from '../startseite.js';
import { buildExport } from '../sicherung.js';
import { bootFixture, DAY, REGISTRY, memoryHandle } from './helpers.js';

const h = createElement;
const [mathe, deutsch] = REGISTRY;

// Klasse 7 mit Mathe und Deutsch, Klasse 8 mit Mathe 8 und einer App für beide Klassen.
const KATALOG = [
  { ...mathe, klassen: [7] },
  { ...deutsch, klassen: [7] },
  { ...mathe, id: 'mathe-8', title: 'Mathe 8', klassen: [8], lehrwerk: 'Lambacher Schweizer 8' },
  { ...deutsch, id: 'bio', fach: 'biologie', subject: 'Biologie', title: 'Bio 7/8', klassen: [7, 8] }
];

const model = async (klasse, profile = {}) => {
  const boot = await bootFixture({ registry: KATALOG });
  Object.assign(boot.state.profileStore.state, profile);
  return { boot, view: startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: boot.state.profileStore, apps: boot.state.apps, klasse }) };
};
const ids = (tiles) => tiles.map((tile) => tile.id);

test('SEITE-KLASSE klassenOf, inKlasse und beforeKlasse lesen die Liste der App', () => {
  assert.deepEqual(klassenOf(KATALOG), [7, 8]);
  assert.equal(inKlasse(KATALOG[3], 8), true);
  assert.equal(beforeKlasse(KATALOG[0], 8), true);
  assert.equal(beforeKlasse(KATALOG[3], 8), false);
  assert.equal(beforeKlasse(KATALOG[2], 7), false);
});

test('SEITE-KLASSE Das Profil startet in Klasse 7', () => {
  assert.equal(profileDefaults().klasse, DEFAULT_KLASSE);
  assert.equal(DEFAULT_KLASSE, 7);
});

test('SEITE-KLASSE Klasse 7 zeigt ihre Apps, Stoff von Klasse 8 fehlt ganz', async () => {
  const { view } = await model(null);
  assert.equal(view.klasse, 7);
  assert.deepEqual(ids(view.tiles), ['mathe', 'deutsch', 'bio']);
  assert.deepEqual(ids(view.earlierTiles), []);
});

test('SEITE-KLASSE Klasse 8 zeigt ihre Apps, frühere stehen getrennt und behalten den Fortschritt', async () => {
  const { view } = await model(8);
  assert.deepEqual(ids(view.tiles), ['mathe-8', 'bio']);
  assert.deepEqual(ids(view.earlierTiles), ['mathe', 'deutsch']);
  assert.equal(view.earlierTiles[0].kind, 'live');
});

test('SEITE-KLASSE Das Profil bestimmt die Klasse, eine unbekannte fällt auf die höchste zurück', async () => {
  assert.equal((await model(null, { klasse: 8 })).view.klasse, 8);
  assert.equal((await model(null, { klasse: 11 })).view.klasse, 8);
});

test('SEITE-KLASSE Ohne Speicher zeigt die Startseite trotzdem die Klasse', async () => {
  const boot = await bootFixture({ registry: KATALOG, openStorage: async () => null });
  const view = startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: null, apps: boot.state.apps });
  assert.equal(view.mode, 'empty');
  assert.deepEqual(ids(view.tiles), ['mathe', 'deutsch', 'bio']);
  const achte = startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: null, apps: boot.state.apps, klasse: 8 });
  assert.deepEqual(ids(achte.earlierTiles), ['mathe', 'deutsch']);
});

test('SEITE-KLASSE Die Wahl erscheint erst ab zwei Klassen und zeigt den Stand auch ohne Farbe', () => {
  assert.equal(renderToStaticMarkup(h(KlassenWahl, { klasse: 7, klassen: [7], onChoose: () => {} })), '');
  const markup = renderToStaticMarkup(h(KlassenWahl, { klasse: 8, klassen: [7, 8], onChoose: () => {} }));
  assert.match(markup, /aria-label="Deine Klasse"/);
  assert.match(markup, /aria-pressed="true"[^>]*>Klasse 8<svg/);
});

test('SEITE-KLASSE Mit einer Klasse bleibt die Startseite wie bisher', async () => {
  const boot = await bootFixture();
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.match(markup, /Alle Lern-Apps/);
  assert.doesNotMatch(markup, /Deine Klasse|Aus früheren Klassen/);
});

test('SEITE-KLASSE Die Wahl wird gespeichert, eine fremde Klasse nicht', async () => {
  const { boot } = await model(null);
  const store = boot.state.profileStore;
  assert.equal((await saveKlasse(store, 8, [7, 8])).ok, true);
  assert.equal(store.state.klasse, 8);
  assert.equal((await saveKlasse(store, 9, [7, 8])).skipped, true);
  assert.equal(store.state.klasse, 8);
  assert.equal((await saveKlasse(null, 7, [7, 8])).ok, false);
});

test('SEITE-KLASSE Ein altes Profil ohne Klasse bekommt beim Laden den Standard, gespeicherte Felder bleiben', async () => {
  const handle = await memoryHandle();
  const { klasse, ...alt } = profileDefaults();
  const store = await openProfile(handle, { ...alt, xp: 120 });
  await store.save();
  const neu = await openProfile(handle, profileDefaults());
  assert.equal(neu.state.klasse, DEFAULT_KLASSE);
  assert.equal(neu.state.xp, 120);
});

test('SEITE-KLASSE Die Sicherung enthält die Klasse', async () => {
  const handle = await memoryHandle();
  const store = await openProfile(handle, profileDefaults());
  store.state.klasse = 8;
  await store.save();
  const { text } = await buildExport(handle, { includeName: true, day: DAY });
  assert.equal(JSON.parse(text).docs[PROFILE_KEY].klasse, 8);
});

test('SEITE-FACH Apps eines Fachs stehen auf einer Karte, die Reihenfolge bleibt', async () => {
  const faecher = faecherOf([{ id: 'a', fach: 'x', subject: 'X' }, { id: 'b', fach: 'y', subject: 'Y' }, { id: 'c', fach: 'x', subject: 'X' }]);
  assert.deepEqual(faecher.map((f) => [f.fach, f.tiles.map((t) => t.id)]), [['x', ['a', 'c']], ['y', ['b']]]);
});

test('SEITE-FACH Die Karte eines Fachs zeigt jede App mit Lehrwerk, Link und eigenem Fortschritt', async () => {
  const katalog = [{ ...mathe, lehrwerk: 'Lambacher Schweizer 7' }, { ...mathe, id: 'geometrie', title: 'Geometrie-Werkstatt', lehrwerk: 'Lambacher Schweizer 7' }];
  const boot = await bootFixture({ registry: katalog });
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.equal(markup.match(/class="course"/g).length, 2);
  assert.match(markup, /href="\?app=mathe"/);
  assert.match(markup, /href="\?app=geometrie"/);
  assert.match(markup, /Lambacher Schweizer 7/);
  assert.equal(markup.match(/role="progressbar"/g).length, 2);
});
