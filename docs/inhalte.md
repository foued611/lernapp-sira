# Inhalte, Datenvertrag und Datenbank-Anbindung

Stand: Entscheidung zur Trennung von Daten und Logik. Die Datenbank selbst ist noch nicht gewählt. Dieses Dokument legt fest, **was** eine Datenbank später liefern muss, nicht **wo** sie läuft.

## Ziel

Inhalte (Seiten, Lektionen, Trophäen, Aufgabendaten) sollen ohne Code-Änderung austauschbar sein, am Ende aus einer Datenbank. Der Lernstand von Sira (XP, Sterne, Protokoll) bleibt bewusst lokal im Browser (IndexedDB).

## Aufteilung

| Was | Wo | Beispiele |
|---|---|---|
| Inhalt | `content/<id>/*.json` → später Datenbank | Seitentitel, Lektionstexte, Merkzettel, Trophäen, Faktenpools, Verblisten |
| Logik | `apps/<name>/logic.js`, `builders.js`, `diagrams.js` | Zufallsaufgaben, Prüfer, SVG-Diagramme, Theorie-Spielzeuge |
| Kern | `core/js/` | Quiz-Motor, Spielregeln, Ansichten, Speicher, Inhaltsquellen |
| Lernstand | IndexedDB im Browser | XP, Sterne, Trophäen, Protokoll |

Merksatz: Wer Text ändert, fasst nur `content/` an. Wer eine neue Art von Aufgabe braucht, schreibt Code.

## Das Inhaltspaket

Eine Quelle liefert pro App ein Paket `{ manifest, lessons, badges, data }`. Die genaue Form steht in `schemas/bundle.schema.json`, `npm test` prüft jedes Paket in `content/` dagegen.

- **manifest**: `schema` (Version, heute 1), `id`, `title`, `greeting`, `intro`, optional `bossTitle`, `words`, `inputChars`, `resources[]` (Material zum Öffnen oder Ausdrucken, z. B. PDF: `{ title, desc?, href }`, `href` nur relativ), `units[]`, `notes{}`.
- **lessons**: je Seite genau eine Lektion mit `goal`, `tldr`, `analogy`, `figure`, `steps`, `pitfall`, `rule`, `check`. Bilder sind Verweise auf Diagramm-Funktionen der App, kein eingebettetes SVG.
- **badges**: `{ id, n, d, rule }`. Die Regel ist ein Datenobjekt (`core/js/rules.js`), kein Code. So kann eine Datenbank Trophäen speichern, ohne Code auszuführen.
- **data**: freie Aufgabendaten. Ihre Form legt `logic.js` fest und wird nur dort interpretiert.

## Quellen austauschen

```js
import { createStaticSource, createHttpSource, withCache } from './core/js/content.js';

createStaticSource(baseUrl)          // heute: content/<id>/{manifest,lessons,badges,data}.json
createHttpSource(apiUrl, fetch, hdr) // später: GET <api>/apps/<id>/content → Paket als JSON
withCache(source)                    // legt das Paket in IndexedDB ab, liefert es offline von dort
```

Umschalten ohne Codeänderung: In der `index.html` einer App `<meta name="lw-content-api" content="https://…">` eintragen. Fehlt die Angabe, gelten die JSON-Dateien. Jede Quelle prüft das Paket mit `assertBundle`, bevor die App es sieht.

## Abbildung auf eine Datenbank (Skizze)

Relational (z. B. PostgreSQL) oder Dokument-basiert: beides trägt das Paket. Die API baut aus den Zeilen das Paket zusammen.

| Tabelle | Wichtige Spalten |
|---|---|
| `apps` | `id` (stabil), `title`, `greeting`, `intro`, `boss_title`, `words` (JSON), `schema_version` |
| `units` | `app_id`, `id` (stabil), `position`, `title`, `de`, `ic`, `color`, `card_name`, `card_fact` |
| `notes` | `app_id`, `unit_id`, `position`, `heading`, `text` |
| `lessons` | `app_id`, `unit_id`, `body` (JSON gemäß Schema) |
| `badges` | `app_id`, `id` (stabil), `position`, `name`, `description`, `rule` (JSON) |
| `app_data` | `app_id`, `key`, `value` (JSON), z. B. Faktenpools |

