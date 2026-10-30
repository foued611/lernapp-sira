// Umschalter für Hell und Dunkel. Ohne Wahl folgt die Seite dem System, die Tokens regeln das über data-theme.
// Die Browser-Aufrufe kommen von main.js über setThemePorts, wie in sicherung.js.
import { createElement, useState } from 'react';
import { readTheme, saveTheme } from '../speicher/index.js';
import { Icon } from '../komponenten/icons.js';

const h = createElement;

const ports = { apply: () => {}, systemTheme: () => 'light', read: readTheme, save: saveTheme };

export function setThemePorts(next) {
  Object.assign(ports, next);
}

/** Das Schema, das gerade gilt. */
export const currentTheme = () => ports.read() ?? ports.systemTheme();

/** Beim Start: eine frühere Wahl anwenden. Ohne Wahl bleibt data-theme frei und das System entscheidet. */
export function applySavedTheme() {
  const saved = ports.read();
  if (saved) ports.apply(saved);
}

/** Wechselt das Schema, wendet es an und merkt es. Gibt das neue Schema zurück. */
export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  ports.apply(next);
  ports.save(next);
  return next;
}

/** Schalter mit gleichbleibendem Namen. Der Zustand steht in aria-pressed, das Icon zeigt das Ziel. */
export function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  const dark = theme === 'dark';
  return h(
    'button',
    {
      type: 'button',
      className: 'x theme-toggle',
      'aria-label': 'Dunkler Modus',
      'aria-pressed': dark,
      title: dark ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln',
      onClick: () => setTheme(toggleTheme())
    },
    h(Icon, { name: dark ? 'sun' : 'moon' })
  );
}
