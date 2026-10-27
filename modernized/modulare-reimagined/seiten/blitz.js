// Blitz: 45 Sekunden, nur Auswahlfragen, Combo und XP. Herkunft: legacy/modulare/core/js/blitz.js.
// Die Regeln stehen in runde/ (createBlitz). Hier liegen Uhr, Anzeige und die Umrechnung in ein Rundenergebnis,
// damit Auswertung und Speicher denselben Weg nehmen wie bei einer Runde (settleRound in rahmen.js).
import { createElement, Fragment, useEffect, useReducer, useRef, useState } from 'react';
import { BLITZ_SECONDS, createBlitz } from '../runde/index.js';
import { richText } from '../komponenten/rich.js';
import { QuestionChip } from '../komponenten/tracks.js';
import { Icon } from '../komponenten/icons.js';
import { comboMultiplier } from '../regeln/index.js';

const h = createElement;

const VERDICT = Object.freeze({ ok: 'Richtig!', bad: 'Leider nicht.' });
// Wie lange die Rückmeldung steht, bevor die nächste Frage kommt (legacy blitz.js:52).
const FEEDBACK_MS = Object.freeze({ ok: 280, bad: 900 });
// Die Lücke ist wie in legacy ein unterstrichenes Feld (span.blank), kein Text aus Strichen.
const promptNodes = (text) => h(Fragment, null, ...String(text || '').split('{{blank}}').flatMap((part, i) => (i === 0
  ? [richText(part)]
  : [h('span', { key: `b${i}`, className: 'blank' }, ' '), richText(part)])));

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
  const [msLeft, setMsLeft] = useState(BLITZ_SECONDS * 1000);
  // feedback: die eben beantwortete Frage mit der Wahl, bis die Rückmeldung abläuft.
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsLeft(run.timeLeft());
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

  // Die Anzeige folgt legacy blitz.js:render: Zeitbalken, Combo oder Richtig-Zähler, Karte mit Auswahl.
  const seconds = Math.ceil(msLeft / 1000);
  const pct = (msLeft / (BLITZ_SECONDS * 1000)) * 100;
  const combo = cur.combo >= 3 ? `Combo ×${comboMultiplier(cur.combo)} · ${cur.combo} in Folge` : `Richtig: ${cur.score}`;
  return h(
    'div',
    { className: 'seiten' },
    h(
      'div',
      { className: 'playbar' },
      h('button', { type: 'button', className: 'x', 'aria-label': 'Abbrechen', onClick: onLeave }, h(Icon, { name: 'close' })),
      h('div', { className: 'timer', style: { flex: 1 } }, h('i', { style: { width: `${pct}%` } })),
      h('span', { className: 'score' }, `${seconds} s`)
    ),
    // Wie legacy: die Karte hat einen negativen Rand nach oben, der Abstand kommt vom Raster der Seite (.seiten).
    h('div', { className: 'combo' }, combo),
    h(
      'section',
      { className: 'card qcard', style: { '--lc': 'var(--btn-bg)' } },
      h('p', { className: 'qlabel' }, shown.label),
      shown.chip ? h(QuestionChip, { chip: shown.chip }) : null,
      h('p', { className: shown.promptStyle === 'big' ? 'big' : 'sentence' }, promptNodes(shown.prompt)),
      shown.sub ? h('p', { className: 'tr' }, shown.sub) : null,
      h(
        'div',
        { className: 'opts' },
        shown.options.map((option, i) => h(
          'button',
          { key: option.id, type: 'button', className: stateOf(option), disabled: Boolean(feedback), onClick: () => pick(option) },
          h('kbd', null, String(i + 1)),
          richText(option.html)
        ))
      ),
      // Das Urteil bleibt für Screenreader als Text. Sichtbar ist nur die Farbe, wie in Legacy.
      h('p', { role: 'status', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, feedback ? VERDICT[feedback.outcome] : '')
    )
  );
}
