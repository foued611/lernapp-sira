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
- Passt kein Fach, lege ein neues an:
  - Fachname auf Deutsch (z. B. "Biologie", "Geschichte"). Der Name steht als `subject` in beiden Registries.
  - `SUBJECT_COLORS` in `registry.js` (Wurzel, Legacy) **und** in `modernized/modulare-reimagined/seiten/registry.js` ergänzen. Ein Hex-Wert, der noch nicht vergeben ist. Die Tests verlangen eine Farbe je Fach.
  - Neues Fach braucht `docs/lehrplan-<fach>.md` (siehe Schritt 3).
- Die Kennung der App (`id`) ist Kleinbuchstaben mit Bindestrich, z. B. `decouvertes-2`. Sie darf später nie mehr umbenannt werden, weil sie den Speicherschlüssel bildet.

### 3. Lehrplan BW prüfen

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

Kopiere `modernized/modulare-reimagined/apps/englisch/` nach `apps/<id>/`. Passe an:

- `builders.js` und `diagrams.js` bleiben unverändert, wenn das Format gleich ist.
- `logic.js`: nichts zu ändern, außer dem Kommentar.
- `tests/<id>.test.js`: `paketVon('<id>')`, und die Testbeschreibungen mit dem Fachnamen.
- Trage in `modernized/modulare-reimagined/apps/index.js` den Import und den Eintrag in `LOGIC` ein.
- Trage in `modernized/modulare-reimagined/seiten/registry.js` die App als `status: LIVE` ein, mit `title`, `desc` und `subject`.

Die Legacy-Oberfläche (`apps/<name>/` im Wurzelordner) baust du **nicht**. Der Nutzer hat entschieden, dass neue Apps nur im Neubau liegen.

Der Wurzel-Test verlangt aber für jeden Ordner in `content/` einen Eintrag in `registry.js`. Ergänze deshalb dort einen Platzhalter mit `status: 'soon'` und einem kurzen `desc` "Nur im Neubau", so wie bei `decouvertes-2`.

### 6. Prüfen

Fehlerfrei sein müssen, in dieser Reihenfolge:

```bash
cd modernized/modulare-reimagined && npm test && npm run build
cd ../.. && node --test tests/*.test.js
```

Die Wurzel-Suite hat einen bekannten Fehler aus `analysis/modulare/fixtures/repro/defects.repro.test.mjs` (fehlendes `fake-indexeddb`). Das ist nicht deine Änderung. Nenne ihn, behebe ihn nicht. Schlägt ein anderer Test fehl, ist es deine Aufgabe, ihn zu beheben.

Die Tests prüfen Schema, Querverweise, Aufgabenregeln und den Durchlauf aller Live-Apps. Ein Test, der nur durch das Ändern eines Tests grün wird, ist kein Erfolg.

Sieh dir die Lektion nicht im Browser an, wenn du es nicht kannst. Sag das dann ausdrücklich. Die Checkliste in `AGENTS.md` (hell und dunkel, schmale Breite) bleibt beim Nutzer.

### 7. Git und Übergabe

- Ein Commit je Schritt (Inhalte, App-Code, Registry und Doku), Betreff auf Deutsch, Präsens oder Perfekt.
- Auf den Branch der Session pushen. Wenn `main` inzwischen neue Commits hat, zuerst `main` hineinmergen, testen, dann pushen. Nie umschreiben.
- Auf `main` pushen nur auf ausdrückliche Bitte. Das veröffentlicht sofort auf GitHub Pages.
- In der Abschlussnachricht: Seitenliste, Fach (bestehend oder neu), was nicht übernommen wurde (Wortschatz, Hörtexte), Testergebnisse, und ein Hinweis, dass eine Lehrkraft die Aufgaben gegenlesen sollte.

## Häufige Fehler

- Vorlage ist `apps/englisch/` (schlichter Aufbau). `apps/decouvertes/` hat sich durch Zusammenführungen verändert und importiert Verbmodelle, die eine neue App nicht hat.
- Der Groß-/Kleinschreibungstest darf nicht `toUpperCase()` nutzen. Aus „ß“ wird „SS“ und die Aufgabe scheint falsch. Wechselnde Schreibweise nutzen, wie in `apps/physik/tests/physik.test.js`.
- HTML-Felder (`html`, `tldr`, `steps`, `pitfall`, `analogy.html`) erlauben nur `<p>` und `<b>`. Kursiv `<i>` wird abgelehnt. Für Fremdsprache nimm Anführungszeichen „…“.
- `check.why` wird als reiner Text angezeigt. Dort kein Markup.
- Lücken: genau ein `___` im Satz. Alle anderen Aufgaben: mindestens drei falsche Antworten.
- Eingabe-Aufgaben vergleichen exakt (nach Kleinschreibung und Leerzeichen). Akzente zählen. Schreib die Antwort so, wie man sie tippt.
- Diagramme nur über `flowDiagram`, `tableDiagram`, `swapDiagram`. Der Name in `figure.diagram.name` muss exakt stimmen.

Format im Detail: `references/format.md`. Testfälle für diesen Skill: `evals/prompts.md`.
