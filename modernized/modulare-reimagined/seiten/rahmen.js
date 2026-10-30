// Ansicht einer App: Seite, Theorie, Spiel und Ergebnis. Den Ablauf einer Runde steuert ablauf.js, hier wird nur gezeichnet.
import { createElement, useReducer, useState } from 'react';
import { createRng } from '../helfer/index.js';
import { TheoryPage } from '../komponenten/theory.js';
import { BlitzPlay, startBlitz } from './blitz.js';
import { AppHeader, AppHome } from './apphome.js';
import { Play } from './spiel.js';
import { NO_STORAGE, saveName } from './name.js';
import { Ergebnis, messagesOf, resultModel, wordsFor } from './ergebnis.js';
import { Sicherung } from './sicherung.js';
import { RESET_DONE, profileDefaults, appDefaults, RIGHT, knownOf, rememberRight, bossOpen, startRound, settleRound, settleLeave, settleBlitzLeave, leaveNotice, resetStep, resetApp, recommendationOf } from './ablauf.js';

const h = createElement;

// Eine Zufallsfolge je Runde aus der Uhr. Tests geben ihre eigene rng-Funktion direkt mit.
const seedNow = () => Math.floor(Date.now()) % 4294967296;

export { Play } from './spiel.js';

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
  // Wie legacy shell.js:renderTheory: ein Textlink "← Zum Lernpfad" über der Seite.
  return h('div', { className: 'seiten' }, h('button', { type: 'button', className: 'link back', onClick: onBack }, '← Zum Lernpfad'), page);
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
  const [blitz, setBlitz] = useState(null);
  const [, bump] = useReducer((n) => n + 1, 0);
  // Ohne echten Speicher sagt die Seite das. Die Meldung der App gibt es nur bei blockiertem Speicher.
  const storeMessage = app.storeMessage || (storage.status === 'memory' ? storage.message : null);
  const persistent = storage.status === 'ok';
  const logRow = (row) => (storage.handle ? storage.handle.logEvent(row) : Promise.resolve({ ok: false, error: NO_STORAGE }));

  function begin(mode, unit = null) {
    const started = startRound({ config, mode, unit, app: appState, profile, rng: createRng(seedNow()), known: knownOf(appState) });
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
    const question = session.round.current()?.question;
    const step = session.round.submit(response);
    if (step.accepted && RIGHT.has(step.outcome)) rememberRight(appState, question, appStore);
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
      log: logRow,
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
    setBlitz(null);
    setSettled(null);
    setNotice(null);
    setResetPhase('idle');
    setTheoryUnit(null);
    setScreen('home');
  }

  // Blitz hat keine Seite und keine Runde aus rounds (Legacy: shell.js startBlitzRound).
  function beginBlitz() {
    const started = startBlitz({ config, rng: createRng(seedNow()), known: knownOf(appState), onRight: (q) => rememberRight(appState, q, appStore) });
    if (!started.ok) {
      setNotice(started.message);
      return;
    }
    setNotice(null);
    setBlitz(started.run);
    setScreen('blitz');
  }

  // Die Zeit ist um: der Blitz wird wie eine Runde ausgewertet, nur ohne Sterne (regeln/round.js).
  async function finishBlitz(roundResult) {
    setScreen('saving');
    const outcome = await settleRound({
      appId: entry.id,
      mode: 'blitz',
      unit: null,
      roundResult,
      profile,
      app: appState,
      profileStore,
      appStore,
      log: logRow,
      day,
      badges: config.badges,
      unitIds
    });
    setBlitz(null);
    setSettled(outcome);
    setScreen('result');
  }

  async function leaveBlitz() {
    const { earned, answered } = blitz.leave();
    const outcome = await settleBlitzLeave({ earned, answered, profile, app: appState, profileStore, appStore, day });
    home();
    setNotice(leaveNotice(outcome));
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

  // Kopfleiste und Hauptbereich wie legacy/modulare/index.html der App (header.top, main#app).
  const frame = (content, unit = null) => h(
    'div',
    { className: 'shell' },
    h(AppHeader, { config, profile, words, onHome: home, day }),
    h('main', { id: 'app', style: unit ? { '--lc': unit.color } : undefined }, content)
  );

  if (screen === 'play' && session) {
    return frame(h(Play, { session, praise: words.praise, inputChars: config.inputChars || [], onAnswer: answer, onNext: advance, onLeave: leave, onPeek: peek }), session.unit);
  }
  if (screen === 'blitz' && blitz) {
    return frame(h(BlitzPlay, { run: blitz, onFinish: finishBlitz, onLeave: leaveBlitz }));
  }
  if (screen === 'theory' && theoryUnit) {
    return frame(h(TheoryScreen, { config, unit: theoryUnit, onBack: home, onStart: () => begin('lesson', theoryUnit) }), theoryUnit);
  }
  if (screen === 'saving') {
    return frame(h('section', { className: 'card' }, h('p', null, 'Ergebnis wird gespeichert …')));
  }
  if (screen === 'result' && settled) {
    const onAction = (id) => {
      if (id === 'home') home();
      else if (id === 'theory') study(config.units.find((u) => u.id === settled.summary.unitId));
      else if (settled.summary.mode === 'blitz') beginBlitz();
      else begin(settled.summary.mode, settled.summary.unitId ? config.units.find((u) => u.id === settled.summary.unitId) : null);
    };
    return frame(h(Ergebnis, {
      model: resultModel(settled.summary, { profile, day, words }),
      messages: messagesOf(settled),
      onAction
    }));
  }
  const rec = recommendationOf(appState, config.units, day);
  const open = bossOpen({ app: appState, unitIds, bossUnlocked: config.bossUnlocked, profile });
  async function saveNameAndRedraw(raw) {
    await saveName(profileStore, raw);
    bump();
  }
  return frame(h(AppHome, {
    config, app: appState, profile, day, rec, open, notice, storeMessage, persistent, resetPhase, profileStore,
    onStudy: study,
    onStart: (mode, unit) => (mode === 'blitz' ? beginBlitz() : begin(mode, unit || null)),
    onReset: reset,
    onName: saveNameAndRedraw,
    footer: h(Sicherung, { handle: storage.handle, day, includeName: true })
  }));
}
