# Gamification: Lernwirkung schärfen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die bestehende Spielmechanik im Neubau so schärfen, dass Abruf, verteiltes Wiederholen und Fortschritts-Feedback gestärkt werden, und Wochenmissionen sowie eine weiche Lernpfad-Karte ergänzen.

**Architecture:** Die Spielregeln bleiben reine Funktionen in `regeln/` (Zeit kommt von außen, kein Speicher, keine UI). Neue Trophäen-Regeln und Missionen folgen dem bestehenden Muster. Die Oberfläche in `seiten/` liest nur. Speicher bekommt nur neue Felder, keine Migration.

**Tech Stack:** JavaScript (ES-Module), React-Oberfläche (`h`-Helfer), `node:test` über `npm test` in `modernized/modulare-reimagined`.

**Spec:** `docs/superpowers/specs/2026-10-27-gamification-lernwirkung-design.md`

## Global Constraints

- Alle Befehle im Ordner `modernized/modulare-reimagined`, `npm test` muss vor jedem Commit grün sein.
- `regeln/` und `helfer/` importieren nicht aus `speicher/`, `komponenten/`, `seiten/`, `apps/` und nicht aus React.
- Zufall nur über Parameter `rng`. Gleicher Seed, gleiche Ausgabe.
- IDs von Trophäen, Seiten und Missionen werden nie umbenannt.
- Neue Profil- und App-Felder brauchen keine Migration. Fehlende Felder bekommen Standardwerte beim Laden.
- Keine festen Farbwerte in CSS, nur Tokens aus `seiten/design/styles/tokens.css`. Touch-Ziele mindestens 44 px. Oberflächentexte auf Deutsch, du-Ansprache, keine Emojis.
- Keine Namen von Lernenden in Code, Tests oder Protokoll.

## Review Focus

1. Auffrischen genau an der Grenze: Genauigkeit exakt 0,9 zählt als stark (7 Tage), 0,89 als schwach (3 Tage). Test in Task 2.
2. Wochenwechsel über Jahresgrenze und an Sonntagen: `weekStart('2027-01-03')` ergibt `2026-12-28`. Test in Task 1 und Task 7.
3. `improved` darf bei der ersten Übung einer Seite nicht feuern, weil es keinen alten Wert gibt. Test in Task 4.
4. Blitz ohne jede Antwort und Blitz ganz ohne Fehler: `wrong` ist korrekt gezählt, Trophäe `blitz10` prüft `maxWrong` korrekt. Test in Task 5.
5. Lernpfad mit leerem `app.stars` und einer Seite ohne Manifest-Eintrag: kein Absturz, Stationen in Manifest-Reihenfolge. Test in Task 8.

## Task 1: Montag der Woche (`weekStart`)

**Files:**
- Modify: `regeln/src/dates.js`
- Modify: `regeln/index.js` (Export ist schon per `export { assertDay, dayDiff }`, neu ergänzen)
- Test: `regeln/tests/dates.test.js` (neu)

**Interfaces:**
- Produces: `weekStart(day: string) => string` gibt den Montag der Woche als `YYYY-MM-DD` zurück. Wirft `TypeError` bei ungültigem Tag über `assertDay`.

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weekStart } from '../src/dates.js';

test('Montag bleibt Montag', () => assert.equal(weekStart('2026-10-26'), '2026-10-26'));
test('Dienstag geht auf den Montag davor', () => assert.equal(weekStart('2026-10-27'), '2026-10-26'));
test('Sonntag gehört zur Woche des Montags davor', () => assert.equal(weekStart('2026-10-25'), '2026-10-19'));
test('Sonntag über die Jahresgrenze', () => assert.equal(weekStart('2027-01-03'), '2026-12-28'));
test('ungültiger Tag wirft', () => assert.throws(() => weekStart('27.10.2026'), TypeError));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- regeln/tests/dates.test.js` (oder `node --test regeln/tests/dates.test.js`)
Expected: FAIL mit „weekStart is not a function“ oder ähnlich.

- [ ] **Step 3: Implement `weekStart(day: string): string` in `regeln/src/dates.js`**

Über `toUTC` rechnen, Wochentag über `getUTCDay()` (Sonntag = 0 auf Montag = 1 umrechnen), Tage zurückgehen, als `YYYY-MM-DD` ausgeben. Export in `regeln/index.js` ergänzen.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test regeln/tests/dates.test.js`
Expected: PASS, fünf Tests.

