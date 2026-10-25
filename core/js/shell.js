// App-Shell: Kopfzeile, Startseite mit Tagesziel und Lernpfad, Theorie-Einbindung, Runden und Ergebnis.
// Eine App besteht nur noch aus ihrer Konfiguration (siehe AGENTS.md, "App-Vertrag").
import { $, esc, pick } from './ui.js';
import { icon } from './icons.js';
import { mascot } from './mascot.js';
import { confetti } from './confetti.js';
import { startQuiz, startBlitz } from './quiz.js';
import { finalizeRound } from './rounds.js';
import { logEvent, exportAll, importAll } from './db.js';
import {
  GOAL, openProfile, openApp, appDefaults, levelOf, lvlAt, titleOf, dailyXP, streakNow, multiplier, isDue, weakestUnit
} from './profile.js';

const stars = (n) =>
  `<span class="stars" aria-label="${n} von 3 Sternen">${[1, 2, 3].map((i) => `<span class="${i <= n ? 'on' : ''}">${icon('star')}</span>`).join('')}</span>`;

/**
 * @param {object} config   App-Konfiguration (App-Vertrag)
 * @param {{header:HTMLElement, main:HTMLElement}} roots
 */
export async function mountApp(config, { header, main }) {
  const [profileStore, appStore] = await Promise.all([openProfile(), openApp(config.id)]);
  const profile = profileStore.state;
  const app = appStore.state;
  // Wörter für Lob und Ergebnis. Eine App kann sie mit config.words überschreiben (z. B. französisch).
  const words = {
    praise: ['Richtig!', 'Genau!', 'Super!', 'Stark!', 'Bravo!'],
    resultTitles: ['Geschafft!', 'Sehr gut!', 'Perfekt!'],
    levelTitles: undefined,
    blitzTitle: 'Blitzschnell!',
    ...config.words
  };
  const ctx = {
    profile, app, words,
    save() { profileStore.save(); appStore.save(); },
    refreshHeader: renderHeader
  };

  let view = 'home';
  let controller = null;
  let resetAsk = false;

  const unitById = (id) => config.units.find((u) => u.id === id);
  const bossOpen = () => (config.bossUnlocked ? config.bossUnlocked(ctx) : config.units.every((u) => (app.stars[u.id] || 0) > 0));

  function stop() {
    if (controller) controller.destroy();
    controller = null;
    main.querySelectorAll('.cf').forEach((n) => n.remove());
  }

  function renderHeader() {
    const level = levelOf(profile.xp);
    const a = lvlAt(level), b = lvlAt(level + 1);
    const pct = Math.round(((profile.xp - a) / (b - a)) * 100);
    header.innerHTML = `<button class="brand" data-act="home">${esc(config.title)}</button><a class="alla" href="${esc(config.dashboardHref || '../../index.html')}">Alle Apps</a>
      <div class="stats"><div class="lvl" title="${esc(titleOf(level, words.levelTitles))}"><span>Niveau ${level}</span><div class="xpbar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><span>${profile.xp} XP</span></div>
      <div class="streak" title="Tage in Folge geübt">${icon('flame')}<b>${streakNow(profile)}</b></div></div>`;
  }

  function minouSays() {
    const x = dailyXP(profile);
    if (x >= GOAL) return 'Tagesziel geschafft. Alles ab jetzt ist Bonus.';
    if (x === 0) return pick(['Nur 2 Minuten, dann bist du schon im Spiel.', 'Eine kurze Runde reicht für heute.', 'Klein anfangen zählt. Fünf Aufgaben, mehr nicht.']);
    return `Noch ${GOAL - x} XP bis zum Tagesziel. Das ist ungefähr eine Runde.`;
  }

  function renderHome() {
    stop();
    view = 'home';
    renderHeader();
    main.style.removeProperty('--lc');
    const done = config.units.filter((u) => (app.stars[u.id] || 0) > 0).length;
    const x = dailyXP(profile), ratio = Math.min(1, x / GOAL), C = 2 * Math.PI * 32;
    const nodes = config.units.map((u) => `<button class="node" style="--lc:${esc(u.color)}" data-act="open" data-id="${esc(u.id)}"><span class="circ">${esc(u.ic)}</span><span><h3>${esc(u.title)}</h3><small>${esc(u.de)}</small>${isDue(app, u.id) ? '<span class="due">Zeit zum Auffrischen</span>' : ''}</span>${stars(app.stars[u.id] || 0)}</button>`).join('');
    const badges = config.badges.map((b) => `<div class="badge ${app.badges[b.id] ? 'got' : ''}"><b>${esc(b.n)}</b><span>${esc(b.d)}</span></div>`).join('');
    const greet = `${esc(config.greeting || 'Hallo')}${profile.name ? ', ' + esc(profile.name) : ''} !`;
    const nameForm = profile.name ? '' : '<div class="name"><input id="nm" placeholder="Wie heißt du?" maxlength="20" autocomplete="off" aria-label="Dein Name"><button class="btn sun" data-act="savename">Los</button></div>';
    const hasBoss = Boolean(config.rounds.boss), open = bossOpen();
    const weak = weakestUnit(app, config.units);
    const training = weak
      ? `<div class="card"><h3>Gezieltes Training</h3><p>${esc(weak.reason)}: <b>${esc(weak.unit.title)}</b>. Wer gezielt Schwächen übt, lernt am schnellsten. Auffrischen bringt außerdem 10 Bonus-XP.</p><button class="btn" data-act="weak" data-id="${esc(weak.unit.id)}">Jetzt trainieren</button></div>`
      : '';
    const cardUnits = config.units.filter((u) => u.card);
    const medal = ['', 'Bronze', 'Silber', 'Gold'];
    const album = cardUnits.length
      ? `<section><h2>Sammelalbum</h2><p class="muted" style="margin:4px 0 14px;font-size:14px">Für jede Seite gibt es eine Karte. Mit mehr Sternen wird sie wertvoller: Bronze, Silber, Gold.</p><div class="album">${cardUnits.map((u) => {
        const n = app.stars[u.id] || 0;
        return n
          ? `<article class="gcard t${n}" style="--lc:${esc(u.color)}"><span class="medal">${medal[n]}</span><h3>${esc(u.card.name)}</h3><p>${esc(u.card.fact)}</p></article>`
          : `<article class="gcard t0"><span class="medal">Gesperrt</span><h3>Geheimkarte</h3><p>Schaffe die Seite „${esc(u.title)}“, um sie freizuschalten.</p></article>`;
      }).join('')}</div></section>`
      : '';
    const modes = [
      training,
      config.blitz ? `<div class="card"><h3>Blitz</h3><p>45 Sekunden Tempo. Wie viele schaffst du? Bestwert: <b>${app.best.blitz || 0}</b></p><button class="btn" data-act="blitz">Blitz starten</button></div>` : '',
      hasBoss ? `<div class="card"><h3>${esc(config.bossTitle || 'Endgegner')}</h3><p>${open ? '12 gemischte Aufgaben mit nur 3 Herzen. Wer gewinnt, bekommt 50 Bonus-XP.' : 'Der Endgegner wartet, sobald alle Seiten mindestens einen Stern haben.'}</p><button class="btn" data-act="boss" ${open ? '' : 'disabled'}>${open ? 'Endgegner starten' : 'Noch gesperrt'}</button></div>` : ''
    ].join('');
    main.innerHTML = `
      <section class="card hero">
        <div class="row1">${mascot('happy')}<div><h1>${greet}</h1><div class="bubble" style="margin-top:10px">${esc(minouSays())}</div></div></div>
        ${nameForm}
        <div class="goalbox">
          <div class="ring" role="img" aria-label="Tagesziel ${Math.min(x, GOAL)} von ${GOAL} XP"><svg viewBox="0 0 76 76"><circle class="t" cx="38" cy="38" r="32" fill="none" stroke-width="8"/><circle class="p" cx="38" cy="38" r="32" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - ratio)).toFixed(1)}"/></svg><b>${Math.min(x, GOAL)}<br><small style="font-size:11px;font-weight:600">/ ${GOAL}</small></b></div>
          <p><strong>Tagesziel: ${GOAL} XP</strong>${x >= GOAL ? 'Geschafft. Du bist heute fertig.' : 'Eine kurze Runde bringt dich nah ran.'} ${done} von ${config.units.length} Seiten sind geschafft.</p>
          ${config.rounds.quick ? '<button class="btn sun" data-act="quick">2-Minuten-Runde</button>' : ''}
        </div>
      </section>
      <section><h2>Dein Lernpfad</h2><p class="muted" style="margin:4px 0 14px;font-size:14px">${esc(config.intro || 'Starte irgendwo. Die Reihenfolge ist nur ein Vorschlag.')}</p><div class="path">${nodes}</div></section>
      ${modes ? `<section><h2>Spielmodi</h2><div class="modes" style="margin-top:12px">${modes}</div></section>` : ''}
      ${album}
      <section><h2>Trophäen</h2><div class="badges" style="margin-top:12px">${badges}</div></section>
      <p class="muted" style="font-size:13px">Dein Fortschritt wird in diesem Browser gespeichert. ${resetAsk ? '<button class="link" data-act="resetok">Wirklich alles löschen?</button>' : '<button class="link" data-act="reset">Fortschritt dieser App zurücksetzen</button>'}</p>
      <p class="muted" style="font-size:13px"><button class="link" data-act="backup">Fortschritt sichern (Datei)</button> · <label class="link" style="cursor:pointer">Sicherung einspielen<input type="file" accept="application/json,.json" id="restore" hidden></label><span id="bmsg" role="status"></span></p>`;
  }

  function renderTheory(unitId) {
    stop();
    view = 'theory';
    renderHeader();
    const unit = unitById(unitId);
    main.style.setProperty('--lc', unit.color);
    main.innerHTML = '<button class="link back" data-act="home">← Zum Lernpfad</button><div id="theory"></div>';
    config.theory($('#theory', main), unit, { start: () => startRound('lesson', unit.id) });
    window.scrollTo(0, 0);
  }

  function startRound(mode, unitId) {
    stop();
    view = 'play';
    const unit = unitId ? unitById(unitId) : null;
    const questions = mode === 'lesson' ? config.rounds.lesson(unit) : config.rounds[mode]();
    controller = startQuiz({
      mount: main, ctx, mode, questions,
      color: unit ? unit.color : '',
      onExit: renderHome,
      onFinish: (result) => finishRound({ ...result, unit })
    });
  }

  function startBlitzRound() {
    stop();
    view = 'play';
    controller = startBlitz({
      mount: main, ctx, nextQuestion: config.blitz, onExit: renderHome,
      onFinish: (result) => finishRound(result)
    });
  }

  function finishRound(result) {
    finalizeRound({ config, profile, app, result });
    ctx.save();
    logEvent({ app: config.id, type: 'round', mode: result.mode, unit: result.unit ? result.unit.id : null, accuracy: result.accuracy, stars: result.stars, failed: Boolean(result.failed), score: result.score, xp: result.xp });
    stop();
    renderResult(result);
  }

  function renderResult(r) {
    view = 'result';
    renderHeader();
    main.style.removeProperty('--lc');
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
    main.innerHTML = `<section class="card res">${mascot(mood)}<h1>${esc(title)}</h1>${star}<p style="margin:0;max-width:46ch">${esc(sub)}</p><div class="facts">${facts}</div><div class="gline"><b>${x >= GOAL ? 'Tagesziel geschafft!' : `Tagesziel: noch ${GOAL - x} XP`}</b><div class="bar"><i style="width:${Math.min(100, (x / GOAL) * 100)}%"></i></div></div>${lv}${nb ? `<div><p class="kicker">Neue Trophäen</p><div class="badges" style="justify-content:center">${nb}</div></div>` : ''}<div class="acts">${acts}</div></section>`;
    const celebrate = r.goalHit || (r.mode === 'blitz' ? r.score >= 10 : !r.failed && (r.mode === 'boss' || r.stars >= 2));
    if (celebrate) confetti();
    window.scrollTo(0, 0);
  }

  function saveName() {
    const input = $('#nm', main);
    if (!input || !input.value.trim()) return;
    profile.name = input.value.trim().slice(0, 20);
    ctx.save();
    renderHome();
  }

  const actions = {
    home: () => { resetAsk = false; renderHome(); },
    open: (el) => renderTheory(el.dataset.id),
    start: (el) => startRound('lesson', el.dataset.id),
    quick: () => startRound('quick'),
    boss: () => { if (bossOpen()) startRound('boss'); },
    weak: (el) => startRound('lesson', el.dataset.id),
    blitz: startBlitzRound,
    savename: saveName,
    backup: async () => {
      const blob = new Blob([JSON.stringify(await exportAll(), null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `lernwerkstatt-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    },
    reset: () => { resetAsk = true; renderHome(); },
    resetok: () => {
      Object.keys(app).forEach((k) => delete app[k]);
      Object.assign(app, appDefaults());
      appStore.save();
      resetAsk = false;
      renderHome();
    }
  };

  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled || !actions[el.dataset.act]) return;
    actions[el.dataset.act](el);
  }
  main.addEventListener('click', onClick);
  header.addEventListener('click', onClick);
  main.addEventListener('change', async (e) => {
    if (e.target.id !== 'restore' || !e.target.files[0]) return;
    const note = $('#bmsg', main);
    try {
      await importAll(JSON.parse(await e.target.files[0].text()));
      location.reload();
    } catch (error) {
      if (note) note.textContent = ' ' + (error.message || 'Die Datei konnte nicht gelesen werden.');
    }
  });
  main.addEventListener('keydown', (e) => { if (e.target.id === 'nm' && e.key === 'Enter') saveName(); });

  renderHome();
}
