# Vorprüfung: modulare

Datum: 2026-10-26
Quelle: `legacy/modulare` → `/Users/dghaies/Sites/lernapp-sira` (Symlink, angelegt mit `--source`)
Ziel-Stack: React + Vite

## Antworten (Mensch)

1. **Umfang:** Komplettes System
2. **Build & Test lokal:** Ja, npm test läuft
   - Offen: Wie lange dauert die CI? Nicht beantwortet, bitte nachtragen.
3. **Eigene Build-Infrastruktur:** Nein, Standard npm
4. **Frühere Versuche:** Nein, erster Versuch
5. **Tabu in diesem Durchgang:** Nichts, alles darf geändert werden
   - Hinweis: `AGENTS.md` schreibt vor, gespeicherte IDs (Apps, Seiten, Trophäen) nie umzubenennen, weil der Lernstand sie als Schlüssel nutzt. Bitte bei `brief` bestätigen, dass das gilt.

## Check 6: Scope-Grenze

Eigenständiges Repo. `git rev-parse --show-toplevel` ergibt den Repo-Ordner selbst. Keine Sibling-Manifeste in `~/Sites` verweisen auf `lernapp-sira`. Keine ausgehenden Abhängigkeiten.

## Übersicht

| Check | Status | Befund | Fix |
|---|---|---|---|
| 0 Antworten | ✅ | 4 von 5 beantwortet, CI-Dauer offen | CI-Dauer nachtragen |
| 1 Stack | ✅ | Vanilla JS als ES-Module: 74 JS, 3 MJS, 26 JSON, 13 CSS, 7 HTML, 7 MD, 7 WOFF2, 1 PDF, 3 TXT (144 Dateien). Tests: `node --test`, jsdom, ajv, fake-indexeddb, esbuild | — |
| 2 Werkzeuge | ⚠️ | `python3` 3.15 ✅, `node` v24.18 ✅, `npm` 11.16 ✅. `scc` fehlt (LOC über `find` + `wc`, COCOMO grob), `cloc` fehlt, `lizard` fehlt (Komplexität aus Schlüsselwörtern geschätzt) | `brew install scc`; `pipx install lizard` (optional) |
| 3a Build-Definition | ✅ | Keine CI-Datei (`.github/workflows` fehlt), kein `.npmrc`, kein `.nvmrc`. Build = npm-Skripte: `test`, `smoke`, `serve`. Veröffentlichung: GitHub Pages aus `main`, ohne Build | — |
| 3b Smoke Level 2 (Ist-Stand) | ✅ | In Kopie (`git archive HEAD`, nicht in `legacy/`): `npm install` ok, `npm test` ok, `npm run smoke` ok (332 Prüfungen, 5 Apps) | — |
| 3b Ziel-Stack React + Vite | ✅ | Wegwerf-Projekt: `npm create vite@latest --template react`, `npm run build` ok, `vitest` mit einem Test grün | — |
| 4 Quellvollständigkeit | ✅ | 71 eindeutige relative Imports; alle 5 Apps laden im Smoke-Test. Keine Deployment-Deskriptoren nötig (kein JCL, kein Routing-Server). Datenschema `schemas/bundle.schema.json` vorhanden | Nur 1 PDF im Repo, Inhalt nicht geprüft |
| 5 Optional | ✅ | Kein APM. Git vorhanden, 25 Commits | — |
| 6 Scope | ✅ | Eigenständiges Repo | — |
| 7 Schutz vor Änderungen | ⚠️ | Keine `permissions.deny` in `.claude/`, keine in `~/.claude/settings.json`. Symlink zeigt auf das Arbeits-Repo selbst | Siehe unten |

### Check 7 im Detail

Der Symlink `legacy/modulare` zeigt auf das Repo, in dem auch `analysis/` und die Arbeit stattfinden. Eine Deny-Regel für das echte Ziel (`Edit(//Users/dghaies/Sites/lernapp-sira/**)`) würde das gesamte Projekt sperren, auch `analysis/`. Deshalb wird sie hier nicht empfohlen. Die Regel `Edit(/legacy/**)` würde nur den Link-Pfad schützen, nicht die Dateien selbst. Der Schutz des Quellcodes ist damit nur Konvention.

Empfehlung: `legacy/modulare` als unabhängige Kopie anlegen (z. B. `git clone` des Repos nach `legacy/modulare`). Dann greift `Edit(/legacy/**)` sauber, und das Arbeits-Repo bleibt beschreibbar. Das entscheidest du, ich ändere den Link nicht von selbst.

## Bereitschaft je Befehl

| Befehl | Urteil | Begründung |
|---|---|---|
| `assess` | Ready-with-gaps | `scc` und `lizard` fehlen, Fallback greift |
| `map` | Ready | python3 vorhanden |
| `extract-rules` | Ready | python3 vorhanden |
| `brief` | Ready | Nur Discovery-Artefakte nötig. Vor dem Start: CI-Dauer und Tabu-Hinweis klären |
| `reimagine` | Ready | Ist-Build grün, Ziel-Stack grün |
| `harden` | Ready-with-gaps | Kein SAST-Werkzeug gefunden. `npm audit` möglich, noch nicht gelaufen |
| `verify` | Ready | python3 vorhanden |

Keine Befehle „Not ready".

## Wichtigster Fix

Check 7: Quelle und Arbeits-Repo sind dasselbe. Empfehlung: Kopie unter `legacy/modulare` anlegen, bevor `reimagine` startet.

Nächster Schritt: `/code-modernization:modernize-assess modulare`
