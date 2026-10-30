// Ansicht einer App: Seite, Theorie, Spiel und Ergebnis. Den Ablauf einer Runde steuert ablauf.js, hier wird nur gezeichnet.
import { createElement, useEffect, useReducer, useRef, useState } from 'react';
import { createRng, pathGroups, starsOf, unitsInPath } from '../helfer/index.js';
import { TheoryPage } from '../komponenten/theory.js';
import { BlitzPlay, startBlitz } from './blitz.js';
import { AppHeader, AppHome, revealStation } from './apphome.js';
import { Play } from './spiel.js';
import { NO_STORAGE, saveName } from './name.js';
import { Ergebnis, messagesOf, resultModel, wordsFor } from './ergebnis.js';
import { Sicherung } from './sicherung.js';
import { onAddressBack, pageRoot, pushAddress, replaceAddress, scrollToTop, searchOf, unitFromSearch } from './adresse.js';
import { RESET_DONE, profileDefaults, appDefaults, RIGHT, knownOf, rememberRight, bossOpen, startRound, settleRound, settleLeave, settleBlitzLeave, leaveNotice, resetStep, resetApp, recommendationOf, followingUnit } from './ablauf.js';

const h = createElement;

// Eine Zufallsfolge je Runde aus der Uhr. Tests geben ihre eigene rng-Funktion direkt mit.
const seedNow = () => Math.floor(Date.now()) % 4294967296;

export { Play } from './spiel.js';

// Die Theorie einer Seite mit Rückweg. Der Übungsknopf startet die Lektionsrunde dieser Seite.
// Eine App kann ihre Theorie selbst zeichnen (config.Theory, z. B. mit Spielzeugen). Sonst gilt die Standardseite.
// Ist die Seite schon geübt, gibt es den Weg zur Übung auch oben: Wer auffrischt, muss die Theorie nicht durchscrollen.
export function TheoryScreen({ config, unit, onBack, onStart, practised = false }) {
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
  return h(
    'div',
    { className: 'seiten' },
    h(
      'div',
      { className: 'theorytop' },
      h('button', { type: 'button', className: 'link back', onClick: onBack }, '← Zum Lernpfad'),
      practised ? h('button', { type: 'button', className: 'btn ghost', onClick: () => onStart() }, 'Direkt üben') : null
    ),
    page
  );
}

/**
 * Die App-Seite. Hält den Ablauf der Ansicht: Start, Spiel, Speichern, Ergebnis. Die Entscheidungen
 * stehen in den Modellfunktionen oben. Ohne Speicher läuft die Seite mit einem Stand im Arbeitsspeicher.
 */
