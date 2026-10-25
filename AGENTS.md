# AGENTS.md

Anweisungen für Coding-Agenten und Mitwirkende. Lies diese Datei vor jeder Änderung.

## Zweck

"Lernwerkstatt" ist eine Sammlung kleiner Lern-Apps für Sira (7. Klasse, Gymnasium Baden-Württemberg). Ein Dashboard (`index.html`) verlinkt alle Apps. Die Apps sollen motivieren: Theorie, direkt danach Übung, dazu Punkte, Sterne und Trophäen. Das Projekt wächst mit jeder neuen App, deshalb zählt Wartbarkeit mehr als Tempo.

## Technik

- Statische Seite, kein Build-Schritt, kein Framework. Vanilla JavaScript als ES-Module, CSS mit Custom Properties.
- Läuft über GitHub Pages (Branch `main`, Ordner `/`). Ein Push auf `main` veröffentlicht.
- ES-Module brauchen http(s). Lokal testen mit `npm run serve` und `http://localhost:8000`. Ein Doppelklick auf die HTML-Datei (file://) funktioniert nicht.
- Node (nur für Tests): `npm install`, `npm test`, `npm run smoke`.
- Alle Pfade im HTML und in Imports sind relativ, weil die Seite unter `/lernapp-sira/` liegt.
- Keine Laufzeit-Abhängigkeiten. Schriften kommen von Google Fonts. Neue externe Skripte nur nach Absprache.

## Struktur

```
index.html, dashboard.js, dashboard.css   Dashboard (Startseite)
registry.js                               Liste aller Apps, steuert die Kacheln
core/styles/   tokens.css  base.css  quiz.css   gemeinsames Design
core/js/       ui.js store.js profile.js quiz.js rounds.js shell.js icons.js mascot.js confetti.js
apps/<name>/   eine App: index.html, main.js, config.js, data.js, builders.js, theory.js, badges.js, app.css
apps/_template/ Vorlage für neue Apps (wird von den Tests geprüft)
tests/         Unit- und Vertragstests (node:test)
scripts/       smoke.mjs (Browser-Simulation mit jsdom)
```

Faustregel: Was mehr als eine App braucht, gehört nach `core/`. Was nur ein Fach betrifft, bleibt in `apps/<name>/`. Apps importieren aus `core/`, nie aus anderen Apps. `core/` kennt keine einzelne App.

## App-Vertrag

`apps/<name>/config.js` exportiert per `export default` ein Objekt. Es enthält keinen Browser-Code (kein `document`), damit es in Node testbar bleibt.

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `id` | ja | Stabil und eindeutig, Kleinbuchstaben mit Bindestrich. Bestimmt den Speicherschlüssel |
| `title`, `greeting`, `intro` | ja | Texte im Kopf der App |
| `units` | ja | Liste von `{ id, title, de, ic, color }`, die Seiten des Lernpfads |
| `theory(box, unit)` | ja | Schreibt die Theorie einer Seite in `box` |
| `rounds.lesson(unit)` | ja | Liefert die Fragen einer Übungsrunde |
| `rounds.quick()` | nein | Kurze Runde mit 5 Fragen |
| `rounds.boss()` | nein | Endgegner mit 12 Fragen. Frei, wenn alle Seiten mindestens einen Stern haben (anpassbar mit `bossUnlocked(state)`) |
| `blitz()` | nein | Liefert eine einzelne Frage für den 45-Sekunden-Blitz |
| `bossTitle` | nein | Name des Endgegners |
| `badges` | ja | Liste von `{ id, n, d, when(state, result) }` |

`main.js` ruft nur `mountApp(config, { header, main })` auf. Alles andere erledigt `core/js/shell.js`.

## Fragenformat

Ein Fragenobjekt wird von `core/js/quiz.js` gezeichnet. Die Tests prüfen es mit `assertValidQuestion` (`tests/helpers.js`).

- `kind`: `choice` (Auswahl), `type` (Eintippen) oder `match` (Zuordnen)
- Gemeinsam: `label`, `prompt`, `answer`, `why` (Erklärung nach der Antwort), optional `chip`, `sub`, `help`
- `choice`: `options` als `[{ id, html }]`, optional `optionsLayout: 'list'`
- `type`: optional `placeholder`, `accents` (Sonderzeichen-Leiste), `check(eingabe)` für eigene Prüfung
- `match`: `left`, `right`, optional `leftValues`
- Lücken im Text: `{{blank}}` im `prompt`

Alles, was in `html` oder `prompt` landet und aus Daten stammt, muss mit `esc()` aus `core/js/ui.js` maskiert werden.

## Speicher

- Alles liegt in `localStorage`, Namensraum `lernwerkstatt:`.
- `lernwerkstatt:profile`: Name, XP, Serie, letzte App, Tages-XP.
- `lernwerkstatt:app:<id>`: XP, Sterne je Seite, Trophäen, Bestwerte der App.
- Stores werden mit `createStore(key, defaults, { version, migrate })` angelegt. Wer die Form eines Stores ändert, erhöht `version` und schreibt eine Migration, damit vorhandener Fortschritt nicht verloren geht.
- `id` einer App und `id` von Seiten und Trophäen sind Teil der gespeicherten Daten. Sie werden nie umbenannt.
- Jeder Zugriff auf `localStorage` ist durch try/catch geschützt (steckt in `store.js`). Die App muss auch ohne Speicher laufen.

## Spielregeln (Gamification)

Die Zahlen stehen in `core/js/profile.js` und `rounds.js` und gelten für alle Apps gleich: Level-Schwelle 30·n·(n−1) XP, Combo-Faktor bis ×4, 5 Herzen (Boss 3), Sterne ab 70 % (2) und 90 % (3), Tagesziel 30 XP, Serie mit einem Gnadentag. Änderungen daran wirken auf alle Apps und brauchen angepasste Tests.

## Design

- Farben, Abstände und Radien kommen aus `core/styles/tokens.css`. Keine festen Farbwerte in App-CSS, außer der Akzentfarbe einer Seite (`unit.color`).
- Jede Ansicht muss in hell und dunkel funktionieren (`prefers-color-scheme`).
- `prefers-reduced-motion` respektieren, Animationen abschaltbar halten.
- Bedienbar mit Tastatur, sichtbarer Fokus, ausreichender Kontrast, Touch-Ziele mindestens 44 px. Wichtige Information nie nur über Farbe.
- Oberflächentexte auf Deutsch, du-Ansprache, freundlich, ohne Kindersprache. Zielalter 12 bis 13. Keine Emojis, Icons kommen aus `core/js/icons.js`.
- Eine App-spezifische Optik gehört in `apps/<name>/app.css` und baut auf den Tokens auf.

## Lehrplan

- Inhalt entspricht dem Gymnasium Baden-Württemberg, Klasse 7. Kein Stoff ab Klasse 8.
- Orientierung an den Lehrwerken: Lambacher Schweizer 7 (Mathe), Deutschbuch 7 / P.A.U.L. D. 7 (Deutsch), Green Line 3 / Access 3 (Englisch), Découvertes 2 (Französisch).
- Korrekte Fachbegriffe verwenden und kurz erklären.
- Jede Frage hat eine Erklärung (`why`), die den Denkfehler benennt. Keine Fragen, deren Antwort ohne Vorwissen zu erraten ist.
- Fachliche Richtigkeit ist wichtiger als Umfang. Im Zweifel eine Aufgabe weglassen.

## Neue App anlegen

1. `apps/_template/` nach `apps/<name>/` kopieren.
2. In `config.js` `id`, `title`, `greeting`, `intro` setzen. In `index.html` den `<title>`.
3. Inhalte in `data.js`, Fragen in `builders.js`, Theorie in `theory.js`, Trophäen in `badges.js` anpassen.
4. In `registry.js` den Eintrag auf `status: 'live'` setzen, `href` und `units` ergänzen (oder neuen Eintrag anlegen).
5. `npm test` und `npm run smoke` ausführen. Der Vertragstest prüft die Konfiguration und alle Fragen automatisch.
6. Lokal mit `npm run serve` ansehen: Theorie, eine Runde, Boss, hell und dunkel, schmales Fenster.

## Neue Seite, Trophäe oder Fragetyp

- Seite: Eintrag in `units`, Inhalte in `data.js`, `units` in `registry.js` erhöhen. Neue Seiten hinten anfügen, nicht umsortieren.
- Trophäe: Eintrag in `badges.js` mit neuer, nie verwendeter `id`.
- Fragetyp: erst in `core/js/quiz.js` und `quiz.css` umsetzen, dann in `tests/helpers.js` in die Prüfung aufnehmen, dann in einer App nutzen. Nie nur in einer App einen Sonderweg bauen.

## Code-Stil

- ES-Module, `const`/`let`, Pfeilfunktionen für kurze Callbacks, Semikolons, einfache Anführungszeichen.
- Kleine Funktionen mit einer Aufgabe. Daten (`data.js`) getrennt von Logik (`builders.js`) und Darstellung (`theory.js`).
- Kein `innerHTML` mit ungeprüften Daten. Event-Handling über `data-act` und die Delegation in `shell.js`, keine Inline-Handler.
- Kommentare erklären das Warum. Kommentare und Oberflächentexte sind Deutsch, Bezeichner Englisch oder Deutsch, aber je Datei einheitlich.
- Keine Funktionen mit Zufall ohne Möglichkeit, sie zu testen: Fragen werden aus Daten gebaut, die Tests prüfen jede mögliche Frage.

## Tests

- `npm test`: Unit- und Vertragstests ohne Abhängigkeiten. Sie müssen vor jedem Commit grün sein.
- `npm run smoke`: spielt in jsdom eine App durch (benötigt `npm install`).
- Neue Logik in `core/` bekommt einen Test. Neue Inhalte werden durch den Vertragstest abgedeckt.

## Deployment

Push auf `main`. GitHub Pages baut automatisch (Settings, Pages, Deploy from a branch, `main`, `/ (root)`). Bei 404 zuerst prüfen, ob Pages eingeschaltet ist, ob der Actions-Lauf "pages build and deployment" erfolgreich war und ob `index.html` im Wurzelverzeichnis liegt.

## Commits

Kurze, deutsche Betreffzeile im Präsens oder Perfekt ("Mathe-App ergänzt", "Boss-Freischaltung korrigiert"). Eine Änderung pro Commit, Tests vorher ausführen.

## Fallstricke

- Pfade immer relativ. Ein führender Slash bricht unter `/lernapp-sira/`.
- IDs in gespeicherten Daten nie ändern.
- Eingaben vergleichen über `norm()` und `stripAccents()`, nicht mit eigenem Vergleich.
- Zufall (`shuffle`, `pick`) nie so nutzen, dass die richtige Antwort immer an derselben Stelle steht.
- Sonderzeichen in Texten (Anführungszeichen, `<`, `&`) über `esc()` ausgeben.
- Nichts mit Namen oder personenbezogenen Daten ins Repo. Der Name von Sira liegt nur im lokalen Browserspeicher.

## Checkliste vor dem Commit

- [ ] `npm test` grün, `npm run smoke` grün
- [ ] Hell und dunkel angesehen, schmale Breite geprüft
- [ ] Keine neuen festen Farben, keine absoluten Pfade
- [ ] Inhalte passen zu Klasse 7 Gymnasium BW
- [ ] `registry.js` und `AGENTS.md` aktuell
