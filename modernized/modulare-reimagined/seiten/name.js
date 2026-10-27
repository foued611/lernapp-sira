// Name der Person: Eingabe, Speichern und Anzeige als Muster. Die Anzeige zeigt den Namen nie im Klartext
// (SEITE-MASKIERUNG). Eigenes Modul, damit Startseite und App-Seite denselben Weg nehmen, ohne sich gegenseitig zu importieren.

export const NAME_MAX = 20;
// Der Name wird nie im Klartext gezeigt. Nur dieses Muster steht im Markup (SEITE-MASKIERUNG).
export const MASK = '•••';
export const NO_STORAGE = 'Ohne Speicher wird nichts gespeichert. Dieser Stand gilt nur für diesen Versuch.';

export const maskName = (name) => (typeof name === 'string' && name.trim() !== '' ? MASK : '');
export const greetingOf = (name) => (maskName(name) ? `Hallo, ${MASK}!` : 'Hallo!');

/** Name aus dem Eingabefeld: ohne Rand-Leerzeichen, höchstens 20 Zeichen (legacy shell.js:121-122). */
export const nameFrom = (raw) => (typeof raw === 'string' ? raw.trim().slice(0, NAME_MAX) : '');

/** Speichert den Namen. Leer heißt: nichts tun, wie in der Legacy-App. */
export async function saveName(profileStore, raw) {
  const name = nameFrom(raw);
  if (!name) return { ok: false, skipped: true };
  if (!profileStore) return { ok: false, error: NO_STORAGE };
  profileStore.state.name = name;
  return profileStore.save();
}
