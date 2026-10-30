---
name: lernwerkstatt-aus-buch
description: Erstellt aus Fotos oder Screenshots eines Schulbuchs (Inhaltsverzeichnis, Themenliste, Buchseiten) eine neue Lernseite mit Lektionen und Übungen in der Lernwerkstatt-App. Dazu gehören Seiten, Lektionen, Aufgaben, Trophäen, Registry-Einträge und Tests. Nutze diesen Skill immer, wenn der Nutzer Buchseiten, ein Inhaltsverzeichnis oder eine Themenliste schickt und daraus Lernstoff, Übungen oder eine neue App machen will, auch wenn er nur sagt "mach daraus Übungen", "das ist unser Buch für Klasse 7" oder "bau das in die App ein". Passt kein Fach, wird ein neues angelegt. Immer am Bildungsplan Baden-Württemberg ausrichten.
---

# Lernwerkstatt aus einem Buch

Ziel: Der Nutzer schickt Fotos aus einem Schulbuch oder eine Themenliste. Am Ende stehen die Inhalte in `content/<id>/` und die App ist in der Neubau-Oberfläche lauffähig, mit grünen Tests. Das Format ist fest, siehe `references/format.md`. Vorlage für Code ist `modernized/modulare-reimagined/apps/englisch/`.

## Grundregeln

- **Keine Buchtexte übernehmen.** Themen (Lehrplanstoff) sind frei, Formulierungen, Übungen und Figuren aus dem Buch nicht. Alle Beispiele selbst schreiben.
- **Am Bildungsplan BW ausrichten.** Gymnasium, Klassenstufe aus dem Buch oder der Nutzer. Stoff darüber hinaus weglassen oder in eine Notiz schreiben, nicht einbauen.
- **Fachlich korrekt vor umfangreich.** Lieber eine Aufgabe weniger. Jede Aufgabe braucht eine Erklärung (`why`), die den Denkfehler benennt.
- **Keine erfundenen Fakten zur Schule.** Was du über den Lehrplan sagst, steht in `docs/lehrplan-<fach>.md` mit Quelle oder als "nicht geprüft" markiert.
- **Auf dem aktuellen Branch arbeiten.** Nie direkt auf `main` pushen, außer der Nutzer sagt es ausdrücklich.

## Ablauf

### 1. Eingabe lesen

- Lies jedes Bild. Notiere Unit-Titel, Themen und die Seitenzahlen.
- Trenne Grammatik und Sachthemen (werden Lernseiten) von Wortschatz, Hörtexten, Lesetexten und Wiederholungsseiten. Letztere nur aufnehmen, wenn der Nutzer das will, sonst nennen, was fehlt.
- Ist ein Foto unscharf oder eine Unit unklar, frage nach. Sonst gib die Seitenliste kurz aus und arbeite weiter.
- Schreibe die Liste der Seiten (id, Titel, Unit, Thema) in dein Ergebnis, damit der Nutzer sie vor dem Push prüfen kann.

### 2. Fach finden oder anlegen

- Lies `modernized/modulare-reimagined/seiten/registry.js`. Dort stehen Kennung, `subject`, `title`, `desc` und `status` jeder App.
- Passt ein bestehendes Fach (z. B. Englisch für ein englisches Buch), wird eine **neue App** für dieses Buch angelegt, nicht eine bestehende erweitert. Die bestehende App hat eigene Logik, etwa `fr-verben` mit Verbtabellen. Erweitern ist nur auf Wunsch des Nutzers.
- Gibt es für das Fach schon einen Platzhalter mit `status: SOON` (so steht `physik` in der Registry), wird **dieser Eintrag** mit derselben Kennung auf `LIVE` gesetzt. Kein zweiter Eintrag für dasselbe Fach.
- Passt kein Fach, lege ein neues an:
  - Fachname auf Deutsch (z. B. "Biologie", "Geschichte"). Der Name steht als `subject` in beiden Registries.
  - `SUBJECT_COLORS` in `modernized/modulare-reimagined/seiten/registry.js` ergänzen, ein Hex-Wert, der noch nicht vergeben ist. Die Tests verlangen eine Farbe je Fach. Die Wurzel-`registry.js` gibt es auf `main` nicht mehr. Nur wenn sie existiert, dort ebenfalls ergänzen.
  - Neues Fach braucht `docs/lehrplan-<fach>.md` (siehe Schritt 3).
