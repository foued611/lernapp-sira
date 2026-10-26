// Spielzeuge der Theorieseiten (Herkunft: legacy/modulare/apps/informatik/theory.js). Jedes Spielzeug ist eine
// React-Komponente mit eigenem Zustand, ohne innerHTML. Ergebnisse stehen als Text da, nicht nur als Farbe (KOMP-A11Y).
// Die Ansichten rechnen über reine Funktionen (lampSum, hexView, adderView, decToBinRows), damit Tests sie prüfen können.
import { createElement, useId, useState } from 'react';
import { WEIGHTS, HEX, toBin, toHex, placeDigits, placeSum, decToBinSteps } from './numbers.js';
import { Button } from '../../komponenten/ui.js';

const h = createElement;

const BINAER_START = [0, 0, 0, 0, 1, 0, 1, 1];
const BINHEX_START = [1, 1, 0, 1, 0, 1, 1, 0];

/** Eingabe als ganze Zahl im Bereich. Leer oder ungültig zählt als 0, wie in Legacy. */
export const clampInt = (value, max) => Math.max(0, Math.min(max, parseInt(value, 10) || 0));

/** Summe einer Lampenreihe: die Stellenwerte, über denen eine 1 steht, und ihr Wert. */
export function lampSum(bits) {
  const on = WEIGHTS.filter((_, i) => bits[i]);
  return {
    bitsText: bits.join(''),
    parts: on.length ? on.join(' + ') : '0',
    value: on.reduce((a, b) => a + b, 0)
  };
}

/** Ansicht einer Zahl in drei Schreibweisen plus die Schritte bis zur Hex-Ziffer (Legacy: Schieberegler). */
export function hexView(n) {
  const q = Math.floor(n / 16);
  const r = n % 16;
  return { dec: String(n), bin: toBin(n), hex: toHex(n), q, r };
}

/** Schriftliche Addition: beide Zahlen gleich breit, Summe in Binär und normal. */
export function adderView(x, y) {
  const width = toBin(x + y).length;
  return { a: toBin(x).padStart(width, ' '), b: toBin(y).padStart(width, ' '), sum: toBin(x + y), dec: x + y };
}

/** Schritte der Umrechnung Normal nach Binär als React-Zeilen. Die Zeilen entsprechen decToBinHTML (Legacy). */
export function decToBinRows(n) {
  const rows = decToBinSteps(n).map((s) => (s.fits
    ? h('div', { key: s.w }, h('span', { className: 'zw-yes' }, `Passt ${s.w} in ${s.rest}? Ja → 1`), h('span', { className: 'zw-no' }, `Rest ${s.rest - s.w}`))
    : h('div', { key: s.w }, h('span', { className: 'zw-no' }, `Passt ${s.w} in ${s.rest}? Nein → 0`))));
  rows.push(h('div', { key: 'ende' }, h('b', null, `${n} = ${toBin(n)}`)));
  return rows;
}

/** Eine Vierergruppe: Bits, Wert und Hex-Ziffer. */
export function nibbleView(group) {
  const v = parseInt(group.join(''), 2);
  return { bits: group.join(''), value: v, hex: HEX[v] };
}

/** Zustand der Lampen: Umschalten einer Lampe, ohne den Rest zu verändern. */
const toggled = (bits, i) => bits.map((b, j) => (j === i ? (b ? 0 : 1) : b));

function useBits(initial) {
  const [bits, setBits] = useState(initial);
  return [bits, setBits, (i) => setBits((prev) => toggled(prev, i))];
}

/** Rahmen eines Spielzeugs. Die Akzentfarbe der Seite (unit.color) kommt als --lc. */
function Toy({ label, accent, children }) {
  const kids = Array.isArray(children) ? children : [children];
  return h(
    'section',
    { className: 'card zw-toy', style: accent ? { '--lc': accent } : undefined },
    h('span', { className: 'zw-toy-label' }, label),
    ...kids
  );
}

