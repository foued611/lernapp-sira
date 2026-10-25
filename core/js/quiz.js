// Universeller Quiz-Motor: Runde mit Herzen, Combo, XP, Spickzettel und Feedback sowie der Blitz-Modus.
// Er kennt keinen Lernstoff. Jede App liefert Fragen im folgenden Format.
//
// Frage = {
//   kind:   'choice' | 'type' | 'match' (oder ein eigener Typ aus core/js/qtypes.js)
//   label:  string               kleine Überschrift, z. B. "Lücke füllen"
//   chip?:  html                 kleines Info-Feld über der Frage
//   prompt?: html                Haupttext, darf {{blank}} als Lücke enthalten
//   promptStyle?: 'sentence' | 'big'
//   sub?:   string               graue Zeile (z. B. Übersetzung), erscheint bei Erfolg als "= …"
//   answer: string               choice: Option-id, type: erwarteter Text
//   options?: [{ id, html, fill? }]   choice; fill = Text für die Lücke
//   optionsLayout?: 'list'       Optionen untereinander (für ganze Sätze)
//   placeholder?: string, accents?: boolean (Zeichenleiste aus ctx.inputChars, Standard an), check?: (input) => 'ok'|'almost'|'bad'   type
//   left?: [html], right?: [{ value, html }], leftValues?: [value]                    match
//   reveal?: html                Korrektur bei Fehler (Stiftschrift)
//   why?: string                 kurze Erklärung bei Fehler
//   help?: html                  Inhalt des Spickzettels
// }
import { $, esc, pick, shuffle } from './ui.js';
import { icon } from './icons.js';
import { mascot } from './mascot.js';
import { addXP, spendXP, multiplier } from './profile.js';
import { questionType, renderQuestion, findAction } from './qtypes.js';

function newRun(mode, questions, maxHearts) {
  return {
    mode, questions, i: 0, hearts: maxHearts, maxHearts,
    xp: 0, correct: 0, almost: 0, wrong: 0, combo: 0, bestCombo: 0,
    state: 'ask', fb: null, sel: null, typed: '', peek: false, peeked: false, m: null,
    levelUp: null, goalHit: false, relearned: 0
  };
}

const heartsHTML = (run) =>
  `<div class="hearts" aria-label="${run.hearts} Herzen">${Array.from({ length: run.maxHearts }, (_, i) =>
    `<span class="h ${i < run.hearts ? 'on' : 'off'}">${icon('heart')}</span>`).join('')}</div>`;

