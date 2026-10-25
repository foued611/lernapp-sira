# Lernapp Sira

Sammlung kleiner Lern-Apps mit einem Dashboard als Startseite.

- `index.html`: Dashboard mit Tagesziel, Statistik und Links zu allen Apps
- `apps.js`: Register aller Apps (hier neue Apps eintragen)
- `apps/<name>/index.html`: je eine App, komplett eigenständig (eine Datei)

## Neue App hinzufügen
1. Ordner `apps/<name>/` mit einer `index.html` anlegen.
2. In `apps.js` einen Eintrag ergänzen (`status: 'live'`, `href`, optional `storageKey` und `progress()` für die Fortschrittsanzeige).
3. Committen und pushen. GitHub Pages veröffentlicht automatisch.

Der Fortschritt liegt im Browser (localStorage). Alle Apps unter derselben Adresse teilen sich den Speicher, deshalb kann das Dashboard den Fortschritt der Apps anzeigen. Jede App braucht einen eigenen, eindeutigen `storageKey`.

## Apps
| App | Fach | Ordner |
|---|---|---|
| Cahier de Verbes | Französisch | `apps/franzoesisch-verben/` |
