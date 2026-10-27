# Rechtschreibung und Lesen in der Deutsch-Werkstatt

Stand: sechs Seiten sind in `content/deutsch/` ergänzt. Sie stehen hinter den bisherigen sechs Seiten (neue Seiten werden immer hinten angefügt).

## Kennzeichnung

Alle LRS-Inhalte tragen das Etikett „LRS-Förderung“, damit man sie vom Standardprogramm unterscheiden kann:
Die sechs Seiten (`doppelt`, `dehnung`, `slaute`, `ableiten`, `gross`, `lesen`) und das Merkwörter-PDF haben im Manifest `track: "lrs"`.
Das Etikett erscheint auf der Startseite, im Kopf der Theorieseite und über jeder Übungsfrage dieser Seiten (auch in Schnellrunde, Blitz und Endgegner).
Definiert ist der Strang in `manifest.tracks.lrs`. Ein weiterer Strang braucht nur einen neuen Eintrag dort und `track` an den Seiten.
Offen: Ob `dassdas` ebenfalls zur Förderung zählen soll, ist noch nicht entschieden.

## Profi-Tricks

Jede LRS-Seite hat im Merkzettel Tricks mit dem Namen „Profi-Trick“ (zum Beispiel Dehnprobe, Endung -ieren, Einschiebeprobe, Lineal beim Lesen). Dazu gibt es Übungsfragen mit dem Fragetitel „Profi-Trick“. Die Tricks sind Lernhilfen, die nicht in jedem Unterricht vorkommen. Sie gelten nicht als Schulregel: Bitte mit den Vorgaben der Lehrkraft abgleichen.

## Seiten

| Seite (`id`) | Thema | Aufgabenform |
|---|---|---|
| `doppelt` | Kurzer Vokal, doppelter Mitlaut, ck und tz | Lücke (auswählen, eintippen), Regelfragen |
| `dehnung` | ie, Dehnungs-h, Doppelvokal | Lücke, Regelfragen |
| `slaute` | s, ss und ß | Lücke, Regelfragen |
| `ableiten` | Verlängern und Ableiten (b/p, d/t, g/k, ä/e, äu/eu) | Lücke, Regelfragen |
| `gross` | Groß- und Kleinschreibung, Nominalisierung | Auswahl ganzer Sätze (kein Eintippen, weil `norm()` Groß und Klein gleichsetzt) |
| `lesen` | Lesestrategie, Schlüsselwörter, Wörter erschließen | Auswahl mit kurzem Beispieltext |

Alle Texte und Beispielsätze sind eigene Formulierungen. Es wird nichts aus Lehrwerken oder Arbeitsheften übernommen.

## Hinweise zu den Aufgaben

- Lückenaufgaben haben genau eine falsche Schreibweise. Sie ist so gewählt, wie sie in der Praxis oft vorkommt (z. B. „Fluß“, „Hunt“).
- Eingaben mit „ß“: Die Sonderzeichen-Leiste (`inputChars`) bietet ä, ö, ü und ß an.
- Der Vertragstest in `tests/deutsch.test.js` prüft Groß- und Kleinschreibung beim Eintippen mit wechselnder Schreibung, weil `toUpperCase()` aus „ß“ ein „SS“ machen würde.

## Material zum Ausdrucken

Auf der Startseite der Deutsch-Werkstatt steht unter „Zum Ausdrucken“ die PDF `apps/deutsch/files/merkwoerter-fresch.pdf`: 25 Sets mit je vier Merkwörtern (die 100 häufigsten Fehlerwörter) zum Abhaken und die Strategie-Karte der vier FRESCH-Strategien zum Ausschneiden. Eingetragen ist sie im Manifest unter `resources`.

## Merkwörter

Die Merkwörter werden auf Papier geübt: in ein Merkwörterheft schreiben, die Sets in der PDF abhaken. Die App enthält dafür bewusst kein Karteikarten- oder Wörtertraining. Die Seiten zu Rechtschreibung und Lesen ergänzen das Heft mit Regeln und Übungen am Bildschirm.
