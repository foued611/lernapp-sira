# AGENTS.md

Anweisungen für Coding-Agenten und Mitwirkende. Lies diese Datei vor jeder Änderung.

## Zweck

"Lernwerkstatt" ist eine Sammlung kleiner Lern-Apps für Sira (7. Klasse, Gymnasium Baden-Württemberg). Ein Dashboard (`index.html`) verlinkt alle Apps. Die Apps sollen motivieren: Theorie, direkt danach Übung, dazu Punkte, Sterne und Trophäen. Das Projekt wächst mit jeder neuen App, deshalb zählt Wartbarkeit mehr als Tempo.

## Technik

- Framework und Build: React 19 mit Vite (Entscheidung 2026-10-26, siehe `analysis/modulare/INTENT.md`). Der Neubau liegt in `modernized/modulare-reimagined/` (Abschnitt "Neubau" unten). Der bisherige Code unter `core/`, `apps/`, `dashboard.js` bleibt, bis die Umstellung entschieden ist. TypeScript ist weiter nicht vorgesehen. Die Begründung steht in `docs/inhalte.md`.
- Daten und Logik sind getrennt: Inhalte liegen als JSON in `content/<id>/`, Code in `core/` und `apps/<name>/`. Siehe "Inhalte und Daten".
- Läuft über GitHub Pages (Branch `main`, Ordner `/`). Ein Push auf `main` veröffentlicht.
- ES-Module brauchen http(s). Lokal testen mit `npm run serve` und `http://localhost:8000`. Ein Doppelklick auf die HTML-Datei (file://) funktioniert nicht.
- Node (nur für Tests): `npm install`, `npm test`, `npm run smoke`.
- Alle Pfade im HTML und in Imports sind relativ, weil die Seite unter `/lernapp-sira/` liegt.
- Laufzeit-Abhängigkeiten nur, was der Umbau braucht (React). Der bisherige Code hat keine. Tests nutzen `fake-indexeddb`, `jsdom`, `esbuild`, `ajv`). Schriften liegen selbst gehostet in `core/fonts/` (WOFF2, Lizenzen OFL daneben), es gibt keine Anfragen an Google. Neue externe Skripte oder Dienste nur nach Absprache (Datenschutz, DSGVO).

## Struktur

```
index.html, dashboard.js, dashboard.css   Dashboard (Startseite)
registry.js                               Liste aller Apps, steuert die Kacheln
core/styles/   app.css (einziger Einstieg, bindet tokens, fonts, base, quiz, lesson ein)
core/fonts/    selbst gehostete Schriften mit Lizenzen
core/js/       db.js store.js profile.js rounds.js shell.js   Speicher, Spielregeln, App-Rahmen
               qtypes.js quiz.js blitz.js questions.js         Fragetypen, Rundenmotor, Blitz, Frage-Bausteine
               lesson.js svg.js theory.js                      Lektionen, Diagramme, Standard-Theorie
               content.js appconfig.js rules.js validate.js    Inhaltsquellen, Konfiguration aus Inhalten, Trophäen-Regeln, Paketprüfung
               boot.js                                         Startet eine App: laden, bauen, einhängen
               views/home.js result.js backup.js               Ansichten als reine HTML-Funktionen
               ui.js icons.js mascot.js confetti.js
content/<id>/  die Inhalte einer App als JSON: manifest.json, lessons.json, badges.json, data.json (optional)
schemas/       bundle.schema.json: JSON-Schema für ein Inhaltspaket (von den Tests mit Ajv geprüft)
apps/<name>/   eine App: index.html, main.js, logic.js, builders.js, diagrams.js, app.css, optional theory.js und smoke.mjs
apps/_template/ Vorlage für neue Apps (wird von den Tests geprüft)
tests/         Unit- und Vertragstests (node:test)
scripts/       smoke.mjs (Browser-Simulation mit jsdom)
```

Gemeinsame Rechenhelfer (Zahlen formatieren, tolerante Eingabeprüfung, Brüche) liegen in `core/js/mathkit.js` und dürfen von allen Mathe-nahen Apps genutzt werden.

Faustregel: Was mehr als eine App braucht, gehört nach `core/`. Was nur ein Fach betrifft, bleibt in `apps/<name>/`. Apps importieren aus `core/`, nie aus anderen Apps. `core/` kennt keine einzelne App.

## Neubau (modernized/modulare-reimagined)

Der Neubau hat dieselben Inhalte (`content/`, gleiche JSON-Form) und dieselben Spielregeln, aber eine andere Struktur:

