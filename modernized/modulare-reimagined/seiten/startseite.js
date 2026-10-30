// Startseite: Begrüßung, Tagesziel, Weiterlernen und Kacheln aller Apps mit Fortschritt. Das Markup folgt
// legacy/modulare/dashboard.js und index.html (Pixelparität, analysis/modulare/PARITAET.md). startseiteModel ist rein.
// Die Komponenten zeichnen nur. Seiten ist die Wurzel (Start oder App).
import { createElement, useReducer, useState } from 'react';
import { DAILY_GOAL_XP, GOAL_CHOICES, currentStreak, dailyGoal, dailyXP, setDailyGoal } from '../regeln/index.js';
import { progressOf, doneUnits } from '../komponenten/ui.js';
import { Mascot } from '../komponenten/mascot.js';
import { Icon } from '../komponenten/icons.js';
import { AppFrame } from './rahmen.js';
import { NAME_MAX, NO_STORAGE, greetingOf, maskName, saveName } from './name.js';
import { Sicherung } from './sicherung.js';
import { ThemeToggle } from './thema.js';
import { Suche } from './suche.js';
import { LIVE, SUBJECT_COLORS, beforeKlasse, inKlasse, klassenOf, subjectsOf } from './registry.js';
import { DEFAULT_KLASSE } from './ablauf.js';
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
const colorOf = (fach) => SUBJECT_COLORS[fach] || '#9B7BFF';

// Kachel ohne Fortschritt: Titel, Fach, Beschreibung und Link. Reicht für den leeren Zustand.
function linkTile(app) {
  const { entry } = app;
  const base = { id: entry.id, title: entry.title, subject: entry.subject, fach: entry.fach, lehrwerk: entry.lehrwerk, desc: entry.desc, color: colorOf(entry.fach) };
  if (entry.status !== LIVE) return { ...base, kind: 'soon' };
  return { ...base, kind: 'link', href: hrefOf(entry.id) };
}

// Kachel mit Fortschritt. Erledigt ab 2 von 3 Sternen (RULE-075), Prozent als Text, auf 0 bis 100 begrenzt.
// Endgegner und Gezieltes Training stehen wie im Legacy nur auf der App-Startseite (apphome.js), nicht hier.
function progressTile(app) {
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
    info: started ? `${done} von ${total} Seiten · ${state.xp} XP` : 'Noch nicht gestartet'
  };
}

// Die Kachel je App. Ohne Stand (Fehler oder kein Speicher) steht die Meldung dort, nicht eine Null.
function tileOf(app) {
  if (app.entry.status !== LIVE) return linkTile(app);
  if (!app.appStore) return { ...linkTile(app), kind: 'nostore', message: app.storeMessage || MSG.unavailable };
  return progressTile(app);
}

/** Kacheln je Fach, in der Reihenfolge des ersten Auftretens. Mathe und Geometrie stehen so auf einer Karte. */
export function faecherOf(tiles) {
  const faecher = [];
  for (const tile of tiles) {
    let fach = faecher.find((item) => item.fach === tile.fach);
    if (!fach) faecher.push((fach = { fach: tile.fach, subject: tile.subject, color: tile.color, tiles: [] }));
    fach.tiles.push(tile);
  }
  return faecher;
}

// Die gezeigte Klasse: die Wahl, sonst das Profil. Gibt es sie im Katalog nicht, gilt die höchste vorhandene.
function klasseOf(klassen, wanted) {
  return klassen.includes(wanted) ? wanted : klassen.at(-1) ?? wanted;
}

/**
 * Die Ansicht der Startseite als Daten. Ohne Speicher (profileStore null) gibt es den leeren Zustand:
 * eine Meldung und nur Links, kein Fortschritt (RULE-202). Sonst die volle Ansicht.
 */
