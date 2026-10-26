// Übungsrunde als Zustandsmaschine ohne DOM, ohne Speicher, ohne Math.random und ohne Uhr.
// Herkunft: legacy/modulare/core/js/quiz.js (Ablauf), qtypes.js (Prüfung). Abweichungen stehen bei der jeweiligen Zeile.
// Zustand: 'ask' (Frage offen), 'feedback' (Antwort gegeben, wartet auf next), 'done' (Ergebnis da), 'left' (verlassen, kein Ergebnis).
import { shuffle } from '../../helfer/index.js';
import { roundAccuracy, comboMultiplier } from '../../regeln/index.js';
import { HEARTS, XP, OUTCOMES, PEEK_XP } from './rules.js';
import { compareTyped } from './check.js';
import { normalise } from './text.js';

const KINDS = new Set(['choice', 'type', 'match']);

const refused = (reason) => ({ accepted: false, outcome: null, events: [], reason });

const checkIndex = (value, length, name) => {
  if (!Number.isInteger(value) || value < 0 || value >= length) {
    throw new RangeError(`${name} liegt außerhalb der Liste: ${value}`);
  }
};

/**
 * Eine Runde aus einem Fragenpool. Der Pool ist nur Daten, die Apps liefern (siehe questions.js).
 * @param {object} o
 * @param {object[]} o.pool        Fragen aus choiceQuestion, typedQuestion oder matchQuestion
 * @param {number} o.size          Zahl der Fragen, die aus dem Pool gezogen werden (ohne Zurücklegen)
 * @param {()=>number} o.rng       Zufall in [0, 1), z. B. createRng(seed)
 * @param {boolean} [o.boss]       Endgegner: 3 Herzen, keine Wiederholung
 */
