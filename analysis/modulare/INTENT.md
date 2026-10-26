# Modernisierungsziel: modulare

Datum: 2026-10-26

## Ziel

Modus: **Neu bauen** (reimagine). Die App wird auf einer neuen Architektur von Grund auf neu gebaut.

## Von (heute)

- Repo: `/Users/dghaies/Sites/lernapp-sira` (Quelle, angegeben als `--source`)
- Vanilla JavaScript als ES-Module, kein Framework, kein Build-Schritt
- 5 Lern-Apps plus Dashboard, Inhalte als JSON in `content/`, Logik in `core/` und `apps/`
- Speicher: IndexedDB im Browser

## Nach (Ziel)

- Stack: **React + Vite**
- Ziele aus dem Auftrag: modularer Aufbau, wiederverwendbare Komponenten, Datenschicht getrennt von der Business-Logik, Standard-Framework, einfach halten, saubere und nachhaltige Architektur

## Muss gleich bleiben (Antworten wörtlich)

- Altes System läuft weiter
- Bekannte Fehler mit beheben
- Sicherheitsprüfung zuerst

## Auftrag wörtlich

modulare aufbau, wiederverwenbare komponente , daten layer vom Business logic trennnen
nutze standart framework , keep it simple achte auf ein saubere und nachhaltige software architektur

## Konflikte mit dem bestehenden Projekt

- Erledigt (2026-10-26): `AGENTS.md` und `docs/inhalte.md` erlauben React + Vite für den Umbau. Bis dahin bleibt der Code Vanilla JS. TypeScript bleibt ausgeschlossen.
- Offen für den Umbau: GitHub Pages veröffentlicht heute den Repo-Ordner direkt. Mit Vite braucht es einen Build und einen Deploy von `dist/`. Das gehört in den Umbau-Plan, nicht in diese Regel.
- `AGENTS.md`: gespeicherte IDs (App, Seiten, Trophäen) werden nie umbenannt. Der Umbau muss die IndexedDB-Daten und die Sicherungsdatei weiter lesen können.
