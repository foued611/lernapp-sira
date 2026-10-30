// Ergebnis einer Runde: Titel, Sterne, Zahlen, Tagesziel, Stufe, neue Trophäen und die Wege weiter.
// Herkunft: legacy/modulare/core/js/views/result.js. Abweichungen stehen an der Stelle.
import { createElement } from 'react';
import { BOSS_BONUS_XP, MISSION_REWARD_XP, REFRESH_BONUS_XP, comboMultiplier, dailyGoal, dailyXP } from '../regeln/index.js';
import { BLITZ_SECONDS } from '../runde/index.js';
import { Button } from '../komponenten/ui.js';
import { Icon } from '../komponenten/icons.js';
import { Mascot } from '../komponenten/mascot.js';
import { Confetti } from '../komponenten/confetti.js';

const h = createElement;

// Namen der Stufen. Eine App kann eigene setzen (config.words.levelTitles). Legacy: profile.js:9.
export const LEVEL_TITLES = Object.freeze(['Neuling', 'Entdecker', 'Könner', 'Profi', 'Meister', 'Expert', 'Legende']);

// Texte der Wochenmissionen. Die IDs kommen aus regeln (MISSIONS), die Reihenfolge ebenfalls.
export const MISSION_TEXT = Object.freeze({
  units3: { title: 'Übe 3 verschiedene Seiten', unit: (n) => (n === 1 ? 'Seite' : 'Seiten') },
  refresh1: { title: 'Frische eine Seite auf', unit: (n) => (n === 1 ? 'Auffrischung' : 'Auffrischungen') },
  strong90: { title: 'Schaffe eine Runde mit mindestens 90 %', unit: (n) => (n === 1 ? 'Runde' : 'Runden') }
});

// Standard-Wörter der Legacy-Shell (shell.js:24-30). Eine App überschreibt sie über config.words.
export const DEFAULT_WORDS = Object.freeze({
  praise: ['Richtig!', 'Genau!', 'Super!', 'Stark!', 'Bravo!'],
  resultTitles: ['Geschafft!', 'Sehr gut!', 'Perfekt!'],
  blitzTitle: 'Blitzschnell!',
  levelTitles: undefined
});

export const wordsFor = (config) => ({ ...DEFAULT_WORDS, ...(config.words || {}) });

const againLabel = (mode) => (mode === 'quick' ? 'Noch eine Runde' : 'Nochmal');

// Ab so vielen richtigen Antworten gilt ein Blitz als gelungen (Legacy result.js:13 und celebrate).
const BLITZ_GOAL = 10;

