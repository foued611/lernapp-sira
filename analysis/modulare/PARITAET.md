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
- Auswertung Französisch (2-Minuten-Runde) gegen Legacy gemessen, 2026-10-27: Karte 860 px breit, Titel 223×50 px (Bricolage Grotesque, 46 px), Knöpfe 188×52 px und 165×52 px, drei Kennzahlen je 110×75 px, Tagesziel-Leiste 420×12 px. Stimmt überein. Textlogik gleich: beide Dateien (`core/js/views/result.js`, `seiten/ergebnis.js`) setzen den Satz zum zweiten Versuch nur, wenn eine falsche Aufgabe gerettet wurde. Werte (Prozent, XP, Serie, Niveau) unterscheiden sich nur wegen des Spielstands. Auswertung nach Übungsrunde (être, 8 Aufgaben, Zuordnungsfrage mit Paaren von Hand gelöst) ebenfalls gemessen: Karte 860×563 px, Titel 347×50 px (46 px), Knöpfe 124, 113 und 165 px breit (52 px hoch), Sterne 216×68 px, Kennzahlen 110×75 px, Leiste 420×12 px, Untertext identisch. Beide Läufe fielen durch (0 Sterne), Prozentwerte unterscheiden sich nur wegen des Spielstands.
- Erledigt: Der Name aus dem Französisch-Text (`content/fr-verben/lessons.json`, zweimal) ist durch „Lena“ ersetzt. Die Person hat das entschieden. Legacy liest dieselbe Datei.
- Offen: Der Name steht noch in `AGENTS.md`, `README.md`, `docs/*.md` und `scripts/smoke.mjs`. Für den Inhalt gilt die Regel jetzt, für diese Dateien noch nicht geprüft.
- Bewusste Abweichung (Entscheidung der Person, RULE-150): Eine mitgetippte Einheit muss zur Aufgabe passen, wo die Aufgabe eine Einheit hat. Geometrie gibt die Einheit der Aufgabe an (`helfer/number.js`, `numCheck` mit `unit`). "5 m" ist für eine Aufgabe in cm falsch. Ohne Einheit in der Eingabe bleibt die Zahl gültig. Mathe-Aufgaben haben im Datenfeld keine Einheit, dort gilt weiter die Legacy-Regel.

Die Befunde unten stammen vom 26.10. und sind teils überholt.

## Pixel-Diff Theorie-Seiten (2026-10-27)

Alle 44 Theorie-Seiten (fünf Apps), je Legacy und Neubau in 1280 px Breite, volle Seite, Animationen aus, Vergleich pixelgenau im Browser. Werkzeug: `pixdiff.cjs` im Scratchpad (nicht im Repo).

- Vorher: Neubau 100 bis 204 px kürzer als Legacy, 25 bis 48 % der Pixel abweichend. Ursache: `.theory-stack` (Abstand der Karten) hatte im Neubau keine CSS-Regel, weil `komponenten/lektion.css` nicht geladen wird.
- Fix: `seiten/design/styles/lesson.css` bekommt `.theory-stack{display:grid;gap:22px}` (Wert aus `core/js/theory.js`).
- Nachher: Höhenunterschied −10 bis +162 px (Mittel +15), 21 bis 40 % der Pixel abweichend (Mittel 26 %). Pro App: Mathe, Geometrie, Deutsch etwa −6 px Höhe und 24 bis 26 %; Zahlenwerkstatt +9 px und 25 %; Französisch +134 px und 37 %.
- Offen: Französisch wird im Neubau höher als in Legacy (vermutlich Übungsblock oder Verbtabelle). Der Rest der Abweichung (ca. 25 %) liegt nicht nur am Abstand. Auf Ursache und Bildausschnitt noch nicht untersucht.
- Die Abweichung ist nicht mehr null: Der Pixelvergleich zeigt weitere Unterschiede (Schatten, Zeilenhöhen, Kopfzeile), die einzeln geprüft werden müssen.