```
regeln/      reine Spielregeln (XP, Serie, Fälligkeit, Trophäen), ohne Speicher und ohne Oberfläche
helfer/      Zufall mit Seed (createRng, shuffle, pick), Zahlen (rnd, fmt, nearby, numCheck)
runde/       Fragenbauer (choiceQuestion, typedQuestion, matchQuestion), Rundenmotor, Blitz, Textvergleich
inhalte/     Inhaltspaket prüfen, Konfiguration bauen (buildConfig), Quellen
speicher/    IndexedDB mit localStorage- und Arbeitsspeicher-Ausweichen, Sicherung, Altstand
komponenten/ React-Bausteine: Lektion, Theorie, Diagramme (svg.js), Minou, Symbole, Lernstränge
seiten/      Startseite, App-Rahmen (Runde starten, auswerten, speichern), Ergebnis, Sicherung
apps/<id>/   Logik einer Fach-App: builders.js, diagrams.js, logic.js, optional eigene Theorie (Theory)
apps/index.js  Zuordnung Kennung -> Logik (logicFor)
```

- Grenzen: `regeln/` und `helfer/` importieren nicht aus `speicher/`, `komponenten/`, `seiten/`, `apps/` und nicht aus React. Nur `speicher/` greift auf IndexedDB und localStorage zu. Apps importieren nie aus anderen Apps. `grenzen`-Tests prüfen das.
- Zufall ist immer Parameter `rng`. Ohne `rng` gibt es keine Aufgabe. Gleicher Seed muss gleiche Aufgaben liefern.
- Eine App liefert `logic.js` mit `init`, `diagrams`, `rounds` (`lesson(unit, rng)`, `quick(rng)`, `boss(rng)`), `blitz(rng)` und optional `Theory` (React-Komponente mit `{ unit, config, onStart }`) und `bossUnlocked`.
- Befehle: `npm install`, `npm test` (node:test, alle Suiten inkl. Smoke über alle Live-Apps), `npm run build` (kopiert `content/` nach `public/content` und baut `dist/`), `npm run dev`, `npm run preview`.

## Inhalte und Daten

Eine App besteht aus zwei Teilen, die sich nie mischen:

- **Inhalt** (`content/<id>/`): alles, was ein Redakteur oder später eine Datenbank liefern kann. Seiten, Lektionen, Trophäen, Merkzettel, Aufgabenpools. Nur JSON, kein Code.
- **Logik** (`apps/<name>/logic.js`): alles, was rechnet oder zeichnet. Aufgaben-Erzeuger, Diagramme, ein Theorie-Spielzeug. Kein Lernstoff als Text.

Das Inhaltspaket (`bundle`) hat immer dieselbe Form `{ manifest, lessons, badges, data }`, beschrieben in `schemas/bundle.schema.json` und `docs/inhalte.md`. Eine Quelle (`core/js/content.js`) liefert es: heute `createStaticSource` (JSON-Dateien), später `createHttpSource` (Datenbank-API), optional mit `withCache` für den Offline-Betrieb. `core/js/boot.js` lädt das Paket, `buildConfig` (`core/js/appconfig.js`) macht daraus die App-Konfiguration, `shell.js` zeigt sie an.

| Datei | Inhalt |
|---|---|
| `manifest.json` | `schema: 1`, `id`, `title`, `greeting`, `intro`, optional `bossTitle`, `words`, `inputChars`, `tracks` (Lernstränge, z. B. `lrs`: `{ label, desc? }`; Seiten und Material verweisen per `track` darauf und bekommen ein Etikett, Fragen zeigen es als `chip`), `resources` (Material zum Öffnen oder Ausdrucken, `{ title, desc?, track?, href }` mit relativem Pfad zur `index.html`, Dateien liegen in `apps/<name>/files/`); `units` (Seiten mit Karte), `notes` (Merkzettel je Seite) |
| `lessons.json` | Lektion je Seite (Teile siehe "Lektionen"). Bilder als Verweis `{ "diagram": { "name", "args" }, "caption" }` auf `logic.diagrams` |
| `badges.json` | Trophäen `{ id, n, d, rule }` mit einer deklarativen Regel (`anyUnit`, `unit`, `units`, `perfectRound`, `combo`, `blitz`, `boss`, `streak`, `all`, `any`), Beschreibung in `core/js/rules.js` |
| `data.json` | Aufgabendaten, deren Form die Logik der App festlegt (z. B. Faktenpools) |

Regeln:

