// Laufzeit-Modell des Cahier de Verbes. Hier steht KEIN Lernstoff: Verben, Sätze und Hinweise kommen aus
// content/fr-verben/ (manifest.json, data.json) und werden von init() eingetragen.
// Herkunft: legacy/modulare/apps/franzoesisch-verben/model.js. Die Objekte bleiben dieselben, damit Erzeuger,
// Diagramme und Theorie sie einfach importieren können. Dieses Modul enthält keinen Zufall.
//
// V     alle Verben, ergänzt um key, inf, irr und (bei regelmäßigen) ends und forms
// UNITS Seiten des Lernpfads (aus dem Manifest)
// SP    Beispielsätze je Seite mit aufgelöstem Verb
export const ER = [], IR = [], RE = [];
export const GE = { er: ER, ir: IR, re: RE };
export const PRON = [];
export const PQV = [];
export const V = {};
export const UNITS = [];
export const RAW = {};
export const SP = {};
export const TRAP = {};
export const HINT = {};

const replace = (target, source) => {
  if (Array.isArray(target)) target.splice(0, target.length, ...source);
  else { Object.keys(target).forEach((k) => delete target[k]); Object.assign(target, source); }
};

/** Füllt das Modell aus dem Inhalts-Paket. Darf mehrfach aufgerufen werden. */
export function init({ data, manifest }) {
  replace(ER, data.endings.er); replace(IR, data.endings.ir); replace(RE, data.endings.re);
  replace(PRON, data.pron); replace(PQV, data.pqv);
  replace(UNITS, manifest.units);
  replace(RAW, data.sentences); replace(TRAP, data.traps); replace(HINT, data.hints);
  replace(V, JSON.parse(JSON.stringify(data.verbs)));
  Object.entries(V).forEach(([key, v]) => {
    v.key = key;
    if (!v.inf) v.inf = key;
    if (v.forms) v.irr = true;
    else { v.ends = GE[v.group]; v.forms = v.ends.map((e) => v.stem + e); }
  });
  replace(SP, Object.fromEntries(Object.entries(RAW).map(([k, rows]) => [k, rows.map((r, i) => ({ id: k + i, v: V[r[0]], p: r[1], fr: r[2], de: r[3] }))])));
}
