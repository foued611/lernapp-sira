// Lernstoff der Vorlage. Ersetze den Inhalt durch den echten Stoff und behalte die Struktur bei.
// Jede Seite (unit) hat eine Liste von Aufgaben: Frage, richtige Antwort, falsche Antworten, Erklärung.

export const UNITS = [
  { id: 'start', color: '#4CC3F5', ic: '1', title: 'Erste Seite', de: 'Beschreibung der Seite' },
  { id: 'weiter', color: '#FF9F43', ic: '2', title: 'Zweite Seite', de: 'Beschreibung der Seite' }
];

export const ITEMS = {
  start: [
    { q: 'Wie viel ist 2 + 2?', a: '4', wrong: ['3', '5', '22'], explain: '2 + 2 ergibt 4.' },
    { q: 'Wie viel ist 3 + 4?', a: '7', wrong: ['6', '8', '34'], explain: '3 + 4 ergibt 7.' },
    { q: 'Wie viel ist 5 + 5?', a: '10', wrong: ['9', '11', '55'], explain: '5 + 5 ergibt 10.' }
  ],
  weiter: [
    { q: 'Wie viel ist 2 · 3?', a: '6', wrong: ['5', '8', '23'], explain: '2 · 3 ergibt 6.' },
    { q: 'Wie viel ist 4 · 4?', a: '16', wrong: ['8', '12', '44'], explain: '4 · 4 ergibt 16.' },
    { q: 'Wie viel ist 3 · 5?', a: '15', wrong: ['8', '12', '35'], explain: '3 · 5 ergibt 15.' }
  ]
};

export const NOTES = {
  start: [['Merke', 'Beim Addieren zählst du die Zahlen zusammen.']],
  weiter: [['Merke', 'Beim Multiplizieren addierst du eine Zahl mehrfach.']]
};