- Neue Texte, Fragen und Fakten gehören nach `content/`, nicht in `.js`. Neue Rechenarten oder Diagramme gehören in `logic.js`.
- `logic.init({ data, manifest })` bekommt die Daten, bevor die erste Runde entsteht. Erzeuger lesen daraus, nie aus einem Import.
- Eine neue Trophäen-Regel ist ein neuer Eintrag in `TYPES` in `rules.js` plus Test, kein Code in den Daten.
- Inhalte, die später aus einer Datenbank kommen, dürfen kein ausführbares JavaScript enthalten. HTML-Felder (`html`) kommen aus vertrauenswürdigen Redaktionen und werden vor dem Einspielen geprüft.
- Der Ordnername in `content/` ist die App-`id`. `npm test` prüft jedes Paket gegen das Schema (Ajv) und die Querverweise.

## App-Vertrag

`buildConfig(bundle, logic)` erzeugt ein Konfigurationsobjekt ohne Browser-Code (kein `document`), das auch in Node testbar bleibt. Die Tabelle beschreibt dieses Objekt; die Felder kommen aus dem Inhaltspaket und aus `logic.js`.

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `id` | ja | Stabil und eindeutig, Kleinbuchstaben mit Bindestrich. Bestimmt den Speicherschlüssel |
| `title`, `greeting`, `intro` | ja | Texte im Kopf der App. `title` muss mit dem Titel in `registry.js` übereinstimmen (Test) |
| `inputChars` | nein | Sonderzeichen für die Leiste bei Eingabefragen, z. B. `['é','è','ç']`. Ohne Angabe gibt es keine Leiste |
| `units` | ja | Liste von `{ id, title, de, ic, color }`, die Seiten des Lernpfads |
| `theory(box, unit)` | ja | Schreibt die Theorie einer Seite in `box`. Nutzt dafür `lessonTop`, `lessonBottom` und `wireLesson` aus `core/js/lesson.js` |
| `lessons` | ja | `{ [unit.id]: Lektion }`, siehe "Lektionen" |
| `units[].card` | ja | `{ name, fact }` für das Sammelalbum: Titel und ein Fakt, den man sich gern merkt |
| `rounds.lesson(unit)` | ja | Liefert die Fragen einer Übungsrunde |
| `rounds.quick()` | nein | Kurze Runde mit 5 Fragen |
| `rounds.boss()` | nein | Endgegner mit 12 Fragen. Frei, wenn alle Seiten mindestens einen Stern haben (anpassbar mit `bossUnlocked(state)`) |
| `blitz()` | nein | Liefert eine einzelne Frage für den 45-Sekunden-Blitz |
| `bossTitle` | nein | Name des Endgegners |
| `words` | nein | Eigene Lob-Sprüche `praise`, Ergebnis-Titel `resultTitles` (für 1, 2, 3 Sterne), `blitzTitle` und `levelTitles`. Standard ist Deutsch |
| `badges` | ja | Liste von `{ id, n, d, when(state, result) }` |

`logic.js` exportiert per `export default`:

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `rounds` | ja | `{ lesson(unit), quick?(), boss?() }`, siehe Tabelle oben |
| `blitz` | nein | Funktion, die eine Frage liefert |
| `diagrams` | wenn Lektionen Diagramme nutzen | `{ name: (…args) => svgString }` |
| `init({ data, manifest })` | nein | Wird vor der ersten Runde aufgerufen |
| `theory(box, unit, ctx)` | nein | Eigene Theorie-Seite, sonst die Standard-Seite aus `core/js/theory.js`. `ctx` hat `lessons`, `notes`, `data`, `manifest`, `start` |
| `bossUnlocked(state)` | nein | Eigene Freischaltung des Endgegners |

`main.js` ruft nur `bootApp({ id, logic })` auf. `core/js/boot.js` lädt die Inhalte, baut die Konfiguration und startet `core/js/shell.js`; die Ansichten (Start, Ergebnis, Sicherung) liegen in `core/js/views/`. Mit `<meta name="lw-content-api" content="https://…">` in der `index.html` kommen die Inhalte stattdessen aus einer API.

## Fragenformat

Ein Fragenobjekt wird über das Register `core/js/qtypes.js` gezeichnet und geprüft, der Rundenablauf steckt in `core/js/quiz.js`. Die Tests prüfen jede Frage mit `assertValidQuestion` (`tests/helpers.js`), das den `validate` des jeweiligen Typs aufruft. Fragen baust du mit `choiceQuestion` und `typedQuestion` aus `core/js/questions.js`.

