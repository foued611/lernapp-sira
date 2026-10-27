# Parität Legacy und Neubau

Stand: 2026-10-26. Vorgabe der Person: Legacy wird erst aus `main` entfernt, wenn Legacy und Neubau funktional und designtechnisch 1:1 gleich sind.

Vergleich im Browser: Legacy über `python3 -m http.server 5174` (Repo-Stand 88e3d74), Neubau über `npm run dev` in `modernized/modulare-reimagined` (Port 5173).

## Stand 2026-10-27 (gilt vor den Befunden unten)

- Startseite und App-Startseite: Kopfleiste, Tagesziel-Ring, Sammelalbum, Trophäen und Kacheln sind umgesetzt. Mobil (375 px) ohne Überlauf.
- Theorie: Inhaltsangabe und Terme vereinfachen (mathe) mit Legacy verglichen. Aufbau, Farben (Vergleich olivgrün), Diagramm und Zurück-Link stimmen überein. Kein Pixel-Diff gemacht.
- Reveal (Auflösung bei falscher Antwort): umgesetzt.
- Browser geprüft: Runden (deutsch, mathe), Blitz (deutsch, mathe), Ergebnis mobil, Speicher (XP, Name, Reset, Sicherung, Einspielen, Arbeitsspeicher), Diagramme aller 24 Lektionen.
- Französisch-Theorie (être) gegen Legacy gemessen: Titel 46 px Bricolage Grotesque, Selbsttest-Pill 246×35 px, Schrift 15 px, Kartenrand 10 px in Lila. Stimmt überein. Ein Pixel-Diff ist das nicht.
- Auswertung Informatik gegen Legacy: Titel, Sterne, Untertitel, drei Kennzahlen, Tagesziel-Leiste, Niveau-Aufstieg und Konfetti stimmen im Aufbau überein. Geometrie nutzt dieselbe Ergebnis-Komponente (`seiten/ergebnis.js`).
- Auswertung Französisch (2-Minuten-Runde) gegen Legacy gemessen, 2026-10-27: Karte 860 px breit, Titel 223×50 px (Bricolage Grotesque, 46 px), Knöpfe 188×52 px und 165×52 px, drei Kennzahlen je 110×75 px, Tagesziel-Leiste 420×12 px. Stimmt überein. Textlogik gleich: beide Dateien (`core/js/views/result.js`, `seiten/ergebnis.js`) setzen den Satz zum zweiten Versuch nur, wenn eine falsche Aufgabe gerettet wurde. Werte (Prozent, XP, Serie, Niveau) unterscheiden sich nur wegen des Spielstands. Nicht verglichen: Auswertung nach einer Übungsrunde (Knopf „Theorie“) und die Zuordnungsfrage, die in den beiden Läufen nicht vorkam.
- Erledigt: Der Name aus dem Französisch-Text (`content/fr-verben/lessons.json`, zweimal) ist durch „Lena“ ersetzt. Die Person hat das entschieden. Legacy liest dieselbe Datei.
- Offen: Der Name steht noch in `AGENTS.md`, `README.md`, `docs/*.md` und `scripts/smoke.mjs`. Für den Inhalt gilt die Regel jetzt, für diese Dateien noch nicht geprüft.
- Bewusste Abweichung (Entscheidung der Person, RULE-150): Eine mitgetippte Einheit muss zur Aufgabe passen, wo die Aufgabe eine Einheit hat. Geometrie gibt die Einheit der Aufgabe an (`helfer/number.js`, `numCheck` mit `unit`). "5 m" ist für eine Aufgabe in cm falsch. Ohne Einheit in der Eingabe bleibt die Zahl gültig. Mathe-Aufgaben haben im Datenfeld keine Einheit, dort gilt weiter die Legacy-Regel.

Die Befunde unten stammen vom 26.10. und sind teils überholt.

## Befund Startseite

