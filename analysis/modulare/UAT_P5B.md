# Umsetzung Phase 5b (Fach-Apps mathe, info-zahlen, fr-verben, Umstellung)

Stand: 2026-10-26. Build und Tests im Neubau: `modernized/modulare-reimagined`. Nicht committet, nicht veröffentlicht.

## Entscheidungen der Person (Entry-Kriterien)
- RULE-056: Median bei gerader Anzahl = Mittel der beiden mittleren Werte.
- RULE-119: Eingabe gilt als richtig oder falsch, keine Teilpunkte.
- Frage 5: Veröffentlichung über GitHub Pages aus `dist/`.

## Ergebnis
| Prüfung | Ergebnis | Notiz |
|---|---|---|
| Smoke über alle Live-Apps (apps/tests/smoke.test.js) | grün | jede Seite zeichnet, jede Rundenart startet |
| RULE-206 Endgegner über alle Live-Apps | grün | apps/tests/endgegner.test.js |
| RULE-165 je App | grün | apps/<id>/tests (mathe, info-zahlen, fr-verben, deutsch, geometrie) |
| RULE-229 Rundengrößen | grün | 8 / 12 / 5, Blitz Auswahl |
| Dual-Execution (gleiche Seeds, 200) | deutsch 3600, info-zahlen 1800, fr-verben 1800 Vergleiche, 0 Abweichungen. mathe 2400 Vergleiche, 177 Abweichungen, alle durch RULE-056 (siehe unten) | analysis/modulare/dual/*_dual.mjs |
| Sicherung aus Legacy (Fixture) im Browser eingespielt | bestanden | Plan: 2 Speicherstände, 2 Ereignisse. Stand danach: 120 XP, 3 Tage in Folge, 1 Trophäe, Name maskiert (Stichprobe wie expected.json) |
| Browser: mathe, info-zahlen, fr-verben (Theorie, Übung, Spickzettel) | bestanden | Theorie mit Toy in info-zahlen, Konjugationstabelle in fr-verben |
| npm test | 614 grün | |

## Neue Gemeinsame Teile in dieser Phase
- Zuordnungsfragen (`match`) sind in der Spielansicht beantwortbar (seiten/rahmen.js, MatchAnswer). Vorher stand dort nur der Hinweis, der Rundenmotor kann sie.
- Spickzettel: Hilfetext je Frage, einmal je Runde 3 XP Abzug (runde/src/round.js peek, legacy quiz.js:168-173).
- App-Stylesheets fr-verben und info-zahlen werden in seiten/main.js geladen.
- Theorie-Komponente pro App (`config.Theory`), sonst Standardseite.

## Abweichungen von Legacy (bewusst)
0. mathe, RULE-056: Median-Aufgaben nehmen jetzt auch gerade Anzahlen (5 bis 8 Werte), Median bei gerader Anzahl = Mittel der beiden mittleren Werte. Legacy erzeugte nur 5 und 7 Werte. Die Zufallsfolge ändert sich deshalb ab der ersten Median-Ziehung. Dual: alle 177 Abweichungen liegen in 'daten' (Lektion) und in Boss, Schnellrunde und Blitz, weil die Pools 'daten' enthalten. Die übrigen Seiten der Lektionen stimmen mit Legacy überein. Der Median-Generator ist durch eigene Tests geprüft (rechnung.test.js).
1. info-zahlen: Eingaben wie in Legacy normInput (Leerzeichen, 0x, führende Nullen). Die zwischenzeitlich strengere Prüfung ist zurückgenommen.
2. mathe: probCheck aus helfer ist strenger. "1/2/3" gilt nicht mehr als 0,5 (Legacy-Fehler).
3. Schreibmaschinenschrift (span.mono) ist durch b ersetzt, weil richText nur erlaubte Tags zeigt.
4. Die Fragen einer Runde werden neu gemischt (createRound). Die Auswahl der Fragen bleibt gleich.
5. Die Punkte sind über Konstanten geprüft (Herzen, XP, Combo). Der Legacy-Rundenmotor ist DOM-gebunden.
6. Reveal (Auflösung) wird nicht angezeigt; die Shell zeigt nur die Erklärung.

## Offen
- Veröffentlichung: GitHub Pages baut heute das Repo-Root (Dashboard und Legacy-Apps). Die Umstellung auf `dist/` braucht einen Workflow und ein Merge nach `main`. Das ist ohne Freigabe nicht gemacht.
- Legacy-Dateien (core/, apps/, dashboard.js) bleiben, bis die Umstellung freigegeben ist.
- Blitz: an den Rahmen gebunden (seiten/blitz.js, Auswertung in rahmen.js). Tests RULE-229, RULE-166, RULE-193, RULE-195. Browser-Test am Dev-Server für deutsch und mathe: Start, Antwort, Ablauf, Ergebnis, Verlassen. Tasten 1 bis 9 wählen die Antwort (wie Legacy).
- Sichtprüfung der Diagramme von deutsch und mathe im Browser nicht gemacht.
