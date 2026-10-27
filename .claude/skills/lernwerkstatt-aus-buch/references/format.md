# Format-Nachschlagewerk

Stand: so wie `content/englisch/` und `content/decouvertes-2/` es nutzen. Maßgeblich bleibt das Schema `schemas/bundle.schema.json` und die Tests in `modernized/modulare-reimagined`.

## manifest.json

```json
{
  "schema": 1,
  "id": "decouvertes-2",
  "title": "Découvertes-Werkstatt",
  "greeting": "Salut",
  "intro": "Die Seiten folgen den Unités aus Découvertes 2. Erst die Lektion, dann die Übung.",
  "bossTitle": "Le Grand Défi",
  "units": [
    { "id": "quel", "color": "#FF9F43", "ic": "1b", "title": "Fragebegleiter quel", "de": "Welcher? Welche? · Unité 1", "card": { "name": "Die passende Form", "fact": "quel stimmt mit dem Nomen überein." } }
  ],
  "notes": {
    "quel": [["Formen", "quel, quelle, quels, quelles."]]
  }
}
```

- `id` (Paket und App) und jede Unit-`id`: Kleinbuchstaben, Bindestrich. Nie umbenennen, sobald Nutzer Fortschritt haben.
- `color`: `#RRGGBB`. Eine Farbe je Unit, Gruppen teilen sich eine Farbe.
- `ic`: kurzes Kürzel für die Kachel, z. B. `1a`.
- `de`: Untertitel auf Deutsch, Unit-Verweis am Ende ("· Unité 1").
- `card`: Sammelkarte mit `name` und einem `fact`, den man sich merkt.
- `notes`: Merkzettel je Seite als Liste aus `[Titel, Text]`.
- `bossTitle`, `greeting`, `intro`: Texte im Kopf der App. Optional `words` für eigene Lobsprüche, sonst Deutsch.

## lessons.json

Eine Lektion je Unit-`id`. Alle Felder sind Pflicht:

```json
{
  "quel": {
    "goal": "Du kannst nach Dingen fragen und quel in der richtigen Form benutzen.",
    "tldr": ["Zwei bis vier kurze Sätze.", "Der zweite Satz mit dem wichtigsten Merkmal."],
    "analogy": { "title": "Stell dir vor: die Speisekarte", "html": "<p>Ein Vergleich aus dem Alltag.</p>" },
    "figure": {
      "diagram": { "name": "tableDiagram", "args": [["Nomen", "Form", "Beispiel"], [["le train", "quel", "Quel train ?"]], [1.4, 1, 1.6], "Tabelle: quel mit Beispiel"] },
      "caption": "Ein Satz, was das Bild zeigt."
    },
    "steps": { "title": "So geht es", "items": ["Schritt 1.", "Schritt 2.", "Schritt 3."] },
    "pitfall": { "html": "<p>Der häufigste Fehler.</p>" },
    "rule": "Ein Merksatz.",
    "check": {
      "q": "Frage für den Mini-Check",
      "options": [{ "id": "a", "html": "a" }, { "id": "b", "html": "b" }, { "id": "c", "html": "c" }],
      "answer": "a",
      "why": "Erklärung als reiner Text, ohne Markup."
    }
  }
}
```

Regeln:
- `goal`: mehr als 15 Zeichen, ein Satz "Du kannst …".
- `tldr`: zwei bis vier Einträge.
- `steps.items`: mindestens drei.
- `check.options`: mindestens drei, alle `id` verschieden, `answer` ist eine der `id`s.
- `figure`: entweder `diagram` (Name plus `args`) oder `svg`. Die Bildunterschrift `caption` ist Pflicht.
- Diagramme: `flowDiagram(steps, label)`, `tableDiagram(head, rows, widths, label)`, `swapDiagram(top, bottom, map, labels)`. Zeilenumbruch in Kästen mit `|`. Jedes Diagramm braucht ein Label (Alternativtext).
- Erlaubtes Markup in `html`-Feldern: `<p>` und `<b>`. Sonst wird das ganze Paket abgelehnt.

