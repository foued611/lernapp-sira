// Startseite: Begrüßung, Tagesziel, Kacheln aller Apps mit Fortschritt in Prozent, Weiterlernen, Training
// und Sicherung. startseiteModel ist rein. Die Komponenten zeichnen nur. Seiten ist die Wurzel (Start oder App).
// Herkunft: legacy/modulare/dashboard.js und core/js/views/home.js (Begrüßung, Ring, Training, Kacheln).
import { createElement, useReducer, useState } from 'react';
import { DAILY_GOAL_XP, REFRESH_BONUS_XP, currentStreak, dailyXP } from '../regeln/index.js';
import { Button, ProgressBar, doneUnits, progressOf, starsOf } from '../komponenten/ui.js';
import { Mascot } from '../komponenten/mascot.js';
import { TrackLabel } from '../komponenten/tracks.js';
import { AppFrame, NO_STORAGE, bossOpen, recommendationOf } from './rahmen.js';
import { Sicherung } from './sicherung.js';
import { LIVE, subjectsOf, unitTrack } from './registry.js';
import { MSG } from './boot.js';

const h = createElement;

export const ALL = 'Alle';
export const NAME_MAX = 20;
// Der Name wird nie im Klartext gezeigt. Nur dieses Muster steht im Markup (SEITE-MASKIERUNG).
export const MASK = '•••';

export const maskName = (name) => (typeof name === 'string' && name.trim() !== '' ? MASK : '');
export const greetingOf = (name) => (maskName(name) ? `Hallo, ${MASK}!` : 'Hallo!');

/** Name aus dem Eingabefeld: ohne Rand-Leerzeichen, höchstens 20 Zeichen (legacy shell.js:121-122). */
export const nameFrom = (raw) => (typeof raw === 'string' ? raw.trim().slice(0, NAME_MAX) : '');

/** Speichert den Namen. Leer heißt: nichts tun, wie in der Legacy-App. */
export async function saveName(profileStore, raw) {
  const name = nameFrom(raw);
  if (!name) return { ok: false, skipped: true };
  if (!profileStore) return { ok: false, error: NO_STORAGE };
  profileStore.state.name = name;
  return profileStore.save();
}

const MINOU_START = Object.freeze([
  'Nur 2 Minuten, dann bist du schon im Spiel.',
  'Eine kurze Runde reicht für heute.',
  'Klein anfangen zählt. Fünf Aufgaben, mehr nicht.'
]);

// Ein fester Tag ergibt immer denselben Spruch. So bleibt die Anzeige testbar (AGENTS.md: Zufall nur testbar).
const dayIndex = (day) => [...day].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

/** Minous Satz zum Tagesstand (legacy dashboard.js:25-26, home.js:11-16). */
export function minouLine(xp, day) {
  if (xp >= DAILY_GOAL_XP) return 'Tagesziel geschafft. Alles ab jetzt ist Bonus.';
  if (xp === 0) return MINOU_START[dayIndex(day) % MINOU_START.length];
  return `Noch ${DAILY_GOAL_XP - xp} XP bis zum Tagesziel. Das ist ungefähr eine Runde.`;
}

const hrefOf = (id) => `?app=${encodeURIComponent(id)}`;

// Kachel ohne Fortschritt: Titel, Fach, Beschreibung und Link. Reicht für den leeren Zustand.
function linkTile(app) {
  const { entry } = app;
  const base = { id: entry.id, title: entry.title, subject: entry.subject, desc: entry.desc };
  if (entry.status !== LIVE) return { ...base, kind: 'soon' };
  return { ...base, kind: 'link', href: hrefOf(entry.id) };
}

// Der Endgegner in einer Kachel, als Text. Gesperrt heißt: "gesperrt", nicht nur eine andere Farbe (RULE-206).
function bossLine(app, profile) {
  const { config, units, appStore } = app;
  if (!config.rounds || typeof config.rounds.boss !== 'function') return null;
  const state = appStore.state;
  const unitIds = units.map((u) => u.id);
  const open = bossOpen({ app: state, unitIds, bossUnlocked: config.bossUnlocked, profile });
  if (open) return { open: true, text: 'Endgegner offen.' };
  if (config.bossUnlocked) return { open: false, text: 'Endgegner gesperrt.' };
  const missing = unitIds.filter((id) => starsOf(state.stars, id) === 0).length;
  return { open: false, text: `Endgegner gesperrt: noch ${missing} ${missing === 1 ? 'Seite' : 'Seiten'} ohne Stern.` };
}

// Kachel mit Fortschritt. Erledigt ab 2 von 3 Sternen (RULE-075), Prozent als Text, auf 0 bis 100 begrenzt.
function progressTile(app, profile) {
  const state = app.appStore.state;
  const unitIds = app.units.map((u) => u.id);
  const done = doneUnits(state.stars, unitIds);
  const total = unitIds.length;
  const started = done > 0 || state.xp > 0;
  return {
    ...linkTile(app),
    kind: 'live',
    done,
    total,
    percent: progressOf(done, total),
    info: started ? `${done} von ${total} Seiten · ${state.xp} XP` : 'Noch nicht gestartet',
    boss: bossLine(app, profile)
  };
}

