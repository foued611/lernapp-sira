// Register aller Lern-Apps. Das Dashboard (index.html) baut daraus seine Kacheln.
// Neue App: Ordner apps/<name>/ anlegen, hier einen Eintrag ergänzen. Details in AGENTS.md.
//
// id        eindeutig und stabil. Daraus entsteht der Speicherschlüssel (siehe core/js/profile.js)
// subject   Fach, bestimmt Farbe und Filter
// units     Anzahl der Lernpfad-Seiten, für die Fortschrittsanzeige
// status    'live' (verlinkt) oder 'soon' (Platzhalter)

export const SUBJECT_COLORS = {
  Französisch: '#9B7BFF',
  Mathematik: '#4CC3F5',
  Deutsch: '#FF6B88',
  Englisch: '#3DD6B0',
  Informatik: '#FF9F43',
  Physik: '#8BD450'
};

export const APPS = [
  {
    id: 'fr-verben',
    subject: 'Französisch',
    title: 'Cahier de Verbes',
    desc: 'être, avoir, aller, faire und die regelmäßigen Verben im Présent. Erst Theorie, dann sofort üben.',
    href: 'apps/franzoesisch-verben/index.html',
    units: 6,
    status: 'live'
  },
  {
    id: 'mathe',
    subject: 'Mathematik',
    title: 'Mathe-Werkstatt',
    desc: 'Vorzeichen, Terme, Gleichungen, Prozente, Zinsen, Dreisatz, Daten und Zufall. Mit Waage, Zahlenstrahl und Kacheln erklärt.',
    href: 'apps/mathe/index.html',
    units: 9,
    status: 'live'
  },
  {
    id: 'geometrie',
    subject: 'Mathematik',
    title: 'Geometrie-Werkstatt',
    desc: 'Mittelsenkrechte, Winkelhalbierende, Dreiecke konstruieren, Winkel, Thales, Umkreis und Inkreis.',
    href: 'apps/geometrie/index.html',
    units: 8,
    status: 'live'
  },
  { id: 'englisch', subject: 'Englisch', title: 'Englisch-App', desc: 'Wortschatz und Grammatik.', status: 'soon' },
  {
    id: 'info-zahlen',
    subject: 'Informatik',
    title: 'Zahlenwerkstatt',
    desc: 'Binär und Hexadezimal: Lampen schalten, umrechnen und addieren wie ein Computer.',
    href: 'apps/informatik/index.html',
    units: 6,
    status: 'live'
  },
  {
    id: 'deutsch',
    subject: 'Deutsch',
    title: 'Deutsch-Werkstatt',
    desc: 'Inhaltsangabe, Adverbialsätze, Kommas, das und dass, Passiv, sprachliche Bilder, Rechtschreibung und Lesen.',
    href: 'apps/deutsch/index.html',
    units: 15,
    status: 'live'
  },
  { id: 'physik', subject: 'Physik', title: 'Physik-App', desc: 'Experimente, Messen und Kräfte.', status: 'soon' }
];