| Merkmal | Legacy | Neubau |
|---|---|---|
| Kopfleiste | Obere Leiste mit Niveau, XP und Trophäen | fehlt |
| Begrüßung | "Hallo!" mit Maskottchen, Spruch, Name-Feld | Text "Hallo", kein Maskottchen |
| Tagesziel | Ring mit Fortschritt, "Tagesziel: 30 XP" | nur Text, kein Ring |
| Kacheln | Farbige Kopf-Streifen je Fach, Icon-Kacheln je Seite | einfache Liste, keine Farben |
| Lernpfad | Farbige Kreis-Icons je Seite (IA, AS, ,, SS, P) mit Sternen | Textliste, Sterne als Text |
| Sammelalbum | Karte mit Fakt je Seite | fehlt |
| Etiketten | Stränge als Chip | Etikett nur als Text |

## Befund App-Startseite (Deutsch)

- Legacy: Maskottchen, Begrüßung, Zieleingabe "Wie heißt du?", Knopf "Los", Tagesziel-Ring, zwei Knöpfe "Übungsrunde" und "2-Minuten-Runde".
- Neubau: Titelkarte ohne Maskottchen, Lernpfad als Liste, Knöpfe in anderer Form.
- Legacy: Seitenkarten mit Farbe und Icon. Neubau: Text.

## Funktional (ohne Design)

- Auflösung (Reveal) fehlt im Neubau (bewusste Abweichung, UAT_P5B.md Punkt 6). Für 1:1 nötig.
- Mathe, RULE-056: gerade Anzahl Werte im Median. Bewusste Abweichung, von der Person freigegeben (Phase 5b). Für 1:1 nicht erfüllt, Entscheidung nötig.
- Sammelalbum (Karte mit Fakt je Seite) fehlt.
- Kopfleiste mit Niveau, XP und Trophäen fehlt.
- Tagesziel-Ring fehlt.
- Stränge als Chip im Lernpfad: teilweise.

## Einschätzung

Die Logik (Fragen, Regeln, Speicher, Blitz, Auswertung) stimmt größtenteils überein und ist getestet. Die Oberfläche ist nicht 1:1. Das sind die Komponenten `seiten/startseite.js`, `seiten/rahmen.js`, `seiten/ergebnis.js`, `komponenten/*` und die CSS-Dateien in `seiten/` und `komponenten/`.

## Offene Entscheidung

Was heißt 1:1 bei Design?
- Pixelgleich zu Legacy: Legacy-CSS übernehmen und die Markup-Struktur angleichen. Groß, aber eindeutig prüfbar.
- Gleiche Gestaltung (Farben, Abstände, Bausteine): ähnlich, aber kleiner. Prüfung nur nach Augenmaß.

## Befund Theorie (Inhaltsangabe)

- Gleich: Aufbau aus Ziel, "In 30 Sekunden", Vergleich, Diagramm, Merksatz.
- Abweichend: Legacy hat Kopfleiste mit Niveau, XP und Trophäen; Neubau nicht. Legacy zeigt den Vergleich olivgrün, Neubau dunkelblau. Legacy hat Maskottchen groß und Zurück-Link als Text, Neubau als Knopf in Eingabe-Optik.

## Befund Runde (Frage 1 von 8)

- Legacy: Kopfleiste, Fortschrittsbalken, fünf Herzen als Symbole, Frage in Karte mit Kategorie-Etikett ("SCHLUSS"), nummerierte Antwortknöpfe, Knopf "Prüfen", Runde-beenden-Knopf.
- Neubau: keine Kopfleiste, kein Fortschrittsbalken, Herzen als Text ("Herzen: 5 von 5"), Frage ohne Karte, Antworten ohne Nummer und ohne Stil, kein "Prüfen" (Auswahl klickt direkt). Das Layout wirkt ungestylt. Vermutlich fehlen CSS-Regeln für die Spielansicht (`.play`, `.opts`) in `seiten/seiten.css`.

## Stand

Verglichen: Startseite, Deutsch-Startseite, Theorie, Runde. Nicht verglichen: Ergebnis, Blitz (Legacy: `startBlitz` mit Playbar), Sicherung.

## Befund Blitz und Spielmodi (Deutsch-Startseite, unterer Teil)

