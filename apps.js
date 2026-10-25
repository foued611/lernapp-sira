/*
  Register aller Lern-Apps. Das Dashboard (index.html) liest diese Liste.

  Neue App hinzufügen:
  1. Ordner anlegen: apps/<name>/index.html
  2. Unten einen Eintrag ergänzen (status: 'live').
  3. Optional: storageKey und progress() angeben, damit das Dashboard den Fortschritt zeigt.
     progress(data) bekommt die gespeicherten Daten der App und liefert:
     { pct: 0..1, label: 'Text', xp: Zahl, name: 'Name', streak: Zahl, lastDay: 'JJJJ-MM-TT', day: {d:'JJJJ-MM-TT', xp: Zahl}, badges: Zahl }
*/
window.APPS = [
  {
    id: 'fr-verben',
    subject: 'Französisch',
    title: 'Cahier de Verbes',
    desc: 'être, avoir, aller, faire und die regelmäßigen Verben im Présent. Erst Theorie, dann sofort üben.',
    href: 'apps/franzoesisch-verben/index.html',
    status: 'live',
    storageKey: 'cahier-de-verbes-v1',
    progress: function (d) {
      var done = Object.keys(d.stars || {}).filter(function (k) { return d.stars[k] > 0; }).length;
      return {
        pct: done / 6,
        label: done + ' von 6 Seiten',
        xp: d.xp || 0,
        name: d.name || '',
        streak: d.streak || 0,
        lastDay: d.lastDay || '',
        day: d.day || { d: '', xp: 0 },
        badges: Object.keys(d.badges || {}).length
      };
    }
  },
  { id: 'mathe', subject: 'Mathematik', title: 'Mathe-App', desc: 'Rationale Zahlen, Terme und Gleichungen.', status: 'soon' },
  { id: 'deutsch', subject: 'Deutsch', title: 'Deutsch-App', desc: 'Textanalyse, Inhaltsangabe und Grammatik.', status: 'soon' },
  { id: 'englisch', subject: 'Englisch', title: 'Englisch-App', desc: 'Wortschatz und Grammatik.', status: 'soon' },
  { id: 'informatik', subject: 'Informatik', title: 'Informatik-App', desc: 'Algorithmen, Daten und erstes Programmieren.', status: 'soon' },
  { id: 'physik', subject: 'Physik', title: 'Physik-App', desc: 'Experimente, Messen und Kräfte.', status: 'soon' }
];

window.SUBJECT_COLORS = {
  'Französisch': '#9B7BFF',
  'Mathematik': '#4CC3F5',
  'Deutsch': '#FF6B88',
  'Englisch': '#3DD6B0',
  'Informatik': '#FF9F43',
  'Physik': '#8BD450'
};
