// Startseite: Fortschritt, leerer Zustand, Maskierung des Namens.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProgressBar } from '../../komponenten/ui.js';
import { profileDefaults } from '../ablauf.js';
import { greetingOf, maskName, minouLine, nameFrom, saveName, saveGoal, GoalChoice, Seiten, startseiteModel, Startseite, MASK } from '../startseite.js';
import { MSG } from '../boot.js';
import { bootFixture, DAY, memoryHandle, NAME } from './helpers.js';

const h = createElement;

// Ein Start mit Speicher, dessen Stand man vor der Auswertung setzt.
async function full(setup = () => {}) {
  const boot = await bootFixture();
  const { state } = boot;
  const mathe = state.apps.find((a) => a.entry.id === 'mathe');
  setup(mathe.appStore.state, state.profileStore.state);
  return { state, mathe, model: () => startseiteModel({ day: state.day, storage: state.storage, profileStore: state.profileStore, apps: state.apps }) };
}

const tileOf = (model, id) => model.tiles.find((t) => t.id === id);

test('RULE-075 Eine Seite zählt ab 2 von 3 Sternen als erledigt, ein Stern zählt nicht', async () => {
  const env = await full((app) => { app.stars = { start: 1, weiter: 2 }; });
  const tile = tileOf(env.model(), 'mathe');
  assert.equal(tile.done, 1);
  assert.equal(tile.total, 2);
});

test('RULE-075 Der Fortschritt steht als Prozenttext in der Kachel, nicht nur als Balken', async () => {
  const env = await full((app) => { app.stars = { start: 3, weiter: 2 }; });
  const tile = tileOf(env.model(), 'mathe');
  const markup = renderToStaticMarkup(h(ProgressBar, { done: tile.done, total: tile.total, label: 'Fortschritt' }));
  assert.match(markup, /2 von 2 Seiten erledigt \(100 %\)/);
  assert.equal(tile.percent, 100);
});

test('RULE-075 Gelöschte Seiten zählen nicht mit, der Prozentwert bleibt zwischen 0 und 100', async () => {
  const env = await full((app) => { app.stars = { start: 3, weiter: 0, alt: 3 }; });
  const tile = tileOf(env.model(), 'mathe');
  assert.equal(tile.done, 1);
  assert.equal(tile.percent, 50);
  assert.ok(tile.percent >= 0 && tile.percent <= 100);
});

test('RULE-202 Ohne Speicher zeigt die Startseite den leeren Zustand mit Meldung und ohne Fortschritt', async () => {
  const boot = await bootFixture({ openStorage: async () => null });
  const model = startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: null, apps: boot.state.apps });
  assert.equal(model.mode, 'empty');
  assert.equal(model.message, MSG.unavailable);
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.match(markup, /Ohne Speicher zeigt diese Seite keinen Fortschritt/);
  assert.equal(markup.includes('role="progressbar"'), false, 'kein Fortschrittsbalken');
  assert.equal(markup.includes('Tagesziel'), false, 'kein Tagesziel');
});

test('RULE-202 Ein Speicher, der nicht startet, bricht die Startseite nicht ab und zeigt die Apps als Links', async () => {
  const boot = await bootFixture({ openStorage: async () => { throw new Error('gesperrt'); } });
  assert.equal(boot.ok, true, 'kein Abbruch');
  const markup = renderToStaticMarkup(h(Seiten, { boot }));
  assert.match(markup, /Mathe-Werkstatt/);
  assert.match(markup, /href="\?app=mathe"/);
  assert.match(markup, /Demnächst/, 'die Platzhalter-App bleibt sichtbar');
});

test('RULE-242 Training und Endgegner stehen nicht auf der Startseite aller Apps, sondern wie im Legacy in der App', async () => {
  const env = await full((app) => {
    app.stars = { start: 2 };
    app.last = { start: '2026-10-23' };
  });
  const markup = renderToStaticMarkup(h(Startseite, { state: env.state }));
  assert.doesNotMatch(markup, /Endgegner|Gezieltes Training/);
});