- Die Kennung der App (`id`) ist Kleinbuchstaben mit Bindestrich, z. B. `decouvertes-2`. Sie darf später nie mehr umbenannt werden, weil sie den Speicherschlüssel bildet.

### 3. Lehrplan BW prüfen

- Mit WebSearch den Bildungsplan suchen (bildungsplaene-bw.de, Gymnasium, Fach). Die Klassen 7 und 8 stehen dort oft zusammen. Dann den Klassen-7-Umfang am Beispielcurriculum (schule-bw.de) orientieren und den Rest in `docs/lehrplan-<fach>.md` notieren statt einzubauen.
- Suche den Bildungsplan für das Fach und die Klassenstufe (Gymnasium Baden-Württemberg, Bildungsplan-Portal). Notiere die Themenfelder, die zum Buch passen.
- Lege oder ergänze `docs/lehrplan-<fach>.md` mit: Quelle und Stand, Zuordnung Buch-Unit zu Bildungsplan-Thema, und was nicht geprüft werden konnte.
- Ist der Bildungsplan nicht erreichbar, schreibe das ausdrücklich in die Datei und in deine Antwort. Erfinde keine Themenfelder.

### 4. Inhalte schreiben (`content/<id>/`)

Vier Dateien, ohne Code:

- `manifest.json`: Titel, Begrüßung, Einleitung, `units` (eine je Seite, mit Farbe, `ic`, `card`), `notes` (Merkzettel).
- `lessons.json`: eine Lektion je Seite, mit allen Pflichtteilen. Regeln: `references/format.md`, Abschnitt Lektion.
- `data.json`: Aufgaben je Seite, mindestens zehn. Lücken (`kind: "gap"`) und Auswahlfragen, siehe Abschnitt Aufgaben.
- `badges.json`: die Standardtrophäen plus je eine Trophäe pro Hauptthema, falls sinnvoll.

Schreibe zuerst eine Seite fertig (Lektion plus zehn Aufgaben), prüfe sie mit den Tests und erst dann die übrigen. So fallen Formatfehler früh auf.

### 5. App-Code im Neubau anlegen

Kopiere `modernized/modulare-reimagined/apps/englisch/` nach `apps/<id>/`. Die Englisch-App ist die Vorlage, weil sie den schlichten Aufbau hat. `apps/decouvertes/` nicht nehmen: die hat sich durch Zusammenführungen verändert und importiert Verbmodelle. Passe an:

- `builders.js` und `diagrams.js` bleiben unverändert, wenn das Format gleich ist.
- `logic.js`: nichts zu ändern, außer dem Kommentar.
- `tests/<id>.test.js`: `paketVon('<id>')`, und die Testbeschreibungen mit dem Fachnamen.
- Trage in `modernized/modulare-reimagined/apps/index.js` den Import und den Eintrag in `LOGIC` ein.
- Trage in `modernized/modulare-reimagined/seiten/registry.js` die App als `status: LIVE` ein, mit `title`, `desc` und `subject`.

Die Legacy-Oberfläche (`apps/<name>/` im Wurzelordner) baust du **nicht**. Der Nutzer hat entschieden, dass neue Apps nur im Neubau liegen.

Gibt es eine Wurzel-`registry.js` doch noch, verlangt ihr Test für jeden Ordner in `content/` einen Eintrag. Dann einen Platzhalter mit `status: 'soon'` und einem Kurztext "Nur im Neubau" ergänzen.

Diagramme vom Typ `swapDiagram` (zwei Zeilen mit Pfeilen): Die Pfeile müssen Satzteile verbinden, die logisch zusammengehören, also Subjekt zu Subjekt. Die Paarung im Screenshot prüfen, die Tests merken sie nicht.

### 6. Prüfen

Fehlerfrei sein müssen, in dieser Reihenfolge:

```bash
cd modernized/modulare-reimagined && npm test && npm run build
cd ../.. && node --test tests/*.test.js
```

Die Wurzel-Suite hat einen bekannten Fehler aus `analysis/modulare/fixtures/repro/defects.repro.test.mjs` (fehlendes `fake-indexeddb`). Das ist nicht deine Änderung. Nenne ihn, behebe ihn nicht. Schlägt ein anderer Test fehl, ist es deine Aufgabe, ihn zu beheben.

Die Tests prüfen Schema, Querverweise, Aufgabenregeln und den Durchlauf aller Live-Apps. Ein Test, der nur durch das Ändern eines Tests grün wird, ist kein Erfolg.

Im Browser prüfen, wenn Playwright verfügbar ist:

