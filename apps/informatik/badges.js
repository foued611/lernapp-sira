// Trophäen der Zahlenwerkstatt. when(state, result) wird nach jeder Runde geprüft.
import { UNITS } from './data.js';

const has = (state, id) => (state.app.stars[id] || 0) > 0;

export const BADGES = [
  { id: 'first', n: 'Erstes Bit', d: 'Die erste Seite geschafft', when: (s) => UNITS.some((u) => has(s, u.id)) },
  { id: 'lamps', n: 'Lampenmeister', d: 'Binär lesen und Normal → Binär geschafft', when: (s) => has(s, 'binaer') && has(s, 'dez2bin') },
  { id: 'carry', n: 'Übertrag-Profi', d: 'Drei Sterne beim Binär-Addieren', when: (s) => s.app.stars.addieren === 3 },
  { id: 'hex', n: 'Hex-Held', d: 'Die Seite zu Hexadezimal geschafft', when: (s) => has(s, 'hex') },
  { id: 'perfect', n: 'Fehlerfrei', d: 'Eine Runde ohne Fehler', when: (s, r) => r.mode !== 'blitz' && !r.failed && r.wrong === 0 && r.almost === 0 },
  { id: 'combo5', n: 'Serie von 5', d: 'Fünf richtige in Folge', when: (s, r) => r.bestCombo >= 5 },
  { id: 'blitz10', n: 'Blitzrechner', d: '10 richtige im Blitz-Modus', when: (s, r) => r.mode === 'blitz' && r.score >= 10 },
  { id: 'boss', n: 'Bit-Boss besiegt', d: 'Den Endgegner geschafft', when: (s, r) => r.mode === 'boss' && !r.failed },
  { id: 'streak3', n: 'Dranbleiber', d: 'Drei Tage in Folge geübt', when: (s) => s.streak >= 3 }
];
