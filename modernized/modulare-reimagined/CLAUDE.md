# Neubau (modernized/modulare-reimagined)

Der Neubau hat dieselben Inhalte (`content/` im Repo-Root, gleiche JSON-Form) und dieselben Spielregeln.

- Grenzen: `regeln/` und `helfer/` importieren nicht aus `speicher/`, `komponenten/`, `seiten/`, `apps/` und nicht aus React. Nur `speicher/` greift auf IndexedDB und localStorage zu. Apps importieren nie aus anderen Apps. `grenzen`-Tests prüfen das.
- Zufall ist immer Parameter `rng`. Ohne `rng` gibt es keine Aufgabe. Gleicher Seed muss gleiche Aufgaben liefern.
- Eine App liefert `logic.js` mit `init`, `diagrams`, `rounds` (`lesson(unit, rng)`, `quick(rng)`, `boss(rng)`), `blitz(rng)` und optional `Theory` (React-Komponente mit `{ unit, config, onStart }`) und `bossUnlocked`.
- Befehle: `npm install`, `npm test` (node:test, alle Suiten inkl. Smoke über alle Live-Apps), `npm run build` (kopiert `content/` nach `public/content` und baut `dist/`), `npm run dev`, `npm run preview`.
