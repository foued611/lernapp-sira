// Startseite: Begrüßung, Tagesziel, Weiterlernen und Kacheln aller Apps mit Fortschritt. Das Markup folgt
// legacy/modulare/dashboard.js und index.html (Pixelparität, analysis/modulare/PARITAET.md). startseiteModel ist rein.
// Die Komponenten zeichnen nur. Seiten ist die Wurzel (Start oder App).
import { createElement, useReducer, useState } from 'react';
import { DAILY_GOAL_XP, GOAL_CHOICES, REFRESH_BONUS_XP, currentStreak, dailyGoal, dailyXP, setDailyGoal } from '../regeln/index.js';
import { starsOf } from '../helfer/index.js';
import { progressOf, doneUnits } from '../komponenten/ui.js';
import { Mascot } from '../komponenten/mascot.js';
import { bossOpen, recommendationOf } from './ablauf.js';
import { AppFrame } from './rahmen.js';
import { NAME_MAX, NO_STORAGE, greetingOf, maskName, saveName } from './name.js';
import { Sicherung } from './sicherung.js';
import { LIVE, SUBJECT_COLORS, subjectsOf, unitTrack } from './registry.js';
import { MSG } from './boot.js';

const h = createElement;

export const ALL = 'Alle';
export { MASK, NAME_MAX, greetingOf, maskName, nameFrom, saveName } from './name.js';

/** Minous Satz zum Tagesstand, wie legacy dashboard.js:25-26. */
export function minouLine(xp, goal = DAILY_GOAL_XP) {
  if (xp >= goal) return 'Tagesziel geschafft. Alles ab jetzt ist Bonus.';
  if (xp === 0) return 'Welche App heute? Fünf Minuten reichen schon.';
  return `Noch ${goal - xp} XP bis zum Tagesziel.`;
}

const hrefOf = (id) => `?app=${encodeURIComponent(id)}`;
const colorOf = (subject) => SUBJECT_COLORS[subject] || '#9B7BFF';

// Kachel ohne Fortschritt: Titel, Fach, Beschreibung und Link. Reicht für den leeren Zustand.
function linkTile(app) {
  const { entry } = app;
  const base = { id: entry.id, title: entry.title, subject: entry.subject, desc: entry.desc, color: colorOf(entry.subject) };
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
  const goal = dailyGoal(profile);
  const lastApp = profile.lastApp;
  return {
    mode: 'full',
    message: storage.status === 'memory' ? storage.message : null,
    subject,
    subjects,
    greeting: greetingOf(profile.name),
    needsName: !profile.name,
    minou: minouLine(x, goal),
    goal: { xp: Math.min(x, goal), goal, reached: x >= goal },
    streak: currentStreak(profile, day),
    totalXP: profile.xp,
    trophies: apps.reduce((sum, app) => sum + (app.appStore ? Object.keys(app.appStore.state.badges || {}).length : 0), 0),
    tiles: allTiles.filter(shown),
    // Die Weiter-Karte hängt an der App, nicht am Fach-Filter. Sonst verschwände sie bei jeder Auswahl.
    continueTile: allTiles.find((tile) => tile.kind === 'live' && tile.id === lastApp) || null,
    training: trainingOf(apps, day, lastApp)
  };
}