/** Eingabefeld für eine Zahl in einem Bereich. Der Name steht als Beschriftung davor. */
function NumberField({ label, min, max, value, onChange }) {
  const id = useId();
  return h(
    'div',
    { className: 'zw-row' },
    h('label', { htmlFor: id }, label),
    h('input', {
      id, className: 'zw-num', type: 'number', inputMode: 'numeric', min, max, value,
      onChange: (e) => onChange(e.target.value)
    })
  );
}

/** Lampenreihe. Jede Lampe ist ein Schalter mit aria-pressed, der Stellenwert steht im Namen. */
function Lamps({ bits, onToggle, groups = false }) {
  return h(
    'div',
    { className: 'zw-bits', role: 'group', 'aria-label': 'Lampen' },
    ...WEIGHTS.map((w, i) => h(
      'button',
      {
        key: w,
        type: 'button',
        className: ['zw-bit', bits[i] ? 'on' : '', groups && i === 4 ? 'gap' : ''].filter(Boolean).join(' '),
        'aria-pressed': Boolean(bits[i]),
        'aria-label': `Stellenwert ${w}`,
        onClick: () => onToggle(i)
      },
      h('span', { className: 'zw-w' }, String(w)),
      h('span', { className: 'zw-bulb', 'aria-hidden': 'true' }, String(bits[i] ? 1 : 0))
    ))
  );
}

/** Stellenwert-Tafel: tippe eine Zahl ein, die Ziffern erscheinen an ihren Stellen. */
export function StellenToy({ accent }) {
  const [raw, setRaw] = useState('352');
  const n = clampInt(raw, 9999);
  return h(
    Toy,
    { label: 'Ausprobieren', accent },
    h(NumberField, { label: 'Zahl (0 bis 9999)', min: 0, max: 9999, value: raw, onChange: setRaw }),
    h(
      'div',
      { className: 'zw-tablewrap' },
      h(
        'table',
        { className: 'zw-place' },
        h(
          'tbody',
          null,
          h('tr', { className: 'head' }, ...['Tausender', 'Hunderter', 'Zehner', 'Einer'].map((t) => h('td', { key: t }, t))),
          h('tr', { className: 'head' }, ...['1000', '100', '10', '1'].map((t) => h('td', { key: t }, t))),
          h('tr', { className: 'digit' }, ...placeDigits(n).map((d, i) => h('td', { key: i }, d)))
        )
      )
    ),
    h('div', { className: 'zw-sum', 'aria-live': 'polite' }, `${placeSum(n)} = `, h('b', null, String(n)))
  );
}

/** Lampen-Tafel zum Binärlesen. Anfangsstand 00001011 (also 11). */
export function BinaerToy({ accent }) {
  const [bits, setBits, toggle] = useBits(BINAER_START);
  const s = lampSum(bits);
  return h(
    Toy,
    { label: 'Lampen-Tafel: tippe auf die Lampen', accent },
    h(Lamps, { bits, onToggle: toggle }),
    h('div', { className: 'zw-sum', 'aria-live': 'polite' }, `${s.bitsText} → ${s.parts} = `, h('b', null, String(s.value))),
    h(
      'div',
      { className: 'zw-row' },
      h(Button, { variant: 'ghost', small: true, onClick: () => setBits(Array(8).fill(0)) }, 'Alle aus'),
      h(Button, { variant: 'ghost', small: true, onClick: () => setBits(Array(8).fill(1)) }, 'Alle an')
    )
  );
}

/** Schritt für Schritt von Normal nach Binär. */
export function DezBinToy({ accent }) {
  const [raw, setRaw] = useState('13');
  const n = clampInt(raw, 255);
  return h(
    Toy,
    { label: 'Schritt für Schritt', accent },
    h(NumberField, { label: 'Zahl (0 bis 255)', min: 0, max: 255, value: raw, onChange: setRaw }),
    h('div', { className: 'zw-steps', 'aria-live': 'polite' }, ...decToBinRows(n))
  );
}

