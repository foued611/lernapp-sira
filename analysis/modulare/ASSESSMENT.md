# Assessment: modulare

Datum: 2026-10-26
Quelle: `legacy/modulare` → `/Users/dghaies/Sites/lernapp-sira` (Branch `modernize/modulare`)
Methode: Lesen und Grep, Tests gelaufen (`npm test`, `npm run smoke` in einer Kopie). Keine Änderungen am Code.

## Executive Summary

Eine kleine, gut getestete Vanilla-JavaScript-Lernapp mit fünf Fach-Apps (rund 4,7 KSLOC JavaScript) und 122 Tests. Die Architektur trennt Inhalte (JSON in `content/`) von Logik, die Abhängigkeitsregeln halten. Das Risiko liegt in der Datenintegrität beim Speichern und Einspielen von Sicherungen (ein Fund mit Mittel, SEC-001) und in kopierten Rundenbausteinen. Empfehlung: Neu bauen mit React + Vite, wie im Ziel festgelegt. Der Umbau übernimmt Inhalte, Speicher-Logik und Tests als Vertrag.

## System Inventory

| Kennzahl | Wert | Hinweis |
|---|---|---|
| Quelldateien | 131 | JS, MJS, CSS, HTML, JSON, MD. Ohne Schriften, PDF, `node_modules` |
| Sprache | JavaScript (ES-Module) | 77 Dateien (JS und MJS), 13 CSS, 7 HTML |
| KSLOC (JS und MJS) | 4,72 | nicht-leere Zeilen |
| KSLOC (mit CSS und HTML) | 5,21 | |
| Komplexität | 776 Entscheidungszeilen in JS | Keyword-Methode (`if`, `for`, `while`, `case`, `catch`, `switch`, `?`, `&&`, `\|\|`). Kein `scc` installiert |
| Komplexität je KSLOC | 164 | nur innerhalb dieses Berichts vergleichbar |
| Komplexeste Dateien | `scripts/smoke.mjs` (41), `core/js/quiz.js` (37), `core/js/qtypes.js` (27), `core/js/validate.js` (23), `core/js/db.js` (21) | Keyword-Zählung |
| Tests | 16 Dateien, 122 Tests, alle grün | `npm test` |
| Smoke | 332 Prüfungen, 5 Apps | `npm run smoke` |
| Laufzeit-Abhängigkeiten | keine | nur devDependencies |
| Dev-Abhängigkeiten | ajv 8.20.0, esbuild 0.28.2, fake-indexeddb 6.2.6, jsdom 30.1.3 | Caret-Bereiche, kein Lockfile im Git |
| Abhängigkeits-Frische | nicht gemessen | ohne Netz keine Alters-Prüfung |
| Bekannte Sicherheitslücken | 0 bei den gesperrten Versionen | `npm audit --package-lock-only` |
| Doku-Abdeckung Code | 55 von 75 JS-Dateien (73 %) mit einleitendem Kommentar | heuristisch, erste Zeile |
| Architektur-Doku | `README.md`, `AGENTS.md`, `docs/` (4 Dateien) | |
| Daten | 24 JSON-Dateien in 6 Paketen unter `content/` | Schema: `schemas/bundle.schema.json` |
| Versionskontrolle | Git, 25 Commits auf `main` | |

## Architecture at a Glance

Elf Domänen, Details in `ARCHITECTURE.mmd`:

| Domäne | Dateien | Aufgabe |
|---|---|---|
| Einstieg (Dashboard) | 4 | Startseite, App-Kacheln, Tagesziel |
| Bootstrap und Inhalte | 4 | lädt, validiert und mischt das Paket mit `logic.js` |
| Shell und Ansichten | 4 | App-Rahmen, Routing, Start, Ergebnis, Sicherung |
| Rundenmotor | 4 | Herzen, Combo, zweiter Versuch, Blitz, Fragetypen |
| Spielregeln | 3 | XP, Level, Serie, Sterne, Trophäen |
| Speicher | 2 | IndexedDB mit Fallback, Sammlungen `docs` und `log` |
| Lektionen und Diagramme | 4 | Lektion, Standard-Theorie, Lernstränge, SVG |
| Gemeinsame Helfer | 5 | Escaping, Icons, Maskottchen, Konfetti, Zahlen |
| Fach-Apps | 44 | `mathe`, `geometrie`, `informatik`, `deutsch`, `franzoesisch-verben` plus Vorlage |

Keine Abhängigkeit zwischen Apps. `core/` kennt keine App. Kein hängender Import. Die Schlüssel `lernwerkstatt:profile` und `lernwerkstatt:app:<id>` verbinden Dashboard und Shell.