## Abnahme-Stand (2026-10-27, nach b14e84a, 6934974, 5693615)

Gemessen wie oben, Höhen Legacy gegen Neubau in Pixeln, Abweichung in Prozent der Pixel.

- Französisch: alle sechs Seiten gleiche Höhe. Abweichung 0,1 bis 0,2 % (être, avoir, aller, faire) und 1,9 % (Verben auf -er, -ir/-re). Ursachen: Titelkarte nicht in der Konjugationskarte, Abstand Ziel und Karten, Rückmeldung immer sichtbar, Abstand Konjugationskarte, Abstand "So sieht das" und Merkzettel.
- Deutsch: vier Seiten bei 0,0 bis 0,01 % (Inhaltsangabe, Adverbialsätze, Nebensätze, das oder dass), elf Seiten bei 2,5 bis 4,3 %. Offen: Abweichung in Kopfzeile und Textkanten (gleiche Höhe).
- Mathe: vier Seiten 0,0 bis 0,01 %, fünf Seiten 2,4 bis 4,2 %. Offen wie Deutsch.
- Geometrie: vier Seiten 0,0 bis 0,02 %, vier Seiten 2,3 bis 4,2 %. Ursache der großen Werte behoben: Diagrammstile fehlten (`apps/geometrie/app.css` nach `seiten/design` übernommen, `seiten/main.js` lädt sie). Umkreis zeigt jetzt dieselben Farben wie Legacy.
- Zahlenwerkstatt: Stellenwerte 0,7 %, Binär lesen 0,01 %, Normal → Binär 0,2 %, Binär addieren 0,4 %, Binär ↔ Hex 3,6 %, Hexadezimal 7,8 %. Ursachen behoben: `--color-*`-Token aus `seiten/tokens.css` werden nicht geladen (Rahmen, Ränder, Farben fehlten), Eingabe in einer Zeile wie Legacy, Knopf klein nur auf dieser Seite.
- Pro Seite gilt: Keine Zeile mit horizontalem Überlauf bei 375 px (Startseite und je eine Theorie je App).
- Browser-Abnahme (Neubau, Theorie öffnen, Runde starten, eine Antwort geben): alle fünf Apps ohne Fehler. Vorher 404 auf das Merkwörter-PDF, jetzt behoben.
- Offen, nicht in dieser Runde: Ursachen der 2 bis 4 % in Deutsch, Mathe und Geometrie (Kopfzeile, Schatten), Hexadezimal-Raster, Runde, Ergebnis, Blitz und Sicherung pixelweise. Startseite: Name-Feld erscheint nur im Neubau, weil der Legacy-Ursprung schon einen Namen hat (Datenstand, kein Layout).
- Nebenbefund, behoben (b34d024): `seiten/design/styles/dashboard.css` wirkte global. Jetzt nur noch unter `.shell.dash` (Startseite). Legacy lädt sie nur auf der Startseite.

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

## Durchspiel-Abnahme (2026-10-27, Browser)

Skript: `play.cjs` im Scratchpad (nicht im Repo). Es spielt eine Lektionsrunde oder einen Blitz bis zum Ergebnis, mit richtigen Zuordnungspaaren aus `fr-forms.json` (erzeugt aus dem Neubau-Modell). Ergebnis je Lauf: Ergebnis-Ansicht erreicht, Seitenfehler gesammelt.

| App | Runde Legacy | Runde Neubau | Blitz Legacy | Blitz Neubau | Seitenfehler |
|---|---|---|---|---|---|
| Französisch | Ergebnis | Ergebnis | Ende (11 richtig) | Ende (17 richtig) | keine |
| Deutsch | Ergebnis | Ergebnis | Ende | Ende | keine |
| Mathe | Ergebnis | Ergebnis | Ende | Ende | keine |
| Geometrie | Ergebnis | Ergebnis | Ende | Ende | keine |
| Zahlenwerkstatt | Ergebnis | Ergebnis | Ende | Ende | keine |

