// Startseite einer App: Begrüßung, Tagesziel, Lernpfad, Spielmodi, Ausdrucken, Sammelalbum, Trophäen und
// Zurücksetzen. Das Markup folgt legacy/modulare/core/js/views/home.js (Pixelparität, analysis/modulare/PARITAET.md).
// Die Entscheidungen (Empfehlung, Endgegner offen) kommen von außen, damit es keinen Import-Kreis mit rahmen.js gibt.
import { createElement, useState } from 'react';
import { DAILY_GOAL_XP, MISSION_REWARD_XP, REFRESH_BONUS_XP, currentStreak, dailyGoal, dailyXP, isRefreshDue, levelOf, levelThreshold, missionProgress } from '../regeln/index.js';
import { LEVEL_TITLES, MISSION_TEXT } from './ergebnis.js';
import { ThemeToggle } from './thema.js';
import { pathGroups, starsOf, unitsInPath } from '../helfer/index.js';
import { doneUnits } from '../komponenten/ui.js';
import { Mascot } from '../komponenten/mascot.js';
import { Icon } from '../komponenten/icons.js';
import { TrackLabel } from '../komponenten/tracks.js';
import { BLITZ_SECONDS } from '../runde/index.js';
import { NAME_MAX, maskName } from './name.js';
import { unitTrack } from './registry.js';

const h = createElement;

// Die Sätze der Startansicht je Tagesstand (legacy home.js:11-16). Ein fester Tag ergibt immer denselben Satz.
const START_LINES = Object.freeze([
  'Nur 2 Minuten, dann bist du schon im Spiel.',
  'Eine kurze Runde reicht für heute.',
  'Klein anfangen zählt. Fünf Aufgaben, mehr nicht.'
]);
const dayIndex = (day) => [...String(day)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

export function minouOf(xp, day, goal = DAILY_GOAL_XP) {
  if (xp >= goal) return 'Tagesziel geschafft. Alles ab jetzt ist Bonus.';
  if (xp === 0) return START_LINES[dayIndex(day) % START_LINES.length];
  return `Noch ${goal - xp} XP bis zum Tagesziel. Das ist ungefähr eine Runde.`;
}

// Texte der Wochenmissionen stehen in ergebnis.js (MISSION_TEXT), weil die Ergebnisansicht sie auch nennt.

// Die Karte "Diese Woche". Der Stand ist Text ("Erledigt" oder "Offen") mit Häkchen, nicht nur eine Farbe.
function WeekCard({ profile, day }) {
  return h(
    'section',
    { className: 'card week', 'aria-labelledby': 'week-h' },
    h('h2', { id: 'week-h' }, 'Diese Woche'),
    h('p', { className: 'muted', style: { margin: '4px 0 12px', fontSize: '14px' } }, `Drei Missionen. Jede bringt einmal pro Woche ${MISSION_REWARD_XP} XP. Am Montag geht es von vorn los.`),
    h('ul', { className: 'missions' }, ...missionProgress(profile, day).map(({ id, need, count, done }) => {
      const text = MISSION_TEXT[id];
      return h(
        'li',
        { key: id, className: `mission${done ? ' done' : ''}` },
        h('span', { className: 'mark' }, done ? h(Icon, { name: 'check' }) : null, done ? 'Erledigt' : 'Offen'),
        h('span', { className: 'mtext' }, h('b', null, text.title), h('small', null, `${count} von ${need} ${text.unit(need)}`))
      );
    }))
  );
}

// Die Sterne einer Seite, wie legacy home.js:8-9: sichtbar als Symbole, dazu der Text für Screenreader.
function Stars({ n }) {
  return h(
    'span',
    { className: 'stars', 'aria-label': `${n} von 3 Sternen` },
    [1, 2, 3].map((i) => h('span', { key: i, className: i <= n ? 'on' : '' }, h(Icon, { name: 'star' })))
  );
}

// Zustand einer Station. "fällig" hat Vorrang, weil das Auffrischen die nächste sinnvolle Handlung ist.
export function stationState(app, unit, day) {
  const n = starsOf(app.stars, unit.id);
  if (n <= 0) return 'offen';
  if (isRefreshDue(app, unit.id, day)) return 'fällig';
  return n >= 3 ? 'gemeistert' : 'geübt';
}

// Text und Symbol je Zustand. Das Symbol ist dekorativ (Icon ist aria-hidden), der Text trägt die Bedeutung.
const STATION_TEXT = Object.freeze({
  offen: { label: 'Offen', icon: null },
  geübt: { label: 'Geübt', icon: 'star' },
  gemeistert: { label: 'Gemeistert', icon: 'check' },
  fällig: { label: 'Zeit zum Auffrischen', icon: 'flame' }
});

/**
 * Rückweg zum Lernpfad: bringt die Station in den Blick und setzt den Fokus auf ihren Knopf, damit es auch mit der
 * Tastatur dort weitergeht. Gibt false zurück, wenn es die Station nicht gibt. root ist das Dokument.
 */
export function revealStation(root, unitId) {
  const station = root.querySelector(`[data-unit="${unitId}"]`);
  if (!station) return false;
  station.scrollIntoView({ block: 'center' });
  station.querySelector('button')?.focus({ preventScroll: true });
  return true;
}

// Eine Station der Lernpfad-Karte: ein Knopf mit Titel, Zustand als Wort und Symbol und den Sternen.
function Station({ unit, track, state, stars, next, onStudy }) {
  const { label, icon } = STATION_TEXT[state];
  return h(
    'li',
    { className: 'station', 'data-unit': unit.id },
    h(
      'button',
      { type: 'button', className: `node${next ? ' next' : ''}`, style: { '--lc': unit.color }, 'aria-current': next ? 'step' : undefined, onClick: () => onStudy(unit) },
      h('span', { className: 'circ' }, unit.ic),
      h('span', null,
        // Ein span statt h3: Überschriften gehören nicht in einen Knopf. Die Optik kommt aus .node .stitle.
        h('span', { className: 'stitle' }, unit.title),
        h('small', null, unit.de),
        h(TrackLabel, { track }),
        h('span', { className: `state s-${state}` }, icon ? h(Icon, { name: icon }) : h('span', { className: 'dot', 'aria-hidden': 'true' }), label),
        next ? h('span', { className: 'nexttag' }, 'Als Nächstes') : null),
      h(Stars, { n: stars })
    )
  );
}

// Der Ring mit dem Tagesstand. Gleiche Maße wie in Legacy (viewBox 76, Radius 32).
function Ring({ xp, goal }) {
  const C = 2 * Math.PI * 32;
  const ratio = Math.min(1, xp / goal);
  return h(
    'div',
    { className: 'ring', role: 'img', 'aria-label': `Tagesziel ${Math.min(xp, goal)} von ${goal} XP` },
    h('svg', { viewBox: '0 0 76 76' },
      h('circle', { className: 't', cx: 38, cy: 38, r: 32, fill: 'none', strokeWidth: 8 }),
      h('circle', { className: 'p', cx: 38, cy: 38, r: 32, fill: 'none', strokeWidth: 8, strokeLinecap: 'round', strokeDasharray: C.toFixed(1), strokeDashoffset: (C * (1 - ratio)).toFixed(1) })),
    h('b', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }, String(Math.min(xp, goal)), h('small', { style: { display: 'block', lineHeight: 1, fontSize: '11px', fontWeight: 600 } }, `/ ${goal}`))
  );
}