- `kind`: `choice` (Auswahl), `type` (Eintippen) oder `match` (Zuordnen)
- Gemeinsam: `label`, `prompt`, `answer`, `why` (Erklärung nach der Antwort), optional `chip`, `sub`, `help`
- `choice`: `options` als `[{ id, html }]`, optional `optionsLayout: 'list'`
- `type`: optional `placeholder`, `accents` (Sonderzeichen-Leiste), `check(eingabe)` für eigene Prüfung
- `match`: `left`, `right`, optional `leftValues`
- Lücken im Text: `{{blank}}` im `prompt`

Alles, was in `html` oder `prompt` landet und aus Daten stammt, muss mit `esc()` aus `core/js/ui.js` maskiert werden.

## Speicher

- Alles liegt in der Browser-Datenbank IndexedDB (`core/js/db.js`, Datenbank `lernwerkstatt`). Ist sie nicht verfügbar, wechselt die App selbstständig auf `localStorage` oder zuletzt auf den Arbeitsspeicher.
- Zwei Sammlungen: `docs` (JSON-Dokumente unter einem Schlüssel) und `log` (beliebige Ereignisse, z. B. jede beendete Runde mit App, Seite, Genauigkeit, Sternen).
- `lernwerkstatt:profile`: Name, XP, Serie, letzte App, Tages-XP. `lernwerkstatt:app:<id>`: XP, Sterne je Seite, Trophäen, Bestwerte der App.
- Das Schema ist offen. `createStore(key, defaults, { version, migrate })` ist asynchron (`await`), danach ist `store.state` synchron nutzbar, `store.save()` schreibt im Hintergrund. Gespeicherte Felder bleiben erhalten, neue Standardfelder werden beim Laden ergänzt (auch verschachtelt). Neue Felder brauchen deshalb keine Migration.
- Eine Migration (`version` erhöhen, `migrate(old, fromVersion)`) ist nur nötig, wenn sich die Bedeutung vorhandener Felder ändert.
- Eine neue Sammlung (z. B. für Karteikarten) braucht `DB_VERSION` in `db.js` plus einen Zweig in `upgrade()`. Bestehende Sammlungen nie umbauen.
- Daten aus dem früheren `localStorage` werden beim ersten Start automatisch übernommen und dort entfernt.
- Sicherung: Startseite jeder App, "Fortschritt sichern" lädt alles als JSON, "Sicherung einspielen" stellt es wieder her. Das schützt auch davor, dass Safari die Daten einer lange nicht genutzten Seite löscht.
- Ereignisse schreibst du mit `logEvent({ app, type, ... })`, liest sie mit `listEvents({ app, limit })`. Eigene Felder sind frei wählbar, `ts` kommt automatisch.
- `id` einer App und `id` von Seiten und Trophäen sind Teil der gespeicherten Daten. Sie werden nie umbenannt.
- Jeder Zugriff ist gegen Fehler abgesichert. Die App muss auch ohne Speicher laufen.

## Spielregeln (Gamification)

Die Zahlen stehen in `core/js/profile.js`, `rounds.js` und `quiz.js` und gelten für alle Apps gleich: Level-Schwelle 30·n·(n−1) XP, Combo-Faktor bis ×4, 5 Herzen (Boss 3), Sterne ab 70 % (2) und 90 % (3), Tagesziel 30 XP, Serie mit einem Gnadentag. Änderungen daran wirken auf alle Apps und brauchen angepasste Tests.

Die Mechaniken sind so gewählt, dass sie das Lernen fördern und nicht nur belohnen:

- **Zweiter Versuch:** Eine falsch beantwortete Frage kommt am Ende der Runde noch einmal (nicht im Endgegner, nicht bei Zuordnungen). Sie zählt nicht für Genauigkeit und Herzen, bringt aber 5 XP. Wiederholen nach dem Fehler festigt am meisten.
- **Auffrischen:** Eine Seite mit Sternen wird nach `DUE_DAYS` (3) Tagen als "Zeit zum Auffrischen" markiert. Wer sie dann übt, bekommt 10 Bonus-XP. Verteiltes Wiederholen bringt Wissen ins Langzeitgedächtnis. Dafür speichert die App `app.last[unitId]` (Tag) und `app.acc[unitId]` (letzte Genauigkeit).
- **Gezieltes Training:** Die Startseite schlägt die fällige oder schwächste Seite vor (`weakestUnit`).
- **Sammelalbum:** Jede Seite hat eine Karte mit einem Fakt. Sie wird mit 1, 2 oder 3 Sternen zu Bronze, Silber, Gold. So gibt es ein sichtbares Ziel pro Seite.
- **Mini-Check in der Lektion:** Eine Frage direkt nach der Theorie, ohne Druck und ohne XP. Sich selbst abfragen lernt besser als Nachlesen.
- **Ereignisprotokoll:** Jede Runde wird mit `logEvent` gespeichert. Daraus lassen sich später Verläufe und Wiederholungspläne bauen.

