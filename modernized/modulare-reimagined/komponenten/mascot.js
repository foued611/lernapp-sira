// Minou, das Maskottchen. Stimmungen happy, cheer, sad, hmm (legacy/modulare/core/js/mascot.js:4-16).
// Geometrie und Gesichter stammen aus der Legacy-Version.
// Abweichung: aria-hidden statt role="img" und aria-label (mascot.js:19). Minou ist Dekoration,
// die Aussage steht im Text daneben.
import { createElement } from 'react';

const h = createElement;

// Die Farben gehören zur Figur. Sie sind keine Oberflächenfarben und kommen deshalb nicht aus den Tokens.
const INK = '#2A1A63';
const BODY = '#FFC933';
const BLUSH = '#FF8AD0';
const NOSE = '#E8365A';

const LINE = { fill: 'none', stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' };

// Teile als [Tag, Attribute]. Reihenfolge = Zeichenreihenfolge.
const EARS = [
  ['path', { d: 'M20 40L24 8l24 20z', fill: BODY, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }],
  ['path', { d: 'M80 40L76 8 52 28z', fill: BODY, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' }],
  ['path', { d: 'M27 32l2-14 11 9zM73 32l-2-14-11 9z', fill: BLUSH }]
];
const HEAD = ['ellipse', { cx: 50, cy: 57, rx: 38, ry: 33, fill: BODY, stroke: INK, strokeWidth: 3 }];
const NOSE_PART = ['ellipse', { cx: 50, cy: 60, rx: 3.5, ry: 2.5, fill: NOSE }];
const CHEEKS = [
  ['circle', { cx: 24, cy: 64, r: 5, fill: BLUSH, opacity: 0.7 }],
  ['circle', { cx: 76, cy: 64, r: 5, fill: BLUSH, opacity: 0.7 }]
];

const FACES = Object.freeze({
  happy: {
    eyes: [['path', { ...LINE, d: 'M31 52q6-9 12 0M57 52q6-9 12 0' }]],
    mouth: [['path', { ...LINE, d: 'M41 65q9 9 18 0' }]]
  },
  cheer: {
    eyes: [['path', { d: 'M30 46l10 6-10 6M70 46l-10 6 10 6', fill: 'none', stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' }]],
    mouth: [['path', { d: 'M39 62q11 17 22 0z', fill: INK }]]
  },
  sad: {
    eyes: [
      ['circle', { cx: 37, cy: 54, r: 4.5, fill: INK }],
      ['circle', { cx: 63, cy: 54, r: 4.5, fill: INK }],
      ['path', { d: 'M30 44l12 3M70 44l-12 3', stroke: INK, strokeWidth: 3, strokeLinecap: 'round' }]
    ],
    mouth: [['path', { ...LINE, d: 'M42 73q8-8 16 0' }]]
  },
  hmm: {
    eyes: [
      ['circle', { cx: 37, cy: 52, r: 4.5, fill: INK }],
      ['circle', { cx: 63, cy: 52, r: 4.5, fill: INK }]
    ],
    mouth: [['path', { ...LINE, d: 'M43 69q7 4 14 0' }]]
  }
});

/**
 * Stimmung auf ein bekanntes Gesicht abbilden. Unbekannt oder fehlend wird happy (RULE-217).
 * Object.hasOwn statt FACES[mood]: sonst träfe "constructor" eine Eigenschaft des Prototyps.
 */
export function faceFor(mood) {
  return Object.hasOwn(FACES, mood) ? mood : 'happy';
}

const parts = (list) => list.map(([tag, props], i) => h(tag, { key: i, ...props }));

export function Mascot({ mood = 'happy' }) {
  const face = FACES[faceFor(mood)];
  return h(
    'svg',
    { className: 'mas', viewBox: '0 0 100 100', 'aria-hidden': 'true' },
    ...parts([...EARS, HEAD, ...face.eyes, NOSE_PART, ...face.mouth, ...CHEEKS])
  );
}
