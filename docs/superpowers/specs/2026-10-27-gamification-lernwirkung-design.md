# Gamification: Lernwirkung schärfen (Richtung A)

Stand: 2026-10-27. Gilt für den Neubau `modernized/modulare-reimagined/`. Status: Entwurf, wartet auf Freigabe der Spec.

## 1. Ziel

Schülerinnen und Schüler der 7. Klasse sollen mit den Apps regelmäßig üben, und das Üben soll Wissen dauerhaft festigen. Die bestehenden Spielmechaniken bleiben. Wir schärfen sie dort, wo die Forschung Lernwirkung belegt: Abruf (Retrieval Practice), verteiltes Wiederholen, Feedback zu Anstrengung und Fortschritt, sowie Selbstbestimmung beim Ziel.

## 2. Ausgangslage (geprüft im Code)

- Abruf und Abstand sind schon da: zweiter Versuch (5 XP), Auffrischen nach `DUE_DAYS = 3` Tagen mit `REFRESH_BONUS_XP = 10` (`regeln/src/constants.js`, `regeln/src/progress.js`).
- Trophäen werden in `regeln/src/trophies.js` ausgewertet. Die Regel-Typen sind dort fest definiert. Eine Trophäe wird nur einmal vergeben (`regeln/src/round.js`).
- Blitz-Trophäe `blitz10` nutzt `{ type: 'blitz', min: 10 }` und zählt nur die Punktzahl (`runde/src/blitz.js`). Das belohnt Tempo.
- Das Tagesziel `DAILY_GOAL_XP = 30` ist fest verdrahtet: `regeln/src/xp.js`, `seiten/startseite.js`, `seiten/apphome.js`, `seiten/ergebnis.js`.
- `app.acc[unitId]` wird in `settleLesson` (`regeln/src/round.js`) überschrieben, bevor Trophäen geprüft werden. Der alte Wert geht dabei verloren.
- Fragen haben keine feste ID. `questionKey(q)` (`runde/src/vielfalt.js`) bildet einen Schlüssel aus Art, Label, Fragetext, Antwort.
- Protokoll: `logEvent` (`speicher/src/log.js`), geschrieben über `logRow` in `seiten/rahmen.js:309`.

## 3. Erfolgskriterien

Gemessen über das Ereignisprotokoll, ohne Namen und ohne Personenbezug:

1. **Behalten:** Genauigkeit bei Wiederholung nach mindestens 3 Tagen, im Vergleich zur letzten Genauigkeit derselben Seite. Ziel: Anteil der Wiederholungen mit gleicher oder besserer Genauigkeit steigt.
2. **Wiederkehr:** Anteil der Schülerinnen und Schüler mit Übung an mindestens 3 von 7 Tagen. Der Wert ist eine Schätzung, kein Ziel mit fester Zahl.
3. **Kein Schaden:** Abbruchrate in der ersten Runde einer Seite bleibt gleich oder sinkt.
4. **Wochenmissionen:** Anteil der Schülerinnen und Schüler mit mindestens einer erfüllten Mission je Woche. Nur Beobachtung, kein Ziel.

Ein Lernzuwachs-Test vor und nach einer Einheit ist optional und liegt außerhalb dieser Spec.

## 4. Nicht-Ziele

- Keine Bestenliste, kein Vergleich zwischen Personen.
- Kein Shop, kein Avatar, keine Bestenliste.
- Keine Klassenfunktion, keine Mehrprofil-Fähigkeit (das ist Backlog A-3).
- Herzen bleiben unverändert. Ihre Wirkung ist ungeprüft und wird erst mit Daten angefasst.
- Keine Änderung an Trophäen-IDs. IDs sind gespeicherte Daten und werden nie umbenannt.

## 5. Änderungen

### 5.1 Auffrischen nach Genauigkeit (Abstand)

`isRefreshDue` (`regeln/src/progress.js`) bekommt eine zweite Schwelle. Seiten mit letzter Genauigkeit ab 90 % sind erst nach `DUE_DAYS_STRONG = 7` Tagen fällig. Darunter bleibt es bei 3 Tagen. Neue Konstante in `constants.js`, Standardwert 7.

Begründung: Wer sicher ist, braucht seltener eine Auffrischung. Wer unsicher ist, wird früher erinnert.

### 5.2 Abruf der Fehler (Retrieval)

