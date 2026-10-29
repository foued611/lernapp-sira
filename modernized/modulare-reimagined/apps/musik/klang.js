// Klangbeispiele der Musik-Werkstatt, rein und ohne Browser. Die Partituren liegen in content/musik/data.json unter "klang".
// Ein Beispiel: { id, label, hint, bpm, tracks: [{ voice, gain?, swing?, events: [[Beat, Dauer, Tonhöhe, Lautstärke], ...] }] }.
// Beat und Dauer zählen in Vierteln. Tonhöhe ist eine MIDI-Zahl (69 ist a′ mit 440 Hertz, Kommazahlen sind erlaubt),
// bei Schlagzeug-Stimmen ohne Bedeutung. Lautstärke liegt zwischen 0 und 1.
// Das Abspielen selbst steht in klang-audio.js. Hier wird nur geplant und geprüft (kein Math.random, keine Uhr).

/** Stimmen, die klang-audio.js kennt. */
export const VOICES = Object.freeze([
  'sine', 'tri', 'saw', 'square', 'pluck', 'cembalo', 'organ', 'flute', 'voice', 'pad', 'strings', 'brass', 'bell', 'gitarre', 'bass',
  'kick', 'snare', 'hat', 'wood'
]);

/** Längste erlaubte Dauer eines Beispiels in Sekunden. Lange Beispiele sind auf dem Handy mühsam und belasten den Browser. */
export const MAX_SECONDS = 40;
/** Obergrenze für die Zahl der Ereignisse, damit ein Beispiel den Browser nicht überfordert. */
export const MAX_EVENTS = 600;

let KLANG = {};

/** Bekommt das Datenpaket der App, bevor die erste Seite entsteht. Ohne "klang" gibt es keine Beispiele. */
export function initKlang(data) {
  KLANG = data && data.klang && typeof data.klang === 'object' ? data.klang : {};
}

/** Beispiele einer Seite, sonst eine leere Liste. */
export const klangOf = (unitId) => (Object.hasOwn(KLANG, unitId) && Array.isArray(KLANG[unitId]) ? KLANG[unitId] : []);

/** Frequenz in Hertz zu einer MIDI-Zahl. 69 gleich 440 Hertz. */
export const midiToFreq = (midi) => 440 * 2 ** ((midi - 69) / 12);

/**
 * Zeitpunkt eines Beats in Sekunden. Swing verschiebt jeden Achtel nach dem Schlag (Beat .5) nach hinten:
 * 0 gleichmäßig, 1 Triolengefühl (der Achtel liegt bei zwei Dritteln des Schlags).
 */
export function beatSeconds(beat, bpm, swing = 0) {
  const frac = beat - Math.floor(beat);
  const shift = swing > 0 && Math.abs(frac - 0.5) < 1e-6 ? swing / 6 : 0;
  return ((beat + shift) * 60) / bpm;
}

/** Alle Töne eines Beispiels als Liste mit Zeit in Sekunden, nach Beginn sortiert. */
export function scheduleScore(score) {
  const out = [];
  for (const track of score.tracks) {
    const gain = typeof track.gain === 'number' ? track.gain : 1;
    for (const [beat, dur, pitch, vel] of track.events) {
      out.push({
        voice: track.voice,
        t: beatSeconds(beat, score.bpm, track.swing || 0),
        d: (dur * 60) / score.bpm,
        freq: midiToFreq(pitch),
        vel,
        gain
      });
    }
  }
  return out.sort((a, b) => a.t - b.t);
}

/** Gesamtdauer in Sekunden bis zum Ende des letzten Tons. */
export function scoreSeconds(score) {
  let end = 0;
  for (const e of scheduleScore(score)) end = Math.max(end, e.t + e.d);
  return end;
}

const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** Fehler als Texte. Leer heißt gültig. Jede Seite braucht mindestens ein Beispiel. */
export function validateKlang(klang, unitIds) {
  const errors = [];
  if (!klang || typeof klang !== 'object') return ['klang fehlt'];
  for (const id of unitIds) if (!Array.isArray(klang[id]) || klang[id].length === 0) errors.push(`${id}: kein Klangbeispiel`);
  for (const id of Object.keys(klang)) if (!unitIds.includes(id)) errors.push(`${id}: Seite gibt es nicht`);
  const seen = new Set();
  for (const [unitId, list] of Object.entries(klang)) {
    for (const s of list) {
      const where = `${unitId}/${s && s.id}`;
      if (!s || !isText(s.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) {
        errors.push(`${where}: ungültige Kennung`);
        continue;
      }
      if (seen.has(`${unitId}/${s.id}`)) errors.push(`${where}: Kennung doppelt`);
      seen.add(`${unitId}/${s.id}`);
      if (!isText(s.label)) errors.push(`${where}: Titel fehlt`);
      if (!isText(s.hint) || s.hint.length < 20) errors.push(`${where}: Hörhinweis fehlt oder ist zu kurz`);
      if (!isNum(s.bpm) || s.bpm < 30 || s.bpm > 240) errors.push(`${where}: Tempo außerhalb von 30 bis 240`);
      if (!Array.isArray(s.tracks) || s.tracks.length === 0) {
        errors.push(`${where}: keine Spur`);
        continue;
      }
      let count = 0;
      for (const track of s.tracks) {
        if (!VOICES.includes(track.voice)) errors.push(`${where}: unbekannte Stimme ${track.voice}`);
        if (track.gain !== undefined && !(isNum(track.gain) && track.gain > 0 && track.gain <= 1)) errors.push(`${where}: gain muss zwischen 0 und 1 liegen`);
        if (track.swing !== undefined && !(isNum(track.swing) && track.swing >= 0 && track.swing <= 1)) errors.push(`${where}: swing muss zwischen 0 und 1 liegen`);
        if (!Array.isArray(track.events) || track.events.length === 0) {
          errors.push(`${where}: Spur ohne Ereignisse`);
          continue;
        }
        for (const e of track.events) {
          count += 1;
          const ok = Array.isArray(e) && e.length === 4 && e.every(isNum) && e[0] >= 0 && e[1] > 0 && e[2] >= 0 && e[2] <= 127 && e[3] > 0 && e[3] <= 1;
          if (!ok) errors.push(`${where}: ungültiges Ereignis ${JSON.stringify(e)}`);
        }
      }
      if (count > MAX_EVENTS) errors.push(`${where}: mehr als ${MAX_EVENTS} Ereignisse`);
      if (errors.length === 0 && scoreSeconds(s) > MAX_SECONDS) errors.push(`${where}: länger als ${MAX_SECONDS} Sekunden`);
    }
  }
  return errors;
}