- [ ] **Step 5: Commit**

```bash
git add regeln/src/dates.js regeln/index.js regeln/tests/dates.test.js
git commit -m "Montag der Woche als Regel ergänzt"
```

## Task 2: Auffrischen nach Genauigkeit

**Files:**
- Modify: `regeln/src/constants.js` (neu: `DUE_DAYS_STRONG = 7`, `REFRESH_STRONG_ACCURACY = 0.9`)
- Modify: `regeln/src/progress.js:isRefreshDue`
- Test: `regeln/tests/progress.test.js` (ergänzen)

**Interfaces:**
- Consumes: `app.acc[unitId]` (Zahl 0 bis 1, siehe `regeln/src/round.js:settleLesson`)
- Produces: `isRefreshDue(app, unitId, day) => boolean` mit gleicher Signatur. Verhalten: fällig nach `DUE_DAYS` (3) Tagen, bei `app.acc[unitId] >= REFRESH_STRONG_ACCURACY` erst nach `DUE_DAYS_STRONG` (7) Tagen. Ohne Genauigkeit gilt 3 Tage.

- [ ] **Step 1: Write the failing tests**

```js
test('ab 90 % erst nach 7 Tagen fällig', () => {
  const app = { stars: { a: 2 }, last: { a: '2026-10-20' }, acc: { a: 0.9 } };
  assert.equal(isRefreshDue(app, 'a', '2026-10-26'), false); // 6 Tage
  assert.equal(isRefreshDue(app, 'a', '2026-10-27'), true);  // 7 Tage
});

test('knapp unter 90 % bleibt bei 3 Tagen', () => {
  const app = { stars: { a: 2 }, last: { a: '2026-10-24' }, acc: { a: 0.89 } };
  assert.equal(isRefreshDue(app, 'a', '2026-10-27'), true);
});

test('ohne Genauigkeit gilt weiter 3 Tage', () => {
  const app = { stars: { a: 1 }, last: { a: '2026-10-24' } };
  assert.equal(isRefreshDue(app, 'a', '2026-10-27'), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test regeln/tests/progress.test.js`
Expected: FAIL im ersten Test (3 Tage statt 7).

- [ ] **Step 3: Implement the two thresholds**

Konstanten in `constants.js` mit Kommentar zur Herkunft ergänzen. `isRefreshDue` wählt die Frist nach `app.acc[unitId]`.

- [ ] **Step 4: Run tests**

Run: `node --test regeln/tests/progress.test.js`
Expected: PASS, alle Tests inklusive der bestehenden.

- [ ] **Step 5: Commit**

```bash
git add regeln/src/constants.js regeln/src/progress.js regeln/tests/progress.test.js
git commit -m "Auffrischen: starke Seiten erst nach 7 Tagen fällig"
```

## Task 3: Wochenziel frei wählbar

**Files:**
- Modify: `regeln/src/constants.js` (neu: `GOAL_CHOICES = [20, 30, 50]`)
- Modify: `regeln/src/xp.js` (neu: `dailyGoal(profile)`; `awardXP` nutzt sie)
- Modify: `seiten/startseite.js` (Zeilen 21, 23, 125, 201: `DAILY_GOAL_XP` durch Wert aus dem Profil ersetzen; Auswahl mit drei Schaltflächen)
- Modify: `seiten/apphome.js` (Zeilen 26, 28, 43, 46, 50, 104, 105)
- Modify: `seiten/ergebnis.js` (Zeilen 78, 116, 117)
- Test: `regeln/tests/xp.test.js` (ergänzen), `seiten/tests/startseite.test.js` (ergänzen)

