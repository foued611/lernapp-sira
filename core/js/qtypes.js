// Fragetypen als Register. Jeder Typ beschreibt selbst, wie er aussieht, wie er geprüft wird und wie er
// auf Klicks reagiert. Einen neuen Typ anlegen heißt: registerQuestionType('name', { ... }) aufrufen,
// ohne quiz.js oder shell.js anzufassen (siehe AGENTS.md, "Neuer Fragetyp").
//
// Ein Typ ist ein Objekt mit:
//   validate(q, assert)          prüft eine Frage dieses Typs (wird von den Tests benutzt)
//   init?(q)                     Startzustand pro Frage, landet in run.m
//   render(q, run, p)            HTML der Frage. p = { label, chip, prompt, sub, fb }
//   canCheck?(q, run)            darf "Prüfen" gedrückt werden? Fehlt die Funktion, gibt es keinen Prüfen-Knopf
//   grade?(q, run, mount)        'ok' | 'almost' | 'bad' | null (null = noch keine Antwort)
//   footHint?                    Text statt Prüfen-Knopf (z. B. bei Zuordnungen)
//   actions?                     { 'data-act-Name': (element, h) => void }, h = { run, q, settle, render, mount }
//   onInput?(event, h), onKey?(event, h)
import { $, esc, norm, stripAccents } from './ui.js';

const registry = new Map();

export function registerQuestionType(kind, impl) {
  registry.set(kind, impl);
}

export function questionType(kind) {
  const type = registry.get(kind);
  if (!type) throw new Error(`Unbekannter Fragetyp: ${kind}`);
  return type;
}

export const questionKinds = () => [...registry.keys()];

/** Findet den Klick-Handler zu einem data-act-Namen, egal welcher Typ ihn mitbringt. */
export function findAction(name) {
  for (const type of registry.values()) if (type.actions && type.actions[name]) return type.actions[name];
  return null;
}

/** Standardprüfung für Eingabefragen: gleich ist ok, nur Akzent fehlt ist "fast". */
export function defaultCheck(q) {
  return (input) => {
    const a = norm(input), b = norm(q.answer);
    if (a === b) return 'ok';
    return stripAccents(a) === stripAccents(b) ? 'almost' : 'bad';
  };
}

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

/** Kopf jeder Frage: Überschrift, Info-Feld, Haupttext, graue Zeile. */
export function questionParts(q, run, ctx = {}) {
  const fb = run.state === 'fb';
  return {
    fb,
    label: `<p class="qlabel">${esc(q.label)}</p>`,
    chip: q.chip ? q.chip : '',
    prompt: q.prompt ? `<p class="${q.promptStyle === 'big' ? 'big' : 'sentence'}">${q.prompt.replace('{{blank}}', blankHTML(q, run, fb))}</p>` : '',
    sub: q.sub ? `<p class="tr">${esc(q.sub)}</p>` : '',
    chars: ctx.inputChars || []
  };
}

export const renderQuestion = (q, run, ctx) => questionType(q.kind).render(q, run, questionParts(q, run, ctx));

// --- Auswahl ---------------------------------------------------------------

registerQuestionType('choice', {
  validate(q, assert) {
    const ids = q.options.map((o) => o.id);
    assert.ok(ids.includes(q.answer), `Antwort fehlt in den Optionen: ${q.label}`);
    assert.equal(new Set(ids).size, ids.length, 'Optionen müssen eindeutig sein');
    assert.ok(ids.length >= 2 && ids.length <= 4, 'zwei bis vier Optionen');
    if (q.prompt && q.prompt.includes('{{blank}}')) assert.ok(q.options.every((o) => o.fill !== undefined), 'Lücke braucht fill');
  },
  render(q, run, p) {
    const cls = (o, i) => {
      if (p.fb) return o.id === q.answer ? 'opt right' : run.sel === i ? 'opt wrong' : 'opt';
      return run.sel === i ? 'opt sel' : 'opt';
    };
    const list = q.optionsLayout === 'list';
    return `${p.label}${p.chip}${p.prompt}${p.sub}<div class="${list ? '' : 'opts'}" ${list ? 'style="display:grid;gap:12px"' : ''}>${q.options
      .map((o, i) => `<button class="${cls(o, i)}" ${p.fb ? 'disabled' : ''} data-act="pick" data-i="${i}"><kbd>${i + 1}</kbd>${o.html}</button>`)
      .join('')}</div>`;
  },
  canCheck: (q, run) => run.sel !== null,
  grade: (q, run) => (q.options[run.sel].id === q.answer ? 'ok' : 'bad'),
  actions: { pick: (el, h) => { if (h.run.state === 'ask') { h.run.sel = +el.dataset.i; h.render(); } } },
  onKey(e, h) {
    if (h.run.state === 'ask' && /^[1-9]$/.test(e.key) && h.q.options[+e.key - 1]) { h.run.sel = +e.key - 1; h.render(); }
  }
});

