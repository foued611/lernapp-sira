// Standard-Theorieseite: Kopf, Lektion, Merkzettel und Übungsknopf. Apps ohne Besonderheiten brauchen keine eigene Theorie.
import { esc } from './ui.js';
import { lessonTop, lessonBottom, wireLesson } from './lesson.js';

/** @param {{lessons:object, notes:object}} content */
export function renderDefaultTheory(box, unit, { lessons, notes }) {
  const spec = lessons[unit.id];
  const items = (notes[unit.id] || []).map((n) => `<div class="note"><b>${esc(n[0])}</b>${esc(n[1])}</div>`).join('');
  box.innerHTML = `
    <div style="display:grid;gap:22px">
      <section class="card tcard"><div class="thead"><h1>${esc(unit.title)}</h1><span class="de">${esc(unit.de)}</span></div></section>
      ${lessonTop(spec)}
      ${lessonBottom(spec)}
      ${items ? `<section><h2>Merkzettel</h2><div class="notes" style="margin-top:12px">${items}</div></section>` : ''}
      <div><button class="btn" data-act="start" data-id="${esc(unit.id)}">Übung starten</button></div>
    </div>`;
  wireLesson(box, spec);
}