test('SEITE-MASKIERUNG Der Name erscheint nie im Klartext auf der Startseite', async () => {
  const boot = await bootFixture();
  boot.state.profileStore.state.name = NAME;
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.equal(markup.includes(NAME), false);
  assert.equal(markup.includes('Zo'), false, 'auch kein Teil davon');
  assert.match(markup, /Hallo, ••• !/, 'Legacy-Schreibweise mit Leerzeichen vor dem Ausrufezeichen');
});

test('SEITE-MASKIERUNG Die Begrüßung zeigt nur das Muster, nie den Namen', () => {
  assert.equal(maskName(NAME), MASK);
  assert.equal(greetingOf(NAME), `Hallo, ${MASK}!`);
  assert.equal(greetingOf(''), 'Hallo!');
  assert.equal(maskName('   '), '', 'ein Leerzeichen ist kein Name');
});

test('SEITE-MASKIERUNG Ohne Namen erscheint das Namensfeld, mit Namen nicht', async () => {
  const boot = await bootFixture();
  assert.match(renderToStaticMarkup(h(Startseite, { state: boot.state })), /id="nm"/);
  boot.state.profileStore.state.name = NAME;
  assert.equal(renderToStaticMarkup(h(Startseite, { state: boot.state })).includes('id="nm"'), false);
});

test('SEITE-MASKIERUNG Namen werden getrimmt und auf 20 Zeichen gekürzt, leere Eingaben werden nicht gespeichert', async () => {
  assert.equal(nameFrom('  Zoëx  '), 'Zoëx');
  assert.equal(nameFrom('x'.repeat(30)).length, 20);
  const handle = await memoryHandle();
  const { openProfile } = await import('../../speicher/index.js');
  const store = await openProfile(handle, profileDefaults());
  const skipped = await saveName(store, '   ');
  assert.equal(skipped.skipped, true);
  assert.equal(store.state.name, '');
  const saved = await saveName(store, '  Zoëx  ');
  assert.equal(saved.ok, true);
  assert.equal(store.state.name, 'Zoëx');
});

test('SEITE-MASKIERUNG Die Minou-Zeile hängt nur am Tagesstand, nie am Namen', () => {
  // Wie legacy dashboard.js:25-26: feste Sätze je Tagesstand.
  assert.equal(minouLine(30), 'Tagesziel geschafft. Alles ab jetzt ist Bonus.');
  assert.equal(minouLine(10), 'Noch 20 XP bis zum Tagesziel.');
  assert.equal(minouLine(0), 'Welche App heute? Fünf Minuten reichen schon.');
});

test('SEITE-SPEICHER-FEHLER Ein blockiertes Profil wird als nicht verfügbar gemeldet und nicht überschrieben', async () => {
  const { blockedHandle } = await import('./helpers.js');
  const boot = await bootFixture({ openStorage: async () => blockedHandle('Der Fortschritt ist gesperrt.') });
  assert.equal(boot.state.profileStore, null);
  assert.equal(boot.state.storage.status, 'unavailable');
  assert.equal(boot.state.storage.message, 'Der Fortschritt ist gesperrt.');
});

test('SEITE-SPEICHER-FEHLER Der Arbeitsspeicher als letzter Ausweg wird als Warnung gemeldet', async () => {
  const boot = await bootFixture();
  assert.equal(boot.state.storage.status, 'memory');
  const model = startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: boot.state.profileStore, apps: boot.state.apps });
  assert.equal(model.message, MSG.memory);
});

test('SEITE-SPEICHER-FEHLER Ein Ladefehler zeigt beim Öffnen der App eine Meldung, die Startseite bleibt', async () => {
  const offen = await bootFixture({ failing: ['deutsch'], search: '?app=deutsch' });
  assert.ok(renderToStaticMarkup(h(Seiten, { boot: offen })).includes(MSG.appLoad));
  const start = await bootFixture({ failing: ['deutsch'] });
  const model = startseiteModel({ day: DAY, storage: start.state.storage, profileStore: start.state.profileStore, apps: start.state.apps });
  assert.equal(tileOf(model, 'deutsch').kind, 'live');
});

test('SEITE-A11Y Die Fachauswahl zeigt den gewählten Eintrag per aria-pressed', async () => {
  const boot = await bootFixture();
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.match(markup, /aria-pressed="true"[^>]*>Alle</);
  assert.match(markup, /aria-pressed="false"[^>]*>Mathematik</);
});

