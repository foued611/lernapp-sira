// Trophäen der Mathe-App. when(state, result) wird nach jeder Runde geprüft.
import { UNITS } from './data.js';

const has = (state, id) => (state.app.stars[id] || 0) > 0;

export const BADGES = [
  { id: 'first', n: 'Erster Schritt', d: 'Die erste Seite geschafft', when: (s) => UNITS.some((u) => has(s, u.id)) },
  { id: 'signs', n: 'Vorzeichen-Profi', d: 'Drei Sterne beim Rechnen mit Vorzeichen', when: (s) => s.app.stars.vorzeichen === 3 },
  { id: 'brackets', n: 'Klammer-Knacker', d: 'Terme vereinfachen geschafft', when: (s) => has(s, 'terme') },
  { id: 'scale', n: 'Waagen-Meister', d: 'Gleichungen lösen geschafft', when: (s) => has(s, 'gleichungen') },
  { id: 'percent', n: 'Rabatt-Detektiv', d: 'Prozentrechnung geschafft', when: (s) => has(s, 'prozent') },
  { id: 'interest', n: 'Zins-Zauberer', d: 'Zinsrechnung geschafft', when: (s) => has(s, 'zinsen') },
  { id: 'three', n: 'Dreisatz-Detektiv', d: 'Zuordnungen und Dreisatz geschafft', when: (s) => has(s, 'zuordnungen') },
  { id: 'perfect', n: 'Fehlerfrei', d: 'Eine Runde ohne Fehler', when: (s, r) => r.mode !== 'blitz' && !r.failed && r.wrong === 0 && r.almost === 0 },
  { id: 'combo5', n: 'Serie von 5', d: 'Fünf richtige in Folge', when: (s, r) => r.bestCombo >= 5 },
  { id: 'blitz10', n: 'Blitzrechner', d: '10 richtige im Blitz-Modus', when: (s, r) => r.mode === 'blitz' && r.score >= 10 },
  { id: 'boss', n: 'Mathe-Boss besiegt', d: 'Den Endgegner geschafft', when: (s, r) => r.mode === 'boss' && !r.failed },
  { id: 'streak3', n: 'Dranbleiber', d: 'Drei Tage in Folge geübt', when: (s) => s.streak >= 3 }
];
