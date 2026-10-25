// App-Konfiguration der Mathe-App (App-Vertrag, siehe AGENTS.md). Kein Browser-Code.
import { UNITS } from './data.js';
import { lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import { BADGES } from './badges.js';
import { LESSONS } from './lessons.js';

export default {
  id: 'mathe',
  title: 'Mathe-Werkstatt',
  greeting: 'Hallo',
  bossTitle: 'Der Rechen-Boss',
  intro: 'Starte mit den Vorzeichen. Danach bauen Terme, Gleichungen und Prozente darauf auf.',
  words: { levelTitles: ['Zahlen-Neuling', 'Rechenlehrling', 'Termjäger', 'Gleichungslöser', 'Prozent-Profi', 'Mathe-Meister'] },
  units: UNITS,
  theory: renderTheory,
  lessons: LESSONS,
  rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound },
  blitz: blitzQuestion,
  badges: BADGES
};
