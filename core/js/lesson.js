// Bausteine für Lektionen (Theorie-Seiten), die für alle Apps gleich aufgebaut sind.
// Aufbau einer Lektion, in dieser Reihenfolge:
//   Ziel · In 30 Sekunden · Stell dir vor · Bild · [Ausprobieren] · Schritt für Schritt · Falle und Merksatz · Mini-Check
// Eine App liefert die Inhalte als "Lektionsbeschreibung" (siehe assertValidLesson in tests/helpers.js).
import { esc } from './ui.js';
import { mascot } from './mascot.js';

/**
 * Lektionsbeschreibung:
 * {
 *   goal:     string                      "Du kannst danach …" (ein Satz)
 *   tldr:     string[]                    zwei bis vier kurze Sätze (HTML erlaubt)
 *   analogy:  { title, html }             Vergleich aus dem Alltag
 *   figure:   { svg, caption }            Diagramm (SVG-Text) mit Bildunterschrift
 *   steps:    { title, items: html[] }    durchgerechnetes Beispiel, Schritt für Schritt
 *   pitfall:  { html }                    typischer Fehler
 *   rule:     string                      Merksatz
 *   check:    { q, options:[{id,html}], answer, why }   eine Frage zum Ausprobieren
 * }
 */

const section = (cls, inner) => `<section class="card lsn ${cls}">${inner}</section>`;

/** Teil vor dem Ausprobieren: Ziel, 30 Sekunden, Vergleich, Bild. */
export function lessonTop(spec) {
  const tldr = spec.tldr.map((t) => `<li>${t}</li>`).join('');
  return `
    <section class="lsn-goal"><span class="lsn-flag">Ziel</span> ${esc(spec.goal)}</section>
    ${section('lsn-tldr', `<div class="lsn-who">${mascot('happy')}<div><h2>In 30 Sekunden</h2><ul>${tldr}</ul></div></div>`)}
    ${section('lsn-analogy', `<h2>${esc(spec.analogy.title)}</h2><div class="lsn-body">${spec.analogy.html}</div>`)}
    <figure class="card lsn lsn-fig">${spec.figure.svg}<figcaption>${spec.figure.caption}</figcaption></figure>`;
}

/** Teil nach dem Ausprobieren: Beispiel, Falle, Merksatz, Mini-Check. */
export function lessonBottom(spec) {
  const items = spec.steps.items.map((t, i) => `<li class="${i === 0 ? '' : 'later'}" ${i === 0 ? '' : 'hidden'}><span class="n">${i + 1}</span><div>${t}</div></li>`).join('');
  const opts = spec.check.options.map((o) => `<button type="button" class="opt" data-lsn="opt" data-id="${esc(o.id)}">${o.html}</button>`).join('');
  return `
    ${section('lsn-steps', `<h2>${esc(spec.steps.title)}</h2><ol class="lsn-list" data-lsn-steps>${items}</ol>${spec.steps.items.length > 1 ? '<button type="button" class="btn small ghost" data-lsn="next">Nächster Schritt</button>' : ''}`)}
    <div class="lsn-two">
      ${section('lsn-pit', `<h2>Typische Falle</h2><div class="lsn-body">${spec.pitfall.html}</div>`)}
      ${section('lsn-rule', `<h2>Merksatz</h2><p class="lsn-mark">${spec.rule}</p>`)}
    </div>
    ${section('lsn-check', `<h2>Mini-Check</h2><p class="lsn-q">${spec.check.q}</p><div class="opts lsn-opts" data-answer="${esc(spec.check.answer)}">${opts}</div><div class="lsn-fb" role="status" hidden></div>`)}`;
}

/** Macht Schritt-für-Schritt und Mini-Check klickbar. Einmal pro Theorie-Seite aufrufen. */
export function wireLesson(box, spec) {
  box.addEventListener('click', (e) => {
    const next = e.target.closest('[data-lsn="next"]');
    if (next) {
      const list = box.querySelector('[data-lsn-steps]');
      const hidden = list.querySelector('li[hidden]');
      if (hidden) hidden.hidden = false;
      if (!list.querySelector('li[hidden]')) next.hidden = true;
      return;
    }
    const opt = e.target.closest('[data-lsn="opt"]');
    if (!opt || opt.disabled) return;
    const group = opt.closest('[data-answer]');
    const right = opt.dataset.id === group.dataset.answer;
    group.querySelectorAll('.opt').forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === group.dataset.answer) b.classList.add('right');
    });
    if (!right) opt.classList.add('wrong');
    const fb = box.querySelector('.lsn-fb');
    fb.hidden = false;
    fb.className = `lsn-fb ${right ? 'ok' : 'bad'}`;
    fb.textContent = `${right ? 'Richtig! ' : 'Nicht ganz. '}${spec.check.why}`;
  });
}
