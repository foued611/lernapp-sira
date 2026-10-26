# Abnahme Phase 4 (Rahmen und Startseite): Browser-Prüfung

Stand: 2026-10-26. Build: `modernized/modulare-reimagined`, `npx vite build`, Vorschau auf 127.0.0.1 (Port 4174, danach beendet).

| Prüfung | Ergebnis | Notiz |
|---|---|---|
| 375 px Breite, hell | bestanden | kein horizontales Scrollen (scrollWidth 375 = clientWidth 375) |
| 375 px Breite, dunkel | bestanden | Startseite lesbar, keine Überläufe |
| Startseite ohne Fach-Apps | Kacheln zeigen „Inhalte konnten nicht geladen werden“ | erwartet: die Fach-Apps (Phase 5) liefern noch keine Logik, `defaultLogic` ist leer |
| Content Security Policy (SEC-004) | bestanden | Seite lädt und rendert unter der CSP, Inhalte kommen mit 200 |
| Tastatur, sichtbarer Fokus, Touch-Ziele 44 px | bestanden | Tab-Reihenfolge Chips → Sicherung; Fokusrahmen 3 px solid; Name-Feld absendbar mit Enter; alle Buttons und Eingabefelder 44 px hoch |
| Name maskiert, Sicherung mit Hinweis | bestanden | Kopf zeigt „Hallo, •••!“; Hinweis „Die Datei enthält deinen Namen.“ am Sicherungsknopf. Der Sicherungsknopf selbst wurde nicht geklickt (Download) |

Nicht Teil von Phase 4: Theorie und Blitz sind nicht an den Rahmen gebunden, weil es noch keine Fach-Apps mit Logik gibt (Phase 5).

Behobene Fehler bei dieser Prüfung:
1. `seiten/seiten.css`: `.seiten` ohne `minmax(0, 1fr)`, dadurch 384 px breit. Behoben.
2. `seiten/seiten.css`: Dateiauswahl (`.file-pick`) 366 px breit. Behoben.
3. `seiten/seiten.css`: Akzentrand links an `.notice` (Design-Hook). Durch getönte Fläche mit Vollrahmen ersetzt.