**Interfaces:**
- Produces: `dailyGoal(profile) => number`. Liefert `profile.goal`, wenn es in `GOAL_CHOICES` steht, sonst `DAILY_GOAL_XP` (30).
- Produces: `setDailyGoal(profile, value) => void`. Wirft `RangeError`, wenn `value` nicht in `GOAL_CHOICES` steht.

- [ ] **Step 1: Write the failing tests**

```js
test('Standard ist 30 XP ohne gesetztes Ziel', () => {
  assert.equal(dailyGoal({ xp: 0 }), 30);
});

test('gesetztes Ziel wird genutzt', () => {
  assert.equal(dailyGoal({ xp: 0, goal: 50 }), 50);
});

test('unbekannter Wert fällt auf 30 zurück', () => {
  assert.equal(dailyGoal({ xp: 0, goal: 42 }), 30);
});

test('setDailyGoal wirft bei unbekanntem Wert', () => {
  assert.throws(() => setDailyGoal({ xp: 0 }, 42), RangeError);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test regeln/tests/xp.test.js`
Expected: FAIL mit „dailyGoal is not a function“.

- [ ] **Step 3: Implement `dailyGoal` and `setDailyGoal`, then replace the constant**

`awardXP` bekommt `dailyGoal(profile)` statt `DAILY_GOAL_XP`. In den vier UI-Dateien die Konstante durch `dailyGoal(profile)` ersetzen, Texte bleiben gleich. Auswahl in `startseite.js` mit drei Schaltflächen (`aria-pressed`), sichtbarer Fokus, mindestens 44 px.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS. Achtung: bestehende Tests, die `DAILY_GOAL_XP` fest erwarten, anpassen, nicht die Zahl ändern.

- [ ] **Step 5: Commit**

```bash
git add regeln seiten
git commit -m "Wochenziel frei wählbar (20, 30, 50 XP)"
```

## Task 4: Trophäen für Fortschritt und Anstrengung

**Files:**
- Modify: `regeln/src/trophies.js` (drei neue Typen in `TYPES`: `improved`, `retryRecovered`, `refresh`; `ruleErrors` um die neuen Pflichtfelder ergänzen)
- Modify: `regeln/src/round.js` (`prevAcc` vor `settleLesson` sichern, `retryRight` aus `attempts` ableiten, `app.refreshes` zählen)
- Modify: `seiten/rahmen.js:111` (Aufruf von `finishRound` mit `attempts` übergeben, falls das Feld dort noch fehlt)
- Test: `regeln/tests/trophies.test.js`, `regeln/tests/round.test.js` (ergänzen)

**Interfaces:**
- Consumes: `result.attempts` in `runde/src/round.js` (Einträge `{ outcome, retry }`). Dort stehen die Wiederholungen schon drin, das Ergebnis-Objekt nicht.
- Produces: `finishRound({ ..., attempts })` setzt `result.retryRight` = Zahl der Wiederholungen mit `outcome === 'ok'`.
- Produces: `result.prevAcc` = vorheriger Wert von `app.acc[unitId]` oder `null`.
- Regeln: `{ type: 'improved', unit, by }`, `{ type: 'retryRecovered', min }`, `{ type: 'refresh', count }`.

- [ ] **Step 1: Write the failing tests**

```js
test('improved wahr bei Anstieg um mindestens by', () => {
  const state = { profile: {}, app: { acc: { a: 0.9 } }, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'improved', unit: 'a', by: 0.2 }, state, { prevAcc: 0.6 }), true);
});

test('improved feuert nicht ohne vorherigen Wert', () => {
  const state = { profile: {}, app: { acc: { a: 0.9 } }, streak: 0 };
  assert.equal(evaluateTrophyRule({ type: 'improved', unit: 'a', by: 0.2 }, state, { prevAcc: null }), false);
});

test('retryRecovered zählt richtige Wiederholungen', () => {
  assert.equal(evaluateTrophyRule({ type: 'retryRecovered', min: 2 }, { profile: {}, app: {}, streak: 0 }, { retryRight: 2 }), true);
});

test('refresh zählt app.refreshes', () => {
  assert.equal(evaluateTrophyRule({ type: 'refresh', count: 1 }, { profile: {}, app: { refreshes: 1 }, streak: 0 }, {}), true);
});
```

