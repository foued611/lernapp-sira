// Rahmen einer App: Lebenszyklus einer Runde (starten, auswerten, speichern, protokollieren), Zurücksetzen
// in zwei Schritten und die Seite der App. Die Regeln stehen in regeln/, die Aufgaben in runde/.
// Die Modellfunktionen oben sind rein bzw. async über injizierte Speicher. Die Komponenten unten zeichnen nur.
import { createElement, useReducer, useState } from 'react';
import { createRound } from '../runde/index.js';
import { createRng } from '../helfer/index.js';
import { REFRESH_BONUS_XP, awardXP, currentStreak, dailyXP, finishRound, isRefreshDue, updateStreak, weakestUnit } from '../regeln/index.js';
import { Button, StarRow, starsOf } from '../komponenten/ui.js';
import { TrackLabel } from '../komponenten/tracks.js';
import { richText } from '../komponenten/rich.js';
import { TheoryPage } from '../komponenten/theory.js';
import { Ergebnis, messagesOf, resultModel, wordsFor } from './ergebnis.js';
import { Sicherung } from './sicherung.js';
import { unitTrack } from './registry.js';

const h = createElement;

/** Aufgaben je Runde (Spec RULE-229): Lektion 8, Endgegner 12, Schnellrunde 5. Blitz ist nicht enthalten. */
export const ROUND_SIZE = Object.freeze({ lesson: 8, quick: 5, boss: 12 });

export const NO_STORAGE = 'Ohne Speicher wird nichts gespeichert. Dieser Stand gilt nur für diesen Versuch.';
const LEFT_SAVE_FAILED = 'Die XP konnten nicht gespeichert werden.';
export const RESET_DONE = 'Der Fortschritt dieser App ist zurückgesetzt. Name und Gesamt-XP bleiben.';
const NO_TASKS = 'Für diese Runde gibt es noch keine Aufgaben.';
const BOSS_LOCKED = 'Der Endgegner ist noch gesperrt. Erst braucht jede Seite mindestens einen Stern.';

// Gleicher Aufbau wie legacy/modulare/core/js/profile.js:14 und 16.
export const profileDefaults = () => ({ name: '', xp: 0, streak: 0, lastDay: '', lastApp: '', day: { d: '', xp: 0 } });
// last und acc steuern Auffrischen und gezieltes Training (legacy profile.js:15).
export const appDefaults = () => ({ xp: 0, stars: {}, badges: {}, best: {}, last: {}, acc: {} });

// Gründe für die Empfehlung, als Text. Der Code kommt aus regeln/ (weakestUnit).
export const REASON_TEXT = Object.freeze({ refresh: 'Zeit zum Auffrischen', weak: 'Hier ist noch Luft nach oben' });

const failure = (message, cause) => ({ ok: false, message, cause });

