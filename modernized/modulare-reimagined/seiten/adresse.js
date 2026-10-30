// Adresse einer App: ?app=<id>, auf einer Seite dazu &seite=<id>. Die Browser-Aufrufe kommen von main.js über
// setAddressPorts, wie in sicherung.js und thema.js. Ohne Ports bleibt alles still, so läuft die Ansicht auch in den Tests.
const ports = { push: () => {}, replace: () => {}, onBack: () => () => {}, scrollTop: () => {}, root: () => null };

export function setAddressPorts(next) {
  Object.assign(ports, next);
}

/** Adressteil für eine App und optional eine Seite. */
export function searchOf(appId, unitId = null) {
  const app = `?app=${encodeURIComponent(appId)}`;
  return unitId ? `${app}&seite=${encodeURIComponent(unitId)}` : app;
}

/** Die Seite aus dem Adressteil, sonst null. Ob es sie gibt, entscheidet die App. */
export const unitFromSearch = (search) => new URLSearchParams(search || '').get('seite');

export const pushAddress = (search) => ports.push(search);
export const replaceAddress = (search) => ports.replace(search);
/** Meldet die Zurück- und Vorwärts-Taste des Browsers. Gibt die Abmeldung zurück. */
export const onAddressBack = (listener) => ports.onBack(listener);
export const scrollToTop = () => ports.scrollTop();
export const pageRoot = () => ports.root();