Dazu in `round.test.js`: Eine Lektionsrunde mit `attempts` aus zwei richtigen Wiederholungen ergibt `retryRight: 2`. Eine erste Übung ergibt `prevAcc: null`. Eine zweite Übung ergibt den alten Wert.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test regeln/tests/trophies.test.js regeln/tests/round.test.js`
Expected: FAIL mit „Unbekannte Trophäen-Regel“.

- [ ] **Step 3: Implement the three types and the three result fields**

In `finishRound` vor `settleLesson` den alten Wert lesen: `const prevAcc = app.acc?.[unit.id] ?? null`. `result.prevAcc` setzen. `retryRight` aus `input.attempts` ableiten, Standard `[]`. `app.refreshes` bei `result.refresh` um eins erhöhen (Standardfeld `0`, wird beim Laden ergänzt).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add regeln seiten/rahmen.js
git commit -m "Trophäen für Fortschritt, Anstrengung und Auffrischung"
```

## Task 5: Blitz ohne reine Tempo-Belohnung

**Files:**
- Modify: `runde/src/blitz.js` (`pick` zählt `b.wrong`, `finish` gibt `wrong` zurück)
- Modify: `regeln/src/trophies.js` (Typ `blitz` prüft `rule.maxWrong`, Standard `Infinity`)
- Modify: `regeln/src/round.js` (`wrong` des Blitz-Ergebnisses übernehmen; `finishRound` gibt es an Trophäen weiter)
- Modify: `public/content/*/badges.json` nur dort, wo `blitz10` existiert (Quelle für die Regel: `content/` im Repo-Root, danach `npm run build`)
- Test: `runde/tests/blitz-wrong.test.js` (neu), `regeln/tests/trophies.test.js` (ergänzen)

**Interfaces:**
- Produces: Blitz-Ergebnis `{ mode, score, xp, bestCombo, wrong }`.
- Regel: `{ type: 'blitz', min: 10, maxWrong: 1 }` verlangt Treffer ≥ `min` UND Fehler ≤ `maxWrong`.

- [ ] **Step 1: Write the failing tests**

