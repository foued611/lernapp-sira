// Konfetti. Legacy (legacy/modulare/core/js/confetti.js:4-14) nutzt Math.random und document.body.
// Hier: confettiPieces ist rein und reproduzierbar (Seed, mulberry32). Die Komponente liest kein window.
// Das Flag reduced kommt von der App (prefers-reduced-motion), das Modul fragt es nie selbst ab.
import { createElement } from 'react';

const h = createElement;

const COLORS = ['#FF6B88', '#FFC933', '#3DD6B0', '#4CC3F5', '#9B7BFF', '#FF8AD0']; // confetti.js:1

// Kleiner, deterministischer Zufallsgenerator. Liefert Zahlen von 0 bis 1 (kein Math.random).
function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Teile für einen Seed. Die Reihenfolge der Zufallsziehungen entspricht confetti.js:8, :10, :11,
 * damit die Verteilung der Legacy-Version gleich bleibt.
 */
export function confettiPieces(seed = 1, count = 46) {
  const rand = seededRandom(seed);
  return Array.from({ length: Math.max(0, Math.floor(count)) || 0 }, (_, i) => ({
    color: COLORS[i % COLORS.length],
    left: rand() * 100, // in vw
    duration: 2 + rand() * 2, // in s
    delay: rand() * 0.6 // in s
  }));
}

/**
 * Konfetti-Ebene. Nur ein ausdrücklich gesetztes false startet die Animation. Fehlt das Flag,
 * bleibt die Ebene leer. Das ist der sichere Standard, falls die App die Abfrage vergisst.
 */
export function Confetti({ seed = 1, count = 46, reduced }) {
  if (reduced !== false) return null;
  const pieces = confettiPieces(seed, count);
  return h(
    'div',
    { className: 'confetti', 'aria-hidden': 'true' },
    ...pieces.map((p, i) =>
      h('span', {
        key: i,
        className: 'cf',
        style: {
          left: `${p.left}vw`,
          background: p.color,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`
        }
      })
    )
  );
}
