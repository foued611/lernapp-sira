# Rechtschreibung und Lesen in der Deutsch-Werkstatt

Stand: sechs Seiten (Anfang) und elf weitere Seiten (siehe „Erweiterung nach Lehrkraft-Empfehlung“) sind in `content/deutsch/` ergänzt. Neue Seiten werden immer hinten angefügt.

## Kennzeichnung

Alle LRS-Inhalte tragen das Etikett „LRS-Förderung“, damit man sie vom Standardprogramm unterscheiden kann:
Die sechs Seiten (`doppelt`, `dehnung`, `slaute`, `ableiten`, `gross`, `lesen`) und das Merkwörter-PDF haben im Manifest `track: "lrs"`.
Das Etikett erscheint auf der Startseite, im Kopf der Theorieseite und über jeder Übungsfrage dieser Seiten (auch in Schnellrunde, Blitz und Endgegner).
Definiert ist der Strang in `manifest.tracks.lrs`. Ein weiterer Strang braucht nur einen neuen Eintrag dort und `track` an den Seiten.
Die elf neuen Seiten tragen ebenfalls `track: "lrs"`. Offen: Ob `dassdas` ebenfalls zur Förderung zählen soll, ist noch nicht entschieden.

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

- Lückenaufgaben der ersten sechs Seiten haben genau eine falsche Schreibweise, die elf neuen Seiten eine bis drei. Sie sind so gewählt, wie sie in der Praxis oft vorkommen (z. B. „Fluß“, „Hunt“).
- Eintippen prüft kein Groß und Klein. Deshalb üben die Lücken in `gross-mehr` und `klein` die Schreibung der Wörter, das Thema Groß und Klein prüfen dort die Auswahlaufgaben.
- Eingaben mit „ß“: Die Sonderzeichen-Leiste (`inputChars`) bietet ä, ö, ü und ß an.
- Der Vertragstest in `tests/deutsch.test.js` prüft Groß- und Kleinschreibung beim Eintippen mit wechselnder Schreibung, weil `toUpperCase()` aus „ß“ ein „SS“ machen würde.

## Material zum Ausdrucken

Auf der Startseite der Deutsch-Werkstatt steht unter „Zum Ausdrucken“ die PDF `apps/deutsch/files/merkwoerter-fresch.pdf`: 25 Sets mit je vier Merkwörtern (die 100 häufigsten Fehlerwörter) zum Abhaken und die Strategie-Karte der vier FRESCH-Strategien zum Ausschneiden. Eingetragen ist sie im Manifest unter `resources`.

## Merkwörter

Die Merkwörter werden auf Papier geübt: in ein Merkwörterheft schreiben, die Sets in der PDF abhaken. Die App enthält dafür bewusst kein Karteikarten- oder Wörtertraining. Die Seiten zu Rechtschreibung und Lesen ergänzen das Heft mit Regeln und Übungen am Bildschirm.

## Erweiterung nach Lehrkraft-Empfehlung

Die Lehrkraft empfiehlt das Förderheft „Gezielt fördern, Intensivkurs LRS 7/8“ (Cornelsen, 2025). Aus seinen Themen sind elf Seiten entstanden. Übernommen sind nur die Themen, keine Texte, Wortlisten, Merkkästen oder Aufgaben: Alle Beispiele und Aufgaben sind eigene Formulierungen.

| Seite (`id`) | Gruppe | Thema | Themenfeld im Heft |
|---|---|---|---|
| `bausteine` | Rechtschreiben vertiefen | Vorsilben, ent/end, wieder/wider, fer-, her- | Wortbausteine, Nachdenkwörter |
| `laute` | Rechtschreiben vertiefen | sp, st, qu, pf, v | Besondere Laute |
| `xlaute` | Rechtschreiben vertiefen | chs, cks, x | Ähnlich klingende x-Laute |
| `zusammen` | Rechtschreiben vertiefen | Fugenelemente, Groß und klein bei Zusammensetzungen, drei gleiche Buchstaben | Zusammensetzungen |
| `trennbar` | Rechtschreiben vertiefen | trennbare und nicht trennbare Verben, Infinitiv mit zu | Zusammengesetzte Verben, Infinitiv mit zu |
| `silben` | Rechtschreiben vertiefen | Silben mitsprechen, lange Wörter gliedern | Leseflüssigkeit (Wortreihen), Mitsprechwörter |
| `gross-mehr` | Rechtschreiben vertiefen | weitere Signale für Großschreibung | Großschreibung |
| `klein` | Rechtschreiben vertiefen | Zahlen, Adjektivendungen, Superlativ, Zeitangaben auf -s | Kleinschreibung |
| `fremd` | Rechtschreiben vertiefen | Endungen, Wortbausteine, Bedeutungen | Fremdwörter |
| `satzglieder` | Grammatik | Subjekt, Prädikat, Objekte, vier Fälle | Satzglieder |
| `zeitformen` | Grammatik | Präsens bis Futur I, haben und sein | Zeitformen |

Die Gruppen „Rechtschreiben vertiefen“ und „Grammatik“ sind neu in `manifest.groups`. Die neun Rechtschreibseiten bilden ein eigenes Kapitel, weil der Kapitel-Test nur 10 Plätze hat und der Test im alten Kapitel offen bleiben soll. Drei Trophäen kommen dazu (`lrs-spelling`, `lrs-grammar`, `lrs-compound`).

### Nicht übernommen

- Lesetempo-Training mit der Stoppuhr (Wortreihen, Lesecheck): am Bildschirm nicht prüfbar. `silben` übt nur das Gliedern, nicht das Tempo.
- Lesetexte mit Fragen (Herkules-Sage, Mansa Musa, Malalas Geschichte) und Zitate: Texte sind urheberrechtlich geschützt. Die Lesestrategie steht schon in `lesen`.
- Schreibübungen und Stilübungen (Beschreiben, Erzählen, Reportage), Quatschsätze zum Diktieren: nicht automatisch prüfbar.
- Wortarten (Verb, Nomen, Artikel, Adjektiv, Pronomen, Präposition, Adverb), Attribut, das/dass und Satzbau mit Kommas: stehen schon in `wortarten`, `attribute`, `dassdas` und `kommas`.
- Lange i, Dehnungs-h, Doppelvokale, Verlängern, s-Laute: stehen schon in `dehnung`, `slaute`, `ableiten`, `doppelt`.
- Rechtschreibcheck und Grammatikcheck: Die Kapitel-Tests und der Endgegner der App übernehmen das.

### Prüfung

Die Aufgaben sind nicht amtlich geprüft. Eine Lehrkraft sollte sie gegenlesen, vor allem Fremdwörter (Bedeutungen), Silbentrennung und die Fälle bei Satzgliedern.