```js
test('Blitz zählt Fehler mit', () => {
  // Fabrik mit fester Frage, eine richtige und eine falsche Antwort
  // erwartet: finish().wrong === 1
});

test('blitz-Regel mit maxWrong: 10 Treffer, 0 Fehler wahr', () => {
  assert.equal(evaluateTrophyRule({ type: 'blitz', min: 10, maxWrong: 1 }, state, { mode: 'blitz', score: 10, wrong: 0 }), true);
});

test('blitz-Regel mit maxWrong: 10 Treffer, 2 Fehler falsch', () => {
  assert.equal(evaluateTrophyRule({ type: 'blitz', min: 10, maxWrong: 1 }, state, { mode: 'blitz', score: 10, wrong: 2 }), false);
});

test('Blitz ohne jede Antwort: wrong ist 0', () => {
  // leerer Blitz, finish() nach Ablauf
  // erwartet: wrong === 0
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test runde/tests/blitz-wrong.test.js regeln/tests/trophies.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement the counter and the rule parameter**

`pick` erhöht `b.wrong` im Fehlerzweig. `finish` gibt es mit aus. `blitz`-Regel prüft `result.wrong <= (rule.maxWrong ?? Infinity)`. Bestehende Trophäe `blitz10` in `content/` auf `maxWrong: 1` setzen. Test-Fabrik aus `runde/tests/helpers.js` nutzen, nicht neu bauen.

- [ ] **Step 4: Run tests and build content**

Run: `npm test && npm run build`
Expected: PASS, Build ohne Fehler, `public/content/*/badges.json` aktualisiert.

- [ ] **Step 5: Commit**

```bash
git add runde regeln content public
git commit -m "Blitz zählt Fehler, Trophäe verlangt höchstens einen"
```

## Task 6: Messung im Protokoll

**Files:**
- Modify: `regeln/src/round.js` (`result.gapDays` berechnen, bevor `settleLesson` `app.last` überschreibt)
- Modify: `seiten/rahmen.js` (`logRow` um `gapDays`, `prevAcc` ergänzen; Aufruf in der Nähe von `:309`)
- Test: `regeln/tests/round.test.js` (ergänzen), `seiten/tests/rahmen.test.js` (ergänzen)

**Interfaces:**
- Produces: `result.gapDays` = Ganzzahl Tage seit der letzten Übung derselben Seite, `null` bei der ersten Übung. Berechnung über `dayDiff` aus `regeln/src/dates.js`.
- Consumes: `logEvent` über `storage.handle.logEvent(row)` (`seiten/rahmen.js:309`).

- [ ] **Step 1: Write the failing tests**

```js
test('gapDays ist null bei der ersten Übung', () => {
  // finishRound ohne app.last[unit] → result.gapDays === null
});

test('gapDays zählt Tage seit der letzten Übung', () => {
  // app.last.a = '2026-10-24', day = '2026-10-27' → gapDays === 3
});
```

Dazu in `rahmen.test.js`: der Protokolleintrag einer Lektionsrunde enthält `gapDays` und `prevAcc`. Kein Feld mit Namen.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test regeln/tests/round.test.js seiten/tests/rahmen.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement**

`gapDays` vor dem Überschreiben von `app.last` berechnen. `logRow` um die zwei Felder erweitern. Keine weiteren Felder hinzufügen.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add regeln seiten/rahmen.js
git commit -m "Protokoll: Abstand in Tagen und vorherige Genauigkeit"
```

## Task 7: Wochenmissionen

**Files:**
- Create: `regeln/src/missions.js` (`MISSIONS`, `missionProgress(profile, day)`, `recordMission(profile, event, day)`)
- Modify: `regeln/index.js` (Export)
- Modify: `regeln/src/round.js` (nach jeder Runde `recordMission` aufrufen, Belohnung über `awardXP`)
- Modify: `seiten/apphome.js` (Karte „Diese Woche“, drei Zeilen mit Fortschritt)
- Test: `regeln/tests/missions.test.js` (neu), `seiten/tests/apphome.test.js` (neu)

**Interfaces:**
- Consumes: `weekStart(day)` aus Task 1, `awardXP(profile, app, amount, day)` aus `regeln/src/xp.js`.
- Produces: `MISSIONS = [{ id: 'units3', need: 3 }, { id: 'refresh1', need: 1 }, { id: 'strong90', need: 1 }]`. IDs sind gespeicherte Daten.
- Produces: `recordMission(profile, event, day)` mit `event = { unit, refreshed, accuracy }`. Setzt `profile.week` zurück, wenn `week.start !== weekStart(day)`. Gibt `{ completed: [ids] }` zurück. Jede Mission gibt genau einmal pro Woche 20 XP.
- Produces: `profile.week = { start, units: [], refreshes: 0, strong: 0, done: [] }`.

- [ ] **Step 1: Write the failing tests**

```js
test('Woche wird am Montag zurückgesetzt', () => {
  // profile.week.start = '2026-10-19', day = '2026-10-26' → units leer
});

test('units3 ist nach drei verschiedenen Seiten erfüllt, nicht bei derselben dreimal', () => {
  // unit 'a' dreimal → nicht erfüllt; a, b, c → erfüllt
});

test('jede Mission zahlt genau einmal', () => {
  // zwei Runden mit 90 % → strong90 einmal erfüllt
});

test('Grenze 90 % zählt als stark', () => {
  // accuracy 0.9 → strong 1, accuracy 0.89 → strong 0
});
```

Dazu in `apphome.test.js`: Karte „Diese Woche“ zeigt „2 von 3 Seiten“ bei zwei verschiedenen Seiten.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test regeln/tests/missions.test.js seiten/tests/apphome.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement**

`recordMission` ist rein, Zeit kommt von außen. Belohnung über `awardXP`, damit Tagesziel und Level gleich wirken. Karte in `apphome.js` zeigt Text und Häkchen-Symbol, nicht nur Farbe.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add regeln seiten
git commit -m "Wochenmissionen mit einmaliger Belohnung"
```

## Task 8: Lernpfad-Karte (weich)

**Files:**
- Modify: `seiten/apphome.js:116-130` (Liste durch Karte mit Stationen ersetzen)
- Modify: `seiten/design/styles/base.css` oder neue Datei unter `seiten/design/styles/` (nur Tokens, keine festen Farben)
- Test: `seiten/tests/apphome.test.js` (ergänzen), `seiten/tests/a11y.test.js` (ergänzen)

**Interfaces:**
- Consumes: `units` in Manifest-Reihenfolge, `app.stars`, `isRefreshDue` aus Task 2.
- Produces: `stationState(app, unit, day) => 'offen' | 'geübt' | 'gemeistert' | 'fällig'`. Text und Symbol, nicht nur Farbe.
- Verhalten: nächste Station (erste ohne Stern) wird hervorgehoben, nicht gesperrt. Endgegner-Sperre bleibt unverändert (`bossUnlocked`).

- [ ] **Step 1: Write the failing tests**

```js
test('stationState: offen ohne Stern', () => { /* app.stars leer */ });
test('stationState: geübt bei 1–2 Sternen', () => { /* stars 2 → geübt */ });
test('stationState: gemeistert bei 3 Sternen', () => { /* stars 3 → gemeistert */ });
test('stationState: fällig hat Vorrang vor geübt', () => { /* isRefreshDue true → fällig */ });
test('leeres app.stars ohne Absturz', () => { /* app.stars undefined */ });
```

Dazu in `a11y.test.js`: jede Station ist ein Button mit Text, nicht nur mit Farbe.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test seiten/tests/apphome.test.js seiten/tests/a11y.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement**

`stationState` in `seiten/apphome.js` oder eigenem Modul unter `seiten/`. Karte mit Verbindungslinie, Stationen sind Buttons mit mindestens 44 px. Keine harte Sperre. Endgegner unverändert.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add seiten
git commit -m "Lernpfad als Karte mit Stationen, weich freigeschaltet"
```

