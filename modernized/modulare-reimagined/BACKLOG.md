# Backlog Neubau (modernized/modulare-reimagined)

Stand: 2026-10-30. Quelle: Architektur-Review, Design-Kritik und offene Punkte aus `analysis/modulare/PARITAET.md`.

Schätzungen sind Schätzungen, keine Messungen. Aufwand in Entwicklertagen (d), ohne Puffer für Browser-Tests.

Status: `offen`, `in Arbeit`, `erledigt`, `verworfen`.

## A. Architektur: Erweiterbarkeit (vor weiteren Apps)

| ID | Thema | Beschreibung | Grund (Fundstelle) | Aufwand | Abhängig von | Status |
|---|---|---|---|---|---|---|
| A-1 | App-Katalog als Daten | App-Liste aus `content/<id>/manifest.json` (`subject`, `status`, `desc`) bauen. `seiten/registry.js` und `apps/index.js` nicht mehr von Hand pflegen. Test: Katalog und Logik stimmen überein. | Drei Quellen: `seiten/registry.js:22-28`, `apps/index.js:10`, `content/`. | 1–2 d | – | erledigt (Feld `catalog` im Manifest, `katalog.mjs`, `inhalte/src/katalog.js`) |
| A-2 | Klassenstufe im Schema | Optionales Feld `klasse` (Default 7) in `schemas/bundle.schema.json` und im Manifest. Startseite gruppiert nach Klasse. Keine Änderung an IDs. | Kein Modell für weitere Klassen. | 1 d | A-1 | erledigt, anders als geplant: `klassen` als Liste im Katalog, dazu `groups[].klasse`, weil BW Klasse 7/8 als Doppelstufe führt. Regeln in `AGENTS.md`, Abschnitt Klassen. |
| A-3 | Profil mit Klassenbezug | `profileDefaults` um `klasse` erweitern. Migration für bestehende Profile (Default 7). Spätere Mehrprofil-Fähigkeit vorbereiten. | `seiten/rahmen.js:33`: ein Profil pro Browser. | 1–2 d | A-2 | erledigt für `klasse` im Profil, ohne Migration (neue Standardfelder kommen beim Laden dazu). Mehrprofil-Fähigkeit offen. |
| A-4 | Lazy Laden der Apps | Boot lädt nur Startseite und Kacheln. Inhalte, Logik und CSS einer App erst beim Öffnen laden. | `seiten/boot.js:107-109`: alle Apps parallel beim Start. | 0,5–1 d | A-1 | erledigt (Hauptpaket 422 kB auf 293 kB, `apps/index.js`) |
| A-5 | Ereignisprotokoll begrenzen | Protokoll in IndexedDB mit Index auf `app`. Obergrenze oder Rotation wie bei `SEEN_MAX`. | `speicher/src/backend-storage.js:57` hängt die ganze Liste neu an. `log.js:21-23` liest alles. | 1 d | – | offen |
| A-6 | `rahmen.js` aufteilen | Sitzungszustand (`sitzung.js`), Auswertung und Speicherung (`auswertung.js`), Rahmen-UI. Datei ist 485 Zeilen. | `seiten/rahmen.js`, größte Datei im Neubau. | 1–2 d | – | erledigt (`seiten/ablauf.js` ohne React, `rahmen.js` zeichnet) |
| A-7 | Stammdaten-Vertrag dokumentieren | Eine Seite in `docs/`, welche Datei welche Quelle ist (Katalog, Logik, Inhalt, Speicher). Ergänzt `CLAUDE.md`. | Architektur-Review. | 0,5 d | A-1 | offen |

## B. Speicher und Daten

| ID | Thema | Beschreibung | Grund | Aufwand | Abhängig von | Status |
|---|---|---|---|---|---|---|
| B-1 | Sicherung für mehrere Profile | Sicherung und Einspielen mit Klasse und Profil-Kennung. Altdateien bleiben lesbar. | Folgt aus A-3. | 1 d | A-3 | teils erledigt: `klasse` steht in der Sicherung (Test `SEITE-KLASSE`). Profil-Kennung offen, bis es mehrere Profile gibt. |
| B-2 | Speicher-Fallback klar anzeigen | Ohne IndexedDB: Hinweis, welche Daten verloren gehen. Test für Arbeitsspeicher-Modus. | Bereits als Meldung da (`boot.js`), Ausbau offen. | 0,5 d | – | offen |
| B-3 | Speicher-Grenze prüfen | Test: kein `localStorage` und kein `indexedDB` außerhalb `speicher/`. Heute nur manuell geprüft. | `inhalte/src/cache.js` nennt beides nur im Kommentar. Test verhindert Rückfall. | 0,5 d | – | erledigt (`speicher/tests/grenze.test.js`) |

