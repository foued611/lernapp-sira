// App-Konfiguration der Geometrie-Werkstatt (App-Vertrag, siehe AGENTS.md). Kein Browser-Code.
import { UNITS } from './data.js';
import { lessonRound, quickRound, bossRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import { BADGES } from './badges.js';
import { LESSONS } from './lessons.js';

export default {
  id: 'geometrie',
  title: 'Geometrie-Werkstatt',
  greeting: 'Hallo',
  bossTitle: 'Der Konstruktions-Boss',
  intro: 'Erst konstruieren (Kapitel III), dann beweisen (Kapitel V). Halte Zirkel und Lineal bereit.',
  words: { levelTitles: ['Strich-Anfänger', 'Zirkel-Lehrling', 'Winkelmesser', 'Konstrukteur', 'Beweis-Profi', 'Geometrie-Meister'] },
  units: UNITS,
  theory: renderTheory,
  lessons: LESSONS,
  rounds: { lesson: lessonRound, quick: quickRound, boss: bossRound },
  blitz: blitzQuestion,
  badges: BADGES
};