## Task 9: Verifikation

**Files:** keine Änderung.

- [ ] **Step 1: Volle Testsuite**

Run: `npm test`
Expected: alle Suiten grün, inklusive `grenzen`- und Smoke-Tests.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Build ohne Fehler, `dist/` aktualisiert.

- [ ] **Step 3: Sichtprüfung**

Run: `npm run dev`, dann im Browser Startseite und Lernpfad-Karte bei 375 px und 1280 px, hell und dunkel.
Expected: Stationen lesbar, Ziel-Auswahl bedienbar per Tastatur, kein horizontales Scrollen.

## Execution Handoff

Plan gespeichert unter `docs/superpowers/plans/2026-10-27-gamification-lernwirkung.md`. Bitte prüfen. Für die Ausführung empfehle ich den nativen Weg (`superpowers:executing-plans`), weil die Aufgaben über `regeln/` aufeinander aufbauen und die Schnittstellen eng sind. Welcher Weg?

## Task 10: Fehler-Abruf (Spec 5.2)

**Files:**
- Modify: `runde/src/round.js` (jeder Versuch trägt `label`; Ergebnis liefert `missedLabels`)
- Create: `runde/src/abruf.js` (`withMissed(pool, missedLabels, size, rng)`)
- Modify: `regeln/src/round.js` (`finishRound` nimmt `missedLabels`, `settleLesson` schreibt `app.missed[unitId]`)
- Modify: `seiten/rahmen.js` (Lektionspool über `withMissed` bauen, `missedLabels` durchreichen)
- Test: `runde/tests/abruf.test.js` (neu), `runde/tests/runde-fabrik.test.js` (ergänzen), `regeln/tests/round.test.js` (ergänzen), `seiten/tests/rahmen.test.js` (ergänzen)

