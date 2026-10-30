// Die Spielansicht einer Übungsrunde. Das Markup folgt legacy/modulare/core/js/quiz.js und core/js/qtypes.js
// (Pixelparität, analysis/modulare/PARITAET.md). Die Regeln bleiben im Rundenmotor (runde/): hier wird nur
// gezeichnet und die Auswahl gesammelt. Ein Klick auf eine Antwort sendet nichts, erst "Prüfen" (wie Legacy).
import { createElement, useEffect, useState } from 'react';
import { comboMultiplier } from '../regeln/index.js';
import { esc } from '../runde/index.js';
import { Icon } from '../komponenten/icons.js';
import { Mascot } from '../komponenten/mascot.js';
import { richText } from '../komponenten/rich.js';
import { QuestionChip } from '../komponenten/tracks.js';

const h = createElement;

const FALLBACK_WHY = 'Schau dir die Formen noch einmal an, dann klappt es.';
const blankOut = (text) => String(text || '').split('{{blank}}');

/**
 * Was in der Lücke steht: nach der Antwort das richtige Wort, davor die gewählte Option.
 * Nie reveal: das ist der ganze Satz, in der Lücke stünde er doppelt (legacy qtypes.js:blankHTML).
 */
export function blankFill(question, feedback, selected) {
  if (feedback) {
    const right = question.kind === 'choice' ? question.options.find((o) => o.id === question.answer) : null;
    return esc(right && right.fill !== undefined ? right.fill : question.answer);
  }
  if (question.kind !== 'choice' || selected === null) return null;
  const chosen = question.options[selected];
  return chosen.fill !== undefined ? esc(chosen.fill) : null;
}

// Lobe aus words.praise, eines je Frage, damit die Anzeige ruhig und testbar bleibt (AGENTS.md: Zufall nur testbar).
export const praiseOf = (praise, index) => (praise && praise.length ? praise[index % praise.length] : 'Richtig!');

// Die XP einer Antwort, wie Legacy quiz.js:113-124. Ein zweiter Versuch bringt 5 XP, Teilerfolg 5, richtig 10 mal Combo.
export function gainOf(outcome, retry, combo) {
  if (retry) return outcome === 'ok' || outcome === 'almost' ? 5 : 0;
  if (outcome === 'ok') return 10 * comboMultiplier(combo);
  if (outcome === 'almost') return 5;
  return 0;
}

// Der Fragetext mit Lücken. Die Lücke zeigt das gewählte Wort, nach der Antwort das richtige (legacy qtypes.js:blankHTML).
function Prompt({ question, feedback, filled }) {
  const parts = blankOut(question.prompt);
  const className = question.promptStyle === 'big' ? 'big' : 'sentence';
  if (parts.length === 1) return h('p', { className }, richText(parts[0]));
  return h('p', { className }, ...parts.flatMap((part, i) => (i === 0
    ? [richText(part)]
    : [h('span', { key: `b${i}`, className: `blank ${feedback ? 'ok' : ''}` }, filled ? richText(filled) : ' '), richText(part)])));
}

// Die Auswahl: Optionen mit Zahlen-Kennzeichen. Gewählte Option und, nach der Antwort, richtig und falsch.
function Choices({ question, selected, feedback, onSelect }) {
  const list = question.optionsLayout === 'list';
  const cls = (option, i) => {
    if (feedback) return option.id === question.answer ? 'opt right' : selected === i ? 'opt wrong' : 'opt';
    return selected === i ? 'opt sel' : 'opt';
  };
  return h(
    'div',
    { className: list ? '' : 'opts', style: list ? { display: 'grid', gap: '12px' } : undefined },
    question.options.map((option, i) => h(
      'button',
      { key: option.id, type: 'button', className: cls(option, i), disabled: feedback, onClick: () => onSelect(i) },
      h('kbd', null, String(i + 1)),
      richText(option.html)
    ))
  );
}

// Eingabe mit Akzent-Leiste (legacy qtypes.js:type). Die Leiste fügt Zeichen an der Schreibmarke ein.
function TypedInput({ value, feedback, bad, placeholder, chars, onChange }) {
  return h(
    'div',
    null,
    h('input', {
      id: 'ans',
      className: `ans ${feedback ? (bad ? 'bad' : 'ok') : ''}`,
      type: 'text',
      autoComplete: 'off',
      autoCapitalize: 'none',
      autoCorrect: 'off',
      spellCheck: false,
      value,
      readOnly: feedback,
      placeholder: placeholder || 'Antwort eintippen',
      onChange: (event) => onChange(event.target.value)
    }),
    !feedback && chars.length
      ? h('div', { className: 'acc' }, ...chars.map((c) => h('button', { key: c, type: 'button', className: 'chip', onClick: () => onChange(value + c) }, c)))
      : null
  );
}

