// Lektionen der Mathe-App (Klasse 7, Gymnasium BW). Aufbau und Pflichtteile: core/js/lesson.js.
import { option as opt } from '../../core/js/questions.js';
import { lineDiagram, tilesDiagram, balanceDiagram, percentDiagram, interestDiagram, tableDiagram } from './diagrams.js';

export const LESSONS = {
  vorzeichen: {
    goal: 'Du kannst mit positiven und negativen Zahlen sicher addieren, subtrahieren, multiplizieren und dividieren.',
    tldr: [
      'Auf dem Zahlenstrahl geht Plus nach rechts und Minus nach links.',
      'Minus minus ergibt Plus: 5 − (−3) = 5 + 3.',
      'Beim Multiplizieren und Teilen gilt: gleiche Vorzeichen ergeben Plus, verschiedene ergeben Minus.'
    ],
    analogy: {
      title: 'Stell dir vor: dein Konto',
      html: '<p>Du hast <b>3 €</b> und musst <b>5 €</b> bezahlen. Dann stehst du bei <b>−2 €</b>: Du schuldest 2 €.</p><p>Nimmt dir jemand eine Schuld von 5 € ab, ist das so, als bekämst du 5 € geschenkt. Darum ist „Minus (−5)“ dasselbe wie „Plus 5“.</p>'
    },
    figure: { svg: lineDiagram(3, -5), caption: 'Start bei 3, dann 5 Schritte nach links: 3 + (−5) = −2.' },
    steps: {
      title: 'So rechnest du 4 − (−6), Schritt für Schritt',
      items: [
        'Erkenne das doppelte Minus: Du ziehst eine <b>negative</b> Zahl ab.',
        'Ersetze „− (−6)“ durch „+ 6“. Subtrahieren heißt, die Gegenzahl zu addieren.',
        'Rechne die einfache Aufgabe: 4 + 6 = 10.',
        'Probe auf dem Zahlenstrahl: Von 4 geht es 6 nach rechts und du landest bei <b>10</b>.'
      ]
    },
    pitfall: { html: '<p>Der klassische Fehler: <b>−3 − 4</b> wird zu −1 gerechnet. Beides sind aber Schritte nach links: erst 3 nach links (−3), dann noch 4 nach links. Das gibt <b>−7</b>.</p>' },
    rule: 'Minus minus gibt Plus. Gleiche Vorzeichen beim Malnehmen geben Plus, verschiedene Minus.',
    check: {
      q: 'Was ergibt <b>(−4) · (−3)</b>?',
      options: [opt('12'), opt('−12'), opt('−7'), opt('7')],
      answer: '12',
      why: 'Beide Faktoren sind negativ, die Vorzeichen sind gleich. Darum ist das Ergebnis positiv: 4 · 3 = 12.'
    }
  },

  terme: {
    goal: 'Du kannst Terme zusammenfassen, Klammern ausmultiplizieren und Minusklammern auflösen.',
    tldr: [
      'Du darfst nur gleichartige Summanden zusammenfassen: x-Kacheln mit x-Kacheln, Zahlen mit Zahlen.',
      'Beim Ausmultiplizieren bekommt jeder Summand in der Klammer den Faktor.',
      'Steht ein Minus vor der Klammer, drehen sich alle Vorzeichen darin um.'
    ],
    analogy: {
      title: 'Stell dir vor: Sammelkarten',
      html: '<p>Du hast 2 Tüten mit je <b>x</b> Karten und 3 lose Karten. Dein Freund hat 1 Tüte und 2 lose. Zusammen habt ihr <b>3 Tüten</b> und <b>5 lose Karten</b>: 3x + 5.</p><p>Tüten und lose Karten kannst du nicht zu einer Sorte machen, solange du nicht weißt, wie viele in einer Tüte stecken.</p>'
    },
    figure: { svg: tilesDiagram(2, 3, 1, 2), caption: 'Orange Kacheln sind x, gelbe sind Einer. Gleiche Kacheln werden zusammengelegt.' },
    steps: {
      title: 'So rechnest du 4 · (x + 3), Schritt für Schritt',
      items: [
        'Der Faktor 4 steht vor der Klammer und gilt für <b>jeden</b> Summanden darin.',
        'Multipliziere den ersten Summanden: 4 · x = 4x.',
        'Multipliziere den zweiten Summanden: 4 · 3 = 12.',
        'Schreibe beides auf: <b>4x + 12</b>. Probe mit x = 1: 4 · 4 = 16 und 4 + 12 = 16.'
      ]
    },
    pitfall: { html: '<p>Vergisst du den zweiten Summanden, entsteht <b>4x + 3</b> statt 4x + 12. Zeichne dir Bögen von der 4 zu <b>beiden</b> Summanden.</p><p>Bei <b>10 − (x − 3)</b> musst du beide Vorzeichen drehen: 10 − x + 3 = 13 − x.</p>' },
    rule: 'Distributivgesetz: a · (b + c) = a · b + a · c. Minus vor der Klammer dreht alle Vorzeichen.',
    check: {
      q: 'Fasse zusammen: <b>5x + 2 + 3x</b>',
      options: [opt('8x + 2'), opt('10x'), opt('8x²'), opt('5x + 5')],
      answer: '8x + 2',
      why: '5x und 3x sind gleichartig und ergeben 8x. Die 2 gehört nicht zu den x und bleibt stehen.'
    }
  },

  gleichungen: {
    goal: 'Du kannst lineare Gleichungen mit Äquivalenzumformungen lösen und die Lösung mit einer Probe prüfen.',
    tldr: [
      'Eine Gleichung ist wie eine Waage im Gleichgewicht.',
      'Was du links machst, machst du auch rechts. Dann bleibt die Gleichung wahr.',
      'Erst Plus oder Minus rückgängig machen, dann Mal oder Geteilt.'
    ],
    analogy: {
      title: 'Stell dir vor: eine Waage',
      html: '<p>Links liegt ein Beutel mit <b>x</b> Murmeln, dazu 3 einzelne. Rechts liegen 11 Murmeln. Die Waage ist im Gleichgewicht.</p><p>Nimmst du links 3 weg, musst du auch rechts 3 wegnehmen. Sonst kippt sie.</p>'
    },
    figure: { svg: balanceDiagram(2, 3, 4), caption: '2x + 3 = 11: Erst auf beiden Seiten 3 abziehen, dann beide Seiten durch 2 teilen.' },
    steps: {
      title: 'So löst du 3x − 5 = 16, Schritt für Schritt',
      items: [
        'Schreibe die Umformung rechts neben die Gleichung. Das nennt man Äquivalenzumformung.',
        'Mache das Minus rückgängig: <b>3x − 5 = 16 | + 5</b> ergibt 3x = 21.',
        'Mache das Mal rückgängig: <b>3x = 21 | : 3</b> ergibt x = 7.',
        'Probe: 3 · 7 − 5 = 16. Links und rechts stimmen, die Lösung ist richtig.'
      ]
    },
    pitfall: { html: '<p>Der Fehler, der am häufigsten vorkommt: nur auf <b>einer</b> Seite rechnen. Bei 2x + 3 = 11 darfst du nicht nur die linke 3 streichen.</p><p>Außerdem gilt: erst Plus/Minus, dann Mal/Geteilt. Teilst du zuerst durch 2, musst du <b>alle</b> Summanden teilen.</p>' },
    rule: 'Auf beiden Seiten dasselbe tun. Erst Addition oder Subtraktion, dann Multiplikation oder Division. Zum Schluss die Probe.',
    check: {
      q: 'Welche Umformung kommt bei <b>4x + 6 = 22</b> zuerst?',
      options: [opt('| − 6'), opt('| : 4'), opt('| + 6'), opt('| · 4')],
      answer: '| − 6',
      why: 'Das + 6 steht direkt beim x-Term. Du machst es mit | − 6 rückgängig. Das Teilen durch 4 folgt danach.'
    }
  },

  prozent: {
    goal: 'Du kannst Prozentwert, Grundwert und Prozentsatz berechnen und Rabatte ausrechnen.',
    tldr: [
      'Prozent heißt „pro Hundert“. 25 % sind 25 von 100.',
      'Der Grundwert ist das Ganze (100 %). Der Prozentwert ist der Teil davon.',
      'Prozentwert = Grundwert · Prozentsatz. Mit dem Dreisatz findest du jede Größe.'
    ],
    analogy: {
      title: 'Stell dir vor: eine Pizza',
      html: '<p>Die ganze Pizza ist <b>100 %</b>. Isst du 25 %, ist das ein Viertel. Hat die Pizza 8 Stücke, hast du 2 Stücke gegessen.</p><p>Bei einem Rabatt von 25 % zahlst du nur die übrigen 75 % der Pizza.</p>'
    },
    figure: { svg: percentDiagram(200, 25), caption: 'Der obere Balken ist der Grundwert (100 %). Der gelbe Teil darunter ist der Prozentwert.' },
    steps: {
      title: 'So berechnest du 15 % von 80 €, Schritt für Schritt',
      items: [
        'Der Grundwert ist 80 €. Das sind 100 %.',
        'Rechne auf 1 %: 80 € : 100 = 0,80 €.',
        'Rechne auf 15 %: 0,80 € · 15 = 12 €.',
        'Probe: 10 % sind 8 €, 5 % sind 4 €, zusammen <b>12 €</b>.'
      ]
    },
    pitfall: { html: '<p>Bei einem <b>Rabatt von 20 %</b> ist der Preis nach dem Rabatt nicht der Prozentwert. Der Prozentwert ist der <b>Abzug</b>. Du zahlst 100 % − 20 % = <b>80 %</b>.</p>' },
    rule: 'Prozentwert = Grundwert · Prozentsatz. Rabatt: Du zahlst (100 − Rabatt) Prozent.',
    check: {
      q: 'Ein Buch kostet 40 €. Es gibt 25 % Rabatt. Was zahlst du?',
      options: [opt('30 €'), opt('10 €'), opt('15 €'), opt('50 €')],
      answer: '30 €',
      why: '25 % von 40 € sind 10 €. Das ist der Rabatt. Du zahlst 40 € − 10 € = 30 €, also 75 % vom alten Preis.'
    }
  },

  zinsen: {
    goal: 'Du kannst Zinsen, Kapital und Zinssatz berechnen und erklären, was die Bank dir für dein Geld zahlt.',
    tldr: [
      'Wer Geld bei der Bank anlegt, bekommt dafür Zinsen. Sie sind der „Lohn“ fürs Verleihen.',
      'Zinsrechnung ist Prozentrechnung: Kapital = Grundwert, Zinssatz = Prozentsatz, Zinsen = Prozentwert.',
      'Für ein Jahr gilt Z = K · p/100. Für einen Teil des Jahres rechnest du anteilig.'
    ],
    analogy: {
      title: 'Stell dir vor: du leihst einem Freund Geld',
      html: '<p>Du leihst deinem Freund <b>100 €</b>. Er gibt dir nach einem Jahr <b>103 €</b> zurück. Die 3 € sind die <b>Zinsen</b>, der <b>Zinssatz</b> ist 3 %.</p><p>Bei der Sparkasse bist du der Verleiher, und die Bank ist der Freund.</p>'
    },
    figure: { svg: interestDiagram(1000, 3), caption: '1000 € bei 3 % Zinssatz bringen in einem Jahr 30 € Zinsen.' },
    steps: {
      title: 'So berechnest du die Zinsen für 2400 € bei 4 % in 6 Monaten',
      items: [
        'Benenne die Größen: Kapital K = 2400 €, Zinssatz p = 4 %.',
        'Jahreszinsen: 2400 · 4/100 = <b>96 €</b>.',
        '6 Monate sind die Hälfte eines Jahres, also 6/12.',
        'Zinsen: 96 € · 6/12 = <b>48 €</b>. Probe: Halbes Jahr, halbe Zinsen.'
      ]
    },
    pitfall: { html: '<p>Die Zinsen sind <b>nicht</b> das, was du am Ende auf dem Konto hast. Auf dem Konto liegen Kapital <b>plus</b> Zinsen: 1000 € + 30 € = 1030 €.</p><p>Und denk an die Zeit: Der Zinssatz gilt immer für ein ganzes Jahr.</p>' },
    rule: 'Z = K · p/100 für ein Jahr. Für m Monate: Z = K · p/100 · m/12.',
    check: {
      q: 'Wie viel Zinsen bringen <b>500 €</b> bei <b>2 %</b> in einem Jahr?',
      options: [opt('10 €'), opt('100 €'), opt('1000 €'), opt('2 €')],
      answer: '10 €',
      why: '2 % von 500 € sind 500 · 2/100 = 10 €.'
    }
  },

  zuordnungen: {
    goal: 'Du kannst entscheiden, ob eine Zuordnung proportional oder antiproportional ist, und mit dem Dreisatz rechnen.',
    tldr: [
      'Proportional: Doppelt so viel gibt doppelt so viel. Beispiel: Menge und Preis.',
      'Antiproportional: Doppelt so viel gibt halb so viel. Beispiel: Arbeiter und Zeit.',
      'Dreisatz: erst auf die Einheit 1 rechnen, dann auf die gesuchte Menge.'
    ],
    analogy: {
      title: 'Stell dir vor: Hefte und Pizza',
      html: '<p><b>Hefte:</b> 1 Heft kostet 3 €, dann kosten 4 Hefte 12 €. Mehr Hefte, mehr Geld.</p><p><b>Pizza:</b> Eine Pizza wird gleichmäßig verteilt. Bei 2 Personen bekommt jeder die Hälfte, bei 4 Personen nur ein Viertel. Mehr Personen, weniger für jeden.</p>'
    },
    figure: { svg: tableDiagram('prop', 3), caption: 'Proportional: Wird die obere Zahl verdoppelt, verdoppelt sich auch die untere.' },
    steps: {
      title: 'So löst du: 3 Arbeiter brauchen 8 Tage, wie lange brauchen 6?',
      items: [
        'Entscheide: Mehr Arbeiter schaffen es schneller. Das ist <b>antiproportional</b>.',
        'Rechne auf die Einheit: 1 Arbeiter braucht 3 · 8 = 24 Tage.',
        'Rechne auf die gesuchte Menge: 6 Arbeiter brauchen 24 : 6 = <b>4 Tage</b>.',
        'Probe: Doppelt so viele Arbeiter, halbe Zeit. 8 : 2 = 4. Stimmt.'
      ]
    },
    pitfall: { html: '<p>Nicht alles, was „mehr“ bedeutet, ist proportional. Bei Arbeitern und Zeit führt <b>mehr</b> zu <b>weniger</b>.</p><p>Frage dich vor jeder Rechnung: <b>Wird das andere auch mehr oder weniger?</b></p>' },
    rule: 'Proportional: Quotient y : x bleibt gleich. Antiproportional: Produkt x · y bleibt gleich.',
    check: {
      q: '4 Maurer brauchen 6 Tage. Wie lange brauchen <b>8 Maurer</b>?',
      options: [opt('3 Tage'), opt('12 Tage'), opt('10 Tage'), opt('2 Tage')],
      answer: '3 Tage',
      why: 'Doppelt so viele Maurer brauchen nur die halbe Zeit: 6 : 2 = 3 Tage (antiproportional).'
    }
  }
};
