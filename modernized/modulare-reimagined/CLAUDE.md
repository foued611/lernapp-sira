# Neubau (modernized/modulare-reimagined)

Der Neubau hat dieselben Inhalte (`content/` im Repo-Root, gleiche JSON-Form) und dieselben Spielregeln.

- Grenzen: `regeln/` und `helfer/` importieren nicht aus `speicher/`, `komponenten/`, `seiten/`, `apps/` und nicht aus React. Nur `speicher/` greift auf IndexedDB und localStorage zu. Apps importieren nie aus anderen Apps. `seiten/ablauf.js` läuft ohne React. Andere Schichten importieren `helfer/`, `regeln/`, `speicher/`, `inhalte/` und `runde/` nur über deren `index.js`. `builders.js` erreicht React auch nicht über Umwege. `seiten/tests/schichten.test.js` und die `grenzen`-Tests prüfen das.
- Zufall ist immer Parameter `rng`. Ohne `rng` gibt es keine Aufgabe. Gleicher Seed muss gleiche Aufgaben liefern.
- Eine App liefert `logic.js` mit `create({ data, manifest })`. Das gibt `rounds` (`lesson(unit, rng)`, `quick(rng)`, `boss(rng)`, optional `recall(unit, skills, rng)`), `blitz(rng)` und bei Bedarf `diagrams` und `Theory` (React-Komponente mit `{ unit, config, onStart }`) zurück. Kein Stand im Modul: zwei Pakete dürfen dieselbe Logik nutzen. `diagrams`, `Theory` und `bossUnlocked` dürfen auch fest am Modul stehen. `bossUnlocked` gilt nur in der App, die Startseite kennt die Logik nicht.
- Steht der Stoff ganz in `data.items`, reicht `poolApp({ diagrams })` aus `runde/`, eigene `builders.js` entfallen. Englisch und Französisch bauen mit `createPool` darauf auf.
- Befehle: `npm install`, `npm test` (node:test, alle Suiten inkl. Smoke über alle Live-Apps), `npm run build` (kopiert `content/` nach `public/content`, baut `katalog.json` aus den Manifesten und dann `dist/`), `npm run dev` (kopiert ebenfalls), `npm run preview`.
- Der Katalog ist Feld `catalog` im Manifest, nie eine Liste von Hand. `apps/index.js` lädt Logik und CSS erst beim Öffnen, `apps/tests/katalog.test.js` prüft beide Listen gegeneinander.