**Interfaces:**
- Consumes: Fragen mit `label` (string). Labels sind feste Kategorien je Fragetyp, keine Zufallszahlen (geprüft in apps/*/builders.js).
- Produces: Ergebnisfeld `missedLabels: string[]` in `runde/src/round.js` finish(). Eindeutige Labels der Fragen, deren ERSTER Versuch `outcome === 'bad'` war. Wiederholungen (`retry`) und `almost` zählen nicht. Reihenfolge: erstes Vorkommen.
- Produces: `withMissed(pool, missedLabels, size, rng) → pool'`. Liefert `size` Fragen aus dem Pool (ohne Zurücklegen, mit `rng`). Ist mindestens eine Frage mit `label` aus `missedLabels` im Pool, ist mindestens eine davon in der Auswahl. Ohne Treffer gleich wie `shuffle(pool, rng).slice(0, size)`.
- Produces: `finishRound({ ..., missedLabels })` schreibt `app.missed[unitId] = missedLabels` bei jeder Lektionsrunde. Ersetzt den alten Stand, sammelt nicht. Fehlt der Eintrag, gilt `[]`.
- Regel R13 (Controller): "zuerst" in Spec 5.2 heißt "garantiert enthalten", nicht "vorn in der Reihenfolge". `createRound` mischt die Reihenfolge; eine feste Vorn-Position würde die Engine umbauen. Kosten bei Fehler: eine Frage erscheint irgendwo in der Runde statt vorn.

- [ ] **Step 1: Write the failing tests**

Tests zuerst, mit konkreten Fixtures nach dem Muster der bestehenden Dateien (R3). Werte aus dieser Task und der Spec 5.2.
- runde: Ein Lektionsversuch mit `bad` im ersten Versuch liefert `missedLabels` mit dem Label. Ein `retry`-Versuch, der richtig wird, nimmt das Label nicht auf. Ein `almost` nimmt es nicht auf.
- runde/abruf: `withMissed` enthält eine Frage mit einem missed-Label, wenn eine im Pool ist. Ohne missed-Labels ist das Ergebnis dasselbe wie `shuffle(pool, rng).slice(0, size)` mit gleichem Seed. Gleicher Seed gibt gleiche Auswahl.
- regeln: `finishRound` mit `missedLabels: ['Lücke füllen']` setzt `app.missed.<unitId>` auf genau diese Liste. Eine zweite Lektionsrunde mit `[]` setzt es auf `[]` (ersetzt, sammelt nicht).
- seiten/rahmen: Eine Lektionsrunde mit gespeichertem `app.missed` baut den Pool über `withMissed`. Der Log-Eintrag bleibt unverändert, keine neuen Felder.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test runde/tests/abruf.test.js regeln/tests/round.test.js` (aus modernized/modulare-reimagined)
Expected: FAIL (fehlendes Modul, fehlendes Feld).

- [ ] **Step 3: Implement**

1. `runde/src/round.js`: Versuch-Eintrag um `label: q.label` ergänzen. Im Ergebnis `missedLabels` aus den ersten Versuchen mit `outcome === 'bad'` und `retry` false bilden, eindeutig.
2. `runde/src/abruf.js`: `withMissed` wie oben, mit `rng` und ohne Zufall aus `Math.random`.
3. `regeln/src/round.js`: `missedLabels` als Eingabe (Standard `[]`), in `settleLesson` nach dem Übungstag in `app.missed[unitId]` schreiben. Das Ergebnis `missedLabels` durchreichen.
4. `seiten/rahmen.js`: Vor `createRound` (um Zeile 99) bei Lektionsrunden den Pool über `withMissed` mit `app.missed[unit.id]` bauen. `missedLabels` aus dem Rundenergebnis an `finishRound` übergeben (dort, wo `retryRight` schon übergeben wird).

- [ ] **Step 4: Run tests**

Run: `npm test` (volle Suite grün)
Expected: alle Suiten grün, Zahl der Tests steigt um die neuen.

- [ ] **Step 5: Commit**

```bash
git add runde regeln seiten
git commit -m "Fehler-Abruf: Fragen aus der letzten Runde kommen wieder vor"
```