Zusätzlich sinnvoll: `revision` und `published_at` je Paket (Entwürfe vs. veröffentlicht, Rückgängig machen), `updated_by` für Nachvollziehbarkeit.

Bleiben muss: IDs von Apps, Seiten und Trophäen ändern sich nie, weil der Lernstand sie als Schlüssel nutzt.

## Framework-Bewertung

| Option | Nutzen hier | Kosten | Entscheidung |
|---|---|---|---|
| Vanilla JS ohne Build (heute) | Läuft direkt auf GitHub Pages, keine Toolchain, kleine Angriffsfläche | Rendern per Hand | **bleiben** |
| JSON Schema + Ajv | Inhalte maschinell prüfbar, auch für Datenbank-Importe | nur Test-Abhängigkeit | **eingeführt** (Tests) |
| JSDoc-Typen | Typen ohne Build, Editor-Hilfe | etwas Schreibarbeit | schrittweise bei neuen Modulen |
| TypeScript | stärkere Typen | Build-Schritt, Tooling | nein, Nutzen zu klein für die Größe |
| Vite | Bündelung, Hot Reload | Build-Schritt, Deploy-Änderung | **ja für den Umbau** (Entscheidung 2026-10-26); Deploy-Änderung im Umbau-Plan |
| React/Vue/Svelte | Zustandsverwaltung, Komponenten | Build, Laufzeit-Abhängigkeit, Umbau aller Ansichten | **React ja für den Umbau** (Entscheidung 2026-10-26); bis dahin Vanilla |
| Zod/Valibot statt Schema | Prüfung im Code | Laufzeit-Abhängigkeit, kein Austauschformat | nein, das Schema ist auch für Redaktions-Tools nutzbar |

Neu bewerten, wenn: Inhalte von mehreren Personen gepflegt werden (Editor-Oberfläche nötig), die Ansichten stark interaktiver werden oder die Paketgröße Ladezeit spürbar macht.

## Risiken und Gegenmaßnahmen

- **Schadcode über Inhalte (XSS):** HTML-Felder (`html`, `analogy.html`) werden eingesetzt. Aus einer Datenbank nur von vertrauenswürdigen Redaktionen, vorher gegen eine Erlaubnisliste von Tags bereinigen. Regeln und Diagramme sind Verweise auf vorhandenen Code, nie Code in den Daten.
- **Datenschutz/DSGVO:** Inhalte enthalten keine personenbezogenen Daten. Der Lernstand eines Kindes bleibt lokal. Soll er später synchronisiert werden, braucht es Einwilligung der Eltern, Auftragsverarbeitung und einen Standort in der EU. Das ist eine eigene Entscheidung.
- **Offline und Verfügbarkeit:** Ohne Netz liefert `withCache` das zuletzt geladene Paket. Beim allerersten Start ist ein Netz nötig.
- **Falsche Inhalte:** Fachliche Fehler in Lektionen oder Fakten fallen nicht durch Schema-Tests auf. Inhaltliche Prüfung gegen Lambacher Schweizer 7 bleibt Handarbeit, Änderungen als Revision speichern.
- **Vendor Lock-in:** Das Paketformat ist offenes JSON, die Quelle ein kleines Interface. Ein Anbieterwechsel betrifft nur `createHttpSource`.
- **Versionierung:** `manifest.schema` erlaubt später Migrationen, wenn sich die Form ändert. Alte Pakete aus dem Cache werden beim Laden erneut geprüft.

## Kennzahlen für die Einführung

- Anteil der Inhaltsänderungen, die ohne Code-Review-Änderung an `.js` auskommen (Ziel: über 80 %).
- Zeit für eine neue Seite oder Aufgabengruppe: von der Idee bis veröffentlicht.
- Zahl der Schema- und Querverweis-Fehler pro Import (Ziel: 0 im Release).
- Ladezeit des Pakets auf einem mittleren Gerät, mit und ohne Cache.
- Testlauf: `npm test` und `npm run smoke` müssen vor jedem Veröffentlichen grün sein.
