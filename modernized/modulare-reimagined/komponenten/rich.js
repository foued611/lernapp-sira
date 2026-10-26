// Lektionstexte dürfen eine kleine Auswahl an HTML-Tags enthalten (Redaktion, siehe AGENTS.md "HTML-Felder").
// Legacy setzt diese Felder roh ein (legacy/modulare/core/js/lesson.js:26-44). Hier wird nur eine feste Liste
// in React-Elemente übersetzt. Alles andere, auch <script> oder Tags mit Attributen, bleibt Text.
import { createElement, Fragment } from 'react';

const h = createElement;

const ALLOWED = new Set(['b', 'strong', 'i', 'em', 'p', 'ul', 'ol', 'li']);
const TAG_SPLIT = /(<\/?[a-zA-Z]+\s*\/?>)/;
const TAG_PIECE = /^<(\/?)([a-zA-Z]+)\s*\/?>$/;

/** Wandelt einen Text mit erlaubten Tags in React-Kinder. Unbekannte Tags werden als Text ausgegeben. */
export function richText(html) {
  const root = { tag: null, children: [] };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const close = () => {
    const frame = stack.pop();
    top().children.push(h(frame.tag, null, ...frame.children));
  };

  for (const piece of String(html ?? '').split(TAG_SPLIT)) {
    if (piece === '') continue;
    const match = TAG_PIECE.exec(piece);
    if (!match) {
      top().children.push(piece);
      continue;
    }
    const closing = match[1] === '/';
    const name = match[2].toLowerCase();
    if (name === 'br' && !closing) {
      top().children.push(h('br', null));
    } else if (ALLOWED.has(name) && !closing) {
      stack.push({ tag: name, children: [] });
    } else if (ALLOWED.has(name) && closing && top().tag === name) {
      close();
    } else {
      // Fremdes oder nicht passendes Tag: wörtlich als Text, React maskiert es.
      top().children.push(piece);
    }
  }
  // Offene Tags schließen, damit eine fehlende Endmarke die Seite nicht zerlegt.
  while (stack.length > 1) close();
  return h(Fragment, null, ...root.children);
}
