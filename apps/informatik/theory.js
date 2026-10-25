// Theorie-Seiten mit kleinen Spielzeugen zum Ausprobieren (Lampen, Eingabefelder, Schieberegler).
// Jedes Spielzeug ist eine eigene Funktion, die sich an einen Container hängt und keinen Zustand außerhalb hält.
import { esc, $ } from '../../core/js/ui.js';
import { TIPS } from './data.js';
import { lessonTop, lessonBottom, wireLesson } from '../../core/js/lesson.js';
import { LESSONS } from './lessons.js';
import { WEIGHTS, HEX, toBin, toHex, placeDigits, placeSum, decToBinHTML } from './numbers.js';

const clampInt = (value, max) => Math.max(0, Math.min(max, parseInt(value, 10) || 0));

function lampBoard(bits, { groups = false } = {}) {
  const lamps = WEIGHTS.map((w, i) => `<button type="button" class="bit${bits[i] ? ' on' : ''}${groups && i === 4 ? ' gap' : ''}" data-i="${i}" aria-pressed="${bits[i] ? 'true' : 'false'}" aria-label="Stellenwert ${w}"><span class="w">${w}</span><span class="bulb">${bits[i]}</span></button>`).join('');
  return `<div class="bits">${lamps}</div>`;
}

/** Lampen-Tafel, die auf Klicks reagiert. onChange bekommt die Bits und füllt den Ergebnisbereich. */
function mountLamps(root, initial, onChange, options) {
  let bits = initial.slice();
  const board = root.querySelector('[data-board]');
  const paint = () => {
    board.innerHTML = lampBoard(bits, options);
    onChange(bits);
  };
  board.addEventListener('click', (e) => {
    const lamp = e.target.closest('.bit');
    if (!lamp) return;
    const i = Number(lamp.dataset.i);
    bits[i] = bits[i] ? 0 : 1;
    paint();
    board.querySelector(`.bit[data-i="${i}"]`).focus();
  });
  root.querySelectorAll('[data-set]').forEach((btn) => btn.addEventListener('click', () => {
    bits = btn.dataset.set === 'all' ? Array(8).fill(1) : Array(8).fill(0);
    paint();
  }));
  paint();
}

const toy = (label, inner) => `<section class="card toy"><span class="toy-label">${esc(label)}</span>${inner}</section>`;