/** Schriftliche Addition, die sich beim Tippen nachrechnet. */
export function AddToy({ accent }) {
  const [ra, setRa] = useState('11');
  const [rb, setRb] = useState('6');
  const x = clampInt(ra, 127);
  const y = clampInt(rb, 127);
  const v = adderView(x, y);
  return h(
    Toy,
    { label: 'Rechne selbst nach', accent },
    h(NumberField, { label: 'Erste Zahl', min: 0, max: 127, value: ra, onChange: setRa }),
    h(NumberField, { label: 'Zweite Zahl', min: 0, max: 127, value: rb, onChange: setRb }),
    h(
      'div',
      { className: 'zw-sum zw-mono', 'aria-live': 'polite' },
      h(
        'div',
        { className: 'zw-adder' },
        h('span', null, v.a),
        h('span', null, `+ ${v.b}`),
        h('span', { className: 'zw-line' }, `= ${v.sum}`)
      ),
      h('div', { className: 'zw-muted' }, `normal: ${x} + ${y} = `, h('b', null, String(v.dec)))
    )
  );
}

/** Hex-Ziffern als Raster und ein Schieberegler, der drei Schreibweisen zeigt. */
export function HexToy({ accent }) {
  const id = useId();
  const [n, setN] = useState(200);
  const v = hexView(n);
  const trio = (label, value) => h(
    'div',
    null,
    h('div', { className: 'zw-k' }, label),
    h('div', { className: 'zw-val zw-mono' }, value)
  );
  return h(
    Toy,
    { label: 'Eine Zahl, drei Schreibweisen', accent },
    h(
      'div',
      { className: 'zw-hexgrid', role: 'group', 'aria-label': 'Hex-Ziffern von 0 bis F' },
      ...HEX.split('').map((c, i) => h('div', { key: c }, h('div', { className: 'zw-d' }, c), h('div', { className: 'zw-v' }, String(i))))
    ),
    h('label', { htmlFor: id, className: 'zw-sr' }, 'Zahl wählen'),
    h('input', {
      id, className: 'zw-slide', type: 'range', min: 0, max: 255, value: n,
      onChange: (e) => setN(Number(e.target.value))
    }),
    h('div', { className: 'zw-trio' }, trio('Normal', v.dec), trio('Binär', v.bin), trio('Hex', v.hex)),
    h(
      'div',
      { className: 'zw-steps', 'aria-live': 'polite' },
      h('div', null, `${n} : 16 = ${v.q} Rest ${v.r}`),
      h('div', { className: 'zw-no' }, `${v.q} → ${HEX[v.q]}, ${v.r} → ${HEX[v.r]}`),
      h('div', null, h('b', null, `${n} = ${v.hex}`))
    )
  );
}

/** Lampen-Tafel mit zwei Vierergruppen. Jede Gruppe zeigt Wert und Hex-Ziffer. */
export function BinHexToy({ accent }) {
  const [bits, , toggle] = useBits(BINHEX_START);
  const groups = [bits.slice(0, 4), bits.slice(4)].map(nibbleView);
  return h(
    Toy,
    { label: 'Lampen-Tafel mit Vierergruppen', accent },
    h(Lamps, { bits, onToggle: toggle, groups: true }),
    h(
      'div',
      { className: 'zw-nibbles', 'aria-live': 'polite' },
      ...groups.map((g, i) => h(
        'div',
        { key: i, className: 'zw-nib' },
        h('div', { className: 'zw-grp' }, g.bits),
        h('div', { className: 'zw-muted' }, `= ${g.value}`),
        h('div', { className: 'zw-h' }, g.hex)
      ))
    )
  );
}

/** Spielzeug je Seite. Seiten ohne Spielzeug gibt es nicht. */
export const TOYS = Object.freeze({
  stellen: StellenToy,
  binaer: BinaerToy,
  dez2bin: DezBinToy,
  addieren: AddToy,
  hex: HexToy,
  binhex: BinHexToy
});
