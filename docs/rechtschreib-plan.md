# Rechtschreibung und Lesen in der Deutsch-Werkstatt

Stand: sechs Seiten sind in `content/deutsch/` ergänzt. Sie stehen hinter den bisherigen sechs Seiten (neue Seiten werden immer hinten angefügt).

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

## Geplant: Wörtertraining

Ein Karteikasten für häufige Fehlerwörter (Auswertung nach Menzel 1985, 300 Wörter) mit einem Durchgang alle vier Tage:

- Ein Wort gilt als gelernt, wenn es in vier Durchgängen nacheinander richtig war. Dann rückt ein neues Wort nach.
- Pro Wort ein FRESCH-Tag (Schwingen, Verlängern, Ableiten, Merken), der bei einem Fehler als Hinweis erscheint.
- Der Wortbestand kommt als eigene Datei (`words.json`) in `content/deutsch/`. Die Quelle der Liste vor der Veröffentlichung klären und im Dateikopf nennen.
- Der Fortschritt je Wort braucht eine neue Sammlung im Speicher (`DB_VERSION` in `core/js/db.js` erhöhen, siehe `AGENTS.md`, Abschnitt „Speicher“).
- Der Abstand von vier Tagen ist eine Einstellung des Wörtertrainings. `DUE_DAYS` (3 Tage) in `core/js/profile.js` gilt für alle Seiten und bleibt unverändert.