export function AppFrame({ app, profileStore, day, storage, startUnit = null }) {
  const { config, appStore, entry } = app;
  const words = wordsFor(config);
  const [memoryProfile] = useState(profileDefaults);
  const [memoryApp] = useState(appDefaults);
  const profile = profileStore ? profileStore.state : memoryProfile;
  const appState = appStore ? appStore.state : memoryApp;
  const unitIds = config.units.map((u) => u.id);
  // Ein Link kann direkt auf eine Seite zeigen. Eine unbekannte Seite führt zum Lernpfad.
  const linkedUnit = config.units.find((u) => u.id === startUnit) || null;
  const [screen, setScreen] = useState(linkedUnit ? 'theory' : 'home');
  const [session, setSession] = useState(null);
  const [settled, setSettled] = useState(null);
  const [notice, setNotice] = useState(null);
  const [resetPhase, setResetPhase] = useState('idle');
  const [theoryUnit, setTheoryUnit] = useState(linkedUnit);
  const [station, setStation] = useState(null);
  const [blitz, setBlitz] = useState(null);
  const [, bump] = useReducer((n) => n + 1, 0);
  // Ohne echten Speicher sagt die Seite das. Die Meldung der App gibt es nur bei blockiertem Speicher.
  const storeMessage = app.storeMessage || (storage.status === 'memory' ? storage.message : null);
  const persistent = storage.status === 'ok';
  // Jede Ansicht beginnt oben. Nur der Rückweg zum Lernpfad landet bei der Station, von der die Person kommt.
  useEffect(() => {
    if (screen === 'home' && station && revealStation(pageRoot(), station)) return;
    scrollToTop();
  }, [screen, theoryUnit, station]);
  // Die Taste des Browsers folgt der Adresse. Der Ref hält followAddress aktuell, die Anmeldung bleibt einmalig.
  const followRef = useRef(null);
  useEffect(() => onAddressBack((search) => followRef.current(search)), []);
  const logRow = (row) => (storage.handle ? storage.handle.logEvent(row) : Promise.resolve({ ok: false, error: NO_STORAGE }));

  function begin(mode, unit = null, group = null) {
    const started = startRound({ config, mode, unit, group, app: appState, profile, rng: createRng(seedNow()), known: knownOf(appState) });
    if (!started.ok) {
      setNotice(started.message);
      return;
    }
    setNotice(null);
    enterRound();
    setSession({ ...started, weak: new Set() });
    setScreen('play');
  }

  // Eine Runde ist ein eigener Schritt in der Adresse, damit die Zurück-Taste sie verlässt und nicht die App.
  // Nochmal ersetzt den Schritt. Sonst müsste man nach jeder Runde einmal mehr zurück.
  function enterRound() {
    const search = searchOf(entry.id, session?.unit?.id || settled?.summary.unitId || theoryUnit?.id || null);
    if (screen === 'result') replaceAddress(search);
    else pushAddress(search);
  }

  function peek() {
    session.round.peek();
    bump();
  }

  function answer(response) {
    const question = session.round.current()?.question;
    const step = session.round.submit(response);
    if (step.accepted && RIGHT.has(step.outcome)) rememberRight(appState, question, appStore);
    if (step.accepted && step.outcome === 'bad' && question?.unitId) session.weak.add(question.unitId);
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
      group: session.group,
      weakUnits: config.units.filter((u) => session.weak.has(u.id)).map((u) => u.id),
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

  // Zum Lernpfad mit eigenem Schritt in der Adresse.
  function goHome() {
    home();
    pushAddress(searchOf(entry.id));
  }

  function home() {
    // Nach dem Kapitel-Test zur letzten Seite des Kapitels: Darunter steht der neue Bestwert.
    const tested = config.units.filter((u) => u.group === settled?.summary.groupId).at(-1)?.id;
    setStation(theoryUnit?.id || session?.unit?.id || settled?.summary.unitId || tested || null);
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
    enterRound();
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
    replaceAddress(searchOf(entry.id));
  }

  // Erst die Theorie der Seite, dann die Übung (AGENTS.md: Theorie, direkt danach Übung).
  function study(unit) {
    showTheory(unit);
    pushAddress(searchOf(entry.id, unit.id));
  }

  function showTheory(unit) {
    setSettled(null);
    setNotice(null);
    setTheoryUnit(unit);
    setScreen('theory');
  }

  // Zurück oder Vorwärts im Browser. Eine laufende Runde endet wie mit dem Kreuz und führt zum Lernpfad, dort steht der Hinweis.
  async function followAddress(search) {
    if (session) return leave();
    if (blitz) return leaveBlitz();
    const unit = config.units.find((u) => u.id === unitFromSearch(search));
    return unit ? showTheory(unit) : home();
  }
  followRef.current = followAddress;

  // Verlassen zahlt die XP der Runde aus, wertet die Runde aber nicht (RULE-193).
  async function leave() {
    if (!session) {
      goHome();
      return;
    }
    const outcome = await settleLeave({ round: session.round, profile, app: appState, profileStore, appStore, day });
    home();
    // Der Hinweis zum Verlassen steht oben. Er darf nicht außer Sicht bleiben.
    setStation(null);
    setNotice(leaveNotice(outcome));
    replaceAddress(searchOf(entry.id));
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
    h(AppHeader, { config, profile, words, onHome: goHome, day }),
    h('main', { id: 'app', style: unit ? { '--lc': unit.color } : undefined }, content)
  );

  if (screen === 'play' && session) {
    return frame(h(Play, { session, praise: words.praise, inputChars: config.inputChars || [], onAnswer: answer, onNext: advance, onLeave: leave, onPeek: peek }), session.unit);
  }
  if (screen === 'blitz' && blitz) {
    return frame(h(BlitzPlay, { run: blitz, onFinish: finishBlitz, onLeave: leaveBlitz }));
  }
  if (screen === 'theory' && theoryUnit) {
    return frame(h(TheoryScreen, { config, unit: theoryUnit, onBack: goHome, onStart: () => begin('lesson', theoryUnit), practised: starsOf(appState.stars, theoryUnit.id) > 0 }), theoryUnit);
  }
  if (screen === 'saving') {
    return frame(h('section', { className: 'card' }, h('p', null, 'Ergebnis wird gespeichert …')));
  }
  if (screen === 'result' && settled) {
    const { unitId, groupId, weakUnits } = settled.summary;
    const weak = weakUnits.map((id) => config.units.find((u) => u.id === id));
    const next = unitId ? followingUnit(appState, unitsInPath(config.units, config.groups), unitId, day) : weak[0] || null;
    const onAction = (id) => {
      if (id === 'home') goHome();
      else if (id === 'next') study(next);
      else if (id === 'theory') study(config.units.find((u) => u.id === settled.summary.unitId));
      else if (settled.summary.mode === 'blitz') beginBlitz();
      else begin(settled.summary.mode, unitId ? config.units.find((u) => u.id === unitId) : null, groupId ? pathGroups(config.units, config.groups).find((g) => g.id === groupId) : null);
    };
    return frame(h(Ergebnis, {
      model: resultModel(settled.summary, { profile, day, words, next, weakTitles: weak.map((u) => u.title) }),
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
    onChapter: (group) => begin('chapter', null, group),
    onReset: reset,
    onName: saveNameAndRedraw,
    focusId: station,
    footer: h(Sicherung, { handle: storage.handle, day, includeName: true })
  }));
}