## Design

- Farben, Abstände und Radien kommen aus `core/styles/tokens.css`. Keine festen Farbwerte in App-CSS, außer der Akzentfarbe einer Seite (`unit.color`).
- Jede Ansicht muss in hell und dunkel funktionieren (`prefers-color-scheme`).
- `prefers-reduced-motion` respektieren, Animationen abschaltbar halten.
- Bedienbar mit Tastatur, sichtbarer Fokus, ausreichender Kontrast, Touch-Ziele mindestens 44 px. Wichtige Information nie nur über Farbe.
- Oberflächentexte auf Deutsch, du-Ansprache, freundlich, ohne Kindersprache. Zielalter 12 bis 13. Keine Emojis, Icons kommen aus `core/js/icons.js`.
- Theorie-Seiten nutzen `.tcard`, `.thead`, `.notes` und `.note` aus `core/styles/base.css`.
- Eine App-spezifische Optik gehört in `apps/<name>/app.css` und baut auf den Tokens auf.

## Lektionen

Jede Seite hat eine Lektion in `content/<id>/lessons.json`, gezeichnet mit `core/js/lesson.js`. Die Reihenfolge ist für alle Apps gleich und folgt dem, wie 12- bis 13-Jährige lernen: erst Ziel, dann Bild, dann selbst tun.

| Teil | Zweck |
|---|---|
| `goal` | "Du kannst danach …": ein Satz, was die Seite bringt |
| `tldr` | 2 bis 4 kurze Sätze, "In 30 Sekunden" |
| `analogy` | Vergleich aus dem Alltag ("Stell dir vor: …") |
| `figure` | Diagramm mit Bildunterschrift: Verweis `{ diagram: { name, args } }` auf `logic.diagrams` (oder fertiges `svg`) |
| Spielzeug | Etwas zum Anklicken oder Eintippen (Lampen, Regler, Tabelle). Nur in der App, kein Pflichtfeld |
| `steps` | Ein durchgerechnetes Beispiel, Schritt für Schritt aufklappbar |
| `pitfall`, `rule` | Typische Falle und ein Merksatz |
| `check` | Mini-Check mit drei oder vier Antworten und Erklärung |

Regeln für Texte und Bilder:

- Kurze Sätze, du-Ansprache, ein Beispiel pro Gedanke. Fachwort fett, dann sofort erklären.
- Diagramme entstehen als Text-SVG mit den Helfern aus `core/js/svg.js` (kein Bild-Upload, keine externen Bilder). Farben nur über die CSS-Klassen aus `core/styles/lesson.css` (`box`, `hi`, `acc`, `off`, `mu` …), damit sie in hell und dunkel passen.
- Jedes Diagramm braucht `role="img"` und einen aussagekräftigen `aria-label` (macht `svg()` automatisch, wenn du ihn angibst).
- Zahlen im Diagramm werden berechnet, nicht von Hand getippt. So können sie nicht von den Aufgaben abweichen.
- Der Vertragstest (`assertValidLesson`) prüft alle Pflichtteile und ob jedes SVG gültiges XML ist.

## Lehrplan

- Inhalt entspricht dem Gymnasium Baden-Württemberg, Klasse 7. Kein Stoff ab Klasse 8.
- Orientierung an den Lehrwerken: Lambacher Schweizer 7 (Mathe), deutsch.ideen 7 Baden-Württemberg (Deutsch, Siras Buch; Abgleich in `docs/lehrplan-deutsch.md`), Green Line 3 / Access 3 (Englisch), Découvertes 2 (Französisch).
- Der Abgleich der Mathe-App mit dem Bildungsplan steht in `docs/lehrplan-mathe.md`. Dort ist auch vermerkt, was nicht amtlich geprüft ist. Neue Themen dort eintragen.
- Korrekte Fachbegriffe verwenden und kurz erklären.
- Jede Frage hat eine Erklärung (`why`), die den Denkfehler benennt. Keine Fragen, deren Antwort ohne Vorwissen zu erraten ist.
- Fachliche Richtigkeit ist wichtiger als Umfang. Im Zweifel eine Aufgabe weglassen.

