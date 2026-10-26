# Abnahme Phase 5a (Pilot deutsch, geometrie, Vorlage): Prüfung

Stand: 2026-10-26. Build: `modernized/modulare-reimagined`, `npm run build`, Vorschau auf 127.0.0.1 (Port 4174, danach beendet).

## Automatisch

| Prüfung | Ergebnis | Notiz |
|---|---|---|
| Gesamtsuite `npm test` | 508 Tests, alle grün | inkl. apps/deutsch, apps/geometrie, apps/_template, apps/tests |
| RULE-165 deutsch | bestanden | jede Auswahl hat die richtige Antwort, jede Eingabe akzeptiert ihre Antwort |
| RULE-165 geometrie | bestanden | 300 Aufgaben je Seite, Zahlenprüfer und Auswahl |
| RULE-223 deutsch | bestanden | höchstens drei falsche Antworten, nie eine weitere, Antwort nicht immer an gleicher Stelle |
| RULE-229 deutsch und geometrie | bestanden | Lektion 8, Endgegner 12, Schnellrunde 5, Blitz Auswahl (200 Seeds) |
| Schuld 6 (geometrie) | bestanden | Erzeuger ohne brauchbare Aufgabe bricht nach 200 Versuchen mit Fehler ab |
| Durchlauf durch den Rahmen | bestanden | Lektion, Schnellrunde, Endgegner für deutsch und geometrie |
| Vorlage apps/_template | bestanden | Vertragstest: Runden und Blitz liefern gültige Fragen, Diagramm hat Alternativtext |
| Grenzen der Apps | bestanden | kein Math.random, kein document, keine Abhängigkeit zwischen Apps |
| Dual-Execution deutsch | 0 Abweichungen | 200 Seeds, 3600 Vergleiche, `node analysis/modulare/dual/deutsch_dual.mjs 200` |

Dual-Execution verglichen: Anzeige, Optionen, Antwort, Erklärung, Etikett, Ergebnis der Prüfer. Nicht verglichen: `reveal` (Legacy span.mk, Neubau b) und `promptStyle` (nur Neubau).

Punkte: der Legacy-Rundenmotor (`core/js/quiz.js`) ist DOM-gebunden und lässt sich nicht ohne Browser laufen. Verglichen sind deshalb die Konstanten: Herzen normal 5, Endgegner 3, Combo-Schritt 3 und Maximum ×4 (`regeln/src/constants.js` gegen `profile.js:73`), XP richtig 10, knapp 5, zweiter Versuch 5 (`runde/src/rules.js` gegen `quiz.js:113-126`), zweiter Versuch nur außerhalb des Endgegners und bei Herzen über 0.

## Browser (Vorschau)

| Prüfung | Ergebnis | Notiz |
|---|---|---|
| deutsch: Seite öffnen, Theorie, Übung starten | bestanden | Theorie mit Ziel, In 30 Sekunden, Merkzettel, Mini-Check |
| deutsch: Lückensatz, falsche Antwort | bestanden | Herzen 4 von 5, Erklärung, zweiter Versuch angehängt (9 Fragen) |
| deutsch: Diagramme | nicht im Browser gesehen | werden beim Laden gezeichnet (Integrationstest grün); Sichtprüfung offen |
| geometrie: Theorie mit Diagramm (Mittelsenkrechte) | bestanden | Diagramm 520 px breit, Minou 72 px |
| geometrie: Übung starten | bestanden | Frage 1 von 8, vier Optionen mit Zahlen als Text |
| 375 px, Theorie und Übung | bestanden | kein horizontales Scrollen, Optionen 44 px und höher |

Offen: Eingabefragen (Tippen) im Browser nicht geklickt, nur über Tests. Blitz nicht an den Rahmen gebunden (Phase 5b). Zahlen in geometrie-Optionen ohne Monospace (Auswahl nutzt nur erlaubte Tags, SEC-003).
