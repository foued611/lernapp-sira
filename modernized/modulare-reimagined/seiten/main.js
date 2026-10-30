// Einstieg der Seiten. Hier ist die einzige Stelle mit Browser-Zugriff: die Mount-Stelle #app, die
// Adresse und der Datei-Download. Laden in boot.js, Ansichten in startseite.js und rahmen.js (keine Logik hier).
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { bootSeiten } from './boot.js';
import { loadLogic, loadStyle } from '../apps/index.js';
import { Seiten } from './startseite.js';
import { setBrowserPorts } from './sicherung.js';
import { setAddressPorts } from './adresse.js';
import { applySavedTheme, setThemePorts } from './thema.js';
// Design wie in Legacy (legacy/modulare/core/styles). Eine Quelle für alle Ansichten, siehe seiten/design/README.md.
import './design/styles/app.css';
import './design/styles/dashboard.css';

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

// Ports für die Adresse. Die Scrollposition setzt die Ansicht selbst, deshalb nicht der Browser.
window.history.scrollRestoration = 'manual';
setAddressPorts({
  push: (search) => window.history.pushState(null, '', search),
  replace: (search) => window.history.replaceState(null, '', search),
  onBack: (listener) => {
    const handler = () => listener(window.location.search);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  },
  scrollTop: () => window.scrollTo(0, 0),
  root: () => document
});

// Logik und Optik einer App kommen zusammen, erst wenn sie geöffnet wird.
const openApp = async (id) => (await Promise.all([loadLogic(id), loadStyle(id)]))[0];

// Vor dem ersten Zeichnen, damit die Seite nicht im falschen Schema aufblitzt.
setThemePorts({
  apply: (theme) => { document.documentElement.dataset.theme = theme; },
  systemTheme: () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
});
applySavedTheme();

bootSeiten({ search: window.location.search, loadLogic: openApp }).then((boot) => {
  createRoot(document.getElementById('app')).render(h(Seiten, { boot }));
});
