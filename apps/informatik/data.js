// Lernstoff "Zahlenwerkstatt": Seiten des Lernpfads und Merkzettel. Fragen entstehen in builders.js.
export const UNITS = [
  { id: 'stellen', color: '#4CC3F5', ic: '10', title: 'Stellenwerte', de: 'Wie unser Zehnersystem funktioniert', card: { name: 'Die Zehn-Regel', fact: 'Wir rechnen vermutlich im Zehnersystem, weil wir zehn Finger haben.' } },
  { id: 'binaer', color: '#FFC933', ic: '01', title: 'Binär lesen', de: 'Bits, Lampen und Verdopplung', card: { name: 'Das Bit', fact: 'Bit kommt von binary digit, also Binärziffer. Acht Bits sind ein Byte.' } },
  { id: 'dez2bin', color: '#FF8AD0', ic: '→2', title: 'Normal → Binär', de: 'Passt der Stellenwert noch hinein?', card: { name: 'Der Wiegesatz', fact: 'Mit den acht Gewichten 128 bis 1 Gramm kannst du jedes ganze Gewicht von 0 bis 255 Gramm abwiegen.' } },
  { id: 'addieren', color: '#3DD6B0', ic: '1+1', title: 'Binär addieren', de: 'Schriftlich rechnen mit Übertrag', card: { name: 'Eins merken', fact: 'In jedem Prozessor stecken Schaltungen, die genau so addieren. Sie heißen Volladdierer und reichen den Übertrag weiter.' } },
  { id: 'hex', color: '#9B7BFF', ic: 'F', title: 'Hexadezimal', de: '16 Ziffern von 0 bis F', card: { name: 'Hex-Farben', fact: 'Im Web steht #FF0000 für Rot: FF Rot, 00 Grün, 00 Blau. Jeder Farbwert geht von 00 bis FF, also von 0 bis 255.' } },
  { id: 'binhex', color: '#FF6B88', ic: '4:1', title: 'Binär ↔ Hex', de: 'Der Trick mit den Vierergruppen', card: { name: 'Das Byte', fact: 'Ein Byte hat 8 Bits und passt in genau zwei Hex-Ziffern. Zum Beispiel 11111111 = FF = 255.' } }
];

export const TIPS = {
  stellen: [
    ['Zehnersystem', 'Zehn Ziffern: 0 bis 9. Jede Stelle ist 10-mal so viel wert wie die rechts daneben.'],
    ['Zerlegen', '352 = 3×100 + 5×10 + 2×1. Das Prinzip gilt später auch für Binär und Hex.']
  ],
  binaer: [
    ['Bit', 'Eine Stelle im Binärsystem. Sie ist 0 (aus) oder 1 (an).'],
    ['Stellenwerte', 'Von rechts nach links verdoppeln sie sich: 1, 2, 4, 8, 16, 32, 64, 128.'],
    ['Lesen', 'Zähle die Stellenwerte zusammen, über denen eine 1 steht. 1011 = 8 + 2 + 1 = 11.']
  ],
  dez2bin: [
    ['Von links starten', 'Beginne beim größten Stellenwert, der noch in die Zahl passt.'],
    ['Passt er hinein?', 'Ja: schreibe 1 und ziehe ab. Nein: schreibe 0.'],
    ['Probe', 'Rechne das Ergebnis zurück. Kommt die Ausgangszahl heraus, stimmt es.']
  ],
  addieren: [
    ['Vier Regeln', '0+0=0, 0+1=1, 1+1=10 (schreibe 0, merke 1) und 1+1+1=11 (schreibe 1, merke 1).'],
    ['Wie schriftlich', 'Von rechts nach links rechnen und den Übertrag mitnehmen.'],
    ['Probe', 'Wandle beide Zahlen in Normalzahlen um und prüfe die Summe.']
  ],
  hex: [
    ['16 Ziffern', '0 bis 9, danach A=10, B=11, C=12, D=13, E=14, F=15.'],
    ['Stellenwerte', '1, 16, 256 … Jede Stelle ist 16-mal so viel wert wie die rechts daneben.'],
    ['Rechnen', '2F = 2×16 + 15 = 47.']
  ],
  binhex: [
    ['4 Bits = 1 Hex-Ziffer', '1111 ist 15 und das ist F. Vier Bits passen also genau in eine Hex-Ziffer.'],
    ['Vierergruppen', 'Schneide die Binärzahl von rechts in Vierergruppen und übersetze jede einzeln.'],
    ['Farben im Web', '#FF0000 ist Rot: FF Rot, 00 Grün, 00 Blau.']
  ]
};