- Sicherung (Französisch): Neubau exportiert, spielt die Datei wieder ein. Es erscheint der Bestätigungsschritt mit Zahl der Speicherstände, dann "Einspielen". Legacy spielt direkt ein, ohne Bestätigung. Der Bestätigungsschritt ist eine bereits freigegebene Abweichung (Sicherung mit Bestätigung).
- Startseite (Französisch): Layout gleich, Begrüßungssatz wird zufällig gewählt (in beiden Versionen).
- Behoben in dieser Runde: Verbchip und Lücke im Blitz wie Legacy, Kartenrand Blitz, Raster der Runde (`.seiten`), Startseite-CSS begrenzt, PDF Merkwörter.

### Pixel-Abnahme nach Korrektur der Messung (2026-10-27)

Die früheren Werte von 2 bis 4 % (Deutsch, Mathe, Geometrie) waren ein Messfehler: Die Seite war beim Screenshot unterschiedlich weit gescrollt, der sticky Kopf stand an verschiedenen Stellen. `pixdiff.cjs` setzt den Scroll jetzt vor jedem Screenshot auf 0.

- Deutsch: 0,00 bis 0,01 % (alle 15 Seiten).
- Mathe: 0,00 bis 0,01 % (alle 9 Seiten).
- Geometrie: 0,00 bis 0,02 % (alle 8 Seiten).
- Französisch: 0,07 bis 0,13 % (alle 6 Seiten).
- Zahlenwerkstatt: Stellenwerte 0,18 %, Binär addieren 0,07 %, Hexadezimal 0,04 %, übrige 0,01 %. Ursachen behoben: Hintergrund der Zellen und Eingabefelder (`--paper` statt `--card`) wie in Legacy.

Restabweichung unter 0,2 % sind Kanten der Schrift (Antialiasing), keine Abweichung im Layout.

### Entscheidung Namenshinweis (Entscheidung der Person)

- Die Person hat entschieden: Der Hinweis "Die Datei enthält deinen Namen." bleibt im Neubau. Begründung: SEC-007 (der Name steht in der Datei, das muss sichtbar gesagt werden). Legacy hat ihn nicht. Bewusste Abweichung aus Datenschutzgründen, keine Layout-Abweichung. Rückgängig machen wäre: Zeile `sicherung.js` mit `NAME_IN_FILE` entfernen und die beiden Tests in `seiten/tests/sicherung.test.js` anpassen.
- Sicherung: Der Bestätigungsschritt beim Einspielen (Legacy ohne) ist die von der Person freigegebene Abweichung "Sicherung mit Bestätigung".

### Pixel-Abnahme Runde und Ergebnis

- Die Spielinhalte sind zufällig. Verglichen wurden Struktur, Höhen und Ablauf (Durchspiel oben), nicht Pixel. Entscheidung der Person: Strukturell reicht für die Abnahme. Das Ergebnis-Layout wurde für Französisch schon pixelgenau gemessen (116a9d3).

## Abnahme-Status (Umbau)

- Abgenommen: Startseite, App-Startseite, Theorie (alle 44 Seiten unter 0,2 %), Runde und Ergebnis (strukturell, Entscheidung der Person), Blitz (Durchspiel ohne Fehler), Sicherung (Rundlauf, Bestätigung als freigegebene Abweichung).
- Entscheidungen der Person: Namenshinweis bleibt (SEC-007). Runde und Ergebnis strukturell abgenommen.
- Bewusste Abweichungen (freigegeben): RULE-075, RULE-056, RULE-202, maskierter Name, Bestätigungsschritt beim Einspielen.
- Offen: nichts aus den Abnahmepunkten. Die Legacy-Entfernung von `main` ist nicht freigegeben und bleibt eine eigene Entscheidung.