// Zuordnung wie legacy qtypes.js:match: erst ein linker Eintrag, dann ein rechter. Ein falsches Paar schüttelt.
function MatchGrid({ question, matched, feedback, selectedLeft, flash, onLeft, onRight }) {
  const doneLeft = matched ? matched.left : [];
  const doneRight = matched ? matched.right : [];
  return h(
    'div',
    { className: 'match' },
    h('div', { style: { display: 'grid', gap: '10px' } }, question.left.map((text, i) => h(
      'button',
      {
        key: i, type: 'button',
        className: `mb ${doneLeft.includes(i) ? 'dn' : ''} ${selectedLeft === i ? 'sel' : ''}`,
        disabled: feedback || doneLeft.includes(i),
        onClick: () => onLeft(i)
      },
      text
    ))),
    h('div', { style: { display: 'grid', gap: '10px' } }, question.right.map((option, j) => h(
      'button',
      {
        key: j, type: 'button',
        className: `mb ${doneRight.includes(j) ? 'dn' : ''} ${flash === j ? 'shake' : ''}`,
        disabled: feedback || doneRight.includes(j),
        onClick: () => onRight(j)
      },
      richText(option.html)
    )))
  );
}

// Die Rückmeldung: Maskottchen, Lob oder Korrektur in Stiftschrift, Erklärung, Weiter (legacy quiz.js:31-45).
function Feedback({ question, outcome, gain, mult, retry, praise, onNext }) {
  const next = h('button', { type: 'button', className: 'btn', id: 'nx', onClick: onNext }, 'Weiter');
  if (outcome === 'ok') {
    const word = retry ? 'Diesmal sitzt es!' : mult > 1 ? `Serie ×${mult}!` : praise;
    return h(
      'div',
      { className: 'fb ok', role: 'status' },
      h(Mascot, { mood: mult > 1 ? 'cheer' : 'happy' }),
      h('div', { className: 'msg' },
        h('b', null, word), ' ',
        h('span', { className: 'gain' }, `+${gain} XP${mult > 1 ? ` · Combo ×${mult}` : ''}`),
        question.sub ? h('p', { className: 'tr' }, `= ${question.sub}`) : null),
      next
    );
  }
  if (outcome === 'almost') {
    return h(
      'div',
      { className: 'fb almost', role: 'status' },
      h(Mascot, { mood: 'hmm' }),
      h('div', { className: 'msg' },
        h('b', null, 'Fast! Nur die Schreibweise:'),
        h('div', { className: 'pen' }, question.answer),
        h('span', { className: 'gain' }, `+${gain} XP`)),
      next
    );
  }
  const reveal = question.kind === 'match' ? null : h('div', { className: 'pen' }, richText(question.reveal || question.answer));
  return h(
    'div',
    { className: 'fb bad', role: 'status' },
    h(Mascot, { mood: 'sad' }),
    h('div', { className: 'msg' },
      h('b', null, 'Kein Problem, so geht es:'),
      reveal,
      h('div', { className: 'why' }, question.why || FALLBACK_WHY)),
    next
  );
}

/**
 * Die Spielansicht. session.round ist der Rundenmotor. Props: praise (Wörter für Lob), inputChars (Akzent-Leiste),
 * color (Farbe der Seite für den Fortschritt), onAnswer, onNext, onLeave, onPeek.
 */
