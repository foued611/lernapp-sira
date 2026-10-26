# Baseline: modulare (Legacy, vor Phase 1)

Stand: 2026-10-26. Branch `modernize/modulare`, Commit `1c7495d`. Der Code-Baum (apps, core, content, tests, scripts, index.html, dashboard, registry) ist unverändert gegenüber dem Commit.

| Prüfung | Ergebnis | Befehl |
|---|---|---|
| Unit- und Vertragstests | 122 bestanden, 0 fehlgeschlagen | `npm test` |
| Durchspiel über alle Apps | 332 Prüfungen, 5 Apps, „ALLE OK“ | `npm run smoke` |

Diese Zahlen sind der Vergleichswert für Phase 1 (Brief §3, Eingangskriterium) und für jede spätere Phase, die dieselben Tests übernimmt.
