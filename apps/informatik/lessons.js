// Lektionen der Zahlenwerkstatt: Ziel, Vergleich, Diagramm, Beispiel, Falle, Merksatz und Mini-Check.
// Aufbau und Pflichtteile: core/js/lesson.js. Texte sind für 12- bis 13-Jährige geschrieben.
import { option as opt } from '../../core/js/questions.js';
import { placeDiagram, lampDiagram, blocksDiagram, addDiagram, hexPlaceDiagram, nibbleDiagram } from './diagrams.js';


export const LESSONS = {
  stellen: {
    goal: 'Du kannst jede Zahl in ihre Stellenwerte zerlegen und erklären, warum dieselbe Ziffer an einer anderen Stelle mehr wert ist.',
    tldr: [
      'Wir nutzen zehn Ziffern: 0 bis 9.',
      'Je weiter links eine Ziffer steht, desto mehr ist sie wert: Einer, Zehner, Hunderter, Tausender.',
      'Von Stelle zu Stelle wird der Wert mal 10 genommen.'
    ],
    analogy: {
      title: 'Stell dir vor: dein Geldbeutel',
      html: '<p>Du hast 3 Hundert-Euro-Scheine, 5 Zehner-Scheine und 2 Ein-Euro-Münzen. Zusammen sind das <b>352 Euro</b>.</p><p>Hast du zehn Münzen, tauschst du sie gegen einen Zehner-Schein. Genau so arbeitet das Zehnersystem: Zehn von einer Sorte werden zu einem von der nächsten Sorte.</p>'
    },
    figure: { svg: placeDiagram(352), caption: 'Die Zahl 352 in der Stellenwert-Tafel: 3 Hunderter, 5 Zehner und 2 Einer.' },
    steps: {
      title: 'So zerlegst du 4071, Schritt für Schritt',
      items: [
        'Schreibe die Zahl in die Tafel: <b>4</b> Tausender, <b>0</b> Hunderter, <b>7</b> Zehner, <b>1</b> Einer.',
        'Rechne jede Stelle einzeln: 4 × 1000 = 4000, 0 × 100 = 0, 7 × 10 = 70, 1 × 1 = 1.',
        'Lass die Nullen weg und addiere: 4000 + 70 + 1.',
        'Ergebnis: <b>4071 = 4×1000 + 7×10 + 1×1</b>. Probe: 4000 + 70 + 1 = 4071.'
      ]
    },
    pitfall: { html: '<p>Die Null ist nicht „nichts“. In 407 hält die 0 die Zehner-Stelle frei. Ohne sie stünde da 47, und das ist eine ganz andere Zahl.</p>' },
    rule: 'Jede Stelle ist 10-mal so viel wert wie die Stelle rechts daneben.',
    check: {
      q: 'Welchen Wert hat die 5 in <b>5280</b>?',
      options: [opt('5'), opt('50'), opt('500'), opt('5000')],
      answer: '5000',
      why: 'Die 5 steht ganz links, an der Tausender-Stelle: 5 × 1000 = 5000.'
    }
  },

  binaer: {
    goal: 'Du kannst eine Binärzahl mit den Stellenwerten in eine normale Zahl umrechnen.',
    tldr: [
      'Ein Computer kennt nur „an“ (1) und „aus“ (0). Eine solche Stelle heißt <b>Bit</b>.',
      'Die Stellenwerte verdoppeln sich nach links: 1, 2, 4, 8, 16, 32, 64, 128.',
      'Zähle die Werte zusammen, über denen eine 1 steht.'
    ],
    analogy: {
      title: 'Stell dir vor: eine Reihe Lichtschalter',
      html: '<p>Jeder Schalter ist entweder an oder aus. Und jeder hat sein eigenes Gewicht: der erste zählt 1, der zweite 2, dann 4, 8 und so weiter.</p><p>Welche Lampen leuchten, bestimmt die Zahl. Mit nur <b>acht Schaltern</b> kannst du 256 verschiedene Zahlen zeigen, von 0 bis 255.</p>'
    },
    figure: { svg: lampDiagram([0, 0, 0, 0, 1, 0, 1, 1]), caption: 'Es leuchten die Lampen 8, 2 und 1. Zusammen: 8 + 2 + 1 = 11. Binär schreibt man das 00001011.' },
    steps: {
      title: 'So liest du 1101, Schritt für Schritt',
      items: [
        'Schreibe die Stellenwerte <b>von rechts</b> über die Ziffern: 8, 4, 2, 1.',
        'Ordne zu: über der 8 steht eine 1, über der 4 eine 1, über der 2 eine 0, über der 1 eine 1.',
        'Nimm nur die Werte, über denen eine 1 steht: 8, 4 und 1.',
        'Addiere: 8 + 4 + 1 = <b>13</b>. Also ist 1101 die Zahl 13.'
      ]
    },
    pitfall: { html: '<p>Die Stellenwerte beginnen <b>rechts</b> mit der 1. Wer links mit der 1 anfängt, liest die Zahl verkehrt herum.</p><p>Die Ziffer 2 gibt es im Binärsystem nicht.</p>' },
    rule: 'Von rechts nach links verdoppeln sich die Stellenwerte: 1, 2, 4, 8, 16 …',
    check: {
      q: 'Welche normale Zahl ist <b>1010</b>?',
      options: [opt('6'), opt('10'), opt('12'), opt('20')],
      answer: '10',
      why: 'Von rechts: 1, 2, 4, 8. Eine 1 steht über der 2 und über der 8. Also 8 + 2 = 10.'
    }
  },

  dez2bin: {
    goal: 'Du kannst eine normale Zahl bis 255 in eine Binärzahl umwandeln.',
    tldr: [
      'Starte beim größten Stellenwert, der noch in die Zahl passt.',
      'Passt er? Schreibe 1 und ziehe ihn ab. Passt er nicht? Schreibe 0.',
      'Mit dem Rest und dem nächsten Stellenwert geht es weiter, bis du bei 1 ankommst.'
    ],
    analogy: {
      title: 'Stell dir vor: ein Wiegesatz',
      html: '<p>Du hast Gewichte zu 128, 64, 32, 16, 8, 4, 2 und 1 Gramm, von jedem nur eines. Du sollst genau <b>13 Gramm</b> abwiegen.</p><p>Du nimmst immer das größte Gewicht, das noch passt: erst 8, dann 4, dann 1. Gewicht auf der Waage heißt <b>1</b>, Gewicht im Kasten heißt <b>0</b>.</p>'
    },
    figure: { svg: blocksDiagram(13), caption: '13 setzt sich aus den Klötzen 8, 4 und 1 zusammen. Darum ist 13 binär 1101.' },
    steps: {
      title: 'So wandelst du 37 um, Schritt für Schritt',
      items: [
        'Der größte passende Stellenwert für 37 ist 32. Er passt: <b>1</b>. Rest: 37 − 32 = 5.',
        '16 passt nicht in 5: <b>0</b>. 8 passt nicht in 5: <b>0</b>.',
        '4 passt in 5: <b>1</b>. Rest: 5 − 4 = 1.',
        '2 passt nicht in 1: <b>0</b>. 1 passt in 1: <b>1</b>. Rest: 0.',
        'Lies die Ziffern der Reihe nach: 1 0 0 1 0 1. Also <b>37 = 100101</b>. Probe: 32 + 4 + 1 = 37.'
      ]
    },
    pitfall: { html: '<p>Rechne nach dem Abziehen mit dem <b>Rest</b> weiter, nicht mit der Ausgangszahl.</p><p>Und überspringe keine Stelle. Auch die Nullen müssen hingeschrieben werden, sonst ändert sich die Zahl.</p>' },
    rule: 'Passt der Stellenwert? Ja: 1 und abziehen. Nein: 0.',
    check: {
      q: 'Wie lautet <b>9</b> binär?',
      options: [opt('1001'), opt('1010'), opt('1100'), opt('0111')],
      answer: '1001',
      why: '9 = 8 + 1. Eine 1 bei der 8, eine 1 bei der 1, dazwischen Nullen: 1001.'
    }
  },

  addieren: {
    goal: 'Du kannst zwei Binärzahlen untereinander addieren, auch mit Übertrag.',
    tldr: [
      'Rechne wie schriftlich, von rechts nach links.',
      '1 + 1 ergibt <b>10</b>: schreibe 0 und merke dir 1 als Übertrag.',
      'Mit Übertrag kann in einer Spalte 1 + 1 + 1 = <b>11</b> entstehen: schreibe 1, merke 1.'
    ],
    analogy: {
      title: 'Stell dir vor: ein Kilometerzähler',
      html: '<p>Im Zehnersystem springt der Zähler von 9 auf 10: die Einer fangen wieder bei 0 an und die Zehner steigen um 1.</p><p>Im Binärsystem ist es genauso. Nur springt der Zähler schon <b>von 1 auf 10</b>, weil es keine größere Ziffer gibt.</p>'
    },
    figure: { svg: addDiagram(11, 6), caption: 'Die gelben Kreise sind Überträge. Sie wandern eine Spalte nach links. 1011 + 0110 = 10001, also 11 + 6 = 17.' },
    steps: {
      title: 'So rechnest du 1011 + 0110, Schritt für Schritt',
      items: [
        'Rechte Spalte: 1 + 0 = 1. Schreibe <b>1</b>.',
        'Nächste Spalte: 1 + 1 = 10. Schreibe <b>0</b>, merke 1.',
        'Nächste Spalte: 0 + 1 + Übertrag 1 = 10. Schreibe <b>0</b>, merke 1.',
        'Nächste Spalte: 1 + 0 + Übertrag 1 = 10. Schreibe <b>0</b>, merke 1.',
        'Der letzte Übertrag wird vorne angeschrieben: <b>10001</b>. Probe: 11 + 6 = 17 und 10001 = 16 + 1 = 17.'
      ]
    },
    pitfall: { html: '<p>Schreibe nie „1 + 1 = 2“ in eine Spalte. Die Ziffer 2 gibt es nicht. Es heißt <b>10</b>, gesprochen „eins null“.</p><p>Vergiss den Übertrag nicht: Er gehört in die nächste Spalte links.</p>' },
    rule: '1 + 1 = 10: Null hinschreiben, Eins merken.',
    check: {
      q: 'Was ergibt <b>101 + 11</b>?',
      options: [opt('110'), opt('1000'), opt('1010'), opt('111')],
      answer: '1000',
      why: '101 ist 5, 11 ist 3. Zusammen 8, und 8 ist binär 1000. Beim Rechnen entsteht dreimal ein Übertrag.'
    }
  },

  hex: {
    goal: 'Du kannst Hexadezimalzahlen lesen und in normale Zahlen umrechnen.',
    tldr: [
      'Hex hat 16 Ziffern: 0 bis 9 und danach A bis F (A = 10 bis F = 15).',
      'Die Stellenwerte sind 1, 16, 256 …: jede Stelle ist 16-mal so viel wert.',
      'Zwei Hex-Ziffern reichen für alle Zahlen von 0 bis 255, genau wie acht Bits.'
    ],
    analogy: {
      title: 'Stell dir vor: ein Regal mit 16 Fächern',
      html: '<p>Im Zehnersystem hat jede Stelle zehn Fächer (0 bis 9). Bei Hex sind es sechzehn. Weil es nur zehn Zahl-Ziffern gibt, heißen die Fächer 10 bis 15 einfach <b>A, B, C, D, E, F</b>.</p><p>Du kennst das aus dem Web: Die Farbe <b>#FF8800</b> ist ein Hex-Code. FF = 255 ist die Stärke von Rot.</p>'
    },
    figure: { svg: hexPlaceDiagram('2F'), caption: '2F bedeutet: 2 Sechzehner und F (das ist 15) Einer. Zusammen 32 + 15 = 47.' },
    steps: {
      title: 'So rechnest du 3C um, Schritt für Schritt',
      items: [
        'Zerlege 3C in seine Ziffern: <b>3</b> und <b>C</b>.',
        'Wandle den Buchstaben um: C = 12.',
        'Die linke Ziffer steht an der Sechzehner-Stelle: 3 × 16 = 48.',
        'Die rechte Ziffer steht an der Einer-Stelle: 12 × 1 = 12.',
        'Addiere: 48 + 12 = <b>60</b>. Also ist 3C die Zahl 60.'
      ]
    },
    pitfall: { html: '<p>Hex-Zahlen sehen manchmal aus wie normale Zahlen. <b>10 in Hex</b> ist nicht zehn, sondern 16 (1 × 16 + 0).</p><p>Schreibe bei Unsicherheit „(hex)“ dahinter.</p>' },
    rule: 'Die linke Hex-Ziffer zählt 16-fach, die rechte einfach. A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.',
    check: {
      q: 'Welche normale Zahl ist <b>1A</b> (hex)?',
      options: [opt('11'), opt('17'), opt('26'), opt('30')],
      answer: '26',
      why: '1 × 16 = 16 und A = 10. Zusammen 16 + 10 = 26.'
    }
  },

  binhex: {
    goal: 'Du kannst Binärzahlen mit dem Vierer-Trick in Hex umwandeln und zurück.',
    tldr: [
      'Vier Bits ergeben höchstens 1111 = 15, also genau eine Hex-Ziffer (F).',
      'Schneide die Binärzahl <b>von rechts</b> in Vierergruppen.',
      'Übersetze jede Gruppe einzeln. Das geht viel schneller als über die normale Zahl.'
    ],
    analogy: {
      title: 'Stell dir vor: ein Karton mit vier Fächern',
      html: '<p>Jeder Karton hat vier Fächer mit den Werten 8, 4, 2 und 1. Was darin liegt, ergibt eine Zahl von 0 bis 15, und die schreibst du mit <b>einer</b> Hex-Ziffer.</p><p>Zwei Kartons sind ein <b>Byte</b> (8 Bits) und werden zu zwei Hex-Ziffern. Darum nutzen Programmierer Hex als Kurzschrift für Bits.</p>'
    },
    figure: { svg: nibbleDiagram([1, 1, 0, 1, 0, 1, 1, 0]), caption: '11010110 wird zu 1101 und 0110. Das sind 13 (= D) und 6. Also D6.' },
    steps: {
      title: 'So übersetzt du 10110111, Schritt für Schritt',
      items: [
        'Schneide von rechts in Vierergruppen: <b>1011</b> und <b>0111</b>.',
        'Linke Gruppe: 1011 = 8 + 2 + 1 = 11, und 11 schreibt man B.',
        'Rechte Gruppe: 0111 = 4 + 2 + 1 = 7, und 7 bleibt 7.',
        'Setze zusammen: <b>10110111 = B7</b>. Zurück geht es genauso: jede Hex-Ziffer wird wieder zu vier Bits.'
      ]
    },
    pitfall: { html: '<p>Schneide immer von <b>rechts</b>. Fehlen links Stellen, fülle mit Nullen auf: 101 wird 0101.</p><p>Von Hex zurück nach Binär braucht jede Ziffer vier Bits, auch mit führenden Nullen: 7 wird 0111.</p>' },
    rule: '4 Bits = 1 Hex-Ziffer. Von rechts in Vierergruppen schneiden.',
    check: {
      q: 'Was ist <b>1111 0000</b> in Hex?',
      options: [opt('F0'), opt('0F'), opt('FF'), opt('F1')],
      answer: 'F0',
      why: '1111 ist 15, also F. 0000 ist 0. Zusammen F0.'
    }
  }
};
