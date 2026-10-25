// Universeller Quiz-Motor: Runde mit Herzen, Combo, XP, Spickzettel und Feedback sowie der Blitz-Modus.
// Er kennt keinen Lernstoff. Jede App liefert Fragen im folgenden Format.
//
// Frage = {
//   kind:   'choice' | 'type' | 'match'
//   label:  string               kleine Überschrift, z. B. "Lücke füllen"
//   chip?:  html                 kleines Info-Feld über der Frage
//   prompt?: html                Haupttext, darf {{blank}} als Lücke enthalten
//   promptStyle?: 'sentence' | 'big'
//   sub?:   string               graue Zeile (z. B. Übersetzung), erscheint bei Erfolg als "= …"
//   answer: string               choice: Option-id, type: erwarteter Text
//   options?: [{ id, html, fill? }]   choice; fill = Text für die Lücke
//   optionsLayout?: 'list'       Optionen untereinander (für ganze Sätze)
//   placeholder?: string, accents?: boolean, check?: (input) => 'ok'|'almost'|'bad'   type
//   left?: [html], right?: [{ value, html }], leftValues?: [value]                    match
//   reveal?: html                Korrektur bei Fehler (Stiftschrift)
//   why?: string                 kurze Erklärung bei Fehler
//   help?: html                  Inhalt des Spickzettels
// }
import { $, esc, pick, norm, stripAccents } from './ui.js';
import { icon } from './icons.js';
import { mascot } from './mascot.js';
import { addXP, spendXP, multiplier } from './profile.js';

const PRAISE = ['Richtig!', 'Genau!', 'Très bien !', 'Parfait !', 'Bravo !', 'Super !'];
const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'û', 'œ'];

function defaultCheck(q) {
  return (input) => {
    const a = norm(input), b = norm(q.answer);
    if (a === b) return 'ok';
    return stripAccents(a) === stripAccents(b) ? 'almost' : 'bad';
  };
}

function newRun(mode, questions, maxHearts) {
  return {
    mode, questions, i: 0, hearts: maxHearts, maxHearts,
    xp: 0, correct: 0, almost: 0, wrong: 0, combo: 0, bestCombo: 0,
    state: 'ask', fb: null, sel: null, typed: '', peek: false, peeked: false, m: null,
    levelUp: null, goalHit: false
  };
}

const heartsHTML = (run) =>
  `<div class="hearts" aria-label="${run.hearts} Herzen">${Array.from({ length: run.maxHearts }, (_, i) =>
    `<span class="h ${i < run.hearts ? 'on' : 'off'}">${icon('heart')}</span>`).join('')}</div>`;

function blankHTML(q, run, fb) {
  let inner = '&nbsp;';
  if (!fb && q.kind === 'choice' && run.sel !== null) {
    const o = q.options[run.sel];
    inner = esc(o.fill !== undefined ? o.fill : '') || '&nbsp;';
  }
  if (fb) {
    const right = q.kind === 'choice' ? q.options.find((o) => o.id === q.answer) : null;
    inner = esc(right && right.fill !== undefined ? right.fill : q.answer);
  }
  return `<span class="blank ${fb ? 'ok' : ''}">${inner}</span>`;
}

function questionHTML(q, run) {
  const fb = run.state === 'fb';
  const disabled = fb ? 'disabled' : '';
  const chip = q.chip ? q.chip : '';
  const label = `<p class="qlabel">${esc(q.label)}</p>`;
  const prompt = q.prompt
    ? `<p class="${q.promptStyle === 'big' ? 'big' : 'sentence'}">${q.prompt.replace('{{blank}}', blankHTML(q, run, fb))}</p>`
    : '';
  const sub = q.sub ? `<p class="tr">${esc(q.sub)}</p>` : '';

  if (q.kind === 'choice') {
    const cls = (o, i) => {
      if (fb) return o.id === q.answer ? 'opt right' : run.sel === i ? 'opt wrong' : 'opt';
      return run.sel === i ? 'opt sel' : 'opt';
    };
    const list = q.optionsLayout === 'list';
    return `${label}${chip}${prompt}${sub}<div class="${list ? '' : 'opts'}" ${list ? 'style="display:grid;gap:12px"' : ''}>${q.options
      .map((o, i) => `<button class="${cls(o, i)}" ${disabled} data-act="pick" data-i="${i}"><kbd>${i + 1}</kbd>${o.html}</button>`)
      .join('')}</div>`;
  }

  if (q.kind === 'type') {
    const state = fb ? (run.fb.kind === 'bad' ? 'bad' : 'ok') : '';
    const accents = !fb && q.accents !== false
      ? `<div class="acc">${ACCENTS.map((c) => `<button class="chip" data-act="ch" data-c="${c}" type="button">${c}</button>`).join('')}</div>`
      : '';
    return `${label}${chip}${prompt}${sub}<input id="ans" class="ans ${state}" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" value="${esc(run.typed)}" ${fb ? 'readonly' : ''} placeholder="${esc(q.placeholder || 'Antwort eintippen')}">${accents}`;
  }

  const m = run.m;
  return `${label}${chip}<div class="match"><div style="display:grid;gap:10px">${q.left
    .map((l, i) => `<button class="mb ${m.doneL[i] ? 'dn' : ''} ${m.selL === i ? 'sel' : ''}" ${disabled} data-act="mleft" data-i="${i}">${l}</button>`)
    .join('')}</div><div style="display:grid;gap:10px">${q.right
    .map((r, j) => `<button class="mb ${m.doneR[j] ? 'dn' : ''} ${m.flash === j ? 'shake' : ''}" ${disabled} data-act="mright" data-j="${j}">${r.html}</button>`)
    .join('')}</div></div>`;
}