## C. Neue Schulstufen und Inhalte

| ID | Thema | Beschreibung | Grund | Aufwand | Abhängig von | Status |
|---|---|---|---|---|---|---|
| C-1 | Erste Apps für Klasse 8 | Pilot-App mit `klasse: 8`. Inhalt nach Lehrplan BW Klasse 8, Abgleich in `docs/`. Fachliche Prüfung durch Lehrkraft vorher. | Ziel: Ausbau auf weitere Klassen. | 3–5 d je App | A-2 | offen |
| C-2 | Lehrplan-Abgleich je Klasse | Dokumente wie `docs/lehrplan-mathe.md` für jede neue Klasse. | Fachliche Richtigkeit hat Vorrang (AGENTS). | 1 d je Fach | C-1 | offen |
| C-3 | Dual-Prüfung mit Prefix-Check auf alle Apps | Zahlenwerk und Mathe prüfen nur, ob die Legacy-Runde eine Dublette hat. Geometrie prüft zusätzlich, dass vor der ersten Dublette alles gleich ist. Diese Prüfung übernehmen. | `analysis/modulare/dual/*.mjs`, `PARITAET.md`. | 0,5 d | – | erledigt (Zahlenwerk, Mathe, Geometrie) |
| C-4 | Dual-Prüfung für Französisch und Deutsch | Skripte für `fr-verben` und `deutsch` gegen Legacy. Vorhanden sind `fr-verben_dual.mjs` und `deutsch_dual.mjs`, Ergebnisse fehlen in `PARITAET.md`. | `analysis/modulare/dual/`. | 0,5 d | C-3 | offen |

## D. Design und Barrierefreiheit

| ID | Thema | Beschreibung | Grund | Aufwand | Abhängig von | Status |
|---|---|---|---|---|---|---|
| D-1 | Hellmodus prüfen | Startseite, App-Startseite, Übung, Ergebnis im hellen Schema bei 375 px und 1280 px. | Design-Kritik hat nur Dunkelmodus geprüft. | 0,5 d | – | erledigt bei 375 px (Startseite, Übung hell; App-Start, Übung, Ergebnis dunkel). Offen: Ergebnis hell, App-Start hell bei 1280 px. |
| D-2 | Lektions-Diagramme prüfen | Alle Diagramme im Browser bei 375 px auf Lesbarkeit und Überlauf prüfen. | Nicht in der Kritik enthalten. | 0,5 d | – | erledigt bei 375 px (mathe, geometrie, fr-verben, englisch, decouvertes-2, info-zahlen, deutsch). Bei 1280 px geprüft: englisch (16), decouvertes-2 (20), info-zahlen (6), deutsch (15). Kein Überlauf, kleinste Schrift 13,4 px. |
| D-3 | Kontrast der Fach-Etiketten | Etiketten in den Kacheln und der Weiter-Karte auf Kontrast messen (WCAG AA). | Kritik: 12 px, gedämpft. Auf 13 px umgestellt. Gemessen: alle über 4,5:1. `.tile.soon` nutzt keine `opacity` mehr, sondern `--muted`. | 0,25 d | – | erledigt |
| D-4 | Kopfleiste mobil neu bewerten | Entscheiden, ob die nicht-sticky Kopfleiste bleibt oder eine kompakte sticky Leiste kommt. Abweichung von Legacy ist in `PARITAET.md` dokumentiert. | `base.css` (Media ≤ 520 px). | 0,5 d | – | entschieden: Kopfleiste bleibt nicht-sticky (Titel und Zurück stehen oben im Fluss, kein Inhalt wird verdeckt). Abweichung von Legacy bleibt in `PARITAET.md`. |
| D-5 | Namensfeld und Platzhalter | Klären, ob der Platzhalter `•••` für Kinder verständlich ist. Vorschlag nur nach Rückmeldung von Schülerinnen und Schülern. | Maskierung ist Absicht (SEITE-MASKIERUNG). Kein Code vor Entscheidung. | 0,25 d | – | offen, braucht Rückmeldung von Schülerinnen und Schülern |
| D-6 | Pixel-Parität nach Design-Änderungen | Theorie-Seiten erneut gegen Legacy messen (1280 px und 375 px), nachdem Kopfleiste und Ziel-Text geändert wurden. | `PARITAET.md`: Abweichung durch mobile Header-Änderung. | 0,5 d | D-4 | offen, Messung gegen Legacy-Stand nicht gemacht |
| D-7 | Kontrast hell: Knopf und Erfolgstext | Hell: `btn-fg` auf `btn-bg` 4,11 zu 1, `ok` auf `card` 4,08 zu 1. Nötig 4,5 zu 1 für normalen Text. Neu: `btn-bg` `#D42A4D` (4,96 zu 1), `ok` `#0B7A57` (5,34 zu 1). Test prüft alle Paare (`seiten/tests/a11y.test.js`). | Gefunden beim Entfernen der Legacy-Tokens. | 0,25 d | – | erledigt |
| D-8 | Touch-Ziel „← Zum Lernpfad“ | `.link.back` misst 33 px hoch, nötig 44 px. | Prüfung im Browser, Stand 2026-10-27. | 0,1 d | – | erledigt: `.link`, `.chip`, `.brand`, `.alla`, `.x` mindestens 44 px. Test in `seiten/tests/a11y.test.js`. |