// Die Kachel je App. Ohne Stand (Fehler oder kein Speicher) steht die Meldung dort, nicht eine Null.
function tileOf(app, profile) {
  if (app.entry.status !== LIVE) return linkTile(app);
  if (app.error) return { ...linkTile(app), kind: 'error', message: app.error };
  if (!app.appStore) return { ...linkTile(app), kind: 'nostore', message: app.storeMessage || MSG.unavailable };
  return progressTile(app, profile);
}

// Die Empfehlung für das Training. Erst die App, die zuletzt benutzt wurde, dann die übrigen (RULE-242).
function trainingOf(apps, day, lastApp) {
  const live = apps.filter((app) => app.entry.status === LIVE && app.appStore && app.config);
  const ordered = [...live.filter((app) => app.entry.id === lastApp), ...live.filter((app) => app.entry.id !== lastApp)];
  for (const app of ordered) {
    const rec = recommendationOf(app.appStore.state, app.units, day);
    if (rec) {
      return {
        appId: app.entry.id,
        appTitle: app.entry.title,
        href: hrefOf(app.entry.id),
        unitTitle: rec.unit.title,
        track: unitTrack(app.config.tracks, rec.unit),
        reason: rec.reason,
        refresh: rec.code === 'refresh'
      };
    }
  }
  return null;
}

/**
 * Die Ansicht der Startseite als Daten. Ohne Speicher (profileStore null) gibt es den leeren Zustand:
 * eine Meldung und nur Links, kein Fortschritt (RULE-202). Sonst die volle Ansicht.
 */
export function startseiteModel({ day, storage, profileStore, apps, subject = ALL }) {
  const subjects = [ALL, ...subjectsOf(apps.map((app) => app.entry))];
  const shown = (tile) => subject === ALL || tile.subject === subject;
  if (!profileStore) {
    return {
      mode: 'empty',
      message: storage.message || MSG.unavailable,
      subject,
      subjects,
      tiles: apps.map(linkTile).filter(shown)
    };
  }
  const profile = profileStore.state;
  const allTiles = apps.map((app) => tileOf(app, profile));
  const x = dailyXP(profile, day);
  const lastApp = profile.lastApp;
  return {
    mode: 'full',
    message: storage.status === 'memory' ? storage.message : null,
    subject,
    subjects,
    greeting: greetingOf(profile.name),
    needsName: !profile.name,
    minou: minouLine(x, day),
    goal: { xp: Math.min(x, DAILY_GOAL_XP), goal: DAILY_GOAL_XP, reached: x >= DAILY_GOAL_XP },
    streak: currentStreak(profile, day),
    totalXP: profile.xp,
    trophies: apps.reduce((sum, app) => sum + (app.appStore ? Object.keys(app.appStore.state.badges || {}).length : 0), 0),
    tiles: allTiles.filter(shown),
    // Die Weiter-Karte hängt an der App, nicht am Fach-Filter. Sonst verschwände sie bei jeder Auswahl.
    continueTile: allTiles.find((tile) => tile.kind === 'live' && tile.id === lastApp) || null,
    training: trainingOf(apps, day, lastApp)
  };
}

function TileCard({ tile }) {
  const head = [
    h('span', { key: 'tag', className: 'tag' }, tile.subject),
    h('h3', { key: 'title' }, tile.title),
    h('p', { key: 'desc' }, tile.desc)
  ];
  if (tile.kind === 'soon') {
    return h('article', { className: 'card tile soon' }, ...head, h('span', { className: 'pill' }, 'Demnächst'));
  }
  if (tile.kind === 'error') {
    return h('article', { className: 'card tile error' }, ...head, h('p', { className: 'notice', role: 'status' }, tile.message));
  }
  const open = h('span', { className: 'open' }, 'Öffnen');
  if (tile.kind === 'link') return h('a', { className: 'card tile', href: tile.href }, ...head, open);
  if (tile.kind === 'nostore') {
    return h('a', { className: 'card tile', href: tile.href }, ...head, h('p', { className: 'notice' }, tile.message), open);
  }
  return h(
    'a',
    { className: 'card tile', href: tile.href },
    ...head,
    h('p', { className: 'lab' }, tile.info),
    h(ProgressBar, { done: tile.done, total: tile.total, label: `Fortschritt in ${tile.title}` }),
    tile.boss ? h('p', { className: tile.boss.open ? 'boss open' : 'boss locked' }, tile.boss.text) : null,
    open
  );
}

