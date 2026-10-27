// Startseite: Fortschritt, Empfehlung, Strangetikett, leerer Zustand, Maskierung des Namens.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TrackLabel } from '../../komponenten/tracks.js';
import { ProgressBar } from '../../komponenten/ui.js';
import { profileDefaults } from '../rahmen.js';
import { greetingOf, maskName, minouLine, nameFrom, saveName, Seiten, startseiteModel, Startseite, MASK } from '../startseite.js';
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

test('RULE-242 Eine fällige Seite kommt zuerst: nach drei Tagen zum Auffrischen', async () => {
  const env = await full((app) => {
    app.stars = { start: 2 };
    app.last = { start: '2026-10-23' };
    app.acc = { weiter: 0.5 };
  });
  const training = env.model().training;
  assert.equal(training.unitTitle, 'Erste Seite');
  assert.equal(training.reason, 'Zeit zum Auffrischen');
  assert.equal(training.refresh, true);
});

test('RULE-242 Ohne fällige Seite gewinnt die schwächste Seite unter 90 Prozent', async () => {
  const env = await full((app) => {
    app.stars = { start: 2, weiter: 2 };
    app.last = { start: DAY, weiter: DAY };
    app.acc = { start: 0.8, weiter: 0.6 };
  });
  const training = env.model().training;
  assert.equal(training.unitTitle, 'Zweite Seite');
  assert.equal(training.reason, 'Hier ist noch Luft nach oben');
});

test('RULE-242 Seiten mit drei Sternen werden nicht als schwach empfohlen', async () => {
  const env = await full((app) => {
    app.stars = { start: 3, weiter: 3 };
    app.last = { start: DAY, weiter: DAY };
    app.acc = { start: 0.5, weiter: 0.5 };
  });
  assert.equal(env.model().training, null);
});

test('RULE-258 Das Strangetikett erscheint nur an Seiten, die einen Strang haben', async () => {
  const env = await full((app) => {
    app.stars = { start: 2, weiter: 2 };
    app.last = { start: DAY, weiter: DAY };
    app.acc = { weiter: 0.5 };
  });
  const training = env.model().training;
  assert.equal(training.unitTitle, 'Zweite Seite');
  assert.equal(training.track.label, 'LRS-Förderung');
  assert.match(renderToStaticMarkup(h(TrackLabel, { track: training.track })), /LRS-Förderung/);
  assert.equal(renderToStaticMarkup(h(TrackLabel, { track: null })), '');
});

test('RULE-258 Eine Seite ohne Strang bekommt kein Etikett', async () => {
  const env = await full((app) => {
    app.stars = { start: 2, weiter: 3 };
    app.last = { start: DAY, weiter: DAY };
    app.acc = { start: 0.5 };
  });
  const training = env.model().training;
  assert.equal(training.unitTitle, 'Erste Seite');
  assert.equal(training.track, null);
  const markup = renderToStaticMarkup(h(Startseite, { state: env.state }));
  assert.equal((markup.match(/class="trk/g) || []).length, 0, 'kein Etikett im ganzen Markup');
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

test('RULE-206 Der gesperrte Endgegner steht als Text in der Kachel und nennt die fehlenden Seiten', async () => {
  const env = await full((app) => { app.stars = { start: 2 }; });
  const tile = tileOf(env.model(), 'mathe');
  assert.equal(tile.boss.open, false);
  assert.equal(tile.boss.text, 'Endgegner gesperrt: noch 1 Seite ohne Stern.');
});

test('RULE-206 Ist der Endgegner offen, sagt die Kachel das ebenfalls als Text', async () => {
  const env = await full((app) => { app.stars = { start: 1, weiter: 1 }; });
  assert.equal(tileOf(env.model(), 'mathe').boss.text, 'Endgegner offen.');
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

test('SEITE-SPEICHER-FEHLER Ein Ladefehler einer App zeigt ihre Meldung, die anderen Kacheln bleiben', async () => {
  const boot = await bootFixture({ failing: ['deutsch'] });
  const model = startseiteModel({ day: DAY, storage: boot.state.storage, profileStore: boot.state.profileStore, apps: boot.state.apps });
  assert.equal(tileOf(model, 'deutsch').kind, 'error');
  assert.equal(tileOf(model, 'deutsch').message, MSG.appLoad);
  assert.equal(tileOf(model, 'mathe').kind, 'live');
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
  const css = readFileSync(new URL('../seiten.css', import.meta.url), 'utf8');
  assert.match(css, /min-height: var\(--touch-min\)/);
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