export function startseiteModel({ day, storage, profileStore, apps, subject = ALL, klasse = null }) {
  const klassen = klassenOf(apps.map((app) => app.entry));
  const current = klasseOf(klassen, klasse ?? profileStore?.state.klasse ?? DEFAULT_KLASSE);
  const here = apps.filter((app) => inKlasse(app.entry, current));
  const earlier = apps.filter((app) => beforeKlasse(app.entry, current));
  const subjects = [ALL, ...subjectsOf(here.map((app) => app.entry))];
  const shown = (tile) => subject === ALL || tile.subject === subject;
  const klassenInfo = { klasse: current, klassen };
  if (!profileStore) {
    return {
      mode: 'empty',
      message: storage.message || MSG.unavailable,
      subject,
      subjects,
      ...klassenInfo,
      tiles: here.map(linkTile).filter(shown),
      earlierTiles: earlier.map(linkTile)
    };
  }
  const profile = profileStore.state;
  const allTiles = apps.map(tileOf);
  const tilesOf = (list) => allTiles.filter((tile) => list.some((app) => app.entry.id === tile.id));
  const x = dailyXP(profile, day);
  const goal = dailyGoal(profile);
  const lastApp = profile.lastApp;
  return {
    mode: 'full',
    message: storage.status === 'memory' ? storage.message : null,
    subject,
    subjects,
    ...klassenInfo,
    greeting: greetingOf(profile.name),
    needsName: !profile.name,
    minou: minouLine(x, goal),
    goal: { xp: Math.min(x, goal), goal, reached: x >= goal },
    streak: currentStreak(profile, day),
    totalXP: profile.xp,
    trophies: apps.reduce((sum, app) => sum + (app.appStore ? Object.keys(app.appStore.state.badges || {}).length : 0), 0),
    tiles: tilesOf(here).filter(shown),
    earlierTiles: tilesOf(earlier),
    // Die Weiter-Karte hängt an der App, nicht am Fach-Filter. Sonst verschwände sie bei jeder Auswahl.
    continueTile: allTiles.find((tile) => tile.kind === 'live' && tile.id === lastApp) || null
  };
}

// Stand und Balken einer App.
const progressOfTile = (tile) => [
  h('div', { key: 'lab', className: 'lab' }, tile.info),
  h('div', { key: 'bar', className: 'bar', role: 'progressbar', 'aria-label': `Fortschritt in ${tile.title}`, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': tile.percent },
    h('i', { style: { width: `${tile.percent}%` } }))
];

// Eine Kachel, wie legacy dashboard.js:50-60: Fach, Titel, Beschreibung, Stand und Balken.
function TileCard({ tile }) {
  const style = { '--c': tile.color };
  const head = [
    h('span', { key: 'tag', className: 'tag' }, tile.subject),
    h('h3', { key: 'title' }, tile.title),
    tile.lehrwerk ? h('small', { key: 'buch', className: 'buch' }, tile.lehrwerk) : null,
    h('p', { key: 'desc' }, tile.desc)
  ];
  if (tile.kind === 'soon') {
    return h('div', { className: 'card tile soon', style }, ...head, h('span', { className: 'pill' }, 'Demnächst'));
  }
  if (tile.kind === 'link') return h('a', { className: 'card tile', style, href: tile.href }, ...head);
  if (tile.kind === 'nostore') {
    return h('a', { className: 'card tile', style, href: tile.href }, ...head, h('p', { className: 'notice' }, tile.message));
  }
  return h('a', { className: 'card tile', style, href: tile.href }, ...head, ...progressOfTile(tile));
}

// Eine App auf der Karte eines Fachs mit mehreren Apps.
function CourseRow({ tile }) {
  const head = [h('h3', { key: 'title' }, tile.title), tile.lehrwerk ? h('small', { key: 'buch', className: 'buch' }, tile.lehrwerk) : null, h('p', { key: 'desc' }, tile.desc)];
  if (tile.kind === 'soon') return h('div', { className: 'course' }, ...head, h('span', { className: 'pill' }, 'Demnächst'));
  const notice = tile.kind === 'nostore' ? [h('p', { key: 'note', className: 'notice' }, tile.message)] : [];
  return h('a', { className: 'course', href: tile.href }, ...head, ...notice, ...(tile.kind === 'live' ? progressOfTile(tile) : []));
}

// Eine Kachel je Fach. Hat das Fach nur eine App, bleibt es die Kachel dieser App.
function FachCard({ fach }) {
  if (fach.tiles.length === 1) return h(TileCard, { tile: fach.tiles[0] });
  return h(
    'div',
    { className: 'card tile fach', style: { '--c': fach.color } },
    h('span', { className: 'tag' }, fach.subject),
    ...fach.tiles.map((tile) => h(CourseRow, { key: tile.id, tile }))
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
      // Das Häkchen zeigt die Wahl auch ohne Farbe, aria-pressed sagt sie dem Screenreader.
      ...GOAL_CHOICES.map((value) => h('button', { key: value, type: 'button', className: 'chip', 'data-goal': value, 'aria-pressed': value === goal, onClick: () => onChoose(value) }, `${value} XP`, value === goal ? h(Icon, { name: 'check' }) : null))
    )
  );
}