function NameForm({ onSave }) {
  const [value, setValue] = useState('');
  return h(
    'form',
    { className: 'name', onSubmit: (event) => { event.preventDefault(); onSave(value); } },
    h('input', {
      id: 'nm',
      type: 'text',
      value,
      maxLength: NAME_MAX,
      autoComplete: 'off',
      placeholder: 'Wie heißt du?',
      'aria-label': 'Dein Name',
      onChange: (event) => setValue(event.target.value)
    }),
    h(Button, { type: 'submit', variant: 'sun' }, 'Los')
  );
}

/** Die Startseite. Hält nur die Fachauswahl und den Neuzeichnen-Zähler. Alles andere kommt aus dem Modell. */
export function Startseite({ state }) {
  const [subject, setSubject] = useState(ALL);
  const [, bump] = useReducer((n) => n + 1, 0);
  const model = startseiteModel({ day: state.day, storage: state.storage, profileStore: state.profileStore, apps: state.apps, subject });
  async function saveNameAndRedraw(raw) {
    await saveName(state.profileStore, raw);
    bump();
  }
  const full = model.mode === 'full';
  return h(
    'div',
    { className: 'seiten' },
    h(
      'section',
      { className: 'card hero' },
      h('div', { className: 'row1' }, h(Mascot, { mood: 'happy' }), h('div', null, h('h1', null, full ? model.greeting : 'Hallo!'), h('p', { className: 'bubble' }, full ? model.minou : 'Ohne Speicher zeigt diese Seite keinen Fortschritt.'))),
      full && model.needsName ? h(NameForm, { onSave: saveNameAndRedraw }) : null,
      full
        ? h(
          'div',
          { className: 'goal' },
          h('p', null, h('strong', null, `Tagesziel: ${model.goal.goal} XP. `), model.goal.reached ? 'Geschafft. Du bist heute fertig.' : 'Eine kurze Runde bringt dich nah ran.'),
          h('p', { className: 'goal-text' }, `${model.goal.xp} von ${model.goal.goal} XP heute`),
          h('div', { className: 'goal-bar', 'aria-hidden': 'true' }, h('i', { style: { width: `${Math.round((model.goal.xp / model.goal.goal) * 100)}%` } })),
          h('ul', { className: 'stats' },
            h('li', null, h('b', null, String(model.streak)), ' Tage in Folge'),
            h('li', null, h('b', null, String(model.totalXP)), ' XP gesamt'),
            h('li', null, h('b', null, String(model.trophies)), ' Trophäen'))
        )
        : null
    ),
    model.message ? h('p', { className: 'notice', role: 'status' }, model.message) : null,
    full && model.continueTile
      ? h('section', { className: 'card cont' }, h('h2', null, `Weiter mit ${model.continueTile.title}`), h('p', { className: 'muted' }, model.continueTile.info), h('a', { className: 'btn sun', href: model.continueTile.href }, 'Weiterlernen'))
      : null,
    full && model.training
      ? h(
        'section',
        { className: 'card training' },
        h('h2', null, 'Gezieltes Training'),
        h('p', null, `${model.training.reason}: `, h('b', null, model.training.unitTitle), ` in ${model.training.appTitle}.`,
          model.training.refresh ? ` Auffrischen bringt ${REFRESH_BONUS_XP} Bonus-XP.` : ''),
        h(TrackLabel, { track: model.training.track }),
        h('a', { className: 'btn', href: model.training.href }, 'Zur App')
      )
      : null,
    h(
      'nav',
      { className: 'chips', 'aria-label': 'Fach wählen' },
      ...model.subjects.map((s) => h('button', { key: s, type: 'button', className: 'chip', 'aria-pressed': s === subject, onClick: () => setSubject(s) }, s))
    ),
    model.tiles.length === 0
      ? h('p', { className: 'muted' }, 'Für dieses Fach gibt es keine App.')
      : h('div', { className: 'tiles' }, ...model.tiles.map((tile) => h(TileCard, { key: tile.id, tile }))),
    h(Sicherung, { handle: state.storage.handle, day: state.day, includeName: true })
  );
}

function Notice({ title, message, href = './' }) {
  return h(
    'section',
    { className: 'card notice-card' },
    h('h1', null, title),
    h('p', null, message),
    h('a', { className: 'btn', href }, 'Zur Startseite')
  );
}

/** Die Wurzel. Ohne gültige Liste eine Meldung. Mit ?app=<id> die App, sonst die Startseite. */
export function Seiten({ boot }) {
  if (!boot.ok) return h(Notice, { title: 'Das hat nicht geklappt', message: boot.message });
  const { state } = boot;
  if (state.route.appId) {
    const app = state.apps.find((item) => item.entry.id === state.route.appId);
    if (!app || app.entry.status !== LIVE) return h(Notice, { title: 'Diese App gibt es nicht.', message: 'Wähle eine App auf der Startseite.' });
    if (app.error) return h(Notice, { title: 'Das hat nicht geklappt', message: app.error });
    return h(AppFrame, { app, profileStore: state.profileStore, day: state.day, storage: state.storage });
  }
  return h(Startseite, { state });
}
