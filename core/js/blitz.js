// Blitz-Modus: 45 Sekunden, nur Auswahlfragen, Combo und XP. Eigener Ablauf, getrennt vom Rundenmotor in quiz.js.
import { $, esc } from './ui.js';
import { icon } from './icons.js';
import { addXP, multiplier } from './profile.js';

/**
 * Blitz-Modus: Zeitlimit, nur Auswahlfragen.
 * @param {object} o
 * @param {HTMLElement} o.mount
 * @param {object} o.ctx
 * @param {()=>object} o.nextQuestion   liefert eine Frage mit kind "choice"
 * @param {number} [o.seconds]
 * @param {()=>void} o.onExit
 * @param {(result:object)=>void} o.onFinish
 */
export function startBlitz({ mount, ctx, nextQuestion, seconds = 45, onExit, onFinish }) {
  const ac = new AbortController();
  const run = { score: 0, xp: 0, combo: 0, bestCombo: 0, lock: false, q: nextQuestion(), t0: performance.now(), levelUp: null, goalHit: false, done: false };
  let tick = 0, timeout = 0;

  function render() {
    ctx.refreshHeader();
    const q = run.q;
    const prompt = q.prompt ? `<p class="${q.promptStyle === 'big' ? 'big' : 'sentence'}">${q.prompt.replace('{{blank}}', '<span class="blank">&nbsp;</span>')}</p>` : '';
    mount.style.setProperty('--lc', 'var(--btn-bg)');
    mount.innerHTML = `
      <div class="playbar"><button class="x" data-act="exit" aria-label="Abbrechen">${icon('close')}</button><div class="timer" style="flex:1"><i id="tbar" style="width:100%"></i></div><span class="score" id="tleft">${seconds} s</span></div>
      <div class="combo">${run.combo >= 3 ? `Combo ×${multiplier(run.combo)} · ${run.combo} in Folge` : 'Richtig: ' + run.score}</div>
      <section class="card qcard"><p class="qlabel">${esc(q.label)}</p>${q.chip || ''}${prompt}${q.sub ? `<p class="tr">${esc(q.sub)}</p>` : ''}
        <div class="opts">${q.options.map((o, i) => `<button class="opt" data-act="pick" data-i="${i}"><kbd>${i + 1}</kbd>${o.html}</button>`).join('')}</div></section>`;
  }

  function pickOption(i) {
    if (run.lock || run.done) return;
    const q = run.q, ok = q.options[i].id === q.answer;
    run.lock = true;
    mount.querySelectorAll('.opt').forEach((b, k) => {
      if (q.options[k].id === q.answer) b.classList.add('right');
      else if (k === i) b.classList.add('wrong');
    });
    if (ok) {
      run.score++; run.combo++; run.bestCombo = Math.max(run.bestCombo, run.combo);
      const amount = 5 * multiplier(run.combo);
      run.xp += amount;
      const r = addXP(ctx.profile, ctx.app, amount);
      if (r.levelUp) run.levelUp = r.levelUp;
      if (r.goalHit) run.goalHit = true;
      ctx.save();
    } else run.combo = 0;
    timeout = setTimeout(() => { if (run.done) return; run.q = nextQuestion(); run.lock = false; render(); }, ok ? 280 : 900);
  }

  function end() {
    if (run.done) return;
    run.done = true;
    destroy();
    onFinish({ mode: 'blitz', score: run.score, xp: run.xp, bestCombo: run.bestCombo, levelUp: run.levelUp, goalHit: run.goalHit });
  }

  function destroy() {
    clearInterval(tick); clearTimeout(timeout); ac.abort();
  }

  mount.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.dataset.act === 'exit') { run.done = true; destroy(); onExit(); }
    else if (el.dataset.act === 'pick') pickOption(+el.dataset.i);
  }, { signal: ac.signal });

  document.addEventListener('keydown', (e) => {
    if (/^[1-9]$/.test(e.key) && run.q.options[+e.key - 1]) pickOption(+e.key - 1);
  }, { signal: ac.signal });

  render();
  tick = setInterval(() => {
    const left = Math.max(0, seconds - (performance.now() - run.t0) / 1000);
    const bar = $('#tbar', mount), label = $('#tleft', mount);
    if (bar) bar.style.width = (left / seconds) * 100 + '%';
    if (label) label.textContent = Math.ceil(left) + ' s';
    if (left <= 0) end();
  }, 100);
  window.scrollTo(0, 0);
  return { destroy };
}
