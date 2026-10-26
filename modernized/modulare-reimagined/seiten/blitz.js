// Blitz: 45 Sekunden, nur Auswahlfragen, Combo und XP. Herkunft: legacy/modulare/core/js/blitz.js.
// Die Regeln stehen in runde/ (createBlitz). Hier liegen Uhr, Anzeige und die Umrechnung in ein Rundenergebnis,
// damit Auswertung und Speicher denselben Weg nehmen wie bei einer Runde (settleRound in rahmen.js).
import { createElement, useEffect, useReducer, useRef, useState } from 'react';
import { BLITZ_SECONDS, createBlitz } from '../runde/index.js';
import { Button } from '../komponenten/ui.js';
import { richText } from '../komponenten/rich.js';
import { TrackLabel } from '../komponenten/tracks.js';

const h = createElement;

const VERDICT = Object.freeze({ ok: 'Richtig!', bad: 'Leider nicht.' });
// Wie lange die Rückmeldung steht, bevor die nächste Frage kommt (legacy blitz.js:52).
const FEEDBACK_MS = Object.freeze({ ok: 280, bad: 900 });
const blankOut = (text) => String(text || '').split('{{blank}}').join('____');

/**
 * Umrechnung in die Form einer Rundenauswertung (regeln/src/round.js). Blitz wertet nie als gescheitert
 * und vergibt keine Sterne. Die Genauigkeit ist richtige Antworten an allen Antworten.
 */
export function blitzRoundResult(result, answered) {
  return {
    mode: 'blitz',
    failed: false,
    accuracy: answered ? result.score / answered : 0,
    correct: result.score,
    wrong: answered - result.score,
    almost: 0,
    bestCombo: result.bestCombo,
    score: result.score,
    xp: result.xp
  };
}

// Die Engine zählt nur Aufgaben. Dieser Umschlag zählt zusätzlich die beantworteten Fragen für die Genauigkeit.
function blitzRun(engine) {
  let answered = 0;
  let done = null;
  return {
    current: () => engine.current(),
    timeLeft: () => engine.timeLeft(),
    pick(optionId) {
      const out = engine.pick(optionId);
      if (out.accepted) answered += 1;
      return out;
    },
    // Das Ergebnis entsteht einmal. Danach kommt dasselbe Objekt zurück.
    finish() {
      if (!done) {
        const result = engine.finish();
        if (result) done = blitzRoundResult(result, answered);
      }
      return done;
    },
    // Verlassen: kein Ergebnis. Die XP der bisherigen Treffer bleiben (RULE-193).
    leave() {
      const cur = engine.current();
      const earned = cur ? cur.xp : 0;
      engine.leave();
      return { earned, answered };
    }
  };
}

/**
 * Startet einen Blitz-Lauf. Gibt { ok, run } oder { ok: false, message } zurück und wirft nie.
 * now ist die Uhr in Millisekunden, von außen gegeben, damit Tests die Zeit steuern können.
 */
export function startBlitz({ config, rng, now = Date.now }) {
  if (typeof config.blitz !== 'function') return { ok: false, message: 'Diese App hat keinen Blitz.' };
  try {
    return { ok: true, run: blitzRun(createBlitz({ nextQuestion: () => config.blitz(rng), now, seconds: BLITZ_SECONDS })) };
  } catch (error) {
    return { ok: false, message: 'Die Aufgaben konnten nicht erzeugt werden.', cause: error };
  }
}

/**
 * Die Blitz-Ansicht. Die Zeit läuft in einem Intervall. Ist sie um, ruft die Ansicht onFinish mit dem Ergebnis.
 * Nach jeder Antwort bleibt die Rückmeldung kurz stehen, die Buttons sind bis dahin gesperrt.
 */
export function BlitzPlay({ run, onFinish, onLeave }) {
  const [, bump] = useReducer((n) => n + 1, 0);
  const [left, setLeft] = useState(BLITZ_SECONDS);
  // feedback: die eben beantwortete Frage mit der Wahl, bis die Rückmeldung abläuft.
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeft(Math.ceil(run.timeLeft() / 1000));
      const result = run.finish();
      if (result) {
        clearInterval(timer);
        onFinish(result);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [run, onFinish]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_MS[feedback.outcome]);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Tasten 1 bis 9 wählen die Antwort, wie in Legacy (blitz.js:70-73). Der Zeiger zeigt auf die aktuelle Auswahl.
  const choose = useRef(null);
  useEffect(() => {
    const onKey = (event) => {
      if (!/^[1-9]$/.test(event.key) || !choose.current) return;
      choose.current(Number(event.key) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cur = run.current();
  if (!cur) return null;
  const shown = feedback ? feedback.question : cur.question;

  function pick(option) {
    if (feedback) return;
    const out = run.pick(option.id);
    if (!out.accepted) return;
    setFeedback({ outcome: out.outcome, question: cur.question, pick: option.id });
    bump();
  }
  choose.current = (index) => {
    const option = shown.options[index];
    if (option) pick(option);
  };

  // Im Rückmeldungsschritt zeigt die Auflösung, welche Antwort richtig war. Die Farbe ist nur Zusatz (KOMP-A11Y).
  const stateOf = (option) => {
    if (!feedback) return 'opt';
    if (option.id === shown.answer) return 'opt right';
    if (option.id === feedback.pick) return 'opt wrong';
    return 'opt';
  };

  return h(
    'section',
    { className: 'card play' },
    h('p', { className: 'play-meta' }, `Zeit: ${left} s · Richtig: ${cur.score} · Serie: ${cur.combo}`),
    shown.chip ? h(TrackLabel, { track: shown.chip }) : null,
    shown.sub ? h('p', { className: 'sub' }, shown.sub) : null,
    h('div', { className: 'prompt' }, richText(blankOut(shown.prompt || shown.label))),
    h(
      'div',
      { className: 'opts', role: 'group', 'aria-label': 'Antwortmöglichkeiten' },
      shown.options.map((option) => h(
        'button',
        { key: option.id, type: 'button', className: stateOf(option), disabled: Boolean(feedback), onClick: () => pick(option) },
        richText(option.html)
      ))
    ),
    h('p', { className: 'verdict', role: 'status' }, feedback ? VERDICT[feedback.outcome] : ''),
    h(Button, { variant: 'ghost', onClick: onLeave }, 'Blitz beenden (XP bleiben, die Runde zählt nicht)')
  );
}