// Namensfeld, solange kein Name gespeichert ist (legacy home.js:17). Ein leerer Name bleibt leer.
function NameForm({ onSave }) {
  const [value, setValue] = useState('');
  return h(
    'form',
    { className: 'name', onSubmit: (event) => { event.preventDefault(); onSave(value); } },
    h('input', { id: 'nm', type: 'text', value, maxLength: NAME_MAX, autoComplete: 'off', placeholder: 'Wie heißt du?', 'aria-label': 'Dein Name', onChange: (event) => setValue(event.target.value) }),
    h('button', { type: 'submit', className: 'btn sun' }, 'Los')
  );
}

// Der Reset in zwei Schritten (RULE-133): erst "zurücksetzen", dann die Bestätigung.
function ResetLine({ phase, onReset }) {
  return phase === 'ask'
    ? h('button', { type: 'button', className: 'link', onClick: () => onReset('confirm') }, 'Wirklich alles löschen?')
    : h('button', { type: 'button', className: 'link', onClick: () => onReset('start') }, 'Fortschritt dieser App zurücksetzen');
}

/**
 * Die App-Startseite. Props: config, app (Stand), profile, day, rec (Empfehlung oder null), open (Endgegner offen),
 * notice, storeMessage, persistent (Speicher bleibt über den Besuch hinaus), resetPhase, profileStore, onStudy, onStart,
 * onReset, onName, focusId (Station, von der die Person gerade kommt).
 */
