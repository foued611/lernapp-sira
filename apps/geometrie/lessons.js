// Lektionen der Geometrie-Werkstatt (Lambacher Schweizer 7 BW, Kapitel III und V). Aufbau: core/js/lesson.js.
import { option as opt } from '../../core/js/questions.js';
import { perpDiagram, bisectorDiagram, sssDiagram, anglesDiagram, thalesDiagram, circlesDiagram } from './diagrams.js';

export const LESSONS = {
  mittelsenkrechte: {
    goal: 'Du kannst den Abstand von einem Punkt zu einer Geraden bestimmen und die Mittelsenkrechte einer Strecke mit Zirkel und Lineal konstruieren.',
    tldr: [
      'Der Abstand eines Punktes zu einer Geraden ist die Länge der senkrechten Strecke dorthin.',
      'Die Mittelsenkrechte steht senkrecht auf der Strecke AB und geht durch ihre Mitte.',
      'Jeder Punkt auf ihr ist von A und B gleich weit entfernt.'
    ],
    analogy: {
      title: 'Stell dir vor: ein fairer Treffpunkt',
      html: '<p>Du wohnst in A, deine Freundin in B. Ihr wollt euch genau so treffen, dass <b>keiner einen weiteren Weg hat</b>. Alle fairen Treffpunkte liegen auf einer Linie: der <b>Mittelsenkrechten</b>.</p>'
    },
    figure: { svg: perpDiagram(), caption: 'Der Punkt P auf der roten Linie ist von A und B gleich weit entfernt.' },
    steps: {
      title: 'So konstruierst du die Mittelsenkrechte von AB',
      items: [
        'Zeichne die Strecke AB.',
        'Stelle den Zirkel auf einen Radius <b>größer als die halbe Strecke</b> ein.',
        'Zeichne einen Kreisbogen um A und einen Kreisbogen um B mit <b>demselben</b> Radius. Sie schneiden sich in zwei Punkten.',
        'Lege das Lineal an die beiden Schnittpunkte und zeichne die Gerade. Das ist die <b>Mittelsenkrechte</b>.',
        'Probe: Messe die Teilstrecken AM und MB (gleich lang) und den Winkel bei M (90°).'
      ]
    },
    pitfall: { html: '<p>Wird der Zirkelradius <b>zu klein</b> (die Hälfte von AB oder weniger), schneiden sich die Bögen nicht. Nimm lieber einen etwas größeren Radius.</p><p>Außerdem müssen beide Bögen <b>denselben Radius</b> haben. Verstelle den Zirkel nicht zwischendurch.</p>' },
    rule: 'Mittelsenkrechte: senkrecht zu AB, durch den Mittelpunkt M. Jeder ihrer Punkte hat von A und B den gleichen Abstand.',
    check: {
      q: 'P liegt auf der Mittelsenkrechten von AB. Es ist PA = 6 cm. Wie lang ist <b>PB</b>?',
      options: [opt('6 cm'), opt('3 cm'), opt('12 cm'), opt('0 cm')],
      answer: '6 cm',
      why: 'Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt. PB ist also genau so lang wie PA.'
    }
  },

  winkelhalbierende: {
    goal: 'Du kannst einen Winkel mit Zirkel und Lineal halbieren und die Eigenschaft der Winkelhalbierenden erklären.',
    tldr: [
      'Die Winkelhalbierende teilt einen Winkel in zwei gleich große Winkel.',
      'Jeder Punkt auf ihr hat von beiden Schenkeln denselben Abstand.',
      'Konstruiert wird sie mit drei Kreisbögen.'
    ],
    analogy: {
      title: 'Stell dir vor: eine Pizza und ein Schnitt',
      html: '<p>Du schneidest ein Pizzastück genau in der Mitte durch, so dass beide Hälften gleich breit sind. Der Schnitt ist die <b>Winkelhalbierende</b>.</p>'
    },
    figure: { svg: bisectorDiagram(70), caption: 'Ein Winkel von 70° wird durch die rote Linie in zweimal 35° geteilt.' },
    steps: {
      title: 'So konstruierst du die Winkelhalbierende',
      items: [
        'Zeichne einen Kreisbogen um den Scheitel S. Er schneidet beide Schenkel, in den Punkten U und V.',
        'Zeichne um U einen Kreisbogen im Inneren des Winkels.',
        'Zeichne um V einen Kreisbogen mit <b>demselben Radius</b>. Er schneidet den ersten Bogen im Punkt W.',
        'Zeichne die Gerade (Halbgerade) von S durch W. Das ist die <b>Winkelhalbierende</b>.',
        'Probe: Miss beide Teilwinkel. Sie sind gleich groß.'
      ]
    },
    pitfall: { html: '<p>Die zwei Bögen um U und V brauchen <b>den gleichen Radius</b>, und der Radius darf nicht zu klein sein, sonst treffen sich die Bögen nicht.</p><p>Verwechsle nicht mit der Mittelsenkrechten: Die steht <b>senkrecht</b> auf einer Strecke, die Winkelhalbierende <b>teilt einen Winkel</b>.</p>' },
    rule: 'Die Winkelhalbierende teilt den Winkel in zwei gleich große Teile. Ihre Punkte sind von beiden Schenkeln gleich weit entfernt.',
    check: {
      q: 'Ein Winkel von 80° wird halbiert. Wie groß ist <b>jeder Teilwinkel</b>?',
      options: [opt('40°'), opt('160°'), opt('20°'), opt('80°')],
      answer: '40°',
      why: 'Halbieren heißt durch 2 teilen: 80° : 2 = 40°.'
    }
  },

  dreiecke: {
    goal: 'Du kannst Dreiecke aus gegebenen Stücken konstruieren und sagen, wann das Dreieck eindeutig festgelegt ist (SSS, SWS, WSW, SsW).',
    tldr: [
      'Aus drei passenden Stücken lässt sich oft genau ein Dreieck zeichnen.',
      'Die vier Kongruenzsätze sagen, welche Stücke dafür reichen: SSS, SWS, WSW und SsW.',
      'Bei SSS müssen zwei Seiten zusammen immer länger sein als die dritte.'
    ],
    analogy: {
      title: 'Stell dir vor: ein Dreieck aus Stäben',
      html: '<p>Du hast drei Stäbe und steckst sie an den Enden zusammen. Ein Dreieck lässt sich nicht verbiegen: Die Form ist <b>festgelegt</b>, sobald die drei Längen feststehen. Bei einem Viereck aus vier Stäben geht das nicht, es wackelt.</p>'
    },
    figure: { svg: sssDiagram(4, 5, 6), caption: 'SSS: Aus a = 4 cm, b = 5 cm und c = 6 cm entsteht genau ein Dreieck.' },
    steps: {
      title: 'So konstruierst du ein Dreieck aus a = 4 cm, b = 5 cm, c = 6 cm (SSS)',
      items: [
        'Zeichne die Strecke c = 6 cm. Ihre Endpunkte sind A und B.',
        'Stelle den Zirkel auf b = 5 cm ein und zeichne einen Kreisbogen um A.',
        'Stelle den Zirkel auf a = 4 cm ein und zeichne einen Kreisbogen um B. Er schneidet den ersten Bogen in C.',
        'Verbinde C mit A und mit B. Fertig ist das Dreieck ABC.',
        'Probe: Miss AC und BC nach.'
      ]
    },
    pitfall: { html: '<p>Nicht jede Angabe ergibt ein Dreieck: Bei <b>3 cm, 4 cm, 8 cm</b> reichen die zwei kurzen Seiten zusammen (7 cm) nicht bis zur langen. Die Bögen treffen sich nicht.</p><p>Bei <b>SsW</b> muss der Winkel der <b>längeren</b> Seite gegenüberliegen. Liegt er der kürzeren gegenüber, kann es zwei Dreiecke geben.</p>' },
    rule: 'Kongruenzsätze: SSS, SWS, WSW und SsW (Winkel gegenüber der längeren Seite). Drei Winkel allein reichen nie.',
    check: {
      q: 'Welche Angaben legen ein Dreieck <b>nicht eindeutig</b> fest?',
      options: [opt('α = 40°, β = 60°, γ = 80°'), opt('a = 4 cm, b = 5 cm, c = 6 cm'), opt('c = 6 cm, α = 50°, β = 60°'), opt('b = 5 cm, c = 7 cm, α = 50° zwischen b und c')],
      answer: 'α = 40°, β = 60°, γ = 80°',
      why: 'Drei Winkel legen nur die Form fest. Das Dreieck kann beliebig groß sein. Alle anderen Angaben sind SSS, WSW und SWS.'
    }
  },

  winkel: {
    goal: 'Du kannst Winkel an sich schneidenden und parallelen Geraden bestimmen und mit der Winkelsumme im Dreieck begründen.',
    tldr: [
      'Scheitelwinkel sind gleich groß, Nebenwinkel ergeben zusammen 180°.',
      'An parallelen Geraden sind Stufenwinkel und Wechselwinkel gleich groß.',
      'In jedem Dreieck ist α + β + γ = 180°.'
    ],
    analogy: {
      title: 'Stell dir vor: eine Schere',
      html: '<p>Öffnest du eine Schere, entstehen vier Winkel. Je zwei <b>gegenüberliegende</b> sind gleich groß. Und zwei <b>nebeneinander</b> ergeben zusammen eine gerade Linie, also 180°.</p>'
    },
    figure: { svg: anglesDiagram(60), caption: 'Zwei Geraden schneiden sich: Scheitelwinkel sind gleich, Nebenwinkel ergeben 180°.' },
    steps: {
      title: 'So begründest du: Die Winkelsumme im Dreieck ist 180°',
      items: [
        'Zeichne durch die Ecke C eine Parallele zur Seite AB.',
        'Die Wechselwinkel an dieser Parallelen sind bei A und bei B gleich groß wie α und β.',
        'Bei C liegen dann α, γ und β nebeneinander auf einer Geraden.',
        'Eine Gerade ist 180° groß, also gilt <b>α + β + γ = 180°</b>.'
      ]
    },
    pitfall: { html: '<p>Stufenwinkel und Wechselwinkel sind <b>nur gleich, wenn die Geraden parallel sind</b>. Bei nicht parallelen Geraden darfst du das nicht benutzen.</p><p>Im <b>gleichschenkligen Dreieck</b> sind die beiden Basiswinkel gleich, nicht die Winkel an der Spitze.</p>' },
    rule: 'Scheitelwinkel gleich, Nebenwinkel 180°. An Parallelen: Stufen- und Wechselwinkel gleich. Dreieck: 180°.',
    check: {
      q: 'Ein Dreieck hat α = 50° und β = 60°. Wie groß ist <b>γ</b>?',
      options: [opt('70°'), opt('110°'), opt('130°'), opt('60°')],
      answer: '70°',
      why: 'Die Winkelsumme ist 180°. 180° − 50° − 60° = 70°.'
    }
  },

  thales: {
    goal: 'Du kannst den Satz des Thales anwenden und erklären, warum der Winkel im Halbkreis immer 90° beträgt.',
    tldr: [
      'Liegt C auf dem Halbkreis über AB, hat das Dreieck bei C einen rechten Winkel.',
      'Die Hypotenuse AB ist der Durchmesser, der Mittelpunkt M liegt in ihrer Mitte.',
      'Auch umgekehrt: Wenn bei C ein rechter Winkel ist, liegt C auf dem Halbkreis.'
    ],
    analogy: {
      title: 'Stell dir vor: eine Rutsche im Halbkreis',
      html: '<p>Du stehst mit einem Stab an den Enden eines Durchmessers und schaust zu einem Punkt auf dem Kreis. Egal wohin du schaust, die beiden Blickrichtungen bilden <b>immer</b> einen rechten Winkel.</p>'
    },
    figure: { svg: thalesDiagram(62), caption: 'Thaleskreis: Der Punkt C auf dem Halbkreis über AB sieht die Strecke AB immer unter 90°.' },
    steps: {
      title: 'So beweist du den Satz des Thales',
      items: [
        'Zeichne den Radius MC. Dann sind MA, MB und MC alle gleich lang (Radius r).',
        'Die Dreiecke AMC und MBC sind <b>gleichschenklig</b>. Ihre Basiswinkel sind gleich groß: bei A und C im ersten Dreieck α, bei B und C im zweiten β.',
        'Winkelsumme im Dreieck ABC: α + β + (α + β) = 180°, also <b>2 · (α + β) = 180°</b>.',
        'Damit ist α + β = 90°, und der Winkel bei C ist <b>90°</b>.'
      ]
    },
    pitfall: { html: '<p>Der Satz gilt nur, wenn <b>AB der Durchmesser</b> ist. Liegt C auf einem Kreis, aber AB geht nicht durch den Mittelpunkt, ist der Winkel bei C nicht 90°.</p>' },
    rule: 'Satz des Thales: Winkel im Halbkreis = 90°. Umkehrung: rechter Winkel bei C heißt, C liegt auf dem Kreis mit Durchmesser AB.',
    check: {
      q: 'Im Dreieck ABC liegt C auf dem Halbkreis über AB. Es ist α = 35°. Wie groß ist <b>β</b>?',
      options: [opt('55°'), opt('145°'), opt('35°'), opt('90°')],
      answer: '55°',
      why: 'Bei C ist der Winkel 90° (Thales). Dann gilt 180° − 90° − 35° = 55°.'
    }
  },

  kreise: {
    goal: 'Du kannst Umkreis und Inkreis eines Dreiecks unterscheiden und sagen, wie ihre Mittelpunkte gefunden werden.',
    tldr: [
      'Der Umkreis geht durch alle drei Ecken. Sein Mittelpunkt ist der Schnittpunkt der Mittelsenkrechten.',
      'Der Inkreis berührt alle drei Seiten von innen. Sein Mittelpunkt ist der Schnittpunkt der Winkelhalbierenden.',
      'Beim rechtwinkligen Dreieck liegt der Umkreismittelpunkt in der Mitte der Hypotenuse.'
    ],
    analogy: {
      title: 'Stell dir vor: eine runder Zaun und ein Ball',
      html: '<p>Der <b>Umkreis</b> ist wie ein runder Zaun außen herum, der die drei Ecken berührt. Der <b>Inkreis</b> ist wie ein Ball, der im Dreieck liegt und alle drei Wände berührt.</p>'
    },
    figure: { svg: circlesDiagram(), caption: 'Links der Umkreis mit den Mittelsenkrechten, rechts der Inkreis mit den Winkelhalbierenden.' },
    steps: {
      title: 'So konstruierst du den Umkreis',
      items: [
        'Konstruiere die Mittelsenkrechte der Seite AB.',
        'Konstruiere die Mittelsenkrechte der Seite BC. Beide schneiden sich im Punkt U.',
        'Stich mit dem Zirkel in U ein und stelle den Radius auf UA ein.',
        'Zeichne den Kreis. Er geht durch A, B und C. Probe: UB und UC sind genauso lang.'
      ]
    },
    pitfall: { html: '<p>Nicht verwechseln: Der <b>Umkreis</b> braucht die <b>Mittelsenkrechten</b>, der <b>Inkreis</b> die <b>Winkelhalbierenden</b>.</p><p>Bei einem <b>stumpfwinkligen</b> Dreieck liegt der Umkreismittelpunkt <b>außerhalb</b> des Dreiecks. Das ist normal.</p>' },
    rule: 'Umkreis: Mittelsenkrechten, geht durch die Ecken. Inkreis: Winkelhalbierende, berührt die Seiten.',
    check: {
      q: 'Wo liegt der Mittelpunkt des Umkreises bei einem <b>rechtwinkligen</b> Dreieck?',
      options: [opt('in der Mitte der Hypotenuse'), opt('im Schnittpunkt der Höhen'), opt('außerhalb des Dreiecks'), opt('in der Mitte einer Kathete')],
      answer: 'in der Mitte der Hypotenuse',
      why: 'Die Hypotenuse ist der Durchmesser des Thaleskreises. Darum ist ihre Mitte der Mittelpunkt des Umkreises.'
    }
  }
};
