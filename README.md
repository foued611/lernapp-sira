# Lernwerkstatt

Kleine Lern-Apps für die 7. Klasse mit einem Dashboard als Startseite. Jede Seite hat eine Lektion mit Bild, Beispiel und Mini-Check, danach Übung mit Punkten, Sternen, Trophäen, Sammelkarten und Auffrisch-Erinnerung.

Live: https://foued611.github.io/lernapp-sira/ (wird aus `dist/` des Neubaus per GitHub Actions veröffentlicht, siehe `.github/workflows/pages.yml`)

## Apps
| App | Fach | Ordner | Stand |
|---|---|---|---|
| Cahier de Verbes | Französisch | `apps/franzoesisch-verben/` (Neubau: `apps/fr-verben/`) | fertig |
| Zahlenwerkstatt | Informatik | `apps/informatik/` (Neubau: `apps/info-zahlen/`) | fertig |
| Mathe-Werkstatt | Mathematik | `apps/mathe/` | fertig (9 Seiten) |
| Geometrie-Werkstatt | Mathematik | `apps/geometrie/` | fertig (8 Seiten) |
| Deutsch-Werkstatt | Deutsch | `apps/deutsch/` | fertig (6 Seiten) |
| Englisch-Werkstatt | Englisch | nur Neubau: `modernized/modulare-reimagined/apps/englisch/` | fertig (16 Seiten, Units 1 bis 5 aus English G Access 3) |
| Découvertes-Werkstatt | Französisch | nur Neubau: `modernized/modulare-reimagined/apps/decouvertes/` | fertig (20 Seiten, Grammatik der Unités 1 bis 7 aus Découvertes 2) |
| Physik-Werkstatt | Physik | `modernized/modulare-reimagined/apps/physik/` | fertig (16 Seiten: Akustik, Optik, Mechanik nach BP Klasse 7/8) |

## Neubau (React und Vite)

Der Neubau liegt in `modernized/modulare-reimagined/`. Dort sind alle fünf Live-Apps umgezogen: Deutsch, Geometrie, Mathe, Zahlenwerkstatt und Cahier de Verbes.

```
cd modernized/modulare-reimagined
npm install
npm run dev         # Entwicklungsserver
npm test            # alle Tests, inkl. Smoke über alle Apps
npm run build       # erzeugt dist/
npm run preview     # dist/ lokal ansehen
```

## Frühere Fassung

Der bisherige Code (ohne React) ist seit 2026-10-28 nicht mehr in `main`. Er bleibt im Branch `legacy` erhalten.

## Weiterentwickeln
Aufbau, App-Vertrag und die Schritte für neue Apps stehen in [AGENTS.md](AGENTS.md). Neue Apps entstehen aus der Vorlage `apps/_template/` und `content/vorlage/`. Inhalte (JSON in `content/`) und Logik (`apps/<name>/logic.js`) sind getrennt, damit die Inhalte später aus einer Datenbank kommen können: [docs/inhalte.md](docs/inhalte.md).

Der Fortschritt liegt in der Browser-Datenbank (IndexedDB) und wird nicht übertragen. Über "Fortschritt sichern" auf der Startseite einer App lässt er sich als Datei sichern und wieder einspielen.
