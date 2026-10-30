// Laufzeit-Modell des Cahier de Verbes. Hier steht KEIN Lernstoff: Verben, Sätze und Hinweise kommen aus
// content/decouvertes-2/ (manifest.json, data.json) und kommen über createModel() herein.
// Herkunft: legacy/modulare/apps/franzoesisch-verben/model.js. Erzeuger, Diagramme und Theorie bekommen
// das Modell als Parameter, es gibt keinen Stand im Modul. Dieses Modul enthält keinen Zufall.
//
// V     alle Verben, ergänzt um key, inf, irr und (bei regelmäßigen) ends und forms
// UNITS Seiten mit Verben (aus dem Manifest, die übrigen Seiten der App haben kein Verbmodell)
// SP    Beispielsätze je Seite mit aufgelöstem Verb
/** Baut das Modell aus dem Inhalts-Paket. */
export function createModel({ data, manifest }) {
  const GE = { er: data.endings.er, ir: data.endings.ir, re: data.endings.re };
  const V = JSON.parse(JSON.stringify(data.verbs));
  Object.entries(V).forEach(([key, v]) => {
    v.key = key;
    if (!v.inf) v.inf = key;
    if (v.forms) v.irr = true;
    else { v.ends = GE[v.group]; v.forms = v.ends.map((e) => v.stem + e); }
  });
  const RAW = data.sentences;
  const SP = Object.fromEntries(Object.entries(RAW).map(([k, rows]) => [k, rows.map((r, i) => ({ id: k + i, v: V[r[0]], p: r[1], fr: r[2], de: r[3] }))]));
  return {
    ER: GE.er, IR: GE.ir, RE: GE.re, GE, PRON: data.pron, PQV: data.pqv, V, RAW, SP, TRAP: data.traps, HINT: data.hints,
    UNITS: manifest.units.filter((unit) => unit.verbs)
  };
}
