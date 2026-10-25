# Lernwerkstatt

Kleine Lern-Apps für Sira mit einem Dashboard als Startseite. Jede Seite hat eine Lektion mit Bild, Beispiel und Mini-Check, danach Übung mit Punkten, Sternen, Trophäen, Sammelkarten und Auffrisch-Erinnerung.

Live: https://foued611.github.io/lernapp-sira/

## Apps
| App | Fach | Ordner | Stand |
|---|---|---|---|
| Cahier de Verbes | Französisch | `apps/franzoesisch-verben/` | fertig |
| Zahlenwerkstatt | Informatik | `apps/informatik/` | fertig |
| Mathe-Werkstatt | Mathematik | `apps/mathe/` | fertig (8 Seiten) |
| Deutsch, Englisch, Physik | | | geplant |

## Lokal starten
```
npm run serve
```
Dann `http://localhost:8000` öffnen. Ein Doppelklick auf die Datei reicht nicht, weil ES-Module einen Webserver brauchen.

## Tests
```
npm install
npm test        # Unit- und Vertragstests
npm run smoke   # App im simulierten Browser durchspielen
```

## Weiterentwickeln
Aufbau, App-Vertrag und die Schritte für neue Apps stehen in [AGENTS.md](AGENTS.md). Neue Apps entstehen aus der Vorlage `apps/_template/`.

Der Fortschritt liegt in der Browser-Datenbank (IndexedDB) und wird nicht übertragen. Über "Fortschritt sichern" auf der Startseite einer App lässt er sich als Datei sichern und wieder einspielen.