/** Speichert die Klasse. Eine Klasse außerhalb des Katalogs wird nicht gespeichert. */
export async function saveKlasse(profileStore, klasse, klassen) {
  if (!klassen.includes(klasse)) return { ok: false, skipped: true };
  if (!profileStore) return { ok: false, error: NO_STORAGE };
  profileStore.state.klasse = klasse;
  return profileStore.save();
}

/** Die Wahl der Klasse. Mit nur einer Klasse im Katalog gibt es nichts zu wählen, dann fehlt sie. */
export function KlassenWahl({ klasse, klassen, onChoose }) {
  if (klassen.length < 2) return null;
  return h(
    'div',
    { className: 'chips', role: 'group', 'aria-label': 'Deine Klasse' },
    ...klassen.map((value) => h('button', { key: value, type: 'button', className: 'chip', 'data-klasse': value, 'aria-pressed': value === klasse, onClick: () => onChoose(value) }, `Klasse ${value}`, value === klasse ? h(Icon, { name: 'check' }) : null))
  );
}

/** Die Startseite. Hält nur Fach- und Klassenwahl und eine Meldung zum Tagesziel. Alles andere kommt aus dem Modell. */
export function Startseite({ state }) {
  const [subject, setSubject] = useState(ALL);
  const [klasse, setKlasse] = useState(null);
  const [goalNote, setGoalNote] = useState(null);
  const [, bump] = useReducer((n) => n + 1, 0);
  const model = startseiteModel({ day: state.day, storage: state.storage, profileStore: state.profileStore, apps: state.apps, subject, klasse });
  const full = model.mode === 'full';
  const cont = full ? model.continueTile : null;
  async function saveNameAndRedraw(raw) {
    await saveName(state.profileStore, raw);
    bump();
  }
  // Die Wahl gilt sofort, auch ohne Speicher. Sie wird nur dann gemerkt, wenn es einen gibt.
  async function chooseKlasse(value) {
    setKlasse(value);
    setSubject(ALL);
    await saveKlasse(state.profileStore, value, model.klassen);
  }
  async function chooseGoal(value) {
    const saved = await saveGoal(state.profileStore, value);
    setGoalNote(saved.ok ? null : saved.error || 'Das Tagesziel konnte nicht gespeichert werden.');
    bump();
  }
  return h(
    'div',
    { className: 'shell dash' },
    h('div', { className: 'dashtop' }, h('div', { className: 'brand' }, 'Lernwerkstatt'), h(ThemeToggle)),
    h(Suche, { apps: state.apps.map((app) => app.entry) }),
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
      h('h2', null, model.klassen.length > 1 ? `Lern-Apps für Klasse ${model.klasse}` : 'Alle Lern-Apps'),
      h(KlassenWahl, { klasse: model.klasse, klassen: model.klassen, onChoose: chooseKlasse }),
      h('div', { className: 'chips', role: 'group', 'aria-label': 'Nach Fach filtern' },
        ...model.subjects.map((s) => h('button', { key: s, type: 'button', className: 'chip', 'data-s': s, 'aria-pressed': s === subject, onClick: () => setSubject(s) }, s))),
      h('div', { className: 'grid' }, ...faecherOf(model.tiles).map((fach) => h(FachCard, { key: fach.fach, fach }))),
      model.tiles.length === 0 ? h('div', { className: 'card empty', style: { display: 'block' } }, 'In diesem Fach gibt es noch keine App.') : null,
      // Stoff früherer Klassen bleibt zum Wiederholen erreichbar, aber aus dem Weg.
      model.earlierTiles.length
        ? h('details', { className: 'pgroup frueher' },
          h('summary', null, h('span', null, 'Aus früheren Klassen'), h('span', { className: 'muted' }, `${model.earlierTiles.length} ${model.earlierTiles.length === 1 ? 'App' : 'Apps'}`)),
          h('div', { className: 'grid' }, ...faecherOf(model.earlierTiles).map((fach) => h(FachCard, { key: fach.fach, fach }))))
        : null
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
    return h(AppFrame, { app, profileStore: state.profileStore, day: state.day, storage: state.storage, startUnit: state.route.unitId });
  }
  return h(Startseite, { state });
}
