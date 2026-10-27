# Design

Die Stylesheets und Schriften hier sind eine Kopie aus `legacy/modulare/core/styles` und `legacy/modulare/dashboard.css` (Stand 88e3d74). Ziel: Der Neubau sieht genauso aus wie die Legacy-App (Paritäts-Vorgabe, `analysis/modulare/PARITAET.md`).

- `styles/tokens.css`: Farben und Schriften, hell und dunkel.
- `styles/base.css`, `quiz.css`, `lesson.css`, `dashboard.css`: Bausteine. Die Klassen aus den Legacy-Ansichten bleiben erhalten, die React-Ansichten nutzen dieselben Namen.
- `fonts/`: selbst gehostete Schriften mit Lizenzen (SIL OFL). Keine Abrufe bei Drittanbietern.

Änderungen am Aussehen gehören hierher und werden mit dem Legacy-Stand verglichen. Keine festen Farben in den Ansichten.
