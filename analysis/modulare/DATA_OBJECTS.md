# Data Objects — modulare

## QuizQuestion
Source: `core/js/quiz.js:4-19 (contract); built by core/js/questions.js:17-25 and literal objects in apps/informatik/builders.js:237-243, apps/franzoesisch-verben/build…`

| Field | Type | Note |
|---|---|---|
| kind | 'choice' / 'type' / 'match' | quiz.js:5; dispatched via registry in core/js/qtypes.js:16-34 |
| label | string (required) | questions.js:11,23; asserted by qtypes.js:188 |
| chip | html string? | track or verb badge, quiz.js:7 |
| prompt | html string? | may contain {{blank}}, quiz.js:8, qtypes.js:65 |
| promptStyle | 'sentence' / 'big' | questions.js:17,23 |
| sub | string? | translation line shown after success, quiz.js:10,44 |
| answer | string | choice: option id; type: expected text, quiz.js:11 |
| options | Option[] (choice only) | shuffled at build time, questions.js:18 |
| optionsLayout | 'list'? | quiz.js:13, qtypes.js:88 |
| placeholder | string? | quiz.js:14, qtypes.js:113 |
| accents | boolean? | enables accent bar, qtypes.js:110 |
| check | (input: string) => 'ok' / 'almost' / 'bad' | type only; default defaultCheck qtypes.js:37-43 |
| left / right / leftValues | html[] / {value,html}[] / string[] | match only, quiz.js:15 |
| reveal | html? | correction on wrong answer, questions.js:19,24 |
| why | string? | explanation on wrong answer, quiz.js:17,50 |
| help | html? | Spickzettel content, quiz.js:18,99 |
| retry | boolean (runtime only) | set on re-asked copy, quiz.js:130 |

Used by: Typed-answer question: the stored answer is the only expected answer, no option…, Multiple-choice options: correct answer plus up to three distractors, shuffled, Lesson round composition: 8 questions, every third one typed, Random question pick across all pages for the quick round and the blitz, Strang-Etikett an Fragen (chip), Erklärung bei falscher Antwort, Second attempt: re-ask a wrong question at the end of the round, Hint (Spickzettel) costs 3 XP once per question, Choice question: check gate and grading, Matching question grading, Question content validation (authoring guard), Round size and sequence (lesson, quick and boss rounds), Blitz round: 45-second timer and end, Blitz question draw (choice questions only, easy level), Typed answer is correct only after normalization, Prüfung einer Eingabe-Antwort (Wort eintippen), Endgegner-Runde: 12 Fragen, Seiten im festen Wechsel, Schnellrunde und Blitz-Frage aus allen Seiten, Übungsrunde einer Seite: 8 Fragen aus dem Aufgabenpool

## Option
Source: `core/js/questions.js:5-6 (option factory); used by core/js/qtypes.js:83-98 and core/js/blitz.js:30-38`

| Field | Type | Note |
|---|---|---|
| id | string | stored value; must be unique (qtypes.js:79) |
| html | html string | display text; default esc(id) |
| fill | string? | text inserted into {{blank}}, qtypes.js:49,81 |

Used by: Multiple-choice options: correct answer plus up to three distractors, shuffled, Antwortauswahl: richtige Antwort plus drei falsche, Reihenfolge gemischt, Distraktor-Generator: mindestens drei verschiedene falsche Antworten, Antwortauswahl bei Lückensätzen, Antwortauswahl bei Aussagefragen (max. 4 Optionen), Auswahlantworten: richtige Form plus falsche Formen desselben Verbs, Answer option order is randomised, Blitz question draw (choice questions only, easy level), Multiple-choice question has four options: the correct answer plus three distra…, Auswahl der falschen Antworten bei Multiple Choice, Ausweichzahlen für Multiple-Choice nahe der richtigen Zahl

## Match pairs (kind 'match')
Source: `core/js/qtypes.js:146-184; built in apps/informatik/builders.js:235-243 (nibbleMatchQ) and apps/franzoesisch-verben/builders.js:73-75 (matchQ)`