## E. Lernen unterstützen (LLM-Agent)

| ID | Thema | Beschreibung | Grund | Aufwand | Abhängig von | Status |
|---|---|---|---|---|---|---|
| E-0 | Datenschutz-Klärung | Auftragsverarbeitung, Datenschutz-Folgenabschätzung, Speicherung von Chats, Minderjährige. Entscheidung dokumentieren. | AGENTS: neue externe Dienste nur nach Absprache. | extern, nicht schätzbar | – | offen |
| E-1 | Modell-Entscheidung | Server-Proxy mit Modell-API oder Modell im Browser (WebLLM). Abwägung Datenschutz, Kosten, Ladezeit. | Pages ist statisch, API-Schlüssel dürfen nicht im Browser liegen. | 1 d | E-0 | offen |
| E-2 | Prompt-Modul als reine Funktion | Modul `agent/` ohne UI und ohne Netz. Baut Prompt aus Frage, falscher Antwort und Lektionstext. Tests wie bei `regeln/`. Name nie senden. | Architektur-Review, Abschnitt Agent. | 1–2 d | E-1 | offen |
| E-3 | Einhängen nach der Antwort | Hilfe-Knopf nach falscher Antwort, zusätzlich zur festen `why`-Erklärung. Als KI-Antwort gekennzeichnet. | `seiten/rahmen.js` `answer()`. | 1–2 d | E-2 | offen |
| E-4 | Antworten gegen Schlüssel prüfen | Modellantworten dürfen nicht als richtige Lösung gelten. Nur Hinweise, keine Bewertung. Test mit festen Beispielen. | Sicherheit und Fachlichkeit. | 1 d | E-3 | offen |
| E-5 | Chat-Verlauf lokal | Verlauf nur im Speicher des Browsers, mit Löschknopf. Nicht in der Sicherung, nicht im Protokoll. | Personenbezogene Daten. | 1 d | E-3, B-1 | offen |
| E-6 | Rate-Limit und Fehlerfall | Proxy: Begrenzung je Sitzung. Oberfläche: Fehler ohne Abbruch der Übung. | Kosten und Stabilität. | 1 d | E-1 | offen |

## F. Offene Entscheidungen

| ID | Thema | Beschreibung | Status |
|---|---|---|---|
| F-1 | RULE-243: Wiederholung direkt nach dem letzten Fehler | Bleibt bewusst so. Entscheidung der Person prüfen, sobald Schulerfahrung vorliegt. | offen |
| F-2 | Repo-Name und GitHub-Benutzer in URLs | Pages-Adresse hängt daran. Umbenennen nur mit Weiterleitung und Abstimmung. | offen |
| F-3 | Legacy-Branch `legacy` | Aufbewahren oder archivieren. Entscheidung der Person. | offen |

## Reihenfolge (Vorschlag)

1. A-1, A-2, A-7 (Katalog und Klassen als Daten)
2. C-3 (Dual-Prüfung vereinheitlichen), B-3 (Speicher-Grenze testen)
3. A-3, B-1, A-5 (Profil, Sicherung, Protokoll)
4. A-4, A-6 (Laden und Aufteilung)
5. D-1 bis D-6 (Design-Nacharbeit, Parität)
6. E-0 zuerst klären, danach E-1 bis E-6
7. C-1 bis C-4 (Inhalte für weitere Klassen), wenn A-Punkte stehen
