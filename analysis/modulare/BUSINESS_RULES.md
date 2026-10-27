# Business Rules — modulare

At extraction: 286 confirmed rules (0 P0); later steps may add or correct rules below. Each citation was checked by a second agent that read the cited lines; 2 candidate rules were refuted and left out.

| ID | Name | Category | Priority | Source | Confidence |
|---|---|---|---|---|---|
| RULE-001 | Sum diagram: the drawn result is computed, with + as addition and any other ope… | Calculation | P1 | `apps/_template/diagrams.js:4-12` | High |
| RULE-002 | Antwortauswahl bei Lückensätzen | Calculation | P1 | `apps/deutsch/builders.js:35-38` | High |
| RULE-003 | Antwortauswahl bei Aussagefragen (max. 4 Optionen) | Calculation | P1 | `apps/deutsch/builders.js:39-42` | High |
| RULE-004 | Übungsrunde einer Seite: 8 Fragen aus dem Aufgabenpool | Calculation | P1 | `apps/deutsch/builders.js:54-62` | High |
| RULE-005 | Schnellrunde und Blitz-Frage aus allen Seiten | Calculation | P1 | `apps/deutsch/builders.js:64-66` | High |
| RULE-006 | Scheitel-, Neben-, Stufen- und Wechselwinkel | Calculation | P1 | `apps/geometrie/builders.js:103-115` | High |
| RULE-007 | Missing triangle angle = 180° minus the two given angles | Calculation | P1 | `apps/geometrie/builders.js:117-121` | Medium |
| RULE-008 | Thaleskreis: rechter Winkel bei C und Restwinkel | Calculation | P1 | `apps/geometrie/builders.js:131-140` | Medium |
| RULE-009 | Thaleskreis: Radius ist halbe Hypotenuse | Calculation | P1 | `apps/geometrie/builders.js:142-146` | High |
| RULE-010 | Maßstab: Umrechnung zwischen Zeichnung und Wirklichkeit | Calculation | P1 | `apps/geometrie/builders.js:162-183` | Medium |
| RULE-011 | Höhe eines Baumes bei 45° Peilwinkel | Calculation | P1 | `apps/geometrie/builders.js:185-189` | Medium |
| RULE-012 | Außenwinkel im Dreieck | Calculation | P1 | `apps/geometrie/builders.js:204-208` | Medium |
| RULE-013 | Mittelsenkrechte: Gleichweit-Eigenschaft und Mittelpunkt der Strecke | Calculation | P1 | `apps/geometrie/builders.js:34-51` | High |
| RULE-014 | Winkelhalbierende: Teilwinkel ist die Hälfte | Calculation | P1 | `apps/geometrie/builders.js:56-66` | High |
| RULE-015 | Circumcentre of a triangle | Calculation | P1 | `apps/geometrie/geom.js:27-32` | High |
| RULE-016 | Incircle centre and inradius of a triangle | Calculation | P1 | `apps/geometrie/geom.js:34-39` | High |
| RULE-017 | Decimal to binary question | Calculation | P1 | `apps/informatik/builders.js:109-125` | High |
| RULE-018 | Largest place value that fits | Calculation | P1 | `apps/informatik/builders.js:127-136` | High |
| RULE-019 | Binary addition question | Calculation | P1 | `apps/informatik/builders.js:140-150` | High |
| RULE-020 | Single-column carry rules | Calculation | P1 | `apps/informatik/builders.js:152-159` | High |
| RULE-021 | Hexadecimal conversion questions (hex to decimal, decimal to hex, hex digit val… | Calculation | P1 | `apps/informatik/builders.js:163-202` | High |
| RULE-022 | Binary and hexadecimal in groups of four bits | Calculation | P1 | `apps/informatik/builders.js:206-233` | High |
| RULE-023 | Multiple-choice question has four options: the correct answer plus three distra… | Calculation | P1 | `apps/informatik/builders.js:22-25` | High |
| RULE-024 | Place-value questions (digit value, decomposition, reconstruction) | Calculation | P1 | `apps/informatik/builders.js:36-72` | High |
| RULE-025 | Binary to decimal question | Calculation | P1 | `apps/informatik/builders.js:76-93` | High |
| RULE-026 | Count the lit lamps (sum of place values) | Calculation | P1 | `apps/informatik/builders.js:95-105` | High |
| RULE-027 | Binary addition carry diagram | Calculation | P1 | `apps/informatik/diagrams.js:64-82` | High |
| RULE-028 | Stellenwert-Zerlegung einer Dezimalzahl | Calculation | P1 | `apps/informatik/numbers.js:11-19` | High |
| RULE-029 | Binär nach Dezimal über Stellenwerte | Calculation | P1 | `apps/informatik/numbers.js:21-25` | High |
| RULE-030 | Dezimal nach Binär über Schritte mit Stellenwerten | Calculation | P1 | `apps/informatik/numbers.js:27-40` | High |
| RULE-031 | Binär nach Hexadezimal in Vierergruppen | Calculation | P1 | `apps/informatik/numbers.js:59-62` | High |
| RULE-032 | Dezimal nach Hexadezimal über Division durch 16 | Calculation | P1 | `apps/informatik/theory.js:107-112` | High |
| RULE-033 | Prozentrechnung: Prozentwert, Grundwert, Prozentsatz | Calculation | P1 | `apps/mathe/builders.js:111-127` | High |
| RULE-034 | Rabatt: Preis nach Abzug | Calculation | P1 | `apps/mathe/builders.js:129-133` | High |
| RULE-035 | Zinsrechnung für ein Jahr: Zinsen, Kapital, Zinssatz | Calculation | P1 | `apps/mathe/builders.js:136-155` | Medium |
| RULE-036 | Zinseszins: Endkapital nach mehreren Jahren | Calculation | P1 | `apps/mathe/builders.js:163-169` | Medium |
| RULE-037 | Dreisatz: proportional und antiproportional | Calculation | P1 | `apps/mathe/builders.js:171-182` | Medium |
| RULE-038 | Mittelwert ist immer eine ganze Zahl | Calculation | P1 | `apps/mathe/builders.js:197-205` | High |
| RULE-039 | Statistik-Kennzahlen: Mittelwert, Median, Spannweite, Modus | Calculation | P1 | `apps/mathe/builders.js:197-226` | Medium |
| RULE-040 | Vorzeichenrechnung mit ganzen Zahlen | Calculation | P1 | `apps/mathe/builders.js:20-36` | High |
| RULE-041 | Median: mittlerer Wert der sortierten Liste | Calculation | P1 | `apps/mathe/builders.js:207-214` | High |
| RULE-042 | Spannweite | Calculation | P1 | `apps/mathe/builders.js:216-220` | High |
| RULE-043 | Modus: häufigster Wert ist eindeutig | Calculation | P1 | `apps/mathe/builders.js:222-227` | High |
| RULE-044 | Laplace-Wahrscheinlichkeit: Würfel und Urne | Calculation | P1 | `apps/mathe/builders.js:229-246` | High |
| RULE-045 | Relative Häufigkeit eines Münzwurfs | Calculation | P1 | `apps/mathe/builders.js:248-253` | High |
| RULE-046 | Ratenkredit: Zinsen und Rate im ersten Jahr | Calculation | P1 | `apps/mathe/builders.js:257-272` | High |
| RULE-047 | Tilgungsplan: Rate, Restschuld, Zins auf Restschuld, Laufzeit | Calculation | P1 | `apps/mathe/builders.js:257-290` | Medium |
| RULE-048 | Restschuld nach m Jahren | Calculation | P1 | `apps/mathe/builders.js:274-278` | High |
| RULE-049 | Zinsen im zweiten Jahr auf die Restschuld | Calculation | P1 | `apps/mathe/builders.js:280-284` | High |
| RULE-050 | Terme zusammenfassen und Klammern auflösen | Calculation | P1 | `apps/mathe/builders.js:38-61` | High |
| RULE-051 | Ausklammern des gemeinsamen Faktors | Calculation | P1 | `apps/mathe/builders.js:63-70` | High |
| RULE-052 | Lineare Gleichung nach x lösen | Calculation | P1 | `apps/mathe/builders.js:72-78` | Medium |
| RULE-053 | Anzahl der Lösungen einer linearen Gleichung | Calculation | P1 | `apps/mathe/builders.js:80-90` | High |
| RULE-054 | Kreditdiagramm: Restschuld und Zinsen Jahr für Jahr | Calculation | P1 | `apps/mathe/diagrams.js:122-135` | High |
| RULE-055 | Wertetabelle: konstanter Quotient oder konstantes Produkt | Calculation | P1 | `apps/mathe/diagrams.js:68-82` | High |
| RULE-056 | Datendiagramm: Median, Mittelwert, Spannweite | Calculation | P1 | `apps/mathe/diagrams.js:94-107` | Medium |
| RULE-057 | Trophaeen-Auswertung nach jeder Runde | Calculation | P1 | `core/js/appconfig.js:50` | High |
| RULE-058 | Blitz scoring: XP, combo and score | Calculation | P1 | `core/js/blitz.js:41-49` | High |
| RULE-059 | Ausweichzahlen für Multiple-Choice nahe der richtigen Zahl | Calculation | P1 | `core/js/mathkit.js:24-28` | Medium |
| RULE-060 | Bruch wird auf die kleinstmögliche Form gekürzt | Calculation | P1 | `core/js/mathkit.js:30-35` | High |
| RULE-061 | Level-Schwelle aus gesammelten XP | Calculation | P1 | `core/js/profile.js:28-34` | Medium |
| RULE-062 | XP-Gutschrift: Profil, App, Tagesziel und Level-Aufstieg | Calculation | P1 | `core/js/profile.js:53-65` | Medium |
| RULE-063 | Combo-Faktor bis ×4 | Calculation | P1 | `core/js/profile.js:73` | Medium |
| RULE-064 | Stars are awarded from the accuracy of a finished round | Calculation | P1 | `core/js/profile.js:76` | Medium |
| RULE-065 | Matching question grading | Calculation | P1 | `core/js/qtypes.js:168-181` | High |
| RULE-066 | Second attempt scoring | Calculation | P1 | `core/js/quiz.js:113-121` | High |
| RULE-067 | Genauigkeit zählt nur Erstversuche | Calculation | P1 | `core/js/quiz.js:113-121` | Medium |
| RULE-068 | Points per answer in a quiz round (combo multiplier) | Calculation | P1 | `core/js/quiz.js:122-128` | High |
| RULE-069 | Round accuracy (Trefferquote) | Calculation | P1 | `core/js/quiz.js:147-149` | Medium |
| RULE-070 | Hint (Spickzettel) costs 3 XP once per question | Calculation | P1 | `core/js/quiz.js:168-180` | High |
| RULE-071 | Boss round reward: 50 bonus XP and a trophy only when won | Calculation | P1 | `core/js/rounds.js:33-35` | Medium |
| RULE-072 | Level thresholds and XP progress bar | Calculation | P1 | `core/js/shell.js:52-54` | High |
| RULE-073 | Practice streak with one grace day | Calculation | P1 | `core/js/shell.js:57-57` | High |
| RULE-074 | Daily XP goal of 30 XP | Calculation | P1 | `core/js/views/home.js:23-23` | High |
| RULE-075 | Unit completion and per-app progress percentage | Calculation | P1 | `dashboard.js:19` | Medium |
| RULE-076 | Daily goal ring and status message | Calculation | P1 | `dashboard.js:24-30` | High |
| RULE-077 | Auswahlantworten: richtige Form plus falsche Formen desselben Verbs | Calculation | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:21-26` | High |
| RULE-078 | Konjugation: Stamm plus Endung je Verbgruppe | Calculation | P1 | `legacy/modulare/apps/franzoesisch-verben/model.js:31-35` | Medium |
| RULE-079 | Base angle of an isosceles triangle = (180° − apex angle) ÷ 2 | Calculation | P1 | `legacy/modulare/apps/geometrie/builders.js:123-126` | Medium |
| RULE-080 | Apex angle of an isosceles triangle = 180° − 2 × base angle (two problem types) | Calculation | P1 | `legacy/modulare/apps/geometrie/builders.js:193-197` | Medium |
| RULE-081 | Circumcenter and incircle are equidistant; point on a circle uses screen coordi… | Calculation | P1 | `legacy/modulare/apps/geometrie/geom.js:7` | Medium |
| RULE-082 | Binär-Addition und Hex-zu-Dezimal-Aufgaben haben die richtige Lösung | Calculation | P1 | `legacy/modulare/apps/informatik/builders.js:140-150` | Medium |
| RULE-083 | Binär- und Hex-Umrechnung, Stellenwerte, Schrittfolge bis 255 | Calculation | P1 | `legacy/modulare/apps/informatik/numbers.js:3-39` | Medium |
| RULE-084 | Vorzeichenrechnung und lineare Gleichungen haben korrekte Lösungen | Calculation | P1 | `tests/mathe.test.js:56-71` | Medium |
| RULE-085 | Zinsrechnung: Jahreszins, Monatszins | Calculation | P1 | `tests/mathe.test.js:77-84` | High |
| RULE-086 | Flussdiagramm: gleiche Kastenbreite, erster Schritt hervorgehoben | Calculation | P2 | `apps/deutsch/diagrams.js:12-21` | High |
| RULE-087 | Tabellendiagramm: Spaltenbreite nach Gewicht | Calculation | P2 | `apps/deutsch/diagrams.js:24-32` | High |
| RULE-088 | Right-isosceles problem answer is always 45° | Calculation | P2 | `apps/geometrie/builders.js:199-202` | Medium |
| RULE-089 | SSS-Dreieck-Bild: Ecke C aus den drei Seiten berechnet | Calculation | P2 | `apps/geometrie/diagrams.js:37-45` | High |
| RULE-090 | Winkelbeschriftung in den Bildern: Scheitel-/Nebenwinkel, Winkelhalbierende, Th… | Calculation | P2 | `apps/geometrie/diagrams.js:49-59` | High |
| RULE-091 | Mittelsenkrechte-Bild: Bögen mit Radius größer als halbe Strecke | Calculation | P2 | `apps/geometrie/diagrams.js:6-15` | High |
| RULE-092 | Umkreis- und Inkreis-Bild: Mittelpunkte der Dreieckskonstruktion | Calculation | P2 | `apps/geometrie/diagrams.js:75-88` | High |
| RULE-093 | Arc drawing: large-arc flag and fixed sweep direction | Calculation | P2 | `apps/geometrie/geom.js:11-14` | High |
| RULE-094 | Right-angle marker square completion | Calculation | P2 | `apps/geometrie/geom.js:22-25` | High |
| RULE-095 | Angle to drawing point conversion | Calculation | P2 | `apps/geometrie/geom.js:7` | High |
| RULE-096 | Nibble matching question (four bits to hex digit) | Calculation | P2 | `apps/informatik/builders.js:235-243` | Medium |
| RULE-097 | Binary decomposition bar diagram | Calculation | P2 | `apps/informatik/diagrams.js:45-61` | High |
| RULE-098 | Place-value table diagram | Calculation | P2 | `apps/informatik/diagrams.js:6-26` | High |
| RULE-099 | Hex place-value and nibble diagrams | Calculation | P2 | `apps/informatik/diagrams.js:85-95` | High |
| RULE-100 | Zuordnung erkennen: proportional, antiproportional, weder noch, beides | Calculation | P2 | `apps/mathe/builders.js:185-190` | High |
| RULE-101 | Laufzeit eines Ratenkredits | Calculation | P2 | `apps/mathe/builders.js:286-289` | High |
| RULE-102 | Gleichung aus einem Text aufstellen | Calculation | P2 | `apps/mathe/builders.js:92-98` | High |
| RULE-103 | Waage: Lösungsweg mit zwei Schritten | Calculation | P2 | `apps/mathe/diagrams.js:40-53` | High |
| RULE-104 | Begleitdiagramme rechnen dieselben Formeln wie die Aufgaben | Calculation | P2 | `apps/mathe/diagrams.js:56-66` | High |
| RULE-105 | Canonical written form of a linear term | Calculation | P2 | `apps/mathe/math.js:12-18` | High |
| RULE-106 | Zufällige ganze Zahl im Bereich, Grenzen eingeschlossen | Calculation | P2 | `core/js/mathkit.js:5-5` | High |
| RULE-107 | Blitz praise threshold at 10 correct answers | Calculation | P2 | `core/js/views/result.js:13-15` | High |
| RULE-108 | Total trophy count on the home screen | Calculation | P2 | `dashboard.js:21` | High |
| RULE-109 | Subjektdarstellung: j' vor Vokal und h, Pronomenvariante in der dritten Person | Calculation | P2 | `legacy/modulare/apps/franzoesisch-verben/builders.js:5-7` | Medium |
| RULE-110 | Endungsaufgabe: Auswahl der falschen Endungen | Calculation | P2 | `legacy/modulare/apps/franzoesisch-verben/builders.js:66-71` | High |
| RULE-111 | Gap answers are graded tolerantly: case and surrounding spaces ignored, a wrong… | Validation | P1 | `/Users/dghaies/Sites/lernapp-sira/legacy/modulare/apps/deutsch/builders.js:33-50` | Medium |
| RULE-112 | Wahrscheinlichkeitsantwort: Bruch, Dezimalzahl oder Prozent | Validation | P1 | `/Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/mathkit.js:37-44` | Medium |
| RULE-113 | Prüfung einer Eingabe-Antwort (Wort eintippen) | Validation | P1 | `apps/deutsch/builders.js:45-51` | Medium |
| RULE-114 | Lage des Umkreismittelpunkts nach Dreiecksart | Validation | P1 | `apps/geometrie/builders.js:152-158` | High |
| RULE-115 | Distraktor-Generator: mindestens drei verschiedene falsche Antworten | Validation | P1 | `apps/geometrie/builders.js:229-235` | Medium |
| RULE-116 | Dreiecksungleichung: Existenz eines Dreiecks aus drei Seiten | Validation | P1 | `apps/geometrie/builders.js:71-84` | High |
| RULE-117 | Kongruenzsatz- und Eindeutigkeits-Zuordnungen aus Datentabellen | Validation | P1 | `apps/geometrie/builders.js:87-98` | Medium |
| RULE-118 | Typed answer is correct only after normalization | Validation | P1 | `apps/informatik/builders.js:27-29` | Medium |
| RULE-119 | Antwortprüfung durch Vergleich nach Normalisierung | Validation | P1 | `apps/informatik/numbers.js:66-74` | Medium |
| RULE-120 | Auswahl der falschen Antworten bei Multiple Choice | Validation | P1 | `apps/informatik/numbers.js:76-93` | High |
| RULE-121 | Eingabeprüfung: Zahl, Term oder Wahrscheinlichkeit | Validation | P1 | `apps/mathe/builders.js:314-318` | High |
| RULE-122 | Nur Auswahlaufgaben werden nicht eingetippt | Validation | P1 | `apps/mathe/builders.js:330-330` | High |
| RULE-123 | Tolerant comparison of a typed algebra term | Validation | P1 | `apps/mathe/math.js:8-10` | High |
| RULE-124 | Abbildung einer Lektion aufloesen | Validation | P1 | `core/js/appconfig.js:16-21` | Medium |
| RULE-125 | HTTP-Quelle holt und prüft das Paket | Validation | P1 | `core/js/content.js:34-41` | Medium |
| RULE-126 | Restore only from a valid Lernwerkstatt file, then reload | Validation | P1 | `core/js/db.js:126-127` | Medium |
| RULE-127 | HTML escaping: which lesson fields are trusted HTML | Validation | P1 | `core/js/lesson.js:42` | High |
| RULE-128 | Numerische Antwort ist richtig bei exakter Übereinstimmung (Toleranz 1e-9) | Validation | P1 | `core/js/mathkit.js:18-21` | Medium |
| RULE-129 | Question content validation (authoring guard) | Validation | P1 | `core/js/qtypes.js:76-82` | High |
| RULE-130 | Choice question: check gate and grading | Validation | P1 | `core/js/qtypes.js:93-94` | High |
| RULE-131 | Perfect-round and combo trophies | Validation | P1 | `core/js/rules.js:20-21` | Medium |
| RULE-132 | Trophäen-Aufbau prüfen (Tippfehler finden) | Validation | P1 | `core/js/rules.js:39-52` | Medium |
| RULE-133 | Reset of one app's progress requires two confirmations | Validation | P1 | `core/js/shell.js:137-144` | Medium |
| RULE-134 | Boss unlock: every unit needs at least one star | Validation | P1 | `core/js/shell.js:43-43` | High |
| RULE-135 | Unreadable or non-object stored document falls back to defaults | Validation | P1 | `core/js/store.js:25-36` | Medium |
| RULE-136 | Missing lesson has no fallback | Validation | P1 | `core/js/theory.js:8` | Medium |
| RULE-137 | Texteingabe wird vor dem Vergleich vereinheitlicht (Groß/Klein, Apostroph, Leer… | Validation | P1 | `core/js/ui.js:20-24` | Medium |
| RULE-138 | Kopfdaten der App pruefen (id, Titel, Gruss, Einleitung) | Validation | P1 | `core/js/validate.js:17-18` | High |
| RULE-139 | Seiten des Lernpfads: Anzahl, Eindeutigkeit, Pflichtfelder | Validation | P1 | `core/js/validate.js:19-22` | High |
| RULE-140 | Lernstraenge und ihre Verweise | Validation | P1 | `core/js/validate.js:23-25` | High |
| RULE-141 | Lernmaterial: Titel, Strang und sicherer Pfad | Validation | P1 | `core/js/validate.js:26-30` | High |
| RULE-142 | Trophaeen: Pflichtfelder, eindeutige Kennungen, gueltige Regel | Validation | P1 | `core/js/validate.js:38-42` | High |
| RULE-143 | Inhaltspaket als Ganzes pruefen (Tor vor dem Start) | Validation | P1 | `core/js/validate.js:47-51` | Medium |
| RULE-144 | Materiallinks nur als sichere relative Pfade | Validation | P1 | `core/js/validate.js:8` | Medium |
| RULE-145 | Player name is required to be hidden once set, and is always shown escaped | Validation | P1 | `core/js/views/home.js:26-27` | Medium |
| RULE-146 | Every verb form has a hint and distractors that exclude the correct form | Validation | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:10-26` | Medium |
| RULE-147 | Typed verb answers: pronoun prefix and case ignored, missing accent is 'almost'… | Validation | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:34-41` | Medium |
| RULE-148 | Konjugationsaufgabe mit Platzhalter-Hinweis | Validation | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:61-64` | High |
| RULE-149 | Personenauswahl für Endungs- und Konjugationsaufgaben | Validation | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:77-81` | High |
| RULE-150 | Eintipp-Prüfung für numerische Antworten | Validation | P1 | `legacy/modulare/core/js/mathkit.js:12-20` | Medium |
| RULE-151 | Typed answer is graded exact, 'almost' if only accents differ, otherwise wrong | Validation | P1 | `legacy/modulare/core/js/qtypes.js:37-43` | Medium |
| RULE-152 | Paketprüfung je Inhaltsordner | Validation | P1 | `tests/content.test.js:16-36` | High |
| RULE-153 | Schema lehnt unvollständige oder falsche Pakete ab | Validation | P1 | `tests/content.test.js:38-46` | High |
| RULE-154 | Lektion und Sammelkarte haben alle Pflichtteile | Validation | P1 | `tests/contract.test.js:22-30` | High |
| RULE-155 | Registry und Inhalt stimmen überein | Validation | P1 | `tests/contract.test.js:9-12` | High |
| RULE-156 | Each unit has at least 10 unique questions and each question is internally cons… | Validation | P1 | `tests/deutsch.test.js:12-20` | High |
| RULE-157 | Gap items have exactly one blank and at least one distractor; all other items h… | Validation | P1 | `tests/deutsch.test.js:21-26` | High |
| RULE-158 | Verb conjugation tables give the six correct forms in person order | Validation | P1 | `tests/french.test.js:32-38` | Medium |
| RULE-159 | Each example sentence has one blank, a valid person, a known verb and a German… | Validation | P1 | `tests/french.test.js:40-51` | High |
| RULE-160 | Generated geometry tasks have a correct answer outside the wrong options and nu… | Validation | P1 | `tests/geometrie.test.js:33-42` | Medium |
| RULE-161 | Every app configuration has a valid id, unique unit and badge ids, complete fie… | Validation | P1 | `tests/helpers.js:10-22` | Medium |
| RULE-162 | Practice rounds have at least 3 questions and the blitz question is multiple ch… | Validation | P1 | `tests/helpers.js:24-37` | High |
| RULE-163 | A lesson must contain all required parts, and its mini-check must be well formed | Validation | P1 | `tests/helpers.js:41-56` | High |
| RULE-164 | Eingabeprüfung für Zahlen, Terme, Binär, Hex und Dezimal | Validation | P1 | `tests/mathe.test.js:16-29` | High |
| RULE-165 | Jede Aufgabe akzeptiert ihre eigene richtige Antwort | Validation | P1 | `tests/mathe.test.js:46-54` | Medium |
| RULE-166 | Single-choice answer is correct only when the picked option matches the stored… | Validation | P1 | `tests/qtypes.test.js:19-25` | Medium |
| RULE-167 | Matching question is valid only when left items, right items and left values li… | Validation | P1 | `tests/qtypes.test.js:27-33` | High |
| RULE-168 | App ids are unique and every subject has a colour | Validation | P1 | `tests/registry.test.js:6-9` | High |
| RULE-169 | Progress trophies for the French app: four pages and the regular-verbs pair | Validation | P1 | `tests/rounds.test.js:41-46` | High |
| RULE-170 | Trophy ids are unique | Validation | P1 | `tests/rounds.test.js:80-82` | High |
| RULE-171 | Begrenzung numerischer Eingaben im Spielzeug | Validation | P2 | `apps/informatik/theory.js:7` | High |
| RULE-172 | XP-Ausgabe nie unter null | Validation | P2 | `core/js/profile.js:68-71` | Medium |
| RULE-173 | Streak trophy after three days in a row | Validation | P2 | `core/js/rounds.js:41-46` | Medium |
| RULE-174 | Player name required, trimmed, max 20 characters, asked once | Validation | P2 | `core/js/shell.js:119-125` | High |
| RULE-175 | Diagram accessibility wrapper | Validation | P2 | `core/js/svg.js:8-9` | High |
| RULE-176 | Continue card shows only the last-used live app | Validation | P2 | `dashboard.js:37-43` | High |
| RULE-177 | Strang-Verweise müssen bekannt sein | Validation | P2 | `tests/content.test.js:56-61` | High |
| RULE-178 | Algebra-Erzeuger: Ausklammern, Aufstellen mit ganzzahliger Lösung, Lösungsanzahl | Validation | P2 | `tests/mathe.test.js:134-144` | High |
| RULE-179 | Statische Dateien vollständig: CSS-Importe, Schriftdateien, Lizenz | Validation | P2 | `tests/pages.test.js:23-29` | High |
| RULE-180 | Every question must have a label | Validation | P2 | `tests/qtypes.test.js:50-52` | High |
| RULE-181 | Live apps must be complete and every app has status live or soon | Validation | P2 | `tests/registry.test.js:11-20` | High |
| RULE-182 | Reihenfolge beim Aufbau: pruefen, dann Logik vorbereiten, dann Lektionen | Lifecycle | P1 | `core/js/appconfig.js:24-27` | High |
| RULE-183 | Blitz round: 45-second timer and end | Lifecycle | P1 | `core/js/blitz.js:76-82` | High |
| RULE-184 | Fehlerzustand statt halbem Start | Lifecycle | P1 | `core/js/boot.js:17-25` | High |
| RULE-185 | Offline-Zwischenspeicher fuer API-Inhalte | Lifecycle | P1 | `core/js/content.js:50-66` | Medium |
| RULE-186 | Storage backend selection with fallback | Lifecycle | P1 | `core/js/db.js:100-112` | Low |
| RULE-187 | Altstand aus localStorage wird in IndexedDB übernommen | Lifecycle | P1 | `core/js/db.js:54-60` | Medium |
| RULE-188 | Auffrischen: Seite ist fällig nach drei Tagen | Lifecycle | P1 | `core/js/profile.js:12` | Medium |
| RULE-189 | A failed lesson round gives no star progress and no perfect trophy | Lifecycle | P1 | `core/js/profile.js:76` | Medium |
| RULE-190 | Matching question starts with zero pairs solved and is graded by the number of… | Lifecycle | P1 | `core/js/qtypes.js:152-183` | Medium |
| RULE-191 | Round end: completed or failed | Lifecycle | P1 | `core/js/quiz.js:158-166` | High |
| RULE-192 | Hearts: starting amount and loss | Lifecycle | P1 | `core/js/quiz.js:66` | High |
| RULE-193 | XP is kept when a round is left early | Lifecycle | P1 | `core/js/quiz.js:83-87` | Medium |
| RULE-194 | Abschluss einer Lektionsrunde: Tag, Genauigkeit und Auffrischen-Bonus | Lifecycle | P1 | `core/js/rounds.js:16-28` | Medium |
| RULE-195 | Finishing a round evaluates, saves, logs and shows the result | Lifecycle | P1 | `core/js/shell.js:101-107` | Medium |
| RULE-196 | Screen navigation state machine (home, theory, play, result) | Lifecycle | P1 | `core/js/shell.js:127-145` | High |
| RULE-197 | Saved progress is restored after reload; reset returns state to defaults | Lifecycle | P1 | `core/js/store.js:24-56` | Medium |
| RULE-198 | Stored document schema version and migration hook | Lifecycle | P1 | `core/js/store.js:37-45` | High |
| RULE-199 | Document save is best-effort; reset restores defaults | Lifecycle | P1 | `core/js/store.js:50-56` | High |
| RULE-200 | Unit becomes due for refresh after 3 days | Lifecycle | P1 | `core/js/views/home.js:24-24` | High |
| RULE-201 | Live versus soon status controls tile, link and storage access | Lifecycle | P1 | `dashboard.js:47-49` | High |
| RULE-202 | Home screen loads all data first, then draws once | Lifecycle | P1 | `dashboard.js:9-16` | Medium |
| RULE-203 | Modell-Initialisierung aus dem Inhaltspaket | Lifecycle | P1 | `legacy/modulare/apps/franzoesisch-verben/model.js:25-38` | High |
| RULE-204 | Blitz: best score only goes up and the blitz trophy starts at 10 correct | Lifecycle | P1 | `legacy/modulare/core/js/rounds.js:30-31` | Medium |
| RULE-205 | Zurücksetzen leert Fortschritt | Lifecycle | P1 | `legacy/modulare/core/js/shell.js:137-144` | Medium |
| RULE-206 | Endgegner wird freigeschaltet, wenn alle Seiten einen Stern haben | Lifecycle | P1 | `legacy/modulare/core/js/shell.js:43` | Medium |
| RULE-207 | Stored data keeps unknown fields, gains new default fields, and migrates on ver… | Lifecycle | P1 | `legacy/modulare/core/js/store.js:10-16` | Medium |
| RULE-208 | Serie: Folgetag, Gnadentag, Neustart und Verfall | Lifecycle | P1 | `tests/profile.test.js:32-45` | Medium |
| RULE-209 | A unit's best star rating is kept and never lowered | Lifecycle | P1 | `tests/rounds.test.js:29-32` | High |
| RULE-210 | Each trophy is awarded once, the first time its condition holds | Lifecycle | P1 | `tests/rounds.test.js:74-78` | High |
| RULE-211 | Initialisation: round content is bound once, before the first round | Lifecycle | P2 | `apps/_template/builders.js:5-12` | Medium |
| RULE-212 | Zustand der Lampen-Tafel | Lifecycle | P2 | `apps/informatik/theory.js:22-33` | High |
| RULE-213 | Zufällige Animations-Konfetti: Lebensdauer und Entfernung | Lifecycle | P2 | `core/js/confetti.js:4-15` | High |
| RULE-214 | Database schema: two collections | Lifecycle | P2 | `core/js/db.js:17-24` | High |
| RULE-215 | Worked-steps reveal one step at a time | Lifecycle | P2 | `core/js/lesson.js:36-39` | High |
| RULE-216 | Mini-check locks after the first answer | Lifecycle | P2 | `core/js/lesson.js:59-69` | High |
| RULE-217 | Minou-Stimmung wählt das Gesicht, unbekannte Stimmung wird zu „fröhlich“ | Lifecycle | P2 | `core/js/mascot.js:18-19` | Medium |
| RULE-218 | Tagesziel wird einmal pro Tag gemeldet | Lifecycle | P2 | `core/js/profile.js:63` | Medium |
| RULE-219 | Trophy earned state and newly earned trophies | Lifecycle | P2 | `core/js/views/home.js:25-25` | High |
| RULE-220 | Collection album card tier from stars | Lifecycle | P2 | `core/js/views/home.js:33-41` | Medium |
| RULE-221 | 'Noch nicht gestartet' label for untouched apps | Lifecycle | P2 | `dashboard.js:51` | High |
| RULE-222 | Theorie-Seite: Tabelle, Selbsttest und Verbwechsel | Lifecycle | P2 | `legacy/modulare/apps/franzoesisch-verben/theory.js:42-46` | Medium |
| RULE-223 | Multiple-choice options: correct answer plus up to three distractors, shuffled | Policy | P1 | `apps/_template/builders.js:14-17` | Medium |
| RULE-224 | Typed-answer question: the stored answer is the only expected answer, no option… | Policy | P1 | `apps/_template/builders.js:19-21` | Medium |
| RULE-225 | Lesson round composition: 8 questions, every third one typed | Policy | P1 | `apps/_template/builders.js:23-27` | High |
| RULE-226 | Random question pick across all pages for the quick round and the blitz | Policy | P1 | `apps/_template/builders.js:29-32` | Medium |
| RULE-227 | Eingabefragen-Plätze in der Übungsrunde | Policy | P1 | `apps/deutsch/builders.js:59-61` | High |
| RULE-228 | Endgegner-Runde: 12 Fragen, Seiten im festen Wechsel | Policy | P1 | `apps/deutsch/builders.js:67-70` | High |
| RULE-229 | Round sizes: lesson round 8 questions, boss 12, quick 5, blitz always multiple… | Policy | P1 | `apps/franzoesisch-verben/builders.js:104-132` | Medium |
| RULE-230 | Antwortauswahl: richtige Antwort plus drei falsche, Reihenfolge gemischt | Policy | P1 | `apps/geometrie/builders.js:239-244` | High |
| RULE-231 | Number ranges per difficulty level | Policy | P1 | `apps/informatik/builders.js:16` | Medium |
| RULE-232 | Question pool for each lesson page | Policy | P1 | `apps/informatik/builders.js:247-254` | High |
| RULE-233 | Round size and sequence (lesson, quick and boss rounds) | Policy | P1 | `apps/informatik/builders.js:256-274` | High |
| RULE-234 | Blitz question draw (choice questions only, easy level) | Policy | P1 | `apps/informatik/builders.js:277-284` | High |
| RULE-235 | Reihenfolge der Umformung: Summand vor Faktor | Policy | P1 | `apps/mathe/builders.js:100-106` | High |
| RULE-236 | Inhaltsquelle: HTTP-API oder lokale Dateien | Policy | P1 | `core/js/boot.js:10-14` | High |
| RULE-237 | Statische Inhaltsdateien: Pflicht und Optional | Policy | P1 | `core/js/content.js:12-28` | High |
| RULE-238 | Backup export contents | Policy | P1 | `core/js/db.js:120-123` | High |
| RULE-239 | Event logging timestamp and error tolerance | Policy | P1 | `core/js/db.js:136-142` | High |
| RULE-240 | Event log retention and default read window | Policy | P1 | `core/js/db.js:91-93` | High |
| RULE-241 | Lesson section order is fixed | Policy | P1 | `core/js/lesson.js:25-45` | High |
| RULE-242 | Training recommendation: due first, then weakest unit | Policy | P1 | `core/js/profile.js:88-95` | Medium |
| RULE-243 | Second attempt: re-ask a wrong question at the end of the round | Policy | P1 | `core/js/quiz.js:129-131` | Medium |
| RULE-244 | Trophäe Endgegner besiegt | Policy | P1 | `core/js/rules.js:23` | Medium |
| RULE-245 | Trophäe Serie (Tage in Folge) | Policy | P1 | `core/js/rules.js:24` | Medium |
| RULE-246 | Trophäen-Kombination UND / ODER | Policy | P1 | `core/js/rules.js:25-26` | Medium |
| RULE-247 | Profil und App-Stand werden nach einer Runde gespeichert, Runde wird protokolli… | Policy | P1 | `core/js/shell.js:101-106` | Medium |
| RULE-248 | Boss win grants 50 bonus XP | Policy | P1 | `core/js/views/result.js:21-21` | High |
| RULE-249 | Refreshing a due unit grants 10 bonus XP | Policy | P1 | `core/js/views/result.js:22-22` | High |
| RULE-250 | Erklärung bei falscher Antwort | Policy | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:10-18` | High |
| RULE-251 | Lektionsrunde: acht Aufgaben nach Verbtyp | Policy | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:104-112` | High |
| RULE-252 | Boss- und Schnellrunde | Policy | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:106-123` | High |
| RULE-253 | Blitz-Frage: Endung oder Satz | Policy | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:125-133` | High |
| RULE-254 | Keine Wiederholung von Beispielsätzen innerhalb einer Runde | Policy | P1 | `legacy/modulare/apps/franzoesisch-verben/builders.js:83-92` | High |
| RULE-255 | App-Kennung für den gespeicherten Fortschritt | Policy | P1 | `legacy/modulare/apps/franzoesisch-verben/main.js:4` | Medium |
| RULE-256 | Backup export contains all saved data and events; import restores it and reject… | Policy | P1 | `legacy/modulare/core/js/db.js:117-142` | Medium |
| RULE-257 | Trophäen-Schwelle Combo und Blitz-Punkte | Policy | P1 | `legacy/modulare/core/js/rules.js:21-22` | Medium |
| RULE-258 | Learning-track label appears on LRS pages only | Policy | P1 | `legacy/modulare/core/js/views/home.js:24` | Medium |
| RULE-259 | Page counts per app are maintained by hand in the registry | Policy | P1 | `registry.js:18-66` | Medium |
| RULE-260 | Sterne-Trophäen: Seite gilt als begonnen ab einem Stern | Policy | P1 | `tests/core-content.test.js:14-21` | High |
| RULE-261 | Trophäe Perfekte Runde | Policy | P1 | `tests/core-content.test.js:24-27` | Medium |
| RULE-262 | Live-Seiten: gemeinsamer Kern-CSS, Sprache, Viewport, keine Google-Schriften | Policy | P1 | `tests/pages.test.js:10-21` | High |
| RULE-263 | Resetting progress needs a second confirmation | Policy | P1 | `tests/views.test.js:26-29` | High |
| RULE-264 | Template offers lesson rounds, quick round and blitz only; no boss round | Policy | P2 | `apps/_template/logic.js:6` | High |
| RULE-265 | Strang-Etikett an Fragen (chip) | Policy | P2 | `apps/deutsch/builders.js:30-31` | High |
| RULE-266 | Vorher-Nachher-Diagramm: Pfeile zeigen das Umformen | Policy | P2 | `apps/deutsch/diagrams.js:36-46` | Medium |
| RULE-267 | Aufgabenmix pro Seite: Gewichtung der Erzeuger | Policy | P2 | `apps/geometrie/builders.js:216-227` | High |
| RULE-268 | Rundenaufbau: Lektion, Schnellrunde, Blitz und Endgegner | Policy | P2 | `apps/geometrie/builders.js:253-266` | High |
| RULE-269 | Drawn coordinates and radii rounded to one decimal place | Policy | P2 | `apps/geometrie/geom.js:5` | High |
| RULE-270 | Vorgaben fuer fehlende optionale Teile | Policy | P2 | `core/js/appconfig.js:28-42` | High |
| RULE-271 | Zahlen werden für die Anzeige auf drei Nachkommastellen mit Dezimalkomma geschr… | Policy | P2 | `core/js/mathkit.js:9-11` | High |
| RULE-272 | Answer option order is randomised | Policy | P2 | `core/js/questions.js:17-19` | High |
| RULE-273 | Default theory page composition | Policy | P2 | `core/js/theory.js:7-18` | High |
| RULE-274 | Result headline, text and celebration by outcome | Policy | P2 | `core/js/views/result.js:19-22` | High |
| RULE-275 | Subject colour with fallback | Policy | P2 | `dashboard.js:20` | High |
| RULE-276 | Subject filter chips and empty state | Policy | P2 | `dashboard.js:55-70` | High |
| RULE-277 | Zuordnungsaufgabe: Pronomen zu Formen | Policy | P2 | `legacy/modulare/apps/franzoesisch-verben/builders.js:73-75` | High |
| RULE-278 | Diagramme: Personen und graue stumme Endungen | Policy | P2 | `legacy/modulare/apps/franzoesisch-verben/diagrams.js:9-45` | High |
| RULE-279 | Vorlesen der französischen Sätze | Policy | P2 | `legacy/modulare/apps/franzoesisch-verben/theory.js:8-24` | High |
| RULE-280 | LRS-Förderung track marks six units, all printed material, and the questions of… | Policy | P2 | `legacy/modulare/content/deutsch/manifest.json:8-13` | Medium |
| RULE-281 | Result title depends on stars, failure and blitz score | Policy | P2 | `legacy/modulare/core/js/views/result.js:13-19` | Medium |
| RULE-282 | Each Deutsch lesson round has 8 valid questions and the boss round is valid | Policy | P2 | `tests/deutsch.test.js:46-51` | High |
| RULE-283 | New question kinds can be added without changing the core | Policy | P2 | `tests/qtypes.test.js:35-48` | High |
| RULE-284 | Question kinds are a registry: three standard kinds exist and unknown kinds are… | Policy | P2 | `tests/qtypes.test.js:7-10` | High |
| RULE-285 | Celebration is shown for three stars, for boss wins, or for a 10+ blitz score | Policy | P2 | `tests/views.test.js:31-43` | High |
| RULE-286 | Printable resources are shown only when present, open in a new tab and are esca… | Policy | P2 | `tests/views.test.js:45-52` | High |

## Calculation

### RULE-001: Sum diagram: the drawn result is computed, with + as addition and any other operator as multiplication
**Category:** Calculation
**Priority:** P1
**Source:** `apps/_template/diagrams.js:4-12`
**Plain English:** The diagram for a two-number calculation shows the operands, the operator and the result. The result is computed by the code, so it cannot differ from the operands.
**Specification:**
  Given sumDiagram(2, 3, '+') and sumDiagram(2, 3, '*')
  When  The diagram is drawn
  Then  With '+': result = 2 + 3 = 5, drawn as "2 + 3 = 5". With '*': result = 6. The SVG aria-label is "Rechnung 2 + 3" (or "Rechnung 2 * 3").
**Parameters:** Operator '+' selects addition. Every other value selects multiplication (line 5). Fixed layout: boxes at x = 40 and 240, result box at x = 430, canvas 520 × 120.
**Edge cases handled:** Any operator other than '+' (for example '-' or '/') is computed as multiplication, but the operator text is drawn as given. sumDiagram(5, 2, '-') draws "5 - 2 = 10".; With string arguments and '+', JavaScript concatenates: ('2', '3', '+') gives "23". With other operators the strings are coerced to numbers.; The operands and result are printed with String(...) inside the SVG text helper. Escaping depends on svg.js, which was not read.
**Suspected defect:** diagrams.js:5 treats every operator except '+' as multiplication, including '-'. The drawn operator and the computed result then disagree. The template does not restrict operators.
**Confidence:** High

### RULE-002: Antwortauswahl bei Lückensätzen
**Category:** Calculation
**Priority:** P1
**Source:** `apps/deutsch/builders.js:35-38`
**Plain English:** For a gap sentence, the learner sees the correct word together with all listed wrong words, in random order.
**Specification:**
  Given A gap item with correct answer a and wrong-answer list W
  When  A multiple-choice question is built for it
  Then  Options are shuffled([a, ...W]); there is no cap on the number of options. The answer key is a, and the reveal shows a highlighted in the gap. The prompt is the sentence with ___ turned into a blank.
**Parameters:** Label default 'Lücke füllen' unless item.label is set (builders.js:34).
**Edge cases handled:** With 3 wrong words there are 4 options; with more, there are more options (no cap).; With an empty wrong list, the only option is the correct one.; Item.label overrides the default label; the typed variant ignores it (see the typed-question rule).
**Confidence:** High

### RULE-003: Antwortauswahl bei Aussagefragen (max. 4 Optionen)
**Category:** Calculation
**Priority:** P1
**Source:** `apps/deutsch/builders.js:39-42`
**Plain English:** For a normal question, the learner sees the correct answer plus at most three randomly chosen wrong answers.
**Specification:**
  Given A non-gap item with correct answer a and wrong-answer list W
  When  A multiple-choice question is built for it
  Then  Choices are [a, ...three random items from shuffle(W)]. The choice set is shuffled again when the question object is created (questions.js:18). The answer key is a.
**Parameters:** Maximum 3 distractors (builders.js:41: slice(0,3)). Answers longer than 40 characters use list layout (builders.js:41).
**Edge cases handled:** With fewer than 3 wrong answers, fewer than 4 options are shown.; Not every wrong answer can appear in a given round; the subset is random.; Label default 'Wähle die richtige Antwort' unless item.label is set (builders.js:34).
**Confidence:** High

### RULE-004: Übungsrunde einer Seite: 8 Fragen aus dem Aufgabenpool
**Category:** Calculation
**Priority:** P1
**Source:** `apps/deutsch/builders.js:54-62`
**Plain English:** A lesson round for one unit asks 8 questions drawn from that unit's pool of items, in random order.
**Specification:**
  Given A unit with an item pool (data.items[unit.id]) that holds N items
  When  A lesson round is built for that unit
  Then  The pool is shuffled and the first 8 items are taken. If the pool has fewer than 8 items, the list cycles (item i uses pool[i mod N]), so the same item appears more than once in the round.
**Parameters:** Round size 8 (builders.js:59-61). Cycling index is i mod pool length (builders.js:56).
**Edge cases handled:** Pool with 8 or more items: no repeats in the round.; Pool with fewer than 8 items: items repeat within one round, and a repeated item can appear next to its first occurrence.; Unit with no pool entry: ITEMS[unitId] is undefined, so shuffle() throws. No guard.; Empty pool: pool[i % 0] is undefined, so the question builder fails. No guard.
**Confidence:** High

### RULE-005: Schnellrunde und Blitz-Frage aus allen Seiten
**Category:** Calculation
**Priority:** P1
**Source:** `apps/deutsch/builders.js:64-66`
**Plain English:** The quick round (5 questions) and the 45-second blitz question draw randomly from all units, and only multiple-choice questions are used.
**Specification:**
  Given All units with their item pools
  When  A quick round or a blitz question is built
  Then  Each question first picks a unit uniformly at random, then an item uniformly at random within that unit. Quick round: 5 independent draws, so duplicates are possible. Blitz: 1 draw. All draws are built as multiple-choice questions, never typed.
**Parameters:** Quick round size 5 (builders.js:65). Blitz count 1 (builders.js:66).
**Edge cases handled:** Items in small units are more likely to appear than items in large units.; Repeated items within one quick round are possible (independent draws).; A unit with no pool entry makes the draw fail. No guard.; Blitz never produces a typed question, although the typed variant exists.
**Confidence:** High

### RULE-006: Scheitel-, Neben-, Stufen- und Wechselwinkel
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:103-115`
**Plain English:** Scheitel-, Stufen- und Wechselwinkel sind so groß wie der gegebene Winkel; Nebenwinkel ergänzen ihn zu 180°.
**Specification:**
  Given Ein Winkel misst 40° und die Frage lautet 'Wie groß ist der Nebenwinkel?'
  When  Die Aufgabe wird erzeugt
  Then  Die richtige Antwort ist 140° (180° − 40°). Bei Scheitel-, Stufen- und Wechselwinkel wäre die richtige Antwort 40°.
**Parameters:** Gegebener Winkel a = 10·k mit k zufällig 2 bis 17, also 20° bis 170°. Art des Winkels zufällig aus vier Arten (Scheitel, Nebenwinkel, Stufen, Wechsel) gewählt. Ein Winkel ist 'gleich' bei Scheitel, Stufen, Wechsel; 'Ergänzung' bei Nebenwinkel.
**Edge cases handled:** Bei a = 170° ist der Nebenwinkel 10°.; Stufen- und Wechselwinkel verlangen parallele Geraden; die Aufgabe nennt das im Text. Scheitel und Nebenwinkel verlangen nur sich schneidende Geraden.; Falsche Antworten: 180°−a, a, 90°−(a mod 90°), nur positive Werte; fehlende werden mit Nahwerten aufgefüllt. Ist a = 90°, fällt der Wert 90° wegen Dubletten weg.
**Confidence:** High

### RULE-007: Missing triangle angle = 180° minus the two given angles
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:117-121`
**Also cited:** apps/geometrie/builders.js:117-121
**Plain English:** In a triangle with two known angles, the third angle is 180 degrees minus the sum of those two.
**Specification:**
  Given A generated sum task whose prompt contains two angles written as '= N°'.
  When  The task is generated 300 times and the answer is parsed.
  Then  Answer = 180 − a − b, where a and b are the two angles in the prompt.
**Parameters:** Triangle angle sum 180°.
**Edge cases handled:** Answers are parsed with '°' and the minus sign '−' removed.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/geometrie.test.js:44-50) are a test. Lines 46-50 do assert that the parsed answer equals 180 - a - b for the sum task, so the rule is verified there, but the test does not generate the task. The executable behavior lives in apps/geometrie/builders.js:117-121. In winkelsumme(), a and b are drawn with rnd(30, 80), c = 180 - a - b is computed…

### RULE-008: Thaleskreis: rechter Winkel bei C und Restwinkel
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:131-140`
**Also cited:** legacy/modulare/apps/geometrie/builders.js:136-139
**Plain English:** Liegt C auf dem Halbkreis über dem Durchmesser AB, ist der Winkel bei C immer 90°, und β ergibt sich als 90° minus α.
**Specification:**
  Given Dreieck ABC, C auf dem Thaleskreis über AB, α = 35°
  When  Die Frage nach β erzeugt wird
  Then  Die richtige Antwort ist β = 180° − 90° − 35° = 55°. Die Frage nach dem Winkel bei C hat immer die Antwort 90°, Falsche: 60°, 180°, 45°.
**Parameters:** α zufällig 20° bis 70°, damit β zwischen 20° und 70° liegt. Rechter Winkel bei C = 90° (fest). Falsche Werte für β: α, 180°−α, 90°+α.
**Edge cases handled:** Der Fall mit gleichschenkligem rechtwinkligem Dreieck (builders.js:199-202) gibt als Winkel bei A genau 45° an; falsche Antworten 90°, 30°, 60°.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/geometrie.test.js:54-57) are a test that asserts the rule: it takes POOLS.thales[1], parses α from the prompt, and checks the answer equals 90 − α. The behavior itself is implemented in the generator. In legacy/modulare/apps/geometrie/builders.js:136-139 (thalesBeta), 'a = rnd(20, 70)', the prompt states "Es ist α = ${a}°", and the answer…

### RULE-009: Thaleskreis: Radius ist halbe Hypotenuse
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:142-146`
**Plain English:** Die Hypotenuse ist der Durchmesser des Thaleskreises; der Radius des Umkreises ist also die Hälfte davon.
**Specification:**
  Given Die Hypotenuse eines rechtwinkligen Dreiecks ist 12 cm lang
  When  Die Frage nach dem Umkreisradius erzeugt wird
  Then  Die richtige Antwort ist 12 cm : 2 = 6 cm. Falsche Antworten: 12 cm, 7 cm, 14 cm, mit Nahwerten aufgefüllt.
**Parameters:** Radius r = rnd(2,9), Hypotenuse = 2·r, also 4 cm bis 18 cm.
**Confidence:** High

### RULE-010: Maßstab: Umrechnung zwischen Zeichnung und Wirklichkeit
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:162-183`
**Also cited:** apps/geometrie/diagrams.js:91-99; tests/geometrie.test.js:61-72
**Plain English:** Im Maßstab 1 : n entspricht 1 cm in der Zeichnung n cm in der Wirklichkeit; Wirklichkeit in Meter ist Zeichnung in cm mal n geteilt durch 100.
**Specification:**
  Given Maßstab 1 : 200 und 3 cm in der Zeichnung
  When  Die Aufgabe 'Wie lang ist sie in Wirklichkeit?' erzeugt wird
  Then  Die richtige Antwort ist 3 · 200 cm = 600 cm = 6 m. Andere Richtungen: Haus 6 m im Maßstab 1 : 100 ergibt 6 cm in der Zeichnung; 3 cm und 6 m ergeben Maßstab 1 : 200.
**Parameters:** Wirklichkeit: n aus {50, 100, 200, 500}, d zufällig 2 cm bis 9 cm, Meter = d·n/100. Zeichnung: n aus {50, 100, 200} (ohne 500), d zufällig 3 cm bis 12 cm, Antwort d. Maßstab finden: n aus {50, 100, 200, 500}, d zufällig 2 cm bis 8 cm, Antwort n (Meter·100 : d). Falsche Antworten je nach Richtung: d·n cm, m·10, m/10, d+n/100; bzw. 1:10n, 1:n/2, 1:2n.
**Edge cases handled:** Bei n = 50 und ungeraden d entsteht eine halbe Meterzahl (z. B. 1,5 m); die Antwort wird exakt verglichen (siehe Eintipp-Prüfung).; Der Maßstab 1:500 kommt nur bei Wirklichkeit und Maßstab finden vor, nicht bei Zeichnung.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Read legacy/modulare/apps/geometrie/builders.js:162-183, diagrams.js:91-99 and tests/geometrie.test.js:61-72. The code matches the core rule: wirklichkeit() uses SCALES [50,100,200,500], d = rnd(2,9) (rnd is inclusive, mathkit.js:5), and meters = d*n/100, so 3 cm at 1:200 gives 6 m. zeichnung() uses…

### RULE-011: Höhe eines Baumes bei 45° Peilwinkel
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:185-189`
**Also cited:** legacy/modulare/apps/geometrie/builders.js:185-188
**Plain English:** Steht man vom Baum so weit weg, wie man 45° hoch peilt, ist der Baum genauso hoch wie der Abstand (gleichschenkliges Dreieck).
**Specification:**
  Given Abstand zum Fuß des Baumes 12 m, Peilwinkel 45°
  When  Die Aufgabe erzeugt wird
  Then  Die richtige Antwort ist 12 m. Falsche Antworten: 24 m, 6 m, 57 m, mit Nahwerten aufgefüllt.
**Parameters:** Abstand e zufällig 6 m bis 30 m. Peilwinkel 45° (fest). Augenhöhe wird vernachlässigt.
**Confidence:** Medium — What does the tree problem actually calculate? The test expects the answer to equal the distance given in the text ('stehst … m'). Is this intended, or is a calculation step (for example a shadow ratio) missing?

### RULE-012: Außenwinkel im Dreieck
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:204-208`
**Also cited:** legacy/modulare/apps/geometrie/builders.js:204-207 (generator: a, b drawn at line 205; answer num(a + b) at line 207). The cited test at tests/geometrie.test.js:78-80 is corroborating evidence only
**Plain English:** Der Außenwinkel an einer Ecke ist so groß wie die beiden gegenüberliegenden Innenwinkel zusammen.
**Specification:**
  Given Im Dreieck ABC ist α = 40° und β = 70°
  When  Die Frage nach dem Außenwinkel bei C erzeugt wird
  Then  Die richtige Antwort ist α + β = 110°. Der Weg läuft über γ = 180° − 40° − 70° = 70°, Außenwinkel = 180° − γ = 110°. Falsche Antworten: γ, 180°−α, 180°−β, 180°−γ+... (Distraktoren [c, 180−a, 180−b, a+b+c]), mit Nahwerten aufgefüllt.
**Parameters:** α und β zufällig 30° bis 80°. Außenwinkel liegt damit zwischen 60° und 160°. Die Hilfsgröße γ = 180° − α − β wird intern berechnet.
**Edge cases handled:** Der Distraktor a+b+c ist immer 180°; er wird über die Dubletten-Filterung nur dann entfernt, wenn er der richtigen Antwort entspricht.
**Confidence:** Medium — Does the exterior-angle task always use the exterior angle theorem (exterior angle = sum of the two remote interior angles)? Are the first two numbers in the prompt always those two angles?

### RULE-013: Mittelsenkrechte: Gleichweit-Eigenschaft und Mittelpunkt der Strecke
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:34-51`
**Plain English:** Jeder Punkt auf der Mittelsenkrechten ist von A und B gleich weit entfernt; der Schnittpunkt M mit AB halbiert die Strecke.
**Specification:**
  Given Punkt P liegt auf der Mittelsenkrechten von AB und PA = 7 cm. Außerdem ist AB = 10 cm und M ist der Schnittpunkt.
  When  Die Aufgaben 'Wie lang ist PB?' und 'Wie lang ist AM?' erzeugt werden
  Then  PB = PA = 7 cm. AM = 10 cm : 2 = 5 cm. Falsche Antworten sind jeweils Verdopplung, Halbierung und Nahwerte.
**Parameters:** PA = x zufällig 3 cm bis 12 cm. AB = 2·h mit h zufällig 2 cm bis 9 cm (AB 4 cm bis 18 cm).
**Edge cases handled:** Zirkelradius-Frage (builders.js:46-51): AB wird aus {4, 6, 8, 10} cm gewählt. Richtig ist 'mehr als AB/2'; falsch sind 'genau AB/2', 'weniger als AB/2' und 'genau 2·AB'. Begründung: die Bögen um A un…; Die Zirkelradius-Frage ist nur als Auswahl, nicht eintippbar.
**Confidence:** High

### RULE-014: Winkelhalbierende: Teilwinkel ist die Hälfte
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:56-66`
**Plain English:** Eine Winkelhalbierende teilt einen Winkel in zwei gleich große Teile; der ganze Winkel ist das Doppelte eines Teils.
**Specification:**
  Given Ein Winkel von 80° wird halbiert
  When  Die Frage nach dem Teilwinkel erzeugt wird
  Then  Die richtige Antwort ist 80° : 2 = 40°. Umgekehrt: Teilwinkel 35° ergibt 70°.
**Parameters:** Hälfte h = rnd(15,60). Ganzer Winkel 30° bis 120°. Falsche Antworten: 2h, 90°−h, h+10° bzw. h, h+90°, 3h.
**Edge cases handled:** Das Halbieren-Muster hat in der Aufgabenliste doppeltes Gewicht (siehe Aufgabenmix).
**Confidence:** High

### RULE-015: Circumcentre of a triangle
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/geom.js:27-32`
**Plain English:** The circumcentre is the point equally far from all three corners of a triangle, computed with the standard determinant formula.
**Specification:**
  Given Three corner points A, B, C as [x, y].
  When  circumcenter(A, B, C) is called to draw a triangle diagram.
  Then  d = 2·[Ax(By−Cy) + Bx(Cy−Ay) + Cx(Ay−By)]. Ux = [|A|²(By−Cy) + |B|²(Cy−Ay) + |C|²(Ay−By)] / d. Uy = [|A|²(Cx−Bx) + |B|²(Ax−Cx) + |C|²(Bx−Ax)] / d. Example: A(0,0), B(4,0), C(0,3) gives d = 24 and centre (2, 1.5), the midpoint of the hypotenuse, which is correct for a right triangle.
**Parameters:** No constants. Output is [Ux, Uy] in drawing coordinates.
**Edge cases handled:** Collinear points make d = 0 and the code does not check for it. Example: A(0,0), B(1,1), C(2,2) gives Ux = −Infinity and Uy = +Infinity, which would be written into SVG output.; No guard and no fallback exists for degenerate input.
**Suspected defect:** No check for d = 0 (geom.js:28). Degenerate triangles produce non-finite coordinates instead of an error or a skipped figure.
**Confidence:** High

### RULE-016: Incircle centre and inradius of a triangle
**Category:** Calculation
**Priority:** P1
**Source:** `apps/geometrie/geom.js:34-39`
**Plain English:** The inscribed circle of a triangle sits at the side-length-weighted average of its three corners, and its radius is twice the area divided by the perimeter.
**Specification:**
  Given Three corner points A, B, C as [x, y]. Side lengths a = |BC|, b = |AC|, c = |AB| use the Euclidean distance helper dist (geom.js:8).
  When  incircle(A, B, C) is called to draw a triangle diagram in a lesson.
  Then  Centre I = (a·A + b·B + c·C) / (a+b+c), computed per coordinate. Area = |(B−A) × (C−A)| / 2. Radius r = 2·Area / (a+b+c). The code calls the perimeter 's', but it is the full perimeter, not the semi-perimeter, and the formula still gives the correct r. Example: A(0,0), B(4,0), C(0,3) gives a=5, b=3, c=4, perimeter 12, area 6, so I = (1, 1) and r = 1.
**Parameters:** No constants. Uses dist (geom.js:8). Returns { I: [x, y], r }. Values are not rounded here; rounding to one decimal happens only when the circle is drawn (see the rounding rule).
**Edge cases handled:** Collinear but distinct points: area is 0, so r = 0 and the centre lies on the line.; All three points identical: perimeter is 0, so I and r become NaN. There is no guard against this in the code.; Triangle diagram input is not validated anywhere in these lines; the caller is trusted.
**Confidence:** High

### RULE-017: Decimal to binary question
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:109-125`
**Plain English:** The child writes a decimal number in binary. The correct answer is the standard base-2 representation without leading zeros.
**Specification:**
  Given A level (easy or mid). n is drawn from RANGE[level] (builders.js:111), bin = toBin(n) (builders.js:112).
  When  The question is built, with a 50/50 choice between multiple-choice (options from distractors) and typed input (checker 'bin').
  Then  Answer = bin (e.g. 13 gives 1101). Multiple-choice distractors in order: reversed(bin), flipBits(bin), toBin(n+1), toBin(n-1), toBin(n+2) (builders.js:117). Example: 13 gives 1101 and distractors 1011, 0010, 1110, all shown as binary text.
**Parameters:** flipBits and reversed are string operations (builders.js:31-32). Coin flip 50/50.
**Edge cases handled:** Typed input accepts leading zeros, e.g. '001101' for 13.; The explanation (explainDecToBin, numbers.js:56) names the place values 128, 64, 32 and so on, which covers all 8 places even for small n.
**Suspected defect:** builders.js:117: flipBits(bin) always starts with 0, because bin starts with 1. reversed(bin) starts with 0 whenever n is even. The correct answer never starts with 0, so a child can rule out these distractors by format alone. The distractor is easy to eliminate and does not test the conversion.
**Confidence:** High

### RULE-018: Largest place value that fits
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:127-136`
**Plain English:** The child names the largest place value (128, 64 ... 1) that fits into a number. That is where binary writing starts.
**Specification:**
  Given n drawn from 5 to 255 (builders.js:128).
  When  The question is built. w = the first weight in [128,64,32,16,8,4,2,1] with w <= n (builders.js:129).
  Then  Answer = w (as a string). Example: n=45 gives w=32. Distractors in order: 2w (64), w/2 (16), n (45), 4w (128). Options: 32, 64, 16, 45 in random order.
**Parameters:** Weights list [128,64,32,16,8,4,2,1]. Distractor candidates: 2w, w/2, n, 4w (builders.js:133).
**Edge cases handled:** Since n is at least 5, w is never less than 4, so w/2 is always a whole number (the Math.floor is inert).; The explanation says 2w does not fit (w <= n < 2w), which is true by construction.
**Confidence:** High

### RULE-019: Binary addition question
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:140-150`
**Plain English:** The child adds two binary numbers. The correct answer is the binary form of the sum.
**Specification:**
  Given Level easy or mid. Operands a and b are each drawn from 1 to 7 (easy) or 1 to 15 (mid) (builders.js:141-142).
  When  The question is built.
  Then  Typed question, checker 'bin'. Answer = toBin(a+b) (no leading zeros). The explanation (explainAdd, numbers.js:63) gives the decimal sum and the binary result. The help box shows 0+0=0, 0+1=1, 1+1=10, 1+1+1=11. Example: a=5 (101), b=3 (11), sum 8, answer 1000.
**Parameters:** Operand ranges: easy 1-7, mid 1-15 (builders.js:141). Sum range: 2 to 14 (easy) or 2 to 30 (mid).
**Edge cases handled:** With mid operands the sum can reach 30 (five bits), so the answer can be one bit longer than either operand.; Operands are never 0.; The answer is typed, so the leading-zero stripping in the checker applies (rule 1).
**Confidence:** High

### RULE-020: Single-column carry rules
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:152-159`
**Plain English:** The child recalls one of four basic binary sums, including the carry rule 1 + 1 = 10.
**Specification:**
  Given A fixed table of four facts: 1+1 gives 10, 1+1+1 gives 11, 1+0 gives 1, 0+0 gives 0 (builders.js:153). One is picked uniformly with pick().
  When  The question is built.
  Then  Multiple-choice question with answer = the picked result. Distractor candidates in order: '0', '1', '10', '11', '2' (builders.js:157). The '2' is not a binary digit and is a deliberate trap, explained by 'Binär gibt es keine 2'. Example: 1+1 gives answer 10, options 10, 0, 1, 11.
**Parameters:** Four facts, uniform choice. Distractor candidates: 0, 1, 10, 11, 2.
**Edge cases handled:** The 1+0 and 0+0 facts share one explanatory text: 'Hier gibt es keinen Übertrag.'; The 1+1+1 fact (11) is a three-operand case that is not a standard two-operand addition.
**Confidence:** High

### RULE-021: Hexadecimal conversion questions (hex to decimal, decimal to hex, hex digit value)
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:163-202`
**Plain English:** The child converts between hexadecimal and decimal, or gives the value of one hex letter (A=10 ... F=15). Hex letters are written in uppercase.
**Specification:**
  Given hexToDecQ: n from 10 to 15 (easy), 16 to 99 (mid), 40 to 255 (hard, unused). decToHexQ: n from 10 to 31 (easy) or 16 to 99 (mid) (builders.js:180). hexDigitQ: i from 10 to 15 (builders.js:196).
  When  The question is built, with a coin flip between multiple-choice and typed input for the two conversions.
  Then  hexToDec: answer = n, and the explanation is hex = high digit x 16 + low digit (explainHexToDec, numbers.js:57). Example: 2F gives 2 x 16 + 15 = 47. hexToDec distractors: reversed hex digits read as hex, n+1, n-1, n+16, hex string read as decimal (NaN values dropped). decToHex: answer = toHex(n) (uppercase), explanation n/16 quotient and remainder (numbers.js:58). Example: 47 gives 2F. decToHex distractors: reversed hex string, hex of n+1, hex of n-1, hex of n+16, String(n). hexDigit: answer = i (decimal) for the letter HEX[i]; distractors i-1, i+1, i-2, 16, 9.
**Parameters:** HEX = '0123456789ABCDEF' (numbers.js:5). Coin flip 50/50 for the two conversion questions. hexDigit range 10 to 15.
**Edge cases handled:** For single-digit hex (values 10 to 15), reversing the string gives the same value, so the duplicate is dropped.; hexToDec's typed answer uses 'dec' checker, so 'z. B. 47' is valid.; The hex 'hard' branch (builders.js:164) is unreachable (rule 2).
**Confidence:** High

### RULE-022: Binary and hexadecimal in groups of four bits
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:206-233`
**Plain English:** Four bits make one hex digit. The child translates between binary and hex, either way.
**Specification:**
  Given binToHexQ: easy n from 1 to 15 with a 4-bit binary prompt, mid n from 16 to 255 with an 8-bit binary prompt (builders.js:207-208). hexToBinQ: n from 16 to 255 (builders.js:224), with a hex prompt and an 8-bit answer.
  When  The question is built, with a coin flip between multiple-choice and typed input (binToHex) or typed only (hexToBin).
  Then  binToHex: answer = toHex(n). Explanation groups the bits into fours (explainBinToHex, numbers.js:59-62). Example: 1011 0110 gives B6. hexToBin: answer = toBin(n) padded to 8 bits. Explanation: each hex digit is written as four bits (builders.js:230). Example: B6 gives 10110110. binToHex distractors: reversed hex, hex of n+1, hex of n-1, String(n).
**Parameters:** Padding: 4 bits for easy binToHex, 8 bits otherwise (builders.js:208). Typed input checker 'hex' or 'bin'.
**Edge cases handled:** The 8-bit padding in hexToBin is not enforced by the checker (rule 1): '10110110' and '1' are normalized the same as 00000001.; Multiple-choice binToHex does not show the padded form in its distractors, so distractors such as 'A' and 'B' do not clash with padding.
**Confidence:** High

### RULE-023: Multiple-choice question has four options: the correct answer plus three distractors
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:22-25`
**Plain English:** Every multiple-choice question offers the correct answer and three wrong answers, shown in random order.
**Specification:**
  Given A choice question with answer '13' and a list of candidate wrong answers in a fixed order.
  When  choice() builds the question: distractors() (numbers.js:77-93) keeps the first three candidates that are not the answer, not 'NaN' and not negative, with duplicates removed. If fewer than three remain, it fills in decimal neighbours answer+d and answer-d. choiceQuestion then shuffles the list (questions.js:18, Fisher-Yates in ui.js:9-15).
  Then  Four options are shown: the answer and three distractors, in random position. Example: binToDecQ for bin 1101 (13). Candidates are reversed bits 1011 (11), flipped bits 0010 (2), 14, 12, 15. The options are 13, 11, 2, 14 in random order.
**Parameters:** Options per question: 1 correct + 3 distractors (builders.js:24, the 3 in distractors(answer, wrong, 3)).
**Edge cases handled:** If the candidates collapse (duplicates, or answer-equal values), the neighbour fill-in uses parseInt on the answer. For binary or hex answers this yields decimal neighbours that are not valid binary…; Only shuffling and the answer-in-options guarantee are enforced here. The correct answer always occupies one of the four slots.
**Confidence:** High

### RULE-024: Place-value questions (digit value, decomposition, reconstruction)
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:36-72`
**Plain English:** For a four-digit number (100 to 9999), the child either names the value of one digit, writes the number as a sum of place values, or rebuilds the number from that sum.
**Specification:**
  Given n drawn from 100 to 9999 (builders.js:38), digits d = n padded to 4 places (numbers.js:12). kind = rnd(0,2) picks one of three variants with equal probability.
  When  The question is built.
  Then  Variant 0 (builders.js:41-53): pick a place i from 0 to 3 at random, digit d[i]; answer = digit x weight (1000, 100, 10, 1). Example: n=352, Hunderter, digit 3, answer 300. Distractors: digit x 10 x weight, digit alone, digit x the neighbour's weight, digit x the other neighbour's weight. Variant 1 (builders.js:54-63): answer = placeSum(n), e.g. 3x100 + 5x10 + 2x1 (zero digits left out). Distractors: placeSum of the digit-reversed number, n+10, n-100, and placeSum with digit pairs swapped. Variant 2 (builders.js:64-71): typed question, prompt is the placeSum with the operator spaced, answer = String(n), checker 'dec'.
**Parameters:** Weights [1000,100,10,1]. Probability 1/3 per variant.
**Edge cases handled:** A digit 0 gives answer '0', and all of its distractors collapse to '0'. The neighbour fill-in then gives 1, 2 and 3 (numbers.js:86-91).; placeSum(n-100) is safe only because n is at least 100 (builders.js:60).; Variant 0 draws its place index uniformly, so the thousands place appears as often as the ones place.
**Confidence:** High

### RULE-025: Binary to decimal question
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:76-93`
**Plain English:** The child converts a binary number to decimal. The correct answer is the decimal value of the bits.
**Specification:**
  Given A level (easy or mid). n is drawn from RANGE[level] (builders.js:78) and bin = n written in base 2 (builders.js:79).
  When  The question is built. A coin flip (rnd(0,1)) decides between a multiple-choice question and a typed question.
  Then  Answer = n as a decimal string. The explanation lists the place weights of the 1-bits and their sum (explainBinToDec, numbers.js:52-55). Multiple-choice distractors in order: reversed bits as value, flipped bits as value, n+1, n-1, n+2 (builders.js:85). Example: bin 1101, answer 13, with distractors 11, 2, 14 from the first three candidates.
**Parameters:** Coin flip 50/50 between choice and type format. Distractor candidates: parseInt(reversed), parseInt(flipped), n+1, n-1, n+2.
**Edge cases handled:** Typed answers use checker 'dec' (digits only), so '13' and '013' are both accepted.; Flipped bits are read as a decimal value (parseInt base 2), so the wrong answer has no visible tell.
**Confidence:** High

### RULE-026: Count the lit lamps (sum of place values)
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/builders.js:95-105`
**Also cited:** apps/informatik/diagrams.js:29-42
**Plain English:** The child reads eight lamps (128 to 1) and adds the values of the lit ones to get the number.
**Specification:**
  Given n is drawn from 3 to 255 (builders.js:96), written as 8 bits (padStart 8), and lit = the place values of the 1-bits, from left to right (builders.js:98).
  When  The question is built.
  Then  Answer = n. The prompt shows the lit values summed, e.g. 8 + 4 + 1. Multiple-choice distractors in order: n+1, n-1, n+16, n-2, and the count of lit lamps (builders.js:102). Example: n=13, lamps 8 + 4 + 1, answer 13, distractors 14, 12, 29 (the first three candidates).
**Parameters:** Lamp count 8 (fixed). Weights from numbers.js WEIGHTS = [128,64,32,16,8,4,2,1].
**Edge cases handled:** The 'lit count' distractor is only used if the earlier candidates collapse. It can be 1 to 8, which can coincide with small answers.
**Confidence:** High

### RULE-027: Binary addition carry diagram
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/diagrams.js:64-82`
**Plain English:** A column-addition diagram in binary. A carry is marked above the column it goes into, and the column sum is shown below the line.
**Specification:**
  Given a and b, default 11 and 6. sum = a + b (17 by default). width = bits of the sum (5 by default). A and B are padded to width.
  When  addDiagram(a, b) is drawn.
  Then  Carry rule: column i produces a carry (carry[i]) when A[i] + B[i] + carry-in is greater than 1 (diagrams.js:69). The carry-in of a column is the carry produced by the column to its right (carry[i+1]). A carry circle with 1 is drawn above the column that receives it (diagrams.js:73). Example: 01011 + 00110 = 10001. Carries flow into columns 2, 1 and 0, and the sum bits read 10001.
**Parameters:** Column spacing 56 px. Circle radius 14.
**Edge cases handled:** The carry out of the leftmost column is not drawn as a circle, but it is the leading 1 of the sum.; If a or b is larger than the sum (cannot happen for positive operands), the padding is not wide enough. Not reachable with the current inputs.
**Confidence:** High

### RULE-028: Stellenwert-Zerlegung einer Dezimalzahl
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/numbers.js:11-19`
**Plain English:** Eine Zahl bis 9999 wird in Tausender, Hunderter, Zehner und Einer zerlegt und als Summe von Ziffer mal Stellenwert gezeigt; Nullstellen entfallen.
**Specification:**
  Given Eine Zahl n im Bereich 0 bis 9999 (Standardwert im Spielzeug: 352, theory.js:42).
  When  Die Stellentafel und die Summenzeile werden gezeichnet.
  Then  Die Zahl wird vierstellig mit führenden Nullen gelesen (0352) und jede Ziffer ungleich 0 wird als 'Ziffer×Stellenwert' ausgegeben, verbunden mit ' + ' (352 ergibt '3×100 + 5×10 + 2×1 = 352'). Die Zahl 0 ergibt '0'.
**Parameters:** Stellenzahl 4 (numbers.js:11); Obergrenze 9999 (numbers.js:12, zusätzlich Begrenzung der Eingabe auf 9999 in theory.js:51); Stellenwerte 1000, 100, 10, 1 (numbers.js:17).
**Edge cases handled:** Eingaben über 9999 werden vor der Zerlegung auf 9999 begrenzt (numbers.js:12 und theory.js:51).; Negative Werte werden auf 0 begrenzt (numbers.js:12).; Die Zahl 0 ergibt keine Teilsumme, sondern den Text '0' (numbers.js:18).; Die Nullstelle wird weggelassen: 1005 ergibt '1×1000 + 5×1 = 1005' (numbers.js:17).
**Confidence:** High

### RULE-029: Binär nach Dezimal über Stellenwerte
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/numbers.js:21-25`
**Plain English:** Eine Binärzahl wird in Dezimal umgerechnet, indem man die Stellenwerte (Zweierpotenzen) addiert, über denen eine 1 steht.
**Specification:**
  Given Eine Binärzahl als Zeichenkette, z. B. '1101'.
  When  Die Stellenwerte werden berechnet.
  Then  Für jede Stelle mit 1 wird 2 hoch (Länge − 1 − Position) gebildet; die Summe ist der Dezimalwert. '1101' ergibt [8, 4, 1] = 13. Im Lampen-Spielzeug entspricht das der Summe der leuchtenden Lampen (theory.js:64-67): Startbelegung '00001011' ergibt '8 + 2 + 1 = 11'.
**Parameters:** Lampen-Tafel mit 8 Stellen, Stellenwerte 128, 64, 32, 16, 8, 4, 2, 1 (numbers.js:4; theory.js:9-10); Startbelegung [0,0,0,0,1,0,1,1] = 11 (theory.js:64).
**Edge cases handled:** Eine Null-Zeichenkette ('0') oder nur Nullen ergibt eine leere Liste und den Wert 0 (numbers.js:24, Anzeige '0' in theory.js:66).; Im Spielzeug ergibt ein Klick auf die Lampe mit Stellenwert 128 (Index 0) die Summe 139, was smoke.mjs:8 prüft.; Die Erklärung explainBinToDec (numbers.js:52-55) nutzt parseInt(bin, 2) und liefert dasselbe Ergebnis.
**Confidence:** High

### RULE-030: Dezimal nach Binär über Schritte mit Stellenwerten
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/numbers.js:27-40`
**Plain English:** Eine Dezimalzahl wird in Binär umgewandelt: von links nach rechts prüft man, ob der Stellenwert noch in den Rest passt. Passt er, schreibt man 1 und zieht ihn ab, sonst 0.
**Specification:**
  Given Eine Dezimalzahl n, z. B. 13.
  When  Die Schritte werden berechnet.
  Then  Die Schleife beginnt beim größten Stellenwert, der nicht größer als n ist. Für jeden Stellenwert w gilt: passt w in den Rest, wird der Rest um w verringert und die Stelle ist 1, sonst 0. Für 13 ergibt das 8 ja (Rest 13), 4 ja (Rest 5), 2 nein (Rest 1), 1 ja (Rest 1), also 1101.
**Parameters:** Stellenwerte 128, 64, 32, 16, 8, 4, 2, 1 (numbers.js:4). Eingabe im Spielzeug auf 0 bis 255 begrenzt (theory.js:72 und 75). Der Stellenwert 1 ist immer Teil der Schritte (numbers.js:33).
**Edge cases handled:** Für n = 0 entsteht ein einziger Schritt mit Stellenwert 1, Ergebnis '0' (numbers.js:33).; Für n über 255 endet der Algorithmus mit einem Rest über 0, weil es keine größeren Stellenwerte gibt (z. B. 300 bleibt Rest 45). Das Spielzeug verhindert das durch die Obergrenze 255 (theory.js:75).; Die Anzeige in decToBinHTML (numbers.js:43-49) zeigt jeden Schritt als 'Passt w in Rest? Ja/Nein' und ist nur Darstellung.
**Suspected defect:** Für Zahlen über 255 liefert decToBinSteps einen unvollständigen Rest, ohne Fehlermeldung. Die Begrenzung liegt nur im Aufrufer (theory.js:75).
**Confidence:** High

### RULE-031: Binär nach Hexadezimal in Vierergruppen
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/numbers.js:59-62`
**Plain English:** Eine Binärzahl wird von rechts in Vierergruppen (Nibbles) geteilt, links mit Nullen aufgefüllt; jede Gruppe wird zu einer Hex-Ziffer.
**Specification:**
  Given Eine Binärzahl als Zeichenkette, z. B. '1111111' (7 Stellen).
  When  Die Erklärung zur Umrechnung wird erzeugt.
  Then  Die Zeichenkette wird links auf ein Vielfaches von 4 aufgefüllt ('01111111'), in Vierergruppen zerlegt ('0111', '1111') und jede Gruppe wird über HEX[Wert] zur Ziffer: 7 und F, also 7F.
**Parameters:** Gruppengröße 4 (numbers.js:60). Im Lampen-Spielzeug fest 8 Stellen, geteilt bei Index 4 (theory.js:122-124, Startbelegung '11010110' ergibt D6).
**Edge cases handled:** Das Lampen-Spielzeug kennt nur 8 Stellen und teilt immer nach 4 Stellen; die Erklärfunktion füllt dagegen beliebig lange Zahlen auf (theory.js:123-124 gegen numbers.js:60).; Eine leere Zeichenkette würde groups = null ergeben und einen Fehler auslösen (numbers.js:60-61). Normale Eingaben können das nicht erreichen, weil normInput eine leere Eingabe ablehnt (numbers.js:69…; '111' wird zu '0111' und ergibt 7.
**Confidence:** High

### RULE-032: Dezimal nach Hexadezimal über Division durch 16
**Category:** Calculation
**Priority:** P1
**Source:** `apps/informatik/theory.js:107-112`
**Plain English:** Eine Zahl bis 255 wird in Hex umgewandelt, indem man sie durch 16 teilt: der Quotient ist die linke Ziffer, der Rest die rechte.
**Specification:**
  Given Eine Zahl n im Bereich 0 bis 255 (Standardwert des Schiebereglers: 200, theory.js:99).
  When  Der Regler wird bewegt und die Werte werden gezeichnet.
  Then  q = n ÷ 16 (abgerundet), r = n mod 16. Die Hex-Ziffern sind HEX[q] und HEX[r]. Für 47: 47 : 16 = 2 Rest 15, 15 wird F, Ergebnis 2F (smoke.mjs:18 prüft das). Für 200: 12 Rest 8, also C8.
**Parameters:** Divisor 16 (theory.js:108); Hex-Ziffern 0123456789ABCDEF (numbers.js:5); Regler 0 bis 255, Start 200 (theory.js:99).
**Edge cases handled:** Werte 0 bis 15 werden als einzelne Ziffer ohne führende Null ausgegeben (toHex, numbers.js:8).; Die Hilfsfunktion explainDecToHex (numbers.js:58) rechnet dieselbe Division und liefert den Erklärtext.; Ausgabe in Großbuchstaben (numbers.js:8).
**Confidence:** High

### RULE-033: Prozentrechnung: Prozentwert, Grundwert, Prozentsatz
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:111-127`
**Plain English:** Die drei Größen der Grundformel Prozentwert = Grundwert · Prozentsatz / 100 werden jeweils gesucht. Die Antwort ist die gesuchte Größe.
**Specification:**
  Given Grundwert G aus {40, 50, 60, 80, 120, 150, 200, 250, 400, 500, 800}; Prozentsatz p aus {5, 10, 20, 25, 30, 40, 50, 75} Prozent; Prozentwert W = G * p / 100.
  When  Eine Prozent-Aufgabe wird erzeugt.
  Then  Prozentwert: W = G * p / 100 (Zeile 112). Grundwert: G = W * 100 / p, angezeigt als Preis (Zeile 118-119). Prozentsatz: p = W / G * 100, als ganze Zahl (Zeile 124-125). Falsche Antworten liegen nahe dem Ergebnis (Zeilen 113, 119, 125).
**Parameters:** G aus 11 Werten (Zeile 108); p aus 8 Werten (Zeile 109); Ergebnis ist in € bei Euro-Beträgen.
**Edge cases handled:** W kann eine Dezimalzahl sein, z. B. 5 % von 50 € = 2,5 € (Zeile 112).; Beim Prozentsatz ist die falsche Antwort String(w) mit Punkt statt Komma (Zeile 125), nur Anzeige.; Die Antwort des Prozentsatzes ist die Zahl p ohne Prozentzeichen; numCheck entfernt das Zeichen (Zeile 125).
**Confidence:** High

### RULE-034: Rabatt: Preis nach Abzug
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:129-133`
**Plain English:** Nach einem Prozent-Rabatt zahlt man den restlichen Prozentsatz vom Preis.
**Specification:**
  Given Preis G aus {40, 60, 80, 120, 150, 200} Euro; Rabatt p aus {10, 20, 25, 50} Prozent.
  When  Eine Rabatt-Aufgabe wird erzeugt.
  Then  Neuer Preis = G * (100 - p) / 100. Erklärung: Rabatt = G * p / 100, neuer Preis = G - Rabatt.
**Parameters:** G aus 6 Werten (Zeile 130); p aus 4 Werten (Zeile 130).
**Edge cases handled:** Beispiel: 150 € mit 25 % ergibt 112,5 € (Dezimal mit Komma).; Falsche Antwort 'G - p' vermischt Euro und Prozent (Zeile 131).
**Confidence:** High

### RULE-035: Zinsrechnung für ein Jahr: Zinsen, Kapital, Zinssatz
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:136-155`
**Plain English:** Jahreszinsen sind Kapital mal Zinssatz. Je nach Aufgabe wird Zinsen, Kapital oder Zinssatz gesucht.
**Specification:**
  Given Kapital K aus {200, 400, 500, 800, 1000, 1500, 2000, 2500, 4000} Euro; Zinssatz p aus {1, 2, 3, 4, 5} Prozent; Zinsen Z = K * p / 100.
  When  Eine Zinsaufgabe wird erzeugt.
  Then  Zinsen: Z = K * p / 100 (Zeile 140). Kapital: K = Z * 100 / p (Zeile 146-148). Zinssatz: p = Z / K * 100 (Zeile 152-154). Zinsen sind immer ganze Euro.
**Parameters:** K aus 9 Werten (Zeile 136); p aus 1..5 (Zeile 137).
**Edge cases handled:** Bei Zinssatz ist die Antwort die ganze Zahl p; die Eingabe '5 %' oder '5,0' wird akzeptiert (numCheck).; Falsche Antworten: K + Z, K * p, K / p (Zeile 141); Kapital: Z * p, K / 2, Z + p (Zeile 147).
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Nicht P0 aus Compliance-Sicht. legacy/modulare/apps/mathe/builders.js:136-155 erzeugt Zinsaufgaben für eine Lern-App der 7. Klasse. Es werden kein Geld bewegt, keine gesetzliche oder regulatorische Pflicht erfüllt und keine Buchungsdaten geschrieben. Ein stilles Ändern würde einen Lernfehler erzeuge…

### RULE-036: Zinseszins: Endkapital nach mehreren Jahren
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:163-169`
**Also cited:** apps/mathe/builders.js:163-168
**Plain English:** Die Zinsen bleiben auf dem Konto und werden mitverzinst. Am Ende steht K * (1 + p/100) hoch n.
**Specification:**
  Given Eine feste Auswahl von sechs Kombinationen (K, p, n): (1000, 10, 2), (2000, 10, 2), (1000, 10, 3), (2000, 5, 2), (4000, 5, 2), (4000, 10, 2).
  When  Eine Zinseszins-Aufgabe wird erzeugt.
  Then  Endkapital = K * (1 + p/100)^n (Zeile 165). Erklärung: jedes Jahr mal (1 + p/100). Ohne Zinseszins wäre der Betrag kleiner.
**Parameters:** Kombinationen fest in Zeile 164; Falsche Antworten: K * (1 + n p/100), K * p/100 * n, K * (1 + p/100) * n (Zeile 167).
**Edge cases handled:** Ergebnisse sind 1210, 2420, 1331, 2205, 4410, 4840 (ganze Euro).; Die Erklärung ist nur für n = 2 und n = 3 ausgeschrieben (Zeile 168).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/mathe.test.js:125-133) are a test that checks the compound-interest answer: it parses K, n and p from the generated prompt and asserts /answer - K*(1+p/100)^n/ < 1e-6 (line 133). The test does not generate or compute the question itself. The behavior is implemented in the generator zinseszins() at legacy/modulare/apps/mathe/builders.js:163…

### RULE-037: Dreisatz: proportional und antiproportional
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:171-182`
**Also cited:** legacy/modulare/apps/mathe/builders.js:171-181
**Plain English:** Bei proportionalen Größen (mehr Hefte, mehr Geld) wird der Einzelpreis mit der neuen Menge multipliziert. Bei antiproportionalen Größen (mehr Arbeiter, weniger Tage) bleibt das Produkt gleich und wird durch die neue Anzahl geteilt.
**Specification:**
  Given Proportional: n1 aus {3,4,5,6,8}, Stückpreis-Faktor u aus 2..6, n2 aus {2,7,9,10,12}, p1 = n1 * u. Antiproportional: w1 aus {2,3,4,6}, Tage d aus {6,8,12,24}, total = w1 * d, w2 aus {2,3,4,6,8,12} mit w2 ungleich w1 und Teiler von total.
  When  Eine Dreisatz-Aufgabe wird erzeugt.
  Then  Proportional: Ergebnis = n2 * u (Zeile 174). Antiproportional: Ergebnis = total / w2 (Zeile 181), weil das Produkt w * Tage konstant ist.
**Parameters:** Wertelisten wie oben (Zeilen 172, 178-179). Die Zuordnung ist doppelt in der Auswahl (Zeile 299).
**Edge cases handled:** Für jeden Fall von d und w1 gibt es mindestens ein gültiges w2 (sonst würde pick undefined liefern); geprüft durch Aufzählung der Fälle.; Falsche Antwort 'd * w2 / w1' ist der typische Fehler bei antiproportional (Zeile 180).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/mathe.test.js:85-91) are a test that recomputes the Dreisatz answers and asserts them against the generator output. The formulas match the rule: direct (p1/n1)*n2 at line 88, inverse (w1*d)/w2 at line 91. The generator that actually computes the answer is apps/mathe/builders.js:171-181. dreisatzProp sets p1 = n1*u and r = n2*u, so r equals…

### RULE-038: Mittelwert ist immer eine ganze Zahl
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:197-205`
**Plain English:** Der Mittelwert ist Summe durch Anzahl. Die Aufgabe ist so gebaut, dass die Summe durch die Anzahl teilbar ist, damit das Ergebnis ganz bleibt.
**Specification:**
  Given n aus {4, 5, 6}; n-1 Zufallswerte aus 1..12; letzter Wert aus 1..12.
  When  Eine Mittelwert-Aufgabe wird erzeugt.
  Then  Der letzte Wert wird so lange weitergezählt (1..12, dann wieder 1), bis Summe durch n teilbar ist (Zeile 200). Ergebnis = Summe / n. Falsche Antworten: Summe, Maximum, mittlerer Wert der sortierten Liste.
**Parameters:** n aus {4,5,6} (Zeile 198); Werte 1..12 (Zeile 198-199).
**Edge cases handled:** Bei geradem n ist der 'mittlere Wert' als falsche Antwort der obere der beiden mittleren Werte, nicht deren Mittel (Zeile 203).; Schleife endet immer, weil die Werte 1..12 alle Reste mod n abdecken.
**Confidence:** High

### RULE-039: Statistik-Kennzahlen: Mittelwert, Median, Spannweite, Modus
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:197-226`
**Plain English:** Mean, median, range and mode of a data list are computed with the standard definitions, and the generator only asks for a mode when one value occurs most often.
**Specification:**
  Given A generated list of whole numbers (pool 'daten').
  When  A mean, median, range or mode question is generated.
  Then  Mean = sum ÷ count. Median = middle element of the sorted list at index (n − 1) ÷ 2. Range = largest − smallest. Mode = the single value with the highest count; the answer is exactly that one value.
**Parameters:** Median index (n − 1) ÷ 2 requires an odd count.
**Edge cases handled:** Median is only valid for an odd count: with an even count the index is not an integer, so the generator must avoid even lengths.; Mode generation must yield a unique most frequent value (the test asserts only one top value).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/mathe.test.js:95-111) are a test that recomputes the answers independently and asserts they match. They verify the rule but do not implement it. The generators that implement it are in apps/mathe/builders.js. mittelwert() (197-205) computes sum/count and forces the total to be divisible by n. median() (207-214) picks n from [5, 7] (line 20…

### RULE-040: Vorzeichenrechnung mit ganzen Zahlen
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:20-36`
**Plain English:** Eine Aufgabe mit zwei ganzen Zahlen mit Vorzeichen wird gerechnet (Plus, Minus, Mal, Geteilt). Die richtige Antwort ist das Ergebnis.
**Specification:**
  Given Zwei von null verschiedene ganze Zahlen a und b, aus -12 bis 12 bei Plus/Minus, aus -9 bis 9 bei Mal/Geteilt.
  When  Eine Vorzeichen-Aufgabe wird erzeugt.
  Then  Plus/Minus: Ergebnis a + b bzw. a - b (bei Minus wird die Gegenzahl addiert). Mal: a * b. Geteilt: Aufgabe (a*b) : b mit Ergebnis a. Erklärung: gleiche Vorzeichen ergeben Plus, verschiedene Minus.
**Parameters:** Bereich Plus/Minus -12..12 (Zeile 21); Bereich Mal/Geteilt -9..9 (Zeile 30); Wahrscheinlichkeit Minus-Aufgabe 0,5 (Zeile 21); Wahrscheinlichkeit Geteilt 0,4 (Zeile 30); Null ausgeschlossen durch nz() (Zeile 16).
**Edge cases handled:** Ergebnis 0 ist bei Plus/Minus möglich (a = b bei Minus).; Falsche Antworten: Gegenzahl, Betrag der Summe, a + b bzw. a - b, nahe am Ergebnis (Zeilen 24, 33).; Eingabe wird als Zahl geprüft (siehe Regel zur Eingabeprüfung).
**Confidence:** High

### RULE-041: Median: mittlerer Wert der sortierten Liste
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:207-214`
**Plain English:** Der Median ist der Wert in der Mitte, wenn die Liste der Größe nach sortiert ist. Die Liste hat immer eine ungerade Anzahl Werte.
**Specification:**
  Given n aus {5, 7}; Werte aus 1..15; höchstens ein Wert darf doppelt vorkommen.
  When  Eine Median-Aufgabe wird erzeugt.
  Then  Median = sortierter Wert an Position (n-1)/2 (Zeile 211). Erklärung: erst ordnen, dann die Mitte nehmen.
**Parameters:** n aus {5,7} (Zeile 208); Werte 1..15 (Zeile 210); Dubletten-Grenze: distinkte Werte >= n-1 (Zeile 210).
**Edge cases handled:** Falsche Antwort: der Wert an Position (n-1)/2 in der unsortierten Liste (Zeile 212).
**Confidence:** High

### RULE-042: Spannweite
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:216-220`
**Plain English:** Die Spannweite ist der größte Wert minus der kleinste Wert.
**Specification:**
  Given Sechs Zufallswerte aus 2..30.
  When  Eine Spannweiten-Aufgabe wird erzeugt.
  Then  Spannweite = Maximum - Minimum (Zeile 217-218). Falsche Antworten: Maximum, Minimum, Summe von Maximum und Minimum (Zeile 218).
**Parameters:** Anzahl Werte 6, Bereich 2..30 (Zeile 217).
**Edge cases handled:** Doppelte Werte sind erlaubt und ändern das Ergebnis nicht.
**Confidence:** High

### RULE-043: Modus: häufigster Wert ist eindeutig
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:222-227`
**Plain English:** Der Modus ist der Wert, der am häufigsten vorkommt. Die Liste ist so gebaut, dass genau ein Wert am häufigsten vorkommt.
**Specification:**
  Given m aus 1..9; drei weitere verschiedene Werte aus 1..9 ohne m.
  When  Eine Modus-Aufgabe wird erzeugt.
  Then  Der Wert m kommt dreimal vor, einer der anderen Werte zweimal, die beiden anderen einmal (Zeile 224). Antwort ist m. Falsche Antworten: die anderen Werte und das Maximum (Zeile 225).
**Parameters:** Liste mit 7 Einträgen (Zeile 224).
**Edge cases handled:** Eindeutigkeit folgt aus 3 > 2 (Zeile 226).
**Confidence:** High

### RULE-044: Laplace-Wahrscheinlichkeit: Würfel und Urne
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:229-246`
**Plain English:** Die Wahrscheinlichkeit ist die Zahl der günstigen Ergebnisse geteilt durch alle möglichen Ergebnisse. Das Ergebnis wird als gekürzter Bruch angezeigt.
**Specification:**
  Given Würfel: sechs feste Ereignisse mit günstigen Ergebnissen 3, 2, 2, 1, 6, 5 (aus 6). Urne: r und b aus 2..6, Farbe rot oder blau gleichverteilt.
  When  Eine Wahrscheinlichkeits-Aufgabe wird erzeugt.
  Then  Würfel: P = k/6, gekürzt (Zeile 234, 236-237). Urne: P = günstige / (r + b) (Zeile 241-243), gekürzt. Falsche Antworten sind andere Brüche, die nicht gleich der Antwort sind (Zeilen 235, 244).
**Parameters:** Ereignisse 'gerade Zahl' 3, 'größer als 4' 2, 'kleiner als 3' 2, 'die Zahl 6' 1, 'kleiner als 7' 6, 'keine 6' 5 (Zeilen 230-231); r, b aus 2..6 (Zeile 241).
**Edge cases handled:** Erklärung zeigt den ungekürzten Bruch, wenn er sich vom gekürzten unterscheidet (Zeile 245).; Eingabe wird als Bruch, Dezimalzahl oder Prozent akzeptiert (probCheck, Zeile 236/243).
**Confidence:** High

### RULE-045: Relative Häufigkeit eines Münzwurfs
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:248-253`
**Plain English:** Die relative Häufigkeit ist die absolute Häufigkeit geteilt durch die Zahl der Versuche.
**Specification:**
  Given Anzahl Würfe n aus {20, 25, 40, 50, 100}; Anzahl Zahl k aus 2 bis n-2.
  When  Eine Häufigkeits-Aufgabe wird erzeugt.
  Then  Relative Häufigkeit = k / n, als Dezimalzahl mit Komma (Zeile 250). Eingabe als Bruch, Dezimalzahl oder Prozent gilt als richtig (Zeile 250).
**Parameters:** n aus {20,25,40,50,100} (Zeile 249); k aus 2..n-2 (Zeile 249).
**Edge cases handled:** Alle möglichen Werte sind endliche Dezimalzahlen mit höchstens 3 Nachkommastellen (z. B. 1/40 = 0,025), die Rundung in fmt verändert nichts.; Falsche Antwort (k+1)/n ist ein Nachbarwert, gerundet auf 3 Stellen (Zeile 251).
**Confidence:** High

### RULE-046: Ratenkredit: Zinsen und Rate im ersten Jahr
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:257-272`
**Plain English:** Bei einem Kredit mit gleichbleibender Tilgung zahlt man im ersten Jahr Zinsen auf den ganzen Kredit. Die Rate ist Tilgung plus Zinsen.
**Specification:**
  Given Anzahl Jahre n aus {4,5,6,8,10}; jährliche Tilgung t aus {100,200,250,300,400,500} Euro; Kreditsumme K = n * t; Zinssatz p aus {2..6} Prozent.
  When  Eine Kredit-Aufgabe (Zinsen oder Rate im ersten Jahr) wird erzeugt.
  Then  Zinsen im ersten Jahr = K * p / 100 (Zeile 263-265). Rate im ersten Jahr = t + Zinsen (Zeile 269-271).
**Parameters:** n, t und p wie oben (Zeilen 258-259).
**Edge cases handled:** K ist immer ein Vielfaches von t, daher ist die Laufzeit genau n Jahre (Zeile 259).
**Confidence:** High

### RULE-047: Tilgungsplan: Rate, Restschuld, Zins auf Restschuld, Laufzeit
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:257-290`
**Plain English:** A loan with fixed repayments: each installment is the fixed repayment plus interest on the loan amount; the remaining debt is the loan minus repayments made; interest on the reduced balance and loan term follow simple formulas.
**Specification:**
  Given A loan amount K, a rate p, a fixed repayment t per period, and m periods paid.
  When  The installment, remaining debt, interest or term question is generated.
  Then  Installment = t + K × p ÷ 100. Remaining debt = K − m × t, and it stays above zero. Interest on the reduced balance = (K − t) × p ÷ 100. Term (years) = K ÷ t.
**Parameters:** Test helper treats '.' as thousands separator and ',' as decimal comma.
**Edge cases handled:** Remaining debt is asserted to stay positive (m × t < K).; Term is K ÷ t without rounding in the test.
**Confidence:** Medium — Is the installment interest meant to be charged on the original loan amount each period (flat, as the test computes it) rather than on the declining balance? Also, does 'zweites Jahr' (second year) describe the balance-after-first-repayment interest, and are remaining-debt values rounded?

### RULE-048: Restschuld nach m Jahren
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:274-278`
**Plain English:** Nach einigen Jahren ist die Restschuld die Kreditsumme minus alle bisher getilgten Beträge.
**Specification:**
  Given Kredit K = n * t; m aus 1 bis n-1 Jahren.
  When  Eine Restschuld-Aufgabe wird erzeugt.
  Then  Restschuld = K - m * t (Zeile 275-277). Erklärung: Tilgung verkleinert die Schuld.
**Parameters:** m aus 1..n-1 (Zeile 275).
**Edge cases handled:** Die Restschuld ist nie 0 oder negativ, weil m kleiner als n ist (Zeile 275).; Ein Jahr wird als 'Jahr' statt 'Jahren' formuliert (Zeile 276).
**Confidence:** High

### RULE-049: Zinsen im zweiten Jahr auf die Restschuld
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:280-284`
**Plain English:** Im zweiten Jahr zahlt man Zinsen nur noch auf die Restschuld nach der ersten Tilgung.
**Specification:**
  Given Kredit K = n * t; jährliche Tilgung t; Zinssatz p aus 2..6 Prozent.
  When  Eine Aufgabe zu den Zinsen im zweiten Jahr wird erzeugt.
  Then  Restschuld nach einem Jahr = K - t. Zinsen = (K - t) * p / 100 (Zeile 281-283).
**Parameters:** Zinssatz p aus 2..6 (Zeile 258/259).
**Edge cases handled:** Falsche Antwort t * p / 100 (Zinsen nur auf die Tilgung) wird angeboten (Zeile 282).
**Confidence:** High

### RULE-050: Terme zusammenfassen und Klammern auflösen
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:38-61`
**Plain English:** Gleichartige Glieder werden zusammengefasst und Klammern werden aufgelöst (Distributivgesetz, Minus vor der Klammer). Die Antwort ist der vereinfachte Term.
**Specification:**
  Given Ganze Zahlen aus festen Bereichen: a, b aus 2..9, c aus 1..6 (collect); a aus 3..9, c aus 1..2, k und m aus 2..9 (collectMixed); f aus 2..9, c aus 1..9 (expand); k aus 5..20, c aus 1..9 (minusBracket).
  When  Eine Term-Aufgabe wird erzeugt.
  Then  Zusammenfassen: Koeffizient = Summe der x-Faktoren, Konstante = Summe der Zahlen (collect: (a+b-c)x; collectMixed: (a-c)x + (k+m)). Ausmultiplizieren: f(x + c) = f x + f c (expand). Minus vor Klammer: k - (x - c) = -x + (k + c) (minusBracket).
**Parameters:** Bereiche wie oben; Vorzeichenwechsel bei Minus vor der Klammer (Zeile 59).
**Edge cases handled:** collect kann einen Koeffizienten 0 oder negativ ergeben: 0x (wenn a+b = c) bzw. -2x mit Bindestrich statt Minuszeichen (Zeile 41).; collectMixed: Rest-Koeffizient a - c ist immer mindestens 1, weil a >= 3 und c <= 2 (Zeilen 45-46).; Antwort wird als Term geprüft (Zeile 315, termCheck in math.js).
**Confidence:** High

### RULE-051: Ausklammern des gemeinsamen Faktors
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:63-70`
**Plain English:** Bei einem Term wie 4x + 4 wird ein gemeinsamer Faktor ausgeklammert. Die gesuchte Antwort ist die Form g · (ax + c).
**Specification:**
  Given g aus {2, 3, 4, 5, 6}, a aus 2..5, c aus 2..6. Die Aufgabe ist A x + C mit A = g*a und C = g*c.
  When  Eine Ausklammern-Aufgabe wird erzeugt (nur Auswahl, keine Eingabe).
  Then  Richtige Antwort: g · (a x + c). Der Schüler soll den Faktor g als 'größten gemeinsamen Faktor' erkennen (Erklärung Zeile 69).
**Parameters:** g aus {2,3,4,5,6} (Zeile 64); a aus 2..5; c aus 2..6 (Zeile 64).
**Edge cases handled:** Fehler im Schlüssel: Der größte gemeinsame Faktor von A und C ist g * ggT(a, c). Ist ggT(a, c) > 1, ist g · (a x + c) nicht der größte Faktor. Betroffen sind (a, c) = (2,2), (2,4), (2,6), (3,3), (3,6…; Die Erklärung in Zeile 69 ('Gemeinsamer Faktor ... ist g') ist in diesen Fällen falsch.; Wenn a = g, ist eine falsche Antwort (Zeile 67) gleich der richtigen; sie wird durch die Dublettenprüfung entfernt (Zeile 326).
**Suspected defect:** Der Schlüssel verlangt g statt des größten gemeinsamen Faktors g * ggT(a, c). Bei ggT(a, c) > 1 ist die Aufgabe mehrdeutig oder falsch beantwortet.
**Confidence:** High

### RULE-052: Lineare Gleichung nach x lösen
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:72-78`
**Plain English:** Eine Gleichung der Form a x + b = c wird nach x gelöst. Der Schüler gibt x ein oder wählt es aus. Die Lösung ist immer eine ganze Zahl.
**Specification:**
  Given x aus -9..9 ohne 0; a aus 2..9; b aus -12..12 ohne 0. Die Konstante wird als c = a*x + b gebildet.
  When  Eine Gleichungs-Aufgabe wird erzeugt.
  Then  Richtige Antwort ist x. Lösungsweg: erst b auf die andere Seite bringen, dann durch a teilen. Probe: a * x + b = c. Falsche Antworten: (c+b)/a, c-b, -x, (c-b)*a, nur ganzzahlige Werte, nahe bei x.
**Parameters:** x aus -9..9 ohne 0 (Zeile 73); a aus 2..9 (Zeile 73); b aus -12..12 ohne 0 (Zeile 73).
**Edge cases handled:** a >= 2, daher nie Teilen durch 1.; Die Lösung x ist nie 0.; Falsche Antworten, die nicht ganzzahlig sind, werden weggelassen (Zeile 76).
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (The cited code matches the rule card. legacy/modulare/apps/mathe/builders.js:73 draws x via nz(-9, 9), a via rnd(2, 9), b via nz(-12, 12), and sets c = a*x + b. nz (builders.js:16) rejects 0 and rnd (core/js/mathkit.js:5) uses Math.random. The correct answer is fmt(x) (line 76), and x is always an i…

### RULE-053: Anzahl der Lösungen einer linearen Gleichung
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/builders.js:80-90`
**Plain English:** Der Schüler bestimmt, ob eine Gleichung keine, genau eine oder unendlich viele Lösungen hat. Es gibt drei feste Gleichungsformen.
**Specification:**
  Given k aus 2..5, c aus 1..6, d = c + Zufall 1..6 (also d ungleich c).
  When  Eine Lösungsanzahl-Aufgabe wird erzeugt (nur Auswahl).
  Then  Form 1: kx + c = kx + d ergibt keine Lösung. Form 2: k(x + c) = kx + kc ergibt unendlich viele Lösungen. Form 3: kx + c = k(c+1) + c ergibt genau eine Lösung. Eine Form wird gleichverteilt gewählt. Die anderen beiden Antworten plus 'genau zwei Lösungen' sind falsch.
**Parameters:** k aus 2..5; c aus 1..6; d - c aus 1..6 (Zeile 81); Auswahl gleichverteilt (Zeile 87).
**Edge cases handled:** 'genau zwei Lösungen' ist in jeder Aufgabe falsch (Zeile 88).
**Confidence:** High

### RULE-054: Kreditdiagramm: Restschuld und Zinsen Jahr für Jahr
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/diagrams.js:122-135`
**Plain English:** Das Diagramm zeigt die Restschuld am Jahresanfang und die Zinsen für jedes Jahr. Die Restschuld sinkt, darum sinken auch die Zinsen.
**Specification:**
  Given Kredit k, jährliche Tilgung t, Zinssatz p (Standard 2000, 500, 4).
  When  Das Kreditdiagramm wird gezeichnet.
  Then  Anzahl Jahre = min(round(k/t), 5) (Zeile 124). Restschuld im Jahr i = k - i * t (Zeile 127). Balkenhöhe proportional zur Restschuld (Zeile 127). Zinsen im Jahr = Restschuld * p / 100 (Zeile 131).
**Parameters:** Höchstens 5 Jahre gezeigt (Zeile 124); Standard k=2000, t=500, p=4 (Zeile 123).
**Edge cases handled:** Bei mehr als 5 Jahren zeigt das Diagramm nur die ersten fünf (Anzeige-Grenze).; Bei k/t ohne Rest wird auf die nächste ganze Zahl gerundet (Zeile 124).
**Confidence:** High

### RULE-055: Wertetabelle: konstanter Quotient oder konstantes Produkt
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/diagrams.js:68-82`
**Plain English:** Die Tabelle zeigt bei proportionalen Größen einen gleichen Quotienten (y : x), bei antiproportionalen ein gleiches Produkt (x * y).
**Specification:**
  Given Art 'prop' oder antiproportional; k (Preis pro Stück) bei prop; Gesamtwert 12 bei antiprop.
  When  Die Wertetabelle wird gezeichnet.
  Then  prop: y = x * k (Zeile 71), Hinweis 'Immer k € pro Heft'. Antiprop: y = 12 / x (Zeile 71), Hinweis 'Immer 12 Arbeitertage' (Zeile 80).
**Parameters:** x = 1, 2, 3, 4 (Zeile 70); Gesamtwert 12 fest (Zeile 70); k Standard 3 (Zeile 69).
**Edge cases handled:** Jede andere Art als 'prop' wird als antiproportional gezeichnet (Zeile 71-72).; Der Gesamtwert 12 ist fest und nicht aus einer Aufgabe übernommen (Zeile 70).
**Confidence:** High

### RULE-056: Datendiagramm: Median, Mittelwert, Spannweite
**Category:** Calculation
**Priority:** P1
**Source:** `apps/mathe/diagrams.js:94-107`
**Plain English:** Das Diagramm zeigt die sortierten Werte mit Median, Mittelwert und Spannweite. Der Median ist der mittlere Wert (bei ungerader Anzahl).
**Specification:**
  Given Eine Liste von Werten xs (Standard 3, 9, 4, 4, 7), n Werte.
  When  Das Datendiagramm wird gezeichnet.
  Then  Sortiert. Median-Position mid = (n - 1)/2 wird hervorgehoben (Zeile 96, 100). Mittelwert = Summe / n (Zeile 103). Spannweite = größter minus kleinster Wert (Zeile 105).
**Parameters:** Standard-Liste (Zeile 95).
**Edge cases handled:** Bei gerader Anzahl ist mid eine halbe Zahl: kein Wert wird hervorgehoben, und die Beschriftung 'Median undefined' steht in der Bildbeschreibung (Zeile 106, s[1.5]).; Der Mittelwert wird nicht gerundet, nur auf 3 Stellen angezeigt (fmt).
**Suspected defect:** Bei gerader Anzahl von Werten ist der Median nicht berechnet (mid = 1,5). Die Anzeige hat keinen hervorgehobenen Wert und die Beschriftung lautet 'Median undefined'.
**Confidence:** Medium — Kommen in den Lektionen Datenreihen mit gerader Anzahl Werte vor? Wenn ja, soll der Median dort als Mittel der beiden mittleren Werte gezeigt werden?

### RULE-057: Trophaeen-Auswertung nach jeder Runde
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/appconfig.js:50`
**Plain English:** Jede Trophaee wird ueber ihre Regel gegen den Spielstand, das Rundenergebnis und die Seitenliste geprueft. Die Konfiguration gibt dafuer nur eine Pruefungsfunktion weiter.
**Specification:**
  Given Eine Trophaee mit einer Regel und ein Spielstand sowie das Ergebnis der gerade beendeten Runde.
  When  Die Shell ruft badge.when(state, result) auf.
  Then  Der Aufruf liefert wahr oder falsch, je nachdem, ob die Regel erfuellt ist. Die Auswertung nutzt manifest.units als Seitenliste.
**Edge cases handled:** Ein Ergebnis ohne Werte wird als leeres Objekt behandelt.; Ein unbekannter Regeltyp wuerde hier einen Fehler werfen, kann aber nicht ankommen, weil die Paketpruefung ihn schon abweist (validate.js:42).; Die einzelnen Regeltypen (Seite, Kombo, Blitz, Serie und so weiter) liegen in core/js/rules.js und sind nicht Teil dieser Liste.
**Confidence:** High

### RULE-058: Blitz scoring: XP, combo and score
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/blitz.js:41-49`
**Plain English:** In the blitz each correct answer earns 5 XP times the combo multiplier and is saved at once; a wrong answer resets the combo and gives no XP and no penalty beyond that.
**Specification:**
  Given A blitz with combo 2 before the answer.
  When  The player answers correctly, then (later) wrongly.
  Then  Correct: combo becomes 3, best combo updated, amount = 5 x multiplier(3) = 5 x 2 = 10 XP, XP added to the profile and saved at once, score +1. Wrong: combo reset to 0, no XP.
**Parameters:** Base = 5 XP (blitz.js:43). Multiplier as in core/js/profile.js:73. Pause after an answer: 280 ms after a correct answer, 900 ms after a wrong one, during which further answers are locked (blitz.js:34-36, 50).
**Edge cases handled:** There is no nearly-correct level in the blitz (only choice questions, strict id equality).; Digit keys 1 to 9 select options during the blitz (blitz.js:72).; Score counts correct answers only; XP and score are different numbers.
**Confidence:** High

### RULE-059: Ausweichzahlen für Multiple-Choice nahe der richtigen Zahl
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/mathkit.js:24-28`
**Plain English:** Zu einer richtigen Zahl werden bis zu drei falsche Zahlen in der Nähe erzeugt, ohne die richtige und ohne Doppelte. Vorgegebene Ausweichzahlen haben Vorrang.
**Specification:**
  Given Richtige Antwort 12 ohne Vorgaben.
  When  nearby(12) wird aufgerufen.
  Then  Es entstehen bis zu drei Falschantworten, die sich von der richtigen unterscheiden.
**Parameters:** Abstände [+1, −1, +2, −2, +10, −10, +3] (mathkit.js:26). Anzahl 3 (mathkit.js:26-27). Vorgaben gehen zuerst, nur endliche Werte, die nicht die richtige Zahl sind (mathkit.js:25).
**Edge cases handled:** Bei mehr als drei Vorgaben bleiben die ersten drei in ihrer Reihenfolge, der Rest fällt weg (mathkit.js:27), ohne Mischen.; Mit Vorgaben [12, 20, 20, 7] fallen 12 weg und 20 wird nur einmal genommen. Dann kommt eine Zufallszahl aus der Abstandsliste dazu.; Bei sehr großen Antworten (über 2^53) ändern die Abstände den Wert nicht. Dann kommen weniger als drei Ausweichzahlen zurück.; Ausweichzahlen können negativ oder null sein: Antwort 1 ergibt −1, Antwort 2 ergibt 0.; Bei dezimaler Antwort sind die Ausweichzahlen ebenfalls dezimal.; Das Ergebnis ist bei gleicher Eingabe nicht immer gleich (Zufall, mathkit.js:26).
**Confidence:** Medium — Sollen Ausweichzahlen auch negativ oder null sein dürfen, wenn die Aufgabe nur positive Größen wie Längen oder Preise kennt?

### RULE-060: Bruch wird auf die kleinstmögliche Form gekürzt
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/mathkit.js:30-35`
**Plain English:** Ein Bruch wird mit dem größten gemeinsamen Teiler gekürzt. Ganze Zahlen werden ohne Nenner geschrieben.
**Specification:**
  Given frac(2, 6).
  When  Die Anzeige wird gebildet.
  Then  Die gekürzte Form wird als Text ausgegeben.
**Parameters:** Größter gemeinsamer Teiler nach Euklid, rekursiv (mathkit.js:30). Das Ergebnis des ggT ist positiv (Betrag, mathkit.js:30). Ein Nenner von 1 wird weggelassen (mathkit.js:34).
**Edge cases handled:** frac(−4, 6) ergibt „−2/3“, das Vorzeichen steht im Zähler.; frac(4, −6) ergibt „2/−3“. Das Vorzeichen steht im Nenner, es wird nicht normalisiert.; frac(0, 0) ergibt „NaN/NaN“.; frac(3, 0) ergibt „1/0“.; Die Kürzung ändert nur die Darstellung. Die Prüfung läuft über probCheck und vergleicht den Wert, nicht die Form.
**Suspected defect:** Negative Nenner werden nicht normalisiert (frac(4, −6) ergibt „2/−3“), und Null im Nenner oder im Zähler-Nenner-Paar führt zu NaN bzw. 1/0 ohne Schutz (mathkit.js:32-34).
**Confidence:** High

### RULE-061: Level-Schwelle aus gesammelten XP
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/profile.js:28-34`
**Also cited:** core/js/profile.js:28-35
**Plain English:** A player reaches level n once total XP reaches 30 × n × (n − 1); level 1 starts at zero.
**Specification:**
  Given A total XP value.
  When  The level is looked up from XP.
  Then  lvlAt(2) = 60. levelOf(0) = 1, levelOf(59) = 1, levelOf(60) = 2, levelOf(180) = 3.
**Parameters:** Threshold formula 30 × n × (n − 1). Level 2 at 60 XP, level 3 at 180 XP.
**Edge cases handled:** Exact boundary values belong to the higher level.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/profile.test.js:5-11) are a node:test assertion block. They check the behavior but do not implement it. The executable logic is in core/js/profile.js:29-34: lvlAt(n) = 30 * n * (n - 1) (line 29), and levelOf(xp) starts at n=1 and increments while xp >= lvlAt(n+1) (lines 30-34). I checked the values by hand against that code. lvlAt(2)=60, l…

### RULE-062: XP-Gutschrift: Profil, App, Tagesziel und Level-Aufstieg
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/profile.js:53-65`
**Also cited:** core/js/profile.js:53-65
**Plain English:** Awarding XP adds the amount to the player profile, the app's own XP and today's XP total, and reports whether a level was crossed and whether today's daily goal was reached.
**Specification:**
  Given A profile, an app record and an XP amount on a given day (for example 25 then 40 on 2026-10-25).
  When  XP is awarded.
  Then  After 25 XP: no level-up, goal not reached. After another 40 (total 65): levelUp = 2 and goalHit = true. profile.xp = 65, app.xp = 65, today's daily XP = 65, the next day's daily XP = 0.
**Parameters:** GOAL (daily goal in XP): constant imported from core/js/profile.js; its numeric value is not visible in this test file. Project documentation states 30, not verified here.
**Edge cases handled:** The daily total is kept per calendar day, so XP from a previous day does not count toward the goal.
**Confidence:** Medium — Citation was corrected by referee (The cited test (tests/profile.test.js:13-24) only asserts the XP-award behavior; it does not implement it. The executable logic is addXP in core/js/profile.js:53-65. That function does what the rule says: it adds the amount to profile.xp and app.xp (lines 56-57), resets profile.day when the date differs and adds the amount to today's XP (lines 58-59), computes l…

### RULE-063: Combo-Faktor bis ×4
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/profile.js:73`
**Plain English:** Consecutive correct answers raise the XP multiplier in steps up to a cap of ×4.
**Specification:**
  Given A combo count (consecutive correct answers).
  When  The multiplier for the combo is looked up.
  Then  combo 0 → ×1, 2 → ×1, 3 → ×2, 6 → ×3, 9 → ×4, 30 → ×4 (the cap).
**Parameters:** Cap ×4. Steps at 3, 6 and 9 in the sample.
**Edge cases handled:** Cap applies from 9 on.
**Confidence:** Medium — Which multiplier applies at combo counts 4, 5, 7 and 8, which the test does not assert? The sample values fit min(4, 1 + floor(combo ÷ 3)), but is that the intended rule?

### RULE-064: Stars are awarded from the accuracy of a finished round
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/profile.js:76`
**Also cited:** (starsFor), called from core/js/rounds.js:11; legacy/modulare/core/js/profile.js:76
**Plain English:** A finished lesson round earns 3 stars at 90 % accuracy or better, 2 stars at 70 % or better, and 1 star otherwise. A failed round earns 0 stars.
**Specification:**
  Given A lesson round on the unit 'etre' with accuracy 1.0 (8 of 8 correct), and a failed lesson round on 'aller' with accuracy 0.4.
  When  The round is finalised.
  Then  The first round has 3 stars. The failed round has 0 stars.
**Parameters:** Thresholds in core/js/profile.js:76: accuracy >= 0.9 gives 3, >= 0.7 gives 2, else 1; failed gives 0. Blitz rounds always get 0 stars (core/js/rounds.js:11).
**Edge cases handled:** The boundary values 0.9 and 0.7 themselves count as the higher star level (>= comparison).; The 2-star and 1-star levels are not asserted by the listed test; only 3 stars and 0 stars are.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/rounds.test.js:20-23) are a unit test, not the implementation. Line 22 asserts 'result.stars === 3' for a lesson round on 'etre' with accuracy 1.0, which matches the 3-star case of the spec, but a test only verifies behavior and does not produce it. The executable rule is elsewhere: legacy/modulare/core/js/profile.js:76 'st…

### RULE-065: Matching question grading
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/qtypes.js:168-181`
**Plain English:** In a matching question the player picks a left item and then its right partner; a correct pair is locked, a wrong pair costs a heart on the first mistake and is shown with a shake. The question is 'ok' only if all pairs were found without any mistake, and 'almost' if there was at least one mistake.
**Specification:**
  Given A matching question with 3 pairs; the player picks left 'Hund', then right with value 'Hund' (correct), then left 'Katze' and right 'Vogel' (wrong).
  When  All pairs are found, after one mistake.
  Then  The wrong pairing: slips +1, the right item shakes, the left selection is cleared, combo reset to 0 and one heart lost (first slip only). When all 3 pairs are locked: settle('almost') because slips > 0, which pays 5 XP.
**Parameters:** Pair is correct when leftValues[selected left] equals right[j].value (qtypes.js:171). Completion grade: 'ok' if no slips, else 'almost' (qtypes.js:173).
**Edge cases handled:** A locked left item cannot be selected again (qtypes.js:165); a right item needs a selected left item first (qtypes.js:170).; Running out of hearts on a match ends the question with bad feedback without the settle call (qtypes.js:178).; Matching questions are never re-asked (see the second-attempt rule).
**Confidence:** High

### RULE-066: Second attempt scoring
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/quiz.js:113-121`
**Plain English:** A re-asked question pays a flat 5 XP when answered right or nearly right, and nothing when wrong; it does not affect accuracy, hearts or the combo.
**Specification:**
  Given A re-asked question with the combo at 4 and 3 hearts left.
  When  The player answers it correctly, or nearly correctly, or wrong.
  Then  ok or almost: 5 XP, relearned counter +1, feedback 'Diesmal sitzt es!'. bad: 0 XP, feedback shows the solution. Combo, hearts, correct, almost and wrong counters stay unchanged.
**Parameters:** Retry XP = 5 flat, no multiplier (quiz.js:115).
**Edge cases handled:** A nearly correct retry is shown with the positive feedback (kind 'ok' is used when the amount is non-zero, quiz.js:117).; The retry XP does not depend on the combo multiplier.; A wrong retry does not reset the combo and does not cost a heart.
**Confidence:** High

### RULE-067: Genauigkeit zählt nur Erstversuche
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/quiz.js:113-121`
**Also cited:** and core/js/quiz.js:149
**Plain English:** Die Genauigkeit einer Runde ist der Anteil der richtigen Erstantworten. Die Wiederholung einer falschen Frage verbessert die Genauigkeit nicht.
**Specification:**
  Given Eine Runde mit 3 Fragen: eine falsch im Erstversuch, zwei richtig. Die falsche Frage wird wiederholt und dort richtig beantwortet.
  When  Das Rundenergebnis wird berechnet.
  Then  accuracy = richtige Erstversuche / Anzahl Fragen = 2 / 3 (ca. 0,6667). Die Wiederholung zählt nicht.
**Parameters:** Formel: correct / total (Erstversuche). Toleranz im Test: 1e-9 (line 166).
**Edge cases handled:** Die Wiederholung erhöht correct nicht (line 165: correct 2, nicht 3).; relearned zählt die erfolgreichen Wiederholungen getrennt (line 165).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (scripts/smoke.mjs:165-166) are a test assertion that checks Math.abs(result.accuracy - 2/3) < 1e-9. They verify the behavior but do not implement it. The behavior is implemented in legacy/modulare/core/js/quiz.js. In settle() (lines 113-121), a retry (q.retry) only increments run.relearned and grants 5 XP. It returns before the run.correct++ at…

### RULE-068: Points per answer in a quiz round (combo multiplier)
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/quiz.js:122-128`
**Plain English:** A correct answer earns 10 XP times the combo multiplier, a nearly correct answer earns a flat 5 XP, and a wrong answer earns nothing and resets the combo.
**Specification:**
  Given A quiz round in progress; the combo counter holds the number of correct answers in a row (starts at 0 each round).
  When  The player's answer is graded as ok, almost or bad (a retry is excluded, see the second-attempt rules).
  Then  ok: combo +1, correct +1, XP = 10 x multiplier(new combo). almost: almost +1, XP = 5, combo unchanged. bad: wrong +1, combo reset to 0, 0 XP.
**Parameters:** Base XP for ok = 10 (quiz.js:124). XP for almost = 5 (quiz.js:126). multiplier(combo) = min(4, floor(combo/3) + 1) from core/js/profile.js:73 (resolved reference): combo 1-2 gives x1 (10 XP), 3-5 gives x2 (20 XP), 6-8 gives x3 (30 XP), 9 and up gives x4 (40 XP, cap).
**Edge cases handled:** The third correct answer in a row is the first to get the x2 multiplier, because the combo is incremented before the multiplier is read.; An almost answer neither increments nor resets the combo.; On a match question the first wrong pairing resets the combo to 0 immediately (core/js/qtypes.js:177), even if the question later settles as almost.; The combo counter is per round; a new round starts at combo 0 (core/js/quiz.js:29).; The combo label is only shown from combo 3 (core/js/quiz.js:103), which is display only.
**Confidence:** High

### RULE-069: Round accuracy (Trefferquote)
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/quiz.js:147-149`
**Plain English:** Accuracy for a round is the number of correct answers plus half the number of nearly correct answers, divided by the number of original questions.
**Specification:**
  Given A round built from 10 original questions; 7 answered correctly on first try, 2 answered almost correctly, 1 answered wrong and not recovered.
  When  The round finishes (completed or failed).
  Then  accuracy = (7 + 0.5 x 2) / 10 = 0.80 (80 %). This value is passed to onFinish and is the basis for the star rating (starsFor in core/js/profile.js:76, resolved reference).
**Parameters:** Weight for almost = 0.5 (quiz.js:149). Denominator = baseCount, the number of questions the round started with (quiz.js:68 and 148). Star thresholds used downstream: 90 % = 3 stars, 70 % = 2 stars, otherwise 1 star, 0 stars if failed (profile.js:76, resolved reference).
**Edge cases handled:** Re-asked (retry) questions never add to the numerator, so a question answered wrong and then right on the second attempt contributes 0.; The denominator is always the original question count, so a round that ends early through lost hearts is scored with the unanswered questions counted as misses.; Accuracy is still computed for failed rounds, but the star rating is 0 for them.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance lens: a regulator, auditor or finance controller would not care if this formula changed silently. The app is a children's learning game with no money, no legal or regulatory duty, and no safety or third-party data-integrity effect. The only consequences are the displayed "% richtig" (resu…

### RULE-070: Hint (Spickzettel) costs 3 XP once per question
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/quiz.js:168-180`
**Plain English:** Opening the hint card costs 3 XP, charged only the first time the hint is opened for a question; closing and reopening is free. Hints can only be opened before answering.
**Specification:**
  Given A question with a hint, not yet answered, with the hint not yet opened, and 100 XP in the profile.
  When  The player opens the hint for the first time.
  Then  3 XP are removed from the profile and the app (spendXP, quiz.js:172) and from the round XP, which is floored at 0 (quiz.js:173). The hint opens. Closing and opening again charges nothing.
**Parameters:** Cost = 3 XP (quiz.js:172). The button label states '(-3 XP)' (quiz.js:99). Floor at 0 for profile and app XP (core/js/profile.js:69-70, resolved reference).
**Edge cases handled:** Only allowed in state ask; after an answer the hint can no longer be opened (quiz.js:169).; The charge flag is reset for each question instance (quiz.js:77), so a re-asked question is charged again the first time its hint is opened.; If XP is already 0, the balance stays at 0.
**Confidence:** High

### RULE-071: Boss round reward: 50 bonus XP and a trophy only when won
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/rounds.js:33-35`
**Also cited:** core/js/rules.js:23, core/js/profile.js:53-56
**Plain English:** Winning the end boss gives 50 bonus XP and the 'Le Grand Défi' trophy. Losing the boss gives no bonus and no trophy.
**Specification:**
  Given A boss round with accuracy 0.9, not failed, and a boss round with accuracy 0.3, failed.
  When  Each boss round is finalised, starting from 0 XP.
  Then  Won: bonus is 50, profile XP is 50, and 'boss' is in the new trophies. Lost: bonus is 0 and 'boss' is not in the new trophies.
**Parameters:** Bonus 50 at core/js/rounds.js:33-35. Trophy rule core/js/rules.js:23 (boss mode and not failed).
**Edge cases handled:** finalizeRound adds only the 50 bonus to profile XP (profile XP becomes 50, not 50 plus the round's base 80). The base XP must be added elsewhere, outside this file set.; A boss round does not change per-unit stars (core/js/rounds.js:33-39), which the listed test does not assert.
**Confidence:** Medium — Citation was corrected by referee (The behavior is implemented in executable code, but the cited location (tests/rounds.test.js:48-56) is a unit test that asserts the behavior, not the implementation. The implementation is at core/js/rounds.js:33-35: when result.mode === 'boss' and !result.failed, result.bonus += 50 and addXP(profile, app, 50, day) run (addXP at core/js/profile.js:53-56 adds the…

### RULE-072: Level thresholds and XP progress bar
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/shell.js:52-54`
**Plain English:** Total XP maps to a level, and the header bar shows how far the player is between the current level and the next one.
**Specification:**
  Given profile.xp, the total XP across apps.
  When  The header is rendered (every screen, and after each change).
  Then  level = highest n with xp >= T(n), where T(n) = 30 * n * (n - 1) (core/js/profile.js:29-33). Bar percent = round((xp - T(n)) / (T(n+1) - T(n)) * 100). Shown as 'Niveau n' and 'xp XP'. The level title from TITLES is used as tooltip (core/js/profile.js:35).
**Parameters:** T(n) = 30*n*(n-1): level 2 starts at 60 XP, level 3 at 180, level 4 at 360, level 5 at 600. Level titles: Neuling, Entdecker, Könner, Profi, Meister, Expert, Legende (core/js/profile.js:9). Levels beyond 7 reuse the last title.
**Edge cases handled:** Example: 90 XP gives Niveau 2 with a bar at 25 percent.; The level-up line appears on the result screen only when rounds.js sets levelUp (core/js/views/result.js:10-10).
**Confidence:** High

### RULE-073: Practice streak with one grace day
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/shell.js:57-57`
**Plain English:** The day streak shown in the header survives one skipped day; after two skipped days it shows zero.
**Specification:**
  Given profile.lastDay (date of last practice) and profile.streak.
  When  The header is drawn.
  Then  Shown value = profile.streak if the day difference between lastDay and today is at most 2, otherwise 0 (core/js/profile.js:40-41). The stored streak is not reset here; it is reset on the next practice (touchStreak, core/js/profile.js:44-46, outside the listed files).
**Parameters:** Grace rule: difference <= 2 days (one missed day allowed). No practice ever (lastDay empty) gives 0.
**Edge cases handled:** Practice yesterday (difference 1) or the day before yesterday (difference 2): streak shown.; Difference 3 or more: 0 shown although the stored value remains until the next practice.
**Confidence:** High

### RULE-074: Daily XP goal of 30 XP
**Category:** Calculation
**Priority:** P1
**Source:** `core/js/views/home.js:23-23`
**Plain English:** Each calendar day has a goal of 30 XP. Progress toward it is shown capped at 100 percent, and the app celebrates once the goal is reached.
**Specification:**
  Given profile.day holds today's date and the XP earned today.
  When  The home screen or the result screen is shown.
  Then  Today's XP equals profile.day.xp if profile.day.d is today, otherwise 0 (core/js/profile.js:37). Ring ratio = min(1, xp / 30). Ring label shows min(xp, 30) of 30. At xp >= 30 the text is 'Geschafft. Du bist heute fertig.', otherwise 'Eine kurze Runde bringt dich nah ran.' (core/js/views/home.js:56-57). Result screen shows 'Tagesziel geschafft!' or 'Tagesziel: noch (30 - xp) XP' with a bar of min(100, xp / 30 * 100) percent (core/js/views/result.js:31-33).
**Parameters:** GOAL = 30 XP (core/js/profile.js:5). Day = local calendar date (core/js/profile.js:22-23).
**Edge cases handled:** On a new day the daily XP shows 0 while total XP is kept.; Motivation line (core/js/views/home.js:11-16): 0 XP gives a random encouraging line; 1 to 29 XP gives 'Noch N XP bis zum Tagesziel'; 30 or more gives 'Tagesziel geschafft. Alles ab jetzt ist Bonus.'
**Confidence:** High

### RULE-075: Unit completion and per-app progress percentage
**Category:** Calculation
**Priority:** P1
**Source:** `dashboard.js:19`
**Also cited:** legacy/modulare/dashboard.js:19 (doneUnits: counts stars > 0) and legacy/modulare/dashboard.js:51 (tile label "N von <app.units> Seiten")
**Plain English:** A page counts as done as soon as it has at least one star; the app's progress is the share of its pages that are done, shown as a percentage bar.
**Specification:**
  Given A live app's saved star map (stars, keyed by page id, values 0 to 3) and its page count units from registry.js.
  When  A tile or the 'Weiter' card is drawn.
  Then  done = number of entries in stars whose value is greater than 0. Percentage = Math.round(done / units x 100); the bar width is set to that percentage (dashboard.js:50, 52). The text reads 'done von units Seiten'.
**Parameters:** units per app: see registry rule on hand-maintained page counts. Star thresholds that award stars (70 % and 90 %) are not in these files.
**Edge cases handled:** Entries with 0 stars do not count.; 9 of 9 pages gives 100 %; 4 of 9 gives 44 %.; units = 0 would give NaN (no guard).; If stars holds ids of pages no longer in the registry, done can exceed units and the percentage is not capped above 100.; Math.round rounds .5 upward.; Soon apps have no bar and no count.
**Suspected defect:** Percentage is not capped at 100 and done is not filtered against the current page list (dashboard.js:19, 50), so a stale star entry can make the bar overflow.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/scripts/smoke.mjs:177-180) are a smoke-test harness. They seed localStorage with stars {ids[0]:3, ids[1]:1} and assert that the first app's tile label includes '2 von '+ids.length. They do not compute the progress label. The behavior is implemented in legacy/modulare/dashboard.js. Line 19 (doneUnits) counts entries in state.stars…

### RULE-076: Daily goal ring and status message
**Category:** Calculation
**Priority:** P1
**Source:** `dashboard.js:24-30`
**Plain English:** The home-screen ring shows how far today's XP has come toward the 30 XP daily goal, and a sentence under the greeting says whether the goal is reached or how much is still missing.
**Specification:**
  Given Today's XP x (from dailyXP(profile)) and the daily goal GOAL = 30 XP.
  When  The dashboard draws the hero section.
  Then  Fill ratio = min(1, x / 30). Ring circumference C = 2 x pi x 32 (about 201.1), stroke dash offset = C x (1 - ratio). Centre label shows min(x, 30) with '/ 30'. Message: if x >= 30 'Tagesziel geschafft. Alles ab jetzt ist Bonus.'; if x = 0 'Welche App heute? Fuenf Minuten reichen schon.'; otherwise 'Noch (30 - x) XP bis zum Tagesziel.'
**Parameters:** GOAL = 30 XP (core/js/profile.js:5, read via grep). Ring radius 32, viewBox 76 (dashboard.js:30). Message texts dashboard.js:25-26. dailyXP() and streakNow() are defined in core/js/profile.js and were not read.
**Edge cases handled:** x = 12: ratio 0.40, centre '12 / 30', message 'Noch 18 XP bis zum Tagesziel.'; x = 45: ratio capped at 1, centre '30 / 30', goal message; the surplus is not shown in the ring.; x = 0: empty ring and the special 'Welche App heute?' message.; Greeting uses profile.name: 'Hallo, <name>!' if set, else 'Hallo!' (dashboard.js:28). Display only.; No guard for negative x; the code assumes dailyXP returns a non-negative number.
**Confidence:** High

### RULE-077: Auswahlantworten: richtige Form plus falsche Formen desselben Verbs
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:21-26`
**Plain English:** Bei einer Auswahlaufgabe stehen die richtige Form und drei falsche Antworten zur Wahl. Die falschen Antworten sind zuerst die typische Fehlform für diese Person, danach die anderen Formen desselben Verbs in zufälliger Reihenfolge.
**Specification:**
  Given Ein Verb, eine Personen-Nummer p und die Anzahl gewünschter Falschantworten.
  When  Eine Auswahlaufgabe wird gebaut (Lücke oder Satz).
  Then  Die falschen Antworten sind: erste Fehlform aus TRAP für Verb und Person (falls vorhanden), dann die übrigen unterschiedlichen Formen des Verbs ohne die richtige, zufällig gemischt. Doppelte werden entfernt, die Liste wird auf die gewünschte Anzahl gekürzt. Danach wird die richtige Form mit den falschen gemischt (builders.js:43).
**Parameters:** Lückenfrage: 3 Falschantworten. Satzfrage: 2 Falschantworten. TRAP[verb][person] liefert höchstens 1 Fehlform.
**Edge cases handled:** Lückenfrage: 1 richtige plus 3 falsche = 4 Optionen (builders.js:43). Satzfrage: 1 plus 2 = 3 Optionen (builders.js:57).; Hat ein Verb weniger verschiedene Formen, gibt es weniger Optionen. Bei -re-Verben fallen gleiche Formen (z. B. je und tu) weg.; Vermutlicher Fehler: Die erste Fehlform aus TRAP wird nicht gegen die richtige Form geprüft (builders.js:25). Steht die richtige Form in TRAP, erscheint sie doppelt als Option, und die Aufgabe hat zw…
**Suspected defect:** builders.js:25: TRAP-Eintrag wird nicht gegen answer geprüft. Ob die Daten das je enthalten, ist in data.json zu prüfen.
**Confidence:** High

### RULE-078: Konjugation: Stamm plus Endung je Verbgruppe
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/model.js:31-35`
**Plain English:** Die sechs Präsensformen eines regelmäßigen Verbs entstehen, indem man die Endungen seiner Gruppe (-er, -ir, -re) an den Stamm hängt. Verben mit einer festen Formenliste gelten als unregelmäßig und werden so übernommen.
**Specification:**
  Given Ein Verb aus data.json mit einer Gruppe (er, ir oder re) und einem Stamm, oder ein Verb mit einer vollständigen Liste von sechs Formen.
  When  logic.init() läuft, bevor die erste Runde gebaut wird.
  Then  Bei regelmäßigen Verben gilt ends = Endungen der Gruppe und forms[i] = stem + ends[i] in der Reihenfolge je, tu, il, nous, vous, ils. Bei Verben mit forms gilt irr = true und die Formen werden unverändert verwendet. Fehlt die Infinitivform, wird der Schlüssel des Verbs eingesetzt (model.js:33).
**Parameters:** Sechs Personen in fester Reihenfolge (Index 0 bis 5 = je, tu, il, nous, vous, ils). Endungen je Gruppe kommen aus data.endings.er / .ir / .re (nicht in den gelesenen Dateien).
**Edge cases handled:** Ist eine Endung leer, entspricht die Form dem Stamm. Die Endungsaufgabe schließt solche Personen aus (siehe Regel zur Personenauswahl).; Der Hinweistext für -ir-Verben nennt im Plural ein -iss- (builders.js:14). Ob diese Endungen in data.endings.ir tatsächlich -iss- enthalten, steht in data.json, nicht in den gelesenen Dateien. Dort p…; Hat ein Verb sowohl forms als auch eine Gruppe, gewinnt forms; ends bleibt dann undefiniert.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Geprüft: legacy/modulare/apps/franzoesisch-verben/model.js:31-35. Die Mechanik stimmt mit der Regel überein: Zeile 33 setzt den Infinitiv auf den Schlüssel, wenn er fehlt. Zeile 34 setzt irr nur bei vorhandenen forms. Zeile 35 setzt ends = GE[v.group] und forms = stem + ends. Die Endungen kommen aus…

### RULE-079: Base angle of an isosceles triangle = (180° − apex angle) ÷ 2
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/geometrie/builders.js:123-126`
**Also cited:** (gleichschenklig generator; registered at builders.js:222 as POOLS.winkel[3]); apps/geometrie/builders.js:123-127
**Plain English:** In an isosceles triangle, each base angle is half of the difference between 180 degrees and the apex angle.
**Specification:**
  Given A generated task with apex angle 'Winkel N°' in the prompt.
  When  The task is generated 300 times.
  Then  Answer = (180 − N) ÷ 2.
**Parameters:** Triangle angle sum 180°.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/geometrie.test.js:51-53) are a test assertion, not the implementation. They check that the answer equals (180 - top) / 2 for a prompt apex angle, which matches the rule's formula, but the behavior itself is produced by the generator. That generator is gleichschenklig() in legacy/modulare/apps/geometrie/builders.js:123-126,…

### RULE-080: Apex angle of an isosceles triangle = 180° − 2 × base angle (two problem types)
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/geometrie/builders.js:193-197`
**Also cited:** (thalesMitte: prompt 'misst', answer 180 - 2a) and legacy/modulare/apps/geometrie/builders.js:210-214 (winkelKette: prompt 'von', answer 180 - 2a); pool wiring at legacy/modulare/apps/geometrie/builders.js:226
**Plain English:** In an isosceles triangle with a known base angle, the apex angle is 180 degrees minus twice that base angle; this applies to the 'mitte' problem (number after 'misst') and the 'kette' problem (number after 'von').
**Specification:**
  Given A 'mitte' problem with 'misst N' in the prompt and a 'kette' problem with 'von N' in the prompt.
  When  The problems are generated 300 times.
  Then  Answer = 180 − 2 × N in both cases.
**Parameters:** Factor 2 for two equal angles; sum 180°.
**Confidence:** Medium — Are the numbers after 'misst' (mitte) and 'von' (kette) always base angles of isosceles triangles, so that the answer is the apex angle? Please confirm the wording of both prompt templates.

### RULE-081: Circumcenter and incircle are equidistant; point on a circle uses screen coordinates
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/geometrie/geom.js:7`
**Also cited:** (at), legacy/modulare/apps/geometrie/geom.js:27-32 (circumcenter), legacy/modulare/apps/geometrie/geom.js:34-39 (incircle). Absolute path: /Users/dghaies/Sites/lernapp-sira/legacy/modulare/apps/geometrie/geom.js
**Plain English:** The circumcenter of a triangle is equally far from its three corners, the incircle touches all three sides at the same distance, and a point at angle θ on a circle is placed with the y-axis pointing down.
**Specification:**
  Given Random triangles with corners in 0 to 300, and a fixed triangle A(30,220), B(220,200), C(90,50). Also a circle at (0,0) with radius 10.
  When  circumcenter(A,B,C), incircle(A,B,C) and at(0,0,10,90) are computed.
  Then  Distances from the circumcenter to A, B and C agree within 1e-6. The distance from the incenter to each side equals r within 1e-6. at(0,0,10,90) returns x ≈ 0 and y ≈ −10.
**Parameters:** Tolerance 1e-6. Random coordinates range 0 to 300. Degenerate skip: triangles with |cross product| < 500 are skipped (tests/geometrie.test.js:14-15).
**Edge cases handled:** Near-degenerate (almost straight) triangles are skipped in the random test, so the circumcenter is not checked there.; at() uses y = cy − r·sin(angle): positive angles go up on screen.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/geometrie.test.js:11-31) are tests. They assert the behavior but do not implement it. The executable logic is in legacy/modulare/apps/geometrie/geom.js, which the tests import. I verified that code against the rule: - geom.js:7 'at' returns [cx + r*cos(θ), cy − r*sin(θ)], the screen-coordinate (y-down) convention. at(0,0,10…

### RULE-082: Binär-Addition und Hex-zu-Dezimal-Aufgaben haben die richtige Lösung
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/informatik/builders.js:140-150`
**Also cited:** (addQ) und legacy/modulare/apps/informatik/builders.js:163-177 (hexToDecQ); Hilfsfunktionen legacy/modulare/apps/informatik/numbers.js:7-8 (toBin, toHex) und numbers.js:95 (mono)
**Plain English:** Every generated binary addition question has the correct binary sum as its answer, and every hex-to-decimal question has the correct decimal answer.
**Specification:**
  Given 300 generated 'hard' binary addition questions and hex-to-decimal questions.
  When  The question generator (addQ, hexToDecQ) builds a question.
  Then  The two binary numbers in the prompt, a and c, satisfy: the answer equals the binary form of a + c. For a type-question, the hex number shown in the prompt (inside class 'mono') converts to the stated decimal answer.
**Edge cases handled:** Only the 'hard' difficulty is tested in this file.
**Confidence:** Medium — Citation was corrected by referee (Die zitierten Zeilen tests/informatik.test.js:64-72 sind ein Test, der die Regel prüft, aber sie implementieren sie nicht. Die Regel selbst steckt in den Generatoren: addQ (apps/informatik/builders.js:140-150) setzt answer = toBin(a + b) (numbers.js:7) und die Aufgabe nennt a und b als toBin(a), toBin(b); das passt zur Regel. hexToDecQ (builders.js:163-177) erze…

### RULE-083: Binär- und Hex-Umrechnung, Stellenwerte, Schrittfolge bis 255
**Category:** Calculation
**Priority:** P1
**Source:** `legacy/modulare/apps/informatik/numbers.js:3-39`
**Plain English:** Numbers are converted between decimal, binary and hexadecimal, and a decimal number is split into 8-bit steps whose bits add back up to the same number.
**Specification:**
  Given A decimal number n between 0 and 255 (for example 13 or 255), or a place-value number such as 352.
  When  The number is converted to binary or hex, decomposed into place values, or decomposed into 8-bit steps.
  Then  toBin(13) is '1101'; toHex(255) is 'FF'; HEX[10] is 'A'; placeSum(352) is '3×100 + 5×10 + 2×1'; placeSum(0) is '0'; onesWeights('1011') is [8, 2, 1]; for every n from 0 to 255 the step bits read as binary give back n (n = 0 gives an empty bit string, read as '0').
**Parameters:** Range 0 to 255 (8 bit). Hex digits 0-9 and A-F.
**Edge cases handled:** n = 0 produces no set bits and is read as '0'.; Binary weights are powers of two in the order of the digit positions (8, 2, 1 for '1011').
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/informatik.test.js:11-28) are node:test assertions. They check the behavior but do not implement it. The executable logic is in apps/informatik/numbers.js. There, toBin and toHex are at lines 6-7 (HEX at line 4), placeSum at 14-18, onesWeights at 21-24, and decToBinSteps at 27-39. Those functions produce the specified results: toBin(13) gi…

### RULE-084: Vorzeichenrechnung und lineare Gleichungen haben korrekte Lösungen
**Category:** Calculation
**Priority:** P1
**Source:** `tests/mathe.test.js:56-71`
**Plain English:** Generated signed-number sums and differences and one-variable linear equations carry the mathematically correct answer.
**Specification:**
  Given 300 generated signed arithmetic items (pool 'vorzeichen') and 300 linear equations (pool 'gleichungen').
  When  An item is generated and its answer is recomputed independently from the prompt.
  Then  For 'a + b' or 'a − b' (second operand may be in parentheses) the answer equals a + b or a − b. For an equation 'N x' optionally followed by '+ b' or '− b' and '= r', the answer x satisfies N·x + b = r (b = 0 when absent).
**Parameters:** Minus sign may be Unicode '−' or ASCII '-'. Decimal comma is accepted in answers.
**Edge cases handled:** Negative second operand is shown in parentheses.; Equation form is 'N x ± b = r' with positive integers only.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Cited test (legacy/modulare/tests/mathe.test.js:56-71) re-derives each answer from its prompt and compares numerically. The core claim holds for the templates it exercises: addSub (builders.js:20-27, pool index 0) and solve (builders.js:72-78, pool index 0). P0 fails on the compliance lens: this is…

### RULE-085: Zinsrechnung: Jahreszins, Monatszins
**Category:** Calculation
**Priority:** P1
**Source:** `tests/mathe.test.js:77-84`
**Also cited:** apps/mathe/builders.js:157-161
**Plain English:** Simple interest for a year is capital times rate divided by 100, and interest for a number of months is the yearly interest scaled by months divided by 12.
**Specification:**
  Given A capital K, a yearly rate p in percent, and optionally a number of months mo.
  When  The interest question is generated and its answer recomputed.
  Then  Yearly interest = K × p ÷ 100. Interest for months = K × p ÷ 100 × mo ÷ 12. The generated answer equals these values exactly.
**Parameters:** Divisor 100 (percent). Divisor 12 (months per year).
**Edge cases handled:** Numbers in prompts may use German thousands dots and decimal commas (parsed by the test helper nums()).; No rounding rule is visible: the test compares exact values, so generated answers are exact decimals.
**Confidence:** High

### RULE-086: Flussdiagramm: gleiche Kastenbreite, erster Schritt hervorgehoben
**Category:** Calculation
**Priority:** P2
**Source:** `apps/deutsch/diagrams.js:12-21`
**Plain English:** A process diagram spreads its steps evenly across a 500-pixel width, with the first step highlighted and arrows between boxes.
**Specification:**
  Given A list of n step texts
  When  flowDiagram is drawn
  Then  Box width = floor((500 − 36 × (n − 1)) / n), gap 36 px, box height 74 px. The first box uses the highlight style 'hi', the others 'box'. An arrow joins each box to the next. The SVG is 520 × 134 px.
**Parameters:** Total width 500, gap 36, height 74 (diagrams.js:13).
**Edge cases handled:** One step gives one 500 px box.; 14 steps give boxes about 2 px wide.; 15 or more steps give a negative width, which produces a broken SVG. No guard.
**Confidence:** High

### RULE-087: Tabellendiagramm: Spaltenbreite nach Gewicht
**Category:** Calculation
**Priority:** P2
**Source:** `apps/deutsch/diagrams.js:24-32`
**Plain English:** A table diagram splits its width by column weights; the header row is highlighted and the body rows are neutral.
**Specification:**
  Given A header list, body rows, and optional column weights
  When  tableDiagram is drawn
  Then  Each column is weight / total × 500 px wide, starting at x = 10 plus the widths before it. The header uses the 'hi' style, the body rows 'box'. Row height is 36 px with 4 px spacing. SVG height = 16 + (rows + 1) × 40.
**Parameters:** Width 500, row height 36, spacing 4 (diagrams.js:25, 31). Default weights are equal (diagrams.js:24).
**Edge cases handled:** Missing weights give equal columns.; A weight of zero gives a zero-width column.
**Confidence:** High

### RULE-088: Right-isosceles problem answer is always 45°
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/builders.js:199-202`
**Plain English:** The 'rechtGleich' problem always has the answer 45 degrees.
**Specification:**
  Given The rechtGleich problem generator.
  When  It is run 300 times.
  Then  The answer value is 45.
**Parameters:** Constant 45.
**Confidence:** Medium — Why is the answer always 45 degrees? Does the prompt always describe an isosceles right triangle, so that the base angles are 45 degrees, and is the 45 never derived from a number in the prompt?

### RULE-089: SSS-Dreieck-Bild: Ecke C aus den drei Seiten berechnet
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/diagrams.js:37-45`
**Plain English:** Im Bild wird die Ecke C so gesetzt, dass sie von A den Abstand b und von B den Abstand a hat.
**Specification:**
  Given Standard: a = 4 cm, b = 5 cm, c = 6 cm, Maßstab 40 px pro cm
  When  sssDiagram() gezeichnet wird
  Then  x = (b² − a² + c²) : (2c) = 3,75 cm (150 px) vom Punkt A, y = √(b² − x²) = 3,31 cm (132,3 px) über AB.
**Parameters:** k = 40 px pro cm, A = (80, 230), B = A + (c·k, 0). Standard a = 4, b = 5, c = 6 (cm).
**Edge cases handled:** Keine Prüfung der Dreiecksungleichung: ist b² − x² negativ, wird y = NaN und das SVG ungültig.; Der Maßstab k wird für alle Seiten gleich verwendet.
**Confidence:** High

### RULE-090: Winkelbeschriftung in den Bildern: Scheitel-/Nebenwinkel, Winkelhalbierende, Thales-Problem
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/diagrams.js:49-59`
**Plain English:** Die Bilder beschriften die Winkel aus dem Eingabewert: gegenüberliegende Winkel gleich, Nachbarwinkel ergänzen zu 180°; Winkelhalbierende zeigt die Hälfte.
**Specification:**
  Given anglesDiagram(60)
  When  Das Bild gezeichnet wird
  Then  Vier Sektoren mit α = 60° (gegenüberliegend) und β = 120° (Nachbarn). Bei bisectorDiagram(70) steht 'Winkel 70° geteilt in zweimal 35°'. Bei problemDiagram(35) stehen 35°, 35° und 110° (180° − 2·35°) am Dreieck AMC.
**Parameters:** Standardwerte: anglesDiagram α = 60°, bisectorDiagram 70°, problemDiagram 35°. Teilwinkel: deg/2, über f1 auf eine Nachkommastelle gerundet (diagrams.js:19, 29).
**Edge cases handled:** Keine Prüfung, ob α zwischen 0° und 180° liegt.; Bei ungeraden Winkeln wie 71° entsteht eine Hälfte mit Nachkommastelle (35,5°). Die Winkelhalbierende zeigt sie mit Punkt (diagrams.js:30, 32), die Maßstab-Beschriftung mit Komma (diagrams.js:97-98).
**Suspected defect:** diagrams.js:30 und :32 zeigen Teilwinkel über `${f1(h)}°` mit Dezimalpunkt, während der Rest der App Dezimalkomma verwendet (diagrams.js:97-98 ersetzt den Punkt). Nur bei halbzahligen Winkeln sichtbar (P2, Anzeige).
**Confidence:** High

### RULE-091: Mittelsenkrechte-Bild: Bögen mit Radius größer als halbe Strecke
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/diagrams.js:6-15`
**Plain English:** Im Bild schneiden sich zwei Kreisbögen mit gleichem Radius um A und B, weil der Radius größer ist als die halbe Strecke AB.
**Specification:**
  Given Standardbild: A und B 280 px auseinander, Radius 170 px
  When  perpDiagram() gezeichnet wird
  Then  Die Schnittpunkte liegen auf der Mittelsenkrechten bei y = 150 ± √(170² − 140²) ≈ 150 ± 96,4, also P ≈ (230; 53,6) und Q ≈ (230; 246,4).
**Parameters:** A = (90, 150), B = (370, 150), M = (230, 150), r = 170 px, Halbe Strecke = 140 px. Kreisbögen mit Öffnung ±14° um den Schnittwinkel.
**Edge cases handled:** Der Radius muss größer als 140 px sein, sonst schneiden sich die Bögen nicht; dies spiegelt die Regel des Zirkelradius (builders.js:46-51).
**Confidence:** High

### RULE-092: Umkreis- und Inkreis-Bild: Mittelpunkte der Dreieckskonstruktion
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/diagrams.js:75-88`
**Plain English:** Der Umkreis-Mittelpunkt U ist der Schnitt der Mittelsenkrechten; der Inkreis-Mittelpunkt I ist der Schnitt der Winkelhalbierenden.
**Specification:**
  Given Festes Dreieck mit den Ecken (30, 220), (220, 200), (90, 50) und seine Verschiebung um 260 px
  When  circlesDiagram() gezeichnet wird
  Then  Umkreisradius R = Abstand von U zu A (Mittelpunkt aus circumcenter). Inkreisradius r = 2·Fläche : Umfang, Mittelpunkt I = (a·A + b·B + c·C) : (a+b+c) (aus incircle in geom.js, gelesen zur Auflösung).
**Parameters:** Festes Dreieck, nicht parametrisiert. Beschriftungen 'Umkreis', 'Inkreis', 'Mittelsenkrechten', 'Winkelhalbierende'.
**Edge cases handled:** Das Bild zeigt nur ein festes Dreieck; keine Eingabe möglich.
**Confidence:** High

### RULE-093: Arc drawing: large-arc flag and fixed sweep direction
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/geom.js:11-14`
**Plain English:** An arc is drawn from a start angle to an end angle counterclockwise on screen. It is marked as a large arc when it spans more than 180 degrees.
**Specification:**
  Given Centre (cx, cy), radius r, start angle a0, end angle a1 (degrees, counterclockwise), and a CSS class (default 'ln-soft').
  When  arc(...) is called to draw an angle or circle portion in a lesson diagram.
  Then  The path starts at at(a0) and ends at at(a1). The large-arc flag is 1 if a1 − a0 > 180, otherwise 0. The sweep flag is always 0, so the arc runs counterclockwise on screen. Example: arc(100, 100, 50, 0, 270) gives 'M150 100 A50 50 0 1 0 100 150'.
**Parameters:** Threshold 180 degrees for the large-arc flag. Sweep flag fixed at 0 (geom.js:13). Default class 'ln-soft'.
**Edge cases handled:** Exactly 180 degrees gives the small-arc flag 0.; If a1 is smaller than a0, the span is negative, so the flag is always 0 even when the arc crosses 180 degrees.; Spans above 360 degrees are not wrapped or capped.; Reversed or over-long arcs are not guarded; callers must pass a1 > a0 with span at most 360.
**Suspected defect:** The large-arc flag uses a1 − a0 without normalising the order or the span (geom.js:13). Reversed angle pairs give the wrong flag. Whether any caller passes reversed angles is not visible in this file.
**Confidence:** High

### RULE-094: Right-angle marker square completion
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/geom.js:22-25`
**Plain English:** A small square marks a right angle at a vertex. Its fourth corner completes a parallelogram from the two arm points.
**Specification:**
  Given Vertex p, two arm directions d1 and d2 in degrees, default marker size s = 14 drawing units.
  When  rightAngle(p, d1, d2) is called.
  Then  a = p + s along d1, b = p + s along d2, c = a + b − p (the fourth corner). The path runs a → c → b. Example: p(10, 10), d1 = 0, d2 = 90 gives a(24, 10), b(10, −4), c(24, −4).
**Parameters:** Default marker size s = 14 drawing units (geom.js:22).
**Edge cases handled:** The code does not check that d1 and d2 are perpendicular. The marker is only correct when they are.; Opposite directions (0 and 180) give a flat line segment instead of a square.; The marker size is fixed in drawing units and does not scale with the diagram.
**Confidence:** High

### RULE-095: Angle to drawing point conversion
**Category:** Calculation
**Priority:** P2
**Source:** `apps/geometrie/geom.js:7`
**Plain English:** A point on a circle is found from a centre, a radius and an angle in degrees measured counterclockwise from the right-hand direction, with the y axis flipped because SVG y grows downward.
**Specification:**
  Given Centre (cx, cy), radius r, angle deg in degrees.
  When  at(cx, cy, r, deg) is called by the arc and right-angle helpers.
  Then  x = cx + r·cos(rad(deg)), y = cy − r·sin(rad(deg)), where rad(d) = d·π/180 (geom.js:4). Example: at(100, 100, 50, 90) gives (100, 50), which is straight up on screen.
**Parameters:** rad conversion factor π/180 (geom.js:4).
**Edge cases handled:** Angles are not normalised. Values beyond 360 or below 0 work through cos and sin.
**Confidence:** High

### RULE-096: Nibble matching question (four bits to hex digit)
**Category:** Calculation
**Priority:** P2
**Source:** `apps/informatik/builders.js:235-243`
**Plain English:** The child matches four 4-bit groups with their hex digits. The groups are chosen from a fixed set of values that excludes 0, 3, 6 and 7.
**Specification:**
  Given Four distinct values are drawn at random from [1,2,4,5,8,9,10,11,12,13,14,15] (builders.js:236). The values 0, 3, 6 and 7 are never drawn.
  When  The match question is built. Left column: 4-bit binary of each value. Right column: the hex digits of the same values, shuffled separately (builders.js:240).
  Then  Each left item pairs with its hex digit (leftValues, builders.js:239). The pairing check is done by the match question type (core/js/qtypes.js, not read). The explanation: add the weights 8, 4, 2, 1 for each 1-bit (builders.js:241).
**Parameters:** Value set size 12, drawn 4 at a time. Excluded values 0, 3, 6, 7.
**Edge cases handled:** Values 0, 3, 6 and 7 never appear, with no explanation in the code. Their absence may be deliberate, but nothing says why.; The left and right columns are shuffled independently, so the answer key is in leftValues.
**Confidence:** Medium — Are the nibbles 0000, 0011, 0110 and 0111 (values 0, 3, 6, 7) left out on purpose? If so, why? If not, should the set be the full 0 to 15 range?

### RULE-097: Binary decomposition bar diagram
**Category:** Calculation
**Priority:** P2
**Source:** `apps/informatik/diagrams.js:45-61`
**Plain English:** A bar diagram shows a number as the sum of its binary place values (largest first). The bar widths are proportional to those values, and the binary form is printed.
**Specification:**
  Given n, default 13. parts = the place values of the 1-bits of toBin(n), largest first (onesWeights, numbers.js:22-25).
  When  blocksDiagram(n) is drawn.
  Then  Bars with width proportional to each part (scale 440 / n, minus 4 px gap, diagrams.js:47-50). Equation line e.g. 8 + 4 + 1 = 13. Result line Darum: 13 = 1101. Row of flags for the weights from the largest one <= n down to 1, showing 1 if the weight is a part (diagrams.js:58).
**Parameters:** Scale 440 px, bar height 60 px, gap 4 px.
**Edge cases handled:** n = 0 gives no parts and scale Infinity, and the flag row shows only '1:0'. Math.max of an empty list is -Infinity, so indexOf gives -1 and slice(-1) keeps only the last weight.; n above 255 gives parts such as 256 that are not in WEIGHTS, so they are missing from the flag row but still drawn as bars.
**Confidence:** High

### RULE-098: Place-value table diagram
**Category:** Calculation
**Priority:** P2
**Source:** `apps/informatik/diagrams.js:6-26`
**Plain English:** A diagram shows a number as four boxes (thousands to ones), each with digit times place value, and a sum line that leaves out zero parts.
**Specification:**
  Given n, default 352. It is padded to four digits (diagrams.js:7).
  When  placeDiagram(n) is drawn.
  Then  Four boxes, one per digit, showing digit x weight (1000, 100, 10, 1). The ones box is highlighted. Sum line: the non-zero parts joined with ' + ', e.g. 352 = 3x100 + 5x10 + 2x1 (diagrams.js:22-24).
**Parameters:** Weights [1000,100,10,1]. Box spacing 126 px.
**Edge cases handled:** n above 9999 gives five digits, so weights[4] is undefined and the labels read 'x undefined' (diagrams.js:16, 22).; n = 0 gives an empty sum line ('0 = ').
**Confidence:** High

### RULE-099: Hex place-value and nibble diagrams
**Category:** Calculation
**Priority:** P2
**Source:** `apps/informatik/diagrams.js:85-95`
**Plain English:** Two hex digits are shown as high digit x 16 plus low digit. A separate nibble diagram splits eight bits into two groups of four, each with its hex digit.
**Specification:**
  Given hex, default '2F'. The function takes the first two characters: high digit (hi) and low digit (lo). For nibbles: bits, default [1,1,0,1,0,1,1,0], split into the first four and the last four bits (diagrams.js:104).
  When  hexPlaceDiagram(hex) or nibbleDiagram(bits) is drawn.
  Then  Hex: values hv and lv come from HEX.indexOf (diagrams.js:87). Sum line e.g. 2F = 2x16 + 15 = 47. Nibbles (diagrams.js:98-115): each group's binary value v is shown and mapped to one hex digit HEX[v]. Example: 1101 gives 13, shown as D, and 0110 gives 6.
**Parameters:** HEX digits 0-9 and A-F. Value = high x 16 + low.
**Edge cases handled:** Only the first two characters are used. 'FF0' is drawn as 'FF0 = 240 + 15 = 255', but the value of FF0 is 4080. The sum line shows the input string, so the error is visible.; Lowercase input gives indexOf -1 and a negative value, since HEX is uppercase only.; Nibble input that is not exactly eight bits gives undefined hex digits.
**Suspected defect:** diagrams.js:85-95: hexPlaceDiagram does not check the length of hex. Three or more characters are truncated silently, but the sum line still prints the full string, so the displayed arithmetic is wrong.
**Confidence:** High

### RULE-100: Zuordnung erkennen: proportional, antiproportional, weder noch, beides
**Category:** Calculation
**Priority:** P2
**Source:** `apps/mathe/builders.js:185-190`
**Plain English:** Der Schüler ordnet eine Alltagssituation einer von vier Zuordnungsarten zu. Die richtige Antwort steht in den Aufgabendaten.
**Specification:**
  Given Eine Situation (Text, Antwort) aus den Aufgabendaten (SITUATIONS) gleichverteilt gewählt.
  When  Eine Zuordnungs-Aufgabe wird erzeugt (nur Auswahl).
  Then  Richtige Antwort ist die Zuordnung der Situation. Die drei anderen Arten sind falsch. Die Erklärung kommt aus einer festen Tabelle (Zeile 188).
**Parameters:** Vier Antwortarten (Zeile 187).
**Edge cases handled:** Für die Antwort 'beides' gibt es in der Erklärungstabelle keinen Eintrag, die Erklärung ist leer (Zeile 188-189).; Die Situationen selbst stehen nicht in den gelesenen Dateien (data.json).
**Confidence:** High

### RULE-101: Laufzeit eines Ratenkredits
**Category:** Calculation
**Priority:** P2
**Source:** `apps/mathe/builders.js:286-289`
**Plain English:** Die Laufzeit ist, wie oft die jährliche Tilgung in die Kreditsumme passt.
**Specification:**
  Given Kredit K = n * t, jährliche Tilgung t.
  When  Eine Laufzeit-Aufgabe wird erzeugt.
  Then  Laufzeit = K / t = n Jahre (Zeile 289).
**Parameters:** Keine.
**Edge cases handled:** Ergebnis ist immer ganzzahlig, weil K ein Vielfaches von t ist (Zeile 258).
**Confidence:** High

### RULE-102: Gleichung aus einem Text aufstellen
**Category:** Calculation
**Priority:** P2
**Source:** `apps/mathe/builders.js:92-98`
**Plain English:** Ein Sachtext ('Das k-Fache einer Zahl, vermehrt um c, ergibt r') wird in die passende Gleichung übersetzt.
**Specification:**
  Given k aus 2..6, c aus 2..9, x aus 2..8, r = k*x + c.
  When  Eine Aufgabe 'Gleichung aufstellen' wird erzeugt (nur Auswahl).
  Then  Richtige Gleichung: kx + c = r. Falsch sind (k+c)x = r, kx - c = r, cx + k = r, k(x+c) = r. Erklärung zeigt die Übersetzung: 'Das k-Fache' = kx, 'vermehrt um' = +, 'ergibt' = =.
**Parameters:** k aus 2..6; c aus 2..9; x aus 2..8 (Zeile 93).
**Edge cases handled:** Wenn c = k, wird 'cx + k = r' identisch mit der richtigen Antwort und entfernt (Zeile 326).
**Confidence:** High

### RULE-103: Waage: Lösungsweg mit zwei Schritten
**Category:** Calculation
**Priority:** P2
**Source:** `apps/mathe/diagrams.js:40-53`
**Plain English:** Das Waage-Diagramm zeigt den Lösungsweg von a x + b = c: erst b abziehen, dann durch a teilen.
**Specification:**
  Given Zahlen a, b, x; c = a * x + b (Zeile 42).
  When  Das Diagramm zur Gleichung wird gezeichnet.
  Then  Schritt 1: '| − b', Ergebnis a x = c − b (Zeile 46-47). Schritt 2: '| : a', Ergebnis x = x (Zeile 48-50).
**Parameters:** Standardwerte a=2, b=3, x=4 (Zeile 41).
**Edge cases handled:** Der Schritttext '/ − b' geht von einem positiven b aus; bei negativem b steht z. B. '/ − -3' (Zeilen 46-47).; Der Schritt 'x = x' ist eine Anzeige, keine Prüfung.
**Confidence:** High

### RULE-104: Begleitdiagramme rechnen dieselben Formeln wie die Aufgaben
**Category:** Calculation
**Priority:** P2
**Source:** `apps/mathe/diagrams.js:56-66`
**Plain English:** Die Diagramme Prozentbalken, Zinsen-Zeitstrahl, Zahlenstrahl, Kacheln und Urne zeigen dieselben Formeln, die auch in den Aufgaben stehen.
**Specification:**
  Given Prozentbalken: Grundwert G, Prozentsatz p. Weitere Diagramme mit Zahlen aus ihren Argumenten.
  When  Ein Begleitdiagramm wird gezeichnet.
  Then  Prozentbalken: Prozentwert = G * p / 100; Balkenbreite = 440 * p / 100 (Zeile 57). Zinsen-Zeitstrahl: Z = K * p / 100 (diagrams.js:86). Zahlenstrahl: Ziel = Start + Sprung (diagrams.js:7). Kacheln: A = a1 + a2, C = c1 + c2 (diagrams.js:31). Urne: P = r : (r + b) (diagrams.js:111, 117).
**Parameters:** Breite 440 px für den Balken (Zeile 57).
**Edge cases handled:** Bei p über 100 läuft der Balken über den Rahmen (Zeile 57).; Beim Zahlenstrahl werden Werte außerhalb von -8 bis 8 nicht begrenzt und ragen über den Strahl hinaus (diagrams.js:7-12).; Bei Kacheln mit einem Vorfaktor 1 steht 'x' statt '1x' (diagrams.js:36).
**Confidence:** High

### RULE-105: Canonical written form of a linear term
**Category:** Calculation
**Priority:** P2
**Source:** `apps/mathe/math.js:12-18`
**Plain English:** A linear term a·x + c is written in standard school notation (coefficient 1 is dropped, a zero constant is omitted, the sign is written as minus or plus with spaces around it).
**Specification:**
  Given A coefficient a, a constant c, and a variable name v (default 'x').
  When  linear(a, c, v) builds the term text, for example to produce an expected answer string.
  Then  If a = 0 the result is just the constant formatted as a number (fmt(c)), with no variable. Otherwise the head is 'x' for a = 1, '−x' for a = −1, and fmt(a) followed by v for other values. If c = 0 the head alone is returned. Otherwise the result is head + ' − |c|' when c < 0, or head + ' + c' when c ≥ 0.
**Parameters:** Minus sign is U+2212 (mathkit.js:6). Number format is fmt: decimal comma, at most three decimals, leading minus sign (mathkit.js:9). Default variable name 'x' (math.js:13).
**Edge cases handled:** linear(0, 0) returns '0'.; linear(0, −5) returns '−5' (the variable is ignored when a = 0).; linear(1, −1) returns 'x − 1'; linear(−1, 0) returns '−x'.; linear(2, −3) returns '2x − 3'; linear(−2, 3) returns '−2x + 3'.; A non-integer coefficient is printed with a decimal comma, for example 2.5 becomes '2,5x'.
**Confidence:** High

### RULE-106: Zufällige ganze Zahl im Bereich, Grenzen eingeschlossen
**Category:** Calculation
**Priority:** P2
**Source:** `core/js/mathkit.js:5-5`
**Plain English:** Eine Zufallszahl wird so gezogen, dass alle Ganzzahlen von a bis b gleich wahrscheinlich sind, beide Grenzen eingeschlossen.
**Specification:**
  Given rnd(2, 5).
  When  rnd wird aufgerufen.
  Then  Es kommt eine Zufallszahl aus dem Bereich zurück.
**Parameters:** Formel a + floor(Zufall × (b − a + 1)) (mathkit.js:5).
**Edge cases handled:** Ist a größer als b, z. B. rnd(5, 3), liegt das Ergebnis bei 4 oder 5 und damit außerhalb des angegebenen Bereichs.; Dezimalgrenzen werden nicht abgerundet: rnd(1.5, 3) liefert 1,5, 2,5 oder 3,5. Der Wert 3,5 liegt über der Obergrenze.
**Confidence:** High

### RULE-107: Blitz praise threshold at 10 correct answers
**Category:** Calculation
**Priority:** P2
**Source:** `core/js/views/result.js:13-15`
**Plain English:** In the 45-second Blitz, 10 or more correct answers earn the praise title and a cheer. Fewer gives 'Zeit um'.
**Specification:**
  Given Round mode is blitz; score is the number of correct answers.
  When  A Blitz round ends.
  Then  score >= 10: title 'Blitzschnell!' (words.blitzTitle), mood 'cheer', confetti. Otherwise: title 'Zeit um', mood 'happy', no confetti. Subtext shows the score and the best score app.best.blitz (already updated before rendering, core/js/shell.js:102-106).
**Parameters:** Threshold 10 correct answers. Round length 45 seconds appears only as text (core/js/views/result.js:14-14); the timer lives in core/js/blitz.js, not read.
**Edge cases handled:** The blitz result shows no stars (core/js/views/result.js:32-32).; The blitz result shows the combo multiplier instead of the raw count (core/js/views/result.js:16-16).; The best score shows 0 when none is stored.
**Confidence:** High

### RULE-108: Total trophy count on the home screen
**Category:** Calculation
**Priority:** P2
**Source:** `dashboard.js:21`
**Plain English:** The 'Trophaeen' figure is the total number of trophies earned across all live apps.
**Specification:**
  Given Saved state of each live app; state.badges is an object keyed by trophy id.
  When  The hero section is drawn.
  Then  badgeCount = sum over live apps of the number of keys in state.badges (dashboard.js:21, shown at line 33). Soon apps contribute 0.
**Edge cases handled:** The same trophy id earned in two different apps is counted twice (no de-duplication).; The count is not checked against the list of defined trophies.
**Confidence:** High

### RULE-109: Subjektdarstellung: j' vor Vokal und h, Pronomenvariante in der dritten Person
**Category:** Calculation
**Priority:** P2
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:5-7`
**Plain English:** Vor einem Verb, das mit Vokal oder stummem h beginnt, steht bei 'je' die Kurzform j'. Bei den anderen Personen wird das Pronomen zufällig aus den erlaubten Varianten gewählt.
**Specification:**
  Given Die je-Form eines Verbs (forms[0]) und eine Personen-Nummer.
  When  Aufgabentext oder Theorie-Tabelle wird aufgebaut.
  Then  Beginnt forms[0] mit einem Vokal oder h (inklusive é, è, ê, à, â, î, ô, û), steht j' ohne Leerzeichen. Sonst je mit Leerzeichen. Für Personen 1 bis 5 wird zufällig eine Variante aus PQV[p] gewählt (z. B. il, elle, on).
**Parameters:** Vokalliste: a e i o u h é è ê à â î ô û (ohne Akzent-Varianten zusammengefasst).
**Edge cases handled:** Der Buchstabe h wird immer wie ein stummes h behandelt. Aspiriertes h (z. B. bei haïr) würde falsch elidiert.; Die gleiche Vokalliste steht in diagrams.js:5 und wird dort für die Diagrammanzeige genutzt. Die Regel ist also zweimal implementiert.; theory.js:60 nutzt elides() für die Leerzeichen bei der Vorlese-Ausgabe.
**Confidence:** Medium — Enthält der Lernstoff Verben mit aspiriertem h (z. B. haïr), bei denen die je-Form nicht mit j' stehen darf? Falls ja, muss die Regel eine Ausnahmeliste bekommen.

### RULE-110: Endungsaufgabe: Auswahl der falschen Endungen
**Category:** Calculation
**Priority:** P2
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:66-71`
**Plain English:** Bei der Endungsaufgabe stehen die richtige Endung und drei andere Endungen der Gruppe zur Wahl. Der Stamm steht schon da.
**Specification:**
  Given Ein regelmäßiges Verb und eine Person mit Endung.
  When  Eine Endungsaufgabe wird gebaut.
  Then  Die Auswahl besteht aus der richtigen Endung und bis zu drei weiteren verschiedenen, nicht leeren Endungen der Gruppe, gemischt. Die Anzeige zeigt Pronomen und Stamm mit einer Lücke.
**Parameters:** Anzahl falscher Endungen: 3.
**Edge cases handled:** Gleiche Endungen mehrerer Personen (z. B. 'e' für je und il) erscheinen nur einmal in der Auswahl.; Hat die Gruppe weniger als vier verschiedene Endungen, gibt es weniger Optionen.; Die Endung 'nicht vorhanden' (leer) wird nie als Option angeboten.
**Confidence:** High

## Validation

### RULE-111: Gap answers are graded tolerantly: case and surrounding spaces ignored, a wrong word is 'bad'
**Category:** Validation
**Priority:** P1
**Source:** `/Users/dghaies/Sites/lernapp-sira/legacy/modulare/apps/deutsch/builders.js:33-50`
**Also cited:** (with norm() at /Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/ui.js:21 and option() at /Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/questions.js:6)
**Plain English:** When a student types or picks the missing word, the correct word counts whatever its capitalisation or extra spaces, but a wrong word does not.
**Specification:**
  Given A gap item with correct answer a and wrong[0] as a distractor.
  When  The choice question and the typed question are built and checked: check(a), check(' ' + mixed-case a + ' '), check(wrong[0]).
  Then  The choice question has an option with id = a and fill = a. The typed check returns 'ok' for a, for the mixed-case spaced version, and 'bad' for wrong[0].
**Parameters:** Case change: letters alternate upper and lower case by index; 'ß' is left unchanged.
**Edge cases handled:** 'ß' must not be turned into 'SS' by case changes, because that would change the answer (tests/deutsch.test.js:39-40).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/deutsch.test.js:31-44) are a test that asserts the rule, not the implementation. The behavior does exist in executable code elsewhere. choice() at apps/deutsch/builders.js:33-37 builds the option with id = fill = item.a for gap items (via option(w, esc(w), w) at line 36, where option() in core/js/questions.js:6 returns { id, html, fill }).…

### RULE-112: Wahrscheinlichkeitsantwort: Bruch, Dezimalzahl oder Prozent
**Category:** Validation
**Priority:** P1
**Source:** `/Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/mathkit.js:37-44`
**Also cited:** (probCheck); /Users/dghaies/Sites/lernapp-sira/legacy/modulare/apps/mathe/builders.js:233-252 (Generatoren wuerfel, urne, relativ) and :301 (POOLS.zufall); core/js/mathkit.js:38-44
**Plain English:** A probability answer counts as correct in fraction, decimal or percent form; a bare number without percent sign, an empty answer, or a zero denominator is rejected. Generated probabilities lie strictly above 0 and at most 1.
**Specification:**
  Given The correct probability 0.25.
  When  The student types an answer, or a probability question is generated.
  Then  '1/4', '2/8', '0,25', '0.25', '25 %' and '25%' pass. '1/3', '25', '' and '1/0' fail. Every generated probability value is greater than 0 and at most 1, its own checker accepts its answer, and the answer is not in its list of wrong options.
**Edge cases handled:** Bare '25' is rejected (not read as 25 %).; Zero denominator '1/0' is rejected rather than crashing.
**Suspected defect:** „1/2/3“ wird stillschweigend als 1/2 gewertet, weil nur die ersten beiden Teile eines Bruchs gelesen werden (mathkit.js:42).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/mathe.test.js:113-122) are a test that asserts the behavior, not the implementation. The behavior is implemented in executable code elsewhere, and that code matches the rule as specified. Checker, /Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/mathkit.js:38-44 (probCheck): base() lowercases and strips whitespace,…

### RULE-113: Prüfung einer Eingabe-Antwort (Wort eintippen)
**Category:** Validation
**Priority:** P1
**Source:** `apps/deutsch/builders.js:45-51`
**Plain English:** A typed answer counts as correct if it matches the correct word or an accepted variant, ignoring case, surrounding spaces, extra inner spaces and typographic apostrophes; otherwise it is wrong.
**Specification:**
  Given A typed item with correct answer a and an optional list of accepted variants
  When  The learner submits a typed answer
  Then  The input and every accepted form (a plus accept[]) are normalised with norm(): trim, lower-case, curly apostrophes (’ ` ´) become ', runs of whitespace become one space. If the normalised input equals one of them, the result is 'ok'; otherwise 'bad'. No 'almost' result is produced here.
**Parameters:** Accepted forms: answer a plus item.accept (builders.js:46). Normalisation rules are in core/js/ui.js:21.
**Edge cases handled:** Capitalisation is ignored: 'hund' and 'Hund' both pass. Whether that is intended for German nouns needs an SME decision.; Umlauts, ß and accents are compared exactly: 'Madchen' fails for 'Mädchen'. The project guide (AGENTS.md) asks for stripAccents() for near-correct answers, but this code does not call it.; Spaces are collapsed, not removed: 'Ski fahren' fails for 'Skifahren' unless listed in accept.; Empty input gives 'bad'.; The typed label is hardcoded 'Schreibe das Wort' and ignores item.label (builders.js:48), unlike choice questions (builders.js:34).
**Confidence:** Medium — Should typed answers be case-sensitive for German nouns (Hund vs hund), and should umlaut or ß/ss differences and accent-only mistakes count as wrong or as 'almost correct' (the AGENTS.md guidance suggests a near-correct tier using stripAccents)?

### RULE-114: Lage des Umkreismittelpunkts nach Dreiecksart
**Category:** Validation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:152-158`
**Plain English:** Der Umkreismittelpunkt liegt bei einem spitzwinkligen Dreieck innen, bei einem rechtwinkligen auf der Hypotenuse und bei einem stumpfwinkligen außen.
**Specification:**
  Given Ein rechtwinkliges Dreieck
  When  Die Frage 'Wo liegt der Mittelpunkt des Umkreises?' erzeugt wird
  Then  Die richtige Antwort ist 'in der Mitte der Hypotenuse'. Falsche Antworten: 'innerhalb des Dreiecks', 'außerhalb des Dreiecks', 'immer im Schwerpunkt'.
**Parameters:** Art des Dreiecks zufällig aus spitzwinklig, rechtwinklig, stumpfwinklig. Zuordnung: spitz -> innerhalb, recht -> Mitte der Hypotenuse, stumpf -> außerhalb.
**Edge cases handled:** 'immer im Schwerpunkt' ist immer falsch.
**Confidence:** High

### RULE-115: Distraktor-Generator: mindestens drei verschiedene falsche Antworten
**Category:** Validation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:229-235`
**Also cited:** apps/mathe/builders.js:323-329
**Plain English:** Jede Aufgabe muss genau eine richtige Antwort und mindestens drei verschiedene falsche Antworten haben; sonst wird neu gezogen.
**Specification:**
  Given Eine Aufgabe liefert falsche Antworten [6 cm, 6 cm, 12 cm], richtig ist 6 cm
  When  make() die Aufgabe prüft
  Then  Dubletten fallen weg und die richtige Antwort wird entfernt, es bleibt nur '12 cm' (weniger als drei). Die Aufgabe wird verworfen und neu gezogen.
**Parameters:** Mindestanzahl falscher Antworten: 3. Vergleich per Text (nach Formatierung), nicht per Zahl.
**Edge cases handled:** Die Schleife for(;;) läuft ohne Obergrenze. Liefert eine Quelle immer weniger als drei verschiedene falsche Antworten, hängt die Runde.; Ein leerer Faktenpool macht pick() undefiniert; das ergibt ebenfalls null falsche Antworten und damit eine Endlosschleife (siehe Lifecycle-Regel).
**Confidence:** Medium — Hat jeder Eintrag in data.json (msFacts, whFacts, drFacts, thFacts, krFacts, grFacts, prFacts) mindestens drei verschiedene falsche Antworten und ist jeder Faktenpool gefüllt? Falls nicht, wäre eine Obergrenze für die Schleife nötig.

### RULE-116: Dreiecksungleichung: Existenz eines Dreiecks aus drei Seiten
**Category:** Validation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:71-84`
**Plain English:** Ein Dreieck existiert nur, wenn jede Seite kürzer ist als die beiden anderen zusammen. Die Aufgaben erzeugen daher nur gültige Dreiecke oder garantiert unmögliche Seitenlängen.
**Specification:**
  Given Seiten a = 2 cm, b = 3 cm, c = a + b + 1 = 6 cm
  When  Die Frage 'Kann man dieses Dreieck zeichnen?' erzeugt wird
  Then  Die richtige Antwort ist 'Nein, a + b ist nicht größer als c' (5 cm < 6 cm). Falsche Antworten: 'Ja, mit SSS geht es immer', 'Ja, nur mit Winkelmesser', 'Ja, wenn man c kürzer zeichnet'.
**Parameters:** a, b zufällig 2 cm bis 6 cm; c = a + b + k mit k zufällig 1 cm bis 4 cm, also immer unmöglich. Für die Existenzaufgabe: drei Seiten zufällig 3 cm bis 9 cm, Schleife verwirft jede Kombination, bei der eine Seite nicht kürzer ist als die Summe der beiden anderen (strikt). Antwort bei gültigem Dreieck: 'genau eines (bis auf Spiegelung und Drehung)'.
**Edge cases handled:** Die Schleife in dreieckSeiten (Zeile 73) lehnt auch Grenzfälle ab, bei denen eine Seite genau der Summe der beiden anderen entspricht (degeneriertes Dreieck).; Die Aufgabe nennt 'SSS' als Begründung für die Eindeutigkeit; Dreiecke mit drei gegebenen Seiten sind eindeutig.
**Confidence:** High

### RULE-117: Kongruenzsatz- und Eindeutigkeits-Zuordnungen aus Datentabellen
**Category:** Validation
**Priority:** P1
**Source:** `apps/geometrie/builders.js:87-98`
**Plain English:** Die Zuordnung 'Angaben zu Kongruenzsatz' und 'Angaben zu Anzahl der Dreiecke' kommt aus Datentabellen; die falschen Antworten werden aus einer festen Liste ohne die richtige Antwort gebildet.
**Specification:**
  Given Ein Tabelleneintrag: Angabe 'zwei Seiten und der eingeschlossene Winkel', Name 'SWS'
  When  Die Frage 'Welcher Kongruenzsatz passt?' erzeugt wird
  Then  Die richtige Antwort ist 'SWS'. Falsche Antworten sind die übrigen Namen aus [SSS, SWS, WSW, SsW] ohne 'SWS'. Bei der Eindeutigkeitsfrage: richtig ist der Tabelleneintrag, falsch sind die anderen drei aus einer festen Liste aus vier Optionen.
**Parameters:** Kongruenzsatz-Liste: SSS, SWS, WSW, SsW (SsW ist als Distraktor eingetragen). Eindeutigkeits-Liste: 'genau ein Dreieck', 'höchstens zwei Dreiecke möglich', 'unendlich viele Dreiecke (verschieden groß)', 'kein Dreieck'. Tabellen aus content/geometrie/data.json (nicht gelesen).
**Edge cases handled:** Die Aufgaben sind nur Auswahl (choiceOnly), nie eintippbar.; Der Distraktor 'SsW' ist keiner der vier Kongruenzsätze, sondern ein Hinweis auf eine Nicht-Regel. Ob das gewollt ist, muss der SME bestätigen.
**Confidence:** Medium — Sind alle Einträge der Tabellen THEOREMS und EINDEUTIG in content/geometrie/data.json korrekte Zuordnungen? Ist der Distraktor 'SsW' bewusst als falsche Antwort gewollt?

### RULE-118: Typed answer is correct only after normalization
**Category:** Validation
**Priority:** P1
**Source:** `apps/informatik/builders.js:27-29`
**Plain English:** A typed answer counts as correct only if it equals the expected value after harmless formatting (spaces, underscores, case, a leading 0X, leading zeros) is removed; anything else is wrong.
**Specification:**
  Given A typed question whose answer is stored as a string, e.g. binary 101010 (decimal 42), with type 'bin'.
  When  The child submits an input, checked by checker(type, answer), which calls normInput on both input and answer (numbers.js:66-74).
  Then  Returns 'ok' if both normalized values are equal, otherwise 'bad'. Example: input ' 0101010 ' normalizes to 101010 and is accepted; input '1O1' fails the bin regex and is 'bad'. No partial credit: the checker never returns 'almost'.
**Parameters:** normInput: trim, uppercase, remove whitespace and underscores, strip leading '0X', strip leading zeros but keep one digit (numbers.js:67-70). Allowed characters: dec = digits only (/^\d+$/), bin = 0 and 1 only, hex = 0-9 and A-F only. Anything else returns null and is 'bad'.
**Edge cases handled:** Padded prompts are not enforced: hexToBinQ asks for '8 Bits' (builders.js:228-231) and binToHexQ shows 4 or 8 bits (builders.js:208), but the checker strips leading zeros, so '101010' is accepted for…; Empty input or input with invalid characters yields null and is 'bad', not re-prompted.; Decimal input '047' is accepted for 47 because leading zeros are removed.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Cited code checked: builders.js:27-29 wraps typedQuestion with check: checker(type, answer). numbers.js:66-74 implements normInput (trim, uppercase, strip whitespace/underscores, strip leading 0X, strip leading zeros but keep one digit, regex per type) and checker returns 'ok' or 'bad' only, never '…

### RULE-119: Antwortprüfung durch Vergleich nach Normalisierung
**Category:** Validation
**Priority:** P1
**Source:** `apps/informatik/numbers.js:66-74`
**Also cited:** apps/informatik/numbers.js:66-71
**Plain English:** Eine getippte Antwort gilt als richtig, wenn sie nach der Bereinigung dem gespeicherten Ergebnis entspricht. Es gibt nur richtig oder falsch, keine Teilpunkte.
**Specification:**
  Given Eine Aufgabe mit richtiger Antwort, z. B. Typ 'bin' und Antwort '1011'.
  When  Der Schüler gibt eine Antwort ein und sie wird geprüft.
  Then  Beide Seiten werden mit normInput bereinigt. Sind sie gleich, ist das Ergebnis 'ok', sonst 'bad'. Beispiel: '001011' ergibt 'ok', '1012' ergibt 'bad', '' ergibt 'bad'.
**Parameters:** Ergebnisse 'ok' oder 'bad' (numbers.js:74). Keine Teilpunkte. Vergleich über normInput (numbers.js:66-71).
**Edge cases handled:** Ist die Eingabe ungültig (null) und die Lösung gültig, ist das Ergebnis 'bad'.; Die Schreibweise zählt nicht: 'ff', 'FF' und '0xFF' sind gleich (numbers.js:67, 70).; Die Prüfung ist typabhängig: die Eingabe '10' ist im Typ dec die Zahl 10, im Typ bin die Zahl 2 (numbers.js:68-69).
**Suspected defect:** Ist die gespeicherte Lösung selbst ungültig (normInput liefert null), dann ergibt jede ungültige Eingabe ebenfalls null und damit 'ok' (numbers.js:74, null === null). Das betrifft nur fehlerhaft gepflegte Inhalte, ist aber ein stiller Fehlalarm.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Geprüft gegen legacy/modulare/apps/informatik/numbers.js:66-74. Die Spezifikation stimmt mit dem Code überein: normInput (66-71) bereinigt Eingabe und Lösung gleich (trim, Großschreibung, Leerzeichen und Unterstriche weg, 0x-Präfix weg, führende Nullen weg, Typprüfung per Regex), checker (74) liefer…

### RULE-120: Auswahl der falschen Antworten bei Multiple Choice
**Category:** Validation
**Priority:** P1
**Source:** `apps/informatik/numbers.js:76-93`
**Plain English:** Für eine Auswahlfrage werden drei falsche Antworten gewählt: keine Dubletten, nicht die richtige Antwort, keine negativen Werte und kein NaN. Reichen die Vorschläge nicht, werden Nachbarzahlen ergänzt.
**Specification:**
  Given Eine richtige Antwort und eine Liste möglicher falscher Antworten (Kandidaten), z. B. Antwort '11' und Kandidaten ['11', '12', '-1', 'NaN', '9', '9', '14'].
  When  Die Ersatzantworten werden ausgewählt.
  Then  Die Kandidaten werden der Reihe nach geprüft; übernommen werden nur Werte, die noch nicht vorkommen, nicht NaN sind und nicht mit '-' beginnen, bis drei zusammen sind. Im Beispiel: '12', '9', '14'. Reichen die Kandidaten nicht, werden Zahlen answer±1, answer±2 usw. ergänzt (ohne negative Werte).
**Parameters:** Anzahl falscher Antworten: 3 (numbers.js:77, Standardwert count). Ausgeschlossen: Lösung, 'NaN', Werte mit '-' (numbers.js:82, 89).
**Edge cases handled:** Kandidaten ohne Ergebnis (Lösung 0, keine Kandidaten): Auffüllung '1', '2', '3' (numbers.js:86-89).; Die Auffüllung greift nur, wenn die Lösung als Dezimalzahl lesbar ist (numbers.js:86-87).; Die Lösung selbst wird nicht als Ersatz gewählt, auch nicht als Text (numbers.js:78).
**Suspected defect:** Die Auffüllung mit Nachbarzahlen rechnet mit parseInt(answer, 10) (numbers.js:86). Ist die Lösung eine Binär- oder Hex-Zahl, werden dezimale Nachbarn erzeugt: '1010' ergibt '1011' und '1009' statt binärer Nachbarn. Die Aufrufe in builders.js (z. B. Zeilen 82-88 und 197-202) geben meist genug Kandidaten, daher selten sichtbar; betroffen sind nur Fälle, in denen weniger als drei Kandidaten übrig bleiben.
**Confidence:** High

### RULE-121: Eingabeprüfung: Zahl, Term oder Wahrscheinlichkeit
**Category:** Validation
**Priority:** P1
**Source:** `apps/mathe/builders.js:314-318`
**Plain English:** Eine eingetippte Antwort wird je nach Aufgabenart geprüft: als Zahl, als Term oder als Wahrscheinlichkeit.
**Specification:**
  Given Eine Eingabefrage mit richtiger Antwort und dem Prüfer, der zur Aufgabe gehört.
  When  Der Schüler gibt eine Antwort ein.
  Then  Wahrscheinlichkeit (Zeile 315, check gesetzt): probCheck, Bruch, Dezimalzahl oder Prozent sind gleich. Zahl (numeric): numCheck mit Vergleichswert, Komma oder Punkt, Einheiten (€, %, °, cm, m) werden entfernt, Toleranz 1e-9 (mathkit.js). Sonst Term: termCheck, Leerzeichen, · und * und führendes + werden ignoriert (math.js).
**Parameters:** Toleranz 1e-9 (mathkit.js:20); Einheiten €, %, °, grad, cm, m (mathkit.js:15).
**Edge cases handled:** Eingabe '0,5', '1/2' und '50 %' gelten für eine Wahrscheinlichkeit von 1/2.; Leere Eingabe ist falsch (mathkit.js:20).; Bei Term-Aufgaben ist '0x' oder '-2x' mit Minus-Zeichen gleich der Eingabe mit Bindestrich, weil die Eingabe normalisiert wird (math.js:9-10).
**Confidence:** High

### RULE-122: Nur Auswahlaufgaben werden nicht eingetippt
**Category:** Validation
**Priority:** P1
**Source:** `apps/mathe/builders.js:330-330`
**Plain English:** Aufgaben, bei denen das Ergebnis nicht eindeutig als Eingabe geprüft werden kann, erscheinen nur als Auswahl.
**Specification:**
  Given Eine Aufgabe mit dem Merkmal choiceOnly (Ausklammern, Lösungsanzahl, Gleichung aufstellen, Umformungsschritt, Zuordnung erkennen).
  When  Die Runde setzt eine Eingabefrage ein (Position 3 bzw. 4, 6, 8, 12).
  Then  Ist choiceOnly gesetzt, wird die Frage als Auswahl gezeigt, nie als Eingabe (canType ist falsch). Die Merkmale stehen in Zeilen 68, 89, 96, 105, 189.
**Parameters:** Auswahl-Merkmal in den Vorlagen.
**Edge cases handled:** Aufgaben mit mehreren richtigen Schreibweisen (Ausklammern, Lösungsanzahl) würden sonst falsch bewertet.
**Confidence:** High

### RULE-123: Tolerant comparison of a typed algebra term
**Category:** Validation
**Priority:** P1
**Source:** `apps/mathe/math.js:8-10`
**Plain English:** A typed term answer such as "3x + 12" is accepted when it matches the expected term after spaces, letter case, minus-sign variants, multiplication signs and a leading plus are ignored.
**Specification:**
  Given An expected answer term (for example "3x + 12") and a learner's typed input.
  When  The term checker runs on the input.
  Then  Both strings are normalised with the same function (termNorm). If the normalised strings are identical the result is 'ok', otherwise 'bad'. There is no partial credit and no reordering of terms.
**Parameters:** Ignored characters: all whitespace (via clean, legacy/modulare/core/js/mathkit.js:13), every '·' and '*' anywhere in the term (math.js:9), one leading '+' (math.js:9). Minus variants U+2212 and U+2013 are folded to '-' and case is folded to lower case (mathkit.js:13). Unit words and symbols are removed by mathkit.js:15: the characters €, %, °, and the words euro, grad, cm, and m or m² (regex /[€%°]|euro|grad|cm|m²?/).
**Edge cases handled:** '3*x', '3·x' and '3x' are equal.; '-x' with ASCII hyphen and '−x' with U+2212 are equal; so are '3x-12' and '3x − 12'.; '+3x' equals '3x'; a plus that is not leading is significant ('3x+12' is not equal to '12+3x').; Term order is significant: '12+3x' does not match '3x+12', and 'x3' does not match '3x'.; Case is ignored: 'X' matches 'x'.; Empty input against an answer that normalises to empty (for example an answer consisting only of 'm') returns 'ok', because both sides become ''. The checker has no guard for empty input.; SUSPECTED DEFECT: the unit-stripping regex in mathkit.js:15 (m²?) removes every letter 'm', not only the unit. For an expected answer '2m + 4', the input '2 + 4' is accepted as correct, and '2m + 4'…
**Suspected defect:** legacy/modulare/core/js/mathkit.js:15 strips every letter 'm' (pattern 'm²?') as a unit, so terms with the variable m lose that letter before comparison. Example: expected '2m + 4' accepts input '2 + 4'. The check is defined in math.js:8-10 and inherits this behaviour from clean().
**Confidence:** High

### RULE-124: Abbildung einer Lektion aufloesen
**Category:** Validation
**Priority:** P1
**Source:** `core/js/appconfig.js:16-21`
**Also cited:** core/js/appconfig.js:16-21; core/js/content.js:12-28
**Plain English:** Eine Lektion zeigt entweder fertiges SVG oder verweist auf ein Diagramm der App. Ein Verweis auf ein nicht vorhandenes Diagramm bricht den Start ab.
**Specification:**
  Given Eine Lektion mit figure { diagram: { name: 'bruchbalken', args: [3, 4] }, caption: '...' } und logic.diagrams mit bruchbalken.
  When  buildConfig loest die Abbildungen aller Lektionen auf (core/js/appconfig.js:27).
  Then  Das Diagramm wird mit den Argumenten aufgerufen. Ergebnis ist { svg, caption }. Hat die Lektion schon svg, wird figure unveraendert uebernommen.
**Edge cases handled:** Ein figure mit svg und diagram: svg hat Vorrang.; Unbekannter Diagrammname: Fehler 'Diagramm <name> gibt es nicht (<lektions-id>)'. Der Start bricht ab.; Fehlen args, werden keine Argumente uebergeben.; Ein figure ohne svg und ohne diagram wird schon in der Paketpruefung abgelehnt (validate.js:36), bevor diese Stelle erreicht wird.
**Confidence:** Medium — Citation was corrected by referee (The cited lines are a test file (legacy/modulare/tests/core-content.test.js:65-78). They assert the behavior but do not implement it. The behavior is implemented in two places, and both match the rule. (1) resolveFigure in core/js/appconfig.js:16-21: a figure with svg is passed through unchanged (line 17); a diagram reference is resolved by calling diagrams[name…

### RULE-125: HTTP-Quelle holt und prüft das Paket
**Category:** Validation
**Priority:** P1
**Source:** `core/js/content.js:34-41`
**Also cited:** core/js/content.js:34-44
**Plain English:** Die Inhalte können später von einer Datenbank-API kommen. Die Quelle ruft die Adresse der App auf, schickt den Zugangsschlüssel mit und prüft das Ergebnis. Fehler der API und ungültige Pakete werden abgelehnt.
**Specification:**
  Given Eine API-Basisadresse, ein Zugangs-Header und eine App-Kennung.
  When  Das Paket wird geladen (load).
  Then  Die Adresse ist '<Basis>apps/<id>/content'. Der Header wird mitgeschickt. Antwort mit Status 503 wird abgelehnt. Antwort mit ungültigem Paket (kein gültiges Manifest) wird abgelehnt.
**Parameters:** Authorization-Header im Test: <Testplatzhalter — maskiert, siehe tests/core-content.test.js:84>. Keine Zahlen.
**Edge cases handled:** Fehlerstatus 503 führt zum Fehler mit dem Statuscode (line 88).; Ein Paket ohne Pflichtteile wird abgelehnt (line 89).
**Suspected defect:** Bei der API-Quelle fehlt data als Pflicht. Die statische Quelle setzt data auf {}, die API-Quelle nicht. Die Paketpruefung prueft data nicht (validate.js:47-51). Eine API-Antwort ohne data koennte deshalb zu einem undefined-Wert bei logic.init fuehren.
**Confidence:** Medium — Citation was corrected by referee (Das Verhalten ist im Code vorhanden, die zitierten Zeilen (tests/core-content.test.js:80-90) sind aber nur der Test, der es prüft. Die Implementierung steht in /Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/content.js:34-41. Dort gilt: createHttpSource baut die URL '${base}/apps/${encodeURIComponent(appId)}/content' (Zeile 39, ein abschließender Slash…

### RULE-126: Restore only from a valid Lernwerkstatt file, then reload
**Category:** Validation
**Priority:** P1
**Source:** `core/js/db.js:126-127`
**Plain English:** A chosen file is restored only if it is readable JSON marked as a Lernwerkstatt backup. Restore overwrites stored documents with the same key, replaces the event log, and reloads the page.
**Specification:**
  Given The player selects a file in 'Sicherung einspielen'.
  When  The file input's change event fires (core/js/shell.js:154-156).
  Then  No file: nothing happens. The file is parsed as JSON (core/js/views/backup.js:15-15). importAll rejects unless app is 'lernwerkstatt' and docs is an object, with the message 'Das ist keine Sicherung der Lernwerkstatt.' (core/js/db.js:126-127). If accepted, each docs entry with the app prefix and an object value is written (same key replaced, keys absent from the backup kept), and the event log is replaced when the backup contains a log array (core/js/db.js:128-133). On success the page reloads (core/js/shell.js:158-159). On failure the message appears in the status line: error.message, or 'Die Datei konnte nicht gelesen werden.' if there is none (core/js/shell.js:160-161).
**Parameters:** Required marker: app = 'lernwerkstatt'; docs must be an object. The format field is written by the export but not checked.
**Edge cases handled:** Invalid JSON produces the parser's own English message, because error.message is set and the German fallback is never reached (core/js/shell.js:161-161).; If the backup has a log array, the device's current event log is lost; a backup without one keeps it.; The format number is not checked, so backups from other versions are accepted if the marker matches.
**Suspected defect:** The event log is replaced wholesale without confirmation (core/js/db.js:132), and parser errors show English text (core/js/shell.js:161).
**Confidence:** Medium — Should restoring a backup replace this device's event log or merge with it, and should the player confirm before overwriting?

### RULE-127: HTML escaping: which lesson fields are trusted HTML
**Category:** Validation
**Priority:** P1
**Source:** `core/js/lesson.js:42`
**Also cited:** 44
**Plain English:** Most lesson text is inserted as raw HTML from trusted editors, but the memory rule and the mini-check question are typed as plain text yet inserted unescaped.
**Specification:**
  Given A lesson spec where rule and check.q are plain strings, possibly containing '<' or '&' or HTML tags.
  When  lessonBottom(spec) renders the Merksatz and the Mini-Check question.
  Then  spec.rule (lesson.js:42) and spec.check.q (lesson.js:44) are interpolated without esc(), so markup in them is parsed as HTML. By contrast goal, analogy.title, steps.title, option ids and the answer attribute are escaped (lesson.js:28,30,37,39,44); the feedback goes via textContent (lesson.js:70). Raw by design: tldr items (:26), analogy.html (:30), figure.svg and caption (:31), steps items (:36), option html (:37), pitfall.html (:41). In svg.js, text() escapes values (svg.js:13) and svg() escapes the label (svg.js:9). theory.js escapes notes and unit title/de (theory.js:9,12).
**Parameters:** None.
**Edge cases handled:** AGENTS.md states HTML fields come from vetted editors and are checked before import; this code does not enforce that.; Once content can come from a database (planned createHttpSource), the raw fields become an injection path.; Typed as string in the contract comment (lesson.js:17-18) but not escaped.
**Suspected defect:** lesson.js:42 and lesson.js:44 insert string fields unescaped (spec.rule, spec.check.q) although the spec types them as plain strings; likely should be esc() or the field should be documented as HTML.
**Confidence:** High

### RULE-128: Numerische Antwort ist richtig bei exakter Übereinstimmung (Toleranz 1e-9)
**Category:** Validation
**Priority:** P1
**Source:** `core/js/mathkit.js:18-21`
**Plain English:** Eine Zahlenantwort gilt als richtig, wenn sie nach Bereinigung exakt dem Sollwert entspricht. Gerundete Eingaben werden nicht toleriert.
**Specification:**
  Given Eine Zahlenaufgabe mit Sollwert 2,5 (value = 2.5, numeric = true).
  When  Die Lernerin gibt „2,5“, „2.5“, „2,5 cm“ oder „2,50“ ein, oder eine leere Eingabe, „2,4“, „abc“ oder „5/2“.
  Then  „2,5“, „2.5“, „2,5 cm“ und „2,50“ ergeben ok. Leere Eingabe, „2,4“, „abc“ und „5/2“ ergeben bad.
**Parameters:** Toleranz 1e-9 absolut (mathkit.js:20). Dezimalkomma oder Dezimalpunkt. Die Eingabe läuft vorher durch clean() (Regel zu Einheiten, mathkit.js:13-15). Leere Eingabe nach Bereinigung ist falsch (mathkit.js:20).
**Edge cases handled:** Nur das erste Komma wird ersetzt: „1,000,5“ wird nicht als Zahl gelesen und ist bad.; Leerzeichen innerhalb der Zahl werden entfernt: „1 000“ gilt als 1000.; Das Prozentzeichen wird entfernt: „50 %“ gilt als 50, die Einheit wird nicht geprüft.; Number() akzeptiert auch Exponentenschreibweise und Hex: „1e3“ gilt als 1000, „0x1A“ als 26.; Brüche werden nicht gelesen: „1/3“ ist bad. Dafür ist probCheck zuständig (eigene Regel).; Gerundete Eingaben sind bad: bei 1/3 ist „0,333“ falsch.; Die Anzeige-Antwort kommt aus fmt() mit drei Nachkommastellen (mathkit.js:9). Apps/mathe/builders.js:25 setzt answer: fmt(r) und value: r, numCheck prüft gegen value. Bei nicht endlichen Dezimalwerte…
**Suspected defect:** Anzeige-Antwort (fmt, drei Nachkommastellen) und Prüfwert (exakt, 1e-9) passen nicht zusammen, wenn der Sollwert nicht endlich dezimal ist, z. B. 1/3. Ob das sichtbar wird, hängt davon ab, wie die Anzeige die richtige Antwort ausgibt.
**Confidence:** Medium — Soll eine Antwort, die auf die angezeigte Stellenzahl gerundet ist (z. B. 0,333 für 1/3), als richtig gelten? Falls ja, braucht numCheck eine zur Anzeige passende Toleranz.

### RULE-129: Question content validation (authoring guard)
**Category:** Validation
**Priority:** P1
**Source:** `core/js/qtypes.js:76-82`
**Plain English:** Every question must be well formed before it is used: the right answer must be among the options, options must be unique and 2 to 4 in number, fill-in-the-blank choices need a fill text, typed answers must pass their own check, and matching questions need matching list sizes and values.
**Specification:**
  Given A choice question with options [A, B] and answer C; or a typed question whose answer fails its own check; or a match question with 3 left items and 2 right items.
  When  The question is validated (test helper assertValidQuestion, which calls validateQuestion).
  Then  The validation fails with the message for the broken rule, e.g. 'Antwort fehlt in den Optionen'.
**Parameters:** Choice: 2 to 4 options, unique ids (qtypes.js:79-80). Blank text '{{blank}}' needs fill on every option (qtypes.js:81). Typed: answer non-empty and check(answer) must equal 'ok' (qtypes.js:105-106). Match: left and right the same length, leftValues the same length as left, sorted leftValues equal sorted right values (qtypes.js:148-150). Every question needs a label (qtypes.js:188).
**Edge cases handled:** choiceQuestion (questions.js:17-19) does not itself check that the answer is among the choices; only the validation does.; In the files read, validateQuestion is exported but not called by the runtime code; it is the test contract.
**Confidence:** High

### RULE-130: Choice question: check gate and grading
**Category:** Validation
**Priority:** P1
**Source:** `core/js/qtypes.js:93-94`
**Also cited:** core/js/lesson.js:58-61,70
**Plain English:** A choice question can only be checked after an option is selected; it is correct if the selected option's id equals the answer id, otherwise wrong. There is no nearly-correct level.
**Specification:**
  Given A choice question with options A, B, C and answer B, with nothing selected yet.
  When  The player tries to check, then selects C and checks, then (in another question) selects B and checks.
  Then  With nothing selected the Prüfen button is disabled (quiz.js:97) and check does nothing (quiz.js:142). Selecting C and checking gives bad. Selecting B gives ok.
**Parameters:** Options may be selected by click or by the keys 1 to 4 (qtypes.js:95, 97). Digit keys only select when that option exists.
**Edge cases handled:** Check only runs in state ask; after the answer, option buttons are disabled (qtypes.js:90) and the round moves on through feedback.; Choice grading is exact id equality, so no normalisation applies.; Keyboard digit selection is ignored while a text input has focus (quiz.js:204).
**Confidence:** High

### RULE-131: Perfect-round and combo trophies
**Category:** Validation
**Priority:** P1
**Source:** `core/js/rules.js:20-21`
**Also cited:** (perfectRound und combo), verdrahtet über core/js/appconfig.js:50 und ausgewertet in core/js/rounds.js:45
**Plain English:** The 'perfect' trophy goes to a lesson or boss round with no wrong and no 'almost' answers that is not failed. The 'combo5' trophy goes to a round whose longest streak of correct answers is at least 5.
**Specification:**
  Given A lesson round on 'etre' with 8 correct, 0 almost, 0 wrong and best combo 8, not failed.
  When  The round is finalised.
  Then  The new trophies include 'perfect' and 'combo5'. The failed round in the 'Gescheiterte Runde' test does not get 'perfect' (tests/rounds.test.js:34-38).
**Parameters:** Rule types in core/js/rules.js:20 (perfectRound: mode not blitz, not failed, wrong 0, almost 0) and core/js/rules.js:21 (combo: bestCombo >= min). Content: content/fr-verben/badges.json:4-5 (combo min 5).
**Edge cases handled:** A round with one 'almost' answer is not perfect, even with zero wrong answers (core/js/rules.js:20). The listed tests do not assert this case.; Blitz rounds never earn 'perfect' (core/js/rules.js:20).
**Confidence:** Medium — Citation was corrected by referee (Das Verhalten existiert, steht aber nicht in der zitierten Stelle. tests/rounds.test.js:20-25 ist ein Test, der die Trophäen 'first', 'etre3', 'perfect' und 'combo5' prüft; er implementiert nichts. Die Logik liegt in core/js/rules.js:20 (perfectRound: res.mode !== 'blitz' && !res.failed && res.wrong === 0 && res.almost === 0) und core/js/rules.js:21 (combo: res.…

### RULE-132: Trophäen-Aufbau prüfen (Tippfehler finden)
**Category:** Validation
**Priority:** P1
**Source:** `core/js/rules.js:39-52`
**Plain English:** Jede Trophäen-Regel wird vor dem Start auf Aufbau geprüft. Unbekannte Typen und Regeln mit fehlenden Angaben werden als Fehler gemeldet, damit sie nicht still nie erreicht werden.
**Specification:**
  Given Eine Trophäen-Regel aus badges.json mit Typ, Seiten-ID und Parametern.
  When  Die Regel wird ohne Auswertung auf Aufbau geprüft (ruleErrors).
  Then  Ein unbekannter Typ, eine unbekannte Seiten-ID, fehlende ids bei 'units', leere rules bei 'all'/'any', min kleiner oder gleich 0 bei 'combo'/'blitz' oder days kleiner oder gleich 0 bei 'streak' ergeben je einen Fehlertext. Eine gültige Regel ergibt keine Fehler.
**Parameters:** Erlaubte Typen: anyUnit, unit, units, perfectRound, combo, blitz, boss, streak, all, any (core/js/rules.js:16-27, Referenz).
**Edge cases handled:** Unbekannter Typ bei der Auswertung wirft einen Fehler (line 45), statt still falsch zu liefern.; Unbekannte Seite 'x' ist ein Fehler (line 48).; combo ohne min ist ein Fehler (line 49).
**Confidence:** Medium — Citation was corrected by referee (Das Verhalten ist im Code vorhanden, die zitierte Stelle ist aber nur der Test, der es prüft, nicht die Implementierung. Die Funktion ruleErrors steht in core/js/rules.js:39-52 (legacy/modulare ist ein Symlink auf das Repo-Wurzelverzeichnis, deshalb liefert find ohne Symlink-Auflösung nichts). Dort gilt: unbekannter Typ gibt einen Fehler zurück (Zeile 41), unbek…

### RULE-133: Reset of one app's progress requires two confirmations
**Category:** Validation
**Priority:** P1
**Source:** `core/js/shell.js:137-144`
**Plain English:** Resetting one app's progress takes two clicks. It erases that app's stars, trophies, best scores, accuracy history and app XP, but keeps the player's name, total XP and streak.
**Specification:**
  Given The home screen is shown.
  When  'Fortschritt dieser App zurücksetzen' is clicked (core/js/views/home.js:66-66), then 'Wirklich alles löschen?' is clicked.
  Then  The first click sets the confirmation flag and shows the second link. The second click deletes all keys of the app store and replaces them with defaults (xp 0, stars {}, badges {}, best {}, last {}, acc {}), saves, clears the flag and redraws home (core/js/shell.js:138-143). Any other navigation to home cancels the confirmation (core/js/shell.js:128-128).
**Parameters:** None.
**Edge cases handled:** The profile store (name, total XP, streak, daily XP) is not touched, so the header level and XP do not change after a reset.; No backup prompt is offered before the reset.; The confirmation stays visible while the player remains on the home screen.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance-Blick: Würde ein Regulierer oder Prüfer eine stille Änderung bemerken? Nein. Die Regel betrifft den lokalen Lernfortschritt einer Lern-App (IndexedDB im Browser, kein Server, kein Geld, kein gesetzlich vorgeschriebener Datensatz). Das Zurücksetzen ist eine bewusste Nutzeraktion. Ein Fehle…

### RULE-134: Boss unlock: every unit needs at least one star
**Category:** Validation
**Priority:** P1
**Source:** `core/js/shell.js:43-43`
**Plain English:** The final boss (Endgegner) opens only after every unit has at least one star, unless the app defines its own unlock rule.
**Specification:**
  Given App progress with star counts per unit; the app config either has no bossUnlocked function or has one.
  When  The home screen is drawn, or the player presses the boss start button.
  Then  The boss counts as open when every unit has stars > 0 (or when config.bossUnlocked(ctx) returns true). When closed, the boss button is disabled with the label 'Noch gesperrt' (core/js/views/home.js:46-46), and the action handler ignores the click (core/js/shell.js:132-132).
**Parameters:** Threshold: stars > 0 per unit, no minimum star count. Override: config.bossUnlocked(ctx) (core/js/shell.js:43). Boss card is shown only if config.rounds.boss exists (core/js/views/home.js:28, 46).
**Edge cases handled:** An empty unit list makes every() return true, so the boss opens.; If the app has no boss round, the boss card is hidden entirely regardless of progress.
**Confidence:** High

### RULE-135: Unreadable or non-object stored document falls back to defaults
**Category:** Validation
**Priority:** P1
**Source:** `core/js/store.js:25-36`
**Plain English:** A learner's stored progress is used only if it is a readable plain object. Otherwise the app starts from the default state.
**Specification:**
  Given A document key is requested (for example the profile or an app's progress).
  When  createStore() loads the document.
  Then  The stored value is read from IndexedDB; if the read throws, it is treated as absent. If nothing is stored (undefined), the legacy localStorage copy is tried. Only a plain object (not an array, null, number, or string) is used; anything else gives a fresh copy of the defaults.
**Parameters:** isPlain: non-null object that is not an array (core/js/store.js:6).
**Edge cases handled:** A read error is indistinguishable from an empty store. Because save() writes the in-memory state, the next save() can overwrite the real stored document with defaults (suspected data-loss path).; A stored array or null is replaced by defaults without any warning, and the stored record stays in place until the next save() overwrites it.; Each call to createStore starts from a clone of the defaults, so defaults are never mutated.
**Suspected defect:** A transient IndexedDB read error followed by a save() can overwrite good stored progress with defaults. The code does not distinguish 'not found' from 'read failed' (core/js/store.js:27-28).
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Faithful: the cited code matches the stated rule. store.js:27 treats a throwing db.get as undefined, store.js:28-29 then tries db.legacy(key), and store.js:35 uses the stored value only if isPlain (non-null, non-array object, store.js:6). Otherwise state = fresh() (store.js:34, 43). The rule text om…

### RULE-136: Missing lesson has no fallback
**Category:** Validation
**Priority:** P1
**Source:** `core/js/theory.js:8`
**Plain English:** If a unit has no lesson in the content, the theory page cannot be built and has no fallback message.
**Specification:**
  Given A unit whose id has no entry in the lessons map.
  When  renderDefaultTheory runs.
  Then  spec is undefined (theory.js:8). lessonTop(spec) reads spec.tldr at lesson.js:26 and throws a TypeError before anything is drawn. No guard, default, or error message exists in these files.
**Parameters:** None.
**Edge cases handled:** Checking the content is left to the contract test outside these files (assertValidLesson in tests/helpers.js per AGENTS).; Notes without a lesson are never read; the lesson is mandatory for the page.
**Confidence:** Medium — Should a unit without a lesson in production show an explicit 'Lektion folgt' notice, or is a missing lesson treated as a content error that must never reach users?

### RULE-137: Texteingabe wird vor dem Vergleich vereinheitlicht (Groß/Klein, Apostroph, Leerzeichen, Akzente)
**Category:** Validation
**Priority:** P1
**Source:** `core/js/ui.js:20-24`
**Plain English:** Texte werden für den Vergleich in eine Standardform gebracht. Für die Erkennung von „fast richtig“ werden zusätzlich Akzente entfernt.
**Specification:**
  Given Richtige Antwort „êtes“.
  When  Die Eingabe ist „  ÊTES  “ bzw. „etes“.
  Then  Die Eingabe wird normalisiert und mit der Lösung verglichen.
**Parameters:** Trim, Kleinschreibung, Typografische Apostrophe ’ ` ´ werden zu ' (ui.js:21), Leerzeichenfolgen werden zu einem Leerzeichen (ui.js:21). stripAccents zerlegt in NFD und entfernt U+0300 bis U+036F (ui.js:24).
**Edge cases handled:** ß, ø und æ werden nicht vereinfacht.; ç wird zu c, ä zu a, ö zu o, ü zu u (nur stripAccents, nicht norm).; Der exakte Vergleich über norm behält Akzente, ist also streng.; Die Entscheidung „fast richtig“ fällt nicht in dieser Datei, sondern in core/js/qtypes.js:41 (nur zur Auflösung der Referenz gelesen).; Apostrophvarianten werden vor dem Vergleich vereinheitlicht.
**Confidence:** Medium — Was bedeutet „fast richtig“ (qtypes.js:41) für Punkte, Herzen und Sterne? Und soll eine Antwort ohne Akzente (etes statt êtes, Madchen statt Mädchen) dort Punkte bekommen?

### RULE-138: Kopfdaten der App pruefen (id, Titel, Gruss, Einleitung)
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:17-18`
**Plain English:** Die App braucht eine Kennung im festen Format und die drei Begrueßungstexte. Sonst wird das Paket abgelehnt.
**Specification:**
  Given Ein Manifest mit id 'deutsch-lrs' und title, greeting, intro gefuellt.
  When  bundleErrors prueft das Manifest.
  Then  Der Eintrag ist gueltig. Ist die id nicht nur aus Kleinbuchstaben, Ziffern und Bindestrich, wird 'manifest.id: Kleinbuchstaben, Ziffern, Bindestrich' gemeldet. Ist title, greeting oder intro leer, wird 'manifest.<feld> fehlt' gemeldet.
**Parameters:** Erlaubte Zeichen der id: a bis z, 0 bis 9, Bindestrich (mindestens ein Zeichen).
**Edge cases handled:** Beispiele, die scheitern: 'Deutsch' (Grossbuchstabe), 'mathe_1' (Unterstrich), leere id.; Ein Text mit nur Leerzeichen gilt als vorhanden, weil nur auf leer geprueft wird.; Eine id mit fuehrendem Bindestrich ist erlaubt.
**Confidence:** High

### RULE-139: Seiten des Lernpfads: Anzahl, Eindeutigkeit, Pflichtfelder
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:19-22`
**Plain English:** Es braucht mindestens eine Seite. Seiten-Kennungen duerfen sich nicht wiederholen, und jede Seite braucht Titel, Kurzname, Symbol und Farbe.
**Specification:**
  Given Zwei Seiten mit derselben id 'bruch', oder eine Seite ohne color.
  When  bundleErrors prueft die Seitenliste.
  Then  Fehlt die Liste oder ist sie leer, endet die Pruefung mit 'manifest.units fehlt'. Gibt es doppelte ids, wird 'Seiten-IDs sind nicht eindeutig' gemeldet. Fehlt ein Pflichtfeld, wird 'Seite <id>: <feld> fehlt' gemeldet.
**Parameters:** Pflichtfelder je Seite: id, title, de, ic, color.
**Edge cases handled:** Ein leerer Text gilt als fehlend (Pruefung auf Wahrheit).; Bei leerer Seitenliste werden Lektionen und Trophäen nicht mehr geprueft (Abbruch).; Die Reihenfolge der Seiten ist fuer die Pruefung ohne Bedeutung.
**Confidence:** High

### RULE-140: Lernstraenge und ihre Verweise
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:23-25`
**Plain English:** Ein Lernstrang braucht ein Etikett. Eine Seite darf nur einem Strang zugeordnet sein, der im Manifest angelegt ist. Seiten ohne Strang sind in Ordnung.
**Specification:**
  Given tracks = { lrs: { label: 'LRS-Foerderung' } } und eine Seite mit track 'lrs'.
  When  bundleErrors prueft die Stränge und die Verweise der Seiten.
  Then  Gueltig. Hat ein Strang kein label, wird 'tracks.<name>: label fehlt' gemeldet. Verweist eine Seite auf einen nicht angelegten Strang, wird 'Seite <id>: Strang <name> ist in tracks nicht definiert' gemeldet.
**Edge cases handled:** Fehlt tracks oder ist es kein Objekt, gilt es als leer. Dann meldet jede Seite mit track einen Fehler.; Seiten ohne track sind gueltig.; Ein leeres Objekt tracks ist gueltig, solange keine Seite und kein Material einen Strang nennt.
**Confidence:** High

### RULE-141: Lernmaterial: Titel, Strang und sicherer Pfad
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:26-30`
**Plain English:** Jedes Material braucht einen Titel und einen sicheren relativen Pfad. Nennt es einen Lernstrang, muss dieser angelegt sein.
**Specification:**
  Given Ein Materialeintrag ohne title oder mit href 'https://...'.
  When  bundleErrors prueft die Materialliste (resources, optional).
  Then  Fehlt ein Titel, wird 'resources[i]: title fehlt' gemeldet. Ist der href nicht sicher (siehe Regel zu isSafeHref), wird 'resources[i]: href muss ein relativer Pfad sein' gemeldet. Nennt der Eintrag einen unbekannten Strang, wird das wie bei Seiten gemeldet.
**Edge cases handled:** Fehlt resources, ist die Liste leer und gueltig.; Ein Eintrag, der null ist, meldet title fehlt und href muss ein relativer Pfad sein.; Der Pfad wird nicht auf Existenz der Datei geprueft, nur auf Form.
**Confidence:** High

### RULE-142: Trophaeen: Pflichtfelder, eindeutige Kennungen, gueltige Regel
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:38-42`
**Plain English:** Es braucht mindestens eine Trophaee. Kennungen duerfen sich nicht wiederholen, jede braucht Kennung, Zahl und Beschreibung, und die Regel muss aufgebaut sein.
**Specification:**
  Given Eine Trophaee ohne Beschreibung d, oder eine Regel, die auf eine nicht vorhandene Seite verweist.
  When  bundleErrors prueft die Trophaeen.
  Then  Fehlt die Liste oder ist sie leer, wird 'badges fehlen' gemeldet. Doppelte ids melden 'Trophaeen-IDs sind nicht eindeutig'. Fehlt id, n oder d, wird 'Trophaee <id>: <feld> fehlt' gemeldet. Fehler der Regel werden mit dem Pfad 'Trophaee <id>.rule' angehaengt.
**Parameters:** Pflichtfelder: id, n, d. Die Regelpruefung (ruleErrors, core/js/rules.js:39-52, nicht in dieser Liste) verlangt: bekannter Regeltyp; Seiten-IDs existieren; bei units ein ids-Feld; bei all/any eine nichtleere Regelliste; bei combo und blitz min groesser 0; bei streak days groesser 0.
**Edge cases handled:** Die Pruefung der Regel laeuft in rules.js. Diese Datei ruft sie nur auf.; Eine leere Liste rules bei all oder any wird abgelehnt.; Ein Wert 0 fuer n oder d gilt als fehlend (Pruefung auf Wahrheit).
**Confidence:** High

### RULE-143: Inhaltspaket als Ganzes pruefen (Tor vor dem Start)
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:47-51`
**Plain English:** Ein Inhaltspaket wird als Ganzes abgelehnt, sobald eine Pruefung fehlschlaegt. Eine halb kaputte App startet nicht.
**Specification:**
  Given Ein Inhaltspaket { manifest, lessons, badges, data } kommt aus der statischen Quelle, aus der HTTP-API oder aus dem lokalen Cache.
  When  assertBundle ruft bundleErrors auf (core/js/validate.js:11-45).
  Then  Gibt es Fehler, wirft assertBundle 'Inhalte ungueltig' mit den ersten zehn Meldungen. Gibt es keine, wird das Paket unveraendert zurueckgegeben. Die App wird dann nicht eingehaengt (Fehlerzustand in core/js/boot.js:17-25).
**Parameters:** Hoechstens 10 Meldungen werden angezeigt (core/js/validate.js:49).
**Edge cases handled:** Fehlt manifest oder ist es kein Objekt, endet die Pruefung nach dieser einen Meldung (core/js/validate.js:14, 16).; Fehlen manifest.units oder sind sie leer, endet die Pruefung frueh (core/js/validate.js:19). Lektionen und Trophaeen werden dann nicht geprueft.; data wird von der Paketpruefung nicht geprueft (core/js/validate.js:47-51). Ein Paket ohne data kommt durch.; Die Pruefung laeuft zur Laufzeit. Die strengere Schema-Pruefung liegt in den Tests und ist nicht Teil dieser Datei.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance-Sicht: Das Tor prüft Inhaltspakete einer Lern-App (Klasse 7). Es bewegt kein Geld, erfüllt keine gesetzliche Pflicht, verarbeitet keine personenbezogenen Daten und trifft keine Entscheidung, die ein Regulierer oder Finanzprüfer nachvollziehen müsste. Ein stiller Wechsel würde nur da…

### RULE-144: Materiallinks nur als sichere relative Pfade
**Category:** Validation
**Priority:** P1
**Source:** `core/js/validate.js:8`
**Also cited:** (isSafeHref), used at core/js/validate.js:29 (bundleErrors runtime check) and schemas/bundle.schema.json:63 (schema pattern); core/js/validate.js:8
**Plain English:** Material zum Öffnen oder Ausdrucken darf nur auf Dateien im eigenen Ordner 'files/' zeigen. Fremde Adressen, Skript-Links und Pfade mit Leerzeichen werden abgelehnt, sowohl beim Schema als auch zur Laufzeit.
**Specification:**
  Given Ein Material-Eintrag (resources) mit href.
  When  Das Paket wird gegen das Schema und zur Laufzeit (bundleErrors) geprüft.
  Then  Ein relativer Pfad wie 'files/blatt.pdf' ist erlaubt. Abgelehnt werden: 'javascript:alert(1)', 'https://example.org/x.pdf', '/x.pdf' (führender Schrägstrich), '../x.pdf' (Verzeichnis nach oben), 'files/a b.pdf' (Leerzeichen). Jede Ablehnung gilt im Schema und in der Laufzeitprüfung.
**Parameters:** Erlaubter Ort: relativer Pfad, Dateien in apps/<name>/files/ (AGENTS.md). Kein Schema oder Scheme in href.
**Edge cases handled:** Ein javascript:-Link wäre eine Skript-Einschleusung, deshalb P0 (line 48).; Die Liste der abgelehnten Werte ist in der Schleife (line 48) festgelegt; neue Muster müssen dort ergänzt werden.
**Suspected defect:** Der Ausdruck verbietet nur den Schraegstrich am Anfang, nicht den Backslash. Ein Wert, der mit zwei Backslashes und einem Host beginnt, wuerde von vielen Browsern wie eine externe Adresse (zwei Schraegstriche) behandelt und trotz der Pruefung nach aussen fuehren. Ob das ausnutzbar ist, haengt davon ab, wie resources.href spaeter ausgegeben wird (nicht Teil dieser Dateien).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/content.test.js:47-53) are assertions that verify the href rule. They do not implement it. The behavior exists in executable code elsewhere. The runtime check is isSafeHref at core/js/validate.js:8 (regex rejects a scheme such as javascript: or https:, a leading slash, "..", and whitespace, quotes, <, > characters). It is applied at core/j…

### RULE-145: Player name is required to be hidden once set, and is always shown escaped
**Category:** Validation
**Priority:** P1
**Source:** `core/js/views/home.js:26-27`
**Plain English:** The name entry box is shown only while no name is set. A stored name is shown as plain text, never as markup, so a name with HTML tags is displayed literally.
**Specification:**
  Given A profile with no name, and a profile whose name is '<b>x</b>'.
  When  The start page is rendered for each.
  Then  With no name, the name entry field id 'nm' is shown. With the name '<b>x</b>', the raw tag is not in the output and the name entry field is hidden.
**Parameters:** Name entry shown when profile.name is empty, max 20 characters, placeholder 'Wie heißt du?' (core/js/views/home.js:27). Name is escaped on output (core/js/views/home.js:26).
**Edge cases handled:** The 20-character limit is not asserted by the listed test.; The name is only displayed, never validated for content.
**Confidence:** Medium — Citation was corrected by referee (The behavior is implemented in core/js/views/home.js, not in the cited test. tests/views.test.js:17-24 only asserts it. home.js:26 builds the greeting with esc(profile.name), so a name like '<b>x</b>' is emitted as &lt;b&gt;x&lt;/b&gt; (esc() in core/js/ui.js:7 escapes &, <, >, "). home.js:27 emits the name form (input id="nm", placeholder "Wie heißt du?", maxle…

### RULE-146: Every verb form has a hint and distractors that exclude the correct form
**Category:** Validation
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:10-26`
**Plain English:** For every verb and every person there is a hint text, and the wrong options offered in a multiple-choice question never include the correct form.
**Specification:**
  Given Every verb in V and every person index 0 to 5.
  When  hint(verb, p) and distract(verb, p, 3) are built.
  Then  The hint is longer than 5 characters. The distractor list does not contain the correct form forms[p].
**Parameters:** Hint minimum length > 5; distractor count requested 3.
**Edge cases handled:** The returned distractor count is not asserted; only the exclusion of the correct form is.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/french.test.js:64-71) are a node:test assertion loop. They check the rule's properties but do not implement them. The behavior itself lives in builders.js: hint(v, p) at lines 10-18 returns HINT[v.key][p] when present, otherwise a generated string that always contains the infinitive and stem, so it is longer than 5 characters. distract(v,…

### RULE-147: Typed verb answers: pronoun prefix and case ignored, missing accent is 'almost', wrong letters are 'bad'
**Category:** Validation
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:34-41`
**Also cited:** legacy/modulare/apps/franzoesisch-verben/builders.js:34-41
**Plain English:** A typed verb form is accepted with or without a subject pronoun, in any capitalisation and with stray spaces; a form that differs only by a missing accent gets a partial 'almost' mark; a different word is 'bad'.
**Specification:**
  Given checkForm('êtes') for the form 'êtes', and checkForm('ai') for the form 'ai'.
  When  The inputs are checked: 'êtes', 'vous êtes', '  ÊTES ', 'etes', 'étez', "j'ai", and 'j’ai' with a typographic apostrophe.
  Then  'êtes', 'vous êtes' and '  ÊTES ' return 'ok'. 'etes' returns 'almost'. 'étez' returns 'bad'. "j'ai" and 'j’ai' return 'ok'.
**Parameters:** Three result states: 'ok', 'almost' (accent missing), 'bad'.
**Edge cases handled:** The test does not show whether 'almost' counts as correct for the score; only the check result is asserted.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/french.test.js:53-62) are test assertions. They check the behavior but do not implement it, so they cannot confirm the rule on their own. The behavior is implemented in legacy/modulare/apps/franzoesisch-verben/builders.js:34-41 (checkForm). Pronoun prefixes are stripped at line 35 via stripPronoun, which runs after norm() lowercases the in…

### RULE-148: Konjugationsaufgabe mit Platzhalter-Hinweis
**Category:** Validation
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:61-64`
**Plain English:** Bei der Konjugationsaufgabe bekommt man Pronomen und Infinitiv und soll die Form im Präsens eintippen. Der Platzhalter soll nur ein Beispiel zeigen.
**Specification:**
  Given Ein Verb und eine Person p.
  When  Die Konjugationsaufgabe wird gebaut.
  Then  Die richtige Form ist forms[p]. Die Eingabe wird mit checkForm geprüft. Der Platzhalter nennt die Form für 'nous' (forms[3]), unabhängig von der Person der Aufgabe.
**Parameters:** Platzhalter-Beispiel: forms[3].
**Edge cases handled:** Bei der Person nous (p=3) steht die richtige Antwort bereits im Platzhalter.; Das Pronomen im Aufgabentext wird pro Aufgabe zufällig gewählt (siehe Regel zur Subjektdarstellung).
**Suspected defect:** builders.js:63: placeholder nutzt immer v.forms[3]. Bei p=3 verrät er die Antwort. Bei anderen Personen ist das Beispiel für die Aufgabe irreführend.
**Confidence:** High

### RULE-149: Personenauswahl für Endungs- und Konjugationsaufgaben
**Category:** Validation
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:77-81`
**Plain English:** Bei einer Endungsaufgabe wird eine Person gezogen, die tatsächlich eine Endung hat. Bei Konjugationsaufgaben kann jede der sechs Personen kommen.
**Specification:**
  Given Ein Verb, und ob eine Endung verlangt ist.
  When  Eine Konjugations- oder Endungsaufgabe wird gebaut.
  Then  Endungsaufgabe: Person zufällig aus 0 bis 5 ziehen, bis ends[p] nicht leer ist. Konjugationsaufgabe: jede Person zufällig (builders.js:99).
**Parameters:** Person-Index 0 bis 5.
**Edge cases handled:** Hat eine Gruppe keine nicht-leere Endung, läuft die Schleife endlos. Gibt es in den Daten nicht, aber nicht geschützt.; Die Endung 'il' bei re-Verben ist in manchen Gruppen leer und wird dann nicht als Endungsfrage gestellt (Abhängigkeit von den Daten).
**Confidence:** High

### RULE-150: Eintipp-Prüfung für numerische Antworten
**Category:** Validation
**Priority:** P1
**Source:** `legacy/modulare/core/js/mathkit.js:12-20`
**Also cited:** core/js/mathkit.js:13-15
**Plain English:** Eine eingetippte Zahl gilt nur dann als richtig, wenn sie exakt dem Ergebnis entspricht; Einheiten, Leerzeichen und Dezimalkomma werden dabei ignoriert.
**Specification:**
  Given Die richtige Antwort ist 2,5 m (Wert 2,5)
  When  Die Schülerin oder der Schüler gibt etwas ein
  Then  '2,5 m', '2,5', '2.5', '2,50' gelten als richtig; '2' und '2,4' gelten als falsch; eine leere Eingabe gilt als falsch.
**Parameters:** Vergleich: Differenz kleiner als 1e-9 (keine Rundungstoleranz). Entfernte Zeichen: € % ° Euro grad cm m m² (mathkit.js clean). Leerzeichen entfernt, Komma als Dezimalzeichen. Minuszeichen (− und –) normalisiert. Platzhalter 'Zahl eintippen (Einheit)'.
**Edge cases handled:** Nur numerische Aufgaben, die nicht als Auswahl markiert sind (canType), werden eingetippt; Begriffsfragen bleiben Auswahl (builders.js:251, Markierung in builders.js:9).; Im Dreier-Takt der Lektionsrunde und im Endgegner (siehe Rundenaufbau) werden eingetippte Antworten gezielt gesetzt.; Die Prüfung liefert nur 'ok' oder 'bad', kein 'fast richtig'.
**Suspected defect:** Einheitenfehler werden stillschweigend akzeptiert. Eine Antwort in Metern (5 m) oder Millimetern (5 mm) gilt für eine Aufgabe in Zentimetern als richtig, weil die Einheit nie gegen die Aufgabe geprüft wird.
**Confidence:** Medium — Citation was corrected by referee (The rule is implemented, but not at the cited lines. apps/geometrie/builders.js:246-251 (absolute: /Users/dghaies/Sites/lernapp-sira/legacy/modulare/apps/geometrie/builders.js) only builds the typed question: it passes check: numCheck(item.value) (line 248) and a placeholder 'Zahl eintippen (${unit})' (line 248). The comparison itself lives in core/js/mathkit.js…

### RULE-151: Typed answer is graded exact, 'almost' if only accents differ, otherwise wrong
**Category:** Validation
**Priority:** P1
**Source:** `legacy/modulare/core/js/qtypes.js:37-43`
**Also cited:** core/js/qtypes.js:37-43
**Plain English:** A typed answer is compared after normalising case, spaces and typographic apostrophes. If the only difference is accents, the answer is 'almost' right. Anything else is wrong.
**Specification:**
  Given A typed question whose answer is 'chanté'.
  When  The learner types 'chanté', then 'chante', then 'gesungen'.
  Then  'chanté' grades 'ok'. 'chante' grades 'almost' (accent missing). 'gesungen' grades 'bad'.
**Parameters:** Normalisation norm(): trim, lowercase, typographic apostrophes (’ ` ´) become ', runs of whitespace collapse to one space (core/js/ui.js:21). Accent-insensitive comparison strips combining marks after NFD (core/js/ui.js:24). A question can replace this with its own check() (core/js/qtypes.js:121).
**Edge cases handled:** Case and surrounding spaces are ignored in the 'ok' comparison, so 'CHANTÉ ' grades 'ok'.; An empty or whitespace-only input is not graded at all (returns null, core/js/qtypes.js:119).; Whether 'almost' gives full or partial credit is decided in quiz.js, which is outside this file set.
**Confidence:** Medium — Citation was corrected by referee (Das zitierte Stück legacy/modulare/tests/qtypes.test.js:12-17 ist nur ein Test. Er ruft defaultCheck auf und prüft die drei Erwartungen (chanté: ok, chante: almost, gesungen: bad), setzt das Verhalten aber nicht um. Die Logik steht in legacy/modulare/core/js/qtypes.js:37-43: a === b ergibt 'ok', stripAccents(a) === stripAccents(b) ergibt 'almost', sonst 'bad'. D…

### RULE-152: Paketprüfung je Inhaltsordner
**Category:** Validation
**Priority:** P1
**Source:** `tests/content.test.js:16-36`
**Plain English:** Jeder Inhaltsordner muss zu einer App aus der Registry gehören und ein vollständiges, eindeutiges Paket sein. Jede Seite braucht genau eine Lektion, und jede Trophäen-Regel muss gültig sein.
**Specification:**
  Given Ein Inhaltsordner content/<id>/ mit manifest, lessons, badges und optional data.
  When  Die Tests laden das Paket und prüfen es gegen das Schema und die Querverweise.
  Then  Der Test besteht nur, wenn: der Ordnername zur Registry (oder zur Vorlage 'vorlage') gehört; jede live-App einen Ordner hat; manifest.id dem Ordnernamen entspricht; Seiten-IDs eindeutig sind; jede Seite genau eine Lektion hat; Merkzettel nur zu bekannten Seiten gehören; Trophäen-IDs eindeutig sind; jede Trophäen-Regel gültig ist; jeder Mini-Check eine Antwort hat, die in den Optionen steht.
**Parameters:** Ordner 'vorlage' ist erlaubt (content.test.js:18).
**Edge cases handled:** Ein Ordner ohne Registry-Eintrag schlägt fehl (line 19).; Eine live-App ohne Ordner schlägt fehl (line 20).; Eine Lektion, die nicht zu einer Seite passt, schlägt fehl (line 30).; Mini-Check-Antwort, die nicht in den Optionen steht, schlägt fehl (line 34).
**Confidence:** High

### RULE-153: Schema lehnt unvollständige oder falsche Pakete ab
**Category:** Validation
**Priority:** P1
**Source:** `tests/content.test.js:38-46`
**Plain English:** Ein Inhaltspaket wird abgelehnt, wenn Pflichtangaben fehlen oder Werte außerhalb der Liste liegen. Die Tests prüfen Gegenbeispiele gegen eine gültige Vorlage.
**Specification:**
  Given Die gültige Vorlage (content/vorlage) als Ausgang.
  When  Ein Feld wird gelöscht oder auf einen ungültigen Wert gesetzt, dann wird das Schema geprüft.
  Then  Das Paket wird abgelehnt bei: fehlendem Titel; ungültiger Farbe (nur erlaubte Werte); fehlendem Bild-Verweis (figure.diagram); unbekanntem Trophäen-Typ; zu wenigen Kernsätzen (tldr mit einem Satz); Schema-Version ungleich 1.
**Parameters:** Schema-Version: 1 (content.test.js:46 setzt 2 als Gegenbeispiel). tldr: mindestens 2 Sätze (siehe Vertragsregel Lektion). Schema: schemas/bundle.schema.json (Referenz, nicht gelesen).
**Edge cases handled:** Ein relativer Dateipfad für Material ist erlaubt (line 47).; Die Schema-Prüfung läuft mit allErrors und nicht im Strict-Modus (content.test.js:13).
**Confidence:** High

### RULE-154: Lektion und Sammelkarte haben alle Pflichtteile
**Category:** Validation
**Priority:** P1
**Source:** `tests/contract.test.js:22-30`
**Plain English:** Jede Seite muss eine vollständige Lektion und eine Sammelkarte haben. Fehlt ein Pflichtteil, schlägt die Vertragsprüfung fehl.
**Specification:**
  Given Die Lektion einer Seite (lessons) und das Sammelkarten-Feld (card: name und fact).
  When  Der Vertragstest prüft jede Seite der App.
  Then  Die Lektion ist gültig, wenn alle Pflichtteile da sind. Die Sammelkarte ist gültig, wenn name und fact gefüllt sind. Sonst schlägt der Test fehl.
**Parameters:** goal: mehr als 15 Zeichen; tldr: 2 bis 4 Sätze; steps: mindestens 3 Schritte; check: Frage, mindestens 3 Optionen, Antwort in den Optionen, eindeutige Option-IDs, Begründung (why). Diagramm: role=img und aria-label mit mindestens 10 Zeichen, gültiges XML. Prüfung in tests/helpers.js:42-55 (Referenz).
**Edge cases handled:** Ohne Sammelkarte schlägt die Prüfung fehl (line 27).; Die Antwort des Mini-Checks muss unter den Optionen sein (content.test.js:34).
**Confidence:** High

### RULE-155: Registry und Inhalt stimmen überein
**Category:** Validation
**Priority:** P1
**Source:** `tests/contract.test.js:9-12`
**Also cited:** 33-36
**Plain English:** Die Registry (Liste der Apps) und das Inhaltspaket müssen zusammenpassen: gleiche Kennung, gleiche Seitenzahl und gleicher Titel.
**Specification:**
  Given Ein Registry-Eintrag mit id, title und units, und die daraus gebaute Konfiguration.
  When  Der Vertragstest vergleicht beide.
  Then  Test besteht nur, wenn config.id gleich app.id, Anzahl der Seiten gleich registry.units und Titel im Manifest gleich Titel in der Registry ist.
**Parameters:** Keine Zahlen außer der Seitenanzahl aus der Registry.
**Edge cases handled:** Abweichender Titel schlägt fehl (line 35-36).; Abweichende Seitenzahl schlägt fehl (line 12).
**Confidence:** High

### RULE-156: Each unit has at least 10 unique questions and each question is internally consistent
**Category:** Validation
**Priority:** P1
**Source:** `tests/deutsch.test.js:12-20`
**Plain English:** Every Deutsch unit needs a pool of at least ten distinct questions, each with a real explanation and with the correct answer kept out of the wrong options.
**Specification:**
  Given The Deutsch question data loaded from content/deutsch via the disk source, with items per unit (q, s, a, wrong, why, kind).
  When  Each unit's pool is validated.
  Then  The pool has 10 or more items; no two items share the key 'q|s|a'; each item's why text is longer than 10 characters; the correct answer is not in wrong; wrong options are unique.
**Parameters:** Minimum 10 items per unit (tests/deutsch.test.js:14). Explanation minimum > 10 characters (line 18).
**Edge cases handled:** A missing sentence (s) is compared as an empty string in the duplicate key (line 15, 17).
**Confidence:** High

### RULE-157: Gap items have exactly one blank and at least one distractor; all other items have at least three distractors
**Category:** Validation
**Priority:** P1
**Source:** `tests/deutsch.test.js:21-26`
**Plain English:** A fill-in-the-blank item must show exactly one gap; every other question must offer at least three wrong answers.
**Specification:**
  Given An item with kind 'gap' and a sentence s containing the marker '___', or any other kind.
  When  The item is validated.
  Then  For kind 'gap': splitting s on '___' gives exactly two parts, and wrong has at least one entry. For any other kind: wrong has at least three entries.
**Parameters:** Blank marker '___'. Minimum distractors: 1 for gap, 3 otherwise.
**Edge cases handled:** Any kind other than 'gap' falls into the three-distractor rule.
**Confidence:** High

### RULE-158: Verb conjugation tables give the six correct forms in person order
**Category:** Validation
**Priority:** P1
**Source:** `tests/french.test.js:32-38`
**Plain English:** The French reference forms for the core verbs must be exactly right, in the order je, tu, il/elle, nous, vous, ils/elles, because a wrong form would teach a wrong French form.
**Specification:**
  Given The verb model V loaded from content/fr-verben.
  When  The forms of etre, faire, parler, finir and attendre are compared.
  Then  etre: suis, es, est, sommes, êtes, sont. faire: fais, fais, fait, faisons, faites, font. parler: parle, parles, parle, parlons, parlez, parlent. finir: finis, finis, finit, finissons, finissez, finissent. attendre: attends, attends, attend, attendons, attendez, attendent.
**Parameters:** Six persons per verb; index 0 = je through index 5 = ils/elles.
**Edge cases handled:** faire and finir repeat the same form for je and tu, which is correct French.; The test covers these five verbs only; other verbs in V are not checked here.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Faithful: legacy/modulare/tests/french.test.js:32-38 asserts exactly the five verb form arrays in the spec (etre, faire, parler, finir, attendre) in person order je..ils/elles, and the spec's Given (V loaded from content/fr-verben via diskSource and init at line 8) matches. I recomputed the forms fr…

### RULE-159: Each example sentence has one blank, a valid person, a known verb and a German translation
**Category:** Validation
**Priority:** P1
**Source:** `tests/french.test.js:40-51`
**Plain English:** Every practice sentence must have exactly one gap, point to a real verb and a person from 0 to 5, and carry a German translation; each unit must have as many sentences as its raw rows.
**Specification:**
  Given The raw example rows per unit: [verb, person, French sentence, German translation].
  When  Each row and each unit are validated.
  Then  Unit exists in UNITS; verb exists in V; person is between 0 and 5; the French sentence splits on '___' into exactly two parts; the German text is longer than 3 characters; SP[unit] has the same length as the raw rows.
**Parameters:** Blank marker '___'; person range 0 to 5; German minimum length > 3.
**Confidence:** High

### RULE-160: Generated geometry tasks have a correct answer outside the wrong options and numeric answers pass the number checker
**Category:** Validation
**Priority:** P1
**Source:** `tests/geometrie.test.js:33-42`
**Plain English:** Every generated geometry task must have an answer that is not among its wrong options, and numeric answers must be accepted by the shared number checker.
**Specification:**
  Given Every task generator in every geometry pool, 200 times each.
  When  Each generated task is checked.
  Then  The answer is not in wrong. wrong has at least two entries (the condition written is '>= 3 or >= 2'). If the task is numeric, numCheck(value)(answer) returns 'ok'.
**Parameters:** Minimum wrong options: 2 as written.
**Edge cases handled:** Numeric answers are checked with the shared number checker (core/js/mathkit.js), not by string equality.
**Suspected defect:** tests/geometrie.test.js:38 reads 'wrong.length >= 3 || wrong.length >= 2', which is the same as '>= 2'; the intended minimum of three is not enforced.
**Confidence:** Medium — Is the minimum for geometry tasks two wrong options or three? The test name and the first condition suggest three, but the written condition accepts two.

### RULE-161: Every app configuration has a valid id, unique unit and badge ids, complete fields, and a lesson per unit
**Category:** Validation
**Priority:** P1
**Source:** `tests/helpers.js:10-22`
**Also cited:** tests/helpers.js:10-39
**Plain English:** An app is accepted only if its id is lowercase letters, digits and hyphens, every unit and badge has its required fields, ids are unique, every unit has a lesson, and the required functions exist.
**Specification:**
  Given An app configuration object built from content and logic.
  When  assertValidConfig checks it.
  Then  id matches ^[a-z0-9-]+$. Unit ids are unique and each unit has id, title, de, ic, color. Theory is a function. Every unit has a lesson. rounds.lesson is a function. Badges exist, have unique ids, have id, n, d, and a when function.
**Parameters:** id pattern ^[a-z0-9-]+$; required unit fields id, title, de, ic, color; required badge fields id, n, d.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/contract.test.js:8-20) only loop over live apps and call assertValidConfig(config) (lines 8-15), plus a template test (17-20). They do not themselves check the rule's items. The checks are implemented in tests/helpers.js:10-39 (assertValidConfig). Mapping to the spec: id regex /^[a-z0-9-]+$/ at helpers.js:11; title at :12; units non-empty…

### RULE-162: Practice rounds have at least 3 questions and the blitz question is multiple choice
**Category:** Validation
**Priority:** P1
**Source:** `tests/helpers.js:24-37`
**Plain English:** Any app practice round must have at least three questions, and the 45-second blitz must always give a multiple-choice question.
**Specification:**
  Given An app configuration sampled 20 times (default).
  When  lesson rounds, boss and quick rounds, and the blitz question are generated.
  Then  Each lesson round has at least 3 questions, each valid. Boss and quick rounds are valid if present. The blitz question has kind 'choice' and is valid.
**Parameters:** Minimum round length 3; default sample count 20.
**Edge cases handled:** This minimum (3) is looser than the 8-question rounds asserted in the app tests.
**Confidence:** High

### RULE-163: A lesson must contain all required parts, and its mini-check must be well formed
**Category:** Validation
**Priority:** P1
**Source:** `tests/helpers.js:41-56`
**Also cited:** core/js/validate.js:31-37
**Plain English:** A lesson page must have a goal, 2 to 4 summary sentences, an analogy, a figure with a description and valid markup, at least 3 worked steps, a pitfall, a rule, and a mini-check with 3 or more distinct answers including the correct one and an explanation.
**Specification:**
  Given A lesson specification.
  When  assertValidLesson checks it.
  Then  goal is longer than 15 characters; tldr has 2 to 4 entries; analogy has title and html; figure has caption and an SVG that parses as XML, with role='img' and an aria-label of at least 10 characters; steps have at least 3 items; pitfall has html; rule exists; check has a question, at least 3 options with unique ids, the answer is one of the options, and check.why exists.
**Parameters:** goal > 15 characters; tldr 2 to 4 sentences; aria-label ≥ 10 characters; steps ≥ 3; check options ≥ 3.
**Edge cases handled:** The SVG must be valid XML, checked by parsing it.
**Confidence:** High

### RULE-164: Eingabeprüfung für Zahlen, Terme, Binär, Hex und Dezimal
**Category:** Validation
**Priority:** P1
**Source:** `tests/mathe.test.js:16-29`
**Plain English:** Typed answers are accepted leniently: decimal comma or point, minus sign variants, spaces, units and different notations are tolerated, but wrong values and empty input are rejected.
**Specification:**
  Given A correct numeric answer (for example −2.5 or 30 €), a correct algebraic term (for example 4x + 12), or a binary/hex/decimal number.
  When  The student types an answer that the checker compares.
  Then  Numbers: '−2,5', '-2.5', '−2,5' and ' -2,5 ' pass for −2.5; '30 €' passes for 30; '3' fails for 30; empty input fails for 0. Terms: '4x+12' and '4 x + 12' pass for '4x + 12'; '4x + 21' fails; '-x+13' passes for linear(−1, 13). Binary/hex (tests/informatik.test.js:30-40): leading zeros, a '0x' prefix, lower case and inner spaces are tolerated ('0010' → '10', '2 F' → '2F'); '12' as binary and 'abc' as decimal are rejected; '48' vs '47' is bad.
**Edge cases handled:** Test name says the term checker also ignores the multiplication dot (Malpunkt), but no assertion covers it.; Input is normalised before comparing (the helper norm()/stripAccents() pattern in AGENTS.md).
**Confidence:** High

### RULE-165: Jede Aufgabe akzeptiert ihre eigene richtige Antwort
**Category:** Validation
**Priority:** P1
**Source:** `tests/mathe.test.js:46-54`
**Plain English:** Every generated question in every math pool carries an answer that the app's own checker accepts, so no question can mark its own correct answer wrong.
**Specification:**
  Given 300 generated items for each unit pool in the mathe app (and in the informatik app, tests/informatik.test.js:52-62, for all question makers).
  When  An item is generated.
  Then  Numeric items: the checker for the item's value accepts its answer. Non-numeric items (unless choice-only): the term checker accepts the answer. Informatik: every generated question is valid and, for type questions, check(answer) returns 'ok'.
**Edge cases handled:** Choice-only items are skipped by this test.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance-Blick: Die Regel prüft die Antwortprüfer der Übungsaufgaben in einer Lern-App für eine Schülerin (AGENTS.md: Lernwerkstatt, Gamification). Es werden kein Geld bewegt, keine gesetzliche Pflicht erfüllt, kein Audit-Protokoll geführt und keine Noten im Schulsystem gesetzt. Eine stille Änderu…

### RULE-166: Single-choice answer is correct only when the picked option matches the stored answer
**Category:** Validation
**Priority:** P1
**Source:** `tests/qtypes.test.js:19-25`
**Plain English:** A multiple-choice question can only be checked after the learner picks an option, and it counts as correct only if the picked option's id equals the question's answer.
**Specification:**
  Given A choice question with options 'a' and 'b' and answer 'b'.
  When  No option is picked, then option index 1 (b) is picked, then option index 0 (a) is picked.
  Then  With no pick the check is not allowed (canCheck false). Picking b grades 'ok'. Picking a grades 'bad'.
**Parameters:** Grading logic at core/js/qtypes.js:93-94. The test does not assert choice questions with 3 or 4 options, and it does not assert the 2-to-4 option limit (core/js/qtypes.js:80), which is only checked by validate.
**Edge cases handled:** A choice question never grades 'almost'; only 'ok' or 'bad' are possible (core/js/qtypes.js:94).; Grading with no selection would throw, so the check guard (canCheck) must run first (core/js/qtypes.js:93).
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Die Regel ist im Code belegt und die Given/When/Then-Beschreibung stimmt. canCheck (legacy/modulare/core/js/qtypes.js:93) verlangt run.sel !== null, und grade (qtypes.js:94) gibt 'ok' zurück, wenn options[sel].id === answer, sonst 'bad'. Der Test (legacy/modulare/tests/qtypes.test.js:19-25) prüft ge…

### RULE-167: Matching question is valid only when left items, right items and left values line up
**Category:** Validation
**Priority:** P1
**Source:** `tests/qtypes.test.js:27-33`
**Plain English:** A matching question must have the same number of left items, right items and left values, and the left values must be exactly the set of right-hand values, each used once.
**Specification:**
  Given A matching question with 2 left items ['1','2'], 2 right items with values 'a' and 'b', and left values ['a','b'].
  When  The question is validated.
  Then  Validation passes. The test calls validateQuestion on this question (line 32).
**Parameters:** Checks in core/js/qtypes.js:147-151: equal lengths of left, right and leftValues; sorted leftValues must equal sorted right values.
**Edge cases handled:** A duplicated left value fails the sorted comparison, because the multisets no longer match.
**Confidence:** High

### RULE-168: App ids are unique and every subject has a colour
**Category:** Validation
**Priority:** P1
**Source:** `tests/registry.test.js:6-9`
**Plain English:** Each app in the registry has its own id, because the id is the storage key for its progress. Each app's subject must have a colour on the dashboard.
**Specification:**
  Given The app registry with 7 entries and the subject colours for Französisch, Mathematik, Deutsch, Englisch, Informatik and Physik.
  When  The registry is checked.
  Then  The number of distinct ids equals the number of entries, and every entry's subject has a colour.
**Parameters:** Subject colours in registry.js:9-16. The storage key is built from the id (core/js/profile.js:7).
**Edge cases handled:** Two apps with the same id would share one progress record, which is why the uniqueness check exists.
**Confidence:** High

### RULE-169: Progress trophies for the French app: four pages and the regular-verbs pair
**Category:** Validation
**Priority:** P1
**Source:** `tests/rounds.test.js:41-46`
**Plain English:** 'Les Quatre' is earned when the four basic verbs (être, avoir, aller, faire) each have at least one star. 'Endungs-Ass' is earned when the two regular-verb pages (er, irre) each have at least one star.
**Specification:**
  Given Stars of 1 each for etre, avoir and aller, and a lesson round on 'faire' with accuracy 1.0. Separately, stars of 1 for 'er' and a lesson round on 'irre' with accuracy 1.0.
  When  The round is finalised.
  Then  'four' is in the new trophies. 'regs' is in the new trophies.
**Parameters:** Rules in content/fr-verben/badges.json:6-7 (units rule with ids list). The other progress trophies are 'first' (any unit with at least one star, content/fr-verben/badges.json:2) and 'etre3' (unit etre with at least 3 stars, content/fr-verben/badges.json:3); both are checked in tests/rounds.test.js:20-26.
**Edge cases handled:** A unit rule counts as satisfied with 1 star, so 'Les Quatre' does not need 3 stars on each page.
**Confidence:** High

### RULE-170: Trophy ids are unique
**Category:** Validation
**Priority:** P1
**Source:** `tests/rounds.test.js:80-82`
**Plain English:** Each trophy in the French app has its own id. Ids are stored in the learner's data and must never be reused.
**Specification:**
  Given The French app's trophy list: first, etre3, perfect, combo5, four, regs, blitz10, boss, streak3.
  When  The trophy list is checked.
  Then  The number of distinct ids equals the number of trophies.
**Parameters:** Trophy definitions in content/fr-verben/badges.json:2-10.
**Confidence:** High

### RULE-171: Begrenzung numerischer Eingaben im Spielzeug
**Category:** Validation
**Priority:** P2
**Source:** `apps/informatik/theory.js:7`
**Plain English:** Zahlen, die im Spielzeug eingetippt werden, werden auf den erlaubten Höchstwert begrenzt; unlesbare Eingaben zählen als 0.
**Specification:**
  Given Ein Eingabefeld mit Höchstwert max (9999 bei der Stellentafel, 255 bei Dezimal-nach-Binär und Schieberegler, 127 bei der Addition).
  When  Der Wert wird gelesen.
  Then  Der Wert wird als ganze Zahl gelesen (parseInt), unter 0 auf 0 und über max auf max begrenzt. Beispiel: '300' im Addieren-Feld ergibt 127, 'abc' ergibt 0, '3.9' ergibt 3, '-4' ergibt 0.
**Parameters:** Obergrenzen: 9999 (theory.js:42, 51), 255 (theory.js:72, 75, 99, 108), 127 (theory.js:82-83, 87). Untergrenze 0.
**Edge cases handled:** Die Begrenzung ist still: der Schüler sieht keine Fehlermeldung, nur den begrenzten Wert.; Die Angabe min/max im HTML (theory.js:42, 72) wirkt im Code nicht; allein clampInt begrenzt.
**Confidence:** High

### RULE-172: XP-Ausgabe nie unter null
**Category:** Validation
**Priority:** P2
**Source:** `core/js/profile.js:68-71`
**Plain English:** Spending XP cannot make a total negative; spending more than is available leaves zero.
**Specification:**
  Given A profile and app with 2 XP, and an attempt to spend 3 XP.
  When  spendXP is called.
  Then  profile.xp = 0 and app.xp = 0.
**Edge cases handled:** Caller of spendXP is not visible in this test file.
**Confidence:** Medium — Citation was corrected by referee (The behavior is implemented. spendXP clamps both totals at zero with Math.max(0, x - amount), so spending 3 XP from 2 yields 0 for profile.xp and app.xp (legacy/modulare/core/js/profile.js:68-71). The cited lines, legacy/modulare/tests/profile.test.js:56-62, are a node:test case that asserts this behavior by calling spendXP(profile, app, 3) after addXP(..., 2) a…

### RULE-173: Streak trophy after three days in a row
**Category:** Validation
**Priority:** P2
**Source:** `core/js/rounds.js:41-46`
**Also cited:** core/js/profile.js:44-46, core/js/rules.js:24, core/js/appconfig.js:50, content/fr-verben/badges.json:10
**Plain English:** The 'Dranbleiber' trophy is earned when the learner has practised on three days in a row.
**Specification:**
  Given Profile streak 2 with last practice day 2026-10-24, and a lesson round on 2026-10-25.
  When  The round is finalised.
  Then  The streak becomes 3, and 'streak3' is in the new trophies.
**Parameters:** Trophy rule content/fr-verben/badges.json:10 (streak days 3), checked against the current streak in core/js/rules.js:24.
**Edge cases handled:** The trophy checks the streak as it stands on that day (streakNow, core/js/rounds.js:44), so a gap of more than two days resets it to 0 before the check.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/rounds.test.js:67-72) are a test that asserts the behavior: profile streak 2 with lastDay 2026-10-24, finalized on 2026-10-25, gives streak 3 and newBadges contains streak3. A test verifies behavior but does not implement it, so the citation does not show the rule. The behavior is implemented in legacy/modulare/core/js/rounds.js:41-46: tou…

### RULE-174: Player name required, trimmed, max 20 characters, asked once
**Category:** Validation
**Priority:** P2
**Source:** `core/js/shell.js:119-125`
**Plain English:** The name prompt accepts a non-empty name of up to 20 characters. Once a name is set, the prompt disappears.
**Specification:**
  Given The name prompt is shown, which happens only when profile.name is empty.
  When  'Los' is clicked or Enter is pressed in the field.
  Then  If the field is empty or only spaces, nothing happens. Otherwise the name is set to the trimmed value cut to 20 characters, saved, and the home screen is redrawn with the greeting that includes the name (core/js/views/home.js:26-26). The input has maxlength 20 (core/js/views/home.js:27-27). Enter triggers the same save (core/js/shell.js:164-164).
**Parameters:** Maximum 20 characters (core/js/shell.js:122-122; core/js/views/home.js:27-27).
**Edge cases handled:** The name cannot be changed in the UI, because the prompt shows only when no name exists (core/js/views/home.js:27-27).; Whitespace-only input is rejected silently, with no message.
**Confidence:** High

### RULE-175: Diagram accessibility wrapper
**Category:** Validation
**Priority:** P2
**Source:** `core/js/svg.js:8-9`
**Plain English:** Every diagram is emitted as an image with an accessible label, so screen readers get a description.
**Specification:**
  Given A diagram built with svg(width, height, inner, label).
  When  The diagram is rendered.
  Then  The output is an <svg> with class 'dg', viewBox 0 0 width height, role='img' and aria-label set to the escaped label (svg.js:9). Inner content is passed through unchanged.
**Parameters:** role='img'; viewBox built from width and height.
**Edge cases handled:** No check that label is present or non-empty; an empty label gives an empty aria-label.; The label is HTML-escaped, so quotes and '<' in a label do not break the attribute.
**Confidence:** High

### RULE-176: Continue card shows only the last-used live app
**Category:** Validation
**Priority:** P2
**Source:** `dashboard.js:37-43`
**Plain English:** The 'Weiter' card offers to resume the app the learner used last, but only if that app exists and is live.
**Specification:**
  Given profile.lastApp (last used app id) and the registry list.
  When  The home screen draws the continue section.
  Then  The card appears only if an entry exists with id equal to lastApp AND status 'live'. Otherwise the whole section is hidden. The card shows the title, done pages of total pages, the app's XP, and a 'Weiterlernen' button linking to href.
**Edge cases handled:** lastApp empty, unknown, or pointing at a soon app: section hidden.; Only one app can be offered; there is no list.
**Confidence:** High

### RULE-177: Strang-Verweise müssen bekannt sein
**Category:** Validation
**Priority:** P2
**Source:** `tests/content.test.js:56-61`
**Plain English:** Seiten und Material dürfen nur auf Lernstränge verweisen, die im Manifest definiert sind. Ein unbekannter Strang wird gemeldet.
**Specification:**
  Given Ein gültiges Paket 'deutsch', dessen erste Seite einen Strang trägt.
  When  Der Strang der ersten Seite wird auf 'xyz' gesetzt und bundleErrors läuft.
  Then  Das gültige Paket hat keine Fehler. Mit unbekanntem Strang meldet bundleErrors einen Fehler, der den Namen 'xyz' enthält.
**Parameters:** Lernstränge kommen aus manifest.tracks (AGENTS.md). Prüfung in core/js/validate.js (Referenz).
**Edge cases handled:** Gilt für Seiten und für Material (AGENTS.md).
**Confidence:** High

### RULE-178: Algebra-Erzeuger: Ausklammern, Aufstellen mit ganzzahliger Lösung, Lösungsanzahl
**Category:** Validation
**Priority:** P2
**Source:** `tests/mathe.test.js:134-144`
**Plain English:** Factored terms, set-up equations and solution-count questions are generated so that the stated answer is mathematically consistent.
**Specification:**
  Given Generated items from pools 'terme' and 'gleichungen'.
  When  A factor-out, set-up, or solution-count question is generated.
  Then  Factor-out: for 'a x + b' the answer 'd · (c x + e)' satisfies d × c = a and d × e = b. Set-up: the equation 'k x + c = r' has an integer solution, i.e. (r − c) is divisible by k. Solution count: the answer is one of 'keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen'.
**Edge cases handled:** Test does not check that d is the greatest common factor, only that the product matches.
**Confidence:** High

### RULE-179: Statische Dateien vollständig: CSS-Importe, Schriftdateien, Lizenz
**Category:** Validation
**Priority:** P2
**Source:** `tests/pages.test.js:23-29`
**Plain English:** Every stylesheet import and font file referenced by the shared CSS exists, and the font folder includes a licence file; every local link on a page must also point to an existing file.
**Specification:**
  Given core/styles/app.css, core/styles/fonts.css, core/fonts/, and the local href/src attributes on each page.
  When  The static files are checked.
  Then  Every @import url() and font url() target exists; core/fonts contains a file whose name starts with LICENSE; every local href/src value on the pages resolves to an existing file (pages.test.js:16-19).
**Edge cases handled:** The link check only sees double-quoted attributes without a colon, so single-quoted or external links are not checked.
**Confidence:** High

### RULE-180: Every question must have a label
**Category:** Validation
**Priority:** P2
**Source:** `tests/qtypes.test.js:50-52`
**Plain English:** A question without a visible label is rejected as invalid, whatever its type.
**Specification:**
  Given A typed question { kind: 'type', answer: 'a' } with no label.
  When  The question is validated.
  Then  Validation throws an error.
**Parameters:** Checked in core/js/qtypes.js:187-189 before the type-specific validate runs.
**Edge cases handled:** The label check runs before the type-specific checks, so a labelless question fails even when its type is otherwise valid.
**Confidence:** High

### RULE-181: Live apps must be complete and every app has status live or soon
**Category:** Validation
**Priority:** P2
**Source:** `tests/registry.test.js:11-20`
**Plain English:** Only 'live' or 'soon' are valid statuses. A live app must state its page count and must have a start file that exists.
**Specification:**
  Given Registry entries with status 'live' (for example fr-verben with units 6 and href apps/franzoesisch-verben/index.html) and status 'soon' (for example englisch).
  When  The registry is checked.
  Then  Each live entry has units > 0 and an existing href file. Each entry's status is 'live' or 'soon'; anything else fails.
**Parameters:** Registry entries in registry.js:18-66.
**Edge cases handled:** 'soon' apps are not checked for units or href, so placeholders need no start file.; A missing status fails the check, because undefined is not in ['live', 'soon'].
**Confidence:** High

## Lifecycle

### RULE-182: Reihenfolge beim Aufbau: pruefen, dann Logik vorbereiten, dann Lektionen
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/appconfig.js:24-27`
**Plain English:** Erst wird das Paket geprueft. Danach bekommt die Aufgabenlogik die Daten. Erst danach werden die Abbildungen gebaut. So erzeugt die Logik keine Fragen aus ungeprueften Daten.
**Specification:**
  Given Ein geprueftes Paket und eine Logik mit einer init-Funktion.
  When  buildConfig laeuft.
  Then  Zuerst prueft assertBundle. Dann ruft logic.init({ data, manifest }) auf. Danach werden die Lektionen mit ihren Abbildungen aufgebaut.
**Edge cases handled:** Ist das Paket ungueltig, wird init nie aufgerufen.; init ist optional. Fehlt es, passiert nichts.; Die Reihenfolge ist wichtig, weil Runden erst nach init erzeugt werden duerfen (AGENTS.md).
**Confidence:** High

### RULE-183: Blitz round: 45-second timer and end
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/blitz.js:76-82`
**Plain English:** The blitz runs for 45 seconds of real time. When the time is up the blitz ends and the result is reported; the player can also leave early, in which case no result is reported.
**Specification:**
  Given A blitz started with the default 45 seconds.
  When  The clock runs out, or the player presses the exit button.
  Then  Time left = max(0, 45 - elapsed seconds), refreshed every 100 ms. When time left is 0 the blitz ends (end(): done = true, timers stopped, onFinish with score, XP, best combo, level-up, goal-hit). On exit: done = true, timers stopped, onExit called and no result is reported.
**Parameters:** Duration = 45 s (blitz.js:16). Tick = 100 ms (blitz.js:76).
**Edge cases handled:** A wrong answer does not end the blitz; there is no heart system in blitz.; During the pause after an answer the timer keeps running; if time runs out in the pause, the end runs and the pending next-question callback returns because the round is done (blitz.js:50).; Answers are ignored after the end (blitz.js:34).
**Confidence:** High

### RULE-184: Fehlerzustand statt halbem Start
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/boot.js:17-25`
**Plain English:** Laedt die App nicht oder ist das Paket ungueltig, zeigt die Seite eine Fehlermeldung statt einer halb funktionierenden App. Die Kopfzeile bleibt stehen.
**Specification:**
  Given Die Inhalte fehlen oder sind ungueltig.
  When  bootApp laedt das Paket, baut die Konfiguration und haengt die Shell ein.
  Then  Bei jedem Fehler im Ablauf wird der Hauptbereich durch eine Karte 'Das hat nicht geklappt' mit der Fehlermeldung ersetzt. Die Meldung wird maskiert. Der Fehler wird zusaetzlich in der Konsole protokolliert.
**Edge cases handled:** Der Fehler beim Einhaengen der Shell wird genauso behandelt wie ein Ladefehler.; Der Zustand ist ein Endzustand bis zum Neuladen. Es gibt keinen automatischen Neuversuch.; Die Kopfzeile wird nicht veraendert.
**Confidence:** High

### RULE-185: Offline-Zwischenspeicher fuer API-Inhalte
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/content.js:50-66`
**Also cited:** core/js/content.js:50-67
**Plain English:** Jedes erfolgreich geladene Paket wird lokal gespeichert. Scheitert das Laden spaeter, zum Beispiel ohne Netz, wird das letzte gespeicherte Paket verwendet. Gibt es keines, bleibt der Fehler.
**Specification:**
  Given Die API hat die App 'deutsch' zuletzt erfolgreich geliefert, und jetzt ist das Netz weg.
  When  withCache.load('deutsch') ruft die Quelle auf, die einen Fehler wirft.
  Then  Das gespeicherte Paket unter dem Schluessel lernwerkstatt:content:deutsch wird gelesen, erneut geprueft und zurueckgegeben. Ist kein Paket gespeichert, wird der urspruengliche Fehler weitergereicht.
**Parameters:** Schluessel-Muster: lernwerkstatt:content:<App-Kennung>.
**Edge cases handled:** Erfolgreiche Ladevorgaenge schreiben das Paket in den Speicher. Schreibfehler werden ignoriert.; Ein Lesefehler im Speicher wird ignoriert, dann gilt wie 'kein Paket'.; Ein frisch geladenes, aber ungueltiges Paket (assertBundle wirft) loest ebenfalls den Rueckgriff auf den Speicher aus, weil der Pruefungsfehler innerhalb des try liegt. Ein alter gueltiger Stand uebe…; Wird das gespeicherte Paket erneut geprueft und ist ungueltig, wird dieser Pruefungsfehler geworfen.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/core-content.test.js:92-104) are a test that asserts the cache behavior; they do not implement it. The behavior is implemented in core/js/content.js:50-67 (withCache). There, on success the bundle is stored under 'lernwerkstatt:content:${appId}' (lines 51, 56-57), and when source.load throws, the cached bundle is read from storage and retu…

### RULE-186: Storage backend selection with fallback
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/db.js:100-112`
**Also cited:** tests/db.test.js:77-84
**Plain English:** The app stores progress in the browser's IndexedDB when it works, and falls back to localStorage (or memory only) when it does not. The choice is made once per page load.
**Specification:**
  Given The app needs to read or write progress and no database has been opened yet in this page session.
  When  getDB() is called for the first time (any read or write goes through it).
  Then  It opens IndexedDB 'lernwerkstatt' at version 1 and probes it with a read of '__probe'. If opening, blocking, or the probe fails, it switches to the fallback backend (localStorage if available, otherwise an in-memory Map). On success it also asks the browser for persistent storage (navigator.storage.persist). The chosen backend is cached for the page session.
**Parameters:** DB_NAME = 'lernwerkstatt'; DB_VERSION = 1 (core/js/db.js:6-7); probe key '__probe' (core/js/db.js:105); persist request (core/js/db.js:106).
**Edge cases handled:** onblocked rejects with 'IndexedDB blockiert' (core/js/db.js:34), so a blocked open falls back even if it could succeed later.; No switch back to IndexedDB within the same page session once the fallback is chosen.; If localStorage throws on write, the fallback keeps values only in memory (core/js/db.js:79-80), so they are lost on reload.; Fallback get() treats an empty string as absent (core/js/db.js:86).; Data written to localStorage by the fallback is picked up later by the legacy hand-over when IndexedDB works again (see the legacy hand-over rule).
**Suspected defect:** tests/db.test.js:77 title says memory-only fallback, but tests/db.test.js:81 asserts backend 'localstorage' while localStorage is undefined.
**Confidence:** Low — The test name says 'läuft im Arbeitsspeicher weiter' (memory-only), but the assertion expects backend === 'localstorage' (tests/db.test.js:81) while localStorage is also undefined. Is 'localstorage' only a label for the in-memory fallback, or should a real localStorage fallback exist? And should the label read 'memory' when neither storage is available?

### RULE-187: Altstand aus localStorage wird in IndexedDB übernommen
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/db.js:54-60`
**Also cited:** (legacy(): reads the localStorage key, removes it, returns the parsed value); core/js/store.js:28-31 (createStore falls back to db.legacy() and writes the migrated value to IndexedDB); core/js/store.js:38-40 (reads __v, deletes it from the data); core/js/store.js:51 (save() writes __v: version back…
**Plain English:** Beim ersten Start mit der neuen Datenbank werden die alten Fortschrittsdaten aus dem Browser-Zwischenspeicher übernommen. Danach sind sie in der neuen Datenbank und im alten Speicher entfernt. Der Versionsstand bleibt erhalten.
**Specification:**
  Given Alter Stand im localStorage mit xp 40, einem Stern auf der ersten Seite, Versionsfeld __v 1, und eine leere IndexedDB.
  When  Die App startet, die Startseite wird geladen, dann wird eine Runde gespielt.
  Then  Zwei Sterne sind angezeigt. Der alte localStorage-Eintrag ist entfernt. Nach der Runde steht das App-Dokument in der Datenbank mit xp >= 40, __v 1, und das Profil ist gespeichert.
**Parameters:** Versionsfeld __v: 1 (line 137, 145). Schlüssel lernwerkstatt:app:<id> (line 80).
**Edge cases handled:** Sammelkarte Silber für 2 Sterne wird angezeigt (line 139).; Die Übernahme muss vor der ersten Anzeige passieren (line 138).; Ein Verlust der Altdaten wäre der Schaden, daher P0.
**Suspected defect:** Removal happens before the parse and before confirmed storage. A corrupt or failed write loses the legacy data (core/js/db.js:56-59 and core/js/store.js:30).
**Confidence:** Medium — Citation was corrected by referee (The behavior exists in the legacy code, but the cited lines are not its implementation. scripts/smoke.mjs:134-146 is a test that exercises the behavior: it seeds localStorage with xp 40, one star and __v 1 (line 137), checks the star count and that the localStorage key is gone (line 138), plays a round (line 141), then reads the IndexedDB docs store and checks x…

### RULE-188: Auffrischen: Seite ist fällig nach drei Tagen
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/profile.js:12`
**Also cited:** (DUE_DAYS) and core/js/profile.js:79-82 (isDue); paths relative to legacy/modulare/
**Plain English:** A unit that already has stars is due for a refresh once three days have passed since it was last practised; units without stars are never due.
**Specification:**
  Given Unit a with 2 stars last practised on 2026-10-01; unit b with 0 stars last practised on 2026-10-01.
  When  isDue is checked on 10-02, on 10-04, and for unit b on 10-09.
  Then  Unit a is not due on 10-02 (one day later) and is due on 10-04 (three days later). Unit b with no stars is never due.
**Parameters:** DUE_DAYS = 3 (the test derives the threshold from this constant; the value is confirmed only by the 10-04 case).
**Edge cases handled:** Test builds dates by string concatenation, so it only works for single-digit days.
**Confidence:** Medium — Citation was corrected by referee (The cited test (tests/profile.test.js:67-72) does assert the rule, and each assertion matches the spec: line 69 checks unit a on 2026-10-04 (dayDiff 3, so true), line 70 checks 2026-10-02 (dayDiff 1, so false), and line 71 checks unit b with 0 stars on 2026-10-09 (false). But the lines only verify the behavior; they do not implement it. The executable logic is i…

### RULE-189: A failed lesson round gives no star progress and no perfect trophy
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/profile.js:76`
**Also cited:** (starsFor: failed -> 0); core/js/rounds.js:11 and :28 (stars assigned, written only if > stored value); core/js/rules.js:20 (perfectRound requires !failed); content/fr-verben/badges.json:4 (perfect -> perfectRound)
**Plain English:** If a lesson round is failed, the unit gets no stars and does not count as progress, and the perfect-round trophy is not awarded.
**Specification:**
  Given A lesson round on 'aller' that is failed, with accuracy 0.4, 2 correct and 5 wrong, and no earlier stars.
  When  The round is finalised.
  Then  Stars for this round are 0. app.stars.aller stays undefined. The 'perfect' trophy is not in the new trophies.
**Parameters:** Stars are 0 when failed (core/js/profile.js:76).
**Edge cases handled:** Even for a failed round the last practice date and the last accuracy are still written (core/js/rounds.js:26-27), which restarts the refresh timer for that unit. This is not asserted by the listed te…; The refresh bonus is withheld for a failed round (core/js/rounds.js:19).
**Suspected defect:** Possible: a failed repeat of an already-starred unit restarts the 'Zeit zum Auffrischen' clock (core/js/rounds.js:26), so the due date moves even though the learner did not succeed. Low confidence, confirm with the SME.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/rounds.test.js:34-39) are a test that asserts the behavior, not the implementation. The behavior is implemented in executable code elsewhere, and all three asserted parts hold there. (1) Stars are 0 on failure: core/js/profile.js:76 starsFor returns 0 when failed. core/js/rounds.js:11 assigns result.stars from it. (2) app.stars.aller stays…

### RULE-190: Matching question starts with zero pairs solved and is graded by the number of slips
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/qtypes.js:152-183`
**Plain English:** A matching question starts with no pairs matched. The learner picks a left item and then the right item it belongs to. Each correct pair is locked. A wrong pick counts as a slip. The question is 'ok' if there were no slips and 'almost' if there was at least one.
**Specification:**
  Given A new matching question with 2 left items.
  When  The question is initialised, then rendered.
  Then  The matched counter n is 0. The rendered HTML contains the left-item buttons (data-act="mleft").
**Parameters:** Mechanics live in core/js/qtypes.js:152-183 and are not asserted by the listed test. On a wrong right pick: slips +1, the first slip resets the combo and costs one heart, and when hearts reach 0 the question is 'bad' (core/js/qtypes.js:171-179). When all pairs are matched: 'almost' if slips > 0, else 'ok' (core/js/qtypes.js:173).
**Edge cases handled:** Only the first slip costs a heart, later slips in the same question do not (core/js/qtypes.js:176).; A matching question is never repeated in the second-chance round, per AGENTS.md (outside this file set).
**Confidence:** Medium — Should a matching question with one wrong pick be graded 'almost' (as core/js/qtypes.js:173 does), and should the first wrong pick cost a heart (core/js/qtypes.js:176-178)?

### RULE-191: Round end: completed or failed
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/quiz.js:158-166`
**Plain English:** A round is over when every question (including re-asked ones) has been answered, or when the player runs out of hearts; running out of hearts marks the round as failed.
**Specification:**
  Given A round where the player has 1 heart left, and the question on screen is answered wrong (bad feedback shown).
  When  The player presses Weiter (button or Enter).
  Then  The round ends with failed = true (quiz.js:160). If the hearts are still above 0 when the last question is passed, the round ends with failed = false (quiz.js:162).
**Parameters:** Failure condition: hearts <= 0 AND last feedback kind = 'bad' (quiz.js:160). Completion: index reaches the length of the question list, which grows with re-asked questions (quiz.js:162, 130).
**Edge cases handled:** The question that takes the last heart is not re-asked (quiz.js:129 requires hearts > 0).; On a match question, running out of hearts sets feedback to bad immediately (qtypes.js:178) and the round ends on the next Weiter.; Question states per question: ask (answer allowed) -> fb (feedback shown, inputs locked) -> next question or round end. Enter moves to the next question only when focus is not on a button (quiz.js:20…; The progress bar uses the list length including re-asked questions (quiz.js:94); this is display only.
**Confidence:** High

### RULE-192: Hearts: starting amount and loss
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/quiz.js:66`
**Plain English:** Each round starts with a number of hearts (lives); every wrong answer costs one heart. The boss fight has fewer hearts than a normal round.
**Specification:**
  Given A normal lesson round, or a boss round, just started.
  When  A normal round starts, or a boss round starts, or a question is answered wrong.
  Then  Normal round starts with 5 hearts; boss round starts with 3. Each bad answer (quiz.js:128) reduces hearts by 1. Hearts at 0 end the round (see round-end rule).
**Parameters:** Hearts normal = 5, boss = 3 (quiz.js:66, default parameter of startQuiz). Heart loss on a match question happens only on the first wrong pairing (core/js/qtypes.js:176-178).
**Edge cases handled:** On a match question, the second and later wrong pairings cost no hearts.; A retry answered wrong costs no heart (the retry branch returns before the heart loss, quiz.js:113-121).; Hearts are only reduced in settle (bad) and in the match first-slip branch; the displayed hearts never go below 0 in normal flow.
**Confidence:** High

### RULE-193: XP is kept when a round is left early
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/quiz.js:83-87`
**Plain English:** XP is added to the profile and saved after each answer, so leaving a round or blitz early keeps the XP already earned; leaving does not produce a round result.
**Specification:**
  Given A quiz round where 4 correct answers gave 10 XP each and one hint cost 3 XP; the player then presses the exit button.
  When  The player presses exit before the round ends.
  Then  The 37 XP net stay in the profile and app totals (saved after every answer). The exit calls onExit only; onFinish (the round result) is not called, so no result is recorded for that round.
**Parameters:** Save happens after each gained amount (quiz.js:87) and after each blitz answer (blitz.js:48).
**Edge cases handled:** The blitz exit behaves the same way (blitz.js:67).; Whether an abandoned round is logged is decided by the caller of onExit, not in these files.
**Confidence:** Medium — If a player leaves a round or the blitz before it ends, should the XP already earned stay (current behaviour) or be taken back? Should an abandoned round produce any record in the learning log?

### RULE-194: Abschluss einer Lektionsrunde: Tag, Genauigkeit und Auffrischen-Bonus
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/rounds.js:16-28`
**Also cited:** (isDue in core/js/profile.js:79-81); core/js/rounds.js:19-25 (bonus and refresh flag), with the due test at core/js/profile.js:79-82 and DUE_DAYS at core/js/profile.js:12
**Plain English:** When a lesson round ends, the unit's last-practice day and accuracy are recorded; if the unit was due, a 10 XP refresh bonus is paid and flagged once.
**Specification:**
  Given Unit a with 2 stars, last practised 2026-10-01, a round with 90 % accuracy and no failure, finished on 2026-10-10.
  When  The round is finalised, then a second round on the same day with 100 % accuracy is finalised.
  Then  First round: refresh = true, bonus = 10, app.xp = 10, last[a] = 2026-10-10, acc[a] = 0.9. Second round same day: refresh is not set (unit no longer due).
**Edge cases handled:** The bonus is credited to the app XP in this test; crediting to profile XP is not asserted.; The second round's bonus value is not asserted.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/profile.test.js:84-97) are a node:test assertion of the behavior, not its implementation. I read the executable logic and it matches the specification. The implementation is in legacy/modulare/core/js/rounds.js:16-28: for mode 'lesson', if isDue(app, id, day) and !result.failed, it sets result.refresh = true, adds 10 to res…

### RULE-195: Finishing a round evaluates, saves, logs and shows the result
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/shell.js:101-107`
**Plain English:** When a round ends normally, its result is evaluated, progress is saved, the round is logged, and the result screen is shown.
**Specification:**
  Given A round (lesson, quick, boss or blitz) has completed and calls onFinish.
  When  finishRound runs.
  Then  (1) finalizeRound updates stars, bests, bonus, streak and trophies (core/js/rounds.js, outside the listed files). (2) The profile and app stores are saved (ctx.save). (3) An event of type 'round' is logged with mode, unit id or null, accuracy, stars, failed, score and xp; a logging failure is ignored (core/js/db.js:136-138). (4) The quiz is stopped and the result screen is rendered.
**Parameters:** No numeric parameters. Logged fields are listed in core/js/shell.js:104-104.
**Edge cases handled:** Leaving a round through exit (core/js/shell.js:87-87) saves and logs nothing, so the partial round is discarded.; Blitz is logged with unit null (core/js/shell.js:104-104).; Bonus, refresh and newly earned trophies are not part of the logged event.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Cited code (legacy/modulare/core/js/shell.js:101-107) matches the rule: finishRound calls finalizeRound (rounds.js:10-45, which sets stars, bests, bonus, streak, badges), then ctx.save(), then logEvent with the listed fields (shell.js:104), then stop() and renderResult() (shell.js:105-106). db.js:13…

### RULE-196: Screen navigation state machine (home, theory, play, result)
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/shell.js:127-145`
**Plain English:** The app moves between four screens. Each move ends the current activity, and some moves clear the reset confirmation.
**Specification:**
  Given The view starts at 'home' (core/js/shell.js:38-38).
  When  A navigation action is clicked.
  Then  home to theory: open a unit (core/js/shell.js:129). home to play: start, quick, boss (only if open), weak, blitz (core/js/shell.js:130-134). theory to play: the start button in the theory view (core/js/shell.js:75). play to home: exit, which discards the round (core/js/shell.js:87). play to result: finish (core/js/shell.js:88, 97). result to play: 'Nochmal', 'Noch eine Runde' (core/js/views/result.js:26-28). result to theory: 'Theorie', lesson mode only (core/js/views/result.js:29). Any screen to home: header brand button, 'Zum Lernpfad', or the home action. Each transition calls stop(), which destroys the active quiz and removes confetti (core/js/shell.js:45-49). Going home clears the reset confirmation (core/js/shell.js:128-128).
**Parameters:** None.
**Edge cases handled:** Quick, blitz and boss buttons appear only if the app configures them (core/js/views/home.js:45-46, 58-58).; An unknown unit id in the theory view fails at unit.color, with no guard (core/js/shell.js:72-73).; A unit's result screen can start practice again without showing the theory first.
**Confidence:** High

### RULE-197: Saved progress is restored after reload; reset returns state to defaults
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/store.js:24-56`
**Also cited:** (Implementierung: createStore, save, reset); core/js/db.js:42 und db.js:100-109 (Backend 'indexeddb' und getDB)
**Plain English:** Progress written to the browser database is still there when the app starts again, and a reset puts the in-memory state back to its defaults.
**Specification:**
  Given A store is created with defaults { xp: 0, stars: {} } under key 'lernwerkstatt:t'.
  When  xp is set to 12 and stars.x to 3, the state is saved, the database connection is reset, and the store is created again with the same key.
  Then  The reloaded state has xp 12 and stars.x 3, and the backend reports 'indexeddb'. Separately, a store with xp 9 that is saved and then reset returns xp to 0 in memory (tests/db.test.js:51-55).
**Parameters:** Background save is awaited with a 20 ms timer in the test (tests/db.test.js:25). Store key pattern 'lernwerkstatt:<name>'.
**Edge cases handled:** save() is asynchronous; the reload test waits before reading back.; The reset test (tests/db.test.js:53) calls save() and reset() without waiting, and checks only the in-memory value; it does not prove the reset is persisted.
**Confidence:** Medium — Citation was corrected by referee (Das Verhalten ist im Code vorhanden, die zitierte Stelle ist aber nur der Test, der es prüft (tests/db.test.js:20-30 ruft createStore/save/resetDBForTests auf und assertiert xp 12, stars.x 3, backend 'indexeddb'). Die ausführende Logik liegt in legacy/modulare/core/js/store.js: createStore lädt per db.get(key) und führt die gespeicherten Felder über deepMerge(fr…

### RULE-198: Stored document schema version and migration hook
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/store.js:37-45`
**Plain English:** Each stored document carries a schema version. When an older or different version is loaded, a migration function can convert it. If migration or merging fails, the app resets to defaults.
**Specification:**
  Given A stored plain object is loaded with a '__v' field (missing means version 1).
  When  The stored version is compared with the code's version (default 1).
  Then  If they differ and a migrate function was passed, migrate(data, from) is called. The '__v' field is removed from the loaded state. Any exception during migration or merge sets state to the defaults. The version is written back as '__v' on the next save.
**Parameters:** Default version = 1 (core/js/store.js:24); from = __v or 1 (core/js/store.js:38).
**Edge cases handled:** Without a migrate function, data with a different version is used as is (core/js/store.js:39).; No downgrade guard: a stored version higher than the code's version is passed to migrate as is.; A failed migration silently resets the state to defaults, and the next save() overwrites the stored record.
**Suspected defect:** A failed migration discards the raw stored record. Nothing preserves it before save() overwrites it (core/js/store.js:42-44 with 51).
**Confidence:** High

### RULE-199: Document save is best-effort; reset restores defaults
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/store.js:50-56`
**Plain English:** Saving progress happens in the background. A failed save is silently ignored, and reset puts the document back to its defaults and saves that.
**Specification:**
  Given A store has been loaded and its state changed.
  When  save() is called, or reset() is called.
  Then  save() writes the whole state plus the version stamp '__v' to the document key without waiting, and drops any error. Each write replaces the whole document, so the last write wins. reset() sets state to a fresh copy of the defaults and then calls save().
**Parameters:** Version stamp field '__v' (core/js/store.js:51). Stored timestamp 'updatedAt' is set on each put (core/js/db.js:47).
**Edge cases handled:** Callers cannot detect a failed save; the app keeps running on the in-memory state.; Concurrent saves are not serialised; whichever transaction commits last defines the stored state.
**Confidence:** High

### RULE-200: Unit becomes due for refresh after 3 days
**Category:** Lifecycle
**Priority:** P1
**Source:** `core/js/views/home.js:24-24`
**Plain English:** A unit with at least one star is marked 'Zeit zum Auffrischen' once it has not been practised for 3 days.
**Specification:**
  Given The unit has stars > 0, and app.last[unit] holds the date of the last practice.
  When  The home screen draws the learning path.
  Then  The badge 'Zeit zum Auffrischen' appears on the unit node. The same condition drives the training recommendation (rule 'Training recommendation') and the refresh bonus (rule 'Refreshing a due unit').
**Parameters:** DUE_DAYS = 3 (core/js/profile.js:12). Due when the day difference from the last practice is at least 3 (core/js/profile.js:79-81).
**Edge cases handled:** A unit with 0 stars is never due.; A unit without a last-practice date is never due.; Exactly 3 days counts as due.; Unit lifecycle: not started (0 stars), then learned (>= 1 star), then due (>= 3 days since last practice), then refreshed (a new round sets the last date again; done in core/js/rounds.js, outside the…
**Confidence:** High

### RULE-201: Live versus soon status controls tile, link and storage access
**Category:** Lifecycle
**Priority:** P1
**Source:** `dashboard.js:47-49`
**Plain English:** Apps marked live are opened, linked and counted; apps marked soon are shown as a placeholder with no link and no progress.
**Specification:**
  Given A registry entry with status 'live' (fr-verben, mathe, geometrie, info-zahlen, deutsch; registry.js:20-63) or 'soon' (englisch registry.js:46, physik registry.js:65).
  When  The dashboard loads its data and draws the tiles.
  Then  live: the app's store is opened (dashboard.js:13), the tile is a link to href, and progress and badges are counted. soon: no store is opened (state is null), the tile is a non-clickable card with a 'Demnaechst' pill and no progress or badges.
**Edge cases handled:** The subject filter chips (dashboard.js:55) are built from all registry entries, so 'Englisch' and 'Physik' show only a Demnaechst tile.; The 'Weiter' card only ever targets live apps (dashboard.js:38).; No other status values exist in the code; any value other than 'live' is treated as soon in the tile logic (dashboard.js:47).
**Confidence:** High

### RULE-202: Home screen loads all data first, then draws once
**Category:** Lifecycle
**Priority:** P1
**Source:** `dashboard.js:9-16`
**Plain English:** The home screen waits until the learner profile and every live app's saved progress are loaded, then draws the whole page once. It only reads data.
**Specification:**
  Given The learner profile and the saved store of each live app (created with default values if missing).
  When  The home page is opened.
  Then  The profile is opened. The stores of all live apps are opened in parallel with appDefaults() (createStore(appKey(id), defaults)). Only after all of them are loaded are the hero, continue card and grid drawn. Soon apps are skipped.
**Edge cases handled:** Whether missing stores are written with their defaults depends on store.js (not read).; If opening any store fails, load() has no catch, so the page stays blank rather than showing it without progress.
**Suspected defect:** load() has no try/catch (dashboard.js:9-16). If a store cannot be opened the page stays empty, although AGENTS.md requires every storage access to tolerate errors and the app to run without storage.
**Confidence:** Medium — Does createStore in core/js/store.js already catch storage errors? If not, should the home page still draw without progress when a store cannot be opened?

### RULE-203: Modell-Initialisierung aus dem Inhaltspaket
**Category:** Lifecycle
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/model.js:25-38`
**Plain English:** Vor der ersten Runde werden Verben, Pronomen, Seiten, Sätze und Hinweise aus dem Inhaltspaket geladen. Der Aufruf darf mehrfach erfolgen und ersetzt dann den alten Stand.
**Specification:**
  Given Ein Inhaltspaket mit Daten (verbs, endings, pron, pqv, sentences, traps, hints) und Seiten (units).
  When  logic.init({ data, manifest }) wird aufgerufen.
  Then  Alle Listen werden ersetzt. Verben werden kopiert, dann mit key, Infinitiv, irr sowie ends und forms ergänzt (siehe Konjugationsregel). Sätze entstehen aus Zeilen [Verbschlüssel, Personen-Nummer, französischer Satz mit ___, deutsche Übersetzung] mit Kennung Seite plus Index.
**Parameters:** Zeilenformat einer Satzzeile: Index 0 Verb, 1 Person, 2 Satz mit ___, 3 Übersetzung.
**Edge cases handled:** Verbschlüssel und Personen-Nummer werden nicht geprüft. Ein unbekannter Verbschlüssel ergibt undefined und bricht später beim Aufbau der Aufgaben ab.; Die Kennung der Sätze hängt von der Reihenfolge in data.json ab. Umsortieren ändert die Kennung.; Die Prüfung der Inhalte liegt in den Tests des Gesamtprojekts, nicht in diesen Dateien.
**Confidence:** High

### RULE-204: Blitz: best score only goes up and the blitz trophy starts at 10 correct
**Category:** Lifecycle
**Priority:** P1
**Source:** `legacy/modulare/core/js/rounds.js:30-31`
**Also cited:** (best update), legacy/modulare/core/js/rules.js:22 (blitz trophy threshold), legacy/modulare/core/js/rounds.js:45-46 (award step)
**Plain English:** The blitz record keeps the highest score. A blitz round with 10 or more correct answers earns the 'Éclair' trophy. A lower score does not change the record and earns no trophy.
**Specification:**
  Given Best blitz score 8. Blitz round with score 12, then a separate blitz round with score 5 against the same best of 8.
  When  Each blitz round is finalised.
  Then  Score 12: best becomes 12 and 'blitz10' is awarded. Score 5: best stays 8 and 'blitz10' is not awarded.
**Parameters:** Best update in core/js/rounds.js:30-31. Trophy rule in core/js/rules.js:22 (blitz mode and score >= min). Content: content/fr-verben/badges.json:8 (min 10).
**Edge cases handled:** Blitz rounds give 0 stars (core/js/rounds.js:11) and never update per-unit stars.; Blitz trophy requires mode 'blitz' (core/js/rules.js:22).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/rounds.test.js:58-65) are a test that asserts the blitz behavior. They do not implement it. The behavior is implemented in executable code elsewhere. Best update: core/js/rounds.js:30-31 keeps app.best.blitz only when result.score is greater than the stored best. Trophy threshold: core/js/rules.js:22 returns true for blitz…

### RULE-205: Zurücksetzen leert Fortschritt
**Category:** Lifecycle
**Priority:** P1
**Source:** `legacy/modulare/core/js/shell.js:137-144`
**Also cited:** (Implementierung, Aufruf in Zeile 126-128 des Smoke-Tests), Standardwerte in legacy/modulare/core/js/profile.js:16
**Plain English:** Mit 'Zurücksetzen' wird der Fortschritt einer App gelöscht: XP auf 0 und alle Sterne weg.
**Specification:**
  Given Eine App mit XP und Sternen gespeichert.
  When  Der Nutzer wählt Zurücksetzen und bestätigt.
  Then  Der gespeicherte App-Stand hat xp = 0 und keine Sterne mehr (stars ist leer).
**Parameters:** Keine Zahlen.
**Edge cases handled:** Trophäen (badges) und Bestwerte (best) werden in diesem Test nicht geprüft.; Die Bestätigung ist ein zweiter Schritt (resetok), nicht nur ein Klick (line 126).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/scripts/smoke.mjs:126-128) are a test. They click the reset and resetok buttons, read the stored app document from localStorage, and assert xp===0 and an empty stars object. The test does not implement the reset. The behavior is implemented in legacy/modulare/core/js/shell.js:137-144. The reset action (line 137) only sets the con…

### RULE-206: Endgegner wird freigeschaltet, wenn alle Seiten einen Stern haben
**Category:** Lifecycle
**Priority:** P1
**Source:** `legacy/modulare/core/js/shell.js:43`
**Also cited:** (unlock predicate bossOpen; used at shell.js:65 and rendered as disabled in legacy/modulare/core/js/views/home.js:46)
**Plain English:** Der Endgegner (Boss) ist erst spielbar, wenn jede Seite mindestens einen Stern hat.
**Specification:**
  Given Lernstand mit einem Stern auf jeder Seite.
  When  Die Startseite wird geladen.
  Then  Der Boss-Knopf ist aktiv (nicht disabled). Die Boss-Runde läuft bis zum Ergebnis.
**Parameters:** Schwelle: 1 Stern je Seite (line 121). AGENTS.md nennt eine Anpassung über bossUnlocked(state), die hier nicht geprüft wird.
**Edge cases handled:** Der Test prüft nur den Fall 'alle Seiten haben einen Stern'; ohne Stern auf einer Seite ist nicht geprüft.; Nach dem Endgegner wird zurückgesetzt, der Test läuft danach wieder (line 126).
**Confidence:** Medium — Soll der Endgegner erst frei sein, wenn alle Seiten mindestens einen Stern haben? Oder genügt ein Teil? Der Test prüft nur den Fall 'alle Seiten haben einen Stern'. / Is the end boss meant to unlock only when every page has at least one star, as the start-page text says (core/js/views/home.js:46), and is this the gate the shell actually enforces?

### RULE-207: Stored data keeps unknown fields, gains new default fields, and migrates on version bump
**Category:** Lifecycle
**Priority:** P1
**Source:** `legacy/modulare/core/js/store.js:10-16`
**Also cited:** (deepMerge) and legacy/modulare/core/js/store.js:24-45 (createStore: __v, migrate, merge); core/js/store.js:10-16
**Plain English:** When the app adds new fields, old saved progress keeps its values and gets the new defaults; when the data format is versioned up, a migration function converts the old data.
**Specification:**
  Given Saved state { xp: 0, alt: 'bleibt' } is reopened with defaults { xp: 0, neu: { feld: 1 } }. Separately, a state { punkte: 5 } saved at version 1 is reopened at version 2 with migrate = old => ({ xp: old.punkte * 10 }).
  When  The store is created again with the new defaults (and, for the migration case, with version 2).
  Then  alt is still 'bleibt' and neu is { feld: 1 }. After migration, xp is 50 (5 × 10).
**Parameters:** Merge rule (tests/db.test.js:15-18): stored values override defaults, defaults fill missing fields (also nested, e.g. n.y = 2 when only n.x = 9 is stored), unknown stored keys are kept.
**Edge cases handled:** Migration is tested only for a version change from 1 to 2 with a rename of punkte to xp (×10).; A new field needs no migration; only a changed meaning of an existing field does (per the test design, no test for that case).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/db.test.js:32-49) are test assertions, not the implementation. They exercise the behavior: test 32-40 checks that unknown field 'alt' survives and new default 'neu' is filled, and test 42-49 checks that migrate runs on a version bump and yields xp 50. The executable logic lives in core/js/store.js. deepMerge (lines 10-16) keeps unknown sto…

### RULE-208: Serie: Folgetag, Gnadentag, Neustart und Verfall
**Category:** Lifecycle
**Priority:** P1
**Source:** `tests/profile.test.js:32-45`
**Also cited:** tests/rounds.test.js:67-70
**Plain English:** A daily streak grows by one for each consecutive day of practice, survives one skipped day, restarts after a longer break, and expires after a longer time without practice.
**Specification:**
  Given A streak that started on 2026-10-20.
  When  Practice is recorded on 10-21, again on 10-21, on 10-23, on 10-27, and the streak is checked on 10-28 and 11-05.
  Then  Streak is 2 after 10-21. Same day again: still 2. After 10-23 (one day skipped): 3 (grace day). After 10-27 (four days later): reset to 1. streakNow on 10-28 = 1; streakNow on 11-05 = 0.
**Parameters:** Grace day: one skipped day allowed. Expiry window not fixed by this test.
**Edge cases handled:** Practising twice on the same day does not add to the streak.
**Suspected defect:** Possible: a failed round keeps the practice streak alive, although the unit was not learned (core/js/rounds.js:41). Low confidence, confirm with the SME.
**Confidence:** Medium — How many missed days are allowed before a streak restarts? The test confirms one missed day (gap of 2 days) is forgiven and a gap of 4 days resets, but not a gap of 3 days. Also, after how many days without practice does the streak count as expired (the test only shows 1 day alive and 9 days expired)? / Should a failed round still count as practice for the streak (core/js/rounds.js:41 counts ever…

### RULE-209: A unit's best star rating is kept and never lowered
**Category:** Lifecycle
**Priority:** P1
**Source:** `tests/rounds.test.js:29-32`
**Plain English:** A unit keeps the highest star count the learner has earned. A later, weaker round does not reduce it.
**Specification:**
  Given A unit 'etre' that already has 3 stars.
  When  A lesson round on 'etre' with accuracy 0.5 (1 star) is finished.
  Then  The stored stars for 'etre' stay at 3.
**Parameters:** Update rule in core/js/rounds.js:28: stars are written only if the new value is higher than the stored one.
**Edge cases handled:** A first round always sets the stored value, because the default is 0.; A round with the same star count leaves the stored value unchanged.
**Confidence:** High

### RULE-210: Each trophy is awarded once, the first time its condition holds
**Category:** Lifecycle
**Priority:** P1
**Source:** `tests/rounds.test.js:74-78`
**Plain English:** A trophy that the learner already has is not awarded again. A new trophy is recorded as earned at the moment its condition is first met.
**Specification:**
  Given An app whose badges already include 'first' and 'perfect', and a perfect lesson round on 'etre'.
  When  The round is finalised.
  Then  Neither 'first' nor 'perfect' appears in the new trophies.
**Parameters:** Only trophies not yet in app.badges are checked (core/js/rounds.js:45), and each awarded one is stored as true (core/js/rounds.js:46).
**Edge cases handled:** Trophies are never taken away. The stored true is not reset when the condition later stops holding (core/js/rounds.js:46), which is not asserted by the listed test.
**Confidence:** High

### RULE-211: Initialisation: round content is bound once, before the first round
**Category:** Lifecycle
**Priority:** P2
**Source:** `apps/_template/builders.js:5-12`
**Also cited:** apps/geometrie/builders.js:7-23; apps/deutsch/builders.js:19-24
**Plain English:** Before any round is generated, the app must load the page list and the question pools. Until then, no round can be built.
**Specification:**
  Given The app boot has loaded the content bundle (manifest and data)
  When  init({ data, manifest }) runs, before the first round
  Then  UNITS is set to manifest.units and ITEMS to data.items. Round builders read only these module variables.
**Edge cases handled:** Before init runs, UNITS is [] and ITEMS is {}, so quickRound or blitzQuestion fail (pick of an empty list returns undefined, then .id throws).; data.items missing: ITEMS is undefined and every later round fails.
**Confidence:** Medium — Garantiert boot.js, dass init() vor dem ersten Aufruf von lesson/quick/boss/blitz läuft (und dass data.json nicht leer ist)?

### RULE-212: Zustand der Lampen-Tafel
**Category:** Lifecycle
**Priority:** P2
**Source:** `apps/informatik/theory.js:22-33`
**Plain English:** Jede Lampe ist an oder aus. Ein Klick kehrt die Lampe um, die Knöpfe Alle aus und Alle an setzen alle Lampen. Der Zustand wird nicht gespeichert und ist nach dem Neuladen wieder der Startzustand.
**Specification:**
  Given Eine Lampen-Tafel mit Startbelegung, z. B. [0,0,0,0,1,0,1,1] (theory.js:64) oder [1,1,0,1,0,1,1,0] (theory.js:122).
  When  Der Schüler klickt eine Lampe an oder drückt Alle aus bzw. Alle an.
  Then  Der Klick kehrt genau das angeklickte Bit um (0 wird 1, 1 wird 0). Alle aus setzt alle auf 0, Alle an auf 1. Danach wird die Anzeige neu gezeichnet und die Ergebnisse aktualisiert. Ein Neuladen setzt den Startzustand zurück.
**Parameters:** Schalter je Stellenwert: 0 oder 1, 8 Lampen (theory.js:9-10). Startbelegungen: 11 (theory.js:64) und 214 (theory.js:122).
**Edge cases handled:** Der Zustand liegt nur im Speicher der Seite; theory.js greift nicht auf die Speicherschicht zu.; Nach dem Klick erhält die angeklickte Lampe den Fokus zurück (theory.js:28), damit die Tastatur weiter funktioniert.
**Confidence:** High

### RULE-213: Zufällige Animations-Konfetti: Lebensdauer und Entfernung
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/confetti.js:4-15`
**Plain English:** Bei einem Anlass werden 46 bunte Papierstücke eingeblendet, die fallen und nach 5,2 Sekunden wieder entfernt werden.
**Specification:**
  Given confetti() wird ohne Argument aufgerufen.
  When  Die Funktion läuft.
  Then  Die Stücke verschwinden nach spätestens 5,2 Sekunden.
**Parameters:** Anzahl 46 (confetti.js:4). Sechs Farben (confetti.js:1). Position 0–100 vw (confetti.js:8). Fallzeit 2–4 s (confetti.js:10). Verzögerung 0–0,6 s (confetti.js:11). Entfernung nach 5200 ms (confetti.js:13).
**Edge cases handled:** Die Entfernung nach 5,2 s liegt nach dem spätesten Ende der Animation (0,6 + 4 = 4,6 s), also wird nichts zu früh gelöscht.; Bei reduzierter Bewegung blendet core/styles/base.css:103 die Klasse .cf aus. Die Stücke werden dann trotzdem erzeugt und nach 5,2 s entfernt.; core/js/shell.js:48 entfernt übrig gebliebene .cf-Knoten zusätzlich (nur zur Auflösung der Referenz gelesen).
**Confidence:** High

### RULE-214: Database schema: two collections
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/db.js:17-24`
**Plain English:** The database has two collections: 'docs' for keyed JSON documents (progress, settings) and 'log' for an append-only event history.
**Specification:**
  Given The database is opened for the first time or its version is upgraded.
  When  The upgrade handler runs.
  Then  It creates the 'docs' store (key path 'key') if missing, and the 'log' store (auto-increment id) with indexes on 'app' and 'ts' if missing. Existing stores are not rebuilt.
**Parameters:** DB_VERSION = 1 (core/js/db.js:7). Indexes: app, ts (core/js/db.js:21-22).
**Edge cases handled:** Adding any new collection requires bumping DB_VERSION and adding a branch in upgrade().
**Confidence:** High

### RULE-215: Worked-steps reveal one step at a time
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/lesson.js:36-39`
**Also cited:** 49-55
**Plain English:** The worked example starts with only its first step visible; each press of 'Nächster Schritt' reveals one more step, and the button disappears once all steps are shown.
**Specification:**
  Given A steps list with n items (n = 3 in a typical lesson).
  When  The page is rendered, then the learner presses 'Nächster Schritt' n-1 times.
  Then  Initially step 1 is visible and steps 2 to n carry the hidden attribute. Each click unhides the first still-hidden item. After the last one is unhidden the button is hidden too (lesson.js:55). The button is only emitted when n > 1 (lesson.js:39).
**Parameters:** Only step 1 is visible at start. Button label 'Nächster Schritt'.
**Edge cases handled:** n = 1: no button is rendered; the single step is shown at once.; n = 0: no list items are rendered and the button is absent; the handler finds nothing and does nothing.; The reveal state lives only in the DOM; a reload or re-render restarts at step 1 (no store call in this file).
**Confidence:** High

### RULE-216: Mini-check locks after the first answer
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/lesson.js:59-69`
**Plain English:** The mini-check allows one answer per page view: the first click disables all options, reveals the correct one and shows the explanation.
**Specification:**
  Given An unanswered mini-check with three or four options.
  When  The learner clicks any option.
  Then  Every button in the group becomes disabled (:63); the correct button gets class 'right' (:64); a wrong clicked button gets class 'wrong' (:66); the feedback box is shown (:68). Any later click on a disabled option is ignored (:59). There is no second attempt and no retry in this file.
**Parameters:** CSS classes 'right' and 'wrong'. Lock scope is the answer group (data-answer container).
**Edge cases handled:** Clicks on the 'Nächster Schritt' button are unaffected by the lock.; No XP, log event or store write happens here; the lock state is not persisted and resets on re-render.; Re-entering the page shows the mini-check fresh.
**Confidence:** High

### RULE-217: Minou-Stimmung wählt das Gesicht, unbekannte Stimmung wird zu „fröhlich“
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/mascot.js:18-19`
**Plain English:** Minou hat vier Stimmungen (fröhlich, jubelnd, traurig, nachdenklich). Die Stimmung bestimmt Augen und Mund. Eine unbekannte oder fehlende Stimmung ergibt fröhlich.
**Specification:**
  Given mascot() ohne Argument oder mit einer unbekannten Stimmung, z. B. „verwirrt“.
  When  Das Maskottchen wird gezeichnet.
  Then  Es wird eine der vier Stimmungen gezeichnet.
**Parameters:** Stimmungen happy (Standard), cheer, sad, hmm (mascot.js:4-16). Fallback EYES.happy und MOUTH.happy (mascot.js:19).
**Edge cases handled:** Eine ungültige Stimmung wird stillschweigend zu happy, es gibt keine Warnung.; Die Stimmung wird nur beim Zeichnen gelesen. Es gibt keine Übergänge in dieser Datei.; Welches Ereignis welche Stimmung setzt, steht nicht in dieser Datei.
**Confidence:** Medium — Welche Ereignisse sollen Minou in welche Stimmung versetzen (z. B. jubelnd bei einem Stern, traurig bei einer falschen Antwort, nachdenklich bei Hinweisen)?

### RULE-218: Tagesziel wird einmal pro Tag gemeldet
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/profile.js:63`
**Also cited:** (addXP, lines 53-65; GOAL at core/js/profile.js:5)
**Plain English:** The daily goal is announced only once per day, on the XP award that first reaches it.
**Specification:**
  Given A daily goal (GOAL) and a day.
  When  XP reaching the goal is awarded, then more XP is awarded the same day.
  Then  The first award that reaches GOAL reports goalHit = true; further awards on the same day report goalHit = false.
**Parameters:** GOAL (see XP-Gutschrift rule).
**Confidence:** Medium — Citation was corrected by referee (The cited test (legacy/modulare/tests/profile.test.js:26-30) asserts the behavior: addXP(GOAL) returns goalHit true, and a following addXP(10) on the same day returns goalHit false. It does not implement the behavior. The executable logic is in legacy/modulare/core/js/profile.js:53-65 (addXP), and line 63 is the actual check: goalHit = goalBefore < GOAL && profi…

### RULE-219: Trophy earned state and newly earned trophies
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/views/home.js:25-25`
**Plain English:** A trophy shows as earned once it is recorded for the app. Trophies earned in the last round are listed on the result screen.
**Specification:**
  Given app.badges[id] is set when a trophy is earned; result.newBadges comes from the round evaluation.
  When  The home or result screen is drawn.
  Then  Home: the 'got' style is applied when app.badges[id] is truthy. Result: a 'Neue Trophäen' block appears only if newBadges is not empty (core/js/views/result.js:9-9 and 33-33).
**Parameters:** Earning logic is in core/js/rounds.js:45-46 (outside the listed files): newBadges = trophies not yet earned whose when(state, result) is true; those are then flagged as earned.
**Edge cases handled:** Already earned trophies are not repeated on the result screen.; A full app reset clears all trophies (see the reset rule).
**Confidence:** High

### RULE-220: Collection album card tier from stars
**Category:** Lifecycle
**Priority:** P2
**Source:** `core/js/views/home.js:33-41`
**Also cited:** core/js/views/home.js:34-39
**Plain English:** Each unit with a card has a collectible card. It is locked with no stars and becomes Bronze, Silber or Gold with 1, 2 or 3 stars.
**Specification:**
  Given The unit has a card, and app.stars[unit] holds its star count.
  When  The home screen is drawn.
  Then  0 stars: card labelled 'Gesperrt', titled 'Geheimkarte', with a hint to finish the unit. 1 star: Bronze. 2 stars: Silber. 3 stars: Gold. Earned cards show the card name and fact. The album section is hidden if no unit has a card.
**Parameters:** Tiers 0 to 3 (medal labels in core/js/views/home.js:34-34).
**Edge cases handled:** Units without a card are skipped.; Stars are lost only through a full reset of the app (see the reset rule).
**Confidence:** Medium — Bestätigen Sie die Zuordnung 1 Stern = Bronze, 2 = Silber, 3 = Gold für die Sammelkarten. Der Test prüft nur 2 Sterne = Silber.

### RULE-221: 'Noch nicht gestartet' label for untouched apps
**Category:** Lifecycle
**Priority:** P2
**Source:** `dashboard.js:51`
**Plain English:** A live app with no XP and no finished pages shows 'Noch nicht gestartet' instead of zero counts.
**Specification:**
  Given state.xp and done (finished pages) for a live app.
  When  The app's tile is drawn.
  Then  If xp is 0 and done is 0, the label is 'Noch nicht gestartet'. Otherwise it is 'done von units Seiten · xp XP'.
**Edge cases handled:** XP without any finished page still shows the counts (for example '0 von 6 Seiten · 5 XP').; There is no separate 'begonnen' state; any XP or finished page counts as started.
**Confidence:** High

### RULE-222: Theorie-Seite: Tabelle, Selbsttest und Verbwechsel
**Category:** Lifecycle
**Priority:** P2
**Source:** `legacy/modulare/apps/franzoesisch-verben/theory.js:42-46`
**Also cited:** and legacy/modulare/apps/franzoesisch-verben/theory.js:63
**Plain English:** Auf der Theorie-Seite zeigt die Tabelle die sechs Formen. Die Lektion wird einmal gezeichnet und bleibt beim Verbwechsel erhalten. Im Selbsttest sind die Formen abgedeckt und können einzeln aufgedeckt werden.
**Specification:**
  Given Eine Seite mit Lektion und Verben (das erste Verb ist voreingestellt).
  When  Die Seite wird geöffnet, ein Verb gewechselt, der Selbsttest ein- oder ausgeschaltet oder eine Form angetippt.
  Then  Beim Öffnen steht das erste Verb der Seite in der Tabelle (theory.js:34). Bei unregelmäßigen Verben zeigt die dritte Spalte die deutsche Übersetzung, sonst 'Endung -x' oder 'keine Endung'. Der Selbsttest deckt alle sechs Formen ab (theory.js:61 und :65). Antippen deckt eine Form auf, bis der Selbsttest erneut umgeschaltet oder das Verb gewechselt wird. Die Lektion bleibt dabei erhalten (theory.js:41). Die Beispielsätze zeigen die ersten drei Sätze (theory.js:37).
**Parameters:** Beispielsätze auf der Theorie-Seite: 3. Anzahl der Tabellenzeilen: 6.
**Edge cases handled:** Verbwechsel und Selbsttest zeichnen nur die Tabelle neu (theory.js:53-79), nicht die Lektion.; smoke.mjs:4-10 prüft die Tabelle mit sechs Zeilen, den Stammwechsel bei aimer und den Selbsttest mit sechs versteckten Formen.
**Confidence:** Medium — Citation was corrected by referee (The behavior is implemented in executable code, but the cited line 41 is a comment ("Die Lektion wird nur einmal gezeichnet ..."), not logic. The mechanism is at 42-46: the lesson (lessonTop/lessonBottom) is written once into box.innerHTML. At 63, paint() only rewrites the [data-conj] node, so re-painting on verb change or cover toggle does not touch the lesson.…

## Policy

### RULE-223: Multiple-choice options: correct answer plus up to three distractors, shuffled
**Category:** Policy
**Priority:** P1
**Source:** `apps/_template/builders.js:14-17`
**Plain English:** Each choice question offers the correct answer together with at most three wrong answers, in random order, and the stored correct answer is the only one marked right.
**Specification:**
  Given An item with a = "Stuhl" and wrong = ["Tisch", "Lampe", "Bett", "Sofa"], and a question prompt q and explanation explain
  When  A choice question is built for this item
  Then  Options are "Stuhl" plus the first three wrong answers ("Tisch", "Lampe", "Bett"), shuffled, each with html = esc(value). The answer is "Stuhl", the label is "Wähle die richtige Antwort", and why is item.explain. "Sofa" is never shown.
**Parameters:** Distractors shown: at most 3 (item.wrong.slice(0, 3)). Option order: random via shuffle (core/js/ui.js:9-16, copy plus Fisher-Yates with Math.random). Label text: 'Wähle die richtige Antwort'.
**Edge cases handled:** wrong has fewer than 3 entries: the question shows fewer options, with no padding.; wrong has 4 or more entries: the 4th and later entries are silently dropped.; wrong contains the correct answer a: the same value appears twice as an option (duplicate option id), and the answer is ambiguous.; wrong is empty: a single option is shown, which is always the correct one.; The why text (item.explain) is passed without esc() (builders.js:16), while prompt and option html are escaped. Whether why is rendered as HTML is decided in core/js/quiz.js, which was not read.
**Suspected defect:** builders.js:16 passes item.explain unescaped into 'why'. Not verified: if quiz.js renders 'why' as HTML, data containing < or & would be injected. Compare builders.js:20, which also passes explain raw.
**Confidence:** Medium — P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Code gelesen: legacy/modulare/apps/_template/builders.js:14-17 baut Optionen aus shuffle([item.a, ...item.wrong.slice(0, 3)]), jede mit html = esc(v), answer = item.a, label 'Wähle die richtige Antwort', why = item.explain. Die Spezifikation stimmt damit überein (Ablenker auf 3 begrenzt, Sofa nie ge…

### RULE-224: Typed-answer question: the stored answer is the only expected answer, no options shown
**Category:** Policy
**Priority:** P1
**Source:** `apps/_template/builders.js:19-21`
**Plain English:** A typed question shows the prompt and an empty input field. The expected answer is the stored answer text, and the learner must type it.
**Specification:**
  Given An item with q = "Wie heißt die Hauptstadt von Frankreich?", a = "Paris", explain = "..."
  When  A typed question is built for this item
  Then  The question has kind 'type', label 'Schreibe die Antwort', prompt = esc(q), answer = "Paris", placeholder 'Antwort eintippen', why = explain. No option list is built.
**Edge cases handled:** Whether "paris", "Pariss" or "Páris" count as correct is decided by the quiz engine (AGENTS.md: norm() and stripAccents()). That logic is not in these files.; In the lesson round this typed question appears at positions 3 and 6 (see the lesson-round rule).
**Confidence:** Medium — Should a typed answer be accepted only when it matches after normalising case, spaces and apostrophes (norm), or also when only accents differ (stripAccents, e.g. 'etes' for 'êtes')? This template does not define the tolerance; the quiz engine does. Please confirm the intended tolerance for typed answers.

### RULE-225: Lesson round composition: 8 questions, every third one typed
**Category:** Policy
**Priority:** P1
**Source:** `apps/_template/builders.js:23-27`
**Plain English:** A lesson practice round has 8 questions drawn from one page's pool: six multiple-choice and two typed-answer questions, in a fixed pattern (choice, choice, typed).
**Specification:**
  Given A unit whose item pool ITEMS[unit.id] has N entries
  When  lessonRound(unit) is called
  Then  The pool is shuffled. Question i (i = 0..7) uses pool[i mod N]. Questions with i mod 3 = 2 (the 3rd and 6th) are typed; all others are choice. Result: 8 questions, 6 choice and 2 typed.
**Parameters:** Round length: 8 (builders.js:26). Typed slot: every 3rd question, index i mod 3 = 2 (builders.js:26).
**Edge cases handled:** N < 8: items repeat in the same round through the modulo index.; N = 0: pool[i % 0] gives undefined, so item.a throws a TypeError. The round cannot be built.; unit.id not in ITEMS: shuffle(undefined) throws (ui.js:10 calls list.slice on undefined).; The shuffle copies the pool (ui.js:10), so the stored data array is not reordered.
**Suspected defect:** The doc comment at builders.js:23 says the questions alternate between choice and typed ('abwechselnd'). The code gives a pattern of two choice questions then one typed question, not strict alternation.
**Confidence:** High

### RULE-226: Random question pick across all pages for the quick round and the blitz
**Category:** Policy
**Priority:** P1
**Source:** `apps/_template/builders.js:29-32`
**Also cited:** apps/mathe/builders.js:340-342
**Plain English:** The quick round (5 questions) and the 45-second blitz question are drawn at random from all pages together. Every question is multiple-choice.
**Specification:**
  Given The page list UNITS (from manifest) and each page's pool in ITEMS
  When  quickRound() or blitzQuestion() is called
  Then  quickRound returns 5 choice questions. Each one picks a page uniformly at random (pick(UNITS)) and then one item uniformly from that page's pool. The picks are independent, so the same item can appear more than once. blitzQuestion returns one such choice question.
**Parameters:** Quick round length: 5 (builders.js:31). Blitz: 1 question (builders.js:32). Selection: uniform over pages, then uniform over items within the page.
**Edge cases handled:** A page with a small pool gets the same chance as a page with a large pool, so each item on a small page is more likely to appear.; A page without data (missing or empty pool) makes anyItem return undefined or throw, since the page list is not filtered.; No typed questions in quick or blitz rounds.; Repeats within one quick round are possible.
**Confidence:** Medium — Should the quick round and blitz weight every item equally across pages (more questions from larger pools), or every page equally (the current behaviour)? Should a quick round avoid showing the same item twice?

### RULE-227: Eingabefragen-Plätze in der Übungsrunde
**Category:** Policy
**Priority:** P1
**Source:** `apps/deutsch/builders.js:59-61`
**Also cited:** apps/mathe/builders.js:332-338
**Plain English:** In a lesson round, the 3rd and 6th questions are typed-in answers when the item is a gap sentence; all other questions are multiple choice.
**Specification:**
  Given A lesson round of 8 items
  When  Each item is turned into a question
  Then  Positions 3 and 6 (index 2 and 5) become typed questions if the item is a gap sentence (kind 'gap'). Every other position, and every non-gap item, becomes a multiple-choice question.
**Parameters:** Typed every 3rd slot, offset 2 (builders.js:61: i % 3 === 2). Only items with kind 'gap' can be typed.
**Edge cases handled:** A round has at most 2 typed questions.; If the chosen items at positions 3 and 6 are not gap sentences, the round has no typed questions.; Whether typed questions occur therefore depends on the data mix, not on a guaranteed quota.
**Confidence:** High

### RULE-228: Endgegner-Runde: 12 Fragen, Seiten im festen Wechsel
**Category:** Policy
**Priority:** P1
**Source:** `apps/deutsch/builders.js:67-70`
**Also cited:** apps/mathe/builders.js:343-346
**Plain English:** The boss round has 12 questions that cycle through the units in a fixed order, and every fourth question is typed when the item is a gap sentence.
**Specification:**
  Given A list of n units and their pools
  When  The boss round is built
  Then  Question i (starting at 0) takes a random item from unit i mod n. Questions with i mod 4 = 3 (the 4th, 8th and 12th) are typed if the item is a gap sentence, otherwise multiple choice.
**Parameters:** Round size 12 (builders.js:67). Typed slot every 4th question, offset 3 (builders.js:69).
**Edge cases handled:** With 6 units each unit appears twice; with 5 units the shares are uneven (3, 3, 2, 2, 2).; Within a unit the item is random, so the same item can appear twice.; Typed count is at most 3, and depends on the data mix.; With zero units, the modulo draw fails. No guard.
**Confidence:** High

### RULE-229: Round sizes: lesson round 8 questions, boss 12, quick 5, blitz always multiple choice
**Category:** Policy
**Priority:** P1
**Source:** `apps/franzoesisch-verben/builders.js:104-132`
**Plain English:** Each French lesson page gives an eight-question round, the boss fight 12 questions, the quick round 5, and the 45-second blitz always shows multiple-choice questions.
**Specification:**
  Given Every page in UNITS, sampled 200 times, with the data loaded from content/fr-verben.
  When  lessonRound, bossRound, quickRound and blitzQuestion are generated.
  Then  Lesson rounds have 8 valid questions; boss has 12; quick has 5; the blitz question has kind 'choice' and is valid.
**Parameters:** Lesson 8, boss 12, quick 5, sampling 200 repetitions.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/french.test.js:10-30) are assertions that encode the rule: lessonRound length 8 (line 14), bossRound 12 and quickRound 5 (lines 22-23), and blitzQuestion().kind === 'choice' (line 27). They are tests, not the implementation, so they cannot confirm the behavior by themselves. The behavior is implemented in apps/franzoesisch-verben/builders.…

### RULE-230: Antwortauswahl: richtige Antwort plus drei falsche, Reihenfolge gemischt
**Category:** Policy
**Priority:** P1
**Source:** `apps/geometrie/builders.js:239-244`
**Also cited:** apps/mathe/builders.js:306-312
**Plain English:** Auswahlfragen zeigen die richtige Antwort und drei zufällige falsche Antworten in gemischter Reihenfolge.
**Specification:**
  Given Richtige Antwort 40°, falsche Antworten [140°, 50°, 30°, 60°]
  When  Die Auswahlfrage gebaut wird
  Then  Die Auswahl enthält 40° und drei zufällige der falschen Antworten. Die Reihenfolge wird in choiceQuestion gemischt (core/js/questions.js:18, nicht gelesen).
**Parameters:** Vier Auswahlmöglichkeiten. Zahlenwerte in Monospace-Schrift (mono), Begriffe als Text.
**Edge cases handled:** Die Auswahlfrage hat Label 'Wähle die richtige Antwort', falls kein eigenes Label gesetzt ist.
**Confidence:** High

### RULE-231: Number ranges per difficulty level
**Category:** Policy
**Priority:** P1
**Source:** `apps/informatik/builders.js:16`
**Plain English:** Each question type draws its numbers from a fixed range that depends on the difficulty level (easy, mid).
**Specification:**
  Given A question generator called with level 'easy' or 'mid' (default 'mid').
  When  The generator draws its random operand or target number.
  Then  Binary/decimal (binToDecQ, decToBinQ) draw from RANGE: easy 2 to 15, mid 10 to 63. Hex-to-decimal (hexToDecQ) draws easy 10 to 15, mid 16 to 99. Decimal-to-hex (decToHexQ) draws easy 10 to 31, mid 16 to 99. Binary addition operands (addQ) draw 1 to 7 (easy) or 1 to 15 (mid). Binary-to-hex (binToHexQ) draws 1 to 15 (easy) or 16 to 255 (mid). hexToBinQ draws 16 to 255. lampsQ draws 3 to 255. largestWeightQ draws 5 to 255. placeValueQ draws 100 to 9999. hexDigitQ draws digit values 10 to 15.
**Parameters:** RANGE = { easy: [2,15], mid: [10,63], hard: [40,255] } (builders.js:16). Hex and addition ranges are inline literals: hexToDecQ builders.js:164, decToHexQ builders.js:180, addQ builders.js:141, binToHexQ builders.js:207, hexToBinQ builders.js:224, lampsQ builders.js:96, largestWeightQ builders.js:128, placeValueQ builders.js:38, hexDigitQ builders.js:196.
**Edge cases handled:** The 'hard' level exists in RANGE and in hexToDecQ (builders.js:164), but POOLS (builders.js:247-253) and blitzQuestion (builders.js:278) only use easy and mid. Those branches are unreachable.; decToHexQ easy goes up to 31, but hexToDecQ easy stops at 15 (builders.js:164 and 180). The two easy levels are inconsistent.; Ranges are hardcoded in code, not in content, so changing a range means a code change.
**Confidence:** Medium — Should the easy ranges for decimal-to-hex (10 to 31) and hex-to-decimal (10 to 15) be the same? And is the 'hard' level (40 to 255) meant to come back for any unit, or can it be removed?

### RULE-232: Question pool for each lesson page
**Category:** Policy
**Priority:** P1
**Source:** `apps/informatik/builders.js:247-254`
**Plain English:** Each lesson page has a fixed set of question generators, and its practice rounds draw only from that set.
**Specification:**
  Given A unit id from the manifest (the ids are not in this file). POOLS maps each id to its generators.
  When  A lesson round, or a mixed round, asks for questions for that unit.
  Then  stellen: placeValueQ. binaer: binToDec easy, binToDec mid, lampsQ. dez2bin: decToBin easy, decToBin mid, largestWeightQ. addieren: carryQ, addQ easy, addQ mid. hex: hexDigitQ, hexToDec easy, hexToDec mid, decToHex easy, decToHex mid. binhex: binToHex easy, binToHex mid, hexToBinQ, nibbleMatchQ.
**Parameters:** Pool sizes: 1, 3, 3, 3, 5, 4 generators per unit.
**Edge cases handled:** A unit id that is not a key in POOLS gives undefined. lessonRound (builders.js:258-259) and allMakers (builders.js:270) then fail when they read pool.length or call the generator.; No pool contains the hard level, so the hard branches are never used (rule 2).
**Confidence:** High

### RULE-233: Round size and sequence (lesson, quick and boss rounds)
**Category:** Policy
**Priority:** P1
**Source:** `apps/informatik/builders.js:256-274`
**Also cited:** apps/informatik/theory.js:143
**Plain English:** A lesson round has 8 questions from one page. The quick round has 5 and the boss round has 12, both mixed from all pages. The same question generator is never used twice in a row.
**Specification:**
  Given A unit with its pool (rule 13). allMakers() is the concatenation of all units' pools (builders.js:270).
  When  lessonRound(unit), quickRound() or bossRound() is called.
  Then  lessonRound: 8 questions. Each one is picked at random from the pool, and the picker repeats until the chosen generator differs from the previous one (builders.js:261-266). Pools with one generator (stellen) can repeat it. bossRound: 12 questions, mixed uniformly from allMakers, with replacement (builders.js:273). quickRound: 5 questions, same method (builders.js:274).
**Parameters:** Lesson round 8, quick round 5, boss round 12 (hardcoded at builders.js:261, 274, 273).
**Edge cases handled:** The 'no repeat' rule compares generator references, not question content. Two different generators can still give the same question.; Mixed rounds draw with replacement, so the same generator can appear several times in one round.; Before init() runs, UNITS is empty (builders.js:5, 8-9). allMakers() is then empty and pick() returns undefined, which fails when called.; The boss round's 12 questions are not guaranteed to cover every unit.
**Suspected defect:** Hart codierte Zahl im Text statt aus der Rundenlänge abgeleitet (theory.js:143).
**Confidence:** High

### RULE-234: Blitz question draw (choice questions only, easy level)
**Category:** Policy
**Priority:** P1
**Source:** `apps/informatik/builders.js:277-284`
**Plain English:** The 45-second blitz asks only multiple-choice questions, drawn from easy generators, so the child can answer quickly.
**Specification:**
  Given A list of 8 generators: placeValueQ, binToDec easy, lampsQ, decToBin easy, carryQ, hexDigitQ, hexToDec easy, binToHex easy (builders.js:278).
  When  blitzQuestion() is called.
  Then  Pick a generator at random and call it. If the result has kind 'choice', return it. Otherwise try again, up to 30 times in total (builders.js:279-282). After 30 misses, return carryQ(), which is always a choice question (builders.js:283).
**Parameters:** Retry limit 30 (builders.js:279). Fallback generator carryQ.
**Edge cases handled:** Typed questions from any of the eight generators are discarded, so the blitz never asks for typing.; The fallback is practically unreachable: at least some generators always give choice questions with probability 1/2 or more.; The blitz timing (45 seconds) is not in this file.
**Confidence:** High

### RULE-235: Reihenfolge der Umformung: Summand vor Faktor
**Category:** Policy
**Priority:** P1
**Source:** `apps/mathe/builders.js:100-106`
**Plain English:** Beim Lösen einer Gleichung wird zuerst der Summand neben x auf die andere Seite gebracht, erst danach durch den Faktor geteilt.
**Specification:**
  Given a aus 2..9, b aus 2..15, x aus 2..9. Mit 50 % Wahrscheinlichkeit ist die Gleichung a x + b = c, sonst a x - b = c.
  When  Eine Umformungs-Aufgabe wird erzeugt (nur Auswahl).
  Then  Richtiger Schritt: '- b' bei Plus, '+ b' bei Minus. Falsch sind ': a', das gleiche Vorzeichen noch einmal und '· a'.
**Parameters:** a aus 2..9; b aus 2..15; x aus 2..9 (Zeile 101); 50 % Plus-Fall (Zeile 101).
**Edge cases handled:** Bei Minus-Gleichung wird die rechte Seite als Zahl mit Bindestrich ausgegeben (Zeile 102, Anzeige).
**Confidence:** High

### RULE-236: Inhaltsquelle: HTTP-API oder lokale Dateien
**Category:** Policy
**Priority:** P1
**Source:** `core/js/boot.js:10-14`
**Plain English:** Hat die Seite eine Meta-Angabe fuer eine Inhalts-API, kommen die Inhalte von dort, mit lokalem Zwischenspeicher. Sonst kommen sie aus den JSON-Dateien im Ordner content.
**Specification:**
  Given Eine index.html mit meta name='lw-content-api' und content='https://beispiel.de/api'.
  When  defaultSource wird aufgerufen.
  Then  Es wird die API-Quelle mit Zwischenspeicher gewaehlt. Ohne Meta-Angabe oder mit leerem content wird die statische Quelle unter dem Ordner content gewaehlt.
**Edge cases handled:** Ein leerer content-Wert fuehrt zur statischen Quelle.; Der statische Pfad wird relativ zur Seite aufgeloest. Der Zwischenspeicher gilt nur fuer die API-Quelle, nicht fuer die statische Quelle.
**Confidence:** High

### RULE-237: Statische Inhaltsdateien: Pflicht und Optional
**Category:** Policy
**Priority:** P1
**Source:** `core/js/content.js:12-28`
**Plain English:** Manifest, Lektionen und Trophaeen sind Pflicht. Fehlt eine dieser Dateien, schlaegt das Laden fehl. Die Aufgabendaten data.json sind optional und fehlen sie, gilt ein leeres Objekt.
**Specification:**
  Given Die Dateien manifest.json, lessons.json, badges.json vorhanden, data.json nicht vorhanden (Antwort nicht erfolgreich).
  When  createStaticSource.load(appId) laedt die vier Dateien gleichzeitig.
  Then  Das Paket wird mit data gleich {} zusammengesetzt und geprueft. Fehlt eine Pflichtdatei, wirft das Laden 'Inhalt nicht gefunden' mit Adresse und Statuscode.
**Edge cases handled:** Jede nicht erfolgreiche Antwort fuer data.json gilt als fehlend, auch ein Serverfehler 500.; Eine Datei mit ungueltigem JSON fuehrt zu einem Parse-Fehler, nicht zur Pflichtpruefung.; Die Dateien werden parallel geladen. Der erste Fehler bricht das Laden ab.
**Confidence:** High

### RULE-238: Backup export contents
**Category:** Policy
**Priority:** P1
**Source:** `core/js/db.js:120-123`
**Plain English:** A backup contains all saved documents and the newest 1,000 events, tagged with the app name and a format number.
**Specification:**
  Given The learner requests a backup.
  When  exportAll() runs.
  Then  It returns an object with app 'lernwerkstatt', format 1, the export time as an ISO string, all document entries (docs), and up to 1,000 of the newest log events.
**Parameters:** format = 1; app = 'lernwerkstatt' (core/js/db.js:122); log cap = LOG_MAX = 1000 (core/js/db.js:10).
**Edge cases handled:** In fallback mode, docs are read from localStorage keys with the 'lernwerkstatt:' prefix, excluding the log key (core/js/db.js:89).; Events older than the newest 1,000 are not included in a backup.
**Confidence:** High

### RULE-239: Event logging timestamp and error tolerance
**Category:** Policy
**Priority:** P1
**Source:** `core/js/db.js:136-142`
**Plain English:** Each event gets a timestamp automatically. Logging never stops the app: write errors are dropped, and reads return an empty list on error.
**Specification:**
  Given A caller logs an event or lists events.
  When  logEvent(entry) or listEvents(options) runs.
  Then  logEvent adds 'ts' = current time in milliseconds, unless the entry already has its own ts (the entry's fields are spread after the default). Any error is ignored. listEvents returns the stored events, or an empty list on error.
**Parameters:** ts = Date.now() (core/js/db.js:137).
**Edge cases handled:** A caller can overwrite the timestamp by passing its own ts.; Silent failure means lost events cannot be detected by the caller.
**Confidence:** High

### RULE-240: Event log retention and default read window
**Category:** Policy
**Priority:** P1
**Source:** `core/js/db.js:91-93`
**Plain English:** The event log keeps at most 1,000 entries in the fallback backend, while IndexedDB keeps all entries. Reads return the newest 200 entries per app by default.
**Specification:**
  Given Events are logged (for example a finished round).
  When  An event is added, the log is read, or the log is replaced by a backup restore.
  Then  Fallback: each add keeps only the newest 1,000 entries; logReplace keeps the newest 1,000. IndexedDB: adds are unbounded (core/js/db.js:62). Reads load the whole log, filter by app if given, and return the last 'limit' entries (default 200).
**Parameters:** LOG_MAX = 1000 (core/js/db.js:10); default read limit = 200 (core/js/db.js:63, 92).
**Edge cases handled:** The IndexedDB log is never trimmed, so its size grows with use.; IndexedDB reads load the full log on every call, then filter and slice (core/js/db.js:63-66).; Export uses the same 1,000 cap (core/js/db.js:122).
**Suspected defect:** Retention differs by backend: the fallback drops the oldest events beyond 1,000 but IndexedDB does not, so the visible history depends on which backend is active. SME question: should the IndexedDB log also be capped at LOG_MAX?
**Confidence:** High

### RULE-241: Lesson section order is fixed
**Category:** Policy
**Priority:** P1
**Source:** `core/js/lesson.js:25-45`
**Plain English:** Every theory page presents its lesson in one fixed order: goal, 30-second summary, everyday analogy, picture, then (after the app's practice toy) worked steps, typical pitfall with memory rule, and a mini-check.
**Specification:**
  Given A lesson spec with goal, tldr, analogy, figure, steps, pitfall, rule and check.
  When  lessonTop(spec) and lessonBottom(spec) render the page.
  Then  Output order is: 'Ziel' line (lesson.js:28), 'In 30 Sekunden' box (:29), analogy section (:30), figure with caption (:31); the app may insert its interactive toy between the two halves (caller, not in these files); then 'Schritt für Schritt' (:39), 'Typische Falle' and 'Merksatz' side by side (:40-43), and 'Mini-Check' (:44). No part is conditional in this code: every lesson renders every section.
**Parameters:** Fixed section titles: 'Ziel', 'In 30 Sekunden', 'Typische Falle', 'Merksatz', 'Mini-Check', 'Schritt für Schritt', 'Nächster Schritt'. Section CSS classes lsn-goal, lsn-tldr, lsn-analogy, lsn-fig, lsn-steps, lsn-pit, lsn-rule, lsn-check.
**Edge cases handled:** Analogy title and steps title are HTML-escaped; other parts are inserted as-is (see the escaping rule).; Nothing in this file checks that tldr has 2 to 4 items or that figure exists; the contract test (outside these files) is the only guard.; Figure and check are always rendered, so a lesson without them would produce a broken page.
**Confidence:** High

### RULE-242: Training recommendation: due first, then weakest unit
**Category:** Policy
**Priority:** P1
**Source:** `core/js/profile.js:88-95`
**Plain English:** The home screen recommends one unit to practise: the oldest due unit first, otherwise the unit with the lowest last accuracy below 90 percent.
**Specification:**
  Given app.last, app.acc and app.stars per unit.
  When  The home screen is drawn.
  Then  If any unit is due, recommend the one practised longest ago, with reason 'Zeit zum Auffrischen'. Otherwise, among units with a stored accuracy below 0.9 and fewer than 3 stars, recommend the lowest accuracy, with reason 'Hier ist noch Luft nach oben'. If none qualifies, no training card is shown. The button 'Jetzt trainieren' starts a lesson round for that unit (core/js/shell.js:133-133). Selection logic: core/js/profile.js:88-97, outside the listed files.
**Parameters:** Accuracy threshold 0.9 (90 percent). Star cap: stars < 3 for the weak-unit branch.
**Edge cases handled:** A due unit beats a weaker unit, even if the weaker one has lower accuracy.; Units with 3 stars are never recommended as weak.; Only units with a numeric stored accuracy are considered.; The card text promises 10 bonus XP for refreshing (core/js/views/home.js:31), which matches core/js/rounds.js:19-21.
**Confidence:** Medium — Citation was corrected by referee (The cited lines home.js:29-31 do not implement the selection rule. They call weakestUnit(app, config.units) (line 29) and render its returned reason and unit into the 'Gezieltes Training' card with the 'Jetzt trainieren' button (lines 30-32). The rule's behavior is implemented in core/js/profile.js:88-95, which the rule's own Specification names as the selection…

### RULE-243: Second attempt: re-ask a wrong question at the end of the round
**Category:** Policy
**Priority:** P1
**Source:** `core/js/quiz.js:129-131`
**Plain English:** A question answered wrong comes back once more at the end of the same round, with its answer options shuffled, unless it is a boss fight, a match question, or the wrong answer used up the last heart.
**Specification:**
  Given A normal lesson round with 5 questions. Question 2 is answered wrong and the player still has 4 hearts afterwards.
  When  The wrong answer is settled.
  Then  A copy of question 2 is appended to the end of the round list with retry = true and its options reshuffled (quiz.js:130). The screen shows the tag 'Noch einmal' (quiz.js:104).
**Parameters:** Not applicable (conditions are: mode is not boss, kind is not match, hearts > 0 after the loss).
**Edge cases handled:** No re-asks in boss rounds (quiz.js:129).; No re-asks for match questions (quiz.js:129).; No re-asks when the wrong answer took the last heart (hearts > 0 condition).; A retry is asked only once: its own result goes through the retry branch (quiz.js:113-121), which does not append again.; The original question list is copied before the round starts, so the caller's list is never modified (quiz.js:67-69).
**Confidence:** Medium — Citation was corrected by referee (Das Verhalten ist implementiert, die zitierte Stelle ist aber nur der Test dafür. legacy/modulare/scripts/smoke.mjs:152-164 spielt eine Runde mit drei Auswahlfragen in startQuiz durch (falsch, richtig, richtig), prüft die Anzeige von .retry-tag (Zeile 162/164) und beantwortet die Wiederholung richtig. Die Zählerwerte total 3, wrong 1, correct 2, relearned 1 steh…

### RULE-244: Trophäe Endgegner besiegt
**Category:** Policy
**Priority:** P1
**Source:** `core/js/rules.js:23`
**Plain English:** Wer den Endgegner (Boss) ohne Niederlage schafft, erhält die Boss-Trophäe.
**Specification:**
  Given Rundenergebnis mit mode 'boss' und failed.
  When  Die Trophäe 'boss' wird ausgewertet.
  Then  Wahr nur, wenn die Runde im Boss-Modus war und nicht fehlgeschlagen ist (failed = false). Sonst falsch.
**Parameters:** Keine Zahlen. Herzen (3 beim Boss) stehen nicht in diesen Dateien; failed wird dort gesetzt, wo die Runde endet.
**Edge cases handled:** Boss-Modus mit failed: true ergibt falsch (line 33).; Andere Modi erfüllen die Trophäe nie (durch mode-Prüfung in core/js/rules.js:23).
**Confidence:** Medium — Citation was corrected by referee (Die zitierten Zeilen legacy/modulare/tests/core-content.test.js:32-33 sind nur Testassertions: ev({type:'boss'}, ..., {mode:'boss', failed:false}) erwartet true, mit failed:true erwartet false. Sie implementieren die Regel nicht, sie prüfen sie. Die eigentliche Auswertung steht in legacy/modulare/core/js/rules.js:23 im Objekt TYPES: boss: (r, s, res) => res.mode…

### RULE-245: Trophäe Serie (Tage in Folge)
**Category:** Policy
**Priority:** P1
**Source:** `core/js/rules.js:24`
**Plain English:** Wer an genügend Tagen hintereinander geübt hat, erhält die Serien-Trophäe.
**Specification:**
  Given Der Lernstand enthält streak (Anzahl Tage in Folge) als Zahl.
  When  Die Trophäe 'streak' mit days wird ausgewertet.
  Then  Wahr, wenn streak mindestens days ist. Sonst falsch.
**Parameters:** Testwert days = 3 (line 34-35). Wie streak entsteht (Tageswechsel, Gnadentag), steht nicht in diesen Dateien.
**Edge cases handled:** streak 2 bei days 3 ist nicht erreicht (line 35).; Beim Anlegen muss days größer 0 sein (siehe Regel 'Trophäen-Aufbau prüfen').
**Confidence:** Medium — Wie wird 'Tage in Folge' berechnet, und zählt der Gnadentag (AGENTS: Serie mit einem Gnadentag) als Tag für die Trophäe? Die Berechnung von state.streak steht nicht in den Test-Dateien.

### RULE-246: Trophäen-Kombination UND / ODER
**Category:** Policy
**Priority:** P1
**Source:** `core/js/rules.js:25-26`
**Plain English:** Trophäen dürfen mehrere Bedingungen verbinden: 'alle müssen erfüllt sein' (all) oder 'eine genügt' (any).
**Specification:**
  Given Zwei Teil-Regeln: Seite a und Seite b, je mit mindestens einem Stern. Lernstand: nur Seite a hat einen Stern.
  When  Die Trophäe 'all' bzw. 'any' mit diesen Teil-Regeln wird ausgewertet.
  Then  all ist falsch, weil Seite b fehlt. any ist wahr, weil Seite a erfüllt ist.
**Parameters:** Keine Zahlen. Teil-Regeln sind beliebige Trophäen-Regeln (rules: Liste, mindestens eine).
**Edge cases handled:** Leere rules-Liste ist ein Aufbaufehler (siehe Regel 'Trophäen-Aufbau prüfen').; Kombinationen dürfen verschachtelt werden; Teilfehler werden mit Pfad gemeldet (core/js/rules.js:47, Referenz).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/core-content.test.js:38-42) are a test that asserts the all/any behavior. They do not implement it. The behavior is implemented in core/js/rules.js:25-26: 'all' returns r.rules.every(...) and 'any' returns r.rules.some(...), both recursing through evaluateRule. The test calls evaluateRule from rules.js (line 4, line 12), so it exercises th…

### RULE-247: Profil und App-Stand werden nach einer Runde gespeichert, Runde wird protokolliert
**Category:** Policy
**Priority:** P1
**Source:** `core/js/shell.js:101-106`
**Plain English:** Nach einer Runde werden Name, Punkte und Sterne gespeichert. Jede beendete Runde landet im Protokoll mit App und Seite.
**Specification:**
  Given Ein Name wird eingegeben und gespeichert; danach wird eine Runde auf einer Seite gespielt.
  When  Die Runde endet, das Protokoll wird gelesen.
  Then  Das Profil enthält den Namen, XP größer 0. Der App-Stand hat eine Zahl als xp und ein Objekt als stars. Im Protokoll steht genau ein Eintrag mit der gespielten Seite und der App-Kennung.
**Parameters:** Keine Zahlen.
**Edge cases handled:** Das Protokoll enthält nach einer Runde genau einen Eintrag (line 146).; Der Testname steht im Testcode (line 111, 176). AGENTS.md verbietet Namen im Repo; hier als Hinweis, keine Regel.
**Confidence:** Medium — Citation was corrected by referee (The behavior exists in the legacy code, but the cited lines are not its implementation. scripts/smoke.mjs:111-114 and 141-146 are test assertions that check the behavior after a round. The executable logic is in core/js/shell.js:101-106 (finishRound). It calls finalizeRound (profile and app XP update), then ctx.save(), then logEvent({ app: config.id, type: 'roun…

### RULE-248: Boss win grants 50 bonus XP
**Category:** Policy
**Priority:** P1
**Source:** `core/js/views/result.js:21-21`
**Plain English:** Winning the final boss grants 50 bonus XP on top of the normal round XP.
**Specification:**
  Given Round mode is boss and the round is not failed.
  When  The boss round ends.
  Then  The text 'Endgegner besiegt. 50 Bonus-XP gehören dir.' is shown. The XP shown equals base XP plus bonus (core/js/views/result.js:25-25). The boss card promises the same (core/js/views/home.js:46-46).
**Parameters:** Bonus 50 XP. Award is in core/js/rounds.js:33-34 (outside the listed files; verified). Condition: mode boss and not failed.
**Edge cases handled:** A lost boss gives no bonus and shows 'Knapp daneben'.
**Confidence:** High

### RULE-249: Refreshing a due unit grants 10 bonus XP
**Category:** Policy
**Priority:** P1
**Source:** `core/js/views/result.js:22-22`
**Plain English:** Practising a unit that was due for refresh, without failing the round, earns 10 bonus XP.
**Specification:**
  Given The round was flagged refresh because the unit was due when the round was played, and the round is not failed.
  When  The round ends.
  Then  The text 'Aufgefrischt! Dafür gibt es 10 Bonus-XP ...' is shown, provided the mode is lesson (the quick and boss texts take precedence). The XP shown includes the bonus (core/js/views/result.js:25-25).
**Parameters:** Bonus 10 XP. Award condition: isDue at round time and not failed (core/js/rounds.js:19-21, outside the listed files; verified).
**Edge cases handled:** A failed refresh gives no bonus and shows 'Knapp daneben'.; The refresh text is not reached in quick or boss mode, because those branches come first.
**Confidence:** High

### RULE-250: Erklärung bei falscher Antwort
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:10-18`
**Plain English:** Zu jeder Form gibt es eine Erklärung. Für ausgewählte Verben gibt es eine fertige Erklärung. Sonst wird sie aus Stamm und Endung zusammengesetzt, mit Zusatz zu den typischen Fallen der Gruppe.
**Specification:**
  Given Ein Verb und eine Personen-Nummer p.
  When  Eine Aufgabe wird beantwortet und die Erklärung (why) gezeigt.
  Then  Gibt es HINT[verb][p], wird dieser Text genommen. Sonst lautet er 'Infinitiv: Stamm „stem-“ plus Endung „-x“' (oder 'keine Endung.'). Zusätzlich gilt: bei ir-Verben ab Person 3 (nous, vous, ils) der Hinweis auf -iss-; bei re-Verben bei il der Hinweis, dass das d des Stammes bleibt; bei er-Verben bei je, tu, il, ils der Hinweis, dass die Endung nicht zu hören, aber zu schreiben ist (nous und vous sind ausgenommen).
**Parameters:** Personen-Index 3 = nous, 4 = vous, 2 = il, 0/1/2/5 = je/tu/il/ils für den er-Zusatz.
**Edge cases handled:** Die Zusätze werden nur angehängt, wenn keine fertige Erklärung vorhanden ist (builders.js:11).; Die Zuordnungsaufgabe nutzt einen festen Text (builders.js:74).; Der Hinweis zu -iss- ist an die Gruppe ir und Personen ab Index 3 gebunden. Ob er zur Endung passt, hängt von den Daten ab (siehe erste Regel).
**Confidence:** High

### RULE-251: Lektionsrunde: acht Aufgaben nach Verbtyp
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:104-112`
**Plain English:** Eine Übungsrunde zu einer Seite hat acht Aufgaben in fester Reihenfolge. Regelmäßige Seiten haben Endungsaufgaben, unregelmäßige Seiten ersetzen sie durch Satzaufgaben.
**Specification:**
  Given Eine Seite (unit) mit dem Kennzeichen irr (unregelmäßig oder nicht).
  When  lessonRound(unit) wird aufgerufen.
  Then  Regelmäßig: Auswahl, Endung, Konjugation, Zuordnung, Tippen, Satz, Endung, Tippen. Unregelmäßig: Auswahl, Auswahl, Konjugation, Zuordnung, Tippen, Satz, Auswahl, Tippen. Die Theorie-Seite nennt 'Übung starten · 8 Aufgaben' (theory.js:49).
**Parameters:** 8 Aufgaben je Lektionsrunde. Vorlagen LESSON_REGULAR und LESSON_IRREGULAR (builders.js:104-105).
**Edge cases handled:** Bei unregelmäßigen Seiten würde 'end' durch eine Satzauswahl ersetzt (builders.js:100). Die Vorlage für unregelmäßige Seiten enthält aber kein 'end', der Zweig wird von lessonRound nicht erreicht.; Die Art der Aufgabe hängt nicht vom Zufall ab, nur Verb und Satz werden zufällig gewählt.
**Confidence:** High

### RULE-252: Boss- und Schnellrunde
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:106-123`
**Plain English:** Der Endgegner hat zwölf gemischte Aufgaben aus allen Seiten, die Schnellrunde fünf. Endungsaufgaben kommen nur aus regelmäßigen Verben.
**Specification:**
  Given Alle Seiten (UNITS) mit ihren Verben und Sätzen.
  When  bossRound() oder quickRound() wird aufgerufen.
  Then  Boss: Auswahl, Tippen, Satz, Konjugation, Auswahl, Endung, Zuordnung, Tippen, Satz, Auswahl, Konjugation, Tippen (12). Schnell: Auswahl, Satz, Auswahl, Endung, Tippen (5). Jede Aufgabe wählt eine zufällige Seite. Endungsaufgaben wählen nur aus Seiten ohne irr. Alle Sätze einer Runde teilen sich einen Vorrat ohne Wiederholung.
**Parameters:** Boss: 12 Aufgaben. Schnell: 5 Aufgaben.
**Edge cases handled:** Gibt es keine regelmäßige Seite, liefert pick() undefined und die Runde bricht ab. Hier gibt es keine Prüfung (builders.js:117).; Freischaltung des Endgegners steht nicht in diesen Dateien.
**Confidence:** High

### RULE-253: Blitz-Frage: Endung oder Satz
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:125-133`
**Plain English:** Im Blitz-Modus ist jede Frage eine Auswahlfrage. Bei regelmäßigen Seiten kommt sie in etwa einem Viertel der Fälle als Endungsfrage, sonst als Satzfrage.
**Specification:**
  Given Eine zufällig gewählte Seite.
  When  blitzQuestion() wird aufgerufen.
  Then  Ist die Seite regelmäßig und die Zufallszahl unter 0,25, wird eine Endungsfrage mit zufälliger Person mit Endung gebaut. Sonst wird ein zufälliger Beispielsatz der Seite als Auswahlfrage genommen.
**Parameters:** Wahrscheinlichkeit für Endungsfrage: 0,25 (builders.js:128).
**Edge cases handled:** Bei unregelmäßigen Seiten immer Satzfrage.; Die Zufallszahl wird direkt mit Math.random() gezogen (builders.js:128), nicht über einen testbaren Helfer.; Keine Sperre gegen Wiederholung im Blitz (siehe Regel zur Satzsperre).
**Confidence:** High

### RULE-254: Keine Wiederholung von Beispielsätzen innerhalb einer Runde
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:83-92`
**Plain English:** Innerhalb einer Runde kommt jeder Beispielsatz einer Seite nur einmal vor. Ist der Vorrat einer Seite aufgebraucht, wird wieder aus allen gewählt.
**Specification:**
  Given Die Satzliste einer Seite und eine Runde, die einen Vorrat (used) führt.
  When  Eine Satzaufgabe oder Satz-Auswahl wird gezogen.
  Then  Zufällig aus den noch nicht benutzten Sätzen der Seite wählen. Sind alle benutzt, zufällig aus der ganzen Liste. Der gewählte Satz wird als benutzt markiert.
**Parameters:** Sperre gilt pro Runde und pro Satz-ID (Kennung aus model.js:37).
**Edge cases handled:** Der Vorrat wird pro Runde neu angelegt (builders.js:110 und :115), also gilt die Sperre nur innerhalb einer Runde.; Die Blitz-Frage nutzt diesen Vorrat nicht (builders.js:126-133). Dort sind Wiederholungen möglich.; Der Vorrat ist nach Seite getrennt, bei der Boss-Runde also über alle Seiten gemeinsam.
**Confidence:** High

### RULE-255: App-Kennung für den gespeicherten Fortschritt
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/apps/franzoesisch-verben/main.js:4`
**Also cited:** apps/_template/main.js:4-5; apps/geometrie/main.js:4; apps/informatik/main.js:4
**Plain English:** Die App speichert ihren Fortschritt unter der Kennung 'fr-verben'. Diese Kennung darf sich nicht ändern, sonst ist der gespeicherte Stand weg.
**Specification:**
  Given Der Startaufruf der App.
  When  Die App startet.
  Then  bootApp({ id: 'fr-verben', logic }) lädt die Inhalte und den Speicher unter dieser Kennung.
**Parameters:** Kennung 'fr-verben'.
**Edge cases handled:** Die Kennung ist Teil der gespeicherten Daten und muss in einer Neufassung erhalten bleiben.
**Confidence:** Medium — Is 'geometrie' the permanent storage key for this app's saved progress, and must it never be renamed, since renaming would orphan stored progress? / Wird 'info-zahlen' tatsächlich als Schlüssel für den gespeicherten Fortschritt verwendet (das ist in boot.js zu prüfen, nicht in dieser Liste), und darf die Kennung dauerhaft nicht geändert werden?

### RULE-256: Backup export contains all saved data and events; import restores it and rejects foreign data
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/core/js/db.js:117-142`
**Also cited:** core/js/views/backup.js:4-11; core/js/db.js:126-133
**Plain English:** The user can export everything the app has stored (progress and the event log) as one file and later restore it; a file of the wrong shape is refused.
**Specification:**
  Given Two events are logged (app 'x' with stars 3, app 'y' with stars 1) and a store 'lernwerkstatt:e' has xp 7.
  When  The full backup is exported, the database is wiped, the backup is imported (after a JSON round trip), and an object { nope: 1 } is imported.
  Then  The export has docs['lernwerkstatt:e'].xp = 7 and two log entries. After import, the store reads xp 7 and listEvents returns 2 entries. The import of { nope: 1 } is rejected with an error.
**Parameters:** Export shape: { docs: { [key]: state }, log: [events] }.
**Edge cases handled:** listEvents({ app: 'x' }) returns only events of that app (1 of 2) (tests/db.test.js:58-60).; The backup must survive JSON serialisation (tests/db.test.js:70).
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/db.test.js:57-75) are an executable test that asserts the rule's behavior, but they do not implement it. The behavior is implemented in legacy/modulare/core/js/db.js. exportAll (lines 120-123) returns { app, format, exportedAt, docs: db.all(), log: logList({limit: 1000}) }, which matches the rule's export shape. importAll (…

### RULE-257: Trophäen-Schwelle Combo und Blitz-Punkte
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/core/js/rules.js:21-22`
**Plain English:** Eine Trophäe verlangt eine Mindest-Combo in einer Runde oder eine Mindestpunktzahl im Blitz.
**Specification:**
  Given Eine Trophäe mit min = 5 (Beispiel) und eine Runde mit bestCombo bzw. Blitz-Punkten score.
  When  Die Trophäe 'combo' oder 'blitz' wird ausgewertet.
  Then  combo ist wahr, wenn die beste Combo der Runde (bestCombo) mindestens min ist. blitz ist wahr, wenn die Runde im Blitz-Modus war und die Punkte (score) mindestens min sind.
**Parameters:** Schwellen stehen in badges.json (nicht in den Test-Dateien). Testwerte: combo min 5 (line 28-29), blitz min 10 (line 30-31). Auswertung in core/js/rules.js:21-22.
**Edge cases handled:** bestCombo 4 bei min 5 ist nicht erreicht (line 29).; blitz-Trophäe zählt nur im Blitz-Modus: score 99 im Modus 'lesson' ergibt falsch (line 31).; Beim Anlegen muss min größer 0 sein, sonst Fehler (siehe Regel 'Trophäen-Aufbau prüfen').
**Confidence:** Medium — Citation was corrected by referee (The cited lines (tests/core-content.test.js:28-31) are test assertions, not the implementation. They do exercise the behavior: combo with min 5 passes at bestCombo 5 and fails at 4, and blitz with min 10 passes at score 10 in blitz mode and fails in lesson mode. The executable logic is in legacy/modulare/core/js/rules.js:21-22: 'combo: (r, s, res) => res.bestCom…

### RULE-258: Learning-track label appears on LRS pages only
**Category:** Policy
**Priority:** P1
**Source:** `legacy/modulare/core/js/views/home.js:24`
**Also cited:** (node rendering with trackBadge(trackOf(config.tracks, u))) and legacy/modulare/core/js/tracks.js:6-9 (trackOf and trackBadge); core/js/tracks.js:5-9
**Plain English:** Pages that belong to the 'LRS-Förderung' track are labelled as such on the start page. The standard programme pages are not labelled, and every page is listed once.
**Specification:**
  Given The Deutsch app, which has 15 pages, of which 6 belong to the LRS track.
  When  The start page is rendered.
  Then  Exactly 6 page nodes contain 'LRS-Förderung', and the number of nodes equals the number of pages.
**Parameters:** Track label from the manifest tracks (core/js/views/home.js:24) and the track lookup in core/js/tracks.js.
**Edge cases handled:** The count of 6 is hard-coded in the test, so adding or moving LRS pages means updating this test.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/views.test.js:54-61) are a test that asserts the behavior, not the executable logic that produces it. The behavior is implemented in core/js/views/home.js:24, where each page node is built once per config.units entry and gets trackBadge(trackOf(config.tracks, u)) appended. trackOf (core/js/tracks.js:6) returns a track only…

### RULE-259: Page counts per app are maintained by hand in the registry
**Category:** Policy
**Priority:** P1
**Source:** `registry.js:18-66`
**Plain English:** The number of lesson pages per app is typed into the registry and used as the denominator for all progress figures.
**Specification:**
  Given Live apps with units: fr-verben 6, mathe 9, geometrie 8, info-zahlen 6, deutsch 15 (44 in total).
  When  Progress is calculated (see the unit completion rule).
  Then  These numbers are the denominator for every percentage and for the text 'X von N Seiten'. They are not read from the lesson content.
**Edge cases handled:** If a page is added to an app's content and units is not raised, percentages are wrong and can exceed 100 %.; If units is lower than the real page count, apps look finished too early.; No check in these files compares units with the content.
**Confidence:** Medium — Do the units values in registry.js match the number of pages in each app's content manifest, and is there a test that enforces it?

### RULE-260: Sterne-Trophäen: Seite gilt als begonnen ab einem Stern
**Category:** Policy
**Priority:** P1
**Source:** `tests/core-content.test.js:14-21`
**Plain English:** Eine Seite zählt als begonnen, sobald sie mindestens einen Stern hat. Trophäen prüfen einzelne Seiten, mehrere Seiten oder eine Mindeststernzahl.
**Specification:**
  Given Der Lernstand enthält Sternzahlen je Seite (state.app.stars), z. B. { a: 1 } oder { a: 2, b: 1 }.
  When  Eine Sternen-Trophäe wird ausgewertet: anyUnit, unit (Seite id, Mindeststernzahl stars), units (Liste ids).
  Then  anyUnit ist wahr, wenn mindestens eine Seite einen Stern hat. unit ist wahr, wenn die Seite mindestens stars Sterne hat (Standard 1). units ist wahr, wenn alle genannten Seiten mindestens einen Stern haben. Fehlende Seiten zählen als 0 Sterne.
**Parameters:** Mindeststernzahl je Seite: Standard 1 (tests/core-content.test.js:17). Beispiel-Schwelle 3 Sterne (line 18). Der Auswertungscode steht in core/js/rules.js:14-19 (nur zum Auflösen der Referenz gelesen).
**Edge cases handled:** Seite mit 2 Sternen erfüllt 'stars: 3' nicht (line 18).; Eine Liste mit einer Seite ohne Stern erfüllt units nicht (line 19); erst wenn alle Seiten Sterne haben, wird es wahr (line 20).; Nicht vorhandene Seiten gelten als 0 Sterne.
**Confidence:** High

### RULE-261: Trophäe Perfekte Runde
**Category:** Policy
**Priority:** P1
**Source:** `tests/core-content.test.js:24-27`
**Plain English:** Eine Runde ohne jeden Fehler, außerhalb des Blitz-Modus und nicht abgebrochen, erhält die Trophäe 'Perfekte Runde'.
**Specification:**
  Given Das Rundenergebnis enthält mode, failed, wrong und almost. Ausgangslage: mode 'lesson', failed false, wrong 0, almost 0.
  When  Die Trophäe 'perfectRound' wird nach einer Runde ausgewertet.
  Then  Wahr, wenn die Runde nicht im Blitz-Modus war, nicht fehlgeschlagen ist, keine falsche Antwort (wrong = 0) hat und keine knapp falsche Antwort (almost = 0). Sonst falsch.
**Parameters:** Keine Zahlen außer wrong = 0 und almost = 0. Auswertung in core/js/rules.js:20 (Referenz).
**Edge cases handled:** Eine falsche Antwort (wrong: 1) verhindert die Trophäe (line 26).; Im Blitz-Modus gibt es diese Trophäe nie (line 27), auch bei fehlerfreier Runde.; almost wird im Code geprüft, aber die Tests setzen es nie auf einen Wert ungleich 0.
**Confidence:** Medium — Zählt eine knapp falsche Antwort (almost) als Fehler für die Trophäe 'Perfekte Runde'? Der Test prüft nur wrong, nicht almost. Was genau 'almost' bedeutet, ist in den Test-Dateien nicht erklärt.

### RULE-262: Live-Seiten: gemeinsamer Kern-CSS, Sprache, Viewport, keine Google-Schriften
**Category:** Policy
**Priority:** P1
**Source:** `tests/pages.test.js:10-21`
**Plain English:** Every live app page and the dashboard use the shared stylesheet, declare German language and a viewport, and do not load fonts from Google, to protect privacy and allow offline use.
**Specification:**
  Given index.html, every live app in registry.js, and apps/_template/index.html.
  When  Each page's HTML is read.
  Then  It links core/styles/app.css, has <html lang="de"> and a viewport meta tag, and contains no fonts.googleapis or fonts.gstatic reference.
**Edge cases handled:** The check matches literal host names only; a font loaded from another external host would not be caught.
**Confidence:** High

### RULE-263: Resetting progress needs a second confirmation
**Category:** Policy
**Priority:** P1
**Source:** `tests/views.test.js:26-29`
**Plain English:** Clearing an app's progress is a two-step action. The first press asks 'Wirklich alles löschen?' and only the second press clears the data.
**Specification:**
  Given The start page in its default state, and the same page after the first reset press (resetAsk true).
  When  The start page is rendered for each.
  Then  Default: the reset button (data-act 'reset') is shown. After the first press: the confirmation button (data-act 'resetok') is shown.
**Parameters:** Reset labels in core/js/views/home.js:66.
**Edge cases handled:** The first button says 'Fortschritt dieser App zurücksetzen' (this app's progress) but the confirmation says 'Wirklich alles löschen?' (delete everything). The scope of the reset is ambiguous; the cod…
**Confidence:** High

### RULE-264: Template offers lesson rounds, quick round and blitz only; no boss round
**Category:** Policy
**Priority:** P2
**Source:** `apps/_template/logic.js:6`
**Plain English:** The template app provides a per-page practice round, a 5-question quick round and the 45-second blitz. It has no end boss and no custom unlock rule.
**Specification:**
  Given The template logic module is loaded
  When  The app exports its logic
  Then  rounds = { lesson: lessonRound, quick: quickRound }, blitz = blitzQuestion, diagrams = all exports of diagrams.js. No boss, bossUnlocked or theory override is exported, so the core defaults apply.
**Edge cases handled:** rounds.boss is optional in the app contract (AGENTS.md), so the absence is allowed.; Theory uses the standard page from core, since no theory export exists.
**Confidence:** High

### RULE-265: Strang-Etikett an Fragen (chip)
**Category:** Policy
**Priority:** P2
**Source:** `apps/deutsch/builders.js:30-31`
**Plain English:** A question carries the label of the learning track (for example LRS-Förderung) that its unit belongs to; questions of the standard programme carry no label.
**Specification:**
  Given Each item is owned by the unit whose pool contains it (set at init, builders.js:23), and the unit may have a track id that is defined in the manifest
  When  A question is built
  Then  The question's chip is the track badge of the owning unit's track. If the unit has no track, or the track id is not defined, the chip is empty.
**Parameters:** Track definitions come from manifest.tracks (builders.js:22). The track is read from the unit, not from the item.
**Edge cases handled:** An item that belongs to no unit gets no owner and therefore no chip.; An item's own track field is ignored; only the unit's track counts.; Empty tracks map gives no chips.
**Confidence:** High

### RULE-266: Vorher-Nachher-Diagramm: Pfeile zeigen das Umformen
**Category:** Policy
**Priority:** P2
**Source:** `apps/deutsch/diagrams.js:36-46`
**Plain English:** A before-and-after diagram shows two rows of boxes with arrows from each top item to its matching bottom item, and marks the bottom items that receive an arrow.
**Specification:**
  Given A top list, a bottom list, a map where map[i] is the bottom index that top[i] maps to, and labels (default Aktiv and Passiv)
  When  swapDiagram is drawn
  Then  Each top box gets an arrow to bottom[map[i]]. Bottom boxes that are targets of an arrow use the highlight style 'hi'; the other bottom boxes use 'acc'. Box width = floor(440 / n) − 8.
**Parameters:** Label default ['Aktiv', 'Passiv'] (diagrams.js:36). Row y positions 20 and 130; SVG 520 × 200.
**Edge cases handled:** A map index beyond the bottom list fails (undefined box). No guard.; A map longer than the top list fails for the same reason.; Pipe characters in the texts are turned into spaces in the aria label only.
**Confidence:** Medium — Is the highlighting of target boxes meant to show which sentence part changes (for example the Passiv subject), and should the diagram ever show boxes without an arrow in the highlight colour?

### RULE-267: Aufgabenmix pro Seite: Gewichtung der Erzeuger
**Category:** Policy
**Priority:** P2
**Source:** `apps/geometrie/builders.js:216-227`
**Also cited:** apps/mathe/builders.js:292-302
**Plain English:** Jede Seite zieht ihre Aufgaben gleichmäßig aus einer Liste von Erzeugern; wiederholte Einträge bekommen dadurch mehr Gewicht.
**Specification:**
  Given Die Seite Mittelsenkrechte mit fünf Einträgen (drei Erzeuger, zwei Faktenpool-Einträge)
  When  Eine Aufgabe gezogen wird
  Then  Mit 40 % kommt ein Fakt aus dem Faktenpool, mit je 20 % eine der drei Rechenaufgaben.
**Parameters:** Gewichte je Seite (Anteil der Erzeuger): Mittelsenkrechte: Fakt 40 %, übrige je 20 %. Winkelhalbierende: halbieren 50 %, ganzer Winkel 25 %, Fakt 25 %. Dreiecke: eindeutig 33 %, Fakt 17 %, übrige je 17 %. Winkel: Paar 50 %, Summe 25 %, gleichschenklig 25 %. Thales: Beta 40 %, übrige je 20 %. Kreise: Fakt 50 %, Umkreislage 25 %, Radius 25 %. Größen und Probleme: je 20 %.
**Edge cases handled:** Faktenpool-Aufgaben sind immer Auswahl (asWords in builders.js:9), nie eintippbar.; Thaleskreis-Radius kommt in Thales und Kreise vor (gleicher Erzeuger).
**Confidence:** High

### RULE-268: Rundenaufbau: Lektion, Schnellrunde, Blitz und Endgegner
**Category:** Policy
**Priority:** P2
**Source:** `apps/geometrie/builders.js:253-266`
**Plain English:** Eine Lektionsrunde hat acht Fragen, davon zwei eintippbare; die Schnellrunde fünf, der Blitz eine; der Endgegner zwölf mit drei eintippbaren.
**Specification:**
  Given Eine Seite mit numerischen Aufgaben
  When  Die Lektionsrunde erzeugt wird
  Then  Frage 3 und Frage 6 werden eingetippt (wenn der Erzeuger eine Zahl liefert), alle anderen sind Auswahl.
**Parameters:** Lektion: 8 Fragen, eintippbar an Position 3 und 6 (Index 2 und 5). Schnellrunde: 5 Auswahlfragen aus zufälligen Seiten. Blitz: 1 Auswahlfrage. Endgegner: 12 Fragen, Seiten reihum (Index mod Anzahl Seiten), eintippbar an Position 4, 8, 12 (Index 3, 7, 11).
**Edge cases handled:** Schnellrunde und Blitz sind nie eintippbar.; Bei weniger als 12 Seiten wiederholen sich die Seiten im Endgegner.; Liefert ein Erzeuger keine Zahl, bleibt die Position Auswahl; die Anzahl eintippbarer Fragen schwankt daher.
**Confidence:** High

### RULE-269: Drawn coordinates and radii rounded to one decimal place
**Category:** Policy
**Priority:** P2
**Source:** `apps/geometrie/geom.js:5`
**Plain English:** Every coordinate and radius written into the diagram is rounded to one decimal place.
**Specification:**
  Given Any numeric drawing coordinate or radius n, passed through f1 by the path, segment, dot and circle helpers (geom.js:13, 16, 19, 24).
  When  A path, segment, dot or circle string is built.
  Then  f1(n) = Math.round(n × 10) / 10. Example: f1(2.25) = 2.3, and f1(−2.25) = −2.2, because JavaScript Math.round sends .5 toward +Infinity.
**Parameters:** Precision: one decimal place (factor 10, hardcoded).
**Edge cases handled:** Binary floating point can move values that sit exactly on a .x5 boundary to the other side.; The arc radius is written raw, not through f1 (geom.js:13, 'A${r} ${r}'), while the arc endpoints are rounded.; Label anchor positions are passed unrounded (geom.js:18, p[0] + dx).
**Suspected defect:** Half-way cases round asymmetrically for negative numbers (2.25 becomes 2.3, but −2.25 becomes −2.2). The raw arc radius is inconsistent with the rounded endpoints. Both are display-only effects of about 0.1 units.
**Confidence:** High

### RULE-270: Vorgaben fuer fehlende optionale Teile
**Category:** Policy
**Priority:** P2
**Source:** `core/js/appconfig.js:28-42`
**Plain English:** Fehlen optionale Angaben im Manifest, gelten leere Vorgaben. Eine eigene Theorie-Seite der App ersetzt die Standardseite.
**Specification:**
  Given Ein Manifest ohne notes, tracks und resources, und eine App ohne eigene theory-Funktion.
  When  buildConfig baut die Konfiguration.
  Then  notes wird zu {}, tracks zu {}, resources zu [] und die Theorie-Funktion zur Standardseite renderDefaultTheory. Hat die Logik eine eigene theory-Funktion, wird sie stattdessen verwendet.
**Edge cases handled:** Ein leerer Wert (zum Beispiel notes: null) ersetzt die Vorgabe ebenfalls, weil die Pruefung auf Wahrheit erfolgt.; Die Felder bossTitle, words, inputChars und dashboardHref werden ohne Vorgabe durchgereicht und koennen undefined sein.
**Confidence:** High

### RULE-271: Zahlen werden für die Anzeige auf drei Nachkommastellen mit Dezimalkomma geschrieben
**Category:** Policy
**Priority:** P2
**Source:** `core/js/mathkit.js:9-11`
**Plain English:** Zahlen erscheinen mit Dezimalkomma, höchstens drei Nachkommastellen und einem echten Minuszeichen. Negative Zahlen stehen in Klammern, wenn sie in einem Term vorkommen.
**Specification:**
  Given Werte −3,5, 1/3 (≈ 0,3333) und −2,0005.
  When  fmt() bzw. par() wird aufgerufen.
  Then  Die Anzeige ist eine Zeichenkette mit Komma und Minuszeichen.
**Parameters:** Rundung auf Tausendstel über Math.round (mathkit.js:9). Minuszeichen U+2212 (mathkit.js:6). Klammern nur bei negativen Werten (mathkit.js:11).
**Edge cases handled:** Die Rundung ist bei genau halben Tausendsteln asymmetrisch, weil Math.round(−2000,5) auf −2000 rundet: fmt(−2.0005) ergibt „−2“, fmt(2.0005) ergibt „2,001“.; fmt(−0.0001) ergibt „−0“, weil das Minuszeichen vor der Rundung gesetzt wird.; Die Anzeige rundet, die Prüfung nicht (siehe Regel zu numerischen Antworten).
**Suspected defect:** Rundung bei halben Tausendsteln ist asymmetrisch: −2,0005 wird zu −2, aber 2,0005 wird zu 2,001 (mathkit.js:9). Außerdem entsteht bei kleinen negativen Werten die Anzeige „−0“.
**Confidence:** High

### RULE-272: Answer option order is randomised
**Category:** Policy
**Priority:** P2
**Source:** `core/js/questions.js:17-19`
**Plain English:** Choice question options are shuffled when the question is built so the correct answer does not always sit in the same position; a re-asked question is shuffled again.
**Specification:**
  Given A choice question built from the choices A, B, C with answer B.
  When  The question is built, or re-asked at the end of a round.
  Then  The options appear in a random order (each build or re-ask is a new shuffle), and each text choice becomes an option whose id is the text and whose display is the escaped text.
**Parameters:** Shuffle = Fisher-Yates over the list (core/js/ui.js:9-14, resolved reference). Reveal text defaults to the formatted answer (questions.js:19).
**Edge cases handled:** Typed and match questions are not shuffled (questions.js:23-24 and quiz.js:130 only touches choice options).; If a choice answer is missing from the choices, the question is built anyway and only the validation rule catches it.
**Confidence:** High

### RULE-273: Default theory page composition
**Category:** Policy
**Priority:** P2
**Source:** `core/js/theory.js:7-18`
**Plain English:** The standard theory page for a unit shows its title and German name, track badge, the lesson, a memory-note section only when notes exist, and a button that starts the practice round.
**Specification:**
  Given A unit with id, title, de; a lesson keyed by unit id; optional notes keyed by unit id; optional manifest.tracks.
  When  renderDefaultTheory(box, unit, content) runs.
  Then  Header card shows the title, 'de' subtitle and a track badge (theory.js:12). Lesson top and bottom are rendered (:13-14). A 'Merkzettel' section is added only if notes[unit.id] has at least one entry (:9, :15); each note is a [title, text] pair rendered in a div with class 'note'. The 'Übung starten' button carries data-act='start' and data-id=unit.id (:16). wireLesson is then attached (:18).
**Parameters:** Section title 'Merkzettel'. Button label 'Übung starten'.
**Edge cases handled:** Unit without notes entry or with an empty array: no Merkzettel section.; Unit without a track: no badge.; shell.js:68-75 replaces the whole main area with a new #theory element on each open, so click handlers from earlier renders do not stack on the same element (resolved reference).
**Confidence:** High

### RULE-274: Result headline, text and celebration by outcome
**Category:** Policy
**Priority:** P2
**Source:** `core/js/views/result.js:19-22`
**Plain English:** The result screen picks its headline and explanation from the round outcome. For a normal round the headline depends on stars earned, and a celebration fires for strong results.
**Specification:**
  Given Round result: failed flag, mode, stars, second-try count, goalHit flag.
  When  A round finishes.
  Then  Failed: headline 'Knapp daneben' with encouragement to read the theory. Otherwise headline = resultTitles[stars - 1] (index at least 0): 'Geschafft!' for 1 star, 'Sehr gut!' for 2, 'Perfekt!' for 3. Text by mode: boss 'Endgegner besiegt. 50 Bonus-XP gehören dir.'; quick 'Kurze Runde, echter Fortschritt.'; refresh 'Aufgefrischt! ... 10 Bonus-XP'; otherwise 'Seite geschafft ...' (core/js/views/result.js:20-22). If not failed and relearned > 0, the count of second-try correct answers is appended (core/js/views/result.js:23-23). Celebration (confetti) if goalHit, or blitz with score >= 10, or (not failed and (boss or stars >= 2)) (core/js/views/result.js:34-34). Stars come from starsFor (core/js/profile.js:76, outside the listed files): failed 0, accuracy >= 90 percent gives 3, >= 70 percent gives 2, otherwise 1.
**Parameters:** Star thresholds 70 and 90 percent (core/js/profile.js:76). Title words from core/js/shell.js:26-26. Mood 'cheer' at 3 stars.
**Edge cases handled:** A failed round can still celebrate if it reached the daily goal (goalHit).; Mood 'hmm' for failed rounds.; Blitz uses its own copy (see the Blitz praise rule).; Display difference: the blitz result shows the x-multiplier of the best combo (core/js/views/result.js:16-16), while other modes show the raw best combo count labelled 'längste Serie' (core/js/views/…
**Suspected defect:** Combo display differs by mode: blitz shows a multiplier (x N) for the best combo, other modes show the raw streak length. Confirm this is intended.
**Confidence:** High

### RULE-275: Subject colour with fallback
**Category:** Policy
**Priority:** P2
**Source:** `dashboard.js:20`
**Plain English:** Each subject has a fixed accent colour; unknown subjects get a default purple.
**Specification:**
  Given app.subject and the colour table SUBJECT_COLORS in registry.js:9-16.
  When  A tile or the continue card is drawn.
  Then  colour = SUBJECT_COLORS[subject], or '#9B7BFF' if the subject is not in the table.
**Edge cases handled:** The fallback colour is the same as Franzoesisch's colour, so an unknown subject looks like French.; Subject names must match the table exactly (case and spelling).; Colours are hex values in JavaScript, not design tokens; AGENTS.md asks for tokens (design note, not a runtime fault).
**Confidence:** High

### RULE-276: Subject filter chips and empty state
**Category:** Policy
**Priority:** P2
**Source:** `dashboard.js:55-70`
**Plain English:** Learners can filter the app tiles by subject; 'Alle' shows everything, and an empty list shows a message.
**Specification:**
  Given All registry subjects (including soon apps) and the current selection, which starts as 'Alle'.
  When  The grid is drawn or a chip is clicked.
  Then  Chips are 'Alle' followed by each distinct subject in registry order. The tiles shown are those whose subject equals the selection (or all when 'Alle'). If none match, the #empty element is shown. The selection is held in memory only.
**Edge cases handled:** Mathematik has two apps (mathe, geometrie) and appears as one chip.; After a page reload the selection resets to 'Alle' (dashboard.js:56).; Chips are rebuilt on every redraw.
**Confidence:** High

### RULE-277: Zuordnungsaufgabe: Pronomen zu Formen
**Category:** Policy
**Priority:** P2
**Source:** `legacy/modulare/apps/franzoesisch-verben/builders.js:73-75`
**Plain English:** Bei der Zuordnungsaufgabe stehen links die sechs Pronomen in fester Reihenfolge, rechts die sechs Formen in zufälliger Reihenfolge.
**Specification:**
  Given Ein Verb.
  When  Eine Zuordnungsaufgabe wird gebaut.
  Then  Links: Pronomen 0 bis 5. Erwartete Werte: die Formen in Personen-Reihenfolge. Rechts: die Formen gemischt. Die Erklärung ist fest: 'Schau dir die Tabelle noch einmal an.'
**Parameters:** 6 Paare.
**Edge cases handled:** Gleiche Formen (z. B. je und tu bei -re-Verben) erscheinen rechts doppelt.; Zuordnungsaufgaben werden nicht per Hinweis-Erklärung differenziert (keine HINT-Abfrage).
**Confidence:** High

### RULE-278: Diagramme: Personen und graue stumme Endungen
**Category:** Policy
**Priority:** P2
**Source:** `legacy/modulare/apps/franzoesisch-verben/diagrams.js:9-45`
**Plain English:** Die Diagramme zeigen die sechs Formen in zwei Reihen mit deutscher Übersetzung. Stille Endungen werden grau dargestellt, mit einer Legende.
**Specification:**
  Given Ein Verb mit sechs Formen oder Zeilen mit Stamm und Endungen, dazu die Liste der stillen Positionen.
  When  Ein Diagramm wird aufgebaut.
  Then  Personendiagramm: drei Spalten, zwei Reihen, Hervorhebung über hi-Positionen, Einzahl oben, Mehrzahl unten. Endungsdiagramm: pro Zeile Stamm und Endungen. Stille Endungen (silent) erhalten die Klasse box-soft (grau) und werden mit dem Hinweis unter dem Diagramm erklärt (diagrams.js:43).
**Parameters:** Personendiagramm 520 x 270. Endungsdiagramm: 124 Pixel je Zeile.
**Edge cases handled:** Leere Endungen werden als Strich dargestellt.; Die Verwendung von VOWEL (diagrams.js:5) entspricht builders.js:5 (siehe Subjektregel).
**Confidence:** High

### RULE-279: Vorlesen der französischen Sätze
**Category:** Policy
**Priority:** P2
**Source:** `legacy/modulare/apps/franzoesisch-verben/theory.js:8-24`
**Plain English:** Auf der Theorie-Seite kann man Sätze und Formen vorlesen lassen. Das geht nur, wenn der Browser es kann. Fehler werden verschluckt, die Seite funktioniert dann ohne Vorlesen.
**Specification:**
  Given Ein Browser mit oder ohne Sprachausgabe.
  When  Der Vorlese-Knopf wird gedrückt.
  Then  Ist die Sprachausgabe vorhanden, wird die laufende Ausgabe abgebrochen und der Text auf Französisch (fr-FR) mit Tempo 0,85 gesprochen. Ohne Sprachausgabe wird kein Knopf gezeigt (theory.js:23-24).
**Parameters:** Sprache fr-FR. Tempo 0,85.
**Edge cases handled:** Fehler bei der Ausgabe werden leise ignoriert (theory.js:18-20).
**Confidence:** High

### RULE-280: LRS-Förderung track marks six units, all printed material, and the questions of those units
**Category:** Policy
**Priority:** P2
**Source:** `legacy/modulare/content/deutsch/manifest.json:8-13`
**Also cited:** 93-165,476-484 (tracks, unit track fields, resource track); legacy/modulare/apps/deutsch/builders.js:16,22-23,30-31,37,40,48 (chipFor/OWNER); legacy/modulare/core/js/tracks.js:6-8 (trackOf, trackBadge). Cited test lines 70-86 only assert this behavior
**Plain English:** Six Deutsch units belong to the LRS support track; the track's label and tag appear on those units, on the printable material, and on their questions, and nowhere else.
**Specification:**
  Given The manifest units and resources, and the question chips for the first three items of each unit.
  When  The track tags are checked.
  Then  Units tagged 'lrs' are exactly doppelt, dehnung, slaute, ableiten, gross, lesen. Every resource has track 'lrs'. The track label is 'LRS-Förderung'. Questions of those units show the chip 'LRS-Förderung'; other units show no chip. For gap items the typed question shows the chip exactly for LRS units.
**Parameters:** LRS unit ids: doppelt, dehnung, slaute, ableiten, gross, lesen. Label: 'LRS-Förderung'.
**Edge cases handled:** Every printable resource listed in the manifest must exist as a file under apps/deutsch (tests/deutsch.test.js:63-66), and at least one resource must exist.
**Confidence:** Medium — Citation was corrected by referee (The cited lines (legacy/modulare/tests/deutsch.test.js:70-86) are assertions that check the LRS track behavior. They do not implement it. The behavior exists in the data and builder code, which the tests only verify. Implementation locations I checked: (1) legacy/modulare/content/deutsch/manifest.json:8-13 defines tracks.lrs with label 'LRS-Förderung'. (2) legac…

### RULE-281: Result title depends on stars, failure and blitz score
**Category:** Policy
**Priority:** P2
**Source:** `legacy/modulare/core/js/views/result.js:13-19`
**Plain English:** The result headline reflects how the round went: a failed round says 'Knapp daneben', a lesson round uses the title for its star level, and a blitz round says the blitz title at 10 or more or 'Zeit um' below that.
**Specification:**
  Given Result titles ['A','B','C'], a 3-star lesson round, a failed round, and a blitz round with score 12 and blitz title 'Blitz!'.
  When  The result view is built.
  Then  The 3-star headline is 'C'. The failed headline is 'Knapp daneben'. The blitz headline is 'Blitz!'.
**Parameters:** Lesson title: resultTitles[max(0, stars - 1)] (core/js/views/result.js:19). Blitz title: score >= 10 gives blitzTitle, else 'Zeit um' (core/js/views/result.js:13).
**Edge cases handled:** A non-failed round with 0 stars uses the first title, because of the max(0, ...) guard (core/js/views/result.js:19).
**Confidence:** Medium — Citation was corrected by referee (The behavior is implemented in legacy/modulare/core/js/views/result.js, not in the cited test. Line 19 sets title = r.failed ? 'Knapp daneben' : words.resultTitles[Math.max(0, r.stars - 1)], so a failed lesson round shows 'Knapp daneben' and a lesson round picks resultTitles by star level (3 stars gives index 2, i.e. 'C'). Line 13 sets title = r.score >= 10 ? wo…

### RULE-282: Each Deutsch lesson round has 8 valid questions and the boss round is valid
**Category:** Policy
**Priority:** P2
**Source:** `tests/deutsch.test.js:46-51`
**Plain English:** A practice round for a unit always has eight questions, and the end-boss round produces only valid questions.
**Specification:**
  Given Every unit in the manifest, sampled 100 times.
  When  lessonRound(unit) and bossRound() are generated.
  Then  Each lesson round has exactly 8 questions, all valid. The boss round questions are all valid (their count is not asserted here).
**Parameters:** Lesson round size 8 (tests/deutsch.test.js:48).
**Edge cases handled:** Boss round size is not checked in this test.
**Confidence:** High

### RULE-283: New question kinds can be added without changing the core
**Category:** Policy
**Priority:** P2
**Source:** `tests/qtypes.test.js:35-48`
**Plain English:** A new question kind, here a yes/no question, can be added by registering it with its own validation, rendering and grading. No change to the core quiz code is needed.
**Specification:**
  Given A kind 'ja-nein' registered with a validate that requires a boolean answer, and a grade that is 'ok' when the selection (1 = Ja) equals the answer.
  When  A question { kind: 'ja-nein', answer: true } is validated, rendered, graded with selection 1, and its action 'jn-ja' is looked up.
  Then  Validation passes. The rendered HTML contains 'jn-ja'. Grading gives 'ok'. The action is found as a function.
**Parameters:** Registration API in core/js/qtypes.js:18-20 and action lookup in core/js/qtypes.js:31-34.
**Edge cases handled:** The test registers the kind in the shared registry, so later tests in the same process also see it.; With answer false and selection 0 (Nein) the grade is 'ok', because (sel === 1) === answer compares booleans.
**Confidence:** High

### RULE-284: Question kinds are a registry: three standard kinds exist and unknown kinds are an error
**Category:** Policy
**Priority:** P2
**Source:** `tests/qtypes.test.js:7-10`
**Plain English:** The three standard question kinds are choice, type and match. Asking for a kind that is not registered is an error, so typos fail loudly.
**Specification:**
  Given The question-type registry after the standard types are loaded.
  When  The kind list is read, and then an unknown kind 'gibtsnicht' is requested.
  Then  The first three kinds are 'choice', 'type', 'match' in that order. Requesting the unknown kind throws 'Unbekannter Fragetyp'.
**Parameters:** Registry in core/js/qtypes.js:16-28.
**Edge cases handled:** The order of registration determines the order of questionKinds(), so the three standard kinds must stay registered first.
**Confidence:** High

### RULE-285: Celebration is shown for three stars, for boss wins, or for a 10+ blitz score
**Category:** Policy
**Priority:** P2
**Source:** `tests/views.test.js:31-43`
**Plain English:** The result screen celebrates a lesson round with 2 or 3 stars, a won boss, or a blitz score of 10 or more. A failed round is not celebrated. Reaching the daily goal also triggers a celebration.
**Specification:**
  Given A 3-star lesson round, a failed lesson round with accuracy 0.2, and a blitz round with score 12.
  When  The result view is built.
  Then  The 3-star round celebrates. The failed round does not. The blitz round celebrates.
**Parameters:** Celebrate condition at core/js/views/result.js:34: goalHit, or (blitz and score >= 10), or (not failed and (boss or stars >= 2)).
**Edge cases handled:** goalHit overrides failed (the OR comes first), so a failed round that reaches the daily goal still celebrates.
**Confidence:** High

### RULE-286: Printable resources are shown only when present, open in a new tab and are escaped
**Category:** Policy
**Priority:** P2
**Source:** `tests/views.test.js:45-52`
**Plain English:** The 'Zum Ausdrucken' section appears only when the app lists printable materials. Each opens in a new tab and its title is shown as plain text.
**Specification:**
  Given One resource with title '<b>Blatt</b>', description 'Zum Ausdrucken' and href files/blatt.pdf, and a start page with no resources.
  When  The start page is rendered for each.
  Then  With the resource: the description is shown, the link is href files/blatt.pdf with target _blank and rel noopener, and the raw title tag is not in the output. With no resources: the section is absent.
**Parameters:** Section and link rendering in core/js/views/home.js:48-50.
**Edge cases handled:** A resource with a track shows the track badge (core/js/views/home.js:49).
**Confidence:** High

## Rules requiring SME confirmation

- **RULE-007** (Medium): Citation was corrected by referee (The cited lines (tests/geometrie.test.js:44-50) are a test. Lines 46-50 do assert that the parsed answer equals 180 - a - b for the sum task, so the rule is verified there, but the test does not generate the task. The executable behavior lives in apps/geometrie/builders.js:117-121. In winkelsumme(), a and b are drawn with rnd(30, 80), c = 180 - a - b is computed…
- **RULE-008** (Medium): Citation was corrected by referee (The cited lines (tests/geometrie.test.js:54-57) are a test that asserts the rule: it takes POOLS.thales[1], parses α from the prompt, and checks the answer equals 90 − α. The behavior itself is implemented in the generator. In legacy/modulare/apps/geometrie/builders.js:136-139 (thalesBeta), 'a = rnd(20, 70)', the prompt states "Es ist α = ${a}°", and the answer…
- **RULE-010** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Read legacy/modulare/apps/geometrie/builders.js:162-183, diagrams.js:91-99 and tests/geometrie.test.js:61-72. The code matches the core rule: wirklichkeit() uses SCALES [50,100,200,500], d = rnd(2,9) (rnd is inclusive, mathkit.js:5), and meters = d*n/100, so 3 cm at 1:200 gives 6 m. zeichnung() uses…
- **RULE-011** (Medium): What does the tree problem actually calculate? The test expects the answer to equal the distance given in the text ('stehst … m'). Is this intended, or is a calculation step (for example a shadow ratio) missing?
- **RULE-012** (Medium): Does the exterior-angle task always use the exterior angle theorem (exterior angle = sum of the two remote interior angles)? Are the first two numbers in the prompt always those two angles?
- **RULE-035** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Nicht P0 aus Compliance-Sicht. legacy/modulare/apps/mathe/builders.js:136-155 erzeugt Zinsaufgaben für eine Lern-App der 7. Klasse. Es werden kein Geld bewegt, keine gesetzliche oder regulatorische Pflicht erfüllt und keine Buchungsdaten geschrieben. Ein stilles Ändern würde einen Lernfehler erzeuge…
- **RULE-036** (Medium): Citation was corrected by referee (The cited lines (tests/mathe.test.js:125-133) are a test that checks the compound-interest answer: it parses K, n and p from the generated prompt and asserts /answer - K*(1+p/100)^n/ < 1e-6 (line 133). The test does not generate or compute the question itself. The behavior is implemented in the generator zinseszins() at legacy/modulare/apps/mathe/builders.js:163…
- **RULE-037** (Medium): Citation was corrected by referee (The cited lines (tests/mathe.test.js:85-91) are a test that recomputes the Dreisatz answers and asserts them against the generator output. The formulas match the rule: direct (p1/n1)*n2 at line 88, inverse (w1*d)/w2 at line 91. The generator that actually computes the answer is apps/mathe/builders.js:171-181. dreisatzProp sets p1 = n1*u and r = n2*u, so r equals…
- **RULE-039** (Medium): Citation was corrected by referee (The cited lines (tests/mathe.test.js:95-111) are a test that recomputes the answers independently and asserts they match. They verify the rule but do not implement it. The generators that implement it are in apps/mathe/builders.js. mittelwert() (197-205) computes sum/count and forces the total to be divisible by n. median() (207-214) picks n from [5, 7] (line 20…
- **RULE-047** (Medium): Is the installment interest meant to be charged on the original loan amount each period (flat, as the test computes it) rather than on the declining balance? Also, does 'zweites Jahr' (second year) describe the balance-after-first-repayment interest, and are remaining-debt values rounded?
- **RULE-052** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (The cited code matches the rule card. legacy/modulare/apps/mathe/builders.js:73 draws x via nz(-9, 9), a via rnd(2, 9), b via nz(-12, 12), and sets c = a*x + b. nz (builders.js:16) rejects 0 and rnd (core/js/mathkit.js:5) uses Math.random. The correct answer is fmt(x) (line 76), and x is always an i…
- **RULE-056** (Medium): Kommen in den Lektionen Datenreihen mit gerader Anzahl Werte vor? Wenn ja, soll der Median dort als Mittel der beiden mittleren Werte gezeigt werden?
- **RULE-059** (Medium): Sollen Ausweichzahlen auch negativ oder null sein dürfen, wenn die Aufgabe nur positive Größen wie Längen oder Preise kennt?
- **RULE-061** (Medium): Citation was corrected by referee (The cited lines (tests/profile.test.js:5-11) are a node:test assertion block. They check the behavior but do not implement it. The executable logic is in core/js/profile.js:29-34: lvlAt(n) = 30 * n * (n - 1) (line 29), and levelOf(xp) starts at n=1 and increments while xp >= lvlAt(n+1) (lines 30-34). I checked the values by hand against that code. lvlAt(2)=60, l…
- **RULE-062** (Medium): Citation was corrected by referee (The cited test (tests/profile.test.js:13-24) only asserts the XP-award behavior; it does not implement it. The executable logic is addXP in core/js/profile.js:53-65. That function does what the rule says: it adds the amount to profile.xp and app.xp (lines 56-57), resets profile.day when the date differs and adds the amount to today's XP (lines 58-59), computes l…
- **RULE-063** (Medium): Which multiplier applies at combo counts 4, 5, 7 and 8, which the test does not assert? The sample values fit min(4, 1 + floor(combo ÷ 3)), but is that the intended rule?
- **RULE-064** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/rounds.test.js:20-23) are a unit test, not the implementation. Line 22 asserts 'result.stars === 3' for a lesson round on 'etre' with accuracy 1.0, which matches the 3-star case of the spec, but a test only verifies behavior and does not produce it. The executable rule is elsewhere: legacy/modulare/core/js/profile.js:76 'st…
- **RULE-067** (Medium): Citation was corrected by referee (The cited lines (scripts/smoke.mjs:165-166) are a test assertion that checks Math.abs(result.accuracy - 2/3) < 1e-9. They verify the behavior but do not implement it. The behavior is implemented in legacy/modulare/core/js/quiz.js. In settle() (lines 113-121), a retry (q.retry) only increments run.relearned and grants 5 XP. It returns before the run.correct++ at…
- **RULE-069** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance lens: a regulator, auditor or finance controller would not care if this formula changed silently. The app is a children's learning game with no money, no legal or regulatory duty, and no safety or third-party data-integrity effect. The only consequences are the displayed "% richtig" (resu…
- **RULE-071** (Medium): Citation was corrected by referee (The behavior is implemented in executable code, but the cited location (tests/rounds.test.js:48-56) is a unit test that asserts the behavior, not the implementation. The implementation is at core/js/rounds.js:33-35: when result.mode === 'boss' and !result.failed, result.bonus += 50 and addXP(profile, app, 50, day) run (addXP at core/js/profile.js:53-56 adds the…
- **RULE-075** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/scripts/smoke.mjs:177-180) are a smoke-test harness. They seed localStorage with stars {ids[0]:3, ids[1]:1} and assert that the first app's tile label includes '2 von '+ids.length. They do not compute the progress label. The behavior is implemented in legacy/modulare/dashboard.js. Line 19 (doneUnits) counts entries in state.stars…
- **RULE-078** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Geprüft: legacy/modulare/apps/franzoesisch-verben/model.js:31-35. Die Mechanik stimmt mit der Regel überein: Zeile 33 setzt den Infinitiv auf den Schlüssel, wenn er fehlt. Zeile 34 setzt irr nur bei vorhandenen forms. Zeile 35 setzt ends = GE[v.group] und forms = stem + ends. Die Endungen kommen aus…
- **RULE-079** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/geometrie.test.js:51-53) are a test assertion, not the implementation. They check that the answer equals (180 - top) / 2 for a prompt apex angle, which matches the rule's formula, but the behavior itself is produced by the generator. That generator is gleichschenklig() in legacy/modulare/apps/geometrie/builders.js:123-126,…
- **RULE-080** (Medium): Are the numbers after 'misst' (mitte) and 'von' (kette) always base angles of isosceles triangles, so that the answer is the apex angle? Please confirm the wording of both prompt templates.
- **RULE-081** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/geometrie.test.js:11-31) are tests. They assert the behavior but do not implement it. The executable logic is in legacy/modulare/apps/geometrie/geom.js, which the tests import. I verified that code against the rule: - geom.js:7 'at' returns [cx + r*cos(θ), cy − r*sin(θ)], the screen-coordinate (y-down) convention. at(0,0,10…
- **RULE-082** (Medium): Citation was corrected by referee (Die zitierten Zeilen tests/informatik.test.js:64-72 sind ein Test, der die Regel prüft, aber sie implementieren sie nicht. Die Regel selbst steckt in den Generatoren: addQ (apps/informatik/builders.js:140-150) setzt answer = toBin(a + b) (numbers.js:7) und die Aufgabe nennt a und b als toBin(a), toBin(b); das passt zur Regel. hexToDecQ (builders.js:163-177) erze…
- **RULE-083** (Medium): Citation was corrected by referee (The cited lines (tests/informatik.test.js:11-28) are node:test assertions. They check the behavior but do not implement it. The executable logic is in apps/informatik/numbers.js. There, toBin and toHex are at lines 6-7 (HEX at line 4), placeSum at 14-18, onesWeights at 21-24, and decToBinSteps at 27-39. Those functions produce the specified results: toBin(13) gi…
- **RULE-084** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Cited test (legacy/modulare/tests/mathe.test.js:56-71) re-derives each answer from its prompt and compares numerically. The core claim holds for the templates it exercises: addSub (builders.js:20-27, pool index 0) and solve (builders.js:72-78, pool index 0). P0 fails on the compliance lens: this is…
- **RULE-088** (Medium): Why is the answer always 45 degrees? Does the prompt always describe an isosceles right triangle, so that the base angles are 45 degrees, and is the 45 never derived from a number in the prompt?
- **RULE-096** (Medium): Are the nibbles 0000, 0011, 0110 and 0111 (values 0, 3, 6, 7) left out on purpose? If so, why? If not, should the set be the full 0 to 15 range?
- **RULE-109** (Medium): Enthält der Lernstoff Verben mit aspiriertem h (z. B. haïr), bei denen die je-Form nicht mit j' stehen darf? Falls ja, muss die Regel eine Ausnahmeliste bekommen.
- **RULE-111** (Medium): Citation was corrected by referee (The cited lines (tests/deutsch.test.js:31-44) are a test that asserts the rule, not the implementation. The behavior does exist in executable code elsewhere. choice() at apps/deutsch/builders.js:33-37 builds the option with id = fill = item.a for gap items (via option(w, esc(w), w) at line 36, where option() in core/js/questions.js:6 returns { id, html, fill }).…
- **RULE-112** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/mathe.test.js:113-122) are a test that asserts the behavior, not the implementation. The behavior is implemented in executable code elsewhere, and that code matches the rule as specified. Checker, /Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/mathkit.js:38-44 (probCheck): base() lowercases and strips whitespace,…
- **RULE-113** (Medium): Should typed answers be case-sensitive for German nouns (Hund vs hund), and should umlaut or ß/ss differences and accent-only mistakes count as wrong or as 'almost correct' (the AGENTS.md guidance suggests a near-correct tier using stripAccents)?
- **RULE-115** (Medium): Hat jeder Eintrag in data.json (msFacts, whFacts, drFacts, thFacts, krFacts, grFacts, prFacts) mindestens drei verschiedene falsche Antworten und ist jeder Faktenpool gefüllt? Falls nicht, wäre eine Obergrenze für die Schleife nötig.
- **RULE-117** (Medium): Sind alle Einträge der Tabellen THEOREMS und EINDEUTIG in content/geometrie/data.json korrekte Zuordnungen? Ist der Distraktor 'SsW' bewusst als falsche Antwort gewollt?
- **RULE-118** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Cited code checked: builders.js:27-29 wraps typedQuestion with check: checker(type, answer). numbers.js:66-74 implements normInput (trim, uppercase, strip whitespace/underscores, strip leading 0X, strip leading zeros but keep one digit, regex per type) and checker returns 'ok' or 'bad' only, never '…
- **RULE-119** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Geprüft gegen legacy/modulare/apps/informatik/numbers.js:66-74. Die Spezifikation stimmt mit dem Code überein: normInput (66-71) bereinigt Eingabe und Lösung gleich (trim, Großschreibung, Leerzeichen und Unterstriche weg, 0x-Präfix weg, führende Nullen weg, Typprüfung per Regex), checker (74) liefer…
- **RULE-124** (Medium): Citation was corrected by referee (The cited lines are a test file (legacy/modulare/tests/core-content.test.js:65-78). They assert the behavior but do not implement it. The behavior is implemented in two places, and both match the rule. (1) resolveFigure in core/js/appconfig.js:16-21: a figure with svg is passed through unchanged (line 17); a diagram reference is resolved by calling diagrams[name…
- **RULE-125** (Medium): Citation was corrected by referee (Das Verhalten ist im Code vorhanden, die zitierten Zeilen (tests/core-content.test.js:80-90) sind aber nur der Test, der es prüft. Die Implementierung steht in /Users/dghaies/Sites/lernapp-sira/legacy/modulare/core/js/content.js:34-41. Dort gilt: createHttpSource baut die URL '${base}/apps/${encodeURIComponent(appId)}/content' (Zeile 39, ein abschließender Slash…
- **RULE-126** (Medium): Should restoring a backup replace this device's event log or merge with it, and should the player confirm before overwriting?
- **RULE-128** (Medium): Soll eine Antwort, die auf die angezeigte Stellenzahl gerundet ist (z. B. 0,333 für 1/3), als richtig gelten? Falls ja, braucht numCheck eine zur Anzeige passende Toleranz.
- **RULE-131** (Medium): Citation was corrected by referee (Das Verhalten existiert, steht aber nicht in der zitierten Stelle. tests/rounds.test.js:20-25 ist ein Test, der die Trophäen 'first', 'etre3', 'perfect' und 'combo5' prüft; er implementiert nichts. Die Logik liegt in core/js/rules.js:20 (perfectRound: res.mode !== 'blitz' && !res.failed && res.wrong === 0 && res.almost === 0) und core/js/rules.js:21 (combo: res.…
- **RULE-132** (Medium): Citation was corrected by referee (Das Verhalten ist im Code vorhanden, die zitierte Stelle ist aber nur der Test, der es prüft, nicht die Implementierung. Die Funktion ruleErrors steht in core/js/rules.js:39-52 (legacy/modulare ist ein Symlink auf das Repo-Wurzelverzeichnis, deshalb liefert find ohne Symlink-Auflösung nichts). Dort gilt: unbekannter Typ gibt einen Fehler zurück (Zeile 41), unbek…
- **RULE-133** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance-Blick: Würde ein Regulierer oder Prüfer eine stille Änderung bemerken? Nein. Die Regel betrifft den lokalen Lernfortschritt einer Lern-App (IndexedDB im Browser, kein Server, kein Geld, kein gesetzlich vorgeschriebener Datensatz). Das Zurücksetzen ist eine bewusste Nutzeraktion. Ein Fehle…
- **RULE-135** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Faithful: the cited code matches the stated rule. store.js:27 treats a throwing db.get as undefined, store.js:28-29 then tries db.legacy(key), and store.js:35 uses the stored value only if isPlain (non-null, non-array object, store.js:6). Otherwise state = fresh() (store.js:34, 43). The rule text om…
- **RULE-136** (Medium): Should a unit without a lesson in production show an explicit 'Lektion folgt' notice, or is a missing lesson treated as a content error that must never reach users?
- **RULE-137** (Medium): Was bedeutet „fast richtig“ (qtypes.js:41) für Punkte, Herzen und Sterne? Und soll eine Antwort ohne Akzente (etes statt êtes, Madchen statt Mädchen) dort Punkte bekommen?
- **RULE-143** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance-Sicht: Das Tor prüft Inhaltspakete einer Lern-App (Klasse 7). Es bewegt kein Geld, erfüllt keine gesetzliche Pflicht, verarbeitet keine personenbezogenen Daten und trifft keine Entscheidung, die ein Regulierer oder Finanzprüfer nachvollziehen müsste. Ein stiller Wechsel würde nur da…
- **RULE-144** (Medium): Citation was corrected by referee (The cited lines (tests/content.test.js:47-53) are assertions that verify the href rule. They do not implement it. The behavior exists in executable code elsewhere. The runtime check is isSafeHref at core/js/validate.js:8 (regex rejects a scheme such as javascript: or https:, a leading slash, "..", and whitespace, quotes, <, > characters). It is applied at core/j…
- **RULE-145** (Medium): Citation was corrected by referee (The behavior is implemented in core/js/views/home.js, not in the cited test. tests/views.test.js:17-24 only asserts it. home.js:26 builds the greeting with esc(profile.name), so a name like '<b>x</b>' is emitted as &lt;b&gt;x&lt;/b&gt; (esc() in core/js/ui.js:7 escapes &, <, >, "). home.js:27 emits the name form (input id="nm", placeholder "Wie heißt du?", maxle…
- **RULE-146** (Medium): Citation was corrected by referee (The cited lines (tests/french.test.js:64-71) are a node:test assertion loop. They check the rule's properties but do not implement them. The behavior itself lives in builders.js: hint(v, p) at lines 10-18 returns HINT[v.key][p] when present, otherwise a generated string that always contains the infinitive and stem, so it is longer than 5 characters. distract(v,…
- **RULE-147** (Medium): Citation was corrected by referee (The cited lines (tests/french.test.js:53-62) are test assertions. They check the behavior but do not implement it, so they cannot confirm the rule on their own. The behavior is implemented in legacy/modulare/apps/franzoesisch-verben/builders.js:34-41 (checkForm). Pronoun prefixes are stripped at line 35 via stripPronoun, which runs after norm() lowercases the in…
- **RULE-150** (Medium): Citation was corrected by referee (The rule is implemented, but not at the cited lines. apps/geometrie/builders.js:246-251 (absolute: /Users/dghaies/Sites/lernapp-sira/legacy/modulare/apps/geometrie/builders.js) only builds the typed question: it passes check: numCheck(item.value) (line 248) and a placeholder 'Zahl eintippen (${unit})' (line 248). The comparison itself lives in core/js/mathkit.js…
- **RULE-151** (Medium): Citation was corrected by referee (Das zitierte Stück legacy/modulare/tests/qtypes.test.js:12-17 ist nur ein Test. Er ruft defaultCheck auf und prüft die drei Erwartungen (chanté: ok, chante: almost, gesungen: bad), setzt das Verhalten aber nicht um. Die Logik steht in legacy/modulare/core/js/qtypes.js:37-43: a === b ergibt 'ok', stripAccents(a) === stripAccents(b) ergibt 'almost', sonst 'bad'. D…
- **RULE-158** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Faithful: legacy/modulare/tests/french.test.js:32-38 asserts exactly the five verb form arrays in the spec (etre, faire, parler, finir, attendre) in person order je..ils/elles, and the spec's Given (V loaded from content/fr-verben via diskSource and init at line 8) matches. I recomputed the forms fr…
- **RULE-160** (Medium): Is the minimum for geometry tasks two wrong options or three? The test name and the first condition suggest three, but the written condition accepts two.
- **RULE-161** (Medium): Citation was corrected by referee (The cited lines (tests/contract.test.js:8-20) only loop over live apps and call assertValidConfig(config) (lines 8-15), plus a template test (17-20). They do not themselves check the rule's items. The checks are implemented in tests/helpers.js:10-39 (assertValidConfig). Mapping to the spec: id regex /^[a-z0-9-]+$/ at helpers.js:11; title at :12; units non-empty…
- **RULE-165** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Compliance-Blick: Die Regel prüft die Antwortprüfer der Übungsaufgaben in einer Lern-App für eine Schülerin (AGENTS.md: Lernwerkstatt, Gamification). Es werden kein Geld bewegt, keine gesetzliche Pflicht erfüllt, kein Audit-Protokoll geführt und keine Noten im Schulsystem gesetzt. Eine stille Änderu…
- **RULE-166** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Die Regel ist im Code belegt und die Given/When/Then-Beschreibung stimmt. canCheck (legacy/modulare/core/js/qtypes.js:93) verlangt run.sel !== null, und grade (qtypes.js:94) gibt 'ok' zurück, wenn options[sel].id === answer, sonst 'bad'. Der Test (legacy/modulare/tests/qtypes.test.js:19-25) prüft ge…
- **RULE-172** (Medium): Citation was corrected by referee (The behavior is implemented. spendXP clamps both totals at zero with Math.max(0, x - amount), so spending 3 XP from 2 yields 0 for profile.xp and app.xp (legacy/modulare/core/js/profile.js:68-71). The cited lines, legacy/modulare/tests/profile.test.js:56-62, are a node:test case that asserts this behavior by calling spendXP(profile, app, 3) after addXP(..., 2) a…
- **RULE-173** (Medium): Citation was corrected by referee (The cited lines (tests/rounds.test.js:67-72) are a test that asserts the behavior: profile streak 2 with lastDay 2026-10-24, finalized on 2026-10-25, gives streak 3 and newBadges contains streak3. A test verifies behavior but does not implement it, so the citation does not show the rule. The behavior is implemented in legacy/modulare/core/js/rounds.js:41-46: tou…
- **RULE-185** (Medium): Citation was corrected by referee (The cited lines (tests/core-content.test.js:92-104) are a test that asserts the cache behavior; they do not implement it. The behavior is implemented in core/js/content.js:50-67 (withCache). There, on success the bundle is stored under 'lernwerkstatt:content:${appId}' (lines 51, 56-57), and when source.load throws, the cached bundle is read from storage and retu…
- **RULE-186** (Low): The test name says 'läuft im Arbeitsspeicher weiter' (memory-only), but the assertion expects backend === 'localstorage' (tests/db.test.js:81) while localStorage is also undefined. Is 'localstorage' only a label for the in-memory fallback, or should a real localStorage fallback exist? And should the label read 'memory' when neither storage is available?
- **RULE-187** (Medium): Citation was corrected by referee (The behavior exists in the legacy code, but the cited lines are not its implementation. scripts/smoke.mjs:134-146 is a test that exercises the behavior: it seeds localStorage with xp 40, one star and __v 1 (line 137), checks the star count and that the localStorage key is gone (line 138), plays a round (line 141), then reads the IndexedDB docs store and checks x…
- **RULE-188** (Medium): Citation was corrected by referee (The cited test (tests/profile.test.js:67-72) does assert the rule, and each assertion matches the spec: line 69 checks unit a on 2026-10-04 (dayDiff 3, so true), line 70 checks 2026-10-02 (dayDiff 1, so false), and line 71 checks unit b with 0 stars on 2026-10-09 (false). But the lines only verify the behavior; they do not implement it. The executable logic is i…
- **RULE-189** (Medium): Citation was corrected by referee (The cited lines (tests/rounds.test.js:34-39) are a test that asserts the behavior, not the implementation. The behavior is implemented in executable code elsewhere, and all three asserted parts hold there. (1) Stars are 0 on failure: core/js/profile.js:76 starsFor returns 0 when failed. core/js/rounds.js:11 assigns result.stars from it. (2) app.stars.aller stays…
- **RULE-190** (Medium): Should a matching question with one wrong pick be graded 'almost' (as core/js/qtypes.js:173 does), and should the first wrong pick cost a heart (core/js/qtypes.js:176-178)?
- **RULE-193** (Medium): If a player leaves a round or the blitz before it ends, should the XP already earned stay (current behaviour) or be taken back? Should an abandoned round produce any record in the learning log?
- **RULE-194** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/profile.test.js:84-97) are a node:test assertion of the behavior, not its implementation. I read the executable logic and it matches the specification. The implementation is in legacy/modulare/core/js/rounds.js:16-28: for mode 'lesson', if isDue(app, id, day) and !result.failed, it sets result.refresh = true, adds 10 to res…
- **RULE-195** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Cited code (legacy/modulare/core/js/shell.js:101-107) matches the rule: finishRound calls finalizeRound (rounds.js:10-45, which sets stars, bests, bonus, streak, badges), then ctx.save(), then logEvent with the listed fields (shell.js:104), then stop() and renderResult() (shell.js:105-106). db.js:13…
- **RULE-197** (Medium): Citation was corrected by referee (Das Verhalten ist im Code vorhanden, die zitierte Stelle ist aber nur der Test, der es prüft (tests/db.test.js:20-30 ruft createStore/save/resetDBForTests auf und assertiert xp 12, stars.x 3, backend 'indexeddb'). Die ausführende Logik liegt in legacy/modulare/core/js/store.js: createStore lädt per db.get(key) und führt die gespeicherten Felder über deepMerge(fr…
- **RULE-202** (Medium): Does createStore in core/js/store.js already catch storage errors? If not, should the home page still draw without progress when a store cannot be opened?
- **RULE-204** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/rounds.test.js:58-65) are a test that asserts the blitz behavior. They do not implement it. The behavior is implemented in executable code elsewhere. Best update: core/js/rounds.js:30-31 keeps app.best.blitz only when result.score is greater than the stored best. Trophy threshold: core/js/rules.js:22 returns true for blitz…
- **RULE-205** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/scripts/smoke.mjs:126-128) are a test. They click the reset and resetok buttons, read the stored app document from localStorage, and assert xp===0 and an empty stars object. The test does not implement the reset. The behavior is implemented in legacy/modulare/core/js/shell.js:137-144. The reset action (line 137) only sets the con…
- **RULE-206** (Medium): Soll der Endgegner erst frei sein, wenn alle Seiten mindestens einen Stern haben? Oder genügt ein Teil? Der Test prüft nur den Fall 'alle Seiten haben einen Stern'. / Is the end boss meant to unlock only when every page has at least one star, as the start-page text says (core/js/views/home.js:46), and is this the gate the shell actually enforces?
- **RULE-207** (Medium): Citation was corrected by referee (The cited lines (tests/db.test.js:32-49) are test assertions, not the implementation. They exercise the behavior: test 32-40 checks that unknown field 'alt' survives and new default 'neu' is filled, and test 42-49 checks that migrate runs on a version bump and yields xp 50. The executable logic lives in core/js/store.js. deepMerge (lines 10-16) keeps unknown sto…
- **RULE-208** (Medium): How many missed days are allowed before a streak restarts? The test confirms one missed day (gap of 2 days) is forgiven and a gap of 4 days resets, but not a gap of 3 days. Also, after how many days without practice does the streak count as expired (the test only shows 1 day alive and 9 days expired)? / Should a failed round still count as practice for the streak (core/js/rounds.js:41 counts ever…
- **RULE-211** (Medium): Garantiert boot.js, dass init() vor dem ersten Aufruf von lesson/quick/boss/blitz läuft (und dass data.json nicht leer ist)?
- **RULE-217** (Medium): Welche Ereignisse sollen Minou in welche Stimmung versetzen (z. B. jubelnd bei einem Stern, traurig bei einer falschen Antwort, nachdenklich bei Hinweisen)?
- **RULE-218** (Medium): Citation was corrected by referee (The cited test (legacy/modulare/tests/profile.test.js:26-30) asserts the behavior: addXP(GOAL) returns goalHit true, and a following addXP(10) on the same day returns goalHit false. It does not implement the behavior. The executable logic is in legacy/modulare/core/js/profile.js:53-65 (addXP), and line 63 is the actual check: goalHit = goalBefore < GOAL && profi…
- **RULE-220** (Medium): Bestätigen Sie die Zuordnung 1 Stern = Bronze, 2 = Silber, 3 = Gold für die Sammelkarten. Der Test prüft nur 2 Sterne = Silber.
- **RULE-222** (Medium): Citation was corrected by referee (The behavior is implemented in executable code, but the cited line 41 is a comment ("Die Lektion wird nur einmal gezeichnet ..."), not logic. The mechanism is at 42-46: the lesson (lessonTop/lessonBottom) is written once into box.innerHTML. At 63, paint() only rewrites the [data-conj] node, so re-painting on verb change or cover toggle does not touch the lesson.…
- **RULE-223** (Medium): P0 panel split on whether this is critical to the system's core purpose or a costly-if-wrong rule (Code gelesen: legacy/modulare/apps/_template/builders.js:14-17 baut Optionen aus shuffle([item.a, ...item.wrong.slice(0, 3)]), jede mit html = esc(v), answer = item.a, label 'Wähle die richtige Antwort', why = item.explain. Die Spezifikation stimmt damit überein (Ablenker auf 3 begrenzt, Sofa nie ge…
- **RULE-224** (Medium): Should a typed answer be accepted only when it matches after normalising case, spaces and apostrophes (norm), or also when only accents differ (stripAccents, e.g. 'etes' for 'êtes')? This template does not define the tolerance; the quiz engine does. Please confirm the intended tolerance for typed answers.
- **RULE-226** (Medium): Should the quick round and blitz weight every item equally across pages (more questions from larger pools), or every page equally (the current behaviour)? Should a quick round avoid showing the same item twice?
- **RULE-229** (Medium): Citation was corrected by referee (The cited lines (tests/french.test.js:10-30) are assertions that encode the rule: lessonRound length 8 (line 14), bossRound 12 and quickRound 5 (lines 22-23), and blitzQuestion().kind === 'choice' (line 27). They are tests, not the implementation, so they cannot confirm the behavior by themselves. The behavior is implemented in apps/franzoesisch-verben/builders.…
- **RULE-231** (Medium): Should the easy ranges for decimal-to-hex (10 to 31) and hex-to-decimal (10 to 15) be the same? And is the 'hard' level (40 to 255) meant to come back for any unit, or can it be removed?
- **RULE-242** (Medium): Citation was corrected by referee (The cited lines home.js:29-31 do not implement the selection rule. They call weakestUnit(app, config.units) (line 29) and render its returned reason and unit into the 'Gezieltes Training' card with the 'Jetzt trainieren' button (lines 30-32). The rule's behavior is implemented in core/js/profile.js:88-95, which the rule's own Specification names as the selection…
- **RULE-243** (Medium): Citation was corrected by referee (Das Verhalten ist implementiert, die zitierte Stelle ist aber nur der Test dafür. legacy/modulare/scripts/smoke.mjs:152-164 spielt eine Runde mit drei Auswahlfragen in startQuiz durch (falsch, richtig, richtig), prüft die Anzeige von .retry-tag (Zeile 162/164) und beantwortet die Wiederholung richtig. Die Zählerwerte total 3, wrong 1, correct 2, relearned 1 steh…
- **RULE-244** (Medium): Citation was corrected by referee (Die zitierten Zeilen legacy/modulare/tests/core-content.test.js:32-33 sind nur Testassertions: ev({type:'boss'}, ..., {mode:'boss', failed:false}) erwartet true, mit failed:true erwartet false. Sie implementieren die Regel nicht, sie prüfen sie. Die eigentliche Auswertung steht in legacy/modulare/core/js/rules.js:23 im Objekt TYPES: boss: (r, s, res) => res.mode…
- **RULE-245** (Medium): Wie wird 'Tage in Folge' berechnet, und zählt der Gnadentag (AGENTS: Serie mit einem Gnadentag) als Tag für die Trophäe? Die Berechnung von state.streak steht nicht in den Test-Dateien.
- **RULE-246** (Medium): Citation was corrected by referee (The cited lines (tests/core-content.test.js:38-42) are a test that asserts the all/any behavior. They do not implement it. The behavior is implemented in core/js/rules.js:25-26: 'all' returns r.rules.every(...) and 'any' returns r.rules.some(...), both recursing through evaluateRule. The test calls evaluateRule from rules.js (line 4, line 12), so it exercises th…
- **RULE-247** (Medium): Citation was corrected by referee (The behavior exists in the legacy code, but the cited lines are not its implementation. scripts/smoke.mjs:111-114 and 141-146 are test assertions that check the behavior after a round. The executable logic is in core/js/shell.js:101-106 (finishRound). It calls finalizeRound (profile and app XP update), then ctx.save(), then logEvent({ app: config.id, type: 'roun…
- **RULE-255** (Medium): Is 'geometrie' the permanent storage key for this app's saved progress, and must it never be renamed, since renaming would orphan stored progress? / Wird 'info-zahlen' tatsächlich als Schlüssel für den gespeicherten Fortschritt verwendet (das ist in boot.js zu prüfen, nicht in dieser Liste), und darf die Kennung dauerhaft nicht geändert werden?
- **RULE-256** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/db.test.js:57-75) are an executable test that asserts the rule's behavior, but they do not implement it. The behavior is implemented in legacy/modulare/core/js/db.js. exportAll (lines 120-123) returns { app, format, exportedAt, docs: db.all(), log: logList({limit: 1000}) }, which matches the rule's export shape. importAll (…
- **RULE-257** (Medium): Citation was corrected by referee (The cited lines (tests/core-content.test.js:28-31) are test assertions, not the implementation. They do exercise the behavior: combo with min 5 passes at bestCombo 5 and fails at 4, and blitz with min 10 passes at score 10 in blitz mode and fails in lesson mode. The executable logic is in legacy/modulare/core/js/rules.js:21-22: 'combo: (r, s, res) => res.bestCom…
- **RULE-258** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/views.test.js:54-61) are a test that asserts the behavior, not the executable logic that produces it. The behavior is implemented in core/js/views/home.js:24, where each page node is built once per config.units entry and gets trackBadge(trackOf(config.tracks, u)) appended. trackOf (core/js/tracks.js:6) returns a track only…
- **RULE-259** (Medium): Do the units values in registry.js match the number of pages in each app's content manifest, and is there a test that enforces it?
- **RULE-261** (Medium): Zählt eine knapp falsche Antwort (almost) als Fehler für die Trophäe 'Perfekte Runde'? Der Test prüft nur wrong, nicht almost. Was genau 'almost' bedeutet, ist in den Test-Dateien nicht erklärt.
- **RULE-266** (Medium): Is the highlighting of target boxes meant to show which sentence part changes (for example the Passiv subject), and should the diagram ever show boxes without an arrow in the highlight colour?
- **RULE-280** (Medium): Citation was corrected by referee (The cited lines (legacy/modulare/tests/deutsch.test.js:70-86) are assertions that check the LRS track behavior. They do not implement it. The behavior exists in the data and builder code, which the tests only verify. Implementation locations I checked: (1) legacy/modulare/content/deutsch/manifest.json:8-13 defines tracks.lrs with label 'LRS-Förderung'. (2) legac…
- **RULE-281** (Medium): Citation was corrected by referee (The behavior is implemented in legacy/modulare/core/js/views/result.js, not in the cited test. Line 19 sets title = r.failed ? 'Knapp daneben' : words.resultTitles[Math.max(0, r.stars - 1)], so a failed lesson round shows 'Knapp daneben' and a lesson round picks resultTitles by star level (3 stars gives index 2, i.e. 'C'). Line 13 sets title = r.score >= 10 ? wo…

## Rules folded into another

These rules described the same behavior as another rule in a different place, so they were merged into it (the kept rule lists their locations under "Also cited"):

- Exterior angle = sum of the two numbers in the prompt (legacy/modulare/apps/geometrie/builders.js:204-207 (generator: a, b drawn at line 205; answer num(a…) into Außenwinkel im Dreieck
- Basiswinkel und Spitzenwinkel im gleichschenkligen Dreieck (apps/geometrie/builders.js:123-127) into Base angle of an isosceles triangle = (180° − apex angle) ÷ 2
- Winkelsumme im Dreieck: dritter Winkel (apps/geometrie/builders.js:117-121) into Missing triangle angle = 180° minus the two given angles
- Tree/shadow problem answer equals the distance stated in the prompt (legacy/modulare/apps/geometrie/builders.js:185-188) into Höhe eines Baumes bei 45° Peilwinkel
- Thales task: second acute angle = 90° − α (legacy/modulare/apps/geometrie/builders.js:136-139) into Thaleskreis: rechter Winkel bei C und Restwinkel
- Dreisatz: direkte und umgekehrte Proportionalität (legacy/modulare/apps/mathe/builders.js:171-181) into Dreisatz: proportional und antiproportional
- Zinseszins (apps/mathe/builders.js:163-168) into Zinseszins: Endkapital nach mehreren Jahren
- Sterne aus Genauigkeit einer Runde (legacy/modulare/core/js/profile.js:76) into Stars are awarded from the accuracy of a finished round
- Refresh bonus: 10 XP for repeating a starred unit after three days (core/js/rounds.js:19-25 (bonus and refresh flag), with the due test at core/js/profile.js:79-82 and…) into Abschluss einer Lektionsrunde: Tag, Genauigkeit und Auffrischen-Bonus
- Niveau und Titel aus Gesamt-XP (core/js/profile.js:28-35) into Level-Schwelle aus gesammelten XP
- XP gutschreiben und Niveau-Aufstieg melden (core/js/profile.js:53-65) into XP-Gutschrift: Profil, App, Tagesziel und Level-Aufstieg
- Fortschritt einer App: Seiten mit mindestens einem Stern (legacy/modulare/dashboard.js:19 (doneUnits: counts stars > 0) and legacy/modulare/dashboard.js:51 (…) into Unit completion and per-app progress percentage
- Sammelkarten-Stufe folgt der Sternzahl (core/js/views/home.js:34-39) into Collection album card tier from stars
- Legacy localStorage hand-over (one-time) (core/js/db.js:53-61) into Altstand aus localStorage wird in IndexedDB übernommen
- Aufgabenpools entstehen erst mit init() (apps/geometrie/builders.js:7-23) into Initialisation: round content is bound once, before the first round
- Initialisierung der Aufgabenpools vor der ersten Runde (apps/deutsch/builders.js:19-24) into Initialisation: round content is bound once, before the first round
- End boss is locked until the learner opens it, and the start page lists every page (legacy/modulare/core/js/views/home.js:24 (unit list with data-id) and legacy/modulare/core/js/views…) into Endgegner wird freigeschaltet, wenn alle Seiten einen Stern haben
- Maßstab-Bild: Wirklichkeit in Meter, mit Komma (apps/geometrie/diagrams.js:91-99) into Maßstab: Umrechnung zwischen Zeichnung und Wirklichkeit
- Scale problems: real length, drawing length and scale ratio are computed from each other (tests/geometrie.test.js:61-72) into Maßstab: Umrechnung zwischen Zeichnung und Wirklichkeit
- Lamp row diagram (sum of lit lamps) (apps/informatik/diagrams.js:29-42) into Count the lit lamps (sum of place values)
- Monatszinsen (Anlage über einen Teil des Jahres) (apps/mathe/builders.js:157-161) into Zinsrechnung: Jahreszins, Monatszins
- Stored progress is merged over defaults (new fields need no migration) (core/js/store.js:10-16) into Stored data keeps unknown fields, gains new default fields, and migrates on version bump
- Without IndexedDB or localStorage the store keeps working in memory (tests/db.test.js:77-84) into Storage backend selection with fallback
- Offline-Cache: nach Erfolg speichern, offline ausliefern (core/js/content.js:50-67) into Offline-Zwischenspeicher fuer API-Inhalte
- HTTP-Inhaltsquelle: Erreichbarkeit und Pruefung (core/js/content.js:34-44) into HTTP-Quelle holt und prüft das Paket
- Export of full progress as a dated JSON file (core/js/views/backup.js:4-11) into Backup export contains all saved data and events; import restores it and rejects foreign data
- Backup restore validation and merge (core/js/db.js:126-133) into Backup export contains all saved data and events; import restores it and rejects foreign data
- Zweiter Versuch: falsche Antwort kommt am Ende noch einmal (core/js/quiz.js:104 (Anzeige .retry-tag), core/js/quiz.js:113-131 (settle: Wiederholung, Warteschla…) into Second attempt: re-ask a wrong question at the end of the round
- Auswahlfrage: richtige Antwort plus drei falsche (apps/mathe/builders.js:306-312) into Antwortauswahl: richtige Antwort plus drei falsche, Reihenfolge gemischt
- Drei verschiedene falsche Antworten, sonst neu würfeln (apps/mathe/builders.js:323-329) into Distraktor-Generator: mindestens drei verschiedene falsche Antworten
- Endgegner: zwölf Fragen über alle Seiten im Kreis (apps/mathe/builders.js:343-346) into Endgegner-Runde: 12 Fragen, Seiten im festen Wechsel
- Übungsrunde einer Seite: acht Fragen, zwei davon eintippen (apps/mathe/builders.js:332-338) into Eingabefragen-Plätze in der Übungsrunde
- Mischung der Aufgabenvorlagen je Seite (apps/mathe/builders.js:292-302) into Aufgabenmix pro Seite: Gewichtung der Erzeuger
- Schnellrunde und Blitz: zufällige Seite, nur Auswahl (apps/mathe/builders.js:340-342) into Random question pick across all pages for the quick round and the blitz
- Streak counting with one grace day (tests/rounds.test.js:67-70) into Serie: Folgetag, Gnadentag, Neustart und Verfall
- App identity 'vorlage' fixes the content folder and saved-data key (apps/_template/main.js:4-5) into App-Kennung für den gespeicherten Fortschritt
- Geometry app identifier is the stored-data key (apps/geometrie/main.js:4) into App-Kennung für den gespeicherten Fortschritt
- Kennung der Lern-App (apps/informatik/main.js:4) into App-Kennung für den gespeicherten Fortschritt
- Track assignment: only defined track keys produce a label (core/js/tracks.js:5-9) into Learning-track label appears on LRS pages only
- Abbildungs-Verweis und statische Quelle (core/js/appconfig.js:16-21; core/js/content.js:12-28) into Abbildung einer Lektion aufloesen
- Jede Seite braucht eine vollstaendige Lektion (core/js/validate.js:31-37) into A lesson must contain all required parts, and its mini-check must be well formed
- App-Konfiguration erfüllt den App-Vertrag (tests/helpers.js:10-39) into Every app configuration has a valid id, unique unit and badge ids, complete fields, and a lesson pe…
- Materialpfade muessen relativ und ungefaehrlich sein (core/js/validate.js:8) into Materiallinks nur als sichere relative Pfade
- Mini-check answer is graded by exact id match (core/js/lesson.js:58-61,70) into Choice question: check gate and grading
- Eingabe vereinheitlichen für Zahlenantworten (apps/informatik/numbers.js:66-71) into Antwortprüfung durch Vergleich nach Normalisierung
- Einheiten und Leerzeichen werden vor der Zahlprüfung entfernt (core/js/mathkit.js:13-15) into Eintipp-Prüfung für numerische Antworten
- Anzahl der Aufgaben pro Übungsrunde (apps/informatik/theory.js:143) into Round size and sequence (lesson, quick and boss rounds)
- Typed answer check: exact, accent-tolerant or wrong (core/js/qtypes.js:37-43) into Typed answer is graded exact, 'almost' if only accents differ, otherwise wrong
- Schreibweise der Eingabe prüfen (richtig, fast richtig, falsch) (legacy/modulare/apps/franzoesisch-verben/builders.js:34-41) into Typed verb answers: pronoun prefix and case ignored, missing accent is 'almost', wrong letters are…
- Wahrscheinlichkeit: Bruch, Dezimalzahl und Prozent sind gleichwertig (core/js/mathkit.js:38-44) into Wahrscheinlichkeitsantwort: Bruch, Dezimalzahl oder Prozent
