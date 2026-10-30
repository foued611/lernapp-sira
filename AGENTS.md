# AGENTS.md

Anweisungen für Coding-Agenten und Mitwirkende. Lies diese Datei vor jeder Änderung.

## Zweck

"Lernwerkstatt" ist eine Sammlung kleiner Lern-Apps für die 7. Klasse, Gymnasium Baden-Württemberg). Die Startseite (`seiten/startseite.js`) verlinkt alle Apps. Die Apps sollen motivieren: Theorie, direkt danach Übung, dazu Punkte, Sterne und Trophäen. Das Projekt wächst mit jeder neuen App, deshalb zählt Wartbarkeit mehr als Tempo.

## Technik

- Framework und Build: React 19 mit Vite (Entscheidung 2026-10-26, siehe `analysis/modulare/INTENT.md`). Der Neubau liegt in `modernized/modulare-reimagined/`, seine Regeln in `modernized/modulare-reimagined/CLAUDE.md`. Der bisherige Code (`core/`, `apps/`, `dashboard.js`) ist seit 2026-10-28 aus `main` entfernt und im Branch `legacy` erhalten. TypeScript ist weiter nicht vorgesehen. Die Begründung steht in `docs/inhalte.md`.
- Daten und Logik sind getrennt: Inhalte liegen als JSON in `content/<id>/`, Code in `modernized/modulare-reimagined/`. Siehe "Inhalte und Daten".
- Läuft über GitHub Pages. Ein Push auf `main` veröffentlicht (`.github/workflows/pages.yml`).
- ES-Module brauchen http(s). Lokal testen im Neubau mit `npm run dev`. Ein Doppelklick auf die HTML-Datei (file://) funktioniert nicht.
- Node (Tests und Build): `npm install`, `npm test`, `npm run build`, alles im Neubau.
- Alle Pfade im HTML und in Imports sind relativ, weil die Seite unter `/lernapp-sira/` liegt.
- Schriften liegen selbst gehostet in `seiten/design/fonts/` (WOFF2, Lizenzen OFL daneben), es gibt keine Anfragen an Google. Neue externe Skripte oder Dienste nur nach Absprache (Datenschutz, DSGVO).

## Klassen

Die App ist für weitere Klassen vorbereitet. So kommt neuer Stoff dazu:

- Eine App ist ein Lehrwerk-Band. Lambacher Schweizer 8 wird die neue App `mathe-8`. Ein Doppelband wie Biosphäre 7/8 bleibt eine App und bekommt weitere Kapitel.
- Bestehende Kennungen bleiben. `mathe` ist und bleibt der Band für Klasse 7, sonst ginge der Lernstand verloren.
- `catalog` im Manifest: `fach` (feste Kennung, Apps eines Fachs stehen zusammen), `klassen` (dort erscheint die App), `lehrwerk`.
- `groups[].klasse` ist optional. Es markiert ein Kapitel, das nicht zu `klassen` der App gehört, zum Beispiel Wiederholung aus Klasse 6.
- Die Klasse ist kein einzelner Wert je App, weil der Bildungsplan BW Klasse 7 und 8 als Doppelstufe führt.
- Die Klassenwahl auf der Startseite erscheint erst, wenn der Katalog mehr als eine Klasse enthält. Sie steht in `profile.klasse`. Apps früherer Klassen bleiben eingeklappt erreichbar.

## Neubau

Die Regeln des Neubaus (Grenzen, Zufall, App-Vertrag, Befehle) stehen in `modernized/modulare-reimagined/CLAUDE.md`. Sie gelten nur beim Arbeiten in diesem Ordner.

## Inhalte und Daten

Eine App besteht aus zwei Teilen, die sich nie mischen:

- **Inhalt** (`content/<id>/`): alles, was ein Redakteur oder später eine Datenbank liefern kann. Seiten, Lektionen, Trophäen, Merkzettel, Aufgabenpools. Nur JSON, kein Code.
- **Logik** (`apps/<name>/logic.js`): alles, was rechnet oder zeichnet. Aufgaben-Erzeuger, Diagramme, ein Theorie-Spielzeug. Kein Lernstoff als Text.

Das Inhaltspaket (`bundle`) hat immer dieselbe Form `{ manifest, lessons, badges, data }`, beschrieben in `schemas/bundle.schema.json` und `docs/inhalte.md`. Eine Quelle (`inhalte/src/source.js`) liefert es: heute `createStaticSource` (JSON-Dateien), später `createHttpSource` (Datenbank-API), optional mit `withCache` für den Offline-Betrieb. `seiten/boot.js` lädt das Paket, `buildConfig` (`inhalte/src/appconfig.js`) macht daraus die App-Konfiguration, `seiten/rahmen.js` zeigt sie an.

Regeln:

- Neue Texte, Fragen und Fakten gehören nach `content/`, nicht in `.js`. Neue Rechenarten oder Diagramme gehören in `logic.js`.
- `logic.create({ data, manifest })` bekommt die Daten, bevor die erste Runde entsteht, und baut die Erzeuger für genau dieses Paket. Kein Stand im Modul, sonst stören sich Klassenstufen mit gleicher Logik.
- Eine neue Trophäen-Regel ist ein neuer Eintrag in `TYPES` in `regeln/src/trophies.js` plus Test, kein Code in den Daten.
- Inhalte, die später aus einer Datenbank kommen, dürfen kein ausführbares JavaScript enthalten. HTML-Felder (`html`) kommen aus vertrauenswürdigen Redaktionen und werden vor dem Einspielen geprüft.
- Der Ordnername in `content/` ist die App-`id`. `npm test` prüft jedes Paket gegen das Schema (Ajv) und die Querverweise.

## Speicher

- Alles liegt in der Browser-Datenbank IndexedDB (`speicher/src/backend-idb.js`, Datenbank `lernwerkstatt`). Ist sie nicht verfügbar, wechselt die App selbstständig auf `localStorage` oder zuletzt auf den Arbeitsspeicher.
- Zwei Sammlungen: `docs` (JSON-Dokumente unter einem Schlüssel) und `log` (beliebige Ereignisse, z. B. jede beendete Runde mit App, Seite, Genauigkeit, Sternen).
- `lernwerkstatt:profile`: Name, Klasse, XP, Serie, letzte App, Tages-XP. `lernwerkstatt:app:<id>`: XP, Sterne je Seite, Trophäen, Bestwerte der App.
- Das Schema ist offen. `openProfile(handle, defaults, { version, migrate })` und `openApp(handle, id, defaults)` sind asynchron (`await`), danach ist `store.state` synchron nutzbar, `store.save()` schreibt im Hintergrund. Gespeicherte Felder bleiben erhalten, neue Standardfelder werden beim Laden ergänzt (auch verschachtelt). Neue Felder brauchen deshalb keine Migration.
- Eine Migration (`version` erhöhen, `migrate(old, fromVersion)`) ist nur nötig, wenn sich die Bedeutung vorhandener Felder ändert.
- Eine neue Sammlung (z. B. für Karteikarten) braucht `DB_VERSION` in `speicher/src/constants.js` plus einen Zweig in `upgrade()` (`speicher/src/backend-idb.js`). Bestehende Sammlungen nie umbauen.
- Daten aus dem früheren `localStorage` werden beim ersten Start automatisch übernommen und dort entfernt.
- Sicherung: Startseite jeder App, "Fortschritt sichern" lädt alles als JSON, "Sicherung einspielen" stellt es wieder her. Das schützt auch davor, dass Safari die Daten einer lange nicht genutzten Seite löscht.
- Ereignisse schreibst du mit `handle.logEvent({ app, type, ... })`, liest sie mit `handle.listEvents({ app, limit })` (`handle` aus `openStore()`). Eigene Felder sind frei wählbar, `ts` kommt automatisch.
- `id` einer App und `id` von Seiten und Trophäen sind Teil der gespeicherten Daten. Sie werden nie umbenannt.
- Jeder Zugriff ist gegen Fehler abgesichert. Die App muss auch ohne Speicher laufen.

## Spielregeln (Gamification)

Die Zahlen stehen in `regeln/src/constants.js`, `regeln/src/xp.js` und `runde/src/rules.js` und gelten für alle Apps gleich: Level-Schwelle 30·n·(n−1) XP, Combo-Faktor bis ×4, 5 Herzen (Boss 3), Sterne ab 70 % (2) und 90 % (3), Tagesziel nach Wahl der Lernenden (20, 30 oder 50 XP, Standard 30), Serie mit einem Gnadentag. Änderungen daran wirken auf alle Apps und brauchen angepasste Tests.

Die Mechaniken sind so gewählt, dass sie das Lernen fördern und nicht nur belohnen:

- **Zweiter Versuch:** Eine falsch beantwortete Frage kommt am Ende der Runde noch einmal (nicht im Endgegner, nicht bei Zuordnungen). Sie zählt nicht für Genauigkeit und Herzen, bringt aber 5 XP. Wiederholen nach dem Fehler festigt am meisten.
- **Auffrischen:** Eine Seite mit Sternen wird nach 3 Tagen (`DUE_DAYS`) als "Zeit zum Auffrischen" markiert, bei einer letzten Genauigkeit von mindestens 90 % erst nach 7 Tagen (`DUE_DAYS_STRONG`). Wer sie dann übt, bekommt 10 Bonus-XP. Verteiltes Wiederholen bringt Wissen ins Langzeitgedächtnis. Dafür speichert die App `app.last[unitId]` (Tag) und `app.acc[unitId]` (letzte Genauigkeit).
- **Wochenmissionen:** Pro Woche (ab Montag) gibt es drei Missionen: drei verschiedene Seiten üben, eine Seite auffrischen, eine Runde mit mindestens 90 % Genauigkeit. Jede bringt 20 XP und wird pro Woche nur einmal bezahlt. Ein Blitz zählt nicht für die Runde mit 90 %, weil er keine echte Genauigkeit hat.
- **Neue Trophäen-Typen:** `improved` (Genauigkeit einer Seite gegenüber dem letzten Mal um einen Mindestwert gestiegen), `retryRecovered` (Fehler der Runde im zweiten Versuch richtig beantwortet) und `refresh` (Zahl bezahlter Auffrischungen).
- **Gezieltes Training:** Die Startseite einer App (`seiten/apphome.js`) schlägt die fällige oder schwächste Seite vor (`weakestUnit`). Die Startseite aller Apps zeigt das wie im Legacy nicht, ebenso wenig den Endgegner.
- **2-Minuten-Runde:** Sie wiederholt und zieht nur aus Seiten mit mindestens einem Stern. Wer noch nichts geübt hat, startet mit der Theorie der ersten Seite.
- **Nächster Schritt:** Ab 2 Sternen führt der Hauptknopf im Ergebnis zur nächsten offenen Seite (`followingUnit`). Darunter bleibt „Nochmal“ der Hauptknopf.
- **Kapitel-Test:** Hat ein Kapitel mindestens zwei Seiten und jede davon einen Stern, gibt es 10 gemischte Aufgaben daraus. Er ändert keine Sterne und zählt nicht als Übung der Seiten. Gespeichert wird der Bestwert (`app.chapters`), das Ergebnis nennt die Seiten mit Fehlern.
- **Endgegner:** Die 12 Fragen verteilen sich über alle Seiten (`spreadPick`), jede Seite kommt über mehrere Runden dran.
- **Sammelalbum:** Jede Seite hat eine Karte mit einem Fakt. Sie wird mit 1, 2 oder 3 Sternen zu Bronze, Silber, Gold. So gibt es ein sichtbares Ziel pro Seite.
- **Mini-Check in der Lektion:** Eine Frage direkt nach der Theorie, ohne Druck und ohne XP. Sich selbst abfragen lernt besser als Nachlesen.
- **Ereignisprotokoll:** Jede Runde wird mit `logEvent` gespeichert. Daraus lassen sich später Verläufe und Wiederholungspläne bauen.

## Design

- Farben, Abstände und Radien kommen aus `seiten/design/styles/tokens.css`. Keine festen Farbwerte in App-CSS, außer der Akzentfarbe einer Seite (`unit.color`).
- Jede Ansicht muss in hell und dunkel funktionieren. Ohne Wahl gilt `prefers-color-scheme`, der Umschalter (`seiten/thema.js`) setzt `data-theme` und merkt die Wahl auf dem Gerät, nicht im Profil.
- `prefers-reduced-motion` respektieren, Animationen abschaltbar halten.
- Bedienbar mit Tastatur, sichtbarer Fokus, ausreichender Kontrast, Touch-Ziele mindestens 44 px. Wichtige Information nie nur über Farbe.
- Oberflächentexte auf Deutsch, du-Ansprache, freundlich, ohne Kindersprache. Zielalter 12 bis 13. Keine Emojis, Icons kommen aus `komponenten/icons.js`.
- Theorie-Seiten nutzen `.tcard`, `.thead`, `.notes` und `.note` aus `seiten/design/styles/base.css`.
- Eine App-spezifische Optik gehört in `apps/<name>/app.css`, wird über `STYLE` in `apps/index.js` geladen und baut auf den Tokens auf.

## Lektionen

Jede Seite hat eine Lektion in `content/<id>/lessons.json`, gezeichnet mit `komponenten/lesson.js`. Die Reihenfolge ist für alle Apps gleich und folgt dem, wie 12- bis 13-Jährige lernen: erst Ziel, dann Bild, dann selbst tun.

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
- Diagramme entstehen als Text-SVG mit den Helfern aus `komponenten/svg.js` (kein Bild-Upload, keine externen Bilder). Farben nur über die CSS-Klassen aus `seiten/design/styles/lesson.css` (`box`, `hi`, `acc`, `off`, `mu` …), damit sie in hell und dunkel passen.
- Jedes Diagramm braucht `role="img"` und einen aussagekräftigen `aria-label` (macht `svg()` automatisch, wenn du ihn angibst).
- Zahlen im Diagramm werden berechnet, nicht von Hand getippt. So können sie nicht von den Aufgaben abweichen.
- Die Inhaltsprüfung (`inhalte/src/bundle.js`) prüft die Pflichtteile.

## Lehrplan

- Inhalt entspricht dem Gymnasium Baden-Württemberg und der Klasse in `catalog.klassen`, heute Klasse 7. Kein Stoff aus höheren Klassen.
- Orientierung an den Lehrwerken: Lambacher Schweizer 7 (Mathe), deutsch.ideen 7 Baden-Württemberg (Deutsch, Schulbuch; Abgleich in `docs/lehrplan-deutsch.md`), Green Line 3 / Access 3 (Englisch, Grammatik), Access 2 Unit 6 (Englisch, Wortschatz; Abgleich in `docs/lehrplan-englisch.md`), Découvertes 2 (Französisch).
- Der Abgleich der Mathe-App mit dem Bildungsplan steht in `docs/lehrplan-mathe.md`. Dort ist auch vermerkt, was nicht amtlich geprüft ist. Neue Themen dort eintragen.
- Korrekte Fachbegriffe verwenden und kurz erklären.
- Jede Frage hat eine Erklärung (`why`), die den Denkfehler benennt. Keine Fragen, deren Antwort ohne Vorwissen zu erraten ist.
- Jede Frage ist für sich verständlich: `q` ist bei Auswahlfragen eine vollständige Frage, kein Stichwort. Bei Lücken ist `q` ein Hinweis, der die Antwort ableitbar macht, ohne sie zu nennen. Falsche Antworten sind plausibel und wirklich falsch. `apps/tests/fragen-qualitaet.test.js` prüft den mechanischen Teil.
- Fachliche Richtigkeit ist wichtiger als Umfang. Im Zweifel eine Aufgabe weglassen.

## Neue App anlegen

Im Neubau: `apps/_template/` nach `apps/<id>/` kopieren, `content/vorlage/` nach `content/<id>/`, Feld `catalog` im Manifest setzen (`subject`, `desc`, `order`), Logik in `LOGIC` in `apps/index.js` eintragen, eigenes CSS in `STYLE` dort. Steht der Stoff ganz im Inhalt, bleibt `logic.js` beim `poolApp()` der Vorlage. `apps/tests/smoke.test.js` und `apps/tests/endgegner.test.js` prüfen die App automatisch.

Der bisherige Code ist aus `main` entfernt (Branch `legacy`). Neue Apps nur im Neubau anlegen.

## Neue Seite, Trophäe oder Fragetyp

- Seite: Eintrag in `manifest.json` (`units` mit `group`, `notes`), Lektion in `lessons.json`, Aufgaben in `data.json`/`builders.js`. Neue Seiten hinten anfügen, nicht umsortieren.
- Trophäe: Eintrag in `badges.json` mit neuer, nie verwendeter `id` und einer Regel.
- Fragetyp: Es gibt `choice`, `type` und `match`, ein Register gibt es nicht. Ein neuer Typ braucht einen Erbauer in `runde/src/questions.js`, die Bewertung in `runde/src/round.js`, die Ansicht in `seiten/spiel.js`, Stil in `seiten/design/styles/quiz.css` und Tests in `runde/tests/`. Nie nur in einer App einen Sonderweg bauen.

## Code-Stil

- ES-Module, `const`/`let`, Pfeilfunktionen für kurze Callbacks, Semikolons, einfache Anführungszeichen.
- Kleine Funktionen mit einer Aufgabe. Inhalt (`content/`) getrennt von Logik (`logic.js`, `builders.js`) und Darstellung (`seiten/`, `komponenten/`, `theory.js`).
- Kein `innerHTML` und kein `dangerouslySetInnerHTML`. HTML-Felder laufen durch `komponenten/rich.js`. Ereignisse laufen über React-Props.
- Kommentare erklären das Warum. Kommentare und Oberflächentexte sind Deutsch, Bezeichner Englisch oder Deutsch, aber je Datei einheitlich.
- Keine Funktionen mit Zufall ohne Möglichkeit, sie zu testen: Fragen werden aus Daten gebaut, die Tests prüfen jede mögliche Frage.

## Tests

- `npm test` im Neubau (`modernized/modulare-reimagined`) muss vor jedem Commit grün sein.
- Neue Logik bekommt einen Test. Neue Inhalte werden durch den Schema- und Vertragstest geprüft.

## Deployment

Push auf `main`. `.github/workflows/pages.yml` testet, baut `dist/` und veröffentlicht. Bei 404 zuerst prüfen, ob unter Settings, Pages die Quelle GitHub Actions eingestellt ist und ob der Lauf "Pages" erfolgreich war.

## Commits

Kurze, deutsche Betreffzeile im Präsens oder Perfekt ("Mathe-App ergänzt", "Boss-Freischaltung korrigiert"). Eine Änderung pro Commit, Tests vorher ausführen.

## Fallstricke

- Pfade immer relativ. Ein führender Slash bricht unter `/lernapp-sira/`.
- IDs in gespeicherten Daten nie ändern.
- Eingaben vergleichen über `normalise()` und `stripAccents()`, nicht mit eigenem Vergleich.
- Zufall (`shuffle`, `pick`) nie so nutzen, dass die richtige Antwort immer an derselben Stelle steht.
- Sonderzeichen in Texten (Anführungszeichen, `<`, `&`) über `esc()` ausgeben. Das gilt auch für alles, was aus Daten in `html` oder `prompt` landet.
- Nichts mit Namen oder personenbezogenen Daten ins Repo. Namen von Lernenden liegen nur im lokalen Browserspeicher.

## Checkliste vor dem Commit

- [ ] `npm test` grün
- [ ] Hell und dunkel angesehen, schmale Breite geprüft
- [ ] Keine neuen festen Farben, keine absoluten Pfade
- [ ] Inhalte passen zu Klasse 7 Gymnasium BW
- [ ] Feld `catalog` im Manifest und `AGENTS.md` aktuell