// Eine Kachel, wie legacy dashboard.js:50-60: Fach, Titel, Beschreibung, Stand und Balken.
function TileCard({ tile }) {
  const style = { '--c': tile.color };
  const head = [
    h('span', { key: 'tag', className: 'tag' }, tile.subject),
    h('h3', { key: 'title' }, tile.title),
    h('p', { key: 'desc' }, tile.desc)
  ];
  if (tile.kind === 'soon') {
    return h('div', { className: 'card tile soon', style }, ...head, h('span', { className: 'pill' }, 'Demnächst'));
  }
  if (tile.kind === 'error') {
    return h('div', { className: 'card tile error', style }, ...head, h('p', { className: 'notice', role: 'status' }, tile.message));
  }
  if (tile.kind === 'link') return h('a', { className: 'card tile', style, href: tile.href }, ...head);
  if (tile.kind === 'nostore') {
    return h('a', { className: 'card tile', style, href: tile.href }, ...head, h('p', { className: 'notice' }, tile.message));
  }
  return h(
    'a',
    { className: 'card tile', style, href: tile.href },
    ...head,
    h('div', { className: 'lab' }, tile.info),
    h('div', { className: 'bar', role: 'progressbar', 'aria-label': `Fortschritt in ${tile.title}`, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': tile.percent },
      h('i', { style: { width: `${tile.percent}%` } }))
  );
}

// Das Namensfeld im Legacy-Markup (div.name, input#nm, button.btn.sun). Ein leerer Name bleibt leer (nameFrom).
function NameForm({ onSave }) {
  const [value, setValue] = useState('');
  return h(
    'form',
    { className: 'name', onSubmit: (event) => { event.preventDefault(); onSave(value); } },
    h('input', { id: 'nm', type: 'text', value, maxLength: NAME_MAX, autoComplete: 'off', placeholder: 'Wie heißt du?', 'aria-label': 'Dein Name', onChange: (event) => setValue(event.target.value) }),
    h('button', { type: 'submit', className: 'btn sun' }, 'Los')
  );
}

/** Speichert das gewählte Tagesziel. Ein Wert außerhalb von GOAL_CHOICES wirft (RangeError). */
export async function saveGoal(profileStore, value) {
  if (!profileStore) return { ok: false, error: NO_STORAGE };
  setDailyGoal(profileStore.state, value);
  return profileStore.save();
}

/** Die Wahl des Tagesziels: eine Schaltfläche je Wert, die gewählte ist gedrückt und trägt den Wert als Text. */
export function GoalChoice({ goal, onChoose }) {
  return h(
    'div',
    { className: 'goalpick' },
    // Der Text steht sichtbar über den Schaltflächen. aria-label allein reicht Sehenden nicht.
    h('p', { className: 'muted', style: { margin: '0 0 8px', fontSize: '14px' } }, 'Tagesziel wählen'),
    h(
      'div',
      { className: 'chips', role: 'group', 'aria-label': 'Tagesziel wählen' },
      ...GOAL_CHOICES.map((value) => h('button', { key: value, type: 'button', className: 'chip', 'data-goal': value, 'aria-pressed': value === goal, onClick: () => onChoose(value) }, `${value} XP`))
    )
  );
}

/** Die Startseite. Hält nur die Fachauswahl und eine Meldung zum Tagesziel. Alles andere kommt aus dem Modell. */
export function Startseite({ state }) {
  const [subject, setSubject] = useState(ALL);
  const [goalNote, setGoalNote] = useState(null);
  const [, bump] = useReducer((n) => n + 1, 0);
  const model = startseiteModel({ day: state.day, storage: state.storage, profileStore: state.profileStore, apps: state.apps, subject });
  const full = model.mode === 'full';
  const cont = full ? model.continueTile : null;
  async function saveNameAndRedraw(raw) {
    await saveName(state.profileStore, raw);
    bump();
  }
  async function chooseGoal(value) {
    const saved = await saveGoal(state.profileStore, value);
    setGoalNote(saved.ok ? null : saved.error || 'Das Tagesziel konnte nicht gespeichert werden.');
    bump();
  }
  return h(
    'div',
    { className: 'shell dash' },
    h('div', { className: 'brand' }, 'Lernwerkstatt'),
    h(
      'section',
      { className: 'card hero', id: 'hero' },
      h('div', { className: 'row1' }, h(Mascot, { mood: 'happy' }), h('div', null,
        h('h1', null, full ? `${model.greeting.replace(/!$/, '')} !` : 'Hallo!'),
        h('div', { className: 'bubble', style: { marginTop: '10px' } }, full ? model.minou : 'Ohne Speicher zeigt diese Seite keinen Fortschritt.'))),
      full && model.needsName ? h(NameForm, { onSave: saveNameAndRedraw }) : null,
      full
        ? h(
          'div',
          { className: 'stats', style: { gap: '14px 24px', flexWrap: 'wrap' } },
          h('div', { className: 'ring', role: 'img', 'aria-label': `Tagesziel ${model.goal.xp} von ${model.goal.goal} XP` },
            h('svg', { viewBox: '0 0 76 76' },
              h('circle', { className: 't', cx: 38, cy: 38, r: 32, fill: 'none', strokeWidth: 8 }),
              h('circle', { className: 'p', cx: 38, cy: 38, r: 32, fill: 'none', strokeWidth: 8, strokeLinecap: 'round', strokeDasharray: (2 * Math.PI * 32).toFixed(1), strokeDashoffset: (2 * Math.PI * 32 * (1 - model.goal.xp / model.goal.goal)).toFixed(1) })),
            h('b', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }, String(model.goal.xp), h('small', { style: { display: 'block', lineHeight: 1, fontSize: '11px', fontWeight: 600 } }, `/ ${model.goal.goal}`))),
          h('div', { className: 'stat' }, h('b', null, String(model.streak)), h('span', null, 'Tage in Folge')),
          h('div', { className: 'stat' }, h('b', null, String(model.totalXP)), h('span', null, 'XP gesamt')),
          h('div', { className: 'stat' }, h('b', null, String(model.trophies)), h('span', null, 'Trophäen'))
        )
        : null,
      full ? h(GoalChoice, { goal: model.goal.goal, onChoose: chooseGoal }) : null,
      full && goalNote ? h('p', { className: 'notice', role: 'status' }, goalNote) : null
    ),
    model.message ? h('p', { className: 'notice', role: 'status' }, model.message) : null,
    cont
      ? h(
        'section',
        { className: 'card cont', style: { '--c': cont.color } },
        h('span', { className: 'dot' }),
        h('div', null, h('h3', null, `Weiter mit ${cont.title}`), h('p', { className: 'muted' }, cont.info)),
        h('a', { className: 'btn sun', href: cont.href }, 'Weiterlernen')
      )
      : null,
    h(
      'section',
      null,
      h('h2', null, 'Alle Lern-Apps'),
      h('div', { className: 'chips', role: 'group', 'aria-label': 'Nach Fach filtern' },
        ...model.subjects.map((s) => h('button', { key: s, type: 'button', className: 'chip', 'data-s': s, 'aria-pressed': s === subject, onClick: () => setSubject(s) }, s))),
      h('div', { className: 'grid' }, ...model.tiles.map((tile) => h(TileCard, { key: tile.id, tile }))),
      model.tiles.length === 0 ? h('div', { className: 'card empty', style: { display: 'block' } }, 'In diesem Fach gibt es noch keine App.') : null
    )
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