function feedbackHTML(q, run) {
  const f = run.fb;
  const next = '<button class="btn" data-act="next" id="nx">Weiter</button>';
  if (f.kind === 'ok') {
    const praise = f.mult > 1 ? `Serie ×${f.mult}!` : pick(PRAISE);
    return `<div class="fb ok" role="status">${mascot(f.mult > 1 ? 'cheer' : 'happy')}<div class="msg"><b>${praise}</b> <span class="gain">+${f.gain} XP${f.mult > 1 ? ` · Combo ×${f.mult}` : ''}</span>${q.sub ? `<p class="tr">= ${esc(q.sub)}</p>` : ''}</div>${next}</div>`;
  }
  if (f.kind === 'almost') {
    return `<div class="fb almost" role="status">${mascot('hmm')}<div class="msg"><b>Fast! Nur die Schreibweise:</b><div class="pen">${esc(q.answer)}</div><span class="gain">+${f.gain} XP</span></div>${next}</div>`;
  }
  const reveal = q.kind === 'match' ? '' : `<div class="pen">${q.reveal || esc(q.answer)}</div>`;
  return `<div class="fb bad" role="status">${mascot('sad')}<div class="msg"><b>Kein Problem, so geht es:</b>${reveal}<div class="why">${esc(q.why || 'Schau dir die Formen noch einmal an, dann klappt es.')}</div></div>${next}</div>`;
}

/**
 * Startet eine Übungsrunde.
 * @param {object} o
 * @param {HTMLElement} o.mount     Container für die Oberfläche
 * @param {{profile:object, app:object, save:()=>void, refreshHeader:()=>void}} o.ctx
 * @param {'lesson'|'boss'|'quick'} o.mode
 * @param {object[]} o.questions
 * @param {number} [o.hearts]
 * @param {string} [o.color]        Unit-Farbe (CSS-Wert) für Fortschrittsbalken und Rand
 * @param {()=>void} o.onExit
 * @param {(result:object)=>void} o.onFinish
 * @returns {{destroy:()=>void}}
 */