export function AppHome({ config, app, profile, day, rec, open, notice, storeMessage, persistent = false, resetPhase, profileStore, onStudy, onStart, onReset, onName, focusId = null, footer = null }) {
  const units = config.units;
  const done = doneUnits(app.stars, units.map((u) => u.id));
  const x = dailyXP(profile, day);
  const goal = dailyGoal(profile);
  const masked = maskName(profile.name);
  const greeting = `${config.greeting || 'Hallo'}${masked ? `, ${masked}` : ''} !`;
  const bossHasRounds = Boolean(config.rounds && typeof config.rounds.boss === 'function');
  const cardUnits = units.filter((u) => u.card);
  const medal = ['', 'Bronze', 'Silber', 'Gold'];
  // Die nächste Station: zuerst eine fällige (Auffrischen geht vor), sonst die erste ohne Stern.
  // Sie wird nur hervorgehoben, nie gesperrt.
  const path = unitsInPath(units, config.groups);
  const nextUnit = path.find((u) => stationState(app, u, day) === 'fällig') || path.find((u) => starsOf(app.stars, u.id) === 0);
  const nextId = nextUnit ? nextUnit.id : null;
  const started = units.some((u) => starsOf(app.stars, u.id) > 0);

  return h(
    'div',
    { className: 'app-home', style: { display: 'grid', gap: '26px' } },
    notice ? h('p', { className: 'notice', role: 'status' }, notice) : null,
    storeMessage ? h('p', { className: 'notice', role: 'status' }, storeMessage) : null,
    h(
      'section',
      { className: 'card hero' },
      h('div', { className: 'row1' }, h(Mascot, { mood: 'happy' }), h('div', null,
        h('h1', null, greeting),
        h('div', { className: 'bubble', style: { marginTop: '10px' } }, minouOf(x, day, goal)))),
      !profile.name && profileStore ? h(NameForm, { onSave: onName }) : null,
      h(
        'div',
        { className: 'goalbox' },
        h(Ring, { xp: x, goal }),
        h('p', null,
          h('strong', null, `Tagesziel: ${goal} XP`),
          ` ${x >= goal ? 'Geschafft. Du bist heute fertig.' : 'Eine kurze Runde bringt dich nah ran.'}`,
          // Das Tagesziel zählt XP aus allen Apps. Der Seitenstand gilt nur für diese App, deshalb getrennt.
          h('span', { style: { display: 'block', marginTop: '4px' } }, `In dieser App: ${done} von ${units.length} Seiten geschafft.`)),
        // Die Schnellrunde wiederholt. Wer noch nichts geübt hat, startet mit der Theorie der ersten Seite.
        started
          ? (config.rounds && typeof config.rounds.quick === 'function'
            ? h('button', { type: 'button', className: 'btn sun', onClick: () => onStart('quick') }, '2-Minuten-Runde')
            : null)
          : nextUnit
            ? h('button', { type: 'button', className: 'btn sun', onClick: () => onStudy(nextUnit) }, `Starte mit ${nextUnit.title}`)
            : null
      )
    ),
    h(WeekCard, { profile, day }),
    h(
      'section',
      null,
      h('h2', null, 'Dein Lernpfad'),
      h('p', { className: 'muted', style: { margin: '4px 0 14px', fontSize: '14px' } }, config.intro || 'Starte irgendwo. Die Reihenfolge ist nur ein Vorschlag.'),
      ...pathGroups(units, config.groups).map(({ title, units: inGroup }) => {
        const path = h(
          'ol',
          { className: 'path' },
          ...inGroup.map((u) => h(Station, { key: u.id, unit: u, track: unitTrack(config.tracks, u), state: stationState(app, u, day), stars: starsOf(app.stars, u.id), next: u.id === nextId, onStudy }))
        );
        if (!title) return path;
        const geschafft = doneUnits(app.stars, inGroup.map((u) => u.id));
        // details/summary: ohne Skript bedienbar, mit Tastatur und Screenreader. Offen ist die Gruppe mit der nächsten Seite und die, aus der die Person gerade kommt.
        return h(
          'details',
          { key: title, className: 'pgroup', open: inGroup.some((u) => u.id === nextId || u.id === focusId) || undefined },
          h('summary', null, h('span', null, title), h('span', { className: 'muted' }, `${geschafft} von ${inGroup.length} geschafft`)),
          path
        );
      })
    ),
    h(
      'section',
      null,
      h('h2', null, 'Spielmodi'),
      h(
        'div',
        { className: 'modes', style: { marginTop: '12px' } },
        rec
          ? h('div', { className: 'card' },
            h('h3', null, 'Gezieltes Training'),
            h('p', null, `${rec.reason}: `, h('b', null, rec.unit.title), `. Wer gezielt Schwächen übt, lernt am schnellsten. Auffrischen bringt außerdem ${REFRESH_BONUS_XP} Bonus-XP.`),
            h('button', { type: 'button', className: 'btn', onClick: () => onStudy(rec.unit) }, 'Jetzt trainieren'))
          : null,
        config.blitz
          ? h('div', { className: 'card' },
            h('h3', null, 'Blitz'),
            h('p', null, `${BLITZ_SECONDS} Sekunden Tempo. Wie viele schaffst du? Bestwert: `, h('b', null, app.best.blitz || 0)),
            h('button', { type: 'button', className: 'btn', onClick: () => onStart('blitz') }, 'Blitz starten'))
          : null,
        bossHasRounds
          ? h('div', { className: 'card' },
            h('h3', null, config.bossTitle || 'Endgegner'),
            h('p', null, open ? '12 gemischte Aufgaben mit nur 3 Herzen. Wer gewinnt, bekommt 50 Bonus-XP.' : 'Der Endgegner wartet, sobald alle Seiten mindestens einen Stern haben.'),
            h('button', { type: 'button', className: 'btn', disabled: !open, onClick: () => onStart('boss') }, open ? 'Endgegner starten' : 'Noch gesperrt'))
          : null
      )
    ),
    (config.resources || []).length
      ? h(
        'section',
        null,
        h('h2', null, 'Zum Ausdrucken'),
        h('div', { className: 'modes', style: { marginTop: '12px' } }, ...config.resources.map((r) => h(
          'div',
          { key: r.title, className: 'card' },
          h('h3', null, r.title),
          h(TrackLabel, { track: unitTrack(config.tracks, r) }),
          r.desc ? h('p', null, r.desc) : null,
          h('a', { className: 'btn ghost', href: r.href, target: '_blank', rel: 'noopener' }, 'Öffnen')
        )))
      )
      : null,
    cardUnits.length
      ? h(
        'section',
        null,
        h('h2', null, 'Sammelalbum'),
        h('p', { className: 'muted', style: { margin: '4px 0 14px', fontSize: '14px' } }, 'Für jede Seite gibt es eine Karte. Mit mehr Sternen wird sie wertvoller: Bronze, Silber, Gold.'),
        h('div', { className: 'album' }, ...cardUnits.map((u) => {
          const n = starsOf(app.stars, u.id);
          return n
            ? h('article', { key: u.id, className: `gcard t${n}`, style: { '--lc': u.color } }, h('span', { className: 'medal' }, medal[n]), h('h3', null, u.card.name), h('p', null, u.card.fact))
            : h('article', { key: u.id, className: 'gcard t0' }, h('span', { className: 'medal' }, 'Gesperrt'), h('h3', null, 'Geheimkarte'), h('p', null, `Übe die Seite „${u.title}“, um sie freizuschalten.`));
        }))
      )
      : null,
    h(
      'section',
      null,
      h('h2', null, 'Trophäen'),
      h('div', { className: 'badges', style: { marginTop: '12px' } }, ...config.badges.map((b) => h(
        'div',
        { key: b.id, className: `badge ${app.badges[b.id] ? 'got' : ''}` },
        h('b', null, b.n),
        h('span', null, b.d)
      )))
    ),
    h(
      'p',
      { className: 'muted', style: { fontSize: '13px' } },
      persistent ? 'Dein Fortschritt wird in diesem Browser gespeichert. ' : null,
      h(ResetLine, { phase: resetPhase, onReset })
    ),
    footer
  );
}

