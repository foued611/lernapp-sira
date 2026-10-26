// Ergebnis einer Runde: Titel, Sterne, Zahlen, Tagesziel, Stufe, neue Trophäen und die Wege weiter.
// Herkunft: legacy/modulare/core/js/views/result.js. Abweichungen stehen an der Stelle.
import { createElement } from 'react';
import { BOSS_BONUS_XP, DAILY_GOAL_XP, REFRESH_BONUS_XP, dailyXP } from '../regeln/index.js';
import { Button, StarRow } from '../komponenten/ui.js';
import { Mascot } from '../komponenten/mascot.js';
import { Confetti } from '../komponenten/confetti.js';

const h = createElement;

// Namen der Stufen. Eine App kann eigene setzen (config.words.levelTitles). Legacy: profile.js:9.
export const LEVEL_TITLES = Object.freeze(['Neuling', 'Entdecker', 'Könner', 'Profi', 'Meister', 'Expert', 'Legende']);

// Standard-Wörter der Legacy-Shell (shell.js:24-30). Eine App überschreibt sie über config.words.
export const DEFAULT_WORDS = Object.freeze({
  praise: ['Richtig!', 'Genau!', 'Super!', 'Stark!', 'Bravo!'],
  resultTitles: ['Geschafft!', 'Sehr gut!', 'Perfekt!'],
  blitzTitle: 'Blitzschnell!',
  levelTitles: undefined
});

export const wordsFor = (config) => ({ ...DEFAULT_WORDS, ...(config.words || {}) });

const againLabel = (mode) => (mode === 'quick' ? 'Noch eine Runde' : 'Nochmal');

// Der Text unter dem Titel. Die Reihenfolge der Fälle folgt result.js:20-23.
function subtitleFor(summary) {
  if (summary.failed) return 'Das passiert jedem. Schau kurz in die Theorie, die nächste Runde läuft besser.';
  let text;
  if (summary.mode === 'boss') text = `Endgegner besiegt. ${BOSS_BONUS_XP} Bonus-XP gehören dir.`;
  else if (summary.mode === 'quick') text = 'Kurze Runde, echter Fortschritt.';
  else if (summary.refresh) text = `Aufgefrischt! Dafür gibt es ${REFRESH_BONUS_XP} Bonus-XP. Wiederholen nach ein paar Tagen bringt dein Wissen ins Langzeitgedächtnis.`;
  else text = 'Seite geschafft. Mit mehr richtigen Antworten gibt es mehr Sterne.';
  if (summary.relearned) {
    text += ` ${summary.relearned} falsche Aufgabe${summary.relearned > 1 ? 'n' : ''} hast du im zweiten Versuch richtig gelöst.`;
  }
  return text;
}

/**
 * Reine Ansicht des Ergebnisses. summary kommt aus rahmen.js (summaryOf).
 * Der Feier-Hinweis folgt result.js:34. Bei gescheiterter Runde gibt es keinen.
 */
export function resultModel(summary, { profile, day, words }) {
  const x = dailyXP(profile, day);
  const titles = words.levelTitles || LEVEL_TITLES;
  const level = summary.levelUp
    ? `Niveau ${summary.levelUp} erreicht · ${titles[Math.min(summary.levelUp - 1, titles.length - 1)]}`
    : null;
  return {
    title: summary.failed ? 'Knapp daneben' : words.resultTitles[Math.max(0, summary.stars - 1)],
    subtitle: subtitleFor(summary),
    mood: summary.failed ? 'hmm' : summary.stars === 3 ? 'cheer' : 'happy',
    stars: summary.stars,
    facts: [
      { value: `${Math.round(summary.accuracy * 100)} %`, label: 'richtig' },
      { value: summary.xp + summary.bonus, label: 'XP' },
      { value: summary.bestCombo, label: 'längste Serie' }
    ],
    daily: { xp: x, goal: DAILY_GOAL_XP, reached: x >= DAILY_GOAL_XP },
    levelLine: level,
    badges: summary.newBadges.map((badge) => ({ id: badge.id, n: badge.n, d: badge.d })),
    actions: [{ id: 'again', label: againLabel(summary.mode) }, { id: 'home', label: 'Zum Lernpfad' }],
    celebrate: Boolean(summary.goalHit || (!summary.failed && (summary.mode === 'boss' || summary.stars >= 2)))
  };
}

/** Meldungen zur Speicherung, als Texte. Leer, wenn alles gut ging. */
export const messagesOf = ({ saved, logged }) => [saved.ok ? null : saved.error, logged.ok ? null : logged.error].filter(Boolean);

/** Die Ergebnis-Karte. Sterne stehen als Text dabei, nicht nur als Symbol (RULE-075, AGENTS.md). */
export function Ergebnis({ model, messages = [], onAction }) {
  return h(
    'section',
    { className: 'card res' },
    h(Mascot, { mood: model.mood }),
    h('h1', null, model.title),
    h(StarRow, { stars: model.stars }),
    h('p', { className: 'sub' }, model.subtitle),
    h(
      'div',
      { className: 'facts' },
      ...model.facts.map((fact) => h('div', { key: fact.label, className: 'fact' }, h('b', null, String(fact.value)), h('span', null, fact.label)))
    ),
    h(
      'p',
      { className: 'gline' },
      h('b', null, model.daily.reached ? 'Tagesziel geschafft!' : `Tagesziel: noch ${DAILY_GOAL_XP - model.daily.xp} XP`)
    ),
    model.levelLine ? h('p', { className: 'lvup' }, model.levelLine) : null,
    model.badges.length
      ? h('div', { className: 'badges' }, h('p', { className: 'kicker' }, 'Neue Trophäen'), ...model.badges.map((b) => h('div', { key: b.id, className: 'badge got' }, h('b', null, b.n), h('span', null, b.d))))
      : null,
    h('div', { className: 'acts' }, ...model.actions.map((a) => h(Button, { key: a.id, variant: a.id === 'home' ? 'ghost' : 'primary', onClick: () => onAction(a.id) }, a.label))),
    ...messages.map((text) => h('p', { key: text, className: 'notice', role: 'status' }, text)),
    model.celebrate ? h(Confetti, { seed: 7, count: 40, reduced: false }) : null
  );
}