## Production Runtime Profile

Keine Telemetrie verfügbar (kein APM-Server, keine Laufzeit-Exporte). Der Abschnitt entfällt.

## Technical Debt (Top 10, nach Wert)

Datenintegrität:
1. **Stille Überschreibung bei Migrationsfehler.** `core/js/store.js:27` schluckt Lesefehler. `store.js:42-44` setzt bei fehlgeschlagener Migration Defaults, `store.js:51` schreibt sie beim nächsten `save()` über den Stand. Fix: Rohdaten sichern, bevor überschrieben wird.
2. **Nicht atomare Schreibvorgänge.** `core/js/db.js:68-71` (`logReplace`) leert das Log und fügt Einträge einzeln ein. `db.js:126-133` (`importAll`) schreibt Dokumente einzeln. Fix: eine `readwrite`-Transaktion pro Ersetzung. `db.js:57-59` löscht den localStorage-Eintrag vor dem Parsen.
3. **Sicherung verliert Ereignisse.** `db.js:122` exportiert nur die letzten 1000 Log-Einträge. `db.js:132` ersetzt beim Einspielen das gesamte Log. Die Obergrenze gilt nur im localStorage-Zweig (`db.js:91,93`). `db.js:109` wechselt bei Fehlern still den Speicher.

Duplikation:
4. **Rundengerüst sechsfach kopiert.** `apps/mathe/builders.js:333-346`, `apps/geometrie/builders.js:253-266`, `apps/deutsch/builders.js:60-70`, `apps/_template/builders.js:24-32`, dazu Varianten in `apps/informatik/builders.js:257-274` und `apps/franzoesisch-verben/builders.js:109-123`. Fix: gemeinsame Fabrik in `core/js/`.
5. **Bausteine je App neu.** `choice`/`typed` in vier Apps, `mono` und `filled` doppelt, `rnd` in `apps/informatik/numbers.js:9` als Kopie von `core/js/mathkit.js:5`. Theorie-Gerüst in `apps/informatik/theory.js:133-148` und `apps/franzoesisch-verben/theory.js:33-46` wiederholt `core/js/theory.js:6-18`.
6. **Unbegrenzte Schleife.** `apps/mathe/builders.js:323-329` und `apps/geometrie/builders.js:229-235` (`for (;;)`) würfeln, bis drei Falschantworten da sind. Bei zu wenig Pool hängt der Browser. Fix: Versuchsobergrenze mit Fehlermeldung und Test.

Struktur:
7. **Spielkonstanten verstreut.** Herzen, XP, Blitz-Zeiten und Schwellen stehen in `quiz.js`, `blitz.js`, `rounds.js`, `profile.js` (`profile.js:76` für 70 und 90 %). Das Label "−3 XP" in `quiz.js:99` ist fest. Fix: eine Konstantendatei.
8. **Startseite ohne Fehlerpfad.** `dashboard.js:9-16` und Aufruf `dashboard.js:77` ohne `catch`. Scheitert der Speicher, bleibt die Seite leer. `core/js/boot.js:21-24` zeigt dagegen eine Meldung.
9. **Zu große Funktionen.** `core/js/shell.js:19-167` (`mountApp`) und `core/js/quiz.js:66-214` (`startQuiz`, rund 150 Zeilen). `apps/mathe/builders.js` hat 346 Zeilen.
10. **Registry dupliziert Manifest.** `registry.js:25,34,43,53,62` pflegt `units` von Hand. `tests/registry.test.js:13` prüft nur `units > 0`. Aktuell stimmt es. Hex-Farben in `registry.js:10-15` liegen außerhalb von `core/styles/tokens.css`.

Totcode (echt, klein): `core/js/profile.js:6,9,25` (`PROFILE_KEY`, `TITLES`, `dayDiff` nur lokal genutzt), `core/js/views/home.js:8` (`starsHTML`). `core/js/db.js:115` (`resetDBForTests`) ist ein Test-Hook im Produktionsmodul.

Hinweis: Statische Prüfung, nicht gelaufen. Aufwand (Schätzung, nicht gemessen): Punkt 1 bis 3 je 1 bis 2 Stunden mit Tests, 4 bis 6 zusammen ein Nachmittag, 7 bis 10 je 30 bis 60 Minuten.

## Security Findings

Keine Zugangsdaten im Code. Keine `eval`-Aufrufe in der App. Keine externen Ressourcen. Fonts selbst gehostet.