// --- Eingabe ---------------------------------------------------------------

registerQuestionType('type', {
  validate(q, assert) {
    assert.ok(q.answer, 'answer fehlt');
    if (q.check) assert.equal(q.check(q.answer), 'ok', 'die richtige Antwort muss ok sein');
  },
  render(q, run, p) {
    const state = p.fb ? (run.fb.kind === 'bad' ? 'bad' : 'ok') : '';
    const chars = !p.fb && q.accents !== false && p.chars.length
      ? `<div class="acc">${p.chars.map((c) => `<button class="chip" data-act="ch" data-c="${esc(c)}" type="button">${esc(c)}</button>`).join('')}</div>`
      : '';
    return `${p.label}${p.chip}${p.prompt}${p.sub}<input id="ans" class="ans ${state}" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" value="${esc(run.typed)}" ${p.fb ? 'readonly' : ''} placeholder="${esc(q.placeholder || 'Antwort eintippen')}">${chars}`;
  },
  canCheck: (q, run) => Boolean(run.typed.trim()),
  grade(q, run, mount) {
    const input = $('#ans', mount);
    const raw = input ? input.value : run.typed;
    if (!raw.trim()) return null;
    run.typed = raw;
    return (q.check || defaultCheck(q))(raw);
  },
  actions: {
    ch(el, h) {
      const input = $('#ans', h.mount);
      if (!input) return;
      const c = el.dataset.c;
      const s = input.selectionStart == null ? input.value.length : input.selectionStart;
      const e = input.selectionEnd == null ? s : input.selectionEnd;
      input.value = input.value.slice(0, s) + c + input.value.slice(e);
      input.focus();
      input.setSelectionRange(s + 1, s + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
  onInput(e, h) {
    if (e.target.id !== 'ans') return;
    h.run.typed = e.target.value;
    const btn = $('#chk', h.mount);
    if (btn) btn.disabled = !e.target.value.trim();
  }
});

// --- Zuordnen --------------------------------------------------------------

registerQuestionType('match', {
  validate(q, assert) {
    assert.equal(q.left.length, q.right.length);
    assert.equal(q.left.length, q.leftValues.length);
    assert.deepEqual([...q.leftValues].sort(), q.right.map((r) => r.value).sort());
  },
  init: () => ({ selL: null, doneL: {}, doneR: {}, slips: 0, flash: -1, n: 0 }),
  render(q, run, p) {
    const m = run.m, disabled = p.fb ? 'disabled' : '';
    return `${p.label}${p.chip}<div class="match"><div style="display:grid;gap:10px">${q.left
      .map((l, i) => `<button class="mb ${m.doneL[i] ? 'dn' : ''} ${m.selL === i ? 'sel' : ''}" ${disabled} data-act="mleft" data-i="${i}">${l}</button>`)
      .join('')}</div><div style="display:grid;gap:10px">${q.right
      .map((r, j) => `<button class="mb ${m.doneR[j] ? 'dn' : ''} ${m.flash === j ? 'shake' : ''}" ${disabled} data-act="mright" data-j="${j}">${r.html}</button>`)
      .join('')}</div></div>`;
  },
  footHint: 'Tippe links ein Element, dann rechts das passende.',
  actions: {
    mleft(el, h) {
      const { run } = h, i = +el.dataset.i;
      if (run.state !== 'ask' || run.m.doneL[i]) return;
      run.m.selL = i; run.m.flash = -1; h.render();
    },
    mright(el, h) {
      const { run, q } = h, m = run.m, j = +el.dataset.j;
      if (run.state !== 'ask' || m.selL === null || m.doneR[j]) return;
      if (q.leftValues[m.selL] === q.right[j].value) {
        m.doneL[m.selL] = 1; m.doneR[j] = 1; m.selL = null; m.flash = -1; m.n++;
        if (m.n >= q.left.length) return h.settle(m.slips ? 'almost' : 'ok');
      } else {
        m.slips++; m.flash = j; m.selL = null;
        if (m.slips === 1) {
          run.combo = 0; run.hearts--;
          if (run.hearts <= 0) { run.wrong++; run.fb = { kind: 'bad', gain: 0, mult: 1 }; run.state = 'fb'; }
        }
      }
      h.render();
    }
  }
});

/** Prüft eine Frage mit dem Prüfer ihres Typs (Tests). */
export function validateQuestion(q, assert) {
  assert.ok(q.label, 'label fehlt');
  questionType(q.kind).validate(q, assert);
}
