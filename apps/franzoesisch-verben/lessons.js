// Lektionen des Cahier de Verbes: Ziel, Vergleich, Diagramm, Beispiel, Falle, Merksatz und Mini-Check.
// Aufbau und Pflichtteile: core/js/lesson.js. Texte sind für 12- bis 13-Jährige geschrieben.
import { option as opt } from '../../core/js/questions.js';
import { personDiagram, endingsDiagram } from './diagrams.js';
import { ER, IR, RE } from './data.js';


export const LESSONS = {
  etre: {
    goal: 'Du kannst être im Présent in allen sechs Personen konjugieren und in Sätzen benutzen.',
    tldr: [
      '<b>être</b> heißt „sein“ und ist das wichtigste Verb im Französischen.',
      'Es ist unregelmäßig: je suis, tu es, il est, nous sommes, vous êtes, ils sont.',
      'Du brauchst es für Name, Herkunft und Eigenschaften: Je suis Sira. Elle est contente.'
    ],
    analogy: {
      title: 'Stell dir vor: dein Ausweis',
      html: '<p>être sagt, <b>wer</b> oder <b>wie</b> jemand ist. Es steht quasi auf dem Ausweis: der Name (Je suis Sira), der Wohnort (Je suis de Stuttgart), eine Eigenschaft (Il est grand).</p><p>Immer wenn du im Deutschen „bin, bist, ist, sind“ sagst, nimmst du auf Französisch être.</p>'
    },
    figure: { svg: personDiagram('etre'), caption: 'Alle sechs Formen von être. Ein Bild einprägen hilft: Die Einzahl beginnt mit s oder e, die Mehrzahl mit s und ê.' },
    steps: {
      title: 'So baust du „Wir sind in der Schule“, Schritt für Schritt',
      items: [
        'Wer ist gemeint? „Wir“ heißt <b>nous</b>.',
        'Suche die Form in der Tabelle: nous <b>sommes</b>.',
        'Ergänze den Rest des Satzes: à l\'école (in der Schule).',
        'Fertig: <b>Nous sommes à l\'école.</b>'
      ]
    },
    pitfall: { html: '<p><b>tu es</b> und <b>il est</b> klingen gleich. Den Unterschied siehst du nur beim Schreiben: es und est.</p><p>Und vergiss das Dach auf dem e in <b>vous êtes</b>.</p>' },
    rule: 'je suis · tu es · il est · nous sommes · vous êtes · ils sont',
    check: {
      q: 'Wie heißt „ihr seid“ auf Französisch?',
      options: [opt('vous êtes'), opt('vous sommes'), opt('vous est'), opt('vous avez')],
      answer: 'vous êtes',
      why: 'Zu vous gehört êtes. Die Form sommes gehört zu nous und avez ist von avoir.'
    }
  },

  avoir: {
    goal: 'Du kannst avoir im Présent konjugieren und damit dein Alter sagen.',
    tldr: [
      '<b>avoir</b> heißt „haben“.',
      'Die Formen: j\'ai, tu as, il a, nous avons, vous avez, ils ont.',
      'Das Alter sagt man mit avoir: J\'ai treize ans. Wörtlich: „Ich habe dreizehn Jahre.“'
    ],
    analogy: {
      title: 'Stell dir vor: dein Rucksack',
      html: '<p>avoir sagt, was du <b>hast</b>: J\'ai un frère. Tu as un chien.</p><p>Im Französischen „hat“ man aber auch Dinge, die wir anders sagen: J\'ai faim (ich habe Hunger) und J\'ai treize ans (ich habe dreizehn Jahre).</p>'
    },
    figure: { svg: personDiagram('avoir', [0]), caption: 'Alle Formen von avoir. Vor einem Vokal wird je zu j\': j\'ai.' },
    steps: {
      title: 'So sagst du dein Alter, Schritt für Schritt',
      items: [
        'Jemand fragt: <b>Quel âge as-tu ?</b> (Wie alt bist du?)',
        'Im Französischen „hast“ du Jahre. Du brauchst also <b>avoir</b>, nicht être.',
        'Die Form für „ich“ ist <b>j\'ai</b>. Je und ai verschmelzen zu j\'ai.',
        'Fertig: <b>J\'ai treize ans.</b>'
      ]
    },
    pitfall: { html: '<p>Sag nie „Je suis treize ans“. Das Alter geht <b>immer</b> mit avoir.</p><p>Vor einem Vokal wird je zu j\': <b>j\'ai</b>, aber je vais und je fais.</p>' },
    rule: 'j\'ai · tu as · il a · nous avons · vous avez · ils ont',
    check: {
      q: 'Wie sagst du „Ich bin 12 Jahre alt“?',
      options: [opt('J\'ai douze ans.'), opt('Je suis douze ans.'), opt('Je ai douze ans.'), opt('Je vais douze ans.')],
      answer: 'J\'ai douze ans.',
      why: 'Das Alter wird mit avoir gebildet: j\'ai. Je + ai wird zu j\'ai.'
    }
  },

  aller: {
    goal: 'Du kannst aller im Présent konjugieren und damit sagen, wohin du gehst.',
    tldr: [
      '<b>aller</b> heißt „gehen“ und ist unregelmäßig.',
      'Die Formen: je vais, tu vas, il va, nous allons, vous allez, ils vont.',
      'Nur bei nous und vous erkennst du das Wort aller wieder: allons, allez.'
    ],
    analogy: {
      title: 'Stell dir vor: dein Schulweg',
      html: '<p>aller sagt, <b>wohin</b> die Reise geht: Je vais à l\'école. Nous allons au cinéma.</p><p>Nach aller steht fast immer ein Ort mit <b>à</b>. Aus à + le wird <b>au</b>: au cinéma.</p>'
    },
    figure: { svg: personDiagram('aller', [3, 4]), caption: 'Gelb: nous allons und vous allez sehen aus wie der Infinitiv. Die anderen vier Formen sind ganz anders.' },
    steps: {
      title: 'So sagst du „Wir gehen ins Kino“, Schritt für Schritt',
      items: [
        'Wer geht? „Wir“ heißt <b>nous</b>.',
        'Form von aller für nous: <b>allons</b>.',
        'Wohin? Ins Kino: <b>au cinéma</b> (à + le = au).',
        'Fertig: <b>Nous allons au cinéma.</b>'
      ]
    },
    pitfall: { html: '<p><b>vais, vas, va</b> sehen ähnlich aus. Merke dir: je vais (mit i), tu vas, il va.</p><p>Die Mehrzahl heißt <b>ils vont</b>, nicht „ils allent“.</p>' },
    rule: 'je vais · tu vas · il va · nous allons · vous allez · ils vont',
    check: {
      q: 'Wie heißt „sie (Mehrzahl) gehen“?',
      options: [opt('ils vont'), opt('ils allent'), opt('ils vais'), opt('ils allons')],
      answer: 'ils vont',
      why: 'Bei ils heißt die Form vont. Eine Form „allent“ gibt es nicht.'
    }
  },

  faire: {
    goal: 'Du kannst faire im Présent konjugieren und weißt, wofür man es benutzt.',
    tldr: [
      '<b>faire</b> heißt „machen“ oder „tun“.',
      'Die Formen: je fais, tu fais, il fait, nous faisons, vous faites, ils font.',
      'Es steckt in vielen festen Ausdrücken: faire du sport, faire les devoirs, faire du vélo.'
    ],
    analogy: {
      title: 'Stell dir vor: dein Nachmittag',
      html: '<p>Fragt dich jemand „Was machst du heute?“, antwortest du mit faire: Je fais mes devoirs. Je fais du sport.</p><p>faire ist der <b>Alleskönner</b> unter den Verben, genau wie „machen“ im Deutschen.</p>'
    },
    figure: { svg: personDiagram('faire', [0, 1]), caption: 'Gelb: je fais und tu fais sehen gleich aus. Nur das Pronomen verrät, wer gemeint ist.' },
    steps: {
      title: 'So sagst du „Ich mache meine Hausaufgaben“, Schritt für Schritt',
      items: [
        'Wer macht etwas? „Ich“ heißt <b>je</b>.',
        'Form von faire für je: <b>fais</b>.',
        'Was? Hausaufgaben heißt <b>les devoirs</b>, „meine“ heißt <b>mes</b>.',
        'Fertig: <b>Je fais mes devoirs.</b>'
      ]
    },
    pitfall: { html: '<p>Bei „ihr“ heißt es <b>vous faites</b> und nicht „vous faisez“. Das ist eine der drei Ausnahmen mit -tes (auch vous êtes, vous dites).</p>' },
    rule: 'je fais · tu fais · il fait · nous faisons · vous faites · ils font',
    check: {
      q: 'Wie heißt „ihr macht“?',
      options: [opt('vous faites'), opt('vous faisez'), opt('vous faisons'), opt('vous font')],
      answer: 'vous faites',
      why: 'Zu vous gehört bei faire die Form faites. Faisons gehört zu nous.'
    }
  },

  er: {
    goal: 'Du kannst jedes regelmäßige Verb auf -er im Présent richtig konjugieren.',
    tldr: [
      'Nimm den Infinitiv und streiche -er: parler wird zu <b>parl-</b>. Das ist der Stamm.',
      'Hänge die Endungen an: <b>-e, -es, -e, -ons, -ez, -ent</b>.',
      'Fast alle französischen Verben gehören zu dieser Gruppe. Mit einem Muster kannst du also hunderte Verben.'
    ],
    analogy: {
      title: 'Stell dir vor: Bausteine',
      html: '<p>Ein Verb besteht aus zwei Teilen: einem <b>festen Stamm</b> (parl-) und einem <b>Endstück</b>, das zur Person passt.</p><p>Wie bei Lego: Der Stamm bleibt liegen, du steckst nur das passende Stück an.</p>'
    },
    figure: { svg: endingsDiagram([{ inf: 'parler (sprechen)', stem: 'parl', ends: ER, silent: [0, 1, 2, 5] }]), caption: 'Der Stamm parl- bleibt immer gleich. Nur bei nous und vous hörst du die Endung.' },
    steps: {
      title: 'So konjugierst du „wir singen“, Schritt für Schritt',
      items: [
        'Verb: <b>chanter</b> (singen). Streiche -er: Der Stamm ist <b>chant-</b>.',
        'Person: „wir“ heißt <b>nous</b>. Die Endung bei nous ist <b>-ons</b>.',
        'Hänge an: chant + ons = <b>chantons</b>.',
        'Fertig: <b>Nous chantons une chanson.</b>'
      ]
    },
    pitfall: { html: '<p>Bei je, tu, il und ils hörst du die Endung nicht: <b>je parle, tu parles, ils parlent</b> klingen gleich. Du musst sie trotzdem schreiben: -e, -es, -ent.</p><p>Vor einem Vokal wird je zu j\': j\'aime, j\'habite.</p>' },
    rule: 'Stamm + e · es · e · ons · ez · ent',
    check: {
      q: 'Wie heißt „ihr spielt“ (jouer)?',
      options: [opt('vous jouez'), opt('vous jouons'), opt('vous jouent'), opt('vous joues')],
      answer: 'vous jouez',
      why: 'Stamm jou- plus die Endung für vous: -ez. Das ergibt jouez.'
    }
  },

  irre: {
    goal: 'Du kannst regelmäßige Verben auf -ir (finir) und -re (attendre) im Présent konjugieren.',
    tldr: [
      '<b>-ir-Verben</b> wie finir: Stamm fin- plus is, is, it, issons, issez, issent.',
      '<b>-re-Verben</b> wie attendre: Stamm attend- plus s, s, (nichts), ons, ez, ent.',
      'Bei -re ähneln die Endungen denen der -er-Verben. Bei -ir kommt im Plural ein -iss- dazu.'
    ],
    analogy: {
      title: 'Stell dir vor: zwei weitere Bausätze',
      html: '<p>Neben dem großen -er-Bausatz gibt es noch zwei kleinere.</p><p>Beim <b>-ir-Bausatz</b> steckt im Plural ein extra „-iss-“ (nous finissons). Beim <b>-re-Bausatz</b> bleibt bei il/elle die Endung leer (il attend).</p>'
    },
    figure: { svg: endingsDiagram([{ inf: 'finir (beenden)', stem: 'fin', ends: IR, silent: [0, 1, 2] }, { inf: 'attendre (warten)', stem: 'attend', ends: RE, silent: [0, 1, 2, 5] }]), caption: 'Oben die -ir-Endungen, unten die -re-Endungen. Das Zeichen – heißt: keine Endung.' },
    steps: {
      title: 'So konjugierst du „sie warten“, Schritt für Schritt',
      items: [
        'Verb: <b>attendre</b> (warten). Streiche -re: Der Stamm ist <b>attend-</b>.',
        'Person: „sie“ (Mehrzahl) heißt <b>ils</b>. Die Endung ist <b>-ent</b>.',
        'Hänge an: attend + ent = <b>attendent</b>.',
        'Fertig: <b>Ils attendent le bus.</b>'
      ]
    },
    pitfall: { html: '<p>Bei il/elle/on: finir → <b>il finit</b> (mit -t), attendre → <b>il attend</b> (ohne Endung, das d bleibt vom Stamm).</p><p>Im Plural der -ir-Verben nicht das -iss- vergessen: <b>nous finissons</b>.</p>' },
    rule: '-ir: is · is · it · issons · issez · issent. -re: s · s · – · ons · ez · ent',
    check: {
      q: 'Wie heißt „wir beenden“ (finir)?',
      options: [opt('nous finissons'), opt('nous finons'), opt('nous finisons'), opt('nous finit')],
      answer: 'nous finissons',
      why: 'Im Plural bekommen -ir-Verben ein -iss-: Stamm fin + iss + ons = finissons.'
    }
  }
};