- Legacy: Abschnitt "Spielmodi" mit Blitz-Karte (Text, Bestwert, rosa Knopf) und Grammatik-Boss-Karte (gesperrt, mit Hinweis). Abschnitt "Zum Ausdrucken" mit Material-Karte und Knopf "Öffnen". Abschnitt "Sammelalbum" mit Hinweis "Für jede Seite gibt es eine Karte".
- Neubau: Blitz-Karte vorhanden (Text, Bestwert, Knopf). Boss als Text im Block. Fehlt: Abschnitt "Zum Ausdrucken" (Material), Sammelalbum, eigener Spielmodi-Abschnitt in gleicher Gestaltung.
- Ergebnis-Ansicht und Sicherung-Abschnitt: noch nicht verglichen (Ergebnis braucht eine komplette Runde).

## Bewusste Abweichungen (von der Person entschieden)

- RULE-075: erledigt ab 2 von 3 Sternen. Legacy: ab einem Stern.
- RULE-056: Median bei gerader Anzahl als Mittel der beiden mittleren Werte. Legacy: nur 5 und 7 Werte.
- RULE-202: Startseite ohne Speicher zeigt Meldung und Links. Legacy: leer.
- Namensanzeige maskiert (SEITE-MASKIERUNG). Legacy: Name im Klartext.
- Auflösung (Reveal) fehlt. Nicht von der Person entschieden, Stand aus UAT_P5B.md.

Ohne Entscheidung über diese Punkte ist "1zu1 funktional" nicht erfüllbar.

## Stand der Arbeit (uncommitted)

- Legacy-Styles in `seiten/design/styles` übernommen, `seiten/main.js` lädt sie.
- Startseite: Markup wie `dashboard.js` (Kopf, Ring, Weiter-Karte, Kacheln). Endgegner-Zeile und Sicherung entfernt, weil Legacy sie dort nicht hat.
- App-Startseite: Markup wie `home.js` (Hero, Ring, Lernpfad, Spielmodi, Ausdrucken, Sammelalbum, Trophäen, Zurücksetzen). Kopfleiste wie `shell.js` (header.top).
- Browser-Vergleich Deutsch-Startseite: Kopf und Lernpfad stimmen überein.
- Spielansicht (`seiten/spiel.js`): Legacy-Markup für Fortschritt, Herzen, Fragekarte, Antwortkästchen, Eingabe mit Akzent-Leiste, Zuordnung, Rückmeldung mit Maskottchen. Im Browser geprüft (Runde Deutsch).
- Noch offen: Blitz-Ansicht (Legacy `blitz.js`), Ergebnis (Legacy `result.js`), Sicherung (Legacy: Links in der Fußzeile), unterer Teil der App-Startseite im Vergleich.
- Test-Anpassungen, die nur Wortlaut oder Markup betreffen: 'Frage n von m' entfällt (Legacy zeigt es nicht), Sperrtext wie Legacy home.js, Herzen als Symbole.

## Befund Französisch-Theorie (être), Browser-Vergleich

- Abweichung: Legacy zeigt den Selbsttest "Formen abdecken" als Pill. Neubau zeigt einen breiten Knopf.
- Abweichung: Legacy hat eine größere Titelzeile mit farbigem Rand. Neubau hat eine kleinere Titelzeile.
- Gleich: Konjugationstabelle, Lautsprecher je Zeile, "In 30 Sekunden", Vergleich.
- Offen: Runde Französisch, Theorie und Runde Informatik und Geometrie, Theorie Geometrie.

## Browser-Vergleich Theorie Informatik und Geometrie

- Informatik, Stellenwerte: Aufbau, Stellenwert-Diagramm, Merkzettel und "Stell dir vor" stimmen überein.
- Geometrie, Mittelsenkrechte: Aufbau, Diagramm und Farbe stimmen überein.
- Offen: Runden von Französisch, Informatik und Geometrie sowie die Auswertung je App.

## Browser-Vergleich Runden (Französisch, Informatik, Geometrie)

- Geometrie-Runde: Frage mit Etikett, zweispaltige Antworten mit Zahlen, Prüfen. Stimmt überein.
- Französisch-Runde: Lückenfrage mit Verb-Chip, Eingabe mit Akzent-Leiste, Spickzettel, Prüfen. Stimmt überein.
- Informatik-Runde: Eingabefrage und Auswahlfrage, Aufbau stimmt überein.
- Fragen sind zufällig, deshalb verschieden. Der Aufbau ist gleich.
