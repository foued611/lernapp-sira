// Blitz ohne Uhr und ohne DOM: der Rechner bekommt now() und nextQuestion() von außen.
// Herkunft: legacy/modulare/core/js/blitz.js. Das Zeitlimit prüft die Oberfläche in der Legacy-App über ein Intervall
// (blitz.js:76-82). Hier steht dafür timeLeft() und over() bereit.
import { comboMultiplier } from '../../regeln/index.js';
import { BLITZ_SECONDS, XP } from './rules.js';

/**
 * @param {object} o
 * @param {()=>object} o.nextQuestion  liefert eine Auswahlfrage (kind 'choice')
 * @param {()=>number} o.now           Zeit in Millisekunden, injiziert
 * @param {number} [o.seconds]         Dauer, Standard 45 (blitz.js:16)
 */
export function createBlitz({ nextQuestion, now, seconds = BLITZ_SECONDS }) {
  if (typeof nextQuestion !== 'function') throw new TypeError('nextQuestion ist Pflicht');
  if (typeof now !== 'function') throw new TypeError('now ist Pflicht');
  if (!(seconds > 0)) throw new RangeError(`seconds muss positiv sein: ${seconds}`);

  const nextChoice = () => {
    const q = nextQuestion();
    // Der Blitz kennt nur Auswahlfragen (blitz.js:11).
    if (!q || q.kind !== 'choice') throw new TypeError('Der Blitz braucht Auswahlfragen (kind choice)');
    return q;
  };

  const deadline = now() + seconds * 1000; // blitz.js:18, t0 beim Start
  const b = { status: 'run', question: nextChoice(), score: 0, xp: 0, combo: 0, bestCombo: 0, result: null };

  const timeLeft = () => Math.max(0, deadline - now());
  const over = () => now() >= deadline;

  function current() {
    if (b.status !== 'run') return null;
    return {
      question: b.question, score: b.score, combo: b.combo, xp: b.xp,
      timeLeftMs: timeLeft(), over: over()
    };
  }

  // Ein Treffer bringt 5 XP mal Combo-Faktor. Ein Fehler setzt die Combo zurück und bringt nichts (blitz.js:41-49).
  // Die Frage wechselt sofort. Die Wartezeit von 280 oder 900 ms bleibt Sache der Oberfläche.
  function pick(optionId) {
    if (b.status !== 'run') return { accepted: false, outcome: null, events: [], reason: 'closed' };
    if (over()) return { accepted: false, outcome: null, events: [], reason: 'over' };
    const q = b.question;
    if (!q.options.some((o) => o.id === optionId)) throw new RangeError(`Option gibt es nicht: ${optionId}`);

    // Wie im Rundenmotor zählt nur die Option-id (RULE-166, blitz.js:35).
    const ok = optionId === q.answer;
    let amount = 0;
    let multiplier = 1;
    if (ok) {
      b.score++;
      b.combo++;
      b.bestCombo = Math.max(b.bestCombo, b.combo);
      multiplier = comboMultiplier(b.combo);
      amount = XP.blitzCorrect * multiplier;
    } else {
      b.combo = 0;
    }
    b.xp += amount;
    b.question = nextChoice();
    return {
      accepted: true, outcome: ok ? 'ok' : 'bad',
      events: [{ type: 'xp', amount, multiplier }],
      answered: { answer: q.answer, why: q.why }
    };
  }

  // Ergebnis erst nach Ablauf der Zeit. Vorher gibt es keins. Ein zweiter Aufruf liefert dasselbe Ergebnis.
  function finish() {
    if (b.status === 'done') return b.result;
    if (b.status !== 'run' || !over()) return null;
    b.status = 'done';
    b.result = { mode: 'blitz', score: b.score, xp: b.xp, bestCombo: b.bestCombo };
    return b.result;
  }

  // Verlassen: kein Ergebnis, die bisherige XP bleibt (RULE-193, blitz.js:67).
  function leave() {
    if (b.status === 'run') b.status = 'left';
  }

  return { current, pick, finish, leave, timeLeft, status: () => b.status };
}
