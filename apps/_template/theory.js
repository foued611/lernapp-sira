// Theorie-Seite einer Seite. Die Shell übergibt einen frischen Container.
import { esc } from '../../core/js/ui.js';
import { NOTES } from './data.js';

export function renderTheory(box, unit) {
  const notes = (NOTES[unit.id] || []).map((n) => `<div class="note"><b>${esc(n[0])}</b>${esc(n[1])}</div>`).join('');
  box.innerHTML = `
    <div style="display:grid;gap:26px">
      <section class="card"><h1>${esc(unit.title)}</h1><p class="muted">${esc(unit.de)}</p></section>
      <section><div class="notes">${notes}</div></section>
      <div><button class="btn" data-act="start" data-id="${esc(unit.id)}">Übung starten</button></div>
    </div>`;
}
