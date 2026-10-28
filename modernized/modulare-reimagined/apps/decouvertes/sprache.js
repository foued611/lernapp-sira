// Sprachausgabe für beide Bücher der Französisch-Werkstatt. Optional: ohne Browser-Unterstützung fehlt nur der Knopf.
import { createElement } from 'react';
import { Icon } from '../../komponenten/icons.js';

const h = createElement;

export const canSpeak = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

/** Liest einen französischen Text vor. Fehler bleiben folgenlos, die Seite funktioniert ohne Sprachausgabe. */
export function speak(text) {
  try {
    if (!canSpeak()) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    /* Sprachausgabe nicht verfügbar: nichts tun. */
  }
}

export function SpeakButton({ text }) {
  if (!canSpeak()) return null;
  return h(
    'button',
    { type: 'button', className: 'say', 'aria-label': 'Vorlesen', onClick: () => speak(text) },
    h(Icon, { name: 'say' })
  );
}