## Neue App anlegen

Im Neubau: `apps/_template/` nach `apps/<id>/` kopieren, `content/vorlage/` nach `content/<id>/`, Logik in `apps/index.js` eintragen, `status: 'live'` in `seiten/registry.js`. `apps/tests/smoke.test.js` und `apps/tests/endgegner.test.js` prüfen die App automatisch.

Im bisherigen Code (bis zur Umstellung):

1. `apps/_template/` nach `apps/<name>/` und `content/vorlage/` nach `content/<id>/` kopieren.
2. In `content/<id>/manifest.json` `id`, `title`, `greeting`, `intro` setzen, in `main.js` dieselbe `id`, in `index.html` den `<title>`.
3. Seiten und Merkzettel im Manifest, Lektionen in `lessons.json`, Trophäen in `badges.json`, Aufgabendaten in `data.json` anpassen. Fragen-Erzeuger in `builders.js`, Diagramme in `diagrams.js`.
4. In `registry.js` den Eintrag auf `status: 'live'` setzen, `href` und `units` ergänzen (oder neuen Eintrag anlegen).
5. `npm test` und `npm run smoke` ausführen. Der Vertragstest prüft die Konfiguration und alle Fragen automatisch.
6. Lokal mit `npm run serve` ansehen: Theorie, eine Runde, Boss, hell und dunkel, schmales Fenster.

## Neue Seite, Trophäe oder Fragetyp

- Seite: Eintrag in `manifest.json` (`units`, `notes`), Lektion in `lessons.json`, Aufgaben in `data.json`/`builders.js`, `units` in `registry.js` erhöhen. Neue Seiten hinten anfügen, nicht umsortieren.
- Trophäe: Eintrag in `badges.json` mit neuer, nie verwendeter `id` und einer Regel.
- Fragetyp: In `core/js/qtypes.js` mit `registerQuestionType('name', { validate, render, canCheck, grade, init?, actions?, onInput?, onKey? })` anmelden (Beschreibung am Dateianfang), Stil in `quiz.css`, Test in `tests/qtypes.test.js`. `quiz.js`, `shell.js` und `tests/helpers.js` bleiben unverändert, die Tests prüfen den neuen Typ automatisch über sein `validate`. Nie nur in einer App einen Sonderweg bauen.

## Code-Stil

- ES-Module, `const`/`let`, Pfeilfunktionen für kurze Callbacks, Semikolons, einfache Anführungszeichen.
- Kleine Funktionen mit einer Aufgabe. Inhalt (`content/`) getrennt von Logik (`logic.js`, `builders.js`) und Darstellung (`core/js/views`, `theory.js`).
- Kein `innerHTML` mit ungeprüften Daten. Event-Handling über `data-act` und die Delegation in `shell.js` bzw. `quiz.js`, keine Inline-Handler.
- Kommentare erklären das Warum. Kommentare und Oberflächentexte sind Deutsch, Bezeichner Englisch oder Deutsch, aber je Datei einheitlich.
- Keine Funktionen mit Zufall ohne Möglichkeit, sie zu testen: Fragen werden aus Daten gebaut, die Tests prüfen jede mögliche Frage.

## Tests

- `npm test` im Neubau (`modernized/modulare-reimagined`): alle Suiten, derzeit 614 Tests. Sie müssen vor jedem Commit grün sein. Im Legacy-Code: Unit- und Vertragstests ohne Abhängigkeiten.
- `npm run smoke`: spielt in jsdom alle Apps aus `registry.js` durch (benötigt `npm install`). App-spezifische Prüfungen liegen in `apps/<name>/smoke.mjs` und werden automatisch gefunden. Eine neue App braucht keine Änderung am Skript.
- `tests/db.test.js` prüft den Speicher mit einer simulierten IndexedDB. Der Durchspiel-Test deckt IndexedDB und die Übernahme alter Daten ab.
- `tests/qtypes.test.js` und `tests/views.test.js` decken Fragetypen und Ansichten ab.
- Neue Logik in `core/` bekommt einen Test. Neue Inhalte werden durch den Schema- und Vertragstest (`tests/content.test.js`, `tests/contract.test.js`) abgedeckt.
- `tests/helpers.js` baut Konfigurationen mit `loadAppConfig(id, ordner)` auf demselben Weg wie der Browser, nur mit Dateien statt `fetch`. Der Durchspiel-Test ersetzt `fetch` im Browser-Fenster durch denselben Dateizugriff.

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
