// App-Konfiguration "Zahlenwerkstatt" (Informatik, Binär und Hex). Gestartet wird sie in main.js.
import { UNITS } from './data.js';
import { lessonRound, bossRound, quickRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import { BADGES } from './badges.js';
import { LESSONS } from './lessons.js';

export default {
  id: 'info-zahlen',
  title: 'Zahlenwerkstatt',
  greeting: 'Hallo',
  bossTitle: 'Der Bit-Boss',
  intro: 'Binär und Hexadezimal: so rechnen Computer. Lies die Theorie, probiere die Lampen aus und übe dann.',
  words: {
    praise: ['Richtig!', 'Genau!', 'Stark!', 'Super!', 'Bit für Bit richtig!'],
    resultTitles: ['Geschafft!', 'Sehr gut!', 'Alles richtig!'],
    blitzTitle: 'Blitzrechner!',
    levelTitles: ['Bit-Neuling', 'Schalter-Schüler', 'Binär-Knacker', 'Hex-Entdecker', 'Byte-Profi', 'Code-Meister', 'Zahlen-Legende']
  },
  units: UNITS,
  theory: renderTheory,
  lessons: LESSONS,
  rounds: { lesson: lessonRound, boss: bossRound, quick: quickRound },
  blitz: blitzQuestion,
  badges: BADGES
};
