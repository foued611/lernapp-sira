// Trophäen der Geometrie-Werkstatt. when(state, result) wird nach jeder Runde geprüft.
import { UNITS } from './data.js';

const has = (state, id) => (state.app.stars[id] || 0) > 0;

export const BADGES = [
  { id: 'first', n: 'Erster Strich', d: 'Die erste Seite geschafft', when: (s) => UNITS.some((u) => has(s, u.id)) },
  { id: 'compass', n: 'Zirkel-Zauberer', d: 'Mittelsenkrechte und Winkelhalbierende geschafft', when: (s) => has(s, 'mittelsenkrechte') && has(s, 'winkelhalbierende') },
  { id: 'builder', n: 'Dreiecks-Baumeister', d: 'Dreiecke konstruieren geschafft', when: (s) => has(s, 'dreiecke') },
  { id: 'angles', n: 'Winkel-Detektiv', d: 'Drei Sterne bei Winkel und Beweise', when: (s) => s.app.stars.winkel === 3 },
  { id: 'thales', n: 'Thales-Tüftler', d: 'Satz des Thales geschafft', when: (s) => has(s, 'thales') },
  { id: 'circles', n: 'Kreis-Künstler', d: 'Umkreis und Inkreis geschafft', when: (s) => has(s, 'kreise') },
  { id: 'perfect', n: 'Fehlerfrei', d: 'Eine Runde ohne Fehler', when: (s, r) => r.mode !== 'blitz' && !r.failed && r.wrong === 0 && r.almost === 0 },
  { id: 'combo5', n: 'Serie von 5', d: 'Fünf richtige in Folge', when: (s, r) => r.bestCombo >= 5 },
  { id: 'blitz10', n: 'Blitz-Geometer', d: '10 richtige im Blitz-Modus', when: (s, r) => r.mode === 'blitz' && r.score >= 10 },
  { id: 'boss', n: 'Geometrie-Boss besiegt', d: 'Den Endgegner geschafft', when: (s, r) => r.mode === 'boss' && !r.failed },
  { id: 'streak3', n: 'Dranbleiber', d: 'Drei Tage in Folge geübt', when: (s) => s.streak >= 3 }
];
