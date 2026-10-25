// App-Konfiguration (App-Vertrag, siehe AGENTS.md). Enthält keinen Browser-Code.
import { UNITS } from './data.js';
import { lessonRound, quickRound, blitzQuestion } from './builders.js';
import { renderTheory } from './theory.js';
import { BADGES } from './badges.js';

export default {
  id: 'vorlage',                // eindeutig, Kleinbuchstaben und Bindestrich; bestimmt den Speicherschlüssel
  title: 'Neue Lern-App',
  greeting: 'Hallo',
  intro: 'Starte irgendwo. Die Reihenfolge ist nur ein Vorschlag.',
  units: UNITS,
  theory: renderTheory,
  rounds: { lesson: lessonRound, quick: quickRound },   // boss ist optional
  blitz: blitzQuestion,                                // optional
  badges: BADGES
};
