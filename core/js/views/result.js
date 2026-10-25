// Ergebnisansicht einer Runde: reine Funktion von Ergebnis und Zustand zu HTML plus Feier-Hinweis.
import { esc } from '../ui.js';
import { icon } from '../icons.js';
import { mascot } from '../mascot.js';
import { GOAL, dailyXP, titleOf, multiplier } from '../profile.js';

/** @returns {{html:string, celebrate:boolean}} */
export function resultView(r, { profile, app, words }) {
  const nb = r.newBadges.map((b) => `<div class="badge got"><b>${esc(b.n)}</b><span>${esc(b.d)}</span></div>`).join('');
  const lv = r.levelUp ? `<div class="lvup">Niveau ${r.levelUp} erreicht · ${esc(titleOf(r.levelUp, words.levelTitles))}</div>` : '';
  let title, sub, mood, facts, acts;
  if (r.mode === 'blitz') {
    title = r.score >= 10 ? words.blitzTitle : 'Zeit um';
    sub = `${r.score} richtig in 45 Sekunden. Dein Bestwert liegt bei ${app.best.blitz || 0}.`;
    mood = r.score >= 10 ? 'cheer' : 'happy';
    facts = `<div class="fact"><b>${r.score}</b><span>richtig</span></div><div class="fact"><b>${r.xp}</b><span>XP</span></div><div class="fact"><b>×${multiplier(r.bestCombo)}</b><span>bester Combo</span></div>`;
    acts = '<button class="btn" data-act="blitz">Nochmal</button><button class="btn ghost" data-act="home">Zum Lernpfad</button>';
  } else {
    title = r.failed ? 'Knapp daneben' : words.resultTitles[Math.max(0, r.stars - 1)];
    sub = r.failed ? 'Das passiert jedem. Schau kurz in die Theorie, die nächste Runde läuft besser.'
      : r.mode === 'boss' ? 'Endgegner besiegt. 50 Bonus-XP gehören dir.'
        : r.mode === 'quick' ? 'Kurze Runde, echter Fortschritt.' : r.refresh ? 'Aufgefrischt! Dafür gibt es 10 Bonus-XP. Wiederholen nach ein paar Tagen bringt dein Wissen ins Langzeitgedächtnis.' : 'Seite geschafft. Mit mehr richtigen Antworten gibt es mehr Sterne.';
    if (!r.failed && r.relearned) sub += ` ${r.relearned} falsche Aufgabe${r.relearned > 1 ? 'n' : ''} hast du im zweiten Versuch richtig gelöst.`;
    mood = r.failed ? 'hmm' : r.stars === 3 ? 'cheer' : 'happy';
    facts = `<div class="fact"><b>${Math.round(r.accuracy * 100)} %</b><span>richtig</span></div><div class="fact"><b>${r.xp + r.bonus}</b><span>XP</span></div><div class="fact"><b>${r.bestCombo}</b><span>längste Serie</span></div>`;
    const again = r.mode === 'boss' ? '<button class="btn" data-act="boss">Nochmal</button>'
      : r.mode === 'quick' ? '<button class="btn" data-act="quick">Noch eine Runde</button>'
        : `<button class="btn" data-act="start" data-id="${esc(r.unit.id)}">Nochmal</button>`;
    acts = again + (r.mode === 'lesson' ? `<button class="btn ghost" data-act="open" data-id="${esc(r.unit.id)}">Theorie</button>` : '') + '<button class="btn ghost" data-act="home">Zum Lernpfad</button>';
  }
  const x = dailyXP(profile);
  const star = r.mode === 'blitz' ? '' : `<div class="rstars">${[1, 2, 3].map((i) => `<span class="${i <= r.stars ? 'on' : ''}">${icon('star')}</span>`).join('')}</div>`;
  const html = `<section class="card res">${mascot(mood)}<h1>${esc(title)}</h1>${star}<p style="margin:0;max-width:46ch">${esc(sub)}</p><div class="facts">${facts}</div><div class="gline"><b>${x >= GOAL ? 'Tagesziel geschafft!' : `Tagesziel: noch ${GOAL - x} XP`}</b><div class="bar"><i style="width:${Math.min(100, (x / GOAL) * 100)}%"></i></div></div>${lv}${nb ? `<div><p class="kicker">Neue Trophäen</p><div class="badges" style="justify-content:center">${nb}</div></div>` : ''}<div class="acts">${acts}</div></section>`;
  const celebrate = r.goalHit || (r.mode === 'blitz' ? r.score >= 10 : !r.failed && (r.mode === 'boss' || r.stars >= 2));
  return { html, celebrate };
}