/**
 * Kopfleiste einer App, wie legacy shell.js:42-49 (header.top): Titel als Knopf zur Startseite der App, Link
 * zur Übersicht, Niveau mit Fortschrittsbalken, Gesamt-XP und Serie.
 */
export function AppHeader({ config, profile, words, onHome, day }) {
  const level = levelOf(profile.xp);
  const from = levelThreshold(level), to = levelThreshold(level + 1);
  const pct = Math.round(((profile.xp - from) / (to - from)) * 100);
  const titles = words.levelTitles || LEVEL_TITLES;
  const title = titles[Math.min(level - 1, titles.length - 1)];
  return h(
    'header',
    { className: 'top', id: 'hdr' },
    h('button', { type: 'button', className: 'brand', onClick: onHome }, config.title),
    h('a', { className: 'alla', href: './' }, 'Alle Apps'),
    h(ThemeToggle),
    h(
      'div',
      { className: 'stats' },
      h(
        'div',
        { className: 'lvl', title },
        h('span', null, `Niveau ${level}`),
        h('div', { className: 'xpbar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: { width: `${pct}%` } })),
        h('span', null, `${profile.xp} XP`)
      ),
      h('div', { className: 'streak', title: 'Tage in Folge geübt' }, h(Icon, { name: 'flame' }), h('b', null, String(currentStreak(profile, day))))
    )
  );
}