export function createRound({ pool, size, rng, boss = false }) {
  if (!Array.isArray(pool) || pool.length === 0) throw new TypeError('pool braucht mindestens eine Frage');
  if (!Number.isInteger(size) || size < 1 || size > pool.length) {
    throw new RangeError(`size muss zwischen 1 und ${pool.length} liegen: ${size}`);
  }
  if (typeof rng !== 'function') throw new TypeError('rng ist Pflicht, z. B. createRng(seed)');
  pool.forEach((q) => {
    if (!q || !KINDS.has(q.kind)) throw new TypeError(`Unbekannter Fragetyp im Pool: ${q && q.kind}`);
  });

  // Die Runde arbeitet auf Kopien. Der Pool des Aufrufers bleibt unverändert (quiz.js:69 arbeitet ebenso auf einer Kopie).
  const queue = shuffle(pool, rng).slice(0, size).map((q) => ({ ...q, retry: false }));
  const originalCount = queue.length;
  const maxHearts = boss ? HEARTS.boss : HEARTS.normal;

  const s = {
    status: 'ask', index: 0, outcome: null, hearts: maxHearts, combo: 0, bestCombo: 0, xp: 0,
    correct: 0, almost: 0, wrong: 0, relearned: 0, attempts: [], match: null, result: null, peeked: false
  };

  function startQuestion() {
    const q = queue[s.index];
    s.status = 'ask';
    s.outcome = null;
    s.match = q.kind === 'match' ? { doneLeft: [], doneRight: [], slips: 0 } : null;
  }

  // RULE-243: Eine falsche Antwort kommt am Ende der Runde noch einmal, mit neu gemischten Optionen (quiz.js:130).
  function retryCopy(q) {
    const copy = { ...q, retry: true };
    if (q.options) copy.options = shuffle(q.options, rng);
    return copy;
  }

  // Wertet eine beantwortete Frage aus. Gibt genau ein XP-Ereignis zurück (RULE-193).
  function settle(q, outcome, heartPaid) {
    s.attempts.push({ outcome, retry: q.retry });
    let amount = 0;
    let multiplier = 1;

    if (q.retry) {
      // Zweiter Versuch: zählt nicht für Genauigkeit (RULE-067, quiz.js:113-121) und kostet kein Herz.
      // Richtig oder knapp bringt 5 XP fürs Dazulernen, falsch nichts.
      if (outcome !== 'bad') {
        amount = XP.retry;
        s.relearned++;
      }
    } else if (outcome === 'ok') {
      s.correct++;
      s.combo++;
      s.bestCombo = Math.max(s.bestCombo, s.combo);
      multiplier = comboMultiplier(s.combo);
      amount = XP.correct * multiplier;
    } else if (outcome === 'almost') {
      // Knapp richtig: 5 XP ohne Multiplikator. Die Combo bleibt stehen (quiz.js:125-126).
      s.almost++;
      amount = XP.almost;
    } else {
      s.wrong++;
      s.combo = 0;
      // Eine Zuordnung hat ihr Herz schon beim ersten Fehlgriff verloren (qtypes.js:177), hier nicht noch einmal.
      if (!heartPaid) s.hearts--;
      // Im Endgegner und bei Zuordnungen gibt es keine Wiederholung (quiz.js:129).
      // Die Wiederholung kommt nur, solange noch ein Herz übrig ist.
      if (!boss && q.kind !== 'match' && s.hearts > 0) queue.push(retryCopy(q));
    }

    s.xp += amount;
    s.outcome = outcome;
    s.status = 'feedback';
    return { accepted: true, outcome, events: [{ type: 'xp', amount, multiplier }] };
  }

  // Auswahl: nur die gewählte Option-id zählt, nicht ihr Text (RULE-166, qtypes.js:94).
  function gradeChoice(q, response) {
    if (response.pick === undefined || response.pick === null) return null;
    if (!q.options.some((o) => o.id === response.pick)) throw new RangeError(`Option gibt es nicht: ${response.pick}`);
    return response.pick === q.answer ? 'ok' : 'bad';
  }

  // Eingabe: leer ist keine Antwort (RULE-137, qtypes.js:115, 119). Sonst entscheidet check oder der Standardvergleich (RULE-151).
  function gradeTyped(q, response) {
    if (typeof response.text !== 'string') throw new TypeError('text muss ein String sein');
    if (normalise(response.text) === '') return null;
    // Eigene check-Funktion bekommt die Eingabe unverändert (qtypes.js:121). Sie umgeht RULE-137 bewusst.
    const outcome = q.check ? q.check(response.text) : compareTyped(response.text, q.answer);
    if (!OUTCOMES.has(outcome)) throw new TypeError(`check muss ok, almost oder bad liefern: ${outcome}`);
    return outcome;
  }

  // Zuordnung: ein Versuch je Aufruf (ein linker und ein rechter Eintrag). Das Ergebnis fällt erst am Ende.
  function submitMatch(q, response) {
    checkIndex(response.left, q.left.length, 'left');
    checkIndex(response.right, q.right.length, 'right');
    const m = s.match;
    if (m.doneLeft.includes(response.left) || m.doneRight.includes(response.right)) return refused('already-matched');

    if (q.leftValues[response.left] === q.right[response.right].value) {
      m.doneLeft.push(response.left);
      m.doneRight.push(response.right);
      if (m.doneLeft.length < q.left.length) return { accepted: true, outcome: null, events: [] };
      return settle(q, m.slips ? 'almost' : 'ok', false);
    }

    // Nur der erste Fehlgriff kostet ein Herz und setzt die Combo zurück (qtypes.js:175-177).
    m.slips++;
    if (m.slips === 1) {
      s.combo = 0;
      s.hearts--;
    }
    if (s.hearts <= 0) return settle(q, 'bad', true);
    return { accepted: true, outcome: null, events: [] };
  }

  function submit(response) {
    if (s.status === 'left' || s.status === 'done') return refused('closed');
    if (s.status !== 'ask') return refused('not-askable');
    const q = queue[s.index];
    if (q.kind === 'match') return submitMatch(q, response);
    const outcome = q.kind === 'choice' ? gradeChoice(q, response) : gradeTyped(q, response);
    if (outcome === null) return refused('no-answer');
    return settle(q, outcome, false);
  }

  function finish(failed) {
    s.status = 'done';
    s.result = {
      boss, failed, total: originalCount,
      accuracy: roundAccuracy(s.attempts, originalCount),
      correct: s.correct, almost: s.almost, wrong: s.wrong,
      bestCombo: s.bestCombo, xp: s.xp, relearned: s.relearned
    };
    return { done: true, result: s.result };
  }

  // Geht zur nächsten Frage. Nach dem letzten Herz (oder am Ende) kommt das Ergebnis.
  function next() {
    if (s.status !== 'feedback') return { done: false, result: null };
    if (s.outcome === 'bad' && s.hearts <= 0) return finish(true);
    s.index++;
    if (s.index >= queue.length) return finish(false);
    startQuestion();
    return { done: false, result: null };
  }

  // Verlassen: kein Ergebnis, aber die XP aus den bisherigen Antworten bleiben (RULE-193, blitz.js:67).
  // Spickzettel: der Hilfetext der Frage. Der Abzug fällt nur beim ersten Öffnen einer Runde an (quiz.js:168-173).
  function peek() {
    if (s.status !== 'ask') return refused('not-askable');
    if (!queue[s.index].help) return refused('no-help');
    if (!s.peeked) {
      s.peeked = true;
      s.xp = Math.max(0, s.xp - PEEK_XP);
    }
    return { accepted: true, outcome: null, events: [], help: queue[s.index].help };
  }

  function leave() {
    if (s.status === 'ask' || s.status === 'feedback') s.status = 'left';
  }

  function current() {
    if (s.status === 'done' || s.status === 'left') return null;
    const q = queue[s.index];
    return {
      status: s.status,
      index: s.index,
      total: queue.length,
      question: q,
      retry: q.retry,
      outcome: s.outcome,
      hearts: s.hearts,
      maxHearts,
      combo: s.combo,
      xp: s.xp,
      matched: s.match ? { left: [...s.match.doneLeft], right: [...s.match.doneRight] } : null,
      peeked: s.peeked
    };
  }

  startQuestion();

  return {
    current,
    submit,
    next,
    leave,
    peek,
    status: () => s.status,
    result: () => s.result
  };
}
