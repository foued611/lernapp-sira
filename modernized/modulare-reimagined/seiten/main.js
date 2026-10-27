// Einstieg der Seiten. Hier ist die einzige Stelle mit Browser-Zugriff: die Mount-Stelle #app, die
// Adresse und der Datei-Download. Laden in boot.js, Ansichten in startseite.js und rahmen.js (keine Logik hier).
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { bootSeiten } from './boot.js';
import { logicFor } from '../apps/index.js';
import { Seiten } from './startseite.js';
import { setBrowserPorts } from './sicherung.js';
// Design wie in Legacy (legacy/modulare/core/styles). Eine Quelle für alle Ansichten, siehe seiten/design/README.md.
import './design/styles/app.css';
import './design/styles/dashboard.css';
// Optik der Apps, die eigene Spielzeuge haben. Die Selektoren sind je App eindeutig.
import '../apps/fr-verben/app.css';
import '../apps/info-zahlen/app.css';

const h = createElement;

// Ports für die Sicherung: Datei speichern und Seite neu laden. Die Anzeige kennt nur diese Namen.
setBrowserPorts({
  saveFile: (text, fileName) => {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
  reloadPage: () => window.location.reload()
});

bootSeiten({ search: window.location.search, logicFor }).then((boot) => {
  createRoot(document.getElementById('app')).render(h(Seiten, { boot }));
});
