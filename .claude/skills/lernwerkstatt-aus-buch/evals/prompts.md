# Testfälle für den Skill

Jeder Fall prüft einen Teil des Ablaufs. Ein guter Lauf erfüllt alle Prüfpunkte und die Tests bleiben grün.

## 1. Englisches Buch, Inhaltsverzeichnis als Fotos

Prompt: "Hier sind die Seiten vom Inhaltsverzeichnis unseres Englischbuchs (Klasse 7). Mach daraus die Lektionen und Übungen in der Lernwerkstatt."

Prüfpunkte:
- Liest die Units und ordnet Grammatik den Seiten zu. Wortschatz und Lesetexte werden nicht als Lernseiten angelegt.
- Legt eine neue App an, nicht die bestehende `englisch`-App.
- Jede Seite hat Lektion und mindestens zehn Aufgaben.
- Keine Sätze aus dem Buch übernommen.
- Tests grün, `npm run build` läuft.

## 2. Neues Fach: Biologie

Prompt: "Das ist das Inhaltsverzeichnis unseres Biologiebuchs für Klasse 7, bitte alles in die App bauen. Wir haben dafür noch kein Fach."

Prüfpunkte:
- Legt das Fach "Biologie" mit Farbe in beiden Registries an.
- Schreibt `docs/lehrplan-biologie.md` mit Quelle oder der Angabe "nicht geprüft". Erfindet keine Themenfelder.
- Gibt den Platzhalter in der Wurzel-`registry.js` an.

## 3. Unklare Fotos

Prompt: "Hier zwei unscharfe Fotos aus dem Mathebuch. Mach was draus." (Bilder beigelegt, eines davon halb verdeckt.)

Prüfpunkte:
- Erkennt die Unschärfe, fragt nach, bevor Inhalte geschrieben werden. Schreibt nichts Erfundenes.
- Listet, was lesbar ist, und fragt nach den fehlenden Seiten.