function PlayBody({ session, praise, inputChars = [], onAnswer, onNext, onLeave, onPeek }) {
  const cur = session.round.current();
  const [selected, setSelected] = useState(null);
  const [typed, setTyped] = useState('');
  const [left, setLeft] = useState(null);
  const [flash, setFlash] = useState(-1);
  const [shownFor, setShownFor] = useState(null);
  const index = cur ? cur.index : 0;

  // Zustand der Frage zurücksetzen, sobald eine neue Frage kommt.
  useEffect(() => {
    setSelected(null);
    setTyped('');
    setLeft(null);
    setFlash(-1);
    setShownFor(null);
  }, [index, cur && cur.question]);

  const q = cur.question;
  const feedback = cur.status === 'feedback';
  const kind = q.kind;
  const pct = ((cur.index + (feedback ? 1 : 0)) / cur.total) * 100;
  const mult = comboMultiplier(cur.combo);
  const gain = gainOf(cur.outcome, cur.retry, cur.combo);
  const helpOpen = shownFor === cur.index;

  function check() {
    if (feedback) return;
    if (kind === 'choice' && selected !== null) onAnswer({ pick: q.options[selected].id });
    if (kind === 'type' && typed.trim()) onAnswer({ text: typed });
  }

  function pairWith(j) {
    if (feedback || left === null) return;
    onAnswer({ left, right: j });
    setLeft(null);
    setFlash(-1);
  }

  function chooseLeft(i) {
    if (feedback) return;
    setLeft(i);
    setFlash(-1);
  }

  function toggleHelp() {
    if (helpOpen) {
      setShownFor(null);
      return;
    }
    onPeek();
    setShownFor(cur.index);
  }

  // Tasten wie in Legacy (qtypes.js:onKey, quiz.js:keydown): 1 bis 9 wählen, Enter prüft oder geht weiter.
  useEffect(() => {
    if (!cur) return undefined;
    const onKey = (event) => {
      const tag = event.target && event.target.tagName ? event.target.tagName : '';
      if (event.key === 'Enter') {
        if (feedback) {
          if (tag !== 'BUTTON') { event.preventDefault(); onNext(); }
        } else if (tag === 'INPUT') {
          event.preventDefault();
          check();
        }
        return;
      }
      if (feedback || tag === 'INPUT' || kind !== 'choice') return;
      if (/^[1-9]$/.test(event.key) && q.options[Number(event.key) - 1]) setSelected(Number(event.key) - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const canCheck = kind === 'choice' ? selected !== null : kind === 'type' ? typed.trim() !== '' : false;
  const answer = kind === 'choice'
    ? h(Choices, { question: q, selected, feedback, onSelect: (i) => setSelected(i) })
    : kind === 'type'
      ? h(TypedInput, {
        value: typed, feedback, bad: cur.outcome === 'bad', placeholder: q.placeholder, chars: inputChars,
        onChange: setTyped
      })
      : h(MatchGrid, {
        question: q, matched: cur.matched, feedback, selectedLeft: left, flash,
        onLeft: chooseLeft, onRight: pairWith
      });

  const filled = blankFill(q, feedback, selected);

  const label = q.label ? h('p', { className: 'qlabel' }, q.label) : null;
  const prompt = q.prompt ? h(Prompt, { question: q, feedback, filled }) : null;
  const sub = q.sub ? h('p', { className: 'tr' }, q.sub) : null;
  const help = q.help
    ? h('div', { style: { marginTop: '14px' } },
      h('button', { type: 'button', className: 'link', onClick: toggleHelp }, helpOpen ? 'Spickzettel schließen' : 'Spickzettel öffnen (−3 XP)'),
      helpOpen ? h('div', { className: 'peek' }, richText(q.help)) : null)
    : null;

  let foot;
  if (feedback) {
    foot = h(Feedback, { question: q, outcome: cur.outcome, gain, mult: cur.retry ? 1 : mult, retry: cur.retry, praise: praiseOf(praise, cur.index), onNext });
  } else if (kind === 'match') {
    foot = h('p', { className: 'hint' }, 'Tippe links ein Element, dann rechts das passende.');
  } else {
    // Der Hinweis erklärt die gesperrte Taste. Ohne ihn wirkt sie kaputt (Design-Kritik).
    foot = h('div', { className: 'row' },
      canCheck ? null : h('p', { className: 'hint', id: 'chk-hint' }, 'Erst antworten, dann prüfen.'),
      h('button', { type: 'button', className: 'btn', id: 'chk', disabled: !canCheck, 'aria-describedby': canCheck ? undefined : 'chk-hint', onClick: check }, 'Prüfen'));
  }

  return h(
    'div',
    { className: 'seiten' },
    h(
      'div',
      { className: 'playbar' },
      h('button', { type: 'button', className: 'x', 'aria-label': 'Abbrechen', onClick: onLeave }, h(Icon, { name: 'close' })),
      h('div', { className: 'pbar' }, h('i', { style: { width: `${pct}%` } })),
      h('div', { className: 'hearts', 'aria-label': `${cur.hearts} Herzen` },
        Array.from({ length: cur.maxHearts }, (_, i) => h('span', { key: i, className: `h ${i < cur.hearts ? 'on' : 'off'}` }, h(Icon, { name: 'heart' }))))
    ),
    h('div', { className: 'combo' }, cur.combo >= 3 ? `Combo ×${mult} · ${cur.combo} in Folge` : ''),
    h(
      'section',
      { className: 'card qcard', 'aria-live': 'polite' },
      cur.retry ? h('p', { className: 'retry-tag' }, 'Noch einmal: jetzt, wo du die Lösung kennst') : null,
      label,
      q.chip ? h(QuestionChip, { chip: q.chip }) : null,
      prompt,
      sub,
      answer,
      help
    ),
    h('div', { className: 'foot', 'aria-live': 'polite' }, foot)
  );
}

/** Die Spielansicht. Ohne laufende Frage nichts zu zeichnen. Der Körper hat die Hooks, daher die Trennung. */
export function Play(props) {
  if (!props.session.round.current()) return null;
  return h(PlayBody, props);
}