| ID | CWE | Schwere | Ort | Fix |
|---|---|---|---|---|
| SEC-001 | CWE-79 (über CWE-20) | Mittel | `core/js/db.js:126-130` (`importAll` ohne Typprüfung). Senken: `core/js/shell.js:56-57`, `dashboard.js:31-32`, `dashboard.js:51`, `core/js/views/home.js:45`, `core/js/views/result.js:14` | Feldtypen in `importAll` prüfen. Zahlen mit `Number()`, Texte mit `esc()` ausgeben |
| SEC-002 | CWE-20 (ermöglicht CWE-601) | Niedrig | `core/js/validate.js:8`, genutzt `:29`, gerendert `core/js/views/home.js:49` | `\` ablehnen und Ursprung per `new URL(...)` prüfen. Testfall in `tests/content.test.js:48` |
| SEC-003 | CWE-79 | Niedrig heute, Mittel mit Inhalte-API | `core/js/lesson.js:26,30,31,36,41,42,44`, `core/js/qtypes.js` `questionParts()`. `validate.js` prüft `html` und `svg` nicht | Allow-list-Bereinigung bei Paket-Ladung oder in der Veröffentlichung. Siehe Doku-Lücke 1 |
| SEC-004 | CWE-693 | Niedrig | `index.html` und alle `apps/*/index.html` ohne CSP | `<meta http-equiv="Content-Security-Policy">` mit `script-src 'self'`, `object-src 'none'`. `unsafe-inline` für Stile bleibt |
| SEC-005 | CWE-668 | Niedrig (nur Entwicklung) | `package.json:8` (`serve`) | `python3 -m http.server 8000 --bind 127.0.0.1` |
| SEC-006 | CWE-829 | Niedrig (nur Entwicklung) | `package.json:11-16` Caret-Bereiche, `.gitignore:2` schließt Lockfile aus | Lockfile committen, `npm audit` in CI |
| SEC-007 | CWE-312 | Niedrig (Absicht) | `core/js/views/backup.js:4-7`, Name `core/js/shell.js:122` | Name aus dem Export streichen oder in den Datenschutz-Hinweisen nennen |

## Documentation Gaps (Top 5)

Verglichen: was der Code tut gegen was `AGENTS.md` und `README.md` sagen.

1. **Doku verspricht eine Prüfung, die fehlt.** `AGENTS.md:66`: HTML-Felder "werden vor dem Einspielen geprüft". `core/js/validate.js` prüft `html` und `svg` nicht (vergleiche SEC-003).
2. **Sicherung ersetzt das ganze Protokoll.** `AGENTS.md:125` sagt nur "stellt es wieder her". Export umfasst nur 1000 Einträge (`db.js:122`), Einspielen ersetzt das Log (`db.js:132`).
3. **Migrationsfehler setzt Defaults.** `store.js:42-44` und `store.js:51`. Nicht beschrieben.
4. **Speicherwechsel ohne Folgen-Hinweis.** `AGENTS.md` beschreibt den Wechsel auf localStorage oder Arbeitsspeicher. Nicht dokumentiert: dass dabei der Stand einer Seite fehlen kann (`db.js:109`).
5. **Name im Export.** SEC-007. Datenschutz ist nur für eine spätere Synchronisation erwähnt (`AGENTS.md`, Abschnitt Inhalte und Daten), nicht für den lokalen Export.

## Relative Scale

Index (2,94 × KSLOC^1,10): **16,2** für JS und MJS, **18,1** mit CSS und HTML. Relative Skala zum Ranking gegen andere Systeme. Kein Zeitplan, kein Aufwand, keine Kosten.

## Recommended Modernization Pattern

**Rebuild** → `reimagine`. Passt zu deinem Ziel "Neu bauen" mit React + Vite.

Begründung: Der Code ist klein (4,7 KSLOC) und durch 122 Tests und einen Smoke-Test über alle Apps abgesichert. Inhalte (`content/`), Speicher-Logik und Tests sind klare Verträge und bleiben. Die Ansichten sind Vanilla-DOM-Strings und das Rundengerüst ist kopiert. Das sind die Teile, die ein Umbau auf Komponenten ohnehin neu macht. Alternative, nicht als Befehl vorgesehen: erst im Bestand aufräumen (Debt 1 bis 3 zuerst), dann neu bauen. Das ist deine Entscheidung.

Vor `reimagine`: Debt-Punkte 1 bis 3 und SEC-001 als Anforderungen in den Auftrag aufnehmen, damit der Umbau sie nicht übernimmt.
