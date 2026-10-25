// Seiten der Mathe-App (Klasse 7, Gymnasium BW). IDs sind Teil der gespeicherten Daten und werden nie umbenannt.
export const UNITS = [
  { id: 'vorzeichen', color: '#4CC3F5', ic: '±', title: 'Rechnen mit Vorzeichen', de: 'Rationale Zahlen: plus, minus, mal, geteilt',
    card: { name: 'Zahlenstrahl-Wanderer', fact: 'Minus mal Minus ergibt Plus. Zwei Verneinungen heben sich auf, so wie „nicht unmöglich“.' } },
  { id: 'terme', color: '#FF9F43', ic: 'x', title: 'Terme vereinfachen', de: 'Zusammenfassen, ausmultiplizieren, Klammern',
    card: { name: 'Klammer-Knacker', fact: 'Das Distributivgesetz a·(b + c) = a·b + a·c ist der wichtigste Trick der Algebra.' } },
  { id: 'gleichungen', color: '#3DD6B0', ic: '=', title: 'Gleichungen lösen', de: 'Äquivalenzumformung Schritt für Schritt',
    card: { name: 'Waagen-Meister', fact: 'Das Gleichheitszeichen wurde 1557 erfunden, weil zwei parallele Striche „nichts sind gleicher“.' } },
  { id: 'prozent', color: '#9B7BFF', ic: '%', title: 'Prozentrechnung', de: 'Grundwert, Prozentwert, Prozentsatz',
    card: { name: 'Rabatt-Detektiv', fact: '„Prozent“ kommt von „pro centum“, lateinisch für „pro Hundert“.' } }
];

export const NOTES = {
  vorzeichen: [
    ['Gleiche Vorzeichen', 'Betragsmäßig addieren, das Vorzeichen bleibt: (−3) + (−4) = −7.'],
    ['Verschiedene Vorzeichen', 'Die kleinere Zahl von der größeren abziehen, die größere bestimmt das Vorzeichen.'],
    ['Minus minus', 'Subtrahieren heißt, die Gegenzahl addieren: 5 − (−3) = 5 + 3.'],
    ['Mal und geteilt', 'Gleiche Vorzeichen ergeben Plus, verschiedene ergeben Minus.']
  ],
  terme: [
    ['Zusammenfassen', 'Nur gleichartige Summanden: 3x + 5x = 8x, aber 3x + 5 bleibt stehen.'],
    ['Distributivgesetz', 'Jeden Summanden in der Klammer mit dem Faktor davor multiplizieren.'],
    ['Minusklammer', 'Steht ein Minus vor der Klammer, drehen sich alle Vorzeichen darin um.']
  ],
  gleichungen: [
    ['Waage', 'Was du links machst, machst du rechts. Dann bleibt die Waage im Gleichgewicht.'],
    ['Reihenfolge', 'Erst Addition oder Subtraktion rückgängig machen, dann Multiplikation oder Division.'],
    ['Probe', 'Setze die Lösung in die ursprüngliche Gleichung ein. Links und rechts müssen gleich sein.']
  ],
  prozent: [
    ['Formel', 'Prozentwert = Grundwert · Prozentsatz. Alle drei lassen sich umstellen.'],
    ['Dreisatz', '100 % entsprechen dem Grundwert. Erst auf 1 % rechnen, dann auf den gesuchten Satz.'],
    ['Vermehrt, vermindert', 'Preis − 20 % bedeutet: du zahlst 80 % des alten Preises.']
  ]
};
