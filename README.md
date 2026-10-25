# Lernwerkstatt

Kleine Lern-Apps für Sira mit einem Dashboard als Startseite. Theorie, direkt danach Übung, dazu Punkte, Sterne und Trophäen.

Live: https://foued611.github.io/lernapp-sira/

## Apps
| App | Fach | Ordner | Stand |
|---|---|---|---|
| Cahier de Verbes | Französisch | `apps/franzoesisch-verben/` | fertig |
| Zahlenwerkstatt | Informatik | `apps/informatik/` | fertig |
| Mathe, Deutsch, Englisch, Physik | | | geplant |

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

Der Fortschritt liegt im Browser (localStorage) und wird nicht übertragen.
