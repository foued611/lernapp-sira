// Kleine, app-unabhängige Hilfsfunktionen.

export const $ = (selector, root = document) => root.querySelector(selector);

/** HTML-Sonderzeichen maskieren. Immer für Text verwenden, der nicht fest im Code steht. */
export const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const shuffle = (list) => {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** Eingabe für den Vergleich vereinheitlichen: Kleinbuchstaben, ein Apostroph, einfache Leerzeichen. */
export const norm = (text) => text.trim().toLowerCase().replace(/[’`´]/g, "'").replace(/\s+/g, ' ');

/** Akzente entfernen, um "fast richtig" zu erkennen (êtes und etes). */
export const stripAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