function feedbackHTML(q, run, ctx) {
  const f = run.fb;
  const next = '<button class="btn" data-act="next" id="nx">Weiter</button>';
  if (f.kind === 'ok') {
    const praise = f.retry ? 'Diesmal sitzt es!' : f.mult > 1 ? `Serie ×${f.mult}!` : pick(ctx.words.praise);
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
 * @param {{profile:object, app:object, words:object, inputChars:string[], save:()=>void, refreshHeader:()=>void}} o.ctx
 * @param {'lesson'|'boss'|'quick'} o.mode
 * @param {object[]} o.questions
 * @param {number} [o.hearts]
 * @param {string} [o.color]        Unit-Farbe (CSS-Wert) für Fortschrittsbalken und Rand
 * @param {()=>void} o.onExit
 * @param {(result:object)=>void} o.onFinish
 * @returns {{destroy:()=>void}}
 */
export function startQuiz({ mount, ctx, mode, questions, hearts = mode === 'boss' ? 3 : 5, color = '', onExit, onFinish }) {
  // Falsch beantwortete Fragen kommen am Ende noch einmal (Wiederholen festigt). Darum arbeiten wir auf einer Kopie.
  const baseCount = questions.length;
  const run = newRun(mode, questions.slice(), hearts);
  const ac = new AbortController();
  const cur = () => run.questions[run.i];
  // Gibt den Fragetypen ihren Zugriff auf den Rundenzustand.
  const handle = () => ({ run, q: cur(), settle, render, mount });

  function initQuestion() {
    const q = cur(), type = questionType(q.kind);
    Object.assign(run, { state: 'ask', fb: null, sel: null, typed: '', peek: false, peeked: false });
    run.m = type.init ? type.init(q) : null;
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
    const q = cur(), type = questionType(q.kind);
    const fb = run.state === 'fb';
    const pct = ((run.i + (fb ? 1 : 0)) / run.questions.length) * 100;
    let foot;
    if (fb) foot = feedbackHTML(q, run, ctx);
    else if (type.canCheck) foot = `<div class="row"><button class="btn" id="chk" data-act="check" ${type.canCheck(q, run) ? '' : 'disabled'}>Prüfen</button></div>`;
    else foot = `<p class="muted" style="margin:0;font-size:14px">${esc(type.footHint || '')}</p>`;
    const help = q.help ? `<div style="margin-top:14px"><button class="link" data-act="peek">${run.peek ? 'Spickzettel schließen' : 'Spickzettel öffnen (−3 XP)'}</button></div>${run.peek ? `<div class="peek">${q.help}</div>` : ''}` : '';
    mount.style.setProperty('--lc', color || 'var(--btn-bg)');
    mount.innerHTML = `
      <div class="playbar"><button class="x" data-act="exit" aria-label="Abbrechen">${icon('close')}</button><div class="pbar"><i style="width:${pct}%"></i></div>${heartsHTML(run)}</div>
      <div class="combo">${run.combo >= 3 ? `Combo ×${multiplier(run.combo)} · ${run.combo} in Folge` : ''}</div>
      <section class="card qcard">${q.retry ? '<p class="retry-tag">Noch einmal: jetzt, wo du die Lösung kennst</p>' : ''}${renderQuestion(q, run, ctx)}${help}</section>
      <div class="foot" aria-live="polite">${foot}</div>`;
    const input = $('#ans', mount);
    if (input && !fb) input.focus();
  }

  function settle(kind) {
    let amount = 0, mult = 1;
    const q = cur();
    if (q.retry) {
      // Zweiter Versuch: zählt nicht für Genauigkeit und Herzen, bringt aber XP fürs Dazulernen.
      if (kind === 'ok' || kind === 'almost') { amount = 5; run.relearned++; }
      gain(amount);
      run.fb = { kind: amount ? 'ok' : 'bad', gain: amount, mult: 1, retry: true };
      run.state = 'fb';
      render();
      return;
    }
    if (kind === 'ok') {
      run.correct++; run.combo++; run.bestCombo = Math.max(run.bestCombo, run.combo);
      mult = multiplier(run.combo); amount = 10 * mult;
    } else if (kind === 'almost') {
      run.almost++; amount = 5;
    } else {
      run.wrong++; run.combo = 0; run.hearts--;
      if (mode !== 'boss' && q.kind !== 'match' && run.hearts > 0) {
        run.questions.push({ ...q, retry: true, options: q.options ? shuffle(q.options) : q.options });
      }
    }
    gain(amount);
    run.fb = { kind, gain: amount, mult };
    run.state = 'fb';
    render();
  }

  function check() {
    if (run.state !== 'ask') return;
    const q = cur(), type = questionType(q.kind);
    if (!type.grade || (type.canCheck && !type.canCheck(q, run))) return;
    const kind = type.grade(q, run, mount);
    if (kind) settle(kind);
  }

  function finish(failed) {
    const total = baseCount;
    const accuracy = (run.correct + 0.5 * run.almost) / total;
    onFinish({
      mode, failed, total, accuracy,
      correct: run.correct, almost: run.almost, wrong: run.wrong,
      bestCombo: run.bestCombo, xp: run.xp, relearned: run.relearned,
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

  const builtIn = { exit: onExit, check, next, peek };

  mount.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const name = el.dataset.act;
    const action = builtIn[name] || findAction(name);
    if (action) action(el, handle());
  }, { signal: ac.signal });

  mount.addEventListener('mousedown', (e) => { if (e.target.closest('.acc .chip')) e.preventDefault(); }, { signal: ac.signal });

  mount.addEventListener('input', (e) => {
    const type = questionType(cur().kind);
    if (type.onInput) type.onInput(e, handle());
  }, { signal: ac.signal });

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName || '';
    if (e.key === 'Enter') {
      if (run.state === 'fb') { if (tag !== 'BUTTON') { e.preventDefault(); next(); } }
      else if (tag === 'INPUT') { e.preventDefault(); check(); }
    } else if (tag !== 'INPUT') {
      const type = questionType(cur().kind);
      if (type.onKey) type.onKey(e, handle());
    }
  }, { signal: ac.signal });

  initQuestion();
  render();
  window.scrollTo(0, 0);
  return { destroy: () => ac.abort() };
}
