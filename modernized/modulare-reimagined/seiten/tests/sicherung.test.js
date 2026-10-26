// Sicherung: Export, Prüfung und Einspielen über den Speicher, dazu der Hinweis zum Namen (SEC-007, offen).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { openApp, openProfile, PROFILE_KEY } from '../../speicher/index.js';
import { buildExport, exportFileName, exportPayload, NAME_IN_FILE, NO_NAME_IN_FILE, NO_STORAGE, planSentence, Sicherung } from '../sicherung.js';
import { appDefaults, profileDefaults } from '../rahmen.js';
import { DAY, memoryHandle, NAME } from './helpers.js';

const h = createElement;

// Ein Speicher mit Profil, App-Stand und einem Protokolleintrag.
async function filled() {
  const handle = await memoryHandle();
  const profile = await openProfile(handle, profileDefaults());
  profile.state.name = NAME;
  profile.state.xp = 40;
  await profile.save();
  const app = await openApp(handle, 'mathe', appDefaults());
  app.state.stars = { start: 3 };
  await app.save();
  await handle.logEvent({ app: 'mathe', type: 'round', mode: 'lesson', unit: 'start', accuracy: 1, stars: 3, failed: false, score: 0, xp: 40 });
  return handle;
}

test('RULE-256 Der Export enthält alle Speicherstände und das Protokoll', async () => {
  const handle = await filled();
  const built = await buildExport(handle, { day: DAY });
  assert.equal(built.ok, true);
  assert.equal(built.fileName, 'lernwerkstatt-sicherung-2026-10-26.json');
  const data = JSON.parse(built.text);
  assert.equal(data.app, 'lernwerkstatt');
  assert.equal(data.docs[PROFILE_KEY].xp, 40);
  assert.equal(data.docs['lernwerkstatt:app:mathe'].stars.start, 3);
  assert.equal(data.log.length, 1);
});

test('RULE-256 Eine fremde Datei wird beim Einspielen abgelehnt', async () => {
  const handle = await memoryHandle();
  const foreign = JSON.stringify({ app: 'fremd', format: 1, docs: {}, log: [] });
  const planned = await handle.planImport(foreign);
  assert.equal(planned.ok, false);
});

test('RULE-256 Einspielen braucht eine Bestätigung und stellt den Stand in einem anderen Speicher her', async () => {
  const source = await filled();
  const text = (await buildExport(source, { day: DAY })).text;
  const target = await memoryHandle();
  const unconfirmed = await target.importAll(text, { confirm: false });
  assert.equal(unconfirmed.needsConfirm, true);
  const done = await target.importAll(text, { confirm: true });
  assert.equal(done.ok, true);
  const profile = await target.createStore(PROFILE_KEY, profileDefaults());
  assert.equal(profile.state.xp, 40);
});

test('RULE-256 Der Plan nennt, wie viele Stände ersetzt und wie viele Ereignisse neu sind', () => {
  const sentence = planSentence({
    docs: [{ key: 'a', status: 'new' }, { key: 'b', status: 'replaced' }], logNew: 2, logDuplicates: 1
  });
  assert.match(sentence, /2 Speicherstände, 1 davon ersetzen vorhandene/);
  assert.match(sentence, /2 Ereignisse sind neu, 1 gibt es schon/);
});

test('SEITE-MASKIERUNG SEC-007 offen: der Export enthält standardmäßig den Namen, der Hinweis steht daneben', async () => {
  const handle = await filled();
  const built = await buildExport(handle, { day: DAY });
  assert.match(built.text, new RegExp(NAME));
  const markup = renderToStaticMarkup(h(Sicherung, { handle, day: DAY }));
  assert.match(markup, new RegExp(NAME_IN_FILE));
});

test('SEITE-MASKIERUNG SEC-007 offen: mit includeName false ist der Name aus der Datei entfernt', async () => {
  const handle = await filled();
  const built = await buildExport(handle, { day: DAY, includeName: false });
  assert.equal(built.text.includes(NAME), false);
  assert.equal(JSON.parse(built.text).docs[PROFILE_KEY].name, '');
  const markup = renderToStaticMarkup(h(Sicherung, { handle, day: DAY, includeName: false }));
  assert.match(markup, new RegExp(NO_NAME_IN_FILE));
});

test('SEITE-MASKIERUNG Der Export im Arbeitsspeicher ändert das Original nicht', async () => {
  const handle = await filled();
  const exported = await handle.exportAll();
  const stripped = exportPayload(exported, { includeName: false });
  assert.equal(stripped.docs[PROFILE_KEY].name, '');
  assert.equal(exported.docs[PROFILE_KEY].name, NAME, 'das Original behält den Namen');
});

test('SEITE-SPEICHER-FEHLER Ohne Speicher meldet die Sicherung, dass nichts zu sichern ist', async () => {
  const built = await buildExport(null, { day: DAY });
  assert.equal(built.ok, false);
  assert.equal(built.error, NO_STORAGE);
});

test('SEITE-SPEICHER-FEHLER Schlägt der Export fehl, kommt eine Meldung statt eines Absturzes', async () => {
  const broken = { exportAll: async () => { throw new Error('Speicher weg'); } };
  const built = await buildExport(broken, { day: DAY });
  assert.equal(built.ok, false);
  assert.equal(built.error, 'Die Sicherung konnte nicht erstellt werden.');
});

test('SEITE-A11Y Der Hinweis zum Export ist per aria-describedby mit dem Knopf verbunden', async () => {
  const handle = await memoryHandle();
  const markup = renderToStaticMarkup(h(Sicherung, { handle, day: DAY }));
  assert.match(markup, /aria-describedby="export-hint"/);
  assert.match(markup, /id="export-hint"/);
});

test('SEITE-A11Y Ohne Speicher sind Export und Einspielen deaktiviert', () => {
  const markup = renderToStaticMarkup(h(Sicherung, { handle: null, day: DAY }));
  assert.equal((markup.match(/disabled=""/g) || []).length, 2);
  assert.equal(exportFileName(DAY).endsWith('.json'), true);
});
