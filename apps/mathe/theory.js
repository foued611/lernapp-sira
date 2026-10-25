// Theorie-Seite einer Seite. Die Shell übergibt einen frischen Container.
import { esc } from '../../core/js/ui.js';
import { NOTES } from './data.js';
import { lessonTop, lessonBottom, wireLesson } from '../../core/js/lesson.js';
import { LESSONS } from './lessons.js';

export function renderTheory(box, unit) {
  const spec = LESSONS[unit.id];
  const notes = (NOTES[unit.id] || []).map((n) => `<div class="note"><b>${esc(n[0])}</b>${esc(n[1])}</div>`).join('');
  box.innerHTML = `
    <div style="display:grid;gap:22px">
      <section class="card tcard"><div class="thead"><h1>${esc(unit.title)}</h1><span class="de">${esc(unit.de)}</span></div></section>
      ${lessonTop(spec)}
      ${lessonBottom(spec)}
      <section><h2>Merkzettel</h2><div class="notes" style="margin-top:12px">${notes}</div></section>
      <div><button class="btn" data-act="start" data-id="${esc(unit.id)}">Übung starten</button></div>
    </div>`;
  wireLesson(box, spec);
}
