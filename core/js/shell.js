// App-Shell: Kopfzeile, Navigation zwischen den Ansichten und Verdrahtung der Runden. Die Ansichten selbst liegen in views/.
// Eine App besteht nur noch aus ihrer Konfiguration (siehe AGENTS.md, "App-Vertrag").
import { $, esc } from './ui.js';
import { icon } from './icons.js';
import { confetti } from './confetti.js';
import { startQuiz } from './quiz.js';
import { startBlitz } from './blitz.js';
import { finalizeRound } from './rounds.js';
import { logEvent } from './db.js';
import { homeHTML } from './views/home.js';
import { resultView } from './views/result.js';
import { downloadBackup, restoreBackup } from './views/backup.js';
import { openProfile, openApp, appDefaults, levelOf, lvlAt, titleOf, streakNow } from './profile.js';

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
    inputChars: config.inputChars || [],
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

  function renderHome() {
    stop();
    view = 'home';
    renderHeader();
    main.style.removeProperty('--lc');
    main.innerHTML = homeHTML({ config, profile, app, bossOpen: bossOpen(), resetAsk });
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
    const { html, celebrate } = resultView(r, { profile, app, words });
    main.innerHTML = html;
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
    backup: downloadBackup,
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
      await restoreBackup(e.target.files[0]);
      location.reload();
    } catch (error) {
      if (note) note.textContent = ' ' + (error.message || 'Die Datei konnte nicht gelesen werden.');
    }
  });
  main.addEventListener('keydown', (e) => { if (e.target.id === 'nm' && e.key === 'Enter') saveName(); });

  renderHome();
}