## data.json

```json
{
  "items": {
    "quel": [
      { "q": "Fragebegleiter quel", "kind": "gap", "s": "___ heure est-il ?", "a": "Quelle", "wrong": ["Quel", "Quels", "Quelles"], "why": "heure ist weiblich und Singular." },
      { "q": "Welcher Satz ist richtig?", "a": "Quel jour sommes-nous ?", "wrong": ["Quelle jour sommes-nous ?", "Quelles jours sommes-nous ?", "Quel jours sommes-nous ?"], "why": "jour ist männlich." }
    ]
  }
}
```

- Schlüssel sind die Unit-`id`s. Jede Unit braucht **mindestens zehn** Aufgaben, ohne doppelte Kombination aus `q|s|a`.
- `kind: "gap"`: `s` enthält genau ein `___`. `a` ist die richtige Antwort, `wrong` mindestens eine falsche. Die Aufgabe wird als Auswahl (Lücke füllen) und als Eintippen gespielt.
- Ohne `kind`: `a` ist die richtige Antwort, `wrong` mindestens drei. Die Auswahl zeigt `a` und drei falsche.
- `accept` (optional): weitere richtige Eingaben beim Eintippen.
- `why` mindestens elf Zeichen, nennt den Denkfehler. Keine richtige Antwort in `wrong`, keine Doppelten in `wrong`.
- Eintippen vergleicht nach Kleinschreibung und Leerzeichen. Akzente zählen, also genau so tippen, wie die Antwort steht.

## badges.json

Eine Liste. `id` nie wiederverwenden. Regeln:

```json
[
  { "id": "first", "n": "Erster Schritt", "d": "Die erste Seite geübt", "rule": { "type": "anyUnit" } },
  { "id": "perfect", "n": "Fehlerfrei", "d": "Eine Runde ohne Fehler", "rule": { "type": "perfectRound" } },
  { "id": "combo", "n": "Im Lauf", "d": "Fünf richtige hintereinander", "rule": { "type": "combo", "min": 5 } },
  { "id": "streak", "n": "Dranbleiben", "d": "Drei Tage in Folge", "rule": { "type": "streak", "days": 3 } },
  { "id": "boss", "n": "Endgegner", "d": "Den Endgegner besiegt", "rule": { "type": "boss" } },
  { "id": "unit1", "n": "Unit 1 geschafft", "d": "Seiten der Unit 1 mit einem Stern", "rule": { "type": "units", "ids": ["quel"] } }
]
```

Erlaubte Regeltypen: `anyUnit`, `perfectRound`, `boss`, `unit` (mit `id`, optional `stars`), `units` (mit `ids`), `combo` und `blitz` (mit `min`), `streak` (mit `days`), `all` und `any` (mit `rules`).

## Neubau-Code (apps/<id>/)

- `builders.js`: liest `data.items`, baut Fragen mit `choiceQuestion` und `typedQuestion` aus `runde/index.js`. Jede Erzeugerfunktion bekommt `rng` (Zufall nur über `rng`, damit Tests reproduzierbar sind).
- `diagrams.js`: die drei Baustein-Funktionen aus der Englisch-App. Nutzt `komponenten/svg.js`.
- `logic.js`: `export default { init, diagrams, rounds: { lesson, quick, boss }, blitz }`.
- `tests/<id>.test.js`: prüft Aufgaben, Runden, Diagramme. Lädt Inhalte mit `paketVon('<id>')` aus `apps/tests/laden.js`.
- `apps/index.js`: `import` und Eintrag in `LOGIC`.
- `seiten/registry.js`: `{ id, subject, title, desc, status: LIVE }` in `APPS`.

## Registries und Fächer

- `seiten/registry.js` (Neubau, live) und `registry.js` (Wurzel, Legacy): `SUBJECT_COLORS` muss jedes Fach enthalten, auch in der Wurzel.
- Der Wurzel-Test prüft, dass jeder Ordner in `content/` einen Registry-Eintrag hat. Dafür der Platzhalter mit `status: 'soon'`.