// Der Text unter dem Titel. Die Reihenfolge der Fälle folgt result.js:20-23.
function subtitleFor(summary) {
  if (summary.failed) return 'Das passiert jedem. Schau kurz in die Theorie, die nächste Runde läuft besser.';
  let text;
  if (summary.mode === 'blitz') return `${summary.score} richtig in ${BLITZ_SECONDS} Sekunden.`;
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
 * Reine Ansicht des Ergebnisses. summary kommt aus ablauf.js (summaryOf).
 * Der Feier-Hinweis folgt result.js:34. Bei gescheiterter Runde gibt es keinen.
 */
export function resultModel(summary, { profile, day, words }) {
  const x = dailyXP(profile, day);
  const goal = dailyGoal(profile);
  const titles = words.levelTitles || LEVEL_TITLES;
  const level = summary.levelUp
    ? `Niveau ${summary.levelUp} erreicht · ${titles[Math.min(summary.levelUp - 1, titles.length - 1)]}`
    : null;
  // Blitz hat keine Sterne. Titel, Stimmung und Zahlen folgen Legacy result.js:12-16.
  const blitz = summary.mode === 'blitz';
  const blitzWell = summary.score >= BLITZ_GOAL;
  let title = words.resultTitles[Math.max(0, summary.stars - 1)];
  if (summary.failed) title = 'Knapp daneben';
  else if (blitz) title = blitzWell ? words.blitzTitle : 'Zeit um';
  // Die XP der Missionen stehen im Gesamtbetrag. Dieser Satz sagt, woher ein Teil davon kommt.
  const missions = summary.missions || [];
  const missionLine = missions.length
    ? `${missions.length === 1 ? 'Wochenmission' : 'Wochenmissionen'} erfüllt: ${missions.map((id) => MISSION_TEXT[id].title).join(', ')} · +${missions.length * MISSION_REWARD_XP} XP`
    : null;
  return {
    title,
    subtitle: subtitleFor(summary),
    mood: summary.failed ? 'hmm' : blitz ? (blitzWell ? 'cheer' : 'happy') : summary.stars === 3 ? 'cheer' : 'happy',
    stars: blitz ? null : summary.stars,
    facts: blitz
      ? [
        { value: summary.score, label: 'richtig' },
        { value: summary.xp + summary.bonus, label: 'XP' },
        { value: `×${comboMultiplier(summary.bestCombo)}`, label: 'bester Combo' }
      ]
      : [
        { value: `${Math.round(summary.accuracy * 100)} %`, label: 'richtig' },
        { value: summary.xp + summary.bonus, label: 'XP' },
        { value: summary.bestCombo, label: 'längste Serie' }
      ],
    daily: { xp: x, goal, reached: x >= goal },
    levelLine: level,
    missionLine,
    badges: summary.newBadges.map((badge) => ({ id: badge.id, n: badge.n, d: badge.d })),
    // Legacy result.js: Theorie nur nach einer Lektionsrunde, dann der Weg zurück.
    actions: [
      { id: 'again', label: againLabel(summary.mode) },
      ...(summary.mode === 'lesson' && summary.unitId ? [{ id: 'theory', label: 'Theorie' }] : []),
      { id: 'home', label: 'Zum Lernpfad' }
    ],
    celebrate: Boolean(summary.goalHit || (!summary.failed && (blitz ? blitzWell : (summary.mode === 'boss' || summary.stars >= 2))))
  };
}

/** Meldungen zur Speicherung, als Texte. Leer, wenn alles gut ging. */
export const messagesOf = ({ saved, logged }) => [saved.ok ? null : saved.error, logged.ok ? null : logged.error].filter(Boolean);

/**
 * Die Ergebnis-Karte. Markup und Texte folgen legacy/modulare/core/js/views/result.js (Pixelparität).
 * Sterne stehen als Text dabei, nicht nur als Symbol (RULE-075, AGENTS.md). Blitz hat keine Sterne.
 */
export function Ergebnis({ model, messages = [], onAction }) {
  return h(
    'section',
    { className: 'card res' },
    h(Mascot, { mood: model.mood }),
    h('h1', null, model.title),
    model.stars === null
      ? null
      : h(
        'div',
        { className: 'rstars', 'aria-label': `${model.stars} von 3 Sternen` },
        [1, 2, 3].map((i) => h('span', { key: i, className: i <= model.stars ? 'on' : '' }, h(Icon, { name: 'star' })))
      ),
    h('p', { style: { margin: 0, maxWidth: '46ch' } }, model.subtitle),
    h('div', { className: 'facts' }, ...model.facts.map((fact) => h('div', { key: fact.label, className: 'fact' }, h('b', null, String(fact.value)), h('span', null, fact.label)))),
    h(
      'div',
      { className: 'gline' },
      h('b', null, model.daily.reached ? 'Tagesziel geschafft!' : `Tagesziel: noch ${model.daily.goal - model.daily.xp} XP`),
      h('div', { className: 'bar' }, h('i', { style: { width: `${Math.min(100, (model.daily.xp / model.daily.goal) * 100)}%` } }))
    ),
    model.levelLine ? h('p', { className: 'lvup' }, model.levelLine) : null,
    model.missionLine ? h('p', { className: 'lvup' }, model.missionLine) : null,
    model.badges.length
      ? h('div', null, h('p', { className: 'kicker' }, 'Neue Trophäen'), h('div', { className: 'badges', style: { justifyContent: 'center' } }, ...model.badges.map((b) => h('div', { key: b.id, className: 'badge got' }, h('b', null, b.n), h('span', null, b.d)))))
      : null,
    h('div', { className: 'acts' }, ...model.actions.map((a) => h(Button, { key: a.id, variant: a.id === 'again' ? 'primary' : 'ghost', onClick: () => onAction(a.id) }, a.label))),
    ...messages.map((text) => h('p', { key: text, className: 'notice', role: 'status' }, text)),
    model.celebrate ? h(Confetti, { seed: 7, count: 40, reduced: false }) : null
  );
}