test('SEITE-A11Y Das Startseiten-Markup enthält keine Inline-Handler und jeder Knopf hat einen Typ', async () => {
  const boot = await bootFixture();
  const markup = renderToStaticMarkup(h(Startseite, { state: boot.state }));
  assert.equal(/\son[a-z]+=/i.test(markup), false, 'kein onclick o. ä. im Markup');
  const buttons = markup.match(/<button[^>]*>/g) || [];
  assert.ok(buttons.length > 0);
  for (const tag of buttons) assert.match(tag, /type="(button|submit)"/);
});

test('SEITE-A11Y Die Mindestgröße der Knöpfe und Kacheln steht im Stylesheet, nicht im Markup', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../design/styles/base.css', import.meta.url), 'utf8');
  assert.match(css, /min-height:var\(--touch-min/);
  assert.equal(/style="[^"]*min-height/.test(renderToStaticMarkup(h(Startseite, { state: (await bootFixture()).state }))), false);
});

test('SEITE-MASKIERUNG Der Fortschritt eines leeren Profils zeigt Nullen, nie einen unverarbeiteten Wert', async () => {
  const boot = await bootFixture();
  const model = startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: boot.state.profileStore, apps: boot.state.apps });
  assert.equal(model.totalXP, 0);
  assert.equal(model.trophies, 0);
  assert.equal(tileOf(model, 'mathe').info, 'Noch nicht gestartet');
  assert.equal(tileOf(model, 'mathe').percent, 0);
});

test('SEITE-WOCHENZIEL Das Modell nutzt das gewählte Tagesziel statt 30', async () => {
  const env = await full((_app, profile) => { profile.goal = 50; profile.day = { d: DAY, xp: 20 }; });
  const model = env.model();
  assert.equal(model.goal.goal, 50);
  assert.equal(model.goal.reached, false);
  assert.equal(model.minou, 'Noch 30 XP bis zum Tagesziel.');
});

test('SEITE-WOCHENZIEL Ohne Wahl bleibt es bei 30 XP', async () => {
  const env = await full();
  assert.equal(env.model().goal.goal, 30);
});

test('SEITE-WOCHENZIEL Die Auswahl zeigt drei Schaltflächen mit aria-pressed, das gewählte Ziel ist gedrückt', () => {
  const markup = renderToStaticMarkup(h(GoalChoice, { goal: 50, onChoose: () => {} }));
  const buttons = markup.match(/<button[^>]*>/g);
  assert.equal(buttons.length, 3);
  assert.match(markup, /aria-pressed="false"[^>]*>20 XP/);
  assert.match(markup, /aria-pressed="false"[^>]*>30 XP/);
  assert.match(markup, /aria-pressed="true"[^>]*>50 XP/);
});

test('SEITE-WOCHENZIEL saveGoal speichert einen erlaubten Wert im Profil', async () => {
  const handle = await memoryHandle();
  const { openProfile } = await import('../../speicher/index.js');
  const store = await openProfile(handle, profileDefaults());
  const saved = await saveGoal(store, 20);
  assert.equal(saved.ok, true);
  assert.equal(store.state.goal, 20);
});

test('SEITE-WOCHENZIEL saveGoal ohne Speicher meldet einen Fehler, ein unbekannter Wert wirft', async () => {
  assert.equal((await saveGoal(null, 20)).ok, false);
  const handle = await memoryHandle();
  const { openProfile } = await import('../../speicher/index.js');
  const store = await openProfile(handle, profileDefaults());
  await assert.rejects(() => saveGoal(store, 42), RangeError);
});

test('SEITE-WOCHENZIEL minouLine rechnet mit dem übergebenen Ziel', () => {
  assert.equal(minouLine(20, 20), 'Tagesziel geschafft. Alles ab jetzt ist Bonus.');
  assert.equal(minouLine(10, 50), 'Noch 40 XP bis zum Tagesziel.');
});

test('SEITE-WOCHENZIEL Die Auswahl hat einen sichtbaren Text, nicht nur ein aria-label', () => {
  const markup = renderToStaticMarkup(h(GoalChoice, { goal: 30, onChoose: () => {} }));
  assert.match(markup, /<p[^>]*>Tagesziel wählen<\/p>/);
});