1. `npm run build`, dann `npx vite preview --host 127.0.0.1 --port 4173` im Neubau.
2. Mit Playwright (Modul `/opt/node-tools/node_modules/playwright/index.mjs`, Browser `/opt/pw-browsers/chromium`) `http://127.0.0.1:4173/?app=<id>` bei 375 px Breite öffnen, hell und dunkel (`colorScheme`).
3. Prüfen: `document.documentElement.scrollWidth - clientWidth` ist 0. Keine Konsolenfehler. Eine Lektion und eine Runde öffnen, Screenshot ansehen.

Überläufe durch lange Wörter behebt man mit `overflow-wrap:anywhere` in `seiten/design/styles/base.css`, nicht durch Kürzen von Inhalten. Ist der Browser nicht verfügbar, sag das ausdrücklich. Die Checkliste in `AGENTS.md` (hell und dunkel, schmale Breite) bleibt beim Nutzer.

### 7. Git und Übergabe

- Ein Commit je Schritt (Inhalte, App-Code, Registry und Doku), Betreff auf Deutsch, Präsens oder Perfekt.
- Auf den Branch der Session pushen. Wenn `main` inzwischen neue Commits hat, zuerst `main` hineinmergen, testen, dann pushen. Nie umschreiben.
- Auf `main` pushen nur auf ausdrückliche Bitte. Das veröffentlicht sofort auf GitHub Pages.
- Abschluss eines Laufs, in dieser Reihenfolge: (1) Browser-Test nach Schritt 6, (2) alle Befunde beheben, Tests und Build erneut grün, (3) Commits auf den Session-Branch pushen, (4) auf `main` veröffentlichen, aber nur, wenn der Nutzer im Lauf „veröffentlichen“ oder „pushen“ für `main` gesagt hat. Ohne diese Bitte bleibt es beim Branch und der Nutzer wird gefragt.
- Veröffentlichen heißt: Branch mit `main` zusammenführen (Fast-Forward oder Merge, nie umschreiben), Tests und Build erneut laufen lassen, dann `git push origin HEAD:main`. Danach prüfen, dass `origin/main` auf dem neuen Commit steht.
- In der Abschlussnachricht: Seitenliste, Fach (bestehend oder neu), was nicht übernommen wurde (Wortschatz, Hörtexte), Testergebnisse, und ein Hinweis, dass eine Lehrkraft die Aufgaben gegenlesen sollte.

## Häufige Fehler

- Vor dem Push `origin/main` zusammenführen und prüfen, ob ein Fast-Forward möglich ist. Auf `main` pushen nur auf ausdrückliche Bitte.
- Der Bildungsplan BW fasst Klasse 7/8 zusammen. Nimm nur, was das Beispielcurriculum für Klasse 7 nennt, und schreibe den Rest in die Lehrplan-Datei.
- Der Groß-/Kleinschreibungstest darf nicht `toUpperCase()` nutzen: Aus „ß“ wird „SS“. Wechselnde Schreibweise nutzen, wie in `apps/physik/tests/physik.test.js`.
- Vorlage ist `apps/englisch/` (schlichter Aufbau). `apps/decouvertes/` hat sich durch Zusammenführungen verändert und importiert Verbmodelle, die eine neue App nicht hat.
- HTML-Felder (`html`, `tldr`, `steps`, `pitfall`, `analogy.html`) erlauben nur `<p>` und `<b>`. Kursiv `<i>` wird abgelehnt. Für Fremdsprache nimm Anführungszeichen „…“.
- `check.why` wird als reiner Text angezeigt. Dort kein Markup.
- Lücken: genau ein `___` im Satz. Alle anderen Aufgaben: mindestens drei falsche Antworten.
- `q` ist bei Auswahlfragen eine vollständige Frage, nie ein Stichwort. Bei Lücken ist `q` ein echter Hinweis, der die Antwort ableitbar macht, sie aber nicht nennt (bei Sprachen meist der deutsche Satz). `apps/tests/fragen-qualitaet.test.js` prüft das.
- Eingabe-Aufgaben vergleichen exakt (nach Kleinschreibung und Leerzeichen). Akzente zählen. Schreib die Antwort so, wie man sie tippt.
- Diagramme nur über `flowDiagram`, `tableDiagram`, `swapDiagram`. Der Name in `figure.diagram.name` muss exakt stimmen.

Format im Detail: `references/format.md`. Testfälle für diesen Skill: `evals/prompts.md`.
