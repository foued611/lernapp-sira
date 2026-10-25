// Trophäen: when(state, result) wird nach jeder Runde geprüft. state = { profile, app, streak }.
export const BADGES = [
  { id: 'first', n: 'Erster Schritt', d: 'Die erste Seite geschafft', when: (s) => Object.values(s.app.stars).some((n) => n > 0) },
  { id: 'perfect', n: 'Fehlerfrei', d: 'Eine Runde ohne Fehler', when: (s, r) => r.mode !== 'blitz' && !r.failed && r.wrong === 0 && r.almost === 0 }
];