/** Kalendertag YYYY-MM-DD in der Ortszeit (legacy profile.js:22-23). */
export function dayOf(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Ist der Endgegner offen? RULE-206: erst wenn jede Seite mindestens einen Stern hat. Eine App kann
 * über bossUnlocked selbst entscheiden (legacy shell.js:43). Ohne Seiten ist er offen (RULE-134).
 */
export function bossOpen({ app, unitIds, bossUnlocked, profile }) {
  if (typeof bossUnlocked === 'function') return Boolean(bossUnlocked({ app, profile }));
  return unitIds.every((id) => starsOf(app.stars, id) > 0);
}

// Die Quelle der Aufgaben für eine Rundenart. Ohne Quelle gibt es die Runde nicht. Der Zufall kommt von außen
// (rng), damit die Aufgaben einer Runde reproduzierbar sind.
function poolFor(config, mode, unit, rng) {
  const rounds = config.rounds || {};
  if (mode === 'lesson') return unit && typeof rounds.lesson === 'function' ? () => rounds.lesson(unit, rng) : null;
  if (mode === 'quick') return typeof rounds.quick === 'function' ? () => rounds.quick(rng) : null;
  if (mode === 'boss') return typeof rounds.boss === 'function' ? () => rounds.boss(rng) : null;
  return null;
}

/**
 * Startet eine Runde. Gibt { ok, round, mode, unit } oder { ok: false, message } zurück und wirft nie.
 * Der Endgegner startet nur, wenn er offen ist (RULE-206).
 */
export function startRound({ config, mode, unit = null, app, profile, rng }) {
  if (!Object.hasOwn(ROUND_SIZE, mode)) return failure('Diese Rundenart gibt es nicht.');
  const unitIds = config.units.map((u) => u.id);
  if (mode === 'boss' && !bossOpen({ app, unitIds, bossUnlocked: config.bossUnlocked, profile })) {
    return failure(BOSS_LOCKED);
  }
  const source = poolFor(config, mode, unit, rng);
  if (!source) return failure(NO_TASKS);
  try {
    const pool = source();
    if (!Array.isArray(pool) || pool.length === 0) return failure(NO_TASKS);
    const round = createRound({ pool, size: Math.min(ROUND_SIZE[mode], pool.length), rng, boss: mode === 'boss' });
    return { ok: true, round, mode, unit };
  } catch (error) {
    return failure('Die Aufgaben konnten nicht erzeugt werden.', error);
  }
}

/**
 * Wertet ein Rundenergebnis mit regeln/ aus. Verändert profile und app, wie regeln es tut (RULE-195).
 * levelUp und goalHit kommen von der XP-Gutschrift der Runde selbst, damit eine Stufe nicht verloren geht.
 */
export function evaluateRound({ appId, mode, unit, roundResult, profile, app, day, badges, unitIds, levelUp = null, goalHit = false }) {
  return finishRound({
    appId,
    mode,
    unit: unit || undefined,
    failed: roundResult.failed,
    accuracy: roundResult.accuracy,
    wrong: roundResult.wrong,
    almost: roundResult.almost,
    bestCombo: roundResult.bestCombo,
    score: 0,
    levelUp,
    goalHit,
    profile,
    app,
    day,
    badges,
    unitIds
  });
}

/** Die Zahlen, die die Ergebnisansicht braucht. Alles aus Runde und Auswertung, nichts aus der Uhr. */
export function summaryOf({ mode, unit, roundResult, result }) {
  return {
    mode,
    unitId: unit ? unit.id : null,
    failed: roundResult.failed,
    accuracy: roundResult.accuracy,
    correct: roundResult.correct,
    wrong: roundResult.wrong,
    almost: roundResult.almost,
    bestCombo: roundResult.bestCombo,
    relearned: roundResult.relearned,
    xp: roundResult.xp,
    bonus: result.bonus,
    stars: result.stars,
    refresh: result.refresh,
    levelUp: result.levelUp,
    goalHit: result.goalHit,
    newBadges: result.newBadges
  };
}

// Profil und App-Stand zusammen speichern. Fehlt ein Speicher, gibt es nichts zu speichern (RULE-202).
async function saveBoth(profileStore, appStore) {
  if (!profileStore || !appStore) return { ok: false, error: NO_STORAGE };
  const results = await Promise.all([profileStore.save(), appStore.save()]);
  const failed = results.find((result) => !result.ok);
  return failed ? { ok: false, error: failed.error } : { ok: true };
}

/**
 * Ein Rundenende in einem Ablauf: auswerten, speichern, protokollieren (RULE-195). Das Ergebnis wird
 * erst angezeigt, wenn dieser Ablauf fertig ist. Ein Fehler beim Speichern oder Protokollieren
 * bricht die Anzeige nicht ab, er kommt als Meldung zurück (SEITE-SPEICHER-FEHLER).
 * Protokoll: App, Seite (oder null) und Ergebnisfelder, wie legacy shell.js:104 (RULE-247).
 */
export async function settleRound({ appId, mode, unit, roundResult, profile, app, profileStore, appStore, log, day, badges, unitIds }) {
  // Die XP der Runde zählen zuerst (Profil, App, Tagesziel). Legacy tat das während der Runde (quiz.js).
  const paid = awardXP(profile, app, roundResult.xp, day);
  const result = evaluateRound({
    appId, mode, unit, roundResult, profile, app, day, badges, unitIds, levelUp: paid.levelUp, goalHit: paid.goalHit
  });
  const saved = await saveBoth(profileStore, appStore);
  const logged = await log({
    app: appId,
    type: 'round',
    mode,
    unit: unit ? unit.id : null,
    accuracy: roundResult.accuracy,
    stars: result.stars,
    failed: roundResult.failed,
    score: 0,
    xp: roundResult.xp
  });
  return { result, saved, logged, summary: summaryOf({ mode, unit, roundResult, result }) };
}

/**
 * Anzahl beantworteter Fragen einer laufenden Runde. Im Rückmeldungsschritt zählt die gerade beantwortete mit.
 * Eine falsche Antwort zählt auch, sie bringt nur keine XP.
 */
const answeredOf = (cur) => {
  if (!cur) return 0;
  return cur.status === 'feedback' ? cur.index + 1 : cur.index;
};

/**
 * Verlassen einer Runde (RULE-193, RULE-208). Es gibt kein Rundenergebnis, keine Sterne und kein Protokoll.
 * Die XP der bisherigen Antworten bleiben und laufen über denselben awardXP-Pfad wie eine beendete Runde.
 * Hat die Person mindestens eine Frage beantwortet, zählt der Tag für die Serie, mit derselben updateStreak-Regel
 * wie eine beendete Runde. Sonst ändert sich nichts. Übungstag je Seite, Sterne, Trophäen und lastApp bleiben unberührt.
 */
export async function settleLeave({ round, profile, app, profileStore, appStore, day }) {
  const cur = round.current();
  const earned = cur ? cur.xp : 0;
  const answered = answeredOf(cur);
  round.leave();
  if (answered === 0) return { earned, answered, saved: { ok: true }, paid: null, streakCounted: false };
  const paid = earned > 0 ? awardXP(profile, app, earned, day) : null;
  updateStreak(profile, day);
  const saved = await saveBoth(profileStore, appStore);
  return { earned, answered, saved, paid, streakCounted: true };
}

/** Der Hinweis nach dem Verlassen. Ehrlich: Die XP stehen gut, die Runde zählt nicht (RULE-193). */
export function leaveNotice({ earned, answered, saved }) {
  if (answered === 0) return 'Runde nicht gewertet. Es gab noch keine Antwort.';
  if (!saved.ok) return `Runde nicht gewertet. ${LEFT_SAVE_FAILED}`;
  const xp = earned > 0 ? `${earned} XP wurden gutgeschrieben.` : 'Es gab keine XP.';
  return `Runde nicht gewertet. ${xp} Der Übungstag zählt für die Serie.`;
}

/**
 * Zurücksetzen in zwei Schritten (RULE-133). Der erste Klick öffnet die Bestätigung, der zweite setzt zurück.
 * Jede andere Navigation bricht die Bestätigung ab (legacy shell.js:128). Ein zweiter Klick ohne ersten tut nichts.
 */
export function resetStep(phase, event) {
  if (event === 'start') return { phase: 'ask', reset: false };
  if (event === 'confirm' && phase === 'ask') return { phase: 'idle', reset: true };
  return { phase: 'idle', reset: false };
}

/** Den App-Stand auf die Standardwerte setzen. Profil, Name und Gesamt-XP bleiben (RULE-133, RULE-205). */
export function resetAppState(app) {
  for (const key of Object.keys(app)) delete app[key];
  Object.assign(app, appDefaults());
  return app;
}

/** Setzt den Stand zurück und speichert. Ohne Speicher wird nur der Zustand im Arbeitsspeicher geleert. */
export async function resetApp(app, appStore) {
  resetAppState(app);
  if (!appStore) return { ok: false, error: NO_STORAGE };
  return appStore.save();
}

/** Empfehlung für das Training einer App: erst fällig, sonst die schwächste Seite (RULE-242). */
export function recommendationOf(app, units, day) {
  const found = weakestUnit(app, units, day);
  if (!found) return null;
  return { unit: found.unit, code: found.reason, reason: REASON_TEXT[found.reason] };
}

// Eine Zufallsfolge je Runde aus der Uhr. Tests geben ihre eigene rng-Funktion direkt mit.
const seedNow = () => Math.floor(Date.now()) % 4294967296;

const FEEDBACK = Object.freeze({ ok: 'Richtig!', almost: 'Fast richtig.', bad: 'Leider nicht.' });

function blankOut(text) {
  return String(text || '').split('{{blank}}').join('____');
}

function TypedAnswer({ disabled, onAnswer }) {
  const [text, setText] = useState('');
  return h(
    'form',
    {
      className: 'typed',
      onSubmit: (event) => {
        event.preventDefault();
        onAnswer({ text });
        setText('');
      }
    },
    h(
      'label',
      null,
      'Deine Antwort ',
      h('input', { type: 'text', value: text, disabled, autoComplete: 'off', onChange: (event) => setText(event.target.value) })
    ),
    h(Button, { type: 'submit', disabled }, 'Prüfen')
  );
}

// Zuordnung: erst ein linker, dann ein rechter Eintrag. Die Runde prüft das Paar (runde/src/round.js). Hier nur die
// Rückmeldung für ein falsches Paar. Die Prüfung der Zuordnung selbst bleibt im Rundenmotor.
function MatchAnswer({ question, matched, disabled, onAnswer }) {
  const [left, setLeft] = useState(null);
  const [note, setNote] = useState(null);
  const doneLeft = matched ? matched.left : [];
  const doneRight = matched ? matched.right : [];
  function pairWith(right) {
    if (left === null) {
      setNote('Wähle zuerst links einen Eintrag.');
      return;
    }
    const correct = question.leftValues[left] === question.right[right].value;
    setNote(correct ? null : 'Nicht ganz. Probier eine andere Zuordnung.');
    onAnswer({ left, right });
    setLeft(null);
  }
  return h(
    'div',
    null,
    h(
      'div',
      { className: 'match', role: 'group', 'aria-label': 'Zuordnung' },
      h('div', { className: 'match-col' }, question.left.map((text, i) => h(
        'button',
        {
          key: i, type: 'button', className: left === i ? 'opt sel' : 'opt', disabled: disabled || doneLeft.includes(i),
          'aria-pressed': left === i, onClick: () => { setLeft(i); setNote(null); }
        },
        richText(text)
      ))),
      h('div', { className: 'match-col' }, question.right.map((option, i) => h(
        'button',
        {
          key: i, type: 'button', className: 'opt', disabled: disabled || doneRight.includes(i),
          onClick: () => pairWith(i)
        },
        richText(option.html)
      )))
    ),
    note ? h('p', { className: 'hint', role: 'status' }, note) : null
  );
}

// Die Antwortfläche je Fragetyp.
function answerArea(question, answered, onAnswer, matched) {
  if (question.kind === 'choice') {
    return h(
      'div',
      { className: 'opts', role: 'group', 'aria-label': 'Antwortmöglichkeiten' },
      question.options.map((option) => h(
        'button',
        { key: option.id, type: 'button', className: 'opt', disabled: answered, onClick: () => onAnswer({ pick: option.id }) },
        richText(option.html)
      ))
    );
  }
  if (question.kind === 'type') return h(TypedAnswer, { disabled: answered, onAnswer });
  return h(MatchAnswer, { question, matched, disabled: answered, onAnswer });
}

/** Die Spielansicht einer laufenden Runde. Das Urteil steht als Text, nicht nur als Farbe. */
export function Play({ session, onAnswer, onNext, onLeave, onPeek }) {
  // Welche Frage gerade den Spickzettel offen hat. Das Öffnen zahlt XP (einmal je Runde), das Schließen nicht.
  const [shownFor, setShownFor] = useState(null);
  const cur = session.round.current();
  if (!cur) return null;
  const answered = cur.status === 'feedback';
  const help = cur.question.help;
  const helpShown = shownFor === cur.index;
  function toggleHelp() {
    if (helpShown) {
      setShownFor(null);
      return;
    }
    onPeek();
    setShownFor(cur.index);
  }
  return h(
    'section',
    { className: 'card play', 'aria-live': 'polite' },
    h('p', { className: 'play-meta' }, `Frage ${cur.index + 1} von ${cur.total}${cur.retry ? ' · zweiter Versuch' : ''}`),
    h('p', { className: 'play-meta' }, `Herzen: ${cur.hearts} von ${cur.maxHearts} · Serie: ${cur.combo}`),
    cur.question.chip ? h(TrackLabel, { track: cur.question.chip }) : null,
    cur.question.sub ? h('p', { className: 'sub' }, cur.question.sub) : null,
    h('div', { className: 'prompt' }, richText(blankOut(cur.question.prompt || cur.question.label))),
    answerArea(cur.question, answered, onAnswer, cur.matched),
    help && !answered
      ? h(Button, { variant: 'ghost', 'aria-expanded': helpShown, onClick: toggleHelp },
        helpShown ? 'Spickzettel schließen' : cur.peeked ? 'Spickzettel öffnen' : 'Spickzettel öffnen (−3 XP)')
      : null,
    help && helpShown ? h('div', { className: 'cheat-sheet' }, richText(help)) : null,
    answered
      ? h(
        'div',
        { className: 'feedback', role: 'status' },
        h('p', { className: 'verdict' }, FEEDBACK[cur.outcome] || ''),
        cur.question.why ? h('div', null, richText(cur.question.why)) : null,
        h(Button, { onClick: onNext }, 'Weiter')
      )
      : null,
    h(Button, { variant: 'ghost', onClick: onLeave }, 'Runde beenden (XP bleiben, die Runde zählt nicht)')
  );
}

// Die Theorie einer Seite mit Rückweg. Der Übungsknopf startet die Lektionsrunde dieser Seite.
// Eine App kann ihre Theorie selbst zeichnen (config.Theory, z. B. mit Spielzeugen). Sonst gilt die Standardseite.
export function TheoryScreen({ config, unit, onBack, onStart }) {
  const page = config.Theory
    ? h(config.Theory, { unit, config, onStart: () => onStart() })
    : h(TheoryPage, {
      unit,
      lesson: config.lessons[unit.id],
      notes: config.notes[unit.id],
      tracks: config.tracks,
      onStart: () => onStart()
    });
  return h('div', { className: 'seiten' }, h(Button, { variant: 'ghost', onClick: onBack }, 'Zurück zur Übersicht'), page);
}

// Die Startansicht einer App: Seiten, Training, Rundenarten, Zurücksetzen und Sicherung.
function AppHome({ app, config, appState, profile, day, storage, notice, storeMessage, resetPhase, onStudy, onStart, onReset }) {
  const unitIds = config.units.map((u) => u.id);
  const open = config.rounds && typeof config.rounds.boss === 'function'
    ? bossOpen({ app: appState, unitIds, bossUnlocked: config.bossUnlocked, profile })
    : null;
  const rec = recommendationOf(appState, config.units, day);
  return h(
    'div',
    { className: 'seiten' },
    h(
      'header',
      { className: 'card app-head' },
      h('a', { className: 'link', href: './' }, 'Alle Apps'),
      h('h1', null, config.title),
      h('p', { className: 'muted' }, `${dailyXP(profile, day)} XP heute · ${profile.xp} XP gesamt · ${currentStreak(profile, day)} Tage in Folge`)
    ),
    storeMessage ? h('p', { className: 'notice', role: 'status' }, storeMessage) : null,
    notice ? h('p', { className: 'notice', role: 'status' }, notice) : null,
    rec
      ? h(
        'section',
        { className: 'card training' },
        h('h2', null, 'Gezieltes Training'),
        h('p', null, `${rec.reason}: `, h('b', null, rec.unit.title), '.', rec.code === 'refresh' ? ` Auffrischen bringt ${REFRESH_BONUS_XP} Bonus-XP.` : ''),
        h(TrackLabel, { track: unitTrack(config.tracks, rec.unit) }),
        h(Button, { onClick: () => onStudy(rec.unit) }, 'Jetzt trainieren')
      )
      : null,
    h(
      'section',
      null,
      h('h2', null, 'Dein Lernpfad'),
      h(
        'ol',
        { className: 'units' },
        config.units.map((u) => {
          const stars = starsOf(appState.stars, u.id);
          return h(
            'li',
            { key: u.id, className: 'unit-row' },
            h('div', null, h('h3', null, u.title), h('p', { className: 'muted' }, u.de), h(TrackLabel, { track: unitTrack(config.tracks, u) }),
              isRefreshDue(appState, u.id, day) ? h('p', { className: 'due' }, 'Zeit zum Auffrischen') : null),
            h(StarRow, { stars }),
            h(Button, { 'aria-label': `${u.title} üben`, onClick: () => onStudy(u) }, 'Üben')
          );
        })
      )
    ),
    h(
      'section',
      { className: 'modes' },
      config.rounds && typeof config.rounds.quick === 'function'
        ? h(Button, { onClick: () => onStart('quick') }, 'Schnellrunde (5 Aufgaben)')
        : null,
      open === null ? null : h('div', { className: 'boss' },
        h('p', null, open ? 'Der Endgegner ist offen. 12 gemischte Aufgaben, nur 3 Herzen.' : 'Endgegner gesperrt: Jede Seite braucht mindestens einen Stern.'),
        h(Button, { disabled: !open, onClick: () => onStart('boss') }, open ? 'Endgegner starten' : 'Noch gesperrt'))
    ),
    h(
      'section',
      { className: 'reset' },
      resetPhase === 'ask'
        ? h(
          'div',
          { className: 'confirm' },
          h('p', null, 'Wirklich alles löschen? Die Sterne, Trophäen und Bestwerte dieser App gehen verloren. Name und Gesamt-XP bleiben.'),
          h(Button, { variant: 'ghost', onClick: () => onReset('confirm') }, 'Ja, Fortschritt dieser App löschen'),
          h(Button, { variant: 'ghost', onClick: () => onReset('cancel') }, 'Abbrechen')
        )
        : h(Button, { variant: 'ghost', onClick: () => onReset('start') }, 'Fortschritt dieser App zurücksetzen')
    ),
    h(Sicherung, { handle: storage.handle, day, includeName: true })
  );
}

/**
 * Die App-Seite. Hält den Ablauf der Ansicht: Start, Spiel, Speichern, Ergebnis. Die Entscheidungen
 * stehen in den Modellfunktionen oben. Ohne Speicher läuft die Seite mit einem Stand im Arbeitsspeicher.
 */
export function AppFrame({ app, profileStore, day, storage }) {
  const { config, appStore, entry } = app;
  const words = wordsFor(config);
  const [memoryProfile] = useState(profileDefaults);
  const [memoryApp] = useState(appDefaults);
  const profile = profileStore ? profileStore.state : memoryProfile;
  const appState = appStore ? appStore.state : memoryApp;
  const unitIds = config.units.map((u) => u.id);
  const [screen, setScreen] = useState('home');
  const [session, setSession] = useState(null);
  const [settled, setSettled] = useState(null);
  const [notice, setNotice] = useState(null);
  const [resetPhase, setResetPhase] = useState('idle');
  const [theoryUnit, setTheoryUnit] = useState(null);
  const [, bump] = useReducer((n) => n + 1, 0);
  const storeMessage = app.storeMessage || null;

  function begin(mode, unit = null) {
    const started = startRound({ config, mode, unit, app: appState, profile, rng: createRng(seedNow()) });
    if (!started.ok) {
      setNotice(started.message);
      return;
    }
    setNotice(null);
    setSession(started);
    setScreen('play');
  }

  function peek() {
    session.round.peek();
    bump();
  }

  function answer(response) {
    session.round.submit(response);
    bump();
  }

  async function advance() {
    const step = session.round.next();
    if (!step.done) {
      bump();
      return;
    }
    setScreen('saving');
    const outcome = await settleRound({
      appId: entry.id,
      mode: session.mode,
      unit: session.unit,
      roundResult: step.result,
      profile,
      app: appState,
      profileStore,
      appStore,
      log: (row) => (storage.handle ? storage.handle.logEvent(row) : Promise.resolve({ ok: false, error: NO_STORAGE })),
      day,
      badges: config.badges,
      unitIds
    });
    setSession(null);
    setSettled(outcome);
    setScreen('result');
  }

  function home() {
    setSession(null);
    setSettled(null);
    setNotice(null);
    setResetPhase('idle');
    setTheoryUnit(null);
    setScreen('home');
  }

  // Erst die Theorie der Seite, dann die Übung (AGENTS.md: Theorie, direkt danach Übung).
  function study(unit) {
    setNotice(null);
    setTheoryUnit(unit);
    setScreen('theory');
  }

  // Verlassen zahlt die XP der Runde aus, wertet die Runde aber nicht (RULE-193).
  async function leave() {
    if (!session) {
      home();
      return;
    }
    const outcome = await settleLeave({ round: session.round, profile, app: appState, profileStore, appStore, day });
    home();
    setNotice(leaveNotice(outcome));
  }

  async function reset(event) {
    const step = resetStep(resetPhase, event);
    setResetPhase(step.phase);
    if (!step.reset) return;
    const done = await resetApp(appState, appStore);
    setNotice(done.ok ? RESET_DONE : done.error);
    bump();
  }

  if (screen === 'play' && session) {
    return h(Play, { session, onAnswer: answer, onNext: advance, onLeave: leave, onPeek: peek });
  }
  if (screen === 'theory' && theoryUnit) {
    return h(TheoryScreen, { config, unit: theoryUnit, onBack: home, onStart: () => begin('lesson', theoryUnit) });
  }
  if (screen === 'saving') {
    return h('section', { className: 'card' }, h('p', null, 'Ergebnis wird gespeichert …'));
  }
  if (screen === 'result' && settled) {
    const onAction = (id) => (id === 'again'
      ? begin(settled.summary.mode, settled.summary.unitId ? config.units.find((u) => u.id === settled.summary.unitId) : null)
      : home());
    return h(Ergebnis, {
      model: resultModel(settled.summary, { profile, day, words }),
      messages: messagesOf(settled),
      onAction
    });
  }
  return h(AppHome, {
    app, config, appState, profile, day, storage, notice, storeMessage, resetPhase,
    onStudy: study,
    onStart: (mode, unit) => begin(mode, unit || null),
    onReset: reset
  });
}