export function startQuiz({ mount, ctx, mode, questions, hearts = mode === 'boss' ? 3 : 5, color = '', onExit, onFinish }) {
  const run = newRun(mode, questions, hearts);
  const ac = new AbortController();
  const cur = () => run.questions[run.i];

  function initQuestion() {
    const q = cur();
    Object.assign(run, { state: 'ask', fb: null, sel: null, typed: '', peek: false, peeked: false });
    run.m = q.kind === 'match' ? { selL: null, doneL: {}, doneR: {}, slips: 0, flash: -1, n: 0 } : null;
  }

  function gain(amount) {
    if (!amount) return;
    run.xp += amount;
    const r = addXP(ctx.profile, ctx.app, amount);
    if (r.levelUp) run.levelUp = r.levelUp;
    if (r.goalHit) run.goalHit = true;
    ctx.save();
  }

  function render() {
    ctx.refreshHeader();
    const q = cur();
    const fb = run.state === 'fb';
    const pct = ((run.i + (fb ? 1 : 0)) / run.questions.length) * 100;
    let foot;
    if (fb) foot = feedbackHTML(q, run);
    else if (q.kind === 'match') foot = '<p class="muted" style="margin:0;font-size:14px">Tippe links ein Element, dann rechts das passende.</p>';
    else {
      const ready = q.kind === 'type' ? run.typed.trim() : run.sel !== null;
      foot = `<div class="row"><button class="btn" id="chk" data-act="check" ${ready ? '' : 'disabled'}>Prüfen</button></div>`;
    }
    const help = q.help ? `<div style="margin-top:14px"><button class="link" data-act="peek">${run.peek ? 'Spickzettel schließen' : 'Spickzettel öffnen (−3 XP)'}</button></div>${run.peek ? `<div class="peek">${q.help}</div>` : ''}` : '';
    mount.style.setProperty('--lc', color || 'var(--btn-bg)');
    mount.innerHTML = `
      <div class="playbar"><button class="x" data-act="exit" aria-label="Abbrechen">${icon('close')}</button><div class="pbar"><i style="width:${pct}%"></i></div>${heartsHTML(run)}</div>
      <div class="combo">${run.combo >= 3 ? `Combo ×${multiplier(run.combo)} · ${run.combo} in Folge` : ''}</div>
      <section class="card qcard">${questionHTML(q, run)}${help}</section>
      <div class="foot" aria-live="polite">${foot}</div>`;
    const input = $('#ans', mount);
    if (input && !fb) input.focus();
  }

  function settle(kind) {
    let amount = 0, mult = 1;
    if (kind === 'ok') {
      run.correct++; run.combo++; run.bestCombo = Math.max(run.bestCombo, run.combo);
      mult = multiplier(run.combo); amount = 10 * mult;
    } else if (kind === 'almost') {
      run.almost++; amount = 5;
    } else {
      run.wrong++; run.combo = 0; run.hearts--;
    }
    gain(amount);
    run.fb = { kind, gain: amount, mult };
    run.state = 'fb';
    render();
  }

  function check() {
    if (run.state !== 'ask') return;
    const q = cur();
    if (q.kind === 'choice') {
      if (run.sel === null) return;
      return settle(q.options[run.sel].id === q.answer ? 'ok' : 'bad');
    }
    if (q.kind === 'type') {
      const input = $('#ans', mount);
      const raw = input ? input.value : run.typed;
      if (!raw.trim()) return;
      run.typed = raw;
      return settle((q.check || defaultCheck(q))(raw));
    }
  }

  function finish(failed) {
    const total = run.questions.length;
    const accuracy = (run.correct + 0.5 * run.almost) / total;
    onFinish({
      mode, failed, total, accuracy,
      correct: run.correct, almost: run.almost, wrong: run.wrong,
      bestCombo: run.bestCombo, xp: run.xp,
      levelUp: run.levelUp, goalHit: run.goalHit
    });
  }

  function next() {
    if (run.state !== 'fb') return;
    if (run.fb.kind === 'bad' && run.hearts <= 0) return finish(true);
    run.i++;
    if (run.i >= run.questions.length) return finish(false);
    initQuestion();
    render();
    window.scrollTo(0, 0);
  }

  function matchLeft(i) {
    if (run.state !== 'ask' || run.m.doneL[i]) return;
    run.m.selL = i; run.m.flash = -1; render();
  }

  function matchRight(j) {
    const q = cur(), m = run.m;
    if (run.state !== 'ask' || m.selL === null || m.doneR[j]) return;
    if (q.leftValues[m.selL] === q.right[j].value) {
      m.doneL[m.selL] = 1; m.doneR[j] = 1; m.selL = null; m.flash = -1; m.n++;
      if (m.n >= q.left.length) return settle(m.slips ? 'almost' : 'ok');
    } else {
      m.slips++; m.flash = j; m.selL = null;
      if (m.slips === 1) {
        run.combo = 0; run.hearts--;
        if (run.hearts <= 0) { run.wrong++; run.fb = { kind: 'bad', gain: 0, mult: 1 }; run.state = 'fb'; }
      }
    }
    render();
  }

  function peek() {
    if (run.state !== 'ask') return;
    if (!run.peek && !run.peeked) {
      run.peeked = true;
      spendXP(ctx.profile, ctx.app, 3);
      run.xp = Math.max(0, run.xp - 3);
      ctx.save();
    }
    const input = $('#ans', mount);
    if (input) run.typed = input.value;
    run.peek = !run.peek;
    render();
  }

  function insertChar(c) {
    const input = $('#ans', mount);
    if (!input) return;
    const s = input.selectionStart == null ? input.value.length : input.selectionStart;
    const e = input.selectionEnd == null ? s : input.selectionEnd;
    input.value = input.value.slice(0, s) + c + input.value.slice(e);
    input.focus();
    input.setSelectionRange(s + 1, s + 1);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const actions = {
    exit: onExit,
    pick: (el) => { if (run.state === 'ask') { run.sel = +el.dataset.i; render(); } },
    check, next, peek,
    mleft: (el) => matchLeft(+el.dataset.i),
    mright: (el) => matchRight(+el.dataset.j),
    ch: (el) => insertChar(el.dataset.c)
  };

  mount.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (el && !el.disabled && actions[el.dataset.act]) actions[el.dataset.act](el);
  }, { signal: ac.signal });

  mount.addEventListener('mousedown', (e) => { if (e.target.closest('.acc .chip')) e.preventDefault(); }, { signal: ac.signal });

  mount.addEventListener('input', (e) => {
    if (e.target.id !== 'ans') return;
    run.typed = e.target.value;
    const btn = $('#chk', mount);
    if (btn) btn.disabled = !e.target.value.trim();
  }, { signal: ac.signal });

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName || '';
    if (e.key === 'Enter') {
      if (run.state === 'fb') { if (tag !== 'BUTTON') { e.preventDefault(); next(); } }
      else if (tag === 'INPUT') { e.preventDefault(); check(); }
    } else if (tag !== 'INPUT' && run.state === 'ask' && /^[1-9]$/.test(e.key)) {
      const q = cur();
      if (q.kind === 'choice' && q.options[+e.key - 1]) { run.sel = +e.key - 1; render(); }
    }
  }, { signal: ac.signal });

  initQuestion();
  render();
  window.scrollTo(0, 0);
  return { destroy: () => ac.abort() };
}

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
