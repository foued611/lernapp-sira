// App-Konfiguration "Cahier de Verbes" (Französisch, Présent): verdrahtet Lernstoff und Fragen mit der gemeinsamen Shell.
// Enthält keinen Browser-Code, deshalb in Tests importierbar. Gestartet wird die App in main.js.
import { UNITS } from './data.js';
import { lessonRound, bossRound, quickRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import { BADGES } from './badges.js';
import { LESSONS } from './lessons.js';

export default {
  id: 'fr-verben',
  title: 'Cahier de Verbes',
  greeting: 'Salut',
  bossTitle: 'Le Grand Défi',
  intro: 'Présent: être, avoir, aller, faire und die regelmäßigen Verben. Starte irgendwo. Die Reihenfolge ist nur ein Vorschlag.',
  words: {
    praise: ['Richtig!', 'Genau!', 'Très bien !', 'Parfait !', 'Bravo !', 'Super !'],
    resultTitles: ['Bien joué !', 'Très bien !', 'Parfait !'],
    blitzTitle: 'Éclair !',
    levelTitles: ['Neuling', 'Wortlehrling', 'Verbkenner', 'Konjugations-Ass', 'Grammatik-Profi', 'Maître des Verbes', 'Légende']
  },
  inputChars: ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'û', 'œ'],
  units: UNITS,
  theory: renderTheory,
  lessons: LESSONS,
  rounds: { lesson: lessonRound, boss: bossRound, quick: quickRound },
  blitz: blitzQuestion,
  badges: BADGES
};