Nach einer Lektionsrunde speichert die App die Fehlerkategorien der Runde in `app.missed[unitId]`. Beim nächsten Start der Seite kommt mindestens eine Frage aus dieser Liste zuerst.

Wichtig: Die Fragen mancher Apps werden zufällig erzeugt (Zahlen in Mathe). Ein Fehlerschlüssel über den vollen Fragetext träfe dort nie wieder. Deshalb wird über das Label (Fehlerkategorie) gespeichert, nicht über den Fragetext.

Offen, vor dem Plan zu prüfen: Ob `label` in allen Apps eine stabile Kategorie ist. Sonst muss jede App ihre Kategorie liefern.

### 5.3 Trophäen für Fortschritt und Anstrengung

Drei neue Regel-Typen in `regeln/src/trophies.js`, nach dem Muster der bestehenden:

- `improved`: `{ type: 'improved', unit, by }`. Wahr, wenn die letzte Genauigkeit der Seite um mindestens `by` (Anteil, z. B. `0.2`) über der vorherigen liegt. Dafür speichert `finishRound` den alten Wert als `result.prevAcc`, bevor `settleLesson` ihn überschreibt.
- `retryRecovered`: `{ type: 'retryRecovered', min }`. Wahr, wenn in einer Runde mindestens `min` falsche Antworten im zweiten Versuch richtig beantwortet wurden. Das Ergebnis braucht dafür das Feld `retryRight`.
- `refresh`: `{ type: 'refresh', count }`. Wahr, wenn `app.refreshes` mindestens `count` erreicht. `finishRound` zählt den Zähler hoch, sobald eine Auffrischung bezahlt wurde (5.1).

Beispiel-Trophäen (je App in `content/<id>/badges.json`, mit neuen, nie verwendeten IDs):

- "Besser geworden": `improved`, `by: 0.2`
- "Nicht aufgegeben": `retryRecovered`, `min: 2`
- "Zurückgekommen": `refresh`, `count: 1` (eine bezahlte Auffrischung)

Warnung: Trophäen sind extrinsische Belohnung. Die Forschung warnt vor Verdrängung der Eigenmotivation, wenn die Belohnung eine Aufgabe überlagert, die schon interessant ist. Deshalb nur wenige Trophäen je App, und sie hängen an Lernhandlungen, nicht an Zeit.

### 5.4 Blitz ohne Tempo-Belohnung

Blitz bleibt als Spielmodus. `blitz10` wird umgebaut: `{ type: 'blitz', min: 10, maxWrong: 1 }`. Das verlangt 10 Treffer bei höchstens einer falschen Antwort. Das Ergebnis des Blitz liefert dafür `wrong`, bisher fehlt es (`runde/src/blitz.js`).

Entscheidung: Tempo bleibt Teil des Spielmodus (das Zeitlimit ist Teil des Spiels). Die Trophäe belohnt nicht mehr die reine Punktzahl. Alternative, falls das verworfen wird: `blitz10` ersatzlos entfernen. Die ID bleibt dann reserviert.

### 5.5 Wochenziel selbst wählen (Selbstbestimmung)

Neues Profilfeld `goal` mit Werten 20, 30 oder 50 XP. Standard 30, der bisherige Wert. Ein neues Feld braucht laut AGENTS.md keine Migration.

- `DAILY_GOAL_XP` wird Standard. `awardXP` und alle vier UI-Stellen lesen den Wert aus dem Profil über eine Funktion `dailyGoal(profile)`.
- In der Startseite kommt eine Auswahl mit drei Schaltflächen. Sie ist per Tastatur bedienbar und hat sichtbaren Fokus.

### 5.6 Messung im Protokoll

`finishRound` ergänzt das Ergebnis um `gapDays` (Tage seit der letzten Übung derselben Seite, `null` bei der ersten Übung, 0 bei einem Tag in der Zukunft) und `prevAcc`. `settleRound` baut die Protokollzeile daraus, `logRow` schreibt sie. Kein Name, keine Person.

Die Auswertung ist nicht Teil dieser Spec. Die Felder ermöglichen sie.

### 5.7 Wochenmissionen

Jede Woche (Montag bis Sonntag) gibt es drei feste Missionen. Sie zählen Lernhandlungen, keine Zeit:

- `units3`: drei verschiedene Seiten geübt. Zählt `profile.week.units`.
- `refresh1`: eine Auffrischung bezahlt. Zählt `profile.week.refreshes`.
- `strong90`: eine Runde mit mindestens 90 % Genauigkeit. Zählt `profile.week.strong`.

