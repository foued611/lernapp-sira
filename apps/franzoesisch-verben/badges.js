// Trophäen der App. when(state, result) wird nach jeder Runde geprüft.
// state = { profile, app, streak }, result = Ergebnis der Runde (siehe core/js/rounds.js).
import { UNITS } from './data.js';

const has = (state, id) => (state.app.stars[id] || 0) > 0;

export const BADGES = [
    { id: 'first', n: 'Premier Pas', d: 'Die erste Seite geschafft', when: (s) => UNITS.some((u) => has(s, u.id)) },
    { id: 'etre3', n: 'Être ou ne pas être', d: 'Drei Sterne bei être', when: (s) => s.app.stars.etre === 3 },
    { id: 'perfect', n: 'Sans Faute', d: 'Eine Runde ohne Fehler', when: (s, r) => r.mode !== 'blitz' && !r.failed && r.wrong === 0 && r.almost === 0 },
    { id: 'combo5', n: 'Série de 5', d: 'Fünf richtige in Folge', when: (s, r) => r.bestCombo >= 5 },
    { id: 'four', n: 'Les Quatre', d: 'être, avoir, aller, faire geschafft', when: (s) => ['etre', 'avoir', 'aller', 'faire'].every((id) => has(s, id)) },
    { id: 'regs', n: 'Endungs-Ass', d: 'Beide Seiten zu den regelmäßigen Verben', when: (s) => has(s, 'er') && has(s, 'irre') },
    { id: 'blitz10', n: 'Éclair', d: '10 richtige im Blitz-Modus', when: (s, r) => r.mode === 'blitz' && r.score >= 10 },
    { id: 'boss', n: 'Le Grand Défi', d: 'Den Endgegner besiegt', when: (s, r) => r.mode === 'boss' && !r.failed },
    { id: 'streak3', n: 'Dranbleiber', d: 'Drei Tage in Folge geübt', when: (s) => s.streak >= 3 }
];