const TOYS = {
  stellen(box) {
    box.innerHTML = toy('Ausprobieren', `
      <div class="row"><label for="decIn">Zahl (0 bis 9999)</label><input class="numin" id="decIn" type="number" inputmode="numeric" min="0" max="9999" value="352"></div>
      <div class="tablewrap"><table class="place"><tbody>
        <tr class="head"><td>Tausender</td><td>Hunderter</td><td>Zehner</td><td>Einer</td></tr>
        <tr class="head"><td>1000</td><td>100</td><td>10</td><td>1</td></tr>
        <tr class="digit" data-digits></tr>
      </tbody></table></div>
      <div class="sumline" data-sum aria-live="polite"></div>`);
    const input = $('#decIn', box);
    const update = () => {
      const n = clampInt(input.value, 9999);
      box.querySelector('[data-digits]').innerHTML = placeDigits(n).map((d) => `<td>${d}</td>`).join('');
      box.querySelector('[data-sum]').innerHTML = `${esc(placeSum(n))} = <b>${n}</b>`;
    };
    input.addEventListener('input', update);
    update();
  },

  binaer(box) {
    box.innerHTML = toy('Lampen-Tafel: tippe auf die Lampen', `
      <div data-board></div>
      <div class="sumline" data-sum aria-live="polite"></div>
      <div class="row"><button type="button" class="btn small ghost" data-set="none">Alle aus</button><button type="button" class="btn small ghost" data-set="all">Alle an</button></div>`);
    mountLamps(box, [0, 0, 0, 0, 1, 0, 1, 1], (bits) => {
      const on = WEIGHTS.filter((w, i) => bits[i]);
      box.querySelector('[data-sum]').innerHTML = `${bits.join('')} → ${on.length ? on.join(' + ') : '0'} = <b>${on.reduce((a, b) => a + b, 0)}</b>`;
    });
  },

  dez2bin(box) {
    box.innerHTML = toy('Schritt für Schritt', `
      <div class="row"><label for="d2b">Zahl (0 bis 255)</label><input class="numin" id="d2b" type="number" inputmode="numeric" min="0" max="255" value="13"></div>
      <div class="steps" data-steps aria-live="polite"></div>`);
    const input = $('#d2b', box);
    const update = () => { box.querySelector('[data-steps]').innerHTML = decToBinHTML(clampInt(input.value, 255)); };
    input.addEventListener('input', update);
    update();
  },

  addieren(box) {
    box.innerHTML = toy('Rechne selbst nach', `
      <div class="row"><label for="ad1">Erste Zahl</label><input class="numin" id="ad1" type="number" inputmode="numeric" min="0" max="127" value="11">
      <label for="ad2">Zweite Zahl</label><input class="numin" id="ad2" type="number" inputmode="numeric" min="0" max="127" value="6"></div>
      <div class="sumline mono" data-calc aria-live="polite"></div>`);
    const a = $('#ad1', box), b = $('#ad2', box);
    const update = () => {
      const x = clampInt(a.value, 127), y = clampInt(b.value, 127), width = toBin(x + y).length;
      box.querySelector('[data-calc]').innerHTML = `<div class="adder"><span>${toBin(x).padStart(width, ' ')}</span><span>+ ${toBin(y).padStart(width, ' ')}</span><span class="line">= ${toBin(x + y)}</span></div><div class="muted">normal: ${x} + ${y} = <b>${x + y}</b></div>`;
    };
    a.addEventListener('input', update);
    b.addEventListener('input', update);
    update();
  },

  hex(box) {
    const grid = HEX.split('').map((c, i) => `<div><div class="d">${c}</div><div class="v">${i}</div></div>`).join('');
    box.innerHTML = toy('Eine Zahl, drei Schreibweisen', `
      <div class="hexgrid" aria-label="Hex-Ziffern von 0 bis F">${grid}</div>
      <input type="range" id="slide" min="0" max="255" value="200" aria-label="Zahl wählen">
      <div class="trio">
        <div><div class="k">Normal</div><div class="val mono" data-dec></div></div>
        <div><div class="k">Binär</div><div class="val mono" data-bin></div></div>
        <div><div class="k">Hex</div><div class="val mono" data-hex></div></div>
      </div>
      <div class="steps" data-steps aria-live="polite"></div>`);
    const slide = $('#slide', box);
    const update = () => {
      const n = Number(slide.value), q = Math.floor(n / 16), r = n % 16;
      box.querySelector('[data-dec]').textContent = n;
      box.querySelector('[data-bin]').textContent = toBin(n);
      box.querySelector('[data-hex]').textContent = toHex(n);
      box.querySelector('[data-steps]').innerHTML = `<div>${n} : 16 = ${q} Rest ${r}</div><div class="no">${q} → ${HEX[q]}, ${r} → ${HEX[r]}</div><div><b>${n} = ${toHex(n)}</b></div>`;
    };
    slide.addEventListener('input', update);
    update();
  },

  binhex(box) {
    box.innerHTML = toy('Lampen-Tafel mit Vierergruppen', `
      <div data-board></div>
      <div class="nibbles" data-nibbles aria-live="polite"></div>`);
    mountLamps(box, [1, 1, 0, 1, 0, 1, 1, 0], (bits) => {
      box.querySelector('[data-nibbles]').innerHTML = [bits.slice(0, 4), bits.slice(4)].map((g) => {
        const v = parseInt(g.join(''), 2);
        return `<div class="nib"><div class="grp">${g.join('')}</div><div class="muted">= ${v}</div><div class="h">${HEX[v]}</div></div>`;
      }).join('');
    }, { groups: true });
  }
};

/** Wird von der Shell mit einem frischen Container aufgerufen. */
export function renderTheory(box, unit) {
  const spec = LESSONS[unit.id];
  const notes = (TIPS[unit.id] || []).map((t) => `<div class="note"><b>${esc(t[0])}</b>${esc(t[1])}</div>`).join('');
  box.innerHTML = `
    <div style="display:grid;gap:22px">
      <section class="card tcard"><div class="thead"><h1>${esc(unit.title)}</h1><span class="de">${esc(unit.de)}</span></div></section>
      ${lessonTop(spec)}
      <div data-toy></div>
      ${lessonBottom(spec)}
      <section><h2>Merkzettel</h2><div class="notes" style="margin-top:12px">${notes}</div></section>
      <div><button class="btn" data-act="start" data-id="${esc(unit.id)}">Übung starten · 8 Aufgaben</button></div>
    </div>`;
  const slot = box.querySelector('[data-toy]');
  if (TOYS[unit.id]) TOYS[unit.id](slot);
  wireLesson(box, spec);
}
