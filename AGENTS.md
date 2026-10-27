# AGENTS.md

Anweisungen für Coding-Agenten und Mitwirkende. Lies diese Datei vor jeder Änderung.

## Zweck

"Lernwerkstatt" ist eine Sammlung kleiner Lern-Apps für die 7. Klasse, Gymnasium Baden-Württemberg). Ein Dashboard (`index.html`) verlinkt alle Apps. Die Apps sollen motivieren: Theorie, direkt danach Übung, dazu Punkte, Sterne und Trophäen. Das Projekt wächst mit jeder neuen App, deshalb zählt Wartbarkeit mehr als Tempo.

## Technik

- Framework und Build: React 19 mit Vite (Entscheidung 2026-10-26, siehe `analysis/modulare/INTENT.md`). Der Neubau liegt in `modernized/modulare-reimagined/`, seine Regeln in `modernized/modulare-reimagined/CLAUDE.md`. Der bisherige Code (`core/`, `apps/`, `dashboard.js`) ist seit 2026-10-27 aus `main` entfernt und im Branch `legacy` erhalten. TypeScript ist weiter nicht vorgesehen. Die Begründung steht in `docs/inhalte.md`.
- Daten und Logik sind getrennt: Inhalte liegen als JSON in `content/<id>/`, Code in `core/` und `apps/<name>/`. Siehe "Inhalte und Daten".
- Läuft über GitHub Pages (Branch `main`, Ordner `/`). Ein Push auf `main` veröffentlicht.
- ES-Module brauchen http(s). Lokal testen mit `npm run serve` und `http://localhost:8000`. Ein Doppelklick auf die HTML-Datei (file://) funktioniert nicht.
- Node (nur für Tests): `npm install`, `npm test`.
- Alle Pfade im HTML und in Imports sind relativ, weil die Seite unter `/lernapp-sira/` liegt.
- Schriften liegen selbst gehostet in `core/fonts/` (WOFF2, Lizenzen OFL daneben), es gibt keine Anfragen an Google. Neue externe Skripte oder Dienste nur nach Absprache (Datenschutz, DSGVO).

## Neubau

Die Regeln des Neubaus (Grenzen, Zufall, App-Vertrag, Befehle) stehen in `modernized/modulare-reimagined/CLAUDE.md`. Sie gelten nur beim Arbeiten in diesem Ordner.

## Inhalte und Daten

Eine App besteht aus zwei Teilen, die sich nie mischen:

- **Inhalt** (`content/<id>/`): alles, was ein Redakteur oder später eine Datenbank liefern kann. Seiten, Lektionen, Trophäen, Merkzettel, Aufgabenpools. Nur JSON, kein Code.
- **Logik** (`apps/<name>/logic.js`): alles, was rechnet oder zeichnet. Aufgaben-Erzeuger, Diagramme, ein Theorie-Spielzeug. Kein Lernstoff als Text.

Das Inhaltspaket (`bundle`) hat immer dieselbe Form `{ manifest, lessons, badges, data }`, beschrieben in `schemas/bundle.schema.json` und `docs/inhalte.md`. Eine Quelle (`core/js/content.js`) liefert es: heute `createStaticSource` (JSON-Dateien), später `createHttpSource` (Datenbank-API), optional mit `withCache` für den Offline-Betrieb. `core/js/boot.js` lädt das Paket, `buildConfig` (`core/js/appconfig.js`) macht daraus die App-Konfiguration, `shell.js` zeigt sie an.

Regeln:

- Neue Texte, Fragen und Fakten gehören nach `content/`, nicht in `.js`. Neue Rechenarten oder Diagramme gehören in `logic.js`.
- `logic.init({ data, manifest })` bekommt die Daten, bevor die erste Runde entsteht. Erzeuger lesen daraus, nie aus einem Import.
- Eine neue Trophäen-Regel ist ein neuer Eintrag in `TYPES` in `rules.js` plus Test, kein Code in den Daten.
- Inhalte, die später aus einer Datenbank kommen, dürfen kein ausführbares JavaScript enthalten. HTML-Felder (`html`) kommen aus vertrauenswürdigen Redaktionen und werden vor dem Einspielen geprüft.
- Der Ordnername in `content/` ist die App-`id`. `npm test` prüft jedes Paket gegen das Schema (Ajv) und die Querverweise.

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

Die Zahlen stehen in `core/js/profile.js`, `rounds.js` und `quiz.js` und gelten für alle Apps gleich: Level-Schwelle 30·n·(n−1) XP, Combo-Faktor bis ×4, 5 Herzen (Boss 3), Sterne ab 70 % (2) und 90 % (3), Tagesziel nach Wahl der Lernenden (20, 30 oder 50 XP, Standard 30), Serie mit einem Gnadentag. Änderungen daran wirken auf alle Apps und brauchen angepasste Tests.

Die Mechaniken sind so gewählt, dass sie das Lernen fördern und nicht nur belohnen:

- **Zweiter Versuch:** Eine falsch beantwortete Frage kommt am Ende der Runde noch einmal (nicht im Endgegner, nicht bei Zuordnungen). Sie zählt nicht für Genauigkeit und Herzen, bringt aber 5 XP. Wiederholen nach dem Fehler festigt am meisten.
- **Auffrischen:** Eine Seite mit Sternen wird nach 3 Tagen (`DUE_DAYS`) als "Zeit zum Auffrischen" markiert, bei einer letzten Genauigkeit von mindestens 90 % erst nach 7 Tagen (`DUE_DAYS_STRONG`). Wer sie dann übt, bekommt 10 Bonus-XP. Verteiltes Wiederholen bringt Wissen ins Langzeitgedächtnis. Dafür speichert die App `app.last[unitId]` (Tag) und `app.acc[unitId]` (letzte Genauigkeit).
- **Wochenmissionen:** Pro Woche (ab Montag) gibt es drei Missionen: drei verschiedene Seiten üben, eine Seite auffrischen, eine Runde mit mindestens 90 % Genauigkeit. Jede bringt 20 XP und wird pro Woche nur einmal bezahlt. Ein Blitz zählt nicht für die Runde mit 90 %, weil er keine echte Genauigkeit hat.
- **Neue Trophäen-Typen:** `improved` (Genauigkeit einer Seite gegenüber dem letzten Mal um einen Mindestwert gestiegen), `retryRecovered` (Fehler der Runde im zweiten Versuch richtig beantwortet) und `refresh` (Zahl bezahlter Auffrischungen).
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
- Orientierung an den Lehrwerken: Lambacher Schweizer 7 (Mathe), deutsch.ideen 7 Baden-Württemberg (Deutsch, Schulbuch; Abgleich in `docs/lehrplan-deutsch.md`), Green Line 3 / Access 3 (Englisch), Découvertes 2 (Französisch).
- Der Abgleich der Mathe-App mit dem Bildungsplan steht in `docs/lehrplan-mathe.md`. Dort ist auch vermerkt, was nicht amtlich geprüft ist. Neue Themen dort eintragen.
- Korrekte Fachbegriffe verwenden und kurz erklären.
- Jede Frage hat eine Erklärung (`why`), die den Denkfehler benennt. Keine Fragen, deren Antwort ohne Vorwissen zu erraten ist.
- Fachliche Richtigkeit ist wichtiger als Umfang. Im Zweifel eine Aufgabe weglassen.

## Neue App anlegen

Im Neubau: `apps/_template/` nach `apps/<id>/` kopieren, `content/vorlage/` nach `content/<id>/`, Logik in `apps/index.js` eintragen, `status: 'live'` in `seiten/registry.js`. `apps/tests/smoke.test.js` und `apps/tests/endgegner.test.js` prüfen die App automatisch.

Der bisherige Code ist aus `main` entfernt (Branch `legacy`). Neue Apps nur im Neubau anlegen.

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

- `npm test` im Neubau (`modernized/modulare-reimagined`) muss vor jedem Commit grün sein.
- Neue Logik bekommt einen Test. Neue Inhalte werden durch den Schema- und Vertragstest geprüft.

## Deployment

Push auf `main`. GitHub Pages baut automatisch (Settings, Pages, Deploy from a branch, `main`, `/ (root)`). Bei 404 zuerst prüfen, ob Pages eingeschaltet ist, ob der Actions-Lauf "pages build and deployment" erfolgreich war und ob `index.html` im Wurzelverzeichnis liegt.

## Commits

Kurze, deutsche Betreffzeile im Präsens oder Perfekt ("Mathe-App ergänzt", "Boss-Freischaltung korrigiert"). Eine Änderung pro Commit, Tests vorher ausführen.

## Fallstricke

- Pfade immer relativ. Ein führender Slash bricht unter `/lernapp-sira/`.
- IDs in gespeicherten Daten nie ändern.
- Eingaben vergleichen über `norm()` und `stripAccents()`, nicht mit eigenem Vergleich.
- Zufall (`shuffle`, `pick`) nie so nutzen, dass die richtige Antwort immer an derselben Stelle steht.
- Sonderzeichen in Texten (Anführungszeichen, `<`, `&`) über `esc()` ausgeben. Das gilt auch für alles, was aus Daten in `html` oder `prompt` landet.
- Nichts mit Namen oder personenbezogenen Daten ins Repo. Namen von Lernenden liegen nur im lokalen Browserspeicher.

## Checkliste vor dem Commit

- [ ] `npm test` grün
- [ ] Hell und dunkel angesehen, schmale Breite geprüft
- [ ] Keine neuen festen Farben, keine absoluten Pfade
- [ ] Inhalte passen zu Klasse 7 Gymnasium BW
- [ ] `registry.js` und `AGENTS.md` aktuell