Belohnung je erfüllter Mission: 20 XP, einmal pro Woche und Mission. Die XP laufen über `awardXP`, damit Tagesziel und Level gleich wirken.

Speicher: `profile.week = { start, units, refreshes, strong, done }`, `start` ist der Montag als `YYYY-MM-DD`. Beim ersten Übungstag einer neuen Woche wird der Block zurückgesetzt. Neues Feld, keine Migration nötig.

Die Regeln liegen in `regeln/src/missions.js` als reine Funktionen. Der Tag kommt von außen, `weekStart(day)` steht in `regeln/src/dates.js`. Mission-IDs sind gespeicherte Daten und bleiben stabil.

Anzeige: Karte „Diese Woche“ in `seiten/apphome.js` mit drei Missionen und Fortschritt (z. B. „2 von 3 Seiten“).

### 5.8 Lernpfad-Karte

Der Lernpfad in `seiten/apphome.js` ist heute eine Liste der Seiten. Er wird zur Karte: Seiten als Stationen in der Reihenfolge aus `manifest.json`, verbunden durch eine Linie. Jede Station zeigt ihren Zustand als Text und Symbol, nicht nur über Farbe: offen, geübt (1–2 Sterne), gemeistert (3 Sterne), zum Auffrischen fällig.

Freischalten: Die Reihenfolge bleibt ein Vorschlag, wie heute („Starte irgendwo“). Die nächste Station wird hervorgehoben, aber nicht gesperrt. Eine harte Sperre würde die Wahl einschränken (5.5) und dem bestehenden Vorschlag widersprechen. Nur der Endgegner bleibt gesperrt, wie heute.

Daten: keine neue Speicherung. Die Karte liest `app.stars`, `app.last` und `isRefreshDue`. Stationen sind Buttons mit mindestens 44 px Höhe und sichtbarem Fokus.

## 6. Tests

- `regeln/tests`: Auffrischen mit zwei Schwellen (Grenzfälle 89 %, 90 %, 3 und 7 Tage), `improved` und `retryRecovered`, `dailyGoal` mit Standard und mit gesetztem Wert.
- `runde/tests`: `retryRight` und `wrong` im Ergebnis, `blitz10` mit `maxWrong`.
- `seiten`: Startseite zeigt das gewählte Ziel. Auswahl wird gespeichert.
- `regeln/tests`: Wochenmissionen (Reset am Montag, jede Mission nur einmal belohnt, Grenze 90 %), `weekStart` für Montag, Sonntag und Monatswechsel.
- `seiten`: Lernpfad-Karte zeigt Stationen in Reihenfolge aus `manifest.json`, Endgegner bleibt gesperrt bis alle Seiten einen Stern haben.
- Schema- und Vertragstest (`npm test`) prüft neue Trophäen-Regeln und IDs.
- Vor jedem Commit: `npm test` in `modernized/modulare-reimagined` grün, hell und dunkel angesehen, 375 px geprüft.

## 7. Offene Punkte und Risiken

1. **Label-Stabilität** (5.2): vor dem Plan in allen Apps prüfen.
2. **`retryRight` im Ergebnis** (5.3): `runde/src/round.js` liefert Wiederholungs-Treffer nicht im Ergebnisobjekt. Feld muss ergänzt werden.
3. **Blitz** (5.4): Entscheidung über `maxWrong` oder Entfernen bestätigen.
4. **Mehr Trophäen** könnten die Motivation verdrängen. Gegenmaßnahme: wenige Trophäen je App, Auswertung über `gapDays`.
5. **Datenschutz:** Kein neues externes Angebot. Nur lokale Speicherung im Browser.
6. **Freischalten der Stationen:** Entschieden ist die weiche Variante (5.8). Wenn harte Sperre gewünscht ist, gilt: Station n+1 frei ab einem Stern auf Station n. Dann braucht `apphome.js` eine Ausnahme für Schüler, die bewusst springen wollen.
7. **Wochenmissionen-Belohnung** (20 XP) ist eine Schätzung. Vor Umsetzung mit dem Tagesziel abgleichen.

## 8. Nächster Schritt

Nach Freigabe dieser Spec: Implementierungsplan mit writing-plans. Umsetzung in Schritten, je Schritt mit Tests.