| Field | Type | Note |
|---|---|---|
| left | html[] | left labels, esc'd at build time |
| right | {value: string, html: string}[] | shuffled right column |
| leftValues | string[] | correct right value for each left index; multiset must equal right values (qtypes.js:150) |
| run.m (match state) | {selL: number/null, doneL: {}, doneR: {}, slips: number, fl… | qtypes.js:152; a wrong pairing costs a heart (qtypes.js:177) |

Used by: Zuordnungsaufgabe: Pronomen zu Formen, Nibble matching question (four bits to hex digit), Matching question grading, Hearts: starting amount and loss, Verbinde Pronomen und Form

## QuizRun (round state)
Source: `core/js/quiz.js:26-33 (newRun), quiz.js:66-73 (startQuiz), quiz.js:81-88 (gain)`

| Field | Type | Note |
|---|---|---|
| mode | 'lesson' / 'boss' / 'quick' | quiz.js:27 |
| questions | QuizQuestion[] | copy of the round; grows by re-asked questions, quiz.js:69,130 |
| i | int | index of the current question |
| hearts / maxHearts | int | start 5, boss 3, quiz.js:66 |
| xp, correct, almost, wrong, combo, bestCombo | int | quiz.js:29; XP is saved immediately via gain() (quiz.js:87) |
| state | 'ask' / 'fb' | quiz.js:30 |
| fb | Feedback / null | quiz.js:30 |
| sel / typed / peek / peeked / m | int/null / string / bool / bool / match state | quiz.js:30; peeked limits the 3 XP hint cost (quiz.js:170-173) |
| levelUp / goalHit / relearned | int/null / bool / int | quiz.js:31 |

Used by: Hearts: starting amount and loss, Round end: completed or failed, Points per answer in a quiz round (combo multiplier), Round accuracy (Trefferquote), Hint (Spickzettel) costs 3 XP once per question, Second attempt: re-ask a wrong question at the end of the round, XP is kept when a round is left early, Combo-Faktor bis ×4, Matching question grading

## Feedback (run.fb)
Source: `core/js/quiz.js:110-137 (settle); core/js/qtypes.js:178 (match boss-style fail)`

| Field | Type | Note |
|---|---|---|
| kind | 'ok' / 'almost' / 'bad' | quiz.js:134 |
| gain | int (XP) | 5 for re-asked correct, 10 x multiplier for first-try ok, quiz.js:115,124 |
| mult | int 1..4 | profile.js:73 multiplier |
| retry | boolean? | quiz.js:117 |

Used by: Erklärung bei falscher Antwort, Second attempt scoring, Points per answer in a quiz round (combo multiplier), Choice question: check gate and grading, Genauigkeit zählt nur Erstversuche

## Round result (quiz finish payload)
Source: `core/js/quiz.js:147-155 (finish); consumed by core/js/shell.js:88 and core/js/rounds.js:10-47`

| Field | Type | Note |
|---|---|---|
| mode | 'lesson' / 'boss' / 'quick' | quiz.js:150 |
| failed | boolean | true if hearts reached 0, quiz.js:160 |
| total | int | baseCount, excludes re-asked questions, quiz.js:148 |
| accuracy | number 0..1 | (correct + 0.5*almost)/total, quiz.js:149 |
| correct, almost, wrong | int | quiz.js:152; re-asked answers do not count, quiz.js:113-121 |
| bestCombo, xp, relearned | int | quiz.js:153 |
| levelUp, goalHit | int/null, bool | quiz.js:154 |
| unit | Unit (added by shell.js:88) | absent in blitz |

Used by: Round accuracy (Trefferquote), Genauigkeit zählt nur Erstversuche, Round end: completed or failed, Finishing a round evaluates, saves, logs and shows the result, Result headline, text and celebration by outcome, Trophäe Perfekte Runde, Trophäen-Schwelle Combo und Blitz-Punkte, Trophäe Endgegner besiegt, Sterne-Trophäen: Seite gilt als begonnen ab einem Stern, Trophäen-Auswertung nach jeder Runde

## Blitz run and result
Source: `core/js/blitz.js:18 (run), core/js/blitz.js:57 (result)`

| Field | Type | Note |
|---|---|---|
| run | {score, xp, combo, bestCombo, lock, q, t0, levelUp, goalHit… | blitz.js:18 |
| result | {mode: 'blitz', score: int, xp: int, bestCombo: int, levelU… | no accuracy, failed, stars, total or unit; shell.js:104 logs accuracy as undefined for blitz |
| seconds | int | default 45, blitz.js:16; result.js:14 repeats 45 as text |

Used by: Blitz round: 45-second timer and end, Blitz scoring: XP, combo and score, Blitz praise threshold at 10 correct answers, Trophäen-Schwelle Combo und Blitz-Punkte, Blitz question draw (choice questions only, easy level)

## Finalized round outcome
Source: `core/js/rounds.js:10-47 (finalizeRound), core/js/rounds.js:44 (trophy state)`

| Field | Type | Note |
|---|---|---|
| stars | int 0..3 | rounds.js:11; 0 for blitz; persisted only for lesson mode, rounds.js:28 |
| bonus | int | 10 for refresh (rounds.js:21), 50 for boss win (rounds.js:34) |
| refresh | boolean? | rounds.js:20 |
| newBadges | Badge[] | rounds.js:45; each id set to true in app.badges (rounds.js:46) |
| trophy state | {profile, app, streak} | rounds.js:44, passed to Badge.when |

Used by: Refreshing a due unit grants 10 bonus XP, Boss win grants 50 bonus XP, Trophy earned state and newly earned trophies, Sterne-Trophäen: Seite gilt als begonnen ab einem Stern, Unit becomes due for refresh after 3 days, Finishing a round evaluates, saves, logs and shows the result, Profil und App-Stand werden nach einer Runde gespeichert, Runde wird protokolli…

## Profile document
Source: `core/js/profile.js:6 (key), profile.js:14 (defaults); written by core/js/rounds.js:42 and core/js/quiz.js:84`

| Field | Type | Note |
|---|---|---|
| name | string (max 20, trimmed) | shell.js:121-122 |
| xp | int | profile.js:56 |
| streak | int | profile.js:45 |
| lastDay | 'YYYY-MM-DD' | profile.js:22-23 |
| lastApp | app id | rounds.js:42; read by dashboard.js:38 |
| day | {d: 'YYYY-MM-DD', xp: int} | daily goal, profile.js:58-59 |

Used by: Daily XP goal of 30 XP, Practice streak with one grace day, Level thresholds and XP progress bar, Continue card shows only the last-used live app, Player name required, trimmed, max 20 characters, asked once, Daily goal ring and status message, Streak trophy (Trophäe Serie, Tage in Folge), Profil und App-Stand werden nach einer Runde gespeichert, Runde wird protokolli…

## App progress document
Source: `core/js/profile.js:7 (key lernwerkstatt:app:<id>), profile.js:16 (defaults); written by core/js/rounds.js:19-46`

| Field | Type | Note |
|---|---|---|
| xp | int | profile.js:57 |
| stars | {[unitId]: 0..3} | rounds.js:28 (lesson only); read by rules.js:14 and dashboard.js:19 |
| badges | {[badgeId]: true} | rounds.js:46; read by dashboard.js:21 |
| best | {blitz?: int, boss?: true} | rounds.js:31,38 |
| last | {[unitId]: 'YYYY-MM-DD'} | rounds.js:26; drives isDue, profile.js:79-82 |
| acc | {[unitId]: number 0..1} | rounds.js:27; drives weakestUnit, profile.js:88-95 |

Used by: Sterne-Trophäen: Seite gilt als begonnen ab einem Stern, Unit becomes due for refresh after 3 days, Training recommendation: due first, then weakest unit, Collection album card tier from stars, Boss unlock: every unit needs at least one star, Reset of one app's progress requires two confirmations, Zurücksetzen leert Fortschritt, Unit completion and per-app progress percentage, Total trophy count on the home screen, Trophy earned state and newly earned trophies

## Store envelope and store handle
Source: `core/js/store.js:24-59 (createStore); core/js/db.js:47 (docs record {key, value, updatedAt})`

| Field | Type | Note |
|---|---|---|
| stored envelope | {...state, __v: int} | store.js:51 (version stamp); __v removed on load, store.js:38-40 |
| state | object | deep-merged with defaults, store.js:41 deepMerge (10-16) |
| backend | 'indexeddb' / 'localstorage' | store.js:49 |
| save() / reset() | functions | store.js:50-56; best-effort, errors swallowed |

Used by: Stored data keeps unknown fields, gains new default fields, and migrates on ver…, Stored document schema version and migration hook, Unreadable or non-object stored document falls back to defaults, Document save is best-effort; reset restores defaults, Saved progress is restored after reload; reset returns state to defaults, Altstand aus localStorage wird in IndexedDB übernommen, Zurücksetzen leert Fortschritt

## Storage backend contract
Source: `core/js/db.js:17-24 (schema), db.js:39-74 (IndexedDB), db.js:77-95 (fallback), db.js:100-112 (getDB)`

| Field | Type | Note |
|---|---|---|
| name | 'indexeddb' / 'localstorage' | db.js:42,84 |
| sync | true? (fallback only) | db.js:85; skips legacy copy, store.js:30 |
| collections | docs {key, value, updatedAt}; log {id autoIncrement, app, t… | db.js:18-22 |
| methods | get/put/remove/all/legacy/logAdd/logList/logReplace | db.js:41-93 |

Used by: Storage backend selection with fallback, Database schema: two collections, Altstand aus localStorage wird in IndexedDB übernommen, Event log retention and default read window, Event logging timestamp and error tolerance

## Event log entry
Source: `core/js/db.js:136-142 (logEvent, listEvents); written by core/js/shell.js:104`

| Field | Type | Note |
|---|---|---|
| ts | int (epoch ms) | db.js:137, added automatically |
| app | string | shell.js:104 |
| type | 'round' | shell.js:104 |
| mode | 'lesson' / 'boss' / 'quick' / 'blitz' | shell.js:104 |
| unit | string / null | shell.js:104 |
| accuracy / stars / failed / score / xp | number / undefined / boolean | shell.js:104; blitz has no accuracy, so undefined is dropped by JSON |

Used by: Event logging timestamp and error tolerance, Event log retention and default read window, Profil und App-Stand werden nach einer Runde gespeichert, Runde wird protokolli…, Backup export contents

## Backup file
Source: `core/js/db.js:120-133 (exportAll, importAll); core/js/views/backup.js:4-16`

| Field | Type | Note |
|---|---|---|
| app | 'lernwerkstatt' (const check) | db.js:127 |
| format | int (1) | db.js:122 |
| exportedAt | ISO string | db.js:122 |
| docs | {[key]: object} | keys must start with 'lernwerkstatt:', db.js:130 |
| log | LogEntry[] (max 1000) | db.js:122, LOG_MAX db.js:10 |

Used by: Backup export contents, Backup export contains all saved data and events; import restores it and reject…, Restore only from a valid Lernwerkstatt file, then reload

## Content bundle
Source: `core/js/content.js:3-4 (contract); core/js/validate.js:11-51 (assertBundle); schemas/bundle.schema.json:1-14`

| Field | Type | Note |
|---|---|---|
| manifest | Manifest (required) | validate.js:15-30 |
| lessons | {[unitId]: Lesson} (required) | validate.js:31-37 |
| badges | Badge[] (required, min 1) | validate.js:38-43 |
| data | object (optional, app-specific shape) | content.js:28 defaults to {} |

Used by: Inhaltspaket als Ganzes pruefen (Tor vor dem Start), Paketprüfung je Inhaltsordner, Schema lehnt unvollständige oder falsche Pakete ab, Inhaltsquelle: HTTP-API oder lokale Dateien, Statische Inhaltsdateien: Pflicht und Optional, Vorgaben fuer fehlende optionale Teile, Reihenfolge beim Aufbau: pruefen, dann Logik vorbereiten, dann Lektionen, HTTP-Quelle holt und prüft das Paket, Offline-Zwischenspeicher fuer API-Inhalte

## Content source
Source: `core/js/content.js:22-67 (createStaticSource, createHttpSource, withCache); core/js/boot.js:10-13 (defaultSource)`

| Field | Type | Note |
|---|---|---|
| name | 'static' / 'http' / '<name>+cache' | content.js:24,36,52 |
| load(appId) | Promise<Bundle> | content.js:26-28, 38-41, 54-65 |
| PARTS | manifest, lessons, badges required; data optional | content.js:10 |
| cache key | 'lernwerkstatt:content:<appId>' | content.js:51 |

Used by: Inhaltsquelle: HTTP-API oder lokale Dateien, Statische Inhaltsdateien: Pflicht und Optional, Offline-Zwischenspeicher fuer API-Inhalte, Fehlerzustand statt halbem Start, HTTP-Quelle holt und prüft das Paket

## Manifest
Source: `content/<id>/manifest.json; validated core/js/validate.js:11-30; schema $defs.manifest schemas/bundle.schema.json:19-68 (additionalProperties false at line 22)`

| Field | Type | Note |
|---|---|---|
| schema | const 1 | bundle.schema.json:24 |
| id | string, [a-z0-9-]+ | validate.js:17 |
| title / greeting / intro | string (required) | validate.js:18 |
| bossTitle | string? | appconfig.js:36 |
| inputChars | string[] (1-2 chars each)? | bundle.schema.json:30 |
| words | Words? | see Words |
| tracks | {[trackId]: Track}? | validate.js:23-25 |
| units | Unit[] (min 1, required) | validate.js:19-22 |
| notes | {[unitId]: [heading, text][]}? | bundle.schema.json:47-51 |
| resources | Resource[]? | validate.js:26-30 |
| dashboardHref | string? (read by runtime, not in schema) | appconfig.js:39; schema line 22 forbids it; no content uses it |

Used by: Kopfdaten der App pruefen (id, Titel, Gruss, Einleitung), Seiten des Lernpfads: Anzahl, Eindeutigkeit, Pflichtfelder, Lernstraenge und ihre Verweise, Lernmaterial: Titel, Strang und sicherer Pfad, Registry und Inhalt stimmen überein, Inhaltspaket als Ganzes pruefen (Tor vor dem Start)

## Unit (Lernpfad-Seite)
Source: `manifest.units[] in content/<id>/manifest.json; schema $defs.unit bundle.schema.json:69-81; app-specific extras in content/fr-verben/manifest.json:46-83 (verbs…`

| Field | Type | Note |
|---|---|---|
| id | slug, stable (never renamed) | bundle.schema.json:73; validate.js:20-21 uniqueness |
| title / de / ic | string (required) | validate.js:22 |
| color | #RRGGBB | bundle.schema.json:18,77 |
| track | track id? | validate.js:25 |
| card | {name: string, fact: string} (Sammelkarte) | bundle.schema.json:79 |
| verbs / irr (fr only) | string[] / boolean | fr manifest units, read by apps/franzoesisch-verben/builders.js:98-133 |

Used by: Seiten des Lernpfads: Anzahl, Eindeutigkeit, Pflichtfelder, Sammelalbum card, Collection album card tier from stars, Endgegner-Runde: 12 Fragen, Seiten im festen Wechsel, Schnellrunde und Blitz-Frage aus allen Seiten, Lektionsrunde: acht Aufgaben nach Verbtyp, Each unit has at least 10 unique questions and each question is internally cons…, Boss unlock: every unit needs at least one star

## Track
Source: `core/js/tracks.js:5-9; manifest.tracks; schema bundle.schema.json:41-45`

| Field | Type | Note |
|---|---|---|
| label | string (required) | validate.js:24 |
| desc | string? | tracks.js:9 (title attribute) |
| trackOf() result | {id, label, desc?} | tracks.js:6 |

Used by: Strang-Etikett an Fragen (chip), Lernstraenge und ihre Verweise, Strang-Verweise müssen bekannt sein, LRS-Förderung track marks six units, all printed material, and the questions of…

## Resource (Lernmaterial)
Source: `manifest.resources[]; validate.js:8,26-30; schema bundle.schema.json:52-66; rendered core/js/views/home.js:48-50`

| Field | Type | Note |
|---|---|---|
| title | string (required) | validate.js:28 |
| desc | string? | home.js:49 |
| track | track id? | validate.js:27 |
| href | relative path, no scheme, no leading slash, no '..' | validate.js:8,29 isSafeHref |

Used by: Materiallinks nur als sichere relative Pfade, Lernmaterial: Titel, Strang und sicherer Pfad

## Lesson
Source: `content/<id>/lessons.json[unitId]; validate.js:5,31-37; schema $defs.lesson bundle.schema.json:83-116; typed in core/js/lesson.js:8-19`

| Field | Type | Note |
|---|---|---|
| goal | string | lesson.js:11; escaped at lesson.js:28 |
| tldr | html string[] (2-4) | lesson.js:12, inserted raw at lesson.js:26 |
| analogy | {title: string, html: html} | lesson.js:13,30 |
| figure | Figure | see Figure reference |
| steps | {title: string, items: html[] (min 2)} | lesson.js:15,36 |
| pitfall | {html: html} | lesson.js:41 |
| rule | string (Merksatz) | lesson.js:17,42 |
| check | {q: html, options: {id, html}[] (min 3), answer: option id,… | lesson.js:18,37-44; schema bundle.schema.json:104-114 |

Used by: Lesson section order is fixed, Worked-steps reveal one step at a time, Mini-check locks after the first answer, Lektion und Sammelkarte haben alle Pflichtteile, A lesson must contain all required parts, and its mini-check must be well formed, Missing lesson has no fallback, HTML escaping: which lesson fields are trusted HTML, Default theory page composition, Abbildung einer Lektion aufloesen

## Figure reference and resolved figure
Source: `core/js/appconfig.js:16-21 (resolveFigure); schema bundle.schema.json:91-100`

| Field | Type | Note |
|---|---|---|
| diagram (input) | {name: identifier, args: any[]} | resolved by logic.diagrams[name](...args) |
| caption | html string (required) | bundle.schema.json:95 |
| svg (resolved) | string (SVG markup) | appconfig.js:20 returns {svg, caption} |
| figure.svg (inline) | string, alternative to diagram | appconfig.js:17 |

Used by: Abbildung einer Lektion aufloesen, Diagram accessibility wrapper, Diagramme: Personen und graue stumme Endungen, Flussdiagramm: gleiche Kastenbreite, erster Schritt hervorgehoben, Tabellendiagramm: Spaltenbreite nach Gewicht, Vorher-Nachher-Diagramm: Pfeile zeigen das Umformen, Sum diagram: the drawn result is computed, with + as addition and any other ope…, Zahlen im Diagramm werden berechnet, nicht von Hand getippt, Begleitdiagramme rechnen dieselben Formeln wie die Aufgaben

## SVG diagram string
Source: `core/js/svg.js:8-9 (svg frame), svg.js:11-16 (primitives)`

| Field | Type | Note |
|---|---|---|
| markup | string (<svg class=dg viewBox role=img aria-label>) | svg.js:9; aria-label escaped via esc() |
| label | string (required alt text) | svg.js:8 |
| primitives | rect / circle / text / line / arrow / path -> string | svg.js:11-16; classes come from core/styles/lesson.css |

Used by: Diagram accessibility wrapper, Place-value table diagram, Binary decomposition bar diagram, Binary addition carry diagram, Hex place-value and nibble diagrams, Mittelsenkrechte-Bild: Bögen mit Radius größer als halbe Strecke, Winkelbeschriftung in den Bildern: Scheitel-/Nebenwinkel, Winkelhalbierende, Th…, SSS-Dreieck-Bild: Ecke C aus den drei Seiten berechnet, Umkreis- und Inkreis-Bild: Mittelpunkte der Dreieckskonstruktion

## Geometry point and circle values
Source: `apps/geometrie/geom.js:4-38`

| Field | Type | Note |
|---|---|---|
| point | [x: number, y: number] (SVG coords, y down) | geom.js:7 at(); circumcenter() returns one, geom.js:27-32 |
| incircle result | {I: [x, y], r: number} | geom.js:34-38 |
| arc params | (cx, cy, r, a0, a1, cls) angles in degrees, counter-clockwi… | geom.js:11-14; large-arc flag = span>180, sweep fixed at 0 |
| rounding | f1(n) to one decimal | geom.js:5 |

Used by: Incircle centre and inradius of a triangle, Circumcentre of a triangle, Drawn coordinates and radii rounded to one decimal place, Angle to drawing point conversion, Arc drawing: large-arc flag and fixed sweep direction, Right-angle marker square completion

## Badge
Source: `content/<id>/badges.json[]; validate.js:38-43; schema bundle.schema.json:117-122; runtime form core/js/appconfig.js:50`

| Field | Type | Note |
|---|---|---|
| id | slug, unique, never reused | validate.js:41; bundle.schema.json:121 |
| n | string (name) | validate.js:42 |
| d | string (description) | validate.js:42 |
| rule | Trophy rule | validate.js:42 via ruleErrors |
| when (runtime) | (state, result) => boolean | appconfig.js:50 wraps evaluateRule |

Used by: Trophaeen: Pflichtfelder, eindeutige Kennungen, gueltige Regel, Trophäen-Aufbau prüfen (Tippfehler finden), Trophäe Perfekte Runde, Trophäen-Schwelle Combo und Blitz-Punkte, Trophäe Endgegner besiegt, Trophäe Serie (Tage in Folge), Trophäen-Kombination UND / ODER, Trophäen-Auswertung nach jeder Runde, Total trophy count on the home screen

## Trophy rule (declarative)
Source: `core/js/rules.js:4-12 (doc), rules.js:16-27 (TYPES), rules.js:32-53 (evaluateRule, ruleErrors); schema $defs.rule bundle.schema.json:123-132`

| Field | Type | Note |
|---|---|---|
| type | 'anyUnit' / 'unit' / 'units' / 'perfectRound' / 'combo' / '… | rules.js:16-27 |
| id / stars (unit) | slug / int 1..3? | rules.js:17-18; schema line 127 |
| ids (units) | string[] | rules.js:19 |
| min (combo, blitz) | int >= 1 | rules.js:21-22 |
| days (streak) | int | rules.js:24; schema requires >= 2 (bundle.schema.json:130), rules.js:51 only > 0 |
| rules (all, any) | Rule[] (min 1) | rules.js:25-26 |

Used by: Trophäen-Kombination UND / ODER, Sterne-Trophäen: Seite gilt als begonnen ab einem Stern, Trophäe Perfekte Runde, Trophäen-Schwelle Combo und Blitz-Punkte, Trophäe Endgegner besiegt, Trophäe Serie (Tage in Folge), Trophäen-Aufbau prüfen (Tippfehler finden), Eine neue Trophäen-Regel ist ein neuer Eintrag in TYPES plus Test

## Notes (Merkzettel)
Source: `manifest.notes; schema bundle.schema.json:47-51; read by core/js/appconfig.js:28, core/js/theory.js:9, apps/informatik/theory.js:135, apps/franzoesisch-verben/…`

| Field | Type | Note |
|---|---|---|
| {unitId} | [heading: string, text: string][] | bundle.schema.json:50 |

Used by: Default theory page composition

## Words
Source: `manifest.words; schema bundle.schema.json:31-40; defaults in core/js/shell.js:24-30`

| Field | Type | Note |
|---|---|---|
| praise | string[] (min 1) | quiz.js:43 |
| resultTitles | string[3] | result.js:19 |
| blitzTitle | string | result.js:13 |
| levelTitles | string[] (min 1) | profile.js:35 titleOf via shell.js:52 |

Used by: Blitz praise threshold at 10 correct answers, Result headline, text and celebration by outcome, Level thresholds and XP progress bar, Richtig! / Genau! praise pool (quiz.js:43)

## Runtime app config
Source: `core/js/appconfig.js:23-52 (buildConfig); consumed by core/js/boot.js:21 and core/js/shell.js:19-96`

| Field | Type | Note |
|---|---|---|
| id, title, greeting, intro, bossTitle, words, inputChars, dashboardHref | from manifest | appconfig.js:31-39 |
| units, resources, tracks, notes, lessons, data | from bundle | appconfig.js:40-46 |
| theory(box, unit, api) | function | appconfig.js:46 |
| rounds | {lesson, quick?, boss?} | logic.rounds, appconfig.js:47; optional rounds read by home.js:28,58 |
| blitz, bossUnlocked | function? | appconfig.js:48-49 |
| badges | {id, n, d, rule, when}[] | appconfig.js:50 |

Used by: Initialisation: round content is bound once, before the first round, Template offers lesson rounds, quick round and blitz only; no boss round, Vorgaben fuer fehlende optionale Teile, Reihenfolge beim Aufbau: pruefen, dann Logik vorbereiten, dann Lektionen, Screen navigation state machine (home, theory, play, result), Endgegner wird freigeschaltet, wenn alle Seiten einen Stern haben

## App logic module contract
Source: `apps/<name>/logic.js default export; contract doc core/js/appconfig.js:7-15; e.g. apps/mathe/logic.js:3-6, apps/_template/logic.js:3-6`

| Field | Type | Note |
|---|---|---|
| init | ({data, manifest}) => void? | appconfig.js:26 |
| rounds | {lesson(unit), quick?(), boss?()} | appconfig.js:9 |
| blitz | () => QuizQuestion? | appconfig.js:10 |
| diagrams | {[name]: (...args) => svg string} | appconfig.js:11 |
| theory / bossUnlocked | function? | appconfig.js:13-14 |

Used by: Initialisation: round content is bound once, before the first round, Template offers lesson rounds, quick round and blitz only; no boss round, Modell-Initialisierung aus dem Inhaltspaket, Sum diagram: the drawn result is computed, with + as addition and any other ope…

## Deutsch data item
Source: `content/deutsch/data.json items[unitId][] (245 items, 15 units, 11-24 per unit); read by apps/deutsch/builders.js:3-8, 19-24, 33-62`

| Field | Type | Note |
|---|---|---|
| q | string (instruction or question) | builders.js:40 |
| s | string? (sentence, '___' marks the gap) | builders.js:27; present on 136 items |
| kind | 'gap'? | 90 gap items, 155 choice items |
| a | string (answer) | builders.js:37,46 |
| wrong | string[] | gap items have <= 3 (used in full, builders.js:36); choice items need >= 3 (sliced to 3, builders.js:41) |
| why | string | explanation, builders.js:37 |
| label | string? | builders.js:34 |
| accept | string[]? | extra correct typed inputs, builders.js:46 |

Used by: Lesson round composition: 8 questions, every third one typed, Antwortauswahl bei Lückensätzen, Prüfung einer Eingabe-Antwort (Wort eintippen), Keine Wiederholung von Beispielsätzen innerhalb einer Runde, Gap answers are graded tolerantly: case and surrounding spaces ignored, a wrong…, Each Deutsch lesson round has 8 valid questions and the boss round is valid, Schnellrunde und Blitz-Frage aus allen Seiten, Endgegner-Runde: 12 Fragen, Seiten im festen Wechsel, Strang-Etikett an Fragen (chip), LRS-Förderung track marks six units, all printed material, and the questions of…

## Fr verb record
Source: `content/fr-verben/data.json verbs{}; runtime form apps/franzoesisch-verben/model.js:5-7, 25-37`

| Field | Type | Note |
|---|---|---|
| de | string (German gloss) | data.json verbs |
| inf | string? (default = key) | model.js:32; present for ecouter, repondre |
| group | 'er' / 'ir' / 're' (regular only) | model.js:35 GE[group] |
| stem | string (regular only) | model.js:35 |
| forms | string[6] (irregular only; regular derived) | model.js:34-35; forms = stem + ends |
| deF | string[6] (irregular only) | theory.js:59; diagrams.js:19 |
| runtime key / irr / ends | string / boolean / string[6] | model.js:31-35 |

Used by: Konjugation: Stamm plus Endung je Verbgruppe, Auswahlantworten: richtige Form plus falsche Formen desselben Verbs, Every verb form has a hint and distractors that exclude the correct form, Verb conjugation tables give the six correct forms in person order, Typed verb answers: pronoun prefix and case ignored, missing accent is 'almost'…, Theorie-Seite: Tabelle, Selbsttest und Verbwechsel, Modell-Initialisierung aus dem Inhaltspaket, Lektionsrunde: acht Aufgaben nach Verbtyp

## Fr endings and pronoun tables
Source: `content/fr-verben/data.json endings, pron, pqv; model.js:8-11, 26-27; builders.js:5-7`

| Field | Type | Note |
|---|---|---|
| endings | {er/ir/re: string[6]} | empty string means silent ending (re, 3rd person) |
| pron | string[6] | model.js:10, labels e.g. 'il / elle / on' |
| pqv | string[6][] | subject variants, e.g. [['il','elle','on']] at index 2, builders.js:7 |

Used by: Endungsaufgabe: Auswahl der falschen Endungen, Personenauswahl für Endungs- und Konjugationsaufgaben, Subjektdarstellung: j' vor Vokal und h, Pronomenvariante in der dritten Person, Diagramme: Personen und graue stumme Endungen, Zuordnungsaufgabe: Pronomen zu Formen

## Fr sentence row (SP)
Source: `content/fr-verben/data.json sentences{unitId: [[verbKey, personIndex, fr-with-blank, de]]}; runtime SP in apps/franzoesisch-verben/model.js:15,37`

| Field | Type | Note |
|---|---|---|
| id | string (unitId + index) | model.js:37 |
| v | Verb record (reference) | model.js:37 |
| p | int 0..5 | person index |
| fr / de | string (fr contains '___') | model.js:37; theory.js:37-40 |

Used by: Keine Wiederholung von Beispielsätzen innerhalb einer Runde, Vorlesen der französischen Sätze, Blitz-Frage: Endung oder Satz, Welcher Satz ist richtig (sentenceQ), Each example sentence has one blank, a valid person, a known verb and a German…

## Fr traps and hints
Source: `content/fr-verben/data.json traps{verbKey: {personIndex: string[]}}, hints{verbKey: string[6]}; runtime TRAP/HINT in model.js:16-17, 29`

| Field | Type | Note |
|---|---|---|
| traps | {[verbKey]: {[personIndex]: string[]}} | first trap is offered as distractor, builders.js:24 |
| hints | {[verbKey]: string[6]} | builders.js:11; generic hint text otherwise, builders.js:10-18 |

Used by: Erklärung bei falscher Antwort, Auswahlantworten: richtige Form plus falsche Formen desselben Verbs, Every verb form has a hint and distractors that exclude the correct form

## Geometry fact pools and theorems
Source: `content/geometrie/data.json (msFacts, whFacts, drFacts, thFacts, krFacts, grFacts, prFacts, theorems, eindeutig); read by apps/geometrie/builders.js:8-23, 84-98`

| Field | Type | Note |
|---|---|---|
| *Facts | {prompt, answer, wrong: string[3], why, label}[] | builders.js:9 asWords adds choiceOnly |
| theorems | [given: string, name: string][] (4) | builders.js:88 |
| eindeutig | [given: string, answer: string, why: string][] (6) | builders.js:95 |

Used by: Kongruenzsatz- und Eindeutigkeits-Zuordnungen aus Datentabellen, Dreiecksungleichung: Existenz eines Dreiecks aus drei Seiten, Generated geometry tasks have a correct answer outside the wrong options, Winkelhalbierende: Teilwinkel ist die Hälfte, Mittelsenkrechte: Gleichweit-Eigenschaft und Mittelpunkt der Strecke

## Geometry generated item
Source: `apps/geometrie/builders.js:25-30 (num, words), make 229-235, choice 239-244, typed 246-249, POOLS 218-227`

| Field | Type | Note |
|---|---|---|
| prompt | string | escaped at choice/typed build |
| answer | string (with unit suffix for numeric, e.g. ' cm', '°') | builders.js:27 |
| value | number (numeric only) | builders.js:27; used by numCheck builders.js:248 |
| numeric | boolean | builders.js:27; canType 251 |
| wrong | string[] (>= 3 after make filter) | nearby() mathkit.js:24-28, builders.js:229-233 |
| why, label, unit | string, string?, string? | builders.js:27-28 |
| choiceOnly | boolean? (words items) | builders.js:30 |

Used by: Generated geometry tasks have a correct answer outside the wrong options and nu…, Missing triangle angle = 180° minus the two given angles, Base angle of an isosceles triangle = (180° − apex angle) ÷ 2, Right-isosceles problem answer is always 45°, Apex angle of an isosceles triangle = 180° − 2 × base angle (two problem types), Höhe eines Baumes bei 45° Peilwinkel, Maßstab: Umrechnung zwischen Zeichnung und Wirklichkeit, Thaleskreis: rechter Winkel bei C und Restwinkel, Thaleskreis: Radius ist halbe Hypotenuse, Außenwinkel im Dreieck, Scheitel-, Neben-, Stufen- und Wechselwinkel, Aufgabenmix pro Seite: Gewichtung der Erzeuger, Eintipp-Prüfung für numerische Antworten

## Mathe generated item
Source: `apps/mathe/builders.js:20-302 (generators), make 323-329, choice 306-312, typed 314-320, POOLS 292-302`

| Field | Type | Note |
|---|---|---|
| prompt | string (escaped at build) | builders.js:309,317 |
| answer | string (fmt() formatted) | builders.js:25 etc. |
| value | number? | used by numCheck, builders.js:315 |
| numeric | boolean? | builders.js:307 |
| wrong | string[] (deduped, >= 3 after make) | builders.js:326-327 |
| why | string | explanation |
| check | (input) => 'ok'/'bad' (probCheck for probabilities)? | builders.js:236,243; typed builders.js:315 |
| label, choiceOnly | string?, boolean? | choiceOnly excludes typing, canType builders.js:330 |

Used by: Multiple-choice question has four options: the correct answer plus three distra…, Eintipp-Prüfung für numerische Antworten, Eingabeprüfung: Zahl, Term oder Wahrscheinlichkeit, Nur Auswahlaufgaben werden nicht eingetippt, Aufgabenmix pro Seite: Gewichtung der Erzeuger, Prozentrechnung: Prozentwert, Grundwert, Prozentsatz, Zinsrechnung für ein Jahr: Zinsen, Kapital, Zinssatz, Dreisatz: proportional und antiproportional, Mittelwert ist immer eine ganze Zahl, Laplace-Wahrscheinlichkeit: Würfel und Urne, Ratenkredit: Zinsen und Rate im ersten Jahr, Terme zusammenfassen und Klammern auflösen, Lineare Gleichung nach x lösen, Tolerant comparison of a typed algebra term, Canonical written form of a linear term

## Mathe situations
Source: `content/mathe/data.json situations; read by apps/mathe/builders.js:11-14, 185-190`

| Field | Type | Note |
|---|---|---|
| [sentence, class] | [string, 'proportional' / 'antiproportional' / 'weder noch'… | builders.js:186; 'beides' appears only as a distractor, builders.js:187 |

Used by: Zuordnung erkennen: proportional, antiproportional, weder noch, beides, Dreisatz: proportional und antiproportional

## Informatik question parameters
Source: `apps/informatik/builders.js:16-29 (RANGE, choice, typed), numbers.js:66-74 (normInput, checker)`

| Field | Type | Note |
|---|---|---|
| type | 'dec' / 'bin' / 'hex' (typed only) | builders.js:27-28; numbers.js:66-71 |
| answer | string | builders.js:24,28 |
| wrong | (number/string)[] | distractors() numbers.js:77-93 dedupes against answer |
| help | html? (cheat sheet) | builders.js:17-20 |
| RANGE | {easy:[2,15], mid:[10,63], hard:[40,255]} | builders.js:16; 'hard' is never requested by POOLS (builders.js:247-254) |

Used by: Binary to decimal question, Decimal to binary question, Count the lit lamps (sum of place values), Largest place value that fits, Place-value questions (digit value, decomposition, reconstruction), Binary addition question, Single-column carry rules, Hexadecimal conversion questions (hex to decimal, decimal to hex, hex digit val…, Binary and hexadecimal in groups of four bits, Nibble matching question (four bits to hex digit), Typed answer is correct only after normalization, Number ranges per difficulty level, Round size and sequence (lesson, quick and boss rounds), Blitz question draw (choice questions only, easy level)

## Number helper records
Source: `apps/informatik/numbers.js:4-40 (WEIGHTS, placeDigits, placeSum, onesWeights, decToBinSteps)`

| Field | Type | Note |
|---|---|---|
| WEIGHTS | int[8] = [128,64,32,16,8,4,2,1] | numbers.js:4 |
| placeDigits(n) | string[4] | numbers.js:12; clamps 0..9999 |
| decToBinSteps(n) | {w: int, rest: int, fits: boolean}[] | numbers.js:28-40 |
| onesWeights(bin) | int[] | numbers.js:22-25 |

Used by: Stellenwert-Zerlegung einer Dezimalzahl, Binär nach Dezimal über Stellenwerte, Dezimal nach Binär über Schritte mit Stellenwerten, Binary decomposition bar diagram, Place-value table diagram

## Lamp board state
Source: `apps/informatik/theory.js:7-35 (clampInt, lampBoard, mountLamps); initial bits theory.js:64 and theory.js:122`

| Field | Type | Note |
|---|---|---|
| bits | 0/1 [8] (index 0 = weight 128) | theory.js:16; WEIGHTS numbers.js:4 |
| initial | [0,0,0,0,1,0,1,1] (binaer), [1,1,0,1,0,1,1,0] (binhex) | theory.js:64,122 |
| clampInt(value, max) | int in 0..max, NaN -> 0 | theory.js:7; applied with max 9999, 255, 127 |

Used by: Zustand der Lampen-Tafel, Begrenzung numerischer Eingaben im Spielzeug, Vierergruppen-Ansicht (Binär nach Hexadezimal in Vierergruppen)

## Checker function contract
Source: `core/js/qtypes.js:37-43 (defaultCheck); core/js/ui.js:21-24 (norm, stripAccents); core/js/mathkit.js:18-21 (numCheck), 38-44 (probCheck); apps/mathe/math.js:9-…`

| Field | Type | Note |
|---|---|---|
| signature | (input: string) => 'ok' / 'almost' / 'bad' | numeric and term checkers return only ok or bad |
| tolerance | 1e-9 for numbers and probabilities | mathkit.js:20,43 |
| normalisation | norm(): trim, lowercase, apostrophe and spaces; stripAccent… | ui.js:21,24 |

Used by: Antwortprüfung durch Vergleich nach Normalisierung, Numerische Antwort ist richtig bei exakter Übereinstimmung (Toleranz 1e-9), Eingabeprüfung: Zahl, Term oder Wahrscheinlichkeit, Bruch wird auf die kleinstmögliche Form gekürzt, Texteingabe wird vor dem Vergleich vereinheitlicht (Groß/Klein, Apostroph, Leer…, Tolerant comparison of a typed algebra term, Typed answer is correct only after normalization

## Registry entry (APPS)
Source: `registry.js:9-16 (SUBJECT_COLORS), registry.js:18-66 (APPS); read by dashboard.js:6-21, 38, 47-55`

| Field | Type | Note |
|---|---|---|
| id | string (must match content folder id) | registry.js:4 |
| subject | string (colour and filter key) | registry.js:9-16, dashboard.js:20 |
| title / desc | string | registry.js:22-23 |
| href | relative path? (absent for soon apps) | registry.js:24 |
| units | int (hand-maintained page count) | registry.js:25,34,43,53,62; matches manifests today |
| status | 'live' / 'soon' | registry.js:7; dashboard.js:13,47 |

Used by: Page counts per app are maintained by hand in the registry, Live versus soon status controls tile, link and storage access, Subject colour with fallback, Subject filter chips and empty state, Continue card shows only the last-used live app, Unit completion and per-app progress percentage, 'Noch nicht gestartet' label for untouched apps, Registry und Inhalt stimmen überein

## Template data item (vorlage)
Source: `content/vorlage/data.json items{start, weiter}; read by apps/_template/builders.js:14-27`

| Field | Type | Note |
|---|---|---|
| q | string | builders.js:16,20 |
| a | string | builders.js:16 |
| wrong | string[] (3 per item) | builders.js:15 slices to 3 |
| explain | string (mapped to QuizQuestion.why) | builders.js:16,20 |

Used by: Template offers lesson rounds, quick round and blitz only; no boss round, Sum diagram: the drawn result is computed, with + as addition and any other ope…, Übungsrunde einer Seite: 8 Fragen aus dem Aufgabenpool
