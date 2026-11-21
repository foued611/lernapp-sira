// Missionen der Python-Werkstatt: Aufgabe, Startcode, Musterlösung und die Prüfung von Siras Ergebnis.
// Die Missionen stehen als Daten in content/info-python/data.json (data.missions). Das Ziel wird nie von Hand gezeichnet,
// sondern aus der Musterlösung berechnet. So kann Ziel und Aufgabentext nicht auseinanderlaufen (ein Test prüft jede Lösung).
import { runProgram } from './python-mini.js';
import { compareDrawings } from './zeichnung.js';

/** Missionen einer Seite in Datenreihenfolge (leicht nach schwer ist die Reihenfolge im Inhalt). */
export const missionsOf = (data, unitId) => (data?.missions || []).filter((m) => m.unit === unitId);

const squash = (code) => String(code).replace(/\s+/g, '');
// Ein Pflichtwort wie for darf nicht in forward stecken: Wörter zählen nur als ganzes Wort, Rechnungen ohne Leerzeichen.
const contains = (code, part) => (/^[\p{L}_]+$/u.test(part)
  ? new RegExp(`(^|[^\\p{L}\\p{N}_])${part}($|[^\\p{L}\\p{N}_])`, 'u').test(code)
  : squash(code).includes(squash(part)));

/** Ergebnis der Musterlösung: Zeichnung und Ausgabe. */
export const targetOf = (mission) => runProgram(mission.solution);

/**
 * Prüft Siras Programm gegen eine Mission.
 * @param {object} mission
 * @param {string} code  Siras Quelltext
 * @param {object} [result]  Ergebnis von runProgram(code), falls schon vorhanden
 * @returns {{ ok: boolean, status: string, text: string }} status: ok, fehler, leer, ausgabe, fehlt, zuviel, regel
 */
export function checkMission(mission, code, result = runProgram(code)) {
  if (result.error) return { ok: false, status: 'fehler', text: 'Dein Programm hat noch einen Fehler. Lies die Meldung und verbessere die Zeile.' };
  const missing = (mission.must || []).filter((m) => !contains(code, m));
  if (mission.kind === 'print') {
    const want = mission.expect;
    const got = result.output;
    const same = want.length === got.length && want.every((line, i) => line === got[i]);
    if (!got.length) return { ok: false, status: 'leer', text: 'Es wurde noch nichts ausgegeben. Dafür brauchst du print(…).' };
    if (!same) return { ok: false, status: 'ausgabe', text: `Die Ausgabe stimmt noch nicht. Erwartet: ${want.join(' / ')}. Bekommen: ${got.join(' / ')}.` };
  } else {
    const verdict = compareDrawings(targetOf(mission), result);
    if (verdict.empty) return { ok: false, status: 'leer', text: 'Noch nichts gezeichnet. Die Schildkröte zeichnet nur, wenn der Stift unten ist.' };
    if (verdict.cover < 0.97) return { ok: false, status: 'fehlt', text: 'Es fehlt noch ein Stück vom Ziel (das gestrichelte Bild).' };
    if (!verdict.ok) return { ok: false, status: 'zuviel', text: 'Du hast etwas gezeichnet, das nicht zum Ziel gehört.' };
  }
  if (missing.length) return { ok: false, status: 'regel', text: `Das Bild stimmt. Die Aufgabe will aber, dass du es mit ${missing.join(' und ')} löst.` };
  return { ok: true, status: 'ok', text: 'Geschafft! Dein Programm macht genau das, was verlangt war.' };
}
