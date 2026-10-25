// Minou, das Maskottchen. Stimmungen: happy, cheer, sad, hmm.
const INK = '#2A1A63';

const EYES = {
  happy: `<path d="M31 52q6-9 12 0M57 52q6-9 12 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`,
  cheer: `<path d="M30 46l10 6-10 6M70 46l-10 6 10 6" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  sad: `<circle cx="37" cy="54" r="4.5" fill="${INK}"/><circle cx="63" cy="54" r="4.5" fill="${INK}"/><path d="M30 44l12 3M70 44l-12 3" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  hmm: `<circle cx="37" cy="52" r="4.5" fill="${INK}"/><circle cx="63" cy="52" r="4.5" fill="${INK}"/>`
};

const MOUTH = {
  happy: `<path d="M41 65q9 9 18 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`,
  cheer: `<path d="M39 62q11 17 22 0z" fill="${INK}"/>`,
  sad: `<path d="M42 73q8-8 16 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`,
  hmm: `<path d="M43 69q7 4 14 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
};

export function mascot(mood = 'happy') {
  return `<svg class="mas" viewBox="0 0 100 100" role="img" aria-label="Minou, das Maskottchen"><path d="M20 40L24 8l24 20z" fill="#FFC933" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M80 40L76 8 52 28z" fill="#FFC933" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M27 32l2-14 11 9zM73 32l-2-14-11 9z" fill="#FF8AD0"/><ellipse cx="50" cy="57" rx="38" ry="33" fill="#FFC933" stroke="${INK}" stroke-width="3"/>${EYES[mood] || EYES.happy}<ellipse cx="50" cy="60" rx="3.5" ry="2.5" fill="#E8365A"/>${MOUTH[mood] || MOUTH.happy}<circle cx="24" cy="64" r="5" fill="#FF8AD0" opacity=".7"/><circle cx="76" cy="64" r="5" fill="#FF8AD0" opacity=".7"/></svg>`;
}
