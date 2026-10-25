// Theorie-Seite: Konjugationstabelle, Merkzettel und Beispielsätze. Hier steckt nur Darstellung, kein Lernstoff.
import { esc } from '../../core/js/ui.js';
import { icon } from '../../core/js/icons.js';
import { V, SP } from './model.js';
import { elides, lab } from './builders.js';
import { lessonTop, lessonBottom, wireLesson } from '../../core/js/lesson.js';

const canSpeak = () => 'speechSynthesis' in window;

function speak(text) {
  try {
    if (!canSpeak()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } catch (error) {
    /* Sprachausgabe nicht verfügbar: die Seite funktioniert ohne. */
  }
}

const speakButton = (text) =>
  canSpeak() ? `<button class="say" data-act="say" data-t="${esc(text)}" aria-label="Vorlesen">${icon('say')}</button>` : '';

function formCell(v, i) {
  if (v.irr) return `<b>${esc(v.forms[i])}</b>`;
  const ending = v.ends[i];
  return `<span class="stem">${esc(v.stem)}</span><span class="end">${ending ? esc(ending) : '∅'}</span>`;
}

/** Wird von der Shell mit einem frischen Container aufgerufen. */
export function renderTheory(box, unit, { lessons, notes: allNotes }) {
  const state = { verb: unit.verbs[0], cover: false };
  const spec = lessons[unit.id];
  const notes = (allNotes[unit.id] || []).map((t) => `<div class="note"><b>${esc(t[0])}</b>${esc(t[1])}</div>`).join('');
  const examples = SP[unit.id].slice(0, 3).map((s) => {
    const form = s.v.forms[s.p];
    return `<li><div><div class="fr">${esc(s.fr).replace('___', `<span class="mk">${esc(form)}</span>`)}</div><div class="de">${esc(s.de)}</div></div>${speakButton(s.fr.replace('___', form))}</li>`;
  }).join('');
  // Die Lektion wird nur einmal gezeichnet, damit Schritte und Mini-Check beim Wechseln der Verben erhalten bleiben.
  box.innerHTML = `
    <div style="display:grid;gap:22px">
      <div data-conj></div>
      ${lessonTop(spec)}
      ${lessonBottom(spec)}
      <section class="card"><h3 style="margin-bottom:10px">So sieht das im Satz aus</h3><ul class="ex">${examples}</ul></section>
      <section><h2>Merkzettel</h2><div class="notes" style="margin-top:12px">${notes}</div></section>
      <div><button class="btn" data-act="start" data-id="${esc(unit.id)}">Übung starten · 8 Aufgaben</button></div>
    </div>`;
  const conj = box.querySelector('[data-conj]');

  function paint() {
    const v = V[state.verb];
    const chips = unit.verbs.length > 1
      ? `<div class="chips">${unit.verbs.map((k) => `<button class="chip ${k === state.verb ? 'on' : ''}" data-act="verb" data-v="${esc(k)}">${esc(V[k].inf)}</button>`).join('')}</div>`
      : '';
    const rows = [0, 1, 2, 3, 4, 5].map((i) => {
      const third = v.irr ? esc(v.deF[i]) : (v.ends[i] ? `Endung -${esc(v.ends[i])}` : 'keine Endung');
      const speech = lab(v, i) + (i === 0 && elides(v) ? '' : ' ') + v.forms[i];
      return `<tr><td class="pr">${esc(lab(v, i))}</td><td class="fm ${state.cover ? 'hid' : ''}" data-act="reveal"><span class="val">${formCell(v, i)}</span><span class="qm">tippen</span></td><td class="third">${third}</td><td class="sp">${speakButton(speech)}</td></tr>`;
    }).join('');
    conj.innerHTML = `
      <section class="card tcard"><div class="thead"><h1>${esc(unit.irr ? v.inf : unit.title)}</h1><span class="de">${esc(unit.irr ? v.de + ' · unregelmäßig' : unit.de)}</span></div>
        <div style="margin:14px 0 8px;display:grid;gap:10px">${chips}<div><button class="chip ${state.cover ? 'on' : ''}" data-act="cover">Selbsttest: Formen abdecken</button></div></div>
        <table class="conj"><tbody>${rows}</tbody></table>
        ${v.irr ? '' : '<p class="muted" style="font-size:13px;margin:8px 0 0">Gelb markiert ist die Endung. Der Stamm bleibt gleich.</p>'}
      </section>`;
  }

  box.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'verb') { state.verb = el.dataset.v; paint(); }
    else if (act === 'cover') { state.cover = !state.cover; paint(); }
    else if (act === 'reveal') el.classList.remove('hid');
    else if (act === 'say') speak(el.dataset.t);
  });

  paint();
  wireLesson(box, spec);
}
